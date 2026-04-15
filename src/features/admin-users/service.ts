/**
 * 鍛樺伐鐢ㄦ埛绠＄悊锛氬鍒犳敼鏌?+ 瀵嗙爜鍝堝笇宸ュ叿
 * 浣跨敤 Web Crypto API锛圢ode 18+ 鍐呯疆锛夛紝闆跺閮ㄤ緷璧? */
import { and, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { adminUsers } from "@/db/schema";

// 鈹€鈹€鈹€ 瀵嗙爜鍝堝笇宸ュ叿锛圥BKDF2锛屾棤绗笁鏂逛緷璧栵級 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  const hashHex = Buffer.from(bits).toString("hex");
  const saltHex = Buffer.from(salt).toString("hex");
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  const salt = Buffer.from(saltHex, "hex");
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  return Buffer.from(bits).toString("hex") === hashHex;
}

// 鈹€鈹€鈹€ 鏌ヨ锛氳幏鍙栨墍鏈夊憳宸?鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
export async function getAdminUsers(siteId?: number | null) {
  const db = getDb();
  const query = db
    .select({
      id: adminUsers.id,
      username: adminUsers.username,
      role: adminUsers.role,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
    .orderBy(adminUsers.createdAt);
  return siteId ? query.where(eq(adminUsers.siteId, siteId)) : query;
}

// 鈹€鈹€鈹€ 鏌ヨ锛氶€氳繃鐢ㄦ埛鍚嶆煡璇紙鐢ㄤ簬鐧诲綍鏍￠獙锛?鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
export async function getAdminUserByUsername(username: string) {
  const db = getDb();
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username));
  return user ?? null;
}

// 鈹€鈹€鈹€ 鎿嶄綔锛氬垱寤哄憳宸?鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
export async function createAdminUser(input: {
  username: string;
  password: string;
  role?: "client_admin" | "employee";
  siteId?: number | null;
}) {
  const db = getDb();
  const passwordHash = await hashPassword(input.password);
  const [user] = await db
    .insert(adminUsers)
    .values({
      username: input.username.trim(),
      passwordHash,
      role: input.role ?? "employee",
      siteId: input.siteId ?? null,
    })
    .returning({
      id: adminUsers.id,
      username: adminUsers.username,
      role: adminUsers.role,
    });
  return user;
}

// 鈹€鈹€鈹€ 鎿嶄綔锛氬垹闄ゅ憳宸?鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
export async function deleteAdminUser(id: number, siteId?: number | null) {
  const db = getDb();
  if (siteId) {
    await db
      .delete(adminUsers)
      .where(and(eq(adminUsers.id, id), eq(adminUsers.siteId, siteId)));
    return;
  }
  await db.delete(adminUsers).where(eq(adminUsers.id, id));
}

// 鈹€鈹€鈹€ 鎿嶄綔锛氶噸缃瘑鐮?鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
export async function resetAdminUserPassword(id: number, newPassword: string, siteId?: number | null) {
  const db = getDb();
  const passwordHash = await hashPassword(newPassword);
  const query = db
    .update(adminUsers)
    .set({ passwordHash, updatedAt: new Date() });
  await (siteId
    ? query.where(and(eq(adminUsers.id, id), eq(adminUsers.siteId, siteId)))
    : query.where(eq(adminUsers.id, id)));
}
