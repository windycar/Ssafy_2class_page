import type {
  AiPythonWeekDifficulty,
  AiPythonWeekQuestion,
} from "../../types/aiPythonWeekStudy";
import { ESSAY_MIN_LENGTH } from "../../constants/study.ts";

type AiPythonWeekQuestionBank = Record<
  AiPythonWeekDifficulty,
  AiPythonWeekQuestion[]
>;

type DetailRule = {
  match: RegExp;
  detail: string;
};

const DETAIL_RULES: DetailRule[] = [
  { match: /지도학습/, detail: "지도학습은 입력 feature와 정답 label의 쌍을 이용해 규칙을 배우고, 학습하지 않은 입력의 label을 예측한다." },
  { match: /회귀와 분류/, detail: "예측 대상이 연속적인 수치면 회귀이고, 미리 정해진 범주 중 하나면 분류이므로 출력 label의 형태를 먼저 확인해야 한다." },
  { match: /손실함수|MSE|교차 엔트로피/, detail: "손실함수는 예측과 정답의 차이를 하나의 수치로 나타내며, 학습 과정은 이 값이 작아지는 방향으로 파라미터를 갱신한다." },
  { match: /혼동행렬|TP|FP|TN|FN/, detail: "혼동행렬은 실제값과 예측값을 TP·FP·TN·FN으로 나누므로 정확도만으로 보이지 않는 오탐과 미탐을 구분할 수 있다." },
  { match: /테스트 오류|일반화/, detail: "학습에 사용하지 않은 데이터의 오류를 확인해야 모델이 훈련 데이터를 외운 것인지 새로운 데이터에도 일반화하는지 판단할 수 있다." },
  { match: /과적합|언더피팅/, detail: "훈련 오류만 작고 검증 오류가 크면 과적합이고, 두 오류가 모두 크면 모델이 핵심 패턴도 배우지 못한 언더피팅으로 해석한다." },
  { match: /교차검증|LOOCV/, detail: "K-겹 교차검증은 모든 폴드를 한 번씩 검증에 사용하고 결과를 평균해 한 번의 데이터 분할에서 생기는 우연을 줄인다." },
  { match: /비지도학습/, detail: "비지도학습은 정답 label 없이 입력 사이의 유사성이나 구조를 이용해 군집, 축, 잠재 패턴을 찾는다." },
  { match: /K-means/, detail: "K-means는 가까운 중심으로 관측치를 배정하고 배정 결과의 평균으로 중심을 다시 계산하는 과정을 수렴할 때까지 반복한다." },
  { match: /계층적 군집|덴드로그램|linkage/, detail: "계층적 군집은 가까운 집단을 단계적으로 병합하며, 그 순서를 덴드로그램으로 확인하고 원하는 높이에서 잘라 군집을 결정한다." },
  { match: /표준화/, detail: "표준화는 변수의 평균을 0, 표준편차를 1로 바꾸어 값의 단위가 큰 변수가 거리나 학습을 과도하게 지배하지 않게 한다." },
  { match: /로지스틱 회귀|odds|logit/, detail: "로지스틱 회귀는 입력의 선형 결합을 시그모이드에 통과시켜 0~1 확률을 만들고 임계값으로 두 범주를 구분한다." },
  { match: /ReLU/, detail: "ReLU는 음수 입력을 0으로, 양수 입력을 그대로 출력해 선형층 사이에 비선형성을 추가한다." },
  { match: /경사하강법|SGD|학습률/, detail: "경사하강법은 손실이 증가하는 기울기의 반대 방향으로 이동하며, 학습률이 한 번에 이동할 크기를 결정한다." },
  { match: /역전파|연쇄법칙/, detail: "역전파는 출력의 손실에서 입력 방향으로 연쇄법칙을 적용해 각 파라미터가 손실에 미친 기울기를 계산한다." },
  { match: /다중선형회귀|여러 설명변수/, detail: "다중선형회귀는 여러 입력 변수를 동시에 사용하며, 한 계수는 다른 변수를 고정했을 때 해당 변수의 변화와 예측값의 관계를 나타낸다." },
  { match: /선형회귀|절편|β̂|RSS|잔차/, detail: "선형회귀는 연속형 출력을 직선식으로 근사하며, 최소제곱법은 실제값과 예측값의 잔차 제곱합이 가장 작은 계수를 찾는다." },
  { match: /상관관계|인과관계|다중공선성/, detail: "변수들이 함께 움직인다는 사실만으로 원인과 결과를 단정할 수 없고, 입력 변수끼리 강하게 연관되면 개별 계수 해석도 불안정해질 수 있다." },
  { match: /AI|ML|DL|딥러닝/, detail: "포함 관계는 AI가 가장 넓고 그 안에 ML, 다시 그 안에 다층 신경망을 사용하는 DL이 위치한다." },
  { match: /CBOW/, detail: "CBOW는 여러 주변 단어의 벡터를 모아 가운데 단어를 예측하며, 중심 단어로 주변 단어를 예측하는 Skip-gram과 방향이 반대다." },
  { match: /기울기 소실|vanishing/i, detail: "시간축 역전파에서 작은 미분값이 반복해서 곱해지면 앞 시점으로 전달되는 기울기가 0에 가까워져 장기 의존성을 배우기 어려워진다." },
  { match: /Input gate/, detail: "Input gate는 현재 입력에서 만든 후보 정보 중 얼마를 Cell state에 새로 기록할지 0~1 비율로 조절한다." },
  { match: /Output gate/, detail: "Output gate는 갱신된 Cell state 중 어느 정보를 현재 Hidden state로 내보낼지 결정한다." },
  { match: /Reset gate/, detail: "GRU의 Reset gate는 새 후보 상태를 계산할 때 이전 Hidden state를 얼마나 반영할지 조절한다." },
  { match: /Update gate/, detail: "GRU의 Update gate는 이전 Hidden state를 유지할 비율과 새 후보 상태를 반영할 비율을 함께 조절한다." },
  { match: /Multi-Head Attention/, detail: "여러 Attention head는 서로 다른 Q·K·V 투영을 사용하므로 문법, 거리, 의미처럼 여러 관계를 병렬로 포착할 수 있다." },
  { match: /Cross-Attention/, detail: "Cross-Attention은 디코더 상태에서 Query를 만들고 인코더 출력에서 Key와 Value를 받아 현재 생성에 필요한 입력 정보를 찾는다." },
  { match: /Layer Normalization/, detail: "Layer Normalization은 한 토큰의 은닉 차원 값을 정규화해 층을 거치며 값의 크기가 불안정해지는 문제를 줄인다." },
  { match: /창발성|Emergent/i, detail: "창발성은 모델 규모나 학습량이 임계 구간을 넘을 때 작은 모델에서 뚜렷하지 않던 능력이 관측되는 현상이다." },
  { match: /In-context|인-컨텍스트|Few-shot/i, detail: "인-컨텍스트 학습은 가중치를 다시 학습하지 않고 프롬프트의 지시와 예시를 문맥으로 사용해 새로운 과제를 수행한다." },
  { match: /Chinchilla/, detail: "Chinchilla 법칙은 제한된 연산량에서 파라미터 수만 키우지 말고 학습 토큰 수도 균형 있게 늘려야 효율적이라고 본다." },
  { match: /Beam Search/, detail: "Beam Search는 매 생성 단계에서 누적 점수가 높은 여러 경로를 유지해 한 토큰만 즉시 고르는 Greedy 방식보다 넓게 탐색한다." },
  { match: /Top-P|Nucleus/i, detail: "Top-P는 확률이 높은 토큰부터 누적해 합이 P에 도달하는 동적 후보군 안에서 샘플링한다." },
  { match: /Top-K/, detail: "Top-K는 다음 토큰 확률이 높은 K개만 남기고 나머지 후보의 확률을 제거한 뒤 샘플링한다." },
  { match: /Repetition Penalty/, detail: "반복 페널티는 이미 나온 토큰의 점수를 낮춰 같은 단어나 구절이 계속 생성되는 현상을 줄인다." },
  { match: /Length Penalty/, detail: "길이 페널티는 토큰이 늘수록 누적 로그 확률이 작아져 짧은 문장이 유리해지는 Beam Search의 편향을 보정한다." },
  { match: /Zero-shot CoT/, detail: "Zero-shot CoT는 풀이 예시 없이도 단계적으로 생각하라는 지시를 추가해 중간 추론을 유도한다." },
  { match: /Persona|페르소나/, detail: "페르소나는 역할, 전문성, 말투를 지정해 같은 질문에도 원하는 관점과 표현 방식으로 답하게 한다." },
  { match: /Prompt Chaining|프롬프트 체이닝/, detail: "프롬프트 체이닝은 큰 작업을 작은 단계로 나누고 앞 단계의 출력을 다음 단계의 입력으로 연결한다." },
  { match: /Prefix Injection/, detail: "Prefix Injection은 공격자가 지정한 시작 문구를 모델이 따르게 만들어 원래의 안전 지침이나 거절 흐름을 우회하려는 공격이다." },
  { match: /Hallucination|환각/, detail: "환각은 모델이 학습한 언어 패턴에 따라 그럴듯한 문장을 만들지만 그 내용이 실제 근거나 사실과 일치하지 않는 현상이다." },
  { match: /ROUGE/, detail: "ROUGE는 생성 요약과 기준 요약 사이의 단어 또는 n-gram 재현 정도를 비교하지만 의미가 같은 다른 표현은 놓칠 수 있다." },
  { match: /Vector DB/, detail: "Vector DB는 문서 임베딩을 저장하고 질의 벡터와 가까운 항목을 근사 최근접 이웃 검색으로 빠르게 찾는다." },
  { match: /HNSW/, detail: "HNSW는 여러 층의 근접 그래프를 탐색해 모든 벡터와 직접 비교하지 않고도 가까운 이웃을 빠르게 찾는 ANN 인덱스다." },
  { match: /TruthfulQA/, detail: "TruthfulQA는 사람들이 흔히 믿는 오해나 잘못된 전제를 포함한 질문으로 모델이 사실에 맞게 답하는지 평가한다." },
  { match: /MoE|Mixture of Experts/, detail: "MoE는 라우터가 토큰마다 일부 전문가 네트워크만 선택해 전체 파라미터를 모두 계산하지 않고도 모델 용량을 키운다." },
  { match: /FlashAttention/, detail: "FlashAttention은 Q·K·V 계산을 GPU의 빠른 SRAM 타일에 나누고 중간 행렬 저장을 줄여 메모리 IO 비용을 낮춘다." },
  { match: /Flash-Decoding/, detail: "Flash-Decoding은 긴 KV cache를 여러 구간으로 병렬 처리해 한 토큰씩 생성할 때의 Attention 지연을 줄인다." },
  { match: /DPO Loss/, detail: "DPO Loss는 선호 응답과 비선호 응답의 로그 확률 비를 직접 비교해 별도 보상 모델과 PPO 없이 정책을 조정한다." },
  { match: /Value Network|Critic/, detail: "Value Network는 현재 상태에서 앞으로 받을 기대 보상을 추정해 PPO 정책 업데이트의 기준선과 advantage 계산에 사용된다." },
  { match: /Scheduled Sampling/, detail: "Scheduled Sampling은 학습이 진행될수록 정답 토큰 대신 모델이 직전에 생성한 토큰을 입력하는 비율을 높여 노출 편향을 줄인다." },
  { match: /Attention Map|어텐션 맵/, detail: "어텐션 맵은 출력 위치마다 입력 토큰에 부여한 가중치를 행렬로 보여주어 모델이 어느 부분을 참고했는지 확인하게 한다." },
  { match: /Hashing Trick|해시 트릭/, detail: "해시 트릭은 매우 많은 문자 n-gram을 고정된 수의 버킷에 매핑해 FastText의 메모리 사용량을 제한한다." },
  { match: /SKILL\.md/, detail: "SKILL.md는 반복 작업의 절차, 조건, 예시를 문서화해 에이전트가 같은 규칙을 일관되게 적용하도록 한다." },
];

