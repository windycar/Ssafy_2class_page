import type { AiPythonWeek } from "../../types/aiPythonWeekStudy";

export const AI_PYTHON_WEEK_META: Record<
  AiPythonWeek,
  {
    weekLabel: string;
    title: string;
    shortTitle: string;
    description: string;
    topics: string;
    imageSrc: string;
    gradient: string;
    accent: string;
    questionCount: number;
  }
> = {
  week1: {
    weekLabel: "1주차",
    title: "AI 파이썬 1주차",
    shortTitle: "머신러닝 기초",
    description: "AI·ML·DL의 관계부터 선형회귀와 모델 평가까지 학습합니다.",
    topics: "AI · ML · 선형회귀 · 모델평가",
    imageSrc: "/images/study-tracks/ai-python-week1.png",
    gradient: "from-[#3b104f] via-[#7a238f] to-[#4b52c8]",
    accent: "#a855f7",
    questionCount: 300,
  },
  week2: {
    weekLabel: "2주차",
    title: "AI 파이썬 2주차",
    shortTitle: "자연어 처리",
    description: "워드 임베딩부터 Transformer와 LLM 활용까지 학습합니다.",
    topics: "NLP · RNN · Transformer · LLM",
    imageSrc: "/images/study-tracks/ai-python-week2.png",
    gradient: "from-[#172554] via-[#3730a3] to-[#7e22ce]",
    accent: "#6366f1",
    questionCount: 450,
  },
};

export const AI_PYTHON_WEEK_TOTAL_QUESTIONS = Object.values(
  AI_PYTHON_WEEK_META,
).reduce((total, week) => total + week.questionCount, 0);
