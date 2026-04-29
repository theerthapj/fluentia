import { expect, test } from "@playwright/test";

test("voice simulation inserts text", async ({ page }) => {
  await page.goto("/chat?scenario=ordering-food");
  await page.locator("#chat-voice-button").click();
  await expect(page.locator("#chat-input")).not.toHaveValue("", { timeout: 3000 });
});
