import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://khattshoes.az";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/az/admin", "/en/admin", "/ru/admin"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}