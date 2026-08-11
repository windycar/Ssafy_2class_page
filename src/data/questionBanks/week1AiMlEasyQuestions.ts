
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
  easy: [
    // ==========================================
    // 카테고리 1: AI/ML 기초 및 데이터 (15문항)
    // ==========================================
    {
      id: "ml-c1-mc-001",
      conceptId: "ai-ml-dl-hierarchy",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "AI, ML, DL의 개념적 포함 관계를 가장 올바르게 나타낸 것은 무엇인가?",
      options: ["AI > ML > DL", "DL > ML > AI", "ML > AI > DL", "AI > DL > ML"],
      answer: 0,
      explanation: "인공지능(AI)이라는 가장 넓은 범주 안에 머신러닝(ML)이 속하며, 머신러닝의 하위 분야로 신경망 기반의 딥러닝(DL)이 속합니다[cite: 5].",
      hint: "가장 포괄적인 개념이 AI입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-002",
      conceptId: "rule-based-ai-example",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "다음 중 머신러닝(ML)이 아닌 AI 시스템의 대표적인 예시는 무엇인가?",
      options: [
        "사람이 직접 코딩한 조건문 규칙 기반 시스템 (Rule-based System)",
        "딥러닝 기반 이미지 분류 모델",
        "거대 언어 모델 (LLM)",
        "유튜브 동영상 추천 시스템"
      ],
      answer: 0,
      explanation: "사람이 정해둔 명시적 규칙(IF-THEN)만으로 작동하는 규칙 기반 시스템은 데이터 학습 과정이 없으므로 ML이 아닌 AI에 해당합니다[cite: 5].",
      hint: "데이터로부터 학습하지 않고 정해진 규칙만 따릅니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-003",
      conceptId: "feature-concept",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "머신러닝에서 모델이 예측이나 판단을 내릴 때 입력으로 사용하는 특성 정보를 무엇이라 하는가?",
      options: ["Feature (피처/특성)", "Label (라벨)", "Loss (손실)", "Epoch (에포크)"],
      answer: 0,
      explanation: "Feature는 모델이 예측을 수행하기 위해 사용하는 입력 정보이자 판단의 근거입니다[cite: 5].",
      hint: "영문으로 '특성'을 의미합니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-004",
      conceptId: "label-concept",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "지도학습에서 모델이 최종적으로 맞추고자 하는 정답 또는 목표값을 무엇이라 하는가?",
      options: ["Label (라벨/목표값)", "Feature (특성)", "Hyperparameter", "Residual"],
      answer: 0,
      explanation: "Label은 모델이 학습을 통해 예측하고자 하는 실제 정답 값입니다[cite: 5].",
      hint: "정답표나 레이블을 뜻합니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-005",
      conceptId: "hypothesis-space-definition",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "입력 특성과 정답 사이의 관계를 표현할 수 있는 모든 후보 함수들의 집합을 무엇이라 하는가?",
      options: ["가설 공간 (Hypothesis Space)", "피처 공간", "손실 공간", "파라미터 집합"],
      answer: 0,
      explanation: "가설 공간(Hypothesis Space)은 모델이 선택할 수 있는 모든 후보 함수들의 모음입니다[cite: 5].",
      hint: "가설(Hypothesis)들이 모여 있는 공간입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-006",
      conceptId: "true-function-error",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "실제 관측 데이터 $Y$에 관한 관계식 $Y = f^*(X) + \epsilon$에서 $\epsilon$이 의미하는 바는 무엇인가?",
      options: ["측정 오차 (Measurement Error)", "학습률", "회귀 계수", "가설 공간"],
      answer: 0,
      explanation: "실제 데이터는 미지의 참 함수 $f^*(X)$에 환경적 요인이나 기기 한계 등으로 인한 측정 오차 $\epsilon$이 포함되어 관측됩니다[cite: 5].",
      hint: "데이터에 섞여 있는 노이즈나 오차입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-007",
      conceptId: "youtube-recommendation-data",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "유튜브 추천 시스템에서 사용자의 '시청 이력'과 '시청 시간'은 어떤 데이터에 해당하는가?",
      options: ["Feature (특성)", "Label (정답)", "Loss (손실)", "Model (모델)"],
      answer: 0,
      explanation: "시청 이력, 시청 시간 등은 추천 결과를 예측하기 위한 입력 단서인 Feature입니다[cite: 5].",
      hint: "예측에 사용되는 입력 정보입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-008",
      conceptId: "spam-filtering-label",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "스팸 메일 분류 시스템에서 '해당 메일이 스팸인지 정상인지' 나타내는 여부는 무엇인가?",
      options: ["Label (라벨)", "Feature (특성)", "Gradient", "Variance"],
      answer: 0,
      explanation: "메일의 스팸/정상 여부는 분류 모델이 최종 맞추어야 하는 정답인 Label입니다[cite: 5].",
      hint: "모델이 맞춰야 하는 최종 정답입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-009",
      conceptId: "one-dimensional-feature-learning",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "입력 특성(Feature)이 1개일 때 수행되는 가장 단순한 형태의 머신러닝 학습을 무엇이라 하는가?",
      options: ["1D 피처 기반 학습", "2D 피처 기반 학습", "다중 피처 학습", "비지도 학습"],
      answer: 0,
      explanation: "1D(1차원) 피처 기반 학습은 단일 특성을 입력으로 받아 정답을 예측하는 가장 기본적인 학습 형태입니다[cite: 5].",
      hint: "1차원(1D) 특성을 사용합니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-010",
      conceptId: "ml-learning-definition",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "머신러닝에서의 '학습(Learning)'을 가장 바르게 설명한 것은?",
      options: [
        "주어진 데이터를 바탕으로 가설 공간 내에서 가장 적절한 모델(함수 $f$)을 선택하는 과정",
        "사람이 모든 규칙을 직접 IF-THEN 조건문으로 작성하는 과정",
        "데이터의 측정 오차를 완전히 0으로 없애버리는 과정",
        "모든 데이터를 무작위로 삭제하는 과정"
      ],
      answer: 0,
      explanation: "학습이란 데이터와 손실함수를 기준으로 가설 공간의 수많은 후보 중 최적의 함수 $f$를 찾아나가는 과정입니다[cite: 5].",
      hint: "가설 공간에서 가장 적절한 함수를 찾아내는 작업입니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-011",
      conceptId: "ml-loop-process",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "머신러닝 작업이 단순 일회성이 아니라 평가 결과를 반영해 지속적으로 개선되는 특성을 나타내는 용어는?",
      options: ["반복적 개선 루프 (ML Loop)", "단층 전개", "하드코딩", "오차 수렴"],
      answer: 0,
      explanation: "머신러닝은 데이터 $\rightarrow$ 모델 $\rightarrow$ 학습 $\rightarrow$ 평가 순환을 거쳐 지속적으로 개선되는 피드백 루프를 가집니다[cite: 5].",
      hint: "순환(Loop) 구조를 뜻합니다[cite: 5]."
    },
    {
      id: "ml-c1-mc-012",
      conceptId: "why-learn-f",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "multiple-choice",
      prompt: "미지의 참 함수 $f^*$를 잘 근사하는 모델 $f$를 학습시켜야 하는 이유로 적절하지 않은 것은?",
      options: [
        "데이터에 존재하는 측정 오차 $\epsilon$ 자체를 물리적으로 완전히 소멸시키기 위해",
        "새로운 입력 $X$에 대해 정답 $Y$를 정확히 예측하기 위해",
        "여러 피처 중 어떤 피처가 $Y$에 중요한 영향을 미치는지 파악하기 위해",
        "피처 $X$의 변화에 따라 $Y$가 어떻게 변하는지 해석하기 위해"
      ],
      answer: 0,
      explanation: "학습을 잘 수행하더라도 노이즈나 측정 오차 자체를 물리적으로 제거할 수는 없습니다[cite: 5].",
      hint: "측정 오차는 데이터 자체에 유입된 노이즈입니다[cite: 5]."
    },
    {
      id: "ml-c1-sa-013",
      conceptId: "feature-sa",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "short-answer",
      prompt: "머신러닝 모델의 예측 및 판단 근거로 사용되는 입력 변수를 뜻하는 용어를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Feature", "feature", "피처", "특성"],
      explanation: "입력 설명 변수인 Feature(특성)입니다[cite: 5].",
      hint: "영문 'Feature' 또는 한글 '특성'입니다[cite: 5]."
    },
    {
      id: "ml-c1-sa-014",
      conceptId: "hypothesis-space-sa",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "short-answer",
      prompt: "입력과 출력 간 관계를 나타낼 수 있는 모든 후보 함수들의 집합을 무엇이라 하는가?",
      options: [],
      answer: null,
      acceptedAnswers: ["가설 공간", "가설공간", "Hypothesis Space", "hypothesis space"],
      explanation: "후보 함수들의 모음인 가설 공간(Hypothesis Space)입니다[cite: 5].",
      hint: "가설(Hypothesis)과 공간(Space)의 결합어입니다[cite: 5]."
    },
    {
      id: "ml-c1-es-015",
      conceptId: "ai-ml-dl-compare-essay",
      difficulty: "easy",
      category: "AI/ML 기초 및 데이터",
      questionType: "essay",
      prompt: "AI, ML, DL의 정의를 각각 간단히 설명하고, 세 개념 간의 포함 관계를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["AI", "ML", "DL", "포함"],
      modelAnswer: "AI(인공지능)는 인간의 지능을 모방하는 시스템 전체를 뜻하며, ML(머신러닝)은 AI의 하위 개념으로 데이터로부터 규칙을 학습하는 방법론이다. DL(딥러닝)은 ML의 하위 개념으로 신경망을 활용해 학습하는 방법론이다[cite: 5].",
      rubricKeywords: ["AI 전체 범주", "ML 데이터 학습", "DL 신경망 활용", "포함 관계"],
      minLength: 20,
      explanation: "AI > ML > DL 의 포함 관계와 개별 정의를 서술합니다[cite: 5].",
      hint: "가장 넓은 AI부터 가장 좁은 DL 순으로 포함 관계를 설명하세요[cite: 5]."
    },

    // ==========================================
    // 카테고리 2: 지도학습 및 평가 지표 (15문항)
    // ==========================================
    {
      id: "ml-c2-mc-001",
      conceptId: "supervised-learning-definition",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "지도학습(Supervised Learning)의 데이터 구성 특징으로 가장 올바른 것은?",
      options: [
        "입력 특성(Feature)과 정답 라벨(Label)이 항상 쌍으로 존재한다.",
        "정답 라벨이 없고 입력 특성만 존재한다.",
        "보상(Reward) 신호만 주어지고 정답은 주어지지 않는다.",
        "데이터 없이 규칙만으로 학습한다."
      ],
      answer: 0,
      explanation: "지도학습은 Feature와 정답 Label이 쌍으로 구성된 데이터를 활용합니다[cite: 5].",
      hint: "입력값과 정답(Label)이 함께 주어집니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-002",
      conceptId: "regression-problem-type",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "다음 중 지도학습의 '회귀(Regression)' 문제에 해당하는 예시는?",
      options: ["내일의 주가/집값 예측", "이메일 스팸/정상 분류", "암 종양 악성/양성 판단", "고양이/강아지 이미지 구별"],
      answer: 0,
      explanation: "주가나 집값처럼 예측 결과가 연속적인 숫자인 경우가 회귀에 해당합니다[cite: 5].",
      hint: "결과가 연속적인 수치(숫자)인 항목을 찾으세요[cite: 5]."
    },
    {
      id: "ml-c2-mc-003",
      conceptId: "classification-problem-type",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "다음 중 지도학습의 '분류(Classification)' 문제에 해당하는 예시는?",
      options: ["신용카드 결제 건의 사기/정상 여부 판단", "아파트 매매가 금액 예측", "내일의 기온(섭씨) 예측", "학생의 시험 점수 예측"],
      answer: 0,
      explanation: "사기/정상처럼 미리 정해진 카테고리(범주)를 맞추는 문제가 분류입니다[cite: 5].",
      hint: "범주(카테고리)를 맞추는 항목입니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-004",
      conceptId: "mse-loss-formula",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "회귀 문제에서 실제 정답 $y_i$와 예측값 $\hat{y}_i$ 간 오차 제곱의 평균을 구하는 손실함수는?",
      options: ["MSE (평균제곱오차)", "교차 엔트로피", "정확도 (Accuracy)", "혼동행렬"],
      answer: 0,
      explanation: "Mean Squared Error(MSE)는 회귀 모델의 대표적 손실 지표입니다[cite: 5].",
      hint: "오차를 제곱하여 평균 냅니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-005",
      conceptId: "rmse-advantage",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "MSE에 제곱근을 씌운 RMSE(Root MSE)를 사용하는 주요 장점은?",
      options: [
        "제곱되어 왜곡된 단위를 원본 데이터와 동일한 단위로 되돌려주어 직관적 해석이 쉽다.",
        "오차값을 무조건 0으로 만들어 준다.",
        "학습 속도를 100배 가속한다.",
        "분류 문제 전용 지표로 전환된다."
      ],
      answer: 0,
      explanation: "RMSE는 루트를 씌워 실제 데이터 단위(예: 원, 백만원)로 오차 크기를 파악하기 쉽게 만듭니다[cite: 5].",
      hint: "원본 데이터 단위로 오차 수치를 파악할 수 있습니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-006",
      conceptId: "r2-score-meaning",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "회귀 모델의 결정계수($R^2$)가 1에 가깝다는 것의 의미는?",
      options: [
        "모델의 데이터 분산 설명력이 매우 높다.",
        "모델의 오차가 무한대로 크다.",
        "모델이 언더피팅 상태이다.",
        "모든 예측값이 0이다."
      ],
      answer: 0,
      explanation: "$R^2$은 0~1 사이 값을 가지며, 1에 가까울수록 모델이 데이터의 변동을 잘 설명함을 나타냅니다[cite: 5].",
      hint: "1에 가까울수록 뛰어난 설명력을 갖습니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-007",
      conceptId: "accuracy-limitation-imbalance",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "실제 환자가 1%인 희귀병 데이터셋에서 모든 사람을 '정상'이라고만 예측해도 정확도(Accuracy)가 99%가 되는 현상의 문제는?",
      options: [
        "불균형 데이터에서 정확도 착시가 발생하여 실제 중요한 양성(환자)을 전혀 감지하지 못함",
        "모델이 과적합되어 학습이 안 됨",
        "MSE 수치가 음수가 됨",
        "정밀도가 무조건 100%가 됨"
      ],
      answer: 0,
      explanation: "클래스 불균형 데이터에서는 다수 클래스만 맞추어도 정확도가 높게 나오는 함정이 존재합니다[cite: 5].",
      hint: "환자(양성)를 하나도 감지하지 못하는 문제가 생깁니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-008",
      conceptId: "confusion-matrix-tp-tn",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "혼동행렬(Confusion Matrix)에서 실제 양성(Positive)을 양성으로 올바르게 맞춘 지표는?",
      options: ["TP (True Positive)", "TN (True Negative)", "FP (False Positive)", "FN (False Negative)"],
      answer: 0,
      explanation: "실제 양성을 양성으로 맞춘 것은 True Positive(TP)입니다[cite: 5].",
      hint: "True(맞춤) + Positive(양성) 입니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-009",
      conceptId: "precision-meaning",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "분류 지표 중 '모델이 양성이라고 예측한 것들 중' 실제 진짜 양성의 비율을 나타내는 지표는?",
      options: ["정밀도 (Precision)", "재현율 (Recall)", "MSE", "결정계수 ($R^2$)"],
      answer: 0,
      explanation: "정밀도(Precision)는 $\frac{TP}{TP + FP}$ 수식으로 모델 예측의 정교함을 측정합니다[cite: 5].",
      hint: "모델이 양성이라 한 것 중 진짜 양성 비율입니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-010",
      conceptId: "recall-meaning",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "분류 지표 중 '실제 진짜 양성 데이터 전체 중' 모델이 놓치지 않고 잡아낸 비율을 나타내는 지표는?",
      options: ["재현율 (Recall/Sensitivity)", "정밀도 (Precision)", "MSE", "RMSE"],
      answer: 0,
      explanation: "재현율(Recall)은 $\frac{TP}{TP + FN}$ 수식으로 진짜 양성을 얼마나 잘 재현해냈는지 파악합니다[cite: 5].",
      hint: "실제 진짜 양성 중 잡아낸 비율입니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-011",
      conceptId: "overfitting-characteristic",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "모델이 훈련 데이터에 너무 지나치게 맞춰져 잡음까지 외워버림으로써, 훈련 오류는 매우 낮지만 테스트 오류는 높게 나오는 현상은?",
      options: ["오버피팅 (Overfitting / 과적합)", "언더피팅 (Underfitting / 과소적합)", "일반화 (Generalization)", "정규화 (Normalization)"],
      answer: 0,
      explanation: "오버피팅은 훈련 성능만 높고 새 데이터에서의 성능은 나쁜 상태입니다[cite: 5].",
      hint: "지나치게 맞춘(Overfitting) 상태입니다[cite: 5]."
    },
    {
      id: "ml-c2-mc-012",
      conceptId: "cross-entropy-loss-classification",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "multiple-choice",
      prompt: "분류 모델 학습 시 단순 맞춤/틀림 대신 정답 범주에 부여한 확률값을 기반으로 줄여나가는 대표 손실함수는?",
      options: ["교차 엔트로피 (Cross Entropy)", "MSE", "RMSE", "$R^2$"],
      answer: 0,
      explanation: "분류 모델의 학습에는 정답 클래스에 부여된 확률을 평가하는 교차 엔트로피 손실을 사용합니다[cite: 5].",
      hint: "분류 학습 시 최적화하는 대표 손실함수입니다[cite: 5]."
    },
    {
      id: "ml-c2-sa-013",
      conceptId: "mse-sa",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "short-answer",
      prompt: "회귀 모델 평가 시 실제 정답과 예측값 차이의 제곱 평균을 나타내는 지표 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["MSE", "mse", "Mean Squared Error"],
      explanation: "Mean Squared Error(MSE) 입니다[cite: 5].",
      hint: "MSE 3글자 약자입니다[cite: 5]."
    },
    {
      id: "ml-c2-sa-014",
      conceptId: "confusion-matrix-sa",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "short-answer",
      prompt: "분류 모델의 실제값과 예측값 관계(TP, TN, FP, FN)를 표 형태로 나타낸 행렬은?",
      options: [],
      answer: null,
      acceptedAnswers: ["혼동행렬", "혼동 행렬", "Confusion Matrix", "confusion matrix"],
      explanation: "Confusion Matrix(혼동행렬) 입니다[cite: 5].",
      hint: "한글로 '혼동행렬' 이라 부릅니다[cite: 5]."
    },
    {
      id: "ml-c2-es-015",
      conceptId: "regression-vs-classification-essay",
      difficulty: "easy",
      category: "지도학습 및 평가 지표",
      questionType: "essay",
      prompt: "지도학습의 회귀(Regression)와 분류(Classification)의 예측 라벨 형태 차이 및 대표 평가 지표를 각각 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["수치", "범주", "MSE", "정확도"],
      modelAnswer: "회귀는 집값, 온도처럼 예측 라벨이 연속적인 수치이며 대표 지표로 MSE, R^2 등을 사용한다. 분류는 스팸/정상처럼 예측 라벨이 정해진 범주(카테고리)이며 대표 지표로 정확도, 혼동행렬, F1-score 등을 사용한다[cite: 5].",
      rubricKeywords: ["회귀 연속 수치", "분류 정해진 범주", "MSE/R^2", "정확도/혼동행렬"],
      minLength: 20,
      explanation: "회귀와 분류의 라벨 특성 및 각각의 대표 평가지표를 비교 서술합니다[cite: 5].",
      hint: "수치형과 범주형 차이 및 평가지표 이름을 서술하세요[cite: 5]."
    },

    // ==========================================
    // 카테고리 3: 검증 및 교차검증 (15문항)
    // ==========================================
    {
      id: "ml-c3-mc-001",
      conceptId: "train-vs-test-error",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "학습에 쓰인 데이터에서의 오류인 '훈련 오류'와 학습에 쓰이지 않은 새 데이터에서의 오류인 '테스트 오류' 중 모델 선택의 기준이 되는 것은?",
      options: ["테스트 오류 (Test Error)", "훈련 오류 (Train Error)", "측정 오차", "데이터 사이즈"],
      answer: 0,
      explanation: "머신러닝의 목적은 보지 못한 새 데이터에서의 성능인 테스트 오류(일반화 오류)를 최소화하는 것입니다[cite: 5].",
      hint: "처음 보는 데이터에서의 예측 오류입니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-002",
      conceptId: "generalization-importance",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "머신러닝 모델이 훈련 데이터 외에 새로운 상황 및 데이터에서도 좋은 성능을 내는 능력을 무엇이라 하는가?",
      options: ["일반화 (Generalization)", "오버피팅", "특율성", "암기력"],
      answer: 0,
      explanation: "일반화(Generalization) 능력이 높아져야 실전 테스트 환경에서도 낮은 오차를 보입니다[cite: 5].",
      hint: "새로운 상황에서도 잘 동작하는 능력입니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-003",
      conceptId: "hold-out-validation",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "전체 데이터를 훈련셋과 검증셋(Validation Set)으로 1회 무작위 분할하여 모델 성능을 검증하는 방식은?",
      options: ["홀드아웃 (Hold-out) 기법", "K-Fold 교차검증", "LOOCV", "부트스트랩"],
      answer: 0,
      explanation: "홀드아웃 방식은 가용 샘플을 훈련셋과 검증셋(Hold-out)으로 딱 한 번 나눠 검증합니다[cite: 5].",
      hint: "데이터를 떼어둔다는 의미입니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-004",
      conceptId: "hold-out-limitation",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "홀드아웃(Hold-out) 검증 방식의 주요 단점은 무엇인가?",
      options: [
        "어떤 샘플이 훈련/검증셋에 들어가느냐에 따라 평가 결과 변동성이 크다.",
        "계산 속도가 너무 느려서 사용이 불가능하다.",
        "데이터를 완전히 무작위로 섞을 수 없다.",
        "오직 1개의 데이터로만 학습해야 한다."
      ],
      answer: 0,
      explanation: "홀드아웃은 분할된 표본 조합에 따라 테스트 오류 추정치가 매우 가변적이라는 단점이 있습니다[cite: 5].",
      hint: "분할 표본 구성에 따라 검증 결과가 크게 흔들립니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-005",
      conceptId: "k-fold-cv-concept",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "전체 데이터를 크기가 동일한 $K$개의 폴드(Fold)로 나누어 검증을 $K$번 반복하는 방법은?",
      options: ["K-겹 교차검증 (K-fold Cross-Validation)", "홀드아웃 검증", "경사하강법", "단순 회귀"],
      answer: 0,
      explanation: "K-fold CV는 데이터를 $K$개 폴드로 나눈 후 각 폴드가 번갈아 검증셋 역할을 맡습니다[cite: 5].",
      hint: "K개의 폴드로 나눕니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-006",
      conceptId: "k-fold-process",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "K-겹 교차검증에서 최종 평가 오차 추정치는 어떻게 구하는가?",
      options: [
        "$K$번의 검증에서 얻은 각각의 오차(MSE 등)를 평균 낸다.",
        "첫 번째 폴드의 오차만 사용한다.",
        "가장 오차가 크게 나온 폴드의 오차만 고른다.",
        "모든 폴드의 오차를 더해 100을 곱한다."
      ],
      answer: 0,
      explanation: "$K$개의 검증 폴드에서 얻은 오차 수치들을 평균 내어 최종 테스트 오류 추정치로 삼습니다[cite: 5].",
      hint: "K개 오차의 평균값입니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-007",
      conceptId: "loocv-concept",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "K-겹 교차검증에서 $K = n$ (전체 데이터 개수)으로 설정하여 1개 데이터만 검증에 쓰고 나머지 $n-1$개로 훈련하는 방법은?",
      options: ["LOOCV (Leave-One-Out Cross-Validation)", "Hold-out", "Stratified K-fold", "10-Fold CV"],
      answer: 0,
      explanation: "LOOCV는 단 1개 관측치만 검증에 남겨두고(Leave-One-Out) $n$번 반복 검증하는 방식입니다[cite: 5].",
      hint: "하나만 남겨둔다(Leave-One-Out)는 뜻입니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-008",
      conceptId: "loocv-advantage",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "LOOCV 방식이 가지는 장점 중 하나는 무엇인가?",
      options: [
        "모든 데이터 샘플을 검증에 활용하며 훈련 데이터 분할에 따른 가변성이 없다.",
        "학습 시간이 1초 만에 끝난다.",
        "파라미터 개수가 자동으로 줄어든다.",
        "데이터 오차를 완전히 제거해 준다."
      ],
      answer: 0,
      explanation: "LOOCV는 $n$개 샘플 모두를 검증에 사용하여 임의 분할에 따른 가변성 문제가 생기지 않습니다[cite: 5].",
      hint: "분할 무작위성에 따른 결과 흔들림이 없습니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-009",
      conceptId: "loocv-disadvantage",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "LOOCV 방식이 대용량 데이터셋에서 잘 쓰이지 않는 주된 단점은?",
      options: [
        "모델 학습 과정을 $n$번 반복해야 하므로 계산 시간이 너무 오래 걸림",
        "검증셋 크기가 너무 커서",
        "훈련 데이터가 부족해져서",
        "소프트웨어적으로 구현이 불가능해서"
      ],
      answer: 0,
      explanation: "데이터 개수 $n$이 수십만 개일 경우 $n$번 재학습해야 하므로 계산 비용이 극도로 큽니다[cite: 5].",
      hint: "데이터 개수 $n$번만큼 모델을 반복 학습시켜야 합니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-010",
      conceptId: "model-complexity-test-error",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "모델 복잡도가 증가함에 따른 훈련 오류와 테스트 오류의 일반적인 변화 형태는?",
      options: [
        "훈련 오류는 계속 감소하지만, 테스트 오류는 감소하다가 다시 증가하는 U자 형태를 보인다.",
        "훈련 오류와 테스트 오류 모두 지속적으로 커진다.",
        "훈련 오류는 U자형, 테스트 오류는 직선 형태를 보인다.",
        "두 오류 모두 항상 0으로 고정된다."
      ],
      answer: 0,
      explanation: "모델이 복잡해질수록 훈련 오류는 줄어들지만, 너무 복잡해지면 과적합으로 인해 테스트 오류가 다시 상승하는 U자 곡선을 그립니다[cite: 5].",
      hint: "테스트 오류 곡선은 바닥을 찍고 올라오는 U자형입니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-011",
      conceptId: "resampling-methods",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "한정된 데이터셋을 여러 번 새로 나누어 반복 훈련/평가함으로써 테스트 오류를 추정하는 기법들을 통칭하는 용어는?",
      options: ["재표본화 (Resampling)", "정규화 (Normalization)", "양자화 (Quantization)", "차원 축소"],
      answer: 0,
      explanation: "데이터를 반복 분할하여 오차를 추정하는 홀드아웃, K-fold 등을 재표본화(Resampling) 기법이라 합니다[cite: 5].",
      hint: "표본을 다시 추출/분할한다는 의미입니다[cite: 5]."
    },
    {
      id: "ml-c3-mc-012",
      conceptId: "typical-k-value",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "multiple-choice",
      prompt: "K-겹 교차검증 수행 시 연산량과 추정 정밀도의 균형을 고려하여 실무적으로 가장 많이 선택하는 $K$값은?",
      options: ["5 또는 10", "1 또는 2", "1000", "데이터 전체 개수 $n$"],
      answer: 0,
      explanation: "실무 및 학술 연구에서는 계산 효율과 추정 정밀도의 밸런스가 좋은 5-fold 또는 10-fold CV가 널리 쓰입니다[cite: 5].",
      hint: "보통 5-fold 또는 10-fold를 씁니다[cite: 5]."
    },
    {
      id: "ml-c3-sa-013",
      conceptId: "k-fold-cv-sa",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "short-answer",
      prompt: "데이터 전체를 K개 그룹으로 나눈 후 번갈아가며 검증을 시행하는 대표적 평가 방법 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["K-겹 교차검증", "K-fold 교차검증", "K-fold Cross-Validation", "K-fold"],
      explanation: "K-fold Cross-Validation(K-겹 교차검증) 입니다[cite: 5].",
      hint: "K-겹 교차검증 입니다[cite: 5]."
    },
    {
      id: "ml-c3-sa-014",
      conceptId: "loocv-sa",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "short-answer",
      prompt: "K-fold 교차검증에서 K를 전체 데이터 개수 n으로 설정해 1개만 검증셋으로 활용하는 기법 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["LOOCV", "loocv"],
      explanation: "Leave-One-Out Cross-Validation(LOOCV) 입니다[cite: 5].",
      hint: "LOOCV 5글자 약자입니다[cite: 5]."
    },
    {
      id: "ml-c3-es-015",
      conceptId: "holdout-vs-kfold-essay",
      difficulty: "easy",
      category: "검증 및 교차검증",
      questionType: "essay",
      prompt: "홀드아웃(Hold-out) 방법과 K-겹 교차검증(K-fold CV)의 작동 방식을 비교하고 K-fold CV가 갖는 장점을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["홀드아웃", "K-fold", "1번", "K번", "모든 데이터"],
      modelAnswer: "홀드아웃은 데이터를 훈련셋과 검증셋으로 단 1번 분할하여 평가하므로 분할 가변성이 크다. 반면 K-fold CV는 데이터를 K개 폴드로 나눈 뒤 K번 번갈아 검증하므로 모든 데이터를 검증에 활용하여 보다 안정적이고 정밀하게 테스트 오류를 추정할 수 있다[cite: 5].",
      rubricKeywords: ["홀드아웃 1회 분할 가변성", "K-fold K번 반복 검증", "모든 데이터 검증 활용"],
      minLength: 20,
      explanation: "1회 분할 홀드아웃의 한계와 K번 반복 검증을 통해 전 데이터를 활용하는 K-fold의 장점을 서술합니다[cite: 5].",
      hint: "분할 횟수 차이 및 전체 데이터 활용성 측면에서 서술하세요[cite: 5]."
    },

    // ==========================================
    // 카테고리 4: 비지도학습 및 군집화 (15문항)
    // ==========================================
    {
      id: "ml-c4-mc-001",
      conceptId: "unsupervised-learning-definition",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "정답 라벨(Label) 없이 오직 입력 데이터의 구조, 패턴, 잠재 집단을 찾아내는 학습 방식은?",
      options: ["비지도학습 (Unsupervised Learning)", "지도학습 (Supervised Learning)", "강화학습", "지시학습"],
      answer: 0,
      explanation: "비지도학습은 라벨 없이 입력 데이터의 숨겨진 패턴이나 구조를 파악합니다[cite: 5].",
      hint: "정답(지도)이 없는 학습입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-002",
      conceptId: "unsupervised-tasks",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "다음 중 비지도학습의 주요 과제(Task)에 해당하는 것은?",
      options: ["군집화 (Clustering) 및 차원 축소 (PCA)", "주가 연속 수치 예측", "스팸 메일 이진 분류", "학점 예측 회귀"],
      answer: 0,
      explanation: "군집화, 차원 축소, 이상치 탐지 등은 대표적인 비지도학습 과제입니다[cite: 5].",
      hint: "정답 라벨 없이 데이터를 묶거나 압축하는 과제입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-003",
      conceptId: "clustering-definition",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "데이터 안에서 서로 비슷한 성격을 가진 데이터끼리 묶어 하위 집단을 만드는 기법은?",
      options: ["클러스터링 (Clustering / 군집화)", "선형회귀", "로지스틱 분류", "SFT"],
      answer: 0,
      explanation: "클러스터링(군집화)은 유사한 데이터 샘플들을 동질 그룹으로 묶는 기술입니다[cite: 5].",
      hint: "군집(Cluster)을 만든다는 의미입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-004",
      conceptId: "clustering-goal",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "바람직한 클러스터링 결과가 갖추어야 할 기본 원칙은?",
      options: [
        "집단 내부는 서로 유사하고, 집단 간은 서로 상이해야 한다.",
        "집단 내부와 집단 간 모두 완전히 똑같아야 한다.",
        "모든 데이터가 단 1개의 클러스터로만 모여야 한다.",
        "데이터 간 거리가 멀수록 같은 군집으로 묶어야 한다."
      ],
      answer: 0,
      explanation: "같은 군집 내부 응집도는 높고(유사), 다른 군집 간 분리도는 높아야(상이) 좋은 군집화입니다[cite: 5].",
      hint: "같은 그룹끼리는 비슷하고, 다른 그룹끼리는 달라야 합니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-005",
      conceptId: "marketing-segmentation-example",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "쇼핑몰에서 구매 이력과 소득 데이터를 활용해 비슷한 취향의 고객 그룹을 나누는 마케팅 작업은 어떤 과제에 속하는가?",
      options: ["클러스터링 (마케팅 세그먼테이션)", "선형 회귀", "시그램 정렬", "지도 분류"],
      answer: 0,
      explanation: "고객들을 라벨 없이 특징 기반으로 하위 집단으로 나누는 시장 세분화는 클러스터링 응용입니다[cite: 5].",
      hint: "라벨 없이 고객 그룹을 세분화(Clustering)합니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-006",
      conceptId: "k-means-k-meaning",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "K-평균(K-means) 클러스터링 알고리즘에서 파라미터 $K$의 의미는?",
      options: ["사전에 사용자가 지정하는 클러스터(군집)의 개수", "데이터 전체 개수", "입력 피처 차원 수", "반복 학습 횟수"],
      answer: 0,
      explanation: "K-means의 $K$는 몇 개의 군집으로 나눌지 사용자가 미리 설정하는 군집 수입니다[cite: 5].",
      hint: "만들고자 하는 군집(Cluster)의 개수입니다[cite: 5]."
    },
    {
      id: "nlp-c4-mc-007",
      conceptId: "k-means-process",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "K-means 알고리즘의 주요 반복 수행 단계에 해당하는 것은?",
      options: [
        "각 데이터를 가장 가까운 클러스터 중심에 할당하고, 할당된 데이터들의 평균으로 중심점을 재계산함",
        "역전파를 통해 기울기를 계산하고 가중치를 차감함",
        "데이터를 K개의 폴드로 나누어 교차검증함",
        "라벨 값과의 차이를 제곱하여 MSE를 최소화함"
      ],
      answer: 0,
      explanation: "K-means는 [가장 가까운 중심에 데이터 할당 $\rightarrow$ 군집 중심점 재계산] 과정을 반복합니다[cite: 5].",
      hint: "가까운 중심 할당 및 평균으로 중심 재계산을 반복합니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-008",
      conceptId: "hierarchical-clustering-feature",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "계층적 군집(Hierarchical Clustering) 방식이 K-means와 비교했을 때 나타나는 차이는?",
      options: [
        "군집 수 $K$를 사전에 고정할 필요 없이 계층적 트리 구조로 군집을 형성한다.",
        "반드시 $K$값을 사전에 설정해야만 구동된다.",
        "정답 라벨이 없으면 구동할 수 없다.",
        "오직 1차원 데이터만 처리할 수 있다."
      ],
      answer: 0,
      explanation: "계층적 군집화는 사전 $K$ 지정 없이 데이터 간 거리를 기반으로 트리 형태의 계층 군집을 만들어 갑니다[cite: 5].",
      hint: "군집 수 $K$를 사전에 지정하지 않고 트리 구조를 만듭니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-009",
      conceptId: "dendrogram-concept",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "계층적 군집화 결과를 나무 모양의 다이어그램 형태로 시각화한 구조를 무엇이라 하는가?",
      options: ["덴드로그램 (Dendrogram)", "혼동행렬", "산점도", "히스토그램"],
      answer: 0,
      explanation: "계층적 군집 결합 과정을 보여주는 나무 구조 형태의 다이어그램을 덴드로그램이라 부릅니다[cite: 5].",
      hint: "나무 가지 형태의 덴드로(Dendro)그램입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-010",
      conceptId: "pca-dimensionality-reduction",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "데이터의 분산(정보)을 최대한 보존하면서 고차원 피처를 저차원으로 압축하는 대표적 비지도 기법은?",
      options: ["주성분 분석 (PCA / 차원 축소)", "로지스틱 회귀", "단순 선형회귀", "결정계수 계산"],
      answer: 0,
      explanation: "PCA(Principal Component Analysis)는 대표적인 차원 축소 비지도학습 기법입니다[cite: 5].",
      hint: "차원 축소(PCA) 기법입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-011",
      conceptId: "unsupervised-vs-supervised-data",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "지도학습과 비지도학습 데이터를 구별하는 핵심 차이점은?",
      options: ["정답 라벨(Label)의 존재 여부", "데이터 개수의 많고 적음", "컴퓨터 GPU 사용 여부", "데이터의 숫자 포함 여부"],
      answer: 0,
      explanation: "지도학습은 정답 Label이 있고, 비지도학습은 Label 없이 Feature만 존재합니다[cite: 5].",
      hint: "정답 라벨(Label)이 있냐 없냐의 차이입니다[cite: 5]."
    },
    {
      id: "ml-c4-mc-012",
      conceptId: "distance-metric-clustering",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "multiple-choice",
      prompt: "클러스터링에서 데이터 간 '유사함'과 '다름'을 판단하기 위해 주로 측정하는 것은?",
      options: ["데이터 간의 거리 (Distance/유사도)", "라벨값의 손실", "모델 파라미터 수", "데이터 수집 시간"],
      answer: 0,
      explanation: "클러스터링은 데이터 공간상 거리가 가까우면 유사하고, 거리가 멀면 상이하다고 판단합니다[cite: 5].",
      hint: "샘플 간 공간상의 거리/유사도입니다[cite: 5]."
    },
    {
      id: "ml-c4-sa-013",
      conceptId: "clustering-sa",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "short-answer",
      prompt: "라벨 없이 데이터 안에서 유사한 성격의 하위 집합들을 찾아 묶어주는 비지도학습 과제는?",
      options: [],
      answer: null,
      acceptedAnswers: ["클러스터링", "군집화", "Clustering", "clustering"],
      explanation: "Clustering(군집화) 입니다[cite: 5].",
      hint: "한글로 '군집화' 또는 영문 'Clustering' 입니다[cite: 5]."
    },
    {
      id: "ml-c4-sa-014",
      conceptId: "dendrogram-sa",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "short-answer",
      prompt: "계층적 군집화의 집단 결합 과정을 보여주는 나무 구조 형태의 다이어그램 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["덴드로그램", "Dendrogram", "dendrogram"],
      explanation: "Dendrogram(덴드로그램) 입니다[cite: 5].",
      hint: "덴드로그램 입니다[cite: 5]."
    },
    {
      id: "ml-c4-es-015",
      conceptId: "k-means-vs-hierarchical-essay",
      difficulty: "easy",
      category: "비지도학습 및 군집화",
      questionType: "essay",
      prompt: "K-means 클러스터링과 계층적 군집화(Hierarchical Clustering)의 가장 대표적인 차이점을 $K$값 설정 관점에서 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["K-means", "계층적", "K값", "고정", "트리"],
      modelAnswer: "K-means는 사용자가 군집 수 $K$를 사전에 직접 정해주어야 하는 반면, 계층적 군집화는 사전 $K$ 설정 없이 데이터를 단계적으로 묶어 나가며 덴드로그램 형태의 계층 트리를 형성한다[cite: 5].",
      rubricKeywords: ["K-means 사전 K 설정 필수", "계층적 군집 사전 K 설정 불필요/트리 형성"],
      minLength: 20,
      explanation: "K-means의 사전 K 지정 필요성과 계층적 군집화의 K 미지정 트리 형성 차이를 서술합니다[cite: 5].",
      hint: "K값을 미리 지정해야 하는지 여부를 중심으로 서술하세요[cite: 5]."
    },

    // ==========================================
    // 카테고리 5: 선형회귀 (15문항)
    // ==========================================
    {
      id: "ml-c5-mc-001",
      conceptId: "simple-linear-regression-concept",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "단 하나의 독립 변수 $X$와 반응 변수 $Y$ 사이의 직선 관계를 도출하는 회귀 기법은?",
      options: ["단순선형회귀 (Simple Linear Regression)", "다중선형회귀", "로지스틱 회귀", "K-means"],
      answer: 0,
      explanation: "단일 설명변수 $X$만을 활용하는 선형회귀가 단순선형회귀입니다[cite: 4].",
      hint: "단 하나의 설명변수를 사용하므로 '단순' 선형회귀입니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-002",
      conceptId: "regression-coefficients",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "단순선형회귀식 $Y = \beta_0 + \beta_1 X + \epsilon$ 에서 $\beta_0$과 $\beta_1$을 통칭하는 용어는?",
      options: ["회귀 계수 (Regression Coefficients)", "잔차", "측정 오차", "독립 변수"],
      answer: 0,
      explanation: "$\beta_0$(절편)과 $\beta_1$(기울기)은 모델이 추정해야 할 회귀 계수(Parameter)입니다[cite: 4].",
      hint: "절편과 기울기를 일컫는 회귀 계수입니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-003",
      conceptId: "residual-definition-formula",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "선형회귀에서 특정 데이터 $i$번째의 실제 관측값 $y_i$와 모델 예측값 $\hat{y}_i$의 차이 $e_i = y_i - \hat{y}_i$를 무엇이라 하는가?",
      options: ["잔차 (Residual)", "측정 오차 ($\epsilon$)", "회귀 계수", "결정계수"],
      answer: 0,
      explanation: "실제 관측값과 직선 예측값 사이의 수직 거리를 잔차(Residual)라 부릅니다[cite: 4].",
      hint: "남아있는 차이라는 뜻의 잔차(Residual)입니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-004",
      conceptId: "least-squares-concept",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "데이터와 직선 간의 잔차제곱합(RSS)을 최소화하도록 회귀 계수를 추정하는 방법은?",
      options: ["최소제곱법 (Least Squares)", "최대 우도 추정법 (MLE)", "Gradient Descent", "주성분 분석"],
      answer: 0,
      explanation: "최소제곱법은 잔차 제곱의 합(RSS)을 최소화하는 최적의 직선을 수학적으로 찾아냅니다[cite: 4].",
      hint: "잔차의 제곱(Squares)을 최소(Least)로 만듭니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-005",
      conceptId: "multiple-linear-regression-concept",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "TV 광고비, 라디오 광고비, 제품 가격 등 여러 개의 독립 변수를 동시에 고려하는 선형회귀는?",
      options: ["다중선형회귀 (Multiple Linear Regression)", "단순선형회귀", "로지스틱 회귀", "이진 분류"],
      answer: 0,
      explanation: "독립 변수 $X_1, X_2, ..., X_p$ 가 여러 개 존재하는 회귀 기법이 다중선형회귀입니다[cite: 4].",
      hint: "독립 변수가 여럿(Multiple) 존재합니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-006",
      conceptId: "multiple-regression-coefficients-meaning",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "다중선형회귀에서 특정 계수 $\beta_j$의 올바른 해석은?",
      options: [
        "다른 모든 변수를 고정한 채 $X_j$가 1단위 증가할 때 $Y$의 평균 변화량",
        "모든 독립 변수가 동시에 1단위 증가할 때 $Y$의 변화량",
        "모델의 오버피팅 비율",
        "$X_j$ 변수의 개수"
      ],
      answer: 0,
      explanation: "다중회귀의 계수는 다른 조건이 동일(고정)할 때 해당 변수 1단위 변화에 따른 $Y$의 평균 변화입니다[cite: 4].",
      hint: "다른 변수들을 통제(고정)한 상태에서의 변화량입니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-007",
      conceptId: "p-value-significance",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "회귀 분석 결과표에서 특정 변수의 p-value가 0.05보다 훨씬 매우 작게(< 0.0001) 나왔을 때의 해석은?",
      options: [
        "해당 독립 변수와 $Y$ 사이의 관계가 통계적으로 매우 유의미하다.",
        "해당 독립 변수는 $Y$와 아무 관련이 없다.",
        "모델을 즉시 폐기해야 한다.",
        "잔차가 무한대로 크다."
      ],
      answer: 0,
      explanation: "p-value < 0.05 이면 해당 변수의 계수가 0이라는 유의성 검정을 기각하므로 통계적으로 유의미함을 뜻합니다[cite: 4].",
      hint: "p-value가 매우 작으면 통계적으로 유의합니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-008",
      conceptId: "multicollinearity-definition",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "다중선형회귀에서 독립 변수(Feature)들끼리 서로 강한 상관관계를 가질 때 발생하는 문제는?",
      options: ["다중공선성 (Multicollinearity)", "과적합", "기울기 소실", "우도 최대화"],
      answer: 0,
      explanation: "독립변수 간 높은 상관관계가 존재할 때 다중공선성 문제가 발생하여 계수 추정이 불안정해집니다[cite: 4].",
      hint: "변수 간에 서로 강하게 연관된 공선성 문제입니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-009",
      conceptId: "multicollinearity-consequence",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "다중공선성이 심하게 발생했을 때 회귀 모델에 미치는 영향은?",
      options: [
        "회귀 계수의 분산이 커져 추정이 불안정해지고 개별 변수의 효과 해석이 어려워진다.",
        "모델 학습 속도가 100배 빨라진다.",
        "$R^2$ 수치가 무조건 0이 된다.",
        "잔차가 완전히 소멸한다."
      ],
      answer: 0,
      explanation: "다중공선성은 계수의 분산을 크게 만들어 개별 변수의 순수한 영향력을 파악하기 어렵게 만듭니다[cite: 4].",
      hint: "계수 추정의 분산이 커져 해석이 불안정해집니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-010",
      conceptId: "correlation-vs-causation-rule",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "선형회귀 분석 시 통계적 상관관계가 관찰된다고 해서 바로 성립한다고 볼 수 없는 것은?",
      options: ["인과관계 (Causation)", "선형식", "잔차 계산", "최소제곱법"],
      answer: 0,
      explanation: "수치적 상관관계(Correlation)가 존재한다고 해서 그것이 곧바로 원인과 결과인 인과관계(Causation)를 의미하지는 않습니다[cite: 4].",
      hint: "상관관계가 곧 '인과관계'는 아닙니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-011",
      conceptId: "normal-equation-closed-form",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "다중선형회귀에서 최소제곱법으로 계수를 한 번에 공식으로 바로 구하는 해의 수식 형태를 무엇이라 하는가?",
      options: ["정규방정식 해 (Closed-form solution)", "경사하강법", "시그모이드 해", "인컨텍스트 해"],
      answer: 0,
      explanation: "$\hat{\boldsymbol{\beta}} = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y}$ 수식처럼 공식으로 바로 계산되는 정규방정식(Closed-form) 해입니다[cite: 4].",
      hint: "공식으로 바로 구해지는 Closed-form 해입니다[cite: 4]."
    },
    {
      id: "ml-c5-mc-012",
      conceptId: "rss-definition",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "multiple-choice",
      prompt: "모든 데이터 샘플에 대해 실제값과 예측값의 차이(잔차 $e_i$)를 제곱하여 더한 $e_1^2 + e_2^2 + ... + e_n^2$ 의 명칭은?",
      options: ["잔차제곱합 (RSS)", "결정계수 ($R^2$)", "오즈 (Odds)", "우도 (Likelihood)"],
      answer: 0,
      explanation: "Residual Sum of Squares(RSS, 잔차제곱합) 입니다[cite: 4].",
      hint: "잔차(Residual)를 제곱하여 합한 RSS 입니다[cite: 4]."
    },
    {
      id: "ml-c5-sa-013",
      conceptId: "residual-sa",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "short-answer",
      prompt: "선형회귀에서 실제 관측값 $y_i$와 모델 예측값 $\hat{y}_i$의 차이($y_i - \hat{y}_i$)를 무엇이라 하는가?",
      options: [],
      answer: null,
      acceptedAnswers: ["잔차", "Residual", "residual"],
      explanation: "잔차(Residual) 입니다[cite: 4].",
      hint: "한글 '잔차' 또는 영문 'Residual' 입니다[cite: 4]."
    },
    {
      id: "ml-c5-sa-014",
      conceptId: "multicollinearity-sa",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "short-answer",
      prompt: "다중선형회귀에서 독립 변수들 간에 강한 상관관계가 존재하여 계수 추정이 불안정해지는 현상은?",
      options: [],
      answer: null,
      acceptedAnswers: ["다중공선성", "다중 공선성", "Multicollinearity", "multicollinearity"],
      explanation: "다중공선성(Multicollinearity) 문제 현상입니다[cite: 4].",
      hint: "한글 '다중공선성' 입니다[cite: 4]."
    },
    {
      id: "ml-c5-es-015",
      conceptId: "least-squares-principle-essay",
      difficulty: "easy",
      category: "선형회귀",
      questionType: "essay",
      prompt: "선형회귀에서 '최소제곱법(Least Squares)'의 핵심 원리와 잔차제곱합(RSS)의 개념을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["잔차", "제곱", "최소화", "RSS"],
      modelAnswer: "잔차는 실제 관측값과 모델 예측값의 차이이며, 잔차제곱합(RSS)은 모든 관측치에서의 잔차를 제곱하여 더한 값이다. 최소제곱법은 이 RSS 값을 가장 작게 만들어 데이터점들과 가장 가까운 최적의 회귀 직선(계수)을 찾아내는 원리이다[cite: 4].",
      rubricKeywords: ["실제값과 예측값 차이(잔차)", "잔차 제곱의 합(RSS)", "RSS 최소화"],
      minLength: 20,
      explanation: "잔차의 정의, RSS의 개념, 그리고 RSS를 최소화하여 계수를 구하는 최소제곱 원리를 서술합니다[cite: 4].",
      hint: "잔차 및 잔차제곱합(RSS)의 정의와 이를 최소화하는 원리를 쓰세요[cite: 4]."
    },

    // ==========================================
    // 카테고리 6: 로지스틱회귀 (15문항)
    // ==========================================
    {
      id: "ml-c6-mc-001",
      conceptId: "logistic-regression-purpose",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀(Logistic Regression)의 주요 목적과 예측 대상 형태는?",
      options: [
        "입력 변수를 바탕으로 특정 사건이 발생할 확률(0~1 사이)을 예측하여 이진 분류를 수행함",
        "연속적인 아파트 매매 금액 수치를 직접 예측함",
        "데이터 점들을 3개 이상의 비지도 클러스터로 그룹화함",
        "텍스트 문장을 다른 언어로 번역함"
      ],
      answer: 0,
      explanation: "로지스틱 회귀는 시그모이드 함수를 통해 0~1 사이의 확률을 출력하여 이진 분류를 수행합니다[cite: 4].",
      hint: "0과 1 사이의 확률값을 예측해 분류합니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-002",
      conceptId: "sigmoid-function-formula",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "모든 실수 $z$를 0과 1 사이의 확률값으로 압축 변환해 주는 시그모이드(Sigmoid) 수식은?",
      options: [
        "$y = \\frac{1}{1 + e^{-z}}$",
        "$y = \\max(0, z)$",
        "$y = \\beta_0 + \\beta_1 z$",
        "$y = z^2$"
      ],
      answer: 0,
      explanation: "시그모이드 함수 수식은 $y = \frac{e^z}{1 + e^z} = \frac{1}{1 + e^{-z}}$ 입니다[cite: 4].",
      hint: "$1 / (1 + e^{-z})$ 수식 형태입니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-003",
      conceptId: "sigmoid-limits",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "시그모이드 함수 $y = \frac{1}{1 + e^{-z}}$ 에서 $z \rightarrow +\infty$ 일 때와 $z \rightarrow -\infty$ 일 때 수렴하는 값은?",
      options: ["$z \rightarrow +\infty$ 이면 1, $z \rightarrow -\infty$ 이면 0", "$z \rightarrow +\infty$ 이면 0, $z \rightarrow -\infty$ 이면 1", "둘 다 0.5로 수렴", "둘 다 무한대로 발산"],
      answer: 0,
      explanation: "$z$가 커지면 1에 가까워지고, $z$가 매우 작아지면 0에 가까워집니다[cite: 4].",
      hint: "양수 무한대로 갈 때 1, 음수 무한대로 갈 때 0입니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-004",
      conceptId: "sigmoid-at-zero",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "시그모이드 함수 $y = \frac{1}{1 + e^{-z}}$ 에 $z = 0$ 을 대입했을 때의 출력값은?",
      options: ["0.5", "0.0", "1.0", "-1.0"],
      answer: 0,
      explanation: "$e^0 = 1$ 이므로 $\frac{1}{1 + 1} = 0.5$ 가 됩니다[cite: 4].",
      hint: "$z=0$ 일 때 정중앙값 0.5가 나옵니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-005",
      conceptId: "odds-formula-definition",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "성공 확률 $p$에 대해 실패 확률 대비 성공 확률의 비율을 나타내는 오즈(Odds) 수식은?",
      options: ["$\\text{Odds} = \\frac{p}{1-p}$", "$\\text{Odds} = \\frac{1-p}{p}$", "$\\text{Odds} = p \\times (1-p)$", "$\\text{Odds} = p + (1-p)$"],
      answer: 0,
      explanation: "오즈(Odds)는 $\frac{p(y=1|x)}{p(y=0|x)} = \frac{p}{1-p}$ 로 정의됩니다[cite: 4].",
      hint: "성공 확률 / 실패 확률 입니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-006",
      conceptId: "logit-transformation-definition",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "오즈(Odds)에 자연로그(log)를 취한 $\log\left(\frac{p}{1-p}\right)$ 변환을 무엇이라 하는가?",
      options: ["로짓 변환 (Logit Transformation / Log odds)", "시그모이드 변환", "정규화 변환", "최소제곱 변환"],
      answer: 0,
      explanation: "오즈에 로그를 취한 $\text{logit}(p) = \log\left(\frac{p}{1-p}\right)$를 로짓 변환이라고 합니다[cite: 4].",
      hint: "로짓(Logit) 변환 또는 Log odds라 부릅니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-007",
      conceptId: "logit-linear-relationship",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀 모형식에 로짓 변환을 수행했을 때 우변에 얻어지는 식의 형태는?",
      options: ["선형 회귀 모형식 ($\\beta_0 + \\beta_1 X$)", "2차 곡선 방정식", "원-핫 인코딩 벡터", "행렬식"],
      answer: 0,
      explanation: "로지스틱 모형식에 로짓 변환을 취하면 $\log\left(\frac{p(X)}{1-p(X)}\right) = \beta_0 + \beta_1 X$ 와 같이 선형 회귀식이 도출됩니다[cite: 4].",
      hint: "로짓 변환 결과는 선형 회귀식 형태가 됩니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-008",
      conceptId: "likelihood-definition",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀에서 '현재 확률 모델이 관측 데이터들을 얼마나 잘 설명하는지' 나타내는 평가지표는?",
      options: ["우도 (Likelihood)", "평균제곱오차 (MSE)", "잔차제곱합 (RSS)", "결정계수 ($R^2$)"],
      answer: 0,
      explanation: "확률 모델에서는 데이터가 관측될 가능도를 뜻하는 우도(Likelihood)를 지표로 삼습니다[cite: 4].",
      hint: "가능도 또는 우도(Likelihood)라 부릅니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-009",
      conceptId: "mle-principle",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀 학습 시 우도(Likelihood) 값을 최대로 만드는 회귀 계수를 찾아내는 기법은?",
      options: ["최대 우도 추정법 (MLE)", "최소제곱법 (Least Squares)", "PCA", "Hold-out"],
      answer: 0,
      explanation: "Maximum Likelihood Estimation(MLE)은 우도를 최대화하는 모수를 추정하는 방법입니다[cite: 4].",
      hint: "Likelihood를 Maximum으로 만듭니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-010",
      conceptId: "log-likelihood-reason",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "우도(Likelihood) 수식에 로그를 취해 Log-Likelihood로 변환하여 최대화하는 주요 이유는?",
      options: [
        "확률들의 곱셈을 덧셈 연산으로 변환하여 미분 및 수치적 최적화를 용이하게 만들기 위해",
        "우도 값을 0으로 만들기 위해",
        "확률 범위를 0~1 밖으로 넓히기 위해",
        "파라미터 개수를 줄이기 위해"
      ],
      answer: 0,
      explanation: "곱으로 구성된 우도식에 $\log$를 취하면 덧셈으로 바뀌어 미분 및 수치 최적화가 쉬워집니다[cite: 4].",
      hint: "로그를 취하면 곱셈이 덧셈으로 변해 미분이 쉬워집니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-011",
      conceptId: "credit-card-default-example",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "신용카드 연체 데이터에서 카드 사용량(Balance)이 증가함에 따라 연체 확률 $p(X)$의 곡선 형태는?",
      options: ["S자 형태의 시그모이드 곡선", "우하향 일직선", "원형 곡선", "수평 직선"],
      answer: 0,
      explanation: "로지스틱 회귀의 예측 확률 곡선은 S자 형태의 시그모이드 곡선을 그립니다[cite: 4].",
      hint: "기울어진 S자 모양 곡선입니다[cite: 4]."
    },
    {
      id: "ml-c6-mc-012",
      conceptId: "logistic-coefficient-interpretation",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "multiple-choice",
      prompt: "로지스틱 회귀 계수 $\hat{\beta}_1 = 0.0055$ 가 의미하는 바는?",
      options: [
        "입력 변수 $X$가 1단위 증가할 때 연체의 로짓(Log-odds)이 0.0055 증가한다.",
        "입력 변수 $X$가 1단위 증가할 때 연체 확률이 정확히 0.0055% 감소한다.",
        "연체 확률이 무조건 100%가 된다.",
        "오차값이 0.0055이다."
      ],
      answer: 0,
      explanation: "로지스틱 회귀 계수는 $X$가 1단위 변화할 때 정답의 로짓(log-odds) 변화량을 의미합니다[cite: 4].",
      hint: "확률 자체가 아닌 '로짓(log-odds)'의 변화량입니다[cite: 4]."
    },
    {
      id: "ml-c6-sa-013",
      conceptId: "sigmoid-sa",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "short-answer",
      prompt: "모든 실숫값을 0과 1 사이의 확률값 범위로 압축 변환해 주는 S자형 함수의 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["시그모이드 함수", "시그모이드", "Sigmoid", "sigmoid"],
      explanation: "Sigmoid 함수입니다[cite: 4].",
      hint: "한글 '시그모이드' 또는 영문 'Sigmoid' 입니다[cite: 4]."
    },
    {
      id: "ml-c6-sa-014",
      conceptId: "mle-sa",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "short-answer",
      prompt: "로지스틱 회귀에서 우도(Likelihood)를 최대화하는 모수를 찾아내는 추정법 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["MLE", "mle", "Maximum Likelihood Estimation"],
      explanation: "Maximum Likelihood Estimation(MLE) 입니다[cite: 4].",
      hint: "MLE 3글자 약자입니다[cite: 4]."
    },
    {
      id: "ml-c6-es-015",
      conceptId: "odds-and-logit-essay",
      difficulty: "easy",
      category: "로지스틱회귀",
      questionType: "essay",
      prompt: "오즈(Odds)의 정의를 수식과 함께 설명하고, 로짓 변환(Logit Transformation)을 거쳤을 때 로지스틱 회귀가 선형회귀식과 어떻게 연결되는지 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["오즈", "성공", "실패", "로그", "선형"],
      modelAnswer: "오즈(Odds)는 실패 확률 대비 성공 확률의 비율인 $\\frac{p}{1-p}$ 이다. 여기에 자연로그를 취하는 로짓 변환 $\\log\\left(\\frac{p}{1-p}\\right)$ 을 수행하면 우변이 선형 회귀식 $\\beta_0 + \\beta_1 X$ 로 변환되어 선형 모델과 연결된다[cite: 4].",
      rubricKeywords: ["오즈 $p/(1-p)$", "로그 오즈(로짓)", "선형 회귀식 변환"],
      minLength: 20,
      explanation: "오즈의 수식 정의와 오즈에 로그를 취한 로짓 변환이 선형식 $\beta_0 + \beta_1 X$가 되는 원리를 서술합니다[cite: 4].",
      hint: "오즈 수식 및 오즈에 로그를 취하면 우변이 선형식이 됨을 서술하세요[cite: 4]."
    },

    // ==========================================
    // 카테고리 7: 신경망 모델 (15문항)
    // ==========================================
    {
      id: "ml-c7-mc-001",
      conceptId: "shallow-network-structure",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "Shallow(얕은) 신경망의 아키텍처적 구성을 가장 바르게 설명한 것은?",
      options: [
        "입력층 - 은닉층 1개 - 출력층으로 구성된 신경망",
        "은닉층이 10개 이상 쌓인 신경망",
        "은닉층이 아예 존재하지 않는 신경망",
        "출력층만 여러 개 존재하는 신경망"
      ],
      answer: 0,
      explanation: "Shallow 신경망은 은닉층(Hidden Layer)을 단 1개만 갖는 신경망 구조입니다[cite: 4].",
      hint: "은닉층이 딱 1개 존재합니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-002",
      conceptId: "hidden-unit-role",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "신경망의 은닉 노드(Hidden Unit)가 수행하는 핵심 역할은?",
      options: [
        "선형 결합 후 활성화 함수를 거쳐 모델에 비선형 표현력을 부여함",
        "입력 데이터를 그대로 출력층으로 지름길 전송함",
        "측정 오차 $\epsilon$을 0으로 초기화함",
        "손실함수의 종류를 결정함"
      ],
      answer: 0,
      explanation: "Hidden Unit은 선형 변환 후 비선형 활성화 함수를 적용하여 비선형 패턴 표현력을 만듭니다[cite: 4].",
      hint: "비선형 활성화 함수를 적용해 표현력을 만듭니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-003",
      conceptId: "relu-activation-formula",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "대표적 활성화 함수인 ReLU(Rectified Linear Unit)의 수식 $a[z] = \max(0, z)$ 의 출력 특징은?",
      options: [
        "음수 입력은 0으로 바꾸고, 0 이상의 양수 입력은 값 그대로 출력함",
        "모든 입력을 -1과 1 사이로 압축함",
        "입력값의 제곱을 출력함",
        "입력값에 무조건 10을 더함"
      ],
      answer: 0,
      explanation: "ReLU는 $z < 0$이면 0, $z \ge 0$이면 $z$ 그대로를 내놓습니다[cite: 4].",
      hint: "음수는 0, 양수는 자기 자신입니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-004",
      conceptId: "piecewise-linear-function",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "ReLU 활성화 함수를 사용하는 Shallow 신경망이 만들어내는 출력 함수의 형태적 특징은?",
      options: ["조각별 선형 함수 (Piecewise Linear Function)", "완벽한 매끄러운 원형 함수", "단순 직선 함수", "수평 영함수"],
      answer: 0,
      explanation: "ReLU의 꺾이는 특성들이 결합되어 입력 구간별로 기울기가 달라지는 조각별 선형(Piecewise Linear) 함수를 형성합니다[cite: 4].",
      hint: "구간별로 꺾이는 조각별 선형 함수입니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-005",
      conceptId: "shallow-parameter-count",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "1개 입력 $x$, 3개 Hidden Unit, 1개 출력 $y$를 가진 Shallow 신경망 $y = \phi_0 + \sum_{d=1}^3 \phi_d a[\theta_{d0} + \theta_{d1}x]$ 의 총 파라미터 개수는?",
      options: ["10개", "3개", "5개", "100개"],
      answer: 0,
      explanation: "$\theta$ 파라미터 6개($\theta_{10}, \theta_{11}, \theta_{20}, \theta_{21}, \theta_{30}, \theta_{31}$) + $\phi$ 파라미터 4개($\phi_0, \phi_1, \phi_2, \phi_3$) = 총 10개입니다[cite: 4].",
      hint: "6개의 $\theta$와 4개의 $\phi$를 합친 개수입니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-006",
      conceptId: "universal-approximation-theorem-concept",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "'Hidden Unit을 충분히 많이 갖는다면, 얕은 신경망이라도 임의의 연속 함수를 임의의 정밀도로 근사할 수 있다'는 정리는?",
      options: ["보편적 근사 정리 (Universal Approximation Theorem)", "중앙한계 정리", "대수의 법칙", "베이즈 정리"],
      answer: 0,
      explanation: "Universal Approximation Theorem은 은닉 노드가 충분하면 1개 은닉층으로도 복잡한 연속함수를 표현할 수 있음을 증명합니다[cite: 4].",
      hint: "보편적(Universal)으로 근사 가능하다는 정리입니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-007",
      conceptId: "multi-input-multi-output-nn",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "입력 변수가 2개($x_1, x_2$)이고 출력 변수가 2개($y_1, y_2$)인 신경망에 대한 설명으로 옳은 것은?",
      options: [
        "여러 입력을 함께 조합하여 여러 개의 출력을 동시에 예측할 수 있다.",
        "입력이 2개이면 출력은 무조건 1개여야 한다.",
        "은닉층을 사용할 수 없게 된다.",
        "활성화 함수를 적용할 수 없다."
      ],
      answer: 0,
      explanation: "신경망은 임의의 $D_i$개 입력과 $D_o$개 출력을 갖도록 가중치 연결을 확장할 수 있습니다[cite: 4].",
      hint: "다중 입력과 다중 출력을 지원합니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-008",
      conceptId: "deep-network-definition",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "은닉층(Hidden Layer)을 2개 이상 복수로 쌓아 올려 구성한 신경망 구조를 무엇이라 하는가?",
      options: ["Deep 네트워크 (심층 신경망)", "Shallow 네트워크", "단순 선형회귀", "단층 퍼셉트론"],
      answer: 0,
      explanation: "은닉층이 여러 개 다층으로 연결된 구조가 Deep 네트워크입니다[cite: 4].",
      hint: "깊게(Deep) 층을 쌓은 네트워크입니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-009",
      conceptId: "folding-intuition",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "Deep 네트워크가 층을 지날 때마다 입력 공간을 지속적으로 '접어(Folding)' 효율적인 비선형 영역을 만들어내는 직관적 개념은?",
      options: ["접기 (Folding) 직관", "펼치기 직관", "선형화 직관", "평탄화 직관"],
      answer: 0,
      explanation: "Deep 네트워크는 층을 거치며 활성화 함수에 의해 공간이 접혀(Folding) 조각적 선형 구역이 지수적으로 늘어납니다[cite: 4].",
      hint: "공간을 접어(Folding) 나간다는 표현입니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-010",
      conceptId: "shallow-vs-deep-efficiency",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "Shallow 네트워크와 비교하여 Deep 네트워크가 갖는 결정적 표현력 이점은?",
      options: [
        "비슷한 개수의 파라미터를 사용하더라도 훨씬 더 많은 조각적 선형 구역을 형성하여 높은 표현력을 제공함",
        "파라미터 수가 무조건 0이 됨",
        "오버피팅이 절대 발생하지 않음",
        "학습이 필요 없어짐"
      ],
      answer: 0,
      explanation: "Deep 네트워크는 층의 합성을 통해 동일 파라미터 대비 생성 가능한 선형 영역 수가 지수적으로 증가하여 표현율이 높습니다[cite: 4].",
      hint: "동일 파라미터 대비 훨씬 뛰어난 표현력과 영역 분디를 만듭니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-011",
      conceptId: "pre-activation-concept",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "은닉 노드에서 활성화 함수 $a[\cdot]$를 적용하기 직전의 선형 결합 값($\theta_{d0} + \theta_{d1}x$)을 일컫는 용어는?",
      options: ["전활성값 (Pre-activation)", "후활성값", "손실값", "출력값"],
      answer: 0,
      explanation: "활성화 함수 적용 전의 선형 결합 수치를 Pre-activation(전활성값)이라고 부릅니다[cite: 4].",
      hint: "활성화(Activation) 전(Pre) 상태의 값입니다[cite: 4]."
    },
    {
      id: "ml-c7-mc-012",
      conceptId: "network-graph-weights",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "multiple-choice",
      prompt: "신경망 도식 그래프에서 노드와 노드를 잇는 화살표 화살표상의 기호가 의미하는 바는?",
      options: ["가중치 (Weight)", "입력 데이터", "활성화 함수 종류", "손실함수"],
      answer: 0,
      explanation: "노드 간의 연결 화살표는 출발 노드 값에 곱해지는 가중치(Weight) 파라미터를 의미합니다[cite: 4].",
      hint: "출발 노드 값에 곱해지는 가중치입니다[cite: 4]."
    },
    {
      id: "ml-c7-sa-013",
      conceptId: "relu-sa",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "short-answer",
      prompt: "음수 입력은 0으로, 양수 입력은 값 그대로 출력하는 대표적인 비선형 활성화 함수 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["ReLU", "relu", "Relu"],
      explanation: "Rectified Linear Unit(ReLU) 입니다[cite: 4].",
      hint: "ReLU 4글자 약자입니다[cite: 4]."
    },
    {
      id: "ml-c7-sa-014",
      conceptId: "universal-approximation-theorem-sa",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "short-answer",
      prompt: "충분히 많은 은닉 노드를 가지면 얕은 신경망도 임의의 연속 함수를 임의 정밀도로 근사할 수 있다는 정리는?",
      options: [],
      answer: null,
      acceptedAnswers: ["보편적 근사 정리", "보편적근사정리", "Universal Approximation Theorem"],
      explanation: "Universal Approximation Theorem(보편적 근사 정리) 입니다[cite: 4].",
      hint: "보편적 근사 정리 입니다[cite: 4]."
    },
    {
      id: "ml-c7-es-015",
      conceptId: "shallow-vs-deep-essay",
      difficulty: "easy",
      category: "신경망 모델",
      questionType: "essay",
      prompt: "Shallow 네트워크와 Deep 네트워크의 구조적 차이점과, Deep 네트워크가 표현력 및 효율성 면에서 유리한 이유를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["은닉층", "1개", "복수", "표현력", "접기"],
      modelAnswer: "Shallow 네트워크는 은닉층이 1개인 반면, Deep 네트워크는 은닉층이 2개 이상 복수로 쌓인 구조이다. Deep 네트워크는 층의 합성을 통해 입력 공간을 접어 나감으로써(Folding) 비슷한 파라미터 수 대비 훨씬 많은 조각적 선형 구역을 만들어내어 표현력이 뛰어나다[cite: 4].",
      rubricKeywords: ["Shallow 은닉층 1개", "Deep 은닉층 복수", "공간 접기(Folding) 및 높은 표현력"],
      minLength: 20,
      explanation: "은닉층 개수 차이와 층 합성을 통한 공간 접기(Folding) 및 표현력 우위를 서술합니다[cite: 4].",
      hint: "은닉층 개수 차이 및 층 합성에 따른 표현력 이점을 기술하세요[cite: 4]."
    }
  ]
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();