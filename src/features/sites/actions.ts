"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { siteChangeLogs, siteDomains, sites } from "@/db/schema";
import { getAdminSessionFromCookies } from "@/lib/admin-auth";
import { getSeedPackKeyForTemplate, parseSiteDomainAliases } from "@/lib/sites";
import { allFeatureKeys, normalizeSitePlan } from "@/lib/plans";
import type { SiteDealStage, SiteStatus } from "@/lib/sites";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalString(formData: FormData, key: string) {
  const value = readString(formData, key);
  return value.length ? value : null;
}

function readOptionalDate(formData: FormData, key: string) {
  const value = readString(formData, key);
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function sortFeatures(features: string[]) {
  return [...features].sort((left, right) => left.localeCompare(right));
}

function buildDomainAliases(primaryDomain: string | null, rawAliases: string) {
  return parseSiteDomainAliases([primaryDomain ?? "", rawAliases].filter(Boolean).join("\n"));
}

async function listDomainAliases(siteId: number) {
  const db = getDb();
  const rows = await db
    .select({ host: siteDomains.host })
    .from(siteDomains)
    .where(eq(siteDomains.siteId, siteId));

  return rows.map((row) => row.host).sort((left, right) => left.localeCompare(right));
}

async function syncDomainAliases(siteId: number, aliases: string[]) {
  const db = getDb();
  await db.delete(siteDomains).where(eq(siteDomains.siteId, siteId));

  if (aliases.length > 0) {
    await db.insert(siteDomains).values(
      aliases.map((host, index) => ({
        siteId,
        host,
        kind: index === 0 ? "primary" : "alias",
        isPrimary: index === 0,
      })),
    );
  }
}

export async function saveSiteAction(formData: FormData) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to save site settings.");
  }

  const id = Number.parseInt(readString(formData, "id"), 10);
  const templateId = readString(formData, "templateId") || "template-01";
  const seedPackKey = readString(formData, "seedPackKey") || getSeedPackKeyForTemplate(templateId);
  const status: SiteStatus = readString(formData, "status") === "draft" ? "draft" : "active";
  const dealStage = (readString(formData, "dealStage") || "lead") as SiteDealStage;
  const plan = normalizeSitePlan(readString(formData, "plan"));
  const slug = readString(formData, "slug");
  const name = readString(formData, "name");
  const companyName = readString(formData, "companyName") || name;
  const session = await getAdminSessionFromCookies();
  const domainAliases = buildDomainAliases(readOptionalString(formData, "domain"), readString(formData, "domainAliases"));
  const enabledFeaturesJson = formData
    .getAll("enabledFeaturesJson")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter((value): value is (typeof allFeatureKeys)[number] => allFeatureKeys.includes(value as (typeof allFeatureKeys)[number]));

  if (!slug || !name) {
    throw new Error("Site name and slug are required.");
  }

  if (!session || session.role === "employee") {
    throw new Error("Only client admins can update site settings.");
  }

  const db = getDb();
  const existingSite =
    Number.isFinite(id) && id > 0
      ? await db.select().from(sites).where(eq(sites.id, id)).limit(1).then((rows) => rows[0] ?? null)
      : null;
  const previousDomainAliases = existingSite ? await listDomainAliases(existingSite.id) : [];
  const values = {
    name,
    slug,
    domain: readOptionalString(formData, "domain"),
    subdomain: readOptionalString(formData, "subdomain"),
    templateId,
    seedPackKey,
    plan,
    status,
    companyName,
    logoUrl: readOptionalString(formData, "logoUrl"),
    primaryColor: readOptionalString(formData, "primaryColor"),
    enabledFeaturesJson,
    salesOwner: readOptionalString(formData, "salesOwner"),
    renewalDate: readOptionalDate(formData, "renewalDate"),
    dealStage,
    contractNotes: readOptionalString(formData, "contractNotes"),
    updatedAt: new Date(),
  };

  if (Number.isFinite(id) && id > 0) {
    if (session.role !== "super_admin" && session.siteId !== id) {
      throw new Error("You can only update the site assigned to your account.");
    }
    await db.update(sites).set(values).where(eq(sites.id, id));
    await syncDomainAliases(id, domainAliases);

    if (existingSite) {
      const changeRows: Array<{
        siteId: number;
        actorAdminUserId: number | null;
        actorRole: string;
        actionType: string;
        summary: string;
        previousValueJson: Record<string, unknown>;
        nextValueJson: Record<string, unknown>;
      }> = [];

      if (existingSite.plan !== plan) {
        changeRows.push({
          siteId: existingSite.id,
          actorAdminUserId: session.adminUserId === 0 ? null : session.adminUserId,
          actorRole: session.role,
          actionType: "plan_changed",
          summary: `Plan changed from ${existingSite.plan} to ${plan}.`,
          previousValueJson: { plan: existingSite.plan },
          nextValueJson: { plan },
        });
      }

      const previousFeatures = sortFeatures((existingSite.enabledFeaturesJson ?? []) as string[]);
      const nextFeatures = sortFeatures(enabledFeaturesJson as string[]);
      if (JSON.stringify(previousFeatures) !== JSON.stringify(nextFeatures)) {
        changeRows.push({
          siteId: existingSite.id,
          actorAdminUserId: session.adminUserId === 0 ? null : session.adminUserId,
          actorRole: session.role,
          actionType: "feature_overrides_updated",
          summary: `Feature overrides updated (${nextFeatures.length} active).`,
          previousValueJson: { enabledFeaturesJson: previousFeatures },
          nextValueJson: { enabledFeaturesJson: nextFeatures },
        });
      }

      if (JSON.stringify(previousDomainAliases) !== JSON.stringify(domainAliases)) {
        changeRows.push({
          siteId: existingSite.id,
          actorAdminUserId: session.adminUserId === 0 ? null : session.adminUserId,
          actorRole: session.role,
          actionType: "domain_aliases_updated",
          summary: `Domain aliases updated (${domainAliases.length} active).`,
          previousValueJson: { domainAliases: previousDomainAliases },
          nextValueJson: { domainAliases },
        });
      }

      const profileChanged =
        existingSite.name !== name ||
        existingSite.slug !== slug ||
        existingSite.templateId !== templateId ||
        existingSite.seedPackKey !== seedPackKey ||
        existingSite.domain !== values.domain ||
        existingSite.subdomain !== values.subdomain ||
        existingSite.status !== status ||
        existingSite.salesOwner !== values.salesOwner ||
        (existingSite.renewalDate?.toISOString() ?? null) !== (values.renewalDate?.toISOString() ?? null) ||
        existingSite.dealStage !== values.dealStage ||
        existingSite.contractNotes !== values.contractNotes;

      if (profileChanged) {
        changeRows.push({
          siteId: existingSite.id,
          actorAdminUserId: session.adminUserId === 0 ? null : session.adminUserId,
          actorRole: session.role,
          actionType: "site_profile_updated",
          summary: "Site profile settings were updated.",
          previousValueJson: {
            name: existingSite.name,
            slug: existingSite.slug,
            templateId: existingSite.templateId,
            seedPackKey: existingSite.seedPackKey,
            domain: existingSite.domain,
            subdomain: existingSite.subdomain,
            status: existingSite.status,
            salesOwner: existingSite.salesOwner,
            renewalDate: existingSite.renewalDate,
            dealStage: existingSite.dealStage,
            contractNotes: existingSite.contractNotes,
          },
          nextValueJson: {
            name,
            slug,
            templateId,
            seedPackKey,
            domain: values.domain,
            subdomain: values.subdomain,
            status,
            salesOwner: values.salesOwner,
            renewalDate: values.renewalDate,
            dealStage: values.dealStage,
            contractNotes: values.contractNotes,
          },
        });
      }

      if (changeRows.length > 0) {
        await db.insert(siteChangeLogs).values(changeRows);
      }
    }
  } else {
    if (session.role !== "super_admin") {
      throw new Error("Only super admins can create a new client site.");
    }
    const [createdSite] = await db.insert(sites).values(values).returning({ id: sites.id });
    if (createdSite?.id) {
      await syncDomainAliases(createdSite.id, domainAliases);
      await db.insert(siteChangeLogs).values({
        siteId: createdSite.id,
        actorAdminUserId: session.adminUserId === 0 ? null : session.adminUserId,
        actorRole: session.role,
        actionType: "site_created",
        summary: `Site ${name} was created with the ${plan} plan.`,
        previousValueJson: {},
        nextValueJson: {
          name,
          slug,
          plan,
          templateId,
          seedPackKey,
          salesOwner: values.salesOwner,
          renewalDate: values.renewalDate,
          dealStage: values.dealStage,
        },
      });
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/sites");
  revalidatePath("/admin");
  revalidatePath("/pricing");
  revalidatePath("/admin/sites");
  redirect("/admin/sites?saved=1");
}
