"use client"


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { IconChevronLeft, IconChevronRight, IconExternalLink } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// TODO: Mover estos tipos a un archivo central de tipos (ej: src/types/index.ts)
export type RemovalStatus = "completed" | "in_process" | "cancelled" | "pending" | "in_progress"

export interface RemovalItem {
    id: string
    url: string
    detectedOn: string // ISO date string
    status: RemovalStatus
    resolvedOn: string | null // ISO date string or null
}

interface RemovalsTableProps {
    items: RemovalItem[]
    page: number
    totalPages: number
    total: number
    onPageChange: (page: number) => void
}

// Custom badge styling for each status - works in both light and dark mode
const statusStyles: Record<RemovalStatus, string> = {
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
    in_process: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
    in_progress: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-800",
    cancelled: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700",
}

export function RemovalsTable({ items, page, totalPages, total, onPageChange }: RemovalsTableProps) {
    const t = useTranslations("CreatorRemovalsPage.table")

    // Logic removed: client-side slicing. We now use 'items' directly as they are the current page items.
    // Logic removed: internal currentPage state.

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "—"
        return new Date(dateString).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    const handlePreviousPage = () => {
        onPageChange(Math.max(page - 1, 1))
    }

    const handleNextPage = () => {
        onPageChange(Math.min(page + 1, totalPages))
    }

    // Determine start/end for display purposes
    const ITEMS_PER_PAGE = 10 // Assuming 10 from API or passed prop, keeping standardized
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + items.length

    return (
        <div className="space-y-4">
            {/* Vista de tarjetas para móvil */}
            <div className="md:hidden space-y-3">
                {items.length > 0 ? (
                    items.map((item) => (
                        <Card key={item.id} className="p-4">
                            <div className="space-y-3">
                                {/* URL */}
                                <div className="flex items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground mb-1">
                                            {t("headers.url")}
                                        </p>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium hover:underline break-all flex items-center gap-1"
                                        >
                                            <span className="line-clamp-2">{item.url}</span>
                                            <IconExternalLink className="h-3 w-3 flex-shrink-0" />
                                        </a>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                        {t("headers.status")}
                                    </p>
                                    <Badge className={cn(statusStyles[item.status], "text-xs")}>
                                        {t(`statuses.${item.status}`)}
                                    </Badge>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">
                                            {t("headers.detectedOn")}
                                        </p>
                                        <p className="text-sm">{formatDate(item.detectedOn)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">
                                            {t("headers.resolvedOn")}
                                        </p>
                                        <p className="text-sm">{formatDate(item.resolvedOn)}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="p-8">
                        <p className="text-center text-muted-foreground">{t("noResults")}</p>
                    </Card>
                )}
            </div>

            {/* Vista de tabla para desktop con scroll horizontal en tablet */}
            <div className="hidden md:block overflow-x-auto -mx-6 px-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[250px]">{t("headers.url")}</TableHead>
                            <TableHead className="min-w-[120px]">{t("headers.detectedOn")}</TableHead>
                            <TableHead className="min-w-[120px]">{t("headers.status")}</TableHead>
                            <TableHead className="text-right min-w-[120px]">{t("headers.resolvedOn")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length > 0 ? (
                            items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="max-w-[400px] font-medium">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline flex items-center gap-2 group"
                                        >
                                            <span className="truncate">{item.url}</span>
                                            <IconExternalLink className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    </TableCell>
                                    <TableCell>{formatDate(item.detectedOn)}</TableCell>
                                    <TableCell>
                                        <Badge className={cn(statusStyles[item.status])}>
                                            {t(`statuses.${item.status}`)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{formatDate(item.resolvedOn)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    {t("noResults")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Paginación - Responsive */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 pt-2">
                    <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
                        {t("pagination.showing", {
                            start: startIndex + 1,
                            end: endIndex,
                            total: total
                        })}
                    </div>
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                            className="h-8"
                        >
                            <IconChevronLeft className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">{t("pagination.previous")}</span>
                        </Button>
                        <div className="text-xs sm:text-sm font-medium px-2">
                            {page} / {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                            className="h-8"
                        >
                            <span className="hidden sm:inline">{t("pagination.next")}</span>
                            <IconChevronRight className="h-4 w-4 sm:ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

