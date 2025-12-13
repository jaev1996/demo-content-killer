import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconRocket, IconArrowRight } from "@tabler/icons-react"
import Image from "next/image"

interface WelcomeStepProps {
    creatorName: string
    onNext: () => void
}

export default function WelcomeStep({ creatorName, onNext }: WelcomeStepProps) {
    return (
        <Card className="border-2">
            <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-6">
                    <Image
                        src="/privaclean.svg"
                        alt="PrivaClean Logo"
                        width={80}
                        height={80}
                        className="mx-auto"
                    />
                </div>
                <CardTitle className="text-3xl font-bold">
                    ¡Bienvenido, {creatorName}! 🎉
                </CardTitle>
                <CardDescription className="text-base mt-2">
                    Estamos emocionados de tenerte aquí. Configuremos tu cuenta para que puedas empezar a proteger tu contenido.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <IconRocket className="w-5 h-5 text-primary" />
                        ¿Qué vamos a configurar?
                    </h3>
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                1
                            </div>
                            <div>
                                <p className="font-medium">Información DMCA</p>
                                <p className="text-sm text-muted-foreground">
                                    Datos legales requeridos para enviar notificaciones válidas de eliminación de contenido.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                2
                            </div>
                            <div>
                                <p className="font-medium">Whitelist de Plataformas</p>
                                <p className="text-sm text-muted-foreground">
                                    Protege tus canales oficiales de eliminaciones accidentales.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                3
                            </div>
                            <div>
                                <p className="font-medium">Preferencias Finales</p>
                                <p className="text-sm text-muted-foreground">
                                    Configura notificaciones y ajustes adicionales.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                        💡 <span className="font-semibold">Tip:</span> Completar tu perfil aumenta la efectividad de tus solicitudes de eliminación en un 95%. ¡Solo te tomará 3 minutos!
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        onClick={onNext}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        size="lg"
                    >
                        Comenzar Configuración
                        <IconArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => window.location.href = '/creator/dashboard'}
                        className="w-full text-sm"
                    >
                        Ir al Dashboard (configurar después)
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
