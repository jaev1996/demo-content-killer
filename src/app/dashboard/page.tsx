"use client"

import { withAuth } from "@/components/with-auth"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { AppLayout } from "@/components/app-layout"

import data from "./data.json"

function DashboardPage() {
  return (
    <AppLayout>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <SectionCards />
          <ChartAreaInteractive />
          <DataTable data={data} />
        </div>
      </div>
    </AppLayout>
  )
}

export default withAuth(DashboardPage)
