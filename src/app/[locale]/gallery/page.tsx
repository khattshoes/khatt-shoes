import { useTranslations } from "next-intl";
import { SimplePage } from "@/components/shared/simple-page";

export default function GalleryPage() {
  const t = useTranslations("Pages");

  return (
    <SimplePage
      eyebrow="Portfolio"
      title={t("galleryTitle")}
      description={t("galleryDescription")}
    />
  );
}