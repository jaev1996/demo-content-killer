"use client"

import { apiFetch } from "@/lib/api"
import React, { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
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
import { IconLoader, IconLock, IconUser } from "@tabler/icons-react"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"

export default function LoginPage() {
    const router = useRouter()
    const { login, user, isLoading } = useAuth()
    const [loginField, setLoginField] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isLoading && user) {
            router.replace("/dashboard")
        }
    }, [user, isLoading, router])

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await apiFetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: loginField, password }),
            })

            if (!response.ok) {
                let errorMessage = `Error: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || "Credenciales inválidas o error en el servidor."
                } catch { /* No body */ }
                throw new Error(errorMessage);
            }

            const data = await response.json()
            const { user: userData, token } = data

            toast.success(`¡Bienvenido al Panel de Control, ${userData.fullName}!`)
            login(userData, token)

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans relative overflow-hidden">
            <Toaster richColors position="top-center" />

            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

            <header className="fixed top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105 duration-300">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <Image
                                src="/privaclean.svg"
                                alt="PrivaClean Logo"
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-2xl font-black text-foreground tracking-tighter uppercase transition-colors">
                                Priva<span className="text-red-600">Clean</span>
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Admin Portal</span>
                        </div>
                    </Link>
                </div>
            </header>

            <main className="flex flex-1 items-center justify-center p-4 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <Card className="border-white/5 bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-800" />

                        <CardHeader className="space-y-4 pt-10 text-center">
                            <div className="mx-auto w-20 h-20 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-600/20 group transition-all duration-500 hover:rotate-6">
                                <Image
                                    src="/privaclean.svg"
                                    alt="PrivaClean Admin"
                                    width={50}
                                    height={50}
                                    className="object-contain drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                                />
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-3xl font-black tracking-tighter uppercase">
                                    Panel de <span className="text-red-600">Control</span>
                                </CardTitle>
                                <CardDescription className="text-base font-medium">
                                    Ingresa tus credenciales maestras para acceder al sistema de gestión global.
                                </CardDescription>
                            </div>
                        </CardHeader>

                        <form onSubmit={handleLogin}>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="login" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Usuario / Email</Label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-red-500">
                                            <IconUser size={18} />
                                        </div>
                                        <Input
                                            id="login"
                                            type="text"
                                            value={loginField}
                                            onChange={(e) => setLoginField(e.target.value)}
                                            placeholder="admin@privaclean.com"
                                            className="h-12 pl-10 bg-background/50 border-white/10 focus:border-red-600/50 transition-all rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Contraseña</Label>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-red-500">
                                            <IconLock size={18} />
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="h-12 pl-10 bg-background/50 border-white/10 focus:border-red-600/50 transition-all rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-4 pt-5 pb-5">
                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-red-600 hover:bg-red-700 text-lg font-black uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <IconLoader className="size-5 animate-spin" />
                                            <span>Verificando...</span>
                                        </div>
                                    ) : (
                                        "Acceder al Sistema"
                                    )}
                                </Button>
                                <Link
                                    href="/"
                                    className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest text-center"
                                >
                                    Volver al Inicio
                                </Link>
                            </CardFooter>
                        </form>
                    </Card>
                </motion.div>
            </main>

            <footer className="py-8 text-center bg-background/80 backdrop-blur-sm border-t border-white/5">
                <div className="container mx-auto px-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        © 2026 PrivaClean <br className="md:hidden" /> Management System. Secure Access Only.
                    </p>
                </div>
            </footer>
        </div>
    )
}
