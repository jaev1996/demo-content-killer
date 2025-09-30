"use client"

import { withAuth } from "@/components/with-auth"
import { apiFetch } from "@/lib/api"
import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster, toast } from "sonner"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
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
import { IconLoader, IconPlus, IconSearch, IconTrash, IconX } from "@tabler/icons-react"

interface Profile {
    id: string;
    creatorName: string;
    socialMediaUser: string;
    whitelist: string[];
    status: "active" | "inactive";
    dmcaInfo?: {
        fullName: string;
        contactEmail: string;
        country: string;
        workDescription: string;
        signature: string;
    }
}

function WhitelistManager({ profile, onWhitelistUpdate }: { profile: Profile; onWhitelistUpdate: (profileId: string, newCount: number) => void; }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [whitelist, setWhitelist] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [newDomain, setNewDomain] = React.useState("");
    const [isAdding, setIsAdding] = React.useState(false);

    const fetchWhitelist = React.useCallback(async () => {
        if (!isOpen) return;
        setLoading(true);
        try {
            const response = await apiFetch(`/api/profiles/${profile.id}/whitelist`);
            if (!response.ok) throw new Error("Error al cargar la whitelist.");
            const data = await response.json();
            setWhitelist(data.whitelist || []);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    }, [isOpen, profile.id]);

    React.useEffect(() => {
        fetchWhitelist();
    }, [isOpen, profile.id, fetchWhitelist]);

    const handleAddDomain = async (e: React.FormEvent) => {
        e.preventDefault();
        const domainToAdd = newDomain.trim();
        if (!domainToAdd) return;

        setIsAdding(true);
        try {
            const response = await apiFetch(`/api/profiles/${profile.id}/whitelist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain: domainToAdd }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Error al añadir el dominio.");

            toast.success(`Dominio "${domainToAdd}" añadido.`);
            setWhitelist(result.profile.whitelist);
            onWhitelistUpdate(profile.id, result.profile.whitelist.length);
            setNewDomain("");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error desconocido");
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemoveDomain = async (domainToRemove: string) => {
        try {
            const response = await apiFetch(`/api/profiles/${profile.id}/whitelist/${encodeURIComponent(domainToRemove)}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Error al eliminar el dominio.");

            toast.success(`Dominio "${domainToRemove}" eliminado.`);
            setWhitelist(result.profile.whitelist);
            onWhitelistUpdate(profile.id, result.profile.whitelist.length);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error desconocido");
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                Gestionar({profile.whitelist.length})
            </Button>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Gestionar Whitelist para {profile.creatorName}</DrawerTitle>
                    <DrawerDescription>Añade o elimina sitios permitidos para esta creadora.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                    <form onSubmit={handleAddDomain} className="flex gap-2 mb-4">
                        <Input placeholder="ejemplo.com" value={newDomain} onChange={e => setNewDomain(e.target.value)} />
                        <Button type="submit" disabled={isAdding}>
                            {isAdding ? <IconLoader className="animate-spin" /> : <IconPlus />}
                        </Button>
                    </form>
                    {loading ? <IconLoader className="mx-auto animate-spin" /> : (
                        <ul className="space-y-2 max-h-64 overflow-y-auto">
                            {whitelist.map(domain => (
                                <li key={domain} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                    <span>{domain}</span>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveDomain(domain)}><IconX className="size-4 text-destructive" /></Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <DrawerFooter><DrawerClose asChild><Button variant="outline">Cerrar</Button></DrawerClose></DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function ProfilesPage() {
    const [profiles, setProfiles] = React.useState<Profile[]>([])
    const [loading, setLoading] = React.useState(true)

    // Estado del formulario
    const [newCreatorName, setNewCreatorName] = React.useState("")
    const [newSocialMediaUser, setNewSocialMediaUser] = React.useState("")
    const [newWhitelist, setNewWhitelist] = React.useState("")
    const [newPlatform, setNewPlatform] = React.useState("general")
    // Estado para DMCA Info
    const [dmcaFullName, setDmcaFullName] = React.useState("")
    const [dmcaContactEmail, setDmcaContactEmail] = React.useState("")
    const [dmcaCountry, setDmcaCountry] = React.useState("US")
    const [dmcaWorkDescription, setDmcaWorkDescription] = React.useState("")
    const [dmcaSignature, setDmcaSignature] = React.useState("")

    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // Estado de filtros y paginación
    const [searchTerm, setSearchTerm] = React.useState("")
    const [pagination, setPagination] = React.useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 5,
    })

    const fetchProfiles = React.useCallback(async (page = 1, search = "") => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(pagination.limit),
                search: search,
            })
            const response = await apiFetch(`/api/profiles?${params.toString()}`)
            if (!response.ok) {
                throw new Error("Error al cargar los perfiles")
            }
            const data = await response.json()
            setProfiles(data.data || [])
            setPagination(prev => ({
                ...prev,
                ...data.pagination,
            }))
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error desconocido")
            setProfiles([])
        } finally {
            setLoading(false)
        }
    }, [pagination.limit])

    React.useEffect(() => {
        fetchProfiles(pagination.currentPage, searchTerm)
    }, [pagination.currentPage, searchTerm, fetchProfiles])

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCreatorName || !newSocialMediaUser) {
            toast.error("El nombre y el usuario son requeridos.")
            return
        }
        setIsSubmitting(true)

        // Función para limpiar y extraer el dominio de una URL
        const getDomainFromUrl = (url: string): string | null => {
            try {
                const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
                // Quitar 'www.' si existe
                return hostname.replace(/^www\./, '');
            } catch (e) {
                return null; // URL inválida
            }
        };

        const extraWhitelistDomains = Array.from(new Set( // Evitar duplicados
            newWhitelist
                .split(/[\n\s,]+/) // Separar por nueva línea, espacios o comas
                .map(url => getDomainFromUrl(url.trim())) // Limpiar y obtener dominio
                .filter((domain): domain is string => !!domain) // Filtrar nulos o vacíos
        ));

        try {
            const response = await apiFetch('/api/profiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: newSocialMediaUser,
                    creatorName: newCreatorName,
                    platform: newPlatform,
                    dmcaInfo: {
                        fullName: dmcaFullName || newCreatorName,
                        contactEmail: dmcaContactEmail,
                        country: dmcaCountry,
                        workDescription: dmcaWorkDescription || `Contenido visual y de video producido por ${newCreatorName}.`,
                        signature: dmcaSignature || newCreatorName,
                    },
                    whitelist: extraWhitelistDomains, // Enviar dominios limpios y únicos
                }),
            })

            const result = await response.json()
            if (!response.ok) {
                throw new Error(result.error || 'Error al crear el perfil.')
            }

            toast.success("Perfil creado exitosamente.")
            setNewCreatorName("")
            setNewSocialMediaUser("")
            setNewWhitelist("")
            setNewPlatform("general")
            setDmcaFullName("")
            setDmcaContactEmail("")
            setDmcaCountry("US")
            setDmcaWorkDescription("")
            setDmcaSignature("")
            fetchProfiles(1, "") // Recargar la tabla
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error desconocido")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleWhitelistUpdate = (profileId: string, newCount: number) => {
        setProfiles(prevProfiles =>
            prevProfiles.map(p =>
                p.id === profileId ? { ...p, whitelist: Array(newCount).fill('') } : p // Actualizamos el contador
                // No necesitamos la lista completa, solo el length, pero esto fuerza el re-render
            )
        );
    };

    const handleDeleteProfile = async (userId: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este perfil?")) {
            return
        }
        try {
            const response = await apiFetch(`/api/profiles/${userId}`, {
                method: 'DELETE',
            })
            const result = await response.json()
            if (!response.ok) {
                throw new Error(result.error || 'Error al eliminar el perfil.')
            }
            toast.success("Perfil eliminado exitosamente.")
            fetchProfiles(pagination.currentPage, searchTerm) // Recargar
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error desconocido")
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Toaster richColors />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Perfiles de Cliente
                        </h1>
                        <p className="text-muted-foreground">
                            Crea y gestiona los perfiles de las creadoras de contenido.
                        </p>
                    </div>

                    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8">
                        {/* Columna del Formulario */}
                        <div>
                            <form onSubmit={handleSaveProfile} aria-busy={isSubmitting}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Crear Nuevo Perfil</CardTitle>
                                        <CardDescription>
                                            Añade una nueva creadora a la plataforma.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Basic Info */}
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
                                                Usuario (ID único)
                                            </Label>
                                            <Input
                                                id="socialMediaUser"
                                                placeholder="Ej: elena_v"
                                                value={newSocialMediaUser}
                                                onChange={(e) => setNewSocialMediaUser(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Sección de Información DMCA */}
                                        <div className="grid gap-6 md:col-span-2 md:grid-cols-2 pt-4 border-t">
                                            <h4 className="font-medium text-sm">Información para Reclamos DMCA</h4>
                                            <p className="text-xs text-muted-foreground -mt-5 mb-2 md:col-span-2">
                                                Estos datos se usarán para rellenar los formularios de retiro.
                                            </p>
                                            <div className="grid gap-2">
                                                <Label htmlFor="dmcaFullName">Nombre Completo Legal</Label>
                                                <Input id="dmcaFullName" placeholder={newCreatorName || "Ej: Elena Valera"} value={dmcaFullName} onChange={(e) => setDmcaFullName(e.target.value)} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="dmcaContactEmail">Email de Contacto</Label>
                                                <Input id="dmcaContactEmail" type="email" placeholder="ejemplo@email.com" value={dmcaContactEmail} onChange={(e) => setDmcaContactEmail(e.target.value)} required />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="dmcaSignature">Firma Digital</Label>
                                                <Input
                                                    id="dmcaSignature"
                                                    placeholder={newCreatorName || "Nombre completo"}
                                                    value={dmcaSignature}
                                                    onChange={(e) => setDmcaSignature(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="dmcaCountry">País de Residencia</Label>
                                                <Select value={dmcaCountry} onValueChange={setDmcaCountry}>
                                                    <SelectTrigger id="dmcaCountry">
                                                        <SelectValue placeholder="Selecciona un país" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="US">Estados Unidos</SelectItem>
                                                        <SelectItem value="ES">España</SelectItem>
                                                        <SelectItem value="MX">México</SelectItem>
                                                        <SelectItem value="CO">Colombia</SelectItem>
                                                        <SelectItem value="AR">Argentina</SelectItem>
                                                        {/* Añadir más países según sea necesario */}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2 md:col-span-2">
                                                <Label htmlFor="dmcaWorkDescription">Descripción de la Obra</Label>
                                                <Textarea
                                                    id="dmcaWorkDescription"
                                                    placeholder={`Contenido visual y de video producido por ${newCreatorName || 'la creadora'}.`}
                                                    rows={2}
                                                    value={dmcaWorkDescription}
                                                    onChange={(e) => setDmcaWorkDescription(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2 pt-4 border-t">
                                            <Label htmlFor="platform">Plataforma Principal</Label>
                                            <Select value={newPlatform} onValueChange={setNewPlatform}>
                                                <SelectTrigger id="platform">
                                                    <SelectValue placeholder="Selecciona una plataforma" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="general">General (Redes Sociales)</SelectItem>
                                                    <SelectItem value="youtube">YouTube</SelectItem>
                                                    <SelectItem value="twitch">Twitch</SelectItem>
                                                    <SelectItem value="tiktok">TikTok</SelectItem>
                                                    <SelectItem value="instagram">Instagram</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-muted-foreground -mt-1">
                                                Se aplicará una whitelist predeterminada según la plataforma.
                                            </p>
                                        </div>
                                        <div className="grid gap-2 pt-4 border-t md:col-span-2">
                                            <Label htmlFor="whitelist">
                                                Añadir a Whitelist (opcional, uno por línea)
                                            </Label>
                                            <Textarea
                                                id="whitelist"
                                                placeholder="https://youtube.com/elenavalera&#10;https://patreon.com/elenavalera"
                                                rows={3}
                                                value={newWhitelist}
                                                onChange={(e) => setNewWhitelist(e.target.value)}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Estos sitios se añadirán a la whitelist predeterminada.
                                            </p>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? <IconLoader className="mr-2 size-4 animate-spin" /> : <IconPlus className="mr-2 size-4" />}
                                            {isSubmitting ? "Guardando..." : "Guardar Perfil"}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </div>

                        {/* Columna de la Tabla */}
                        <div>
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
                                            {loading && (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-24 text-center">
                                                        <IconLoader className="mx-auto animate-spin" />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {!loading && profiles.map((profile) => (
                                                <TableRow key={profile.id}>
                                                    <TableCell className="font-medium">
                                                        {profile.creatorName}
                                                    </TableCell>
                                                    <TableCell>{profile.id}</TableCell>
                                                    <TableCell>
                                                        <WhitelistManager profile={profile} onWhitelistUpdate={handleWhitelistUpdate} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                profile.status === "active"
                                                                    ? "secondary"
                                                                    : "default"
                                                            }
                                                        >
                                                            {profile.status === "active"
                                                                ? "Inactivo"
                                                                : "Activo"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProfile(profile.id)}>
                                                            <IconTrash className="size-4 text-destructive" />
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
                                        Mostrando <strong>{profiles.length}</strong> de{" "}
                                        <strong>{pagination.totalItems}</strong> perfiles
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                                            disabled={pagination.currentPage === 1}
                                        >
                                            Anterior
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                                            disabled={pagination.currentPage === pagination.totalPages}
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

export default withAuth(ProfilesPage)