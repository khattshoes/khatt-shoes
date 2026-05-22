import Image from "next/image";
import { ArrowRight, SlidersHorizontal, Sparkles } from "lucide-react";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

type Locale = "az" | "en" | "ru";

type SortValue = "newest" | "price-asc" | "price-desc";

type CategoryRow = {
  id: string;
  slug: string;
  name_az: string;
  name_en: string;
  name_ru: string;
};

type ProductRow = {
  id: string;
  slug: string;
  price: number;
  currency: string;
  category_id: string | null;
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
    categoryLabel: "Kateqoriyalar",
    sortLabel: "Sıralama",
    all: "Hamısı",
    newest: "Ən yenilər",
    priceAsc: "Ucuzdan bahaya",
    priceDesc: "Bahadan ucuza",
    collection: "Kolleksiya",
    productsFound: "məhsul göstərilir",
    viewDetails: "Ətraflı baxın",
    noProductsTitle: "Bu seçimə uyğun məhsul tapılmadı",
    noProductsDescription:
      "Kateqoriyanı və ya sıralamanı dəyişərək kolleksiyaya yenidən baxa bilərsiniz.",
    resetFilters: "Bütün məhsullara baxın",
    helperTitle: "Seçim etməkdə çətinlik çəkirsiniz?",
    helperDescription:
      "Ölçü, model və istifadə məqsədinizə uyğun seçim üçün bizimlə əlaqə saxlaya bilərsiniz.",
    helperCta: "Məsləhət alın",
  },
  en: {
    categoryLabel: "Categories",
    sortLabel: "Sort",
    all: "All",
    newest: "Newest",
    priceAsc: "Price: low to high",
    priceDesc: "Price: high to low",
    collection: "Collection",
    productsFound: "products shown",
    viewDetails: "View details",
    noProductsTitle: "No products found",
    noProductsDescription:
      "Try changing the category or sorting option to view the collection again.",
    resetFilters: "View all products",
    helperTitle: "Need help choosing?",
    helperDescription:
      "Contact us for guidance based on your size, preferred style and use case.",
    helperCta: "Get advice",
  },
  ru: {
    categoryLabel: "Категории",
    sortLabel: "Сортировка",
    all: "Все",
    newest: "Новые",
    priceAsc: "Цена: по возрастанию",
    priceDesc: "Цена: по убыванию",
    collection: "Коллекция",
    productsFound: "товаров показано",
    viewDetails: "Подробнее",
    noProductsTitle: "Товары не найдены",
    noProductsDescription:
      "Измените категорию или сортировку, чтобы снова просмотреть коллекцию.",
    resetFilters: "Смотреть все товары",
    helperTitle: "Нужна помощь с выбором?",
    helperDescription:
      "Свяжитесь с нами, чтобы подобрать модель по размеру, стилю и назначению.",
    helperCta: "Получить консультацию",
  },
};

function getSafeSort(value?: string): SortValue {
  if (value === "price-asc" || value === "price-desc" || value === "newest") {
    return value;
  }

  return "newest";
}

function getCategoryName(category: CategoryRow, locale: Locale) {
  if (locale === "az") return category.name_az;
  if (locale === "en") return category.name_en;
  return category.name_ru;
}

