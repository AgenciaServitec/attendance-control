"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Step1IdentityForm } from "@/components/login/step1-identity-form";
import { Step2OtpForm } from "@/components/login/step2-otp-form";
import { useRouter } from "next/navigation";
import { sendLoginOtp, verifyLoginOtp } from "@/app/actions/auth-actions";

const GREETINGS = [
  "¡Listos para registrar tu día!",
  "¡Haz que cada minuto cuente!",
  "¡Qué bueno verte por aquí!",
  "¡Registra tu asistencia de hoy!",
];

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");

  const [activeIdentifier, setActiveIdentifier] = useState("");
  const [isEmailType, setIsEmailType] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const [greetingIndex, setGreetingIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const [resendTimer, setResendTimer] = useState(30);

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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 2 && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, resendTimer]);

  const loginStep1PhoneSchema = z.object({
    countryCode: z.string().min(1, "Selecciona un código."),
    phoneNumber: z
      .string()
      .min(9, "Mínimo 9 dígitos")
      .max(9, "Máximo 9 dígitos")
      .regex(/^\d+$/, "Solo números"),
    email: z.string().optional(),
    otp: z.string().optional(),
  });

  const loginStep1EmailSchema = z.object({
    countryCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z
      .string()
      .min(1, "Campo obligatorio")
      .trim()
      .toLowerCase()
      .email("Correo inválido"),
    otp: z.string().optional(),
  });

  const loginStep2Schema = z.object({
    countryCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().optional(),
    otp: z.string().length(6, "El código OTP debe tener 6 dígitos."),
  });

  const activeSchema =
    currentStep === 2
      ? loginStep2Schema
      : authMethod === "phone"
        ? loginStep1PhoneSchema
        : loginStep1EmailSchema;

  type FormData = z.infer<typeof activeSchema>;

  const { handleSubmit, control, watch, trigger } = useForm<FormData>({
    resolver: zodResolver(activeSchema),
    defaultValues: {
      countryCode: "+51",
      phoneNumber: "",
      email: "",
      otp: "",
    },
  });

  const handleSendOtp = (data: { identifier: string }) => {
    setServerError(null);
    startTransition(async () => {
      const res = await sendLoginOtp({ identifier: data.identifier });

      if (res.error) {
        setServerError(res.error);
        return;
      }

      setActiveIdentifier(data.identifier);
      setIsEmailType(!!res.isEmail);
      setCurrentStep(2);
    });
  };

  const handleVerifyOtp = (data: { token: string }) => {
    setServerError(null);
    startTransition(async () => {
      const res = await verifyLoginOtp({
        identifier: activeIdentifier,
        token: data.token,
      });

      if (res.error) {
        setServerError(res.error);
        return;
      }

      router.push("/dashboard");
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="relative size-20 flex items-center justify-center">
            <Image
              src="/logo.png"
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

        {currentStep === 1 && (
          <Step1IdentityForm
            method={authMethod}
            onSetMethod={setAuthMethod}
            onHandleSendOtp={handleSendOtp}
          />
        )}

        {currentStep === 2 && (
          <Step2OtpForm
            method={authMethod}
            onSetMethod={setAuthMethod}
            onSetCurrentStep={setCurrentStep}
            onHandleVerifyOtp={handleVerifyOtp}
          />
        )}
      </div>

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
