import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cloud,
  CloudOff,
  Layers3,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";
import {
  STUDY_REVIEW_TRACKS,
  type StudyReviewTrack,
} from "../../config/studyReviewTracks";
import { useAuth } from "../../hooks/useAuth";
import { useAiPythonStudyProgress } from "../../hooks/useAiPythonStudyProgress";
import { useAiPythonWeekProgress } from "../../hooks/useAiPythonWeekProgress";
import { useStudyProgress } from "../../hooks/useStudyProgress";
import { useWebStudyProgress } from "../../hooks/useWebStudyProgress";
import { countUnresolvedMistakes } from "../../utils/studyProgressStats";

const TRACK_COLORS: Record<StudyReviewTrack["tone"], string> = {
  indigo: "#4f46e5",
  cyan: "#0891b2",
  violet: "#7c3aed",
  pink: "#db2777",
  blue: "#2563eb",
};

export default function StudyReportView() {
  const { currentUser } = useAuth();
  const python = useStudyProgress();
  const web = useWebStudyProgress();
  const aiPython = useAiPythonStudyProgress();
  const aiPythonWeek = useAiPythonWeekProgress();
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const wrongCounts: Record<string, number> = {
    python: countUnresolvedMistakes(python.progress.attempts),
    web: countUnresolvedMistakes(web.progress.attempts),
    "ai-python": countUnresolvedMistakes(aiPython.progress.attempts),
    "ai-python-week1": countUnresolvedMistakes(
      aiPythonWeek.progress.attempts.filter((attempt) => attempt.week === "week1"),
    ),
    "ai-python-week2": countUnresolvedMistakes(
      aiPythonWeek.progress.attempts.filter((attempt) => attempt.week === "week2"),
    ),
  };
  const reviewOptions = STUDY_REVIEW_TRACKS.map((track) => ({
    ...track,
    wrongCount: wrongCounts[track.id] ?? 0,
  }));
  const selectedReview = reviewOptions.find(
    (option) => option.id === selectedReviewId,
  );
  const totalWrong = reviewOptions.reduce(
    (total, option) => total + option.wrongCount,
    0,
  );
  const reviewableTrackCount = reviewOptions.filter(
    (option) => option.wrongCount > 0,
  ).length;
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
        <Link
          to="/study"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-violet-700"
        >
          <ArrowLeft className="h-4 w-4" /> 전체 문제 목록
        </Link>
        <Link
          to="/study"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-violet-700"
        >
          새 문제 풀기 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(125deg,#171f4c_0%,#4b3db5_60%,#7c3aed_100%)] p-7 text-white shadow-[0_22px_55px_rgba(76,61,181,0.24)] sm:p-9">
        <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full border-[34px] border-white/[0.06]" />
        <div className="relative grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-black tracking-[0.17em] text-violet-200">
              <RotateCcw className="h-4 w-4" /> WRONG ANSWER REVIEW
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              틀린 문제 다시 풀기
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-violet-100/80">
              {currentUser?.name ?? "학습자"} 님이 푼 전체 문제에서 아직 틀린 문제만 모았습니다.
              아래에서 다시 풀 문제 세트를 직접 선택하세요.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-violet-100">
              {syncState === "synced" ? (
                <Cloud className="h-3.5 w-3.5 text-emerald-300" />
              ) : syncState === "loading" ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin text-blue-200" />
              ) : (
                <CloudOff className="h-3.5 w-3.5 text-amber-300" />
              )}
              {syncState === "synced"
                ? "전체 문제 기록 동기화됨"
                : syncState === "loading"
                  ? "전체 문제 기록 불러오는 중"
                  : "로컬 임시 저장 · 연결 시 다시 동기화"}
            </div>
          </div>
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur">
            <span className="text-3xl font-black">{totalWrong}</span>
            <span className="mt-1 text-[11px] font-bold text-violet-200">
              다시 풀 문제
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-violet-200 bg-[linear-gradient(145deg,#faf8ff,#ffffff)] p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black tracking-[0.14em] text-violet-500">
              SELECT QUESTION SET
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">
              다시 풀 문제 세트를 선택하세요
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              선택한 세트에서 문제별 최신 답안이 오답인 문제만 무작위로 출제됩니다.
            </p>
          </div>
          <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-black text-violet-700">
            전체 {totalWrong}문제
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {reviewOptions.map((option) => {
            const selected = selectedReview?.id === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedReviewId(option.id)}
                aria-pressed={selected}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  selected
                    ? "border-violet-500 bg-white shadow-[0_10px_25px_rgba(124,58,237,0.12)]"
                    : "border-slate-100 bg-white/80 hover:border-violet-200"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="rounded-full px-2.5 py-1 text-[10px] font-black"
                    style={{
                      backgroundColor: `${TRACK_COLORS[option.tone]}14`,
                      color: TRACK_COLORS[option.tone],
                    }}
                  >
                    오답 {option.wrongCount}문제
                  </span>
                  <span
                    className={`h-5 w-5 rounded-full border-[5px] bg-white ${
                      selected ? "border-violet-500" : "border-slate-200"
                    }`}
                  />
                </div>
                <h3 className="mt-4 text-sm font-black text-slate-800">
                  {option.label}
                </h3>
                <p className="mt-1 min-h-10 text-[11px] leading-5 text-slate-400">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 px-5 py-4 text-white">
          <div>
            <p className="text-[10px] font-black tracking-[0.12em] text-violet-300">
              SELECTED SET
            </p>
            <p className="mt-1 text-sm font-black">
              {selectedReview
                ? `${selectedReview.label} · 오답 ${selectedReview.wrongCount}문제`
                : "먼저 위에서 문제 세트를 선택하세요"}
            </p>
          </div>
          {selectedReview?.wrongCount ? (
            <Link
              to={selectedReview.href}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-violet-800"
            >
              <RotateCcw className="h-4 w-4" /> 선택한 오답 풀기
            </Link>
          ) : (
            <span className="rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-slate-300">
              {selectedReview ? "이 세트에는 남은 오답이 없습니다" : "세트 선택 필요"}
            </span>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <RotateCcw className="h-5 w-5" />
          </span>
          <p className="mt-4 text-xs font-bold text-slate-400">전체 남은 오답</p>
          <p className="mt-1 text-2xl font-black text-slate-900">
            {totalWrong} <span className="text-sm text-slate-400">문제</span>
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Layers3 className="h-5 w-5" />
          </span>
          <p className="mt-4 text-xs font-bold text-slate-400">복습할 문제 세트</p>
          <p className="mt-1 text-2xl font-black text-slate-900">
            {reviewableTrackCount} <span className="text-sm text-slate-400">/ 5개</span>
          </p>
        </div>
      </section>

      {totalWrong === 0 ? (
        <section className="rounded-3xl border border-dashed border-emerald-200 bg-white px-6 py-12 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-600" />
          <h2 className="mt-4 text-xl font-black text-slate-900">
            현재 다시 풀 문제가 없습니다
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            새로운 문제를 풀고 틀리면 이 화면에 문제 세트별로 자동 반영됩니다.
          </p>
        </section>
      ) : null}
    </div>
  );
}
