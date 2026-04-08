import { BlogCard } from "@/components/public/blog-card";
import { getBlogPosts } from "@/features/blog/queries";

export default async function BlogListPage() {
  const posts = await getBlogPosts();

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold text-slate-950">
          Insights for Global Buyers
        </h1>
        <p className="mt-4 text-slate-600">
          Publish English articles that support SEO, build trust, and route
          readers toward product inquiries.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <BlogCard
            key={post.slug}
            excerpt={post.excerptEn}
            href={`/blog/${post.slug}`}
            title={post.titleEn}
          />
        ))}
      </div>
    </section>
  );
}
