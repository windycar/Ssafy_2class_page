// AI Python 2주차 - 자연어 처리와 텍스트 파운데이션 모델
// 지정된 출제 범위만 사용한 자기완결형 SSAFY 과목평가 대비 문제은행
// 난이도별 100문제: 객관식 75 + 단답형 15 + 서술형 10

export type StudyDifficulty = "easy" | "medium" | "hard";

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
  hint: string;
}

export const QUESTION_BANK: Record<StudyDifficulty, StudyQuestion[]> = {
  "easy": [
    {
      "id": "week2-easy-mc-001",
      "conceptId": "cbow-easy-direct-001",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "Word2Vec의 CBOW가 학습하는 예측 방향으로 옳은 것은?",
      "options": [
        "주변 문맥 단어들을 입력해 중심 단어를 예측한다.",
        "중심 단어를 입력해 주변 문맥 단어들을 예측한다.",
        "이전 hidden state만으로 문장 전체의 label을 생성한다.",
        "정답 문장을 입력해 encoder의 모든 가중치를 고정한다."
      ],
      "answer": 0,
      "explanation": "CBOW는 주변 문맥의 표현을 모아 중심 단어를 예측한다. 중심 단어로 주변 단어를 예측하는 방식은 Skip-gram이다.",
      "hint": "CBOW와 Skip-gram의 입력과 예측 대상을 서로 바꾸어 생각하지 않는다."
    },
    {
      "id": "week2-easy-mc-013",
      "conceptId": "attention-easy-direct-013",
      "difficulty": "easy",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "Seq2Seq의 고정 길이 context vector 병목을 완화하기 위해 Attention이 수행하는 역할은?",
      "options": [
        "모든 encoder hidden state에 항상 같은 가중치를 부여한다.",
        "현재 생성 시점과 관련된 encoder hidden state에 더 큰 가중치를 부여한다.",
        "입력 토큰을 모두 제거하고 decoder의 이전 출력만 사용한다.",
        "정답 문장을 하나의 label로 바꾸어 분류 문제로 만든다."
      ],
      "answer": 1,
      "explanation": "Attention은 각 생성 시점마다 관련성이 높은 encoder hidden state를 선택적으로 참조해 고정 길이 벡터의 정보 병목을 줄인다.",
      "hint": "모든 입력을 동일하게 보는지, 생성 시점에 따라 중요도를 다르게 주는지 구분한다."
    },
    {
      "id": "week2-easy-mc-023",
      "conceptId": "cross_attention-easy-direct-023",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "Encoder-Decoder Transformer의 Cross-Attention에서 Q·K·V의 출처를 올바르게 연결한 것은?",
      "options": [
        "Q·K·V가 모두 decoder의 masked self-attention 출력에서 나온다.",
        "Q는 encoder에서, K와 V는 decoder에서 나온다.",
        "Q는 decoder에서, K와 V는 encoder 출력에서 나온다.",
        "Q·K·V가 모두 encoder의 입력 embedding에서 나온다."
      ],
      "answer": 2,
      "explanation": "Cross-Attention은 decoder의 현재 표현을 Query로 사용하고 encoder의 출력 표현을 Key와 Value로 사용한다.",
      "hint": "무엇을 찾는 쪽이 Query이고, 참조할 정보를 제공하는 쪽이 Key·Value인지 구분한다."
    },
    {
      "id": "week2-easy-mc-035",
      "conceptId": "bert-easy-direct-035",
      "difficulty": "easy",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "Transformer encoder와 Masked Language Modeling을 중심으로 사전학습하는 대표 모델은?",
      "options": [
        "GPT",
        "T5",
        "Word2Vec",
        "BERT"
      ],
      "answer": 3,
      "explanation": "BERT는 Transformer encoder 구조를 사용하며 가려진 토큰을 복원하는 Masked Language Modeling으로 양방향 문맥 표현을 학습한다.",
      "hint": "encoder-only 구조와 가려진 토큰 복원을 함께 만족하는 모델을 찾는다."
    },
    {
      "id": "week2-easy-mc-043",
      "conceptId": "closed-easy-direct-043",
      "difficulty": "easy",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "다음 조건에 부합하는 항목으로 가장 적절한 것은? ChatGPT, Claude, Gemini처럼 내부 가중치가 공개되지 않고 주로 API로 사용하는 모델 유형이다.",
      "options": [
        "Closed model",
        "N-gram model",
        "RNN-only model",
        "Open model"
      ],
      "answer": 0,
      "explanation": "정답은 \"Closed model\"이다. 대규모 사전학습 이후 지시 데이터와 인간 선호를 반영하는 정렬 단계를 순서대로 구분해야 한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-easy-mc-050",
      "conceptId": "alignment-easy-direct-050",
      "difficulty": "easy",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "다음 설명이 가리키는 개념으로 가장 적절한 것은? 다음 토큰 예측만으로는 지시 준수와 선호를 보장하기 어려워 alignment가 필요하다.",
      "options": [
        "어휘를 무조건 줄이기",
        "사용자 지시와 선호에 맞는 출력",
        "모델 크기만 늘리기",
        "정답을 하나로 고정"
      ],
      "answer": 1,
      "explanation": "정답은 \"사용자 지시와 선호에 맞는 출력\"이다. 대규모 사전학습 이후 지시 데이터와 인간 선호를 반영하는 정렬 단계를 순서대로 구분해야 한다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-easy-mc-056",
      "conceptId": "autoregressive-easy-direct-056",
      "difficulty": "easy",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다양한 NLP 과제를 자연어 instruction 템플릿으로 통일해 학습함으로써 보지 못한 지시에도 대응하도록 만든 instruction tuning 사례는?",
      "options": [
        "Word2Vec",
        "BERT의 MLM",
        "FLAN",
        "Beam Search"
      ],
      "answer": 2,
      "explanation": "FLAN은 여러 태스크를 자연어 instruction 형식으로 변환해 학습하여 새로운 지시에 대한 일반화 성능을 높인 사례다.",
      "hint": "여러 과제를 자연어 지시 형식으로 통합해 학습한 모델을 찾는다."
    },
    {
      "id": "week2-easy-mc-065",
      "conceptId": "accuracy-easy-direct-065",
      "difficulty": "easy",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "다음 동작 또는 역할에 해당하는 항목은? 정답이 명확한 문제는 예측과 정답의 일치도를 정확도로 평가할 수 있다.",
      "options": [
        "ROUGE",
        "BLEU만",
        "PPL",
        "Accuracy"
      ],
      "answer": 3,
      "explanation": "정답은 \"Accuracy\"이다. 평가 지표마다 문자열·의미·확률·사람의 선호 중 측정하는 대상이 다르며 편향 가능성도 있다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-easy-mc-002",
      "conceptId": "cell_state-easy-direct-002",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 설명을 만족하는 개념을 고르시오. LSTM에서 장기 정보를 전달하는 주요 경로다.",
      "options": [
        "Cell state",
        "Attention score",
        "Hidden state만",
        "Reward score"
      ],
      "answer": 0,
      "explanation": "정답은 \"Cell state\"이다. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-easy-mc-014",
      "conceptId": "beam-easy-direct-014",
      "difficulty": "easy",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "다음 조건에 부합하는 항목으로 가장 적절한 것은? 각 단계에서 상위 k개의 부분 시퀀스를 유지하며 더 좋은 전체 문장을 탐색한다.",
      "options": [
        "Greedy decoding",
        "Beam search",
        "One-hot encoding",
        "Masked LM"
      ],
      "answer": 1,
      "explanation": "정답은 \"Beam search\"이다. Seq2Seq의 병목과 Attention이 어떤 encoder 정보를 선택적으로 참조하는지 연결해야 한다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-easy-mc-024",
      "conceptId": "decoder_context-easy-direct-024",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 설명이 가리키는 개념으로 가장 적절한 것은? [ decoder의 masked self-attention은 현재까지의 토큰만 사용한다. ]",
      "options": [
        "문맥 없음",
        "양방향 문맥",
        "단방향 문맥",
        "미래 토큰만"
      ],
      "answer": 2,
      "explanation": "정답은 \"단방향 문맥\"이다. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-easy-mc-036",
      "conceptId": "few_shot-easy-direct-036",
      "difficulty": "easy",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "다음 특성과 가장 정확하게 연결되는 항목은? [ 소수의 입력-출력 예시를 프롬프트에 제공하는 설정이다. ]",
      "options": [
        "Masked LM",
        "Zero-shot",
        "Full fine-tuning",
        "Few-shot"
      ],
      "answer": 3,
      "explanation": "정답은 \"Few-shot\"이다. BERT·GPT·T5는 Transformer를 사용하지만 구조와 사전학습 목표가 서로 다르다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-easy-mc-044",
      "conceptId": "emergent-easy-direct-044",
      "difficulty": "easy",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "다음 동작 또는 역할에 해당하는 항목은? 규모가 일정 임계점을 넘을 때 이전에 뚜렷하지 않던 새로운 능력이 나타나는 현상이다.",
      "options": [
        "Emergent ability",
        "Gradient clipping",
        "One-hot sparsity",
        "Beam collapse"
      ],
      "answer": 0,
      "explanation": "정답은 \"Emergent ability\"이다. 대규모 사전학습 이후 지시 데이터와 인간 선호를 반영하는 정렬 단계를 순서대로 구분해야 한다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-easy-mc-051",
      "conceptId": "flan-easy-direct-051",
      "difficulty": "easy",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "다음 설명을 만족하는 개념을 고르시오. 다양한 태스크를 여러 자연어 instruction 템플릿으로 변환해 학습한 instruction tuning 사례다.",
      "options": [
        "Word2Vec",
        "FLAN",
        "LSTM",
        "BLEU"
      ],
      "answer": 1,
      "explanation": "정답은 \"FLAN\"이다. 대규모 사전학습 이후 지시 데이터와 인간 선호를 반영하는 정렬 단계를 순서대로 구분해야 한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-easy-mc-057",
      "conceptId": "eos-easy-direct-057",
      "difficulty": "easy",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다음 조건에 부합하는 항목으로 가장 적절한 것은? 생성 종료를 나타내는 특수 토큰이며 최대 길이 조건과 함께 종료 기준으로 사용될 수 있다.",
      "options": [
        "MASK",
        "CLS만",
        "EOS",
        "PAD만"
      ],
      "answer": 2,
      "explanation": "정답은 \"EOS\"이다. temperature·top-k·top-p는 후보 선택 범위와 확률 분포에 서로 다른 방식으로 영향을 준다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-easy-mc-066",
      "conceptId": "length_bias-easy-direct-066",
      "difficulty": "easy",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "다음 설명이 가리키는 개념으로 가장 적절한 것은? [ 품질과 무관하게 길이가 긴 응답을 상대적으로 선호할 수 있는 평가 편향이다. ]",
      "options": [
        "위치 편향",
        "자기 선호 편향",
        "Gradient vanishing",
        "길이 편향"
      ],
      "answer": 3,
      "explanation": "정답은 \"길이 편향\"이다. 평가 지표마다 문자열·의미·확률·사람의 선호 중 측정하는 대상이 다르며 편향 가능성도 있다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-easy-mc-003",
      "conceptId": "dim_curse-easy-direct-003",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 특성과 가장 정확하게 연결되는 항목은? 어휘가 커질수록 One-hot 벡터 차원이 커져 메모리와 계산 효율이 나빠진다.",
      "options": [
        "차원의 저주",
        "미래 참조",
        "보상 해킹",
        "교사 강요"
      ],
      "answer": 0,
      "explanation": "정답은 \"차원의 저주\"이다. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-easy-mc-015",
      "conceptId": "bleu-easy-direct-015",
      "difficulty": "easy",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "다음 동작 또는 역할에 해당하는 항목은? 기계번역 결과와 사람 번역의 유사도를 평가하는 지표로 소개된다.",
      "options": [
        "ROUGE",
        "BLEU",
        "Accuracy만",
        "PPL"
      ],
      "answer": 1,
      "explanation": "정답은 \"BLEU\"이다. Seq2Seq의 병목과 Attention이 어떤 encoder 정보를 선택적으로 참조하는지 연결해야 한다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-easy-mc-025",
      "conceptId": "encoder_context-easy-direct-025",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 설명을 만족하는 개념을 고르시오. encoder는 causal mask 없이 입력 전체를 보며 각 토큰을 양방향 문맥으로 인코딩할 수 있다.",
      "options": [
        "단방향 문맥",
        "미래 토큰만",
        "양방향 문맥",
        "문맥 없음"
      ],
      "answer": 2,
      "explanation": "정답은 \"양방향 문맥\"이다. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-easy-mc-037",
      "conceptId": "icl-easy-direct-037",
      "difficulty": "easy",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "다음 조건에 부합하는 항목으로 가장 적절한 것은? 모델 가중치를 바꾸지 않고 프롬프트의 instruction과 example을 이용해 새 작업을 수행한다.",
      "options": [
        "반드시 gradient update",
        "항상 라벨 생성",
        "별도 모델 재학습",
        "파라미터 업데이트 없이 프롬프트의 지시·예시로 새 작업을 수행"
      ],
      "answer": 3,
      "explanation": "정답은 \"파라미터 업데이트 없이 프롬프트의 지시·예시로 새 작업을 수행\"이다. BERT·GPT·T5는 Transformer를 사용하지만 구조와 사전학습 목표가 서로 다르다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-easy-mc-045",
      "conceptId": "foundation_data-easy-direct-045",
      "difficulty": "easy",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "파운데이션 모델이 다양한 다운스트림 과제에 활용될 수 있는 일반적인 표현을 학습하기 위해 필요한 학습 데이터의 특징은?",
      "options": [
        "규모가 크고 다양한 데이터",
        "정답 하나만 반복한 데이터",
        "단일 샘플로만 구성된 데이터",
        "평가용 정답을 포함한 테스트 데이터만"
      ],
      "answer": 0,
      "explanation": "파운데이션 모델은 대규모의 다양한 데이터에서 폭넓은 패턴과 표현을 사전학습한 뒤 여러 과제에 적용된다.",
      "hint": "한 과제에만 맞춘 소량 데이터와 여러 과제에 전이할 표현을 학습할 데이터를 비교한다."
    },
    {
      "id": "week2-easy-mc-052",
      "conceptId": "ppo-easy-direct-052",
      "difficulty": "easy",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "InstructGPT의 RLHF 단계에서 Reward Model의 점수를 이용해 언어 모델 정책을 최적화하는 데 사용된 알고리즘은?",
      "options": [
        "Supervised Fine-Tuning",
        "PPO",
        "Masked Language Modeling",
        "Perplexity"
      ],
      "answer": 1,
      "explanation": "InstructGPT는 인간 선호를 근사한 Reward Model의 보상을 이용해 PPO로 정책 모델을 최적화한다.",
      "hint": "지시 데이터로 지도학습하는 단계가 아니라 보상을 이용해 정책을 갱신하는 알고리즘을 찾는다."
    },
    {
      "id": "week2-easy-mc-058",
      "conceptId": "knn_prompt-easy-direct-058",
      "difficulty": "easy",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다음 동작 또는 역할에 해당하는 항목은? 테스트 쿼리와 임베딩 거리가 가까운 학습 예시를 골라 few-shot 문맥으로 제공한다.",
      "options": [
        "가장 먼 예시 선택",
        "무작위 라벨 생성",
        "kNN 기반 예시 선택",
        "모든 예시 삭제"
      ],
      "answer": 2,
      "explanation": "정답은 \"kNN 기반 예시 선택\"이다. temperature·top-k·top-p는 후보 선택 범위와 확률 분포에 서로 다른 방식으로 영향을 준다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-easy-mc-067",
      "conceptId": "llm_judge-easy-direct-067",
      "difficulty": "easy",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "생성된 답변의 품질이나 두 답변 사이의 상대적 선호를 다른 거대 언어 모델이 평가하도록 하는 방식은?",
      "options": [
        "사람 평가만 사용",
        "문자열 Exact Match",
        "ROUGE n-gram 비교",
        "LLM-as-judge"
      ],
      "answer": 3,
      "explanation": "LLM-as-judge는 평가용 언어 모델이 기준에 따라 생성 결과에 점수를 주거나 후보 응답의 우열을 판단하는 방식이다.",
      "hint": "생성 모델이 아니라 별도의 언어 모델을 자동 평가자로 사용하는 방식을 찾는다."
    },
    {
      "id": "week2-easy-mc-004",
      "conceptId": "embedding-easy-direct-004",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 조건에 부합하는 항목으로 가장 적절한 것은? 단어를 의미 정보를 담은 저차원의 밀집 연속 벡터로 표현한다.",
      "options": [
        "Word embedding",
        "One-hot encoding",
        "Beam search",
        "Reward Model"
      ],
      "answer": 0,
      "explanation": "정답은 \"Word embedding\"이다. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-easy-mc-016",
      "conceptId": "decoder-easy-direct-016",
      "difficulty": "easy",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "다음 설명이 가리키는 개념으로 가장 적절한 것은? encoder 표현을 조건으로 출력 시퀀스를 한 단계씩 생성한다.",
      "options": [
        "Encoder",
        "Decoder",
        "Tokenizer",
        "Evaluator"
      ],
      "answer": 1,
      "explanation": "정답은 \"Decoder\"이다. Seq2Seq의 병목과 Attention이 어떤 encoder 정보를 선택적으로 참조하는지 연결해야 한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-easy-mc-026",
      "conceptId": "layernorm-easy-direct-026",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 특성과 가장 정확하게 연결되는 항목은? 각 레이어의 hidden vector 값을 정규화해 안정적이고 빠른 학습을 돕는다.",
      "options": [
        "Beam Search",
        "Window size",
        "Layer Normalization",
        "Reward Model"
      ],
      "answer": 2,
      "explanation": "정답은 \"Layer Normalization\"이다. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-easy-mc-038",
      "conceptId": "mlm-easy-direct-038",
      "difficulty": "easy",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "다음 동작 또는 역할에 해당하는 항목은? 일부 입력 토큰을 [MASK]로 바꾸고 원래 단어를 예측하는 사전학습 목표다.",
      "options": [
        "Causal LM",
        "Beam Search",
        "Reward Modeling",
        "Masked Language Model"
      ],
      "answer": 3,
      "explanation": "정답은 \"Masked Language Model\"이다. BERT·GPT·T5는 Transformer를 사용하지만 구조와 사전학습 목표가 서로 다르다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-easy-mc-046",
      "conceptId": "foundation_transformer-easy-direct-046",
      "difficulty": "easy",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "텍스트 파운데이션 모델의 기반 구조로 널리 사용되며 Attention을 중심으로 시퀀스를 처리하는 모델은?",
      "options": [
        "Transformer",
        "K-nearest neighbors",
        "단순선형회귀",
        "K-means"
      ],
      "answer": 0,
      "explanation": "현대 텍스트 파운데이션 모델은 주로 Attention 기반 Transformer 구조를 사용해 대규모 시퀀스 데이터를 학습한다.",
      "hint": "Self-Attention을 핵심 연산으로 사용하는 시퀀스 모델을 찾는다."
    },
    {
      "id": "week2-easy-mc-053",
      "conceptId": "preference-easy-direct-053",
      "difficulty": "easy",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "같은 질문에 대한 여러 후보 응답을 사람이 비교한 결과로 어떤 응답을 더 선호하는지 학습하는 방법은?",
      "options": [
        "Masked Language Modeling",
        "Preference learning",
        "Next Token Prediction",
        "Beam Search"
      ],
      "answer": 1,
      "explanation": "Preference learning은 후보 응답 사이의 인간 선호 비교를 학습해 응답의 상대적인 선호도를 모델링한다.",
      "hint": "정답 토큰 하나가 아니라 두 응답 중 어느 쪽을 더 선호하는지를 학습한다."
    },
    {
      "id": "week2-easy-mc-059",
      "conceptId": "prompt_eng-easy-direct-059",
      "difficulty": "easy",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다음 설명이 가리키는 개념으로 가장 적절한 것은? 원하는 출력을 얻도록 지시와 예시를 설계·조정하는 과정이다.",
      "options": [
        "최소제곱법",
        "One-hot encoding",
        "프롬프트 엔지니어링",
        "LayerNorm"
      ],
      "answer": 2,
      "explanation": "정답은 \"프롬프트 엔지니어링\"이다. temperature·top-k·top-p는 후보 선택 범위와 확률 분포에 서로 다른 방식으로 영향을 준다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-easy-mc-068",
      "conceptId": "mmlu-easy-direct-068",
      "difficulty": "easy",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "다음 특성과 가장 정확하게 연결되는 항목은? 57개의 다양한 전문 분야 객관식 문제로 구성된 벤치마크로 소개된다.",
      "options": [
        "PPO",
        "BLEU",
        "Self-Instruct",
        "MMLU"
      ],
      "answer": 3,
      "explanation": "정답은 \"MMLU\"이다. 평가 지표마다 문자열·의미·확률·사람의 선호 중 측정하는 대상이 다르며 편향 가능성도 있다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-easy-mc-005",
      "conceptId": "forget_gate-easy-direct-005",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 동작 또는 역할에 해당하는 항목은? 이전 cell state의 정보를 얼마나 유지하거나 버릴지 결정한다.",
      "options": [
        "Forget gate",
        "Input gate",
        "Output gate",
        "Softmax gate"
      ],
      "answer": 0,
      "explanation": "정답은 \"Forget gate\"이다. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-easy-mc-017",
      "conceptId": "end2end-easy-direct-017",
      "difficulty": "easy",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "다음 설명을 만족하는 개념을 고르시오. encoder와 decoder를 하나의 신경망으로 연결해 역전파로 함께 학습한다.",
      "options": [
        "규칙 기반 번역",
        "End-to-End 학습",
        "무작위 탐색",
        "비지도 군집화"
      ],
      "answer": 1,
      "explanation": "정답은 \"End-to-End 학습\"이다. Seq2Seq의 병목과 Attention이 어떤 encoder 정보를 선택적으로 참조하는지 연결해야 한다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-easy-mc-027",
      "conceptId": "multihead-easy-direct-027",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 조건에 부합하는 항목으로 가장 적절한 것은? 여러 attention head가 문법적·의미적 관계 등 서로 다른 관점을 병렬로 학습한다.",
      "options": [
        "한 관점만 강제",
        "순차 계산 증가만",
        "여러 관점의 관계를 동시에 포착",
        "라벨 수 증가"
      ],
      "answer": 2,
      "explanation": "정답은 \"여러 관점의 관계를 동시에 포착\"이다. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-easy-mc-039",
      "conceptId": "one_shot-easy-direct-039",
      "difficulty": "easy",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "다음 설명이 가리키는 개념으로 가장 적절한 것은? 하나의 예시를 프롬프트에 제공하는 설정이다.",
      "options": [
        "Zero-shot",
        "Few-shot",
        "RLHF",
        "One-shot"
      ],
      "answer": 3,
      "explanation": "정답은 \"One-shot\"이다. BERT·GPT·T5는 Transformer를 사용하지만 구조와 사전학습 목표가 서로 다르다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-easy-mc-047",
      "conceptId": "llm_pretrain-easy-direct-047",
      "difficulty": "easy",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "다음 특성과 가장 정확하게 연결되는 항목은? 거대 언어 모델의 대표적 사전학습 목표는 대규모 텍스트에서 다음 토큰을 예측하는 것이다.",
      "options": [
        "다음 토큰 예측",
        "정답 순위만",
        "클러스터 개수 예측",
        "이미지 분할만"
      ],
      "answer": 0,
      "explanation": "정답은 \"다음 토큰 예측\"이다. 대규모 사전학습 이후 지시 데이터와 인간 선호를 반영하는 정렬 단계를 순서대로 구분해야 한다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-easy-mc-054",
      "conceptId": "rlhf-easy-direct-054",
      "difficulty": "easy",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "사람이 선호하는 응답을 모델의 출력 정책에 반영하기 위해 인간 피드백과 강화학습을 결합한 정렬 방법은?",
      "options": [
        "Supervised Fine-Tuning",
        "RLHF",
        "Masked Language Modeling",
        "Beam Search"
      ],
      "answer": 1,
      "explanation": "RLHF는 인간이 비교한 응답 선호로 보상 모델을 학습하고 그 보상을 이용해 언어 모델의 정책을 조정한다.",
      "hint": "지도학습 단계가 아니라 인간 선호와 강화학습을 함께 사용하는 단계를 찾는다."
    },
    {
      "id": "week2-easy-mc-060",
      "conceptId": "system_prompt-easy-direct-060",
      "difficulty": "easy",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다음 설명을 만족하는 개념을 고르시오. [ 모델의 기본 역할, 행동 지침, 스타일 같은 상위 수준 지시를 제공한다. ]",
      "options": [
        "Reward score",
        "User query",
        "System prompt",
        "Position embedding"
      ],
      "answer": 2,
      "explanation": "정답은 \"System prompt\"이다. temperature·top-k·top-p는 후보 선택 범위와 확률 분포에 서로 다른 방식으로 영향을 준다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-easy-mc-069",
      "conceptId": "position_bias-easy-direct-069",
      "difficulty": "easy",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "다음 조건에 부합하는 항목으로 가장 적절한 것은? LLM 평가자가 동일한 품질이어도 특정 제시 위치의 응답을 상대적으로 선호할 수 있다.",
      "options": [
        "길이 편향",
        "차원의 저주",
        "자기 선호 편향",
        "위치 편향"
      ],
      "answer": 3,
      "explanation": "정답은 \"위치 편향\"이다. 평가 지표마다 문자열·의미·확률·사람의 선호 중 측정하는 대상이 다르며 편향 가능성도 있다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-easy-mc-006",
      "conceptId": "input_gate-easy-direct-006",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 설명이 가리키는 개념으로 가장 적절한 것은? [ 새로운 후보 정보를 cell state에 얼마나 기록할지 조절한다. ]",
      "options": [
        "Input gate",
        "Output gate",
        "Forget gate",
        "Reward gate"
      ],
      "answer": 0,
      "explanation": "정답은 \"Input gate\"이다. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-easy-mc-018",
      "conceptId": "greedy-easy-direct-018",
      "difficulty": "easy",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "다음 특성과 가장 정확하게 연결되는 항목은? [ 매 시점 가장 확률이 높은 토큰 하나를 즉시 선택한다. ]",
      "options": [
        "Beam search",
        "Greedy decoding",
        "Top-P sampling",
        "Teacher forcing"
      ],
      "answer": 1,
      "explanation": "정답은 \"Greedy decoding\"이다. Seq2Seq의 병목과 Attention이 어떤 encoder 정보를 선택적으로 참조하는지 연결해야 한다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-easy-mc-028",
      "conceptId": "query-easy-direct-028",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 동작 또는 역할에 해당하는 항목은? 현재 단어가 다른 단어에서 어떤 정보를 찾을지를 나타낸다.",
      "options": [
        "Value",
        "Key",
        "Query",
        "Reward"
      ],
      "answer": 2,
      "explanation": "정답은 \"Query\"이다. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-easy-mc-040",
      "conceptId": "pretrain_finetune-easy-direct-040",
      "difficulty": "easy",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "다음 설명을 만족하는 개념을 고르시오. 사전학습 파라미터를 초기값으로 사용한 뒤 다운스트림 태스크에 맞게 조정하는 패러다임이다.",
      "options": [
        "라벨 삭제",
        "테스트 후 학습",
        "평가 후 초기화",
        "사전학습 후 파인튜닝"
      ],
      "answer": 3,
      "explanation": "정답은 \"사전학습 후 파인튜닝\"이다. BERT·GPT·T5는 Transformer를 사용하지만 구조와 사전학습 목표가 서로 다르다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-easy-mc-048",
      "conceptId": "open_model-easy-direct-048",
      "difficulty": "easy",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "다음 조건에 부합하는 항목으로 가장 적절한 것은? [ LLaMA, Gemma, Qwen처럼 다운로드하여 직접 활용할 수 있는 모델 유형이다. ]",
      "options": [
        "Open model",
        "Closed model",
        "N-gram model",
        "Rule-based model"
      ],
      "answer": 0,
      "explanation": "정답은 \"Open model\"이다. 대규모 사전학습 이후 지시 데이터와 인간 선호를 반영하는 정렬 단계를 순서대로 구분해야 한다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-easy-mc-055",
      "conceptId": "sft-easy-direct-055",
      "difficulty": "easy",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "사람이 작성한 지시문과 모범 응답의 쌍을 이용해 사전학습 모델이 지시를 따르도록 지도학습하는 단계는?",
      "options": [
        "Reward Model 학습",
        "Supervised Fine-Tuning (SFT)",
        "PPO 정책 최적화",
        "Top-p Sampling"
      ],
      "answer": 1,
      "explanation": "SFT는 사람이 작성한 입력-응답 데이터로 지도학습하여 모델이 지시 형식과 기대 응답을 따르도록 조정하는 단계다.",
      "hint": "인간 선호 점수나 강화학습 전에 모범 응답을 정답으로 직접 학습하는 단계를 찾는다."
    },
    {
      "id": "week2-easy-mc-061",
      "conceptId": "temperature_low-easy-direct-061",
      "difficulty": "easy",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다음 특성과 가장 정확하게 연결되는 항목은? Temperature가 낮아지면 분포가 더 뾰족해져 높은 확률 토큰에 선택이 집중된다.",
      "options": [
        "높은 temperature",
        "Top-K 무한대",
        "낮은 temperature",
        "PPL 증가만"
      ],
      "answer": 2,
      "explanation": "정답은 \"낮은 temperature\"이다. temperature·top-k·top-p는 후보 선택 범위와 확률 분포에 서로 다른 방식으로 영향을 준다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-easy-mc-070",
      "conceptId": "ppl-easy-direct-070",
      "difficulty": "easy",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "다음 동작 또는 역할에 해당하는 항목은? 언어 모델이 문장을 얼마나 확률적으로 자연스럽게 예측하는지 나타내는 지표다.",
      "options": [
        "Accuracy",
        "ROUGE",
        "BLEU만",
        "Perplexity (PPL)"
      ],
      "answer": 3,
      "explanation": "정답은 \"Perplexity (PPL)\"이다. 평가 지표마다 문자열·의미·확률·사람의 선호 중 측정하는 대상이 다르며 편향 가능성도 있다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-easy-mc-007",
      "conceptId": "lstm_year-easy-direct-007",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 설명을 만족하는 개념을 고르시오. LSTM이 1997년에 제안되었다고 설명한다.",
      "options": [
        "1997년",
        "2017년",
        "2022년",
        "2013년"
      ],
      "answer": 0,
      "explanation": "정답은 \"1997년\"이다. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-easy-mc-019",
      "conceptId": "ngram-easy-direct-019",
      "difficulty": "easy",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "다음 조건에 부합하는 항목으로 가장 적절한 것은? N-gram은 연속해서 등장하는 N개의 단어 묶음을 뜻한다.",
      "options": [
        "N개의 독립 문서",
        "연속된 N개의 단어 묶음",
        "N개의 라벨",
        "N개의 모델"
      ],
      "answer": 1,
      "explanation": "정답은 \"연속된 N개의 단어 묶음\"이다. Seq2Seq의 병목과 Attention이 어떤 encoder 정보를 선택적으로 참조하는지 연결해야 한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-easy-mc-029",
      "conceptId": "scaled-easy-direct-029",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 설명이 가리키는 개념으로 가장 적절한 것은? Query와 Key의 큰 내적값을 스케일링해 softmax와 학습을 안정화한다.",
      "options": [
        "Greedy Attention",
        "Teacher Attention",
        "Scaled Dot-Product Attention",
        "Masked LM"
      ],
      "answer": 2,
      "explanation": "정답은 \"Scaled Dot-Product Attention\"이다. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-easy-mc-041",
      "conceptId": "pretraining-easy-direct-041",
      "difficulty": "easy",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "다음 특성과 가장 정확하게 연결되는 항목은? 사전학습은 대규모 데이터로 모델이 일반적인 특징과 표현을 먼저 학습하게 한다.",
      "options": [
        "테스트 정답만 암기",
        "평가 후 학습",
        "모든 파라미터를 무작위 유지",
        "대규모 데이터로 일반적 표현과 패턴을 먼저 학습"
      ],
      "answer": 3,
      "explanation": "정답은 \"대규모 데이터로 일반적 표현과 패턴을 먼저 학습\"이다. BERT·GPT·T5는 Transformer를 사용하지만 구조와 사전학습 목표가 서로 다르다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-easy-mc-049",
      "conceptId": "scaling-easy-direct-049",
      "difficulty": "easy",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "다음 동작 또는 역할에 해당하는 항목은? 모델 크기·데이터·연산량을 늘릴수록 손실이 감소하고 성능이 향상되는 경향을 설명한다.",
      "options": [
        "Scaling law",
        "Teacher forcing",
        "Residual connection",
        "One-hot sparsity"
      ],
      "answer": 0,
      "explanation": "정답은 \"Scaling law\"이다. 대규모 사전학습 이후 지시 데이터와 인간 선호를 반영하는 정렬 단계를 순서대로 구분해야 한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-easy-mc-062",
      "conceptId": "topk-easy-direct-062",
      "difficulty": "easy",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다음 설명을 만족하는 개념을 고르시오. 확률이 높은 K개의 토큰만 후보로 남긴 뒤 그 안에서 샘플링한다.",
      "options": [
        "Top-P",
        "Top-K",
        "Greedy",
        "LayerNorm"
      ],
      "answer": 1,
      "explanation": "정답은 \"Top-K\"이다. temperature·top-k·top-p는 후보 선택 범위와 확률 분포에 서로 다른 방식으로 영향을 준다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-easy-mc-071",
      "conceptId": "rouge_value-easy-direct-071",
      "difficulty": "easy",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "다음 조건에 부합하는 항목으로 가장 적절한 것은? 예시에서 ROUGE-1은 겹친 unigram 5개를 정답 문장 6개 단어로 나누어 5/6=0.83이다.",
      "options": [
        "0.50",
        "1.20",
        "0.83",
        "5.0"
      ],
      "answer": 2,
      "explanation": "정답은 \"0.83\"이다. 평가 지표마다 문자열·의미·확률·사람의 선호 중 측정하는 대상이 다르며 편향 가능성도 있다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-easy-mc-008",
      "conceptId": "onehot_dim-easy-direct-008",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 설명이 가리키는 개념으로 가장 적절한 것은? One-hot 벡터의 차원은 어휘 집합의 크기와 같다.",
      "options": [
        "hidden state 크기",
        "문장 길이",
        "윈도우 크기",
        "어휘 집합의 크기"
      ],
      "answer": 3,
      "explanation": "정답은 \"어휘 집합의 크기\"이다. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-easy-mc-020",
      "conceptId": "seq2seq_year-easy-direct-020",
      "difficulty": "easy",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "다음 특성과 가장 정확하게 연결되는 항목은? Seq2Seq가 2014년에 소개된 대표적 신경망 기반 시퀀스 변환 구조라고 설명한다.",
      "options": [
        "2014년",
        "1997년",
        "2017년",
        "2024년"
      ],
      "answer": 0,
      "explanation": "정답은 \"2014년\"이다. Seq2Seq의 병목과 Attention이 어떤 encoder 정보를 선택적으로 참조하는지 연결해야 한다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-easy-mc-030",
      "conceptId": "scaled_reason-easy-direct-030",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 동작 또는 역할에 해당하는 항목은? [ Q/K 차원이 커지면 내적값이 커져 softmax가 과도하게 뾰족해질 수 있어 스케일링한다. ]",
      "options": [
        "토큰 수를 늘리기 위해",
        "softmax가 지나치게 뾰족해지는 것을 완화",
        "라벨을 제거하기 위해",
        "문장 길이를 1로 만들기 위해"
      ],
      "answer": 1,
      "explanation": "정답은 \"softmax가 지나치게 뾰족해지는 것을 완화\"이다. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-easy-mc-042",
      "conceptId": "zero_shot-easy-direct-042",
      "difficulty": "easy",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "다음 설명을 만족하는 개념을 고르시오. [ 예시 없이 지시만 제공해 작업을 수행하게 하는 설정이다. ]",
      "options": [
        "Few-shot",
        "One-shot",
        "Zero-shot",
        "Full fine-tuning"
      ],
      "answer": 2,
      "explanation": "정답은 \"Zero-shot\"이다. BERT·GPT·T5는 Transformer를 사용하지만 구조와 사전학습 목표가 서로 다르다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-easy-mc-063",
      "conceptId": "topp-easy-direct-063",
      "difficulty": "easy",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다음 조건에 부합하는 항목으로 가장 적절한 것은? 누적 확률이 P에 도달하는 최소 상위 토큰 집합을 동적으로 선택해 샘플링한다.",
      "options": [
        "Top-K",
        "Greedy",
        "Teacher forcing",
        "Top-P (Nucleus) sampling"
      ],
      "answer": 3,
      "explanation": "정답은 \"Top-P (Nucleus) sampling\"이다. temperature·top-k·top-p는 후보 선택 범위와 확률 분포에 서로 다른 방식으로 영향을 준다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-easy-mc-072",
      "conceptId": "self_bias-easy-direct-072",
      "difficulty": "easy",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "다음 설명이 가리키는 개념으로 가장 적절한 것은? [ 생성 모델과 평가 모델이 같거나 유사할 때 자기 계열 답변을 더 선호할 수 있다. ]",
      "options": [
        "자기 선호 편향",
        "위치 편향",
        "길이 편향",
        "Positional Encoding"
      ],
      "answer": 0,
      "explanation": "정답은 \"자기 선호 편향\"이다. 평가 지표마다 문자열·의미·확률·사람의 선호 중 측정하는 대상이 다르며 편향 가능성도 있다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-easy-mc-009",
      "conceptId": "onehot_sparse-easy-direct-009",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 특성과 가장 정확하게 연결되는 항목은? One-hot 벡터는 대부분의 값이 0인 희소한 표현이다.",
      "options": [
        "밀집 벡터",
        "희소 벡터",
        "스칼라",
        "확률분포"
      ],
      "answer": 1,
      "explanation": "정답은 \"희소 벡터\"이다. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-easy-mc-021",
      "conceptId": "smt_goal-easy-direct-021",
      "difficulty": "easy",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "다음 동작 또는 역할에 해당하는 항목은? 통계적 기계번역은 입력 x가 주어졌을 때 확률이 가장 높은 출력 y를 찾는 문제로 표현한다.",
      "options": [
        "argmin_y P(x)",
        "softmax(x+y)",
        "argmax_y P(y|x)",
        "P(x)-P(y)"
      ],
      "answer": 2,
      "explanation": "정답은 \"argmax_y P(y|x)\"이다. Seq2Seq의 병목과 Attention이 어떤 encoder 정보를 선택적으로 참조하는지 연결해야 한다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-easy-mc-031",
      "conceptId": "self_attention-easy-direct-031",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 설명을 만족하는 개념을 고르시오. Self-Attention은 같은 문장 안의 모든 토큰 관계를 직접 계산해 표현을 문맥화한다.",
      "options": [
        "encoder와 decoder 사이에서만 작동",
        "이전 hidden state만 참조",
        "라벨만 참조",
        "한 문장 내부의 단어들이 서로를 직접 참조"
      ],
      "answer": 3,
      "explanation": "정답은 \"한 문장 내부의 단어들이 서로를 직접 참조\"이다. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-easy-mc-064",
      "conceptId": "zero_cot-easy-direct-064",
      "difficulty": "easy",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다음 조건에 부합하는 항목으로 가장 적절한 것은? 예시 없이 단계적으로 생각하라는 문구를 추가해 추론을 유도하는 방식이다.",
      "options": [
        "Zero-shot CoT",
        "Few-shot only",
        "Beam search",
        "LayerNorm"
      ],
      "answer": 0,
      "explanation": "정답은 \"Zero-shot CoT\"이다. temperature·top-k·top-p는 후보 선택 범위와 확률 분포에 서로 다른 방식으로 영향을 준다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-easy-mc-073",
      "conceptId": "self_instruct-easy-direct-073",
      "difficulty": "easy",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "소량의 사람이 만든 seed instruction을 바탕으로 언어 모델이 새로운 instruction과 응답을 생성하고 필터링해 학습 데이터를 확장하는 방법은?",
      "options": [
        "Masked Language Modeling",
        "Self-Instruct",
        "Beam Search",
        "K-means"
      ],
      "answer": 1,
      "explanation": "Self-Instruct는 적은 수의 seed instruction에서 출발해 모델이 합성 지시 데이터를 생성하도록 하여 instruction tuning 데이터셋을 확장한다.",
      "hint": "사람이 모든 지시를 직접 작성하지 않고 모델이 새 지시 데이터를 합성하는 방법을 찾는다."
    },
    {
      "id": "week2-easy-mc-010",
      "conceptId": "skipgram-easy-direct-010",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 특성과 가장 정확하게 연결되는 항목은? Skip-gram은 중심 단어를 입력으로 두고 주변 문맥 단어를 예측한다.",
      "options": [
        "주변 단어로 중심 단어를 예측",
        "현재 문장으로 라벨을 예측",
        "중심 단어로 주변 단어를 예측",
        "다음 문서 제목을 예측"
      ],
      "answer": 2,
      "explanation": "정답은 \"중심 단어로 주변 단어를 예측\"이다. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-easy-mc-022",
      "conceptId": "teacher_forcing-easy-direct-022",
      "difficulty": "easy",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "다음 동작 또는 역할에 해당하는 항목은? 학습 시 decoder의 다음 입력으로 이전 예측 대신 정답 토큰을 제공한다.",
      "options": [
        "Beam search",
        "Top-K",
        "LayerNorm",
        "Teacher forcing"
      ],
      "answer": 3,
      "explanation": "정답은 \"Teacher forcing\"이다. Seq2Seq의 병목과 Attention이 어떤 encoder 정보를 선택적으로 참조하는지 연결해야 한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-easy-mc-032",
      "conceptId": "self_parallel-easy-direct-032",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 설명을 만족하는 개념을 고르시오. 시점 상태를 순차 전달하지 않으므로 시퀀스 위치들을 병렬 처리하기 쉽다.",
      "options": [
        "병렬 처리",
        "순차 처리만 가능",
        "항상 한 토큰만 처리",
        "가중치 공유가 불가능"
      ],
      "answer": 0,
      "explanation": "정답은 \"병렬 처리\"이다. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-easy-mc-074",
      "conceptId": "synth52000-easy-direct-074",
      "difficulty": "easy",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "다음 조건에 부합하는 항목으로 가장 적절한 것은? Self-Instruct 사례는 GPT-3를 이용해 약 52,000개의 합성 데이터를 생성했다고 설명한다.",
      "options": [
        "5,200개",
        "52,000개",
        "520,000개",
        "5,200,000개"
      ],
      "answer": 1,
      "explanation": "정답은 \"52,000개\"이다. 평가 지표마다 문자열·의미·확률·사람의 선호 중 측정하는 대상이 다르며 편향 가능성도 있다.",
      "hint": "입력과 출력을 구분한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-easy-mc-011",
      "conceptId": "skipgram_rare-easy-direct-011",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 설명이 가리키는 개념으로 가장 적절한 것은? 희귀 단어 표현에 상대적으로 강점이 있다고 설명된 방식이다.",
      "options": [
        "CBOW",
        "One-hot encoding",
        "Skip-gram",
        "Greedy decoding"
      ],
      "answer": 2,
      "explanation": "정답은 \"Skip-gram\"이다. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-easy-mc-033",
      "conceptId": "self_path-easy-direct-033",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 특성과 가장 정확하게 연결되는 항목은? Self-Attention의 단어 간 최대 상호작용 거리를 O(1)로 설명한다.",
      "options": [
        "O(n)",
        "O(log n)만",
        "O(n²) 단계",
        "O(1)"
      ],
      "answer": 3,
      "explanation": "정답은 \"O(1)\"이다. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-easy-mc-075",
      "conceptId": "vision_projection-easy-direct-075",
      "difficulty": "easy",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "이미지를 텍스트 생성 모델이 처리할 수 있도록 시각 정보를 언어 모델의 입력 표현 공간에 연결하는 구성은?",
      "options": [
        "Vision Encoder와 Projection",
        "Tokenizer와 Greedy Decoding",
        "ROUGE와 Perplexity",
        "Reward Model과 PPO"
      ],
      "answer": 0,
      "explanation": "Vision Encoder가 이미지 특징을 추출하고 Projection 계층이 그 특징을 언어 모델이 사용할 수 있는 표현으로 변환한다.",
      "hint": "이미지 특징 추출과 언어 모델 입력 차원 연결을 각각 담당하는 구성을 찾는다."
    },
    {
      "id": "week2-easy-mc-012",
      "conceptId": "word2vec_year-easy-direct-012",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 설명을 만족하는 개념을 고르시오. [ Word2Vec이 Google에 의해 2013년에 제안되었다고 설명한다. ]",
      "options": [
        "1997년",
        "2013년",
        "2017년",
        "2023년"
      ],
      "answer": 1,
      "explanation": "정답은 \"2013년\"이다. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-easy-mc-034",
      "conceptId": "transformer_core-easy-direct-034",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "Transformer가 RNN의 순차적인 hidden state 전달 대신 시퀀스 관계를 처리하는 핵심 메커니즘은?",
      "options": [
        "최소제곱 회귀",
        "K-means 중심 재할당",
        "Self-Attention",
        "N-gram 통계만 사용"
      ],
      "answer": 2,
      "explanation": "Transformer는 Self-Attention으로 문장 안 토큰들이 서로를 직접 참조하게 하며 시점별 hidden state 전달에 의존하지 않는다.",
      "hint": "토큰 간 관계를 직접 계산하고 병렬 처리를 가능하게 하는 메커니즘을 찾는다."
    },
    {
      "id": "week2-easy-sa-001",
      "conceptId": "key-easy-short-001",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 정확한 용어·식·값을 작성하시오. 각 단어가 가진 정보의 특징을 나타내며 Query와의 유사도 계산에 사용된다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Key"
      ],
      "explanation": "해당 설명의 핵심 개념은 Key이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: Query·Key·Value의 출처, masking과 위치 정보. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-sa-002",
      "conceptId": "pretraining-easy-short-002",
      "difficulty": "easy",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 명칭을 정확히 작성하시오. 사전학습은 대규모 데이터로 모델이 일반적인 특징과 표현을 먼저 학습하게 한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "대규모 데이터로 일반적 표현과 패턴을 먼저 학습"
      ],
      "explanation": "해당 설명의 핵심 개념은 대규모 데이터로 일반적 표현과 패턴을 먼저 학습이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-sa-003",
      "conceptId": "foundation-easy-short-003",
      "difficulty": "easy",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "short-answer",
      "prompt": "다음 정의의 핵심 답을 정확한 표기로 작성하시오. 파운데이션 모델은 대량 데이터로 사전학습되어 여러 다운스트림 작업에 범용적으로 활용된다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델"
      ],
      "explanation": "해당 설명의 핵심 개념은 대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 사전학습·SFT·선호 학습·정책 최적화의 단계. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-sa-004",
      "conceptId": "value-easy-short-004",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "short-answer",
      "prompt": "빈칸에 들어갈 용어 또는 값을 작성하시오. [ attention weight에 따라 실제로 모아지는 정보 내용을 담는다. ]",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Value"
      ],
      "explanation": "해당 설명의 핵심 개념은 Value이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: Query·Key·Value의 출처, masking과 위치 정보. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-sa-005",
      "conceptId": "qkv-easy-short-005",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 정확한 용어·식·값을 작성하시오. 각 입력 단어 표현은 서로 다른 학습 행렬을 통해 Query, Key, Value로 변환된다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Q, K, V"
      ],
      "explanation": "해당 설명의 핵심 개념은 Q, K, V이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: Query·Key·Value의 출처, masking과 위치 정보. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-sa-006",
      "conceptId": "score-easy-short-006",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 명칭을 정확히 작성하시오. 기본 Self-Attention의 단어 i와 j 유사도는 Query와 Key의 내적으로 계산할 수 있다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "q_i^T k_j"
      ],
      "explanation": "해당 설명의 핵심 개념은 q_i^T k_j이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: Query·Key·Value의 출처, masking과 위치 정보. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-sa-007",
      "conceptId": "attn_output-easy-short-007",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "short-answer",
      "prompt": "다음 정의의 핵심 답을 정확한 표기로 작성하시오. 출력은 softmax 가중치 α_ij를 Value v_j에 곱해 합한 값이다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "o_i = Σ_j α_ij v_j"
      ],
      "explanation": "해당 설명의 핵심 개념은 o_i = Σ_j α_ij v_j이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: Query·Key·Value의 출처, masking과 위치 정보. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-sa-008",
      "conceptId": "order_limit-easy-short-008",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "short-answer",
      "prompt": "빈칸에 들어갈 용어 또는 값을 작성하시오. [ Self-Attention 자체는 토큰 간 유사도만 계산하므로 입력 순서 정보가 직접 포함되지 않는다. ]",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "순서 정보 부재"
      ],
      "explanation": "해당 설명의 핵심 개념은 순서 정보 부재이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: Query·Key·Value의 출처, masking과 위치 정보. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-sa-009",
      "conceptId": "positional-easy-short-009",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 정확한 용어·식·값을 작성하시오. Self-Attention에 없는 토큰 위치·순서 정보를 임베딩에 더해 준다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Positional Encoding"
      ],
      "explanation": "해당 설명의 핵심 개념은 Positional Encoding이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: Query·Key·Value의 출처, masking과 위치 정보. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-sa-010",
      "conceptId": "sinusoidal-easy-short-010",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 명칭을 정확히 작성하시오. 서로 다른 주기의 사인·코사인 함수를 이용해 위치 벡터를 만든다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Sinusoidal Position Encoding"
      ],
      "explanation": "해당 설명의 핵심 개념은 Sinusoidal Position Encoding이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: Query·Key·Value의 출처, masking과 위치 정보. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-sa-011",
      "conceptId": "learned_pos-easy-short-011",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "short-answer",
      "prompt": "다음 정의의 핵심 답을 정확한 표기로 작성하시오. 각 위치 벡터 자체를 학습 파라미터로 두고 최적화한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Learned Absolute Position Embedding"
      ],
      "explanation": "해당 설명의 핵심 개념은 Learned Absolute Position Embedding이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: Query·Key·Value의 출처, masking과 위치 정보. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-sa-012",
      "conceptId": "ffn-easy-short-012",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "short-answer",
      "prompt": "빈칸에 들어갈 용어 또는 값을 작성하시오. [ Self-Attention 뒤의 Feed-Forward Network가 각 위치 표현에 비선형 변환을 적용해 표현력을 높인다. ]",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "비선형 표현 확장"
      ],
      "explanation": "해당 설명의 핵심 개념은 비선형 표현 확장이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: Query·Key·Value의 출처, masking과 위치 정보. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-sa-013",
      "conceptId": "masked-easy-short-013",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 정확한 용어·식·값을 작성하시오. 언어 생성 시 현재 위치가 미래 토큰을 보지 못하도록 차단한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Masked Self-Attention"
      ],
      "explanation": "해당 설명의 핵심 개념은 Masked Self-Attention이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: Query·Key·Value의 출처, masking과 위치 정보. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-sa-014",
      "conceptId": "minus_inf-easy-short-014",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 명칭을 정확히 작성하시오. 미래 위치 attention score를 -∞로 두면 softmax 후 가중치가 0이 된다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "-∞"
      ],
      "explanation": "해당 설명의 핵심 개념은 -∞이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: Query·Key·Value의 출처, masking과 위치 정보. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-sa-015",
      "conceptId": "transformer_year-easy-short-015",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "short-answer",
      "prompt": "다음 정의의 핵심 답을 정확한 표기로 작성하시오. Transformer는 2017년 'Attention Is All You Need' 논문에서 제안되었다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "2017년"
      ],
      "explanation": "해당 설명의 핵심 개념은 2017년이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: Query·Key·Value의 출처, masking과 위치 정보. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-easy-es-001",
      "conceptId": "week2-easy-essay-001",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "essay",
      "prompt": "One-hot encoding과 Word embedding의 차이를 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "One-hot encoding",
        "Word embedding",
        "희소",
        "밀집"
      ],
      "modelAnswer": "One-hot encoding은 어휘 크기의 희소 벡터로 단어를 표현해 의미 유사도를 직접 반영하기 어렵다. Word embedding은 저차원의 밀집 연속 벡터로 의미가 비슷한 단어를 가까운 위치에 표현할 수 있다.",
      "rubricKeywords": [
        "One-hot encoding",
        "Word embedding",
        "희소",
        "밀집"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: One-hot encoding, Word embedding, 희소, 밀집. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "워드 임베딩에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-easy-es-005",
      "conceptId": "week2-easy-essay-005",
      "difficulty": "easy",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "essay",
      "prompt": "Seq2Seq의 encoder와 decoder 역할을 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Encoder",
        "Decoder",
        "입력 시퀀스",
        "출력 시퀀스"
      ],
      "modelAnswer": "Encoder는 입력 시퀀스를 의미 표현으로 변환하고 Decoder는 그 표현을 조건으로 출력 시퀀스를 순차적으로 생성한다.",
      "rubricKeywords": [
        "Encoder",
        "Decoder",
        "입력 시퀀스",
        "출력 시퀀스"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Encoder, Decoder, 입력 시퀀스, 출력 시퀀스. Seq2Seq의 병목과 Attention이 어떤 encoder 정보를 선택적으로 참조하는지 연결해야 한다.",
      "hint": "Seq2Seq에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-easy-es-007",
      "conceptId": "week2-easy-essay-007",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "essay",
      "prompt": "Self-Attention의 Query, Key, Value 역할을 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Query",
        "Key",
        "Value",
        "attention"
      ],
      "modelAnswer": "Query는 찾고 싶은 정보, Key는 각 토큰 정보의 특징, Value는 attention weight에 따라 실제로 모아지는 정보 내용을 나타낸다.",
      "rubricKeywords": [
        "Query",
        "Key",
        "Value",
        "attention"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Query, Key, Value, attention. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "Self-Attention에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-easy-es-009",
      "conceptId": "week2-easy-essay-009",
      "difficulty": "easy",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "essay",
      "prompt": "파운데이션 모델의 정의와 핵심 구성 요소를 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "대규모 데이터",
        "Self-supervised learning",
        "Transformer",
        "사전학습"
      ],
      "modelAnswer": "파운데이션 모델은 대량 데이터로 사전학습되어 다양한 작업의 기반으로 활용되는 대규모 모델이다. 대규모 데이터, 자기지도 학습, attention 기반 Transformer를 핵심 요소로 제시한다.",
      "rubricKeywords": [
        "대규모 데이터",
        "Self-supervised learning",
        "Transformer",
        "사전학습"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: 대규모 데이터, Self-supervised learning, Transformer, 사전학습. 대규모 사전학습 이후 지시 데이터와 인간 선호를 반영하는 정렬 단계를 순서대로 구분해야 한다.",
      "hint": "파운데이션 모델에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-easy-es-010",
      "conceptId": "week2-easy-essay-010",
      "difficulty": "easy",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "essay",
      "prompt": "Greedy decoding, Beam search, Sampling의 차이를 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Greedy",
        "Beam search",
        "Sampling",
        "확률"
      ],
      "modelAnswer": "Greedy는 매 단계 최고 확률 토큰 하나를 고르고, Beam search는 여러 상위 시퀀스를 유지하며 탐색하며, Sampling은 확률분포에 따라 토큰을 뽑아 다양성을 높인다.",
      "rubricKeywords": [
        "Greedy",
        "Beam search",
        "Sampling",
        "확률"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Greedy, Beam search, Sampling, 확률. temperature·top-k·top-p는 후보 선택 범위와 확률 분포에 서로 다른 방식으로 영향을 준다.",
      "hint": "LLM 디코딩에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-easy-es-002",
      "conceptId": "week2-easy-essay-002",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "essay",
      "prompt": "Skip-gram과 CBOW의 입력과 예측 대상 차이를 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Skip-gram",
        "CBOW",
        "중심 단어",
        "문맥"
      ],
      "modelAnswer": "Skip-gram은 중심 단어로 주변 문맥 단어를 예측하고, CBOW는 주변 문맥 단어들로 중심 단어를 예측한다.",
      "rubricKeywords": [
        "Skip-gram",
        "CBOW",
        "중심 단어",
        "문맥"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Skip-gram, CBOW, 중심 단어, 문맥. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "Word2Vec에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-easy-es-006",
      "conceptId": "week2-easy-essay-006",
      "difficulty": "easy",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "essay",
      "prompt": "기본 Seq2Seq의 병목과 Attention의 해결 아이디어를 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "고정 길이",
        "병목",
        "Attention",
        "encoder"
      ],
      "modelAnswer": "기본 Seq2Seq는 입력 전체를 하나의 고정 길이 벡터에 압축해 긴 입력에서 정보 손실이 생길 수 있다. Attention은 decoder가 관련 있는 encoder 상태를 직접 가중 참조하여 병목을 완화한다.",
      "rubricKeywords": [
        "고정 길이",
        "병목",
        "Attention",
        "encoder"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: 고정 길이, 병목, Attention, encoder. Seq2Seq의 병목과 Attention이 어떤 encoder 정보를 선택적으로 참조하는지 연결해야 한다.",
      "hint": "Attention에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-easy-es-008",
      "conceptId": "week2-easy-essay-008",
      "difficulty": "easy",
      "category": "Transformer",
      "questionType": "essay",
      "prompt": "Self-Attention의 세 한계와 해결 방법을 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Positional Encoding",
        "Feed-Forward Network",
        "Masked Self-Attention",
        "순서"
      ],
      "modelAnswer": "순서 정보 부재는 Positional Encoding, 비선형성 부족은 Feed-Forward Network, 미래 토큰 참조 문제는 Masked Self-Attention으로 보완한다.",
      "rubricKeywords": [
        "Positional Encoding",
        "Feed-Forward Network",
        "Masked Self-Attention",
        "순서"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Positional Encoding, Feed-Forward Network, Masked Self-Attention, 순서. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "Transformer에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-easy-es-003",
      "conceptId": "week2-easy-essay-003",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "essay",
      "prompt": "RNN의 hidden state가 순차 데이터를 처리하는 데 어떤 역할을 하는지 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "RNN",
        "hidden state",
        "이전 시점",
        "문맥"
      ],
      "modelAnswer": "RNN은 현재 입력과 이전 hidden state를 결합해 새로운 hidden state를 만들며, hidden state는 이전까지의 시퀀스 정보를 요약해 다음 시점으로 전달한다.",
      "rubricKeywords": [
        "RNN",
        "hidden state",
        "이전 시점",
        "문맥"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: RNN, hidden state, 이전 시점, 문맥. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "RNN에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-easy-es-004",
      "conceptId": "week2-easy-essay-004",
      "difficulty": "easy",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "essay",
      "prompt": "LSTM의 cell state와 Forget/Input/Output gate의 역할을 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "cell state",
        "Forget gate",
        "Input gate",
        "Output gate"
      ],
      "modelAnswer": "Cell state는 장기 정보를 전달한다. Forget gate는 이전 정보 유지 비율, Input gate는 새 정보 기록 비율, Output gate는 hidden state로 내보낼 정보 비율을 조절한다.",
      "rubricKeywords": [
        "cell state",
        "Forget gate",
        "Input gate",
        "Output gate"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: cell state, Forget gate, Input gate, Output gate. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "LSTM에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    }
  ],
  "medium": [
    {
      "id": "week2-medium-mc-001",
      "conceptId": "pair-cbow-dim_curse-medium-001",
      "difficulty": "medium",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① CBOW는 주변 문맥 단어들을 이용해 중심 단어를 예측한다. ② 어휘가 커질수록 One-hot 벡터 차원이 커져 메모리와 계산 효율이 나빠진다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "차원의 저주 / 주변 단어로 중심 단어를 예측",
        "중심 단어로 주변 단어를 예측 / 차원의 저주",
        "주변 단어로 중심 단어를 예측 / 교사 강요",
        "주변 단어로 중심 단어를 예측 / 차원의 저주"
      ],
      "answer": 3,
      "explanation": "첫 설명은 주변 단어로 중심 단어를 예측, 두 번째 설명은 차원의 저주에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-medium-mc-013",
      "conceptId": "pair-attention-beam_score-medium-013",
      "difficulty": "medium",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): Attention은 decoder 각 시점에서 관련 있는 encoder hidden state를 선택적으로 참조한다. / (나): Beam search의 후보 시퀀스 점수는 토큰 로그 확률의 합으로 계산할 수 있다.",
      "options": [
        "관련 있는 입력 위치를 선택적으로 참조 / 로그 확률의 합",
        "모든 입력을 동일 비중 압축 / 로그 확률의 합",
        "관련 있는 입력 위치를 선택적으로 참조 / 벡터 차원의 합",
        "로그 확률의 합 / 관련 있는 입력 위치를 선택적으로 참조"
      ],
      "answer": 0,
      "explanation": "첫 설명은 관련 있는 입력 위치를 선택적으로 참조, 두 번째 설명은 로그 확률의 합에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-medium-mc-023",
      "conceptId": "pair-attn_output-encoder_context-medium-023",
      "difficulty": "medium",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): 출력은 softmax 가중치 α_ij를 Value v_j에 곱해 합한 값이다. / (나): encoder는 causal mask 없이 입력 전체를 보며 각 토큰을 양방향 문맥으로 인코딩할 수 있다.",
      "options": [
        "o_i = Σ_j α_ij v_j / 단방향 문맥",
        "o_i = Σ_j α_ij v_j / 양방향 문맥",
        "양방향 문맥 / o_i = Σ_j α_ij v_j",
        "o_i = q_i-k_i / 양방향 문맥"
      ],
      "answer": 1,
      "explanation": "첫 설명은 o_i = Σ_j α_ij v_j, 두 번째 설명은 양방향 문맥에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-medium-mc-035",
      "conceptId": "pair-bert-mlm-medium-035",
      "difficulty": "medium",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=Transformer encoder 기반이며 Masked LM으로 사전학습하는 대표 모델이다. B=일부 입력 토큰을 [MASK]로 바꾸고 원래 단어를 예측하는 사전학습 목표다.",
      "options": [
        "BERT / Causal LM",
        "Masked Language Model / BERT",
        "BERT / Masked Language Model",
        "GPT / Masked Language Model"
      ],
      "answer": 2,
      "explanation": "첫 설명은 BERT, 두 번째 설명은 Masked Language Model에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-medium-mc-043",
      "conceptId": "pair-closed-foundation_data-medium-043",
      "difficulty": "medium",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): ChatGPT, Claude, Gemini처럼 내부 가중치가 공개되지 않고 주로 API로 사용하는 모델 유형이다. / (나): 파운데이션 모델의 핵심 구성 요소로 대규모 데이터를 제시한다.",
      "options": [
        "Closed model / 소량의 단일 태스크 데이터만",
        "Open model / 대규모 데이터",
        "대규모 데이터 / Closed model",
        "Closed model / 대규모 데이터"
      ],
      "answer": 3,
      "explanation": "첫 설명은 Closed model, 두 번째 설명은 대규모 데이터에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-medium-mc-050",
      "conceptId": "pair-alignment-ppo-medium-050",
      "difficulty": "medium",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=다음 토큰 예측만으로는 지시 준수와 선호를 보장하기 어려워 alignment가 필요하다. B= InstructGPT의 RLHF 정책 최적화에 사용된 알고리즘으로 PPO를 제시한다.",
      "options": [
        "사용자 지시와 선호에 맞는 출력 / PPO",
        "사용자 지시와 선호에 맞는 출력 / KNN",
        "어휘를 무조건 줄이기 / PPO",
        "PPO / 사용자 지시와 선호에 맞는 출력"
      ],
      "answer": 0,
      "explanation": "첫 설명은 사용자 지시와 선호에 맞는 출력, 두 번째 설명은 PPO에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-medium-mc-056",
      "conceptId": "pair-autoregressive-knn_prompt-medium-056",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① 지금까지 생성한 토큰을 조건으로 다음 토큰을 하나씩 순차 생성한다. ② 테스트 쿼리와 임베딩 거리가 가까운 학습 예시를 골라 few-shot 문맥으로 제공한다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "kNN 기반 예시 선택 / Autoregressive generation",
        "Autoregressive generation / kNN 기반 예시 선택",
        "Bidirectional generation only / kNN 기반 예시 선택",
        "Autoregressive generation / 가장 먼 예시 선택"
      ],
      "answer": 1,
      "explanation": "첫 설명은 Autoregressive generation, 두 번째 설명은 kNN 기반 예시 선택에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-medium-mc-065",
      "conceptId": "pair-accuracy-evaluation-medium-065",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=정답이 명확한 문제는 예측과 정답의 일치도를 정확도로 평가할 수 있다. B=평가는 목표에 맞게 시스템이 실제로 잘 동작하는지 확인하는 단계다.",
      "options": [
        "구축한 시스템이 실제로 잘 동작하는지 확인하는 단계 / Accuracy",
        "ROUGE / 구축한 시스템이 실제로 잘 동작하는지 확인하는 단계",
        "Accuracy / 구축한 시스템이 실제로 잘 동작하는지 확인하는 단계",
        "Accuracy / 학습 데이터를 늘리는 단계"
      ],
      "answer": 2,
      "explanation": "첫 설명은 Accuracy, 두 번째 설명은 구축한 시스템이 실제로 잘 동작하는지 확인하는 단계에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-medium-mc-002",
      "conceptId": "pair-cbow_fast-many_many-medium-002",
      "difficulty": "medium",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) 비교적 빠른 학습과 빈도가 높은 단어 표현에 강점이 있다고 설명된 방식이다. (나) 기계번역처럼 입력과 출력이 모두 시퀀스인 구조다.",
      "options": [
        "Skip-gram / Many-to-Many",
        "CBOW / Many-to-One",
        "Many-to-Many / CBOW",
        "CBOW / Many-to-Many"
      ],
      "answer": 3,
      "explanation": "첫 설명은 CBOW, 두 번째 설명은 Many-to-Many에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-medium-mc-014",
      "conceptId": "pair-attention_softmax-fourgram-medium-014",
      "difficulty": "medium",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① 유사도 점수에 softmax를 적용해 입력 위치별 attention weight 분포를 만든다. ② 예시에서 'students opened their'가 1000번, 뒤에 'books'가 400번이면 확률은 400/1000=0.4다.",
      "options": [
        "Softmax / 0.4",
        "Softmax / 0.04",
        "ReLU / 0.4",
        "0.4 / Softmax"
      ],
      "answer": 0,
      "explanation": "첫 설명은 Softmax, 두 번째 설명은 0.4에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-medium-mc-024",
      "conceptId": "pair-cross_attention-order_limit-medium-024",
      "difficulty": "medium",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① Encoder-Decoder Transformer의 Cross-Attention에서 Q는 decoder, K/V는 encoder 출력에서 온다. ② Self-Attention 자체는 토큰 간 유사도만 계산하므로 입력 순서 정보가 직접 포함되지 않는다.",
      "options": [
        "순서 정보 부재 / Query는 decoder, Key와 Value는 encoder",
        "Query는 decoder, Key와 Value는 encoder / 순서 정보 부재",
        "Q/K/V 모두 decoder / 순서 정보 부재",
        "Query는 decoder, Key와 Value는 encoder / 모든 연산이 순차적"
      ],
      "answer": 1,
      "explanation": "첫 설명은 Query는 decoder, Key와 Value는 encoder, 두 번째 설명은 순서 정보 부재에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-medium-mc-036",
      "conceptId": "pair-few_shot-pretrain_finetune-medium-036",
      "difficulty": "medium",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① 소수의 입력-출력 예시를 프롬프트에 제공하는 설정이다. ② 사전학습 파라미터를 초기값으로 사용한 뒤 다운스트림 태스크에 맞게 조정하는 패러다임이다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "Zero-shot / 사전학습 후 파인튜닝",
        "사전학습 후 파인튜닝 / Few-shot",
        "Few-shot / 사전학습 후 파인튜닝",
        "Few-shot / 테스트 후 학습"
      ],
      "answer": 2,
      "explanation": "첫 설명은 Few-shot, 두 번째 설명은 사전학습 후 파인튜닝에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-medium-mc-044",
      "conceptId": "pair-emergent-llm_pretrain-medium-044",
      "difficulty": "medium",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① 규모가 일정 임계점을 넘을 때 이전에 뚜렷하지 않던 새로운 능력이 나타나는 현상이다. ② 거대 언어 모델의 대표적 사전학습 목표는 대규모 텍스트에서 다음 토큰을 예측하는 것이다.",
      "options": [
        "Emergent ability / 이미지 분할만",
        "다음 토큰 예측 / Emergent ability",
        "Gradient clipping / 다음 토큰 예측",
        "Emergent ability / 다음 토큰 예측"
      ],
      "answer": 3,
      "explanation": "첫 설명은 Emergent ability, 두 번째 설명은 다음 토큰 예측에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-medium-mc-051",
      "conceptId": "pair-flan-reward_model-medium-051",
      "difficulty": "medium",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① 다양한 태스크를 여러 자연어 instruction 템플릿으로 변환해 학습한 instruction tuning 사례다. ② 후보 응답에 대한 인간 선호를 점수로 근사하는 모델이다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "FLAN / Reward Model",
        "FLAN / Tokenizer",
        "Reward Model / FLAN",
        "Word2Vec / Reward Model"
      ],
      "answer": 0,
      "explanation": "첫 설명은 FLAN, 두 번째 설명은 Reward Model에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-medium-mc-057",
      "conceptId": "pair-cot-temperature_high-medium-057",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) 예시에 최종 답뿐 아니라 중간 추론 과정을 함께 보여 주어 복합 추론을 유도한다. (나) Temperature가 커지면 분포가 평평해져 다양한 토큰이 선택될 가능성이 커진다.",
      "options": [
        "높은 temperature / Chain-of-Thought (CoT) prompting",
        "Chain-of-Thought (CoT) prompting / 높은 temperature",
        "Chain-of-Thought (CoT) prompting / 낮은 temperature",
        "Top-K / 높은 temperature"
      ],
      "answer": 1,
      "explanation": "첫 설명은 Chain-of-Thought (CoT) prompting, 두 번째 설명은 높은 temperature에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-medium-mc-066",
      "conceptId": "pair-cosine-position_bias-medium-066",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① 문장 임베딩 벡터 사이의 의미 유사도를 측정하는 방법으로 소개된다. ② LLM 평가자가 동일한 품질이어도 특정 제시 위치의 응답을 상대적으로 선호할 수 있다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "Accuracy / 위치 편향",
        "cosine similarity / 길이 편향",
        "cosine similarity / 위치 편향",
        "위치 편향 / cosine similarity"
      ],
      "answer": 2,
      "explanation": "첫 설명은 cosine similarity, 두 번째 설명은 위치 편향에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-medium-mc-003",
      "conceptId": "pair-cell_state-rnn_share-medium-003",
      "difficulty": "medium",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): LSTM에서 장기 정보를 전달하는 주요 경로다. / (나): RNN은 각 시점에서 동일한 가중치를 반복해서 사용한다.",
      "options": [
        "Cell state / 시점마다 새 가중치 생성",
        "Hidden state만 / 같은 가중치를 시점마다 재사용",
        "같은 가중치를 시점마다 재사용 / Cell state",
        "Cell state / 같은 가중치를 시점마다 재사용"
      ],
      "answer": 3,
      "explanation": "첫 설명은 Cell state, 두 번째 설명은 같은 가중치를 시점마다 재사용에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-medium-mc-015",
      "conceptId": "pair-beam-seq2seq_year-medium-015",
      "difficulty": "medium",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=각 단계에서 상위 k개의 부분 시퀀스를 유지하며 더 좋은 전체 문장을 탐색한다. B= Seq2Seq가 2014년에 소개된 대표적 신경망 기반 시퀀스 변환 구조라고 설명한다.",
      "options": [
        "Beam search / 2014년",
        "Beam search / 1997년",
        "2014년 / Beam search",
        "Greedy decoding / 2014년"
      ],
      "answer": 0,
      "explanation": "첫 설명은 Beam search, 두 번째 설명은 2014년에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-medium-mc-025",
      "conceptId": "pair-decoder_context-self_attention-medium-025",
      "difficulty": "medium",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=decoder의 masked self-attention은 현재까지의 토큰만 사용한다. B=Self-Attention은 같은 문장 안의 모든 토큰 관계를 직접 계산해 표현을 문맥화한다.",
      "options": [
        "한 문장 내부의 단어들이 서로를 직접 참조 / 단방향 문맥",
        "단방향 문맥 / 한 문장 내부의 단어들이 서로를 직접 참조",
        "단방향 문맥 / encoder와 decoder 사이에서만 작동",
        "양방향 문맥 / 한 문장 내부의 단어들이 서로를 직접 참조"
      ],
      "answer": 1,
      "explanation": "첫 설명은 단방향 문맥, 두 번째 설명은 한 문장 내부의 단어들이 서로를 직접 참조에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-medium-mc-037",
      "conceptId": "pair-icl-zero_shot-medium-037",
      "difficulty": "medium",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) 모델 가중치를 바꾸지 않고 프롬프트의 instruction과 example을 이용해 새 작업을 수행한다. (나) 예시 없이 지시만 제공해 작업을 수행하게 하는 설정이다.",
      "options": [
        "Zero-shot / 파라미터 업데이트 없이 프롬프트의 지시·예시로 새 작업을 수행",
        "반드시 gradient update / Zero-shot",
        "파라미터 업데이트 없이 프롬프트의 지시·예시로 새 작업을 수행 / Zero-shot",
        "파라미터 업데이트 없이 프롬프트의 지시·예시로 새 작업을 수행 / Few-shot"
      ],
      "answer": 2,
      "explanation": "첫 설명은 파라미터 업데이트 없이 프롬프트의 지시·예시로 새 작업을 수행, 두 번째 설명은 Zero-shot에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-medium-mc-045",
      "conceptId": "pair-foundation-closed-medium-045",
      "difficulty": "medium",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=파운데이션 모델은 대량 데이터로 사전학습되어 여러 다운스트림 작업에 범용적으로 활용된다. B=ChatGPT, Claude, Gemini처럼 내부 가중치가 공개되지 않고 주로 API로 사용하는 모델 유형이다.",
      "options": [
        "Closed model / 대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델",
        "한 작업만 위한 규칙 기반 모델 / Closed model",
        "대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델 / Open model",
        "대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델 / Closed model"
      ],
      "answer": 3,
      "explanation": "첫 설명은 대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델, 두 번째 설명은 Closed model에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-medium-mc-052",
      "conceptId": "pair-instruction-sft-medium-052",
      "difficulty": "medium",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) 여러 작업을 자연어 지시와 응답 형태로 구성해 지도학습으로 모델을 조정한다. (나) 사람이 작성한 입력-응답 데이터를 이용해 지도학습으로 모델을 조정하는 단계다.",
      "options": [
        "Instruction tuning / Supervised Fine-Tuning (SFT)",
        "Supervised Fine-Tuning (SFT) / Instruction tuning",
        "Beam search / Supervised Fine-Tuning (SFT)",
        "Instruction tuning / PPL"
      ],
      "answer": 0,
      "explanation": "첫 설명은 Instruction tuning, 두 번째 설명은 Supervised Fine-Tuning (SFT)에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-medium-mc-058",
      "conceptId": "pair-eos-user_query-medium-058",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): 생성 종료를 나타내는 특수 토큰이며 최대 길이 조건과 함께 종료 기준으로 사용될 수 있다. / (나): 사용자가 실제로 모델에게 해결해 달라고 요청하는 질문이나 작업 지시다.",
      "options": [
        "MASK / User query",
        "EOS / User query",
        "EOS / System prompt",
        "User query / EOS"
      ],
      "answer": 1,
      "explanation": "첫 설명은 EOS, 두 번째 설명은 User query에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-medium-mc-067",
      "conceptId": "pair-eval_three-self_filter-medium-067",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) 평가 설계의 세 요소로 목표, 평가 방법, 평가 지표가 제시된다. (나) Self-Instruct 필터링은 너무 유사한 중복과 무관한 노이즈를 제거해 다양한 instruction을 남긴다.",
      "options": [
        "목표·평가 방법·평가 지표 / 모든 데이터를 그대로 유지",
        "중복·유사하거나 무관한 합성 데이터를 제거 / 목표·평가 방법·평가 지표",
        "목표·평가 방법·평가 지표 / 중복·유사하거나 무관한 합성 데이터를 제거",
        "입력·은닉층·출력층 / 중복·유사하거나 무관한 합성 데이터를 제거"
      ],
      "answer": 2,
      "explanation": "첫 설명은 목표·평가 방법·평가 지표, 두 번째 설명은 중복·유사하거나 무관한 합성 데이터를 제거에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-medium-mc-004",
      "conceptId": "pair-dim_curse-cell_state-medium-004",
      "difficulty": "medium",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① 어휘가 커질수록 One-hot 벡터 차원이 커져 메모리와 계산 효율이 나빠진다. ② LSTM에서 장기 정보를 전달하는 주요 경로다.",
      "options": [
        "차원의 저주 / Hidden state만",
        "Cell state / 차원의 저주",
        "교사 강요 / Cell state",
        "차원의 저주 / Cell state"
      ],
      "answer": 3,
      "explanation": "첫 설명은 차원의 저주, 두 번째 설명은 Cell state에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-medium-mc-016",
      "conceptId": "pair-beam_score-beam-medium-016",
      "difficulty": "medium",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① Beam search의 후보 시퀀스 점수는 토큰 로그 확률의 합으로 계산할 수 있다. ② 각 단계에서 상위 k개의 부분 시퀀스를 유지하며 더 좋은 전체 문장을 탐색한다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "로그 확률의 합 / Beam search",
        "Beam search / 로그 확률의 합",
        "벡터 차원의 합 / Beam search",
        "로그 확률의 합 / Greedy decoding"
      ],
      "answer": 0,
      "explanation": "첫 설명은 로그 확률의 합, 두 번째 설명은 Beam search에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-medium-mc-026",
      "conceptId": "pair-encoder_context-cross_attention-medium-026",
      "difficulty": "medium",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① encoder는 causal mask 없이 입력 전체를 보며 각 토큰을 양방향 문맥으로 인코딩할 수 있다. ② Encoder-Decoder Transformer의 Cross-Attention에서 Q는 decoder, K/V는 encoder 출력에서 온다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "단방향 문맥 / Query는 decoder, Key와 Value는 encoder",
        "양방향 문맥 / Query는 decoder, Key와 Value는 encoder",
        "양방향 문맥 / Q/K/V 모두 decoder",
        "Query는 decoder, Key와 Value는 encoder / 양방향 문맥"
      ],
      "answer": 1,
      "explanation": "첫 설명은 양방향 문맥, 두 번째 설명은 Query는 decoder, Key와 Value는 encoder에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-medium-mc-038",
      "conceptId": "pair-mlm-few_shot-medium-038",
      "difficulty": "medium",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): 일부 입력 토큰을 [MASK]로 바꾸고 원래 단어를 예측하는 사전학습 목표다. / (나): 소수의 입력-출력 예시를 프롬프트에 제공하는 설정이다.",
      "options": [
        "Causal LM / Few-shot",
        "Masked Language Model / Zero-shot",
        "Masked Language Model / Few-shot",
        "Few-shot / Masked Language Model"
      ],
      "answer": 2,
      "explanation": "첫 설명은 Masked Language Model, 두 번째 설명은 Few-shot에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-medium-mc-046",
      "conceptId": "pair-foundation_data-foundation_ssl-medium-046",
      "difficulty": "medium",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① 파운데이션 모델의 핵심 구성 요소로 대규모 데이터를 제시한다. ② 데이터 자체에서 학습 신호를 만들어 대규모 원시 데이터로 학습한다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "소량의 단일 태스크 데이터만 / Self-supervised learning",
        "대규모 데이터 / K-means만",
        "Self-supervised learning / 대규모 데이터",
        "대규모 데이터 / Self-supervised learning"
      ],
      "answer": 3,
      "explanation": "첫 설명은 대규모 데이터, 두 번째 설명은 Self-supervised learning에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-medium-mc-053",
      "conceptId": "pair-ppo-flan-medium-053",
      "difficulty": "medium",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): InstructGPT의 RLHF 정책 최적화에 사용된 알고리즘으로 PPO를 제시한다. / (나): 다양한 태스크를 여러 자연어 instruction 템플릿으로 변환해 학습한 instruction tuning 사례다.",
      "options": [
        "PPO / FLAN",
        "KNN / FLAN",
        "PPO / Word2Vec",
        "FLAN / PPO"
      ],
      "answer": 0,
      "explanation": "첫 설명은 PPO, 두 번째 설명은 FLAN에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-medium-mc-059",
      "conceptId": "pair-knn_prompt-eos-medium-059",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① 테스트 쿼리와 임베딩 거리가 가까운 학습 예시를 골라 few-shot 문맥으로 제공한다. ② 생성 종료를 나타내는 특수 토큰이며 최대 길이 조건과 함께 종료 기준으로 사용될 수 있다.",
      "options": [
        "kNN 기반 예시 선택 / MASK",
        "kNN 기반 예시 선택 / EOS",
        "EOS / kNN 기반 예시 선택",
        "가장 먼 예시 선택 / EOS"
      ],
      "answer": 1,
      "explanation": "첫 설명은 kNN 기반 예시 선택, 두 번째 설명은 EOS에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-medium-mc-068",
      "conceptId": "pair-evaluation-cosine-medium-068",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): 평가는 목표에 맞게 시스템이 실제로 잘 동작하는지 확인하는 단계다. / (나): 문장 임베딩 벡터 사이의 의미 유사도를 측정하는 방법으로 소개된다.",
      "options": [
        "학습 데이터를 늘리는 단계 / cosine similarity",
        "cosine similarity / 구축한 시스템이 실제로 잘 동작하는지 확인하는 단계",
        "구축한 시스템이 실제로 잘 동작하는지 확인하는 단계 / cosine similarity",
        "구축한 시스템이 실제로 잘 동작하는지 확인하는 단계 / Accuracy"
      ],
      "answer": 2,
      "explanation": "첫 설명은 구축한 시스템이 실제로 잘 동작하는지 확인하는 단계, 두 번째 설명은 cosine similarity에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-medium-mc-005",
      "conceptId": "pair-distributional-lstm_year-medium-005",
      "difficulty": "medium",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=단어의 의미는 주변 문맥과 함께 등장하는 단어를 통해 드러난다는 아이디어다. B= LSTM이 1997년에 제안되었다고 설명한다.",
      "options": [
        "1997년 / 분포 가설",
        "베이즈 규칙 / 1997년",
        "분포 가설 / 2013년",
        "분포 가설 / 1997년"
      ],
      "answer": 3,
      "explanation": "첫 설명은 분포 가설, 두 번째 설명은 1997년에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-medium-mc-017",
      "conceptId": "pair-bleu-end2end-medium-017",
      "difficulty": "medium",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) 기계번역 결과와 사람 번역의 유사도를 평가하는 지표로 소개된다. (나) encoder와 decoder를 하나의 신경망으로 연결해 역전파로 함께 학습한다.",
      "options": [
        "BLEU / End-to-End 학습",
        "ROUGE / End-to-End 학습",
        "BLEU / 규칙 기반 번역",
        "End-to-End 학습 / BLEU"
      ],
      "answer": 0,
      "explanation": "첫 설명은 BLEU, 두 번째 설명은 End-to-End 학습에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-medium-mc-027",
      "conceptId": "pair-ffn-minus_inf-medium-027",
      "difficulty": "medium",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) Self-Attention 뒤의 Feed-Forward Network가 각 위치 표현에 비선형 변환을 적용해 표현력을 높인다. (나) 미래 위치 attention score를 -∞로 두면 softmax 후 가중치가 0이 된다.",
      "options": [
        "비선형 표현 확장 / 1",
        "비선형 표현 확장 / -∞",
        "-∞ / 비선형 표현 확장",
        "미래 토큰 참조 / -∞"
      ],
      "answer": 1,
      "explanation": "첫 설명은 비선형 표현 확장, 두 번째 설명은 -∞에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-medium-mc-039",
      "conceptId": "pair-one_shot-mlm-medium-039",
      "difficulty": "medium",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① 하나의 예시를 프롬프트에 제공하는 설정이다. ② 일부 입력 토큰을 [MASK]로 바꾸고 원래 단어를 예측하는 사전학습 목표다.",
      "options": [
        "One-shot / Causal LM",
        "Masked Language Model / One-shot",
        "One-shot / Masked Language Model",
        "Zero-shot / Masked Language Model"
      ],
      "answer": 2,
      "explanation": "첫 설명은 One-shot, 두 번째 설명은 Masked Language Model에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-medium-mc-047",
      "conceptId": "pair-foundation_ssl-llm_pretrain-medium-047",
      "difficulty": "medium",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) 데이터 자체에서 학습 신호를 만들어 대규모 원시 데이터로 학습한다. (나) 거대 언어 모델의 대표적 사전학습 목표는 대규모 텍스트에서 다음 토큰을 예측하는 것이다.",
      "options": [
        "Self-supervised learning / 이미지 분할만",
        "K-means만 / 다음 토큰 예측",
        "다음 토큰 예측 / Self-supervised learning",
        "Self-supervised learning / 다음 토큰 예측"
      ],
      "answer": 3,
      "explanation": "첫 설명은 Self-supervised learning, 두 번째 설명은 다음 토큰 예측에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-medium-mc-054",
      "conceptId": "pair-preference-ppo-medium-054",
      "difficulty": "medium",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① 여러 가능한 응답 중 사람이 더 선호하는 응답을 학습하는 방법이다. ② InstructGPT의 RLHF 정책 최적화에 사용된 알고리즘으로 PPO를 제시한다.",
      "options": [
        "Preference learning / PPO",
        "Preference learning / KNN",
        "One-hot encoding / PPO",
        "PPO / Preference learning"
      ],
      "answer": 0,
      "explanation": "첫 설명은 Preference learning, 두 번째 설명은 PPO에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-medium-mc-060",
      "conceptId": "pair-prompt_eng-system_prompt-medium-060",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=원하는 출력을 얻도록 지시와 예시를 설계·조정하는 과정이다. B=모델의 기본 역할, 행동 지침, 스타일 같은 상위 수준 지시를 제공한다.",
      "options": [
        "System prompt / 프롬프트 엔지니어링",
        "프롬프트 엔지니어링 / System prompt",
        "최소제곱법 / System prompt",
        "프롬프트 엔지니어링 / User query"
      ],
      "answer": 1,
      "explanation": "첫 설명은 프롬프트 엔지니어링, 두 번째 설명은 System prompt에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-medium-mc-069",
      "conceptId": "pair-length_bias-mmlu-medium-069",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① 품질과 무관하게 길이가 긴 응답을 상대적으로 선호할 수 있는 평가 편향이다. ② 57개의 다양한 전문 분야 객관식 문제로 구성된 벤치마크로 소개된다.",
      "options": [
        "MMLU / 길이 편향",
        "위치 편향 / MMLU",
        "길이 편향 / MMLU",
        "길이 편향 / BLEU"
      ],
      "answer": 2,
      "explanation": "첫 설명은 길이 편향, 두 번째 설명은 MMLU에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-medium-mc-006",
      "conceptId": "pair-embedding-rnn_parallel-medium-006",
      "difficulty": "medium",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① 단어를 의미 정보를 담은 저차원의 밀집 연속 벡터로 표현한다. ② RNN은 이전 시점 결과에 의존하므로 시퀀스 위치를 한꺼번에 계산하기 어렵다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "One-hot encoding / 순차 연산 때문에 병렬화가 어렵다",
        "Word embedding / 벡터를 사용하지 않아서",
        "순차 연산 때문에 병렬화가 어렵다 / Word embedding",
        "Word embedding / 순차 연산 때문에 병렬화가 어렵다"
      ],
      "answer": 3,
      "explanation": "첫 설명은 Word embedding, 두 번째 설명은 순차 연산 때문에 병렬화가 어렵다에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-medium-mc-018",
      "conceptId": "pair-bottleneck-sentence_prob-medium-018",
      "difficulty": "medium",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): 기본 Seq2Seq는 입력 전체를 하나의 고정 길이 벡터에 압축해 긴 입력에서 정보 손실이 생길 수 있다. / (나): 문장 전체 확률은 각 시점 단어가 이전 문맥에 조건부로 등장할 확률들의 곱으로 표현할 수 있다.",
      "options": [
        "고정 길이 벡터에 전체 입력을 압축 / 조건부 확률의 곱",
        "고정 길이 벡터에 전체 입력을 압축 / 단어 길이의 합",
        "모든 encoder 상태를 직접 참조 / 조건부 확률의 곱",
        "조건부 확률의 곱 / 고정 길이 벡터에 전체 입력을 압축"
      ],
      "answer": 0,
      "explanation": "첫 설명은 고정 길이 벡터에 전체 입력을 압축, 두 번째 설명은 조건부 확률의 곱에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-medium-mc-028",
      "conceptId": "pair-key-scaled_reason-medium-028",
      "difficulty": "medium",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): 각 단어가 가진 정보의 특징을 나타내며 Query와의 유사도 계산에 사용된다. / (나): Q/K 차원이 커지면 내적값이 커져 softmax가 과도하게 뾰족해질 수 있어 스케일링한다.",
      "options": [
        "softmax가 지나치게 뾰족해지는 것을 완화 / Key",
        "Key / softmax가 지나치게 뾰족해지는 것을 완화",
        "Query / softmax가 지나치게 뾰족해지는 것을 완화",
        "Key / 토큰 수를 늘리기 위해"
      ],
      "answer": 1,
      "explanation": "첫 설명은 Key, 두 번째 설명은 softmax가 지나치게 뾰족해지는 것을 완화에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-medium-mc-040",
      "conceptId": "pair-pretrain_finetune-pretraining-medium-040",
      "difficulty": "medium",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=사전학습 파라미터를 초기값으로 사용한 뒤 다운스트림 태스크에 맞게 조정하는 패러다임이다. B=사전학습은 대규모 데이터로 모델이 일반적인 특징과 표현을 먼저 학습하게 한다.",
      "options": [
        "테스트 후 학습 / 대규모 데이터로 일반적 표현과 패턴을 먼저 학습",
        "대규모 데이터로 일반적 표현과 패턴을 먼저 학습 / 사전학습 후 파인튜닝",
        "사전학습 후 파인튜닝 / 대규모 데이터로 일반적 표현과 패턴을 먼저 학습",
        "사전학습 후 파인튜닝 / 테스트 정답만 암기"
      ],
      "answer": 2,
      "explanation": "첫 설명은 사전학습 후 파인튜닝, 두 번째 설명은 대규모 데이터로 일반적 표현과 패턴을 먼저 학습에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-medium-mc-048",
      "conceptId": "pair-foundation_transformer-closed-medium-048",
      "difficulty": "medium",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): 텍스트 파운데이션 모델의 핵심 모델 구조로 attention 기반 Transformer가 사용된다. / (나): ChatGPT, Claude, Gemini처럼 내부 가중치가 공개되지 않고 주로 API로 사용하는 모델 유형이다.",
      "options": [
        "Attention 기반 Transformer / Open model",
        "Closed model / Attention 기반 Transformer",
        "Decision Tree / Closed model",
        "Attention 기반 Transformer / Closed model"
      ],
      "answer": 3,
      "explanation": "첫 설명은 Attention 기반 Transformer, 두 번째 설명은 Closed model에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-medium-mc-055",
      "conceptId": "pair-reward_model-rlhf-medium-055",
      "difficulty": "medium",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=후보 응답에 대한 인간 선호를 점수로 근사하는 모델이다. B=인간 피드백을 이용해 모델의 응답 선호를 반영하는 강화학습 기반 정렬 방법이다.",
      "options": [
        "Reward Model / RLHF",
        "Reward Model / CBOW",
        "RLHF / Reward Model",
        "Tokenizer / RLHF"
      ],
      "answer": 0,
      "explanation": "첫 설명은 Reward Model, 두 번째 설명은 RLHF에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-medium-mc-061",
      "conceptId": "pair-skill_md-topp-medium-061",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① 특정 task를 위해 엔지니어링된 공유·재사용 가능한 프롬프트 형식의 예로 Skill.md를 소개한다. ② 누적 확률이 P에 도달하는 최소 상위 토큰 집합을 동적으로 선택해 샘플링한다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "Top-P (Nucleus) sampling / Skill.md",
        "Skill.md / Top-P (Nucleus) sampling",
        "Skill.md / Top-K",
        "requirements.txt / Top-P (Nucleus) sampling"
      ],
      "answer": 1,
      "explanation": "첫 설명은 Skill.md, 두 번째 설명은 Top-P (Nucleus) sampling에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-medium-mc-070",
      "conceptId": "pair-llm_judge-seed175-medium-070",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=거대 언어 모델을 평가자로 사용해 생성 텍스트 품질이나 상대적 선호를 판단한다. B= Self-Instruct 사례는 사람이 작성한 175개의 seed 데이터에서 시작한다.",
      "options": [
        "CBOW / 175개",
        "LLM-as-judge (G-Eval) / 17개",
        "LLM-as-judge (G-Eval) / 175개",
        "175개 / LLM-as-judge (G-Eval)"
      ],
      "answer": 2,
      "explanation": "첫 설명은 LLM-as-judge (G-Eval), 두 번째 설명은 175개에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-medium-mc-007",
      "conceptId": "pair-embedding_similarity-cbow_fast-medium-007",
      "difficulty": "medium",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) 의미가 비슷한 단어는 임베딩 공간에서 가까운 위치에 놓이도록 학습할 수 있다. (나) 비교적 빠른 학습과 빈도가 높은 단어 표현에 강점이 있다고 설명된 방식이다.",
      "options": [
        "가까운 벡터 / Skip-gram",
        "항상 직교 벡터 / CBOW",
        "CBOW / 가까운 벡터",
        "가까운 벡터 / CBOW"
      ],
      "answer": 3,
      "explanation": "첫 설명은 가까운 벡터, 두 번째 설명은 CBOW에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-medium-mc-019",
      "conceptId": "pair-context_vector-attention_softmax-medium-019",
      "difficulty": "medium",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① Attention context vector는 attention weight로 Value들을 가중합하여 계산한다. ② 유사도 점수에 softmax를 적용해 입력 위치별 attention weight 분포를 만든다.",
      "options": [
        "Value들의 가중합 / Softmax",
        "Value들의 가중합 / ReLU",
        "Softmax / Value들의 가중합",
        "Query 복사 / Softmax"
      ],
      "answer": 0,
      "explanation": "첫 설명은 Value들의 가중합, 두 번째 설명은 Softmax에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-medium-mc-029",
      "conceptId": "pair-layernorm-value-medium-029",
      "difficulty": "medium",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① 각 레이어의 hidden vector 값을 정규화해 안정적이고 빠른 학습을 돕는다. ② attention weight에 따라 실제로 모아지는 정보 내용을 담는다.",
      "options": [
        "Value / Layer Normalization",
        "Layer Normalization / Value",
        "Layer Normalization / Query",
        "Beam Search / Value"
      ],
      "answer": 1,
      "explanation": "첫 설명은 Layer Normalization, 두 번째 설명은 Value에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-medium-mc-041",
      "conceptId": "pair-pretraining-zero_shot-medium-041",
      "difficulty": "medium",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① 사전학습은 대규모 데이터로 모델이 일반적인 특징과 표현을 먼저 학습하게 한다. ② 예시 없이 지시만 제공해 작업을 수행하게 하는 설정이다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "Zero-shot / 대규모 데이터로 일반적 표현과 패턴을 먼저 학습",
        "테스트 정답만 암기 / Zero-shot",
        "대규모 데이터로 일반적 표현과 패턴을 먼저 학습 / Zero-shot",
        "대규모 데이터로 일반적 표현과 패턴을 먼저 학습 / Few-shot"
      ],
      "answer": 2,
      "explanation": "첫 설명은 대규모 데이터로 일반적 표현과 패턴을 먼저 학습, 두 번째 설명은 Zero-shot에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-medium-mc-049",
      "conceptId": "pair-llm_pretrain-foundation_data-medium-049",
      "difficulty": "medium",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① 거대 언어 모델의 대표적 사전학습 목표는 대규모 텍스트에서 다음 토큰을 예측하는 것이다. ② 파운데이션 모델의 핵심 구성 요소로 대규모 데이터를 제시한다.",
      "options": [
        "대규모 데이터 / 다음 토큰 예측",
        "이미지 분할만 / 대규모 데이터",
        "다음 토큰 예측 / 소량의 단일 태스크 데이터만",
        "다음 토큰 예측 / 대규모 데이터"
      ],
      "answer": 3,
      "explanation": "첫 설명은 다음 토큰 예측, 두 번째 설명은 대규모 데이터에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-medium-mc-062",
      "conceptId": "pair-system_prompt-cot-medium-062",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) 모델의 기본 역할, 행동 지침, 스타일 같은 상위 수준 지시를 제공한다. (나) 예시에 최종 답뿐 아니라 중간 추론 과정을 함께 보여 주어 복합 추론을 유도한다.",
      "options": [
        "System prompt / Chain-of-Thought (CoT) prompting",
        "System prompt / Top-K",
        "User query / Chain-of-Thought (CoT) prompting",
        "Chain-of-Thought (CoT) prompting / System prompt"
      ],
      "answer": 0,
      "explanation": "첫 설명은 System prompt, 두 번째 설명은 Chain-of-Thought (CoT) prompting에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-medium-mc-071",
      "conceptId": "pair-lmarena-vision_projection-medium-071",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① 실제 사용자 피드백으로 모델 응답의 상대적 선호를 평가하는 대표 사례다. ② 이미지 특징을 추출한 뒤 언어 모델 입력 공간에 맞게 투영하는 연결 방식이다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "LMArena / PPO + BLEU",
        "LMArena / Vision Encoder + Projection",
        "Vision Encoder + Projection / LMArena",
        "Word2Vec Arena / Vision Encoder + Projection"
      ],
      "answer": 1,
      "explanation": "첫 설명은 LMArena, 두 번째 설명은 Vision Encoder + Projection에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-medium-mc-008",
      "conceptId": "pair-forget_gate-lstm-medium-008",
      "difficulty": "medium",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): 이전 cell state의 정보를 얼마나 유지하거나 버릴지 결정한다. / (나): 기본 RNN의 장기 의존성과 기울기 소실 문제를 완화하기 위해 설계된 순환 신경망이다.",
      "options": [
        "Input gate / LSTM",
        "LSTM / Forget gate",
        "Forget gate / LSTM",
        "Forget gate / CBOW"
      ],
      "answer": 2,
      "explanation": "첫 설명은 Forget gate, 두 번째 설명은 LSTM에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-medium-mc-020",
      "conceptId": "pair-decoder-encoder-medium-020",
      "difficulty": "medium",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=encoder 표현을 조건으로 출력 시퀀스를 한 단계씩 생성한다. B=입력 시퀀스를 읽어 의미 정보를 담은 표현으로 변환한다.",
      "options": [
        "Decoder / Reward Model",
        "Encoder / Decoder",
        "Tokenizer / Encoder",
        "Decoder / Encoder"
      ],
      "answer": 3,
      "explanation": "첫 설명은 Decoder, 두 번째 설명은 Encoder에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-medium-mc-030",
      "conceptId": "pair-learned_pos-masked-medium-030",
      "difficulty": "medium",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=각 위치 벡터 자체를 학습 파라미터로 두고 최적화한다. B=언어 생성 시 현재 위치가 미래 토큰을 보지 못하도록 차단한다.",
      "options": [
        "Learned Absolute Position Embedding / Masked Self-Attention",
        "Learned Absolute Position Embedding / Cross-Attention",
        "Sinusoidal Position Encoding / Masked Self-Attention",
        "Masked Self-Attention / Learned Absolute Position Embedding"
      ],
      "answer": 0,
      "explanation": "첫 설명은 Learned Absolute Position Embedding, 두 번째 설명은 Masked Self-Attention에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-medium-mc-042",
      "conceptId": "pair-zero_shot-few_shot-medium-042",
      "difficulty": "medium",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) 예시 없이 지시만 제공해 작업을 수행하게 하는 설정이다. (나) 소수의 입력-출력 예시를 프롬프트에 제공하는 설정이다.",
      "options": [
        "One-shot / Few-shot",
        "Zero-shot / Few-shot",
        "Zero-shot / Full fine-tuning",
        "Few-shot / Zero-shot"
      ],
      "answer": 1,
      "explanation": "첫 설명은 Zero-shot, 두 번째 설명은 Few-shot에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-medium-mc-063",
      "conceptId": "pair-temperature_high-skill_md-medium-063",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): Temperature가 커지면 분포가 평평해져 다양한 토큰이 선택될 가능성이 커진다. / (나): 특정 task를 위해 엔지니어링된 공유·재사용 가능한 프롬프트 형식의 예로 Skill.md를 소개한다.",
      "options": [
        "높은 temperature / requirements.txt",
        "Skill.md / 높은 temperature",
        "높은 temperature / Skill.md",
        "낮은 temperature / Skill.md"
      ],
      "answer": 2,
      "explanation": "첫 설명은 높은 temperature, 두 번째 설명은 Skill.md에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-medium-mc-072",
      "conceptId": "pair-mmlu-llm_judge-medium-072",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) 57개의 다양한 전문 분야 객관식 문제로 구성된 벤치마크로 소개된다. (나) 거대 언어 모델을 평가자로 사용해 생성 텍스트 품질이나 상대적 선호를 판단한다.",
      "options": [
        "MMLU / CBOW",
        "LLM-as-judge (G-Eval) / MMLU",
        "BLEU / LLM-as-judge (G-Eval)",
        "MMLU / LLM-as-judge (G-Eval)"
      ],
      "answer": 3,
      "explanation": "첫 설명은 MMLU, 두 번째 설명은 LLM-as-judge (G-Eval)에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-medium-mc-009",
      "conceptId": "pair-gate_range-rnn_formula-medium-009",
      "difficulty": "medium",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① LSTM의 sigmoid gate 출력은 0과 1 사이 값으로 정보 통과 비율을 조절한다. ② 기본 RNN은 이전 hidden state와 현재 입력을 결합해 tanh를 적용하여 현재 hidden state를 계산한다.",
      "options": [
        "0과 1 사이 / h_t = tanh(W_hh h_{t-1} + W_xh x_t)",
        "-∞와 ∞ / h_t = tanh(W_hh h_{t-1} + W_xh x_t)",
        "0과 1 사이 / h_t = softmax(x_t)",
        "h_t = tanh(W_hh h_{t-1} + W_xh x_t) / 0과 1 사이"
      ],
      "answer": 0,
      "explanation": "첫 설명은 0과 1 사이, 두 번째 설명은 h_t = tanh(W_hh h_{t-1} + W_xh x_t)에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-medium-mc-021",
      "conceptId": "pair-encoder-ngram_context-medium-021",
      "difficulty": "medium",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① 입력 시퀀스를 읽어 의미 정보를 담은 표현으로 변환한다. ② N-gram 언어 모델은 다음 단어 예측에 직전 N-1개의 단어를 문맥으로 사용한다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "직전 N-1개 단어 / Encoder",
        "Encoder / 직전 N-1개 단어",
        "Encoder / 문서 전체",
        "Decoder / 직전 N-1개 단어"
      ],
      "answer": 1,
      "explanation": "첫 설명은 Encoder, 두 번째 설명은 직전 N-1개 단어에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-medium-mc-031",
      "conceptId": "pair-masked-residual-medium-031",
      "difficulty": "medium",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① 언어 생성 시 현재 위치가 미래 토큰을 보지 못하도록 차단한다. ② 층의 입력을 출력에 더해 깊은 네트워크에서 정보와 gradient 흐름을 돕는다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "Masked Self-Attention / Top-P",
        "Residual connection / Masked Self-Attention",
        "Masked Self-Attention / Residual connection",
        "Cross-Attention / Residual connection"
      ],
      "answer": 2,
      "explanation": "첫 설명은 Masked Self-Attention, 두 번째 설명은 Residual connection에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-medium-mc-064",
      "conceptId": "pair-temperature_low-topk-medium-064",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① Temperature가 낮아지면 분포가 더 뾰족해져 높은 확률 토큰에 선택이 집중된다. ② 확률이 높은 K개의 토큰만 후보로 남긴 뒤 그 안에서 샘플링한다.",
      "options": [
        "낮은 temperature / Top-P",
        "Top-K / 낮은 temperature",
        "높은 temperature / Top-K",
        "낮은 temperature / Top-K"
      ],
      "answer": 3,
      "explanation": "첫 설명은 낮은 temperature, 두 번째 설명은 Top-K에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-medium-mc-073",
      "conceptId": "pair-multimodal-rouge-medium-073",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): 텍스트뿐 아니라 이미지·비디오·오디오 등 여러 모달리티를 입력·출력으로 다룬다. / (나): 참조 답안과 생성 문장 사이 단어 수준 중첩을 이용한 유사도 평가 지표다.",
      "options": [
        "멀티모달 파운데이션 모델 / ROUGE",
        "N-gram 모델 / ROUGE",
        "멀티모달 파운데이션 모델 / PPO",
        "ROUGE / 멀티모달 파운데이션 모델"
      ],
      "answer": 0,
      "explanation": "첫 설명은 멀티모달 파운데이션 모델, 두 번째 설명은 ROUGE에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-medium-mc-010",
      "conceptId": "pair-hidden_state-cbow-medium-010",
      "difficulty": "medium",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=이전까지의 시퀀스 정보를 요약해 다음 시점으로 전달하는 상태다. B=CBOW는 주변 문맥 단어들을 이용해 중심 단어를 예측한다.",
      "options": [
        "Cell state / 주변 단어로 중심 단어를 예측",
        "Hidden state / 주변 단어로 중심 단어를 예측",
        "Hidden state / 중심 단어로 주변 단어를 예측",
        "주변 단어로 중심 단어를 예측 / Hidden state"
      ],
      "answer": 1,
      "explanation": "첫 설명은 Hidden state, 두 번째 설명은 주변 단어로 중심 단어를 예측에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-medium-mc-022",
      "conceptId": "pair-end2end-attention-medium-022",
      "difficulty": "medium",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) encoder와 decoder를 하나의 신경망으로 연결해 역전파로 함께 학습한다. (나) Attention은 decoder 각 시점에서 관련 있는 encoder hidden state를 선택적으로 참조한다.",
      "options": [
        "규칙 기반 번역 / 관련 있는 입력 위치를 선택적으로 참조",
        "End-to-End 학습 / 모든 입력을 동일 비중 압축",
        "End-to-End 학습 / 관련 있는 입력 위치를 선택적으로 참조",
        "관련 있는 입력 위치를 선택적으로 참조 / End-to-End 학습"
      ],
      "answer": 2,
      "explanation": "첫 설명은 End-to-End 학습, 두 번째 설명은 관련 있는 입력 위치를 선택적으로 참조에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-medium-mc-032",
      "conceptId": "pair-minus_inf-transformer_core-medium-032",
      "difficulty": "medium",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) 미래 위치 attention score를 -∞로 두면 softmax 후 가중치가 0이 된다. (나) Transformer의 핵심 시퀀스 처리 메커니즘이다.",
      "options": [
        "-∞ / K-means",
        "Self-Attention / -∞",
        "1 / Self-Attention",
        "-∞ / Self-Attention"
      ],
      "answer": 3,
      "explanation": "첫 설명은 -∞, 두 번째 설명은 Self-Attention에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-medium-mc-074",
      "conceptId": "pair-position_bias-synth52000-medium-074",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① LLM 평가자가 동일한 품질이어도 특정 제시 위치의 응답을 상대적으로 선호할 수 있다. ② Self-Instruct 사례는 GPT-3를 이용해 약 52,000개의 합성 데이터를 생성했다고 설명한다.",
      "options": [
        "위치 편향 / 52,000개",
        "위치 편향 / 5,200개",
        "길이 편향 / 52,000개",
        "52,000개 / 위치 편향"
      ],
      "answer": 0,
      "explanation": "첫 설명은 위치 편향, 두 번째 설명은 52,000개에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-medium-mc-011",
      "conceptId": "pair-input_gate-long_dependency-medium-011",
      "difficulty": "medium",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "두 설명 ① 새로운 후보 정보를 cell state에 얼마나 기록할지 조절한다. ② 멀리 떨어진 단어 사이의 관계를 기억해야 하는 문제를 장기 의존성이라 한다.에 해당하는 개념을 순서대로 고르시오.",
      "options": [
        "Input gate / 차원의 저주",
        "Input gate / 장기 의존성",
        "장기 의존성 / Input gate",
        "Forget gate / 장기 의존성"
      ],
      "answer": 1,
      "explanation": "첫 설명은 Input gate, 두 번째 설명은 장기 의존성에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-medium-mc-033",
      "conceptId": "pair-multihead-key-medium-033",
      "difficulty": "medium",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "빈칸 (가), (나)에 들어갈 용어 조합으로 옳은 것은? (가): 여러 attention head가 문법적·의미적 관계 등 서로 다른 관점을 병렬로 학습한다. / (나): 각 단어가 가진 정보의 특징을 나타내며 Query와의 유사도 계산에 사용된다.",
      "options": [
        "Key / 여러 관점의 관계를 동시에 포착",
        "한 관점만 강제 / Key",
        "여러 관점의 관계를 동시에 포착 / Key",
        "여러 관점의 관계를 동시에 포착 / Query"
      ],
      "answer": 2,
      "explanation": "첫 설명은 여러 관점의 관계를 동시에 포착, 두 번째 설명은 Key에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-medium-mc-075",
      "conceptId": "pair-ppl-evaluation-medium-075",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "설명 A와 B를 모두 만족하는 개념 조합을 고르시오. A=언어 모델이 문장을 얼마나 확률적으로 자연스럽게 예측하는지 나타내는 지표다. B=평가는 목표에 맞게 시스템이 실제로 잘 동작하는지 확인하는 단계다.",
      "options": [
        "Perplexity (PPL) / 학습 데이터를 늘리는 단계",
        "Accuracy / 구축한 시스템이 실제로 잘 동작하는지 확인하는 단계",
        "구축한 시스템이 실제로 잘 동작하는지 확인하는 단계 / Perplexity (PPL)",
        "Perplexity (PPL) / 구축한 시스템이 실제로 잘 동작하는지 확인하는 단계"
      ],
      "answer": 3,
      "explanation": "첫 설명은 Perplexity (PPL), 두 번째 설명은 구축한 시스템이 실제로 잘 동작하는지 확인하는 단계에 해당한다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-medium-mc-012",
      "conceptId": "pair-long_dependency-rnn-medium-012",
      "difficulty": "medium",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "두 설명을 올바르게 연결한 개념 조합은? (가) 멀리 떨어진 단어 사이의 관계를 기억해야 하는 문제를 장기 의존성이라 한다. (나) 이전 시점의 hidden state를 다음 시점으로 전달해 순차적 문맥을 반영하는 신경망이다.",
      "options": [
        "장기 의존성 / RNN",
        "RNN / 장기 의존성",
        "차원의 저주 / RNN",
        "장기 의존성 / CNN"
      ],
      "answer": 0,
      "explanation": "첫 설명은 장기 의존성, 두 번째 설명은 RNN에 해당한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-medium-mc-034",
      "conceptId": "pair-order_limit-qkv-medium-034",
      "difficulty": "medium",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 두 특성을 구분할 때 각각에 해당하는 개념의 순서는? ① Self-Attention 자체는 토큰 간 유사도만 계산하므로 입력 순서 정보가 직접 포함되지 않는다. ② 각 입력 단어 표현은 서로 다른 학습 행렬을 통해 Query, Key, Value로 변환된다.",
      "options": [
        "모든 연산이 순차적 / Q, K, V",
        "순서 정보 부재 / Q, K, V",
        "순서 정보 부재 / X, Y, Z",
        "Q, K, V / 순서 정보 부재"
      ],
      "answer": 1,
      "explanation": "첫 설명은 순서 정보 부재, 두 번째 설명은 Q, K, V에 해당한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-medium-sa-001",
      "conceptId": "autoregressive-medium-short-001",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 정확한 용어·식·값을 작성하시오. 지금까지 생성한 토큰을 조건으로 다음 토큰을 하나씩 순차 생성한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Autoregressive generation"
      ],
      "explanation": "해당 설명의 핵심 개념은 Autoregressive generation이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-sa-002",
      "conceptId": "evaluation-medium-short-002",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 명칭을 정확히 작성하시오. 평가는 목표에 맞게 시스템이 실제로 잘 동작하는지 확인하는 단계다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "구축한 시스템이 실제로 잘 동작하는지 확인하는 단계"
      ],
      "explanation": "해당 설명의 핵심 개념은 구축한 시스템이 실제로 잘 동작하는지 확인하는 단계이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-sa-003",
      "conceptId": "eos-medium-short-003",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "short-answer",
      "prompt": "다음 정의의 핵심 답을 정확한 표기로 작성하시오. 생성 종료를 나타내는 특수 토큰이며 최대 길이 조건과 함께 종료 기준으로 사용될 수 있다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "EOS"
      ],
      "explanation": "해당 설명의 핵심 개념은 EOS이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-sa-015",
      "conceptId": "eval_three-medium-short-015",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "short-answer",
      "prompt": "다음 정의의 핵심 답을 정확한 표기로 작성하시오. 평가 설계의 세 요소로 목표, 평가 방법, 평가 지표가 제시된다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "목표·평가 방법·평가 지표"
      ],
      "explanation": "해당 설명의 핵심 개념은 목표·평가 방법·평가 지표이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-sa-004",
      "conceptId": "temperature_low-medium-short-004",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "short-answer",
      "prompt": "빈칸에 들어갈 용어 또는 값을 작성하시오. [ Temperature가 낮아지면 분포가 더 뾰족해져 높은 확률 토큰에 선택이 집중된다. ]",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "낮은 temperature"
      ],
      "explanation": "해당 설명의 핵심 개념은 낮은 temperature이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-sa-005",
      "conceptId": "temperature_high-medium-short-005",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 정확한 용어·식·값을 작성하시오. Temperature가 커지면 분포가 평평해져 다양한 토큰이 선택될 가능성이 커진다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "높은 temperature"
      ],
      "explanation": "해당 설명의 핵심 개념은 높은 temperature이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-sa-006",
      "conceptId": "topk-medium-short-006",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 명칭을 정확히 작성하시오. 확률이 높은 K개의 토큰만 후보로 남긴 뒤 그 안에서 샘플링한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Top-K"
      ],
      "explanation": "해당 설명의 핵심 개념은 Top-K이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-sa-007",
      "conceptId": "topp-medium-short-007",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "short-answer",
      "prompt": "다음 정의의 핵심 답을 정확한 표기로 작성하시오. 누적 확률이 P에 도달하는 최소 상위 토큰 집합을 동적으로 선택해 샘플링한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Top-P (Nucleus) sampling"
      ],
      "explanation": "해당 설명의 핵심 개념은 Top-P (Nucleus) sampling이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-sa-008",
      "conceptId": "prompt_eng-medium-short-008",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "short-answer",
      "prompt": "빈칸에 들어갈 용어 또는 값을 작성하시오. [ 원하는 출력을 얻도록 지시와 예시를 설계·조정하는 과정이다. ]",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "프롬프트 엔지니어링"
      ],
      "explanation": "해당 설명의 핵심 개념은 프롬프트 엔지니어링이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-sa-009",
      "conceptId": "system_prompt-medium-short-009",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 정확한 용어·식·값을 작성하시오. 모델의 기본 역할, 행동 지침, 스타일 같은 상위 수준 지시를 제공한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "System prompt"
      ],
      "explanation": "해당 설명의 핵심 개념은 System prompt이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-sa-010",
      "conceptId": "user_query-medium-short-010",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 명칭을 정확히 작성하시오. 사용자가 실제로 모델에게 해결해 달라고 요청하는 질문이나 작업 지시다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "User query"
      ],
      "explanation": "해당 설명의 핵심 개념은 User query이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-sa-011",
      "conceptId": "cot-medium-short-011",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "short-answer",
      "prompt": "다음 정의의 핵심 답을 정확한 표기로 작성하시오. 예시에 최종 답뿐 아니라 중간 추론 과정을 함께 보여 주어 복합 추론을 유도한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Chain-of-Thought (CoT) prompting"
      ],
      "explanation": "해당 설명의 핵심 개념은 Chain-of-Thought (CoT) prompting이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-sa-012",
      "conceptId": "zero_cot-medium-short-012",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "short-answer",
      "prompt": "빈칸에 들어갈 용어 또는 값을 작성하시오. [ 예시 없이 단계적으로 생각하라는 문구를 추가해 추론을 유도하는 방식이다. ]",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Zero-shot CoT"
      ],
      "explanation": "해당 설명의 핵심 개념은 Zero-shot CoT이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-sa-013",
      "conceptId": "knn_prompt-medium-short-013",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 정확한 용어·식·값을 작성하시오. 테스트 쿼리와 임베딩 거리가 가까운 학습 예시를 골라 few-shot 문맥으로 제공한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "kNN 기반 예시 선택"
      ],
      "explanation": "해당 설명의 핵심 개념은 kNN 기반 예시 선택이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-sa-014",
      "conceptId": "skill_md-medium-short-014",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 명칭을 정확히 작성하시오. 특정 task를 위해 엔지니어링된 공유·재사용 가능한 프롬프트 형식의 예로 Skill.md를 소개한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Skill.md"
      ],
      "explanation": "해당 설명의 핵심 개념은 Skill.md이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-medium-es-001",
      "conceptId": "week2-medium-essay-001",
      "difficulty": "medium",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "essay",
      "prompt": "RNN과 Self-Attention을 순차 처리와 병렬화 관점에서 비교하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "RNN",
        "Self-Attention",
        "순차",
        "병렬"
      ],
      "modelAnswer": "RNN은 이전 hidden state에 의존해 시점별 순차 계산이 필요하므로 병렬화가 어렵다. Self-Attention은 문장 내 토큰 관계를 직접 계산하므로 위치별 계산을 병렬화하기 쉽다.",
      "rubricKeywords": [
        "RNN",
        "Self-Attention",
        "순차",
        "병렬"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: RNN, Self-Attention, 순차, 병렬. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "순차적 데이터에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-medium-es-003",
      "conceptId": "week2-medium-essay-003",
      "difficulty": "medium",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "essay",
      "prompt": "Greedy decoding과 Beam search의 장단점을 비교하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Greedy",
        "Beam search",
        "상위 k개",
        "계산량"
      ],
      "modelAnswer": "Greedy는 빠르지만 초기 선택을 되돌리기 어렵다. Beam search는 상위 k개 후보를 유지해 더 좋은 전체 시퀀스를 찾을 가능성이 높지만 계산량이 증가한다.",
      "rubricKeywords": [
        "Greedy",
        "Beam search",
        "상위 k개",
        "계산량"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Greedy, Beam search, 상위 k개, 계산량. Seq2Seq의 병목과 Attention이 어떤 encoder 정보를 선택적으로 참조하는지 연결해야 한다.",
      "hint": "Seq2Seq 추론에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-medium-es-004",
      "conceptId": "week2-medium-essay-004",
      "difficulty": "medium",
      "category": "Transformer",
      "questionType": "essay",
      "prompt": "Positional Encoding, Feed-Forward Network, Masked Self-Attention이 필요한 이유를 연결해 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Positional Encoding",
        "Feed-Forward Network",
        "Masked Self-Attention",
        "미래 토큰"
      ],
      "modelAnswer": "Self-Attention 자체의 순서 정보 부재, 비선형성 부족, 미래 토큰 참조 문제를 각각 Positional Encoding, Feed-Forward Network, Masked Self-Attention이 보완한다.",
      "rubricKeywords": [
        "Positional Encoding",
        "Feed-Forward Network",
        "Masked Self-Attention",
        "미래 토큰"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Positional Encoding, Feed-Forward Network, Masked Self-Attention, 미래 토큰. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "Transformer에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-medium-es-005",
      "conceptId": "week2-medium-essay-005",
      "difficulty": "medium",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "essay",
      "prompt": "Instruction tuning과 FLAN이 새로운 태스크 일반화에 도움을 주는 이유를 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Instruction tuning",
        "FLAN",
        "태스크 다양성",
        "자연어 지시"
      ],
      "modelAnswer": "Instruction tuning은 여러 태스크를 자연어 지시-응답 형태로 통합해 학습한다. FLAN 사례에서는 태스크 수와 다양성, 자연어 지시 등이 보지 않은 태스크로의 일반화에 중요하게 작용한다.",
      "rubricKeywords": [
        "Instruction tuning",
        "FLAN",
        "태스크 다양성",
        "자연어 지시"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Instruction tuning, FLAN, 태스크 다양성, 자연어 지시. 대규모 사전학습 이후 지시 데이터와 인간 선호를 반영하는 정렬 단계를 순서대로 구분해야 한다.",
      "hint": "지시 학습에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-medium-es-007",
      "conceptId": "week2-medium-essay-007",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "essay",
      "prompt": "Temperature, Top-K, Top-P가 출력 다양성을 조절하는 방식을 비교하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Temperature",
        "Top-K",
        "Top-P",
        "누적 확률"
      ],
      "modelAnswer": "Temperature는 전체 확률분포의 뾰족함을 조절하고, Top-K는 고정 K개 후보를 남기며, Top-P는 누적 확률 P를 만족하는 후보 집합을 동적으로 선택한다.",
      "rubricKeywords": [
        "Temperature",
        "Top-K",
        "Top-P",
        "누적 확률"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Temperature, Top-K, Top-P, 누적 확률. temperature·top-k·top-p는 후보 선택 범위와 확률 분포에 서로 다른 방식으로 영향을 준다.",
      "hint": "LLM 디코딩에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-medium-es-009",
      "conceptId": "week2-medium-essay-009",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "essay",
      "prompt": "정답이 정해진 태스크와 개방형 생성 태스크의 평가 방법 차이를 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Accuracy",
        "ROUGE",
        "Perplexity",
        "LLM-as-judge"
      ],
      "modelAnswer": "정답이 정해진 문제는 Accuracy처럼 예측과 정답의 일치도를 사용할 수 있다. 개방형 생성은 ROUGE, 임베딩 유사도, PPL, 사람 선호, LLM-as-judge 등 여러 기준을 활용한다.",
      "rubricKeywords": [
        "Accuracy",
        "ROUGE",
        "Perplexity",
        "LLM-as-judge"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Accuracy, ROUGE, Perplexity, LLM-as-judge. 평가 지표마다 문자열·의미·확률·사람의 선호 중 측정하는 대상이 다르며 편향 가능성도 있다.",
      "hint": "LLM 평가에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-medium-es-002",
      "conceptId": "week2-medium-essay-002",
      "difficulty": "medium",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "essay",
      "prompt": "RNN의 gradient vanishing과 LSTM의 해결 아이디어를 연결해 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "gradient vanishing",
        "cell state",
        "gate",
        "장기 의존성"
      ],
      "modelAnswer": "긴 RNN 역전파에서 작은 gradient가 반복 곱해져 초기 정보 학습이 어려워질 수 있다. LSTM은 cell state와 gate를 사용해 필요한 장기 정보를 선택적으로 유지한다.",
      "rubricKeywords": [
        "gradient vanishing",
        "cell state",
        "gate",
        "장기 의존성"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: gradient vanishing, cell state, gate, 장기 의존성. 활성화 함수가 비선형성을 만들고 역전파가 연쇄법칙으로 구한 기울기를 최적화에 전달한다.",
      "hint": "LSTM에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-medium-es-006",
      "conceptId": "week2-medium-essay-006",
      "difficulty": "medium",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "essay",
      "prompt": "RLHF의 세 단계를 순서대로 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "SFT",
        "Reward Model",
        "인간 순위",
        "강화학습"
      ],
      "modelAnswer": "먼저 인간 demonstration으로 SFT를 수행하고, 후보 응답에 대한 인간 순위로 Reward Model을 학습한 뒤, 그 보상 점수를 사용해 정책을 강화학습으로 최적화한다.",
      "rubricKeywords": [
        "SFT",
        "Reward Model",
        "인간 순위",
        "강화학습"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: SFT, Reward Model, 인간 순위, 강화학습. 대규모 사전학습 이후 지시 데이터와 인간 선호를 반영하는 정렬 단계를 순서대로 구분해야 한다.",
      "hint": "선호 학습에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-medium-es-008",
      "conceptId": "week2-medium-essay-008",
      "difficulty": "medium",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "essay",
      "prompt": "Few-shot CoT와 Zero-shot CoT의 차이를 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Few-shot CoT",
        "Zero-shot CoT",
        "추론",
        "예시"
      ],
      "modelAnswer": "Few-shot CoT는 예시 안에 중간 추론 과정을 포함한다. Zero-shot CoT는 예시 없이 단계적으로 생각하라는 지시를 추가해 추론을 유도한다.",
      "rubricKeywords": [
        "Few-shot CoT",
        "Zero-shot CoT",
        "추론",
        "예시"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Few-shot CoT, Zero-shot CoT, 추론, 예시. temperature·top-k·top-p는 후보 선택 범위와 확률 분포에 서로 다른 방식으로 영향을 준다.",
      "hint": "프롬프트 엔지니어링에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-medium-es-010",
      "conceptId": "week2-medium-essay-010",
      "difficulty": "medium",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "essay",
      "prompt": "Self-Instruct의 생성과 필터링 과정을 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Self-Instruct",
        "seed",
        "합성 데이터",
        "필터링"
      ],
      "modelAnswer": "Self-Instruct는 소량의 사람이 만든 seed instruction에서 LLM이 새로운 task와 instance를 합성하고, 이후 중복·유사하거나 무관한 데이터를 제거해 다양하고 유효한 instruction을 남긴다.",
      "rubricKeywords": [
        "Self-Instruct",
        "seed",
        "합성 데이터",
        "필터링"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Self-Instruct, seed, 합성 데이터, 필터링. 평가 지표마다 문자열·의미·확률·사람의 선호 중 측정하는 대상이 다르며 편향 가능성도 있다.",
      "hint": "LLM 응용에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    }
  ],
  "hard": [
    {
      "id": "week2-hard-mc-001",
      "conceptId": "mismatch-cbow-cbow_fast-cell_state-dim_curse-001",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "문장 ‘나는 자연어 처리를 공부한다’에서 중심 단어를 ‘처리를’, window size를 1로 두고 CBOW 학습쌍을 만들 때 입력과 정답은?",
      "options": [
        "입력: 나는·공부한다 / 정답: 자연어",
        "입력: 처리를 / 정답: 자연어·공부한다",
        "입력: 자연어·공부한다 / 정답: 처리를",
        "입력: 문장 전체 / 정답: window size"
      ],
      "answer": 2,
      "explanation": "window size 1에서는 중심 단어 바로 앞뒤인 ‘자연어’와 ‘공부한다’를 입력으로 사용해 중심 단어 ‘처리를’를 예측한다.",
      "hint": "CBOW는 문맥을 입력으로 받고 중심 단어를 정답으로 사용한다."
    },
    {
      "id": "week2-hard-mc-013",
      "conceptId": "combined-attention-attention_softmax-beam-013",
      "difficulty": "hard",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "학습 시에는 정답 이전 토큰을 decoder 입력으로 사용했지만 추론 시에는 모델이 생성한 이전 토큰을 사용한다. 이 차이로 발생할 수 있는 문제는?",
      "options": [
        "데이터 누수",
        "차원의 저주",
        "다중공선성",
        "노출 편향(exposure bias)"
      ],
      "answer": 3,
      "explanation": "Teacher forcing으로 학습하면 모델이 자신의 잘못된 출력을 다음 입력으로 받는 상황을 충분히 경험하지 못해 추론 중 오류가 누적될 수 있다.",
      "hint": "학습 때 본 입력 분포와 실제 생성 때 만나는 입력 분포가 다르다."
    },
    {
      "id": "week2-hard-mc-023",
      "conceptId": "combined-attn_output-cross_attention-decoder_context-023",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "Self-Attention에서 Query와 Key의 내적값이 [2, 0]일 때 softmax 전에 모든 값을 같은 양수로 나누면 attention 분포는 어떻게 변하는가?",
      "options": [
        "두 확률의 차이가 줄어 더 완만해진다.",
        "두 확률의 차이가 커져 더 뾰족해진다.",
        "두 확률이 항상 정확히 0.5가 된다.",
        "Value 벡터의 차원이 자동으로 증가한다."
      ],
      "answer": 0,
      "explanation": "양수로 나누면 logit 차이가 줄어 softmax 분포가 덜 포화되고 더 완만해진다. Scaled Dot-Product Attention이 큰 내적값을 조정하는 이유다.",
      "hint": "softmax에 들어가는 두 점수 사이의 간격이 줄어드는지 확인한다."
    },
    {
      "id": "week2-hard-mc-035",
      "conceptId": "combined-bert-few_shot-icl-035",
      "difficulty": "hard",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "문장 분류에는 BERT, 조건부 요약에는 T5, 왼쪽 문맥 기반 생성에는 GPT를 사용하려 한다. 구조 연결로 옳은 것은?",
      "options": [
        "BERT=decoder-only, T5=encoder-only, GPT=encoder-decoder",
        "BERT=encoder-only, T5=encoder-decoder, GPT=decoder-only",
        "세 모델 모두 encoder-only",
        "세 모델 모두 decoder-only"
      ],
      "answer": 1,
      "explanation": "BERT는 양방향 이해에 강한 encoder-only, T5는 입력을 출력으로 변환하는 encoder-decoder, GPT는 자동회귀 생성용 decoder-only 구조다.",
      "hint": "이해·변환·생성 과제가 각각 어떤 Transformer 블록을 필요로 하는지 대응한다."
    },
    {
      "id": "week2-hard-mc-043",
      "conceptId": "combined-closed-emergent-foundation-043",
      "difficulty": "hard",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "다음 두 판단의 빈칸을 채운 조합은? (가) ChatGPT, Claude, Gemini처럼 내부 가중치가 공개되지 않고 주로 API로 사용하는 모델 유형이다. → [가] / (나) 파운데이션 모델은 대량 데이터로 사전학습되어 여러 다운스트림 작업에 범용적으로 활용된다. → [나]",
      "options": [
        "Closed model / 대규모 데이터",
        "대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델 / Closed model",
        "Closed model / 대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델",
        "Emergent ability / 대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델"
      ],
      "answer": 2,
      "explanation": "[가]는 Closed model, [나]는 대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델이다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-hard-mc-050",
      "conceptId": "combined-alignment-flan-instruction-050",
      "difficulty": "hard",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "InstructGPT 방식의 정렬 절차를 올바른 순서로 나열한 것은?",
      "options": [
        "PPO → 인간 선호 수집 → 사전학습 → SFT",
        "SFT → 사전학습 → PPO → tokenization",
        "Reward Model 학습 → 사전학습 → SFT → 임베딩 제거",
        "사전학습 → SFT → 인간 선호 수집·Reward Model 학습 → PPO 정책 최적화"
      ],
      "answer": 3,
      "explanation": "먼저 사전학습 모델을 지시 데이터로 SFT하고, 후보 응답의 인간 선호로 Reward Model을 학습한 뒤 PPO로 정책을 조정한다.",
      "hint": "기본 언어 능력, 지시 따르기, 선호 점수 학습, 정책 최적화 순서로 본다."
    },
    {
      "id": "week2-hard-mc-056",
      "conceptId": "mismatch-autoregressive-cot-eos-knn_prompt-056",
      "difficulty": "hard",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "temperature를 매우 낮추고 top-k=1로 설정했을 때 생성 결과의 일반적인 특성은?",
      "options": [
        "결정적이고 반복 가능성이 높아진다.",
        "낮은 확률 토큰이 더 자주 선택되어 다양성이 커진다.",
        "모든 토큰이 같은 확률로 선택된다.",
        "모델의 파라미터가 매 토큰마다 다시 학습된다."
      ],
      "answer": 0,
      "explanation": "낮은 temperature는 분포를 뾰족하게 만들고 top-k=1은 최고 확률 토큰 하나만 남기므로 greedy decoding에 가까워진다.",
      "hint": "후보가 하나만 남을 때 무작위 선택의 여지가 있는지 판단한다."
    },
    {
      "id": "week2-hard-mc-065",
      "conceptId": "combined-accuracy-cosine-eval_three-065",
      "difficulty": "hard",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "두 요약문이 의미는 거의 같지만 사용한 단어가 많이 다르다. ROUGE 점수는 낮고 BERTScore는 높게 나올 수 있는 이유는?",
      "options": [
        "ROUGE는 사람 선호만 측정하고 BERTScore는 학습 시간만 측정하기 때문이다.",
        "ROUGE는 표면적인 n-gram 중첩을, BERTScore는 문맥 임베딩 유사도를 주로 보기 때문이다.",
        "두 지표 모두 문자열이 다르면 항상 0이기 때문이다.",
        "BERTScore는 정답 문장을 전혀 사용하지 않기 때문이다."
      ],
      "answer": 1,
      "explanation": "표현이 달라도 의미가 비슷하면 문맥 임베딩 기반 BERTScore는 높을 수 있지만 문자열 중첩 기반 ROUGE는 낮을 수 있다.",
      "hint": "각 지표가 문자열 겹침과 의미 유사성 중 무엇을 비교하는지 구분한다."
    },
    {
      "id": "week2-hard-mc-002",
      "conceptId": "combined-cell_state-distributional-forget_gate-002",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "길이가 긴 문장에서 기본 RNN의 앞부분 정보가 학습되기 어려운 직접적인 원인은?",
      "options": [
        "hidden state가 매 시간 단계마다 정답 label로 교체되기 때문이다.",
        "RNN은 현재 입력을 사용하지 않고 항상 마지막 token만 입력받기 때문이다.",
        "시간 단계마다 같은 가중치가 반복 곱해지며 gradient가 매우 작아지거나 커질 수 있기 때문이다.",
        "RNN에는 학습 가능한 파라미터가 전혀 없기 때문이다."
      ],
      "answer": 2,
      "explanation": "BPTT 과정에서 반복되는 미분값의 곱이 0에 가까워지면 앞 시점까지 gradient가 전달되지 않는 기울기 소실이 발생한다.",
      "hint": "시간축으로 같은 연산의 미분값이 반복해서 곱해지는 상황을 생각한다."
    },
    {
      "id": "week2-hard-mc-014",
      "conceptId": "combined-beam-bleu-decoder-014",
      "difficulty": "hard",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "Beam Search에서 beam size를 1로 설정했을 때의 동작과 가장 가까운 것은?",
      "options": [
        "Masked Language Modeling",
        "Top-p Sampling",
        "Teacher Forcing",
        "Greedy Decoding"
      ],
      "answer": 3,
      "explanation": "beam size가 1이면 매 시점 가장 확률이 높은 하나의 후보만 유지하므로 Greedy Decoding과 동일하게 동작한다.",
      "hint": "각 단계에서 후보를 몇 개 남기는지 확인한다."
    },
    {
      "id": "week2-hard-mc-024",
      "conceptId": "combined-decoder_context-ffn-learned_pos-024",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "Decoder가 세 번째 토큰을 생성할 때 Masked Self-Attention으로 참조할 수 있는 위치는?",
      "options": [
        "첫 번째와 두 번째 토큰 및 현재 위치",
        "네 번째 이후의 미래 토큰만",
        "encoder의 마지막 토큰만",
        "입력과 출력의 모든 미래 위치"
      ],
      "answer": 0,
      "explanation": "causal mask는 현재 위치까지의 토큰만 보게 하고 아직 생성되지 않은 미래 토큰은 attention 대상에서 차단한다.",
      "hint": "자동회귀 생성 시점에 실제로 알려져 있는 토큰만 남긴다."
    },
    {
      "id": "week2-hard-mc-036",
      "conceptId": "mismatch-icl-one_shot-zero_shot-bert-036",
      "difficulty": "hard",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "다음 네 항목의 연결을 검토하시오: 파라미터 업데이트 없이 프롬프트의 지시·예시로 새 작업을 수행, One-shot, Zero-shot, BERT. 선택지 중 설명이 잘못 연결된 한 쌍을 고르시오.",
      "options": [
        "파라미터 업데이트 없이 프롬프트의 지시·예시로 새 작업을 수행 — 모델 가중치를 바꾸지 않고 프롬프트의 instruction과 example을 이용해 새 작업을 수행한다.",
        "BERT — 모델 가중치를 바꾸지 않고 프롬프트의 instruction과 example을 이용해 새 작업을 수행한다.",
        "Zero-shot — 예시 없이 지시만 제공해 작업을 수행하게 하는 설정이다.",
        "One-shot — 하나의 예시를 프롬프트에 제공하는 설정이다."
      ],
      "answer": 1,
      "explanation": "오답 연결은 서로 다른 개념의 정의를 연결한 것이다. BERT의 설명은 해당 항목이 아니다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-hard-mc-044",
      "conceptId": "combined-foundation-foundation_ssl-open_model-044",
      "difficulty": "hard",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델, Self-supervised learning, Open model, Emergent ability의 정의를 비교할 때, 두 항목과 설명이 모두 올바르게 연결된 선택지는?",
      "options": [
        "① Open model: 규모가 일정 임계점을 넘을 때 이전에 뚜렷하지 않던 새로운 능력이 나타나는 현상이다. / ② Emergent ability: LLaMA, Gemma, Qwen처럼 다운로드하여 직접 활용할 수 있는 모델 유형이다.",
        "① 대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델: 데이터 자체에서 학습 신호를 만들어 대규모 원시 데이터로 학습한다. / ② Self-supervised learning: 파운데이션 모델은 대량 데이터로 사전학습되어 여러 다운스트림 작업에 범용적으로 활용된다.",
        "① 대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델: 파운데이션 모델은 대량 데이터로 사전학습되어 여러 다운스트림 작업에 범용적으로 활용된다. / ② Self-supervised learning: 데이터 자체에서 학습 신호를 만들어 대규모 원시 데이터로 학습한다.",
        "① 대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델: LLaMA, Gemma, Qwen처럼 다운로드하여 직접 활용할 수 있는 모델 유형이다. / ② Self-supervised learning: 규모가 일정 임계점을 넘을 때 이전에 뚜렷하지 않던 새로운 능력이 나타나는 현상이다."
      ],
      "answer": 2,
      "explanation": "대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델과 Self-supervised learning의 설명이 각각 정확하게 연결된 선택지만 정답이다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-hard-mc-051",
      "conceptId": "mismatch-instruction-preference-sft-alignment-051",
      "difficulty": "hard",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "다음 네 항목의 연결을 검토하시오: Instruction tuning, Preference learning, Supervised Fine-Tuning (SFT), 사용자 지시와 선호에 맞는 출력. 선택지 중 설명이 잘못 연결된 한 쌍을 고르시오.",
      "options": [
        "Supervised Fine-Tuning (SFT) — 사람이 작성한 입력-응답 데이터를 이용해 지도학습으로 모델을 조정하는 단계다.",
        "Instruction tuning — 여러 작업을 자연어 지시와 응답 형태로 구성해 지도학습으로 모델을 조정한다.",
        "Preference learning — 여러 가능한 응답 중 사람이 더 선호하는 응답을 학습하는 방법이다.",
        "사용자 지시와 선호에 맞는 출력 — 여러 작업을 자연어 지시와 응답 형태로 구성해 지도학습으로 모델을 조정한다."
      ],
      "answer": 3,
      "explanation": "오답 연결은 서로 다른 개념의 정의를 연결한 것이다. 사용자 지시와 선호에 맞는 출력의 설명은 해당 항목이 아니다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-hard-mc-057",
      "conceptId": "combined-eos-prompt_eng-temperature_high-057",
      "difficulty": "hard",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다음 토큰 확률이 A=0.50, B=0.25, C=0.15, D=0.10일 때 top-p=0.70이 선택 후보로 남기는 최소 집합은?",
      "options": [
        "A와 B",
        "A만",
        "A·B·C",
        "A·B·C·D"
      ],
      "answer": 0,
      "explanation": "확률이 큰 순서로 누적하면 A만으로는 0.50이고 A+B는 0.75이므로 처음으로 0.70 이상이 되는 A와 B를 남긴다.",
      "hint": "확률이 큰 토큰부터 더해 누적확률이 p를 처음 넘는 지점에서 멈춘다."
    },
    {
      "id": "week2-hard-mc-066",
      "conceptId": "mismatch-eval_three-length_bias-mmlu-ppl-066",
      "difficulty": "hard",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "다음 네 항목의 연결을 검토하시오: 목표·평가 방법·평가 지표, 길이 편향, MMLU, Perplexity (PPL). 선택지 중 설명이 잘못 연결된 한 쌍을 고르시오.",
      "options": [
        "MMLU — 57개의 다양한 전문 분야 객관식 문제로 구성된 벤치마크로 소개된다.",
        "Perplexity (PPL) — 평가 설계의 세 요소로 목표, 평가 방법, 평가 지표가 제시된다.",
        "목표·평가 방법·평가 지표 — 평가 설계의 세 요소로 목표, 평가 방법, 평가 지표가 제시된다.",
        "길이 편향 — 품질과 무관하게 길이가 긴 응답을 상대적으로 선호할 수 있는 평가 편향이다."
      ],
      "answer": 1,
      "explanation": "오답 연결은 서로 다른 개념의 정의를 연결한 것이다. Perplexity (PPL)의 설명은 해당 항목이 아니다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-hard-mc-003",
      "conceptId": "combined-distributional-forget_gate-lstm-003",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "LSTM에서 이전 cell state의 정보를 얼마나 유지할지 직접 조절하는 gate는?",
      "options": [
        "Input gate",
        "Output gate",
        "Forget gate",
        "Softmax gate"
      ],
      "answer": 2,
      "explanation": "Forget gate는 이전 cell state의 각 정보를 0에 가깝게 버릴지 1에 가깝게 유지할지 결정한다.",
      "hint": "이전 장기 기억을 지우거나 남기는 역할을 찾는다."
    },
    {
      "id": "week2-hard-mc-015",
      "conceptId": "combined-bleu-decoder-greedy_limit-015",
      "difficulty": "hard",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "세 설명을 모두 판별하시오. ① 기계번역 결과와 사람 번역의 유사도를 평가하는 지표로 소개된다. ② encoder 표현을 조건으로 출력 시퀀스를 한 단계씩 생성한다. ③ Greedy decoding은 이전 선택을 되돌아보지 않아 초기 오류가 이후 생성에 영향을 줄 수 있다. 각각에 해당하는 개념의 순서로 옳은 것은?",
      "options": [
        "초기 선택 오류를 되돌리기 어렵다 / Decoder / BLEU",
        "BLEU / 초기 선택 오류를 되돌리기 어렵다 / Decoder",
        "Decoder / BLEU / 초기 선택 오류를 되돌리기 어렵다",
        "BLEU / Decoder / 초기 선택 오류를 되돌리기 어렵다"
      ],
      "answer": 3,
      "explanation": "①은 BLEU, ②는 Decoder, ③은 초기 선택 오류를 되돌리기 어렵다는 한계다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-hard-mc-025",
      "conceptId": "combined-ffn-learned_pos-positional-025",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "세 설명을 모두 판별하시오. ① Self-Attention 뒤의 Feed-Forward Network가 각 위치 표현에 비선형 변환을 적용해 표현력을 높인다. ② 각 위치 벡터 자체를 학습 파라미터로 두고 최적화한다. ③ Self-Attention에 없는 토큰 위치·순서 정보를 임베딩에 더해 준다. 각각에 해당하는 개념의 순서로 옳은 것은?",
      "options": [
        "비선형 표현 확장 / Learned Absolute Position Embedding / Positional Encoding",
        "비선형 표현 확장 / Positional Encoding / Learned Absolute Position Embedding",
        "Positional Encoding / Learned Absolute Position Embedding / 비선형 표현 확장",
        "Learned Absolute Position Embedding / 비선형 표현 확장 / Positional Encoding"
      ],
      "answer": 0,
      "explanation": "①은 비선형 표현 확장, ②는 Learned Absolute Position Embedding, ③은 Positional Encoding이다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-hard-mc-037",
      "conceptId": "combined-one_shot-zero_shot-few_shot-037",
      "difficulty": "hard",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "두 상황을 동시에 만족하는 개념 조합을 고르시오. 상황 A: 하나의 예시를 프롬프트에 제공하는 설정이다. 상황 B: 예시 없이 지시만 제공해 작업을 수행하게 하는 설정이다.",
      "options": [
        "Zero-shot + One-shot",
        "One-shot + Zero-shot",
        "One-shot + BERT",
        "Few-shot + Zero-shot"
      ],
      "answer": 1,
      "explanation": "상황 A는 One-shot, 상황 B는 Zero-shot를 가리킨다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-hard-mc-045",
      "conceptId": "combined-foundation_ssl-open_model-foundation_data-045",
      "difficulty": "hard",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "세 설명을 모두 판별하시오. ① 데이터 자체에서 학습 신호를 만들어 대규모 원시 데이터로 학습한다. ② LLaMA, Gemma, Qwen처럼 다운로드하여 직접 활용할 수 있는 모델 유형이다. ③ 파운데이션 모델의 핵심 구성 요소로 대규모 데이터를 제시한다. 각각에 해당하는 개념의 순서로 옳은 것은?",
      "options": [
        "Open model / Self-supervised learning / 대규모 데이터",
        "Self-supervised learning / 대규모 데이터 / Open model",
        "Self-supervised learning / Open model / 대규모 데이터",
        "대규모 데이터 / Open model / Self-supervised learning"
      ],
      "answer": 2,
      "explanation": "①은 Self-supervised learning, ②는 Open model, ③은 대규모 데이터이다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-hard-mc-052",
      "conceptId": "combined-preference-sft-flan-052",
      "difficulty": "hard",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "두 상황을 동시에 만족하는 개념 조합을 고르시오. 상황 A: 여러 가능한 응답 중 사람이 더 선호하는 응답을 학습하는 방법이다. 상황 B: 사람이 작성한 입력-응답 데이터를 이용해 지도학습으로 모델을 조정하는 단계다.",
      "options": [
        "Preference learning + 사용자 지시와 선호에 맞는 출력",
        "Supervised Fine-Tuning (SFT) + Preference learning",
        "FLAN + Supervised Fine-Tuning (SFT)",
        "Preference learning + Supervised Fine-Tuning (SFT)"
      ],
      "answer": 3,
      "explanation": "상황 A는 Preference learning, 상황 B는 Supervised Fine-Tuning (SFT)를 가리킨다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-hard-mc-058",
      "conceptId": "combined-prompt_eng-temperature_high-zero_cot-058",
      "difficulty": "hard",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다음 두 판단의 빈칸을 채운 조합은? (가) 원하는 출력을 얻도록 지시와 예시를 설계·조정하는 과정이다. → [가] / (나) 예시 없이 단계적으로 생각하라는 문구를 추가해 추론을 유도하는 방식이다. → [나]",
      "options": [
        "프롬프트 엔지니어링 / Zero-shot CoT",
        "프롬프트 엔지니어링 / Autoregressive generation",
        "높은 temperature / Zero-shot CoT",
        "Zero-shot CoT / 프롬프트 엔지니어링"
      ],
      "answer": 0,
      "explanation": "[가]는 프롬프트 엔지니어링, [나]는 Zero-shot CoT이다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-hard-mc-067",
      "conceptId": "combined-length_bias-mmlu-rouge_value-067",
      "difficulty": "hard",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "두 상황을 동시에 만족하는 개념 조합을 고르시오. 상황 A: 품질과 무관하게 길이가 긴 응답을 상대적으로 선호할 수 있는 평가 편향이다. 상황 B: 57개의 다양한 전문 분야 객관식 문제로 구성된 벤치마크로 소개된다.",
      "options": [
        "길이 편향 + 52,000개",
        "길이 편향 + MMLU",
        "MMLU + 길이 편향",
        "0.83 + MMLU"
      ],
      "answer": 1,
      "explanation": "상황 A는 길이 편향, 상황 B는 MMLU를 가리킨다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-hard-mc-004",
      "conceptId": "combined-embedding_similarity-input_gate-onehot-004",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "가까운 벡터, Input gate, One-hot encoding, 순차 연산 때문에 병렬화가 어렵다의 정의를 비교할 때, 두 항목과 설명이 모두 올바르게 연결된 선택지는?",
      "options": [
        "① One-hot encoding: RNN은 이전 시점 결과에 의존하므로 시퀀스 위치를 한꺼번에 계산하기 어렵다. / ② 순차 연산 때문에 병렬화가 어렵다: 어휘 집합에서 한 위치만 1이고 나머지는 0인 벡터로 단어를 표현한다.",
        "① 가까운 벡터: 새로운 후보 정보를 cell state에 얼마나 기록할지 조절한다. / ② Input gate: 의미가 비슷한 단어는 임베딩 공간에서 가까운 위치에 놓이도록 학습할 수 있다.",
        "① 가까운 벡터: 의미가 비슷한 단어는 임베딩 공간에서 가까운 위치에 놓이도록 학습할 수 있다. / ② Input gate: 새로운 후보 정보를 cell state에 얼마나 기록할지 조절한다.",
        "① 가까운 벡터: 어휘 집합에서 한 위치만 1이고 나머지는 0인 벡터로 단어를 표현한다. / ② Input gate: RNN은 이전 시점 결과에 의존하므로 시퀀스 위치를 한꺼번에 계산하기 어렵다."
      ],
      "answer": 2,
      "explanation": "가까운 벡터과 Input gate의 설명이 각각 정확하게 연결된 선택지만 정답이다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-hard-mc-016",
      "conceptId": "mismatch-context_vector-fourgram-seq2seq_year-beam-016",
      "difficulty": "hard",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "다음 네 항목의 연결을 검토하시오: Value들의 가중합, 0.4, 2014년, Beam search. 선택지 중 설명이 잘못 연결된 한 쌍을 고르시오.",
      "options": [
        "Value들의 가중합 — Attention context vector는 attention weight로 Value들을 가중합하여 계산한다.",
        "0.4 — 예시에서 'students opened their'가 1000번, 뒤에 'books'가 400번이면 확률은 400/1000=0.4다.",
        "2014년 — Seq2Seq가 2014년에 소개된 대표적 신경망 기반 시퀀스 변환 구조라고 설명한다.",
        "Beam search — Attention context vector는 attention weight로 Value들을 가중합하여 계산한다."
      ],
      "answer": 3,
      "explanation": "오답 연결은 서로 다른 개념의 정의를 연결한 것이다. Beam search의 설명은 해당 항목이 아니다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-hard-mc-026",
      "conceptId": "mismatch-layernorm-multihead-scaled_reason-transformer_year-026",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 네 항목의 연결을 검토하시오: Layer Normalization, 여러 관점의 관계를 동시에 포착, softmax가 지나치게 뾰족해지는 것을 완화, 2017년. 선택지 중 설명이 잘못 연결된 한 쌍을 고르시오.",
      "options": [
        "2017년 — 각 레이어의 hidden vector 값을 정규화해 안정적이고 빠른 학습을 돕는다.",
        "softmax가 지나치게 뾰족해지는 것을 완화 — Q/K 차원이 커지면 내적값이 커져 softmax가 과도하게 뾰족해질 수 있어 스케일링한다.",
        "Layer Normalization — 각 레이어의 hidden vector 값을 정규화해 안정적이고 빠른 학습을 돕는다.",
        "여러 관점의 관계를 동시에 포착 — 여러 attention head가 문법적·의미적 관계 등 서로 다른 관점을 병렬로 학습한다."
      ],
      "answer": 0,
      "explanation": "오답 연결은 서로 다른 개념의 정의를 연결한 것이다. 2017년의 설명은 해당 항목이 아니다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-hard-mc-038",
      "conceptId": "combined-pretraining-icl-few_shot-038",
      "difficulty": "hard",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "다음 두 판단의 빈칸을 채운 조합은? (가) 사전학습은 대규모 데이터로 모델이 일반적인 특징과 표현을 먼저 학습하게 한다. → [가] / (나) 소수의 입력-출력 예시를 프롬프트에 제공하는 설정이다. → [나]",
      "options": [
        "파라미터 업데이트 없이 프롬프트의 지시·예시로 새 작업을 수행 / Few-shot",
        "대규모 데이터로 일반적 표현과 패턴을 먼저 학습 / Few-shot",
        "대규모 데이터로 일반적 표현과 패턴을 먼저 학습 / BERT",
        "Few-shot / 대규모 데이터로 일반적 표현과 패턴을 먼저 학습"
      ],
      "answer": 1,
      "explanation": "[가]는 대규모 데이터로 일반적 표현과 패턴을 먼저 학습, [나]는 Few-shot이다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-hard-mc-046",
      "conceptId": "mismatch-llm_pretrain-emergent-scaling-closed-046",
      "difficulty": "hard",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "다음 네 항목의 연결을 검토하시오: 다음 토큰 예측, Emergent ability, Scaling law, Closed model. 선택지 중 설명이 잘못 연결된 한 쌍을 고르시오.",
      "options": [
        "Scaling law — 모델 크기·데이터·연산량을 늘릴수록 손실이 감소하고 성능이 향상되는 경향을 설명한다.",
        "다음 토큰 예측 — 거대 언어 모델의 대표적 사전학습 목표는 대규모 텍스트에서 다음 토큰을 예측하는 것이다.",
        "Closed model — 거대 언어 모델의 대표적 사전학습 목표는 대규모 텍스트에서 다음 토큰을 예측하는 것이다.",
        "Emergent ability — 규모가 일정 임계점을 넘을 때 이전에 뚜렷하지 않던 새로운 능력이 나타나는 현상이다."
      ],
      "answer": 2,
      "explanation": "오답 연결은 서로 다른 개념의 정의를 연결한 것이다. Closed model의 설명은 해당 항목이 아니다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-hard-mc-053",
      "conceptId": "combined-rlhf-instruction-flan-053",
      "difficulty": "hard",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "다음 두 판단의 빈칸을 채운 조합은? (가) 인간 피드백을 이용해 모델의 응답 선호를 반영하는 강화학습 기반 정렬 방법이다. → [가] / (나) 다양한 태스크를 여러 자연어 instruction 템플릿으로 변환해 학습한 instruction tuning 사례다. → [나]",
      "options": [
        "FLAN / RLHF",
        "Instruction tuning / FLAN",
        "RLHF / 사용자 지시와 선호에 맞는 출력",
        "RLHF / FLAN"
      ],
      "answer": 3,
      "explanation": "[가]는 RLHF, [나]는 FLAN이다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-hard-mc-059",
      "conceptId": "combined-system_prompt-topp-prompt_eng-059",
      "difficulty": "hard",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "System prompt, Top-P (Nucleus) sampling, 프롬프트 엔지니어링, User query의 정의를 비교할 때, 두 항목과 설명이 모두 올바르게 연결된 선택지는?",
      "options": [
        "① System prompt: 모델의 기본 역할, 행동 지침, 스타일 같은 상위 수준 지시를 제공한다. / ② Top-P (Nucleus) sampling: 누적 확률이 P에 도달하는 최소 상위 토큰 집합을 동적으로 선택해 샘플링한다.",
        "① System prompt: 원하는 출력을 얻도록 지시와 예시를 설계·조정하는 과정이다. / ② Top-P (Nucleus) sampling: 사용자가 실제로 모델에게 해결해 달라고 요청하는 질문이나 작업 지시다.",
        "① System prompt: 누적 확률이 P에 도달하는 최소 상위 토큰 집합을 동적으로 선택해 샘플링한다. / ② Top-P (Nucleus) sampling: 모델의 기본 역할, 행동 지침, 스타일 같은 상위 수준 지시를 제공한다.",
        "① 프롬프트 엔지니어링: 사용자가 실제로 모델에게 해결해 달라고 요청하는 질문이나 작업 지시다. / ② User query: 원하는 출력을 얻도록 지시와 예시를 설계·조정하는 과정이다."
      ],
      "answer": 0,
      "explanation": "System prompt과 Top-P (Nucleus) sampling의 설명이 각각 정확하게 연결된 선택지만 정답이다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-hard-mc-068",
      "conceptId": "combined-lmarena-ppl-synth52000-068",
      "difficulty": "hard",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "다음 두 판단의 빈칸을 채운 조합은? (가) 실제 사용자 피드백으로 모델 응답의 상대적 선호를 평가하는 대표 사례다. → [가] / (나) Self-Instruct 사례는 GPT-3를 이용해 약 52,000개의 합성 데이터를 생성했다고 설명한다. → [나]",
      "options": [
        "52,000개 / LMArena",
        "LMArena / 52,000개",
        "Perplexity (PPL) / 52,000개",
        "LMArena / 길이 편향"
      ],
      "answer": 1,
      "explanation": "[가]는 LMArena, [나]는 52,000개이다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-hard-mc-005",
      "conceptId": "combined-gate_range-lstm_year-rnn-005",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "세 설명을 모두 판별하시오. ① LSTM의 sigmoid gate 출력은 0과 1 사이 값으로 정보 통과 비율을 조절한다. ② LSTM이 1997년에 제안되었다고 설명한다. ③ 이전 시점의 hidden state를 다음 시점으로 전달해 순차적 문맥을 반영하는 신경망이다. 각각에 해당하는 개념의 순서로 옳은 것은?",
      "options": [
        "1997년 / 0과 1 사이 / RNN",
        "0과 1 사이 / RNN / 1997년",
        "0과 1 사이 / 1997년 / RNN",
        "RNN / 1997년 / 0과 1 사이"
      ],
      "answer": 2,
      "explanation": "①은 0과 1 사이, ②는 1997년, ③은 RNN이다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-hard-mc-017",
      "conceptId": "combined-encoder-lm_next-attention-017",
      "difficulty": "hard",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "두 상황을 동시에 만족하는 개념 조합을 고르시오. 상황 A: 입력 시퀀스를 읽어 의미 정보를 담은 표현으로 변환한다. 상황 B: 언어 모델은 주어진 문맥에서 다음 단어가 나올 확률분포를 모델링한다.",
      "options": [
        "다음 단어의 확률분포 + Encoder",
        "관련 있는 입력 위치를 선택적으로 참조 + 다음 단어의 확률분포",
        "Encoder + End-to-End 학습",
        "Encoder + 다음 단어의 확률분포"
      ],
      "answer": 3,
      "explanation": "상황 A는 Encoder, 상황 B는 다음 단어의 확률분포를 가리킨다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-hard-mc-027",
      "conceptId": "combined-masked-qkv-sinusoidal-027",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "두 상황을 동시에 만족하는 개념 조합을 고르시오. 상황 A: 언어 생성 시 현재 위치가 미래 토큰을 보지 못하도록 차단한다. 상황 B: 각 입력 단어 표현은 서로 다른 학습 행렬을 통해 Query, Key, Value로 변환된다.",
      "options": [
        "Masked Self-Attention + Q, K, V",
        "Masked Self-Attention + Key",
        "Q, K, V + Masked Self-Attention",
        "Sinusoidal Position Encoding + Q, K, V"
      ],
      "answer": 0,
      "explanation": "상황 A는 Masked Self-Attention, 상황 B는 Q, K, V를 가리킨다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-hard-mc-039",
      "conceptId": "combined-bert-pretrain_finetune-pretraining-039",
      "difficulty": "hard",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "BERT, 사전학습 후 파인튜닝, 대규모 데이터로 일반적 표현과 패턴을 먼저 학습, Zero-shot의 정의를 비교할 때, 두 항목과 설명이 모두 올바르게 연결된 선택지는?",
      "options": [
        "① BERT: 사전학습은 대규모 데이터로 모델이 일반적인 특징과 표현을 먼저 학습하게 한다. / ② 사전학습 후 파인튜닝: 예시 없이 지시만 제공해 작업을 수행하게 하는 설정이다.",
        "① BERT: Transformer encoder 기반이며 Masked LM으로 사전학습하는 대표 모델이다. / ② 사전학습 후 파인튜닝: 사전학습 파라미터를 초기값으로 사용한 뒤 다운스트림 태스크에 맞게 조정하는 패러다임이다.",
        "① BERT: 사전학습 파라미터를 초기값으로 사용한 뒤 다운스트림 태스크에 맞게 조정하는 패러다임이다. / ② 사전학습 후 파인튜닝: Transformer encoder 기반이며 Masked LM으로 사전학습하는 대표 모델이다.",
        "① 대규모 데이터로 일반적 표현과 패턴을 먼저 학습: 예시 없이 지시만 제공해 작업을 수행하게 하는 설정이다. / ② Zero-shot: 사전학습은 대규모 데이터로 모델이 일반적인 특징과 표현을 먼저 학습하게 한다."
      ],
      "answer": 1,
      "explanation": "BERT과 사전학습 후 파인튜닝의 설명이 각각 정확하게 연결된 선택지만 정답이다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-hard-mc-047",
      "conceptId": "combined-scaling-foundation_ssl-closed-047",
      "difficulty": "hard",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "두 상황을 동시에 만족하는 개념 조합을 고르시오. 상황 A: 모델 크기·데이터·연산량을 늘릴수록 손실이 감소하고 성능이 향상되는 경향을 설명한다. 상황 B: 데이터 자체에서 학습 신호를 만들어 대규모 원시 데이터로 학습한다.",
      "options": [
        "Scaling law + Emergent ability",
        "Self-supervised learning + Scaling law",
        "Scaling law + Self-supervised learning",
        "Closed model + Self-supervised learning"
      ],
      "answer": 2,
      "explanation": "상황 A는 Scaling law, 상황 B는 Self-supervised learning를 가리킨다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-hard-mc-054",
      "conceptId": "combined-alignment-reward_model-rlhf-054",
      "difficulty": "hard",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "사용자 지시와 선호에 맞는 출력, Reward Model, RLHF, Supervised Fine-Tuning (SFT)의 정의를 비교할 때, 두 항목과 설명이 모두 올바르게 연결된 선택지는?",
      "options": [
        "① RLHF: 사람이 작성한 입력-응답 데이터를 이용해 지도학습으로 모델을 조정하는 단계다. / ② Supervised Fine-Tuning (SFT): 인간 피드백을 이용해 모델의 응답 선호를 반영하는 강화학습 기반 정렬 방법이다.",
        "① 사용자 지시와 선호에 맞는 출력: 인간 피드백을 이용해 모델의 응답 선호를 반영하는 강화학습 기반 정렬 방법이다. / ② Reward Model: 사람이 작성한 입력-응답 데이터를 이용해 지도학습으로 모델을 조정하는 단계다.",
        "① 사용자 지시와 선호에 맞는 출력: 후보 응답에 대한 인간 선호를 점수로 근사하는 모델이다. / ② Reward Model: 다음 토큰 예측만으로는 지시 준수와 선호를 보장하기 어려워 alignment가 필요하다.",
        "① 사용자 지시와 선호에 맞는 출력: 다음 토큰 예측만으로는 지시 준수와 선호를 보장하기 어려워 alignment가 필요하다. / ② Reward Model: 후보 응답에 대한 인간 선호를 점수로 근사하는 모델이다."
      ],
      "answer": 3,
      "explanation": "사용자 지시와 선호에 맞는 출력과 Reward Model의 설명이 각각 정확하게 연결된 선택지만 정답이다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-hard-mc-060",
      "conceptId": "combined-temperature_low-autoregressive-topk-060",
      "difficulty": "hard",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "세 설명을 모두 판별하시오. ① Temperature가 낮아지면 분포가 더 뾰족해져 높은 확률 토큰에 선택이 집중된다. ② 지금까지 생성한 토큰을 조건으로 다음 토큰을 하나씩 순차 생성한다. ③ 확률이 높은 K개의 토큰만 후보로 남긴 뒤 그 안에서 샘플링한다. 각각에 해당하는 개념의 순서로 옳은 것은?",
      "options": [
        "낮은 temperature / Autoregressive generation / Top-K",
        "Autoregressive generation / 낮은 temperature / Top-K",
        "낮은 temperature / Top-K / Autoregressive generation",
        "Top-K / Autoregressive generation / 낮은 temperature"
      ],
      "answer": 0,
      "explanation": "①은 낮은 temperature, ②는 Autoregressive generation, ③은 Top-K이다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-hard-mc-069",
      "conceptId": "combined-multimodal-seed175-eval_three-069",
      "difficulty": "hard",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "멀티모달 파운데이션 모델, 175개, 목표·평가 방법·평가 지표, ROUGE의 정의를 비교할 때, 두 항목과 설명이 모두 올바르게 연결된 선택지는?",
      "options": [
        "① 멀티모달 파운데이션 모델: Self-Instruct 사례는 사람이 작성한 175개의 seed 데이터에서 시작한다. / ② 175개: 텍스트뿐 아니라 이미지·비디오·오디오 등 여러 모달리티를 입력·출력으로 다룬다.",
        "① 멀티모달 파운데이션 모델: 텍스트뿐 아니라 이미지·비디오·오디오 등 여러 모달리티를 입력·출력으로 다룬다. / ② 175개: Self-Instruct 사례는 사람이 작성한 175개의 seed 데이터에서 시작한다.",
        "① 멀티모달 파운데이션 모델: 평가 설계의 세 요소로 목표, 평가 방법, 평가 지표가 제시된다. / ② 175개: 참조 답안과 생성 문장 사이 단어 수준 중첩을 이용한 유사도 평가 지표다.",
        "① 목표·평가 방법·평가 지표: 참조 답안과 생성 문장 사이 단어 수준 중첩을 이용한 유사도 평가 지표다. / ② ROUGE: 평가 설계의 세 요소로 목표, 평가 방법, 평가 지표가 제시된다."
      ],
      "answer": 1,
      "explanation": "멀티모달 파운데이션 모델과 175개의 설명이 각각 정확하게 연결된 선택지만 정답이다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-hard-mc-006",
      "conceptId": "mismatch-input_gate-one_many-seq_variable-distributional-006",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 네 항목의 연결을 검토하시오: Input gate, One-to-Many, 가변 길이, 분포 가설. 선택지 중 설명이 잘못 연결된 한 쌍을 고르시오.",
      "options": [
        "가변 길이 — 자연어 문장은 서로 다른 길이를 가질 수 있으므로 순차 모델은 가변 길이 입력을 다룬다.",
        "Input gate — 새로운 후보 정보를 cell state에 얼마나 기록할지 조절한다.",
        "분포 가설 — 새로운 후보 정보를 cell state에 얼마나 기록할지 조절한다.",
        "One-to-Many — 하나의 입력에서 여러 시점의 출력을 생성하는 구조다."
      ],
      "answer": 2,
      "explanation": "오답 연결은 서로 다른 개념의 정의를 연결한 것이다. 분포 가설의 설명은 해당 항목이 아니다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-hard-mc-018",
      "conceptId": "combined-fourgram-sentence_prob-bottleneck-018",
      "difficulty": "hard",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "다음 두 판단의 빈칸을 채운 조합은? (가) 예시에서 'students opened their'가 1000번, 뒤에 'books'가 400번이면 확률은 400/1000=0.4다. → [가] / (나) 기본 Seq2Seq는 입력 전체를 하나의 고정 길이 벡터에 압축해 긴 입력에서 정보 손실이 생길 수 있다. → [나]",
      "options": [
        "조건부 확률의 곱 / 고정 길이 벡터에 전체 입력을 압축",
        "0.4 / 관련 있는 입력 위치를 선택적으로 참조",
        "고정 길이 벡터에 전체 입력을 압축 / 0.4",
        "0.4 / 고정 길이 벡터에 전체 입력을 압축"
      ],
      "answer": 3,
      "explanation": "[가]는 0.4, [나]는 고정 길이 벡터에 전체 입력을 압축이다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-hard-mc-028",
      "conceptId": "combined-multihead-scaled-cross_attention-028",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 두 판단의 빈칸을 채운 조합은? (가) 여러 attention head가 문법적·의미적 관계 등 서로 다른 관점을 병렬로 학습한다. → [가] / (나) Encoder-Decoder Transformer의 Cross-Attention에서 Q는 decoder, K/V는 encoder 출력에서 온다. → [나]",
      "options": [
        "여러 관점의 관계를 동시에 포착 / Query는 decoder, Key와 Value는 encoder",
        "Query는 decoder, Key와 Value는 encoder / 여러 관점의 관계를 동시에 포착",
        "Scaled Dot-Product Attention / Query는 decoder, Key와 Value는 encoder",
        "여러 관점의 관계를 동시에 포착 / Positional Encoding"
      ],
      "answer": 0,
      "explanation": "[가]는 여러 관점의 관계를 동시에 포착, [나]는 Query는 decoder, Key와 Value는 encoder이다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-hard-mc-040",
      "conceptId": "combined-icl-bert-mlm-040",
      "difficulty": "hard",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "세 설명을 모두 판별하시오. ① 모델 가중치를 바꾸지 않고 프롬프트의 instruction과 example을 이용해 새 작업을 수행한다. ② Transformer encoder 기반이며 Masked LM으로 사전학습하는 대표 모델이다. ③ 일부 입력 토큰을 [MASK]로 바꾸고 원래 단어를 예측하는 사전학습 목표다. 각각에 해당하는 개념의 순서로 옳은 것은?",
      "options": [
        "BERT / 파라미터 업데이트 없이 프롬프트의 지시·예시로 새 작업을 수행 / Masked Language Model",
        "파라미터 업데이트 없이 프롬프트의 지시·예시로 새 작업을 수행 / BERT / Masked Language Model",
        "파라미터 업데이트 없이 프롬프트의 지시·예시로 새 작업을 수행 / Masked Language Model / BERT",
        "Masked Language Model / BERT / 파라미터 업데이트 없이 프롬프트의 지시·예시로 새 작업을 수행"
      ],
      "answer": 1,
      "explanation": "①은 파라미터 업데이트 없이 프롬프트의 지시·예시로 새 작업을 수행, ②는 BERT, ③은 Masked Language Model이다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-hard-mc-048",
      "conceptId": "combined-emergent-open_model-closed-048",
      "difficulty": "hard",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "다음 두 판단의 빈칸을 채운 조합은? (가) 규모가 일정 임계점을 넘을 때 이전에 뚜렷하지 않던 새로운 능력이 나타나는 현상이다. → [가] / (나) ChatGPT, Claude, Gemini처럼 내부 가중치가 공개되지 않고 주로 API로 사용하는 모델 유형이다. → [나]",
      "options": [
        "Open model / Closed model",
        "Closed model / Emergent ability",
        "Emergent ability / Closed model",
        "Emergent ability / 대량 데이터로 사전학습되어 다양한 작업의 기반이 되는 대규모 모델"
      ],
      "answer": 2,
      "explanation": "[가]는 Emergent ability, [나]는 Closed model이다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-hard-mc-055",
      "conceptId": "combined-instruction-alignment-ppo-055",
      "difficulty": "hard",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "multiple-choice",
      "prompt": "세 설명을 모두 판별하시오. ① 여러 작업을 자연어 지시와 응답 형태로 구성해 지도학습으로 모델을 조정한다. ② 다음 토큰 예측만으로는 지시 준수와 선호를 보장하기 어려워 alignment가 필요하다. ③ InstructGPT의 RLHF 정책 최적화에 사용된 알고리즘으로 PPO를 제시한다. 각각에 해당하는 개념의 순서로 옳은 것은?",
      "options": [
        "PPO / 사용자 지시와 선호에 맞는 출력 / Instruction tuning",
        "Instruction tuning / PPO / 사용자 지시와 선호에 맞는 출력",
        "사용자 지시와 선호에 맞는 출력 / Instruction tuning / PPO",
        "Instruction tuning / 사용자 지시와 선호에 맞는 출력 / PPO"
      ],
      "answer": 3,
      "explanation": "①은 Instruction tuning, ②는 사용자 지시와 선호에 맞는 출력, ③은 PPO이다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-hard-mc-061",
      "conceptId": "mismatch-topp-knn_prompt-cot-zero_cot-061",
      "difficulty": "hard",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다음 네 항목의 연결을 검토하시오: Top-P (Nucleus) sampling, kNN 기반 예시 선택, Chain-of-Thought (CoT) prompting, Zero-shot CoT. 선택지 중 설명이 잘못 연결된 한 쌍을 고르시오.",
      "options": [
        "Zero-shot CoT — 누적 확률이 P에 도달하는 최소 상위 토큰 집합을 동적으로 선택해 샘플링한다.",
        "Chain-of-Thought (CoT) prompting — 예시에 최종 답뿐 아니라 중간 추론 과정을 함께 보여 주어 복합 추론을 유도한다.",
        "kNN 기반 예시 선택 — 테스트 쿼리와 임베딩 거리가 가까운 학습 예시를 골라 few-shot 문맥으로 제공한다.",
        "Top-P (Nucleus) sampling — 누적 확률이 P에 도달하는 최소 상위 토큰 집합을 동적으로 선택해 샘플링한다."
      ],
      "answer": 0,
      "explanation": "오답 연결은 서로 다른 개념의 정의를 연결한 것이다. Zero-shot CoT의 설명은 해당 항목이 아니다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-hard-mc-070",
      "conceptId": "combined-ppl-self_instruct-mmlu-070",
      "difficulty": "hard",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "세 설명을 모두 판별하시오. ① 언어 모델이 문장을 얼마나 확률적으로 자연스럽게 예측하는지 나타내는 지표다. ② 소량의 사람이 만든 seed instruction을 바탕으로 LLM이 대규모 합성 지시 데이터를 생성해 확장하는 방법이다. ③ 57개의 다양한 전문 분야 객관식 문제로 구성된 벤치마크로 소개된다. 각각에 해당하는 개념의 순서로 옳은 것은?",
      "options": [
        "Perplexity (PPL) / MMLU / Self-Instruct",
        "Perplexity (PPL) / Self-Instruct / MMLU",
        "MMLU / Self-Instruct / Perplexity (PPL)",
        "Self-Instruct / Perplexity (PPL) / MMLU"
      ],
      "answer": 1,
      "explanation": "①은 Perplexity (PPL), ②는 Self-Instruct, ③은 MMLU이다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-hard-mc-007",
      "conceptId": "combined-lstm-onehot_limit-word2vec-007",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "두 상황을 동시에 만족하는 개념 조합을 고르시오. 상황 A: 기본 RNN의 장기 의존성과 기울기 소실 문제를 완화하기 위해 설계된 순환 신경망이다. 상황 B: 서로 다른 One-hot 벡터는 직교하므로 단어 간 의미 유사도를 직접 표현하기 어렵다.",
      "options": [
        "LSTM + 장기 의존성",
        "단어 간 의미 유사도를 표현하기 어렵다 + LSTM",
        "LSTM + 단어 간 의미 유사도를 표현하기 어렵다",
        "Word2Vec + 단어 간 의미 유사도를 표현하기 어렵다"
      ],
      "answer": 2,
      "explanation": "상황 A는 LSTM, 상황 B는 단어 간 의미 유사도를 표현하기 어렵다를 가리킨다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-hard-mc-019",
      "conceptId": "combined-greedy_limit-smt_goal-fourgram-019",
      "difficulty": "hard",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "초기 선택 오류를 되돌리기 어렵다, argmax_y P(y|x), 0.4, Softmax의 정의를 비교할 때, 두 항목과 설명이 모두 올바르게 연결된 선택지는?",
      "options": [
        "① 초기 선택 오류를 되돌리기 어렵다: 예시에서 'students opened their'가 1000번, 뒤에 'books'가 400번이면 확률은 400/1000=0.4다. / ② argmax_y P(y|x): 유사도 점수에 softmax를 적용해 입력 위치별 attention weight 분포를 만든다.",
        "① 0.4: 유사도 점수에 softmax를 적용해 입력 위치별 attention weight 분포를 만든다. / ② Softmax: 예시에서 'students opened their'가 1000번, 뒤에 'books'가 400번이면 확률은 400/1000=0.4다.",
        "① 초기 선택 오류를 되돌리기 어렵다: 통계적 기계번역은 입력 x가 주어졌을 때 확률이 가장 높은 출력 y를 찾는 문제로 표현한다. / ② argmax_y P(y|x): Greedy decoding은 이전 선택을 되돌아보지 않아 초기 오류가 이후 생성에 영향을 줄 수 있다.",
        "① 초기 선택 오류를 되돌리기 어렵다: Greedy decoding은 이전 선택을 되돌아보지 않아 초기 오류가 이후 생성에 영향을 줄 수 있다. / ② argmax_y P(y|x): 통계적 기계번역은 입력 x가 주어졌을 때 확률이 가장 높은 출력 y를 찾는 문제로 표현한다."
      ],
      "answer": 3,
      "explanation": "초기 선택 오류를 되돌리기 어렵다과 argmax_y P(y|x)의 설명이 각각 정확하게 연결된 선택지만 정답이다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-hard-mc-029",
      "conceptId": "combined-positional-self_attention-layernorm-029",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "Positional Encoding, 한 문장 내부의 단어들이 서로를 직접 참조, Layer Normalization, o_i = Σ_j α_ij v_j의 정의를 비교할 때, 두 항목과 설명이 모두 올바르게 연결된 선택지는?",
      "options": [
        "① Positional Encoding: Self-Attention에 없는 토큰 위치·순서 정보를 임베딩에 더해 준다. / ② 한 문장 내부의 단어들이 서로를 직접 참조: Self-Attention은 같은 문장 안의 모든 토큰 관계를 직접 계산해 표현을 문맥화한다.",
        "① Layer Normalization: 출력은 softmax 가중치 α_ij를 Value v_j에 곱해 합한 값이다. / ② o_i = Σ_j α_ij v_j: 각 레이어의 hidden vector 값을 정규화해 안정적이고 빠른 학습을 돕는다.",
        "① Positional Encoding: 각 레이어의 hidden vector 값을 정규화해 안정적이고 빠른 학습을 돕는다. / ② 한 문장 내부의 단어들이 서로를 직접 참조: 출력은 softmax 가중치 α_ij를 Value v_j에 곱해 합한 값이다.",
        "① Positional Encoding: Self-Attention은 같은 문장 안의 모든 토큰 관계를 직접 계산해 표현을 문맥화한다. / ② 한 문장 내부의 단어들이 서로를 직접 참조: Self-Attention에 없는 토큰 위치·순서 정보를 임베딩에 더해 준다."
      ],
      "answer": 0,
      "explanation": "Positional Encoding과 한 문장 내부의 단어들이 서로를 직접 참조의 설명이 각각 정확하게 연결된 선택지만 정답이다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-hard-mc-041",
      "conceptId": "mismatch-one_shot-mlm-bert-pretrain_finetune-041",
      "difficulty": "hard",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "다음 네 항목의 연결을 검토하시오: One-shot, Masked Language Model, BERT, 사전학습 후 파인튜닝. 선택지 중 설명이 잘못 연결된 한 쌍을 고르시오.",
      "options": [
        "Masked Language Model — 일부 입력 토큰을 [MASK]로 바꾸고 원래 단어를 예측하는 사전학습 목표다.",
        "사전학습 후 파인튜닝 — 하나의 예시를 프롬프트에 제공하는 설정이다.",
        "BERT — Transformer encoder 기반이며 Masked LM으로 사전학습하는 대표 모델이다.",
        "One-shot — 하나의 예시를 프롬프트에 제공하는 설정이다."
      ],
      "answer": 1,
      "explanation": "오답 연결은 서로 다른 개념의 정의를 연결한 것이다. 사전학습 후 파인튜닝의 설명은 해당 항목이 아니다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-hard-mc-049",
      "conceptId": "combined-foundation_data-emergent-foundation_transformer-049",
      "difficulty": "hard",
      "category": "1. 텍스트 파운데이션 모델 살펴보기",
      "questionType": "multiple-choice",
      "prompt": "대규모 데이터, Emergent ability, Attention 기반 Transformer, Closed model의 정의를 비교할 때, 두 항목과 설명이 모두 올바르게 연결된 선택지는?",
      "options": [
        "① 대규모 데이터: 규모가 일정 임계점을 넘을 때 이전에 뚜렷하지 않던 새로운 능력이 나타나는 현상이다. / ② Emergent ability: 파운데이션 모델의 핵심 구성 요소로 대규모 데이터를 제시한다.",
        "① Attention 기반 Transformer: ChatGPT, Claude, Gemini처럼 내부 가중치가 공개되지 않고 주로 API로 사용하는 모델 유형이다. / ② Closed model: 텍스트 파운데이션 모델의 핵심 모델 구조로 attention 기반 Transformer가 사용된다.",
        "① 대규모 데이터: 파운데이션 모델의 핵심 구성 요소로 대규모 데이터를 제시한다. / ② Emergent ability: 규모가 일정 임계점을 넘을 때 이전에 뚜렷하지 않던 새로운 능력이 나타나는 현상이다.",
        "① 대규모 데이터: 텍스트 파운데이션 모델의 핵심 모델 구조로 attention 기반 Transformer가 사용된다. / ② Emergent ability: ChatGPT, Claude, Gemini처럼 내부 가중치가 공개되지 않고 주로 API로 사용하는 모델 유형이다."
      ],
      "answer": 2,
      "explanation": "대규모 데이터과 Emergent ability의 설명이 각각 정확하게 연결된 선택지만 정답이다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 사전학습·SFT·선호 학습·정책 최적화의 단계."
    },
    {
      "id": "week2-hard-mc-062",
      "conceptId": "combined-zero_cot-system_prompt-autoregressive-062",
      "difficulty": "hard",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "두 상황을 동시에 만족하는 개념 조합을 고르시오. 상황 A: 예시 없이 단계적으로 생각하라는 문구를 추가해 추론을 유도하는 방식이다. 상황 B: 모델의 기본 역할, 행동 지침, 스타일 같은 상위 수준 지시를 제공한다.",
      "options": [
        "Autoregressive generation + System prompt",
        "Zero-shot CoT + Chain-of-Thought (CoT) prompting",
        "System prompt + Zero-shot CoT",
        "Zero-shot CoT + System prompt"
      ],
      "answer": 3,
      "explanation": "상황 A는 Zero-shot CoT, 상황 B는 System prompt를 가리킨다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-hard-mc-071",
      "conceptId": "mismatch-rouge_value-vision_projection-llm_judge-accuracy-071",
      "difficulty": "hard",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "다음 네 항목의 연결을 검토하시오: 0.83, Vision Encoder + Projection, LLM-as-judge (G-Eval), Accuracy. 선택지 중 설명이 잘못 연결된 한 쌍을 고르시오.",
      "options": [
        "Accuracy — 예시에서 ROUGE-1은 겹친 unigram 5개를 정답 문장 6개 단어로 나누어 5/6=0.83이다.",
        "0.83 — 예시에서 ROUGE-1은 겹친 unigram 5개를 정답 문장 6개 단어로 나누어 5/6=0.83이다.",
        "Vision Encoder + Projection — 이미지 특징을 추출한 뒤 언어 모델 입력 공간에 맞게 투영하는 연결 방식이다.",
        "LLM-as-judge (G-Eval) — 거대 언어 모델을 평가자로 사용해 생성 텍스트 품질이나 상대적 선호를 판단한다."
      ],
      "answer": 0,
      "explanation": "오답 연결은 서로 다른 개념의 정의를 연결한 것이다. Accuracy의 설명은 해당 항목이 아니다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-hard-mc-008",
      "conceptId": "combined-many_many-rnn-dim_curse-008",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 두 판단의 빈칸을 채운 조합은? (가) 기계번역처럼 입력과 출력이 모두 시퀀스인 구조다. → [가] / (나) 어휘가 커질수록 One-hot 벡터 차원이 커져 메모리와 계산 효율이 나빠진다. → [나]",
      "options": [
        "차원의 저주 / Many-to-Many",
        "Many-to-Many / 차원의 저주",
        "RNN / 차원의 저주",
        "Many-to-Many / 어휘 집합의 크기"
      ],
      "answer": 1,
      "explanation": "[가]는 Many-to-Many, [나]는 차원의 저주이다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-hard-mc-020",
      "conceptId": "combined-ngram-attention-ngram_context-020",
      "difficulty": "hard",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "세 설명을 모두 판별하시오. ① N-gram은 연속해서 등장하는 N개의 단어 묶음을 뜻한다. ② Attention은 decoder 각 시점에서 관련 있는 encoder hidden state를 선택적으로 참조한다. ③ N-gram 언어 모델은 다음 단어 예측에 직전 N-1개의 단어를 문맥으로 사용한다. 각각에 해당하는 개념의 순서로 옳은 것은?",
      "options": [
        "연속된 N개의 단어 묶음 / 직전 N-1개 단어 / 관련 있는 입력 위치를 선택적으로 참조",
        "관련 있는 입력 위치를 선택적으로 참조 / 연속된 N개의 단어 묶음 / 직전 N-1개 단어",
        "연속된 N개의 단어 묶음 / 관련 있는 입력 위치를 선택적으로 참조 / 직전 N-1개 단어",
        "직전 N-1개 단어 / 관련 있는 입력 위치를 선택적으로 참조 / 연속된 N개의 단어 묶음"
      ],
      "answer": 2,
      "explanation": "①은 연속된 N개의 단어 묶음, ②는 관련 있는 입력 위치를 선택적으로 참조, ③은 직전 N-1개 단어이다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-hard-mc-030",
      "conceptId": "combined-query-sinusoidal-order_limit-030",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "세 설명을 모두 판별하시오. ① 현재 단어가 다른 단어에서 어떤 정보를 찾을지를 나타낸다. ② 서로 다른 주기의 사인·코사인 함수를 이용해 위치 벡터를 만든다. ③ Self-Attention 자체는 토큰 간 유사도만 계산하므로 입력 순서 정보가 직접 포함되지 않는다. 각각에 해당하는 개념의 순서로 옳은 것은?",
      "options": [
        "Query / 순서 정보 부재 / Sinusoidal Position Encoding",
        "순서 정보 부재 / Sinusoidal Position Encoding / Query",
        "Sinusoidal Position Encoding / Query / 순서 정보 부재",
        "Query / Sinusoidal Position Encoding / 순서 정보 부재"
      ],
      "answer": 3,
      "explanation": "①은 Query, ②는 Sinusoidal Position Encoding, ③은 순서 정보 부재이다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-hard-mc-042",
      "conceptId": "combined-pretraining-pretrain_finetune-one_shot-042",
      "difficulty": "hard",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "multiple-choice",
      "prompt": "두 상황을 동시에 만족하는 개념 조합을 고르시오. 상황 A: 사전학습은 대규모 데이터로 모델이 일반적인 특징과 표현을 먼저 학습하게 한다. 상황 B: 사전학습 파라미터를 초기값으로 사용한 뒤 다운스트림 태스크에 맞게 조정하는 패러다임이다.",
      "options": [
        "대규모 데이터로 일반적 표현과 패턴을 먼저 학습 + 사전학습 후 파인튜닝",
        "대규모 데이터로 일반적 표현과 패턴을 먼저 학습 + BERT",
        "One-shot + 사전학습 후 파인튜닝",
        "사전학습 후 파인튜닝 + 대규모 데이터로 일반적 표현과 패턴을 먼저 학습"
      ],
      "answer": 0,
      "explanation": "상황 A는 대규모 데이터로 일반적 표현과 패턴을 먼저 학습, 상황 B는 사전학습 후 파인튜닝를 가리킨다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: encoder-only·decoder-only·encoder-decoder 구조와 학습 목표."
    },
    {
      "id": "week2-hard-mc-063",
      "conceptId": "combined-cot-topk-user_query-063",
      "difficulty": "hard",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "다음 두 판단의 빈칸을 채운 조합은? (가) 예시에 최종 답뿐 아니라 중간 추론 과정을 함께 보여 주어 복합 추론을 유도한다. → [가] / (나) 사용자가 실제로 모델에게 해결해 달라고 요청하는 질문이나 작업 지시다. → [나]",
      "options": [
        "Chain-of-Thought (CoT) prompting / Autoregressive generation",
        "Chain-of-Thought (CoT) prompting / User query",
        "User query / Chain-of-Thought (CoT) prompting",
        "Top-K / User query"
      ],
      "answer": 1,
      "explanation": "[가]는 Chain-of-Thought (CoT) prompting, [나]는 User query이다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-hard-mc-072",
      "conceptId": "combined-self_bias-eval_three-synth52000-072",
      "difficulty": "hard",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "두 상황을 동시에 만족하는 개념 조합을 고르시오. 상황 A: 생성 모델과 평가 모델이 같거나 유사할 때 자기 계열 답변을 더 선호할 수 있다. 상황 B: 평가 설계의 세 요소로 목표, 평가 방법, 평가 지표가 제시된다.",
      "options": [
        "52,000개 + 목표·평가 방법·평가 지표",
        "목표·평가 방법·평가 지표 + 자기 선호 편향",
        "자기 선호 편향 + 목표·평가 방법·평가 지표",
        "자기 선호 편향 + 0.83"
      ],
      "answer": 2,
      "explanation": "상황 A는 자기 선호 편향, 상황 B는 목표·평가 방법·평가 지표를 가리킨다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-hard-mc-009",
      "conceptId": "combined-one_many-rnn_share-gate_range-009",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "One-to-Many, 같은 가중치를 시점마다 재사용, 0과 1 사이, 주변 단어로 중심 단어를 예측의 정의를 비교할 때, 두 항목과 설명이 모두 올바르게 연결된 선택지는?",
      "options": [
        "① One-to-Many: RNN은 각 시점에서 동일한 가중치를 반복해서 사용한다. / ② 같은 가중치를 시점마다 재사용: 하나의 입력에서 여러 시점의 출력을 생성하는 구조다.",
        "① 0과 1 사이: CBOW는 주변 문맥 단어들을 이용해 중심 단어를 예측한다. / ② 주변 단어로 중심 단어를 예측: LSTM의 sigmoid gate 출력은 0과 1 사이 값으로 정보 통과 비율을 조절한다.",
        "① One-to-Many: LSTM의 sigmoid gate 출력은 0과 1 사이 값으로 정보 통과 비율을 조절한다. / ② 같은 가중치를 시점마다 재사용: CBOW는 주변 문맥 단어들을 이용해 중심 단어를 예측한다.",
        "① One-to-Many: 하나의 입력에서 여러 시점의 출력을 생성하는 구조다. / ② 같은 가중치를 시점마다 재사용: RNN은 각 시점에서 동일한 가중치를 반복해서 사용한다."
      ],
      "answer": 3,
      "explanation": "One-to-Many과 같은 가중치를 시점마다 재사용의 설명이 각각 정확하게 연결된 선택지만 정답이다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-hard-mc-021",
      "conceptId": "mismatch-sentence_prob-beam_score-smt_limit-ngram_context-021",
      "difficulty": "hard",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "다음 네 항목의 연결을 검토하시오: 조건부 확률의 곱, 로그 확률의 합, 구조가 복잡하고 언어별 자원·수작업이 많이 필요하다, 직전 N-1개 단어. 선택지 중 설명이 잘못 연결된 한 쌍을 고르시오.",
      "options": [
        "직전 N-1개 단어 — 문장 전체 확률은 각 시점 단어가 이전 문맥에 조건부로 등장할 확률들의 곱으로 표현할 수 있다.",
        "구조가 복잡하고 언어별 자원·수작업이 많이 필요하다 — 통계적 기계번역은 복잡한 구조와 많은 수작업, 언어별 자원 의존으로 유지·확장이 어렵다.",
        "로그 확률의 합 — Beam search의 후보 시퀀스 점수는 토큰 로그 확률의 합으로 계산할 수 있다.",
        "조건부 확률의 곱 — 문장 전체 확률은 각 시점 단어가 이전 문맥에 조건부로 등장할 확률들의 곱으로 표현할 수 있다."
      ],
      "answer": 0,
      "explanation": "오답 연결은 서로 다른 개념의 정의를 연결한 것이다. 직전 N-1개 단어의 설명은 해당 항목이 아니다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-hard-mc-031",
      "conceptId": "mismatch-scaled-value-learned_pos-attn_output-031",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 네 항목의 연결을 검토하시오: Scaled Dot-Product Attention, Value, Learned Absolute Position Embedding, o_i = Σ_j α_ij v_j. 선택지 중 설명이 잘못 연결된 한 쌍을 고르시오.",
      "options": [
        "Scaled Dot-Product Attention — Query와 Key의 큰 내적값을 스케일링해 softmax와 학습을 안정화한다.",
        "o_i = Σ_j α_ij v_j — Query와 Key의 큰 내적값을 스케일링해 softmax와 학습을 안정화한다.",
        "Value — attention weight에 따라 실제로 모아지는 정보 내용을 담는다.",
        "Learned Absolute Position Embedding — 각 위치 벡터 자체를 학습 파라미터로 두고 최적화한다."
      ],
      "answer": 1,
      "explanation": "오답 연결은 서로 다른 개념의 정의를 연결한 것이다. o_i = Σ_j α_ij v_j의 설명은 해당 항목이 아니다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-hard-mc-064",
      "conceptId": "combined-knn_prompt-zero_cot-temperature_high-064",
      "difficulty": "hard",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "multiple-choice",
      "prompt": "kNN 기반 예시 선택, Zero-shot CoT, 높은 temperature, Autoregressive generation의 정의를 비교할 때, 두 항목과 설명이 모두 올바르게 연결된 선택지는?",
      "options": [
        "① 높은 temperature: 지금까지 생성한 토큰을 조건으로 다음 토큰을 하나씩 순차 생성한다. / ② Autoregressive generation: Temperature가 커지면 분포가 평평해져 다양한 토큰이 선택될 가능성이 커진다.",
        "① kNN 기반 예시 선택: 예시 없이 단계적으로 생각하라는 문구를 추가해 추론을 유도하는 방식이다. / ② Zero-shot CoT: 테스트 쿼리와 임베딩 거리가 가까운 학습 예시를 골라 few-shot 문맥으로 제공한다.",
        "① kNN 기반 예시 선택: 테스트 쿼리와 임베딩 거리가 가까운 학습 예시를 골라 few-shot 문맥으로 제공한다. / ② Zero-shot CoT: 예시 없이 단계적으로 생각하라는 문구를 추가해 추론을 유도하는 방식이다.",
        "① kNN 기반 예시 선택: Temperature가 커지면 분포가 평평해져 다양한 토큰이 선택될 가능성이 커진다. / ② Zero-shot CoT: 지금까지 생성한 토큰을 조건으로 다음 토큰을 하나씩 순차 생성한다."
      ],
      "answer": 2,
      "explanation": "kNN 기반 예시 선택과 Zero-shot CoT의 설명이 각각 정확하게 연결된 선택지만 정답이다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 후보 토큰의 확률 분포를 제한하거나 조정하는 방식."
    },
    {
      "id": "week2-hard-mc-073",
      "conceptId": "combined-self_instruct-llm_judge-eval_three-073",
      "difficulty": "hard",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "다음 두 판단의 빈칸을 채운 조합은? (가) 소량의 사람이 만든 seed instruction을 바탕으로 LLM이 대규모 합성 지시 데이터를 생성해 확장하는 방법이다. → [가] / (나) 평가 설계의 세 요소로 목표, 평가 방법, 평가 지표가 제시된다. → [나]",
      "options": [
        "목표·평가 방법·평가 지표 / Self-Instruct",
        "LLM-as-judge (G-Eval) / 목표·평가 방법·평가 지표",
        "Self-Instruct / Vision Encoder + Projection",
        "Self-Instruct / 목표·평가 방법·평가 지표"
      ],
      "answer": 3,
      "explanation": "[가]는 Self-Instruct, [나]는 목표·평가 방법·평가 지표이다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-hard-mc-010",
      "conceptId": "combined-onehot_dim-skipgram-lstm_year-010",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "세 설명을 모두 판별하시오. ① One-hot 벡터의 차원은 어휘 집합의 크기와 같다. ② Skip-gram은 중심 단어를 입력으로 두고 주변 문맥 단어를 예측한다. ③ LSTM이 1997년에 제안되었다고 설명한다. 각각에 해당하는 개념의 순서로 옳은 것은?",
      "options": [
        "어휘 집합의 크기 / 중심 단어로 주변 단어를 예측 / 1997년",
        "1997년 / 중심 단어로 주변 단어를 예측 / 어휘 집합의 크기",
        "어휘 집합의 크기 / 1997년 / 중심 단어로 주변 단어를 예측",
        "중심 단어로 주변 단어를 예측 / 어휘 집합의 크기 / 1997년"
      ],
      "answer": 0,
      "explanation": "①은 어휘 집합의 크기, ②는 중심 단어로 주변 단어를 예측, ③은 1997년이다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-hard-mc-022",
      "conceptId": "combined-smt_bayes-context_vector-beam_score-022",
      "difficulty": "hard",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "multiple-choice",
      "prompt": "두 상황을 동시에 만족하는 개념 조합을 고르시오. 상황 A: 베이즈 규칙을 이용하면 translation model P(x|y)와 language model P(y)의 곱으로 분해할 수 있다. 상황 B: Attention context vector는 attention weight로 Value들을 가중합하여 계산한다.",
      "options": [
        "로그 확률의 합 + Value들의 가중합",
        "P(x|y)P(y) + Value들의 가중합",
        "P(x|y)P(y) + 관련 있는 입력 위치를 선택적으로 참조",
        "Value들의 가중합 + P(x|y)P(y)"
      ],
      "answer": 1,
      "explanation": "상황 A는 P(x|y)P(y), 상황 B는 Value들의 가중합를 가리킨다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상."
    },
    {
      "id": "week2-hard-mc-032",
      "conceptId": "combined-score-decoder_context-self_path-032",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "두 상황을 동시에 만족하는 개념 조합을 고르시오. 상황 A: 기본 Self-Attention의 단어 i와 j 유사도는 Query와 Key의 내적으로 계산할 수 있다. 상황 B: decoder의 masked self-attention은 현재까지의 토큰만 사용한다.",
      "options": [
        "O(1) + 단방향 문맥",
        "단방향 문맥 + q_i^T k_j",
        "q_i^T k_j + 단방향 문맥",
        "q_i^T k_j + Query"
      ],
      "answer": 2,
      "explanation": "상황 A는 q_i^T k_j, 상황 B는 단방향 문맥를 가리킨다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-hard-mc-074",
      "conceptId": "combined-test_data-multimodal-mmlu-074",
      "difficulty": "hard",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "학습 단계에서 보지 않은 테스트 데이터, 멀티모달 파운데이션 모델, MMLU, LMArena의 정의를 비교할 때, 두 항목과 설명이 모두 올바르게 연결된 선택지는?",
      "options": [
        "① MMLU: 실제 사용자 피드백으로 모델 응답의 상대적 선호를 평가하는 대표 사례다. / ② LMArena: 57개의 다양한 전문 분야 객관식 문제로 구성된 벤치마크로 소개된다.",
        "① 학습 단계에서 보지 않은 테스트 데이터: 57개의 다양한 전문 분야 객관식 문제로 구성된 벤치마크로 소개된다. / ② 멀티모달 파운데이션 모델: 실제 사용자 피드백으로 모델 응답의 상대적 선호를 평가하는 대표 사례다.",
        "① 학습 단계에서 보지 않은 테스트 데이터: 텍스트뿐 아니라 이미지·비디오·오디오 등 여러 모달리티를 입력·출력으로 다룬다. / ② 멀티모달 파운데이션 모델: 모델 일반화 성능 평가는 학습에서 보지 않은 테스트 데이터로 수행하는 것이 기본이다.",
        "① 학습 단계에서 보지 않은 테스트 데이터: 모델 일반화 성능 평가는 학습에서 보지 않은 테스트 데이터로 수행하는 것이 기본이다. / ② 멀티모달 파운데이션 모델: 텍스트뿐 아니라 이미지·비디오·오디오 등 여러 모달리티를 입력·출력으로 다룬다."
      ],
      "answer": 3,
      "explanation": "학습 단계에서 보지 않은 테스트 데이터과 멀티모달 파운데이션 모델의 설명이 각각 정확하게 연결된 선택지만 정답이다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-hard-mc-011",
      "conceptId": "mismatch-onehot_sparse-window-onehot_dim-embedding-011",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "다음 네 항목의 연결을 검토하시오: 희소 벡터, Window size, 어휘 집합의 크기, Word embedding. 선택지 중 설명이 잘못 연결된 한 쌍을 고르시오.",
      "options": [
        "Word embedding — One-hot 벡터는 대부분의 값이 0인 희소한 표현이다.",
        "희소 벡터 — One-hot 벡터는 대부분의 값이 0인 희소한 표현이다.",
        "Window size — 중심 단어 주변에서 몇 개의 단어를 문맥으로 볼지 정한다.",
        "어휘 집합의 크기 — One-hot 벡터의 차원은 어휘 집합의 크기와 같다."
      ],
      "answer": 0,
      "explanation": "오답 연결은 서로 다른 개념의 정의를 연결한 것이다. Word embedding의 설명은 해당 항목이 아니다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-hard-mc-033",
      "conceptId": "combined-self_parallel-key-attn_output-033",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "다음 두 판단의 빈칸을 채운 조합은? (가) 시점 상태를 순차 전달하지 않으므로 시퀀스 위치들을 병렬 처리하기 쉽다. → [가] / (나) 출력은 softmax 가중치 α_ij를 Value v_j에 곱해 합한 값이다. → [나]",
      "options": [
        "o_i = Σ_j α_ij v_j / 병렬 처리",
        "병렬 처리 / o_i = Σ_j α_ij v_j",
        "병렬 처리 / O(1)",
        "Key / o_i = Σ_j α_ij v_j"
      ],
      "answer": 1,
      "explanation": "[가]는 병렬 처리, [나]는 o_i = Σ_j α_ij v_j이다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-hard-mc-075",
      "conceptId": "combined-accuracy-rouge-rouge_value-075",
      "difficulty": "hard",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "multiple-choice",
      "prompt": "세 설명을 모두 판별하시오. ① 정답이 명확한 문제는 예측과 정답의 일치도를 정확도로 평가할 수 있다. ② 참조 답안과 생성 문장 사이 단어 수준 중첩을 이용한 유사도 평가 지표다. ③ 예시에서 ROUGE-1은 겹친 unigram 5개를 정답 문장 6개 단어로 나누어 5/6=0.83이다. 각각에 해당하는 개념의 순서로 옳은 것은?",
      "options": [
        "0.83 / ROUGE / Accuracy",
        "ROUGE / Accuracy / 0.83",
        "Accuracy / ROUGE / 0.83",
        "Accuracy / 0.83 / ROUGE"
      ],
      "answer": 2,
      "explanation": "①은 Accuracy, ②는 ROUGE, ③은 0.83이다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 형식, 평가 지표가 비교하는 대상과 자동 평가의 한계."
    },
    {
      "id": "week2-hard-mc-012",
      "conceptId": "combined-rnn-cbow-rnn_formula-012",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "multiple-choice",
      "prompt": "두 상황을 동시에 만족하는 개념 조합을 고르시오. 상황 A: 이전 시점의 hidden state를 다음 시점으로 전달해 순차적 문맥을 반영하는 신경망이다. 상황 B: CBOW는 주변 문맥 단어들을 이용해 중심 단어를 예측한다.",
      "options": [
        "RNN + LSTM",
        "주변 단어로 중심 단어를 예측 + RNN",
        "h_t = tanh(W_hh h_{t-1} + W_xh x_t) + 주변 단어로 중심 단어를 예측",
        "RNN + 주변 단어로 중심 단어를 예측"
      ],
      "answer": 3,
      "explanation": "상황 A는 RNN, 상황 B는 주변 단어로 중심 단어를 예측를 가리킨다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "week2-hard-mc-034",
      "conceptId": "combined-sinusoidal-masked-key-034",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "multiple-choice",
      "prompt": "Sinusoidal Position Encoding, Masked Self-Attention, Key, 단방향 문맥의 정의를 비교할 때, 두 항목과 설명이 모두 올바르게 연결된 선택지는?",
      "options": [
        "① Sinusoidal Position Encoding: 서로 다른 주기의 사인·코사인 함수를 이용해 위치 벡터를 만든다. / ② Masked Self-Attention: 언어 생성 시 현재 위치가 미래 토큰을 보지 못하도록 차단한다.",
        "① Sinusoidal Position Encoding: 각 단어가 가진 정보의 특징을 나타내며 Query와의 유사도 계산에 사용된다. / ② Masked Self-Attention: decoder의 masked self-attention은 현재까지의 토큰만 사용한다.",
        "① Key: decoder의 masked self-attention은 현재까지의 토큰만 사용한다. / ② 단방향 문맥: 각 단어가 가진 정보의 특징을 나타내며 Query와의 유사도 계산에 사용된다.",
        "① Sinusoidal Position Encoding: 언어 생성 시 현재 위치가 미래 토큰을 보지 못하도록 차단한다. / ② Masked Self-Attention: 서로 다른 주기의 사인·코사인 함수를 이용해 위치 벡터를 만든다."
      ],
      "answer": 0,
      "explanation": "Sinusoidal Position Encoding과 Masked Self-Attention의 설명이 각각 정확하게 연결된 선택지만 정답이다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: Query·Key·Value의 출처, masking과 위치 정보."
    },
    {
      "id": "week2-hard-sa-001",
      "conceptId": "window-hard-short-001",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 정확한 용어·식·값을 작성하시오. 중심 단어 주변에서 몇 개의 단어를 문맥으로 볼지 정한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Window size"
      ],
      "explanation": "해당 설명의 핵심 개념은 Window size이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-sa-002",
      "conceptId": "lm_next-hard-short-002",
      "difficulty": "hard",
      "category": "자연어 생성 모델 (Seq2Seq, Attention)",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 명칭을 정확히 작성하시오. 언어 모델은 주어진 문맥에서 다음 단어가 나올 확률분포를 모델링한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "다음 단어의 확률분포"
      ],
      "explanation": "해당 설명의 핵심 개념은 다음 단어의 확률분포이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: encoder·decoder의 정보 흐름과 생성 시점의 참조 대상. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-sa-003",
      "conceptId": "seq_order-hard-short-003",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "short-answer",
      "prompt": "다음 정의의 핵심 답을 정확한 표기로 작성하시오. 언어와 같은 순차적 데이터에서는 원소의 순서가 의미에 영향을 준다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "순서"
      ],
      "explanation": "해당 설명의 핵심 개념은 순서이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-sa-004",
      "conceptId": "seq_variable-hard-short-004",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "short-answer",
      "prompt": "빈칸에 들어갈 용어 또는 값을 작성하시오. [ 자연어 문장은 서로 다른 길이를 가질 수 있으므로 순차 모델은 가변 길이 입력을 다룬다. ]",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "가변 길이"
      ],
      "explanation": "해당 설명의 핵심 개념은 가변 길이이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-sa-005",
      "conceptId": "long_dependency-hard-short-005",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 정확한 용어·식·값을 작성하시오. 멀리 떨어진 단어 사이의 관계를 기억해야 하는 문제를 장기 의존성이라 한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "장기 의존성"
      ],
      "explanation": "해당 설명의 핵심 개념은 장기 의존성이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-sa-006",
      "conceptId": "rnn-hard-short-006",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 명칭을 정확히 작성하시오. 이전 시점의 hidden state를 다음 시점으로 전달해 순차적 문맥을 반영하는 신경망이다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "RNN"
      ],
      "explanation": "해당 설명의 핵심 개념은 RNN이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-sa-007",
      "conceptId": "hidden_state-hard-short-007",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "short-answer",
      "prompt": "다음 정의의 핵심 답을 정확한 표기로 작성하시오. 이전까지의 시퀀스 정보를 요약해 다음 시점으로 전달하는 상태다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Hidden state"
      ],
      "explanation": "해당 설명의 핵심 개념은 Hidden state이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-sa-008",
      "conceptId": "rnn_formula-hard-short-008",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "short-answer",
      "prompt": "빈칸에 들어갈 용어 또는 값을 작성하시오. [ 기본 RNN은 이전 hidden state와 현재 입력을 결합해 tanh를 적용하여 현재 hidden state를 계산한다. ]",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "h_t = tanh(W_hh h_{t-1} + W_xh x_t)"
      ],
      "explanation": "해당 설명의 핵심 개념은 h_t = tanh(W_hh h_{t-1} + W_xh x_t)이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-sa-009",
      "conceptId": "rnn_share-hard-short-009",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 정확한 용어·식·값을 작성하시오. RNN은 각 시점에서 동일한 가중치를 반복해서 사용한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "같은 가중치를 시점마다 재사용"
      ],
      "explanation": "해당 설명의 핵심 개념은 같은 가중치를 시점마다 재사용이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-sa-010",
      "conceptId": "many_one-hard-short-010",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 명칭을 정확히 작성하시오. 문장 전체를 입력받아 하나의 감정 라벨을 출력하는 감정 분류의 입출력 형태다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Many-to-One"
      ],
      "explanation": "해당 설명의 핵심 개념은 Many-to-One이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-sa-011",
      "conceptId": "one_many-hard-short-011",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "short-answer",
      "prompt": "다음 정의의 핵심 답을 정확한 표기로 작성하시오. 하나의 입력에서 여러 시점의 출력을 생성하는 구조다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "One-to-Many"
      ],
      "explanation": "해당 설명의 핵심 개념은 One-to-Many이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-sa-012",
      "conceptId": "many_many-hard-short-012",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "short-answer",
      "prompt": "빈칸에 들어갈 용어 또는 값을 작성하시오. [ 기계번역처럼 입력과 출력이 모두 시퀀스인 구조다. ]",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Many-to-Many"
      ],
      "explanation": "해당 설명의 핵심 개념은 Many-to-Many이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-sa-013",
      "conceptId": "vanishing-hard-short-013",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 정확한 용어·식·값을 작성하시오. 긴 시퀀스 역전파에서 작은 미분값이 반복 곱해져 초기 시점의 gradient가 매우 작아질 수 있다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Gradient vanishing"
      ],
      "explanation": "해당 설명의 핵심 개념은 Gradient vanishing이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-sa-014",
      "conceptId": "rnn_parallel-hard-short-014",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "short-answer",
      "prompt": "다음 설명에 해당하는 명칭을 정확히 작성하시오. RNN은 이전 시점 결과에 의존하므로 시퀀스 위치를 한꺼번에 계산하기 어렵다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "순차 연산 때문에 병렬화가 어렵다"
      ],
      "explanation": "해당 설명의 핵심 개념은 RNN의 순차 연산으로 인한 병렬화 한계다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-sa-015",
      "conceptId": "lstm-hard-short-015",
      "difficulty": "hard",
      "category": "워드 임베딩과 순환신경망 기반 모델 (RNN & LSTM)",
      "questionType": "short-answer",
      "prompt": "다음 정의의 핵심 답을 정확한 표기로 작성하시오. 기본 RNN의 장기 의존성과 기울기 소실 문제를 완화하기 위해 설계된 순환 신경망이다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "LSTM"
      ],
      "explanation": "해당 설명의 핵심 개념은 LSTM이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "week2-hard-es-001",
      "conceptId": "week2-hard-essay-001",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "essay",
      "prompt": "Scaled Dot-Product Attention이 필요한 이유를 Q/K 차원, softmax, gradient 관점에서 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Query",
        "Key",
        "softmax",
        "gradient",
        "scaling"
      ],
      "modelAnswer": "Query와 Key 차원이 커지면 내적값이 커져 softmax가 지나치게 뾰족해지고 작은 점수 차이가 과도한 확률 차이로 확대되어 학습이 불안정해질 수 있다. 이를 완화하려고 내적값을 스케일링한다.",
      "rubricKeywords": [
        "Query",
        "Key",
        "softmax",
        "gradient",
        "scaling"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Query, Key, softmax, gradient, scaling. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "Transformer에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-hard-es-004",
      "conceptId": "week2-hard-essay-004",
      "difficulty": "hard",
      "category": "사전 학습 기반 언어 모델",
      "questionType": "essay",
      "prompt": "워드 임베딩만 사전학습하는 것보다 언어 모델 전체를 사전학습하는 장점을 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "워드 임베딩",
        "언어 모델",
        "문맥",
        "파라미터",
        "다운스트림"
      ],
      "modelAnswer": "언어 모델 전체 사전학습은 단어 의미뿐 아니라 문맥 표현과 네트워크 파라미터를 함께 학습하고 다음 토큰 분포를 익혀 다양한 다운스트림 태스크와 생성에 활용하기 좋다.",
      "rubricKeywords": [
        "워드 임베딩",
        "언어 모델",
        "문맥",
        "파라미터",
        "다운스트림"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: 워드 임베딩, 언어 모델, 문맥, 파라미터, 다운스트림. BERT·GPT·T5는 Transformer를 사용하지만 구조와 사전학습 목표가 서로 다르다.",
      "hint": "사전학습에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-hard-es-005",
      "conceptId": "week2-hard-essay-005",
      "difficulty": "hard",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "essay",
      "prompt": "다음 토큰 예측 사전학습만으로 instruction-following이 충분하지 않은 이유와 instruction tuning·preference learning의 역할을 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "다음 토큰 예측",
        "instruction tuning",
        "preference learning",
        "사용자 지시"
      ],
      "modelAnswer": "사전학습은 다음 토큰 확률을 맞추는 것이 목표라 사용자 지시 준수나 선호를 직접 최적화하지 않는다. Instruction tuning은 지시-응답 패턴을 학습하고 preference learning은 여러 응답 중 사람이 선호하는 방향을 학습한다.",
      "rubricKeywords": [
        "다음 토큰 예측",
        "instruction tuning",
        "preference learning",
        "사용자 지시"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: 다음 토큰 예측, instruction tuning, preference learning, 사용자 지시. 대규모 사전학습 이후 지시 데이터와 인간 선호를 반영하는 정렬 단계를 순서대로 구분해야 한다.",
      "hint": "LLM 정렬에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-hard-es-007",
      "conceptId": "week2-hard-essay-007",
      "difficulty": "hard",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "essay",
      "prompt": "Top-K와 Top-P가 후보 집합을 구성하는 방식의 차이를 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Top-K",
        "Top-P",
        "누적 확률",
        "후보 집합"
      ],
      "modelAnswer": "Top-K는 분포 모양과 무관하게 후보 수를 K개로 고정한다. Top-P는 누적 확률이 P에 도달하는 최소 집합을 선택하므로 분포가 뾰족하면 후보가 적고 평평하면 더 많아질 수 있다.",
      "rubricKeywords": [
        "Top-K",
        "Top-P",
        "누적 확률",
        "후보 집합"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Top-K, Top-P, 누적 확률, 후보 집합. temperature·top-k·top-p는 후보 선택 범위와 확률 분포에 서로 다른 방식으로 영향을 준다.",
      "hint": "LLM 디코딩에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-hard-es-009",
      "conceptId": "week2-hard-essay-009",
      "difficulty": "hard",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "essay",
      "prompt": "LLM-as-judge의 위치 편향, 길이 편향, 자기 선호 편향과 완화 아이디어를 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "위치 편향",
        "길이 편향",
        "자기 선호 편향",
        "순서",
        "통계적 통제"
      ],
      "modelAnswer": "LLM-as-judge는 특정 위치의 답을 선호하는 위치 편향, 긴 답을 선호하는 길이 편향, 자기 계열 모델 답을 선호하는 자기 선호 편향이 생길 수 있다. 위치는 순서를 바꿔 반복 평가하고, 길이는 통계적으로 영향을 통제하는 방식으로 완화할 수 있다.",
      "rubricKeywords": [
        "위치 편향",
        "길이 편향",
        "자기 선호 편향",
        "순서",
        "통계적 통제"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: 위치 편향, 길이 편향, 자기 선호 편향, 순서, 통계적 통제. 평가 지표마다 문자열·의미·확률·사람의 선호 중 측정하는 대상이 다르며 편향 가능성도 있다.",
      "hint": "LLM 평가에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-hard-es-002",
      "conceptId": "week2-hard-essay-002",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "essay",
      "prompt": "Encoder와 Decoder의 Self-Attention 차이와 Cross-Attention의 Q/K/V 출처를 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Encoder",
        "Decoder",
        "masked self-attention",
        "Cross-Attention",
        "Query"
      ],
      "modelAnswer": "Encoder는 입력 전체의 양방향 문맥을 보므로 causal mask가 없다. Decoder는 미래 토큰을 보지 않도록 masked self-attention을 사용한다. Cross-Attention에서는 Q가 decoder, K와 V가 encoder에서 온다.",
      "rubricKeywords": [
        "Encoder",
        "Decoder",
        "masked self-attention",
        "Cross-Attention",
        "Query"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Encoder, Decoder, masked self-attention, Cross-Attention, Query. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "Transformer에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-hard-es-006",
      "conceptId": "week2-hard-essay-006",
      "difficulty": "hard",
      "category": "2. 거대 언어 모델의 학습",
      "questionType": "essay",
      "prompt": "개방형 생성에서 SFT만으로 충분하지 않을 수 있는 이유와 Reward Model의 역할을 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "개방형 생성",
        "SFT",
        "Reward Model",
        "인간 선호"
      ],
      "modelAnswer": "개방형 생성에는 하나의 절대 정답보다 여러 유효한 응답과 상대적 품질 차이가 존재한다. Reward Model은 후보 응답에 대한 인간 순위를 학습해 상대적 선호를 점수화한다.",
      "rubricKeywords": [
        "개방형 생성",
        "SFT",
        "Reward Model",
        "인간 선호"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: 개방형 생성, SFT, Reward Model, 인간 선호. 대규모 사전학습 이후 지시 데이터와 인간 선호를 반영하는 정렬 단계를 순서대로 구분해야 한다.",
      "hint": "선호 학습에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-hard-es-008",
      "conceptId": "week2-hard-essay-008",
      "difficulty": "hard",
      "category": "3. 거대 언어 모델의 추론",
      "questionType": "essay",
      "prompt": "Few-shot 예시 선택이 성능에 미치는 영향과 kNN 기반 선택 방법을 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Few-shot",
        "예시 선택",
        "kNN",
        "임베딩",
        "유사도"
      ],
      "modelAnswer": "ICL은 프롬프트에 포함된 예시에서 태스크 패턴을 추론하므로 예시 내용이 결과를 크게 바꿀 수 있다. kNN 방식은 테스트 쿼리와 임베딩 공간에서 가까운 학습 예시를 선택해 관련성이 높은 문맥을 제공한다.",
      "rubricKeywords": [
        "Few-shot",
        "예시 선택",
        "kNN",
        "임베딩",
        "유사도"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Few-shot, 예시 선택, kNN, 임베딩, 유사도. temperature·top-k·top-p는 후보 선택 범위와 확률 분포에 서로 다른 방식으로 영향을 준다.",
      "hint": "프롬프트 엔지니어링에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-hard-es-010",
      "conceptId": "week2-hard-essay-010",
      "difficulty": "hard",
      "category": "4. 거대 언어 모델의 평가와 응용",
      "questionType": "essay",
      "prompt": "멀티모달 파운데이션 모델이 비텍스트 정보를 LLM과 연결하는 핵심 아이디어를 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "멀티모달",
        "Encoder",
        "Projection",
        "토큰",
        "언어 모델"
      ],
      "modelAnswer": "이미지·비디오·오디오 같은 다른 모달리티를 전용 encoder로 특징화하고 projection이나 토큰화 과정을 통해 언어 모델이 처리할 수 있는 표현 공간에 맞춘 뒤 추가 학습하여 통합한다.",
      "rubricKeywords": [
        "멀티모달",
        "Encoder",
        "Projection",
        "토큰",
        "언어 모델"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: 멀티모달, Encoder, Projection, 토큰, 언어 모델. 평가 지표마다 문자열·의미·확률·사람의 선호 중 측정하는 대상이 다르며 편향 가능성도 있다.",
      "hint": "LLM 응용에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    },
    {
      "id": "week2-hard-es-003",
      "conceptId": "week2-hard-essay-003",
      "difficulty": "hard",
      "category": "Transformer",
      "questionType": "essay",
      "prompt": "Residual connection과 Layer Normalization이 깊은 Transformer 학습을 안정화하는 이유를 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Residual connection",
        "Layer Normalization",
        "gradient",
        "정규화"
      ],
      "modelAnswer": "Residual connection은 입력을 출력에 직접 더해 정보와 gradient의 우회 경로를 제공한다. Layer Normalization은 hidden vector의 값을 정규화해 레이어별 스케일 변동을 줄여 안정적인 학습을 돕는다.",
      "rubricKeywords": [
        "Residual connection",
        "Layer Normalization",
        "gradient",
        "정규화"
      ],
      "minLength": 20,
      "explanation": "모범답안에서는 다음 핵심 요소를 빠짐없이 연결해야 한다: Residual connection, Layer Normalization, gradient, 정규화. Self-Attention의 Q·K·V 역할과 encoder·decoder에서 허용되는 참조 범위를 구분해야 한다.",
      "hint": "Transformer에서 정의, 동작 원리, 비교 또는 해결 관계를 순서대로 정리한다."
    }
  ]
};

export const ALL_QUESTIONS: StudyQuestion[] = Object.values(QUESTION_BANK).flat();
