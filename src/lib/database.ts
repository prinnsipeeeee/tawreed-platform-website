import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { databaseConfig } from "./config";
function createClient() {
  const { provider, url } = databaseConfig();
  let adapter;
  if (provider === "sqlite") {
    const file = resolve(url.slice(5));
    mkdirSync(dirname(file), { recursive: true });
    adapter = new PrismaBetterSqlite3({ url: `file:${file}` });
  } else {
    const parsed = new URL(url);
    adapter = new PrismaMariaDb({
      host: parsed.hostname,
      port: Number(parsed.port || 3306),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.slice(1),
      connectionLimit: 5,
      ...(parsed.searchParams.get("ssl") === "true"
        ? { ssl: { rejectUnauthorized: true } }
        : {}),
    });
  }
  return new PrismaClient({ adapter });
}
const globalDatabase = globalThis as unknown as { tawreed?: PrismaClient };
export function db() {
  return (globalDatabase.tawreed ??= createClient());
}
