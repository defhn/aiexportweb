import { defaultFieldDefinitions, type DefaultFieldKey } from "@/db/seed/default-field-defs";
import type {
  SeedCategory,
  SeedCustomField,
  SeedPackKey,
  SeedProduct,
  SeedProductFieldValue,
} from "@/db/seed/types";

export type SiteCheckpointStatus = "pending" | "in_progress" | "completed" | "failed";

export type SiteSeedRunState = {
  siteSlug: string;
  seedPackKey: SeedPackKey;
  totalProducts: number;
  completedProductSlugs: string[];
  status: SiteCheckpointStatus;
  attemptCount?: number;
  sqlPath?: string;
  jsonPath?: string;
  error?: string;
};

export type SeedRunCheckpoint = {
  version: number;
  updatedAt: string;
  sites: SiteSeedRunState[];
};

type ProductTitleMap = Record<Exclude<SeedPackKey, "cnc">, string[]>;

const PRODUCT_TITLES: ProductTitleMap = {
  "industrial-equipment": [
    "Automatic Feeding System",
    "Servo Conveyor Line",
    "Robotic Palletizing Cell",
    "Rotary Assembly Station",
    "Carton Erector Module",
    "Vision Inspection Station",
    "Pick and Place Unit",
    "Case Packing Line",
    "Screw Fastening Cell",
    "Transfer Robot Platform",
  ],
  "building-materials": [
    "Curtain Wall Panel",
    "Stone Composite Cladding",
    "Insulated Sandwich Panel",
    "Acoustic Ceiling Baffle",
    "Architectural Metal Screen",
    "Prefabricated Wall Module",
    "Decorative PVC Panel",
    "Fire Rated Door Set",
    "Solar Shading Louver",
    "Raised Access Floor Panel",
  ],
  "energy-power": [
    "Battery Pack Enclosure",
    "Solar Inverter Cabinet",
    "Busbar Connection Assembly",
    "Transformer Cooling Radiator",
    "Outdoor Distribution Box",
    "Battery Rack System",
    "EV Charger Cabinet",
    "Cable Tray Support",
    "PV Mounting Rail",
    "Power Control Console",
  ],
  "medical-health": [
    "Rehabilitation Walker Frame",
    "Hospital Bed Side Rail",
    "Mobility Shower Chair",
    "Patient Transfer Board",
    "Adjustable Crutch Set",
    "Medical Cart Tray",
    "Orthopedic Support Brace",
    "Bedside Commode Chair",
    "Examination Step Stool",
    "Infusion Pole Base",
  ],
  "fluid-hvac": [
    "Stainless Manifold Header",
    "Heat Exchanger Frame",
    "Duct Damper Blade",
    "Air Handler Access Panel",
    "Chilled Water Valve Body",
    "Filter Housing Shell",
    "Fan Coil Drain Pan",
    "Copper Branch Connection Kit",
    "Rooftop Unit Base Frame",
    "Ventilation Grille Panel",
  ],
  lighting: [
    "LED High Bay Housing",
    "Linear Light Channel",
    "Floodlight Mounting Bracket",
    "Street Light Pole Adapter",
    "Recessed Downlight Trim",
    "Emergency Light Enclosure",
    "Pendant Light Canopy",
    "Wall Lamp Backplate",
    "Waterproof Batten Housing",
    "Lighting Junction Box",
  ],
  "hardware-plastics": [
    "Cable Gland Body",
    "Nylon Mounting Clip",
    "ABS Control Knob",
    "Threaded Pipe Fitting",
    "Polycarbonate Cover Shell",
    "Stamped Hinge Assembly",
    "Molded Housing Bracket",
    "Quick Release Latch",
    "Plastic Spacer Block",
    "Overmolded Handle Grip",
  ],
  "furniture-outdoor": [
    "Outdoor Dining Frame",
    "Chair Armrest Set",
    "Wicker Sofa Base",
    "Folding Table Leg Set",
    "Gazebo Support Bracket",
    "Sling Chair Support Bar",
    "Patio Umbrella Hub",
    "Storage Cabinet Panel",
    "Outdoor Bench Side Frame",
    "Lounger Back Support",
  ],
  "textile-packaging": [
    "Woven Shopping Bag",
    "Insulated Cooler Tote",
    "Mailer Bag",
    "Cosmetic Zipper Pouch",
    "Drawstring Gift Bag",
    "Laminated Packaging Sack",
    "Garment Dust Cover",
    "Promotional Canvas Tote",
    "Nonwoven Shopping Bag",
    "Bubble Courier Mailer",
  ],
  "consumer-electronics": [
    "Bluetooth Speaker Housing",
    "Wireless Charger Stand",
    "Smart Plug Shell",
    "Camera Mount Bracket",
    "USB Hub Enclosure",
    "Power Bank Case",
    "Earbud Charging Cradle",
    "Thermostat Front Panel",
    "Router Wall Mount Kit",
    "Device Back Cover",
  ],
  lifestyle: [
    "Stainless Tumbler Body",
    "Candle Jar Lid",
    "Bamboo Storage Tray",
    "Travel Bottle Set",
    "Gift Box Closure",
    "Leather Keychain Blank",
    "Ceramic Mug Handle Set",
    "Reusable Lunch Box Shell",
    "Diffuser Cover",
    "Desk Organizer Holder",
  ],
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeField(value: string): SeedProductFieldValue {
  return {
    valueZh: value,
    valueEn: value,
    visible: true,
  };
}

function buildDefaultFields(
  title: string,
  categoryName: string,
): Partial<Record<DefaultFieldKey, SeedProductFieldValue>> {
  return {
    model: makeField(`MODEL-${slugify(title).toUpperCase().replace(/-/g, "-")}`),
    material: makeField(`${categoryName} grade material`),
    process: makeField("OEM fabrication and finishing"),
    size: makeField("Custom to drawing"),
    tolerance: makeField("+/-0.05 mm"),
    surface_treatment: makeField("Powder coating / anodizing / polishing"),
    color: makeField("Custom"),
    application: makeField(`${categoryName} export and OEM projects`),
    moq: makeField("100 pcs"),
    sample_lead_time: makeField("7-10 days"),
    lead_time: makeField("20-30 days"),
    packaging: makeField("Export carton with protective packing"),
    place_of_origin: makeField("China"),
    supply_ability: makeField("50,000 pcs per month"),
    certification: makeField("ISO 9001"),
  };
}

function buildCustomFields(title: string, categoryName: string): SeedCustomField[] {
  return [
    {
      labelZh: "Key Feature",
      labelEn: "Key Feature",
      valueZh: `${title} for ${categoryName} sourcing projects`,
      valueEn: `${title} for ${categoryName} sourcing projects`,
      visible: true,
      sortOrder: 10,
    },
    {
      labelZh: "Export Support",
      labelEn: "Export Support",
      valueZh: "OEM labeling, sample approval, and export packing support",
      valueEn: "OEM labeling, sample approval, and export packing support",
      visible: true,
      sortOrder: 20,
    },
  ];
}

export function createSeedRunCheckpoint(
  sites: Array<{ siteSlug: string; seedPackKey: SeedPackKey; totalProducts: number }>,
): SeedRunCheckpoint {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    sites: sites.map((site) => ({
      ...site,
      completedProductSlugs: [],
      status: "pending",
    })),
  };
}

