import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { ProductGallery } from "@/components/shop/product-gallery";
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
  stock_quantity: number;
  is_custom_available: boolean;
  product_translations: {
    locale: Locale;
    name: string;
    short_description: string | null;
    description: string | null;
    material: string | null;
    color: string | null;
    size_range: string | null;
  }[];
  product_images: {
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
  }[];
};

const labels = {
  az: {
    material: "Material",
    color: "Rəng",
    size: "Ölçü",
    stock: "Stok",
    order: "Sifariş üçün əlaqə saxla",
    inStock: "Mövcuddur",
    outOfStock: "Bitib",
  },
  en: {
    material: "Material",
    color: "Color",
    size: "Size",
    stock: "Stock",
    order: "Contact to order",
    inStock: "In stock",
    outOfStock: "Out of stock",
  },
  ru: {
    material: "Материал",
    color: "Цвет",
    size: "Размер",
    stock: "Склад",
    order: "Связаться для заказа",
    inStock: "В наличии",
    outOfStock: "Нет в наличии",
  },
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
  const l = labels[currentLocale];

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
      stock_quantity,
      is_custom_available,
      product_translations (
        locale,
        name,
        short_description,
        description,
        material,
        color,
        size_range
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

  if (error) {
  throw new Error(error.message);
}

if (!data) {
  notFound();
}

  const product = data as ProductRow;

  const translation =
    product.product_translations.find((item) => item.locale === currentLocale) ??
    product.product_translations[0];

  const productName = translation?.name || product.slug;

  return (
    <main className="bg-[#0D0D0D] py-16 text-[#F5F3EF]">
      <Container>
        <Link
          href="/shop"
          className="text-sm text-[#D6C2A8] transition hover:text-white"
        >
          ← {t.Pages.shopTitle}
        </Link>

        <section className="mt-10 grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <ProductGallery images={product.product_images} fallbackAlt={productName} />

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 md:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
                {translation?.short_description || product.slug}
              </p>

              <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
                {productName}
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

              <div className="mt-5 inline-flex rounded-full border border-[#D6C2A8]/20 bg-[#D6C2A8]/10 px-4 py-2 text-sm text-[#D6C2A8]">
                {product.stock_quantity > 0 ? l.inStock : l.outOfStock}
              </div>

              {translation?.description ? (
                <p className="mt-7 leading-8 text-white/60">
                  {translation.description}
                </p>
              ) : null}

              <div className="mt-8 grid gap-3 text-sm text-white/60">
                {translation?.material ? (
                  <ProductMeta label={l.material} value={translation.material} />
                ) : null}

                {translation?.color ? (
                  <ProductMeta label={l.color} value={translation.color} />
                ) : null}

                {translation?.size_range ? (
                  <ProductMeta label={l.size} value={translation.size_range} />
                ) : null}

                <ProductMeta
                  label={l.stock}
                  value={String(product.stock_quantity)}
                />
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="rounded-full bg-[#D6C2A8] px-8 py-4 text-center text-sm font-medium text-black transition hover:bg-[#c4ad90]"
                >
                  {l.order}
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
          </div>
        </section>
      </Container>
    </main>
  );
}

function ProductMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}