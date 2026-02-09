"use client"

import React, { useState, useEffect } from "react"
import { useCreatorAuth } from "@/contexts/creator-auth-context"
import { useTranslations } from "next-intl"
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
import { IconLoader, IconHelpCircle } from "@tabler/icons-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"

export function ProfileForm() {
    const t = useTranslations("CreatorSettingsPage.profile")
    const tShared = useTranslations("CreatorSettingsPage")
    const { creator, updateCreatorProfile, login } = useCreatorAuth()
    const [creatorName, setCreatorName] = useState("")
    const [email, setEmail] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (creator) {
            setCreatorName(creator.creatorName)
            setEmail(creator.email)
        }
    }, [creator])

    const hasChanges = creator ? creatorName !== creator.creatorName || email !== creator.email : false

    const handleSaveChanges = async () => {
        if (!creator || !hasChanges || !currentPassword) return

        setLoading(true)
        try {
            const payload: { creatorName?: string; newEmail?: string; currentPassword?: string } = {
                currentPassword: currentPassword,
            };

            if (creatorName !== creator.creatorName) {
                payload.creatorName = creatorName;
            }
            if (email !== creator.email) {
                payload.newEmail = email;
            }

            console.log("Enviando datos de perfil:", payload);

            const response = await apiFetch("/api/auth/me/change-email", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(responseData.message || tShared("saveError"))
            }

            if (responseData.data?.token && responseData.data?.userProfile) {
                // Si se cambió el email, la API devuelve nuevo token. Actualizamos todo.
                login(responseData.data.userProfile, responseData.data.token)
            } else {
                // Si solo se cambió el creatorName, actualizamos solo el perfil local.
                updateCreatorProfile({ ...creator, creatorName })
            }

            toast.success(tShared("saveSuccess"))
            setCurrentPassword("") // Limpiamos la contraseña después de un guardado exitoso
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    if (!creator) return null

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-lg sm:text-xl">{t("title")}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    {t("subtitle")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="grid gap-2">
                        <Label htmlFor="creatorName" className="text-sm flex items-center gap-1">
                            {t("creatorNameLabel")}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <IconHelpCircle className="size-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t("creatorNameHelp")}</p>
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input
                            id="creatorName"
                            value={creatorName}
                            onChange={(e) => setCreatorName(e.target.value)}
                            className="text-sm"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm">{t("emailLabel")}</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-sm"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="currentPassword" className="text-sm">{t("currentPasswordLabel")}</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="text-sm"
                        />
                        <p className="text-[0.75rem] sm:text-[0.8rem] text-muted-foreground">{t("passwordHelpText")}</p>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="border-t px-4 sm:px-6 py-3 sm:py-4">
                <Button
                    onClick={handleSaveChanges}
                    disabled={loading || !hasChanges || !currentPassword}
                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm"
                >
                    {loading && <IconLoader className="mr-2 size-4 animate-spin" />}
                    {tShared("dmca.saveButton")}
                </Button>
            </CardFooter>
        </Card>
    )
}
