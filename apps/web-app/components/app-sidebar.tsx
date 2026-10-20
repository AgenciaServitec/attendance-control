"use client";

import * as React from "react";
import {
  IconAdjustments,
  IconCalendarTime,
  IconClockCheck,
  IconDashboard,
  IconHelp,
  IconList,
  IconPlus,
  IconSettings,
  IconShieldLock,
  IconUsers,
} from "@tabler/icons-react";
import { Group } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { OrgSwitcher } from "@/components/_org-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/store/use-user-store";

const data = {
  organizations: [
    {
      name: "Servitec Perú S.A.C.",
      logo: "/logo.png",
      plan: "Plan Enterprise",
    },
    {
      name: "I.E. Santa Rosa",
      logo: "",
      plan: "Plan Educativo",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Administración",
      icon: IconAdjustments,
      items: [
        {
          title: "Usuarios",
          icon: IconUsers,
          items: [
            {
              title: "Crear Usuario",
              url: "/administration/users/new",
              icon: IconPlus,
            },
            {
              title: "Lista de Usuarios",
              url: "/administration/users",
              icon: IconList,
            },
          ],
        },
        {
          title: "Roles & Permisos",
          icon: IconShieldLock,
          items: [
            {
              title: "Crear Rol",
              url: "/administration/roles/new",
              icon: IconPlus,
            },
            {
              title: "Lista de Roles",
              url: "/administration/roles",
              icon: IconList,
            },
          ],
        },
        {
          title: "Grupos",
          icon: Group,
          items: [
            {
              title: "Crear Grupo",
              url: "/administration/groups/new",
              icon: IconPlus,
            },
            {
              title: "Lista de Grupos",
              url: "/administration/groups",
              icon: IconList,
            },
          ],
        },
        {
          title: "Horarios",
          icon: IconCalendarTime,
          items: [
            {
              title: "Crear Horario",
              url: "/schedules/new",
              icon: IconList,
            },
            {
              title: "Lista de Horarios",
              url: "/schedules",
              icon: IconPlus,
            },
          ],
        },
      ],
    },
    {
      title: "Mis Asistencias",
      url: "/attendance",
      icon: IconClockCheck,
    },
  ],
  navSecondary: [
    {
      title: "Configuración",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Soporte",
      url: "/soporte",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserStore((state) => state.user);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <OrgSwitcher organizations={data.organizations} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
