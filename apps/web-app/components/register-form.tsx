"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Loader2, Search, UserPlus } from "lucide-react";
import countryCodes from "../data-list/countries.json";

const basePersonalSchema = z.object({
  document: z.object({
    type: z.literal("dni"),
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
  gender: z.enum(["male", "female", "other"], {
    message: "Selecciona un género válido.",
  }),
  status: z.enum(["active", "inactive"]),
});

const createCompanySchema = basePersonalSchema.extend({
  type: z.literal("create_company"),
  company: z.object({
    ruc: z
      .string()
      .length(11, "El RUC debe tener exactamente 11 dígitos.")
      .regex(/^\d+$/, "El RUC solo debe contener números."),
    businessName: z.string().min(3, "Ingresa la razón social de la empresa."),
    address: z.string().optional(),
    email: z
      .string()
      .email("Correo de empresa inválido.")
      .optional()
      .or(z.literal("")),
    plan: z.enum(["free", "pro", "enterprise"]),
  }),
});

const joinCompanySchema = basePersonalSchema.extend({
  type: z.literal("join_company"),
  invitationCode: z
    .string()
    .min(4, "Ingresa un código de invitación válido.")
    .toUpperCase(),
});

const registerSchema = z.discriminatedUnion("type", [
  createCompanySchema,
  joinCompanySchema,
]);

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSearchingDni, setIsSearchingDni] = useState(false);
  const [isSearchingRuc, setIsSearchingRuc] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      type: "create_company",
      document: { type: "dni", number: "" },
      firstName: "",
      paternalSurname: "",
      maternalSurname: "",
      phone: { prefix: "+51", number: "" },
      gender: "male",
      status: "active",
      company: {
        ruc: "",
        businessName: "",
        address: "",
        email: "",
        plan: "free",
      },
    },
  });

  const activeTab = form.watch("type");

  const handleTabChange = (val: string) => {
    if (val === "create_company") {
      form.setValue("type", "create_company");
      form.setValue("company", {
        ruc: "",
        businessName: "",
        address: "",
        email: "",
        plan: "free",
      });
    } else {
      form.setValue("type", "join_company");
      form.setValue("invitationCode", "");
    }
  };

  const handleSearchDni = async () => {
    const dniNumber = form.getValues("document.number");
    if (dniNumber.length !== 8) {
      form.setError("document.number", {
        type: "manual",
        message: "Ingresa un DNI válido de 8 dígitos.",
      });
      return;
    }

    setIsSearchingDni(true);
    setTimeout(() => {
      const simulatedData = {
        firstName: "ANGEL EMILIO",
        paternalSurname: "GALA",
        maternalSurname: "FLORES",
      };
      form.setValue("firstName", simulatedData.firstName, {
        shouldValidate: true,
      });
      form.setValue("paternalSurname", simulatedData.paternalSurname, {
        shouldValidate: true,
      });
      form.setValue("maternalSurname", simulatedData.maternalSurname, {
        shouldValidate: true,
      });
      setIsSearchingDni(false);
    }, 800);
  };

  const handleSearchRuc = async () => {
    if (activeTab !== "create_company") return;
    const rucNumber = form.getValues("company.ruc");
    if (rucNumber.length !== 11) {
      form.setError("company.ruc", {
        type: "manual",
        message: "Ingresa un RUC válido de 11 dígitos.",
      });
      return;
    }

    setIsSearchingRuc(true);
    setTimeout(() => {
      const simulatedRuc = {
        businessName: "SERVITEC PERU S.A.C.",
        address: "AV. JAVIER PRADO ESTE 1234, LIMA",
      };
      form.setValue("company.businessName", simulatedRuc.businessName, {
        shouldValidate: true,
      });
      form.setValue("company.address", simulatedRuc.address, {
        shouldValidate: true,
      });
      setIsSearchingRuc(false);
    }, 800);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);

    const fullName =
      `${data.firstName} ${data.paternalSurname} ${data.maternalSurname}`.trim();

    const userPayload = {
      ...data,
      fullName,
    };

    console.log("Payload enviado al Backend:", userPayload);

    /*
        // TODO: Enviar al Backend cuando esté desplegado
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
      alert("Registro capturado. Revisa la consola.");
    }, 1000);
  };

  return (
    <div className={cn("flex flex-col gap-5", className)} {...props}>
      <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 text-center pb-1">
            <Link href="/" className="flex flex-col items-center gap-2">
              <div className="relative size-14 flex items-center justify-center">
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

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-muted/60">
              <TabsTrigger
                value="create_company"
                className="text-xs font-bold data-[state=active]:bg-card data-[state=active]:text-primary"
              >
                <Building2 className="size-3.5 shrink-0" />
                <span>Crear Empresa</span>
              </TabsTrigger>
              <TabsTrigger
                value="join_company"
                className="text-xs font-bold data-[state=active]:bg-card data-[state=active]:text-primary"
              >
                <UserPlus className="size-3.5 shrink-0" />
                <span>Unirme a Empresa</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "create_company" && (
            <div className="space-y-4">
              <Controller
                name="companyRuc"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="company-ruc"
                      className="text-xs font-semibold"
                    >
                      RUC de la Empresa
                    </FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        id="company-ruc"
                        maxLength={11}
                        aria-invalid={fieldState.invalid}
                        onChange={(e) =>
                          field.onChange(e.target.value.replace(/\D/g, ""))
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSearchRuc}
                        disabled={isSearchingRuc || field.value?.length !== 11}
                        className="px-3 shrink-0 gap-1.5 font-semibold text-xs"
                      >
                        {isSearchingRuc ? (
                          <Loader2 className="size-3.5 animate-spin text-primary" />
                        ) : (
                          <Search className="size-3.5 text-primary" />
                        )}
                        <span>SUNAT</span>
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="companyBusinessName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="business-name"
                      className="text-xs font-semibold"
                    >
                      Razón Social
                    </FieldLabel>
                    <Input
                      {...field}
                      id="business-name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          )}

          {activeTab === "join_company" && (
            <Controller
              name="invitationCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="invitation-code"
                    className="text-xs font-semibold"
                  >
                    Código de Invitación
                  </FieldLabel>
                  <Input
                    {...field}
                    id="invitation-code"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          <Controller
            name="document.number"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="dni-number"
                  className="text-xs font-semibold text-foreground"
                >
                  DNI del Titular
                </FieldLabel>
                <div className="flex gap-2">
                  <Input
                    {...field}
                    id="dni-number"
                    maxLength={8}
                    placeholder="87654321"
                    aria-invalid={fieldState.invalid}
                    className="bg-background/50 font-mono"
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ""))
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSearchDni}
                    disabled={isSearchingDni || field.value.length !== 8}
                    className="px-3 shrink-0 gap-1.5 font-semibold text-xs"
                  >
                    {isSearchingDni ? (
                      <Loader2 className="size-3.5 animate-spin text-primary" />
                    ) : (
                      <Search className="size-3.5 text-primary" />
                    )}
                    <span>Buscar</span>
                  </Button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="first-name"
                  className="text-xs font-semibold"
                >
                  Nombres
                </FieldLabel>
                <Input
                  {...field}
                  id="first-name"
                  placeholder="Nombres completados"
                  aria-invalid={fieldState.invalid}
                  className="bg-background/50"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <Controller
              name="paternalSurname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="paternal-surname"
                    className="text-xs font-semibold"
                  >
                    Apellido Paterno
                  </FieldLabel>
                  <Input
                    {...field}
                    id="paternal-surname"
                    placeholder="Apellido Paterno"
                    aria-invalid={fieldState.invalid}
                    className="bg-background/50"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="maternalSurname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="maternal-surname"
                    className="text-xs font-semibold"
                  >
                    Apellido Materno
                  </FieldLabel>
                  <Input
                    {...field}
                    id="maternal-surname"
                    placeholder="Apellido Materno"
                    aria-invalid={fieldState.invalid}
                    className="bg-background/50"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="phoneNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="phone-number"
                  className="text-xs font-semibold"
                >
                  Teléfono Móvil
                </FieldLabel>
                <div className="flex gap-2">
                  <Controller
                    name="countryCode"
                    control={form.control}
                    render={({ field: prefixField }) => (
                      <Select
                        value={prefixField.value}
                        onValueChange={prefixField.onChange}
                      >
                        <SelectTrigger className="w-28 bg-background/50 border-input text-xs">
                          <SelectValue placeholder="Código" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectGroup>
                            <SelectLabel>Países</SelectLabel>
                            {countryCodes.map((country) => (
                              <SelectItem
                                key={country.code}
                                value={country.dial_code}
                              >
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
                    placeholder="Número de teléfono móvil"
                    aria-invalid={fieldState.invalid}
                    className="bg-background/50 flex-1"
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="gender"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs font-semibold">
                  Género
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Selecciona género" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="male" className="text-xs">
                      Masculino
                    </SelectItem>
                    <SelectItem value="female" className="text-xs">
                      Femenino
                    </SelectItem>
                    <SelectItem value="other" className="text-xs">
                      Otro / Prefiero no decir
                    </SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-semibold transition-all hover:opacity-90 active:scale-[0.99] h-10 mt-2"
          >
            {isSubmitting
              ? "Registrando..."
              : activeTab === "create_company"
                ? "Crear Empresa y Registrarse"
                : "Unirme a Empresa"}
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
