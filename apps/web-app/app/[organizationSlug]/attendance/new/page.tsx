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
  QrCode,
  ScanFace,
} from "lucide-react";

import { Scanner } from "@yudiel/react-qr-scanner";
import { LivenessDetector } from "@/components/liveness-detector";

type Method = "facial" | "qr";

const METHODS: { id: Method; label: string; icon: typeof ScanFace }[] = [
  { id: "facial", label: "Biometría Facial", icon: ScanFace },
  { id: "qr", label: "Código QR", icon: QrCode },
];

export default function AttendanceNewPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [method, setMethod] = useState<Method>("facial");
  const [isInsideGeofence] = useState(true); // Se asume validado por GPS en background

  // Estados de flujo
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<"Entrada" | "Salida" | null>(null);

  const [livenessError, setLivenessError] = useState<string | null>(null);

  // Historial del día
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

  // EJECUCIÓN AUTOMÁTICA AL PASAR LA PRUEBA (Facial o QR)
  const handleClockIn = async (verificationData: any, methodUsed: string) => {
    // Si no está en la geocerca, bloqueamos el registro
    if (!isInsideGeofence) return;

    const type = nextType;
    setLoading(true);

    try {
      // ---------------------------------------------------------
      // AQUÍ VA TU LÓGICA DE BASE DE DATOS (SUPABASE / BACKEND)
      // Ejemplo:
      // await registrarAsistencia({
      //   tipo: type, // 'Entrada' o 'Salida'
      //   metodo: methodUsed, // 'facial' o 'qr'
      //   codigoBiometricoOQR: verificationData
      // });
      // ---------------------------------------------------------

      // Simulamos el tiempo de red
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
      setIsCameraActive(false); // Apagamos la cámara automáticamente

      // Limpiamos el mensaje de éxito después de unos segundos
      setTimeout(() => setDone(null), 4000);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setIsCameraActive(false);
      setLivenessError("Hubo un error al registrar en la base de datos.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6">
      {/* 1. INFORMACIÓN DE LA SEDE Y ESTADO GPS DE FONDO */}
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
              Control biométrico y GPS activo
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
          {isInsideGeofence ? "Dentro del perímetro" : "Fuera del perímetro"}
        </Badge>
      </Card>

      {/* 2. MÓDULO PRINCIPAL DE MARCAJE */}
      <Card className="rounded-2xl sm:rounded-3xl border-2 border-border shadow-none overflow-hidden bg-card p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
          {/* PANEL IZQUIERDO: Reloj e Historial */}
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

          {/* PANEL DERECHO: Verificación Automática */}
          <div className="lg:col-span-7 p-5 sm:p-7 lg:p-8 flex flex-col gap-6 bg-card">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-xs font-bold text-muted-foreground">
                  Marcaje Automático ({nextType})
                </h2>
                <p className="text-xs sm:text-sm text-foreground font-semibold">
                  Selecciona tu método de validación
                </p>
              </div>

              {/* Selector de Método (Solo 2 Opciones) */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 p-1.5 bg-muted rounded-xl border-2 border-border w-full">
                {METHODS.map(({ id, label, icon: Icon }) => {
                  const active = method === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={loading || done !== null}
                      onClick={() => {
                        setMethod(id);
                        setIsCameraActive(false);
                        setLivenessError(null);
                      }}
                      className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg py-2.5 px-2 sm:px-3 text-xs font-bold transition-all min-w-0 ${
                        active
                          ? "bg-primary text-primary-foreground border-2 border-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-50"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* VISUALIZADOR DE CÁMARA O ESTADOS */}
            <div className="flex-1 flex flex-col justify-center min-h-[340px]">
              {/* ESTADOS GLOBALES (Cargando o Éxito) */}
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 animate-pulse">
                  <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="size-7 animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">
                      Procesando {nextType}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Validando datos y guardando registro...
                    </p>
                  </div>
                </div>
              ) : done ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className="size-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Check className="size-7" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-emerald-600">
                      {done} confirmada
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tu asistencia ha sido registrada correctamente.
                    </p>
                  </div>
                </div>
              ) : !isInsideGeofence ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 p-6 border-2 border-red-500/20 bg-red-500/5 rounded-2xl text-center">
                  <MapPin className="size-8 text-red-500" />
                  <p className="text-sm font-bold text-red-600">
                    Fuera del área permitida
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Debes estar en las instalaciones para habilitar la cámara y
                    marcar tu asistencia.
                  </p>
                </div>
              ) : !isCameraActive ? (
                /* ESTADO: CÁMARA APAGADA (Esperando acción del usuario) */
                <div className="flex flex-col items-center justify-center h-full gap-4 p-8 border-2 border-dashed border-border rounded-2xl bg-muted/30">
                  <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    {method === "facial" ? (
                      <Camera className="size-8" />
                    ) : (
                      <QrCode className="size-8" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">
                      {method === "facial"
                        ? "Escáner Biométrico Inactivo"
                        : "Lector QR Inactivo"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">
                      {method === "facial"
                        ? "Enciende la cámara para realizar la validación de presencia."
                        : "Enciende la cámara para escanear tu fotocheck."}
                    </p>
                    <Button
                      onClick={() => setIsCameraActive(true)}
                      className="font-bold text-xs"
                    >
                      Encender {method === "facial" ? "cámara" : "escáner"}
                    </Button>
                  </div>
                  {livenessError && (
                    <p className="text-xs font-bold text-red-500 mt-2">
                      {livenessError}
                    </p>
                  )}
                </div>
              ) : (
                /* ESTADO: CÁMARA ENCENDIDA (Facial o QR) */
                <div className="w-full h-full flex flex-col justify-center animate-in fade-in zoom-in-95 duration-300">
                  {method === "facial" && (
                    <LivenessDetector
                      onSuccess={(referenceImage) =>
                        handleClockIn(referenceImage, "facial")
                      }
                      onError={(msg) => {
                        setIsCameraActive(false);
                        setLivenessError(msg);
                      }}
                    />
                  )}

                  {method === "qr" && (
                    <div className="relative flex w-full max-w-sm mx-auto items-center justify-center rounded-2xl overflow-hidden border-2 border-border bg-black aspect-square">
                      <Scanner
                        onScan={(result) => {
                          if (result && result.length > 0) {
                            handleClockIn(result[0].rawValue, "qr");
                          }
                        }}
                      />
                      <div className="absolute inset-x-12 top-1/2 h-0.5 -translate-y-1/2 bg-primary/80 animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
                      <span className="absolute bottom-4 rounded-md bg-neutral-900/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-neutral-700">
                        Apunta el código a la cámara
                      </span>
                      <button
                        onClick={() => setIsCameraActive(false)}
                        className="absolute top-4 right-4 bg-neutral-900/80 text-white p-2 rounded-full backdrop-blur-md text-xs font-bold"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
