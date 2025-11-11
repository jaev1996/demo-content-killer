"use client"

import { apiFetch } from "@/lib/api"
import { useCreatorAuth } from "@/contexts/creator-auth-context" // <-- 1. Importar el hook
import React, { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from "sonner"
import { IconLoader, IconShield } from "@tabler/icons-react"

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
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Toaster richColors />
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center">
                        <IconShield className="text-primary size-8" />
                        <span className="ml-2 text-2xl font-bold text-foreground">ContentGuard</span>
                    </Link>
                    <Button asChild variant="ghost">
                        <Link href="/register">Crear una cuenta</Link>
                    </Button>
                </div>
            </header>

            <main className="flex flex-1 items-center justify-center p-4">
                <Card className="w-full max-w-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Acceso Creadores</CardTitle>
                        <CardDescription>Ingresa a tu panel para gestionar tu protección.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <IconLoader className="mr-2 size-4 animate-spin" />}
                                {loading ? "Ingresando..." : "Iniciar Sesión"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </main>
        </div>
    )
}
