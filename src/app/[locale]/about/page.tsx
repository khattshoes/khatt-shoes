import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { routing } from "@/i18n/routing";

type Locale = "az" | "en" | "ru";

const aboutContent = {
  az: {
    eyebrow: "KHATT Shoes",
    title: "Haqqımızda",
    description:
      "KHATT Shoes əl işi ayaqqabı hazırlanması, seçilmiş modellərin satışı və peşəkar bərpa xidmətləri təqdim edən atelyedir.",
    intro:
      "Atelyemizdə əsas məqsəd keyfiyyətli material, səliqəli işçilik və rahat istifadəni bir araya gətirməkdir. Hər məhsul və hər bərpa işi diqqətlə yanaşma tələb edir.",
    missionTitle: "Yanaşmamız",
    missionText:
      "Biz ayaqqabıya yalnız geyim elementi kimi deyil, uzun müddət istifadə edilən şəxsi stil detalı kimi baxırıq. Buna görə forma, rahatlıq, material və son işlənmə hər mərhələdə nəzərə alınır.",
    valuesTitle: "Nəyə önəm veririk",
    values: [
      "Keyfiyyətli material seçimi",
      "Səliqəli əl işi və detallara diqqət",
      "Rahatlıq və uzunömürlü istifadə",
      "Peşəkar təmir və bərpa yanaşması",
    ],
    servicesTitle: "Xidmətlərimiz",
    services: [
      "Hazır əl işi ayaqqabı modellərinin satışı",
      "Fərdi ölçü və istəyə uyğun ayaqqabı hazırlanması",
      "Dəri ayaqqabıların təmiri, rəng bərpası və qulluq işləri",
    ],
  },
  en: {
    eyebrow: "KHATT Shoes",
    title: "About us",
    description:
      "KHATT Shoes is an atelier offering handmade footwear, selected ready models and professional shoe restoration services.",
    intro:
      "Our atelier focuses on combining quality materials, careful workmanship and comfortable everyday use. Every product and every repair process requires attention to detail.",
    missionTitle: "Our approach",
    missionText:
      "We see shoes not only as a clothing item, but as a long-lasting part of personal style. That is why shape, comfort, material and finishing are considered at every stage.",
    valuesTitle: "What we value",
    values: [
      "Quality material selection",
      "Careful handmade work and attention to detail",
      "Comfort and long-lasting use",
      "Professional repair and restoration approach",
    ],
    servicesTitle: "Our services",
    services: [
      "Selected handmade footwear models",
      "Custom footwear based on size and preference",
      "Leather shoe repair, color restoration and care",
    ],
  },
  ru: {
    eyebrow: "KHATT Shoes",
    title: "О нас",
    description:
      "KHATT Shoes — это ателье, которое предлагает обувь ручной работы, готовые модели и профессиональное восстановление обуви.",
    intro:
      "В нашей работе мы объединяем качественные материалы, аккуратное исполнение и комфорт в использовании. Каждый продукт и каждый процесс восстановления требуют внимательного подхода.",
    missionTitle: "Наш подход",
    missionText:
      "Мы рассматриваем обувь не только как элемент гардероба, но и как долговечную часть личного стиля. Поэтому форма, комфорт, материал и финальная обработка учитываются на каждом этапе.",
    valuesTitle: "Что для нас важно",
    values: [
      "Выбор качественных материалов",
      "Аккуратная ручная работа и внимание к деталям",
      "Комфорт и долговечность",
      "Профессиональный ремонт и восстановление",
    ],
    servicesTitle: "Наши услуги",
    services: [
      "Готовые модели обуви ручной работы",
      "Индивидуальный пошив по размеру и пожеланиям",
      "Ремонт кожаной обуви, восстановление цвета и уход",
    ],
  },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const content = aboutContent[currentLocale];

  return (
    <main className="bg-[#0B0A08] text-[#FFF8EA]">
      <section className="border-b border-white/10 py-16 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-[#D8BD8A]">
              {content.eyebrow}
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              {content.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
              {content.description}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
              <p className="text-sm leading-7 text-white/60">
                {content.intro}
              </p>

              <div className="mt-7 rounded-[1.5rem] border border-[#D8BD8A]/20 bg-[#D8BD8A]/10 p-5">
                <h2 className="text-base font-semibold text-[#D8BD8A]">
                  {content.missionTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/62">
                  {content.missionText}
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InfoBlock title={content.valuesTitle} items={content.values} />
              <InfoBlock
                title={content.servicesTitle}
                items={content.services}
              />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-7">
      <h2 className="text-lg font-semibold text-white">{title}</h2>

      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white/62"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}