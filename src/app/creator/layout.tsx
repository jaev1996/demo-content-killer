"use client"

import { useState } from "react"
import { Sidebar } from "@/components/creator/Sidebar"
import { CreatorAuthProvider } from "@/contexts/creator-auth-context"
import { Button } from "@/components/ui/button"
import { IconMenu2 } from "@tabler/icons-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <CreatorAuthProvider>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
                <div className="flex flex-col">
                    {/* Header para móvil con botón hamburguesa */}
                    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Abrir menú"
                        >
                            <IconMenu2 className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-semibold">PrivaClean</h1>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </CreatorAuthProvider>
    )
}
