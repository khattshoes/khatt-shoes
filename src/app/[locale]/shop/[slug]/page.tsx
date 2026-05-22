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
    material: "Material",
    color: "Rəng",
    size: "Ölçü",
    stock: "Stok",
    order: "Checkout-a keç",
    inStock: "Mövcuddur",
    outOfStock: "Bitib",
    favorite: "Favorit",
    addToCart: "Səbətə əlavə et",
    selectSize: "Zəhmət olmasa ölçü seçin.",
    added: "Məhsul səbətə əlavə edildi.",
    delivery: "Çatdırılma və sifariş",
    deliveryText:
      "Sifarişdən sonra komandamız sizinlə əlaqə saxlayacaq və ölçü, çatdırılma, ödəniş detallarını təsdiqləyəcək.",
    craftsmanship: "Əl işi keyfiyyəti",
    craftsmanshipText:
      "KHATT məhsulları premium materiallar və diqqətli əl işi yanaşması ilə hazırlanır.",
    sizeAdvice: "Ölçü məsləhəti",
    sizeAdviceText:
      "Əgər ölçü ilə bağlı tərəddüdünüz varsa, sifarişdən sonra komandamız sizinlə əlaqə saxlayıb ən uyğun ölçünü dəqiqləşdirəcək.",
    payment: "Ödəniş",
    paymentText:
      "Hazırda sifarişlər təsdiq zəngi/mesajı ilə qəbul olunur. Ödəniş detalları müştəri ilə fərdi şəkildə razılaşdırılır.",
    care: "Qulluq",
    careText:
      "Dəri ayaqqabıları birbaşa günəş və nəmdən qoruyun, yumşaq parça və uyğun qulluq vasitələri ilə təmizləyin.",
    madeToOrder: "Premium əl işi yanaşması",
    madeToOrderText:
      "KHATT ayaqqabıları keyfiyyət, ölçü və rahatlıq detalları nəzərə alınaraq hazırlanır. Sifarişdən sonra detalları təsdiqləmək üçün sizinlə əlaqə saxlanılacaq.",
  },
  en: {
    material: "Material",
    color: "Color",
    size: "Size",
    stock: "Stock",
    order: "Go to checkout",
    inStock: "In stock",
    outOfStock: "Out of stock",
    favorite: "Favorite",
    addToCart: "Add to cart",
    selectSize: "Please select a size.",
    added: "Product added to cart.",
    delivery: "Delivery & order",
    deliveryText:
      "After ordering, our team will contact you to confirm size, delivery and payment details.",
    craftsmanship: "Handcrafted quality",
    craftsmanshipText:
      "KHATT products are made with premium materials and a careful handmade approach.",
    sizeAdvice: "Size advice",
    sizeAdviceText:
      "If you are unsure about sizing, our team will contact you after the order to confirm the most suitable size.",
    payment: "Payment",
    paymentText:
      "Orders are currently confirmed by call or message. Payment details are agreed individually with the customer.",
    care: "Care",
    careText:
      "Protect leather shoes from direct sunlight and moisture. Clean them with a soft cloth and suitable care products.",
    madeToOrder: "Premium handmade approach",
    madeToOrderText:
      "KHATT shoes are crafted with attention to quality, sizing and comfort details. Our team will contact you after ordering to confirm the details.",
  },
  ru: {
    material: "Материал",
    color: "Цвет",
    size: "Размер",
    stock: "Склад",
    order: "Перейти к оформлению",
    inStock: "В наличии",
    outOfStock: "Нет в наличии",
    favorite: "Избранное",
    addToCart: "Добавить в корзину",
    selectSize: "Пожалуйста, выберите размер.",
    added: "Товар добавлен в корзину.",
    delivery: "Доставка и заказ",
    deliveryText:
      "После заказа наша команда свяжется с вами для подтверждения размера, доставки и оплаты.",
    craftsmanship: "Ручное качество",
    craftsmanshipText:
      "Изделия KHATT создаются из премиальных материалов с внимательным ручным подходом.",
    sizeAdvice: "Совет по размеру",
    sizeAdviceText:
      "Если вы не уверены в размере, наша команда свяжется с вами после заказа и поможет подобрать подходящий размер.",
    payment: "Оплата",
    paymentText:
      "Заказы сейчас подтверждаются через звонок или сообщение. Детали оплаты согласовываются индивидуально с клиентом.",
    care: "Уход",
    careText:
      "Берегите кожаную обувь от прямого солнца и влаги. Очищайте мягкой тканью и подходящими средствами ухода.",
    madeToOrder: "Премиальный ручной подход",
    madeToOrderText:
      "Обувь KHATT создается с вниманием к качеству, размеру и комфорту. После заказа наша команда свяжется с вами для подтверждения деталей.",
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
    notFound();
  }

  if (!data) {
    notFound();
  }

  const product = data as ProductRow;

  const translation =
    product.product_translations.find((item) => item.locale === currentLocale) ??
    product.product_translations[0];

  const productName = translation?.name || product.slug;

  const sortedImages = [...product.product_images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });

  const imageUrl = sortedImages[0]?.image_url ?? null;

  const totalVariantStock = product.product_variants
    .filter((variant) => variant.is_active)
    .reduce((sum, variant) => sum + variant.stock_quantity, 0);

  const stockCount =
    product.product_variants.length > 0
      ? totalVariantStock
      : product.stock_quantity;

  return (
    <main className="bg-[#0D0D0D] py-16 text-[#F5F3EF]">
      <Container>
        <Link
          href="/shop"
          locale={currentLocale}
          className="text-sm text-[#D6C2A8] transition hover:text-white"
        >
          ← {t.Pages.shopTitle}
        </Link>

        <section className="mt-10 grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <ProductGallery
              images={product.product_images}
              fallbackAlt={productName}
            />

            <div className="mt-4 rounded-[1.5rem] border border-[#D6C2A8]/20 bg-[#D6C2A8]/10 p-5">
              <h3 className="text-sm font-semibold text-[#D6C2A8]">
                {l.madeToOrder}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                {l.madeToOrderText}
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <InfoCard title={l.delivery} text={l.deliveryText} />
              <InfoCard title={l.payment} text={l.paymentText} />
              <InfoCard title={l.sizeAdvice} text={l.sizeAdviceText} />
              <InfoCard title={l.care} text={l.careText} />
              <InfoCard title={l.craftsmanship} text={l.craftsmanshipText} />
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 md:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
                {translation?.short_description || product.slug}
              </p>

              <div className="mt-4 flex items-start justify-between gap-5">
                <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                  {productName}
                </h1>

                <FavoriteButton productId={product.id} label={l.favorite} />
              </div>

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
                {stockCount > 0 ? l.inStock : l.outOfStock}
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

                <ProductMeta label={l.stock} value={String(stockCount)} />
              </div>

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

              <div className="mt-4">
                <Link
                  href="/checkout"
                  locale={currentLocale}
                  className="block rounded-full border border-white/10 px-8 py-4 text-center text-sm font-medium text-white/70 transition hover:border-[#D6C2A8]/50 hover:text-[#D6C2A8]"
                >
                  {l.order}
                </Link>
              </div>

              {product.is_custom_available ? (
                <div className="mt-3">
                  <Link
                    href="/custom-order"
                    locale={currentLocale}
                    className="block rounded-full border border-white/10 px-8 py-4 text-center text-sm font-medium text-white/70 transition hover:border-[#D6C2A8]/50 hover:text-[#D6C2A8]"
                  >
                    {t.Nav.custom}
                  </Link>
                </div>
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
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
      <h3 className="text-sm font-medium text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/50">{text}</p>
    </div>
  );
}