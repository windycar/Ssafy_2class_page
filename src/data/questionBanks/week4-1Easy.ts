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
    // 카테고리 1: 사전 학습 vs 사후 학습 및 지시어 튜닝 (15문항: 객관식 12, 단답식 2, 서술형 1)
    // =========================================================================
    {
      id: "cat1-pretrain-objective-easy-001",
      conceptId: "pretraining-objective",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "거대 언어 모델(LLM)의 사전 학습(Pre-training) 단계가 수행하는 핵심 학습 목표는 무엇입니까?",
      options: [
        "사용자가 입력한 프롬프트의 감정과 태스크를 분류하는 방식",
        "인간 평가자가 부여한 선호도 보상 점수를 극대화하는 방식",
        "주어진 텍스트 문맥을 바탕으로 다음 단어를 예측하는 방식",
        "외부 지식 저장소에서 질의와 일치하는 문서를 색인하는 방식"
      ],
      answer: 2,
      explanation: "사전 학습(Pre-training)은 대규모 텍스트 데이터를 바탕으로 자기지도학습(Self-supervised learning)을 수행하며, 핵심 학습 목표는 '다음 단어 예측(Next Token Prediction)'입니다.",
      hint: "비라벨 텍스트의 앞 문맥을 바탕으로 뒤에 올 단어의 확률을 예측하는 기본 원리를 떠올려보세요."
    },
    {
      id: "cat1-pretrain-limitation-easy-002",
      conceptId: "pretraining-completion-limitation",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "사전 학습(Pre-training)만을 거친 베이스 언어 모델에 '달 착륙을 6살 어린이에게 설명해줘'라는 프롬프트를 입력했을 때 나타나는 전형적인 반응으로 가장 적절한 것은?",
      options: [
        "질문에 대한 직접적인 답변 대신 지시문과 유사한 형태의 문장들을 연속으로 나열한다.",
        "프롬프트에 담긴 논리적 인과관계를 단계별로 추론하여 안전하고 유용한 결론을 도출한다.",
        "주어진 요청에 답변하기 위해 외부 문서 저장소에 자동으로 접근하여 최신 정보를 검색한다.",
        "명령문의 의도를 정확히 파악하여 초등학생 눈높이에 맞춘 간결한 문장으로 요약한다."
      ],
      answer: 0,
      explanation: "사전 학습만 수행된 베이스 모델은 다음 단어를 예측하는 데만 특화되어 있어, 질문에 대답하기보다 '중력 이론을 6살 어린이에게...', '상대성이론을 6살 어린이에게...'처럼 유사한 문장 목록을 연속 나열하는 텍스트 완성을 수행합니다.",
      hint: "지시를 수행하지 못하고 다음 문장을 이어 쓰려고만 하는 현상을 생각해보세요."
    },
    {
      id: "cat1-posttrain-purpose-easy-003",
      conceptId: "posttraining-alignment-purpose",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "사전 학습된 베이스 언어 모델에 사후 학습(Post-training)을 적용하는 주된 목적으로 가장 올바른 것은?",
      options: [
        "대규모 비라벨 웹 문서로부터 언어의 일반적인 통계적 패턴과 문법 지식을 학습하기 위해",
        "신경망의 전체 파라미터 수를 대폭 줄여 모바일 기기에서도 빠르게 추론하도록 경량화하기 위해",
        "외부 지식베이스에 보관된 모든 정형 데이터를 검증 없이 모델의 내부 가중치에 직접 인덱싱하기 위해",
        "사용자의 지시 의도를 정확히 파악하여 안전하고 유용한 대화형 응답을 생성하도록 정렬하기 위해"
      ],
      answer: 3,
      explanation: "사후 학습(Post-training)은 유저의 의도를 파악하고 원하는 답변을 모델이 응답하도록 사람의 선호와 대화 목적에 맞게 모델을 조정(Alignment)하는 단계입니다.",
      hint: "단순 문장 생성을 넘어 대화형 비서로서 유저의 명령을 수행하도록 만드는 목적을 생각해보세요."
    },
    {
      id: "cat1-instruction-tuning-nature-easy-004",
      conceptId: "instruction-tuning-supervised-nature",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "인스트럭션 튜닝(Instruction-tuning)의 학습 데이터 및 방법론적 특성에 대한 설명으로 옳지 않은 것은?",
      options: [
        "사람이 작성하거나 검증한 지시문-응답 쌍 데이터셋을 활용하여 파인튜닝을 진행한다.",
        "별도의 정답 레이블 없이 대규모 텍스트의 빈칸을 채우는 자기지도학습 방식으로 수행된다.",
        "사전 학습에 포함되지 않았던 새로운 작업에 대해서도 지시를 따르는 일반화 능력을 부여한다.",
        "사전 학습된 베이스 모델을 지도학습 형태로 조정하는 지도 미세조정(SFT)의 일종이다."
      ],
      answer: 1,
      explanation: "인스트럭션 튜닝은 비라벨 데이터를 사용하는 자기지도학습이 아니라, 명확한 정답 레이블(지시문과 응답 쌍)을 사용하는 지도 미세조정(Supervised Fine-Tuning) 방식입니다.",
      hint: "정답 레이블(Ground truth)이 명시적으로 주어지는지 확인하세요."
    },
    {
      id: "cat1-super-natural-dataset-easy-005",
      conceptId: "super-natural-instructions-scale",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "다양한 작업의 지시문 학습을 위해 구축된 대규모 벤치마크 데이터셋인 'Super-NaturalInstructions'의 구성 규모로 옳은 것은?",
      options: [
        "50개 미만의 단일 도메인 작업과 10만 개 수준의 예시 데이터",
        "50만 개 이상의 코딩 문제와 1,000만 개 이상의 단위 테스트 케이스",
        "100만 개 이상의 웹 크롤링 문서와 10억 개 이상의 어휘 사전",
        "1,600개 이상의 다양한 태스크와 300만 개 이상의 예시 데이터"
      ],
      answer: 3,
      explanation: "Super-NaturalInstructions 데이터셋은 1.6K+(1,600개 이상)의 태스크와 3M+(300만 개 이상)의 예시로 구성되어 있습니다.",
      hint: "1,600개 이상의 태스크와 300만 개 이상의 예시라는 두 규모를 함께 떠올리세요."
    },
    {
      id: "cat1-mmlu-benchmark-easy-006",
      conceptId: "mmlu-evaluation-benchmark",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "거대 언어 모델의 광범위한 다중 작업 지식 및 이해 능력을 평가하기 위해 57개 학문 분야를 측정하는 대표적인 평가 벤치마크는?",
      options: [
        "MMLU",
        "BLEU",
        "ROUGE",
        "GLUE"
      ],
      answer: 0,
      explanation: "MMLU(Massive Multitask Language Understanding)는 초등 수학부터 전문 의학, 법률 등 57개의 지식을 요구하는 태스크에서 언어 모델의 성능을 평가하는 대표적인 지식 중심 벤치마크입니다.",
      hint: "Massive Multitask Language Understanding의 약자입니다."
    },
    {
      id: "cat1-k-mmlu-characteristics-easy-007",
      conceptId: "k-mmlu-korean-domains",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "한국어 특화 지식 벤치마크인 K-MMLU(Son et al., 2024)가 모델의 지식을 평가하기 위해 포함하고 있는 고유 범주로 가장 적절한 것은?",
      options: [
        "영어 원서의 직역 가능 여부와 라틴어 어원 분석",
        "한국의 법률, 지적제도사, K-IFRS 회계, 전통주 제조 등 한국 고유 지식",
        "글로벌 주식 시장의 실시간 초단타 매매 알고리즘과 장기 포트폴리오 수익률 추론",
        "오직 C/C++ 컴파일러 오류 분석과 리눅스 커널 소스 코드 검증"
      ],
      answer: 1,
      explanation: "K-MMLU는 한국의 지적제도사(양전도장), 도로 주택건설 규정, K-IFRS 회계기준, 전통주 제조법 등 한국 고유의 문화적, 지리적, 법률적 지식을 평가하도록 구성되었습니다.",
      hint: "한국의 고유한 법률 규정 및 역사/문화 지식을 요구하는 평가 데이터셋입니다."
    },
    {
      id: "cat1-self-instruct-alpaca-easy-008",
      conceptId: "alpaca-self-instruct-method",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "Stanford Alpaca(2023) 모델이 LLaMA 7B 모델을 지시 수행 모델로 파인튜닝하기 위해 데이터를 생성한 방식으로 옳은 것은?",
      options: [
        "수만 명의 작업자가 수작업으로 작성한 백과사전 Q&A를 크롤링하였다.",
        "사전 학습 코퍼스 전체에 대해 마스킹 토큰 복원 학습을 재수행하였다.",
        "175개의 시드 태스크로부터 text-davinci-003을 활용해 52K 지시 데이터를 합성하였다.",
        "PPO 강화학습을 적용하여 매 토큰마다 자동 생성된 보상 점수를 역전파하고 정책 모델의 전체 가중치를 반복 갱신하였다."
      ],
      answer: 2,
      explanation: "Alpaca는 175개의 Self-Instruct 시드 태스크로부터 text-davinci-003 모델을 통해 52K개의 지시어 추종 예시를 생성하여 LLaMA 7B 모델을 지도 미세조정(SFT)하였습니다.",
      hint: "OpenAI 모델을 활용하여 52K개의 데이터를 합성해 학습한 사례입니다."
    },
    {
      id: "cat1-lima-core-principle-easy-009",
      conceptId: "lima-less-is-more-principle",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "LIMA(Less is More for Alignment, Zhou et al., 2023) 연구가 증명한 인스트럭션 튜닝의 핵심 특성으로 가장 올바른 것은?",
      options: [
        "엄선된 1,000개 수준의 고품질 데이터만으로도 강력한 지시어 추종 성능을 달성할 수 있다.",
        "수백만 개의 대규모 데이터셋이 뒷받침되어야만 지시어 추종 정렬이 비로소 가능하다.",
        "사전 학습 단계의 지식 습득보다 사후 튜닝 단계에서의 데이터 양이 성능을 지배한다.",
        "인간 피드백 기반의 강화학습을 결합하지 않은 단순 지도 파인튜닝은 어떤 경우에도 정렬 효과가 전혀 없다."
      ],
      answer: 0,
      explanation: "LIMA 연구는 사전 학습 단계에서 대부분의 지식이 학습되므로, 정렬(Alignment)에는 단 1,000개(1K) 정도의 고품질 데이터셋만으로도 충분히 강력한 효과를 낼 수 있음을 보여주었습니다.",
      hint: "'Less is More(적은 것이 더 낫다)'라는 논문 제목의 의미를 떠올려보세요."
    },
    {
      id: "cat1-instruction-vs-pretrain-sample-easy-010",
      conceptId: "pronoun-resolution-example",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "대명사 해석 문제('기자와 셰프가 그들의 좋아하는 요리에 대해 논의할 것입니다')에서 지시 기반 Fine Tuning 이전과 이후의 차이로 옳은 것은?",
      options: [
        "튜닝 이전에는 단계적 추론으로 애매함을 판단했으나, 튜닝 이후에는 오답 보기를 순서대로 단순 나열했다.",
        "튜닝 이전과 이후 모두 문맥을 이해하지 못하고 항상 첫 번째 보기만을 무조건 선택했다.",
        "튜닝 이전에는 외부 문서를 검색해 풀었으나, 튜닝 이후에는 내부 파라미터만으로 오답을 냈다.",
        "튜닝 이전에는 문장 변형만 반복하며 답하지 못했으나, 튜닝 이후에는 근거와 함께 정답을 도출했다."
      ],
      answer: 3,
      explanation: "지시 기반 파인튜닝 이전에는 질문에 대답하지 못하고 문장 변형을 단순 나열하였으나, 튜닝 이후에는 '지칭 대상이 명확하지 않으므로 정답은 (C) 애매하다'라고 올바르게 추론하여 응답합니다.",
      hint: "지시 튜닝 전후 모델의 출력 방식 변화를 생각해보세요."
    },
    {
      id: "cat1-transfer-learning-concept-easy-011",
      conceptId: "transfer-learning-fine-tuning",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "이미 대규모 데이터로 사전 학습된 기존 베이스 모델에 특정 작업이나 도메인 데이터를 활용해 추가로 적응시키는 과정을 무엇이라고 합니까?",
      options: [
        "대규모 비라벨 코퍼스로 언어의 일반적인 패턴을 학습하는 사전 학습 (Pre-training)",
        "사전 학습된 베이스 모델을 특정 태스크나 도메인에 맞춰 추가로 학습시키는 파인 튜닝 (Fine-tuning)",
        "문맥 내 단어 벡터들의 평균을 계산하여 문장 분류에 활용할 벡터를 생성하는 토큰 풀링 (Token Pooling)",
        "어휘의 출현 위치를 효율적으로 기록하여 검색 속도를 높이는 역색인 (Inverted Indexing)"
      ],
      answer: 1,
      explanation: "이미 사전 학습된 기존 모델(Base LLM)에 특정 작업이나 도메인 데이터를 활용하여 추가로 적응시키는 학습 과정을 파인 튜닝(Fine-tuning)이라고 합니다.",
      hint: "사전 학습된 모델을 목적에 맞게 미세조정하는 기법입니다."
    },
    {
      id: "cat1-flan-t5-rationale-easy-012",
      conceptId: "flan-t5-cot-rationale",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "Flan-T5(Chung et al., 2022) 등에서 모델이 복잡한 지시문을 해결할 때, 최종 답변 전에 거치는 '중간 추론 근거(Rationale)'의 생성 역할로 가장 적절한 것은?",
      options: [
        "모델이 사전 학습 과정에서 놓쳤던 희귀 어휘의 임베딩 가중치 전체를 일괄적으로 강제 재조정한다.",
        "사용자의 프롬프트에서 불용어를 자동으로 제거하여 입력 토큰 수를 최소화한다.",
        "모델이 최종 답변에 도달하기 전에 논리적 근거를 단계별로 먼저 도출하도록 유도한다.",
        "외부 검색 엔진의 API를 호출하여 최신 웹 문서의 본문 전체를 인덱싱한다."
      ],
      answer: 2,
      explanation: "Flan-T5에서는 최종 답변을 내기 전 단계별 논리적 근거(Rationale)를 먼저 생성하도록 유도하여 새로운 태스크에 대한 추론 성능을 향상시킵니다.",
      hint: "'Give the rationale before answering'의 의미를 생각해보세요."
    },
    {
      id: "cat1-alpaca-size-short-easy-013",
      conceptId: "alpaca-dataset-count",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "short-answer",
      prompt: "스탠퍼드 연구진이 LLaMA 7B 기본 모델을 지시 수행 모델(Alpaca)로 파인튜닝할 때 text-davinci-003을 통해 생성하여 활용한 지시어 추종 데이터 예시의 총개수를 작성하시오. (K 단위 또는 숫자로 작성)",
      options: [],
      answer: null,
      acceptedAnswers: [
        "52K",
        "52k",
        "52,000",
        "52000",
        "52,000개",
        "52000개",
        "52K개",
        "52k개"
      ],
      explanation: "Alpaca 모델은 text-davinci-003을 활용하여 생성된 52K(52,000개)의 지시어 추종 예시 데이터셋으로 학습되었습니다.",
      hint: "Alpaca 지시어 추종 데이터는 50K 초반 규모입니다."
    },
    {
      id: "cat1-pretrain-task-short-easy-014",
      conceptId: "next-token-prediction-term",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "short-answer",
      prompt: "사전 학습(Pre-training) 단계에서 언어 모델이 주어진 앞선 단어 시퀀스를 바탕으로 다음에 이어질 가장 적절한 단어를 맞히도록 훈련하는 학습 기법의 영문 명칭(3단어)을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Next Token Prediction",
        "next token prediction",
        "Next-Token Prediction",
        "Next token prediction"
      ],
      explanation: "사전 학습 단계의 기본 학습 목표는 문맥에 맞는 다음 단어를 예측하는 'Next Token Prediction'입니다.",
      hint: "Next로 시작하는 3단어의 영문 표현입니다."
    },
    {
      id: "cat1-pre-vs-post-essay-easy-015",
      conceptId: "pretraining-vs-posttraining-comparison",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "essay",
      prompt: "거대 언어 모델(LLM)의 개발 과정에서 '사전 학습(Pre-training)'과 '사후 학습(Post-training)'의 차이점을 (1) 사용되는 데이터의 형태 및 학습 방식, (2) 모델이 달성하고자 하는 궁극적인 목표의 관점에서 구체적으로 비교하여 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "1. 데이터 형태 및 학습 방식의 차이:\n- 사전 학습(Pre-training)은 대규모의 비라벨(Unlabeled) 인터넷 텍스트 데이터를 바탕으로 자기지도학습(Self-supervised learning)을 수행합니다. 별도의 정답 라벨 없이 문맥을 통해 다음 토큰을 예측하는 Next Token Prediction 방식으로 가중치를 업데이트합니다.\n- 사후 학습(Post-training)은 사람이 작성하거나 검증한 (지시문, 응답) 형태의 정답 라벨 데이터를 사용하는 지도 파인튜닝(Instruction-tuning/SFT)이나 인간의 피드백 비교 데이터 등을 활용합니다.\n\n2. 학습 목표의 차이:\n- 사전 학습의 목표는 방대한 텍스트로부터 언어 패턴과 일반적인 세계 지식을 습득하고 문장을 자연스럽게 이어 쓰는 것입니다.\n- 사후 학습의 목표는 사전 학습된 모델이 사용자의 질문 의도를 정확히 파악하고, 사람이 선호하는 대화형 방식으로 안전하고 유용한 답변을 생성하도록 모델을 정렬(Alignment)하는 것입니다.",
      rubricKeywords: [
        "자기지도학습",
        "Next Token Prediction",
        "비라벨 데이터",
        "지시문-응답 쌍",
        "사용자 의도",
        "정렬"
      ],
      minLength: 150,
      explanation: "사전 학습(비라벨 데이터, 자기지도학습, 다음 토큰 예측, 언어 지식 습득)과 사후 학습(라벨 데이터, 지도/강화학습, 사용자 의도 정렬, 유용하고 안전한 답변 생성)의 핵심 차이를 체계적으로 설명해야 합니다.",
      hint: "비라벨 텍스트의 다음 단어 예측 vs 지시어-응답 쌍을 통한 인간 의도 정렬을 비교하세요."
    },

    // =========================================================================
    // 카테고리 2: 인간 피드백 기반 강화학습 및 정렬 (15문항: 객관식 12, 단답식 2, 서술형 1)
    // =========================================================================
    {
      id: "cat2-instruction-limitation-easy-016",
      conceptId: "instruction-tuning-limitations",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "단순 지도 인스트럭션 튜닝(Instruction-tuning)만으로 인간의 선호를 만족시키기 어려운 한계점으로 옳지 않은 것은?",
      options: [
        "창의적 글짓기나 개방형 생성 작업에는 단 하나의 고정된 정답이 존재하지 않아 지도 정답을 정의하기 어렵다.",
        "언어 모델링 손실 함수는 치명적인 사실 오류와 단순 표현 차이를 동일한 토큰 오류로 취급한다.",
        "인터넷 텍스트를 수집하는 사전 학습 비용보다 지도학습 정답 라벨을 수집하는 비용이 훨씬 저렴하다.",
        "사람이 작성한 정답 레이블 자체가 항상 최적의 답변이 아닐 수 있다."
      ],
      answer: 2,
      explanation: "사람이 직접 작성한 정답 레이블 데이터를 수집하는 것은 매우 비싼 비용이 듭니다. 창의적 태스크의 정답 부재, 토큰 레벨 오류의 동일 취급, 인간 정답의 비최적성 등은 모두 인스트럭션 튜닝의 대표적 한계입니다.",
      hint: "라벨링 비용과 개방형 질문의 정답 부재 문제를 비교해보세요."
    },
    {
      id: "cat2-chatgpt-training-setup-easy-017",
      conceptId: "chatgpt-sft-data-collection",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "ChatGPT의 초기 지도 미세조정(SFT) 단계에서 인간 AI 트레이너들이 대화 데이터를 구축한 방법은?",
      options: [
        "공개된 웹 검색 엔진의 상위 1개 검색 결과 스니펫만을 그대로 수집하여 구성하였다.",
        "실제 사용자의 비공개 채팅 로그를 별도의 필터링 과정 없이 그대로 학습에 주입하였다.",
        "수학 및 코딩 문제에 대해 컴파일 통과 여부만을 자동으로 채점하여 레이블을 부여하였다.",
        "작업자가 사용자(User)와 AI 어시스턴트 양쪽 역할을 모두 직접 수행하며 대화를 작성하였다."
      ],
      answer: 3,
      explanation: "OpenAI는 ChatGPT 학습 시 human AI trainers가 user와 AI assistant 양쪽 역할(played both sides)을 직접 맡아 고품질 대화 데이터를 구축했습니다.",
      hint: "트레이너가 1인 2역으로 대화를 작성한 방식을 떠올려보세요."
    },
    {
      id: "cat2-reward-hacking-nature-easy-018",
      conceptId: "reward-hacking-overoptimization",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "강화학습 과정에서 나타나는 '리워드 해킹(Reward Hacking)' 현상에 대한 설명으로 옳은 것은?",
      options: [
        "모델이 정답 여부와 무관하게 그럴듯하고 도움이 되어 보이는 응답을 생성하여 환각을 유발한다.",
        "보상 모델의 예측 점수와 실제 인간의 선호도가 완전히 일치하여 사실에 입각한 답변만 출력된다.",
        "정책 모델이 보상 획득을 포기하고 사전 학습 단계의 단순 텍스트 완성 모드로 자동 회귀한다.",
        "보상 모델의 예측 점수가 낮아질수록 실제 사용자의 만족도와 정답 정확도가 지속적으로 상승한다."
      ],
      answer: 0,
      explanation: "리워드 해킹(Reward hacking)이 발생하면 챗봇이 정답 여부와 상관없이 그럴듯하고 생산적으로 보이는 응답을 생성하여 환각(Hallucination) 문제를 유발합니다.",
      hint: "보상 점수만 높게 받으려고 겉보기에만 좋은 답변을 만들어내는 부작용입니다."
    },
    {
      id: "cat2-rlvr-definition-easy-019",
      conceptId: "rlvr-verifiable-reward-mechanism",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "DeepSeek-R1 등에서 성공적으로 적용된 RLVR(Reinforcement Learning with Verifiable Reward)의 특징으로 가장 알맞은 것은?",
      options: [
        "인간 평가자 집단이 수만 개의 응답 문장에 대해 1~10점 척도로 주관적 채점을 수행하고 평균 점수를 보상으로 사용한다.",
        "수학 문제나 코드처럼 정답이 분명한 문제에서 정답 여부(0 또는 1)로 보상을 부여하여 강화학습한다.",
        "검색 엔진에서 가져온 외부 문서의 어휘 빈도수를 계산하여 TF-IDF 가중치를 보상으로 사용한다.",
        "문맥의 감정 상태를 분석하여 긍정적인 단어 비율이 높을 때만 가산점 보상을 부여한다."
      ],
      answer: 1,
      explanation: "RLVR은 수학 문제처럼 답이 분명한 문제에서 정답 여부(맞으면 1, 틀리면 0)로 검증 가능한 보상(Verifiable Reward)을 주어 강화학습을 수행하는 기법입니다.",
      hint: "정답 검증기(Verifier)를 통해 객관적으로 보상을 줄 수 있는 문제에 적용됩니다."
    },
    {
      id: "cat2-human-preference-subjectivity-easy-020",
      conceptId: "human-preference-subjectivity-problems",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "주관식 질문('아인슈타인이 오늘날 살아있다면...')에 대해 Claude, Copilot, Gemini, GPT 등이 서로 다른 관점의 답변을 내놓는 현상이 시사하는 바로 적절한 것은?",
      options: [
        "모든 언어 모델은 동일한 사전 학습 데이터를 사용하므로 결국 출력 문장과 단어 순서가 완전히 동일하게 수렴한다.",
        "리워드 모델이 완벽하게 학습되면 모든 모델이 완전히 동일한 단어 시퀀스를 출력한다.",
        "개방형 질문은 수학 공식으로 정답 검증이 가능하므로 RLVR 방식을 통해서만 학습된다.",
        "주관적이고 개방적인 질문에서는 인간의 선호 기준이 다양하며 유일한 정답이 존재하지 않는다."
      ],
      answer: 3,
      explanation: "개방형/주관식 질문에는 단일 정답이 존재하지 않으며, 사용자나 평가자에 따라 선호하는 답변 스타일이 달라져 인간의 선호도가 다양하게 나타납니다.",
      hint: "개방형 질문에서 모델마다 다른 답변이 생성되는 이유를 생각해보세요."
    },
    {
      id: "cat2-pairwise-comparison-easy-021",
      conceptId: "pairwise-preference-modeling",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "RLHF에서 리워드 모델을 학습시킬 때, 절대 점수를 직접 매기지 않고 응답 간의 비교(Pairwise comparison) 방식을 사용하는 주된 이유는?",
      options: [
        "평가자마다 절대 점수 부여 기준이 주관적이고 일관성이 떨어지기 때문에",
        "절대 점수를 부여하면 모델이 생성한 토큰의 교차 엔트로피 손실이 항상 0으로 수렴하기 때문에",
        "비교 방식을 적용해야만 프롬프트 입력 없이도 비라벨 데이터로 자기지도학습을 진행할 수 있기 때문에",
        "단일 텍스트 평가 시 발생하는 GPU 메모리 병목 현상을 완전히 제거할 수 있기 때문에"
      ],
      answer: 0,
      explanation: "인간의 판단은 일관성이 떨어지고 기준이 어긋날 수 있으므로, 직접 점수를 매기지 않고 응답을 비교(Pairwise comparison)하는 방식을 활용하여 리워드 모델을 학습시킵니다.",
      hint: "평가자 간 주관적 평가 편차와 비일관성을 해소하기 위한 접근입니다."
    },
    {
      id: "cat2-rlhf-pipeline-steps-easy-022",
      conceptId: "rlhf-three-steps-pipeline",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "InstructGPT 및 ChatGPT에서 정립된 RLHF의 3단계 파이프라인 진행 순서로 올바른 것은?",
      options: [
        "1. 비교 데이터 수집 및 보상 모델 학습 -> 2. 비라벨 데이터 자기지도 사전 학습 -> 3. DPO 확률 최적화로 최종 정책 모델 직접 학습",
        "1. PPO 강화학습으로 정책 최적화 -> 2. 자기지도 사전학습 -> 3. 보상 모델 학습",
        "1. 지도 미세조정(SFT) -> 2. RLVR 검증기 구축 -> 3. 비라벨 텍스트 마스킹",
        "1. 시범 데이터 기반 지도 미세조정(SFT) -> 2. 비교 데이터 수집 및 보상 모델 학습 -> 3. PPO 강화학습으로 정책 최적화"
      ],
      answer: 3,
      explanation: "RLHF 파이프라인은 Step 1: 시범 데이터 수집 및 감독 학습(SFT), Step 2: 비교 데이터 수집 및 보상 모델(RM) 학습, Step 3: PPO 강화학습으로 정책 최적화 순으로 진행됩니다.",
      hint: "SFT로 기초를 다진 후 보상 모델을 만들고 강화학습으로 정책을 업데이트합니다."
    },
    {
      id: "cat2-reward-scaling-easy-023",
      conceptId: "reward-model-scaling-accuracy",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "리워드 모델(Reward Model)의 크기 및 데이터 규모에 따른 평가 정확도 변화에 대한 설명으로 옳은 것은?",
      options: [
        "데이터 크기를 늘리더라도 리워드 모델의 크기가 작으면 검증 정확도가 급격히 하락한다.",
        "리워드 모델의 검증 정확도는 인간 앙상블 수준을 초과하여 항상 완벽한 정확도에 도달한다.",
        "충분히 많은 데이터로 학습된 큰 크기의 리워드 모델은 단일 인간의 평가 수준에 근접한다.",
        "모델 크기가 증가하더라도 단일 인간의 평가 정확도를 넘어설 수 없도록 수학적으로 제한된다."
      ],
      answer: 2,
      explanation: "충분히 많은 데이터(64k)로 학습한 큰 크기의 리워드 모델은 단일 인간의 평가 수준(Human baseline)에 근접합니다.",
      hint: "리워드 모델의 크기와 학습 데이터가 함께 증가할 때 64K 지점의 평가 정확도를 떠올리세요."
    },
    {
      id: "cat2-dpo-core-concept-easy-024",
      conceptId: "dpo-reinforcement-learning-removal",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "DPO(Direct Preference Optimization, Rafailov et al., 2023)가 기존 RLHF 파이프라인을 혁신한 핵심 구조는?",
      options: [
        "인간의 선호 비교 데이터를 전혀 사용하지 않고 사전 학습된 토큰 마스킹 손실만 끝까지 그대로 재활용한다.",
        "보상 모델을 여러 개 앙상블하여 각 보상 점수의 평균값을 강화학습 에이전트에 전달한다.",
        "사용자 질문에 대해 외부 지식베이스를 탐색하는 검색기(Retriever)를 모델 내부에 통합한다.",
        "PPO 강화학습 루프와 별도의 보상 모델 없이, 선호 비교 데이터로 정책 모델의 확률을 직접 최적화한다."
      ],
      answer: 3,
      explanation: "DPO는 RLHF에서 RL(강화학습)을 제거하고, 별도의 보상 모델 없이 선호 데이터(preference data)를 이용해 언어 모델의 확률을 직접 최적화합니다.",
      hint: "'RLHF에서 RL을 제거하자'는 접근법입니다."
    },
    {
      id: "cat2-rm-overopt-graph-easy-025",
      conceptId: "reward-model-over-optimization-graph",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "보상 모델 과최적화(Reward model over-optimization) 그래프에서 나타나는 현상으로 가장 적절한 것은?",
      options: [
        "RM 예측 점수와 실제 인간 선호도 모두 지도 기준선과의 거리에 비례하여 지속 증가한다.",
        "RM 예측 점수는 계속 상승하지만 실제 인간 선호도는 특정 시점 이후 급격히 하락한다.",
        "RM 예측 점수는 점진적으로 감소하고 실제 인간 선호도는 기하급수적으로 증가한다.",
        "지도 기준선과의 거리와 무관하게 두 지표 모두 중간 수준에서 일정한 평형을 유지한다."
      ],
      answer: 1,
      explanation: "지도 기준선과의 거리(KL divergence)가 멀어질수록 RM prediction 점수는 계속 오르지만, 실제 인간 선호도(Actual preference)는 피크를 지난 후 급락할 수 있습니다.",
      hint: "보상 모델만 과도하게 믿고 최적화했을 때 실제 인간 만족도가 떨어지는 현상입니다."
    },
    {
      id: "cat2-ppo-objective-role-easy-026",
      conceptId: "ppo-expected-reward-maximization",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "RLHF의 강화학습 단계에서 정책 모델(Policy Model)이 최적화하고자 하는 수학적 목표로 옳은 것은?",
      options: [
        "사전 학습 코퍼스에 등장하는 모든 희귀 단어의 역문서 빈도(IDF)의 최대화",
        "생성된 응답의 토큰 길이를 항상 10토큰 이내로 강제 제한하는 손실의 최소화",
        "외부 지식베이스에 저장된 인덱스 벡터와 질의 벡터 간 유클리드 거리의 최대화",
        "언어모델의 응답 중 리워드 모델이 산출하는 기대 보상(Expected Reward)의 최대화"
      ],
      answer: 3,
      explanation: "RLHF에서 정책 모델 최적화의 목표는 언어 모델이 생성한 응답의 기대 보상 E[R(x, y_hat)]을 최대화하는 것입니다.",
      hint: "강화학습에서 에이전트(정책 모델)가 최대화하려는 대상을 생각해보세요."
    },
    {
      id: "cat2-bradley-terry-loss-easy-027",
      conceptId: "bradley-terry-reward-model",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "리워드 모델(RM) 학습에 활용되는 Bradley-Terry 쌍대 비교 모델 기반 손실 함수의 기본 원리로 옳은 것은?",
      options: [
        "모든 생성 단어의 교차 엔트로피 손실을 계산하여 정책 모델의 파라미터를 역전파로 직접 업데이트한다.",
        "정답 문서와 생성 문서 간의 코사인 유사도를 계산하여 임베딩 잠재 공간에서의 유클리드 거리를 최소화한다.",
        "선호된 응답의 보상 점수가 비선호된 응답의 점수보다 높아지도록 손실을 최소화한다.",
        "보상 모델의 출력을 이진 분류 확률로 변환하여 0과 1 사이의 균일 분포를 유지하도록 학습한다."
      ],
      answer: 2,
      explanation: "리워드 모델은 Bradley-Terry 모델을 기반으로 선호 응답(y^w)의 점수가 비선호 응답(y^l)보다 높아지도록 손실을 최소화하여 훈련합니다.",
      hint: "승리한 샘플(y^w)이 패배한 샘플(y^l)보다 더 높은 점수를 받도록 만드는 원리입니다."
    },
    {
      id: "cat2-dpo-acronym-short-easy-028",
      conceptId: "dpo-full-name",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "short-answer",
      prompt: "복잡한 강화학습 단계를 거치지 않고 인간의 선호 데이터를 활용해 모델을 직접 최적화하는 기법인 'DPO'의 영문 풀네임을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Direct Preference Optimization",
        "direct preference optimization",
        "Direct preference optimization"
      ],
      explanation: "DPO는 Direct Preference Optimization의 약어입니다.",
      hint: "Direct Pxxxxxxxxx Optimization (3단어)"
    },
    {
      id: "cat2-rlvr-acronym-short-easy-029",
      conceptId: "rlvr-full-name",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "short-answer",
      prompt: "수학 문제나 프로그래밍 코드와 같이 정답 여부가 명확한 도메인에서 자동 검증을 통해 보상을 부여하는 사후 학습 기법인 'RLVR'의 영문 풀네임을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Reinforcement Learning with Verifiable Reward",
        "reinforcement learning with verifiable reward",
        "Reinforcement learning with verifiable reward",
        "Reinforcement Learning with Verifiable Rewards"
      ],
      explanation: "RLVR은 Reinforcement Learning with Verifiable Reward의 약어입니다.",
      hint: "Reinforcement Learning with Vxxxxxxxxx Reward"
    },
    {
      id: "cat2-rlhf-vs-dpo-essay-easy-030",
      conceptId: "rlhf-pipeline-and-dpo-comparison",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "essay",
      prompt: "RLHF(Reinforcement Learning from Human Feedback)의 3단계 파이프라인 구조를 각 단계별 역할과 함께 설명하고, 이후 제안된 DPO(Direct Preference Optimization)가 기존 RLHF의 구조적 복잡성을 어떻게 해결하였는지 비교하여 논하시오.",
      options: [],
      answer: null,
      modelAnswer: "1. RLHF의 3단계 파이프라인:\n- 1단계 (시범 데이터 수집 및 감독 학습/SFT): 프롬프트에 대해 사람이 작성한 이상적인 모범 답변 데이터를 사용해 기본 언어 모델을 미세조정(Fine-tuning)합니다.\n- 2단계 (비교 데이터 수집 및 보상 모델 학습): 모델이 생성한 여러 답변 후보에 대해 사람이 선호도 순위를 매기고, 이 순위 데이터를 학습하여 각 답변에 점수를 매기는 보상 모델(Reward Model)을 훈련합니다.\n- 3단계 (PPO 정책 최적화): 훈련된 보상 모델이 점수를 계산하고, PPO(Proximal Policy Optimization) 강화학습 알고리즘으로 정책 모델의 파라미터를 업데이트하여 보상을 극대화합니다.\n\n2. DPO의 구조적 개선점:\n- 기존 RLHF는 보상 모델 훈련과 PPO 강화학습 루프가 필요하여 훈련이 복잡하고 불안정하다는 한계가 있었습니다.\n- DPO(Direct Preference Optimization)는 별도의 보상 모델과 강화학습(RL) 단계를 완전히 제거하고, 사람이 비교한 선호 데이터(preference data)를 이용해 언어 모델의 확률 분포를 직접 최적화함으로써 파이프라인을 대폭 단순화하였습니다.",
      rubricKeywords: [
        "지도 미세조정",
        "보상 모델",
        "PPO 강화학습",
        "DPO",
        "보상 모델 제거",
        "직접 최적화"
      ],
      minLength: 160,
      explanation: "RLHF의 3단계(SFT -> RM -> PPO)와 DPO가 별도의 보상 모델 및 RL 루프를 없애고 선호 데이터를 직접 최적화한다는 핵심 차별점을 서술해야 합니다.",
      hint: "SFT, RM 학습, PPO의 3단계와 DPO의 'RL 및 보상 모델 제거'를 대비하세요."
    },

    // =========================================================================
    // 카테고리 3: 검색증강 생성 및 정보검색 (15문항: 객관식 12, 단답식 2, 서술형 1)
    // =========================================================================
    {
      id: "cat3-rag-fundamental-concept-easy-031",
      conceptId: "rag-basic-concept-separation",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "검색증강 언어모델(Retrieval-augmented LM, RAG)의 본질적인 동작 패러다임으로 가장 올바른 것은?",
      options: [
        "모든 세계 지식을 모델의 내부 파라미터에만 저장하고 외부 검색은 일절 배제하는 방식",
        "사용자 질의가 입력될 때마다 모델의 전체 가중치 파라미터를 실시간 역전파로 재학습하는 방식",
        "텍스트 문서를 모두 삭제하고 지식베이스의 그래프 트리플 관계만으로 추론을 한정하는 방식",
        "언어 모델과 비매개변수적 지식을 분리하여 추론 시 외부 데이터스토어의 정보를 검색해 결합하는 방식"
      ],
      answer: 3,
      explanation: "RAG는 언어 모델(Parametric Model)로부터 세계 지식 정보(Nonparametric Knowledge)를 분리하여, 추론(Test time) 시 외부 데이터스토어에서 관련 정보를 검색해 함께 활용하는 프레임워크입니다.",
      hint: "외부 지식을 검색하여 언어 모델의 컨텍스트로 전달하는 구조입니다."
    },
    {
      id: "cat3-rag-core-components-easy-032",
      conceptId: "rag-four-core-components",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "RAG 프레임워크를 구성하는 4대 기본 구성요소의 연결로 올바른 것은?",
      options: [
        "Encoder, Decoder, Actor, Critic",
        "Datastore, Query, Index, Language Model",
        "Prompt, Memory, Controller, Environment",
        "Term Frequency, Inverse Document Frequency, Policy, Verifier"
      ],
      answer: 1,
      explanation: "Retrieval-augmented LM의 4대 핵심 구성요소는 Datastore, Query, Index, Language Model입니다.",
      hint: "외부 지식 저장소, 질의, 검색용 색인, 답변을 생성하는 모델을 연결해 보세요."
    },
    {
      id: "cat3-datastore-characteristics-easy-033",
      conceptId: "datastore-unstructured-nature",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "RAG 시스템에서 활용되는 데이터스토어(Datastore)의 일반적인 특성에 대한 설명으로 옳지 않은 것은?",
      options: [
        "가공되지 않은 대규모 텍스트 코퍼스로 구성된다.",
        "최소 수십억에서 수조 단위의 방대한 토큰으로 구성될 수 있다.",
        "사람이 사전에 정답 문답 형태로 라벨링을 마친 지도학습 데이터셋이어야 한다.",
        "지식베이스(Knowledge base)와 같은 고정된 구조화 데이터에 국한되지 않는다."
      ],
      answer: 2,
      explanation: "Datastore는 가공되지 않은 대규모 텍스트 코퍼스로 구성되며, 사전에 라벨링된 데이터셋이나 구조화된 지식베이스가 아닙니다.",
      hint: "데이터스토어가 비정형 텍스트 코퍼스인지 생각해보세요."
    },
    {
      id: "cat3-sparse-retriever-pros-cons-easy-034",
      conceptId: "sparse-retriever-limitations",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "TF-IDF 및 BM-25와 같은 희소 검색기(Sparse Retriever)가 지닌 한계점으로 가장 알맞은 것은?",
      options: [
        "쿼리와 문서 간에 의미는 통하지만 표현 어휘가 다르면 문서를 검색하지 못한다.",
        "역색인(Inverted Index) 구조를 활용할 수 없어 대규모 데이터베이스 검색 속도가 느리다.",
        "검색 결과가 도출된 어휘적 근거를 역추적할 수 없는 완전한 블랙박스 모델이다.",
        "단어 가중치를 산출하기 위해 대규모 GPU 클러스터의 사전 학습 과정이 필수적이다."
      ],
      answer: 0,
      explanation: "Sparse Retriever는 어휘적 유사도에 기반하므로, 질의의 'bad guy'와 문서의 'villain'처럼 의미는 같지만 단어가 다른 경우 매칭되지 않는 한계(Limited semantic understanding)가 있습니다.",
      hint: "단어의 표면적 철자 일치 여부만 따지는 방식의 단점을 생각해보세요."
    },
    {
      id: "cat3-why-rag-unfrequent-knowledge-easy-035",
      conceptId: "why-rag-long-tail-knowledge",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "연구 결과(Mallen et al., 2023 / Kandpal et al., 2022)에 기반하여 RAG가 LLM에 제공하는 가장 핵심적인 효과는?",
      options: [
        "사전 학습된 모델의 모든 가중치를 0으로 초기화하여 미세조정 시간을 단축한다.",
        "언어 모델이 사전 학습 코퍼스에서 자주 보았던 일반 상식의 단순 암기 정확도를 보정한다.",
        "언어 모델이 파라미터 내부에 기억하지 못하는 희귀하고 등장 빈도가 낮은 지식의 정확도를 크게 향상시킨다.",
        "추론 과정에서 발생하는 언어 모델 디코더의 모든 신경망 연산 비용을 0으로 만든다."
      ],
      answer: 2,
      explanation: "거대 언어 모델은 사전 학습 데이터에 자주 나타나는 쉬운 정보를 기억하는 경향이 있으며, RAG는 자주 등장하지 않는 정보(희귀 지식)에 대해 큰 성능 향상 효과를 제공합니다.",
      hint: "사전학습에서 자주 나오지 않는 롱테일 지식에 미치는 영향을 생각해보세요."
    },
    {
      id: "cat3-rag-noise-robustness-easy-036",
      conceptId: "rag-noise-robustness-ability",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "RAG 시스템에서 검색 결과에 질문과 무관한 노이즈 문서가 포함되어 있을 때 요구되는 능력은?",
      options: [
        "검색된 문서에 정답 근거가 없을 때 억지 추측을 하지 않고 모른다고 응답하는 능력",
        "외부 검색 문서에 관련 없는 노이즈가 섞여 있어도 올바른 정보를 식별하여 정답을 생성하는 능력",
        "사용자 질의의 문법적 오류를 스스로 교정하여 검색 질의로 재작성하는 능력",
        "모델의 내부 사전 지식과 검색 문서가 상충할 때 내부 지식을 우선하여 출력하는 능력"
      ],
      answer: 1,
      explanation: "Noise Robustness는 외부 검색 문서에 관련 없는 정보(노이즈)가 섞여 있어도 올바른 정보를 식별하고 정답을 생성하는 능력입니다.",
      hint: "노이즈가 섞인 검색 결과 속에서 정답을 골라내는 견고성입니다."
    },
    {
      id: "cat3-rag-negative-rejection-easy-037",
      conceptId: "rag-negative-rejection-ability",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "외부 검색 문서에 사용자의 질문에 대한 답이 전혀 존재하지 않을 때, RAG 모델이 취해야 할 올바른 동작은?",
      options: [
        "내부 파라미터 지식을 우선하여 가장 그럴듯한 내용을 추정해 답변한다.",
        "검색된 문서 중 가장 유사한 문장의 내용을 무조건 정답으로 인용한다.",
        "여러 검색 문서의 내용을 결합하여 가장 가능성이 높은 사실을 새로 합성한다.",
        "검색된 문서에 정답 근거가 부족함을 밝히고 답변 생성을 거절한다."
      ],
      answer: 3,
      explanation: "Negative Rejection은 검색한 문서에 질문 관련 정보가 없을 때 모델이 억지 추측을 하지 않고 '문서에 정보가 없어 답변할 수 없다'고 명확히 답변을 거부하는 능력입니다.",
      hint: "검색 결과에 근거가 없을 때 답변을 거절하는 메커니즘입니다."
    },
    {
      id: "cat3-tfidf-weight-calculation-easy-038",
      conceptId: "tfidf-formula-and-stopwords",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "희소 검색기(Sparse Retriever)의 TF-IDF 수식 w = tf * log(N / df)에서, 모든 문서에 흔하게 등장하는 불용어(Stopwords)의 가중치가 낮아지는 원리는?",
      options: [
        "단어가 포함된 문서 수(df)가 전체 문서 수(N)에 근접하여 log(N / df) 값이 0에 가까워지기 때문에",
        "문서 내 단어 등장 빈도(tf)가 음수 값으로 변환되어 전체 가중치가 상쇄되기 때문에",
        "역문서 빈도(IDF)가 무한대로 발산하여 임베딩 공간에서 계산 예외가 발생하기 때문에",
        "단어의 글자 수가 짧을수록 코사인 유사도 벡터의 크기가 0으로 수렴하기 때문에"
      ],
      answer: 0,
      explanation: "'this, is, and'처럼 너무 많은 문서에 등장하는 단어는 df가 커져 IDF 값인 log(N/df)가 낮아지므로 전체 가중치가 0에 가까워집니다.",
      hint: "너무 흔한 단어는 정보 구별력이 떨어져 IDF 값이 작아집니다."
    },
    {
      id: "cat3-dense-retriever-contrastive-easy-039",
      conceptId: "dense-retriever-bi-encoder-loss",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "밀집 검색기(Dense Retriever)의 Bi-encoder가 대조 학습(Contrastive Learning)을 통해 학습되는 원리는?",
      options: [
        "쿼리와 문서를 하나의 문장으로 이어 붙여 모든 토큰 간 Self-Attention을 계산한다.",
        "쿼리 벡터가 긍정 문서 벡터와는 가까워지고, 부정 문서 벡터와는 멀어지도록 학습한다.",
        "모든 단어의 출현 빈도를 세어 희소 역문서 빈도 행렬을 구성한다.",
        "문서의 텍스트 길이를 균일하게 맞추기 위해 패딩 토큰의 가중치를 최대화한다."
      ],
      answer: 1,
      explanation: "Bi-encoder는 대조 학습을 통해 잠재 공간에서 쿼리가 긍정 문서와는 가까워지고 부정 문서와는 멀어지도록 학습합니다.",
      hint: "Positive 샘플은 가깝게, Negative 샘플은 멀어지게 하는 학습 원리입니다."
    },
    {
      id: "cat3-bi-vs-cross-encoder-tradeoff-easy-040",
      conceptId: "bi-encoder-vs-cross-encoder-tradeoff",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "Dense Retriever의 Bi-encoder와 Cross-encoder 구조를 비교한 설명으로 가장 올바른 것은?",
      options: [
        "Bi-encoder는 두 텍스트를 결합 처리하므로 정확도가 높지만 대규모 검색 속도가 매우 느리다.",
        "Cross-encoder는 문서를 사전에 벡터로 임베딩하여 대규모 인덱싱 검색에 직접 활용된다.",
        "Bi-encoder는 개별 인코딩으로 대규모 검색에 적합하고, Cross-encoder는 세밀한 교차 어텐션으로 재순위화에 적합하다.",
        "두 방식 모두 쿼리와 문서 간의 토큰 상호작용 방식과 연산 비용이 완전히 동일하다."
      ],
      answer: 2,
      explanation: "Bi-encoder는 두 문장을 따로 인코딩하여 매우 빠르고 대규모 검색에 적합하며, Cross-encoder는 두 문장을 결합하여 Self-attention으로 세밀한 상호작용을 포착하므로 정확도가 높아 재순위화(Re-ranking)에 주로 사용됩니다.",
      hint: "속도(Bi-encoder)와 정밀도(Cross-encoder)의 차이를 생각해보세요."
    },
    {
      id: "cat3-knowledge-conflict-grounding-easy-041",
      conceptId: "rag-knowledge-conflict-resolution",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "모델 내부의 사전 지식과 검색된 컨텍스트 문서의 정보가 상충(Knowledge Conflict)할 때 해결 방안으로 옳은 것은?",
      options: [
        "주어진 컨텍스트에만 철저히 기반하여 답변하도록 그라운딩(Grounding) 학습 및 지시를 강화한다.",
        "모델의 사전 지식을 무조건 우선하도록 시스템 프롬프트의 신뢰도를 고정한다.",
        "두 지식의 중간값을 산술 평균하여 새로운 가설적 사실을 합성한다.",
        "충돌이 감지되는 즉시 시스템 에러 로그를 출력하고 추론 루프를 중단한다."
      ],
      answer: 0,
      explanation: "사전 지식과 컨텍스트 간 충돌(Conflict)이 발생할 경우, 'Ignore what you know and generate an answer based only on the given context'와 같이 컨텍스트 위에서만 답변하는 Grounding 학습 강화를 통해 해결합니다.",
      hint: "검색된 컨텍스트에 답변을 단단히 묶어두는(Grounding) 해결책을 생각해보세요."
    },
    {
      id: "cat3-counterfactual-robustness-easy-042",
      conceptId: "rag-counterfactual-robustness",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "검색된 외부 문서 자체에 '2004년 올림픽은 뉴욕에서 열렸다'와 같은 명백한 사실 오류가 포함되어 있을 때 RAG 시스템에 요구되는 대응 능력은?",
      options: [
        "문서의 오류를 그대로 수용하여 질의에 맞게 확장 요약한다.",
        "문서에 포함된 사실 오류를 감지하고 정정하여 올바른 사실을 응답한다.",
        "문서 내의 모든 고유명사를 자동으로 마스킹 처리하여 보존한다.",
        "해당 문서를 영구 보상 모델의 부정 샘플로 등록하여 가중치를 갱신한다."
      ],
      answer: 1,
      explanation: "Counterfactual Robustness는 반사실적 외부 문서(오류 문서)가 주어졌을 때 '제공된 문서에는 사실 오류가 있습니다. 정답은 아테네입니다'와 같이 오류를 대응해내는 능력입니다.",
      hint: "외부 문서의 사실 오류를 감지하고 정정하는 견고성입니다."
    },
    {
      id: "cat3-rag-three-steps-short-easy-043",
      conceptId: "rag-pipeline-three-steps",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "short-answer",
      prompt: "RAG 시스템이 사용자 질문을 받아 최종 답변을 생성하기까지 거치는 3가지 핵심 처리 단계의 명칭을 순서대로 화살표(->) 또는 쉼표로 연결하여 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "질의 추출 -> 문서 검색 -> 언어모델 추론",
        "질의 추출, 문서 검색, 언어모델 추론",
        "질의추출 -> 문서검색 -> 언어모델추론",
        "질의추출, 문서검색, 언어모델추론",
        "질의 추출 -> 문서 검색 -> 언어 모델 추론",
        "질의 추출, 문서 검색, 언어 모델 추론"
      ],
      explanation: "RAG 파이프라인은 (1) 질의 추출 -> (2) 문서 검색 -> (3) 언어모델 추론의 3단계를 거칩니다.",
      hint: "질문에서 검색 질의를 만들고, 문서를 찾은 뒤, 언어 모델이 답을 생성하는 순서입니다."
    },
    {
      id: "cat3-rag-retriever-short-easy-044",
      conceptId: "retriever-module-term",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "short-answer",
      prompt: "RAG 시스템에서 사용자의 질문(Query)을 입력받아 외부 데이터 저장소에서 가장 관련성 높은 후보 문서를 찾아오는 역할을 담당하는 모듈의 영문 명칭을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Retriever",
        "retriever",
        "리트리버",
        "검색기"
      ],
      explanation: "사용자의 질의(Query)에 맞는 후보 문서를 저장소에서 찾아오는 모듈을 Retriever(검색기)라고 부릅니다.",
      hint: "검색을 수행하는 핵심 모듈의 영문 단어입니다."
    },
    {
      id: "cat3-rag-reasons-essay-easy-045",
      conceptId: "why-rag-four-core-reasons",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "essay",
      prompt: "거대 언어 모델(LLM) 환경에서 사전 학습 가중치에만 의존하지 않고 검색증강 생성(RAG) 프레임워크를 도입해야 하는 핵심 이유 4가지를 구체적으로 설명하시오.",
      options: [],
      answer: null,
      modelAnswer: "1. 파라미터 기억 용량 한계 극복 (희귀 지식 보완):\n거대 언어 모델은 사전 학습 데이터에 자주 등장하는 지식은 잘 기억하지만, 등장 빈도가 낮은 희귀 정보는 파라미터에 모두 저장하지 못합니다. RAG는 외부 저장소를 참조하여 희귀 지식에 대한 성능을 크게 높여줍니다.\n\n2. 지식의 최신성 유지 및 용이한 갱신:\n언어 모델이 보유한 지식은 시간이 지나면 뒤처지며 지식 편집 메서드는 확장성이 부족합니다. 반면 RAG의 외부 저장소(Datastore)는 모델 재학습 없이도 쉽게 업데이트할 수 있습니다.\n\n3. 답변의 해석 및 검증 가능성 제공:\n순수 LLM의 응답은 검증이 어려우나, RAG는 검색된 원본 문서 출처(Reference)를 제시할 수 있어 사용자가 사실 여부를 명확히 해석하고 검증할 수 있습니다.\n\n4. 사내 보안 및 비공개 데이터의 안전한 활용:\n기업 내부 정보와 같은 보안 데이터를 모델 학습에 활용하면 정보 유출 위험이 있습니다. RAG를 활용하면 사내 데이터를 모델 파라미터에 영구 학습시키지 않고도 안전하게 질의응답 시스템을 구축할 수 있습니다.",
      rubricKeywords: [
        "희귀 정보",
        "최신 지식 갱신",
        "해석 및 검증 가능성",
        "출처 제공",
        "보안 정보",
        "사내 데이터"
      ],
      minLength: 180,
      explanation: "RAG 도입의 4가지 핵심 이유인 파라미터 기억 한계, 최신 지식 갱신, 답변 검증·해석 가능성, 사내 보안 정보 보호를 체계적으로 설명해야 합니다.",
      hint: "파라미터 기억 한계, 최신 정보 갱신, 출처 검증, 기업 보안 문서의 4가지 관점을 서술하세요."
    },

    // =========================================================================
    // 카테고리 4: 거대 언어 모델의 도구 활용 및 에이전트 (15문항: 객관식 12, 단답식 2, 서술형 1)
    // =========================================================================
    {
      id: "cat4-agent-definition-easy-046",
      conceptId: "ai-agent-classical-definition",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "multiple-choice",
      prompt: "AI 분야에서 정의하는 에이전트(Agent)의 기본 상호작용 개념으로 옳은 것은?",
      options: [
        "환경을 인지하고 판단한 결과를 바탕으로 환경에 행동을 수행하는 시스템",
        "환경을 인지하지만 외부 환경에는 행동하지 않고 상태만 예측하는 시스템",
        "외부 환경과 상호작용하지 않고 내부 지식만으로 텍스트를 생성하는 시스템",
        "외부 문서를 검색해 답변하지만 환경에 직접 행동하지 않는 검색 시스템"
      ],
      answer: 0,
      explanation: "에이전트는 센서(Sensors)를 통해 환경을 인지하고, 액추에이터(Actuators)를 통해 환경에 작용하는 행동(Action)을 수행하는 주체로 정의됩니다.",
      hint: "센서(인지)와 액추에이터(행동)를 통한 환경과의 상호작용 루프를 떠올려보세요."
    },
    {
      id: "cat4-agent-framework-controller-easy-047",
      conceptId: "agent-framework-four-elements",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "multiple-choice",
      prompt: "LLM Agent 프레임워크의 4대 핵심 구성요소 중 '사용자의 지시를 분석하여 실행 계획(Plan)을 수립하고 도구 사용을 지휘하는 핵심 두뇌'는?",
      options: [
        "Tool Set",
        "Controller",
        "Perceiver",
        "Environment"
      ],
      answer: 1,
      explanation: "Controller는 파운데이션 LLM을 기반으로 사용자 요청을 해석하고, 하위 태스크 계획을 세우며 적절한 도구 호출을 지휘하는 중심 제어 모듈입니다.",
      hint: "계획 수립과 지시 분석을 관장하는 중앙 제어 장치 명칭입니다."
    },
    {
      id: "cat4-agent-framework-perceiver-easy-048",
      conceptId: "agent-framework-perceiver-role",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "multiple-choice",
      prompt: "LLM Agent 프레임워크에서 환경(Environment)의 피드백이나 도구 실행 결과를 인지·요약하여 Controller에 전달하는 모듈은?",
      options: [
        "Controller",
        "Tool Set",
        "Perceiver",
        "Environment"
      ],
      answer: 2,
      explanation: "Perceiver는 환경의 실행 결과 및 피드백을 수집하고 요약하여 Controller가 다음 행동 결정을 내릴 수 있도록 돕는 인지 모듈입니다.",
      hint: "환경 피드백을 인지(Perceive)하고 요약하는 모듈입니다."
    },
    {
      id: "cat4-mcp-motivation-easy-049",
      conceptId: "mcp-standardization-motivation",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "multiple-choice",
      prompt: "최근 AI 생태계에서 Model Context Protocol(MCP)이 제안되고 주목받게 된 주된 배경은 무엇입니까?",
      options: [
        "JSON 통신 형식이 보안에 취약하여 모든 프로토콜을 바이너리 기계어로 대체하기 위해",
        "LLM 파라미터 크기를 100만 개 이하로 경량화하여 모바일 기기에서만 실행하기 위해",
        "강화학습에서 PPO 알고리즘의 보상 계산 속도를 10배 이상 높이기 위해",
        "모델과 플랫폼마다 도구 호출 및 컨텍스트 연동 방식이 파편화되어 있어 표준화된 연결 규격이 필요했기 때문에"
      ],
      answer: 3,
      explanation: "MCP는 다양한 AI 모델과 도구/데이터 저장소 간의 연동 규격이 제각각이던 파편화 문제를 해결하고 표준화된 개방형 통신 프로토콜을 제공하기 위해 등장했습니다.",
      hint: "회사와 모델마다 도구 연결 방식이 달라 생기는 호환성 문제를 해결하려는 목적입니다."
    },
    {
      id: "cat4-mcp-role-easy-050",
      conceptId: "mcp-universal-context-protocol",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "multiple-choice",
      prompt: "Model Context Protocol(MCP)이 AI 애플리케이션 개발에서 제공하는 구조적 이점으로 가장 적절한 것은?",
      options: [
        "각 모델 제공사별 도구 호출 규격을 독립적으로 유지하여 플랫폼별 최적화를 강화한다.",
        "외부 도구의 기능을 언어 모델 파라미터에 직접 학습시켜 별도의 연결 방식을 제거한다.",
        "모델과 외부 도구·데이터 사이의 연결 규칙을 표준화하여 상호운용성과 재사용성을 높인다.",
        "특정 모델에서만 사용할 수 있도록 도구 인터페이스를 하나의 폐쇄형 규격으로 통합한다."
      ],
      answer: 2,
      explanation: "MCP는 모델과 외부 도구 사이의 연결 규칙을 공통 프로토콜로 표준화함으로써 다양한 플랫폼 간의 호환성과 도구 재사용성을 극대화합니다.",
      hint: "표준화된 프로토콜을 통해 도구 재사용과 호환성을 달성하는 원리입니다."
    },
    {
      id: "cat4-tool-env-representation-easy-051",
      conceptId: "agent-environment-representation",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "multiple-choice",
      prompt: "전통적인 Web/App Agent가 특정 웹 애플리케이션과 상호작용하기 위해 활용하는 환경 정보의 예로 가장 적절한 것은?",
      options: [
        "HTML, DOM, API, Code",
        "보상 점수와 정책 그래디언트",
        "TF-IDF와 역색인 정보",
        "잠재 벡터와 확산 노이즈"
      ],
      answer: 0,
      explanation: "강의 교재에서는 전통적인 Web/App Agent가 소프트웨어와 상호작용할 때 HTML, DOM, API, Code 등의 환경 표현을 활용한다고 설명합니다.",
      hint: "웹 브라우저 및 앱 인터페이스를 구성하는 코드 및 구조 정보를 생각해보세요."
    },
    {
      id: "cat4-tool-use-paradigms-easy-052",
      conceptId: "tool-use-paradigms-mode-switch",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "multiple-choice",
      prompt: "LLM의 도구 사용 패러다임(Tool Use Paradigms)에서 나타나는 동적 모드 전환 메커니즘에 대한 설명으로 옳은 것은?",
      options: [
        "텍스트 생성 모드를 완전히 차단하고 항상 외부 API만을 직접 실행한다.",
        "도구가 호출되는 즉시 모델의 모든 파라미터가 비지도 역전파로 업데이트된다.",
        "도구 실행 결과가 반환되면 이전 대화 이력을 완전히 삭제하고 새로 시작한다.",
        "텍스트 생성 모드와 도구 실행 모드 간을 동적으로 전환하며 API를 호출하고 결과를 문맥에 반영한다."
      ],
      answer: 3,
      explanation: "LLM은 텍스트 생성 모드와 도구 실행 모드 간을 동적으로 전환하며 API를 호출하고 반환된 결과를 문맥에 반영하여 최종 응답을 완성합니다.",
      hint: "텍스트 생성과 외부 도구 실행 간의 모드 전환 과정을 생각해보세요."
    },
    {
      id: "cat4-webgpt-imitation-easy-053",
      conceptId: "webgpt-imitation-learning",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "multiple-choice",
      prompt: "OpenAI의 WebGPT(2022)가 웹 검색 브라우징 도구를 학습하기 위해 사용한 주요 방법론은?",
      options: [
        "수학 공식 증명 데이터만을 활용해 정답 여부에 따른 바이너리 보상 학습만을 수행하였다.",
        "인간 작업자의 웹 검색 및 탐색 행동 궤적을 바탕으로 모방 학습(Imitation Learning/SFT)을 수행하였다.",
        "웹 브라우저의 HTML 소스 코드 전체를 사전 학습 단계의 가중치에 직접 인덱싱하였다.",
        "도구 호출 없이 프롬프트 엔지니어링만으로 가상의 검색 결과를 상상해 생성하게 하였다."
      ],
      answer: 1,
      explanation: "WebGPT는 사람이 웹 브라우저를 통해 검색 질의를 날리고 링크를 클릭하는 행동 궤적 데이터를 수집하여 모방 학습(Supervised Fine-Tuning)을 진행했습니다.",
      hint: "인간의 검색 도구 사용 행동 궤적을 모방하여 학습시킨 모델입니다."
    },
    {
      id: "cat4-toolformer-pipeline-easy-054",
      conceptId: "toolformer-three-steps-pipeline",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "multiple-choice",
      prompt: "Meta의 Toolformer 모델이 자기지도학습으로 도구 사용 능력을 획득하는 3단계 과정으로 올바른 것은?",
      options: [
        "1. API 호출 필터링 -> 2. 보상 모델 학습 -> 3. PPO 정책 최적화",
        "1. 웹 크롤링 -> 2. 역문서 빈도 계산 -> 3. Cross-encoder 재순위화",
        "1. DPO 최적화 -> 2. 토큰 마스킹 -> 3. 프롬프트 템플릿 조립",
        "1. API 호출 샘플링 -> 2. API 실행 -> 3. 언어 모델링 손실 감소 기준 API 호출 필터링"
      ],
      answer: 3,
      explanation: "Toolformer는 문맥에서 (1) 잠재적 API 호출을 샘플링하고, (2) 실행하여 결과를 얻은 뒤, (3) 토큰 예측 손실을 줄여주는 유용한 호출만 필터링하여 파인튜닝에 사용합니다.",
      hint: "샘플링(생성) -> 실제 실행 -> 손실 함수 기반 필터링의 순서입니다."
    },
    {
      id: "cat4-toolllm-toolbench-easy-055",
      conceptId: "toolllm-toolbench-rapidapi",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "multiple-choice",
      prompt: "ToolLLM 연구가 도구 학습 연구 분야에 기여한 핵심 차별점으로 옳은 것은?",
      options: [
        "단순 계산기 등 소수 툴을 넘어 RapidAPI 기반 16,000개 이상의 실제 REST API 환경(ToolBench)을 구축하였다.",
        "모든 외부 API 통신을 금지하고 로컬 파이썬 인터프리터만 사용하도록 제한하였다.",
        "인간의 피드백 데이터를 전혀 사용하지 않고 오직 자기지도 사전 학습만 수행하였다.",
        "텍스트 임베딩 모델의 차원을 512차원에서 2차원으로 축소하여 속도를 개선하였다."
      ],
      answer: 0,
      explanation: "ToolLLM은 실제 서비스되는 16,000개 이상의 실세계 REST API를 활용하여 ToolBench 데이터셋을 구축하고 대규모 도구를 다룰 수 있는 프레임워크를 제안했습니다.",
      hint: "16,000개 이상의 실제 실세계 API를 다룬 대규모 연구입니다."
    },
    {
      id: "cat4-computer-use-gui-agent-easy-056",
      conceptId: "gui-agent-multimodal-evolution",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "multiple-choice",
      prompt: "GUI 환경에서 동작하는 멀티모달 기반의 Computer Use Agent가 기존의 텍스트 기반 단일 API 도구 사용과 구별되는 핵심적인 특징은?",
      options: [
        "단일 터미널에서 고정된 텍스트 명령어만을 파싱하여 정적 실행한다.",
        "화면 인터페이스를 시각적으로 관찰하고 마우스 클릭 및 키보드 조작을 통해 소프트웨어를 제어한다.",
        "모든 GUI 위젯을 비라벨 텍스트 코퍼스로 변환한 후 역문서 빈도를 계산한다.",
        "파이썬 코드를 기계어로 컴파일하여 운영체제 커널 가중치를 직접 수정한다."
      ],
      answer: 1,
      explanation: "최근의 GUI 에이전트는 시각적 화면(스크린샷)을 관찰하고 마우스 클릭, 드래그, 키보드 입력 등 사람이 컴퓨터를 조작하는 방식으로 범용적인 태스크를 수행합니다.",
      hint: "스크린샷 인식과 마우스/키보드 액션을 결합한 범용 컴퓨터 조작 에이전트입니다."
    },
    {
      id: "cat4-agent-toolset-role-easy-057",
      conceptId: "agent-framework-toolset-role",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "multiple-choice",
      prompt: "LLM Agent 프레임워크의 Tool Set 구성요소의 역할로 가장 올바른 것은?",
      options: [
        "사용자 지시를 분석하여 하위 계획을 수립하는 핵심 추론 엔진",
        "환경의 변화를 감지하여 Controller에 보고하는 관찰 센서 모듈",
        "에이전트가 환경과 상호작용하기 위해 호출 가능한 외부 도구 및 API의 집합",
        "모델의 역전파 학습 속도를 높이기 위해 최적화 알고리즘을 관리하는 저장소"
      ],
      answer: 2,
      explanation: "Tool Set은 에이전트가 외부 환경과 상호작용하고 문제를 해결하기 위해 사용할 수 있는 외부 도구 및 API들의 집합입니다.",
      hint: "에이전트가 사용할 수 있는 도구들의 집합입니다."
    },
    {
      id: "cat4-toolformer-three-steps-short-easy-058",
      conceptId: "toolformer-three-steps-pipeline-terms",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "short-answer",
      prompt: "Meta의 Toolformer(2023) 모델이 비지도 텍스트로부터 도구 학습 데이터셋을 자체 구축할 때 거치는 3가지 핵심 처리 단계를 순서대로 작성하시오. (각 단계 사이를 화살표 '->' 또는 쉼표로 구분)",
      options: [],
      answer: null,
      acceptedAnswers: [
        "API 호출 샘플링 -> API 실행 -> API 호출 필터링",
        "API 호출 샘플링, API 실행, API 호출 필터링",
        "Sample API Calls -> Execute API Calls -> Filter API Calls",
        "Sample API Calls, Execute API Calls, Filter API Calls",
        "샘플링 -> 실행 -> 필터링",
        "샘플링, 실행, 필터링",
        "Sample -> Execute -> Filter",
        "Sample, Execute, Filter"
      ],
      explanation: "Toolformer의 데이터 구축 파이프라인은 (1) API 호출 샘플링(Sample) -> (2) API 실행(Execute) -> (3) 언어 모델링 손실 기준 API 호출 필터링(Filter) 순으로 진행됩니다.",
      hint: "샘플링(Sample) -> 실행(Execute) -> 필터링(Filter)"
    },
    {
      id: "cat4-agent-four-elements-short-easy-059",
      conceptId: "agent-framework-four-elements-terms",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "short-answer",
      prompt: "LLM Agent 프레임워크(Qin et al., 2023)를 구성하는 4대 핵심 구성요소의 영문 명칭을 쉼표(,)로 구분하여 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Controller, Perceiver, Tool Set, Environment",
        "Controller,Perceiver,Tool Set,Environment",
        "Controller, Perceiver, ToolSet, Environment",
        "Controller, Perceiver, Tools, Environment"
      ],
      explanation: "LLM Agent 프레임워크의 4대 구성요소는 Controller, Perceiver, Tool Set, Environment입니다.",
      hint: "Controller, Perceiver, Tool Set, Environment"
    },
    {
      id: "cat4-agent-and-mcp-essay-easy-060",
      conceptId: "agent-architecture-and-mcp-integration-essay",
      difficulty: "easy",
      category: "거대 언어 모델의 도구 활용 및 에이전트",
      questionType: "essay",
      prompt: "LLM Agent 프레임워크의 4대 핵심 구성요소(Controller, Perceiver, Tool Set, Environment)의 상호작용 메커니즘을 설명하고, 서로 다른 플랫폼 간의 도구 연동 파편화 문제를 해결하기 위해 도입된 Model Context Protocol(MCP)의 필요성과 핵심 역할을 논하시오.",
      options: [],
      answer: null,
      modelAnswer: "1. LLM Agent 4대 구성요소의 상호작용 메커니즘:\n- Controller: 파운데이션 LLM을 두뇌로 삼아 사용자의 질의를 해석하고, 목표 달성을 위한 하위 태스크 계획(Plan)을 수립하며 어떤 도구를 호출할지 결정합니다.\n- Tool Set: 계산기, 웹 검색, 데이터베이스 조회 등 에이전트가 활용할 수 있는 외부 도구 및 API의 집합입니다.\n- Environment: 도구가 실제로 실행되는 외부 환경(운영체제, 웹 브라우저, 외부 서버 등)입니다.\n- Perceiver: 환경에서 도구가 실행된 결과나 상태 변화 피드백을 감지하고 요약하여 다시 Controller에 전달합니다. Controller는 이 피드백을 바탕으로 다음 행동을 결정하거나 최종 답변을 생성합니다.\n\n2. MCP(Model Context Protocol)의 필요성과 역할:\n- 기존에는 AI 모델 제공사마다 도구 정의 스키마와 호출 인터페이스가 달라, 동일한 도구라도 플랫폼별로 매번 새로 구현해야 하는 파편화 및 재사용성 저하 문제가 있었습니다.\n- MCP는 모델과 도구/데이터 저장소 간의 통신 규격을 표준화하여, 도구 호출, 응답 전달, 컨텍스트 공유를 단일한 공통 오픈 프로토콜로 처리할 수 있게 합니다. 이를 통해 에이전트는 다양한 외부 도구와 데이터를 코드 수정 없이 유연하게 연동할 수 있습니다.",
      rubricKeywords: [
        "Controller",
        "Perceiver",
        "Tool Set",
        "Environment",
        "피드백 루프",
        "MCP",
        "파편화 해결",
        "표준 프로토콜"
      ],
      minLength: 200,
      explanation: "Agent 4대 구성요소의 유기적 상호작용(계획 -> 실행 -> 환경 반응 -> 인지 및 피드백)과, 도구 파편화 문제를 해결하는 MCP의 표준화 역할을 종합적으로 서술해야 합니다.",
      hint: "Controller/Perceiver/Tool Set/Environment의 역할과 MCP의 표준 프로토콜 역할을 연결하여 작성하세요."
    }
  ],
  medium: [],
  hard: [],
  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
