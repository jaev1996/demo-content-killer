"use client"

import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiFetch } from "@/lib/api"
import { withAuth } from "@/components/with-auth"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { IconLoader } from "@tabler/icons-react"
import { toast } from "sonner"

const roleLabels: Record<string, string> = {
    super_admin: "Super Administrador",
    admin: "Administrador",
    viewer: "Visualizador",
}

function ProfilePage() {
    const { user, updateUser } = useAuth()
    const [formData, setFormData] = React.useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        password: "",
    })
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    React.useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName,
                email: user.email,
                password: "",
            })
        }
    }, [user])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setIsSubmitting(true)
        try {
            const dataToUpdate: any = {
                fullName: formData.fullName,
                email: formData.email,
            }

            if (formData.password) {
                dataToUpdate.password = formData.password
            }

            const response = await apiFetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToUpdate),
            })

            const result = await response.json()
            if (!response.ok) {
                throw new Error(result.message || "Error al actualizar el perfil.")
            }

            // Actualizar el contexto global y resetear el campo de contraseña
            updateUser(result.user)
            setFormData(prev => ({ ...prev, password: "" }))

            toast.success("Perfil actualizado exitosamente.")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error desconocido")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!user) {
        return null // o un spinner, ya que withAuth se encarga de la carga
    }

    return (
        <AppLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
                <p className="text-muted-foreground">
                    Gestiona tu información personal y tu contraseña.
                </p>
            </div>

            <Card className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Información de la Cuenta</CardTitle>
                        <CardDescription>
                            Tu rol actual es <Badge variant="secondary">{roleLabels[user.role]}</Badge>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Usuario</Label>
                            <Input id="username" value={user.username} readOnly disabled />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Nombre Completo</Label>
                            <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Nueva Contraseña</Label>
                            <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Dejar en blanco para no cambiar" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <IconLoader className="mr-2 size-4 animate-spin" />}
                            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </AppLayout>
    )
}

export default withAuth(ProfilePage)