const CATEGORY_DETAILS: DetailRule[] = [
  { match: /워드 임베딩/, detail: "워드 임베딩은 단어를 밀집 벡터로 표현해 함께 쓰이는 문맥과 의미 관계를 거리와 방향에 반영한다." },
  { match: /RNN|순환신경망/, detail: "RNN은 이전 시점의 Hidden state를 현재 입력과 함께 사용해 순서 정보를 다음 시점으로 전달한다." },
  { match: /LSTM/, detail: "LSTM은 Cell state와 여러 게이트로 정보를 선택적으로 유지·삭제해 기본 RNN의 장기 의존성 문제를 완화한다." },
  { match: /Seq2Seq|Attention/, detail: "Attention은 출력 시점마다 관련 있는 인코더 상태에 더 큰 가중치를 주어 필요한 입력 정보를 선택한다." },
  { match: /Transformer/, detail: "Transformer는 Self-Attention으로 토큰 사이의 관련성을 계산하고 위치 정보로 순서를 보완한다." },
  { match: /파운데이션|언어 모델/, detail: "파운데이션 모델은 대규모 데이터로 사전학습한 표현과 생성 능력을 여러 하위 과제에 맞게 활용한다." },
  { match: /정렬|Alignment/, detail: "정렬 학습은 모델의 출력 확률을 사람의 지시와 선호에 더 잘 맞도록 조정하는 과정이다." },
  { match: /디코딩|추론/, detail: "디코딩 방법은 다음 토큰 확률에서 실제 토큰을 선택하는 규칙이므로 정확성, 다양성, 반복성에 직접 영향을 준다." },
  { match: /프롬프트/, detail: "프롬프트 설계는 모델의 가중치를 바꾸지 않고 지시, 문맥, 예시와 출력 형식으로 응답을 유도한다." },
  { match: /평가|응용/, detail: "평가 지표는 문자열 일치, 의미, 사실성처럼 측정 대상이 다르므로 과제의 목적에 맞는 지표를 선택해야 한다." },
];

