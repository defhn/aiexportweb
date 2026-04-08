import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { getBlogPosts } from "@/features/blog/queries";

type AdminBlogDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminBlogDetailPage({
  params,
}: AdminBlogDetailPageProps) {
  const { id } = await params;
  const posts = await getBlogPosts();
  const post = posts[Number(id) - 1] ?? posts[0];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">编辑文章</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          这里会逐步承接分类、标签、SEO 标题、封面图和发布状态。
        </p>
      </section>

      <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-stone-950">{post.titleZh}</h3>
        <p className="mt-2 text-sm text-stone-600">{post.titleEn}</p>
      </article>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <RichTextEditor label="中文正文" defaultValue={post.contentZh} />
        </div>
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <RichTextEditor label="英文正文" defaultValue={post.contentEn} />
        </div>
      </div>
    </div>
  );
}
