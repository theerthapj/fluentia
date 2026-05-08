import { expect, test } from "@playwright/test";

test("moderation cooldown appears after repeated unsafe input", async ({ page }) => {
  await page.goto("/chat?kind=scenario&scenario=formal-beginner-introduce-to-teacher");
  for (let i = 0; i < 3; i += 1) {
    await page.locator("#chat-input").fill("you are stupid now");
    await page.locator("#chat-send-button").click();
  }
  await expect(page.getByText(/60s remaining|Input is paused/)).toBeVisible();
});
