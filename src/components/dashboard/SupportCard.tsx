"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconBrandWhatsapp, IconMail, IconHelp, IconExternalLink } from "@tabler/icons-react"

export function SupportCard() {
    const whatsappNumber = "+1234567890" // Cambiar por tu número real
    const supportEmail = "support@privaclean.com"

    const handleWhatsApp = () => {
        const message = encodeURIComponent('Hola! Soy usuario de PrivaClean y necesito ayuda')
        window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
    }

    return (
        <Card>
            <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <IconHelp className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">Centro de Ayuda</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                    ¿Necesitas asistencia? Estamos aquí para ayudarte
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Support Options */}
                <div className="space-y-4">
                    {/* WhatsApp */}
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg flex-shrink-0">
                                <IconBrandWhatsapp className="w-5 h-5 text-green-600 dark:text-green-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-1">Soporte por WhatsApp</h4>
                                <p className="text-xs text-muted-foreground mb-3">
                                    La forma más rápida de obtener ayuda. Respuesta promedio: &lt;5 minutos.
                                </p>
                                <Button
                                    onClick={handleWhatsApp}
                                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
                                    size="sm"
                                >
                                    <IconBrandWhatsapp className="w-4 h-4 mr-2" />
                                    Abrir Chat
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="p-4 bg-muted/50 border rounded-lg">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                <IconMail className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-1">Soporte por Email</h4>
                                <p className="text-xs text-muted-foreground mb-2">
                                    Para consultas detalladas o formales. Respuesta en &lt;24h.
                                </p>
                                <a
                                    href={`mailto:${supportEmail}`}
                                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                                >
                                    {supportEmail}
                                    <IconExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help Topics */}
                <div className="border-t pt-4">
                    <h4 className="font-semibold text-sm mb-3">¿En qué podemos ayudarte?</h4>
                    <div className="grid gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="text-primary">•</span>
                            <span>Configuración de datos DMCA</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-primary">•</span>
                            <span>Gestión de suscripción y pagos</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-primary">•</span>
                            <span>Solicitudes de eliminación de contenido</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-primary">•</span>
                            <span>Problemas técnicos</span>
                        </div>
                    </div>
                </div>

                {/* Horario */}
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs text-blue-900 dark:text-blue-100">
                        <strong>Horario de atención:</strong><br />
                        Lun-Vie: 9AM - 6PM EST | Sáb: 10AM - 2PM EST
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
