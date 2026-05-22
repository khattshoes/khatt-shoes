import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getAdminUser } from "@/lib/auth/admin";
import { LogoutButton } from "@/components/admin/logout-button";
import { routing } from "@/i18n/routing";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const admin = await getAdminUser();
  const messages = (await import(`../../../../messages/${locale}.json`)).default;
  const t = messages.Admin;

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
      </div>
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