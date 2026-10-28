"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/use-user-store";
import { OrganizationCardItem } from "@/app/organizations/organization-card-item";
import { IconCircleArrowLeft } from "@tabler/icons-react";

export default function OrganizationsPage() {
  const [isPending, startTransition] = useTransition();

  const user = useUserStore((state) => state.user);

  const organizations = user?.organizations;

  console.log("organizations: ", organizations);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/organizations">
            <IconCircleArrowLeft
              stroke={2}
              size={32}
              className="text-primary hover:text-primary/80 transition-colors"
            />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Mis Organizaciones
            </h1>
            <p className="text-sm text-muted-foreground">
              Selecciona una organización para gestionar o registrar
              asistencias.
            </p>
          </div>
        </div>

        <Button asChild className="gap-2">
          <Link href="/organizations/create">
            <Plus className="size-4" />
            Nueva Organización
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {isPending ? (
          <div className="p-8 text-center text-primary-foreground font-medium text-sm">
            Cargando organizaciones...
          </div>
        ) : organizations.length > 0 ? (
          organizations?.map((org) => (
            <OrganizationCardItem key={org.id} organization={org} />
          ))
        ) : (
          <div className="p-8 text-center bg-background rounded-2xl border-2 border-dashed border-border">
            <p className="text-sm text-muted-foreground">
              No perteneces a ninguna organización aún.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
