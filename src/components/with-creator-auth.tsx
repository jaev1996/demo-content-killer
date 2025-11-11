"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useCreatorAuth } from "@/contexts/creator-auth-context"
import { IconLock, IconLoader } from "@tabler/icons-react"
import { Toaster, toast } from "sonner"

/**
 * Un HOC que protege una ruta, asegurando que solo los creadores autenticados puedan acceder.
 *
 * @param Component El componente de la página a proteger.
 */
export function withCreatorAuth<P extends object>(
    Component: React.ComponentType<P>
) {
    return function WithCreatorAuth(props: P) {
        const { creator, isLoading } = useCreatorAuth()
        const router = useRouter()

        React.useEffect(() => {
            if (!isLoading && !creator) {
                toast.error("Debes iniciar sesión para acceder a esta página.")
                router.replace("/creators/login")
            }
        }, [isLoading, creator, router])

        if (isLoading || !creator) {
            return (
                <div className="flex h-screen w-full items-center justify-center bg-background">
                    <Toaster richColors />
                    <div className="flex flex-col items-center gap-4">
                        <IconLoader className="size-12 animate-spin text-primary" />
                        <p className="text-muted-foreground">Cargando y verificando sesión...</p>
                    </div>
                </div>
            )
        }

        return <Component {...props} />
    }
}
