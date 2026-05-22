import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { getAdminUser } from "@/lib/auth/admin";
import { routing } from "@/i18n/routing";

export default async function ProtectedAdminLayout({
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

  return <>{children}</>;
}