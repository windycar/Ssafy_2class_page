// AI Python 2주차 - 자연어 처리와 텍스트 파운데이션 모델
// 사용자 제공 쉬움·중간·어려움 문제은행을 앱 형식으로 정규화합니다.

import { ALL_QUESTIONS as RAW_EASY_QUESTIONS } from "./week2NlpEasyQuestions";
import { ALL_QUESTIONS as RAW_MEDIUM_QUESTIONS } from "./week2NlpMediumQuestions";
import { ALL_QUESTIONS as RAW_HARD_QUESTIONS } from "./week2NlpHardQuestions";
import type {
  AiPythonWeekDifficulty,
  AiPythonWeekQuestion,
} from "../../types/aiPythonWeekStudy";

export type StudyDifficulty = AiPythonWeekDifficulty;
export type StudyQuestion = AiPythonWeekQuestion;

const CITATION_MARKER = /\s*\[cite:\s*[^\]]+\]/gi;

const ESSAY_MULTIPLE_CHOICE_DISTRACTORS: Record<string, [string, string, string]> = {
  "nlp-emb-es-015": [
    "Skip-gram과 CBOW는 모두 중심 단어로 주변 단어를 예측하므로 예측 방향에 차이가 없다.",
    "Skip-gram은 주변 단어로 중심 단어를 예측하고, CBOW는 중심 단어로 주변 단어를 예측한다.",
    "Skip-gram은 문장 순서만 학습하고, CBOW는 문자 단위 n-gram만 학습한다.",
  ],
  "nlp-rnn-es-015": [
    "역전파 중 기울기가 계속 커지는 현상이며, 멀리 있는 정보를 더 강하게 기억하게 만든다.",
    "추론 단계에서만 은닉 상태가 사라지는 현상으로 학습 중 장기 의존성과는 관계가 없다.",
    "배치 크기가 작을 때 출력 확률이 0이 되는 현상이며, 가중치 반복 곱과는 무관하다.",
  ],
  "nlp-lstm-es-015": [
    "Forget gate는 출력을 만들고, Input gate는 과거 정보를 삭제하며, Output gate는 새 정보를 저장한다.",
    "세 게이트는 모두 같은 값을 계산하며 이름만 다르고 정보 제어 역할에는 차이가 없다.",
    "Forget gate는 입력을 분류하고, Input gate는 정답을 생성하며, Output gate는 손실을 역전파한다.",
  ],
  "nlp-s2s-es-015": [
    "디코더의 이전 예측값만 다음 입력으로 사용해 학습과 추론 환경을 항상 동일하게 만들기 위해 사용한다.",
    "추론 단계에서만 정답 문장을 제공하여 빔 서치의 후보 수를 줄이기 위해 사용한다.",
    "인코더 가중치를 고정하고 디코더의 출력층만 학습하기 위해 사용하는 정규화 기법이다.",
  ],
  "nlp-tr-es-015": [
    "Self-Attention이 이미 단어 순서를 자동 보존하므로 위치 인코딩은 임베딩 차원을 줄이기 위해 사용한다.",
    "미래 토큰을 가리는 마스크 역할만 수행하며 입력 토큰의 상대적·절대적 위치는 표현하지 않는다.",
    "단어 임베딩을 정답 라벨로 교체하여 분류 손실을 직접 계산하기 위해 필요하다.",
  ],
  "nlp-llm-es-015": [
    "데이터와 파라미터와 연산량을 늘릴수록 예측 손실이 일정하게 증가한다는 법칙이다.",
    "모델 성능은 데이터 양에만 좌우되고 파라미터 수와 컴퓨팅 자원은 영향을 주지 않는다는 법칙이다.",
    "모델이 특정 크기를 넘을 때만 성능이 무작위로 변하며 예측 가능한 추세는 없다는 주장이다.",
  ],
  "nlp-align-es-015": [
    "PPO 강화학습, 보상 모델 학습, 지도 미세조정 순서로 진행한다.",
    "보상 모델 학습, 지도 미세조정, PPO 강화학습 순서로 진행한다.",
    "지도 미세조정, PPO 강화학습, 보상 모델 학습 순서로 진행한다.",
  ],
  "nlp-dec-es-015": [
    "Top-K와 Top-P 모두 항상 확률 상위 K개의 고정된 후보만 사용한다.",
    "Top-K는 누적 확률이 P에 도달할 때까지 후보를 모으고, Top-P는 고정된 K개를 선택한다.",
    "두 방식 모두 후보군을 만들지 않고 매번 확률이 가장 높은 단어 하나만 선택한다.",
  ],
  "nlp-pe-es-015": [
    "유저 쿼리가 대화 전체의 영구 규칙을 정하고, 시스템 프롬프트는 한 번의 질문만 전달한다.",
    "두 프롬프트는 우선순위와 역할이 완전히 같으며 어느 위치에 작성해도 동일하게 처리된다.",
    "시스템 프롬프트는 모델의 답변이고, 유저 쿼리는 모델 내부 가중치를 수정하는 학습 데이터이다.",
  ],
  "nlp-eval-es-015": [
    "질문마다 모델 파라미터를 다시 미세조정하며 외부 문서를 검색하지 않는 방식이다.",
    "모델의 내부 학습 지식만으로 답변을 생성하므로 최신 근거와 관계없이 환각을 줄인다.",
    "답변 생성이 끝난 뒤 결과를 데이터베이스에 저장할 뿐 검색 결과를 입력 문맥에 제공하지 않는다.",
  ],
  "nlp-emb-es-med-015": [
    "사전에 없는 단어 전체를 하나의 0 벡터로 바꾸므로 별도의 부분 단어 정보가 필요 없다.",
    "새 단어가 나타날 때마다 전체 어휘 사전과 Word2Vec 모델을 처음부터 다시 학습한다.",
    "문자 구성은 무시하고 문장 안의 절대 위치 벡터만 합산해 OOV 임베딩을 만든다.",
  ],
  "nlp-rnn-es-med-015": [
    "기울기 폭발은 기울기가 0에 가까워지는 현상이며, Clipping은 모든 기울기를 0으로 만든다.",
    "임계값을 넘은 기울기의 방향을 반대로 뒤집고 크기를 더 키워 빠르게 수렴하게 한다.",
    "추론 단계의 출력 로짓만 제한하는 기법으로 역전파 기울기와는 관계가 없다.",
  ],
  "nlp-lstm-es-med-015": [
    "GRU는 LSTM보다 상태와 게이트가 더 많아 표현력은 낮지만 연산량은 더 크다.",
    "GRU는 순환 상태를 사용하지 않고 현재 입력만 처리하므로 시퀀스 정보를 기억하지 못한다.",
    "GRU는 LSTM과 동일한 Cell state와 세 개의 게이트를 사용해 구조적 차이가 없다.",
  ],
  "nlp-s2s-es-med-015": [
    "학습과 추론 모두 항상 정답 단어를 입력으로 사용하므로 두 단계의 입력 환경은 완전히 같다.",
    "인코더 레이어가 많아질수록 입력 문장이 짧아지는 현상이며 디코더의 이전 예측과는 무관하다.",
    "어텐션 가중치가 시각화되지 않는 문제로, 초기 예측 오차의 연쇄 누적은 발생하지 않는다.",
  ],
  "nlp-tr-es-med-015": [
    "Query, Key, Value가 모두 디코더의 마스킹 Self-Attention 출력에서 온다.",
    "Query, Key, Value가 모두 인코더의 최상단 출력에서 온다.",
    "Query는 인코더 출력에서 오고, Key와 Value는 디코더의 하위 출력에서 온다.",
  ],
  "nlp-llm-es-med-015": [
    "Zero-shot은 예시 1개, One-shot은 예시 여러 개, Few-shot은 예시 0개를 제공한다.",
    "세 방식 모두 프롬프트 예시 수와 관계없이 모델 가중치를 다시 학습하는 방법이다.",
    "세 방식의 차이는 프롬프트가 아니라 모델 파라미터 크기와 학습 토큰 수에만 있다.",
  ],
  "nlp-align-es-med-015": [
    "다양한 지시문 학습 없이 다음 토큰 예측만 반복하므로 새로운 지시를 그대로 암기한다.",
    "하나의 고정된 지시와 응답만 학습하여 동일한 문장에만 답할 수 있게 만든다.",
    "토크나이저의 어휘 크기만 늘리기 때문에 지시문의 의도 파악 능력은 학습하지 않는다.",
  ],
  "nlp-dec-es-med-015": [
    "Top-P는 항상 고정된 P개의 단어를 남기고, Top-K는 누적 확률에 따라 후보 수를 바꾼다.",
    "두 방식 모두 확률 분포와 관계없이 항상 같은 개수의 후보를 유지한다.",
    "Top-P는 확률이 가장 낮은 단어부터 후보에 넣어 문맥별 후보군을 구성한다.",
  ],
  "nlp-pe-es-med-015": [
    "문구를 입력할 때마다 모델 가중치를 미세조정하여 새로운 추론 알고리즘을 학습시킨다.",
    "중간 사고 과정을 출력하지 못하게 막고 최종 정답 토큰만 즉시 생성하도록 강제한다.",
    "외부 문서를 검색해 프롬프트에 추가하기 때문에 예시 없이도 사실 지식을 보충한다.",
  ],
  "nlp-eval-es-med-015": [
    "pass@1은 10개 후보 중 하나의 성공을, pass@10은 첫 번째 후보 한 개의 성공만 측정한다.",
    "두 지표 모두 생성 코드의 실행 속도와 메모리 사용량만 측정한다.",
    "단위 테스트 실행 없이 정답 코드와의 문자열 완전 일치 여부만 평가한다.",
  ],
  "nlp-emb-es-hard-015": [
    "Word2Vec과 GloVe 모두 국소 문맥에서 주변 단어를 예측하는 방식만 사용한다.",
    "두 방식 모두 예측 학습 없이 전체 동시 등장 횟수만 동일한 목적함수로 분해한다.",
    "Word2Vec은 전역 동시 등장 행렬을 회귀하고, GloVe는 국소 윈도우 예측만 수행한다.",
  ],
  "nlp-rnn-es-hard-015": [
    "역방향 LSTM 하나만 사용해 미래 문맥만 보므로 과거 정보는 은닉 상태에서 제외된다.",
    "두 LSTM이 모두 왼쪽에서 오른쪽으로 같은 순서로 처리해 단방향 모델과 문맥 범위가 같다.",
    "순환 연결을 제거하고 각 단어를 독립 처리하므로 앞뒤 시점 정보는 결합되지 않는다.",
  ],
  "nlp-lstm-es-hard-015": [
    "LSTM은 하나의 상태와 두 게이트를, GRU는 두 상태와 세 게이트를 사용해 GRU가 더 무겁다.",
    "LSTM과 GRU는 상태 수와 게이트 구성이 완전히 같아 표현력과 연산량 차이가 없다.",
    "GRU가 별도 Cell state와 세 게이트를 추가하므로 LSTM보다 파라미터가 많고 느리다.",
  ],
  "nlp-s2s-es-hard-015": [
    "인코더의 마지막 고정 벡터만 사용하므로 병목 현상과 긴 문장 정보 손실이 그대로 유지된다.",
    "번역 속도만 높일 뿐 성능에는 영향을 주지 않으며 가중치로 정렬 근거도 확인할 수 없다.",
    "어텐션 맵은 무작위 값이라 원문과 번역 단어의 대응 관계를 해석하는 데 사용할 수 없다.",
  ],
  "nlp-tr-es-hard-015": [
    "Pre-LN은 잔차 합산 뒤에 정규화하고 Post-LN은 서브레이어 전에 정규화하므로 Pre-LN이 더 불안정하다.",
    "두 구조는 정규화 위치와 기울기 경로가 같아 깊은 네트워크의 학습 안정성 차이가 없다.",
    "Pre-LN은 잔차 연결을 제거하여 모든 기울기가 정규화 레이어만 통과하게 만든다.",
  ],
  "nlp-llm-es-hard-015": [
    "창발성은 연속 지표에서도 항상 갑작스럽게 발생하므로 평가 지표 선택과 무관하다는 주장이다.",
    "모든 평가 지표가 불연속적이기 때문에 모델 크기에 따른 매끄러운 성능 변화는 측정할 수 없다.",
    "모델 규모가 커질수록 연속 지표상의 성능이 일정하게 하락한다는 가설이다.",
  ],
  "nlp-align-es-hard-015": [
    "DPO는 별도 보상 모델과 PPO 루프를 추가하여 RLHF보다 더 많은 단계를 거친다.",
    "선호 데이터는 사용하지 않고 비지도 다음 토큰 예측 손실만으로 모델을 정렬한다.",
    "정책과 보상 모델을 적대적으로 반복 학습하므로 표준 분류 손실보다 최적화가 불안정하다.",
  ],
  "nlp-dec-es-hard-015": [
    "이전 은닉 벡터와 유사한 후보일수록 보너스 점수를 주어 반복 표현을 더 자주 선택한다.",
    "코사인 유사도는 사용하지 않고 확률이 가장 높은 토큰만 선택하는 Greedy 방식과 같다.",
    "문장 길이에만 페널티를 적용하며 토큰 표현의 반복 유사성은 점수에 반영하지 않는다.",
  ],
  "nlp-pe-es-hard-015": [
    "사용자가 채팅 입력창에 직접 악성 명령을 작성하는 경우만 뜻하며 외부 문서와는 무관하다.",
    "RAG가 검색한 외부 문서는 자동으로 신뢰되므로 그 안의 지시문은 시스템 동작에 영향을 줄 수 없다.",
    "벡터 검색 속도만 낮추는 공격으로 모델의 시스템 지침이나 실행 제어권은 변경하지 않는다.",
  ],
  "nlp-eval-es-hard-015": [
    "GPQA는 초등 수준 문제를 일반 사용자가 출제하고, MMLU는 박사급 과학 문제만 평가한다.",
    "두 벤치마크 모두 파이썬 코드 생성과 단위 테스트 통과 여부만 측정한다.",
    "MMLU가 박사급 전문가 과학 추론에 집중하고, GPQA가 57개 대학교재 분야를 폭넓게 평가한다.",
  ],
};

