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
  Cloud,
  CloudOff,
  Code2,
  Lightbulb,
  LoaderCircle,
  RotateCcw,
  Shuffle,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getWebQuestion,
  WEB_CATEGORY_META,
  WEB_DIFFICULTY_META,
  WEB_QUESTION_BANK,
  WEB_QUESTION_TYPE_META,
} from "../../data/questionBanks/webQuestionBank";
import { useAuth } from "../../hooks/useAuth";
import { useWebStudyProgress } from "../../hooks/useWebStudyProgress";
import { gradeWebResponse, WEB_ESSAY_MIN_LENGTH } from "../../utils/webStudyGrading";
import type { WebCategory, WebDifficulty, WebQuestion } from "../../types/webStudy";

const DIFFICULTIES: WebDifficulty[] = ["easy", "medium", "hard"];
const CATEGORIES = Object.keys(WEB_CATEGORY_META) as WebCategory[];
const ANSWER_LABELS = ["A", "B", "C", "D"];

type SessionAnswer = { response: number | string; correct: boolean };
type QuizSession = {
  key: string;
  questions: WebQuestion[];
  skippedCount: number;
  totalEligible: number;
};

function shuffleQuestions(questions: WebQuestion[]) {
  const shuffled = [...questions];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export default function WebQuizView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { progress, recordAnswer, syncState } = useWebStudyProgress();
  const mode = searchParams.get("mode");
  const rawDifficulty = searchParams.get("difficulty") as WebDifficulty | null;
  const difficulty = DIFFICULTIES.includes(rawDifficulty ?? "easy")
    ? (rawDifficulty ?? "easy")
    : "easy";

  const selectedCategories = useMemo(() => {
    const raw = searchParams.get("categories");
    if (!raw) return CATEGORIES;
    const parsed = raw.split(",").filter((category): category is WebCategory =>
      CATEGORIES.includes(category as WebCategory),
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
  ].sort().join(",")}`;
  const sessionReady = quizSession?.key === sessionKey;
  const questions = sessionReady ? quizSession.questions : [];

  useEffect(() => {
    if (quizSession?.key === sessionKey || syncState === "loading") return;

    let nextQuestions: WebQuestion[];
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
        .map((attempt) => getWebQuestion(attempt.questionId))
        .filter((question): question is WebQuestion => Boolean(question));
      totalEligible = nextQuestions.length;
    } else {
      const eligibleQuestions = WEB_QUESTION_BANK[difficulty].filter((question) =>
        selectedCategories.includes(question.category),
      );
      const completedQuestionIds = new Set(progress.attempts.map((attempt) => attempt.questionId));
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

  if (!sessionReady) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-cyan-700" />
          <p className="mt-3 text-sm font-bold text-slate-500">저장된 풀이 기록을 불러오는 중입니다.</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="space-y-5 pb-8">
        <Link to="/study/web" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-700">
          <ArrowLeft className="h-4 w-4" /> Web 강의실
        </Link>
        <section className="rounded-[2rem] border border-cyan-100 bg-white px-6 py-16 text-center shadow-sm">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="mt-5 text-2xl font-black text-slate-900">
            {mode === "wrong" ? "다시 풀 오답이 없습니다." : "선택한 범위의 문제를 모두 풀었습니다."}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            다른 범위를 선택하거나 전체 오답 복습에서 다른 문제 세트를 선택하세요.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/study/web" className="rounded-xl bg-cyan-700 px-5 py-3 text-sm font-extrabold text-white">
              범위 다시 선택
            </Link>
            <Link to="/study/report" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-extrabold text-slate-600">
              오답 세트 선택
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const current = questions[currentIndex];
  const currentSessionAnswer = answers[current.id];
  const answered = Boolean(currentSessionAnswer);
  const selectedAnswer = typeof currentSessionAnswer?.response === "number"
    ? currentSessionAnswer.response
    : null;
  const draftText = draftAnswers[current.id] ?? "";
  const answeredCount = Object.keys(answers).length;
  const isLast = currentIndex === questions.length - 1;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const gradeDetails = currentSessionAnswer
    ? gradeWebResponse(current, currentSessionAnswer.response)
    : null;

  const submitChoice = (answerIndex: number) => {
    if (answered) return;
    const correct = recordAnswer(current, answerIndex);
    setAnswers((state) => ({ ...state, [current.id]: { response: answerIndex, correct } }));
  };

  const submitTextAnswer = () => {
    if (answered || !draftText.trim()) return;
    if (current.questionType === "essay" && draftText.trim().length < WEB_ESSAY_MIN_LENGTH) {
      toast.error(`서술형 답안은 ${WEB_ESSAY_MIN_LENGTH}자 이상 작성해야 합니다.`);
      return;
    }
    const response = draftText.trim();
    const correct = recordAnswer(current, response);
    setAnswers((state) => ({ ...state, [current.id]: { response, correct } }));
  };

  const goNext = () => {
    if (isLast && answered) {
      navigate("/study/report");
      return;
    }
    setCurrentIndex((index) => Math.min(questions.length - 1, index + 1));
    setHintOpen(false);
  };

  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/study/web" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-cyan-700">
          <ArrowLeft className="h-4 w-4" /> 범위 선택
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-500 shadow-sm sm:flex">
            {syncState === "synced" ? <Cloud className="h-3.5 w-3.5 text-emerald-600" /> : <CloudOff className="h-3.5 w-3.5 text-amber-600" />}
            {syncState === "synced" ? "풀이 저장됨" : "로컬 저장"}
          </span>
          <Link to="/study/report" className="inline-flex items-center gap-2 rounded-xl border border-cyan-100 bg-white px-4 py-2.5 text-sm font-extrabold text-cyan-800 shadow-sm">
            <BarChart3 className="h-4 w-4" /> 오답 세트 선택
          </Link>
        </div>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <div className="bg-[linear-gradient(125deg,#062630,#08798b)] px-5 py-5 text-white sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Code2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-black tracking-[0.14em] text-cyan-200">WEB LIVE QUIZ</p>
                <p className="text-sm font-black">
                  {mode === "wrong" ? "오답 다시 풀기" : WEB_DIFFICULTY_META[difficulty].label}
                  <span className="ml-2 font-semibold text-cyan-100/70">{currentIndex + 1} / {questions.length}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-cyan-50/80">
              <Shuffle className="h-3.5 w-3.5" /> 무작위 순서
              {(quizSession?.skippedCount ?? 0) > 0 ? (
                <span>· 풀이 완료 {quizSession?.skippedCount}개 제외</span>
              ) : null}
            </div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full px-3 py-1 text-[11px] font-black text-white" style={{ backgroundColor: WEB_CATEGORY_META[current.category].color }}>
              {WEB_CATEGORY_META[current.category].label}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black" style={{ color: WEB_QUESTION_TYPE_META[current.questionType].color }}>
              {WEB_QUESTION_TYPE_META[current.questionType].label}
            </span>
          </div>

          <h1 className="mt-5 whitespace-pre-line text-xl font-black leading-8 text-slate-900 sm:text-2xl">
            {current.prompt}
          </h1>

          {current.code && (
            <pre className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-[#101827] p-5 font-mono text-sm leading-6 text-cyan-50 shadow-inner">
              <code>{current.code}</code>
            </pre>
          )}

          {current.questionType === "multiple-choice" ? (
            <div className="mt-6 grid gap-3">
              {current.options.map((option, optionIndex) => {
                const isCorrect = answered && optionIndex === current.answer;
                const isSelected = selectedAnswer === optionIndex;
                const isWrongSelected = answered && isSelected && !isCorrect;
                return (
                  <button
                    key={`${current.id}-${optionIndex}`}
                    type="button"
                    onClick={() => submitChoice(optionIndex)}
                    disabled={answered}
                    className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
                      isCorrect
                        ? "border-emerald-400 bg-emerald-50"
                        : isWrongSelected
                          ? "border-red-400 bg-red-50"
                          : "border-slate-100 bg-white hover:border-cyan-200 hover:bg-cyan-50/30"
                    }`}
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                      isCorrect ? "bg-emerald-600 text-white" : isWrongSelected ? "bg-red-500 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {isCorrect ? <Check className="h-4 w-4" /> : isWrongSelected ? <X className="h-4 w-4" /> : ANSWER_LABELS[optionIndex]}
                    </span>
                    <span className="pt-0.5 text-sm font-bold leading-6 text-slate-700">{option}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-6">
              <label htmlFor="web-response" className="mb-2 block text-sm font-black text-slate-700">
                {current.questionType === "short-answer" ? "단답 입력" : `서술 답안 · ${WEB_ESSAY_MIN_LENGTH}자 이상`}
              </label>
              <textarea
                id="web-response"
                value={draftText}
                onChange={(event) => setDraftAnswers((state) => ({ ...state, [current.id]: event.target.value }))}
                disabled={answered}
                rows={current.questionType === "essay" ? 7 : 3}
                placeholder={current.questionType === "short-answer" ? "정답만 정확히 입력하세요." : "정답과 이유, 관련 개념을 함께 서술하세요."}
                className="w-full resize-y rounded-2xl border-2 border-slate-200 bg-white p-4 text-sm leading-7 text-slate-800 outline-none transition focus:border-cyan-500 disabled:bg-slate-50"
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className={`text-xs font-bold ${current.questionType === "essay" && draftText.trim().length < WEB_ESSAY_MIN_LENGTH ? "text-amber-600" : "text-slate-400"}`}>
                  {draftText.trim().length}자
                </span>
                {!answered && (
                  <button
                    type="button"
                    onClick={submitTextAnswer}
                    disabled={!draftText.trim()}
                    className="rounded-xl bg-cyan-700 px-5 py-2.5 text-sm font-extrabold text-white hover:bg-cyan-800 disabled:opacity-40"
                  >
                    답안 제출
                  </button>
                )}
              </div>
            </div>
          )}

          {answered && (
            <div className={`mt-6 rounded-2xl border p-5 ${currentSessionAnswer.correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
              <div className="flex items-start gap-3">
                {currentSessionAnswer.correct ? <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" /> : <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-500" />}
                <div className="min-w-0 flex-1">
                  <p className={`font-black ${currentSessionAnswer.correct ? "text-emerald-900" : "text-red-900"}`}>
                    {currentSessionAnswer.correct ? "정답입니다." : "복습이 필요한 문제입니다."}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{current.explanation}</p>
                  {current.questionType !== "multiple-choice" && (
                    <div className="mt-4 rounded-xl border border-white/80 bg-white/80 p-4">
                      <p className="text-xs font-black text-slate-500">정답 / 모범답안</p>
                      <p className="mt-1.5 whitespace-pre-line text-sm leading-7 text-slate-700">
                        {current.questionType === "essay" ? current.modelAnswer : current.acceptedAnswers?.[0]}
                      </p>
                    </div>
                  )}
                  {current.questionType === "essay" && gradeDetails && (
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                      <span className={`rounded-lg px-3 py-2 font-bold ${gradeDetails.responseLength >= WEB_ESSAY_MIN_LENGTH ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>
                        분량 {gradeDetails.responseLength}자
                      </span>
                      <span className={`rounded-lg px-3 py-2 font-bold ${gradeDetails.expectedMatched ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>
                        핵심 정답 {gradeDetails.expectedMatched ? "포함" : "누락"}
                      </span>
                      <span className={`rounded-lg px-3 py-2 font-bold ${gradeDetails.matchedKeywords.length ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>
                        개념어 {gradeDetails.matchedKeywords.length ? gradeDetails.matchedKeywords.join(", ") : "누락"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!answered && (
            <div className="mt-5">
              <button type="button" onClick={() => setHintOpen((open) => !open)} className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-extrabold text-amber-700 hover:bg-amber-100">
                <Lightbulb className="h-4 w-4" /> 힌트
                {hintOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {hintOpen && <p className="mt-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-amber-900">{current.hint}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-8">
          <button type="button" onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))} disabled={currentIndex === 0} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 disabled:opacity-35">
            <ArrowLeft className="h-4 w-4" /> 뒤로
          </button>
          <span className="hidden text-xs font-bold text-slate-400 sm:block">답변 {answeredCount} / {questions.length}</span>
          <button type="button" onClick={goNext} className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold text-white ${isLast && answered ? "bg-emerald-600" : "bg-cyan-700"}`}>
            {isLast && answered ? <>결과 보기 <BarChart3 className="h-4 w-4" /></> : <>다음 <ArrowRight className="h-4 w-4" /></>}
          </button>
        </div>
      </section>

      <div className="flex justify-center">
        <button type="button" onClick={() => { setAnswers({}); setDraftAnswers({}); setCurrentIndex(0); }} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-cyan-700">
          <RotateCcw className="h-3.5 w-3.5" /> 이번 세션 처음부터 보기
        </button>
      </div>
    </div>
  );
}
