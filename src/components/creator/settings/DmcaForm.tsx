"use client"

import React, { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { IconLoader } from "@tabler/icons-react"
import { toast } from "sonner"
import { useCreatorAuth } from "@/contexts/creator-auth-context"
import { apiFetch } from "@/lib/api"
import { CountrySelect } from "@/components/ui/country-select"

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

    const handleCountryChange = (value: string) => {
        setFormData(prev => ({ ...prev, dmcaCountry: value }))
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
            <CardHeader className="space-y-1">
                <CardTitle className="text-lg sm:text-xl">{t("title")}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">{t("subtitle")}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="dmcaFullName" className="text-sm">{t("fullNameLabel")}</Label>
                            <Input
                                id="dmcaFullName"
                                value={formData.dmcaFullName}
                                onChange={handleInputChange}
                                className="text-sm"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="dmcaContactEmail" className="text-sm">{t("contactEmailLabel")}</Label>
                            <Input
                                id="dmcaContactEmail"
                                type="email"
                                value={formData.dmcaContactEmail}
                                onChange={handleInputChange}
                                className="text-sm"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="dmcaWorkDescription" className="text-sm">{t("workDescriptionLabel")}</Label>
                        <Textarea
                            id="dmcaWorkDescription"
                            value={formData.dmcaWorkDescription}
                            onChange={handleInputChange}
                            className="text-sm min-h-[100px]"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="dmcaCountry" className="text-sm">{t("countryLabel")}</Label>
                            <CountrySelect
                                value={formData.dmcaCountry}
                                onValueChange={handleCountryChange}
                                placeholder="Selecciona un país"
                                className="text-sm"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="dmcaSignature" className="text-sm">{t("signatureLabel")}</Label>
                            <Input
                                id="dmcaSignature"
                                value={formData.dmcaSignature}
                                onChange={handleInputChange}
                                className="text-sm"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-4 sm:px-6 py-3 sm:py-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 border-0 w-full sm:w-auto text-sm"
                    >
                        {loading && <IconLoader className="mr-2 size-4 animate-spin" />}
                        {t("saveButton")}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}