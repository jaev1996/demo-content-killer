"use client"

import React, { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { IconLoader } from "@tabler/icons-react"
import { toast } from "sonner"
import { useCreatorAuth } from "@/contexts/creator-auth-context"
import { apiFetch } from "@/lib/api"

export function DmcaForm() {
    const t = useTranslations("CreatorSettingsPage.dmca")
    const tShared = useTranslations("CreatorSettingsPage")
    const { creator, updateCreatorProfile } = useCreatorAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        dmcaFullName: "",
        dmcaContactEmail: "",
        dmcaCountry: "",
        dmcaWorkDescription: "",
        dmcaSignature: "",
    })

    useEffect(() => {
        if (creator) {
            setFormData({
                dmcaFullName: creator.dmcaFullName || "",
                dmcaContactEmail: creator.dmcaContactEmail || "",
                dmcaCountry: creator.dmcaCountry || "",
                dmcaWorkDescription: creator.dmcaWorkDescription || "",
                dmcaSignature: creator.dmcaSignature || "",
            })
        }
    }, [creator])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Preparamos los datos para el envío, convirtiendo strings vacíos en null.
        const payload = {
            dmcaFullName: formData.dmcaFullName || null,
            dmcaContactEmail: formData.dmcaContactEmail || null,
            dmcaCountry: formData.dmcaCountry || null,
            dmcaWorkDescription: formData.dmcaWorkDescription || null,
            dmcaSignature: formData.dmcaSignature || null,
        }

        console.log("Enviando datos DMCA:", payload);

        try {
            const response = await apiFetch("/api/auth/me/dmca", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
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
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="dmcaFullName">{t("fullNameLabel")}</Label>
                            <Input id="dmcaFullName" value={formData.dmcaFullName} onChange={handleInputChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="dmcaContactEmail">{t("contactEmailLabel")}</Label>
                            <Input id="dmcaContactEmail" type="email" value={formData.dmcaContactEmail} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="dmcaWorkDescription">{t("workDescriptionLabel")}</Label>
                        <Textarea id="dmcaWorkDescription" value={formData.dmcaWorkDescription} onChange={handleInputChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid gap-2"><Label htmlFor="dmcaCountry">{t("countryLabel")}</Label><Input id="dmcaCountry" value={formData.dmcaCountry} onChange={handleInputChange} /></div>
                        <div className="grid gap-2"><Label htmlFor="dmcaSignature">{t("signatureLabel")}</Label><Input id="dmcaSignature" value={formData.dmcaSignature} onChange={handleInputChange} /></div>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={loading}>{loading && <IconLoader className="mr-2 size-4 animate-spin" />}{t("saveButton")}</Button>
                </CardFooter>
            </form>
        </Card>
    )
}