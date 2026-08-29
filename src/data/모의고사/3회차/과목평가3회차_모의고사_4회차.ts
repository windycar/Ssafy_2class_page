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
    // 60문항 전체 객관식 4회차 모의고사 (토픽 1번 ~ 60번 1:1 대응)
    // 정답 분포: 0번(15개), 1번(15개), 2번(15개), 3번(15개) 완전 균등 분산 배치
    // =========================================================================
    {
      id: "mock4-001-regression-error",
      conceptId: "regression-error-term",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "단순 선형 회귀 모형의 오차항(ε)에 요구되는 고전적 통계 기본 가정으로 적절하지 않은 것은?",
      options: [
        "모든 관측치에 걸쳐 오차항의 기댓값은 0이어야 한다.",
        "오차항들 간의 자기공분산은 0으로 독립성을 만족해야 한다.",
        "오차항의 분산은 독립변수의 크기에 비례하여 증가해야 한다.",
        "오차항은 일정한 분산을 가지는 정규분포를 따라야 한다."
      ],
      answer: 2,
      explanation: "선형 회귀의 기본 오차항 가정은 정규성, 독립성, 등분산성입니다. 설명변수의 값과 무관하게 오차항의 분산은 일정해야 합니다.",
      hint: "독립변수 크기와 관계없이 오차 분산이 일정해야 하는 등분산성 가정을 생각해보세요."
    },
    {
      id: "mock4-002-kmeans-hierarchical",
      conceptId: "clustering-methods-comparison",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "비지도 군집화 알고리즘인 K-means와 계층적 군집화의 비교 설명으로 가장 적절한 것은?",
      options: [
        "K-means는 덴드로그램을 출력하고 계층적 군집은 중심점을 갱신한다.",
        "두 기법 모두 학습 전 목표 레이블을 필수로 지정해야 하는 지도학습이다.",
        "계층적 군집은 대용량에 적합하고 K-means는 소규모 데이터에만 쓰인다.",
        "K-means는 군집 수 K를 사전 설정하고 계층적 군집은 덴드로그램을 형성한다."
      ],
      answer: 3,
      explanation: "K-means는 사전에 K값을 정의해야 하는 분할 기반 군집화이고, 계층적 군집화는 단계별 병합을 통해 트리 구조인 덴드로그램을 생성합니다.",
      hint: "사전 군집 수 지정 필요 여부와 트리형 계층 구조의 명칭을 비교해보세요."
    },
    {
      id: "mock4-003-unsupervised-learning-cases",
      conceptId: "unsupervised-learning-applications",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "다음 중 별도의 정답 레이블(Target) 없이 데이터 내 패턴만을 활용하는 비지도학습 작업은?",
      options: [
        "스팸 라벨을 기반으로 수신 메일의 스팸 여부를 자동 분류한다.",
        "구매 이력 데이터를 바탕으로 성향이 유사한 고객 그룹을 세분화한다.",
        "과거 실거래가 데이터를 바탕으로 신축 아파트 매매가를 추정한다.",
        "환자의 혈액 검사 수치와 병력을 바탕으로 암 발병을 조기 진단한다."
      ],
      answer: 1,
      explanation: "고객 세분화(군집화) 및 차원 축소는 레이블 없이 데이터 자체의 유사도와 분포 특성을 파악하는 비지도학습입니다.",
      hint: "정답 라벨 없이 데이터 간 유사도만으로 그룹을 묶는 작업을 찾아보세요."
    },
    {
      id: "mock4-004-recall-calculation",
      conceptId: "recall-metric-calculation",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "실제 양성 환자 120명 중 모델이 90명을 양성으로 정확히 진단하고 30명을 음성으로 오진했을 때 재현율은?",
      options: [
        "75%",
        "60%",
        "50%",
        "25%"
      ],
      answer: 0,
      explanation: "재현율(Recall) = TP / (TP + FN) = 90 / (90 + 30) = 90 / 120 = 75% 입니다.",
      hint: "실제 양성 전체 수(120명) 중에서 모델이 찾아낸 양성(90명)의 비율을 구하세요."
    },
    {
      id: "mock4-005-regression-problem-definition",
      conceptId: "regression-vs-classification",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "다음 머신러닝 분석 과제 중 회귀(Regression) 문제에 해당하는 것은?",
      options: [
        "인물 사진을 보고 마스크 착용 여부를 판별한다.",
        "신용카드 승인 내역이 정상인지 부정 결제인지 판별한다.",
        "고객의 방문 지표를 바탕으로 이탈 위험군 여부를 판별한다.",
        "건물의 층수와 연식을 바탕으로 월간 전력 소비량을 예측한다."
      ],
      answer: 3,
      explanation: "회귀 문제는 전력 소비량, 가격 등 연속적인 수치(실수)를 예측하는 지도학습 과제입니다.",
      hint: "연속적인 수치를 맞히는 문제인지 범주형 라벨을 맞히는 문제인지 확인하세요."
    },
    {
      id: "mock4-006-learning-rate-convergence",
      conceptId: "learning-rate-effects",
      difficulty: "easy",
      category: "딥러닝 기본 원리",
      questionType: "multiple-choice",
      prompt: "경사하강법 학습 시 설정한 학습률(Learning Rate)이 너무 작을 때 발생하는 주요 현상은?",
      options: [
        "손실 함수가 극단적으로 진동하며 최솟값을 벗어나 발산한다.",
        "모든 신경망 가중치 행렬이 0으로 즉시 초기화된다.",
        "가중치 갱신 보폭이 지나치게 좁아 최적점 수렴에 오랜 시간이 걸린다.",
        "역전파 과정에서 연산 정밀도가 자동으로 단정밀도로 변경된다."
      ],
      answer: 2,
      explanation: "학습률이 지나치게 작으면 한 번에 이동하는 가중치 갱신량이 너무 적어 최적점에 도달하기까지 매우 많은 스텝이 소요됩니다.",
      hint: "보폭이 너무 좁을 때 학습 시간과 수렴 속도에 미치는 영향을 생각해보세요."
    },
    {
      id: "mock4-007-multicollinearity",
      conceptId: "multicollinearity-concept",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "다중 회귀 모형에서 설명변수들 간의 강한 선형적 상관성으로 인해 계수 추정의 분산이 커지는 현상은?",
      options: [
        "다중공선성",
        "과소적합",
        "기울기 소실",
        "차원의 저주"
      ],
      answer: 0,
      explanation: "독립변수들 사이에 강한 선형 상관관계가 존재하여 회귀계수 추정치의 신뢰성이 떨어지는 현상을 다중공선성이라고 합니다.",
      hint: "여러 독립변수 간의 상관관계로 인해 나타나는 통계적 문제입니다."
    },
    {
      id: "mock4-008-precision-calculation",
      conceptId: "precision-metric-calculation",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "모델이 스팸 메일로 분류한 60건 중 실제 스팸이 45건, 정상 메일이 15건일 때 정밀도는?",
      options: [
        "60%",
        "75%",
        "80%",
        "85%"
      ],
      answer: 1,
      explanation: "정밀도(Precision) = TP / (TP + FP) = 45 / (45 + 15) = 45 / 60 = 75% 입니다.",
      hint: "모델이 양성(스팸)으로 예측한 총량 중 실제 정답의 비율을 계산하세요."
    },
    {
      id: "mock4-009-classification-problem-definition",
      conceptId: "classification-definition",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "머신러닝에서 입력 데이터를 사전 정의된 이산적인 범주(Category) 중 하나로 배정하는 작업은?",
      options: [
        "회귀",
        "차원 축소",
        "보간",
        "분류"
      ],
      answer: 3,
      explanation: "이산적인 클래스 라벨(정상/불량, 동물 품종 등)을 판정하는 문제를 분류(Classification)라고 합니다.",
      hint: "정해진 범주나 그룹 중 하나를 선택하는 지도학습 유형입니다."
    },
    {
      id: "mock4-010-activation-function-role",
      conceptId: "non-linear-activation-role",
      difficulty: "easy",
      category: "딥러닝 기본 원리",
      questionType: "multiple-choice",
      prompt: "다층 퍼셉트론 신경망에서 비선형 활성화 함수를 계층 사이에 배치하는 근본적인 이유는?",
      options: [
        "선형 결합의 단순 누적을 깨고 복잡한 비선형 패턴을 학습하기 위해",
        "가중치 행렬의 부동소수점 비트 수를 줄여 압축하기 위해",
        "역전파에 소요되는 학습 데이터 수를 절반으로 줄이기 위해",
        "모든 은닉 노드의 출력값을 0으로 고정해 과적합을 막기 위해"
      ],
      answer: 0,
      explanation: "선형 레이어만 연속으로 쌓으면 결국 하나의 단일 선형 변환과 같아지므로, 복잡한 비선형 관계를 표현하기 위해 활성화 함수가 필수적입니다.",
      hint: "선형 변환의 중첩으로 인한 한계를 극복하고 모델 표현력을 확장하는 이유입니다."
    },
    {
      id: "mock4-011-rlhf-human-feedback",
      conceptId: "rlhf-core-objective",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "인간 피드백 기반 강화학습(RLHF)이 지향하는 핵심적인 정렬(Alignment) 목표는?",
      options: [
        "사전 학습 텍스트에서 단어 간의 문법 규칙만을 추출한다.",
        "인간의 선호를 반영한 보상을 통해 유용하고 안전한 답변을 유도한다.",
        "언어 모델의 전체 가중치를 1비트로 강제 양자화한다.",
        "외부 검색 엔진을 강제로 호출해 자연어 생성을 차단한다."
      ],
      answer: 1,
      explanation: "RLHF는 사람이 선호하는 응답에 높은 점수를 부여하는 보상 모델을 통해 언어 모델의 유용성, 진실성, 무해성을 강화합니다.",
      hint: "인간의 가치관과 선호도를 모델의 출력에 반영하는 정렬 기법입니다."
    },
    {
      id: "mock4-012-rlhf-training-steps",
      conceptId: "rlhf-step-by-step-pipeline",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "InstructGPT 계열 모델 구축에 사용된 RLHF의 3단계 학습 파이프라인 진행 순서로 옳은 것은?",
      options: [
        "보상 모델 학습 -> 지도 미세조정 -> 강화학습 정책 최적화",
        "강화학습 정책 최적화 -> 보상 모델 학습 -> 지도 미세조정",
        "지도 미세조정 -> 보상 모델 학습 -> 강화학습 정책 최적화",
        "지도 미세조정 -> 강화학습 정책 최적화 -> 보상 모델 학습"
      ],
      answer: 2,
      explanation: "RLHF는 1단계 SFT(지도 미세조정) -> 2단계 RM(보상 모델 학습) -> 3단계 PPO(강화학습 기반 정책 최적화)의 순서로 진행됩니다.",
      hint: "모범 응답 지도학습 후 보상 모델을 훈련하고 정책을 갱신하는 3단계 순서입니다."
    },
    {
      id: "mock4-013-gradient-descent-direction",
      conceptId: "gradient-descent-update-rule",
      difficulty: "easy",
      category: "딥러닝 기본 원리",
      questionType: "multiple-choice",
      prompt: "경사하강법에서 손실 함수를 최소화하기 위한 가중치 업데이트 방향 규칙으로 옳은 것은?",
      options: [
        "현재 가중치에 학습률과 기울기의 곱을 더한다.",
        "손실 함수의 2차 도함수 부호와 동일한 방향으로 이동한다.",
        "현재 가중치의 크기에 비례하여 양의 방향으로 이동한다.",
        "손실 함수의 기울기(Gradient)가 가리키는 반대 방향으로 이동한다."
      ],
      answer: 3,
      explanation: "경사하강법은 손실이 가장 가파르게 증가하는 방향인 기울기(Gradient)의 반대 방향(-Gradient)으로 파라미터를 갱신합니다.",
      hint: "경사면을 따라 아래로 내려가는 음의 방향을 생각해보세요."
    },
    {
      id: "mock4-014-one-hot-encoding-limits",
      conceptId: "one-hot-encoding-limitations",
      difficulty: "easy",
      category: "자연어 처리 및 임베딩",
      questionType: "multiple-choice",
      prompt: "텍스트 토큰을 원-핫 인코딩으로 변환할 때 나타나는 주요 구조적 문제점은?",
      options: [
        "어휘 수가 증가할수록 고차원 희소 벡터가 되며 의미 유사도를 표현하지 못한다.",
        "모든 단어 벡터 간의 내적이 1이 되어 단어 간 구분이 불가능해진다.",
        "단어 벡터의 차원이 지나치게 축소되어 산술 연산이 불가능해진다.",
        "모든 단어 값이 부동소수점으로 저장되어 연산 오버플로우를 유발한다."
      ],
      answer: 0,
      explanation: "원-핫 인코딩은 단어 간 직교성으로 인해 의미적 거리를 표현할 수 없고, 단어 수만큼 차원이 선형 증가하여 메모리가 낭비됩니다.",
      hint: "단어 간 의미적 유사도를 반영하지 못하고 차원이 거대해지는 한계입니다."
    },
    {
      id: "mock4-015-rnn-recurrent-structure",
      conceptId: "rnn-hidden-state-recurrence",
      difficulty: "easy",
      category: "자연어 처리 및 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "순환 신경망(RNN)이 이전 시점의 정보를 다음 시점으로 누적 전달하는 구조적 매개체는?",
      options: [
        "위치 인코딩 벡터",
        "은닉 상태 (Hidden State)",
        "어텐션 가중치 맵",
        "정수 스케일링 팩터"
      ],
      answer: 1,
      explanation: "RNN은 이전 시점까지의 문맥 정보를 요약한 은닉 상태(Hidden State)를 현재 시점의 입력과 함께 순환적으로 전달합니다.",
      hint: "이전 시점의 문맥을 압축하여 순환 전달하는 상태 벡터입니다."
    },
    {
      id: "mock4-016-1x1-conv-computation",
      conceptId: "1x1-convolution-multiplications",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "크기가 16×16이고 입력 채널이 8, 출력 채널이 16인 Feature Map에 1×1 Convolution을 적용할 때 곱셈 연산 횟수는?",
      options: [
        "8,192",
        "16,384",
        "24,576",
        "32,768"
      ],
      answer: 3,
      explanation: "1×1 Conv 곱셈 횟수 = 출력 높이 × 출력 너비 × 입력 채널 × 출력 채널 = 16 × 16 × 8 × 16 = 256 × 128 = 32,768 회 입니다.",
      hint: "16 * 16 * 8 * 16 을 계산하세요."
    },
    {
      id: "mock4-017-cnn-fc-params",
      conceptId: "cnn-fc-parameter-calculation",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "5×5 Conv(입력 채널 1, 출력 채널 16)와 FC 계층(입력 노드 50개, 출력 노드 10개)의 편향을 제외한 순수 가중치 수는?",
      options: [
        "Conv 400개 / FC 500개",
        "Conv 400개 / FC 250개",
        "Conv 200개 / FC 500개",
        "Conv 200개 / FC 250개"
      ],
      answer: 0,
      explanation: "Conv 파라미터 = (5 × 5 × 1) × 16 = 400개, FC 파라미터 = 50 × 10 = 500개 입니다.",
      hint: "Conv는 (5*5*1)*16, FC는 50*10을 각각 계산하세요."
    },
    {
      id: "mock4-018-sentence-embedding-cosine-sim",
      conceptId: "sentence-embedding-cosine-similarity",
      difficulty: "easy",
      category: "자연어 처리 및 임베딩",
      questionType: "multiple-choice",
      prompt: "밀집 문장 임베딩 공간에서 두 텍스트의 의미적 유사도를 측정하기 위해 두 벡터의 사잇각을 이용하는 지표는?",
      options: [
        "코사인 유사도",
        "해밍 거리",
        "역문서 빈도",
        "자카드 지수"
      ],
      answer: 0,
      explanation: "문장 임베딩 벡터 간의 의미적 유사성은 고차원 공간에서 두 벡터가 이루는 사잇각의 코사인 값을 계산하여 평가합니다.",
      hint: "두 벡터의 각도 코사인 값을 통해 방향 유사성을 측정하는 지표입니다."
    },
    {
      id: "mock4-019-text-foundation-model",
      conceptId: "text-foundation-model-concept",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "대규모 텍스트 코퍼스로 사전 학습되어 요약, 질의응답, 번역 등 다양한 작업의 기반이 되는 모델은?",
      options: [
        "단층 퍼셉트론 모델",
        "텍스트 파운데이션 모델",
        "규칙 기반 전문가 시스템",
        "하드웨어 산술 제산기"
      ],
      answer: 1,
      explanation: "방대한 텍스트로 사전 학습되어 범용 언어 능력을 갖추고 다양한 하위 태스크의 기초가 되는 모델을 텍스트 파운데이션 모델이라고 합니다.",
      hint: "다양한 하위 태스크의 기반(Foundation)이 되는 모델 명칭입니다."
    },
    {
      id: "mock4-020-llm-agent-characteristics",
      conceptId: "llm-agent-six-traits",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "AI Agent가 작업을 자율적으로 완수하기 위해 갖추어야 할 6대 핵심 특성에 해당하지 않는 것은?",
      options: [
        "인식 및 자율성",
        "기억 및 추론과 계획",
        "하드웨어 다이 식각",
        "동작과 도구 및 학습과 적응"
      ],
      answer: 2,
      explanation: "AI 에이전트의 6대 핵심 특성은 인식, 자율성, 동작(도구), 기억, 추론(계획), 학습(적응)입니다.",
      hint: "소프트웨어 에이전트의 지능적 동작 특성이 아닌 물리적 반도체 공정을 고르세요."
    },
    {
      id: "mock4-021-instruction-dataset-format",
      conceptId: "instruction-dataset-format",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "지시문 튜닝(Instruction-tuning)에 사용되는 데이터셋의 전형적인 3단 구성 요소는?",
      options: [
        "질문 - 선호 순위 - 보상 점수",
        "문서 원문 - 유사도 - 역색인",
        "이미지 픽셀 - 클래스 - 바운딩 박스",
        "명령 지시문 - 추가 입력 - 모범 응답"
      ],
      answer: 3,
      explanation: "인스트럭션 튜닝 데이터셋은 지시문(Instruction), 입력 문맥(Input), 모범 응답(Output)의 형태로 구성됩니다.",
      hint: "명령어와 추가 입력, 그리고 이상적인 정답 답변의 3요소입니다."
    },
    {
      id: "mock4-022-1x1-conv-channel-mixing",
      conceptId: "1x1-conv-channel-pooling",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "1×1 Convolution 연산이 피처맵에 미치는 주요 기하학적 특성으로 옳은 것은?",
      options: [
        "공간 해상도는 보존하면서 채널 축 방향으로 정보를 융합하고 차원을 조절한다.",
        "피처맵의 공간 해상도를 무조건 절반으로 다운샘플링한다.",
        "모든 픽셀 가중치를 0 또는 1의 이진수로 강제 변환한다.",
        "이미지의 회전 각도를 감지하여 원래 방향으로 역변환한다."
      ],
      answer: 0,
      explanation: "1×1 Conv는 가로·세로 크기는 유지한 채 채널 방향의 선형 결합을 통해 차원 축소/확장 및 채널 간 정보 융합을 수행합니다.",
      hint: "가로세로는 유지하고 채널 차원만 조절하는 특성입니다."
    },
    {
      id: "mock4-023-zero-shot-cot",
      conceptId: "zero-shot-cot-trigger-phrase",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "사전 예시를 제공하지 않고 유도 문구만을 입력하여 모델의 단계적 추론을 유도하는 프롬프팅 기법은?",
      options: [
        "Few-shot CoT",
        "Zero-shot CoT",
        "Zero-shot Prompting",
        "Self-consistency CoT"
      ],
      answer: 1,
      explanation: "Zero-shot CoT는 '단계별로 생각해 봅시다'와 같은 유도 문구를 통해 모델이 중간 추론 과정을 스스로 생성하도록 만듭니다.",
      hint: "예시 없이 단계별 사고를 유도하는 프롬프팅 방식입니다."
    },
    {
      id: "mock4-024-ai-vs-ai-agent",
      conceptId: "ai-vs-ai-agent-difference",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "단순 텍스트 생성 LLM과 비교할 때 'AI Agent'의 가장 결정적인 차이점은?",
      options: [
        "단순 LLM은 정수 연산만 지원하고 에이전트는 부동소수점만 지원한다.",
        "에이전트는 클라우드 환경에서만 동작하도록 제한된다.",
        "에이전트는 목표 완수를 위해 도구를 능동적으로 사용하고 환경과 상호작용한다.",
        "단순 LLM은 외부 검색이 가능하지만 에이전트는 검색 기능이 차단된다."
      ],
      answer: 2,
      explanation: "AI Agent는 수동적 텍스트 생성을 넘어 환경을 인식하고, 계획을 세우며, 도구를 실행해 작업을 자율적으로 완수합니다.",
      hint: "목표를 위해 능동적으로 도구를 쓰고 행동하는 차이점입니다."
    },
    {
      id: "mock4-025-quantization-features",
      conceptId: "quantization-basic-concept",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "딥러닝 모델 경량화 기술 중 양자화(Quantization)의 핵심 원리는 무엇입니까?",
      options: [
        "가중치나 활성화 값의 비트 정밀도를 낮춰 메모리와 연산 부하를 줄인다.",
        "중요도가 낮은 가중치 연결을 찾아내어 신경망에서 삭제한다.",
        "대형 모델의 출력 확률 분포를 소형 모델이 모방 학습한다.",
        "트랜스포머 레이어 사이에 새로운 어댑터 모듈을 삽입한다."
      ],
      answer: 0,
      explanation: "양자화는 FP32 등 고정밀도 실수를 INT8, INT4 등 저비트 정밀도로 변환하여 메모리와 연산량을 절감하는 기법입니다.",
      hint: "가중치의 표현 비트 수를 줄이는 경량화 기법입니다."
    },
    {
      id: "mock4-026-prompt-design-elements",
      conceptId: "prompt-design-structure",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "LLM이 사용자의 요구사항에 맞추어 정확하게 답변하도록 돕는 프롬프트 디자인 요소가 아닌 것은?",
      options: [
        "모델이 수행해야 할 구체적인 역할(Role) 부여",
        "결과물에 요구되는 출력 서식 및 제약 조건 명시",
        "해석의 여지가 다양한 모호한 추상적 지시문 사용",
        "작업 이해를 돕는 명확한 문맥(Context)과 예시 제공"
      ],
      answer: 2,
      explanation: "모호한 지시문은 모델의 환각과 무작위성을 증가시키므로, 명확한 역할, 제약조건, 문맥, 서식을 제공해야 합니다.",
      hint: "명확성과 구체성을 떨어뜨리는 지시 방식을 고르세요."
    },
    {
      id: "mock4-027-knowledge-distillation",
      conceptId: "knowledge-distillation-concept",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "지식 증류(Knowledge Distillation)의 기본적인 동작 메커니즘은?",
      options: [
        "중요도가 낮은 가중치를 0으로 초기화해 희소화한다.",
        "교사 모델이 출력하는 확률 분포 지식을 학생 모델이 모방하여 학습한다.",
        "모든 부동소수점 가중치를 8비트 정수로 양자화한다.",
        "학습 데이터셋의 전체 샘플 수를 강제로 축소한다."
      ],
      answer: 1,
      explanation: "지식 증류는 고성능 대형 모델(Teacher)의 지식을 경량 소형 모델(Student)이 모방하도록 손실 함수를 설계해 훈련합니다.",
      hint: "선생님 모델이 학생 모델에게 지식을 전달하는 구조입니다."
    },
    {
      id: "mock4-028-multimodal-video-generation",
      conceptId: "multimodal-video-generation-concept",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "텍스트 프롬프트나 정지 이미지를 조건으로 받아 연속된 비디오 프레임을 합성하는 모델은?",
      options: [
        "멀티모달 비디오 생성 모델",
        "정적 텍스트 분류 모델",
        "단일 이미지 분류 모델",
        "음성 신호 인식 모델"
      ],
      answer: 0,
      explanation: "텍스트나 이미지를 바탕으로 시공간적 일관성을 갖춘 동영상을 생성하는 인공지능을 멀티모달 비디오 생성 모델이라고 합니다.",
      hint: "텍스트나 이미지를 입력으로 비디오를 만들어내는 생성 모델입니다."
    },
    {
      id: "mock4-029-cbow-vs-skipgram",
      conceptId: "word2vec-cbow-vs-skipgram",
      difficulty: "easy",
      category: "자연어 처리 및 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec 모델의 CBOW 방식과 Skip-gram 방식의 예측 방향 비교로 옳은 것은?",
      options: [
        "CBOW는 중심 단어로 주변을 예측하고, Skip-gram은 문장 감정을 분류한다.",
        "두 방식 모두 단어 순서를 100% 보존하는 순환 신경망 계열이다.",
        "CBOW는 주변 단어로 중심을 예측하고, Skip-gram은 중심으로 주변을 예측한다.",
        "Skip-gram은 단어 빈도만 계산하고 임베딩 벡터를 생성하지 않는다."
      ],
      answer: 2,
      explanation: "CBOW는 주변 문맥 단어들로 중심 단어를 맞히고, Skip-gram은 중심 단어로부터 주변 문맥 단어들을 예측하도록 학습합니다.",
      hint: "주변->중심과 중심->주변의 방향 차이입니다."
    },
    {
      id: "mock4-030-rnn-vanishing-gradient",
      conceptId: "rnn-vanishing-gradient-problem",
      difficulty: "easy",
      category: "자연어 처리 및 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "기본 RNN에서 시퀀스가 길어질 때 시간 축 역전파 과정에서 기울기가 소실되는 주된 이유는?",
      options: [
        "셀 상태 통로가 너무 넓어져 정보가 흩어지기 때문에",
        "시간 축을 거슬러 올라가며 가중치 행렬이 연속으로 거듭 곱해지기 때문에",
        "순환 연결이 없어 단순 피드포워드 연산만 수행되기 때문에",
        "모든 활성화 함수가 선형 항등 함수로 자동 고정되기 때문에"
      ],
      answer: 1,
      explanation: "시간 역전파(BPTT) 수행 시 가중치가 시점 수만큼 반복 곱해지며 그래디언트가 지수적으로 감소하여 장기 기억이 유실됩니다.",
      hint: "시간 역전파 과정에서 가중치 곱셈이 누적되며 발생하는 현상입니다."
    },
    {
      id: "mock4-031-lstm-state-structure",
      conceptId: "lstm-cell-state-gates",
      difficulty: "easy",
      category: "자연어 처리 및 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "LSTM이 RNN의 장기 의존성 한계를 극복하기 위해 은닉 상태와 함께 유지하는 전용 기억 통로는?",
      options: [
        "어텐션 맵 (Attention Map)",
        "위치 벡터 (Position Vector)",
        "소프트맥스 레이어 (Softmax Layer)",
        "셀 상태 (Cell State)"
      ],
      answer: 3,
      explanation: "LSTM은 은닉 상태 외에 시퀀스 전체를 관통하는 셀 상태(Cell State)와 게이트를 도입하여 장기 정보를 보존합니다.",
      hint: "컨베이어 벨트처럼 장기 정보를 흘려보내는 셀 상태를 생각해보세요."
    },
    {
      id: "mock4-032-pretrain-vs-finetune",
      conceptId: "pretraining-vs-finetuning-concepts",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "파운데이션 모델의 사전학습(Pre-training)과 파인튜닝(Fine-tuning)의 차이점으로 올바른 것은?",
      options: [
        "사전학습은 비라벨 데이터로 일반 지식을 배우고, 파인튜닝은 특정 작업에 적응시킨다.",
        "사전학습은 특정 작업에 맞추고, 파인튜닝은 일반 언어 규칙을 학습한다.",
        "사전학습을 마치면 파라미터가 영구 동결되어 추가 파인튜닝이 불가능하다.",
        "파인튜닝은 사전학습보다 항상 100배 이상의 연산 비용이 소모된다."
      ],
      answer: 0,
      explanation: "사전학습은 대규모 비라벨 코퍼스로 범용 언어 지식을 습득하고, 파인튜닝은 목표 작업 데이터로 모델을 미세조정합니다.",
      hint: "일반 언어 지식 습득과 특정 작업 적응의 차이입니다."
    },
    {
      id: "mock4-033-max-pooling",
      conceptId: "max-pooling-downsampling",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "합성곱 신경망에서 Max Pooling 연산이 수행하는 핵심 동작은?",
      options: [
        "윈도우 영역의 평균값을 구해 피처맵 채널을 늘린다.",
        "피처맵의 모든 픽셀 값을 0과 1 사이로 정규화한다.",
        "윈도우 영역의 최댓값을 추출하여 피처맵 공간 해상도를 축소한다.",
        "가중치 파라미터 수를 2배로 늘려 모델 표현력을 확장한다."
      ],
      answer: 2,
      explanation: "Max Pooling은 특정 영역 내에서 가장 큰 값만 선택해 피처맵의 공간 크기를 줄이고 주요 특징을 보존합니다.",
      hint: "영역 내 가장 강한 신호(최댓값)를 뽑아 피처맵을 줄이는 연산입니다."
    },
    {
      id: "mock4-034-cnn-receptive-field",
      conceptId: "cnn-receptive-field-concept",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "CNN에서 특정 출력 계층 뉴런이 참조하고 반응하는 입력 이미지의 유효 공간 범위를 일컫는 용어는?",
      options: [
        "수용 영역 (Receptive Field)",
        "잠재 공간 (Latent Space)",
        "문맥 윈도우 (Context Window)",
        "임베딩 차원 (Embedding Dimension)"
      ],
      answer: 0,
      explanation: "출력 뉴런 하나가 영향을 받는 입력 이미지 상의 공간적 크기를 수용 영역(Receptive Field)이라고 합니다.",
      hint: "입력 데이터를 수용하여 바라보는 시야 영역의 명칭입니다."
    },
    {
      id: "mock4-035-feature-map-memory",
      conceptId: "feature-map-memory-calculation",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "128×128 크기에 채널 수가 8개인 Feature Map 1개를 FP32(4바이트) 정밀도로 저장할 때 필요한 메모리는?",
      options: [
        "128 KB",
        "256 KB",
        "512 KB",
        "1,024 KB"
      ],
      answer: 2,
      explanation: "128 × 128 × 8 = 131,072개 요소이며, 131,072 × 4Byte = 524,288Byte = 512KB 입니다.",
      hint: "128 * 128 * 8 * 4 Byte 를 계산하여 KB로 환산하세요."
    },
    {
      id: "mock4-036-foundation-model-service-dev",
      conceptId: "foundation-model-application-dev",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "파운데이션 모델을 활용하여 실무 AI 서비스를 효율적으로 개발하는 표준 전략은?",
      options: [
        "기반 모델을 처음부터 독자적으로 사전학습시키는 데만 집중한다.",
        "모든 외부 연결을 차단하고 폐쇄형 단일 텍스트 모델만 배포한다.",
        "기존 기반 모델에 프롬프트, 검색 증강 생성, 외부 도구 연동을 결합한다.",
        "라벨 없는 데이터는 배제하고 규칙 기반 전문가 엔진만 구현한다."
      ],
      answer: 2,
      explanation: "검증된 파운데이션 모델 위에 프롬프트 엔지니어링, RAG(검색증강생성), 도구 호출을 결합하는 것이 가장 효율적입니다.",
      hint: "기반 모델 위에 검색 증강 생성과 도구를 결합하는 서비스 개발 방식을 떠올려보세요."
    },
    {
      id: "mock4-037-vlm-training-procedure",
      conceptId: "vlm-training-alignment-procedure",
      difficulty: "easy",
      category: "멀티모달 및 VLM",
      questionType: "multiple-choice",
      prompt: "비전언어모델(VLM)이 시각과 언어를 통합 이해하도록 학습시키는 기본 방법은?",
      options: [
        "이미지 픽셀을 숫자로만 변환해 텍스트 모델 없이 학습한다.",
        "언어 모델 없이 비전 인코더만을 단독으로 미세조정한다.",
        "이미지 정보를 완전히 제거하고 텍스트 데이터셋만 반복 학습한다.",
        "비전 인코더와 언어 모델 사이에 프로젝터를 두어 시각-언어 공간을 정렬한다."
      ],
      answer: 3,
      explanation: "VLM은 사전학습된 이미지 인코더와 언어 모델 사이에 프로젝터를 배치하여 시각 임베딩을 텍스트 임베딩 공간과 정렬합니다.",
      hint: "비전 인코더와 언어 모델을 연결하여 시각-언어를 정렬하는 구조입니다."
    },
    {
      id: "mock4-038-document-understanding-vlm",
      conceptId: "doc-vlm-layout-text-understanding",
      difficulty: "easy",
      category: "멀티모달 및 VLM",
      questionType: "multiple-choice",
      prompt: "송장, 영수증, 표 문서를 판독하는 문서 이해 VLM의 고유한 인식 특징은?",
      options: [
        "텍스트 내용뿐 아니라 표 구조와 2차원 시각적 레이아웃 배치를 함께 파악한다.",
        "시각적 레이아웃 정보는 버리고 텍스트 순서만 1차원으로 읽어들인다.",
        "모든 문서 이미지를 음성 신호로 변환한 후 단어 빈도수만 계산한다.",
        "표에 포함된 숫자를 0으로 치환하여 언어 모델 연산을 단순화한다."
      ],
      answer: 0,
      explanation: "문서 이해 VLM은 문서 내 텍스트뿐만 아니라 표의 행렬 구조, 텍스트의 2차원 공간 배치(Layout)를 함께 분석합니다.",
      hint: "시각적 레이아웃과 텍스트를 동시에 이해하는 능력입니다."
    },
    {
      id: "mock4-039-small-vlm",
      conceptId: "small-vlm-on-device-benefits",
      difficulty: "easy",
      category: "멀티모달 및 VLM",
      questionType: "multiple-choice",
      prompt: "소형 비전언어모델(Small VLM)이 모바일 및 온디바이스 환경에서 갖는 주된 장점은?",
      options: [
        "초대형 클라우드 VLM보다 항상 100배 많은 사전학습 데이터를 요구한다.",
        "적은 파라미터로 엣지 기기에서 낮은 지연시간으로 효율적인 멀티모달 추론이 가능하다.",
        "모든 입력 이미지의 해상도를 1×1 픽셀로 압축하여 처리한다.",
        "텍스트 입력을 처리하지 못하고 단순 이미지 파일 복사만 수행한다."
      ],
      answer: 1,
      explanation: "Small VLM은 파라미터 크기를 줄여 스마트폰이나 로봇 등 자원이 제한된 엣지 기기에서도 낮은 지연시간으로 구동됩니다.",
      hint: "제한된 디바이스 자원에서 빠른 멀티모달 처리를 지원하는 이점입니다."
    },
    {
      id: "mock4-040-rag-system-definition",
      conceptId: "rag-definition-retrieval-generation",
      difficulty: "easy",
      category: "검색증강 생성 (RAG)",
      questionType: "multiple-choice",
      prompt: "검색증강 생성(RAG) 아키텍처의 기본적인 동작 순서로 옳은 것은?",
      options: [
        "사용자 질의 입력 -> 외부 관련 문서 검색 -> 검색 문서를 프롬프트 컨텍스트에 추가 -> LLM 답변 생성",
        "사용자 질의 입력 -> LLM 가중치 전체 재학습 -> 모델 파라미터 갱신 -> 답변 생성",
        "외부 문서 전체 삭제 -> 지식 그래프 노드 집계 -> 단순 확률 기반 텍스트 출력",
        "사용자 질의 입력 -> 모든 파라미터 0으로 초기화 -> 임의 텍스트 무작위 출력"
      ],
      answer: 0,
      explanation: "RAG는 사용자 질문에 맞는 관련 문서를 외부 저장소에서 검색(Retrieve)한 후, 이를 컨텍스트로 결합하여 LLM이 생성(Generate)합니다.",
      hint: "외부 지식을 검색하여 언어 모델에 전달하는 방식입니다."
    },
    {
      id: "mock4-041-llm-as-a-judge-bias",
      conceptId: "llm-as-judge-evaluation-biases",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "LLM을 평가 모델(LLM-as-a-Judge)로 활용할 때 내용과 무관하게 발생하는 평가 편향 사례는?",
      options: [
        "모든 평가 대상 답변에 대해 완벽한 만점을 균일하게 부여하는 편향",
        "답변의 내용이 부실해도 길이가 길거나 먼저 제시된 답변을 더 선호하는 편향",
        "문법 오류를 감지하면 모델의 파라미터를 강제로 초기화하는 편향",
        "외부 검색 출처 링크가 없을 때만 무조건 최고점을 부여하는 편향"
      ],
      answer: 1,
      explanation: "LLM-as-a-Judge는 답변의 길이가 길면 고득점을 주는 길이 편향(Verbosity Bias)이나 먼저 제시된 답변을 선호하는 위치 편향이 나타날 수 있습니다.",
      hint: "답변의 길이나 제시 순서 등에 따라 평가가 왜곡되는 현상을 생각해보세요."
    },
    {
      id: "mock4-042-single-task-finetuning-risk",
      conceptId: "single-task-finetuning-catastrophic-forgetting",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "파운데이션 모델을 단일 작업 데이터로만 과도하게 파인튜닝할 때 발생하는 치명적 망각(Catastrophic Forgetting) 현상은?",
      options: [
        "이전에 사전학습되었던 범용 언어 지식과 추론 능력을 잃어버린다.",
        "모델의 모든 가중치 행렬이 자동으로 역색인 테이블로 변환된다.",
        "추론 과정에서 발생하는 행렬 곱셈 연산량이 0으로 줄어든다.",
        "새로운 평가 데이터에 대한 예측 정확도가 항상 100%로 고정된다."
      ],
      answer: 0,
      explanation: "단일 좁은 도메인에 과도하게 미세조정하면 모델이 사전학습 단계에서 배웠던 범용적 추론 및 언어 이해 능력을 상실하게 됩니다.",
      hint: "단일 작업에 치우치면서 기존 범용 지식을 잃어버리는 현상입니다."
    },
    {
      id: "mock4-043-regression-coefficient-interpretation",
      conceptId: "regression-coefficient-interpretation-meaning",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "다중 선형 회귀식 Y = 100 + 4*X1 - 2*X2 에서 계수 4의 올바른 통계적 해석은?",
      options: [
        "X1이 1 증가하면 X2가 항상 4 증가한다는 뜻이다.",
        "X2가 고정되어 있을 때 X1이 1단위 증가하면 Y의 기댓값이 평균 4만큼 증가한다.",
        "X1과 X2의 단순 피어슨 상관계수가 정확히 4라는 뜻이다.",
        "X1이 4단위 증가할 때 Y는 항상 1단위 증가한다는 뜻이다."
      ],
      answer: 1,
      explanation: "다중 회귀계수 4는 다른 설명변수(X2)가 일정할 때 X1이 1단위 증가함에 따라 종속변수 Y의 평균적인 변화량을 나타냅니다.",
      hint: "다른 변수가 고정된 조건에서 X1이 1단위 증가할 때 Y의 평균 변화량입니다."
    },
    {
      id: "mock4-044-tool-learning-concept",
      conceptId: "tool-learning-agent-paradigm",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "언어 모델이 고정된 파라미터의 한계를 넘어 최신 정보 검색, 계산, 외부 API 호출을 수행하도록 훈련하는 기법은?",
      options: [
        "비라벨 사전학습",
        "단어 토큰 풀링",
        "역색인 테이블 구축",
        "도구 학습 (Tool Learning)"
      ],
      answer: 3,
      explanation: "언어 모델이 외부 소프트웨어 도구(검색, 계산기, API 등)를 스스로 판단하여 호출하고 결과를 반영하도록 하는 것을 도구 학습이라고 합니다.",
      hint: "외부 도구를 활용하는 방법을 학습하는 패러다임입니다."
    },
    {
      id: "mock4-045-multi-agent-system",
      conceptId: "multi-agent-system-framework",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "다양한 역할을 분담한 여러 AI 에이전트들이 상호작용하며 복잡한 문제를 해결하는 체계는?",
      options: [
        "단일 퍼셉트론 회귀기",
        "단일 에이전트 시스템",
        "다중 에이전트 시스템",
        "지식 증류 시스템"
      ],
      answer: 2,
      explanation: "여러 전문 에이전트가 통신 프로토콜을 통해 협력하거나 검토하며 집단 지성을 발휘하는 시스템을 다중 에이전트 시스템이라고 합니다.",
      hint: "여러 에이전트들이 상호작용하는 다중 에이전트 구조입니다."
    },
    {
      id: "mock4-046-finetuning-vs-instruction-tuning",
      conceptId: "finetuning-vs-instruction-tuning-difference",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "일반 단일 작업 파인튜닝과 비교할 때 인스트럭션 튜닝(Instruction-tuning)의 주요 특징은?",
      options: [
        "모델의 가중치를 정수 형태로 변환하여 연산만을 가속한다.",
        "다양한 형식의 지시문-응답 쌍을 학습하여 새로운 명령에 대한 추종 능력을 기른다.",
        "불필요한 신경망 연결을 제거하여 모델 크기를 절반으로 줄인다.",
        "외부 문서를 검색하여 질의에 대한 출처 링크만을 생성한다."
      ],
      answer: 1,
      explanation: "인스트럭션 튜닝은 다양한 작업의 (지시문, 응답) 쌍을 지도학습시켜 모델이 처음 보는 명령 지시문도 잘 따르도록 일반화하는 기법입니다.",
      hint: "지시문을 따르는 일반화 능력을 기르는 학습 방식입니다."
    },
    {
      id: "mock4-047-rlhf-pipeline-flow",
      conceptId: "rlhf-pipeline-order-check",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "RLHF 파이프라인에서 '보상 모델(Reward Model)'을 학습시킬 때 투입되는 데이터 형태는?",
      options: [
        "동일 질문에 대해 생성된 모델 응답 후보들 간의 선호도 순위 비교 데이터",
        "비라벨 텍스트의 다음 단어 정답 토큰 데이터",
        "수학 문제의 컴파일 오류 로그 바이너리 데이터",
        "웹 검색 엔진의 소스 코드 데이터"
      ],
      answer: 0,
      explanation: "보상 모델은 동일한 프롬프트에 대한 여러 답변 후보 중 사람이 어떤 답변을 더 선호하는지 매긴 순위 비교 데이터를 학습합니다.",
      hint: "답변 후보들의 선호 순위를 매긴 비교 데이터입니다."
    },
    {
      id: "mock4-048-few-shot-cot",
      conceptId: "few-shot-cot-prompting",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "프롬프트 내에 문제와 정답뿐만 아니라 '단계별 중간 사고 과정'이 포함된 소수의 예시를 제공하는 기법은?",
      options: [
        "Zero-shot CoT",
        "학습 후 양자화",
        "Few-shot CoT",
        "지식 증류"
      ],
      answer: 2,
      explanation: "Few-shot CoT는 문제 풀이의 중간 논리 전개 과정이 담긴 몇 개의 예시를 프롬프트에 포함하여 복잡한 추론을 유도하는 기법입니다.",
      hint: "단계별 풀이 예시를 소수 제공하는 프롬프팅 기법입니다."
    },
    {
      id: "mock4-049-edge-compression-strategy",
      conceptId: "edge-deployment-quantization-strategy",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "메모리와 연산 능력이 제한된 모바일 및 엣지 디바이스에 대형 AI 모델을 배포할 때 가장 적절한 전략은?",
      options: [
        "모델의 파라미터 크기를 계속 증가시킨다.",
        "모든 연산 정밀도를 64비트 실수로 변경한다.",
        "추론할 때마다 모델을 처음부터 재학습한다.",
        "양자화 등을 적용해 모델 크기와 연산량을 줄여 배포한다."
      ],
      answer: 3,
      explanation: "자원이 제한된 온디바이스 환경에서는 양자화(Quantization) 등을 통해 모델을 경량화하여 지연 시간과 전력 소모를 줄여야 합니다.",
      hint: "제한된 디바이스 자원에 맞게 모델 크기를 줄이는 기법을 선택하세요."
    },
    {
      id: "mock4-050-qlora-low-bit-quantization",
      conceptId: "qlora-quantization-bit-width",
      difficulty: "easy",
      category: "모델 경량화 및 파인튜닝",
      questionType: "multiple-choice",
      prompt: "신경망 모델에 저비트 양자화(Low-bit Quantization)를 적용했을 때 일반적으로 기대할 수 있는 효과는?",
      options: [
        "모델의 파라미터 수가 자동으로 증가한다.",
        "학습 데이터의 개수가 자동으로 감소한다.",
        "가중치 표현 비트 수가 줄어 메모리와 연산 비용이 절감된다.",
        "모든 경우에 모델 정확도가 반드시 향상된다."
      ],
      answer: 2,
      explanation: "저비트 양자화는 가중치와 활성화의 비트 폭을 줄여 메모리 대역폭 요구량과 연산 비용을 대폭 줄여줍니다.",
      hint: "표현 비트 수가 감소할 때 하드웨어 자원 소모에 미치는 영향을 생각해보세요."
    },
    {
      id: "mock4-051-distillation-teacher-student-mc",
      conceptId: "distillation-teacher-student-roles",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "지식 증류(Knowledge Distillation)에서 지식을 전달하는 대형 모델과 이를 전수받는 소형 모델의 역할 명칭은?",
      options: [
        "인코더 모델 - 디코더 모델",
        "교사 모델 - 학생 모델",
        "액터 모델 - 크리틱 모델",
        "라우터 모델 - 에이전트 모델"
      ],
      answer: 1,
      explanation: "지식 증류는 대형 교사 모델(Teacher)의 지식을 작고 가벼운 학생 모델(Student)이 모방하도록 학습시키는 구조입니다.",
      hint: "교사와 학생의 역할을 떠올려보세요."
    },
    {
      id: "mock4-052-model-compression-tradeoff-mc",
      conceptId: "compression-accuracy-tradeoff-concept",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "인공지능 모델에 강한 수준의 압축과 경량화를 적용할 때 감수해야 하는 일반적인 트레이드오프는?",
      options: [
        "연산 효율이 개선되는 대신 모델의 예측 정확도가 일부 저하될 수 있다.",
        "학습에 필요한 데이터 요구량이 0으로 줄어든다.",
        "파라미터 파일의 디스크 저장 용량이 10배 증가한다.",
        "하드웨어 전력 소모량이 원래보다 항상 증가한다."
      ],
      answer: 0,
      explanation: "모델을 강하게 압축할수록 속도와 메모리 효율은 높아지지만 모델의 표현력 손실로 인해 예측 정확도가 저하될 수 있습니다.",
      hint: "압축률과 정확도 사이의 균형 관계를 생각해보세요."
    },
    {
      id: "mock4-053-ood-adaptive-sensing-mc",
      conceptId: "ood-adaptive-sensing-concept",
      difficulty: "easy",
      category: "적응적 센싱 및 모델 설계",
      questionType: "multiple-choice",
      prompt: "학습 데이터와 다른 OOD(분포 밖) 환경에서 모델의 입력 품질을 개선하기 위한 적응적 센싱의 접근법은?",
      options: [
        "모델의 입력값을 항상 동일한 상수로 고정한다.",
        "모든 외부 센서의 연결을 완전히 비활성화한다.",
        "사전 학습 데이터셋을 모두 영구 삭제한다.",
        "주변 환경에 맞춰 카메라 등 센서 설정을 능동적으로 조절한다."
      ],
      answer: 3,
      explanation: "적응적 센싱은 환경 변화에 맞춰 하드웨어 센서 파라미터(노출, 셔터스피드 등)를 조절하여 모델이 인식하기 좋은 양질의 데이터를 취득합니다.",
      hint: "환경에 맞추어 센서를 조절하는 적응적 센싱 기법입니다."
    },
    {
      id: "mock4-054-physical-ai-characteristics-mc",
      conceptId: "physical-ai-scaling-comparison",
      difficulty: "easy",
      category: "적응적 센싱 및 모델 설계",
      questionType: "multiple-choice",
      prompt: "AI 스케일링(Scaling)과 피지컬 AI(Physical AI)의 개념을 바르게 비교한 것은?",
      options: [
        "스케일링은 센서 제어를 뜻하고, Physical AI는 모델 압축을 뜻한다.",
        "스케일링은 모델 경량화를 뜻하고, Physical AI는 텍스트 생성을 뜻한다.",
        "스케일링은 자원 규모 확대이고, Physical AI는 실제 환경의 인식·행동이다.",
        "두 개념 모두 모델의 파라미터 크기를 줄이는 경량화 방법이다."
      ],
      answer: 2,
      explanation: "Scaling은 모델·데이터·컴퓨팅 규모 확대를 통한 성능 향상 전략이며, Physical AI는 실제 물리 환경에서 센싱하고 물리적 행동을 실행하는 인공지능입니다.",
      hint: "규모를 키우는 법칙과 물리 세계에서 행동하는 AI의 차이입니다."
    },
    {
      id: "mock4-055-cnn-inductive-bias-mc",
      conceptId: "cnn-spatial-locality-bias",
      difficulty: "easy",
      category: "컴퓨터 비전 및 도메인 지식",
      questionType: "multiple-choice",
      prompt: "합성곱 신경망(CNN)이 이미지 처리에 효과적인 이유 중 가까운 픽셀끼리 밀접한 관계를 가진다는 귀납 편향은?",
      options: [
        "시간적 불변성",
        "공간적 지역성 (Spatial Locality)",
        "채널 독립성",
        "완전 연결성"
      ],
      answer: 1,
      explanation: "CNN은 인접한 픽셀들 간의 상관관계가 높다는 공간적 지역성(Spatial Locality)의 귀납 편향을 합성곱 커널 구조에 반영합니다.",
      hint: "가까운 위치의 픽셀들을 묶어서 보는 특성입니다."
    },
    {
      id: "mock4-056-vit-positional-embedding-mc",
      conceptId: "vit-positional-embedding-role",
      difficulty: "easy",
      category: "컴퓨터 비전 및 도메인 지식",
      questionType: "multiple-choice",
      prompt: "비전 트랜스포머(ViT)에서 이미지 패치 시퀀스에 공간적 위치 순서 정보를 부여하기 위해 더해주는 벡터는?",
      options: [
        "위치 임베딩 (Positional Embedding)",
        "어파인 스케일",
        "바이어스 상수",
        "소프트맥스 가중치"
      ],
      answer: 0,
      explanation: "트랜스포머는 입력 순서 정보를 자체적으로 알지 못하므로, 분할된 패치 벡터에 2차원 위치 정보를 보존하기 위해 위치 임베딩을 더합니다.",
      hint: "패치의 공간 위치를 모델에 알려주는 임베딩입니다."
    },
    {
      id: "mock4-057-agent-action-loop-mc",
      conceptId: "ai-agent-action-loop-mc",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "AI Agent가 외부 환경과 자율적으로 상호작용하며 문제를 해결하는 핵심 루프 단계는?",
      options: [
        "컴파일 -> 링크 -> 로드 -> 디버그",
        "양자화 -> 가지치기 -> 지식증류 -> 튜닝",
        "지각(Perception) -> 계획(Planning) -> 행동(Action) -> 피드백(Feedback)",
        "사전학습 -> 어휘분리 -> 역색인 -> 임베딩"
      ],
      answer: 2,
      explanation: "AI 에이전트는 환경을 인식(지각)하고, 계획을 세우며, 도구를 통해 행동하고, 환경의 결과를 피드백받아 다음 결정을 내리는 순환 루프로 동작합니다.",
      hint: "인식하고 계획하여 행동하고 피드백을 받는 순환 흐름입니다."
    },
    {
      id: "mock4-058-distribution-shift-mc",
      conceptId: "distribution-shift-concept-mc",
      difficulty: "easy",
      category: "적응적 센싱 및 모델 설계",
      questionType: "multiple-choice",
      prompt: "인공지능 모델 배포 환경에서 발생하는 '분포 이동(Distribution Shift)'의 의미는?",
      options: [
        "하드웨어 온도가 변하는 현상",
        "손실값이 0에 도달하는 현상",
        "가중치 정밀도가 변하는 현상",
        "학습·배포 데이터의 분포가 달라지는 현상"
      ],
      answer: 3,
      explanation: "분포 이동은 모델이 학습할 때 경험한 데이터의 통계적 분포와 실제 배포 환경에서 들어오는 입력 데이터의 분포가 달라져 성능이 저하되는 현상입니다.",
      hint: "학습 데이터 환경과 실제 테스트 환경의 통계적 차이입니다."
    },
    {
      id: "mock4-059-agent-tool-use-purpose-mc",
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
      id: "mock4-060-domain-specific-ai-mc",
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