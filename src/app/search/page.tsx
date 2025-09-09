"use client"

import { IconSearch } from "@tabler/icons-react"
import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import profilesData from "../profiles/profiles.json"


export default function SearchPage() {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [selectedCreator, setSelectedCreator] = React.useState("")
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        alert("Solicitud en proceso... Estamos buscando el contenido solicitado. Por favor, espere.")

        // Aquí iría la lógica real para buscar el contenido,
        // que podría incluir una llamada a una API.

        //Simulación de una búsqueda
        await new Promise((resolve) => setTimeout(resolve, 2000))

        alert("Búsqueda Completa: La búsqueda de contenido ha finalizado.")
    }

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto grid w-full max-w-4xl gap-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Búsqueda de Contenido
                            </h1>
                            <p className="text-muted-foreground">
                                Inicia un nuevo rastreo de contenido para una creadora.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Nuevo Rastreo</CardTitle>
                                    <CardDescription>
                                        Ingresa los términos de búsqueda y selecciona la creadora.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="search">
                                                Términos de búsqueda (uno por línea)
                                            </Label>
                                            <Textarea
                                                id="search"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Ej: video filtrado, contenido exclusivo..."
                                                rows={3}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="creator">Creadora de Contenido</Label>
                                            <Select onValueChange={setSelectedCreator} value={selectedCreator}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona una creadora" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {profilesData.map((profile) => (
                                                        <SelectItem key={profile.id} value={profile.id}>{profile.creatorName}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button type="submit" className="w-fit">
                                            <IconSearch className="mr-2 size-4" />
                                            Iniciar Búsqueda
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Búsquedas Recientes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Creadora</TableHead>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Estado</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {/* Aquí irían los datos de búsquedas reales */}
                                            <TableRow>
                                                <TableCell className="font-medium">Elena Valera</TableCell>
                                                <TableCell>24 de Julio, 2024</TableCell>
                                                <TableCell>Completada</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Sofia Reyes</TableCell>
                                                <TableCell>23 de Julio, 2024</TableCell>
                                                <TableCell>Completada</TableCell>
                                            </TableRow>
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