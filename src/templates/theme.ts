export type TemplateTheme = {
  accent: string;
  accentSoft: string;
  accentHover: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  heroTag: string;
  catalogTitle: string;
  catalogDescription: string;
  categoryTitle: string;
  categoryDescription: string;
  detailSupportTitle: string;
  detailSupportDescription: string;
  header: {
    navItems: Array<{ label: string; href: string }>;
    quoteLabel: string;
  };
  productDetail: {
    datasheetTitle: string;
    datasheetDescription: string;
    relatedTitle: string;
    breadcrumbCatalogLabel: string;
    compareLabel: string;
  };
  blog: {
    eyebrow: string;
    title: string;
    description: string;
    supportEyebrow: string;
    supportTitle: string;
    supportDescription: string;
    defaultCategoryLabel: string;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    heritageEyebrow: string;
    heritageTitle: string;
    heroImage: string;
    featureImage: string;
    featureCard: string;
  };
  capabilities: {
    eyebrow: string;
    title: string;
    description: string;
    highlights: Array<{
      title: string;
      description: string;
      bullets: string[];
      image: string;
      imageAlt: string;
    }>;
    specGroups: Array<{
      title: string;
      rows: Array<{ label: string; value: string }>;
    }>;
  };
  forms: {
    inquiryEyebrow: string;
    inquiryTitle: string;
    consultationTitle: string;
    successTitle: string;
    successMessage: string;
    securityNote: string;
    uploadHint: string;
    trustBadgeTitle: string;
    trustBadgeDescription: string;
  };
  footer: {
    trustItems: Array<{ title: string; description: string }>;
    description: string;
    solutionsTitle: string;
    officeTitle: string;
    addressTitle: string;
    rfqHint: string;
  };
};

