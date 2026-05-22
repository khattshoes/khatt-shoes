import { createClient } from "@/lib/supabase/server";

export async function getAdminUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("id, user_id, email, full_name, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (adminError || !adminUser) {
    return null;
  }

  return {
    authUser: user,
    adminUser,
  };
}