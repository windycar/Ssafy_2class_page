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
  LoaderCircle,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useStudyProgress, type StudySyncState } from "../../hooks/useStudyProgress";
import { useWebStudyProgress } from "../../hooks/useWebStudyProgress";
import { useAiPythonStudyProgress } from "../../hooks/useAiPythonStudyProgress";
import { useAiPythonWeekProgress } from "../../hooks/useAiPythonWeekProgress";
import { countUnresolvedMistakes } from "../../utils/studyProgressStats";

type TrackAttempt = {
  questionId: string;
  correct: boolean;
  answeredAt: string;
};

type TrackRow = {
  id: string;
  label: string;
  description: string;
  href: string;
  attempts: TrackAttempt[];
  color: string;
  barClassName: string;
  badgeClassName: string;
};

function getCombinedSyncState(states: StudySyncState[]): StudySyncState {
  if (states.some((state) => state === "loading")) return "loading";
  if (states.some((state) => state === "local")) return "local";
  return "synced";
}

export default function StudyOverviewReportView() {
  const { currentUser } = useAuth();
  const python = useStudyProgress();
  const web = useWebStudyProgress();
  const aiPython = useAiPythonStudyProgress();
  const aiWeek = useAiPythonWeekProgress();
  const week1Attempts = aiWeek.progress.attempts.filter((attempt) => attempt.week === "week1");
  const week2Attempts = aiWeek.progress.attempts.filter((attempt) => attempt.week === "week2");

  const tracks: TrackRow[] = [
    {
      id: "python",
      label: "Python",
      description: "연산자부터 예외처리까지",
      href: "/study/python/report",
      attempts: python.progress.attempts,
      color: "#4f46e5",
      barClassName: "bg-indigo-500",
      badgeClassName: "bg-indigo-50 text-indigo-700",
    },
    {
      id: "web",
      label: "Web",
      description: "HTML·CSS·반응형·UX/UI",
      href: "/study/web/report",
      attempts: web.progress.attempts,
      color: "#0891b2",
      barClassName: "bg-cyan-500",
      badgeClassName: "bg-cyan-50 text-cyan-700",
    },
    {
      id: "ai-python",
      label: "AI Python 기초",
      description: "API·NumPy·Pandas·EDA",
      href: "/study/ai-python",
      attempts: aiPython.progress.attempts,
      color: "#7c3aed",
      barClassName: "bg-violet-500",
      badgeClassName: "bg-violet-50 text-violet-700",
    },
    {
      id: "ai-week1",
      label: "AI Python 1주차",
      description: "AI·ML 기초 집중 학습",
      href: "/study/ai-python/week1",
      attempts: week1Attempts,
      color: "#db2777",
      barClassName: "bg-pink-500",
      badgeClassName: "bg-pink-50 text-pink-700",
    },
    {
      id: "ai-week2",
      label: "AI Python 2주차",
      description: "NLP 기초 집중 학습",
      href: "/study/ai-python/week2",
      attempts: week2Attempts,
      color: "#ea580c",
      barClassName: "bg-orange-500",
      badgeClassName: "bg-orange-50 text-orange-700",
    },
  ];

  const trackStats = tracks.map((track) => {
    const total = track.attempts.length;
    const correct = track.attempts.filter((attempt) => attempt.correct).length;
    return {
      ...track,
      total,
      correct,
      accuracy: total ? Math.round((correct / total) * 100) : 0,
      unresolved: countUnresolvedMistakes(track.attempts),
    };
  });
  const total = trackStats.reduce((sum, track) => sum + track.total, 0);
  const correct = trackStats.reduce((sum, track) => sum + track.correct, 0);
  const unresolved = trackStats.reduce((sum, track) => sum + track.unresolved, 0);
  const attemptedTracks = trackStats.filter((track) => track.total > 0);
  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  const weakest = [...attemptedTracks].sort(
    (a, b) => a.accuracy - b.accuracy || b.total - a.total,
  )[0];
  const syncState = getCombinedSyncState([
    python.syncState,
    web.syncState,
    aiPython.syncState,
    aiWeek.syncState,
  ]);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/study"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" /> 공부 문제 풀기
        </Link>
        <Link
          to="/study"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-indigo-700"
        >
          학습 과목 선택 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(125deg,#171f4c_0%,#3d4fb5_62%,#7256ca_100%)] p-7 text-white shadow-[0_22px_55px_rgba(47,61,139,0.23)] sm:p-9">
        <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full border-[34px] border-white/[0.06]" />
        <div className="absolute bottom-0 right-48 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />
        <div className="relative grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-black tracking-[0.17em] text-indigo-200">
              <BrainCircuit className="h-4 w-4" /> ALL LEARNING REPORT
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {currentUser?.name} 님의 전체 학습 분석
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100/75">
              Python·Web·AI Python의 모든 풀이 기록을 한곳에 합산했습니다.
              과목별 상세 기록도 바로 확인할 수 있습니다.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-indigo-100">
              {syncState === "synced" ? (
                <Cloud className="h-3.5 w-3.5 text-emerald-300" />
              ) : syncState === "loading" ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin text-blue-200" />
              ) : (
                <CloudOff className="h-3.5 w-3.5 text-amber-300" />
              )}
              {syncState === "synced"
                ? "모든 학습 기록이 클라우드와 동기화됨"
                : syncState === "loading"
                  ? "전체 학습 기록 동기화 중"
                  : "일부 기록은 로컬 저장 · 연결 시 다시 동기화"}
            </div>
          </div>
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur">
            <span className="text-3xl font-black">{accuracy}%</span>
            <span className="mt-1 text-[11px] font-bold text-indigo-200">전체 정답률</span>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ReportStat icon={<BookOpenCheck className="h-5 w-5" />} label="전체 누적 풀이" value={`${total}`} suffix="문제" tone="blue" />
        <ReportStat icon={<CheckCircle2 className="h-5 w-5" />} label="전체 정답" value={`${correct}`} suffix="개" tone="emerald" />
        <ReportStat icon={<XCircle className="h-5 w-5" />} label="복습할 오답" value={`${unresolved}`} suffix="개" tone="red" />
        <ReportStat icon={<Target className="h-5 w-5" />} label="학습한 과목" value={`${attemptedTracks.length}`} suffix="/ 5" tone="violet" />
      </section>

      {total === 0 ? (
        <section className="rounded-3xl border border-dashed border-indigo-200 bg-white px-6 py-14 text-center shadow-sm">
          <Sparkles className="mx-auto h-8 w-8 text-indigo-500" />
          <h2 className="mt-4 text-xl font-black text-slate-900">첫 학습 기록을 만들어 보세요</h2>
          <Link to="/study" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white">
            과목 선택하기 <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black tracking-[0.14em] text-indigo-500">BY LEARNING TRACK</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">과목별 학습 현황</h2>
              </div>
              <BarChart3 className="h-6 w-6 text-slate-300" />
            </div>
            <div className="mt-6 space-y-4">
              {trackStats.map((track) => (
                <Link
                  key={track.id}
                  to={track.href}
                  className="block rounded-2xl border border-slate-100 p-4 transition hover:border-indigo-200 hover:bg-slate-50/70"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: track.color }} />
                      <div>
                        <h3 className="text-sm font-black text-slate-800">{track.label}</h3>
                        <p className="text-[11px] text-slate-400">{track.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${track.badgeClassName}`}>
                        복습 {track.unresolved}
                      </span>
                      <div>
                        <strong className="block text-sm font-black text-slate-800">
                          {track.total ? `${track.accuracy}%` : "-"}
                        </strong>
                        <span className="text-[10px] text-slate-400">{track.total}문제</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${track.barClassName}`}
                      style={{ width: `${track.total ? Math.max(track.accuracy, 3) : 0}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-[linear-gradient(145deg,#fff9e8,#fffef9)] p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <BrainCircuit className="h-5 w-5" />
            </span>
            <p className="mt-5 text-xs font-black tracking-[0.14em] text-amber-700">NEXT FOCUS</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">{weakest?.label}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              현재 정답률 {weakest?.accuracy}%로, 학습한 과목 중 가장 먼저 보완하면 좋은 영역입니다.
            </p>
            {weakest && (
              <Link to={weakest.href} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-amber-800">
                이 과목 복습하기 <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </section>
      )}
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
        <span className="text-[10px] font-black tracking-[0.12em] text-slate-300">ALL DATA</span>
      </div>
      <p className="mt-4 text-xs font-bold text-slate-400">{label}</p>
      <p className="mt-0.5 text-2xl font-black text-slate-900">
        {value} <span className="text-sm text-slate-400">{suffix}</span>
      </p>
    </div>
  );
}
