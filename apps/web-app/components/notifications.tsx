"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCheck,
  Clock,
  Info,
  MapPin,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "late" | "geofence" | "biometric" | "system";
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Alerta de Tardanza",
    description:
      "El colaborador Carlos Mendoza registró entrada con 18 min de demora.",
    time: "Hace 10 min",
    type: "late",
    read: false,
  },
  {
    id: "notif-2",
    title: "Intento fuera de Geocerca",
    description:
      "Se detectó intento de marcación a 450m fuera de la Sede Central.",
    time: "Hace 45 min",
    type: "geofence",
    read: false,
  },
  {
    id: "notif-3",
    title: "Enrolamiento Biométrico Completado",
    description:
      "Tu patrón facial ha sido sincronizado exitosamente en AWS Rekognition.",
    time: "Hace 2 horas",
    type: "biometric",
    read: true,
  },
  {
    id: "notif-4",
    title: "Actualización de Horario",
    description:
      "Se ha asignado el Turno Mañana (08:00 AM - 05:00 PM) para esta semana.",
    time: "Ayer, 06:30 PM",
    type: "system",
    read: true,
  },
];

export function NotificationsSheet() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS,
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const removeNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Evitamos que se dispare el evento click de marcar como leída
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "late":
        return <Clock className="size-4 text-amber-500" />;
      case "geofence":
        return <MapPin className="size-4 text-red-500" />;
      case "biometric":
        return <ShieldCheck className="size-4 text-emerald-500" />;
      case "system":
      default:
        return <Info className="size-4 text-blue-500" />;
    }
  };

  return (
    <Sheet>
      {/* TRIGGER ORIGINAL MANTENIDO AL 100% */}
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-8 shrink-0 group-data-[collapsible=icon]:opacity-0"
          title="Notificaciones"
        >
          <Bell className="size-4 text-foreground/80" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-red-600" />
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        className="w-full sm:max-w-md p-0 flex flex-col bg-card border-l border-border"
        side="left"
      >
        {/* HEADER DEL PANEL CON MARGEN DERECHO (pr-12) PARA EVITAR SOLAPAMIENTO CON LA X DEL SHEET */}
        <SheetHeader className="p-5 pr-12 border-b border-border flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-base font-bold text-foreground">
                Notificaciones
              </SheetTitle>
              {unreadCount > 0 && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} nuevas
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-7 px-2 text-[11px] font-bold text-muted-foreground hover:text-foreground gap-1 rounded-md"
                  title="Marcar todas como leídas"
                >
                  <CheckCheck className="size-3.5" />
                  <span className="hidden sm:inline">Leer todas</span>
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive rounded-md"
                  title="Limpiar todo el historial"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
          <SheetDescription className="text-xs text-muted-foreground font-medium">
            Alertas en tiempo real sobre marcaciones, incidencias y accesos.
          </SheetDescription>
        </SheetHeader>

        {/* LISTA DE NOTIFICACIONES */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/60 p-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="h-full min-h-[250px] flex flex-col items-center justify-center p-8 text-center gap-2">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground/60">
                <Bell className="size-6" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-foreground">
                  Sin notificaciones
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Estás al día. No hay nuevas alertas pendientes.
                </span>
              </div>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`group p-3.5 rounded-xl flex items-start gap-3 transition-all cursor-pointer relative hover:bg-muted/50 border border-transparent ${
                  !n.read
                    ? "bg-muted/30 border-border/40"
                    : "bg-transparent opacity-80"
                }`}
              >
                {/* Indicador de punto no leído */}
                {!n.read && (
                  <span className="absolute left-2 top-4 size-1.5 rounded-full bg-primary" />
                )}

                {/* Contenido principal */}
                <div className="flex flex-col gap-1 flex-1 min-w-0 pr-6">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold truncate ${
                        !n.read ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {n.title}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground shrink-0 font-mono">
                      {n.time}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-medium">
                    {n.description}
                  </p>
                </div>

                {/* BOTÓN EQUIS (X) PARA ELIMINAR NOTIFICACIÓN INDIVIDUAL */}
                <button
                  type="button"
                  onClick={(e) => removeNotification(e, n.id)}
                  className="absolute top-3 right-2.5 p-1 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted transition-colors opacity-80 group-hover:opacity-100"
                  title="Descartar notificación"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
