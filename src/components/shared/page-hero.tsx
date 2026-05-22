type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow = "KHATT Shoes", title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#0D0D0D] py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,194,168,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(116,72,38,0.16),transparent_38%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#D6C2A8]">
            {eyebrow}
          </p>

          <h1 className="text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#F5F3EF] md:text-6xl">
            {title}
          </h1>

          <p className="mt-6 text-base leading-8 text-white/60 md:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}