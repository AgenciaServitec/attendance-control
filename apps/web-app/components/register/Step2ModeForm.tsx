import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Building2, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import { useRegisterStore } from "@/store/user-register-store";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const schema = z.object({
  registrationMethod: z.string(),
});

export function Step2ModeForm() {
  const { formData, updateFormData, setStep } = useRegisterStore();

  const { handleSubmit, control, watch } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      registrationMethod: formData.registrationMethod || "create",
    },
  });

  const selectedOption = watch("registrationMethod");

  const onSubmit = (formData: z.infer<typeof schema>) => {
    updateFormData(formData);
    setStep(3);
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldLegend className="text-xs font-semibold text-foreground">
          Selecciona una opción
        </FieldLegend>

        <Controller
          name="registrationMethod"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid grid-cols-2 gap-3 mt-2"
            >
              <label
                htmlFor="opt-create"
                className={cn(
                  "flex flex-col items-center justify-center gap-3 h-32 rounded-lg border-2 p-4 cursor-pointer transition-all",
                  "hover:bg-muted/60 active:scale-[0.98]",
                  selectedOption === "create"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                <RadioGroupItem
                  value="create"
                  id="opt-create"
                  className="sr-only"
                />
                <Building2
                  className={cn(
                    "size-7 shrink-0 transition-colors",
                    selectedOption === "create"
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
                <span className="text-xs font-bold text-center">
                  Crear Organización
                </span>
              </label>

              <label
                htmlFor="opt-join"
                className={cn(
                  "flex flex-col items-center justify-center gap-3 h-32 rounded-lg border-2 p-4 cursor-pointer transition-all",
                  "hover:bg-muted/60 active:scale-[0.98]",
                  selectedOption === "join"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                <RadioGroupItem
                  value="join"
                  id="opt-join"
                  className="sr-only"
                />
                <UserPlus
                  className={cn(
                    "size-7 shrink-0 transition-colors",
                    selectedOption === "join"
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
                <span className="text-xs font-bold text-center">
                  Unirme a Organización
                </span>
              </label>
            </RadioGroup>
          )}
        />
      </FieldSet>

      <div className="grid grid-cols-2 mt-6 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(1)}
          className="w-full font-semibold text-xs gap-1.5"
        >
          <ChevronLeft className="size-4" />
          <span>Anterior</span>
        </Button>

        <Button type="submit" className="w-full font-semibold text-xs gap-1.5">
          <span>Siguiente</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
