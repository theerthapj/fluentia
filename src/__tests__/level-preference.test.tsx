import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppStateProvider, useAppState } from "@/components/providers/AppStateProvider";
import { LevelPreferenceSelector } from "@/components/settings/LevelPreferenceSelector";
import { FluviProvider } from "@/context/FluviContext";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

function StateProbe() {
  const { state } = useAppState();
  return (
    <div data-testid="level-state">
      {state.level ?? "none"}:{String(state.assessmentCompleted)}
    </div>
  );
}

function renderSelector() {
  render(
    <AppStateProvider>
      <FluviProvider>
        <LevelPreferenceSelector idPrefix="test-level" />
        <StateProbe />
      </FluviProvider>
    </AppStateProvider>,
  );
}

describe("LevelPreferenceSelector", () => {
  beforeEach(() => {
    window.localStorage.clear();
    pushMock.mockClear();
  });

  it("keeps manual level changes locked until assessment is completed", async () => {
    renderSelector();

    await waitFor(() => expect(screen.getByTestId("level-state")).toHaveTextContent("none:false"));
    fireEvent.click(screen.getByRole("button", { name: /Intermediate/ }));

    expect(screen.getByTestId("level-state")).toHaveTextContent("none:false");
    expect(pushMock).toHaveBeenCalledWith("/assessment");
  });
});
