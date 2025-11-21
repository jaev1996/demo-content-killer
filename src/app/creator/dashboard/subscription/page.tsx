"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { withCreatorAuth } from "@/components/with-creator-auth"
import { useCreatorAuth } from "@/contexts/creator-auth-context"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconExternalLink, IconFileText, IconRefresh, IconSettings } from "@tabler/icons-react"
import Link from "next/link"

function CreatorSubscriptionPage() {
    const t = useTranslations("CreatorSubscriptionPage")
    const { creator } = useCreatorAuth()

    // Mock de datos para el historial de facturación. Esto vendría de tu API.
    const billingHistory = [
        { id: "inv_1", date: "2024-07-25", amount: 249.0, status: "paid", url: "#" },
        { id: "inv_2", date: "2024-06-25", amount: 249.0, status: "paid", url: "#" },
        { id: "inv_3_failed", date: "2024-05-25", amount: 249.0, status: "open", url: "#" },
        { id: "inv_4", date: "2024-04-25", amount: 249.0, status: "paid", url: "#" },
    ]

    const { planName, planStatus, nextBillingDate, planAmount } = useMemo(() => {
        if (!creator?.stripeSubscriptionId) {
            return {
                planName: t("plans.none"),
                planStatus: "inactive",
                nextBillingDate: "N/A",
                planAmount: "$0",
            }
        }

        // Lógica para determinar el nombre del plan basado en el precio o ID de Stripe
        const planName = creator.stripePriceId === "price_123professional" ? t("plans.professional") : t("plans.basic")
        const planAmount = creator.stripePriceId === "price_123professional" ? "$249" : "$99"

        const status = creator.stripeSubscriptionStatus || "inactive"
        const date = creator.stripeCurrentPeriodEnd
            ? new Date(creator.stripeCurrentPeriodEnd).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })
            : "N/A"

        return {
            planName,
            planStatus: status,
            nextBillingDate: date,
            planAmount,
        }
    }, [creator, t])

    const handleManageSubscription = async () => {
        // TODO: Implementar la llamada a la API para crear una sesión del portal de Stripe
        // y redirigir al usuario.
        // const response = await apiFetch("/api/stripe/create-portal-session");
        // const { url } = await response.json();
        // window.location.href = url;
        alert("Redirigiendo al portal de Stripe...")
    }

    return (
        <div className="mx-auto grid w-full max-w-6xl gap-6">
            <div>
                <h1 className="text-3xl font-semibold">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-5">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>{t("currentPlan.title")}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t("currentPlan.planLabel")}</span>
                            <span className="font-semibold">{planName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t("currentPlan.statusLabel")}</span>
                            <Badge variant={planStatus === "active" ? "secondary" : "destructive"}>
                                {t(`statuses.${planStatus}`)}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t("currentPlan.nextBillingLabel")}</span>
                            <span>{nextBillingDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t("currentPlan.amountLabel")}</span>
                            <span className="font-semibold">{planAmount} {t("per_month")}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button className="w-full" onClick={handleManageSubscription}>
                            <IconSettings className="mr-2 size-4" />
                            {t("manageButton")}
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/#pricing">
                                <IconRefresh className="mr-2 size-4" />
                                {t("changePlanButton")}
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle>{t("billingHistory.title")}</CardTitle>
                        <CardDescription>{t("billingHistory.subtitle")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("billingHistory.headers.date")}</TableHead>
                                    <TableHead>{t("billingHistory.headers.amount")}</TableHead>
                                    <TableHead>{t("billingHistory.headers.status")}</TableHead>
                                    <TableHead className="text-right">{t("billingHistory.headers.invoice")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {billingHistory.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell>{new Date(invoice.date).toLocaleDateString("es-ES")}</TableCell>
                                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant={invoice.status === "paid" ? "secondary" : "destructive"}>
                                                {t(`billingHistory.statuses.${invoice.status}`)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={invoice.url} target="_blank" rel="noopener noreferrer">
                                                    <IconFileText className="mr-2 size-4" />
                                                    {t("billingHistory.download")}
                                                </a>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default withCreatorAuth(CreatorSubscriptionPage)


