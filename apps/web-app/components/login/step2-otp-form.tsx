import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft, RefreshCw, ShieldUser } from "lucide-react";

interface Props {
  method: "phone" | "email";
  onSetMethod: Dispatch<SetStateAction<"phone" | "email">>;
  onSetCurrentStep: Dispatch<SetStateAction<1 | 2>>;
  onHandleVerifyOtp: (data: { token: string }) => void;
}

const schema = z.object({
  otp: z.string().min(6, "Mínimo 6 dígitos").max(6, "Mínimo 6 dígitos"),
});

export function Step2OtpForm({
  method,
  onSetMethod,
  onSetCurrentStep,
  onHandleVerifyOtp,
}: Props) {
  const { handleSubmit, control, watch, trigger } = useForm<
    z.infer<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (formData: z.infer<typeof schema>) => {
    onHandleVerifyOtp({ token: formData.otp });
    console.log("submit");
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Controller
          name="otp"
          control={control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col items-center gap-3"
            >
              <FieldLabel htmlFor="otp" className="text-xs font-semibold">
                Ingresa el código de 6 dígitos enviado a:
                {/*<p className="text-sm font-bold text-foreground mt-0.5">*/}
                {/*  {method === "phone"*/}
                {/*    ? `${formValues.countryCode} ${formValues.phoneNumber}`*/}
                {/*    : formValues.email}*/}
                {/*</p>*/}
              </FieldLabel>
              <div className="flex justify-center">
                <InputOTP
                  id="otp"
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator className="mx-2" />
                  <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="text-center">
          {60 > 0 ? (
            <p className="text-xs text-muted-foreground">
              Reenviar código en{" "}
              <span className="font-semibold text-foreground">{60}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => console.log("")}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 mx-auto"
            >
              <RefreshCw className="size-3" /> Reenviar código
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 mt-3 gap-3">
          <Button
            variant="outline"
            onClick={() => ""}
            className="font-semibold text-xs"
          >
            <ArrowLeft className="size-4" /> Volver
          </Button>
          <Button type="submit" className="font-semibold text-xs">
            Ingresar
            <ShieldUser className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
