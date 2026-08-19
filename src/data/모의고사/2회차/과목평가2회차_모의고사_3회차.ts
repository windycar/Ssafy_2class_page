export type StudyDifficulty = "easy" | "medium" | "hard" | "extreme";
export type StudyQuestionType = "multiple-choice" | "short-answer" | "essay";

export interface StudyQuestion {
  id: string;
  conceptId: string;
  difficulty: StudyDifficulty;
  category: string;
  questionType: StudyQuestionType;
  prompt: string;
  code?: string;
  options: string[];
  answer: number | null;
  acceptedAnswers?: string[];
  modelAnswer?: string;
  rubricKeywords?: string[];
  minLength?: number;
  explanation: string;
  hint: string;
}

export const SSAFY_AI_MOCK_EXAM_ROUND_3: StudyQuestion[] = [
  // =========================================================================
  // [PART 1: 객관식 24문항] (정답 0, 1, 2, 3번 각 6개씩 25% 완벽 균등 분산)
  // =========================================================================

  // --- [머신러닝 기초 및 회귀 분석] (Q1 ~ Q4) ---
  {
    id: "r3-mc-001",
    conceptId: "overfitting-vs-underfitting-complexity",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "머신러닝 모델의 복잡도와 학습 데이터 크기에 따른 과적합 및 과소적합 특성으로 가장 올바른 것은?",
    options: [
      "과도한 모델 복잡도는 과적합을 일으키며 데이터 증가는 이를 완화할 수 있음",
      "모델 복잡도가 낮을수록 높은 분산을 보이며 새로운 테스트 데이터에 과민하게 반응함",
      "훈련 데이터셋의 크기가 증가할수록 모델의 과적합 위험도가 항상 비례하여 증가함",
      "과소적합 상태의 모델은 훈련 데이터셋에 대한 학습 오차가 0에 가깝게 수렴함"
    ],
    answer: 0,
    explanation: "복잡도가 높은 모델은 훈련 데이터의 노이즈까지 암기하여 분산이 커지고 과적합되기 쉬우나, 더 많은 학습 데이터를 확보하면 과적합을 효과적으로 완화할 수 있습니다.",
    hint: "모델의 표현력이 데이터에 비해 너무 크거나 작을 때 발생하는 현상과 데이터 증합의 효과를 고려하세요."
  },
  {
    id: "r3-mc-002",
    conceptId: "multiple-regression-coefficient-interpretation",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "다중선형회귀 모형 Y = beta_0 + beta_1 X_1 + ... + beta_p X_p + epsilon 에서 특정 회귀계수 beta_j의 해석으로 가장 올바른 것은?",
    options: [
      "다른 독립 변수의 값과 관계없이 X_j가 1 증가하면 Y가 항상 정확히 beta_j만큼 증가함",
      "다른 독립 변수들을 고정했을 때 X_j가 1 증가하면 종속변수 Y는 평균적으로 beta_j만큼 변화함",
      "beta_j는 X_j와 Y의 인과관계가 반드시 존재한다는 것을 증명하는 확률값임",
      "beta_j는 전체 모델의 결정계수 R^2와 항상 같은 값을 가짐"
    ],
    answer: 1,
    explanation: "다중선형회귀에서 beta_j는 다른 독립 변수들을 고정했을 때 X_j가 1단위 증가할 경우 종속변수 Y가 평균적으로 얼마나 변하는지를 나타냅니다.",
    hint: "다중회귀 계수는 다른 설명변수를 고정한 상태에서 특정 변수의 평균적인 영향력을 해석합니다."
  },
  {
    id: "r3-mc-003",
    conceptId: "r2-rse-regression-evaluation",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "다중선형회귀 모델의 성능을 평가할 때 사용하는 결정계수(R^2)와 잔차표준오차에 대한 설명으로 가장 올바른 것은?",
    options: [
      "R^2은 각 회귀계수의 p-value를 평균한 값이고, RSE는 독립변수 개수를 의미함",
      "R^2과 RSE는 모두 분류 문제에서만 사용하는 정확도 지표임",
      "R^2은 설명된 변동 비율, RSE는 잔차의 전형적 크기를 나타냄",
      "R^2이 1에 가까울수록 모델 설명력이 낮고 RSE가 클수록 예측 오차가 작음을 의미함"
    ],
    answer: 2,
    explanation: "R^2은 회귀 모델의 설명력을 나타내며 1에 가까울수록 설명력이 높습니다. RSE는 모델이 설명하지 못하고 남긴 잔차의 전형적인 크기를 나타내는 오차 지표입니다.",
    hint: "하나는 모델의 설명력, 다른 하나는 남아 있는 오차의 크기를 나타냅니다."
  },
  {
    id: "r3-mc-004",
    conceptId: "feature-label-and-learning-type",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "머신러닝의 데이터 구성 요소인 특성 및 정답과 문제 유형의 구분에 대한 설명으로 가장 올바른 것은?",
    options: [
      "입력 특성은 항상 1차원 스칼라값이어야 하며 2차원 이상의 벡터는 입력될 수 없음",
      "목표 변수인 Label이 연속적인 수치형 데이터인 문제를 분류라고 정의함",
      "지도학습은 Label이 없는 상태에서 데이터의 군집 구조를 찾는 군집화 작업을 포함함",
      "입력 변수는 데이터 속성이며 정답이 범주형이면 분류, 연속형이면 회귀임"
    ],
    answer: 3,
    explanation: "입력 설명변수가 Feature(X), 예측하려는 목표값이 Label(Y)이며, Label이 이산적/범주형이면 분류, 연속적 수치면 회귀 작업입니다.",
    hint: "입력 변수와 목표 변수의 정의 및 목표 변수 데이터 형태에 따른 작업 분류를 확인하세요."
  },

  // --- [자연어 처리 및 시퀀스/LLM] (Q5 ~ Q10) ---
  {
    id: "r3-mc-005",
    conceptId: "one-hot-encoding-limitations",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "전통적인 원-핫 인코딩 방식으로 텍스트 단어를 표현할 때 발생하는 본질적인 한계점은?",
    options: [
      "벡터가 희소·고차원이며 단어 간 의미적 유사도를 표현하지 못함",
      "모든 단어 벡터의 길이가 서로 달라 코사인 유사도를 수학적으로 계산할 수 없음",
      "신경망에 주입할 때 역전파 미분이 불가능하여 가중치를 학습시킬 수 없음",
      "단어의 글자 수가 5글자 이상인 긴 단어는 벡터로 변환할 수 없음"
    ],
    answer: 0,
    explanation: "원-핫 벡터는 서로 직교(Orthogonal)하므로 내적이 0이 되어 단어 간 유사성을 반영하지 못하며, 어휘 수가 늘어날수록 극도로 희소(Sparse)해지는 단점이 있습니다.",
    hint: "서로 다른 원-핫 벡터끼리 내적했을 때 나오는 값과 공간 상의 직교성을 생각하세요."
  },
  {
    id: "r3-mc-006",
    conceptId: "word2vec-window-size-context-range",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "Word2Vec의 Skip-Gram 학습에서 Window Size=2로 설정했을 때 문맥 단어의 범위를 가장 올바르게 설명한 것은?",
    options: [
      "중심 단어를 포함해 문장 전체의 모든 단어를 항상 문맥으로 사용함",
      "중심 단어를 기준으로 앞쪽 최대 2개와 뒤쪽 최대 2개의 단어를 문맥으로 사용함",
      "중심 단어 앞쪽의 단어 2개만 문맥으로 사용하고 뒤쪽 단어는 제외함",
      "문맥 단어를 사용하지 않고 중심 단어 하나만으로 자기 자신을 예측함"
    ],
    answer: 1,
    explanation: "Window Size는 중심 단어 주변에서 몇 개의 단어를 문맥으로 볼 것인지를 뜻합니다. Window Size=2이면 중심 단어의 앞뒤에서 각각 최대 2개의 주변 단어를 문맥으로 사용합니다.",
    hint: "강의자료의 banking 예시에서 중심 단어 양옆의 단어들이 몇 개씩 선택되는지 떠올려 보세요."
  },
  {
    id: "r3-mc-007",
    conceptId: "rnn-sequential-vs-transformer-parallel",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "순환 신경망이 가진 순차적 의존성 한계를 극복하고 트랜스포머가 전체 문장을 한 번에 병렬 처리할 수 있게 된 핵심 설계는?",
    options: [
      "은닉 상태를 타임스텝마다 디스크에 저장한 후 순차적으로 불러오는 방식",
      "모든 활성화 함수를 시그모이드로 고정하고 게이트를 10개로 확장한 구조",
      "순환 구조 없이 위치 인코딩과 셀프 어텐션으로 토큰 관계를 병렬 계산함",
      "디코더 계층을 삭제하고 인코더만으로 자기회귀 생성을 수행하는 구조"
    ],
    answer: 2,
    explanation: "이전 시점의 출력이 다음 시점의 입력이 되는 순환 구조를 없애고, 위치 인코딩으로 순서를 주입한 뒤 Self-Attention으로 시퀀스 전체를 한 번에 병렬 연산합니다.",
    hint: "순환 연결을 버리고 위치 정보와 어텐션을 결합해 행렬 곱으로 일괄 처리하는 구조입니다."
  },
  {
    id: "r3-mc-008",
    conceptId: "perplexity-metric-interpretation",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "언어 모델의 대표적인 정량적 평가 지표인 Perplexity에 대한 설명으로 가장 올바른 것은?",
    options: [
      "PPL 수치는 높을수록 모델이 다음 단어를 불확실성 없이 정확하게 예측함을 뜻함",
      "PPL은 생성된 텍스트와 정답 텍스트 사이의 n-gram 정밀도만을 단독 측정함",
      "PPL은 0과 1 사이의 고정된 확률값으로만 표현되며 음수 값을 가질 수 있음",
      "다음 단어 예측의 불확실성을 나타내며 낮을수록 성능이 좋음"
    ],
    answer: 3,
    explanation: "Perplexity(PPL)는 역확률의 기하평균으로 모델의 분기 계수(Branching Factor)를 의미하며, 낮을수록 다음 토큰을 헷갈리지 않고 정확히 예측한다는 의미입니다.",
    hint: "혼잡도라는 단어의 의미와 모델이 다음 단어 후보군을 좁히는 능력을 생각하세요."
  },
  {
    id: "r3-mc-009",
    conceptId: "few-shot-vs-zero-shot-prompting",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "LLM의 인컨텍스트 러닝에서 Zero-shot과 Few-shot 프롬프팅의 차이에 대한 설명으로 가장 올바른 것은?",
    options: [
      "Zero-shot은 지시문만, Few-shot은 예시도 제공하며 가중치는 갱신하지 않음",
      "Few-shot 프롬프팅은 제공된 예시 데이터를 바탕으로 모델의 파라미터 가중치를 직접 역전파 갱신함",
      "Zero-shot 프롬프팅은 오직 텍스트 임베딩 차원이 0차원일 때만 적용 가능한 기법임",
      "Few-shot 프롬프팅을 적용하면 모델의 컨텍스트 윈도우 크기가 자동으로 10배 확장됨"
    ],
    answer: 0,
    explanation: "인컨텍스트 러닝은 가중치 파라미터를 수정하지 않는 비파괴적 방식으로, 예시(Exemplar)의 유무에 따라 Zero-shot과 Few-shot으로 나뉩니다.",
    hint: "프롬프트 내에 문제-정답 예시를 포함하는지 여부와 가중치 갱신의 유무를 확인하세요."
  },
  {
    id: "r3-mc-010",
    conceptId: "rouge1-overlap-calculation",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "강의자료의 ROUGE-1 예시처럼 정답 문장이 6개의 unigram으로 구성되어 있고 생성 문장과 겹치는 unigram이 5개라면 ROUGE-1 값은?",
    options: [
      "0.50",
      "약 0.83",
      "1.20",
      "5.00"
    ],
    answer: 1,
    explanation: "강의자료의 예시에서는 겹치는 unigram 수를 정답 문장의 전체 unigram 수로 나누어 ROUGE-1을 계산하므로 5/6 ≈ 0.83입니다.",
    hint: "겹친 단어 수 5를 정답 문장의 전체 단어 수 6으로 나누어 보세요."
  },

  // --- [CNN 및 대표 비전 아키텍처] (Q11 ~ Q16) ---
  {
    id: "r3-mc-011",
    conceptId: "pooling-layer-fundamental-roles",
    difficulty: "medium",
    category: "합성곱 신경망 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "CNN에서 합성곱 계층 사이에 적용되는 풀링 계층의 구조적 역할에 대한 설명으로 가장 올바른 것은?",
    options: [
      "특징 맵의 채널 깊이를 2배로 확장하여 비선형 표현력을 늘려줌",
      "학습해야 할 가중치 파라미터가 가장 많이 집중되는 연산 계층임",
      "매개변수 없이 해상도를 줄이고 작은 위치 변화에 대한 불변성을 높임",
      "역전파 시 기울기 소실을 막기 위해 모든 활성화 값을 1로 정규화함"
    ],
    answer: 2,
    explanation: "풀링은 학습 파라미터 없이 윈도우 내 대표값(최대값, 평균값)을 취해 해상도를 줄이고 연산량을 절감하며 공간적 이동에 대한 강건성을 부여합니다.",
    hint: "가중치 학습 여부, 공간 크기 축소, 위치 변화에 대한 둔감성 효과를 고려하세요."
  },
  {
    id: "r3-mc-012",
    conceptId: "padding-application-main-purpose",
    difficulty: "medium",
    category: "합성곱 신경망 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "합성곱 연산 시 입력 데이터의 외곽 테두리에 0 등의 값을 채워 넣는 패딩의 주된 목적은?",
    options: [
      "입력 이미지의 RGB 색상 채널 수를 1개로 압축하기 위함",
      "합성곱 연산의 파라미터 가중치 개수를 0으로 만들기 위함",
      "모든 피처맵의 원소 값을 음수로 변환하여 과적합을 방지하기 위함",
      "가장자리 정보 손실과 계층별 해상도 축소를 제어함"
    ],
    answer: 3,
    explanation: "패딩이 없으면 연산마다 외곽 픽셀이 덜 참조되고 크기가 줄어들므로, 외곽 정보 보존과 해상도 유지를 위해 제로 패딩을 적용합니다.",
    hint: "외곽 화소가 필터에 참조되는 횟수와 출력 맵의 크기 축소 방지 효과를 생각하세요."
  },
  {
    id: "r3-mc-013",
    conceptId: "vggnet-5x5-vs-two-3x3-params",
    difficulty: "medium",
    category: "합성곱 신경망 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "동일한 5x5 수용 영역을 확보할 때 5x5 합성곱 계층 1개를 사용하는 방식과 3x3 합성곱 계층 2개를 연속 중첩하는 방식의 파라미터 수 비교로 올바른 것은? (입출력 채널 수 C로 동일)",
    options: [
      "5x5는 25 C^2, 3x3 두 개는 18 C^2로 약 28% 적음",
      "두 방식 모두 25 C^2 의 가중치 파라미터를 가지므로 완벽히 동일함",
      "3x3 2개 중첩 방식이 5x5 방식보다 파라미터 수가 2배 더 많아짐",
      "5x5 1개 방식이 3x3 중첩 방식 대비 연산량과 가중치를 50% 절감함"
    ],
    answer: 0,
    explanation: "5x5 1개는 5*5*C^2 = 25 C^2 이고, 3x3 2개는 (3*3*C^2) + (3*3*C^2) = 18 C^2 이 되어 파라미터가 (25-18)/25 = 28% 감소합니다.",
    hint: "5x5 면적(25)과 3x3 두 번의 면적 합(9+9=18)의 차이를 비교하세요."
  },
  {
    id: "r3-mc-014",
    conceptId: "alexnet-architectural-milestones",
    difficulty: "medium",
    category: "합성곱 신경망 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "AlexNet(2012)이 기존 고전 신경망의 학습 정체를 극복하고 딥러닝 혁신을 이끈 주요 기술적 특징에 대한 설명으로 가장 올바른 것은?",
    options: [
      "시그모이드 활성화 함수만을 단독 사용하여 기울기 폭발을 완전히 차단함",
      "ReLU로 학습을 가속하고 드롭아웃으로 과적합을 줄임",
      "지름길 연결을 최초로 적용하여 100층 이상의 심층망을 학습함",
      "어텐션 메커니즘을 전면 도입하여 합성곱 필터 연산을 완전히 대체함"
    ],
    answer: 1,
    explanation: "AlexNet은 Sigmoid/tanh 대신 ReLU를 도입해 기울기 소실을 극복하고 학습을 대폭 가속했으며, Dropout으로 대형 FC 계층의 과적합을 방지했습니다.",
    hint: "기울기 소실을 극복한 새로운 활성화 함수와 FC 계층의 과적합 방지 기법을 확인하세요."
  },
  {
    id: "r3-mc-015",
    conceptId: "resnet-identity-mapping-guarantee",
    difficulty: "medium",
    category: "합성곱 신경망 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "ResNet 잔차 블록 H(x) = F(x) + x 에서, 추가된 계층이 새로운 유용한 특징을 전혀 학습하지 못할 경우(F(x) = 0) 블록 전체가 수행하는 동작 상태는?",
    options: [
      "출력값이 영 행렬이 되어 모든 특징 정보가 소실됨",
      "기울기가 무한대로 발산하여 학습이 즉시 중단됨",
      "F(x)=0이면 입력이 그대로 전달되는 항등 매핑이 됨",
      "소프트맥스 확률 분포가 균등 분포로 초기화됨"
    ],
    answer: 2,
    explanation: "F(x)=0이 되면 H(x) = 0 + x = x가 되어 입력이 그대로 전달되는 항등 매핑이 되므로, 층이 깊어져도 성능이 얕은 망보다 악화되지 않습니다.",
    hint: "F(x)=0일 때 출력 H(x)와 입력 x의 관계식을 확인해 보세요."
  },
  {
    id: "r3-mc-016",
    conceptId: "vit-inductive-bias-and-pretraining",
    difficulty: "medium",
    category: "합성곱 신경망 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "CNN과 비교했을 때 Vision Transformer가 갖는 구조적 특성 및 대규모 사전학습의 필요성에 대한 설명으로 가장 올바른 것은?",
    options: [
      "ViT는 이미지 패치의 위치 정보를 자동으로 파악하므로 위치 임베딩이 불필요함",
      "ViT는 소규모 데이터셋만으로도 항상 ResNet보다 뛰어난 성능을 보임",
      "ViT는 합성곱 필터를 그대로 사용하여 이미지의 국소 연결성을 완벽히 고정함",
      "CNN보다 귀납적 편향이 적어 대규모 사전학습에서 전역 표현을 잘 학습함"
    ],
    answer: 3,
    explanation: "ViT는 2차원 공간에 대한 고정된 편향이 적어 중소규모 데이터셋에서는 CNN보다 약하지만, 거대 데이터셋 사전학습 시 CNN의 한계를 뛰어넘습니다.",
    hint: "CNN의 국소 필터 고정 구조와 ViT의 자유로운 전역 어텐션 구조 차이를 생각하세요."
  },

  // --- [시각-언어 모델(VLM) 및 멀티모달 정합] (Q17 ~ Q20) ---
  {
    id: "r3-mc-017",
    conceptId: "clip-l2-normalization-cosine-dot",
    difficulty: "medium",
    category: "시각-언어 모델 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "CLIP 모델에서 이미지 인코더와 텍스트 인코더가 출력한 특징 벡터들을 내적하기 직전에 L2 정규화를 수행하는 수학적 이유는?",
    options: [
      "벡터 크기를 1로 맞춰 내적이 코사인 유사도와 같아지게 함",
      "임베딩 벡터의 모든 원소를 0으로 초기화하여 메모리를 절감하기 위해",
      "소프트맥스 활성화 함수의 미분 계산을 생략하기 위해",
      "텍스트 인코더의 차원을 이미지 인코더의 차원으로 2배 확장하기 위해"
    ],
    answer: 0,
    explanation: "두 벡터 u, v를 L2 정규화하여 크기를 1로 만들면 u dot v = cos(theta)가 성립하므로, 빠른 행렬 곱으로 코사인 유사도를 직접 계산할 수 있습니다.",
    hint: "단위 벡터 간의 단순 내적이 어떤 각도 기반 유사도 척도와 같아지는지 생각하세요."
  },
  {
    id: "r3-mc-018",
    conceptId: "siglip-noise-robustness-mechanism",
    difficulty: "medium",
    category: "시각-언어 모델 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "SigLIP이 노이즈가 많은 웹 이미지-텍스트 데이터셋 학습 시 기존 CLIP의 Softmax 대비 강건한 성능을 보이는 원리는?",
    options: [
      "학습 데이터의 모든 이미지를 흑백으로 단순화하기 때문에",
      "시그모이드 포화로 이미 분리된 음성 쌍의 추가 기울기가 작아짐",
      "텍스트 인코더를 완전히 제거하고 레이블 ID만을 사용하므로",
      "배치 크기를 무조건 1개로 고정하여 학습하므로"
    ],
    answer: 1,
    explanation: "Softmax는 모든 음성 샘플을 전역적으로 밀어내려 하지만, SigLIP은 시그모이드의 포화 구간 덕분에 이미 먼 오답 쌍의 과도한 밀어내기 영향을 완화합니다.",
    hint: "오답과의 거리가 충분히 멀어졌을 때 시그모이드 함수 출력이 포화되는 특성을 고려하세요."
  },
  {
    id: "r3-mc-019",
    conceptId: "imagebind-anchor-modality-concept",
    difficulty: "medium",
    category: "시각-언어 모델 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "ImageBind 모델이 6개 모달리티(이미지, 텍스트, 오디오, 깊이, 열화상, IMU)를 하나의 공유 벡터 공간으로 묶을 수 있었던 핵심 학습 전략은?",
    options: [
      "모든 모달리티 쌍(15개 조합)의 1:1 데이터를 전부 수집해 개별 학습함",
      "모든 센서 데이터를 텍스트 문자열로 자동 번역하여 처리함",
      "이미지·비디오를 공통 앵커로 삼아 나머지 모달리티를 정렬함",
      "단일 1차원 합성곱 필터로 모든 모달리티 신호를 합산함"
    ],
    answer: 2,
    explanation: "모든 모달리티와 자연스럽게 결합되는 시각(Image/Video) 데이터를 중심 축으로 삼아 각각 정합함으로써 통합 공간을 구축했습니다.",
    hint: "다양한 센서 신호와 가장 잘 연결될 수 있는 중심 매개체 모달리티를 떠올려 보세요."
  },
  {
    id: "r3-mc-020",
    conceptId: "vlm-projection-layer-purpose",
    difficulty: "medium",
    category: "시각-언어 모델 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "LLaVA와 같은 VLM에서 사전학습된 비전 인코더와 거대 언어 모델 사이에 선형 프로젝션 레이어를 배치하는 목적은?",
    options: [
      "입력 이미지의 화소 해상도를 무조건 2배로 업샘플링하기 위해",
      "언어 모델의 사전학습된 모든 가중치 파라미터를 초기화하기 위해",
      "텍스트 질문을 음성 주파수 신호로 변환하여 전달하기 위해",
      "시각 특징을 언어 모델의 임베딩 차원과 공간에 맞춰 투영함"
    ],
    answer: 3,
    explanation: "비전 인코더의 특징 표현 공간을 LLM이 텍스트 토큰처럼 해석할 수 있는 언어 임베딩 차원으로 선형 변환(투영)해 주는 다리 역할을 합니다.",
    hint: "시각 모델의 출력 규격을 언어 모델의 입력 규격에 맞추어 주는 어댑터 역할을 생각하세요."
  },

  // --- [VLM 변종 및 비전 파운데이션 모델] (Q21 ~ Q24) ---
  {
    id: "r3-mc-021",
    conceptId: "qwen2-vl-mrope-3d-coordinates",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "Qwen2-VL이 텍스트뿐만 아니라 2D 이미지 공간 및 3D 비디오 시간 정보를 통합 인코딩하기 위해 M-ROPE에서 사용하는 3가지 위치 좌표 축은?",
    options: [
      "시간, 높이, 너비",
      "밝기, 채도, 명도",
      "스트라이드, 패딩, 커널",
      "쿼리, 키, 값"
    ],
    answer: 0,
    explanation: "M-ROPE는 동영상의 시간 축(T)과 이미지의 높이(H), 너비(W) 공간 축 3가지를 튜플로 구성하여 멀티모달 위치를 회전 인코딩합니다.",
    hint: "비디오의 시간적 순서와 이미지의 2차원 가로세로 공간 축의 조합입니다."
  },
  {
    id: "r3-mc-022",
    conceptId: "som-visual-grounding-principle",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "VLM의 시각적 위치 파악 및 UI 조작 에이전트에 Set-of-Mark  프롬프팅을 적용했을 때의 효과로 가장 올바른 것은?",
    options: [
      "화면의 해상도를 32x32로 축소하여 연산량을 0으로 만듦",
      "UI 요소에 번호를 표시해 모델이 대상을 명확히 지목하도록 함",
      "모든 마우스 클릭 이벤트를 키보드 단축키로 강제 치환함",
      "화면 내 모든 아이콘과 텍스트를 삭제하여 노이즈를 제거함"
    ],
    answer: 1,
    explanation: "SoM은 객체마다 번호 태그를 씌워 VLM이 모호한 좌표 대신 명확한 번호 기호를 참조하도록 하여 위치 인식 및 조작 정확도를 높입니다.",
    hint: "객체에 번호 마크를 붙여 VLM이 번호로 직관적인 참조를 하게 돕는 원리입니다."
  },
  {
    id: "r3-mc-023",
    conceptId: "depth-anything-data-strategy",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "Depth Anything v2가 깊이 맵 예측 성능을 높이기 위해 활용한 데이터 학습 전략으로 가장 올바른 것은?",
    options: [
      "소수의 라벨 데이터만 사용하고 라벨이 없는 이미지는 모두 학습에서 제외함",
      "오디오와 텍스트 데이터만을 사용해 이미지 없이 깊이를 예측하도록 학습함",
      "150만 개 라벨 데이터와 6200만 개 비라벨 데이터를 함께 활용함",
      "사용자가 모든 이미지 픽셀의 실제 깊이 값을 직접 입력해야만 학습이 가능함"
    ],
    answer: 2,
    explanation: "강의자료에서는 Depth Anything v2가 약 150만 개 규모의 데이터로 학습되고, 추가로 약 6200만 개의 라벨되지 않은 데이터를 활용하여 성능을 극대화한다고 설명합니다.",
    hint: "라벨된 데이터보다 훨씬 큰 규모의 비라벨 데이터를 함께 활용한다는 점이 핵심입니다."
  },
  {
    id: "r3-mc-024",
    conceptId: "sapiens-human-centric-four-tasks",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "메타의 Sapiens 모델이 사람 이미지에 대해 전문적으로 수행하는 4대 비전 태스크의 구성으로 올바른 것은?",
    options: [
      "객체 탐지, 광학 흐름, 이미지 분류, 시맨틱 세그멘테이션",
      "인스턴스 세그멘테이션, 3D 바운딩 박스 추정, 이미지 초해상화, 특징점 매칭",
      "파놉틱 세그멘테이션, 엣지 경계선 검출, 비디오 모션 트래킹, 파노라마 스티칭",
      "2D 포즈, 신체 분할, 깊이, 표면 법선 추정"
    ],
    answer: 3,
    explanation: "Sapiens는 약 3000만 장의 인체 데이터로 사전학습되어 사람 중심의 포즈, 파츠 분할, 3D 깊이, 표면 법선 벡터 추정 4대 태스크를 지원합니다.",
    hint: "인체의 관절 자세, 신체 부위별 분할, 입체 깊이 및 표면 기울기 추정의 4가지 작업입니다."
  },

  // =========================================================================
  // [PART 2: 단답형 4문항] (수치/개념 복합 요구)
  // =========================================================================
  {
    id: "r3-sa-025",
    conceptId: "residual-and-r2-terms-sa",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "short-answer",
    prompt: "선형 회귀에서 실제 관측값과 모델 예측값의 차이를 뜻하는 통계 용어와, 전체 변동량 중 회귀 모델이 설명하는 비율을 나타내는 결정계수의 수식 기호를 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["잔차, R^2", "잔차, R2", "Residual, R^2", "residual, r^2", "잔차, R-squared"],
    explanation: "실제값과 예측값의 차이는 잔차(Residual)이며, 설명력 지표는 결정계수 R^2 입니다.",
    hint: "오차를 뜻하는 한글 통계 용어(잔차)와 결정계수 기호(R^2)를 적으세요."
  },
  {
    id: "r3-sa-026",
    conceptId: "ppl-and-cot-terms-sa",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "short-answer",
    prompt: "언어 모델이 다음 단어를 예측할 때 느끼는 불확실성을 나타내는 평가 지표 약자와, 복잡한 추론을 위해 생각 단계를 순차적으로 유도하는 프롬프팅 기법 약자를 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["PPL, CoT", "ppl, cot", "PPL, COT", "Perplexity, CoT"],
    explanation: "언어 모델 혼잡도 지표는 PPL(Perplexity)이며, 생각의 사슬 프롬프팅은 CoT(Chain-of-Thought)입니다.",
    hint: "Perplexity의 3글자 약자와 Chain-of-Thought의 3글자 약자를 적으세요."
  },
  {
    id: "r3-sa-027",
    conceptId: "receptive-field-and-projection-sa",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "short-answer",
    prompt: "3x3 합성곱 필터 2개를 연속 중첩했을 때 확보되는 유효 수용 영역 크기(가로x세로)와, ResNet에서 채널 차원이 맞지 않을 때 지름길 통로에 적용하는 합성곱 커널 크기를 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["5x5, 1x1", "5x5, 1x1 Conv", "5x5, 1X1", "5 x 5, 1 x 1"],
    explanation: "3x3 2개 중첩 시 수용 영역은 5x5이며, ResNet 차원 맞춤용 지름길 합성곱은 1x1 커널을 사용합니다.",
    hint: "두 번 중첩된 수용 영역 크기(5x5)와 점 단위 합성곱 크기(1x1)를 적으세요."
  },
  {
    id: "r3-sa-028",
    conceptId: "clip-and-grounding-dino-sa",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "short-answer",
    prompt: "대규모 이미지-텍스트 쌍을 대조 학습하여 제로샷 분류를 대중화한 OpenAI 모델 약자와, 자연어 지시문으로 임의 객체의 바운딩 박스를 찾아내는 오픈 보캡 탐지기 명칭을 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["CLIP, Grounding DINO", "clip, grounding dino", "CLIP, GroundingDINO", "CLIP, 그라운딩 디노"],
    explanation: "대조 학습 기반 비전-언어 모델은 CLIP이며, 오픈 보캡 탐지 모델은 Grounding DINO입니다.",
    hint: "CLIP 약자와 오픈 보캡 탐지 모델 Grounding DINO 명칭을 쓰세요."
  },

  // =========================================================================
  // [PART 3: 서술형 2문항]
  // =========================================================================
  {
    id: "r3-es-029",
    conceptId: "few-shot-cot-and-ppl-essay",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "essay",
    prompt: "Few-shot 프롬프팅과 Chain-of-Thought(CoT) 프롬프팅의 개념 및 차이점을 서술하고, 언어 모델의 생성 평가 지표인 Perplexity(PPL)가 낮을수록 좋은 이유를 서술하시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["Few-shot", "CoT", "예시", "추론 단계", "PPL", "불확실성"],
    modelAnswer: "1) Few-shot 프롬프팅은 모델 가중치 변경 없이 프롬프트 내에 몇 개의 입력-출력 예시를 제공하여 작업 형태를 유도하는 기법이며, CoT 프롬프팅은 단순 입출력 예시를 넘어 중간 생각 단계(추론 과정)를 명시적으로 작성하게 하여 복합 추론 성능을 끌어올리는 기법이다. 2) Perplexity(PPL)는 모델이 다음 단어를 예측할 때 느끼는 혼잡도(불확실성)를 분기 계수 형태로 수치화한 것이므로, PPL이 낮을수록 모델이 다음 단어 후보군을 헷갈리지 않고 정확하고 확신 있게 예측함을 의미한다.",
    rubricKeywords: [
      "Few-shot(입력-출력 예시 제공을 통한 맥락 학습)",
      "CoT(단계별 추론 과정을 포함하여 복합 문제 해결)",
      "PPL의 정의(혼잡도/분기 계수) 및 낮을수록 높은 예측 확신도"
    ],
    minLength: 20,
    explanation: "Few-shot의 단순 입출력 예시 제공과 CoT의 단계별 추론 과정 유도의 차이 및 PPL의 불확실성 척도 의미를 서술합니다.",
    hint: "Few-shot과 CoT의 예시 구성 방식 차이와 PPL이 낮을 때 모델의 예측 능력 의미를 작성하세요."
  },
  {
    id: "r3-es-030",
    conceptId: "clip-zero-shot-mechanism-essay",
    difficulty: "medium",
    category: "시각-언어 모델 및 파운데이션 응용",
    questionType: "essay",
    prompt: "CLIP 모델의 제로샷(Zero-shot) 이미지 분류가 별도의 추가 학습 없이 새로운 카테고리를 분류할 수 있는 원리를 설명하고, 'A photo of a {label}.'과 같은 자연어 프롬프트 템플릿이 제로샷 분류 과정에서 어떤 역할을 하는지 서술하시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["자연어 텍스트", "공통 임베딩 공간", "코사인 유사도", "프롬프트 템플릿", "텍스트 임베딩"],
    modelAnswer: "1) CLIP은 비전 인코더와 텍스트 인코더를 이용해 이미지와 텍스트를 같은 임베딩 공간에 표현한다. 제로샷 분류에서는 분류하려는 후보 클래스들을 자연어 텍스트로 만들고 각각 텍스트 인코더로 임베딩한 뒤, 입력 이미지 임베딩과 각 후보 텍스트 임베딩의 유사도를 비교하여 가장 높은 점수의 카테고리를 선택한다. 2) 'A photo of a {label}.'과 같은 프롬프트 템플릿은 단순한 클래스 이름을 자연어 문장 형태의 텍스트 입력으로 구성하여 텍스트 인코더가 후보 카테고리 표현을 만들 수 있게 하고, 그 임베딩을 이미지 임베딩과 직접 비교할 수 있도록 한다.",
    rubricKeywords: [
      "이미지와 텍스트를 공통 임베딩 공간에 표현",
      "후보 클래스 텍스트 임베딩과 이미지 임베딩의 유사도 비교",
      "프롬프트 템플릿을 이용해 클래스 이름을 자연어 텍스트 입력으로 구성"
    ],
    minLength: 20,
    explanation: "CLIP 제로샷 분류는 후보 카테고리를 자연어 텍스트로 만들고 이미지 임베딩과 텍스트 임베딩의 유사도를 비교해 가장 높은 카테고리를 선택하는 방식입니다. 프롬프트 템플릿은 클래스 이름을 텍스트 인코더에 넣을 자연어 문장 형태로 구성하는 역할을 합니다.",
    hint: "후보 클래스들을 텍스트로 바꾸고 이미지 벡터와 비교하는 과정에서 프롬프트 문장이 어떤 입력을 만들어 주는지 설명하세요."
  }

];

export const ALL_QUESTIONS = SSAFY_AI_MOCK_EXAM_ROUND_3;
