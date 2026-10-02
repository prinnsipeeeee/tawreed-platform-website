import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
for (const provider of ["sqlite", "mysql"]) {
  const target = `prisma/${provider}/migrations/20261001000000_initial`;
  if (
    existsSync(`${target}/migration.sql`) &&
    !process.argv.includes("--refresh")
  )
    continue;
  const result = spawnSync(
    process.execPath,
    [
      "node_modules/prisma/build/index.js",
      "migrate",
      "diff",
      "--from-empty",
      "--to-schema",
      `prisma/${provider}/schema.prisma`,
      "--script",
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        DB_PROVIDER: provider,
        DATABASE_URL:
          provider === "sqlite"
            ? "file:./data/tawreed.db"
            : "mysql://root@localhost:3306/tawreed",
      },
    },
  );
  if (result.status !== 0) {
    console.error(result.stderr);
    process.exit(1);
  }
  mkdirSync(target, { recursive: true });
  writeFileSync(`${target}/migration.sql`, result.stdout);
  writeFileSync(
    `prisma/${provider}/migrations/migration_lock.toml`,
    `provider = "${provider}"\n`,
  );
}
