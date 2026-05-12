import { expect, test } from "@playwright/test";

test("settings preferences persist and affect chat input affordance", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
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
          preferences: { listeningEnabled: true, playbackSpeed: "normal", preferredInputMode: "text" },
        },
      }),
    );
  });

  await page.goto("/settings");

  await page.locator("#settings-listening-toggle").uncheck();
  await page.locator("#settings-playback-speed").selectOption("fast");
  await page.getByLabel("voice").check();

  await page.reload();
  await expect(page.locator("#settings-listening-toggle")).not.toBeChecked();
  await expect(page.locator("#settings-playback-speed")).toHaveValue("fast");
  await expect(page.getByLabel("voice")).toBeChecked();

  await page.goto("/chat?kind=scenario&scenario=casual-beginner-favorite-food");
  await expect(page.locator("#chat-input")).toHaveAttribute("placeholder", /Use voice or type/);
  await expect(page.locator("#chat-voice-button")).toHaveClass(/text-accent-primary/);
});
