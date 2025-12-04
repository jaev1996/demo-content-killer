import { IconMail, IconBrandWhatsapp, IconClock, IconMapPin, IconHeadset } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ContactPage() {
    const whatsappNumber = "+1234567890" // Cambiar por tu número real
    const supportEmail = "support@privaclean.com"

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        ¿Necesitas Ayuda?
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Estamos aquí para ayudarte. Contáctanos a través de cualquiera de nuestros canales de soporte.
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="grid gap-6 md:grid-cols-2 mb-12">
                    {/* WhatsApp Card */}
                    <Card className="border-2 hover:border-green-500 transition-colors">
                        <CardHeader>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                                <IconBrandWhatsapp className="w-6 h-6 text-green-600 dark:text-green-500" />
                            </div>
                            <CardTitle>WhatsApp</CardTitle>
                            <CardDescription>
                                La forma más rápida de obtener ayuda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Chatea con nuestro equipo en tiempo real. Resolvemos la mayoría de consultas en minutos.
                            </p>
                            <Button
                                asChild
                                className="w-full bg-green-500 hover:bg-green-600"
                            >
                                <a
                                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola! Necesito ayuda con PrivaClean')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <IconBrandWhatsapp className="w-4 h-4 mr-2" />
                                    Abrir WhatsApp
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Email Card */}
                    <Card className="border-2 hover:border-red-500 transition-colors">
                        <CardHeader>
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                                <IconMail className="w-6 h-6 text-red-600 dark:text-red-500" />
                            </div>
                            <CardTitle>Email</CardTitle>
                            <CardDescription>
                                Para consultas más detalladas o formales
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Envíanos un email con todos los detalles. Te responderemos en menos de 24 horas hábiles.
                            </p>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full"
                            >
                                <a href={`mailto:${supportEmail}`}>
                                    <IconMail className="w-4 h-4 mr-2" />
                                    {supportEmail}
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Info */}
                <div className="grid gap-6 md:grid-cols-3 mb-12">
                    <Card>
                        <CardHeader>
                            <IconClock className="w-8 h-8 text-primary mb-2" />
                            <CardTitle className="text-lg">Horario de Atención</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                <strong>Lunes a Viernes:</strong><br />
                                9:00 AM - 6:00 PM (EST)
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                <strong>Sábados:</strong><br />
                                10:00 AM - 2:00 PM (EST)
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <IconHeadset className="w-8 h-8 text-primary mb-2" />
                            <CardTitle className="text-lg">Tiempo de Respuesta</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                <strong>WhatsApp:</strong> &lt; 5 minutos<br />
                                <strong>Email:</strong> &lt; 24 horas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <IconMapPin className="w-8 h-8 text-primary mb-2" />
                            <CardTitle className="text-lg">Ubicación</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Oficina Virtual<br />
                                Disponible globalmente<br />
                                🌍 Soporte en Español/English
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ Preview */}
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle>¿Qué tipo de ayuda ofrecemos?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>Configuración de cuenta y datos DMCA</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>Gestión de suscripciones y pagos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>Solicitudes de eliminación de contenido</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>Problemas técnicos y errores</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>Consultas sobre DMCA y aspectos legales</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Back to Home */}
                <div className="text-center mt-12">
                    <Button asChild variant="outline">
                        <Link href="/">
                            Volver al Inicio
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
