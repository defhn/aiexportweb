"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { sites } from "@/db/schema";
import { getSeedPackKeyForTemplate } from "@/lib/sites";
import { normalizeSitePlan } from "@/lib/plans";
import type { SiteStatus } from "@/lib/sites";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalString(formData: FormData, key: string) {
  const value = readString(formData, key);
  return value.length ? value : null;
}

export async function saveSiteAction(formData: FormData) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to save site settings.");
  }

  const id = Number.parseInt(readString(formData, "id"), 10);
  const templateId = readString(formData, "templateId") || "template-01";
  const seedPackKey = readString(formData, "seedPackKey") || getSeedPackKeyForTemplate(templateId);
  const status: SiteStatus = readString(formData, "status") === "draft" ? "draft" : "active";
  const plan = normalizeSitePlan(readString(formData, "plan"));
  const slug = readString(formData, "slug");
  const name = readString(formData, "name");
  const companyName = readString(formData, "companyName") || name;

  if (!slug || !name) {
    throw new Error("Site name and slug are required.");
  }

  const db = getDb();
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
    updatedAt: new Date(),
  };

  if (Number.isFinite(id) && id > 0) {
    await db.update(sites).set(values).where(eq(sites.id, id));
  } else {
    await db.insert(sites).values(values);
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/sites");
  redirect("/admin/sites?saved=1");
}
