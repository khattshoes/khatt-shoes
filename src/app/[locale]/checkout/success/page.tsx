import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

type Locale = "az" | "en" | "ru";

const labels = {
  az: {
    title: "Sifarişiniz qəbul edildi",
    description:
      "Təşəkkür edirik. Komandamız sifarişinizi yoxlayacaq və sizinlə əlaqə saxlayacaq.",
    orderNumber: "Sifariş nömrəsi",
    backToShop: "Mağazaya qayıt",
    whatsapp: "WhatsApp ilə əlaqə",
  },
  en: {
    title: "Your order has been received",
    description:
      "Thank you. Our team will review your order and contact you shortly.",
    orderNumber: "Order number",
    backToShop: "Back to shop",
    whatsapp: "Contact via WhatsApp",
  },
  ru: {
    title: "Ваш заказ принят",
    description:
      "Спасибо. Наша команда проверит заказ и свяжется с вами в ближайшее время.",
    orderNumber: "Номер заказа",
    backToShop: "Вернуться в магазин",
    whatsapp: "Связаться через WhatsApp",
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

  let orderNumber: string | null = null;

  if (order) {
    const supabase = await createClient();

    const { data } = await supabase
      .from("orders")
      .select("order_number")
      .eq("id", order)
      .maybeSingle();

    orderNumber = data?.order_number || null;
  }

  return (
    <main className="min-h-[70vh] bg-[#0D0D0D] py-20 text-[#F5F3EF]">
      <Container>
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D6C2A8]/10 text-[#D6C2A8]">
            <CheckCircle2 size={34} />
          </div>

          <h1 className="mt-6 text-3xl font-semibold md:text-4xl">
            {t.title}
          </h1>

          <p className="mt-4 text-white/60">{t.description}</p>

          {orderNumber ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
              <p className="text-sm text-white/50">{t.orderNumber}</p>
              <p className="mt-2 text-xl font-semibold tracking-[0.18em] text-[#D6C2A8]">
                {orderNumber}
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/shop"
              locale={currentLocale}
              className="rounded-full bg-[#D6C2A8] px-7 py-3 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
            >
              {t.backToShop}
            </Link>

            <a
              href="https://wa.me/994000000000"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 px-7 py-3 text-sm font-medium text-white/70 transition hover:border-[#D6C2A8] hover:text-white"
            >
              {t.whatsapp}
            </a>
          </div>
        </div>
      </Container>
    </main>
  );
}