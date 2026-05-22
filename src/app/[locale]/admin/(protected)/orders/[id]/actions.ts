"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing, type Locale } from "@/i18n/routing";

const allowedStatuses = [
  "new",
  "confirmed",
  "processing",
  "completed",
  "cancelled",
] as const;

type OrderStatus = (typeof allowedStatuses)[number];

function getSafeLocale(value: FormDataEntryValue | null): Locale {
  const locale = String(value || "az");

  if (routing.locales.includes(locale as Locale)) {
    return locale as Locale;
  }

  return "az";
}

function isAllowedStatus(value: string): value is OrderStatus {
  return allowedStatuses.includes(value as OrderStatus);
}

export async function updateOrderStatusAction(formData: FormData) {
  const locale = getSafeLocale(formData.get("locale"));
  const orderId = String(formData.get("order_id") || "").trim();
  const status = String(formData.get("status") || "").trim();

  if (!orderId || !isAllowedStatus(status)) {
    return redirect({
      href: "/admin/orders?error=invalid_status",
      locale,
    });
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    console.error("Update order status error:", error.message);

    return redirect({
      href: `/admin/orders/${orderId}?error=status`,
      locale,
    });
  }

  revalidatePath(`/${locale}/admin/orders`);
  revalidatePath(`/${locale}/admin/orders/${orderId}`);

  return redirect({
    href: `/admin/orders/${orderId}?updated=status`,
    locale,
  });
}