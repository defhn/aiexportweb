import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { resetAdminUserPassword } from "@/features/admin-users/service";

async function requireClientAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session || session.role === "employee") return null;
  return session;
}

// POST /api/admin/staff/[id]/reset-password
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireClientAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const numId = Number(id);
  if (!numId) return NextResponse.json({ error: "无效的 ID" }, { status: 400 });

  const body = (await request.json()) as { password?: string };
  if (!body.password || body.password.length < 6) {
    return NextResponse.json({ error: "新密码长度不能少于6位" }, { status: 400 });
  }

  await resetAdminUserPassword(numId, body.password);
  return NextResponse.json({ success: true });
}
