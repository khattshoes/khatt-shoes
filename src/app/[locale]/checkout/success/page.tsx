import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { routing } from "@/i18n/routing";

type Locale = "az" | "en" | "ru";

const labels = {
  az: {
    title: "Sifariş qəbul edildi",
    text: "Sifarişiniz uğurla qeydə alındı. Komandamız sizinlə tezliklə əlaqə saxlayacaq.",
    order: "Sifariş ID",
    back: "Mağazaya qayıt",
  },
  en: {
    title: "Order received",
    text: "Your order has been placed successfully. Our team will contact you soon.",
    order: "Order ID",
    back: "Back to shop",
  },
  ru: {
    title: "Заказ принят",
    text: "Ваш заказ успешно создан. Наша команда скоро свяжется с вами.",
    order: "ID заказа",
    back: "Вернуться в магазин",
  },
};

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale } = await params;
  const { order } = await searchParams;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const t = labels[currentLocale];

  return (
    <main className="bg-[#0D0D0D] py-20 text-[#F5F3EF]">
      <Container>
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
            KHATT
          </p>

          <h1 className="mt-4 text-4xl font-semibold">{t.title}</h1>
          <p className="mt-4 leading-7 text-white/60">{t.text}</p>

          {order ? (
            <p className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white/60">
              {t.order}: <span className="text-white">{order}</span>
            </p>
          ) : null}

          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-full bg-[#D6C2A8] px-8 py-4 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
          >
            {t.back}
          </Link>
        </div>
      </Container>
    </main>
  );
}