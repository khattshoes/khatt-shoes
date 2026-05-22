import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Container } from "@/components/shared/container";
import { CartNavLink } from "@/components/shop/cart-nav-link";
import type { Locale } from "@/i18n/routing";

type NavbarProps = {
  locale: Locale;
};

type NavItem = {
  href: "/" | "/shop" | "/custom-order" | "/repair" | "/about" | "/contact";
  label: string;
};

export async function Navbar({ locale }: NavbarProps) {
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const t = messages.Nav;

  const navItems: readonly NavItem[] = [
    { href: "/", label: t.home },
    { href: "/shop", label: t.shop },
    { href: "/custom-order", label: t.custom },
    { href: "/repair", label: t.repair },
    { href: "/about", label: t.about },
    { href: "/contact", label: t.contact },
  ];

  const cartLabel =
    locale === "az" ? "Səbət" : locale === "en" ? "Cart" : "Корзина";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0A08]/95 text-[#FFF8EA] shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl">
      <Container>
        <div className="flex h-20 items-center justify-between gap-5">
          <Link
            href="/"
            locale={locale}
            aria-label="KHATT Shoes Atelier"
            className="group inline-flex min-w-fit items-center gap-3"
          >
            <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#D8BD8A]/35 bg-[#D8BD8A]/10 text-sm font-semibold tracking-[0.18em] text-[#D8BD8A] shadow-[0_0_35px_rgba(216,189,138,0.12)]">
              KH
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_58%)]" />
            </span>

            <span className="flex flex-col leading-none">
              <span className="text-[1.05rem] font-semibold tracking-[0.32em] text-[#FFF8EA] transition group-hover:text-[#D8BD8A]">
                KHATT
              </span>
              <span className="mt-1.5 text-[0.62rem] uppercase tracking-[0.34em] text-white/45">
                Shoes Atelier
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center rounded-full border border-white/10 bg-white/[0.035] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                locale={locale}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/[0.055] hover:text-[#D8BD8A]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden min-w-fit items-center gap-3 lg:flex">
            <LanguageSwitcher />

            <CartNavLink locale={locale} label={cartLabel} />

            <Link
              href="/custom-order"
              locale={locale}
              className="inline-flex items-center justify-center rounded-full border border-[#D8BD8A]/40 bg-[#D8BD8A] px-5 py-2.5 text-sm font-semibold text-black shadow-[0_14px_36px_rgba(216,189,138,0.14)] transition hover:bg-[#E7D2A8]"
            >
              {t.custom}
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <CartNavLink locale={locale} label={cartLabel} />
            <MobileMenu locale={locale} navItems={navItems} />
          </div>
        </div>
      </Container>
    </header>
  );
}