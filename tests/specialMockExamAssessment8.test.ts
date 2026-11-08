import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";
import { readFileSync } from "node:fs";
import { SPECIAL_MOCK_EXAM_BANKS as BANKS } from "../src/data/모의고사/8회차/index.ts";
import { getSpecialMockExamCollection, getSpecialMockExamQuestion } from "../src/data/모의고사/index.ts";
import { STUDY_REVIEW_TRACKS } from "../src/config/studyReviewTracks.ts";
import {
  getSpecialMockExamAttemptIdPrefix, isCurrentSpecialMockExamAttempt,
  isSpecialMockExamAssessmentRound, isSpecialMockExamRound,
} from "../src/types/specialMockExam.ts";
import type { SpecialMockExamAttempt, SpecialMockExamRound } from "../src/types/specialMockExam.ts";
import { getSpecialMockExamResetAttemptIds, specialMockExamProgressStorage as storage } from "../src/services/storage/specialMockExamProgressStorage.ts";
import { getLatestAttemptsByQuestion } from "../src/utils/studyProgressStats.ts";
import { reconcileRemoteProgress } from "../src/services/storage/reconcileStudyProgress.ts";
import { requireSpecialMockExamMember } from "../src/services/specialMockExamMember.ts";

const local = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", { configurable: true, value: {
  getItem: (key: string) => local.get(key) ?? null,
  setItem: (key: string, value: string) => local.set(key, value),
  removeItem: (key: string) => local.delete(key),
} });
beforeEach(() => local.clear());

function attempt(round: SpecialMockExamRound, correct = false, time = 0): SpecialMockExamAttempt {
  const question = BANKS[round][0];
  return {
    id: `${getSpecialMockExamAttemptIdPrefix(8, round)}test-${time}`,
    assessmentRound: 8, mockRound: round, questionId: question.id,
    difficulty: question.difficulty, category: question.category,
    questionType: question.questionType, selectedAnswer: 0, correct,
    answeredAt: new Date(Date.UTC(2026, 10, 7, 0, time)).toISOString(),
  };
}

