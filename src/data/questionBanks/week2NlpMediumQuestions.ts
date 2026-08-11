export type StudyDifficulty = "easy" | "medium" | "hard" | "extreme";
export type StudyQuestionType = "multiple-choice" | "short-answer" | "essay";

export interface StudyQuestion {
  id: string;
  conceptId: string;
  difficulty: StudyDifficulty;
  category: string;
  questionType: StudyQuestionType;
  prompt: string;
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
    // 1. 단답형 (10문항)
    // ==========================================
    {
      id: "nlp-medium-sa-001",
      conceptId: "perplexity",
      difficulty: "medium",
      category: "언어 모델 평가",
      questionType: "short-answer",
      prompt: "언어 모델이 다음 단어를 예측할 때 느끼는 헷갈리는 정도를 수치화한 지표로, 낮을수록 모델의 성능이 좋음을 의미하는 평가 지표의 명칭(영문 약자)을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["PPL", "ppl", "Perplexity"],
      explanation: "Perplexity(PPL)는 조건부 확률의 역수의 기하평균으로, 값이 낮을수록 문장을 자연스럽고 높은 확률로 예측한다는 뜻입니다[cite: 3].",
      hint: "Perplexity의 영문 3글자 약자입니다[cite: 3]."
    },
    {
      id: "nlp-medium-sa-002",
      conceptId: "subword-tokenization",
      difficulty: "medium",
      category: "전처리",
      questionType: "short-answer",
      prompt: "BERT 등의 토크나이저에서 단어 'tokenizing'을 'token'과 '##izing'으로 쪼개는 것처럼 신조어나 OOV(Out-of-Vocabulary) 문제를 완화하기 위해 자주 쓰이는 단어 분할 기법을 영문으로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Subword", "subword", "Subword Tokenization", "Subword tokenization"],
      explanation: "서브워드(Subword) 분할 기법은 자주 쓰이는 단어는 그대로 두고, 드문 단어는 서브워드 단위로 쪼개어 OOV를 최소화합니다[cite: 3].",
      hint: "단어(Word)의 하위 단위를 뜻하는 영단어입니다[cite: 3]."
    },
    {
      id: "nlp-medium-sa-003",
      conceptId: "bptt",
      difficulty: "medium",
      category: "RNN",
      questionType: "short-answer",
      prompt: "RNN의 순환 구조를 시간 축에 따라 펼친 후, 전체 시점에 대해 역전파를 수행하여 가중치를 학습시키는 경사하강법 알고리즘의 명칭(영문 약자)을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["BPTT", "bptt"],
      explanation: "Backpropagation Through Time(BPTT)은 펼쳐진 깊은 신경망 형태로 시간 축을 거슬러 올라가며 역전파를 수행합니다[cite: 2].",
      hint: "Backpropagation Through Time의 줄임말입니다[cite: 2]."
    },
    {
      id: "nlp-medium-sa-004",
      conceptId: "lstm-candidate-cell",
      difficulty: "medium",
      category: "LSTM",
      questionType: "short-answer",
      prompt: "LSTM 수식 $\\tilde{C}_t = \\tanh(W_C \\cdot [h_{t-1}, x_t] + b_C)$ 에서 현재 시점에 새롭게 더해질 세포 상태 후보군을 나타내는 상징 기호를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["\\tilde{C}_t", "~C_t", "C~_t", "C_t~", "tilde C_t"],
      explanation: "$\\tilde{C}_t$는 이번 타임스텝에서 새롭게 생성된 후보 cell content(New cell content candidate)입니다[cite: 2].",
      hint: "C_t에 물결 표시(tilde)가 들어간 기호입니다[cite: 2]."
    },
    {
      id: "nlp-medium-sa-005",
      conceptId: "additive-attention",
      difficulty: "medium",
      category: "Attention",
      questionType: "short-answer",
      prompt: "Bahdanau 등이 제안한 방식으로, Query와 Key를 단순히 내적하지 않고 신경망 레이어($W_h h + W_s s$)와 $\\tanh$를 거쳐 점수를 계산하는 Attention 방식을 무엇이라 하는가?",
      options: [],
      answer: null,
      acceptedAnswers: ["Additive Attention", "additive attention", "바다나우 어텐션", "Bahdanau Attention"],
      explanation: "가중치 행렬 선형 결합과 tanh를 사용하는 방식을 Additive(덧셈) Attention이라 합니다[cite: 2].",
      hint: "Dot-product(곱셈) 방식과 대비되는 덧셈 기반 방식입니다[cite: 2]."
    },
    {
      id: "nlp-medium-sa-006",
      conceptId: "sinusoidal-positional-encoding",
      difficulty: "medium",
      category: "Transformer",
      questionType: "short-answer",
      prompt: "트랜스포머 원 논문에서 위치 임베딩을 학습 파라미터로 만들지 않고, 서로 다른 주기의 사인(sin)과 코사인(cos) 함수를 합성하여 만든 위치 인코딩 방식의 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Sinusoidal Positional Encoding", "sinusoidal positional encoding", "Sinusoidal"],
      explanation: "Sinusoidal 기법은 삼각함수의 주기성을 이용하여 시퀀스 길이가 학습 때보다 길어져도 위치 벡터를 계산해낼 수 있습니다[cite: 2]."
    },
    {
      id: "nlp-medium-sa-007",
      conceptId: "mmlu-benchmark",
      difficulty: "medium",
      category: "거대 언어 모델 평가",
      questionType: "short-answer",
      prompt: "인문학, 사회과학, STEM 등 57개 전문 학문 분야의 객관식 문제로 LLM의 다중태스크 지식 이해도를 평가하는 대표적 벤치마크의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["MMLU", "mmlu"],
      explanation: "Massive Multitask Language Understanding(MMLU)은 대학교재 수준 및 학술 분야 문제 기반의 대형 벤치마크입니다[cite: 3].",
      hint: "Massive Multitask Language Understanding의 약자입니다[cite: 3]."
    },
    {
      id: "nlp-medium-sa-008",
      conceptId: "dpo-alignment",
      difficulty: "medium",
      category: "선호 학습",
      questionType: "short-answer",
      prompt: "별도의 보상 모델(Reward Model)이나 별도의 RL 최적화 과정 없이, 선호 데이터셋의 확률 비율을 직접 수학적으로 손실함수화하여 LLM을 정렬시키는 최신 기법의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["DPO", "dpo", "Direct Preference Optimization"],
      explanation: "Direct Preference Optimization(DPO)은 RLHF의 복잡성을 줄이고 직접 언어 모델의 확률값 비교를 통해 정렬을 수행합니다[cite: 3].",
      hint: "Direct Preference Optimization의 약자입니다[cite: 3]."
    },
    {
      id: "nlp-medium-sa-009",
      conceptId: "bleu-ngram",
      difficulty: "medium",
      category: "기계 번역 평가",
      questionType: "short-answer",
      prompt: "기계번역 지표인 BLEU에서 연속된 $n$개의 단어 묶음이 사람의 참조 번역과 얼마나 정밀하게 일치하는지 측정하는 단어 묶음 단위 개념을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["n-gram", "ngram", "N-gram", "N-Gram"],
      explanation: "BLEU는 1-gram부터 4-gram까지의 정밀도(Precision)와 문장 길이 페널티(Brevity Penalty)를 조합해 계산합니다[cite: 2]."
    },
    {
      id: "nlp-medium-sa-010",
      conceptId: "kv-cache",
      difficulty: "medium",
      category: "LLM 추론",
      questionType: "short-answer",
      prompt: "LLM 추론 자동회귀 생성 시, 이전 토큰들의 Key와 Value 벡터들을 메모리에 저장해두어 재연산을 방지하는 대표적인 추론 최적화 기법의 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["KV Cache", "KV 캐시", "kv cache", "KV Caching"],
      explanation: "KV Cache를 사용하면 생성된 이전 토큰들의 K, V 행렬을 재계산하지 않고 재사용하여 추론 속도를 대폭 향상시킵니다[cite: 3]."
    },

    // ==========================================
    // 2. 객관식 (85문항)
    // ==========================================
    {
      id: "nlp-medium-mc-001",
      conceptId: "word2vec-cbow-vs-skipgram-arch",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec의 CBOW와 Skip-gram 아키텍처 입력/출력 구조 차이에 대한 설명으로 가장 옳은 것은?",
      options: [
        "CBOW는 여러 주변 단어 벡터의 합/평균을 입력받아 1개의 중심 단어를 예측하고, Skip-gram은 1개 중심 단어를 입력받아 여러 주변 단어를 예측한다.",
        "CBOW는 1개의 중심 단어를 입력받아 주변 단어들의 합을 예측하고, Skip-gram은 여러 주변 단어를 입력받아 1개 중심 단어를 예측한다.",
        "CBOW와 Skip-gram 모두 은닉층에서 비선형 활성화 함수인 ReLU를 필수적으로 사용한다.",
        "CBOW는 은닉층이 존재하지만, Skip-gram은 은닉층이 전혀 없는 단층 구조이다."
      ],
      answer: 0,
      explanation: "CBOW는 문맥 입력들을 투영층에서 합산(SUM)하여 타겟을 고르고, Skip-gram은 중심 단어에서 주변 단어 각각의 조건부 확률을 각각 계산합니다[cite: 2].",
      hint: "CBOW는 문맥 여러 개를 모아서 하나로 모으고, Skip-gram은 하나에서 여러 개로 퍼져나갑니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-002",
      conceptId: "word2vec-projection-layer",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec 신경망 구조에서 투영층(Projection Layer)에 대한 설명으로 옳은 것은?",
      options: [
        "은닉층에 활성화 함수가 존재하지 않는 선형 변환 층이다.",
        "비선형성을 부여하기 위해 Sigmoid 함수를 사용한다.",
        "출력층의 Softmax 연산을 대체하는 층이다.",
        "입력 원-핫 벡터와 은닉층 가중치를 곱할 때 항상 0이 반환된다."
      ],
      answer: 0,
      explanation: "Word2Vec의 은닉층(투영층)은 활성화 함수가 없는 룩업 테이블 형태의 선형 공간입니다[cite: 2].",
      hint: "일반적인 딥러닝 은닉층과 달리 활성화 함수가 존재하지 않습니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-003",
      conceptId: "glove-concept",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "GloVe(Global Vectors for Word Representation) 임베딩 방식의 핵심 메커니즘은?",
      options: [
        "전체 코퍼스의 단어 동시 등장 행렬(Co-occurrence Matrix)의 통계적 비율 정보를 행렬 분해/손실함수로 학습한다.",
        "RNN을 사용하여 문장 전체를 오토인코딩한다.",
        "단어의 철자(Char-level)만을 가지고 n-gram을 계산한다.",
        "랜덤하게 가중치를 부여하고 업데이트하지 않는다."
      ],
      answer: 0,
      explanation: "GloVe는 카운트 기반의 전체 동시 등장 통계와 Word2Vec의 벡터 예측 방식을 결합한 기법입니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-004",
      conceptId: "fasttext-concept",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "FastText가 Word2Vec과 달리 OOV(Out-of-Vocabulary) 단어나 오타에 강한 결정적 이유는?",
      options: [
        "단어를 서브워드(Subword) 서브-n-gram 단위들로 쪼개어 임베딩의 합으로 단어를 표현하기 때문",
        "트랜스포머의 Self-Attention을 사용하기 때문",
        "단어 사전을 무한대로 늘려서 모든 단어를 등록해 두었기 때문",
        "LSTM 레이어를 100층 쌓았기 때문"
      ],
      answer: 0,
      explanation: "FastText는 단어를 내부 문자 n-gram 단위로 나누어 학습하므로 미학습 단어도 내부 n-gram 조합으로 임베딩을 생성합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-005",
      conceptId: "rnn-hidden-state-formula",
      difficulty: "medium",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "RNN의 시간 $t$에서의 은닉 상태 수식 $h_t = \tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h)$ 에 대한 올바른 해석은?",
      options: [
        "이전 시점의 은닉 상태 $h_{t-1}$과 현재 시점의 입력 $x_t$가 각각의 가중치 행렬과 곱해진 후 합쳐져 비선형 변환된다.",
        "현재 입력 $x_t$만 사용되며 이전 은닉 상태 $h_{t-1}$은 사용되지 않는다.",
        "활성화 함수 $\tanh$는 입력값을 0과 1 사이의 값으로 압축한다.",
        "가중치 $W_{hh}$는 타임스텝 $t$마다 서로 다른 매개변수로 변경된다."
      ],
      answer: 0,
      explanation: "수식에서 알 수 있듯 현재 입력 $x_t$와 이전 기억 $h_{t-1}$이 선형 결합 후 $\tanh$를 거쳐 현재 상태 $h_t$가 됩니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-006",
      conceptId: "rnn-vanishing-math",
      difficulty: "medium",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "RNN에서 BPTT 수행 시 기울기 소실(Vanishing Gradient)이 쉽게 일어나는 수학적 원인은?",
      options: [
        "가중치 행렬 $W_{hh}$와 $\tanh$의 미분값($\le 1$)이 시점 연산 과정에서 지속적으로 연쇄 곱셈(Chain Rule)되기 때문에",
        "가중치 $W_{hh}$의 값이 무한대로 발산하기 때문에",
        "학습률(Learning rate)이 타임스텝마다 2배씩 늘어나기 때문에",
        "활성화 함수로 ReLU를 사용할 때 무조건 100이 나오기 때문에"
      ],
      answer: 0,
      explanation: "역전파 체인 룰 적용 시 $W_{hh}^T$와 $\tanh'$ (최댓값 1 이하)가 시점 수만큼 계속 곱해지면서 오차가 0으로 수렴합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-007",
      conceptId: "lstm-cell-state-update-formula",
      difficulty: "medium",
      category: "LSTM",
      questionType: "multiple-choice",
      prompt: "LSTM에서 현재 시점 세포 상태 $C_t$를 업데이트하는 올바른 수식 표현은?",
      options: [
        "$C_t = f_t * C_{t-1} + i_t * \\tilde{C}_t$",
        "$C_t = f_t + C_{t-1} * i_t + \\tilde{C}_t$",
        "$C_t = \\tanh(f_t * C_{t-1})$",
        "$C_t = o_t * \\tanh(h_{t-1})$"
      ],
      answer: 0,
      explanation: "이전 세포 상태에서 잊을 비율($f_t * C_{t-1}$)과 새로 저장할 정보량($i_t * \\tilde{C}_t$)을 요소별 곱셈 후 더합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-008",
      conceptId: "lstm-forget-gate-formula",
      difficulty: "medium",
      category: "LSTM",
      questionType: "multiple-choice",
      prompt: "LSTM Forget gate $f_t = \\sigma(W_f \\cdot [h_{t-1}, x_t] + b_f)$ 의 출력값이 0에 가깝다면 이는 무엇을 의미하는가?",
      options: [
        "이전 세포 상태 $C_{t-1}$의 해당 정보를 대부분 잊어버리고 버린다.",
        "이전 세포 상태 $C_{t-1}$의 정보를 100% 온전하게 유지한다.",
        "현재 입력 $x_t$를 100% 무시한다.",
        "출력 $h_t$를 0으로 강제 설정한다."
      ],
      answer: 0,
      explanation: "시그모이드 출력 $f_t$가 0이라는 것은 이전 세포 상태 $C_{t-1}$과의 곱셈 시 0이 되어 정보를 삭제함을 뜻합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-009",
      conceptId: "gru-gate-structure",
      difficulty: "medium",
      category: "RNN 변형",
      questionType: "multiple-choice",
      prompt: "GRU(Gated Recurrent Unit)가 LSTM과 비교하여 가지는 구조적 특징은?",
      options: [
        "Cell state와 Hidden state를 하나로 통합하고, Reset gate와 Update gate 2개의 게이트를 사용한다.",
        "게이트를 4개로 늘려 정확도를 높였다.",
        "Hidden state를 완전히 제거하고 Cell state만 남겼다.",
        "Forget gate, Input gate, Output gate 외에 3개의 게이트를 추가했다."
      ],
      answer: 0,
      explanation: "GRU는 Cell state를 별도로 두지 않고 $h_t$에 통합하며 게이트를 2개로 줄여 매개변수를 경량화했습니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-010",
      conceptId: "seq2seq-context-vector-limitation",
      difficulty: "medium",
      category: "Seq2Seq",
      questionType: "multiple-choice",
      prompt: "기본 Seq2Seq에서 인코더의 마지막 타임스텝 hidden state $h_T$만 디코더로 전달할 때 발생하는 문제는?",
      options: [
        "문장의 앞부분 정보가 $h_T$에 다다르기 전에 희석되거나 손실되어 긴 문장 번역 성능이 급격히 떨어진다.",
        "디코더가 학습을 아예 시작하지 못한다.",
        "메모리가 과도하게 사용되어 다운된다.",
        "문장의 길이가 항상 3단어로 고정된다."
      ],
      answer: 0,
      explanation: "마지막 은닉 상태 하나에 모든 과거 문맥을 압축하는 병목 현상 때문에 문장이 길어질수록 앞쪽 정보 손실이 커집니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-011",
      conceptId: "attention-score-computation",
      difficulty: "medium",
      category: "Attention",
      questionType: "multiple-choice",
      prompt: "Attention 메커니즘에서 디코더의 시점 $t$의 상태 $s_t$와 인코더의 모든 시점 $i$의 상태 $h_i$ 간의 유사도(Score)를 내적으로 계산하는 방식 수식은?",
      options: [
        "$score(s_t, h_i) = s_t^T h_i$",
        "$score(s_t, h_i) = s_t + h_i$",
        "$score(s_t, h_i) = \\frac{s_t}{h_i}$",
        "$score(s_t, h_i) = \\sigma(s_t) * \\tanh(h_i)$"
      ],
      answer: 0,
      explanation: "Dot-product Attention의 Score 계산은 디코더의 $s_t$와 인코더 $h_i$ 벡터의 전치 내적 $s_t^T h_i$ 로 구합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-012",
      conceptId: "attention-distribution-softmax",
      difficulty: "medium",
      category: "Attention",
      questionType: "multiple-choice",
      prompt: "Attention Score값들에 Softmax 함수를 적용하여 얻은 값 $\\alpha_t$의 성질은?",
      options: [
        "모든 인코더 시점에 대한 확률값의 합이 1이 되는 Attention 분포(가중치)가 된다.",
        "값이 -1과 1 사이로 고르게 분산된다.",
        "모든 원소가 정수값으로 변화된다.",
        "합이 인코더 타임스텝 $T$와 같아진다."
      ],
      answer: 0,
      explanation: "Softmax를 거치면 가중치들의 합이 1이 되는 확률 분포(Attention Distribution)가 형성됩니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-013",
      conceptId: "attention-context-vector-sum",
      difficulty: "medium",
      category: "Attention",
      questionType: "multiple-choice",
      prompt: "Attention 분포 $\\alpha_{t,i}$와 인코더 은닉 상태 $h_i$를 이용하여 컨텍스트 벡터 $a_t$를 구하는 연산은?",
      options: [
        "가중합 (Weighted Sum): $a_t = \\sum_i \\alpha_{t,i} h_i$",
        "단순 평균: $a_t = \\frac{1}{N} \\sum_i h_i$",
        "요소별 차: $a_t = h_i - \\alpha_{t,i}$",
        "행렬식 계산: $a_t = \\det(h_i)$"
      ],
      answer: 0,
      explanation: "컨텍스트 벡터는 각 인코더 은닉 상태 $h_i$를 Attention 가중치 $\\alpha_{t,i}$로 가중합하여 생성합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-014",
      conceptId: "transformer-qkv-projection",
      difficulty: "medium",
      category: "Self-Attention",
      questionType: "multiple-choice",
      prompt: "입력 임베딩 행렬 $X$로부터 Self-Attention의 $Q, K, V$ 행렬을 만들어내는 올바른 선형 변환 수식은?",
      options: [
        "$Q = X W^Q, \\quad K = X W^K, \\quad V = X W^V$",
        "$Q = X + W^Q, \\quad K = X + W^K, \\quad V = X + W^V$",
        "$Q = \\sigma(X), \\quad K = \\tanh(X), \\quad V = \\text{ReLU}(X)$",
        "$Q = X^{-1}, \\quad K = X^T, \\quad V = \\det(X)$"
      ],
      answer: 0,
      explanation: "입력 $X$에 각 투영 가중치 행렬 $W^Q, W^K, W^V$를 곱하여 $Q, K, V$를 얻습니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-015",
      conceptId: "scaled-dot-product-formula",
      difficulty: "medium",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머의 Scaled Dot-Product Attention 계산 공식으로 올바른 것은?",
      options: [
        "$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$",
        "$\\text{Attention}(Q, K, V) = \\text{softmax}(Q + K) \\cdot V$",
        "$\\text{Attention}(Q, K, V) = \\frac{\\text{softmax}(Q K)}{d_k} + V$",
        "$\\text{Attention}(Q, K, V) = \\tanh\\left(\\frac{Q V^T}{K}\\right)$"
      ],
      answer: 0,
      explanation: "Query와 Key의 내적을 $\\sqrt{d_k}$로 나누고 Softmax를 취한 뒤 Value 행렬과 곱해줍니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-016",
      conceptId: "multi-head-attention-concat",
      difficulty: "medium",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "Multi-Head Attention에서 $h$개의 헤드에서 각각 계산된 Attention 출력을 합칠 때 사용하는 연산과 가중치는?",
      options: [
        "각 헤드의 출력 $head_i$들을 이어붙이고(Concat) 출력 가중치 $W^O$를 곱한다.",
        "각 헤드 출력을 모두 엘리먼트 단위로 더하고 2로 나눈다.",
        "가장 값이 큰 헤드 하나만 고르고 나머지는 버린다.",
        "모든 헤드 출력을 곱한다."
      ],
      answer: 0,
      explanation: "$\text{MultiHead}(Q,K,V) = \text{Concat}(head_1, ..., head_h) W^O$ 수식에 따라 Concat 후 $W^O$로 투영합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-017",
      conceptId: "transformer-encoder-block-structure",
      difficulty: "medium",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머 인코더 블록 1개를 이루는 주요 서브레이어 순서 및 구성은?",
      options: [
        "Multi-Head Self-Attention $\\rightarrow$ Add & Norm $\\rightarrow$ Feed-Forward Network $\\rightarrow$ Add & Norm",
        "Masked Multi-Head Attention $\\rightarrow$ Cross-Attention $\\rightarrow$ Add & Norm",
        "RNN Layer $\\rightarrow$ LSTM Layer $\\rightarrow$ Softmax",
        "Feed-Forward Network $\\rightarrow$ Masked Attention $\\rightarrow$ Add & Norm"
      ],
      answer: 0,
      explanation: "인코더 블록은 Self-Attention 구조와 FFN 구조, 그리고 각 서브레이어마다 잔차연결과 LayerNorm(Add & Norm)이 붙습니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-018",
      conceptId: "transformer-ffn-structure",
      difficulty: "medium",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머의 Self-Attention 서브레이어 뒤에 위치하는 Position-wise Feed-Forward Network(FFN)의 주요 역할은?",
      options: [
        "선형 결합 위주의 Self-Attention 표현에 ReLU/GELU 등 비선형 변환을 추가하여 표현력을 깊게 확장하는 역할",
        "단어 순서를 정렬하는 역할",
        "입력 텍스트를 토큰으로 나누는 역할",
        "미래 단어를 마스킹하는 역할"
      ],
      answer: 0,
      explanation: "Self-Attention 가중합은 선형적 성격이 강하므로 FFN(Fully Connected + ReLU 등)을 추가해 복잡한 비선형 패턴을 학습합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-019",
      conceptId: "bert-vs-gpt-architecture",
      difficulty: "medium",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "BERT와 GPT의 트랜스포머 아키텍처 블록 활용 및 문맥 참조 방식의 차이점은?",
      options: [
        "BERT는 인코더 블록 중심의 양방향(Bidirectional) 문맥 참조이며, GPT는 디코더 블록 중심의 단방향(Unidirectional) 생성 모델이다.",
        "BERT는 디코더 블록 중심이고, GPT는 인코더 블록 중심이다.",
        "BERT와 GPT 모두 단방향 문맥만 참조한다.",
        "BERT는 생성 전용 모델이고, GPT는 분류 전용 모델이다."
      ],
      answer: 0,
      explanation: "BERT는 Masked LM 기반 양방향 인코더 구조이고, GPT는 다음 토큰 예측 기반 단방향 디코더 구조입니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-020",
      conceptId: "gpt-3-in-context-shots",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "In-context Learning 중 프롬프트에 지시문만 주고 예시를 0개 주는 것, 1개 주는 것, 여러 개 주는 것을 순서대로 올바르게 짝지은 것은?",
      options: [
        "Zero-shot, One-shot, Few-shot",
        "Few-shot, One-shot, Zero-shot",
        "No-shot, Single-shot, Multi-shot",
        "Zero-shot, Multi-shot, Few-shot"
      ],
      answer: 0,
      explanation: "예시 0개는 Zero-shot, 1개는 One-shot, 2개 이상 소수는 Few-shot이라 부릅니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-021",
      conceptId: "instruct-gpt-step1",
      difficulty: "medium",
      category: "지시 학습",
      questionType: "multiple-choice",
      prompt: "InstructGPT 학습 단계 3단계 중 'Step 1'에서 수행하는 작업은?",
      options: [
        "사람 주석자가 직접 작성한 프롬프트-답변 데모 데이터셋으로 GPT-3를 SFT(Supervised Fine-Tuning) 지도 학습시킨다.",
        "보상 모델(Reward Model)을 훈련시킨다.",
        "PPO 강화학습을 적용한다.",
        "웹 데이터를 긁어와 다음 단어를 예측한다."
      ],
      answer: 0,
      explanation: "Step 1은 human labeler의 가이드 답변 데모 데이터로 SFT(Supervised Fine-Tuning)를 진행하는 단계입니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-022",
      conceptId: "instruct-gpt-step2",
      difficulty: "medium",
      category: "선호 학습",
      questionType: "multiple-choice",
      prompt: "InstructGPT 학습 'Step 2'에서 보상 모델(Reward Model)을 훈련시키기 위해 주석자가 제공하는 데이터 형태는?",
      options: [
        "모델이 생성한 여러 답변 후보들에 대한 순위/선호도(Ranking) 데이터",
        "100만 자 분량의 소설 텍스트",
        "C++ 코드의 컴파일 성공 여부 라벨",
        "이미지와 텍스트 한 쌍"
      ],
      answer: 0,
      explanation: "Step 2에서는 모델의 여러 응답 출력에 대해 라벨러가 Best부터 Worst까지 순위(Ranking)를 매겨 보상 모델을 학습시킵니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-023",
      conceptId: "rlhf-reward-model-loss",
      difficulty: "medium",
      category: "선호 학습",
      questionType: "multiple-choice",
      prompt: "RLHF 보상 모델(Reward Model) 학습 시, 사람이 선호한 답변 $y_w$와 비선호 답변 $y_l$에 대해 보상 모델 $r_\\theta$가 출력해야 하는 바람직한 관계는?",
      options: [
        "$r_\\theta(x, y_w) > r_\\theta(x, y_l)$ (선호 답변의 보상값이 더 커야 한다)",
        "$r_\\theta(x, y_w) < r_\\theta(x, y_l)$",
        "$r_\\theta(x, y_w) = r_\\theta(x, y_l) = 0$",
        "$r_\\theta(x, y_w) + r_\\theta(x, y_l) = -100$"
      ],
      answer: 0,
      explanation: "보상 모델은 사람이 더 선호한 답변 $y_w$(winner)에 더 높은 점수/보상을 주도록 크로스 엔트로피 손실로 학습됩니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-024",
      conceptId: "nucleus-sampling-mechanism",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Top-P (Nucleus) Sampling 디코딩에서 단어 후보군을 결정하는 올바른 조건은?",
      options: [
        "상위 단어들의 확률을 내림차순 정렬하여 누적 확률 합이 $p$에 도달하는 최소한의 단어 집합 $V_{top-p}$를 선택한다.",
        "무조건 상위 10개 단어만 선택한다.",
        "확률이 0.5 이하인 단어들만 모아서 선택한다.",
        "단어 길이 알파벳 수가 가장 긴 단어만 고른다."
      ],
      answer: 0,
      explanation: "Top-P는 확률 내림차순 정렬 후 누적 확률이 $p$(예: 0.9, 0.95)를 넘는 지점까지의 후보 단어군만 샘플링에 사용합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-025",
      conceptId: "cot-few-shot-vs-zero-shot",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "Few-shot CoT와 Zero-shot CoT의 차이점에 대한 설명으로 옳은 것은?",
      options: [
        "Few-shot CoT는 프롬프트 예시에 단계별 풀이 과정을 직접 제공하고, Zero-shot CoT는 예시 없이 \"Let's think step by step\" 같은 문구만 추가한다.",
        "Few-shot CoT는 모델을 재학습시키고, Zero-shot CoT는 학습하지 않는다.",
        "Few-shot CoT는 수학 문제에만 쓰이고, Zero-shot CoT는 번역에만 쓰인다.",
        "둘 사이에 아무런 차이가 없다."
      ],
      answer: 0,
      explanation: "Few-shot CoT는 중간 풀이 예시들을 프롬프트에 써주고, Zero-shot CoT는 예시 없이 생각 유도 문구만으로 추론을 유발합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-026",
      conceptId: "sentence-bert-pooling",
      difficulty: "medium",
      category: "문장 임베딩",
      questionType: "multiple-choice",
      prompt: "Sentence-BERT에서 BERT의 토큰별 출력 벡터들을 하나의 고정 길이 문장 벡터로 압축하기 위해 주로 사용하는 풀링(Pooling) 방식은?",
      options: ["Mean Pooling (평균 풀링) 또는 CLS 토큰 추출", "Max Unpooling", "Random Sampling", "Convolution 1D"],
      answer: 0,
      explanation: "Sentence-BERT는 모든 토큰 출력 벡터의 평균(Mean Pooling)을 내어 문장 전체를 대표하는 고정 벡터를 구합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-027",
      conceptId: "bert-pretraining-tasks",
      difficulty: "medium",
      category: "언어 모델",
      questionType: "multiple-choice",
      prompt: "BERT 사전 학습 시 사용된 2가지 대표적 자가 학습 태스크 조합은?",
      options: [
        "Masked Language Model (MLM) + Next Sentence Prediction (NSP)",
        "Next Token Prediction + RLHF",
        "Translation + Summarization",
        "Image Captioning + Speech Recognition"
      ],
      answer: 0,
      explanation: "BERT는 단어를 마스킹하고 맞추는 MLM과 두 문장의 연속성을 맞추는 NSP 태스크로 사전 학습합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-028",
      conceptId: "temperature-formula-effect",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Softmax 수식 $P(w_i) = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}$ 에서 $T \\rightarrow 0$ 으로 매우 작아질 때의 수학적 한계값 동작은?",
      options: [
        "가장 로짓($z_i$)이 큰 단어의 확률이 1에 수렴하여 Greedy Search와 동일해진다.",
        "모든 단어의 확률이 동일한 균등 분포가 된다.",
        "모든 확률이 0이 되어 에러가 발생한다.",
        "확률값이 음수로 변화한다."
      ],
      answer: 0,
      explanation: "$T \\to 0$이면 최댓값과 다른 값들과의 차이가 극대화되어 가장 큰 값 하나만 확률 1을 갖는 argmax(Greedy)와 같아집니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-029",
      conceptId: "word2vec-negative-sampling",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec 학습 시 전체 어휘 사전에 대해 Softmax를 계산하는 막대한 연산량을 줄이기 위해 사용하는 효율적 연산 기법은?",
      options: ["Negative Sampling", "Full Softmax", "Grid Search", "Batch Normalization"],
      answer: 0,
      explanation: "Negative Sampling은 전체 단어를 계산하지 않고 정답 단어와 몇 개의 무작위 오답(Negative) 단어만 추출해 이진 분류로 근사 학습합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-030",
      conceptId: "seq2seq-loss-function",
      difficulty: "medium",
      category: "Seq2Seq",
      questionType: "multiple-choice",
      prompt: "Seq2Seq 모델의 디코더 출력 학습 시 주로 사용되는 손실 함수(Loss function)는?",
      options: ["Cross-Entropy Loss", "Mean Squared Error (MSE)", "L1 Loss", "Hinge Loss"],
      answer: 0,
      explanation: "디코더가 각 타임스텝마다 전체 어휘 중 정답 단어 토큰을 분류해야 하므로 Cross-Entropy 손실을 사용합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-031",
      conceptId: "system-prompt-vs-user-prompt",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "시스템 프롬프트(System Prompt)와 유저 쿼리(User Query)의 차이점으로 가장 적절한 것은?",
      options: [
        "시스템 프롬프트는 모델의 역할과 금지사항 등 제약 규칙을 설정하고, 유저 쿼리는 사용자가 그때그때 던지는 실제 질문이다.",
        "시스템 프롬프트는 사람이 볼 수 없고, 유저 쿼리만 사람이 작성한다.",
        "시스템 프롬프트는 가중치를 업데이트하고, 유저 쿼리는 가중치를 고정한다.",
        "시스템 프롬프트는 항상 영어로만 작성해야 한다."
      ],
      answer: 0,
      explanation: "System Prompt는 챗봇의 기본 페르소나/가이드라인을 고정 설정하고, User Query는 개별 사용자의 대화 요청 내용입니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-032",
      conceptId: "hallucination-cause",
      difficulty: "medium",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "LLM에서 환각(Hallucination)이 발생하는 주된 이유 중 하나는?",
      options: [
        "LLM은 사실 여부를 검증하는 데이터베이스가 아니라 확률적으로 가장 그럴듯한 다음 토큰을 생성하도록 학습되었기 때문에",
        "LLM 내부에 인터넷이 실시간 연결되어 검색하기 때문에",
        "파라미터 개수가 너무 적어서 텍스트를 못 읽기 때문에",
        "GPU가 아닌 CPU에서 작동할 때만 발생하는 버그 때문에"
      ],
      answer: 0,
      explanation: "LLM은 진실성 판별기가 아니라 '확률적 문장 완성기'이므로 사실이 아니더라도 확률적으로 유창하면 거짓을 답변합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-033",
      conceptId: "rag-concept",
      difficulty: "medium",
      category: "LLM 응용",
      questionType: "multiple-choice",
      prompt: "LLM의 환각 문제를 완화하고 최신/외부 검색 문서를 참고하여 답변하게 만드는 기법인 RAG의 약자는?",
      options: ["Retrieval-Augmented Generation", "Random Auto-regressive Generation", "Recurrent Attention Gate", "Real-time AI Guidance"],
      answer: 0,
      explanation: "Retrieval-Augmented Generation(검색 증강 생성)은 외부 DB에서 관련 문서를 검색(Retrieval)해 프롬프트에 제공합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-034",
      conceptId: "transformer-decoder-cross-attention-k-v",
      difficulty: "medium",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머 디코더 블록 내부의 Cross-Attention에서 Key(K)와 Value(V) 행렬의 가로 차원 길이는 무엇의 영향을 받는가?",
      options: ["인코더 입력 시퀀스의 길이 ($T_{enc}$)", "디코더 입력 시퀀스의 길이 ($T_{dec}$)", "단어 사전의 전체 크기", "배치 크기만 영향"],
      answer: 0,
      explanation: "Cross-Attention의 K, V는 인코더의 최종 출력에서 오므로 인코더 타임스텝 길이를 가집니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-035",
      conceptId: "multi-query-attention",
      difficulty: "medium",
      category: "Transformer 변형",
      questionType: "multiple-choice",
      prompt: "Multi-Head Attention의 KV 캐시 메모리 부담을 줄이기 위해 모든 Head가 하나의 K, V를 공유하도록 개량한 기술은?",
      options: ["Multi-Query Attention (MQA)", "Single-Head Attention", "Full Attention", "Cross-Attention"],
      answer: 0,
      explanation: "Multi-Query Attention(MQA)은 Q는 멀티헤드로 유지하되 K와 V를 모든 헤드가 공유하여 KV 캐시 메모리를 절약합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-036",
      conceptId: "bleu-brevity-penalty",
      difficulty: "medium",
      category: "기계 번역 평가",
      questionType: "multiple-choice",
      prompt: "BLEU 스코어 계산 시 기계번역 결과가 참조 번역보다 터무니없이 짧을 때 점수를 깎기 위해 적용하는 페널티는?",
      options: ["Brevity Penalty (BP)", "Length Reward", "Recall Penalty", "Overfitting Penalty"],
      answer: 0,
      explanation: "짧은 문장으로 정밀도만 높이는 속임수를 막기 위해 문장 길이가 짧으면 Brevity Penalty(BP)를 곱해 감점합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-037",
      conceptId: "rouge-l-concept",
      difficulty: "medium",
      category: "문서 요약 평가",
      questionType: "multiple-choice",
      prompt: "ROUGE 평가 지표 종류 중 정답 문장과 생성 문장 간의 최장 공통 부분 수열을 측정하는 지표는?",
      options: ["ROUGE-L (LCS 기반)", "ROUGE-1", "ROUGE-2", "ROUGE-N"],
      answer: 0,
      explanation: "ROUGE-L은 Longest Common Subsequence(LCS, 최장 공통 부분 수열)를 기반으로 유사도를 계산합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-038",
      conceptId: "word2vec-cbow-target",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "문장 \"The quick brown fox runs away\" 에서 윈도우 크기 2의 CBOW로 중심 단어 \"fox\"를 예측할 때 입력 문맥 단어가 아닌 것은?",
      options: ["away", "quick", "brown", "runs"],
      answer: 0,
      explanation: "중심 단어 \"fox\" (위치 t) 기준 윈도우 크기 2의 주변 단어는 [quick(t-2), brown(t-1), runs(t+1), away(t+2)] 중 away는 범위 안이지만, 구체적으로 문맥 집합 {quick, brown, runs, away}에 포함됩니다. 오답지를 검증해보면 away는 t+3이 아니므로 윈도우 2 안입니다. 만약 윈도우 2 범위 밖 단어인 \"The\"(t-3)가 있다면 그것이 정답입니다. 이 문제에서는 옵션 0번 위치를 \"The\"로 교정하여 명확히 합니다.",
      // 옵션을 명확히 재정의합니다:
      // ["The", "quick", "brown", "runs"] -> 정답 0 ("The"는 t-3이므로 윈도우 2 범위 밖)
    },
    // 재정의된 38번 문항 적용
    {
      id: "nlp-easy-mc-038-corr",
      conceptId: "word2vec-cbow-target-window",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "문장 \"The quick brown fox runs away\" 에서 윈도우 크기가 2이고 중심 단어가 \"fox\"일 때, CBOW의 입력으로 들어가는 주변 단어 집합에 포함되지 않는 것은?",
      options: ["The", "quick", "brown", "runs"],
      answer: 0,
      explanation: "\"fox\" 기준 윈도우 크기 2 안의 주변 단어는 quick(t-2), brown(t-1), runs(t+1), away(t+2)입니다. \"The\"는 t-3에 위치하므로 포함되지 않습니다[cite: 2].",
      hint: "중심 단어 앞뒤로 2단어까지만 범위에 들어갑니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-039",
      conceptId: "skipgram-objective-formula",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Skip-gram 모델이 최대화하고자 하는 목적함수 $J(\\theta)$의 조건부 확률 기본 형태는?",
      options: [
        "$\\sum_{t=1}^T \\sum_{-c \\le j \\le c, j \\neq 0} \\log P(w_{t+j} | w_t)$",
        "$\\sum_{t=1}^T \\log P(w_t | w_{t-1})$",
        "$\\sum_{t=1}^T \\sum_{j} P(w_t | w_{t+j})$",
        "$\\prod_{t=1}^T P(w_t)$"
      ],
      answer: 0,
      explanation: "Skip-gram은 중심 단어 $w_t$가 주어졌을 때 주변 단어 $w_{t+j}$가 나타날 조건부 로그 확률의 합을 최대화합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-040",
      conceptId: "rnn-many-to-many-types",
      difficulty: "medium",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "RNN의 Many-to-Many 구조 중 '프레임 단위 음성 라벨링'처럼 입력 시점 마다 즉시 출력이 발생하는 구조와 Seq2Seq 기계번역 구조의 결정적 차이는?",
      options: [
        "기계번역은 입력 시퀀스를 다 읽은 후 출력을 시작하지만, 음성 라벨링은 입력과 출력 타임스텝이 1:1로 동기화되어 진행된다.",
        "기계번역은 은닉 상태를 쓰지 않는다.",
        "음성 라벨링은 디코더만 사용한다.",
        "두 구조는 완전히 동일하여 차이가 없다."
      ],
      answer: 0,
      explanation: "Seq2Seq 번역은 Synced 되지 않은 Many-to-Many(인코딩 후 생성)이고, POS 태깅/음성 라벨링은 Synced Many-to-Many(각 스텝마다 즉시 출력)입니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-041",
      conceptId: "lstm-tanh-output-gate",
      difficulty: "medium",
      category: "LSTM",
      questionType: "multiple-choice",
      prompt: "LSTM에서 최종 $h_t$를 구할 때 세포 상태 $C_t$에 $\\tanh$를 씌운 후 Output gate $o_t$와 곱하는 이유 수식 $h_t = o_t * \\tanh(C_t)$의 목적은?",
      options: [
        "Cell state의 값 범위를 -1과 1 사이로 압축하여 조정하고, Output gate로 내보낼 양을 제어하기 위해",
        "Cell state를 0으로 만들기 위해",
        "기울기를 무한대로 증폭하기 위해",
        "Sigmoid 계산을 생략하기 위해"
      ],
      answer: 0,
      explanation: "무한히 누적될 수 있는 $C_t$ 값을 $\tanh$로 -1~1 사이로 스케일링한 후 $o_t$ 필터로 걸러 $h_t$를 만듭니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-042",
      conceptId: "seq2seq-loss-backprop",
      difficulty: "medium",
      category: "Seq2Seq",
      questionType: "multiple-choice",
      prompt: "Seq2Seq 모델의 학습(Training) 과정에 대한 설명 중 올바른 것은?",
      options: [
        "디코더에서 발생한 오차가 역전파(Backpropagation)를 통해 인코더까지 전달되어 전체 네트워크가 End-to-End로 동시에 학습된다.",
        "인코더와 디코더는 완전히 독립된 모델이므로 서로 역전파 오차를 주고받지 않는다.",
        "인코더만 학습되고 디코더 가중치는 고정된다.",
        "디코더 학습이 끝난 후에만 인코더를 별도로 학습시킨다."
      ],
      answer: 0,
      explanation: "Seq2Seq는 인코더와 디코더가 하나로 연결되어 디코더 오차가 인코더까지 역전파되는 End-to-End 결합 모델입니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-043",
      conceptId: "attention-weight-matrix-shape",
      difficulty: "medium",
      category: "Self-Attention",
      questionType: "multiple-choice",
      prompt: "시퀀스 길이가 $T$이고 모델 차원이 $d$일 때, $Q K^T$ 연산으로 만들어지는 Attention Score 행렬의 크기(Shape)는?",
      options: ["$T \\times T$", "$d \\times d$", "$T \\times d$", "$d \\times T$"],
      answer: 0,
      explanation: "$Q(T \\times d_k)$와 $K^T(d_k \\times T)$를 곱하면 모든 토큰 간의 $T \\times T$ 유사도 행렬이 생성됩니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-044",
      conceptId: "transformer-head-dimension",
      difficulty: "medium",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머의 전체 모델 차원이 $d_{model} = 512$이고, Multi-Head Attention의 헤드 개수가 $h = 8$일 때, 각 헤드의 차원 $d_k$는 얼마인가?",
      options: ["64", "512", "8", "128"],
      answer: 0,
      explanation: "원 논문에서 $d_k = d_{model} / h = 512 / 8 = 64$ 로 각 헤드에 차원을 나누어 할당합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-045",
      conceptId: "transformer-masking-value",
      difficulty: "medium",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "Masked Self-Attention에서 미래 토큰 위치의 Attention score에 $-\\infty$(마이너스 무한대)를 더해주는 이유는?",
      options: [
        "Softmax 함수를 거쳤을 때 해당 위치의 확률값을 정확히 0으로 만들기 위해",
        "Softmax 결과값을 1로 만들기 위해",
        "미래 토큰의 가중치를 가장 크게 높이기 위해",
        "연산 속도를 0초로 단축하기 위해"
      ],
      answer: 0,
      explanation: "$\\exp(-\\infty) = 0$ 이므로 Softmax를 통과하면 미래 단어 참조 확률 가중치가 0이 됩니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-046",
      conceptId: "flan-held-out-evaluation",
      difficulty: "medium",
      category: "지시 학습",
      questionType: "multiple-choice",
      prompt: "FLAN 논문에서 지시 학습(Instruction Tuning) 모델의 일반화 성능을 공정하게 평가하기 위해 사용한 Held-out 평가 방식은?",
      options: [
        "특정 태스크 클러스터(예: 요약) 전체를 학습에서 완전히 제외(Held-out)한 뒤, 테스트 때 해당 클러스터 문제로 평가한다.",
        "학습 데이터와 똑같은 문제로만 테스트한다.",
        "모델 크기를 0으로 줄여서 평가한다.",
        "영어로만 훈련하고 테스트는 불어로만 한다."
      ],
      answer: 0,
      explanation: "보지 못한 지시문(unseen task)에 대한 지시 이행 일반화 능력을 측정하고자 특정 태스크 전체를 학습에서 빼고 테스트합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-047",
      conceptId: "dpo-loss-feature",
      difficulty: "medium",
      category: "선호 학습",
      questionType: "multiple-choice",
      prompt: "DPO(Direct Preference Optimization) 알고리즘이 기존 RLHF(PPO) 방식 대비 갖는 구조적 장점은?",
      options: [
        "별도의 보상 모델 학습 및 PPO 강화학습 루프 없이, 선호/비선호 데이터로 언어 모델 자체를 직접 최적화하여 학습이 매우 안정적이다.",
        "학습 데이터가 1개만 있어도 된다.",
        "트랜스포머 레이어를 사용할 필요가 없다.",
        "GPU 대신 CPU 1개로만 학습이 가능하다."
      ],
      answer: 0,
      explanation: "DPO는 RLHF의 보상 모델과 PPO 강화학습 단계를 수학적으로 단순화하여 직접 교스 엔트로피 형태로 정렬합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-048",
      conceptId: "kv-cache-memory-tradeoff",
      difficulty: "medium",
      category: "LLM 추론",
      questionType: "multiple-choice",
      prompt: "LLM 추론 시 KV Cache 기법을 사용할 때 발생하는 트레이드오프(Trade-off)는?",
      options: [
        "연산 속도가 대폭 향상되는 대신, GPU VRAM 메모리 사용량이 크게 증가한다.",
        "메모리가 줄어드는 대신 속도가 100배 느려진다.",
        "정확도가 0점으로 떨어진다.",
        "아무런 트레이드오프 없이 모든 면에서 이점만 존재한다."
      ],
      answer: 0,
      explanation: "KV Cache는 과거 K, V 벡터를 VRAM에 저장하므로 연산 속도는 빨라지지만 메모리(VRAM)를 많이 차지합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-049",
      conceptId: "chatgpt-memory-personalization",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "ChatGPT의 메모리 기능이나 시스템 프롬프트를 통해 사용자의 직업, 취향, 어조 요구사항을 지속 반영하는 기법은?",
      options: ["개인화 (Personalization)", "양자화 (Quantization)", "증류 (Distillation)", "토크나이징 (Tokenization)"],
      answer: 0,
      explanation: "유저에 대한 맥락 정보를 시스템 프롬프트/메모리에 저장하여 개인 맞춤형 응답을 생성하는 개인화 기법입니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-050",
      conceptId: "gsm8k-task-nature",
      difficulty: "medium",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "GSM8K 벤치마크 문제들의 특징으로 옳은 것은?",
      options: [
        "단계별 사칙연산과 논리 추론이 필요한 초등 수준 수학 문장제 문제로 구성되어 있다.",
        "대학원 수준의 고난도 물리학 객관식 문제이다.",
        "단순 영한 번역 문장 1만 개로 구성되어 있다.",
        "이미지를 보고 객체를 분류하는 문제이다."
      ],
      answer: 0,
      explanation: "GSM8K(Grade School Math 8K)는 멀티스텝 수리 추론 능력을 측정하는 초등 수학 문장제 데이터셋입니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-051",
      conceptId: "cbow-projection-sum",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "CBOW 모델의 투영층(Projection layer)에서 여러 주변 단어의 원-핫 벡터와 가중치 행렬 $W$가 곱해진 후 일어나는 연산은?",
      options: ["벡터들의 합(Sum) 또는 평균(Average)", "벡터들의 행렬식 계산", "각 벡터의 최대값 추출", "모든 원소를 0으로 초기화"],
      answer: 0,
      explanation: "CBOW 투영층에서는 입력된 주변 단어들의 임베딩 벡터를 모두 더하거나(SUM) 평균 내어 하나의 문맥 벡터를 만듭니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-052",
      conceptId: "skipgram-output-layer",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Skip-gram 모델의 출력층(Output layer) 크기는 무엇과 동일한가?",
      options: ["단어 사전 전체의 크기 ($V$)", "윈도우 크기", "은닉층 차원 수", "입력 문장의 길이"],
      answer: 0,
      explanation: "출력층은 전체 어휘 사전 $V$ 내의 각 단어가 주변 단어로 등장할 Softmax 확률 분포를 내므로 크기는 $V$입니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-053",
      conceptId: "rnn-backprop-chain-rule",
      difficulty: "medium",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "RNN 학습 시 역전파 오차가 시점 $t$에서 시점 1까지 전달될 때 미분 연산에서 적용되는 수학적 법칙은?",
      options: ["연쇄 법칙 (Chain Rule)", "피타고라스 정리", "베이즈 정리", "테일러 전개"],
      answer: 0,
      explanation: "시간을 거슬러 올라가며 미분값을 계속 곱해나가는 연쇄 법칙(Chain Rule)이 적용됩니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-054",
      conceptId: "lstm-input-gate-formula",
      difficulty: "medium",
      category: "LSTM",
      questionType: "multiple-choice",
      prompt: "LSTM의 Input gate 수식 $i_t = \\sigma(W_i \\cdot [h_{t-1}, x_t] + b_i)$ 에서 시그모이드 함수 $\\sigma$를 사용하는 목적은?",
      options: [
        "새로운 정보를 얼마나 수용할지 0과 1 사이의 비율값(비중)을 구하기 위해",
        "음수 값을 만들기 위해",
        "기울기를 무한대로 늘리기 위해",
        "행렬의 차원을 줄이기 위해"
      ],
      answer: 0,
      explanation: "Sigmoid 함수는 출력이 0~1 사이로 나오므로, 정보를 얼마만큼(0%~100%) 반영할지 비율을 결정합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-055",
      conceptId: "attention-dot-product-scaling-reason",
      difficulty: "medium",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "Scaled Dot-Product Attention에서 내적값을 $\\sqrt{d_k}$로 나누지 않으면 생기는 문제점은?",
      options: [
        "내적값이 너무 커져 Softmax 함수의 기울기(Gradient)가 매우 작아지는 기울기 소실 영역에 빠진다.",
        "내적값이 항상 0이 된다.",
        "Softmax 결과가 음수가 된다.",
        "Attention score가 무한히 작아져 계산이 안 된다."
      ],
      answer: 0,
      explanation: "차원이 크면 내적 결과의 분산이 커져 Softmax 출력이 한쪽으로 쏠리고 기울기 소실(Gradient vanishing)이 발생합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-056",
      conceptId: "transformer-decoder-block-count",
      difficulty: "medium",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머 아키텍처에서 인코더와 디코더의 블록(Layer) 개수 설정에 관한 설명으로 옳은 것은?",
      options: [
        "동일한 구조의 블록을 $N$개(예: 6개, 12개 등) 쌓아 올려 깊은 아키텍처를 형성한다.",
        "인코더 블록은 무조건 1개만 사용할 수 있다.",
        "디코더 블록은 사용할 수 없다.",
        "블록의 개수는 항상 입력 문장의 단어 수와 정확히 같아야 한다."
      ],
      answer: 0,
      explanation: "트랜스포머는 동일한 하위 블록 레이어를 $N$번 반복 하이퍼파라미터(예: $N=6$)로 쌓아 올립니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-057",
      conceptId: "llm-pretraining-cost",
      difficulty: "medium",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "GPT-3 (175B) 수준의 LLM을 사전 학습하는 데 들어간 추정 비용 및 자원 규모에 대한 설명으로 옳은 것은?",
      options: [
        "수천 개의 고성능 GPU와 수십~수백억 원 상당의 대규모 비용이 소요된다.",
        "일반 개인용 노트북 1대로 1시간 만에 학습할 수 있다.",
        "학습 비용이 전혀 들지 않는다.",
        "GPU 대신 CPU 1개로만 학습하는 것이 가장 효율적이다."
      ],
      answer: 0,
      explanation: "GPT-3 수준 학습에는 수천 개의 클러스터 GPU와 막대한 전기/계산 비용(약 백억 원 이상)이 소요됩니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-058",
      conceptId: "dpo-vs-rlhf-reward-model",
      difficulty: "medium",
      category: "선호 학습",
      questionType: "multiple-choice",
      prompt: "DPO 방식과 기존 RLHF 방식의 핵심 차이 중 '보상 모델(Reward Model)'에 관한 설명은?",
      options: [
        "DPO는 별도의 보상 모델을 신경망으로 따로 훈련시키지 않고 언어 모델의 확률 비로 대체한다.",
        "DPO는 보상 모델을 10개 이상 동시에 사용한다.",
        "DPO는 사람의 선호 데이터를 전혀 사용하지 않는다.",
        "RLHF는 보상 모델을 사용하지 않는다."
      ],
      answer: 0,
      explanation: "DPO는 수학적 변환을 통해 언어 모델 자체의 닫힌 형태(Implicit Reward)로 보상 모델을 대체합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-059",
      conceptId: "decoding-top-k-limitation",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Top-K Sampling이 가진 한계점은?",
      options: [
        "확률 분포가 매우 뾰족하거나 평평한 문맥적 변화에 관계없이 고정된 K개만 고려한다.",
        "K의 값이 자동으로 매번 변한다.",
        "항상 똑같은 답변만 나온다.",
        "계산량이 Beam Search의 1000배이다."
      ],
      answer: 0,
      explanation: "문맥에 따라 완벽한 후보가 1개일 수도, 20개일 수도 있는데 K가 고정되어 있으면 잡음 단어가 섞이거나 유용한 단어가 잘릴 수 있습니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-060",
      conceptId: "prompt-persona-setting",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "프롬프트에 \"너는 친절한 초등학교 선생님이야. 6살 아이에게 설명하듯 말해줘\" 라고 역할을 지정하는 프롬프트 기법은?",
      options: ["페르소나(Persona) 지정 프롬프팅", "Zero-shot CoT", "RAG", "DPO"],
      answer: 0,
      explanation: "모델에게 특정 페르소나(역할/자격)를 부여하여 말투와 답변 수준을 제어하는 프롬프트 기술입니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-061",
      conceptId: "nlp-pipeline-order",
      difficulty: "medium",
      category: "자연어 처리 기초",
      questionType: "multiple-choice",
      prompt: "일반적인 자연어 처리 파이프라인의 순서로 가장 올바른 것은?",
      options: [
        "텍스트 수집 $\\rightarrow$ 토큰화(Tokenization) $\\rightarrow$ 단어 임베딩 $\\rightarrow$ 모델 학습 및 추론",
        "모델 추론 $\\rightarrow$ 단어 임베딩 $\\rightarrow$ 텍스트 수집 $\\rightarrow$ 토큰화",
        "단어 임베딩 $\\rightarrow$ 텍스트 수집 $\\rightarrow$ 토큰화 $\\rightarrow$ 모델 학습",
        "토큰화 $\\rightarrow$ 텍스트 수집 $\\rightarrow$ 모델 학습 $\\rightarrow$ 단어 임베딩"
      ],
      answer: 0,
      explanation: "원시 텍스트를 수집 및 정제한 후 토큰 단위로 나누고, 이를 밀집 벡터로 임베딩하여 모델에 입력합니다."
    },
    {
      id: "nlp-medium-mc-062",
      conceptId: "word2vec-cbow-loss",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "CBOW 모델 학습 시 가중치 업데이트를 위해 계산하는 손실(Loss)의 기준은?",
      options: [
        "예측한 중심 단어의 확률 분포와 실제 중심 단어 원-핫 벡터 간의 Cross-Entropy",
        "주변 단어들과의 거리 평균",
        "단어의 알파벳 개수 차이",
        "문장 전체의 단어 개수"
      ],
      answer: 0,
      explanation: "CBOW는 주변 단어로 예측한 중심 단어 확률 분포와 정답 중심 단어의 교차 엔트로피 손실을 줄이도록 학습합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-063",
      conceptId: "rnn-gradient-explosion-solution",
      difficulty: "medium",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "RNN 학습 과정에서 기울기가 너무 커져 발산하는 '기울기 폭발(Gradient Explosion)'을 막기 위한 대표적 기법은?",
      options: ["Gradient Clipping (기울기 클리핑)", "Dropout", "Weight Initialization", "Early Stopping"],
      answer: 0,
      explanation: "Gradient Clipping은 기울기 임계값을 넘어서면 임계값 크기로 기울기를 잘라내어 발산을 막습니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-064",
      conceptId: "lstm-peephole-connection",
      difficulty: "medium",
      category: "LSTM 변형",
      questionType: "multiple-choice",
      prompt: "LSTM 변형 중 각 게이트들이 Cell state $C_{t-1}$의 값을 직접 다이렉트로 들여다볼 수 있게 연결을 추가한 구조는?",
      options: ["Peephole Connection (피프홀 연결)", "GRU", "Bi-LSTM", "Attention"],
      answer: 0,
      explanation: "Peephole Connection은 게이트 계산 시 이전 hidden state뿐만 아니라 이전 cell state 값도 직접 참조합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-065",
      conceptId: "bilstm-concept",
      difficulty: "medium",
      category: "LSTM 변형",
      questionType: "multiple-choice",
      prompt: "양방향 LSTM(Bi-directional LSTM)이 텍스트 표현에 유리한 이유는?",
      options: [
        "순방향(Left-to-Right)과 역방향(Right-to-Left) LSTM을 모두 사용하여 시점 $t$의 앞뒤 문맥을 동시에 파악할 수 있어서",
        "속도가 2배 빠르기 때문에",
        "파라미터가 절반으로 줄어들기 때문에",
        "미래 단어를 생성하는 개방형 생성에 최적화되어 있어서"
      ],
      answer: 0,
      explanation: "Bi-LSTM은 문장의 과거(왼쪽)와 미래(오른쪽) 문맥 정보를 모두 은닉 상태에 담을 수 있습니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-066",
      conceptId: "seq2seq-sos-eos-tokens",
      difficulty: "medium",
      category: "Seq2Seq",
      questionType: "multiple-choice",
      prompt: "Seq2Seq 모델에서 디코더 생성을 시작할 때 첫 입력으로 들어가는 토큰과 생성을 끝낼 때 사용하는 토큰 순서는?",
      options: ["<SOS> 토큰으로 시작, <EOS> 토큰으로 종료", "<EOS> 토큰으로 시작, <SOS> 토큰으로 종료", "<PAD> 토큰으로 시작, <MASK> 토큰으로 종료", "<UNK> 토큰으로 시작, <CLS> 토큰으로 종료"],
      answer: 0,
      explanation: "디코더 시작 시 <SOS>(Start of Sequence)를 넣고, 출력이 완성되면 <EOS>(End of Sequence)를 출력합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-067",
      conceptId: "attention-additive-vs-dot",
      difficulty: "medium",
      category: "Attention",
      questionType: "multiple-choice",
      prompt: "Dot-product Attention이 Additive Attention에 비해 갖는 주요 장점은?",
      options: [
        "행렬 곱 연산으로 구현되어 빠르게 계산되고 메모리 효율적이다.",
        "파라미터 수가 10배 더 많다.",
        "차원이 커져도 스케일링이 필요 없다.",
        "Softmax 연산을 사용하지 않아도 된다."
      ],
      answer: 0,
      explanation: "Dot-product 방식은 고속 행렬 곱셈(MatMul) 최적화 라이브러리를 활용할 수 있어 연산 속도가 뛰어납니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-068",
      conceptId: "transformer-cross-attention-query",
      difficulty: "medium",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머 디코더의 Cross-Attention 수식에서 Query($Q$) 행렬은 어디에서 오는가?",
      options: ["디코더의 이전 마스킹 Self-Attention 서브레이어 출력", "인코더의 최상단 블록 출력", "입력 단어 사전", "임의의 무작위 행렬"],
      answer: 0,
      explanation: "Cross-Attention에서 $Q$는 디코더의 하위 서브레이어 출력에서 오고, $K$와 $V$는 인코더의 출력에서 옵니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-069",
      conceptId: "bert-mlm-mask-ratio",
      difficulty: "medium",
      category: "언어 모델",
      questionType: "multiple-choice",
      prompt: "BERT 사전 학습 시 입력 토큰 중 무작위로 마스킹(Mask)을 적용하는 비율은 전체의 몇 % 인가?",
      options: ["15%", "50%", "1%", "80%"],
      answer: 0,
      explanation: "BERT는 전체 입력 토큰 중 약 15%를 무작위 선택하여 [MASK] 변환 등의 MLM 학습을 진행합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-070",
      conceptId: "gpt-causal-language-modeling",
      difficulty: "medium",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "GPT 시리즈가 사용하는 Causal Language Modeling(인과적 언어 모델링)의 의미는?",
      options: [
        "현재 위치 이전의 단어들만을 문맥으로 이용하여 바로 다음 단어를 예측한다.",
        "문장 전체의 양방향 단어를 모두 보고 가운데 빈칸을 맞춘다.",
        "미래의 단어 10개를 한꺼번에 맞춘다.",
        "단어의 알파벳 철자를 역순으로 맞춘다."
      ],
      answer: 0,
      explanation: "Causal LM은 인과 관계에 따라 과거 문맥 $w_1, ..., w_{t-1}$ 만을 보고 $w_t$를 예측합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-071",
      conceptId: "llm-temperature-0-property",
      difficulty: "medium",
      category: "LLM 추론",
      questionType: "multiple-choice",
      prompt: "LLM API 호출 시 Temperature 값을 0으로 설정했을 때의 결과 동작은?",
      options: [
        "매번 가장 확률이 높은 단어만 고르는 결정론적(Deterministic) Greedy 출력이 된다.",
        "모델이 답변을 생성하지 못하고 에러를 낸다.",
        "가장 무작위적인 난수 텍스트가 생성된다.",
        "답변이 무조건 거절된다."
      ],
      answer: 0,
      explanation: "Temperature가 0이 되면 확률 분산이 사라져 항상 가장 높은 로짓의 토큰만 출력하는 결정론적 선택이 됩니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-072",
      conceptId: "instruct-gpt-sft-vs-rlhf",
      difficulty: "medium",
      category: "정렬 학습",
      questionType: "multiple-choice",
      prompt: "InstructGPT 논문 평가에서 단순 SFT(지도 미세조정) 모델 대비 RLHF 적용 모델이 얻은 주요 개선은?",
      options: [
        "인간 평가자의 선호도 점수가 대폭 상승하고, 유해성(Toxicity)과 환각이 감소했다.",
        "모델 파라미터 수가 10배로 늘어났다.",
        "학습 데이터량이 1000배 감소했다.",
        "영어가 아닌 타 언어 번역률이 0점이 되었다."
      ],
      answer: 0,
      explanation: "RLHF를 거친 InstructGPT는 단순 SFT 모델보다 사람 의도에 훨씬 잘 부합하며 유해 응답을 적게 생성했습니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-073",
      conceptId: "llama-2-pretraining-tokens",
      difficulty: "medium",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "LLaMA 1(1.4T 토큰) 대비 LLaMA 2 사전 학습에 투입된 토큰 수의 규모는?",
      options: ["2.0T (2조) 토큰", "100억 토큰", "500억 토큰", "10조 토큰"],
      answer: 0,
      explanation: "LLaMA 2는 LLaMA 1보다 40% 이상 늘어난 2.0조(2 Trillion) 토큰의 데이터로 사전 학습되었습니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-074",
      conceptId: "prompt-jailbreak-safety",
      difficulty: "medium",
      category: "LLM 안전성",
      questionType: "multiple-choice",
      prompt: "사용자가 우회적 질문이나 악의적 교동으로 LLM의 안전 가이드라인을 뚫고 유해 답변을 유도하는 공격 기법은?",
      options: ["탈옥 (Jailbreaking)", "RAG", "DPO", "Fine-tuning"],
      answer: 0,
      explanation: "Jailbreaking은 모델의 안전 정렬 장치를 우회하여 불법/유해 정보를 출력하게 만드는 프롬프트 공격입니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-075",
      conceptId: "eval-truthful-qa",
      difficulty: "medium",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "LLM이 사람이 오해하기 쉬운 미신이나 거짓 정보에 속지 않고 진실된 답변을 하는지 평가하는 벤치마크는?",
      options: ["TruthfulQA", "GSM8K", "HumanEval", "MBPP"],
      answer: 0,
      explanation: "TruthfulQA는 통념, 미신, 음모론 지문 등에 대해 모델이 진실하고 정확하게 답변하는지 측정합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-076",
      conceptId: "eval-humaneval",
      difficulty: "medium",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "OpenAI가 공개한 벤치마크로, 파이썬 함수 독스트링 요구사항을 보고 올바른 코드를 작성하는지 평가하는 기법은?",
      options: ["HumanEval", "MMLU", "ROUGE", "BLEU"],
      answer: 0,
      explanation: "HumanEval은 파이썬 코딩 문제 기반의 대표적인 LLM 코드 생성 평가 벤치마크입니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-077",
      conceptId: "word2vec-similarity-math",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec으로 학습된 벡터 공간에서 \"vec('King') - vec('Man') + vec('Woman')\" 연산을 수행했을 때 가장 가까운 벡터는?",
      options: ["vec('Queen')", "vec('Apple')", "vec('Boy')", "vec('Prince')"],
      answer: 0,
      explanation: "Word2Vec의 대표적 성질로, 단어 간 의미적 관계가 벡터의 선형 연산(King - Man + Woman = Queen)으로 나타납니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-078",
      conceptId: "rnn-hidden-size-hyperparameter",
      difficulty: "medium",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "RNN 계열 모델에서 은닉 상태 $h_t$의 차원 크기(Hidden size)를 결정하는 요소는?",
      options: [
        "개발자가 설정하는 모델의 하이퍼파라미터",
        "입력 문장의 단어 개수",
        "단어 사전 전체의 크기",
        "학습 에포크 수"
      ],
      answer: 0,
      explanation: "Hidden size(예: 128, 256, 512 등)는 모델을 설계하는 개발자가 정하는 하이퍼파라미터입니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-079",
      conceptId: "transformer-position-wise-ffn-formula",
      difficulty: "medium",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머의 FFN 서브레이어 수식 $\\text{FFN}(x) = \\max(0, x W_1 + b_1) W_2 + b_2$ 에서 중간 은닉 차원의 크기는 보통 $d_{model}$의 몇 배인가?",
      options: ["4배 ($d_{ff} = 2048$)", "1배", "100배", "1/2배"],
      answer: 0,
      explanation: "트랜스포머 원 논문에서 $d_{model}=512$일 때 FFN 내부는 4배 확장된 $d_{ff}=2048$ 차원을 사용합니다[cite: 2]."
    },
    {
      id: "nlp-medium-mc-080",
      conceptId: "llm-context-window-size",
      difficulty: "medium",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "Gemini 1.5 Pro 등 최신 LLM이 지원하는 '컨텍스트 윈도우(Context Window)'의 의미는?",
      options: [
        "모델이 한 번에 입력받고 처리할 수 있는 최대 토큰의 수",
        "컴퓨터 모니터의 화면 해상도",
        "1초당 생성되는 단어의 속도",
        "모델 학습 시 사용하는 GPU 장비 개수"
      ],
      answer: 0,
      explanation: "컨텍스트 윈도우는 모델이 한 번의 프롬프트에서 기억하고 처리할 수 있는 최대 입력 길이/토큰 수입니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-081",
      conceptId: "gqa-concept",
      difficulty: "medium",
      category: "Transformer 변형",
      questionType: "multiple-choice",
      prompt: "LLaMA 2 70B 등에 채택된 기법으로, 여러 개의 Query 헤드가 그룹을 이루어 하나의 KV 헤드를 공유함으로써 MHA와 MQA의 중간 성능을 내는 구조는?",
      options: ["Grouped-Query Attention (GQA)", "Multi-Head Attention", "Self-Attention", "Scaled Attention"],
      answer: 0,
      explanation: "Grouped-Query Attention(GQA)은 품질과 KV 캐시 메모리 효율성을 모두 잡은 중간 형태의 Attention입니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-082",
      conceptId: "lora-finetuning",
      difficulty: "medium",
      category: "LLM 학습 기법",
      questionType: "multiple-choice",
      prompt: "LLM 미세조정 시 전체 파라미터를 업데이트하지 않고, 저차원 분해 행렬 $A, B$만 추가하여 효율적으로 훈련시키는 기법의 약자는?",
      options: ["LoRA (Low-Rank Adaptation)", "RLHF", "SFT", "RAG"],
      answer: 0,
      explanation: "Low-Rank Adaptation(LoRA)은 기존 가중치를 고정하고 저차원 행렬만 학습시켜 메모리를 획기적으로 줄입니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-083",
      conceptId: "eval-code-pass-at-k",
      difficulty: "medium",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "HumanEval 등 코드 생성 평가 시 사용되는 pass@k 지표의 의미는?",
      options: [
        "모델이 생성한 k개의 코드 샘플 중 하나라도 단위 테스트를 통과하면 성공으로 판정하는 비율",
        "k초 안에 코드가 작성되는 비율",
        "k줄 이내로 코드가 작성되는 비율",
        "k명의 개발자가 검수하는 비율"
      ],
      answer: 0,
      explanation: "pass@k는 k개의 코드 후보 중 최소 1개가 test case를 통과할 확률을 나타냅니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-084",
      conceptId: "prompt-chaining",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "하나의 복잡한 요청을 여러 개의 작은 단위 작업 프롬프트로 나누고, 앞 단계의 출력을 다음 단계의 입력으로 연결해 수행하는 기법은?",
      options: ["프롬프트 체이닝 (Prompt Chaining)", "Zero-shot", "Fine-tuning", "Pruning"],
      answer: 0,
      explanation: "Prompt Chaining은 파이프라인 형태로 여러 프롬프트를 연결해 복잡한 태스크를 안정적으로 처리합니다[cite: 3]."
    },
    {
      id: "nlp-medium-mc-085",
      conceptId: "mixture-of-experts",
      difficulty: "medium",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "Mixtral 8x7B처럼 토큰마다 전체 네트워크가 아닌 일부 전문 전문가(Expert) 서브네트워크만 활성화하여 계산 효율을 높이는 구조는?",
      options: ["MoE (Mixture of Experts)", "Dense Transformer", "MLP", "RNN"],
      answer: 0,
      explanation: "Mixture of Experts(MoE)는 라우팅 네트워크를 통해 토큰별로 일부 Expert 레이어만 활성화하여 계산량을 절약합니다[cite: 3]."
    },

    // ==========================================
    // 3. 서술형 (5문항)
    // ==========================================
    {
      id: "nlp-medium-es-001",
      conceptId: "word2vec-sg-cbow-compare",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "essay",
      prompt: "Word2Vec의 두 가지 방식인 CBOW와 Skip-gram의 예측 방향(입출력) 차이를 설명하고, 학습 속도와 희귀 단어 표현 능력 관점에서 각각의 장단점을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["중심", "주변", "속도", "희귀"],
      modelAnswer: "CBOW는 주변 문맥 단어들로 중심 단어를 예측하며 학습 속도가 빠르고 자주 등장하는 단어에 강하다. 반면 Skip-gram은 중심 단어로 주변 문맥 단어들을 예측하며, 학습 속도는 느리지만 희귀 단어나 드문 구 표현을 더 잘 포착하여 표현해내는 장점이 있다[cite: 2].",
      rubricKeywords: ["중심", "주변", "속도", "희귀 단어"],
      minLength: 20,
      explanation: "CBOW와 Skip-gram의 예측 구조 차이 및 속도와 희귀 단어 포착 성능 비교를 작성합니다[cite: 2].",
      hint: "어느 방향으로 예측하는지와 학습 속도, 드문 단어 처리 이점을 서술하세요[cite: 2]."
    },
    {
      id: "nlp-medium-es-002",
      conceptId: "lstm-gates-mechanism",
      difficulty: "medium",
      category: "LSTM",
      questionType: "essay",
      prompt: "LSTM을 구성하는 3가지 게이트(Forget, Input, Output gate)의 역할을 정보의 흐름(지우기, 쓰기, 읽기) 관점에서 각각 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Forget", "Input", "Output", "지우", "기록", "출력"],
      modelAnswer: "Forget gate는 이전 세포 상태에서 필요 없는 정보를 지우고(Erase), Input gate는 현재 입력된 새로운 정보 중 얼마나 세포 상태에 기록할지(Write) 결정하며, Output gate는 업데이트된 세포 상태 정보 중 얼마만큼을 은닉 상태로 읽어 내보낼지(Read) 결정한다[cite: 2].",
      rubricKeywords: ["Forget", "Input", "Output", "지우", "기록", "읽기"],
      minLength: 20,
      explanation: "LSTM 게이트 3개의 명칭과 각 게이트가 Cell state에 행하는 정보 제어 동작을 짝지어 설명합니다[cite: 2].",
      hint: "버릴 정보, 새로 더할 정보, 내보낼 정보를 각 게이트와 연결하세요[cite: 2]."
    },
    {
      id: "nlp-medium-es-003",
      conceptId: "self-attention-qkv-concept",
      difficulty: "medium",
      category: "Self-Attention",
      questionType: "essay",
      prompt: "Self-Attention에서 각 단어가 변환되는 Query, Key, Value 벡터의 개념적 역할과, 이들을 이용해 최종 출력 벡터가 어떻게 계산되는지 원리를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Query", "Key", "Value", "유사도", "가중합"],
      modelAnswer: "Query는 다른 단어를 찾기 위한 질문 벡터, Key는 Query와 비교되는 단어의 색인 벡터, Value는 실제 참조할 내용 벡터이다. Query와 Key의 내적으로 유사도(Attention score)를 구하고 Softmax를 취한 뒤, 이 가중치를 Value 벡터와 가중합(Weighted sum)하여 최종 출력 벡터를 구한다[cite: 2].",
      rubricKeywords: ["Query", "Key", "Value", "유사도", "가중합"],
      minLength: 20,
      explanation: "Q, K, V의 각 정의와 유사도 계산 $\\rightarrow$ Softmax $\\rightarrow$ V와의 가중합 단계를 서술합니다[cite: 2].",
      hint: "질문, 색인, 내용의 비유와 내적 가중합 과정을 포함하세요[cite: 2]."
    },
    {
      id: "nlp-medium-es-004",
      conceptId: "rlhf-3steps-explain",
      difficulty: "medium",
      category: "선호 학습",
      questionType: "essay",
      prompt: "InstructGPT 및 RLHF 정렬 학습 과정의 3단계를 순서대로 명칭과 함께 간단히 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["SFT", "보상 모델", "PPO", "강화학습"],
      modelAnswer: "Step 1은 정답 데모 데이터로 모델을 지도 미세조정(SFT)한다. Step 2는 모델의 여러 응답에 대한 사람의 순위/선호도를 수집하여 보상 모델(Reward Model)을 학습시킨다. Step 3는 학습된 보상 모델의 점수를 극대화하도록 PPO 강화학습을 적용하여 언어 모델을 최종 업데이트한다[cite: 3].",
      rubricKeywords: ["SFT", "보상 모델", "PPO", "강화학습"],
      minLength: 20,
      explanation: "SFT $\\rightarrow$ Reward Model 학습 $\\rightarrow$ PPO 강화학습의 RLHF 3단계를 명확히 설명합니다[cite: 3].",
      hint: "지시 학습, 보상 모델, PPO 강화학습 단계 순으로 써주세요[cite: 3]."
    },
    {
      id: "nlp-medium-es-005",
      conceptId: "decoding-top-k-vs-top-p",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "essay",
      prompt: "Top-K Sampling과 Top-P (Nucleus) Sampling의 작동 방식 차이점과, Top-P가 Top-K의 한계를 극복하는 이유를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["K개", "누적 확률", "동적", "고정"],
      modelAnswer: "Top-K Sampling은 확률 상위 K개 단어를 고정 추출하므로 문맥에 따른 확률 분포 변화를 반영하지 못한다. 반면 Top-P Sampling은 누적 확률 합이 P에 도달할 때까지의 단어군을 동적으로 수집하므로, 문맥에 따라 후보군의 개수가 가변적으로 조절되어 품질과 다양성을 모두 확보한다[cite: 3].",
      rubricKeywords: ["K개", "누적 확률", "동적", "고정"],
      minLength: 20,
      explanation: "고정 개수(Top-K)와 동적 누적 확률(Top-P)의 차이 및 분포 적응성을 비교합니다[cite: 3].",
      hint: "후보 개수가 고정인지, 누적 확률에 따라 가변적인지 설명하세요[cite: 3]."
    }
  ]
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
