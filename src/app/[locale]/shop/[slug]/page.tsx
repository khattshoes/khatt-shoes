import type { Metadata } from "next";
import {
  ArrowLeft,
  CheckCircle2,
  PackageCheck,
  Ruler,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { ProductGallery } from "@/components/shop/product-gallery";
import { FavoriteButton } from "@/components/shop/favorite-button";
import { AddToCart } from "@/components/shop/add-to-cart";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import azMessages from "@/messages/az.json";
import enMessages from "@/messages/en.json";
import ruMessages from "@/messages/ru.json";

type Locale = "az" | "en" | "ru";

type ProductVariantRow = {
  id: string;
  size: string;
  price_adjustment: number;
  stock_quantity: number;
  sort_order: number;
  is_active: boolean;
};

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
  product_variants: ProductVariantRow[];
};

const labels = {
  az: {
    back: "Kolleksiyaya qayıt",
    material: "Material",
    color: "Rəng",
    size: "Ölçü",
    sizeRange: "Ölçü aralığı",
    stock: "Anbar",
    order: "Sifarişi tamamla",
    inStock: "Mövcuddur",
    outOfStock: "Satışda yoxdur",
    favorite: "Seçilmişlərə əlavə et",
    addToCart: "Səbətə əlavə et",
    selectSize: "Zəhmət olmasa ölçü seçin.",
    added: "Məhsul səbətə əlavə edildi.",
    delivery: "Sifariş prosesi",
    deliveryText:
      "Sifarişdən sonra komandamız sizinlə əlaqə saxlayaraq ölçü, çatdırılma və ödəniş detallarını təsdiqləyəcək.",
    craftsmanship: "İşçilik",
    craftsmanshipText:
      "Hər model material seçimi, forma və rahatlıq detalları nəzərə alınaraq hazırlanır.",
    sizeAdvice: "Ölçü üzrə məsləhət",
    sizeAdviceText:
      "Ölçü ilə bağlı tərəddüdünüz varsa, sifarişdən sonra sizə ən uyğun ölçünü dəqiqləşdirməyə kömək edəcəyik.",
    payment: "Ödəniş",
    paymentText:
      "Ödəniş detalları sifariş təsdiqi zamanı sizinlə fərdi şəkildə razılaşdırılır.",
    care: "Qulluq",
    careText:
      "Dəri ayaqqabıları nəmdən və birbaşa günəş işığından qoruyun. Yumşaq parça və uyğun qulluq vasitələrindən istifadə edin.",
    noteTitle: "Sifarişdən əvvəl",
    noteText:
      "Model, ölçü və materialla bağlı sualınız varsa, sifarişdən əvvəl bizimlə əlaqə saxlaya bilərsiniz.",
    customAvailable: "Bu model üzrə fərdi sifariş mümkündür",
    consult: "Məsləhət al",
    seoFallback: "KHATT Shoes əl işi ayaqqabı və peşəkar bərpa atelyesi.",
  },
  en: {
    back: "Back to collection",
    material: "Material",
    color: "Color",
    size: "Size",
    sizeRange: "Size range",
    stock: "Stock",
    order: "Complete order",
    inStock: "In stock",
    outOfStock: "Out of stock",
    favorite: "Add to favorites",
    addToCart: "Add to cart",
    selectSize: "Please select a size.",
    added: "Product added to cart.",
    delivery: "Order process",
    deliveryText:
      "After ordering, our team will contact you to confirm size, delivery and payment details.",
    craftsmanship: "Craftsmanship",
    craftsmanshipText:
      "Each model is prepared with attention to material choice, shape and comfort details.",
    sizeAdvice: "Size advice",
    sizeAdviceText:
      "If you are unsure about sizing, we will help you confirm the most suitable size after the order.",
    payment: "Payment",
    paymentText:
      "Payment details are agreed individually during order confirmation.",
    care: "Care",
    careText:
      "Protect leather shoes from moisture and direct sunlight. Use a soft cloth and suitable care products.",
    noteTitle: "Before ordering",
    noteText:
      "If you have questions about the model, size or material, you can contact us before ordering.",
    customAvailable: "Custom order is available for this model",
    consult: "Get advice",
    seoFallback: "KHATT Shoes handmade footwear and professional repair atelier.",
  },
  ru: {
    back: "Вернуться к коллекции",
    material: "Материал",
    color: "Цвет",
    size: "Размер",
    sizeRange: "Размерный ряд",
    stock: "Остаток",
    order: "Оформить заказ",
    inStock: "В наличии",
    outOfStock: "Нет в наличии",
    favorite: "Добавить в избранное",
    addToCart: "Добавить в корзину",
    selectSize: "Пожалуйста, выберите размер.",
    added: "Товар добавлен в корзину.",
    delivery: "Процесс заказа",
    deliveryText:
      "После заказа наша команда свяжется с вами для подтверждения размера, доставки и оплаты.",
    craftsmanship: "Качество работы",
    craftsmanshipText:
      "Каждая модель создается с учетом материала, формы и комфорта.",
    sizeAdvice: "Помощь с размером",
    sizeAdviceText:
      "Если вы не уверены в размере, мы поможем подобрать подходящий вариант после заказа.",
    payment: "Оплата",
    paymentText:
      "Детали оплаты согласовываются индивидуально во время подтверждения заказа.",
    care: "Уход",
    careText:
      "Берегите кожаную обувь от влаги и прямого солнца. Используйте мягкую ткань и подходящие средства ухода.",
    noteTitle: "Перед заказом",
    noteText:
      "Если у вас есть вопросы по модели, размеру или материалу, вы можете связаться с нами до заказа.",
    customAvailable: "Для этой модели доступен индивидуальный заказ",
    consult: "Получить консультацию",
    seoFallback: "KHATT Shoes — обувь ручной работы и профессиональный ремонт.",
  },
};

