"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/schemas/auth";

type ActionResponse = {
  success?: boolean;
  error?: string;
};

/**
 * 1. REGISTRO COMPLETO (Usuario + Empresa)
 * Recibe el JSON acumulado de tu sessionStorage desde el Step 3.
 */
export async function registerUserAndOrganization(
  rawPayload: unknown,
): Promise<ActionResponse> {
  const validation = registerSchema.safeParse(rawPayload);

  if (!validation.success) {
    return {
      error:
        validation.error.issues[0]?.message || "Datos de registro inválidos.",
    };
  }

  const data = validation.data;
  const supabase = await createClient();

  const userEmail =
    data.type === "create_company" && data.email
      ? data.email
      : `${data.documentNumber}@servitectime.pe`;

  const randomPassword = crypto.randomUUID();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userEmail,
    password: randomPassword,
    options: {
      data: {
        first_name: data.firstName,
        paternal_surname: data.paternalSurname,
        maternal_surname: data.maternalSurname,
        document_number: data.documentNumber,
      },
    },
  });

  if (authError || !authData.user) {
    return {
      error: authError?.message || "No se pudo crear la cuenta de usuario.",
    };
  }

  const userId = authData.user.id;

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    first_name: data.firstName,
    paternal_surname: data.paternalSurname,
    maternal_surname: data.maternalSurname,
    document_type: data.documentType,
    document_number: data.documentNumber,
    country_code: data.countryCode,
    phone_number: data.phoneNumber,
  });

  if (profileError) {
    return {
      error:
        "Error al registrar la información del perfil: " + profileError.message,
    };
  }

  let targetOrganizationId: string;

  if (data.type === "create_company") {
    const { data: newOrg, error: orgError } = await supabase
      .from("organizations")
      .insert({
        ruc: data.company.ruc,
        business_name: data.company.businessName,
        address: data.company.address || null,
        owner_id: userId,
      })
      .select("id")
      .single();

    if (orgError || !newOrg) {
      return {
        error: "Error al registrar la organización: " + orgError?.message,
      };
    }

    targetOrganizationId = newOrg.id;
  } else {
    const { data: existingOrg, error: findError } = await supabase
      .from("organizations")
      .select("id")
      .eq("invitation_code", data.invitationCode)
      .single();

    if (findError || !existingOrg) {
      return {
        error: "El código de invitación proporcionado es inválido o no existe.",
      };
    }

    targetOrganizationId = existingOrg.id;
  }

  const { error: memberError } = await supabase
    .from("organization_members")
    .insert({
      user_id: userId,
      organization_id: targetOrganizationId,
      role: data.type === "create_company" ? "admin" : "member",
    });

  if (memberError) {
    return {
      error:
        "Error al vincular el usuario a la organización: " +
        memberError.message,
    };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * 2. LOGIN PASO 1: Solicitar código OTP (SMS o Email)
 */
export async function sendLoginOtp(
  identifier: string,
  method: "phone" | "email",
): Promise<ActionResponse> {
  const supabase = await createClient();

  if (method === "phone") {
    const { error } = await supabase.auth.signInWithOtp({
      phone: identifier,
    });
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.auth.signInWithOtp({
      email: identifier,
    });
    if (error) return { error: error.message };
  }

  return { success: true };
}

/**
 * 3. LOGIN PASO 2: Verificar código OTP de 6 dígitos
 */
export async function verifyLoginOtp(
  identifier: string,
  token: string,
  method: "phone" | "email",
): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    ...(method === "phone" ? { phone: identifier } : { email: identifier }),
    token,
    type: method === "phone" ? "sms" : "email",
  });

  if (error) {
    return { error: "Código de verificación incorrecto o expirado." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * 4. LOGOUT
 */
export async function logout(): Promise<ActionResponse> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
