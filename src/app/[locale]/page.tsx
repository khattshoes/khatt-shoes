import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/home/home-page";
import { routing } from "@/i18n/routing";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return <HomePage locale={locale} t={messages.Home} />;
}