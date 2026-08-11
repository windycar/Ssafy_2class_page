// AI Python 1주차 - AI와 기계학습
// 사용자 제공 쉬움·중간·어려움 문제은행을 앱 형식으로 정규화합니다.

import { ALL_QUESTIONS as RAW_EASY_QUESTIONS } from "./week1AiMlEasyQuestions";
import { ALL_QUESTIONS as RAW_MEDIUM_QUESTIONS } from "./week1AiMlMediumQuestions";
import { ALL_QUESTIONS as RAW_HARD_QUESTIONS } from "./week1AiMlHardQuestions";
import type {
  AiPythonWeekDifficulty,
  AiPythonWeekQuestion,
  AiPythonWeekQuestionType,
} from "../../types/aiPythonWeekStudy";

export type StudyDifficulty = AiPythonWeekDifficulty;
export type StudyQuestion = AiPythonWeekQuestion;

const CITATION_MARKER = /\s*\[cite:\s*[^\]]+\]/gi;
const SOURCE_DEPENDENT_PHRASES = [
  [/강의\s*자료\s*/g, ""],
  [/결과표/g, "결과"],
] as const;

function cleanText(value: string) {
  return SOURCE_DEPENDENT_PHRASES.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    value.replace(CITATION_MARKER, ""),
  )
    .replace(/\s{2,}/g, " ")
    .trim();
}

function normalizeQuestionType(
  question: AiPythonWeekQuestion,
): AiPythonWeekQuestionType {
  if (
    ["multiple-choice", "short-answer", "essay"].includes(
      question.questionType,
    )
  ) {
    return question.questionType;
  }
  if (
    question.options.length === 4 &&
    Number.isInteger(question.answer) &&
    question.answer !== null
  ) {
    return "multiple-choice";
  }
  throw new Error(`${question.id}: 지원하지 않는 문제 유형 ${question.questionType}`);
}

function fallbackHint(question: AiPythonWeekQuestion) {
  const variant = [...question.id].reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  ) % 4;
  if (question.questionType === "short-answer") {
    return [
      `${question.category}에서 묻는 핵심 용어의 정확한 명칭을 떠올리세요.`,
      `${question.category} 개념 중 문제의 정의와 가장 정확히 일치하는 용어를 찾으세요.`,
      `문제에 제시된 역할을 ${question.category}의 핵심 용어와 연결해 보세요.`,
      `${question.category}에서 해당 기능을 담당하는 개념의 이름을 확인하세요.`,
    ][variant];
  }
  if (question.questionType === "essay") {
    return [
      `${question.category}의 핵심 구성 요소와 작동 원리를 순서대로 설명하세요.`,
      `${question.category}의 입력, 처리 과정, 결과를 나누어 정리하세요.`,
      `${question.category}의 주요 개념 사이 관계와 실제 효과를 함께 설명하세요.`,
      `먼저 ${question.category}의 목적을 밝히고 세부 동작을 단계별로 서술하세요.`,
    ][variant];
  }
  return [
    `${question.category}의 핵심 정의와 각 선택지가 설명하는 역할을 비교하세요.`,
    `${question.category}의 목적에 직접 부합하는 선택지를 먼저 찾으세요.`,
    `각 선택지가 ${question.category}에서 맡는 기능인지 하나씩 대조하세요.`,
    `${question.category}의 처리 흐름을 떠올린 뒤 맞지 않는 선택지를 제거하세요.`,
  ][variant];
}

function fallbackExplanation(question: AiPythonWeekQuestion) {
  if (question.modelAnswer) return question.modelAnswer;
  if (question.acceptedAnswers?.[0]) {
    return `${question.acceptedAnswers[0]}이 문제에서 설명한 ${question.category}의 핵심 개념입니다.`;
  }
  return `${question.category}의 정의와 문제에 제시된 조건을 함께 적용하면 정답을 판단할 수 있습니다.`;
}

function rotateOptions(
  question: AiPythonWeekQuestion,
  multipleChoiceIndex: number,
): AiPythonWeekQuestion {
  if (
    question.questionType !== "multiple-choice" ||
    question.options.length !== 4 ||
    question.answer === null
  ) {
    return question;
  }

  const targetAnswer = multipleChoiceIndex % question.options.length;
  const shift =
    (targetAnswer - question.answer + question.options.length) %
    question.options.length;
  if (shift === 0) return question;
  return {
    ...question,
    options: [
      ...question.options.slice(-shift),
      ...question.options.slice(0, -shift),
    ],
    answer: (question.answer + shift) % question.options.length,
  };
}

function normalizeQuestions(
  difficulty: AiPythonWeekDifficulty,
  rawQuestions: readonly unknown[],
  startMultipleChoiceIndex: number,
) {
  let multipleChoiceIndex = startMultipleChoiceIndex;
  return rawQuestions.map((rawQuestion) => {
    const source = rawQuestion as AiPythonWeekQuestion;
    const questionType = normalizeQuestionType(source);
    const question: AiPythonWeekQuestion = {
      ...source,
      difficulty,
      questionType,
      prompt: cleanText(source.prompt),
      options: source.options.map(cleanText),
      acceptedAnswers: source.acceptedAnswers?.map(cleanText),
      modelAnswer: source.modelAnswer
        ? cleanText(source.modelAnswer)
        : undefined,
      rubricKeywords: source.rubricKeywords?.map(cleanText),
      explanation: source.explanation
        ? cleanText(source.explanation)
        : "",
      hint: source.hint ? cleanText(source.hint) : "",
    };
    if (!question.explanation) {
      question.explanation = cleanText(fallbackExplanation(question));
    }
    if (!question.hint) question.hint = fallbackHint(question);
    if (question.questionType !== "multiple-choice") return question;

    const normalized = rotateOptions(question, multipleChoiceIndex);
    multipleChoiceIndex += 1;
    return normalized;
  });
}

const EASY_QUESTIONS = normalizeQuestions("easy", RAW_EASY_QUESTIONS, 0);
const MEDIUM_QUESTIONS = normalizeQuestions("medium", RAW_MEDIUM_QUESTIONS, 84);
const HARD_QUESTIONS = normalizeQuestions("hard", RAW_HARD_QUESTIONS, 168);

export const QUESTION_BANK: Record<
  AiPythonWeekDifficulty,
  AiPythonWeekQuestion[]
> = {
  easy: EASY_QUESTIONS,
  medium: MEDIUM_QUESTIONS,
  hard: HARD_QUESTIONS,
};

export const ALL_QUESTIONS: AiPythonWeekQuestion[] =
  Object.values(QUESTION_BANK).flat();
