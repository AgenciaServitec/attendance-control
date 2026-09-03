"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Bar, BarChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {IconCheck, IconUserCheck, IconUserExclamation, IconUsers, IconX} from "@tabler/icons-react";
import {CircleAlert} from "lucide-react"

const chartData = [
    { day: "Lun", aTiempo: 42, tardanza: 4, falta: 2 },
    { day: "Mar", aTiempo: 45, tardanza: 2, falta: 1 },
    { day: "Mie", aTiempo: 40, tardanza: 5, falta: 3 },
    { day: "Jue", aTiempo: 44, tardanza: 3, falta: 1 },
    { day: "Vie", aTiempo: 38, tardanza: 7, falta: 3 },
];

const chartConfig = {
    aTiempo: { label: "A tiempo", color: "var(--color-primary)" },
    tardanza: { label: "Tardanza", color: "var(--color-accent)" },
    falta: { label: "Inasistencia", color: "var(--color-destructive)" },
};

export function AdminDashboard() {
    return (
        <div className="flex flex-col gap-6">
            {/* KPIs Métricas Globales */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Total Personal / Alumnos</CardTitle>
                        <IconUsers className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">48</div>
                        <p className="text-[11px] text-muted-foreground mt-1">Activos en el turno actual</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Presentes Hoy</CardTitle>
                        <IconUserCheck className="size-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42 <span className="text-xs text-muted-foreground font-normal">(87.5%)</span></div>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">92% de puntualidad promedio</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Tardanzas Hoy</CardTitle>
                        <CircleAlert className="size-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Dentro del rango de tolerancia</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Ausencias Sin Justificar</CardTitle>
                        <IconUserExclamation className="size-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-[11px] text-destructive mt-1">Alertas emitidas por sistema</p>
                    </CardContent>
                </Card>
            </div>

            {/* Gráfico y Feed en Vivo */}
            <div className="grid gap-6 md:grid-cols-7">
                {/* Gráfico Semanal */}
                <Card className="md:col-span-4">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold">Resumen de Asistencia Semanal</CardTitle>
                        <CardDescription className="text-xs">Registro de cumplimiento por días de la semana.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="aTiempo" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="tardanza" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="falta" fill="var(--color-destructive)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Feed de Actividad en Vivo */}
                <Card className="md:col-span-3 flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold">Últimas Marcaciones</CardTitle>
                        <CardDescription className="text-xs">Fichajes registrados en tiempo real.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 flex-1 overflow-auto max-h-64">
                        {[
                            { name: "Carlos Mendoza", time: "08:14 AM", status: "Tardanza", location: "Sede Central", avatar: "CM" },
                            { name: "María Torres", time: "08:00 AM", status: "A tiempo", location: "Aula 204", avatar: "MT" },
                            { name: "Juan Pérez", time: "07:55 AM", status: "A tiempo", location: "Sede Central", avatar: "JP" },
                            { name: "Ana Ruiz", time: "07:50 AM", status: "A tiempo", location: "Remoto / GPS", avatar: "AR" },
                        ].map((log, index) => (
                            <div key={index} className="flex items-center justify-between text-xs p-2 rounded-md hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <Avatar className="size-7 text-[10px]">
                                        <AvatarFallback>{log.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-foreground leading-tight">{log.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{log.location}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono font-medium">{log.time}</p>
                                    <Badge variant="outline" className={`text-[9px] py-0 px-1 ${log.status === "A tiempo" ? "border-emerald-500/30 text-emerald-600" : "border-amber-500/30 text-amber-600"}`}>
                                        {log.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Solicitudes de Permisos por Aprobar */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold">Aprobaciones Pendientes</CardTitle>
                    <CardDescription className="text-xs">Permisos o solicitudes de ajuste pendientes de revisión.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="text-xs">
                                <TableHead>Solicitante</TableHead>
                                <TableHead>Motivo</TableHead>
                                <TableHead>Fecha Solicitada</TableHead>
                                <TableHead className="text-right">Acción</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-xs">
                            <TableRow>
                                <TableCell className="font-medium">Lucía Gómez</TableCell>
                                <TableCell>Permiso Personal (3 hrs)</TableCell>
                                <TableCell>Mañana, 09:00 AM</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button size="icon" variant="ghost" className="size-7 text-emerald-600 hover:bg-emerald-500/10">
                                            <IconCheck className="size-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="size-7 text-destructive hover:bg-destructive/10">
                                            <IconX className="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}