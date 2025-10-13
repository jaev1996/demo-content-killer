"use client"

import { apiFetch } from "@/lib/api"
import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from "sonner"
import { IconLoader, IconShield } from "@tabler/icons-react"

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        const token = localStorage.getItem("authToken")
        if (token) {
            router.replace("/dashboard")
        }
    }, [router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await apiFetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })

            if (!response.ok) {
                let errorMessage = `Error: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || "Credenciales inválidas o error en el servidor.";
                } catch (e) { /* No hay cuerpo JSON, usar el mensaje de estado */ }
                throw new Error(errorMessage);
            }

            const data = await response.json()
            const userData = data.user
            const token = userData.token

            localStorage.setItem("authToken", token)
            toast.success(`¡Bienvenido, ${userData.fullName}!`)

            setTimeout(() => {
                router.push("/dashboard")
            }, 1000)

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Ocurrió un error.")
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
                </div>
            </header>

            <main className="flex flex-1 items-center justify-center p-4">
                <Card className="w-full max-w-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Acceso Administradores</CardTitle>
                        <CardDescription>Ingresa tus credenciales para acceder al panel de gestión.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Usuario</Label>
                                <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="nombre.usuario" required />
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

            <footer className="bg-card text-muted-foreground">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                    <p>© 2024 ContentGuard. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    )
}
