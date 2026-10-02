import { spawnSync } from "node:child_process";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/database";
import { seedLanding } from "../src/seed/defaults";
if (!process.env.DATABASE_URL?.includes("browser-tests"))
  throw new Error("Browser setup requires an isolated browser-tests database");
for (const mode of ["generate", "migrate"]) {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/database.ts", mode],
    { stdio: "inherit", env: process.env },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}
await seedLanding();
const email = "browser@example.test";
const password = process.env.BROWSER_TEST_PASSWORD!;
if (!password) throw new Error("BROWSER_TEST_PASSWORD is required");
await db().admin.upsert({
  where: { email },
  create: { email, passwordHash: await bcrypt.hash(password, 12) },
  update: { passwordHash: await bcrypt.hash(password, 12) },
});
await db().$disconnect();
