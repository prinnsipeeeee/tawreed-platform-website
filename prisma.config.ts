import { defineConfig } from "prisma/config";
import { resolve } from "node:path";
import { databaseConfig } from "./src/lib/config";
const { provider, url } = databaseConfig();
export default defineConfig({
  schema: `prisma/${provider}/schema.prisma`,
  migrations: { path: `prisma/${provider}/migrations` },
  datasource: {
    url: provider === "sqlite" ? `file:${resolve(url.slice(5))}` : url,
  },
});
