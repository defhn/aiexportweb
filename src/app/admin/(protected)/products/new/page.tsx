import { toSlug } from "@/lib/slug";

export default function AdminNewProductPage() {
  const demoName = "Custom Aluminum CNC Bracket";

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">新增产品</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          后续这里会接入完整产品表单。当前先把 slug 规则和默认字段思路以可见方式固定下来。
        </p>
      </section>

      <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
          slug preview
        </p>
        <p className="mt-3 text-lg font-semibold text-stone-950">
          {toSlug(demoName)}
        </p>
      </article>
    </div>
  );
}
