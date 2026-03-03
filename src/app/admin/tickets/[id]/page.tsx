"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
    IconArrowLeft,
    IconLoader2,
    IconSend,
    IconLock,
    IconTrash,
    IconUser,
    IconCalendar,
    IconMessageCircle,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { toast } from "sonner"
import { Toaster } from "sonner"
import { apiFetch } from "@/lib/api"
import { AppLayout } from "@/components/app-layout"
import { withAuth } from "@/components/with-auth"
import { withRoleProtection } from "@/components/with-role-protection"
import { useAuth } from "@/contexts/auth-context"
import { StatusBadge, PriorityBadge, formatRelativeTime } from "@/components/tickets/ticket-utils"
import type { Ticket, TicketMessage, TicketStatus, TicketPriority } from "@/types/tickets"
import { cn } from "@/lib/utils"

function AdminTicketDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const id = params.id as string

    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [loading, setLoading] = useState(true)
    const [replyBody, setReplyBody] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isChangingStatus, setIsChangingStatus] = useState(false)
    const [isChangingPriority, setIsChangingPriority] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const fetchTicket = useCallback(async () => {
        try {
            const res = await apiFetch(`/api/admin/tickets/${id}`, {}, 'admin')
            if (res.status === 404) {
                toast.error('Ticket no encontrado')
                router.push('/admin/tickets')
                return
            }
            if (!res.ok) throw new Error()
            const data = await res.json()
            setTicket(data.data)
        } catch {
            toast.error('Error al cargar el ticket')
        } finally {
            setLoading(false)
        }
    }, [id, router])

    useEffect(() => {
        fetchTicket()
    }, [fetchTicket])

    useEffect(() => {
        if (ticket?.messages?.length) {
            setTimeout(scrollToBottom, 100)
        }

    }, [ticket?.messages?.length])


    const handleStatusChange = async (newStatus: TicketStatus) => {
        if (!ticket || newStatus === ticket.status) return
        setIsChangingStatus(true)
        try {
            const res = await apiFetch(`/api/admin/tickets/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            }, 'admin')
            if (!res.ok) throw new Error()
            const data = await res.json()
            // Preserve existing messages — the PATCH response doesn't include them
            setTicket(prev => prev ? { ...data.data, messages: prev.messages ?? [] } : data.data)
            toast.success(`Estado actualizado a ${statusLabel(newStatus)}`)
        } catch {
            toast.error('Error al cambiar el estado')
        } finally {
            setIsChangingStatus(false)
        }
    }

    const handlePriorityChange = async (newPriority: TicketPriority) => {
        if (!ticket || newPriority === ticket.priority) return
        setIsChangingPriority(true)
        try {
            const res = await apiFetch(`/api/admin/tickets/${id}/priority`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priority: newPriority }),
            }, 'admin')
            if (!res.ok) throw new Error()
            const data = await res.json()
            // Preserve existing messages — the PATCH response doesn't include them
            setTicket(prev => prev ? { ...data.data, messages: prev.messages ?? [] } : data.data)
            toast.success('Prioridad actualizada')
        } catch {
            toast.error('Error al cambiar la prioridad')
        } finally {
            setIsChangingPriority(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await apiFetch(`/api/admin/tickets/${id}`, { method: 'DELETE' }, 'admin')
            if (res.status === 403) {
                toast.error('Solo los super administradores pueden eliminar tickets')
                return
            }
            if (!res.ok) throw new Error()
            toast.success('Ticket eliminado')
            router.push('/admin/tickets')
        } catch {
            toast.error('Error al eliminar el ticket')
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
        }
    }

    const handleSendReply = async () => {
        if (!replyBody.trim()) {
            toast.error('El mensaje no puede estar vacío')
            return
        }
        setIsSending(true)

        const optimisticMsg: TicketMessage = {
            id: `temp-${Date.now()}`,
            body: replyBody.trim(),
            createdAt: new Date().toISOString(),
            senderType: 'ADMIN',
            userProfileId: null,
            userProfile: null,
            userId: user?.id || null,
            user: user ? { id: user.id, fullName: user.fullName, username: user.username, role: user.role } : null,
            ticketId: id,
        }

        setTicket(prev => prev ? { ...prev, messages: [...prev.messages, optimisticMsg] } : null)
        const sentBody = replyBody
        setReplyBody('')
        setTimeout(scrollToBottom, 100)

        try {
            const res = await apiFetch(`/api/admin/tickets/${id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body: sentBody.trim() }),
            }, 'admin')
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Error al responder')

            toast.success('Respuesta enviada')
            await fetchTicket()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al enviar'
            toast.error(message)
            setTicket(prev => prev ? { ...prev, messages: prev.messages.filter(m => m.id !== optimisticMsg.id) } : null)
            setReplyBody(sentBody)
        } finally {
            setIsSending(false)
        }
    }

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center py-20">
                    <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AppLayout>
        )
    }

    if (!ticket) return null

    const isClosed = ticket.status === 'CLOSED'
    const isSuperAdmin = user?.role === 'super_admin'

    return (
        <AppLayout>
            <div className="space-y-4">
                <Toaster richColors />

                {/* Back */}
                <Link
                    href="/admin/tickets"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <IconArrowLeft className="h-4 w-4" />
                    Volver al panel de tickets
                </Link>

                {/* Main grid layout */}
                <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
                    {/* Left sidebar: ticket metadata & controls */}
                    <div className="space-y-4">
                        {/* Ticket info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Información del Ticket</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                {/* Creator */}
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                    <IconUser className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">{ticket.userProfile.creatorName}</p>
                                        <p className="text-xs text-muted-foreground">{ticket.userProfile.email}</p>
                                        <Link
                                            href={`/profiles/${ticket.userProfileId}`}
                                            className="text-xs text-primary hover:underline mt-0.5 inline-block"
                                        >
                                            Ver perfil
                                        </Link>
                                    </div>
                                </div>

                                {/* Meta info */}
                                <div className="space-y-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <IconCalendar className="h-3.5 w-3.5" />
                                        <span>Creado: {new Date(ticket.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    {ticket.closedAt && (
                                        <div className="flex items-center gap-2">
                                            <IconLock className="h-3.5 w-3.5" />
                                            <span>Cerrado: {new Date(ticket.closedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <IconMessageCircle className="h-3.5 w-3.5" />
                                        <span>{ticket._count.messages} mensajes</span>
                                    </div>
                                </div>

                                {ticket.category && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Categoría</p>
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
                                            {ticket.category}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Controls */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Gestión</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Current badges */}
                                <div className="flex flex-wrap gap-2">
                                    <StatusBadge status={ticket.status} />
                                    <PriorityBadge priority={ticket.priority} />
                                </div>

                                {/* Status control */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Cambiar Estado</Label>
                                    <Select
                                        value={ticket.status}
                                        onValueChange={v => handleStatusChange(v as TicketStatus)}
                                        disabled={isChangingStatus}
                                    >
                                        <SelectTrigger className="h-9">
                                            {isChangingStatus ? (
                                                <span className="flex items-center gap-2 text-sm">
                                                    <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                                                    Guardando...
                                                </span>
                                            ) : (
                                                <SelectValue />
                                            )}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="OPEN">🔵 Abierto</SelectItem>
                                            <SelectItem value="IN_PROGRESS">🟡 En Proceso</SelectItem>
                                            <SelectItem value="RESOLVED">🟢 Resuelto</SelectItem>
                                            <SelectItem value="CLOSED">⚫ Cerrado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Priority control */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Cambiar Prioridad</Label>
                                    <Select
                                        value={ticket.priority}
                                        onValueChange={v => handlePriorityChange(v as TicketPriority)}
                                        disabled={isChangingPriority}
                                    >
                                        <SelectTrigger className="h-9">
                                            {isChangingPriority ? (
                                                <span className="flex items-center gap-2 text-sm">
                                                    <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                                                    Guardando...
                                                </span>
                                            ) : (
                                                <SelectValue />
                                            )}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">⚪ Baja</SelectItem>
                                            <SelectItem value="MEDIUM">🔵 Media</SelectItem>
                                            <SelectItem value="HIGH">🟠 Alta</SelectItem>
                                            <SelectItem value="URGENT">🔴 Urgente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Delete button (super_admin only) */}
                                {isSuperAdmin && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => setShowDeleteModal(true)}
                                    >
                                        <IconTrash className="h-4 w-4 mr-2" />
                                        Eliminar Ticket
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: conversation + reply */}
                    <div className="space-y-4">
                        {/* Ticket subject */}
                        <div className="rounded-xl border bg-card p-4 shadow-sm">
                            <h1 className="text-xl font-bold">{ticket.subject}</h1>
                            <p className="text-xs text-muted-foreground mt-1">
                                #{ticket.id.slice(-8).toUpperCase()} · Actualizado {formatRelativeTime(ticket.updatedAt)}
                            </p>
                        </div>

                        {/* Messages Thread */}
                        <Card>
                            <CardContent className="p-4 space-y-4 min-h-[300px]">
                                {ticket.messages.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground py-8">Sin mensajes aún</p>
                                ) : (
                                    ticket.messages.map(msg => (
                                        <AdminMessageBubble key={msg.id} message={msg} isAdmin={msg.senderType === 'ADMIN'} />
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </CardContent>
                        </Card>

                        {/* Reply form or Closed banner */}
                        {isClosed ? (
                            <div className="flex items-center gap-3 rounded-xl border border-muted bg-muted/50 p-4">
                                <IconLock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">Ticket cerrado</p>
                                    <p className="text-xs text-muted-foreground">
                                        No es posible responder a un ticket cerrado. Cambia el estado para reabrirlo.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="p-4 space-y-3">
                                    <p className="text-sm font-medium">Responder como administrador</p>
                                    <Textarea
                                        value={replyBody}
                                        onChange={e => setReplyBody(e.target.value)}
                                        placeholder="Escribe tu respuesta..."
                                        rows={4}
                                        className="resize-none"
                                        disabled={isSending}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                                handleSendReply()
                                            }
                                        }}
                                    />
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">
                                            Ctrl+Enter para enviar · Al responder el ticket pasa a &quot;En Proceso&quot; automáticamente
                                        </p>
                                        <Button
                                            onClick={handleSendReply}
                                            disabled={isSending || !replyBody.trim()}
                                        >
                                            {isSending ? (
                                                <>
                                                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <IconSend className="mr-2 h-4 w-4" />
                                                    Responder
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar este ticket?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción es permanente e irreversible. Se eliminarán el ticket y todos sus mensajes.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-destructive hover:bg-destructive/90"
                            >
                                {isDeleting ? (
                                    <IconLoader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Eliminar permanentemente'
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    )
}

function AdminMessageBubble({ message, isAdmin }: { message: TicketMessage; isAdmin: boolean }) {
    const senderName = isAdmin
        ? (message.user?.fullName || message.user?.username || 'Administrador')
        : (message.userProfile?.creatorName || 'Creador')

    return (
        <div className={cn("flex flex-col gap-1", isAdmin ? "items-end" : "items-start")}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                {!isAdmin && <span className="font-medium text-foreground">{senderName}</span>}
                {!isAdmin && <span>·</span>}
                <span className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
                    {isAdmin ? 'Soporte' : 'Creador'}
                </span>
                {isAdmin && <span>·</span>}
                {isAdmin && <span className="font-medium text-foreground">{senderName}</span>}
                <span>·</span>
                <span>{formatRelativeTime(message.createdAt)}</span>
            </div>
            <div
                className={cn(
                    "max-w-[85%] rounded-xl px-4 py-2.5 text-sm shadow-sm",
                    isAdmin
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                )}
            >
                <p className="whitespace-pre-wrap break-words leading-relaxed">{message.body}</p>
            </div>
        </div>
    )
}

function statusLabel(s: TicketStatus): string {
    const map: Record<TicketStatus, string> = {
        OPEN: 'Abierto',
        IN_PROGRESS: 'En Proceso',
        RESOLVED: 'Resuelto',
        CLOSED: 'Cerrado',
    }
    return map[s]
}

export default withAuth(withRoleProtection(AdminTicketDetailPage, ['admin', 'super_admin']))
