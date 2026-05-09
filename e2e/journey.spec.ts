import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.localStorage.setItem("fluvi_state", JSON.stringify({ hasSeenIntro: true, userLevel: "beginner", energy: 0 }));
  });
});

test("full Fluentia journey", async ({ page }) => {
  test.setTimeout(180_000);

  await page.goto("/");
  await expect(page.getByText("Master your next")).toBeVisible();
  await page.getByRole("link", { name: "Start Practicing Free" }).first().click({ force: true });
  await expect(page).toHaveURL(/\/assessment$/, { timeout: 20_000 });
  await expect(page.locator("#assessment-option-0-1")).toBeVisible({ timeout: 20_000 });
  await page.locator("#assessment-option-0-1").click();
  await page.locator("#assessment-confirm-0").click();
  await expect(page.locator("#assessment-option-1-1")).toBeVisible();
  await page.locator("#assessment-option-1-1").click();
  await page.locator("#assessment-confirm-1").click();
  await expect(page.locator("#assessment-text-fluency")).toBeVisible();
  const fluencyAnswer = page.locator("#assessment-text-fluency");
  await fluencyAnswer.fill("I wake up early, drink water, and prepare my study plan before breakfast every morning.");
  await expect(fluencyAnswer).toHaveValue(/prepare my study plan/);
  await page.locator("#assessment-next-fluency").click();
  await expect(page.locator("#assessment-option-3-2")).toBeVisible();
  await page.locator("#assessment-option-3-2").click();
  await page.locator("#assessment-confirm-3").click();
  await expect(page.locator("#assessment-text-composition")).toBeVisible();
  const compositionAnswer = page.locator("#assessment-text-composition");
  await compositionAnswer.fill("Hello, my name is Alex. I enjoy learning languages, meeting new people, and improving my communication skills.");
  await expect(compositionAnswer).toHaveValue(/improving my communication skills/);
  await page.locator("#assessment-next-composition").click();
  await expect(page.getByText("Assessment Complete")).toBeVisible({ timeout: 20_000 });
  await page.locator("#learning-plan-begin").click();
  await expect(page).toHaveURL(/\/mode$/, { timeout: 20_000 });
  await expect(page.getByRole("button", { name: /Formal/ })).toBeVisible({ timeout: 20_000 });
  await page.getByRole("button", { name: /Formal/ }).click();
  await expect(page).toHaveURL(/\/scenarios$/, { timeout: 20_000 });
  const professionalMeetingScenario = page.locator("#scenario-formal-advanced-professional-meeting");
  await expect(professionalMeetingScenario).toBeVisible({ timeout: 20_000 });
  await professionalMeetingScenario.click({ force: true });
  await expect(page).toHaveURL(/\/chat\?kind=scenario&scenario=formal-advanced-professional-meeting$/, { timeout: 20_000 });
  await expect(page.locator("#chat-input")).toBeVisible({ timeout: 40_000 });
  await page.locator("#chat-input").fill("Thank you for meeting with me. I enjoy solving problems and working with people in a calm way.");
  await page.locator("#chat-send-button").click();
  await expect(page.locator("#inline-coaching-tip").getByText(/Tip:/)).toBeVisible({ timeout: 20_000 });
  await page.locator("#chat-input").fill("I also try to learn quickly and explain my ideas clearly when I work with a team.");
  await page.locator("#chat-send-button").click();
  await expect(page.locator("#chat-feedback-button")).toBeVisible({ timeout: 20_000 });
});