function sentence(value: string) {
  const trimmed = value
    .replace(/\s+/g, " ")
    .trim()
    .replace(
      /^정답은\s*(?:“[^”]+”|"[^"]+"|.+?)\s*(?:입니다|이다)\.\s*/,
      "",
    );
  return /[.!?。]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function correctAnswerText(question: AiPythonWeekQuestion) {
  if (question.answer !== null) return question.options[question.answer] ?? "";
  return question.acceptedAnswers?.[0] ?? question.modelAnswer ?? "";
}

function strengthenExplanation(
  question: AiPythonWeekQuestion,
  originalExplanation: string,
) {
  if (originalExplanation.length >= 80) return originalExplanation;

  const searchable = [
    question.conceptId,
    question.prompt,
    correctAnswerText(question),
  ].join(" ");
  const detail =
    DETAIL_RULES.find(({ match }) => match.test(searchable))?.detail ??
    CATEGORY_DETAILS.find(({ match }) => match.test(question.category))?.detail ??
    "문제에 제시된 입력, 처리 방식, 출력 조건이 이 개념의 정의와 일치하므로 다른 개념과 구분할 수 있다.";

  return sentence(`${originalExplanation} ${detail}`);
}

function strengthenShortAnswerReason(
  question: AiPythonWeekQuestion,
  expected: string,
  originalExplanation: string,
) {
  if (originalExplanation.length >= 35) return originalExplanation;

  if (/1D/.test(question.prompt)) {
    return `${originalExplanation} D는 차원을 뜻하므로 1D는 축이 하나인 1차원 데이터를 의미합니다.`;
  }

  if (/기울기.*기호/.test(question.prompt)) {
    return `${originalExplanation} β의 아래첨자 1은 기울기를, 기호 위의 모자는 실제 모수가 아닌 데이터로 추정한 값임을 나타냅니다.`;
  }

  const benchmarkDescription = question.prompt.match(/^(.+?)\s*벤치마크/);
  if (benchmarkDescription) {
    return `${originalExplanation} “${expected}”는 ${benchmarkDescription[1].trim()} 벤치마크의 표준 약자입니다.`;
  }

  const techniqueDescription = question.prompt.match(/^(.+?)\s*기법의 약자는/);
  if (techniqueDescription) {
    return `${originalExplanation} “${expected}”는 ${techniqueDescription[1].trim()} 기법을 가리키는 표준 약자입니다.`;
  }

  return `${originalExplanation} 문제에서 설명한 조건과 기능을 직접 가리키는 용어가 “${expected}”이기 때문입니다.`;
}

export function enrichAiPythonWeekExplanation(
  question: AiPythonWeekQuestion,
): AiPythonWeekQuestion {
  const originalExplanation = sentence(question.explanation);
  const strengthenedExplanation = strengthenExplanation(
    question,
    originalExplanation,
  );

  if (question.questionType === "multiple-choice") {
    return {
      ...question,
      explanation: [
        "정답인 이유",
        strengthenedExplanation,
      ].join("\n"),
    };
  }

  if (question.questionType === "short-answer") {
    const expected =
      question.acceptedAnswers?.[0] ?? question.modelAnswer ?? "핵심 용어";
    const strengthenedReason = strengthenShortAnswerReason(
      question,
      expected,
      strengthenedExplanation,
    );
    return {
      ...question,
      explanation: [
        "정답인 이유",
        strengthenedReason,
      ].join("\n"),
    };
  }

  const essayReason = strengthenExplanation(
    question,
    sentence(question.modelAnswer ?? originalExplanation),
  );
  return {
    ...question,
    minLength: ESSAY_MIN_LENGTH,
    explanation: [
      "정답인 이유",
      essayReason,
    ].join("\n"),
  };
}

export function enrichAiPythonWeekQuestionBankExplanations(
  bank: AiPythonWeekQuestionBank,
): AiPythonWeekQuestionBank {
  return Object.fromEntries(
    Object.entries(bank).map(([difficulty, questions]) => [
      difficulty,
      questions.map(enrichAiPythonWeekExplanation),
    ]),
  ) as AiPythonWeekQuestionBank;
}
