"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  IconExternalLink,
  IconLoader2,
  IconInbox,
  IconRefresh,
  IconAlertCircle,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiFetch } from "@/lib/api"
import type { ContentRemoval } from "@/types/removals"
import { cn } from "@/lib/utils"

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  pending: { label: "Pendiente", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  in_progress: { label: "En Proceso", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  completed: { label: "Completado", class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  cancelled: { label: "Cancelado", class: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
}

function RemovalStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_MAP[status] ?? { label: status, class: "" }
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold", cfg.class)}>
      {cfg.label}
    </span>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit", month: "short", year: "numeric"
  })
}

function truncateUrl(url: string, maxLen = 40) {
  try {
    const u = new URL(url)
    const short = u.hostname + u.pathname
    return short.length > maxLen ? short.slice(0, maxLen) + "…" : short
  } catch {
    return url.length > maxLen ? url.slice(0, maxLen) + "…" : url
  }
}

export function RecentRemovalsTable() {
  const [removals, setRemovals] = useState<ContentRemoval[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchRemovals = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await apiFetch('/api/admin/removals?page=1&limit=8&status=all', {}, 'admin')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setRemovals(data.data?.removals ?? [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchRemovals() }, [fetchRemovals])

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Eliminaciones Recientes</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Últimos 8 reclamos de contenido registrados
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={fetchRemovals}
              disabled={loading}
            >
              <IconRefresh className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
              <Link href="/admin/removals">Ver todos →</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <IconLoader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
            <IconAlertCircle className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Error al cargar los reclamos</p>
            <Button variant="outline" size="sm" onClick={fetchRemovals}>Reintentar</Button>
          </div>
        ) : removals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
            <IconInbox className="h-7 w-7 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Sin eliminaciones registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold px-4 py-2">Creador</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold px-4 py-2">URL</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold px-4 py-2">Plataforma</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold px-4 py-2">Estado</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold px-4 py-2">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {removals.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="px-4 py-2.5">
                      <span className="text-xs font-medium leading-snug">
                        {r.creatorName ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-2.5 max-w-[220px]">
                      <a
                        href={r.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                        title={r.contentUrl}
                      >
                        <span className="truncate">{truncateUrl(r.contentUrl)}</span>
                        <IconExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {r.platform}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <RemovalStatusBadge status={r.status} />
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(r.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
