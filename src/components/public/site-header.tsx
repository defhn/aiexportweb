import Link from "next/link";

const navItems = [
  ["About", "/about"],
  ["Products", "/products"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader({
  companyName,
}: {
  companyName: string;
}) {
  return (
    <header className="border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link className="text-lg font-semibold text-slate-950" href="/">
          {companyName}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map(([label, href]) => (
            <Link key={href} className="text-sm text-slate-700" href={href}>
              {label}
            </Link>
          ))}
          <Link
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
            href="/contact"
          >
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
