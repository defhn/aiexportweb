import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  resetAdminUserPassword,
} from "@/features/admin-users/service";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";

async function requireClientAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session || session.role === "employee") return null;
  return session;
}

export async function GET() {
  const session = await requireClientAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const currentSite = await getCurrentSiteFromRequest();
  const users =
    session.role === "super_admin"
      ? await getAdminUsers(currentSite.id)
      : await getAdminUsers(session.siteId ?? undefined);
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const session = await requireClientAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = (await request.json()) as {
    username?: string;
    password?: string;
    role?: "client_admin" | "employee";
  };
  const username = body.username?.trim();
  const password = body.password;
  const role = body.role === "client_admin" ? "client_admin" : "employee";

  if (!username || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Username is required and password must be at least 6 characters." },
      { status: 400 },
    );
  }

  if (session.role !== "super_admin" && !session.siteId) {
    return NextResponse.json(
      { error: "This account is not linked to a client site yet." },
      { status: 400 },
    );
  }

  try {
    const currentSite = await getCurrentSiteFromRequest();
    const user = await createAdminUser({
      username,
      password,
      role,
      siteId: session.role === "super_admin" ? currentSite.id ?? null : session.siteId,
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Username already exists." }, { status: 409 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireClientAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id parameter." }, { status: 400 });

  const currentSite = await getCurrentSiteFromRequest();
  await deleteAdminUser(
    id,
    session.role === "super_admin" ? currentSite.id ?? undefined : session.siteId,
  );
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const session = await requireClientAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = (await request.json()) as { id?: number; newPassword?: string };
  if (!body.id || !body.newPassword || body.newPassword.length < 6) {
    return NextResponse.json(
      { error: "New password must be at least 6 characters." },
      { status: 400 },
    );
  }

  const currentSite = await getCurrentSiteFromRequest();
  await resetAdminUserPassword(body.id, body.newPassword, session.role === "super_admin" ? currentSite.id ?? undefined : session.siteId);
  return NextResponse.json({ success: true });
}
