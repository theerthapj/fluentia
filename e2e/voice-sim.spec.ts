import { expect, test } from "@playwright/test";

test("voice capture streams transcript text into the input", async ({ page }) => {
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
  await page.locator("#chat-voice-button").click();
  await expect(page.locator("#chat-input")).toHaveValue(/I like pizza/, { timeout: 3000 });
});
