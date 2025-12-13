import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconArrowLeft, IconCheck, IconAlertCircle, IconSparkles } from "@tabler/icons-react"
import { Progress } from "@/components/ui/progress"

interface FinalStepProps {
    dmcaComplete: boolean
    whitelistComplete: boolean
    onFinish: () => void
    onBack: () => void
}

export default function FinalStep({ dmcaComplete, whitelistComplete, onFinish, onBack }: FinalStepProps) {
    const completionPercentage = () => {
        let total = 0
        if (dmcaComplete) total += 50
        if (whitelistComplete) total += 50
        return total
    }

    const allComplete = dmcaComplete && whitelistComplete

    return (
        <Card className="border-2">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                        <IconSparkles className="w-10 h-10 text-white" />
                    </div>
                </div>
                <CardTitle className="text-3xl font-bold">
                    {allComplete ? "¡Todo Listo!" : "Casi Terminamos"}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                    {allComplete
                        ? "Tu perfil está completamente configurado y listo para empezar"
                        : "Puedes completar la configuración más tarde desde tu dashboard"
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Progress Summary */}
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Progreso de Configuración</h3>
                        <span className="text-2xl font-bold text-primary">{completionPercentage()}%</span>
                    </div>
                    <Progress value={completionPercentage()} className="h-3" />

                    <div className="space-y-3 mt-4">
                        <div className="flex items-center gap-3">
                            {dmcaComplete ? (
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                    <IconCheck className="w-5 h-5 text-green-600 dark:text-green-500" />
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                    <IconAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                                </div>
                            )}
                            <div>
                                <p className="font-medium">Información DMCA</p>
                                <p className="text-sm text-muted-foreground">
                                    {dmcaComplete ? "Completado ✓" : "Pendiente - Recomendado"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {whitelistComplete ? (
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                    <IconCheck className="w-5 h-5 text-green-600 dark:text-green-500" />
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                    <IconAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                                </div>
                            )}
                            <div>
                                <p className="font-medium">Whitelist de Plataformas</p>
                                <p className="text-sm text-muted-foreground">
                                    {whitelistComplete ? "Completado ✓" : "Pendiente - Opcional"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Card */}
                {allComplete && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <p className="text-sm text-green-900 dark:text-green-100">
                            🎉 <span className="font-semibold">¡Excelente!</span> Tu perfil está al 100%. Ahora puedes comenzar a enviar solicitudes de eliminación con máxima efectividad.
                        </p>
                    </div>
                )}

                {!allComplete && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                            💡 <span className="font-semibold">Recordatorio:</span> Puedes completar los datos pendientes en cualquier momento desde la sección de Configuración en tu dashboard.
                        </p>
                    </div>
                )}

                {/* What's Next */}
                <div className="border-t pt-6">
                    <h4 className="font-semibold mb-3">¿Qué sigue?</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Explora el dashboard y familiarízate con las herramientas</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Revisa el estado de tu suscripción</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Comienza a monitorear y proteger tu contenido</span>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="flex-1 sm:flex-none sm:w-32"
                    >
                        <IconArrowLeft className="w-4 h-4 mr-2" />
                        Atrás
                    </Button>
                    <Button
                        type="button"
                        onClick={onFinish}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        size="lg"
                    >
                        <IconCheck className="w-5 h-5 mr-2" />
                        Ir al Dashboard
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
