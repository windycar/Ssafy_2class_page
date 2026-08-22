import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cloud,
  CloudOff,
  FileCheck2,
  Hourglass,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  SPECIAL_MOCK_EXAM_BANKS,
  SPECIAL_MOCK_EXAM_META,
} from "../../data/모의고사/2회차";
import { useSpecialMockExamProgress } from "../../hooks/useSpecialMockExamProgress";
import {
  SPECIAL_MOCK_EXAM_ASSESSMENT_ROUNDS,
  SPECIAL_MOCK_EXAM_QUESTIONS_PER_ROUND,
  SPECIAL_MOCK_EXAM_ROUNDS,
  SPECIAL_MOCK_EXAM_TOTAL_QUESTION_COUNT,
  type SpecialMockExamRound,
} from "../../types/specialMockExam";
import { isAnsweredSpecialMockExamAttempt } from "../../utils/specialMockExamGrading";
import { hasPassedSpecialMockExam } from "../../utils/specialMockExamResult";
import {
  countUnresolvedMistakes,
  getLatestAttemptsByQuestion,
} from "../../utils/studyProgressStats";

const HERO_IMAGE = "/images/study-tracks/special-mock-exam-hero-v2.png";

const ROUND_STYLES = {
  1: {
    gradient: "from-[#142453] via-[#2f4eb0] to-[#5f8cff]",
    accent: "text-blue-700",
    soft: "bg-blue-50",
    border: "border-blue-100",
    progress: "bg-blue-600",
  },
  2: {
    gradient: "from-[#321667] via-[#6840b8] to-[#b06ed6]",
    accent: "text-violet-700",
    soft: "bg-violet-50",
    border: "border-violet-100",
    progress: "bg-violet-600",
  },
  3: {
    gradient: "from-[#5d1938] via-[#a83261] to-[#ea718d]",
    accent: "text-rose-700",
    soft: "bg-rose-50",
    border: "border-rose-100",
    progress: "bg-rose-600",
  },
  4: {
    gradient: "from-[#074348] via-[#087c76] to-[#51b6a5]",
    accent: "text-teal-700",
    soft: "bg-teal-50",
    border: "border-teal-100",
    progress: "bg-teal-600",
  },
  5: {
    gradient: "from-[#5c3510] via-[#a76513] to-[#e7a83b]",
    accent: "text-amber-800",
    soft: "bg-amber-50",
    border: "border-amber-100",
    progress: "bg-amber-600",
  },
} as const satisfies Record<
  SpecialMockExamRound,
  {
    gradient: string;
    accent: string;
    soft: string;
    border: string;
    progress: string;
  }
>;

