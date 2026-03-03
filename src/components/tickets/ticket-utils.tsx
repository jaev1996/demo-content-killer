// src/components/tickets/ticket-utils.tsx
import { Badge } from "@/components/ui/badge"
import type { TicketStatus, TicketPriority } from "@/types/tickets"

export function getStatusConfig(status: TicketStatus) {
    switch (status) {
        case 'OPEN':
            return { label: 'Abierto', className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' }
        case 'IN_PROGRESS':
            return { label: 'En Proceso', className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800' }
        case 'RESOLVED':
            return { label: 'Resuelto', className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' }
        case 'CLOSED':
            return { label: 'Cerrado', className: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' }
    }
}

export function getPriorityConfig(priority: TicketPriority) {
    switch (priority) {
        case 'LOW':
            return { label: 'Baja', className: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' }
        case 'MEDIUM':
            return { label: 'Media', className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' }
        case 'HIGH':
            return { label: 'Alta', className: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800' }
        case 'URGENT':
            return { label: 'Urgente', className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' }
    }
}

export function StatusBadge({ status }: { status: TicketStatus }) {
    const config = getStatusConfig(status)
    return (
        <Badge variant="outline" className={config.className}>
            {config.label}
        </Badge>
    )
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
    const config = getPriorityConfig(priority)
    return (
        <Badge variant="outline" className={config.className}>
            {config.label}
        </Badge>
    )
}

export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return 'hace un momento'
    if (diffMin < 60) return `hace ${diffMin} min`
    if (diffHour < 24) return `hace ${diffHour} h`
    if (diffDay < 7) return `hace ${diffDay} día${diffDay > 1 ? 's' : ''}`
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}
