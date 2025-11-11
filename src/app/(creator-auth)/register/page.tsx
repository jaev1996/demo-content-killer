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
    CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from "sonner"
import { IconLoader, IconShield } from "@tabler/icons-react"

export default function RegisterPage() {
    const { login } = useCreatorAuth() // <-- 2. Obtener la función de login del contexto
    const router = useRouter()
    const [creatorName, setCreatorName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        if (!creatorName || !email || !password) {
            toast.error("Todos los campos son requeridos.")
            setLoading(false)
            return
        }

        try {
            const response = await apiFetch("/api/auth/profiles/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ creatorName, email, password }),
            })

            if (!response.ok) { // Status no es 201 o en el rango 200-299
                const errorData = await response.json()
                throw new Error(errorData.message || "No se pudo completar el registro.")
            }

            const data = await response.json()

            // 3. Usar el contexto para gestionar el estado de autenticación
            login(data.data.profile, data.data.token)

            toast.success(`¡Bienvenido, ${creatorName}! Registro completado.`)

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
                        <Link href="/creators/login">Iniciar Sesión</Link>
                    </Button>
                </div>
            </header>

            <main className="flex flex-1 items-center justify-center p-4">
                <Card className="w-full max-w-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Registro de Creador</CardTitle>
                        <CardDescription>Crea tu cuenta para empezar a proteger tu contenido.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleRegister}>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="creatorName">Nombre de Creador</Label>
                                <Input id="creatorName" type="text" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} placeholder="Tu nombre público" required />
                            </div>
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
                                {loading ? "Registrando..." : "Crear Cuenta"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </main>
        </div>
    )
}
