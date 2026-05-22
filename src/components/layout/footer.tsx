import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-white/10 bg-[#080808] py-14">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-3xl tracking-[0.25em]">KHATT</h3>
            <p className="max-w-sm text-sm leading-7 text-white/55">
              {t("description")}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[#D6C2A8]">{t("pages")}</h4>
            <div className="flex flex-col gap-2 text-sm text-white/55">
              <Link href="/shop">{t("shop")}</Link>
              <Link href="/custom-order">{t("custom")}</Link>
              <Link href="/repair">{t("repair")}</Link>
              <Link href="/contact">{t("contact")}</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[#D6C2A8]">{t("contactTitle")}</h4>
            <p className="text-sm text-white/55">{t("location")}</p>
            <p className="mt-2 text-sm text-white/55">Instagram: @khatt.shoes</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}