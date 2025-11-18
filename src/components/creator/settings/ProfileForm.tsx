"use client"

import { useCreatorAuth } from "@/contexts/creator-auth-context"
import { useTranslations } from "next-intl"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfileForm() {
    const t = useTranslations("CreatorSettingsPage.profile")
    const { creator } = useCreatorAuth()

    if (!creator) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="creatorName">{t("creatorNameLabel")}</Label>
                        <Input
                            id="creatorName"
                            value={creator.creatorName}
                            readOnly
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">{t("emailLabel")}</Label>
                        <Input
                            id="email"
                            type="email"
                            value={creator.email}
                            readOnly
                        />
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}