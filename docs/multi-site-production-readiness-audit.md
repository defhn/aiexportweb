# Multi-site production readiness audit

Last reviewed: 2026-04-15

## Goal

One shared codebase should serve many client sites. Each site can bind one or more domains, show its own industry template/content/settings, isolate all customer data, and unlock modules through plan or add-on configuration without redeploying.

## Domain and routing status

- Done: `sites.domain` and `sites.subdomain` remain supported for backward compatibility.
- Done: `site_domains` now stores multiple host aliases per site.
- Done: host lookup checks `site_domains.host` before falling back to legacy `sites.domain` / `sites.subdomain`.
- Done: `/admin/sites` can edit one host per line in `Domain aliases`.
- Next operational step: run `drizzle/0007_site_domain_aliases.sql` in Neon.

Supported examples after migration:

- `example.com`
- `www.example.com`
- `preview.example.com`
- old domains kept as aliases while the primary domain changes

## Public route coverage

All public business routes now load current site context through `getCurrentSiteFromRequest()` directly or through the public layout.

- `/`
- `/about`
- `/contact`
- `/capabilities`
- `/products`
- `/products/[categorySlug]`
- `/products/[categorySlug]/[productSlug]`
- `/blog`
- `/blog/[slug]`
- `/request-quote`
- `/pricing`
- `/privacy-policy`
- `/terms`

Remaining watch item:

- If new public routes are added, require the same current-site pattern before launch.

## Backend write-path audit

High-priority write paths reviewed:

- Products: create/update/delete/bulk actions use current site context on primary product rows.
- Categories: save/delete paths use current site context.
- Blog posts/categories/tags: save/delete/bulk paths use current site context.
- Pages: page module save/delete uses current site context.
- Settings and knowledge: save paths use current site context.
- Media and files: folders, media assets, download files, and broken media cleanup use current site context. Download file update/delete now use site-guarded SQL conditions.
- Inquiries and quotes: public insert paths attach current site; admin reads and details use site filters.
- Reply templates: save/delete paths use current site context.
- Pipeline and attribution: both now query/update using current site context.
- Staff: client admin and employee operations are scoped to current site.
- Plans/usage: usage counters include site scope.

Watch items:

- Some child-table refreshes are scoped indirectly through a site-validated parent id, not through a direct `site_id` column. This is acceptable for the current schema, but if child tables later gain `site_id`, update those deletes/inserts to include it directly.
- Super admin fallback paths intentionally allow global reads when no site context exists. For production operations, super admins should select a current site before editing client content.

## Current readiness estimate

- Core multi-site architecture: complete.
- Customer domain routing: complete after `0007` migration is run.
- Main public site experience: complete for current routes.
- Admin tenant isolation: substantially complete, with the reviewed high-risk write paths covered.
- Commercial controls: complete for plans, add-ons, client roles, change logs, and commercial notes.

## Remaining practical launch checklist

- Run `drizzle/0007_site_domain_aliases.sql` in Neon.
- Add each customer domain and `www` alias in `/admin/sites`.
- Verify DNS points to the deployment.
- Test each bound host:
  - `/`
  - `/products`
  - `/contact`
  - `/request-quote`
  - `/privacy-policy`
  - `/terms`
- Log in as `client_admin` and confirm they only see their own site data.
- Log in as `employee` and confirm locked commercial/admin pages are blocked.
