import { buildBlogDraft } from "@/features/blog/actions";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export default function AdminNewBlogPage() {
  const draft = buildBlogDraft({
    titleZh: "如何选择可靠的 CNC 零件供应商",
    titleEn: "How to Choose a Reliable CNC Parts Supplier",
    contentZh: "这里是中文文章草稿。",
    contentEn:
      "<p>A practical checklist for evaluating machining quality, lead times, communication, and export experience.</p>",
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">新增文章</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          当前先用草稿 contract 固定标题、slug 和摘要回退逻辑，后续会接表单保存。
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="space-y-4 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Slug Preview
          </p>
          <p className="text-lg font-semibold text-stone-950">{draft.slug}</p>
        </article>
        <article className="space-y-4 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            English Excerpt
          </p>
          <p className="text-sm leading-6 text-stone-700">{draft.excerptEn}</p>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <RichTextEditor label="中文正文" defaultValue={draft.contentZh} />
        </div>
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <RichTextEditor label="英文正文" defaultValue={draft.contentEn} />
        </div>
      </div>
    </div>
  );
}
