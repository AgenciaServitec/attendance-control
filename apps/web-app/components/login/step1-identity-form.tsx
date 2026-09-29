import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import countryCodes from "@/data-list/countries.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Social } from "@/components/login/Social";
import { Dispatch, SetStateAction } from "react";

interface Props {
  method: "phone" | "email";
  onSetMethod: Dispatch<SetStateAction<"phone" | "email">>;
  onHandleSendOtp: (data: { identifier: string }) => void;
}

const getIdentitySchema = (method: "phone" | "email") => {
  return z.object({
    countryCode:
      method === "phone"
        ? z.string().min(1, "Campo obligatorio")
        : z.string().optional(),
    phoneNumber:
      method === "phone"
        ? z.string().min(9, "Mínimo 9 dígitos").max(9, "Mínimo 9 dígitos")
        : z.string().optional(),
    email:
      method === "email"
        ? z.string().trim().lowercase().pipe(z.email())
        : z.string().optional(),
  });
};

export function Step1IdentityForm({
  method,
  onSetMethod,
  onHandleSendOtp,
}: Props) {
  const schema = getIdentitySchema(method);

  const { handleSubmit, control } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      countryCode: "+51",
      phoneNumber: "",
      email: "",
    },
  });

  const onSubmit = (formData: z.infer<typeof schema>) => {
    let identifier = "";

    if (method === "phone") {
      const code = formData.countryCode || "+51";
      const phone = formData.phoneNumber?.trim() || "";
      const cleanPhone = phone.startsWith("+") ? phone : `${code}${phone}`;
      identifier = cleanPhone;
    } else {
      identifier = formData.email?.trim() || "";
    }

    if (!identifier) return;

    onHandleSendOtp({ identifier });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {method === "phone" ? (
          <div className="grid grid-cols-4 gap-3">
            <Controller
              name="countryCode"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-1">
                  <FieldLabel
                    htmlFor="countryCode"
                    className="text-xs font-semibold"
                  >
                    Código de país
                  </FieldLabel>

                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="countryCode"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
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

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="phoneNumber"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-3">
                  <FieldLabel
                    htmlFor="phoneNumber"
                    className="text-xs font-semibold"
                  >
                    Número de teléfono
                  </FieldLabel>

                  <Input
                    {...field}
                    id="phoneNumber"
                    aria-invalid={fieldState.invalid}
                    type="tel"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        ) : (
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email" className="text-xs font-semibold">
                  Correo electrónico
                </FieldLabel>
                <Input
                  {...field}
                  id="email"
                  aria-invalid={fieldState.invalid}
                  type="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        <Button
          type="submit"
          className="w-full font-semibold transition-all hover:opacity-90 active:scale-[0.99] mt-3"
        >
          Continuar
        </Button>
      </form>

      <div>
        <div className="relative text-center text-xs mt-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <span className="relative bg-background px-2 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">
            O
          </span>
        </div>
        <Social method={method} onSetMethod={onSetMethod} />
      </div>
    </div>
  );
}
