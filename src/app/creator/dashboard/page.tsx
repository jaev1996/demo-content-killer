"use client"

import React from "react"
import { useCreatorAuth } from "@/contexts/creator-auth-context"
import { withCreatorAuth } from "@/components/with-creator-auth"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconUserCircle, IconSettings, IconLogout } from "@tabler/icons-react"

function CreatorDashboardPage() {
    const { creator, logout } = useCreatorAuth()

    // El HOC `withCreatorAuth` asegura que `creator` no será nulo aquí.
    // Usamos el operador "!" para indicarle a TypeScript que estamos seguros de ello.
    const creatorName = creator!.creatorName

    // Determinar el estado de la suscripción basado en los campos de Stripe
    const subscriptionStatus = creator!.stripeSubscriptionId ? "Activa" : "Inactiva"
    const nextBillingDate = creator!.stripeCurrentPeriodEnd
        ? new Date(creator!.stripeCurrentPeriodEnd).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
        : "N/A"

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            {/* TODO: Aquí iría un Sidebar para la navegación del creador */}
            <div className="flex flex-col sm:gap-4 sm:py-4">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <div className="mx-auto grid w-full max-w-4xl flex-1 auto-rows-max gap-4">
                        <div className="flex items-center gap-4">
                            <IconUserCircle className="size-10 text-muted-foreground" />
                            <div className="grid gap-1">
                                <h1 className="text-2xl font-semibold">
                                    ¡Bienvenido, {creatorName}!
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Este es tu panel de control. Desde aquí podrás gestionar tu contenido y suscripción.
                                </p>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Estado de tu Suscripción</CardTitle>
                                <CardDescription>
                                    Aquí puedes ver el estado actual de tu plan y gestionar tu suscripción.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Plan Actual</span>
                                    <Badge variant={subscriptionStatus === "Activa" ? "secondary" : "destructive"}>
                                        {subscriptionStatus}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Próxima fecha de cobro</span>
                                    <span>{nextBillingDate}</span>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <Button variant="outline">
                                        <IconSettings className="mr-2 size-4" />
                                        Gestionar Suscripción
                                    </Button>
                                    <Button variant="destructive" onClick={logout}>
                                        <IconLogout className="mr-2 size-4" />
                                        Cerrar Sesión
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Más tarjetas y funcionalidades irán aquí en el futuro */}

                    </div>
                </main>
            </div>
        </div>
    )
}

// Envolvemos la página con el HOC para protegerla
export default withCreatorAuth(CreatorDashboardPage)

