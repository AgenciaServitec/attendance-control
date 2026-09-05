"use client";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {IconBuilding, IconCamera, IconCheck, IconClock, IconMapPin, IconQrcode, IconScan,} from "@tabler/icons-react";

export default function AttendanceNewPage() {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [method, setMethod] = useState<"gps" | "facial" | "qr">("gps");
    const [isInsideGeofence] = useState(true);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("es-PE", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                })
            );
            setDate(
                now.toLocaleDateString("es-PE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })
            );
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleClockIn = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1200);
    };

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 p-4 sm:p-6 lg:p-10 transition-all duration-300 my-auto">
            {/* Reloj Digital y Fecha */}
            <div className="flex flex-col items-center justify-center space-y-1.5 text-center">
                <span className="font-mono text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground whitespace-nowrap">
                    {time || "00:00:00 AM"}
                </span>
                <p className="text-xs sm:text-sm font-medium capitalize text-muted-foreground">
                    {date}
                </p>
            </div>

            {/* Selector de Método via Select Amplio */}
            <div className="w-full">
                <Select value={method} onValueChange={(val) => setMethod(val as any)}>
                    <SelectTrigger className="w-full h-14 sm:h-16 px-4 bg-card text-base font-bold border-border shadow-2xs rounded-xl focus:ring-primary/50">
                        <SelectValue placeholder="Selecciona método de marcación" />
                    </SelectTrigger>
                    <SelectContent align="center" className="w-full bg-card border-border rounded-xl">
                        <SelectItem value="gps" className="py-3 text-sm sm:text-base font-semibold cursor-pointer">
                            <div className="flex items-center gap-3">
                                <IconMapPin className="size-5 text-primary shrink-0" />
                                <span>Geocerca GPS / Ubicación</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="facial" className="py-3 text-sm sm:text-base font-semibold cursor-pointer">
                            <div className="flex items-center gap-3">
                                <IconScan className="size-5 text-primary shrink-0" />
                                <span>Reconocimiento Facial</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="qr" className="py-3 text-sm sm:text-base font-semibold cursor-pointer">
                            <div className="flex items-center gap-3">
                                <IconQrcode className="size-5 text-primary shrink-0" />
                                <span>Escáner Código QR</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Badges de Sede y Estado GPS */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted border border-border text-xs sm:text-sm font-semibold text-foreground">
                    <IconBuilding className="size-4 text-primary shrink-0" />
                    <span>Sede Central / Aula 204</span>
                </div>

                {method === "gps" && (
                    <div
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold ${
                            isInsideGeofence
                                ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "border border-destructive/40 bg-destructive/10 text-destructive"
                        }`}
                    >
                        <span className={`size-2 rounded-full ${isInsideGeofence ? "bg-emerald-500 animate-pulse" : "bg-destructive"}`} />
                        <span>{isInsideGeofence ? "Dentro de la Geocerca" : "Fuera de rango GPS"}</span>
                    </div>
                )}
            </div>

            {/* VISTA 1: GPS */}
            {method === "gps" && (
                <div className="w-full flex flex-col items-center gap-4">
                    <Button
                        size="lg"
                        className="w-full max-w-xl h-20 sm:h-24 rounded-xl text-base sm:text-lg lg:text-xl font-black gap-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all active:scale-[0.99]"
                        onClick={handleClockIn}
                        disabled={loading || !isInsideGeofence}
                    >
                        {success ? (
                            <>
                                <IconCheck className="size-6 sm:size-7" />
                                <span>MARCAJE REGISTRADO</span>
                            </>
                        ) : loading ? (
                            <>
                                <IconClock className="size-6 sm:size-7 animate-spin" />
                                <span>VERIFICANDO COORDENADAS...</span>
                            </>
                        ) : (
                            <>
                                <IconMapPin className="size-6 sm:size-7 shrink-0" />
                                <span>MARCAR ASISTENCIA</span>
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* VISTA 2: FACIAL */}
            {method === "facial" && (
                <div className="w-full flex flex-col items-center gap-6">
                    <div className="relative flex size-48 sm:size-60 items-center justify-center rounded-xl border-2 border-dashed border-primary/50 bg-muted/20">
                        <IconCamera className="size-12 sm:size-14 text-muted-foreground/50" />
                    </div>

                    <Button
                        size="lg"
                        className="w-full max-w-xl h-16 sm:h-20 rounded-xl text-base sm:text-lg font-black gap-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all active:scale-[0.99]"
                        onClick={handleClockIn}
                        disabled={loading}
                    >
                        <IconScan className="size-6 sm:size-7" />
                        <span>ESCANEAR ROSTRO Y MARCAR</span>
                    </Button>
                </div>
            )}

            {/* VISTA 3: QR */}
            {method === "qr" && (
                <div className="w-full flex flex-col items-center gap-6">
                    <div className="relative flex size-48 sm:size-60 items-center justify-center rounded-xl border border-border bg-black/90">
                        <IconQrcode className="size-16 sm:size-20 text-white/80" />
                    </div>

                    <Button
                        size="lg"
                        className="w-full max-w-xl h-16 sm:h-20 rounded-xl text-base sm:text-lg font-black gap-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all active:scale-[0.99]"
                        onClick={handleClockIn}
                        disabled={loading}
                    >
                        <IconQrcode className="size-6 sm:size-7" />
                        <span>ACTIVAR CÁMARA QR</span>
                    </Button>
                </div>
            )}
        </div>
    );
}