"use client"

import { withAuth } from "@/components/with-auth"
import { apiFetch } from "@/lib/api"
import { IconSearch, IconAlertTriangle, IconShield, IconTrash, IconFilter, IconX, IconLoader, IconHelpCircle } from "@tabler/icons-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
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

interface SearchResult {
    title: string;
    link: string;
    description: string;
}

// Función para determinar si un enlace es sospechoso
const isSuspiciousLink = (url: string, title: string, snippet: string): boolean => {
    const suspiciousKeywords = [
        'descargar', 'gratis', 'filtrado', 'leaked', 'onlyfans', 'pack',
        'telegram', 'mega', 'mediafire', 'drive.google', 'dropbox',
        'xxx', 'porn', 'adult', 'nude', 'naked', 'sex', 'full', 'censura',
        'escandalo', 'privado', 'vip', 'premium', 'estreno', 'completo',
        'video', 'videos', 'tube', 'fucks', 'fuck', 'hole', 'dildo', 'cock',
        'lube', 'solo', 'toys', 'play', 'amateur', 'webcam', 'cam', 'show',
        'hub', 'porno', 'leak', 'files', 'folder'
    ]

    const text = `${url} ${title} ${snippet}`.toLowerCase()
    return suspiciousKeywords.some(keyword => text.includes(keyword))
}

// Función para obtener el nivel de riesgo mejorada
const getRiskLevel = (url: string, title: string, snippet: string): 'high' | 'medium' | 'low' => {
    const highRiskKeywords = [
        'leaked', 'filtrado', 'pack', 'onlyfans', 'telegram', 'mega', 'drive',
        'mega.nz', 'mediafire', 'leak', 'files', 'folder', 'dropbox'
    ]
    const mediumRiskKeywords = [
        'descargar', 'gratis', 'xxx', 'porn', 'nude', 'censura', 'completo',
        'full', 'fucks', 'fuck', 'hole', 'dildo', 'cock', 'lube', 'solo',
        'toys', 'webcam', 'cam', 'show', 'hub', 'porno', 'tube', 'amateur'
    ]

    const text = `${url} ${title} ${snippet}`.toLowerCase()

    if (highRiskKeywords.some(keyword => text.includes(keyword))) return 'high'
    if (mediumRiskKeywords.some(keyword => text.includes(keyword))) return 'medium'
    return 'low'
}

