import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Code2,
  Lightbulb,
  LoaderCircle,
  RotateCcw,
  Shuffle,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ESSAY_MIN_LENGTH } from "../../constants/study";
import {
  DIFFICULTY_META,
  getPythonQuestion,
  PYTHON_QUESTION_BANK,
  STUDY_CATEGORY_META,
  STUDY_QUESTION_TYPE_META,
} from "../../data/pythonQuestionBank";
import { useAuth } from "../../hooks/useAuth";
import { useStudyProgress } from "../../hooks/useStudyProgress";
import { gradePythonResponse } from "../../utils/studyGrading";
import type {
  PythonQuestion,
  StudyCategory,
  StudyDifficulty,
} from "../../types/study";

const DIFFICULTIES: StudyDifficulty[] = ["easy", "medium", "hard", "extreme"];
const CATEGORIES = Object.keys(STUDY_CATEGORY_META) as StudyCategory[];
const ANSWER_LABELS = ["A", "B", "C", "D"];

type SessionAnswer = {
  response: number | string;
  correct: boolean;
};

type QuizSession = {
  key: string;
  questions: PythonQuestion[];
  skippedCount: number;
  totalEligible: number;
};

function shuffleQuestions(questions: PythonQuestion[]) {
  const shuffled = [...questions];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

export default function PythonQuizView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { progress, recordAnswer, syncState } = useStudyProgress();
  const mode = searchParams.get("mode");
  const rawDifficulty = searchParams.get("difficulty") as StudyDifficulty | null;
  const difficulty = DIFFICULTIES.includes(rawDifficulty ?? "easy")
    ? (rawDifficulty ?? "easy")
    : "easy";

  const selectedCategories = useMemo(() => {
    const raw = searchParams.get("categories");
    if (!raw) return CATEGORIES;
    const parsed = raw.split(",").filter((category): category is StudyCategory =>
      CATEGORIES.includes(category as StudyCategory),
    );
    return parsed.length ? parsed : CATEGORIES;
  }, [searchParams]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, SessionAnswer>>({});
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [hintOpen, setHintOpen] = useState(false);
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const sessionKey = `${currentUser?.id ?? "guest"}:${mode ?? "standard"}:${difficulty}:${[
    ...selectedCategories,
  ]
    .sort()
    .join(",")}`;
  const sessionReady = quizSession?.key === sessionKey;
  const questions = sessionReady ? quizSession.questions : [];

  useEffect(() => {
    if (quizSession?.key === sessionKey || syncState === "loading") return;

    let nextQuestions: PythonQuestion[];
    let skippedCount = 0;
    let totalEligible = 0;

    if (mode === "wrong") {
      const latestAttempts = new Map<string, (typeof progress.attempts)[number]>();
      [...progress.attempts].reverse().forEach((attempt) => {
        if (!latestAttempts.has(attempt.questionId)) {
          latestAttempts.set(attempt.questionId, attempt);
        }
      });
      nextQuestions = [...latestAttempts.values()]
        .filter((attempt) => !attempt.correct)
        .map((attempt) => getPythonQuestion(attempt.questionId))
        .filter((question): question is PythonQuestion => Boolean(question));
      totalEligible = nextQuestions.length;
    } else {
      const eligibleQuestions = PYTHON_QUESTION_BANK[difficulty].filter(
        (question) => selectedCategories.includes(question.category),
      );
      const completedQuestionIds = new Set(
        progress.attempts.map((attempt) => attempt.questionId),
      );
      nextQuestions = eligibleQuestions.filter(
        (question) => !completedQuestionIds.has(question.id),
      );
      totalEligible = eligibleQuestions.length;
      skippedCount = totalEligible - nextQuestions.length;
    }

    setCurrentIndex(0);
    setAnswers({});
    setDraftAnswers({});
    setHintOpen(false);
    setQuizSession({
      key: sessionKey,
      questions: shuffleQuestions(nextQuestions),
      skippedCount,
      totalEligible,
    });
  }, [
    difficulty,
    mode,
    progress.attempts,
    quizSession?.key,
    selectedCategories,
    sessionKey,
    syncState,
  ]);

  const current = questions[currentIndex];
  const currentSessionAnswer = current ? answers[current.id] : undefined;
  const selectedAnswer =
    typeof currentSessionAnswer?.response === "number"
      ? currentSessionAnswer.response
      : undefined;
  const answered = currentSessionAnswer !== undefined;
  const currentCorrect = currentSessionAnswer?.correct ?? false;
  const correctCount = Object.values(answers).filter((answer) => answer.correct).length;
  const answeredCount = Object.keys(answers).length;
  const incorrectCount = answeredCount - correctCount;

  useEffect(() => {
    setHintOpen(false);
  }, [currentIndex]);

  const selectAnswer = (answerIndex: number) => {
    if (!current || answers[current.id] !== undefined) return;
    const correct = recordAnswer(current, answerIndex);
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [current.id]: { response: answerIndex, correct },
    }));
  };

  const submitTextAnswer = () => {
    if (!current || answers[current.id] !== undefined) return;
    const response = draftAnswers[current.id] ?? "";
    if (!response.trim()) return;
    if (
      current.questionType === "essay" &&
      response.trim().length < (current.minLength ?? ESSAY_MIN_LENGTH)
    ) {
      toast.error(`서술형 답안은 최소 ${current.minLength ?? ESSAY_MIN_LENGTH}자 이상 작성해야 합니다.`);
      return;
    }
    const correct = recordAnswer(current, response);
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [current.id]: { response, correct },
    }));
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate("/study/report");
  };

  if (!sessionReady) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
        <LoaderCircle className="h-9 w-9 animate-spin text-indigo-600" />
        <h1 className="mt-5 text-xl font-black text-slate-900">
          학습 기록을 확인하고 있습니다
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          이미 푼 문제를 제외한 뒤 남은 문제를 무작위로 섞고 있습니다.
        </p>
      </div>
    );
  }

  if (!current) {
    const allCompleted =
      mode !== "wrong" &&
      (quizSession?.totalEligible ?? 0) > 0 &&
      questions.length === 0;
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-black text-slate-900">
          {mode === "wrong"
            ? "복습할 오답이 없습니다"
            : allCompleted
              ? "선택한 범위의 문제를 모두 풀었습니다"
              : "선택한 문제가 없습니다"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {mode === "wrong"
            ? "아직 틀린 문제가 없어요. 새로운 문제에 도전해 보세요."
            : allCompleted
              ? "다른 난이도나 출제 범위를 선택해서 계속 학습해 보세요."
              : "출제 범위를 다시 선택해 주세요."}
        </p>
        <Link
          to="/study/python"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white"
        >
          <ArrowLeft className="h-4 w-4" /> 난이도 선택으로
        </Link>
      </div>
    );
  }

  const meta = DIFFICULTY_META[current.difficulty];
  const categoryMeta = STUDY_CATEGORY_META[current.category];
  const questionTypeMeta = STUDY_QUESTION_TYPE_META[current.questionType];
  const currentDraft = draftAnswers[current.id] ?? "";
  const gradeDetails = currentSessionAnswer
    ? gradePythonResponse(current, currentSessionAnswer.response)
    : null;
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="mx-auto max-w-5xl pb-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          to={mode === "wrong" ? "/study/report" : "/study/python"}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {mode === "wrong" ? "약점 분석" : "난이도 선택"}
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-600">
            <X className="mr-1 inline h-3.5 w-3.5" /> {incorrectCount}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
            <Check className="mr-1 inline h-3.5 w-3.5" /> {correctCount}
          </span>
          <Link
            to="/study/report"
            aria-label="약점 분석 보기"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-indigo-600"
          >
            <BarChart3 className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(33,47,90,0.10)]">
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-8">
          <div className="flex items-center justify-between gap-4 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              {mode === "wrong" ? (
                "오답 랜덤 복습"
              ) : (
                <>
                  <Shuffle className="h-3.5 w-3.5" />
                  {meta.label} 미풀이 랜덤
                </>
              )}{" "}
              · {currentIndex + 1} / {questions.length}
            </span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
          </div>
          {mode !== "wrong" && (quizSession?.skippedCount ?? 0) > 0 && (
            <p className="mt-2 text-[11px] font-bold text-indigo-500">
              이전에 푼 {quizSession?.skippedCount}문제는 이번 출제에서 제외했습니다.
            </p>
          )}
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-black text-white"
              style={{ backgroundColor: categoryMeta.color }}
            >
              {categoryMeta.label}
            </span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-black text-indigo-700">
              {meta.label}
            </span>
            <span
              className="rounded-full border px-3 py-1 text-[11px] font-black"
              style={{
                borderColor: `${questionTypeMeta.color}33`,
                backgroundColor: `${questionTypeMeta.color}10`,
                color: questionTypeMeta.color,
              }}
            >
              {questionTypeMeta.label}
            </span>
            <span className="ml-auto text-xs font-bold text-slate-300">
              질문 {String(currentIndex + 1).padStart(2, "0")}
            </span>
          </div>

          <h1 className="text-xl font-black leading-8 tracking-tight text-slate-900 sm:text-2xl">
            {current.prompt}
          </h1>

          {current.code && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-[#101728] shadow-inner">
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
          )}

          {current.questionType === "multiple-choice" ? (
            <div className="mt-6 grid gap-3">
              {current.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex;
                const isCorrect = current.answer === optionIndex;
                const showCorrect = answered && isCorrect;
                const showWrong = answered && isSelected && !isCorrect;

                return (
                  <button
                    key={`${current.id}-${optionIndex}`}
                    type="button"
                    onClick={() => selectAnswer(optionIndex)}
                    disabled={answered}
                    className={`group flex min-h-[58px] w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition ${
                      showCorrect
                        ? "border-emerald-400 bg-emerald-50 text-emerald-950"
                        : showWrong
                          ? "border-red-400 bg-red-50 text-red-950"
                          : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/40 disabled:hover:border-slate-200"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                        showCorrect
                          ? "bg-emerald-500 text-white"
                          : showWrong
                            ? "bg-red-500 text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-700"
                      }`}
                    >
                      {showCorrect ? <Check className="h-4 w-4" /> : showWrong ? <X className="h-4 w-4" /> : ANSWER_LABELS[optionIndex]}
                    </span>
                    <span className="min-w-0 flex-1 whitespace-pre-wrap font-mono text-sm font-bold">{option}</span>
                    {showCorrect && <span className="text-xs font-black text-emerald-700">정답</span>}
                    {showWrong && <span className="text-xs font-black text-red-600">내 답변</span>}
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
              <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
                <label htmlFor={`answer-${current.id}`} className="text-sm font-black text-slate-800">
                  {current.questionType === "short-answer" ? "정답 입력" : "서술형 답안"}
                </label>
                <span className="text-xs font-bold text-slate-400">
                  {current.questionType === "short-answer"
                    ? current.acceptedAnswers?.some((answer) => answer.includes("\n"))
                      ? "줄바꿈까지 정확히 입력 · 대/소문자 구분"
                      : "답안만 정확히 입력 · 대/소문자 구분"
                    : `최소 ${current.minLength ?? ESSAY_MIN_LENGTH}자 · 현재 ${currentDraft.trim().length}자`}
                </span>
              </div>
              {current.questionType === "short-answer" ? (
                current.acceptedAnswers?.some((answer) => answer.includes("\n")) ? (
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
                    rows={3}
                    spellCheck={false}
                    placeholder="출력 순서와 줄바꿈을 그대로 입력하세요"
                    className="w-full resize-y rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 font-mono text-sm font-bold leading-6 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-50"
                  />
                ) : (
                  <input
                    id={`answer-${current.id}`}
                    value={currentDraft}
                    onChange={(event) =>
                      setDraftAnswers((drafts) => ({
                        ...drafts,
                        [current.id]: event.target.value,
                      }))
                    }
                    disabled={answered}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="정답만 입력하세요"
                    className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 font-mono text-sm font-bold text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-50"
                  />
                )
              ) : (
                <>
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
                    rows={8}
                    placeholder={`출력 결과 또는 오류와 그 이유를 실행 순서에 따라 ${ESSAY_MIN_LENGTH}자 이상 작성하세요.`}
                    className="w-full resize-y rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-sm font-medium leading-7 text-slate-800 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:bg-slate-50"
                  />
                  <p className="mt-2 text-xs leading-5 text-amber-700">
                    서술형은 글자 수, 정답 결과 포함 여부, 핵심 개념어를 기준으로 1차 자동 채점합니다.
                    {" "}채점 핵심어: {current.rubricKeywords?.join(" · ")}
                  </p>
                </>
              )}
              {!answered && (
                <button
                  type="submit"
                  disabled={
                    !currentDraft.trim() ||
                    (current.questionType === "essay" &&
                      currentDraft.trim().length < (current.minLength ?? ESSAY_MIN_LENGTH))
                  }
                  className="mt-4 inline-flex min-w-[150px] items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  답안 제출
                </button>
              )}
            </form>
          )}

          {answered && (
            <div
              className={`mt-5 rounded-2xl border p-5 ${
                currentCorrect
                  ? "border-emerald-200 bg-emerald-50/80"
                  : "border-red-200 bg-red-50/70"
              }`}
            >
              <div className="flex items-start gap-3">
                {currentCorrect ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                )}
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-black ${currentCorrect ? "text-emerald-800" : "text-red-700"}`}>
                    {currentCorrect
                      ? current.questionType === "essay"
                        ? "핵심 채점 기준을 충족했습니다!"
                        : "정답입니다!"
                      : current.questionType === "multiple-choice"
                        ? `정답은 ${current.answer === null ? "-" : ANSWER_LABELS[current.answer]}입니다.`
                        : current.questionType === "short-answer"
                          ? `정답은 ${current.acceptedAnswers?.[0] ?? "-"}입니다.`
                          : "정답 결과 또는 핵심 원인 설명을 보완해 주세요."}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{current.explanation}</p>
                  {current.questionType === "essay" && gradeDetails && (
                    <>
                      <div className="mt-4 grid gap-2 text-xs sm:grid-cols-3">
                        <span className={`rounded-lg px-3 py-2 font-bold ${gradeDetails.responseLength >= (current.minLength ?? ESSAY_MIN_LENGTH) ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>
                          글자 수 {gradeDetails.responseLength}자
                        </span>
                        <span className={`rounded-lg px-3 py-2 font-bold ${gradeDetails.expectedMatched ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>
                          정답 결과 {gradeDetails.expectedMatched ? "포함" : "누락"}
                        </span>
                        <span className={`rounded-lg px-3 py-2 font-bold ${gradeDetails.matchedKeywords.length ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>
                          핵심 개념어 {gradeDetails.matchedKeywords.length ? gradeDetails.matchedKeywords.join(", ") : "누락"}
                        </span>
                      </div>
                      <div className="mt-4 rounded-xl border border-white/80 bg-white/75 p-4">
                        <p className="text-xs font-black text-slate-500">모범답안</p>
                        <p className="mt-1.5 text-sm leading-7 text-slate-700">{current.modelAnswer}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {!answered && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setHintOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-extrabold text-amber-700 transition hover:bg-amber-100"
              >
                <Lightbulb className="h-4 w-4" /> 힌트
                {hintOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {hintOpen && (
                <p className="mt-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-amber-900">
                  {current.hint}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowLeft className="h-4 w-4" /> 뒤로
          </button>
          <div className="hidden text-xs font-bold text-slate-400 sm:block">
            답변 {answeredCount} / {questions.length}
          </div>
          <button
            type="button"
            onClick={goNext}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold text-white transition ${
              isLast && answered
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLast && answered ? (
              <>
                결과 보기 <BarChart3 className="h-4 w-4" />
              </>
            ) : (
              <>
                다음 <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </section>

      <div className="mt-4 flex items-center justify-center">
        <button
          type="button"
          onClick={() => {
            setAnswers({});
            setDraftAnswers({});
            setCurrentIndex(0);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600"
        >
          <RotateCcw className="h-3.5 w-3.5" /> 이번 세션 처음부터 다시 풀기
        </button>
      </div>
    </div>
  );
}
