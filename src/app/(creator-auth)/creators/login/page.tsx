"use client"

import { apiFetch } from "@/lib/api"
import { useCreatorAuth } from "@/contexts/creator-auth-context" // <-- 1. Importar el hook
import React, { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image" // <-- 1. Importar el componente Image
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from "sonner"
import { IconHome, IconLoader } from "@tabler/icons-react" // <-- 1. Importar IconHome
import { ThemeToggle } from "@/components/theme-toggle"
import LanguageSwitcher from "@/components/LanguageSwitcher" // <-- 2. Importar LanguageSwitcher

export default function CreatorLoginPage() {
    const { login } = useCreatorAuth() // <-- 2. Obtener la función de login del contexto
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await apiFetch("/api/auth/profiles/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Credenciales inválidas.")
            }

            const data = await response.json()

            // 3. Usar el contexto para gestionar el estado de autenticación
            login(data.data.profile, data.data.token)


            toast.success(`¡Bienvenido de nuevo!`)

            // Redirigir al dashboard del creador
            router.push("/creator/dashboard")

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido."
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>

            <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:grid-cols-5">
                {/* Columna Izquierda: Formulario */}
                <div className="flex items-center justify-center py-12 xl:col-span-2">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold tracking-tight">Acceso Creadores</h1>
                            <p className="text-balance text-muted-foreground">
                                Ingresa a tu panel para gestionar tu protección.
                            </p>
                        </div>
                        <form onSubmit={handleLogin} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                            </div>
                            <Button type="submit" className="w-full bg-red-600 text-foreground hover:bg-red-700 transition-colors hover:scale-105 inline-block" disabled={loading}>
                                {loading && <IconLoader className="mr-2 size-4 animate-spin" />}
                                {loading ? "Ingresando..." : "Iniciar Sesión"}
                            </Button>
                        </form>
                        <div className="text-center text-sm">
                            ¿No tienes una cuenta?{" "}
                            <Link href="/register" className="underline">Regístrate</Link>
                        </div>
                    </div>
                </div>
                {/* Columna Derecha: Branding */}
                <div className="hidden bg-muted lg:flex flex-col justify-between p-4 xl:col-span-3">
                    <div className="self-end flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeToggle />
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/" aria-label="Volver a la página de inicio">
                                <IconHome className="size-5" />
                            </Link>
                        </Button>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <Image src="/privaclean.svg" alt="PrivaClean Logo" width={80} height={80} className="mb-6" />
                        <blockquote className="space-y-2 max-w-md">
                            <p className="text-xl lg:text-2xl font-semibold text-foreground">
                                &ldquo;Enfócate en crear, nosotros nos encargamos de la protección. Tu tranquilidad es nuestra misión.&rdquo;
                            </p>
                            <footer className="text-sm text-muted-foreground">Equipo de PrivaClean</footer>
                        </blockquote>
                    </div>
                    <div /> {/* Div vacío para empujar el contenido con justify-between */}
                </div>
            </div>
            <Toaster richColors position="top-center" />
        </>

    )
}
