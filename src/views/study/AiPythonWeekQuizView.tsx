import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Code2,
  Lightbulb,
  RotateCcw,
  Shuffle,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import katex from "katex";
import "katex/dist/katex.min.css";
import { ESSAY_MIN_LENGTH } from "../../constants/study";
import {
  AI_PYTHON_WEEK_META,
  AI_PYTHON_WEEK_QUESTION_BANKS,
  getAiPythonWeekCategories,
  getAiPythonWeekQuestion,
  isAiPythonWeek,
} from "../../data/questionBanks/aiPythonWeekQuestionBank";
import { useAuth } from "../../hooks/useAuth";
import { useAiPythonWeekProgress } from "../../hooks/useAiPythonWeekProgress";
import { gradeAiPythonWeekResponse } from "../../utils/aiPythonWeekGrading";
import { shuffleArray } from "../../utils/shuffleArray";
import { getLatestAttemptsByQuestion } from "../../utils/studyProgressStats";
import type {
  AiPythonWeekDifficulty,
  AiPythonWeekQuestion,
} from "../../types/aiPythonWeekStudy";

const DIFFICULTIES: AiPythonWeekDifficulty[] = ["easy", "medium", "hard"];
const ANSWER_LABELS = ["A", "B", "C", "D"];
const DIFFICULTY_LABELS: Record<AiPythonWeekDifficulty, string> = {
  easy: "초급",
  medium: "중급",
  hard: "고급",
};
const QUESTION_TYPE_LABELS = {
  "multiple-choice": "객관식",
  "short-answer": "단답형",
  essay: "서술형",
};

const MATH_SEGMENT_PATTERN = /(\$\$[\s\S]+?\$\$|\$[^$\r\n]+?\$)/g;

