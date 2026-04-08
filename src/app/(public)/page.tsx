import { HeroSection } from "@/components/public/hero-section";
import { getSeedPack } from "@/db/seed";
import { getPageModules } from "@/features/pages/queries";

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

function readStringArray(payload: Record<string, unknown>, key: string) {
  const value = payload[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

export default async function HomePage() {
  const [modules, seedPack] = await Promise.all([
    getPageModules("home"),
    Promise.resolve(getSeedPack("cnc")),
  ]);

  const heroModule = modules.find((module) => module.moduleKey === "hero");
  const strengthsModule = modules.find((module) => module.moduleKey === "strengths");
  const featuredCategoryModule = modules.find(
    (module) => module.moduleKey === "featured-categories",
  );
  const featuredProductModule = modules.find(
    (module) => module.moduleKey === "featured-products",
  );

  const featuredCategorySlugs = readStringArray(
    featuredCategoryModule?.payloadJson ?? {},
    "slugs",
  );
  const featuredProductSlugs = readStringArray(
    featuredProductModule?.payloadJson ?? {},
    "slugs",
  );
  const strengths = readStringArray(strengthsModule?.payloadJson ?? {}, "items");
  const featuredCategories = seedPack.categories.filter((category) =>
    featuredCategorySlugs.includes(category.slug),
  );
  const featuredProducts = seedPack.products.filter((product) =>
    featuredProductSlugs.includes(product.slug),
  );

  return (
    <div className="space-y-12 pb-16">
      <HeroSection
        description={readString(heroModule?.payloadJson ?? {}, "description")}
        eyebrow={readString(heroModule?.payloadJson ?? {}, "eyebrow")}
        primaryCtaHref={readString(heroModule?.payloadJson ?? {}, "primaryCtaHref")}
        primaryCtaLabel={readString(
          heroModule?.payloadJson ?? {},
          "primaryCtaLabel",
        )}
        secondaryCtaHref={readString(
          heroModule?.payloadJson ?? {},
          "secondaryCtaHref",
        )}
        secondaryCtaLabel={readString(
          heroModule?.payloadJson ?? {},
          "secondaryCtaLabel",
        )}
        title={readString(heroModule?.payloadJson ?? {}, "title")}
      />

      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            Core Strengths
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {strengths.map((item) => (
              <article
                key={item}
                className="rounded-2xl bg-stone-50 p-5 text-sm leading-6 text-stone-700"
              >
                {item}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
              Featured Categories
            </p>
            <div className="mt-6 space-y-4">
              {featuredCategories.map((category) => (
                <article
                  key={category.slug}
                  className="rounded-2xl border border-stone-200 p-5"
                >
                  <h2 className="text-xl font-semibold text-stone-950">
                    {category.nameEn}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {category.summaryEn}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
              Featured Products
            </p>
            <div className="mt-6 space-y-4">
              {featuredProducts.map((product) => (
                <article
                  key={product.slug}
                  className="rounded-2xl border border-stone-200 p-5"
                >
                  <h2 className="text-xl font-semibold text-stone-950">
                    {product.nameEn}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {product.shortDescriptionEn}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
