import { defineConfig, devices } from "@playwright/test";

const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1";
const e2eHost = process.env.E2E_HOST ?? "127.0.0.1";
const e2ePort = process.env.E2E_PORT ?? "3210";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${e2eHost}:${e2ePort}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: skipWebServer ? undefined : {
    command: `node ./node_modules/next/dist/bin/next dev --port ${e2ePort} --hostname ${e2eHost}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
});
