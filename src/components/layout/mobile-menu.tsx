"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import type { Locale } from "@/i18n/routing";

type NavItem = {
  href: string;
  label: string;
};

type MobileMenuProps = {
  locale: Locale;
  navItems: readonly NavItem[];
};

export function MobileMenu({ locale, navItems }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.035] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-khatt-gold/45 hover:text-khatt-gold"
      >
        {open ? <X size={19} /> : <Menu size={19} />}
      </button>

      {open ? (
        <div className="fixed inset-0 top-20 z-50 bg-khatt-950/96 backdrop-blur-2xl">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(216,189,138,0.13),transparent_28rem),radial-gradient(circle_at_bottom_left,rgba(138,90,47,0.14),transparent_30rem)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto flex h-[calc(100dvh-5rem)] w-full max-w-2xl flex-col px-5 py-6">
            <nav aria-label="Mobile navigation" className="grid gap-3">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  locale={locale}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.035] px-5 py-4 text-base font-medium text-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-khatt-gold/40 hover:bg-white/[0.055] hover:text-khatt-gold"
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-white/28 transition group-hover:text-khatt-gold/70">
                    0{index + 1}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <p className="mb-4 text-xs uppercase tracking-[0.24em] text-white/35">
                Language
              </p>
              <LanguageSwitcher />
            </div>

            <div className="mt-auto rounded-3xl border border-khatt-gold/20 bg-khatt-gold/10 p-5">
              <p className="text-sm leading-6 text-white/68">
                KHATT Shoes — premium əl işi ayaqqabı, fərdi tikiş və
                professional təmir atelyesi.
              </p>

              <Link
                href="/custom-order"
                locale={locale}
                onClick={() => setOpen(false)}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-khatt-gold px-5 py-3 text-sm font-semibold text-black transition hover:bg-khatt-gold-soft"
              >
                Fərdi sifariş et
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}