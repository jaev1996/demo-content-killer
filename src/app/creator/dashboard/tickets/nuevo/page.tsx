"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    IconArrowLeft,
    IconLoader2,
    IconSend,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Toaster } from "sonner"
import { apiFetch } from "@/lib/api"
import { withCreatorAuth } from "@/components/with-creator-auth"

const CATEGORIES = [
    'Facturación',
    'Soporte técnico',
    'DMCA / Takedown',
    'Suscripción',
    'Error en la plataforma',
    'Otro',
]

function NewTicketPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({
        subject: '',
        body: '',
        priority: 'MEDIUM',
        category: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (form.subject.trim().length < 5) {
            newErrors.subject = 'El asunto debe tener al menos 5 caracteres'
        }
        if (form.subject.trim().length > 255) {
            newErrors.subject = 'El asunto no puede exceder 255 caracteres'
        }
        if (form.body.trim().length < 20) {
            newErrors.body = 'El mensaje debe tener al menos 20 caracteres'
        }
        return newErrors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }
        setErrors({})
        setIsSubmitting(true)

        try {
            const body: Record<string, string> = {
                subject: form.subject.trim(),
                body: form.body.trim(),
                priority: form.priority,
            }
            if (form.category) body.category = form.category

            const res = await apiFetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Error al crear el ticket')
            }

            toast.success('¡Ticket creado! El equipo de soporte te responderá pronto.')
            router.push(`/creator/dashboard/tickets/${data.data.id}`)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error inesperado'
            toast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Toaster richColors />

            {/* Back button & Header */}
            <div>
                <Link
                    href="/creator/dashboard/tickets"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
                >
                    <IconArrowLeft className="h-4 w-4" />
                    Volver a mis tickets
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Abrir Nuevo Ticket</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Cuéntanos en qué podemos ayudarte. Nuestro equipo responderá lo antes posible.
                </p>
            </div>

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Detalles del ticket</CardTitle>
                    <CardDescription>
                        Completa el formulario con la información de tu solicitud
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Subject */}
                        <div className="space-y-1.5">
                            <Label htmlFor="subject">
                                Asunto <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="subject"
                                placeholder="Ej: Problema con mi suscripción"
                                value={form.subject}
                                onChange={e => setForm({ ...form, subject: e.target.value })}
                                maxLength={255}
                                disabled={isSubmitting}
                            />
                            {errors.subject && (
                                <p className="text-xs text-destructive">{errors.subject}</p>
                            )}
                            <p className="text-xs text-muted-foreground text-right">
                                {form.subject.length}/255
                            </p>
                        </div>

                        {/* Priority & Category row */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="priority">Prioridad</Label>
                                <Select
                                    value={form.priority}
                                    onValueChange={value => setForm({ ...form, priority: value })}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger id="priority">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">🔵 Baja</SelectItem>
                                        <SelectItem value="MEDIUM">🔵 Media</SelectItem>
                                        <SelectItem value="HIGH">🟠 Alta</SelectItem>
                                        <SelectItem value="URGENT">🔴 Urgente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="category">Categoría</Label>
                                <Select
                                    value={form.category}
                                    onValueChange={value => setForm({ ...form, category: value })}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Message body */}
                        <div className="space-y-1.5">
                            <Label htmlFor="body">
                                Descripción del problema <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="body"
                                placeholder="Describe detalladamente tu problema o consulta..."
                                value={form.body}
                                onChange={e => setForm({ ...form, body: e.target.value })}
                                rows={6}
                                disabled={isSubmitting}
                                className="resize-none"
                            />
                            {errors.body && (
                                <p className="text-xs text-destructive">{errors.body}</p>
                            )}
                            <p className="text-xs text-muted-foreground text-right">
                                {form.body.length} caracteres (mínimo 20)
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isSubmitting}
                                onClick={() => router.push('/creator/dashboard/tickets')}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creando ticket...
                                    </>
                                ) : (
                                    <>
                                        <IconSend className="mr-2 h-4 w-4" />
                                        Crear ticket
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default withCreatorAuth(NewTicketPage)
