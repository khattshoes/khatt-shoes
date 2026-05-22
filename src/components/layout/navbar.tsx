import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Container } from "@/components/shared/container";
import type { Locale } from "@/i18n/routing";

type NavbarProps = {
  locale: Locale;
};

export async function Navbar({ locale }: NavbarProps) {
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const t = messages.Nav;

  const navItems = [
    { href: "/", label: t.home },
    { href: "/shop", label: t.shop },
    { href: "/custom-order", label: t.custom },
    { href: "/repair", label: t.repair },
    { href: "/about", label: t.about },
    { href: "/contact", label: t.contact },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0D0D]/80 backdrop-blur-2xl">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            locale={locale}
            className="group inline-flex flex-col leading-none"
          >
            <span className="text-xl font-semibold tracking-[0.32em] text-[#F5F3EF] transition group-hover:text-[#D6C2A8]">
              KHATT
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.38em] text-white/35">
              Shoes Atelier
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                locale={locale}
                className="text-sm text-white/60 transition hover:text-[#D6C2A8]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <LanguageSwitcher />

            <Link
              href="/custom-order"
              locale={locale}
              className="rounded-full border border-[#D6C2A8]/40 px-5 py-2.5 text-sm text-[#D6C2A8] transition hover:bg-[#D6C2A8] hover:text-black"
            >
              {t.custom}
            </Link>
          </div>

          <MobileMenu locale={locale} navItems={navItems} />
        </div>
      </Container>
    </header>
  );
}