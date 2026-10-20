"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  IconCamera,
  IconCheck,
  IconDeviceFloppy,
  IconLock,
  IconPhone,
  IconScan,
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
import { LivenessDetector } from "@/components/liveness-detector";
import { enrollUserFace } from "@/app/actions/biometric-actions";

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // Estados Generales
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "info" | "biometrics" | "activity"
  >("info");

  // Estados de Modales
  const [avatarUploadOpen, setAvatarUploadOpen] = useState(false);
  const [coverUploadOpen, setCoverUploadOpen] = useState(false);

  // Estados de Biometría Facial
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facialEnrolled, setFacialEnrolled] = useState(false);
  const [facialError, setFacialError] = useState<string | null>(null);
  const [isSavingFace, setIsSavingFace] = useState(false);

  useEffect(() => {
    if (user) {
      setPhoneNumber(user.phone?.replace("+51", "") || "");
      // Si el usuario ya tiene un face_id en BD, setFacialEnrolled(true)
      if (user.face_id) {
        setFacialEnrolled(true);
      }
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
      setTimeout(() => setAvatarUploadOpen(false), 1000);
    }
  };

  const handleCoverUpload = async (file: File) => {
    // Lógica para subir banner/cover
    setTimeout(() => setCoverUploadOpen(false), 1000);
  };

  const handleFacialSuccess = async (referenceImage: any) => {
    if (!user) return;
    setIsSavingFace(true);
    setFacialError(null);

    try {
      if (referenceImage?.Bytes) {
        const res = await enrollUserFace({
          userId: user.id,
          orgSlug: user.organization?.slug || "default",
          referenceImageBytes: referenceImage.Bytes,
        });

        if (res.success) {
          setFacialEnrolled(true);
          setIsCameraActive(false); // Apagamos la cámara al terminar
        } else {
          setFacialError(res.error || "No se pudo indexar el rostro.");
        }
      } else {
        setFacialEnrolled(true);
        setIsCameraActive(false);
      }
    } catch (err: any) {
      setFacialError(err.message || "Error al asociar la firma biométrica.");
    } finally {
      setIsSavingFace(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. HEADER Y PORTADA (Estilo Corporativo / Limpio) */}
      <div className="w-full rounded-2xl border border-border shadow-sm bg-card overflow-hidden">
        {/* Banner Sólido/Oscuro */}
        <div className="h-48 sm:h-56 w-full bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
          {/* Patrón sutil para no verse tan plano, opcional */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

          <button
            onClick={() => setCoverUploadOpen(true)}
            className="absolute top-4 right-4 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-1.5 rounded-md backdrop-blur-md transition-all flex items-center gap-1.5 shadow-sm"
          >
            <IconCamera className="size-3.5" /> Cambiar portada
          </button>
        </div>

        {/* Identidad del Usuario */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="relative group shrink-0">
              <div className="p-1.5 rounded-2xl bg-card border border-border shadow-sm">
                <Avatar className="size-28 sm:size-32 rounded-xl bg-muted text-3xl">
                  <AvatarImage
                    src={user?.avatarUrl || ""}
                    alt={user?.fullName}
                    className="object-cover rounded-xl"
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground font-bold rounded-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <button
                onClick={() => setAvatarUploadOpen(true)}
                className="absolute -bottom-2 -right-2 size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-4 border-card shadow-sm hover:scale-105 transition-transform"
                title="Cambiar foto de perfil"
              >
                <IconCamera className="size-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5 pb-1 mt-2 sm:mt-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  {user?.fullName || "Usuario"}
                </h1>
                <Badge
                  variant="secondary"
                  className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
                >
                  {user?.role === "admin" ? "Administrador" : "Empleado"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1 font-medium">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500">
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

          <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-border">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">
                Turno
              </span>
              <span className="text-sm font-bold text-foreground">Mañana</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">
                Puntualidad
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">
                98%
              </span>
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN INTERNA TIPO TABS */}
        <div className="px-6 sm:px-8 border-t border-border flex items-center gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab("info")}
            className={`py-4 border-b-2 transition-colors relative ${
              activeTab === "info"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Información General
          </button>
          <button
            onClick={() => setActiveTab("biometrics")}
            className={`py-4 border-b-2 transition-colors relative ${
              activeTab === "biometrics"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Biometría Facial
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`py-4 border-b-2 transition-colors relative ${
              activeTab === "activity"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Historial de Actividad
          </button>
        </div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
      {activeTab === "info" && (
        <form
          onSubmit={handleSaveText}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* Identidad Legal */}
          <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 flex flex-col gap-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <IconUser className="size-4 text-primary" />
                Identidad Legal
              </h2>
              <IconLock
                className="size-4 text-muted-foreground"
                title="Información protegida"
              />
            </div>

            <p className="text-xs text-muted-foreground font-medium">
              Datos verificados por el departamento de RRHH.
            </p>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground">
                Nombres
              </Label>
              <Input
                disabled
                value={user?.firstName || "Angel Emilio"}
                className="h-9 text-xs bg-muted/50 font-medium text-foreground cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground">
                Apellidos
              </Label>
              <Input
                disabled
                value={`${user?.paternalSurname || "Gala"} ${
                  user?.maternalSurname || "Flores"
                }`}
                className="h-9 text-xs bg-muted/50 font-medium text-foreground cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground">
                Documento (DNI)
              </Label>
              <Input
                disabled
                value="70809010"
                className="h-9 text-xs font-mono bg-muted/50 font-medium text-foreground cursor-not-allowed"
              />
            </div>
          </div>

          {/* Contacto y Configuración */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-5 shadow-sm">
              <div className="border-b border-border pb-3">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <IconPhone className="size-4 text-primary" />
                  Contacto y Autenticación OTP
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phoneNumber" className="text-xs font-bold">
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
                    <Label className="text-xs font-bold text-muted-foreground">
                      Correo Corporativo
                    </Label>
                    <IconLock className="size-3.5 text-muted-foreground" />
                  </div>
                  <Input
                    disabled
                    value={user?.email || ""}
                    className="h-9 text-xs font-mono bg-muted/50 text-foreground cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card shadow-sm">
              <span className="text-xs font-medium text-muted-foreground">
                Recuerda guardar los cambios realizados.
              </span>
              <div className="flex items-center gap-3">
                {isSuccess && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
                    <IconCheck className="size-4" /> Guardado
                  </span>
                )}
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSaving}
                  className="h-9 px-5 text-xs font-bold gap-2 rounded-lg"
                >
                  <IconDeviceFloppy className="size-4" />
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* PESTAÑA: BIOMETRÍA FACIAL (ENROLAMIENTO INICIAL) */}
      {activeTab === "biometrics" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 shadow-sm">
            <div className="border-b border-border pb-3">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <IconScan className="size-4 text-primary" />
                Enrolamiento Biométrico Facial
              </h2>
            </div>

            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
              Registra tu patrón facial mediante la prueba de vida de AWS
              Rekognition para poder marcar asistencia en las sedes
              corporativas.
            </p>

            <div className="p-4 rounded-xl border border-border bg-muted/30 flex flex-col gap-2">
              <span className="text-xs font-bold text-foreground">
                Recomendaciones:
              </span>
              <ul className="text-xs font-medium text-muted-foreground space-y-1 list-disc list-inside">
                <li>Usa un entorno bien iluminado.</li>
                <li>Mira fijamente a la cámara sin gafas oscuras.</li>
                <li>Mantén una expresión neutral.</li>
              </ul>
            </div>

            {facialEnrolled && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-500 text-xs font-bold flex items-center gap-2">
                <IconCheck className="size-4 shrink-0" />
                <span>Rostro de referencia registrado y activo.</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 shadow-sm">
            {facialEnrolled ? (
              <div className="flex flex-col items-center justify-center p-8 gap-3 text-center min-h-[300px]">
                <div className="size-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-500 flex items-center justify-center">
                  <IconCheck className="size-7" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-foreground">
                    Enrolamiento completado
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Tu firma biométrica está vinculada y lista para su uso.
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFacialEnrolled(false);
                    setIsCameraActive(true);
                  }}
                  className="mt-4 text-xs font-bold rounded-lg"
                >
                  Volver a registrar rostro
                </Button>
              </div>
            ) : !isCameraActive ? (
              <div className="flex flex-col items-center justify-center p-8 gap-4 text-center min-h-[300px] border-2 border-dashed border-border rounded-xl bg-muted/30">
                <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <IconCamera className="size-7" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-foreground">
                    Escáner Inactivo
                  </span>
                  <span className="text-xs font-medium text-muted-foreground mb-3">
                    Enciende la cámara para registrar tu patrón facial.
                  </span>
                </div>
                <Button
                  onClick={() => setIsCameraActive(true)}
                  className="text-xs font-bold rounded-lg"
                >
                  Encender cámara
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCameraActive(false)}
                    className="text-xs font-bold h-8 text-muted-foreground hover:text-foreground"
                  >
                    Apagar cámara
                  </Button>
                </div>
                <LivenessDetector
                  onSuccess={handleFacialSuccess}
                  onError={(msg) => {
                    setIsCameraActive(false);
                    setFacialError(msg);
                  }}
                />
                {facialError && (
                  <p className="text-xs font-bold text-destructive text-center">
                    {facialError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PESTAÑA: HISTORIAL */}
      {activeTab === "activity" && (
        <div className="rounded-2xl border border-border bg-card p-12 flex flex-col items-center justify-center text-center gap-2 shadow-sm">
          <p className="text-sm font-bold text-foreground">
            Sin registros recientes
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            Aquí podrás visualizar el historial de tus últimas marcaciones y
            asistencias.
          </p>
        </div>
      )}

      {/* MODALES DE UPLOAD */}
      <Dialog open={avatarUploadOpen} onOpenChange={setAvatarUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Actualizar foto de perfil
            </DialogTitle>
            <DialogDescription className="text-xs">
              Sube una imagen clara. Se recomienda formato 1:1 (cuadrado).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FileUploader
              onUpload={handleAvatarUpload}
              shape="circle"
              label="Haz clic o arrastra tu foto aquí"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={coverUploadOpen} onOpenChange={setCoverUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Actualizar foto de portada
            </DialogTitle>
            <DialogDescription className="text-xs">
              Sube una imagen panorámica para personalizar tu perfil.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FileUploader
              onUpload={handleCoverUpload}
              shape="rectangle"
              label="Haz clic o arrastra tu banner aquí"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
