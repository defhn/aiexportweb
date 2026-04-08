import Link from "next/link";

type ProductCardProps = {
  categorySlug: string;
  slug: string;
  nameEn: string;
  shortDescriptionEn: string;
};

export function ProductCard({
  categorySlug,
  slug,
  nameEn,
  shortDescriptionEn,
}: ProductCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
        Product
      </p>
      <h2 className="mt-4 text-2xl font-semibold text-stone-950">{nameEn}</h2>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        {shortDescriptionEn}
      </p>
      <Link
        className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
        href={`/products/${categorySlug}/${slug}`}
      >
        View Details
      </Link>
    </article>
  );
}
