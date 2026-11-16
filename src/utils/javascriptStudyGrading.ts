import type { JavascriptQuestion } from "../types/javascriptStudy";

export function gradeJavascriptResponse(question: JavascriptQuestion, response: number | string): boolean {
  if (question.questionType === "multiple-choice") return typeof response === "number" && response === question.answer;
  if (typeof response !== "string" || !response.trim()) return false;
  const normalize = (value: string) => value.trim().replace(/\s+/g, " ").replace(/\s*,\s*/g, ",");
  return (question.acceptedAnswers ?? []).some(answer => normalize(answer) === normalize(response));
}
