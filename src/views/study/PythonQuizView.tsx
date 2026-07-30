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
  RotateCcw,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  DIFFICULTY_META,
  getPythonQuestion,
  PYTHON_QUESTION_BANK,
  STUDY_CATEGORY_META,
} from "../../data/pythonQuestionBank";
import { useStudyProgress } from "../../hooks/useStudyProgress";
import type {
  PythonQuestion,
  StudyCategory,
  StudyDifficulty,
} from "../../types/study";

const DIFFICULTIES: StudyDifficulty[] = ["easy", "medium", "hard"];
const CATEGORIES = Object.keys(STUDY_CATEGORY_META) as StudyCategory[];
const ANSWER_LABELS = ["A", "B", "C", "D"];

export default function PythonQuizView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { progress, recordAnswer } = useStudyProgress();
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

  const questions = useMemo(() => {
    if (mode === "wrong") {
      const seen = new Set<string>();
      return [...progress.attempts]
        .reverse()
        .filter((attempt) => !attempt.correct && !seen.has(attempt.questionId) && seen.add(attempt.questionId))
        .map((attempt) => getPythonQuestion(attempt.questionId))
        .filter((question): question is PythonQuestion => Boolean(question));
    }
    return PYTHON_QUESTION_BANK[difficulty].filter((question) =>
      selectedCategories.includes(question.category),
    );
  }, [difficulty, mode, progress.attempts, selectedCategories]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [hintOpen, setHintOpen] = useState(false);

  const current = questions[currentIndex];
  const selectedAnswer = current ? answers[current.id] : undefined;
  const answered = selectedAnswer !== undefined;
  const correctCount = questions.filter(
    (question) => answers[question.id] === question.answer,
  ).length;
  const answeredCount = Object.keys(answers).length;
  const incorrectCount = answeredCount - correctCount;

  useEffect(() => {
    setHintOpen(false);
  }, [currentIndex]);

  const selectAnswer = (answerIndex: number) => {
    if (!current || answers[current.id] !== undefined) return;
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: answerIndex }));
    recordAnswer(current, answerIndex);
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate("/study/report");
  };

  if (!current) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-black text-slate-900">
          {mode === "wrong" ? "복습할 오답이 없습니다" : "선택한 문제가 없습니다"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {mode === "wrong"
            ? "아직 틀린 문제가 없어요. 새로운 문제에 도전해 보세요."
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
            <span>
              {mode === "wrong" ? "오답 다시 풀기" : meta.label} · {currentIndex + 1} / {questions.length}
            </span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
          </div>
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

          {answered && (
            <div
              className={`mt-5 rounded-2xl border p-5 ${
                selectedAnswer === current.answer
                  ? "border-emerald-200 bg-emerald-50/80"
                  : "border-red-200 bg-red-50/70"
              }`}
            >
              <div className="flex items-start gap-3">
                {selectedAnswer === current.answer ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                )}
                <div>
                  <p className={`text-sm font-black ${selectedAnswer === current.answer ? "text-emerald-800" : "text-red-700"}`}>
                    {selectedAnswer === current.answer ? "정답입니다!" : `정답은 ${ANSWER_LABELS[current.answer]}입니다.`}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{current.explanation}</p>
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

