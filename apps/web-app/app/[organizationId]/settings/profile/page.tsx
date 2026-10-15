"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  IconCamera,
  IconCheck,
  IconDeviceFloppy,
  IconLock,
  IconPhone,
  IconShieldCheck,
  IconUser,
} from "@tabler/icons-react";
import { BuildingIcon } from "lucide-react";
import { useUserStore } from "@/store/use-user-store";
import { FileUploader } from "@/components/ui/file-uploader";
import {
  updateContactInfo,
  uploadProfileImage,
} from "@/app/actions/profile-actions";

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // Estados
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "activity">("info");

  useEffect(() => {
    if (user) {
      setPhoneNumber(user.phone?.replace("+51", "") || "");
    }
  }, [user]);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  const handleSaveText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    const formData = new FormData();
    formData.append("phone", phoneNumber);
    formData.append("userId", user.id);

    const result = await updateContactInfo(formData);

    if (result.success) {
      setUser({ ...user, phone: `+51${phoneNumber}` });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }
    setIsSaving(false);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id);
    formData.append("bucket", "avatars");

    const result = await uploadProfileImage(formData);

    if (result.success && result.url) {
      setUser({ ...user, avatar_url: result.url });
      setTimeout(() => setShowAvatarUpload(false), 1500);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. HEADER Y PORTADA ESTILO PORTFOLIA (Efecto Marco Curvo Integrado) */}
      <div className="w-full rounded-[28px] border border-border/80 bg-card overflow-hidden">
        {/* Banner de Gradiente Suave con Difuminado */}
        <div className="h-48 sm:h-60 w-full bg-gradient-to-r from-blue-600/25 via-indigo-500/20 to-purple-600/25 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_70%)]" />

          <button className="absolute top-4 right-4 text-xs font-semibold bg-background/70 hover:bg-background text-foreground border border-border/60 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all flex items-center gap-1.5 shadow-xs">
            <IconCamera className="size-3.5" /> Cambiar portada
          </button>
        </div>

        {/* Sección de Identidad de Usuario con la Envoltura Curva estilo Portfolia */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-20 sm:-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* CONTENEDOR CURVO CON BORDE TRANSLÚCIDO E INTEGRADO (Inspirado en la Guía) */}
            <div className="relative group shrink-0">
              <div className="p-2.5 rounded-[36px] bg-card/80 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-sm">
                <Avatar className="size-32 sm:size-40 rounded-[28px] bg-neutral-900 text-3xl">
                  <AvatarImage
                    src={user?.avatarUrl || ""}
                    alt={user?.fullName}
                    className="object-cover rounded-[28px]"
                  />
                  <AvatarFallback className="bg-neutral-900 text-white font-bold rounded-[28px]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Botón Flotante para Cambiar Foto */}
              <button
                onClick={() => setShowAvatarUpload(!showAvatarUpload)}
                className="absolute bottom-2 right-2 size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-card shadow-sm hover:scale-105 transition-transform"
                title="Cambiar foto de perfil"
              >
                <IconCamera className="size-4" />
              </button>
            </div>

            {/* Nombre e Información Principal */}
            <div className="flex flex-col gap-1.5 pb-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {user?.fullName || "Usuario"}
                </h1>
                <Badge
                  variant="secondary"
                  className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {user?.role === "admin" ? "Administrador" : "Empleado"}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground font-normal">
                {user?.email || "Sin correo corporativo"}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <IconShieldCheck className="size-4" /> Cuenta verificada
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <BuildingIcon className="size-3.5" />
                  {user?.organization?.business_name || "Servitec Perú S.A.C."}
                </span>
              </div>
            </div>
          </div>

          {/* Estado Rápido / Estadísticas Integradas */}
          <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-border/80">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">
                Turno
              </span>
              <span className="text-sm font-bold text-foreground">Mañana</span>
            </div>
            <div className="h-8 w-px bg-border/80" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">
                Puntualidad
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                98%
              </span>
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN INTERNA TIPO TABS (Estilo Referencia Portfolia) */}
        <div className="px-6 sm:px-8 border-t border-border/80 flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("info")}
            className={`py-3.5 border-b-2 transition-colors relative ${
              activeTab === "info"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Información General
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`py-3.5 border-b-2 transition-colors relative ${
              activeTab === "activity"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Historial de Actividad
          </button>
        </div>
      </div>

      {/* Dropzone de Avatar */}
      {showAvatarUpload && (
        <div className="p-6 rounded-2xl border border-border/80 bg-card">
          <FileUploader
            onUpload={handleAvatarUpload}
            shape="circle"
            label="Sube tu nueva foto de perfil"
          />
        </div>
      )}

      {/* 2. CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
      {activeTab === "info" && (
        <form
          onSubmit={handleSaveText}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* COLUMNA IZQUIERDA: Identidad Legal (Solo Lectura) */}
          <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-card p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <IconUser className="size-4 text-primary" />
                Identidad Legal
              </h2>
              <IconLock
                className="size-4 text-muted-foreground"
                title="Información protegida"
              />
            </div>

            <p className="text-xs text-muted-foreground font-normal">
              Datos verificados por el departamento de RRHH.
            </p>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Nombres
              </Label>
              <Input
                disabled
                value={user?.firstName || "Angel Emilio"}
                className="h-9 text-xs bg-muted/40 font-medium text-muted-foreground cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Apellidos
              </Label>
              <Input
                disabled
                value={`${user?.paternalSurname || "Gala"} ${user?.maternalSurname || "Flores"}`}
                className="h-9 text-xs bg-muted/40 font-medium text-muted-foreground cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Documento (DNI)
              </Label>
              <Input
                disabled
                value="70809010"
                className="h-9 text-xs font-mono bg-muted/40 font-medium text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          {/* COLUMNA DERECHA: Contacto y Configuración (Editable) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="rounded-2xl border border-border/80 bg-card p-6 flex flex-col gap-5">
              <div className="border-b border-border/80 pb-3">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <IconPhone className="size-4 text-primary" />
                  Contacto y Autenticación OTP
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phoneNumber" className="text-xs font-medium">
                    Teléfono Celular (SMS OTP)
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center px-3 border border-input bg-muted rounded-md text-xs font-mono font-medium text-muted-foreground">
                      +51
                    </div>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-9 text-xs font-mono flex-1 bg-background"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Correo Corporativo
                    </Label>
                    <IconLock className="size-3.5 text-muted-foreground" />
                  </div>
                  <Input
                    disabled
                    value={user?.email || ""}
                    className="h-9 text-xs font-mono bg-muted/40 text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Acción de Guardar Cambios */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-border/80 bg-card">
              <span className="text-xs text-muted-foreground">
                Recuerda guardar los cambios realizados.
              </span>
              <div className="flex items-center gap-3">
                {isSuccess && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <IconCheck className="size-4" /> Guardado
                  </span>
                )}
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSaving}
                  className="h-9 px-5 text-xs font-semibold gap-2"
                >
                  <IconDeviceFloppy className="size-4" />
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* PESTAÑA SECUNDARIA */}
      {activeTab === "activity" && (
        <div className="rounded-2xl border border-border/80 bg-card p-8 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-sm font-semibold text-foreground">
            Sin registros recientes
          </p>
          <p className="text-xs text-muted-foreground">
            Aquí podrás visualizar el historial de tus últimas marcaciones y
            asistencias.
          </p>
        </div>
      )}
    </div>
  );
}
