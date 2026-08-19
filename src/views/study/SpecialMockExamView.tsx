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
  SPECIAL_MOCK_EXAM_ROUNDS,
  type SpecialMockExamRound,
} from "../../types/specialMockExam";
import {
  countUnresolvedMistakes,
  getLatestAttemptsByQuestion,
} from "../../utils/studyProgressStats";
import { hasPassedSpecialMockExam } from "../../utils/specialMockExamResult";
import { isAnsweredSpecialMockExamAttempt } from "../../utils/specialMockExamGrading";

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
      toast.error("풀이 기록을 초기화하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <Link
        to="/study"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-amber-700"
      >
        <ArrowLeft className="h-4 w-4" /> 학습 과목 목록
      </Link>

      <section className="relative min-h-[300px] overflow-hidden rounded-[2rem] bg-[linear-gradient(125deg,#11183d_0%,#3e2a9e_56%,#8b4f17_100%)] p-7 text-white shadow-[0_24px_60px_rgba(48,37,118,0.24)] sm:p-9">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[38px] border-white/[0.06]" />
        <img
          src="/images/study-tracks/special-mock-exam.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-5 right-0 h-56 w-56 object-contain drop-shadow-[0_20px_34px_rgba(9,10,36,0.42)] sm:right-6 sm:h-72 sm:w-72"
        />
        <div className="relative flex min-h-[230px] max-w-[68%] flex-col justify-center sm:max-w-[64%]">
          <p className="flex items-center gap-2 text-xs font-black tracking-[0.16em] text-amber-200">
            <Sparkles className="h-4 w-4" /> SPECIAL MOCK EXAM
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            특별 모의고사
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
            과목평가 실전 범위를 30문제 단위로 점검하세요. 현재 2회차 모의고사 5세트가
            준비되어 있습니다.
          </p>
          <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white/80">
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

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <p className="text-xs font-black tracking-[0.14em] text-amber-600">
            SUBJECT ASSESSMENT
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">
            과목평가 회차를 선택하세요
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            2회차만 이용할 수 있으며, 3~10회차는 순서대로 추가됩니다.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="과목평가 회차"
          className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9"
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
                className={`min-h-20 rounded-2xl border-2 px-2 py-3 text-center transition ${
                  available
                    ? "border-amber-500 bg-amber-50 text-amber-900 shadow-[0_8px_20px_rgba(217,119,6,0.12)]"
                    : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
                }`}
              >
                <strong className="block text-base font-black">{round}회차</strong>
                <span className="mt-1 block text-[10px] font-bold">
                  {available ? "이용 가능" : "준비 중"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section role="tabpanel" aria-label="과목평가 2회차 모의고사">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black tracking-[0.14em] text-violet-600">
              ASSESSMENT 02 · 5 SETS
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">
              과목평가 2회차 모의고사
            </h2>
          </div>
          <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">
            총 150문제
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
            const startHref = `/study/special-mock/2/${round}/quiz?mode=all`;

            return (
              <article
                key={round}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(48,42,105,0.10)]"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-violet-100 to-amber-50" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-lg font-black text-white shadow-sm">
                      {round}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[10px] font-black text-slate-500">
                      30문제
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-black text-slate-900">
                    {SPECIAL_MOCK_EXAM_META[round].label}
                  </h3>
                  {completedAll ? (
                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-black ${
                        hasPassedSpecialMockExam(accuracy)
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {hasPassedSpecialMockExam(accuracy)
                        ? "60점 이상 통과"
                        : "미통과 · 재응시 필요"}
                    </span>
                  ) : null}
                  <p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">
                    {SPECIAL_MOCK_EXAM_META[round].description}
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <RoundStat label="완료" value={`${completed}/30`} />
                    <RoundStat label="정답률" value={`${accuracy}%`} />
                    <RoundStat label="남은 오답" value={`${wrong}`} />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    <Link
                      to={startHref}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-extrabold text-white"
                    >
                      {completedAll ? "다시 응시하기" : "모의고사 시작"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    {wrong > 0 ? (
                      <Link
                        to={`/study/special-mock/2/${round}/quiz?mode=wrong`}
                        aria-label={`${round}회차 오답 ${wrong}문제 다시 풀기`}
                        className="inline-flex items-center justify-center rounded-xl border border-rose-200 px-3 text-rose-600"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Link>
                    ) : completed ? (
                      <span
                        title="남은 오답 없음"
                        className="inline-flex items-center justify-center rounded-xl border border-emerald-200 px-3 text-emerald-600"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void resetRound(round, attempts.length)}
                      disabled={!attempts.length || syncState === "loading"}
                      aria-label={`${round}회차 풀이 기록 초기화`}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 text-slate-400 transition hover:border-rose-200 hover:text-rose-600 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <InfoCard
          icon={<FileCheck2 className="h-5 w-5" />}
          title="실전 구성"
          description="객관식 24문제, 단답형 4문제, 서술형 2문제"
        />
        <InfoCard
          icon={<RotateCcw className="h-5 w-5" />}
          title="최신 오답 복습"
          description="문제별 가장 최근 답안이 틀린 경우에만 다시 출제"
        />
        <InfoCard
          icon={<Hourglass className="h-5 w-5" />}
          title="다음 회차"
          description="과목평가 3~10회차는 준비되는 대로 순차 공개"
        />
      </section>
    </div>
  );
}

function RoundStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-2 py-3 text-center">
      <p className="text-[10px] font-bold text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-black text-slate-800">{value}</p>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
        {icon}
      </span>
      <h3 className="mt-3 text-sm font-black text-slate-900">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}
