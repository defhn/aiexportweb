import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { verifySessionToken } from "@/lib/auth";
import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  // 1. 验证 session
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "会话已过期，请重新登录" }, { status: 401 });
  }

  // userId=0 表示环境变量账号，无法通过 UI 修改
  if (session.adminUserId === 0) {
    return NextResponse.json(
      { error: "此账号通过环境变量配置，请在 Vercel 后台修改 ADMIN_PASSWORD 变量" },
      { status: 400 },
    );
  }

  // 2. 解析请求体
  let body: { oldPassword?: string; newPassword?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const { oldPassword, newPassword } = body;
  if (!oldPassword || !newPassword) {
    return NextResponse.json({ error: "旧密码和新密码均不能为空" }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "新密码至少 8 位" }, { status: 400 });
  }

  // 3. 查库验证旧密码
  const db = getDb();
  const user = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, session.adminUserId))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!user) {
    return NextResponse.json({ error: "账号不存在" }, { status: 404 });
  }

  // 兼容 PBKDF2 格式（旧账号 saltHex:hashHex）和 bcrypt 格式（$2b$...）
  let verified = false;
  if (user.passwordHash.startsWith("$2")) {
    // bcrypt格式
    verified = await compare(oldPassword, user.passwordHash);
  } else {
    // PBKDF2 格式（向后兼容）
    const { verifyPassword } = await import("@/features/admin-users/service");
    verified = await verifyPassword(oldPassword, user.passwordHash);
  }

  if (!verified) {
    return NextResponse.json({ error: "旧密码不正确" }, { status: 400 });
  }

  // 4. 更新为 bcrypt hash
  const newHash = await hash(newPassword, 12);
  await db
    .update(adminUsers)
    .set({ passwordHash: newHash, updatedAt: new Date() })
    .where(eq(adminUsers.id, session.adminUserId));

  return NextResponse.json({ success: true });
}
