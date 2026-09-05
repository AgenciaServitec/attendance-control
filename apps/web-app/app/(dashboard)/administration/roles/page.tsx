"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {collection, deleteDoc, doc, onSnapshot, orderBy, query} from "firebase/firestore";
import {db} from "@/lib/firebase/config";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {IconEdit, IconPlus, IconSearch, IconShield, IconShieldLock, IconTrash,} from "@tabler/icons-react";

interface RoleDoc {
    id: string;
    name: string;
    code: string;
    description: string;
    permissions: string[];
    isSystem?: boolean;
}

export default function RolesIntegrationsPage() {
    const [roles, setRoles] = useState<RoleDoc[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Escuchar la colección 'roles' en tiempo real
    useEffect(() => {
        const q = query(collection(db, "roles"), orderBy("name", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as RoleDoc[];
            setRoles(docs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Eliminar Rol
    const handleDeleteRole = async (roleId: string, roleName: string) => {
        if (confirm(`¿Estás seguro de eliminar el rol "${roleName}"?`)) {
            try {
                await deleteDoc(doc(db, "roles", roleId));
            } catch (error) {
                console.error("Error al eliminar el rol:", error);
                alert("No se pudo eliminar el rol.");
            }
        }
    };

    // Filtrar por búsqueda
    const filteredRoles = roles.filter(
        (role) =>
            role.name.toLowerCase().includes(search.toLowerCase()) ||
            role.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex w-full flex-col gap-4">
            {/* Cabecera y Acciones */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Roles y Permisos
                </h1>

                <Button className="h-10 px-4 rounded-md font-bold text-xs gap-2" asChild>
                    <Link href="/administration/roles/new">
                        <IconPlus className="size-4" />
                        <span>Crear Nuevo Rol</span>
                    </Link>
                </Button>
            </div>

            {/* Búsqueda */}
            <div className="relative w-full sm:max-w-xs">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nombre o código..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 pl-9 text-xs bg-card border-border rounded-md"
                />
            </div>

            {/* Lista de Cards Horizontales */}
            <div className="flex flex-col gap-2.5">
                {loading ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                        Cargando roles desde Firebase...
                    </div>
                ) : filteredRoles.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-border rounded-lg text-xs text-muted-foreground">
                        No se encontraron roles registrados.
                    </div>
                ) : (
                    filteredRoles.map((role) => (
                        <Card
                            key={role.id}
                            className="border-border shadow-2xs hover:border-primary/40 transition-colors rounded-lg"
                        >
                            <CardContent className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                {/* Info Principal del Rol */}
                                <div className="flex items-start gap-3 min-w-[220px]">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-foreground">
                                                {role.name}
                                            </span>
                                            {role.isSystem && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[10px] px-1.5 py-0 h-4 font-semibold"
                                                >
                                                    Sistema
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-[11px] font-mono text-muted-foreground">
                                            {role.code}
                                        </p>
                                    </div>
                                </div>

                                {/* Descripción */}
                                <div className="flex-1 text-xs text-muted-foreground line-clamp-2 md:line-clamp-1 max-w-md">
                                    {role.description || "Sin descripción asignada."}
                                </div>

                                {/* Badges de Permisos Clave */}
                                <div className="flex flex-wrap items-center gap-1.5 max-w-xs">
                                    {role.permissions?.slice(0, 3).map((perm) => (
                                        <Badge
                                            key={perm}
                                            variant="outline"
                                            className="text-[10px] font-mono px-2 py-0.5 rounded-md border-border bg-muted/40"
                                        >
                                            {perm}
                                        </Badge>
                                    ))}
                                    {role.permissions?.length > 3 && (
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md border-primary/30 text-primary"
                                        >
                                            +{role.permissions.length - 3} más
                                        </Badge>
                                    )}
                                </div>

                                {/* Opciones de Acción */}
                                <div className="flex items-center justify-end gap-1 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/50">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-muted-foreground hover:text-foreground"
                                        asChild
                                    >
                                        <Link href={`/administration/roles/${role.id}/edit`}>
                                            <IconEdit className="size-4" />
                                        </Link>
                                    </Button>

                                    {!role.isSystem && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDeleteRole(role.id, role.name)}
                                        >
                                            <IconTrash className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}