import { expect, test } from "@playwright/test";

test("voice simulation inserts text", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: undefined,
    });
  });
  await page.goto("/chat?kind=scenario&scenario=casual-beginner-favorite-food");
  await page.locator("#chat-voice-button").click();
  await expect(page.locator("#chat-input")).not.toHaveValue("", { timeout: 3000 });
});
