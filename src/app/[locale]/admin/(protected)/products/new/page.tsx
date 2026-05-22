import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import { createProductAction } from "./actions";
import azMessages from "@/messages/az.json";
import enMessages from "@/messages/en.json";
import ruMessages from "@/messages/ru.json";

type CategoryRow = {
  id: string;
  name_az: string;
  name_en: string;
  name_ru: string;
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

  const allMessages = {
    az: azMessages,
    en: enMessages,
    ru: ruMessages,
  };

  const t = allMessages[locale as keyof typeof allMessages].Admin;
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
        <input type="hidden" name="locale" value={locale} />

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-xl font-semibold">Product info</h2>

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
                    locale === "az"
                      ? category.name_az
                      : locale === "en"
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
            <Input label={t.material} name="material" placeholder="Leather" />
            <Input label={t.color} name="color" placeholder="Black" />
            <Input label={t.sizeRange} name="size_range" placeholder="40-44" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Checkbox label={t.isFeatured} name="is_featured" />
            <Checkbox label={t.isCustomAvailable} name="is_custom_available" />
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
            />

            <TranslationBlock
              nameLabel={t.nameEn}
              shortLabel={t.shortDescriptionEn}
              descriptionLabel={t.descriptionEn}
              suffix="en"
            />

            <TranslationBlock
              nameLabel={t.nameRu}
              shortLabel={t.shortDescriptionRu}
              descriptionLabel={t.descriptionRu}
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

function Checkbox({ label, name }: { label: string; name: string }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white/70">
      <input name={name} type="checkbox" className="h-4 w-4" />
      {label}
    </label>
  );
}

function TranslationBlock({
  nameLabel,
  shortLabel,
  descriptionLabel,
  suffix,
}: {
  nameLabel: string;
  shortLabel: string;
  descriptionLabel: string;
  suffix: "az" | "en" | "ru";
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
    </div>
  );
}