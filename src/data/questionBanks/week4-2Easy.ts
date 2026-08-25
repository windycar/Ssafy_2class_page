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
    // 카테고리 1: 사전 학습 vs 사후 학습 및 지시어 튜닝 (15문항)
    // =========================================================================
    {
      id: "cat1-pretrain-objective-easy-001",
      conceptId: "pretraining-objective",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "거대 언어 모델의 사전 학습 단계에서 수행하는 핵심 학습 목표는 무엇입니까?",
      options: [
        "사용자가 입력한 문장의 감정과 작업 유형을 분류하는 방식",
        "인간 평가자가 부여한 선호도 순위 점수를 최대화하는 방식",
        "주어진 문맥을 바탕으로 다음 단어를 예측하는 방식",
        "외부 문서 저장소에서 질의와 일치하는 키워드를 색인하는 방식"
      ],
      answer: 2,
      explanation: "사전 학습(Pre-training)은 방대한 텍스트 데이터를 바탕으로 자기지도학습을 진행하며, 핵심 목표는 다음 단어 예측(Next Token Prediction)입니다[cite: 1].",
      hint: "비라벨 텍스트의 앞 문맥을 바탕으로 뒤에 올 단어의 등장 확률을 높이는 기본 원리입니다[cite: 1]."
    },
    {
      id: "cat1-pretrain-limitation-easy-002",
      conceptId: "pretraining-completion-limitation",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "사전 학습만 거친 기본 언어 모델에 질문을 입력했을 때 나타나는 전형적인 반응으로 가장 적절한 것은?",
      options: [
        "질문에 대답하지 못하고 문맥상 이어질 법한 유사 질문들을 계속 나열한다.",
        "질문자의 의도를 파악하여 초등학생 수준에 맞춘 간결한 문장으로 요약한다.",
        "정답 여부를 확인하기 위해 외부 코드 실행기를 실행하여 결과를 검증한다.",
        "최신 문서 저장소에 접근하여 검색된 백과사전 출처와 함께 정답을 제시한다."
      ],
      answer: 0,
      explanation: "사전 학습만 수행된 모델은 다음 단어를 이어 쓰는 텍스트 완성에만 특화되어 있어, 질문에 직접 대답하기보다 유사한 프롬프트 문장들을 덧붙이는 경향이 있습니다[cite: 1].",
      hint: "지시를 수행하지 못하고 문맥을 단순히 이어 쓰려고만 하는 현상을 생각해보세요[cite: 1]."
    },
    {
      id: "cat1-posttrain-purpose-easy-003",
      conceptId: "posttraining-alignment-purpose",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "사전 학습된 기본 언어 모델에 사후 학습을 적용하는 주된 목적은 무엇입니까?",
      options: [
        "대규모 웹 문서로부터 기초적인 언어 문법 구조를 처음부터 새로 학습하기 위해",
        "신경망의 전체 파라미터 수를 대폭 줄여 모바일 기기용으로 경량화하기 위해",
        "외부 지식베이스의 정형 테이블 데이터를 모델 가중치에 직접 저장하기 위해",
        "사람이 원하는 방식으로 대화하고 안전하며 유용한 답변을 만들도록 조정하기 위해"
      ],
      answer: 3,
      explanation: "사후 학습(Post-training)은 유저의 의도를 파악하고 원하는 답변을 생성하도록 모델을 정렬하여 대화형 비서로서 안전하고 유용하게 만드는 과정입니다[cite: 1].",
      hint: "단순 문장 생성을 넘어 사용자의 명령 의도에 맞게 대화하도록 조정하는 목적입니다[cite: 1]."
    },
    {
      id: "cat1-instruction-tuning-nature-easy-004",
      conceptId: "instruction-tuning-supervised-nature",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "지시문 튜닝의 학습 데이터 및 방법론적 특성에 대한 설명으로 옳지 않은 것은?",
      options: [
        "사람이 작성하거나 검증한 지시문과 응답 쌍 데이터셋을 활용하여 미세조정을 진행한다.",
        "정답 레이블이 필요 없는 대규모 자기지도학습 방식으로만 수행된다.",
        "다양한 작업에 적응시켜 사전에 학습하지 않은 새로운 작업도 수행할 수 있게 한다.",
        "사전 학습된 기본 모델을 지시 수행에 맞게 조정하는 지도 미세조정의 일종이다."
      ],
      answer: 1,
      explanation: "지시문 튜닝(Instruction-tuning)은 정답 레이블이 없는 자기지도학습이 아니라, 명확한 정답 레이블(지시문-응답 쌍)을 사용하는 지도 미세조정(SFT) 방식입니다[cite: 1, 1].",
      hint: "정답 레이블이 명시적으로 주어지는 지도학습 기반인지 확인해보세요[cite: 1]."
    },
    {
      id: "cat1-super-natural-dataset-easy-005",
      conceptId: "super-natural-instructions-scale",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "지시문 학습을 위해 구축된 대규모 벤치마크 데이터셋인 슈퍼 내추럴 인스트럭션스의 구성 규모로 옳은 것은?",
      options: [
        "50개 미만의 작업과 10만 개 수준의 예시 데이터",
        "50만 개 이상의 코딩 문제와 1,000만 개 이상의 테스트 케이스",
        "100만 개 이상의 웹 문서와 10억 개 이상의 어휘 사전",
        "1,600개 이상의 다양한 작업과 300만 개 이상의 예시 데이터"
      ],
      answer: 3,
      explanation: "슈퍼 내추럴 인스트럭션스(Super-NaturalInstructions) 데이터셋은 1.6K개 이상의 작업과 3M개 이상의 예시 데이터로 구성되어 있습니다[cite: 1].",
      hint: "작업 수는 1.6K 이상, 예시 수는 3M 이상이라는 규모를 비교해보세요[cite: 1]."
    },
    {
      id: "cat1-mmlu-benchmark-easy-006",
      conceptId: "mmlu-evaluation-benchmark",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "거대 언어 모델의 지식과 이해 능력을 평가하기 위해 57개의 지식 작업을 측정하는 대표적인 벤치마크는?",
      options: [
        "MMLU",
        "BLEU",
        "ROUGE",
        "GLUE"
      ],
      answer: 0,
      explanation: "MMLU(Massive Multitask Language Understanding)는 초등 수학부터 전문 의학, 법률 등 57개의 지식을 요구하는 작업에서 모델의 성능을 평가하는 대표적인 벤치마크입니다[cite: 1].",
      hint: "57개의 지식 태스크를 다루는 대규모 다중 작업 언어 이해 벤치마크입니다[cite: 1]."
    },
    {
      id: "cat1-k-mmlu-characteristics-easy-007",
      conceptId: "k-mmlu-korean-domains",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "한국어 특화 지식 벤치마크인 K-MMLU가 평가하기 위해 포함하고 있는 고유 범주로 가장 적절한 것은?",
      options: [
        "영어 고전 문학의 직역 가능 여부와 라틴어 어원 분석",
        "한국의 법률, 지적제도사, 회계기준, 전통주 제조 등 한국 고유 지식",
        "글로벌 금융 시장의 실시간 초단타 매매 알고리즘 추론",
        "컴파일러 오류 메시지 분석과 리눅스 커널 소스 코드 검증"
      ],
      answer: 1,
      explanation: "K-MMLU는 한국의 지적제도사, 주택건설 기준, 회계기준, 전통주 제조 등 한국의 문화적, 지리적, 법률적 배경지식을 평가하도록 구성되었습니다[cite: 1, 1].",
      hint: "한국의 고유한 법률 규정 및 역사와 문화 지식을 요구하는 평가 영역입니다[cite: 1, 1]."
    },
    {
      id: "cat1-self-instruct-alpaca-easy-008",
      conceptId: "alpaca-self-instruct-method",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "알파카 모델이 기본 언어 모델을 지시 수행 모델로 튜닝하기 위해 활용한 데이터 구축 방식은?",
      options: [
        "수만 명의 작업자가 수작업으로 작성한 백과사전 질의응답을 크롤링하였다.",
        "사전 학습 코퍼스 전체에 대해 마스킹 토큰 복원 학습을 재수행하였다.",
        "175개의 시드 작업으로부터 상위 언어 모델을 활용해 52,000개의 지시 데이터를 생성하였다.",
        "인간 평가자가 매긴 순위 점수만을 바탕으로 강화학습 정책을 훈련하였다."
      ],
      answer: 2,
      explanation: "알파카(Alpaca)는 175개의 시드 작업으로부터 고성능 모델(text-davinci-003)을 활용해 52,000개의 지시어 추종 예시를 자동 생성하여 라마(LLaMA 7B) 모델을 지도 미세조정했습니다[cite: 1].",
      hint: "소수의 시드 작업으로부터 상위 모델을 이용해 합성 데이터를 생성한 사례입니다[cite: 1]."
    },
    {
      id: "cat1-lima-core-principle-easy-009",
      conceptId: "lima-less-is-more-principle",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "리마 연구가 지시문 튜닝 데이터의 규모와 관련하여 제시한 핵심 내용으로 옳은 것은?",
      options: [
        "지시문 튜닝에는 사전 학습에 비해 많은 데이터가 필요하지 않으며 약 1,000개의 고품질 예시로도 충분하다.",
        "지시어 추종 성능을 얻으려면 사전 학습 코퍼스보다 더 방대한 수억 건의 데이터셋이 필수적이다.",
        "사전 학습 단계의 파라미터 크기보다 파인튜닝 데이터셋의 토큰 수가 모델 성능을 완전히 결정한다.",
        "강화학습을 결합하지 않은 단순 지도 파인튜닝은 어떠한 정렬 효과도 내지 못한다."
      ],
      answer: 0,
      explanation: "LIMA 연구는 지시문 튜닝에 사전 학습만큼 많은 데이터가 필요하지 않으며, 약 1,000개 수준의 엄선된 고품질 데이터만으로도 강력한 정렬 효과를 달성할 수 있음을 보여주었습니다[cite: 1].",
      hint: "적은 데이터로도 충분하다는 관점의 연구입니다[cite: 1]."
    },
    {
      id: "cat1-instruction-vs-pretrain-sample-easy-010",
      conceptId: "pronoun-resolution-example",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "대명사 지칭 대상이 모호한 문장을 처리할 때 지시문 튜닝 이전과 이후의 차이로 옳은 것은?",
      options: [
        "튜닝 이전에는 단계적 추론으로 애매함을 판단했으나 튜닝 이후에는 오답 문장을 나열했다.",
        "튜닝 이전과 이후 모두 문맥을 이해하지 못하고 항상 첫 번째 보기만을 무조건 선택했다.",
        "튜닝 이전에는 문장 변형만 반복하며 답하지 못했으나 튜닝 이후에는 이유와 함께 애매하다는 결론을 도출했다.",
        "튜닝 이전에는 외부 문서를 검색해 풀었으나 튜닝 이후에는 내부 파라미터만으로 오답을 냈다."
      ],
      answer: 2,
      explanation: "지시 튜닝 이전의 모델은 질문에 답하지 못하고 문장을 변형하여 이어 쓰기만 했으나, 지시 튜닝 이후에는 지칭 대상이 불명확함을 파악하고 명확한 정답을 제시했습니다[cite: 1, 1].",
      hint: "지시 튜닝을 거친 모델은 문제의 의도를 이해하고 선택지 중 정답을 골라냅니다[cite: 1, 1]."
    },
    {
      id: "cat1-flan-t5-rationale-easy-011",
      conceptId: "flan-t5-cot-rationale",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "Flan-T5 모델 등에서 복잡한 질문에 답하기 전 중간 추론 근거를 제시하도록 학습시키는 이유는?",
      options: [
        "출력 토큰의 길이를 인위적으로 늘려 모델의 연산 손실을 0으로 고정하기 위해",
        "단계별 논리적 근거를 먼저 도출하게 하여 새로운 작업에 대한 추론 정확도를 높이기 위해",
        "사용자 프롬프트에서 불용어를 자동으로 제거하여 입력 길이를 줄이기 위해",
        "외부 검색 엔진을 강제로 호출하기 위한 대기 시간을 확보하기 위해"
      ],
      answer: 1,
      explanation: "Flan-T5에서는 최종 답변을 내기 전 단계별 논리적 근거(Rationale)를 먼저 생성하게 함으로써 학습하지 않은 새로운 작업에서도 문제 해결 능력을 향상시킵니다[cite: 1].",
      hint: "답변 전에 이유나 생각 과정을 먼저 설명하도록 유도하는 기법입니다[cite: 1]."
    },
    {
      id: "cat1-transfer-learning-concept-easy-012",
      conceptId: "transfer-learning-fine-tuning",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "multiple-choice",
      prompt: "이미 대규모 데이터로 사전 학습된 기본 모델에 특정 작업이나 도메인에 맞게 추가로 학습시키는 과정을 무엇이라고 합니까?",
      options: [
        "비라벨 코퍼스로 기초 패턴을 학습하는 사전 학습",
        "문맥 내 단어 벡터들의 평균을 계산하는 토큰 풀링",
        "사전 학습된 모델을 특정 작업이나 도메인에 맞게 추가 학습시키는 파인 튜닝",
        "어휘의 출현 위치를 효율적으로 기록하는 역색인"
      ],
      answer: 2,
      explanation: "사전 학습된 기존 기본 모델(Base LLM)에 특정 작업이나 도메인 데이터를 활용해 추가로 가중치를 적응시키는 과정을 파인 튜닝(Fine-tuning)이라고 합니다[cite: 1].",
      hint: "사전 학습된 모델을 특정 목적에 맞게 미세조정하는 과정입니다[cite: 1]."
    },
    {
      id: "cat1-alpaca-size-short-easy-013",
      conceptId: "alpaca-dataset-count",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "short-answer",
      prompt: "스탠퍼드 연구진이 라마 7B 기본 모델을 알파카 모델로 미세조정할 때 생성하여 활용한 지시어 추종 데이터의 총개수를 작성하시오. (K 단위 또는 숫자로 작성)",
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
      explanation: "알파카(Alpaca) 모델은 175개의 시드 작업으로부터 생성된 52,000개(52K)의 지시어 추종 예시 데이터로 학습되었습니다[cite: 1].",
      hint: "175개의 시드 작업에서 생성된 50K대 지시 데이터 규모를 떠올려보세요[cite: 1]."
    },
    {
      id: "cat1-pretrain-task-short-easy-014",
      conceptId: "next-token-prediction-term",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "short-answer",
      prompt: "사전 학습 단계에서 언어 모델이 주어진 앞선 단어들을 바탕으로 다음에 이어질 가장 적절한 단어를 맞히도록 훈련하는 학습 기법의 영문 명칭을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Next Token Prediction",
        "next token prediction",
        "Next-Token Prediction",
        "Next token prediction"
      ],
      explanation: "사전 학습 단계의 핵심 학습 목표는 문맥에 맞는 다음 단어를 예측하는 Next Token Prediction입니다[cite: 1].",
      hint: "Next로 시작하는 3단어의 영문 표현입니다[cite: 1]."
    },
    {
      id: "cat1-pre-vs-post-essay-easy-015",
      conceptId: "pretraining-vs-posttraining-comparison",
      difficulty: "easy",
      category: "사전 학습 vs 사후 학습 및 지시어 튜닝",
      questionType: "essay",
      prompt: "거대 언어 모델의 개발 과정에서 사전 학습과 사후 학습의 차이점을 사용하는 데이터의 형태와 모델이 달성하고자 하는 목적의 관점에서 비교하여 설명하시오.",
      options: [],
      answer: null,
      modelAnswer: "1. 데이터 형태의 차이:\n사전 학습은 대규모 비라벨 텍스트 데이터를 활용해 별도의 정답 라벨 없이 자기지도학습을 진행합니다[cite: 1]. 반면 사후 학습은 사람이 작성하거나 검증한 지시문-응답 쌍 데이터셋이나 선호 순위 비교 데이터를 활용합니다[cite: 1, 1].\n\n2. 학습 목적의 차이:\n사전 학습의 목적은 방대한 텍스트로부터 다음 단어를 예측하며 언어 패턴과 일반적인 지식을 습득하는 것입니다[cite: 1]. 반면 사후 학습의 목적은 사전 학습된 모델이 사람의 지시 의도를 정확히 이해하고 사용자가 원하는 방식으로 안전하고 유용하게 대화하도록 모델을 정렬하는 것입니다[cite: 1, 1].",
      rubricKeywords: [
        "비라벨 데이터",
        "자기지도학습",
        "지시문-응답 쌍",
        "다음 단어 예측",
        "사용자 의도",
        "정렬"
      ],
      minLength: 140,
      explanation: "사전 학습(비라벨 텍스트, 다음 단어 예측, 지식 습득)과 사후 학습(라벨 데이터, 지시문 추종, 안전하고 유용한 대화 정렬)의 핵심 차이를 서술해야 합니다[cite: 1].",
      hint: "비라벨 텍스트 기반 다음 단어 예측과 지시어-응답 쌍 기반 대화 정렬을 비교하세요[cite: 1]."
    },

    // =========================================================================
    // 카테고리 2: 인간 피드백 기반 강화학습 및 정렬 (15문항)
    // =========================================================================
    {
      id: "cat2-instruction-limitation-easy-016",
      conceptId: "instruction-tuning-limitations",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "단순 지도 지시문 튜닝만으로 인간의 선호를 완전히 만족시키기 어려운 한계점으로 옳지 않은 것은?",
      options: [
        "창의적 글짓기나 개방형 생성 작업에는 단 하나의 고정된 정답이 존재하지 않는다.",
        "인터넷 텍스트를 수집하는 사전 학습 비용보다 지도학습 정답 라벨을 수집하는 비용이 훨씬 저렴하다.",
        "언어 모델링 손실 함수는 치명적인 사실 오류와 단순 표현 차이를 동일한 토큰 오류로 취급한다.",
        "사람이 만든 답변 자체가 항상 최적이 아닐 수 있다."
      ],
      answer: 1,
      explanation: "사람이 직접 작성한 정답 레이블 데이터를 수집하는 것은 매우 비쌉니다[cite: 1]. 정답 부재, 토큰 오류 동일 취급, 사람 답변의 비최적성 등은 지시문 튜닝의 실제 한계점입니다[cite: 1].",
      hint: "정답 데이터를 수집하는 비용과 관련된 설명을 확인해보세요[cite: 1]."
    },
    {
      id: "cat2-pairwise-comparison-easy-017",
      conceptId: "pairwise-preference-modeling",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "인간 피드백 기반 강화학습에서 보상 모델을 학습시킬 때 절대 점수 대신 두 응답 간의 비교 방식을 사용하는 주된 이유는?",
      options: [
        "인간의 판단은 일관성이 부족하고 기준이 어긋날 수 있기 때문에",
        "비교 방식을 사용하면 연산 메모리를 전혀 소모하지 않기 때문에",
        "절대 점수를 매기면 모델 디코더의 가중치가 0으로 수렴하기 때문에",
        "비교 방식은 프롬프트 지시문 없이도 비지도 학습이 가능하기 때문에"
      ],
      answer: 0,
      explanation: "인간의 판단은 일관성이 떨어지고 기준이 어긋나기 쉬우므로, 직접 점수를 매기지 않고 응답을 상대적으로 비교하는 방식을 활용하여 보상 모델을 안정적으로 학습시킵니다[cite: 1, 1].",
      hint: "인간 평가자의 주관적 평가 편차와 비일관성을 해결하기 위한 접근입니다[cite: 1]."
    },
    {
      id: "cat2-rlhf-pipeline-steps-easy-018",
      conceptId: "rlhf-three-steps-pipeline",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "인간 피드백 기반 강화학습의 3단계 파이프라인 진행 순서로 올바른 것은?",
      options: [
        "비교 데이터 수집 및 보상 모델 학습 -> 지도 미세조정 -> 확률 직접 최적화",
        "시범 데이터 기반 지도 미세조정 -> 비교 데이터 수집 및 보상 모델 학습 -> 강화학습 정책 최적화",
        "강화학습 정책 최적화 -> 대규모 자기지도 사전학습 -> 보상 모델 학습",
        "지도 미세조정 수행 -> 자동 검증기 기반 채점 -> 비라벨 텍스트 마스킹"
      ],
      answer: 1,
      explanation: "표준 RLHF 파이프라인은 1단계: 시범 데이터 수집 및 지도학습(SFT), 2단계: 비교 데이터 수집 및 보상 모델(RM) 학습, 3단계: PPO 강화학습으로 정책 최적화 순으로 진행됩니다[cite: 1].",
      hint: "지도학습으로 기초를 다진 후 보상 모델을 만들고 강화학습으로 정책을 업데이트합니다[cite: 1]."
    },
    {
      id: "cat2-reward-model-role-easy-019",
      conceptId: "reward-model-function",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "강화학습 파이프라인에서 보상 모델이 수행하는 핵심 역할은 무엇입니까?",
      options: [
        "사용자의 질문에 대해 외부 문서를 검색해오는 역할",
        "비라벨 텍스트 코퍼스를 단어 단위로 분할하는 역할",
        "모델의 답변에 대해 인간의 선호도를 모사하여 점수를 매기는 역할",
        "입력된 프롬프트의 다음 단어 등장 확률을 계산하는 역할"
      ],
      answer: 2,
      explanation: "보상 모델은 순위 데이터를 학습하여 언어 모델의 각 응답에 대해 인간의 선호도를 모사한 보상 점수를 부여하는 역할을 합니다[cite: 1].",
      hint: "답변의 품질에 대해 점수 피드백을 주는 모듈입니다[cite: 1]."
    },
    {
      id: "cat2-bradley-terry-loss-easy-020",
      conceptId: "bradley-terry-reward-model",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "보상 모델 학습에 활용되는 쌍대 비교 모델 기반 손실 함수의 기본 원리로 옳은 것은?",
      options: [
        "모든 생성 단어의 교차 엔트로피 손실을 계산하여 가중치를 역전파한다.",
        "정답 문서와의 코사인 유사도를 계산하여 임베딩 공간의 거리를 최소화한다.",
        "보상 모델의 출력값을 0과 1 사이의 이진 값으로 고정하여 정확도만 측정한다.",
        "선호된 응답의 보상 점수가 비선호된 응답의 점수보다 높아지도록 학습한다."
      ],
      answer: 3,
      explanation: "보상 모델은 브래들리-테리(Bradley-Terry) 모델을 바탕으로 선호된 답변의 점수가 비선호된 답변보다 더 높은 점수를 받도록 손실 함수를 최적화합니다[cite: 1].",
      hint: "선호 샘플의 점수를 비선호 샘플의 점수보다 높이는 방향입니다[cite: 1]."
    },
    {
      id: "cat2-reward-scaling-easy-021",
      conceptId: "reward-model-scaling-accuracy",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "보상 모델의 크기 및 데이터 규모 증가에 따른 평가 정확도 변화에 대한 설명으로 옳은 것은?",
      options: [
        "충분히 많은 데이터로 학습한 큰 크기의 보상 모델은 단일 인간의 평가 수준에 근접한다.",
        "데이터 크기를 늘리더라도 보상 모델의 크기가 작으면 검증 정확도가 급격히 하락한다.",
        "보상 모델의 검증 정확도는 인간 앙상블 수준을 항상 초과하여 100%에 도달한다.",
        "모델 크기가 증가해도 보상 예측 정확도에는 어떠한 변화도 발생하지 않는다."
      ],
      answer: 0,
      explanation: "충분히 많은 데이터(64k)로 학습한 대형 보상 모델은 단일 인간 평가자의 기준선 수준에 근접합니다[cite: 1].",
      hint: "데이터와 모델 크기가 충분할 때 단일 인간 평가 수준에 가까워지는 관계를 떠올려보세요[cite: 1]."
    },
    {
      id: "cat2-chatgpt-training-setup-easy-022",
      conceptId: "chatgpt-sft-data-collection",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "챗지피티의 초기 지도 미세조정 단계에서 대화 데이터를 구축한 방법으로 옳은 것은?",
      options: [
        "공개된 웹 검색 엔진의 상위 검색 결과만을 그대로 복사하여 구성하였다.",
        "실제 사용자의 비공개 채팅 로그를 별도의 필터링 없이 그대로 학습에 주입하였다.",
        "인간 트레이너가 사용자와 인공지능 어시스턴트 양쪽 역할을 모두 직접 수행하며 대화를 작성하였다.",
        "수학 및 코딩 문제에 대해 컴파일 통과 여부만을 자동으로 채점하여 레이블을 부여하였다."
      ],
      answer: 2,
      explanation: "오픈에이아이(OpenAI)는 초기 모델 학습을 위해 인간 트레이너가 사용자와 인공지능 양쪽 역할을 모두 수행(played both sides)하며 고품질 대화 데이터를 구축했습니다[cite: 1].",
      hint: "트레이너가 1인 2역으로 모범 대화를 구성한 방식입니다[cite: 1]."
    },
    {
      id: "cat2-reward-hacking-nature-easy-023",
      conceptId: "reward-hacking-overoptimization",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "강화학습 과정에서 나타나는 리워드 해킹 현상에 대한 설명으로 옳은 것은?",
      options: [
        "보상 모델의 예측 점수와 실제 인간 선호도가 완전히 일치하여 항상 진실된 답변만 출력된다.",
        "모델이 정답 여부와 무관하게 겉보기에 그럴듯하고 도움이 되어 보이는 응답을 생성하여 환각을 유발한다.",
        "정책 모델이 보상 획득을 포기하고 사전 학습 단계의 단순 텍스트 완성 모드로 자동 회귀한다.",
        "보상 모델의 예측 점수가 낮아질수록 실제 사용자의 만족도와 정답 정확도가 지속적으로 상승한다."
      ],
      answer: 1,
      explanation: "리워드 해킹(Reward hacking)이 발생하면 챗봇이 실제 사실 여부와 상관없이 겉보기에 유용하고 생산적인 것처럼 보이는 답변을 만들어 환각 문제를 일으킵니다[cite: 1].",
      hint: "보상 점수만 높게 받으려고 겉보기에만 좋은 답변을 생성하는 부작용입니다[cite: 1]."
    },
    {
      id: "cat2-rm-overopt-graph-easy-024",
      conceptId: "reward-model-over-optimization-graph",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "보상 모델 과최적화 그래프에서 나타나는 현상으로 가장 적절한 것은?",
      options: [
        "보상 모델 예측 점수와 실제 인간 선호도 모두 지속적으로 동일하게 증가한다.",
        "보상 모델 예측 점수는 감소하고 실제 인간 선호도는 기하급수적으로 증가한다.",
        "보상 모델 예측 점수는 계속 상승하지만 실제 인간 선호도는 특정 시점 이후 급격히 하락한다.",
        "기준선과의 거리와 무관하게 두 지표 모두 일정한 평형을 유지한다."
      ],
      answer: 2,
      explanation: "보상 모델을 과도하게 최적화하면 기준 모델과의 거리가 멀어짐에 따라 보상 예측 점수는 계속 오르지만 실제 인간의 선호도는 피크를 지나 급락합니다[cite: 1].",
      hint: "보상 점수는 올라가는데 실제 만족도는 떨어지는 괴리 현상입니다[cite: 1]."
    },
    {
      id: "cat2-dpo-core-concept-easy-025",
      conceptId: "dpo-reinforcement-learning-removal",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "직접 선호 최적화 기법이 기존 강화학습 파이프라인을 단순화한 핵심 구조는 무엇입니까?",
      options: [
        "인간의 선호 비교 데이터를 배제하고 텍스트 마스킹 손실만 재활용한다.",
        "보상 모델을 여러 개 앙상블하여 각 보상 점수의 평균값을 전달한다.",
        "사용자의 질문에 대해 외부 문서를 검색하는 모듈을 내부에 통합한다.",
        "보상 모델과 강화학습 없이 선호 데이터를 이용해 모델을 직접 최적화한다."
      ],
      answer: 3,
      explanation: "DPO(Direct Preference Optimization)는 별도의 보상 모델과 복잡한 강화학습(PPO) 단계를 제거하고, 인간의 선호 데이터를 활용해 언어 모델을 직접 최적화합니다[cite: 1].",
      hint: "강화학습 루프를 제거하고 직접 확률을 최적화하는 기법입니다[cite: 1]."
    },
    {
      id: "cat2-rlvr-definition-easy-026",
      conceptId: "rlvr-verifiable-reward-mechanism",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "검증 가능한 보상을 활용하는 강화학습 기법의 특징으로 가장 알맞은 것은?",
      options: [
        "인간 평가자 집단이 수만 개의 응답 문장에 대해 주관적 채점을 수행한다.",
        "수학 문제나 코드처럼 정답이 분명한 문제에서 정답 여부로 보상을 부여하여 강화학습한다.",
        "외부 검색 엔진에서 가져온 문서의 어휘 빈도수를 계산하여 보상으로 사용한다.",
        "문장의 감정 상태가 긍정적일 때만 높은 보상을 주는 감정 분석 기반 최적화를 수행한다."
      ],
      answer: 1,
      explanation: "RLVR(Reinforcement Learning with Verifiable Reward)은 수학이나 코딩처럼 정답 여부가 명확히 검증 가능한 영역에서 정답 여부(0 또는 1)로 보상을 부여하여 모델을 훈련합니다[cite: 1].",
      hint: "답이 명확한 문제에서 자동 채점 결과를 보상으로 활용하는 방식입니다[cite: 1]."
    },
    {
      id: "cat2-human-preference-subjectivity-easy-027",
      conceptId: "human-preference-subjectivity-problems",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "multiple-choice",
      prompt: "주관식 질문에 대해 여러 최신 인공지능 모델들이 서로 다른 관점의 답변을 내놓는 현상이 시사하는 바로 적절한 것은?",
      options: [
        "주관적이고 개방적인 질문에서는 인간의 선호 기준이 다양하며 유일한 정답이 존재하지 않는다.",
        "모든 언어 모델은 동일한 사전 학습 데이터를 사용하므로 출력이 완전히 동일하게 수렴한다.",
        "보상 모델이 완벽하게 학습되면 모든 모델이 완전히 동일한 단어 시퀀스를 출력한다.",
        "개방형 질문은 수학 공식으로 정답 검증이 가능하므로 자동 검증 방식으로만 학습된다."
      ],
      answer: 0,
      explanation: "개방형 및 주관식 질문에는 고정된 단일 정답이 없으며, 평가자나 모델에 따라 강조하는 지점과 선호하는 답변 스타일이 달라집니다[cite: 1].",
      hint: "개방형 질문에서 단일 정답이 존재하기 어려운 이유를 생각해보세요[cite: 1]."
    },
    {
      id: "cat2-dpo-acronym-short-easy-028",
      conceptId: "dpo-full-name",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "short-answer",
      prompt: "복잡한 강화학습 단계를 거치지 않고 인간의 선호 데이터를 활용해 모델을 직접 최적화하는 기법인 DPO의 영문 전체 명칭을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Direct Preference Optimization",
        "direct preference optimization",
        "Direct preference optimization"
      ],
      explanation: "DPO는 Direct Preference Optimization의 약어입니다[cite: 1].",
      hint: "Direct Pxxxxxxxxx Optimization (3단어)"
    },
    {
      id: "cat2-rlvr-acronym-short-easy-029",
      conceptId: "rlvr-full-name",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "short-answer",
      prompt: "수학 문제나 프로그래밍 코드와 같이 정답 여부가 명확한 도메인에서 자동 검증을 통해 보상을 부여하는 사후 학습 기법인 RLVR의 영문 전체 명칭을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Reinforcement Learning with Verifiable Reward",
        "reinforcement learning with verifiable reward",
        "Reinforcement learning with verifiable reward",
        "Reinforcement Learning with Verifiable Rewards"
      ],
      explanation: "RLVR은 Reinforcement Learning with Verifiable Reward의 약어입니다[cite: 1].",
      hint: "Reinforcement Learning with Vxxxxxxxxx Reward"
    },
    {
      id: "cat2-rlhf-vs-dpo-essay-easy-030",
      conceptId: "rlhf-pipeline-and-dpo-comparison",
      difficulty: "easy",
      category: "인간 피드백 기반 강화학습 및 정렬",
      questionType: "essay",
      prompt: "인간 피드백 기반 강화학습의 3단계 파이프라인 구조를 설명하고, 이후 제안된 직접 선호 최적화 기법이 기존 강화학습 파이프라인을 어떻게 단순화하였는지 비교하여 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "1. 인간 피드백 기반 강화학습의 3단계 구조:\n- 1단계: 프롬프트에 대해 사람이 작성한 이상적인 정답 데이터를 사용해 기본 언어 모델을 지도 미세조정(SFT)합니다[cite: 1].\n- 2단계: 모델이 생성한 여러 답변 후보에 대해 사람이 순위를 매기고, 이 비교 데이터를 학습해 각 답변에 점수를 매기는 보상 모델을 훈련합니다[cite: 1].\n- 3단계: 보상 모델이 점수를 계산하고, 강화학습 알고리즘(PPO)으로 정책 모델의 파라미터를 업데이트하여 보상을 극대화합니다[cite: 1].\n\n2. 직접 선호 최적화(DPO)의 단순화 구조:\n직접 선호 최적화 기법은 별도의 보상 모델 훈련과 복잡한 강화학습 단계를 완전히 제거하고, 사람이 비교한 선호 데이터를 언어 모델의 목적함수에 직접 연결하여 확률 분포를 최적화함으로써 파이프라인을 대폭 단순화하였습니다[cite: 1].",
      rubricKeywords: [
        "지도 미세조정",
        "SFT",
        "보상 모델",
        "강화학습",
        "PPO",
        "보상 모델 제거",
        "직접 최적화"
      ],
      minLength: 140,
      explanation: "RLHF의 3단계(SFT -> 보상 모델 -> PPO 강화학습)와 DPO가 별도의 보상 모델 및 강화학습 루프를 제거하고 선호 데이터를 직접 최적화한다는 차이점을 서술해야 합니다[cite: 1, 1].",
      hint: "3단계 파이프라인과 DPO의 강화학습 및 보상 모델 제거 원리를 대비하세요[cite: 1, 1]."
    },

    // =========================================================================
    // 카테고리 3: 검색증강 생성 및 정보검색 (15문항)
    // =========================================================================
    {
      id: "cat3-rag-fundamental-concept-easy-031",
      conceptId: "rag-basic-concept-separation",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "검색증강 언어모델의 본질적인 동작 패러다임으로 가장 올바른 것은?",
      options: [
        "모든 세계 지식을 모델의 내부 파라미터에만 저장하고 외부 검색은 일절 배제하는 방식",
        "사용자 질의가 입력될 때마다 모델의 전체 가중치 파라미터를 실시간 역전파로 재학습하는 방식",
        "텍스트 문서를 모두 삭제하고 지식베이스의 그래프 관계만으로 추론을 한정하는 방식",
        "언어 모델과 외부 지식을 분리하여 추론 시점에 외부 데이터스토어의 정보를 검색해 결합하는 방식"
      ],
      answer: 3,
      explanation: "검색증강 언어모델(RAG)은 언어 모델의 내부 지식과 외부 세계 지식을 분리하여, 추론(Test time) 시점에 외부 데이터 저장소에서 관련 정보를 검색해 생성에 활용하는 구조입니다[cite: 1, 1].",
      hint: "추론 시점에 외부 지식을 검색하여 언어 모델의 입력으로 결합하는 프레임워크입니다[cite: 1]."
    },
    {
      id: "cat3-rag-core-components-easy-032",
      conceptId: "rag-four-core-components",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "검색증강 생성 프레임워크를 구성하는 4대 기본 구성요소의 연결로 올바른 것은?",
      options: [
        "인코더, 디코더, 액터, 크리틱",
        "데이터스토어, 질의, 인덱스, 언어 모델",
        "프롬프트, 메모리, 컨트롤러, 환경",
        "단어 빈도, 역문서 빈도, 정책, 검증기"
      ],
      answer: 1,
      explanation: "검색증강 언어모델(RAG)의 4대 핵심 구성요소는 데이터스토어(Datastore), 질의(Query), 인덱스(Index), 언어 모델(Language Model)입니다[cite: 1].",
      hint: "저장소, 검색어, 색인, 추론 모델의 조합입니다[cite: 1]."
    },
    {
      id: "cat3-datastore-characteristics-easy-033",
      conceptId: "datastore-unstructured-nature",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "검색증강 생성 시스템에서 활용되는 데이터스토어의 일반적인 특성에 대한 설명으로 옳지 않은 것은?",
      options: [
        "가공되지 않은 대규모 텍스트 코퍼스로 구성된다.",
        "최소 수십억에서 수조 단위의 방대한 토큰으로 구성될 수 있다.",
        "사람이 사전에 정답 문답 형태로 라벨링을 마친 지도학습 데이터셋이어야 한다.",
        "지식베이스와 같은 고정된 구조화 데이터에 국한되지 않는다."
      ],
      answer: 2,
      explanation: "데이터스토어(Datastore)는 라벨링된 지도학습 데이터셋이나 고도로 구조화된 지식베이스가 아니라, 가공되지 않은 대규모 텍스트 코퍼스를 의미합니다[cite: 1].",
      hint: "비정형 텍스트 코퍼스인지 라벨링된 정답 데이터셋인지 구별해보세요[cite: 1]."
    },
    {
      id: "cat3-sparse-retriever-pros-cons-easy-034",
      conceptId: "sparse-retriever-limitations",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "단어 빈도 기반의 희소 검색기가 지닌 대표적인 한계점으로 가장 알맞은 것은?",
      options: [
        "질의와 문서 간에 의미는 통하지만 표현 단어가 다르면 문서를 검색하지 못한다.",
        "역색인 구조를 활용할 수 없어 대규모 데이터베이스 검색 속도가 매우 느리다.",
        "검색 결과가 도출된 어휘적 근거를 역추적할 수 없는 완전한 블랙박스 모델이다.",
        "단어 가중치를 산출하기 위해 대규모 신경망 사전 학습 과정이 필수적이다."
      ],
      answer: 0,
      explanation: "희소 검색기(Sparse Retriever)는 표면적 단어 일치에 기반하므로, 동의어나 유의어처럼 의미는 같지만 표현이 다른 경우 문서를 찾아내지 못하는 한계가 있습니다[cite: 1].",
      hint: "표면적 철자 일치에만 의존하는 방식의 단점을 생각해보세요[cite: 1]."
    },
    {
      id: "cat3-why-rag-unfrequent-knowledge-easy-035",
      conceptId: "why-rag-long-tail-knowledge",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "연구 결과에 기반하여 검색증강 생성이 언어 모델에 제공하는 가장 핵심적인 효과는?",
      options: [
        "언어 모델이 사전 학습 데이터에서 자주 보았던 일반 상식 정보의 단순 암기율 보정",
        "언어 모델이 파라미터 내부에 기억하지 못하는 희귀하고 등장 빈도가 낮은 지식의 정확도 향상",
        "토큰 생성 시 문맥적 문법 오류를 자동으로 교정하여 문장 구조의 일관성 유지",
        "사전 학습된 베이스 모델의 어휘 사전 크기를 실시간으로 두 배 이상 확장"
      ],
      answer: 1,
      explanation: "언어 모델은 사전 학습 데이터에 자주 등장하는 지식은 잘 기억하지만, 등장 빈도가 낮은 희귀 정보는 잘 기억하지 못합니다[cite: 1, 2]. RAG는 이러한 희귀 지식에 대해 큰 성능 향상을 제공합니다[cite: 1].",
      hint: "사전학습에서 자주 나오지 않는 롱테일 정보에 대한 보완 효과입니다[cite: 1]."
    },
    {
      id: "cat3-rag-noise-robustness-easy-036",
      conceptId: "rag-noise-robustness-ability",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "검색 결과에 질문과 무관한 노이즈 문서가 포함되어 있을 때 모델에 요구되는 능력은?",
      options: [
        "검색된 문서에 정답 근거가 없을 때 억지 추측을 하지 않고 모른다고 응답하는 능력",
        "사용자 질의의 문법적 오류를 스스로 교정하여 검색 질의로 재작성하는 능력",
        "외부 검색 문서에 관련 없는 노이즈가 섞여 있어도 올바른 정보를 식별하여 정답을 생성하는 능력",
        "모델의 내부 사전 지식과 검색 문서가 상충할 때 내부 지식을 우선하여 출력하는 능력"
      ],
      answer: 2,
      explanation: "노이즈 견고성(Noise Robustness)은 검색된 문서들 사이에 관련 없는 노이즈 정보가 섞여 있어도 모델이 올바른 근거를 식별해 정답을 맞히는 능력입니다[cite: 1, 1].",
      hint: "노이즈가 포함된 검색 결과 속에서 올바른 답을 찾아내는 견고성입니다[cite: 1]."
    },
    {
      id: "cat3-rag-negative-rejection-easy-037",
      conceptId: "rag-negative-rejection-ability",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "외부 검색 문서에 사용자의 질문에 대한 답이 전혀 존재하지 않을 때 모델이 취해야 할 올바른 동작은?",
      options: [
        "내부 파라미터 지식을 우선하여 가장 그럴듯한 내용을 추정해 답변한다.",
        "검색된 문서 중 가장 유사한 문장의 내용을 무조건 정답으로 인용한다.",
        "여러 검색 문서의 내용을 결합하여 가장 가능성이 높은 사실을 새로 합성한다.",
        "검색된 문서에 정답 근거가 부족함을 밝히고 답변 생성을 거절한다."
      ],
      answer: 3,
      explanation: "부정 응답 거절(Negative Rejection)은 검색된 문서에 질문 관련 정보가 없을 때 억지로 환각 답변을 지어내지 않고 정보가 없어 답변할 수 없다고 거절하는 능력입니다[cite: 1, 1].",
      hint: "근거가 없을 때 답변을 거절하는 안전한 동작입니다[cite: 1]."
    },
    {
      id: "cat3-tfidf-weight-calculation-easy-038",
      conceptId: "tfidf-formula-and-stopwords",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "희소 검색기의 가중치 계산에서 모든 문서에 흔하게 등장하는 불용어의 가중치가 낮아지는 원리는?",
      options: [
        "단어가 포함된 문서 수가 전체 문서 수에 근접하여 역문서 빈도 값이 0에 가까워지기 때문에",
        "문서 내 단어 등장 빈도가 음수 값으로 변환되어 전체 가중치가 상쇄되기 때문에",
        "역문서 빈도가 무한대로 발산하여 임베딩 공간에서 계산 예외가 발생하기 때문에",
        "단어의 글자 수가 짧을수록 코사인 유사도 벡터의 크기가 0으로 수렴하기 때문에"
      ],
      answer: 0,
      explanation: "모든 문서에 등장하는 흔한 단어는 문서 빈도(df)가 전체 문서 수(N)에 가까워져 역문서 빈도인 IDF 값이 0에 가까워지므로 최종 가중치가 낮아집니다[cite: 1, 1].",
      hint: "너무 흔한 단어는 역문서 빈도 값이 작아집니다[cite: 1]."
    },
    {
      id: "cat3-dense-retriever-bi-encoder-easy-039",
      conceptId: "dense-retriever-bi-encoder-loss",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "밀집 검색기의 바인코더가 대조 학습을 통해 학습되는 원리로 옳은 것은?",
      options: [
        "질의와 문서를 하나의 문장으로 이어 붙여 모든 토큰 간 상호 어텐션을 계산한다.",
        "질의 벡터가 긍정 문서 벡터와는 가까워지고 부정 문서 벡터와는 멀어지도록 학습한다.",
        "모든 단어의 출현 빈도를 세어 희소 역문서 빈도 행렬을 구성한다.",
        "문서의 텍스트 길이를 균일하게 맞추기 위해 패딩 토큰의 가중치를 최대화한다."
      ],
      answer: 1,
      explanation: "바인코더(Bi-encoder)는 대조 학습(Contrastive Learning)을 통해 잠재 공간에서 질의가 긍정적인 문서와는 가까워지고 부정적인 문서와는 멀어지도록 학습합니다[cite: 1].",
      hint: "긍정 문서는 가깝게, 부정 문서는 멀어지게 하는 벡터 학습 원리입니다[cite: 1]."
    },
    {
      id: "cat3-bi-vs-cross-encoder-tradeoff-easy-040",
      conceptId: "bi-encoder-vs-cross-encoder-tradeoff",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "밀집 검색기에서 바인코더와 크로스인코더 구조를 비교한 설명으로 가장 올바른 것은?",
      options: [
        "바인코더는 결합 상호작용으로 재순위화에 유리하고 크로스인코더는 독립 인코딩으로 후보 검색에 유리하다.",
        "바인코더는 실시간 웹 문서 크롤링에 전담 활용되고 크로스인코더는 오프라인 벡터 색인 구축에 전담 활용된다.",
        "바인코더는 독립 인코딩으로 대규모 검색에 유리하고 크로스인코더는 세밀한 상호작용으로 재순위화에 유리하다.",
        "바인코더는 어휘적 키워드 일치 검색에 전담 활용되고 크로스인코더는 역문서 빈도 계산에 전담 활용된다."
      ],
      answer: 2,
      explanation: "바인코더는 두 문장을 따로 인코딩하여 매우 빠르고 대규모 검색에 적합하며, 크로스인코더는 두 문장을 결합하여 세밀한 상호작용을 포착해 정확도가 높아 재순위화에 주로 쓰입니다[cite: 1].",
      hint: "속도가 빠른 독립 인코딩 방식과 정확도가 높은 결합 처리 방식의 차이입니다[cite: 1]."
    },
    {
      id: "cat3-knowledge-conflict-grounding-easy-041",
      conceptId: "rag-knowledge-conflict-resolution",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "모델 내부의 사전 지식과 검색된 컨텍스트 문서의 정보가 상충할 때 해결 방안으로 옳은 것은?",
      options: [
        "주어진 컨텍스트에만 철저히 기반하여 답변하도록 그라운딩 학습 및 지시를 강화한다.",
        "모델의 사전 지식을 무조건 우선하도록 시스템 프롬프트의 신뢰도를 고정한다.",
        "두 지식의 중간값을 산술 평균하여 새로운 가설적 사실을 합성한다.",
        "충돌이 감지되는 즉시 시스템 에러 로그를 출력하고 추론 루프를 중단한다."
      ],
      answer: 0,
      explanation: "사전 지식과 검색 문서 간 충돌이 발생할 경우, 모델이 자신이 알고 있던 사전 지식을 무시하고 주어진 컨텍스트에만 기반하여 답변하도록 그라운딩(Grounding) 학습 및 지시를 강화합니다[cite: 1].",
      hint: "주어진 검색 문서 내용에 기반하여 답하도록 유도하는 방법입니다[cite: 1]."
    },
    {
      id: "cat3-counterfactual-robustness-easy-042",
      conceptId: "rag-counterfactual-robustness",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "multiple-choice",
      prompt: "검색된 외부 문서 자체에 명백한 사실 오류가 포함되어 있을 때 검색증강 시스템에 요구되는 대응 능력은?",
      options: [
        "문서의 오류를 그대로 수용하여 질의에 맞게 확장 요약한다.",
        "문서에 포함된 사실 오류를 감지하고 정정하여 올바른 사실을 응답한다.",
        "문서 내의 모든 고유명사를 자동으로 마스킹 처리하여 보존한다.",
        "해당 문서를 영구 보상 모델의 부정 샘플로 등록하여 가중치를 갱신한다."
      ],
      answer: 1,
      explanation: "반사실적 견고성(Counterfactual Robustness)은 검색된 외부 문서에 잘못된 사실 오류가 있을 때 이를 식별하여 정정하고 올바른 답변을 제시하는 능력입니다[cite: 1].",
      hint: "제공된 문서의 오류를 감지하고 바른 사실을 전달하는 견고성입니다[cite: 1]."
    },
    {
      id: "cat3-rag-three-steps-short-easy-043",
      conceptId: "rag-pipeline-three-steps",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "short-answer",
      prompt: "검색증강 시스템이 사용자 질문을 받아 최종 답변을 생성하기까지 거치는 3가지 핵심 처리 단계의 명칭을 순서대로 화살표(->) 또는 쉼표로 연결하여 작성하시오.",
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
      explanation: "RAG 파이프라인은 (1) 질의 추출 -> (2) 문서 검색 -> (3) 언어모델 추론의 3단계를 거칩니다[cite: 1].",
      hint: "질문 가공부터 외부 지식 탐색, 최종 모델 추론으로 이어지는 3단계 흐름입니다[cite: 1]."
    },
    {
      id: "cat3-rag-retriever-short-easy-044",
      conceptId: "retriever-module-term",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "short-answer",
      prompt: "검색증강 시스템에서 사용자의 질문을 입력받아 외부 데이터 저장소에서 가장 관련성 높은 후보 문서를 찾아오는 모듈의 영문 명칭을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Retriever",
        "retriever",
        "리트리버",
        "검색기"
      ],
      explanation: "사용자의 질의에 맞는 후보 문서를 저장소에서 찾아오는 모듈을 Retriever(검색기)라고 합니다[cite: 1, 1].",
      hint: "검색을 수행하는 모듈의 영문 단어입니다[cite: 1]."
    },
    {
      id: "cat3-rag-reasons-essay-easy-045",
      conceptId: "why-rag-four-core-reasons",
      difficulty: "easy",
      category: "검색증강 생성 및 정보검색",
      questionType: "essay",
      prompt: "거대 언어 모델 환경에서 사전 학습 가중치에만 의존하지 않고 검색증강 생성 프레임워크를 도입해야 하는 핵심 이유 4가지를 설명하시오.",
      options: [],
      answer: null,
      modelAnswer: "1. 파라미터 기억 용량 한계 극복:\n언어 모델은 사전 학습 코퍼스에 자주 등장하지 않는 희귀 정보나 롱테일 지식을 파라미터에 모두 저장하지 못하므로, 외부 저장소를 참조하여 정확도를 보완합니다[cite: 1, 2].\n\n2. 최신 지식의 용이한 갱신:\n언어 모델의 내부 지식은 시간이 지나면 뒤처지며 모델 자체를 재학습하는 데 큰 비용이 듭니다[cite: 1, 2]. 반면 RAG는 외부 저장소의 문서만 업데이트하면 최신 지식을 즉시 반영할 수 있습니다[cite: 1].\n\n3. 답변의 해석 및 검증 가능성 제공:\n순수 언어 모델의 생성 결과는 출처 확인이 어렵지만, RAG는 답변과 함께 참조한 원본 문서 출처를 제시할 수 있어 사용자가 검증할 수 있습니다[cite: 1, 2].\n\n4. 사내 보안 데이터의 안전한 활용:\n기업 내부 정보와 같은 보안 데이터를 모델 가중치에 영구 학습시키지 않고, 접근 권한이 있는 저장소에서 추론 시점에만 안전하게 참조할 수 있습니다[cite: 1, 2].",
      rubricKeywords: [
        "희귀 정보",
        "최신 지식 갱신",
        "해석 및 검증 가능성",
        "출처 제공",
        "보안 정보",
        "사내 데이터"
      ],
      minLength: 140,
      explanation: "RAG 도입의 4가지 핵심 이유(파라미터 기억 한계, 최신 지식 갱신, 답변 검증 가능성, 사내 보안 데이터 활용)를 체계적으로 설명해야 합니다[cite: 1, 1, 1, 1].",
      hint: "지식 용량 한계, 최신 정보 갱신, 출처 검증, 사내 보안 데이터 보호 관점에서 서술하세요[cite: 1, 1, 1, 1]."
    },

    // =========================================================================
    // 카테고리 4: AI 에이전트 및 다중 에이전트 시스템 (15문항)
    // =========================================================================
    {
      id: "cat4-agent-definition-easy-046",
      conceptId: "ai-agent-definition-software",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "multiple-choice",
      prompt: "인공지능 에이전트의 기본 개념으로 가장 올바른 것은 무엇입니까?",
      options: [
        "환경을 인지하지만 외부 환경에 개입하지 않고 상태만 예측하는 시스템",
        "외부 환경과 상호작용하지 않고 내부 지식으로 텍스트만 생성하는 시스템",
        "사용자를 대신해 목표를 추구하고 작업을 수행하는 인공지능 시스템",
        "외부 문서를 검색해 응답하지만 환경에 직접 행동하지 않는 검색 시스템"
      ],
      answer: 2,
      explanation: "인공지능 에이전트(AI Agent)는 AI를 사용하여 사용자를 대신해 목표를 추구하고 작업을 수행하는 소프트웨어 시스템입니다[cite: 2, 2].",
      hint: "사용자를 대신해 능동적으로 목표를 수행하는 시스템입니다[cite: 2, 2]."
    },
    {
      id: "cat4-agent-evolution-steps-easy-047",
      conceptId: "ai-agent-evolution-four-steps",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "multiple-choice",
      prompt: "인공지능의 발전 지평 4단계 흐름을 순서대로 바르게 나열한 것은?",
      options: [
        "지각 인공지능 -> 생성형 인공지능 -> 에이전트형 인공지능 -> 물리적 인공지능",
        "물리적 인공지능 -> 에이전트형 인공지능 -> 생성형 인공지능 -> 지각 인공지능",
        "생성형 인공지능 -> 지각 인공지능 -> 물리적 인공지능 -> 에이전트형 인공지능",
        "지각 인공지능 -> 물리적 인공지능 -> 생성형 인공지능 -> 에이전트형 인공지능"
      ],
      answer: 0,
      explanation: "인공지능 발전 단계는 특화 분야 해석의 지각 AI에서 콘텐츠 제작의 생성형 AI, 자율 문제해결의 에이전트형 AI, 현실 세계에서 작동하는 물리적 AI로 확장됩니다[cite: 2, 2, 2, 2].",
      hint: "지각 AI -> 생성형 AI -> 에이전트형 AI -> 물리적 AI 순서입니다[cite: 2, 2, 2, 2]."
    },
    {
      id: "cat4-agent-six-traits-easy-048",
      conceptId: "ai-agent-six-characteristics-list",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "multiple-choice",
      prompt: "인공지능 에이전트의 주요 6대 특성에 포함되지 않는 것은?",
      options: [
        "인식 및 자율성",
        "기억 및 추론과 계획",
        "손실 함수 역전파 및 가중치 양자화",
        "동작과 도구 및 학습과 적응"
      ],
      answer: 2,
      explanation: "AI 에이전트의 6대 주요 특성은 인식, 자율성, 동작(도구), 기억, 추론(계획), 학습(적응)입니다[cite: 2].",
      hint: "에이전트가 환경과 상호작용하는 6가지 주요 기능적 특성을 떠올려보세요[cite: 2]."
    },
    {
      id: "cat4-multi-agent-purpose-easy-049",
      conceptId: "multi-agent-collective-intelligence-purpose",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "multiple-choice",
      prompt: "단일 언어 모델을 넘어 다중 에이전트 시스템이 필요한 주된 이유로 제시된 것은?",
      options: [
        "단일 에이전트의 문맥 윈도우 크기를 무제한으로 확장하여 단일 모델의 처리량을 극대화하기 위해",
        "지능형 에이전트들이 팀을 이루어 협력하고 장점과 시각을 결합하여 집단 지성을 실현하기 위해",
        "모든 에이전트의 독립적 실행을 차단하고 중앙 집중식 단일 프롬프트로 제어를 통합하기 위해",
        "외부 도구 호출 기능을 완전히 제거하고 언어 모델 자체의 매개변수 연산만으로 문제를 해결하기 위해"
      ],
      answer: 1,
      explanation: "다중 에이전트 시스템은 지능형 에이전트들이 팀을 이루어 협력하고 지식을 나누어 개별 에이전트의 능력 총합을 뛰어넘는 집단 지성을 실현하기 위해 필요합니다[cite: 2].",
      hint: "역할 분담과 협력을 통해 집단 지성을 실현하는 목적입니다[cite: 2]."
    },
    {
      id: "cat4-multi-agent-collab-types-easy-050",
      conceptId: "multi-agent-three-collaboration-types",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "multiple-choice",
      prompt: "다중 에이전트 시스템에서 분류하는 3대 협업 유형으로 옳은 것은?",
      options: [
        "지도학습, 비지도학습, 강화학습",
        "사전학습, 미세조정, 프롬프트 엔지니어링",
        "단방향 통신, 양방향 통신, 브로드캐스트 통신",
        "협력, 경쟁, 협쟁"
      ],
      answer: 3,
      explanation: "다중 에이전트 협업 유형은 공동 목표를 위한 협력(Cooperation), 대립 및 논증을 통한 경쟁(Competition), 그리고 둘이 결합된 협쟁(Coopetition)으로 나뉩니다[cite: 2, 2, 2, 2]."
    },
    {
      id: "cat4-role-based-protocol-easy-051",
      conceptId: "role-based-collaboration-protocol",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "multiple-choice",
      prompt: "다중 에이전트 협업 전략 중 역할 기반 프로토콜에 대한 설명으로 옳은 것은?",
      options: [
        "각 에이전트에 고유한 역할 분담이나 전문가 수준의 책임을 할당하여 협업을 수행한다.",
        "모든 에이전트가 동일한 프롬프트와 동일한 역할만을 수행하도록 강제한다.",
        "사전 정의된 규칙 없이 에이전트들이 무작위로 메시지를 교환하도록 방치한다.",
        "오직 하나의 에이전트만 발언권을 갖고 나머지 에이전트는 대기 상태를 유지한다."
      ],
      answer: 0,
      explanation: "역할 기반 프로토콜은 세분화된 목표 하에서 각 에이전트가 고유한 역할 분담(예: 기획자, 아키텍트, 엔지니어 등)과 전문 책임을 맡아 협업을 진행합니다[cite: 2, 2]."
    },
    {
      id: "cat4-communication-structures-easy-052",
      conceptId: "centralized-vs-decentralized-structures",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "multiple-choice",
      prompt: "다중 에이전트 시스템의 대표적인 2가지 커뮤니케이션 구조는?",
      options: [
        "단일 스레드 구조 및 멀티스레드 구조",
        "블록체인 분산 구조 및 파일 시스템 구조",
        "동기식 링 구조 및 비동기 버스 구조",
        "중앙집중형 구조 및 탈중앙화 구조"
      ],
      answer: 3,
      explanation: "다중 에이전트 커뮤니케이션 구조는 중앙 서비스 에이전트가 조율하는 중앙집중형 구조와, 에이전트들이 분산되어 서로 직접 소통하는 탈중앙화 구조로 나뉩니다[cite: 2, 2]."
    },
    {
      id: "cat4-agentic-rag-concept-easy-053",
      conceptId: "agentic-rag-definition-tools",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "multiple-choice",
      prompt: "에이전트형 검색증강 생성의 핵심 특징으로 가장 적절한 것은?",
      options: [
        "정보를 딱 한 번만 검색하고 추가적인 검토 없이 답변 생성을 즉시 종료한다.",
        "에이전트가 검색 여부 결정, 도구 선택, 질의 생성, 결과 평가 등을 능동적으로 조율한다.",
        "외부 데이터베이스를 완전히 배제하고 오직 모델 내부의 매개변수 메모리만 사용한다.",
        "인간 사용자가 매 단계마다 검색할 키워드를 수동으로 입력해주어야만 동작한다."
      ],
      answer: 1,
      explanation: "에이전트형 RAG(Agentic RAG)는 단순 일회성 검색을 넘어 에이전트가 검색 필요 여부 판단, 도구 선택, 질의 분배, 결과 검토 및 재검색을 능동적으로 조율합니다[cite: 2, 2]."
    },
    {
      id: "cat4-toolformer-pipeline-easy-054",
      conceptId: "toolformer-three-steps-flow",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "multiple-choice",
      prompt: "툴포머 모델이 스스로 도구 사용법을 학습하는 3단계 과정으로 옳은 것은?",
      options: [
        "호출 필터링 -> 보상 모델 학습 -> 정책 최적화",
        "호출 샘플링 -> 실행 -> 필터링",
        "웹 크롤링 -> 역문서 빈도 계산 -> 재순위화",
        "확률 직접 최적화 -> 토큰 마스킹 -> 템플릿 조립"
      ],
      answer: 1,
      explanation: "Toolformer는 자기지도학습을 통해 (1) API 호출 데모 생성(샘플링) -> (2) 호출 실행 -> (3) 유용성(손실 감소)에 따른 필터링을 거치며, 선별된 데이터로 모델을 미세조정합니다[cite: 2].",
      hint: "API 호출 데모 생성부터 실제 실행 및 유용성 평가로 이어지는 자기지도 학습 과정입니다[cite: 2]."
    },
    {
      id: "cat4-react-framework-easy-055",
      conceptId: "react-reason-and-act-loop",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "multiple-choice",
      prompt: "언어 모델이 도구를 활용할 때 단순 추론이나 단순 행동에 그치지 않고 생각, 행동, 관찰을 반복하는 상호작용 프레임워크는?",
      options: [
        "ReAct",
        "DPO",
        "MMLU",
        "TF-IDF"
      ],
      answer: 0,
      explanation: "ReAct는 추론(Reasoning)과 행동(Action)을 결합하여, 생각(Thought) -> 행동(Action) -> 관찰(Observation)의 루프를 반복하며 문제를 해결하는 프레임워크입니다[cite: 2]."
    },
    {
      id: "cat4-self-consistency-tot-easy-056",
      conceptId: "self-consistency-and-tree-of-thoughts",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "multiple-choice",
      prompt: "언어 모델의 추론 및 계획 능력을 강화하기 위한 기법들의 설명으로 옳은 것은?",
      options: [
        "자기 일관성은 여러 경로의 일관된 답을 다수결로 고르고 사고의 나무는 탐색 알고리즘으로 생각을 평가한다.",
        "자기 일관성은 단 하나의 경로만 순차적으로 생성하고 사고의 나무는 모든 중간 생각 노드를 즉시 삭제한다.",
        "자기 일관성은 외부 데이터베이스의 인덱스를 갱신하고 사고의 나무는 모델의 가중치를 비지도 학습한다.",
        "자기 일관성은 도구 실행 오류를 자동으로 무시하고 사고의 나무는 프롬프트의 입력 토큰 수를 축소한다."
      ],
      answer: 0,
      explanation: "자기 일관성(Self-Consistency)은 여러 추론 경로를 샘플링하여 다수결로 답을 집계하며[cite: 2], 사고의 나무(Tree of Thoughts)는 너비 우선 탐색이나 깊이 우선 탐색을 통해 다양한 생각을 생성하고 평가합니다[cite: 2]."
    },
    {
      id: "cat4-mcp-motivation-easy-057",
      conceptId: "mcp-mxn-to-mplusn-simplification",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "multiple-choice",
      prompt: "모델 컨텍스트 프로토콜이 인공지능 애플리케이션과 외부 도구 연결에서 제공하는 가장 핵심적인 가치는?",
      options: [
        "각 모델 제공사별 전용 규격을 유지하여 플랫폼별 독립 최적화를 강화하는 방식",
        "외부 도구의 기능을 모델 파라미터에 직접 학습시켜 외부 프로토콜을 배제하는 방식",
        "개별 모델과 도구 간의 복잡한 연결을 표준 인터페이스로 통일해 연결을 단순화하는 방식",
        "단일 폐쇄형 인터페이스를 구축하여 특정 개발사의 클라우드 서비스로만 제한하는 방식"
      ],
      answer: 2,
      explanation: "모델 컨텍스트 프로토콜(MCP)은 모델과 도구 간의 인터페이스를 표준화하여(AI 기능의 USB-C), 복잡한 개별 연결 작업을 단순화하고 도구와 리소스의 재사용성을 높여줍니다[cite: 2]."
    },
    {
      id: "cat4-agent2agent-short-easy-058",
      conceptId: "agent2agent-protocol-goal",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "short-answer",
      prompt: "여러 에이전트가 내부 메모리나 도구를 직접 공유하지 않고 맥락, 작업 업데이트, 지시사항, 데이터만 교환하여 협업할 수 있도록 지원하는 프로토콜 명칭을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Agent2Agent",
        "agent2agent",
        "Agent to Agent",
        "A2A",
        "a2a"
      ],
      explanation: "Agent2Agent(A2A) 프로토콜은 에이전트들이 내부 상태를 공유하지 않고 지시사항과 데이터만을 교환하며 협업할 수 있도록 돕는 프로토콜입니다[cite: 2].",
      hint: "에이전트 간 직접 소통을 돕는 프로토콜 명칭입니다[cite: 2]."
    },
    {
      id: "cat4-zero-shot-cot-short-easy-059",
      conceptId: "zero-shot-cot-trigger-phrase",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "short-answer",
      prompt: "별도의 사전 예시 없이도 모델의 단계별 추론 과정을 유도하기 위해 프롬프트에 추가하는 대표적인 영문 문장을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Let's think step by step",
        "let's think step by step",
        "Let's think step by step.",
        "let's think step by step."
      ],
      explanation: "Zero-shot CoT에서는 'Let's think step by step' 문구를 프롬프트에 추가하여 모델의 단계별 추론 능력을 유도합니다[cite: 2].",
      hint: "단계별로 생각해 보자는 의미의 영문 표현입니다[cite: 2]."
    },
    {
      id: "cat4-react-and-planning-essay-easy-060",
      conceptId: "react-and-planning-mechanism-essay",
      difficulty: "easy",
      category: "AI 에이전트 및 다중 에이전트 시스템",
      questionType: "essay",
      prompt: "AI 에이전트 시스템에서 복잡한 문제를 해결하기 위해 활용되는 계획 수립의 개념과, 추론과 행동을 결합한 ReAct 프레임워크의 동작 원리를 설명하시오.",
      options: [],
      answer: null,
      modelAnswer: "1. 계획 수립(Planning)의 개념:\n언어 모델 에이전트가 복잡한 최종 목표를 달성하기 위해 필요한 세부 하위 작업들의 순서를 구성하고 분해하여 실행 전략을 세우는 과정입니다[cite: 2].\n\n2. ReAct 프레임워크의 동작 원리:\nReAct는 추론(Reasoning)과 행동(Action)을 유기적으로 결합하여 문제를 해결하는 기법으로[cite: 2], 다음과 같은 순환 루프를 반복합니다.\n- Thought (생각): 현재 상황과 목표를 분석하여 다음에 수행할 추론 및 도구 사용 계획을 수립합니다.\n- Action (행동): 계획에 따라 외부 도구나 API를 호출하여 환경에 구체적인 행동을 실행합니다[cite: 2].\n- Observation (관찰): 도구 실행 결과나 환경 피드백을 수신하여 다음 판단의 문맥으로 반영하며, 최종 목표가 달성될 때까지 이 루프를 지속합니다[cite: 2].",
      rubricKeywords: [
        "계획 수립 (Planning)",
        "하위 작업 분해",
        "ReAct",
        "Thought (생각)",
        "Action (행동)",
        "Observation (관찰)"
      ],
      minLength: 140,
      explanation: "계획 수립의 정의(하위 작업 분해 및 순서 구성)와 ReAct의 3단계 순환 메커니즘(Thought-Action-Observation)을 체계적으로 서술해야 합니다[cite: 2].",
      hint: "목표 달성을 위한 하위 작업 순서 구성과 생각-행동-관찰의 순환 루프를 서술하세요[cite: 2]."
    }
  ],
  medium: [],
  hard: [],
  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
