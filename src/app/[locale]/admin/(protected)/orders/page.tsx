import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

type Locale = "az" | "en" | "ru";

type OrderRow = {
  id: string;
  order_number: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  order_items: {
    id: string;
  }[];
};

const labels = {
  az: {
    backToDashboard: "Dashboard-a qayıt",
    title: "Sifarişlər",
    description:
      "Müştəri sifarişlərini izləyin, əlaqə məlumatlarını görün və statusları idarə edin.",
    order: "Sifariş",
    customer: "Müştəri",
    phone: "Telefon",
    status: "Status",
    total: "Məbləğ",
    items: "Məhsul",
    date: "Tarix",
    actions: "Əməliyyat",
    view: "Bax",
    noOrders: "Hələ sifariş yoxdur.",
    unknownOrder: "Nömrəsiz sifariş",
  },
  en: {
    backToDashboard: "Back to dashboard",
    title: "Orders",
    description:
      "Track customer orders, view contact details and manage order statuses.",
    order: "Order",
    customer: "Customer",
    phone: "Phone",
    status: "Status",
    total: "Total",
    items: "Items",
    date: "Date",
    actions: "Action",
    view: "View",
    noOrders: "No orders yet.",
    unknownOrder: "Order without number",
  },
  ru: {
    backToDashboard: "Назад к панели",
    title: "Заказы",
    description:
      "Отслеживайте заказы клиентов, контактные данные и статусы заказов.",
    order: "Заказ",
    customer: "Клиент",
    phone: "Телефон",
    status: "Статус",
    total: "Сумма",
    items: "Товары",
    date: "Дата",
    actions: "Действие",
    view: "Открыть",
    noOrders: "Пока нет заказов.",
    unknownOrder: "Заказ без номера",
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
    month: "short",
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

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

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
      status,
      total_amount,
      currency,
      created_at,
      order_items (
        id
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin orders error:", error.message);
    throw new Error(error.message);
  }

  const orders = (data ?? []) as OrderRow[];

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Link
            href="/admin"
            locale={currentLocale}
            className="text-sm text-[#D6C2A8] transition hover:text-white"
          >
            ← {t.backToDashboard}
          </Link>

          <h1 className="mt-5 text-4xl font-semibold">{t.title}</h1>

          <p className="mt-3 max-w-2xl text-white/50">{t.description}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-white/40">
              <tr>
                <th className="px-6 py-5">{t.order}</th>
                <th className="px-6 py-5">{t.customer}</th>
                <th className="px-6 py-5">{t.phone}</th>
                <th className="px-6 py-5">{t.status}</th>
                <th className="px-6 py-5">{t.total}</th>
                <th className="px-6 py-5">{t.items}</th>
                <th className="px-6 py-5">{t.date}</th>
                <th className="px-6 py-5">{t.actions}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {orders.length ? (
                orders.map((order) => (
                  <tr key={order.id} className="text-white/70">
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium text-white">
                          {order.order_number || t.unknownOrder}
                        </p>
                        <p className="mt-1 text-xs text-white/35">
                          {order.id.slice(0, 8)}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium text-white">
                          {order.customer_name}
                        </p>
                        {order.customer_email ? (
                          <p className="mt-1 text-xs text-white/35">
                            {order.customer_email}
                          </p>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <a
                        href={`tel:${order.customer_phone}`}
                        className="text-[#D6C2A8] transition hover:text-white"
                      >
                        {order.customer_phone}
                      </a>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      {order.total_amount} {order.currency}
                    </td>

                    <td className="px-6 py-5">
                      {order.order_items?.length ?? 0}
                    </td>

                    <td className="px-6 py-5">
                      {formatDate(order.created_at, currentLocale)}
                    </td>

                    <td className="px-6 py-5">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        locale={currentLocale}
                        className="text-[#D6C2A8] transition hover:text-white"
                      >
                        {t.view}
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-white/45"
                  >
                    {t.noOrders}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}