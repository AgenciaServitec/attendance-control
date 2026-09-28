"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Timeline, TimelineStep } from "@/components/ui/timeline";
import { Step1PersonalInformationForm } from "@/components/login/Step1PersonalInformationForm";
import { Step2ModeForm } from "@/components/login/Step2ModeForm";
import { Step3DetailsForm } from "@/components/login/Step3DetailsForm";

const basePersonalSchema = z.object({
  document: z.object({
    type: z.literal("dni"),
    number: z
      .string()
      .length(8, "El DNI debe tener exactamente 8 dígitos.")
      .regex(/^\d+$/, "El DNI solo debe contener números."),
  }),
  firstName: z
    .string()
    .min(2, "Los nombres deben tener al menos 2 caracteres."),
  paternalSurname: z
    .string()
    .min(2, "El apellido paterno debe tener al menos 2 caracteres."),
  maternalSurname: z
    .string()
    .min(2, "El apellido materno debe tener al menos 2 caracteres."),
  phone: z.object({
    prefix: z.string().min(1, "Selecciona un código de país."),
    number: z
      .string()
      .min(9, "El número debe tener al menos 9 dígitos.")
      .regex(/^\d+$/, "El teléfono solo debe contener números."),
  }),
  gender: z.enum(["male", "female", "other"], {
    message: "Selecciona un género válido.",
  }),
  status: z.enum(["active", "inactive"]),
});

const createCompanySchema = basePersonalSchema.extend({
  type: z.literal("create_company"),
  company: z.object({
    ruc: z
      .string()
      .length(11, "El RUC debe tener exactamente 11 dígitos.")
      .regex(/^\d+$/, "El RUC solo debe contener números."),
    businessName: z.string().min(3, "Ingresa la razón social de la empresa."),
    address: z.string().optional(),
    email: z
      .string()
      .email("Correo de empresa inválido.")
      .optional()
      .or(z.literal("")),
    plan: z.enum(["free", "pro", "enterprise"]),
  }),
});

const joinCompanySchema = basePersonalSchema.extend({
  type: z.literal("join_company"),
  invitationCode: z
    .string()
    .min(4, "Ingresa un código de invitación válido.")
    .toUpperCase(),
});

const getRegisterSchema = (method: "create" | "join") => {
  return z.object({
    companyRuc:
      method === "create"
        ? z.string().min(11, "Mínimo 11 dígitos").max(11, "Máximo 11 dígitos")
        : z.string().optional(),
    companyBusinessName:
      method === "create"
        ? z.string().min(11, "Mínimo 11 dígitos").max(11, "Máximo 11 dígitos")
        : z.string().optional(),
    invitationCode:
      method === "join"
        ? z.string().min(11, "Mínimo 11 dígitos").max(11, "Máximo 11 dígitos")
        : z.string().optional(),
    documentNumber: z.string(),
    firstName: z.string(),
    paternalSurname: z.string(),
    maternalSurname: z.string(),
    countryCode: z.string(),
    phoneNumber: z.string(),
    gender: z.string(),
  });
};

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

const registerSchema = z.discriminatedUnion("type", [
  createCompanySchema,
  joinCompanySchema,
]);

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSearchingDni, setIsSearchingDni] = useState(false);
  const [isSearchingRuc, setIsSearchingRuc] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejo de flujo de pasos UI (modifica según tus necesidades)
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"create_company" | "join_company">(
    "create_company",
  );

  // Mock states de tu interfaz original
  const countryCodes = [{ code: "PE", dial_code: "+51" }];

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      type: "create_company",
      document: { type: "dni", number: "" },
      firstName: "",
      paternalSurname: "",
      maternalSurname: "",
      phone: { prefix: "+51", number: "" },
      gender: "male",
      status: "active",
      company: {
        ruc: "",
        businessName: "",
        address: "",
        email: "",
        plan: "free",
      },
    },
  });

  const handleTabChange = (val: string) => {
    if (val === "create_company") {
      form.setValue("type", "create_company");
      form.setValue("company", {
        ruc: "",
        businessName: "",
        address: "",
        email: "",
        plan: "free",
      });
    } else {
      form.setValue("type", "join_company");
      form.setValue("invitationCode", "");
    }
  };

  const handleSearchDni = async () => {
    const dniNumber = form.getValues("document.number");
    if (dniNumber.length !== 8) {
      form.setError("document.number", {
        type: "manual",
        message: "Ingresa un DNI válido de 8 dígitos.",
      });
      return;
    }

    setIsSearchingDni(true);
    setTimeout(() => {
      const simulatedData = {
        firstName: "ANGEL EMILIO",
        paternalSurname: "GALA",
        maternalSurname: "FLORES",
      };
      form.setValue("firstName", simulatedData.firstName, {
        shouldValidate: true,
      });
      form.setValue("paternalSurname", simulatedData.paternalSurname, {
        shouldValidate: true,
      });
      form.setValue("maternalSurname", simulatedData.maternalSurname, {
        shouldValidate: true,
      });
      setIsSearchingDni(false);
    }, 800);
  };

  const handleSearchRuc = async () => {
    if (activeTab !== "create_company") return;
    const rucNumber = form.getValues("company.ruc");
    if (rucNumber.length !== 11) {
      form.setError("company.ruc", {
        type: "manual",
        message: "Ingresa un RUC válido de 11 dígitos.",
      });
      return;
    }

    setIsSearchingRuc(true);
    setTimeout(() => {
      const simulatedRuc = {
        businessName: "SERVITEC PERU S.A.C.",
        address: "AV. JAVIER PRADO ESTE 1234, LIMA",
      };
      form.setValue("company.businessName", simulatedRuc.businessName, {
        shouldValidate: true,
      });
      form.setValue("company.address", simulatedRuc.address, {
        shouldValidate: true,
      });
      setIsSearchingRuc(false);
    }, 800);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);

    const fullName =
      `${data.firstName} ${data.paternalSurname} ${data.maternalSurname}`.trim();

    const userPayload = {
      ...data,
      fullName,
    };

    console.log("Payload enviado al Backend:", userPayload);

    /*
        // TODO: Enviar al Backend cuando esté desplegado
        try {
            const response = await fetch("https://api.servitec.pe/v1/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userPayload),
            });
            if (response.ok) {
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Error al registrar:", error);
        } finally {
            setIsSubmitting(false);
        }
        */

    setTimeout(() => {
      setIsSubmitting(false);
      alert("Registro capturado. Revisa la consola.");
    }, 1000);
  };

  return (
    <div
      className={cn("flex flex-col gap-5 max-w-md mx-auto w-full", className)}
      {...props}
    >
      {/* Header y Logo */}
      <div className="flex flex-col items-center gap-2 text-center pb-1">
        <Link href="/" className="flex flex-col items-center gap-2">
          <div className="relative size-14 flex items-center justify-center">
            <Image
              src="/logo.jpg"
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

      {/* Timeline de Pasos */}
      <Timeline steps={TIMELINE_STEPS} currentStep={currentStep} />

      <div>
        {currentStep === 1 && (
          <Step1PersonalInformationForm
            currentStep={currentStep}
            onHandleNextStep={handleNextStep}
          />
        )}

        {currentStep === 2 && (
          <Step2ModeForm
            currentStep={currentStep}
            onHandleNextStep={handleNextStep}
            onHandlePrevStep={handlePrevStep}
          />
        )}

        {currentStep === 3 && (
          <Step3DetailsForm
            currentStep={currentStep}
            onHandleNextStep={handleNextStep}
            onHandlePrevStep={handlePrevStep}
          />
        )}
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
