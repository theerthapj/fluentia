import { defineConfig, devices } from "@playwright/test";

const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3210",
    trace: "on-first-retry",
  },
  webServer: skipWebServer ? undefined : {
    command: "node ./node_modules/next/dist/bin/next dev --port 3210 --hostname 127.0.0.1",
    url: "http://127.0.0.1:3210",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
});
