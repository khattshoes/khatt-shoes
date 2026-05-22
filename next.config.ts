import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hdjljwenqyhqkuddmvuk.supabase.co",
        pathname: "/storage/v1/object/public/product-images/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);