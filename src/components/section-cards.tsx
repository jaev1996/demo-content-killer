import {
  IconFileCheck,
  IconFileSearch,
  IconHourglass,
  IconTrendingUp,
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

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Búsquedas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,250
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconFileSearch />
              Hoy
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            +15% vs ayer <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Búsquedas realizadas en las últimas 24h.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Contenido Eliminado</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            892
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconFileCheck />
              Este mes
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Tasa de éxito del 98%
          </div>
          <div className="text-muted-foreground">
            Contenido eliminado exitosamente.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Reclamos Pendientes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            32
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconHourglass />
              En cola
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Acción manual requerida
          </div>
          <div className="text-muted-foreground">
            Reclamos esperando aprobación.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Creadora Principal</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Elena Valera
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +25%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Mayor crecimiento en búsquedas.
          </div>
          <div className="text-muted-foreground">
            Creadora con más actividad este mes.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
