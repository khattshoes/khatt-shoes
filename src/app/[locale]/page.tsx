import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/home/home-page";
import { createClient } from "@/lib/supabase/server";
import { routing, type Locale } from "@/i18n/routing";

type HomeProductRow = {
  id: string;
  slug: string;
  price: number;
  currency: string;
  product_translations: {
    locale: Locale;
    name: string;
    short_description: string | null;
  }[];
  product_images: {
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
  }[];
};

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const messages = (await import(`../../messages/${currentLocale}.json`))
    .default;

  const supabase = await createClient();

 const { data, error } = await supabase
  .from("products")
  .select(
    `
    id,
    slug,
    price,
    currency,
    product_translations (
      locale,
      name,
      short_description
    ),
    product_images (
      image_url,
      alt_text,
      is_primary,
      sort_order
    )
  `
  )
  .eq("status", "active")
  .eq("featured_on_home", true)
  .order("home_sort_order", { ascending: true })
  .limit(3);

  if (error) {
    console.error("Home featured products error:", error.message);
  }

  return (
    <HomePage
      locale={currentLocale}
      t={messages.Home}
      featuredProducts={(data ?? []) as HomeProductRow[]}
    />
  );
}