function MathText({ text }: { text: string }) {
  return (
    <>
      {text.split(MATH_SEGMENT_PATTERN).map((segment, index) => {
        const displayMode = segment.startsWith("$$") && segment.endsWith("$$");
        const inlineMode =
          !displayMode && segment.startsWith("$") && segment.endsWith("$");
        if (!displayMode && !inlineMode) return segment;

        const delimiterLength = displayMode ? 2 : 1;
        const expression = segment.slice(delimiterLength, -delimiterLength);
        const html = katex.renderToString(expression, {
          displayMode,
          throwOnError: false,
          strict: false,
          output: "htmlAndMathml",
        });
        return (
          <span
            key={`${index}-${expression}`}
            className={
              displayMode
                ? "my-2 block max-w-full overflow-x-auto py-1 text-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                : "inline-block max-w-full overflow-visible align-middle"
            }
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </>
  );
}

type SessionAnswer = {
  response: number | string;
  correct: boolean;
};

type QuizSession = {
  key: string;
  questions: AiPythonWeekQuestion[];
};

export default function AiPythonWeekQuizView() {
  const { week: weekParam } = useParams();
  const week = isAiPythonWeek(weekParam) ? weekParam : null;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { progress, recordAnswer, syncState } = useAiPythonWeekProgress();
  const rawDifficulty = searchParams.get("difficulty") as AiPythonWeekDifficulty | null;
  const difficulty = DIFFICULTIES.includes(rawDifficulty ?? "easy")
    ? (rawDifficulty ?? "easy")
    : "easy";
  const mode = searchParams.get("mode");
  const run = searchParams.get("run") ?? "0";
  const allCategories = useMemo(
    () => (week ? getAiPythonWeekCategories(week) : []),
    [week],
  );
  const selectedCategories = useMemo(() => {
    const raw = searchParams.get("categories");
    if (!raw) return allCategories;
    const parsed = raw
      .split(",")
      .filter((category) => allCategories.includes(category));
    return parsed.length ? [...new Set(parsed)] : allCategories;
  }, [allCategories, searchParams]);
  const categoryKey = [...selectedCategories].sort().join(",");
  const sessionKey = `${currentUser?.id ?? 0}:${week ?? "invalid"}:${difficulty}:${categoryKey}:${mode ?? "standard"}:${run}`;
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, SessionAnswer>>({});
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [hintOpen, setHintOpen] = useState(false);
  const [finished, setFinished] = useState(false);

  const completedQuestionIds = useMemo(
    () =>
      new Set(
        progress.attempts
          .filter((attempt) => attempt.week === week)
          .map((attempt) => attempt.questionId),
      ),
    [progress.attempts, week],
  );

  useEffect(() => {
    if (!week || session?.key === sessionKey || syncState === "loading") return;
    let questions: AiPythonWeekQuestion[];
    if (mode === "wrong") {
      questions = getLatestAttemptsByQuestion(
        progress.attempts.filter((attempt) => attempt.week === week),
      )
        .filter((attempt) => !attempt.correct)
        .map((attempt) => getAiPythonWeekQuestion(week, attempt.questionId))
        .filter((question): question is AiPythonWeekQuestion => Boolean(question));
    } else {
      const eligible = AI_PYTHON_WEEK_QUESTION_BANKS[week][difficulty].filter(
        (question) => selectedCategories.includes(question.category),
      );
      questions =
        mode === "all"
          ? eligible
          : eligible.filter((question) => !completedQuestionIds.has(question.id));
    }
    setSession({ key: sessionKey, questions: shuffleArray(questions) });
    setCurrentIndex(0);
    setAnswers({});
    setDraftAnswers({});
    setHintOpen(false);
    setFinished(false);
  }, [
    completedQuestionIds,
    difficulty,
    mode,
    progress.attempts,
    selectedCategories,
    session?.key,
    sessionKey,
    syncState,
    week,
  ]);

  if (!week) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
        <h1 className="text-2xl font-black text-slate-900">주차를 찾을 수 없습니다.</h1>
        <Link to="/study" className="mt-5 inline-flex font-bold text-violet-700">
          학습 과목으로 돌아가기
        </Link>
      </section>
    );
  }

  const meta = AI_PYTHON_WEEK_META[week];
  const sessionReady = session?.key === sessionKey;
  const questions = sessionReady ? session.questions : [];

  if (!sessionReady) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
        <p className="text-sm font-bold text-slate-500">문제를 준비하고 있습니다.</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="space-y-5 pb-8">
        <BackLink week={week} title={meta.title} />
        <section className="rounded-[2rem] border border-violet-100 bg-white px-6 py-16 text-center shadow-sm">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="mt-5 text-2xl font-black text-slate-900">
            {mode === "wrong"
              ? "복습할 오답이 없습니다."
              : "선택한 범위의 문제를 모두 풀었습니다."}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {mode === "wrong"
              ? "이 문제 세트의 최신 답안이 모두 정답입니다."
              : "전체 문제를 다시 풀거나 다른 난이도를 선택해 주세요."}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to={`/study/ai-python/${week}`}
              className="rounded-xl border border-violet-100 bg-violet-50 px-5 py-3 text-sm font-extrabold text-violet-700"
            >
              범위 다시 고르기
            </Link>
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/study/ai-python/${week}/quiz?difficulty=${difficulty}&mode=all&run=${Date.now()}`,
                )
              }
              className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-extrabold text-white"
            >
              전체 다시 풀기
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
        <BackLink week={week} title={meta.title} />
        <section
          className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${meta.gradient} px-6 py-14 text-center text-white shadow-[0_22px_55px_rgba(76,29,149,0.24)]`}
        >
          <CheckCircle2 className="mx-auto h-14 w-14" />
          <p className="mt-5 text-xs font-black tracking-[0.16em] text-white/70">
            {meta.weekLabel} · {mode === "wrong" ? "오답 복습" : DIFFICULTY_LABELS[difficulty]} 완료
          </p>
          <h1 className="mt-2 text-3xl font-black">문제 풀이를 마쳤습니다.</h1>
          <div className="mx-auto mt-7 grid max-w-xl grid-cols-3 gap-3">
            <ResultStat label="풀이" value={`${sessionAnswers.length}`} />
            <ResultStat label="정답" value={`${correctCount}`} />
            <ResultStat label="정답률" value={`${accuracy}%`} />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to={`/study/ai-python/${week}`}
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-extrabold text-white"
            >
              난이도·범위 선택
            </Link>
            <button
              type="button"
              onClick={() =>
                navigate(
                  mode === "wrong"
                    ? `/study/ai-python/${week}/quiz?mode=wrong&run=${Date.now()}`
                    : `/study/ai-python/${week}/quiz?difficulty=${difficulty}&mode=all&run=${Date.now()}`,
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-violet-800"
            >
              <RotateCcw className="h-4 w-4" /> {mode === "wrong" ? "남은 오답 풀기" : "다시 풀기"}
            </button>
          </div>
        </section>
      </div>
    );
  }

  const current = questions[currentIndex];
  const currentAnswer = answers[current.id];
  const answered = Boolean(currentAnswer);
  const currentDraft = draftAnswers[current.id] ?? "";
  const gradeDetails = currentAnswer
    ? gradeAiPythonWeekResponse(current, currentAnswer.response)
    : null;
  const correctCount = Object.values(answers).filter((answer) => answer.correct).length;
  const incorrectCount = Object.values(answers).length - correctCount;
  const isLast = currentIndex === questions.length - 1;

  const submitResponse = (response: number | string) => {
    if (answered) return;
    const correct = recordAnswer(week, current, response);
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [current.id]: { response, correct },
    }));
    setHintOpen(false);
  };

  const submitTextAnswer = () => {
    const response = currentDraft.trim();
    if (!response) return;
    if (
      current.questionType === "essay" &&
      response.length < (current.minLength ?? ESSAY_MIN_LENGTH)
    ) {
      toast.error(
        `서술형 답안은 ${current.minLength ?? ESSAY_MIN_LENGTH}자 미만으로 제출할 수 없습니다.`,
      );
      return;
    }
    submitResponse(response);
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
    <div className="mx-auto max-w-5xl pb-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <BackLink week={week} title={meta.title} />
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-600">
            <X className="mr-1 inline h-3.5 w-3.5" /> {incorrectCount}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
            <Check className="mr-1 inline h-3.5 w-3.5" /> {correctCount}
          </span>
        </div>
      </div>

      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(33,47,90,0.10)]">
        <header className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-8">
          <div className="flex items-center justify-between gap-4 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Shuffle className="h-3.5 w-3.5" /> {meta.weekLabel} ·{" "}
              {mode === "wrong" ? "전체 난이도 오답" : `${DIFFICULTY_LABELS[difficulty]} 랜덤`} · {currentIndex + 1} /{" "}
              {questions.length}
            </span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </header>

        <div className="p-5 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-violet-600 px-3 py-1 text-[11px] font-black text-white">
              {current.category}
            </span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-black text-indigo-700">
              {DIFFICULTY_LABELS[current.difficulty]}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-black text-amber-700">
              {QUESTION_TYPE_LABELS[current.questionType]}
            </span>
          </div>

          <h1 className="whitespace-pre-wrap text-xl font-black leading-8 tracking-tight text-slate-900 sm:text-2xl">
            <MathText text={current.prompt} />
          </h1>

          {current.code ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-[#101728]">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
                <span className="flex items-center gap-2 text-[11px] font-black tracking-[0.12em] text-blue-300">
                  <Code2 className="h-3.5 w-3.5" /> PYTHON
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(current.code ?? "");
                    toast.success("코드를 복사했습니다.");
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-white"
                >
                  <Clipboard className="h-3.5 w-3.5" /> 코드 복사
                </button>
              </div>
              <pre className="overflow-x-auto p-5 text-[13px] leading-6 text-slate-100 sm:text-sm">
                <code>{current.code}</code>
              </pre>
            </div>
          ) : null}

          {current.questionType === "multiple-choice" ? (
            <div className="mt-6 grid gap-3">
              {current.options.map((option, optionIndex) => {
                const selected = currentAnswer?.response === optionIndex;
                const correct = current.answer === optionIndex;
                const showCorrect = answered && correct;
                const showWrong = answered && selected && !correct;
                return (
                  <button
                    key={`${current.id}-${optionIndex}`}
                    type="button"
                    onClick={() => submitResponse(optionIndex)}
                    disabled={answered}
                    className={`group flex min-h-[58px] w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition ${
                      showCorrect
                        ? "border-emerald-400 bg-emerald-50 text-emerald-950"
                        : showWrong
                          ? "border-red-400 bg-red-50 text-red-950"
                          : "border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50/40"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                        showCorrect
                          ? "bg-emerald-500 text-white"
                          : showWrong
                            ? "bg-red-500 text-white"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {showCorrect ? (
                        <Check className="h-4 w-4" />
                      ) : showWrong ? (
                        <X className="h-4 w-4" />
                      ) : (
                        ANSWER_LABELS[optionIndex]
                      )}
                    </span>
                    <span className="min-w-0 flex-1 whitespace-pre-wrap font-mono text-sm font-bold">
                      <MathText text={option} />
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <form
              className="mt-6"
              onSubmit={(event) => {
                event.preventDefault();
                submitTextAnswer();
              }}
            >
              <div className="mb-2 flex items-end justify-between gap-2">
                <label htmlFor={`answer-${current.id}`} className="text-sm font-black text-slate-800">
                  {current.questionType === "short-answer" ? "정답 입력" : "서술형 답안"}
                </label>
                <span className="text-xs font-bold text-slate-400">
                  {current.questionType === "essay"
                    ? `${current.minLength ?? ESSAY_MIN_LENGTH}자 미만 제출 제한 · 현재 ${currentDraft.trim().length}자`
                    : "답안만 입력하세요"}
                </span>
              </div>
              <textarea
                id={`answer-${current.id}`}
                value={currentDraft}
                onChange={(event) =>
                  setDraftAnswers((drafts) => ({
                    ...drafts,
                    [current.id]: event.target.value,
                  }))
                }
                disabled={answered}
                rows={current.questionType === "essay" ? 7 : 3}
                spellCheck={false}
                placeholder={
                  current.questionType === "essay"
                    ? "핵심 개념과 이유를 구체적으로 작성하세요."
                    : "정답을 입력하세요."
                }
                className="w-full resize-y rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-sm font-medium leading-7 text-slate-800 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50"
              />
              {!answered ? (
                <button
                  type="submit"
                  disabled={
                    !currentDraft.trim() ||
                    (current.questionType === "essay" &&
                      currentDraft.trim().length <
                        (current.minLength ?? ESSAY_MIN_LENGTH))
                  }
                  className="mt-4 rounded-xl bg-slate-900 px-5 py-3 text-sm font-extrabold text-white disabled:opacity-35"
                >
                  답안 제출
                </button>
              ) : null}
            </form>
          )}

          {answered ? (
            <div
              className={`mt-5 rounded-2xl border p-5 ${
                currentAnswer.correct
                  ? "border-emerald-200 bg-emerald-50/80"
                  : "border-red-200 bg-red-50/70"
              }`}
            >
              <div className="flex items-start gap-3">
                {currentAnswer.correct ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-black ${
                      currentAnswer.correct ? "text-emerald-800" : "text-red-700"
                    }`}
                  >
                    {currentAnswer.correct ? "정답입니다!" : "정답을 다시 확인해 보세요."}
                  </p>
                  {!currentAnswer.correct && current.questionType === "short-answer" ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm font-bold text-slate-800">
                      모범 답안:{" "}
                      <MathText
                        text={current.modelAnswer ?? current.acceptedAnswers?.[0] ?? ""}
                      />
                    </p>
                  ) : null}
                  <ExplanationContent explanation={current.explanation} />
                  {current.questionType === "essay" && gradeDetails ? (
                    <p className="mt-2 text-xs text-slate-500">
                      일치 핵심어:{" "}
                      <MathText
                        text={gradeDetails.matchedKeywords.join(" · ") || "없음"}
                      />
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setHintOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-extrabold text-amber-700"
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
                  <MathText text={current.hint} />
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
            {isLast ? "결과 보기" : "다음"} <ArrowRight className="h-4 w-4" />
          </button>
        </footer>
      </section>
    </div>
  );
}

function BackLink({ week, title }: { week: "week1" | "week2"; title: string }) {
  return (
    <Link
      to={`/study/ai-python/${week}`}
      className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-violet-700"
    >
      <ArrowLeft className="h-4 w-4" /> {title} 출제 범위
    </Link>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <p className="text-[11px] font-bold text-white/60">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function ExplanationContent({ explanation }: { explanation: string }) {
  return (
    <div className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
      {explanation.split("\n").map((line, index) => {
        const text = line.trim();
        if (!text) return <div key={`space-${index}`} className="h-1" />;
        if (text === "정답인 이유") {
          return (
            <h2
              key={`${text}-${index}`}
              className="pt-1 text-sm font-black text-slate-900"
            >
              {text}
            </h2>
          );
        }
        return (
          <p key={`${text}-${index}`}>
            <MathText text={text} />
          </p>
        );
      })}
    </div>
  );
}
