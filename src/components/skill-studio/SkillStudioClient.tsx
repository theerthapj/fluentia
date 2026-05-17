"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  Briefcase,
  CheckCircle2,
  Coffee,
  Gauge,
  Mic,
  PenLine,
  Shuffle,
  Sparkles,
  SpellCheck2,
  Wand2,
} from "lucide-react";
import { LevelBadge } from "@/components/assessment/LevelBadge";
import { VoiceSimButton } from "@/components/chat/VoiceSimButton";
import { FluviCharacter } from "@/components/fluvi/FluviCharacter";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";
import { hasCompletedAssessment } from "@/lib/assessment-state";
import { getPronunciationExercisesForLevel } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  analyzeGrammar,
  analyzePronunciation,
  analyzeSentenceFormation,
  analyzeVocabulary,
  getSentenceChallenge,
  getVocabularyWord,
  levelFromProgress,
  levelLabels,
  skillModeLabels,
  skillModeOrder,
  type GrammarAnalysis,
  type PronunciationAnalysis,
  type SentenceChallenge,
  type SentenceFormationAnalysis,
  type VocabularyAnalysis,
} from "@/lib/skill-studio";
import type { Mode, SkillPracticeMode } from "@/types";

const skillCards: Array<{
  id: SkillPracticeMode;
  title: string;
  description: string;
  Icon: typeof Mic;
  gradient: string;
  ring: string;
}> = [
  {
    id: "pronunciation",
    title: "Pronunciation",
    description: "Speak lines and refine clarity, stress, tone, and accuracy.",
    Icon: Mic,
    gradient: "from-teal-400 to-sky-400",
    ring: "border-teal-300/30 bg-teal-400/10",
  },
  {
    id: "vocabulary",
    title: "Vocabulary",
    description: "Learn richer words and upgrade plain sentences.",
    Icon: BookOpenText,
    gradient: "from-emerald-300 to-lime-300",
    ring: "border-emerald-300/30 bg-emerald-400/10",
  },
  {
    id: "grammar",
    title: "Grammar",
    description: "Correct grammar, punctuation, spelling, and tone.",
    Icon: SpellCheck2,
    gradient: "from-blue-400 to-indigo-300",
    ring: "border-blue-300/30 bg-blue-400/10",
  },
  {
    id: "sentence-formation",
    title: "Sentence Formation",
    description: "Build clear sentences from your words or jumbled prompts.",
    Icon: PenLine,
    gradient: "from-amber-300 to-rose-300",
    ring: "border-amber-300/30 bg-amber-300/10",
  },
];

const conversationOptions = [
  { id: "formal", title: "Formal", description: "Interviews, presentations, client calls, workplace meetings", Icon: Briefcase },
  { id: "casual", title: "Casual", description: "Friends, travel, shopping, everyday conversations", Icon: Coffee },
];

function scoreLabel(score: number) {
  if (score >= 85) return "Strong";
  if (score >= 70) return "Steady";
  if (score >= 50) return "Building";
  return "Needs focus";
}

function ScoreMeter({ score, label }: { score: number; label: string }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-text-secondary">
        <span>{label}</span>
        <span className="text-text-primary">{Math.round(score)}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary" style={{ width: `${Math.max(4, Math.min(100, score))}%` }} />
      </div>
    </div>
  );
}

function EmptyHint({ mode }: { mode: SkillPracticeMode }) {
  const copy: Record<SkillPracticeMode, string> = {
    pronunciation: "Speak or type the line above. Fluvi will compare your transcript with the target words.",
    vocabulary: "Write a sentence with the focus word, or paste a sentence you want to make more expressive.",
    grammar: "Paste a sentence and Fluvi will clean grammar, punctuation, spelling, and tone.",
    "sentence-formation": "Load the jumbled challenge or write your own sentence idea to shape it properly.",
  };

  return (
    <div className="rounded-2xl border border-dashed border-border bg-white/[0.03] p-5 text-sm leading-6 text-text-secondary">
      {copy[mode]}
    </div>
  );
}

