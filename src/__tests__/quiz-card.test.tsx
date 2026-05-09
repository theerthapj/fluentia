import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QuizCard } from "@/components/brainboost/QuizCard";
import { FluviProvider } from "@/context/FluviContext";
import type { IdiomQuestion } from "@/lib/brainboost-data";

const idiomQuestion: IdiomQuestion = {
  type: "fix-idiom",
  id: "test-idiom",
  scrambled: ["late", "better", "never", "than"],
  correct: ["better", "late", "than", "never"],
  explanation: '"Better late than never" means it is better to do something late than not do it at all.',
};

function renderQuizCard(onAnswer = vi.fn()) {
  render(
    <FluviProvider>
      <QuizCard question={idiomQuestion} questionNumber={1} total={1} onAnswer={onAnswer} />
    </FluviProvider>,
  );
  return onAnswer;
}

function chooseWords(words: string[]) {
  for (const word of words) {
    fireEvent.click(screen.getByRole("button", { name: word }));
  }
  fireEvent.click(screen.getByRole("button", { name: "Check Answer" }));
}

describe("QuizCard idiom feedback", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the correct phrase and explanation before advancing after a wrong idiom answer", async () => {
    vi.useFakeTimers();
    const onAnswer = renderQuizCard();

    chooseWords(["late", "better", "than", "never"]);

    act(() => {
      vi.advanceTimersByTime(1600);
    });

    expect(screen.getByText("Good try! The correct phrase is:")).toBeInTheDocument();
    expect(screen.getByText("better late than never")).toBeInTheDocument();
    expect(screen.getByText(idiomQuestion.explanation)).toBeInTheDocument();
    expect(onAnswer).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(3999);
    });
    expect(onAnswer).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onAnswer).toHaveBeenCalledWith(false);
  });

  it("keeps correct idiom feedback brief and advances normally", async () => {
    vi.useFakeTimers();
    const onAnswer = renderQuizCard();

    chooseWords(["better", "late", "than", "never"]);

    act(() => {
      vi.advanceTimersByTime(1600);
    });

    expect(screen.getByText("Correct!")).toBeInTheDocument();
    expect(screen.queryByText("Good try! The correct phrase is:")).not.toBeInTheDocument();
    expect(screen.queryByText(idiomQuestion.explanation)).not.toBeInTheDocument();
    expect(onAnswer).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(onAnswer).toHaveBeenCalledWith(true);
  });
});
