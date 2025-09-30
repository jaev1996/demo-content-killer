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
    // Estado para el modal
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [selectedRequest, setSelectedRequest] = React.useState<TakedownRequest | null>(null)

    const fetchPendingTakedowns = React.useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await apiFetch("/api/takedowns/pending")
            if (!response.ok) {
                throw new Error("Error al cargar las solicitudes pendientes")
            }
            const data: TakedownsResponse = await response.json()
            if (data && Array.isArray(data.requests)) {
                setRequests(data.requests)
            } else {
                throw new Error("La respuesta de la API no tiene el formato esperado.")
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Error desconocido"
            setError(errorMessage)
            toast.error(errorMessage)
            setRequests([]) // Asegurarse de que requests sea un array en caso de error
        } finally {
            setLoading(false)
        }
    }, [])

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

    const openApprovalModal = (request: TakedownRequest) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleApprovalSuccess = () => {
        // Una acción se completó. Recargamos la lista para obtener el nuevo estado.
        toast.info("Actualizando estado del reclamo...");
        fetchPendingTakedowns();
    }

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
        () => profiles.find(p => p.id === selectedRequest?.userProfileId) || null,
        [profiles, selectedRequest]
    );

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <TakedownApprovalModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} request={selectedRequest} profile={selectedProfile} onSuccess={handleApprovalSuccess} />

                <SiteHeader />
                <Toaster richColors />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto grid w-full max-w-6xl gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reclamos Pendientes</CardTitle>
                                <CardDescription>
                                    Revisa, aprueba o rechaza las solicitudes de retiro de contenido.
                                </CardDescription>
                            </CardHeader>
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
                                        {!loading && !error && requests.map((req) => (
                                            <TableRow key={req.id}>
                                                <TableCell className="max-w-xs truncate"><a href={req.infringingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{req.infringingUrl}</a></TableCell>
                                                <TableCell>{profileMap[req.userProfileId] || req.userProfileId}</TableCell>
                                                <TableCell className="italic text-muted-foreground">&quot;{req.sourceQuery}&quot;</TableCell>
                                                <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell><Badge variant="secondary">{formatStatus(req.status)}</Badge></TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => handleReject(req.id)} disabled={!!processingId}>
                                                            {processingId?.action === 'reject' && processingId.id === req.id ? <IconLoader className="mr-2 size-4 animate-spin" /> : <IconX className="mr-2 size-4" />}
                                                            {processingId?.action === 'reject' && processingId.id === req.id ? "Rechazando..." : "Rechazar"}
                                                        </Button>
                                                        <Button size="sm" onClick={() => openApprovalModal(req)} disabled={!!processingId}>
                                                            <IconCheck className="mr-2 size-4" />
                                                            Aprobar
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default withAuth(TakedownsPage)
