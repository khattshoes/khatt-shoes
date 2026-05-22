import { Container } from "./container";

type SimplePageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SimplePage({ eyebrow, title, description }: SimplePageProps) {
  return (
    <main className="min-h-screen bg-[#0D0D0D] pb-24 pt-36">
      <Container>
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#D6C2A8]">
          {eyebrow}
        </p>
        <h1 className="max-w-4xl text-6xl font-semibold leading-tight md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
          {description}
        </p>
      </Container>
    </main>
  );
}