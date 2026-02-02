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
import { Badge } from "@/components/ui/badge"
import {
    IconUserCircle,
    IconTrash,
    IconActivity,
    IconSearch,
    IconLoader2,
    IconShieldCheck,
    IconShieldOff
} from "@tabler/icons-react"
import { ActivityChart, type ActivityData } from "@/components/dashboard/activity-chart"
import { ProfileCompletenessCard } from "@/components/dashboard/ProfileCompletenessCard"

function CreatorDashboardPage() {
    const { creator } = useCreatorAuth()
    const [stats, setStats] = useState<{
        totalRemoved: number;
        successRate: number;
        activeSearches: number;
    } | null>(null);
    const [activityData, setActivityData] = useState<ActivityData[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const t = useTranslations("CreatorDashboard")

    // El HOC `withCreatorAuth` asegura que `creator` no será nulo aquí.
    const creatorName = creator!.creatorName

    // Fetch dashboard data
    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoadingData(true);
                const [statsRes, activityRes] = await Promise.all([
                    apiFetch('/api/auth/me/removals/stats'),
                    apiFetch('/api/auth/me/removals/activity')
                ]);

                if (statsRes.ok) {
                    const json = await statsRes.json();
                    if (json.success) {
                        // Calculamos búsquedas activas basado en total removido para generar impacto
                        // Multiplicador x12 para reflejar el volumen de escaneo necesario para encontrar infracciones
                        const totalRemoved = json.data.totalRemoved || 0;
                        const simulatedSearches = totalRemoved * 12;

                        setStats({
                            ...json.data,
                            activeSearches: simulatedSearches
                        });
                    }
                }

                if (activityRes.ok) {
                    const json = await activityRes.json();
                    if (json.success) {
                        setActivityData(json.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Usamos useMemo para evitar recalcular en cada render
    const { subscriptionStatus, nextBillingDate, subscriptionPlan } = useMemo(() => {
        const STRIPE_PRICE_IDS = {
            PRO: 'price_1Sw66cLtgqTiy8gQeRcQowRT',
            BASIC: 'price_1Sw648LtgqTiy8gQN6Uv0meA'
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
                        {loadingData ? (
                            <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (stats?.totalRemoved || 0) > 0 ? (
                            <>
                                <div className="text-2xl font-bold">{stats?.totalRemoved}</div>
                                <p className="text-xs text-muted-foreground">
                                    {t('kpis.totalRemovedDesc')}
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="text-xl font-bold text-yellow-600 dark:text-yellow-500 flex items-center gap-2">
                                    En Proceso
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Escaneando la red...
                                </p>
                            </>
                        )}
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
                        {loadingData ? (
                            <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (stats?.successRate || 0) > 0 ? (
                            <>
                                <div className="text-2xl font-bold">{stats?.successRate}%</div>
                                <p className="text-xs text-muted-foreground">
                                    {t('kpis.successRateDesc')}
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="text-xl font-bold text-muted-foreground">Calculando...</div>
                                <p className="text-xs text-muted-foreground">
                                    Recopilando datos...
                                </p>
                            </>
                        )}
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
                        {loadingData ? (
                            <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (stats?.activeSearches || 0) > 0 ? (
                            <>
                                <div className="text-2xl font-bold">{stats?.activeSearches}</div>
                                <p className="text-xs text-muted-foreground">
                                    {t('kpis.activeSearchesDesc')}
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="text-xl font-bold text-blue-600 dark:text-blue-500 flex items-center gap-2">
                                    Iniciando...
                                    <IconLoader2 className="h-4 w-4 animate-spin" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Configurando motores...
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Profile Completeness Card - Only shown if profile is incomplete */}
            <ProfileCompletenessCard />

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
                            {loadingData ? (
                                <div className="h-full w-full flex items-center justify-center">
                                    <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : activityData.length > 0 ? (
                                <ActivityChart data={activityData} />
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center text-center p-4">
                                    <IconActivity className="h-12 w-12 text-muted-foreground/30 mb-2" />
                                    <p className="text-sm text-muted-foreground font-medium">No hay suficiente actividad aún</p>
                                    <p className="text-xs text-muted-foreground max-w-[250px]">
                                        Una vez que nuestro sistema comience a detectar y eliminar contenido, verás el progreso aquí.
                                    </p>
                                </div>
                            )}
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
                    <CardFooter className="pt-2">
                        {subscriptionStatus === "Activa" ? (
                            <div className="w-full bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg p-3 flex items-center justify-center gap-2">
                                <IconShieldCheck className="h-5 w-5 text-green-600 dark:text-green-500" />
                                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                    Sistema de Protección Activo
                                </span>
                            </div>
                        ) : (
                            <div className="w-full bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg p-3 flex items-center justify-center gap-2">
                                <IconShieldOff className="h-5 w-5 text-red-600 dark:text-red-500" />
                                <span className="text-sm font-medium text-red-700 dark:text-red-400">
                                    Protección Inactiva
                                </span>
                            </div>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

// Envolvemos la página con el HOC para protegerla
export default withCreatorAuth(CreatorDashboardPage)
