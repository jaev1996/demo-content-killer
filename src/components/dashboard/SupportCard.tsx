"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconMail, IconHelp, IconCopy } from "@tabler/icons-react"

export function SupportCard() {
    const supportEmail = "support@privaclean.com"

    return (
        <Card className="h-full">
            <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <IconHelp className="w-5 h-5 text-red-600 dark:text-red-500" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">Centro de Ayuda</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                    ¿Necesitas asistencia? Contáctanos directamente por correo electrónico
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                {/* Main Email Section - Centered and Prominent */}
                <div className="flex flex-col items-center justify-center p-6 sm:p-10 bg-muted/40 border border-dashed rounded-xl transition-all hover:bg-muted/60">
                    <div className="p-4 bg-background border shadow-sm rounded-full mb-4">
                        <IconMail className="w-8 h-8 text-red-600 dark:text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Soporte por Correo Electrónico</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                        Para cualquier consulta, reporte de problemas o asistencia con tu cuenta,
                        escríbenos. Nuestro equipo te responderá lo antes posible.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <Button
                            className="w-full sm:w-auto gap-2 min-w-[160px] bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => window.open(`mailto:${supportEmail}`)}
                        >
                            <IconMail className="w-4 h-4" />
                            Enviar Email
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto gap-2 min-w-[160px] font-mono text-xs sm:text-sm"
                            onClick={() => {
                                navigator.clipboard.writeText(supportEmail)
                                // Minimal visual feedback could be added here if needed, 
                                // but for simplicity keeping it purely functional or relying on global toasts if contexts allow.
                                // For now, just copy.
                            }}
                        >
                            <IconCopy className="w-3 h-3 text-muted-foreground" />
                            {supportEmail}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 font-medium flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Tiempo de respuesta promedio: &lt;24 horas
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Topics List as Grid Cards */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                            <IconHelp className="w-4 h-4 text-red-500/80" />
                            Podemos ayudarte con:
                        </h4>
                        <div className="grid gap-3">
                            {[
                                "Configuración de datos y privacidad",
                                "Gestión de suscripción y facturación",
                                "Estado de solicitudes de eliminación",
                                "Reporte de problemas técnicos"
                            ].map((topic, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                    <span className="text-sm text-muted-foreground">{topic}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Schedule Information */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4">Horario de Atención</h4>
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl p-5">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-medium uppercase text-red-700 dark:text-red-400 tracking-wider">Lunes a Viernes</span>
                                    <p className="text-sm font-semibold">9:00 AM - 6:00 PM <span className="text-muted-foreground font-normal">EST</span></p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium uppercase text-red-700 dark:text-red-400 tracking-wider">Sábados</span>
                                    <p className="text-sm font-semibold">10:00 AM - 2:00 PM <span className="text-muted-foreground font-normal">EST</span></p>
                                </div>
                                <div className="pt-2 border-t border-red-200 dark:border-red-800/30 mt-2">
                                    <p className="text-xs text-muted-foreground">
                                        Las consultas recibidas fuera de este horario serán atendidas con prioridad al siguiente día hábil.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
