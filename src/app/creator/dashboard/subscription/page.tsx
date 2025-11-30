"use client"

import React, { useMemo, useState } from "react"
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
import { IconFileText, IconCheck } from "@tabler/icons-react"

// Stripe Price IDs
const STRIPE_PRICE_IDS = {
    PRO: 'price_1SWoyB2zbUB6qmZWA16KQSE0',
    BASIC: 'price_1SVhGO2zbUB6qmZWnfYx4ZiH'
};

// PLANS moved inside component to use translations

function CreatorSubscriptionPage() {
    const t = useTranslations("CreatorSubscriptionPage")
    const { creator, token, updateCreatorProfile } = useCreatorAuth()

    const PLANS = [
        {
            id: 'basic',
            name: t('plans.basic'),
            priceId: STRIPE_PRICE_IDS.BASIC,
            price: '$99',
            features: t.raw('availablePlans.features.basic') as string[]
        },
        {
            id: 'pro',
            name: t('plans.professional'),
            priceId: STRIPE_PRICE_IDS.PRO,
            price: '$249',
            features: t.raw('availablePlans.features.pro') as string[]
        }
    ];

    const [loading, setLoading] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);

    // Mock de datos para el historial de facturación
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

        const planName = creator.stripePriceId === STRIPE_PRICE_IDS.PRO ? "Plan Pro" : "Plan Basic"
        const planAmount = creator.stripePriceId === STRIPE_PRICE_IDS.PRO ? "$249" : "$99"

        const status = creator.stripeSubscriptionStatus || "active"
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

    const handleSubscribe = async (priceId: string) => {
        setLoading(true);
        try {
            const userToken = token || localStorage.getItem('creator_token');

            if (!userToken) {
                alert(t('alerts.noToken'));
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({ priceId }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('Error:', data.error);
                alert(t('alerts.paymentError'));
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert(t('alerts.connectionError'));
        } finally {
            setLoading(false);
        }
    }

    const handleCancelSubscription = async () => {
        setCancelLoading(true);
        try {
            const userToken = token || localStorage.getItem('creator_token');

            if (!userToken) {
                alert(t('alerts.noToken'));
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/cancel-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert(t('alerts.cancelSuccess'));
                setShowCancelConfirm(false);
                updateCreatorProfile({
                    stripeSubscriptionStatus: 'canceled',
                });
            } else {
                alert(data.error || t('alerts.cancelError'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert(t('alerts.connectionError'));
        } finally {
            setCancelLoading(false);
        }
    }

    const hasActiveSubscription = !!creator?.stripeSubscriptionId && creator?.stripeSubscriptionStatus === 'active';

    return (
        <div className="mx-auto grid w-full max-w-6xl gap-6">
            <div>
                <h1 className="text-3xl font-semibold">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>

            {/* Planes Disponibles */}
            {!hasActiveSubscription && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">{t('availablePlans.title')}</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        {PLANS.map((plan) => (
                            <Card key={plan.id}>
                                <CardHeader>
                                    <CardTitle>{plan.name}</CardTitle>
                                    <div className="text-3xl font-bold">{plan.price}<span className="text-sm font-normal text-muted-foreground">{t('per_month')}</span></div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <IconCheck className="size-4 text-green-500" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        onClick={() => handleSubscribe(plan.priceId)}
                                        disabled={loading}
                                    >
                                        {loading ? t('availablePlans.processing') : t('availablePlans.subscribe')}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

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
                            <Badge variant={planStatus === "active" ? "outline" : "destructive"}>
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
                        {hasActiveSubscription && !showCancelConfirm && (
                            <Button
                                variant="default"
                                className="w-full bg-accent hover:bg-accent/80 hover:text-accent-foreground hover:scale-105"
                                onClick={() => setShowCancelConfirm(true)}
                            >
                                {t('currentPlan.cancelButton')}
                            </Button>
                        )}
                        {showCancelConfirm && (
                            <div className="w-full space-y-2">
                                <p className="text-sm text-center">{t('currentPlan.confirmCancel')}</p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="default"
                                        className="flex-1 bg-accent hover:bg-accent/80 hover:text-accent-foreground"
                                        onClick={handleCancelSubscription}
                                        disabled={cancelLoading}
                                    >
                                        {cancelLoading ? t('currentPlan.canceling') : t('currentPlan.yesCancel')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setShowCancelConfirm(false)}
                                    >
                                        {t('currentPlan.noKeep')}
                                    </Button>
                                </div>
                            </div>
                        )}
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
