"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconCamera,
  IconCheck,
  IconDeviceFloppy,
  IconLock,
  IconShieldCheck,
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
    <div className="w-full h-full flex flex-col gap-6 py-4 lg:py-6 px-4 sm:px-6 lg:px-8">
      {/* 1. HEADER Y PORTADA (Ocupa todo el ancho) */}
      <div className="w-full rounded-2xl border-2 border-border bg-card overflow-hidden">
        {/* Banner Fotográfico */}
        <div className="h-44 sm:h-52 w-full bg-neutral-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
          <button className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider bg-black/60 hover:bg-black/80 text-white border-2 border-white/20 px-4 py-2 rounded-xl backdrop-blur-md transition-all flex items-center gap-2">
            <IconCamera className="size-4" /> Portada
          </button>
        </div>

        {/* Sección de Identidad Superpuesta */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end gap-6 -mt-16">
          <div className="relative group shrink-0">
            <Avatar className="size-32 sm:size-36 border-4 border-card bg-card text-3xl rounded-3xl shadow-sm">
              <AvatarImage src={user?.avatarUrl || ""} alt={user?.fullName} />
              <AvatarFallback className="bg-neutral-900 text-white font-black rounded-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => setShowAvatarUpload(!showAvatarUpload)}
              className="absolute bottom-1 right-1 size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center border-2 border-card hover:scale-105 transition-transform"
            >
              <IconCamera className="size-4.5" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5 pb-2 w-full">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                {user?.fullName || "Usuario"}
              </h1>
              <span className="px-2.5 py-1 rounded-md border-2 border-border bg-muted text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                {user?.role === "admin" ? "Administrador" : "Empleado"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <IconShieldCheck className="size-4" /> Cuenta Verificada
              </span>
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <BuildingIcon className="size-4" />{" "}
                {user?.organization?.business_name || "Servitec S.A.C."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showAvatarUpload && (
        <div className="p-6 rounded-2xl border-2 border-border bg-card w-full">
          <FileUploader
            onUpload={handleAvatarUpload}
            shape="circle"
            label="Sube tu nueva foto de perfil"
          />
        </div>
      )}

      {/* 2. CUERPO PRINCIPAL (2 Columnas adaptables) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* COLUMNA IZQUIERDA: Identidad Legal (Solo Lectura) */}
        <div className="xl:col-span-4 rounded-2xl border-2 border-border bg-card flex flex-col">
          <div className="p-5 border-b-2 border-border flex items-center justify-between bg-muted/20">
            <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
              Información Personal
            </h2>
            <IconLock className="size-4 text-muted-foreground" />
          </div>

          <div className="p-6 flex flex-col gap-5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Datos oficiales verificados. Contacta a recursos humanos para
              modificaciones.
            </p>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Nombres
              </Label>
              <Input
                disabled
                value="Angel Emilio"
                className="h-11 bg-muted/40 border-2 font-bold text-muted-foreground cursor-not-allowed opacity-80"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Apellidos
              </Label>
              <Input
                disabled
                value="Gala Flores"
                className="h-11 bg-muted/40 border-2 font-bold text-muted-foreground cursor-not-allowed opacity-80"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Documento de Identidad (DNI)
              </Label>
              <Input
                disabled
                value="70809010"
                className="h-11 bg-muted/40 border-2 font-mono font-black text-muted-foreground cursor-not-allowed opacity-80"
              />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Contacto y Guardado (Editable) */}
        <form
          onSubmit={handleSaveText}
          className="xl:col-span-8 flex flex-col gap-6"
        >
          <div className="rounded-2xl border-2 border-border bg-card flex flex-col">
            <div className="p-5 border-b-2 border-border bg-muted/20">
              <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                Contacto y Acceso al Sistema
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-[10px] font-black uppercase tracking-wider text-foreground"
                >
                  Teléfono Celular (OTP)
                </Label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center px-4 border-2 border-border bg-muted rounded-xl text-xs font-mono font-bold text-foreground">
                    +51
                  </div>
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12 border-2 font-mono font-black flex-1 text-sm bg-background focus-visible:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    Correo Corporativo
                  </Label>
                  <IconLock className="size-3.5 text-muted-foreground" />
                </div>
                <Input
                  disabled
                  value={user?.email || ""}
                  className="h-12 bg-muted/40 border-2 font-mono font-bold text-muted-foreground cursor-not-allowed opacity-80"
                />
              </div>
            </div>
          </div>

          {/* Panel de Acción Flotante Inferior */}
          <div className="rounded-2xl border-2 border-border bg-card p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-semibold text-muted-foreground text-center sm:text-left">
              Asegúrate de guardar los cambios antes de salir.
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              {isSuccess && (
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <IconCheck className="size-4" /> Actualizado
                </span>
              )}
              <Button
                type="submit"
                size="lg"
                disabled={isSaving}
                className="w-full sm:w-auto h-12 px-8 rounded-xl border-2 border-primary bg-primary text-primary-foreground font-black uppercase tracking-wider text-xs hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                <IconDeviceFloppy className="size-4 mr-2" />
                {isSaving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
