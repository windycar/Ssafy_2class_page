import assert from "node:assert/strict";
import test from "node:test";
import {
  hasObviousCorrectAnswerLengthCue,
  hasSupplementaryOptionParenthetical,
  stabilizeAiPythonWeekQuestion,
} from "../src/data/questionBanks/stabilizeAiPythonWeekOptions.ts";
import { enrichAiPythonWeekExplanation } from "../src/data/questionBanks/enrichAiPythonWeekExplanations.ts";
import type { AiPythonWeekQuestion } from "../src/types/aiPythonWeekStudy.ts";
import { gradeAiPythonWeekResponse } from "../src/utils/aiPythonWeekGrading.ts";

function multipleChoice(
  overrides: Partial<AiPythonWeekQuestion> = {},
): AiPythonWeekQuestion {
  return {
    id: "option-stability-test",
    conceptId: "option-stability",
    difficulty: "medium",
    category: "품질 검증",
    questionType: "multiple-choice",
    prompt: "정답 선택지에만 붙은 단서를 제거하는가?",
    options: [
      "각 입력 특성의 변화가 출력에 미치는 방향과 정도를 사람이 이해할 수 있다.",
      "파라미터 수가 무한대다.",
      "예측 오차가 항상 0이다.",
      "입력마다 같은 값을 낸다.",
    ],
    answer: 0,
    explanation: "보기 내용으로 정답을 판단해야 한다.",
    hint: "보기 길이는 정답 단서가 아니다.",
    ...overrides,
  };
}

test("정답 번호와 문항 ID는 유지하면서 과도한 길이 단서를 제거한다", () => {
  const question = multipleChoice();
  assert.equal(hasObviousCorrectAnswerLengthCue(question), true);

  const stabilized = stabilizeAiPythonWeekQuestion(question);

  assert.equal(stabilized.id, question.id);
  assert.equal(stabilized.answer, question.answer);
  assert.equal(stabilized.options[question.answer], question.options[question.answer]);
  assert.equal(new Set(stabilized.options).size, 4);
  assert.equal(hasObviousCorrectAnswerLengthCue(stabilized), false);
});

test("영문 병기 괄호는 제거하되 문항 기호·함수·수식 괄호는 보존한다", () => {
  assert.equal(hasSupplementaryOptionParenthetical("오즈비 (Odds Ratio)"), true);
  assert.equal(hasSupplementaryOptionParenthetical("(가)만 옳다."), false);
  assert.equal(hasSupplementaryOptionParenthetical("vec(Queen)"), false);
  assert.equal(hasSupplementaryOptionParenthetical("확률 0.5 (p=0.5)"), false);
  assert.equal(hasSupplementaryOptionParenthetical("$X^T (y - p)^2$"), false);

  const stabilized = stabilizeAiPythonWeekQuestion(
    multipleChoice({
      options: ["오즈비 (Odds Ratio)", "결정계수", "로그 우도", "잔차제곱합"],
      answer: 0,
    }),
  );
  assert.equal(stabilized.options[0], "오즈비");
});

test("반대 문장을 만들 수 없는 문항도 기존 오답을 보강해 길이 단서를 없앤다", () => {
  const question = multipleChoice({
    id: "generic-length-fallback",
    options: [
      "각 입력 특성의 변화가 예측 결과에 미치는 영향의 방향과 크기를 사람이 쉽게 이해하고 설명할 수 있는 상태",
      "파라미터 수",
      "예측 오차",
      "출력 범위",
    ],
  });

  const stabilized = stabilizeAiPythonWeekQuestion(question);

  assert.equal(
    stabilized.options[question.answer],
    question.options[question.answer],
  );
  assert.equal(new Set(stabilized.options).size, 4);
  assert.equal(hasObviousCorrectAnswerLengthCue(stabilized), false);
});

test("괄호 안의 대수식을 삭제하지 않는다", () => {
  const formula = "$\\nabla_\\beta \\ell(\\beta) = X^T (y - p)^2$";
  const stabilized = stabilizeAiPythonWeekQuestion(
    multipleChoice({
      options: [formula, "0", "1", "$X + y$"],
      answer: 0,
    }),
  );

  assert.equal(stabilized.options[0], formula);
});

test("객관식 해설은 반복 풀이 순서 없이 문항별 정답 이유만 보여준다", () => {
  const enriched = enrichAiPythonWeekExplanation(multipleChoice());

  assert.match(enriched.explanation, /^정답인 이유\n/);
  assert.match(enriched.explanation, /보기 내용으로 정답을 판단해야 한다\./);
  assert.doesNotMatch(enriched.explanation, /정답은\s*[“"]|풀이 순서/);
});

test("서술형 해설도 별도 작성 안내 없이 정답 이유만 보여준다", () => {
  const enriched = enrichAiPythonWeekExplanation(
    multipleChoice({
      questionType: "essay",
      options: [],
      answer: null,
      modelAnswer: "입력, 처리 과정, 결과를 연결해 설명한다.",
      rubricKeywords: ["입력", "처리", "결과"],
      minLength: 30,
    }),
  );

  assert.match(enriched.explanation, /^정답인 이유\n/);
  assert.equal(enriched.minLength, 20);
  assert.match(enriched.explanation, /입력, 처리 과정, 결과를 연결해 설명한다\./);
  assert.doesNotMatch(
    enriched.explanation,
    /답안 작성 방법|답안 구성 방법|풀이 순서|모범 답안|핵심어:/,
  );
});

test("서술형 답안은 20자 미만이면 제한하고 20자부터 채점한다", () => {
  const question = multipleChoice({
    questionType: "essay",
    options: [],
    answer: null,
    acceptedAnswers: ["입력"],
    modelAnswer: "입력과 처리 과정을 연결해 결과를 설명한다.",
    rubricKeywords: ["처리"],
    minLength: 20,
  });

  const nineteenCharacters = "입력처리".padEnd(19, "가");
  const twentyCharacters = "입력처리".padEnd(20, "가");

  assert.equal(gradeAiPythonWeekResponse(question, nineteenCharacters).correct, false);
  assert.equal(gradeAiPythonWeekResponse(question, twentyCharacters).correct, true);
});