export default function SpecialMockExamView() {
  const { progress, resetProgress, syncState } = useSpecialMockExamProgress();

  const resetRound = async (
    round: SpecialMockExamRound,
    attemptCount: number,
  ) => {
    if (!attemptCount) return;
    const confirmed = window.confirm(
      `과목평가 2회차 · 모의고사 ${round}회차의 풀이 기록 ${attemptCount}개를 초기화할까요?`,
    );
    if (!confirmed) return;
    const reset = await resetProgress(round);
    if (reset) {
      toast.success(`모의고사 ${round}회차 풀이 기록을 초기화했습니다.`);
    } else {
      toast.error(
        "풀이 기록을 초기화하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <Link
        to="/study"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-violet-700"
      >
        <ArrowLeft className="h-4 w-4" /> 학습 과목 목록
      </Link>

      <section className="relative isolate min-h-[390px] overflow-hidden rounded-[2.25rem] bg-[#090f28] text-white shadow-[0_28px_80px_rgba(27,28,76,0.28)]">
        <img
          src={HERO_IMAGE}
          alt="시험지와 노트북, 모래시계가 놓인 특별 모의고사 학습 책상"
          className="absolute inset-0 h-full w-full object-cover object-center"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,30,0.98)_0%,rgba(8,15,42,0.93)_38%,rgba(16,20,54,0.55)_68%,rgba(8,12,32,0.28)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#070c22]/90 to-transparent" />
        <div className="absolute -left-24 top-8 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative flex min-h-[390px] max-w-2xl flex-col justify-center px-7 py-10 sm:px-10 lg:px-12">
          <p className="flex items-center gap-2 text-xs font-black tracking-[0.18em] text-amber-300">
            <Sparkles className="h-4 w-4" /> SPECIAL MOCK EXAM
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
            실전처럼 풀고,
            <span className="mt-1 block bg-gradient-to-r from-white via-blue-100 to-amber-200 bg-clip-text text-transparent">
              결과로 증명하세요.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-slate-200/80 sm:text-base">
            과목평가 2회차 핵심 범위를 {SPECIAL_MOCK_EXAM_QUESTIONS_PER_ROUND}문제씩 점검합니다. 문제 순서는 매번
            바뀌며, 60점 이상이면 통과입니다.
          </p>

          <div className="mt-7 grid max-w-xl grid-cols-3 gap-2.5">
            <HeroStat value="5세트" label="실전 모의고사" />
            <HeroStat
              value={`${SPECIAL_MOCK_EXAM_TOTAL_QUESTION_COUNT}문제`}
              label="전체 문제"
            />
            <HeroStat value="60점" label="통과 기준" />
          </div>

          <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-[11px] font-bold text-white/75 backdrop-blur-md">
            {syncState === "synced" ? (
              <Cloud className="h-3.5 w-3.5 text-emerald-300" />
            ) : syncState === "loading" ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin text-blue-200" />
            ) : (
              <CloudOff className="h-3.5 w-3.5 text-amber-300" />
            )}
            {syncState === "synced"
              ? "풀이 기록 동기화됨"
              : syncState === "loading"
                ? "풀이 기록 불러오는 중"
                : "로컬 임시 저장 · 연결 시 다시 동기화"}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(35,45,90,0.07)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div>
            <p className="text-[11px] font-black tracking-[0.16em] text-violet-600">
              SUBJECT ASSESSMENT
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">
              과목평가 회차
            </h2>
          </div>
          <p className="text-xs font-bold text-slate-500">
            현재 2회차 이용 가능 · 3~10회차 순차 공개
          </p>
        </div>

        <div
          role="tablist"
          aria-label="과목평가 회차"
          className="grid grid-cols-3 gap-2 p-5 sm:grid-cols-5 sm:p-7 lg:grid-cols-9"
        >
          {SPECIAL_MOCK_EXAM_ASSESSMENT_ROUNDS.map((round) => {
            const available = round === 2;
            return (
              <button
                key={round}
                type="button"
                role="tab"
                aria-selected={available}
                disabled={!available}
                className={`relative min-h-20 overflow-hidden rounded-2xl border px-2 py-3 text-center transition ${
                  available
                    ? "border-violet-700 bg-[#101a3e] text-white shadow-[0_10px_24px_rgba(47,39,130,0.2)]"
                    : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
                }`}
              >
                {available ? (
                  <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-violet-400 to-amber-300" />
                ) : null}
                <strong className="block text-base font-black">{round}회차</strong>
                <span
                  className={`mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[9px] font-black ${
                    available
                      ? "bg-white/10 text-amber-200"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {available ? "OPEN" : "준비 중"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section role="tabpanel" aria-label="과목평가 2회차 모의고사">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black tracking-[0.16em] text-violet-600">
              ASSESSMENT 02 · EXAM COLLECTION
            </p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
              모의고사 1~5회차
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              원하는 세트를 선택해 응시하거나, 저장된 답안과 해설을 다시
              확인하세요.
            </p>
          </div>
          <span className="rounded-full border border-violet-100 bg-violet-50 px-3.5 py-2 text-xs font-black text-violet-700">
            세트당 {SPECIAL_MOCK_EXAM_QUESTIONS_PER_ROUND}문제 · 총 {SPECIAL_MOCK_EXAM_TOTAL_QUESTION_COUNT}문제
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {SPECIAL_MOCK_EXAM_ROUNDS.map((round) => {
            const questions = SPECIAL_MOCK_EXAM_BANKS[round];
            const attempts = progress.attempts.filter(
              (attempt) =>
                attempt.mockRound === round &&
                isAnsweredSpecialMockExamAttempt(attempt),
            );
            const latest = getLatestAttemptsByQuestion(attempts);
            const completed = latest.length;
            const wrong = countUnresolvedMistakes(attempts);
            const latestCorrect = latest.filter(({ correct }) => correct).length;
            const accuracy = completed
              ? Math.round((latestCorrect / completed) * 100)
              : 0;
            const completedAll = completed === questions.length;
            const passed = completedAll && hasPassedSpecialMockExam(accuracy);
            const progressRate = Math.round(
              (completed / questions.length) * 100,
            );
            const style = ROUND_STYLES[round];
            const startHref = `/study/special-mock/2/${round}/quiz?mode=all`;

            return (
              <article
                key={round}
                className={`group overflow-hidden rounded-[1.75rem] border bg-white shadow-[0_12px_32px_rgba(35,45,90,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(35,45,90,0.14)] ${style.border}`}
              >
                <div
                  className={`relative h-36 overflow-hidden bg-gradient-to-br ${style.gradient}`}
                >
                  <img
                    src={HERO_IMAGE}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-white/5" />
                  <div className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full border-[28px] border-white/10" />
                  <div className="relative flex h-full flex-col justify-between p-5 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full border border-white/20 bg-black/15 px-3 py-1 text-[10px] font-black tracking-[0.14em] backdrop-blur-sm">
                        SET 0{round}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black backdrop-blur-sm ${
                          passed
                            ? "bg-emerald-400/90 text-emerald-950"
                            : completedAll
                              ? "bg-rose-400/90 text-rose-950"
                              : completed
                                ? "bg-white/90 text-slate-800"
                                : "bg-black/25 text-white"
                        }`}
                      >
                        {passed
                          ? "통과 완료"
                          : completedAll
                            ? "재응시 필요"
                            : completed
                              ? "진행 중"
                              : "응시 전"}
                      </span>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <strong className="block text-2xl font-black tracking-tight">
                        모의고사 {round}회차
                      </strong>
                      <span className="text-5xl font-black leading-none text-white/20">
                        0{round}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="min-h-11 text-sm font-medium leading-6 text-slate-600">
                    {SPECIAL_MOCK_EXAM_META[round].description}
                  </p>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] font-black">
                      <span className={style.accent}>학습 진행률</span>
                      <span className="text-slate-500">
                        {completed}/{questions.length}
                      </span>
                    </div>
                    <div
                      className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-label={`${round}회차 학습 진행률`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progressRate}
                    >
                      <div
                        className={`h-full rounded-full transition-all ${style.progress}`}
                        style={{ width: `${progressRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <RoundStat
                      label="완료"
                      value={`${completed}/${SPECIAL_MOCK_EXAM_QUESTIONS_PER_ROUND}`}
                      tone={`${style.soft} ${style.accent}`}
                    />
                    <RoundStat
                      label="정답률"
                      value={`${accuracy}%`}
                      tone="bg-slate-50 text-slate-800"
                    />
                    <RoundStat
                      label="남은 오답"
                      value={`${wrong}`}
                      tone={
                        wrong
                          ? "bg-rose-50 text-rose-700"
                          : "bg-emerald-50 text-emerald-700"
                      }
                    />
                  </div>

                  <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                    <Link
                      to={startHref}
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#10172f] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-violet-800"
                    >
                      {completedAll ? "다시 응시하기" : "모의고사 시작"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    {wrong > 0 ? (
                      <Link
                        to={`/study/special-mock/2/${round}/quiz?mode=wrong`}
                        aria-label={`${round}회차 오답 ${wrong}문제 다시 풀기`}
                        className="inline-flex min-h-12 w-12 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Link>
                    ) : completed ? (
                      <span
                        title="남은 오답 없음"
                        className="inline-flex min-h-12 w-12 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void resetRound(round, attempts.length)}
                      disabled={!attempts.length || syncState === "loading"}
                      aria-label={`${round}회차 풀이 기록 초기화`}
                      className="inline-flex min-h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <Link
                    to={`/study/special-mock/2/${round}/quiz?mode=review`}
                    className={`mt-3 flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 transition hover:-translate-y-0.5 ${style.border} ${style.soft} ${style.accent}`}
                  >
                    <span className="inline-flex items-center gap-2 text-sm font-extrabold">
                      <FileCheck2 className="h-4 w-4" /> 전체 문제·풀이 보기
                    </span>
                    <span className="text-[10px] font-bold opacity-65">
                      답안·정답·해설
                    </span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <InfoCard
          icon={<FileCheck2 className="h-5 w-5" />}
          title={`실전형 ${SPECIAL_MOCK_EXAM_QUESTIONS_PER_ROUND}문제`}
          description="객관식 26문제, 단답형 4문제, 서술형 2문제로 구성됩니다."
        />
        <InfoCard
          icon={<RotateCcw className="h-5 w-5" />}
          title="최신 오답만 복습"
          description="문제별 가장 최근 답안이 틀린 경우에만 다시 출제됩니다."
        />
        <InfoCard
          icon={<Hourglass className="h-5 w-5" />}
          title="다음 과목평가 준비 중"
          description="과목평가 3~10회차는 준비되는 대로 순차 공개됩니다."
        />
      </section>
    </div>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-3 backdrop-blur-md">
      <strong className="block text-lg font-black text-white sm:text-xl">
        {value}
      </strong>
      <span className="mt-0.5 block text-[10px] font-bold text-white/55">
        {label}
      </span>
    </div>
  );
}

function RoundStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className={`rounded-xl px-2 py-3 text-center ${tone}`}>
      <p className="text-[10px] font-bold opacity-60">{label}</p>
      <p className="mt-0.5 text-sm font-black">{value}</p>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(35,45,90,0.06)]">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#101a3e] text-amber-300 shadow-sm">
        {icon}
      </span>
      <h3 className="mt-4 text-sm font-black text-slate-950">{title}</h3>
      <p className="mt-1.5 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}
