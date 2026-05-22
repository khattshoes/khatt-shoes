import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";

export function Navbar() {
  const t = useTranslations("Nav");

  const navItems = [
    { label: t("home"), href: "/" },
    { label: t("shop"), href: "/shop" },
    { label: t("custom"), href: "/custom-order" },
    { label: t("repair"), href: "/repair" },
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/45 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-2xl font-semibold tracking-[0.35em]">
          KHATT
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-white/65 transition hover:text-[#D6C2A8]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href="https://wa.me/994XXXXXXXXX"
            target="_blank"
            className="hidden rounded-full bg-[#D6C2A8] px-5 py-2 text-sm font-semibold text-black transition hover:scale-105 md:block"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}