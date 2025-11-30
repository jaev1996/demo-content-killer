"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
    {
        name: "1 Nov",
        encontrados: 12,
        eliminados: 10,
    },
    {
        name: "5 Nov",
        encontrados: 18,
        eliminados: 15,
    },
    {
        name: "10 Nov",
        encontrados: 25,
        eliminados: 24,
    },
    {
        name: "15 Nov",
        encontrados: 8,
        eliminados: 8,
    },
    {
        name: "20 Nov",
        encontrados: 30,
        eliminados: 28,
    },
    {
        name: "25 Nov",
        encontrados: 45,
        eliminados: 39,
    },
]

export function ActivityChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
                <XAxis
                    dataKey="name"
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
                    dataKey="encontrados"
                    name="Encontrados"
                    fill="#bd322e" // Red-300
                    radius={[4, 4, 0, 0]}
                />
                <Bar
                    dataKey="eliminados"
                    name="Eliminados"
                    fill="#9f0712" // Red-600
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
