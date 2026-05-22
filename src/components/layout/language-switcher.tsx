"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const locales = ["az", "en", "ru"] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
      {locales.map((item) => (
        <button
          key={item}
          onClick={() => router.replace(pathname, { locale: item })}
          className={`rounded-full px-3 py-1 text-xs uppercase transition ${
            locale === item
              ? "bg-[#D6C2A8] text-black"
              : "text-white/60 hover:text-white"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}