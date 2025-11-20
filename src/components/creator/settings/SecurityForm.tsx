"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { z } from "zod"
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
import { Button } from "@/components/ui/button"
import { IconLoader } from "@tabler/icons-react"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"

export function SecurityForm() {
    const t = useTranslations("CreatorSettingsPage.security")
    const [loading, setLoading] = useState(false)
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const passwordSchema = z.object({
        newPassword: z.string().min(8, { message: t("validation.passwordLength") }),
        confirmPassword: z.string(),
    }).refine(data => data.newPassword === data.confirmPassword, {
        message: t("validation.passwordMismatch"),
        path: ["confirmPassword"],
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setPasswords(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            passwordSchema.parse(passwords)
            const response = await apiFetch("/api/auth/me/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || t("validation.updateError"))
            }
            toast.success(t("success"))
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.issues.forEach(err => toast.error(err.message))
            } else {
                toast.error((error as Error).message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("subtitle")}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-6 mb-6">
                    <div className="grid gap-2"><Label htmlFor="currentPassword">{t("currentPasswordLabel")}</Label><Input id="currentPassword" type="password" value={passwords.currentPassword} onChange={handleInputChange} required /></div>
                    <div className="grid gap-2"><Label htmlFor="newPassword">{t("newPasswordLabel")}</Label><Input id="newPassword" type="password" value={passwords.newPassword} onChange={handleInputChange} required /></div>
                    <div className="grid gap-2"><Label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</Label><Input id="confirmPassword" type="password" value={passwords.confirmPassword} onChange={handleInputChange} required /></div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" className="bg-red-600 hover:bg-red-700 border-0" disabled={loading}>{loading && <IconLoader className="mr-2 size-4 animate-spin" />}{loading ? t("updating") : t("updatePasswordButton")}</Button>
                </CardFooter>
            </form>
        </Card>
    )
}