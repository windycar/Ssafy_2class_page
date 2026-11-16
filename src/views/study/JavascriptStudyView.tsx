import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Braces,
  Check,
  CheckCircle2,
  CloudCog,
  Database,
  Grid3X3,
  LineChart,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  JAVASCRIPT_CATEGORY_META,
  JAVASCRIPT_QUESTION_BANK,
} from "../../data/questionBanks/javascriptQuestionBank";
import { useJavascriptStudyProgress } from "../../hooks/useJavascriptStudyProgress";
import type { JavascriptCategory } from "../../types/javascriptStudy";

const CATEGORIES: JavascriptCategory[] = [
  "set1",
  "set2",
  "set3",
  "set4",
  "set5",
  "set6",
];

const CATEGORY_TITLES: Record<JavascriptCategory, string> = {
  set1: "1회차",
  set2: "2회차",
  set3: "3회차",
  set4: "4회차",
  set5: "5회차",
  set6: "6회차",
};

const CATEGORY_ICONS: Record<JavascriptCategory, React.ReactNode> = {
  set1: <Braces className="h-5 w-5" />,
  set2: <CloudCog className="h-5 w-5" />,
  set3: <Grid3X3 className="h-5 w-5" />,
  set4: <Braces className="h-5 w-5" />,
  set5: <CloudCog className="h-5 w-5" />,
  set6: <Grid3X3 className="h-5 w-5" />,
};

