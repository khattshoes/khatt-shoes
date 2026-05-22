"use server";

import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing, type Locale } from "@/i18n/routing";

type CheckoutItem = {
  productId: string;
  variantId: string;
  size: string;
  price: number;
  quantity: number;
};

function getSafeLocale(value: FormDataEntryValue | null): Locale {
  const locale = String(value || "az");

  if (routing.locales.includes(locale as Locale)) {
    return locale as Locale;
  }

  return "az";
}

function requiredString(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function optionalString(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text ? text : null;
}

function parseItems(value: FormDataEntryValue | null): CheckoutItem[] {
  try {
    const parsed = JSON.parse(String(value || "[]"));

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => ({
        productId: String(item.productId || ""),
        variantId: String(item.variantId || ""),
        size: String(item.size || ""),
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 0),
      }))
      .filter(
        (item) =>
          item.productId &&
          item.variantId &&
          item.size &&
          item.price >= 0 &&
          item.quantity > 0
      );
  } catch {
    return [];
  }
}

export async function createCheckoutOrderAction(formData: FormData) {
  const locale = getSafeLocale(formData.get("locale"));
  const customerName = requiredString(formData.get("customer_name"));
  const customerPhone = requiredString(formData.get("customer_phone"));
  const customerEmail = optionalString(formData.get("customer_email"));
  const customerNote = optionalString(formData.get("customer_note"));
  const items = parseItems(formData.get("items"));

  if (!customerName || !customerPhone || !items.length) {
    redirect({
      href: "/checkout?error=missing",
      locale,
    });
  }

  const supabase = await createClient();

  const productIds = items.map((item) => item.productId);
  const variantIds = items.map((item) => item.variantId);

  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("id, product_id, size, stock_quantity, is_active")
    .in("id", variantIds);

  if (variantsError) {
    throw new Error(variantsError.message);
  }

  for (const item of items) {
    const variant = variants?.find((variantItem) => variantItem.id === item.variantId);

    if (
      !variant ||
      variant.product_id !== item.productId ||
      variant.size !== item.size ||
      !variant.is_active ||
      variant.stock_quantity < item.quantity
    ) {
      redirect({
        href: "/checkout?error=stock",
        locale,
      });
    }
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      customer_note: customerNote,
      status: "pending",
      total_amount: totalAmount,
      currency: "AZN",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message || "Order could not be created");
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_variant_id: item.variantId,
    size: item.size,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
  }));

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (orderItemsError) {
    throw new Error(orderItemsError.message);
  }

  for (const item of items) {
    const variant = variants?.find((variantItem) => variantItem.id === item.variantId);

    if (variant) {
      await supabase
        .from("product_variants")
        .update({
          stock_quantity: variant.stock_quantity - item.quantity,
        })
        .eq("id", item.variantId);
    }
  }

  redirect({
    href: `/checkout/success?order=${order.id}`,
    locale,
  });
}