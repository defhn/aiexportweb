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
}: {
  title: string;
  excerpt: string;
  href: string;
  imageUrl?: string;
  category?: string;
  date?: string;
}) {
  const fallbackImage = "https://images.unsplash.com/photo-1537462715879-360eeb6ac292?auto=format&fit=crop&q=80";

  return (
    <Link href={href} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-stone-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1">
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
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {category}
          </span>
          <span className="text-xs text-stone-400 font-medium">{date}</span>
        </div>
        <h3 className="text-xl font-bold text-stone-900 group-hover:text-blue-600 transition-colors leading-[1.3] mb-4">
          {title}
        </h3>
        <p className="text-sm text-stone-500 leading-relaxed line-clamp-3 mb-6">
          {excerpt}
        </p>
        <div className="mt-auto flex items-center gap-2 text-sm font-bold text-stone-400 group-hover:text-blue-600 transition-colors">
          Read Full Article
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
    </Link>
  );
}