function buildShopHref({
  category,
  sort,
}: {
  category?: string | null;
  sort?: SortValue;
}) {
  const params = new URLSearchParams();

  if (category) params.set("category", category);
  if (sort && sort !== "newest") params.set("sort", sort);

  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

function isSafeImageSrc(src?: string | null) {
  if (!src) return false;
  return src.startsWith("/") || src.startsWith("https://");
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sort?: string; category?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const currentSort = getSafeSort(query.sort);
  const currentCategory = query.category || null;

  const messages = (await import(`../../../messages/${currentLocale}.json`))
    .default;
  const pages = messages.Pages;
  const shop = messages.Shop;
  const localLabels = shopLabels[currentLocale];

  const supabase = await createClient();

  const { data: categoriesData, error: categoriesError } = await supabase
    .from("categories")
    .select("id, slug, name_az, name_en, name_ru")
    .order("sort_order", { ascending: true });

  if (categoriesError) {
    console.error("Shop categories error:", categoriesError.message);
  }

  const categories = categoriesError
    ? []
    : ((categoriesData ?? []) as CategoryRow[]);

  const activeCategory = categories.find(
    (category) => category.slug === currentCategory
  );

  let productsQuery = supabase
    .from("products")
    .select(
      `
      id,
      slug,
      price,
      currency,
      category_id,
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

  if (activeCategory) {
    productsQuery = productsQuery.eq("category_id", activeCategory.id);
  }

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
    <main className="bg-[#0B0A08] text-[#FFF8EA]">
      <PageHero
        eyebrow={shop.eyebrow}
        title={pages.shopTitle}
        description={pages.shopDescription}
      />

      <section className="py-14 sm:py-18">
        <Container>
          <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_360px]">
            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(216,189,138,0.13),rgba(255,255,255,0.035))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-8">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D8BD8A]/10 blur-3xl" />
              <div className="relative">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D8BD8A]/25 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#D8BD8A] backdrop-blur-md">
                  <Sparkles size={14} />
                  {localLabels.collection}
                </div>

                <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                  {shop.sectionTitle}
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                  {pages.shopDescription}
                </p>

                <p className="mt-6 text-sm text-white/45">
                  <span className="font-semibold text-[#D8BD8A]">
                    {products.length}
                  </span>{" "}
                  {localLabels.productsFound}
                </p>
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/40">
                <SlidersHorizontal size={14} />
                {localLabels.sortLabel}
              </div>

              <div className="grid gap-2">
                <SortLink
                  locale={currentLocale}
                  category={activeCategory?.slug ?? null}
                  value="newest"
                  currentSort={currentSort}
                >
                  {localLabels.newest}
                </SortLink>

                <SortLink
                  locale={currentLocale}
                  category={activeCategory?.slug ?? null}
                  value="price-asc"
                  currentSort={currentSort}
                >
                  {localLabels.priceAsc}
                </SortLink>

                <SortLink
                  locale={currentLocale}
                  category={activeCategory?.slug ?? null}
                  value="price-desc"
                  currentSort={currentSort}
                >
                  {localLabels.priceDesc}
                </SortLink>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.025] p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-white/35">
              {localLabels.categoryLabel}
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1">
              <CategoryLink
                locale={currentLocale}
                category={null}
                currentCategory={activeCategory?.slug ?? null}
                sort={currentSort}
              >
                {localLabels.all}
              </CategoryLink>

              {categories.map((category) => (
                <CategoryLink
                  key={category.id}
                  locale={currentLocale}
                  category={category.slug}
                  currentCategory={activeCategory?.slug ?? null}
                  sort={currentSort}
                >
                  {getCategoryName(category, currentLocale)}
                </CategoryLink>
              ))}
            </div>
          </div>

          {products.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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

                const imageUrl = isSafeImageSrc(image?.image_url)
                  ? image?.image_url
                  : null;

                return (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    locale={currentLocale}
                    className="group overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#11100D] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#D8BD8A]/35"
                  >
                    <div className="relative aspect-[5/4] overflow-hidden bg-[#15130F]">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={image?.alt_text || translation?.name || product.slug}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover opacity-82 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,189,138,0.22),rgba(255,255,255,0.04)_40%,rgba(0,0,0,0.76))]" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent" />

                      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/38 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/62 backdrop-blur-md">
                        KHATT
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-[#D8BD8A]">
                            {translation?.short_description || product.slug}
                          </p>
                          <h3 className="mt-2 line-clamp-2 text-2xl font-semibold leading-8 text-white">
                            {translation?.name || product.slug}
                          </h3>
                        </div>

                        <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D8BD8A] text-black transition group-hover:bg-[#E7D2A8] sm:inline-flex">
                          <ArrowRight size={17} />
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 p-5">
                      <div>
                        <p className="text-xs text-white/38">
                          {localLabels.viewDetails}
                        </p>
                        <p className="mt-1 text-xl font-semibold text-white">
                          {product.price} {product.currency}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-2 rounded-full border border-[#D8BD8A]/28 px-4 py-2 text-sm font-semibold text-[#D8BD8A] transition group-hover:bg-[#D8BD8A] group-hover:text-black">
                        {localLabels.viewDetails}
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.03] px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <p className="text-xl font-semibold text-white">
                {localLabels.noProductsTitle}
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/55">
                {localLabels.noProductsDescription}
              </p>

              <Link
                href="/shop"
                locale={currentLocale}
                className="mt-7 inline-flex items-center justify-center rounded-full border border-[#D8BD8A]/35 px-6 py-3 text-sm font-semibold text-[#D8BD8A] transition hover:bg-[#D8BD8A] hover:text-black"
              >
                {localLabels.resetFilters}
              </Link>
            </div>
          )}

          <div className="mt-10 rounded-[2.2rem] border border-[#D8BD8A]/20 bg-[linear-gradient(135deg,rgba(216,189,138,0.13),rgba(255,255,255,0.025))] p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                  {localLabels.helperTitle}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  {localLabels.helperDescription}
                </p>
              </div>

              <Link
                href="/contact"
                locale={currentLocale}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D8BD8A] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#E7D2A8]"
              >
                {localLabels.helperCta}
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function SortLink({
  locale,
  category,
  value,
  currentSort,
  children,
}: {
  locale: Locale;
  category: string | null;
  value: SortValue;
  currentSort: SortValue;
  children: React.ReactNode;
}) {
  const isActive = currentSort === value;

  return (
    <Link
      href={buildShopHref({ category, sort: value })}
      locale={locale}
      className={
        isActive
          ? "flex items-center justify-between rounded-2xl bg-[#D8BD8A] px-4 py-3 text-sm font-semibold text-black"
          : "flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/62 transition hover:border-[#D8BD8A]/35 hover:text-white"
      }
    >
      <span>{children}</span>
      {isActive ? <ArrowRight size={14} /> : null}
    </Link>
  );
}

function CategoryLink({
  locale,
  category,
  currentCategory,
  sort,
  children,
}: {
  locale: Locale;
  category: string | null;
  currentCategory: string | null;
  sort: SortValue;
  children: React.ReactNode;
}) {
  const isActive = category === currentCategory;

  return (
    <Link
      href={buildShopHref({ category, sort })}
      locale={locale}
      className={
        isActive
          ? "shrink-0 rounded-full bg-[#D8BD8A] px-5 py-2.5 text-sm font-semibold text-black"
          : "shrink-0 rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/62 transition hover:border-[#D8BD8A]/40 hover:text-white"
      }
    >
      {children}
    </Link>
  );
}