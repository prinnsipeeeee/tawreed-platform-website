import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { databaseConfig } from "../src/lib/config";
const { provider, url } = databaseConfig();
const models = readFileSync("prisma/models.prisma", "utf8");
for (const dialect of ["sqlite", "mysql"]) {
  mkdirSync(`prisma/${dialect}`, { recursive: true });
  let body = models;
  if (dialect === "mysql")
    body = body.replace(
      /(  (?:payload|rows|errors|en|ar|descriptionEn|descriptionAr|specialtyEn|specialtyAr|coverageEn|coverageAr|locator|value) String[^\n]*)/g,
      "$1 @db.LongText",
    );
  writeFileSync(
    `prisma/${dialect}/schema.prisma`,
    `// Generated from prisma/models.prisma. Edit the shared definition.\ngenerator client {\n  provider = "prisma-client"\n  output = "../../src/generated/prisma"\n}\ndatasource db {\n  provider = "${dialect}"\n}\n${body}`,
  );
}
if (provider === "sqlite") {
  mkdirSync(dirname(resolve(url.slice(5))), { recursive: true });
  // Prisma migrate deploy expects an existing SQLite file on a fresh install.
  if (process.argv[2] === "migrate")
    writeFileSync(resolve(url.slice(5)), "", { flag: "a" });
}
const mode = process.argv[2];
const extra =
  mode === "generate"
    ? ["generate"]
    : mode === "migrate"
      ? ["migrate", "deploy"]
      : process.argv.slice(2);
const result = spawnSync(
  process.execPath,
  [
    "node_modules/prisma/build/index.js",
    ...extra,
    "--config",
    "prisma.config.ts",
  ],
  { stdio: "inherit", env: process.env },
);
process.exit(result.status ?? 1);
