"use server";

import * as z from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  ruc: z.string().min(11, "Minimum 11 digits").max(11, "Maximum 11 digits"),
  businessName: z.string().min(1, "Required field"),
  address: z.string().min(1, "Required field"),
  ownerId: z.string().min(1, "Required field"),
});

type Organization = z.infer<typeof schema>;

const updateSchema = schema.partial();
export type UpdateOrganization = z.infer<typeof updateSchema>;

export async function createOrganization(formData: Organization) {
  const validatedFields = schema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid form data",
      details: z.flattenError(validatedFields.error).fieldErrors,
    };
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
      .select("id");

    if (error) {
      console.error("Supabase Error:", error.message);
      return { success: false, error: "Failed to save to database" };
    }

    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Unexpected server error" };
  }
}

export async function getOrganization(id: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase Error:", error.message);
      return {
        success: false,
        error: "Organization not found or database error",
      };
    }

    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Unexpected server error" };
  }
}

export async function getOrganizations() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("organizations").select("*");

    if (error) {
      console.error("Supabase Error:", error.message);
      return { success: false, error: "Failed to fetch organizations" };
    }

    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Unexpected server error" };
  }
}

export async function updateOrganization(
  id: string,
  formData: UpdateOrganization,
) {
  const validatedFields = updateSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid update payload",
      details: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const supabase = await createClient();

  const updatePayload: Record<string, any> = {};
  if (validatedFields.data.ruc) updatePayload.ruc = validatedFields.data.ruc;
  if (validatedFields.data.businessName)
    updatePayload.business_name =
      validatedFields.data.businessName.toLowerCase();
  if (validatedFields.data.address)
    updatePayload.address = validatedFields.data.address.toLowerCase();
  if (validatedFields.data.ownerId)
    updatePayload.owner_id = validatedFields.data.ownerId;

  try {
    const { data, error } = await supabase
      .from("organizations")
      .update(updatePayload)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase Error:", error.message);
      return { success: false, error: "Failed to update database record" };
    }

    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Unexpected server error" };
  }
}

export async function deleteOrganization(id: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("organizations")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase Error:", error.message);
      return { success: false, error: "Failed to delete database record" };
    }

    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Unexpected server error" };
  }
}
