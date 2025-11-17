"use client"

import React, { useMemo } from "react"
import { useCreatorAuth } from "@/contexts/creator-auth-context"
import { withCreatorAuth } from "@/components/with-creator-auth"
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
    IconSettings,
    IconLogout,
    IconShieldCheck,
    IconLink,
    IconZoomCheck,
} from "@tabler/icons-react"
import { useTranslations } from "next-intl"

function CreatorDashboardPage() {
    const { creator, logout } = useCreatorAuth()
    //const t = useTranslations("CreatorDashboard") // TODO: Agregar traducciones

    // El HOC `withCreatorAuth` asegura que `creator` no será nulo aquí.
    // Usamos el operador "!" para indicarle a TypeScript que estamos seguros de ello.
    const creatorName = creator!.creatorName

    // Usamos useMemo para evitar recalcular en cada render
    const { subscriptionStatus, nextBillingDate, subscriptionPlan } = useMemo(() => {
        const status = creator!.stripeSubscriptionId ? "Activa" : "Inactiva"
        const plan = creator!.stripeSubscriptionId ? "Profesional" : "Ninguno" // Lógica a mejorar
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

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            {/* TODO: Implementar un componente Sidebar aquí */}
            <div className="flex flex-col sm:gap-4 sm:py-4">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <div className="mx-auto grid w-full max-w-6xl flex-1 auto-rows-max gap-6">
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
                                <Button variant="destructive" onClick={logout} size="sm">
                                    <IconLogout className="mr-2 size-4" />
                                    Cerrar Sesión
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
                                    <div className="h-64 w-full bg-secondary/50 flex items-center justify-center rounded-md">
                                        <p className="text-sm text-muted-foreground">[Gráfico de Actividad]</p>
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
                                    <Button className="w-full">
                                        <IconSettings className="mr-2 size-4" />
                                        Gestionar Suscripción
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}

// Envolvemos la página con el HOC para protegerla
export default withCreatorAuth(CreatorDashboardPage)
