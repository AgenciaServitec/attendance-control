"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Clock, LogOut, User, Users } from "lucide-react";
import { useUserStore } from "@/store/use-user-store";
import { logout } from "@/app/actions/auth-actions";

export function SiteHeader() {
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

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b-2 border-border bg-card px-4 lg:px-6 transition-all">
      {/* LADO IZQUIERDO: Trigger + Contexto */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />

        <Separator orientation="vertical" className="h-5 bg-border" />

        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1.5 rounded-md border-2 border-border/50">
          <Users className="size-4 text-primary" />
          <span className="text-foreground">Sistemas - Turno Mañana</span>
        </div>
      </div>

      {/* LADO DERECHO: Reloj + Perfil de Usuario */}
      <div className="flex items-center gap-4 text-xs">
        <div className="hidden sm:flex items-center gap-1.5 font-bold text-foreground">
          <Clock className="size-3.5 text-primary shrink-0" />
          <span className="tabular-nums">{time || "00:00:00 AM"}</span>
        </div>

        <Separator
          orientation="vertical"
          className="h-5 bg-border hidden sm:block"
        />

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-muted/60 transition-colors border-2 border-transparent hover:border-border">
              <Avatar className="size-8 border-2 border-border rounded-lg bg-neutral-900 text-white font-bold">
                <AvatarImage
                  src={user?.avatar_url || user?.avatarUrl || ""}
                  alt={user?.fullName}
                  className="rounded-lg object-cover"
                />
                <AvatarFallback className="rounded-lg text-[11px] font-black">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-foreground leading-tight line-clamp-1">
                  {user?.fullName || "Usuario"}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                  {user?.role === "admin" ? "Administrador" : "Empleado"}
                </span>
              </div>
              <ChevronDown className="size-3.5 text-muted-foreground hidden md:block" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl border-2 border-border bg-card p-1.5 shadow-none"
          >
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-bold text-foreground">
                  {user?.fullName}
                </p>
                <p className="text-[11px] font-medium text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              asChild
              className="rounded-lg text-xs font-bold gap-2 cursor-pointer py-2"
            >
              <Link href="/settings/profile">
                <User className="size-4 text-primary" />
                <span>Mi Perfil Personal</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={() => logout()}
              className="rounded-lg text-xs font-bold gap-2 cursor-pointer py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
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
