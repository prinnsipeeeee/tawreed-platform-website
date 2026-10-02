import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { existsSync } from "node:fs";
import { createConnection } from "mariadb";
const binary =
  process.env.MYSQLD_PATH || "/opt/homebrew/opt/mysql@8.0/bin/mysqld";
if (!existsSync(binary))
  throw new Error("Set MYSQLD_PATH to your MySQL server executable");
mkdirSync("data", { recursive: true });
const dir = mkdtempSync(resolve("data/mysql-test-"));
const port = 33307;
const socket = join(dir, "mysql.sock");
const init = spawnSync(
  binary,
  ["--no-defaults", "--initialize-insecure", `--datadir=${dir}`],
  { stdio: "ignore" },
);
if (init.status !== 0)
  throw new Error("Could not initialize isolated MySQL test server");
const server = spawn(
  binary,
  [
    "--no-defaults",
    `--datadir=${dir}`,
    `--socket=${socket}`,
    `--port=${port}`,
    "--bind-address=127.0.0.1",
    `--pid-file=${join(dir, "mysql.pid")}`,
    `--log-error=${join(dir, "mysql.log")}`,
  ],
  { stdio: "ignore" },
);
try {
  let connection;
  for (let i = 0; i < 60; i++) {
    try {
      connection = await createConnection({ socketPath: socket, user: "root" });
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  if (!connection) throw new Error("Isolated MySQL did not start");
  await connection.query(
    "CREATE DATABASE tawreed_admin_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
  );
  await connection.end();
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/test-integration.ts"],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        DB_PROVIDER: "mysql",
        DATABASE_URL: `mysql://root@127.0.0.1:${port}/tawreed_admin_test`,
        TEST_DATABASE_URL: `mysql://root@127.0.0.1:${port}/tawreed_admin_test`,
      },
    },
  );
  process.exitCode = result.status ?? 1;
} finally {
  server.kill("SIGTERM");
  spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/database.ts", "generate"],
    { stdio: "inherit", env: process.env },
  );
}
