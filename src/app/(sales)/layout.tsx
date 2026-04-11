import Link from "next/link";

export default function SalesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">
              Sales Page
            </p>
            <p className="mt-2 text-xl font-semibold text-stone-950">
              外贸建站系统定价
            </p>
          </div>
          <Link
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950"
            href="/"
          >
            返回网站
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
