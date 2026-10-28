"use client";

import * as React from "react";
import { IconBuilding, IconPlus, IconUsers } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Organizaciones",
      icon: IconBuilding,
      items: [
        {
          title: "Crear Empresa",
          url: "/organizations/create",
          icon: IconPlus,
        },
        {
          title: "Lista de Empresas",
          url: "/organizations",
          icon: IconBuilding,
        },
      ],
    },
    {
      title: "Usuarios",
      icon: IconUsers,
      items: [
        {
          title: "Crear Usuario",
          url: "/users/new",
          icon: IconPlus,
        },
        {
          title: "Lista de Usuarios",
          url: "/users",
          icon: IconUsers,
        },
      ],
    },
  ],
};

export function HubSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="flex items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                  <Image
                    src="/logo.png"
                    alt="Logo de Servitec Time"
                    width={24}
                    height={24}
                    className="rounded-xs object-cover"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Servitec Time</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Plan Educativo
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
