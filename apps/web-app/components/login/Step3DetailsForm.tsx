import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ChevronLeft, Loader2, Save, Search } from "lucide-react";
import { useState } from "react";

interface Props {
  currentStep: number;
  onHandleNextStep: () => void;
  onHandlePrevStep: () => void;
}

const schema = z.object({
  companyRuc: z
    .string()
    .min(11, "Mínimo 11 dígitos")
    .max(11, "Máximo 11 dígitos"),
  companyBusinessName: z.string(),
  invitationCode: z
    .string()
    .min(8, "Mínimo 8 dígitos")
    .max(8, "Máximo 8 dígitos"),
});

export function Step3DetailsForm({
  currentStep,
  onHandleNextStep,
  onHandlePrevStep,
}: Props) {
  const [isSearchingRuc, setIsSearchingRuc] = useState(false);
  const [activeTab, setActiveTab] = useState<"create_company" | "join_company">(
    "create_company",
  );

  const { handleSubmit, control } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyRuc: "",
      companyBusinessName: "",
      invitationCode: "",
    },
  });

  const onSubmit = (formData: z.infer<typeof schema>) => {
    onHandleNextStep();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {activeTab === "create_company" ? (
        <FieldSet>
          <FieldLegend>Datos de la Organización</FieldLegend>
          <FieldGroup>
            <Controller
              name="companyRuc"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState?.invalid}>
                  <FieldLabel
                    htmlFor="companyRuc"
                    className="text-xs font-semibold"
                  >
                    RUC
                  </FieldLabel>
                  <div className="grid grid-cols-4 gap-3">
                    <Input
                      {...field}
                      id="companyRuc"
                      aria-invalid={fieldState?.invalid}
                      className="col-span-3"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="px-3 shrink-0 gap-1.5 font-semibold text-xs col-span-1"
                    >
                      {isSearchingRuc ? (
                        <Loader2 className="size-3.5 animate-spin text-primary" />
                      ) : (
                        <Search className="size-3.5 text-primary" />
                      )}
                      <span>BUSCAR</span>
                    </Button>
                  </div>
                  {fieldState?.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="companyBusinessName"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState?.invalid}>
                  <FieldLabel
                    htmlFor="business-name"
                    className="text-xs font-semibold"
                  >
                    Razón Social
                  </FieldLabel>
                  <Input
                    {...field}
                    id="business-name"
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
      ) : (
        <FieldSet>
          <FieldLegend>Código de Invitación</FieldLegend>
          <FieldGroup>
            <Controller
              name="invitationCode"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState?.invalid}>
                  <FieldLabel
                    htmlFor="invitationCode"
                    className="text-xs font-semibold"
                  >
                    Ingresa tu código
                  </FieldLabel>
                  <Input
                    {...field}
                    id="invitationCode"
                    aria-invalid={fieldState?.invalid}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                  {fieldState?.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>
      )}

      <div className="grid grid-cols-2 mt-6 gap-3">
        <Button
          variant="outline"
          onClick={onHandlePrevStep}
          className="w-full font-semibold text-xs"
        >
          <ChevronLeft className="size-4" />
          <span>Anterior</span>
        </Button>

        <Button type="submit" className="w-full font-semibold text-xs">
          <Save className="size-4" />
          <span>Registrarme</span>
        </Button>
      </div>
    </form>
  );
}