function getTranslation(product: ProductRow, locale: Locale) {
  return (
    product.product_translations.find((item) => item.locale === locale) ??
    product.product_translations[0]
  );
}

function getSortedImages(product: ProductRow) {
  return [...product.product_images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });
}

function getStockCount(product: ProductRow) {
  const totalVariantStock = product.product_variants
    .filter((variant) => variant.is_active)
    .reduce((sum, variant) => sum + variant.stock_quantity, 0);

  return product.product_variants.length > 0
    ? totalVariantStock
    : product.stock_quantity;
}

async function getProductBySlug(slug: string) {
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
      ),
      product_variants (
        id,
        size,
        price_adjustment,
        stock_quantity,
        sort_order,
        is_active
      )
    `
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error("Product detail error:", error.message);
    return null;
  }

  return data as ProductRow | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {
      title: "KHATT Shoes",
    };
  }

  const currentLocale = locale as Locale;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title:
        currentLocale === "az"
          ? "Məhsul tapılmadı | KHATT Shoes"
          : currentLocale === "ru"
            ? "Товар не найден | KHATT Shoes"
            : "Product not found | KHATT Shoes",
    };
  }

  const translation = getTranslation(product, currentLocale);
  const productName = translation?.name || product.slug;
  const description =
    translation?.short_description ||
    translation?.description ||
    labels[currentLocale].seoFallback;

  const imageUrl = getSortedImages(product)[0]?.image_url;

  return {
    title: `${productName} | KHATT Shoes`,
    description,
    openGraph: {
      title: `${productName} | KHATT Shoes`,
      description,
      type: "website",
      locale:
        currentLocale === "az"
          ? "az_AZ"
          : currentLocale === "ru"
            ? "ru_RU"
            : "en_US",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: productName,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} | KHATT Shoes`,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

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

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const translation = getTranslation(product, currentLocale);
  const productName = translation?.name || product.slug;
  const sortedImages = getSortedImages(product);
  const imageUrl = sortedImages[0]?.image_url ?? null;
  const stockCount = getStockCount(product);
  const available = stockCount > 0;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    image: sortedImages.map((image) => image.image_url).filter(Boolean),
    description:
      translation?.description ||
      translation?.short_description ||
      l.seoFallback,
    brand: {
      "@type": "Brand",
      name: "KHATT Shoes",
    },
    sku: product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="bg-[#0B0A08] py-12 text-[#FFF8EA] sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Container>
        <Link
          href="/shop"
          locale={currentLocale}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60 transition hover:border-[#D8BD8A]/40 hover:text-[#D8BD8A]"
        >
          <ArrowLeft size={15} />
          {l.back}
        </Link>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-5">
            <ProductGallery
              images={product.product_images}
              fallbackAlt={productName}
            />

            <div className="rounded-[2rem] border border-[#D8BD8A]/20 bg-[linear-gradient(135deg,rgba(216,189,138,0.12),rgba(255,255,255,0.025))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="flex gap-4">
                <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D8BD8A]/12 text-[#D8BD8A]">
                  <Sparkles size={18} />
                </span>

                <div>
                  <h3 className="text-sm font-semibold text-[#D8BD8A]">
                    {l.noteTitle}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {l.noteText}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<PackageCheck size={18} />}
                title={l.delivery}
                text={l.deliveryText}
              />
              <InfoCard
                icon={<ShieldCheck size={18} />}
                title={l.payment}
                text={l.paymentText}
              />
              <InfoCard
                icon={<Ruler size={18} />}
                title={l.sizeAdvice}
                text={l.sizeAdviceText}
              />
              <InfoCard
                icon={<CheckCircle2 size={18} />}
                title={l.care}
                text={l.careText}
              />
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="border-b border-white/10 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#D8BD8A]">
                      {translation?.short_description || product.slug}
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.045em] text-white md:text-5xl">
                      {productName}
                    </h1>
                  </div>

                  <FavoriteButton productId={product.id} label={l.favorite} />
                </div>

                {translation?.description ? (
                  <p className="mt-6 leading-8 text-white/62">
                    {translation.description}
                  </p>
                ) : null}

                <div className="mt-7 flex flex-wrap items-end gap-4">
                  <p className="text-3xl font-semibold text-white">
                    {product.price} {product.currency}
                  </p>

                  {product.old_price ? (
                    <p className="pb-1 text-lg text-white/35 line-through">
                      {product.old_price} {product.currency}
                    </p>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span
                    className={
                      available
                        ? "inline-flex rounded-full border border-[#D8BD8A]/25 bg-[#D8BD8A]/10 px-4 py-2 text-sm font-medium text-[#D8BD8A]"
                        : "inline-flex rounded-full border border-red-400/25 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-200"
                    }
                  >
                    {available ? l.inStock : l.outOfStock}
                  </span>

                  {product.is_custom_available ? (
                    <span className="inline-flex rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/55">
                      {l.customAvailable}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid gap-3 text-sm">
                  {translation?.material ? (
                    <ProductMeta label={l.material} value={translation.material} />
                  ) : null}

                  {translation?.color ? (
                    <ProductMeta label={l.color} value={translation.color} />
                  ) : null}

                  {translation?.size_range ? (
                    <ProductMeta
                      label={l.sizeRange}
                      value={translation.size_range}
                    />
                  ) : null}

                  <ProductMeta label={l.stock} value={String(stockCount)} />
                </div>

                <div className="mt-7">
                  <AddToCart
                    product={{
                      id: product.id,
                      slug: product.slug,
                      name: productName,
                      imageUrl,
                      price: product.price,
                      currency: product.currency,
                    }}
                    variants={product.product_variants}
                    labels={{
                      size: l.size,
                      addToCart: l.addToCart,
                      selectSize: l.selectSize,
                      outOfStock: l.outOfStock,
                      added: l.added,
                    }}
                  />
                </div>

                <div className="mt-4 grid gap-3">
                  <Link
                    href="/checkout"
                    locale={currentLocale}
                    className="block rounded-full border border-white/10 px-8 py-4 text-center text-sm font-semibold text-white/72 transition hover:border-[#D8BD8A]/50 hover:text-[#D8BD8A]"
                  >
                    {l.order}
                  </Link>

                  {product.is_custom_available ? (
                    <Link
                      href="/custom-order"
                      locale={currentLocale}
                      className="block rounded-full border border-[#D8BD8A]/35 bg-[#D8BD8A]/10 px-8 py-4 text-center text-sm font-semibold text-[#D8BD8A] transition hover:bg-[#D8BD8A] hover:text-black"
                    >
                      {t.Nav.custom}
                    </Link>
                  ) : null}

                  <Link
                    href="/contact"
                    locale={currentLocale}
                    className="block rounded-full border border-white/10 px-8 py-4 text-center text-sm font-semibold text-white/60 transition hover:border-white/25 hover:text-white"
                  >
                    {l.consult}
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </Container>
    </main>
  );
}

function ProductMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
      <span className="text-white/46">{label}</span>
      <span className="text-right font-medium text-white">{value}</span>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#D8BD8A]/10 text-[#D8BD8A]">
        {icon}
      </span>
      <h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/52">{text}</p>
    </div>
  );
}