const DEFAULT_THEME: TemplateTheme = {
  accent: "#2563eb",
  accentSoft: "rgba(37, 99, 235, 0.12)",
  accentHover: "#1d4ed8",
  surface: "#0f172a",
  surfaceAlt: "#ffffff",
  border: "#e2e8f0",
  heroTag: "Product Catalog",
  catalogTitle: "Explore Our Product Range",
  catalogDescription: "Browse the current catalog and drill into individual product families.",
  categoryTitle: "Category Collection",
  categoryDescription: "Discover the products grouped under this category.",
  detailSupportTitle: "Need a Custom Quote?",
  detailSupportDescription: "Share your requirements and we will review feasibility and pricing.",
  header: {
    navItems: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Solutions", href: "/capabilities" },
      { label: "Pricing", href: "/pricing" },
      { label: "Guides", href: "/blog" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    quoteLabel: "Request Quote",
  },
  productDetail: {
    datasheetTitle: "Product Information",
    datasheetDescription: "Download the available product details for review.",
    relatedTitle: "Compare Similar",
    breadcrumbCatalogLabel: "Catalog",
    compareLabel: "Related product",
  },
  blog: {
    eyebrow: "Knowledge Hub",
    title: "Sourcing Insights & Guides",
    description: "Practical articles and buying references for international sourcing teams.",
    supportEyebrow: "Buyer Support",
    supportTitle: "Need help reviewing your next sourcing request?",
    supportDescription:
      "Share your target product, quantity, destination market, and timing. We will suggest practical next steps.",
    defaultCategoryLabel: "Sourcing",
  },
  about: {
    eyebrow: "About Our Company",
    title: "Built for global buyers who need dependable supply",
    description:
      "We combine product knowledge, quality control, and export-ready service for international customers.",
    heritageEyebrow: "Our Background",
    heritageTitle: "From a focused supplier to a global sourcing partner.",
    heroImage: "/images/factory_panorama_hero_1775635573170.png",
    featureImage: "/images/export_packaging_shipping_1775635539838.png",
    featureCard: "Quality checks built into every stage.",
  },
  capabilities: {
    eyebrow: "Core Capabilities",
    title: "Supply Capabilities Built Around Your Market",
    description:
      "From sampling to bulk orders, we coordinate product selection, quality control, packaging, and delivery.",
    highlights: [
      {
        title: "Product Development Support",
        description:
          "We help translate buyer requirements into practical product options, sample plans, and production-ready details.",
        bullets: ["Sample planning", "Material and finish options", "Market-ready packaging"],
        image: "/images/factory_panorama_hero_1775635573170.png",
        imageAlt: "Product development support",
      },
      {
        title: "Quality and Delivery Control",
        description:
          "We keep orders on track with inspection checkpoints, packing reviews, and export coordination.",
        bullets: ["Pre-shipment inspection", "Packing confirmation", "Export documentation support"],
        image: "/images/export_packaging_shipping_1775635539838.png",
        imageAlt: "Quality and delivery control",
      },
    ],
    specGroups: [
      {
        title: "Order Support",
        rows: [
          { label: "Sampling", value: "Product samples and buyer approval flow" },
          { label: "Customization", value: "Color, packaging, labeling, and product options" },
          { label: "MOQ", value: "Flexible discussion by product family" },
          { label: "Lead Time", value: "Confirmed by order scope and season" },
        ],
      },
      {
        title: "Export Services",
        rows: [
          { label: "Documentation", value: "Commercial invoice, packing list, and shipping files" },
          { label: "Inspection", value: "In-process and pre-shipment checks" },
          { label: "Packing", value: "Retail, bulk, or project packaging" },
          { label: "Logistics", value: "FOB, CIF, DDP discussion available" },
        ],
      },
    ],
  },
  forms: {
    inquiryEyebrow: "Request Consultation",
    inquiryTitle: "Start Project Review",
    consultationTitle: "Tell us what you need",
    successTitle: "Request Received",
    successMessage: "Thank you. Our team will review your request and contact you within 24 hours.",
    securityNote: "Your information is handled securely and used only for your inquiry.",
    uploadHint: "Attach files, references, or requirement notes when available.",
    trustBadgeTitle: "Confidential Handling",
    trustBadgeDescription:
      "Your files, requirements, and business information are kept confidential and used only for your inquiry.",
  },
  footer: {
    trustItems: [
      { title: "Quality Controlled", description: "Inspection checkpoints for every order" },
      { title: "Confidential Handling", description: "Buyer files and project details stay protected" },
      { title: "Export Ready", description: "Packing and documentation support" },
    ],
    description:
      "Supporting overseas sourcing teams with reliable communication, transparent lead times, and project-ready supply support.",
    solutionsTitle: "Solutions",
    officeTitle: "Contact Office",
    addressTitle: "Office & Supply Base",
    rfqHint: "Send your target product, quantity, destination, and timeline for a practical review.",
  },
};

const THEME_MAP: Record<string, TemplateTheme> = {
  "template-01": {
    ...DEFAULT_THEME,
    heroTag: "CNC Product Catalog",
    catalogTitle: "Explore Our Manufacturing Capabilities",
    catalogDescription: "Browse precision parts and drill into the product families that match your project.",
    categoryTitle: "Precision Component Collection",
    categoryDescription: "Discover our comprehensive range of high-precision components and manufacturing solutions.",
    detailSupportTitle: "Need a Custom Quote?",
    detailSupportDescription: "Send drawings or target tolerances and we will prepare a manufacturing feasibility review.",
  },
  "template-02": {
    ...DEFAULT_THEME,
    accent: "#f97316",
    accentSoft: "rgba(249, 115, 22, 0.12)",
    accentHover: "#c2410c",
    surface: "#0f1117",
    heroTag: "Equipment Catalog",
    catalogTitle: "Explore Industrial Equipment",
    catalogDescription: "Browse systems and components tailored for automation and production lines.",
    categoryTitle: "Equipment Collection",
    categoryDescription: "Explore solutions grouped by application and production use case.",
    detailSupportTitle: "Need a Custom Solution?",
    detailSupportDescription: "Share your process requirements and we will prepare a tailored equipment proposal.",
  },
  "template-03": {
    ...DEFAULT_THEME,
    accent: "#b8936a",
    accentSoft: "rgba(184, 147, 106, 0.12)",
    accentHover: "#8c6d4b",
    surface: "#1c1917",
    heroTag: "Product Catalog",
    catalogTitle: "Browse Architectural Materials",
    catalogDescription: "Explore project-ready building materials and decorative metal products.",
    categoryTitle: "Material Collection",
    categoryDescription: "Discover product ranges designed for construction and project supply.",
    detailSupportTitle: "Need a Custom Quote?",
    detailSupportDescription: "Send drawings or BOQ details and we will prepare a project quotation.",
  },
  "template-04": {
    ...DEFAULT_THEME,
    accent: "#22d3ee",
    accentSoft: "rgba(34, 211, 238, 0.12)",
    accentHover: "#0891b2",
    surface: "#070f1b",
    heroTag: "Power Catalog",
    catalogTitle: "Browse Power Systems",
    catalogDescription: "Explore switchgear, storage, and electrical solutions for industrial projects.",
    categoryTitle: "Power Solution Collection",
    categoryDescription: "Discover energy and electrical products grouped by application.",
    detailSupportTitle: "Need a Custom Proposal?",
    detailSupportDescription: "Share voltage, capacity, and site requirements for a tailored power solution.",
  },
  "template-05": {
    ...DEFAULT_THEME,
    accent: "#0ea5e9",
    accentSoft: "rgba(14, 165, 233, 0.12)",
    accentHover: "#0369a1",
    surface: "#07111d",
    heroTag: "Medical Product Catalog",
    catalogTitle: "Browse Medical Products",
    catalogDescription: "Explore healthcare consumables, devices, and rehabilitation products.",
    categoryTitle: "Medical Collection",
    categoryDescription: "Discover products tailored for hospitals, clinics, and healthcare supply.",
    detailSupportTitle: "Need a Medical Quote?",
    detailSupportDescription: "Send specifications, compliance requirements, and destination market details for a healthcare proposal.",
    header: {
      navItems: [
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: "Compliance", href: "/capabilities" },
        { label: "Knowledge", href: "/blog" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
      quoteLabel: "Medical RFQ",
    },
    productDetail: {
      datasheetTitle: "Product & Compliance File",
      datasheetDescription: "Download product specifications and quality-related documentation.",
      relatedTitle: "Related Medical Products",
      breadcrumbCatalogLabel: "Medical Catalog",
      compareLabel: "Alternative",
    },
    blog: {
      eyebrow: "Medical Knowledge Hub",
      title: "Procurement Insights for Healthcare Buyers",
      description: "Practical guidance for distributors, clinics, and sourcing teams managing medical product imports.",
      supportEyebrow: "Procurement Support",
      supportTitle: "Need help evaluating a medical sourcing request?",
      supportDescription:
        "Share your product scope, compliance requirements, and timeline. Our team will suggest a practical sourcing path.",
      defaultCategoryLabel: "Medical Sourcing",
    },
    about: {
      eyebrow: "About Our Medical Supply Team",
      title: "Reliable medical product supply built for quality and compliance",
      description:
        "We support healthcare buyers with stable production, documented quality workflows, and export-ready delivery coordination.",
      heritageEyebrow: "Our Background",
      heritageTitle: "From focused product lines to trusted healthcare supply programs.",
      heroImage: "/images/factory_panorama_hero_1775635573170.png",
      featureImage: "/images/export_packaging_shipping_1775635539838.png",
      featureCard: "Quality checks and documentation embedded in each delivery cycle.",
    },
    capabilities: {
      eyebrow: "Core Capabilities",
      title: "Medical Supply Capabilities for Regulated Markets",
      description:
        "From sample validation to production and export documentation, we support healthcare procurement with transparent execution.",
      highlights: [
        {
          title: "Medical Product Program Support",
          description:
            "We align product scope, packing requirements, and buyer standards before mass production starts.",
          bullets: ["Sample and spec alignment", "Private label packaging options", "Production planning by order type"],
          image: "/images/factory_panorama_hero_1775635573170.png",
          imageAlt: "Medical product program support",
        },
        {
          title: "Quality Workflow and Delivery Coordination",
          description:
            "Inspection checkpoints, packaging review, and export coordination help reduce project risk.",
          bullets: ["Batch-level checks", "Label and packing verification", "Export shipment coordination"],
          image: "/images/export_packaging_shipping_1775635539838.png",
          imageAlt: "Medical quality and delivery coordination",
        },
      ],
      specGroups: [
        {
          title: "Order & Quality Support",
          rows: [
            { label: "Sampling", value: "Validation workflow before production" },
            { label: "Customization", value: "Label, packaging, and bundle options" },
            { label: "Inspection", value: "Batch checkpoints and visual review" },
            { label: "Lead Time", value: "Confirmed by product scope and season" },
          ],
        },
        {
          title: "Export Coordination",
          rows: [
            { label: "Documentation", value: "Invoice, packing list, and shipping files" },
            { label: "Packaging", value: "Retail and distributor-ready configurations" },
            { label: "Shipping", value: "FOB, CIF, and project-based planning" },
            { label: "Support", value: "Responsive sourcing communication" },
          ],
        },
      ],
    },
    forms: {
      inquiryEyebrow: "Medical Inquiry",
      inquiryTitle: "Submit Your Medical Product Request",
      consultationTitle: "Tell us your product and compliance requirements",
      successTitle: "Request Submitted",
      successMessage: "Thank you. Our medical supply team will review your request and respond within 24 hours.",
      securityNote: "Your information is handled securely and used only for this sourcing request.",
      uploadHint: "Attach specifications, packaging notes, or compliance references where available.",
      trustBadgeTitle: "Confidential Handling",
      trustBadgeDescription:
        "Your product files, requirements, and business information are protected and only used for your inquiry.",
    },
    footer: {
      trustItems: [
        { title: "Quality Workflow", description: "Structured checks from sampling to shipment" },
        { title: "Confidential Handling", description: "Buyer requirements and files remain protected" },
        { title: "Export Ready", description: "Packaging and shipping support for global markets" },
      ],
      description:
        "Supporting healthcare buyers with reliable communication, quality-focused execution, and export-ready delivery support.",
      solutionsTitle: "Medical Solutions",
      officeTitle: "Medical Supply Desk",
      addressTitle: "Office & Supply Base",
      rfqHint: "Share product scope, quantity, destination market, and timeline for a practical review.",
    },
  },
  "template-06": {
    ...DEFAULT_THEME,
    accent: "#14b8a6",
    accentSoft: "rgba(20, 184, 166, 0.12)",
    accentHover: "#0f766e",
    surface: "#06131a",
    heroTag: "Engineering Catalog",
    catalogTitle: "Browse Fluid and HVAC Solutions",
    catalogDescription: "Explore piping, valves, and HVAC products for industrial systems.",
    categoryTitle: "System Collection",
    categoryDescription: "Discover engineering products grouped by system type and application.",
    detailSupportTitle: "Need a System Quote?",
    detailSupportDescription: "Share pressure, flow, and application data for a tailored engineering proposal.",
  },
  "template-07": {
    ...DEFAULT_THEME,
    accent: "#f59e0b",
    accentSoft: "rgba(245, 158, 11, 0.12)",
    accentHover: "#d97706",
    surface: "#111014",
    heroTag: "Lighting Catalog",
    catalogTitle: "Browse Lighting Products",
    catalogDescription: "Explore commercial and industrial lighting solutions for projects and distributors.",
    categoryTitle: "Lighting Collection",
    categoryDescription: "Discover product families designed for indoor and outdoor lighting applications.",
    detailSupportTitle: "Need a Lighting Quote?",
    detailSupportDescription: "Share lumen, voltage, and installation requirements for a project proposal.",
  },
  "template-08": {
    ...DEFAULT_THEME,
    accent: "#6366f1",
    accentSoft: "rgba(99, 102, 241, 0.12)",
    accentHover: "#4f46e5",
    surface: "#0f1218",
    heroTag: "Component Catalog",
    catalogTitle: "Browse Hardware and Plastic Parts",
    catalogDescription: "Explore OEM component families for precision manufacturing projects.",
    categoryTitle: "Component Collection",
    categoryDescription: "Discover hardware and plastic product groups by use case and process.",
    detailSupportTitle: "Need a Component Quote?",
    detailSupportDescription: "Send tolerances, materials, and forecast volume for a tailored quote.",
  },
  "template-09": {
    ...DEFAULT_THEME,
    accent: "#9b7b57",
    accentSoft: "rgba(155, 123, 87, 0.12)",
    accentHover: "#7c5a3a",
    surface: "#fffaf2",
    heroTag: "Furniture Catalog",
    catalogTitle: "Browse Furniture Collections",
    catalogDescription: "Explore indoor and outdoor furniture for retail and project buyers.",
    categoryTitle: "Furniture Collection",
    categoryDescription: "Discover furniture lines for living, hospitality, and outdoor spaces.",
    detailSupportTitle: "Need a Furniture Quote?",
    detailSupportDescription: "Share style, material, and quantity requirements for a sourcing proposal.",
  },
  "template-10": {
    ...DEFAULT_THEME,
    accent: "#7c3aed",
    accentSoft: "rgba(124, 58, 237, 0.12)",
    accentHover: "#6d28d9",
    surface: "#f5f6ff",
    heroTag: "Packaging Catalog",
    catalogTitle: "Browse Textile and Packaging Products",
    catalogDescription: "Explore materials and packaging solutions for brands and distributors.",
    categoryTitle: "Packaging Collection",
    categoryDescription: "Discover textile and packaging product lines by material and use case.",
    detailSupportTitle: "Need a Packaging Quote?",
    detailSupportDescription: "Share your branding and MOQ requirements for a tailored sourcing plan.",
  },
  "template-11": {
    ...DEFAULT_THEME,
    accent: "#22d3ee",
    accentSoft: "rgba(34, 211, 238, 0.12)",
    accentHover: "#06b6d4",
    surface: "#070b14",
    heroTag: "Electronics Catalog",
    catalogTitle: "Browse Consumer Electronics",
    catalogDescription: "Explore smart devices and accessories for retail and DTC brands.",
    categoryTitle: "Electronics Collection",
    categoryDescription: "Discover consumer electronics grouped by product type and launch use case.",
    detailSupportTitle: "Need an OEM Quote?",
    detailSupportDescription: "Share your product brief and packaging needs for a launch-ready proposal.",
  },
  "template-12": {
    ...DEFAULT_THEME,
    accent: "#d97706",
    accentSoft: "rgba(217, 119, 6, 0.12)",
    accentHover: "#b45309",
    surface: "#fffaf4",
    heroTag: "Gift Catalog",
    catalogTitle: "Browse Lifestyle Gifts",
    catalogDescription: "Explore gift sets, stationery, and lifestyle products for brands and events.",
    categoryTitle: "Gift Collection",
    categoryDescription: "Discover lifestyle products curated for gifting and brand merchandising.",
    detailSupportTitle: "Need a Gift Quote?",
    detailSupportDescription: "Tell us your concept and budget and we will build a sourcing plan.",
  },
};

export function getTemplateTheme(templateId: string): TemplateTheme {
  return THEME_MAP[templateId] ?? DEFAULT_THEME;
}
