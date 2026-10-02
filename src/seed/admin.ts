import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../lib/database";
export async function seedAdmin(
  env: { ADMIN_EMAIL?: string; ADMIN_PASSWORD?: string } = {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
) {
  const email = z.email().max(191).parse(env.ADMIN_EMAIL).trim().toLowerCase();
  const password = z
    .string()
    .min(12)
    .refine(
      (v) => Buffer.byteLength(v) <= 72,
      "Password must be at most 72 UTF-8 bytes",
    )
    .parse(env.ADMIN_PASSWORD);
  await db().admin.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash: await bcrypt.hash(password, 12) },
  });
}
