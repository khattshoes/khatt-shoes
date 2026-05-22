import { logoutAction } from "@/app/[locale]/admin/logout/actions";
import type { Locale } from "@/i18n/routing";

export function LogoutButton({ locale }: { locale: Locale }) {
  return (
    <form action={logoutAction}>
      <input type="hidden" name="locale" value={locale} />
      <button
        type="submit"
        className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/60 transition hover:border-red-400/40 hover:text-red-300"
      >
        Logout
      </button>
    </form>
  );
}