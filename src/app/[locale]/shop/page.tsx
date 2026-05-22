import { useTranslations } from "next-intl";
import { SimplePage } from "@/components/shared/simple-page";

export default function ShopPage() {
  const t = useTranslations("Pages");

  return (
    <SimplePage
      eyebrow="Collection"
      title={t("shopTitle")}
      description={t("shopDescription")}
    />
  );
}