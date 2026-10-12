"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  IconBuilding,
  IconCamera,
  IconCheck,
  IconClock,
  IconLogin,
  IconLogout,
  IconMapPin,
  IconQrcode,
  IconScan,
} from "@tabler/icons-react";

type Method = "gps" | "facial" | "qr";

const METHODS: { id: Method; label: string; icon: typeof IconMapPin }[] = [
  { id: "gps", label: "GPS", icon: IconMapPin },
  { id: "facial", label: "Rostro", icon: IconScan },
  { id: "qr", label: "Código QR", icon: IconQrcode },
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

  const ActionIcon = nextType === "Entrada" ? IconLogin : IconLogout;

  return (
    // Eliminado el borde, sombra y esquinas redondeadas del contenedor principal.
    // Ahora es una sección fluida que se integra en la página.
    <div className="w-full flex flex-col bg-background">
      {/* Header limpio, sin fondo negro pesado, solo un separador sutil */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 px-6 py-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <IconBuilding className="size-4 text-muted-foreground" />
          <span>Sede Central, Aula 204</span>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isInsideGeofence
              ? "bg-emerald-100 text-emerald-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isInsideGeofence ? "En la sede" : "Fuera de la sede"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
        {/* Panel Izquierdo: Color sólido, sin bordes internos gruesos */}
        <section className="flex flex-col justify-between gap-12 bg-blue-600 p-8 text-white sm:p-10 lg:col-span-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-3">
              <span className="text-7xl font-bold leading-none tracking-tight tabular-nums sm:text-8xl">
                {hourMinute}
              </span>
              <span className="flex flex-col pb-1 text-lg font-medium leading-tight tabular-nums text-blue-200">
                <span>{seconds}</span>
                <span>{period}</span>
              </span>
            </div>
            <span className="text-sm font-medium capitalize text-blue-100 mt-1">
              {dateLabel}
            </span>
          </div>

          <dl className="flex flex-col text-sm">
            {/* Separadores sutiles en lugar de bordes gruesos */}
            <div className="flex items-center justify-between border-b border-blue-500/40 pb-4 mb-4">
              <dt className="flex items-center gap-2 font-medium text-blue-100">
                <IconLogin className="size-4" />
                Entrada
              </dt>
              <dd className="font-semibold tabular-nums text-lg">
                {marks.entrada ?? "--:--"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 font-medium text-blue-100">
                <IconLogout className="size-4" />
                Salida
              </dt>
              <dd className="font-semibold tabular-nums text-lg">
                {marks.salida ?? "--:--"}
              </dd>
            </div>
          </dl>
        </section>

        {/* Panel Derecho: Fondo limpio, espaciado natural */}
        <section className="flex flex-col gap-8 bg-background p-6 sm:p-10 lg:col-span-7">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Método de verificación
            </h2>

            {/* Selector estilo "Segmented Control" (sin bordes negros, solo fondos) */}
            <div
              role="radiogroup"
              aria-label="Método de verificación"
              className="flex p-1 bg-muted/60 rounded-xl"
            >
              {METHODS.map(({ id, label, icon: Icon }) => {
                const active = method === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setMethod(id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      active
                        ? "bg-background text-blue-700 shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Área de Estado / Escáner: Bloques sólidos, esquinas suaves */}
          <div className="flex-1 flex flex-col justify-center">
            {method === "gps" && (
              <div
                className={`flex flex-col justify-center gap-3 rounded-xl p-8 text-white shadow-sm transition-colors duration-300 ${
                  isInsideGeofence ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                <IconMapPin className="size-8 opacity-80" />
                <p className="text-lg font-semibold leading-snug">
                  {isInsideGeofence
                    ? "Estás dentro de la sede. Ya puedes registrar tu asistencia."
                    : "Estás fuera de la sede. Acércate para poder registrar."}
                </p>
              </div>
            )}

            {method === "facial" && (
              <div className="relative flex h-48 items-center justify-center rounded-xl bg-slate-900 text-white shadow-inner overflow-hidden">
                <ScanFrame />
                <IconCamera className="size-10 text-slate-500" />
                <span className="absolute bottom-4 rounded-full bg-slate-800/80 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm">
                  Mira de frente a la cámara
                </span>
              </div>
            )}

            {method === "qr" && (
              <div className="relative flex h-48 items-center justify-center rounded-xl bg-slate-900 text-white shadow-inner overflow-hidden">
                <ScanFrame />
                <IconQrcode className="size-12 text-slate-500" />
                <div className="absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 animate-pulse bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <span className="absolute bottom-4 rounded-full bg-slate-800/80 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm">
                  Apunta tu credencial al lector
                </span>
              </div>
            )}
          </div>

          {/* Botón de acción principal: Sólido, sin bordes, con transición suave */}
          <Button
            size="lg"
            onClick={handleClockIn}
            disabled={loading || blocked || done !== null}
            className={`h-14 w-full gap-3 rounded-xl text-base font-semibold shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-100 ${
              done
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : blocked
                  ? "bg-muted text-muted-foreground"
                  : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {done ? (
              <>
                <IconCheck className="size-5" />
                <span>{done} registrada</span>
              </>
            ) : loading ? (
              <>
                <IconClock className="size-5 animate-spin" />
                <span>Registrando...</span>
              </>
            ) : (
              <>
                <ActionIcon className="size-5 shrink-0" />
                <span>Registrar {nextType.toLowerCase()}</span>
              </>
            )}
          </Button>
        </section>
      </div>
    </div>
  );
}
