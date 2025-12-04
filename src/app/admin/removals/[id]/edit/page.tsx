"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IconArrowLeft, IconLoader2 } from "@tabler/icons-react"
import { RemovalForm } from "@/components/admin/removals/RemovalForm"
import { apiFetch } from "@/lib/api"
import { toast } from "sonner"
import type { ContentRemoval } from "@/types/removals"

export default function EditRemovalPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [removal, setRemoval] = useState<ContentRemoval | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRemoval()
    }, [params.id])

    const fetchRemoval = async () => {
        try {
            const response = await apiFetch(`/api/admin/removals/${params.id}`)
            if (!response.ok) throw new Error('No se pudo cargar la eliminación')

            const data = await response.json()
            setRemoval(data.data)
        } catch (error) {
            toast.error('Error al cargar datos')
            router.push('/admin/removals')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <IconLoader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    if (!removal) {
        return null
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                >
                    <IconArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Editar Eliminación</h1>
                    <p className="text-muted-foreground">
                        Actualiza el estado y detalles de la eliminación
                    </p>
                </div>
            </div>

            <RemovalForm
                mode="edit"
                initialData={removal}
                onSuccess={() => router.push('/admin/removals')}
                onCancel={() => router.back()}
            />
        </div>
    )
}
