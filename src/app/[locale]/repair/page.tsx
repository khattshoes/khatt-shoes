import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { routing } from "@/i18n/routing";

const repairServices = [
  "Sole replacement",
  "Color restoration",
  "Leather cleaning",
  "Stitching repair",
  "Polishing",
  "Full restoration",
];

export default async function RepairPage({
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
      <PageHero title={t.repairTitle} description={t.repairDescription} />

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
              Repair process
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              Professional shoe restoration
            </h2>
            <p className="mt-5 leading-8 text-white/60">
              Send us your shoe condition, problem details and preferred service.
              We will review it and contact you with an estimated solution.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {repairServices.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-[#111] p-6"
              >
                <span className="mb-5 block h-2 w-2 rounded-full bg-[#D6C2A8]" />
                <h3 className="font-medium">{item}</h3>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}