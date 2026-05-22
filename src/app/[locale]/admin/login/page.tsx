import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { loginAction } from "@/app/[locale]/admin/login/actions";
import { routing } from "@/i18n/routing";

export default async function AdminLoginPage({
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

  const messages = (await import(`../../../../messages/${locale}.json`)).default;
  const t = messages.Admin;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0D0D0D] px-5 text-[#F5F3EF]">
      <form
        action={loginAction}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.03] p-8"
      >
        <input type="hidden" name="locale" value={locale} />

        <p className="text-xs uppercase tracking-[0.3em] text-[#D6C2A8]">
          {t.brand}
        </p>

        <h1 className="mt-4 text-3xl font-semibold">{t.loginTitle}</h1>

        {error ? (
          <p className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {t.loginError}
          </p>
        ) : null}

        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-white/60">
              {t.email}
            </span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-[#D6C2A8]"
              placeholder="admin@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-white/60">
              {t.password}
            </span>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-[#D6C2A8]"
              placeholder="••••••••"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-[#D6C2A8] px-6 py-4 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
        >
          {t.loginButton}
        </button>
      </form>
    </main>
  );
}