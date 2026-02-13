"use client"

import { apiFetch } from "@/lib/api"
import { withAuth } from "@/components/with-auth"
import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IconCheck, IconLoader, IconAlertTriangle, IconX } from "@tabler/icons-react"
import { TakedownApprovalModal } from "@/components/takedown-approval-modal"
import { Toaster, toast } from "sonner"

interface TakedownRequest {
    id: string
    infringingUrl: string
    userProfileId: string
    sourceQuery: string
    status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"
    createdAt: string
    updatedAt: string
    // Nuevos campos que vienen del backend
    emailSentAt?: string | null;
    googleSubmittedAt?: string | null;
    originalContentUrl: string | null
    infringingSiteContact: string | null
}

interface Profile {
    id: string;
    creatorName: string;
    dmcaInfo?: {
        fullName: string;
        contactEmail: string;
        country: string;
        workDescription: string;
        signature: string;
    }
}

type ProfileMap = Record<string, string>;

interface TakedownsResponse {
    count: number;
    requests: TakedownRequest[];
}

interface FullProfileResponse {
    data: Profile[];
}


// Función para formatear el estado para mostrarlo en la UI
const formatStatus = (status: TakedownRequest['status']) => {
    if (!status) return 'Desconocido';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

function TakedownsPage() {
    const [requests, setRequests] = React.useState<TakedownRequest[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [processingId, setProcessingId] = React.useState<{ id: string, action: 'approve' | 'reject' } | null>(null)
    const [profiles, setProfiles] = React.useState<Profile[]>([]);
    const [profileMap, setProfileMap] = React.useState<ProfileMap>({})
    // Filtros y Paginación
    const [selectedCreatorFilter, setSelectedCreatorFilter] = React.useState<string>("all")
    const [currentPage, setCurrentPage] = React.useState(1)
    const [totalPages, setTotalPages] = React.useState(1)
    const pageSize = 20

    // Estado para la selección múltiple
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
    // Estado para el modal
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [selectedRequestsForModal, setSelectedRequestsForModal] = React.useState<TakedownRequest[]>([])

    const fetchPendingTakedowns = React.useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const queryParams = new URLSearchParams({
                page: String(currentPage),
                limit: String(pageSize),
                status: 'PENDING'
            });
            if (selectedCreatorFilter !== "all") {
                queryParams.append('userProfileId', selectedCreatorFilter);
            }

            const response = await apiFetch(`/api/takedowns/pending?${queryParams.toString()}`)
            if (!response.ok) {
                throw new Error("Error al cargar las solicitudes pendientes")
            }
            const data: TakedownsResponse = await response.json()
            if (data && Array.isArray(data.requests)) {
                // Ordenar por fecha descendente (más reciente primero)
                const sorted = [...data.requests].sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setRequests(sorted)
                setTotalPages(Math.ceil(data.count / pageSize))
            } else {
                throw new Error("La respuesta de la API no tiene el formato esperado.")
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Error desconocido"
            setError(errorMessage)
            toast.error(errorMessage)
            setRequests([])
        } finally {
            setLoading(false)
        }
    }, [currentPage, selectedCreatorFilter])

    React.useEffect(() => {
        fetchPendingTakedowns()

        const fetchProfiles = async () => {
            try {
                const response = await apiFetch("/api/profiles");
                if (!response.ok) throw new Error("Error al cargar perfiles");
                const data: FullProfileResponse = await response.json();
                setProfiles(data.data);
                const newProfileMap: ProfileMap = data.data.reduce((acc, profile) => {
                    acc[profile.id] = profile.creatorName;
                    return acc;
                }, {} as ProfileMap)
                setProfileMap(newProfileMap);
            } catch (err) {
                console.error("Error al cargar perfiles:", err);
            }
        };
        fetchProfiles();
    }, [fetchPendingTakedowns])

    const openApprovalModal = (requestsToProcess: TakedownRequest[]) => {
        setSelectedRequestsForModal(requestsToProcess);
        setIsModalOpen(true);
    };

    const handleApprovalSuccess = (ids: string[]) => {
        // Una acción se completó para un grupo.
        toast.success(`Se procesaron ${ids.length} reclamos correctamente.`);
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            ids.forEach(id => newSet.delete(id));
            return newSet;
        });
        fetchPendingTakedowns();
    }

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const toggleGroupSelection = (requestsInGroup: TakedownRequest[], isSelected: boolean) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            requestsInGroup.forEach(req => {
                if (isSelected) newSet.add(req.id);
                else newSet.delete(req.id);
            });
            return newSet;
        });
    };

    const handleBatchApprove = () => {
        const toProcess = requests.filter(r => selectedIds.has(r.id));
        if (toProcess.length === 0) {
            toast.error("Selecciona al menos un reclamo.");
            return;
        }
        openApprovalModal(toProcess);
    };

    // Agrupar por dominio para la UI, manteniendo el orden cronológico de los elementos
    const groupedRequests = React.useMemo(() => {
        // Primero ordenamos los requests globales para asegurar que lo más nuevo esté arriba
        const sortedRequests = [...requests].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const groups = sortedRequests.reduce((acc, req) => {
            try {
                const domain = new URL(req.infringingUrl).hostname.replace(/^www\./, '');
                if (!acc[domain]) acc[domain] = [];
                acc[domain].push(req);
            } catch {
                if (!acc['otros']) acc['otros'] = [];
                acc['otros'].push(req);
            }
            return acc;
        }, {} as Record<string, TakedownRequest[]>);

        // Opcional: Ordenar los grupos por la fecha del registro más reciente en cada grupo
        return Object.fromEntries(
            Object.entries(groups).sort(([, a], [, b]) =>
                new Date(b[0].createdAt).getTime() - new Date(a[0].createdAt).getTime()
            )
        );
    }, [requests]);

    const handleReject = async (id: string) => {
        setProcessingId({ id, action: 'reject' })
        try {
            const response = await apiFetch(
                `/api/takedowns/${id}/reject`,
                {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}), // Enviar un objeto JSON vacío
                }
            )

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "No se pudo rechazar la solicitud.");
                } catch {
                    throw new Error("No se pudo rechazar la solicitud.");
                }
            }

            toast.success("Solicitud rechazada con éxito.")
            // Actualizar la lista para remover la solicitud procesada
            setRequests((prev) => prev.filter((req) => req.id !== id))
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Ocurrió un error desconocido al rechazar."
            toast.error(errorMessage)
        } finally {
            setProcessingId(null)
        }
    }

    const selectedProfile = React.useMemo(
        () => profiles.find(p => p.id === selectedRequestsForModal[0]?.userProfileId) || null,
        [profiles, selectedRequestsForModal]
    );

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <TakedownApprovalModal
                    isOpen={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    requests={selectedRequestsForModal}
                    profile={selectedProfile}
                    onSuccess={handleApprovalSuccess}
                />

                <SiteHeader />
                <Toaster richColors />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto grid w-full max-w-6xl gap-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Reclamos Pendientes</h1>
                                <p className="text-muted-foreground">
                                    {requests.length} solicitudes esperando acción.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Filtrar por:</span>
                                <select
                                    className="h-9 w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={selectedCreatorFilter}
                                    onChange={(e) => {
                                        setSelectedCreatorFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="all">Todas las creadoras</option>
                                    {profiles.map(p => (
                                        <option key={p.id} value={p.id}>{p.creatorName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <Card>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>URL a Retirar</TableHead>
                                            <TableHead>ID de Creadora</TableHead>
                                            <TableHead>Búsqueda Origen</TableHead>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center">
                                                    <IconLoader className="mx-auto animate-spin" />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {error && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-destructive">
                                                    <IconAlertTriangle className="inline-block mr-2" /> {error}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {!loading && requests.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                    No hay solicitudes pendientes.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {!loading && !error && Object.entries(groupedRequests).map(([domain, domainRequests]) => {
                                            const allSelected = domainRequests.every(r => selectedIds.has(r.id));
                                            const someSelected = domainRequests.some(r => selectedIds.has(r.id));

                                            return (
                                                <React.Fragment key={domain}>
                                                    {/* Cabecera del Grupo/Dominio */}
                                                    <TableRow className="bg-muted/30 font-semibold">
                                                        <TableCell colSpan={5} className="py-2">
                                                            <div className="flex items-center gap-3">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={allSelected}
                                                                    ref={el => { if (el) el.indeterminate = someSelected && !allSelected }}
                                                                    onChange={(e) => toggleGroupSelection(domainRequests, e.target.checked)}
                                                                    className="size-4 rounded border-gray-300"
                                                                />
                                                                <span className="text-blue-600 dark:text-blue-400">{domain}</span>
                                                                <Badge variant="outline" className="ml-2">
                                                                    {domainRequests.length} {domainRequests.length === 1 ? 'enlace' : 'enlaces'}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right py-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-8 text-xs"
                                                                onClick={() => openApprovalModal(domainRequests)}
                                                            >
                                                                Procesar Todo el Sitio
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>

                                                    {/* Enlaces Individuales */}
                                                    {domainRequests.map((req) => (
                                                        <TableRow key={req.id} className={selectedIds.has(req.id) ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}>
                                                            <TableCell className="max-w-xs truncate pl-8">
                                                                <div className="flex items-center gap-3">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedIds.has(req.id)}
                                                                        onChange={() => toggleSelection(req.id)}
                                                                        className="size-4 rounded border-gray-300"
                                                                    />
                                                                    <a href={req.infringingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                                        {req.infringingUrl}
                                                                    </a>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{profileMap[req.userProfileId] || req.userProfileId}</TableCell>
                                                            <TableCell className="italic text-muted-foreground text-xs">&quot;{req.sourceQuery}&quot;</TableCell>
                                                            <TableCell className="text-xs">{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                                            <TableCell><Badge variant="secondary" className="text-[10px]">{formatStatus(req.status)}</Badge></TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button variant="ghost" size="sm" onClick={() => handleReject(req.id)} disabled={!!processingId}>
                                                                        <IconX className="size-4" />
                                                                    </Button>
                                                                    <Button size="sm" variant="outline" onClick={() => openApprovalModal([req])} disabled={!!processingId}>
                                                                        Aprobar
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </React.Fragment>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>

                            {/* Barra de Acciones por Lote para Pendientes */}
                            {selectedIds.size > 0 && (
                                <div className="p-4 border-t bg-muted/20 flex items-center justify-between">
                                    <div className="text-sm font-medium">
                                        {selectedIds.size} reclamos seleccionados
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>
                                            Limpiar Selección
                                        </Button>
                                        <Button size="sm" onClick={handleBatchApprove}>
                                            <IconCheck className="mr-2 size-4" />
                                            Aprobar Selección
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Paginación */}
                            {!loading && totalPages > 1 && (
                                <div className="p-4 border-t flex items-center justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Anterior
                                    </Button>
                                    <div className="text-sm">
                                        Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default withAuth(TakedownsPage)
