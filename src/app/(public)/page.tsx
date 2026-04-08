import Link from "next/link";

export default async function HomePage() {
  return (
    <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-8 px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
        Export Growth System
      </p>
      <h1 className="max-w-3xl text-5xl font-semibold leading-tight">
        High-Quality Manufacturing Solutions for Global Buyers
      </h1>
      <p className="max-w-2xl text-lg text-slate-600">
        Build trust, showcase products, and capture qualified inquiries with an
        English public site and a Chinese admin.
      </p>
      <div className="flex gap-4">
        <Link
          className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white"
          href="/contact"
        >
          Get a Quote
        </Link>
        <Link
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-900"
          href="/products"
        >
          Explore Products
        </Link>
      </div>
    </section>
  );
}
