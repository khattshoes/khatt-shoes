import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import type { Locale } from "@/i18n/routing";

type FooterProps = {
  locale: Locale;
};

export async function Footer({ locale }: FooterProps) {
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const t = messages.Footer;
  const nav = messages.Nav;

  return (
    <footer className="border-t border-white/10 bg-[#080808]">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" locale={locale} className="inline-flex flex-col">
              <span className="text-3xl font-semibold tracking-[0.32em] text-[#F5F3EF]">
                KHATT
              </span>
              <span className="mt-2 text-[11px] uppercase tracking-[0.38em] text-[#D6C2A8]">
                Shoes Atelier
              </span>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
              {t.description}
            </p>
          </div>

          <div>
            <h4 className="mb-5 text-sm uppercase tracking-[0.25em] text-[#D6C2A8]">
              {t.pages}
            </h4>

            <div className="flex flex-col gap-3 text-sm text-white/55">
              <Link href="/" locale={locale} className="hover:text-[#D6C2A8]">
                {nav.home}
              </Link>
              <Link href="/shop" locale={locale} className="hover:text-[#D6C2A8]">
                {t.shop}
              </Link>
              <Link href="/custom-order" locale={locale} className="hover:text-[#D6C2A8]">
                {t.custom}
              </Link>
              <Link href="/repair" locale={locale} className="hover:text-[#D6C2A8]">
                {t.repair}
              </Link>
              <Link href="/contact" locale={locale} className="hover:text-[#D6C2A8]">
                {t.contact}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-sm uppercase tracking-[0.25em] text-[#D6C2A8]">
              {t.contactTitle}
            </h4>

            <div className="space-y-3 text-sm text-white/55">
              <p>{t.location}</p>
              <p>Instagram: @khatt.shoes</p>
              <p>WhatsApp: +994 XX XXX XX XX</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/35 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} KHATT Shoes. All rights reserved.</p>
          <p>Handmade footwear · Repair · Bespoke orders</p>
        </div>
      </Container>
    </footer>
  );
}