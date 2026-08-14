import assert from "node:assert/strict";
import test from "node:test";
import { STUDY_REVIEW_TRACKS } from "../src/config/studyReviewTracks.ts";

test("모든 학습 문제 세트가 오답 복습 설정에 등록된다", () => {
  assert.deepEqual(
    STUDY_REVIEW_TRACKS.map((track) => track.id),
    [
      "python",
      "web",
      "ai-python",
      "ai-python-week1",
      "ai-python-week2",
      "ai-python-week3-1",
    ],
  );
  assert.equal(
    STUDY_REVIEW_TRACKS.every((track) => track.href.includes("mode=wrong")),
    true,
  );
});

test("Web 문제도 선택형 오답 복습에 포함한다", () => {
  const web = STUDY_REVIEW_TRACKS.find((track) => track.id === "web");
  assert.equal(web?.href, "/study/web/quiz?mode=wrong");
});

test("오답 복습 설정 ID와 경로는 중복되지 않는다", () => {
  assert.equal(
    new Set(STUDY_REVIEW_TRACKS.map((track) => track.id)).size,
    STUDY_REVIEW_TRACKS.length,
  );
  assert.equal(
    new Set(STUDY_REVIEW_TRACKS.map((track) => track.href)).size,
    STUDY_REVIEW_TRACKS.length,
  );
});
