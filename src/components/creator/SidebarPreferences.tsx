"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import {
    IconMoon,
    IconSun,
    IconDeviceDesktop,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SidebarPreferences() {
    const { setTheme } = useTheme()
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const locale = useLocale()
    //const t = useTranslations("DashboardSidebar") // Assuming we might want to translate labels here too

    const onLanguageChange = (nextLocale: string) => {
        document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`
        startTransition(() => {
            router.refresh()
        })
    }

    return (
        <div className="flex items-center gap-2 px-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <IconSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <IconMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        <IconSun className="mr-2 h-4 w-4" />
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <IconMoon className="mr-2 h-4 w-4" />
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        <IconDeviceDesktop className="mr-2 h-4 w-4" />
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={isPending}>
                        <span className="font-bold text-xs">{locale.toUpperCase()}</span>
                        <span className="sr-only">Toggle language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onLanguageChange("es")}>
                        <span className="mr-2">🇪🇸</span>
                        Español
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onLanguageChange("en")}>
                        <span className="mr-2">🇺🇸</span>
                        English
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
