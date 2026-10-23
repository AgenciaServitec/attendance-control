"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/use-user-store";
import { createOrganization } from "@/app/actions/organizations-actions";
import { useTransition } from "react";

const schema = z.object({
  ruc: z.string().min(11, "Mínimo 11 dígitos").max(11, "Máximo 11 dígitos"),
  businessName: z.string().min(1, "Campo Obligatorio"),
  address: z.string().min(1, "Campo Obligatorio"),
});

type Organization = z.infer<typeof schema>;

interface OrganizationForm {
  onSubmit: (formData: Organization) => void;
  isPending: boolean;
}

export default function OrganitzationPage() {
  const [isPending, startTransition] = useTransition();
  const user = useUserStore((state) => state.user);

  const onSubmit = (formData: Organization) => {
    const organization = {
      ...formData,
      ownerId: user?.id,
    };

    startTransition(async () => {
      const result = await createOrganization(organization);

      if (result.error) {
        alert(result.error);
        return;
      }
    });
  };

  return <OrganizationForm onSubmit={onSubmit} isPending={isPending} />;
}

const OrganizationForm = ({ onSubmit, isPending }: OrganizationForm) => {
  const { handleSubmit, control } = useForm<Organization>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Controller
        name="ruc"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState?.invalid}>
            <FieldLabel htmlFor="ruc" className="text-xs font-semibold">
              RUC
            </FieldLabel>
            <Input {...field} id="ruc" aria-invalid={fieldState?.invalid} />
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="businessName"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState?.invalid}>
            <FieldLabel
              htmlFor="businessName"
              className="text-xs font-semibold"
            >
              Razón Social
            </FieldLabel>
            <Input
              {...field}
              id="businessName"
              aria-invalid={fieldState?.invalid}
            />
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="address"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState?.invalid}>
            <FieldLabel htmlFor="address" className="text-xs font-semibold">
              Dirección
            </FieldLabel>
            <Input {...field} id="address" aria-invalid={fieldState?.invalid} />
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={isPending}>
        <span>Guardar</span>
      </Button>
    </form>
  );
};
