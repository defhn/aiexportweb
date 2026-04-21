import { type NextRequest, NextResponse } from "next/server";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { setAiEngineConfig } from "@/features/ai-engine/queries";

export async function POST(request: NextRequest) {
  try {
    const currentSite = await getCurrentSiteFromRequest();
    const siteId = currentSite.id ?? null;

    const body = await request.json();
    const { configKey, configValue, description } = body;

    if (!configKey || typeof configValue !== "string") {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    await setAiEngineConfig(siteId, configKey, configValue, description);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[AiEngineConfig API] Save failed:", error);
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}
