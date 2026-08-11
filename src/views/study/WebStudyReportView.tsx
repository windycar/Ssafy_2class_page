import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Cloud,
  CloudOff,
  LoaderCircle,
  MonitorSmartphone,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import {
  getWebQuestion,
  WEB_CATEGORY_META,
  WEB_DIFFICULTY_META,
  WEB_QUESTION_TYPE_META,
} from "../../data/questionBanks/webQuestionBank";
import { useAuth } from "../../hooks/useAuth";
import { useWebStudyProgress } from "../../hooks/useWebStudyProgress";
import { getLatestAttemptsByQuestion } from "../../utils/studyProgressStats";
import type { WebCategory, WebDifficulty } from "../../types/webStudy";

const CATEGORIES = Object.keys(WEB_CATEGORY_META) as WebCategory[];
const DIFFICULTIES: WebDifficulty[] = ["easy", "medium", "hard"];

export default function WebStudyReportView() {
  const { currentUser } = useAuth();
  const { progress, summary, syncState } = useWebStudyProgress();
  const categoryRows = CATEGORIES.map((category) => {
    const stats = summary.byCategory[category];
    return {
      category,
      ...stats,
      accuracy: stats.total ? Math.round((stats.correct / stats.total) * 100) : 0,
    };
  });
  const attemptedRows = categoryRows.filter((row) => row.total > 0);
  const weakest = [...attemptedRows].sort(
    (a, b) => a.accuracy - b.accuracy || b.total - a.total,
  )[0];
  const difficultyRows = DIFFICULTIES.map((difficulty) => {
    const attempts = progress.attempts.filter((attempt) => attempt.difficulty === difficulty);
    const correct = attempts.filter((attempt) => attempt.correct).length;
    return {
      difficulty,
      total: attempts.length,
      accuracy: attempts.length ? Math.round((correct / attempts.length) * 100) : 0,
    };
  });
  const unresolvedMistakes = getLatestAttemptsByQuestion(progress.attempts).filter(
    (attempt) => !attempt.correct,
  );
  const recentMistakes = unresolvedMistakes
    .slice(0, 6)
    .map((attempt) => ({ attempt, question: getWebQuestion(attempt.questionId) }))
    .filter((item) => item.question);
  const uniqueWrongCount = unresolvedMistakes.length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/study/web" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-cyan-700">
          <ArrowLeft className="h-4 w-4" /> Web 강의실
        </Link>
        <Link to="/study/web" className="inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-cyan-800">
          새 문제 풀기 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(125deg,#06242f_0%,#087a8c_60%,#159478_100%)] p-7 text-white shadow-[0_22px_55px_rgba(8,91,113,0.24)] sm:p-9">
        <div className="absolute -right-14 -top-16 h-56 w-56 rounded-full border-[34px] border-white/[0.06]" />
        <div className="relative grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-black tracking-[0.17em] text-cyan-200">
              <MonitorSmartphone className="h-4 w-4" /> WEB LEARNING REPORT
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{currentUser?.name} 님의 Web 약점 분석</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-cyan-50/75">
              HTML부터 UX/UI까지 풀이 기록을 비교해 가장 먼저 복습할 영역을 알려드립니다.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-cyan-50">
              {syncState === "synced" ? <Cloud className="h-3.5 w-3.5 text-emerald-300" /> : syncState === "loading" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <CloudOff className="h-3.5 w-3.5 text-amber-300" />}
              {syncState === "synced" ? "클라우드에 저장됨" : syncState === "loading" ? "풀이 기록 동기화 중" : "로컬 저장 · 연결 시 다시 동기화"}
            </div>
          </div>
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur">
            <span className="text-3xl font-black">{summary.accuracy}%</span>
            <span className="mt-1 text-[11px] font-bold text-cyan-100">전체 정답률</span>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ReportStat icon={<BookOpenCheck className="h-5 w-5" />} label="누적 풀이" value={`${summary.total}`} suffix="문제" tone="blue" />
        <ReportStat icon={<CheckCircle2 className="h-5 w-5" />} label="맞힌 문제" value={`${summary.correct}`} suffix="개" tone="emerald" />
        <ReportStat icon={<XCircle className="h-5 w-5" />} label="복습할 오답" value={`${uniqueWrongCount}`} suffix="개" tone="red" />
        <ReportStat icon={<Target className="h-5 w-5" />} label="분석한 영역" value={`${attemptedRows.length}`} suffix="/ 6" tone="violet" />
      </section>

      {summary.total === 0 ? (
        <section className="rounded-3xl border border-dashed border-cyan-200 bg-white px-6 py-14 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
            <Sparkles className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-xl font-black text-slate-900">첫 Web 학습 기록을 만들어 보세요</h2>
          <p className="mt-2 text-sm text-slate-500">문제를 풀면 영역별 정답률과 복습 우선순위가 표시됩니다.</p>
          <Link to="/study/web" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-5 py-3 text-sm font-extrabold text-white">
            Web 문제 시작 <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <>
          <section className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black tracking-[0.14em] text-cyan-700">TOPIC ACCURACY</p>
                  <h2 className="mt-1 text-xl font-black text-slate-900">영역별 정답률</h2>
                </div>
                <BarChart3 className="h-6 w-6 text-slate-300" />
              </div>
              <div className="mt-6 space-y-5">
                {categoryRows.map((row) => {
                  const meta = WEB_CATEGORY_META[row.category];
                  return (
                    <div key={row.category}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
                          <span className="truncate text-sm font-extrabold text-slate-700">{meta.label}</span>
                          <span className="text-[10px] font-bold text-slate-300">{row.total}문제</span>
                        </div>
                        <span className="text-sm font-black text-slate-700">{row.total ? `${row.accuracy}%` : "-"}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full transition-all" style={{ backgroundColor: meta.color, width: `${row.total ? Math.max(row.accuracy, 3) : 0}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-amber-200 bg-[linear-gradient(145deg,#fff9e8,#fffef9)] p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Target className="h-5 w-5" />
                </span>
                <p className="mt-5 text-xs font-black tracking-[0.14em] text-amber-700">NEXT FOCUS</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">{weakest ? WEB_CATEGORY_META[weakest.category].label : "새 영역 도전"}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {weakest ? `현재 ${weakest.accuracy}%의 정답률로 가장 먼저 보완하면 좋은 영역입니다.` : "아직 비교할 기록이 충분하지 않습니다."}
                </p>
                {weakest && (
                  <Link to={`/study/web/quiz?difficulty=easy&categories=${weakest.category}`} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-amber-800">
                    쉬움부터 복습 <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black tracking-[0.14em] text-violet-500">BY LEVEL</p>
                    <h2 className="mt-1 text-lg font-black text-slate-900">난이도별 성과</h2>
                  </div>
                  <TrendingUp className="h-5 w-5 text-slate-300" />
                </div>
                <div className="mt-5 space-y-3">
                  {difficultyRows.map((row) => (
                    <div key={row.difficulty} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: WEB_DIFFICULTY_META[row.difficulty].color }} />
                      <span className="flex-1 text-sm font-bold text-slate-600">{WEB_DIFFICULTY_META[row.difficulty].label}</span>
                      <span className="text-[11px] text-slate-400">{row.total}문제</span>
                      <span className="w-10 text-right text-sm font-black text-slate-800">{row.total ? `${row.accuracy}%` : "-"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black tracking-[0.14em] text-red-500">WRONG ANSWERS</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">최근 오답</h2>
              </div>
              {uniqueWrongCount > 0 && (
                <Link to="/study/web/quiz?mode=wrong" className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-extrabold text-red-700 hover:bg-red-100">
                  <RotateCcw className="h-4 w-4" /> 오답 다시 풀기
                </Link>
              )}
            </div>
            {recentMistakes.length ? (
              <div className="mt-5 divide-y divide-slate-100">
                {recentMistakes.map(({ attempt, question }) => (
                  <div key={attempt.id} className="flex items-start gap-3 py-4">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                      <XCircle className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black" style={{ color: WEB_CATEGORY_META[attempt.category].color }}>{WEB_CATEGORY_META[attempt.category].label}</span>
                        <span className="text-[10px] font-bold text-slate-300">{WEB_DIFFICULTY_META[attempt.difficulty].label}</span>
                        <span className="text-[10px] font-black" style={{ color: WEB_QUESTION_TYPE_META[attempt.questionType].color }}>{WEB_QUESTION_TYPE_META[attempt.questionType].shortLabel}</span>
                      </div>
                      <p className="mt-1 truncate text-sm font-bold text-slate-700">{question?.prompt.split("\n")[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-emerald-50 px-5 py-8 text-center">
                <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-600" />
                <p className="mt-2 text-sm font-extrabold text-emerald-800">아직 오답이 없습니다.</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function ReportStat({ icon, label, value, suffix, tone }: { icon: React.ReactNode; label: string; value: string; suffix: string; tone: "blue" | "emerald" | "red" | "violet" }) {
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
        <span className="text-[10px] font-black tracking-[0.12em] text-slate-300">WEB DATA</span>
      </div>
      <p className="mt-4 text-xs font-bold text-slate-400">{label}</p>
      <p className="mt-0.5 text-2xl font-black text-slate-900">{value} <span className="text-sm text-slate-400">{suffix}</span></p>
    </div>
  );
}
