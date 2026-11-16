import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";
import { JAVASCRIPT_QUESTION_BANK } from "../src/data/questionBanks/javascriptQuestionBank.ts";
import { javascriptStudyProgressStorage, getJavascriptStudyResetAttemptIds } from "../src/services/storage/javascriptStudyProgressStorage.ts";
import { reconcileRemoteProgress } from "../src/services/storage/reconcileStudyProgress.ts";
import { getLatestAttemptsByQuestion } from "../src/utils/studyProgressStats.ts";
import { gradeJavascriptResponse } from "../src/utils/javascriptStudyGrading.ts";
import type { JavascriptStudyAttempt } from "../src/types/javascriptStudy.ts";

class MemoryStorage {
  values = new Map<string, string>();
  getItem(k: string) { return this.values.get(k) ?? null; }
  setItem(k: string, v: string) { this.values.set(k, String(v)); }
  removeItem(k: string) { this.values.delete(k); }
}
const storage = new MemoryStorage();
Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true });
beforeEach(() => storage.values.clear());

const attempt = (id: string, questionId: string, correct: boolean, category: JavascriptStudyAttempt["category"] = "set1"): JavascriptStudyAttempt => ({
  id, questionId, category, selectedAnswer: 0, correct, answeredAt: "2026-11-16T00:00:00Z",
});

test("question bank has unique stable IDs and valid choices", () => {
  assert.equal(JAVASCRIPT_QUESTION_BANK.length, 150);
  assert.equal(new Set(JAVASCRIPT_QUESTION_BANK.map(q => q.id)).size, 150);
  for (const set of ["set1", "set2", "set3", "set4", "set5", "set6"]) assert.equal(JAVASCRIPT_QUESTION_BANK.filter(q => q.category === set).length, 25);
  for (const q of JAVASCRIPT_QUESTION_BANK) {
    if (q.questionType === "multiple-choice") {
      assert.equal(q.options.length, 4);
      assert.ok(q.answer !== null && q.answer >= 0 && q.answer < q.options.length);
      assert.equal(gradeJavascriptResponse(q, q.answer), true);
    } else {
      assert.ok(q.acceptedAnswers?.length);
      assert.equal(gradeJavascriptResponse(q, q.acceptedAnswers![0]), true);
      assert.equal(gradeJavascriptResponse(q, ""), false);
    }
    assert.ok(q.prompt && q.explanation);
  }
  assert.equal(JAVASCRIPT_QUESTION_BANK.filter(q => q.questionType === "short-answer").length, 20);
});

test("short answers accept extra spaces without accepting different values", () => {
  const question = JAVASCRIPT_QUESTION_BANK.find((item) => item.id === "js9c-24")!;
  assert.equal(gradeJavascriptResponse(question, "10  4"), true);
  assert.equal(gradeJavascriptResponse(question, "10,  4"), true);
  assert.equal(gradeJavascriptResponse(question, "10 5"), false);
});

test("save pending, reconcile server records and keep answers created during sync", () => {
  const old = attempt("old", "q1", false);
  const fresh = attempt("fresh", "q2", true);
  fresh.answeredAt = "2026-11-16T00:01:00Z";
  javascriptStudyProgressStorage.add(42, old);
  const snapshot = new Set(javascriptStudyProgressStorage.get(42).attempts.map(a => a.id));
  javascriptStudyProgressStorage.add(42, fresh);
  assert.deepEqual(javascriptStudyProgressStorage.getPendingIds(42), ["old", "fresh"]);
  const result = reconcileRemoteProgress({ attempts: [old] }, javascriptStudyProgressStorage.get(42), snapshot);
  assert.deepEqual(result.attempts.map(a => a.id), ["old", "fresh"]);
  javascriptStudyProgressStorage.markSynced(42, ["old"]);
  assert.deepEqual(javascriptStudyProgressStorage.getPendingIds(42), ["fresh"]);
  assert.deepEqual(javascriptStudyProgressStorage.get(43).attempts, []);
});

test("reset removes only the selected category and latest answer controls wrong review", () => {
  const wrong = attempt("a", "q1", false);
  const corrected = attempt("b", "q1", true);
  const otherWrong = attempt("c", "q2", false, "set2");
  for (const item of [wrong, corrected, otherWrong]) javascriptStudyProgressStorage.add(42, item);
  const latest = getLatestAttemptsByQuestion(javascriptStudyProgressStorage.get(42).attempts);
  assert.deepEqual(latest.filter(a => !a.correct).map(a => a.questionId), ["q2"]);
  const ids = getJavascriptStudyResetAttemptIds(javascriptStudyProgressStorage.get(42), ["set1"]);
  assert.deepEqual(ids, ["a", "b"]);
  javascriptStudyProgressStorage.remove(42, ids);
  assert.deepEqual(javascriptStudyProgressStorage.get(42).attempts.map(a => a.id), ["c"]);
  assert.deepEqual(javascriptStudyProgressStorage.getPendingIds(42), ["c"]);
  javascriptStudyProgressStorage.replace(42, { attempts: [wrong, corrected, otherWrong] });
  assert.deepEqual(javascriptStudyProgressStorage.get(42).attempts.map(a => a.id), ["c"]);
});
