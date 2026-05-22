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

export async function loginAction(formData: FormData) {
  const locale = getSafeLocale(formData.get("locale"));
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect({
      href: "/admin/login?error=invalid",
      locale,
    });
  }

  redirect({
    href: "/admin",
    locale,
  });
}