test("8회차는 32문제씩 8세트이며 원래 유형·난이도와 고유 ID를 유지한다", () => {
  assert.equal(isSpecialMockExamAssessmentRound("8"), true);
  assert.equal(isSpecialMockExamRound("5", 8), true);
  assert.equal(isSpecialMockExamRound("6", 8), true);
  assert.equal(isSpecialMockExamRound("7", 8), true);
  assert.equal(isSpecialMockExamRound("8", 8), true);
  assert.equal(isSpecialMockExamRound("7", 5), false);
  assert.equal(isSpecialMockExamRound("6", 2), false);
  assert.deepEqual(getSpecialMockExamCollection(8).rounds, [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(getSpecialMockExamCollection(8).totalQuestionCount, 256);
  const difficulties = [[12, 12, 8], [12, 20, 0], [10, 22, 0], [6, 24, 2], [6, 23, 3], [10, 12, 10], [18, 10, 4], [16, 12, 4]];
  for (const [index, questions] of Object.values(BANKS).entries()) {
    assert.equal(questions.length, 32);
    assert.deepEqual(["multiple-choice", "short-answer", "essay"].map(type => questions.filter(q => q.questionType === type).length), [26, 5, 1]);
    assert.deepEqual(["easy", "medium", "hard"].map(level => questions.filter(q => q.difficulty === level).length), difficulties[index]);
    for (const q of questions) {
      assert.equal(q.id, `assessment-8-round-${index + 1}-${q.sourceId}`);
      assert.equal(getSpecialMockExamQuestion(8, (index + 1) as SpecialMockExamRound, q.id), q);
    }
  }
  assert.equal(new Set(Object.values(BANKS).flat().map(q => q.id)).size, 256);
  assert.equal(getSpecialMockExamAttemptIdPrefix(8, 5), "special-mock-a8-r5-v1-");
  assert.equal(isCurrentSpecialMockExamAttempt(attempt(5)), true);
  assert.equal(isCurrentSpecialMockExamAttempt({ ...attempt(5), id: "special-mock-a8-r5-v0-test" }), false);
  assert.equal(isCurrentSpecialMockExamAttempt({ ...attempt(5), mockRound: 6 }), false);
  assert.equal(getSpecialMockExamAttemptIdPrefix(8, 6), "special-mock-a8-r6-v1-");
  assert.equal(isCurrentSpecialMockExamAttempt(attempt(6)), true);
});

test("8회차 모든 세트에 약점 분석과 최신 오답 복습 경로가 연결된다", () => {
  const tracks = STUDY_REVIEW_TRACKS.filter(t => t.source === "special-mock-exam" && t.assessmentRound === 8);
  assert.equal(tracks.length, 8);
  tracks.forEach((track, index) => assert.equal(track.href, `/study/special-mock/8/${index + 1}/quiz?mode=wrong`));
  const wrong = attempt(1);
  const corrected = attempt(1, true, 1);
  const otherRound = attempt(6, false, 2);
  storage.addMany(101, [wrong, corrected, otherRound]);
  const latestWrong = getLatestAttemptsByQuestion(storage.get(101).attempts).filter(a => !a.correct);
  assert.deepEqual(latestWrong.map(a => a.questionId), [otherRound.questionId]);
  assert.ok(getSpecialMockExamQuestion(8, 6, latestWrong[0].questionId));
});

test("7·8회차 기록은 pending, 서버 교체, 오답 정정과 초기화가 각각 분리된다", () => {
  for (const round of [7, 8] as const) {
    local.clear();
    const wrong = attempt(round);
    const corrected = attempt(round, true, 1);
    const other = attempt(round === 7 ? 8 : 7);
    storage.addMany(101, [wrong, other]);
    storage.add(202, wrong);
    const before = new Set(storage.getPendingIds(101));
    storage.add(101, corrected);
    const reconciled = reconcileRemoteProgress({ attempts: [wrong, other] }, storage.get(101), before);
    storage.replace(101, reconciled);
    assert.deepEqual(getLatestAttemptsByQuestion(reconciled.attempts).filter(a => !a.correct).map(a => a.questionId), [other.questionId]);
    storage.remove(101, getSpecialMockExamResetAttemptIds(storage.get(101), 8, round));
    assert.deepEqual(storage.get(101).attempts.map(a => a.id), [other.id]);
    assert.equal(storage.get(202).attempts.length, 1);
  }
});

test("7·8회차 DB 제약은 기존 범위와 소유권 정책을 보존한다", () => {
  const sql = readFileSync("supabase/migrations/20261108031030_special_mock_exam_assessment_8_rounds_7_8.sql", "utf8");
  assert.match(sql, /assessment_round in \(2, 3\) and mock_round between 1 and 5/);
  assert.match(sql, /assessment_round = 5 and mock_round between 1 and 6/);
  assert.match(sql, /assessment_round = 8 and mock_round between 1 and 8/);
  assert.doesNotMatch(sql, /drop policy|disable row level|to anon|auth_user_id is null/i);
});

test("Django 6회차는 pending·서버 교체·정답 재풀이·초기화에서 다른 회차와 분리된다", () => {
  const sixth = attempt(6);
  const fifth = attempt(5);
  storage.addMany(101, [sixth, fifth]);
  storage.add(202, sixth);
  assert.deepEqual(storage.getPendingIds(101), [sixth.id, fifth.id]);
  const corrected = attempt(6, true, 1);
  const beforeRequest = new Set([sixth.id, fifth.id]);
  storage.add(101, corrected);
  const remote = reconcileRemoteProgress({ attempts: [sixth] }, storage.get(101), beforeRequest);
  storage.replace(101, remote);
  assert.deepEqual(remote.attempts.map(a => a.id), [sixth.id, corrected.id]);
  assert.deepEqual(getLatestAttemptsByQuestion(remote.attempts).filter(a => !a.correct), []);
  storage.add(101, fifth);
  const resetIds = getSpecialMockExamResetAttemptIds(storage.get(101), 8, 6);
  assert.deepEqual(resetIds, [sixth.id, corrected.id]);
  storage.remove(101, resetIds);
  assert.deepEqual(storage.get(101).attempts.map(a => a.id), [fifth.id]);
  assert.deepEqual(storage.get(202).attempts.map(a => a.id), [sixth.id]);
});

test("8회차 pending 저장과 초기화는 사용자·세트·기존 평가를 침범하지 않는다", () => {
  const first = attempt(1);
  const fifth = attempt(5);
  const otherAssessment = { ...first, assessmentRound: 5 as const, id: `${getSpecialMockExamAttemptIdPrefix(5, 1)}other` };
  storage.addMany(101, [first, fifth, otherAssessment]);
  storage.add(202, first);
  assert.deepEqual(storage.getPendingIds(101), [first.id, fifth.id, otherAssessment.id]);
  storage.markSynced(101, [fifth.id]);
  assert.deepEqual(storage.getPendingIds(101), [first.id, otherAssessment.id]);
  const ids = getSpecialMockExamResetAttemptIds(storage.get(101), 8, 1);
  assert.deepEqual(ids, [first.id]);
  storage.remove(101, ids);
  storage.replace(101, { attempts: [first, fifth, otherAssessment] });
  assert.deepEqual(storage.get(101).attempts.map(a => a.id), [fifth.id, otherAssessment.id]);
  assert.deepEqual(storage.get(202).attempts.map(a => a.id), [first.id]);
  const newLocal = attempt(3, true, 3);
  const reconciled = reconcileRemoteProgress({ attempts: [fifth] }, { attempts: [otherAssessment, newLocal] }, new Set([otherAssessment.id]));
  assert.deepEqual(reconciled.attempts.map(a => a.id), [fifth.id, newLocal.id]);
});

function memberClient(options: { authId?: string | null; sessionId?: string; studentId?: number; active?: boolean; access?: boolean; role?: string } = {}) {
  const authId = options.authId === undefined ? "auth-a" : options.authId;
  const filters: Array<[string, unknown]> = [];
  const query = {
    eq(column: string, value: unknown) { filters.push([column, value]); return this; },
    maybeSingle: async () => ({ data: { student_id: options.studentId ?? 101, is_active: options.active ?? true, can_access_special_mock_exam: options.access ?? true, role: options.role ?? "member" }, error: null }),
  };
  const client = {
    auth: {
      getUser: async () => ({ data: { user: authId ? { id: authId } : null }, error: null }),
      getSession: async () => ({ data: { session: { user: { id: options.sessionId ?? authId } } }, error: null }),
    },
    from: () => ({ select: () => query }),
  };
  return { client: client as unknown as Parameters<typeof requireSpecialMockExamMember>[0], filters };
}

test("서버 동기화는 Supabase 사용자·학생·활성 회원·승인 권한을 모두 검증한다", async () => {
  const allowed = memberClient();
  assert.equal(await requireSpecialMockExamMember(allowed.client, 101, "auth-a"), "auth-a");
  assert.deepEqual(allowed.filters, [["auth_user_id", "auth-a"], ["student_id", 101]]);
  assert.equal(await requireSpecialMockExamMember(memberClient({ access: false, role: "admin" }).client, 101), "auth-a");
  for (const options of [{ authId: null }, { authId: "auth-b" }, { studentId: 202 }, { active: false }, { access: false }, { sessionId: "auth-b" }]) {
    await assert.rejects(requireSpecialMockExamMember(memberClient(options).client, 101, "auth-a"));
  }
  await assert.rejects(requireSpecialMockExamMember(memberClient().client, 0));
});

test("8회차 마이그레이션은 기존 회차를 보존하고 소유권 정책을 완화하지 않는다", () => {
  const sql = readFileSync("supabase/migrations/20261106155055_special_mock_exam_assessment_round_8.sql", "utf8");
  assert.match(sql, /assessment_round in \(2, 3, 5, 8\)/);
  assert.match(sql, /assessment_round in \(2, 3, 8\) and mock_round between 1 and 5/);
  assert.match(sql, /assessment_round = 5 and mock_round between 1 and 6/);
  assert.doesNotMatch(sql, /drop policy|disable row level|to anon|auth_user_id is null/i);
});

test("Django 6회차 DB 제약은 5·8회차만 6회까지 허용한다", () => {
  const sql = readFileSync("supabase/migrations/20261107134547_special_mock_exam_assessment_8_round_6.sql", "utf8");
  assert.match(sql, /assessment_round in \(2, 3\) and mock_round between 1 and 5/);
  assert.match(sql, /assessment_round in \(5, 8\) and mock_round between 1 and 6/);
  assert.doesNotMatch(sql, /drop policy|disable row level|to anon|auth_user_id is null/i);
});
