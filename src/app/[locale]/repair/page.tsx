import { useTranslations } from "next-intl";
import { SimplePage } from "@/components/shared/simple-page";

export default function RepairPage() {
  const t = useTranslations("Pages");

  return (
    <SimplePage
      eyebrow="Restoration"
      title={t("repairTitle")}
      description={t("repairDescription")}
    />
  );
}