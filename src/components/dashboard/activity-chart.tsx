"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

export interface ActivityData {
    month: string
    removals: number
}

interface ActivityChartProps {
    data: ActivityData[]
}

export function ActivityChart({ data }: ActivityChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <p className="text-sm">No hay datos de actividad disponibles</p>
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
                <XAxis
                    dataKey="month"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid hsl(var(--border))',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        backgroundColor: 'hsl(var(--background))',
                        color: 'hsl(var(--foreground))'
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend
                    wrapperStyle={{ paddingTop: '10px' }}
                />
                <Bar
                    dataKey="removals"
                    name="Retiradas"
                    fill="#9f0712" // Red-600
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
