"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { getProfile } from "@/app/actions/profiles-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  role: z.enum(["super_admin", "admin", "user"], "Seleccione un Rol"),
  firstName: z.string().min(1, "Campo obligatorio"),
  paternalSurname: z.string().min(1, "Campo obligatorio"),
  maternalSurname: z.string().min(1, "Campo obligatorio"),
  documentType: z.enum(["dni"], "Seleccione un tipo de documento"),
  documentNumber: z
    .string()
    .min(8, "Mínimo 8 dígitos")
    .max(8, "Mínimo 8 dígitos"),
  email: z
    .string()
    .min(1, "Campo obligatorio")
    .toLowerCase()
    .trim()
    .pipe(z.email("Formato de correo incorrecto")),
  countryCode: z.string().min(1, "Campo obligatorio"),
  phoneNumber: z.string().min(1, "Campo obligatorio"),
});

type User = z.infer<typeof schema>;

export default function UserPage() {
  const [user, setUser] = useState();
  const [isPending, startTransition] = useTransition();
  const { userId } = useParams();

  useEffect(() => {
    startTransition(async () => {
      const _user = await getProfile(userId);
      setUser(_user.data);
    });
  }, []);

  console.log("user", user);

  const onSubmit = (formData) => {
    console.log("formData: ", formData);
  };

  if (isPending) return <p>Cargando...</p>;

  return <UserForm user={user} onSubmit={onSubmit} />;
}

const UserForm = ({ user, onSubmit }) => {
  const { handleSubmit, control, reset } = useForm<User>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    reset({
      firstName: user?.first_name || "",
      paternalSurname: user?.paternal_surname || "",
      maternalSurname: user?.maternal_surname || "",
      documentType: user?.document_type || "",
      documentNumber: user?.document_number || "",
      countryCode: user?.country_code || "",
      phoneNumber: user?.phone_number || "",
    });
  }, [user]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-6 gap-4">
      <Controller
        name="role"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState?.invalid} className="col-span-6">
            <FieldLabel htmlFor={field.name}>Nombres</FieldLabel>
            <Select
              value={field.value || undefined}
              onValueChange={field.onChange}
            >
              <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Código" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Administrador</SelectItem>
              </SelectContent>
            </Select>
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="firstName"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState?.invalid} className="col-span-6">
            <FieldLabel htmlFor={field.name}>Nombres</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState?.invalid}
            />
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="paternalSurname"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState?.invalid} className="col-span-6">
            <FieldLabel htmlFor={field.name}>Apellido Paterno</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState?.invalid}
            />
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="maternalSurname"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState?.invalid} className="col-span-6">
            <FieldLabel htmlFor={field.name}>Apellido Materno</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState?.invalid}
            />
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="documentType"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState?.invalid} className="col-span-6">
            <FieldLabel htmlFor={field.name}>Tipo de Documento</FieldLabel>
            <Select
              value={field.value || undefined}
              onValueChange={field.onChange}
            >
              <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Seleccione un tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dni">DNI</SelectItem>
              </SelectContent>
            </Select>
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="documentNumber"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState?.invalid} className="col-span-6">
            <FieldLabel htmlFor={field.name}>Número de Documento</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState?.invalid}
            />
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="countryCode"
        control={control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState?.invalid}
            className="col-span-6 lg:col-span-1"
          >
            <FieldLabel htmlFor={field.name}>Código de País</FieldLabel>
            <Select
              value={field.value || undefined}
              onValueChange={field.onChange}
            >
              <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Código" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+51">+51</SelectItem>
              </SelectContent>
            </Select>
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="phoneNumber"
        control={control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState?.invalid}
            className="col-span-6 lg:col-span-5"
          >
            <FieldLabel htmlFor={field.name}>Número de Celular</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState?.invalid}
            />
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="col-span-6">
        <div className="flex flex-col lg:flex-row lg:justify-end gap-4">
          <Button className="px-8 lg:order-2">Actualizar</Button>
          <Button variant="outline" className="px-8 lg:order-1">
            Cancelar
          </Button>
        </div>
      </div>
    </form>
  );
};
