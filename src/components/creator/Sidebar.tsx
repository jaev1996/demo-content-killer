"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import {
    IconLayoutDashboard,
    IconTrash,
    IconCreditCard,
    IconSettings,
    IconLogout,
} from "@tabler/icons-react"
import { useCreatorAuth } from "@/contexts/creator-auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Sidebar() {
    const pathname = usePathname()
    const { logout } = useCreatorAuth()
    const t = useTranslations("DashboardSidebar")

    // Definimos los elementos de navegación dentro del componente para acceder a `t`
    const navItems = [
        {
            href: "/creator/dashboard",
            label: t("nav.home"),
            icon: IconLayoutDashboard,
        },
        {
            href: "/creator/dashboard/removals",
            label: t("nav.removals"),
            icon: IconTrash,
        },
        {
            href: "/creator/dashboard/subscription",
            label: t("nav.subscription"),
            icon: IconCreditCard,
        },
        {
            href: "/creator/dashboard/settings",
            label: t("nav.settings"),
            icon: IconSettings,
        },
    ]

    return (
        <aside className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
                        <Image
                            src="/privaclean.svg"
                            alt="PrivaClean Logo"
                            width={48}
                            height={48}
                            className="h-14 w-14"
                        />
                        <span className="text-foreground">PrivaClean</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                    pathname === item.href && "bg-muted text-primary"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <Button size="sm" className="w-full" onClick={logout}>
                        <IconLogout className="mr-2 h-4 w-4" />
                        {t("logout")}
                    </Button>
                </div>
            </div>
        </aside>
    )
}
