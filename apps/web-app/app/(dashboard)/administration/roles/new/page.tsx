"use client";

import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {db} from "@/lib/firebase/config";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import {IconCheck, IconClock} from "@tabler/icons-react";

// 1. Esquema Zod
const roleFormSchema = z.object({
    name: z
        .string()
        .min(3, "El nombre del rol debe tener al menos 3 caracteres.")
        .max(50, "El nombre no puede exceder 50 caracteres."),
    description: z
        .string()
        .min(5, "La descripción debe tener al menos 5 caracteres.")
        .max(150, "La descripción no puede exceder 150 caracteres."),
    permissions: z
        .array(z.string())
        .min(1, "Debes seleccionar al menos un permiso para este rol."),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

// Catálogo de Permisos
const PERMISSION_GROUPS = [
    {
        id: "attendance",
        label: "Control de Asistencia",
        description: "Permisos sobre marcaciones, ubicaciones y reportes",
        permissions: [
            { id: "attendance.read", label: "Ver marcaciones propias y de equipo" },
            { id: "attendance.create", label: "Registrar marcaciones manuales / correcciones" },
            { id: "attendance.export", label: "Exportar reportes de asistencia (PDF/Excel)" },
            { id: "attendance.locations", label: "Gestionar puntos GPS y geocercas" },
        ],
    },
    {
        id: "requests",
        label: "Permisos y Licencias",
        description: "Gestión de solicitudes de descanso, faltas y justificaciones",
        permissions: [
            { id: "requests.create", label: "Crear solicitudes de permiso" },
            { id: "requests.approve", label: "Aprobar o rechazar permisos de personal" },
            { id: "requests.delete", label: "Anular o eliminar solicitudes" },
        ],
    },
    {
        id: "schedules",
        label: "Horarios y Turnos",
        description: "Configuración de jornadas laborales e institucionales",
        permissions: [
            { id: "schedules.manage", label: "Crear y editar turnos / horarios" },
            { id: "schedules.assign", label: "Asignar turnos a usuarios o aulas" },
        ],
    },
    {
        id: "admin",
        label: "Administración General",
        description: "Gestión de usuarios, empresas y configuración",
        permissions: [
            { id: "users.manage", label: "Crear, editar y dar de baja usuarios" },
            { id: "roles.manage", label: "Crear y asignar roles del sistema" },
            { id: "organizations.manage", label: "Configurar datos de la empresa / sedes" },
        ],
    },
];

export default function NewRolePage() {
    const [activeTab, setActiveTab] = useState("info");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            name: "",
            description: "",
            permissions: ["attendance.read"],
        },
    });

    const selectedPermissions = form.watch("permissions") || [];

    const slugify = (text: string) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

    async function onSubmit(data: RoleFormValues) {
        setIsSubmitting(true);
        try {
            const rolePayload = {
                name: data.name.trim(),
                code: slugify(data.name),
                description: data.description.trim(),
                permissions: data.permissions,
                isSystem: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await addDoc(collection(db, "roles"), rolePayload);

            alert("Rol creado exitosamente en Firestore");
            form.reset();
            setActiveTab("info");
        } catch (error) {
            console.error("Error al guardar el rol:", error);
            alert("Ocurrió un error al intentar guardar el rol.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const toggleGroupPermissions = (
        groupPermissions: { id: string }[],
        currentValues: string[],
        onChange: (val: string[]) => void
    ) => {
        const groupIds = groupPermissions.map((p) => p.id);
        const hasAll = groupIds.every((id) => currentValues.includes(id));

        if (hasAll) {
            onChange(currentValues.filter((id) => !groupIds.includes(id)));
        } else {
            const newSet = new Set([...currentValues, ...groupIds]);
            onChange(Array.from(newSet));
        }
    };

    return (
        <div className="flex w-full flex-col gap-4">
            {/* Cabecera */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Crear Nuevo Rol
                </h1>

                <Badge variant="outline" className="w-fit rounded-md px-2.5 py-1 text-xs font-semibold gap-1.5 border-primary/30 text-primary">
                    <span>{selectedPermissions.length} permisos seleccionados</span>
                </Badge>
            </div>

            <form id="role-form" onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
                    <TabsList className="grid w-full grid-cols-2 h-10 bg-muted/60 p-1 rounded-md">
                        <TabsTrigger
                            value="info"
                            className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold data-[state=active]:bg-card data-[state=active]:text-primary rounded-sm"
                        >
                            <span>1. Información del Rol</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="permissions"
                            className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold data-[state=active]:bg-card data-[state=active]:text-primary rounded-sm"
                        >
                            <span>2. Permisos del Sistema</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB 1: INFORMACIÓN BÁSICA */}
                    <TabsContent value="info" className="m-0 space-y-4">
                        <Card className="border-border shadow-2xs rounded-lg">
                            <CardContent className="space-y-5">
                                <FieldGroup className="space-y-4">
                                    <Controller
                                        name="name"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="role-name" className="text-xs font-bold text-foreground">
                                                    Nombre del Rol
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="role-name"
                                                    placeholder="ej. Supervisor de Turno / Docente Titular"
                                                    aria-invalid={fieldState.invalid}
                                                    className="h-10 text-sm bg-card border-border rounded-md"
                                                />
                                                <FieldDescription className="text-[11px]">
                                                    Nombre identificador visible en asignación de usuarios.
                                                </FieldDescription>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="description"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="role-description" className="text-xs font-bold text-foreground">
                                                    Descripción de Funciones
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="role-description"
                                                    placeholder="ej. Encargado de revisar asistencia y aprobar permisos en la Sede Central."
                                                    aria-invalid={fieldState.invalid}
                                                    className="h-10 text-sm bg-card border-border rounded-md"
                                                />
                                                <FieldDescription className="text-[11px]">
                                                    Detalla qué responsabilidades tiene asignado este perfil.
                                                </FieldDescription>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>

                                <div className="pt-2 flex justify-end">
                                    <Button
                                        type="button"
                                        className="w-full sm:w-auto h-10 px-5 rounded-md font-bold text-xs"
                                        onClick={() => setActiveTab("permissions")}
                                    >
                                        Continuar a Permisos →
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB 2: PERMISOS */}
                    <TabsContent value="permissions" className="m-0 space-y-4">
                        <Card className="border-border shadow-2xs rounded-lg">
                            <CardContent className="p-4 sm:p-5 space-y-5">
                                <Controller
                                    name="permissions"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="space-y-4">
                                            <div>
                                                <FieldLabel className="text-sm font-bold text-foreground">
                                                    Matriz de Accesos y Capacidades
                                                </FieldLabel>
                                                <FieldDescription className="text-xs">
                                                    Marca las acciones permitidas para los usuarios con este rol.
                                                </FieldDescription>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </div>

                                            <div className="grid gap-4">
                                                {PERMISSION_GROUPS.map((group) => {
                                                    const groupIds = group.permissions.map((p) => p.id);
                                                    const isAllGroupSelected = groupIds.every((id) =>
                                                        field.value?.includes(id)
                                                    );

                                                    return (
                                                        <div
                                                            key={group.id}
                                                            className="p-3.5 rounded-lg border border-border bg-card/50 space-y-3"
                                                        >
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-2">
                                                                <div>
                                                                    <h3 className="text-xs font-bold text-foreground">
                                                                        {group.label}
                                                                    </h3>
                                                                    <p className="text-[11px] text-muted-foreground">
                                                                        {group.description}
                                                                    </p>
                                                                </div>

                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 text-[11px] font-semibold text-primary self-start sm:self-auto px-2"
                                                                    onClick={() =>
                                                                        toggleGroupPermissions(
                                                                            group.permissions,
                                                                            field.value || [],
                                                                            field.onChange
                                                                        )
                                                                    }
                                                                >
                                                                    {isAllGroupSelected
                                                                        ? "Desmarcar grupo"
                                                                        : "Seleccionar todo"}
                                                                </Button>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                                                                {group.permissions.map((perm) => {
                                                                    const isChecked = field.value?.includes(perm.id);
                                                                    return (
                                                                        <div
                                                                            key={perm.id}
                                                                            className="flex items-center space-x-2.5 rounded-md border border-border/60 p-2.5 bg-card hover:bg-muted/30 transition-colors"
                                                                        >
                                                                            <Checkbox
                                                                                id={`perm-${perm.id}`}
                                                                                checked={isChecked}
                                                                                onCheckedChange={(checked) => {
                                                                                    return checked
                                                                                        ? field.onChange([...field.value, perm.id])
                                                                                        : field.onChange(
                                                                                            field.value?.filter(
                                                                                                (value: string) => value !== perm.id
                                                                                            )
                                                                                        );
                                                                                }}
                                                                            />
                                                                            <label
                                                                                htmlFor={`perm-${perm.id}`}
                                                                                className="text-xs font-medium leading-snug cursor-pointer select-none"
                                                                            >
                                                                                {perm.label}
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </Field>
                                    )}
                                />

                                {/* Botones de Acción */}
                                <div className="pt-3 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-border">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full sm:w-auto h-10 px-4 rounded-md text-xs font-semibold"
                                        onClick={() => setActiveTab("info")}
                                    >
                                        ← Volver a Información
                                    </Button>

                                    <Button
                                        type="submit"
                                        form="role-form"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto h-10 px-5 rounded-md font-bold text-xs gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <IconClock className="size-4 animate-spin" />
                                                <span>Guardando en Firebase...</span>
                                            </>
                                        ) : (
                                            <>
                                                <IconCheck className="size-4" />
                                                <span>Guardar y Crear Rol</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </div>
    );
}