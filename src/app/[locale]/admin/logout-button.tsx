import { logoutAction } from "@/app/[locale]/admin/logout/actions";
import type { Locale } from "@/i18n/routing";

type LogoutButtonProps = {
  locale: Locale;
  label: string;
};

export function LogoutButton({ locale, label }: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <input type="hidden" name="locale" value={locale} />
      <button
        type="submit"
        className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/60 transition hover:border-red-400/40 hover:text-red-300"
      >
        {label}
      </button>
    </form>
  );
}