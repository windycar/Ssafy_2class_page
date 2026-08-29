export type StudyDifficulty = "easy" | "medium" | "hard" | "extreme";
export type StudyQuestionType =
  | "multiple-choice"
  | "short-answer"
  | "essay";

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

export const QUESTION_BANK: Record<StudyDifficulty, StudyQuestion[]> = {
  easy: [
    // =========================================================================
    // 60문항 전체 객관식 3회차 모의고사 (토픽 1번 ~ 60번 1:1 매칭)
    // 정답 분포: 0번(15개), 1번(15개), 2번(15개), 3번(15개) 완전 균등 배치
    // =========================================================================
    {
      id: "mock3-001-regression-error",
      conceptId: "regression-error-term",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "단순 선형 회귀 모형의 오차항에 대한 고전적 기본 가정으로 적절하지 않은 것은?",
      options: [
        "오차항들의 기댓값은 항상 0이어야 한다.",
        "오차항의 분산은 독립변수 크기에 비례해 변해야 한다.",
        "오차항들은 서로 상관관계가 없는 독립이어야 한다.",
        "오차항의 분포는 일정한 분산을 갖는 정규분포여야 한다."
      ],
      answer: 1,
      explanation: "선형 회귀의 기본 오차항 가정은 정규성, 독립성, 등분산성입니다. 독립변수의 크기와 무관하게 오차항의 분산은 항상 일정해야 합니다.",
      hint: "독립변수의 변화에 따라 오차의 분산이 달라지지 않는 등분산성 가정을 떠올려보세요."
    },
    {
      id: "mock3-002-kmeans-hierarchical",
      conceptId: "clustering-methods-comparison",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "군집화 기법인 K-means와 계층적 군집의 차이점에 대한 설명으로 옳은 것은?",
      options: [
        "K-means는 군집 수 K를 사전 설정하고, 계층적 군집은 덴드로그램을 형성한다.",
        "K-means는 덴드로그램을 생성하고, 계층적 군집은 중심점을 반복 이동시킨다.",
        "두 기법 모두 정답 레이블이 주어져야만 학습할 수 있는 지도학습 방식이다.",
        "계층적 군집은 대규모 데이터에 적합하고, K-means는 소규모 데이터에만 쓰인다."
      ],
      answer: 0,
      explanation: "K-means는 사전에 K를 지정해야 하는 분할 군집화 기법이며, 계층적 군집화는 유사한 데이터끼리 단계적으로 묶어 덴드로그램 트리를 형성합니다.",
      hint: "사전 군집 수 설정 필요 여부와 트리형 덴드로그램 표현 방식을 비교해보세요."
    },
    {
      id: "mock3-003-unsupervised-learning-cases",
      conceptId: "unsupervised-learning-applications",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "다음 중 정답 레이블이 없는 데이터를 바탕으로 수행하는 비지도학습 사례는?",
      options: [
        "스팸 라벨을 이용한 스팸 메일 필터링 분류",
        "과거 진료 기록과 완치 여부를 통한 질병 재발 예측",
        "구매 이력 데이터를 바탕으로 유사한 고객 그룹 묶기",
        "손글씨 숫자 이미지와 정답 숫자를 활용한 필기체 인식"
      ],
      answer: 2,
      explanation: "고객 세분화(군집화)나 차원 축소 등은 별도의 정답 레이블 없이 데이터 자체의 특성과 유사도를 분석하는 대표적인 비지도학습입니다.",
      hint: "정답 라벨 없이 데이터 간의 유사도만으로 그룹을 형성하는 작업을 찾아보세요."
    },
    {
      id: "mock3-004-recall-calculation",
      conceptId: "recall-metric-calculation",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "실제 불량품 200개 중 모델이 150개를 불량으로 바르게 판별하고 50개를 정상으로 놓쳤을 때 재현율은?",
      options: [
        "25%",
        "50%",
        "60%",
        "75%"
      ],
      answer: 3,
      explanation: "재현율(Recall) = TP / (TP + FN) = 150 / (150 + 50) = 150 / 200 = 75% 입니다.",
      hint: "실제 양성 전체 수 중에서 모델이 양성으로 검출해낸 비율을 계산하세요."
    },
    {
      id: "mock3-005-regression-problem-definition",
      conceptId: "regression-vs-classification",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "다음 중 지도학습의 회귀(Regression) 문제에 해당하는 것은?",
      options: [
        "사진 속 인물이 착용한 안경의 유무를 판별한다.",
        "중고차의 연식과 주행거리를 바탕으로 가격을 예측한다.",
        "신용카드 결제 내역이 정상인지 이상인지 판별한다.",
        "고객의 방문 패턴을 바탕으로 이탈 가능 여부를 판별한다."
      ],
      answer: 1,
      explanation: "회귀(Regression)는 가격, 온도, 주가 등 연속적인 수치(실수) 값을 예측하는 지도학습 문제입니다.",
      hint: "연속적인 수치 값을 맞히는 작업인지 범주를 맞히는 작업인지 구별해보세요."
    },
    {
      id: "mock3-006-learning-rate-convergence",
      conceptId: "learning-rate-effects",
      difficulty: "easy",
      category: "딥러닝 기본 원리",
      questionType: "multiple-choice",
      prompt: "경사하강법 최적화 시 학습률을 지나치게 크게 설정했을 때 발생하는 현상은?",
      options: [
        "손실 함수 값이 최솟값에 수렴하지 못하고 진동하거나 발산한다.",
        "가중치 업데이트 보폭이 너무 작아 수렴 속도가 극단적으로 느려진다.",
        "모든 신경망 가중치 행렬이 0으로 초기화되어 연산이 중단된다.",
        "역전파 과정에서 필요한 학습 데이터의 요구량이 0으로 줄어든다."
      ],
      answer: 0,
      explanation: "학습률이 너무 크면 가중치 갱신 보폭이 지나쳐 손실 함수의 최솟값을 지나치며 손실이 진동하거나 발산합니다.",
      hint: "보폭이 너무 넓을 때 최적점을 지나쳐 버리는 현상을 생각해보세요."
    },
    {
      id: "mock3-007-multicollinearity",
      conceptId: "multicollinearity-concept",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "다중 회귀 분석에서 독립변수들 사이에 강한 선형적 상관관계가 존재할 때 발생하는 문제는?",
      options: [
        "과소적합",
        "다중공선성",
        "경사 소실",
        "차원의 저주"
      ],
      answer: 1,
      explanation: "독립변수들 간에 강한 상관관계가 존재하여 회귀계수 추정의 분산이 커지고 모델 해석력을 떨어뜨리는 현상을 다중공선성이라고 합니다.",
      hint: "여러 독립변수들 사이에 선형적 상관관계가 높아서 생기는 문제입니다."
    },
    {
      id: "mock3-008-precision-calculation",
      conceptId: "precision-metric-calculation",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "모델이 양성으로 판정한 100건 중 실제 양성이 70건, 실제 음성이 30건일 때 정밀도는?",
      options: [
        "30%",
        "50%",
        "60%",
        "70%"
      ],
      answer: 3,
      explanation: "정밀도(Precision) = TP / (TP + FP) = 70 / (70 + 30) = 70 / 100 = 70% 입니다.",
      hint: "모델이 양성이라고 답한 것들 중 실제 정답의 비율을 계산하세요."
    },
    {
      id: "mock3-009-classification-problem-definition",
      conceptId: "classification-definition",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "머신러닝에서 입력 데이터를 사전에 정의된 이산적인 범주 중 하나로 지정하는 작업은?",
      options: [
        "분류",
        "회귀",
        "차원 축소",
        "보간"
      ],
      answer: 0,
      explanation: "이산적인 클래스 라벨(스팸/정상, 동물 종류 등)을 맞히는 작업을 분류(Classification)라고 합니다.",
      hint: "정해진 범주나 그룹 중 하나를 선택하는 지도학습 유형입니다."
    },
    {
      id: "mock3-010-activation-function-role",
      conceptId: "non-linear-activation-role",
      difficulty: "easy",
      category: "딥러닝 기본 원리",
      questionType: "multiple-choice",
      prompt: "다층 신경망에서 비선형 활성화 함수가 없을 때 발생하는 구조적 한계는?",
      options: [
        "가중치 행렬의 표현 정밀도를 줄일 수 없게 된다.",
        "계층을 깊게 쌓아도 단일 선형 회귀 모형과 동일해진다.",
        "역전파에 필요한 학습 데이터 수가 2배로 증가한다.",
        "모든 뉴런의 출력이 0으로 고정되어 과적합이 발생한다."
      ],
      answer: 1,
      explanation: "선형 레이어만 쌓으면 결국 하나의 선형 변환으로 축약되므로, 복잡한 비선형 관계를 학습하기 위해 비선형 활성화 함수가 반드시 필요합니다.",
      hint: "선형 변환의 누적으로 인한 단순함을 극복하고 복잡한 패턴을 학습하기 위함입니다."
    },
    {
      id: "mock3-011-rlhf-human-feedback",
      conceptId: "rlhf-core-objective",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "RLHF 파이프라인에서 강화학습 알고리즘이 최적화하는 주된 대상은?",
      options: [
        "사전 학습 코퍼스의 다음 토큰 출현 빈도를 높인다.",
        "언어 모델의 전체 가중치 파라미터 크기를 압축한다.",
        "외부 검색 엔진의 호출 대기 시간을 최소화한다.",
        "보상 모델이 부여하는 점수를 극대화하도록 모델을 조정한다."
      ],
      answer: 3,
      explanation: "RLHF는 인간의 선호도 피드백을 학습한 보상 모델의 점수를 극대화하여 모델이 사람이 좋아하고 안전하며 유용한 답변을 생성하도록 정렬(Alignment)하는 기법입니다.",
      hint: "인간의 선호도를 반영하여 유용하고 안전한 대화를 이끌어내는 목적입니다."
    },
    {
      id: "mock3-012-rlhf-training-steps",
      conceptId: "rlhf-step-by-step-pipeline",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "RLHF를 적용하기 위해 선행되어야 하는 데이터 수집 및 학습 절차로 옳은 것은?",
      options: [
        "보상 모델을 먼저 학습시킨 후 지도 미세조정을 수행한다.",
        "정책 모델을 최적화한 후 비교 데이터를 사후 수집한다.",
        "시범 데이터로 지도 미세조정한 후 순위 데이터로 보상 모델을 학습한다.",
        "외부 검색 문서를 수집한 후 프롬프트 템플릿만 조립한다."
      ],
      answer: 2,
      explanation: "RLHF 파이프라인은 1단계: 지도 미세조정(SFT) -> 2단계: 비교 데이터를 통한 보상 모델(RM) 학습 -> 3단계: PPO 강화학습으로 정책 최적화 순으로 진행됩니다.",
      hint: "지도학습으로 기초를 다진 후 보상 모델을 만들고 강화학습으로 정책을 업데이트합니다."
    },
    {
      id: "mock3-013-gradient-descent-direction",
      conceptId: "gradient-descent-update-rule",
      difficulty: "easy",
      category: "딥러닝 기본 원리",
      questionType: "multiple-choice",
      prompt: "손실 함수를 최소화하기 위한 경사하강법의 가중치 갱신 공식에 대한 설명으로 옳은 것은?",
      options: [
        "현재 가중치에 학습률과 기울기의 곱을 더한다.",
        "현재 가중치에서 학습률과 기울기의 곱을 뺀다.",
        "현재 가중치 값의 절댓값에 학습률을 곱해 더한다.",
        "손실 함수의 2차 도함수 부호에 맞춰 값을 더한다."
      ],
      answer: 1,
      explanation: "경사하강법은 손실이 가장 가파르게 증가하는 방향인 기울기(Gradient)의 반대 방향(-Gradient)으로 가중치를 갱신합니다.",
      hint: "산의 경사면을 따라 아래로 내려가는 반대 방향을 생각해보세요."
    },
    {
      id: "mock3-014-one-hot-encoding-limits",
      conceptId: "one-hot-encoding-limitations",
      difficulty: "easy",
      category: "자연어 처리 및 임베딩",
      questionType: "multiple-choice",
      prompt: "어휘 사전 크기가 10만 개인 텍스트를 원-핫 인코딩할 때 발생하는 주된 문제는?",
      options: [
        "모든 단어 벡터 간의 내적이 1이 되어 중복이 발생한다.",
        "단어 벡터의 차원이 너무 작아 계산이 불가능해진다.",
        "모든 단어가 부동소수점으로 저장되어 오류가 발생한다.",
        "고차원 희소 벡터가 생성되며 단어 간 의미적 거리를 반영하지 못한다."
      ],
      answer: 3,
      explanation: "원-핫 인코딩은 단어 벡터 간 직교성으로 인해 단어 사이의 의미적 유사성을 표현하지 못하며 어휘가 늘어날수록 벡터가 커지고 희소해집니다.",
      hint: "단어 사이의 의미적 거리를 표현할 수 없는 구조적 한계입니다."
    },
    {
      id: "mock3-015-rnn-recurrent-structure",
      conceptId: "rnn-hidden-state-recurrence",
      difficulty: "easy",
      category: "자연어 처리 및 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "순환 신경망(RNN)에서 현재 시점의 은닉 상태를 계산하기 위해 직접 입력되는 요소는?",
      options: [
        "이전 시점의 은닉 상태와 현재 시점의 입력 벡터",
        "모든 시점의 단어들을 결합한 단일 1차원 정수",
        "시간 순서와 무관한 전체 단어 쌍 간의 어텐션 맵",
        "매 시점마다 무작위로 생성되는 독립 가중치 행렬"
      ],
      answer: 0,
      explanation: "RNN은 이전 시점까지의 문맥 정보를 담은 은닉 상태(Hidden State)를 현재 입력과 함께 순환적으로 받아 처리합니다.",
      hint: "이전 시점의 정보를 담고 있는 은닉 상태의 순환 구조를 생각해보세요."
    },
    {
      id: "mock3-016-1x1-conv-computation",
      conceptId: "1x1-convolution-multiplications",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "크기가 4×4이고 입력 채널이 16, 출력 채널이 32인 Feature Map에 1×1 Convolution을 적용할 때 곱셈 연산 횟수는?",
      options: [
        "2,048",
        "4,096",
        "8,192",
        "16,384"
      ],
      answer: 2,
      explanation: "1×1 Conv 곱셈 횟수 = 출력 높이 × 출력 너비 × 입력 채널 × 출력 채널 = 4 × 4 × 16 × 32 = 16 × 512 = 8,192 회 입니다.",
      hint: "4 * 4 * 16 * 32 를 계산하세요."
    },
    {
      id: "mock3-017-cnn-fc-params",
      conceptId: "cnn-fc-parameter-calculation",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "3×3 Conv(입력 채널 2, 출력 채널 4)와 FC 계층(입력 노드 10개, 출력 노드 5개)의 편향을 제외한 순수 가중치 수는?",
      options: [
        "Conv 72개 / FC 50개",
        "Conv 72개 / FC 500개",
        "Conv 24개 / FC 50개",
        "Conv 24개 / FC 500개"
      ],
      answer: 0,
      explanation: "Conv 파라미터 = (3 × 3 × 2) × 4 = 72개, FC 파라미터 = 10 × 5 = 50개 입니다.",
      hint: "Conv는 (3*3*2)*4, FC는 10*5를 각각 계산하세요."
    },
    {
      id: "mock3-018-sentence-embedding-cosine-sim",
      conceptId: "sentence-embedding-cosine-similarity",
      difficulty: "easy",
      category: "자연어 처리 및 임베딩",
      questionType: "multiple-choice",
      prompt: "두 문장 임베딩 벡터의 코사인 유사도 값이 1에 가까울 때 의미하는 바는?",
      options: [
        "두 문장이 사용하는 단어의 글자 수가 정확히 동일하다.",
        "두 문장의 단어 빈도수가 역문서 빈도와 완전히 일치한다.",
        "두 문장 벡터가 공간에서 같은 방향을 가리키며 의미가 유사하다.",
        "두 문장이 서로 완전히 반대되는 감정 극성을 지니고 있다."
      ],
      answer: 2,
      explanation: "문장 임베딩 벡터 간의 의미적 유사성을 측정할 때는 벡터 사이의 각도를 기반으로 하는 코사인 유사도를 주로 사용하며, 1에 가까울수록 방향이 같아 의미가 유사함을 뜻합니다.",
      hint: "두 벡터의 사이각 코사인 값을 통해 의미적 유사도를 측정하는 방식입니다."
    },
    {
      id: "mock3-019-text-foundation-model",
      conceptId: "text-foundation-model-concept",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "대규모 비라벨 텍스트 코퍼스로 사전 학습된 텍스트 파운데이션 모델의 핵심 특성은?",
      options: [
        "단일 작업에만 고정되어 추가 학습이 불가능하다.",
        "모든 언어 규칙을 규칙 기반 논리표로만 저장한다.",
        "입력 데이터의 어휘 수가 늘어나면 동작을 멈춘다.",
        "광범위한 지식을 갖추어 다양한 하위 작업에 적응할 수 있다."
      ],
      answer: 3,
      explanation: "방대한 텍스트 코퍼스로 사전 학습되어 범용 언어 능력을 갖추고 다양한 하위 작업의 기반이 되는 모델을 텍스트 파운데이션 모델이라고 합니다.",
      hint: "기반이 되는 거대 사전 학습 모델을 의미합니다."
    },
    {
      id: "mock3-020-llm-agent-characteristics",
      conceptId: "llm-agent-six-traits",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "LLM 기반 에이전트가 복잡한 지시를 해결할 때 발휘하는 계획(Planning) 특성에 해당하는 것은?",
      options: [
        "외부 환경의 피드백 신호를 아날로그 전압으로 변환한다.",
        "가중치 파라미터를 8비트 정수로 실시간 양자화한다.",
        "훈련 데이터셋의 텍스트 토큰 길이를 강제로 늘린다.",
        "최종 목표를 작은 하위 작업으로 분해하고 순차적 실행 경로를 세운다."
      ],
      answer: 3,
      explanation: "AI 에이전트의 계획(Planning) 능력은 주어진 복잡한 목표를 세부 작업 단위로 분해하고 도구 호출 전략과 실행 순서를 구성하는 특성입니다.",
      hint: "목표를 하위 작업들로 쪼개어 해결 전략을 수립하는 능력입니다."
    },
    {
      id: "mock3-021-instruction-dataset-format",
      conceptId: "instruction-dataset-format",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "인스트럭션 튜닝을 위한 고품질 데이터셋을 구축할 때 필수로 요구되는 기본 구조는?",
      options: [
        "질문 - 선호 순위 - 보상 점수",
        "문서 원문 - 검색 점수 - 역색인",
        "명령 지시문 - 입력 문맥 - 모범 답변",
        "이미지 픽셀 - 클래스 - 바운딩 박스"
      ],
      answer: 2,
      explanation: "지시문 튜닝 데이터셋은 지시문(Instruction), 추가 입력(Input), 정답 출력(Output)의 쌍으로 구성됩니다.",
      hint: "지시문과 그에 맞는 정답 답변의 쌍으로 이루어진 데이터 구조입니다."
    },
    {
      id: "mock3-022-1x1-conv-channel-mixing",
      conceptId: "1x1-conv-channel-pooling",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "합성곱 신경망에서 1×1 합성곱 계층을 배치함으로써 얻을 수 있는 대표적인 효과는?",
      options: [
        "피처맵의 공간 해상도를 절반으로 줄여 다운샘플링한다.",
        "공간 해상도를 유지한 채 채널 수를 조절하여 연산량을 줄인다.",
        "가중치 행렬을 정수 형태로 양자화하여 압축한다.",
        "입력 이미지의 회전 각도를 감지하여 원상 복구한다."
      ],
      answer: 1,
      explanation: "1×1 Conv는 가로·세로 해상도는 유지하면서 채널 축을 따라 가중합을 계산해 채널 차원을 늘리거나 줄이고 정보를 융합합니다.",
      hint: "가로세로는 유지하고 채널 차원만 조절하는 특성입니다."
    },
    {
      id: "mock3-023-zero-shot-cot",
      conceptId: "zero-shot-cot-trigger-phrase",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "사전 예시 없이 유도 문구만으로 단계별 추론을 이끌어내는 프롬프팅 방식은?",
      options: [
        "Few-shot CoT",
        "Zero-shot Prompting",
        "Zero-shot CoT",
        "Self-consistency CoT"
      ],
      answer: 2,
      explanation: "Zero-shot CoT는 'Let\'s think step by step'과 같은 문구만 추가하여 모델이 중간 사고 과정을 거쳐 정답을 도출하도록 유도하는 기법입니다.",
      hint: "예시 없이 단계별 사고를 유도하는 프롬프팅 방식입니다."
    },
    {
      id: "mock3-024-ai-vs-ai-agent",
      conceptId: "ai-vs-ai-agent-difference",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "일반 텍스트 생성 인공지능과 비교할 때 AI Agent가 갖는 차별화된 능력은?",
      options: [
        "환경을 관찰하고 필요한 도구를 호출하여 작업을 완수한다.",
        "정수 연산만을 지원하여 배터리 소모를 완전히 없앤다.",
        "클라우드 환경에서만 동작하도록 모델 구조를 고정한다.",
        "외부 검색을 완전히 배제하고 내부 기억만으로 답한다."
      ],
      answer: 0,
      explanation: "단순 AI는 텍스트 완성에 머무르는 반면, AI Agent는 자율적으로 계획을 세우고 도구를 호출하며 환경과 상호작용하는 능동성을 갖습니다.",
      hint: "목표를 위해 능동적으로 도구를 쓰고 행동하는 차이점입니다."
    },
    {
      id: "mock3-025-quantization-features",
      conceptId: "quantization-basic-concept",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "인공지능 모델 경량화 기법 중 양자화(Quantization)를 적용할 때의 주된 특징은?",
      options: [
        "불필요한 가중치를 찾아내어 신경망에서 삭제한다.",
        "대형 교사 모델의 출력을 소형 학생 모델이 학습한다.",
        "레이어 사이에 어댑터 모듈을 끼워 넣어 튜닝한다.",
        "파라미터의 표현 비트 수를 낮춰 메모리와 연산을 줄인다."
      ],
      answer: 3,
      explanation: "양자화는 FP32/FP16 등의 고정밀도 실수를 INT8/INT4 등 낮은 비트 정밀도로 변환하여 메모리와 연산량을 절감하는 기술입니다.",
      hint: "가중치의 표현 비트 수를 줄이는 경량화 기법입니다."
    },
    {
      id: "mock3-026-prompt-design-elements",
      conceptId: "prompt-design-structure",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "LLM의 출력 정확도와 형식 준수율을 높이기 위한 프롬프트 디자인 원칙으로 옳은 것은?",
      options: [
        "최대한 모호한 단어를 써서 다양한 상상을 유도한다.",
        "모든 예시를 배제하고 한 단어로만 명령을 전달한다.",
        "수행할 역할과 구체적인 지시 및 출력 서식을 명확히 지정한다.",
        "답변의 길이에 대한 제약 조건을 전혀 명시하지 않는다."
      ],
      answer: 2,
      explanation: "프롬프트는 모호성을 없애고 구체적인 역할, 명확한 작업 지시, 문맥, 출력 형식, 예시를 제공할 때 가장 우수한 성능을 발휘합니다.",
      hint: "명확성과 구체성을 떨어뜨리는 지시 방식을 고르세요."
    },
    {
      id: "mock3-027-knowledge-distillation",
      conceptId: "knowledge-distillation-concept",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "지식 증류(Knowledge Distillation)에서 학생 모델이 교사 모델의 출력을 학습할 때의 이점은?",
      options: [
        "단순 정답 라벨보다 풍부한 클래스 간 확률 분포 정보를 학습한다.",
        "가중치 행렬의 모든 원소가 정수 1로 고정되어 연산이 없어진다.",
        "학습 과정에서 필요한 역전파 연산 단계가 100% 생략된다.",
        "학생 모델의 파라미터 크기가 교사 모델과 동일하게 커진다."
      ],
      answer: 0,
      explanation: "지식 증류는 교사 모델이 생성하는 부드러운 확률 분포(Soft Labels)를 통해 정답 레이블 이상의 풍부한 클래스 간 관계 정보를 학생 모델에게 전달합니다.",
      hint: "선생님 모델의 출력 확률 분포를 학습하여 얻는 풍부한 정보입니다."
    },
    {
      id: "mock3-028-multimodal-video-generation",
      conceptId: "multimodal-video-generation-concept",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "텍스트 지시문이나 정지 이미지를 바탕으로 시공간적 일관성을 갖춘 동영상을 생성하는 기술은?",
      options: [
        "텍스트 분류 모델",
        "이미지 분류 모델",
        "멀티모달 비디오 생성 모델",
        "음성 인식 모델"
      ],
      answer: 2,
      explanation: "텍스트나 이미지 조건을 바탕으로 시간적 연속성을 갖는 비디오 프레임을 합성하는 모델을 멀티모달 비디오 생성 모델이라고 부릅니다.",
      hint: "텍스트나 이미지를 입력으로 비디오를 만들어내는 생성 모델입니다."
    },
    {
      id: "mock3-029-cbow-vs-skipgram",
      conceptId: "word2vec-cbow-vs-skipgram",
      difficulty: "easy",
      category: "자연어 처리 및 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec 모델에서 Skip-gram 방식의 학습 메커니즘으로 옳은 것은?",
      options: [
        "주변 문맥 단어들로 중심 단어를 맞히도록 훈련한다.",
        "하나의 중심 단어로 주변 문맥 단어들을 예측하도록 훈련한다.",
        "문장 전체를 입력받아 문장의 긍정/부정 극성을 예측한다.",
        "단어의 철자 구조만을 바탕으로 빈도수를 집계한다."
      ],
      answer: 1,
      explanation: "CBOW는 주변 문맥 단어들로 중심 단어를 맞히고, Skip-gram은 중심 단어 하나로부터 주변 문맥 단어들을 예측하도록 학습합니다.",
      hint: "주변->중심과 중심->주변의 방향 차이입니다."
    },
    {
      id: "mock3-030-rnn-vanishing-gradient",
      conceptId: "rnn-vanishing-gradient-problem",
      difficulty: "easy",
      category: "자연어 처리 및 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "순환 신경망(RNN)에서 시퀀스가 길어질 때 역전파 기울기 소실이 발생하는 근본적인 이유는?",
      options: [
        "셀 상태 통로가 너무 넓어져 정보가 유실되기 때문에",
        "순환 연결이 없어 피드포워드 연산만 수행되기 때문에",
        "모든 활성화 함수가 선형 항등 함수로 고정되기 때문에",
        "시간 축을 거슬러 가중치가 반복 곱해져 기울기가 급감하기 때문에"
      ],
      answer: 3,
      explanation: "시간 축으로 역전파(BPTT)를 수행할 때 가중치 행렬이 거듭 곱해지면서 그래디언트가 0에 가깝게 소실되어 장기 문맥을 학습하지 못합니다.",
      hint: "시간 역전파 과정에서 가중치 곱셈이 누적되며 발생하는 현상입니다."
    },
    {
      id: "mock3-031-lstm-state-structure",
      conceptId: "lstm-cell-state-gates",
      difficulty: "easy",
      category: "자연어 처리 및 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "LSTM에서 시퀀스 전체를 관통하며 장기 기억 정보를 보존하는 전용 상태 통로는?",
      options: [
        "셀 상태 (Cell State)",
        "어텐션 맵 (Attention Map)",
        "위치 벡터 (Position Vector)",
        "소프트맥스 레이어 (Softmax Layer)"
      ],
      answer: 0,
      explanation: "LSTM은 은닉 상태 외에 시퀀스 전체를 가로지르며 장기 기억을 전달하는 셀 상태(Cell State)를 통해 기울기 소실 문제를 완화합니다.",
      hint: "컨베이어 벨트처럼 장기 정보를 흘려보내는 셀 상태를 생각해보세요."
    },
    {
      id: "mock3-032-pretrain-vs-finetune",
      conceptId: "pretraining-vs-finetuning-concepts",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "거대 언어 모델의 사전학습(Pre-training)과 파인튜닝(Fine-tuning)에 대한 설명으로 옳은 것은?",
      options: [
        "사전학습은 특정 작업에 맞추고, 파인튜닝은 일반 언어 규칙을 배운다.",
        "사전학습은 비라벨 텍스트로 배우고, 파인튜닝은 특정 작업에 적응시킨다.",
        "사전학습을 거치면 파라미터가 고정되어 추가 파인튜닝이 불가능하다.",
        "파인튜닝은 사전학습보다 항상 100배 이상의 연산 비용이 소모된다."
      ],
      answer: 1,
      explanation: "사전 학습은 대규모 데이터로 언어와 일반 지식을 배우고, 파인튜닝은 특정 도메인이나 작업에 맞게 모델을 추가 학습시키는 과정입니다.",
      hint: "일반 언어 지식 습득과 특정 작업 적응의 차이입니다."
    },
    {
      id: "mock3-033-max-pooling",
      conceptId: "max-pooling-downsampling",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "합성곱 신경망에서 Max Pooling 연산을 거친 후 피처맵에 나타나는 변화는?",
      options: [
        "공간 해상도가 축소되면서 가장 강한 특징 신호가 보존된다.",
        "공간 해상도는 유지되고 채널 수가 2배로 확장된다.",
        "피처맵의 모든 픽셀 값이 평균값으로 균일화된다.",
        "가중치 파라미터의 수가 2배로 늘어나 연산량이 커진다."
      ],
      answer: 0,
      explanation: "Max Pooling은 정해진 영역 내에서 최댓값만 추출하여 공간 해상도를 줄이고 가장 강한 활성화 신호를 보존합니다.",
      hint: "영역 내 가장 강한 신호(최댓값)를 뽑아 피처맵을 줄이는 연산입니다."
    },
    {
      id: "mock3-034-cnn-receptive-field",
      conceptId: "cnn-receptive-field-concept",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "합성곱 신경망에서 깊은 계층으로 갈수록 수용 영역(Receptive Field)이 넓어지는 이유는?",
      options: [
        "가중치 행렬의 부동소수점 비트 수가 증가하기 때문에",
        "입력 이미지의 실제 픽셀 해상도가 커지기 때문에",
        "역전파 과정에서 손실 함수가 0으로 수렴하기 때문에",
        "합성곱과 풀링이 누적되어 상위 뉴런이 더 넓은 입력을 참조하기 때문에"
      ],
      answer: 3,
      explanation: "합성곱 계층과 풀링 계층이 깊어질수록 각 뉴런이 이전 계층의 여러 영역을 누적하여 참조하므로 입력 이미지 기준으로 수용 영역이 넓어집니다.",
      hint: "계층이 쌓이면서 이전 계층들의 시야가 누적되어 넓어지는 원리입니다."
    },
    {
      id: "mock3-035-feature-map-memory",
      conceptId: "feature-map-memory-calculation",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "32×32 피처맵, 채널 수 16, FP32(4바이트) 정밀도로 저장할 때 필요한 메모리 용량은?",
      options: [
        "32 KB",
        "64 KB",
        "128 KB",
        "256 KB"
      ],
      answer: 1,
      explanation: "32 × 32 × 16 = 16,384개 요소이며, 16,384 × 4Byte = 65,536Byte = 64KB 입니다.",
      hint: "32 * 32 * 16 * 4 Byte 를 계산하여 KB로 환산하세요."
    },
    {
      id: "mock3-036-foundation-model-service-dev",
      conceptId: "foundation-model-application-dev",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "실무에서 파운데이션 모델 기반 인공지능 서비스를 효율적으로 구축하는 전략으로 옳은 것은?",
      options: [
        "거대 파운데이션 모델을 직접 처음부터 사전 학습시키는 데만 집중한다.",
        "모든 외부 연결을 차단하고 텍스트 완성 모델만을 단독 배포한다.",
        "사전 학습된 기반 모델에 프롬프트, 검색 증강 생성, 도구 연동을 결합한다.",
        "정답 라벨이 없는 데이터는 배제하고 규칙 기반 전문가 엔진만 구현한다."
      ],
      answer: 2,
      explanation: "기존 파운데이션 모델을 바탕으로 프롬프트 엔지니어링, 검색증강생성(RAG), 외부 툴 호출 등을 결합하여 빠르고 안정적으로 서비스를 개발하는 것이 효율적입니다.",
      hint: "기반 모델 위에 검색 증강 생성과 도구를 결합하는 서비스 개발 방식을 떠올려보세요."
    },
    {
      id: "mock3-037-vlm-training-procedure",
      conceptId: "vlm-training-alignment-procedure",
      difficulty: "easy",
      category: "멀티모달 및 VLM",
      questionType: "multiple-choice",
      prompt: "비전언어모델(VLM)이 시각과 언어를 함께 이해하도록 학습시키는 기본 방법은?",
      options: [
        "이미지 정보를 숫자로만 변환해 텍스트 모델 없이 분류한다.",
        "비전 인코더와 언어 모델 사이에 프로젝터를 두어 시각-언어를 정렬한다.",
        "언어 모델 없이 비전 인코더만을 단독으로 미세조정한다.",
        "이미지 정보를 제거하고 텍스트 데이터셋만 반복 학습한다."
      ],
      answer: 1,
      explanation: "VLM은 사전 학습된 이미지 인코더와 언어 모델 사이에 프로젝션 레이어를 두어 시각 정보를 언어 모델 공간과 일치시키는 정렬 학습을 진행합니다.",
      hint: "비전 인코더와 언어 모델을 연결하여 시각-언어를 정렬하는 구조입니다."
    },
    {
      id: "mock3-038-document-understanding-vlm",
      conceptId: "doc-vlm-layout-text-understanding",
      difficulty: "easy",
      category: "멀티모달 및 VLM",
      questionType: "multiple-choice",
      prompt: "영수증이나 표 문서를 판독하는 문서 이해 VLM이 일반 텍스트 모델과 구별되는 핵심 능력은?",
      options: [
        "시각적 레이아웃 정보는 버리고 텍스트 순서만 1차원으로 읽는다.",
        "모든 문서 이미지를 음성 신호로 변환한 후 단어 빈도만 계산한다.",
        "표에 포함된 숫자를 모두 0으로 치환하여 연산을 단순화한다.",
        "텍스트 내용뿐 아니라 표 구조와 시각적 레이아웃 배치를 함께 인식한다."
      ],
      answer: 3,
      explanation: "문서 이해 VLM은 문서 내 텍스트뿐만 아니라 표의 행렬 구조, 텍스트의 2차원 공간 배치(Layout)를 종합적으로 파악하여 의미를 해석합니다.",
      hint: "시각적 레이아웃과 텍스트를 동시에 이해하는 능력입니다."
    },
    {
      id: "mock3-039-small-vlm",
      conceptId: "small-vlm-on-device-benefits",
      difficulty: "easy",
      category: "멀티모달 및 VLM",
      questionType: "multiple-choice",
      prompt: "소형 비전언어모델(Small VLM)이 모바일 및 엣지 환경에서 제공하는 주된 이점은?",
      options: [
        "적은 파라미터로 엣지 디바이스에서 낮은 지연시간으로 추론이 가능하다.",
        "초대형 클라우드 VLM보다 항상 100배 많은 사전 학습 데이터를 필요로 한다.",
        "모든 이미지 해상도를 1×1 픽셀로 압축하여 시각 인식을 수행한다.",
        "텍스트 입력을 전혀 처리하지 못하고 오직 이미지 파일 복사만 수행한다."
      ],
      answer: 0,
      explanation: "Small VLM은 모델 크기와 연산량을 대폭 경량화하여 모바일 기기나 엣지 가속기에서도 낮은 지연시간으로 멀티모달 작업을 수행할 수 있습니다.",
      hint: "제한된 디바이스 자원에서 빠른 멀티모달 처리를 지원하는 이점입니다."
    },
    {
      id: "mock3-040-rag-system-definition",
      conceptId: "rag-definition-retrieval-generation",
      difficulty: "easy",
      category: "검색증강 생성 (RAG)",
      questionType: "multiple-choice",
      prompt: "검색증강 생성(RAG)이 거대 언어 모델의 환각 현상을 줄여주는 주된 메커니즘은?",
      options: [
        "모든 세계 지식을 모델 내부 가중치에만 저장하여 외부 검색을 차단하는 방식",
        "사용자 질의가 입력될 때마다 모델 전체 가중치를 실시간 재학습하는 방식",
        "질문과 관련된 외부 신뢰 문서를 검색하여 언어 모델의 답변 근거로 제공한다.",
        "외부 문서를 모두 삭제하고 지식 그래프의 노드 개수만 카운트하는 방식"
      ],
      answer: 2,
      explanation: "RAG는 사용자 질의에 맞춰 외부 데이터스토어에서 신뢰할 수 있는 관련 문서를 검색하고, 이를 바탕으로 언어 모델이 근거 있는 답변을 생성하도록 유도합니다.",
      hint: "외부 지식을 검색하여 언어 모델에 전달하는 방식입니다."
    },
    {
      id: "mock3-041-llm-as-a-judge-bias",
      conceptId: "llm-as-judge-evaluation-biases",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "LLM을 평가 모델(LLM-as-a-Judge)로 활용할 때 내용과 무관하게 발생할 수 있는 편향은?",
      options: [
        "모든 답변에 대해 항상 수학적으로 완벽한 만점을 부여하는 편향",
        "문법 오류를 감지하면 자동으로 모델 파라미터를 초기화하는 편향",
        "외부 검색 출처가 없을 때만 무조건 최고점을 부여하는 편향",
        "답변의 길이가 길거나 먼저 제시된 답변을 더 선호하는 편향"
      ],
      answer: 3,
      explanation: "LLM-as-a-Judge는 내용과 무관하게 긴 답변을 선호하는 길이 편향, 특정 순서의 답변을 선호하는 위치 편향 등이 발생할 수 있습니다.",
      hint: "답변의 길이나 제시 순서 등에 따라 평가가 왜곡되는 현상을 생각해보세요."
    },
    {
      id: "mock3-042-single-task-finetuning-risk",
      conceptId: "single-task-finetuning-catastrophic-forgetting",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "파운데이션 모델을 특정 단일 작업 데이터로만 과도하게 미세조정했을 때 발생하는 문제는?",
      options: [
        "모델의 가중치 행렬이 자동으로 역색인 테이블로 변환되는 현상",
        "사전 학습된 범용 지식과 일반 추론 능력을 잃어버리는 치명적 망각",
        "추론 과정에서 발생하는 모든 행렬 곱셈 연산량이 0으로 감소하는 현상",
        "새로운 데이터에 대한 예측 정확도가 항상 100%로 고정되는 현상"
      ],
      answer: 1,
      explanation: "단일 태스크에 치우쳐 과도하게 파인튜닝하면 사전 학습 과정에서 획득했던 다양한 범용 지식을 잊어버리는 치명적 망각이 일어날 수 있습니다.",
      hint: "단일 작업에 치우치면서 기존 범용 지식을 잃어버리는 현상입니다."
    },
    {
      id: "mock3-043-regression-coefficient-interpretation",
      conceptId: "regression-coefficient-interpretation-meaning",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "Y = 50 + 2*X1 - 4*X2 에서 계수 2의 올바른 통계적 의미는?",
      options: [
        "X1이 1 증가하면 X2가 항상 2 증가한다는 뜻이다.",
        "X1과 X2의 상관계수가 2라는 뜻이다.",
        "X1이 2 증가하면 Y가 항상 1 증가한다는 뜻이다.",
        "X2가 일정할 때 X1이 1 증가하면 Y가 평균 2 증가한다."
      ],
      answer: 3,
      explanation: "다중 회귀계수 2는 다른 독립변수(X2)가 고정되어 있을 때, X1이 1단위 증가함에 따라 종속변수 Y의 기댓값이 평균적으로 2만큼 증가함을 나타냅니다.",
      hint: "다른 변수가 고정된 조건에서 X1이 1단위 증가할 때 Y의 평균 변화량입니다."
    },
    {
      id: "mock3-044-tool-learning-concept",
      conceptId: "tool-learning-agent-paradigm",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "언어 모델이 자체 지식 한계를 극복하고 계산기나 외부 API를 사용하도록 훈련하는 패러다임은?",
      options: [
        "비라벨 사전학습",
        "단어 토큰 풀링",
        "도구 학습",
        "역색인 구축"
      ],
      answer: 2,
      explanation: "언어 모델이 외부 API나 소프트웨어 도구를 적절한 시점에 호출하고 결과를 받아 활용할 수 있도록 훈련하는 패러다임을 도구 학습(Tool Learning)이라고 합니다.",
      hint: "외부 도구를 활용하는 방법을 학습하는 패러다임입니다."
    },
    {
      id: "mock3-045-multi-agent-system",
      conceptId: "multi-agent-system-framework",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "다양한 역할을 가진 여러 AI 에이전트들이 통신하며 협력하여 복잡한 목표를 완수하는 체계는?",
      options: [
        "단일 에이전트 시스템",
        "다중 에이전트 시스템",
        "검색 증강 생성 시스템",
        "지식 증류 시스템"
      ],
      answer: 1,
      explanation: "여러 전문 에이전트가 역할을 분담하고 통신 프로토콜을 통해 협력하여 집단 지성을 발휘하는 시스템을 다중 에이전트 시스템이라고 합니다.",
      hint: "여러 에이전트들이 상호작용하는 다중 에이전트 구조입니다."
    },
    {
      id: "mock3-046-finetuning-vs-instruction-tuning",
      conceptId: "finetuning-vs-instruction-tuning-difference",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "일반적인 단일 작업 파인튜닝과 비교할 때 인스트럭션 튜닝의 주요 특징은?",
      options: [
        "다양한 형식의 지시문과 응답 쌍을 학습하여 새로운 명령에 대응한다.",
        "모델의 가중치를 저비트 정수로 변환하여 연산만을 가속한다.",
        "불필요한 신경망 연결을 제거하여 모델 크기를 절반으로 줄인다.",
        "외부 문서를 검색하여 질의에 대한 출처 링크만을 생성한다."
      ],
      answer: 0,
      explanation: "Instruction-tuning은 모델이 사람이 내린 다양한 지시문의 의도를 파악하고 적절한 응답을 생성하도록 지시-응답 데이터셋으로 지도 학습하는 기법입니다.",
      hint: "지시문을 따르는 일반화 능력을 기르는 학습 방식입니다."
    },
    {
      id: "mock3-047-rlhf-pipeline-flow",
      conceptId: "rlhf-pipeline-order-check",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "RLHF 파이프라인에서 보상 모델(Reward Model)을 훈련하기 위해 수집하는 핵심 데이터는?",
      options: [
        "비라벨 텍스트의 다음 토큰 정답 데이터",
        "수학 문제의 컴파일 오류 로그 데이터",
        "모델 응답 후보 간의 선호도 순위 비교 데이터",
        "웹 검색 엔진의 소스 코드 데이터"
      ],
      answer: 2,
      explanation: "보상 모델은 동일한 질문에 대해 생성된 여러 응답 후보들을 사람이 직접 비교하여 매긴 선호도 순위(Ranking) 데이터를 학습합니다.",
      hint: "답변 후보들의 선호 순위를 매긴 비교 데이터입니다."
    },
    {
      id: "mock3-048-few-shot-cot",
      conceptId: "few-shot-cot-prompting",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "프롬프트에 문제와 정답 외에 단계별 풀이 추론 과정이 포함된 소수의 예시를 제공하는 기법은?",
      options: [
        "Zero-shot CoT",
        "지식 증류",
        "모델 양자화",
        "Few-shot CoT"
      ],
      answer: 3,
      explanation: "Few-shot CoT는 문제, 단계별 사고 과정(풀이), 정답이 포함된 소수의 예시를 프롬프트에 제시하여 모델의 논리 추론 능력을 이끌어내는 기법입니다.",
      hint: "단계별 풀이 예시를 소수 제공하는 프롬프팅 기법입니다."
    },
    {
      id: "mock3-049-edge-compression-strategy",
      conceptId: "edge-deployment-quantization-strategy",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "메모리와 전력이 제한된 온디바이스 모바일 기기에 대형 모델을 배포하기 위한 전략은?",
      options: [
        "모델의 파라미터 수를 계속 증가시킨다.",
        "양자화 등을 적용해 크기와 연산량을 줄여 배포한다.",
        "모든 연산 정밀도를 64비트 실수로 변경한다.",
        "추론할 때마다 모델을 처음부터 재학습한다."
      ],
      answer: 1,
      explanation: "자원이 제한된 모바일 및 엣지 환경에 모델을 배포할 때는 양자화(Quantization), 가지치기 등을 활용해 가중치 크기와 연산량을 줄이는 경량화 전략이 필수적입니다.",
      hint: "제한된 디바이스 자원에 맞게 모델 크기를 줄이는 기법을 선택하세요."
    },
    {
      id: "mock3-050-qlora-low-bit-quantization",
      conceptId: "qlora-quantization-bit-width",
      difficulty: "easy",
      category: "모델 경량화 및 파인튜닝",
      questionType: "multiple-choice",
      prompt: "QLoRA 기법에서 기본 모델 가중치를 메모리에 적재할 때 적용하는 저비트 양자화 수준은?",
      options: [
        "4비트",
        "8비트",
        "16비트",
        "32비트"
      ],
      answer: 0,
      explanation: "QLoRA는 기본 모델 가중치를 4비트(NF4 등)로 강하게 양자화하여 메모리 점유율을 대폭 낮춘 상태로 고정하고 어댑터만 고정밀도로 학습합니다.",
      hint: "4비트 정상 포맷(NF4) 양자화를 적용합니다."
    },
    {
      id: "mock3-051-distillation-teacher-student-mc",
      conceptId: "distillation-teacher-student-roles",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "지식 증류(Knowledge Distillation)에서 대형 모델과 소형 모델의 역할 연결로 옳은 것은?",
      options: [
        "인코더 모델 - 디코더 모델",
        "액터 모델 - 크리틱 모델",
        "교사 모델 - 학생 모델",
        "라우터 모델 - 에이전트 모델"
      ],
      answer: 2,
      explanation: "지식 증류는 대형 교사 모델(Teacher)의 지식을 작고 가벼운 학생 모델(Student)이 모방하도록 학습시키는 구조입니다.",
      hint: "교사와 학생의 역할을 떠올려보세요."
    },
    {
      id: "mock3-052-model-compression-tradeoff-mc",
      conceptId: "compression-accuracy-tradeoff-concept",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "인공지능 모델에 높은 수준의 압축과 경량화를 적용할 때 발생하는 일반적인 트레이드오프는?",
      options: [
        "연산 효율이 향상되는 대신 모델의 예측 정확도가 일부 저하될 수 있다.",
        "학습에 필요한 데이터 요구량이 0으로 줄어든다.",
        "파라미터 파일의 디스크 저장 용량이 10배 증가한다.",
        "하드웨어 전력 소모량이 원래보다 항상 증가한다."
      ],
      answer: 0,
      explanation: "모델을 강하게 압축할수록 메모리와 연산 속도는 향상되지만, 모델의 표현력이 일부 손실되어 예측 정확도(Accuracy)가 저하될 수 있는 트레이드오프가 있습니다.",
      hint: "압축률과 정확도 사이의 균형 관계를 생각해보세요."
    },
    {
      id: "mock3-053-ood-adaptive-sensing-mc",
      conceptId: "ood-adaptive-sensing-concept",
      difficulty: "easy",
      category: "적응적 센싱 및 모델 설계",
      questionType: "multiple-choice",
      prompt: "학습 데이터와 환경이 다른 OOD 상황에서 모델의 입력 품질을 개선하기 위한 적응적 센싱의 접근법은?",
      options: [
        "주변 환경에 맞춰 카메라 등 센서 설정을 능동적으로 조절한다.",
        "모델의 입력값을 항상 동일한 상수로 고정한다.",
        "모든 외부 센서의 연결을 완전히 비활성화한다.",
        "사전 학습 데이터셋을 모두 영구 삭제한다."
      ],
      answer: 0,
      explanation: "낯선 OOD(분포 밖) 환경을 마주했을 때 카메라 등 센서 파라미터를 적절히 조절하여 모델이 인식하기 좋은 양질의 데이터를 취득하는 방식을 적응적 센싱(Adaptive Sensing)이라고 합니다.",
      hint: "환경에 맞추어 센서를 조절하는 적응적 센싱 기법입니다."
    },
    {
      id: "mock3-054-physical-ai-characteristics-mc",
      conceptId: "physical-ai-scaling-comparison",
      difficulty: "easy",
      category: "적응적 센싱 및 모델 설계",
      questionType: "multiple-choice",
      prompt: "AI 스케일링(Scaling)과 피지컬 AI(Physical AI)를 비교한 설명으로 옳은 것은?",
      options: [
        "스케일링은 센서 제어를 뜻하고, Physical AI는 모델 압축을 뜻한다.",
        "스케일링은 모델 경량화를 뜻하고, Physical AI는 텍스트 생성을 뜻한다.",
        "스케일링은 자원 규모 확대이고, Physical AI는 실제 환경의 인식·행동이다.",
        "두 개념 모두 모델의 파라미터 크기를 줄이는 경량화 방법이다."
      ],
      answer: 2,
      explanation: "Scaling은 파라미터, 데이터, 컴퓨팅 규모를 확대하여 성능을 높이는 전략이며, Physical AI는 텍스트를 넘어 실제 물리 세계에서 센서로 환경을 인지하고 행동하는 인공지능입니다.",
      hint: "규모를 키우는 법칙과 물리 세계에서 행동하는 AI의 차이입니다."
    },
    {
      id: "mock3-055-cnn-inductive-bias-mc",
      conceptId: "cnn-spatial-locality-bias",
      difficulty: "easy",
      category: "컴퓨터 비전 및 도메인 지식",
      questionType: "multiple-choice",
      prompt: "합성곱 신경망(CNN)이 이미지 처리에 뛰어난 성능을 보이는 구조적 귀납 편향은?",
      options: [
        "시간적 불변성",
        "채널 독립성",
        "완전 연결성",
        "공간적 지역성"
      ],
      answer: 3,
      explanation: "CNN은 인간의 시각 인지 방식을 모방하여 인접한 픽셀들 간의 상관관계가 높다는 공간적 지역성(Spatial Locality)의 귀납적 편향을 구조에 반영합니다.",
      hint: "가까운 위치의 픽셀들을 묶어서 보는 특성입니다."
    },
    {
      id: "mock3-056-vit-positional-embedding-mc",
      conceptId: "vit-positional-embedding-role",
      difficulty: "easy",
      category: "컴퓨터 비전 및 도메인 지식",
      questionType: "multiple-choice",
      prompt: "비전 트랜스포머(ViT)에서 이미지 패치들이 입력될 때 공간적 위치 순서 정보를 부여하는 벡터는?",
      options: [
        "어파인 스케일",
        "바이어스 상수",
        "소프트맥스 가중치",
        "위치 임베딩"
      ],
      answer: 3,
      explanation: "트랜스포머 구조는 입력 순서에 무관하므로, 분할된 이미지 패치들의 2차원 공간상 위치 정보를 보존하기 위해 위치 임베딩(Positional Embedding)을 패치 임베딩에 더해줍니다.",
      hint: "패치의 공간 위치를 모델에 알려주는 임베딩입니다."
    },
    {
      id: "mock3-057-agent-action-loop-mc",
      conceptId: "ai-agent-action-loop-mc",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "AI Agent가 외부 환경과 상호작용하며 자율적으로 작업을 해결하는 핵심 순환 과정은?",
      options: [
        "컴파일 -> 링크 -> 로드 -> 디버그",
        "지각 -> 계획 -> 행동 -> 환경 피드백",
        "양자화 -> 가지치기 -> 지식증류 -> 튜닝",
        "사전학습 -> 어휘분리 -> 역색인 -> 임베딩"
      ],
      answer: 1,
      explanation: "AI 에이전트는 환경을 인식(지각)하고, 목표를 위해 계획을 수립한 뒤, 도구를 통해 행동하고, 그 결과를 피드백받아 다음 결정을 내리는 순환 루프로 작동합니다.",
      hint: "인식하고 계획하여 행동하고 피드백을 받는 순환 흐름입니다."
    },
    {
      id: "mock3-058-distribution-shift-mc",
      conceptId: "distribution-shift-concept-mc",
      difficulty: "easy",
      category: "적응적 센싱 및 모델 설계",
      questionType: "multiple-choice",
      prompt: "인공지능 모델 배포 환경에서 발생하는 '분포 이동(Distribution Shift)'의 의미는?",
      options: [
        "하드웨어 온도가 변하는 현상",
        "손실값이 0에 도달하는 현상",
        "학습과 실제 데이터 분포가 달라지는 현상",
        "가중치 정밀도가 변하는 현상"
      ],
      answer: 2,
      explanation: "분포 이동은 모델이 훈련할 때 보았던 데이터의 통계적 분포와 실제 배포 환경(조도, 노이즈 등)에서 입력되는 테스트 데이터의 분포가 달라져 성능이 저하되는 현상입니다.",
      hint: "학습 데이터 환경과 실제 테스트 환경의 통계적 차이입니다."
    },
    {
      id: "mock3-059-agent-tool-use-purpose-mc",
      conceptId: "agent-tool-use-purpose-mc",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "AI Agent가 검색기, 계산기 등 외부 도구(Tool)를 사용하는 주된 이유는?",
      options: [
        "모델의 파라미터를 삭제하기 위해",
        "검색·계산·외부 기능을 수행하기 위해",
        "프롬프트 길이를 고정하기 위해",
        "자연어 생성을 중단하기 위해"
      ],
      answer: 1,
      explanation: "AI 에이전트는 자체 매개변수 메모리의 한계를 극복하고 최신 정보 검색, 정확한 계산, 외부 시스템 제어 등을 수행하기 위해 외부 도구를 호출합니다.",
      hint: "언어 모델 자체의 한계를 넘어 외부 시스템과 상호작용하기 위한 목적입니다."
    },
    {
      id: "mock3-060-domain-specific-ai-mc",
      conceptId: "domain-specific-ai-design-mc",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "multiple-choice",
      prompt: "의료나 산업 등 특정 전문 분야에 AI 모델을 설계할 때 도메인 전문지식 주입이 필요한 이유는?",
      options: [
        "전문가의 판독 규칙을 반영해 불필요한 시행착오를 줄이고 효율을 높이기 위해",
        "모든 도메인의 데이터가 동일하므로 단일 모델로 통합 관리하기 위해",
        "도메인 전문가가 모델의 모든 가중치를 수작업으로 직접 입력하기 위해",
        "딥러닝 역전파 알고리즘의 수학적 연산을 완전히 생략하기 위해"
      ],
      answer: 0,
      explanation: "도메인 전문지식(임상 판독 방식, 물리 법칙 등)을 모델 구조에 반영(Inductive Bias)하면 불필요한 탐색을 줄이고 적은 데이터로도 높은 정확도와 신뢰성을 확보할 수 있습니다.",
      hint: "전문 지식과 규칙을 반영하여 학습 효율과 정확도를 높이는 목적입니다."
    }
  ],
  medium: [],
  hard: [],
  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();