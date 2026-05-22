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

function revalidateProductPaths(locale: Locale, productId: string) {
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/shop`);
  revalidatePath(`/${locale}/admin/products`);
  revalidatePath(`/${locale}/admin/products/${productId}`);
}

function redirectToProduct(
  locale: Locale,
  productId: string,
  error?: string,
) {
  redirect({
    href: error
      ? `/admin/products/${productId}?error=${error}`
      : `/admin/products/${productId}`,
    locale,
  });
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
    return redirectToProduct(locale, productId, "missing");
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
      featured_on_home: formData.get("featured_on_home") === "on",
      home_sort_order: numberValue(formData.get("home_sort_order")),
      is_custom_available: formData.get("is_custom_available") === "on",
    })
    .eq("id", productId);

  if (productError) {
    console.error("Product update error:", productError.message);
    return redirectToProduct(locale, productId, "server");
  }

  const translations = [
    {
      product_id: productId,
      locale: "az",
      name: nameAz,
      short_description: optionalString(formData.get("short_description_az")),
      description: optionalString(formData.get("description_az")),
      material: optionalString(formData.get("material_az")),
      color: optionalString(formData.get("color_az")),
      size_range: optionalString(formData.get("size_range_az")),
    },
    {
      product_id: productId,
      locale: "en",
      name: nameEn,
      short_description: optionalString(formData.get("short_description_en")),
      description: optionalString(formData.get("description_en")),
      material: optionalString(formData.get("material_en")),
      color: optionalString(formData.get("color_en")),
      size_range: optionalString(formData.get("size_range_en")),
    },
    {
      product_id: productId,
      locale: "ru",
      name: nameRu,
      short_description: optionalString(formData.get("short_description_ru")),
      description: optionalString(formData.get("description_ru")),
      material: optionalString(formData.get("material_ru")),
      color: optionalString(formData.get("color_ru")),
      size_range: optionalString(formData.get("size_range_ru")),
    },
  ];

  const { error: translationError } = await supabase
    .from("product_translations")
    .upsert(translations, {
      onConflict: "product_id,locale",
    });

  if (translationError) {
    console.error("Product translation update error:", translationError.message);
    return redirectToProduct(locale, productId, "server");
  }

  revalidateProductPaths(locale, productId);

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

  let isPrimary = formData.get("is_primary") === "on";

  if (!productId) {
    throw new Error("Missing product ID");
  }

  if (!(file instanceof File) || file.size === 0) {
    return redirectToProduct(locale, productId, "image-missing");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

  if (!allowedTypes.includes(file.type)) {
    return redirectToProduct(locale, productId, "image-type");
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    return redirectToProduct(locale, productId, "image-size");
  }

  const supabase = await createClient();

  const { count: imageCount, error: imageCountError } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if (imageCountError) {
    console.error("Image count error:", imageCountError.message);
    return redirectToProduct(locale, productId, "server");
  }

  if (!imageCount) {
    isPrimary = true;
  }

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeFileExt = ["jpg", "jpeg", "png", "webp", "avif"].includes(fileExt)
    ? fileExt
    : "jpg";

  const fileName = `${crypto.randomUUID()}.${safeFileExt}`;
  const filePath = `${productId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("Product image upload error:", uploadError.message);
    return redirectToProduct(locale, productId, "server");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath);

  if (isPrimary) {
    const { error: clearPrimaryError } = await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);

    if (clearPrimaryError) {
      await supabase.storage.from("product-images").remove([filePath]);
      console.error("Product image primary clear error:", clearPrimaryError.message);
      return redirectToProduct(locale, productId, "server");
    }
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
    console.error("Product image db insert error:", dbError.message);
    return redirectToProduct(locale, productId, "server");
  }

  revalidateProductPaths(locale, productId);
  redirectToProduct(locale, productId);
}

