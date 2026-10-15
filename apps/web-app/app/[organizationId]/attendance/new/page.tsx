"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Camera,
  Check,
  Clock,
  LogIn,
  LogOut,
  MapPin,
  QrCode,
  ScanFace,
} from "lucide-react";

type Method = "gps" | "facial" | "qr";

const METHODS: { id: Method; label: string; icon: typeof MapPin }[] = [
  { id: "gps", label: "GPS", icon: MapPin },
  { id: "facial", label: "Rostro", icon: ScanFace },
  { id: "qr", label: "Código QR", icon: QrCode },
];

function ScanFrame() {
  const base = "absolute size-6 border-white/80";
  return (
    <>
      <span
        className={`${base} left-4 top-4 border-l-4 border-t-4 rounded-tl-sm`}
      />
      <span
        className={`${base} right-4 top-4 border-r-4 border-t-4 rounded-tr-sm`}
      />
      <span
        className={`${base} bottom-4 left-4 border-b-4 border-l-4 rounded-bl-sm`}
      />
      <span
        className={`${base} bottom-4 right-4 border-b-4 border-r-4 rounded-br-sm`}
      />
    </>
  );
}

export default function AttendanceNewPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [method, setMethod] = useState<Method>("gps");
  const [isInsideGeofence] = useState(true);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<"Entrada" | "Salida" | null>(null);
  const [marks, setMarks] = useState<{
    entrada: string | null;
    salida: string | null;
  }>({
    entrada: "08:02 a. m.",
    salida: null,
  });

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const nextType: "Entrada" | "Salida" =
    marks.entrada && !marks.salida ? "Salida" : "Entrada";

  const timeLabel = now
    ? now.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "--:-- --";
  const [hourMinute, ...periodParts] = timeLabel.split(/\s+/);
  const period = periodParts.join(" ");
  const seconds = now ? String(now.getSeconds()).padStart(2, "0") : "--";
  const dateLabel = now
    ? now.toLocaleDateString("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  const blocked = method === "gps" && !isInsideGeofence;

  const handleClockIn = () => {
    const type = nextType;
    setLoading(true);
    setTimeout(() => {
      const stamp = new Date().toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setMarks((prev) =>
        type === "Entrada"
          ? { entrada: stamp, salida: null }
          : { ...prev, salida: stamp },
      );
      setLoading(false);
      setDone(type);
      setTimeout(() => setDone(null), 3500);
    }, 1200);
  };

  const ActionIcon = nextType === "Entrada" ? LogIn : LogOut;

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6">
      {/* 1. INFORMACIÓN DE LA SEDE Y ESTADO (Flexible y responsive) */}
      <Card className="rounded-2xl border-2 border-border shadow-none p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card">
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="size-10 rounded-xl bg-neutral-900 text-white dark:bg-foreground dark:text-background border-2 border-border flex items-center justify-center font-bold shrink-0">
            <Building2 className="size-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-foreground truncate">
              Sede Central, Aula 204
            </h1>
            <p className="text-xs text-muted-foreground font-medium truncate">
              Ubicación con control biométrico habilitado
            </p>
          </div>
        </div>

        <Badge
          className={`text-xs font-bold px-3 py-1 rounded-md border-none shrink-0 ${
            isInsideGeofence
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {isInsideGeofence ? "En la sede" : "Fuera de la sede"}
        </Badge>
      </Card>

      {/* 2. MÓDULO PRINCIPAL DE MARCAJE */}
      <Card className="rounded-2xl sm:rounded-3xl border-2 border-border shadow-none overflow-hidden bg-card p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
          {/* PANEL IZQUIERDO: Reloj e Historial de Marcación */}
          <div className="lg:col-span-5 bg-neutral-900 dark:bg-card text-white p-5 sm:p-7 lg:p-8 flex flex-col justify-between gap-6 sm:gap-8 border-b-2 lg:border-b-0 lg:border-r-2 border-border">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-neutral-400">
                Hora oficial del servidor
              </span>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none tabular-nums">
                  {hourMinute}
                </span>
                <div className="flex items-center gap-1 text-sm font-bold tabular-nums text-neutral-400">
                  <span>{seconds}</span>
                  <span>{period}</span>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-bold capitalize text-primary mt-1">
                {dateLabel}
              </span>
            </div>

            {/* Fichas de Registro de Entrada y Salida */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-neutral-400">
                Registros de hoy
              </span>

              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="p-3 rounded-xl border-2 border-neutral-800 dark:border-border bg-neutral-950/50 flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-neutral-400 flex items-center gap-1.5 truncate">
                    <LogIn className="size-3.5 text-emerald-500 shrink-0" />{" "}
                    Entrada
                  </span>
                  <span className="text-sm font-bold tabular-nums text-white truncate">
                    {marks.entrada ?? "--:--"}
                  </span>
                </div>

                <div className="p-3 rounded-xl border-2 border-neutral-800 dark:border-border bg-neutral-950/50 flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-neutral-400 flex items-center gap-1.5 truncate">
                    <LogOut className="size-3.5 text-red-500 shrink-0" /> Salida
                  </span>
                  <span className="text-sm font-bold tabular-nums text-white truncate">
                    {marks.salida ?? "--:--"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL DERECHO: Verificación y Acción */}
          <div className="lg:col-span-7 p-5 sm:p-7 lg:p-8 flex flex-col justify-between gap-6 sm:gap-8 bg-card">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-xs font-bold text-muted-foreground">
                  Método de verificación
                </h2>
                <p className="text-xs sm:text-sm text-foreground font-semibold">
                  Selecciona la vía para validar tu presencia
                </p>
              </div>

              {/* Selector Adaptable en Móviles */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1.5 bg-muted rounded-xl border-2 border-border w-full">
                {METHODS.map(({ id, label, icon: Icon }) => {
                  const active = method === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setMethod(id)}
                      className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg py-2.5 px-2 sm:px-3 text-xs font-bold transition-all min-w-0 ${
                        active
                          ? "bg-primary text-primary-foreground border-2 border-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-card"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visualizador de Escáner / GPS */}
            <div className="flex-1 flex flex-col justify-center min-h-[150px] sm:min-h-[170px]">
              {method === "gps" && (
                <div
                  className={`flex flex-col justify-center gap-2 rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 text-white transition-all ${
                    isInsideGeofence
                      ? "bg-emerald-600 border-emerald-700"
                      : "bg-red-600 border-red-700"
                  }`}
                >
                  <MapPin className="size-6 sm:size-7 opacity-90 shrink-0" />
                  <p className="text-xs sm:text-sm font-bold leading-relaxed">
                    {isInsideGeofence
                      ? "Estás dentro de la sede permitida. Confirmación por GPS lista."
                      : "Estás fuera del radio de la sede. Acércate para registrar tu asistencia."}
                  </p>
                </div>
              )}

              {method === "facial" && (
                <div className="relative flex h-40 sm:h-48 items-center justify-center rounded-xl sm:rounded-2xl bg-neutral-900 border-2 border-border text-white overflow-hidden p-4">
                  <ScanFrame />
                  <Camera className="size-8 text-neutral-500 shrink-0" />
                  <span className="absolute bottom-3 rounded-md bg-neutral-800 px-3 py-1 text-xs font-bold text-neutral-300 border border-neutral-700 text-center max-w-[90%] truncate">
                    Mira de frente a la cámara
                  </span>
                </div>
              )}

              {method === "qr" && (
                <div className="relative flex h-40 sm:h-48 items-center justify-center rounded-xl sm:rounded-2xl bg-neutral-900 border-2 border-border text-white overflow-hidden p-4">
                  <ScanFrame />
                  <QrCode className="size-10 text-neutral-500 shrink-0" />
                  <div className="absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 bg-primary animate-pulse" />
                  <span className="absolute bottom-3 rounded-md bg-neutral-800 px-3 py-1 text-xs font-bold text-neutral-300 border border-neutral-700 text-center max-w-[90%] truncate">
                    Apunta tu credencial al lector
                  </span>
                </div>
              )}
            </div>

            {/* BOTÓN DE ACCIÓN PRINCIPAL */}
            <Button
              size="lg"
              onClick={handleClockIn}
              disabled={loading || blocked || done !== null}
              className={`h-12 w-full gap-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all active:scale-[0.98] ${
                done
                  ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                  : blocked
                    ? "bg-muted text-muted-foreground border-border cursor-not-allowed"
                    : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
              }`}
            >
              {done ? (
                <>
                  <Check className="size-4 shrink-0" />
                  <span>{done} registrada con éxito</span>
                </>
              ) : loading ? (
                <>
                  <Clock className="size-4 animate-spin shrink-0" />
                  <span>Procesando marcaje...</span>
                </>
              ) : (
                <>
                  <ActionIcon className="size-4 shrink-0" />
                  <span>Registrar {nextType.toLowerCase()}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
