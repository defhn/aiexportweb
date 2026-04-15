import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { resetAdminUserPassword } from "@/features/admin-users/service";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";

async function requireClientAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session || session.role === "employee") return null;
  return session;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireClientAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const numId = Number(id);
  if (!numId) return NextResponse.json({ error: "Invalid user id." }, { status: 400 });

  const body = (await request.json()) as { password?: string };
  if (!body.password || body.password.length < 6) {
    return NextResponse.json(
      { error: "New password must be at least 6 characters." },
      { status: 400 },
    );
  }

  const currentSite = await getCurrentSiteFromRequest();
  await resetAdminUserPassword(
    numId,
    body.password,
    session.role === "super_admin" ? currentSite.id ?? undefined : session.siteId,
  );
  return NextResponse.json({ success: true });
}
