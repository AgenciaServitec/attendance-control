"use client";

import Image from "next/image";
import Link from "next/link";
import { Timeline, TimelineStep } from "@/components/ui/timeline";
import { Step1PersonalInformationForm } from "@/components/register/Step1PersonalInformationForm";
import { Step2ModeForm } from "@/components/register/Step2ModeForm";
import { Step3DetailsForm } from "@/components/register/Step3DetailsForm";
import { useRegisterStore } from "@/store/user-register-store";

export function RegisterForm() {
  const { formData, step } = useRegisterStore();

  const TIMELINE_STEPS: TimelineStep[] = [
    {
      id: 1,
      title: "Datos Personales",
    },
    {
      id: 2,
      title: "Modalidad",
    },
    {
      id: 3,
      title: "Detalles",
    },
  ];

  return (
    <div className="flex flex-col gap-5 max-w-md mx-auto w-full">
      <div className="flex flex-col items-center gap-2 text-center pb-1">
        <Link href="/" className="flex flex-col items-center gap-2">
          <div className="relative size-14 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Servitec Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Crea tu cuenta en Servitec Time
        </h2>
      </div>

      <Timeline steps={TIMELINE_STEPS} currentStep={step} />

      <div>
        {step === 1 && <Step1PersonalInformationForm />}

        {step === 2 && <Step2ModeForm />}

        {step === 3 && <Step3DetailsForm />}
      </div>

      <div className="flex flex-col gap-3 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
          >
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
