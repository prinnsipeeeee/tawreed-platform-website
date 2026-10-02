import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "./database";
import { applicationOrigin } from "./config";
import { AppError } from "./errors";
const cookieName = "tawreed_session";
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
export async function adminSession() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await db().session.findUnique({
    where: { tokenHash: hash(token) },
    include: { admin: true },
  });
  if (!session || session.expiresAt <= new Date()) return null;
  return {
    id: session.admin.id,
    email: session.admin.email,
    tokenHash: session.tokenHash,
  };
}
export async function requireAdmin() {
  const admin = await adminSession();
  if (!admin) throw new AppError("unauthorized", 401);
  return admin;
}
export async function adminPage() {
  const admin = await adminSession();
  if (!admin) redirect("/admin/login");
  return admin;
}
export async function sameOrigin() {
  const h = await headers();
  if (h.get("origin") !== applicationOrigin())
    throw new AppError("forbidden", 403);
}
export async function login(email: string, password: string) {
  const database = db();
  const normalized = email.trim().toLowerCase();
  if (normalized.length > 191 || Buffer.byteLength(password) > 72)
    throw new AppError("invalidCredentials", 401);
  const h = await headers();
  const ip = process.env.VERCEL
    ? h.get("x-vercel-forwarded-for")?.split(",")[0] || "unknown"
    : "local";
  const keys = [hash(`email:${normalized}`), hash(`ip:${ip}`)];
  const now = new Date();
  const cutoff = new Date(now.getTime() - 15 * 60_000);
  for (const key of keys) {
    const attempt = await database.loginAttempt.findUnique({ where: { key } });
    if (attempt?.blockedUntil && attempt.blockedUntil > now)
      throw new AppError("tooManyAttempts", 429);
    if (attempt && attempt.windowStart < cutoff)
      await database.loginAttempt.delete({ where: { key } });
    await database.loginAttempt.upsert({
      where: { key },
      create: { key, failures: 1 },
      update: { failures: { increment: 1 } },
    });
    const current = await database.loginAttempt.findUniqueOrThrow({
      where: { key },
    });
    if (current.failures > (key === keys[0] ? 8 : 40)) {
      await database.loginAttempt.update({
        where: { key },
        data: { blockedUntil: new Date(now.getTime() + 15 * 60_000) },
      });
      throw new AppError("tooManyAttempts", 429);
    }
  }
  const admin = await database.admin.findUnique({
    where: { email: normalized },
  });
  // Always perform a password comparison, including unknown accounts.
  const valid = await bcrypt.compare(
    password,
    admin?.passwordHash ||
      "$2b$12$JZf6WNCYd93MXTDDGYMsH.gFzm8IqENBxqsVCmhIMruFpNhXZuoim",
  );
  if (!admin || !valid) throw new AppError("invalidCredentials", 401);
  await database.loginAttempt.deleteMany({ where: { key: keys[0] } });
  await database.session.deleteMany({ where: { expiresAt: { lte: now } } });
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(now.getTime() + 8 * 60 * 60_000);
  await database.session.create({
    data: { tokenHash: hash(token), adminId: admin.id, expiresAt },
  });
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}
export async function logout() {
  const token = (await cookies()).get(cookieName)?.value;
  if (token)
    await db().session.deleteMany({ where: { tokenHash: hash(token) } });
  (await cookies()).delete(cookieName);
}
export async function changePassword(oldPassword: string, password: string) {
  const session = await requireAdmin();
  if (password.length < 12 || Buffer.byteLength(password) > 72)
    throw new AppError("passwordLength");
  const admin = await db().admin.findUniqueOrThrow({
    where: { id: session.id },
  });
  if (!(await bcrypt.compare(oldPassword, admin.passwordHash)))
    throw new AppError("invalidCredentials", 401);
  await db().$transaction([
    db().admin.update({
      where: { id: admin.id },
      data: { passwordHash: await bcrypt.hash(password, 12) },
    }),
    db().session.deleteMany({
      where: { adminId: admin.id, tokenHash: { not: session.tokenHash } },
    }),
  ]);
}
