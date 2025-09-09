"use client"

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
import { IconPlus, IconTrash } from "@tabler/icons-react"

import profilesData from "./profiles.json"

export default function ProfilesPage() {
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
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="socialMediaUser">
                                            Usuario en Redes Sociales
                                        </Label>
                                        <Input
                                            id="socialMediaUser"
                                            placeholder="Ej: @elena_v"
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
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            URLs donde el contenido es legal y no debe ser reclamado.
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">
                                        <IconPlus className="mr-2 size-4" />
                                        Guardar Perfil
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                        {/* Columna de la Tabla */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Perfiles Existentes</CardTitle>
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
                                            {profilesData.map((profile) => (
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
                            </Card>
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}