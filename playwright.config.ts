import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
import { randomBytes } from "node:crypto";
const password =
  process.env.BROWSER_TEST_PASSWORD || randomBytes(24).toString("hex");
process.env.BROWSER_TEST_PASSWORD = password;
const runId = randomBytes(8).toString("hex");
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  timeout: 60000,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3100",
    headless: true,
    screenshot: "off",
    video: "off",
    trace: "off",
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_EXECUTABLE_PATH ||
        (existsSync(chrome) ? chrome : undefined),
    },
  },
  webServer: {
    command:
      "node --import tsx scripts/browser-setup.ts && next dev --webpack -p 3100",
    url: "http://localhost:3100/admin/login",
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      ...process.env,
      DB_PROVIDER: "sqlite",
      DATABASE_URL: `file:./data/browser-tests-${runId}.db`,
      APP_URL: "http://localhost:3100",
      STORAGE_DRIVER: "local",
      UPLOAD_DIR: `./data/browser-tests-uploads-${runId}`,
      BROWSER_TEST_PASSWORD: password,
    },
  },
});
