"use client";

import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  clearCart,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
  type CartItem,
} from "@/lib/cart";

type CartClientProps = {
  locale: "az" | "en" | "ru";
  labels: {
    title: string;
    description: string;
    empty: string;
    continueShopping: string;
    checkout: string;
    clear: string;
    size: string;
    subtotal: string;
    total: string;
    remove: string;
  };
};

export function CartClient({ locale, labels }: CartClientProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCartItems());

    const handleUpdate = () => {
      setItems(getCartItems());
    };

    window.addEventListener("khatt-cart-updated", handleUpdate);

    return () => {
      window.removeEventListener("khatt-cart-updated", handleUpdate);
    };
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const handleQuantity = (
    productId: string,
    variantId: string,
    quantity: number
  ) => {
    updateCartItemQuantity(productId, variantId, quantity);
    setItems(getCartItems());
  };

  const handleRemove = (productId: string, variantId: string) => {
    removeCartItem(productId, variantId);
    setItems(getCartItems());
  };

  const handleClear = () => {
    clearCart();
    setItems([]);
  };

  if (!items.length) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-10 text-center">
        <p className="text-white/55">{labels.empty}</p>

        <Link
          href="/shop"
          locale={locale}
          className="mt-6 inline-flex rounded-full bg-[#D6C2A8] px-7 py-3 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
        >
          {labels.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="space-y-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:text-white"
          >
            {labels.clear}
          </button>
        </div>

        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}`}
            className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[110px_1fr_auto]"
          >
            <div className="overflow-hidden rounded-2xl bg-black">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="aspect-square h-full w-full object-cover"
                />
              ) : (
                <div className="aspect-square bg-[#151515]" />
              )}
            </div>

            <div>
              <Link
                href={`/shop/${item.slug}`}
                locale={locale}
                className="text-lg font-semibold text-white transition hover:text-[#D6C2A8]"
              >
                {item.name}
              </Link>

              <p className="mt-2 text-sm text-white/50">
                {labels.size}: {item.size}
              </p>

              <p className="mt-3 text-white/65">
                {item.price} {item.currency}
              </p>
            </div>

            <div className="flex items-center gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  handleQuantity(item.productId, item.variantId, item.quantity - 1)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:text-white"
              >
                <Minus size={15} />
              </button>

              <span className="w-7 text-center">{item.quantity}</span>

              <button
                type="button"
                onClick={() =>
                  handleQuantity(item.productId, item.variantId, item.quantity + 1)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:text-white"
              >
                <Plus size={15} />
              </button>

              <button
                type="button"
                onClick={() => handleRemove(item.productId, item.variantId)}
                aria-label={labels.remove}
                className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-red-500/20 text-red-300 transition hover:border-red-400/40 hover:text-red-100"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </section>

      <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-24">
        <h2 className="text-xl font-semibold">{labels.total}</h2>

        <div className="mt-6 space-y-4 border-b border-white/10 pb-6">
          <div className="flex justify-between text-white/60">
            <span>{labels.subtotal}</span>
            <span>{total} AZN</span>
          </div>

          <div className="flex justify-between text-2xl font-semibold text-white">
            <span>{labels.total}</span>
            <span>{total} AZN</span>
          </div>
        </div>

        <Link
          href="/checkout"
          locale={locale}
          className="mt-6 block rounded-full bg-[#D6C2A8] px-8 py-4 text-center text-sm font-medium text-black transition hover:bg-[#c4ad90]"
        >
          {labels.checkout}
        </Link>

        <Link
          href="/shop"
          locale={locale}
          className="mt-3 block rounded-full border border-white/10 px-8 py-4 text-center text-sm font-medium text-white/70 transition hover:border-[#D6C2A8] hover:text-white"
        >
          {labels.continueShopping}
        </Link>
      </aside>
    </div>
  );
}