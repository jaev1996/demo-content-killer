"use client"

import { IconSearch } from "@tabler/icons-react"
import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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


// Para resultados de la API externa
interface ApiResult {
    title: string;
    url: string;
    snippet: string;
}

interface SearchResult {
    id: string;
    url: string;
    siteName: string;
    status: string;
}


export default function SearchPage() {
    const [searchTerm, setSearchTerm] = React.useState("descargar gratis peliculas")
    const [selectedCreator, setSelectedCreator] = React.useState("")
    const [searchResults, setSearchResults] = React.useState<SearchResult[]>([])
    // Para resultados de la API externa
    const [apiResults, setApiResults] = React.useState<ApiResult[] | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setLoading(true)
        setError(null)
        setApiResults(null)
        try {
            // Cambia la URL por la de tu API real
            const response = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(searchTerm)}`);
            if (!response.ok) throw new Error('Error en la petición')
            const data = await response.json();
            // Si la API retorna un objeto con "results"
            if (data && Array.isArray(data.results)) {
                setApiResults(data.results)
            } else {
                setApiResults([])
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Error desconocido')
            } else {
                setError('Error desconocido')
            }
        } finally {
            setLoading(false)
        }
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

                            {/* Resultados de la API externa */}
                            {loading && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Buscando resultados...</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-muted-foreground">Cargando resultados, por favor espera y valida el captcha si es necesario.</div>
                                    </CardContent>
                                </Card>
                            )}
                            {error && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Error</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-destructive">{error}</div>
                                    </CardContent>
                                </Card>
                            )}
                            {apiResults && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Resultados de la Búsqueda</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                        {apiResults.length === 0 && (
                                            <div className="text-muted-foreground">No se encontraron resultados.</div>
                                        )}
                                        {apiResults.map((result, idx) => (
                                            <Card key={idx}>
                                                <CardHeader>
                                                    <CardTitle>{result.title}</CardTitle>
                                                    <CardDescription>
                                                        <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                            {result.url}
                                                        </a>
                                                        {result.snippet && <div className="mt-2 text-sm text-muted-foreground">{result.snippet}</div>}
                                                    </CardDescription>
                                                </CardHeader>
                                            </Card>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                            {/* Resultados internos (si los necesitas) */}
                            {searchResults.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Resultados de la Búsqueda (Internos)</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                        {searchResults.map((result) => (
                                            <Card key={result.id}>
                                                <CardHeader>
                                                    <CardTitle>{result.siteName}</CardTitle>
                                                    <CardDescription>
                                                        <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                            {result.url}
                                                        </a>
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardFooter className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm">Añadir a Whitelist</Button>
                                                    <Button size="sm">Solicitar Retiro</Button>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

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