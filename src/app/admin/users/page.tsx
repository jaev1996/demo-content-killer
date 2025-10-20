"use client"

import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiFetch } from "@/lib/api"
import { withAuth } from "@/components/with-auth"
import { withRoleProtection } from "@/components/with-role-protection"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogClose,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { IconLoader, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

interface User {
    id: string
    username: string
    email: string
    fullName: string
    role: "super_admin" | "admin" | "viewer"
    password?: string
}

const roleLabels: Record<User["role"], string> = {
    super_admin: "Super Administrador",
    admin: "Administrador",
    viewer: "Visualizador",
}

function UsersAdminPage() {
    const { user: currentUser } = useAuth()
    const [users, setUsers] = React.useState<User[]>([])
    const [loading, setLoading] = React.useState(true)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)

    // Estado para el formulario de creación
    const [newUser, setNewUser] = React.useState({
        username: "",
        email: "",
        password: "",
        fullName: "",
        role: "viewer" as "admin" | "viewer",
    })

    // Estados para edición
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
    const [editingUser, setEditingUser] = React.useState<User | null>(null)

    // Estados para eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [deletingUser, setDeletingUser] = React.useState<User | null>(null)

    const fetchUsers = React.useCallback(async () => {
        setLoading(true)
        try {
            const response = await apiFetch("/api/users")
            if (!response.ok) throw new Error("Error al cargar los usuarios.")
            const data = await response.json()
            setUsers(data.users || [])
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error desconocido")
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewUser(prev => ({ ...prev, [name]: value }))
    }

    const handleCreateRoleChange = (value: "admin" | "viewer") => {
        setNewUser(prev => ({ ...prev, role: value }))
    }

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingUser) return
        const { name, value } = e.target
        setEditingUser({ ...editingUser, [name]: value })
    }
    const handleEditRoleChange = (value: "admin" | "viewer") => {
        if (!editingUser) return
        setEditingUser({ ...editingUser, role: value })
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await apiFetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            })

            const result = await response.json()
            if (!response.ok) {
                throw new Error(result.message || "Error al crear el usuario.")
            }

            toast.success(`Usuario "${result.user.username}" creado exitosamente.`)
            setIsCreateModalOpen(false)
            setNewUser({ username: "", email: "", password: "", fullName: "", role: "viewer" }) // Reset form
            fetchUsers() // Recargar la lista de usuarios
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error desconocido")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingUser) return

        setIsSubmitting(true)
        try {
            // Clonar el usuario y eliminar la contraseña si está vacía
            const userDataToUpdate: Partial<User> = { ...editingUser }
            if (userDataToUpdate.password === "") {
                delete userDataToUpdate.password
            }

            const response = await apiFetch(`/api/users/${editingUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userDataToUpdate),
            })

            const result = await response.json()
            if (!response.ok) {
                throw new Error(result.message || "Error al actualizar el usuario.")
            }

            toast.success(`Usuario "${result.user.username}" actualizado exitosamente.`)
            setIsEditModalOpen(false)
            setEditingUser(null)
            fetchUsers()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error desconocido")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteUser = async () => {
        if (!deletingUser) return

        setIsSubmitting(true)
        try {
            const response = await apiFetch(`/api/users/${deletingUser.id}`, { method: "DELETE" })
            if (!response.ok) throw new Error("Error al eliminar el usuario.")

            toast.success(`Usuario "${deletingUser.username}" eliminado.`)
            setIsDeleteModalOpen(false)
            setDeletingUser(null)
            fetchUsers()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error desconocido")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AppLayout>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Gestión de Usuarios
                    </h1>
                    <p className="text-muted-foreground">
                        Crea, edita y elimina usuarios y sus roles.
                    </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <IconPlus className="mr-2 size-4" />
                    Crear Nuevo Usuario
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Usuarios</CardTitle>
                    <CardDescription>
                        Total de usuarios en el sistema: {users.length}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Nombre Completo</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <IconLoader className="mx-auto animate-spin" />
                                    </TableCell>
                                </TableRow>
                            ) : users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'super_admin' ? 'destructive' : user.role === 'admin' ? 'secondary' : 'outline'}>
                                            {roleLabels[user.role]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingUser({ ...user, password: '' }); setIsEditModalOpen(true); }}>
                                            <IconEdit className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => { setDeletingUser(user); setIsDeleteModalOpen(true); }}
                                            disabled={user.id === currentUser?.id}
                                            title={user.id === currentUser?.id ? "No puedes eliminarte a ti mismo" : "Eliminar usuario"}
                                        >
                                            <IconTrash className="size-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal de Creación de Usuario */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleCreateUser}>
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                            <DialogDescription>
                                Completa los datos para añadir un nuevo usuario al sistema.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">Usuario</Label>
                                <Input id="username" name="username" value={newUser.username} onChange={handleCreateInputChange} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input id="email" name="email" type="email" value={newUser.email} onChange={handleCreateInputChange} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">Contraseña</Label>
                                <Input id="password" name="password" type="password" value={newUser.password} onChange={handleCreateInputChange} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="fullName" className="text-right">Nombre Completo</Label>
                                <Input id="fullName" name="fullName" value={newUser.fullName} onChange={handleCreateInputChange} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">Rol</Label>
                                <Select name="role" onValueChange={handleCreateRoleChange} defaultValue={newUser.role}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Selecciona un rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Administrador</SelectItem>
                                        <SelectItem value="viewer">Visualizador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <IconLoader className="mr-2 size-4 animate-spin" />}
                                {isSubmitting ? "Creando..." : "Crear Usuario"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal de Edición de Usuario */}
            {editingUser && (
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleUpdateUser}>
                            <DialogHeader>
                                <DialogTitle>Editar Usuario</DialogTitle>
                                <DialogDescription>
                                    Actualiza los datos del usuario. Deja la contraseña en blanco para no cambiarla.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-username" className="text-right">Usuario</Label>
                                    <Input id="edit-username" name="username" value={editingUser.username} onChange={handleEditInputChange} className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-email" className="text-right">Email</Label>
                                    <Input id="edit-email" name="email" type="email" value={editingUser.email} onChange={handleEditInputChange} className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-password" className="text-right">Nueva Contraseña</Label>
                                    <Input id="edit-password" name="password" type="password" value={editingUser.password} onChange={handleEditInputChange} className="col-span-3" placeholder="Dejar en blanco para no cambiar" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-fullName" className="text-right">Nombre Completo</Label>
                                    <Input id="edit-fullName" name="fullName" value={editingUser.fullName} onChange={handleEditInputChange} className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-role" className="text-right">Rol</Label>
                                    <Select name="role" onValueChange={handleEditRoleChange} value={editingUser.role} disabled={editingUser.role === 'super_admin'}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                            <SelectItem value="viewer">Visualizador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <IconLoader className="mr-2 size-4 animate-spin" />}
                                    {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {/* Modal de Confirmación de Eliminación */}
            {deletingUser && (
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>¿Estás seguro?</DialogTitle>
                            <DialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente al usuario <span className="font-bold">{deletingUser.username}</span>.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={handleDeleteUser} disabled={isSubmitting}>
                                {isSubmitting && <IconLoader className="mr-2 size-4 animate-spin" />}
                                Eliminar Usuario
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </AppLayout>
    )
}

export default withAuth(withRoleProtection(UsersAdminPage, ["super_admin"]))
