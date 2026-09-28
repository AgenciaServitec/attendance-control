"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CountryCodes from "../../data-list/countries.json";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useRegisterStore } from "@/store/user-register-store";

const schema = z.object({
  documentNumber: z
    .string()
    .min(8, "Mínimo 8 dígitos")
    .max(8, "Máximo 8 dígitos"),
  firstName: z.string(),
  paternalSurname: z.string(),
  maternalSurname: z.string(),
  countryCode: z.string(),
  phoneNumber: z.string().min(9, "Mínimo 9 dígitos").max(9, "Mínimo 9 dígitos"),
  email: z.string().trim().lowercase().pipe(z.email()),
});

export function Step1PersonalInformationForm() {
  const [isSearchingDni, setIsSearchingDni] = useState(false);
  const { formData, updateFormData, setStep } = useRegisterStore();

  const { handleSubmit, control } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      documentNumber: formData.documentNumber || "",
      firstName: formData.firstName || "",
      paternalSurname: formData.paternalSurname || "",
      maternalSurname: formData.maternalSurname || "",
      countryCode: "+51",
      phoneNumber: formData.phoneNumber || "",
      email: formData.email || "",
    },
  });

  const onSubmit = (formData: z.infer<typeof schema>) => {
    updateFormData({ ...formData, documentType: "dni" });
    setStep(2);
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldLegend>Datos Personales</FieldLegend>
        <FieldGroup>
          <Controller
            name="documentNumber"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState?.invalid}>
                <FieldLabel
                  htmlFor="documentNumber"
                  className="text-xs font-semibold"
                >
                  DNI
                </FieldLabel>
                <div className="grid grid-cols-4 gap-3">
                  <Input
                    {...field}
                    id="documentNumber"
                    aria-invalid={fieldState?.invalid}
                    className="col-span-3"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="px-3 shrink-0 gap-1.5 font-semibold text-xs uppercase col-span-1"
                  >
                    {isSearchingDni ? (
                      <Loader2 className="size-3.5 animate-spin text-primary" />
                    ) : (
                      <Search className="size-3.5 text-primary" />
                    )}
                    <span>Buscar</span>
                  </Button>
                </div>
                {fieldState?.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState?.invalid}>
                <FieldLabel
                  htmlFor="firstName"
                  className="text-xs font-semibold"
                >
                  Nombres
                </FieldLabel>
                <Input
                  {...field}
                  id="firstName"
                  aria-invalid={fieldState?.invalid}
                />
                {fieldState?.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="paternalSurname"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState?.invalid}>
                  <FieldLabel
                    htmlFor="paternalSurname"
                    className="text-xs font-semibold"
                  >
                    Apellido Paterno
                  </FieldLabel>
                  <Input
                    {...field}
                    id="paternalSurname"
                    aria-invalid={fieldState?.invalid}
                  />
                  {fieldState?.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="maternalSurname"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState?.invalid}>
                  <FieldLabel
                    htmlFor="maternalSurname"
                    className="text-xs font-semibold"
                  >
                    Apellido Materno
                  </FieldLabel>
                  <Input
                    {...field}
                    id="maternalSurname"
                    aria-invalid={fieldState?.invalid}
                  />
                  {fieldState?.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Controller
              name="countryCode"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState?.invalid}
                  className="col-span-1"
                >
                  <FieldLabel
                    htmlFor="countryCode"
                    className="text-xs font-semibold"
                  >
                    Código de país
                  </FieldLabel>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="countryCode"
                      aria-invalid={fieldState?.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {CountryCodes.map((country) => (
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
                  {fieldState?.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="phoneNumber"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState?.invalid}
                  className="col-span-3"
                >
                  <FieldLabel
                    htmlFor="phoneNumber"
                    className="text-xs font-semibold"
                  >
                    Número de celular
                  </FieldLabel>
                  <Input
                    {...field}
                    id="phoneNumber"
                    aria-invalid={fieldState?.invalid}
                    type="tel"
                  />
                  {fieldState?.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState?.invalid}>
                <FieldLabel htmlFor="email" className="text-xs font-semibold">
                  Correo electrónico
                </FieldLabel>
                <Input
                  {...field}
                  type="email"
                  id="email"
                  aria-invalid={fieldState?.invalid}
                />
                {fieldState?.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <Button type="submit" className="w-full mt-6 font-semibold text-xs">
        <span>Continuar</span>
        <ChevronRight className="size-4" />
      </Button>
    </form>
  );
}
