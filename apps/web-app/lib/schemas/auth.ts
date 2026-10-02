import * as z from "zod";

const baseUserSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio."),
  paternalSurname: z.string().min(1, "El apellido paterno es obligatorio."),
  maternalSurname: z.string().min(1, "El apellido materno es obligatorio."),
  documentType: z.string().min(1, "El tipo de documento es obligatorio."),
  documentNumber: z.string().min(8, "Número de documento inválido."),
  countryCode: z.string().min(1, "El código de país es obligatorio."),
  phoneNumber: z.string().min(6, "Número de teléfono inválido."),
  email: z.string().trim().lowercase().pipe(z.email()),
});

const createCompanySchema = baseUserSchema.extend({
  type: z.literal("create_company"),
  company: z.object({
    ruc: z
      .string()
      .min(11, "El RUC debe tener 11 dígitos.")
      .max(11, "El RUC debe tener 11 dígitos."),
    businessName: z.string().min(1, "La razón social es obligatoria."),
    address: z.string().optional().nullable(),
    plan: z.string().optional().default("free"),
  }),
});

const joinCompanySchema = baseUserSchema.extend({
  type: z.literal("join_company"),
  invitationCode: z
    .string()
    .min(8, "El código de invitación debe tener 8 caracteres.")
    .max(8, "El código de invitación debe tener 8 caracteres."),
});

export const registerSchema = z.discriminatedUnion("type", [
  createCompanySchema,
  joinCompanySchema,
]);

export type RegisterSchemaInput = z.infer<typeof registerSchema>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{6,14}$/;

export const identifierSchema = z.string().refine(
  (val) => {
    const cleanVal = val.trim();
    return (
      emailRegex.test(cleanVal) || phoneRegex.test(cleanVal.replace(/\s+/g, ""))
    );
  },
  {
    message: "Ingresa un correo electrónico o un número de teléfono válido.",
  },
);

export const requestLoginOtpSchema = z.object({
  identifier: identifierSchema,
});

export const verifyLoginOtpSchema = z.object({
  identifier: identifierSchema,
  token: z
    .string()
    .min(6, "El código debe tener 6 dígitos.")
    .max(6, "El código debe tener 6 dígitos."),
});

export type RequestLoginOtpInput = z.infer<typeof requestLoginOtpSchema>;
export type VerifyLoginOtpInput = z.infer<typeof verifyLoginOtpSchema>;
