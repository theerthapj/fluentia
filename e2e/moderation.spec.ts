import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.localStorage.setItem("fluvi_state", JSON.stringify({ hasSeenIntro: true, userLevel: "beginner", energy: 0 }));
    window.localStorage.setItem(
      "fluentia_app_state_guest",
      JSON.stringify({
        version: 2,
        state: {
          userId: null,
          level: "beginner",
          assessmentCompleted: true,
          assessmentCompletedAt: new Date().toISOString(),
          assessmentSource: "assessment",
          assessmentScores: { grammar: 2, vocabulary: 2, fluency: 1, pronunciation: 1, composition: 1, total: 7 },
          preferences: { listeningEnabled: false, playbackSpeed: "normal", preferredInputMode: "text" },
        },
      }),
    );
  });
});

test("moderation cooldown appears after repeated unsafe input", async ({ page }) => {
  test.setTimeout(60_000);

  await page.goto("/chat?kind=scenario&scenario=formal-beginner-introduce-to-teacher");
  await expect(page.locator("#chat-input")).toBeVisible({ timeout: 20_000 });

  for (let i = 0; i < 3; i += 1) {
    await page.locator("#chat-input").fill("you are stupid now");
    await page.locator("#chat-send-button").click();
    await expect(page.getByText(/Please use respectful language|Repeated inappropriate language|Input is paused/)).toBeVisible();
  }

  await expect(page.getByText(/60s remaining|Input is paused/)).toBeVisible();
});
