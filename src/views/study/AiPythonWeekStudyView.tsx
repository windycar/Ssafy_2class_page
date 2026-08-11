import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  FileQuestion,
  Gauge,
  Layers3,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AI_PYTHON_WEEK_META,
  AI_PYTHON_WEEK_QUESTION_BANKS,
  getAiPythonWeekCategories,
  isAiPythonWeek,
} from "../../data/questionBanks/aiPythonWeekQuestionBank";
import { useAiPythonWeekProgress } from "../../hooks/useAiPythonWeekProgress";
import type {
  AiPythonWeek,
  AiPythonWeekDifficulty,
  AiPythonWeekQuestionType,
} from "../../types/aiPythonWeekStudy";

const DIFFICULTIES: AiPythonWeekDifficulty[] = ["easy", "medium", "hard"];
const QUESTION_TYPES: AiPythonWeekQuestionType[] = [
  "multiple-choice",
  "short-answer",
  "essay",
];

const DIFFICULTY_META: Record<
  AiPythonWeekDifficulty,
  { label: string; description: string; color: string; gradient: string }
> = {
  easy: {
    label: "초급",
    description: "핵심 개념과 용어 확인",
    color: "#059669",
    gradient: "from-emerald-500 to-teal-500",
  },
  medium: {
    label: "중급",
    description: "개념 연결과 응용 판단",
    color: "#4f46e5",
    gradient: "from-indigo-500 to-violet-500",
  },
  hard: {
    label: "고급",
    description: "복합 개념과 심화 분석",
    color: "#e11d48",
    gradient: "from-rose-500 to-fuchsia-600",
  },
};

const TYPE_META: Record<
  AiPythonWeekQuestionType,
  { label: string; color: string }
> = {
  "multiple-choice": { label: "객관식", color: "#4f46e5" },
  "short-answer": { label: "단답형", color: "#059669" },
  essay: { label: "서술형", color: "#d97706" },
};

const CATEGORY_COLORS = [
  "#7c3aed",
  "#2563eb",
  "#0891b2",
  "#0f9f6e",
  "#ca8a04",
  "#ea580c",
  "#e11d48",
  "#9333ea",
];

function getAvailableCategoriesForDifficulty(
  week: AiPythonWeek,
  difficulty: AiPythonWeekDifficulty,
) {
  return [
    ...new Set(
      AI_PYTHON_WEEK_QUESTION_BANKS[week][difficulty].map(
        (question) => question.category,
      ),
    ),
  ];
}

export default function AiPythonWeekStudyView() {
  const { week: weekParam } = useParams();

  if (!isAiPythonWeek(weekParam)) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
        <h1 className="text-2xl font-black text-slate-900">주차를 찾을 수 없습니다.</h1>
        <Link to="/study" className="mt-5 inline-flex font-bold text-violet-700">
          학습 과목으로 돌아가기
        </Link>
      </section>
    );
  }

  return <AiPythonWeekStudyContent key={weekParam} week={weekParam} />;
}

