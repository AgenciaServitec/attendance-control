"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/use-user-store";
import {
  createOrganization,
  getOrganization,
  updateOrganization,
} from "@/app/actions/organizations-actions";
import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { isFieldRequired } from "@/lib/zod-utils";
import { IconCheck, IconCircleArrowLeft, IconCopy } from "@tabler/icons-react";
import Link from "next/link";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const schema = z.object({
  ruc: z.string().min(11, "Mínimo 11 dígitos").max(11, "Máximo 11 dígitos"),
  invitationCode: z.string(),
  businessName: z.string().min(1, "Campo Obligatorio"),
  address: z.string().min(1, "Campo Obligatorio"),
});

type Organization = z.infer<typeof schema>;

interface OrganizationForm {
  onSubmit: (formData: Organization) => void;
  isPending: boolean;
  organization: any;
  isNew: boolean;
}

export default function OrganitzationPage() {
  const { organizationId } = useParams();
  const router = useRouter();
  const [organization, setOrganization] = useState({});
  const [isPending, startTransition] = useTransition();
  const user = useUserStore((state) => state.user);

  const isNew = organizationId === "create";

  useEffect(() => {
    if (isNew) return;

    startTransition(async () => {
      const _organization = await getOrganization(organizationId as string);
      if (_organization?.data) {
        setOrganization(_organization.data);
      }
    });
  }, [organizationId, isNew]);

  const onSubmit = (formData: Organization) => {
    const payload = {
      ...formData,
      ownerId: organization?.owner_id || user?.id,
    };

    startTransition(async () => {
      const response = isNew
        ? await createOrganization(payload)
        : await updateOrganization(organization.id, payload);

      if (response.success) {
        router.push("/organizations");
        router.refresh();
      } else {
        console.error("Error al guardar:", response.error);
        alert(response.error || "Ocurrió un error inesperado.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Link href="/organizations">
          <IconCircleArrowLeft
            stroke={2}
            size={32}
            className="text-primary hover:text-primary/80 transition-colors"
          />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {isNew ? "Crear nueva organización" : "Editar organización"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isNew
              ? "Ingresa los datos principales para registrar tu empresa en la plataforma."
              : "Actualiza la información legal y de contacto de tu organización."}
          </p>
        </div>
      </div>

      <OrganizationForm
        onSubmit={onSubmit}
        isPending={isPending}
        organization={organization}
        isNew={isNew}
      />
    </div>
  );
}

const OrganizationForm = ({
  onSubmit,
  isPending,
  organization,
  isNew,
}: OrganizationForm) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { handleSubmit, control, reset } = useForm<Organization>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    reset({
      ruc: organization?.ruc || "",
      invitationCode: organization?.invitation_code || "",
      businessName: organization?.business_name || "",
      address: organization?.address || "",
    });
  }, [organization]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-6 gap-4">
      <Controller
        name="ruc"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState?.invalid} className="col-span-4">
            <FieldLabel
              htmlFor={field.name}
              className="text-xs font-semibold"
              required={isFieldRequired(schema, "ruc")}
            >
              RUC
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState?.invalid}
              placeholder="Ej. 20123456789"
            />
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="invitationCode"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState?.invalid} className="col-span-2">
            <FieldLabel
              htmlFor={field.name}
              className="text-xs font-semibold"
              required={isFieldRequired(schema, field.name)}
            >
              Código de Invitación
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                {...field}
                id={field.name}
                aria-invalid={fieldState?.invalid}
                placeholder="Se generará automáticamente"
                disabled
              />
              {organization?.invitation_code && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    className="ml-auto cursor-pointer transition-colors"
                    onClick={() => handleCopy(String(field.value || ""))}
                  >
                    {copied ? (
                      <IconCheck stroke={2} className="text-emerald-500" />
                    ) : (
                      <IconCopy stroke={2} />
                    )}
                    <span className="sr-only">
                      {copied ? "Copiado" : "Copiar"}
                    </span>
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="businessName"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState?.invalid} className="col-span-6">
            <FieldLabel
              htmlFor={field.name}
              className="text-xs font-semibold"
              required={isFieldRequired(schema, "businessName")}
            >
              Razón Social
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState?.invalid}
              placeholder="Ej. Empresa de Servicios S.A.C."
            />
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="address"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState?.invalid} className="col-span-6">
            <FieldLabel
              htmlFor={field.name}
              className="text-xs font-semibold"
              required={isFieldRequired(schema, "address")}
            >
              Dirección
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState?.invalid}
              placeholder="Ej. Av. Javier Prado Este 123, San Isidro"
            />
            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="col-span-6">
        <div className="flex flex-col lg:flex-row justify-end gap-4">
          <Button
            type="submit"
            disabled={isPending}
            className="px-8 lg:order-2"
          >
            {isPending ? "Guardando..." : isNew ? "Guardar" : "Actualizar"}
          </Button>
          <Link href="/organizations" className="lg:order-1">
            <Button
              variant="outline"
              type="button"
              disabled={isPending}
              className="w-full px-8"
            >
              Cancelar
            </Button>
          </Link>
        </div>
      </div>
    </form>
  );
};
