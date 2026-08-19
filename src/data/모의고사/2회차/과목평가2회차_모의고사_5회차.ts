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

export const SSAFY_AI_MOCK_EXAM_ROUND_5: StudyQuestion[] = [
  // =========================================================================
  // [PART 1: 객관식 24문항] (정답 0, 1, 2, 3번 각 6개씩 25% 완벽 균등 분산)
  // =========================================================================

  // --- [머신러닝 기초 및 회귀 분석] (Q1 ~ Q4) ---
  {
    id: "r5-mc-001",
    conceptId: "classification-category-probability-output",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "분류(Classification) 문제와 분류 함수의 목표에 대한 설명으로 가장 올바른 것은?",
    options: [
      "입력 특징 벡터 X가 주어졌을 때 정해진 범주 중 하나를 예측하며, 경우에 따라 각 범주에 속할 확률 P(Y=k|X)를 추정하는 것이 유용함",
      "분류는 종속변수가 반드시 연속형 실수인 경우에만 사용할 수 있음",
      "분류 함수는 입력 데이터의 평균과 분산만 계산하며 범주 예측은 수행하지 않음",
      "분류 문제에서는 정답 범주가 존재하면 확률값을 절대 사용할 수 없음"
    ],
    answer: 0,
    explanation: "분류는 입력 X를 정해진 범주 중 하나로 예측하는 문제이며, 단순한 범주 출력뿐 아니라 각 범주에 속할 확률 P(Y=k|X)를 추정하는 방식도 매우 유용합니다.",
    hint: "분류는 연속값 예측이 아니라 범주 예측이며, 범주별 확률을 함께 추정할 수도 있습니다."
  },
  {
    id: "r5-mc-002",
    conceptId: "linear-regression-limit-for-classification",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "0(비응급)과 1(응급)을 예측하는 이진 분류 문제에 일반 선형회귀를 그대로 사용하는 것이 부적절한 주된 이유와 로지스틱 회귀의 해결 방법으로 가장 올바른 것은?",
    options: [
      "선형회귀는 입력 변수를 하나만 사용할 수 있으므로 분류에 사용할 수 없음",
      "선형회귀 출력은 0보다 작거나 1보다 큰 값도 낼 수 있어 확률로 해석하기 어렵고, 로지스틱 회귀는 Sigmoid를 사용해 출력을 0~1 범위의 확률로 제한함",
      "선형회귀는 반드시 음수 가중치만 학습하므로 분류 경계를 만들 수 없음",
      "로지스틱 회귀는 선형식을 제거하고 모든 입력을 원-핫 벡터로 바꾸기 때문에 분류가 가능함"
    ],
    answer: 1,
    explanation: "선형함수의 출력은 실수 전체 범위를 가질 수 있어 이진 분류 확률로 직접 쓰기 어렵습니다. 로지스틱 회귀는 선형식의 결과를 Sigmoid 함수에 통과시켜 0과 1 사이의 확률값으로 변환합니다.",
    hint: "확률은 0~1 범위여야 한다는 점과 Sigmoid 함수의 출력 범위를 떠올려 보세요."
  },
  {
    id: "r5-mc-003",
    conceptId: "odds-logit-logistic-relation",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "로지스틱 회귀에서 성공 확률을 p라고 할 때 Odds와 Logit의 관계에 대한 설명으로 가장 올바른 것은?",
    options: [
      "Odds는 p 자체이고 Logit은 1-p를 의미함",
      "Odds는 p(1-p)이고 Logit은 sqrt(p)를 의미함",
      "Odds는 p/(1-p)이며, Logit은 log(p/(1-p))로 정의되고 로지스틱 회귀에서는 이 Logit이 입력의 선형식으로 표현됨",
      "Odds와 Logit은 모두 항상 0~1 범위의 값만 가짐"
    ],
    answer: 2,
    explanation: "Odds는 성공확률을 실패확률로 나눈 p/(1-p)이며, Logit은 Odds에 로그를 취한 log(p/(1-p))입니다. 로지스틱 회귀에서는 Logit이 beta_0 + beta_1 x와 같은 선형식으로 표현됩니다.",
    hint: "성공확률/실패확률이 Odds이고, 여기에 로그를 취하면 Logit입니다."
  },
  {
    id: "r5-mc-004",
    conceptId: "logistic-regression-mle-objective",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "로지스틱 회귀에서 모수 beta를 추정할 때 사용하는 최대우도추정(Maximum Likelihood Estimation, MLE)의 핵심 아이디어로 가장 올바른 것은?",
    options: [
      "모든 회귀계수를 0으로 만들어 가장 단순한 모델을 선택함",
      "실제값과 예측값의 거리만을 이용해 RSS를 최소화하는 것만 사용함",
      "입력 데이터의 개수가 가장 적어지는 beta를 선택함",
      "현재 확률 모델이 관측된 정답 데이터를 만들어낼 우도(Likelihood)가 최대가 되도록 beta를 선택하며, 계산 편의를 위해 Log-Likelihood를 최대화할 수 있음"
    ],
    answer: 3,
    explanation: "로지스틱 회귀는 확률 모델이므로 관측된 데이터가 나타날 가능성인 우도(Likelihood)를 가장 크게 만드는 모수를 찾습니다. 곱 형태의 우도는 로그를 취해 합 형태의 Log-Likelihood로 바꾸어 최대화할 수 있습니다.",
    hint: "확률 모델이 실제 관측 데이터를 얼마나 잘 설명하는지를 가장 크게 만드는 모수를 찾는 방법입니다."
  },
  {
    id: "r5-mc-005",
    conceptId: "word2vec-objective-comparison",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "Word2Vec의 두 학습 방식인 CBOW와 Skip-Gram의 입출력 관계에 대한 설명으로 가장 올바른 것은?",
    options: [
      "CBOW는 주변 문맥 단어들을 입력받아 중심 단어를 예측하고, Skip-Gram은 중심 단어 하나를 입력받아 주변 문맥 단어들을 예측함",
      "CBOW는 중심 단어를 입력받아 다음 문장 전체를 생성하고, Skip-Gram은 단어의 형태소 품사를 분류함",
      "CBOW는 오직 1개의 단어만 입력받을 수 있으며, Skip-Gram은 전체 어휘 사전을 동시에 입력받음",
      "두 방식 모두 문장의 단어 순서를 완벽히 보존하는 인과적 마스크 어텐션 계층을 기반으로 동작함"
    ],
    answer: 0,
    explanation: "CBOW는 주변에 위치한 단어들을 모아 가운데 중심 단어를 맞히는 구조이며, Skip-Gram은 중심 단어로부터 주변에 나타날 단어들을 예측하는 구조입니다.",
    hint: "주변 문맥으로 중심을 맞추는지, 중심으로 주변 문맥을 맞추는지의 차이를 확인하세요."
  },
  {
    id: "r5-mc-006",
    conceptId: "rnn-hidden-state-update-formula",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "단순 RNN 셀에서 현재 시점의 입력 x_t와 이전 시점의 은닉 상태 h_(t-1)로부터 현재 은닉 상태 h_t를 계산하는 표준 갱신 수식으로 올바른 것은?",
    options: [
      "h_t = softmax(W_xh * x_t + b)",
      "h_t = tanh(W_hh * h_(t-1) + W_xh * x_t + b_h)",
      "h_t = sigmoid(W_hh * h_(t-1)) * tanh(x_t)",
      "h_t = h_(t-1) + W_xh * x_t"
    ],
    answer: 1,
    explanation: "단순 RNN은 이전 은닉 상태와 현재 입력을 각각 선형 가중치와 곱해 더한 후, -1에서 1 사이로 압축하는 비선형 활성화 함수인 tanh를 적용합니다.",
    hint: "이전 은닉 상태 변환과 현재 입력 변환을 합산한 뒤 적용하는 대표적인 활성화 함수(tanh)를 포함한 식입니다."
  },
  {
    id: "r5-mc-007",
    conceptId: "multihead-attention-dimension-split",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "전체 모델 차원 d_model = 512 이고 헤드 수 h = 8 일 때, Multi-Head Attention에서 각 개별 헤드가 연산하는 쿼리 및 키의 차원 d_k와 최종 출력 병합 방식으로 올바른 것은?",
    options: [
      "각 헤드의 차원 d_k = 512 이며, 모든 헤드의 출력을 평균 냄",
      "각 헤드의 차원 d_k = 4096 이며, 모든 헤드의 출력을 행렬 곱함",
      "각 헤드의 차원 d_k = 64 (512 / 8) 이며, 8개 헤드의 어텐션 결과를 Concat(이어붙이기)한 후 선형 변환함",
      "각 헤드의 차원 d_k = 8 이며, 가장 점수가 높은 1개 헤드만 선택함"
    ],
    answer: 2,
    explanation: "d_k = d_model / h = 512 / 8 = 64 차원으로 나누어 병렬 어텐션을 수행한 뒤, 8개 출력을 이어붙여(Concat) 원래 차원(512)으로 투영합니다.",
    hint: "전체 차원을 헤드 수로 나눈 개별 차원 크기와 여러 헤드를 하나로 모으는 결합 연산을 생각하세요."
  },
  {
    id: "r5-mc-008",
    conceptId: "attention-dot-product-scaling-variance",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "Scaled Dot-Product Attention에서 Q와 K의 점곱 스코어를 sqrt(d_k)로 나누어 스케일링하는 주된 수학적 이유는?",
    options: [
      "출력 행렬의 차원을 절반으로 다운샘플링하기 위해",
      "단어 간의 상대적 거리를 계산하여 위치 정보를 주입하기 위해",
      "어텐션 가중치 행렬의 모든 원소 합을 0으로 맞추기 위해",
      "d_k 차원이 커짐에 따라 내적값의 분산이 커져 Softmax 출력이 지나치게 뾰족해지고 기울기가 작아지는 현상을 완화하기 위해"
    ],
    answer: 3,
    explanation: "벡터 차원이 클수록 내적 결과의 분산이 비례하여 증가하므로, Softmax의 포화로 인한 기울기 감소를 막기 위해 sqrt(d_k)로 나누어 분산을 일정하게 유지합니다.",
    hint: "차원이 커질 때 내적 분산이 커져 Softmax 단계에서 발생하는 기울기 소실 예방 목적입니다."
  },
  {
    id: "r5-mc-009",
    conceptId: "llm-alignment-dpo-vs-rlhf",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "거대 언어 모델의 인간 선호도 정렬(Alignment) 기법인 DPO(Direct Preference Optimization)에 대한 설명으로 가장 올바른 것은?",
    options: [
      "별도의 보상 모델(Reward Model) 학습이나 복잡한 강화학습(PPO) 루프 없이, 선호-비선호 데이터셋으로 언어 모델을 직접 분류 손실로 최적화함",
      "모델 파라미터를 갱신하지 않고 프롬프트 예시만을 변경하여 정렬을 수행함",
      "오직 텍스트 요약 태스크에만 적용 가능한 특수 목적 손실 함수임",
      "사전학습된 비전 인코더의 가중치를 텍스트 토큰에 맞추어 역전파함"
    ],
    answer: 0,
    explanation: "DPO는 최적 보상 함수와 정책의 수학적 관계를 이용해, 별도의 보상 모델 훈련과 PPO 강화학습 없이 선호 데이터셋으로 직접 교차 엔트로피 형태의 손실을 최적화합니다.",
    hint: "별도 보상 모델과 복잡한 강화학습 단계를 생략하고 직접 선호도를 학습하는 방식입니다."
  },
  {
    id: "r5-mc-010",
    conceptId: "decoding-top-k-and-top-p-difference",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "LLM 텍스트 생성 시 Top-k 샘플링과 Top-p (Nucleus) 샘플링의 후보 토큰군 선정 방식의 차이로 가장 올바른 것은?",
    options: [
      "Top-k는 단어의 글자 수가 k개 이하인 단어만 고르고, Top-p는 p번째 문장만 선택함",
      "Top-k는 확률 순위 상위 k개의 고정된 개수를 후보로 삼고, Top-p는 누적 확률이 p에 도달할 때까지의 가변적인 토큰 집합을 후보로 삼음",
      "Top-k는 언제나 결정론적 단일 토큰만 출력하고, Top-p는 전체 어휘 사전을 균등 확률로 추출함",
      "두 방식 모두 확률값과 무관하게 사전 순서대로 앞선 토큰들을 선택함"
    ],
    answer: 1,
    explanation: "Top-k는 확률이 높은 상위 k개의 고정 개수 토큰을 남기는 반면, Top-p는 확률 분포의 모양에 따라 누적 확률이 p가 될 때까지 유동적인 개수의 상위 토큰군을 선택합니다.",
    hint: "후보 단어의 개수를 고정하는 방식과 누적 확률 합을 기준으로 유동적으로 정하는 방식의 차이입니다."
  },

  // --- [CNN 및 대표 비전 아키텍처] (Q11 ~ Q16) ---
  {
    id: "r5-mc-011",
    conceptId: "conv-receptive-field-stacking-3x3",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "스트라이드가 1이고 패딩이 0인 3x3 합성곱 계층을 3개 연속으로 중첩하여 쌓았을 때, 마지막 계층의 특징 맵의 한 점이 참조하는 원본 입력의 유효 수용 영역(Receptive Field) 크기는?",
    options: [
      "3x3",
      "5x5",
      "7x7",
      "9x9"
    ],
    answer: 2,
    explanation: "1개 계층을 거치면 3x3, 2개 계층은 5x5, 3개 계층을 중첩하면 7x7 크기의 원본 입력 영역을 참조하게 됩니다. (RF = 1 + 3 * (3 - 1) = 7)",
    hint: "3x3 필터를 거칠 때마다 수용 영역의 가로세로 크기가 2씩 증가하는 규칙을 적용해 보세요."
  },
  {
    id: "r5-mc-012",
    conceptId: "vggnet-homogeneous-3x3-design",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "VGGNet이 AlexNet과 차별화하여 신경망의 모든 합성곱 계층 필터 크기를 3x3으로 단일화하고 깊게 쌓음으로써 얻은 핵심 이점은?",
    options: [
      "합성곱 계층의 연산량을 0으로 만들어 GPU 없이 학습 가능하게 함",
      "완전 연결 계층(FC Layer)의 파라미터 수를 100개 미만으로 축소함",
      "이미지의 색상 채널을 자동으로 1채널로 변환하여 메모리를 절감함",
      "동일한 수용 영역 대비 가중치 파라미터 수를 줄이고, 층마다 활성화 함수(ReLU)를 더 많이 배치하여 비선형 판별 표현력을 극대화함"
    ],
    answer: 3,
    explanation: "소형 3x3 필터를 여러 층 쌓으면 큰 필터 1개와 같은 시야를 가지면서도 파라미터가 절감되고 비선형 활성화 함수가 늘어나 표현력이 대폭 향상됩니다.",
    hint: "파라미터 수 감소 효과와 계층 사이의 비선형 활성화 함수 증가 효과를 떠올려 보세요."
  },
  {
    id: "r5-mc-013",
    conceptId: "resnet-skip-connection-gradient-flow",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "ResNet 잔차 블록 H(x) = F(x) + x 에서 지름길 연결(Skip Connection)이 신경망의 층이 매우 깊어져도 학습을 가능하게 만드는 핵심 원리는?",
    options: [
      "역전파 시 기울기 계산에서 dH/dx = dF/dx + 1 이 성립하여, 가중치 계수를 거치지 않고 오차 기울기가 이전 계층으로 직접 전달되는 덧셈 경로를 제공하므로",
      "신경망의 모든 층의 가중치 값을 항상 1.0으로 고정하기 때문에",
      "입력 이미지의 해상도를 매 블록마다 절반으로 강제 축소하기 때문에",
      "소프트맥스 교차 엔트로피 손실 함수를 계산하지 않아도 되기 때문에"
    ],
    answer: 0,
    explanation: "지름길 연결의 덧셈 구조 덕분에 역전파 미분 시 '+ 1' 형태의 기울기 직통 경로가 생겨 가중치 곱에 의한 기울기 소실을 효과적으로 방지합니다.",
    hint: "F(x) + x 수식을 x에 대해 미분했을 때 나타나는 '+ 1' 항의 역할을 생각해 보세요."
  },
  {
    id: "r5-mc-014",
    conceptId: "mobilenet-depthwise-vs-pointwise-roles",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "MobileNet의 Depthwise Separable Convolution을 이루는 Depthwise Conv와 Pointwise Conv의 역할 분담으로 올바른 것은?",
    options: [
      "Depthwise Conv는 채널을 1개로 합치고, Pointwise Conv는 공간 해상도를 2배로 늘림",
      "Depthwise Conv는 각 채널별 공간(Spatial) 특징을 독립 추출하고, Pointwise Conv(1x1)는 채널 간(Channel) 정보를 선형 결합함",
      "Depthwise Conv는 1차원 평탄화를 수행하고, Pointwise Conv는 맥스 풀링을 수행함",
      "두 연산 모두 공간 특징과 채널 특징을 동시에 3차원 필터로 한 번에 연산함"
    ],
    answer: 1,
    explanation: "Depthwise Conv는 채널을 섞지 않고 공간 연산만 독립적으로 수행하며, 뒤따르는 Pointwise Conv(1x1)가 채널 간 정보 결합과 차원 조절을 전담합니다.",
    hint: "공간적 특징을 뽑는 연산과 채널 간 정보를 섞어주는 연산이 분리되어 있습니다."
  },
  {
    id: "r5-mc-015",
    conceptId: "vit-linear-projection-and-cls-token",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "Vision Transformer(ViT)의 입력 데이터 전처리 및 토큰 구성 과정에 대한 설명으로 가장 올바른 것은?",
    options: [
      "이미지 전체를 단 1개의 픽셀로 압축하여 트랜스포머 인코더에 입력함",
      "합성곱 필터만을 100층 이상 중첩하여 채널 차원을 1차원으로 만듦",
      "이미지를 작은 패치(예: 16x16)로 분할하여 1차원 벡터로 펼친 후 선형 투영(Linear Projection)하며, 맨 앞에 [CLS] 토큰을 붙이고 위치 임베딩을 더함",
      "입력 이미지의 RGB 색상 채널을 모두 삭제하고 흑백 바이너리 코드로 변환함"
    ],
    answer: 2,
    explanation: "ViT는 2D 이미지를 16x16 등의 패치로 쪼개어 선형 임베딩한 뒤, 시퀀스 맨 앞에 분류용 [CLS] 토큰을 추가하고 순서 정보를 위한 위치 임베딩을 더해 입력합니다.",
    hint: "이미지를 패치로 분할하여 1차원 토큰 시퀀스로 만든 후 위치 정보를 결합하는 흐름입니다."
  },
  {
    id: "r5-mc-016",
    conceptId: "fcn-vs-cnn-parameter-efficiency",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "이미지 데이터 처리 시 완전 연결 계층(FCN) 대비 합성곱 계층(CNN)이 파라미터 수를 획기적으로 줄일 수 있는 구조적 이유는?",
    options: [
      "합성곱 계층은 비선형 활성화 함수를 전혀 사용하지 않기 때문에",
      "합성곱 계층은 이미지를 처리할 때 GPU 메모리를 전혀 사용하지 않기 때문에",
      "합성곱 계층은 이미지의 모든 픽셀을 0으로 초기화하기 때문에",
      "이미지 전체 영역에 동일한 필터 가중치를 공유(Weight Sharing)하고, 국소 영역의 화소들만 연결(Local Connectivity)하기 때문에"
    ],
    answer: 3,
    explanation: "CNN은 국소적인 영역만을 연결하는 지역 연결성과 동일한 필터를 이미지 전역에 이동시키며 재사용하는 가중치 공유 덕분에 파라미터 수가 크게 절감됩니다.",
    hint: "국소 영역 필터링과 전체 영역에 걸친 동일 필터 재사용 특성을 떠올려 보세요."
  },

  // --- [시각-언어 모델(VLM) 및 멀티모달 정합] (Q17 ~ Q20) ---
  {
    id: "r5-mc-017",
    conceptId: "clip-contrastive-symmetric-loss-math",
    difficulty: "medium",
    category: "시각-언어 모델(VLM) 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "N개의 이미지와 N개의 텍스트로 구성된 배치에서 CLIP의 대조학습 손실함수 계산 방식으로 가장 올바른 것은?",
    options: [
      "N x N 코사인 유사도 행렬에서 대각선(양성) 유사도는 높이고 비대각선(음성) 유사도는 낮추도록 Image-to-Text와 Text-to-Image 방향의 교차 엔트로피 손실을 평균 냄",
      "이미지 인코더의 출력 벡터만을 단독으로 사용하여 MSE 손실을 계산함",
      "대각선에 위치한 양성 페어의 유사도만을 더하고 음성 페어는 손실 계산에서 배제함",
      "모든 이미지와 텍스트를 하나의 문자열 파일로 합쳐 언어 모델링 손실만 계산함"
    ],
    answer: 0,
    explanation: "CLIP은 N x N 유사도 행렬의 대각선 원소(정답 쌍) 확률을 최대화하도록 이미지 기준 및 텍스트 기준의 대칭적 크로스엔트로피 손실을 평균하여 학습합니다.",
    hint: "행(이미지 기준)과 열(텍스트 기준) 양방향으로 대칭적인 소프트맥스 손실을 취하는 방식을 확인하세요."
  },
  {
    id: "r5-mc-018",
    conceptId: "clip-zero-shot-classification-flow",
    difficulty: "medium",
    category: "시각-언어 모델(VLM) 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "CLIP을 이용하여 추가 학습 없이 새로운 이미지를 제로샷(Zero-shot) 분류하는 과정으로 가장 올바른 것은?",
    options: [
      "새 데이터셋으로 이미지 인코더 전체를 다시 학습한 뒤 새로운 FC 분류기를 붙임",
      "후보 카테고리를 'A photo of a {object}.'와 같은 텍스트로 만들고 텍스트 임베딩을 준비한 뒤, 입력 이미지 임베딩과의 유사도를 비교하여 가장 높은 카테고리를 선택함",
      "텍스트 인코더를 제거하고 이미지 픽셀 평균값만으로 카테고리를 선택함",
      "후보 클래스 이름의 글자 수와 이미지 해상도를 비교해 가장 가까운 값을 선택함"
    ],
    answer: 1,
    explanation: "CLIP 제로샷 분류는 후보 클래스들을 자연어 텍스트로 표현해 텍스트 임베딩을 만든 뒤, 입력 이미지 임베딩과 각 후보 텍스트 임베딩의 유사도를 비교하여 가장 높은 점수의 클래스를 선택합니다.",
    hint: "후보 클래스도 텍스트 인코더를 통해 벡터로 만들고 이미지 벡터와 같은 공간에서 비교합니다."
  },
  {
    id: "r5-mc-019",
    conceptId: "siglip-sigmoid-saturation-noisy-negative",
    difficulty: "medium",
    category: "시각-언어 모델(VLM) 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "SigLIP이 Softmax 대신 Sigmoid 기반 손실을 사용할 때, 이미 충분히 유사도가 낮아진 음성 이미지-텍스트 쌍에 대한 학습 영향이 제한될 수 있는 이유는?",
    options: [
      "음성 페어는 손실 계산에서 처음부터 완전히 제외되기 때문에",
      "음성 페어의 라벨을 양성(+1)으로 자동 변경하기 때문에",
      "Sigmoid 함수가 충분히 작은 로짓 구간에서 포화되어 이미 잘 분리된 음성 페어를 계속 더 멀리 밀어내는 영향이 작아질 수 있기 때문에",
      "이미지와 텍스트 임베딩의 차원을 항상 1차원으로 줄이기 때문에"
    ],
    answer: 2,
    explanation: "SigLIP은 양성 페어에는 +1, 음성 페어에는 -1 라벨을 주어 각 쌍에 Sigmoid 손실을 적용합니다. 충분히 멀어진 음성 쌍은 Sigmoid의 포화 영역에 들어가 추가 영향이 작아질 수 있어 노이즈가 있는 음성 데이터의 영향을 제한할 수 있습니다.",
    hint: "Sigmoid 출력이 0 또는 1에 가까워질수록 변화가 작아지는 포화 특성을 떠올려 보세요."
  },
  {
    id: "r5-mc-020",
    conceptId: "imagebind-six-modalities-anchor",
    difficulty: "medium",
    category: "시각-언어 모델(VLM) 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "메타의 ImageBind가 이미지, 텍스트, 오디오, 깊이, 열화상, IMU 6개 모달리티를 단일 벡터 공간으로 결합할 때 중심 매개체로 활용한 모달리티는?",
    options: [
      "오디오 소리 데이터",
      "IMU 모션 센서 데이터",
      "텍스트 단어 임베딩",
      "이미지 및 비디오 (시각 데이터)"
    ],
    answer: 3,
    explanation: "ImageBind는 모든 센서 데이터와 자연스러운 짝을 맺을 수 있는 이미지/비디오를 공통 앵커(Anchor)로 삼아 6개 모달리티를 단일 공간에 정합했습니다.",
    hint: "다양한 센서 데이터와 가장 자연스럽게 결합될 수 있는 중심 시각 모달리티입니다."
  },

  // --- [VLM 변종 및 비전 파운데이션 모델] (Q21 ~ Q24) ---
  {
    id: "r5-mc-021",
    conceptId: "llava-step1-vs-step2-training-scheme",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "LLaVA의 2단계 학습 전략에서 Step 1(사전학습)과 Step 2(시각 지시 파인튜닝)의 모듈 학습/동결(Freeze) 상태 구분으로 올바른 것은?",
    options: [
      "Step 1: 선형 프로젝션 레이어만 학습(비전 인코더/LLM 동결) / Step 2: 프로젝션 레이어와 LLM을 함께 미세조정(비전 인코더 동결)",
      "Step 1: 전체 모듈 학습 / Step 2: 전체 모듈 동결",
      "Step 1: 비전 인코더만 학습 / Step 2: 언어 모델만 학습",
      "Step 1: LLM만 학습 / Step 2: 프로젝션 레이어만 학습"
    ],
    answer: 0,
    explanation: "Step 1에서는 시각-언어 개념 정렬을 위해 연결 어댑터(프로젝션)만 학습하고, Step 2에서는 대화 능력을 위해 프로젝션과 LLM을 함께 미세조정합니다.",
    hint: "1단계는 연결 레이어만 학습시키고, 2단계는 연결 레이어와 거대 언어 모델 본체를 함께 학습시킵니다."
  },
  {
    id: "r5-mc-022",
    conceptId: "qwen2-vl-mrope-three-axes-representation",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "Qwen2-VL이 텍스트, 2D 이미지, 3D 비디오 위치 정보를 통합 인코딩하기 위해 M-ROPE에서 사용하는 3차원 좌표 성분 축의 조합은?",
    options: [
      "밝기, 채도, 명도",
      "시간(Time), 높이(Height), 너비(Width)",
      "스트라이드, 패딩, 커널 크기",
      "쿼리, 키, 값"
    ],
    answer: 1,
    explanation: "M-ROPE는 동영상의 시간 축(T)과 이미지의 높이(H), 너비(W) 공간 축 3가지를 튜플로 정의하여 멀티모달 위치를 회전 인코딩합니다.",
    hint: "동영상의 시간적 순서와 2차원 이미지의 세로/가로 공간 축의 조합입니다."
  },
  {
    id: "r5-mc-023",
    conceptId: "grounded-sam-pipeline-mechanism",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "자연어 텍스트 지시문으로 임의 객체의 위치를 찾고 정밀한 픽셀 마스크를 추출하는 Grounded-SAM 파이프라인의 작업 흐름으로 올바른 것은?",
    options: [
      "SAM이 마스크를 먼저 생성하고 Grounding DINO가 이를 텍스트 파일로 변환함",
      "이미지를 흑백으로 변환한 후 AlexNet으로 분류하고 ResNet으로 박스를 그림",
      "Grounding DINO가 텍스트를 기반으로 바운딩 박스를 오픈 보캡 탐지하고, 이 박스 좌표를 프롬프트로 SAM에 전달하여 정밀 마스크를 자동 생성함",
      "Sapiens가 깊이 지도를 추출하고 MobileNet이 채널을 축소하여 텍스트를 출력함"
    ],
    answer: 2,
    explanation: "Grounding DINO가 텍스트 프롬프트로부터 객체 바운딩 박스를 찾고, 이 박스를 SAM의 프롬프트로 주입하여 정밀 세그멘테이션 마스크를 완성합니다.",
    hint: "텍스트 기반 박스 탐지기(DINO)와 프롬프트 기반 분할기(SAM)의 순차적 연결입니다."
  },
  {
    id: "r5-mc-024",
    conceptId: "sapiens-human-centric-four-tasks-check",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "메타의 Sapiens 모델이 사람(Human) 이미지에 대해 전문적으로 수행하는 4대 비전 태스크의 구성으로 올바른 것은?",
    options: [
      "객체 바운딩 박스 탐지, 광학 흐름(Optical Flow) 추정, 이미지 조도 보정, 시맨틱 세그멘테이션",
      "인스턴스 세그멘테이션, 3D 바운딩 박스 추정, 이미지 초해상화, 특징점 디스크립터 매칭",
      "파놉틱 세그멘테이션, 엣지 경계선 검출, 비디오 모션 트래킹, 파노라마 이미지 스티칭",
      "2D 인체 포즈 추정, 신체 부위 세그멘테이션, 깊이 추정, 표면 법선(Surface Normal) 추정"
    ],
    answer: 3,
    explanation: "Sapiens는 약 3000만 장의 인체 데이터로 사전학습되어 사람 중심의 2D 포즈, 신체 부위 분할, 3D 깊이, 표면 법선 벡터 추정 4대 태스크를 지원합니다.",
    hint: "사람의 관절 자세, 신체 부위별 분할, 입체 깊이 및 표면 기울기 추정의 4가지 작업입니다."
  },

  // =========================================================================
  // [PART 2: 단답형 4문항] (수치/개념 복합 요구)
  // =========================================================================
  {
    id: "r5-sa-025",
    conceptId: "odds-logit-terms-sa",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "short-answer",
    prompt: "로지스틱 회귀에서 성공확률 p를 실패확률 1-p로 나눈 p/(1-p)의 명칭과, 이 값에 로그를 취한 log(p/(1-p))의 명칭을 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: [
      "Odds, Logit",
      "오즈, 로짓",
      "Odds, Logit 변환",
      "오즈, 로짓 변환"
    ],
    explanation: "p/(1-p)는 성공확률과 실패확률의 비인 Odds이며, 여기에 로그를 취한 log(p/(1-p))는 Logit입니다.",
    hint: "성공확률/실패확률의 비와 그 비율에 로그를 취한 변환의 명칭입니다."
  },
  {
    id: "r5-sa-026",
    conceptId: "transformer-qkv-and-scaling-factor-sa",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "short-answer",
    prompt: "트랜스포머 Self-Attention 연산에 입력되는 3가지 행렬의 영문 약자와, Key 벡터 차원 d_k = 64 일 때 점곱 스코어를 나누어주는 스케일링 분모 sqrt(d_k) 수치를 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["Q, K, V, 8", "Q,K,V, 8", "Q K V, 8", "Q, K, V, 8.0"],
    explanation: "어텐션 3요소는 Query(Q), Key(K), Value(V)이며, 스케일링 분모는 sqrt(64) = 8 입니다.",
    hint: "Q, K, V 세 글자와 64의 제곱근 수치를 콤마로 구분해 적으세요."
  },
  {
    id: "r5-sa-027",
    conceptId: "mobilenet-two-conv-types-sa",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "short-answer",
    prompt: "MobileNet의 Depthwise Separable Convolution을 구성하는 두 가지 합성곱 연산(채널별 독립 공간 연산, 1x1 채널 결합 연산)의 영문 명칭을 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["Depthwise Convolution, Pointwise Convolution", "Depthwise Conv, Pointwise Conv", "Depthwise, Pointwise", "depthwise, pointwise"],
    explanation: "채널별 공간 연산은 Depthwise Convolution이며, 1x1 채널 결합 연산은 Pointwise Convolution입니다.",
    hint: "Depthwise Convolution과 Pointwise Convolution 명칭을 적으세요."
  },
  {
    id: "r5-sa-028",
    conceptId: "latent-diffusion-space-and-benefit-sa",
    difficulty: "medium",
    category: "이미지 생성 모델 및 파운데이션 응용",
    questionType: "short-answer",
    prompt: "Latent Diffusion Model(LDM)이 고차원 픽셀 공간 대신 Diffusion 연산을 수행하는 공간의 명칭과, 이를 통해 얻는 대표적인 장점을 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: [
      "Latent Space, 연산 효율 향상",
      "잠재 공간, 연산 효율 향상",
      "Latent Embedding, 연산 효율 증가",
      "잠재 임베딩 공간, 계산 효율 향상",
      "Latent Space, 계산량 감소"
    ],
    explanation: "LDM은 이미지를 압축된 특징 표현인 Latent Embedding으로 변환한 뒤 잠재 공간에서 Diffusion 연산을 수행하여 픽셀 공간에서 직접 연산하는 것보다 계산 효율을 높입니다.",
    hint: "픽셀보다 압축된 특징 표현 공간에서 노이즈 추가·제거를 수행합니다."
  },
  {
    id: "r5-es-029",
    conceptId: "llm-evaluation-methods-essay",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "essay",
    prompt: "거대 언어 모델(LLM)의 출력 평가에서 '정답이 정해진 태스크'와 '정답이 하나로 정해지지 않은 생성 태스크'의 평가 방법 차이를 설명하고, 후자의 경우 사용할 수 있는 ROUGE, 코사인 유사도, Perplexity(PPL), LLM-as-Judge 중 3가지 이상의 역할을 서술하시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["Accuracy", "ROUGE", "코사인 유사도", "Perplexity", "PPL", "LLM-as-Judge"],
    modelAnswer: "1) 정답이 정해진 분류나 객관식 태스크는 모델 예측과 정답의 일치도를 직접 비교하여 Accuracy와 같은 지표로 평가할 수 있다. 2) 정답이 하나로 정해지지 않는 요약·스토리 생성 등은 단순 정확도만으로 평가하기 어렵다. ROUGE는 정답 문장과 생성 문장의 단어 또는 n-gram 중복 정도를 측정할 수 있고, 임베딩 기반 코사인 유사도는 두 문장의 의미 벡터가 얼마나 유사한지 측정한다. Perplexity는 언어 모델이 생성 텍스트를 얼마나 확률적으로 자연스럽게 설명하는지를 나타내며 일반적으로 낮을수록 예측이 안정적이다. LLM-as-Judge는 평가 태스크, 생성 텍스트, 평가 기준을 거대 언어 모델에 제공하여 일관성·유창성·관련성 등 복합 품질을 점수화하는 방식이다.",
    rubricKeywords: [
      "정답이 정해진 경우 예측-정답 일치도 및 Accuracy",
      "ROUGE 또는 코사인 유사도를 통한 정답 기반 텍스트 유사도 평가",
      "Perplexity를 통한 확률적 자연스러움 평가",
      "LLM-as-Judge를 통한 복합 품질 기준 평가"
    ],
    minLength: 20,
    explanation: "고정 정답 태스크와 자유 생성 태스크의 평가 차이를 구분하고, 생성 텍스트 평가에 쓰이는 여러 지표의 역할을 설명하는 문제입니다.",
    hint: "정확한 정답이 있는 경우와 여러 표현이 모두 정답이 될 수 있는 경우를 먼저 나눈 뒤 각 평가 지표의 역할을 쓰세요."
  },
  {
    id: "r5-es-030",
    conceptId: "diffusion-ldm-controlnet-essay",
    difficulty: "medium",
    category: "이미지 생성 모델 및 파운데이션 응용",
    questionType: "essay",
    prompt: "Diffusion 기반 이미지 생성 모델의 Forward 과정과 Reverse(Denoising) 과정의 차이를 설명하고, Latent Diffusion Model(LDM)이 픽셀 공간 대신 잠재 공간에서 연산하는 이유와 ControlNet이 이미지 생성 과정에서 수행하는 역할을 함께 서술하시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["Forward", "Noise", "Denoising", "Latent", "연산 효율", "ControlNet", "조건"],
    modelAnswer: "1) Diffusion 모델의 Forward 과정은 실제 이미지에 점진적으로 노이즈를 추가하여 최종적으로 단순한 노이즈 분포에 가까워지게 하는 과정이다. Reverse 과정은 학습된 모델이 이 노이즈를 단계적으로 예측·제거하여 이미지 구조를 복원하고 새로운 이미지를 생성하는 과정이다. 2) LDM은 고차원 픽셀 공간 대신 이미지를 압축한 Latent Embedding 공간에서 Diffusion 연산을 수행하여 계산량과 자원 요구를 줄이고 연산 효율을 높인다. 3) ControlNet은 텍스트 프롬프트 외에도 Sketch, Depth Map, Edge, Segmentation, Human Pose 등과 같은 컨트롤 조건 입력을 추가하여 사용자가 원하는 구조와 형태를 더 직접적으로 반영한 이미지를 생성하도록 제어한다.",
    rubricKeywords: [
      "Forward 과정의 점진적 노이즈 추가와 Reverse 과정의 노이즈 제거",
      "LDM의 잠재 공간 연산을 통한 계산 효율 향상",
      "ControlNet의 Edge/Depth/Pose/Sketch 등 조건 입력을 통한 생성 구조 제어"
    ],
    minLength: 20,
    explanation: "Diffusion의 노이즈 추가·제거 과정, LDM의 잠재 공간 연산 이유, ControlNet의 조건 기반 이미지 생성 제어 역할을 종합적으로 설명합니다.",
    hint: "노이즈를 넣는 방향과 제거하는 방향을 먼저 구분하고, 픽셀 대신 Latent를 쓰는 이유와 추가 조건 입력의 역할을 연결하세요."
  }

];

export const ALL_QUESTIONS = SSAFY_AI_MOCK_EXAM_ROUND_5;
