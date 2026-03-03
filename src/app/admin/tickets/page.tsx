"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
    IconTicket,
    IconLoader2,
    IconEye,
    IconInbox,
    IconChevronLeft,
    IconChevronRight,
    IconAlertTriangle,
    IconMessageCircle,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Toaster } from "sonner"
import { apiFetch } from "@/lib/api"
import { AppLayout } from "@/components/app-layout"
import { withAuth } from "@/components/with-auth"
import { withRoleProtection } from "@/components/with-role-protection"
import { StatusBadge, PriorityBadge, formatRelativeTime } from "@/components/tickets/ticket-utils"
import type { Ticket, TicketStats } from "@/types/tickets"
import { cn } from "@/lib/utils"

const LIMIT = 15

function AdminTicketsPage() {
    const router = useRouter()
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [stats, setStats] = useState<TicketStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [statsLoading, setStatsLoading] = useState(true)

    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [filterPriority, setFilterPriority] = useState<string>('all')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    const fetchStats = useCallback(async () => {
        try {
            const res = await apiFetch('/api/admin/tickets/stats', {}, 'admin')
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData.message || `HTTP ${res.status}`)
            }
            const data = await res.json()
            setStats(data.data)
        } catch (err) {
            console.error('[AdminTickets] fetchStats failed:', err)
        } finally {
            setStatsLoading(false)
        }
    }, [])


    const fetchTickets = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page: page.toString(), limit: LIMIT.toString() })
            if (filterStatus !== 'all') params.set('status', filterStatus)
            if (filterPriority !== 'all') params.set('priority', filterPriority)

            const res = await apiFetch(`/api/admin/tickets?${params}`, {}, 'admin')
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData.message || `HTTP ${res.status}`)
            }
            const data = await res.json()
            setTickets(data.data)
            setTotalPages(data.meta.totalPages)
            setTotal(data.meta.total)
        } catch (err) {
            console.error('[AdminTickets] fetchTickets failed:', err)
            toast.error('Error al cargar los tickets')
        } finally {
            setLoading(false)
        }
    }, [filterStatus, filterPriority, page])


    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    useEffect(() => {
        fetchTickets()
    }, [fetchTickets])

    const handleFilterChange = (type: 'status' | 'priority', value: string) => {
        if (type === 'status') setFilterStatus(value)
        else setFilterPriority(value)
        setPage(1)
    }

    return (
        <AppLayout>
            <div className="space-y-6">
                <Toaster richColors />

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
                        <IconTicket className="h-7 w-7 text-primary" />
                        Panel de Tickets
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestiona todas las solicitudes de soporte de los creadores
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatCard
                        label="Abiertos"
                        value={stats?.byStatus.OPEN ?? 0}
                        className="border-blue-200 dark:border-blue-800"
                        valueClassName="text-blue-600 dark:text-blue-400"
                        loading={statsLoading}
                        onClick={() => handleFilterChange('status', 'OPEN')}
                    />
                    <StatCard
                        label="En Proceso"
                        value={stats?.byStatus.IN_PROGRESS ?? 0}
                        className="border-yellow-200 dark:border-yellow-800"
                        valueClassName="text-yellow-600 dark:text-yellow-400"
                        loading={statsLoading}
                        onClick={() => handleFilterChange('status', 'IN_PROGRESS')}
                    />
                    <StatCard
                        label="Resueltos"
                        value={stats?.byStatus.RESOLVED ?? 0}
                        className="border-green-200 dark:border-green-800"
                        valueClassName="text-green-600 dark:text-green-400"
                        loading={statsLoading}
                        onClick={() => handleFilterChange('status', 'RESOLVED')}
                    />
                    <StatCard
                        label="Cerrados"
                        value={stats?.byStatus.CLOSED ?? 0}
                        className="border-gray-200 dark:border-gray-700"
                        valueClassName="text-gray-500 dark:text-gray-400"
                        loading={statsLoading}
                        onClick={() => handleFilterChange('status', 'CLOSED')}
                    />
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-3 items-center">
                            <div className="flex-1 min-w-[140px]">
                                <Select value={filterStatus} onValueChange={v => handleFilterChange('status', v)}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los estados</SelectItem>
                                        <SelectItem value="OPEN">Abierto</SelectItem>
                                        <SelectItem value="IN_PROGRESS">En Proceso</SelectItem>
                                        <SelectItem value="RESOLVED">Resuelto</SelectItem>
                                        <SelectItem value="CLOSED">Cerrado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1 min-w-[140px]">
                                <Select value={filterPriority} onValueChange={v => handleFilterChange('priority', v)}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Prioridad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toda prioridad</SelectItem>
                                        <SelectItem value="LOW">Baja</SelectItem>
                                        <SelectItem value="MEDIUM">Media</SelectItem>
                                        <SelectItem value="HIGH">Alta</SelectItem>
                                        <SelectItem value="URGENT">Urgente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {(filterStatus !== 'all' || filterPriority !== 'all') && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setFilterStatus('all')
                                        setFilterPriority('all')
                                        setPage(1)
                                    }}
                                >
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Tickets Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <IconInbox className="h-10 w-10 text-muted-foreground mb-3" />
                                <p className="font-medium">Sin tickets</p>
                                <p className="text-sm text-muted-foreground">
                                    No hay tickets con los filtros seleccionados
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="text-left font-medium px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide">Creador</th>
                                                <th className="text-left font-medium px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide">Asunto</th>
                                                <th className="text-left font-medium px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide">Estado</th>
                                                <th className="text-left font-medium px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide">Prioridad</th>
                                                <th className="text-left font-medium px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide">Msgs</th>
                                                <th className="text-left font-medium px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide">Actualizado</th>
                                                <th className="text-right font-medium px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tickets.map(ticket => {
                                                const isUrgentOpen = ticket.priority === 'URGENT' && ticket.status === 'OPEN'
                                                const lastMessage = ticket.messages?.[ticket.messages.length - 1]
                                                return (
                                                    <tr
                                                        key={ticket.id}
                                                        className={cn(
                                                            "border-b hover:bg-muted/30 transition-colors",
                                                            isUrgentOpen && "bg-red-50/50 dark:bg-red-900/10 border-l-2 border-l-red-500"
                                                        )}
                                                    >
                                                        <td className="px-3 py-2">
                                                            <div>
                                                                <p className="font-medium text-sm leading-snug">{ticket.userProfile.creatorName}</p>
                                                                <p className="text-xs text-muted-foreground leading-relaxed">{ticket.userProfile.email}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2 max-w-[200px]">
                                                            <div className="flex items-center gap-1.5">
                                                                {isUrgentOpen && (
                                                                    <IconAlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                                                                )}
                                                                <div className="min-w-0">
                                                                    <p className="font-medium text-sm leading-snug truncate">{ticket.subject}</p>
                                                                    {lastMessage && (
                                                                        <p className="text-xs text-muted-foreground truncate leading-relaxed">
                                                                            {lastMessage.body}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <StatusBadge status={ticket.status} />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <PriorityBadge priority={ticket.priority} />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                                <IconMessageCircle className="h-3 w-3" />
                                                                <span className="text-xs tabular-nums">{ticket._count.messages}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2 text-muted-foreground text-xs leading-relaxed">
                                                            {formatRelativeTime(ticket.updatedAt)}
                                                        </td>
                                                        <td className="px-3 py-2 text-right">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 text-xs px-2"
                                                                onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
                                                            >
                                                                <IconEye className="h-3.5 w-3.5 mr-1" />
                                                                Ver
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="lg:hidden divide-y">
                                    {tickets.map(ticket => {
                                        const isUrgentOpen = ticket.priority === 'URGENT' && ticket.status === 'OPEN'
                                        return (
                                            <div
                                                key={ticket.id}
                                                className={cn(
                                                    "px-4 py-3 space-y-2",
                                                    isUrgentOpen && "bg-red-50/50 dark:bg-red-900/10 border-l-2 border-l-red-500"
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-sm leading-snug">{ticket.userProfile.creatorName}</p>
                                                        <p className="text-xs text-muted-foreground leading-relaxed">{ticket.userProfile.email}</p>
                                                    </div>
                                                    {isUrgentOpen && <IconAlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />}
                                                </div>
                                                <p className="text-sm font-medium leading-snug line-clamp-1">{ticket.subject}</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    <StatusBadge status={ticket.status} />
                                                    <PriorityBadge priority={ticket.priority} />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <IconMessageCircle className="h-3 w-3" />
                                                        <span className="tabular-nums">{ticket._count.messages} msgs · {formatRelativeTime(ticket.updatedAt)}</span>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs px-2"
                                                        onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
                                                    >
                                                        <IconEye className="h-3.5 w-3.5 mr-1" />
                                                        Ver
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Pagination — always visible */}
                                <div className="flex items-center justify-between px-3 py-2.5 border-t">
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {total === 0
                                            ? 'Sin resultados'
                                            : `${(page - 1) * LIMIT + 1}–${Math.min(page * LIMIT, total)} de ${total} ticket${total !== 1 ? 's' : ''}`
                                        }
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                            disabled={page === 1}
                                            onClick={() => setPage(p => p - 1)}
                                        >
                                            <IconChevronLeft className="h-3.5 w-3.5" />
                                        </Button>
                                        <span className="text-xs text-muted-foreground tabular-nums px-1">
                                            {page} / {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                            disabled={page === totalPages}
                                            onClick={() => setPage(p => p + 1)}
                                        >
                                            <IconChevronRight className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}

function StatCard({
    label,
    value,
    className,
    valueClassName,
    loading,
    onClick,
}: {
    label: string
    value: number
    className?: string
    valueClassName?: string
    loading: boolean
    onClick?: () => void
}) {
    return (
        <Card
            className={cn("cursor-pointer hover:shadow-md transition-shadow border-2", className)}
            onClick={onClick}
        >
            <CardContent className="px-4 pt-3 pb-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 leading-none">
                    {label}
                </p>
                {loading ? (
                    <div className="h-7 w-10 bg-muted animate-pulse rounded mt-1" />
                ) : (
                    <p className={cn("text-2xl font-bold leading-none", valueClassName)}>{value}</p>
                )}
            </CardContent>
        </Card>
    )
}

export default withAuth(withRoleProtection(AdminTicketsPage, ['admin', 'super_admin']))
