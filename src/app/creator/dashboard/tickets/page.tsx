"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    IconPlus,
    IconTicket,
    IconLoader2,
    IconMessageCircle,
    IconChevronLeft,
    IconChevronRight,
    IconInbox,
    IconClock,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Toaster } from "sonner"
import { apiFetch } from "@/lib/api"
import { withCreatorAuth } from "@/components/with-creator-auth"
import { StatusBadge, PriorityBadge, formatRelativeTime } from "@/components/tickets/ticket-utils"
import type { Ticket, TicketStatus } from "@/types/tickets"
import { cn } from "@/lib/utils"

type FilterTab = 'all' | TicketStatus

const TABS: { value: FilterTab; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'OPEN', label: 'Abiertos' },
    { value: 'IN_PROGRESS', label: 'En Proceso' },
    { value: 'RESOLVED', label: 'Resueltos' },
    { value: 'CLOSED', label: 'Cerrados' },
]

const LIMIT = 10

function CreatorTicketsPage() {
    const router = useRouter()
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<FilterTab>('all')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    const fetchTickets = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page: page.toString(), limit: LIMIT.toString() })
            if (activeTab !== 'all') params.set('status', activeTab)
            const res = await apiFetch(`/api/tickets/my?${params}`)
            if (!res.ok) throw new Error()
            const data = await res.json()
            setTickets(data.data)
            setTotalPages(data.meta.totalPages)
            setTotal(data.meta.total)
        } catch {
            toast.error('No se pudieron cargar los tickets')
        } finally {
            setLoading(false)
        }
    }, [activeTab, page])

    useEffect(() => { fetchTickets() }, [fetchTickets])

    const handleTabChange = (tab: FilterTab) => {
        setActiveTab(tab)
        setPage(1)
    }

    return (
        <div className="space-y-4">
            <Toaster richColors />

            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <IconTicket className="h-5 w-5 text-primary" />
                        Mis Tickets de Soporte
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Gestiona tus solicitudes y comunícate con nuestro equipo
                    </p>
                </div>
                <Button
                    size="sm"
                    onClick={() => router.push('/creator/dashboard/tickets/nuevo')}
                    className="w-full sm:w-auto"
                >
                    <IconPlus className="w-4 h-4 mr-1.5" />
                    Nuevo Ticket
                </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 rounded-lg bg-muted p-1 overflow-x-auto scrollbar-hide">
                {TABS.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={cn(
                            "flex-shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                            activeTab === tab.value
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-14">
                    <IconLoader2 className="h-7 w-7 animate-spin text-primary" />
                </div>
            ) : tickets.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-3 mb-3">
                            <IconInbox className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-sm mb-1 leading-snug">
                            {activeTab === 'all' ? 'Sin tickets todavía' : `Sin tickets ${TABS.find(t => t.value === activeTab)?.label.toLowerCase()}`}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4 max-w-xs leading-relaxed">
                            {activeTab === 'all'
                                ? '¿Necesitas ayuda? Crea tu primer ticket y nuestro equipo te responderá.'
                                : 'No tienes tickets con este estado en este momento.'}
                        </p>
                        {activeTab === 'all' && (
                            <Button size="sm" onClick={() => router.push('/creator/dashboard/tickets/nuevo')}>
                                <IconPlus className="w-4 h-4 mr-1.5" />
                                Crear mi primer ticket
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="space-y-2">
                        {tickets.map(ticket => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))}
                    </div>

                    {/* Pagination — always visible when there are results */}
                    <div className="flex items-center justify-between pt-1 border-t">
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
                                <IconChevronLeft className="h-3.5 w-3.5 mr-0.5" />
                                Ant.
                            </Button>
                            <span className="text-xs text-muted-foreground px-1 tabular-nums">
                                {page} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Sig.
                                <IconChevronRight className="h-3.5 w-3.5 ml-0.5" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

function TicketCard({ ticket }: { ticket: Ticket }) {
    const lastMessage = ticket.messages?.[ticket.messages.length - 1]

    return (
        <Link href={`/creator/dashboard/tickets/${ticket.id}`}>
            <Card className="group hover:shadow-sm hover:border-primary/40 transition-all duration-150 cursor-pointer">
                <CardContent className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                        {/* Left content */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                            {/* Badges row */}
                            <div className="flex flex-wrap items-center gap-1.5">
                                <StatusBadge status={ticket.status} />
                                <PriorityBadge priority={ticket.priority} />
                                {ticket.category && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                        {ticket.category}
                                    </Badge>
                                )}
                            </div>
                            {/* Subject */}
                            <p className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors truncate">
                                {ticket.subject}
                            </p>
                            {/* Last message preview */}
                            {lastMessage && (
                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">
                                    <span className="font-medium text-foreground/70">
                                        {lastMessage.senderType === 'ADMIN' ? 'Soporte: ' : 'Tú: '}
                                    </span>
                                    {lastMessage.body}
                                </p>
                            )}
                        </div>

                        {/* Right meta */}
                        <div className="flex flex-col items-end gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                            <div className="flex items-center gap-1">
                                <IconMessageCircle className="h-3 w-3" />
                                <span className="tabular-nums">{ticket._count.messages}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <IconClock className="h-3 w-3" />
                                <span className="leading-none">{formatRelativeTime(ticket.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default withCreatorAuth(CreatorTicketsPage)
