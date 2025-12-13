"use client"

import * as React from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconListCheck,
  IconUserCircle,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconTrashX,
} from "@tabler/icons-react"

//import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navMainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Buscar Contenido",
    url: "/search", // Esta opción podría iniciar una búsqueda
    icon: IconSearch,
  },
  {
    title: "Reclamos Pendientes",
    url: "/takedowns", // La lista de reclamos para aprobar
    icon: IconListCheck,
  },
  {
    title: "Historial de Reclamos",
    url: "/history", // Historial de reclamos enviados y resueltos
    icon: IconChartBar,
  },
  {
    title: "Perfiles de Cliente",
    url: "/profiles", // Donde el cliente gestiona la whitelist
    icon: IconUserCircle,
  },
]
const data = {
  // Opciones secundarias para la configuración y ayuda
  navSecondary: [
    {
      title: "Configuración",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Ayuda",
      url: "#",
      icon: IconHelp,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const navMain = React.useMemo(() => {
    const items = [...navMainItems]
    if (user?.role === "super_admin") {
      items.push({
        title: "Gestión de Usuarios",
        url: "/admin/users",
        icon: IconUsers,
      })
      items.push({
        title: "Gestión de Eliminaciones",
        url: "/admin/removals",
        icon: IconTrashX,
      })
    }
    return items
  }, [user])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image src="/privaclean.svg" alt="PrivaClean" width={24} height={24} className="size-6" />
                <span className="text-base font-semibold">PrivaClean Admin Panel</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
