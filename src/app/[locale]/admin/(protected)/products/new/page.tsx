import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import { createProductAction } from "./actions";
import azMessages from "@/messages/az.json";
import enMessages from "@/messages/en.json";
import ruMessages from "@/messages/ru.json";

type Locale = "az" | "en" | "ru";

type CategoryRow = {
  id: string;
  name_az: string;
  name_en: string;
  name_ru: string;
};

const adminCopy = {
  az: {
    productInfo: "Məhsul məlumatları",
    visibility: "Görünürlük və seçimlər",
    translations: "Tərcümələr",
    homeFeatured: "Ana səhifədə göstər",
    homeSortOrder: "Ana səhifə sırası",
    homeSortHint: "Kiçik rəqəm əvvəl göstərilir. Məsələn: 1, 2, 3.",
    productHint:
      "Məhsul ana səhifədə görünməsi üçün status Active olmalı və “Ana səhifədə göstər” seçilməlidir.",
  },
  en: {
    productInfo: "Product information",
    visibility: "Visibility and options",
    translations: "Translations",
    homeFeatured: "Show on homepage",
    homeSortOrder: "Homepage order",
    homeSortHint: "Lower number appears first. Example: 1, 2, 3.",
    productHint:
      "To show this product on the homepage, status must be Active and “Show on homepage” must be selected.",
  },
  ru: {
    productInfo: "Информация о товаре",
    visibility: "Видимость и настройки",
    translations: "Переводы",
    homeFeatured: "Показать на главной",
    homeSortOrder: "Порядок на главной",
    homeSortHint: "Меньшее число отображается раньше. Например: 1, 2, 3.",
    productHint:
      "Чтобы товар отображался на главной, статус должен быть Active и опция показа на главной должна быть включена.",
  },
};

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;

  const allMessages = {
    az: azMessages,
    en: enMessages,
    ru: ruMessages,
  };

  const t = allMessages[currentLocale].Admin;
  const c = adminCopy[currentLocale];

  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name_az, name_en, name_ru")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-white/10 pb-8">
        <Link
          href="/admin/products"
          className="text-sm text-[#D6C2A8] transition hover:text-white"
        >
          ← {t.productsPageTitle}
        </Link>

        <h1 className="mt-5 text-4xl font-semibold">{t.newProduct}</h1>
        <p className="mt-3 text-white/50">{t.newProductDescription}</p>
      </div>

      <form action={createProductAction} className="space-y-8">
        <input type="hidden" name="locale" value={currentLocale} />

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{c.productInfo}</h2>
            <p className="text-sm leading-6 text-white/45">{c.productHint}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input label={t.slug} name="slug" required placeholder="oxford-classic" />
            <Input label={t.sku} name="sku" placeholder="KHATT-OXF-001" />
            <Input label={t.price} name="price" type="number" required placeholder="280" />
            <Input label={t.oldPrice} name="old_price" type="number" placeholder="350" />
            <Input label={t.currency} name="currency" defaultValue="AZN" required />

            <label className="block">
              <span className="mb-2 block text-sm text-white/60">
                {t.category}
              </span>
              <select
                name="category_id"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-[#D6C2A8]"
              >
                <option value="">{t.selectCategory}</option>
                {(categories as CategoryRow[] | null)?.map((category) => {
                  const categoryName =
                    currentLocale === "az"
                      ? category.name_az
                      : currentLocale === "en"
                        ? category.name_en
                        : category.name_ru;

                  return (
                    <option key={category.id} value={category.id}>
                      {categoryName}
                    </option>
                  );
                })}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-white/60">
                {t.status}
              </span>
              <select
                name="status"
                defaultValue="draft"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-[#D6C2A8]"
              >
                <option value="draft">{t.draft}</option>
                <option value="active">{t.active}</option>
                <option value="sold_out">{t.soldOut}</option>
                <option value="archived">{t.archived}</option>
              </select>
            </label>

            <Input label={t.stock} name="stock_quantity" type="number" defaultValue="0" />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-xl font-semibold">{c.visibility}</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Checkbox label={t.isFeatured} name="is_featured" />
            <Checkbox label={c.homeFeatured} name="featured_on_home" />
            <Checkbox label={t.isCustomAvailable} name="is_custom_available" />

            <Input
              label={c.homeSortOrder}
              name="home_sort_order"
              type="number"
              defaultValue="0"
              placeholder="1"
              hint={c.homeSortHint}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-xl font-semibold">{c.translations}</h2>

          <div className="space-y-6">
            <TranslationBlock
              nameLabel={t.nameAz}
              shortLabel={t.shortDescriptionAz}
              descriptionLabel={t.descriptionAz}
              materialLabel={t.materialAz}
              colorLabel={t.colorAz}
              sizeRangeLabel={t.sizeRangeAz}
              suffix="az"
            />

            <TranslationBlock
              nameLabel={t.nameEn}
              shortLabel={t.shortDescriptionEn}
              descriptionLabel={t.descriptionEn}
              materialLabel={t.materialEn}
              colorLabel={t.colorEn}
              sizeRangeLabel={t.sizeRangeEn}
              suffix="en"
            />

            <TranslationBlock
              nameLabel={t.nameRu}
              shortLabel={t.shortDescriptionRu}
              descriptionLabel={t.descriptionRu}
              materialLabel={t.materialRu}
              colorLabel={t.colorRu}
              sizeRangeLabel={t.sizeRangeRu}
              suffix="ru"
            />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-[#D6C2A8] px-8 py-4 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
          >
            {t.saveProduct}
          </button>
        </div>
      </form>
    </main>
  );
}

function Input({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/60">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#D6C2A8]"
      />
      {hint ? <span className="mt-2 block text-xs text-white/38">{hint}</span> : null}
    </label>
  );
}

function Checkbox({
  label,
  name,
  defaultChecked = false,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white/70">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4"
      />
      {label}
    </label>
  );
}

function TranslationBlock({
  nameLabel,
  shortLabel,
  descriptionLabel,
  materialLabel,
  colorLabel,
  sizeRangeLabel,
  suffix,
}: {
  nameLabel: string;
  shortLabel: string;
  descriptionLabel: string;
  materialLabel: string;
  colorLabel: string;
  sizeRangeLabel: string;
  suffix: Locale;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Input label={nameLabel} name={`name_${suffix}`} required />
        <Input label={shortLabel} name={`short_description_${suffix}`} />
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm text-white/60">
          {descriptionLabel}
        </span>
        <textarea
          name={`description_${suffix}`}
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-[#D6C2A8]"
        />
      </label>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Input label={materialLabel} name={`material_${suffix}`} />
        <Input label={colorLabel} name={`color_${suffix}`} />
        <Input label={sizeRangeLabel} name={`size_range_${suffix}`} />
      </div>
    </div>
  );
}