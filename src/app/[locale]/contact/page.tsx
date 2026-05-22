import { useTranslations } from "next-intl";
import { SimplePage } from "@/components/shared/simple-page";

export default function ContactPage() {
  const t = useTranslations("Pages");

  return (
    <SimplePage
      eyebrow="Contact"
      title={t("contactTitle")}
      description={t("contactDescription")}
    />
  );
}