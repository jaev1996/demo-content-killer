"use client"

import React, { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { withCreatorAuth } from "@/components/with-creator-auth"
import { useCreatorAuth } from "@/contexts/creator-auth-context"
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
import { IconCheck, IconShieldCheck, IconRobot, IconBolt, IconShieldOff, IconAlertTriangle, IconX } from "@tabler/icons-react"

// Stripe Price IDs
const STRIPE_PRICE_IDS = {
    PRO: 'price_1Sw66cLtgqTiy8gQeRcQowRT',
    BASIC: 'price_1Sw648LtgqTiy8gQN6Uv0meA'
};

// PLANS moved inside component to use translations

function CreatorSubscriptionPage() {
    const t = useTranslations("CreatorSubscriptionPage")
    const { creator, updateCreatorProfile } = useCreatorAuth()

    const PLANS = [
        {
            id: 'basic',
            name: t('plans.basic'),
            priceId: STRIPE_PRICE_IDS.BASIC,
            price: '200€',
            features: t.raw('availablePlans.features.basic') as string[]
        },
        {
            id: 'pro',
            name: t('plans.professional'),
            priceId: STRIPE_PRICE_IDS.PRO,
            price: '300€',
            features: t.raw('availablePlans.features.pro') as string[]
        }
    ];

    const [loading, setLoading] = useState(false);
    const [portalLoading, setPortalLoading] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);



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
        const planAmount = creator.stripePriceId === STRIPE_PRICE_IDS.PRO ? "300€" : "200€"

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
            const response = await apiFetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                body: JSON.stringify({ priceId }),
                headers: {
                    'Content-Type': 'application/json'
                }
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

    const handlePortalSession = async () => {
        setPortalLoading(true);
        try {
            const response = await apiFetch('/api/stripe/create-portal-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('Error:', data.error);
                alert(t('alerts.connectionError'));
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert(t('alerts.connectionError'));
        } finally {
            setPortalLoading(false);
        }
    }

    const handleCancelSubscription = async () => {
        setCancelLoading(true);
        try {
            const response = await apiFetch('/api/stripe/cancel-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
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
                                        className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-red-500/20 transition-all font-semibold"
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
                    <CardFooter className="flex flex-col gap-3 pt-2">
                        {hasActiveSubscription && !showCancelConfirm && (
                            <>
                                <div className="w-full bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg p-3 flex items-center justify-center gap-2">
                                    <IconShieldCheck className="h-5 w-5 text-green-600 dark:text-green-500" />
                                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                        Sistema de Protección Activo
                                    </span>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full mt-2"
                                    onClick={handlePortalSession}
                                    disabled={portalLoading}
                                >
                                    {portalLoading ? t('availablePlans.processing') : t('manageButton')}
                                </Button>

                                {/* 
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-muted-foreground hover:text-destructive w-full"
                                    onClick={() => setShowCancelConfirm(true)}
                                >
                                    {t('currentPlan.cancelButton')}
                                </Button> 
                                */}
                            </>
                        )}
                        {showCancelConfirm && (
                            <div className="w-full space-y-3 bg-muted/30 p-4 rounded-lg border border-dashed">
                                <div className="flex items-center gap-2 text-destructive">
                                    <IconAlertTriangle className="h-4 w-4" />
                                    <p className="text-sm font-medium">{t('currentPlan.confirmCancel')}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Al cancelar, perderás protección inmeditamente al finalizar el periodo actual.
                                </p>
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="flex-1"
                                        onClick={handleCancelSubscription}
                                        disabled={cancelLoading}
                                    >
                                        {cancelLoading ? t('currentPlan.canceling') : t('currentPlan.yesCancel')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
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

                <Card className="md:col-span-3 flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {hasActiveSubscription ? (
                                <>
                                    <IconShieldCheck className="w-6 h-6 text-green-500" />
                                    Tu Escudo de Protección
                                </>
                            ) : (
                                <>
                                    <IconShieldOff className="w-6 h-6 text-muted-foreground" />
                                    Protección Inactiva
                                </>
                            )}
                        </CardTitle>
                        <CardDescription>
                            {hasActiveSubscription
                                ? "Mantienes activo el nivel más alto de seguridad para tu contenido."
                                : "Actualmente tu contenido es vulnerable a filtraciones y copias no autorizadas."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 grid gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Monitoring Feature */}
                            <div className={`flex flex-col items-center p-4 border rounded-xl text-center gap-2 transition-colors ${hasActiveSubscription ? "bg-muted/30 hover:bg-muted/50" : "bg-muted/10 opacity-70 grayscale"}`}>
                                <div className={`p-2.5 rounded-full ${hasActiveSubscription ? "bg-green-100 dark:bg-green-900/20" : "bg-muted"}`}>
                                    {hasActiveSubscription ? (
                                        <IconCheck className="w-5 h-5 text-green-600 dark:text-green-500" />
                                    ) : (
                                        <IconX className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="font-semibold text-sm">Monitorización</p>
                                    <p className="text-xs text-muted-foreground">{hasActiveSubscription ? "24/7 Activa" : "Inactiva"}</p>
                                </div>
                            </div>

                            {/* AI Scan Feature */}
                            <div className={`flex flex-col items-center p-4 border rounded-xl text-center gap-2 transition-colors ${hasActiveSubscription ? "bg-muted/30 hover:bg-muted/50" : "bg-muted/10 opacity-70 grayscale"}`}>
                                <div className={`p-2.5 rounded-full ${hasActiveSubscription ? "bg-blue-100 dark:bg-blue-900/20" : "bg-muted"}`}>
                                    {hasActiveSubscription ? (
                                        <IconRobot className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                                    ) : (
                                        <IconX className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="font-semibold text-sm">IA Scan</p>
                                    <p className="text-xs text-muted-foreground">{hasActiveSubscription ? "Optimizado" : "Desactivado"}</p>
                                </div>
                            </div>

                            {/* Removals Feature */}
                            <div className={`flex flex-col items-center p-4 border rounded-xl text-center gap-2 transition-colors ${hasActiveSubscription ? "bg-muted/30 hover:bg-muted/50" : "bg-muted/10 opacity-70 grayscale"}`}>
                                <div className={`p-2.5 rounded-full ${hasActiveSubscription ? "bg-purple-100 dark:bg-purple-900/20" : "bg-muted"}`}>
                                    {hasActiveSubscription ? (
                                        <IconBolt className="w-5 h-5 text-purple-600 dark:text-purple-500" />
                                    ) : (
                                        <IconX className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="font-semibold text-sm">Remociones</p>
                                    <p className="text-xs text-muted-foreground">{hasActiveSubscription ? "Ilimitadas" : "No disponible"}</p>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-xl border p-5 ${hasActiveSubscription ? "bg-card/50" : "bg-red-50/50 dark:bg-red-950/10 border-red-200/50 dark:border-red-900/30"}`}>
                            <h4 className="font-medium text-sm mb-4 flex items-center gap-2">
                                {hasActiveSubscription ? (
                                    <IconShieldCheck className="w-4 h-4 text-primary" />
                                ) : (
                                    <IconAlertTriangle className="w-4 h-4 text-red-500" />
                                )}
                                Estatus de Cobertura
                            </h4>
                            <div className="space-y-3">
                                {/* Search Engines */}
                                <div className={`flex items-center justify-between text-sm p-3 rounded-lg border ${hasActiveSubscription ? "bg-background/50" : "bg-background/80"}`}>
                                    <span className="text-muted-foreground">Motores de Búsqueda</span>
                                    {hasActiveSubscription ? (
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            <span className="font-medium text-green-600 dark:text-green-400 text-xs">Monitoreando</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-red-400"></div>
                                            <span className="font-medium text-red-600 dark:text-red-400 text-xs">Sin protección</span>
                                        </div>
                                    )}
                                </div>

                                {/* Social Networks */}
                                <div className={`flex items-center justify-between text-sm p-3 rounded-lg border ${hasActiveSubscription ? "bg-background/50" : "bg-background/80"}`}>
                                    <span className="text-muted-foreground">Redes Sociales</span>
                                    {hasActiveSubscription ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <span className="font-medium text-green-600 dark:text-green-400 text-xs">Protegido</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-red-400"></div>
                                            <span className="font-medium text-red-600 dark:text-red-400 text-xs">Vulnerable</span>
                                        </div>
                                    )}
                                </div>

                                {/* Legal Support */}
                                <div className={`flex items-center justify-between text-sm p-3 rounded-lg border ${hasActiveSubscription ? "bg-background/50" : "bg-background/80"}`}>
                                    <span className="text-muted-foreground">Soporte Legal</span>
                                    {hasActiveSubscription ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <span className="font-medium text-green-600 dark:text-green-400 text-xs">Disponible</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-muted-foreground/30"></div>
                                            <span className="font-medium text-muted-foreground text-xs">No incluido</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default withCreatorAuth(CreatorSubscriptionPage)
