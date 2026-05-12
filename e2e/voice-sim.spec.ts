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

test("voice capture streams transcript text into the input", async ({ page }) => {
  test.setTimeout(60_000);

  await page.addInitScript(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: undefined,
    });
    class MockSpeechRecognition {
      continuous = false;
      interimResults = false;
      lang = "en-US";
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      onresult: ((event: {
        resultIndex: number;
        results: {
          length: number;
          item: (index: number) => { isFinal: boolean; 0: { transcript: string } };
          0: { isFinal: boolean; 0: { transcript: string } };
        };
      }) => void) | null = null;

      start() {
        window.setTimeout(() => {
          const result = { isFinal: false, 0: { transcript: "I like pizza because it tastes great" } };
          this.onresult?.({
            resultIndex: 0,
            results: {
              length: 1,
              item: () => result,
              0: result,
            },
          });
        }, 50);
      }

      stop() {
        this.onend?.();
      }
    }

    Object.defineProperty(window, "webkitSpeechRecognition", {
      configurable: true,
      value: MockSpeechRecognition,
    });
    Object.defineProperty(window, "SpeechRecognition", {
      configurable: true,
      value: MockSpeechRecognition,
    });
  });
  await page.goto("/chat?kind=scenario&scenario=casual-beginner-favorite-food");
  await expect(page.locator("#chat-input")).toBeVisible({ timeout: 20_000 });
  await page.locator("#chat-voice-button").click();
  await expect(page.locator("#chat-input")).toHaveValue(/I like pizza/, { timeout: 3000 });
  await page.locator("#chat-voice-button").dispatchEvent("click");
  await expect(page.locator("#chat-voice-button")).toHaveAttribute("aria-label", "Start voice recording");
});
