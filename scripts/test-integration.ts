import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { config } from "dotenv";
config({ quiet: true });
const provider = process.env.DB_PROVIDER || "sqlite";
const url =
  provider === "mysql"
    ? process.env.TEST_DATABASE_URL
    : `file:./data/tests/${randomUUID()}.db`;
if (!url || (provider === "mysql" && !new URL(url).pathname.endsWith("_test")))
  throw new Error(
    "For MySQL set TEST_DATABASE_URL to a dedicated database ending in _test",
  );
const env = { ...process.env, DATABASE_URL: url, DB_PROVIDER: provider };
for (const args of [
  ["--import", "tsx", "scripts/database.ts", "generate"],
  ["--import", "tsx", "scripts/database.ts", "migrate"],
  [
    "--conditions=react-server",
    "--import",
    "tsx",
    "--test",
    "tests/integration/database.test.ts",
  ],
]) {
  const result = spawnSync(process.execPath, args, { stdio: "inherit", env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
