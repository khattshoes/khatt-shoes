"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
      {routing.locales.map((item) => (
        <Link
          key={item}
          href={pathname}
          locale={item}
          className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-wider transition ${
            locale === item
              ? "bg-[#D6C2A8] text-black"
              : "text-white/50 hover:text-[#D6C2A8]"
          }`}
        >
          {item}
        </Link>
      ))}
    </div>
  );
}