"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      {routing.locales.map((item) => (
        <Link
          key={item}
          href={pathname}
          locale={item}
          className={`rounded-full px-3 py-1 text-xs uppercase transition ${
            locale === item
              ? "bg-[#D6C2A8] text-black"
              : "border border-white/15 text-white/60 hover:border-[#D6C2A8] hover:text-[#D6C2A8]"
          }`}
        >
          {item}
        </Link>
      ))}
    </div>
  );
}