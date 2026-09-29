"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  registerSchema,
  requestLoginOtpSchema,
  verifyLoginOtpSchema,
} from "@/lib/schemas/auth";
import { createAdminClient } from "@/lib/supabase/admin";

type ActionResponse = {
  success?: boolean;
  error?: string;
};

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

  const adminSupabase = createAdminClient();

  const userEmail =
    data.type === "create_company" && data.email
      ? data.email
      : `${data.documentNumber}@servitectime.pe`;

  const randomPassword = crypto.randomUUID();

  const { data: authData, error: authError } =
    await adminSupabase.auth.admin.createUser({
      email: userEmail,
      phone: `${data.countryCode}${data.phoneNumber}`,
      password: randomPassword,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        first_name: data.firstName,
        paternal_surname: data.paternalSurname,
        maternal_surname: data.maternalSurname,
        document_number: data.documentNumber,
      },
    });

  if (authError || !authData.user) {
    return {
      error: authError?.message || "No se pudo crear la cuenta de usuario.",
    };
  }

  const userId = authData.user.id;

  const { error: profileError } = await adminSupabase.from("profiles").insert({
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
    const { data: newOrg, error: orgError } = await adminSupabase
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
    const { data: existingOrg, error: findError } = await adminSupabase
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

  const { error: memberError } = await adminSupabase
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

export async function sendLoginOtp(rawPayload: unknown) {
  const validation = requestLoginOtpSchema.safeParse(rawPayload);

  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || "Identificador inválido.",
    };
  }

  const identifier = validation.data.identifier.trim();
  const isEmail = identifier.includes("@");
  const supabase = await createClient();

  if (isEmail) {
    const { error } = await supabase.auth.signInWithOtp({
      email: identifier,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      return {
        error:
          "No pudimos enviar el código al correo. Verifica que estés registrado.",
      };
    }
  } else {
    let phone = identifier.replace(/\s+/g, "");

    if (!phone.startsWith("+")) {
      phone = `+51${phone}`;
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      return {
        error:
          "No encontramos una cuenta registrada con este número de teléfono.",
      };
    }
  }

  return { success: true, isEmail };
}

export async function verifyLoginOtp(rawPayload: unknown) {
  const validation = verifyLoginOtpSchema.safeParse(rawPayload);

  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Datos inválidos." };
  }

  const identifier = validation.data.identifier.trim();
  const { token } = validation.data;
  const isEmail = identifier.includes("@");
  const supabase = await createClient();

  let result;

  if (isEmail) {
    result = await supabase.auth.verifyOtp({
      email: identifier,
      token,
      type: "email",
    });
  } else {
    let phone = identifier.replace(/\s+/g, "");
    if (!phone.startsWith("+")) {
      phone = `+51${phone}`;
    }

    result = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
  }

  if (result.error || !result.data.session) {
    return { error: "Código de verificación incorrecto o expirado." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function logout(): Promise<ActionResponse> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
