import type { Metadata } from "next";

import { getPageModules } from "@/features/pages/queries";
import { getSiteSettings } from "@/features/settings/queries";
import Image from "next/image";
import { Activity, Target, Zap, Globe2, Building2, MapPin } from "lucide-react";

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

export async function generateMetadata(): Promise<Metadata> {
  const modules = await getPageModules("about");
  const payload = modules[0]?.payloadJson ?? {};
  const seoTitle = readString(payload, "seoTitle");
  const seoDescription = readString(payload, "seoDescription");
  return {
    title: seoTitle || "About Us",
    description: seoDescription || "Learn about our manufacturing capabilities, history, and global reach.",
  };
}

export default async function AboutPage() {
  const [settings, modules] = await Promise.all([
    getSiteSettings(),
    getPageModules("about"),
  ]);
  const aboutModule = modules[0];

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Epic Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <Image 
                src="/images/factory_panorama_hero_1775635573170.png"
                alt="State of the art CNC manufacturing facility"
                fill
                sizes="100vw"
                className="object-cover"
                priority
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-stone-950/70" />
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center mt-16">
            <h1 className="text-sm font-black uppercase tracking-[0.4em] text-blue-500 mb-6 drop-shadow-sm">
                About TITAN CNC
            </h1>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white max-w-4xl mx-auto leading-[1.1]">
                We Don't Just Machine Parts. <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">We Engineer Advantage.</span>
            </h2>
        </div>
      </section>

      {/* 2. Floating Metric Strip */}
      <section className="relative z-20 -mt-16 mx-auto max-w-5xl px-6">
        <div className="bg-white rounded-3xl shadow-2xl border border-stone-100 p-8 flex flex-col md:flex-row justify-between divide-y md:divide-y-0 md:divide-x divide-stone-100">
            <div className="flex-1 text-center py-4 md:py-0">
                <p className="text-5xl font-black text-stone-900 tracking-tighter">15k<span className="text-blue-500 text-3xl">+</span></p>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mt-2">SQ.M Facility</p>
            </div>
            <div className="flex-1 text-center py-4 md:py-0">
                <p className="text-5xl font-black text-stone-900 tracking-tighter">150<span className="text-blue-500 text-3xl">+</span></p>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mt-2">CNC Machines</p>
            </div>
            <div className="flex-1 text-center py-4 md:py-0">
                <p className="text-5xl font-black text-stone-900 tracking-tighter">24<span className="text-blue-500 text-3xl">/</span>7</p>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mt-2">Operations</p>
            </div>
            <div className="flex-1 text-center py-4 md:py-0">
                <p className="text-5xl font-black text-stone-900 tracking-tighter">15<span className="text-blue-500 text-3xl">Yr</span></p>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mt-2">Industry Exp.</p>
            </div>
        </div>
      </section>

      {/* 3. The Story & Evolution */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[600px] rounded-[2.5rem] overflow-hidden shadow-xl order-2 lg:order-1">
                <Image 
                    src="/images/precision_quality_inspection_1775635476602.png"
                    alt="Precision Engineering and Quality Control"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 border-[8px] border-white/10 rounded-[2.5rem] pointer-events-none" />
                
                {/* Float Badge */}
                <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl max-w-[240px]">
                    <Activity className="h-8 w-8 text-blue-600 mb-3" />
                    <p className="text-lg font-black text-stone-900 leading-tight">ISO Class 8 Cleanroom Fully Operational.</p>
                </div>
            </div>
            
            <div className="order-1 lg:order-2">
                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-blue-600 mb-4">Our Heritage</h3>
                <h4 className="text-3xl md:text-5xl font-bold tracking-tight text-stone-900 leading-[1.1] mb-6">
                    From a Local Workshop to a Global Supply Chain Hub.
                </h4>
                <div className="space-y-6 text-lg text-stone-600 leading-relaxed">
                    <p>
                        {readString(aboutModule?.payloadJson ?? {}, "description") ||
                        settings.taglineEn || "Founded over a decade ago, TITAN CNC began as a specialized tool and die shop. Driven by an obsession with precision, we rapidly expanded our capabilities to meet the demanding standards of the aerospace, medical, and automotive sectors."}
                    </p>
                    <p>
                        Today, we operate a world-class manufacturing campus in {settings.addressEn || "Dongguan, China"}. We fuse traditional manufacturing wisdom with cutting-edge Industry 4.0 automation, ensuring that every component we ship represents the absolute pinnacle of quality.
                    </p>
                </div>
                
                {/* Timeline Grid */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                        <div className="h-12 w-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center mb-4">
                            <Target className="h-5 w-5 text-stone-900" />
                        </div>
                        <h5 className="font-bold text-stone-900 mb-2">Absolute Precision</h5>
                        <p className="text-sm text-stone-500">Tolerances held up to ±0.005mm using premium Hexagon CMM validation.</p>
                    </div>
                    <div>
                        <div className="h-12 w-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center mb-4">
                            <Zap className="h-5 w-5 text-stone-900" />
                        </div>
                        <h5 className="font-bold text-stone-900 mb-2">Agile Production</h5>
                        <p className="text-sm text-stone-500">From 1-off prototypes in 24 hours to 100,000+ unit volume runs.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 4. Global Map / Reach */}
      <section className="py-32 bg-stone-50 border-t border-stone-100 relative">
        <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <Globe2 className="h-8 w-8 text-blue-600 mx-auto mb-6" />
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900">Trusted Across Continents</h3>
                <p className="mt-4 text-stone-500 text-lg">We manage complex logistics seamlessly, delivering precision parts to over 40 countries directly targeting your assembly line.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex items-start gap-4">
                    <Building2 className="h-6 w-6 text-stone-400 shrink-0" />
                    <div>
                        <h4 className="font-bold text-stone-900">Headquarters & Factory</h4>
                        <p className="text-sm text-stone-500 mt-2">{settings.addressEn || "Smart Manufacturing Park, Dongguan, China"}</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-blue-500 shrink-0" />
                    <div>
                        <h4 className="font-bold text-stone-900">North America Logistics</h4>
                        <p className="text-sm text-stone-500 mt-2">DDP shipping with custom clearance handled via FedEx & DHL hubs.</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-indigo-500 shrink-0" />
                    <div>
                        <h4 className="font-bold text-stone-900">European Distribution</h4>
                        <p className="text-sm text-stone-500 mt-2">Railway and Airfreight routes active for DACH region and UK partners.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </main>
  );
}
