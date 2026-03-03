"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { IconRefresh, IconLoader2 } from "@tabler/icons-react"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"

interface ActivityPoint {
  date: string
  removals: number
}

const chartConfig = {
  removals: {
    label: "Eliminaciones",
    color: "var(--primary)",
  },
} satisfies ChartConfig

const RANGE_LABELS: Record<string, string> = {
  "7d": "últimos 7 días",
  "30d": "últimos 30 días",
  "90d": "últimos 3 meses",
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [data, setData] = React.useState<ActivityPoint[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  const fetchActivity = React.useCallback(async (range: string) => {
    setLoading(true)
    try {
      const res = await apiFetch(`/api/admin/dashboard/activity?range=${range}`, {}, 'admin')
      if (!res.ok) throw new Error()
      const json = await res.json()
      setData(Array.isArray(json.data) ? json.data : [])
    } catch (err) {
      console.error('[ChartAreaInteractive] fetch error:', err)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchActivity(timeRange)
  }, [timeRange, fetchActivity])

  const totalRemovals = data.reduce((s, d) => s + (d.removals ?? 0), 0)

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Actividad de Eliminaciones
          {loading && <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {totalRemovals.toLocaleString('es-ES')} eliminaciones en los {RANGE_LABELS[timeRange]}
          </span>
          <span className="@[540px]/card:hidden">
            {totalRemovals.toLocaleString('es-ES')} eliminaciones
          </span>
        </CardDescription>
        <CardAction className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => fetchActivity(timeRange)}
            disabled={loading}
          >
            <IconRefresh className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={v => v && setTimeRange(v)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="7d">7 días</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 días</ToggleGroupItem>
            <ToggleGroupItem value="90d">3 meses</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={v => setTimeRange(v)}>
            <SelectTrigger className="flex w-36 @[767px]/card:hidden" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">Últimos 7 días</SelectItem>
              <SelectItem value="30d" className="rounded-lg">Últimos 30 días</SelectItem>
              <SelectItem value="90d" className="rounded-lg">Últimos 3 meses</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="h-[250px] w-full bg-muted/30 animate-pulse rounded-lg" />
        ) : data.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
            Sin datos de actividad para este período
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillRemovals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-removals)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-removals)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={timeRange === '7d' ? 0 : 32}
                tickFormatter={(value) =>
                  new Date(value + 'T00:00:00').toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value + 'T00:00:00').toLocaleDateString("es-ES", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="removals"
                type="monotone"
                fill="url(#fillRemovals)"
                stroke="var(--color-removals)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
