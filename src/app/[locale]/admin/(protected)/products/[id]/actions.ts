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

export async function updateProductAction(formData: FormData) {
  const admin = await getAdminUser();

  if (!admin) {
    throw new Error("Unauthorized");
  }

  const locale = getSafeLocale(formData.get("locale"));
  const productId = requiredString(formData.get("product_id"));
  const supabase = await createClient();

  const slug = requiredString(formData.get("slug"));
  const price = numberValue(formData.get("price"));
  const nameAz = requiredString(formData.get("name_az"));
  const nameEn = requiredString(formData.get("name_en"));
  const nameRu = requiredString(formData.get("name_ru"));

  if (!productId || !slug || !price || !nameAz || !nameEn || !nameRu) {
    throw new Error("Required fields are missing");
  }

  const { error: productError } = await supabase
    .from("products")
    .update({
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
      is_custom_available: formData.get("is_custom_available") === "on",
      material: optionalString(formData.get("material")),
      color: optionalString(formData.get("color")),
      size_range: optionalString(formData.get("size_range")),
    })
    .eq("id", productId);

  if (productError) {
    throw new Error(productError.message);
  }

  const translations = [
    {
      product_id: productId,
      locale: "az",
      name: nameAz,
      short_description: optionalString(formData.get("short_description_az")),
      description: optionalString(formData.get("description_az")),
    },
    {
      product_id: productId,
      locale: "en",
      name: nameEn,
      short_description: optionalString(formData.get("short_description_en")),
      description: optionalString(formData.get("description_en")),
    },
    {
      product_id: productId,
      locale: "ru",
      name: nameRu,
      short_description: optionalString(formData.get("short_description_ru")),
      description: optionalString(formData.get("description_ru")),
    },
  ];

  const { error: translationError } = await supabase
    .from("product_translations")
    .upsert(translations, {
      onConflict: "product_id,locale",
    });

  if (translationError) {
    throw new Error(translationError.message);
  }

  revalidatePath(`/${locale}/admin/products`);
  revalidatePath(`/${locale}/admin/products/${productId}`);

  redirect({
    href: "/admin/products",
    locale,
  });
}

export async function deleteProductAction(formData: FormData) {
  const admin = await getAdminUser();

  if (!admin) {
    throw new Error("Unauthorized");
  }

  const locale = getSafeLocale(formData.get("locale"));
  const productId = requiredString(formData.get("product_id"));
  const supabase = await createClient();

  if (!productId) {
    throw new Error("Missing product ID");
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/${locale}/admin/products`);

  redirect({
    href: "/admin/products",
    locale,
  });
}