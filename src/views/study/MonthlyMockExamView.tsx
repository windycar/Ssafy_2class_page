import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { Link, Navigate, useParams } from "react-router";
import { MONTHLY_ASSESSMENT_REVIEW_NOTES } from "../../data/monthlyAssessmentReviewNotes";
import { MONTHLY_ASSESSMENT_TYPES } from "../../data/monthlyAssessmentTypes";
import MonthlyPracticeSection from "./MonthlyPracticeSection";

const ROUNDS = [1, 2, 3, 4, 5, 6] as const;
const MONTHLY_PATH = "/study/monthly-mock";
const HERO_IMAGE = "/images/study-tracks/special-mock-exam-hero-v2.png";

function roundThumbnail(round: number) {
  return `/images/study-tracks/monthly-assessment-${round}.webp`;
}

export default function MonthlyMockExamView() {
  const { round: roundParam } = useParams();
  const round = ROUNDS.find((value) => String(value) === roundParam);
  const summary = round ? MONTHLY_ASSESSMENT_TYPES[round] : undefined;
  const reviewNote = round ? MONTHLY_ASSESSMENT_REVIEW_NOTES[round] : undefined;

  if (roundParam && !summary) {
    return <Navigate to={MONTHLY_PATH} replace />;
  }

  return (
    <div className="space-y-8 pb-12">
      <Link
        to={summary ? MONTHLY_PATH : "/study"}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-violet-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {summary ? "월말평가 문제 유형 목록" : "학습 과목 목록"}
      </Link>

      <section className="relative overflow-hidden rounded-[2rem] bg-[#101a3e] text-white shadow-xl">
        <img
          src={round ? roundThumbnail(round) : HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,30,0.98)_0%,rgba(8,15,42,0.93)_38%,rgba(16,20,54,0.55)_68%,rgba(8,12,32,0.28)_100%)]" />
        <div className="relative flex min-h-[260px] max-w-2xl flex-col justify-center px-7 py-10 sm:px-12">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            {summary ? `월말평가 ${round}회차 문제 유형` : "월말평가 문제 유형"}
          </h1>
          <p className="mt-4 text-sm font-medium leading-7 text-slate-200 sm:text-base">
            {summary?.subject ?? "지난 월말평가에서 어떤 유형이 나왔는지 회차별로 확인하세요."}
          </p>
        </div>
      </section>

      {summary ? (
        <div className="space-y-8">
          <section aria-labelledby="monthly-assessment-format" className="rounded-2xl border border-violet-100 bg-violet-50 p-5 sm:p-6">
            <h2 id="monthly-assessment-format" className="text-lg font-black text-violet-950">평가 방식</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">{summary.format}</p>
          </section>

          {round && <MonthlyPracticeSection key={round} round={round} />}

          <section aria-labelledby="monthly-assessment-types">
            <h2 id="monthly-assessment-types" className="mb-5 text-2xl font-black text-slate-950">
              지난 평가에 나온 유형
            </h2>
            <div className="grid gap-4">
              {summary.types.map(({ title, description, notes }) => (
                <article key={title} className="grid gap-5 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                  <div>
                    <h3 className="text-lg font-black text-violet-950">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                  </div>
                  <div className="border-t border-violet-100 pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                    <h4 className="text-sm font-bold text-slate-900">핵심 개념과 주의점</h4>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700 marker:text-violet-500">
                      {notes.map((note) => <li key={note}>{note}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {reviewNote && (
            <section aria-labelledby="monthly-assessment-review-notes">
              <h2 id="monthly-assessment-review-notes" className="text-2xl font-black text-slate-950">
                시험 전 정리
              </h2>
              <p className="mb-5 mt-1 text-sm text-slate-600">{reviewNote.source}</p>
              <div className="grid items-start gap-4 lg:grid-cols-2">
                {reviewNote.sections.map(({ title, points }) => (
                  <article key={title} className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
                    <h3 className="font-black text-violet-950">{title}</h3>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700 marker:text-violet-500">
                      {points.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="monthly-assessment-checklist" className="rounded-2xl border border-violet-100 bg-violet-50 p-5 sm:p-6">
            <h2 id="monthly-assessment-checklist" className="text-lg font-black text-violet-950">복습 체크리스트</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700 marker:text-violet-500">
              {summary.checklist.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        </div>
      ) : (
        <section aria-labelledby="monthly-mock-rounds">
          <h2 id="monthly-mock-rounds" className="mb-5 text-2xl font-black text-slate-950">
            회차별 문제 유형
          </h2>
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ROUNDS.map((round) => {
              const subject = MONTHLY_ASSESSMENT_TYPES[round]?.subject;
              return (
                <li key={round} className="overflow-hidden rounded-[1.75rem] border border-violet-100 bg-white shadow-sm">
                  <div className="relative flex aspect-[2/1] min-h-44 items-end justify-between gap-3 overflow-hidden bg-[#142453] p-5 text-white">
                    <img
                      src={roundThumbnail(round)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-transparent" />
                    <h3 className="relative text-xl font-black">월말평가 {round}회차</h3>
                    <span className="relative shrink-0 rounded-full bg-black/55 px-3 py-1 text-xs font-bold">{subject ?? "준비 중"}</span>
                  </div>
                  <div className="p-5">
                    {subject ? (
                      <Link
                        to={`${MONTHLY_PATH}/${round}`}
                        aria-label={`월말평가 ${round}회차 문제 유형 보기`}
                        className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#10172f] px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-800"
                      >
                        문제 유형 보기 <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        aria-label={`월말평가 ${round}회차 문제 유형 보기`}
                        className="flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600"
                      >
                        <LockKeyhole className="h-4 w-4" aria-hidden="true" /> 문제 유형 보기
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
