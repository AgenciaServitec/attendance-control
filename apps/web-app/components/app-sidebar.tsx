"use client";

import * as React from "react";
import {
    IconAdjustments,
    IconBellRinging,
    IconBuilding,
    IconCalendarTime,
    IconClockCheck,
    IconDashboard,
    IconDeviceDesktop,
    IconFileAnalytics,
    IconFileDescription,
    IconHelp,
    IconList,
    IconMapPin,
    IconPlus,
    IconSettings,
    IconShieldLock,
    IconUserCheck,
    IconUsers,
} from "@tabler/icons-react";
import {School} from "lucide-react";

import {NavMain} from "@/components/nav-main";
import {NavSecondary} from "@/components/nav-secondary";
import {NavUser} from "@/components/nav-user";
import {OrgSwitcher} from "@/components/_org-switcher";
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader,} from "@/components/ui/sidebar";

const data = {
    user: {
        name: "Angel Gala",
        email: "angel@servitec.pe",
        avatar: "/avatars/user.jpg",
    },
    organizations: [
        {
            name: "Servitec Perú S.A.C.",
            logo: "/logo.jpg",
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
                    title: "Empresas / Sedes",
                    url: "/administration/organizations",
                    icon: IconBuilding,
                },
                {
                    title: "Usuarios / Alumnos",
                    url: "/administration/users",
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
                    title: "Dispositivos / IPs",
                    url: "/administration/devices",
                    icon: IconDeviceDesktop,
                },
                {
                    title: "Alertas y Tolerancias",
                    url: "/administration/alerts",
                    icon: IconBellRinging,
                },
                {
                    title: "Roles & Permisos",
                    url: "/administration/roles",
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
            ],
        },
        {
            title: "Control de Asistencia",
            icon: IconClockCheck,
            items: [
                {
                    title: "Mis Marcaciones",
                    url: "/attendance/my-logs",
                    icon: IconUserCheck,
                },
                {
                    title: "Registro General",
                    url: "/attendance/logs",
                    icon: IconList,
                },
                {
                    title: "Puntos y Geocercas",
                    url: "/attendance/locations",
                    icon: IconMapPin,
                },
            ],
        },
        {
            title: "Estructura y Grupos",
            icon: School,
            items: [
                {
                    title: "Aulas / Áreas",
                    url: "/groups/classrooms",
                    icon: IconList,
                },
                {
                    title: "Grupos de Trabajo",
                    url: "/groups/teams",
                    icon: IconPlus,
                },
            ],
        },
        {
            title: "Horarios y Turnos",
            icon: IconCalendarTime,
            items: [
                {
                    title: "Asignación de Horarios",
                    url: "/schedules/assignments",
                    icon: IconList,
                },
                {
                    title: "Configurar Turnos",
                    url: "/schedules/manage",
                    icon: IconPlus,
                },
            ],
        },
        {
            title: "Permisos y Licencias",
            icon: IconFileDescription,
            items: [
                {
                    title: "Solicitar Permiso",
                    url: "/requests/new",
                    icon: IconPlus,
                },
                {
                    title: "Mis Solicitudes",
                    url: "/requests/my-requests",
                    icon: IconList,
                },
                {
                    title: "Aprobaciones",
                    url: "/requests/approvals",
                    icon: IconClockCheck,
                },
            ],
        },
        {
            title: "Reportes e Incidencias",
            url: "/reports",
            icon: IconFileAnalytics,
        }
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
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <OrgSwitcher organizations={data.organizations} />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={data.navMain} />

                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}