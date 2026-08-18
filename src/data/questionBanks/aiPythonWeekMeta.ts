import type { AiPythonWeek } from "../../types/aiPythonWeekStudy";

export const AI_PYTHON_WEEK_META: Record<
  AiPythonWeek,
  {
    weekLabel: string;
    sectionLabel?: string;
    title: string;
    cardTitle: string;
    shortTitle: string;
    description: string;
    topics: string;
    imageSrc: string;
    gradient: string;
    accent: string;
    questionCount: number;
    hasDifficultyLevels: boolean;
  }
> = {
  week1: {
    weekLabel: "1번째",
    title: "AI 파이썬 1번째",
    cardTitle: "AI 파이썬 1번째",
    shortTitle: "머신러닝 기초",
    description: "AI·ML·DL의 관계부터 선형회귀와 모델 평가까지 학습합니다.",
    topics: "AI · ML · 선형회귀 · 모델평가",
    imageSrc: "/images/study-tracks/ai-python-week1.png",
    gradient: "from-[#3b104f] via-[#7a238f] to-[#4b52c8]",
    accent: "#a855f7",
    questionCount: 300,
    hasDifficultyLevels: true,
  },
  week2: {
    weekLabel: "2번째",
    title: "AI 파이썬 2번째",
    cardTitle: "AI 파이썬 2번째",
    shortTitle: "자연어 처리",
    description: "워드 임베딩부터 Transformer와 LLM 활용까지 학습합니다.",
    topics: "NLP · RNN · Transformer · LLM",
    imageSrc: "/images/study-tracks/ai-python-week2.png",
    gradient: "from-[#172554] via-[#3730a3] to-[#7e22ce]",
    accent: "#6366f1",
    questionCount: 450,
    hasDifficultyLevels: true,
  },
  "week3-1": {
    weekLabel: "3번째",
    sectionLabel: "3-1",
    title: "AI 파이썬 3-1",
    cardTitle: "AI 파이썬 3번째",
    shortTitle: "컴퓨터 비전",
    description: "CNN의 구조부터 대표 모델과 비전 트랜스포머까지 학습합니다.",
    topics: "CNN · ResNet · Attention · ViT",
    imageSrc: "/images/study-tracks/ai-python-week3.png",
    gradient: "from-[#102044] via-[#4338a8] to-[#8b2fc9]",
    accent: "#22d3ee",
    questionCount: 150,
    hasDifficultyLevels: true,
  },
  "week3-2": {
    weekLabel: "3번째",
    sectionLabel: "3-2",
    title: "AI 파이썬 3-2",
    cardTitle: "AI 파이썬 3-2",
    shortTitle: "멀티모달 AI",
    description: "CLIP과 VLM부터 비주얼 프롬프팅과 세그멘테이션까지 학습합니다.",
    topics: "CLIP · VLM · LLaVA · SAM",
    imageSrc: "/images/study-tracks/ai-python-week3.png",
    gradient: "from-[#102044] via-[#4338a8] to-[#8b2fc9]",
    accent: "#22d3ee",
    questionCount: 150,
    hasDifficultyLevels: true,
  },
};

export const AI_PYTHON_WEEK_CARD_GROUPS = [
  {
    id: "week1",
    ...AI_PYTHON_WEEK_META.week1,
    links: [{ week: "week1", label: "난이도 선택하기" }],
  },
  {
    id: "week2",
    ...AI_PYTHON_WEEK_META.week2,
    links: [{ week: "week2", label: "난이도 선택하기" }],
  },
  {
    id: "week3",
    ...AI_PYTHON_WEEK_META["week3-1"],
    title: "AI 파이썬 3번째",
    cardTitle: "AI 파이썬 3번째",
    shortTitle: "컴퓨터 비전 · 멀티모달 AI",
    description: "3-1 컴퓨터 비전과 3-2 멀티모달 AI를 함께 학습합니다.",
    topics: "3-1 CNN · ResNet · ViT · 3-2 CLIP · VLM · SAM",
    questionCount: 300,
    links: [{ week: "week3-1", label: "3-1 · 3-2 범위 선택하기" }],
  },
] as const;

export const AI_PYTHON_WEEK_TOTAL_QUESTIONS = Object.values(
  AI_PYTHON_WEEK_META,
).reduce((total, week) => total + week.questionCount, 0);
