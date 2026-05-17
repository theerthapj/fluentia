import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AppStateProvider, useAppState } from "@/components/providers/AppStateProvider";
import { getAppStateStorageKey, GUEST_ASSESSMENT_PROGRESS_KEY, GUEST_STORAGE_KEY } from "@/lib/assessment-state";
import { STORAGE_KEY, WARNINGS_KEY } from "@/lib/constants";

function PersistenceProbe() {
  const { state, hydrated, setAssessment, setPreferredLevel, resetDemo } = useAppState();
  return (
    <div>
      <div data-testid="hydrated">{String(hydrated)}</div>
      <div data-testid="saved-level">
        {state.level ?? "none"}:{String(state.assessmentCompleted)}
      </div>
      <div data-testid="assessment-source">{state.assessmentSource ?? "none"}</div>
      <div data-testid="user-id">{state.userId ?? "guest"}</div>
      <button type="button" onClick={() => setPreferredLevel("intermediate")}>
        Set intermediate
      </button>
      <button
        type="button"
        onClick={() =>
          setAssessment("advanced", {
            grammar: 2,
            vocabulary: 2,
            fluency: 2,
            pronunciation: 2,
            composition: 2,
            total: 10,
          })
        }
      >
        Set assessment
      </button>
      <button type="button" onClick={resetDemo}>
        Reset demo
      </button>
    </div>
  );
}

function renderProbe(userId?: string | null) {
  return render(
    <AppStateProvider userId={userId}>
      <PersistenceProbe />
    </AppStateProvider>,
  );
}

describe("AppStateProvider persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("restores saved level and assessment state after remount", async () => {
    const firstRender = renderProbe();

    await waitFor(() => expect(screen.getByTestId("hydrated")).toHaveTextContent("true"));
    fireEvent.click(screen.getByRole("button", { name: "Set intermediate" }));
    expect(screen.getByTestId("saved-level")).toHaveTextContent("intermediate:true");
    expect(screen.getByTestId("assessment-source")).toHaveTextContent("manual");

    firstRender.unmount();
    renderProbe();

    await waitFor(() => expect(screen.getByTestId("saved-level")).toHaveTextContent("intermediate:true"));
    expect(screen.getByTestId("assessment-source")).toHaveTextContent("manual");
    expect(window.localStorage.getItem(GUEST_STORAGE_KEY)).toContain("intermediate");
  });

  it("persists assessment scores with assessment metadata", async () => {
    renderProbe();

    await waitFor(() => expect(screen.getByTestId("hydrated")).toHaveTextContent("true"));
    fireEvent.click(screen.getByRole("button", { name: "Set assessment" }));

    expect(screen.getByTestId("saved-level")).toHaveTextContent("advanced:true");
    expect(screen.getByTestId("assessment-source")).toHaveTextContent("assessment");
    expect(window.localStorage.getItem(GUEST_STORAGE_KEY)).toContain('"assessmentSource":"assessment"');
  });

  it("treats legacy saved levels as completed assessments", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        state: {
          level: "advanced",
          assessmentCompleted: false,
        },
      }),
    );

    renderProbe();

    await waitFor(() => expect(screen.getByTestId("saved-level")).toHaveTextContent("advanced:true"));
  });

  it("keeps future user-scoped progress isolated from guest and other users", async () => {
    window.localStorage.setItem(
      GUEST_STORAGE_KEY,
      JSON.stringify({
        version: 2,
        state: {
          level: "advanced",
          assessmentCompleted: true,
        },
      }),
    );
    window.localStorage.setItem(
      getAppStateStorageKey("user-a"),
      JSON.stringify({
        version: 2,
        state: {
          level: "beginner",
          assessmentCompleted: true,
        },
      }),
    );

    const firstRender = renderProbe("user-a");
    await waitFor(() => expect(screen.getByTestId("saved-level")).toHaveTextContent("beginner:true"));
    expect(screen.getByTestId("user-id")).toHaveTextContent("user-a");

    firstRender.unmount();
    renderProbe("user-b");

    await waitFor(() => expect(screen.getByTestId("saved-level")).toHaveTextContent("none:false"));
    expect(screen.getByTestId("user-id")).toHaveTextContent("user-b");
  });

  it("clears saved app state, assessment drafts, and warnings when demo data is reset", async () => {
    window.localStorage.setItem(GUEST_ASSESSMENT_PROGRESS_KEY, JSON.stringify({ step: 2, answers: [] }));
    window.localStorage.setItem(WARNINGS_KEY, JSON.stringify({ warningCount: 2, cooldownUntil: Date.now() + 60_000 }));
    renderProbe();

    await waitFor(() => expect(screen.getByTestId("hydrated")).toHaveTextContent("true"));
    fireEvent.click(screen.getByRole("button", { name: "Set assessment" }));
    expect(screen.getByTestId("saved-level")).toHaveTextContent("advanced:true");

    fireEvent.click(screen.getByRole("button", { name: "Reset demo" }));

    expect(screen.getByTestId("saved-level")).toHaveTextContent("none:false");
    expect(screen.getByTestId("assessment-source")).toHaveTextContent("none");
    expect(window.localStorage.getItem(GUEST_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(GUEST_ASSESSMENT_PROGRESS_KEY)).toBeNull();
    expect(window.localStorage.getItem(WARNINGS_KEY)).toBeNull();
  });
});