function SearchPage() {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [selectedCreator, setSelectedCreator] = React.useState("")
    const [apiResults, setApiResults] = React.useState<SearchResult[] | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [selectedUrls, setSelectedUrls] = React.useState<Set<string>>(new Set())
    const [isBatchProcessing, setIsBatchProcessing] = React.useState(false)

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

        // Reiniciar estados
        setLoading(true)
        setError(null)
        setApiResults(null)
        toast.info("Iniciando búsqueda...");

        try {
            const response = await apiFetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userProfileId: selectedCreator,
                    query: searchTerm.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Ocurrió un error en la búsqueda.");
            }

            // Filtrar resultados según la whitelist del creador seleccionado
            let results = data.results || [];
            const creatorWhitelist = selectedProfile?.whitelist || [];

            if (creatorWhitelist.length > 0) {
                results = results.filter((result: SearchResult) => {
                    try {
                        const urlDomain = new URL(result.link).hostname.replace(/^www\./, '').toLowerCase();
                        return !creatorWhitelist.some(whiteDomain =>
                            urlDomain === whiteDomain.toLowerCase() ||
                            urlDomain.endsWith(`.${whiteDomain.toLowerCase()}`)
                        );
                    } catch {
                        return true; // Si la URL no es válida, la dejamos pasar para revisión manual
                    }
                });
            }

            setApiResults(results);
            const filteredCount = results.length;
            const hiddenCount = (data.results?.length || 0) - filteredCount;

            toast.success(`Búsqueda completada. Se muestran ${filteredCount} resultados.${hiddenCount > 0 ? ` (${hiddenCount} omitidos por whitelist)` : ''}`);

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al realizar la búsqueda';
            setError(errorMessage);
            toast.error(errorMessage);
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
            setApiResults(prevResults => prevResults?.filter(result => result.link !== url) || null)
            // Quitar de seleccionados si estaba
            setSelectedUrls(prev => {
                const newSet = new Set(prev);
                newSet.delete(url);
                return newSet;
            });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Ocurrió un error desconocido.')
        }
    }

    const handleBatchRequestRemoval = async () => {
        if (!selectedCreator) {
            toast.error("Por favor, selecciona una creadora primero.");
            return;
        }

        if (selectedUrls.size === 0) {
            toast.error("No hay enlaces seleccionados.");
            return;
        }

        setIsBatchProcessing(true);
        const urlsArray = Array.from(selectedUrls);
        let successCount = 0;
        let failCount = 0;

        toast.info(`Procesando ${urlsArray.length} solicitudes...`);

        try {
            // Nota: El backend por ahora recibe una por una, pero el frontend ya lo gestiona como lote.
            // En una etapa posterior, el backend podría recibir el array completo.
            for (const url of urlsArray) {
                try {
                    const response = await apiFetch('/api/takedowns', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            infringingUrl: url,
                            userProfileId: selectedCreator,
                            sourceQuery: searchTerm
                        }),
                    });

                    if (response.ok) {
                        successCount++;
                        setApiResults(prev => prev?.filter(r => r.link !== url) || null);
                    } else {
                        failCount++;
                    }
                } catch (e) {
                    console.error(`Error procesando ${url}:`, e);
                    failCount++;
                }
            }

            if (successCount > 0) {
                toast.success(`${successCount} solicitudes enviadas a pendientes.`);
            }
            if (failCount > 0) {
                toast.error(`${failCount} solicitudes fallaron.`);
            }

            setSelectedUrls(new Set());
        } finally {
            setIsBatchProcessing(false);
        }
    };

    const toggleUrlSelection = (url: string) => {
        setSelectedUrls(prev => {
            const newSet = new Set(prev);
            if (newSet.has(url)) {
                newSet.delete(url);
            } else {
                newSet.add(url);
            }
            return newSet;
        });
    };

    const selectAllVisible = () => {
        if (!apiResults) return;
        const allUrls = apiResults.map(r => r.link);
        setSelectedUrls(new Set(allUrls));
    };

    const deselectAll = () => {
        setSelectedUrls(new Set());
    };

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
                                        Selecciona la creadora y elige o escribe los términos de búsqueda.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-6 space-y-4 p-4 border rounded-lg bg-orange-50/50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900">
                                        <Label className="text-sm font-semibold flex items-center gap-2 text-orange-800 dark:text-orange-300">
                                            <IconFilter className="size-4" />
                                            Plantillas de Búsqueda Rápida
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                "videos porno",
                                                "videos xxx gratis",
                                                "full pack leaked",
                                                "videos sin censura",
                                                "contenido exclusivo",
                                                "onlyfans free access",
                                                "recopilación packs",
                                                "google drive leak"
                                            ].map((template) => (
                                                <Button
                                                    key={template}
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-white dark:bg-slate-900 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-800/40 text-xs"
                                                    onClick={() => setSearchTerm(template)}
                                                >
                                                    {template}
                                                </Button>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs text-muted-foreground hover:text-destructive"
                                                onClick={() => setSearchTerm("")}
                                            >
                                                Limpiar
                                            </Button>
                                        </div>

                                    </div>
                                    <form onSubmit={handleSubmit} className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="search">
                                                Términos de búsqueda
                                            </Label>
                                            <Textarea
                                                id="search"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Ej: @nombre pack leaked, videos nuevos, etc."
                                                rows={3}
                                                required
                                            />
                                        </div>

                                        <div className="grid gap-3">
                                            <Label className="flex items-center gap-1">
                                                Artista / Nickname
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <IconHelpCircle className="size-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Selecciona la creadora para la cual quieres realizar el rastreo de contenido.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Label>

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
                                                            <span>{profile.creatorName}</span>
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
                                <Card className="mt-6">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <IconLoader className="animate-spin" />
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-muted-foreground">
                                            Este proceso puede tardar varios minutos. Por favor, no cierres ni recargues la página.
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Errores */}
                            {error && (
                                <Card className="mt-6">
                                    <CardHeader>
                                        <CardTitle className="text-destructive">Error</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-destructive">{error}</div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Resultados de la API externa */}
                            {apiResults && !loading && (
                                <Card className="mt-6">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>Resultados de la Búsqueda</CardTitle>
                                                <CardDescription>
                                                    {apiResults.length} resultado(s) encontrado(s) para <strong>{selectedProfile?.creatorName}</strong>
                                                </CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={selectAllVisible}>
                                                    Seleccionar todo
                                                </Button>
                                                {selectedUrls.size > 0 && (
                                                    <Button variant="ghost" size="sm" onClick={deselectAll}>
                                                        Deseleccionar
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {apiResults.length === 0 ? (
                                            <div className="text-muted-foreground text-center py-8">
                                                No se encontraron resultados para los términos de búsqueda especificados.
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {apiResults.map((result, idx) => {
                                                    const isSuspicious = isSuspiciousLink(result.link, result.title, result.description)
                                                    const riskLevel = getRiskLevel(result.link, result.title, result.description)

                                                    return (
                                                        <Card
                                                            key={idx}
                                                            className={`transition-all hover:shadow-md relative overflow-hidden ${isSuspicious
                                                                ? riskLevel === 'high'
                                                                    ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                                                                    : riskLevel === 'medium'
                                                                        ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20'
                                                                        : 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20'
                                                                : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                                                                } ${selectedUrls.has(result.link) ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                                                            onClick={(e) => {
                                                                // Si hacen clic en el card, alternamos selección a menos que sea un link o botón
                                                                if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
                                                                toggleUrlSelection(result.link);
                                                            }}
                                                        >
                                                            <div className="absolute top-4 right-4 z-10">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedUrls.has(result.link)}
                                                                    onChange={() => toggleUrlSelection(result.link)}
                                                                    className="size-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                />
                                                            </div>
                                                            <CardHeader className="pb-3 pr-12">
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
                                                                        href={result.link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300 text-sm break-all"
                                                                    >
                                                                        {result.link}
                                                                    </a>
                                                                    {result.description &&
                                                                        (<div className="text-sm text-muted-foreground leading-relaxed">
                                                                            {result.description}
                                                                        </div>)
                                                                    }

                                                                </CardDescription>
                                                            </CardHeader>
                                                            <CardFooter className="pt-0">
                                                                <div className="flex gap-2 w-full">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleAddToWhitelist(result.link)}
                                                                        className="flex-1"
                                                                    >
                                                                        <IconShield className="mr-2 size-3" />
                                                                        Añadir a Whitelist
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleRequestRemoval(result.link)}
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

                    {/* Barra de Acciones Flotante */}
                    {selectedUrls.size > 0 && (
                        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <Card className="shadow-2xl border-blue-200 dark:border-blue-900 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
                                <CardContent className="p-4 flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                            {selectedUrls.size} enlaces seleccionados
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Listos para pasar a pendientes
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={deselectAll}
                                            disabled={isBatchProcessing}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                            onClick={handleBatchRequestRemoval}
                                            disabled={isBatchProcessing}
                                        >
                                            {isBatchProcessing ? (
                                                <IconLoader className="animate-spin size-4 mr-2" />
                                            ) : (
                                                <IconTrash className="size-4 mr-2" />
                                            )}
                                            {isBatchProcessing ? 'Procesando...' : 'Añadir a Pendientes'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default withAuth(SearchPage)