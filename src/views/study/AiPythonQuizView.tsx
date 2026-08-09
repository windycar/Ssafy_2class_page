import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cloud,
  CloudOff,
  Lightbulb,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import {
  AI_PYTHON_CATEGORY_META,
  AI_PYTHON_QUESTION_BANK,
  getAiPythonQuestion,
} from "../../data/questionBanks/aiPythonQuestionBank";
import { useAiPythonStudyProgress } from "../../hooks/useAiPythonStudyProgress";
import { useAuth } from "../../hooks/useAuth";
import { shuffleArray } from "../../utils/shuffleArray";
import type { AiPythonCategory, AiPythonQuestion } from "../../types/aiPythonStudy";

const ANSWER_LABELS = ["A", "B", "C", "D"];
const CATEGORIES: AiPythonCategory[] = [
  "python",
  "api",
  "numpy",
  "pandas",
  "matplotlib_eda",
];

function parseCategories(value: string | null): AiPythonCategory[] {
  if (!value) return CATEGORIES;
  const values = value.split(",");
  const validCategories = new Set<AiPythonCategory>(CATEGORIES);
  if (
    values.length === 0 ||
    new Set(values).size !== values.length ||
    values.some((value) => !validCategories.has(value as AiPythonCategory))
  ) {
    return CATEGORIES;
  }
  return values as AiPythonCategory[];
}

type SessionAnswer = {
  selectedAnswer: number;
  correct: boolean;
};

type QuizSession = {
  key: string;
  questions: AiPythonQuestion[];
};

