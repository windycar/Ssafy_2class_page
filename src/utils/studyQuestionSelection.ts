import type { PythonQuestion } from "../types/study";

export function countDistinctQuestionConcepts(questions: PythonQuestion[]) {
  return new Set(questions.map((question) => question.conceptId)).size;
}

export function selectOneQuestionPerConcept(
  questions: PythonQuestion[],
): PythonQuestion[] {
  const selectedConcepts = new Set<string>();

  return questions.filter((question) => {
    if (selectedConcepts.has(question.conceptId)) return false;
    selectedConcepts.add(question.conceptId);
    return true;
  });
}
