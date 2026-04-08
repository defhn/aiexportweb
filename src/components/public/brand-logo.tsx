import { Hexagon } from "lucide-react";

export function BrandLogo({ className = "", isDark = false }: { className?: string, isDark?: boolean }) {
  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <div className={`flex items-center justify-center p-1.5 rounded-lg border-2 transition-all duration-300 group-hover:border-blue-500 group-hover:scale-105 ${isDark ? 'border-white/20 text-white' : 'border-stone-900 text-stone-900'}`}>
        <Hexagon className="h-5 w-5" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col">
        <span className={`text-[17px] leading-none font-black tracking-tighter ${isDark ? 'text-white' : 'text-stone-900'}`}>
          TITAN<span className="text-blue-600 ml-0.5">CNC</span>
        </span>
        <span className={`text-[8.5px] font-bold tracking-[0.2em] uppercase mt-0.5 opacity-80 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
          Precision Mfg
        </span>
      </div>
    </div>
  );
}
