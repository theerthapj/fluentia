import { expect, test } from "@playwright/test";

const FLUVI_STATE_KEY = "fluvi_state";
const APP_STATE_KEY = "fluentia_app_state_guest";

function completedAppState() {
  return {
    version: 2,
    state: {
      userId: null,
      level: "beginner",
      assessmentCompleted: true,
      assessmentCompletedAt: new Date().toISOString(),
      assessmentSource: "assessment",
      assessmentScores: { grammar: 2, vocabulary: 2, fluency: 1, pronunciation: 1, composition: 1, total: 7 },
      preferences: { listeningEnabled: true, playbackSpeed: "normal", preferredInputMode: "text" },
    },
  };
}

test("Fluvi intro plays once for a fresh visitor and persists dismissal", async ({ page }) => {
  await page.goto("/");

  const intro = page.getByTestId("fluvi-intro-dialog");
  await expect(intro).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole("dialog", { name: "Meet Fluvi" })).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(intro).toBeFocused();

  const dismissButton = page.getByRole("button", { name: "Let's learn together" });
  await expect(dismissButton).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText("speak English with confidence")).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(dismissButton).toBeFocused();

  await dismissButton.click();
  await expect(intro).toHaveCount(0, { timeout: 5_000 });

  await expect
    .poll(async () => page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) ?? "{}").hasSeenIntro, FLUVI_STATE_KEY))
    .toBe(true);

  await page.reload();
  await page.waitForTimeout(900);
  await expect(page.getByTestId("fluvi-intro-dialog")).toHaveCount(0);
});

test("settings can replay the Fluvi intro without clearing app progress", async ({ page }) => {
  await page.addInitScript(
    ({ fluviKey, appKey, appState }) => {
      window.localStorage.clear();
      window.localStorage.setItem(fluviKey, JSON.stringify({ hasSeenIntro: true, userLevel: "beginner", energy: 0 }));
      window.localStorage.setItem(appKey, JSON.stringify(appState));
    },
    { fluviKey: FLUVI_STATE_KEY, appKey: APP_STATE_KEY, appState: completedAppState() },
  );

  await page.goto("/settings");

  await page.getByRole("button", { name: "Replay intro" }).click();

  const intro = page.getByTestId("fluvi-intro-dialog");
  await expect(intro).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText("Hi, I'm Fluvi")).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: "Let's learn together" }).click();
  await expect(intro).toHaveCount(0, { timeout: 5_000 });

  await expect
    .poll(async () => page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) ?? "{}").hasSeenIntro, FLUVI_STATE_KEY))
    .toBe(true);
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
});
