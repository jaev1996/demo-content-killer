"use client"

import * as React from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { useAuth } from "@/contexts/auth-context"

/**
 * Un componente de orden superior (HOC) que protege una ruta,
 * asegurando que solo los usuarios autenticados puedan acceder a ella.
 *
 * @param Component El componente de la página a proteger.
 */
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
    return function WithAuth(props: P) {
        const { user, isLoading } = useAuth()

        React.useEffect(() => {
            if (!isLoading && !user) {
                // La redirección ahora se maneja en el AuthContext o en el RoleProtectedRoute
                // Aquí solo nos aseguramos de no renderizar el componente si no hay usuario.
            }
        }, [isLoading, user])

        if (isLoading || !user) {
            return (
                <div className="flex h-screen w-full items-center justify-center bg-background">
                    <div className="flex flex-col items-center gap-4">
                        <IconLoader2 className="size-12 animate-spin text-primary" />
                        <p className="text-muted-foreground">Cargando...</p>
                    </div>
                </div>
            )
        }

        return <Component {...props} />
    }
}