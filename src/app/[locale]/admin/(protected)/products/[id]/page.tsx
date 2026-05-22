/* eslint-disable @next/next/no-img-element */

import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import {
  updateProductAction,
  deleteProductAction,
  uploadProductImageAction,
  deleteProductImageAction,
  addProductVariantAction,
  deleteProductVariantAction,
} from "./actions";
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
  material: string | null;
  color: string | null;
  size_range: string | null;
};

type ProductImageRow = {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

type ProductVariantRow = {
  id: string;
  size: string;
  sku: string | null;
  price_adjustment: number;
  stock_quantity: number;
  sort_order: number;
  is_active: boolean;
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
  featured_on_home: boolean;
  home_sort_order: number;
  is_custom_available: boolean;
  product_translations: TranslationRow[];
  product_images: ProductImageRow[];
  product_variants: ProductVariantRow[];
};

function getTranslation(product: ProductRow, locale: Locale): TranslationRow {
  return (
    product.product_translations.find((item) => item.locale === locale) ?? {
      locale,
      name: "",
      short_description: "",
      description: "",
      material: "",
      color: "",
      size_range: "",
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

  const [
    { data: product, error: productError },
    { data: categories, error: categoryError },
  ] = await Promise.all([
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
featured_on_home,
home_sort_order,
is_custom_available,
product_translations (
          locale,
          name,
          short_description,
          description,
          material,
          color,
          size_range
        ),
        product_images (
          id,
          image_url,
          alt_text,
          sort_order,
          is_primary
        ),
        product_variants (
          id,
          size,
          sku,
          price_adjustment,
          stock_quantity,
          sort_order,
          is_active
        )
      `,
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

  const sortedVariants = [...productRow.product_variants].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

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
          <h2 className="mb-6 text-xl font-semibold">
            {t.newProductDescription}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label={t.slug}
              name="slug"
              required
              defaultValue={productRow.slug}
            />
            <Input
              label={t.sku}
              name="sku"
              defaultValue={productRow.sku ?? ""}
            />
            <Input
              label={t.price}
              name="price"
              type="number"
              required
              defaultValue={String(productRow.price)}
            />
            <Input
              label={t.oldPrice}
              name="old_price"
              type="number"
              defaultValue={
                productRow.old_price ? String(productRow.old_price) : ""
              }
            />
            <Input
              label={t.currency}
              name="currency"
              required
              defaultValue={productRow.currency}
            />

            <label className="block">
              <span className="mb-2 block text-sm text-white/60">
                {t.category}
              </span>
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
              <span className="mb-2 block text-sm text-white/60">
                {t.status}
              </span>
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

            <Input
              label={t.stock}
              name="stock_quantity"
              type="number"
              defaultValue={String(productRow.stock_quantity)}
            />
          </div>

         <div className="mt-6 grid gap-4 md:grid-cols-2">
  <Checkbox
    label={t.isFeatured}
    name="is_featured"
    defaultChecked={productRow.is_featured}
  />

  <Checkbox
    label="Ana səhifədə göstər"
    name="featured_on_home"
    defaultChecked={productRow.featured_on_home}
  />

  <Checkbox
    label={t.isCustomAvailable}
    name="is_custom_available"
    defaultChecked={productRow.is_custom_available}
  />

  <Input
    label="Ana səhifə sırası"
    name="home_sort_order"
    type="number"
    defaultValue={String(productRow.home_sort_order ?? 0)}
  />
</div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-xl font-semibold">
            {t.nameAz} / {t.nameEn} / {t.nameRu}
          </h2>

          <div className="space-y-6">
            <TranslationBlock
              nameLabel={t.nameAz}
              shortLabel={t.shortDescriptionAz}
              descriptionLabel={t.descriptionAz}
              materialLabel={t.materialAz}
              colorLabel={t.colorAz}
              sizeRangeLabel={t.sizeRangeAz}
              suffix="az"
              translation={az}
            />

            <TranslationBlock
              nameLabel={t.nameEn}
              shortLabel={t.shortDescriptionEn}
              descriptionLabel={t.descriptionEn}
              materialLabel={t.materialEn}
              colorLabel={t.colorEn}
              sizeRangeLabel={t.sizeRangeEn}
              suffix="en"
              translation={en}
            />

            <TranslationBlock
              nameLabel={t.nameRu}
              shortLabel={t.shortDescriptionRu}
              descriptionLabel={t.descriptionRu}
              materialLabel={t.materialRu}
              colorLabel={t.colorRu}
              sizeRangeLabel={t.sizeRangeRu}
              suffix="ru"
              translation={ru}
            />
          </div>
        </section>

        <button
          type="submit"
          className="rounded-full bg-[#D6C2A8] px-8 py-4 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
        >
          {t.updateProduct}
        </button>
      </form>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-6 text-xl font-semibold">{t.variants}</h2>

        {sortedVariants.length ? (
          <div className="mb-8 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-white/40">
                <tr>
                  <th className="px-5 py-4">{t.size}</th>
                  <th className="px-5 py-4">{t.variantSku}</th>
                  <th className="px-5 py-4">{t.priceAdjustment}</th>
                  <th className="px-5 py-4">{t.variantStock}</th>
                  <th className="px-5 py-4">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {sortedVariants.map((variant) => (
                  <tr key={variant.id} className="text-white/70">
                    <td className="px-5 py-4 font-medium text-white">
                      {variant.size}
                    </td>
                    <td className="px-5 py-4">{variant.sku || "-"}</td>
                    <td className="px-5 py-4">
                      {variant.price_adjustment} {productRow.currency}
                    </td>
                    <td className="px-5 py-4">{variant.stock_quantity}</td>
                    <td className="px-5 py-4">
                      <form action={deleteProductVariantAction}>
                        <input
                          type="hidden"
                          name="locale"
                          value={currentLocale}
                        />
                        <input
                          type="hidden"
                          name="product_id"
                          value={productRow.id}
                        />
                        <input
                          type="hidden"
                          name="variant_id"
                          value={variant.id}
                        />
                        <button
                          type="submit"
                          className="text-red-300 transition hover:text-red-200"
                        >
                          {t.deleteVariant}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mb-8 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white/45">
            {t.noVariants}
          </p>
        )}

        <form
          action={addProductVariantAction}
          className="grid gap-5 md:grid-cols-2"
        >
          <input type="hidden" name="locale" value={currentLocale} />
          <input type="hidden" name="product_id" value={productRow.id} />

          <Input label={t.size} name="size" required placeholder="42" />
          <Input
            label={t.variantSku}
            name="variant_sku"
            placeholder="KHATT-OXF-42"
          />
          <Input
            label={t.priceAdjustment}
            name="price_adjustment"
            type="number"
            defaultValue="0"
          />
          <Input
            label={t.variantStock}
            name="variant_stock"
            type="number"
            defaultValue="0"
          />
          <Input
            label={t.sortOrder}
            name="sort_order"
            type="number"
            defaultValue="0"
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-[#D6C2A8] px-8 py-4 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
            >
              {t.addVariant}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-6 text-xl font-semibold">{t.images}</h2>

        {productRow.product_images.length ? (
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            {[...productRow.product_images]
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((image) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                >
                  <div className="aspect-[4/3] bg-black">
                    <img
                      src={image.image_url}
                      alt={image.alt_text || productRow.slug}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-3 p-4">
                    <p className="break-all text-xs text-white/45">
                      {image.image_url}
                    </p>

                    <div className="flex items-center justify-between text-xs text-white/45">
                      <span>
                        {t.sortOrder}: {image.sort_order}
                      </span>
                      <span>{image.is_primary ? t.isPrimary : ""}</span>
                    </div>

                    <form action={deleteProductImageAction}>
                      <input
                        type="hidden"
                        name="locale"
                        value={currentLocale}
                      />
                      <input
                        type="hidden"
                        name="product_id"
                        value={productRow.id}
                      />
                      <input type="hidden" name="image_id" value={image.id} />
                      <input
                        type="hidden"
                        name="image_url"
                        value={image.image_url}
                      />

                      <button
                        type="submit"
                        className="rounded-full border border-red-500/30 px-5 py-2 text-xs text-red-300 transition hover:bg-red-500/10"
                      >
                        {t.deleteImage}
                      </button>
                    </form>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="mb-8 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white/45">
            {t.noImages}
          </p>
        )}

        <form
          action={uploadProductImageAction}
          className="grid gap-5 md:grid-cols-2"
        >
          <input type="hidden" name="locale" value={currentLocale} />
          <input type="hidden" name="product_id" value={productRow.id} />

          <label className="block">
            <span className="mb-2 block text-sm text-white/60">
              {t.imageFile}
            </span>
            <input
              name="image_file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              required
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white file:mr-4 file:rounded-full file:border-0 file:bg-[#D6C2A8] file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
            />
          </label>

          <Input
            label={t.altText}
            name="alt_text"
            placeholder={productRow.slug}
          />
          <Input
            label={t.sortOrder}
            name="sort_order"
            type="number"
            defaultValue="0"
          />
          <Checkbox label={t.isPrimary} name="is_primary" />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-[#D6C2A8] px-8 py-4 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
            >
              {t.uploadImage}
            </button>
          </div>
        </form>
      </section>

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
  materialLabel,
  colorLabel,
  sizeRangeLabel,
  suffix,
  translation,
}: {
  nameLabel: string;
  shortLabel: string;
  descriptionLabel: string;
  materialLabel: string;
  colorLabel: string;
  sizeRangeLabel: string;
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

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Input
          label={materialLabel}
          name={`material_${suffix}`}
          defaultValue={translation.material ?? ""}
        />
        <Input
          label={colorLabel}
          name={`color_${suffix}`}
          defaultValue={translation.color ?? ""}
        />
        <Input
          label={sizeRangeLabel}
          name={`size_range_${suffix}`}
          defaultValue={translation.size_range ?? ""}
        />
      </div>
    </div>
  );
}
