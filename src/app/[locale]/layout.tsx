import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "KHATT Shoes Atelier",
    template: "%s | KHATT Shoes Atelier",
  },
  description:
    "KHATT Shoes — premium əl işi ayaqqabı, fərdi tikiş və peşəkar ayaqqabı təmiri atelyesi.",
  metadataBase: new URL("https://khatt.az"),
  openGraph: {
    title: "KHATT Shoes Atelier",
    description:
      "Premium əl işi ayaqqabı, fərdi tikiş və peşəkar ayaqqabı təmiri atelyesi.",
    type: "website",
    locale: "az_AZ",
    siteName: "KHATT Shoes Atelier",
  },
};

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
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen bg-khatt-950 text-khatt-50 antialiased">
            <Navbar locale={locale} />
            {children}
            <Footer locale={locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}