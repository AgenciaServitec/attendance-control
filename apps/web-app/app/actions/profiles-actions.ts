"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateCurrentOrganization(organizationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("profiles")
    .update({ current_organization_id: organizationId })
    .eq("id", user.id)
    .select();

  if (error) {
    console.error("Supabase Error:", error.message);
    return { success: false, error: "Failed to update active organization" };
  }

  return { success: true, data };
}
