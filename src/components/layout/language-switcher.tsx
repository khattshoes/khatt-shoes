"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      aria-label="Language switcher"
    >
      {routing.locales.map((item) => {
        const active = locale === item;

        return (
          <Link
            key={item}
            href={pathname}
            locale={item}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition ${
              active
                ? "bg-khatt-gold text-black shadow-[0_8px_22px_rgba(216,189,138,0.16)]"
                : "text-white/45 hover:bg-white/[0.055] hover:text-khatt-gold"
            }`}
          >
            {localeLabels[item] ?? item.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}