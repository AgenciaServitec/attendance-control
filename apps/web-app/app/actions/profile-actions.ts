"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateContactInfo(formData: FormData) {
  const phone = formData.get("phone") as string;
  const userId = formData.get("userId") as string;

  if (!phone || !userId) return { error: "Datos incompletos" };

  const adminSupabase = createAdminClient();

  // 1. Actualizar el teléfono en auth.users para el login OTP
  const { error: authError } = await adminSupabase.auth.admin.updateUserById(
    userId,
    { phone: `+51${phone}` },
  );

  if (authError)
    return { error: "Error al actualizar credenciales: " + authError.message };

  // 2. Actualizar en la tabla public.profiles
  const { error: profileError } = await adminSupabase
    .from("profiles")
    .update({ phone_number: phone })
    .eq("id", userId);

  if (profileError)
    return { error: "Error al actualizar perfil: " + profileError.message };

  revalidatePath("/settings/profile", "page");
  return { success: true };
}

export async function uploadProfileImage(formData: FormData) {
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;
  const bucket = formData.get("bucket") as "avatars" | "covers";

  if (!file || !userId) return { error: "Archivo o usuario no válido" };

  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

  // 1. Subir la imagen a Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  // 2. Obtener la URL pública del archivo
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData.publicUrl;

  // 3. Guardar la URL en la columna avatar_url o cover_url
  const column = bucket === "avatars" ? "avatar_url" : "cover_url";

  const { error: updateError } = await adminSupabase
    .from("profiles")
    .update({ [column]: publicUrl })
    .eq("id", userId);

  if (updateError)
    return { error: "Error al actualizar perfil: " + updateError.message };

  revalidatePath("/settings/profile", "page");
  return { success: true, url: publicUrl };
}
