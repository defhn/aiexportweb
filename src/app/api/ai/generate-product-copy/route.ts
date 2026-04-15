import { NextResponse } from "next/server";

import {
  buildLockedApiResponse,
  getFeatureGate,
  incrementFeatureUsage,
} from "@/features/plans/access";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { withAdminAuth } from "@/lib/admin-auth";
import { generateProductCopy } from "@/lib/ai";

export const POST = withAdminAuth(async (request) => {
  const currentSite = await getCurrentSiteFromRequest();
  const gate = await getFeatureGate("ai_product_copy", currentSite.plan, currentSite.id);

  if (gate.status === "locked") {
    return NextResponse.json(buildLockedApiResponse(gate), { status: 403 });
  }

  const body = (await request.json()) as {
    industry?: string;
    nameZh?: string;
    shortDescriptionZh?: string;
    defaultFields?: Record<string, string>;
  };

  const { result, provider } = await generateProductCopy({
    industry: body.industry?.trim() || "industrial manufacturing",
    nameZh: body.nameZh?.trim() || "Custom Product",
    shortDescriptionZh: body.shortDescriptionZh?.trim() || "",
    defaultFields: body.defaultFields ?? {},
  });

  if (gate.status === "trial") {
    await incrementFeatureUsage("ai_product_copy", currentSite.id);
  }

  return NextResponse.json({
    ...result,
    provider,
    remaining:
      gate.remaining !== null ? Math.max(gate.remaining - 1, 0) : gate.remaining,
  });
});
