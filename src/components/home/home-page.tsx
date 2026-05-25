import Image from "next/image";
import { ArrowRight, Hammer,  Scissors, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import type { Locale } from "@/i18n/routing";

type HomeMessages = typeof import("@/messages/az.json").Home;

type HomeProduct = {
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

type HomePageProps = {
  locale: Locale;
  t: HomeMessages;
  featuredProducts: HomeProduct[];
};

const localText = {
  az: {
    heroTag: "Əl işi ayaqqabı atelyesi",
    categories: "Xidmətlər",
    featured: "Seçilmiş məhsullar",
    viewAll: "Hamısına bax",
    shopNow: "Mağazaya keç",
    noProducts: "Ana səhifə üçün seçilmiş məhsul əlavə olunmayıb.",
    repairTitle: "Ayaqqabılarınız üçün peşəkar bərpa",
    repairText:
      "Təmizləmə, rəng bərpası, altlıq dəyişimi və dəriyə qulluq işləri atelyemizdə səliqəli şəkildə icra olunur.",
    customTitle: "Fərdi ölçü və istəyə uyğun model",
    customText:
      "Material, rəng və ölçü seçiminizi paylaşın, sizə uyğun fərdi ayaqqabı təklifi hazırlayaq.",
    repairButton: "Təmir xidməti",
    customButton: "Fərdi sifariş",
  },
  en: {
    heroTag: "Handmade footwear atelier",
    categories: "Services",
    featured: "Featured products",
    viewAll: "View all",
    shopNow: "Go to shop",
    noProducts: "No featured products have been added for the home page yet.",
    repairTitle: "Professional restoration for your shoes",
    repairText:
      "Cleaning, color restoration, sole replacement and leather care are handled carefully in our atelier.",
    customTitle: "Custom models based on your size and preference",
    customText:
      "Share your material, color and size preferences, and we will prepare a tailored footwear offer.",
    repairButton: "Repair service",
    customButton: "Custom order",
  },
  ru: {
    heroTag: "Ателье обуви ручной работы",
    categories: "Услуги",
    featured: "Избранные товары",
    viewAll: "Смотреть все",
    shopNow: "Перейти в магазин",
    noProducts: "Для главной страницы пока не добавлены избранные товары.",
    repairTitle: "Профессиональное восстановление обуви",
    repairText:
      "Чистка, восстановление цвета, замена подошвы и уход за кожей выполняются аккуратно в нашем ателье.",
    customTitle: "Индивидуальные модели по вашему размеру и пожеланиям",
    customText:
      "Поделитесь предпочтениями по материалу, цвету и размеру, и мы подготовим индивидуальное предложение.",
    repairButton: "Ремонт обуви",
    customButton: "Индивидуальный заказ",
  },
};

function getProductTranslation(product: HomeProduct, locale: Locale) {
  return (
    product.product_translations.find((item) => item.locale === locale) ??
    product.product_translations[0]
  );
}

function getProductImage(product: HomeProduct) {
  return (
    product.product_images.find((item) => item.is_primary) ??
    [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)[0]
  );
}

function isSafeImageSrc(src?: string | null) {
  if (!src) return false;
  return src.startsWith("/") || src.startsWith("https://");
}

export function HomePage({ locale, t, featuredProducts }: HomePageProps) {
  const text = localText[locale];

  const services = [
    {
      href: "/shop",
      icon: ShoppingBag,
      title: t.serviceShopTitle,
      description: t.serviceShopDescription,
    },
    {
      href: "/custom-order",
      icon: Scissors,
      title: t.serviceCustomTitle,
      description: t.serviceCustomDescription,
    },
    {
      href: "/repair",
      icon: Hammer,
      title: t.serviceRepairTitle,
      description: t.serviceRepairDescription,
    },
  ] as const;

  return (
    <main className="bg-[#0B0A08] text-[#FFF8EA]">
      <section className="border-b border-white/10 py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[#D8BD8A]">
                {text.heroTag}
              </p>

              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                {t.title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/62">
                {t.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  locale={locale}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D8BD8A] px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-[#E7D2A8]"
                >
                  {text.shopNow}
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/custom-order"
                  locale={locale}
                  className="inline-flex items-center justify-center rounded-full border border-white/12 px-7 py-3.5 text-sm font-semibold text-white/72 transition hover:border-[#D8BD8A]/45 hover:text-[#D8BD8A]"
                >
                  {t.custom}
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[t.heroStatOne, t.heroStatTwo, t.heroStatThree].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white/62"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/[0.035] p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.7rem] bg-[#15130F]">
                <Image
                  src="/images/home/hero-shoe.jpg"
                  alt="KHATT Shoes"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

               
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-14">
        <Container>
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D8BD8A]">
                KHATT
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {text.categories}
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.href}
                  href={service.href}
                  locale={locale}
                  className="group rounded-[1.8rem] border border-white/10 bg-white/[0.035] p-6 transition hover:border-[#D8BD8A]/35 hover:bg-white/[0.055]"
                >
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D8BD8A]/10 text-[#D8BD8A] transition group-hover:bg-[#D8BD8A] group-hover:text-black">
                      <Icon size={19} />
                    </span>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/55">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-[#080706] py-12 sm:py-14">
        <Container>
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D8BD8A]">
                KHATT
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {text.featured}
              </h2>
            </div>

            <Link
              href="/shop"
              locale={locale}
              className="hidden items-center gap-2 text-sm font-semibold text-[#D8BD8A] transition hover:text-white sm:inline-flex"
            >
              {text.viewAll}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featuredProducts.length ? (
              featuredProducts.map((product) => {
                const translation = getProductTranslation(product, locale);
                const image = getProductImage(product);
                const imageUrl = isSafeImageSrc(image?.image_url)
                  ? image?.image_url
                  : null;

                return (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    locale={locale}
                    className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#11100D] transition hover:border-[#D8BD8A]/35"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#15130F]">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={image?.alt_text || translation?.name || product.slug}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,189,138,0.2),rgba(255,255,255,0.04)_42%,rgba(0,0,0,0.74))]" />
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-xs uppercase tracking-[0.22em] text-[#D8BD8A]">
                        {translation?.short_description || "KHATT Shoes"}
                      </p>
                      <h3 className="mt-3 text-lg font-semibold text-white">
                        {translation?.name || product.slug}
                      </h3>
                      <p className="mt-3 text-sm text-white/58">
                        {product.price} {product.currency}
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full rounded-[1.8rem] border border-white/10 bg-white/[0.035] p-7 text-center text-white/55">
                {text.noProducts}
              </div>
            )}
          </div>

          <Link
            href="/shop"
            locale={locale}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D8BD8A] transition hover:text-white sm:hidden"
          >
            {text.viewAll}
            <ArrowRight size={16} />
          </Link>
        </Container>
      </section>

      
    </main>
  );
}