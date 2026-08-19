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

export const SSAFY_AI_MOCK_EXAM_ROUND_4: StudyQuestion[] = [
  // =========================================================================
  // [PART 1: 객관식 24문항] (정답 0, 1, 2, 3번 각 6개씩 25% 완벽 균등 분산)
  // =========================================================================

  // --- [머신러닝 기초 및 회귀 분석] (Q1 ~ Q4) ---
  {
    id: "r4-mc-001",
    conceptId: "feature-label-hypothesis-learning",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "아파트 가격 예측 모델을 지도학습으로 만든다고 할 때, '면적·방 개수·역과의 거리'와 '실제 거래 가격', 그리고 학습 과정의 관계를 가장 올바르게 설명한 것은?",
    options: [
      "면적·방 개수·역과의 거리는 입력 특징(Feature), 실제 거래 가격은 정답(Label)이며, 학습은 가설 공간에서 입력과 정답의 관계를 잘 설명하는 함수를 찾는 과정임",
      "면적·방 개수·역과의 거리가 정답(Label)이고 실제 거래 가격은 입력 특징(Feature)임",
      "지도학습에서는 정답 데이터가 없어야 하므로 실제 거래 가격을 학습에 사용하면 안 됨",
      "가설 공간은 학습에 사용한 아파트 데이터 행 자체만을 모아둔 집합을 의미함"
    ],
    answer: 0,
    explanation: "지도학습에서는 입력 변수들이 Feature, 예측하고자 하는 실제 값이 Label이 됩니다. 학습은 가능한 함수들의 집합인 가설 공간에서 손실을 줄이는 적절한 함수를 찾는 과정입니다.",
    hint: "무엇을 입력으로 주고 무엇을 정답으로 맞히는지, 그리고 모델이 어떤 함수를 찾는지 구분하세요."
  },
  {
    id: "r4-mc-002",
    conceptId: "ml-vs-traditional-programming-paradigm",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "전통적인 소프트웨어 프로그래밍(Traditional Programming)과 머신러닝(Machine Learning)의 문제 해결 패러다임 차이에 대한 설명으로 가장 올바른 것은?",
    options: [
      "전통적 프로그래밍은 데이터와 정답을 주면 규칙을 출력하고, 머신러닝은 규칙만 주면 데이터를 출력함",
      "전통적 프로그래밍은 사람이 직접 작성한 규칙과 데이터를 입력받아 결과를 내놓고, 머신러닝은 데이터와 결과를 바탕으로 모델이 규칙(함수)을 학습함",
      "머신러닝은 항상 수작업 if-else 하드코딩 규칙만으로 알고리즘을 제어함",
      "전통적 프로그래밍과 머신러닝은 데이터 입력 구조와 학습 메커니즘이 완전히 동일함"
    ],
    answer: 1,
    explanation: "전통적 프로그래밍은 '규칙(코드) + 데이터 → 결과' 형태인 반면, 머신러닝은 '데이터 + 결과(정답) → 모델(규칙)'을 스스로 학습하는 패러다임입니다.",
    hint: "규칙을 사람이 직접 작성하는지, 데이터로부터 기계가 학습하는지의 차이를 생각하세요."
  },
  {
    id: "r4-mc-003",
    conceptId: "r2-rse-regression-evaluation",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "회귀 모델의 대표적인 성능 지표인 결정계수(R^2)와 잔차표준오차(RSE)에 대한 설명으로 가장 올바른 것은?",
    options: [
      "R^2은 각 회귀계수의 p-value를 모두 더한 값이고, RSE는 독립변수 개수를 나타냄",
      "R^2과 RSE는 모두 분류 정확도를 나타내므로 값이 클수록 항상 좋은 모델임",
      "R^2은 모델이 종속변수의 변동을 얼마나 설명하는지 나타내고, RSE는 실제값과 회귀선 사이에 남는 잔차의 전형적인 크기를 나타냄",
      "R^2이 0에 가까울수록 설명력이 높고 RSE가 클수록 예측 오차가 작다는 뜻임"
    ],
    answer: 2,
    explanation: "R^2은 회귀 모델의 설명력을 나타내며 일반적으로 클수록 설명력이 높습니다. RSE는 모델이 설명하지 못한 잔차의 전형적인 크기를 나타내므로 작을수록 오차가 작다고 볼 수 있습니다.",
    hint: "하나는 설명력, 다른 하나는 남아 있는 오차의 크기를 나타냅니다."
  },
  {
    id: "r4-mc-004",
    conceptId: "multiple-regression-variable-addition-tradeoff",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "다중선형회귀 모델에 새로운 설명변수를 계속 추가할 때 기대할 수 있는 장점과 주의점의 조합으로 가장 올바른 것은?",
    options: [
      "변수를 추가할수록 모델이 무조건 단순해지고 해석도 항상 쉬워짐",
      "새로운 변수를 추가하면 기존 회귀계수는 절대 변하지 않으며 과적합 가능성도 사라짐",
      "설명변수를 많이 넣을수록 모든 변수의 영향력이 자동으로 인과관계로 확정됨",
      "유용한 변수를 추가하면 더 많은 정보를 반영해 설명력이 향상될 수 있지만, 불필요한 변수까지 추가하면 과적합 위험과 해석 복잡성이 커질 수 있음"
    ],
    answer: 3,
    explanation: "다중회귀는 여러 설명변수를 함께 고려할 수 있어 설명력을 높일 수 있지만, 불필요한 변수를 과도하게 추가하면 과적합 위험이 커지고 모델 해석도 복잡해질 수 있습니다.",
    hint: "변수를 늘리는 것이 항상 좋은 것은 아니며 정보 증가와 복잡도 증가가 함께 발생할 수 있습니다."
  },
  {
    id: "r4-mc-005",
    conceptId: "onehot-vs-word-embedding-representation",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "원-핫 인코딩(One-hot Encoding) 대신 워드 임베딩(Word Embedding)을 사용하는 핵심 이유로 가장 올바른 것은?",
    options: [
      "단어를 밀집된 연속 벡터로 표현하여 단어 사이의 의미적 유사성과 관계를 벡터 공간의 거리로 반영할 수 있기 때문에",
      "모든 단어를 반드시 1차원의 동일한 숫자 하나로 표현하여 단어 간 차이를 없애기 때문에",
      "문장 내 단어 순서를 별도의 학습 없이 완벽하게 보존하기 때문에",
      "어휘 수가 증가할수록 임베딩 벡터의 모든 차원이 자동으로 0이 되기 때문에"
    ],
    answer: 0,
    explanation: "원-핫 벡터는 서로 다른 단어가 독립적인 희소 벡터로 표현되어 의미적 유사성을 직접 나타내기 어렵습니다. 워드 임베딩은 밀집된 연속 벡터를 학습하여 의미가 비슷한 단어가 벡터 공간에서 가깝게 위치하도록 표현할 수 있습니다.",
    hint: "희소하고 서로 독립적인 원-핫 표현과 의미 관계를 반영하는 밀집 벡터 표현을 비교하세요."
  },
  {
    id: "r4-mc-006",
    conceptId: "rnn-structure-types-and-applications",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "순환 신경망(RNN)의 입출력 구조 유형과 대표적인 응용 태스크의 연결로 가장 올바른 것은?",
    options: [
      "One-to-Many 구조 - 시퀀스 텍스트를 입력받아 긍정/부정을 분류하는 감정 분석",
      "Many-to-One 구조 - 단어 시퀀스를 입력받아 마지막 시점의 은닉 상태로 전체 문장의 감정을 분류하는 감정 분석",
      "Many-to-Many 구조 - 단일 이미지를 입력받아 문장 캡션을 순차 출력하는 이미지 캡셔닝",
      "One-to-One 구조 - 영어 문장을 입력받아 한국어 문장으로 순차 번역하는 기계 번역"
    ],
    answer: 1,
    explanation: "Many-to-One 구조는 텍스트 시퀀스(Many)를 입력받아 마지막 은닉 상태를 바탕으로 단일 라벨(One)을 분류하는 감정 분석에 사용됩니다.",
    hint: "단어 여러 개(Many)가 들어가서 하나의 분류 결과(One)를 내놓는 구조를 찾으세요."
  },
  {
    id: "r4-mc-007",
    conceptId: "transformer-positional-encoding-necessity",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "트랜스포머의 Self-Attention 연산 전에 입력 단어 임베딩에 위치 인코딩(Positional Encoding)을 더해주어야 하는 결정적 이유는?",
    options: [
      "어텐션 연산 시 소프트맥스 함수의 계산량을 0으로 줄이기 위해",
      "모든 단어 벡터를 흑백 픽셀로 변환하여 메모리를 절감하기 위해",
      "Self-Attention 연산 자체는 단어의 순서(위치)에 상관없이 값의 유사도만 계산하므로, 토큰의 순서 정보를 모델에 주입하기 위해",
      "어휘 사전의 크기를 2배로 확장하기 위해"
    ],
    answer: 2,
    explanation: "Self-Attention은 순서에 구애받지 않고 모든 토큰 간 내적을 수행하는 집합 기반 연산이므로, 문맥 순서를 알기 위해 위치 인코딩을 더해 주어야 합니다.",
    hint: "내적 연산 자체에는 단어의 전후 순서 개념이 들어있지 않다는 점을 떠올려 보세요."
  },
  {
    id: "r4-mc-008",
    conceptId: "causal-language-modeling-objective",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "GPT와 같은 자기회귀(Auto-regressive) 언어 모델이 사전학습 시 사용하는 Causal Language Modeling(CLM) 목적함수의 동작 방식은?",
    options: [
      "문장 전체를 양방향으로 한 번에 보고 마스킹된 빈칸 단어를 채워 넣도록 학습함",
      "문장의 감정이 긍정인지 부정인지를 맞추는 지도학습 손실만을 최적화함",
      "단어 벡터들을 1차원으로 합산하여 문장 길이를 회귀 예측함",
      "이전 시점까지 주어진 단어 시퀀스를 조건으로 하여 바로 다음 시점에 등장할 토큰의 확률을 최대화하도록 학습함"
    ],
    answer: 3,
    explanation: "CLM은 이전 토큰들 $x_1, \\dots, x_{t-1}$이 주어졌을 때 다음 토큰 $x_t$가 등장할 조건부 확률을 최대화(교차 엔트로피 최소화)하도록 학습합니다.",
    hint: "과거 문맥을 바탕으로 다음에 올 단어를 예측하는 자기회귀 학습 방식입니다."
  },
  {
    id: "r4-mc-009",
    conceptId: "top-k-and-top-p-sampling-combination",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "LLM 텍스트 생성 시 Top-k와 Top-p 샘플링을 결합하여 적용할 때의 일반적인 필터링 동작 방식은?",
    options: [
      "확률이 높은 상위 k개의 토큰 후보를 먼저 선별한 후, 그 안에서 누적 확률이 p에 도달하는 토큰들만 다시 압축하여 샘플링함",
      "확률이 가장 낮은 하위 k개 토큰과 하위 p% 토큰만을 골라 무작위 추출함",
      "모든 토큰의 확률을 동일하게 1/k로 만든 뒤 무작위 선택함",
      "생성되는 문장의 글자 수를 정확히 k개와 p개 사이로 고정함"
    ],
    answer: 0,
    explanation: "먼저 확률 상위 k개 토큰으로 후보군을 좁힌 뒤, 그 후보들 중에서 누적 확률이 p를 만족하는 유효 집합을 동적으로 추출하여 샘플링합니다.",
    hint: "상위 k개로 후보를 제한한 뒤 누적 확률 p로 다시 유효 후보를 정제하는 2단계 필터링입니다."
  },
  {
    id: "r4-mc-010",
    conceptId: "llm-as-judge-evaluation-usecase",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "정답 문장이 하나로 정해져 있지 않은 요약·스토리 생성 결과를 '일관성, 유창성, 관련성'처럼 여러 기준으로 평가하려 할 때 강의자료에서 소개한 방법으로 가장 적절한 것은?",
    options: [
      "출력 문장의 글자 수만 세어 길이가 긴 모델을 항상 더 우수하다고 판단함",
      "평가할 태스크와 생성 텍스트, 평가 기준을 거대 언어 모델에 제공하여 점수와 평가 결과를 얻는 LLM-as-Judge(G-Eval) 방식을 사용함",
      "정답이 없더라도 모든 생성 문장을 Accuracy 하나만으로 평가함",
      "이미지 분류용 CNN의 마지막 Softmax 확률을 텍스트 품질 점수로 그대로 사용함"
    ],
    answer: 1,
    explanation: "정답이 명확하지 않은 생성 태스크에서는 단순 일치도만으로 품질을 평가하기 어렵습니다. 강의자료에서는 태스크, 평가 대상 텍스트, 평가 기준을 LLM에 제공해 생성 텍스트를 평가하는 LLM-as-Judge(G-Eval) 방식을 소개합니다.",
    hint: "사람 평가자처럼 여러 품질 기준을 보고 생성 결과를 채점하도록 LLM 자체를 평가자로 활용하는 방식입니다."
  },

  // --- [CNN 및 대표 비전 아키텍처] (Q11 ~ Q16) ---
  {
    id: "r4-mc-011",
    conceptId: "stride-effect-on-feature-map-and-flops",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "합성곱 계층에서 스트라이드(Stride)를 1에서 2로 늘렸을 때 출력 특징 맵의 해상도 및 연산량 변화로 가장 올바른 것은?",
    options: [
      "출력 특징 맵의 가로세로 해상도가 2배 커지고 연산량도 4배 증가함",
      "특징 맵의 채널 수가 2배로 증가하고 연산량에는 변화가 없음",
      "가로세로 공간 해상도가 약 절반(1/2)으로 줄어들며, 출력 화소 수가 약 1/4로 감소하여 연산량도 크게 줄어듦",
      "가중치 파라미터 개수가 정확히 절반으로 감소함"
    ],
    answer: 2,
    explanation: "스트라이드가 2가 되면 보폭이 2배로 커져 가로세로 출력이 각각 1/2로 다운샘플링되고, 총 출력 화소 면적이 1/4로 줄어 연산량이 대폭 감소합니다.",
    hint: "필터가 이동하는 보폭이 커질 때 출력 지도 가로세로 크기와 총 화소 수의 변화를 생각하세요."
  },
  {
    id: "r4-mc-012",
    conceptId: "alexnet-vs-vggnet-filter-architecture",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "AlexNet과 VGGNet의 구조적 차이점에 대한 설명 중 가장 올바른 것은?",
    options: [
      "AlexNet은 3x3 필터만 단일하게 사용했고, VGGNet은 11x11 필터를 주로 사용함",
      "AlexNet은 지름길 연결을 사용했고, VGGNet은 지름길 연결을 완전히 배제함",
      "AlexNet은 완전 연결 계층이 없었고, VGGNet에서 완전 연결 계층이 처음 도입됨",
      "AlexNet은 11x11, 5x5 등 다양한 크기의 대형 필터를 혼용했으나, VGGNet은 3x3 소형 필터만을 깊게 중첩하여 망을 구성함"
    ],
    answer: 3,
    explanation: "AlexNet은 초반에 11x11, 5x5 대형 필터를 사용했으나, VGGNet은 3x3 필터를 여러 개 쌓아 파라미터를 줄이고 비선형성을 강화하는 설계를 정립했습니다.",
    hint: "대형 필터 혼용 구조에서 3x3 단일 규격 소형 필터 중첩 구조로의 변화를 확인하세요."
  },
  {
    id: "r4-mc-013",
    conceptId: "resnet-gradient-highway-formula",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "ResNet 잔차 블록 H(x) = F(x) + x 의 역전파 미분식 dH/dx = dF/dx + 1 에서, 우변의 '+ 1' 항이 갖는 아키텍처적 의미는?",
    options: [
      "상위 계층의 오차 기울기가 가중치 계수를 거치지 않고 입력 x 쪽으로 최소 1만큼 직접 전달되어 깊은 망에서도 기울기 소실을 방지함",
      "신경망의 출력 활성화 값을 무조건 1.0으로 고정하여 정규화함",
      "역전파 계산 시 모든 가중치 기울기를 1씩 증가시켜 학습 속도를 100배 가속함",
      "손실 함수의 값을 항상 양수로 유지해 주는 편향 상수 역할을 함"
    ],
    answer: 0,
    explanation: "미분식의 +1 항 덕분에 가중치 곱셈(dF/dx)이 0에 수렴하더라도 상위 계층의 오차 기울기가 이전 계층으로 막힘없이 직접 전달됩니다.",
    hint: "덧셈 경로 미분 시 생기는 1이라는 상수가 오차 기울기 전달에 미치는 영향을 생각하세요."
  },
  {
    id: "r4-mc-014",
    conceptId: "mobilenet-pointwise-conv-role",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "MobileNet의 Depthwise Separable Convolution에서 두 번째 단계인 Pointwise Convolution(1x1 Conv)의 핵심 역할은?",
    options: [
      "공간 해상도를 절반으로 줄이는 다운샘플링 연산을 전담함",
      "Depthwise 계층에서 채널별로 독립 분리 처리된 특징들을 1x1 필터로 선형 결합하고 원하는 출력 채널 수로 매핑함",
      "모든 채널의 특징 맵을 흑백 단일 채널로 강제 통합함",
      "가중치 파라미터 없이 윈도우 내 최대값을 추출함"
    ],
    answer: 1,
    explanation: "Depthwise 계층은 채널 간 상호작용 없이 공간 연산만 하므로, 뒤이어 1x1 Pointwise Conv를 통해 채널 간 정보를 결합하고 출력 채널 차원을 조절합니다.",
    hint: "채널별로 분리된 정보들을 하나로 엮어 새로운 채널들로 결합해 주는 역할을 떠올려 보세요."
  },
  {
    id: "r4-mc-015",
    conceptId: "vit-cls-token-purpose",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "Vision Transformer(ViT)에서 이미지 패치 임베딩 시퀀스 맨 앞에 학습 가능한 클래스 토큰([CLS])을 추가하여 사용하는 주된 목적은?",
    options: [
      "이미지의 해상도를 2배로 업샘플링하기 위해",
      "위치 인코딩 벡터를 0으로 초기화하기 위해",
      "모든 패치 토큰들과 Self-Attention을 수행하여 이미지 전체를 아우르는 전역 표현을 모으고 최종 분류 헤드의 입력으로 사용하기 위해",
      "이미지 패치의 채널 수를 1개로 줄이기 위해"
    ],
    answer: 2,
    explanation: "[CLS] 토큰은 트랜스포머 계층을 거치며 모든 패치와 상호작용하여 이미지 전역 정보를 요약하며, 이 토큰의 최종 출력이 MLP 분류 헤드로 들어갑니다.",
    hint: "모든 패치의 정보를 취합하여 이미지 전체의 대표 분류 벡터로 쓰기 위함입니다."
  },
  {
    id: "r4-mc-016",
    conceptId: "conv-filter-channel-depth-rule",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "3채널 RGB 입력 이미지에 3x3 크기의 합성곱 필터를 적용할 때, 단일 필터 1개의 가중치 텐서 형상(Depth x Height x Width)에 대한 규칙으로 올바른 것은?",
    options: [
      "필터의 깊이는 입력 채널 수와 무관하게 항상 1이어야 함",
      "필터의 가로세로 크기는 항상 입력 이미지의 가로세로 크기와 같아야 함",
      "필터의 깊이는 항상 출력 채널 수와 동일하게 설정되어야 함",
      "단일 합성곱 필터의 깊이(Channel Depth)는 입력 데이터의 채널 수(3)와 반드시 동일해야 함 (3x3x3)"
    ],
    answer: 3,
    explanation: "합성곱 필터는 입력 채널 전체에 걸쳐 3차원 부피 연산을 수행하므로, 필터 1개의 채널 깊이는 항상 입력 채널 수 C_in과 일치해야 합니다.",
    hint: "필터가 입력 데이터의 모든 채널을 한 번에 훑으며 계산하기 위한 채널 깊이 일치 규칙입니다."
  },

  // --- [시각-언어 모델(VLM) 및 멀티모달 정합] (Q17 ~ Q20) ---
  {
    id: "r4-mc-017",
    conceptId: "clip-model-known-limitations",
    difficulty: "medium",
    category: "시각-언어 모델(VLM) 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "OpenAI의 CLIP 모델이 가진 구조적 한계점에 대한 설명으로 가장 올바른 것은?",
    options: [
      "이미지 전역 임베딩 정합 중심이어서 객체의 정밀 바운딩 박스 좌표 검출이나 픽셀 마스크 분할, 복잡한 공간 관계 및 카운팅 인식에 취약함",
      "새로운 카테고리의 텍스트 라벨이 들어오면 제로샷 분류가 완전히 불가능함",
      "비전 인코더와 텍스트 인코더가 모두 1차원 합성곱으로만 구성되어 있음",
      "인터넷 웹 데이터셋을 학습에 전혀 활용할 수 없음"
    ],
    answer: 0,
    explanation: "CLIP은 이미지 1개와 텍스트 1개를 단일 벡터로 매핑하는 대조학습 구조여서, 이미지 내 세부 위치 좌표(Box/Mask)나 복잡한 공간 관계 파악에는 한계가 있습니다.",
    hint: "전역 이미지-텍스트 유사도 매칭 방식이 세밀한 객체 위치 파악에서 겪는 한계를 생각하세요."
  },
  {
    id: "r4-mc-018",
    conceptId: "siglip-sigmoid-saturation-negative-pairs",
    difficulty: "medium",
    category: "시각-언어 모델(VLM) 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "SigLIP이 CLIP의 Softmax 기반 대조학습과 달리 Sigmoid 기반 손실함수를 사용할 때, 이미 충분히 유사도가 낮아진 음성 페어에 대한 학습 영향이 제한되는 이유로 가장 적절한 것은?",
    options: [
      "음성 페어의 임베딩을 학습 시작 전에 모두 삭제하기 때문에",
      "Sigmoid 함수가 충분히 작은 로짓 구간에서 포화되어 이미 잘 분리된 음성 페어의 추가 손실·기울기 영향이 작아질 수 있기 때문에",
      "모든 음성 페어의 라벨을 +1로 바꾸어 양성 페어처럼 학습하기 때문에",
      "이미지 인코더와 텍스트 인코더가 동일한 가중치를 공유하기 때문에"
    ],
    answer: 1,
    explanation: "SigLIP은 각 이미지-텍스트 쌍을 Sigmoid 기반으로 독립적으로 평가합니다. 충분히 멀어진 음성 페어는 Sigmoid의 포화 영역에 들어가 추가로 더 멀리 밀어내려는 영향이 제한될 수 있어 노이즈가 포함된 음성 데이터에 비교적 강건하게 동작할 수 있습니다.",
    hint: "Sigmoid 출력이 0이나 1에 가까워질수록 변화량이 작아지는 포화 특성을 생각하세요."
  },
  {
    id: "r4-mc-019",
    conceptId: "imagebind-embedding-arithmetic-concept",
    difficulty: "medium",
    category: "시각-언어 모델(VLM) 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "ImageBind의 공통 임베딩 공간에서 수행할 수 있는 멀티모달 벡터 산술 연산(Embedding Arithmetic)의 예시로 가장 올바른 것은?",
    options: [
      "텍스트 파일의 용량(KB)과 이미지 파일의 해상도를 덧셈함",
      "오디오 파형의 주파수를 흑백 이미지의 픽셀 좌표로 뺄셈함",
      "새(Bird) 이미지 벡터에 파도 소리 오디오 벡터를 더하여 '바닷가에 있는 새' 이미지를 검색해 냄",
      "모든 모달리티 벡터를 0차원 스칼라로 압축하여 삭제함"
    ],
    answer: 2,
    explanation: "서로 다른 모달리티가 의미에 따라 단일 벡터 공간에 정렬되어 있으므로, '시각 피사체 + 청각 배경' 벡터 덧셈으로 복합 의미를 가진 결과를 검색할 수 있습니다.",
    hint: "시각적 개체 벡터와 청각적 환경 벡터를 더해 두 의미가 결합된 결과를 찾는 원리입니다."
  },
  {
    id: "r4-mc-020",
    conceptId: "llava-visual-instruction-data-format",
    difficulty: "medium",
    category: "시각-언어 모델(VLM) 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "LLaVA 모델의 2단계 파인튜닝(Visual Instruction Tuning)에서 모델을 학습시키기 위해 사용하는 데이터셋의 기본 구성 형태는?",
    options: [
      "단순 1000개 클래스의 원-핫 라벨 번호",
      "3D 포인트 클라우드 좌표와 C++ 소스 코드",
      "1차원 음성 주파수 스펙트로그램 신호",
      "이미지(Image), 사용자의 자연어 질문/명령 지시문(Instruction), 이에 대한 상세 답변(Response) 쌍"
    ],
    answer: 3,
    explanation: "시각 지시 튜닝은 이미지와 함께 '이 그림의 상황을 설명해줘' 같은 다양한 형태의 질문 지시문 및 정답 답변 대화 쌍으로 구성됩니다.",
    hint: "시각 정보와 대화형 질의응답이 결합된 멀티모달 데이터 포맷을 확인하세요."
  },

  // --- [VLM 변종 및 비전 파운데이션 모델] (Q21 ~ Q24) ---
  {
    id: "r4-mc-021",
    conceptId: "sam-supported-prompt-types",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "강의자료에서 소개한 SAM(Segment Anything Model)이 사용자의 의도에 따라 원하는 영역의 마스크를 추출하기 위해 받을 수 있는 프롬프트 입력의 조합으로 가장 올바른 것은?",
    options: [
      "클릭(Point), 박스(Box), 부분 세그먼트, 텍스트 등의 입력",
      "오디오 파형, MIDI 신호, 음성 스펙트로그램만 입력",
      "SQL 쿼리와 데이터베이스 테이블만 입력",
      "GPS 좌표와 자이로 센서 값만 입력"
    ],
    answer: 0,
    explanation: "강의자료에서는 SAM이 클릭, 박스, 부분 세그먼트, 텍스트 등 다양한 사용자 프롬프트를 받아 원하는 영역의 세그멘테이션 마스크를 생성할 수 있다고 설명합니다.",
    hint: "사용자가 이미지에서 대상을 가리키거나 범위를 지정하고, 경우에 따라 텍스트로 지시하는 입력 형태를 떠올려 보세요."
  },
  {
    id: "r4-mc-022",
    conceptId: "depth-anything-applications",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "Depth Anything v2가 예측하는 깊이 맵(Depth Map)을 직접 활용할 수 있는 응용 분야의 조합으로 강의자료와 가장 일치하는 것은?",
    options: [
      "문서 맞춤법 검사, 음성 합성, 스팸 메일 분류",
      "자율주행, 로봇 비전, 3D 복원",
      "데이터베이스 인덱스 생성, SQL 조인 최적화, 웹 크롤링",
      "텍스트 번역, 감정 분석, 토큰화"
    ],
    answer: 1,
    explanation: "강의자료에서는 Depth Anything v2의 깊이 맵 예측이 자율주행, 로봇 비전, 3D 복원 등 공간 구조와 거리를 이해해야 하는 다양한 작업에 활용될 수 있다고 설명합니다.",
    hint: "2D 영상으로부터 장면의 깊이와 3차원 구조 정보를 활용해야 하는 분야를 찾으세요."
  },
  {
    id: "r4-mc-023",
    conceptId: "sapiens-surface-normal-task-meaning",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "메타의 Sapiens 모델이 수행하는 4대 태스크 중 '표면 법선(Surface Normal) 추정'이 출력하는 정보의 의미는?",
    options: [
      "사람의 음성 높낮이를 나타내는 1차원 주파수 곡선",
      "사람이 착용한 옷의 브랜드 텍스트 레이블",
      "인체 표면 각 픽셀 지점에서의 3차원 기울기 방향 벡터(수직 벡터) 정보",
      "인체 내부 장기의 위치 좌표 목록"
    ],
    answer: 2,
    explanation: "표면 법선(Surface Normal) 추정은 인체 굴곡 표면의 각 지점이 3차원 공간에서 어느 방향을 향하고 있는지 수직 벡터(Normal vector)를 픽셀 단위로 추정합니다.",
    hint: "3차원 입체 표면의 각 지점이 바라보고 있는 수직 방향 벡터를 의미합니다."
  },
  {
    id: "r4-mc-024",
    conceptId: "anomalygpt-industrial-dialogue-value",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "제조업 특화 모델인 AnomalyGPT가 단순 불량 판정 분류기 대비 산업 현장에서 제공하는 실질적 가치는?",
    options: [
      "공장 설비의 기계적 모터를 물리적으로 자동 분해함",
      "생산 제품의 단가를 자동으로 50% 할인하여 결제함",
      "모든 검사 대상 부품을 무조건 불량품으로 자동 폐기함",
      "부품 이미지에서 결함의 유무 및 위치를 시각적으로 짚어내고 자연어 대화 인터페이스로 결함 상태를 설명해 줌"
    ],
    answer: 3,
    explanation: "단순 O/X 판정을 넘어 결함 부위의 위치와 형태적 특징을 시각적으로 제시하고 대화형으로 질의응답할 수 있어 현장 점검의 직관성을 높입니다.",
    hint: "결함의 위치 파악과 함께 대화형으로 결함 상태를 설명해 주는 역량입니다."
  },

  // =========================================================================
  // [PART 2: 단답형 4문항] (수치/개념 복합 요구)
  // =========================================================================
  {
    id: "r4-sa-025",
    conceptId: "ols-rss-and-multicollinearity-sa",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "short-answer",
    prompt: "선형회귀에서 최소제곱법(OLS)이 최소화하는 오차의 명칭과, 다중선형회귀에서 독립 변수들 사이에 강한 상관관계가 존재하여 회귀계수 추정이 불안정해지는 현상의 명칭을 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: [
      "잔차제곱합, 다중공선성",
      "RSS, 다중공선성",
      "Residual Sum of Squares, Multicollinearity",
      "잔차제곱합(RSS), 다중공선성"
    ],
    explanation: "OLS는 실제값과 예측값 사이의 잔차를 제곱해 더한 잔차제곱합(RSS)을 최소화합니다. 독립 변수들끼리 강하게 상관되어 회귀계수의 분산이 커지고 추정이 불안정해지는 현상은 다중공선성(Multicollinearity)입니다.",
    hint: "OLS의 목적함수 이름과 서로 비슷한 정보를 가진 독립 변수들 때문에 계수 추정이 불안정해지는 현상을 적으세요."
  },
  {
    id: "r4-sa-026",
    conceptId: "attention-matrix-shape-and-pe-sa",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "short-answer",
    prompt: "입력 시퀀스 길이가 N일 때 트랜스포머 Self-Attention에서 Q와 K의 점곱으로 생성되는 어텐션 스코어 행렬의 크기(가로x세로)와, 단어의 순서 정보를 주입하기 위해 임베딩에 더해주는 기법 명칭을 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["N x N, 위치 인코딩", "NxN, 위치 인코딩", "N x N, Positional Encoding", "N x N, 위치 임베딩"],
    explanation: "어텐션 스코어 행렬의 크기는 N x N 이며, 순서 정보를 주입하는 기법은 위치 인코딩(Positional Encoding)입니다.",
    hint: "시퀀스 길이 N에 따른 정사각 행렬 크기와 위치 인코딩 명칭을 적으세요."
  },
  {
    id: "r4-sa-027",
    conceptId: "pointwise-conv-dim-and-name-sa",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "short-answer",
    prompt: "112x112x64 입력 특징 맵에 1x1 커널 32필터의 합성곱을 적용했을 때 출력 특징 맵의 형태(C x H x W)와, 채널 간 정보를 결합하는 이 1x1 합성곱의 명칭을 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["32x112x112, 포인트와이즈 합성곱", "32x112x112, Pointwise Convolution", "32 x 112 x 112, 포인트와이즈 합성곱", "32x112x112, Pointwise Conv"],
    explanation: "공간 크기는 유지되고 채널만 변경되므로 32x112x112 이며, 1x1 채널 연산의 명칭은 Pointwise Convolution입니다.",
    hint: "채널이 32로 바뀐 C x H x W 형태와 포인트와이즈 합성곱 명칭을 적으세요."
  },
  {
    id: "r4-sa-028",
    conceptId: "sapiens-two-tasks-sa",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "short-answer",
    prompt: "메타의 Sapiens 모델이 수행하는 4대 인체 태스크 중 사람의 관절 뼈대 위치를 찾는 태스크와, 인체 표면의 각 지점별 3차원 기울기 벡터를 추정하는 태스크의 명칭을 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["포즈 추정, 표면 법선 추정", "Pose Estimation, Surface Normal Estimation", "포즈 추정, 표면 법선", "포즈 추정, 표면법선 추정"],
    explanation: "관절 위치를 찾는 태스크는 포즈 추정(Pose Estimation), 표면 기울기 벡터를 찾는 태스크는 표면 법선 추정(Surface Normal Estimation)입니다.",
    hint: "포즈 추정과 표면 법선 추정 명칭을 순서대로 적으세요."
  },

  // =========================================================================
  // [PART 3: 서술형 2문항]
  // =========================================================================
  {
    id: "r4-es-029",
    conceptId: "transformer-vs-rnn-parallelism-essay",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "essay",
    prompt: "순환 신경망(RNN)이 가진 순차 처리 한계와 비교하여 트랜스포머의 Self-Attention이 전체 문장을 병렬로 처리하는 원리를 서술하고, 장기 의존성(Long-term Dependency) 학습을 개선하는 방식을 서술하시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["순환 연결 제거", "병렬 처리", "Self-Attention", "장기 의존성", "직접 참조", "기울기 소실"],
    modelAnswer: "1) RNN은 이전 시점의 은닉 상태가 계산되어야 다음 시점을 계산할 수 있는 순차적 의존성 때문에 시퀀스 전체를 동시에 처리하기 어렵다. 반면 트랜스포머는 순환 연결을 사용하지 않고 위치 정보를 더한 뒤 Self-Attention을 통해 모든 토큰 사이의 관계를 행렬 연산으로 한 번에 계산할 수 있어 병렬 처리가 가능하다. 2) RNN은 멀리 떨어진 정보가 여러 시점을 순차적으로 거쳐 전달되면서 장기 의존성 학습이 어려울 수 있다. Self-Attention은 멀리 떨어진 토큰끼리도 직접 관계를 계산하여 정보 전달 경로를 짧게 만들기 때문에 장거리 문맥과 장기 의존성 학습을 크게 완화하고 개선할 수 있다.",
    rubricKeywords: [
      "RNN의 이전 은닉 상태에 따른 순차 처리 한계",
      "Self-Attention의 행렬 연산 기반 시퀀스 병렬 처리",
      "멀리 떨어진 토큰의 직접 참조를 통한 장기 의존성 학습 개선"
    ],
    minLength: 20,
    explanation: "RNN의 순차 계산 구조와 트랜스포머의 병렬 Self-Attention 구조를 비교하고, 멀리 떨어진 토큰도 직접 연결하여 정보 전달 경로를 줄이는 장점을 설명합니다.",
    hint: "이전 은닉 상태를 기다려야 하는 RNN과 모든 토큰 관계를 동시에 계산하는 Self-Attention을 비교하세요."
  },
  {
    id: "r4-es-030",
    conceptId: "clip-vs-siglip-loss-essay",
    difficulty: "medium",
    category: "시각-언어 모델 및 파운데이션 응용",
    questionType: "essay",
    prompt: "CLIP의 대조학습에서 N x N 유사도 행렬과 양방향 Softmax 대칭 손실을 사용하는 원리를 설명하고, SigLIP이 각 이미지-텍스트 쌍에 Sigmoid 손실을 적용하는 방식과 충분히 분리된 음성 페어에 대한 영향이 제한되는 이유를 비교하여 서술하시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["N x N", "주대각선", "양성 페어", "음성 페어", "대칭 손실", "SigLIP", "Sigmoid", "포화"],
    modelAnswer: "1) CLIP은 N개의 이미지와 N개의 텍스트 임베딩 사이의 유사도를 계산해 N x N 행렬을 만들고, 실제로 대응하는 주대각선 양성 페어의 유사도는 높고 비대각선 음성 페어의 유사도는 낮아지도록 Image-to-Text와 Text-to-Image 방향의 Softmax 크로스엔트로피 손실을 평균하여 학습한다. 2) SigLIP은 전체 후보를 하나의 Softmax 분포로 정규화하는 대신 각 이미지-텍스트 쌍을 z=+1인 양성 또는 z=-1인 음성으로 두고 Sigmoid 기반 손실을 적용한다. 이때 이미 유사도가 충분히 낮아진 음성 페어는 Sigmoid의 포화 영역에서 추가적인 손실과 기울기 영향이 작아질 수 있어, 불필요하게 계속 멀리 밀어내는 영향을 제한한다.",
    rubricKeywords: [
      "CLIP의 N x N 유사도 행렬과 대각선 양성/비대각선 음성 페어",
      "Image-to-Text 및 Text-to-Image 양방향 Softmax 대칭 손실",
      "SigLIP의 쌍별 Sigmoid 손실과 포화에 따른 충분히 분리된 음성 페어 영향 제한"
    ],
    minLength: 20,
    explanation: "CLIP의 배치 전체 Softmax 기반 대칭 대조학습과 SigLIP의 개별 쌍 Sigmoid 손실을 비교하고, Sigmoid 포화 특성이 이미 충분히 멀어진 음성 페어의 추가 영향을 줄이는 점을 설명합니다.",
    hint: "CLIP은 N x N 행렬의 대각선/비대각선을 Softmax로 비교하고, SigLIP은 각 쌍을 +1/-1로 독립 평가한다는 차이를 중심으로 쓰세요."
  }

];

export const ALL_QUESTIONS = SSAFY_AI_MOCK_EXAM_ROUND_4;
