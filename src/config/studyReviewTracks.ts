import type { AiPythonWeek } from "../types/aiPythonWeekStudy";
import type {
  SpecialMockExamAvailableAssessmentRound,
  SpecialMockExamRound,
} from "../types/specialMockExam";

type BaseReviewTrack = {
  id: string;
  label: string;
  description: string;
  href: string;
  tone: "indigo" | "cyan" | "violet" | "pink" | "blue" | "amber";
};

export type StudyReviewTrack = BaseReviewTrack &
  (
    | { source: "python" }
    | { source: "web" }
    | { source: "ai-python" }
    | { source: "ai-python-week"; week: AiPythonWeek }
    | {
        source: "special-mock-exam";
        assessmentRound: SpecialMockExamAvailableAssessmentRound;
        round: SpecialMockExamRound;
      }
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
  {
    id: "ai-python-week3-2",
    label: "AI Python 3-2",
    description: "CLIP·VLM·LLaVA·SAM·비주얼 프롬프팅",
    href: "/study/ai-python/week3-2/quiz?mode=wrong",
    tone: "violet",
    source: "ai-python-week",
    week: "week3-2",
  },
  {
    id: "ai-python-week4-1",
    label: "AI Python 4-1",
    description: "SFT·RLHF·RAG·Tool Use·Agent",
    href: "/study/ai-python/week4-1/quiz?mode=wrong",
    tone: "violet",
    source: "ai-python-week",
    week: "week4-1",
  },
  {
    id: "ai-python-week4-2",
    label: "AI Python 4-2",
    description: "Post-training·RLHF·RAG·Agent·MCP",
    href: "/study/ai-python/week4-2/quiz?mode=wrong",
    tone: "violet",
    source: "ai-python-week",
    week: "week4-2",
  },
  {
    id: "ai-python-week5-1",
    label: "AI Python 5-1",
    description: "수 체계·모델 압축·PEFT·LoRA·QLoRA",
    href: "/study/ai-python/week5-1/quiz?mode=wrong",
    tone: "blue",
    source: "ai-python-week",
    week: "week5-1",
  },
  {
    id: "special-mock-a2-r1",
    label: "특별 모의고사 2-1",
    description: "과목평가 2회차 · 모의고사 1회차",
    href: "/study/special-mock/2/1/quiz?mode=wrong",
    tone: "amber",
    source: "special-mock-exam",
    assessmentRound: 2,
    round: 1,
  },
  {
    id: "special-mock-a2-r2",
    label: "특별 모의고사 2-2",
    description: "과목평가 2회차 · 모의고사 2회차",
    href: "/study/special-mock/2/2/quiz?mode=wrong",
    tone: "amber",
    source: "special-mock-exam",
    assessmentRound: 2,
    round: 2,
  },
  {
    id: "special-mock-a2-r3",
    label: "특별 모의고사 2-3",
    description: "과목평가 2회차 · 모의고사 3회차",
    href: "/study/special-mock/2/3/quiz?mode=wrong",
    tone: "amber",
    source: "special-mock-exam",
    assessmentRound: 2,
    round: 3,
  },
  {
    id: "special-mock-a2-r4",
    label: "특별 모의고사 2-4",
    description: "과목평가 2회차 · 모의고사 4회차",
    href: "/study/special-mock/2/4/quiz?mode=wrong",
    tone: "amber",
    source: "special-mock-exam",
    assessmentRound: 2,
    round: 4,
  },
  {
    id: "special-mock-a2-r5",
    label: "특별 모의고사 2-5",
    description: "과목평가 2회차 · 모의고사 5회차",
    href: "/study/special-mock/2/5/quiz?mode=wrong",
    tone: "amber",
    source: "special-mock-exam",
    assessmentRound: 2,
    round: 5,
  },
  {
    id: "special-mock-a3-r1",
    label: "특별 모의고사 3-1",
    description: "과목평가 3회차 · 모의고사 1회차",
    href: "/study/special-mock/3/1/quiz?mode=wrong",
    tone: "amber",
    source: "special-mock-exam",
    assessmentRound: 3,
    round: 1,
  },
  {
    id: "special-mock-a3-r2",
    label: "특별 모의고사 3-2",
    description: "과목평가 3회차 · 모의고사 2회차",
    href: "/study/special-mock/3/2/quiz?mode=wrong",
    tone: "amber",
    source: "special-mock-exam",
    assessmentRound: 3,
    round: 2,
  },
  {
    id: "special-mock-a3-r3",
    label: "특별 모의고사 3-3",
    description: "과목평가 3회차 · 모의고사 3회차",
    href: "/study/special-mock/3/3/quiz?mode=wrong",
    tone: "amber",
    source: "special-mock-exam",
    assessmentRound: 3,
    round: 3,
  },
  {
    id: "special-mock-a3-r4",
    label: "특별 모의고사 3-4",
    description: "과목평가 3회차 · 모의고사 4회차",
    href: "/study/special-mock/3/4/quiz?mode=wrong",
    tone: "amber",
    source: "special-mock-exam",
    assessmentRound: 3,
    round: 4,
  },
  {
    id: "special-mock-a3-r5",
    label: "특별 모의고사 3-5",
    description: "과목평가 3회차 · 모의고사 5회차",
    href: "/study/special-mock/3/5/quiz?mode=wrong",
    tone: "amber",
    source: "special-mock-exam",
    assessmentRound: 3,
    round: 5,
  },
] as const;
