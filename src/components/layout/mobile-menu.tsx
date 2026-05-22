"use client";

import { useState } from "react";
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

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-[#D6C2A8] hover:text-[#D6C2A8]"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open ? (
        <div className="absolute left-0 top-20 w-full border-b border-white/10 bg-[#0D0D0D]/95 px-5 py-6 shadow-2xl backdrop-blur-xl">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                locale={locale}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-white/10 px-5 py-4 text-sm text-white/75 transition hover:border-[#D6C2A8] hover:text-[#D6C2A8]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-white/10 pt-5">
            <LanguageSwitcher />
          </div>
        </div>
      ) : null}
    </div>
  );
}