export async function updateProductImageAction(formData: FormData) {
  const admin = await getAdminUser();

  if (!admin) {
    throw new Error("Unauthorized");
  }

  const locale = getSafeLocale(formData.get("locale"));
  const productId = requiredString(formData.get("product_id"));
  const imageId = requiredString(formData.get("image_id"));
  const altText = optionalString(formData.get("alt_text"));
  const sortOrder = numberValue(formData.get("sort_order"));
  const isPrimary = formData.get("is_primary") === "on";

  if (!productId || !imageId) {
    return redirectToProduct(locale, productId, "image-missing");
  }

  const supabase = await createClient();

  if (isPrimary) {
    const { error: clearPrimaryError } = await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);

    if (clearPrimaryError) {
      console.error("Image primary clear error:", clearPrimaryError.message);
      return redirectToProduct(locale, productId, "server");
    }
  }

  const { error } = await supabase
    .from("product_images")
    .update({
      alt_text: altText,
      sort_order: sortOrder,
      is_primary: isPrimary,
    })
    .eq("id", imageId)
    .eq("product_id", productId);

  if (error) {
    console.error("Image update error:", error.message);
    return redirectToProduct(locale, productId, "server");
  }

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId)
    .eq("is_primary", true);

  if (!count) {
    const { data: firstImage } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (firstImage?.id) {
      await supabase
        .from("product_images")
        .update({ is_primary: true })
        .eq("id", firstImage.id);
    }
  }

  revalidateProductPaths(locale, productId);
  redirectToProduct(locale, productId);
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
    return redirectToProduct(locale, productId, "image-missing");
  }

  const { data: image, error: imageReadError } = await supabase
    .from("product_images")
    .select("id, is_primary")
    .eq("id", imageId)
    .eq("product_id", productId)
    .single();

  if (imageReadError || !image) {
    console.error("Product image read error:", imageReadError?.message);
    return redirectToProduct(locale, productId, "server");
  }

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId)
    .eq("product_id", productId);

  if (error) {
    console.error("Product image delete error:", error.message);
    return redirectToProduct(locale, productId, "server");
  }

  const storagePath = getStoragePathFromPublicUrl(imageUrl);

  if (storagePath) {
    await supabase.storage.from("product-images").remove([storagePath]);
  }

  if (image.is_primary) {
    const { data: nextImage } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextImage?.id) {
      await supabase
        .from("product_images")
        .update({ is_primary: true })
        .eq("id", nextImage.id);
    }
  }

  revalidateProductPaths(locale, productId);
  redirectToProduct(locale, productId);
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

  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    console.error("Product delete error:", error.message);
    return redirectToProduct(locale, productId, "server");
  }

  const storagePaths =
    images
      ?.map((image) => getStoragePathFromPublicUrl(image.image_url))
      .filter((path): path is string => Boolean(path)) ?? [];

  if (storagePaths.length) {
    await supabase.storage.from("product-images").remove(storagePaths);
  }

  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/shop`);
  revalidatePath(`/${locale}/admin/products`);

  redirect({
    href: "/admin/products",
    locale,
  });
}

export async function addProductVariantAction(formData: FormData) {
  const admin = await getAdminUser();

  if (!admin) {
    throw new Error("Unauthorized");
  }

  const locale = getSafeLocale(formData.get("locale"));
  const productId = requiredString(formData.get("product_id"));
  const size = requiredString(formData.get("size"));
  const supabase = await createClient();

  if (!productId || !size) {
    return redirectToProduct(locale, productId, "variant-missing");
  }

  const { error } = await supabase.from("product_variants").insert({
    product_id: productId,
    size,
    sku: optionalString(formData.get("variant_sku")),
    price_adjustment: numberValue(formData.get("price_adjustment")),
    stock_quantity: numberValue(formData.get("variant_stock")),
    sort_order: numberValue(formData.get("sort_order")),
    is_active: true,
  });

  if (error) {
    console.error("Product variant insert error:", error.message);
    return redirectToProduct(locale, productId, "server");
  }

  revalidateProductPaths(locale, productId);
  redirectToProduct(locale, productId);
}

export async function deleteProductVariantAction(formData: FormData) {
  const admin = await getAdminUser();

  if (!admin) {
    throw new Error("Unauthorized");
  }

  const locale = getSafeLocale(formData.get("locale"));
  const productId = requiredString(formData.get("product_id"));
  const variantId = requiredString(formData.get("variant_id"));
  const supabase = await createClient();

  if (!productId || !variantId) {
    return redirectToProduct(locale, productId, "variant-missing");
  }

  const { error } = await supabase
    .from("product_variants")
    .delete()
    .eq("id", variantId)
    .eq("product_id", productId);

  if (error) {
    console.error("Product variant delete error:", error.message);
    return redirectToProduct(locale, productId, "server");
  }

  revalidateProductPaths(locale, productId);
  redirectToProduct(locale, productId);
}

function getStoragePathFromPublicUrl(url: string) {
  const marker = "/product-images/";
  const [, path] = url.split(marker);

  return path || null;
}