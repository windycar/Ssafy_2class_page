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
  easy: [],
  medium: [
    // =========================================================================
    // 카테고리 1: 사전 학습 vs 사후 학습 및 지시어 튜닝 (15문항: 객관식 12, 단답식 2, 서술형 1)
    // =========================================================================
    {
      "id": "cat1-pre-vs-post-medium-001",
      "conceptId": "pretraining-vs-posttraining-purpose",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "multiple-choice",
      "prompt": "같은 Base LLM을 두고 두 학습 단계를 비교할 때, Pre-training과 Post-training의 역할 구분으로 가장 적절한 것은?",
      "options": [
        "Pre-training은 사용자 의도에 맞게 응답을 조정하고, Post-training은 언어와 지식을 익힌다.",
        "Pre-training은 언어와 지식을 익히고, Post-training은 사용자 의도에 맞게 응답을 조정한다.",
        "두 단계 모두 다음 토큰 예측을 목적으로 하며 사용한 데이터의 규모만 서로 다르다.",
        "Pre-training은 지시문-응답 쌍으로 학습하고, Post-training은 비라벨 텍스트로 학습한다."
      ],
      "answer": 1,
      "explanation": "강의에서는 Pre-training을 방대한 텍스트로 언어와 지식을 학습하는 단계, Post-training을 사용자의 의도에 맞고 안전하며 유용한 응답을 하도록 조정하는 단계로 구분합니다.",
      "hint": "어느 쪽이 '언어를 배우는' 단계이고 어느 쪽이 '사람에게 맞추는' 단계인지 나눠보세요."
    },
    {
      "id": "cat1-base-lm-behavior-medium-002",
      "conceptId": "base-model-completion-behavior",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "multiple-choice",
      "prompt": "사전 학습만 끝난 Base LLM이 '달 착륙을 6살 어린이에게 설명해줘'라는 요청에 직접 답하지 않고 비슷한 요청 문장을 계속 이어 썼습니다. 이 현상을 가장 잘 설명한 것은?",
      "options": [
        "다음 토큰을 이어 쓰는 목표로 학습되어 지시를 수행하는 행동은 따로 배우지 않았기 때문이다.",
        "지시문-응답 쌍으로 이미 미세조정되어 질문을 비슷한 예시로 확장하도록 학습됐기 때문이다.",
        "사전 학습 코퍼스에 설명문이 부족해 어린이 눈높이의 어휘를 만들지 못했기 때문이다.",
        "생성 길이 제한에 먼저 걸려 답변을 시작하기 전에 출력이 끊겼기 때문이다."
      ],
      "answer": 0,
      "explanation": "사전 학습의 핵심 목표는 Next Token Prediction입니다. 따라서 Base LLM은 문장을 자연스럽게 이어 쓰는 데 강하지만, 별도의 지시 튜닝 없이는 사용자의 요청을 수행하는 대화형 행동이 보장되지 않습니다.",
      "hint": "Base LLM이 학습한 목적 함수가 무엇이었는지 떠올려보세요."
    },
    {
      "id": "cat1-instruction-tuning-data-medium-003",
      "conceptId": "instruction-tuning-data-structure",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "multiple-choice",
      "prompt": "Instruction-tuning을 위한 학습 데이터의 구성과 학습 목적을 함께 설명한 선택지로 가장 적절한 것은?",
      "options": [
        "비라벨 텍스트를 학습해 다음 토큰 예측을 강화하고 새로운 문장을 자연스럽게 완성한다.",
        "지시문 없이 응답만 모아 학습해 문체를 통일하고 새로운 요청에도 같은 문체를 적용한다.",
        "지시문-응답 쌍을 학습해 지시를 따르는 방식을 익히고 새로운 작업에도 적용한다.",
        "하나의 태스크에 대한 지시문-응답만 집중 학습해 해당 태스크의 정확도를 끌어올린다."
      ],
      "answer": 2,
      "explanation": "Instruction-tuning은 다양한 태스크의 지시문-응답 쌍으로 지도 미세조정을 수행해 모델이 지시를 따르도록 만듭니다. 강의에서는 학습하지 않은 새로운 태스크에서의 평가도 강조합니다.",
      "hint": "무엇과 무엇이 짝을 이루는 데이터인지, 그리고 그것으로 무엇을 배우게 하려는지 함께 보세요."
    },
    {
      "id": "cat1-unseen-task-medium-004",
      "conceptId": "instruction-tuning-unseen-task",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "multiple-choice",
      "prompt": "Instruction-tuning 모델을 학습한 뒤 '학습 데이터에 직접 포함되지 않은 새로운 태스크'에서 평가하는 이유로 가장 적절한 것은?",
      "options": [
        "학습에 사용한 예시를 그대로 기억하고 있는지 확인하기 위해",
        "지시문의 문장 길이가 응답 길이에 주는 영향을 확인하기 위해",
        "학습에 사용한 태스크에서 정확도가 최대치에 도달했는지 확인하기 위해",
        "학습하지 않은 지시에도 수행 능력이 이어지는지 확인하기 위해"
      ],
      "answer": 3,
      "explanation": "강의의 Instruction-tuning 흐름은 다양한 태스크의 지시문-응답 쌍을 학습한 뒤 Unseen task에서 평가하는 구조입니다.",
      "hint": "Unseen task로 평가하는 목적은 '암기'와 '일반화' 중 무엇을 보려는 걸까요?"
    },
    {
      "id": "cat1-super-natural-medium-005",
      "conceptId": "instruction-tuning-task-diversity",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "multiple-choice",
      "prompt": "Super-NaturalInstructions처럼 태스크 수를 크게 늘린 지시 데이터셋이 Instruction-tuning에서 갖는 의미로 가장 적절한 것은?",
      "options": [
        "태스크 수가 늘어도 학습 효과는 예시 수에만 좌우되므로 태스크 다양성은 부차적이다.",
        "태스크 다양성이 커질수록 학습하지 않은 지시에도 대응하는 일반화가 유리해진다.",
        "태스크 수가 많아지면 태스크당 예시 수가 줄어 지시 추종 능력이 오히려 약해진다.",
        "태스크 다양성은 사전 학습 단계의 관심사이고 지시 튜닝의 목표는 문체 통일이다."
      ],
      "answer": 1,
      "explanation": "강의에서 Super-NaturalInstructions는 1.6K+ 태스크와 3M+ 예시 규모로 소개되며, 태스크 다양성을 넓혀 Unseen task에서의 일반화를 노리는 방향을 보여줍니다.",
      "hint": "규모 자체보다, 왜 하필 '태스크 수'를 늘렸는지에 초점을 맞추세요."
    },
    {
      "id": "cat1-mmlu-kmmlu-medium-006",
      "conceptId": "mmlu-vs-kmmlu-evaluation",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "multiple-choice",
      "prompt": "MMLU와 K-MMLU의 관계를 설명한 선택지로 가장 적절한 것은?",
      "options": [
        "MMLU는 한국 고유 지식을, K-MMLU는 57개 일반 학문 지식을 중심으로 평가한다.",
        "MMLU와 K-MMLU는 평가 항목이 동일하고 문항을 번역했는지 여부만 서로 다르다.",
        "MMLU는 다양한 학문 지식을, K-MMLU는 한국의 문화·법률·지역 지식까지 평가한다.",
        "MMLU는 지시 추종 여부를, K-MMLU는 한국어 문장의 문법 오류를 중심으로 평가한다."
      ],
      "answer": 2,
      "explanation": "강의에서 MMLU는 57개 분야의 지식 평가 벤치마크로, K-MMLU는 한국 고유의 문화·지역·법률 지식 등을 포함한 평가로 소개됩니다.",
      "hint": "두 벤치마크가 각각 어떤 '지식 범위'를 겨냥하는지 비교해보세요."
    },
    {
      "id": "cat1-alpaca-medium-007",
      "conceptId": "alpaca-self-instruct",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "multiple-choice",
      "prompt": "Alpaca의 데이터 구축 흐름을 가장 정확하게 나타낸 것은?",
      "options": [
        "175개 시드 태스크에서 text-davinci-003으로 52K 예시를 만들고 LLaMA 7B를 SFT한다.",
        "52K개 시드 태스크에서 LLaMA 7B로 175개 예시를 만들고 text-davinci-003을 SFT한다.",
        "175개 시드 태스크를 사람이 52K개까지 직접 확장해 작성하고 LLaMA 7B를 SFT한다.",
        "175개 시드 태스크를 그대로 학습 데이터로 사용해 text-davinci-003을 추가 학습한다."
      ],
      "answer": 0,
      "explanation": "강의의 Alpaca 사례는 175개의 Self-Instruct 시드 태스크에서 text-davinci-003을 활용해 52K instruction-following 데이터를 만들고 LLaMA 7B를 SFT하는 흐름입니다.",
      "hint": "시드가 몇 개였고, 그것을 무엇으로 몇 개까지 불렸는지 순서대로 짚어보세요."
    },
    {
      "id": "cat1-lima-medium-008",
      "conceptId": "lima-less-is-more",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "multiple-choice",
      "prompt": "Alpaca와 LIMA 사례를 함께 보았을 때 강의가 전달하는 Instruction-tuning 데이터에 대한 해석으로 가장 적절한 것은?",
      "options": [
        "데이터 양이 늘어나면 품질 차이는 정렬 효과에 거의 영향을 주지 않는다는 점",
        "지시 수행 능력을 얻으려면 Pre-training에 준하는 데이터 규모가 필요하다는 점",
        "사람이 아닌 모델이 합성한 지시 데이터로는 정렬 효과를 내기 어렵다는 점",
        "소수의 고품질 예시만으로도 강한 정렬 효과를 낼 수 있다는 점"
      ],
      "answer": 3,
      "explanation": "Alpaca는 52K 합성 데이터를 사용한 사례이고, LIMA는 약 1K 수준의 고품질 데이터로도 강한 지시 추종 성능을 보여 'Less is More'를 강조합니다.",
      "hint": "LIMA가 사용한 데이터 규모와 'Less is More'라는 표현을 떠올려보세요."
    },
    {
      "id": "cat1-pretrain-posttrain-scenario-medium-009",
      "conceptId": "pretrain-posttrain-scenario-judgment",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "multiple-choice",
      "prompt": "다음 중 Post-training의 필요성을 가장 잘 보여주는 상황은?",
      "options": [
        "대규모 텍스트에서 다음 토큰 예측으로 일반적인 언어 패턴을 학습하는 상황",
        "학습 코퍼스의 중복 문서를 제거해 사전 학습 데이터의 품질을 높이는 상황",
        "문장은 자연스럽지만 사용자의 명령과 원하는 응답 형식을 따르지 못하는 상황",
        "모델 파라미터 수를 키워 더 많은 사실 지식을 담으려고 하는 상황"
      ],
      "answer": 2,
      "explanation": "사전 학습만으로는 텍스트 완성 능력이 중심이므로 사용자 의도와 원하는 응답 형식에 맞추기 위한 Post-training이 필요합니다.",
      "hint": "Post-training이 없을 때 정확히 무엇이 부족한지 생각해보세요."
    },
    {
      "id": "cat1-instruction-tuning-evaluation-medium-010",
      "conceptId": "instruction-tuning-evaluation-design",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "multiple-choice",
      "prompt": "Instruction-tuning의 효과를 확인하기 위한 평가 설계로 가장 적절한 것은?",
      "options": [
        "학습에 사용한 지시를 다시 제시해 동일한 응답을 재현하는지 확인한다.",
        "다양한 지시로 학습한 뒤 처음 보는 태스크에서도 지시를 따르는지 확인한다.",
        "학습에 사용한 태스크만 모아 평균 정확도가 올랐는지 확인한다.",
        "지시문 없이 문장 완성 성능만 측정해 사전 학습 대비 변화를 확인한다."
      ],
      "answer": 1,
      "explanation": "강의에서는 다양한 태스크로 Instruction-tuning을 수행하고 새로운, 즉 학습하지 않은 태스크에서 평가하는 구성을 보여줍니다.",
      "hint": "평가에 쓰는 태스크가 학습 태스크와 같아야 할까요, 달라야 할까요?"
    },
    {
      "id": "cat1-mmlu-kmmlu-scenario-medium-011",
      "conceptId": "benchmark-selection-mmlu-kmmlu",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "multiple-choice",
      "prompt": "한국의 지적제도사, K-IFRS, 전통주 제조처럼 한국 맥락에 의존하는 지식까지 모델이 아는지 확인하려고 합니다. 가장 적절한 평가 선택은?",
      "options": [
        "MMLU를 사용해 한국 고유의 법률·문화 지식을 그대로 측정한다.",
        "Super-NaturalInstructions의 태스크 수를 늘려 한국 지식 정답률을 측정한다.",
        "Alpaca 데이터셋을 평가셋으로 삼아 한국의 법률·문화 지식을 측정한다.",
        "K-MMLU를 사용해 한국의 법률·문화·지역 맥락 지식을 평가한다."
      ],
      "answer": 3,
      "explanation": "K-MMLU는 한국의 문화·법률·지역적 배경에 특화된 지식을 평가하기 위한 벤치마크로 소개됩니다.",
      "hint": "한국 맥락 지식을 겨냥해 따로 만들어진 벤치마크가 무엇인지 떠올려보세요."
    },
    {
      "id": "cat1-pretrain-posttrain-order-medium-012",
      "conceptId": "pretraining-posttraining-development-flow",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "multiple-choice",
      "prompt": "LLM 개발 흐름을 강의의 관점에서 가장 자연스럽게 배열한 것은?",
      "options": [
        "대규모 텍스트 학습 → 지시문-응답 기반 조정 → 사용자 의도에 맞는 대화형 응답",
        "지시문-응답 기반 조정 → 대규모 텍스트 학습 → 사용자 의도에 맞는 대화형 응답",
        "사용자 의도에 맞는 대화형 응답 → 대규모 텍스트 학습 → 지시문-응답 기반 조정",
        "대규모 텍스트 학습 → 사용자 의도에 맞는 대화형 응답 → 지시문-응답 기반 조정"
      ],
      "answer": 0,
      "explanation": "강의의 큰 흐름은 Pre-training으로 언어와 지식을 습득한 Base LLM을 Post-training, 특히 Instruction-tuning 등으로 사용자 의도에 맞게 조정하는 것입니다.",
      "hint": "언어를 먼저 배우는 단계와 사람에게 맞추는 단계 중 무엇이 앞서는지 생각해보세요."
    },
    {
      "id": "cat1-alpaca-short-medium-013",
      "conceptId": "alpaca-generator-and-base-model",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "short-answer",
      "prompt": "Alpaca에서 instruction-following 예시를 생성하는 데 사용한 모델과, 그 데이터로 미세조정한 베이스 모델을 순서대로 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "text-davinci-003, LLaMA 7B",
        "text-davinci-003, LLaMA-7B",
        "text-davinci-003, LLaMA",
        "text-davinci-003, llama 7b",
        "davinci-003, LLaMA 7B",
        "GPT-3.5(text-davinci-003), LLaMA 7B"
      ],
      "explanation": "Alpaca는 175개 시드 태스크에서 text-davinci-003으로 52K개의 instruction-following 예시를 생성하고, 이 데이터로 LLaMA 7B를 지도 미세조정(SFT)한 사례입니다.",
      "hint": "데이터를 만든 쪽은 OpenAI 모델, 학습된 쪽은 Meta의 오픈 모델입니다."
    },
    {
      "id": "cat1-super-natural-short-medium-014",
      "conceptId": "super-natural-scale-short",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "short-answer",
      "prompt": "Super-NaturalInstructions 데이터셋의 규모를 '태스크 수, 예시 수' 순서로 작성하시오. (K/M 표기 가능)",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "1.6K+, 3M+",
        "1.6K, 3M",
        "1.6k+, 3m+",
        "1.6k, 3m",
        "1600+, 3000000+",
        "1.6K개, 3M개",
        "1600개, 300만개",
        "1.6K 태스크, 3M 예시"
      ],
      "explanation": "강의에서는 Super-NaturalInstructions를 1.6K+ 태스크와 3M+ 예시로 소개합니다.",
      "hint": "태스크 수는 K 단위, 예시 수는 M 단위로 제시된 대규모 데이터셋입니다."
    },
    {
      "id": "cat1-pretrain-instruction-essay-medium-015",
      "conceptId": "pretraining-instruction-tuning-comparison-essay",
      "difficulty": "medium",
      "category": "사전 학습 vs 사후 학습 및 지시어 튜닝",
      "questionType": "essay",
      "prompt": "Pre-training만 수행된 Base LLM이 지시를 잘 따르지 못할 수 있는 이유를 설명하고, Instruction-tuning이 이를 어떤 데이터와 평가 방식으로 보완하는지 서술하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "Pre-training은 대규모 텍스트를 이용한 자기지도학습으로 다음 토큰 예측을 수행하며 언어 패턴과 일반 지식을 익히는 단계입니다. 따라서 Base LLM은 문맥을 자연스럽게 이어 쓰는 능력은 강하지만 사용자의 지시를 수행하는 방식 자체가 충분히 학습되지 않을 수 있습니다.\n\nInstruction-tuning은 다양한 태스크의 지시문-응답 쌍을 이용해 지도 미세조정을 수행하여 모델이 사용자의 지시를 해석하고 적절한 형식으로 응답하도록 조정합니다. 강의에서는 다양한 태스크를 학습한 뒤, 학습에 직접 포함되지 않은 새로운 태스크에서 평가하여 지시 추종 능력이 일반화되는지 확인하는 흐름을 제시합니다.",
      "rubricKeywords": [
        "Next Token Prediction",
        "자기지도학습",
        "지시문-응답 쌍",
        "지도 미세조정",
        "새로운 태스크",
        "일반화"
      ],
      "minLength": 150,
      "explanation": "Pre-training의 텍스트 완성 목적과 Instruction-tuning의 지시 추종 목적, 데이터 형태, Unseen task 평가를 연결해서 설명해야 합니다.",
      "hint": "Next Token Prediction의 한계 → 지시문-응답 쌍 학습 → Unseen task 평가 순서로 엮어보세요."
    },

    // =========================================================================
    // 카테고리 2: 인간 피드백 기반 강화학습 및 정렬 (15문항: 객관식 12, 단답식 2, 서술형 1)
    // =========================================================================
    {
      "id": "cat2-instruction-limit-medium-001",
      "conceptId": "instruction-tuning-limitations",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "multiple-choice",
      "prompt": "강의에서 제시한 Instruction-tuning의 한계를 종합한 설명으로 가장 적절한 것은?",
      "options": [
        "토큰 단위 손실이 인간이 느끼는 오류의 중요도를 그대로 반영한다는 점이 한계이다.",
        "개방형 생성에도 단일 정답이 존재하므로 정답을 모으는 비용만이 한계로 남는다.",
        "개방형 생성에는 단일 정답이 없을 수 있고, 토큰 단위 손실과 인간 선호 사이에도 차이가 남는다.",
        "비라벨 텍스트를 함께 사용하지 못한다는 점이 Instruction-tuning의 핵심 한계이다."
      ],
      "answer": 2,
      "explanation": "강의에서는 개방형·창의적 생성에 단일 정답이 없을 수 있고, 토큰 수준 손실이 인간이 느끼는 오류 중요도를 그대로 반영하지 못하며, 사람이 만든 답변도 최적이 아닐 수 있다고 설명합니다.",
      "hint": "정답이 하나로 정해지지 않는 문제, 그리고 손실 함수와 사람의 판단 사이의 간극을 함께 떠올려보세요."
    },
    {
      "id": "cat2-human-preference-medium-002",
      "conceptId": "human-preference-open-ended",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "multiple-choice",
      "prompt": "아인슈타인이 오늘날 살아 있다면 어떤 기여를 했을지 묻는 질문에 여러 모델이 서로 다른 답변을 냈습니다. 강의에서 이 사례를 제시한 목적은?",
      "options": [
        "모델마다 답이 달랐다는 사실만으로 사전 학습이 실패했음을 보여주기 위해",
        "주관식 질문도 정답 검증이 가능하므로 검증 보상만으로 충분함을 보여주기 위해",
        "여러 답변 중 가장 길고 상세한 답변이 대체로 좋은 답변임을 보여주기 위해",
        "개방형 질문에서는 단일 정답보다 어떤 답을 더 선호하는지가 중요함을 보여주기 위해"
      ],
      "answer": 3,
      "explanation": "강의의 Human Preference 예시는 주관식·개방형 질문에서 모델마다 서로 다른 답이 가능하며 단일 정답보다 선호 비교가 중요함을 설명하기 위한 사례입니다.",
      "hint": "정답을 하나로 정할 수 없는 질문에서는 무엇을 기준으로 학습할 수 있을까요?"
    },
    {
      "id": "cat2-pairwise-medium-003",
      "conceptId": "pairwise-comparison-rationale",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "multiple-choice",
      "prompt": "RLHF에서 응답에 절대 점수를 직접 매기기보다 Pairwise comparison을 사용하는 이유로 가장 적절한 것은?",
      "options": [
        "평가자마다 절대 점수의 기준이 달라, 둘 중 나은 쪽을 고르는 편이 일관된 선호를 모으기 쉽기 때문이다.",
        "절대 점수는 평가자 사이의 편차가 거의 없기 때문에, 비교를 통해 편차를 일부러 만들어야 하기 때문이다.",
        "비교 결과만 있으면 보상 모델을 따로 학습하지 않고도 정책 파라미터를 바로 갱신할 수 있기 때문이다.",
        "응답을 서로 비교하면 개방형 질문도 정답 여부가 명확한 검증 문제로 바꿀 수 있기 때문이다."
      ],
      "answer": 0,
      "explanation": "강의에서는 인간의 판단이 일관되지 않고 절대 점수 기준이 어긋날 수 있으므로, 직접 점수화보다 응답 간 비교를 활용한다고 설명합니다.",
      "hint": "'이 답변은 7점'과 '둘 중 이게 낫다' 중, 사람이 더 일관되게 답하는 쪽은 어느 쪽일까요?"
    },
    {
      "id": "cat2-bradley-terry-medium-004",
      "conceptId": "bradley-terry-preference-model",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "multiple-choice",
      "prompt": "Bradley-Terry 기반 보상 모델 학습의 핵심 관계로 가장 적절한 것은?",
      "options": [
        "winning 응답과 losing 응답의 보상 점수 차이를 0에 가깝게 좁히도록 학습한다.",
        "winning 응답의 보상 점수가 losing 응답보다 높아지도록 점수 차이를 키운다.",
        "losing 응답의 보상 점수가 winning 응답보다 높아지도록 점수 차이를 키운다.",
        "두 응답의 보상 점수를 미리 정해 둔 상수 값에 각각 맞추도록 학습한다."
      ],
      "answer": 1,
      "explanation": "강의의 Bradley-Terry 기반 손실은 선호된 응답의 점수가 비선호 응답의 점수보다 높아지도록 학습하는 구조입니다.",
      "hint": "선호된 응답과 그렇지 않은 응답의 점수 관계를 부등호로 그려보세요."
    },
    {
      "id": "cat2-rlhf-pipeline-medium-005",
      "conceptId": "rlhf-three-stage-pipeline",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "multiple-choice",
      "prompt": "다음 중 RLHF의 학습 흐름을 올바른 순서로 배열한 것은?",
      "options": [
        "PPO 정책 최적화 → 시범 데이터 SFT → 비교 데이터로 Reward Model 학습",
        "비교 데이터로 Reward Model 학습 → PPO 정책 최적화 → 시범 데이터 SFT",
        "시범 데이터 SFT → PPO 정책 최적화 → 비교 데이터로 Reward Model 학습",
        "시범 데이터 SFT → 비교 데이터로 Reward Model 학습 → PPO 정책 최적화"
      ],
      "answer": 3,
      "explanation": "강의의 RLHF 3단계는 SFT, 비교 데이터 기반 Reward Model 학습, PPO 기반 정책 최적화 순서입니다.",
      "hint": "사람이 쓴 시범 답변을 흉내 내는 단계가 먼저이고, 비교 데이터는 그다음입니다."
    },
    {
      "id": "cat2-reward-model-scaling-medium-006",
      "conceptId": "reward-model-scaling-human-baseline",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "multiple-choice",
      "prompt": "리워드 모델의 크기와 학습 데이터 규모를 늘린 실험 결과를 강의의 설명대로 해석한 것은?",
      "options": [
        "충분한 데이터로 학습한 큰 Reward Model은 단일 인간 평가자 수준에 근접할 수 있다.",
        "충분한 데이터로 학습한 큰 Reward Model은 인간 평가자 앙상블 수준을 넘어서는 편이다.",
        "Reward Model은 크기를 키울수록 인간 선호 예측이 무작위 추측 수준으로 떨어진다.",
        "Reward Model은 학습 데이터 수를 늘려도 검증 정확도가 사실상 변하지 않는다."
      ],
      "answer": 0,
      "explanation": "강의에서는 충분한 데이터와 큰 리워드 모델이 단일 인간 평가 수준에 근접하는 결과를 소개합니다. 인간 앙상블을 넘어선다고 설명하지는 않습니다.",
      "hint": "그래프에서 큰 모델의 곡선이 어떤 기준선에 가까워졌는지 떠올려보세요."
    },
    {
      "id": "cat2-reward-model-limit-medium-007",
      "conceptId": "reward-modeling-limitations-hallucination",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "multiple-choice",
      "prompt": "보상 모델의 점수를 지나치게 잘 받도록 정책을 최적화했는데 실제 사용자 선호는 오히려 떨어졌습니다. 강의 내용과 가장 가까운 해석은?",
      "options": [
        "Reward Model의 점수와 실제 인간 선호가 함께 계속 높아지는 정상적인 최적화 현상이다.",
        "Reward Model의 점수는 낮아지지만 실제 인간 선호는 계속 높아지는 역방향 학습 현상이다.",
        "Reward Model의 점수는 높아지지만 실제 인간 선호는 떨어질 수 있는 과최적화 현상이다.",
        "Reward Model과 실제 인간 선호가 모두 일정하게 유지되어 더 이상 학습되지 않는 현상이다."
      ],
      "answer": 2,
      "explanation": "강의는 Reward Model over-optimization과 reward hacking의 문제를 설명하며, 보상 모델 예측 점수는 오르지만 실제 인간 선호는 일정 시점 이후 하락할 수 있음을 보여줍니다.",
      "hint": "대리 지표를 지나치게 최적화했을 때 생기는 현상의 이름을 떠올려보세요."
    },
    {
      "id": "cat2-dpo-medium-008",
      "conceptId": "dpo-vs-rlhf",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "multiple-choice",
      "prompt": "DPO가 기존 RLHF 파이프라인을 단순화하는 핵심 방식으로 가장 적절한 것은?",
      "options": [
        "인간 선호 데이터를 사용하지 않고 비라벨 텍스트의 다음 토큰 예측을 다시 수행한다.",
        "별도 Reward Model과 PPO 없이 선호 비교 데이터로 언어 모델을 직접 최적화한다.",
        "Reward Model은 그대로 학습하되 PPO 대신 SFT를 한 번 더 수행해 정책을 갱신한다.",
        "선호 비교 데이터를 정답/오답 라벨로 바꿔 검증 가능한 보상만으로 정책을 학습한다."
      ],
      "answer": 1,
      "explanation": "강의의 DPO는 RLHF의 별도 Reward Model과 강화학습 절차를 없애고 preference data를 이용해 언어 모델을 직접 최적화하는 방식으로 소개됩니다.",
      "hint": "DPO가 기존 RLHF 파이프라인에서 무엇을 '빼는지'에 주목하세요."
    },
    {
      "id": "cat2-rlvr-medium-009",
      "conceptId": "rlvr-verifiable-reward",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "multiple-choice",
      "prompt": "다음 중 RLVR에 가장 적합한 학습 문제는?",
      "options": [
        "풀이 결과의 정답 여부를 객관적으로 검증할 수 있는 수학 또는 코딩 문제",
        "여러 문체가 모두 타당해 사람마다 선호가 달라질 수 있는 창작 글쓰기 문제",
        "하나의 정답 없이 설득력과 표현 방식을 사람의 취향으로 평가하는 토론 문제",
        "여러 모델의 응답을 인간 평가자가 비교해 더 좋은 답변의 순위를 정하는 문제"
      ],
      "answer": 0,
      "explanation": "RLVR은 정답을 검증할 수 있는 문제에서 Verifiable Reward를 사용하는 방식으로, 강의에서는 수학 문제처럼 답이 분명한 경우를 예로 듭니다.",
      "hint": "보상을 사람 대신 채점기가 줄 수 있는 문제가 무엇일지 생각해보세요."
    },
    {
      "id": "cat2-chatgpt-training-medium-010",
      "conceptId": "chatgpt-human-trainer-dialogue",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "multiple-choice",
      "prompt": "ChatGPT 초기 학습 데이터 구축 방식에 대한 강의 설명으로 가장 적절한 것은?",
      "options": [
        "인간 트레이너가 사용자 역할만 맡고 AI 응답은 기존 모델이 자동 생성하도록 구성했다.",
        "실제 사용자 대화 로그를 별도 가공 없이 그대로 지도 미세조정 데이터로 사용했다.",
        "인간 트레이너가 사용자와 AI 어시스턴트 양쪽 역할을 맡아 대화 데이터를 작성했다.",
        "모든 대화를 정답 여부가 명확한 수학 문제로 바꾸어 검증 가능한 보상만 사용했다."
      ],
      "answer": 2,
      "explanation": "강의에서는 human AI trainers가 user와 AI assistant 양쪽 역할을 수행해 대화 데이터를 구축한 방식을 설명합니다.",
      "hint": "트레이너가 대화의 한쪽만 맡았을까요, 양쪽을 모두 맡았을까요?"
    },
    {
      "id": "cat2-rlhf-vs-dpo-medium-011",
      "conceptId": "rlhf-dpo-scenario-selection",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "multiple-choice",
      "prompt": "선호 비교 데이터는 이미 확보되어 있지만 별도의 Reward Model 학습과 PPO 루프를 줄이고 싶은 상황입니다. 강의에서 소개된 대안으로 가장 적절한 것은?",
      "options": [
        "RLHF: 보상 모델을 먼저 학습한 뒤 PPO로 정책을 최적화한다.",
        "DPO: 보상 모델과 PPO 없이 선호 데이터로 정책을 직접 최적화한다.",
        "RLVR: 정답 검증기가 주는 보상 신호로 정책을 최적화한다.",
        "Instruction-tuning: 지시문-응답 쌍으로 지도 미세조정을 다시 수행한다."
      ],
      "answer": 1,
      "explanation": "DPO는 preference data를 이용하면서도 별도의 Reward Model과 RL 루프를 제거해 RLHF의 구조를 단순화하는 방법으로 소개됩니다.",
      "hint": "'선호 데이터는 있는데 보상 모델과 PPO 루프는 만들기 싫다'에 맞는 방법은?"
    },
    {
      "id": "cat2-rlhf-rlvr-compare-medium-012",
      "conceptId": "human-preference-vs-verifiable-reward",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "multiple-choice",
      "prompt": "다음 중 RLHF식 인간 선호 모델링과 RLVR의 차이를 가장 잘 설명한 것은?",
      "options": [
        "RLHF는 정답 검증 보상에 기반하고, RLVR은 인간의 비교 선호에 기반한다.",
        "두 방식 모두 인간의 Pairwise comparison을 보상 신호로 사용한다.",
        "두 방식 모두 별도의 Reward Model 학습을 전제로 해야 동작한다.",
        "RLHF는 인간의 비교 선호를, RLVR은 객관적 정답 검증을 보상으로 사용한다."
      ],
      "answer": 3,
      "explanation": "RLHF는 인간 선호 비교를 통해 Reward Model을 학습하는 흐름을 포함하고, RLVR은 수학 문제처럼 정답을 검증할 수 있는 경우 Verifiable Reward를 활용합니다.",
      "hint": "보상 신호를 사람이 주는지, 채점기가 주는지로 갈라보세요."
    },
    {
      "id": "cat2-rlhf-short-medium-013",
      "conceptId": "rlhf-preference-data-format",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "short-answer",
      "prompt": "RLHF 2단계에서 Reward Model을 학습할 때 사용하는 인간 피드백 데이터의 수집 형태를 영문 또는 한글로 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Pairwise comparison",
        "pairwise comparison",
        "Pairwise Comparison",
        "쌍별 비교",
        "선호 비교",
        "응답 쌍 비교",
        "페어와이즈 비교",
        "두 응답 비교"
      ],
      "explanation": "RLHF는 응답에 절대 점수를 매기는 대신 두 응답 중 어느 쪽이 더 나은지를 고르는 Pairwise comparison으로 선호 데이터를 모으고, 이를 Bradley-Terry 기반 Reward Model 학습에 사용합니다.",
      "hint": "절대 점수 대신 두 응답 중 나은 쪽을 고르게 하는 방식입니다."
    },
    {
      "id": "cat2-dpo-short-medium-014",
      "conceptId": "dpo-full-name-short",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "short-answer",
      "prompt": "DPO의 영문 풀네임을 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Direct Preference Optimization",
        "direct preference optimization",
        "Direct preference optimization",
        "DIRECT PREFERENCE OPTIMIZATION",
        "다이렉트 프리퍼런스 옵티마이제이션"
      ],
      "explanation": "DPO는 Direct Preference Optimization의 약자입니다.",
      "hint": "Preference를 직접 최적화한다는 의미의 세 단어 약어입니다."
    },
    {
      "id": "cat2-rlhf-dpo-essay-medium-015",
      "conceptId": "rlhf-dpo-rlvr-comparison-essay",
      "difficulty": "medium",
      "category": "인간 피드백 기반 강화학습 및 정렬",
      "questionType": "essay",
      "prompt": "RLHF의 3단계 구조를 설명하고, DPO가 이 구조를 어떻게 단순화하는지 서술한 뒤, RLVR이 어떤 종류의 문제에서 적합한지 비교하여 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "RLHF는 먼저 시범 데이터로 지도 미세조정(SFT)을 수행하고, 동일 프롬프트에 대한 여러 응답의 인간 선호 비교 데이터를 이용해 Reward Model을 학습한 뒤, PPO 강화학습으로 정책 모델이 높은 보상을 받도록 최적화합니다.\n\nDPO는 선호 비교 데이터는 사용하지만 별도의 Reward Model 학습과 PPO 강화학습 루프를 두지 않고 선호 데이터를 이용해 언어 모델을 직접 최적화하여 파이프라인을 단순화합니다.\n\nRLVR은 수학 문제나 코드 문제처럼 정답 여부를 객관적으로 검증할 수 있는 경우에 적합하며, 사람의 주관적 선호 대신 검증 가능한 보상을 사용할 수 있다는 점이 특징입니다.",
      "rubricKeywords": [
        "SFT",
        "Reward Model",
        "Pairwise comparison",
        "PPO",
        "DPO",
        "Verifiable Reward"
      ],
      "minLength": 180,
      "explanation": "RLHF의 단계, DPO의 구조적 단순화, RLVR의 적용 조건을 구분해서 설명해야 합니다.",
      "hint": "SFT → Reward Model → PPO의 흐름을 먼저 세우고, DPO가 어느 부분을 없애는지, RLVR은 어떤 문제 유형에 맞는지 이어서 정리하세요."
    },

    // =========================================================================
    // 카테고리 3: 검색증강 생성 및 정보검색 (15문항: 객관식 12, 단답식 2, 서술형 1)
    // =========================================================================
    {
      "id": "cat3-rag-definition-medium-001",
      "conceptId": "rag-test-time-external-knowledge",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "multiple-choice",
      "prompt": "Retrieval-augmented LM의 핵심 아이디어를 가장 잘 설명한 것은?",
      "options": [
        "추론 시 외부 지식을 사용하지 않고 모델 내부 파라미터의 기억만으로 답변한다.",
        "학습 시 외부 문서를 모델 가중치에 모두 저장한 뒤 추론에서는 검색을 사용하지 않는다.",
        "추론 시 모델 전체를 다시 학습해 최신 정보를 파라미터에 직접 반영한 뒤 답변한다.",
        "추론 시 외부 데이터스토어에서 관련 문서를 검색해 언어 모델의 답변 생성에 활용한다."
      ],
      "answer": 3,
      "explanation": "강의에서 Retrieval-augmented LM은 Test time에 외부 데이터 저장소를 불러와 활용하는 언어 모델로 설명됩니다.",
      "hint": "지식을 파라미터 안에 넣어 둘지, 추론 시점에 가져올지가 갈림길입니다."
    },
    {
      "id": "cat3-rag-components-medium-002",
      "conceptId": "rag-four-components",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "multiple-choice",
      "prompt": "다음 중 Retrieval-augmented LM의 4대 구성요소를 올바르게 묶은 것은?",
      "options": [
        "Datastore, Query, Retriever, Reranker",
        "Datastore, Query, Index, Language Model",
        "Query, Index, Language Model, Tokenizer",
        "Datastore, Index, Embedding, Prompt Template"
      ],
      "answer": 1,
      "explanation": "강의의 기본 RAG 구성요소는 Datastore, Query, Index, Language Model입니다.",
      "hint": "저장소, 질의, 색인, 그리고 최종적으로 답을 쓰는 주체까지 넷입니다."
    },
    {
      "id": "cat3-ir-purpose-medium-003",
      "conceptId": "information-retrieval-relevance",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "multiple-choice",
      "prompt": "Information Retrieval의 목표를 RAG와 연결해 설명한 것으로 가장 적절한 것은?",
      "options": [
        "문서 집합을 압축해 저장 공간을 줄이고 검색 색인의 크기를 최소화하는 것",
        "질의를 여러 하위 질의로 나눠 언어 모델이 생성할 응답 길이를 줄이는 것",
        "질의와 정보 사이의 관련성을 판단해 사용자가 필요로 하는 정보를 찾아 주는 것",
        "검색된 문서를 요약해 문서 안에 포함된 사실 오류까지 정정해 주는 것"
      ],
      "answer": 2,
      "explanation": "강의에서 IR의 목표는 검색 질의와 가장 관련성이 높은 정보를 제공하는 것으로 설명되며, RAG의 Retriever는 이 역할을 수행합니다.",
      "hint": "IR의 핵심 단어는 '관련성(relevance)'입니다."
    },
    {
      "id": "cat3-sparse-dense-medium-004",
      "conceptId": "sparse-vs-dense-retriever",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "multiple-choice",
      "prompt": "질의가 'bad guy'이고 문서에는 'villain'만 등장합니다. 강의의 Sparse/Dense Retriever 비교에 따르면 이 상황에서 의미상 관련 문서를 찾는 데 더 유리한 접근은?",
      "options": [
        "Dense Retriever: 의미 임베딩의 유사도로 표현이 달라도 관련 문서를 찾는다.",
        "Sparse Retriever: 단어의 일치 통계에 기반해 동의어까지 폭넓게 찾는다.",
        "TF-IDF: 문서 빈도가 높은 단어에 큰 가중치를 주어 동의어를 연결한다.",
        "Inverted Index: 단어 목록을 직접 대조해 의미 유사도를 계산한다."
      ],
      "answer": 0,
      "explanation": "Sparse Retriever는 어휘적 일치에 강하지만 동의어나 표현 차이에 약할 수 있습니다. Dense Retriever는 임베딩 기반 의미적 유사도를 활용합니다.",
      "hint": "'bad guy'와 'villain'은 글자가 하나도 겹치지 않습니다."
    },
    {
      "id": "cat3-tfidf-medium-005",
      "conceptId": "tfidf-frequency-rarity",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "multiple-choice",
      "prompt": "TF-IDF에서 어떤 단어가 거의 모든 문서에 등장한다면 그 단어의 검색 가중치가 낮아지는 이유는?",
      "options": [
        "df가 커질수록 TF 값이 함께 작아져 문서 내 등장 빈도가 줄어들기 때문이다.",
        "df가 커질수록 임베딩 차원이 줄어들어 단어의 의미 표현력이 낮아지기 때문이다.",
        "df가 커질수록 IDF가 작아져 여러 문서에 흔한 단어의 구분력이 낮게 반영되기 때문이다.",
        "df가 커질수록 해당 단어가 색인에서 제외되어 점수 계산에 반영되지 않기 때문이다."
      ],
      "answer": 2,
      "explanation": "TF는 문서 내 빈도, IDF는 전체 문서군에서의 희귀성을 반영합니다. 거의 모든 문서에 등장하면 df가 커져 IDF가 낮아집니다.",
      "hint": "IDF는 문서 빈도(df)의 역수에 로그를 취한 값입니다."
    },
    {
      "id": "cat3-bi-cross-medium-006",
      "conceptId": "bi-vs-cross-encoder",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "multiple-choice",
      "prompt": "수백만 문서에서 빠르게 후보를 찾은 뒤 소수 후보를 정밀하게 다시 평가하려 합니다. 강의의 Bi-encoder와 Cross-encoder 특성을 이용한 구성으로 가장 적절한 것은?",
      "options": [
        "Cross-encoder로 전체 문서를 먼저 평가하고 Bi-encoder로 상위 후보를 다시 정렬한다.",
        "Bi-encoder와 Cross-encoder를 모두 전체 문서에 적용해 두 점수의 평균으로 검색한다.",
        "Bi-encoder로 후보를 재순위화하고 Cross-encoder로 문서를 미리 임베딩해 인덱싱한다.",
        "Bi-encoder로 대규모 후보를 빠르게 찾고 Cross-encoder로 소수 후보를 정밀 재순위화한다."
      ],
      "answer": 3,
      "explanation": "Bi-encoder는 질의와 문서를 별도로 인코딩해 대규모 검색에 적합하고, Cross-encoder는 두 텍스트를 함께 처리해 느리지만 정밀한 재순위화에 적합합니다.",
      "hint": "빠른 쪽으로 넓게 훑고, 느리지만 정확한 쪽으로 좁게 다시 봅니다."
    },
    {
      "id": "cat3-rag-why-medium-007",
      "conceptId": "why-rag-current-rare-knowledge",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "multiple-choice",
      "prompt": "RAG를 도입하는 이유를 강의 내용과 가장 잘 연결한 것은?",
      "options": [
        "LLM이 이미 대부분의 지식을 기억하고 있어 답변 길이를 줄이는 용도로 활용한다.",
        "LLM이 놓치는 희귀·최신 정보를 보완하고 검색된 근거를 이용해 답변을 생성한다.",
        "검색 품질과 무관하게 답변의 사실 정확성이 보장되므로 검증 단계를 생략한다.",
        "Base LLM 없이 검색된 문서만으로 자연어 생성과 추론을 대체하는 데 활용한다."
      ],
      "answer": 1,
      "explanation": "강의에서는 LLM이 모든 지식을 파라미터에 저장할 수 없고 최신성 유지가 어렵다는 점, RAG가 외부 지식을 활용하고 출처에 근거한 답변을 만들 수 있다는 점을 설명합니다.",
      "hint": "파라미터 안에 담아 두기 어려운 정보가 어떤 종류인지 떠올려보세요."
    },
    {
      "id": "cat3-noise-robustness-medium-008",
      "conceptId": "rag-noise-robustness",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "multiple-choice",
      "prompt": "2022년 노벨문학상 수상자를 묻는 질의에 관련 문서와 무관한 문서가 함께 검색되었습니다. 모델이 관련 없는 문서를 무시하고 정답 근거를 골라내는 능력은?",
      "options": [
        "Noise Robustness",
        "Negative Rejection",
        "Knowledge Conflict",
        "Counterfactual Robustness"
      ],
      "answer": 0,
      "explanation": "강의에서 Noise Robustness는 검색 결과에 관련 없는 정보가 섞여 있어도 올바른 정보를 식별해 답변하는 능력입니다.",
      "hint": "검색 결과에 '잡음'이 섞여 들어왔을 때 요구되는 능력입니다."
    },
    {
      "id": "cat3-negative-rejection-medium-009",
      "conceptId": "rag-negative-rejection",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "multiple-choice",
      "prompt": "질문에 대한 답이 검색된 문서들에 전혀 없을 때 가장 바람직한 RAG 동작은?",
      "options": [
        "가장 유사한 검색 문장을 근거가 충분한 정답처럼 인용하여 답변한다.",
        "모델 내부 기억을 우선해 부족한 문서 정보를 추정하고 확정적으로 답변한다.",
        "여러 검색 문서의 일부 내용을 조합해 새로운 사실을 만들어 답변한다.",
        "검색 문서에 필요한 근거가 없음을 밝히고 해당 질문에 대한 답변을 거절한다."
      ],
      "answer": 3,
      "explanation": "강의의 Negative Rejection은 검색된 문서에 필요한 정보가 없을 때 억지로 답하지 않고 정보 부족을 밝히는 능력입니다.",
      "hint": "근거가 없을 때 지어내는 것보다 나은 선택이 있습니다."
    },
    {
      "id": "cat3-grounding-medium-010",
      "conceptId": "rag-knowledge-conflict-grounding",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "multiple-choice",
      "prompt": "제공된 컨텍스트가 최신이고 신뢰할 수 있는 자료인데도 모델이 오래된 내부 지식을 고집하는 상황입니다. 강의가 제시하는 대응 방향으로 가장 적절한 것은?",
      "options": [
        "모델의 내부 지식을 우선하고 제공된 컨텍스트는 참고 자료로만 취급한다.",
        "내부 지식과 컨텍스트를 절반씩 섞어 중간 수준의 새로운 진술을 만든다.",
        "제공된 컨텍스트를 근거로 답변하도록 컨텍스트 기반 응답의 근거화를 강화한다.",
        "충돌이 감지되면 컨텍스트를 모두 제거하고 내부 지식만으로 답변한다."
      ],
      "answer": 2,
      "explanation": "신뢰할 수 있는 컨텍스트와 모델의 내부 지식이 충돌할 때는 컨텍스트를 근거로 답하도록 grounding을 강화하는 것이 방향입니다. 반대로 컨텍스트 자체에 사실 오류가 있는 경우는 Counterfactual Robustness의 영역으로 구분됩니다.",
      "hint": "컨텍스트가 믿을 만한 상황이라는 전제에 주목하세요."
    },
    {
      "id": "cat3-information-integration-medium-011",
      "conceptId": "rag-information-integration",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "multiple-choice",
      "prompt": "한 문서에는 iOS 앱 출시일, 다른 문서에는 API 출시일이 들어 있어 두 문서를 모두 읽어야 질문에 답할 수 있습니다. 필요한 RAG 역량은?",
      "options": [
        "Information Integration",
        "Negative Rejection",
        "Counterfactual Robustness",
        "Noise Robustness"
      ],
      "answer": 0,
      "explanation": "Information Integration은 여러 검색 문서에 흩어진 부분 정보를 종합해 하나의 완결된 답변을 만드는 능력입니다.",
      "hint": "한 문서만으로는 답이 안 나오고, 두 문서를 합쳐야 답이 완성됩니다."
    },
    {
      "id": "cat3-counterfactual-medium-012",
      "conceptId": "rag-counterfactual-robustness",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "multiple-choice",
      "prompt": "검색 문서에 '2004년 올림픽은 뉴욕에서 열렸다'는 잘못된 정보가 포함되어 있습니다. 강의에서 요구하는 대응 능력으로 가장 적절한 것은?",
      "options": [
        "Grounding: 잘못된 외부 문서라도 주어진 내용만 그대로 따라 답변하는 능력",
        "Counterfactual Robustness: 외부 문서의 사실 오류에 휘둘리지 않고 대응하는 능력",
        "Negative Rejection: 외부 문서의 사실 오류를 정보 부족으로 간주해 거절하는 능력",
        "Information Integration: 외부 문서의 사실 오류를 여러 문서의 평균으로 보정하는 능력"
      ],
      "answer": 1,
      "explanation": "강의의 Counterfactual Robustness는 검색된 컨텍스트 자체에 사실 오류가 있어도 그 오류에 휘둘리지 않고 대응하는 능력입니다.",
      "hint": "문서가 '없는' 게 아니라 '틀린' 상황이라는 점이 핵심입니다."
    },
    {
      "id": "cat3-rag-components-short-medium-013",
      "conceptId": "tfidf-terminology",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "short-answer",
      "prompt": "TF-IDF에서 TF와 IDF가 각각 무엇의 약자인지 영문으로 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Term Frequency, Inverse Document Frequency",
        "term frequency, inverse document frequency",
        "Term Frequency / Inverse Document Frequency",
        "Term-Frequency, Inverse-Document-Frequency"
      ],
      "explanation": "TF는 Term Frequency로 문서 안에서 단어가 얼마나 자주 등장하는지를, IDF는 Inverse Document Frequency로 그 단어가 얼마나 적은 문서에만 등장하는지를 나타냅니다. 두 값을 곱해 단어의 검색 가중치를 정합니다.",
      "hint": "단어의 등장 빈도와, 문서 빈도의 '역수'를 뜻하는 영문 표현입니다."
    },
    {
      "id": "cat3-bi-cross-short-medium-014",
      "conceptId": "bi-encoder-precomputation",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "short-answer",
      "prompt": "질의와 문서를 각각 따로 인코딩하기 때문에 문서 벡터를 미리 계산해 인덱싱해 둘 수 있는 방식의 영문 명칭을 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Bi-encoder",
        "bi-encoder",
        "Bi encoder",
        "Bi-Encoder",
        "bi encoder",
        "바이 인코더",
        "바이인코더"
      ],
      "explanation": "Bi-encoder는 질의와 문서를 독립적으로 인코딩하므로 문서 임베딩을 미리 계산해 인덱스로 저장할 수 있고, 그래서 대규모 후보 검색에 적합합니다. Cross-encoder는 질의와 문서를 하나의 시퀀스로 함께 처리하므로 사전 계산이 불가능합니다.",
      "hint": "두 입력을 '따로(bi)' 인코딩하는 쪽입니다."
    },
    {
      "id": "cat3-rag-challenges-essay-medium-015",
      "conceptId": "rag-pipeline-challenges-essay",
      "difficulty": "medium",
      "category": "검색증강 생성 및 정보검색",
      "questionType": "essay",
      "prompt": "RAG의 기본 동작 구조를 설명한 뒤, 검색 결과가 완벽하지 않을 수 있다는 전제에서 Noise Robustness, Negative Rejection, Grounding, Information Integration, Counterfactual Robustness 중 세 가지를 골라 각각 어떤 상황에서 필요한지 서술하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "RAG는 사용자 질의를 바탕으로 외부 데이터스토어에서 관련 문서를 검색하고, 검색된 문서를 언어 모델의 컨텍스트로 제공하여 최종 답변을 생성하는 구조입니다.\n\n예를 들어 Noise Robustness는 관련 없는 문서가 함께 검색되어도 올바른 근거를 골라내는 능력입니다. Negative Rejection은 검색된 문서에 질문의 답이 없을 때 억지로 추측하지 않고 정보 부족을 밝히는 능력입니다. Grounding은 모델의 기존 지식과 검색 컨텍스트가 충돌할 때 주어진 컨텍스트에 기반해 답하도록 만드는 방향입니다. Information Integration은 여러 문서에 나뉜 정보를 결합하는 능력이며, Counterfactual Robustness는 검색 문서 자체에 잘못된 사실이 있을 때 그 오류에 대응하는 능력입니다.",
      "rubricKeywords": [
        "RAG",
        "Retriever",
        "Noise Robustness",
        "Negative Rejection",
        "Grounding",
        "Information Integration",
        "Counterfactual Robustness"
      ],
      "minLength": 190,
      "explanation": "RAG의 검색-생성 구조와 검색 품질 문제에 대응하는 각 역량의 상황적 차이를 설명해야 합니다.",
      "hint": "검색-생성 구조를 먼저 세운 뒤, 잡음·근거 부재·정보 분산·사실 오류라는 네 가지 상황을 각각의 역량 이름과 연결하세요."
    },

    // =========================================================================
    // 카테고리 4: 거대 언어 모델의 도구 활용 및 에이전트 (15문항: 객관식 12, 단답식 2, 서술형 1)
    // =========================================================================
    {
      "id": "cat4-agent-definition-medium-001",
      "conceptId": "agent-sensor-actuator",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "multiple-choice",
      "prompt": "고전적인 Agent 정의를 가장 잘 설명한 것은?",
      "options": [
        "환경을 인지하고 판단한 뒤 액추에이터를 통해 환경에 행동을 수행하는 시스템",
        "환경을 인지하지만 행동은 하지 않고 내부 예측 결과만 출력하는 시스템",
        "환경과 상호작용하지 않고 내부 지식만으로 응답을 계속 생성하는 시스템",
        "사람이 지정한 순서대로만 동작하고 환경 변화에는 반응하지 않는 시스템"
      ],
      "answer": 0,
      "explanation": "강의에서는 Russell & Norvig의 정의를 바탕으로 Agent가 센서를 통해 환경을 지각하고 액추에이터를 통해 행동한다고 설명합니다.",
      "hint": "센서로 인지하고, 판단하고, 액추에이터로 행동하는 고전적 정의를 떠올리세요."
    },
    {
      "id": "cat4-agent-judgment-medium-002",
      "conceptId": "what-counts-as-agent",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "multiple-choice",
      "prompt": "다음 시스템 중 강의의 'Is this an agent?' 판단에서 Agent로 보기 가장 어려운 것은?",
      "options": [
        "웹 브라우저를 사용해 정보를 찾고 다음 탐색 행동을 선택하는 LLM",
        "운영체제 파일을 찾아 코드로 처리하며 외부 환경에 작업을 수행하는 LLM",
        "외부 도구나 환경과 상호작용하지 않고 내부 추론만 수행하는 LLM",
        "환경 상태를 확인하고 필요한 도구를 골라 반복적으로 작업을 수행하는 LLM"
      ],
      "answer": 2,
      "explanation": "강의에서는 외부 환경과 상호작용하지 않는 복잡한 추론 LLM을 Agent가 아니라고 설명합니다. 단순 retrieve-and-generate RAG는 'Probably not'으로 제시됩니다.",
      "hint": "외부 환경에 실제로 '행동'을 하는지가 판단 기준입니다."
    },
    {
      "id": "cat4-agent-framework-medium-003",
      "conceptId": "agent-framework-components",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "multiple-choice",
      "prompt": "LLM Agent 프레임워크의 구성요소와 역할을 올바르게 연결한 것은?",
      "options": [
        "Controller는 환경 피드백을 요약하고, Perceiver는 호출 가능한 도구를 관리한다.",
        "Controller는 실행 계획을 세우고, Perceiver는 환경 피드백을 요약해 전달한다.",
        "Controller는 도구 실행 환경을 제공하고, Perceiver는 사용자 요청을 계획으로 바꾼다.",
        "Controller는 도구 목록을 저장하고, Perceiver는 실제 환경에서 도구를 실행한다."
      ],
      "answer": 1,
      "explanation": "강의에서 Controller는 사용자 요청을 달성하기 위한 계획을 세우고, Perceiver는 환경의 피드백을 요약해 Controller에 전달합니다.",
      "hint": "계획을 세우는 쪽과 환경 피드백을 요약하는 쪽을 나눠보세요."
    },
    {
      "id": "cat4-tool-definition-medium-004",
      "conceptId": "tool-function-interface",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "multiple-choice",
      "prompt": "LLM Agent에서 Tool의 의미를 가장 정확하게 설명한 것은?",
      "options": [
        "모델 내부 파라미터에 저장되어 외부 실행 없이 사용하는 고정된 지식 구조",
        "모델이 생성한 텍스트를 사람이 읽기 좋은 형태로 다듬는 후처리 규칙의 모음",
        "모델의 출력 길이와 온도 같은 생성 옵션을 담아 두는 설정 값들의 묶음",
        "외부 프로그램과 연결되어 함수 호출과 입력 인자를 통해 실행되는 기능 인터페이스"
      ],
      "answer": 3,
      "explanation": "강의에서는 Tool을 언어 모델 외부 프로그램과 연결된 함수 인터페이스로 설명하며, LLM이 function call과 입력 인자를 생성해 사용할 수 있다고 설명합니다.",
      "hint": "모델이 함수 이름과 인자를 채워 넣으면 실제로 '실행'되는 대상입니다."
    },
    {
      "id": "cat4-tool-mode-medium-005",
      "conceptId": "tool-use-two-modes",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "multiple-choice",
      "prompt": "LLM이 외부 도구를 사용하는 과정에서 강의가 구분한 두 모드의 관계로 가장 적절한 것은?",
      "options": [
        "텍스트 생성 모드만 계속 사용하며 외부 도구 호출은 별도의 모델이 대신 처리한다.",
        "도구 실행 모드만 계속 사용하며 자연어 응답은 외부 프로그램이 대신 생성한다.",
        "텍스트 생성과 도구 실행 모드를 오가며 필요할 때 도구를 호출하고 결과를 반영한다.",
        "도구 실행 후에는 파라미터를 다시 학습해야 텍스트 생성 모드로 돌아갈 수 있다."
      ],
      "answer": 2,
      "explanation": "강의의 Tool Use Paradigm은 Text-generation mode와 Tool-execution mode를 구분하며, 필요에 따라 모드를 전환하는 구조를 설명합니다.",
      "hint": "답을 쓰다가 필요할 때 도구를 부르고, 결과를 받아 다시 이어 쓰는 흐름입니다."
    },
    {
      "id": "cat4-webgpt-medium-006",
      "conceptId": "webgpt-imitation-learning",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "multiple-choice",
      "prompt": "WebGPT가 웹 검색 도구 사용 능력을 학습한 방식으로 가장 적절한 것은?",
      "options": [
        "인간의 웹 탐색 행동 궤적을 모방 학습한 뒤 인간 선호 기반 강화학습으로 다듬었다.",
        "검색 엔진 API 문서를 프롬프트에 넣어 별도 학습 없이 그대로 사용하게 했다.",
        "검색 결과 문서를 사전 학습 코퍼스에 추가해 파라미터 안에 지식을 넣었다.",
        "사람이 만든 검색 질의 목록을 규칙으로 매칭해 정해진 순서대로 호출하게 했다."
      ],
      "answer": 0,
      "explanation": "WebGPT는 인간이 실제로 웹을 탐색하며 검색·클릭·인용하는 행동 궤적을 모방 학습(지도학습)하고, 이후 인간 선호 기반 강화학습으로 검색 행동을 다듬은 사례입니다.",
      "hint": "사람이 검색하는 과정을 그대로 따라 배우고, 그 위에 강화학습을 얹었습니다."
    },
    {
      "id": "cat4-toolformer-medium-007",
      "conceptId": "toolformer-self-supervised-tool-learning",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "multiple-choice",
      "prompt": "Toolformer의 핵심 아이디어를 WebGPT와 비교해 가장 잘 설명한 것은?",
      "options": [
        "인간이 직접 기록한 웹 탐색 궤적을 모방해 도구 사용 방식을 그대로 학습한다.",
        "도구별 호출 규칙을 사람이 직접 작성해 정해진 규칙대로만 호출하도록 만든다.",
        "도구 호출 형식을 공통 프로토콜로 통일해 서로 다른 모델 사이의 호환성을 높인다.",
        "API 호출 후보를 스스로 생성·실행한 뒤 도움이 되는 호출만 골라 학습 데이터로 쓴다."
      ],
      "answer": 3,
      "explanation": "Toolformer는 자기지도 방식으로 API call을 샘플링하고 실행한 뒤, 언어 모델링에 도움이 되는 호출만 필터링하여 학습 데이터를 구축합니다.",
      "hint": "사람이 라벨을 주지 않고, 모델이 스스로 만들고 걸러냅니다."
    },
    {
      "id": "cat4-toolformer-pipeline-medium-008",
      "conceptId": "toolformer-sample-execute-filter",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "multiple-choice",
      "prompt": "Toolformer의 데이터 생성 파이프라인 순서로 옳은 것은?",
      "options": [
        "API 실행 → API 호출 필터링 → API 호출 샘플링",
        "API 호출 샘플링 → API 실행 → API 호출 필터링",
        "API 호출 필터링 → API 호출 샘플링 → API 실행",
        "API 호출 샘플링 → API 호출 필터링 → API 실행"
      ],
      "answer": 1,
      "explanation": "강의의 Toolformer 파이프라인은 Sample API Calls → Execute API Calls → Filter API Calls 순서입니다.",
      "hint": "먼저 후보를 만들고, 실제로 써 보고, 도움이 된 것만 남깁니다."
    },
    {
      "id": "cat4-toolllm-medium-009",
      "conceptId": "toolllm-scale-generalization",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "multiple-choice",
      "prompt": "ToolLLM이 도구 사용의 일반화 범위를 넓히기 위해 취한 접근으로 가장 적절한 것은?",
      "options": [
        "16,000개 이상의 실제 API를 모은 대규모 ToolBench 환경에서 학습하고 평가했다.",
        "하나의 검색 API에만 집중해 해당 도구를 호출하는 정확도를 극단적으로 끌어올렸다.",
        "도구 호출 자체를 없애고 모델 내부 지식만으로 답하도록 학습 목표를 바꾸었다.",
        "사람이 손으로 작성한 수십 개 수준의 도구 사용 예시만으로 미세조정을 수행했다."
      ],
      "answer": 0,
      "explanation": "ToolLLM은 16,000개 이상의 실제 API를 모은 ToolBench를 구축해, 특정 도구에 한정되지 않는 넓은 도구 다양성과 일반화를 목표로 했습니다.",
      "hint": "'얼마나 많은 종류의 API를 다뤄봤는가'가 핵심입니다."
    },
    {
      "id": "cat4-gui-agent-medium-010",
      "conceptId": "multimodal-gui-agent",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "multiple-choice",
      "prompt": "도구 사용 연구가 GUI·멀티모달 에이전트로 확장되었다는 설명으로 가장 적절한 것은?",
      "options": [
        "텍스트 API의 반환값만 읽고 화면이나 입력 장치에는 행동하지 않는 방향으로 확장된다.",
        "화면 조작은 사람이 맡고 모델은 클릭 이후의 결과 텍스트만 요약하는 방향으로 확장된다.",
        "웹 문서의 HTML과 API만 사용하고 마우스·키보드 조작은 다루지 않는 방향으로 확장된다.",
        "화면 같은 멀티모달 환경을 인식하고 마우스·키보드 등으로 직접 행동하는 방향으로 확장된다."
      ],
      "answer": 3,
      "explanation": "강의에서는 Tool Learning이 멀티모달 도구 학습, GUI 환경, embodied agent 방향으로 확장되는 흐름을 소개합니다.",
      "hint": "사람이 컴퓨터를 쓰는 방식 그대로를 모델이 하게 되는 흐름입니다."
    },
    {
      "id": "cat4-mcp-why-medium-011",
      "conceptId": "mcp-motivation-fragmentation",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "multiple-choice",
      "prompt": "MCP가 필요해진 배경을 가장 잘 설명한 것은?",
      "options": [
        "모델과 회사마다 도구 호출 방식이 이미 동일해 통합 규격을 새로 만들 필요가 있었기 때문이다.",
        "모델과 회사마다 도구 호출 방식과 스키마가 달라 호환성과 도구 재사용성이 낮았기 때문이다.",
        "사용 가능한 도구 수가 줄어들면서 도구마다 개별 구현하는 편이 더 저렴해졌기 때문이다.",
        "도구 실행 결과의 형식이 이미 통일되어 있어 모델이 따로 해석할 필요가 없어졌기 때문이다."
      ],
      "answer": 1,
      "explanation": "강의의 'Why MCP?'는 회사와 모델마다 서로 다른 tool calling 방식과 schema가 생겨 호환성이 부족하고 같은 도구를 반복 구현해야 하는 문제를 배경으로 설명합니다.",
      "hint": "같은 도구를 모델이 바뀔 때마다 다시 붙여야 하는 상황을 떠올려보세요."
    },
    {
      "id": "cat4-mcp-role-medium-012",
      "conceptId": "mcp-standardized-protocol",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "multiple-choice",
      "prompt": "강의에서 설명한 MCP의 핵심 역할로 가장 적절한 것은?",
      "options": [
        "도구 개발자가 사용할 프로그래밍 언어와 서버 배포 방식을 하나로 통일한다.",
        "도구 사용 학습에 쓰이는 데이터셋의 라이선스와 배포 조건을 공통으로 통일한다.",
        "도구 호출·응답 전달·컨텍스트 공유를 모델과 외부 도구 사이의 공통 규칙으로 표준화한다.",
        "도구 실행 속도를 높이기 위해 호출 결과를 캐싱하고 재사용하는 방식을 표준화한다."
      ],
      "answer": 2,
      "explanation": "강의에서는 MCP를 언어 모델이 외부 도구와 상호작용하기 위한 표준 프로토콜로 설명하며, Tool call, response delivery, context sharing을 공통 규칙으로 다룹니다.",
      "hint": "무엇을 '주고받는 규칙'으로 표준화하는지에 집중하세요."
    },
    {
      "id": "cat4-toolformer-short-medium-013",
      "conceptId": "toolformer-filtering-criterion",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "short-answer",
      "prompt": "Toolformer가 API 호출 후보를 걸러낼 때 기준으로 삼는 값을 작성하시오. (해당 호출을 끼워 넣었을 때 줄어들어야 하는 값)",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "언어 모델링 손실",
        "언어모델링 손실",
        "loss",
        "Loss",
        "손실",
        "LM loss",
        "language modeling loss",
        "perplexity",
        "Perplexity",
        "다음 토큰 예측 손실"
      ],
      "explanation": "Toolformer는 API 호출 후보를 샘플링해 실행한 뒤, 그 결과를 넣었을 때 언어 모델링 손실(다음 토큰 예측 손실)이 줄어드는 호출만 남겨 자기지도 방식으로 학습 데이터를 만듭니다.",
      "hint": "호출 결과를 끼워 넣었을 때 다음 토큰 예측이 더 쉬워져야 남깁니다."
    },
    {
      "id": "cat4-agent-components-short-medium-014",
      "conceptId": "agent-components-short",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "short-answer",
      "prompt": "LLM Agent 프레임워크의 4대 구성요소를 영문으로 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Controller, Perceiver, Tool Set, Environment",
        "Controller,Perceiver,Tool Set,Environment",
        "Controller, Perceiver, ToolSet, Environment",
        "controller, perceiver, tool set, environment",
        "Controller, Tool Set, Environment, Perceiver",
        "Controller / Perceiver / Tool Set / Environment"
      ],
      "explanation": "강의의 LLM Agent 프레임워크는 Controller, Perceiver, Tool Set, Environment로 구성됩니다.",
      "hint": "계획, 도구 집합, 실행 환경, 환경 피드백을 담당하는 네 구성요소를 떠올려보세요."
    },
    {
      "id": "cat4-agent-tool-mcp-essay-medium-015",
      "conceptId": "agent-tool-mcp-integration-essay",
      "difficulty": "medium",
      "category": "거대 언어 모델의 도구 활용 및 에이전트",
      "questionType": "essay",
      "prompt": "LLM Agent가 사용자 요청을 처리하는 흐름을 Controller, Tool Set, Environment, Perceiver를 이용해 설명하고, WebGPT·Toolformer·ToolLLM이 도구 학습을 어떻게 확장해 왔는지 정리한 뒤 MCP가 필요한 이유와 역할을 서술하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "LLM Agent에서 Controller는 사용자의 요청을 이해하고 목표 달성을 위한 계획을 세우며 사용할 도구를 결정합니다. Tool Set은 외부 기능들의 집합이고, 선택된 도구는 Environment에서 실행됩니다. Perceiver는 실행 결과와 환경 피드백을 요약해 Controller에 전달하며, Controller는 이를 바탕으로 다음 행동이나 최종 응답을 결정합니다.\n\n도구 학습의 흐름을 보면 WebGPT는 인간의 웹 검색 행동을 모방하는 지도학습과 강화학습을 통해 검색 도구 사용을 익혔습니다. Toolformer는 모델이 API 호출 후보를 스스로 샘플링하고 실행한 뒤, 언어 모델링에 도움이 되는 호출만 필터링해 자기지도 방식으로 학습 데이터를 만들었습니다. ToolLLM은 16,000개 이상의 실제 API를 활용해 훨씬 넓은 도구 다양성과 일반화를 목표로 했습니다.\n\n도구 활용 연구가 확장되면서 모델과 회사마다 서로 다른 tool calling 방식과 schema가 생겨 호환성과 재사용성이 떨어지는 문제가 나타났습니다. MCP는 언어 모델과 외부 도구의 상호작용을 위한 표준 프로토콜로, 도구 호출, 응답 전달, 컨텍스트 공유를 공통 규칙 아래 처리하도록 하여 이러한 파편화를 줄이는 역할을 합니다.",
      "rubricKeywords": [
        "Controller",
        "Tool Set",
        "Environment",
        "Perceiver",
        "WebGPT",
        "Toolformer",
        "ToolLLM",
        "MCP",
        "표준화"
      ],
      "minLength": 220,
      "explanation": "Agent의 피드백 루프, 도구 학습의 발전 흐름, MCP가 해결하려는 파편화와 표준화 역할을 연결해서 설명해야 합니다.",
      "hint": "Controller→Tool Set→Environment→Perceiver의 순환을 먼저 그리고, WebGPT·Toolformer·ToolLLM의 차이를 이어 붙인 뒤 MCP로 마무리하세요."
    },

  ],
  hard: [],
  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();

