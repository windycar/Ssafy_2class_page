import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Code2,
  Flame,
  Gauge,
  Layers3,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  DIFFICULTY_META,
  PYTHON_QUESTION_BANK,
  STUDY_CATEGORY_META,
  STUDY_QUESTION_TYPE_META,
} from "../../data/pythonQuestionBank";
import { useStudyProgress } from "../../hooks/useStudyProgress";
import type {
  StudyCategory,
  StudyDifficulty,
  StudyQuestionType,
} from "../../types/study";

const CATEGORIES = Object.keys(STUDY_CATEGORY_META) as StudyCategory[];
const DIFFICULTIES = Object.keys(DIFFICULTY_META) as StudyDifficulty[];
const QUESTION_TYPES = Object.keys(
  STUDY_QUESTION_TYPE_META,
) as StudyQuestionType[];

export default function PythonStudyView() {
  const navigate = useNavigate();
  const { progress, syncState } = useStudyProgress();
  const [difficulty, setDifficulty] = useState<StudyDifficulty>("easy");
  const [selectedCategories, setSelectedCategories] = useState<StudyCategory[]>(CATEGORIES);
  const completedQuestionIds = useMemo(
    () => new Set(progress.attempts.map((attempt) => attempt.questionId)),
    [progress.attempts],
  );

  const selectedQuestions = useMemo(
    () =>
      PYTHON_QUESTION_BANK[difficulty].filter((question) =>
        selectedCategories.includes(question.category),
      ),
    [difficulty, selectedCategories],
  );
  const remainingQuestions = useMemo(
    () =>
      selectedQuestions.filter(
        (question) => !completedQuestionIds.has(question.id),
      ),
    [completedQuestionIds, selectedQuestions],
  );
  const questionCount = remainingQuestions.length;
  const questionTypeCounts = QUESTION_TYPES.reduce<Record<StudyQuestionType, number>>(
    (counts, questionType) => {
      counts[questionType] = remainingQuestions.filter(
        (question) => question.questionType === questionType,
      ).length;
      return counts;
    },
    { "multiple-choice": 0, "short-answer": 0, essay: 0 },
  );

  const toggleCategory = (category: StudyCategory) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const resetStudyOptions = () => {
    const confirmed = window.confirm(
      "난이도와 출제 범위를 모두 초기화할까요?\n학습 기록은 삭제되지 않습니다.",
    );
    if (!confirmed) return;

    setDifficulty("easy");
    setSelectedCategories([...CATEGORIES]);
  };

  const startQuiz = () => {
    if (!questionCount || syncState === "loading") return;
    const categories = selectedCategories.join(",");
    navigate(`/study/python/quiz?difficulty=${difficulty}&categories=${categories}`);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/study"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" /> 학습 언어 목록
        </Link>
        <Link
          to="/study/report"
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-white px-4 py-2.5 text-sm font-extrabold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
        >
          <BarChart3 className="h-4 w-4" /> 내 약점 분석
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] bg-[#151d48] p-7 text-white shadow-[0_20px_50px_rgba(34,48,117,0.18)] sm:p-9">
        <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full border-[26px] border-indigo-300/10" />
        <div className="absolute bottom-0 right-36 h-28 w-28 rounded-full bg-violet-400/15 blur-2xl" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="flex items-center gap-2 text-xs font-black tracking-[0.17em] text-indigo-200">
              <Code2 className="h-4 w-4" /> PYTHON CHALLENGE
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">난이도와 출제 범위를 선택하세요</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100/70">
              이미 제출한 문제는 자동으로 제외하고, 남은 문제는 시작할 때마다 무작위 순서로 출제합니다.
            </p>
          </div>
          <div className="hidden h-24 w-24 items-center justify-center rounded-[1.75rem] border border-white/15 bg-white/10 md:flex">
            <span className="font-mono text-4xl font-black text-indigo-100">Py</span>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">01</span>
          <div>
            <h2 className="font-black text-slate-900">난이도</h2>
            <p className="text-xs text-slate-400">현재 실력에 맞는 단계를 선택하세요</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {DIFFICULTIES.map((level) => {
            const meta = DIFFICULTY_META[level];
            const active = difficulty === level;
            const remainingCount = PYTHON_QUESTION_BANK[level].filter(
              (question) => !completedQuestionIds.has(question.id),
            ).length;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`relative overflow-hidden rounded-2xl border-2 p-5 text-left transition ${
                  active
                    ? "border-indigo-500 bg-indigo-50/70 shadow-[0_10px_28px_rgba(79,70,229,0.12)]"
                    : "border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-sm`}>
                    {level === "easy" ? (
                      <Sparkles className="h-5 w-5" />
                    ) : level === "medium" ? (
                      <Layers3 className="h-5 w-5" />
                    ) : level === "hard" ? (
                      <Gauge className="h-5 w-5" />
                    ) : (
                      <Flame className="h-5 w-5" />
                    )}
                  </span>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${active ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-200 text-transparent"}`}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </div>
                <p className="mt-4 text-[10px] font-black tracking-[0.15em]" style={{ color: meta.color }}>{meta.eyebrow}</p>
                <h3 className="mt-1 text-xl font-black text-slate-900">{meta.label}</h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">{meta.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-400">
                  <span>미풀이 {remainingCount} / 100</span>
                  <span>{meta.expectedMinutes}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">02</span>
            <div>
              <h2 className="font-black text-slate-900">출제 범위</h2>
              <p className="text-xs text-slate-400">최소 한 영역을 선택하세요</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              setSelectedCategories(
                selectedCategories.length === CATEGORIES.length ? [] : CATEGORIES,
              )
            }
            className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800"
          >
            {selectedCategories.length === CATEGORIES.length ? "전체 해제" : "전체 선택"}
          </button>
        </div>

        <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
          {CATEGORIES.map((category) => {
            const meta = STUDY_CATEGORY_META[category];
            const selected = selectedCategories.includes(category);
            const categoryQuestions = PYTHON_QUESTION_BANK[difficulty].filter(
              (question) => question.category === category,
            );
            const count = categoryQuestions.filter(
              (question) => !completedQuestionIds.has(question.id),
            ).length;
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className="flex min-h-[54px] items-center gap-3 rounded-xl border-2 bg-white px-3 py-2.5 text-left transition hover:-translate-y-0.5"
                style={{
                  borderColor: selected ? meta.color : "#e8edf3",
                  opacity: selected ? 1 : 0.58,
                }}
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white"
                  style={{ backgroundColor: selected ? meta.color : "#cbd5e1" }}
                >
                  {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black text-slate-800">{meta.label}</span>
                  <span className="block truncate text-[10px] text-slate-400">{meta.description}</span>
                </span>
                <span className="shrink-0 text-[10px] font-black text-slate-400">
                  미풀이 {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">03</span>
          <div>
            <h2 className="font-black text-slate-900">실전 문제 유형</h2>
            <p className="text-xs text-slate-400">남은 세 가지 문제 유형을 무작위 순서로 섞어 출제합니다</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {QUESTION_TYPES.map((questionType) => {
            const typeMeta = STUDY_QUESTION_TYPE_META[questionType];
            return (
              <div
                key={questionType}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="rounded-full px-2.5 py-1 text-[10px] font-black text-white"
                    style={{ backgroundColor: typeMeta.color }}
                  >
                    {typeMeta.shortLabel}
                  </span>
                  <strong className="text-xl font-black text-slate-900">
                    {questionTypeCounts[questionType]}문제
                  </strong>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  {typeMeta.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-white/95 p-4 shadow-[0_18px_45px_rgba(37,54,110,0.18)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400">
            {syncState === "loading"
              ? "학습 기록 확인 중"
              : `선택한 미풀이 ${questionCount}문제 중`}
          </p>
          <p className="text-lg font-black text-slate-900">
            {DIFFICULTY_META[difficulty].label} ·{" "}
            {syncState === "loading"
              ? "잠시만 기다려 주세요"
              : `이번 회차 ${questionCount}문제`}
          </p>
        </div>
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 sm:flex">
          <button
            type="button"
            onClick={resetStudyOptions}
            aria-label="난이도와 출제 범위 초기화"
            className="inline-flex min-h-11 touch-manipulation select-none items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" /> 초기화
          </button>
          <button
            type="button"
            onClick={startQuiz}
            disabled={!questionCount || syncState === "loading"}
            className="inline-flex min-h-11 min-w-0 touch-manipulation select-none items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[170px]"
          >
            {syncState === "loading"
              ? "기록 확인 중"
              : questionCount
                ? `${questionCount}문제 풀기`
                : "선택 범위 완료"}{" "}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
