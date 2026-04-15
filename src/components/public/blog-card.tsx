import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function BlogCard({
  title,
  excerpt,
  href,
  imageUrl,
  category = "Engineering",
  date = "Today",
  accentColor = "#2563eb",
}: {
  title: string;
  excerpt: string;
  href: string;
  imageUrl?: string;
  category?: string;
  date?: string;
  accentColor?: string;
}) {
  const fallbackImage = "https://images.unsplash.com/photo-1537462715879-360eeb6ac292?auto=format&fit=crop&q=80";

  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-56 w-full overflow-hidden bg-stone-100">
        <Image 
          src={imageUrl || fallbackImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500" />
      </div>
      <div className="flex flex-col flex-1 p-8">
        <div className="mb-4 flex items-center gap-4">
          <span className="rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: `${accentColor}11`, borderColor: `${accentColor}22`, color: accentColor }}>
            {category}
          </span>
          <span className="text-xs font-medium text-stone-400">{date}</span>
        </div>
        <h3 className="mb-4 text-xl font-bold leading-[1.3] text-stone-900 transition-colors group-hover:opacity-80">
          {title}
        </h3>
        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-stone-500">
          {excerpt}
        </p>
        <div className="mt-auto flex items-center gap-2 text-sm font-bold transition-colors" style={{ color: accentColor }}>
          Read Full Article
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
    </Link>
  );
}
