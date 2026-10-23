import { createClient } from "@/lib/supabase/server";
import * as z from "zod";

const schema = z.object({
  userId: z.string(),
  organizationId: z.string(),
  role: z.string(),
});

type Organization = z.infer<typeof schema>;

const updateSchema = schema.partial();
export type UpdateOrganization = z.infer<typeof updateSchema>;

export async function createOrganizationMember(organization: Organization) {
  const validatedFields = schema.safeParse(organization);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid form data",
      details: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { userId, organizationId, role } = validatedFields.data;
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("organization_members")
      .insert({
        user_id: userId,
        organization_id: organizationId,
        role,
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

export async function getOrganizationMember(id: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("organization_members")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase Error:", error.message);
      return { success: false, error: "Member not found or database error" };
    }

    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Unexpected server error" };
  }
}

export async function getOrganizationMembers() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("organization_members")
      .select("*");

    if (error) {
      console.error("Supabase Error:", error.message);
      return { success: false, error: "Failed to fetch organization members" };
    }

    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Unexpected server error" };
  }
}

export async function updateOrganizationMember(
  id: string,
  organization: UpdateOrganization,
) {
  const validatedFields = updateSchema.safeParse(organization);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid update payload",
      details: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const supabase = await createClient();

  const updatePayload: Record<string, any> = {};
  if (validatedFields.data.userId)
    updatePayload.user_id = validatedFields.data.userId;
  if (validatedFields.data.organizationId)
    updatePayload.organization_id = validatedFields.data.organizationId;
  if (validatedFields.data.role) updatePayload.role = validatedFields.data.role;

  try {
    const { data, error } = await supabase
      .from("organization_members")
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

export async function deleteOrganizationMember(id: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("organization_members")
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
