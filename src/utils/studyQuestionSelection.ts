import type { PythonQuestion } from "../types/study";

export function countDistinctQuestionConcepts(questions: PythonQuestion[]) {
  return new Set(questions.map((question) => question.conceptId)).size;
}

export function selectOneQuestionPerConcept(
  questions: PythonQuestion[],
): PythonQuestion[] {
  const questionGroups = new Map<string, PythonQuestion[]>();
  for (const question of questions) {
    const conceptQuestions = questionGroups.get(question.conceptId) ?? [];
    conceptQuestions.push(question);
    questionGroups.set(question.conceptId, conceptQuestions);
  }
  const selectedQuestions: PythonQuestion[] = [];
  const selectedConcepts = new Set<string>();
  const conceptCount = questionGroups.size;
  const multipleChoiceCount = Math.round(conceptCount * 0.6);
  const shortAnswerCount = Math.round(conceptCount * 0.25);
  const essayCount =
    conceptCount - multipleChoiceCount - shortAnswerCount;
  const desiredTypeCounts = [
    ["essay", essayCount],
    ["short-answer", shortAnswerCount],
    ["multiple-choice", multipleChoiceCount],
  ] as const;

  for (const [questionType, desiredCount] of desiredTypeCounts) {
    let selectedCount = 0;

    for (const [conceptId, conceptQuestions] of questionGroups) {
      if (
        selectedCount >= desiredCount ||
        selectedConcepts.has(conceptId)
      ) {
        continue;
      }

      const matchingQuestion = conceptQuestions.find(
        (question) => question.questionType === questionType,
      );
      if (!matchingQuestion) continue;

      selectedQuestions.push(matchingQuestion);
      selectedConcepts.add(conceptId);
      selectedCount += 1;
    }
  }

  for (const [conceptId, conceptQuestions] of questionGroups) {
    if (selectedConcepts.has(conceptId)) continue;
    selectedQuestions.push(conceptQuestions[0]);
  }

  return selectedQuestions;
}