export default function JavascriptStudyView() {
  const navigate = useNavigate();
  const { progress, resetProgress, syncState } = useJavascriptStudyProgress();
  const [selectedCategories, setSelectedCategories] =
    useState<JavascriptCategory[]>(["set1"]);

  const completedQuestionIds = useMemo(
    () => new Set(progress.attempts.map((attempt) => attempt.questionId)),
    [progress.attempts],
  );
  const scopeCounts = useMemo(
    () =>
      Object.fromEntries(
        CATEGORIES.map((category) => {
          const questions = JAVASCRIPT_QUESTION_BANK.filter(
            (question) => question.category === category,
          );
          return [
            category,
            {
              total: questions.length,
              remaining: questions.filter(
                (question) => !completedQuestionIds.has(question.id),
              ).length,
            },
          ];
        }),
      ) as Record<JavascriptCategory, { total: number; remaining: number }>,
    [completedQuestionIds],
  );
  const selectedTotal = selectedCategories.reduce(
    (total, category) => total + scopeCounts[category].total,
    0,
  );
  const selectedRemaining = selectedCategories.reduce(
    (total, category) => total + scopeCounts[category].remaining,
    0,
  );
  const resettableCount = useMemo(
    () =>
      progress.attempts.filter((attempt) =>
        selectedCategories.includes(attempt.category),
      ).length,
    [progress.attempts, selectedCategories],
  );
  const allSelected = selectedCategories.length === CATEGORIES.length;
  const canStart =
    selectedCategories.length > 0 && selectedRemaining > 0 && syncState !== "loading";

  const toggleCategory = (category: JavascriptCategory) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : CATEGORIES.filter((item) => item === category || current.includes(item)),
    );
  };

  const startQuiz = () => {
    if (!canStart) return;
    navigate(`/study/javascript/quiz?categories=${selectedCategories.join(",")}`);
  };

  const resetSelectedProgress = async () => {
    if (!resettableCount || !selectedCategories.length || syncState === "loading") return;
    const confirmed = window.confirm(
      `현재 선택한 학생의 ${selectedCategories.length}개 범위 풀이 기록 ${resettableCount}개를 영구 삭제하고 초기화할까요?\n삭제한 기록은 복구할 수 없습니다.`,
    );
    if (!confirmed) return;

    const reset = await resetProgress(selectedCategories);
    if (reset) {
      toast.success(`현재 학생의 선택 범위 풀이 기록 ${resettableCount}개를 영구 초기화했습니다.`);
    } else {
      toast.error("풀이 기록을 초기화하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <Link
        to="/study"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-violet-700"
      >
        <ArrowLeft className="h-4 w-4" /> 학습 과목 목록
      </Link>

      <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(125deg,#211044_0%,#5b21b6_58%,#315fd3_100%)] p-7 text-white shadow-[0_22px_55px_rgba(91,33,182,0.24)] sm:p-9">
        <div className="absolute -right-14 -top-20 h-60 w-60 rounded-full border-[36px] border-white/[0.06]" />
        <div className="absolute bottom-0 right-40 h-36 w-36 rounded-full bg-blue-200/10 blur-3xl" />
        <div className="relative grid items-center gap-7 md:grid-cols-[1fr_auto]">
          <div>
            <p className="flex items-center gap-2 text-xs font-black tracking-[0.17em] text-violet-200">
              <BrainCircuit className="h-4 w-4" /> JAVASCRIPT CLASSROOM · {JAVASCRIPT_QUESTION_BANK.length} QUESTIONS
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              공부할 출제 범위를 골라 시작하세요.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-violet-50/75">
              1~3회차는 쉬운 버전, 4~6회차는 어려운 버전입니다. 회차를 선택해 풀어보세요.
              풀었던 문제와 학습 기록은 그대로 유지됩니다.
            </p>
          </div>
          <div className="hidden h-28 w-28 items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur md:flex">
            <BrainCircuit className="h-12 w-12 text-violet-100" />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
              01
            </span>
            <div>
              <h2 className="font-black text-slate-900">출제 범위</h2>
              <p className="text-xs text-slate-400">최소 한 영역을 선택하세요</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedCategories(allSelected ? [] : CATEGORIES)}
            className="text-xs font-extrabold text-violet-700 transition hover:text-violet-900"
          >
            {allSelected ? "전체 해제" : "전체 선택"}
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CATEGORIES.map((category) => {
            const meta = JAVASCRIPT_CATEGORY_META[category];
            const counts = scopeCounts[category];
            const selected = selectedCategories.includes(category);

            return (
              <button
                key={category}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleCategory(category)}
                className="group flex min-h-[112px] items-start gap-3 rounded-2xl border-2 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  borderColor: selected ? meta.color : "#e8edf3",
                  opacity: selected ? 1 : 0.62,
                }}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                  style={{ backgroundColor: selected ? meta.color : "#94a3b8" }}
                >
                  {selected ? <Check className="h-5 w-5" strokeWidth={3} /> : CATEGORY_ICONS[category]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black text-slate-900">
                    {CATEGORY_TITLES[category]}
                  </span>
                  <span className="mt-1 block text-[11px] leading-4 text-slate-500">
                    {meta.description}
                  </span>
                  <span className="mt-2 flex flex-wrap items-center gap-x-2 text-[10px] font-black text-slate-400">
                    <span>전체 {counts.total}문제</span>
                    <span aria-hidden="true">·</span>
                    <span style={{ color: counts.remaining ? meta.color : "#64748b" }}>
                      남은 {counts.remaining}문제
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="sticky bottom-4 z-20 rounded-2xl border border-violet-200 bg-white/95 p-4 shadow-[0_18px_50px_rgba(91,33,182,0.18)] backdrop-blur sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              selectedCategories.length > 0 && selectedRemaining === 0
                ? "bg-emerald-100 text-emerald-700"
                : "bg-violet-100 text-violet-800"
            }`}
          >
            {selectedCategories.length > 0 && selectedRemaining === 0 ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <BarChart3 className="h-5 w-5" />
            )}
          </span>
          <div>
            <p className="text-sm font-black text-slate-900">
              {selectedCategories.length === 0
                ? "출제 범위를 선택하세요"
                : selectedRemaining === 0
                  ? "선택한 범위의 문제를 모두 풀었습니다"
                  : `${selectedCategories.length}개 범위 · 남은 ${selectedRemaining}문제`}
            </p>
            <p className="text-xs text-slate-500">
              {syncState === "loading"
                ? "저장된 풀이 기록을 불러오는 중입니다"
                : selectedCategories.length === 0
                  ? "한 개 이상의 범위를 선택해야 시작할 수 있습니다"
                  : `선택한 회차의 ${selectedTotal}문제 중 미완료 문제를 순서대로 출제합니다`}
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-0 sm:flex sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={() => setSelectedCategories(["set1"])}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> 선택 초기화
          </button>
          <button
            type="button"
            onClick={resetSelectedProgress}
            disabled={!resettableCount || !selectedCategories.length || syncState === "loading"}
            aria-label={`선택한 범위의 풀이 기록 ${resettableCount}개 초기화`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" /> 풀이 기록 {resettableCount}개 초기화
          </button>
          <button
            type="button"
            onClick={startQuiz}
            disabled={!canStart}
            className="col-span-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-1 sm:w-auto"
          >
            문제 풀이 시작 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
