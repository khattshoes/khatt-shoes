import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

type Locale = "az" | "en" | "ru";

type ProductRow = {
  id: string;
  slug: string;
  price: number;
  currency: string;
  status: string;
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

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const pages = messages.Pages;
  const shop = messages.Shop;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      slug,
      price,
      currency,
      status,
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
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const products = (data ?? []) as ProductRow[];

  return (
    <main className="bg-[#0D0D0D] text-[#F5F3EF]">
      <PageHero
        eyebrow={shop.eyebrow}
        title={pages.shopTitle}
        description={pages.shopDescription}
      />

      <section className="py-20">
        <Container>
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
                {shop.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                {shop.sectionTitle}
              </h2>
            </div>

            <div className="flex gap-2 text-xs text-white/50">
              <span className="rounded-full border border-white/10 px-4 py-2">
                {shop.all}
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2">
                {shop.formal}
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2">
                {shop.casual}
              </span>
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
  className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#111]"
>
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#151515]">
                      {image?.image_url ? (
                        <img
                          src={image.image_url}
                          alt={image.alt_text || translation?.name || product.slug}
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
              Hələ aktiv məhsul yoxdur.
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}