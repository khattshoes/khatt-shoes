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

  const { data: images } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", productId);

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }

  const storagePaths =
    images
      ?.map((image) => getStoragePathFromPublicUrl(image.image_url))
      .filter((path): path is string => Boolean(path)) ?? [];

  if (storagePaths.length) {
    await supabase.storage.from("product-images").remove(storagePaths);
  }

  revalidatePath(`/${locale}/admin/products`);

  redirect({
    href: "/admin/products",
    locale,
  });
}

export async function uploadProductImageAction(formData: FormData) {
  const admin = await getAdminUser();

  if (!admin) {
    throw new Error("Unauthorized");
  }

  const locale = getSafeLocale(formData.get("locale"));
  const productId = requiredString(formData.get("product_id"));
  const file = formData.get("image_file");
  const altText = optionalString(formData.get("alt_text"));
  const sortOrder = numberValue(formData.get("sort_order"));
  const isPrimary = formData.get("is_primary") === "on";

  if (!productId || !(file instanceof File) || file.size === 0) {
    throw new Error("Missing image file");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPEG, PNG, WEBP or AVIF images are allowed");
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("Image must be smaller than 5MB");
  }

  const supabase = await createClient();

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${productId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath);

  if (isPrimary) {
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);
  }

  const { error: dbError } = await supabase.from("product_images").insert({
    product_id: productId,
    image_url: publicUrl,
    alt_text: altText,
    sort_order: sortOrder,
    is_primary: isPrimary,
  });

  if (dbError) {
    await supabase.storage.from("product-images").remove([filePath]);
    throw new Error(dbError.message);
  }

  revalidatePath(`/${locale}/admin/products/${productId}`);

  redirect({
    href: `/admin/products/${productId}`,
    locale,
  });
}

export async function deleteProductImageAction(formData: FormData) {
  const admin = await getAdminUser();

  if (!admin) {
    throw new Error("Unauthorized");
  }

  const locale = getSafeLocale(formData.get("locale"));
  const productId = requiredString(formData.get("product_id"));
  const imageId = requiredString(formData.get("image_id"));
  const imageUrl = requiredString(formData.get("image_url"));
  const supabase = await createClient();

  if (!productId || !imageId) {
    throw new Error("Missing image ID");
  }

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId)
    .eq("product_id", productId);

  if (error) {
    throw new Error(error.message);
  }

  const storagePath = getStoragePathFromPublicUrl(imageUrl);

  if (storagePath) {
    await supabase.storage.from("product-images").remove([storagePath]);
  }

  revalidatePath(`/${locale}/admin/products/${productId}`);

  redirect({
    href: `/admin/products/${productId}`,
    locale,
  });
}

function getStoragePathFromPublicUrl(url: string) {
  const marker = "/product-images/";
  const [, path] = url.split(marker);

  return path || null;
}