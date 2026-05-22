import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import { updateProductAction, deleteProductAction } from "./actions";
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

type TranslationRow = {
  locale: Locale;
  name: string;
  short_description: string | null;
  description: string | null;
};

type ProductRow = {
  id: string;
  category_id: string | null;
  slug: string;
  sku: string | null;
  price: number;
  old_price: number | null;
  currency: string;
  status: string;
  stock_quantity: number;
  is_featured: boolean;
  is_custom_available: boolean;
  material: string | null;
  color: string | null;
  size_range: string | null;
  product_translations: TranslationRow[];
};

function getTranslation(product: ProductRow, locale: Locale) {
  return (
    product.product_translations.find((item) => item.locale === locale) ?? {
      locale,
      name: "",
      short_description: "",
      description: "",
    }
  );
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

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
  const supabase = await createClient();

  const [{ data: product, error: productError }, { data: categories, error: categoryError }] =
    await Promise.all([
      supabase
        .from("products")
        .select(
          `
          id,
          category_id,
          slug,
          sku,
          price,
          old_price,
          currency,
          status,
          stock_quantity,
          is_featured,
          is_custom_available,
          material,
          color,
          size_range,
          product_translations (
            locale,
            name,
            short_description,
            description
          )
        `
        )
        .eq("id", id)
        .single(),
      supabase
        .from("categories")
        .select("id, name_az, name_en, name_ru")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

  if (productError || !product) {
    notFound();
  }

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  const productRow = product as ProductRow;
  const az = getTranslation(productRow, "az");
  const en = getTranslation(productRow, "en");
  const ru = getTranslation(productRow, "ru");

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-white/10 pb-8">
        <Link
          href="/admin/products"
          className="text-sm text-[#D6C2A8] transition hover:text-white"
        >
          ← {t.productsPageTitle}
        </Link>

        <h1 className="mt-5 text-4xl font-semibold">{t.editProduct}</h1>
        <p className="mt-3 text-white/50">{t.editProductDescription}</p>
      </div>

      <form action={updateProductAction} className="space-y-8">
        <input type="hidden" name="locale" value={currentLocale} />
        <input type="hidden" name="product_id" value={productRow.id} />

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-xl font-semibold">Product info</h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Input label={t.slug} name="slug" required defaultValue={productRow.slug} />
            <Input label={t.sku} name="sku" defaultValue={productRow.sku ?? ""} />
            <Input label={t.price} name="price" type="number" required defaultValue={String(productRow.price)} />
            <Input label={t.oldPrice} name="old_price" type="number" defaultValue={productRow.old_price ? String(productRow.old_price) : ""} />
            <Input label={t.currency} name="currency" required defaultValue={productRow.currency} />

            <label className="block">
              <span className="mb-2 block text-sm text-white/60">{t.category}</span>
              <select
                name="category_id"
                defaultValue={productRow.category_id ?? ""}
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
              <span className="mb-2 block text-sm text-white/60">{t.status}</span>
              <select
                name="status"
                defaultValue={productRow.status}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-[#D6C2A8]"
              >
                <option value="draft">{t.draft}</option>
                <option value="active">{t.active}</option>
                <option value="sold_out">{t.soldOut}</option>
                <option value="archived">{t.archived}</option>
              </select>
            </label>

            <Input label={t.stock} name="stock_quantity" type="number" defaultValue={String(productRow.stock_quantity)} />
            <Input label={t.material} name="material" defaultValue={productRow.material ?? ""} />
            <Input label={t.color} name="color" defaultValue={productRow.color ?? ""} />
            <Input label={t.sizeRange} name="size_range" defaultValue={productRow.size_range ?? ""} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Checkbox label={t.isFeatured} name="is_featured" defaultChecked={productRow.is_featured} />
            <Checkbox label={t.isCustomAvailable} name="is_custom_available" defaultChecked={productRow.is_custom_available} />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-xl font-semibold">Translations</h2>

          <div className="space-y-6">
            <TranslationBlock
              nameLabel={t.nameAz}
              shortLabel={t.shortDescriptionAz}
              descriptionLabel={t.descriptionAz}
              suffix="az"
              translation={az}
            />

            <TranslationBlock
              nameLabel={t.nameEn}
              shortLabel={t.shortDescriptionEn}
              descriptionLabel={t.descriptionEn}
              suffix="en"
              translation={en}
            />

            <TranslationBlock
              nameLabel={t.nameRu}
              shortLabel={t.shortDescriptionRu}
              descriptionLabel={t.descriptionRu}
              suffix="ru"
              translation={ru}
            />
          </div>
        </section>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <button
            type="submit"
            className="rounded-full bg-[#D6C2A8] px-8 py-4 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
          >
            {t.updateProduct}
          </button>
        </div>
      </form>

      <form action={deleteProductAction} className="mt-5">
        <input type="hidden" name="locale" value={currentLocale} />
        <input type="hidden" name="product_id" value={productRow.id} />

        <button
          type="submit"
          className="rounded-full border border-red-500/30 px-8 py-4 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
        >
          {t.deleteProduct}
        </button>
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
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
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-[#D6C2A8]"
      />
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
  suffix,
  translation,
}: {
  nameLabel: string;
  shortLabel: string;
  descriptionLabel: string;
  suffix: Locale;
  translation: TranslationRow;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label={nameLabel}
          name={`name_${suffix}`}
          required
          defaultValue={translation.name}
        />
        <Input
          label={shortLabel}
          name={`short_description_${suffix}`}
          defaultValue={translation.short_description ?? ""}
        />
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm text-white/60">
          {descriptionLabel}
        </span>
        <textarea
          name={`description_${suffix}`}
          rows={4}
          defaultValue={translation.description ?? ""}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-[#D6C2A8]"
        />
      </label>
    </div>
  );
}