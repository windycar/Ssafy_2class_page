import type { AiPythonWeek } from "../types/aiPythonWeekStudy";

type BaseReviewTrack = {
  id: string;
  label: string;
  description: string;
  href: string;
  tone: "indigo" | "cyan" | "violet" | "pink" | "blue";
};

export type StudyReviewTrack = BaseReviewTrack &
  (
    | { source: "python" }
    | { source: "web" }
    | { source: "ai-python" }
    | { source: "ai-python-week"; week: AiPythonWeek }
  );

/**
 * 오답 선택 화면의 단일 등록 지점입니다.
 * 새 문제 세트를 추가할 때 오답 저장소와 quiz?mode=wrong을 구현한 뒤 여기에 등록합니다.
 */
export const STUDY_REVIEW_TRACKS: readonly StudyReviewTrack[] = [
  {
    id: "python",
    label: "Python 기본",
    description: "연산자·문자열·함수·자료구조·OOP",
    href: "/study/python/quiz?mode=wrong",
    tone: "indigo",
    source: "python",
  },
  {
    id: "web",
    label: "Web 기본",
    description: "HTML·CSS·Bootstrap·반응형·UX/UI",
    href: "/study/web/quiz?mode=wrong",
    tone: "cyan",
    source: "web",
  },
  {
    id: "ai-python",
    label: "AI Python 기초",
    description: "API·NumPy·Pandas·시각화·EDA",
    href: "/study/ai-python/quiz?mode=wrong",
    tone: "violet",
    source: "ai-python",
  },
  {
    id: "ai-python-week1",
    label: "AI Python 1번째",
    description: "AI·ML·선형회귀·모델 평가",
    href: "/study/ai-python/week1/quiz?mode=wrong",
    tone: "pink",
    source: "ai-python-week",
    week: "week1",
  },
  {
    id: "ai-python-week2",
    label: "AI Python 2번째",
    description: "NLP·RNN·Transformer·LLM",
    href: "/study/ai-python/week2/quiz?mode=wrong",
    tone: "blue",
    source: "ai-python-week",
    week: "week2",
  },
  {
    id: "ai-python-week3-1",
    label: "AI Python 3-1",
    description: "CNN·ResNet·Attention·ViT",
    href: "/study/ai-python/week3-1/quiz?mode=wrong",
    tone: "violet",
    source: "ai-python-week",
    week: "week3-1",
  },
] as const;
