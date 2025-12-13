"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import { RemovalForm } from "@/components/admin/removals/RemovalForm"
import { AppLayout } from "@/components/app-layout"
import { withAuth } from "@/components/with-auth"
import { withRoleProtection } from "@/components/with-role-protection"

function NewRemovalPage() {
    const router = useRouter()

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
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Nueva Eliminación</h1>
                        <p className="text-sm text-muted-foreground mt-1">
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
        </AppLayout>
    )
}

export default withAuth(withRoleProtection(NewRemovalPage, ["super_admin"]))
