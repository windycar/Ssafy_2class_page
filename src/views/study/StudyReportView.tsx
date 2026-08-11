import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  CloudOff,
  Layers3,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import {
  getPythonQuestion,
  STUDY_CATEGORY_META,
  STUDY_QUESTION_TYPE_META,
} from "../../data/questionBanks/pythonQuestionBank";
import {
  getWebQuestion,
  WEB_CATEGORY_META,
  WEB_DIFFICULTY_META,
} from "../../data/questionBanks/webQuestionBank";
import {
  AI_PYTHON_CATEGORY_META,
  getAiPythonQuestion,
} from "../../data/questionBanks/aiPythonQuestionBank";
import { getAiPythonWeekQuestion } from "../../data/questionBanks/aiPythonWeekQuestionBank";
import {
  STUDY_REVIEW_TRACKS,
  type StudyReviewTrack,
} from "../../config/studyReviewTracks";
import { useAuth } from "../../hooks/useAuth";
import { useAiPythonStudyProgress } from "../../hooks/useAiPythonStudyProgress";
import { useAiPythonWeekProgress } from "../../hooks/useAiPythonWeekProgress";
import { useStudyProgress } from "../../hooks/useStudyProgress";
import { useWebStudyProgress } from "../../hooks/useWebStudyProgress";
import { getLatestAttemptsByQuestion } from "../../utils/studyProgressStats";
import type {
  AiPythonWeek,
  AiPythonWeekDifficulty,
  AiPythonWeekQuestionType,
} from "../../types/aiPythonWeekStudy";
import type { StudyQuestionType } from "../../types/study";

type WeaknessItem = {
  id: string;
  trackId: string;
  trackLabel: string;
  href: string;
  color: string;
  categoryKey: string;
  categoryLabel: string;
  prompt: string;
  answeredAt: string;
  difficultyLabel: string;
  questionType: StudyQuestionType | AiPythonWeekQuestionType;
};

type WeaknessRow = Pick<
  WeaknessItem,
  "trackId" | "trackLabel" | "href" | "color" | "categoryKey" | "categoryLabel"
> & { count: number };

const TRACK_COLORS: Record<StudyReviewTrack["tone"], string> = {
  indigo: "#4f46e5",
  cyan: "#0891b2",
  violet: "#7c3aed",
  pink: "#db2777",
  blue: "#2563eb",
};

const WEEK_DIFFICULTY_LABELS: Record<AiPythonWeekDifficulty, string> = {
  easy: "쉬움",
  medium: "중간",
  hard: "어려움",
};

function buildWeaknessRows(items: readonly WeaknessItem[]) {
  const rows = new Map<string, WeaknessRow>();
  items.forEach((item) => {
    const key = `${item.trackId}:${item.categoryKey}`;
    const current = rows.get(key);
    rows.set(key, current
      ? { ...current, count: current.count + 1 }
      : {
          trackId: item.trackId,
          trackLabel: item.trackLabel,
          href: item.href,
          color: item.color,
          categoryKey: item.categoryKey,
          categoryLabel: item.categoryLabel,
          count: 1,
        });
  });
  return [...rows.values()].sort(
    (a, b) => b.count - a.count || a.trackLabel.localeCompare(b.trackLabel, "ko"),
  );
}

