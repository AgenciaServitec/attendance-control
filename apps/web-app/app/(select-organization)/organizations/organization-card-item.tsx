"use client";

import Link from "next/link";
import { ArrowRight, Settings } from "lucide-react";
import {
  IconBriefcase,
  IconBuildingBridge2,
  IconLocation,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface OrganizationData {
  id: string;
  business_name: string;
  ruc?: string;
  address?: string;
  role?: string;
}

interface OrganizationCardItemProps {
  organization: OrganizationData;
}

export function OrganizationCardItem({
  organization,
}: OrganizationCardItemProps) {
  const isAdmin = organization.role === "admin";
  const org = organization.organization;
  console.log("org: ", org);

  return (
    <div className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border-2 border-dashed border-border bg-background hover:border-primary transition-all duration-200">
      <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
        <div className="size-11 rounded-xl bg-neutral-900 text-white dark:bg-foreground dark:text-background border-2 border-border flex items-center justify-center font-bold shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
          <IconBuildingBridge2 stroke={2} className="size-5 shrink-0" />
        </div>

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
              {org.business_name?.toUpperCase() || "ORGANIZACIÓN"}
            </h3>
            <Badge
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-sm border-none ${
                isAdmin
                  ? "bg-primary text-primary-foreground"
                  : "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900"
              }`}
            >
              {isAdmin ? "Administrador" : "Empleado"}
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 shrink-0">
              <IconBriefcase
                stroke={2}
                className="size-3.5 text-muted-foreground shrink-0"
              />
              <span>RUC: {org.ruc || "Sin RUC registrado"}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <IconLocation
                stroke={2}
                className="size-3.5 text-muted-foreground shrink-0"
              />
              <span className="truncate">
                Dirección: {org.address || "Sin dirección"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-border/80 shrink-0 justify-end">
        <Button
          variant="outline"
          asChild
          className="gap-1.5 text-xs font-semibold"
        >
          <Link href={`/organizations/${org.id}`}>
            <Settings className="size-3.5" />
            Administrar
          </Link>
        </Button>

        <Button asChild className="gap-1.5 text-xs font-semibold">
          <Link href={`/${org.id}/attendance/new`}>
            Ingresar
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
