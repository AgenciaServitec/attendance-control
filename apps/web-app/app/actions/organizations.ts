"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  ruc: z.string().min(11, "Mínimo 11 dígitos").max(11, "Máximo 11 dígitos"),
  businessName: z.string().min(1, "Campo Obligatorio"),
  address: z.string().min(1, "Campo Obligatorio"),
  ownerId: z.string().min(1, "Campo Obligatorio"),
});

type Organization = z.infer<typeof schema>;

export async function createOrganization(formData: Organization) {
  const validatedFields = schema.safeParse(formData);

  if (!validatedFields.success) {
    return { success: false, error: "Datos del formulario inválidos" };
  }

  const { ruc, businessName, address, ownerId } = validatedFields.data;
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("organizations")
      .insert({
        ruc,
        business_name: businessName.toLowerCase(),
        address: address.toLowerCase() || null,
        owner_id: ownerId,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error de Supabase:", error.message);
      return { success: false, error: "Error al guardar en la base de datos" };
    }

    return { success: true, data };

    // revalidatePath("/organizations");
  } catch (e) {
    return { success: false, error: "Error inesperado en el servidor" };
  }
}

export async function updateOrganization() {
  try {
    revalidatePath("/organizations");
  } catch (e) {}
}
