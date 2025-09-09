"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", searches: 222, found: 150 },
  { date: "2024-04-02", searches: 97, found: 180 },
  { date: "2024-04-03", searches: 167, found: 120 },
  { date: "2024-04-04", searches: 242, found: 260 },
  { date: "2024-04-05", searches: 373, found: 290 },
  { date: "2024-04-06", searches: 301, found: 340 },
  { date: "2024-04-07", searches: 245, found: 180 },
  { date: "2024-04-08", searches: 409, found: 320 },
  { date: "2024-04-09", searches: 59, found: 110 },
  { date: "2024-04-10", searches: 261, found: 190 },
  { date: "2024-04-11", searches: 327, found: 350 },
  { date: "2024-04-12", searches: 292, found: 210 },
  { date: "2024-04-13", searches: 342, found: 380 },
  { date: "2024-04-14", searches: 137, found: 220 },
  { date: "2024-04-15", searches: 120, found: 170 },
  { date: "2024-04-16", searches: 138, found: 190 },
  { date: "2024-04-17", searches: 446, found: 360 },
  { date: "2024-04-18", searches: 364, found: 410 },
  { date: "2024-04-19", searches: 243, found: 180 },
  { date: "2024-04-20", searches: 89, found: 150 },
  { date: "2024-04-21", searches: 137, found: 200 },
  { date: "2024-04-22", searches: 224, found: 170 },
  { date: "2024-04-23", searches: 138, found: 230 },
  { date: "2024-04-24", searches: 387, found: 290 },
  { date: "2024-04-25", searches: 215, found: 250 },
  { date: "2024-04-26", searches: 75, found: 130 },
  { date: "2024-04-27", searches: 383, found: 420 },
  { date: "2024-04-28", searches: 122, found: 180 },
  { date: "2024-04-29", searches: 315, found: 240 },
  { date: "2024-04-30", searches: 454, found: 380 },
  { date: "2024-05-01", searches: 165, found: 220 },
  { date: "2024-05-02", searches: 293, found: 310 },
  { date: "2024-05-03", searches: 247, found: 190 },
  { date: "2024-05-04", searches: 385, found: 420 },
  { date: "2024-05-05", searches: 481, found: 390 },
  { date: "2024-05-06", searches: 498, found: 520 },
  { date: "2024-05-07", searches: 388, found: 300 },
  { date: "2024-05-08", searches: 149, found: 210 },
  { date: "2024-05-09", searches: 227, found: 180 },
  { date: "2024-05-10", searches: 293, found: 330 },
  { date: "2024-05-11", searches: 335, found: 270 },
  { date: "2024-05-12", searches: 197, found: 240 },
  { date: "2024-05-13", searches: 197, found: 160 },
  { date: "2024-05-14", searches: 448, found: 490 },
  { date: "2024-05-15", searches: 473, found: 380 },
  { date: "2024-05-16", searches: 338, found: 400 },
  { date: "2024-05-17", searches: 499, found: 420 },
  { date: "2024-05-18", searches: 315, found: 350 },
  { date: "2024-05-19", searches: 235, found: 180 },
  { date: "2024-05-20", searches: 177, found: 230 },
  { date: "2024-05-21", searches: 82, found: 140 },
  { date: "2024-05-22", searches: 81, found: 120 },
  { date: "2024-05-23", searches: 252, found: 290 },
  { date: "2024-05-24", searches: 294, found: 220 },
  { date: "2024-05-25", searches: 201, found: 250 },
  { date: "2024-05-26", searches: 213, found: 170 },
  { date: "2024-05-27", searches: 420, found: 460 },
  { date: "2024-05-28", searches: 233, found: 190 },
  { date: "2024-05-29", searches: 78, found: 130 },
  { date: "2024-05-30", searches: 340, found: 280 },
  { date: "2024-05-31", searches: 178, found: 230 },
  { date: "2024-06-01", searches: 178, found: 200 },
  { date: "2024-06-02", searches: 470, found: 410 },
  { date: "2024-06-03", searches: 103, found: 160 },
  { date: "2024-06-04", searches: 439, found: 380 },
  { date: "2024-06-05", searches: 88, found: 140 },
  { date: "2024-06-06", searches: 294, found: 250 },
  { date: "2024-06-07", searches: 323, found: 370 },
  { date: "2024-06-08", searches: 385, found: 320 },
  { date: "2024-06-09", searches: 438, found: 480 },
  { date: "2024-06-10", searches: 155, found: 200 },
  { date: "2024-06-11", searches: 92, found: 150 },
  { date: "2024-06-12", searches: 492, found: 420 },
  { date: "2024-06-13", searches: 81, found: 130 },
  { date: "2024-06-14", searches: 426, found: 380 },
  { date: "2024-06-15", searches: 307, found: 350 },
  { date: "2024-06-16", searches: 371, found: 310 },
  { date: "2024-06-17", searches: 475, found: 520 },
  { date: "2024-06-18", searches: 107, found: 170 },
  { date: "2024-06-19", searches: 341, found: 290 },
  { date: "2024-06-20", searches: 408, found: 450 },
  { date: "2024-06-21", searches: 169, found: 210 },
  { date: "2024-06-22", searches: 317, found: 270 },
  { date: "2024-06-23", searches: 480, found: 530 },
  { date: "2024-06-24", searches: 132, found: 180 },
  { date: "2024-06-25", searches: 141, found: 190 },
  { date: "2024-06-26", searches: 434, found: 380 },
  { date: "2024-06-27", searches: 448, found: 490 },
  { date: "2024-06-28", searches: 149, found: 200 },
  { date: "2024-06-29", searches: 103, found: 160 },
  { date: "2024-06-30", searches: 446, found: 400 },
]

const chartConfig = {
  searches: {
    label: "Búsquedas",
    color: "var(--primary)",
  },
  found: {
    label: "Encontrado",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Actividad de Búsqueda</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Resultados de los últimos 3 meses
          </span>
          <span className="@[540px]/card:hidden">Últimos 3 meses</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
            <ToggleGroupItem value="30d">Últimos 30 días</ToggleGroupItem>
            <ToggleGroupItem value="7d">Últimos 7 días</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Últimos 3 meses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Últimos 3 meses
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Últimos 30 días
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Últimos 7 días
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillSearches" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-searches)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-searches)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFound" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-found)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-found)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-ES", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="found"
              type="natural"
              fill="url(#fillFound)"
              stroke="var(--color-found)"
              stackId="a"
            />
            <Area
              dataKey="searches"
              type="natural"
              fill="url(#fillSearches)"
              stroke="var(--color-searches)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
