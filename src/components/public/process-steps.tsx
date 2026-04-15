import { ClipboardCheck, FileEdit, PackageCheck, Settings } from "lucide-react";

const defaultSteps = [
  {
    icon: FileEdit,
    title: "1. Share Requirements",
    description: "Send product references, quantities, target market, and timeline for an initial review.",
  },
  {
    icon: Settings,
    title: "2. Prototyping",
    description: "We produce the first sample so your team can confirm fit, form, and function.",
  },
  {
    icon: ClipboardCheck,
    title: "3. Order Preparation",
    description: "Approved items move into order preparation with quality and packing checkpoints.",
  },
  {
    icon: PackageCheck,
    title: "4. Global Shipping",
    description: "Export packaging, labeling, and logistics coordination are prepared for shipment.",
  },
];

type ProcessStepsProps = {
  eyebrow?: string;
  title?: string;
  items?: string[];
};

export function ProcessSteps({
  eyebrow = "Streamlined Process",
  title = "How We Work",
  items = [],
}: ProcessStepsProps) {
  const steps = defaultSteps.map((step, index) => {
    const override = items[index];

    if (!override) {
      return step;
    }

    const [itemTitle, itemDescription] = override.split("|").map((value) => value.trim());

    return {
      ...step,
      title: itemTitle || step.title,
      description: itemDescription || step.description,
    };
  });

  return (
    <section className="relative overflow-hidden border-t border-stone-800 bg-stone-900 py-24">
      <div className="absolute inset-0 opacity-10 texture-carbon" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-sm font-black uppercase tracking-[0.4em] text-blue-500">
            {eyebrow}
          </h2>
          <h3 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{title}</h3>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={`${step.title}-${index}`} className="group relative">
                {index < steps.length - 1 ? (
                  <div className="absolute left-[60%] top-[2.5rem] z-0 hidden h-[1px] w-full bg-gradient-to-r from-stone-700 to-transparent md:block" />
                ) : null}

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-stone-700 bg-stone-800 text-stone-300 shadow-xl transition-all duration-300 group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h4 className="mb-2 text-lg font-bold text-white">{step.title}</h4>
                  <p className="max-w-[220px] text-sm text-stone-400">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
