import Image from "next/image";
import {
  ArrowRight,
  Check,
  Hammer,
  Scissors,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/home/section-heading";
import type { Locale } from "@/i18n/routing";

type HomeMessages = typeof import("@/messages/az.json").Home;

type HomePageProps = {
  locale: Locale;
  t: HomeMessages;
};

const featuredProducts = [
  {
    name: "Oxford Classic",
    category: "Klassik dəri",
    price: "280 AZN",
    image: "/images/home/product-1.jpg",
  },
  {
    name: "Derby Artisan",
    category: "Əl işi gündəlik",
    price: "320 AZN",
    image: "/images/home/product-2.jpg",
  },
  {
    name: "Loafer Signature",
    category: "Premium rahatlıq",
    price: "260 AZN",
    image: null,
  },
];

const testimonials = [
  {
    name: "Rəşad M.",
    text: "Ayaqqabının həm görünüşü, həm də rahatlığı premium səviyyədədir.",
  },
  {
    name: "Kamran A.",
    text: "Təmir etdirdiyim ayaqqabı əvvəlkindən daha yaxşı görünür.",
  },
  {
    name: "Nigar H.",
    text: "Fərdi sifariş prosesi çox səliqəli və peşəkar idi.",
  },
];

export function HomePage({ locale, t }: HomePageProps) {
  const services = [
    {
      icon: ShoppingBag,
      title: t.serviceShopTitle,
      description: t.serviceShopDescription,
    },
    {
      icon: Scissors,
      title: t.serviceCustomTitle,
      description: t.serviceCustomDescription,
    },
    {
      icon: Hammer,
      title: t.serviceRepairTitle,
      description: t.serviceRepairDescription,
    },
  ];

  return (
    <main className="bg-[#0B0A08] text-[#FFF8EA]">
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden border-b border-white/10">
        <Image
          src="/images/home/hero-shoe.jpg"
          alt="KHATT Shoes premium əl işi ayaqqabı"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,10,8,0.97)_0%,rgba(11,10,8,0.88)_38%,rgba(11,10,8,0.48)_68%,rgba(11,10,8,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(216,189,138,0.18),transparent_32rem),radial-gradient(circle_at_10%_80%,rgba(138,90,47,0.22),transparent_34rem)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0A08] to-transparent" />

        <Container className="relative flex min-h-[calc(100vh-80px)] items-center py-20">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex rounded-full border border-[#D8BD8A]/35 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#D8BD8A] backdrop-blur-md">
              {t.heroBadge}
            </p>

            <h1 className="max-w-5xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-[#FFF8EA] sm:text-6xl md:text-7xl">
              {t.title}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              {t.description}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/shop"
                locale={locale}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D8BD8A] px-8 py-4 text-sm font-semibold text-black shadow-[0_18px_45px_rgba(216,189,138,0.16)] transition hover:bg-[#E7D2A8]"
              >
                {t.shop}
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/custom-order"
                locale={locale}
                className="inline-flex items-center justify-center rounded-full border border-white/18 bg-black/28 px-8 py-4 text-sm font-semibold text-white/88 backdrop-blur-md transition hover:border-[#D8BD8A] hover:text-[#D8BD8A]"
              >
                {t.custom}
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[t.heroStatOne, t.heroStatTwo, t.heroStatThree].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/10 bg-black/35 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md"
                >
                  <p className="text-sm leading-6 text-white/72">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-8 right-5 hidden max-w-sm rounded-[2rem] border border-[#D8BD8A]/25 bg-black/38 p-5 backdrop-blur-xl lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8BD8A]/30 bg-black/45 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#D8BD8A]">
              <Sparkles size={14} />
              Əl işi detal
            </div>
            <p className="mt-4 text-xl font-semibold leading-tight text-white">
              Dəri ustalığı, dəqiq bərpa və zamansız stil.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={t.servicesEyebrow}
            title={t.servicesTitle}
            description={t.servicesDescription}
            align="center"
          />

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:-translate-y-1 hover:border-[#D8BD8A]/40 hover:bg-white/[0.05]"
                >
                  <div className="mb-7 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#D8BD8A]/10 text-[#D8BD8A] transition group-hover:bg-[#D8BD8A] group-hover:text-black">
                    <Icon size={20} />
                  </div>

                  <h3 className="text-xl font-semibold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/56">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-[#080706] py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow={t.featuredEyebrow}
              title={t.featuredTitle}
              description={t.featuredDescription}
            />

            <Link
              href="/shop"
              locale={locale}
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#D8BD8A] transition hover:text-white"
            >
              {t.shop}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <div
                key={product.name}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#11100D] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:-translate-y-1 hover:border-[#D8BD8A]/35"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#15130F]">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-72 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,189,138,0.22),rgba(255,255,255,0.04)_40%,rgba(0,0,0,0.76))]" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs text-white/62 backdrop-blur-md">
                    KHATT
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#D8BD8A]">
                    {product.category}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {product.name}
                  </h3>
                  <p className="mt-4 text-white/56">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="relative aspect-square overflow-hidden rounded-[2rem]">
              <Image
                src="/images/home/craft.jpg"
                alt="KHATT Shoes atelye prosesi"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-78"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/12 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-md">
                <p className="text-sm leading-7 text-white/78">
                  Material seçimi, əl tikişi və səliqəli final işlənməsi.
                </p>
              </div>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow={t.craftEyebrow}
              title={t.craftTitle}
              description={t.craftDescription}
            />

            <div className="mt-8 space-y-4">
              {[t.craftPointOne, t.craftPointTwo, t.craftPointThree].map(
                (point) => (
                  <div
                    key={point}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                  >
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D8BD8A]/12 text-[#D8BD8A]">
                      <Check size={14} />
                    </span>
                    <p className="text-white/66">{point}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-[#080706] py-20 sm:py-24">
        <Image
          src="/images/home/repair.jpg"
          alt="KHATT Shoes ayaqqabı bərpası"
          fill
          sizes="100vw"
          className="object-cover opacity-18"
        />
        <div className="absolute inset-0 bg-[#080706]/82" />

        <Container className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow={t.repairEyebrow}
              title={t.repairTitle}
              description={t.repairDescription}
            />

            <Link
              href="/repair"
              locale={locale}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#D8BD8A] px-7 py-4 text-sm font-semibold text-black transition hover:bg-[#E7D2A8]"
            >
              {t.repairCta}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
           <div className="rounded-[2rem] border border-white/10 bg-black/36 p-4 backdrop-blur-md">
  <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/40">
    Əvvəl
  </p>

  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white/[0.04]">
    <Image
      src="/images/home/repair-before.jpg"
      alt="Təmirdən əvvəl köhnə ayaqqabı"
      fill
      sizes="(max-width: 768px) 50vw, 25vw"
      className="object-cover opacity-62 grayscale"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
  </div>
</div>

            <div className="rounded-[2rem] border border-[#D8BD8A]/30 bg-black/36 p-4 backdrop-blur-md">
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#D8BD8A]">
                Sonra
              </p>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white/[0.04]">
                <Image
                  src="/images/home/repair.jpg"
                  alt="Bərpa edilmiş ayaqqabı"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="rounded-[2.5rem] border border-[#D8BD8A]/20 bg-[linear-gradient(135deg,rgba(216,189,138,0.16),rgba(255,255,255,0.03))] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-white md:text-5xl">
                  {t.customCtaTitle}
                </h2>
                <p className="mt-5 max-w-2xl text-white/62">
                  {t.customCtaDescription}
                </p>
              </div>

              <Link
                href="/custom-order"
                locale={locale}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D8BD8A] px-8 py-4 text-sm font-semibold text-black transition hover:bg-[#E7D2A8]"
              >
                {t.customCtaButton}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-[#080706] py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={t.testimonialsEyebrow}
            title={t.testimonialsTitle}
            align="center"
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <p className="text-sm leading-7 text-white/66">
                  “{item.text}”
                </p>
                <p className="mt-6 text-sm font-semibold text-[#D8BD8A]">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#D8BD8A]">
              KHATT Shoes
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-white md:text-5xl">
              {t.contactCtaTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/62">
              {t.contactCtaDescription}
            </p>

            <Link
              href="/contact"
              locale={locale}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#D8BD8A]/40 px-8 py-4 text-sm font-semibold text-[#D8BD8A] transition hover:bg-[#D8BD8A] hover:text-black"
            >
              {t.contactCtaButton}
              <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}