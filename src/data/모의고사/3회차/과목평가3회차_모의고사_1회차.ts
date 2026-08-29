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
  hint?: string;
}

// SSAFY AI 과목평가 대비 60문항
// - 전 문항 4지선다 객관식
// - 제공된 60개 문제 토픽 순서와 1:1 대응
// - 정답 보기만 유독 길어지는 패턴을 완화
// - 정답에만 영문 괄호/출처 표시가 붙지 않도록 구성
// - answer는 0부터 시작하며 각 위치가 15개씩 균등 분포

export const QUESTION_BANK: Record<StudyDifficulty, StudyQuestion[]> = {
  easy: [
    {
      id: "mock-001-regression-error",
      conceptId: "regression-error-term",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "선형회귀식 Y = β0 + β1X + ε에서 ε가 의미하는 것은?",
      options: [
        "독립변수 X의 실제 값",
        "회귀계수 β1의 크기",
        "모델이 설명하지 못한 오차",
        "예측값 Y의 평균값"
      ],
      answer: 2,
      explanation: "ε는 회귀식이 설명하지 못한 변동을 나타내는 오차항입니다.",
      hint: "회귀선과 실제 관측값 사이에 남는 부분을 생각해보세요."
    },
    {
      id: "mock-002-kmeans-hierarchical",
      conceptId: "clustering-methods-comparison",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "K-means와 계층적 군집에 대한 설명으로 옳은 것은?",
      options: [
        "K-means는 덴드로그램을 만들고, 계층적 군집은 항상 K를 먼저 정한다.",
        "K-means와 계층적 군집은 모두 정답 레이블이 필요한 지도학습 방법이다.",
        "K-means는 K를 미리 정하고, 계층적 군집은 덴드로그램을 만들 수 있다.",
        "K-means는 중심점을 사용하지 않고, 계층적 군집만 중심점을 반복 갱신한다."
      ],
      answer: 2,
      explanation: "K-means는 K개의 중심을 기준으로 군집을 나누며, 계층적 군집은 단계적으로 군집을 결합하거나 분할해 계층 구조를 만듭니다.",
      hint: "K의 사전 지정 여부와 덴드로그램을 떠올려보세요."
    },
    {
      id: "mock-003-unsupervised-learning-cases",
      conceptId: "unsupervised-learning-applications",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "다음 중 비지도학습의 대표적인 활용 사례는?",
      options: [
        "주택 정보를 이용해 매매 가격 예측하기",
        "비슷한 구매 패턴의 고객을 군집으로 묶기",
        "이메일을 스팸과 정상으로 분류하기",
        "환자 기록으로 질병 여부를 판별하기"
      ],
      answer: 1,
      explanation: "군집화는 정답 레이블 없이 데이터의 유사한 패턴을 찾아 그룹으로 나누는 비지도학습입니다.",
      hint: "정답 레이블 없이 비슷한 데이터끼리 묶는 작업을 찾으세요."
    },
    {
      id: "mock-004-recall-calculation",
      conceptId: "recall-metric-calculation",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "실제 양성 100개 중 모델이 80개를 양성으로 맞히고 20개를 놓쳤다. 재현율은?",
      options: [
        "20%",
        "50%",
        "100%",
        "80%"
      ],
      answer: 3,
      explanation: "재현율 = TP / (TP + FN) = 80 / (80 + 20) = 80%입니다.",
      hint: "실제 양성 중에서 모델이 찾아낸 비율입니다."
    },
    {
      id: "mock-005-regression-problem-definition",
      conceptId: "regression-vs-classification",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "다음 중 회귀 문제에 해당하는 것은?",
      options: [
        "사진의 동물 종류를 구분하는 문제",
        "이메일의 스팸 여부를 판별하는 문제",
        "주택의 매매 가격을 예측하는 문제",
        "환자의 질병 여부를 분류하는 문제"
      ],
      answer: 2,
      explanation: "회귀는 가격, 온도처럼 연속적인 수치 값을 예측하는 문제입니다.",
      hint: "결과가 범주가 아니라 연속적인 숫자인 문제를 찾으세요."
    },
    {
      id: "mock-006-learning-rate-convergence",
      conceptId: "learning-rate-effects",
      difficulty: "easy",
      category: "딥러닝 기본 원리",
      questionType: "multiple-choice",
      prompt: "경사하강법에서 학습률이 지나치게 클 때 나타나기 쉬운 현상은?",
      options: [
        "가중치가 거의 변하지 않아 학습이 매우 느려진다.",
        "학습 데이터의 개수가 자동으로 증가한다.",
        "최적점을 지나치며 손실이 진동하거나 발산한다.",
        "모든 가중치가 항상 정확히 0으로 수렴한다."
      ],
      answer: 2,
      explanation: "학습률이 너무 크면 한 번의 갱신 폭이 커져 최적점을 지나치고 손실이 진동하거나 발산할 수 있습니다.",
      hint: "한 번에 너무 큰 보폭으로 내려가는 상황을 생각해보세요."
    },
    {
      id: "mock-007-multicollinearity",
      conceptId: "multicollinearity-concept",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "다중회귀에서 독립변수들 사이의 높은 상관관계로 회귀계수 해석이 불안정해지는 현상은?",
      options: [
        "과소적합",
        "다중공선성",
        "기울기 소실",
        "차원 축소"
      ],
      answer: 1,
      explanation: "독립변수끼리 강하게 상관되어 회귀계수 추정과 해석이 불안정해지는 현상을 다중공선성이라고 합니다.",
      hint: "여러 독립변수 사이의 강한 선형 관계를 뜻하는 용어입니다."
    },
    {
      id: "mock-008-precision-calculation",
      conceptId: "precision-metric-calculation",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "모델이 양성이라고 예측한 50개 중 실제 양성이 40개였다. 정밀도는?",
      options: [
        "80%",
        "20%",
        "50%",
        "100%"
      ],
      answer: 0,
      explanation: "정밀도 = TP / (TP + FP) = 40 / 50 = 80%입니다.",
      hint: "양성이라고 예측한 것들 중 실제 양성의 비율입니다."
    },
    {
      id: "mock-009-classification-problem-definition",
      conceptId: "classification-definition",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "다음 중 분류 문제에 해당하는 것은?",
      options: [
        "내일의 기온을 수치로 예측하는 문제",
        "이메일의 스팸 여부를 판별하는 문제",
        "아파트의 매매 가격을 예측하는 문제",
        "자동차의 연비를 수치로 예측하는 문제"
      ],
      answer: 1,
      explanation: "분류는 입력을 미리 정의된 범주 중 하나로 나누는 문제입니다.",
      hint: "결과가 연속적인 숫자가 아니라 범주인 문제를 찾으세요."
    },
    {
      id: "mock-010-activation-function-role",
      conceptId: "non-linear-activation-role",
      difficulty: "easy",
      category: "딥러닝 기본 원리",
      questionType: "multiple-choice",
      prompt: "신경망에서 ReLU 같은 비선형 활성화 함수를 사용하는 핵심 이유는?",
      options: [
        "가중치를 자동으로 정수형으로 바꾸기 위해",
        "학습 데이터의 개수를 자동으로 늘리기 위해",
        "복잡한 비선형 관계를 학습할 수 있게 하기 위해",
        "모든 뉴런의 출력을 같은 값으로 만들기 위해"
      ],
      answer: 2,
      explanation: "비선형 활성화가 없으면 여러 선형 계층을 쌓아도 전체는 하나의 선형 변환과 같습니다.",
      hint: "깊은 신경망이 단순 선형 모델을 넘어서는 이유를 생각해보세요."
    },
    {
      id: "mock-011-rlhf-human-feedback",
      conceptId: "rlhf-core-objective",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "RLHF를 사용하는 주된 목적은?",
      options: [
        "인간의 선호에 맞게 모델의 응답을 정렬하기 위해",
        "모델의 파라미터 수를 자동으로 줄이기 위해",
        "외부 문서를 검색해 입력에 추가하기 위해",
        "이미지의 해상도를 높여 생성하기 위해"
      ],
      answer: 0,
      explanation: "RLHF는 인간의 선호 피드백을 활용해 모델이 더 유용하고 적절한 응답을 생성하도록 정렬하는 방법입니다.",
      hint: "Human Feedback이 무엇을 모델에 반영하는지 생각해보세요."
    },
    {
      id: "mock-012-rlhf-training-steps",
      conceptId: "rlhf-step-by-step-pipeline",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "일반적인 RLHF 학습 순서로 옳은 것은?",
      options: [
        "보상 모델 학습 → SFT → 강화학습",
        "강화학습 → 보상 모델 학습 → SFT",
        "SFT → 강화학습 → 보상 모델 학습",
        "SFT → 보상 모델 학습 → 강화학습"
      ],
      answer: 3,
      explanation: "전통적인 RLHF 흐름은 지도 미세조정, 선호 데이터 기반 보상 모델 학습, 강화학습을 통한 정책 최적화 순서입니다.",
      hint: "먼저 모범 답변을 학습한 뒤 선호를 점수화하고 정책을 조정합니다."
    },
    {
      id: "mock-013-gradient-descent-direction",
      conceptId: "gradient-descent-update-rule",
      difficulty: "easy",
      category: "딥러닝 기본 원리",
      questionType: "multiple-choice",
      prompt: "손실을 줄이기 위한 경사하강법의 가중치 갱신 방향은?",
      options: [
        "손실 함수 기울기와 같은 방향",
        "손실 함수 기울기의 반대 방향",
        "현재 가중치가 큰 방향",
        "무조건 양의 값이 되는 방향"
      ],
      answer: 1,
      explanation: "기울기는 손실이 가장 빠르게 증가하는 방향이므로, 경사하강법은 그 반대 방향으로 이동합니다.",
      hint: "산에서 아래로 내려가는 방향을 생각해보세요."
    },
    {
      id: "mock-014-one-hot-encoding-limits",
      conceptId: "one-hot-encoding-limitations",
      difficulty: "easy",
      category: "자연어 처리 및 임베딩",
      questionType: "multiple-choice",
      prompt: "단어를 원-핫 인코딩으로 표현할 때의 대표적인 한계는?",
      options: [
        "단어가 많아져도 벡터 차원이 항상 1이다.",
        "모든 단어가 동일한 벡터로 표현된다.",
        "단어 사이의 의미적 유사성을 표현하기 어렵다.",
        "단어를 숫자 형태로 표현할 수 없다."
      ],
      answer: 2,
      explanation: "원-핫 벡터는 서로 직교하므로 단어 간 의미적 가까움이나 유사성을 직접 나타내지 못합니다.",
      hint: "고양이와 강아지가 의미상 비슷하다는 정보를 표현할 수 있는지 생각해보세요."
    },
    {
      id: "mock-015-rnn-recurrent-structure",
      conceptId: "rnn-hidden-state-recurrence",
      difficulty: "easy",
      category: "자연어 처리 및 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "RNN의 핵심 구조적 특징은?",
      options: [
        "각 시점을 완전히 독립적으로 처리한다.",
        "이미지 패치를 한 번에 모두 비교한다.",
        "매 시점마다 새로운 가중치를 생성한다.",
        "이전 시점의 은닉 상태를 다음 시점에 전달한다."
      ],
      answer: 3,
      explanation: "RNN은 이전 시점의 은닉 상태를 현재 입력과 함께 사용해 시퀀스 정보를 이어갑니다.",
      hint: "이전 시점의 정보가 다음 시점으로 어떻게 전달되는지 보세요."
    },
    {
      id: "mock-016-1x1-conv-computation",
      conceptId: "1x1-convolution-computation",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "8×8 크기, 입력 채널 16, 출력 채널 32인 피처맵에 1×1 Convolution을 적용한다. 곱셈 연산 횟수는?",
      options: [
        "32,768회",
        "8,192회",
        "16,384회",
        "65,536회"
      ],
      answer: 0,
      explanation: "곱셈 횟수는 8×8×16×32 = 32,768회입니다.",
      hint: "공간 크기 × 입력 채널 × 출력 채널을 계산하세요."
    },
    {
      id: "mock-017-cnn-fc-params",
      conceptId: "cnn-fc-parameter-calculation",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "Bias를 제외할 때, 3×3 Conv의 입력 채널이 3, 출력 채널이 8이고 FC가 입력 100개와 출력 10개를 연결한다. 파라미터 수로 옳은 것은?",
      options: [
        "Conv 72개, FC 1,000개",
        "Conv 216개, FC 1,000개",
        "Conv 216개, FC 100개",
        "Conv 72개, FC 100개"
      ],
      answer: 1,
      explanation: "Conv는 3×3×3×8=216개, FC는 100×10=1,000개의 가중치를 가집니다.",
      hint: "Conv는 커널×입력채널×출력채널, FC는 입력×출력을 계산하세요."
    },
    {
      id: "mock-018-sentence-embedding-cosine-sim",
      conceptId: "sentence-embedding-cosine-similarity",
      difficulty: "easy",
      category: "자연어 처리 및 임베딩",
      questionType: "multiple-choice",
      prompt: "두 문장의 임베딩 벡터가 의미적으로 얼마나 비슷한지 비교할 때 자주 사용하는 척도는?",
      options: [
        "코사인 유사도",
        "정확도",
        "재현율",
        "평균제곱오차"
      ],
      answer: 0,
      explanation: "코사인 유사도는 두 벡터 사이의 각도를 이용해 방향의 유사성을 측정합니다.",
      hint: "임베딩 벡터의 방향이 얼마나 비슷한지를 비교하는 척도입니다."
    },
    {
      id: "mock-019-text-foundation-model",
      conceptId: "text-foundation-model-concept",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "텍스트 파운데이션 모델의 특징으로 가장 적절한 것은?",
      options: [
        "하나의 정해진 분류 문제에만 사용할 수 있다.",
        "대규모 텍스트로 사전학습되어 여러 작업에 활용된다.",
        "외부 규칙만으로 동작하며 학습 과정이 필요 없다.",
        "이미지 픽셀만 입력받아 시각 작업만 수행한다."
      ],
      answer: 1,
      explanation: "텍스트 파운데이션 모델은 대규모 텍스트로 범용 언어 능력을 학습하고 다양한 다운스트림 작업에 적응할 수 있습니다.",
      hint: "Foundation이라는 말처럼 여러 작업의 기반이 되는 모델입니다."
    },
    {
      id: "mock-020-llm-agent-characteristics",
      conceptId: "llm-agent-characteristics",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "LLM Agent의 특성으로 가장 적절한 것은?",
      options: [
        "입력을 받으면 항상 한 번의 텍스트 응답만 생성한다.",
        "목표에 따라 계획하고 필요한 도구를 사용해 행동한다.",
        "외부 환경이나 도구와는 상호작용할 수 없다.",
        "계획이나 기억 없이 정해진 문장만 반복 출력한다."
      ],
      answer: 1,
      explanation: "LLM Agent는 단순 생성 모델을 넘어 목표, 계획, 기억, 도구 사용 등을 통해 환경과 상호작용할 수 있습니다.",
      hint: "단순 LLM보다 더 능동적으로 무엇을 할 수 있는지 생각해보세요."
    },
    {
      id: "mock-021-instruction-dataset-format",
      conceptId: "instruction-dataset-format",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "Instruction-tuning 데이터의 기본 구성으로 가장 적절한 것은?",
      options: [
        "원본 문서, 검색 점수, 문서 인덱스",
        "이미지 파일, 클래스 번호, 좌표 정보",
        "지시문, 입력 정보, 모범 응답",
        "센서 신호, 임계값, 하드웨어 주소"
      ],
      answer: 2,
      explanation: "Instruction-tuning은 모델이 지시를 따르도록 지시문과 입력, 기대 응답의 형태로 데이터를 구성합니다.",
      hint: "사용자의 지시와 그 지시에 맞는 답변 쌍을 생각해보세요."
    },
    {
      id: "mock-022-1x1-conv-channel-mixing",
      conceptId: "1x1-conv-features",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "Stride가 1인 1×1 Convolution의 특징으로 옳은 것은?",
      options: [
        "공간 크기만 절반으로 줄이고 채널 수는 항상 유지한다.",
        "모든 픽셀을 이진값으로 바꾸고 채널을 제거한다.",
        "공간 크기는 유지하며 채널 정보를 결합하거나 조절한다.",
        "입력 이미지를 회전시켜 방향 정보를 자동 보정한다."
      ],
      answer: 2,
      explanation: "1×1 Convolution은 각 공간 위치에서 채널 방향의 가중합을 계산해 채널을 혼합하거나 조절합니다.",
      hint: "가로·세로보다 채널 차원에 어떤 영향을 주는지 보세요."
    },
    {
      id: "mock-023-zero-shot-cot",
      conceptId: "zero-shot-cot",
      difficulty: "easy",
      category: "프롬프트 및 추론",
      questionType: "multiple-choice",
      prompt: "예시를 주지 않고 '단계별로 생각해보자' 같은 문구로 추론을 유도하는 방식은?",
      options: [
        "Few-shot CoT",
        "Knowledge Distillation",
        "Post-Training Quantization",
        "Zero-shot CoT"
      ],
      answer: 3,
      explanation: "Zero-shot CoT는 풀이 예시 없이 단계별 추론을 유도하는 프롬프팅 방식입니다.",
      hint: "예시가 없다는 점이 핵심입니다."
    },
    {
      id: "mock-024-ai-vs-ai-agent",
      conceptId: "ai-vs-ai-agent-difference",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "일반적인 AI 모델과 AI Agent의 차이로 가장 적절한 것은?",
      options: [
        "AI Agent는 학습된 모델을 전혀 사용하지 않고 규칙만 실행한다.",
        "일반 AI 모델만 외부 도구를 사용할 수 있고 Agent는 사용할 수 없다.",
        "AI Agent는 텍스트 입력을 받을 수 없고 센서 데이터만 처리한다.",
        "목표 달성을 위해 계획하고 도구·환경과 상호작용한다."
      ],
      answer: 3,
      explanation: "AI Agent는 목표를 중심으로 계획하고 행동하며 필요한 도구를 사용하는 능동적인 시스템입니다.",
      hint: "단순 응답 생성과 목표 지향적 행동의 차이를 보세요."
    },
    {
      id: "mock-025-quantization-features",
      conceptId: "quantization-basic-concept",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "Quantization의 특징으로 옳은 것은?",
      options: [
        "중요하지 않은 연결을 제거해 네트워크를 희소하게 만든다.",
        "큰 모델의 출력을 작은 모델이 따라 배우도록 학습한다.",
        "외부 문서를 검색해 모델의 입력 문맥에 추가한다.",
        "낮은 비트로 값을 표현해 메모리와 연산 비용을 줄인다."
      ],
      answer: 3,
      explanation: "양자화는 FP32나 FP16 값을 INT8, INT4 등 낮은 정밀도로 표현해 효율을 높이는 방법입니다.",
      hint: "값을 표현하는 비트 수를 줄이는 방법입니다."
    },
    {
      id: "mock-026-prompt-design-elements",
      conceptId: "prompt-design-structure",
      difficulty: "easy",
      category: "프롬프트 및 추론",
      questionType: "multiple-choice",
      prompt: "효과적인 프롬프트 디자인 방법으로 가장 적절한 것은?",
      options: [
        "목표, 필요한 문맥, 출력 형식을 구체적으로 알려준다.",
        "가능한 한 모호하게 작성해 모델이 임의로 해석하게 한다.",
        "중요한 조건을 숨기고 결과 형식도 지정하지 않는다.",
        "서로 충돌하는 지시를 여러 개 넣어 선택하게 한다."
      ],
      answer: 0,
      explanation: "프롬프트는 역할, 목표, 문맥, 제약, 출력 형식 등을 명확히 줄수록 원하는 응답을 얻기 쉽습니다.",
      hint: "모호함을 줄이는 방향을 선택하세요."
    },
    {
      id: "mock-027-knowledge-distillation",
      conceptId: "knowledge-distillation-concept",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "Knowledge Distillation의 핵심 원리는?",
      options: [
        "작은 가중치를 모두 제거해 네트워크 연결 수를 줄인다.",
        "가중치를 낮은 비트 정수로 바꾸어 메모리를 줄인다.",
        "모델에 외부 검색 결과를 추가해 지식을 보완한다.",
        "큰 교사 모델의 출력 정보를 작은 학생 모델이 따라 학습한다."
      ],
      answer: 3,
      explanation: "지식 증류는 Teacher의 예측 분포나 중간 표현을 Student가 학습하도록 해 작은 모델의 성능을 높입니다.",
      hint: "교사와 학생의 관계를 떠올려보세요."
    },
    {
      id: "mock-028-multimodal-video-generation",
      conceptId: "multimodal-video-generation",
      difficulty: "easy",
      category: "멀티모달 및 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "텍스트 설명이나 정지 이미지를 조건으로 여러 프레임의 영상을 만드는 기술은?",
      options: [
        "텍스트 감정 분류",
        "이미지 객체 분류",
        "멀티모달 비디오 생성",
        "음성 단어 인식"
      ],
      answer: 2,
      explanation: "멀티모달 비디오 생성은 텍스트나 이미지 등의 조건을 사용해 시간적으로 이어지는 영상 프레임을 생성합니다.",
      hint: "입력은 여러 모달리티일 수 있고 출력은 동영상입니다."
    },
    {
      id: "mock-029-cbow-vs-skipgram",
      conceptId: "word2vec-cbow-vs-skipgram",
      difficulty: "easy",
      category: "자연어 처리 및 임베딩",
      questionType: "multiple-choice",
      prompt: "CBOW와 Skip-gram의 관계를 올바르게 설명한 것은?",
      options: [
        "CBOW는 중심 단어로 주변 단어를, Skip-gram은 문장 감정을 예측한다.",
        "CBOW는 문장 전체를 생성하고, Skip-gram은 이미지 특징을 추출한다.",
        "CBOW와 Skip-gram은 모두 단어 빈도만 세며 임베딩은 학습하지 않는다.",
        "CBOW는 주변→중심, Skip-gram은 중심→주변 단어를 예측한다."
      ],
      answer: 3,
      explanation: "CBOW는 문맥에서 중심 단어를 예측하고, Skip-gram은 중심 단어에서 주변 문맥 단어를 예측합니다.",
      hint: "주변→중심과 중심→주변의 방향을 구분하세요."
    },
    {
      id: "mock-030-rnn-vanishing-gradient",
      conceptId: "rnn-vanishing-gradient-problem",
      difficulty: "easy",
      category: "자연어 처리 및 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "긴 시퀀스에서 RNN의 역전파 기울기가 점점 작아져 장기 의존성을 학습하기 어려워지는 현상은?",
      options: [
        "다중공선성",
        "과소적합",
        "등분산성",
        "기울기 소실"
      ],
      answer: 3,
      explanation: "시간축을 따라 반복적으로 미분값이 곱해지면서 기울기가 0에 가까워지는 현상을 기울기 소실이라고 합니다.",
      hint: "Gradient가 점점 사라지는 현상입니다."
    },
    {
      id: "mock-031-lstm-state-structure",
      conceptId: "lstm-cell-state-gates",
      difficulty: "easy",
      category: "자연어 처리 및 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "LSTM이 장기 정보를 유지하기 위해 사용하는 핵심 구조는?",
      options: [
        "셀 상태와 게이트 구조",
        "패치와 위치 임베딩 구조",
        "쿼리와 키의 검색 구조",
        "교사와 학생의 증류 구조"
      ],
      answer: 0,
      explanation: "LSTM은 셀 상태를 장기 정보 통로로 사용하고 여러 게이트로 정보의 유지와 갱신을 제어합니다.",
      hint: "RNN에 장기 기억 통로가 추가된 구조를 생각해보세요."
    },
    {
      id: "mock-032-pretrain-vs-finetune",
      conceptId: "pretraining-vs-finetuning",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "사전학습과 파인튜닝의 관계를 올바르게 설명한 것은?",
      options: [
        "사전학습 후 파인튜닝으로 특정 작업이나 도메인에 적응한다.",
        "파인튜닝으로 범용 지식을 익힌 뒤 사전학습으로 특정 작업에 적응한다.",
        "사전학습과 파인튜닝은 모두 모델 가중치를 낮은 비트로 바꾸는 과정이다.",
        "사전학습을 한 모델은 이후 특정 데이터로 추가 학습할 수 없다."
      ],
      answer: 0,
      explanation: "사전학습은 넓은 데이터에서 일반적인 표현을 배우고, 파인튜닝은 특정 목적에 맞게 모델을 추가 조정합니다.",
      hint: "일반 능력 학습과 특정 목적 적응의 순서를 보세요."
    },
    {
      id: "mock-033-max-pooling",
      conceptId: "max-pooling-downsampling",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "CNN에서 Max Pooling이 수행하는 동작은?",
      options: [
        "지역 영역에서 평균값을 선택해 채널 수를 늘린다.",
        "지역 영역에서 최댓값을 선택해 공간 크기를 줄인다.",
        "모든 픽셀 값을 더해 공간 크기를 두 배로 늘린다.",
        "채널별 가중합으로 출력 채널 수만 변경한다."
      ],
      answer: 1,
      explanation: "Max Pooling은 일정 윈도우 안의 최댓값을 선택해 특징을 남기면서 공간 해상도를 줄이는 연산입니다.",
      hint: "이름 그대로 지역의 최대값을 선택합니다."
    },
    {
      id: "mock-034-cnn-receptive-field",
      conceptId: "cnn-receptive-field",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "CNN에서 한 출력 뉴런에 영향을 미치는 입력 이미지의 영역을 무엇이라고 하는가?",
      options: [
        "수용영역",
        "잠재공간",
        "문맥창",
        "임베딩 차원"
      ],
      answer: 0,
      explanation: "수용영역은 특정 뉴런의 출력에 영향을 줄 수 있는 입력 공간의 범위를 뜻합니다.",
      hint: "한 뉴런이 입력 이미지에서 바라보는 범위입니다."
    },
    {
      id: "mock-035-feature-map-memory",
      conceptId: "feature-map-memory-calculation",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "64×64×32 크기의 Feature Map을 FP32로 저장한다. FP32가 값 하나당 4바이트라면 필요한 메모리는?",
      options: [
        "128 KB",
        "256 KB",
        "1,024 KB",
        "512 KB"
      ],
      answer: 3,
      explanation: "64×64×32=131,072개 값이며, 131,072×4=524,288바이트이므로 512 KB입니다.",
      hint: "전체 원소 수에 원소당 4바이트를 곱하세요."
    },
    {
      id: "mock-036-foundation-model-service-dev",
      conceptId: "foundation-model-application-dev",
      difficulty: "easy",
      category: "파운데이션 모델 서비스",
      questionType: "multiple-choice",
      prompt: "기존 파운데이션 모델을 활용해 서비스를 개발하는 방법으로 가장 적절한 것은?",
      options: [
        "항상 처음부터 초대형 모델을 새로 사전학습해야 한다.",
        "모든 외부 지식과 API를 차단하고 모델만 단독 사용한다.",
        "파운데이션 모델 대신 모든 기능을 규칙문으로만 작성한다.",
        "기반 모델에 프롬프트, RAG, 도구 연동 등을 결합한다."
      ],
      answer: 3,
      explanation: "실무에서는 기존 기반 모델에 프롬프트, 검색, 도구 호출 등의 구성 요소를 결합해 효율적으로 서비스를 만듭니다.",
      hint: "이미 학습된 기반 모델을 어떻게 활용하는지 생각해보세요."
    },
    {
      id: "mock-037-vlm-training-procedure",
      conceptId: "vlm-training-procedure",
      difficulty: "easy",
      category: "멀티모달 및 VLM",
      questionType: "multiple-choice",
      prompt: "VLM이 이미지 정보와 언어 정보를 연결해 학습하는 기본 방식으로 가장 적절한 것은?",
      options: [
        "텍스트 모델을 제거하고 이미지 분류기만 독립적으로 학습한다.",
        "비전 인코더의 시각 특징을 연결 모듈로 LLM 입력 공간에 맞춰 정렬한다.",
        "이미지를 모두 문자 코드로 바꾼 뒤 숫자 계산만 수행한다.",
        "비전 인코더와 언어 모델을 완전히 분리해 서로 정보를 주지 않는다."
      ],
      answer: 1,
      explanation: "대표적인 VLM은 비전 인코더가 만든 시각 특징을 프로젝터 같은 연결 모듈로 LLM이 처리할 수 있는 표현 공간에 맞춥니다.",
      hint: "이미지 특징이 언어 모델에 들어갈 수 있도록 연결하는 과정을 보세요."
    },
    {
      id: "mock-038-document-understanding-vlm",
      conceptId: "document-understanding-vlm",
      difficulty: "easy",
      category: "멀티모달 및 VLM",
      questionType: "multiple-choice",
      prompt: "문서 이해 VLM이 영수증이나 표를 처리할 때 특히 함께 활용하는 정보는?",
      options: [
        "문서의 파일 이름과 저장 폴더 정보",
        "문서의 음성 높낮이와 발화 속도 정보",
        "문서의 텍스트 내용과 2차원 레이아웃 정보",
        "문서의 네트워크 주소와 접속 시간 정보"
      ],
      answer: 2,
      explanation: "문서 이해 VLM은 OCR 텍스트뿐 아니라 위치, 표 구조, 레이아웃 같은 시각적 배치를 함께 이해합니다.",
      hint: "문서에서는 글자 내용뿐 아니라 어디에 배치되어 있는지도 중요합니다."
    },
    {
      id: "mock-039-small-vlm",
      conceptId: "small-vlm",
      difficulty: "easy",
      category: "멀티모달 및 VLM",
      questionType: "multiple-choice",
      prompt: "Small VLM이 모바일이나 엣지 환경에서 유리한 주된 이유는?",
      options: [
        "적은 메모리와 연산 자원으로 멀티모달 추론을 수행하기 쉽다.",
        "항상 대형 VLM보다 더 많은 파라미터를 사용해 정확도가 높다.",
        "텍스트를 처리하지 않고 이미지 복사 기능만 사용해 계산이 없다.",
        "모든 입력 이미지를 한 픽셀로 줄여 시각 정보를 완전히 제거한다."
      ],
      answer: 0,
      explanation: "Small VLM은 모델 크기와 계산량을 줄여 제한된 자원의 온디바이스 환경에서 활용하기 좋습니다.",
      hint: "디바이스의 메모리와 연산 자원을 생각해보세요."
    },
    {
      id: "mock-040-rag-system-definition",
      conceptId: "rag-definition",
      difficulty: "easy",
      category: "검색증강 생성",
      questionType: "multiple-choice",
      prompt: "RAG의 기본 작동 방식으로 옳은 것은?",
      options: [
        "질문이 올 때마다 모델 전체를 처음부터 다시 학습한다.",
        "외부 문서를 사용하지 않고 모델 내부 지식만 강제로 사용한다.",
        "외부 문서를 검색해 관련 내용을 LLM 입력에 함께 제공한다.",
        "모델의 모든 가중치를 저비트 정수로 바꿔 응답을 생성한다."
      ],
      answer: 2,
      explanation: "RAG는 검색 단계에서 관련 정보를 찾고, 그 결과를 생성 모델의 문맥으로 제공해 답변을 만듭니다.",
      hint: "Retrieval과 Generation이 어떻게 연결되는지 생각해보세요."
    },
    {
      id: "mock-041-llm-as-a-judge-bias",
      conceptId: "llm-as-judge-bias",
      difficulty: "easy",
      category: "LLM 평가 및 정렬",
      questionType: "multiple-choice",
      prompt: "LLM-as-a-Judge에서 발생할 수 있는 평가 편향의 예로 가장 적절한 것은?",
      options: [
        "모든 답변의 점수를 언제나 동일하게 부여하는 고정 규칙",
        "내용이 비슷해도 더 긴 답변을 더 좋은 답변으로 평가하는 경향",
        "정답 여부와 관계없이 항상 더 짧은 답변만 선택하는 규칙",
        "평가 전에 모든 후보 답변을 무작위 문자로 바꾸는 처리"
      ],
      answer: 1,
      explanation: "LLM Judge는 길이 편향, 위치 편향, 자기 선호 편향 등으로 평가가 왜곡될 수 있습니다.",
      hint: "답변의 내용 외적인 특성이 점수에 영향을 주는 경우를 찾으세요."
    },
    {
      id: "mock-042-single-task-finetuning-risk",
      conceptId: "single-task-finetuning",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "범용 모델을 하나의 좁은 태스크에만 지나치게 파인튜닝할 때 생길 수 있는 문제는?",
      options: [
        "모델의 파라미터가 자동으로 모두 0이 되어 추론이 불가능해진다.",
        "모든 태스크의 성능이 자동으로 동일하게 상승해 일반화 문제가 사라진다.",
        "모델의 입력 길이가 자동으로 무한대로 늘어나 메모리 제한이 사라진다.",
        "기존 범용 능력이 약해지고 특정 태스크에 과도하게 맞춰질 수 있다."
      ],
      answer: 3,
      explanation: "좁은 데이터에 과도하게 적응하면 과적합이나 기존 지식의 망각이 발생할 수 있습니다.",
      hint: "특정 작업에 너무 치우쳤을 때 다른 능력에 어떤 영향이 갈지 생각해보세요."
    },
    {
      id: "mock-043-regression-coefficient-interpretation",
      conceptId: "regression-coefficient-interpretation",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "다중 선형회귀식 Y = 10 + 3X1 + 5X2에서 계수 3의 의미는?",
      options: [
        "X1이 같을 때 X2가 1 증가하면 Y의 평균이 3 증가한다.",
        "X1과 X2의 상관계수가 항상 3이라는 뜻이다.",
        "모델의 결정계수가 항상 3%라는 뜻이다.",
        "X2가 같을 때 X1이 1 증가하면 Y의 평균이 3 증가한다."
      ],
      answer: 3,
      explanation: "다중회귀의 한 계수는 다른 독립변수를 고정했을 때 해당 변수가 1단위 증가할 경우 Y의 평균 변화량을 의미합니다.",
      hint: "다른 독립변수를 고정한 상태에서 X1의 변화만 보세요."
    },
    {
      id: "mock-044-tool-learning-concept",
      conceptId: "tool-learning",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "Tool Learning의 핵심 개념으로 가장 적절한 것은?",
      options: [
        "모델이 언제 어떤 외부 도구를 어떻게 호출할지 학습하는 것",
        "모델의 가중치를 모두 삭제해 규칙 기반 시스템으로 바꾸는 것",
        "입력 문장을 원-핫 벡터로만 바꾸어 의미를 제거하는 것",
        "이미지의 모든 픽셀을 같은 값으로 바꾸어 연산을 줄이는 것"
      ],
      answer: 0,
      explanation: "Tool Learning은 검색기, 계산기, API 등 외부 도구의 선택과 호출 방법, 결과 활용을 모델이 익히는 방식입니다.",
      hint: "모델 자체 능력 밖의 기능을 어떤 방식으로 사용하는지 보세요."
    },
    {
      id: "mock-045-multi-agent-system",
      conceptId: "multi-agent-system",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "여러 AI Agent가 서로 역할을 나누어 협력하며 문제를 해결하는 구조는?",
      options: [
        "검색증강 생성 시스템",
        "다중 에이전트 시스템",
        "지식 증류 시스템",
        "단일 회귀 시스템"
      ],
      answer: 1,
      explanation: "다중 에이전트 시스템은 여러 에이전트가 역할을 분담하고 정보를 주고받으며 복잡한 작업을 해결합니다.",
      hint: "하나가 아니라 여러 Agent가 함께 동작하는 구조입니다."
    },
    {
      id: "mock-046-finetuning-vs-instruction-tuning",
      conceptId: "finetuning-vs-instruction-tuning",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "일반적인 파인튜닝과 비교했을 때 Instruction-tuning의 특징은?",
      options: [
        "다양한 지시와 응답 쌍을 학습해 사용자의 지시를 따르는 능력을 높인다.",
        "모델 가중치를 낮은 비트 정수로 바꾸어 메모리 사용량을 줄인다.",
        "외부 문서를 검색해 질문과 관련된 정보를 입력에 추가한다.",
        "중요도가 낮은 연결을 제거해 신경망을 희소하게 만든다."
      ],
      answer: 0,
      explanation: "Instruction-tuning은 여러 종류의 지시-응답 데이터를 사용해 새로운 지시에도 잘 따르는 능력을 높이는 학습입니다.",
      hint: "Instruction을 잘 따르게 만드는 학습 방식입니다."
    },
    {
      id: "mock-047-rlhf-pipeline-flow",
      conceptId: "rlhf-preference-data",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "RLHF에서 보상 모델을 학습하기 위해 주로 사용하는 데이터는?",
      options: [
        "같은 질문에 대한 여러 답변의 인간 선호 순위",
        "이미지 픽셀별 정답 클래스와 위치 좌표",
        "문서 검색기의 파일 경로와 저장 시간",
        "신경망 각 층의 가중치 초기값과 난수 시드"
      ],
      answer: 0,
      explanation: "보상 모델은 같은 프롬프트에 대한 여러 후보 응답을 사람이 비교한 선호 데이터를 학습합니다.",
      hint: "어떤 답변을 사람이 더 좋아하는지 알려주는 데이터입니다."
    },
    {
      id: "mock-048-few-shot-cot",
      conceptId: "few-shot-cot",
      difficulty: "easy",
      category: "프롬프트 및 추론",
      questionType: "multiple-choice",
      prompt: "단계별 풀이 과정이 포함된 몇 개의 예시를 프롬프트에 제공해 추론을 유도하는 방식은?",
      options: [
        "Few-shot CoT",
        "Zero-shot CoT",
        "Knowledge Distillation",
        "Low-bit Quantization"
      ],
      answer: 0,
      explanation: "Few-shot CoT는 문제, 단계별 추론, 정답이 포함된 소수의 예시를 제공해 비슷한 추론을 유도합니다.",
      hint: "예시가 몇 개 제공된다는 점을 보세요."
    },
    {
      id: "mock-049-deployment-lightweight-strategy",
      conceptId: "deployment-lightweight-strategy",
      difficulty: "easy",
      category: "모델 경량화 및 배포",
      questionType: "multiple-choice",
      prompt: "배포 환경에 따른 모델 경량화 전략으로 가장 적절한 것은?",
      options: [
        "모바일·엣지에서는 항상 가장 큰 모델을 사용하고, 서버에서는 가장 작은 모델만 사용한다.",
        "엣지는 양자화·소형 모델을, 자원 여유가 큰 서버는 더 큰 모델을 고려한다.",
        "배포 환경과 관계없이 모든 모델을 FP32 그대로 사용해야 가장 효율적이다.",
        "메모리가 부족할수록 모델 크기와 비트 정밀도를 더 높여야 처리 속도가 빨라진다."
      ],
      answer: 1,
      explanation: "배포 전략은 하드웨어의 메모리, 연산량, 지연시간 요구를 고려해 모델 크기와 정밀도를 조절해야 합니다.",
      hint: "자원이 제한된 환경과 충분한 환경의 차이를 생각해보세요."
    },
    {
      id: "mock-050-low-bit-quantization",
      conceptId: "low-bit-quantization",
      difficulty: "easy",
      category: "모델 경량화 및 배포",
      questionType: "multiple-choice",
      prompt: "저비트 Quantization에 대한 설명으로 옳은 것은?",
      options: [
        "가중치를 FP64처럼 더 높은 정밀도로 바꾸어 메모리를 줄이는 방법이다.",
        "모델의 모든 레이어를 제거하고 입력과 출력만 남기는 압축 방법이다.",
        "가중치를 INT8이나 INT4처럼 낮은 비트로 표현해 메모리를 줄일 수 있다.",
        "학습 데이터를 더 많이 복제해 모델의 파라미터 수를 줄이는 방법이다."
      ],
      answer: 2,
      explanation: "저비트 양자화는 숫자 표현 정밀도를 낮춰 모델 메모리와 계산 비용을 줄이며, 경우에 따라 성능 저하가 생길 수 있습니다.",
      hint: "표현에 사용하는 비트 수를 낮추는 방법입니다."
    },
    {
      id: "mock-051-distillation-teacher-student",
      conceptId: "teacher-student-distillation",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "Teacher–Student 지식 증류에서 각 모델의 역할로 옳은 것은?",
      options: [
        "Teacher의 출력이나 표현을 Student가 따라 학습한다.",
        "Student가 Teacher의 파라미터를 모두 삭제해 모델을 초기화한다.",
        "Teacher가 Student의 입력 데이터를 모두 제거해 연산을 줄인다.",
        "Student와 Teacher가 서로 독립적으로 학습하고 정보를 공유하지 않는다."
      ],
      answer: 0,
      explanation: "Teacher는 더 큰 모델의 지식을 제공하고 Student는 그 출력 분포나 특징을 모방하며 학습합니다.",
      hint: "누가 지식을 주고 누가 배우는지 생각해보세요."
    },
    {
      id: "mock-052-model-compression-tradeoff",
      conceptId: "compression-accuracy-tradeoff",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "모델 경량화에서 일반적으로 고려해야 하는 Trade-off는?",
      options: [
        "메모리를 줄이면 항상 정확도도 반드시 함께 높아진다.",
        "속도를 높이면 모델의 파라미터 수가 자동으로 무한히 늘어난다.",
        "정확도를 유지하려면 모든 환경에서 FP64만 사용해야 한다.",
        "메모리와 속도를 개선할수록 정확도가 일부 낮아질 수 있다."
      ],
      answer: 3,
      explanation: "강한 양자화나 가지치기는 효율을 높이지만 모델 정확도와 표현력을 일부 희생할 수 있습니다.",
      hint: "효율을 얻는 대신 무엇을 잃을 수 있는지 생각해보세요."
    },
    {
      id: "mock-053-ood-adaptive-sensing",
      conceptId: "ood-adaptive-sensing",
      difficulty: "easy",
      category: "적응적 센싱 및 모델 설계",
      questionType: "multiple-choice",
      prompt: "OOD와 Adaptive Sensing의 관계를 올바르게 설명한 것은?",
      options: [
        "OOD에서는 학습 데이터와 입력 분포가 항상 같으므로 센서 조절이 필요하지 않다.",
        "Adaptive Sensing은 모델의 모든 가중치를 삭제해 OOD 문제를 해결하는 방법이다.",
        "낯선 환경에서 입력 분포가 달라질 때 센서 설정을 조절해 모델이 처리하기 좋은 입력을 얻을 수 있다.",
        "Adaptive Sensing은 센서를 끄고 입력 데이터를 받지 않도록 해 분포 차이를 없애는 방법이다."
      ],
      answer: 2,
      explanation: "OOD는 학습 분포 밖의 입력을 뜻하며, Adaptive Sensing은 환경에 맞춰 센서를 조정해 입력 품질이나 분포를 개선하려는 접근입니다.",
      hint: "낯선 환경에서 모델 자체뿐 아니라 입력을 만드는 센서를 조절할 수 있습니다."
    },
    {
      id: "mock-054-ai-scaling-physical-ai",
      conceptId: "ai-scaling-physical-ai",
      difficulty: "easy",
      category: "Physical AI 및 모델 설계",
      questionType: "multiple-choice",
      prompt: "AI Scaling과 Physical AI를 비교한 설명으로 가장 적절한 것은?",
      options: [
        "AI Scaling은 센서를 제거하는 접근이고, Physical AI는 텍스트 데이터만 생성하는 AI를 뜻한다.",
        "Scaling은 규모 확장, Physical AI는 실제 환경의 인식·행동에 초점을 둔다.",
        "AI Scaling은 항상 모델을 작게 만드는 접근이고, Physical AI는 외부 환경과 상호작용하지 않는다.",
        "AI Scaling과 Physical AI는 모두 모델의 가중치를 4비트로 바꾸는 동일한 경량화 기법이다."
      ],
      answer: 1,
      explanation: "Scaling은 규모 확장을 통한 성능 향상에 초점을 두고, Physical AI는 물리 세계의 인식·추론·행동까지 다룹니다.",
      hint: "규모를 키우는 것과 현실 세계에서 행동하는 것을 구분하세요."
    },
    {
      id: "mock-055-cnn-inductive-bias",
      conceptId: "cnn-inductive-bias",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "CNN이 이미지에 잘 맞는 Inductive Bias로 가장 적절한 것은?",
      options: [
        "모든 픽셀 사이의 관계를 처음부터 동일하게 전역 계산해야 한다.",
        "가까운 영역의 패턴을 보고 같은 필터를 여러 위치에 공유해 적용한다.",
        "이미지의 공간 위치는 무시하고 픽셀 순서를 무작위로 섞어 처리한다.",
        "각 위치마다 완전히 다른 필터를 사용해 공간적 공통 패턴을 없앤다."
      ],
      answer: 1,
      explanation: "CNN은 지역 연결성과 가중치 공유를 통해 이미지의 국소 패턴과 위치 이동에 대한 구조적 가정을 활용합니다.",
      hint: "지역성(Locality)과 필터 공유를 떠올려보세요."
    },
    {
      id: "mock-056-vit-positional-embedding",
      conceptId: "vit-positional-embedding",
      difficulty: "easy",
      category: "컴퓨터 비전 및 ViT",
      questionType: "multiple-choice",
      prompt: "ViT에서 Positional Embedding을 사용하는 이유는?",
      options: [
        "각 이미지 패치의 위치와 순서 정보를 알려주기 위해",
        "패치의 모든 픽셀 값을 0과 1로 양자화하기 위해",
        "패치의 채널 수를 항상 절반으로 줄이기 위해",
        "패치마다 서로 다른 정답 클래스를 미리 지정하기 위해"
      ],
      answer: 0,
      explanation: "ViT는 패치를 시퀀스로 처리하므로 각 패치의 공간적 위치를 알 수 있도록 위치 정보를 더합니다.",
      hint: "Transformer 자체에는 입력 순서 정보가 자동으로 포함되지 않습니다."
    },
    {
      id: "mock-057-agent-action-loop",
      conceptId: "ai-agent-action-loop",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "AI Agent의 일반적인 동작 흐름으로 가장 적절한 것은?",
      options: [
        "행동 → 모델 삭제 → 재학습 → 종료",
        "양자화 → 군집화 → 회귀 → 분류",
        "환경 인식 → 계획 → 행동 → 결과 확인",
        "검색 → 이미지 압축 → 모델 초기화 → 종료"
      ],
      answer: 2,
      explanation: "Agent는 현재 상태를 인식하고, 목표에 맞는 계획을 세운 뒤 행동하며, 결과를 다시 관찰해 다음 행동을 결정합니다.",
      hint: "환경과 상호작용하는 반복 루프를 생각해보세요."
    },
    {
      id: "mock-058-distribution-shift",
      conceptId: "distribution-shift",
      difficulty: "easy",
      category: "모델 배포 및 적응",
      questionType: "multiple-choice",
      prompt: "Distribution Shift에 대한 설명으로 옳은 것은?",
      options: [
        "학습과 배포 데이터의 분포가 완전히 같아 성능이 항상 유지되는 현상",
        "모델의 가중치를 낮은 비트로 바꾸면서 메모리 사용량이 줄어드는 현상",
        "학습과 배포 데이터의 분포가 달라 성능이 떨어지는 현상",
        "여러 에이전트가 역할을 나누어 하나의 작업을 해결하는 현상"
      ],
      answer: 2,
      explanation: "Distribution Shift는 학습 시점과 실제 사용 시점의 데이터 통계가 달라지는 현상이며 일반화 성능 저하의 원인이 됩니다.",
      hint: "Train과 Test 환경이 달라지는 상황입니다."
    },
    {
      id: "mock-059-agent-tool-usage",
      conceptId: "ai-agent-tool-usage",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "AI Agent가 외부 Tool을 활용하는 주된 이유는?",
      options: [
        "모델의 모든 파라미터를 삭제해 더 이상 추론하지 않기 위해",
        "입력 데이터를 항상 하나의 고정 문장으로 바꾸기 위해",
        "언어 생성 기능을 제거하고 숫자 계산만 가능하게 만들기 위해",
        "검색·계산·API 실행 등 외부 작업을 수행하기 위해"
      ],
      answer: 3,
      explanation: "Agent는 검색기, 계산기, 데이터베이스, 외부 API 같은 도구를 호출해 자신의 기능 범위를 확장합니다.",
      hint: "모델 밖에 있는 기능을 사용한다는 점이 핵심입니다."
    },
    {
      id: "mock-060-domain-specific-ai",
      conceptId: "domain-specific-ai",
      difficulty: "easy",
      category: "도메인 특화 AI",
      questionType: "multiple-choice",
      prompt: "도메인 특화 AI를 설계할 때 중요한 접근으로 가장 적절한 것은?",
      options: [
        "분야와 상관없는 데이터만 사용해 도메인 정보를 의도적으로 제거한다.",
        "해당 분야의 데이터와 전문 지식을 모델 설계나 학습에 반영한다.",
        "모든 산업에서 같은 규칙과 같은 모델 설정만 사용하도록 고정한다.",
        "전문가 지식은 배제하고 무작위 입력만 사용해 모델이 스스로 추측하게 한다."
      ],
      answer: 1,
      explanation: "도메인 특화 AI는 해당 분야의 데이터 특성, 전문가 규칙, 환경 조건 등을 반영해 특정 업무에서 더 높은 성능과 신뢰성을 목표로 합니다.",
      hint: "특정 분야에 맞추려면 그 분야의 지식과 데이터가 중요합니다."
    }
  ],
  medium: [],
  hard: [],
  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
