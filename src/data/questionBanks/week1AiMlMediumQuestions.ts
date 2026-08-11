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

export const QUESTION_BANK: Record<string, StudyQuestion[]> = {
  medium: [
    // ==========================================
    // 카테고리 1: AI/ML 기초 및 데이터 (15문항)
    // ==========================================
    {
      id: "ml-c1-mc-med-001",
      conceptId: "ai-vs-ml-rule-based",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "규칙 기반(Rule-based) 시스템과 머신러닝(ML) 시스템의 가장 결정적인 구조적 차이점은 무엇인가?",
      options: [
        "규칙 기반은 사람이 직접 명시적 규칙을 코딩하지만, ML은 데이터로부터 규칙을 자동으로 학습한다.",
        "규칙 기반은 신경망을 사용하고, ML은 조건문만 사용한다.",
        "규칙 기반은 항상 오차가 0이지만, ML은 항상 100% 오류가 발생한다.",
        "규칙 기반은 비지도학습만 가능하고, ML은 지도학습만 가능하다."
      ],
      answer: 0,
      explanation: "규칙 기반 AI는 사람이 명시적으로 코딩한 규칙에 의존하지만, ML은 데이터로부터 관계 및 규칙을 자동 추론하여 학습합니다[cite: 5].",
      hint: "사람이 규칙을 직접 코딩하는지, 데이터에서 스스로 배우는지 차이입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-med-002",
      conceptId: "feature-label-dimension",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "특성 벡터 $X = [X_1, X_2, ..., X_p]^\\top \\in \\mathbb{R}^p$와 목표 변수 $Y$에 대한 설명으로 옳은 것은?",
      options: [
        "$X$는 $p$개의 독립 변수(Feature)로 이루어진 $p$차원 벡터이며, $Y$는 예측 대상이 되는 종속 변수(Label)이다.",
        "$X$는 항상 1차원 스칼라값이어야 하며, $Y$는 $p$차원 벡터여야 한다.",
        "$p$의 크기가 커질수록 가설 공간의 크기는 무조건 0으로 줄어든다.",
        "$Y$는 항상 연속적인 수치만 가능하며 범주형은 불가능하다."
      ],
      answer: 0,
      explanation: "$X$는 $p$개의 피처(특성)를 가진 $p$차원 입력 벡터이며, $Y$는 모델이 예측하고자 하는 라벨(목표 변수)입니다[cite: 5].",
      hint: "$X$의 차원 수 $p$는 입력 피처의 개수를 뜻합니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-med-003",
      conceptId: "true-function-and-error-assumption",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "모형 가정 $Y = f^*(X) + \\epsilon$에서 측정 오차 $\\epsilon$에 대한 일반적인 통계적 가정으로 옳은 것은?",
      options: [
        "$\\epsilon$은 입력 특성 $X$와 독립이며, 기댓값 $E[\\epsilon] = 0$ 이다.",
        "$\\epsilon$은 항상 양수의 상숫값으로 고정된다.",
        "$\\epsilon$은 $X$의 값에 비례하여 무한히 커지는 함수이다.",
        "$\\epsilon$은 모델이 학습을 거치면 완전히 0으로 소멸된다."
      ],
      answer: 0,
      explanation: "일반적으로 측정 오차 $\\epsilon$은 $X$와 독립이며 평균(기댓값)이 0인 확률 변수로 가정합니다[cite: 5].",
      hint: "오차의 기댓값은 0이며 피처 $X$와 독립적입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-med-004",
      conceptId: "hypothesis-space-model-relation",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "가설 공간 $\\mathcal{F}$와 학습된 모델 $f$의 관계에 대한 설명으로 가장 적절한 것은?",
      options: [
        "가설 공간 $\\mathcal{F}$는 선택 가능한 모든 후보 함수들의 집합이며, 모델 $f$는 학습을 통해 선택된 $\\mathcal{F}$ 내의 특정 함수이다.",
        "가설 공간 $\\mathcal{F}$는 훈련 데이터셋 자체를 의미한다.",
        "모델 $f$는 가설 공간 $\\mathcal{F}$와 아무런 상관이 없는 외부 상수이다.",
        "선형 가설 공간에서는 비선형 곡선 모델 $f$만 선택될 수 있다."
      ],
      answer: 0,
      explanation: "가설 공간 $\\mathcal{F}$라는 후보 함수 집합 속에서 데이터와 손실함수를 바탕으로 최적의 모델(함수 $f$) 하나를 고르는 것이 학습입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-med-005",
      conceptId: "why-learn-f-three-reasons",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "머신러닝에서 함수 $f(X)$를 학습시키는 주요 목적 3가지(예측, 중요 특성 파악, 해석 가능성) 중 '중요 특성 파악'에 해당하는 설명은?",
      options: [
        "여러 피처들 중 어떤 피처가 라벨 $Y$를 설명하는 데 중요하고 어떤 것이 무관한지 식별하는 것",
        "새로운 입력 $X=x$에 대한 출력 $Y$의 값을 계산하는 것",
        "특성 $X_i$의 변화 방향에 따른 $Y$의 민감도를 파악하는 것",
        "데이터의 측정 오차 $\\epsilon$을 지우는 것"
      ],
      answer: 0,
      explanation: "중요 특성 파악은 다양한 입력 피처 중 정답 $Y$에 영향을 주는 유의미한 피처를 구분해내는 것입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-med-006",
      conceptId: "2d-feature-surface",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "피처가 2개인 2D 피처 공간에서 참 함수 $f^*(X_1, X_2)$가 형성하는 기하학적 형태는 무엇인가?",
      options: ["3차원 공간상의 곡면(Surface) 또는 평면", "1차원 직렬 선분", "단일 점(Point)", "4차원 초구"],
      answer: 0,
      explanation: "2개의 입력 피처($X_1, X_2$)와 1개의 출력($Y$)은 3차원 공간상에서 곡면(Surface) 또는 평면 형태를 이룹니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-med-007",
      conceptId: "data-quality-impact",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "머신러닝 학습 결과에 있어 '데이터(Feature/Label)'가 결정적인 역할을 하는 이유는 무엇인가?",
      options: [
        "머신러닝은 규칙을 직접 코딩하지 않고, 데이터의 분포와 관계로부터 규칙을 추론하기 때문에",
        "데이터가 없어도 가설 공간만 있으면 모델이 스스로 완성되기 때문에",
        "데이터는 오직 평가 단계에서만 사용되기 때문에",
        "데이터의 특성은 모델의 정확도에 아무런 영향을 주지 않기 때문에"
      ],
      answer: 0,
      explanation: "머신러닝은 데이터에 내재된 특성과 라벨 간의 관계 패턴을 학습하여 규칙을 도출하므로 데이터의 품질이 결과를 결정합니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-med-008",
      conceptId: "interpretability-of-f",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "학습된 모델 $f$의 '해석 가능성(Interpretability)'이 높다는 것의 의미는?",
      options: [
        "각 피처 $X_i$의 변화가 정답 $Y$에 미치는 영향의 방향(증가/감소)과 정도를 사람이 쉽게 이해할 수 있음",
        "모델의 파라미터 개수가 무한대로 크다는 뜻임",
        "모델의 예측 오차가 정확히 0이라는 뜻임",
        "모든 입력에 대해 무조건 1만 출력한다는 뜻임"
      ],
      answer: 0,
      explanation: "해석 가능성이 높으면 입력 특성의 변화에 따라 출력값이 어떻게 변하는지 민감도와 방향성을 원인 분석할 수 있습니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-med-009",
      conceptId: "ml-loop-feedback",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "머신러닝 루프(Data $\\rightarrow$ Model $\\rightarrow$ Train $\\rightarrow$ Eval)에서 평가(Eval) 단계 이후 수행되는 작업은?",
      options: [
        "평가 결과를 바탕으로 데이터 재정제, 모델 구조 변경, 학습 방법 수정을 반복적으로 개선함",
        "모델 학습을 영구히 종료하고 데이터를 삭제함",
        "평가 점수와 관계없이 항상 무조건 배포함",
        "가설 공간의 크기를 0으로 만듦"
      ],
      answer: 0,
      explanation: "평가 결과를 분석하여 미흡한 경우 데이터 수집/정제, 모델 가설공간 변경, 손실함수 조정을 피드백 루프로 반복합니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-med-010",
      conceptId: "loss-function-role-in-learning",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "학습 과정에서 '손실 함수(Loss Function)'가 수행하는 핵심 역할은 무엇인가?",
      options: [
        "가설 공간 내 수많은 후보 함수 중 어떤 함수가 데이터를 더 잘 설명하는지 판단하는 정량적 척도 제공",
        "입력 데이터의 피처 개수를 자동으로 늘려주는 역할",
        "측정 오차 $\\epsilon$의 발생을 사전에 막아주는 역할",
        "모든 예측값을 정수로 바꿔주는 역할"
      ],
      answer: 0,
      explanation: "손실 함수는 모델 예측값과 실제 정답 간의 틀린 정도를 수치화하여, 어떤 함수가 더 우수한지 판단하는 기준이 됩니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-med-011",
      conceptId: "feature-types-variety",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "머신러닝의 입력 특성(Feature)에 관한 설명 중 옳지 않은 것은?",
      options: [
        "Feature는 반드시 연속적인 수치형(Numerical) 데이터만 될 수 있다.",
        "Feature는 수치형뿐만 아니라 범주형, 텍스트, 이미지, 오디오 등 다양한 형태가 가능하다.",
        "유튜브 추천에서 사용자의 시청 이력과 좋아요 클릭 여부는 주요 Feature가 된다.",
        "Feature의 품질과 선정이 모델의 예측 성능을 높이는 데 매우 중요하다."
      ],
      answer: 0,
      explanation: "Feature는 수치형 데이터뿐만 아니라 범주형, 텍스트, 이미지, 음성 등 다양한 형태로 표현될 수 있습니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-med-012",
      conceptId: "sample-vs-population-data",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "우리가 관측하여 학습에 사용하는 데이터셋 $D$에 대한 올바른 통계적 이해는?",
      options: [
        "모집단(Population) 전체가 아닌 일부분인 표본(Sample)이며, 우연한 측정 오차가 포함되어 있다.",
        "모집단 전체를 완벽하게 포함하고 있는 무결점 데이터이다.",
        "측정 오차가 전혀 없는 참 함수 $f^*$ 그 자체이다.",
        "표본 데이터이므로 정답 라벨을 전혀 사용할 수 없다."
      ],
      answer: 0,
      explanation: "학습 데이터셋 $D$는 모집단의 일부분인 표본(Sample)에 불과하며 노이즈나 측정 오차가 섞여 있습니다[cite: 5]."
    },
    {
      id: "ml-c1-sa-med-013",
      conceptId: "hypothesis-space-sym-sa",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "short-answer",
      prompt: "피처 공간과 라벨 공간 위에서 정의된, 모델이 선택할 수 있는 모든 후보 함수들의 집합을 나타내는 기호/용어는?",
      options: [],
      answer: null,
      acceptedAnswers: ["가설 공간", "가설공간", "Hypothesis Space", "F", "캘리그라피 F"],
      explanation: "후보 함수들의 모임인 가설 공간($\\mathcal{F}$) 입니다[cite: 5]."
    },
    {
      id: "ml-c1-sa-med-014",
      conceptId: "true-function-sym-sa",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "short-answer",
      prompt: "특성 $X$와 라벨 $Y$ 사이의 실제 평균 관계를 나타내며, 직접 관측할 수는 없지만 모델이 근사하고자 하는 미지의 함수 표기는?",
      options: [],
      answer: null,
      acceptedAnswers: ["f*", "f^*", "참 함수", "미지의 참 함수", "true function"],
      explanation: "관측 불가능한 미지의 참 함수 $f^*(X)$ 입니다[cite: 5]."
    },
    {
      id: "ml-c1-es-med-015",
      conceptId: "true-function-formula-essay",
      difficulty: "medium",
      category: "AI/ML 기초 및 데이터",
      questionType: "essay",
      prompt: "모형 가정 수식 $Y = f^*(X) + \\epsilon$ 의 각 구성요소 의미를 설명하고, 우리가 직접 관측할 수 없는 $f^*(X)$를 학습을 통해 근사(추정)하려는 목적 3가지를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["참 함수", "측정 오차", "예측", "중요 특성", "해석"],
      modelAnswer: "$f^*(X)$는 특성과 라벨 사이의 관측 불가능한 미지의 참 함수이며, $\\epsilon$은 독립적인 측정 오차이다. $f(X)$를 학습하는 3가지 목적은 1) 새로운 입력에 대한 정답 예측, 2) 정답에 영향을 미치는 중요 특성 파악, 3) 특성 변화에 따른 정답의 반응 방향 및 민감도에 대한 해석 가능성 확보이다[cite: 5].",
      rubricKeywords: ["참 함수 $f^*$", "측정 오차 $\\epsilon$", "예측", "중요 특성 파악", "해석 가능성"],
      minLength: 20,
      explanation: "수식 구성요소 설명과 학습의 3가지 목적(예측, 중요 특성 파악, 해석 가능성)을 작성합니다[cite: 5]."
    },

    // ==========================================
    // 카테고리 2: 지도학습 및 평가 지표 (15문항)
    // ==========================================
    {
      id: "ml-c2-mc-med-001",
      conceptId: "mse-vs-cross-entropy-usage",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "지도학습의 문제 유형에 따른 대표 손실함수 매핑이 올바르게 연결된 것은?",
      options: [
        "회귀(Regression) $\\rightarrow$ 평균제곱오차(MSE), 분류(Classification) $\\rightarrow$ 교차 엔트로피(Cross Entropy)",
        "회귀 $\\rightarrow$ 교차 엔트로피, 분류 $\\rightarrow$ 평균제곱오차(MSE)",
        "회귀 $\\rightarrow$ 정확도(Accuracy), 분류 $\\rightarrow$ 결정계수($R^2$)",
        "회귀 $\\rightarrow$ 혼동행렬, 분류 $\\rightarrow$ 정규방정식"
      ],
      answer: 0,
      explanation: "연속 수치를 예측하는 회귀에는 MSE, 범주 확률을 예측하는 분류에는 Cross Entropy 손실을 적용합니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-med-002",
      conceptId: "mse-formula-quadratic-penalty",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "회귀 손실함수 $\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2$ 에서 오차 $(y_i - \\hat{y}_i)$를 제곱해 줌으로써 얻는 특성은?",
      options: [
        "오차의 음수/양수 부호를 제거하고, 큰 오차에 대해 더 강한 가중 페널티를 부과한다.",
        "큰 오차를 작은 오차보다 더 무시하게 만든다.",
        "MSE 수치가 항상 1보다 커지도록 보장한다.",
        "오차의 단위를 원본 데이터와 완전히 일치시킨다."
      ],
      answer: 0,
      explanation: "제곱 연산은 절댓값이 큰 오차일수록 손실 수치를 급격하게 증가시켜 큰 오류에 가중 페널티를 줍니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-med-003",
      conceptId: "r2-score-negative-case",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "결정계수 $R^2 = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}$ 수식에서 $R^2$ 수치가 음수($< 0$)가 나오는 상황의 의미는?",
      options: [
        "모델의 예측 성능이 단순 정답 평균값($\\bar{y}$)으로만 예측하는 것보다도 더 나쁜 경우",
        "모델의 예측이 100% 완벽한 경우",
        "데이터에 측정 오차가 전혀 없는 경우",
        "회귀 직선의 기울기가 음수인 경우"
      ],
      answer: 0,
      explanation: "모델의 잔차제곱합이 평균 기준 전체제곱합보다 크면 $R^2$이 음수가 나오며, 이는 단순 평균 예측보다 못한 최악의 모델임을 뜻합니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-med-004",
      conceptId: "mse-vs-r2-comparison-detail",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "회귀 평가 지표인 MSE와 $R^2$의 비교 설명으로 옳지 않은 것은?",
      options: [
        "MSE는 0~1 사이의 값만 가지며, $R^2$은 무한대 범위를 갖는다.",
        "MSE는 구체적인 오차의 절대 크기를 알려주지만 단위 때문에 직관적 비교가 어려울 수 있다.",
        "$R^2$은 0~1 사이(음수 가능)의 상대적 설명력 비율을 나타내어 모델 간 비교가 쉽다.",
        "두 지표는 상호 보완적으로 함께 사용하는 것이 바람직하다."
      ],
      answer: 0,
      explanation: "MSE의 값 범위는 $0 \\sim \\infty$ 이며, $R^2$의 값 범위가 $0 \\sim 1$ (단순 평균보다 못할 시 음수 가능) 입니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-med-005",
      conceptId: "confusion-matrix-four-types",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "혼동행렬의 4가지 구성 요소 중 '실제는 양성(Positive)인데 모델이 음성(Negative)이라고 잘못 예측'하여 발생한 오탐/누적 오류는?",
      options: ["FN (False Negative)", "FP (False Positive)", "TP (True Positive)", "TN (True Negative)"],
      answer: 0,
      explanation: "실제 양성을 음성이라고 잘못 말한 것은 False Negative(FN / 누적, 미진단 오류)입니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-med-006",
      conceptId: "f1-score-formula-harmonic-mean",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "정밀도(Precision)와 재현율(Recall)을 이용해 F1-score를 산출하는 올바른 수식은?",
      options: [
        "$\\text{F1} = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$",
        "$\\text{F1} = \\frac{\\text{Precision} + \\text{Recall}}{2}$",
        "$\\text{F1} = \\text{Precision} \\times \\text{Recall}$",
        "$\\text{F1} = \\sqrt{\\text{Precision}^2 + \\text{Recall}^2}$"
      ],
      answer: 0,
      explanation: "F1-score는 정밀도와 재현율의 조화평균(Harmonic Mean) 공식 $2 \\times \\frac{P \\times R}{P + R}$ 로 계산됩니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-med-007",
      conceptId: "indicator-function-accuracy",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "정확도 수식 $\\text{Accuracy} = \\frac{1}{n} \\sum_{i=1}^n \\mathbb{I}(y_i = \\hat{y}_i)$ 에 포함된 지시 함수 $\\mathbb{I}(A)$의 동작은?",
      options: [
        "조건 $A$가 참(True)이면 1, 거짓(False)이면 0을 반환한다.",
        "조건 $A$의 값에 상관없이 항상 $A$의 절댓값을 반환한다.",
        "조건 $A$가 참이면 0, 거짓이면 1을 반환한다.",
        "오차의 제곱값을 반환한다."
      ],
      answer: 0,
      explanation: "지시 함수 $\\mathbb{I}$는 괄호 안의 조건이 참이면 1(맞춤), 거짓이면 0(틀림)을 출력하는 함수입니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-med-008",
      conceptId: "cross-entropy-prob-penalty",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "교차 엔트로피 손실 $\\text{CE} = -\\log(\\hat{p}_{\\text{target}})$ 에서 모델이 정답 클래스에 부과한 예측 확률 $\\hat{p}_{\\text{target}}$이 0에 가까워질 때 손실값의 변화는?",
      options: [
        "손실(Loss) 값이 무한대($+\\infty$) 방향으로 급격히 커진다.",
        "손실 값이 0으로 수렴한다.",
        "손실 값이 음수로 바뀐다.",
        "손실 값이 항상 1로 고정된다."
      ],
      answer: 0,
      explanation: "정답에 준 확률이 0에 가까워지면 $-\\log(0) \\to +\\infty$ 가 되어 모델에 매우 강력한 손실 페널티를 부과합니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-med-009",
      conceptId: "data-shift-vs-overfitting",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "훈련 데이터 환경과 실전 테스트 데이터 환경의 센서/계절/카메라 변경 등으로 분포 자체가 달라져 성능이 떨어지는 현상은?",
      options: ["분포 변화 (Distribution Shift)", "오버피팅 (Overfitting)", "언더피팅 (Underfitting)", "차원의 저주"],
      answer: 0,
      explanation: "훈련과 테스트의 데이터 생성 분포 자체가 달라져 생기는 오류 증가 현상은 과적합이 아닌 분포 변화(Distribution Shift)입니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-med-010",
      conceptId: "underfitting-vs-overfitting-errors",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "언더피팅(Underfitting)과 오버피팅(Overfitting) 발생 시 훈련 오류(Train Error)와 테스트 오류(Test Error)의 양상 연결이 올바른 것은?",
      options: [
        "언더피팅: 훈련 오류 높음 & 테스트 오류 높음 / 오버피팅: 훈련 오류 매우 낮음 & 테스트 오류 높음",
        "언더피팅: 훈련 오류 낮음 & 테스트 오류 높음 / 오버피팅: 훈련 오류 높음 & 테스트 오류 높음",
        "언더피팅: 훈련 오류 낮음 & 테스트 오류 낮음 / 오버피팅: 훈련 오류 높음 & 테스트 오류 낮음",
        "두 현상 모두 훈련 오류와 테스트 오류가 항상 0이다."
      ],
      answer: 0,
      explanation: "언더피팅은 모델이 약해 둘 다 오류가 높고, 오버피팅은 훈련 데이터를 외워 훈련 오류만 급격히 낮고 테스트 오류는 높습니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-med-011",
      conceptId: "precision-recall-tradeoff-medical",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "암 환자 진단 시스템처럼 '실제 암 환자를 음성으로 놓치는 것(FN)이 치명적인' 의료 분야에서 가장 집중적으로 높여야 하는 지표는?",
      options: ["재현율 (Recall / Sensitivity)", "정밀도 (Precision)", "MSE", "특이도 (Specificity)"],
      answer: 0,
      explanation: "실제 양성 환자를 누락(FN)하지 않고 최대한 잡아내야 하는 의료 진단에서는 재현율(Recall) 극대화가 핵심입니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-med-012",
      conceptId: "decision-boundary-concept",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "분류 모델이 피처 공간 상에서 서로 다른 클래스(범주) 영역을 나누어 구별해내는 경계선/경계면을 무엇이라 하는가?",
      options: ["결정 경계 (Decision Boundary)", "회귀 직선", "잔차선", "오차 영역"],
      answer: 0,
      explanation: "분류 모델이 클래스 판정을 가르는 공간상의 경계선을 Decision Boundary(결정 경계)라 부릅니다[cite: 5]."
    },
    {
      id: "ml-c2-sa-med-013",
      conceptId: "f1-score-sa",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "short-answer",
      prompt: "정밀도(Precision)와 재현율(Recall)의 조화평균으로 계산되는 분류 평가 지표의 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["F1-score", "F1 score", "F1 스코어", "f1-score", "F1"],
      explanation: "정밀도와 재현율의 조화평균인 F1-score 입니다[cite: 5]."
    },
    {
      id: "ml-c2-sa-med-014",
      conceptId: "cross-entropy-sa",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "short-answer",
      prompt: "분류 모델 학습 시 정답 클래스 확률 $-\\log(\\hat{p})$을 이용해 모델의 확신도를 손실값으로 계산하는 손실함수는?",
      options: [],
      answer: null,
      acceptedAnswers: ["교차 엔트로피", "교차엔트로피", "Cross Entropy", "cross entropy", "Cross-Entropy"],
      explanation: "Cross Entropy(교차 엔트로피) 손실함수입니다[cite: 5]."
    },
    {
      id: "ml-c2-es-med-015",
      conceptId: "precision-recall-f1-essay",
      difficulty: "medium",
      category: "지도학습 및 평가 지표",
      questionType: "essay",
      prompt: "정밀도(Precision)와 재현율(Recall)의 수식 및 정의 차이를 서술하고, 두 지표의 균형을 평가하기 위해 F1-score(조화평균)를 사용하는 이유를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Precision", "Recall", "TP/(TP+FP)", "TP/(TP+FN)", "조화평균"],
      modelAnswer: "정밀도는 모델이 양성이라고 예측한 것 중 진짜 양성 비율 $\\frac{TP}{TP+FP}$ 이고, 재현율은 실제 양성 전체 중 모델이 맞춰낸 비율 $\\frac{TP}{TP+FN}$ 이다. 한쪽 지표만 높이는 편향을 막고 두 지표가 모두 높을 때 큰 값을 갖도록 조화평균인 F1-score를 사용한다[cite: 5].",
      rubricKeywords: ["정밀도 수식 $\\frac{TP}{TP+FP}$", "재현율 수식 $\\frac{TP}{TP+FN}$", "두 지표의 균형/조화평균"],
      minLength: 20,
      explanation: "정밀도와 재현율 수식 정의 및 두 지표의 밸런스를 잡기 위한 조화평균(F1-score) 필요성을 서술합니다[cite: 5]."
    },

    // ==========================================
    // 카테고리 3: 검증 및 교차검증 (15문항)
    // ==========================================
    {
      id: "ml-c3-mc-med-001",
      conceptId: "train-vs-test-underestimation",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "학습에 사용된 데이터로 그대로 계산한 '훈련 오류'가 모델의 실제 성능을 보여주는 '테스트 오류'를 평가할 때 갖는 경향은?",
      options: [
        "훈련 오류는 테스트 오류를 심하게 과소평가(더 좋게 보임)하는 경향이 있다.",
        "훈련 오류는 항상 테스트 오류보다 과대평가된다.",
        "훈련 오류와 테스트 오류는 수학적으로 완벽히 동일하다.",
        "훈련 오류는 항상 테스트 오류의 100배가 된다."
      ],
      answer: 0,
      explanation: "모델은 훈련 데이터를 보고 학습했기 때문에 훈련 오류는 테스트 오류보다 훨씬 낮게 나와 성능을 과소평가(낙관적 착시)하게 됩니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-med-002",
      conceptId: "validation-set-underestimation-subset",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "홀드아웃 검증 시 전체 데이터의 일부(예: 50%)만 훈련셋으로 사용할 경우 발생하는 테스트 오류 추정상의 왜곡은?",
      options: [
        "전체 데이터를 모두 써서 학습할 때보다 훈련 데이터량이 적어 모델 성능이 떨어지므로, 테스트 오류를 과대평가(더 나쁘게 추정)할 수 있다.",
        "테스트 오류를 무조건 0으로 추정한다.",
        "모델의 오버피팅을 100% 제거한다.",
        "훈련 속도가 100배 느려진다."
      ],
      answer: 0,
      explanation: "훈련 데이터의 일부만 쓰면 전체 데이터로 학습할 때보다 모델이 약해져 실제 성능보다 더 나쁘게(테스트 오류 과대평가) 추정될 수 있습니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-med-003",
      conceptId: "k-fold-formula-weighted-sum",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "K-겹 교차검증에서 전체 가중 평균 오류를 구하는 수식 $\\text{CV}_{(K)} = \\sum_{k=1}^K \\frac{n_k}{n} \\text{MSE}_k$ 에 대한 설명으로 옳은 것은?",
      options: [
        "각 폴드 $k$의 샘플 수 $n_k$ 비율을 가중치로 하여 각 폴드에서 측정된 $\\text{MSE}_k$를 가중 합산한다.",
        "모든 폴드의 MSE를 곱한다.",
        "가장 MSE가 높은 폴드 1개의 값만 채택한다.",
        "전체 데이터 개수 $n$으로 나누는 과정을 생략한다."
      ],
      answer: 0,
      explanation: "각 폴드의 크기 $n_k$ 비율에 따라 해당 폴드의 $\\text{MSE}_k$를 가중 평균하여 전체 CV 오차를 산출합니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-med-004",
      conceptId: "loocv-variance-bias-tradeoff",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "medium",
      prompt: "LOOCV($K=n$)가 10-Fold CV 대비 편향(Bias)과 분산(Variance) 관점에서 갖는 특성은?",
      options: [
        "훈련셋 크기가 $n-1$개로 거의 전체이므로 편향(Bias)은 매우 낮지만, 훈련셋들이 거의 유사해 모델 간 상관관계로 분산(Variance)이 커질 수 있다.",
        "편향과 분산 모두 0이 된다.",
        "편향이 극도로 높고 분산은 0이다.",
        "10-Fold CV보다 연산량이 100배 적다."
      ],
      answer: 0,
      explanation: "LOOCV는 거의 전체 데이터($n-1$)로 학습해 편향은 낮지만, 분할된 훈련셋 간 높은 겹침으로 오차 추정치의 분산이 커질 위험이 있습니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-med-005",
      conceptId: "loocv-vs-10fold-practicality",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "시뮬레이션 비교 실험 결과, LOOCV와 10-Fold CV를 비교했을 때 얻어진 결론으로 바른 것은?",
      options: [
        "두 방식의 테스트 오류 곡선 경향과 최적 모델 복잡도 선택 결과가 비슷하므로 연산량이 훨씬 적은 10-Fold CV를 선택하는 것이 효율적이다.",
        "LOOCV의 성능이 10-Fold CV보다 무조건 100배 뛰어나므로 무조건 LOOCV만 써야 한다.",
        "10-Fold CV는 오류 추정이 불가능하다.",
        "두 방식 모두 훈련 오류보다 테스트 오류가 항상 낮게 나온다."
      ],
      answer: 0,
      explanation: "LOOCV는 $n$번 재학습 오버헤드가 큰 반면 10-Fold CV와 최적 모델 선택 결과가 비슷하므로 적절한 $K$(5 또는 10)를 쓰는 것이 좋습니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-med-006",
      conceptId: "data-leakage-cv",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "교차검증 시 각 폴드(Fold) 구성에 있어 반드시 지켜야 할 원칙은?",
      options: [
        "검증 폴드에 속한 데이터가 훈련 폴드 데이터와 중복/겹치지 않도록 완전히 분리되어야 한다.",
        "모든 폴드에 동일한 데이터 샘플이 100% 겹쳐서 들어가야 한다.",
        "검증 폴드의 크기를 훈련 폴드보다 10배 크게 만들어야 한다.",
        "데이터 순서를 정렬한 뒤 셔플링을 금지해야 한다."
      ],
      answer: 0,
      explanation: "검증 데이터가 훈련에 오염되어 들어가는 Data Leakage를 막기 위해 폴드 간 데이터가 서로 겹치지 않아야 합니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-med-007",
      conceptId: "bias-variance-complexity-curve",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "모델 복잡도(Model Complexity) 변화에 따른 편향(Bias)과 분산(Variance)의 트레이드오프 변화는?",
      options: [
        "모델이 단순할수록 높은 편향(High Bias)을 갖고, 모델이 복잡해질수록 높은 분산(High Variance)을 갖는다.",
        "모델이 단순할수록 높은 분산을 갖고, 복잡해질수록 높은 편향을 갖는다.",
        "모델 복잡도와 편향/분산은 아무 관계가 없다.",
        "복잡도가 커질수록 편향과 분산이 모두 0으로 수렴한다."
      ],
      answer: 0,
      explanation: "단순한 모델은 데이터 패턴을 못 담아 Bias가 높고(과소적합), 복잡한 모델은 노이즈까지 배워 Variance가 높습니다(과적합)[cite: 5]."
    },
    {
      id: "ml-c3-mc-med-008",
      conceptId: "resampling-validation-need",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "현실에서 평가만을 위한 충분히 큰 별도의 테스트 데이터셋을 확보하기 어려울 때 재표본화(Resampling)를 쓰는 목적은?",
      options: [
        "기존 훈련 데이터를 여러 번 나누어 활용함으로써 별도 테스트셋 없이도 일반화 오차를 효과적으로 추정하기 위해",
        "데이터의 개수를 무한대로 증식시키기 위해",
        "학습 가중치를 0으로 초기화하기 위해",
        "회귀 문제를 분류 문제로 변경하기 위해"
      ],
      answer: 0,
      explanation: "한정된 데이터를 분할 재사용하여 실제 테스트 환경에서의 일반화 오차를 가늠하기 위해 교차검증 등 재표본화를 씁니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-med-009",
      conceptId: "stratified-k-fold-need",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "medium",
      prompt: "분류 문제에서 클래스 비율이 불균형할 때 일반 K-fold 대신 각 폴드마다 클래스 비율을 동일하게 유지해 주는 교차검증 기법은?",
      options: ["Stratified K-fold 교차검증", "LOOCV", "Hold-out", "Random Walk"],
      answer: 0,
      explanation: "Stratified K-fold는 원본 데이터의 클래스 비율(예: 9:1)을 각 폴드에 동일한 비율로 분할 보장합니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-med-010",
      conceptId: "test-error-u-shape-bottom",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "교차검증을 통해 얻은 테스트 오류 곡선(U자형)에서 최종 모델로 선택해야 하는 최적 지점은?",
      options: [
        "테스트 오류 곡선이 최솟값(바닥)을 이루는 모델 복잡도 지점",
        "훈련 오류가 0이 되는 가장 복잡한 지점",
        "모델 복잡도가 가장 낮아 훈련 오류가 제일 높은 지점",
        "테스트 오류가 급격히 상승하기 시작하는 오른쪽 끝 지점"
      ],
      answer: 0,
      explanation: "과소적합과 과적합 사이, 테스트 오류 곡선이 최저점을 형성하는 지점의 모델을 선택해야 최고의 일반화 성능을 얻습니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-med-011",
      conceptId: "hyperparameter-tuning-validation",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "학습 알고리즘의 하이퍼파라미터(예: 다항식 차수, 신경망 층수)를 튜닝할 때 훈련셋 오류가 아닌 검증셋 오류를 기준으로 선택해야 하는 이유는?",
      options: [
        "훈련셋 오류 기준 선택 시 오버피팅을 일으키는 가장 복잡한 하이퍼파라미터가 잘못 선택되기 때문에",
        "검증셋 오류는 항상 0이기 때문에",
        "훈련셋 오류는 계산이 불가능하기 때문에",
        "하이퍼파라미터는 모델 성능과 아무 상관이 없기 때문에"
      ],
      answer: 0,
      explanation: "훈련 오류 기준으로는 무조건 가장 복잡한 모델이 선택되어 오버피팅되므로, 검증셋 오차를 기준으로 하이퍼파라미터를 결정해야 합니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-med-012",
      conceptId: "holdout-shuffling-need",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "데이터 분할 전 무작위 셔플링(Random Shuffling)을 거쳐야 하는 주요 이유는?",
      options: [
        "데이터가 특정 라벨 순서대로 정렬되어 있어 특정 클래스가 검증셋에만 쏠리는 편향을 막기 위해",
        "데이터의 개수를 2배로 늘리기 위해",
        "모든 숫자를 음수로 바꾸기 위해",
        "회귀 문제를 분류 문제로 바꾸기 위해"
      ],
      answer: 0,
      explanation: "데이터가 라벨 순서대로 정렬된 경우 셔플링 없이 자르면 특정 클래스가 한쪽 셋에 몰리는 심각한 데이터 편향이 발생합니다[cite: 5]."
    },
    {
      id: "ml-c3-sa-med-013",
      conceptId: "resampling-sa",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "short-answer",
      prompt: "한정된 데이터셋에서 훈련과 평가를 반복 수행해 테스트 오류를 가늠하는 홀드아웃, K-fold 등을 통칭하는 기법명은?",
      options: [],
      answer: null,
      acceptedAnswers: ["재표본화", "재표본화 기법", "Resampling", "resampling"],
      explanation: "Resampling(재표본화) 기법입니다[cite: 5]."
    },
    {
      id: "ml-c3-sa-med-014",
      conceptId: "stratified-k-fold-sa",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "short-answer",
      prompt: "불균형 분류 데이터에서 각 폴드별 클래스 분포 비율을 원본과 동일하게 유지해 분할하는 교차검증 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Stratified K-fold", "stratified k-fold", "층적 K-겹 교차검증", "Stratified K-Fold"],
      explanation: "Stratified K-fold 교차검증 기법입니다[cite: 5]."
    },
    {
      id: "ml-c3-es-med-015",
      conceptId: "u-shape-test-error-essay",
      difficulty: "medium",
      category: "검증 및 교차검증",
      questionType: "essay",
      prompt: "모델 복잡도 증가에 따라 훈련 오류와 테스트 오류가 각각 어떻게 변화하는지 설명하고, 테스트 오류가 U자형 곡선을 그리는 이유를 편향-분산(Bias-Variance) 관점에서 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["훈련 오류 감소", "테스트 오류 U자", "편향", "분산"],
      modelAnswer: "모델 복잡도가 올라갈수록 훈련 오류는 계속 감소한다. 하지만 테스트 오류는 단순한 모델 구간에서는 높은 편향(High Bias / 언더피팅)으로 오류가 크고, 너무 복잡한 구간에서는 높은 분산(High Variance / 오버피팅)으로 오류가 다시 올라가므로 U자형 곡선을 그린다[cite: 5].",
      rubricKeywords: ["훈련 오류 지속 감소", "언더피팅 높은 편향", "오버피팅 높은 분산", "테스트 오류 U자형"],
      minLength: 20,
      explanation: "모델 복잡도에 따른 훈련/테스트 오류 곡선 양상과 언더피팅(Bias) $\\rightarrow$ 최적 $\\rightarrow$ 오버피팅(Variance)에 의한 U자형 원리를 서술합니다[cite: 5]."
    },

    // ==========================================
    // 카테고리 4: 비지도학습 및 군집화 (15문항)
    // ==========================================
    {
      id: "ml-c4-mc-med-001",
      conceptId: "unsupervised-output-nature",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "지도학습과 달리 비지도학습의 출력(Output)이 갖는 본질적 성격은?",
      options: [
        "특정 정답 예측이 아니라 데이터의 숨겨진 구조, 요약, 군집, 또는 잠재 표현(Embedding) 도출",
        "미래의 정확한 Y 수치 단일값 예측",
        "이진 라벨(0 또는 1) 분류 판정",
        "MSE 손실의 0 수렴 보장"
      ],
      answer: 0,
      explanation: "비지도학습은 정답 예측이 목적이 아니라 데이터 내의 잠재 구조, 요약, 표현(Embedding)을 찾아내는 것입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-med-002",
      conceptId: "clustering-internal-external-criteria",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "군집화(Clustering) 품질 측정을 위한 '군집 내부(Intra-cluster)' 및 '군집 간(Inter-cluster)' 거리 조건은?",
      options: [
        "군집 내부 데이터 간 거리는 최소화(유사)되어야 하고, 서로 다른 군집 간 거리는 최대화(상이)되어야 한다.",
        "군집 내부 데이터 간 거리를 최대화해야 한다.",
        "군집 간 거리를 0으로 만들어 합쳐야 한다.",
        "거리 측정은 군집화에서 아무 의미가 없다."
      ],
      answer: 0,
      explanation: "바람직한 군집화는 응집도(내부 거리 최소화)와 분리도(군집 간 거리 최대화)를 동시에 만족해야 합니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-med-003",
      conceptId: "k-means-objective-function",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "K-means 클러스터링이 수학적으로 최소화하고자 하는 목적함수(WCSS)의 의미는?",
      options: [
        "각 클러스터 내 데이터들과 해당 클러스터 중심점(Centroid) 간의 거리 제곱합의 총합",
        "클러스터 중심점들과 원점 간의 거리",
        "전체 데이터 샘플 수 $n$",
        "클러스터 간 중심점들의 거리 제곱합"
      ],
      answer: 0,
      explanation: "K-means는 군집 내 변동성(Within-Cluster Sum of Squares, WCSS)인 데이터와 속한 중심점 간 거리 제곱합을 최소화합니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-med-004",
      conceptId: "k-means-step-by-step",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "K-means 알고리즘의 2단계 반복 루프 과정으로 바른 순서는?",
      options: [
        "1) 각 데이터를 가장 가까운 중심점에 할당 $\\rightarrow$ 2) 할당된 데이터들의 평균 위치로 중심점 재계산",
        "1) 중심점 재계산 $\\rightarrow$ 2) 무작위 가중치 역전파",
        "1) 모든 데이터를 1개 군집으로 합침 $\\rightarrow$ 2) 2개로 분할",
        "1) 라벨값 교차 엔트로피 계산 $\\rightarrow$ 2) 중심점 삭제"
      ],
      answer: 0,
      explanation: "K-means는 [가장 가까운 중심에 샘플 할당 $\\rightarrow$ 각 군집 샘플들의 평균(Mean)으로 중심점 재계산]을 수렴 시까지 반복합니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-med-005",
      conceptId: "k-means-initialization-issue",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "표준 K-means 알고리즘이 가진 한계점과 이를 개선하기 위한 초기화 기법은?",
      options: [
        "초기 중심점 위치에 따라 국소 최적해(Local Optima)에 빠질 수 있어, 중심점 간 거리를 고려해 초기화하는 K-means++ 기법을 사용함",
        "K-means는 항상 전역 최적해(Global Optima)를 보장하므로 초기화가 무의미하다.",
        "K-means는 수치형 피처를 다룰 수 없다.",
        "초기 중심점은 무조건 원점(0,0)으로 고정해야만 한다."
      ],
      answer: 0,
      explanation: "초기 중심점 임의 선정 시 국소 해에 빠질 위험이 있어 중심점 간 거리를 멀리 배치하는 K-means++ 초기화를 씁니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-med-006",
      conceptId: "hierarchical-agglomerative-concept",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "상행식(Agglomerative) 계층적 군집화의 기본 병합 과정은?",
      options: [
        "각 데이터 포인트를 개별 군집으로 시작하여 가장 가까운 군집 쌍을 순차적으로 병합해 나간다.",
        "전체 데이터를 1개 큰 군집으로 두고 쪼개 나간다.",
        "중심점 $K$개를 랜덤 배치하고 이동시킨다.",
        "라벨값을 기반으로 지도 분류한다."
      ],
      answer: 0,
      explanation: "상행식(Agglomerative) 계층 군집화는 바텀업 방식하여 가장 가까운 샘플/군집을 순차 병합해 나갑니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-med-007",
      conceptId: "hierarchical-linkage-types",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "계층적 군집화에서 두 군집 간 거리를 측정하는 연결법(Linkage) 중 '두 군집 샘플 간의 최단 거리'를 사용하는 것은?",
      options: ["단일 연결법 (Single Linkage)", "완전 연결법 (Complete Linkage)", "평균 연결법 (Average Linkage)", "중심 연결법"],
      answer: 0,
      explanation: "Single Linkage(단일/최단 연결법)는 두 군집 샘플 간의 가장 가까운 최단 거리를 군집 간 거리로 정의합니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-med-008",
      conceptId: "feature-scaling-importance-clustering",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "거리 기반 클러스터링(K-means 등) 수행 전, 피처 간 단위 차이(예: 소득 억 원 vs 나이 세)를 맞추기 위한 표준화(Scaling) 전처리가 필수적인 이유는?",
      options: [
        "단위의 수치 크기가 큰 피처가 거리 연산 결과를 왜곡하여 군집 형성을 지배해 버리기 때문에",
        "표준화를 안 하면 데이터가 삭제되기 때문에",
        "표준화를 하면 군집 수가 무조건 1개로 줄어들기 때문에",
        "비지도학습은 수치형 피처를 못 쓰기 때문에"
      ],
      answer: 0,
      explanation: "유클리드 거리를 쓸 때 단위 스케일이 큰 피처가 거리 계산을 좌지우지하므로 표준화(Standardization)가 필수적입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-med-009",
      conceptId: "pca-variance-maximization",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "주성분 분석(PCA)에서 첫 번째 주성분(PC1) 축을 선정하는 기하학적 기준은?",
      options: [
        "데이터의 분산(Variance)이 가장 크게 보존되는 방향의 축",
        "데이터의 평균이 0이 되는 축",
        "모든 데이터 점들과 수직이 되는 축",
        "라벨 $Y$와의 상관계수가 가장 높은 축"
      ],
      answer: 0,
      explanation: "PCA는 데이터 분산(정보량)이 가장 크게 퍼져 있는 방향을 첫 번째 주성분 축으로 정합니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-med-010",
      conceptId: "dendrogram-cutting-k",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "계층적 군집화 결과물인 덴드로그램(Dendrogram)에서 최종 군집 개수 $K$를 결정하는 방법은?",
      options: [
        "덴드로그램의 세로 높이 축을 특정 절단선(Cut)으로 수평하게 잘라 만나는 가지의 개수를 $K$로 정함",
        "트리의 가장 바닥 리프 노드 개수를 무조건 $K$로 함",
        "가장 수직 길이가 짧은 가지 1개만 선택함",
        "무작위로 숫자를 지정함"
      ],
      answer: 0,
      explanation: "덴드로그램의 적절한 높이 위치에서 수평 절단선(Cut)을 그어 잘리는 가짓수로 최종 클러스터 개수를 결정합니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-med-011",
      conceptId: "elbow-method-k-means",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "medium",
      prompt: "K-means에서 적절한 군집 수 $K$를 찾기 위해, $K$ 증가에 따른 WCSS(군집 내 오차제곱합) 감소율이 꺾이는 지점을 선택하는 그래프 평가법은?",
      options: ["엘보우 기법 (Elbow Method)", "실루엣 계수 분석", "ROC 곡선", "Residual Plot"],
      answer: 0,
      explanation: "$K$가 늘어남에 따라 WCSS가 급격히 줄어들다가 팔꿈치(Elbow)처럼 꺾여 감소세가 둔화되는 지점의 $K$를 선택합니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-med-012",
      conceptId: "unsupervised-evaluation-difficulty",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "지도학습과 비교하여 비지도학습의 결과 평가가 상대적으로 어려운 근본적 이유는?",
      options: [
        "비교하여 검증할 실제 정답 라벨(Ground Truth)이 존재하지 않기 때문에",
        "수학적 손실함수를 정의할 수 없어서",
        "데이터의 개수가 항상 적기 때문에",
        "컴퓨터가 연산을 수행할 수 없어서"
      ],
      answer: 0,
      explanation: "비지도학습은 절대적인 정답(Ground Truth) 라벨이 없으므로 객관적인 절대 평가 지표 산출이 어렵습니다[cite: 5]."
    },
    {
      id: "ml-c4-sa-med-013",
      conceptId: "wcss-sa",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "short-answer",
      prompt: "K-means에서 각 데이터와 속한 군집 중심점 간 거리 제곱합인 '군집 내 오차제곱합'의 영문 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["WCSS", "wcss", "Within-Cluster Sum of Squares"],
      explanation: "Within-Cluster Sum of Squares (WCSS) 입니다[cite: 5]."
    },
    {
      id: "ml-c4-sa-med-014",
      conceptId: "pca-sa",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "short-answer",
      prompt: "고차원 데이터의 분산을 최대한 보존하는 축을 찾아 저차원으로 압축하는 주성분 분석 기술의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["PCA", "pca", "Principal Component Analysis"],
      explanation: "Principal Component Analysis (PCA) 입니다[cite: 5]."
    },
    {
      id: "ml-c4-es-med-015",
      conceptId: "k-means-process-essay",
      difficulty: "medium",
      category: "비지도학습 및 군집화",
      questionType: "essay",
      prompt: "K-means 클러스터링 알고리즘의 동작 4단계(초기화 $\\rightarrow$ 할당 $\\rightarrow$ 중심 재계산 $\\rightarrow$ 수렴)를 순서대로 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["초기화", "할당", "중심", "재계산", "반복"],
      modelAnswer: "1) K개의 초기 중심점(Centroid)을 임의 배치한다. 2) 각 데이터를 가장 가까운 중심점에 할당하여 K개 군집을 형성한다. 3) 각 군집에 속한 데이터들의 평균 위치로 중심점을 재계산한다. 4) 할당에 변화가 없을 때까지 2~3 단계를 반복 수렴한다[cite: 5].",
      rubricKeywords: ["K개 초기 중심점 배치", "가까운 중심 할당", "평균 위치 중심 재계산", "수렴 시까지 반복"],
      minLength: 20,
      explanation: "K-means의 초기화 $\\rightarrow$ 할당 $\\rightarrow$ 중심 재계산 $\\rightarrow$ 반복 수렴 동작 과정을 서술합니다[cite: 5]."
    },

    // ==========================================
    // 카테고리 5: 선형회귀 (15문항)
    // ==========================================
    {
      id: "ml-c5-mc-med-001",
      conceptId: "least-squares-calculus-derivation",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "단순선형회귀에서 잔차제곱합 $\\text{RSS}(\\beta_0, \\beta_1) = \\sum_{i=1}^n (y_i - \\beta_0 - \\beta_1 x_i)^2$ 을 최소화하는 최적 계수를 구하는 수학적 접근법은?",
      options: [
        "RSS를 각 계수 $\\beta_0, \\beta_1$에 대해 편미분한 도함수(기울기)가 0이 되는 연립방정식을 푼다.",
        "RSS 수식에 무작위 숫자를 100만 번 대입해 본다.",
        "데이터를 시그모이드 함수에 통과시킨다.",
        "계수 $\\beta_0, \\beta_1$을 항상 1로 고정한다."
      ],
      answer: 0,
      explanation: "RSS 비용함수의 극솟점(최솟값)을 찾기 위해 $\\beta_0$과 $\\beta_1$에 대해 편미분하여 0이 되는 편미분 방정식을 풀어 해를 도출합니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-med-002",
      conceptId: "slope-formula-interpretation",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "최소제곱법으로 도출된 기울기 계수 수식 $\\hat{\\beta}_1 = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum (x_i - \\bar{x})^2}$ 의 분자와 분모에 대한 바른 해석은?",
      options: [
        "분자는 $X$와 $Y$의 공분산(Covariance) 형태이고, 분모는 $X$의 편차 제곱합(Variance) 형태이다.",
        "분자는 $X$의 편차합이고, 분모는 $Y$의 편차합이다.",
        "분자와 분모 모두 $Y$의 편차 제곱합이다.",
        "분자는 상관계수이고 분모는 데이터 개수 $n$이다."
      ],
      answer: 0,
      explanation: "기울기 수식의 분자는 $X$와 $Y$의 공분산 성분이고, 분모는 $X$ 자체의 분산(편차제곱합) 성분입니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-med-003",
      conceptId: "intercept-formula-passing-mean",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "절편 수식 $\\hat{\\beta}_0 = \\bar{y} - \\hat{\\beta}_1 \\bar{x}$ 이 시사하는 기하학적 성질은?",
      options: [
        "최소제곱 회귀 직선은 항상 데이터의 평균점 $(\\bar{x}, \\bar{y})$를 반드시 지나간다.",
        "최소제곱 회귀 직선은 원점 $(0,0)$을 반드시 지나간다.",
        "절편은 항상 0이 된다.",
        "기울기와 절편은 서로 독립이라 평균점과 무관하다."
      ],
      answer: 0,
      explanation: "수식을 정리하면 $\\bar{y} = \\hat{\\beta}_0 + \\hat{\\beta}_1 \\bar{x}$ 가 되므로, 회귀 직선은 항상 $X$와 $Y$의 평균점 $(\\bar{x}, \\bar{y})$를 지납니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-med-004",
      conceptId: "normal-equation-derivation",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "다중선형회귀 행렬식 $y = X\\beta + \\epsilon$에서 $\\text{RSS} = (y - X\\beta)^\\top (y - X\\beta)$를 $\\beta$에 대해 미분하여 0으로 놓아 얻어지는 정규방정식(Normal Equation) 수식은?",
      options: [
        "$X^\\top X \\hat{\\beta} = X^\\top y$",
        "$X \\hat{\\beta} = y$",
        "$X^\\top \\hat{\\beta} = X y$",
        "$X X^\\top \\hat{\\beta} = y$"
      ],
      answer: 0,
      explanation: "미분 도함수 $-2X^\\top y + 2X^\\top X \\hat{\\beta} = 0$ 으로부터 정규방정식 $X^\\top X \\hat{\\beta} = X^\\top y$ 가 유도됩니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-med-005",
      conceptId: "normal-equation-invertibility",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "정규방정식 해 $\\hat{\\beta} = (X^\\top X)^{-1} X^\\top y$ 가 존재하기 위해 필요한 수학적 조건은?",
      options: [
        "행렬 $X^\\top X$의 역행렬(Inverse)이 존재해야 하며, 피처 간 다중공선성이 없어 완전한 컬럼 독립이어야 한다.",
        "행렬 $X$의 모든 원소가 0이어야 한다.",
        "데이터 샘플 수 $n$이 피처 수 $p$보다 무조건 적어야 한다.",
        "역행렬 계산 시 항상 음수만 나와야 한다."
      ],
      answer: 0,
      explanation: "행렬 $X^\\top X$의 역행렬이 존재(Invertible)해야 유일해 가 도출되며, 완벽한 다중공선성이 있으면 역행렬이 존재하지 않습니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-med-006",
      conceptId: "t-statistic-p-value-relation",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "회귀 계수의 유의성 검정에서 $t$-statistic과 p-value의 관계로 옳은 것은?",
      options: [
        "$t$-statistic의 절댓값이 커질수록 회귀 계수가 0일 확률(p-value)이 매우 작아져 통계적 유의성이 높아진다.",
        "$t$-statistic이 커지면 p-value도 같이 커진다.",
        "$t$-statistic과 p-value는 아무 관련이 없다.",
        "p-value가 1에 가까울수록 계수가 유의미하다."
      ],
      answer: 0,
      explanation: "$t$-statistic 수치는 표준오차 대비 계수 크기 비율로, 이 값이 클수록 p-value가 작아져 변수의 영향력이 유의미해집니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-med-007",
      conceptId: "advertising-case-newspaper-pvalue",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "강의자료 광고 데이터 다중회귀 결과에서 Newspaper(신문) 광고비의 p-value가 0.8599로 크게 나온 것의 올바른 해석은?",
      options: [
        "TV와 Radio 광고비를 통제하고 나면, 신문 광고비는 매출 증가에 통계적으로 유의미한 관계가 없다.",
        "신문 광고비가 매출 증가의 가장 결정적인 원인이다.",
        "신문 광고비를 100배로 늘려야 매출이 크게 오른다.",
        "TV와 Radio 광고비도 유의성이 사라진다."
      ],
      answer: 0,
      explanation: "Newspaper의 p-value > 0.05 이므로, TV/Radio 변수가 포함된 다중회귀에서는 신문 광고비가 매출에 유의한 영향을 주지 못합니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-med-008",
      conceptId: "simple-vs-multiple-r2-improvement",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "TV 단독 단순회귀($R^2 = 0.612$) 대비 TV+Radio 다중회귀($R^2 = 0.897$)로 확장되었을 때의 결과 해석은?",
      options: [
        "Radio 변수가 추가되면서 제품 판매량 변동의 설명력이 약 61%에서 약 90%로 대폭 향상되었다.",
        "변수를 추가했으므로 모델의 예측력이 더 떨어졌다.",
        "Radio 변수는 매출과 완전히 무관하다.",
        "단순회귀 결과가 더 유용한 모델이다."
      ],
      answer: 0,
      explanation: "유의미한 설명변수 Radio가 추가되면서 결정계수 $R^2$이 0.612에서 0.897로 대폭 상승하여 설명력이 향상되었습니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-med-009",
      conceptId: "hyperplane-concept",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "독립 변수가 2개인 다중선형회귀 $\\hat{y} = \\hat{\\beta}_0 + \\hat{\\beta}_1 X_1 + \\hat{\\beta}_2 X_2$ 가 3차원 공간상에서 그리는 예측 모델의 형태는?",
      options: ["2차원 평면 (Plane / Hyperplane)", "1차원 직선", "3차원 구형", "점들의 집합"],
      answer: 0,
      explanation: "2개의 입력 피처와 1개의 출력이 이루는 다중선형회귀 결과는 3차원 공간상의 평면(Hyperplane)으로 표현됩니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-med-010",
      conceptId: "spurious-correlation-icecream-shark",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "'아이스크림 소비량'과 '상어 공격 사건 수' 간에 높은 양의 상관관계가 관찰될 때, 둘 사이에 '기온/계절'이라는 제3의 변수가 존재하는 현상의 시사점은?",
      options: [
        "수치적 상관관계가 존재해도 제3의 요인(기온) 때문일 수 있으므로 함부로 인과관계로 해석해선 안 된다.",
        "아이스크림 판매를 금지하면 상어 공격이 사라진다.",
        "상어 공격 사건이 아이스크림을 팔리게 만든 원인이다.",
        "두 변수 간에는 수치적 상관관계조차 없다."
      ],
      answer: 0,
      explanation: "여름철 높은 기온이라는 공통 요인 때문에 두 변수가 함께 증가한 거짓 상관(Spurious Correlation)이므로 인과관계가 아닙니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-med-011",
      conceptId: "overfitting-with-many-features",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "다중선형회귀에서 너무 많은 독립 변수나 고차항을 무분별하게 추가할 때 발생할 수 있는 위험은?",
      options: [
        "훈련 데이터에만 지나치게 적합되어 오버피팅(Overfitting)이 발생하고 테스트 성능이 떨어진다.",
        "모델의 설명력 $R^2$이 무조건 0이 된다.",
        "정규방정식을 계산할 수 없게 된다.",
        "모든 회귀 계수가 0으로 고정된다."
      ],
      answer: 0,
      explanation: "변수나 고차항이 과도하게 많아지면 훈련셋 잡음까지 배워 오버피팅이 발생합니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-med-012",
      conceptId: "standard-error-of-coefficients",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "회귀 계수 결과표의 'Std. Error (표준오차)'가 수치적으로 의미하는 바는?",
      options: [
        "표본 추출에 따라 추정된 회귀 계수 $\\hat{\\beta}$ 값에 존재하는 불확실성/변동성의 크기",
        "훈련 데이터의 전체 오차 제곱합",
        "독립 변수 $X$의 평균값",
        "모델의 예측 정확도 백분율"
      ],
      answer: 0,
      explanation: "Std. Error(표준오차)는 샘플링에 따라 추정 계수 $\\hat{\\beta}$가 얼마나 흔들릴 수 있는지 불확실성의 크기를 나타냅니다[cite: 4]."
    },
    {
      id: "ml-c5-sa-med-013",
      conceptId: "normal-equation-sa",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "short-answer",
      prompt: "다중선형회귀에서 최소제곱법의 미분을 통해 도출되는 정규방정식 해 수식 $\\hat{\\beta} =$ ( ? ) $X^\\top y$ 의 괄호에 들어갈 행렬식은?",
      options: [],
      answer: null,
      acceptedAnswers: ["(X^T X)^-1", "(X^T*X)^-1", "(X^T X)^{-1}", "(X'X)^-1"],
      explanation: "정규방정식의 역행렬 파트인 $(X^\\top X)^{-1}$ 입니다[cite: 4]."
    },
    {
      id: "ml-c5-sa-med-014",
      conceptId: "hyperplane-sa",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "short-answer",
      prompt: "독립 변수가 여러 개인 다중선형회귀 모델이 고차원 공간 상에서 형성하는 예측 기하학적 구조를 무엇이라 하는가?",
      options: [],
      answer: null,
      acceptedAnswers: ["평면", "초평면", "Hyperplane", "hyperplane"],
      explanation: "고차원 회귀 모델이 그리는 Hyperplane(초평면/평면) 구조입니다[cite: 4]."
    },
    {
      id: "ml-c5-es-med-015",
      conceptId: "normal-equation-derivation-essay",
      difficulty: "medium",
      category: "선형회귀",
      questionType: "essay",
      prompt: "다중선형회귀 행렬식 $y = X\\beta + \\epsilon$에서 $\\text{RSS} = (y - X\\beta)^\\top (y - X\\beta)$를 $\\beta$로 미분하여 정규방정식 해 $\\hat{\\beta} = (X^\\top X)^{-1} X^\\top y$가 유도되는 과정과, $X^\\top X$의 역행렬 존재 조건을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["편미분", "0", "정규방정식", "역행렬", "독립"],
      modelAnswer: "RSS를 $\\beta$에 대해 미분하여 0으로 놓으면 $\\frac{\\partial \\text{RSS}}{\\partial \\beta} = -2X^T y + 2X^T X \\beta = 0$ 이 되며, 이를 정리하면 정규방정식 $X^T X \\hat{\\beta} = X^T y$ 가 도출된다. 양변에 역행렬을 곱해 해를 얻기 위해서는 행렬 $X^T X$의 역행렬이 존재해야 하며, 이는 $X$의 피처들 사이에 완벽한 다중공선성이 없고 컬럼들이 선형독립이어야 한다[cite: 4].",
      rubricKeywords: ["RSS 미분 = 0", "정규방정식 $X^T X \\hat{\\beta} = X^T y$", "$X^T X$ 역행렬 존재", "피처 간 선형독립(다중공선성 없음)"],
      minLength: 20,
      explanation: "RSS 편미분 유도 과정과 $X^\\top X$의 역행렬 존재 조건(독립성)을 서술합니다[cite: 4]."
    },

    // ==========================================
    // 카테고리 6: 로지스틱회귀 (15문항)
    // ==========================================
    {
      id: "ml-c6-mc-med-001",
      conceptId: "linear-regression-failure-binary",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "이진 분류($Y \\in \\{0, 1\\}$) 문제에 선형 회귀 직선을 그대로 적용할 때 발생하는 근본적 결함은?",
      options: [
        "입력 $X$에 따라 예측값 $\\hat{y}$가 0보다 작거나 1보다 큰 값이 나와 이를 확률로 해석하기 부적절함",
        "선형 회귀는 역전파 학습이 불가능함",
        "선형 회귀의 회귀 계수가 무조건 0이 됨",
        "선형 회귀는 오직 범주형 피처만 받을 수 있음"
      ],
      answer: 0,
      explanation: "선형 회귀는 출력을 $0 \\sim 1$ 사이로 제한하지 못해 확률의 기본 정의를 위배합니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-med-002",
      conceptId: "logit-transformation-derivation",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀식 $p(X) = \\frac{e^{\\beta_0 + \\beta_1 X}}{1 + e^{\\beta_0 + \\beta_1 X}}$ 로부터 오즈(Odds) $\\frac{p(X)}{1-p(X)}$를 구한 뒤 양변에 자연로그를 취하면 얻어지는 로짓 변환 수식은?",
      options: [
        "$\\log\\left(\\frac{p(X)}{1-p(X)}\\right) = \\beta_0 + \\beta_1 X$",
        "$\\log\\left(\\frac{p(X)}{1-p(X)}\\right) = e^{\\beta_0 + \\beta_1 X}$",
        "$\\frac{p(X)}{1-p(X)} = \\beta_0 + \\beta_1 X$",
        "$\\log(p(X)) = \\beta_0 + \\beta_1 X$"
      ],
      answer: 0,
      explanation: "로지스틱 모형의 오즈에 자연로그를 취하면 우변이 선형 회귀식 $\\beta_0 + \\beta_1 X$ 로 정리됩니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-med-003",
      conceptId: "likelihood-function-binary",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "이진 분류 로지스틱 회귀에서 전체 관측 데이터에 대한 우도 함수 $\\mathcal{L}(\\beta)$ 의 곱셈 수식 형태는?",
      options: [
        "$\\mathcal{L}(\\beta) = \\prod_{i:y_i=1} p(x_i; \\beta) \\prod_{j:y_j=0} (1 - p(x_j; \\beta))$",
        "$\\mathcal{L}(\\beta) = \\sum_{i=1}^n (y_i - p(x_i))^2$",
        "$\\mathcal{L}(\\beta) = \\prod_{i=1}^n (p(x_i) + y_i)$",
        "$\\mathcal{L}(\\beta) = \\beta_0 \\times \\beta_1$"
      ],
      answer: 0,
      explanation: "우도 함수는 정답이 1인 샘플들의 확률 $p(x_i)$와 정답이 0인 샘플들의 확률 $(1-p(x_j))$을 모두 곱한 형태입니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-med-004",
      conceptId: "log-likelihood-formula",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "우도 함수에 자연로그를 취해 손실함수로 사용하는 Log-Likelihood $\\log \\mathcal{L}(\\beta)$ 수식 표현은?",
      options: [
        "$\\log \\mathcal{L}(\\beta) = \\sum_{i=1}^n \\left[ y_i \\log p(x_i; \\beta) + (1 - y_i) \\log(1 - p(x_i; \\beta)) \\right]$",
        "$\\log \\mathcal{L}(\\beta) = \\sum_{i=1}^n (y_i - p(x_i))^2$",
        "$\\log \\mathcal{L}(\\beta) = \\prod_{i=1}^n y_i \\log p(x_i)$",
        "$\\log \\mathcal{L}(\\beta) = \\log(\\beta_0 + \\beta_1 X)$"
      ],
      answer: 0,
      explanation: "이진 분류의 Log-Likelihood 수식은 $y_i=1$일 때 $\\log p$, $y_i=0$일 때 $\\log(1-p)$가 선택되도록 덧셈 결합됩니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-med-005",
      conceptId: "log-function-monotonicity",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "우도 $\\mathcal{L}(\\beta)$ 대신 $\\log \\mathcal{L}(\\beta)$를 최대화하는 매개변수 $\\hat{\\beta}$를 구해도 최적 해가 동일한 수학적 근거는?",
      options: [
        "자연로그 함수 $\\log(x)$가 단조 증가(Monotone Increasing) 함수이기 때문에",
        "로그 함수가 상숫값을 출력하기 때문에",
        "로그 함수와 우도 함수가 완벽히 동일한 수식이기 때문에",
        "로그를 취하면 모든 미분값이 0이 되기 때문에"
      ],
      answer: 0,
      explanation: "로그 함수는 단조 증가 함수이므로 $\\mathcal{L}(\\beta)$를 극대화하는 $\\beta$값과 $\\log \\mathcal{L}(\\beta)$를 극대화하는 $\\beta$값이 정확히 일치합니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-med-006",
      conceptId: "log-odds-increase-interpretation",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀 결과 $\\log\\left(\\frac{p(X)}{1-p(X)}\\right) = -10.6513 + 0.0055 \\cdot X$ 에서 $X$가 1000에서 2000으로 2배 증가할 때 확률값의 변화 양상은?",
      options: [
        "S자 시그모이드 곡선의 비선형적 특성 때문에 예측 확률값은 단순 2배가 아니라 약 97배 이상 급격히 증가함",
        "확률값도 정확히 2배로 선형 증가함",
        "확률값이 오히려 절반으로 감소함",
        "확률값 변화가 전혀 없음"
      ],
      answer: 0,
      explanation: "로짓은 선형으로 증가하지만 이를 확률 $p(X)$로 바꾸면 시그모이드 비선형성으로 인해 특정 구간에서 확률이 97배 급증하는 양상을 보입니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-med-007",
      conceptId: "multi-variable-logistic-regression",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "여러 독립 변수 $X_1, X_2, ..., X_p$를 포함하는 다중 로지스틱 회귀의 확률 $p(X)$ 수식은?",
      options: [
        "$p(X) = \\frac{e^{\\beta_0 + \\beta_1 X_1 + ... + \\beta_p X_p}}{1 + e^{\\beta_0 + \\beta_1 X_1 + ... + \\beta_p X_p}}$",
        "$p(X) = \\beta_0 + \\beta_1 X_1 + ... + \\beta_p X_p$",
        "$p(X) = \\frac{1}{\\beta_0 + \\beta_1 X_1 + ... + \\beta_p X_p}$",
        "$p(X) = \\log(\\beta_0 + \\beta_1 X_1 + ... + \\beta_p X_p)$"
      ],
      answer: 0,
      explanation: "다중 로지스틱 회귀는 선형 결합 $\\beta_0 + \\sum \\beta_j X_j$ 파트를 시그모이드 함수 $z$ 자리에 대입한 수식입니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-med-008",
      conceptId: "integer-coding-problem-classification",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "기상 상태 라벨 $Y \\in \\{\\text{맑음}, \\text{눈}, \\text{비}\\}$를 정수 코딩 $Y \\in \\{1, 2, 3\\}$으로 직접 지정하여 선형 회귀를 적용할 때 생기는 오류는?",
      options: [
        "순서가 없는 범주 간에 인위적인 순서(1 < 2 < 3)와 거리 간격의 동일성을 암묵적으로 가정해 버리는 심각한 왜곡이 발생함",
        "모델의 연산 속도가 100배 빨라짐",
        "확률값이 무조건 0.5로 고정됨",
        "아무런 문제도 발생하지 않음"
      ],
      answer: 0,
      explanation: "범주형 라벨을 임의 숫자로 정수 코딩하면 인위적 순서 관계(맑음 < 눈 < 비)가 강제되는 오류가 발생합니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-med-009",
      conceptId: "credit-card-data-income-insignificance",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "medium",
      prompt: "신용카드 연체 데이터 다중 로지스틱 회귀 분석표에서 소득(Income) 변수의 p-value가 0.7115로 크게 나온 것의 올바른 해석은?",
      options: [
        "카드 잔액(Balance) 및 학생 여부가 통제된 상태에서, 소득 수준은 연체 발생 확률에 통계적으로 유의미한 영향을 주지 못함",
        "소득이 연체의 가장 결정적인 원인이다.",
        "소득이 높을수록 연체 확률이 100% 발생한다.",
        "소득 변수만 남기고 다른 변수를 지워야 한다."
      ],
      answer: 0,
      explanation: "Income의 p-value > 0.05 이므로, Balance 등이 통제된 다중 로지스틱 모형에서 소득은 연체 예측에 유의하지 않습니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-med-010",
      conceptId: "numerical-optimization-mle",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀의 Log-Likelihood를 미분했을 때 정규방정식처럼 Closed-form 해가 바로 나오지 않는 이유는?",
      options: [
        "시그모이드 비선형 함수가 포함되어 있어 도함수=0 식이 비선형 방정식이 되므로 반복적 수치 최적화(Gradient Ascent 등)로 해를 찾아야 함",
        "데이터의 개수가 항상 0이기 때문에",
        "로지스틱 회귀에는 가중치 매개변수가 존재하지 않아서",
        "우도 함수가 미분 불가능하기 때문에"
      ],
      answer: 0,
      explanation: "Log-Likelihood 미분 방정식은 비선형 식이 되어 닫힌 해(Closed-form)가 없으므로 수치 최적화 알고리즘으로 반복 추정합니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-med-011",
      conceptId: "odds-ratio-concept",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀에서 $X_1$이 1단위 증가할 때 오즈(Odds)가 지수배 $e^{\\beta_1}$ 만큼 변화하는 비율을 나타내는 지표는?",
      options: ["오즈비 (Odds Ratio)", "로그 우도", "잔차제곱합", "결정계수"],
      answer: 0,
      explanation: "Odds Ratio = $e^{\\beta_1}$ 은 $X_1$이 1단위 증가할 때 성공 오즈가 몇 배 늘어나는지 나타냅니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-med-012",
      conceptId: "z-statistic-p-value-logistic",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀 결과표에서 계수의 통계적 유의성을 검정하기 위해 사용되는 지표 수치는?",
      options: ["z-statistic (및 p-value)", "t-statistic", "F-statistic", "RSE"],
      answer: 0,
      explanation: "로지스틱 회귀에서는 대표본 정규분포 가정을 바탕으로 z-statistic을 통해 계수의 유의성을 검정합니다[cite: 4]."
    },
    {
      id: "ml-c6-sa-med-013",
      conceptId: "logit-sa",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "short-answer",
      prompt: "오즈(Odds)에 자연로그를 취하여 선형 회귀식 형태 $\\beta_0 + \\beta_1 X$ 로 변환해 주는 변환 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["로짓 변환", "로짓변환", "Logit Transformation", "Logit transformation", "Logit"],
      explanation: "Logit Transformation(로짓 변환) 입니다[cite: 4]."
    },
    {
      id: "ml-c6-sa-med-014",
      conceptId: "log-likelihood-sa",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "short-answer",
      prompt: "로지스틱 회귀에서 곱으로 이루어진 우도 함수에 자연로그를 취해 덧셈 형태로 바꾼 손실/목적함수는?",
      options: [],
      answer: null,
      acceptedAnswers: ["로그 우도", "로그우도", "Log-Likelihood", "log-likelihood", "Log Likelihood"],
      explanation: "Log-Likelihood(로그 우도) 입니다[cite: 4]."
    },
    {
      id: "ml-c6-es-med-015",
      conceptId: "mle-log-likelihood-essay",
      difficulty: "medium",
      category: "로지스틱회귀",
      questionType: "essay",
      prompt: "로지스틱 회귀 모수 추정 시 사용되는 '우도(Likelihood)'의 정의를 서술하고, 곱셈 형태의 우도 대신 '로그 우도(Log-Likelihood)'를 만들어 최대화하는 이유 2가지를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["우도", "데이터 설명", "곱셈", "덧셈", "미분"],
      modelAnswer: "우도는 현재 확률 모델이 관측 데이터를 얼마나 잘 설명하는지 나타내는 지표이다. 우도 대신 로그 우도를 사용하는 이유는 1) 확률값들의 연쇄 곱을 덧셈 연산으로 변환하여 미분 및 수치 최적화를 쉽게 만들고, 2) 로그 함수가 단조 증가 함수이므로 우도를 최대화하는 모수와 로그 우도를 최대화하는 모수가 수학적으로 완벽히 동일하기 때문이다[cite: 4].",
      rubricKeywords: ["데이터 설명 가능도 정의", "곱을 덧셈으로 변환해 미분 용이", "로그의 단조 증가성"],
      minLength: 20,
      explanation: "우도 정의와 로그 우도 사용 이유(미분/최적화 용이성, 단조 증가성)를 서술합니다[cite: 4]."
    },

    // ==========================================
    // 카테고리 7: 신경망 모델 (15문항)
    // ==========================================
    {
      id: "ml-c7-mc-med-001",
      conceptId: "shallow-network-equation-structure",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "3개의 Hidden Unit을 가진 Shallow 네트워크 수식 $y = \\phi_0 + \\sum_{d=1}^3 \\phi_d a[\\theta_{d0} + \\theta_{d1} x]$ 의 작동 단계 순서로 바른 것은?",
      options: [
        "1) 입력 $x$의 선형 변환 $\\theta_{d0} + \\theta_{d1} x$ $\\rightarrow$ 2) 활성화 함수 $a[\\cdot]$ 적용 $\\rightarrow$ 3) 가중치 $\\phi_d$와 곱해 절편 $\\phi_0$와 합산",
        "1) 활성화 함수 적용 $\\rightarrow$ 2) 선형 변환 $\\rightarrow$ 3) 나누기",
        "1) 출력 $y$ 생성 $\\rightarrow$ 2) 입력 $x$ 차감",
        "1) 무작위 난수 생성 $\\rightarrow$ 2) 모든 가중치 고정"
      ],
      answer: 0,
      explanation: "각 은닉 노드에서 선형 변환(Pre-activation) 후 활성화 함수 $a[\\cdot]$를 거쳐 출력 가중치 $\\phi_d$로 선형 결합됩니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-med-002",
      conceptId: "pre-activation-vs-activation",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "은닉 노드 $h_d$ 연산에서 전활성값(Pre-activation) $z_d$와 최종 활성값(Activation) $h_d$의 관계 표현으로 바른 것은?",
      options: [
        "$z_d = \\theta_{d0} + \\theta_{d1} x \\quad \\rightarrow \\quad h_d = a[z_d]$",
        "$h_d = \\theta_{d0} + \\theta_{d1} x \\quad \\rightarrow \\quad z_d = a[h_d]$",
        "$z_d = a[\\theta_{d0}] \\times \\theta_{d1} x$",
        "$h_d = z_d^2$"
      ],
      answer: 0,
      explanation: "선형 결합된 값 $z_d$가 Pre-activation 이며, 여기에 활성화 함수 $a[\\cdot]$를 씌운 결과가 $h_d$ 입니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-med-003",
      conceptId: "relu-joints-kinks",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "Shallow 네트워크에서 ReLU 활성화 함수 $a[z] = \\max(0, z)$를 사용할 때, 출력 조각별 선형 함수에서 관측되는 꺾이는 점(Joints/Kinks)의 위치 결정 요소는?",
      options: [
        "각 은닉 노드의 Pre-activation 값이 0이 되는 $x = -\\frac{\\theta_{d0}}{\\theta_{d1}}$ 위치 지점",
        "출력 가중치 $\\phi_0$의 크기",
        "데이터 샘플의 전체 개수 $n$",
        "항상 $x = 0$ 원점 위치"
      ],
      answer: 0,
      explanation: "ReLU 함수는 입력이 0일 때 꺾이므로, $\\theta_{d0} + \\theta_{d1}x = 0$ 이 되는 $x = -\\theta_{d0}/\\theta_{d1}$ 에서 함수가 꺾입니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-med-004",
      conceptId: "linear-regions-count-shallow",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "1D 입력과 $D$개의 Hidden Unit을 가진 ReLU 기반 Shallow 네트워크가 최대로 만들어낼 수 있는 조각적 선형 구역(Linear Regions)의 개수는?",
      options: ["$D + 1$ 개", "$D$ 개", "$2^D$ 개", "$D^2$ 개"],
      answer: 0,
      explanation: "1D 입력에서 $D$개의 ReLU 노드는 최대 $D$개의 꺾이는 점을 만드므로, 생성 가능한 선형 구역 수는 최대 $D+1$ 개가 됩니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-med-005",
      conceptId: "deep-network-composition",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "Deep 네트워크에서 첫 번째 은닉층의 출력 $y = f_1(x)$가 두 번째 은닉층의 입력으로 들어가 최종 $y' = f_2(f_1(x))$가 되는 연산 구조의 수학적 명칭은?",
      options: ["함수의 합성 (Composition of Functions)", "함수의 차", "함수의 행렬식", "단순 가중평균"],
      answer: 0,
      explanation: "Deep 네트워크는 여러 층의 함수를 연속적으로 합성(Composition)하여 복잡한 표현을 형성합니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-med-006",
      conceptId: "folding-mechanism-exponential-regions",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "Deep 네트워크가 층을 합성해 나갈 때(Folding) 조각적 선형 구역(Linear Regions)의 개수가 늘어나는 기하학적 형태 양상은?",
      options: [
        "층의 깊이에 따라 선형 구역의 개수가 지수적(Exponential)으로 급증한다.",
        "층이 깊어져도 선형 구역 개수는 항상 고정된다.",
        "층이 깊어지면 선형 구역 개수가 감소한다.",
        "선형 구역이 완전히 파괴되어 원형이 된다."
      ],
      answer: 0,
      explanation: "Deep 네트워크는 층을 거치며 공간을 반복적으로 접어(Folding) 선형 구역 수가 지수적으로 증가하므로 높은 표현력을 가집니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-med-007",
      conceptId: "shallow-vs-deep-parameter-comparison",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "medium",
      prompt: "강의자료 예시에서 2층 Deep 네트워크(파라미터 20개 $\\rightarrow$ 최대 16개 선형 구역)와 1층 Shallow 네트워크(파라미터 19개 $\\rightarrow$ 최대 7개 선형 구역)를 비교했을 때의 핵심 결론은?",
      options: [
        "비슷한 파라미터 수일 때 Deep 네트워크가 만드는 선형 구역 수가 훨씬 많아 표현 효율성이 압도적으로 높다.",
        "Shallow 네트워크의 표현력이 무조건 더 뛰어나다.",
        "두 네트워크의 선형 구역 생성 능력은 완전히 동일하다.",
        "파라미터 수가 적을수록 오버피팅이 100% 방지된다."
      ],
      answer: 0,
      explanation: "유사한 파라미터 자원 대비 층을 깊게 쌓은 Deep 구조가 만들어내는 선형 구역 수가 훨씬 많아 효율적입니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-med-008",
      conceptId: "2d-input-3-hidden-units-plane",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "2D 입력($x_1, x_2$)과 3개의 Hidden Unit을 가진 신경망이 출력 공간 상에 만들어내는 경계 직선의 개수는?",
      options: ["3개의 경계 직선 (Joint lines)", "1개의 직선", "100개의 직선", "0개"],
      answer: 0,
      explanation: "3개의 은닉 노드가 각각 공간 상에 1개씩, 총 3개의 꺾이는 경계 선분(Joint lines)을 형성합니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-med-009",
      conceptId: "matrix-notation-layer-update",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "은닉층 $k$번째의 입력 벡터 $h_{k-1}$과 가중치 행렬 $W_k$, 편향 벡터 $b_k$가 있을 때, Pre-activation $z_k$와 활성화 $h_k$의 벡터 수식은?",
      options: [
        "$z_k = b_k + W_k h_{k-1} \\quad \\rightarrow \\quad h_k = a[z_k]$",
        "$h_k = W_k + b_k h_{k-1} \\quad \\rightarrow \\quad z_k = a[h_k]$",
        "$z_k = W_k h_{k-1} \\times b_k$",
        "$h_k = \\text{softmax}(W_k)$"
      ],
      answer: 0,
      explanation: "행렬 표기로 $z_k = b_k + W_k h_{k-1}$ 선형 결합 후 요소별 활성화 함수 $a[z_k]$를 적용해 $h_k$를 만듭니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-med-010",
      conceptId: "no-activation-function-collapse",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "신경망의 모든 은닉층에 비선형 활성화 함수 $a[\\cdot]$를 쓰지 않고 선형 연산만 연속 적용할 때 일어나는 문제는?",
      options: [
        "여러 층을 아무리 깊게 쌓아도 하나의 단순 선형 회귀 모형으로 축소(Collapse)되어 깊이의 이점이 사라진다.",
        "모델의 표현력이 무한대로 커진다.",
        "학습 속도가 0이 된다.",
        "모든 예측치가 자동으로 1이 된다."
      ],
      answer: 0,
      explanation: "선형 변환의합성은 다시 하나의 선형 변환이 되므로, 비선형 활성화 함수가 없으면 층을 쌓는 의미가 사라집니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-med-011",
      conceptId: "universal-approximation-theorem-practical-limitation",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "보편적 근사 정리가 존재함에도 불구하고 실무에서 Shallow 네트워크 대신 Deep 네트워크를 사용하는 실제적 이유는?",
      options: [
        "Shallow 네트워크로 복잡한 함수를 근사하려면 지수적으로 무수히 많은 노드가 필요하지만, Deep 네트워크는 가벼운 파라미터로 효율적 표현이 가능하므로",
        "Shallow 네트워크는 컴퓨터에서 구동이 안 되기 때문에",
        "보편적 근사 정리가 수학적으로 틀렸기 때문에",
        "Deep 네트워크가 구현 코드가 훨씬 짧기 때문에"
      ],
      answer: 0,
      explanation: "Shallow망은 이론상 근사 가능하나 폭(Width)이 기하급수적으로 커져야 하므로, 층을 깊게 쌓는 Deep 구조가 자원 효율적입니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-med-012",
      conceptId: "multiple-outputs-weights",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "4개의 Hidden Unit에서 2개의 출력($y_1, y_2$)으로 연결될 때, 은닉층과 출력층 사이의 출력 가중치 $\\phi_{j d}$의 총 개수는? (절편 제외)",
      options: ["8개 ($4 \\times 2$)", "4개", "2개", "16개"],
      answer: 0,
      explanation: "4개 은닉 노드가 2개 출력 노드 각각에 전결합(Fully Connected)되므로 $4 \\times 2 = 8$ 개의 가중치가 사용됩니다[cite: 4]."
    },
    {
      id: "ml-c7-sa-med-013",
      conceptId: "pre-activation-sa",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "short-answer",
      prompt: "은닉 노드에서 선형 결합을 거친 후 활성화 함수를 적용하기 직전의 상태값을 일컫는 용어는?",
      options: [],
      answer: null,
      acceptedAnswers: ["전활성값", "전활성 값", "Pre-activation", "pre-activation", "preactivation"],
      explanation: "Pre-activation(전활성값) 입니다[cite: 4]."
    },
    {
      id: "ml-c7-sa-med-014",
      conceptId: "composition-sa",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "short-answer",
      prompt: "Deep 네트워크에서 앞 층의 출력이 뒤 층의 입력으로 이어지는 연속적인 수학적 함수 결합을 무엇이라 하는가?",
      options: [],
      answer: null,
      acceptedAnswers: ["함수의 합성", "함수 합성", "합성", "Composition", "composition"],
      explanation: "함수의 합성(Composition of Functions) 입니다[cite: 4]."
    },
    {
      id: "ml-c7-es-med-015",
      conceptId: "folding-and-representation-essay",
      difficulty: "medium",
      category: "신경망 모델",
      questionType: "essay",
      prompt: "Deep 네트워크가 층의 합성(Composition)과 비선형 활성화 함수를 통해 공간을 '접어(Folding)' 나가는 직관적 원리와, 이것이 동일 파라미터 대비 표현력을 극대화하는 이유를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["합성", "활성화 함수", "접기", "선형 구역", "지수적"],
      modelAnswer: "Deep 네트워크는 각 층의 선형 결합과 비선형 활성화 함수(ReLU)를 거치며 입력 공간을 접어(Folding) 나간다. 층이 쌓일수록 접히는 과정이 연속 합성되어 생성되는 조각적 선형 구역(Linear Regions)의 수가 지수적으로 증가하므로, 동일한 파라미터 수 대비 Shallow망보다 훨씬 뛰어난 표현 효율성을 갖게 된다[cite: 4].",
      rubricKeywords: ["층의 합성 및 활성화 함수", "공간 접기(Folding)", "선형 구역 수 지수적 증가", "표현 효율성 높음"],
      minLength: 20,
      explanation: "층의 합성에 의한 공간 접기(Folding) 개념과 조각적 선형 구역 수의 지수적 증대에 따른 표현 효율성을 서술합니다[cite: 4]."
    }
  ]
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();