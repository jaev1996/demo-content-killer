"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import { RemovalForm } from "@/components/admin/removals/RemovalForm"

export default function NewRemovalPage() {
    const router = useRouter()

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
                    <h1 className="text-3xl font-bold">Nueva Eliminación</h1>
                    <p className="text-muted-foreground">
                        Registra una nueva solicitud de eliminación de contenido
                    </p>
                </div>
            </div>

            <RemovalForm
                mode="create"
                onSuccess={() => router.push('/admin/removals')}
                onCancel={() => router.back()}
            />
        </div>
    )
}
