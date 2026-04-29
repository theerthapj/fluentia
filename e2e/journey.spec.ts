import { expect, test } from "@playwright/test";

test("full Fluentia journey", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Fluentia")).toBeVisible();
  await page.waitForURL("**/home", { timeout: 7000 });
  await page.locator("#home-start-speaking").click();
  await page.locator("#assessment-option-0-1").click();
  await page.locator("#assessment-option-1-1").click();
  await page.locator("#assessment-text-fluency").fill("I wake up early, drink water, and prepare my study plan before breakfast every morning.");
  await page.locator("#assessment-next-fluency").click();
  await page.locator("#assessment-option-3-2").click();
  await page.locator("#assessment-text-composition").fill("Hello, my name is Alex. I enjoy learning languages, meeting new people, and improving my communication skills.");
  await page.locator("#assessment-next-composition").click();
  await expect(page.getByText("Assessment Complete")).toBeVisible();
  await page.locator("#assessment-continue").click();
  await page.locator("#mode-formal").click();
  await page.locator("#scenario-job-interview").click();
  await page.locator("#chat-input").fill("Thank you for meeting with me. I enjoy solving problems and working with people in a calm way.");
  await page.locator("#chat-send-button").click();
  await expect(page.getByText(/Good attempt/)).toBeVisible({ timeout: 8000 });
  await page.locator("#chat-input").fill("I also try to learn quickly and explain my ideas clearly when I work with a team.");
  await page.locator("#chat-send-button").click();
  await expect(page.locator("#chat-feedback-button")).toBeVisible({ timeout: 8000 });
});