export default function StudyReportView() {
  const { currentUser } = useAuth();
  const python = useStudyProgress();
  const web = useWebStudyProgress();
  const aiPython = useAiPythonStudyProgress();
  const aiPythonWeek = useAiPythonWeekProgress();
  const [selectedReviewId, setSelectedReviewId] = useState("python");

  const trackById = useMemo(
    () => new Map(STUDY_REVIEW_TRACKS.map((track) => [track.id, track])),
    [],
  );

  const pythonTrack = trackById.get("python") as StudyReviewTrack;
  const webTrack = trackById.get("web") as StudyReviewTrack;
  const aiPythonTrack = trackById.get("ai-python") as StudyReviewTrack;
  const week1Track = trackById.get("ai-python-week1") as StudyReviewTrack;
  const week2Track = trackById.get("ai-python-week2") as StudyReviewTrack;

  const pythonLatest = getLatestAttemptsByQuestion(python.progress.attempts);
  const webLatest = getLatestAttemptsByQuestion(web.progress.attempts);
  const aiPythonLatest = getLatestAttemptsByQuestion(aiPython.progress.attempts);
  const week1Latest = getLatestAttemptsByQuestion(
    aiPythonWeek.progress.attempts.filter((attempt) => attempt.week === "week1"),
  );
  const week2Latest = getLatestAttemptsByQuestion(
    aiPythonWeek.progress.attempts.filter((attempt) => attempt.week === "week2"),
  );

  const pythonWrong: WeaknessItem[] = pythonLatest
    .filter((attempt) => !attempt.correct)
    .map((attempt) => {
      const question = getPythonQuestion(attempt.questionId);
      return {
        id: `python:${attempt.id}`,
        trackId: pythonTrack.id,
        trackLabel: pythonTrack.label,
        href: pythonTrack.href,
        color: TRACK_COLORS[pythonTrack.tone],
        categoryKey: attempt.category,
        categoryLabel: STUDY_CATEGORY_META[attempt.category].label,
        prompt: question?.prompt ?? attempt.questionId,
        answeredAt: attempt.answeredAt,
        difficultyLabel: attempt.difficulty,
        questionType: attempt.questionType ?? question?.questionType ?? "multiple-choice",
      };
    });

  const webWrong: WeaknessItem[] = webLatest
    .filter((attempt) => !attempt.correct)
    .map((attempt) => {
      const question = getWebQuestion(attempt.questionId);
      return {
        id: `web:${attempt.id}`,
        trackId: webTrack.id,
        trackLabel: webTrack.label,
        href: webTrack.href,
        color: TRACK_COLORS[webTrack.tone],
        categoryKey: attempt.category,
        categoryLabel: WEB_CATEGORY_META[attempt.category].label,
        prompt: question?.prompt ?? attempt.questionId,
        answeredAt: attempt.answeredAt,
        difficultyLabel: WEB_DIFFICULTY_META[attempt.difficulty].label,
        questionType: attempt.questionType ?? question?.questionType ?? "multiple-choice",
      };
    });

  const aiPythonWrong: WeaknessItem[] = aiPythonLatest
    .filter((attempt) => !attempt.correct)
    .map((attempt) => {
      const question = getAiPythonQuestion(attempt.questionId);
      return {
        id: `ai-python:${attempt.id}`,
        trackId: aiPythonTrack.id,
        trackLabel: aiPythonTrack.label,
        href: aiPythonTrack.href,
        color: TRACK_COLORS[aiPythonTrack.tone],
        categoryKey: attempt.category,
        categoryLabel: AI_PYTHON_CATEGORY_META[attempt.category].label,
        prompt: question?.prompt ?? attempt.questionId,
        answeredAt: attempt.answeredAt,
        difficultyLabel: "기초",
        questionType: "multiple-choice",
      };
    });

  const mapWeekWrong = (
    week: AiPythonWeek,
    track: StudyReviewTrack,
    attempts: typeof week1Latest,
  ): WeaknessItem[] => attempts
    .filter((attempt) => !attempt.correct)
    .map((attempt) => ({
      id: `${week}:${attempt.id}`,
      trackId: track.id,
      trackLabel: track.label,
      href: track.href,
      color: TRACK_COLORS[track.tone],
      categoryKey: attempt.category,
      categoryLabel: attempt.category,
      prompt: getAiPythonWeekQuestion(week, attempt.questionId)?.prompt ?? attempt.questionId,
      answeredAt: attempt.answeredAt,
      difficultyLabel: WEEK_DIFFICULTY_LABELS[attempt.difficulty],
      questionType: attempt.questionType,
    }));

  const week1Wrong = mapWeekWrong("week1", week1Track, week1Latest);
  const week2Wrong = mapWeekWrong("week2", week2Track, week2Latest);
  const wrongByTrack: Record<string, WeaknessItem[]> = {
    python: pythonWrong,
    web: webWrong,
    "ai-python": aiPythonWrong,
    "ai-python-week1": week1Wrong,
    "ai-python-week2": week2Wrong,
  };
  const allWrong = Object.values(wrongByTrack)
    .flat()
    .sort((a, b) => Date.parse(b.answeredAt) - Date.parse(a.answeredAt));
  const weaknessRows = buildWeaknessRows(allWrong);
  const weakest = weaknessRows[0];
  const maxWeaknessCount = Math.max(1, ...weaknessRows.map((row) => row.count));
  const analyzedQuestionCount = [
    pythonLatest,
    webLatest,
    aiPythonLatest,
    week1Latest,
    week2Latest,
  ].reduce((total, attempts) => total + attempts.length, 0);

  const reviewOptions = STUDY_REVIEW_TRACKS.map((track) => ({
    ...track,
    wrongCount: wrongByTrack[track.id]?.length ?? 0,
  }));
  const selectedReview =
    reviewOptions.find((option) => option.id === selectedReviewId) ?? reviewOptions[0];
  const wrongTrackCount = reviewOptions.filter((option) => option.wrongCount > 0).length;
  const syncStates = [
    python.syncState,
    web.syncState,
    aiPython.syncState,
    aiPythonWeek.syncState,
  ];
  const syncState = syncStates.some((state) => state === "loading")
    ? "loading"
    : syncStates.some((state) => state === "local")
      ? "local"
      : "synced";

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/study" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-indigo-600">
          <ArrowLeft className="h-4 w-4" /> 공부 문제 풀기
        </Link>
        <Link to="/study" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-indigo-700">
          새 문제 풀기 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(125deg,#171f4c_0%,#3d4fb5_62%,#7256ca_100%)] p-7 text-white shadow-[0_22px_55px_rgba(47,61,139,0.23)] sm:p-9">
        <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full border-[34px] border-white/[0.06]" />
        <div className="relative grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-black tracking-[0.17em] text-indigo-200">
              <BrainCircuit className="h-4 w-4" /> PERSONAL LEARNING REPORT
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {currentUser?.name} 님의 오답 기반 약점 분석
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100/75">
              Python·Web·AI Python·1주차·2주차의 문제별 최신 답안만 확인합니다. 다시 맞힌 문제는 약점에서 제외하고, 아직 틀린 문제만 합산합니다.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-indigo-100">
              {syncState === "synced" ? <Cloud className="h-3.5 w-3.5 text-emerald-300" /> : syncState === "loading" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin text-blue-200" /> : <CloudOff className="h-3.5 w-3.5 text-amber-300" />}
              {syncState === "synced" ? "모든 문제 세트 동기화됨" : syncState === "loading" ? "전체 학습 기록 동기화 중" : "로컬 임시 저장 · 연결 시 다시 동기화"}
            </div>
          </div>
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur">
            <span className="text-3xl font-black">{allWrong.length}</span>
            <span className="mt-1 text-[11px] font-bold text-indigo-200">현재 복습 오답</span>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ReportStat icon={<BookOpenCheck className="h-5 w-5" />} label="분석한 최신 답안" value={`${analyzedQuestionCount}`} suffix="문제" tone="blue" />
        <ReportStat icon={<XCircle className="h-5 w-5" />} label="미해결 오답" value={`${allWrong.length}`} suffix="문제" tone="red" />
        <ReportStat icon={<Target className="h-5 w-5" />} label="오답이 남은 영역" value={`${weaknessRows.length}`} suffix="개" tone="violet" />
        <ReportStat icon={<Layers3 className="h-5 w-5" />} label="오답 문제 세트" value={`${wrongTrackCount}`} suffix="/ 5" tone="emerald" />
      </section>

      {allWrong.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-indigo-200 bg-white px-6 py-14 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            {analyzedQuestionCount > 0 ? <CheckCircle2 className="h-7 w-7" /> : <Sparkles className="h-7 w-7" />}
          </span>
          <h2 className="mt-4 text-xl font-black text-slate-900">
            {analyzedQuestionCount > 0 ? "현재 남아 있는 오답이 없습니다" : "첫 학습 기록을 만들어 보세요"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {analyzedQuestionCount > 0 ? "모든 문제 세트의 최신 답안을 기준으로 확인했습니다." : "어떤 문제 세트든 풀면 오답만 모아 약점을 분석합니다."}
          </p>
          <Link to="/study" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white">
            문제 풀기 <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <section className="grid gap-5 lg:grid-cols-[1.35fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black tracking-[0.14em] text-indigo-500">UNRESOLVED WEAKNESSES</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">오답이 남은 영역</h2>
              </div>
              <BarChart3 className="h-6 w-6 text-slate-300" />
            </div>
            <div className="mt-6 space-y-5">
              {weaknessRows.slice(0, 12).map((row) => (
                <div key={`${row.trackId}:${row.categoryKey}`}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                      <span className="truncate text-sm font-extrabold text-slate-700">{row.trackLabel} · {row.categoryLabel}</span>
                    </div>
                    <span className="shrink-0 text-sm font-black text-slate-700">{row.count}문제</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ backgroundColor: row.color, width: `${Math.max(6, (row.count / maxWeaknessCount) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-amber-200 bg-[linear-gradient(145deg,#fff9e8,#fffef9)] p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"><BrainCircuit className="h-5 w-5" /></span>
              <p className="mt-5 text-xs font-black tracking-[0.14em] text-amber-700">NEXT FOCUS</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">{weakest.trackLabel}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {weakest.categoryLabel}에 현재 오답 {weakest.count}문제가 남아 있어 가장 먼저 복습할 영역입니다.
              </p>
              <Link to={weakest.href} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-amber-800">
                해당 오답 복습 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black tracking-[0.14em] text-violet-500">BY PROBLEM SET</p>
              <h2 className="mt-1 text-lg font-black text-slate-900">문제 세트별 오답</h2>
              <div className="mt-5 space-y-3">
                {reviewOptions.map((option) => (
                  <div key={option.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: TRACK_COLORS[option.tone] }} />
                    <span className="flex-1 text-sm font-bold text-slate-600">{option.label}</span>
                    <span className="text-sm font-black text-slate-800">{option.wrongCount}문제</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-violet-200 bg-[linear-gradient(145deg,#faf8ff,#ffffff)] p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black tracking-[0.14em] text-violet-500">SELECT REVIEW SET</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">틀린 문제 다시 풀기</h2>
            <p className="mt-2 text-sm text-slate-500">복습할 문제 세트를 선택하면 문제별 최신 답안이 오답인 문제만 출제됩니다.</p>
          </div>
          <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-black text-violet-700">총 {allWrong.length}문제</span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {reviewOptions.map((option) => {
            const selected = selectedReview.id === option.id;
            return (
              <button key={option.id} type="button" onClick={() => setSelectedReviewId(option.id)} aria-pressed={selected} className={`rounded-2xl border-2 p-4 text-left transition ${selected ? "border-violet-500 bg-white shadow-[0_10px_25px_rgba(124,58,237,0.10)]" : "border-slate-100 bg-white/80 hover:border-violet-200"}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full px-2.5 py-1 text-[10px] font-black" style={{ backgroundColor: `${TRACK_COLORS[option.tone]}14`, color: TRACK_COLORS[option.tone] }}>{option.wrongCount}문제</span>
                  <span className={`h-4 w-4 rounded-full border-4 ${selected ? "border-violet-500 bg-white" : "border-slate-200 bg-white"}`} />
                </div>
                <h3 className="mt-3 text-sm font-black text-slate-800">{option.label}</h3>
                <p className="mt-1 text-[11px] leading-5 text-slate-400">{option.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900 px-4 py-4 text-white sm:px-5">
          <div>
            <p className="text-[10px] font-black tracking-[0.12em] text-violet-300">SELECTED</p>
            <p className="mt-1 text-sm font-black">{selectedReview.label} · 오답 {selectedReview.wrongCount}문제</p>
          </div>
          {selectedReview.wrongCount > 0 ? (
            <Link to={selectedReview.href} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-violet-800"><RotateCcw className="h-4 w-4" /> 선택한 오답 복습</Link>
          ) : (
            <span className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-slate-300">복습할 오답 없음</span>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <p className="text-xs font-black tracking-[0.14em] text-red-500">WRONG ANSWERS</p>
        <h2 className="mt-1 text-xl font-black text-slate-900">전체 문제 세트 최근 오답</h2>
        {allWrong.length ? (
          <div className="mt-5 divide-y divide-slate-100">
            {allWrong.slice(0, 8).map((item) => (
              <div key={item.id} className="flex items-start gap-3 py-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500"><XCircle className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-black">
                    <span style={{ color: item.color }}>{item.trackLabel}</span>
                    <span className="text-slate-400">{item.categoryLabel}</span>
                    <span className="text-slate-300">{item.difficultyLabel}</span>
                    <span style={{ color: STUDY_QUESTION_TYPE_META[item.questionType].color }}>{STUDY_QUESTION_TYPE_META[item.questionType].shortLabel}</span>
                  </div>
                  <p className="mt-1 truncate text-sm font-bold text-slate-700">{item.prompt}</p>
                </div>
                <span className="hidden text-[10px] text-slate-400 sm:block">{new Date(item.answeredAt).toLocaleDateString("ko-KR")}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl bg-emerald-50 px-5 py-8 text-center"><CheckCircle2 className="mx-auto h-7 w-7 text-emerald-600" /><p className="mt-2 text-sm font-extrabold text-emerald-800">현재 남은 오답이 없습니다.</p></div>
        )}
      </section>
    </div>
  );
}

function ReportStat({
  icon,
  label,
  value,
  suffix,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix: string;
  tone: "blue" | "emerald" | "red" | "violet";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-500",
    violet: "bg-violet-50 text-violet-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</span>
        <span className="text-[10px] font-black tracking-[0.12em] text-slate-300">MY DATA</span>
      </div>
      <p className="mt-4 text-xs font-bold text-slate-400">{label}</p>
      <p className="mt-0.5 text-2xl font-black text-slate-900">{value} <span className="text-sm text-slate-400">{suffix}</span></p>
    </div>
  );
}
