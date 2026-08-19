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

export const SSAFY_AI_MOCK_EXAM_ROUND_2: StudyQuestion[] = [
  // =========================================================================
  // [PART 1: 객관식 24문항] (정답 0, 1, 2, 3번 각 6개씩 25% 완벽 균등 분산)
  // =========================================================================

  // --- [머신러닝 기초 및 회귀 분석] (Q1 ~ Q4) ---
  {
    id: "r2-mc-001",
    conceptId: "multicollinearity-coefficient-distortion",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt:
      "다중선형회귀 모형에서 독립 변수들 간에 강한 상관관계가 존재하는 다중공선성이 발생했을 때 나타나는 현상으로 가장 올바른 것은?",
    options: [
      "회귀계수의 분산이 커져 유의성과 개별 영향 해석이 불안정해짐",
      "모델의 전체 결정계수(R^2)가 항상 음수 값으로 급감하여 예측 성능이 0으로 수렴함",
      "독립 변수의 개수 p가 데이터 샘플 수 n보다 적을 때만 발생하는 특이 현상으로 분류됨",
      "모든 독립 변수의 P-value가 0에 가깝게 작아져 무조건 통계적으로 유의미하다고 잘못 판정됨"
    ],
    answer: 0,
    explanation:
      "다중공선성이 존재하면 X^T X 행렬이 거의 비가역적이 되어 회귀계수 추정량의 분산이 매우 커지며, 개별 변수의 순수한 기여도를 분리하여 해석하기 어려워집니다.",
    hint:
      "독립 변수들끼리 정보를 중복 공유할 때 계수 추정치의 분산과 해석 안정성에 생기는 변화를 생각하세요."
  },
  {
    id: "r2-mc-002",
    conceptId: "correlation-vs-causation-principle",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt:
      "머신러닝 및 회귀분석에서 '상관관계'와 '인과관계'의 차이에 대한 설명으로 가장 올바른 것은?",
    options: [
      "피어슨 상관계수가 1에 가까우면 변수 X가 변수 Y를 직접 유발하는 원인임을 수학적으로 증명함",
      "통계적 관련성만으로는 제3의 변수나 우연을 배제할 수 없음",
      "비선형 회귀 모델을 학습시키면 데이터의 상관관계만으로도 완벽한 인과 경로를 자동 규명함",
      "인과관계가 존재하는 두 변수는 어떠한 경우에도 피어슨 상관계수가 0으로 계산됨"
    ],
    answer: 1,
    explanation:
      "상관관계는 두 변수가 함께 움직이는 경향성일 뿐이며, 원인과 결과의 관계(인과관계)를 의미하지는 않습니다.",
    hint:
      "통계적 연관성과 실제 원인-결과 관계를 구별해야 하는 이유를 떠올려 보세요."
  },
  {
    id: "r2-mc-003",
    conceptId: "hypothesis-space-and-ols-learning",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt:
      "머신러닝의 학습 개념 및 선형 회귀의 최소제곱법에 대한 설명으로 가장 올바른 것은?",
    options: [
      "가설 공간이란 수집된 훈련 데이터셋 내의 모든 입력 피처 벡터들의 집합을 의미함",
      "최소제곱법은 잔차(실제값 - 예측값)의 절대값 합을 최소화하는 최적의 가중치를 분석적으로 도출함",
      "가설 공간에서 잔차제곱합을 최소화하는 파라미터를 탐색함",
      "학습이 완료된 선형 회귀 모델의 잔차 평균은 언제나 1.0으로 고정되어 편향을 보정함"
    ],
    answer: 2,
    explanation:
      "머신러닝 학습은 정의된 가설 공간 내에서 손실 함수(선형회귀의 경우 잔차제곱합 RSS)를 최소화하는 최적의 파라미터를 찾는 탐색 과정입니다.",
    hint:
      "선형 함수들의 집합인 가설 공간에서 오차 제곱합을 줄이는 최적 가중치를 찾는 과정을 생각하세요."
  },

  // ★ 수정: 강의자료의 R² = 0.612 해석을 직접 반영
  {
    id: "r2-mc-004",
    conceptId: "r-squared-interpretation",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt:
      "단순선형회귀 결과 결정계수 R²가 0.612로 계산되었다. 이에 대한 해석으로 가장 올바른 것은?",
    options: [
      "독립변수와 종속변수 사이에 인과관계가 61.2% 확률로 존재함",
      "회귀계수의 p-value가 반드시 0.612임",
      "테스트 데이터의 예측 정확도가 반드시 61.2%임",
      "회귀 모델이 종속변수 변동의 약 61.2%를 설명함"
    ],
    answer: 3,
    explanation:
      "결정계수 R²는 회귀 모델이 종속변수의 전체 변동을 얼마나 설명하는지를 나타냅니다. R²=0.612라면 모델이 종속변수 변동의 약 61.2%를 설명한다고 해석합니다.",
    hint:
      "R²는 분류 정확도나 인과관계의 확률이 아니라 모델의 설명력과 관련된 지표입니다."
  },

  // --- [자연어 처리 및 시퀀스/LLM] (Q5 ~ Q10) ---
  {
    id: "r2-mc-005",
    conceptId: "word2vec-cbow-vs-skipgram-tradeoff",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt:
      "Word2Vec의 두 가지 핵심 모델인 CBOW와 Skip-Gram의 구조 및 특성 비교로 가장 올바른 것은?",
    options: [
      "CBOW는 문맥으로 중심 단어를, Skip-Gram은 중심 단어로 문맥을 예측하며 후자가 희귀 단어에 유리함",
      "Skip-Gram은 주변 단어로 중심 단어를 예측하고 CBOW는 중심 단어로 주변 단어를 예측하며, 학습 속도는 Skip-Gram이 항상 빠름",
      "두 방식 모두 문맥의 단어 순서를 완벽히 기억하는 양방향 순환 신경망 계층을 사용함",
      "CBOW는 말뭉치 전체의 동시 발생 행렬을 특이값 분해하고, Skip-Gram은 문자 단위 n-gram을 합산함"
    ],
    answer: 0,
    explanation:
      "CBOW는 주변 문맥으로 중심 단어를 예측(다수→1)하고, Skip-Gram은 중심 단어로 주변 문맥을 예측(1→다수)하므로 드물게 등장하는 희귀 단어의 학습 기회가 더 많습니다.",
    hint:
      "주변 문맥을 보고 가운데를 맞추는지, 가운데 단어를 보고 주변 문맥들을 맞추는지 방향성을 확인하세요."
  },
  {
    id: "r2-mc-006",
    conceptId: "lstm-three-gates-and-cell-state",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt:
      "LSTM의 내부 게이트 구성 및 동작 원리에 대한 설명으로 가장 올바른 것은?",
    options: [
      "망각 게이트는 현재 입력 정보를 얼마나 새로 저장할지를 0과 1 사이의 값으로 조절하는 역할을 전담함",
      "망각 게이트는 과거 정보를, 입력 게이트는 새 정보 반영을 조절함",
      "출력 게이트는 셀 상태의 모든 수치를 양수로 고정하고 은닉 상태의 차원을 2배로 확장하는 선형 변환기임",
      "LSTM은 오직 1개의 tanh 활성화 함수만을 단독 사용하여 이전 타임스텝의 오차 기울기를 완전 복제함"
    ],
    answer: 1,
    explanation:
      "LSTM은 과거 정보를 선별 삭제하는 망각 게이트(Forget), 새로운 정보를 선별 저장하는 입력 게이트(Input), 출력을 조절하는 출력 게이트(Output)와 Cell State를 통해 장기 의존성을 학습합니다.",
    hint:
      "과거 삭제, 새 정보 저장, 내보내기를 담당하는 3가지 게이트와 장기 기억 통로를 생각하세요."
  },
  {
    id: "r2-mc-007",
    conceptId: "multihead-attention-subspace-representation",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt:
      "트랜스포머의 Multi-Head Attention이 단일 헤드 어텐션 대비 문맥 표현력 측면에서 갖는 결정적 이점은?",
    options: [
      "어텐션 가중치 행렬의 모든 계산을 생략하여 전체 연산 복잡도를 O(1)로 줄여줌",
      "시퀀스 토큰의 위치 순서를 1차원 평탄화 연산으로 고정하여 어휘 크기를 늘려줌",
      "쿼리·키·값을 여러 하위 공간에 사영해 다양한 관계를 병렬로 포착함",
      "역전파 시 가중치 기울기를 0으로 초기화하여 심층 신경망의 과적합을 완전히 차단함"
    ],
    answer: 2,
    explanation:
      "헤드를 여러 개로 나누어 각각 다른 프로젝션 행렬을 적용함으로써, 문법적 관계, 의미적 관계, 위치적 관계 등 다양한 하위 공간의 정보를 병렬로 포착합니다.",
    hint:
      "단일 공간이 아닌 여러 개의 독립된 하위 공간(Subspaces)에서 주의를 집중하는 효과입니다."
  },
  {
    id: "r2-mc-008",
    conceptId: "llm-sampling-parameters-entropy",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt:
      "LLM 텍스트 생성 추론 시 Temperature 파라미터와 Top-p 샘플링의 동작 방식으로 가장 올바른 것은?",
    options: [
      "Temperature를 낮추면 로짓 분포가 평평해져 창의적이고 무작위성이 강한 응답이 출력됨",
      "Top-p 샘플링은 예측 확률이 가장 낮은 하위 p%의 토큰들만 후보로 골라 무작위 추출함",
      "Temperature는 토큰 간 코사인 유사도를 계산해 어휘 사전을 필터링하는 역할을 함",
      "낮은 온도는 고확률 토큰에 집중하고, Top-p는 누적 확률 범위에서 샘플링함"
    ],
    answer: 3,
    explanation:
      "Temperature를 낮추면 분포의 첨도가 커져 결정론적(Deterministic) 텍스트가 출력되고, Top-p는 누적 확률 상위 p 범위 내의 유효 후보군만 선별합니다.",
    hint:
      "온도를 낮출 때의 확률 집중 효과와 상위 누적 확률 기반 후보군 선별의 정의를 확인하세요."
  },
  {
    id: "r2-mc-009",
    conceptId: "llm-training-stages-paradigm",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt:
      "거대 언어 모델의 일반적인 3단계 학습 파이프라인(사전학습 → 지시 튜닝 → 인간 선호도 정렬)의 특징에 대한 설명으로 가장 올바른 것은?",
    options: [
      "사전학습 후 지도 미세조정과 선호도 정렬을 차례로 수행함",
      "지시 튜닝 단계에서 모델 전체 지식의 99%를 새로 습득하며 사전학습은 데이터 정제에 불과함",
      "인간 선호도 정렬 단계에서는 정답 레이블 없이 비지도 언어 모델링 손실만을 단독 최적화함",
      "사전학습 단계는 소규모의 정제된 질의응답 데이터만으로 학습하며 지시 튜닝에서 대규모 웹 문서를 학습함"
    ],
    answer: 0,
    explanation:
      "방대한 텍스트로 기본 지식과 추론을 배우는 사전학습, 대화 형식을 익히는 SFT, 안전성과 선호도를 반영하는 정렬(RLHF/DPO) 단계로 이루어집니다.",
    hint:
      "기본 지식 습득, 지시문 이행 학습, 선호도 및 안전성 정렬의 3단계 흐름을 떠올려 보세요."
  },
  {
    id: "r2-mc-010",
    conceptId: "greedy-vs-beam-search-decoding",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt:
      "텍스트 생성 디코딩 전략인 Greedy Decoding과 Beam Search의 핵심적인 동작 차이로 가장 올바른 것은?",
    options: [
      "Greedy Decoding은 모든 어휘 사전의 결합 확률을 완전 탐색하고, Beam Search는 매 시점 가장 확률이 높은 단어 1개만 선택함",
      "Greedy는 매 시점 최상위 토큰을, Beam은 상위 k개 시퀀스를 유지함",
      "Greedy Decoding은 생성 다양성을 극대화하는 확률적 무작위 추출이고, Beam Search는 단어를 역순으로 디코딩함",
      "두 방식 모두 누적 확률 대신 단어의 글자 수를 최우선 기준으로 삼아 가장 짧은 문장만을 최종 결과로 선택함"
    ],
    answer: 1,
    explanation:
      "Greedy Decoding은 매 시점 가장 확률이 높은 단일 토큰을 탐욕적으로 선택하는 반면, Beam Search는 빔 크기 k개의 유력한 후보 시퀀스를 유지하면서 누적 확률이 높은 최적의 경로를 탐색합니다.",
    hint:
      "매 순간 최선의 1개 토큰만 고르는 방식과 여러 후보 시퀀스를 유지하며 누적 확률을 비교하는 방식의 차이를 생각하세요."
  },

  // --- [CNN 및 대표 비전 아키텍처] (Q11 ~ Q16) ---
  {
    id: "r2-mc-011",
    conceptId: "resnet-bottleneck-param-reduction-calc",
    difficulty: "medium",
    category: "합성곱 신경망 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt:
      "256채널 입력 특징 맵에 3x3 Conv 256필터를 바로 적용하는 것(A)과, 1x1 Conv(64) → 3x3 Conv(64) → 1x1 Conv(256)의 병목 블록을 적용하는 것(B)의 파라미터 수 비교로 옳은 것은?",
    options: [
      "A 방식: 약 10만 개 / B 방식: 약 20만 개 (A 방식이 파라미터를 50% 절감함)",
      "두 방식 모두 가중치 파라미터 개수가 589,824개로 수학적으로 완벽히 동일함",
      "A 방식: 589,824개 / B 방식: 69,632개",
      "B 방식은 1x1 필터만 사용하여 비선형 표현력이 부족하고 파라미터가 2배 증가함"
    ],
    answer: 2,
    explanation:
      "A = 256 x 3 x 3 x 256 = 589,824개. B = (256x1x1x64) + (64x3x3x64) + (64x1x1x256) = 16,384 + 36,864 + 16,384 = 69,632개로 병목 구조가 파라미터를 대폭 줄입니다.",
    hint:
      "1x1로 채널을 압축한 후 3x3 연산을 수행하고 다시 복원하는 가중치 수의 합을 계산해 보세요."
  },
  {
    id: "r2-mc-012",
    conceptId: "stride-effective-receptive-field",
    difficulty: "medium",
    category: "합성곱 신경망 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt:
      "첫 번째 계층이 3x3 필터(스트라이드 2, 패딩 0)이고, 두 번째 계층이 3x3 필터(스트라이드 1, 패딩 0)로 연결된 신경망에서 최종 특징 맵의 한 점이 참조하는 원본 입력의 유효 수용 영역 크기는?",
    options: [
      "5x5",
      "6x6",
      "9x9",
      "7x7"
    ],
    answer: 3,
    explanation:
      "RF_1 = 3 이며, 두 번째 계층을 거치면 RF_2 = RF_1 + (K_2 - 1) * S_1 = 3 + (3 - 1) * 2 = 7 이 되므로 유효 수용 영역은 7x7 크기입니다.",
    hint:
      "첫 계층의 보폭(Stride=2)에 의해 두 번째 계층 필터가 원본 입력에서 건너뛰는 간격을 고려하세요."
  },
  {
    id: "r2-mc-013",
    conceptId: "vggnet-non-linear-layer-stack-advantage",
    difficulty: "medium",
    category: "합성곱 신경망 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt:
      "VGGNet이 대형 필터 대신 3x3 소형 필터만을 깊게 중첩하여 사용함으로써 얻은 모델 표현력 측면의 결정적 이점은?",
    options: [
      "동일 수용 영역에서 비선형 활성화를 더 많이 적용할 수 있음",
      "완전 연결 계층의 뉴런 수를 10배로 확장하여 메모리 사용량을 절감함",
      "입력 이미지의 공간 해상도를 1x1로 압축하여 채널 간 상관관계를 제거함",
      "지름길 연결 통로를 자동으로 생성하여 심층 신경망의 가중치 소실을 막음"
    ],
    answer: 0,
    explanation:
      "3x3 필터를 여러 개 쌓으면 파라미터 수가 감소할 뿐만 아니라 각 Conv 계층 뒤에 ReLU가 추가되어 비선형 결정 경계 형성 능력이 강화됩니다.",
    hint:
      "층 수가 많아짐에 따라 추가되는 활성화 함수(ReLU)의 개수 증가 효과를 생각하세요."
  },
  {
    id: "r2-mc-014",
    conceptId: "mobilenet-depthwise-flops-calc",
    difficulty: "medium",
    category: "합성곱 신경망 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt:
      "입력 특징 맵이 112x112x64이고 3x3 커널을 사용하는 MobileNet의 Depthwise Convolution 연산량(곱셈 횟수)으로 올바른 계산값은? (스트라이드 1, 패딩 1 적용)",
    options: [
      "112 x 112 x 64 x 64 x 9 (약 4억 6천만 회)",
      "112 x 112 x 64 x 3 x 3 (약 722만 회)",
      "112 x 112 x 3 x 3 (약 11만 회)",
      "64 x 64 x 3 x 3 (약 3만 6천 회)"
    ],
    answer: 1,
    explanation:
      "Depthwise Conv는 각 채널마다 독립적으로 3x3 공간 연산만 수행하므로 출력 원소 수(112x112x64) x 커널 면적(3x3) = 7,225,344회(약 7.22M)입니다.",
    hint:
      "채널 간 결합 연산 없이, 각 채널 특징 맵 화소마다 3x3 필터 곱셈이 적용됩니다."
  },
  {
    id: "r2-mc-015",
    conceptId: "resnet-residual-function-ease-of-learning",
    difficulty: "medium",
    category: "합성곱 신경망 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt:
      "ResNet의 잔차 함수 F(x) = H(x) - x 가 기존의 일반 평탄 함수 H(x)를 직접 최적화하는 것보다 학습하기 쉬운 이유는?",
    options: [
      "신경망의 모든 가중치 파라미터가 0으로 고정되어 계산이 생략되기 때문에",
      "입력 이미지의 해상도를 매 계층마다 절반으로 강제 다운샘플링하기 때문에",
      "잔차 함수가 0에 가까워지면 블록이 항등 매핑을 구현하기 쉬움",
      "교차 엔트로피 손실 함수 대신 평균 제곱 오차만을 단독으로 사용할 수 있기 때문에"
    ],
    answer: 2,
    explanation:
      "추가된 계층이 불필요할 때 가중치를 0으로 몰아 F(x)=0으로 만드는 것이 복잡한 비선형 층으로 항등 매핑 H(x)=x를 근사하는 것보다 훨씬 쉽습니다.",
    hint:
      "아무런 변형이 필요 없는 구간에서 가중치를 0으로 수렴시키는 최적화의 용이성을 생각하세요."
  },
  {
    id: "r2-mc-016",
    conceptId: "cnn-memory-vs-parameter-distribution",
    difficulty: "medium",
    category: "합성곱 신경망 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt:
      "고전적 CNN(AlexNet, VGGNet 등)에서 순방향 전파 시 활성화 맵 메모리 점유율과 가중치 파라미터 수의 계층별 분포 특성은?",
    options: [
      "활성화 맵 메모리와 가중치 파라미터 모두 후반부 전결합 계층에 집중되어 있음",
      "활성화 맵 메모리와 가중치 파라미터 모두 초반부 합성곱 계층에 집중되어 있음",
      "활성화 맵 메모리는 풀링 계층에, 파라미터는 드롭아웃 계층에 집중되어 있음",
      "활성화 맵 메모리는 해상도가 큰 초반 계층에, 파라미터는 연결선이 많은 후반 계층에 집중됨"
    ],
    answer: 3,
    explanation:
      "공간 해상도가 큰 초반 Conv 계층은 활성화 피처맵 메모리를 많이 소비하며, 전결합을 수행하는 후반 FC 계층은 파라미터의 대부분을 차지합니다.",
    hint:
      "해상도가 큰 계층과 전결합 연결선이 많은 계층의 특성을 구분해 보세요."
  },

  // --- [VLM 및 멀티모달 정합/응용] (Q17 ~ Q20) ---

  // ★ 수정: Prompt Ensembling 대신 강의자료의 CLIP Zero-shot 흐름
  {
    id: "r2-mc-017",
    conceptId: "clip-zero-shot-classification-flow",
    difficulty: "medium",
    category: "시각-언어 모델 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt:
      "CLIP을 이용해 별도의 추가 학습 없이 새로운 이미지에 대해 제로샷 분류를 수행하는 과정으로 가장 올바른 것은?",
    options: [
      "텍스트 후보와 이미지 임베딩의 유사도가 가장 높은 범주를 선택함",
      "새로운 데이터셋의 모든 이미지로 이미지 인코더의 전체 가중치를 다시 학습한 뒤 분류함",
      "입력 이미지의 픽셀 평균값과 후보 클래스 이름의 글자 수를 비교하여 클래스를 선택함",
      "텍스트 인코더를 제거하고 이미지 인코더 뒤에 새로운 분류용 FC 레이어를 반드시 학습함"
    ],
    answer: 0,
    explanation:
      "CLIP 제로샷 분류에서는 'A photo of a {object}.'와 같이 후보 카테고리를 텍스트로 만들고 각각을 텍스트 임베딩으로 변환합니다. 이후 입력 이미지 임베딩과 후보 텍스트 임베딩들의 유사도를 계산하여 가장 높은 점수의 카테고리를 예측합니다.",
    hint:
      "이미지와 후보 텍스트를 같은 임베딩 공간에서 비교하고 가장 유사한 텍스트를 선택합니다."
  },
  {
    id: "r2-mc-018",
    conceptId: "siglip-loss-formulation-math",
    difficulty: "medium",
    category: "시각-언어 모델 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt:
      "SigLIP의 목적함수에서 정답 라벨 z_ij 에 따른 최적화 동작 방식으로 가장 올바른 것은?",
    options: [
      "양성 페어는 소프트맥스 분모를 키우고, 음성 페어는 분자를 줄여 정규화함",
      "양성 쌍 유사도는 높이고 음성 쌍 유사도는 낮추도록 학습함",
      "모든 이미지와 텍스트 쌍에 대해 라벨과 무관하게 동일한 크로스엔트로피 손실을 계산함",
      "행렬의 주대각선 원소만 계산에 반영하고 나머지 비대각선 원소는 손실 계산에서 제외함"
    ],
    answer: 1,
    explanation:
      "SigLIP은 각 쌍을 이진 분류로 취급하여 양성(z=+1)은 시그모이드 출력이 1에, 음성(z=-1)은 0에 수렴하도록 독립적인 로그 손실을 최소화합니다.",
    hint:
      "정답 쌍과 오답 쌍에 대해 각각 시그모이드가 도달해야 하는 확률 목표치(1과 0)를 생각하세요."
  },
  {
    id: "r2-mc-019",
    conceptId: "imagebind-transitive-alignment",
    difficulty: "medium",
    category: "시각-언어 모델 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt:
      "ImageBind 모델이 오디오와 깊이맵 사이의 직접적인 쌍 데이터를 학습하지 않고도 두 모달리티 간 제로샷 검색을 수행할 수 있는 원리는?",
    options: [
      "오디오 신호를 흑백 이미지 파일로 강제 인코딩하여 처리했기 때문에",
      "모든 모달리티 인코더가 동일한 단어 어휘 사전을 공유하고 있기 때문에",
      "두 모달리티가 시각 앵커와 각각 정렬되어 공통 공간을 공유함",
      "언어 모델이 중간에서 오디오를 텍스트로 자동 전사해 깊이맵과 비교해주기 때문에"
    ],
    answer: 2,
    explanation:
      "모든 모달리티 인코더가 시각(Image) 공간을 공통 기준으로 정렬되었기 때문에, 직접 연결되지 않은 모달리티 쌍 간에도 이행적(Transitive) 벡터 비교가 가능합니다.",
    hint:
      "시각 데이터를 중심 매개체로 하여 공유된 하나의 임베딩 공간을 바라보도록 학습된 결과입니다."
  },
  {
    id: "r2-mc-020",
    conceptId: "llava-token-interleaving-flow",
    difficulty: "medium",
    category: "시각-언어 모델 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt:
      "LLaVA 아키텍처에서 입력 이미지가 최종 언어 모델에 주입되어 응답을 생성하기까지의 데이터 변환 흐름으로 올바른 것은?",
    options: [
      "이미지 → 텍스트 번역기 → 음성 인코더 → 언어 모델 → 픽셀 출력",
      "이미지 → 1차원 평탄화 → 전결합 계층 → 소프트맥스 → 언어 모델",
      "이미지 → 오토인코더 디코더 → 잠재 공간 → 교차 엔트로피 손실",
      "이미지를 비전 인코더와 투영 어댑터로 시각 토큰화한 뒤 언어 모델에 전달함"
    ],
    answer: 3,
    explanation:
      "이미지를 ViT로 추출한 특징 Z_v를 프로젝션 레이어를 거쳐 H_v로 변환한 후 질문 텍스트 임베딩 H_q와 이어붙여 LLM으로 전달합니다.",
    hint:
      "비전 인코더, 차원 정렬 프로젝션 어댑터, 텍스트 질문과의 결합 순서를 확인하세요."
  },

  // --- [VLM 변종 및 비전 파운데이션 모델] (Q21 ~ Q24) ---
  {
    id: "r2-mc-021",
    conceptId: "qwen2-vl-dynamic-resolution-advantage",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt:
      "Qwen2-VL이 고정 크기 이미지 리사이징 대신 원본 해상도를 직접 패치화하여 처리함으로써 얻은 결정적 장점은?",
    options: [
      "종횡비와 해상도를 보존해 작은 글씨와 미세 객체 인식을 높임",
      "비전 인코더의 연산 복잡도를 O(1) 상수로 줄여 추론 메모리를 완전히 제거함",
      "모든 컬러 이미지를 흑백으로 단순화하여 학습 속도를 획기적으로 가속함",
      "시각 패치에 위치 인코딩을 주입하는 단계를 완전히 생략할 수 있게 됨"
    ],
    answer: 0,
    explanation:
      "고정 크기 정사각형으로 강제 축소할 때 생기는 종횡비 왜곡과 해상도 손실을 방지하여 세밀한 텍스트 및 미세 객체 판별력이 대폭 상승합니다.",
    hint:
      "정사각형 강제 리사이징 시 발생하는 글자 뭉개짐이나 왜곡을 없애는 효과입니다."
  },
  {
    id: "r2-mc-022",
    conceptId: "som-prompting-gui-agent-grounding",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt:
      "컴퓨터 화면을 제어하는 VLM GUI 에이전트에 Set-of-Mark  프롬프팅을 적용했을 때 시각적 위치 파악 정확도가 향상되는 이유는?",
    options: [
      "VLM의 언어 모델 파라미터 크기를 실시간으로 2배 증설해주기 때문에",
      "좌표 대신 UI 요소의 번호를 언어로 지목해 위치 오차를 줄임",
      "모든 마우스 클릭 동작을 키보드 텍스트 타이핑으로 강제 치환하기 때문에",
      "화면 내의 모든 아이콘과 텍스트를 삭제하여 노이즈를 사전에 차단하므로"
    ],
    answer: 1,
    explanation:
      "SoM은 이미지나 UI 요소에 번호 마크를 표시하여 각 객체를 명확하게 참조할 수 있도록 하며, 이를 통해 VLM의 시각적 위치 파악(Grounding) 성능을 향상시킵니다.",
    hint:
      "미세한 소수점 좌표 계산 대신 이미지에 그려진 번호 기호를 언어로 지정하는 방식입니다."
  },
  {
    id: "r2-mc-023",
    conceptId: "grounded-sam-pipeline-architecture",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt:
      "\"빨간색 헬멧을 쓴 사람\"이라는 자연어 텍스트 입력만으로 이미지 내 해당 인물의 정밀한 픽셀 마스크를 추출하는 Grounded-SAM 파이프라인의 작업 흐름은?",
    options: [
      "SAM이 마스크 생성 → 텍스트 인코더 분석 → ResNet이 바운딩 박스 생성",
      "DINOv2가 특징 추출 → StyleCLIP이 색상 변경 → VGGNet이 마스크 분할",
      "Grounding DINO로 박스를 찾고 SAM으로 마스크를 생성함",
      "Sapiens가 깊이 추정 → MobileNet이 채널 축소 → AlexNet이 마스크 출력"
    ],
    answer: 2,
    explanation:
      "오픈 보캡 탐지기인 Grounding DINO가 텍스트 조건으로 박스를 찾고, 이 박스 좌표를 SAM의 프롬프트로 주입하여 정밀 마스크를 자동 추출합니다.",
    hint:
      "텍스트 기반 객체 탐지기(DINO)와 프롬프트 기반 분할기(SAM)의 연결 구조입니다."
  },
  {
    id: "r2-mc-024",
    conceptId: "sapiens-human-centric-foundation",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt:
      "메타의 Sapiens 모델이 사람 이미지에 대해 수행하는 4대 비전 태스크의 구성으로 올바른 것은?",
    options: [
      "객체 바운딩 박스 탐지, 광학 흐름 추정, 이미지 조도 보정, 시맨틱 세그멘테이션",
      "인스턴스 세그멘테이션, 3D 바운딩 박스 추정, 이미지 초해상화, 특징점 디스크립터 매칭",
      "파놉틱 세그멘테이션, 엣지 경계선 검출, 비디오 모션 트래킹, 파노라마 이미지 스티칭",
      "2D 포즈, 신체 분할, 깊이, 표면 법선 추정"
    ],
    answer: 3,
    explanation:
      "Sapiens는 약 3000만 장의 인체 데이터로 사전학습되어 사람 중심의 포즈, 파츠 분할, 3D 깊이, 표면 법선 벡터 추정 4대 태스크를 지원합니다.",
    hint:
      "인체의 관절 자세, 신체 부위별 분할, 입체 깊이 및 표면 기울기 추정의 4가지 작업입니다."
  },

  // =========================================================================
  // [PART 2: 단답형 4문항] (수치/개념 복합 요구)
  // =========================================================================

  // ★ 수정: VIF/F1 계산 → 강의자료에 직접 등장하는 검증 지표 + LOOCV
  {
    id: "r2-sa-025",
    conceptId: "classification-validation-metric-and-loocv-sa",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "short-answer",
    prompt:
      "분류 문제의 검증 오류를 측정할 때 강의자료에서 예시로 제시한 지표 중 하나와, K-겹 교차검증에서 K를 전체 데이터 개수 n과 같게 설정하는 방법의 명칭을 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: [
      "F1-score, LOOCV",
      "F1 score, LOOCV",
      "F1-Score, LOOCV",
      "F1-score, Leave-One-Out",
      "F1-score, Leave-One-Out Cross-Validation",
      "오분류율, LOOCV",
      "오분류율, Leave-One-Out",
      "오분류율, Leave-One-Out Cross-Validation"
    ],
    explanation:
      "강의자료에서는 분류 문제의 검증 오류 지표로 오분류율 또는 F1-score를 제시합니다. 또한 K-겹 교차검증에서 K=n으로 설정하여 매 반복마다 관측치 하나를 검증셋으로 사용하는 방식을 Leave-One-Out Cross-Validation(LOOCV)이라고 합니다.",
    hint:
      "분류 검증 지표 하나와, 매번 데이터 1개만 검증에 사용하는 교차검증의 영문 약자를 떠올려 보세요."
  },
  {
    id: "r2-sa-026",
    conceptId: "cbow-and-skipgram-sa",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "short-answer",
    prompt:
      "Word2Vec에서 주변 문맥 단어로 중심 단어를 예측하는 모델과, 중심 단어로 주변 문맥 단어들을 예측하는 모델의 명칭을 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: [
      "CBOW, Skip-Gram",
      "CBOW, Skip-gram",
      "cbow, skip-gram",
      "CBOW, SkipGram"
    ],
    explanation:
      "주변으로 중심을 예측하는 모델은 CBOW(Continuous Bag of Words)이며, 중심으로 주변을 예측하는 모델은 Skip-Gram입니다.",
    hint:
      "CBOW와 Skip-Gram 영문 명칭을 콤마로 구분하여 적으세요."
  },
  {
    id: "r2-sa-027",
    conceptId: "conv-dim-calc-and-mobilenet-sa",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "short-answer",
    prompt:
      "64x64x3 입력 이미지에 3x3 커널(패딩 1, 스트라이드 2) 32필터의 합성곱을 적용했을 때 출력 특징 맵의 가로세로 해상도(H x W)와, MobileNet의 핵심 경량화 합성곱 영문 명칭을 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: [
      "32x32, Depthwise Separable Convolution",
      "32x32, Depthwise Separable Conv",
      "32 x 32, Depthwise Separable Convolution",
      "32x32, 깊이별 가분 합성곱"
    ],
    explanation:
      "해상도는 (64 - 3 + 2)/2 + 1 = 32 이므로 32x32이며, 경량화 기법은 Depthwise Separable Convolution입니다.",
    hint:
      "출력 가로세로 크기와 채널/공간을 분리하는 합성곱 영문 명칭을 적으세요."
  },
  {
    id: "r2-sa-028",
    conceptId: "siglip-labels-and-sam-scale-sa",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "short-answer",
    prompt:
      "SigLIP 알고리즘에서 양성 페어와 음성 페어에 각각 부여되는 정답 라벨 z_ij 수치 2가지와, 메타의 SAM 모델을 학습시키기 위해 구축된 데이터셋의 이미지 수 및 마스크 수 규모를 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: [
      "+1, -1, 1100만 장, 10억 개",
      "+1, -1, 11M, 1B",
      "1, -1, 1100만, 10억",
      "+1, -1, 1100만 이미지, 10억 마스크",
      "+1, -1, 1100만, 10억 개"
    ],
    explanation:
      "SigLIP 라벨은 양성 +1, 음성 -1 이며, SAM 학습 데이터셋 규모는 약 1,100만(11M) 이미지 및 10억(1B) 마스크입니다.",
    hint:
      "양수/음수 1 라벨과 천만 단위 이미지 수, 십억 단위 마스크 수를 적으세요."
  },

  // =========================================================================
  // [PART 3: 서술형 2문항]
  // =========================================================================
  {
    id: "r2-es-029",
    conceptId: "decoding-strategies-and-sampling-parameters-essay",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "essay",
    prompt:
      "LLM의 텍스트 디코딩 전략 중 탐욕적 탐색(Greedy Decoding), 빔 서치(Beam Search), 샘플링(Sampling)의 동작 차이를 비교하고, 생성 파라미터인 Temperature와 Top-P가 생성 결과의 다양성에 미치는 영향을 서술하시오.",
    options: [],
    answer: null,
    acceptedAnswers: [
      "Greedy",
      "Beam Search",
      "Sampling",
      "Temperature",
      "Top-P",
      "다양성"
    ],
    modelAnswer:
      "1) 동작 차이: Greedy Decoding은 매 시점 가장 확률이 높은 단일 토큰만을 탐욕적으로 선택하고, Beam Search는 상위 k개의 후보 시퀀스를 유지하며 누적 확률이 높은 최적의 문장을 탐색하며, Sampling은 확률 분포에 따라 무작위성을 부여하여 토큰을 표본 추출한다. 2) 파라미터 영향: Temperature를 높이면 확률 분포가 평평해져 더 다양하고 창의적인 토큰이 생성되고 낮추면 결정론적 출력이 된다. Top-P는 누적 확률이 p에 도달하는 상위 후보군만 동적으로 선별하여 샘플링 범위를 조절함으로써 문맥에 맞는 다양성을 제어한다.",
    rubricKeywords: [
      "Greedy(최고 확률 1개 선택), Beam Search(상위 k개 후보 시퀀스 유지), Sampling(확률적 무작위 표본 추출)",
      "Temperature 조절에 따른 확률 분포 평탄화 및 생성 다양성 변화",
      "Top-P(누적 확률 p 기반 후보군 동적 필터링)를 통한 다양성 제어"
    ],
    minLength: 20,
    explanation:
      "Greedy, Beam Search, Sampling의 토큰 선택 방식 차이와 Temperature(분포 첨도 조절), Top-P(누적 확률 기반 후보 필터링)가 생성 다양성에 미치는 영향을 서술합니다.",
    hint:
      "가장 높은 1개 선택(Greedy), k개 후보 유지(Beam), 확률적 추출(Sampling)의 차이와 Temperature/Top-P 파라미터의 역할을 기술하세요."
  },
  {
    id: "r2-es-030",
    conceptId: "clip-contrastive-and-grounded-sam-essay",
    difficulty: "medium",
    category: "멀티모달 및 비전 파운데이션 응용",
    questionType: "essay",
    prompt:
      "CLIP 모델의 대조 학습(Contrastive Learning) 목적함수 동작 원리를 서술하고, Grounding DINO와 SAM을 결합하여 텍스트로부터 픽셀 마스크를 자동 추출하는 Grounded-SAM 파이프라인의 연계 동작 과정을 서술하시오.",
    options: [],
    answer: null,
    acceptedAnswers: [
      "대조 학습",
      "양성 페어",
      "음성 페어",
      "Grounding DINO",
      "SAM",
      "바운딩 박스",
      "마스크"
    ],
    modelAnswer:
      "1) CLIP의 대조 학습은 N x N 배치에서 실제 일치하는 주대각선의 양성 페어가 비대각선의 음성 페어보다 높은 유사도를 갖도록 이미지 및 텍스트 양방향 대칭 크로스엔트로피 손실을 최적화한다. 2) Grounded-SAM 파이프라인에서는 사용자가 자연어 텍스트를 입력하면, 먼저 Grounding DINO가 오픈 보캡으로 해당 객체의 위치 바운딩 박스를 탐지한다. 3) 이 탐지된 바운딩 박스를 SAM에 프롬프트로 입력하여 해당 영역의 정밀 세그멘테이션 마스크를 완전 자동으로 생성한다.",
    rubricKeywords: [
      "양성 페어 유사도 최대화 및 음성 페어 유사도 최소화 (양방향 대칭 손실)",
      "Grounding DINO의 텍스트 기반 바운딩 박스 탐지",
      "탐지된 박스를 SAM 프롬프트로 전달하여 정밀 마스크 자동 생성"
    ],
    minLength: 20,
    explanation:
      "CLIP의 양성/음성 유사도 조절 대칭 손실 원리와 Grounding DINO(텍스트->박스) 및 SAM(박스->정밀 마스크) 연계 자동화 과정을 서술합니다.",
    hint:
      "CLIP 대조학습의 대각선(양성)/비대각선(음성) 유사도 조절 원리와 DINO의 박스 탐지 → SAM의 마스크 추출 연결 과정을 쓰세요."
  }
];

export const ALL_QUESTIONS = SSAFY_AI_MOCK_EXAM_ROUND_2;
