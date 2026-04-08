type CategoryGridProps = {
  items: Array<{
    slug: string;
    nameEn: string;
    summaryEn: string;
  }>;
};

export function CategoryGrid({ items }: CategoryGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((category) => (
        <article
          key={category.slug}
          className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Category
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-stone-950">
            {category.nameEn}
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            {category.summaryEn}
          </p>
        </article>
      ))}
    </div>
  );
}
