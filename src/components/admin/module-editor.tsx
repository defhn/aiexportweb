type ModuleEditorProps = {
  title: string;
  description: string;
  enabled: boolean;
  sortOrder: number;
  featuredCategoryIds?: number[];
  featuredProductIds?: number[];
};

export function ModuleEditor({
  title,
  description,
  enabled,
  sortOrder,
  featuredCategoryIds = [],
  featuredProductIds = [],
}: ModuleEditorProps) {
  return (
    <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            {description}
          </p>
        </div>
        <div className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
          排序 {sortOrder}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-stone-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            状�?          </p>
          <p className="mt-2 text-sm font-medium text-stone-950">
            {enabled ? "已启�? : "已停�?}
          </p>
        </div>
        <div className="rounded-2xl bg-stone-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            推荐分类
          </p>
          <p className="mt-2 text-sm font-medium text-stone-950">
            {featuredCategoryIds.length} �?          </p>
        </div>
        <div className="rounded-2xl bg-stone-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            推荐产品
          </p>
          <p className="mt-2 text-sm font-medium text-stone-950">
            {featuredProductIds.length} �?          </p>
        </div>
      </div>
    </section>
  );
}
