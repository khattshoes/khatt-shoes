import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  Palette,
  Ruler,
  Scissors,
  Sparkles,
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
    eyebrow: "Fərdi sifariş",
    introTitle: "Ayaqqabınız ölçünüzə, zövqünüzə və istifadə məqsədinizə uyğun hazırlanır",
    introDescription:
      "Fərdi sifariş prosesi model seçimi, material, rəng, ölçü və istifadə rahatlığı nəzərə alınaraq mərhələli şəkildə aparılır. Məqsəd sizə uyğun, səliqəli və uzunömürlü nəticə əldə etməkdir.",
    contactCta: "Sifariş üçün əlaqə saxlayın",
    consultCta: "Məsləhət alın",
    processEyebrow: "Proses",
    processTitle: "Fərdi sifariş necə hazırlanır?",
    detailTitle: "Sifariş zamanı nələr dəqiqləşdirilir?",
    detailDescription:
      "İlk mərhələdə istifadə məqsədiniz, ölçünüz, istədiyiniz model və material seçiminiz müəyyənləşdirilir. Daha sonra atelye tərəfindən sizə uyğun təklif hazırlanır.",
    noteTitle: "Sizə uyğun təklif hazırlanır",
    noteText:
      "Fərdi sifarişlərdə qiymət modelin mürəkkəbliyinə, material seçiminə və iş həcminə görə dəyişə bilər. Detallar danışıldıqdan sonra sizə dəqiq təklif təqdim olunur.",
    timelineTitle: "Təxmini müddət",
    timelineText:
      "Hazırlanma müddəti model və iş həcminə görə dəyişir. Sifariş təsdiqlənməzdən əvvəl sizə real vaxt aralığı bildirilir.",
    steps: [
      {
        title: "Model və istifadə məqsədi",
        text: "Klassik, gündəlik və ya xüsusi tədbir üçün uyğun model seçimi edilir.",
      },
      {
        title: "Ölçü və rahatlıq",
        text: "Ayaq ölçünüz, forma xüsusiyyətləri və rahatlıq gözləntiniz nəzərə alınır.",
      },
      {
        title: "Material və rəng",
        text: "Dəri növü, rəng, tikiş detalları və final görünüş razılaşdırılır.",
      },
      {
        title: "Təklif və təsdiq",
        text: "Qiymət, müddət və hazırlanma detalları təsdiqləndikdən sonra proses başlayır.",
      },
    ],
    details: [
      "Ayaq ölçüsü və istifadə rahatlığı",
      "Model forması və geyim üslubu",
      "Dəri, rəng və tikiş detalları",
      "Altlıq, içlik və final işlənmə",
      "Qiymət və hazırlanma müddəti",
    ],
  },
  en: {
    eyebrow: "Custom order",
    introTitle: "Your shoes are made according to your size, style and purpose",
    introDescription:
      "The custom order process is handled step by step, considering model choice, material, color, size and comfort. The goal is to create a refined and long-lasting result for you.",
    contactCta: "Contact for order",
    consultCta: "Get advice",
    processEyebrow: "Process",
    processTitle: "How does a custom order work?",
    detailTitle: "What is clarified before production?",
    detailDescription:
      "At the first stage, we define your use case, size, preferred model and material choice. Then the atelier prepares a suitable offer for you.",
    noteTitle: "A suitable offer is prepared for you",
    noteText:
      "For custom orders, the price may vary depending on model complexity, material choice and workload. After discussing the details, you receive a clear offer.",
    timelineTitle: "Estimated timeline",
    timelineText:
      "Production time depends on the model and workload. A realistic time range is shared with you before confirmation.",
    steps: [
      {
        title: "Model and purpose",
        text: "A suitable model is selected for formal, daily or special occasion use.",
      },
      {
        title: "Size and comfort",
        text: "Your foot size, shape and comfort expectations are taken into account.",
      },
      {
        title: "Material and color",
        text: "Leather type, color, stitching details and final look are agreed.",
      },
      {
        title: "Offer and confirmation",
        text: "The process starts after price, timeline and production details are confirmed.",
      },
    ],
    details: [
      "Foot size and comfort",
      "Model shape and clothing style",
      "Leather, color and stitching details",
      "Sole, lining and final finishing",
      "Price and production timeline",
    ],
  },
  ru: {
    eyebrow: "Индивидуальный заказ",
    introTitle: "Обувь создается под ваш размер, стиль и назначение",
    introDescription:
      "Процесс индивидуального заказа проходит поэтапно: учитываются модель, материал, цвет, размер и комфорт. Цель — создать аккуратный и долговечный результат для вас.",
    contactCta: "Связаться для заказа",
    consultCta: "Получить консультацию",
    processEyebrow: "Процесс",
    processTitle: "Как проходит индивидуальный заказ?",
    detailTitle: "Что уточняется перед изготовлением?",
    detailDescription:
      "На первом этапе уточняется назначение, размер, желаемая модель и материал. Затем ателье готовит подходящее предложение для вас.",
    noteTitle: "Для вас готовится подходящее предложение",
    noteText:
      "Цена индивидуального заказа зависит от сложности модели, выбранного материала и объема работы. После обсуждения деталей вы получаете точное предложение.",
    timelineTitle: "Ориентировочный срок",
    timelineText:
      "Срок изготовления зависит от модели и объема работы. До подтверждения заказа вам сообщается реалистичный временной диапазон.",
    steps: [
      {
        title: "Модель и назначение",
        text: "Подбирается модель для классического, повседневного или особого случая.",
      },
      {
        title: "Размер и комфорт",
        text: "Учитываются размер стопы, особенности формы и ожидания по удобству.",
      },
      {
        title: "Материал и цвет",
        text: "Согласуются тип кожи, цвет, детали строчки и финальный вид.",
      },
      {
        title: "Предложение и подтверждение",
        text: "Процесс начинается после согласования цены, срока и деталей изготовления.",
      },
    ],
    details: [
      "Размер стопы и комфорт",
      "Форма модели и стиль одежды",
      "Кожа, цвет и детали строчки",
      "Подошва, подкладка и финальная отделка",
      "Цена и срок изготовления",
    ],
  },
};

const stepIcons = [Scissors, Ruler, Palette, CheckCircle2];

export default async function CustomOrderPage({
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
        title={pageText.customTitle}
        description={pageText.customDescription}
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
                <Clock size={20} />
              </div>

              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-white">
                {t.timelineTitle}
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/58">
                {t.timelineText}
              </p>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <h4 className="text-sm font-semibold text-[#D8BD8A]">
                  {t.noteTitle}
                </h4>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {t.noteText}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <div className="mb-8 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-[#D8BD8A]">
                {t.processEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white md:text-4xl">
                {t.processTitle}
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {t.steps.map((step, index) => {
                const Icon = stepIcons[index] ?? CheckCircle2;

                return (
                  <div
                    key={step.title}
                    className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:-translate-y-1 hover:border-[#D8BD8A]/35"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#D8BD8A]/10 text-[#D8BD8A] transition group-hover:bg-[#D8BD8A] group-hover:text-black">
                        <Icon size={20} />
                      </span>

                      <span className="text-xs uppercase tracking-[0.24em] text-white/28">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-semibold leading-7 text-white">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-white/56">
                      {step.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#D8BD8A]">
                {t.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] text-white md:text-4xl">
                {t.detailTitle}
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/60">
                {t.detailDescription}
              </p>
            </div>

            <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {t.details.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D8BD8A]/12 text-[#D8BD8A]">
                      <CheckCircle2 size={14} />
                    </span>
                    <p className="text-sm leading-6 text-white/62">{item}</p>
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