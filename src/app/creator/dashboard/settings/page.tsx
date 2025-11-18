"use client"

import { withCreatorAuth } from "@/components/with-creator-auth"
import { useTranslations } from "next-intl"
import { Toaster } from "sonner"

import { ProfileForm } from "@/components/creator/settings/ProfileForm"
import { SecurityForm } from "@/components/creator/settings/SecurityForm"
// TODO: Implementar y descomentar los siguientes formularios
// import { DmcaForm } from "@/components/creator/settings/DmcaForm"
// import { WhitelistForm } from "@/components/creator/settings/WhitelistForm"

function SettingsPage() {
    const t = useTranslations("CreatorSettingsPage")

    return (
        <div className="mx-auto grid w-full max-w-6xl gap-6">
            <div className="grid gap-2">
                <h1 className="text-3xl font-semibold">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>

            <div className="grid gap-6">
                <ProfileForm />
                <SecurityForm />
                {/* TODO: Aquí irían los formularios de DMCA y Whitelist */}
            </div>
            <Toaster richColors position="top-center" />
        </div>
    )
}

export default withCreatorAuth(SettingsPage)