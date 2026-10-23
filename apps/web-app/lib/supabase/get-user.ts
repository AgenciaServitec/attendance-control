import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: member } = await supabase
    .from("organization_members")
    .select("role, organization:organizations(id, business_name, ruc, address)")
    .eq("user_id", user.id);

  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    firstName: profile?.first_name || user.user_metadata?.first_name || "",
    paternalSurname:
      profile?.paternal_surname || user.user_metadata?.paternal_surname || "",
    maternalSurname: profile?.maternal_surname || "",
    fullName: profile
      ? `${profile.first_name} ${profile.paternal_surname}`.trim()
      : user.email?.split("@")[0] || "Usuario",
    role: "member",
    organizations: member || null,
    avatarUrl: profile?.avatar_url || null,
    coverUrl: profile?.cover_url || null,
  };
}
