"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { IconLock } from "@tabler/icons-react"
import { toast } from "sonner"

type Role = "super_admin" | "admin" | "viewer"

/**
 * Un componente de orden superior (HOC) que protege una ruta,
 * asegurando que solo los usuarios con un rol específico puedan acceder a ella.
 *
 * @param Component El componente de la página a proteger.
 * @param allowedRoles Un array de roles permitidos para acceder a la página.
 */
export function withRoleProtection<P extends object>(
    Component: React.ComponentType<P>,
    allowedRoles: Role[]
) {
    return function WithRoleProtection(props: P) {
        const { user, isLoading } = useAuth()
        const router = useRouter()

        React.useEffect(() => {
            if (!isLoading && (!user || !allowedRoles.includes(user.role))) {
                toast.error("No tienes permiso para acceder a esta página.")
                router.replace("/dashboard")
            }
        }, [isLoading, user, router])

        if (isLoading || !user || !allowedRoles.includes(user.role)) {
            return (
                <div className="flex h-screen w-full items-center justify-center bg-background">
                    <div className="flex flex-col items-center gap-4">
                        <IconLock className="size-12 animate-pulse text-primary" />
                        <p className="text-muted-foreground">Verificando permisos...</p>
                    </div>
                </div>
            )
        }

        return <Component {...props} />
    }
}