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
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IconAlertTriangle, IconLoader, IconRefresh } from "@tabler/icons-react"
import { Toaster, toast } from "sonner"

interface TakedownHistory {
    id: string
    url: string
    userId: string
    sourceQuery: string
    status: "approved" | "rejected"
    createdAt: string
    updatedAt: string
}

interface PaginationInfo {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
}

interface HistoryResponse {
    data: TakedownHistory[];
    pagination: PaginationInfo;
}

interface Profile {
    id: string
    creatorName: string
}

type ProfileMap = Record<string, string>

export default function HistoryPage() {
    const [history, setHistory] = React.useState<TakedownHistory[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [profiles, setProfiles] = React.useState<Profile[]>([])
    const [profileMap, setProfileMap] = React.useState<ProfileMap>({})

    // Filtros y paginación
    const [filters, setFilters] = React.useState({
        status: "all",
        userId: "all",
        sortByDate: "desc",
    })
    const [pagination, setPagination] = React.useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    })

    const fetchHistory = React.useCallback(async () => {
        setLoading(true)
        setError(null)
        const params = new URLSearchParams({
            page: String(pagination.page),
            limit: String(pagination.limit),
            sortByDate: filters.sortByDate,
        })
        if (filters.status !== "all") params.append("status", filters.status)
        if (filters.userId !== "all") params.append("userId", filters.userId)

        try {
            const response = await fetch(`http://localhost:3001/api/takedowns/history?${params.toString()}`)
            if (!response.ok) {
                throw new Error("Error al cargar el historial de reclamos")
            }
            const data: HistoryResponse = await response.json()
            if (data && Array.isArray(data.data) && data.pagination) {
                setHistory(data.data)
                setPagination(prev => ({ ...prev, total: data.pagination.totalItems || 0, totalPages: data.pagination.totalPages || 0 }))
            } else {
                throw new Error("La respuesta de la API no tiene el formato esperado.")
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Error desconocido"
            setError(errorMessage)
            toast.error(errorMessage)
            setHistory([]) // Asegurarse de que history sea un array en caso de error
        } finally {
            setLoading(false)
        }
    }, [pagination.page, pagination.limit, filters])

    React.useEffect(() => {
        fetchHistory()
    }, [fetchHistory])

    React.useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/profiles")
                if (!response.ok) return;
                const data: { data: Profile[] } = await response.json();
                setProfiles(data.data || []);
                const newProfileMap: ProfileMap = (data.data as Profile[]).reduce((acc, profile) => {
                    acc[profile.id] = profile.creatorName
                    return acc
                }, {} as ProfileMap)
                setProfileMap(newProfileMap)
            } catch (err) {
                console.error("Error al cargar perfiles:", err)
            }
        }
        fetchProfiles()
    }, [])

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        setPagination(prev => ({ ...prev, page: 1 })) // Reset page on filter change
    }

    const totalPages = pagination.totalPages || Math.ceil(pagination.total / pagination.limit)

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Toaster richColors />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto grid w-full max-w-7xl gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Historial de Reclamos</CardTitle>
                                <CardDescription>
                                    Visualiza y filtra todos los reclamos procesados.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 flex flex-wrap items-center gap-4">
                                    <Select value={filters.userId} onValueChange={(v) => handleFilterChange("userId", v)}>
                                        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filtrar por creadora..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas las creadoras</SelectItem>
                                            {profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.creatorName}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Select value={filters.status} onValueChange={(v) => handleFilterChange("status", v)}>
                                        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filtrar por estado..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos los estados</SelectItem>
                                            <SelectItem value="approved">Aprobados</SelectItem>
                                            <SelectItem value="rejected">Rechazados</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={filters.sortByDate} onValueChange={(v) => handleFilterChange("sortByDate", v)}>
                                        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Ordenar por..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="desc">Más recientes</SelectItem>
                                            <SelectItem value="asc">Más antiguos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="ghost" onClick={fetchHistory} disabled={loading}><IconRefresh className={`mr-2 size-4 ${loading ? 'animate-spin' : ''}`} /> Recargar</Button>
                                </div>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Creadora</TableHead>
                                            <TableHead>URL</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Estado del Sitio</TableHead>
                                            <TableHead>Fecha de Solicitud</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading && <TableRow><TableCell colSpan={5} className="text-center h-24"><IconLoader className="mx-auto animate-spin" /></TableCell></TableRow>}
                                        {error && <TableRow><TableCell colSpan={5} className="text-center h-24 text-destructive"><IconAlertTriangle className="inline-block mr-2" /> {error}</TableCell></TableRow>}
                                        {!loading && !error && history && history.length === 0 && <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground">No se encontraron reclamos en el historial.</TableCell></TableRow>}
                                        {!loading && !error && history && history.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{profileMap[item.userId] || item.userId}</TableCell>
                                                <TableCell className="max-w-sm truncate"><a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{item.url}</a></TableCell>
                                                <TableCell>
                                                    <Badge variant={item.status === 'approved' ? 'default' : 'destructive'}>
                                                        {item.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">Pendiente</Badge>
                                                </TableCell>
                                                <TableCell>{new Date(item.updatedAt).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="flex items-center justify-between pt-4">
                                    <div className="text-sm text-muted-foreground">
                                        Total de {pagination.total} reclamos.
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Página {pagination.page} de {totalPages}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                            disabled={pagination.page <= 1}
                                        >
                                            Anterior
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                            disabled={pagination.page >= totalPages}
                                        >
                                            Siguiente
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
