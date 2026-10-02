import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();

  // 1. Obtener la sesión activa
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  // 2. Traer la información extendida desde 'profiles' y la organización
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: member } = await supabase
    .from("organization_members")
    .select("role, organization:organizations(id, business_name, ruc)")
    .eq("user_id", user.id)
    .single();

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
    role: member?.role || "member",
    organization: member?.organization || null,
  };
}