function ProgressPill({ mode, score }: { mode: SkillPracticeMode; score: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-text-secondary">
      <span className="text-text-primary">{skillModeLabels[mode]}</span>
      {Math.round(score)} avg
    </span>
  );
}

function SkillModeButton({
  mode,
  active,
  average,
  attempts,
  onClick,
}: {
  mode: (typeof skillCards)[number];
  active: boolean;
  average: number;
  attempts: number;
  onClick: () => void;
}) {
  const Icon = mode.Icon;
  return (
    <button
      id={`skill-mode-${mode.id}`}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group min-h-48 rounded-2xl border p-5 text-left shadow-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/70",
        active ? `${mode.ring} border-white/25` : "border-border bg-white/[0.045] hover:border-white/20 hover:bg-white/[0.07]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className={cn("grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br text-bg-primary", mode.gradient)}>
          <Icon aria-hidden className="h-6 w-6" />
        </span>
        <span className="rounded-full border border-white/10 bg-bg-primary/40 px-3 py-1 text-xs font-semibold text-text-secondary">
          {attempts ? `${Math.round(average)} avg` : "New"}
        </span>
      </div>
      <h2 className="mt-5 text-xl font-bold text-text-primary">{mode.title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{mode.description}</p>
      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-accent-primary">
        Open mode
        <ArrowRight aria-hidden className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </button>
  );
}

function FluviGuide({
  activeMode,
  difficulty,
  weakAreas,
  revisionQueue,
}: {
  activeMode: SkillPracticeMode;
  difficulty: string;
  weakAreas: string[];
  revisionQueue: string[];
}) {
  return (
    <aside className="rounded-2xl border border-border bg-white/[0.045] p-5">
      <div className="flex items-center gap-4">
        <FluviCharacter size={86} className="shrink-0" />
        <div>
          <p className="text-sm font-semibold text-accent-primary">Fluvi guide</p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Focus on one skill: {skillModeLabels[activeMode].toLowerCase()}. Difficulty is set to {difficulty.toLowerCase()}.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-xl border border-border bg-bg-primary/35 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">Smart revision</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(revisionQueue.length ? revisionQueue : weakAreas).slice(0, 5).map((item) => (
              <span key={item} className="rounded-full bg-accent-primary/12 px-3 py-1 text-xs font-semibold text-accent-primary">
                {item}
              </span>
            ))}
            {!revisionQueue.length && !weakAreas.length ? (
              <span className="text-sm text-text-secondary">Complete a check to unlock weak-area revision.</span>
            ) : null}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-bg-primary/35 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">Adaptive learning</p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Scores above 70 build a streak. Higher averages raise the next activity level; weak scores keep the next task gentler.
          </p>
        </div>
      </div>
    </aside>
  );
}

