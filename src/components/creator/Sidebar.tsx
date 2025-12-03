"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import {
    IconLayoutDashboard,
    IconTrash,
    IconCreditCard,
    IconSettings,
    IconLogout,
    IconX,
} from "@tabler/icons-react"
import { useCreatorAuth } from "@/contexts/creator-auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SidebarPreferences } from "./SidebarPreferences"

interface SidebarProps {
    isOpen?: boolean
    onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname()
    const { logout } = useCreatorAuth()
    const t = useTranslations("DashboardSidebar")
    const sidebarRef = useRef<HTMLDivElement>(null)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

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

    // Cerrar sidebar al cambiar de ruta en móvil
    useEffect(() => {
        if (isOpen && onClose) {
            onClose()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    // Prevenir scroll del body cuando el sidebar está abierto en móvil
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Detectar swipe para cerrar
    const minSwipeDistance = 50

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        if (isLeftSwipe && onClose) {
            onClose()
        }
    }

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            {/* Header con botón de cerrar en móvil */}
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 flex-shrink-0">
                <Link href="/" className="flex items-center gap-2 font-semibold text-primary flex-1">
                    <Image
                        src="/privaclean.svg"
                        alt="PrivaClean Logo"
                        width={48}
                        height={48}
                        className="h-14 w-14"
                    />
                    <span className="text-foreground">PrivaClean</span>
                </Link>
                {/* Botón de cerrar solo visible en móvil */}
                {onClose && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={onClose}
                    >
                        <IconX className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Navigation - scrollable area */}
            <div className="flex-1 overflow-y-auto">
                <nav className="grid items-start px-2 py-4 text-sm font-medium lg:px-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-accent",
                                pathname === item.href && "bg-muted text-accent"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Footer - stays at bottom */}
            <div className="border-t bg-background p-4 flex flex-col gap-2 flex-shrink-0">
                <SidebarPreferences />
                <Button size="sm" className="w-full bg-red-600 hover:bg-red-700" onClick={logout}>
                    <IconLogout className="mr-2 h-4 w-4" />
                    {t("nav.logout")}
                </Button>
            </div>
        </div>
    )

    return (
        <>
            {/* Sidebar para desktop - siempre visible */}
            <aside className="hidden border-r bg-muted/40 md:block">
                <SidebarContent />
            </aside>

            {/* Overlay para móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar para móvil - deslizable */}
            <aside
                ref={sidebarRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-[280px] border-r bg-background shadow-lg md:hidden transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <SidebarContent />
            </aside>
        </>
    )
}
