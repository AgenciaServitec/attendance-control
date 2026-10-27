"use client";

import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { getProfiles } from "@/app/actions/profiles-actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function UsersAdministrationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const _profiles = await getProfiles();
      setProfiles(_profiles.data);
    });
  }, []);

  console.log("profiles: ", profiles);

  const filteredUsers = profiles.filter((u) =>
    u.first_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full flex flex-col gap-6">
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
      <div className="flex items-center max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o apellido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-card border-border rounded-xl font-medium"
        />
      </div>
      <DataTable columns={columns} data={profiles} />
    </div>
  );
}
