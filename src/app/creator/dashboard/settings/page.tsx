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
            {/* Header */}
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold">{t("title")}</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t("subtitle")}</p>
                </div>
            </div>

            {/* Tabs - Responsive */}
            <Tabs defaultValue="profile" className="mx-auto w-full max-w-6xl">
                {/* TabsList con scroll horizontal en móvil */}
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                    <TabsList className="grid w-full grid-cols-3 min-w-[500px] sm:min-w-0">
                        <TabsTrigger value="profile" className="text-xs sm:text-sm">
                            <span className="hidden sm:inline">{t("profile.title")} & {t("security.title")}</span>
                            <span className="sm:hidden">Perfil</span>
                        </TabsTrigger>
                        <TabsTrigger value="dmca" className="text-xs sm:text-sm">
                            {t("dmca.title")}
                        </TabsTrigger>
                        <TabsTrigger value="whitelist" className="text-xs sm:text-sm">
                            {t("whitelist.title")}
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Profile & Security Tab */}
                <TabsContent value="profile">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4">
                        <ProfileForm />
                        <SecurityForm />
                    </div>
                </TabsContent>

                {/* DMCA Tab */}
                <TabsContent value="dmca">
                    <DmcaForm />
                </TabsContent>

                {/* Whitelist Tab */}
                <TabsContent value="whitelist">
                    <WhitelistForm />
                </TabsContent>
            </Tabs>

            <Toaster richColors position="top-center" />
        </>
    )
}

export default withCreatorAuth(SettingsPage)