import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { CheckoutClient } from "@/components/shop/checkout-client";
import { routing } from "@/i18n/routing";
import { createCheckoutOrderAction } from "./actions";

type Locale = "az" | "en" | "ru";

const labels = {
  az: {
    title: "Checkout",
    empty: "Səbət boşdur.",
    customerInfo: "Sifariş məlumatları",
    name: "Ad Soyad",
    phone: "Telefon",
    email: "Email",
    note: "Qeyd",
    subtotal: "Ara cəm",
    total: "Ümumi",
    submit: "Sifarişi tamamla",
    clear: "Səbəti təmizlə",
    size: "Ölçü",
    qty: "Say",
    missingError: "Zəhmət olmasa ad, telefon və səbət məlumatlarını yoxlayın.",
    stockError: "Seçilmiş ölçüdə kifayət qədər stok yoxdur.",
    serverError: "Sifariş yaradılarkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.",
  },
  en: {
    title: "Checkout",
    empty: "Your cart is empty.",
    customerInfo: "Order details",
    name: "Full name",
    phone: "Phone",
    email: "Email",
    note: "Note",
    subtotal: "Subtotal",
    total: "Total",
    submit: "Complete order",
    clear: "Clear cart",
    size: "Size",
    qty: "Qty",
    missingError: "Please check your name, phone and cart details.",
    stockError: "There is not enough stock for the selected size.",
    serverError: "Something went wrong while creating your order. Please try again.",
  },
  ru: {
    title: "Оформление заказа",
    empty: "Корзина пуста.",
    customerInfo: "Данные заказа",
    name: "Имя и фамилия",
    phone: "Телефон",
    email: "Email",
    note: "Комментарий",
    subtotal: "Промежуточный итог",
    total: "Итого",
    submit: "Завершить заказ",
    clear: "Очистить корзину",
    size: "Размер",
    qty: "Кол-во",
    missingError: "Проверьте имя, телефон и данные корзины.",
    stockError: "Недостаточно товара выбранного размера.",
    serverError: "Произошла ошибка при создании заказа. Попробуйте снова.",
  },
};

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;

  return (
    <main className="bg-[#0D0D0D] py-16 text-[#F5F3EF]">
      <Container>
        <CheckoutClient
          locale={currentLocale}
          labels={labels[currentLocale]}
          error={error}
          action={createCheckoutOrderAction}
        />
      </Container>
    </main>
  );
}