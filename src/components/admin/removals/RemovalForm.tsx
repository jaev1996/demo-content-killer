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

interface RemovalFormProps {
    mode: 'create' | 'edit'
    initialData?: ContentRemoval
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

export function RemovalForm({ mode, initialData, onSuccess, onCancel }: RemovalFormProps) {
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
                return
            }
            if (!formData.platform) {
                toast.error('Debe seleccionar una plataforma')
                return
            }
            if (!formData.contentUrl) {
                toast.error('Debe ingresar la URL del contenido')
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
                const updateData = {
                    status: formData.status,
                    adminNotes: formData.adminNotes,
                    description: formData.description,
                    resolvedAt: formData.status === 'completed' ? new Date().toISOString() : null
                }

                const response = await apiFetch(`/api/admin/removals/${initialData?.id}`, {
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
            toast.error(error instanceof Error ? error.message : 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {mode === 'create' ? 'Nueva Eliminación' : 'Editar Eliminación'}
                    </CardTitle>
                    <CardDescription>
                        {mode === 'create'
                            ? 'Registra una nueva solicitud de eliminación de contenido'
                            : 'Actualiza el estado y detalles de la eliminación'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Creador */}
                    <div className="grid gap-2">
                        <Label htmlFor="creatorId">Creador *</Label>
                        <Select
                            value={formData.creatorId}
                            onValueChange={(value) => setFormData({ ...formData, creatorId: value })}
                            disabled={mode === 'edit' || loadingCreators}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={loadingCreators ? "Cargando..." : "Selecciona un creador"} />
                            </SelectTrigger>
                            <SelectContent>
                                {creators.map((creator) => (
                                    <SelectItem key={creator.id} value={creator.id}>
                                        {creator.creatorName} ({creator.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Plataforma */}
                    <div className="grid gap-2">
                        <Label htmlFor="platform">Plataforma *</Label>
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

                    {/* URL del Contenido */}
                    <div className="grid gap-2">
                        <Label htmlFor="contentUrl">URL del Contenido *</Label>
                        <Input
                            id="contentUrl"
                            type="url"
                            value={formData.contentUrl}
                            onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
                            placeholder="https://example.com/leaked/content"
                            disabled={mode === 'edit'}
                            required
                        />
                    </div>

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
                                        {type === 'image' ? 'Imagen' : type === 'video' ? 'Video' : 'Publicación'}
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
                                        {status === 'pending' ? 'Pendiente' :
                                            status === 'in_progress' ? 'En Proceso' :
                                                status === 'completed' ? 'Completado' : 'Cancelado'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                    <div className="flex gap-3 pt-4">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? 'Guardando...' : mode === 'create' ? 'Crear Eliminación' : 'Actualizar'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
