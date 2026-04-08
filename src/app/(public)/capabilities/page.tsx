import Image from "next/image";
import { CheckCircle2, ChevronRight, DraftingCompass, Cpu, Layers, Settings } from "lucide-react";

export default function CapabilitiesPage() {
  return (
    <main className="min-h-screen bg-stone-50 pt-24 pb-32">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-sm font-black uppercase tracking-[0.4em] text-blue-600 mb-4">Core Competencies</h1>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 leading-[1.1]">
              Advanced Manufacturing Capabilities
            </h2>
            <p className="mt-4 text-lg text-stone-500">
              From rapid prototyping to high-volume production, we leverage world-class CNC equipment and stringent quality controls to bring your most complex engineering designs to life.
            </p>
        </div>

        {/* Highlight 1: 5-Axis Machining */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-stone-200 overflow-hidden flex flex-col lg:flex-row mb-12">
            <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                <div className="bg-blue-50 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                    <Cpu className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-stone-900 mb-6">5-Axis CNC Milling</h3>
                <p className="text-stone-500 leading-relaxed text-lg mb-8">
                    Our flagship 5-axis machining centers allow us to manufacture complex geometries and highly intricate features in a single setup. This significantly reduces tooling costs, minimizes handling errors, and accelerates lead times.
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" />
                        <span className="font-medium text-stone-700">Tolerances up to ±0.005mm</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" />
                        <span className="font-medium text-stone-700">Optimal for Aerospace & Medical parts</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" />
                        <span className="font-medium text-stone-700">Hermle & DMG MORI Equipment</span>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-1/2 relative min-h-[400px] bg-stone-100">
                <Image 
                    src="/images/cnc_machining_center_1775635445683.png"
                    alt="5 Axis CNC Milling"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                />
            </div>
        </div>

        {/* Highlight 2: CNC Turning */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-stone-200 overflow-hidden flex flex-col lg:flex-row-reverse mb-12">
            <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                <div className="bg-stone-100 text-stone-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                    <Settings className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-stone-900 mb-6">Precision CNC Turning</h3>
                <p className="text-stone-500 leading-relaxed text-lg mb-8">
                    Equipped with live tooling and automated bar feeders, our multi-axis CNC lathes excel in producing cylindrical components with complex cross-features rapidly and cost-effectively.
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" />
                        <span className="font-medium text-stone-700">High-volume automated production</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" />
                        <span className="font-medium text-stone-700">Turn-mill combined operations</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" />
                        <span className="font-medium text-stone-700">Mazak & Okuma Lathes</span>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-1/2 relative min-h-[400px] bg-stone-100">
                <Image 
                    src="/images/cnc_turning_machine_1775635506691.png"
                    alt="Precision CNC Turning"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                />
            </div>
        </div>

        {/* Material & Finishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24">
             <div className="bg-stone-950 rounded-[2rem] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Layers className="w-32 h-32 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-6">Machined Materials</h4>
                <ul className="space-y-4 relative z-10">
                    <li className="flex justify-between items-center text-stone-400 border-b border-stone-800 pb-2">
                        <span className="font-medium text-stone-300">Titanium</span>
                        <span className="text-sm">Ti-6Al-4V, Grade 2, Grade 5</span>
                    </li>
                    <li className="flex justify-between items-center text-stone-400 border-b border-stone-800 pb-2">
                        <span className="font-medium text-stone-300">Aluminum</span>
                        <span className="text-sm">6061, 7075, 2024, 5052</span>
                    </li>
                    <li className="flex justify-between items-center text-stone-400 border-b border-stone-800 pb-2">
                        <span className="font-medium text-stone-300">Stainless Steel</span>
                        <span className="text-sm">303, 304, 316, 17-4 PH</span>
                    </li>
                    <li className="flex justify-between items-center text-stone-400 pb-2">
                        <span className="font-medium text-stone-300">Engineering Plastics</span>
                        <span className="text-sm">PEEK, POM, PTFE, Nylon</span>
                    </li>
                </ul>
             </div>

             <div className="bg-white rounded-[2rem] p-10 border border-stone-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <DraftingCompass className="w-32 h-32 text-stone-900" />
                </div>
                <h4 className="text-2xl font-bold text-stone-900 mb-6">Surface Treatments</h4>
                <ul className="space-y-4 relative z-10">
                    <li className="flex justify-between items-center text-stone-500 border-b border-stone-100 pb-2">
                        <span className="font-medium text-stone-900">Anodizing</span>
                        <span className="text-sm">Type II, Type III (Hardcoat)</span>
                    </li>
                    <li className="flex justify-between items-center text-stone-500 border-b border-stone-100 pb-2">
                        <span className="font-medium text-stone-900">Plating</span>
                        <span className="text-sm">Zinc, Nickel, Chrome, Gold</span>
                    </li>
                    <li className="flex justify-between items-center text-stone-500 border-b border-stone-100 pb-2">
                        <span className="font-medium text-stone-900">Coating</span>
                        <span className="text-sm">Powder Coating, PVD, DLC</span>
                    </li>
                    <li className="flex justify-between items-center text-stone-500 pb-2">
                        <span className="font-medium text-stone-900">Bead Blasting</span>
                        <span className="text-sm">Glass Bead, Ceramic, Sand</span>
                    </li>
                </ul>
             </div>
        </div>

      </div>
    </main>
  );
}
