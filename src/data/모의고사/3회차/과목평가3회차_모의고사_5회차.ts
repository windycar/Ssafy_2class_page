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
    // 60문항 전체 객관식 5회차 모의고사 (토픽 1번 ~ 60번 1:1 대응)
    // 정답 분포: 0번(15개), 1번(15개), 2번(15개), 3번(15개) 완전 균등 배치
    // 4회차와 동일 번호 정답 위치 0개 / citation 태그 없음
    // =========================================================================
    {
      id: "mock5-001-regression-error-term",
      conceptId: "regression-error-term",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "선형 회귀에서 어떤 구간에서는 오차가 작고 다른 구간에서는 오차가 크게 퍼지는 현상은 어떤 기본 가정을 위반한 것인가?",
      options: [
        "등분산성",
        "독립성",
        "선형성",
        "다중공선성"
      ],
      answer: 0,
      explanation: "오차의 분산이 설명변수 값에 따라 달라지는 것은 등분산성 가정 위반입니다.",
      hint: "오차의 퍼짐 정도가 일정해야 한다는 가정을 떠올려보세요."
    },
    {
      id: "mock5-002-clustering-methods-comparison",
      conceptId: "clustering-methods-comparison",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "군집 수를 미리 정하지 않고 데이터가 묶이는 과정을 트리 형태로 확인하고 싶을 때 더 적절한 방법은?",
      options: [
        "계층적 군집화",
        "K-means",
        "로지스틱 회귀",
        "선형 회귀"
      ],
      answer: 0,
      explanation: "계층적 군집화는 병합 또는 분할 과정을 덴드로그램으로 표현할 수 있습니다.",
      hint: "덴드로그램을 만드는 군집화 방법을 고르세요."
    },
    {
      id: "mock5-003-unsupervised-learning-applications",
      conceptId: "unsupervised-learning-applications",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "정답 라벨이 없는 음악 청취 기록만으로 취향이 비슷한 사용자들을 여러 그룹으로 나누려 한다. 이 문제의 학습 유형은?",
      options: [
        "지도학습",
        "강화학습",
        "전이학습",
        "비지도학습"
      ],
      answer: 3,
      explanation: "정답 라벨 없이 데이터의 유사성으로 그룹을 찾는 군집화는 비지도학습입니다.",
      hint: "라벨 없이 비슷한 데이터끼리 묶는 경우입니다."
    },
    {
      id: "mock5-004-recall-metric-calculation",
      conceptId: "recall-metric-calculation",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "실제 사기 거래가 40건이고 모델이 그중 30건을 사기로 찾아냈다면 재현율은?",
      options: [
        "25%",
        "60%",
        "80%",
        "75%"
      ],
      answer: 3,
      explanation: "재현율은 TP/(TP+FN)이므로 30/40=0.75, 즉 75%입니다.",
      hint: "실제 양성 전체 중 찾아낸 양성의 비율입니다."
    },
    {
      id: "mock5-005-regression-vs-classification",
      conceptId: "regression-vs-classification",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "다음 중 회귀 모델이 가장 적합한 예측 대상은?",
      options: [
        "사진의 고양이 여부",
        "내일의 평균 기온",
        "고객의 이탈 여부",
        "메일의 스팸 여부"
      ],
      answer: 1,
      explanation: "회귀는 연속적인 수치값을 예측하는 문제에 사용됩니다.",
      hint: "결과가 연속적인 숫자인 항목을 고르세요."
    },
    {
      id: "mock5-006-learning-rate-effects",
      conceptId: "learning-rate-effects",
      difficulty: "easy",
      category: "딥러닝 기본 원리",
      questionType: "multiple-choice",
      prompt: "학습 초반 손실이 줄다가 반복해서 최솟값 주변을 크게 오가며 안정되지 않는다. 가장 먼저 의심할 설정은?",
      options: [
        "학습률이 너무 작음",
        "학습률이 너무 큼",
        "배치 크기가 1임",
        "입력 차원이 작음"
      ],
      answer: 1,
      explanation: "학습률이 너무 크면 최적점을 지나치며 손실이 진동하거나 발산할 수 있습니다.",
      hint: "가중치 갱신 보폭이 지나치게 큰 상황입니다."
    },
    {
      id: "mock5-007-multicollinearity-concept",
      conceptId: "multicollinearity-concept",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "주택 가격 회귀에서 '면적(㎡)'과 '면적(평)'처럼 거의 같은 정보를 주는 변수를 동시에 넣었을 때 우려되는 문제는?",
      options: [
        "과적합",
        "경사 폭주",
        "다중공선성",
        "표본 편향"
      ],
      answer: 2,
      explanation: "서로 강하게 상관된 독립변수는 회귀계수 추정을 불안정하게 만들어 다중공선성을 유발할 수 있습니다.",
      hint: "독립변수끼리 너무 비슷한 정보를 주는 경우입니다."
    },
    {
      id: "mock5-008-precision-metric-calculation",
      conceptId: "precision-metric-calculation",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "모델이 불량이라고 예측한 제품이 25개이고 그중 실제 불량이 20개라면 정밀도는?",
      options: [
        "80%",
        "20%",
        "60%",
        "75%"
      ],
      answer: 0,
      explanation: "정밀도는 TP/(TP+FP)이므로 20/25=0.8, 즉 80%입니다.",
      hint: "모델이 양성이라 예측한 것 중 실제 양성의 비율입니다."
    },
    {
      id: "mock5-009-classification-definition",
      conceptId: "classification-definition",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "대출 신청자를 '승인', '보류', '거절' 중 하나로 예측하는 문제는 어떤 유형인가?",
      options: [
        "회귀",
        "군집화",
        "분류",
        "차원 축소"
      ],
      answer: 2,
      explanation: "여러 개의 이산적인 범주 중 하나를 예측하므로 분류 문제입니다.",
      hint: "결과가 연속값이 아니라 정해진 범주입니다."
    },
    {
      id: "mock5-010-non-linear-activation-role",
      conceptId: "non-linear-activation-role",
      difficulty: "easy",
      category: "딥러닝 기본 원리",
      questionType: "multiple-choice",
      prompt: "여러 선형 계층 사이에서 ReLU 같은 활성화 함수를 제거하면 생기는 핵심 문제는?",
      options: [
        "파라미터 수가 자동으로 0이 됨",
        "입력 데이터가 사라짐",
        "가중치가 모두 정수가 됨",
        "깊게 쌓아도 전체가 하나의 선형 변환처럼 됨"
      ],
      answer: 3,
      explanation: "비선형 활성화가 없으면 선형 변환의 합성 역시 선형이므로 깊은 신경망의 표현력이 제한됩니다.",
      hint: "선형 함수 여러 개를 합성해도 선형이라는 점을 떠올려보세요."
    },
    {
      id: "mock5-011-rlhf-core-objective",
      conceptId: "rlhf-core-objective",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "RLHF에서 사람의 선호를 반영한 보상 신호를 사용하는 가장 직접적인 목적은?",
      options: [
        "모델 파일을 압축하기 위해",
        "토크나이저 어휘를 늘리기 위해",
        "검색 인덱스를 만들기 위해",
        "모델 응답을 인간 선호와 정렬하기 위해"
      ],
      answer: 3,
      explanation: "RLHF는 인간이 선호하는 유용하고 안전한 응답을 생성하도록 정책을 정렬하는 것이 목적입니다.",
      hint: "사람이 더 좋아하는 답변 방향으로 모델을 조정합니다."
    },
    {
      id: "mock5-012-rlhf-step-by-step-pipeline",
      conceptId: "rlhf-step-by-step-pipeline",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "전통적인 RLHF 절차에서 보상 모델 학습 다음에 수행되는 단계는?",
      options: [
        "대규모 사전학습 재시작",
        "강화학습으로 정책 모델 최적화",
        "토크나이저 재설계",
        "이미지 인코더 학습"
      ],
      answer: 1,
      explanation: "일반적 RLHF는 SFT 후 보상 모델을 학습하고, 그 보상 신호로 정책을 강화학습 방식으로 최적화합니다.",
      hint: "보상 모델을 만든 뒤 그 점수를 이용해 정책을 갱신합니다."
    },
    {
      id: "mock5-013-gradient-descent-update-rule",
      conceptId: "gradient-descent-update-rule",
      difficulty: "easy",
      category: "딥러닝 기본 원리",
      questionType: "multiple-choice",
      prompt: "어떤 가중치에서 손실의 기울기가 +5로 계산되었다. 손실을 줄이려면 가중치는 어느 방향으로 움직여야 하는가?",
      options: [
        "현재 값보다 큰 방향",
        "항상 0으로 이동",
        "현재 값보다 작은 방향",
        "변경하지 않음"
      ],
      answer: 2,
      explanation: "경사하강법은 기울기의 반대 방향으로 이동하므로 양의 기울기일 때 가중치를 감소시킵니다.",
      hint: "기울기의 반대 방향으로 갱신합니다."
    },
    {
      id: "mock5-014-one-hot-encoding-limitations",
      conceptId: "one-hot-encoding-limitations",
      difficulty: "easy",
      category: "자연어 처리 및 임베딩",
      questionType: "multiple-choice",
      prompt: "원-핫 벡터에서 '고양이'와 '강아지'가 의미적으로 비슷해도 서로 가까운 벡터로 표현되지 않는 이유는?",
      options: [
        "모든 단어 벡터 값이 1이기 때문",
        "각 단어가 서로 직교하는 독립 차원으로 표현되기 때문",
        "문장 길이가 항상 같기 때문",
        "단어 순서를 자동 저장하기 때문"
      ],
      answer: 1,
      explanation: "원-핫 표현은 각 단어를 독립적인 축으로 두므로 단어 간 의미적 유사성을 반영하지 못합니다.",
      hint: "서로 다른 단어의 원-핫 벡터 내적을 생각해보세요."
    },
    {
      id: "mock5-015-rnn-hidden-state-recurrence",
      conceptId: "rnn-hidden-state-recurrence",
      difficulty: "easy",
      category: "자연어 처리 및 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "RNN에서 앞 시점의 문맥 정보를 다음 시점 계산에 넘겨주는 값은?",
      options: [
        "위치 임베딩",
        "풀링 윈도우",
        "클래스 토큰",
        "은닉 상태"
      ],
      answer: 3,
      explanation: "RNN은 이전 시점의 은닉 상태를 다음 시점으로 전달하며 순차 정보를 누적합니다.",
      hint: "이전 시점 정보를 요약해 들고 가는 상태입니다."
    },
    {
      id: "mock5-016-1x1-convolution-multiplications",
      conceptId: "1x1-convolution-multiplications",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "10×10 피처맵에 입력 채널 8, 출력 채널 4인 1×1 Conv를 적용할 때 곱셈 횟수는?",
      options: [
        "800회",
        "3,200회",
        "1,600회",
        "6,400회"
      ],
      answer: 1,
      explanation: "곱셈 횟수는 10×10×8×4=3,200회입니다.",
      hint: "H×W×입력채널×출력채널로 계산하세요."
    },
    {
      id: "mock5-017-cnn-fc-parameter-calculation",
      conceptId: "cnn-fc-parameter-calculation",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "편향을 제외할 때 3×3 Conv(Cin=4, Cout=6)와 FC(입력 20, 출력 5)의 가중치 수 조합은?",
      options: [
        "Conv 54개 / FC 100개",
        "Conv 216개 / FC 25개",
        "Conv 216개 / FC 100개",
        "Conv 54개 / FC 25개"
      ],
      answer: 2,
      explanation: "Conv는 3×3×4×6=216개, FC는 20×5=100개입니다.",
      hint: "Conv와 FC의 가중치 수 공식을 각각 적용하세요."
    },
    {
      id: "mock5-018-sentence-embedding-cosine-similarity",
      conceptId: "sentence-embedding-cosine-similarity",
      difficulty: "easy",
      category: "자연어 처리 및 임베딩",
      questionType: "multiple-choice",
      prompt: "두 문장 임베딩의 코사인 유사도가 0.95라면 가장 자연스러운 해석은?",
      options: [
        "두 문장의 길이가 같다",
        "두 문장이 완전히 반대 의미다",
        "두 문장의 단어 수가 같다",
        "두 문장의 의미가 상당히 유사하다"
      ],
      answer: 3,
      explanation: "코사인 유사도가 1에 가까울수록 임베딩 방향이 비슷하여 의미적으로 유사하다고 해석합니다.",
      hint: "1에 가까운 코사인 유사도의 의미를 떠올려보세요."
    },
    {
      id: "mock5-019-text-foundation-model-concept",
      conceptId: "text-foundation-model-concept",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "하나의 대규모 사전학습 모델을 요약, 번역, 질의응답 등 여러 작업에 재사용할 수 있는 이유와 가장 관련 깊은 개념은?",
      options: [
        "단일 규칙 기반 모델",
        "K-means 군집기",
        "텍스트 파운데이션 모델",
        "선형 회귀 모델"
      ],
      answer: 2,
      explanation: "파운데이션 모델은 대규모 데이터로 범용 표현과 지식을 학습해 다양한 하위 작업에 적응할 수 있습니다.",
      hint: "여러 작업의 기반이 되는 사전학습 모델입니다."
    },
    {
      id: "mock5-020-llm-agent-six-traits",
      conceptId: "llm-agent-six-traits",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "LLM Agent가 목표를 작은 단계로 나누고 실행 순서를 정하는 능력은 무엇인가?",
      options: [
        "계획(Planning)",
        "양자화",
        "토큰화",
        "풀링"
      ],
      answer: 0,
      explanation: "에이전트의 계획 능력은 복잡한 목표를 하위 작업으로 분해하고 실행 순서를 구성하는 기능입니다.",
      hint: "무엇을 어떤 순서로 할지 정하는 능력입니다."
    },
    {
      id: "mock5-021-instruction-dataset-format",
      conceptId: "instruction-dataset-format",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "다음 중 Instruction-tuning 학습 샘플의 형태로 가장 적절한 것은?",
      options: [
        "이미지 + 바운딩 박스 + 클래스",
        "지시문 + 입력 문맥 + 모범 응답",
        "질문 + 선호 순위 + 보상 점수",
        "문서 + 검색 점수 + 인덱스"
      ],
      answer: 1,
      explanation: "Instruction-tuning은 지시와 입력에 대해 적절한 응답을 생성하도록 지시-응답 데이터를 사용합니다.",
      hint: "명령과 그에 대한 이상적인 답변의 쌍입니다."
    },
    {
      id: "mock5-022-1x1-conv-channel-pooling",
      conceptId: "1x1-conv-channel-pooling",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "1×1 Conv로 입력 채널 64개를 출력 채널 16개로 바꾸되 stride=1을 사용했다. 가장 직접적인 변화는?",
      options: [
        "가로·세로가 절반으로 줄고 채널은 유지된다",
        "가로·세로 크기는 유지되고 채널 수가 줄어든다",
        "모든 픽셀이 이진값으로 바뀐다",
        "이미지가 자동 회전 보정된다"
      ],
      answer: 1,
      explanation: "1×1 Conv는 stride가 1이면 공간 해상도를 유지하면서 채널 차원을 조절할 수 있습니다.",
      hint: "공간 크기보다 채널 축의 변화를 보세요."
    },
    {
      id: "mock5-023-zero-shot-cot-trigger-phrase",
      conceptId: "zero-shot-cot-trigger-phrase",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "예시를 하나도 주지 않고 '단계별로 생각해 보세요' 같은 문구만 추가하는 추론 유도 방식은?",
      options: [
        "Zero-shot CoT",
        "Few-shot CoT",
        "Self-consistency",
        "Instruction-tuning"
      ],
      answer: 0,
      explanation: "Zero-shot CoT는 별도의 예시 없이 단계적 사고를 유도하는 문구를 추가하는 프롬프팅 기법입니다.",
      hint: "예시는 없고 사고 과정만 유도합니다."
    },
    {
      id: "mock5-024-ai-vs-ai-agent-difference",
      conceptId: "ai-vs-ai-agent-difference",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "일반 LLM과 AI Agent를 구분하는 설명으로 가장 적절한 것은?",
      options: [
        "Agent는 반드시 인터넷 없이만 동작한다",
        "일반 LLM은 텍스트를 생성할 수 없다",
        "Agent는 학습된 가중치를 사용하지 않는다",
        "Agent는 목표 달성을 위해 계획하고 외부 도구를 실행할 수 있다"
      ],
      answer: 3,
      explanation: "AI Agent는 목표를 바탕으로 계획하고 도구를 호출하며 환경과 상호작용하는 능동적 구조를 가집니다.",
      hint: "텍스트 생성에 그치지 않고 행동까지 수행하는지 보세요."
    },
    {
      id: "mock5-025-quantization-basic-concept",
      conceptId: "quantization-basic-concept",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "FP32 가중치를 INT8 등 더 낮은 정밀도로 표현하는 경량화 기법은?",
      options: [
        "가지치기",
        "지식 증류",
        "양자화",
        "데이터 증강"
      ],
      answer: 2,
      explanation: "양자화는 수치 표현 비트 수를 줄여 메모리와 연산 비용을 낮추는 기법입니다.",
      hint: "숫자를 표현하는 비트 수를 줄이는 방법입니다."
    },
    {
      id: "mock5-026-prompt-design-structure",
      conceptId: "prompt-design-structure",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "모델에게 '표 형식으로 3개만 답하라'고 명시하는 것은 프롬프트 디자인에서 무엇을 분명히 하는 예인가?",
      options: [
        "출력 형식과 제약 조건",
        "학습률",
        "모델 파라미터 수",
        "토크나이저 크기"
      ],
      answer: 0,
      explanation: "원하는 결과의 형식과 개수를 구체적으로 지정하면 출력 일관성을 높일 수 있습니다.",
      hint: "답변이 어떤 모양으로 나와야 하는지 정하는 요소입니다."
    },
    {
      id: "mock5-027-knowledge-distillation-concept",
      conceptId: "knowledge-distillation-concept",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "작은 모델이 큰 모델의 출력 확률 분포를 따라 배우도록 학습하는 방법은?",
      options: [
        "지식 증류",
        "양자화",
        "가지치기",
        "배치 정규화"
      ],
      answer: 0,
      explanation: "지식 증류는 교사 모델의 출력 분포와 지식을 학생 모델이 모방하도록 학습합니다.",
      hint: "교사-학생 구조를 사용하는 경량화 기법입니다."
    },
    {
      id: "mock5-028-multimodal-video-generation-concept",
      conceptId: "multimodal-video-generation-concept",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "한 장의 이미지와 텍스트 설명을 입력해 시간에 따라 움직이는 장면을 생성하려 한다. 필요한 모델 유형은?",
      options: [
        "텍스트 분류 모델",
        "이미지 분류 모델",
        "멀티모달 비디오 생성 모델",
        "음성 인식 모델"
      ],
      answer: 2,
      explanation: "이미지와 텍스트 조건을 함께 활용해 연속된 프레임을 생성하는 것은 멀티모달 비디오 생성 문제입니다.",
      hint: "입력이 여러 모달리티이고 출력이 동영상입니다."
    },
    {
      id: "mock5-029-word2vec-cbow-vs-skipgram",
      conceptId: "word2vec-cbow-vs-skipgram",
      difficulty: "easy",
      category: "자연어 처리 및 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec에서 주변 단어들을 보고 가운데 단어를 맞히는 방식은?",
      options: [
        "Skip-gram",
        "CBOW",
        "RNN",
        "BERT"
      ],
      answer: 1,
      explanation: "CBOW는 주변 문맥 단어를 입력으로 사용해 중심 단어를 예측합니다.",
      hint: "주변에서 중심을 맞히는 방향입니다."
    },
    {
      id: "mock5-030-rnn-vanishing-gradient-problem",
      conceptId: "rnn-vanishing-gradient-problem",
      difficulty: "easy",
      category: "자연어 처리 및 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "긴 문장에서 앞부분 정보가 뒤로 갈수록 학습에 잘 반영되지 않는 기본 RNN의 대표 원인은?",
      options: [
        "기울기 소실",
        "다중공선성",
        "등분산성 위반",
        "양자화 오차"
      ],
      answer: 0,
      explanation: "시간 방향으로 역전파할 때 반복 곱셈으로 기울기가 매우 작아지면 장기 의존성을 학습하기 어렵습니다.",
      hint: "역전파 기울기가 점점 0에 가까워지는 현상입니다."
    },
    {
      id: "mock5-031-lstm-cell-state-gates",
      conceptId: "lstm-cell-state-gates",
      difficulty: "easy",
      category: "자연어 처리 및 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "LSTM에서 어떤 정보를 버릴지 결정하는 게이트는?",
      options: [
        "망각 게이트(Forget Gate)",
        "입력 임베딩",
        "소프트맥스 계층",
        "위치 인코딩"
      ],
      answer: 0,
      explanation: "망각 게이트는 이전 셀 상태의 정보 중 유지하거나 제거할 부분을 조절합니다.",
      hint: "이름 그대로 기억에서 버릴 정보를 정합니다."
    },
    {
      id: "mock5-032-pretraining-vs-finetuning-concepts",
      conceptId: "pretraining-vs-finetuning-concepts",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "대규모 일반 데이터로 학습된 모델을 회사 내부 문서 분류 작업에 맞춰 추가 학습시키는 단계는?",
      options: [
        "사전학습",
        "파인튜닝",
        "토큰화",
        "군집화"
      ],
      answer: 1,
      explanation: "이미 범용 지식을 가진 모델을 특정 도메인이나 작업에 맞게 추가 학습하는 과정이 파인튜닝입니다.",
      hint: "기반 모델을 특정 작업에 맞게 조정하는 단계입니다."
    },
    {
      id: "mock5-033-max-pooling-downsampling",
      conceptId: "max-pooling-downsampling",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "2×2 Max Pooling 영역의 값이 [1, 7; 3, 5]라면 출력값은?",
      options: [
        "1",
        "3",
        "4",
        "7"
      ],
      answer: 3,
      explanation: "Max Pooling은 윈도우 안에서 가장 큰 값 하나를 선택합니다.",
      hint: "네 값 중 최댓값을 고르세요."
    },
    {
      id: "mock5-034-cnn-receptive-field-concept",
      conceptId: "cnn-receptive-field-concept",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "CNN의 깊은 층 뉴런이 얕은 층 뉴런보다 이미지의 더 넓은 부분을 볼 수 있게 되는 개념은?",
      options: [
        "배치 크기",
        "학습률",
        "출력 채널",
        "수용 영역(Receptive Field)"
      ],
      answer: 3,
      explanation: "수용 영역은 한 뉴런의 출력에 영향을 주는 입력 이미지의 공간적 범위입니다.",
      hint: "뉴런이 입력에서 바라보는 범위입니다."
    },
    {
      id: "mock5-035-feature-map-memory-calculation",
      conceptId: "feature-map-memory-calculation",
      difficulty: "easy",
      category: "컴퓨터 비전 및 CNN",
      questionType: "multiple-choice",
      prompt: "32×32×64 Feature Map을 FP16(2바이트)으로 저장할 때 필요한 메모리는?",
      options: [
        "64 KB",
        "128 KB",
        "256 KB",
        "512 KB"
      ],
      answer: 1,
      explanation: "32×32×64=65,536개 원소이고 FP16은 2바이트이므로 131,072바이트=128KB입니다.",
      hint: "원소 수에 2바이트를 곱하세요."
    },
    {
      id: "mock5-036-foundation-model-application-dev",
      conceptId: "foundation-model-application-dev",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "사내 문서 Q&A 서비스를 빠르게 만들 때 파운데이션 모델을 활용하는 현실적인 접근은?",
      options: [
        "항상 모델을 처음부터 사전학습한다",
        "기존 모델에 프롬프트와 검색 기능을 결합한다",
        "외부 지식을 모두 제거한다",
        "규칙 기반 시스템만 사용한다"
      ],
      answer: 1,
      explanation: "실무에서는 검증된 기반 모델에 프롬프트, 검색증강, 도구 연동 등을 결합해 서비스를 구성하는 방식이 효율적입니다.",
      hint: "기반 모델을 재사용하고 필요한 기능을 덧붙입니다."
    },
    {
      id: "mock5-037-vlm-training-alignment-procedure",
      conceptId: "vlm-training-alignment-procedure",
      difficulty: "easy",
      category: "멀티모달 및 VLM",
      questionType: "multiple-choice",
      prompt: "이미지 인코더가 만든 시각 특징을 언어 모델이 이해할 수 있는 표현 공간으로 맞추는 과정은?",
      options: [
        "이미지 삭제",
        "언어 모델 제거",
        "시각-언어 정렬 학습",
        "픽셀 이진화"
      ],
      answer: 2,
      explanation: "VLM은 프로젝터 등의 연결 모듈을 통해 시각 특징과 언어 표현을 정렬합니다.",
      hint: "두 모달리티의 표현 공간을 연결하는 과정입니다."
    },
    {
      id: "mock5-038-doc-vlm-layout-text-understanding",
      conceptId: "doc-vlm-layout-text-understanding",
      difficulty: "easy",
      category: "멀티모달 및 VLM",
      questionType: "multiple-choice",
      prompt: "표에서 같은 숫자라도 어느 행과 열에 위치했는지까지 이해해야 한다. 문서 이해 VLM에 특히 필요한 능력은?",
      options: [
        "문자 수만 세기",
        "이미지를 음성으로 변환하기",
        "모든 좌표 제거하기",
        "텍스트와 2차원 레이아웃의 공동 이해"
      ],
      answer: 3,
      explanation: "문서 VLM은 OCR된 텍스트뿐 아니라 표 구조와 2차원 배치까지 함께 해석합니다.",
      hint: "문서의 내용과 위치 정보를 동시에 봐야 합니다."
    },
    {
      id: "mock5-039-small-vlm-on-device-benefits",
      conceptId: "small-vlm-on-device-benefits",
      difficulty: "easy",
      category: "멀티모달 및 VLM",
      questionType: "multiple-choice",
      prompt: "Small VLM을 스마트폰에 탑재할 때 가장 기대되는 장점은?",
      options: [
        "항상 더 큰 서버 비용",
        "이미지 입력 불가",
        "낮은 메모리 사용량과 빠른 온디바이스 추론",
        "반드시 인터넷 연결 필요"
      ],
      answer: 2,
      explanation: "Small VLM은 파라미터와 연산량을 줄여 자원이 제한된 기기에서도 빠르게 추론할 수 있습니다.",
      hint: "작고 가벼워서 기기 안에서 실행하기 좋습니다."
    },
    {
      id: "mock5-040-rag-definition-retrieval-generation",
      conceptId: "rag-definition-retrieval-generation",
      difficulty: "easy",
      category: "검색증강 생성 (RAG)",
      questionType: "multiple-choice",
      prompt: "RAG 시스템에서 사용자의 질문을 받은 직후 생성 전에 수행하는 핵심 단계는?",
      options: [
        "모델 전체를 재학습한다",
        "모든 문서를 삭제한다",
        "가중치를 0으로 초기화한다",
        "관련 외부 문서를 검색한다"
      ],
      answer: 3,
      explanation: "RAG는 먼저 질의와 관련된 외부 문서를 검색한 뒤 그 문서를 컨텍스트로 사용해 답변을 생성합니다.",
      hint: "Generate 전에 Retrieve가 먼저입니다."
    },
    {
      id: "mock5-041-llm-as-judge-evaluation-biases",
      conceptId: "llm-as-judge-evaluation-biases",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "내용은 비슷하지만 더 긴 답변에 반복적으로 높은 점수를 주는 LLM 평가자의 문제는?",
      options: [
        "길이 편향(Verbosity Bias)",
        "기울기 소실",
        "다중공선성",
        "양자화 오차"
      ],
      answer: 0,
      explanation: "LLM-as-a-Judge는 내용과 무관하게 긴 답변을 선호하는 길이 편향을 보일 수 있습니다.",
      hint: "답변 길이 자체가 평가에 영향을 주는 경우입니다."
    },
    {
      id: "mock5-042-single-task-finetuning-catastrophic-forgetting",
      conceptId: "single-task-finetuning-catastrophic-forgetting",
      difficulty: "easy",
      category: "파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "범용 모델을 한 가지 좁은 작업에 지나치게 오래 파인튜닝한 뒤 다른 작업 성능이 크게 떨어졌다. 이 현상은?",
      options: [
        "검색 증강",
        "양자화",
        "치명적 망각",
        "배치 정규화"
      ],
      answer: 2,
      explanation: "특정 작업에 과도하게 적응하면서 기존 범용 지식을 잃는 현상을 치명적 망각이라고 합니다.",
      hint: "새 작업을 배우며 예전 능력을 잃는 현상입니다."
    },
    {
      id: "mock5-043-regression-coefficient-interpretation-meaning",
      conceptId: "regression-coefficient-interpretation-meaning",
      difficulty: "easy",
      category: "머신러닝 기초 및 통계",
      questionType: "multiple-choice",
      prompt: "회귀식 Y = 20 - 3X1 + 2X2에서 X2가 고정일 때 X1의 계수 -3은 무엇을 뜻하는가?",
      options: [
        "X1이 3 증가하면 Y가 1 증가한다",
        "X1과 X2의 상관계수가 -3이다",
        "X2가 1 증가하면 Y가 3 감소한다",
        "X1이 1 증가하면 Y의 평균이 3 감소한다"
      ],
      answer: 3,
      explanation: "다른 변수를 고정하면 회귀계수는 해당 변수가 1단위 변할 때 종속변수 평균의 변화량을 뜻합니다.",
      hint: "계수의 부호와 크기를 그대로 해석하세요."
    },
    {
      id: "mock5-044-tool-learning-agent-paradigm",
      conceptId: "tool-learning-agent-paradigm",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "모델이 계산 문제를 만나면 계산기를 호출하고 최신 정보를 묻는 질문에는 검색기를 호출하도록 학습하는 개념은?",
      options: [
        "지식 증류",
        "도구 학습",
        "원-핫 인코딩",
        "Max Pooling"
      ],
      answer: 1,
      explanation: "도구 학습은 모델이 상황에 맞는 외부 도구를 선택하고 호출하며 결과를 활용하도록 학습하는 방식입니다.",
      hint: "언어 모델 바깥의 기능을 선택해 쓰는 능력입니다."
    },
    {
      id: "mock5-045-multi-agent-system-framework",
      conceptId: "multi-agent-system-framework",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "한 에이전트는 자료 조사, 다른 에이전트는 검토, 또 다른 에이전트는 최종 작성을 맡는 구조는?",
      options: [
        "다중 에이전트 시스템",
        "단일 에이전트 시스템",
        "지식 증류",
        "양자화 시스템"
      ],
      answer: 0,
      explanation: "여러 에이전트가 역할을 분담하고 상호작용하며 목표를 해결하는 구조가 다중 에이전트 시스템입니다.",
      hint: "여러 에이전트가 협업하는 구조입니다."
    },
    {
      id: "mock5-046-finetuning-vs-instruction-tuning-difference",
      conceptId: "finetuning-vs-instruction-tuning-difference",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "새로운 형식의 명령도 잘 따르게 만들기 위해 여러 종류의 지시-응답 쌍으로 학습하는 방식은?",
      options: [
        "Instruction-tuning",
        "양자화",
        "가지치기",
        "RAG"
      ],
      answer: 0,
      explanation: "Instruction-tuning은 다양한 지시문과 모범 응답을 학습해 지시 추종 능력을 일반화합니다.",
      hint: "여러 종류의 명령을 따르는 능력을 학습합니다."
    },
    {
      id: "mock5-047-rlhf-pipeline-order-check",
      conceptId: "rlhf-pipeline-order-check",
      difficulty: "easy",
      category: "LLM 사후 학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "RLHF에서 같은 질문에 대한 두 답변 A, B 중 사람이 어느 답을 더 선호하는지 기록한 데이터는 주로 무엇을 학습하는 데 쓰이는가?",
      options: [
        "토크나이저",
        "이미지 인코더",
        "보상 모델",
        "검색 인덱스"
      ],
      answer: 2,
      explanation: "사람의 응답 선호 비교 데이터는 보상 모델이 인간 선호를 점수화하도록 학습하는 데 사용됩니다.",
      hint: "선호 순위를 점수로 바꾸는 모델을 떠올려보세요."
    },
    {
      id: "mock5-048-few-shot-cot-prompting",
      conceptId: "few-shot-cot-prompting",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "프롬프트에 '문제 → 단계별 풀이 → 정답' 예시를 3개 넣고 새 문제를 푸는 방식은?",
      options: [
        "Zero-shot CoT",
        "PTQ",
        "지식 증류",
        "Few-shot CoT"
      ],
      answer: 3,
      explanation: "Few-shot CoT는 단계별 추론 과정이 포함된 소수의 예시를 제공하여 새 문제의 추론을 유도합니다.",
      hint: "몇 개의 풀이 예시가 포함되어 있습니다."
    },
    {
      id: "mock5-049-edge-deployment-quantization-strategy",
      conceptId: "edge-deployment-quantization-strategy",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "서버에서는 FP16 대형 모델을 쓰지만 배터리와 메모리가 제한된 엣지 기기에서는 어떤 전략이 더 적절한가?",
      options: [
        "모델 크기를 더 키운다",
        "양자화·가지치기 등으로 모델을 경량화한다",
        "모든 연산을 FP64로 바꾼다",
        "추론할 때마다 재학습한다"
      ],
      answer: 1,
      explanation: "엣지 환경에서는 메모리, 전력, 지연시간 제약 때문에 모델 압축과 저정밀도 연산이 중요합니다.",
      hint: "배포 환경의 자원 제약에 맞춰 모델을 줄입니다."
    },
    {
      id: "mock5-050-low-bit-quantization-benefits",
      conceptId: "low-bit-quantization-benefits",
      difficulty: "easy",
      category: "모델 경량화 및 파인튜닝",
      questionType: "multiple-choice",
      prompt: "32비트 가중치를 4비트로 표현하면 일반적으로 가장 먼저 줄어드는 자원은?",
      options: [
        "학습 데이터 개수",
        "가중치 저장 메모리",
        "모델의 층 수",
        "입력 이미지 해상도"
      ],
      answer: 1,
      explanation: "비트 수를 줄이면 각 가중치가 차지하는 저장 공간이 감소하여 메모리 사용량이 줄어듭니다.",
      hint: "한 가중치가 차지하는 바이트 수가 줄어듭니다."
    },
    {
      id: "mock5-051-distillation-teacher-student-roles",
      conceptId: "distillation-teacher-student-roles",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "지식 증류에서 성능이 높은 큰 모델은 일반적으로 어떤 역할을 맡는가?",
      options: [
        "교사 모델(Teacher)",
        "학생 모델(Student)",
        "보상 모델",
        "라우터 모델"
      ],
      answer: 0,
      explanation: "대형 고성능 모델은 교사 역할을 하며 학생 모델이 그 출력을 모방하도록 지식을 제공합니다.",
      hint: "지식을 전달하는 쪽입니다."
    },
    {
      id: "mock5-052-compression-accuracy-tradeoff-concept",
      conceptId: "compression-accuracy-tradeoff-concept",
      difficulty: "easy",
      category: "모델 경량화 및 고속화",
      questionType: "multiple-choice",
      prompt: "모델을 지나치게 강하게 압축했을 때 생길 수 있는 대표적인 부작용은?",
      options: [
        "파라미터 수 증가",
        "메모리 사용량 증가만 발생",
        "정확도 저하",
        "항상 전력 사용량 증가"
      ],
      answer: 2,
      explanation: "압축률이 높아질수록 표현력이 손실되어 정확도가 일부 감소할 수 있습니다.",
      hint: "효율을 얻는 대신 성능을 잃을 수 있습니다."
    },
    {
      id: "mock5-053-ood-adaptive-sensing-concept",
      conceptId: "ood-adaptive-sensing-concept",
      difficulty: "easy",
      category: "적응적 센싱 및 모델 설계",
      questionType: "multiple-choice",
      prompt: "야외 카메라 모델이 갑자기 매우 어두운 환경을 만났을 때 적응적 센싱의 대응으로 가장 적절한 것은?",
      options: [
        "노출 등 센서 설정을 환경에 맞게 조절한다",
        "입력을 모두 0으로 만든다",
        "카메라 연결을 끊는다",
        "학습 데이터를 삭제한다"
      ],
      answer: 0,
      explanation: "적응적 센싱은 OOD 환경 변화에 맞춰 센서 파라미터를 조정해 입력 품질을 개선합니다.",
      hint: "환경에 맞춰 센서 자체를 조절합니다."
    },
    {
      id: "mock5-054-physical-ai-scaling-comparison",
      conceptId: "physical-ai-scaling-comparison",
      difficulty: "easy",
      category: "적응적 센싱 및 모델 설계",
      questionType: "multiple-choice",
      prompt: "다음 중 Physical AI의 예에 가장 가까운 것은?",
      options: [
        "파라미터 수만 늘린 언어 모델",
        "텍스트를 압축하는 토크나이저",
        "정적 문서를 저장하는 데이터베이스",
        "카메라와 센서로 주변을 인식하고 실제로 움직이는 로봇"
      ],
      answer: 3,
      explanation: "Physical AI는 센서로 실제 세계를 인식하고 물리적 행동을 수행하는 AI를 의미합니다.",
      hint: "물리 세계에서 인식하고 행동하는 시스템을 고르세요."
    },
    {
      id: "mock5-055-cnn-spatial-locality-bias",
      conceptId: "cnn-spatial-locality-bias",
      difficulty: "easy",
      category: "컴퓨터 비전 및 도메인 지식",
      questionType: "multiple-choice",
      prompt: "CNN이 이미지 전체를 한 번에 완전 연결하기보다 작은 커널로 주변 픽셀을 먼저 보는 설계와 가장 관련 깊은 귀납 편향은?",
      options: [
        "시간적 순환성",
        "완전 독립성",
        "공간적 지역성",
        "무작위 연결성"
      ],
      answer: 2,
      explanation: "CNN은 가까운 픽셀끼리 관련성이 높다는 공간적 지역성을 구조에 반영합니다.",
      hint: "가까운 픽셀을 우선 함께 본다는 특성입니다."
    },
    {
      id: "mock5-056-vit-positional-embedding-role",
      conceptId: "vit-positional-embedding-role",
      difficulty: "easy",
      category: "컴퓨터 비전 및 도메인 지식",
      questionType: "multiple-choice",
      prompt: "ViT에서 패치 순서를 섞으면 동일한 패치 집합이라도 공간 배치 정보가 사라질 수 있다. 이를 보완하는 요소는?",
      options: [
        "Max Pooling",
        "위치 임베딩",
        "망각 게이트",
        "보상 모델"
      ],
      answer: 1,
      explanation: "Transformer는 순서를 자체적으로 알지 못하므로 ViT는 패치에 위치 임베딩을 더해 공간 정보를 제공합니다.",
      hint: "각 패치가 어디에 있었는지 알려주는 벡터입니다."
    },
    {
      id: "mock5-057-ai-agent-action-loop-mc",
      conceptId: "ai-agent-action-loop-mc",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "에이전트가 검색 도구를 실행한 뒤 결과가 부족하다고 판단해 다시 계획을 수정했다. 이 과정이 보여주는 핵심 동작은?",
      options: [
        "행동 결과의 피드백을 다음 계획에 반영하는 순환",
        "한 번 계획한 뒤 절대 수정하지 않음",
        "도구 없이 내부 지식만 사용",
        "모든 작업 전에 모델을 재학습"
      ],
      answer: 0,
      explanation: "AI Agent는 행동 결과를 관찰하고 그 피드백을 바탕으로 다음 계획과 행동을 조정하는 루프로 동작합니다.",
      hint: "행동 후 결과를 보고 다음 결정을 바꾸는 구조입니다."
    },
    {
      id: "mock5-058-distribution-shift-concept-mc",
      conceptId: "distribution-shift-concept-mc",
      difficulty: "easy",
      category: "적응적 센싱 및 모델 설계",
      questionType: "multiple-choice",
      prompt: "맑은 낮 사진으로 학습한 모델을 야간·안개 환경에 배포하자 성능이 크게 떨어졌다. 가장 관련 깊은 현상은?",
      options: [
        "지식 증류",
        "Max Pooling",
        "Distribution Shift",
        "Instruction-tuning"
      ],
      answer: 2,
      explanation: "학습 환경과 실제 배포 환경의 데이터 분포가 달라지면 Distribution Shift로 성능이 저하될 수 있습니다.",
      hint: "훈련 데이터와 실제 입력 데이터의 분포 차이입니다."
    },
    {
      id: "mock5-059-agent-tool-use-purpose-mc",
      conceptId: "agent-tool-use-purpose-mc",
      difficulty: "easy",
      category: "AI Agent 및 도구 활용",
      questionType: "multiple-choice",
      prompt: "LLM Agent가 복잡한 산술 계산을 직접 추측하지 않고 계산기 도구를 호출하는 가장 큰 이유는?",
      options: [
        "모델 파라미터를 삭제하기 위해",
        "프롬프트를 항상 같은 길이로 만들기 위해",
        "외부 도구로 정확한 계산 기능을 보완하기 위해",
        "언어 생성을 멈추기 위해"
      ],
      answer: 2,
      explanation: "도구 사용은 모델 자체의 한계를 보완하여 검색, 계산, 외부 시스템 제어 같은 기능을 수행하게 합니다.",
      hint: "모델 밖의 전문 기능을 이용하는 목적입니다."
    },
    {
      id: "mock5-060-domain-specific-ai-design-mc",
      conceptId: "domain-specific-ai-design-mc",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "multiple-choice",
      prompt: "의료 AI에 임상 규칙과 전문 용어 지식을 반영했을 때 기대되는 가장 적절한 효과는?",
      options: [
        "모든 가중치를 사람이 직접 입력할 수 있다",
        "역전파가 완전히 필요 없어지게 된다",
        "모든 산업에 동일한 규칙을 그대로 적용할 수 있다",
        "도메인에 맞는 판단 정확성과 효율을 높일 수 있다"
      ],
      answer: 3,
      explanation: "도메인 지식을 모델 설계나 학습에 반영하면 탐색 범위를 줄이고 해당 분야에 맞는 신뢰도와 효율을 높일 수 있습니다.",
      hint: "전문 분야의 규칙과 지식을 활용하는 이유를 생각해보세요."
    }
  ],
  medium: [],
  hard: [],
  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