function AiPythonWeekStudyContent({ week }: { week: AiPythonWeek }) {
  const navigate = useNavigate();
  const { progress, resetProgress } = useAiPythonWeekProgress();
  const categories = useMemo(() => getAiPythonWeekCategories(week), [week]);
  const [difficulty, setDifficulty] = useState<AiPythonWeekDifficulty>("easy");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    getAvailableCategoriesForDifficulty(week, "easy"),
  );
  const availableCategories = useMemo(
    () => getAvailableCategoriesForDifficulty(week, difficulty),
    [difficulty, week],
  );

  const completedQuestionIds = useMemo(
    () =>
      new Set(
        progress.attempts
          .filter((attempt) => attempt.week === week)
          .map((attempt) => attempt.questionId),
      ),
    [progress.attempts, week],
  );

  const questions = useMemo(
    () =>
      AI_PYTHON_WEEK_QUESTION_BANKS[week][difficulty].filter((question) =>
        selectedCategories.includes(question.category),
      ),
    [difficulty, selectedCategories, week],
  );
  const remainingQuestions = useMemo(
    () => questions.filter((question) => !completedQuestionIds.has(question.id)),
    [completedQuestionIds, questions],
  );
  const resettableCount = useMemo(
    () =>
      progress.attempts.filter(
        (attempt) =>
          attempt.week === week &&
          attempt.difficulty === difficulty &&
          selectedCategories.includes(attempt.category),
      ).length,
    [difficulty, progress.attempts, selectedCategories, week],
  );
  const typeCounts = useMemo(
    () =>
      Object.fromEntries(
        QUESTION_TYPES.map((type) => [
          type,
          remainingQuestions.filter((question) => question.questionType === type)
            .length,
        ]),
      ) as Record<AiPythonWeekQuestionType, number>,
    [remainingQuestions],
  );

  const meta = AI_PYTHON_WEEK_META[week];
  const questionsPerDifficulty =
    AI_PYTHON_WEEK_QUESTION_BANKS[week]["easy"].length;
  const allSelected =
    availableCategories.length > 0 &&
    availableCategories.every((category) =>
      selectedCategories.includes(category),
    );

  const startQuiz = () => {
    if (!remainingQuestions.length || !selectedCategories.length) return;
    const params = new URLSearchParams({
      difficulty,
      categories: selectedCategories.join(","),
    });
    navigate(`/study/ai-python/${week}/quiz?${params.toString()}`);
  };

  const resetSelectedProgress = async () => {
    if (!resettableCount) return;
    const confirmed = window.confirm(
      `${meta.title} · ${DIFFICULTY_META[difficulty].label}의 선택 범위 풀이 기록 ${resettableCount}개를 초기화할까요?`,
    );
    if (!confirmed) return;
    const reset = await resetProgress(week, difficulty, selectedCategories);
    if (reset) {
      toast.success(`풀이 기록 ${resettableCount}개를 초기화했습니다.`);
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

      <section
        className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${meta.gradient} p-7 text-white shadow-[0_22px_55px_rgba(76,29,149,0.22)] sm:p-9`}
      >
        <div className="absolute -right-14 -top-20 h-60 w-60 rounded-full border-[36px] border-white/[0.06]" />
        <img
          src={meta.imageSrc}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-2 h-40 w-40 object-contain drop-shadow-[0_18px_28px_rgba(20,15,60,0.34)] sm:right-8 sm:h-52 sm:w-52"
        />
        <div className="relative max-w-[72%] sm:max-w-[70%]">
          <p className="flex items-center gap-2 text-xs font-black tracking-[0.17em] text-white/75">
            <BrainCircuit className="h-4 w-4" /> AI PYTHON · {meta.weekLabel} · {meta.questionCount} QUESTIONS
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {meta.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
            {meta.description} 난이도마다 {questionsPerDifficulty}문제씩 준비되어 있습니다.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
            01
          </span>
          <div>
            <h2 className="font-black text-slate-900">난이도</h2>
            <p className="text-xs text-slate-400">각 난이도별 {questionsPerDifficulty}문제</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {DIFFICULTIES.map((level) => {
            const levelMeta = DIFFICULTY_META[level];
            const active = level === difficulty;
            const levelQuestions = AI_PYTHON_WEEK_QUESTION_BANKS[week][level];
            const remaining = levelQuestions.filter(
              (question) => !completedQuestionIds.has(question.id),
            ).length;
            return (
              <button
                key={level}
                type="button"
                onClick={() => {
                  setDifficulty(level);
                  setSelectedCategories(
                    getAvailableCategoriesForDifficulty(week, level),
                  );
                }}
                className={`rounded-2xl border-2 p-5 text-left transition ${
                  active
                    ? "border-violet-500 bg-violet-50 shadow-[0_10px_28px_rgba(124,58,237,0.12)]"
                    : "border-slate-100 hover:border-violet-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${levelMeta.gradient} text-white`}
                  >
                    {level === "easy" ? (
                      <Sparkles className="h-5 w-5" />
                    ) : level === "medium" ? (
                      <Layers3 className="h-5 w-5" />
                    ) : (
                      <Gauge className="h-5 w-5" />
                    )}
                  </span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      active
                        ? "border-violet-500 bg-violet-500 text-white"
                        : "border-slate-200 text-transparent"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-slate-900">
                  {levelMeta.label}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{levelMeta.description}</p>
                <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-400">
                  {remaining === 0
                    ? `${levelQuestions.length}문제 풀이 완료`
                    : `미풀이 ${remaining} / ${levelQuestions.length}`}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
              02
            </span>
            <div>
              <h2 className="font-black text-slate-900">출제 범위</h2>
              <p className="text-xs text-slate-400">
                현재 난이도: {availableCategories.length}개 영역 출제 가능 · {categories.length - availableCategories.length}개 영역 문제 없음
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              setSelectedCategories(allSelected ? [] : availableCategories)
            }
            className="text-xs font-extrabold text-violet-700"
          >
            {allSelected ? "전체 해제" : "전체 선택"}
          </button>
        </div>
        <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => {
            const categoryQuestions = AI_PYTHON_WEEK_QUESTION_BANKS[week][
              difficulty
            ].filter((question) => question.category === category);
            const hasQuestions = categoryQuestions.length > 0;
            const selected =
              hasQuestions && selectedCategories.includes(category);
            const remaining = categoryQuestions.filter(
              (question) => !completedQuestionIds.has(question.id),
            ).length;
            const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
            return (
              <button
                key={category}
                type="button"
                disabled={!hasQuestions}
                onClick={() =>
                  setSelectedCategories((current) =>
                    current.includes(category)
                      ? current.filter((item) => item !== category)
                      : categories.filter(
                          (item) => item === category || current.includes(item),
                        ),
                  )
                }
                className="flex min-h-14 items-center gap-3 rounded-xl border-2 bg-white px-3 py-2.5 text-left transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-50"
                style={{
                  borderColor: selected ? color : "#e8edf3",
                  opacity: !hasQuestions ? 0.48 : selected ? 1 : 0.62,
                }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white"
                  style={{ backgroundColor: selected ? color : "#cbd5e1" }}
                >
                  {selected ? <Check className="h-3.5 w-3.5" /> : null}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-black text-slate-800">
                  {category}
                </span>
                <span className="shrink-0 text-[10px] font-black text-slate-400">
                  {!hasQuestions
                    ? "이 난이도 문제 없음"
                    : remaining === 0
                      ? "풀이 완료"
                      : `미풀이 ${remaining} / ${categoryQuestions.length}`}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
            03
          </span>
          <div>
            <h2 className="font-black text-slate-900">문제 유형</h2>
            <p className="text-xs text-slate-400">객관식·단답형·서술형 혼합 출제</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {QUESTION_TYPES.map((type) => (
            <div
              key={type}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-black text-white"
                  style={{ backgroundColor: TYPE_META[type].color }}
                >
                  {TYPE_META[type].label}
                </span>
                <strong className="text-xl font-black text-slate-900">
                  {typeCounts[type]}문제
                </strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border border-violet-200 bg-white/95 p-4 shadow-[0_18px_50px_rgba(91,33,182,0.18)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <FileQuestion className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black text-slate-900">
              {selectedCategories.length
                ? `${DIFFICULTY_META[difficulty].label} · 미풀이 ${remainingQuestions.length}문제`
                : "출제 범위를 선택하세요"}
            </p>
            <p className="text-xs text-slate-500">
              선택 범위의 남은 문제를 무작위로 출제합니다
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => setSelectedCategories(availableCategories)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-500"
          >
            <RotateCcw className="h-3.5 w-3.5" /> 선택 초기화
          </button>
          <button
            type="button"
            onClick={() => void resetSelectedProgress()}
            disabled={!resettableCount}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2.5 text-xs font-bold text-rose-600 disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" /> 기록 {resettableCount}개 초기화
          </button>
          <button
            type="button"
            onClick={startQuiz}
            disabled={!remainingQuestions.length || !selectedCategories.length}
            className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-violet-800 disabled:opacity-40 sm:col-span-1"
          >
            {remainingQuestions.length}문제 풀기 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
