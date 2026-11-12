export type SpecialMockExamDraft = {
  questionIds: string[];
  currentIndex: number;
  answers: Record<string, { response: number | string | null }>;
  draftAnswers: Record<string, string>;
  reviewQuestionIds: string[];
};

const DRAFT_PREFIX = "ssafy-special-mock-draft:v1:";

export function loadSpecialMockExamDraft(key: string): SpecialMockExamDraft | null {
  try {
    const draft = JSON.parse(sessionStorage.getItem(DRAFT_PREFIX + key) ?? "null");
    if (
      !draft ||
      !Array.isArray(draft.questionIds) ||
      !Number.isInteger(draft.currentIndex) ||
      !draft.answers ||
      !draft.draftAnswers ||
      !Array.isArray(draft.reviewQuestionIds)
    ) return null;
    return draft;
  } catch {
    return null;
  }
}

export function saveSpecialMockExamDraft(key: string, draft: SpecialMockExamDraft) {
  try {
    sessionStorage.setItem(DRAFT_PREFIX + key, JSON.stringify(draft));
  } catch {
    // The quiz remains usable when browser storage is unavailable.
  }
}

export function clearSpecialMockExamDraft(key: string) {
  try {
    sessionStorage.removeItem(DRAFT_PREFIX + key);
  } catch {
    // Browser storage may be disabled.
  }
}
