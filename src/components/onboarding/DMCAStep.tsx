"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconArrowRight, IconArrowLeft, IconShieldCheck, IconInfoCircle } from "@tabler/icons-react"
import { CountrySelect } from "@/components/ui/country-select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface DMCAData {
    dmcaFullName: string
    dmcaContactEmail: string
    dmcaCountry: string
    dmcaWorkDescription: string
    dmcaSignature: string
}

interface DMCAStepProps {
    data: DMCAData
    onChange: (data: DMCAData) => void
    onNext: () => void
    onBack: () => void
    onSkip: () => void
}

export default function DMCAStep({ data, onChange, onNext, onBack, onSkip }: DMCAStepProps) {
    const handleChange = (field: string, value: string) => {
        onChange({ ...data, [field]: value })
    }

    const isFormValid = () => {
        return data.dmcaFullName && data.dmcaContactEmail && data.dmcaCountry && data.dmcaWorkDescription && data.dmcaSignature
    }

    return (
        <Card className="border-2">
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <IconShieldCheck className="w-6 h-6 text-red-600 dark:text-red-500" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Información DMCA</CardTitle>
                        <CardDescription>
                            Datos legales requeridos para proteger tu contenido
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <p className="text-sm text-amber-900 dark:text-amber-100">
                        <span className="font-semibold">⚖️ Requerido por Ley:</span> Esta información es necesaria para enviar notificaciones DMCA válidas según la Digital Millennium Copyright Act.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="dmcaFullName">Nombre Legal Completo *</Label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <IconInfoCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs">Tu nombre legal tal como aparece en documentos oficiales</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Input
                            id="dmcaFullName"
                            value={data.dmcaFullName}
                            onChange={(e) => handleChange("dmcaFullName", e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="dmcaContactEmail">Email de Contacto DMCA *</Label>
                        <Input
                            id="dmcaContactEmail"
                            type="email"
                            value={data.dmcaContactEmail}
                            onChange={(e) => handleChange("dmcaContactEmail", e.target.value)}
                            placeholder="dmca@ejemplo.com"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="dmcaWorkDescription">Descripción del Trabajo *</Label>
                        <Textarea
                            id="dmcaWorkDescription"
                            value={data.dmcaWorkDescription}
                            onChange={(e) => handleChange("dmcaWorkDescription", e.target.value)}
                            placeholder="Describe el tipo de contenido que produces..."
                            className="min-h-[100px]"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="dmcaCountry">País *</Label>
                            <CountrySelect
                                value={data.dmcaCountry}
                                onValueChange={(value) => handleChange("dmcaCountry", value)}
                                placeholder="Selecciona un país"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="dmcaSignature">Firma Digital *</Label>
                            <Input
                                id="dmcaSignature"
                                value={data.dmcaSignature}
                                onChange={(e) => handleChange("dmcaSignature", e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>
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
                        variant="ghost"
                        onClick={onSkip}
                        className="flex-1"
                    >
                        Saltar por ahora
                    </Button>
                    <Button
                        type="button"
                        onClick={onNext}
                        disabled={!isFormValid()}
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
