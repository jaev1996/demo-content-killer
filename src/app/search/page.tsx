"use client"

import { withAuth } from "@/components/with-auth"
import { apiFetch } from "@/lib/api"
import { IconSearch, IconAlertTriangle, IconShield, IconTrash, IconFilter, IconX } from "@tabler/icons-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Toaster, toast } from "sonner"

// Interfaces
interface Profile {
    id: string;
    creatorName: string;
    whitelist: string[];
    createdAt: string;
    updatedAt: string;
    settings: {
        autoFilter: boolean;
        strictMode: boolean;
    };
}

interface ProfilesResponse {
    data: Profile[];
    count: number;
}

interface ApiResult {
    title: string;
    url: string;
    snippet: string;
}

// Función para determinar si un enlace es sospechoso
const isSuspiciousLink = (url: string, title: string, snippet: string): boolean => {
    const suspiciousKeywords = [
        'descargar', 'gratis', 'filtrado', 'leaked', 'onlyfans', 'pack',
        'telegram', 'mega', 'mediafire', 'drive.google', 'dropbox',
        'xxx', 'porn', 'adult', 'nude', 'naked', 'sex'
    ]

    const text = `${url} ${title} ${snippet}`.toLowerCase()
    return suspiciousKeywords.some(keyword => text.includes(keyword))
}

// Función para obtener el nivel de riesgo
const getRiskLevel = (url: string, title: string, snippet: string): 'high' | 'medium' | 'low' => {
    const highRiskKeywords = ['leaked', 'filtrado', 'pack', 'onlyfans', 'telegram']
    const mediumRiskKeywords = ['descargar', 'gratis', 'mega', 'drive']

    const text = `${url} ${title} ${snippet}`.toLowerCase()

    if (highRiskKeywords.some(keyword => text.includes(keyword))) return 'high'
    if (mediumRiskKeywords.some(keyword => text.includes(keyword))) return 'medium'
    return 'low'
}

