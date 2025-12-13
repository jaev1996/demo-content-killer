"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IconArrowLeft, IconLoader2 } from "@tabler/icons-react"
import { RemovalForm } from "@/components/admin/removals/RemovalForm"
import { apiFetch } from "@/lib/api"
import { toast } from "sonner"
import type { ContentRemoval } from "@/types/removals"
import { AppLayout } from "@/components/app-layout"
import { withAuth } from "@/components/with-auth"
import { withRoleProtection } from "@/components/with-role-protection"
import { Card, CardContent } from "@/components/ui/card"

function EditRemovalPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const unwrappedParams = use(params)
    const removalId = unwrappedParams.id

    const [removal, setRemoval] = useState<ContentRemoval | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchRemoval()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [removalId])

    const fetchRemoval = async () => {
        try {
            setLoading(true)
            setError(null)

            console.log('Fetching removal with ID:', removalId)

            const response = await apiFetch(`/api/admin/removals/${removalId}`)

            console.log('Response status:', response.status)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `Error ${response.status}: No se pudo cargar la eliminación`)
            }

            const data = await response.json()
            console.log('Removal data loaded:', data)

            if (!data.data) {
                throw new Error('No se encontraron datos de la eliminación')
            }

            setRemoval(data.data)
        } catch (error) {
            console.error('Error loading removal:', error)
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar datos'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <IconLoader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Cargando datos de la eliminación...</p>
                </div>
            </AppLayout>
        )
    }

    if (error || !removal) {
        return (
            <AppLayout>
                <div className="max-w-2xl mx-auto">
                    <Card className="border-destructive">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <div className="text-destructive text-lg font-semibold">
                                    ⚠️ Error al Cargar
                                </div>
                                <p className="text-muted-foreground">
                                    {error || 'No se encontró la eliminación solicitada'}
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <Button variant="outline" onClick={() => router.back()}>
                                        Volver
                                    </Button>
                                    <Button onClick={fetchRemoval}>
                                        Reintentar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="self-start"
                    >
                        <IconArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Editar Eliminación</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Actualiza el estado y detalles de la eliminación
                        </p>
                    </div>
                </div>

                <RemovalForm
                    mode="edit"
                    initialData={removal}
                    removalId={removalId}
                    onSuccess={() => {
                        toast.success('Redirigiendo...')
                        router.push('/admin/removals')
                    }}
                    onCancel={() => router.back()}
                />
            </div>
        </AppLayout>
    )
}

export default withAuth(withRoleProtection(EditRemovalPage, ["super_admin"]))
