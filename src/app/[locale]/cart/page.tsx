import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { CartClient } from "@/components/shop/cart-client";
import { routing } from "@/i18n/routing";

type Locale = "az" | "en" | "ru";

const labels = {
  az: {
    title: "Səbət",
    description: "Seçdiyiniz məhsulları yoxlayın və sifarişi tamamlamağa keçin.",
    empty: "Səbət boşdur.",
    continueShopping: "Mağazaya qayıt",
    checkout: "Checkout-a keç",
    clear: "Səbəti təmizlə",
    size: "Ölçü",
    subtotal: "Ara cəm",
    total: "Ümumi",
    remove: "Sil",
  },
  en: {
    title: "Cart",
    description: "Review your selected products and continue to checkout.",
    empty: "Your cart is empty.",
    continueShopping: "Continue shopping",
    checkout: "Go to checkout",
    clear: "Clear cart",
    size: "Size",
    subtotal: "Subtotal",
    total: "Total",
    remove: "Remove",
  },
  ru: {
    title: "Корзина",
    description: "Проверьте выбранные товары и перейдите к оформлению.",
    empty: "Корзина пуста.",
    continueShopping: "Вернуться в магазин",
    checkout: "Перейти к оформлению",
    clear: "Очистить корзину",
    size: "Размер",
    subtotal: "Промежуточный итог",
    total: "Итого",
    remove: "Удалить",
  },
};

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;

  return (
    <main className="min-h-[70vh] bg-[#0D0D0D] py-16 text-[#F5F3EF]">
      <Container>
        <div className="mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
            KHATT
          </p>

          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
            {labels[currentLocale].title}
          </h1>

          <p className="mt-4 text-white/55">
            {labels[currentLocale].description}
          </p>
        </div>

        <CartClient locale={currentLocale} labels={labels[currentLocale]} />
      </Container>
    </main>
  );
}