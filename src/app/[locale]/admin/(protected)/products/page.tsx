import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import azMessages from "@/messages/az.json";
import enMessages from "@/messages/en.json";
import ruMessages from "@/messages/ru.json";

type Locale = "az" | "en" | "ru";

type ProductRow = {
  id: string;
  slug: string;
  price: number;
  currency: string;
  status: string;
  stock_quantity: number;
  is_featured: boolean;
  categories:
    | {
        name_az: string;
        name_en: string;
        name_ru: string;
      }
    | {
        name_az: string;
        name_en: string;
        name_ru: string;
      }[]
    | null;
  product_translations: {
    name: string;
    locale: Locale;
  }[];
};

function getCategory(product: ProductRow) {
  if (Array.isArray(product.categories)) {
    return product.categories[0] ?? null;
  }

  return product.categories;
}

export default async function AdminProductsPage({
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

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      slug,
      price,
      currency,
      status,
      stock_quantity,
      is_featured,
      categories (
        name_az,
        name_en,
        name_ru
      ),
      product_translations (
        name,
        locale
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const products = (data ?? []) as ProductRow[];

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Link
            href="/admin"
            className="text-sm text-[#D6C2A8] transition hover:text-white"
          >
            ← {t.backToDashboard}
          </Link>

          <h1 className="mt-5 text-4xl font-semibold">
            {t.productsPageTitle}
          </h1>

          <p className="mt-3 text-white/50">{t.productsPageDescription}</p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-full bg-[#D6C2A8] px-6 py-3 text-sm font-medium text-black transition hover:bg-[#c4ad90]"
        >
          {t.addProduct}
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-white/40">
              <tr>
                <th className="px-6 py-5">{t.productName}</th>
                <th className="px-6 py-5">{t.category}</th>
                <th className="px-6 py-5">{t.price}</th>
                <th className="px-6 py-5">{t.status}</th>
                <th className="px-6 py-5">{t.stock}</th>
                <th className="px-6 py-5">{t.featured}</th>
                <th className="px-6 py-5">{t.actions}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {products.length ? (
                products.map((product) => {
                  const translation =
                    product.product_translations.find(
                      (item) => item.locale === currentLocale
                    ) ?? product.product_translations[0];

                  const category = getCategory(product);

                  const categoryName =
                    currentLocale === "az"
                      ? category?.name_az
                      : currentLocale === "en"
                        ? category?.name_en
                        : category?.name_ru;

                  return (
                    <tr key={product.id} className="text-white/70">
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-medium text-white">
                            {translation?.name || product.slug}
                          </p>
                          <p className="mt-1 text-xs text-white/35">
                            {product.slug}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">{categoryName || "-"}</td>

                      <td className="px-6 py-5">
                        {product.price} {product.currency}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
                          {product.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">{product.stock_quantity}</td>

                      <td className="px-6 py-5">
                        {product.is_featured ? t.yes : t.no}
                      </td>

                      <td className="px-6 py-5">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-[#D6C2A8] transition hover:text-white"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-white/45"
                  >
                    {t.noProducts}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}