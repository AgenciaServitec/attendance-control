"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, ChevronDown, Clock, LogOut, User } from "lucide-react";
import { useUserStore } from "@/store/use-user-store";
import { logout } from "@/app/actions/auth-actions";

interface SiteHeaderHubProps {
  showSidebarTrigger?: boolean;
}

export function SiteHeaderHub({
  showSidebarTrigger = true,
}: SiteHeaderHubProps) {
  const [time, setTime] = useState<string>("");
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  const orgName =
    user?.organization?.business_name ||
    user?.organization?.businessName ||
    "Servitec Perú S.A.C.";

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4 transition-colors lg:px-6 select-none">
      {/* LADO IZQUIERDO: Marca Servitec Time O Sidebar Trigger + Organización */}
      <div className="flex items-center gap-3">
        {showSidebarTrigger ? (
          <>
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
            <Separator orientation="vertical" className="h-4 bg-border" />
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Building2 className="size-4 text-primary shrink-0" />
              <span className="truncate max-w-[180px] sm:max-w-xs">
                {orgName}
              </span>
            </div>
          </>
        ) : (
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 outline-none group"
          >
            <Image
              src="/logo.png"
              alt="Logo de la empresa"
              width={20}
              height={20}
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground leading-none tracking-tight">
                Servitec<span className="text-primary">Time</span>
              </span>
              <span className="text-[9px] font-medium text-muted-foreground leading-none mt-0.5">
                Control de Asistencia
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* LADO DERECHO: Reloj del Servidor + Menú de Usuario */}
      <div className="flex items-center gap-3.5 text-xs">
        {/* Reloj Oficial sin tipografía monoespaciada forzada */}
        <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
          <Clock className="size-3.5 text-primary shrink-0" />
          <span className="text-xs font-bold text-foreground tabular-nums">
            {time || "00:00:00 AM"}
          </span>
        </div>

        <Separator
          orientation="vertical"
          className="h-4 bg-border hidden sm:block"
        />

        {/* MENÚ DESPLEGABLE DEL USUARIO */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-2 p-1 rounded-lg hover:bg-muted/60 transition-colors">
              <Avatar className="size-7 border border-border rounded-lg bg-neutral-900 text-white font-bold">
                <AvatarImage
                  src={user?.avatar_url || user?.avatarUrl || ""}
                  alt={user?.fullName}
                  className="rounded-lg object-cover"
                />
                <AvatarFallback className="rounded-lg bg-neutral-900 text-white text-[11px] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-foreground leading-tight line-clamp-1">
                  {user?.fullName || "Usuario"}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {user?.role === "admin" ? "Administrador" : "Empleado"}
                </span>
              </div>

              <ChevronDown className="size-3.5 text-muted-foreground hidden md:block ml-0.5" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl border border-border bg-card p-1 shadow-sm"
          >
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-bold text-foreground truncate">
                  {user?.fullName || "Usuario"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {user?.email || "sin-correo@servitec.pe"}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem
              asChild
              className="rounded-lg text-xs font-medium gap-2 cursor-pointer py-2 focus:bg-muted"
            >
              <Link href="/settings/profile">
                <User className="size-4 text-primary" />
                <span>Mi Perfil Personal</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem
              onClick={() => logout()}
              className="rounded-lg text-xs font-medium gap-2 cursor-pointer py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="size-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
