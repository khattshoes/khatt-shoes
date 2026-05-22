import {
  ArrowRight,
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
    category: "Formal leather",
    price: "280 AZN",
  },
  {
    name: "Derby Artisan",
    category: "Handmade daily",
    price: "320 AZN",
  },
  {
    name: "Loafer Signature",
    category: "Premium comfort",
    price: "260 AZN",
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
    <main className="bg-[#0D0D0D] text-[#F5F3EF]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(214,194,168,0.12),rgba(13,13,13,0.96)_38%,rgba(80,48,25,0.22))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,194,168,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(116,72,38,0.24),transparent_38%)]" />
        <div className="absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-[#D6C2A8]/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0D0D0D] to-transparent" />

        <Container className="relative grid min-h-[calc(100vh-80px)] items-center gap-12 py-20 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <p className="mb-6 inline-flex rounded-full border border-[#D6C2A8]/30 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#D6C2A8] backdrop-blur-md">
              {t.heroBadge}
            </p>

            <h1 className="max-w-5xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#F5F3EF] md:text-7xl">
              {t.title}
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">
              {t.description}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/shop"
                locale={locale}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D6C2A8] px-8 py-4 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
              >
                {t.shop}
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/custom-order"
                locale={locale}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/20 px-8 py-4 text-sm font-medium text-white/85 backdrop-blur-md transition hover:border-[#D6C2A8] hover:text-[#D6C2A8]"
              >
                {t.custom}
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[t.heroStatOne, t.heroStatTwo, t.heroStatThree].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/10 bg-black/25 p-4 backdrop-blur-md"
                >
                  <p className="text-sm leading-6 text-white/70">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-[#D6C2A8]/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.8rem] border border-white/10 bg-black/35 p-3 shadow-2xl backdrop-blur-md">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.2rem] bg-[#111]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,194,168,0.30),rgba(255,255,255,0.04)_38%,rgba(0,0,0,0.78))]" />
                <div className="absolute inset-8 rounded-[2rem] border border-[#D6C2A8]/20" />
                <div className="absolute left-1/2 top-1/2 h-40 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D6C2A8]/20 blur-2xl" />

                <div className="absolute left-1/2 top-[45%] h-24 w-72 -translate-x-1/2 -rotate-6 rounded-full border border-[#D6C2A8]/30 bg-black/25 shadow-2xl" />
                <div className="absolute left-[52%] top-[42%] h-16 w-48 -translate-x-1/2 -rotate-6 rounded-full bg-[#D6C2A8]/10 blur-xl" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#D6C2A8]/30 bg-black/45 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#D6C2A8] backdrop-blur-md">
                    <Sparkles size={14} />
                    Handmade detail
                  </div>

                  <p className="mt-5 max-w-sm text-2xl font-semibold leading-tight text-white">
                    Leather craft, precise repair and timeless style.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24">
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
                  className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 transition hover:border-[#D6C2A8]/40 hover:bg-white/[0.05]"
                >
                  <div className="mb-7 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#D6C2A8]/10 text-[#D6C2A8]">
                    <Icon size={20} />
                  </div>

                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/55">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-[#080808] py-24">
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
              className="inline-flex w-fit items-center gap-2 text-sm text-[#D6C2A8] hover:text-white"
            >
              {t.shop}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <div
                key={product.name}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#111]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#151515]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,194,168,0.22),rgba(255,255,255,0.04)_40%,rgba(0,0,0,0.72))]" />
                  <div className="absolute inset-x-10 bottom-10 h-16 rounded-full bg-[#D6C2A8]/20 blur-xl transition duration-700 group-hover:scale-110" />
                  <div className="absolute left-1/2 top-1/2 h-12 w-44 -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-full border border-[#D6C2A8]/25 bg-black/25" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                </div>

                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#D6C2A8]">
                    {product.category}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold">
                    {product.name}
                  </h3>
                  <p className="mt-4 text-white/55">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-3">
            <div className="relative aspect-square overflow-hidden rounded-[2rem]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(214,194,168,0.18),rgba(255,255,255,0.04),rgba(0,0,0,0.72))]" />
              <div className="absolute left-8 top-8 h-24 w-24 rounded-full border border-[#D6C2A8]/25" />
              <div className="absolute bottom-16 right-10 h-36 w-36 rounded-full bg-[#D6C2A8]/10 blur-2xl" />
              <div className="absolute left-1/2 top-1/2 h-20 w-72 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-full border border-white/10 bg-black/30" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/10 bg-black/35 p-5 backdrop-blur-md">
                <p className="text-sm leading-7 text-white/75">
                  Material selection, handmade stitching and careful finishing.
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
                    className="flex gap-4 rounded-2xl border border-white/10 p-5"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#D6C2A8]" />
                    <p className="text-white/65">{point}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-[#080808] py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow={t.repairEyebrow}
              title={t.repairTitle}
              description={t.repairDescription}
            />

            <Link
              href="/repair"
              locale={locale}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#D6C2A8] px-7 py-4 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
            >
              {t.repairCta}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-[#151515] p-4">
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/35">
                Before
              </p>

              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white/[0.04]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(0,0,0,0.88))]" />
                <div className="absolute inset-x-8 bottom-12 h-12 rounded-full bg-white/10 blur-xl" />
                <div className="absolute left-1/2 top-1/2 h-14 w-44 -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-full border border-white/10 bg-black/30" />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#D6C2A8]/30 bg-[#151515] p-4">
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#D6C2A8]">
                After
              </p>

              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white/[0.04]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(214,194,168,0.22),rgba(0,0,0,0.78))]" />
                <div className="absolute inset-x-8 bottom-12 h-12 rounded-full bg-[#D6C2A8]/25 blur-xl" />
                <div className="absolute left-1/2 top-1/2 h-14 w-44 -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-full border border-[#D6C2A8]/30 bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="rounded-[2.5rem] border border-[#D6C2A8]/20 bg-[linear-gradient(135deg,rgba(214,194,168,0.16),rgba(255,255,255,0.03))] p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
                  {t.customCtaTitle}
                </h2>
                <p className="mt-5 max-w-2xl text-white/60">
                  {t.customCtaDescription}
                </p>
              </div>

              <Link
                href="/custom-order"
                locale={locale}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D6C2A8] px-8 py-4 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
              >
                {t.customCtaButton}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-[#080808] py-24">
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
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7"
              >
                <p className="text-sm leading-7 text-white/65">
                  “{item.text}”
                </p>
                <p className="mt-6 text-sm font-medium text-[#D6C2A8]">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#D6C2A8]">
              KHATT Shoes
            </p>
            <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
              {t.contactCtaTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/60">
              {t.contactCtaDescription}
            </p>

            <Link
              href="/contact"
              locale={locale}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#D6C2A8]/40 px-8 py-4 text-sm text-[#D6C2A8] transition hover:bg-[#D6C2A8] hover:text-black"
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