"use client";

import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  clearCart,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
  type CartItem,
} from "@/lib/cart";

type CheckoutAction = (formData: FormData) => void | Promise<void>;

type CheckoutClientProps = {
  locale: "az" | "en" | "ru";
  action: CheckoutAction;
  labels: {
    title: string;
    empty: string;
    customerInfo: string;
    name: string;
    phone: string;
    email: string;
    note: string;
    subtotal: string;
    total: string;
    submit: string;
    clear: string;
    size: string;
    qty: string;
    missingError: string;
    stockError: string;
    serverError: string;
  };
  error?: string;
};

export function CheckoutClient({
  locale,
  action,
  labels,
  error,
}: CheckoutClientProps) {
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

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold">{labels.title}</h1>

          {items.length ? (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:text-white"
            >
              {labels.clear}
            </button>
          ) : null}
        </div>

        {!items.length ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center text-white/50">
            {labels.empty}
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:grid-cols-[96px_1fr_auto]"
              >
                <div className="overflow-hidden rounded-xl bg-black">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-square bg-[#151515]" />
                  )}
                </div>

                <div>
                  <h2 className="font-medium text-white">{item.name}</h2>
                  <p className="mt-2 text-sm text-white/50">
                    {labels.size}: {item.size}
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    {item.price} {item.currency}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantity(
                        item.productId,
                        item.variantId,
                        item.quantity - 1
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="w-6 text-center">{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuantity(
                        item.productId,
                        item.variantId,
                        item.quantity + 1
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60"
                  >
                    <Plus size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.productId, item.variantId)}
                    className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-red-500/20 text-red-300"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-24 lg:self-start">
        <h2 className="text-xl font-semibold">{labels.customerInfo}</h2>

        {error === "missing" ? (
          <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {labels.missingError}
          </p>
        ) : null}

        {error === "stock" ? (
          <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {labels.stockError}
          </p>
        ) : null}

        {error === "server" ? (
          <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {labels.serverError}
          </p>
        ) : null}

        <form action={action} className="mt-6 space-y-4">
          <input type="hidden" name="locale" value={locale} />
          <input
            type="hidden"
            name="items"
            value={JSON.stringify(
              items.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                size: item.size,
                price: item.price,
                quantity: item.quantity,
              }))
            )}
          />

          <Input label={labels.name} name="customer_name" required />
          <Input label={labels.phone} name="customer_phone" required />
          <Input label={labels.email} name="customer_email" type="email" />

          <label className="block">
            <span className="mb-2 block text-sm text-white/60">
              {labels.note}
            </span>
            <textarea
              name="customer_note"
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-[#D6C2A8]"
            />
          </label>

          <div className="border-t border-white/10 pt-5">
            <div className="flex justify-between text-white/60">
              <span>{labels.subtotal}</span>
              <span>{total} AZN</span>
            </div>

            <div className="mt-3 flex justify-between text-xl font-semibold text-white">
              <span>{labels.total}</span>
              <span>{total} AZN</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!items.length}
            className="w-full rounded-full bg-[#D6C2A8] px-8 py-4 text-sm font-medium text-black transition hover:bg-[#c4ad90] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {labels.submit}
          </button>
        </form>
      </section>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/60">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-[#D6C2A8]"
      />
    </label>
  );
}