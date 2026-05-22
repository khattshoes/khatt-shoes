"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/admin";
import { routing, type Locale } from "@/i18n/routing";

function getSafeLocale(value: FormDataEntryValue | null): Locale {
  const locale = String(value || routing.defaultLocale);

  return routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale;
}

function optionalString(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text.length ? text : null;
}

function requiredString(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function numberValue(value: FormDataEntryValue | null, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export async function createProductAction(formData: FormData) {
  const admin = await getAdminUser();

  if (!admin) {
    throw new Error("Unauthorized");
  }

  const locale = getSafeLocale(formData.get("locale"));
  const supabase = await createClient();

  const slug = requiredString(formData.get("slug"));
  const price = numberValue(formData.get("price"));
  const nameAz = requiredString(formData.get("name_az"));
  const nameEn = requiredString(formData.get("name_en"));
  const nameRu = requiredString(formData.get("name_ru"));

  if (!slug || !price || !nameAz || !nameEn || !nameRu) {
    throw new Error("Required fields are missing");
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      category_id: optionalString(formData.get("category_id")),
      slug,
      sku: optionalString(formData.get("sku")),
      price,
      old_price: optionalString(formData.get("old_price"))
        ? numberValue(formData.get("old_price"))
        : null,
      currency: requiredString(formData.get("currency")) || "AZN",
      status: requiredString(formData.get("status")) || "draft",
      stock_quantity: numberValue(formData.get("stock_quantity")),
     is_featured: formData.get("is_featured") === "on",
featured_on_home: formData.get("featured_on_home") === "on",
home_sort_order: numberValue(formData.get("home_sort_order")),
is_custom_available: formData.get("is_custom_available") === "on",
material: optionalString(formData.get("material")),
      color: optionalString(formData.get("color")),
      size_range: optionalString(formData.get("size_range")),
    })
    .select("id")
    .single();

  if (productError || !product) {
    throw new Error(productError?.message || "Product could not be created");
  }

  const { error: translationError } = await supabase
    .from("product_translations")
    .insert([
      {
        product_id: product.id,
        locale: "az",
        name: nameAz,
        short_description: optionalString(formData.get("short_description_az")),
        description: optionalString(formData.get("description_az")),
      },
      {
        product_id: product.id,
        locale: "en",
        name: nameEn,
        short_description: optionalString(formData.get("short_description_en")),
        description: optionalString(formData.get("description_en")),
      },
      {
        product_id: product.id,
        locale: "ru",
        name: nameRu,
        short_description: optionalString(formData.get("short_description_ru")),
        description: optionalString(formData.get("description_ru")),
      },
    ]);

  if (translationError) {
    throw new Error(translationError.message);
  }

  revalidatePath(`/${locale}/admin/products`);

  redirect({
    href: "/admin/products",
    locale,
  });
}