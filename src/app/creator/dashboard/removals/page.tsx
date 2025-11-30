"use client"

import React, { useState, useMemo } from "react"
import { withCreatorAuth } from "@/components/with-creator-auth"
import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconFilter } from "@tabler/icons-react"
import { RemovalsTable, RemovalItem, RemovalStatus } from "@/components/creator/removals/RemovalsTable"

// TODO: Estos datos vendrán de una llamada a la API, gestionados por un admin.
const mockData: RemovalItem[] = [
    { id: "1", url: "https://example-pirate.com/video123", detectedOn: "2025-01-15T10:00:00Z", status: "completed", resolvedOn: "2025-01-17T15:30:00Z" },
    { id: "2", url: "https://another-site.net/content/leak45", detectedOn: "2025-02-10T11:00:00Z", status: "in_process", resolvedOn: "2025-02-12T09:20:00Z" },
    { id: "3", url: "https://bad-forum.org/thread/99", detectedOn: "2025-03-05T09:00:00Z", status: "in_process", resolvedOn: "2025-03-06T14:00:00Z" },
    { id: "4", url: "https://secret-stash.io/my-stuff", detectedOn: "2025-01-20T14:00:00Z", status: "cancelled", resolvedOn: "2025-01-22T18:00:00Z" },
    { id: "5", url: "https://leaky-content.com/post/abc", detectedOn: "2025-04-08T08:00:00Z", status: "in_process", resolvedOn: "2025-04-09T10:30:00Z" },
    { id: "6", url: "https://pirate-bay-clone.com/vid789", detectedOn: "2025-02-28T10:00:00Z", status: "completed", resolvedOn: "2025-03-02T11:00:00Z" },
    { id: "7", url: "https://forum-xyz.com/topic/12345", detectedOn: "2025-05-12T12:00:00Z", status: "in_process", resolvedOn: "2025-05-13T16:45:00Z" },
    { id: "8", url: "https://content-leak.org/media/xyz789", detectedOn: "2025-06-01T08:30:00Z", status: "completed", resolvedOn: "2025-06-03T10:15:00Z" },
    { id: "9", url: "https://pirate-hub.net/download/456", detectedOn: "2025-07-15T14:20:00Z", status: "in_process", resolvedOn: "2025-07-16T11:00:00Z" },
    { id: "10", url: "https://illegal-share.com/file/abc123", detectedOn: "2025-08-20T09:00:00Z", status: "completed", resolvedOn: "2025-08-22T13:30:00Z" },
    { id: "11", url: "https://stolen-content.io/post/999", detectedOn: "2025-09-10T10:45:00Z", status: "cancelled", resolvedOn: "2025-09-11T15:20:00Z" },
    { id: "12", url: "https://leak-central.com/thread/7777", detectedOn: "2025-10-05T11:30:00Z", status: "in_process", resolvedOn: "2025-10-06T09:00:00Z" },
    { id: "13", url: "https://unauthorized-site.net/video/555", detectedOn: "2025-11-01T13:00:00Z", status: "completed", resolvedOn: "2025-11-03T14:45:00Z" },
    { id: "14", url: "https://piracy-forum.org/share/888", detectedOn: "2025-11-15T08:15:00Z", status: "in_process", resolvedOn: "2025-11-16T10:30:00Z" },
    { id: "15", url: "https://content-thief.com/media/abc", detectedOn: "2025-11-20T12:00:00Z", status: "completed", resolvedOn: "2025-11-22T16:00:00Z" },
]

const STATUS_OPTIONS: RemovalStatus[] = ["completed", "in_process", "cancelled"]

function RemovalsPage() {
    const t = useTranslations("CreatorRemovalsPage")
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<RemovalStatus | "all">("all")

    const filteredData = useMemo(() => {
        return mockData.filter(item => {
            const matchesSearch = item.url.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === "all" || item.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [searchTerm, statusFilter])

    return (
        <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4 md:gap-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-semibold">{t("title")}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
            </div>

            {/* Tabla de removals */}
            <Card>
                <CardHeader>
                    {/* Controles de búsqueda y filtro - Responsive */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                        <Input
                            placeholder={t("searchPlaceholder")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:max-w-sm"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full sm:w-auto sm:ml-auto">
                                    <IconFilter className="mr-2 h-4 w-4" />
                                    <span className="truncate">{t("filterByStatus")}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuLabel>{t("filterByStatus")}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    checked={statusFilter === "all"}
                                    onCheckedChange={() => setStatusFilter("all")}
                                >
                                    {t("table.statuses.all")}
                                </DropdownMenuCheckboxItem>
                                {STATUS_OPTIONS.map(status => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={statusFilter === status}
                                        onCheckedChange={() => setStatusFilter(status)}
                                    >
                                        {t(`table.statuses.${status}`)}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent>
                    <RemovalsTable items={filteredData} />
                </CardContent>
            </Card>
        </div>
    )
}

export default withCreatorAuth(RemovalsPage)