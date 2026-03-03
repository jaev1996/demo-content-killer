"use client"

import { useState, useEffect, useCallback } from "react"
import {
  IconFileCheck,
  IconUsers,
  IconTicket,
  IconCalendarStats,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { apiFetch } from "@/lib/api"

interface DashboardStats {
  removals: {
    total: number
    thisMonth: number
    lastMonth: number
    deltaVsLastMonth: number
  }
  creators: {
    total: number
    newThisMonth: number
  }
  tickets: {
    open: number
    inProgress: number
    resolved: number
    closed: number
    total: number
  }
}

function SkeletonCard() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="h-3 w-32 bg-muted animate-pulse rounded" />
        <div className="h-8 w-20 bg-muted animate-pulse rounded mt-2" />
        <CardAction>
          <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5">
        <div className="h-3 w-36 bg-muted animate-pulse rounded" />
        <div className="h-3 w-44 bg-muted animate-pulse rounded" />
      </CardFooter>
    </Card>
  )
}

function DeltaBadge({ delta }: { delta: number }) {
  if (delta > 0) return (
    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
      +{delta}% vs mes anterior <IconTrendingUp className="size-4" />
    </span>
  )
  if (delta < 0) return (
    <span className="flex items-center gap-1 text-red-500 font-semibold">
      {delta}% vs mes anterior <IconTrendingDown className="size-4" />
    </span>
  )
  return (
    <span className="flex items-center gap-1 text-muted-foreground">
      Sin cambio vs mes anterior <IconMinus className="size-4" />
    </span>
  )
}

export function SectionCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiFetch('/api/admin/dashboard/stats', {}, 'admin')
      if (!res.ok) throw new Error()
      const json = await res.json()
      setStats(json.data)
    } catch (err) {
      console.error('[SectionCards] fetchStats error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  if (loading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
      </div>
    )
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      {/* Card 1 — Eliminaciones totales */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconFileCheck className="size-4" />
            Eliminaciones Totales
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.removals.total.toLocaleString('es-ES') ?? "—"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconFileCheck className="size-3" />
              Total
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {stats && <DeltaBadge delta={stats.removals.deltaVsLastMonth} />}
          <p className="text-xs text-muted-foreground leading-relaxed">
            {stats?.removals.thisMonth ?? 0} este mes · {stats?.removals.lastMonth ?? 0} el mes pasado
          </p>
        </CardFooter>
      </Card>

      {/* Card 2 — Este mes */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconCalendarStats className="size-4" />
            Eliminaciones Este Mes
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.removals.thisMonth ?? "—"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCalendarStats className="size-3" />
              Mes actual
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Mes anterior: {stats?.removals.lastMonth ?? 0}
            {stats && stats.removals.thisMonth >= stats.removals.lastMonth
              ? <IconTrendingUp className="size-4 text-green-500" />
              : <IconTrendingDown className="size-4 text-red-500" />
            }
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Reclamos de contenido procesados en {new Date().toLocaleDateString('es-ES', { month: 'long' })}.
          </p>
        </CardFooter>
      </Card>

      {/* Card 3 — Creadores */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconUsers className="size-4" />
            Creadores Registrados
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.creators.total ?? "—"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers className="size-3" />
              Creadores
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {(stats?.creators.newThisMonth ?? 0) > 0
              ? <><span className="text-green-600">+{stats?.creators.newThisMonth}</span> nuevos este mes <IconTrendingUp className="size-4 text-green-500" /></>
              : <span className="text-muted-foreground">Sin nuevos este mes</span>
            }
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Perfiles de creadores de contenido en la plataforma.
          </p>
        </CardFooter>
      </Card>

      {/* Card 4 — Tickets */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconTicket className="size-4" />
            Tickets de Soporte
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats ? stats.tickets.open + stats.tickets.inProgress : "—"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTicket className="size-3" />
              Pendientes
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {(stats?.tickets.open ?? 0) > 0
              ? <span className="text-amber-600">{stats?.tickets.open} abiertos requieren atención</span>
              : <span className="text-green-600">Sin tickets abiertos 🎉</span>
            }
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {stats?.tickets.inProgress ?? 0} en proceso · {stats?.tickets.resolved ?? 0} resueltos · {stats?.tickets.total ?? 0} total
          </p>
        </CardFooter>
      </Card>

    </div>
  )
}
