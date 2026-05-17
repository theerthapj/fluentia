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

test("settings reset demo confirms before clearing progress", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.clear();
    window.localStorage.setItem("fluvi_state", JSON.stringify({ hasSeenIntro: true, userLevel: "advanced", energy: 0.8 }));
    window.localStorage.setItem("fluentia_assessment_progress_guest", JSON.stringify({ step: 2, answers: [{ id: "grammar", value: "x" }] }));
    window.localStorage.setItem("fluentia_warnings", JSON.stringify({ warningCount: 2, cooldownUntil: Date.now() + 60_000 }));
    window.localStorage.setItem(
      "fluentia_app_state_guest",
      JSON.stringify({
        version: 2,
        state: {
          userId: null,
          level: "advanced",
          assessmentCompleted: true,
          assessmentCompletedAt: new Date().toISOString(),
          assessmentSource: "assessment",
          assessmentScores: { grammar: 2, vocabulary: 2, fluency: 2, pronunciation: 2, composition: 2, total: 10 },
          sessions: [{ id: "session-1", scenarioTitle: "Demo", messages: [], completedAt: new Date().toISOString(), score: 8 }],
          preferences: { listeningEnabled: false, playbackSpeed: "fast", preferredInputMode: "voice" },
        },
      }),
    );
  });

  await page.goto("/settings");
  await page.locator("#settings-reset-demo").click();
  await expect(page.getByRole("dialog", { name: "Reset all demo progress?" })).toBeVisible();

  await page.locator("#settings-reset-confirm").click();
  await expect(page).toHaveURL(/\/$/);

  const storage = await page.evaluate(() => ({
    appState: window.localStorage.getItem("fluentia_app_state_guest"),
    assessmentProgress: window.localStorage.getItem("fluentia_assessment_progress_guest"),
    warnings: window.localStorage.getItem("fluentia_warnings"),
    fluvi: window.localStorage.getItem("fluvi_state"),
  }));

  expect(storage.appState).toBeNull();
  expect(storage.assessmentProgress).toBeNull();
  expect(storage.warnings).toBeNull();
  expect(storage.fluvi).toContain('"hasSeenIntro":false');
  expect(storage.fluvi).toContain('"userLevel":"beginner"');
});
