import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Code2,
  Flag,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Shuffle,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import katex from "katex";
import "katex/dist/katex.min.css";
import { ESSAY_MIN_LENGTH } from "../../constants/study";
import {
  getSpecialMockExamQuestion,
  SPECIAL_MOCK_EXAM_BANKS,
  SPECIAL_MOCK_EXAM_META,
} from "../../data/모의고사/2회차";
import { useAuth } from "../../hooks/useAuth";
import { useSpecialMockExamProgress } from "../../hooks/useSpecialMockExamProgress";
import type {
  SpecialMockExamDifficulty,
  SpecialMockExamQuestion,
  SpecialMockExamQuestionType,
  SpecialMockExamRound,
} from "../../types/specialMockExam";
import { isSpecialMockExamRound } from "../../types/specialMockExam";
import { shuffleArray } from "../../utils/shuffleArray";
import { getLatestAttemptsByQuestion } from "../../utils/studyProgressStats";
import {
  calculateSpecialMockExamScore,
  hasPassedSpecialMockExam,
  SPECIAL_MOCK_EXAM_PASS_SCORE,
} from "../../utils/specialMockExamResult";
import {
  normalizeSpecialMockExamMath,
  SPECIAL_MOCK_EXAM_MATH_SEGMENT_PATTERN,
} from "../../utils/specialMockExamText";

const ANSWER_LABELS = ["A", "B", "C", "D"];
const DIFFICULTY_LABELS: Record<SpecialMockExamDifficulty, string> = {
  easy: "초급",
  medium: "중급",
  hard: "고급",
  extreme: "최상급",
};
const QUESTION_TYPE_LABELS: Record<SpecialMockExamQuestionType, string> = {
  "multiple-choice": "객관식",
  "short-answer": "단답형",
  essay: "서술형",
};
type SessionAnswer = {
  response: number | string;
  correct?: boolean;
};

type QuizSession = {
  key: string;
  questions: SpecialMockExamQuestion[];
};

