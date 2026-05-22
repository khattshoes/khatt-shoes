"use server";

import { redirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

type CheckoutItem = {
  productId: string;
  variantId: string;
  name: string;
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
        name: String(item.name || ""),
        size: String(item.size || ""),
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 0),
      }))
      .filter(
        (item) =>
          item.productId &&
          item.variantId &&
          item.name &&
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
    return redirect({
      href: "/checkout?error=missing",
      locale,
    });
  }

  const supabase = await createClient();

  const variantIds = items.map((item) => item.variantId);

  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("id, product_id, size, stock_quantity, is_active")
    .in("id", variantIds);

  if (variantsError) {
    console.error("Checkout variants error:", variantsError.message);

    return redirect({
      href: "/checkout?error=server",
      locale,
    });
  }

  for (const item of items) {
    const variant = variants?.find(
      (variantItem) => variantItem.id === item.variantId
    );

    if (
      !variant ||
      variant.product_id !== item.productId ||
      variant.size !== item.size ||
      !variant.is_active ||
      variant.stock_quantity < item.quantity
    ) {
      return redirect({
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
      status: "new",
      total_amount: totalAmount,
      currency: "AZN",
    })
    .select("id")
    .single();

  if (orderError || !order?.id) {
    console.error("Checkout order insert error:", orderError?.message);

    return redirect({
      href: "/checkout?error=server",
      locale,
    });
  }

  const orderId = order.id;

  const orderItems = items.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    product_variant_id: item.variantId,
    product_name: item.name,
    size: item.size,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
  }));

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (orderItemsError) {
    console.error("Checkout order items insert error:", orderItemsError.message);

    return redirect({
      href: "/checkout?error=server",
      locale,
    });
  }

  for (const item of items) {
    const variant = variants?.find(
      (variantItem) => variantItem.id === item.variantId
    );

    if (!variant) {
      continue;
    }

    const { error: stockUpdateError } = await supabase
      .from("product_variants")
      .update({
        stock_quantity: variant.stock_quantity - item.quantity,
      })
      .eq("id", item.variantId);

    if (stockUpdateError) {
      console.error("Checkout stock update error:", stockUpdateError.message);

      return redirect({
        href: "/checkout?error=server",
        locale,
      });
    }
  }

  return redirect({
    href: `/checkout/success?order=${orderId}`,
    locale,
  });
}