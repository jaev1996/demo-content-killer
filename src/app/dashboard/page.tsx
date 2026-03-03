"use client"

import { withAuth } from "@/components/with-auth"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { RecentRemovalsTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { AppLayout } from "@/components/app-layout"

function DashboardPage() {
  return (
    <AppLayout>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <div className="px-4 lg:px-6">
            <RecentRemovalsTable />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default withAuth(DashboardPage)
