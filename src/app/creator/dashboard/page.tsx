"use client"

import React, { useMemo, useState } from "react"
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
    IconShieldCheck,
    IconLink,
    IconZoomCheck,
    IconSettings,
} from "@tabler/icons-react"
import { ActivityChart } from "@/components/dashboard/activity-chart"

function CreatorDashboardPage() {
    const { creator } = useCreatorAuth()
    const [loadingPortal, setLoadingPortal] = useState(false);
    //const t = useTranslations("CreatorDashboard") // TODO: Agregar traducciones

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
    const kpis = {
        totalLinksRemoved: 124,
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
        <div className="mx-auto grid w-full flex-1 auto-rows-max gap-6">
            <div className="flex items-center gap-4">
                {/* TODO: Reemplazar con un Avatar si el creador sube foto */}
                <IconUserCircle className="size-12 text-muted-foreground" />
                <div className="grid gap-1">
                    <h1 className="text-2xl font-semibold">
                        ¡Bienvenido, {creatorName}!
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Aquí tienes un resumen de la protección de tu contenido.
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        Ver Reporte Completo
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Eliminado</CardTitle>
                        <IconLink className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpis.totalLinksRemoved}</div>
                        <p className="text-xs text-muted-foreground">enlaces eliminados con éxito</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
                        <IconShieldCheck className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpis.successRate}%</div>
                        <p className="text-xs text-muted-foreground">de los enlaces reportados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Búsquedas Activas</CardTitle>
                        <IconZoomCheck className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{kpis.activeSearches}</div>
                        <p className="text-xs text-muted-foreground">plataformas monitoreadas 24/7</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Actividad de Eliminaciones</CardTitle>
                        <CardDescription>Enlaces encontrados vs. eliminados en los últimos 30 días.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* TODO: Implementar un componente de gráfico de barras aquí */}
                        <div className="h-[350px] w-full">
                            <ActivityChart />
                        </div>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Suscripción</CardTitle>
                        <CardDescription>
                            Estado actual de tu plan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Plan</span>
                            <span className="font-semibold">{subscriptionPlan}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Estado</span>
                            <Badge variant={subscriptionStatus === "Activa" ? "secondary" : "destructive"}>
                                {subscriptionStatus}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Próximo cobro</span>
                            <span>{nextBillingDate}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={handleManageSubscription}
                            disabled={loadingPortal}
                        >
                            <IconSettings className="mr-2 size-4" />
                            {loadingPortal ? "Cargando..." : "Gestionar Suscripción"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

// Envolvemos la página con el HOC para protegerla
export default withCreatorAuth(CreatorDashboardPage)
