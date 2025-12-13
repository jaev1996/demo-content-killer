"use client"

import React, { useState } from "react"
import { withCreatorAuth } from "@/components/with-creator-auth"
import { useTranslations } from "next-intl"

import { apiFetch } from "@/lib/api"
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
import { IconFilter, IconLoader2 } from "@tabler/icons-react"
import { RemovalsTable, RemovalItem, RemovalStatus } from "@/components/creator/removals/RemovalsTable"

const STATUS_OPTIONS: RemovalStatus[] = ["completed", "in_process", "cancelled"]

interface ApiRemovalItem {
    id: number
    contentUrl: string
    reportedAt: string
    status: RemovalStatus
    resolvedAt: string | null
}

function RemovalsPage() {
    const t = useTranslations("CreatorRemovalsPage")
    // const [searchTerm, setSearchTerm] = useState("") // Search API not available yet
    const [statusFilter, setStatusFilter] = useState<RemovalStatus | "all">("all")
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<RemovalItem[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    const fetchRemovals = React.useCallback(async () => {
        try {
            setLoading(true)
            const queryParams = new URLSearchParams()
            queryParams.set('page', page.toString())
            queryParams.set('limit', '10')
            if (statusFilter !== 'all') {
                queryParams.set('status', statusFilter)
            }

            const res = await apiFetch(`/api/auth/me/removals?${queryParams.toString()}`)

            if (res.ok) {
                const json = await res.json()
                if (json.success) {
                    const items = json.data.removals.map((item: ApiRemovalItem) => ({
                        id: item.id.toString(),
                        url: item.contentUrl,
                        detectedOn: item.reportedAt,
                        status: item.status,
                        resolvedOn: item.resolvedAt
                    }))
                    setData(items)
                    setTotalPages(json.data.pagination.totalPages)
                    setTotalItems(json.data.pagination.total)
                }
            }
        } catch (error) {
            console.error("Error fetching removals:", error)
        } finally {
            setLoading(false)
        }
    }, [page, statusFilter])

    React.useEffect(() => {
        fetchRemovals()
    }, [fetchRemovals])

    // Reset page when filter changes
    const handleStatusFilterChange = (status: RemovalStatus | "all") => {
        setStatusFilter(status)
        setPage(1)
    }

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
                        {/* 
                        <Input
                            placeholder={t("searchPlaceholder")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:max-w-sm"
                            disabled
                        /> 
                        */}
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
                                    onCheckedChange={() => handleStatusFilterChange("all")}
                                >
                                    {t("table.statuses.all")}
                                </DropdownMenuCheckboxItem>
                                {STATUS_OPTIONS.map(status => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={statusFilter === status}
                                        onCheckedChange={() => handleStatusFilterChange(status)}
                                    >
                                        {t(`table.statuses.${status}`)}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <RemovalsTable
                            items={data}
                            page={page}
                            totalPages={totalPages}
                            total={totalItems}
                            onPageChange={setPage}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default withCreatorAuth(RemovalsPage)