import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { routing } from "@/i18n/routing";

const items = Array.from({ length: 9 }, (_, index) => index + 1);

export default async function GalleryPage({
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
      <PageHero title={t.galleryTitle} description={t.galleryDescription} />

      <section className="py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item}
                className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-[#111]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,194,168,0.22),rgba(255,255,255,0.04)_40%,rgba(0,0,0,0.72))]" />
                <div className="absolute inset-x-10 bottom-14 h-16 rounded-full bg-[#D6C2A8]/20 blur-xl transition duration-700 group-hover:scale-110" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#D6C2A8]">
                    Work sample {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}