import { Link } from "react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Sparkles,
  Target,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useStudyProgress } from "../../hooks/useStudyProgress";
import { useWebStudyProgress } from "../../hooks/useWebStudyProgress";
import { useAiPythonStudyProgress } from "../../hooks/useAiPythonStudyProgress";
import { useAiPythonWeekProgress } from "../../hooks/useAiPythonWeekProgress";
import { AI_PYTHON_WEEK_META } from "../../data/questionBanks/aiPythonWeekMeta";
import pythonHero from "../../assets/study/python-study-hero.png";

export default function StudyHubView() {
  const { currentUser } = useAuth();
  const { summary: pythonSummary } = useStudyProgress();
  const { summary: webSummary } = useWebStudyProgress();
  const { summary: aiPythonSummary } = useAiPythonStudyProgress();
  const { summary: aiPythonWeekSummary } = useAiPythonWeekProgress();
  const total =
    pythonSummary.total +
    webSummary.total +
    aiPythonSummary.total +
    aiPythonWeekSummary.total;
  const correct =
    pythonSummary.correct +
    webSummary.correct +
    aiPythonSummary.correct +
    aiPythonWeekSummary.correct;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="space-y-7 pb-6">
      <section className="relative min-h-[330px] overflow-hidden rounded-[2rem] bg-[#111b41] text-white shadow-[0_24px_60px_rgba(32,49,115,0.22)]">
        <img
          src={pythonHero}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,22,58,0.98)_0%,rgba(23,39,95,0.93)_39%,rgba(37,56,131,0.25)_72%,rgba(25,37,89,0.06)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(107,136,255,0.32),transparent_32%)]" />

        <div className="relative z-10 flex min-h-[330px] max-w-[650px] flex-col justify-center p-7 sm:p-10">
          <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-black tracking-[0.18em] text-blue-100 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            G2 STUDY LAB
          </div>
          <p className="mb-2 text-sm font-bold text-blue-200">
            {currentUser?.name} 님, 오늘도 한 문제씩 성장해 볼까요?
          </p>
          <h1 className="max-w-xl text-3xl font-black leading-[1.14] tracking-[-0.04em] sm:text-5xl">
            코드를 읽는 힘이
            <br />
            실력을 만듭니다.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-blue-100/75 sm:text-base">
            객관식·단답형·서술형을 실제 시험처럼 풀어보세요. 제출 즉시 정답과 해설을 확인하고,
            틀린 유형은 자동으로 약점 리포트에 모입니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/study/report"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
            >
              <BarChart3 className="h-4 w-4" /> 내 약점 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<BookOpenCheck className="h-5 w-5" />}
          label="누적 풀이"
          value={`${total}문제`}
          helper="내 학습 기록"
          tone="blue"
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          label="정답률"
          value={`${accuracy}%`}
          helper={total ? `${correct}개 정답` : "첫 문제를 풀어보세요"}
          tone="violet"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="복습 필요"
          value={`${pythonSummary.incorrect + webSummary.incorrect + aiPythonSummary.incorrect + aiPythonWeekSummary.incorrect}문제`}
          helper="오답 노트에 자동 저장"
          tone="mint"
        />
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-[0.16em] text-[#536cc7]">LEARNING TRACKS</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">학습 과목을 선택하세요</h2>
          </div>
          <span className="hidden text-xs font-semibold text-slate-400 sm:block">새로운 트랙은 계속 추가됩니다</span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Link
            to="/study/python"
            className="group relative min-h-[290px] overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-[#263f9f] via-[#445fd0] to-[#6d53d7] p-6 text-white shadow-[0_18px_45px_rgba(68,86,184,0.20)] transition hover:-translate-y-1"
          >
            <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full border-[28px] border-white/5" />
            <div className="absolute -bottom-14 right-16 h-36 w-36 rounded-full bg-cyan-300/10 blur-2xl" />
            <img
              src="/images/study-tracks/python-fundamentals.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-1 right-0 h-[116px] w-[116px] object-contain drop-shadow-[0_14px_24px_rgba(20,25,75,0.32)] transition duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:h-[132px] sm:w-[132px] lg:h-[128px] lg:w-[128px] xl:h-[142px] xl:w-[142px]"
            />
            <div className="relative flex h-full flex-col">
              <div className="flex justify-end">
                <span className="rounded-full bg-emerald-300/20 px-3 py-1 text-[11px] font-black text-emerald-100">
                  400문제
                </span>
              </div>
              <div className="relative z-10 mt-auto max-w-[68%] sm:max-w-[70%] lg:max-w-[62%] xl:max-w-[65%]">
                <p className="text-xs font-black tracking-[0.18em] text-blue-100/75">AVAILABLE NOW</p>
                <h3 className="mt-1 text-3xl font-black">Python</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-blue-100/80">
                  객관식·단답형·서술형이 섞인 4단계 400문제로 실전 감각을 훈련합니다.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold">
                  난이도 선택하기
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/study/web"
            className="group relative min-h-[290px] overflow-hidden rounded-3xl border border-cyan-200 bg-gradient-to-br from-[#063f52] via-[#087f92] to-[#12a283] p-6 text-white shadow-[0_18px_45px_rgba(8,116,135,0.20)] transition hover:-translate-y-1"
          >
            <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full border-[28px] border-white/5" />
            <div className="absolute -bottom-14 right-16 h-36 w-36 rounded-full bg-cyan-200/10 blur-2xl" />
            <img
              src="/images/study-tracks/web-fundamentals.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-1 right-0 h-[116px] w-[116px] object-contain drop-shadow-[0_14px_24px_rgba(4,52,61,0.32)] transition duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:h-[132px] sm:w-[132px] lg:h-[128px] lg:w-[128px] xl:h-[142px] xl:w-[142px]"
            />
            <div className="relative flex h-full flex-col">
              <div className="flex justify-end">
                <span className="rounded-full bg-cyan-100/20 px-3 py-1 text-[11px] font-black text-cyan-50">
                  300문제
                </span>
              </div>
              <div className="relative z-10 mt-auto max-w-[68%] sm:max-w-[70%] lg:max-w-[62%] xl:max-w-[65%]">
                <p className="text-xs font-black tracking-[0.18em] text-cyan-100/75">NEW CLASSROOM</p>
                <h3 className="mt-1 text-3xl font-black">Web</h3>
                <p className="mt-2 text-sm leading-6 text-cyan-50/80">
                  HTML·CSS·Bootstrap·Grid·UX/UI를 범위에 맞춰 훈련합니다.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold">
                  웹 강의실 입장
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
          <Link
            to="/study/ai-python"
            className="group relative min-h-[290px] overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-[#241044] via-[#6324ae] to-[#315fd3] p-6 text-white shadow-[0_18px_45px_rgba(91,48,170,0.20)] transition hover:-translate-y-1"
          >
            <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full border-[28px] border-white/5" />
            <div className="absolute -bottom-14 right-16 h-36 w-36 rounded-full bg-blue-200/10 blur-2xl" />
            <img
              src="/images/study-tracks/ai-python-data.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-1 right-0 h-[116px] w-[116px] object-contain drop-shadow-[0_14px_24px_rgba(35,17,71,0.34)] transition duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:h-[132px] sm:w-[132px] lg:h-[128px] lg:w-[128px] xl:h-[142px] xl:w-[142px]"
            />
            <div className="relative flex h-full flex-col">
              <div className="flex justify-end">
                <span className="rounded-full bg-violet-100/20 px-3 py-1 text-[11px] font-black text-violet-50">
                  100문제
                </span>
              </div>
              <div className="relative z-10 mt-auto max-w-[68%] sm:max-w-[70%] lg:max-w-[62%] xl:max-w-[65%]">
                <p className="text-xs font-black tracking-[0.18em] text-violet-100/75">NEW CLASSROOM</p>
                <h3 className="mt-1 whitespace-nowrap text-2xl font-black sm:text-3xl">AI Python 기초</h3>
                <p className="mt-2 text-sm leading-6 text-violet-50/80">
                  Python·API·NumPy·Pandas·시각화와 EDA를 한 흐름으로 풉니다.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold">
                  출제 범위 선택하기
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>

          {(["week1", "week2"] as const).map((week) => {
            const meta = AI_PYTHON_WEEK_META[week];
            return (
              <Link
                key={week}
                to={`/study/ai-python/${week}`}
                className={`group relative min-h-[290px] overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br ${meta.gradient} p-6 text-white shadow-[0_18px_45px_rgba(91,48,170,0.20)] transition hover:-translate-y-1`}
              >
                <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full border-[28px] border-white/5" />
                <div className="absolute -bottom-14 right-16 h-36 w-36 rounded-full bg-blue-200/10 blur-2xl" />
                <img
                  src={meta.imageSrc}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-1 right-0 h-[116px] w-[116px] object-contain drop-shadow-[0_14px_24px_rgba(35,17,71,0.34)] transition duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:h-[132px] sm:w-[132px] lg:h-[128px] lg:w-[128px] xl:h-[142px] xl:w-[142px]"
                />
                <div className="relative flex h-full flex-col">
                  <div className="flex justify-end">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-black text-white">
                      300문제
                    </span>
                  </div>
                  <div className="relative z-10 mt-auto max-w-[68%] sm:max-w-[70%] lg:max-w-[62%] xl:max-w-[65%]">
                    <p className="text-xs font-black tracking-[0.18em] text-violet-100/75">
                      {meta.weekLabel.toUpperCase()} CLASSROOM
                    </p>
                    <h3 className="mt-1 whitespace-nowrap text-2xl font-black sm:text-3xl">
                      {meta.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-violet-50/80">
                      {meta.topics}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold">
                      난이도 선택하기
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  helper,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
  tone: "blue" | "violet" | "mint";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
    mint: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${tones[tone]}`}>
        {icon}
      </span>
      <div>
        <p className="text-xs font-bold text-slate-400">{label}</p>
        <p className="mt-0.5 text-xl font-black text-slate-900">{value}</p>
        <p className="mt-0.5 text-[11px] text-slate-400">{helper}</p>
      </div>
    </div>
  );
}
