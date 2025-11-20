"use client"

import { withCreatorAuth } from "@/components/with-creator-auth"
import { useTranslations } from "next-intl"
import { Toaster } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ProfileForm } from "@/components/creator/settings/ProfileForm"
import { SecurityForm } from "@/components/creator/settings/SecurityForm"
import { DmcaForm } from "@/components/creator/settings/DmcaForm"
import { WhitelistForm } from "@/components/creator/settings/WhitelistForm"

function SettingsPage() {
    const t = useTranslations("CreatorSettingsPage")

    return (
        <>
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <div>
                    <h1 className="text-3xl font-semibold">{t("title")}</h1>
                    <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
                </div>
            </div>

            <Tabs defaultValue="profile" className="mx-auto w-full max-w-6xl">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">{t("profile.title")} & {t("security.title")}</TabsTrigger>
                    <TabsTrigger value="dmca">{t("dmca.title")}</TabsTrigger>
                    <TabsTrigger value="whitelist">{t("whitelist.title")}</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                        <ProfileForm />
                        <SecurityForm />
                    </div>
                </TabsContent>
                <TabsContent value="dmca">
                    <DmcaForm />
                </TabsContent>
                <TabsContent value="whitelist">
                    <WhitelistForm />
                </TabsContent>
            </Tabs>

            <Toaster richColors position="top-center" />
        </>
    )
}

export default withCreatorAuth(SettingsPage)