import { config } from "dotenv";
config({ quiet: true });
export function databaseConfig() {
  const provider = process.env.DB_PROVIDER || "sqlite";
  if (provider !== "sqlite" && provider !== "mysql")
    throw new Error("DB_PROVIDER must be sqlite or mysql");
  if (process.env.VERCEL && provider === "sqlite")
    throw new Error(
      "Vercel requires hosted MySQL. Filesystem SQLite cannot persist admin changes.",
    );
  const url =
    process.env.DATABASE_URL ||
    (provider === "sqlite" ? "file:./data/tawreed.db" : "");
  if (!url || !url.startsWith(provider === "sqlite" ? "file:" : "mysql://"))
    throw new Error("DATABASE_URL does not match DB_PROVIDER");
  return { provider, url } as const;
}
export function applicationOrigin() {
  const url = process.env.APP_URL;
  if (!url && process.env.NODE_ENV === "production")
    throw new Error("APP_URL is required in production");
  return new URL(url || "http://localhost:3000").origin;
}
