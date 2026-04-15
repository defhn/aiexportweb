"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type SiteOption = {
  slug: string;
  name: string;
};

export function AdminSiteSwitcher({
  currentSiteSlug,
  options,
}: {
  currentSiteSlug: string;
  options: SiteOption[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleChange(nextSiteSlug: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("site", nextSiteSlug);
    const nextUrl = `${pathname}?${params.toString()}`;
    startTransition(() => {
      router.push(nextUrl);
      router.refresh();
    });
  }

  return (
    <label className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
        Site
      </span>
      <select
        className="min-w-40 bg-transparent text-sm font-medium text-stone-900 outline-none"
        defaultValue={currentSiteSlug}
        disabled={isPending}
        onChange={(event) => handleChange(event.target.value)}
      >
        {options.map((site) => (
          <option key={site.slug} value={site.slug}>
            {site.name}
          </option>
        ))}
      </select>
    </label>
  );
}