export function markProductCompleted(
  checkpoint: SeedRunCheckpoint,
  siteSlug: string,
  productSlug: string,
): SeedRunCheckpoint {
  return {
    ...checkpoint,
    updatedAt: new Date().toISOString(),
    sites: checkpoint.sites.map((site) => {
      if (site.siteSlug !== siteSlug) {
        return site;
      }

      const completedProductSlugs = site.completedProductSlugs.includes(productSlug)
        ? site.completedProductSlugs
        : [...site.completedProductSlugs, productSlug];

      return {
        ...site,
        completedProductSlugs,
        status:
          completedProductSlugs.length >= site.totalProducts ? "completed" : "in_progress",
      };
    }),
  };
}

export function getOverallProgress(checkpoint: SeedRunCheckpoint) {
  const totalProducts = checkpoint.sites.reduce((sum, site) => sum + site.totalProducts, 0);
  const completedProducts = checkpoint.sites.reduce(
    (sum, site) => sum + site.completedProductSlugs.length,
    0,
  );
  const completedSites = checkpoint.sites.filter((site) => site.status === "completed").length;

  return {
    totalProducts,
    completedProducts,
    totalSites: checkpoint.sites.length,
    completedSites,
  };
}

export function buildCatalogProductsForPack(
  packKey: SeedPackKey,
  categories: SeedCategory[],
  companyName: string,
): SeedProduct[] {
  if (packKey === "cnc") {
    throw new Error("buildCatalogProductsForPack is only intended for non-cnc packs.");
  }

  const titles = PRODUCT_TITLES[packKey];
  if (!titles) {
    throw new Error(`Unsupported pack key: ${packKey}`);
  }

  return titles.map((title, index) => {
    const category = categories[index % categories.length];
    const categoryName = category?.nameEn ?? "Industrial";
    const slug = slugify(title);

    return {
      nameZh: title,
      nameEn: title,
      slug,
      categorySlug: category?.slug ?? "",
      shortDescriptionZh: `${title} built for ${categoryName.toLowerCase()} buyers and OEM projects.`,
      shortDescriptionEn: `${title} built for ${categoryName.toLowerCase()} buyers and OEM projects.`,
      detailsZh: `${title} is prepared for export projects in ${categoryName}. ${companyName} can support OEM development, sample approval, and stable production scheduling.`,
      detailsEn: `${title} is prepared for export projects in ${categoryName}. ${companyName} can support OEM development, sample approval, and stable production scheduling.`,
      seoTitle: `${title} Manufacturer | ${companyName}`,
      seoDescription: `Source ${title.toLowerCase()} with OEM support, stable quality control, and export packing from ${companyName}.`,
      sortOrder: index + 1,
      isFeatured: index < 3,
      defaultFields: buildDefaultFields(title, categoryName),
      customFields: buildCustomFields(title, categoryName),
    };
  });
}
