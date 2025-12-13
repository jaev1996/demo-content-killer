"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { IconX, IconLoader } from "@tabler/icons-react"
import { useCreatorAuth } from "@/contexts/creator-auth-context"
import { apiFetch } from "@/lib/api"
import { toast } from "sonner"

export function WhitelistForm() {
    const t = useTranslations("CreatorSettingsPage.whitelist")
    const tShared = useTranslations("CreatorSettingsPage") // Usaremos esto para claves compartidas
    const { creator, updateCreatorProfile } = useCreatorAuth()
    const [isAdding, setIsAdding] = useState(false)
    const [newDomain, setNewDomain] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    // La whitelist ahora se lee directamente del contexto
    const whitelist = creator?.whitelist || []

    const handleAddDomain = async (e: React.FormEvent) => {
        e.preventDefault()
        const domainToAdd = newDomain.trim()
        if (!domainToAdd || isAdding) return

        setIsAdding(true)
        try {
            const response = await apiFetch("/api/auth/me/whitelist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ domain: domainToAdd }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || tShared("saveError"))
            }

            const { data: updatedProfile } = await response.json()
            updateCreatorProfile(updatedProfile) // Actualizamos el perfil global
            toast.success(t("addSuccess"))
            setNewDomain("")
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setIsAdding(false)
        }
    }

    const handleRemoveDomain = async (domainToRemove: string) => {
        // Opcional: Deshabilitar el botón mientras se elimina para evitar clics dobles
        try {
            const response = await apiFetch(
                `/api/auth/me/whitelist/${encodeURIComponent(domainToRemove)}`,
                {
                    method: "DELETE",
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || tShared("saveError"))
            }

            const { data: updatedProfile } = await response.json()
            updateCreatorProfile(updatedProfile) // Actualizamos el perfil global
            toast.success(t("removeSuccess"))
        } catch (error) {
            toast.error((error as Error).message)
        }
    }

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-lg sm:text-xl">{t("title")}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">{t("subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto text-sm">{t("manageButton")}</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl">{t("modalTitle")}</DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm">{t("modalDescription")}</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddDomain} className="grid gap-4 py-4">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <Input
                                    id="newDomain"
                                    value={newDomain}
                                    onChange={(e) => setNewDomain(e.target.value)}
                                    placeholder={t("addDomainPlaceholder")}
                                    disabled={isAdding}
                                    className="text-sm flex-1"
                                />
                                <Button
                                    type="submit"
                                    disabled={isAdding}
                                    variant="outline"
                                    className="w-full sm:w-auto text-sm whitespace-nowrap"
                                >
                                    {isAdding && <IconLoader className="mr-2 size-4 animate-spin" />}
                                    {isAdding ? t("addingButton") : t("addButton")}
                                </Button>
                            </div>
                        </form>
                        <div className="flex flex-wrap gap-2">
                            {whitelist.length > 0 ? (
                                whitelist.map(domain => (
                                    <Badge key={domain} variant="secondary" className="p-2 text-xs sm:text-sm">
                                        <span className="break-all">{domain}</span>
                                        <button
                                            onClick={() => handleRemoveDomain(domain)}
                                            aria-label={t("removeAriaLabel", { domain })}
                                            className="ml-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            <IconX className="h-3 w-3 sm:h-4 sm:w-4 hover:text-destructive" />
                                        </button>
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-xs sm:text-sm text-muted-foreground text-center w-full py-4">{t("emptyList")}</p>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}
