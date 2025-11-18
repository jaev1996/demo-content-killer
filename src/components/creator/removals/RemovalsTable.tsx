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
import { useTranslations } from "next-intl"

// TODO: Mover estos tipos a un archivo central de tipos (ej: src/types/index.ts)
export type RemovalStatus = "removed" | "in_process" | "reported" | "failed"

export interface RemovalItem {
    id: string
    url: string
    platform: string
    detectedOn: string // ISO date string
    status: RemovalStatus
    resolvedOn: string | null // ISO date string or null
}

interface RemovalsTableProps {
    items: RemovalItem[]
}

const statusVariantMap: Record<RemovalStatus, "default" | "secondary" | "destructive" | "outline"> = {
    removed: "default",
    in_process: "secondary",
    reported: "outline",
    failed: "destructive",
}

export function RemovalsTable({ items }: RemovalsTableProps) {
    const t = useTranslations("CreatorRemovalsPage.table")

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "—"
        return new Date(dateString).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{t("headers.url")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("headers.platform")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("headers.detectedOn")}</TableHead>
                    <TableHead>{t("headers.status")}</TableHead>
                    <TableHead className="text-right hidden md:table-cell">{t("headers.resolvedOn")}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.length > 0 ? (
                    items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="max-w-[200px] truncate font-medium">
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {item.url}
                                </a>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{item.platform}</TableCell>
                            <TableCell className="hidden md:table-cell">{formatDate(item.detectedOn)}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariantMap[item.status]}>
                                    {t(`statuses.${item.status}`)}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right hidden md:table-cell">{formatDate(item.resolvedOn)}</TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow><TableCell colSpan={5} className="h-24 text-center">{t("noResults")}</TableCell></TableRow>
                )}
            </TableBody>
        </Table>
    )
}

