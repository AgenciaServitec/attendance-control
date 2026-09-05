"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Field, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Loader2, Search} from "lucide-react";
import countryCodes from "../data-list/countries.json";

// 1. Esquema de Validación Zod
const registerSchema = z.object({
    document: z.object({
        type: z.literal("DNI"),
        number: z
            .string()
            .length(8, "El DNI debe tener exactamente 8 dígitos.")
            .regex(/^\d+$/, "El DNI solo debe contener números."),
    }),
    firstName: z
        .string()
        .min(2, "Los nombres deben tener al menos 2 caracteres."),
    paternalSurname: z
        .string()
        .min(2, "El apellido paterno debe tener al menos 2 caracteres."),
    maternalSurname: z
        .string()
        .min(2, "El apellido materno debe tener al menos 2 caracteres."),
    phone: z.object({
        prefix: z.string().min(1, "Selecciona un código de país."),
        number: z
            .string()
            .min(9, "El número debe tener al menos 9 dígitos.")
            .regex(/^\d+$/, "El teléfono solo debe contener números."),
    }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
        message: "Selecciona un género válido.",
    }),
    status: z.enum(["active", "inactive"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
    const [isSearchingDni, setIsSearchingDni] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 2. Inicialización de react-hook-form
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            document: {
                type: "DNI",
                number: "",
            },
            firstName: "",
            paternalSurname: "",
            maternalSurname: "",
            phone: {
                prefix: "+51",
                number: "",
            },
            gender: "MALE",
            status: "active",
        },
    });

    // Búsqueda de DNI para autocompletar nombres
    const handleSearchDni = async () => {
        const dniNumber = form.getValues("document.number");
        if (dniNumber.length !== 8) {
            form.setError("document.number", {
                type: "manual",
                message: "Ingresa un DNI válido de 8 dígitos para buscar.",
            });
            return;
        }

        setIsSearchingDni(true);

        try {
            // TODO: Integrar llamada a la API de RENIEC / Backend
            setTimeout(() => {
                const simulatedData = {
                    firstName: "ANGEL EMILIO",
                    paternalSurname: "GALA",
                    maternalSurname: "FLORES",
                };

                form.setValue("firstName", simulatedData.firstName, { shouldValidate: true });
                form.setValue("paternalSurname", simulatedData.paternalSurname, { shouldValidate: true });
                form.setValue("maternalSurname", simulatedData.maternalSurname, { shouldValidate: true });
                setIsSearchingDni(false);
            }, 800);
        } catch (error) {
            console.error("Error al consultar DNI:", error);
            setIsSearchingDni(false);
        }
    };

    // 3. Submit Handler
    const onSubmit = async (data: RegisterFormValues) => {
        setIsSubmitting(true);

        const fullName = `${data.firstName} ${data.paternalSurname} ${data.maternalSurname}`.trim();

        const userPayload = {
            ...data,
            fullName,
        };

        console.log("Payload para Backend enviado exitosamente:", userPayload);

        /*
        // TODO: Enviar al Backend cuando esté listo
        try {
            const response = await fetch("https://api.servitec.pe/v1/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userPayload),
            });
            if (response.ok) {
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Error al registrar:", error);
        } finally {
            setIsSubmitting(false);
        }
        */

        setTimeout(() => {
            setIsSubmitting(false);
            alert("Registro enviado a la consola.");
        }, 1000);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex flex-col items-center gap-2 text-center pb-2">
                        <Link href="/" className="flex flex-col items-center gap-2">
                            <div className="relative size-16 flex items-center justify-center">
                                <Image
                                    src="/logo.jpg"
                                    alt="Servitec Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                        <h2 className="text-xl font-bold tracking-tight text-foreground">
                            Crea tu cuenta en Servitec Time
                        </h2>
                    </div>

                    <FieldGroup className="space-y-3">
                        {/* Campo DNI con botón de Búsqueda */}
                        <Controller
                            name="document.number"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="dni-number" className="text-xs font-bold text-foreground">
                                        Número de DNI
                                    </FieldLabel>
                                    <div className="flex gap-2">
                                        <Input
                                            {...field}
                                            id="dni-number"
                                            maxLength={8}
                                            placeholder="87654321"
                                            aria-invalid={fieldState.invalid}
                                            className="h-10 text-sm bg-background/50 border-input font-mono"
                                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleSearchDni}
                                            disabled={isSearchingDni || field.value.length !== 8}
                                            className="h-10 px-3 shrink-0 gap-1.5 font-semibold text-xs"
                                        >
                                            {isSearchingDni ? (
                                                <Loader2 className="size-4 animate-spin text-primary" />
                                            ) : (
                                                <Search className="size-4 text-primary" />
                                            )}
                                            <span>Buscar</span>
                                        </Button>
                                    </div>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Nombres */}
                        <Controller
                            name="firstName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="first-name" className="text-xs font-medium text-muted-foreground">
                                        Nombres
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="first-name"
                                        placeholder="Nombres completados"
                                        aria-invalid={fieldState.invalid}
                                        className="h-10 text-xs bg-background/50"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Apellidos Paterno y Materno */}
                        <div className="grid grid-cols-2 gap-2">
                            <Controller
                                name="paternalSurname"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="paternal-surname" className="text-xs font-medium text-muted-foreground">
                                            Apellido Paterno
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="paternal-surname"
                                            placeholder="Apellido Paterno"
                                            aria-invalid={fieldState.invalid}
                                            className="h-10 text-xs bg-background/50"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="maternalSurname"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="maternal-surname" className="text-xs font-medium text-muted-foreground">
                                            Apellido Materno
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="maternal-surname"
                                            placeholder="Apellido Materno"
                                            aria-invalid={fieldState.invalid}
                                            className="h-10 text-xs bg-background/50"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>

                        {/* Teléfono Móvil */}
                        <Controller
                            name="phone.number"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="phone-number" className="text-xs font-bold text-foreground">
                                        Teléfono Móvil
                                    </FieldLabel>
                                    <div className="flex gap-2">
                                        <Controller
                                            name="phone.prefix"
                                            control={form.control}
                                            render={({ field: prefixField }) => (
                                                <Select value={prefixField.value} onValueChange={prefixField.onChange}>
                                                    <SelectTrigger className="h-10 w-28 bg-background/50 border-input text-xs">
                                                        <SelectValue placeholder="Código" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-card border-border">
                                                        <SelectGroup>
                                                            <SelectLabel>Países</SelectLabel>
                                                            {countryCodes.map((country) => (
                                                                <SelectItem key={country.code} value={country.dial_code}>
                                                                    {country.code} {country.dial_code}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <Input
                                            {...field}
                                            id="phone-number"
                                            type="tel"
                                            placeholder="987654321"
                                            aria-invalid={fieldState.invalid}
                                            className="h-10 text-xs bg-background/50 flex-1"
                                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                                        />
                                    </div>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Género */}
                        <Controller
                            name="gender"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-xs font-bold text-foreground">
                                        Género
                                    </FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="h-10 bg-background/50 border-input text-xs">
                                            <SelectValue placeholder="Selecciona género" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border">
                                            <SelectItem value="MALE" className="text-xs">Masculino</SelectItem>
                                            <SelectItem value="FEMALE" className="text-xs">Femenino</SelectItem>
                                            <SelectItem value="OTHER" className="text-xs">Otro / Prefiero no decir</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    {/* Botón de Submit */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full font-semibold transition-all hover:opacity-90 active:scale-[0.99] h-10 mt-2"
                    >
                        {isSubmitting ? "Registrando..." : "Completar Registro"}
                    </Button>
                </div>
            </form>

            <div className="flex flex-col gap-3 px-4 text-center">
                <p className="text-xs text-muted-foreground">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                    >
                        Inicia Sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}