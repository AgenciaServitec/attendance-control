import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Building2, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import { useState } from "react";

interface Props {
  currentStep: number;
  onHandleNextStep: () => void;
  onHandlePrevStep: () => void;
}

const schema = z.object({
  documentNumber: z
    .string()
    .min(8, "Mínimo 8 dígitos")
    .max(8, "Máximo 8 dígitos"),
  firstName: z.string(),
  paternalSurname: z.string(),
  maternalSurname: z.string(),
  countryCode: "+51",
  phoneNumber: z.string().min(9, "Mínimo 9 dígitos").max(9, "Mínimo 9 dígitos"),
});

export function Step2ModeForm({
  currentStep,
  onHandleNextStep,
  onHandlePrevStep,
}: Props) {
  const [isSearchingDni, setIsSearchingDni] = useState(false);

  const { handleSubmit, control } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      documentNumber: "",
      firstName: "",
      paternalSurname: "",
      maternalSurname: "",
      countryCode: "+51",
      phoneNumber: "",
    },
  });

  const onSubmit = (formData: z.infer<typeof schema>) => {
    onHandleNextStep();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldLegend>Selecciona una opción</FieldLegend>
        <div className="grid grid-cols-2 gap-3">
          <Button className="h-32">
            <Building2 className="size-6 shrink-0" />
            <span className="text-xs font-bold">Crear Organización</span>
          </Button>
          <Button variant="outline" className="h-32">
            <UserPlus className="size-6 shrink-0" />
            <span className="text-xs font-bold">Unirme a Organización</span>
          </Button>
        </div>
      </FieldSet>

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
          <span>Siguiente</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
