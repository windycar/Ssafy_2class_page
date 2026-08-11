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
  hard: [
    // ==========================================
    // 카테고리 1: AI/ML 기초 및 데이터 (15문항)
    // ==========================================
    {
      id: "ml-c1-mc-hard-001",
      conceptId: "irreducible-vs-reducible-error",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "모형 가정 $Y = f^*(X) + \epsilon$에서 예측 모델 $\hat{f}(X)$의 기대 오차 $E[(Y - \hat{f}(X))^2]$를 분해했을 때, 줄일 수 없는 오차(Irreducible Error)에 해당하는 항목은?",
      options: [
        "측정 오차의 분산 $\text{Var}(\epsilon)$",
        "모델의 편향 제곱 $(f^*(X) - E[\hat{f}(X)])^2$",
        "모델의 분산 $\text{Var}(\hat{f}(X))$",
        "가설 공간의 크기 $|\mathcal{F}|$"
      ],
      answer: 0,
      explanation: "기대 예측 오차는 줄일 수 있는 오차(편향 제곱 + 분산)와 데이터 자체 노이즈인 줄일 수 없는 오차 $\text{Var}(\epsilon)$의 합으로 분해됩니다[cite: 5].",
      hint: "모델을 아무리 완벽하게 학습시켜도 지울 수 없는 데이터 자체의 노이즈 항입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-hard-002",
      conceptId: "inductive-bias-concept",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "가설 공간 $\mathcal{F}$를 특정 함수군(예: 선형 함수)으로 제한함으로써 보지 못한 데이터에 대해 우선적인 예측 규칙을 부여하는 머신러닝의 핵심 개념은?",
      options: [
        "귀납적 편향 (Inductive Bias)",
        "과적합 (Overfitting)",
        "차원의 저주 (Curse of Dimensionality)",
        "경사하강법 (Gradient Descent)"
      ],
      answer: 0,
      explanation: "Inductive Bias는 학습 알고리즘이 관측되지 않은 데이터의 정답을 추론하기 위해 사용하는 사전 가정이나 가설 공간 제한을 의미합니다[cite: 5].",
      hint: "관측되지 않은 입력에 대해 예측할 수 있도록 모델이 가진 사전 가정입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-hard-003",
      conceptId: "feature-space-cardinality",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "피처 벡터 $X \in \mathbb{R}^p$에서 피처 차원 $p$가 데이터 샘플 수 $n$보다 훨씬 커지는 $p \gg n$ 상황(고차원 데이터)에서 나타나는 위험은?",
      options: [
        "가설 공간의 자유도가 지나치게 높아져 모델이 표본 잡음을 완벽히 외우는 과적합 위험이 극대화된다.",
        "측정 오차 $\epsilon$이 수학적으로 0으로 소멸한다.",
        "가설 공간 내의 후보 함수 개수가 1개로 축소된다.",
        "모든 피처 간 상관관계가 자동으로 0이 된다."
      ],
      answer: 0,
      explanation: "샘플 수 대비 피처 차원이 지나치게 크면 모델의 자유도가 과도해져 훈련 샘플의 무작위 노이즈까지 외우는 오버피팅이 쉽게 일어납니다[cite: 5].",
      hint: "샘플에 비해 특성 수가 너무 많을 때 발생하는 심각한 오버피팅 문제입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-hard-004",
      conceptId: "interpretability-vs-flexibility-tradeoff",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "가설 공간 $\mathcal{F}$의 유연성(Flexibility / 표현력)과 모델의 해석 가능성(Interpretability) 간의 관계에 대한 바른 설명은?",
      options: [
        "유연성이 높은 복잡한 모델일수록 피처와 라벨 간의 관계를 사람이 직관적으로 이해하기 어려운 트레이드오프 관계이다.",
        "유연성이 높아질수록 해석 가능성도 항상 비례하여 높아진다.",
        "선형 회귀 모델은 딥러닝보다 유연성이 높고 해석 가능성은 낮다.",
        "유연성과 해석 가능성은 완전히 독립적이어서 아무 상관이 없다."
      ],
      answer: 0,
      explanation: "모델이 유연하고 복잡할수록(예: Deep 신경망) 예측 성능은 오를 수 있지만 각 피처의 영향력을 직관적으로 해석하기는 어려워집니다[cite: 5].",
      hint: "복잡하고 유연한 모델일수록 내부 동작을 사람이 해석하기는 어려워집니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-hard-005",
      conceptId: "manifold-hypothesis-feature-space",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "2D 피처 공간에서 참 함수 $Y = f^*(X_1, X_2) + \epsilon$의 곡면(Surface) 구조를 학습할 때, 데이터점 주변에서의 국소적 선형 근사가 가질 수 있는 한계는?",
      options: [
        "피처 공간 전체의 급격한 곡률이나 비선형 상호작용 패턴을 대역적으로 설명하지 못한다.",
        "측정 오차의 기댓값을 음수로 만든다.",
        "라벨 $Y$의 값을 항상 고정된 상수로 만든다.",
        "2차원 공간을 1차원 공간으로 강제 축소한다."
      ],
      answer: 0,
      explanation: "국소적(Local) 선형 근사는 해당 영역 근처에서는 유효하지만, 피처 공간 전체의 복잡한 비선형 곡률이나 피처 간 상호작용을 파악하는 데는 한계가 있습니다[cite: 5].",
      hint: "좁은 영역에서의 직선 근사는 전체 공간의 복잡한 굽은 형태를 다 담지 못합니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-hard-006",
      conceptId: "rule-based-vs-ml-generalization",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "규칙 기반 AI와 달리 머신러닝 시스템이 유연한 수용성을 갖는 통계적 원인은?",
      options: [
        "확률 분포 상의 데이터를 통해 가설 공간 내에서 오차를 최소화하는 연속적/확률적 매핑 함수를 추정하기 때문",
        "명시적인 이진 조건문만을 하드코딩하기 때문",
        "모든 예외 케이스를 인간이 미리 수동으로 입력해 두기 때문",
        "데이터가 없어도 가설 공간을 스스로 생성하기 때문"
      ],
      answer: 0,
      explanation: "머신러닝은 관측된 데이터의 확률 분포를 바탕으로 가설 공간에서 오차를 줄이는 함수를 통계적으로 추정하므로 새로운 입력에도 유연하게 대처합니다[cite: 5].",
      hint: "데이터의 통계적 분포를 바탕으로 오차를 줄이는 함수를 추정합니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-hard-007",
      conceptId: "sample-variance-and-model-instability",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "학습 데이터셋 $D$가 전체 모집단(Population)의 일부 표본(Sample)에 불과할 때, 표현력이 지나치게 높은 모델을 학습시킬 경우 발생하는 수학적 문제는?",
      options: [
        "표본 추출의 무작위 변동(Sample Variance)에 모델이 민감하게 반응하여 모델 추정의 분산이 매우 커진다.",
        "모델의 편향(Bias)과 분산(Variance)이 모두 동시에 0으로 수렴한다.",
        "모집단의 참 함수 $f^*$와의 오차가 완전히 사라진다.",
        "학습 알고리즘의 수렴 속도가 무한대로 빨라진다."
      ],
      answer: 0,
      explanation: "표본의 무작위 노이즈에 과도하게 적응하면 표본이 조금만 바뀌어도 예측 함수가 크게 흔들리는 높은 분산(High Variance) 문제가 발생합니다[cite: 5].",
      hint: "표본이 달라질 때 모델의 예측 결과가 크게 흔들리는 '분산' 문제입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-hard-008",
      conceptId: "target-function-identifiability",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "유한한 개수의 데이터셋 $D = \{(x_i, y_i)\}_{i=1}^n$ 만으로는 참 함수 $f^*$를 유일하게 결정할 수 없다는 이론적 문제는?",
      options: [
        "식별 불가능성 (Unidentifiability / Ill-posed Problem)",
        "완벽한 정규화 (Perfect Regularization)",
        "단조 증가성 (Monotonicity)",
        "독립성 (Independence)"
      ],
      answer: 0,
      explanation: "유한한 점 데이터만 통과하는 무수히 많은 지수/다항 함수가 존재할 수 있으므로, 제한된 데이터만으로는 참 함수 $f^*$를 단 하나로 유일하게 식별할 수 없습니다[cite: 5].",
      hint: "한정된 데이터 점들을 지나는 후보 함수는 무수히 많이 존재한다는 문제입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-hard-009",
      conceptId: "loss-function-convexity",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "가설 공간 내에서 모델을 최적화할 때 손실 함수(Loss Function)의 볼록성(Convexity)이 갖는 중요한 의미는?",
      options: [
        "손실 함수가 볼록(Convex)하면 국소 최솟값(Local Minimum)이 곧 전역 최솟값(Global Minimum)이 되어 최적화가 보장된다.",
        "손실 함수가 볼록하면 최적점이 존재하지 않는다.",
        "볼록한 손실 함수에서는 경사하강법을 사용할 수 없다.",
        "볼록성은 모델의 파라미터 개수를 항상 1개로 제한한다."
      ],
      answer: 0,
      explanation: "Convex 손실 공간에서는 어떠한 Local Minimum도 곧 Global Minimum이 되므로 안정적이고 확실한 최적화가 가능합니다[cite: 5].",
      hint: "Local Minimum이 곧 Global Minimum이 되는 수학적 성질입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-hard-010",
      conceptId: "feature-engineering-vs-representation",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "고전적 ML의 피처 엔지니어링(Feature Engineering)과 딥러닝의 표현 학습(Representation Learning)의 차이는?",
      options: [
        "고전적 ML은 사람이 도메인 지식으로 피처를 직접 추출하지만, 딥러닝은 신경망 내부 계층을 통해 데이터로부터 유용한 표현을 자율 학습한다.",
        "고전적 ML은 라벨이 필요 없고, 딥러닝은 정답 라벨이 필수이다.",
        "고전적 ML은 오직 이미지에만 쓰이고, 딥러닝은 텍스트에만 쓰인다.",
        "두 방식 모두 사람이 피처 추출 수식을 만 줄 코딩해야 한다."
      ],
      answer: 0,
      explanation: "딥러닝(Representation Learning)은 사람이 피처를 가공하지 않아도 은닉층을 통해 유용한 특성 표현을 스스로 학습해냅니다[cite: 5].",
      hint: "사람이 수동으로 특성을 뽑는지, 신경망이 스스로 표현을 배우는지의 차이입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-hard-011",
      conceptId: "data-drift-concept",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "시간이 흐름에 따라 실제 환경의 변화로 $X$와 $Y$ 사이의 참 함수 $f^*$나 데이터 분포 $P(X, Y)$가 변하여 기존 모델의 성능이 저하되는 현상은?",
      options: [
        "개념 표류 / 데이터 드리프트 (Concept Drift / Data Drift)",
        "기울기 소실 (Gradient Vanishing)",
        "과소적합 (Underfitting)",
        "차원 축소 (Dimensionality Reduction)"
      ],
      answer: 0,
      explanation: "시간이 지남에 따라 입력과 정답 간의 실제 관계나 입력 데이터의 분포가 달라지는 것을 Concept/Data Drift라 합니다[cite: 5].",
      hint: "시간에 따라 데이터 및 입력-정답 관계의 분포가 표류(Drift)하는 현상입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-hard-012",
      conceptId: "multivariate-feature-vector",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "다변량 피처 공간 $\mathbb{R}^p$에서 샘플 $x_i$와 $x_j$ 간의 거리를 유클리드 거리로 측정할 때, 피처 스케일(Scale) 정규화가 이루어지지 않으면 발생하는 문제는?",
      options: [
        "값의 범위(Scale)가 큰 피처 하나가 전체 거리 계산 결과를 지배하여 다른 중요 피처들의 영향력이 묻힌다.",
        "거리 계산값이 항상 0이 된다.",
        "가설 공간의 크기가 무한대로 늘어난다.",
        "모든 샘플이 동일한 위치로 합쳐진다."
      ],
      answer: 0,
      explanation: "스케일 정규화가 없으면 수치 단위가 큰 특성(예: 수입 원)이 단위가 작은 특성(예: 나이 세)보다 거리 계산에 과도한 영향력을 미칩니다[cite: 5].",
      hint: "수치 단위 범위가 큰 특성이 거리 연산 결과를 독점해 버립니다[cite: 5]."
    },
    {
      id: "ml-c1-sa-hard-013",
      conceptId: "irreducible-error-sa",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "short-answer",
      prompt: "모델을 아무리 완벽하게 개선하더라도 데이터 자체의 노이즈나 측정 한계 때문에 줄일 수 없는 오차 항의 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["줄일 수 없는 오차", "줄일수없는오차", "Irreducible Error", "irreducible error"],
      explanation: "데이터 자체의 분산 노이즈인 Irreducible Error(줄일 수 없는 오차) 입니다[cite: 5].",
      hint: "영문 'Irreducible Error' 또는 한글 '줄일 수 없는 오차' 입니다[cite: 5]."
    },
    {
      id: "ml-c1-sa-hard-014",
      conceptId: "inductive-bias-sa",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "short-answer",
      prompt: "학습 알고리즘이 관측되지 않은 데이터의 정답을 추론할 수 있도록 가설 공간을 제한하거나 사전에 부여하는 가정/편향은?",
      options: [],
      answer: null,
      acceptedAnswers: ["귀납적 편향", "귀납적편향", "Inductive Bias", "inductive bias"],
      explanation: "Inductive Bias(귀납적 편향) 개념입니다[cite: 5].",
      hint: "귀납적(Inductive) 편향(Bias) 입니다[cite: 5]."
    },
    {
      id: "ml-c1-es-hard-015",
      conceptId: "expected-prediction-error-essay",
      difficulty: "hard",
      category: "AI/ML 기초 및 데이터",
      questionType: "essay",
      prompt: "모형 $Y = f^*(X) + \epsilon$에서 새로운 입력 $X$에 대한 예측 오차 $E[(Y - \hat{f}(X))^2]$가 '줄일 수 있는 오차(Reducible Error)'와 '줄일 수 없는 오차(Irreducible Error)'로 어떻게 분해되는지 수식적 의미와 함께 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Reducible", "Irreducible", "편향", "분산", "노이즈"],
      modelAnswer: "예측 오차는 $E[(f^*(X) - \hat{f}(X))^2] + \text{Var}(\epsilon)$ 으로 분해된다. 앞항은 모델 학습을 통해 줄일 수 있는 오차(Reducible Error)로서 편향 제곱과 모델 분산의 합으로 구성되며, 뒤항 $\text{Var}(\epsilon)$은 데이터 자체의 노이즈 및 측정 한계로 인해 어떤 모델로도 줄일 수 없는 오차(Irreducible Error)이다[cite: 5].",
      rubricKeywords: ["줄일 수 있는 오차 (편향^2 + 분산)", "줄일 수 없는 오차 $\\text{Var}(\\epsilon)$", "데이터 자체 노이즈"],
      minLength: 20,
      explanation: "기대 예측 오차 수식의 줄일 수 있는 오차(편향+분산)와 데이터 노이즈인 줄일 수 없는 오차 분해를 서술합니다[cite: 5].",
      hint: "모델 개선으로 줄일 수 있는 부분(편향+분산)과 불가능한 부분(노이즈 분산)을 나누어 기술하세요[cite: 5]."
    },

    // ==========================================
    // 카테고리 2: 지도학습 및 평가 지표 (15문항)
    // ==========================================
    {
      id: "ml-c2-mc-hard-001",
      conceptId: "cross-entropy-mle-derivation",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "이진 분류에서 정답 $y_i \in \{0, 1\}$에 대해 베르누이 분포 가능도를 최대화하는 MLE 문제로부터 교차 엔트로피(Cross-Entropy) 손실함수가 유도되는 수식적 연결 원리는?",
      options: [
        "음의 로그 우도(Negative Log-Likelihood, NLL)를 최소화하는 것이 교차 엔트로피 손실을 최소화하는 것과 수학적으로 완벽히 동일하기 때문",
        "MSE의 제곱근을 취한 것과 같기 때문",
        "결정계수 $R^2$을 1에서 뺀 것과 같기 때문",
        "모든 예측 확률을 0.5로 고정해주기 때문"
      ],
      answer: 0,
      explanation: "베르누이 우도 함수에 $-\log$를 취해 정리하면 분류의 대표 손실함수인 Cross-Entropy(NLL) 수식이 정확히 도출됩니다[cite: 5].",
      hint: "음의 로그 우도(Negative Log-Likelihood) 최소화와 교차 엔트로피는 동일합니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-hard-002",
      conceptId: "r2-score-math-decomposition",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "결정계수 $R^2 = 1 - \frac{\text{SS}_{\text{res}}}{\text{SS}_{\text{tot}}}$ 수식에서 $\text{SS}_{\text{tot}} = \sum (y_i - \bar{y})^2$ 와 $\text{SS}_{\text{res}} = \sum (y_i - \hat{y}_i)^2$ 의 의미로 바른 것은?",
      options: [
        "$\text{SS}_{\text{tot}}$는 라벨의 전체 총변동(총제곱합)이고, $\text{SS}_{\text{res}}$는 모델이 설명하지 못하고 남은 잔차제곱합이다.",
        "$\text{SS}_{\text{tot}}$는 모델의 예측값 총합이다.",
        "$\text{SS}_{\text{res}}$는 독립 변수 $X$의 편차제곱합이다.",
        "$\text{SS}_{\text{tot}}$는 항상 0이다."
      ],
      answer: 0,
      explanation: "전체 변동량($\text{SS}_{\text{tot}}$) 대비 모델 오차($\text{SS}_{\text{res}}$)의 비율을 1에서 뺌으로써 모델의 설명력 비율 $R^2$을 구합니다[cite: 5].",
      hint: "총변동 대비 설명하지 못한 잔차 변동의 비율을 1에서 뺍니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-hard-003",
      conceptId: "adjusted-r2-formula",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "무의미한 피처가 추가될 때 $R^2$이 무조건 증가하는 단점을 보완하기 위해 자유도(샘플 수 $n$, 피처 수 $p$)를 고려한 수정 결정계수(Adjusted $R^2$) 수식은?",
      options: [
        "$R_{\text{adj}}^2 = 1 - \left[ \frac{(1 - R^2)(n - 1)}{n - p - 1} \right]$",
        "$R_{\text{adj}}^2 = R^2 \times \frac{n}{p}$",
        "$R_{\text{adj}}^2 = 1 - \frac{p}{n}$",
        "$R_{\text{adj}}^2 = R^2 - p$"
      ],
      answer: 0,
      explanation: "수정 결정계수는 샘플 수 $n$과 피처 수 $p$로 자유도를 조정하여 무의미한 피처 추가 시 감점 페널티를 부여합니다[cite: 5].",
      hint: "자유도 항목 $(n-1)/(n-p-1)$로 페널티를 조정합니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-hard-004",
      conceptId: "type-1-vs-type-2-error-cost",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "신용카드 사기 탐지(Fraud)나 질병 진단 시스템에서 제1종 오류(FP) 대비 제2종 오류(FN)가 치명적인 이유는?",
      options: [
        "진짜 사기/질병(양성)을 정상으로 잘못 분류(FN)하여 놓칠 경우 발생하는 손실 비용이 훨씬 심각하기 때문에",
        "FN 오류가 나면 컴퓨터가 다운되기 때문에",
        "FP 오류는 정확도를 항상 0으로 만들기 때문에",
        "FN 오류가 일어날 경우 정밀도가 무조건 1이 되기 때문에"
      ],
      answer: 0,
      explanation: "사기 거래나 질병을 놓치는 것(FN)은 정상 건을 재검사하는 오탐(FP) 비용보다 훨씬 막대한 손실을 초래합니다[cite: 5].",
      hint: "실제 양성(사기/질병)을 놓치는 문제(FN)가 발생할 때의 파급력을 생각해보세요[cite: 5]."
    },
    {
      id: "ml-c2-mc-hard-005",
      conceptId: "pr-curve-vs-roc-curve-imbalance",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "음성(Negative) 클래스가 양성 대비 99:1로 압도적으로 많은 불균형 데이터셋 평가 시 ROC-AUC보다 PR(Precision-Recall) 커브가 더 유용한 이유는?",
      options: [
        "ROC 커브의 FPR분모($TN + FP$)에서 대다수인 $TN$이 너무 크기 때문에 FP 변화에 따른 FPR 변화가 왜곡되는 반면, PR 커브는 양성에만 집중하기 때문에",
        "PR 커브는 계산 속도가 100배 빠르기 때문에",
        "ROC 커브는 이진 분류에서 사용할 수 없기 때문에",
        "PR 커브는 항상 1의 값을 반환하기 때문에"
      ],
      answer: 0,
      explanation: "ROC의 FPR은 거대한 $TN$ 때문에 오탐(FP)에 둔감해지지만, PR 커브는 $TP, FP, FN$ 등 양성 위주로 구성되어 불균형 평가에 정밀합니다[cite: 5].",
      hint: "거대한 TN 수치가 분모에 들어가는 ROC FPR의 왜곡 현상 때문입니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-hard-006",
      conceptId: "macro-vs-micro-f1",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "다중 클래스 분류에서 각 클래스별 F1-score를 구한 뒤 클래스별 샘플 수와 상관없이 단순 평균을 내는 지표는?",
      options: ["Macro F1-score", "Micro F1-score", "Weighted F1-score", "Accuracy"],
      answer: 0,
      explanation: "Macro F1은 클래스별 F1 스코어의 가중치 없는 단순 평균으로, 소수 클래스에서의 성능을 동등한 비중으로 평가합니다[cite: 5].",
      hint: "클래스 규모와 상관없이 매크로(Macro)하게 단순 평균을 냅니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-hard-007",
      conceptId: "log-loss-asymptotic-penalty",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "실제 정답이 $y=1$인 샘플에 대해 분류 모델의 예측 확률 $\hat{p} \to 0$ 으로 잘못 확신할 때 Cross-Entropy 손실값이 보여주는 극단적 동작은?",
      options: [
        "손실 $L = -\log(\hat{p})$ 이 무한대($+\infty$)로 급격히 발산하여 모델에 막대한 손실 페널티를 인가한다.",
        "손실값이 0으로 수렴한다.",
        "손실값이 음수로 변한다.",
        "손실값이 1로 고정된다."
      ],
      answer: 0,
      explanation: "정답($y=1$)에 대해 확률을 0에 가깝게 잘못 예측하면 $-\log(0) \to \infty$ 가 되어 극단적 손실 페널티를 부과합니다[cite: 5].",
      hint: "로그 함수 $-\log(x)$에서 $x \to 0$일 때의 발산 특성입니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-hard-008",
      conceptId: "generalization-gap-concept",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "테스트 손실과 훈련 손실의 차이인 Generalization Gap ($\text{Loss}_{\text{test}} - \text{Loss}_{\text{train}}$)이 점차 커지는 현상이 나타내는 시사점은?",
      options: [
        "모델이 훈련 데이터에 과적합(Overfitting)되기 시작하여 일반화 능력이 상실되고 있다.",
        "모델이 언더피팅 상태에서 벗어나 완벽히 학습되었다.",
        "학습 데이터의 양이 무한대로 늘어나고 있다.",
        "테스트 데이터의 라벨이 잘못되었다."
      ],
      answer: 0,
      explanation: "Generalization Gap이 벌어진다는 것은 훈련 손실만 낮아지고 테스트 손실은 커지는 과적합 진입을 의미합니다[cite: 5].",
      hint: "훈련 손실과 테스트 손실의 격차가 벌어질 때의 위험 상태입니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-hard-009",
      conceptId: "zero-one-loss-non-differentiable",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "분류의 0-1 손실함수 $\mathbb{I}(y_i \neq \hat{y}_i)$를 직접 경사하강법 학습의 손실함수로 사용할 수 없는 근본적 수학적 이유는?",
      options: [
        "지시 함수 형태라 불연속적이고 대부분 구간에서 미분값이 0이 되어 기울기 전파가 불가능하기 때문",
        "계산 결과가 무조건 음수가 나오기 때문",
        "손실값이 무한대로 커지기 때문",
        "0-1 손실함수는 정수만 입력받을 수 있어서"
      ],
      answer: 0,
      explanation: "0-1 Loss(정확도 기준)는 계단형 불연속 함수라 미분값이 0이므로 경사하강법의 손실함수로 쓰지 못하며, 대안으로 Cross-Entropy를 씁니다[cite: 5].",
      hint: "계단형 불연속 함수라 미분(Gradient)을 통해 경사를 구할 수 없습니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-hard-010",
      conceptId: "mse-unsuitability-logistic",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "시그모이드 활성화 함수를 가진 이진 분류 모델에 MSE 손실을 결합할 경우 최적화 시 발생하는 문제는?",
      options: [
        "손실 평면이 비볼록(Non-convex)해져 수많은 Local Minima에 빠지기 쉽고 Gradient Saturation이 발생한다.",
        "손실 함수가 완벽한 볼록(Convex) 공간이 된다.",
        "모든 가중치 미분값이 무한대로 발산한다.",
        "정확도가 항상 100%가 된다."
      ],
      answer: 0,
      explanation: "Sigmoid + MSE 결합은 Non-convex 손실 곡면을 만들어 경사하강법 최적화가 Local Minima에 갇히게 됩니다[cite: 4, 5].",
      hint: "손실 곡면이 비볼록(Non-convex)해져 Local Minima 위험이 생깁니다[cite: 4, 5]."
    },
    {
      id: "ml-c2-mc-hard-011",
      conceptId: "cost-sensitive-learning",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "False Negative(오류 누락)의 비용이 False Positive(오탐) 비용보다 훨씬 큰 경우, 임계값(Threshold)을 어떻게 조정하는 것이 바람직한가?",
      options: [
        "양성 판정 임계값을 0.5보다 낮추어 재현율(Recall)을 올리고 FN을 최소화한다.",
        "임계값을 0.99로 극단적으로 높인다.",
        "임계값을 완전히 제거한다.",
        "정밀도(Precision)만 100%로 고정한다."
      ],
      answer: 0,
      explanation: "FN의 손실이 클 때는 확률 임계값(Threshold)을 낮추어(예: 0.2) 적극적으로 양성 판정을 내리게 함으로써 재현율을 높입니다[cite: 5].",
      hint: "판정 문턱(Threshold)을 낮추어 조금만 의심스러워도 양성으로 판정하게 만듭니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-hard-012",
      conceptId: "covariate-shift-concept",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "입력-정답 관계 $P(Y|X)$는 동일하지만, 입력 피처의 분포 $P(X)$가 훈련과 테스트 간에 변하는 데이터 변화 유형은?",
      options: ["공변량 변화 (Covariate Shift)", "개념 변화 (Concept Shift)", "라벨 변화 (Prior Probability Shift)", "과적합"],
      answer: 0,
      explanation: "조건부 확률 $P(Y|X)$는 일정하나 입력 피처 분포 $P(X)$가 달라지는 것을 Covariate Shift라 부릅니다[cite: 5].",
      hint: "공변량(Covariate / 입력 피처 $X$)의 분포 변화입니다[cite: 5]."
    },
    {
      id: "ml-c2-sa-hard-013",
      conceptId: "adjusted-r2-sa",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "short-answer",
      prompt: "무의미한 피처가 추가될 때 무조건 상승하는 결정계수를 보완하기 위해 샘플 수 $n$과 피처 수 $p$의 자유도를 반영한 지표 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["수정 결정계수", "수정결정계수", "Adjusted R2", "Adjusted R-squared", "Adjusted R^2"],
      explanation: "Adjusted R-squared (수정 결정계수) 입니다[cite: 5].",
      hint: "수정 결정계수 입니다[cite: 5]."
    },
    {
      id: "ml-c2-sa-hard-014",
      conceptId: "roc-auc-sa",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "short-answer",
      prompt: "임계값 변화에 따른 TPR과 FPR의 궤적을 나타낸 곡선 아래 면적 수치를 나타내는 평가 지표 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["ROC-AUC", "ROC AUC", "AUC-ROC", "AUC", "roc-auc"],
      explanation: "ROC-AUC 지표입니다[cite: 5].",
      hint: "ROC-AUC 6글자 표기입니다[cite: 5]."
    },
    {
      id: "ml-c2-es-hard-015",
      conceptId: "cross-entropy-vs-mse-classification-essay",
      difficulty: "hard",
      category: "지도학습 및 평가 지표",
      questionType: "essay",
      prompt: "분류 문제에서 Sigmoid 활성화 함수 사용 시 MSE 손실 대신 교차 엔트로피(Cross-Entropy) 손실을 사용해야만 하는 수학적 이유(손실 공간의 볼록성 및 경사 소실)를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["비볼록", "Non-convex", "볼록", "Convex", "Sigmoid 미분"],
      modelAnswer: "Sigmoid 함수에 MSE를 결합하면 손실 곡면이 비볼록(Non-convex)해져 수많은 Local Minima에 빠지기 쉽다. 또한 오차가 클 때 Sigmoid의 미분값이 0에 가까워져 경사 소실(Gradient Saturation)이 일어난다. 반면 Cross-Entropy 손실은 $-\\log$ 연산이 Sigmoid의 지수항을 상쇄하여 볼록(Convex) 공간을 형성하고 오차가 클수록 강력한 경사 신호를 제공하므로 효율적 최적화가 가능하다[cite: 4, 5].",
      rubricKeywords: ["Sigmoid+MSE 비볼록(Non-convex)", "Local Minima 위험", "Cross-Entropy 볼록(Convex) 공간 형성 및 경사 보장"],
      minLength: 20,
      explanation: "Sigmoid+MSE의 Non-convex성 및 기울기 소실 문제와 Cross-Entropy의 Convex성 및 강력한 보정 기울기 제공 원리를 서술합니다[cite: 4, 5].",
      hint: "비볼록(Non-convex) 손실 공간과 Sigmoid 미분 시의 경사 소실 문제를 서술하세요[cite: 4, 5]."
    },

    // ==========================================
    // 카테고리 3: 검증 및 교차검증 (15문항)
    // ==========================================
    {
      id: "ml-c3-mc-hard-001",
      conceptId: "training-error-optimism",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "훈련 오류 $\text{Err}_{\text{train}}$이 실제 테스트 오류 $\text{Err}_{\text{test}}$에 비해 낙관적으로 과소평가되는 통계적 이유는?",
      options: [
        "모델의 파라미터가 훈련 데이터 샘플의 무작위 노이즈와 특성을 직접 기팅(Fitting)하여 맞추도록 최소화되었기 때문",
        "훈련 데이터의 샘플 수가 무한대이기 때문",
        "테스트 데이터에는 정답 라벨이 존재하지 않기 때문",
        "교차검증 시 K-fold의 K가 너무 크기 때문"
      ],
      answer: 0,
      explanation: "모델 가중치가 훈련 데이터 표본을 직접 최적화(Fitting)하여 얻어졌으므로 훈련 오류는 언제나 테스트 오류보다 더 낮게 왜곡됩니다[cite: 5].",
      hint: "훈련 데이터 점들을 직접 맞춰가며 파라미터가 학습되었기 때문입니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-hard-002",
      conceptId: "loocv-computational-shortcut-linear",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "단순/다중 선형회귀 모델에서 LOOCV($K=n$)를 실행할 때, $n$번 재학습하지 않고 1번의 모델 적합만으로 LOOCV MSE를 즉시 구하는 수식은?",
      options: [
        "$\\text{CV}_{(n)} = \\frac{1}{n} \\sum_{i=1}^n \\left( \\frac{y_i - \\hat{y}_i}{1 - h_{ii}} \\right)^2$ (단, $h_{ii}$는 Hat Matrix 대각 원소)",
        "$\\text{CV}_{(n)} = \\sum_{i=1}^n (y_i - \\hat{y}_i)^2$",
        "$\\text{CV}_{(n)} = \\frac{\\text{MSE}}{n}$",
        "$\\text{CV}_{(n)} = 1 - R^2$"
      ],
      answer: 0,
      explanation: "선형회귀에서는 Hat Matrix의 대각 원소 Leverage $h_{ii}$를 이용해 $n$번 재학습 없이 단 1회 연산으로 LOOCV 오차를 수식 산출할 수 있습니다[cite: 4, 5].",
      hint: "Hat Matrix의 대각 원소인 레버리지 $h_{ii}$를 이용한 정규화 수식입니다[cite: 4, 5]."
    },
    {
      id: "ml-c3-mc-hard-003",
      conceptId: "k-fold-variance-bias-tradeoff-math",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "K-겹 교차검증에서 $K=5$ 또는 $10$이 $K=n$(LOOCV)에 비해 분산(Variance) 측면에서 오차 추정에 더 유리할 수 있는 원리는?",
      options: [
        "LOOCV는 $n-1$개 샘플로 구성된 훈련셋들이 거의 중복되어 모델 간 상관관계가 매우 높아 평균 시 분산이 커지는 반면, $K=10$은 훈련셋 간 상관관계가 적어 오차 추정치의 분산이 낮아지기 때문",
        "LOOCV는 훈련셋 크기가 너무 작아 편향이 높기 때문",
        "10-Fold CV는 무조건 편향이 0이기 때문",
        "LOOCV는 훈련 오차만 측정하기 때문"
      ],
      answer: 0,
      explanation: "LOOCV의 훈련 폴드들은 99% 이상 겹쳐 모델 간 correlation이 매우 높아 평균을 내도 추정량의 분산(Variance)이 크게 남는 한계가 있습니다[cite: 5].",
      hint: "LOOCV는 폴드 간 훈련 데이터가 거의 똑같아 모델 간 높은 상관관계로 추정 분산이 커집니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-hard-004",
      conceptId: "data-leakage-in-preprocessing",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "교차검증 시 데이터 전처리(예: 스케일링, 임퓨테이션) 과정을 전체 데이터셋에 먼저 적용한 후 폴드를 분할할 때 발생하는 치명적 오류는?",
      options: [
        "검증 폴드의 정보가 전처리 통계량(평균/표준편차)을 통해 훈련에 유출되는 데이터 누출(Data Leakage)이 일어나 검증 점수가 낙관적으로 오염됨",
        "데이터가 완전히 삭제되어 학습이 중단됨",
        "오버피팅이 100% 방지됨",
        "K-fold CV의 K가 0으로 줄어듦"
      ],
      answer: 0,
      explanation: "전처리를 분할 전에 전체에 적용하면 검증 폴드의 정보가 훈련 과정으로 스며드는 Data Leakage가 발생합니다[cite: 5].",
      hint: "검증 폴드의 통계 정보가 훈련 단계로 유출(Leakage)됩니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-hard-005",
      conceptId: "nested-cross-validation",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "하이퍼파라미터 탐색(튜닝)과 모델의 일반화 성능 평가를 완전히 분리하여 편향 없이 객관적으로 추정하기 위해 사용되는 검증 구조는?",
      options: ["중첩 교차검증 (Nested Cross-Validation)", "단순 홀드아웃", "LOOCV", "부트스트랩"],
      answer: 0,
      explanation: "외부 루프(Outer Loop)에서는 일반화 오차를 평가하고, 내부 루프(Inner Loop)에서는 하이퍼파라미터를 튜닝하는 Nested CV를 사용합니다[cite: 5].",
      hint: "외부 루프와 내부 루프가 이중으로 겹쳐진 중첩(Nested) 교차검증입니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-hard-006",
      conceptId: "bias-variance-decomposition-error",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "회귀 모델의 기대 테스트 오차 분해 수식 $E[(y_0 - \hat{f}(x_0))^2] = \text{Bias}(\hat{f}(x_0))^2 + \text{Var}(\hat{f}(x_0)) + \text{Var}(\epsilon)$ 에 대한 해석으로 옳지 않은 것은?",
      options: [
        "모델의 복잡도를 높이면 편향과 분산이 모두 동시에 감소하여 오차가 0이 된다.",
        "모델 복잡도를 높이면 편향은 줄어들지만 분산은 증가한다.",
        "학습 알고리즘을 아무리 개선해도 데이터 노이즈 $\text{Var}(\epsilon)$ 이하로 오차를 줄일 수는 없다.",
        "최적의 일반화 모델은 편향과 분산의 합이 최소가 되는 균형 지점이다."
      ],
      answer: 0,
      explanation: "편향과 분산은 트레이드오프 관계여서 모델 복잡도가 커지면 편향은 줄지만 분산은 늘어나므로 동시에 0이 될 수 없습니다[cite: 5].",
      hint: "편향과 분산은 어느 한쪽이 줄면 다른 쪽이 늘어나는 트레이드오프 관계입니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-hard-007",
      conceptId: "group-k-fold-need",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "동일 환자의 여러 장의 의료 사진 데이터처럼 데이터 간 그룹 종속성이 존재할 때, 동일 그룹 샘플이 훈련과 검증에 쪼개져 들어가는 것을 막는 CV 방식은?",
      options: ["Group K-Fold 교차검증", "Stratified K-Fold", "LOOCV", "Random Split"],
      answer: 0,
      explanation: "Group K-Fold는 동일한 그룹 ID를 가진 샘플들이 훈련셋과 검증셋에 나누어 들어가지 않고 통째로 한쪽에만 속하도록 분할합니다[cite: 5].",
      hint: "그룹(Group) 단위로 묶어서 폴드를 나눕니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-hard-008",
      conceptId: "cv-error-standard-error",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "K-fold CV에서 도출된 $K$개의 오차 평균값을 비교할 때, '1-SE 규칙(One Standard Error Rule)'을 적용하여 모델을 선택하는 가이드라인은?",
      options: [
        "최저 오차를 기록한 모델의 오차 값으로부터 1 표준오차(SE) 범위 내에 있는 가장 단순한(Simpler) 모델을 최종 선택한다.",
        "무조건 오차가 0.001이라도 더 낮은 가장 복잡한 모델을 선택한다.",
        "표준오차 수치가 가장 큰 모델을 고른다.",
        "K개의 오차 중 중간값만 사용한다."
      ],
      answer: 0,
      explanation: "1-SE 규칙은 가장 오차가 적은 모델과 통계적으로 유의미한 차이가 없는 범위 내에서 오버피팅 위험이 적은 가장 단순한 모델을 고르는 절약 원칙입니다[cite: 5].",
      hint: "최저 오차와 통계적으로 큰 차이가 없다면 더 단순한 모델을 고릅니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-hard-009",
      conceptId: "time-series-cv-leakage",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "시계열(Time-series) 데이터에 무작위 셔플링 K-fold CV를 직접 적용하면 발생하는 심각한 문제는?",
      options: [
        "미래의 데이터 정보가 과거 훈련 데이터로 스며드는 미래 정보 누출(Look-ahead Leakage)이 일어난다.",
        "데이터 개수가 자동으로 감소한다.",
        "모델의 편향이 0이 된다.",
        "아무런 문제도 발생하지 않고 완벽히 작동한다."
      ],
      answer: 0,
      explanation: "시계열 데이터에 무작위 셔플링을 쓰면 미래 시점 데이터가 과거 시점 모델 훈련에 이용되는 Look-ahead Leakage가 발생하므로 시간 순서를 유지하는 TimeSeriesSplit을 써야 합니다[cite: 5].",
      hint: "미래의 정보가 과거 학습 단계로 유출(Look-ahead)되는 문제입니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-hard-010",
      conceptId: "optimism-of-validation-performance-search",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "수천 개의 하이퍼파라미터 조합 중 검증셋(Validation) 점수가 가장 높은 1개 조합을 골랐을 때, 해당 검증 점수가 지니는 성격은?",
      options: [
        "검증셋 자체에 오버피팅되었을 수 있으므로 완전히 독립된 테스트셋 점수보다 낙관적으로 부풀려져(Optimistic) 있다.",
        "테스트셋 점수보다 무조건 비관적으로 낮게 측정된다.",
        "독립된 테스트셋 점수와 완벽하게 항상 일치한다.",
        "편향이 0이 된다."
      ],
      answer: 0,
      explanation: "수많은 탐색 조합 중 최고 검증 점수를 선택하는 것 자체도 검증셋에 대한 오버피팅이므로 최종 테스트셋 성능은 이보다 낮을 수 있습니다[cite: 5].",
      hint: "검증셋을 가지고 수많은 조정을 거쳤으므로 검증 점수 자체가 낙관적으로 부풀려질 수 있습니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-hard-011",
      conceptId: "bootstrap-validation-out-of-bag",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "복원 추출(Bootstrap)을 통해 $n$개 샘플 데이터셋을 만들 때, 한 번도 추출되지 않고 남는 약 36.8%의 Out-of-Bag(OOB) 데이터를 활용하는 목적은?",
      options: [
        "별도의 교차검증 분할 없이도 OOB 샘플들을 검증셋으로 활용해 일반화 오차를 추정하기 위해",
        "훈련셋 크기를 2배로 늘리기 위해",
        "데이터를 비지도 학습으로 전환하기 위해",
        "가중치를 초기화하기 위해"
      ],
      answer: 0,
      explanation: "부트스트랩 추출 시 선택되지 않은 약 36.8%의 OOB(Out-of-Bag) 관측치들을 자체 검증 데이터로 삼아 오차를 측정합니다[cite: 5].",
      hint: "복원 추출 시 선택되지 않고 남은 36.8%의 샘플을 검증용으로 씁니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-hard-012",
      conceptId: "cv-variance-and-k-choice",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "$K$-fold CV에서 $K=2$ 처럼 $K$를 매우 작게 설정할 때의 모델 학습 및 추정 특성은?",
      options: [
        "각 폴드의 훈련셋 크기가 전체의 50%로 작아져 모델의 편향(Bias)이 높아지고 테스트 오류를 과대평가하기 쉽다.",
        "편향이 0으로 수렴한다.",
        "LOOCV보다 연산 시간이 100배 오래 걸린다.",
        "훈련셋 간 데이터 겹침이 99% 이상 발생한다."
      ],
      answer: 0,
      explanation: "$K=2$이면 훈련 데이터 크기가 절반($N/2$)으로 크게 축소되어 전체 데이터로 학습할 때보다 모델이 약해지고 편향이 커집니다[cite: 5].",
      hint: "훈련 데이터 크기가 절반으로 줄어들어 모델의 편향(Bias)이 커집니다[cite: 5]."
    },
    {
      id: "ml-c3-sa-hard-013",
      conceptId: "data-leakage-sa",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "short-answer",
      prompt: "전처리나 특성 추출 시 검증/테스트 정보가 훈련 단계로 유출되어 검증 성능이 낙관적으로 오염되는 현상은?",
      options: [],
      answer: null,
      acceptedAnswers: ["데이터 누출", "데이터누출", "Data Leakage", "data leakage"],
      explanation: "Data Leakage(데이터 누출) 현상입니다[cite: 5].",
      hint: "데이터가 유출(Leakage)된다는 뜻입니다[cite: 5]."
    },
    {
      id: "ml-c3-sa-hard-014",
      conceptId: "nested-cv-sa",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "short-answer",
      prompt: "외부 루프에서 성능을 평가하고 내부 루프에서 하이퍼파라미터를 튜닝하여 평가 편향을 방지하는 교차검증 구조는?",
      options: [],
      answer: null,
      acceptedAnswers: ["중첩 교차검증", "중첩교차검증", "Nested Cross-Validation", "nested cv", "Nested CV"],
      explanation: "Nested Cross-Validation(중첩 교차검증) 입니다[cite: 5].",
      hint: "중첩(Nested) 교차검증 입니다[cite: 5]."
    },
    {
      id: "ml-c3-es-hard-015",
      conceptId: "k-fold-bias-variance-k-choice-essay",
      difficulty: "hard",
      category: "검증 및 교차검증",
      questionType: "essay",
      prompt: "K-겹 교차검증에서 $K=10$과 $K=n$(LOOCV)을 비교할 때, 편향(Bias), 분산(Variance), 및 계산 비용(Computational Cost) 측면에서의 트레이드오프를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["편향", "분산", "LOOCV", "계산 비용"],
      modelAnswer: "LOOCV($K=n$)는 $n-1$개 샘플로 학습하므로 편향이 매우 낮지만, 훈련셋 간 높은 중복으로 모델 간 상관관계가 커져 추정량의 분산이 증가하고 $n$번 재학습으로 계산 비용이 극도로 크다. 반면 $K=10$은 편향은 약간 높을 수 있으나 훈련셋 간 독립성이 커져 분산이 낮고 계산 비용이 훨씬 적어 실무적으로 우수하다[cite: 5].",
      rubricKeywords: ["LOOCV 낮은 편향 & 높은 분산 & 큰 계산 비용", "$K=10$ 적절한 편향/분산 밸런스 & 적은 계산 비용"],
      minLength: 20,
      explanation: "LOOCV의 편향/분산/계산비용 특성과 10-fold CV의 실무적 밸런스 이점을 서술합니다[cite: 5].",
      hint: "편향, 분산, 계산 비용 3가지 관점에서 LOOCV와 K=10을 비교해 보세요[cite: 5]."
    },

    // ==========================================
    // 카테고리 4: 비지도학습 및 군집화 (15문항)
    // ==========================================
    {
      id: "ml-c4-mc-hard-001",
      conceptId: "k-means-local-minima-np-hard",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "K-means 알고리즘(Lloyd's Algorithm)의 최적화 특성에 대한 설명으로 올바른 것은?",
      options: [
        "군집 내 오차제곱합(WCSS)을 줄이는 국소 최솟값(Local Minimum)에는 반드시 수렴하지만, 초기 중심점 위치에 따라 전역 최적해(Global Optimum)를 보장하지는 못한다.",
        "초기 중심점 위치와 상관없이 무조건 전역 최적해를 찾아낸다.",
        "수학적으로 Convex 최적화 문제이므로 단 1회의 연산으로 정답이 나온다.",
        "데이터 샘플 수가 늘어나면 WCSS가 무조건 0으로 수렴한다."
      ],
      answer: 0,
      explanation: "K-means는 WCSS를 줄이는 Local Minima에는 항상 수렴하지만, NP-hard 문제 특성상 초기 중심점에 따라 전역 최적해 달성은 보장되지 않습니다[cite: 5].",
      hint: "Local Minimum 수렴은 보장되지만 초기값에 따라 전역 최적해를 못 찾을 수 있습니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-hard-002",
      conceptId: "kmeans-plus-plus-initialization",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "K-means++ 알고리즘이 초기 중심점 $k$개를 선택하는 확률적 원리는?",
      options: [
        "첫 중심점은 무작위 선택하고, 이후 중심점은 이미 선택된 중심점들과의 최소 거리가 멀수록($D(x)^2$ 비례) 높은 확률로 선택한다.",
        "모든 중심점을 가장 밀집된 데이터 중앙에 몰아서 배치한다.",
        "데이터의 가장 외곽에 있는 이상치(Outlier)들만 중심점으로 정한다.",
        "데이터의 알파벳 순서대로 정렬하여 선택한다."
      ],
      answer: 0,
      explanation: "K-means++는 이미 선택된 중심점들과 거리가 먼 데이터일수록 높은 확률($D(x)^2$)로 다음 중심점으로 뽑아 초기 분포를 퍼뜨립니다[cite: 5].",
      hint: "기존 중심점들과 거리가 멀수록 다음 중심점으로 선택될 확률이 커집니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-hard-003",
      conceptId: "hierarchical-linkage-comparison",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "계층적 군집화의 연결법(Linkage) 중 '군집 결합 시 병합 후 생성되는 군집 내 분산(Variance) 증가량을 최소화'하는 방식은?",
      options: ["와드 연결법 (Ward's Linkage)", "단일 연결법 (Single Linkage)", "완전 연결법 (Complete Linkage)", "평균 연결법 (Average Linkage)"],
      answer: 0,
      explanation: "Ward's Linkage는 두 군집을 합쳤을 때 발생하는 WCSS(군집 내 오차제곱합/분산) 증가량을 최소화하는 방향으로 병합합니다[cite: 5].",
      hint: "군집 내부 오차제곱합/분산 증가량을 최소화하는 Ward 연결법입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-hard-004",
      conceptId: "single-linkage-chaining-effect",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "단일 연결법(Single Linkage / 최단 거리)을 사용할 때 데이터점들이 사슬처럼 길게 이어져 잘못 묶이는 한계 현상은?",
      options: ["체이닝 현상 (Chaining Effect)", "구형 보장 현상", "경사 소실 현상", "보상 해킹"],
      answer: 0,
      explanation: "Single Linkage는 노이즈나 점 하나만 가까워도 군집을 합치므로 군집이 뱀처럼 늘어나는 Chaining Effect가 생기기 쉽습니다[cite: 5].",
      hint: "사슬(Chain)처럼 길게 이어지는 현상입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-hard-005",
      conceptId: "silhouette-coefficient-formula",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "샘플 $i$의 응집도 $a(i)$(자신 군집 내 평균 거리)와 분리도 $b(i)$(가장 가까운 타 군집과의 평균 거리)를 이용한 실루엣 계수 수식 $s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}$ 에서 ideal한 클러스터링일 때 $s(i)$ 값은?",
      options: ["1에 가까운 값", "0에 가까운 값", "-1에 가까운 값", "무한대"],
      answer: 0,
      explanation: "자신 군집과는 가깝고($a(i) \to 0$) 타 군집과는 멀면($b(i) \gg a(i)$) 실루엣 계수 $s(i)$는 최댓값 1에 가까워집니다[cite: 5].",
      hint: "완벽하게 응집되고 잘 분리되면 1에 수렴합니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-hard-006",
      conceptId: "pca-covariance-eigenvalues",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "PCA에서 데이터 공분산 행렬 $\Sigma$의 고유값 분해(Eigenvalue Decomposition) 시, 고유값(Eigenvalue) $\lambda_k$가 갖는 의미는?",
      options: [
        "해당 고유벡터(주성분 축) 방향으로 데이터가 보존하고 있는 분산(Variance)의 크기",
        "해당 주성분 축의 오차 비율",
        "전체 데이터 샘플 수 $n$",
        "라벨 $Y$와의 상관계수"
      ],
      answer: 0,
      explanation: "공분산 행렬의 고유값 $\lambda_k$는 사영된 $k$번째 주성분 축 방향의 데이터 분산 크기를 의미합니다[cite: 5].",
      hint: "해당 축 방향으로 퍼져 있는 분산의 크기입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-hard-007",
      conceptId: "pca-explained-variance-ratio",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "전체 $p$개 피처 중 $k$개의 주성분을 선택했을 때의 설명된 분산 비율(Explained Variance Ratio) 산출식은?",
      options: [
        "$\\frac{\\sum_{i=1}^k \\lambda_i}{\\sum_{j=1}^p \\lambda_j}$",
        "$\\frac{\\lambda_k}{\\sum_{j=1}^p \\lambda_j^2}$",
        "$\\frac{k}{p}$",
        "$\\sum_{i=1}^k \\lambda_i$"
      ],
      answer: 0,
      explanation: "전체 고유값 합 대비 선택된 $k$개 주성분 고유값의 합의 비율로 정보 보존율을 계산합니다[cite: 5].",
      hint: "전체 고유값의 합 분의 선택된 고유값들의 합입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-hard-008",
      conceptId: "non-globular-cluster-kmeans-failure",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "K-means 알고리즘이 달모양(Moon-shape)이나 동심원 같은 비구형(Non-globular) 복잡 군집 구조에서 실패하는 수학적 원인은?",
      options: [
        "유클리드 거리를 기반으로 원형/구형(Globular) 모양의 클러스터 경계만을 형성하도록 가정되어 있기 때문",
        "K-means는 2차원 데이터를 다룰 수 없기 때문",
        "비선형 활성화 함수가 없기 때문",
        "데이터 개수가 너무 많아서"
      ],
      answer: 0,
      explanation: "K-means는 중심점 기준 유클리드 거리 기반으로 Voronoi 셀을 나누므로 볼록한 구형(Globular) 군집만 잘 찾습니다[cite: 5].",
      hint: "중심점 거리 기반의 구형(Globular) 경계만 형성 가능하기 때문입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-hard-009",
      conceptId: "curse-of-dimensionality-distance",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "피처 차원 $p$가 매우 극단적으로 커질 때 유클리드 거리를 사용하는 클러스터링이 무력화되는 '차원의 저주' 현상은?",
      options: [
        "고차원 공간에서는 모든 데이터점 쌍 간의 거리가 거의 비슷해져(최대 거리 $\\approx$ 최소 거리) 거리 기반 유사도 구분이 무의미해진다.",
        "고차원에서는 모든 거리가 0이 된다.",
        "데이터의 개수가 자동으로 0이 된다.",
        "모든 데이터점이 유일한 1개 클러스터로만 묶인다."
      ],
      answer: 0,
      explanation: "차원이 매우 커지면 공간이 극도로 희소해져 가장 가까운 점과 가장 먼 점의 거리 차이가 무색해지는 거리에 오염이 생깁니다[cite: 5].",
      hint: "고차원에서는 가장 가까운 거리와 가장 먼 거리의 차이가 사라집니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-hard-010",
      conceptId: "pca-orthogonality-property",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "PCA를 통해 구해진 주성분 축들($\mathbf{u}_1, \mathbf{u}_2, ...$)이 지니는 중요한 수학적 상호 관계 성질은?",
      options: [
        "모든 주성분 축들은 서로 완벽하게 직교(Orthogonal)하며 공분산(상관관계)이 0이다.",
        "모든 주성분 축들은 서로 평행하다.",
        "주성분 축 간의 상관계수가 무조건 1이다.",
        "첫 번째 주성분을 제외한 나머지는 크기가 0이다."
      ],
      answer: 0,
      explanation: "PCA 주성분 유도 시 이전 주성분들과 직교(Orthogonal) 조건을 부여하므로 주성분 간 상관관계는 0입니다[cite: 5].",
      hint: "서로 독립이며 직교(Orthogonal)하는 축들입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-hard-011",
      conceptId: "complete-linkage-property",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "계층적 군집화의 완전 연결법(Complete Linkage)이 두 군집 간 거리를 정의하는 기준은?",
      options: ["두 군집에 속한 샘플 쌍 간의 최장(최대) 거리", "두 군집 샘플 쌍 간의 최단 거리", "중심점 간 거리", "평균 거리"],
      answer: 0,
      explanation: "Complete Linkage는 두 군집 샘플들 간의 가장 멀리 떨어진 최장 거리를 군집 간 거리로 삼습니다[cite: 5].",
      hint: "가장 멀리 떨어진 최장(Maximum) 거리 기준입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-hard-012",
      conceptId: "soft-vs-hard-clustering",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "K-means처럼 샘플을 특정 군집에 100% 소속시키는 Hard Clustering과 달리, GMM처럼 각 군집에 속할 확률을 할당하는 방식은?",
      options: ["Soft Clustering (소프트 군집화)", "Hard Clustering", "Deterministic Clustering", "Hierarchical Cut"],
      answer: 0,
      explanation: "GMM(Gaussian Mixture Model) 등처럼 각 군집에 속할 가중치 확률을 소속도로 할당하는 방식을 Soft Clustering이라 합니다[cite: 5].",
      hint: "확률적으로 부드럽게 소속도를 할당하는 Soft 군집화입니다[cite: 5]."
    },
    {
      id: "ml-c4-sa-hard-013",
      conceptId: "silhouette-score-sa",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "short-answer",
      prompt: "군집 내부 응집도와 타 군집과의 분리도를 종합하여 -1~1 사이 수치로 클러스터링 적합도를 평가하는 지표 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["실루엣 계수", "실루엣계수", "Silhouette Coefficient", "Silhouette Score", "silhouette score"],
      explanation: "Silhouette Coefficient (실루엣 계수) 입니다[cite: 5]."
    },
    {
      id: "ml-c4-sa-hard-014",
      conceptId: "ward-linkage-sa",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "short-answer",
      prompt: "계층적 군집화에서 두 군집을 합쳤을 때 발생하는 군집 내 오차제곱합(WCSS) 증가량을 최소화하는 연결법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["와드 연결법", "와드연결법", "Ward's Linkage", "Ward linkage", "와드 기법"],
      explanation: "Ward's Linkage (와드 연결법) 입니다[cite: 5]."
    },
    {
      id: "ml-c4-es-hard-015",
      conceptId: "pca-variance-maximization-essay",
      difficulty: "hard",
      category: "비지도학습 및 군집화",
      questionType: "essay",
      prompt: "주성분 분석(PCA)이 데이터 공분산 행렬의 고유벡터(Eigenvector)를 찾는 과정과, 왜 첫 번째 주성분이 분산(Variance)을 최대화하는 축이 되는지 수학적/기하학적 원리를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["공분산 행렬", "고유벡터", "분산 최대화", "사영"],
      modelAnswer: "PCA는 데이터를 단위 벡터 $u$로 사영(Projection)시켰을 때 사영된 데이터의 분산 $u^T \Sigma u$를 최대화하는 과정이다. 라그랑주 승수법을 적용하면 $\Sigma u = \lambda u$ 라는 고유값 방정식이 유도되며, 이때 분산 크기 자체가 고유값 $\lambda$가 된다. 따라서 가장 큰 고유값에 대응하는 고유벡터가 데이터 분산을 최대 보존하는 첫 번째 주성분 축이 된다[cite: 5].",
      rubricKeywords: ["사영된 분산 $u^T \\Sigma u$ 최대화", "라그랑주 승수법 고유값 방정식 $\\Sigma u = \\lambda u$", "최대 고유값 대응 고유벡터 = 첫 주성분"],
      minLength: 20,
      explanation: "사영 분산 $u^\top \Sigma u$ 극대화 라그랑주 유도와 최대 고유값 대응 고유벡터선정 원리를 서술합니다[cite: 5].",
      hint: "사영 분산 식과 공분산 행렬의 고유값/고유벡터 유도를 서술하세요[cite: 5]."
    },

    // ==========================================
    // 카테고리 5: 선형회귀 (15문항)
    // ==========================================
    {
      id: "ml-c5-mc-hard-001",
      conceptId: "ols-normal-equation-derivation-matrix",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "다중선형회귀 행렬식 $y = X\beta + \epsilon$에서 잔차제곱합 $\text{RSS}(\beta) = (y - X\beta)^\top (y - X\beta)$를 $\beta$에 대해 미분하여 0으로 유도하는 정규방정식 도함수 과정으로 바른 것은?",
      options: [
        "$\\frac{\\partial \\text{RSS}}{\\partial \\beta} = -2 X^T y + 2 X^T X \\beta = 0 \\quad \\Longrightarrow \\quad X^T X \\hat{\\beta} = X^T y$",
        "$\\frac{\\partial \\text{RSS}}{\\partial \\beta} = X y - X^T X \\beta = 0$",
        "$\\frac{\\partial \\text{RSS}}{\\partial \\beta} = -y + X \\beta = 0$",
        "$\\frac{\\partial \\text{RSS}}{\\partial \\beta} = 2 X \\beta = 0$"
      ],
      answer: 0,
      explanation: "$\text{RSS} = y^\top y - 2\beta^\top X^\top y + \beta^\top X^\top X \beta$ 를 $\beta$로 미분하면 $-2X^\top y + 2X^\top X \beta = 0$ 이 유도됩니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-hard-002",
      conceptId: "hat-matrix-properties",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "예측값 수식 $\hat{y} = X \hat{\beta} = X(X^\top X)^{-1}X^\top y = H y$ 에 등장하는 Hat Matrix $H$의 주요 수학적 성질은?",
      options: [
        "대칭 행렬($H^\top = H$)이자 등멱 행렬($H^2 = H$, Idempotent)이다.",
        "역행렬이 항상 존재하는 직교 행렬이다.",
        "대각 원소의 합(Trace)이 항상 0이다.",
        "모든 원소가 1인 단위 행렬이다."
      ],
      answer: 0,
      explanation: "Hat Matrix $H = X(X^\top X)^{-1}X^\top$는 대칭성($H^\top = H$)과 등멱성($H^2 = H$)을 만족하는 사영(Projection) 행렬입니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-hard-003",
      conceptId: "hat-matrix-leverage-h_ii",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "Hat Matrix $H$의 대각 원소 $h_{ii}$가 갖는 통계적 의미(Leverage)는?",
      options: [
        "관측치 $i$의 피처값 $x_i$가 전체 피처 평균에서 얼마나 떨어져 있는지 나타내는 레버리지(Leverage) 수치",
        "관측치 $i$의 실제 라벨 $y_i$의 값 크기",
        "모델의 오버피팅 비율",
        "피처 $p$의 회귀 계수"
      ],
      answer: 0,
      explanation: "대각 원소 $h_{ii} = \frac{\partial \hat{y}_i}{\partial y_i}$는 해당 데이터점 $x_i$가 회귀선 결정에 미치는 기하학적 영향력(Leverage)을 의미합니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-hard-004",
      conceptId: "gauss-markov-theorem-blue",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "오차항 $\epsilon$의 기댓값이 0이고, 등분산성 및 자기상관이 없을 때 최소제곱추정량(OLS) $\hat{\beta}$가 BLUE(Best Linear Unbiased Estimator)임을 증명한 정리는?",
      options: ["가우스-마르코프 정리 (Gauss-Markov Theorem)", "중앙한계 정리", "베이즈 정리", "대수의 법칙"],
      answer: 0,
      explanation: "가우스-마르코프 정리에 의해 선형 비편향 추정량 중 OLS 추정량이 가장 최소 분산을 갖는 BLUE임이 증명됩니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-hard-005",
      conceptId: "vif-multicollinearity-formula",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "피처 $X_j$를 나머지 피처들로 회귀시켰을 때의 결정계수를 $R_j^2$라 할 때, 다중공선성을 진단하는 분산팽창지수(VIF) 수식은?",
      options: [
        "$\text{VIF}_j = \\frac{1}{1 - R_j^2}$",
        "$\\text{VIF}_j = 1 - R_j^2$",
        "$\\text{VIF}_j = \\frac{R_j^2}{1 - R_j^2}$",
        "$\\text{VIF}_j = \\sqrt{R_j^2}$"
      ],
      answer: 0,
      explanation: "$\text{VIF}_j = \frac{1}{1 - R_j^2}$ 이며, 보통 VIF > 10 일 때 심각한 다중공선성이 존재한다고 판단합니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-hard-006",
      conceptId: "omitted-variable-bias-math",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "참 모형이 $Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \epsilon$ 인데, $X_2$를 생략하고 $X_1$만으로 회귀 적합시켰을 때 발생하는 생략 변수 편향(Omitted Variable Bias)은?",
      options: [
        "$X_1$과 $X_2$ 사이에 상관관계가 존재하고 $\beta_2 \neq 0$ 이면, $\hat{\beta}_1$의 기대치가 참값 $\beta_1$과 달라져 편향이 발생한다.",
        "$X_1$과 $X_2$가 상관관계가 없어도 항상 편향이 발생한다.",
        "생략된 변수와 관계없이 $\hat{\beta}_1$은 무조건 비편향 추정량이 된다.",
        "편향이 아니라 오직 분산만 0으로 줄어든다."
      ],
      answer: 0,
      explanation: "생략된 중요 변수 $X_2$가 남아있는 $X_1$과 상관되어 있으면 그 영향이 $X_1$의 계수로 전이되어 Omitted Variable Bias가 생깁니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-hard-007",
      conceptId: "f-statistic-overall-significance",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "다중선형회귀에서 '모든 기울기 회귀 계수가 동시에 0이다 ($H_0: \beta_1 = \beta_2 = ... = \beta_p = 0$)'라는 귀무가설을 검정하는 통계량은?",
      options: ["F-통계량 (F-statistic)", "t-통계량", "z-통계량", "시그마 통계량"],
      answer: 0,
      explanation: "모델 전체 유의성을 검정하는 귀무가설 $H_0: \beta_1 = ... = \beta_p = 0$ 은 F-statistic으로 전체 가설 검정을 수행합니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-hard-008",
      conceptId: "geometric-ols-projection-column-space",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "최소제곱법(OLS)의 기하학적 의미를 벡터 공간상에서 올바르게 표현한 것은?",
      options: [
        "관측 라벨 벡터 $y$를 $X$의 컬럼 공간 $Col(X)$ 위로 직교 사영(Orthogonal Projection)시킨 결과가 예측 벡터 $\hat{y}$ 이다.",
        "관측 벡터 $y$와 $X$가 서로 평행하다.",
        "잔차 벡터 $e = y - \hat{y}$가 컬럼 공간 $Col(X)$와 완벽하게 평행하다.",
        "예측 벡터 $\hat{y}$는 $Col(X)$의 수직 공간에 존재한다."
      ],
      answer: 0,
      explanation: "OLS 예측치 $\hat{y}$는 $y$를 $X$의 열공간(Column Space)에 직교 사영한 벡터이며, 따라서 잔차 $e = y - \hat{y}$는 열공간과 수직(Orthogonal)입니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-hard-009",
      conceptId: "homoscedasticity-violation-weighted-least-squares",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "선형회귀에서 오차항의 등분산성(Homoscedasticity) 가정이 위배되어 이분산성(Heteroscedasticity)이 관측될 때 대응하는 회귀 적합법은?",
      options: ["가중 최소제곱법 (WLS / Weighted Least Squares)", "단순 OLS 고수", "K-means", "로짓 변환"],
      answer: 0,
      explanation: "이분산성이 존재할 경우 각 데이터 오차 분산의 역수를 가중치로 부여하는 WLS(Weighted Least Squares)를 적용합니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-hard-010",
      conceptId: "singularity-x-transpose-x",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "피처 수 $p$가 샘플 수 $n$보다 많아지는 $p > n$ 고차원 상황에서 행렬 $X^\top X$의 성질은?",
      options: [
        "행렬 $X^\top X$의 랭크가 최대 $n$이 되어 Singular(특이) 행렬이 되므로 역행렬이 존재하지 않는다.",
        "역행렬이 무조건 유일하게 존재한다.",
        "모든 고유값이 무한대로 커진다.",
        "Hat Matrix가 단위 행렬이 된다."
      ],
      answer: 0,
      explanation: "$p > n$ 이면 $X^\top X \in \mathbb{R}^{p \times p}$의 최대 랭크가 $n$에 불과해 가역성(Invertibility)이 상실되어 역행렬을 구할 수 없습니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-hard-011",
      conceptId: "polynomial-regression-linear-in-parameters",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "2차 다항식 회귀 $Y = \beta_0 + \beta_1 X + \beta_2 X^2 + \epsilon$ 도 결국 '선형'회귀 분류에 속하는 수학적 이유는?",
      options: [
        "입력 $X$에 대해서는 비선형이지만, 추정해야 할 매개변수(파라미터) $\beta$들에 대해서는 여전히 선형(Linear in Parameters) 결합이기 때문",
        "그래프를 그리면 직선이 되기 때문",
        "$X^2$ 항을 무시할 수 있기 때문",
        "활성화 함수 ReLU를 쓰기 때문"
      ],
      answer: 0,
      explanation: "선형회귀에서 '선형'이란 입력 피처 $X$가 아닌 추정할 가중치 파라미터 $\beta$들에 대해 선형 결합임을 뜻하므로 다항회귀도 선형회귀입니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-hard-012",
      conceptId: "ridge-lasso-regularization-intro",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "다중공선성이나 피처 과다 문제 시 OLS 손실함수(RSS)에 가중치 계수 크기 제약 페널티를 추가하여 계수를 축소(Shrinkage)시키는 회귀 기법들은?",
      options: ["릿지(Ridge) 및 라쏘(Lasso) 규제 회귀", "로지스틱 회귀", "K-means", "LOOCV"],
      answer: 0,
      explanation: "Ridge($L_2$)와 Lasso($L_1$)는 계수 크기에 페널티를 가해 다중공선성 및 오버피팅을 방지합니다[cite: 4]."
    },
    {
      id: "ml-c5-sa-hard-013",
      conceptId: "vif-sa",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "short-answer",
      prompt: "다중공선성 심각도를 진단하는 지표로 수식 $\frac{1}{1 - R_j^2}$ 로 정의되는 지표의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["VIF", "vif", "분산팽창지수", "분산 팽창 지수"],
      explanation: "Variance Inflation Factor(VIF / 분산팽창지수) 입니다[cite: 4]."
    },
    {
      id: "ml-c5-sa-hard-014",
      conceptId: "blue-sa",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "short-answer",
      prompt: "가우스-마르코프 정리에서 OLS 추정량이 가지는 성질인 '최소분산 선형비편향추정량'의 영문 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["BLUE", "blue"],
      explanation: "Best Linear Unbiased Estimator(BLUE) 입니다[cite: 4]."
    },
    {
      id: "ml-c5-es-hard-015",
      conceptId: "ols-geometric-projection-essay",
      difficulty: "hard",
      category: "선형회귀",
      questionType: "essay",
      prompt: "다중선형회귀 $y = X\beta + \epsilon$에서 예측치 $\hat{y} = X(X^\top X)^{-1} X^\top y = H y$ 가 갖는 기하학적 의미(직교 사영)와 잔차 벡터 $e = y - \hat{y}$ 가 $X$의 컬럼 공간 $Col(X)$와 이루는 수직(Orthogonal) 관계를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["직교 사영", "컬럼 공간", "수직", "Orthogonal", "Hat matrix"],
      modelAnswer: "예측치 $\hat{y}$는 $y$ 벡터를 $X$의 열(컬럼) 공간 $Col(X)$ 위로 직교 사영(Orthogonal Projection)시킨 최단 거리 벡터이다. 따라서 실제치와 예측치의 차이인 잔차 벡터 $e = y - \hat{y}$는 $X$의 컬럼 공간 $Col(X)$ 상의 모든 벡터와 직교(Orthogonal)하며, $X^T e = 0$ 이 성립한다[cite: 4].",
      rubricKeywords: ["$Col(X)$ 위로의 직교 사영", "잔차 벡터 $e$와 $Col(X)$의 수직 관계", "$X^T e = 0$"],
      minLength: 20,
      explanation: "OLS 예측치 $\hat{y}$의 직교 사영 기하학과 잔차 벡터 $e$의 수직($X^\top e = 0$) 성질을 서술합니다[cite: 4].",
      hint: "열 공간으로의 직교 사영과 잔차 벡터가 수직을 이룬다는 기하학적 원리를 기술하세요[cite: 4]."
    },

    // ==========================================
    // 카테고리 6: 로지스틱회귀 (15문항)
    // ==========================================
    {
      id: "ml-c6-mc-hard-001",
      conceptId: "sigmoid-derivative-formula",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "시그모이드 함수 $\sigma(z) = \frac{1}{1 + e^{-z}}$ 의 미분 도함수 $\sigma'(z)$를 $\sigma(z)$ 자체로 간결히 나타낸 수식은?",
      options: [
        "$\\sigma'(z) = \\sigma(z)(1 - \\sigma(z))$",
        "$\\sigma'(z) = \\sigma(z)^2$",
        "$\\sigma'(z) = 1 - \\sigma(z)$",
        "$\\sigma'(z) = e^{-z} \\sigma(z)$"
      ],
      answer: 0,
      explanation: "시그모이드 미분 공식은 $\sigma'(z) = \sigma(z)(1 - \sigma(z))$ 가 되어 경사하강법 계산이 매우 깔끔해집니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-hard-002",
      conceptId: "logistic-gradient-formula",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀의 Log-Likelihood $\ell(\beta) = \sum \left[ y_i \log p_i + (1 - y_i) \log(1 - p_i) \right]$ 를 $\beta$에 대해 경사 미분한 기울기 벡터 $\nabla_\beta \ell(\beta)$ 수식은?",
      options: [
        "$\\nabla_\\beta \\ell(\\beta) = X^T (y - p)$",
        "$\\nabla_\\beta \\ell(\\beta) = X^T (y - p)^2$",
        "$\\nabla_\\beta \\ell(\\beta) = (X^T X)^{-1} (y - p)$",
        "$\\nabla_\\beta \\ell(\\beta) = y - X \\beta$"
      ],
      answer: 0,
      explanation: "미분 결과 기울기 벡터는 $X^\top (y - p)$ 로 정제되며, 이는 OLS 잔차 수식과 놀라울 정도로 유사한 형태입니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-hard-003",
      conceptId: "odds-ratio-exponential-beta",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "독립 변수 $X_1$이 1단위 증가할 때 성공 오즈 $\text{Odds}(X_1 + 1)$가 기존 오즈 $\text{Odds}(X_1)$의 몇 배가 되는지 알려주는 오즈비(Odds Ratio) 수식은?",
      options: ["$\text{OR} = e^{\beta_1}$", "$\text{OR} = \beta_1$", "$\text{OR} = 1 + \beta_1$", "$\text{OR} = \log(\beta_1)$"],
      answer: 0,
      explanation: "로짓 차이 $\log \text{Odds}_{new} - \log \text{Odds}_{old} = \beta_1$ 이므로 지수를 취하면 오즈비 $\text{OR} = e^{\beta_1}$ 배가 됩니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-hard-004",
      conceptId: "irls-newton-raphson-logistic",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀의 Log-Likelihood를 수치 최적화할 때 2차 미분 헤세 행렬(Hessian)을 활용하여 빠르게 수렴시키는 뉴턴-랩슨 기반 최적화 알고리즘은?",
      options: ["IRLS (Iteratively Reweighted Least Squares)", "OLS", "K-means", "SGD"],
      answer: 0,
      explanation: "로지스틱 회귀 계수 최적화에는 2차 미분을 이용하는 IRLS(반복 재가중 최소제곱법) 알고리즘이 널리 쓰입니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-hard-005",
      conceptId: "perfect-separation-issue",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "데이터셋에서 특정 피처 하나만으로 클래스 0과 1이 완벽히 직선 분리되는 '완전 분리(Perfect Separation)'가 일어날 때 로지스틱 회귀의 발생 문제는?",
      options: [
        "해당 피처의 회귀 계수 $\hat{\beta}$가 무한대($\pm \infty$)로 발산하여 MLE 수렴이 실패하고 수치적 에러가 난다.",
        "모든 회귀 계수가 0이 된다.",
        "확률 출력이 0.5로 고정된다.",
        "오버피팅이 완전히 소멸한다."
      ],
      answer: 0,
      explanation: "완전 분리 시 확률을 0과 1로 극단화하기 위해 회귀 계수 $\beta$가 무한대로 발산하여 MLE 추정이 실패하게 됩니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-hard-006",
      conceptId: "multinomial-logistic-softmax",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "이진 로지스틱 회귀를 $K$개 클래스의 다중 분류로 확장한 다항 로지스틱 회귀(Multinomial Logistic Regression)의 출력층 확률 수식은?",
      options: [
        "Softmax 수식 $P(Y=k|X) = \\frac{e^{\\beta_k^T X}}{\\sum_{j=1}^K e^{\\beta_j^T X}}$",
        "Sigmoid 수식 $P(Y=k|X) = \\frac{1}{1 + e^{-\\beta_k^T X}}$",
        "단순 선형 결합 $P(Y=k|X) = \\beta_k^T X$",
        "MSE 수식 $P(Y=k|X) = (y - \\hat{y})^2$"
      ],
      answer: 0,
      explanation: "다항 로지스틱 회귀는 각 클래스 선형 스코어들에 Softmax 함수를 취해 $K$개 클래스 전체 확률 합이 1이 되게 확장합니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-hard-007",
      conceptId: "decision-boundary-linearity-logistic",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀에서 $P(Y=1|X) = 0.5$가 되는 결정 경계(Decision Boundary)의 수학적 방정식 형태는?",
      options: [
        "선형 방정식 $\\beta_0 + \\beta_1 X_1 + ... + \\beta_p X_p = 0$ (피처 공간상의 선형 초평면)",
        "원형 방정식 $X_1^2 + X_2^2 = 1$",
        "비선형 지수 곡선",
        "불연속 계단 함수"
      ],
      answer: 0,
      explanation: "$P=0.5$ 일 때 $\log(p/(1-p)) = \log(1) = 0$ 이 되므로, 결정 경계는 선형 방정식 $\beta_0 + \beta^\top X = 0$ 이 됩니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-hard-008",
      conceptId: "deviance-goodness-of-fit",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "선형회귀의 잔차제곱합(RSS) 역할을 대신하여 로지스틱 회귀 모형의 적합도(Goodness-of-fit)를 평가하는 통계량은?",
      options: ["디비언스 (Deviance = $-2 \log \mathcal{L}$)", "결정계수 ($R^2$)", "F-통계량", "VIF"],
      answer: 0,
      explanation: "로지스틱 회귀에서는 $-2 \times \text{Log-Likelihood}$ 로 정의되는 Deviance를 이용해 모형의 적합도를 평가합니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-hard-009",
      conceptId: "wald-test-logistic",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀 개별 계수 $\beta_j$의 유의성을 검정하기 위해 $z = \frac{\hat{\beta}_j}{\text{SE}(\hat{\beta}_j)}$ 수식을 이용하는 검정법은?",
      options: ["왈드 검정 (Wald Test)", "F-검정", "t-검정", "카이제곱 독립성 검정"],
      answer: 0,
      explanation: "로지스틱 회귀 개별 계수의 통계적 유의성은 $z$-통계량을 이용한 Wald Test로 검정합니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-hard-010",
      conceptId: "dummy-variable-trap-logistic",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "범주형 피처 $K$개 범주를 로지스틱 회귀에 가변수(Dummy Variable)로 변환할 때, 다중공선성 함정(Dummy Variable Trap)을 막기 위해 만들어야 하는 가변수의 개수는?",
      options: ["$K - 1$ 개", "$K$ 개", "$K + 1$ 개", "$2^K$ 개"],
      answer: 0,
      explanation: "모든 $K$개 범주 가변수를 다 넣으면 완전 다중공선성이 생기므로, 절편을 위해 1개를 뺀 $K-1$개만 만들어야 합니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-hard-011",
      conceptId: "logistic-hessian-matrix",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀 Log-Likelihood의 2차 미분 행렬인 헤세 행렬 $H = -X^\top W X$ 에서 대각 가중치 행렬 $W$의 원소 형태 $w_{ii}$는?",
      options: ["$w_{ii} = p_i (1 - p_i)$", "$w_{ii} = p_i^2$", "$w_{ii} = 1 - p_i$", "$w_{ii} = y_i - p_i$"],
      answer: 0,
      explanation: "로지스틱 2차 미분 헤세 행렬 내 대각 원소는 $w_{ii} = p_i (1 - p_i)$ 형태로 계산됩니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-hard-012",
      conceptId: "l1-l2-logistic-regularization",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "완전 분리(Perfect Separation) 문제나 고차원 피처 오버피팅을 방지하기 위해 로지스틱 회귀 손실함수에 추가하는 규제(Regularization) 방식은?",
      options: ["L1(Lasso) 또는 L2(Ridge) 가중치 규제 항", "Gradient Clipping", "가변수 추가", "임계값 인상"],
      answer: 0,
      explanation: "L1/L2 규제 패널티를 손실함수에 더해주면 계수 $\beta$가 무한대로 발산하는 것을 방지하고 과적합을 막아줍니다[cite: 4]."
    },
    {
      id: "ml-c6-sa-hard-013",
      conceptId: "odds-ratio-sa",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "short-answer",
      prompt: "독립변수 1단위 증가 시 오즈(Odds)가 몇 배 증가하는지 나타내는 $e^{\beta_1}$ 지표 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["오즈비", "오즈 비", "Odds Ratio", "odds ratio"],
      explanation: "Odds Ratio(오즈비) 입니다[cite: 4]."
    },
    {
      id: "ml-c6-sa-hard-014",
      conceptId: "perfect-separation-sa",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "short-answer",
      prompt: "피처에 의해 클래스 0과 1이 완벽히 직선 분리되어 로지스틱 계수가 무한대로 발산하는 문제 현상은?",
      options: [],
      answer: null,
      acceptedAnswers: ["완전 분리", "완전분리", "완벽 분리", "Perfect Separation", "perfect separation"],
      explanation: "Perfect Separation(완전 분리) 현상입니다[cite: 4]."
    },
    {
      id: "ml-c6-es-hard-015",
      conceptId: "sigmoid-derivative-gradient-essay",
      difficulty: "hard",
      category: "로지스틱회귀",
      questionType: "essay",
      prompt: "시그모이드 함수 $\sigma(z) = \frac{1}{1 + e^{-z}}$ 의 미분 수식 $\sigma'(z) = \sigma(z)(1 - \sigma(z))$ 가 정답과 예측 차이 오차를 보정하는 경사하강법 미분 과정에서 가지는 수식적 정제 장점을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["미분", "$\sigma(z)(1-\sigma(z))$", "X^T(y-p)", "정제"],
      modelAnswer: "시그모이드 함수의 미분 $\\sigma'(z) = \\sigma(z)(1 - \\sigma(z))$ 속성이 Cross-Entropy 손실함수의 분모 지수항과 깔끔하게 약분된다. 그 결과 Log-Likelihood의 경사 미분 수식이 $\\nabla_\\beta \\ell(\\beta) = X^T(y - p)$ 로 매우 간결하게 정제되어, 오차 $(y - p)$에 비례하여 안정적으로 가중치를 업데이트할 수 있다[cite: 4]."
    }
  ]
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();