function cleanText(value: string) {
  return value.replace(CITATION_MARKER, "").trim();
}

function rebalanceQuestionTypes(rawQuestions: readonly unknown[]) {
  const questions = rawQuestions as readonly AiPythonWeekQuestion[];
  const byCategory = new Map<string, AiPythonWeekQuestion[]>();
  questions.forEach((question) => {
    const categoryQuestions = byCategory.get(question.category) ?? [];
    categoryQuestions.push(question);
    byCategory.set(question.category, categoryQuestions);
  });

  const convertedShortAnswerIds = new Set<string>();
  const convertedEssayIds = new Set<string>();
  byCategory.forEach((categoryQuestions) => {
    categoryQuestions
      .filter((question) => question.questionType === "short-answer")
      .slice(2)
      .forEach((question) => convertedShortAnswerIds.add(question.id));
    categoryQuestions
      .filter((question) => question.questionType === "essay")
      .slice(1)
      .forEach((question) => convertedEssayIds.add(question.id));
  });

  return questions.map((question): AiPythonWeekQuestion => {
    if (convertedShortAnswerIds.has(question.id)) {
      const correctAnswer = question.acceptedAnswers?.[0] ?? question.modelAnswer;
      const distractors = (byCategory.get(question.category) ?? [])
        .filter(
          (candidate) =>
            candidate.questionType === "short-answer" &&
            candidate.id !== question.id,
        )
        .map(
          (candidate) =>
            candidate.acceptedAnswers?.[0] ?? candidate.modelAnswer ?? "",
        )
        .filter((answer) => answer && answer !== correctAnswer)
        .slice(0, 3);
      if (!correctAnswer || distractors.length !== 3) {
        throw new Error(`${question.id}: 단답형 객관식 전환 선택지 부족`);
      }
      return {
        ...question,
        questionType: "multiple-choice",
        options: [correctAnswer, ...distractors],
        answer: 0,
        acceptedAnswers: undefined,
        modelAnswer: undefined,
        rubricKeywords: undefined,
        minLength: undefined,
      };
    }

    if (convertedEssayIds.has(question.id)) {
      const correctAnswer = question.modelAnswer;
      const distractors = ESSAY_MULTIPLE_CHOICE_DISTRACTORS[question.id];
      if (!correctAnswer || !distractors) {
        throw new Error(`${question.id}: 서술형 객관식 전환 선택지 누락`);
      }
      return {
        ...question,
        questionType: "multiple-choice",
        options: [correctAnswer, ...distractors],
        answer: 0,
        acceptedAnswers: undefined,
        modelAnswer: undefined,
        rubricKeywords: undefined,
        minLength: undefined,
      };
    }

    return question;
  });
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
    const question: AiPythonWeekQuestion = {
      ...source,
      difficulty,
      prompt: cleanText(source.prompt),
      options: source.options.map(cleanText),
      acceptedAnswers: source.acceptedAnswers?.map(cleanText),
      modelAnswer: source.modelAnswer
        ? cleanText(source.modelAnswer)
        : undefined,
      rubricKeywords: source.rubricKeywords?.map(cleanText),
      explanation: cleanText(source.explanation),
      hint: source.hint ? cleanText(source.hint) : "",
    };
    if (!question.hint) question.hint = fallbackHint(question);
    if (question.questionType !== "multiple-choice") return question;

    const normalized = rotateOptions(question, multipleChoiceIndex);
    multipleChoiceIndex += 1;
    return normalized;
  });
}

const EASY_QUESTIONS = normalizeQuestions(
  "easy",
  rebalanceQuestionTypes(RAW_EASY_QUESTIONS),
  0,
);
const MEDIUM_QUESTIONS = normalizeQuestions(
  "medium",
  rebalanceQuestionTypes(RAW_MEDIUM_QUESTIONS),
  120,
);
const HARD_QUESTIONS = normalizeQuestions(
  "hard",
  rebalanceQuestionTypes(RAW_HARD_QUESTIONS),
  240,
);

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
