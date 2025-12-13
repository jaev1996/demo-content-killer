"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { IconCheck, IconAlertCircle, IconArrowRight, IconShieldCheck, IconShieldLock } from "@tabler/icons-react"
import { useCreatorAuth } from "@/contexts/creator-auth-context"
import { useRouter } from "next/navigation"

export function ProfileCompletenessCard() {
    const { creator } = useCreatorAuth()
    const router = useRouter()

    if (!creator) return null

    // Calcular completitud del perfil
    const isDmcaComplete = !!(
        creator.dmcaFullName &&
        creator.dmcaContactEmail &&
        creator.dmcaCountry &&
        creator.dmcaWorkDescription &&
        creator.dmcaSignature
    )

    const isWhitelistComplete = creator.whitelist && creator.whitelist.length > 0

    // Si todo está completo, no mostrar el widget
    if (isDmcaComplete && isWhitelistComplete) {
        return null
    }

    // Calcular porcentaje
    const completionPercentage = ((isDmcaComplete ? 50 : 0) + (isWhitelistComplete ? 50 : 0))

    return (
        <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                            <IconAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                            Completa tu Perfil
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm mt-1">
                            Mejora la efectividad de tus solicitudes al 95%
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-white/50 dark:bg-black/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700">
                        {completionPercentage}%
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                        <span className="font-medium">Progreso de Configuración</span>
                        <span className="text-muted-foreground">{completionPercentage}% completado</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2 bg-amber-200 dark:bg-amber-900/30" />
                </div>

                <div className="space-y-2">
                    {/* DMCA Status */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 dark:bg-black/20 border border-amber-200 dark:border-amber-800">
                        {isDmcaComplete ? (
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                <IconCheck className="w-5 h-5 text-green-600 dark:text-green-500" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                <IconShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Información DMCA</p>
                            <p className="text-xs text-muted-foreground">
                                {isDmcaComplete ? "Completado ✓" : "Requerido para solicitudes legales"}
                            </p>
                        </div>
                    </div>

                    {/* Whitelist Status */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 dark:bg-black/20 border border-amber-200 dark:border-amber-800">
                        {isWhitelistComplete ? (
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                <IconCheck className="w-5 h-5 text-green-600 dark:text-green-500" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                <IconShieldLock className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Whitelist de Plataformas</p>
                            <p className="text-xs text-muted-foreground">
                                {isWhitelistComplete
                                    ? `${creator.whitelist?.length} ${creator.whitelist?.length === 1 ? 'dominio' : 'dominios'} protegidos`
                                    : "Protege tus canales oficiales"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        onClick={() => router.push('/creator/onboarding')}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    >
                        Completar Ahora
                        <IconArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>

                <div className="bg-blue-100 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs text-blue-900 dark:text-blue-100">
                        💡 <span className="font-semibold">¿Por qué es importante?</span> Los datos DMCA son requeridos por ley para enviar notificaciones válidas de eliminación de contenido.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
