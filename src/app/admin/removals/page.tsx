"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconPlus, IconEdit, IconTrash, IconSearch, IconLoader2, IconExternalLink } from "@tabler/icons-react"
import { StatusBadge } from "@/components/admin/removals/StatusBadge"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
import type { ContentRemoval, RemovalFilters } from "@/types/removals"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AppLayout } from "@/components/app-layout"
import { withAuth } from "@/components/with-auth"
import { withRoleProtection } from "@/components/with-role-protection"
import { Badge } from "@/components/ui/badge"

function AdminRemovalsPage() {
    const router = useRouter()
    const [removals, setRemovals] = useState<ContentRemoval[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const [filters, setFilters] = useState<RemovalFilters>({
        status: 'all',
        platform: 'all',
        page: 1,
        limit: 20
    })

    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    })

    useEffect(() => {
        fetchRemovals()
    }, [filters])

    const fetchRemovals = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: filters.page?.toString() || '1',
                limit: filters.limit?.toString() || '20',
                status: filters.status || 'all',
                platform: filters.platform || 'all'
            })

            const response = await apiFetch(`/api/admin/removals?${params}`)
            if (!response.ok) throw new Error('Error al cargar eliminaciones')

            const data = await response.json()
            setRemovals(data.data.removals)
            setPagination(data.data.pagination)
        } catch (error) {
            toast.error('Error al cargar eliminaciones')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await apiFetch(`/api/admin/removals/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Error al eliminar')

            toast.success('Eliminación borrada exitosamente')
            fetchRemovals()
        } catch (error) {
            toast.error('Error al eliminar')
        } finally {
            setDeleteId(null)
        }
    }

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Gestión de Eliminaciones</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Administra las solicitudes de eliminación de contenido
                        </p>
                    </div>
                    <Button onClick={() => router.push('/admin/removals/new')} className="w-full sm:w-auto">
                        <IconPlus className="w-4 h-4 mr-2" />
                        Nueva Eliminación
                    </Button>
                </div>

                {/* Filters Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filtros</CardTitle>
                        <CardDescription>Filtra las eliminaciones por estado y plataforma</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Estado</label>
                                <Select
                                    value={filters.status}
                                    onValueChange={(value) => setFilters({ ...filters, status: value as any, page: 1 })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los estados</SelectItem>
                                        <SelectItem value="pending">Pendiente</SelectItem>
                                        <SelectItem value="in_progress">En Proceso</SelectItem>
                                        <SelectItem value="completed">Completado</SelectItem>
                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Plataforma</label>
                                <Select
                                    value={filters.platform}
                                    onValueChange={(value) => setFilters({ ...filters, platform: value, page: 1 })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas las plataformas</SelectItem>
                                        <SelectItem value="OnlyFans">OnlyFans</SelectItem>
                                        <SelectItem value="Fansly">Fansly</SelectItem>
                                        <SelectItem value="Twitter/X">Twitter/X</SelectItem>
                                        <SelectItem value="Reddit">Reddit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end sm:col-span-2 lg:col-span-1">
                                <Button variant="outline" onClick={fetchRemovals} className="w-full">
                                    <IconSearch className="w-4 h-4 mr-2" />
                                    Buscar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Card */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center p-12">
                                <IconLoader2 className="w-8 h-8 animate-spin" />
                            </div>
                        ) : removals.length === 0 ? (
                            <div className="text-center p-12">
                                <p className="text-muted-foreground">No se encontraron eliminaciones</p>
                            </div>
                        ) : (
                            <>
                                {/* Mobile Card View */}
                                <div className="block md:hidden divide-y">
                                    {removals.map((removal) => (
                                        <div key={removal.id} className="p-4 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium">{removal.creatorName || 'N/A'}</p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {removal.platform}
                                                        </Badge>
                                                        <StatusBadge status={removal.status} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Reportado</p>
                                                    <p className="font-medium">
                                                        {new Date(removal.reportedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Resuelto</p>
                                                    <p className="font-medium">
                                                        {removal.resolvedAt
                                                            ? new Date(removal.resolvedAt).toLocaleDateString()
                                                            : '-'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => window.open(removal.contentUrl, '_blank')}
                                                >
                                                    <IconExternalLink className="w-4 h-4 mr-2" />
                                                    Ver
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => router.push(`/admin/removals/${removal.id}/edit`)}
                                                >
                                                    <IconEdit className="w-4 h-4 mr-2" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteId(removal.id)}
                                                >
                                                    <IconTrash className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Creador</TableHead>
                                                <TableHead>Plataforma</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Reportado</TableHead>
                                                <TableHead>Resuelto</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {removals.map((removal) => (
                                                <TableRow key={removal.id}>
                                                    <TableCell className="font-medium">
                                                        {removal.creatorName || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>{removal.platform}</TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={removal.status} />
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(removal.reportedAt).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {removal.resolvedAt
                                                            ? new Date(removal.resolvedAt).toLocaleDateString()
                                                            : '-'
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => window.open(removal.contentUrl, '_blank')}
                                                            >
                                                                <IconExternalLink className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => router.push(`/admin/removals/${removal.id}/edit`)}
                                                            >
                                                                <IconEdit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setDeleteId(removal.id)}
                                                            >
                                                                <IconTrash className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 border-t">
                                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                                        Mostrando {removals.length} de {pagination.total} resultados
                                    </p>
                                    <div className="flex gap-2 justify-center sm:justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={pagination.page === 1}
                                            onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                                        >
                                            Anterior
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={pagination.page === pagination.totalPages}
                                            onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                                        >
                                            Siguiente
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. El registro será eliminado permanentemente.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteId && handleDelete(deleteId)}
                                className="bg-destructive hover:bg-destructive/90"
                            >
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    )
}

export default withAuth(withRoleProtection(AdminRemovalsPage, ["super_admin"]))
