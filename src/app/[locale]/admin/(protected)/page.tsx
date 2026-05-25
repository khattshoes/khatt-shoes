import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getAdminUser } from "@/lib/auth/admin";
import { LogoutButton } from "@/components/admin/logout-button";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import azMessages from "@/messages/az.json";
import enMessages from "@/messages/en.json";
import ruMessages from "@/messages/ru.json";

type Locale = "az" | "en" | "ru";

type RecentOrderRow = {
  id: string;
  order_number: string | null;
  customer_name: string;
  customer_phone: string;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
};

const dashboardLabels = {
  az: {
    statsTitle: "Qısa statistika",
    recentOrders: "Son sifarişlər",
    viewAll: "Hamısına bax",
    noOrders: "Hələ sifariş yoxdur.",
    totalProducts: "Məhsullar",
    activeProducts: "Aktiv məhsullar",
    totalOrders: "Sifarişlər",
    newOrders: "Yeni sifarişlər",
    customer: "Müştəri",
    status: "Status",
    total: "Məbləğ",
    date: "Tarix",
    open: "Bax",
  },
  en: {
    statsTitle: "Quick stats",
    recentOrders: "Recent orders",
    viewAll: "View all",
    noOrders: "No orders yet.",
    totalProducts: "Products",
    activeProducts: "Active products",
    totalOrders: "Orders",
    newOrders: "New orders",
    customer: "Customer",
    status: "Status",
    total: "Total",
    date: "Date",
    open: "Open",
  },
  ru: {
    statsTitle: "Краткая статистика",
    recentOrders: "Последние заказы",
    viewAll: "Смотреть все",
    noOrders: "Пока нет заказов.",
    totalProducts: "Товары",
    activeProducts: "Активные товары",
    totalOrders: "Заказы",
    newOrders: "Новые заказы",
    customer: "Клиент",
    status: "Статус",
    total: "Сумма",
    date: "Дата",
    open: "Открыть",
  },
};

function formatDate(value: string, locale: Locale) {
  const localeMap = {
    az: "az-AZ",
    en: "en-US",
    ru: "ru-RU",
  };

  return new Intl.DateTimeFormat(localeMap[locale], {
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


export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;

  const admin = await getAdminUser();

  const allMessages = {
    az: azMessages,
    en: enMessages,
    ru: ruMessages,
  };

  const t = allMessages[currentLocale].Admin;
  const d = dashboardLabels[currentLocale];

  const supabase = await createClient();

  const [
    totalProductsResult,
    activeProductsResult,
    totalOrdersResult,
    newOrdersResult,
    recentOrdersResult,
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("orders")
      .select(
        `
        id,
        order_number,
        customer_name,
        customer_phone,
        status,
        total_amount,
        currency,
        created_at
      `
      )
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (recentOrdersResult.error) {
    console.error("Dashboard recent orders error:", recentOrdersResult.error.message);
  }

  const recentOrders = (recentOrdersResult.data ?? []) as RecentOrderRow[];

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
            {t.brand}
          </p>
          <h1 className="mt-3 text-4xl font-semibold">{t.dashboard}</h1>
          <p className="mt-3 text-white/50">
            {t.welcome}, {admin?.adminUser.full_name || admin?.adminUser.email}
          </p>
        </div>

        <LogoutButton locale={locale} label={t.logout} />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <AdminCard
          href="/admin/products"
          title={t.products}
          text={t.productsText}
        />
        <AdminCard
          href="/admin/orders"
          title={t.orders}
          text={t.ordersText}
        />
        <AdminCard
          href="/admin/repair-requests"
          title={t.repairRequests}
          text={t.repairRequestsText}
        />
        <AdminCard
          href="/admin/custom-orders"
          title={t.customOrders}
          text={t.customOrdersText}
        />
        <AdminCard
  href="/admin/contact-messages"
  title={
    currentLocale === "az"
      ? "Əlaqə müraciətləri"
      : currentLocale === "ru"
        ? "Сообщения"
        : "Contact messages"
  }
  text={
    currentLocale === "az"
      ? "Contact formdan gələn müraciətlərə bax"
      : currentLocale === "ru"
        ? "Просмотр сообщений из контактной формы"
        : "View messages from the contact form"
  }
/>
      </div>

      <section className="mt-10">
        <h2 className="mb-5 text-2xl font-semibold">{d.statsTitle}</h2>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label={d.totalProducts} value={totalProductsResult.count ?? 0} />
          <StatCard label={d.activeProducts} value={activeProductsResult.count ?? 0} />
          <StatCard label={d.totalOrders} value={totalOrdersResult.count ?? 0} />
          <StatCard label={d.newOrders} value={newOrdersResult.count ?? 0} />
        </div>
      </section>

      <section className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
        <div className="flex flex-col gap-4 border-b border-white/10 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{d.recentOrders}</h2>
          </div>

          <Link
            href="/admin/orders"
            locale={currentLocale}
            className="w-fit rounded-full border border-white/10 px-5 py-2 text-sm text-white/70 transition hover:border-[#D6C2A8] hover:text-white"
          >
            {d.viewAll}
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-white/40">
              <tr>
                <th className="px-6 py-5">Order</th>
                <th className="px-6 py-5">{d.customer}</th>
                <th className="px-6 py-5">{d.status}</th>
                <th className="px-6 py-5">{d.total}</th>
                <th className="px-6 py-5">{d.date}</th>
                <th className="px-6 py-5"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {recentOrders.length ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="text-white/70">
                    <td className="px-6 py-5">
                      <p className="font-medium text-white">
                        {order.order_number || order.id.slice(0, 8)}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-medium text-white">{order.customer_name}</p>
                      <p className="mt-1 text-xs text-white/35">
                        {order.customer_phone}
                      </p>
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
                      {formatDate(order.created_at, currentLocale)}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        locale={currentLocale}
                        className="text-[#D6C2A8] transition hover:text-white"
                      >
                        {d.open}
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-white/45"
                  >
                    {d.noOrders}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function AdminCard({
  href,
  title,
  text,
}: {
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#D6C2A8]/40"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/50">{text}</p>
    </Link>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm text-white/45">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-[#D6C2A8]">{value}</p>
    </div>
  );
}