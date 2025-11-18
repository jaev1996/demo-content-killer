"use client"

import React, { useState, useMemo } from "react"
import { withCreatorAuth } from "@/components/with-creator-auth"
import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
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
    { id: "1", url: "https://example-pirate.com/video123", platform: "Example-Pirate", detectedOn: "2024-08-20T10:00:00Z", status: "removed", resolvedOn: "2024-08-22T15:30:00Z" },
    { id: "2", url: "https://another-site.net/content/leak45", platform: "Another-Site", detectedOn: "2024-08-21T11:00:00Z", status: "in_process", resolvedOn: null },
    { id: "3", url: "https://bad-forum.org/thread/99", platform: "Bad-Forum", detectedOn: "2024-08-19T09:00:00Z", status: "reported", resolvedOn: null },
    { id: "4", url: "https://secret-stash.io/my-stuff", platform: "Secret-Stash", detectedOn: "2024-08-18T14:00:00Z", status: "failed", resolvedOn: "2024-08-20T18:00:00Z" },
    { id: "5", url: "https://leaky-content.com/post/abc", platform: "Leaky-Content", detectedOn: "2024-08-22T08:00:00Z", status: "in_process", resolvedOn: null },
    { id: "6", url: "https://pirate-bay-clone.com/vid789", platform: "Pirate-Clone", detectedOn: "2024-07-30T10:00:00Z", status: "removed", resolvedOn: "2024-08-02T11:00:00Z" },
    { id: "7", url: "https://forum-xyz.com/topic/12345", platform: "Forum-XYZ", detectedOn: "2024-08-23T12:00:00Z", status: "reported", resolvedOn: null },
]

const STATUS_OPTIONS: RemovalStatus[] = ["removed", "in_process", "reported", "failed"]

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
        <div className="mx-auto grid w-full flex-1 auto-rows-max gap-6">
            <div>
                <h1 className="text-3xl font-semibold">{t("title")}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Input
                            placeholder={t("searchPlaceholder")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    <IconFilter className="mr-2 h-4 w-4" />
                                    {t("filterByStatus")}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
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