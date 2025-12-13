"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
import type { ContentRemoval, CreateRemovalData, ContentType, RemovalStatus } from "@/types/removals"
import { IconLoader2 } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"

interface RemovalFormProps {
    mode: 'create' | 'edit'
    initialData?: ContentRemoval
    removalId?: string
    onSuccess?: () => void
    onCancel?: () => void
}

interface Creator {
    id: string
    creatorName: string
    email: string
}

const PLATFORMS = [
    'OnlyFans',
    'Fansly',
    'Twitter/X',
    'Reddit',
    'Pornhub',
    'Telegram',
    'Discord',
    'Instagram',
    'TikTok',
    'Otro'
]

const CONTENT_TYPES: ContentType[] = ['image', 'video', 'post']
const STATUSES: RemovalStatus[] = ['pending', 'in_progress', 'completed', 'cancelled']

const STATUS_LABELS = {
    pending: 'Pendiente',
    in_progress: 'En Proceso',
    completed: 'Completado',
    cancelled: 'Cancelado'
}

const CONTENT_TYPE_LABELS = {
    image: 'Imagen',
    video: 'Video',
    post: 'Publicación'
}

export function RemovalForm({ mode, initialData, removalId, onSuccess, onCancel }: RemovalFormProps) {
    const [loading, setLoading] = useState(false)
    const [creators, setCreators] = useState<Creator[]>([])
    const [loadingCreators, setLoadingCreators] = useState(true)

    const [formData, setFormData] = useState({
        creatorId: initialData?.creatorId || '',
        platform: initialData?.platform || '',
        contentUrl: initialData?.contentUrl || '',
        contentType: initialData?.contentType || 'image' as ContentType,
        status: initialData?.status || 'pending' as RemovalStatus,
        description: initialData?.description || '',
        adminNotes: initialData?.adminNotes || ''
    })

    // Cargar lista de creadores
    useEffect(() => {
        const fetchCreators = async () => {
            try {
                const response = await apiFetch('/api/admin/creators')
                if (response.ok) {
                    const data = await response.json()
                    setCreators(data.data || [])
                }
            } catch (error) {
                console.error('Error loading creators:', error)
                toast.error('Error al cargar creadores')
            } finally {
                setLoadingCreators(false)
            }
        }
        fetchCreators()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Validaciones básicas
            if (!formData.creatorId) {
                toast.error('Debe seleccionar un creador')
                setLoading(false)
                return
            }
            if (!formData.platform) {
                toast.error('Debe seleccionar una plataforma')
                setLoading(false)
                return
            }
            if (!formData.contentUrl) {
                toast.error('Debe ingresar la URL del contenido')
                setLoading(false)
                return
            }

            if (mode === 'create') {
                // Crear nueva eliminación
                const response = await apiFetch('/api/admin/removals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.message || 'Error al crear eliminación')
                }

                toast.success('Eliminación creada exitosamente')
            } else {
                // Actualizar eliminación existente
                if (!removalId && !initialData?.id) {
                    throw new Error('No se puede actualizar sin ID de eliminación')
                }

                const updateData = {
                    status: formData.status,
                    adminNotes: formData.adminNotes,
                    description: formData.description,
                    contentType: formData.contentType,
                    resolvedAt: formData.status === 'completed' ? new Date().toISOString() : null
                }

                const idToUse = removalId || initialData?.id
                console.log('Updating removal with ID:', idToUse)
                console.log('Update data:', updateData)

                const response = await apiFetch(`/api/admin/removals/${idToUse}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData)
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.message || 'Error al actualizar eliminación')
                }

                toast.success('Eliminación actualizada exitosamente')
            }

            onSuccess?.()
        } catch (error) {
            console.error('Form submission error:', error)
            toast.error(error instanceof Error ? error.message : 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-xl">
                                {mode === 'create' ? 'Nueva Eliminación' : 'Editar Eliminación'}
                            </CardTitle>
                            <CardDescription>
                                {mode === 'create'
                                    ? 'Registra una nueva solicitud de eliminación de contenido'
                                    : 'Actualiza el estado y detalles de la eliminación'
                                }
                            </CardDescription>
                        </div>
                        {mode === 'edit' && initialData && (
                            <Badge variant={
                                formData.status === 'completed' ? 'default' :
                                    formData.status === 'in_progress' ? 'secondary' :
                                        formData.status === 'cancelled' ? 'destructive' : 'outline'
                            }>
                                {STATUS_LABELS[formData.status]}
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Información del Creador y Plataforma */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        {/* Creador */}
                        <div className="grid gap-2">
                            <Label htmlFor="creatorId">
                                Creador *
                                {mode === 'edit' && <span className="text-xs text-muted-foreground ml-2">(No editable)</span>}
                            </Label>
                            <Select
                                value={formData.creatorId}
                                onValueChange={(value) => setFormData({ ...formData, creatorId: value })}
                                disabled={mode === 'edit' || loadingCreators}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={loadingCreators ? "Cargando..." : "Selecciona un creador"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {loadingCreators ? (
                                        <div className="flex items-center justify-center p-4">
                                            <IconLoader2 className="w-4 h-4 animate-spin" />
                                        </div>
                                    ) : creators.length === 0 ? (
                                        <div className="p-4 text-sm text-muted-foreground text-center">
                                            No hay creadores disponibles
                                        </div>
                                    ) : (
                                        creators.map((creator) => (
                                            <SelectItem key={creator.id} value={creator.id}>
                                                {creator.creatorName} ({creator.email})
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Plataforma */}
                        <div className="grid gap-2">
                            <Label htmlFor="platform">
                                Plataforma *
                                {mode === 'edit' && <span className="text-xs text-muted-foreground ml-2">(No editable)</span>}
                            </Label>
                            <Select
                                value={formData.platform}
                                onValueChange={(value) => setFormData({ ...formData, platform: value })}
                                disabled={mode === 'edit'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona plataforma" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PLATFORMS.map((platform) => (
                                        <SelectItem key={platform} value={platform}>
                                            {platform}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* URL del Contenido */}
                    <div className="grid gap-2">
                        <Label htmlFor="contentUrl">
                            URL del Contenido *
                            {mode === 'edit' && <span className="text-xs text-muted-foreground ml-2">(No editable)</span>}
                        </Label>
                        <Input
                            id="contentUrl"
                            type="url"
                            value={formData.contentUrl}
                            onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
                            placeholder="https://example.com/leaked/content"
                            disabled={mode === 'edit'}
                            required
                            className="font-mono text-sm"
                        />
                    </div>

                    {/* Tipo de Contenido y Estado */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        {/* Tipo de Contenido */}
                        <div className="grid gap-2">
                            <Label htmlFor="contentType">Tipo de Contenido</Label>
                            <Select
                                value={formData.contentType}
                                onValueChange={(value) => setFormData({ ...formData, contentType: value as ContentType })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CONTENT_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {CONTENT_TYPE_LABELS[type]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Estado */}
                        <div className="grid gap-2">
                            <Label htmlFor="status">Estado *</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value as RemovalStatus })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUSES.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {STATUS_LABELS[status]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="grid gap-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detalles sobre el contenido filtrado..."
                            rows={3}
                            maxLength={1000}
                        />
                        <p className="text-xs text-muted-foreground">
                            {formData.description.length}/1000 caracteres
                        </p>
                    </div>

                    {/* Notas del Admin */}
                    <div className="grid gap-2">
                        <Label htmlFor="adminNotes">Notas Internas (Admin)</Label>
                        <Textarea
                            id="adminNotes"
                            value={formData.adminNotes}
                            onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                            placeholder="Notas privadas solo para administradores..."
                            rows={3}
                            maxLength={2000}
                        />
                        <p className="text-xs text-muted-foreground">
                            {formData.adminNotes.length}/2000 caracteres
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={loading}
                                className="w-full sm:w-auto"
                            >
                                Cancelar
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={loading || loadingCreators}
                            className="w-full sm:flex-1"
                        >
                            {loading && <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {loading ? 'Guardando...' : mode === 'create' ? 'Crear Eliminación' : 'Actualizar'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
