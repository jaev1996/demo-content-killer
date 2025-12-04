import { Badge } from "@/components/ui/badge"

type Status = 'pending' | 'in_progress' | 'completed' | 'cancelled'

interface StatusBadgeProps {
    status: Status
}

const statusConfig = {
    pending: {
        label: 'Pendiente',
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    },
    in_progress: {
        label: 'En Proceso',
        variant: 'default' as const,
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    },
    completed: {
        label: 'Completado',
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    },
    cancelled: {
        label: 'Cancelado',
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.pending

    return (
        <Badge
            variant={config.variant}
            className={config.className}
        >
            {config.label}
        </Badge>
    )
}
