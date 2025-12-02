"use client"

import { apiFetch } from "@/lib/api"
import { useTranslations } from "next-intl"
import { z } from "zod"
import { useCreatorAuth } from "@/contexts/creator-auth-context" // <-- 1. Importar el hook
import React, { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Toaster, toast } from "sonner"
import { IconHome, IconLoader } from "@tabler/icons-react"
import { ThemeToggle } from "@/components/theme-toggle"
import LanguageSwitcher from "@/components/LanguageSwitcher"


export default function RegisterPage() {
    const t = useTranslations("RegisterPage")
    const { login } = useCreatorAuth() // <-- 2. Obtener la función de login del contexto
    const router = useRouter()
    const [creatorName, setCreatorName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [acceptPolicies, setAcceptPolicies] = useState(false)
    const [loading, setLoading] = useState(false)

    // Helper para calcular la fortaleza de la contraseña
    const calculatePasswordStrength = (pwd: string) => {
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^A-Za-z0-9]/.test(pwd)) strength++;
        return strength;
    };

    // Esquema de validación con Zod y mensajes internacionalizados
    const registerSchema = z
        .object({
            creatorName: z.string().min(3, { message: t("validation.creatorNameLength") }),
            email: z.string().email({ message: t("validation.emailInvalid") }),
            password: z.string()
                .min(8, { message: t("validation.passwordLength") })
                .regex(/[A-Z]/, { message: "Debe contener al menos una mayúscula" })
                .regex(/[0-9]/, { message: "Debe contener al menos un número" })
                .regex(/[^A-Za-z0-9]/, { message: "Debe contener al menos un carácter especial" }),
            confirmPassword: z.string().min(8, { message: t("validation.passwordLength") }),
            acceptPolicies: z.literal(true, { message: t("validation.acceptPolicies") }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("validation.passwordMismatch"),
            path: ["confirmPassword"], // Asigna el error al campo de confirmación
        })

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Validar los datos del formulario con Zod
            registerSchema.parse({ creatorName, email, password, confirmPassword, acceptPolicies })


            // 2. Si la validación es exitosa, proceder con la llamada a la API
            const response = await apiFetch("/api/auth/profiles/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ creatorName, email, password }),
            })

            if (!response.ok) { // Status no es 201 o en el rango 200-299
                const errorData = await response.json()
                throw new Error(errorData.message || t("validation.registerError"))

            }

            const data = await response.json()

            // 3. Usar el contexto para gestionar el estado de autenticación
            login(data.data.profile, data.data.token)
            toast.success(t("welcomeMessage", { name: creatorName }))


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
                            <p className="text-balance text-muted-foreground">{t("subtitle")}</p>
                        </div>
                        <form onSubmit={handleRegister} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="creatorName">{t("creatorNameLabel")}</Label>
                                <Input id="creatorName" type="text" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} placeholder={t("creatorNamePlaceholder")} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t("emailLabel")}</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("emailPlaceholder")} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">{t("passwordLabel")}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    placeholder={t("passwordPlaceholder")}
                                    required
                                />
                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="space-y-1">
                                        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                                            <div
                                                className={`h-full transition-all duration-300 ${calculatePasswordStrength(password) <= 1 ? 'bg-red-500 w-1/4' :
                                                    calculatePasswordStrength(password) === 2 ? 'bg-orange-500 w-2/4' :
                                                        calculatePasswordStrength(password) === 3 ? 'bg-yellow-500 w-3/4' :
                                                            'bg-green-500 w-full'
                                                    }`}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground text-right">
                                            {calculatePasswordStrength(password) <= 1 ? 'Débil' :
                                                calculatePasswordStrength(password) === 2 ? 'Regular' :
                                                    calculatePasswordStrength(password) === 3 ? 'Buena' :
                                                        'Fuerte'}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</Label>
                                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("passwordPlaceholder")} required />
                            </div>
                            <Button type="submit" className="w-full bg-red-600 text-foreground hover:bg-red-700 transition-colors hover:scale-105" disabled={loading}>
                                {loading && <IconLoader className="mr-2 size-4 animate-spin inline-block" />}
                                {loading ? t("registering") : t("registerButton")}
                            </Button>
                        </form>
                        <div className="text-center text-sm">
                            <div className="items-top flex space-x-2 mb-4">
                                <Checkbox id="terms" checked={acceptPolicies} onCheckedChange={(checked) => setAcceptPolicies(checked as boolean)} />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {t.rich("acceptPolicies", {
                                            terms: (chunks) => <Link href="/terms" className="underline">{chunks}</Link>,
                                            privacy: (chunks) => <Link href="/privacy" className="underline">{chunks}</Link>,
                                        })}
                                    </label>
                                </div>
                            </div>
                            {t("alreadyAccount")}{" "}
                            <Link href="/creators/login" className="underline">{t("loginLink")}</Link>
                        </div>
                    </div>
                </div>
                {/* Columna Derecha: Branding (idéntica a la de login) */}
                <div className="hidden bg-muted lg:block xl:col-span-3">
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Image src="/privaclean.svg" alt="PrivaClean Logo" width={120} height={120} className="mb-6" />
                        <blockquote className="space-y-2 max-w-md">
                            <p className="text-xl lg:text-2xl font-semibold text-foreground" dangerouslySetInnerHTML={{ __html: t.raw('quote') }}></p>
                            <footer className="text-sm text-muted-foreground">{t("quoteAuthor")}</footer>
                        </blockquote>
                    </div>
                </div>
            </div >
            <Toaster richColors position="top-center" />
        </>

    )
}
