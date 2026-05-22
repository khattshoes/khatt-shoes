import { useTranslations } from "next-intl";
import { SimplePage } from "@/components/shared/simple-page";

export default function AboutPage() {
  const t = useTranslations("Pages");

  return (
    <SimplePage
      eyebrow="About KHATT"
      title={t("aboutTitle")}
      description={t("aboutDescription")}
    />
  );
}