export default function AiPythonQuizView() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { progress, recordAnswer, syncState } = useAiPythonStudyProgress();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const run = searchParams.get("run") ?? "0";
  const categoryParam = searchParams.get("categories");
  const selectedCategories = useMemo(() => parseCategories(categoryParam), [categoryParam]);
  const selectedCategoryKey = selectedCategories.join(",");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, SessionAnswer>>({});
  const [hintOpen, setHintOpen] = useState(false);
  const [finished, setFinished] = useState(false);
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const sessionKey = `${currentUser?.id ?? "guest"}:${mode ?? "standard"}:${run}:${
    mode === "all" || mode === "wrong" ? "all-categories" : selectedCategoryKey
  }`;
  const sessionReady = quizSession?.key === sessionKey;
  const questions = sessionReady ? quizSession.questions : [];
  const completedQuestionIds = useMemo(
    () => new Set(progress.attempts.map((attempt) => attempt.questionId)),
    [progress.attempts],
  );

  const startMode = (nextMode: "all" | "wrong") => {
    navigate(`/study/ai-python/quiz?mode=${nextMode}&run=${Date.now()}`);
  };

  useEffect(() => {
    if (quizSession?.key === sessionKey || syncState === "loading") return;

    let nextQuestions: AiPythonQuestion[];

    if (mode === "wrong") {
      const latestAttempts = new Map<string, (typeof progress.attempts)[number]>();
      [...progress.attempts].reverse().forEach((attempt) => {
        if (!latestAttempts.has(attempt.questionId)) {
          latestAttempts.set(attempt.questionId, attempt);
        }
      });
      nextQuestions = [...latestAttempts.values()]
        .filter((attempt) => !attempt.correct)
        .map((attempt) => getAiPythonQuestion(attempt.questionId))
        .filter((question): question is AiPythonQuestion => Boolean(question));
    } else if (mode === "all") {
      nextQuestions = AI_PYTHON_QUESTION_BANK;
    } else {
      nextQuestions = AI_PYTHON_QUESTION_BANK.filter(
        (question) =>
          selectedCategories.includes(question.category) &&
          !completedQuestionIds.has(question.id),
      );
    }

    setCurrentIndex(0);
    setAnswers({});
    setHintOpen(false);
    setFinished(false);
    setQuizSession({
      key: sessionKey,
      questions: shuffleArray(nextQuestions),
    });
  }, [
    completedQuestionIds,
    mode,
    progress.attempts,
    quizSession?.key,
    selectedCategories,
    sessionKey,
    syncState,
  ]);

  if (!sessionReady) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-violet-700" />
          <p className="mt-3 text-sm font-bold text-slate-500">
            저장된 풀이 기록을 불러오는 중입니다.
          </p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="space-y-5 pb-8">
        <BackToStudy />
        <section className="rounded-[2rem] border border-violet-100 bg-white px-6 py-16 text-center shadow-sm">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="mt-5 text-2xl font-black text-slate-900">
            {mode === "wrong"
              ? "다시 풀 오답이 없습니다."
              : mode === "all"
                ? "출제할 문제가 없습니다."
                : "선택한 범위의 문제를 모두 풀었습니다."}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            전체 문제를 다시 풀거나 오답만 골라 복습할 수 있습니다.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/study/ai-python")}
              className="rounded-xl border border-violet-100 bg-violet-50 px-5 py-3 text-sm font-extrabold text-violet-700"
            >
              출제 범위 다시 고르기
            </button>
            <button
              type="button"
              onClick={() => startMode("all")}
              className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-extrabold text-white"
            >
              전체 다시 풀기
            </button>
            <button
              type="button"
              onClick={() => startMode("wrong")}
              className="rounded-xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-extrabold text-red-700"
            >
              오답 다시 풀기
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (finished) {
    const sessionAnswers = Object.values(answers);
    const correctCount = sessionAnswers.filter((answer) => answer.correct).length;
    const accuracy = sessionAnswers.length
      ? Math.round((correctCount / sessionAnswers.length) * 100)
      : 0;

    return (
      <div className="space-y-5 pb-8">
        <BackToStudy />
        <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(125deg,#25104f,#5b21b6_58%,#2563eb)] px-6 py-14 text-center text-white shadow-[0_22px_55px_rgba(91,33,182,0.24)]">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border-[34px] border-white/[0.06]" />
          <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <Sparkles className="h-8 w-8 text-amber-300" />
          </span>
          <p className="relative mt-5 text-xs font-black tracking-[0.16em] text-violet-200">
            SESSION COMPLETE
          </p>
          <h1 className="relative mt-2 text-3xl font-black">문제 풀이를 완료했습니다.</h1>
          <p className="relative mt-4 text-lg font-extrabold text-violet-100">
            {sessionAnswers.length}문제 중 {correctCount}문제 정답 · {accuracy}%
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/study/ai-python")}
              className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-violet-800"
            >
              출제 범위 다시 고르기
            </button>
            <button
              type="button"
              onClick={() => startMode("wrong")}
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-extrabold text-white"
            >
              오답 다시 풀기
            </button>
            <button
              type="button"
              onClick={() => startMode("all")}
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-extrabold text-white"
            >
              전체 다시 풀기
            </button>
          </div>
        </section>
      </div>
    );
  }

  const current = questions[currentIndex];
  const sessionAnswer = answers[current.id];
  const answered = Boolean(sessionAnswer);
  const category = AI_PYTHON_CATEGORY_META[current.category];
  const isLast = currentIndex === questions.length - 1;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const submitChoice = (selectedAnswer: number) => {
    if (answered) return;
    const correct = recordAnswer(current, selectedAnswer);
    setAnswers((previous) => ({
      ...previous,
      [current.id]: { selectedAnswer, correct },
    }));
  };

  const goNext = () => {
    if (!answered) return;
    if (isLast) {
      setFinished(true);
      return;
    }
    setCurrentIndex((index) => index + 1);
    setHintOpen(false);
  };

  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BackToStudy />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-500 shadow-sm">
          {syncState === "synced" ? (
            <Cloud className="h-3.5 w-3.5 text-emerald-600" />
          ) : syncState === "loading" ? (
            <LoaderCircle className="h-3.5 w-3.5 animate-spin text-violet-600" />
          ) : (
            <CloudOff className="h-3.5 w-3.5 text-amber-600" />
          )}
          {syncState === "synced"
            ? "풀이 저장됨"
            : syncState === "loading"
              ? "저장 중"
              : "로컬 저장"}
        </span>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <header className="bg-[linear-gradient(125deg,#25104f,#5b21b6_62%,#2563eb)] px-5 py-5 text-white sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <BrainCircuit className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-black tracking-[0.14em] text-violet-200">
                  AI PYTHON BASICS · 100 QUESTIONS
                </p>
                <p className="text-sm font-black">
                  {mode === "wrong" ? "오답 다시 풀기" : mode === "all" ? "전체 다시 풀기" : "이어 풀기"}
                  <span className="ml-2 font-semibold text-violet-100/70">
                    {currentIndex + 1} / {questions.length}
                  </span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-violet-200">누적 완료</p>
              <p className="text-sm font-black">
                {Math.min(completedQuestionIds.size, AI_PYTHON_QUESTION_BANK.length)} / 100
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-amber-300 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </header>

        <div className="px-5 py-7 sm:px-8 sm:py-9">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-black"
              style={{ backgroundColor: `${category.color}14`, color: category.color }}
            >
              {category.label}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500">
              객관식
            </span>
          </div>

          <h1 className="mt-5 whitespace-pre-line text-xl font-black leading-8 text-slate-900 sm:text-2xl sm:leading-9">
            {current.prompt}
          </h1>
          {current.code ? (
            <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-cyan-100">
              <code>{current.code}</code>
            </pre>
          ) : null}

          <div className="mt-7 grid gap-3">
            {current.options.map((option, optionIndex) => {
              const selected = sessionAnswer?.selectedAnswer === optionIndex;
              const correctOption = answered && current.answer === optionIndex;
              const wrongOption = answered && selected && !sessionAnswer.correct;
              return (
                <button
                  key={`${current.id}-${optionIndex}`}
                  type="button"
                  onClick={() => submitChoice(optionIndex)}
                  disabled={answered}
                  className={`flex items-start gap-3 rounded-2xl border-2 px-4 py-4 text-left transition sm:px-5 ${
                    correctOption
                      ? "border-emerald-400 bg-emerald-50"
                      : wrongOption
                        ? "border-red-300 bg-red-50"
                        : "border-slate-100 bg-white hover:border-violet-200 hover:bg-violet-50/40 disabled:hover:border-slate-100"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                      correctOption
                        ? "bg-emerald-600 text-white"
                        : wrongOption
                          ? "bg-red-500 text-white"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {correctOption ? (
                      <Check className="h-4 w-4" />
                    ) : wrongOption ? (
                      <X className="h-4 w-4" />
                    ) : (
                      ANSWER_LABELS[optionIndex]
                    )}
                  </span>
                  <span className="pt-1 text-sm font-bold leading-6 text-slate-700">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {answered ? (
            <div
              className={`mt-6 rounded-2xl border p-5 ${
                sessionAnswer.correct
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start gap-3">
                {sessionAnswer.correct ? (
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                ) : (
                  <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-500" />
                )}
                <div>
                  <p
                    className={`font-black ${
                      sessionAnswer.correct ? "text-emerald-900" : "text-red-900"
                    }`}
                  >
                    {sessionAnswer.correct ? "정답입니다." : "복습이 필요한 문제입니다."}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {current.explanation}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setHintOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-extrabold text-amber-700 hover:bg-amber-100"
              >
                <Lightbulb className="h-4 w-4" /> 힌트
                {hintOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {hintOpen ? (
                <p className="mt-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-amber-900">
                  {current.hint}
                </p>
              ) : null}
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => {
              setCurrentIndex((index) => Math.max(0, index - 1));
              setHintOpen(false);
            }}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 disabled:opacity-35"
          >
            <ArrowLeft className="h-4 w-4" /> 뒤로
          </button>
          <span className="hidden text-xs font-bold text-slate-400 sm:block">
            답변 {Object.keys(answers).length} / {questions.length}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={!answered}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-35"
          >
            {isLast ? "결과 보기" : "다음"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </footer>
      </section>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => startMode("all")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-violet-700"
        >
          <RotateCcw className="h-3.5 w-3.5" /> 전체 100문제 다시 풀기
        </button>
      </div>
    </div>
  );
}

function BackToStudy() {
  return (
    <Link
      to="/study/ai-python"
      className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-violet-700"
    >
      <ArrowLeft className="h-4 w-4" /> AI Python 출제 범위
    </Link>
  );
}
