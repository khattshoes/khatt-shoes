import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { routing } from "@/i18n/routing";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const t = messages.Pages;

  return (
    <main className="bg-[#0D0D0D] text-[#F5F3EF]">
      <PageHero title={t.aboutTitle} description={t.aboutDescription} />

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-3">
            <div className="relative aspect-square overflow-hidden rounded-[2rem]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(214,194,168,0.18),rgba(255,255,255,0.04),rgba(0,0,0,0.72))]" />
              <div className="absolute left-8 top-8 h-24 w-24 rounded-full border border-[#D6C2A8]/25" />
              <div className="absolute bottom-16 right-10 h-36 w-36 rounded-full bg-[#D6C2A8]/10 blur-2xl" />
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
              Atelier philosophy
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
              Handmade quality, careful repair and timeless style.
            </h2>
            <p className="mt-6 leading-8 text-white/60">
              KHATT Shoes combines artisan craft, leather knowledge and careful
              finishing to create a premium footwear experience in Azerbaijan.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}