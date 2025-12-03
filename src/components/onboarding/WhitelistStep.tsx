import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconArrowRight, IconArrowLeft, IconShieldLock, IconPlus, IconTrash, IconInfoCircle } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"

interface WhitelistStepProps {
    data: string[]
    onChange: (data: string[]) => void
    onNext: () => void
    onBack: () => void
    onSkip: () => void
}

export default function WhitelistStep({ data, onChange, onNext, onBack, onSkip }: WhitelistStepProps) {
    const [newUrl, setNewUrl] = useState("")

    const handleAddUrl = () => {
        if (newUrl.trim()) {
            // Validar que sea una URL válida
            const urlToAdd = newUrl.trim()
            if (!data.includes(urlToAdd)) {
                onChange([...data, urlToAdd])
                setNewUrl("")
            }
        }
    }

    const handleRemoveUrl = (index: number) => {
        onChange(data.filter((_, i) => i !== index))
    }

    const commonPlatforms = [
        { name: "OnlyFans", placeholder: "onlyfans.com/tu-usuario" },
        { name: "Patreon", placeholder: "patreon.com/tu-usuario" },
        { name: "Fansly", placeholder: "fansly.com/tu-usuario" },
    ]

    return (
        <Card className="border-2">
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <IconShieldLock className="w-6 h-6 text-green-600 dark:text-green-500" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Whitelist de Plataformas</CardTitle>
                        <CardDescription>
                            Protege tus canales oficiales de eliminaciones accidentales
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-sm text-green-900 dark:text-green-100">
                        <IconInfoCircle className="w-4 h-4 inline mr-1" />
                        <span className="font-semibold">Recomendado:</span> Agrega tus dominios oficiales donde publicas contenido. Esto evitará que sean reportados por error.
                    </p>
                </div>

                {/* Suggested Platforms */}
                <div>
                    <Label className="text-sm font-medium mb-3 block">Plataformas comunes:</Label>
                    <div className="flex flex-wrap gap-2">
                        {commonPlatforms.map((platform) => (
                            <Badge
                                key={platform.name}
                                variant="outline"
                                className="cursor-pointer hover:bg-muted transition-colors"
                                onClick={() => setNewUrl(platform.placeholder)}
                            >
                                <IconPlus className="w-3 h-3 mr-1" />
                                {platform.name}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Add URL Input */}
                <div className="space-y-2">
                    <Label htmlFor="newUrl">Agregar Dominio</Label>
                    <div className="flex gap-2">
                        <Input
                            id="newUrl"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder="ejemplo.com/tu-perfil"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddUrl()}
                        />
                        <Button
                            type="button"
                            onClick={handleAddUrl}
                            className="bg-red-600 hover:bg-red-700 flex-shrink-0"
                        >
                            <IconPlus className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Agrega solo el dominio (ej: onlyfans.com/usuario, no la URL completa)
                    </p>
                </div>

                {/* URLs List */}
                {data.length > 0 && (
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Dominios en Whitelist ({data.length})</Label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {data.map((url, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border"
                                >
                                    <span className="text-sm truncate flex-1">{url}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveUrl(index)}
                                        className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 flex-shrink-0"
                                    >
                                        <IconTrash className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {data.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <IconShieldLock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aún no has agregado ningún dominio</p>
                        <p className="text-xs">Agrega al menos uno para proteger tus plataformas oficiales</p>
                    </div>
                )}

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
                        variant="ghost"
                        onClick={onSkip}
                        className="flex-1"
                    >
                        Saltar por ahora
                    </Button>
                    <Button
                        type="button"
                        onClick={onNext}
                        className="flex-1 sm:flex-none sm:w-32 bg-red-600 hover:bg-red-700 text-white"
                    >
                        Continuar
                        <IconArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
