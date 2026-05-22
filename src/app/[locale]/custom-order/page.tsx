import { useTranslations } from "next-intl";
import { SimplePage } from "@/components/shared/simple-page";

export default function CustomOrderPage() {
  const t = useTranslations("Pages");

  return (
    <SimplePage
      eyebrow="Bespoke"
      title={t("customTitle")}
      description={t("customDescription")}
    />
  );
}