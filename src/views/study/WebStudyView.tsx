import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  ClipboardCheck,
  Code2,
  FileText,
  Gauge,
  Grid3X3,
  Layers3,
  MonitorSmartphone,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  WEB_CATEGORY_META,
  WEB_DIFFICULTY_META,
  WEB_QUESTION_BANK,
  WEB_QUESTION_TYPE_META,
} from "../../data/questionBanks/webQuestionBank";
import { useWebStudyProgress } from "../../hooks/useWebStudyProgress";
import type { StudyQuestionType } from "../../types/study";
import type { WebCategory, WebDifficulty } from "../../types/webStudy";

const CATEGORIES = Object.keys(WEB_CATEGORY_META) as WebCategory[];
const DIFFICULTIES = Object.keys(WEB_DIFFICULTY_META) as WebDifficulty[];
const QUESTION_TYPES = Object.keys(WEB_QUESTION_TYPE_META) as StudyQuestionType[];

export default function WebStudyView() {
  const navigate = useNavigate();
  const { progress, resetProgress, syncState } = useWebStudyProgress();
  const [difficulty, setDifficulty] = useState<WebDifficulty>("easy");
  const [selectedCategories, setSelectedCategories] = useState<WebCategory[]>(CATEGORIES);

  const completedQuestionIds = useMemo(
    () => new Set(progress.attempts.map((attempt) => attempt.questionId)),
    [progress.attempts],
  );
  const selectedQuestions = useMemo(
    () =>
      WEB_QUESTION_BANK[difficulty].filter((question) =>
        selectedCategories.includes(question.category),
      ),
    [difficulty, selectedCategories],
  );
  const remainingQuestions = useMemo(
    () => selectedQuestions.filter((question) => !completedQuestionIds.has(question.id)),
    [completedQuestionIds, selectedQuestions],
  );
  const resettableCount = useMemo(
    () =>
      progress.attempts.filter(
        (attempt) =>
          attempt.difficulty === difficulty &&
          selectedCategories.includes(attempt.category),
      ).length,
    [difficulty, progress.attempts, selectedCategories],
  );
  const questionTypeCounts = QUESTION_TYPES.reduce<Record<StudyQuestionType, number>>(
    (counts, questionType) => {
      counts[questionType] = remainingQuestions.filter(
        (question) => question.questionType === questionType,
      ).length;
      return counts;
    },
    { "multiple-choice": 0, "short-answer": 0, essay: 0 },
  );

  const toggleCategory = (category: WebCategory) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const startQuiz = () => {
    if (!remainingQuestions.length || syncState === "loading") return;
    navigate(
      `/study/web/quiz?difficulty=${difficulty}&categories=${selectedCategories.join(",")}`,
    );
  };

  const resetSelectedProgress = async () => {
    if (!resettableCount || !selectedCategories.length || syncState === "loading") return;
    const confirmed = window.confirm(
      `현재 선택한 학생의 ${WEB_DIFFICULTY_META[difficulty].label} · 선택한 ${selectedCategories.length}개 범위 풀이 기록 ${resettableCount}개를 영구 삭제하고 초기화할까요?\n삭제한 기록은 복구할 수 없습니다.`,
    );
    if (!confirmed) return;

    const reset = await resetProgress(difficulty, selectedCategories);
    if (reset) {
      toast.success(`현재 학생의 선택 범위 풀이 기록 ${resettableCount}개를 영구 초기화했습니다.`);
    } else {
      toast.error("풀이 기록을 초기화하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/study"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-cyan-700"
        >
          <ArrowLeft className="h-4 w-4" /> 학습 언어 목록
        </Link>
        <Link
          to="/study/report"
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-100 bg-white px-4 py-2.5 text-sm font-extrabold text-cyan-800 shadow-sm transition hover:bg-cyan-50"
        >
          <BarChart3 className="h-4 w-4" /> 틀린 문제 다시 풀기
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(125deg,#061d2a_0%,#075c71_58%,#1f7c8e_100%)] p-7 text-white shadow-[0_22px_55px_rgba(8,83,102,0.24)] sm:p-9">
        <div className="absolute -right-14 -top-20 h-60 w-60 rounded-full border-[36px] border-cyan-100/[0.07]" />
        <div className="absolute bottom-0 right-40 h-36 w-36 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="relative grid items-center gap-7 md:grid-cols-[1fr_auto]">
          <div>
            <p className="flex items-center gap-2 text-xs font-black tracking-[0.17em] text-cyan-200">
              <Code2 className="h-4 w-4" /> WEB CLASSROOM · 300 QUESTIONS
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              웹 과목평가, 코드와 화면을 함께 읽으세요.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-cyan-50/75">
              PDF 강의자료 범위만 반영한 객관식·단답형·서술형 300문항입니다.
              제출 즉시 정답과 해설을 확인하고, 풀이 기록은 자동 저장됩니다.
            </p>
          </div>
          <div className="hidden h-28 w-28 items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur md:flex">
            <MonitorSmartphone className="h-12 w-12 text-cyan-100" />
          </div>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <ExamInfo
          icon={<CalendarDays className="h-5 w-5" />}
          title="시험 일정"
          value="매주 월요일"
          helper="범위는 전주 목·금요일 공지"
          tone="cyan"
        />
        <ExamInfo
          icon={<ClipboardCheck className="h-5 w-5" />}
          title="문제 유형"
          value="객관식 · 단답형 · 서술형"
          helper="이론 지식과 코드 해석 중심"
          tone="violet"
        />
        <ExamInfo
          icon={<FileText className="h-5 w-5" />}
          title="답안 원칙"
          value="정확한 표기 · 서술 20자+"
          helper="대소문자와 기호까지 채점"
          tone="amber"
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <StepTitle number="01" title="난이도" helper="웹 트랙은 쉬움·중간·어려움 세 단계입니다" />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {DIFFICULTIES.map((level) => {
            const meta = WEB_DIFFICULTY_META[level];
            const active = difficulty === level;
            const remainingCount = WEB_QUESTION_BANK[level].filter(
              (question) => !completedQuestionIds.has(question.id),
            ).length;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`relative overflow-hidden rounded-2xl border-2 p-5 text-left transition ${
                  active
                    ? "border-cyan-600 bg-cyan-50/70 shadow-[0_10px_28px_rgba(8,145,178,0.12)]"
                    : "border-slate-100 bg-white hover:border-cyan-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-sm`}>
                    {level === "easy" ? <Sparkles className="h-5 w-5" /> : level === "medium" ? <Layers3 className="h-5 w-5" /> : <Gauge className="h-5 w-5" />}
                  </span>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${active ? "border-cyan-600 bg-cyan-600 text-white" : "border-slate-200 text-transparent"}`}>
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StepTitle number="02" title="출제 범위" helper="최소 한 영역을 선택하세요" />
          <button
            type="button"
            onClick={() =>
              setSelectedCategories(
                selectedCategories.length === CATEGORIES.length ? [] : CATEGORIES,
              )
            }
            className="text-xs font-extrabold text-cyan-700 hover:text-cyan-900"
          >
            {selectedCategories.length === CATEGORIES.length ? "전체 해제" : "전체 선택"}
          </button>
        </div>
        <div className="mt-5 grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {CATEGORIES.map((category) => {
            const meta = WEB_CATEGORY_META[category];
            const selected = selectedCategories.includes(category);
            const count = WEB_QUESTION_BANK[difficulty].filter(
              (question) =>
                question.category === category && !completedQuestionIds.has(question.id),
            ).length;
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className="flex min-h-[62px] items-center gap-3 rounded-xl border-2 bg-white px-3 py-2.5 text-left transition hover:-translate-y-0.5"
                style={{ borderColor: selected ? meta.color : "#e8edf3", opacity: selected ? 1 : 0.56 }}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white" style={{ backgroundColor: selected ? meta.color : "#cbd5e1" }}>
                  {selected && <Check className="h-4 w-4" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black text-slate-800">{meta.label}</span>
                  <span className="block truncate text-[10px] text-slate-400">{meta.description}</span>
                </span>
                <span className="shrink-0 text-[10px] font-black text-slate-400">{count}문제</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <StepTitle number="03" title="실전 문제 유형" helper="세 유형을 무작위 순서로 섞어 출제합니다" />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {QUESTION_TYPES.map((questionType) => {
            const meta = WEB_QUESTION_TYPE_META[questionType];
            return (
              <div key={questionType} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-black" style={{ color: meta.color }}>{meta.label}</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-600 shadow-sm">
                    {questionTypeCounts[questionType]}문제
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">{meta.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="sticky bottom-4 z-20 rounded-2xl border border-cyan-200 bg-white/95 p-4 shadow-[0_18px_50px_rgba(8,91,113,0.18)] backdrop-blur sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-800">
            <Grid3X3 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black text-slate-900">
              {WEB_DIFFICULTY_META[difficulty].label} · {selectedCategories.length}개 영역
            </p>
            <p className="text-xs text-slate-500">미풀이 {remainingQuestions.length}문제를 무작위 출제</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-0 sm:flex sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={() => {
              setDifficulty("easy");
              setSelectedCategories(CATEGORIES);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
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
            disabled={!remainingQuestions.length || !selectedCategories.length || syncState === "loading"}
            className="col-span-2 inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-700 px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-1 sm:flex-none"
          >
            문제 풀이 시작 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

function StepTitle({ number, title, helper }: { number: string; title: string; helper: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">{number}</span>
      <div>
        <h2 className="font-black text-slate-900">{title}</h2>
        <p className="text-xs text-slate-400">{helper}</p>
      </div>
    </div>
  );
}

function ExamInfo({ icon, title, value, helper, tone }: { icon: React.ReactNode; title: string; value: string; helper: string; tone: "cyan" | "violet" | "amber" }) {
  const tones = {
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${tones[tone]}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-400">{title}</p>
        <p className="mt-0.5 truncate text-sm font-black text-slate-900">{value}</p>
        <p className="mt-0.5 text-[11px] text-slate-400">{helper}</p>
      </div>
    </div>
  );
}
