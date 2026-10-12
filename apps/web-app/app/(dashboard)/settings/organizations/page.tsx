"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconBuilding,
  IconCheck,
  IconClock,
  IconCopy,
  IconDeviceFloppy,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";
import { useUserStore } from "@/store/use-user-store";

export default function OrganizationSettingsPage() {
  const user = useUserStore((state) => state.user);

  // Estados del Formulario de Empresa
  const [businessName, setBusinessName] = useState("");
  const [ruc, setRuc] = useState("");
  const [address, setAddress] = useState("");

  // Parámetros de Asistencia y Tolerancia
  const [toleranceMinutes, setToleranceMinutes] = useState("10");
  const [geofencingRadius, setGeofencingRadius] = useState("100");
  const [invitationCode, setInvitationCode] = useState("SRV-8942-X");

  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.organization) {
      setBusinessName(user.organization?.business_name || "");
      setRuc(user.organization.ruc || "");
    }
  }, [user]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(invitationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSuccess(false);

    try {
      // AQUÍ IRÁ LA SERVER ACTION PARA ACTUALIZAR ORGANIZACIÓN EN SUPABASE
      // await updateOrganization({ businessName, ruc, address, toleranceMinutes, geofencingRadius });

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error(
        "Error al actualizar configuración de organización:",
        error,
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Configuración de la Organización
        </h1>
        <p className="text-xs text-muted-foreground">
          Gestiona la información legal, reglas de tolerancia y parámetros
          globales para las marcaciones.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* 1. Datos Generales de la Empresa */}
        <Card className="shadow-none border-border/80">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <IconBuilding className="size-4 text-primary" />
              Información de la Entidad
            </CardTitle>
            <CardDescription className="text-xs">
              Razón social y datos tributarios utilizados en los reportes e
              incidencias.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="businessName" className="text-xs font-medium">
                Razón Social / Nombre de la Institución
              </Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ej. Servitec Perú S.A.C."
                className="text-xs h-9 bg-background"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ruc" className="text-xs font-medium">
                RUC / Identificación Fiscal
              </Label>
              <Input
                id="ruc"
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                placeholder="20601234567"
                className="text-xs h-9 font-mono bg-background"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs font-medium">
                Dirección Fiscal Principal
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Av. Javier Prado Este 456, San Isidro"
                className="text-xs h-9 bg-background"
              />
            </div>
          </CardContent>
        </Card>

        {/* 2. Reglas de Asistencia & Tolerancia */}
        <Card className="shadow-none border-border/80">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <IconClock className="size-4 text-primary" />
              Reglas de Marcación y Tolerancia
            </CardTitle>
            <CardDescription className="text-xs">
              Configura los límites para considerar tardanza o restringir
              ubicación.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Tolerancia de Tardanza (Minutos)
              </Label>
              <Select
                value={toleranceMinutes}
                onValueChange={setToleranceMinutes}
              >
                <SelectTrigger className="text-xs h-9 bg-background">
                  <SelectValue placeholder="Selecciona la tolerancia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0" className="text-xs">
                    Sin tolerancia (Puntualidad exacta)
                  </SelectItem>
                  <SelectItem value="5" className="text-xs">
                    5 Minutos
                  </SelectItem>
                  <SelectItem value="10" className="text-xs">
                    10 Minutos (Recomendado)
                  </SelectItem>
                  <SelectItem value="15" className="text-xs">
                    15 Minutos
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1">
                <IconMapPin className="size-3.5 text-muted-foreground" />
                Radio Geofencing GPS (Metros)
              </Label>
              <Select
                value={geofencingRadius}
                onValueChange={setGeofencingRadius}
              >
                <SelectTrigger className="text-xs h-9 bg-background">
                  <SelectValue placeholder="Selecciona la distancia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50" className="text-xs">
                    50 metros (Estricto)
                  </SelectItem>
                  <SelectItem value="100" className="text-xs">
                    100 metros (Estándar)
                  </SelectItem>
                  <SelectItem value="250" className="text-xs">
                    250 metros
                  </SelectItem>
                  <SelectItem value="off" className="text-xs">
                    Desactivado (Marcación remota libre)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 3. Código de Invitación para Personal */}
        <Card className="shadow-none border-border/80">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <IconUsers className="size-4 text-primary" />
              Acceso e Invitaciones
            </CardTitle>
            <CardDescription className="text-xs">
              Comparte este código con los miembros para que se vinculen a esta
              organización durante su registro.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-muted/60 border border-border rounded-lg font-mono text-sm font-bold tracking-wider text-foreground">
                {invitationCode}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="h-9 text-xs gap-1.5"
              >
                {copied ? (
                  <>
                    <IconCheck className="size-3.5 text-emerald-600" />
                    Copiado
                  </>
                ) : (
                  <>
                    <IconCopy className="size-3.5" />
                    Copiar
                  </>
                )}
              </Button>
            </div>

            <Badge
              variant="outline"
              className="text-[11px] border-amber-500/30 text-amber-600 bg-amber-500/5 px-2.5 py-1"
            >
              Código Activo
            </Badge>
          </CardContent>
        </Card>

        {/* Botón de Guardar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isSuccess && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <IconCheck className="size-4" />
              Ajustes de organización guardados
            </span>
          )}
          <Button
            type="submit"
            size="sm"
            className="h-9 px-5 text-xs gap-2 font-medium"
            disabled={isSaving}
          >
            <IconDeviceFloppy className="size-4" />
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
