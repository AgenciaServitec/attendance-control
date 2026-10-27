"use client";

import { createColumnHelper } from "@tanstack/react-table";

import { type DataTableFeatures } from "./data-table-features";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconBrandWhatsapp, IconDots, IconMail } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export type Profile = {
  select: boolean;
  fullName: string;
  contact: string;
  role: string;
  biometric: string;
  status: "active" | "inactive";
};

const columnHelper = createColumnHelper<DataTableFeatures, Profile>();

export const columns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("fullName", {
    header: "Nombre Completo",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={user.avatar_url}
              alt={`Foto de Perfil de ${user.first_name} ${user.paternal_surname}`}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            {user.first_name} {user.paternal_surname} {user.maternal_surname}
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("contact", {
    header: "Contacto",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <IconMail stroke={2} size={15} />
            <span>{user.email || "test@gmail.com"}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconBrandWhatsapp stroke={2} size={15} />
            <span>
              {user.country_code} {user.phone_number}
            </span>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("role", {
    header: "Rol",
    cell: ({ row }) => {
      const user = row.original;

      return <Badge>{user.role === "admin" ? "Admin" : "Empleado"}</Badge>;
    },
  }),
  columnHelper.accessor("biometric", {
    header: "Biometría",
    cell: ({ row }) => {
      const user = row.original;

      return <Badge>{user.enrolled ? "Registrado" : "Pendiente"}</Badge>;
    },
  }),
  columnHelper.accessor("status", {
    header: "Estado",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Badge
          className={`${
            user.status === "active" ? "bg-emerald-500" : "bg-neutral-500"
          }`}
        >
          {user.status === "active" ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  }),
  columnHelper.display({
    header: "Opciones",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDots stroke={2} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link
                href={`/8177c014-49dc-4eb9-b2d0-1c0eaa2b45b2/administration/users/${user.id}`}
              >
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2 focus:bg-destructive/10 focus:text-destructive">
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
]);
