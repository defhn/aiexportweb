import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { deleteAdminUser } from "@/features/admin-users/service";

async function requireClientAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session || session.role === "employee") return null;
  return session;
}

// DELETE /api/admin/staff/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireClientAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const numId = Number(id);
  if (!numId) return NextResponse.json({ error: "无效的 ID" }, { status: 400 });

  await deleteAdminUser(numId);
  return NextResponse.json({ success: true });
}
