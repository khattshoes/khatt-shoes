import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "../globals.css";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

return (
  <html lang={locale}>
    <body className="bg-[#0D0D0D] text-[#F5F3EF] antialiased">
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Navbar locale={locale} />
        {children}
        <Footer locale={locale} />
      </NextIntlClientProvider>
    </body>
  </html>
);
}