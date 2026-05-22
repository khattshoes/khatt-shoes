import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { routing } from "@/i18n/routing";

const steps = [
  "Share your preferred model and size",
  "Select leather, color and details",
  "Confirm atelier offer",
  "Production and final fitting",
];

export default async function CustomOrderPage({
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
      <PageHero title={t.customTitle} description={t.customDescription} />

      <section className="py-20">
        <Container>
          <div className="grid gap-5 md:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
                  Step {index + 1}
                </p>
                <h3 className="mt-5 text-lg font-semibold leading-7">{step}</h3>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}