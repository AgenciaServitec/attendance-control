"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Building2, ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/store/use-user-store";

export interface Organization {
  id: string;
  ruc: string;
  business_name: string;
  address?: string;
  logo?: string;
}

// Interfaz adaptada a la estructura real que recibe tu componente ({ organization: Organization })
export interface OrganizationItem {
  organization: Organization;
}

export function OrgSwitcher({
  organizations,
}: {
  organizations: OrganizationItem[];
}) {
  const { isMobile } = useSidebar();

  const currentOrganization = useUserStore(
    (state) => state.currentOrganization,
  );
  const setCurrentOrganization = useUserStore(
    (state) => state.setCurrentOrganization,
  );

  // Inicializa la organización activa en Zustand si no hay ninguna seleccionada
  useEffect(() => {
    if (!currentOrganization && organizations && organizations.length > 0) {
      const firstOrg = organizations[0].organization;
      setCurrentOrganization({
        id: firstOrg.id,
        businessName: firstOrg.business_name,
        ruc: firstOrg.ruc,
      });
    }
  }, [organizations, currentOrganization, setCurrentOrganization]);

  // Si no hay organizaciones disponibles, no renderiza el componente
  if (!organizations || organizations.length === 0) return null;

  // Si currentOrganization aún no se ha cargado en Zustand, mostramos la primera por defecto para la UI
  const displayOrg = currentOrganization || {
    id: organizations[0].organization.id,
    businessName: organizations[0].organization.business_name,
    ruc: organizations[0].organization.ruc,
  };

  const handleSelectOrganization = (org: Organization) => {
    setCurrentOrganization({
      id: org.id,
      businessName: org.business_name,
      ruc: org.ruc,
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold capitalize">
                  {displayOrg.businessName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  RUC: {displayOrg.ruc}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizaciones
            </DropdownMenuLabel>

            {organizations.map((item, index) => {
              const org = item.organization;
              return (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleSelectOrganization(org)}
                  className="gap-2 p-2"
                  asChild
                >
                  <Link href={`/${org.id}/attendance/new`}>
                    <div className="flex size-6 items-center justify-center rounded-sm border bg-background">
                      <Building2 className="size-3.5 shrink-0" />
                    </div>
                    <span className="font-medium capitalize">
                      {org.business_name}
                    </span>
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 p-2" asChild>
              <Link href="/organizations/new">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Ir a la sala Principal
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
