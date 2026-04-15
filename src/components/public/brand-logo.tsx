import { Hexagon } from "lucide-react";

export function BrandLogo({
  className = "",
  companyName,
  isDark = false,
  tagline = "Export Partner",
}: {
  className?: string;
  companyName?: string;
  isDark?: boolean;
  tagline?: string;
}) {
  const displayName = companyName?.trim() || "Export Partner";

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <div className={`flex items-center justify-center p-1.5 rounded-lg border-2 transition-all duration-300 group-hover:border-blue-500 group-hover:scale-105 ${isDark ? 'border-white/20 text-white' : 'border-stone-900 text-stone-900'}`}>
        <Hexagon className="h-5 w-5" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col">
        <span className={`max-w-[180px] truncate text-[17px] leading-none font-black tracking-tighter ${isDark ? 'text-white' : 'text-stone-900'}`}>
          {displayName}
        </span>
        <span className={`text-[8.5px] font-bold tracking-[0.2em] uppercase mt-0.5 opacity-80 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
          {tagline}
        </span>
      </div>
    </div>
  );
}
