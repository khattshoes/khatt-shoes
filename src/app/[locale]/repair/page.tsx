import Image from "next/image";
import {
  ArrowRight,
  Brush,
  CheckCircle2,
  Hammer,
  MessageCircle,
  Palette,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Locale = "az" | "en" | "ru";

const content = {
  az: {
    eyebrow: "Təmir və bərpa",
    introTitle: "Ayaqqabınızın görünüşünü və istifadə rahatlığını yeniləyirik",
    introDescription:
      "Təmir prosesi ayaqqabının vəziyyəti, materialı və ehtiyac duyulan iş həcmi nəzərə alınaraq aparılır. Məqsəd ayaqqabınızı daha səliqəli, rahat və uzunömürlü vəziyyətə gətirməkdir.",
    contactCta: "Təmir üçün əlaqə saxlayın",
    consultCta: "Məsləhət alın",
    servicesEyebrow: "Xidmətlər",
    servicesTitle: "Təmir və bərpa xidmətləri",
    processEyebrow: "Proses",
    processTitle: "Təmir prosesi necə aparılır?",
    beforeAfterEyebrow: "Əvvəl / Sonra",
    beforeAfterTitle: "Düzgün qulluq və bərpa ilə ayaqqabının görünüşü dəyişir",
    beforeAfterDescription:
      "Təmizləmə, rəng bərpası, cilalama və dəriyə qulluq işləri ayaqqabının ümumi görünüşünü və istifadə müddətini yaxşılaşdırır.",
    before: "Əvvəl",
    after: "Sonra",
    noteTitle: "Qiymətləndirmə necə edilir?",
    noteText:
      "Təmir qiyməti ayaqqabının vəziyyətinə, materialına və görüləcək işin həcminə görə müəyyən olunur. Şəkil və qısa məlumat göndərdikdən sonra sizə ilkin təklif təqdim edilir.",
    services: [
      {
        title: "Altlıq dəyişimi",
        text: "Köhnəlmiş və ya zədələnmiş altlığın yenilənməsi.",
      },
      {
        title: "Rəng bərpası",
        text: "Solmuş və zədələnmiş dəri səthinin rəng baxımından yenilənməsi.",
      },
      {
        title: "Dəri təmizliyi",
        text: "Dərinin səthinə uyğun təmizləmə və qulluq prosesi.",
      },
      {
        title: "Tikiş təmiri",
        text: "Açılmış və ya zədələnmiş tikiş hissələrinin bərpası.",
      },
      {
        title: "Cilalama",
        text: "Ayaqqabıya daha səliqəli və baxımlı görünüş verilməsi.",
      },
      {
        title: "Tam bərpa",
        text: "Təmizləmə, rəng, tikiş, altlıq və final qulluq işlərinin birlikdə icrası.",
      },
    ],
    steps: [
      "Ayaqqabının vəziyyətini və problemini bizimlə paylaşırsınız.",
      "Atelye tərəfindən ilkin baxış və qiymətləndirmə aparılır.",
      "Görüləcək işlər, müddət və qiymət sizinlə razılaşdırılır.",
      "Təmir tamamlandıqdan sonra nəticə təqdim olunur.",
    ],
  },
  en: {
    eyebrow: "Repair and restoration",
    introTitle: "We refresh the look and comfort of your shoes",
    introDescription:
      "The repair process is planned according to the shoe condition, material and required workload. The goal is to restore a cleaner, more comfortable and longer-lasting result.",
    contactCta: "Contact for repair",
    consultCta: "Get advice",
    servicesEyebrow: "Services",
    servicesTitle: "Repair and restoration services",
    processEyebrow: "Process",
    processTitle: "How does the repair process work?",
    beforeAfterEyebrow: "Before / After",
    beforeAfterTitle: "Proper care and restoration can transform the look",
    beforeAfterDescription:
      "Cleaning, color restoration, polishing and leather care improve both the appearance and lifespan of your shoes.",
    before: "Before",
    after: "After",
    noteTitle: "How is pricing estimated?",
    noteText:
      "Repair pricing depends on condition, material and required work. After you send photos and a short description, an initial offer is prepared for you.",
    services: [
      {
        title: "Sole replacement",
        text: "Renewing worn or damaged soles.",
      },
      {
        title: "Color restoration",
        text: "Refreshing faded or damaged leather surfaces.",
      },
      {
        title: "Leather cleaning",
        text: "Cleaning and care according to the leather surface.",
      },
      {
        title: "Stitching repair",
        text: "Restoring opened or damaged stitching areas.",
      },
      {
        title: "Polishing",
        text: "Giving the shoes a cleaner and better-maintained look.",
      },
      {
        title: "Full restoration",
        text: "Cleaning, color, stitching, sole and final care combined.",
      },
    ],
    steps: [
      "You share the shoe condition and issue with us.",
      "The atelier reviews and estimates the required work.",
      "The scope, timeline and price are agreed with you.",
      "After completion, the restored result is presented.",
    ],
  },
  ru: {
    eyebrow: "Ремонт и восстановление",
    introTitle: "Мы обновляем внешний вид и удобство вашей обуви",
    introDescription:
      "Процесс ремонта планируется с учетом состояния обуви, материала и объема работы. Цель — вернуть обуви аккуратный вид, комфорт и более долгий срок службы.",
    contactCta: "Связаться для ремонта",
    consultCta: "Получить консультацию",
    servicesEyebrow: "Услуги",
    servicesTitle: "Услуги ремонта и восстановления",
    processEyebrow: "Процесс",
    processTitle: "Как проходит ремонт?",
    beforeAfterEyebrow: "До / После",
    beforeAfterTitle: "Правильный уход и восстановление меняют внешний вид",
    beforeAfterDescription:
      "Чистка, восстановление цвета, полировка и уход за кожей улучшают внешний вид и срок службы обуви.",
    before: "До",
    after: "После",
    noteTitle: "Как рассчитывается цена?",
    noteText:
      "Стоимость ремонта зависит от состояния обуви, материала и объема работы. После фото и краткого описания для вас готовится предварительное предложение.",
    services: [
      {
        title: "Замена подошвы",
        text: "Обновление изношенной или поврежденной подошвы.",
      },
      {
        title: "Восстановление цвета",
        text: "Обновление потускневшей или поврежденной кожаной поверхности.",
      },
      {
        title: "Чистка кожи",
        text: "Чистка и уход с учетом типа кожаной поверхности.",
      },
      {
        title: "Ремонт строчки",
        text: "Восстановление раскрытых или поврежденных швов.",
      },
      {
        title: "Полировка",
        text: "Придание обуви более аккуратного и ухоженного вида.",
      },
      {
        title: "Полное восстановление",
        text: "Чистка, цвет, строчка, подошва и финальный уход вместе.",
      },
    ],
    steps: [
      "Вы делитесь состоянием обуви и описанием проблемы.",
      "Ателье проводит первичный осмотр и оценку.",
      "Объем работ, срок и цена согласовываются с вами.",
      "После завершения вам предоставляется результат.",
    ],
  },
};

const serviceIcons = [Wrench, Palette, Brush, Hammer, Sparkles, ShieldCheck];

export default async function RepairPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const messages = (await import(`../../../messages/${currentLocale}.json`))
    .default;
  const pageText = messages.Pages;
  const t = content[currentLocale];

  return (
    <main className="bg-[#0B0A08] text-[#FFF8EA]">
      <PageHero
        eyebrow={t.eyebrow}
        title={pageText.repairTitle}
        description={pageText.repairDescription}
      />

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
            <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(216,189,138,0.14),rgba(255,255,255,0.035))] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-10">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D8BD8A]/10 blur-3xl" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D8BD8A]/25 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#D8BD8A] backdrop-blur-md">
                  <Sparkles size={14} />
                  {t.eyebrow}
                </div>

                <h2 className="max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-5xl">
                  {t.introTitle}
                </h2>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">
                  {t.introDescription}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    locale={currentLocale}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D8BD8A] px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-[#E7D2A8]"
                  >
                    {t.contactCta}
                    <ArrowRight size={15} />
                  </Link>

                  <Link
                    href="/shop"
                    locale={currentLocale}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-3.5 text-sm font-semibold text-white/68 transition hover:border-[#D8BD8A]/40 hover:text-[#D8BD8A]"
                  >
                    {messages.Nav.shop}
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-[2.4rem] border border-[#D8BD8A]/20 bg-white/[0.035] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#D8BD8A]/10 text-[#D8BD8A]">
                <MessageCircle size={20} />
              </div>

              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-white">
                {t.noteTitle}
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/58">
                {t.noteText}
              </p>

              <Link
                href="/contact"
                locale={currentLocale}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D8BD8A]/35 bg-[#D8BD8A]/10 px-6 py-3 text-sm font-semibold text-[#D8BD8A] transition hover:bg-[#D8BD8A] hover:text-black"
              >
                {t.consultCta}
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="mt-14">
            <div className="mb-8 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-[#D8BD8A]">
                {t.servicesEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white md:text-4xl">
                {t.servicesTitle}
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {t.services.map((service, index) => {
                const Icon = serviceIcons[index] ?? CheckCircle2;

                return (
                  <div
                    key={service.title}
                    className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:-translate-y-1 hover:border-[#D8BD8A]/35"
                  >
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#D8BD8A]/10 text-[#D8BD8A] transition group-hover:bg-[#D8BD8A] group-hover:text-black">
                      <Icon size={20} />
                    </div>

                    <h3 className="text-xl font-semibold leading-7 text-white">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-white/56">
                      {service.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#D8BD8A]">
                {t.beforeAfterEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] text-white md:text-4xl">
                {t.beforeAfterTitle}
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/60">
                {t.beforeAfterDescription}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-black/36 p-4 backdrop-blur-md">
                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/40">
                  {t.before}
                </p>

                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white/[0.04]">
                  <Image
                    src="/images/home/repair-before.jpg"
                    alt={t.before}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover opacity-62 grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#D8BD8A]/30 bg-black/36 p-4 backdrop-blur-md">
                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#D8BD8A]">
                  {t.after}
                </p>

                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white/[0.04]">
                  <Image
                    src="/images/home/repair.jpg"
                    alt={t.after}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover opacity-82"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#D8BD8A]">
                {t.processEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] text-white md:text-4xl">
                {t.processTitle}
              </h2>
            </div>

            <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
              <div className="grid gap-3">
                {t.steps.map((item, index) => (
                  <div
                    key={item}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D8BD8A]/12 text-xs font-semibold text-[#D8BD8A]">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-7 text-white/62">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 rounded-[2.4rem] border border-[#D8BD8A]/20 bg-[linear-gradient(135deg,rgba(216,189,138,0.14),rgba(255,255,255,0.025))] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-9">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                  {t.noteTitle}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  {t.noteText}
                </p>
              </div>

              <Link
                href="/contact"
                locale={currentLocale}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D8BD8A] px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-[#E7D2A8]"
              >
                <MessageCircle size={16} />
                {t.consultCta}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}