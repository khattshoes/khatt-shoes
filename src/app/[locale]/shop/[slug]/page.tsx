/* eslint-disable @next/next/no-img-element */

import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import azMessages from "@/messages/az.json";
import enMessages from "@/messages/en.json";
import ruMessages from "@/messages/ru.json";

type Locale = "az" | "en" | "ru";

type ProductRow = {
  id: string;
  slug: string;
  price: number;
  old_price: number | null;
  currency: string;
  material: string | null;
  color: string | null;
  size_range: string | null;
  stock_quantity: number;
  is_custom_available: boolean;
  product_translations: {
    locale: Locale;
    name: string;
    short_description: string | null;
    description: string | null;
  }[];
  product_images: {
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
  }[];
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;

  const allMessages = {
    az: azMessages,
    en: enMessages,
    ru: ruMessages,
  };

  const t = allMessages[currentLocale];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      slug,
      price,
      old_price,
      currency,
      material,
      color,
      size_range,
      stock_quantity,
      is_custom_available,
      product_translations (
        locale,
        name,
        short_description,
        description
      ),
      product_images (
        image_url,
        alt_text,
        is_primary,
        sort_order
      )
    `
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error || !data) {
    notFound();
  }

  const product = data as ProductRow;

  const translation =
    product.product_translations.find((item) => item.locale === currentLocale) ??
    product.product_translations[0];

  const images = [...product.product_images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });

  const mainImage = images[0];

  return (
    <main className="bg-[#0D0D0D] py-16 text-[#F5F3EF]">
      <Container>
        <Link
          href="/shop"
          className="text-sm text-[#D6C2A8] transition hover:text-white"
        >
          ← {t.Pages.shopTitle}
        </Link>

        <section className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#111]">
              {mainImage?.image_url ? (
                <img
                  src={mainImage.image_url}
                  alt={mainImage.alt_text || translation?.name || product.slug}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="relative aspect-[4/3] overflow-hidden bg-[#151515]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,194,168,0.22),rgba(255,255,255,0.04)_40%,rgba(0,0,0,0.72))]" />
                  <div className="absolute inset-x-20 bottom-16 h-20 rounded-full bg-[#D6C2A8]/20 blur-xl" />
                  <div className="absolute left-1/2 top-1/2 h-16 w-64 -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-full border border-[#D6C2A8]/25 bg-black/25" />
                </div>
              )}
            </div>

            {images.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((image) => (
                  <div
                    key={image.image_url}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]"
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || translation?.name || product.slug}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:pt-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
              {translation?.short_description || product.slug}
            </p>

            <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
              {translation?.name || product.slug}
            </h1>

            <div className="mt-6 flex items-center gap-4">
              <p className="text-2xl font-semibold">
                {product.price} {product.currency}
              </p>

              {product.old_price ? (
                <p className="text-lg text-white/35 line-through">
                  {product.old_price} {product.currency}
                </p>
              ) : null}
            </div>

            {translation?.description ? (
              <p className="mt-6 leading-8 text-white/60">
                {translation.description}
              </p>
            ) : null}

            <div className="mt-8 grid gap-3 text-sm text-white/60">
              {product.material ? (
                <ProductMeta label="Material" value={product.material} />
              ) : null}

              {product.color ? (
                <ProductMeta label="Color" value={product.color} />
              ) : null}

              {product.size_range ? (
                <ProductMeta label="Size" value={product.size_range} />
              ) : null}

              <ProductMeta label="Stock" value={String(product.stock_quantity)} />
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-full bg-[#D6C2A8] px-8 py-4 text-center text-sm font-medium text-black transition hover:bg-[#c4ad90]"
              >
                {currentLocale === "az"
                  ? "Sifariş üçün əlaqə saxla"
                  : currentLocale === "en"
                    ? "Contact to order"
                    : "Связаться для заказа"}
              </Link>

              {product.is_custom_available ? (
                <Link
                  href="/custom-order"
                  className="rounded-full border border-white/10 px-8 py-4 text-center text-sm font-medium text-white/70 transition hover:border-[#D6C2A8]/50 hover:text-[#D6C2A8]"
                >
                  {t.Nav.custom}
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}

function ProductMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}