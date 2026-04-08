import Link from "next/link";

export function BlogCard({
  title,
  excerpt,
  href,
}: {
  title: string;
  excerpt: string;
  href: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-950">
        <Link href={href}>{title}</Link>
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{excerpt}</p>
      <Link className="mt-4 inline-flex text-sm font-medium text-amber-700" href={href}>
        Read article
      </Link>
    </article>
  );
}
