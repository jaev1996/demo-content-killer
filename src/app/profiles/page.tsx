"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar" 
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
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
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea" 
import { IconChevronDown, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react"

import profilesData from "./profiles.json"

export default function ProfilesPage() {
    const [profiles, setProfiles] = React.useState(profilesData)
    const [newCreatorName, setNewCreatorName] = React.useState("")
    const [newSocialMediaUser, setNewSocialMediaUser] = React.useState("")
    const [newWhitelist, setNewWhitelist] = React.useState("")

    const [searchTerm, setSearchTerm] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState<string[]>([
        "active",
        "inactive",
    ])
    const [currentPage, setCurrentPage] = React.useState(1)
    const profilesPerPage = 5

    const filteredProfiles = profiles
        .filter((profile) =>
            profile.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            profile.socialMediaUser.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((profile) => statusFilter.includes(profile.status))

    const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage)
    const paginatedProfiles = filteredProfiles.slice(
        (currentPage - 1) * profilesPerPage,
        currentPage * profilesPerPage
    )

    const handleStatusChange = (status: string) => {
        setStatusFilter((prev) =>
            prev.includes(status)
                ? prev.filter((s) => s !== status)
                : [...prev, status]
        )
    }

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCreatorName || !newSocialMediaUser) {
            // Podrías agregar una notificación aquí para el usuario
            return
        }

        const newProfile = {
            id: `profile-${Date.now()}`,
            creatorName: newCreatorName,
            socialMediaUser: newSocialMediaUser,
            whitelist: newWhitelist.split("\n").filter((url) => url.trim() !== ""),
            status: "active", // Por defecto, los nuevos perfiles están activos
        }

        setProfiles([newProfile, ...profiles])

        // Limpiar el formulario
        setNewCreatorName("")
        setNewSocialMediaUser("")
        setNewWhitelist("")
    }

    React.useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, statusFilter])

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Perfiles de Cliente
                        </h1>
                        <p className="text-muted-foreground">
                            Crea y gestiona los perfiles de las creadoras de contenido.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Columna del Formulario */}
                        <div className="lg:col-span-1">
                            <form onSubmit={handleSaveProfile}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Crear Nuevo Perfil</CardTitle>
                                        <CardDescription>
                                            Añade una nueva creadora a la plataforma.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="creatorName">Nombre de la Creadora</Label>
                                            <Input
                                                id="creatorName"
                                                placeholder="Ej: Elena Valera"
                                                value={newCreatorName}
                                                onChange={(e) => setNewCreatorName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="socialMediaUser">
                                                Usuario en Redes Sociales
                                            </Label>
                                            <Input
                                                id="socialMediaUser"
                                                placeholder="Ej: @elena_v"
                                                value={newSocialMediaUser}
                                                onChange={(e) => setNewSocialMediaUser(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="whitelist">
                                                Whitelist de Sitios (uno por línea)
                                            </Label>
                                            <Textarea
                                                id="whitelist"
                                                placeholder="https://youtube.com/elenavalera&#10;https://patreon.com/elenavalera"
                                                rows={4}
                                                value={newWhitelist}
                                                onChange={(e) => setNewWhitelist(e.target.value)}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                URLs donde el contenido es legal y no debe ser reclamado.
                                            </p>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" className="w-full">
                                            <IconPlus className="mr-2 size-4" />
                                            Guardar Perfil
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </div>

                        {/* Columna de la Tabla */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <CardTitle>Perfiles Existentes</CardTitle>
                                            <CardDescription>
                                                Gestiona los perfiles de las creadoras.
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Buscar por nombre o usuario..."
                                                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="flex gap-1">
                                                        Filtrar
                                                        <IconChevronDown className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuCheckboxItem checked={statusFilter.includes("active")} onCheckedChange={() => handleStatusChange("active")}>
                                                        Activo
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem checked={statusFilter.includes("inactive")} onCheckedChange={() => handleStatusChange("inactive")}>
                                                        Inactivo
                                                    </DropdownMenuCheckboxItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nombre</TableHead>
                                                <TableHead>Usuario</TableHead>
                                                <TableHead>Sitios en Whitelist</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedProfiles.map((profile) => (
                                                <TableRow key={profile.id}>
                                                    <TableCell className="font-medium">
                                                        {profile.creatorName}
                                                    </TableCell>
                                                    <TableCell>{profile.socialMediaUser}</TableCell>
                                                    <TableCell>{profile.whitelist.length}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                profile.status === "active"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {profile.status === "active"
                                                                ? "Activo"
                                                                : "Inactivo"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon">
                                                            <IconTrash className="size-4" />
                                                            <span className="sr-only">Eliminar</span>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter className="flex items-center justify-between">
                                    <div className="text-xs text-muted-foreground">
                                        Mostrando <strong>{paginatedProfiles.length}</strong> de{" "}
                                        <strong>{filteredProfiles.length}</strong> perfiles
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Anterior
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Siguiente
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}