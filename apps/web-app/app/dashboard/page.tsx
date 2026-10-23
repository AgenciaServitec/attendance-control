import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/get-user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Briefcase, Building2, Plus } from "lucide-react";
import { IconLocation } from "@tabler/icons-react";
import Link from "next/link";

export default async function DashboardHubPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Normalización segura de la lista de organizaciones
  const rawOrgs = user?.organizations || [];
  const organizations = rawOrgs;

  // Redirección automática si solo pertenece a una empresa
  if (organizations.length === 1) {
    const defaultSlug =
      (organizations[0] as any).slug || (organizations[0] as any).id;
    redirect(`/${defaultSlug}/clock-in`);
  }

  return (
    <div className="w-full bg-background flex flex-col items-center justify-center">
      <div className="w-full flex flex-col gap-6">
        {/* Cabecera del Portal Directa y Limpia */}
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Selecciona tu Organización
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-normal">
            Bienvenido,{" "}
            <span className="font-semibold text-foreground">
              {user.fullName}
            </span>
            . Elige la empresa para acceder a tu panel de gestión.
          </p>
        </div>

        {/* CONTENEDOR ENVOLVENTE SÓLIDO (Sin celeste ni opacidades) */}
        <div className="w-full rounded-[24px] border-2 border-border bg-primary p-3 sm:p-4">
          {/* Grilla de 2 Columnas con Tarjetas Internas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {organizations.map((org: any) => {
              const organization = org.organization;
              const isAdmin = organization.role === "admin";
              const businessName =
                organization.business_name.toUpperCase() || "Organización";

              return (
                <Card
                  key={organization.id}
                  className="h-full rounded-2xl border-2 border-dashed border-border bg-background shadow-none hover:border-primary transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.99]"
                >
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="size-10 rounded-xl bg-neutral-900 text-white dark:bg-foreground dark:text-background border-2 border-border flex items-center justify-center font-bold shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                        <Building2 className="size-5 shrink-0" />
                      </div>

                      <Badge
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md border-none ${
                          isAdmin
                            ? "bg-primary text-primary-foreground"
                            : "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900"
                        }`}
                      >
                        {isAdmin ? "Administrador" : "Empleado"}
                      </Badge>
                    </div>

                    <div className="mt-4 flex flex-col gap-0.5">
                      <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {businessName}
                      </CardTitle>
                      <CardDescription className="text-xs font-normal text-muted-foreground flex flex-col gap-1.5">
                        <div className="flex gap-1 5">
                          <Briefcase className="size-3 text-muted-foreground shrink-0" />
                          RUC: {organization.ruc || "Sin RUC registrado"}
                        </div>
                        <div className="flex gap-1 5">
                          <IconLocation className="size-3 text-muted-foreground shrink-0" />
                          Dirección: {organization.address || "Sin dirección"}
                        </div>
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="px-5 pb-4 pt-2 flex items-center justify-between border-t border-border/80 text-xs font-semibold">
                    <span className="text-[11px] text-muted-foreground font-medium">
                      Acceso habilitado
                    </span>

                    <Link href={`organizations/${organization.id}`}>
                      Administrar
                    </Link>
                    <Link href={`/${organization.id}/attendance/new`}>
                      Ingresar
                    </Link>
                  </CardContent>
                </Card>
              );
            })}

            <Card className="h-full min-h-[170px] rounded-2xl border-2 border-dashed border-border bg-background shadow-none flex flex-col items-center justify-center p-6 text-center hover:border-primary transition-all duration-200 group">
              <div className="size-10 rounded-xl bg-muted border-2 border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors mb-2.5">
                <Plus className="size-5" />
              </div>

              <h2 className="text-xs font-bold text-foreground">
                Nuevo Espacio
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5 mb-3 font-normal max-w-[180px]">
                Ingresa un código de invitación o registra tu empresa.
              </p>

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3.5 text-xs font-bold rounded-lg border-2 border-border group-hover:border-primary group-hover:text-primary transition-colors"
              >
                Agregar Organización
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
