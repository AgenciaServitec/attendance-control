"use client";

import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {IconCalendarCheck, IconCheck, IconClockPlay, IconClockStop, IconHourglass} from "@tabler/icons-react";
import {CircleAlert} from "lucide-react"

export function EmployeeDashboard() {
    const [clockedIn, setClockedIn] = useState(false);
    const [time, setTime] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-6">
            {/* Hero Widget: Fichaje Rápido */}
            <Card className="border-primary/20 bg-linear-to-r from-primary/5 via-card to-card">
                <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <Badge variant="outline" className={clockedIn ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : "border-amber-500/30 bg-amber-500/10 text-amber-600"}>
                            {clockedIn ? "En servicio (Marcado 08:02 AM)" : "Pendiente de marcación de ingreso"}
                        </Badge>
                        <h2 className="text-2xl font-bold tracking-tight">¡Hola, Angel!</h2>
                        <p className="text-xs text-muted-foreground">
                            Horario asignado hoy: <span className="font-semibold text-foreground">08:00 AM - 05:00 PM (Sistemas - Turno Mañana)</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-3">
                        <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
                            {time || "00:00:00 AM"}
                        </div>
                        <Button
                            size="lg"
                            className={`font-semibold gap-2 transition-all ${clockedIn ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                            onClick={() => setClockedIn(!clockedIn)}
                        >
                            {clockedIn ? (
                                <>
                                    <IconClockStop className="size-5" />
                                    <span>Marcar Salida</span>
                                </>
                            ) : (
                                <>
                                    <IconClockPlay className="size-5" />
                                    <span>Marcar Ingreso</span>
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* KPIs Personales del Mes */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Días Asistidos</CardTitle>
                        <IconCalendarCheck className="size-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18 / 20</div>
                        <p className="text-[11px] text-muted-foreground mt-1">90% de cumplimiento este mes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Tardanzas Registradas</CardTitle>
                        <CircleAlert className="size-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-[11px] text-muted-foreground mt-1">Acumulado: 12 min de tolerancia</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Horas Acumuladas</CardTitle>
                        <IconHourglass className="size-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">144 hrs</div>
                        <p className="text-[11px] text-muted-foreground mt-1">4 hrs extra aprobadas</p>
                    </CardContent>
                </Card>
            </div>

            {/* Estado de Permisos Recientes */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold">Mis Solicitudes Recientes</CardTitle>
                    <CardDescription className="text-xs">Estado de permisos y justificaciones solicitadas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 text-xs">
                        <div className="space-y-0.5">
                            <p className="font-semibold">Descanso Médico (Cita EsSalud)</p>
                            <p className="text-muted-foreground text-[11px]">Solicitado para el 12 de Septiembre</p>
                        </div>
                        <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 gap-1">
                            <IconCheck className="size-3" /> Aprobado
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 text-xs">
                        <div className="space-y-0.5">
                            <p className="font-semibold">Justificación de Tardanza</p>
                            <p className="text-muted-foreground text-[11px]">Solicitado para el 02 de Septiembre</p>
                        </div>
                        <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 gap-1">
                            <IconHourglass className="size-3" /> Pendiente
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}