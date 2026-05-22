/* eslint-disable @next/next/no-img-element */

import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

type Locale = "az" | "en" | "ru";

type SortValue = "newest" | "price-asc" | "price-desc";

type ProductRow = {
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

const shopLabels = {
  az: {
    sortLabel: "Sıralama",
    newest: "Ən yenilər",
    priceAsc: "Ucuzdan bahaya",
    priceDesc: "Bahadan ucuza",
    noProducts: "Hələ aktiv məhsul yoxdur.",
  },
  en: {
    sortLabel: "Sort",
    newest: "Newest",
    priceAsc: "Price: low to high",
    priceDesc: "Price: high to low",
    noProducts: "No active products yet.",
  },
  ru: {
    sortLabel: "Сортировка",
    newest: "Новые",
    priceAsc: "Цена: по возрастанию",
    priceDesc: "Цена: по убыванию",
    noProducts: "Пока нет активных товаров.",
  },
};

function getSafeSort(value?: string): SortValue {
  if (value === "price-asc" || value === "price-desc" || value === "newest") {
    return value;
  }

  return "newest";
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const currentSort = getSafeSort(query.sort);

  const messages = (await import(`../../../messages/${currentLocale}.json`))
    .default;
  const pages = messages.Pages;
  const shop = messages.Shop;
  const localLabels = shopLabels[currentLocale];

  const supabase = await createClient();

  let productsQuery = supabase
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
    .eq("status", "active");

  if (currentSort === "price-asc") {
    productsQuery = productsQuery.order("price", { ascending: true });
  } else if (currentSort === "price-desc") {
    productsQuery = productsQuery.order("price", { ascending: false });
  } else {
    productsQuery = productsQuery.order("created_at", { ascending: false });
  }

  const { data, error } = await productsQuery;

  if (error) {
    console.error("Shop products error:", error.message);
  }

  const products = error ? [] : ((data ?? []) as ProductRow[]);

  return (
    <main className="bg-[#0D0D0D] text-[#F5F3EF]">
      <PageHero
        eyebrow={shop.eyebrow}
        title={pages.shopTitle}
        description={pages.shopDescription}
      />

      <section className="py-20">
        <Container>
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
                {shop.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                {shop.sectionTitle}
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex gap-2 text-xs text-white/50">
                <span className="rounded-full border border-[#D6C2A8]/40 bg-[#D6C2A8]/10 px-4 py-2 text-[#D6C2A8]">
                  {shop.all}
                </span>
                <span className="rounded-full border border-white/10 px-4 py-2">
                  {shop.formal}
                </span>
                <span className="rounded-full border border-white/10 px-4 py-2">
                  {shop.casual}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs">
                <span className="px-3 text-white/45">
                  {localLabels.sortLabel}
                </span>

                <SortLink
                  locale={currentLocale}
                  value="newest"
                  currentSort={currentSort}
                >
                  {localLabels.newest}
                </SortLink>

                <SortLink
                  locale={currentLocale}
                  value="price-asc"
                  currentSort={currentSort}
                >
                  {localLabels.priceAsc}
                </SortLink>

                <SortLink
                  locale={currentLocale}
                  value="price-desc"
                  currentSort={currentSort}
                >
                  {localLabels.priceDesc}
                </SortLink>
              </div>
            </div>
          </div>

          {products.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => {
                const translation =
                  product.product_translations.find(
                    (item) => item.locale === currentLocale
                  ) ?? product.product_translations[0];

                const image =
                  product.product_images.find((item) => item.is_primary) ??
                  [...product.product_images].sort(
                    (a, b) => a.sort_order - b.sort_order
                  )[0];

                return (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    locale={currentLocale}
                    className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#111] transition hover:border-[#D6C2A8]/40"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#151515]">
                      {image?.image_url ? (
                        <img
                          src={image.image_url}
                          alt={
                            image.alt_text || translation?.name || product.slug
                          }
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,194,168,0.22),rgba(255,255,255,0.04)_40%,rgba(0,0,0,0.72))]" />
                          <div className="absolute inset-x-10 bottom-10 h-16 rounded-full bg-[#D6C2A8]/20 blur-xl transition duration-700 group-hover:scale-110" />
                          <div className="absolute left-1/2 top-1/2 h-12 w-44 -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-full border border-[#D6C2A8]/25 bg-black/25" />
                        </>
                      )}
                    </div>

                    <div className="p-6">
                      <p className="text-xs uppercase tracking-[0.22em] text-[#D6C2A8]">
                        {translation?.short_description || product.slug}
                      </p>
                      <h3 className="mt-3 text-lg font-semibold">
                        {translation?.name || product.slug}
                      </h3>
                      <p className="mt-4 text-white/55">
                        {product.price} {product.currency}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-white/50">
              {localLabels.noProducts}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}

function SortLink({
  locale,
  value,
  currentSort,
  children,
}: {
  locale: Locale;
  value: SortValue;
  currentSort: SortValue;
  children: React.ReactNode;
}) {
  const isActive = currentSort === value;

  return (
    <Link
      href={`/shop?sort=${value}`}
      locale={locale}
      className={
        isActive
          ? "rounded-full bg-[#D6C2A8] px-4 py-2 font-medium text-black"
          : "rounded-full px-4 py-2 text-white/55 transition hover:bg-white/10 hover:text-white"
      }
    >
      {children}
    </Link>
  );
}