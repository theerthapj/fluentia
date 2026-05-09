import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AppStateProvider, useAppState } from "@/components/providers/AppStateProvider";
import { LevelPreferenceSelector } from "@/components/settings/LevelPreferenceSelector";
import { FluviProvider } from "@/context/FluviContext";

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
  });

  it("lets learners manually choose a level and unlock practice", () => {
    renderSelector();

    fireEvent.click(screen.getByRole("button", { name: /Intermediate/ }));

    expect(screen.getByTestId("level-state")).toHaveTextContent("intermediate:true");
    expect(screen.getByRole("button", { name: /Intermediate/ })).toHaveAttribute("aria-pressed", "true");
  });
});
