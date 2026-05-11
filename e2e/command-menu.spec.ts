import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.localStorage.setItem("fluvi_state", JSON.stringify({ hasSeenIntro: true, userLevel: "beginner", energy: 0 }));
  });
});

test("chat command button opens a responsive learning command menu", async ({ page }) => {
  await page.goto("/chat?kind=scenario&scenario=formal-beginner-introduce-to-teacher");
  await page.locator(".fixed.inset-0.z-50 button").click({ timeout: 8_000 }).catch(() => undefined);

  const commandButton = page.locator("#chat-command-button");
  const commandPalette = page.locator("#learning-command-palette");

  await expect(commandButton).toBeVisible({ timeout: 20_000 });
  await expect(commandButton).toHaveAttribute("aria-expanded", "false");

  await commandButton.click();

  await expect(commandButton).toHaveAttribute("aria-expanded", "true");
  await expect(commandPalette).toBeVisible();
  await expect(commandPalette.getByRole("menuitem", { name: /Explain Grammar/ })).toBeVisible();
  await expect(commandPalette.getByRole("menuitem", { name: /Improve Flow/ })).toBeVisible();
  await expect(commandPalette.getByRole("menuitem", { name: /New Scenario/ })).toBeVisible();

  const viewport = page.viewportSize();
  const box = await commandPalette.boundingBox();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);

  await commandPalette.getByRole("menuitem", { name: /Explain Grammar/ }).click();
  await expect(page.locator("#chat-input")).toHaveValue("/explain ");
});
