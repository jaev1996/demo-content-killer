"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { IconSkull } from "@tabler/icons-react"

/**
 * Un componente de orden superior (HOC) que protege una ruta,
 * asegurando que solo los usuarios autenticados puedan acceder a ella.
 *
 * @param Component El componente de la página a proteger.
 */
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
    return function WithAuth(props: P) {
        const router = useRouter()
        const [isLoading, setIsLoading] = React.useState(true)

        React.useEffect(() => {
            const token = localStorage.getItem("authToken")
            if (!token) {
                router.replace("/") // Redirige al login si no hay token
            } else {
                setIsLoading(false) // El usuario está autenticado
            }
        }, [router])

        if (isLoading) {
            return (
                <div className="flex h-screen w-full items-center justify-center bg-background">
                    <div className="flex flex-col items-center gap-4">
                        <IconSkull className="size-12 animate-pulse" />
                        <p className="text-muted-foreground">Verificando sesión...</p>
                    </div>
                </div>
            )
        }

        return <Component {...props} />
    }
}