export default function SpecialMockExamQuizView() {
  const { assessmentRound, mockRound: mockRoundParam } = useParams();
  const validRound = isSpecialMockExamRound(mockRoundParam);
  const mockRound = validRound
    ? (Number(mockRoundParam) as SpecialMockExamRound)
    : null;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { progress, recordAnswers, syncState } = useSpecialMockExamProgress();
  const mode = searchParams.get("mode");
  const run = searchParams.get("run") ?? "0";
  const sessionKey = `${currentUser?.id ?? 0}:assessment-${assessmentRound ?? "invalid"}:mock-${mockRound ?? "invalid"}:${mode ?? "standard"}:${run}`;
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, SessionAnswer>>({});
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [reviewQuestionIds, setReviewQuestionIds] = useState<string[]>([]);
  const [hintOpen, setHintOpen] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (
      assessmentRound !== "2" ||
      !mockRound ||
      session?.key === sessionKey ||
      syncState === "loading"
    ) {
      return;
    }

    let questions: SpecialMockExamQuestion[];
    if (mode === "wrong") {
      questions = getLatestAttemptsByQuestion(
        progress.attempts.filter(
          (attempt) => attempt.mockRound === mockRound,
        ),
      )
        .filter((attempt) => !attempt.correct)
        .map((attempt) =>
          getSpecialMockExamQuestion(mockRound, attempt.questionId),
        )
        .filter(
          (question): question is SpecialMockExamQuestion => Boolean(question),
        );
    } else {
      questions = [...SPECIAL_MOCK_EXAM_BANKS[mockRound]];
    }

    setSession({ key: sessionKey, questions: shuffleArray(questions) });
    setCurrentIndex(0);
    setAnswers({});
    setDraftAnswers({});
    setReviewQuestionIds([]);
    setHintOpen(false);
    setFinished(false);
  }, [
    assessmentRound,
    mode,
    mockRound,
    progress.attempts,
    session?.key,
    sessionKey,
    syncState,
  ]);

  if (assessmentRound !== "2" || !mockRound) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
        <h1 className="text-2xl font-black text-slate-900">
          문제 세트를 찾을 수 없습니다.
        </h1>
        <Link
          to="/study/special-mock"
          className="mt-5 inline-flex font-bold text-violet-700"
        >
          특별 모의고사로 돌아가기
        </Link>
      </section>
    );
  }

  const sessionReady = session?.key === sessionKey;
  const questions = sessionReady ? session.questions : [];
  const buildAllQuestionsHref = () =>
    `/study/special-mock/2/${mockRound}/quiz?mode=all&run=${Date.now()}`;

  if (!sessionReady) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
        <p className="text-sm font-bold text-slate-500">
          문제를 준비하고 있습니다.
        </p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="space-y-5 pb-8">
        <BackLink />
        <section className="rounded-[2rem] border border-violet-100 bg-white px-6 py-16 text-center shadow-sm">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="mt-5 text-2xl font-black text-slate-900">
            {mode === "wrong"
              ? "복습할 오답이 없습니다."
              : "이 모의고사의 모든 문제를 풀었습니다."}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {mode === "wrong"
              ? "문제별 최신 답안이 모두 정답입니다."
              : "전체 문제를 다시 풀거나 다른 모의고사를 선택해 주세요."}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/study/special-mock"
              className="rounded-xl border border-violet-100 bg-violet-50 px-5 py-3 text-sm font-extrabold text-violet-700"
            >
              다른 모의고사 선택
            </Link>
            <button
              type="button"
              onClick={() => navigate(buildAllQuestionsHref())}
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
    const correctCount = sessionAnswers.filter(
      ({ correct }) => correct === true,
    ).length;
    const score = calculateSpecialMockExamScore(
      correctCount,
      questions.length,
    );
    const passed = hasPassedSpecialMockExam(score);
    return (
      <div className="space-y-5 pb-8">
        <BackLink />
        <section
          className={`relative overflow-hidden rounded-[2rem] px-6 py-14 text-center text-white shadow-[0_22px_55px_rgba(76,29,149,0.24)] ${
            passed
              ? "bg-[linear-gradient(125deg,#102f2b,#047857_58%,#b7791f)]"
              : "bg-[linear-gradient(125deg,#3f1722,#9f1239_58%,#a86716)]"
          }`}
        >
          {passed ? (
            <Trophy className="mx-auto h-14 w-14" />
          ) : (
            <RotateCcw className="mx-auto h-14 w-14" />
          )}
          <p className="mt-5 text-xs font-black tracking-[0.16em] text-white/70">
            과목평가 2회차 · {SPECIAL_MOCK_EXAM_META[mockRound].label} ·{` `}
            {mode === "wrong" ? "오답 복습" : "실전 모의고사"} 채점 완료
          </p>
          <h1 className="mt-2 text-3xl font-black">
            {passed ? "통과했습니다." : "60점에 도달하지 못했습니다."}
          </h1>
          <p className="mt-3 text-sm font-bold text-white/75">
            {SPECIAL_MOCK_EXAM_PASS_SCORE}점 이상 통과 · 내 점수 {score}점
          </p>
          <div className="mx-auto mt-7 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            <ResultStat label="점수" value={`${score}점`} />
            <ResultStat label="정답" value={`${correctCount}`} />
            <ResultStat
              label="오답"
              value={`${questions.length - correctCount}`}
            />
            <ResultStat label="결과" value={passed ? "통과" : "미통과"} />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/study/special-mock"
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-extrabold text-white"
            >
              모의고사 목록
            </Link>
            <button
              type="button"
              onClick={() =>
                navigate(
                  mode === "wrong"
                    ? `/study/special-mock/2/${mockRound}/quiz?mode=wrong&run=${Date.now()}`
                    : buildAllQuestionsHref(),
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-violet-800"
            >
              <RotateCcw className="h-4 w-4" />
              {mode === "wrong" ? "남은 오답 풀기" : "전체 다시 풀기"}
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
  const answeredCount = questions.filter((question) =>
    Boolean(answers[question.id]),
  ).length;
  const answerRate = Math.round((answeredCount / questions.length) * 100);
  const reviewQuestionIdSet = new Set(reviewQuestionIds);
  const isLast = currentIndex === questions.length - 1;

  const submitResponse = (response: number | string) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [current.id]: { response },
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
    toast.success("답안을 저장했습니다.");
  };

  const toggleReview = () => {
    setReviewQuestionIds((questionIds) =>
      questionIds.includes(current.id)
        ? questionIds.filter((questionId) => questionId !== current.id)
        : [...questionIds, current.id],
    );
  };

  const finishAndGrade = () => {
    const firstUnansweredIndex = questions.findIndex(
      (question) => !answers[question.id],
    );
    if (firstUnansweredIndex >= 0) {
      setCurrentIndex(firstUnansweredIndex);
      setHintOpen(false);
      toast.error(
        `미답변 ${questions.length - answeredCount}문제를 모두 작성한 뒤 채점해 주세요.`,
      );
      return;
    }

    const graded = recordAnswers(
      mockRound,
      questions.map((question) => ({
        question,
        response: answers[question.id].response,
      })),
    );
    setAnswers(
      Object.fromEntries(
        graded.map(({ question, response, correct }) => [
          question.id,
          { response, correct },
        ]),
      ),
    );
    setFinished(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-7xl pb-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <BackLink />
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
            답변 {answeredCount}/{questions.length}
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700">
            검토 {reviewQuestionIds.length}
          </span>
          <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">
            {SPECIAL_MOCK_EXAM_PASS_SCORE}점 이상 통과
          </span>
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(33,47,90,0.10)]">
          <header className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-8">
            <div className="flex items-center justify-between gap-4 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Shuffle className="h-3.5 w-3.5" /> 과목평가 2회차 · 모의고사
                {mockRound}회차 · {mode === "wrong" ? "오답 복습" : "실전 시험"} ·{` `}
                {currentIndex + 1} / {questions.length}
              </span>
              <span>채점 전</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-amber-500 transition-all"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </header>

          <div className="p-5 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
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
              <button
                type="button"
                onClick={toggleReview}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-extrabold transition ${
                  reviewQuestionIdSet.has(current.id)
                    ? "border-amber-400 bg-amber-50 text-amber-800"
                    : "border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-700"
                }`}
              >
                <Flag className="h-3.5 w-3.5" />
                {reviewQuestionIdSet.has(current.id) ? "검토 해제" : "검토 표시"}
              </button>
            </div>

            <h1 className="whitespace-pre-wrap text-xl font-black leading-8 tracking-tight text-slate-900 sm:text-2xl">
              <MathText text={current.prompt} />
            </h1>

            {current.code ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-[#101728]">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
                  <span className="flex items-center gap-2 text-[11px] font-black tracking-[0.12em] text-blue-300">
                    <Code2 className="h-3.5 w-3.5" /> CODE
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
                  return (
                    <button
                      key={`${current.id}-${optionIndex}`}
                      type="button"
                      onClick={() => submitResponse(optionIndex)}
                      className={`group flex min-h-[58px] w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition ${
                        selected
                          ? "border-violet-500 bg-violet-50 text-violet-950 shadow-[0_8px_20px_rgba(109,40,217,0.08)]"
                          : "border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50/40"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                          selected
                            ? "bg-violet-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {ANSWER_LABELS[optionIndex]}
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
                  <label
                    htmlFor={`answer-${current.id}`}
                    className="text-sm font-black text-slate-800"
                  >
                    {current.questionType === "short-answer"
                      ? "정답 입력"
                      : "서술형 답안"}
                  </label>
                  <span className="text-xs font-bold text-slate-400">
                    {current.questionType === "essay"
                      ? `${current.minLength ?? ESSAY_MIN_LENGTH}자 이상 · 현재 ${currentDraft.trim().length}자`
                      : "채점 전까지 수정할 수 있습니다"}
                  </span>
                </div>
                <textarea
                  id={`answer-${current.id}`}
                  value={currentDraft}
                  onChange={(event) => {
                    const value = event.target.value;
                    setDraftAnswers((drafts) => ({
                      ...drafts,
                      [current.id]: value,
                    }));
                    setAnswers((currentAnswers) => {
                      if (!currentAnswers[current.id]) return currentAnswers;
                      const nextAnswers = { ...currentAnswers };
                      delete nextAnswers[current.id];
                      return nextAnswers;
                    });
                  }}
                  rows={current.questionType === "essay" ? 7 : 3}
                  spellCheck={false}
                  placeholder={
                    current.questionType === "essay"
                      ? "핵심 개념과 이유를 구체적으로 작성하세요."
                      : "정답을 입력하세요."
                  }
                  className="w-full resize-y rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-sm font-medium leading-7 text-slate-800 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
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
                  {answered ? "답안 수정 저장" : "답안 저장"}
                </button>
              </form>
            )}

            <div className="mt-5 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3">
              <p className="flex items-center gap-2 text-xs font-bold text-blue-700">
                <ListChecks className="h-4 w-4" />
                {answered
                  ? "답안이 저장되었습니다. 최종 채점 전까지 수정할 수 있습니다."
                  : "답안을 선택하거나 입력해 주세요. 정답은 최종 채점 후 공개됩니다."}
              </p>
              <button
                type="button"
                onClick={() => setHintOpen((open) => !open)}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-700"
              >
                <Lightbulb className="h-4 w-4" /> 힌트
                {hintOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
            {hintOpen ? (
              <p className="mt-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-amber-900">
                <MathText text={current.hint} />
              </p>
            ) : null}
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
              <ArrowLeft className="h-4 w-4" /> 이전
            </button>
            <span className="hidden text-xs font-bold text-slate-400 sm:block">
              답변 {answeredCount} / {questions.length}
            </span>
            <button
              type="button"
              onClick={() => {
                setCurrentIndex((index) => Math.min(questions.length - 1, index + 1));
                setHintOpen(false);
              }}
              disabled={isLast}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-35"
            >
              다음 <ArrowRight className="h-4 w-4" />
            </button>
          </footer>
        </section>

        <ExamAnswerPanel
          questions={questions}
          answers={answers}
          currentIndex={currentIndex}
          reviewQuestionIds={reviewQuestionIdSet}
          answerRate={answerRate}
          answeredCount={answeredCount}
          onSelect={(index) => {
            setCurrentIndex(index);
            setHintOpen(false);
          }}
          onFinish={finishAndGrade}
        />
      </div>
    </div>
  );

  function BackLink() {
    return (
      <Link
        to="/study/special-mock"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-violet-700"
      >
        <ArrowLeft className="h-4 w-4" /> 과목평가 2회차 모의고사 목록
      </Link>
    );
  }
}

function ExamAnswerPanel({
  questions,
  answers,
  currentIndex,
  reviewQuestionIds,
  answerRate,
  answeredCount,
  onSelect,
  onFinish,
}: {
  questions: SpecialMockExamQuestion[];
  answers: Record<string, SessionAnswer>;
  currentIndex: number;
  reviewQuestionIds: Set<string>;
  answerRate: number;
  answeredCount: number;
  onSelect: (index: number) => void;
  onFinish: () => void;
}) {
  return (
    <aside className="rounded-[1.5rem] border border-amber-200 bg-[#fffdf8] p-5 shadow-[0_16px_38px_rgba(120,83,20,0.08)] lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-black text-slate-900">답안 현황</h2>
        <strong className="text-2xl font-black text-amber-700">
          {answerRate}%
        </strong>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-amber-600 transition-all"
          style={{ width: `${answerRate}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs font-black text-slate-700">
        <button
          type="button"
          onClick={() => onSelect(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          aria-label="이전 문제"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 bg-white text-amber-800 disabled:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span>
          {currentIndex + 1} / {questions.length}
        </span>
        <button
          type="button"
          onClick={() =>
            onSelect(Math.min(questions.length - 1, currentIndex + 1))
          }
          disabled={currentIndex === questions.length - 1}
          aria-label="다음 문제"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 bg-white text-amber-800 disabled:text-slate-300"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {questions.map((question, index) => {
          const isCurrent = index === currentIndex;
          const isAnswered = Boolean(answers[question.id]);
          const isReview = reviewQuestionIds.has(question.id);
          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`${index + 1}번 문제${isAnswered ? ", 답변 완료" : ", 미답변"}${isReview ? ", 검토 표시" : ""}`}
              className={`relative flex aspect-square items-center justify-center rounded-lg border text-xs font-black transition ${
                isCurrent
                  ? "border-amber-700 bg-amber-700 text-white"
                  : isReview
                    ? "border-amber-400 bg-amber-50 text-amber-900"
                    : isAnswered
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : "border-stone-200 bg-white text-slate-700 hover:border-amber-300"
              }`}
            >
              {index + 1}
              {isReview ? (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-[10px] font-bold text-slate-500">
        <LegendDot tone="bg-emerald-500" label="답변 완료" />
        <LegendDot tone="bg-white ring-1 ring-stone-300" label="미답변" />
        <LegendDot tone="bg-amber-500" label="검토 표시" />
        <LegendDot tone="bg-amber-800" label="현재 문제" />
      </div>

      <button
        type="button"
        onClick={onFinish}
        className="mt-6 w-full rounded-xl border-2 border-slate-900 bg-white px-4 py-3.5 text-sm font-black text-slate-900 transition hover:bg-slate-900 hover:text-white"
      >
        시험 종료 및 채점
      </button>
      <p className="mt-3 text-center text-[10px] leading-4 text-slate-500">
        답변 {answeredCount}/{questions.length} · 모든 답안을 작성해야 채점됩니다.
      </p>
    </aside>
  );
}

function LegendDot({
  tone,
  label,
}: {
  tone: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-sm ${tone}`} />
      {label}
    </span>
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

function MathText({ text }: { text: string }) {
  const normalizedText = normalizeSpecialMockExamMath(text);

  return (
    <>
      {normalizedText
        .split(SPECIAL_MOCK_EXAM_MATH_SEGMENT_PATTERN)
        .map((segment, index) => {
          const displayMode =
            segment.startsWith("$$") && segment.endsWith("$$");
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
