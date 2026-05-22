import { hasLocale } from "next-intl";
import { redirect } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getAdminUser } from "@/lib/auth/admin";
import { routing } from "@/i18n/routing";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const admin = await getAdminUser();

  if (!admin) {
    redirect({
      href: "/admin/login",
      locale,
    });
  }

  return (
    <section className="min-h-screen bg-[#0D0D0D] text-[#F5F3EF]">
      {children}
    </section>
  );
}