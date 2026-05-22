import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { routing } from "@/i18n/routing";

export default async function ContactPage({
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
      <PageHero title={t.contactTitle} description={t.contactDescription} />

      <section className="py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
              Contact
            </p>

            <div className="mt-8 space-y-5 text-white/65">
              <p>Baku, Azerbaijan</p>
              <p>Instagram: @khatt.shoes</p>
              <p>WhatsApp: +994 XX XXX XX XX</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#111] p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
              Request form
            </p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white/35">
                Name
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white/35">
                Phone
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white/35">
                Message
              </div>
              <button className="rounded-full bg-[#D6C2A8] px-6 py-4 text-sm font-medium text-black transition hover:bg-[#c4ad90]">
                Send request
              </button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}