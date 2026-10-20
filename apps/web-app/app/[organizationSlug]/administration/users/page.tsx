"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function UsersAdministrationPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock de usuarios extraídos de BD
  const [users] = useState([
    {
      id: "usr_1",
      firstName: "Angel Emilio",
      lastName: "Gala Flores",
      email: "angel.gala@servitec.com",
      role: "admin",
      status: "active",
      enrolled: true,
    },
    {
      id: "usr_2",
      firstName: "Carlos",
      lastName: "Mendoza",
      email: "carlos.m@servitec.com",
      role: "employee",
      status: "active",
      enrolled: false,
    },
    {
      id: "usr_3",
      firstName: "Maria",
      lastName: "Perez",
      email: "maria.p@servitec.com",
      role: "employee",
      status: "inactive",
      enrolled: true,
    },
  ]);

  // Filtro simple por nombre o apellido
  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">
            Administración de Empleados
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Gestiona los accesos, roles y registros biométricos del personal.
          </p>
        </div>
        <Button className="font-bold gap-2 rounded-lg">
          <Plus className="size-4" /> Nuevo Empleado
        </Button>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="flex items-center max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o apellido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-card border-border rounded-xl font-medium"
        />
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-bold">Colaborador</TableHead>
              <TableHead className="font-bold">Rol</TableHead>
              <TableHead className="font-bold">Biometría</TableHead>
              <TableHead className="font-bold">Estado</TableHead>
              <TableHead className="font-bold text-right">Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron empleados.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/20">
                  {/* Colaborador */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 rounded-lg">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold rounded-lg text-xs">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Rol */}
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="capitalize text-[10px] font-bold"
                    >
                      {user.role === "admin" ? "Admin" : "Empleado"}
                    </Badge>
                  </TableCell>

                  {/* Estado de Enrolamiento AWS */}
                  <TableCell>
                    {user.enrolled ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-500">
                        <ShieldCheck className="size-4" /> Registrado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                        Pendiente
                      </span>
                    )}
                  </TableCell>

                  {/* Estado General */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        user.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-neutral-500/10 text-neutral-500 border-neutral-500/20"
                      }`}
                    >
                      {user.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>

                  {/* Opciones (Editar/Eliminar) */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="size-8 p-0 hover:bg-muted"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl border-border"
                      >
                        <DropdownMenuLabel className="text-xs">
                          Acciones
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs font-bold cursor-pointer gap-2">
                          <Pencil className="size-3.5" /> Editar Datos
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs font-bold cursor-pointer text-destructive focus:text-destructive gap-2">
                          <Trash2 className="size-3.5" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
