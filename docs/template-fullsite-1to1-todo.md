# 12-Industry Fullsite 1:1 Template Todo

Goal: keep one shared technical framework and one shared feature set, while making every public page look, read, and behave like the active industry template.

## Acceptance Standard

- Every `SITE_TEMPLATE=template-XX` deployment uses the same public routes, admin routes, inquiry flow, product flow, blog flow, and RAG/admin functionality.
- Every customer-facing public page reads industry-specific terms, CTA copy, trust claims, page headings, and visual defaults from the active template.
- No non-active industry content appears on public pages. A medical template cannot show CNC machining copy; a gift template cannot show industrial factory copy.
- Shared components may be reused, but their visible copy, color accents, icons, and default images must come from the active template or from neutral fallback copy.

## Implementation Todo

- [x] Restore compile health before deeper template work.
  - [x] Fix malformed JSX in `src/components/public/site-header.tsx`.
  - [x] Fix malformed JSX and broken strings in `src/templates/template-09/home-page.tsx`.
  - [x] Export `getTemplateTheme` from `src/templates/index.ts` because public pages import it from `@/templates`.

- [x] Expand the template theme contract.
  - [x] Add fullsite copy fields for product pages, product detail pages, blog pages, about pages, capabilities pages, contact pages, quote pages, forms, footer, and trust badges.
  - [x] Add default visual fields for public pages so non-CNC templates do not fall back to CNC machine imagery.
  - [x] Add tests confirming all 12 templates have complete fullsite theme data.

- [x] Template the product journey end to end.
  - [x] `/products`
  - [x] `/products/[categorySlug]`
  - [x] `/products/[categorySlug]/[productSlug]`
  - [x] Product cards, spec blocks, inquiry CTAs, PDF/download labels, empty states, breadcrumbs, and related product copy.

- [x] Template the content and company pages.
  - [x] `/blog`
  - [x] `/blog/[slug]`
  - [x] `/about`
  - [x] `/capabilities`
  - [x] Replace CNC/manufacturing hard-coding with active-template copy and imagery.

- [x] Template conversion pages and forms.
  - [x] `/contact`
  - [x] `/request-quote`
  - [x] `InquiryForm`
  - [x] `RequestQuoteForm`
  - [x] Success messages, field helper text, security notes, and upload instructions should match the active industry.

- [x] Theme shared public components.
  - [x] `SiteHeader`
  - [x] `SiteFooter`
  - [x] `CategoryGrid`
  - [x] `ProductCard`
  - [x] `LatestInsights`
  - [x] `ProductFaq`
  - [x] `SpecTable`
  - [x] `TrustCompliance`
  - [x] Remove fixed CNC images and engineering-only language unless the active template is CNC/industrial.

- [x] Verify 12-template parity.
  - [x] Run unit tests.
  - [x] Run production build / application TypeScript compile.
  - [x] For each template, smoke-check homepage, products, category, product detail, capabilities, blog, about, contact, and request-quote through `TEMPLATE_ID=template-XX npm run build`.
  - [x] Update this todo with any remaining template-specific gaps.
