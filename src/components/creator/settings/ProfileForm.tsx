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
import { IconLoader } from "@tabler/icons-react"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"

export function ProfileForm() {
    const t = useTranslations("CreatorSettingsPage.profile")
    const tShared = useTranslations("CreatorSettingsPage")
    const { creator, updateCreatorProfile } = useCreatorAuth()
    const [creatorName, setCreatorName] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (creator) {
            setCreatorName(creator.creatorName)
        }
    }, [creator])

    const handleSaveChanges = async () => {
        if (!creator || creatorName === creator.creatorName) return

        setLoading(true)
        try {
            const payload = { creatorName };
            console.log("Enviando datos de perfil:", payload);

            const response = await apiFetch("/api/auth/me", {
                method: "PUT",
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || tShared("saveError"))
            }

            const { data: updatedData } = await response.json()
            updateCreatorProfile(updatedData) // Actualizamos el contexto
            toast.success(tShared("saveSuccess"))
        } catch (error) {
            toast.error((error as Error).message)
            setCreatorName(creator.creatorName) // Revertimos en caso de error
        } finally {
            setLoading(false)
        }
    }

    if (!creator) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>
                    {t("subtitle")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="creatorName">{t("creatorNameLabel")}</Label>
                        <Input
                            id="creatorName"
                            value={creatorName}
                            onChange={(e) => setCreatorName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">{t("emailLabel")}</Label>
                        <Input id="email" type="email" value={creator.email} readOnly />
                    </div>
                </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button
                    onClick={handleSaveChanges}
                    disabled={loading || creatorName === creator.creatorName}
                >
                    {loading && <IconLoader className="mr-2 size-4 animate-spin" />}
                    {tShared("dmca.saveButton")}
                </Button>
            </CardFooter>
        </Card>
    )
}
