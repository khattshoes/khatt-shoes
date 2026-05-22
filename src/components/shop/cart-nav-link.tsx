"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getCartItems } from "@/lib/cart";
import type { Locale } from "@/i18n/routing";

type CartNavLinkProps = {
  locale: Locale;
  label: string;
};

export function CartNavLink({ locale, label }: CartNavLinkProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const items = getCartItems();
      const nextCount = items.reduce((sum, item) => sum + item.quantity, 0);
      setCount(nextCount);
    };

    updateCount();

    window.addEventListener("khatt-cart-updated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("khatt-cart-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return (
    <Link
      href="/cart"
      locale={locale}
      aria-label={label}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/65 transition hover:border-[#D6C2A8]/50 hover:text-[#D6C2A8]"
    >
      <ShoppingBag size={18} />

      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D6C2A8] px-1.5 text-[11px] font-semibold text-black">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}