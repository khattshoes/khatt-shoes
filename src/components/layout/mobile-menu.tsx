"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

const mobileMenuText = {
  az: {
    open: "Menyunu aç",
    close: "Menyunu bağla",
    navigation: "Mobil naviqasiya",
    language: "Dil",
    description:
      "KHATT Shoes — premium əl işi ayaqqabı, fərdi tikiş və professional təmir atelyesi.",
    customOrder: "Fərdi sifariş et",
  },
  en: {
    open: "Open menu",
    close: "Close menu",
    navigation: "Mobile navigation",
    language: "Language",
    description:
      "KHATT Shoes — premium handmade shoes, custom orders and professional repair atelier.",
    customOrder: "Place custom order",
  },
  ru: {
    open: "Открыть меню",
    close: "Закрыть меню",
    navigation: "Мобильная навигация",
    language: "Язык",
    description:
      "KHATT Shoes — премиальная обувь ручной работы, индивидуальный пошив и профессиональный ремонт.",
    customOrder: "Оформить индивидуальный заказ",
  },
};

export function MobileMenu({ locale, navItems }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const text = mobileMenuText[locale];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const overlay =
    open && mounted ? (
      <div className="fixed inset-0 z-[9999] bg-[#070707] text-[#F5F3EF] md:hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(216,189,138,0.14),transparent_24rem),radial-gradient(circle_at_bottom_left,rgba(138,90,47,0.18),transparent_28rem)]"
          aria-hidden="true"
        />

        <div className="relative flex h-dvh flex-col">
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 bg-[#070707]/95 px-5 backdrop-blur-xl">
            <Link
              href="/"
              locale={locale}
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D6C2A8]/30 bg-[#D6C2A8]/10 text-xs font-semibold tracking-[0.18em] text-[#D6C2A8]">
                KH
              </span>

              <span className="leading-none">
                <span className="block text-base font-semibold tracking-[0.34em]">
                  KHATT
                </span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.34em] text-white/35">
                  Shoes Atelier
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={text.close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D6C2A8]/40 bg-black/20 text-[#D6C2A8] transition hover:bg-[#D6C2A8] hover:text-black"
            >
              <X size={19} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#070707] px-5 py-6">
            <nav aria-label={text.navigation} className="grid gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  locale={locale}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base font-medium text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-[#D6C2A8]/40 hover:bg-white/[0.07] hover:text-[#D6C2A8]"
                >
                  <span>{item.label}</span>
                  
                </Link>
              ))}
            </nav>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <p className="mb-4 text-xs uppercase tracking-[0.24em] text-white/35">
                {text.language}
              </p>
              <LanguageSwitcher />
            </div>

            <div className="mt-5 rounded-3xl border border-[#D6C2A8]/20 bg-[#D6C2A8]/10 p-5">
              <p className="text-sm leading-6 text-white/68">
                {text.description}
              </p>

              <Link
                href="/custom-order"
                locale={locale}
                onClick={() => setOpen(false)}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#D6C2A8] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e3cca8]"
              >
                {text.customOrder}
              </Link>
            </div>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? text.close : text.open}
        aria-expanded={open}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.035] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-[#D6C2A8]/45 hover:text-[#D6C2A8]"
      >
        {open ? <X size={19} /> : <Menu size={19} />}
      </button>

      {mounted && overlay ? createPortal(overlay, document.body) : null}
    </div>
  );
}