function AnalysisShell({
  mode,
  analysis,
}: {
  mode: SkillPracticeMode;
  analysis: PronunciationAnalysis | VocabularyAnalysis | GrammarAnalysis | SentenceFormationAnalysis | null;
}) {
  if (!analysis) return <EmptyHint mode={mode} />;

  return (
    <div className="rounded-2xl border border-border bg-bg-primary/35 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-accent-primary">Live feedback</p>
          <h3 className="mt-1 text-xl font-bold text-text-primary">{scoreLabel(analysis.score)}: {analysis.summary}</h3>
        </div>
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full border border-accent-primary/30 bg-accent-primary/10 text-xl font-black text-accent-primary">
          {Math.round(analysis.score)}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-text-primary">Strengths</p>
          <ul className="mt-2 grid gap-2 text-sm leading-6 text-text-secondary">
            {analysis.strengths.map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">Next improvements</p>
          <ul className="mt-2 grid gap-2 text-sm leading-6 text-text-secondary">
            {analysis.improvements.map((item) => (
              <li key={item} className="flex gap-2">
                <Sparkles aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PronunciationPanel({
  value,
  onChange,
  analysis,
  onAnalyze,
}: {
  value: string;
  onChange: (value: string) => void;
  analysis: PronunciationAnalysis | null;
  onAnalyze: () => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-teal-300/20 bg-teal-400/10 p-5">
          <p className="text-sm font-semibold text-teal-200">Speak the target line</p>
          <p className="mt-3 text-xl font-semibold leading-8 text-text-primary">{analysis?.revisionItems?.length ? "Repeat once more with the highlighted words." : "Use the voice button or type your spoken transcript."}</p>
        </div>
        <textarea
          id="skill-pronunciation-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          className="min-h-36 w-full resize-none rounded-2xl border border-border bg-bg-primary/50 p-4 text-text-primary outline-none transition placeholder:text-text-secondary/45 focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/20"
          placeholder="Your spoken transcript appears here, or type what you said..."
        />
        <div className="flex flex-wrap items-center gap-3">
          <VoiceSimButton id="skill-pronunciation-voice" onCapture={onChange} />
          <Button id="skill-pronunciation-analyze" onClick={onAnalyze} disabled={!value.trim()}>
            Analyze Pronunciation
            <Gauge aria-hidden className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <AnalysisShell mode="pronunciation" analysis={analysis} />
        {analysis ? (
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <ScoreMeter label="British English" score={analysis.britishScore} />
              <ScoreMeter label="Indian English" score={analysis.indianScore} />
              <ScoreMeter label="Clarity" score={analysis.clarity} />
              <ScoreMeter label="Stress" score={analysis.stress} />
              <ScoreMeter label="Tone" score={analysis.tone} />
              <ScoreMeter label="Accuracy" score={analysis.accuracy} />
            </div>
            <div className="rounded-2xl border border-border bg-white/[0.035] p-4">
              <p className="text-sm font-semibold text-text-primary">Words to repeat</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.highlightedWords.length ? analysis.highlightedWords.map((word) => (
                  <span key={word} className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-sm font-semibold text-warning">
                    {word}
                  </span>
                )) : <span className="text-sm text-text-secondary">No target-word gaps detected.</span>}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-white/[0.035] p-4">
                <p className="text-sm font-semibold text-text-primary">British English tips</p>
                <ul className="mt-2 grid gap-2 text-sm leading-6 text-text-secondary">
                  {analysis.britishTips.map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-white/[0.035] p-4">
                <p className="text-sm font-semibold text-text-primary">Indian English tips</p>
                <ul className="mt-2 grid gap-2 text-sm leading-6 text-text-secondary">
                  {analysis.indianEnglishTips.map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function VocabularyPanel({
  value,
  onChange,
  analysis,
  onAnalyze,
}: {
  value: string;
  onChange: (value: string) => void;
  analysis: VocabularyAnalysis | null;
  onAnalyze: () => void;
}) {
  const focusWord = analysis?.focusWord;

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1fr]">
      <div className="space-y-5">
        {focusWord ? (
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-5">
            <p className="text-sm font-semibold text-emerald-200">Word focus</p>
            <h3 className="mt-2 text-3xl font-black text-text-primary">{focusWord.word}</h3>
            <p className="mt-3 leading-7 text-text-secondary">{focusWord.meaning}</p>
            <div className="mt-4 grid gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">Synonyms</p>
                <p className="mt-1 text-sm text-text-primary">{focusWord.synonyms.join(", ")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">Antonyms</p>
                <p className="mt-1 text-sm text-text-primary">{focusWord.antonyms.join(", ")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange(focusWord.example)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/10"
            >
              Use example
              <ArrowRight aria-hidden className="h-4 w-4" />
            </button>
          </div>
        ) : null}
        <textarea
          id="skill-vocabulary-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={6}
          className="min-h-40 w-full resize-none rounded-2xl border border-border bg-bg-primary/50 p-4 text-text-primary outline-none transition placeholder:text-text-secondary/45 focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/20"
          placeholder="Write a sentence you want to express better..."
        />
        <Button id="skill-vocabulary-analyze" onClick={onAnalyze} disabled={!value.trim()}>
          Improve Vocabulary
          <Wand2 aria-hidden className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <AnalysisShell mode="vocabulary" analysis={analysis} />
        {analysis ? (
          <div className="grid gap-4">
            <div className="rounded-2xl border border-border bg-white/[0.035] p-4">
              <p className="text-sm font-semibold text-text-primary">More expressive version</p>
              <p className="mt-2 leading-7 text-text-secondary">{analysis.exampleRewrite}</p>
            </div>
            <div className="grid gap-3">
              {analysis.upgrades.slice(0, 4).map((upgrade) => (
                <div key={`${upgrade.original}-${upgrade.advanced}`} className="rounded-2xl border border-border bg-white/[0.035] p-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                    <span className="text-text-secondary">{upgrade.original}</span>
                    <ArrowRight aria-hidden className="h-4 w-4 text-accent-primary" />
                    <span className="text-text-primary">{upgrade.replacement}</span>
                    <ArrowRight aria-hidden className="h-4 w-4 text-accent-primary" />
                    <span className="text-accent-primary">{upgrade.advanced}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{upgrade.reason}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function GrammarPanel({
  value,
  onChange,
  analysis,
  onAnalyze,
}: {
  value: string;
  onChange: (value: string) => void;
  analysis: GrammarAnalysis | null;
  onAnalyze: () => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-blue-300/20 bg-blue-400/10 p-5">
          <p className="text-sm font-semibold text-blue-200">Grammar repair</p>
          <p className="mt-2 leading-7 text-text-secondary">
            Paste one sentence. Fluvi will correct grammar, punctuation, spelling, and tone, then explain the rule in plain language.
          </p>
        </div>
        <textarea
          id="skill-grammar-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={8}
          className="min-h-52 w-full resize-none rounded-2xl border border-border bg-bg-primary/50 p-4 text-text-primary outline-none transition placeholder:text-text-secondary/45 focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/20"
          placeholder="Example: she go to office everyday and dont speak confident"
        />
        <div className="flex flex-wrap gap-3">
          <Button id="skill-grammar-analyze" onClick={onAnalyze} disabled={!value.trim()}>
            Correct Grammar
            <SpellCheck2 aria-hidden className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={() => onChange("she go to office everyday and dont speak confident")}>
            Try sample
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <AnalysisShell mode="grammar" analysis={analysis} />
        {analysis ? (
          <div className="grid gap-4">
            <div className="rounded-2xl border border-border bg-white/[0.035] p-4">
              <p className="text-sm font-semibold text-text-primary">Corrected sentence</p>
              <p className="mt-2 leading-7 text-text-secondary">{analysis.corrected}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white/[0.035] p-4">
              <p className="text-sm font-semibold text-text-primary">Enhanced tone</p>
              <p className="mt-2 leading-7 text-text-secondary">{analysis.enhanced}</p>
            </div>
            <div className="grid gap-3">
              {analysis.rules.map((rule) => (
                <div key={rule.title} className="rounded-2xl border border-border bg-white/[0.035] p-4">
                  <p className="text-sm font-bold text-accent-primary">{rule.title}</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{rule.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SentenceFormationPanel({
  value,
  onChange,
  analysis,
  onAnalyze,
  challengeWords,
  onLoadChallenge,
  onShuffleChallenge,
}: {
  value: string;
  onChange: (value: string) => void;
  analysis: SentenceFormationAnalysis | null;
  onAnalyze: () => void;
  challengeWords: string[];
  onLoadChallenge: () => void;
  onShuffleChallenge: () => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1fr]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 p-5">
          <p className="text-sm font-semibold text-amber-200">Jumbled words</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {challengeWords.map((word, index) => (
              <span key={`${word}-${index}`} className="rounded-full border border-amber-200/30 bg-bg-primary/35 px-3 py-1.5 text-sm font-semibold text-text-primary">
                {word}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button size="sm" onClick={onLoadChallenge}>
              Load challenge
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" onClick={onShuffleChallenge}>
              Shuffle
              <Shuffle aria-hidden className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <textarea
          id="skill-sentence-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={7}
          className="min-h-48 w-full resize-none rounded-2xl border border-border bg-bg-primary/50 p-4 text-text-primary outline-none transition placeholder:text-text-secondary/45 focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/20"
          placeholder="Build the sentence here, or write your own rough sentence..."
        />
        <Button id="skill-sentence-analyze" onClick={onAnalyze} disabled={!value.trim()}>
          Check Sentence
          <PenLine aria-hidden className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <AnalysisShell mode="sentence-formation" analysis={analysis} />
        {analysis ? (
          <div className="grid gap-4">
            <div className="rounded-2xl border border-border bg-white/[0.035] p-4">
              <p className="text-sm font-semibold text-text-primary">Clean sentence</p>
              <p className="mt-2 leading-7 text-text-secondary">{analysis.corrected}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white/[0.035] p-4">
              <p className="text-sm font-semibold text-text-primary">Professional version</p>
              <p className="mt-2 leading-7 text-text-secondary">{analysis.professionalVersion}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {analysis.structure.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-white/[0.035] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-text-primary">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-border bg-white/[0.035] p-4">
              <p className="text-sm font-semibold text-text-primary">Sentence-building tips</p>
              <ul className="mt-2 grid gap-2 text-sm leading-6 text-text-secondary">
                {analysis.tips.map((tip) => <li key={tip}>{tip}</li>)}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function SkillStudioClient() {
  const router = useRouter();
  const { state, hydrated, setConversationKind, setMode, updateSkillProgress } = useAppState();
  const [activeMode, setActiveMode] = useState<SkillPracticeMode>("pronunciation");
  const [pronunciationText, setPronunciationText] = useState("");
  const [vocabularyText, setVocabularyText] = useState("");
  const [grammarText, setGrammarText] = useState("");
  const [sentenceText, setSentenceText] = useState("");
  const [sentenceShuffleOffset, setSentenceShuffleOffset] = useState(0);
  const [sentenceUsesChallenge, setSentenceUsesChallenge] = useState(false);
  const [lockedSentenceChallenge, setLockedSentenceChallenge] = useState<SentenceChallenge | null>(null);

  const activeProgress = state.skillProgress?.[activeMode];
  const activeLevel = levelFromProgress(state.level, activeProgress);
  const pronunciationExercise = useMemo(() => {
    const exercises = getPronunciationExercisesForLevel(activeLevel);
    return exercises[(state.skillProgress.pronunciation?.attempts ?? 0) % exercises.length] ?? exercises[0];
  }, [activeLevel, state.skillProgress.pronunciation?.attempts]);
  const vocabularyWord = useMemo(
    () => getVocabularyWord(activeLevel, state.skillProgress.vocabulary?.attempts ?? 0),
    [activeLevel, state.skillProgress.vocabulary?.attempts],
  );
  const sentenceChallenge = useMemo(
    () => getSentenceChallenge(activeLevel, state.skillProgress["sentence-formation"]?.attempts ?? 0),
    [activeLevel, state.skillProgress],
  );
  const displayedSentenceChallenge = lockedSentenceChallenge ?? sentenceChallenge;

  const shuffledChallengeWords = useMemo(() => {
    const words = [...displayedSentenceChallenge.jumbled];
    if (!sentenceShuffleOffset) return words;
    return words.map((_, index) => words[(index + sentenceShuffleOffset) % words.length]);
  }, [displayedSentenceChallenge.jumbled, sentenceShuffleOffset]);

  const pronunciationAnalysis = useMemo(
    () => (pronunciationText.trim() ? analyzePronunciation(pronunciationText, pronunciationExercise) : null),
    [pronunciationExercise, pronunciationText],
  );
  const vocabularyAnalysis = useMemo(
    () => (vocabularyText.trim() ? analyzeVocabulary(vocabularyText, vocabularyWord) : analyzeVocabulary("", vocabularyWord)),
    [vocabularyText, vocabularyWord],
  );
  const grammarAnalysis = useMemo(
    () => (grammarText.trim() ? analyzeGrammar(grammarText) : null),
    [grammarText],
  );
  const sentenceAnalysis = useMemo(
    () => (sentenceText.trim() ? analyzeSentenceFormation(sentenceText, sentenceUsesChallenge ? displayedSentenceChallenge : undefined) : null),
    [displayedSentenceChallenge, sentenceText, sentenceUsesChallenge],
  );

  if (!hydrated) {
    return (
      <main className="mesh-gradient min-h-screen px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <GlassCard className="p-6 sm:p-8">
            <div className="h-10 w-2/3 rounded-2xl bg-white/10" />
            <div className="mt-5 h-4 w-full rounded-full bg-white/10" />
            <div className="mt-3 h-4 w-3/4 rounded-full bg-white/10" />
          </GlassCard>
        </div>
      </main>
    );
  }

  if (!hasCompletedAssessment(state)) {
    return (
      <main className="mesh-gradient min-h-screen px-5 py-10">
        <div className="mx-auto max-w-3xl">
          <GlassCard className="p-7 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-primary">Skill Studio Locked</p>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Complete your assessment first.</h1>
            <p className="mt-4 leading-7 text-text-secondary">
              Fluentia uses your level to set pronunciation prompts, word difficulty, grammar coaching, and sentence-building tasks.
            </p>
            <Button id="mode-locked-assessment" className="mt-7 w-full sm:w-auto" size="lg" onClick={() => router.push("/assessment")}>
              Take Assessment
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Button>
          </GlassCard>
        </div>
      </main>
    );
  }

  const chooseConversation = (id: string) => {
    setMode(id as Mode);
    setConversationKind("scenario");
    router.push("/scenarios");
  };

  const handleRecordedAttempt = (
    mode: SkillPracticeMode,
    analysis: PronunciationAnalysis | VocabularyAnalysis | GrammarAnalysis | SentenceFormationAnalysis | null,
  ) => {
    if (!analysis) return;
    updateSkillProgress(mode, {
      score: analysis.score,
      weakAreas: analysis.weakAreas,
      revisionItems: analysis.revisionItems,
    });
  };

  const progressValues = skillModeOrder.map((mode) => state.skillProgress[mode]);
  const weakAreas = activeProgress?.weakAreas ?? [];
  const revisionQueue = activeProgress?.revisionQueue ?? [];

  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb current="Skill Studio" />

        <section className="grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-accent-primary/30 bg-accent-primary/10 px-4 py-1.5 text-sm font-semibold text-accent-primary">
                Focused English growth
              </span>
              {state.level ? <LevelBadge level={state.level} /> : null}
            </div>
            <h1 className="mt-5 text-4xl font-black text-text-primary sm:text-5xl">
              Skill <span className="gradient-text">Studio</span>
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-text-secondary">
              Choose one English skill at a time, get immediate coaching, and track progress separately for pronunciation, vocabulary, grammar, and sentence formation.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white/[0.045] p-5">
            <p className="text-sm font-semibold text-text-primary">Skill progress</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {progressValues.map((progress) => (
                <ProgressPill key={progress.skill} mode={progress.skill} score={progress.averageScore} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {skillCards.map((mode) => {
            const progress = state.skillProgress[mode.id];
            return (
              <SkillModeButton
                key={mode.id}
                mode={mode}
                active={activeMode === mode.id}
                average={progress.averageScore}
                attempts={progress.attempts}
                onClick={() => setActiveMode(mode.id)}
              />
            );
          })}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px]">
          <GlassCard className="overflow-hidden p-0">
            <div className="border-b border-border bg-white/[0.035] p-5 sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-primary">{skillModeLabels[activeMode]}</p>
                  <h2 className="mt-2 text-2xl font-bold text-text-primary">Practice {skillModeLabels[activeMode].toLowerCase()} with focused feedback</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-border bg-bg-primary/40 px-3 py-1.5 text-xs font-semibold text-text-secondary">
                    {levelLabels[activeLevel]} difficulty
                  </span>
                  <span className="rounded-full border border-border bg-bg-primary/40 px-3 py-1.5 text-xs font-semibold text-text-secondary">
                    {activeProgress?.attempts ?? 0} attempts
                  </span>
                  <span className="rounded-full border border-border bg-bg-primary/40 px-3 py-1.5 text-xs font-semibold text-text-secondary">
                    {activeProgress?.streak ?? 0} streak
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {activeMode === "pronunciation" ? (
                <>
                  <div className="mb-5 rounded-2xl border border-border bg-white/[0.035] p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{pronunciationExercise.title}</p>
                        <p className="mt-1 text-sm text-text-secondary">{pronunciationExercise.focus}</p>
                      </div>
                      <Link
                        href={`/chat?kind=pronunciation&exercise=${pronunciationExercise.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent-primary/50 hover:bg-accent-primary/10"
                      >
                        Open guided chat
                        <ArrowRight aria-hidden className="h-4 w-4" />
                      </Link>
                    </div>
                    <p className="mt-4 text-lg font-semibold leading-8 text-text-primary">{pronunciationExercise.prompt}</p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">{pronunciationExercise.coachNote}</p>
                  </div>
                  <PronunciationPanel
                    value={pronunciationText}
                    onChange={setPronunciationText}
                    analysis={pronunciationAnalysis}
                    onAnalyze={() => handleRecordedAttempt("pronunciation", pronunciationAnalysis)}
                  />
                </>
              ) : null}

              {activeMode === "vocabulary" ? (
                <VocabularyPanel
                  value={vocabularyText}
                  onChange={setVocabularyText}
                  analysis={vocabularyAnalysis}
                  onAnalyze={() => handleRecordedAttempt("vocabulary", vocabularyAnalysis)}
                />
              ) : null}

              {activeMode === "grammar" ? (
                <GrammarPanel
                  value={grammarText}
                  onChange={setGrammarText}
                  analysis={grammarAnalysis}
                  onAnalyze={() => handleRecordedAttempt("grammar", grammarAnalysis)}
                />
              ) : null}

              {activeMode === "sentence-formation" ? (
                <SentenceFormationPanel
                  value={sentenceText}
                  onChange={(nextValue) => {
                    setSentenceText(nextValue);
                    setSentenceUsesChallenge(false);
                    setLockedSentenceChallenge(null);
                  }}
                  analysis={sentenceAnalysis}
                  challengeWords={shuffledChallengeWords}
                  onAnalyze={() => handleRecordedAttempt("sentence-formation", sentenceAnalysis)}
                  onLoadChallenge={() => {
                    setLockedSentenceChallenge(displayedSentenceChallenge);
                    setSentenceText(shuffledChallengeWords.join(" "));
                    setSentenceUsesChallenge(true);
                  }}
                  onShuffleChallenge={() => {
                    setLockedSentenceChallenge(null);
                    setSentenceShuffleOffset((current) => (current + 1) % displayedSentenceChallenge.jumbled.length);
                    setSentenceUsesChallenge(false);
                  }}
                />
              ) : null}
            </div>
          </GlassCard>

          <FluviGuide
            activeMode={activeMode}
            difficulty={levelLabels[activeLevel]}
            weakAreas={weakAreas}
            revisionQueue={revisionQueue}
          />
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-white/[0.045] p-5 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-primary">Conversation scenarios</p>
              <h2 className="mt-2 text-2xl font-bold text-text-primary">Practice complete conversations</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Use this after skill drills when you want formal or casual speaking situations.
              </p>
            </div>
            <Button variant="secondary" onClick={() => router.push("/progress")}>
              View Progress
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {conversationOptions.map(({ id, title, description, Icon }) => (
              <motion.button
                key={id}
                id={`mode-${id}`}
                onClick={() => chooseConversation(id)}
                className="rounded-2xl border border-border bg-bg-primary/35 p-5 text-left transition hover:border-accent-primary/40 hover:bg-accent-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/70"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary text-bg-primary">
                  <Icon aria-hidden className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-xl font-bold text-text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
              </motion.button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
