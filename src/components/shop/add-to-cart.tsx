"use client";

import { useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { addCartItem } from "@/lib/cart";

type ProductVariant = {
  id: string;
  size: string;
  price_adjustment: number;
  stock_quantity: number;
  sort_order: number;
  is_active: boolean;
};

type AddToCartProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    imageUrl: string | null;
    price: number;
    currency: string;
  };
  variants: ProductVariant[];
  labels: {
    size: string;
    addToCart: string;
    selectSize: string;
    outOfStock: string;
    added: string;
  };
};

export function AddToCart({ product, variants, labels }: AddToCartProps) {
  const availableVariants = useMemo(() => {
    return [...variants]
      .filter((variant) => variant.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [variants]);

  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [message, setMessage] = useState("");

  const selectedVariant = availableVariants.find(
    (variant) => variant.id === selectedVariantId
  );

  const finalPrice = selectedVariant
    ? product.price + Number(selectedVariant.price_adjustment || 0)
    : product.price;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      setMessage(labels.selectSize);
      return;
    }

    if (selectedVariant.stock_quantity <= 0) {
      setMessage(labels.outOfStock);
      return;
    }

    addCartItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.imageUrl,
      price: finalPrice,
      currency: product.currency,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      quantity: 1,
    });

    setMessage(labels.added);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white">{labels.size}</p>

        {selectedVariant ? (
          <p className="text-sm text-[#D6C2A8]">
            {finalPrice} {product.currency}
          </p>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
        {availableVariants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const isDisabled = variant.stock_quantity <= 0;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                setSelectedVariantId(variant.id);
                setMessage("");
              }}
              className={`rounded-2xl border px-4 py-3 text-sm transition ${
                isSelected
                  ? "border-[#D6C2A8] bg-[#D6C2A8] text-black"
                  : "border-white/10 bg-black/20 text-white hover:border-[#D6C2A8]/50"
              } ${
                isDisabled
                  ? "cursor-not-allowed opacity-35 line-through"
                  : ""
              }`}
            >
              {variant.size}
            </button>
          );
        })}
      </div>

      {message ? (
        <p className="mt-4 text-sm text-[#D6C2A8]">{message}</p>
      ) : null}

      <button
        type="button"
        onClick={handleAddToCart}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#D6C2A8] px-8 py-4 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
      >
        <ShoppingBag size={18} />
        {labels.addToCart}
      </button>
    </div>
  );
}