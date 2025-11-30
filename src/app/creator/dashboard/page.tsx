"use client"

import React, { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useCreatorAuth } from "@/contexts/creator-auth-context"
import { withCreatorAuth } from "@/components/with-creator-auth"
import { apiFetch } from "@/lib/api"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    IconUserCircle,
    IconTrash,
    IconActivity,
    IconSearch,
    IconCreditCard,
    IconLoader2
} from "@tabler/icons-react"
import { ActivityChart } from "@/components/dashboard/activity-chart"

function CreatorDashboardPage() {
    const { creator } = useCreatorAuth()
    const [loadingPortal, setLoadingPortal] = useState(false);
    const t = useTranslations("CreatorDashboard")

    // El HOC `withCreatorAuth` asegura que `creator` no será nulo aquí.
    // Usamos el operador "!" para indicarle a TypeScript que estamos seguros de ello.
    const creatorName = creator!.creatorName

    // Usamos useMemo para evitar recalcular en cada render
    const { subscriptionStatus, nextBillingDate, subscriptionPlan } = useMemo(() => {
        const STRIPE_PRICE_IDS = {
            PRO: 'price_1SWoyB2zbUB6qmZWA16KQSE0',
            BASIC: 'price_1SVhGO2zbUB6qmZWnfYx4ZiH'
        };

        const isActive = creator!.stripeSubscriptionId && creator!.stripeSubscriptionStatus === 'active';

        let status = "Inactiva";
        if (isActive) status = "Activa";
        else if (creator!.stripeSubscriptionStatus === 'canceled') status = "Cancelada";

        let plan = "Ninguno";
        if (creator!.stripePriceId === STRIPE_PRICE_IDS.PRO) plan = "Plan Pro";
        else if (creator!.stripePriceId === STRIPE_PRICE_IDS.BASIC) plan = "Plan Basic";

        const date = creator!.stripeCurrentPeriodEnd
            ? new Date(creator!.stripeCurrentPeriodEnd).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })
            : "N/A"
        return { subscriptionStatus: status, nextBillingDate: date, subscriptionPlan: plan }
    }, [creator])

    // TODO: Estos serían datos traídos de la API, gestionados por un admin
    const stats = {
        totalRemoved: 124,
        successRate: 98.5,
        activeSearches: 15,
    }

    const handleManageSubscription = async () => {
        setLoadingPortal(true);
        try {
            const response = await apiFetch('/api/stripe/create-portal-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    configurationId: 'bpc_1SYFi32zbUB6qmZWo312cM3O'
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    console.error('No URL returned');
                    alert('Error al redirigir al portal de facturación.');
                }
            } else {
                console.error('Error creating portal session');
                alert('Error al acceder al portal de facturación.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión.');
        } finally {
            setLoadingPortal(false);
        }
    };

    return (
        <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4 md:gap-6">
            {/* Header Section - Responsive */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* TODO: Reemplazar con un Avatar si el creador sube foto */}
                    <IconUserCircle className="size-10 sm:size-12 text-muted-foreground flex-shrink-0" />
                    <div className="grid gap-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate">
                            {t('welcome', { name: creatorName })}
                        </h1>
                        <p className="text-sm text-muted-foreground hidden sm:block">
                            {t('welcomeSubtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('kpis.totalRemoved')}
                        </CardTitle>
                        <IconTrash className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRemoved}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('kpis.totalRemovedDesc')}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('kpis.successRate')}
                        </CardTitle>
                        <IconActivity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.successRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            {t('kpis.successRateDesc')}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('kpis.activeSearches')}
                        </CardTitle>
                        <IconSearch className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeSearches}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('kpis.activeSearchesDesc')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Activity & Subscription Section - Responsive Grid */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-7">
                {/* Activity Chart - Full width on mobile, 4/7 on large screens */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">{t('activity.title')}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            {t('activity.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-6 pb-4">
                        <div className="h-[250px] sm:h-[300px] md:h-[350px] w-full">
                            <ActivityChart />
                        </div>
                    </CardContent>
                </Card>

                {/* Subscription Card - Full width on mobile, 3/7 on large screens */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">{t('subscription.title')}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            {t('subscription.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t('subscription.plan')}</span>
                            <span className="text-sm font-bold truncate ml-2">{subscriptionPlan}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t('subscription.status')}</span>
                            <Badge variant={subscriptionStatus === "Activa" ? "default" : "destructive"}>
                                {subscriptionStatus}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t('subscription.nextBilling')}</span>
                            <span className="text-xs sm:text-sm text-muted-foreground text-right ml-2">
                                {nextBillingDate}
                            </span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            className="w-full mt-2 sm:mt-4"
                            onClick={handleManageSubscription}
                            disabled={loadingPortal}
                        >
                            {loadingPortal ? (
                                <>
                                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span className="text-sm">{t('subscription.loading')}</span>
                                </>
                            ) : (
                                <>
                                    <IconCreditCard className="mr-2 h-4 w-4" />
                                    <span className="text-sm">{t('subscription.manage')}</span>
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

// Envolvemos la página con el HOC para protegerla
export default withCreatorAuth(CreatorDashboardPage)
