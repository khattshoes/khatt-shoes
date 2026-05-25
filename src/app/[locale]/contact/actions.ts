"use server";

import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing, type Locale } from "@/i18n/routing";

function getSafeLocale(value: FormDataEntryValue | null): Locale {
  const locale = String(value || "az");

  return routing.locales.includes(locale as Locale) ? (locale as Locale) : "az";
}

function cleanText(value: FormDataEntryValue | null, maxLength: number) {
  return String(value || "").trim().slice(0, maxLength);
}

export async function createContactMessageAction(formData: FormData) {
  const locale = getSafeLocale(formData.get("locale"));

  const fullName = cleanText(formData.get("full_name"), 120);
  const phone = cleanText(formData.get("phone"), 80);
  const email = cleanText(formData.get("email"), 120);
  const subject = cleanText(formData.get("subject"), 160);
  const message = cleanText(formData.get("message"), 2000);

  if (!fullName || !message) {
    return redirect({
      href: "/contact?error=required",
      locale,
    });
  }

  const supabase = await createClient();

  const { error } = await supabase.from("contact_messages").insert({
    full_name: fullName,
    phone: phone || null,
    email: email || null,
    subject: subject || null,
    message,
    status: "new",
  });

  if (error) {
    console.error("Create contact message error:", error.message);

    return redirect({
      href: "/contact?error=submit",
      locale,
    });
  }

  return redirect({
    href: "/contact?success=1",
    locale,
  });
}