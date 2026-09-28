"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, QrCode } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import countryCodes from "../data-list/countries.json";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import Link from "next/link";

const GREETINGS = [
  "¡Listos para registrar tu día!",
  "¡Haz que cada minuto cuente!",
  "¡Qué bueno verte por aquí!",
  "¡Registra tu asistencia de hoy!",
];

const getLoginSchema = (method: "phone" | "email") => {
  return z.object({
    countryCode:
      method === "phone"
        ? z.string().min(1, "Campo obligatorio")
        : z.string().optional(),
    phoneNumber:
      method === "phone"
        ? z.string().min(9, "Mínimo 9 dígitos").max(9, "Máximo 9 dígitos")
        : z.string().optional(),
    email:
      method === "phone"
        ? z.string().optional()
        : z.string().trim().toLowerCase().pipe(z.email("Campo obligatorio")),
  });
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setGreetingIndex((prevIndex) => (prevIndex + 1) % GREETINGS.length);
        setFade(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const schema = getLoginSchema(authMethod);

  const { handleSubmit, control } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { countryCode: "+51", phoneNumber: "" },
  });

  const onSubmit = (formData: z.infer<typeof schema>) => {
    console.log("formData: ", formData);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="relative size-20 flex items-center justify-center">
              <Image
                src="/logo.jpg"
                alt="Servitec Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h2
              className={cn(
                "text-xl font-bold tracking-tight text-foreground transition-opacity duration-300 min-h-[28px]",
                fade ? "opacity-100" : "opacity-0",
              )}
            >
              {GREETINGS[greetingIndex]}
            </h2>
          </div>

          {authMethod === "phone" ? (
            <div className="grid grid-cols-4 gap-3">
              <Controller
                name="countryCode"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
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
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-3"
                  >
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
            className="w-full font-semibold transition-all hover:opacity-90 active:scale-[0.99]"
          >
            Continuar
          </Button>

          <div className="relative text-center text-xs">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <span className="relative bg-background px-2 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">
              O
            </span>
          </div>

          <div className="grid gap-2">
            <Button
              variant="outline"
              type="button"
              className="w-full justify-center bg-secondary/40 hover:bg-secondary/80 border-border/80 text-foreground h-10 font-normal transition-colors"
              onClick={() => console.log("Google Auth")}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 16 16">
                <path d="M0 0h16v16H0z" fill="none" />
                <path
                  fill="#f44336"
                  d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
                  opacity=".987"
                />
                <path
                  fill="#ffc107"
                  d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
                  opacity=".997"
                />
                <path
                  fill="#448aff"
                  d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
                  opacity=".999"
                />
                <path
                  fill="#43a047"
                  d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
                  opacity=".993"
                />
              </svg>
              Continuar con Google
            </Button>

            <Button
              variant="outline"
              type="button"
              className="w-full justify-center bg-secondary/40 hover:bg-secondary/80 border-border/80 text-foreground h-10 font-normal transition-colors"
              onClick={() => console.log("Apple Auth")}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 32 32">
                <path d="M0 0h32v32H0z" fill="none" />
                <path
                  fill="#000000"
                  d="M25.425 26.498c-1.162 1.736-2.394 3.43-4.27 3.458c-1.875.042-2.477-1.106-4.605-1.106c-2.142 0-2.8 1.078-4.578 1.148c-1.834.07-3.22-1.848-4.396-3.542C5.183 23 3.35 16.63 5.813 12.346a6.84 6.84 0 0 1 5.767-3.514c1.792-.028 3.5 1.217 4.606 1.217c1.092 0 3.164-1.497 5.334-1.273a6.5 6.5 0 0 1 5.095 2.771a6.38 6.38 0 0 0-3.01 5.334a6.18 6.18 0 0 0 3.752 5.656a15.5 15.5 0 0 1-1.932 3.961M17.432 4.1A6.36 6.36 0 0 1 21.548 2a6.13 6.13 0 0 1-1.456 4.466a5.11 5.11 0 0 1-4.13 1.988a5.98 5.98 0 0 1 1.47-4.354"
                />
              </svg>
              Continuar con Apple
            </Button>

            <Button
              variant="outline"
              type="button"
              className="w-full justify-center bg-secondary/40 hover:bg-secondary/80 border-border/80 text-foreground h-10 font-normal transition-colors"
              onClick={() =>
                setAuthMethod(authMethod === "phone" ? "email" : "phone")
              }
            >
              {authMethod === "phone" ? (
                <>
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  Continuar con Email
                </>
              ) : (
                <>
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  Continuar con Teléfono
                </>
              )}
            </Button>

            <Button
              variant="outline"
              type="button"
              className="w-full justify-center bg-secondary/40 hover:bg-secondary/80 border-border/80 text-foreground h-10 font-normal transition-colors"
              onClick={() => console.log("Login QR")}
            >
              <QrCode className="mr-2 h-4 w-4 text-muted-foreground" />
              Acceso rápido con código QR
            </Button>
          </div>
        </div>
      </form>

      <div className="flex flex-col gap-3 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
          >
            Regístrate
          </Link>
        </p>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Al hacer clic en continuar, aceptas nuestros{" "}
          <a
            href="#"
            className="text-foregroundunderline underline-offset-4 hover:text-primary transition-colors"
          >
            Términos de Servicio
          </a>{" "}
          y{" "}
          <a
            href="#"
            className="text-foregroundunderline underline-offset-4 hover:text-primary transition-colors"
          >
            Políticas de Privacidad
          </a>
          .
        </p>
      </div>
    </div>
  );
}
