type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#D6C2A8]">
        {eyebrow}
      </p>

      <h2 className="text-3xl font-semibold leading-tight text-[#F5F3EF] md:text-5xl">
        {title}
      </h2>

      {description ? (
        <p className="mt-5 text-base leading-8 text-white/55 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}