function SearchPage() {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [selectedCreator, setSelectedCreator] = React.useState("")
    const [apiResults, setApiResults] = React.useState<ApiResult[] | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    // Estados para perfiles
    const [profiles, setProfiles] = React.useState<Profile[]>([])
    const [filteredProfiles, setFilteredProfiles] = React.useState<Profile[]>([])
    const [profileFilter, setProfileFilter] = React.useState("")
    const [loadingProfiles, setLoadingProfiles] = React.useState(false)

    // Cargar perfiles al montar el componente
    React.useEffect(() => {
        const fetchProfiles = async () => {
            setLoadingProfiles(true)
            try {
                const response = await apiFetch('/api/profiles')
                if (!response.ok) throw new Error('Error al cargar perfiles')
                const data: ProfilesResponse = await response.json()
                setProfiles(data.data)
                setFilteredProfiles(data.data)
            } catch (err) {
                console.error('Error cargando perfiles:', err)
                // Si hay error, usar datos de fallback (si existen)
                setProfiles([])
                setFilteredProfiles([])
            } finally {
                setLoadingProfiles(false)
            }
        }

        fetchProfiles()
    }, [])

    // Filtrar perfiles cuando cambie el texto del filtro
    React.useEffect(() => {
        if (!profileFilter.trim()) {
            setFilteredProfiles(profiles)
        } else {
            const filtered = profiles.filter(profile =>
                profile.creatorName.toLowerCase().includes(profileFilter.toLowerCase()) ||
                profile.id.toLowerCase().includes(profileFilter.toLowerCase())
            )
            setFilteredProfiles(filtered)
        }
    }, [profileFilter, profiles])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!selectedCreator) {
            setError('Por favor selecciona una creadora')
            return
        }

        if (!searchTerm.trim()) {
            setError('Por favor ingresa términos de búsqueda')
            return
        }

        setLoading(true)
        setError(null)
        setApiResults(null)

        try {
            // Construir la URL con el creador seleccionado
            const searchQuery = encodeURIComponent(searchTerm.trim())
            const response = await apiFetch(`/api/search/${selectedCreator}?q=${searchQuery}`)

            if (!response.ok) {
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData && errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (jsonError) { /* No se pudo parsear JSON, usar mensaje por defecto */ }
                throw new Error(errorMessage);
            }

            const data = await response.json()

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
                setError('Error desconocido al realizar la búsqueda')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleRequestRemoval = async (url: string) => {
        if (!selectedCreator) {
            toast.error("Por favor, selecciona una creadora primero.")
            return
        }
        try {
            const response = await apiFetch('/api/takedowns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ infringingUrl: url, userProfileId: selectedCreator, sourceQuery: searchTerm }),
            })
            if (!response.ok) {
                throw new Error('Error al enviar la solicitud de retiro.')
            }
            toast.success(`Solicitud de retiro enviada para: ${url}`)
            // Eliminar el resultado de la lista para evitar duplicados
            setApiResults(prevResults => prevResults?.filter(result => result.url !== url) || null)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Ocurrió un error desconocido.')
        }
    }

    const handleAddToWhitelist = async (url: string) => {
        if (!selectedCreator) {
            toast.error("Por favor, selecciona una creadora primero.");
            return;
        }

        try {
            // Extraemos el dominio de la URL para añadirlo a la whitelist.
            const domain = new URL(url).hostname.replace(/^www\./, '');

            const response = await apiFetch(`/api/profiles/${selectedCreator}/whitelist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain: domain }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al añadir a la whitelist.');
            }

            toast.success(`Dominio "${domain}" añadido a la whitelist.`);

            // Opcional: Actualizar el estado local para reflejar el cambio en la UI
            setProfiles(prev => prev.map(p => p.id === selectedCreator ? { ...p, whitelist: [...p.whitelist, domain] } : p));

        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        }
    };

    const clearProfileFilter = () => {
        setProfileFilter("")
    }

    const selectedProfile = profiles.find(p => p.id === selectedCreator)

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Toaster richColors />
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
                                                Términos de búsqueda
                                            </Label>
                                            <Textarea
                                                id="search"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Ej: nombre de la creadora pack, videos filtrados de..., contenido exclusivo..."
                                                rows={3}
                                                required
                                            />
                                        </div>

                                        <div className="grid gap-3">
                                            <Label>Creadora de Contenido</Label>

                                            {/* Filtro de perfiles */}
                                            <div className="relative">
                                                <IconFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                                                <Input
                                                    placeholder="Filtrar creadoras..."
                                                    value={profileFilter}
                                                    onChange={(e) => setProfileFilter(e.target.value)}
                                                    className="pl-9 pr-9"
                                                />
                                                {profileFilter && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={clearProfileFilter}
                                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                                                    >
                                                        <IconX className="size-3" />
                                                    </Button>
                                                )}
                                            </div>

                                            <Select
                                                onValueChange={setSelectedCreator}
                                                value={selectedCreator}
                                                disabled={loadingProfiles}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            loadingProfiles
                                                                ? "Cargando perfiles..."
                                                                : filteredProfiles.length === 0 && profileFilter
                                                                    ? "No se encontraron perfiles"
                                                                    : "Selecciona una creadora"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredProfiles.map((profile) => (
                                                        <SelectItem key={profile.id} value={profile.id}>
                                                            <div className="flex items-center justify-between w-full">
                                                                <span>{profile.creatorName}</span>
                                                                <Badge variant="secondary" className="ml-2 text-xs">
                                                                    {profile.id}
                                                                </Badge>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                    {filteredProfiles.length === 0 && !loadingProfiles && (
                                                        <div className="px-2 py-1 text-sm text-muted-foreground">
                                                            {profileFilter
                                                                ? "No se encontraron perfiles que coincidan"
                                                                : "No hay perfiles disponibles"
                                                            }
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>

                                            {/* Información del perfil seleccionado */}
                                            {selectedProfile && (
                                                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline">{selectedProfile.id}</Badge>
                                                        <span className="text-muted-foreground">•</span>
                                                        <span>
                                                            {selectedProfile.settings?.autoFilter ? 'Filtro automático activado' : 'Filtro manual'}
                                                        </span>
                                                        {selectedProfile.settings?.strictMode && (
                                                            <>
                                                                <span className="text-muted-foreground">•</span>
                                                                <Badge variant="secondary" className="text-xs">Modo estricto</Badge>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Whitelist: {selectedProfile.whitelist?.length || 0} sitios permitidos
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <Button type="submit" className="w-fit" disabled={loading || !selectedCreator}>
                                            <IconSearch className="mr-2 size-4" />
                                            {loading ? 'Buscando...' : 'Iniciar Búsqueda'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Estado de carga */}
                            {loading && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Buscando resultados...</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-muted-foreground">
                                            Analizando contenido para <strong>{selectedProfile?.creatorName}</strong>.
                                            Por favor espera y valida el captcha si es necesario.
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Errores */}
                            {error && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-destructive">Error</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-destructive">{error}</div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Resultados de la API externa */}
                            {apiResults && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Resultados de la Búsqueda</CardTitle>
                                        <CardDescription>
                                            {apiResults.length} resultado(s) encontrado(s) para <strong>{selectedProfile?.creatorName}</strong>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {apiResults.length === 0 ? (
                                            <div className="text-muted-foreground text-center py-8">
                                                No se encontraron resultados para los términos de búsqueda especificados.
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {apiResults.map((result, idx) => {
                                                    const isSuspicious = isSuspiciousLink(result.url, result.title, result.snippet)
                                                    const riskLevel = getRiskLevel(result.url, result.title, result.snippet)

                                                    return (
                                                        <Card
                                                            key={idx}
                                                            className={`transition-all hover:shadow-md ${isSuspicious
                                                                ? riskLevel === 'high'
                                                                    ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                                                                    : riskLevel === 'medium'
                                                                        ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20'
                                                                        : 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20'
                                                                : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                                                                }`}
                                                        >
                                                            <CardHeader className="pb-3">
                                                                <div className="flex items-start justify-between gap-4">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            {isSuspicious && (
                                                                                <IconAlertTriangle
                                                                                    className={`size-4 flex-shrink-0 ${riskLevel === 'high'
                                                                                        ? 'text-red-500'
                                                                                        : riskLevel === 'medium'
                                                                                            ? 'text-yellow-500'
                                                                                            : 'text-orange-500'
                                                                                        }`}
                                                                                />
                                                                            )}
                                                                            <Badge
                                                                                variant={
                                                                                    riskLevel === 'high'
                                                                                        ? 'destructive'
                                                                                        : riskLevel === 'medium'
                                                                                            ? 'secondary'
                                                                                            : isSuspicious
                                                                                                ? 'outline'
                                                                                                : 'default'
                                                                                }
                                                                                className={
                                                                                    riskLevel === 'medium'
                                                                                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100'
                                                                                        : riskLevel === 'low' && isSuspicious
                                                                                            ? 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-100'
                                                                                            : !isSuspicious
                                                                                                ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100'
                                                                                                : ''
                                                                                }
                                                                            >
                                                                                {riskLevel === 'high'
                                                                                    ? 'Alto Riesgo'
                                                                                    : riskLevel === 'medium'
                                                                                        ? 'Riesgo Medio'
                                                                                        : isSuspicious
                                                                                            ? 'Riesgo Bajo'
                                                                                            : 'Seguro'
                                                                                }
                                                                            </Badge>
                                                                        </div>
                                                                        <CardTitle className="text-base leading-tight break-words">
                                                                            {result.title}
                                                                        </CardTitle>
                                                                    </div>
                                                                </div>
                                                                <CardDescription className="space-y-2">
                                                                    <a
                                                                        href={result.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300 text-sm break-all"
                                                                    >
                                                                        {result.url}
                                                                    </a>
                                                                    {result.snippet && (
                                                                        <div className="text-sm text-muted-foreground leading-relaxed">
                                                                            {result.snippet}
                                                                        </div>
                                                                    )}
                                                                </CardDescription>
                                                            </CardHeader>
                                                            <CardFooter className="pt-0">
                                                                <div className="flex gap-2 w-full">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleAddToWhitelist(result.url)}
                                                                        className="flex-1"
                                                                    >
                                                                        <IconShield className="mr-2 size-3" />
                                                                        Añadir a Whitelist
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleRequestRemoval(result.url)}
                                                                        className="flex-1"
                                                                        variant={isSuspicious ? "destructive" : "default"}
                                                                    >
                                                                        <IconTrash className="mr-2 size-3" />
                                                                        Solicitar Retiro
                                                                    </Button>
                                                                </div>
                                                            </CardFooter>
                                                        </Card>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default withAuth(SearchPage)