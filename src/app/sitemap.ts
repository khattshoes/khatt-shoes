import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://khattshoes.az";

type ProductRow = {
  slug: string;
  updated_at: string | null;
  created_at: string | null;
};

function getUrl(locale: string, path = "") {
  return `${siteUrl}/${locale}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const staticPages = [
    {
      path: "",
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      path: "/shop",
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      path: "/custom-order",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      path: "/repair",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      path: "/about",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      path: "/contact",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  const staticUrls: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: getUrl(locale, page.path),
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  );

  const { data, error } = await supabase
    .from("products")
    .select("slug, updated_at, created_at")
    .eq("status", "active");

  if (error) {
    console.error("Sitemap products error:", error.message);
    return staticUrls;
  }

  const products = (data ?? []) as ProductRow[];

  const productUrls: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    products.map((product) => ({
      url: getUrl(locale, `/shop/${product.slug}`),
      lastModified: product.updated_at || product.created_at || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  return [...staticUrls, ...productUrls];
}