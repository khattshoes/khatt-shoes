import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <main className="min-h-screen bg-[#0D0D0D] px-6 py-32 text-[#F5F3EF]">
      <div className="mx-auto max-w-6xl">
        <p className="mb-5 text-xs uppercase tracking-[0.45em] text-[#D6C2A8]">
          {t("eyebrow")}
        </p>

        <h1 className="max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">
          {t("title")}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
          {t("description")}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button className="rounded-full bg-[#D6C2A8] px-8 py-4 text-black transition hover:bg-[#c4ad90]">
            {t("shop")}
          </button>

          <button className="rounded-full border border-white/20 px-8 py-4 transition hover:border-[#D6C2A8] hover:text-[#D6C2A8]">
            {t("custom")}
          </button>
        </div>
      </div>
    </main>
  );
}