import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  resetAdminUserPassword,
} from "@/features/admin-users/service";

async function requireClientAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session || session.role === "employee") return null;
  return session;
}

// GET /api/admin/staff
export async function GET() {
  const session = await requireClientAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const users = await getAdminUsers();
  return NextResponse.json(users);
}

// POST /api/admin/staff
export async function POST(request: Request) {
  const session = await requireClientAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = (await request.json()) as { username?: string; password?: string };
  const username = body.username?.trim();
  const password = body.password;

  if (!username || !password || password.length < 6) {
    return NextResponse.json({ error: "用户名不能为空，密码长度不能少于6位" }, { status: 400 });
  }

  try {
    const user = await createAdminUser({ username, password });
    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "用户名已存在" }, { status: 409 });
  }
}

// DELETE /api/admin/staff?id=xxx
export async function DELETE(request: Request) {
  const session = await requireClientAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "缺少 id 参数" }, { status: 400 });

  await deleteAdminUser(id);
  return NextResponse.json({ success: true });
}

// PATCH /api/admin/staff - reset password
export async function PATCH(request: Request) {
  const session = await requireClientAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = (await request.json()) as { id?: number; newPassword?: string };
  if (!body.id || !body.newPassword || body.newPassword.length < 6) {
    return NextResponse.json({ error: "新密码长度不能少于6位" }, { status: 400 });
  }

  await resetAdminUserPassword(body.id, body.newPassword);
  return NextResponse.json({ success: true });
}
