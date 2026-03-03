"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
    IconArrowLeft,
    IconLoader2,
    IconSend,
    IconLock,
    IconTicket,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Toaster } from "sonner"
import { apiFetch } from "@/lib/api"
import { withCreatorAuth } from "@/components/with-creator-auth"
import { StatusBadge, PriorityBadge, formatRelativeTime } from "@/components/tickets/ticket-utils"
import type { Ticket, TicketMessage } from "@/types/tickets"
import { cn } from "@/lib/utils"

function CreatorTicketDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [loading, setLoading] = useState(true)
    const [replyBody, setReplyBody] = useState('')
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const fetchTicket = useCallback(async () => {
        try {
            const res = await apiFetch(`/api/tickets/my/${id}`)
            if (res.status === 404) {
                toast.error('Ticket no encontrado')
                router.push('/creator/dashboard/tickets')
                return
            }
            if (!res.ok) throw new Error('Error al cargar el ticket')
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
        if (ticket?.messages.length) {
            setTimeout(scrollToBottom, 100)
        }
    }, [ticket?.messages.length])

    const handleSendReply = async () => {
        if (!replyBody.trim()) {
            toast.error('El mensaje no puede estar vacío')
            return
        }

        setIsSending(true)

        // Optimistic update
        const optimisticMsg: TicketMessage = {
            id: `temp-${Date.now()}`,
            body: replyBody.trim(),
            createdAt: new Date().toISOString(),
            senderType: 'CREATOR',
            userProfileId: null,
            userProfile: null,
            userId: null,
            user: null,
            ticketId: id,
        }

        setTicket(prev => prev ? { ...prev, messages: [...prev.messages, optimisticMsg] } : null)
        const sentBody = replyBody
        setReplyBody('')
        setTimeout(scrollToBottom, 100)

        try {
            const res = await apiFetch(`/api/tickets/my/${id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body: sentBody.trim() }),
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.message || 'Error al enviar')
            }

            // Replace optimistic with real message and refresh
            toast.success('Respuesta enviada. El equipo será notificado.')
            await fetchTicket()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al enviar la respuesta'
            toast.error(message)
            // Rollback optimistic update
            setTicket(prev => prev ? { ...prev, messages: prev.messages.filter(m => m.id !== optimisticMsg.id) } : null)
            setReplyBody(sentBody)
        } finally {
            setIsSending(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!ticket) return null

    const isClosed = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            <Toaster richColors />

            {/* Back */}
            <Link
                href="/creator/dashboard/tickets"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <IconArrowLeft className="h-4 w-4" />
                Volver a mis tickets
            </Link>

            {/* Ticket Header */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <IconTicket className="h-4 w-4" />
                            <span>#{ticket.id.slice(-8).toUpperCase()}</span>
                        </div>
                        <h1 className="text-xl font-bold truncate">{ticket.subject}</h1>
                        {ticket.category && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Categoría: <span className="font-medium">{ticket.category}</span>
                            </p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                    </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                    Creado {formatRelativeTime(ticket.createdAt)}
                    {ticket.closedAt && ` · Cerrado ${formatRelativeTime(ticket.closedAt)}`}
                </p>
            </div>

            {/* Messages Thread */}
            <Card>
                <CardContent className="p-4 space-y-4">
                    {ticket.messages.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-8">
                            Sin mensajes aún
                        </p>
                    ) : (
                        ticket.messages.map(msg => (
                            <MessageBubble key={msg.id} message={msg} isCreator={msg.senderType === 'CREATOR'} />
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
                        <p className="text-sm font-medium">Este ticket está cerrado</p>
                        <p className="text-xs text-muted-foreground">
                            Si necesitas más ayuda,{" "}
                            <Link href="/creator/dashboard/tickets/nuevo" className="text-primary hover:underline">
                                abre un nuevo ticket
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            ) : (
                <Card>
                    <CardContent className="p-4 space-y-3">
                        <p className="text-sm font-medium">Escribe tu respuesta</p>
                        <Textarea
                            value={replyBody}
                            onChange={e => setReplyBody(e.target.value)}
                            placeholder="Escribe tu mensaje aquí..."
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
                            <p className="text-xs text-muted-foreground">Ctrl+Enter para enviar</p>
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
                                        Enviar respuesta
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

function MessageBubble({ message, isCreator }: { message: TicketMessage; isCreator: boolean }) {
    const senderName = isCreator
        ? (message.userProfile?.creatorName || 'Tú')
        : (message.user?.fullName || message.user?.username || 'Soporte')

    return (
        <div className={cn("flex flex-col gap-1", isCreator ? "items-end" : "items-start")}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                {!isCreator && <span className="font-medium text-foreground">{senderName}</span>}
                {!isCreator && <span>·</span>}
                <span className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
                    {isCreator ? 'Tú' : 'Soporte'}
                </span>
                {isCreator && <span>·</span>}
                {isCreator && <span className="font-medium text-foreground">{senderName}</span>}
                <span>·</span>
                <span>{formatRelativeTime(message.createdAt)}</span>
            </div>
            <div
                className={cn(
                    "max-w-[80%] rounded-xl px-4 py-2.5 text-sm shadow-sm",
                    isCreator
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                )}
            >
                <p className="whitespace-pre-wrap break-words leading-relaxed">{message.body}</p>
            </div>
        </div>
    )
}

export default withCreatorAuth(CreatorTicketDetailPage)
