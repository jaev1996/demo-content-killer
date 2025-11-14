"use client"

import { apiFetch } from "@/lib/api"
import { useTranslations } from "next-intl"
import { z } from "zod"
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
    const t = useTranslations("LoginPage")
    const { login } = useCreatorAuth() // <-- 2. Obtener la función de login del contexto
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    // Esquema de validación con Zod y mensajes internacionalizados
    const loginSchema = z.object({
        email: z.string().email({ message: t("validation.emailInvalid") }),
        password: z.string().min(8, { message: t("validation.passwordLength") }),
    })

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Validar los datos del formulario con Zod
            loginSchema.parse({ email, password })

            // 2. Si la validación es exitosa, proceder con la llamada a la API
            const response = await apiFetch("/api/auth/profiles/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || t("validation.invalidCredentials"))
            }

            const data = await response.json()

            // 3. Usar el contexto para gestionar el estado de autenticación
            login(data.data.profile, data.data.token)


            toast.success(t("welcomeBack"))

            // Redirigir al dashboard del creador
            router.push("/creator/dashboard")

        } catch (error) {
            if (error instanceof z.ZodError) {
                // Errores de validación de Zod
                error.issues.forEach((err) => {
                    toast.error(err.message)
                })
            } else {
                // Otros errores (API, red, etc.)
                const errorMessage = error instanceof Error ? error.message : t("validation.unknownError")
                toast.error(errorMessage)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>

            <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:grid-cols-5 relative">
                {/* Controles superiores para todos los tamaños de pantalla */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/" aria-label={t("homeAriaLabel")}>
                            <IconHome className="size-5" />
                        </Link>
                    </Button>
                </div>

                {/* Columna Izquierda: Formulario */}
                <div className="flex items-center justify-center py-12 min-h-screen lg:min-h-0 xl:col-span-2">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
                            <p className="text-balance text-muted-foreground">
                                {t("subtitle")}
                            </p>
                        </div>
                        <form onSubmit={handleLogin} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t("emailLabel")}</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("emailPlaceholder")} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">{t("passwordLabel")}</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("passwordPlaceholder")} required />
                            </div>
                            <Button type="submit" className="w-full bg-red-600 text-foreground hover:bg-red-700 transition-colors hover:scale-105 inline-block" disabled={loading}>
                                {loading && <IconLoader className="mr-2 size-4 animate-spin" />}
                                {loading ? t("loggingIn") : t("loginButton")}
                            </Button>
                        </form>
                        <div className="text-center text-sm">
                            {t("noAccount")}{" "}
                            <Link href="/register" className="underline">{t("registerLink")}</Link>
                        </div>
                    </div>
                </div>
                {/* Columna Derecha: Branding */}
                <div className="hidden bg-muted lg:block xl:col-span-3">
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Image src="/privaclean.svg" alt="PrivaClean Logo" width={120} height={120} className="mb-6" />
                        <blockquote className="space-y-2 max-w-md">
                            <p className="text-xl lg:text-2xl font-semibold text-foreground" dangerouslySetInnerHTML={{ __html: t.raw('quote') }}>
                            </p>
                            <footer className="text-sm text-muted-foreground">{t("quoteAuthor")}</footer>
                        </blockquote>
                    </div>
                </div>
            </div>
            <Toaster richColors position="top-center" />
        </>

    )
}
