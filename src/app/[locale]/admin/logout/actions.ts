"use server";

import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing, type Locale } from "@/i18n/routing";

function getSafeLocale(value: FormDataEntryValue | null): Locale {
  const locale = String(value || routing.defaultLocale);

  return routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale;
}

export async function logoutAction(formData: FormData) {
  const locale = getSafeLocale(formData.get("locale"));
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect({
    href: "/admin/login",
    locale,
  });
}