import Link from "next/link";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export function HeroSection({
  eyebrow,
  title,
  description,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: HeroSectionProps) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
        {eyebrow}
      </p>
      <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight text-slate-950">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white"
          href={primaryCtaHref}
        >
          {primaryCtaLabel}
        </Link>
        {secondaryCtaLabel && secondaryCtaHref ? (
          <Link
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-900"
            href={secondaryCtaHref}
          >
            {secondaryCtaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
