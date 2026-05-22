import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import { updateOrderStatusAction } from "./actions";

type Locale = "az" | "en" | "ru";

type OrderItemRow = {
  id: string;
  product_id: string | null;
  product_variant_id: string | null;
  product_name: string;
  size: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type OrderRow = {
  id: string;
  order_number: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_note: string | null;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  order_items: OrderItemRow[];
};

const labels = {
  az: {
    backToOrders: "Sifarişlərə qayıt",
    title: "Sifariş detalları",
    orderNumber: "Sifariş nömrəsi",
    status: "Status",
    date: "Tarix",
    customerInfo: "Müştəri məlumatları",
    name: "Ad Soyad",
    phone: "Telefon",
    email: "Email",
    note: "Qeyd",
    noNote: "Qeyd yoxdur",
    products: "Məhsullar",
    product: "Məhsul",
    size: "Ölçü",
    quantity: "Say",
    unitPrice: "Qiymət",
    total: "Cəm",
    orderTotal: "Ümumi məbləğ",
    whatsapp: "WhatsApp ilə yaz",
    call: "Zəng et",
    noEmail: "Email yoxdur",
    unknownOrder: "Nömrəsiz sifariş",
        changeStatus: "Statusu dəyiş",
    saveStatus: "Yadda saxla",
    statusUpdated: "Status yeniləndi.",
    statusError: "Status yenilənərkən xəta baş verdi.",
    statuses: {
      new: "Yeni",
      confirmed: "Təsdiqləndi",
      processing: "Hazırlanır",
      completed: "Tamamlandı",
      cancelled: "Ləğv edildi",
    },
  },
  en: {
    backToOrders: "Back to orders",
    title: "Order details",
    orderNumber: "Order number",
    status: "Status",
    date: "Date",
    customerInfo: "Customer information",
    name: "Full name",
    phone: "Phone",
    email: "Email",
    note: "Note",
    noNote: "No note",
    products: "Products",
    product: "Product",
    size: "Size",
    quantity: "Qty",
    unitPrice: "Unit price",
    total: "Total",
    orderTotal: "Order total",
    whatsapp: "Message on WhatsApp",
    call: "Call",
    noEmail: "No email",
    unknownOrder: "Order without number",
        changeStatus: "Change status",
    saveStatus: "Save status",
    statusUpdated: "Status updated.",
    statusError: "Could not update status.",
    statuses: {
      new: "New",
      confirmed: "Confirmed",
      processing: "Processing",
      completed: "Completed",
      cancelled: "Cancelled",
    },
  },
  ru: {
    backToOrders: "Назад к заказам",
    title: "Детали заказа",
    orderNumber: "Номер заказа",
    status: "Статус",
    date: "Дата",
    customerInfo: "Информация о клиенте",
    name: "Имя и фамилия",
    phone: "Телефон",
    email: "Email",
    note: "Комментарий",
    noNote: "Комментария нет",
    products: "Товары",
    product: "Товар",
    size: "Размер",
    quantity: "Кол-во",
    unitPrice: "Цена",
    total: "Итого",
    orderTotal: "Общая сумма",
    whatsapp: "Написать в WhatsApp",
    call: "Позвонить",
    noEmail: "Email отсутствует",
    unknownOrder: "Заказ без номера",
        changeStatus: "Изменить статус",
    saveStatus: "Сохранить статус",
    statusUpdated: "Статус обновлен.",
    statusError: "Не удалось обновить статус.",
    statuses: {
      new: "Новый",
      confirmed: "Подтвержден",
      processing: "В обработке",
      completed: "Завершен",
      cancelled: "Отменен",
    },
  },
};

function formatDate(value: string, locale: Locale) {
  const localeMap = {
    az: "az-AZ",
    en: "en-US",
    ru: "ru-RU",
  };

  return new Intl.DateTimeFormat(localeMap[locale], {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStatusClass(status: string) {
  switch (status) {
    case "new":
      return "border-blue-400/20 bg-blue-400/10 text-blue-200";
    case "confirmed":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
    case "processing":
      return "border-amber-400/20 bg-amber-400/10 text-amber-200";
    case "completed":
      return "border-[#D6C2A8]/30 bg-[#D6C2A8]/10 text-[#D6C2A8]";
    case "cancelled":
      return "border-red-400/20 bg-red-400/10 text-red-200";
    default:
      return "border-white/10 bg-white/[0.03] text-white/60";
  }
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function getWhatsAppPhone(phone: string) {
  const cleaned = normalizePhone(phone);

  if (cleaned.startsWith("+")) {
    return cleaned.replace("+", "");
  }

  if (cleaned.startsWith("994")) {
    return cleaned;
  }

  if (cleaned.startsWith("0")) {
    return `994${cleaned.slice(1)}`;
  }

  return cleaned;
}

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ updated?: string; error?: string }>;
}) {
  const { locale, id } = await params;
  const query = await searchParams;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  const t = labels[currentLocale];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      customer_name,
      customer_phone,
      customer_email,
      customer_note,
      status,
      total_amount,
      currency,
      created_at,
      order_items (
        id,
        product_id,
        product_variant_id,
        product_name,
        size,
        quantity,
        unit_price,
        total_price
      )
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Admin order detail error:", error.message);
    notFound();
  }

  if (!data) {
    notFound();
  }

  const order = data as OrderRow;
  const whatsappPhone = getWhatsAppPhone(order.customer_phone);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-white/10 pb-8">
        <Link
          href="/admin/orders"
          locale={currentLocale}
          className="text-sm text-[#D6C2A8] transition hover:text-white"
        >
          ← {t.backToOrders}
        </Link>

        <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
              {t.title}
            </p>

            <h1 className="mt-3 text-4xl font-semibold">
              {order.order_number || t.unknownOrder}
            </h1>
          </div>

                   <div className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 md:w-[360px]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm text-white/50">{t.changeStatus}</p>

              <span
                className={`rounded-full border px-3 py-1 text-xs ${getStatusClass(
                  order.status
                )}`}
              >
                {t.statuses[order.status as keyof typeof t.statuses] ||
                  order.status}
              </span>
            </div>

            {query.updated === "status" ? (
              <p className="mb-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
                {t.statusUpdated}
              </p>
            ) : null}

            {query.error === "status" ? (
              <p className="mb-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-200">
                {t.statusError}
              </p>
            ) : null}

            <form action={updateOrderStatusAction} className="flex gap-2">
              <input type="hidden" name="locale" value={currentLocale} />
              <input type="hidden" name="order_id" value={order.id} />

              <select
                name="status"
                defaultValue={order.status}
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-[#D6C2A8]"
              >
                <option value="new">{t.statuses.new}</option>
                <option value="confirmed">{t.statuses.confirmed}</option>
                <option value="processing">{t.statuses.processing}</option>
                <option value="completed">{t.statuses.completed}</option>
                <option value="cancelled">{t.statuses.cancelled}</option>
              </select>

              <button
                type="submit"
                className="rounded-full bg-[#D6C2A8] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
              >
                {t.saveStatus}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">{t.customerInfo}</h2>

            <div className="mt-6 space-y-4 text-sm">
              <InfoRow label={t.name} value={order.customer_name} />
              <InfoRow label={t.phone} value={order.customer_phone} />
              <InfoRow
                label={t.email}
                value={order.customer_email || t.noEmail}
              />
              <InfoRow
                label={t.date}
                value={formatDate(order.created_at, currentLocale)}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${normalizePhone(order.customer_phone)}`}
                className="rounded-full bg-[#D6C2A8] px-5 py-3 text-center text-sm font-medium text-black transition hover:bg-[#c4ad90]"
              >
                {t.call}
              </a>

              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-medium text-white/70 transition hover:border-[#D6C2A8] hover:text-white"
              >
                {t.whatsapp}
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">{t.note}</h2>

            <p className="mt-4 whitespace-pre-wrap leading-7 text-white/60">
              {order.customer_note || t.noNote}
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">{t.orderTotal}</h2>

            <p className="mt-4 text-3xl font-semibold text-[#D6C2A8]">
              {order.total_amount} {order.currency}
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 p-6">
            <h2 className="text-xl font-semibold">{t.products}</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-white/40">
                <tr>
                  <th className="px-6 py-5">{t.product}</th>
                  <th className="px-6 py-5">{t.size}</th>
                  <th className="px-6 py-5">{t.quantity}</th>
                  <th className="px-6 py-5">{t.unitPrice}</th>
                  <th className="px-6 py-5">{t.total}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {order.order_items.map((item) => (
                  <tr key={item.id} className="text-white/70">
                    <td className="px-6 py-5">
                      <p className="font-medium text-white">
                        {item.product_name}
                      </p>
                      {item.product_id ? (
                        <p className="mt-1 text-xs text-white/35">
                          {item.product_id.slice(0, 8)}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-6 py-5">{item.size || "-"}</td>
                    <td className="px-6 py-5">{item.quantity}</td>

                    <td className="px-6 py-5">
                      {item.unit_price} {order.currency}
                    </td>

                    <td className="px-6 py-5 font-medium text-white">
                      {item.total_price} {order.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <span className="text-white/45">{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}