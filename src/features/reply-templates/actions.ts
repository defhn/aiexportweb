import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { replyTemplates } from "@/db/schema";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalNumber(formData: FormData, key: string) {
  const value = readText(formData, key);

  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildReplyTemplateDraft(input: {
  id?: number | null;
  title: string;
  category?: string | null;
  contentZh?: string | null;
  contentEn: string;
  applicableScene?: string | null;
}) {
  return {
    id: input.id ?? null,
    title: input.title.trim(),
    category: input.category?.trim() || null,
    contentZh: input.contentZh?.trim() || null,
    contentEn: input.contentEn.trim(),
    applicableScene: input.applicableScene?.trim() || null,
  };
}

export async function saveReplyTemplate(formData: FormData) {
  "use server";

  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const db = getDb();
  const draft = buildReplyTemplateDraft({
    id: readOptionalNumber(formData, "id"),
    title: readText(formData, "title"),
    category: readText(formData, "category"),
    contentZh: readText(formData, "contentZh"),
    contentEn: readText(formData, "contentEn"),
    applicableScene: readText(formData, "applicableScene"),
  });

  if (draft.id) {
    await db
      .update(replyTemplates)
      .set({
        title: draft.title,
        category: draft.category,
        contentZh: draft.contentZh,
        contentEn: draft.contentEn,
        applicableScene: draft.applicableScene,
        updatedAt: new Date(),
      })
      .where(
        siteId
          ? and(eq(replyTemplates.id, draft.id), eq(replyTemplates.siteId, siteId))
          : eq(replyTemplates.id, draft.id),
      );
  } else {
    await db.insert(replyTemplates).values({
      siteId,
      title: draft.title,
      category: draft.category,
      contentZh: draft.contentZh,
      contentEn: draft.contentEn,
      applicableScene: draft.applicableScene,
    });
  }

  revalidatePath("/admin/reply-templates");
  redirect("/admin/reply-templates?saved=1");
}

export async function deleteReplyTemplate(formData: FormData) {
  "use server";

  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const id = readOptionalNumber(formData, "id");

  if (!id) {
    redirect("/admin/reply-templates");
  }

  const db = getDb();
  await db
    .delete(replyTemplates)
    .where(
      siteId
        ? and(eq(replyTemplates.id, id), eq(replyTemplates.siteId, siteId))
        : eq(replyTemplates.id, id),
    );
  revalidatePath("/admin/reply-templates");
  redirect("/admin/reply-templates?deleted=1");
}
