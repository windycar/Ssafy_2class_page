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
  hard: [
    // ==========================================
    // 1. 단답형 (10문항)
    // ==========================================
    {
      id: "nlp-hard-sa-001",
      conceptId: "word2vec-hierarchical-softmax",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "short-answer",
      prompt: "Word2Vec에서 연산량이 큰 Softmax를 대체하기 위해, 어휘 사전을 이진 트리(Binary Tree) 구조인 허프만 트리(Huffman Tree)로 구성하여 연산 복잡도를 O(V)에서 O(log V)로 줄이는 계산 최적화 기법의 명칭을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Hierarchical Softmax", "hierarchical softmax", "계층적 소프트맥스", "계층적 Softmax"],
      explanation: "Hierarchical Softmax는 단어들을 허프만 트리의 리프 노드로 배치하여 $O(\log_2 V)$의 자식 노드 선택 연산으로 연산량을 대폭 경감시킵니다.",
      hint: "계층적(Hierarchical) 구조의 소프트맥스 기법입니다."
    },
    {
      id: "nlp-hard-sa-002",
      conceptId: "rope-positional-encoding",
      difficulty: "hard",
      category: "Transformer",
      questionType: "short-answer",
      prompt: "LLaMA 등 최신 LLM에 널리 채택된 기법으로, Query와 Key 벡터를 복소수 평면 상에서 회전 변환 행렬을 이용해 내적 시 두 토큰 간의 상대적 거리가 자연스럽게 반영되도록 유도하는 위치 인코딩의 약자를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["RoPE", "rope", "Rotary Position Embedding"],
      explanation: "Rotary Position Embedding(RoPE)은 벡터의 회전을 통해 absolute와 relative position embedding의 장점을 결합한 기술입니다.",
      hint: "Rotary Position Embedding의 줄임말입니다."
    },
    {
      id: "nlp-hard-sa-003",
      conceptId: "reinforcement-learning-ppo",
      difficulty: "hard",
      category: "선호 학습",
      questionType: "short-answer",
      prompt: "InstructGPT의 RLHF Step 3 과정에서, 언어 모델의 출력이 기존 SFT 모델의 분포에서 지나치게 벗어나 붕괴하는 현상을 막기 위해 추가하는 손실함수 페널티 항목의 약자를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["KL Divergence", "KL divergence", "Kullback-Leibler divergence", "KL"],
      explanation: "PPO 강화학습 시 새로 업데이트되는 정책과 초기 SFT 모델 정책 사이의 확률 분포 차이를 측정하는 KL Divergence 페널티를 부여합니다[cite: 3].",
      hint: "Kullback-Leibler 발산의 약자입니다[cite: 3]."
    },
    {
      id: "nlp-hard-sa-004",
      conceptId: "chinchilla-scaling-laws",
      difficulty: "hard",
      category: "거대 언어 모델",
      questionType: "short-answer",
      prompt: "DeepMind 연구진이 제안한 파라미터-토큰 최적 비율 연구로, GPT-3처럼 파라미터만 늘리는 것보다 파라미터 수($N$)와 학습 토큰 수($D$)를 1:1 비율로 동등하게 확장해야 가장 효율적이라는 법칙의 명칭을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Chinchilla Scaling Law", "Chinchilla", "친칠라 스케일링 법칙", "Chinchilla 법칙"],
      explanation: "Chinchilla 연구에 따르면 파라미터 $N$과 데이터 $D$를 동시에 1:1 비율로 늘릴 때 주어진 컴퓨팅 자원 내에서 가장 높은 성능을 냅니다[cite: 3].",
      hint: "DeepMind의 대표적 스케일링 법칙 모델 이름입니다[cite: 3]."
    },
    {
      id: "nlp-hard-sa-005",
      conceptId: "flash-attention",
      difficulty: "hard",
      category: "Transformer 최적화",
      questionType: "short-answer",
      prompt: "GPU HBM과 SRAM 간의 I/O 읽기/쓰기 병목 현상을 타일링(Tiling) 및 재계산(Recomputation) 기법으로 극복하여 트랜스포머의 메모리 사용량과 속도를 대폭 개선한 Attention 커널 최적화 기술은?",
      options: [],
      answer: null,
      acceptedAnswers: ["FlashAttention", "Flash Attention", "flash attention", "FlashAttention-2"],
      explanation: "FlashAttention은 GPU의 SRAM 메모리를 효율적으로 활용해 $O(N^2)$ 메모리 IO 오버헤드를 대폭 축소한 기술입니다.",
      hint: "번개(Flash)처럼 빠른 Attention 커널입니다."
    },
    {
      id: "nlp-hard-sa-006",
      conceptId: "self-consistency-prompting",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "short-answer",
      prompt: "CoT 프롬프팅과 함께 디코딩 시 Sampling으로 다수의 서로 다른 추론 경로(Reasoning paths)를 생성한 뒤, 가장 많이 도출된 최종 정답을 다수결(Majority Voting)로 채택하는 고난도 기법의 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Self-Consistency", "self consistency", "Self Consistency", "셀프 컨시스턴시"],
      explanation: "Self-Consistency는 여러 추론 경로를 다수결 투표하여 CoT의 정답 도출 안정성을 극대화합니다[cite: 3].",
      hint: "자기 일관성을 뜻하는 영문 표기입니다[cite: 3]."
    },
    {
      id: "nlp-hard-sa-007",
      conceptId: "tree-of-thoughts",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "short-answer",
      prompt: "CoT의 일직선 추론 한계를 넘어, 중간 단계를 하나의 트리 노드로 설정하고 DFS/BFS 같은 탐색 알고리즘을 사용해 최적의 해결 경로를 탐색해나가는 프롬프팅 기법의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["ToT", "tot", "Tree of Thoughts"],
      explanation: "Tree of Thoughts(ToT)는 사고를 트리 구조로 확장하고 백트래킹(Backtracking) 및 평가를 조합하여 난제를 해결합니다[cite: 3].",
      hint: "Tree of Thoughts의 약자입니다[cite: 3]."
    },
    {
      id: "nlp-hard-sa-008",
      conceptId: "speculative-decoding",
      difficulty: "hard",
      category: "LLM 추론 최적화",
      questionType: "short-answer",
      prompt: "작고 빠른 보조 드래프트 모델(Draft Model)이 토큰 시퀀스를 빠르게 대량 생성하면, 거대한 메인 LLM이 이를 병렬 검증하여 추론 속도를 높이는 기법을 영문으로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Speculative Decoding", "speculative decoding", "추측적 디코딩"],
      explanation: "Speculative Decoding은 작은 드래프트 모델의 추측 토큰을 큰 모델이 한번의 메인 레이어 통과로 병렬 검증함으로써 수용률에 따라 속도를 올려줍니다[cite: 3].",
      hint: "추측(Speculative)하여 미리 디코딩해 두는 방식입니다[cite: 3]."
    },
    {
      id: "nlp-hard-sa-009",
      conceptId: "gpqa-benchmark",
      difficulty: "hard",
      category: "거대 언어 모델 평가",
      questionType: "short-answer",
      prompt: "생물학, 화학, 물리학 분야 박사급(Graduate level)전문가들이 직접 출제하여 검색이나 단순 암기만으로는 풀기 힘든 최고난도 과학 추론 평가 벤치마크의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["GPQA", "gpqa"],
      explanation: "GPQA(Graduate-Level Google-Proof Q&A Benchmark)는 전문가들도 풀기 까다로운 논리/과학 추론 평가 벤치마크입니다[cite: 3].",
      hint: "Graduate-Level Google-Proof Q&A의 약자입니다[cite: 3]."
    },
    {
      id: "nlp-hard-sa-010",
      conceptId: "contrastive-search-decoding",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "short-answer",
      prompt: "디코딩 시 다음 토큰의 상위 예측 확률값과 이전 은닉 상태들과의 유사도에 페널티를 주는 패널티 알파(Penalty Alpha) 항목을 조합하여 텍스트의 반복 현상(Degeneration)을 방지하는 디코딩 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Contrastive Search", "contrastive search", "대조 검색"],
      explanation: "Contrastive Search는 모델이 이전에 출력했던 토큰 표현들과의 코사인 유사도가 높아지는 것에 페널티를 주어 문장 무한 반복을 정밀하게 방지합니다[cite: 3].",
      hint: "대조(Contrastive) 방식을 적용한 디코딩입니다[cite: 3]."
    },

    // ==========================================
    // 2. 객관식 (85문항)
    // ==========================================
    {
      id: "nlp-hard-mc-001",
      conceptId: "skipgram-negative-sampling-loss",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec Skip-gram과 Negative Sampling(SGNS)을 적용했을 때, 중심 단어 $w_c$와 타겟 단어 $w_o$, $k$개의 음공간 샘플 단어 $w_i$에 대한 손실함수 수식의 올바른 형태는?",
      options: [
        "$-\\log \\sigma(v'_{w_o}^T v_{w_c}) - \\sum_{i=1}^k \\log \\sigma(-v'_{w_i}^T v_{w_c})$",
        "$-\\sum_{i=1}^k \\log \\sigma(v'_{w_i}^T v_{w_c})$",
        "$\\log \\sigma(v'_{w_o}^T v_{w_c}) + \\sum_{i=1}^k \\log \\sigma(v'_{w_i}^T v_{w_c})$",
        "$-\\log \\left( \\frac{\\exp(v'_{w_o}^T v_{w_c})}{\\sum_j \\exp(v'_j^T v_{w_c})} \\right)$"
      ],
      answer: 0,
      explanation: "SGNS 목적함수는 진짜 주변 단어 $w_o$와의 내적에는 $\\log \\sigma$를 취하고, 추출된 $k$개의 음성 단어 $w_i$들과의 내적에는 $\\log \\sigma(-x)$를 취해 손실을 최소화합니다[cite: 2].",
      hint: "양성 단어 내적 확률을 올리고, 음성 단어 내적 확률을 떨어뜨리는 수식을 찾으세요[cite: 2]."
    },
    {
      id: "nlp-hard-mc-002",
      conceptId: "word2vec-subsampling-formula",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec에서 \"the\", \"a\" 같은 빈도수가 너무 높은 단어(High-frequency words)가 학습을 저해하는 것을 막기 위해 적용하는 서브샘플링(Subsampling) 확률 $P(w_i)$ 수식은?",
      options: [
        "$P(w_i) = 1 - \\sqrt{\\frac{t}{f(w_i)}}$",
        "$P(w_i) = \\frac{f(w_i)}{t}$",
        "$P(w_i) = \\sqrt{t \\cdot f(w_i)}$",
        "$P(w_i) = \\frac{1}{1 + \\exp(-f(w_i))}$"
      ],
      answer: 0,
      explanation: "단어 빈도 $f(w_i)$가 설정 임계값 $t$(예: $10^{-5}$)보다 훨씬 크면 $P(w_i)$가 커져 해당 단어를 학습에서 제거할 확률이 올라갑니다[cite: 2].",
      hint: "빈도 $f(w_i)$가 클수록 버려질 확률이 올라가는 역제곱근 형태 수식입니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-003",
      conceptId: "rnn-bptt-exploding-clipping-math",
      difficulty: "hard",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "RNN의 Gradient Clipping 기법 수식인 $g \\leftarrow \\frac{\\text{threshold}}{\\|g\\|} g \\quad (\\text{if } \\|g\\| > \\text{threshold})$ 에 대한 수학적 해석으로 옳은 것은?",
      options: [
        "기울기 벡터 $g$의 방향(Direction)은 그대로 유지하면서 노름(Norm) 크기만 threshold 이하로 스케일링한다.",
        "기울기 벡터의 방향을 반대로 반전시킨다.",
        "모든 기울기 원소 값을 0으로 고정한다.",
        "기울기를 threshold의 제곱으로 무조건 확장한다."
      ],
      answer: 0,
      explanation: "Gradient Clipping은 기울기 벡터의 방향성을 훼손하지 않고 $g$의 L2 Norm 크기만 임계값으로 나눔으로써 폭발을 차단합니다[cite: 2].",
      hint: "벡터의 방향은 변하지 않고 스칼라 크기만 조절됩니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-004",
      conceptId: "lstm-cell-state-jacobian-matrix",
      difficulty: "hard",
      category: "LSTM",
      questionType: "multiple-choice",
      prompt: "LSTM이 RNN의 기울기 소실을 극복하는 이유를 야코비 행렬(Jacobian Matrix) $\\frac{\\partial C_t}{\\partial C_{t-1}}$ 관점에서 분석한 올바른 설명은?",
      options: [
        "$\\frac{\\partial C_t}{\\partial C_{t-1}} = f_t + \\dots$ 수식 형태로, Forget gate $f_t$가 1에 가까우면 기울기가 가중치 곱 연산에 의해 감쇄하지 않고 거의 그대로 보존되어 전파되기 때문에",
        "기울기가 지속적으로 제곱되어 무한히 확대되기 때문에",
        "기울기 전파 연산이 행렬 곱이 아닌 덧셈 연산으로 변환되어 항상 0이 나오기 때문에",
        "야코비 행렬의 고유값이 항상 0이 되기 때문에"
      ],
      answer: 0,
      explanation: "Cell state 오차 역전파 미분 시 요소별 곱셈 편미분에 의해 Forget gate $f_t$ 항이 핵심으로 남아, $f_t \\approx 1$일 때 기울기가 사라지지 않고 먼 과거로 직통 전파됩니다[cite: 2].",
      hint: "$f_t$ 값에 따라 오차 신호가 다이렉트로 전파되는 특성이 핵심입니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-005",
      conceptId: "attention-matrix-multiplication-complexity",
      difficulty: "hard",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "시퀀스 길이가 $N$일 때, 표준 Self-Attention의 시간 및 공간 복잡도는 $O(N^2)$이다. 이로 인해 긴 문맥 처리 시 발생하는 주요 문제점은?",
      options: [
        "시퀀스 길이 $N$이 커짐에 따라 메모리 사용량 및 계산량이 2차수(Quadratic)로 급증하여 매우 긴 문맥 연산이 불가능해진다.",
        "시퀀스 길이가 길어지면 선형적으로 속도가 빨라진다.",
        "학습 가중치가 모두 0으로 수렴한다.",
        "단어 사전 $V$의 크기가 줄어든다."
      ],
      answer: 0,
      explanation: "Self-Attention의 $Q K^T$ 연산 행렬 크기가 $N \\times N$이 되므로, 길이 $N$에 대해 2차수 $O(N^2)$ 비용이 발생하는 것이 근본 한계입니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-006",
      conceptId: "transformer-layer-norm-pre-vs-post",
      difficulty: "hard",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "초기 트랜스포머의 Post-LN(Post-Layer Normalization) 구조 대비 최신 LLM(GPT-3, LLaMA 등)이 채택한 Pre-LN 구조의 이점은?",
      options: [
        "LayerNorm을 서브레이어 연산 직전(Pre)에 적용함으로써 깊은 층에서도 잔차 연결(Residual Stream)의 기울기 전파가 훨씬 안정적이어서 Warm-up 없이도 학습이 잘 된다.",
        "파라미터 개수가 50% 절감된다.",
        "Attention 연산 자체를 생략할 수 있다.",
        "단방향 디코더를 양방향 인코더로 자동 변경해준다."
      ],
      answer: 0,
      explanation: "Pre-LN 구조는 잔차 통로가 아무런 변형 없이 직접 연결되어 매우 깊은 신경망 층에서도 기울기 소실/폭발 없는 안정적 학습이 가능합니다."
    },
    {
      id: "nlp-hard-mc-007",
      conceptId: "chinchilla-optimal-compute-math",
      difficulty: "hard",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "Chinchilla 논문에서 제안한 최적 계산 자원 $C \\approx 6ND$ 한도 내에서 파라미터 $N$과 학습 토큰 $D$의 최적 관계 분석으로 옳은 것은?",
      options: [
        "모델 파라미터 $N$을 2배 늘릴 때 학습 토큰 수 $D$도 똑같이 2배 늘려야 최적의 Performance를 낸다.",
        "파라미터 $N$만 10배 늘리고 데이터 $D$는 고정하는 것이 최적이다.",
        "데이터 $D$만 100배 늘리고 파라미터 $N$을 줄이는 것이 최적이다.",
        "파라미터 수와 토큰 수는 모델 성능과 전혀 관련이 없다."
      ],
      answer: 0,
      explanation: "Kaplan의 법칙과 달리 Hoffmann 등의 Chinchilla 연구는 $N$과 $D$가 동등한 비율(Isometric Scaling)로 같이 확대되어야 자원 대비 손실을 최소화함을 증명했습니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-008",
      conceptId: "emergence-mirage-hypothesis",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "LLM의 창발성(Emergence)에 대해 Schaeffer 등이 제안한 '창발성은 불연속적 평가 지표(Exact Match 등) 선택으로 인한 신기루(Mirage)일 수 있다'는 비판의 핵심 논지는?",
      options: [
        "연속적인 평가 지표(Token Cross-Entropy 등)로 전환하면 모델 성능은 급격한 점프 없이 크기에 비례해 매끄럽고 연속적으로 향상된다.",
        "창발성은 실제로 존재하지 않으며 LLM은 아무런 지식도 없다.",
        "모델의 크기가 클수록 성능이 떨어지는 현상을 의미한다.",
        "파라미터가 1B 이하일 때만 창발성이 일어난다는 뜻이다."
      ],
      answer: 0,
      explanation: "Exact Match처럼 0 아니면 1인 단절적 지표를 쓸 때 계단식 비선형 점프처럼 보일 뿐, 토큰 확률 손실 같은 연속 지표에서는 연속 선형 개선이라는 주장입니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-009",
      conceptId: "rlhf-kl-penalty-reason",
      difficulty: "hard",
      category: "선호 학습",
      questionType: "multiple-choice",
      prompt: "RLHF Step 3 과정에서 보상 모델 $R_\\phi$를 기반으로 PPO 학습을 진행할 때, $D_{KL}(\\pi_\\phi^{RL} \\parallel \\pi^{SFT})$ 항목을 목적함수에 추가하는 목적은?",
      options: [
        "언어 모델이 보상 모델의 맹점(Bug)을 악용하여 의미 없는 이상한 텍스트로 높은 점수만 따내는 보상 해킹(Reward Hacking)을 방지하기 위해",
        "보상 모델의 계산 속도를 100배 올리기 위해",
        "SFT 모델의 기억을 완전히 삭제하기 위해",
        "문장의 길이를 강제로 10단어로 고정하기 위해"
      ],
      answer: 0,
      explanation: "KL 페널티가 없으면 모델은 보상 모델의 허점을 노려 말도 안 되는 패턴을 반복 생성하여 점수만 높게 받는 'Reward Hacking'에 빠지게 됩니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-010",
      conceptId: "dpo-implicit-reward-math",
      difficulty: "hard",
      category: "선호 학습",
      questionType: "multiple-choice",
      prompt: "Direct Preference Optimization(DPO)의 핵심 수학적 유도 원리는 언어 모델의 유도된 암묵적 보상(Implicit Reward) $r(x, y)$를 무엇으로 정의하는가?",
      options: [
        "$r(x, y) = \\beta \\log \\frac{\\pi_\\theta(y|x)}{\\pi_{ref}(y|x)}$",
        "$r(x, y) = \\pi_\\theta(y|x) + \\pi_{ref}(y|x)$",
        "$r(x, y) = \\frac{\\pi_{ref}(y|x)}{\\pi_\\theta(y|x)}$",
        "$r(x, y) = \\sigma(\\pi_\\theta(y|x))$"
      ],
      answer: 0,
      explanation: "DPO는 최적 정책 수식을 역변환하여 보상함수가 레퍼런스 모델 대비 현재 모델의 로그 확률 비 $\\beta \\log \\frac{\\pi_\\theta}{\\pi_{ref}}$ 와 정확히 비례함을 유도해 냅니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-011",
      conceptId: "flash-attention-tiling-sram",
      difficulty: "hard",
      category: "Transformer 최적화",
      questionType: "multiple-choice",
      prompt: "FlashAttention이 $N \\times N$ 크기의 Attention 매트릭스를 HBM에 통째로 기록하지 않고 빠른 계산을 수행하는 핵심 구현 기법은?",
      options: [
        "Q, K, V 행렬을 GPU 내부 빠른 SRAM 메모리 블록 크기로 타일링(Tiling)하고 Softmax 온라인 정규화(Online Softmax) 기법을 적용하여 축적 계산한다.",
        "Softmax 함수를 완전히 제거하고 덧셈으로 대체한다.",
        "Q와 K를 무작위로 90% 삭제(Pruning)한다.",
        "CPU 메모리로 모든 행렬을 전송하여 연산한다."
      ],
      answer: 0,
      explanation: "FlashAttention은 SRAM 타일링과 Online Softmax 알고리즘을 결합해 HBM 메모리 읽기/쓰기 접근 횟수를 획기적으로 낮춥니다."
    },
    {
      id: "nlp-hard-mc-012",
      conceptId: "speculative-decoding-verification",
      difficulty: "hard",
      category: "LLM 추론 최적화",
      questionType: "multiple-choice",
      prompt: "Speculative Decoding에서 작은 Draft 모델이 추측한 토큰 $\\tilde{x}_1, ..., \\tilde{x}_K$에 대해 대형 Target 모델이 검증(Acceptance)을 판단하는 수용 확률 판단 기준은?",
      options: [
        "$\\min\\left(1, \\frac{p(x)}{q(x)}\\right)$ 비율에 기반한 rejection sampling (단, $p$는 타겟 모델 확률, $q$는 드래프트 모델 확률)",
        "두 모델의 토큰 알파벳 일치 여부",
        "무조건 드래프트 모델의 출력을 100% 채택",
        "Target 모델의 훈련 손실값"
      ],
      answer: 0,
      explanation: "Speculative Decoding은 $\\min\\left(1, \\frac{p(x)}{q(x)}\\right)$ 기반 리젝션 샘플링을 적용해, 검증을 통과하면서도 최종 출력 확률 분포가 타겟 모델 원본 분포와 수학적으로 완벽히 동일함을 보장합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-013",
      conceptId: "gqa-vs-mha-mqa-vram",
      difficulty: "hard",
      category: "Transformer 변형",
      questionType: "multiple-choice",
      prompt: "Grouped-Query Attention(GQA)의 $G$개 그룹 설정에 따른 MHA(Multi-Head) 및 MQA(Multi-Query)와의 매핑 관계로 옳은 것은?",
      options: [
        "그룹 수 $G = H$(헤드 수)이면 MHA가 되고, $G = 1$이면 MQA가 된다.",
        "그룹 수 $G = 1$이면 MHA가 되고, $G = H$이면 MQA가 된다.",
        "GQA는 무조건 $G = 0$으로 고정된다.",
        "MHA와 MQA는 GQA로 변환할 수 없다."
      ],
      answer: 0,
      explanation: "GQA는 KV 헤드 그룹 수 $G$를 조절하여 $G=H$일 때 표준 MHA, $G=1$일 때 MQA가 되는 범용 하이브리드 구조입니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-014",
      conceptId: "alibi-positional-encoding",
      difficulty: "hard",
      category: "Transformer 변형",
      questionType: "multiple-choice",
      prompt: "ALiBi(Attention with Linear Biases) 위치 인코딩이 극적으로 긴 컨텍스트 외삽(Extrapolation)을 가능케 하는 원리는?",
      options: [
        "임베딩 단계에서 위치 벡터를 더하지 않고, $Q K^T$ Attention score 행렬에 두 토큰 간 거리 비례 선형 페널티 $-m \\cdot |i - j|$ 를 직접 더해준다.",
        "사인 코사인 주기를 100만 배로 늘려준다.",
        "모든 위치 벡터를 0으로 고정한다.",
        "미래 토큰의 마스킹을 해제한다."
      ],
      answer: 0,
      explanation: "ALiBi는 Attention Score 계산 시 거리 차이 $|i-j|$에 비례한 마이너스 페널티를 직접 주어 학습 길이보다 긴 시퀀스에서도 외삽이 가능하게 합니다[cite: 2, 3]."
    },
    {
      id: "nlp-hard-mc-015",
      conceptId: "lora-rank-decomposition-formula",
      difficulty: "hard",
      category: "LLM 학습 기법",
      questionType: "multiple-choice",
      prompt: "LoRA(Low-Rank Adaptation)가 원래 가중치 $W_0 \\in \\mathbb{R}^{d \\times k}$를 고정한 채 업데이트 $\\Delta W$를 분해 파라미터화할 때의 행렬 크기 $A, B$ 설정으로 올바른 것은? (단, $r \\ll \\min(d, k)$)",
      options: [
        "$B \\in \\mathbb{R}^{d \\times r}$ 및 $A \\in \\mathbb{R}^{r \\times k}$ (따라서 $\\Delta W = B A$)",
        "$B \\in \\mathbb{R}^{d \\times d}$ 및 $A \\in \\mathbb{R}^{k \\times k}$",
        "$B \\in \\mathbb{R}^{r \\times r}$ 및 $A \\in \\mathbb{R}^{r \\times r}$",
        "$B \\in \\mathbb{R}^{d \\times k}$ 및 $A \\in \\mathbb{R}^{d \\times k}$"
      ],
      answer: 0,
      explanation: "LoRA는 $d \\times k$ 가중치를 $d \\times r$ 크기의 $B$와 $r \\times k$ 크기의 $A$ 행렬 곱으로 분해하여 랭크 $r$ 크기의 미세한 파라미터만 학습시킵니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-016",
      conceptId: "qlora-quantization-type",
      difficulty: "hard",
      category: "LLM 학습 기법",
      questionType: "multiple-choice",
      prompt: "QLoRA 연구가 65B 규모의 LLM을 단일 48GB GPU에서 미세조정할 수 있도록 도입한 4비트 양산 데이터 타입과 기술은?",
      options: [
        "NF4 (NormalFloat4) 양자화 + Double Quantization + Paged Optimizers",
        "FP16 + INT8 동시 변환",
        "Bfloat16 오토캐스팅만 적용",
        "INT2 양자화 + CPU Offloading"
      ],
      answer: 0,
      explanation: "QLoRA는 정규분포 가중치에 최적화된 NF4 데이터 타입과 이중 양자화(Double Quantization)로 메모리를 혁신적으로 압축했습니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-017",
      conceptId: "rope-rotation-math",
      difficulty: "hard",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "RoPE(Rotary Position Embedding)에서 2차원 임베딩 벡터 $(x_1, x_2)$를 위치 $m$만큼 회전시킬 때 적용하는 2D 회전 행렬 $R_{\\Theta, m}^2$ 형태는?",
      options: [
        "$\\begin{pmatrix} \\cos m\\theta & -\\sin m\\theta \\\\ \\sin m\\theta & \\cos m\\theta \\end{pmatrix}$",
        "$\\begin{pmatrix} 1 & m \\\\ 0 & 1 \\end{pmatrix}$",
        "$\\begin{pmatrix} m & 0 \\\\ 0 & m \\end{pmatrix}$",
        "$\\begin{pmatrix} \\tan m\\theta & 0 \\\\ 0 & \\cot m\\theta \\end{pmatrix}$"
      ],
      answer: 0,
      explanation: "RoPE는 각 2차원 청크 평면상에서 각도 $m\\theta$ 만큼의 회전 변환 행렬을 벡터에 곱해 위치 정보를 주입합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-018",
      conceptId: "cot-prompting-ablation-study",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "Chain-of-Thought (CoT) 논문 연구에서 진행한 소거 실험(Ablation study) 결과 중 사실로 밝혀진 것은?",
      options: [
        "CoT의 효과는 단순히 중간 출력 토큰 길이가 길어졌기 때문이 아니라, 중간 과정의 기호 및 논리적 추론 계산 단계가 존재하기 때문이다.",
        "중간 추론에 아무 무작위 단어나 채워 넣어도 정답률이 동일하게 올라간다.",
        "모델 크기가 1B 이하일 때 CoT가 가장 큰 효과를 보인다.",
        "CoT는 단답형 분류 태스크의 정확도를 0점으로 만든다."
      ],
      answer: 0,
      explanation: "실험 결과 무작위 텍스트나 의미 없는 심볼 채우기는 성능 향상을 내지 못하며, 올바른 논리적 추론 단계의 형성이 핵심임이 입증되었습니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-019",
      conceptId: "eval-pass-at-k-unbiased-estimator",
      difficulty: "hard",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "HumanEval 논문에서 pass@k 지표 계산 시 $n$개의 샘플($n \\ge k$)을 생성한 뒤 편향을 줄이기 위해 사용하는 불편 추정량(Unbiased Estimator) 수식 공식은?",
      options: [
        "$\\text{pass}@k \\approx 1 - \\frac{\\binom{n-c}{k}}{\\binom{n}{k}}$ (단, $c$는 통과한 샘플 수)",
        "$\\text{pass}@k = \\frac{c}{n} \\times k$",
        "$\\text{pass}@k = \\frac{c}{k}$",
        "$\\text{pass}@k = 1 - \\left(\\frac{c}{n}\\right)^k$"
      ],
      answer: 0,
      explanation: "HumanEval은 높은 분산을 줄이고 편향을 제거하기 위해 전체 $n$개 샘플 중 오답 $(n-c)$개에서 $k$개를 모두 뽑을 확률을 1에서 빼는 조합 공식을 사용합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-020",
      conceptId: "contrastive-search-degeneration-formula",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Contrastive Search에서 후보 토큰 $v$를 선택하는 평가식 $x_t = \\arg\\max_{v \\in V^{(k)}} \\left[ (1 - \\alpha) \\times P_{\\theta}(v | x_{<t}) - \\alpha \\times \\max_{1 \\le j \\le t-1} s(h_v, h_{x_j}) \\right]$ 의 패널티 항목 해석으로 옳은 것은?",
      options: [
        "이전 생성된 은닉 상태들 $h_{x_j}$와 현재 후보 토큰의 은닉 상태 $h_v$ 간의 최대 코사인 유사도 $s$에 $\\alpha$ 만큼 차감 페널티를 준다.",
        "이전 토큰들과 완전히 동일한 토큰만 가산점을 준다.",
        "확률값 $P_\\theta$를 0으로 강제 변환한다.",
        "가장 유사도가 높은 토큰을 우선적으로 계속 반복 선택한다."
      ],
      answer: 0,
      explanation: "이전 은닉 벡터들과 유사도가 높을수록 페널티를 주어(Degeneration Penalty) 문장이 무한히 반 복 상투어로 흐르는 현상을 차단합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-021",
      conceptId: "tree-of-thoughts-search-algorithms",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "Tree of Thoughts (ToT) 프레임워크가 프롬프트 기반 생각 노드를 평가하고 탐색할 때 조합하여 활용하는 알고리즘은?",
      options: [
        "너비 우선 탐색 (BFS) 또는 깊이 우선 탐색 (DFS)",
        "Dijkstra 알고리즘만 전용 사용",
        "Genetic Algorithm",
        "K-Means Clustering"
      ],
      answer: 0,
      explanation: "ToT는 각 생각 단계를 가지치기(Pruning) 및 평가하면서 BFS나 백트래킹 기반 DFS로 최적 경로를 모색합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-022",
      conceptId: "rag-vector-db-index-type",
      difficulty: "hard",
      category: "LLM 응용",
      questionType: "multiple-choice",
      prompt: "RAG 시스템 구축 시 수백만 개의 문서 임베딩 벡터 중 빠른 최근접 이웃 검색을 위해 활용하는 Approximate Nearest Neighbor(ANN) 인덱스 알고리즘 예시는?",
      options: ["HNSW (Hierarchical Navigable Small World)", "B-Tree", "Red-Black Tree", "Inverted Index"],
      answer: 0,
      explanation: "HNSW 등 고성능 ANN 벡터 인덱스를 통해 고차원 임베딩 검색 속도를 밀리초 단위로 단축합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-023",
      conceptId: "transformer-residual-stream-concept",
      difficulty: "hard",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "Mechanistic Interpretability 관점에서 트랜스포머의 잔차 연결 통로(Residual Stream)를 바라보는 올바른 시각은?",
      options: [
        "모든 레이어들이 대역폭을 공유하며 정보를 읽고 쓰기(Read/Write)하는 중앙 정보 버스(Communication Bus) 역할을 한다.",
        "단순히 손실값을 0으로 만드는 무의미한 통로이다.",
        "디코더에서 인코더로 역방향 데이터만 전송하는 통로이다.",
        "Self-Attention 출력을 0으로 초기화하는 장치이다."
      ],
      answer: 0,
      explanation: "Residual Stream은 토큰 벡터의 표현이 층을 거치며 각 서브레이어의 어텐션/FFN 결과를 가산(Write)하여 업데이트해 나가는 Shared 메모리 버스 모델로 해석됩니다[cite: 2, 3]."
    },
    {
      id: "nlp-hard-mc-024",
      conceptId: "glove-objective-loss-function",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "GloVe 모델의 손실함수 $J = \\sum_{i,j=1}^V f(X_{ij}) (w_i^T \\tilde{w}_j + b_i + \\tilde{b}_j - \\log X_{ij})^2$ 에 대한 세부 해석 중 올바른 것은?",
      options: [
        "두 단어 임베딩의 내적과 편향의 합이 동시 등장 횟수의 로그값 $\\log X_{ij}$에 가깝도록 가중 회귀(Weighted Least Squares)를 수행한다.",
        "$X_{ij}$가 매우 큰 동시 등장 단어에 무한대의 가중치를 부여한다.",
        "Softmax 확률의 크로스 엔트로피를 최소화한다.",
        "동시 등장 횟수 $X_{ij} = 0$ 인 단어 쌍에 가장 큰 가중치를 부여한다."
      ],
      answer: 0,
      explanation: "GloVe는 로그 동시 등장 빈도 $\\log X_{ij}$와 벡터 내적의 차이를 최소화하며, $f(X_{ij})$ 가중치 함수로 빈도가 지나치게 높은 단어의 과도한 영향을 억제합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-025",
      conceptId: "fasttext-subword-hash-trick",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "FastText가 무수히 많아질 수 있는 문자 n-gram들의 메모리 저장을 제어하기 위해 사용하는 기법은?",
      options: ["해시 트릭 (Hashing Trick)", "원-핫 인코딩", "Huffman Tree", "B-Tree 인덱싱"],
      answer: 0,
      explanation: "FastText는 문자 n-gram들을 해시 함수를 통해 고정 크기(예: 2,000,000개) 버킷 공간으로 맵핑하는 Hashing Trick을 사용합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-026",
      conceptId: "rnn-many-to-many-unsynced-sequence",
      difficulty: "hard",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "Seq2Seq처럼 입력 시퀀스의 길이 $T_x$와 출력 시퀀스의 길이 $T_y$가 완전히 다르고 독립적인 Many-to-Many 관계를 가능케 한 아키텍처적 핵심 분리는?",
      options: [
        "입력을 모두 읽어 Context Vector로 인코딩하는 구간과, 이 벡터를 받아 생성을 따로 시작하는 디코딩 구간의 분리",
        "Softmax 레이어와 Sigmoid 레이어의 분리",
        "Embedding 레이어와 Linear 레이어의 분리",
        "CPU 연산과 GPU 연산의 분리"
      ],
      answer: 0,
      explanation: "Encoder가 $T_x$ 길이 입력을 끝까지 인코딩해 넘기면, Decoder가 별도의 $T_y$ 타임스텝을 독립적으로 순차 구동하기 때문입니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-027",
      conceptId: "lstm-cell-state-linear-property",
      difficulty: "hard",
      category: "LSTM",
      questionType: "multiple-choice",
      prompt: "LSTM의 Cell state 타임스텝 연산 $C_t = f_t * C_{t-1} + i_t * \\tilde{C}_t$ 이 기울기 전달 측면에서 선형적(Linear) 특성을 유지함으로써 얻는 이점은?",
      options: [
        "역전파 과정에서 비선형 활성화 함수의 미분값이 계속 곱해져 기울기가 급격히 0으로 줄어드는 비선형 감쇄 현상을 상쇄한다.",
        "모든 가중치를 0으로 초기화할 수 있다.",
        "Sigmoid 계산이 필요 없어진다.",
        "학습 데이터가 없어도 작동하게 만든다."
      ],
      answer: 0,
      explanation: "Cell state의 덧셈 선형 통로는 비선형 활성화 함수의 연속 미분 곱으로 인한 기울기 감쇄 오버헤드를 우회시켜 줍니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-028",
      conceptId: "attention-matrix-multiplication-order",
      difficulty: "hard",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "Scaled Dot-Product Attention $\\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$ 계산 시, 배치 크기를 제외하고 $Q, K, V$ 행렬의 차원이 각각 $(T, d_k), (T, d_k), (T, d_v)$ 일 때 중간 연산 행렬 순서 및 차원 변환 과정으로 올바른 것은?",
      options: [
        "$Q K^T \\rightarrow (T, T)$ $\\xrightarrow{\\text{softmax}}$ $(T, T)$ $\\xrightarrow{\\times V}$ $(T, d_v)$",
        "$Q V^T \\rightarrow (T, T)$ $\\xrightarrow{\\times K}$ $(T, d_k)$",
        "$K^T V \\rightarrow (d_k, d_v)$ $\\xrightarrow{\\times Q}$ $(d_k, T)$",
        "$Q + K + V \\rightarrow (T, d_k)$"
      ],
      answer: 0,
      explanation: "$(T \\times d_k) \\times (d_k \\times T) = (T \\times T)$ 유사도 행렬을 거쳐, $(T \\times T) \\times (T \\times d_v) = (T \\times d_v)$ 차원의 최종 컨텍스트 벡터가 생성됩니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-029",
      conceptId: "transformer-encoder-decoder-attention-masking-difference",
      difficulty: "hard",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머 인코더의 Self-Attention과 디코더의 Masked Self-Attention에서 사용되는 어텐션 마스크 행렬(Mask Matrix)의 형태 차이는?",
      options: [
        "인코더 마스크는 패딩([PAD]) 위치만 차단하는 마스크인 반면, 디코더 마스크는 패딩 차단과 함께 미래 토큰 위치를 모두 $-\\infty$로 덮는 상삼각(Upper-triangular) 마스크이다.",
        "인코더는 미래 토큰을 마스킹하고, 디코더는 과거 토큰을 마스킹한다.",
        "인코더와 디코더 모두 하삼각(Lower-triangular) 마스크를 동일하게 적용한다.",
        "인코더는 마스크를 전혀 쓰지 못한다."
      ],
      answer: 0,
      explanation: "디코더의 Masked Self-Attention은 Look-ahead 방지를 위해 현재 시점 이후의 모든 미래 열(Upper triangle)을 $-\\infty$로 차단합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-030",
      conceptId: "flan-t5-instruction-dataset-mixture",
      difficulty: "hard",
      category: "지시 학습",
      questionType: "multiple-choice",
      prompt: "FLAN-T5 등 지시 학습 데이터셋 구축 시, 단일 형태의 지시문 대신 한 태스크당 수십 개의 다양한 자연어 템플릿(Template) 변형을 적용하여 학습시키는 이유는?",
      options: [
        "모델이 특정 템플릿 문구 표면에 과적합(Overfitting)되는 것을 방지하고 지시문 형태가 바뀌어도 의도를 파악하는 Zero-shot 일반화 능력을 극대화하기 위해",
        "데이터 파일 용량을 줄이기 위해",
        "파라미터 개수를 증가시키기 위해",
        "영어가 아닌 타 언어 번역을 자동으로 수행하기 위해"
      ],
      answer: 0,
      explanation: "다양한 지시 프롬프트 템플릿 변형을 학습시킴으로써 고정 문구가 아닌 지시문의 상위 의도를 파악하는 일반화 능력이 형성됩니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-031",
      conceptId: "rlhf-reward-model-overfitting",
      difficulty: "hard",
      category: "선호 학습",
      questionType: "multiple-choice",
      prompt: "RLHF에서 보상 모델 $R_\\phi$ 학습 시 발생할 수 있는 'Overoptimization / Reward Hacking' 현상을 그래프상으로 관찰했을 때 나타나는 양상은?",
      options: [
        "RL 학습 진행에 따라 보상 모델이 부여하는 Reward 점수는 계속 상승하지만, 실제 인간이 평가한 답변의 지시 이행 품질은 특정 시점 이후 오히려 감소한다.",
        "인간 평가 품질과 보상 모델 점수가 무조건 평행하게 상승한다.",
        "보상 점수가 0으로 수렴한다.",
        "모델의 생성 속도가 100배 느려진다."
      ],
      answer: 0,
      explanation: "보상 모델 점수만 너무 과도하게 최적화되면 보상 모델의 맹점을 악용하는 꼼수가 발현되어 실제 사람이 느끼는 답변 품질이 하락하게 됩니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-032",
      conceptId: "kv-cache-multi-head-attention-memory-calc",
      difficulty: "hard",
      category: "LLM 추론 최적화",
      questionType: "multiple-choice",
      prompt: "레이어 수 $L$, 헤드 수 $H$, 헤드 차원 $d_k$, 배치 크기 $B$, 시퀀스 길이 $S$일 때, 16비트(2 Bytes) 정밀도에서 표준 MHA의 전체 KV Cache 메모리 용량 산출 공식은?",
      options: [
        "2 $\\times$ 2 $\\times$ $B \\times L \\times H \\times S \\times d_k$ Bytes",
        "$B \\times L \\times S \\times d_k$ Bytes",
        "4 $\\times$ $B \\times H \\times S$ Bytes",
        "$L \\times H \\times d_k$ Bytes"
      ],
      answer: 0,
      explanation: "Key와 Value 2개 벡터 $\\times$ 16비트(2 Bytes) $\\times B \\times L \\times H \\times S \\times d_k$ 크기의 VRAM 메모리가 정직하게 소요됩니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-033",
      conceptId: "prompt-injection-jailbreak-difference",
      difficulty: "hard",
      category: "LLM 안전성",
      questionType: "multiple-choice",
      prompt: "간접 프롬프트 주입(Indirect Prompt Injection) 공격과 탈옥(Jailbreaking)의 결정적 차이는?",
      options: [
        "Jailbreaking은 사용자가 직접 악의적 유해 질문을 던지는 것이고, Indirect Prompt Injection은 모델이 읽어오는 외부 웹페이지/문서 내에 악의적 지시문이 몰래 숨겨져 시스템을 하이재킹하는 것이다.",
        "Jailbreaking은 외부 문서에 가해지고, Prompt Injection은 사용자가 직접 실행한다.",
        "두 기법은 완전히 동일하다.",
        "Prompt Injection은 GPU를 파괴하는 물리적 공격이다."
      ],
      answer: 0,
      explanation: "Indirect Prompt Injection은 RAG나 웹 검색 시 외부 데이터에 숨겨진 악성 지시문이 모델의 시스템 프롬프트를 덮어써 조정권을 탈취하는 위험입니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-034",
      conceptId: "eval-big-bench-hand",
      difficulty: "hard",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "BIG-bench 평가 모음 중, 사람이 직접 엄선한 200여 개의 극도로 어렵고 복잡한 태스크들로 구성되어 기존 LM들이 낮은 점수를 보였던 벤치마크 서브셋은?",
      options: ["BIG-bench Hard (BBH)", "MMLU", "GSM8K", "HumanEval"],
      answer: 0,
      explanation: "BIG-bench Hard(BBH)는 기존 LM들이 사람보다 훨씬 낮은 성능을 보였던 난이도 높은 23개 태스크 중심의 벤치마크 서브셋입니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-035",
      conceptId: "word2vec-hierarchical-softmax-huffman",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Hierarchical Softmax에서 단어들을 트리의 노드로 배치할 때 허프만 트리(Huffman Tree) 알고리즘을 활용하는 목적은?",
      options: [
        "코퍼스에서 자주 등장하는 고빈도 단어일수록 트리의 상단(루트에 가깝게)에 배치하여 평균 연산 깊이(Path length)를 최소화하기 위해",
        "모든 단어의 트리 깊이를 완벽히 똑같게 만들기 위해",
        "단어 알파벳 순서대로 정렬하기 위해",
        "희귀 단어의 깊이를 가장 얕게 만들기 위해"
      ],
      answer: 0,
      explanation: "빈도가 높은 단어일수록 루트와 가까운 짧은 경로에 배치하여 평균 계산 복잡도를 $O(\\log V)$ 이하로 더욱 줄입니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-036",
      conceptId: "rnn-hidden-state-vanishing-gradient-derivative",
      difficulty: "hard",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "RNN의 역전파 시 $\\frac{\\partial h_t}{\\partial h_{k}} = \\prod_{j=k+1}^t \\frac{\\partial h_j}{\\partial h_{j-1}}$ 에서 각 야코비 마디 $\\frac{\\partial h_j}{\\partial h_{j-1}} = \\text{diag}(1 - \\tanh^2(\\dots)) W_{hh}^T$ 가 구체적으로 소실을 유발하는 수학적 조건은?",
      options: [
        "$\\tanh'$의 최댓값이 1이고, $W_{hh}$의 고유값(Eigenvalue)들이 1보다 작으면 연속 곱에 의해 오차가 0으로 지수적 감소한다.",
        "$W_{hh}$의 모든 원소가 100보다 크면 발생한다.",
        "$\tanh$ 대신 Identity 함수를 쓰면 발생한다.",
        "타임스텝 $t$가 0에 가까울 때 발생한다."
      ],
      answer: 0,
      explanation: "$\tanh$ 미분값($\le 1$)과 $W_{hh}$의 최대 고유값이 1 미만일 때 행렬 연쇄 곱에 의해 오차 경사도가 지수적으로 줄어듭니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-037",
      conceptId: "transformer-causal-mask-softmax-math",
      difficulty: "hard",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "Causal Masking 행렬 $M$의 원소가 $M_{ij} = 0 \\quad (i \\ge j)$ 이고 $M_{ij} = -\\infty \\quad (i < j)$ 일 때, $(S + M)$에 Softmax를 적용한 행렬의 $j > i$ 위치 값은?",
      options: ["0", "1", "$1/N$", "$-\infty$"],
      answer: 0,
      explanation: "미래 위치($j > i$)의 score가 $-\\infty$가 되므로, $\\exp(-\\infty) = 0$ 이 되어 Softmax 결과는 정확히 0이 됩니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-038",
      conceptId: "rotary-position-embedding-relative-property",
      difficulty: "hard",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "RoPE 회전 임베딩이 $R_{\\Theta, m} q$ 와 $R_{\\Theta, n} k$ 의 내적 $q_m^T k_n = (R_{\\Theta, m} q)^T (R_{\\Theta, n} k)$ 계산 시 얻게 되는 핵심 수학적 성질은?",
      options: [
        "회전 행렬의 성질에 의해 내적 결과가 오직 두 상대 위치의 차이인 $(m - n)$에만 의존하는 함수 $g(q, k, m-n)$로 정리된다.",
        "내적 결과가 절대 위치 $m + n$의 합으로 정리된다.",
        "내적 결과가 항상 0이 된다.",
        "위치 정보가 완벽히 소실되어 사라진다."
      ],
      answer: 0,
      explanation: "RoPE는 $R_{\\Theta, m}^T R_{\\Theta, n} = R_{\\Theta, n-m}$ 이 되는 교환/회전 성질을 이용해 상대 위치 $(m-n)$ 정보만 유효하게 내적에 남깁니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-039",
      conceptId: "activation-aware-quantization-awq",
      difficulty: "hard",
      category: "LLM 경량화",
      questionType: "multiple-choice",
      prompt: "AWQ(Activation-aware Weight Quantization) 연구가 기존 Post-Training Quantization(PTQ) 대비 높은 정확도를 유지하는 원리는?",
      options: [
        "모든 가중치를 동등하게 양자화하지 않고, Activation 활성화 채널의 크기를 관찰하여 1%의 중요한 가중치를 보호(FP16) 및 스케일링하여 양자화한다.",
        "가중치를 1비트로 전면 변환한다.",
        "Attention 레이어를 삭제한다.",
        "학습 데이터를 100배 늘린다."
      ],
      answer: 0,
      explanation: "AWQ는 활성화(Activation) 값이 크게 튀는 상위 1% 정밀 채널 가중치를 보호하는 방식으로 4비트 양자화 손실을 방지합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-040",
      conceptId: "poht-positional-embedding",
      difficulty: "hard",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "Learned Absolute Position Embedding과 Sinusoidal Position Encoding의 비교 중 올바른 설명은?",
      options: [
        "Learned 방식은 시퀀스 길이가 사전 설정 범위를 넘어서면 위치 벡터를 얻을 수 없으나, Sinusoidal은 삼각함수 공식에 의해 이론상 더 길어진 길이도 계산 가능하다.",
        "Learned 방식이 무조건 외삽(Extrapolation)에 강하다.",
        "Sinusoidal 방식은 학습 파라미터 수가 10배 더 많다.",
        "두 방식은 완전 동일하여 차이가 없다."
      ],
      answer: 0,
      explanation: "Learned Absolute 방식은 학습 시 정의한 max_seq_len 노드만 파라미터로 존재하므로, 그보다 긴 시퀀스 입력 시 외삽이 불가능합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-041",
      conceptId: "word2vec-hierarchical-softmax-path-prob",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Hierarchical Softmax에서 루트 노드부터 특정 단어 $w$까지의 경로 $n(w, 1), n(w, 2), ..., n(w, L)$ 가 있을 때, 단어 $w$가 선택될 최종 조건부 확률 $P(w|w_c)$의 산출 방식은?",
      options: [
        "루트에서 리프 단어 노드까지 각 분기점 자식 노드로 진행할 이진 시그모이드 확률 $\\sigma(\\pm v_{n}^T v_{w_c})$들의 연쇄 곱",
        "모든 분기점 노드 벡터의 덧셈",
        "루트 노드의 Softmax 값 1개",
        "경로 노드 개수 $L$로 나누기"
      ],
      answer: 0,
      explanation: "트리의 루트부터 해당 단어 리프에 다다르는 경로상 자식 노드 왼쪽/오른쪽 선택 이진 분류 확률들의 곱으로 계산합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-042",
      conceptId: "bptt-truncated-bptt",
      difficulty: "hard",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "아주 긴 시퀀스에서 BPTT 연산 오버헤드와 기울기 문제를 완화하기 위해 시퀀스를 일정 길이 $k_1$ 고정 블록 단위로 잘라 역전파를 고정 시점까지만 끊어서 수행하는 기법은?",
      options: ["Truncated BPTT", "Full BPTT", "Layer Normalization", "Gradient Accumulation"],
      answer: 0,
      explanation: "Truncated BPTT는 순방향 전개는 이어가되 역전파 경사 계산은 일정 타임스텝 $k_1$ 깊이에서 잘라(Truncate) 학습을 가볍게 수행합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-043",
      conceptId: "seq2seq-beam-search-length-penalty",
      difficulty: "hard",
      category: "Seq2Seq",
      questionType: "multiple-choice",
      prompt: "Beam Search 시 로그 확률 합 $\\sum \\log P(y_t)$ 만 사용할 경우, 길이가 짧은 후보 문장이 무조건 유리해지는 편향을 막기 위해 사용하는 길이 페널티(Length Penalty) 수식 적용 방식은?",
      options: [
        "누적 로그 확률 합을 문장 길이 $|Y|$의 승수로 나눈 점수 $\\frac{1}{|Y|^\\alpha} \\sum \\log P(y_t)$ 로 정규화한다.",
        "문장 길이가 길수록 점수를 100점 감점한다.",
        "단어 수가 5개 이상이면 선택에서 제외한다.",
        "로그 확률을 제곱한다."
      ],
      answer: 0,
      explanation: "로그 확률($\\le 0$)은 더할수록 음수로 작아지므로 짧은 문장이 우세해집니다. 이를 막고자 길이 $|Y|^\\alpha$ 로 나누어 스코어를 보정합니다[cite: 2, 3]."
    },
    {
      id: "nlp-hard-mc-044",
      conceptId: "attention-is-all-you-need-transformer-base-dims",
      difficulty: "hard",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "Attention Is All You Need 논문 기준 Transformer Base 모델의 차원 설정 $d_{model}, h, d_k, d_{ff}$ 의 올바른 조합은?",
      options: [
        "$d_{model} = 512, \\quad h = 8, \\quad d_k = 64, \\quad d_{ff} = 2048$",
        "$d_{model} = 1024, \\quad h = 16, \\quad d_k = 128, \\quad d_{ff} = 512$",
        "$d_{model} = 256, \\quad h = 4, \\quad d_k = 64, \\quad d_{ff} = 4096$",
        "$d_{model} = 768, \\quad h = 12, \\quad d_k = 64, \\quad d_{ff} = 768$"
      ],
      answer: 0,
      explanation: "원 논문 Base 설정은 $d_{model}=512, h=8, d_k=d_{model}/h=64, d_{ff}=2048$ 입니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-045",
      conceptId: "instruct-gpt-ppo-value-function",
      difficulty: "hard",
      category: "선호 학습",
      questionType: "multiple-choice",
      prompt: "InstructGPT의 PPO 강화학습 알고리즘 구동 시, 정책 언어 모델(Policy Network)과 함께 토큰 생성 타임스텝별 기대 보상을 예측하도록 보조 트레이닝되는 모델은?",
      options: ["가치 함수 네트워크 (Value Network / Critic)", "보상 모델 (Reward Model)", "SFT 모델", "토크나이저"],
      answer: 0,
      explanation: "PPO(Actor-Critic 구조)에서는 현재 토큰 시점 이후의 기대 누적 보상을 추정하기 위해 Value Network(Critic)를 동시 학습시켜 어드밴티지(Advantage)를 구합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-046",
      conceptId: "cross-entropy-token-level-loss-math",
      difficulty: "hard",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "길이 $T$인 문장 $X = (x_1, ..., x_T)$에 대해 언어 모델의 Causal Cross-Entropy Loss $L$의 정확한 산출 수식은?",
      options: [
        "$L = -\\frac{1}{T} \\sum_{t=1}^T \\log P_{\\theta}(x_t | x_1, ..., x_{t-1})$",
        "$L = -\\sum_{t=1}^T P_{\\theta}(x_t) \\log x_t$",
        "$L = \\frac{1}{T} \\sum_{t=1}^T (x_t - \\hat{x}_t)^2$",
        "$L = -\\log P(x_1) + \\log P(x_T)$"
      ],
      answer: 0,
      explanation: "이전 토큰들이 주어졌을 때 정답 토큰 $x_t$의 음의 로그 가능도(Negative Log-Likelihood) 평균을 손실함수로 취합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-047",
      conceptId: "temperature-sampling-math-distribution",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Temperature $T \\rightarrow \\infty$ (무한대) 로 커질 때 언어 모델의 출력 확률 분포 형태 변화는?",
      options: [
        "모든 단어의 선택 확률이 $\\frac{1}{|V|}$ 로 동일해지는 완벽한 균등 분포(Uniform Distribution)가 되어 랜덤 무작위 출력이 된다.",
        "가장 로짓이 큰 단어의 확률이 1이 된다.",
        "확률 분포가 변경되지 않고 유지된다.",
        "모든 확률이 0이 된다."
      ],
      answer: 0,
      explanation: "$T \\to \\infty$ 이면 모든 $z_i / T \\to 0$이 되어 $\\exp(0)=1$이 되므로, 모든 단어 선택 확률이 $1/|V|$인 균등 무작위 분포가 됩니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-048",
      conceptId: "eval-mmeu-gpqa-drop-difference",
      difficulty: "hard",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "LLM 평가 벤치마크 중 DROP(Discrete Reasoning Over Paragraphs) 벤치마크가 MMLU와 차별화되는 주요 요구 능력은?",
      options: [
        "지문 내 유 유 유 텍스트를 읽고 구체적인 덧셈, 뺄셈, 카운팅 등의 이산적 수리/논리 연산을 수행하여 정답을 추출하는 능력",
        "단순 객관식 상식 암기 능력",
        "파이썬 코드 문법 검수 능력",
        "영한 번역 능력"
      ],
      answer: 0,
      explanation: "DROP은 지문에서 정보를 찾아 산술 연산(Addition, Counting 등)을 수행한 뒤 정확한 수치/단어를 내놓아야 하는 벤치마크입니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-049",
      conceptId: "llama-3-grouped-query-attention-adoption",
      difficulty: "hard",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "LLaMA 3 아키텍처가 LLaMA 2 (7B/13B는 MHA 사용) 대비 모든 사이즈(8B, 70B 등) 모델에 공통적으로 확대한 트랜스포머 레이어 최적화 기술은?",
      options: ["Grouped-Query Attention (GQA) 전면 채택", "RNN 서브레이어 혼합", "Positional Encoding 삭제", "Softmax 제거"],
      answer: 0,
      explanation: "LLaMA 3는 8B 같은 소형 모델을 포함한 전 사이즈에 GQA를 확대 적용하여 긴 컨텍스트 추론 시 KV 캐시 메모리 오버헤드를 대폭 축소시켰습니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-050",
      conceptId: "jailbreak-prefix-injection",
      difficulty: "hard",
      category: "LLM 안전성",
      questionType: "multiple-choice",
      prompt: "LLM 탈옥 공격 중 \"Start with 'Absolutely! Here is '\" 같은 문구를 강제로 부여하여 모델의 거절 메커니즘을 무력화하는 기법 명칭은?",
      options: ["Prefix Injection (프리픽스 주입)", "RAG", "DPO", "Fine-tuning"],
      answer: 0,
      explanation: "Wei 등의 연구에 따르면 답변 시작 긍정 문구(Prefix)를 강제 지정하면 모델의 긍정 토큰 연쇄 생성으로 안전 거절 통제가 무너집니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-051",
      conceptId: "word2vec-cbow-weight-matrices",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec 모델이 가지고 있는 2개의 가중치 행렬 $W \\in \\mathbb{R}^{V \\times N}$ 과 $W' \\in \\mathbb{R}^{N \\times V}$ 에 대해, 학습 완료 후 단어 $w_i$의 최종 임베딩 벡터를 추출하는 일반적인 방법은?",
      options: [
        "입력 가중치 행렬 $W$의 $i$번째 행 벡터를 사용하거나, $W$와 $W'^T$의 평균을 사용한다.",
        "무조건 $W'$만 사용하고 $W$는 버린다.",
        "$W$와 $W'$를 역행렬 곱한다.",
        "가중치 행렬을 사용하지 않고 원-핫 벡터를 그대로 쓴다."
      ],
      answer: 0,
      explanation: "보통 입력 가중치 행렬 $W$의 행 벡터 $v_{w_i}$를 임베딩 벡터로 사용하며, 때에 따라 $W$와 $W'$의 평균을 쓰기도 합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-052",
      conceptId: "rnn-hidden-to-hidden-matrix-dimension",
      difficulty: "hard",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "입력 벡터 $x_t \\in \\mathbb{R}^{d_x}$ 이고 은닉 상태 $h_t \\in \\mathbb{R}^{d_h}$ 일 때, RNN의 가중치 행렬 $W_{xh}$와 $W_{hh}$의 차원 크기는 각각 어떻게 되는가?",
      options: ["$W_{xh} \\in \\mathbb{R}^{d_h \\times d_x}$, $\\quad W_{hh} \\in \\mathbb{R}^{d_h \\times d_h}$", "$W_{xh} \\in \\mathbb{R}^{d_x \\times d_x}$, $\\quad W_{hh} \\in \\mathbb{R}^{d_h \\times d_x}$", "$W_{xh} \\in \\mathbb{R}^{d_h \\times d_h}$, $\\quad W_{hh} \\in \\mathbb{R}^{d_x \\times d_x}$", "$W_{xh} \\in \\mathbb{R}^{1 \\times d_x}$, $\\quad W_{hh} \\in \\mathbb{R}^{1 \\times d_h}$"],
      answer: 0,
      explanation: "$h_t = \\tanh(W_{hh} h_{t-1} + W_{xh} x_t)$ 에서 연산 결과가 모두 $d_h$ 차원이 되어야 하므로 $W_{xh}$는 $(d_h \\times d_x)$, $W_{hh}$는 $(d_h \\times d_h)$ 입니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-053",
      conceptId: "lstm-gate-activation-functions",
      difficulty: "hard",
      category: "LSTM",
      questionType: "multiple-choice",
      prompt: "LSTM 구조 내부에서 3개의 게이트($f_t, i_t, o_t$) 출력에 사용하는 활성화 함수와 후보 세포 상태($\\tilde{C}_t$)에 사용하는 활성화 함수 조합은?",
      options: [
        "게이트에는 Sigmoid (0~1 비율 조절), 후보 세포 상태에는 $\\tanh$ (-1~1 값 생성)",
        "게이트에는 $\\tanh$, 후보 세포 상태에는 Sigmoid",
        "게이트와 후보 세포 상태 모두 ReLU",
        "게이트와 후보 세포 상태 모두 Softmax"
      ],
      answer: 0,
      explanation: "게이트는 정보 통과 스위치 역할을 하므로 0~1 사이의 Sigmoid를 쓰고, 정보 값 자체인 $\\tilde{C}_t$는 -1~1 사이의 $\\tanh$를 씁니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-054",
      conceptId: "seq2seq-inference-exposure-bias",
      difficulty: "hard",
      category: "Seq2Seq",
      questionType: "multiple-choice",
      prompt: "Teacher Forcing으로 학습된 Seq2Seq 모델이 추론 시에는 이전 시점 자신의 예측값만 써야 하므로 학습과 추론 간 조건 차이로 오차가 누적되는 현상은?",
      options: ["Exposure Bias (노출 편향)", "Overfitting", "Bottleneck Problem", "Gradient Vanishing"],
      answer: 0,
      explanation: "학습 때는 정답(Teacher Forcing)만 보다가 추론 시 생성된 예측에 노출되어 오차가 연쇄 증폭되는 현상을 Exposure Bias라 합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-055",
      conceptId: "attention-is-all-you-need-multihead-projection-reason",
      difficulty: "hard",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머가 단일 $d_{model}$ 차원 어텐션 1개를 수행하는 대신, 차원을 $h$개로 나눈 Multi-Head Attention을 수행하는 수학적 이점은?",
      options: [
        "서로 다른 하위 공간(Subspace)에서 문법적, 의미적, 시제적 관점 등의 상호작용 정보를 동시에 병렬 포착할 수 있어서",
        "파라미터 개수가 10배 늘어나서",
        "계산 복잡도가 $O(1)$로 줄어들어서",
        "Softmax 함수를 생략할 수 있어서"
      ],
      answer: 0,
      explanation: "단일 헤드는 평균적인 연관성 1개만 보지만, 멀티 헤드는 $d_k$ 차원의 여러 저차원 투영 공간에서 다양한 표현 관점을 동시에 학습합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-056",
      conceptId: "flan-instruction-tuning-model-scale-effect",
      difficulty: "hard",
      category: "지시 학습",
      questionType: "multiple-choice",
      prompt: "FLAN 논문의 실험 결과 중, Instruction Tuning의 성능 향상 효과가 나타나기 시작하는 '모델 크기 임계점'에 관한 사실은?",
      options: [
        "특정 규모 이상의 대형 모델(예: 8B~68B 이상)에서만 Instruction Tuning으로 인한 Zero-shot 성능 향상이 급격히 나타난다.",
        "모델 크기가 작을수록(0.1B 이하) Instruction Tuning 효과가 가장 극대화된다.",
        "모델 크기와 Instruction Tuning 효과는 아무런 상관관계가 없다.",
        "모든 모델 크기에서 무조건 동일한 비율로 향상된다."
      ],
      answer: 0,
      explanation: "지시문 파악 및 이행 능력도 창발성의 일종으로, 일정 매개변수 규모(약 8B 이상)를 넘어서야 Instruction Tuning의 이점이 발현됩니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-057",
      conceptId: "dpo-loss-function-math-structure",
      difficulty: "hard",
      category: "선호 학습",
      questionType: "multiple-choice",
      prompt: "DPO 목적함수 $L_{DPO}(\\theta; \\pi_{ref}) = -\\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma \\left( \\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{ref}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{ref}(y_l|x)} \\right) \\right]$ 의 핵심 메커니즘은?",
      options: [
        "선호 응답 $y_w$의 참조 모델 대비 상대적 확률비는 올리고, 비선호 응답 $y_l$의 상대적 확률비는 내리도록 시그모이드 손실을 최소화한다.",
        "$y_w$와 $y_l$의 확률을 모두 동시에 0으로 만든다.",
        "참조 모델 $\\pi_{ref}$의 파라미터를 역전파로 업데이트한다.",
        "보상 모델 $R_\\phi$의 가중치를 새로 Gradient Descent 학습시킨다."
      ],
      answer: 0,
      explanation: "DPO 손실함수는 별도 보상 모델 없이, $y_w$의 로그 확률비 증가량과 $y_l$의 로그 확률비 감소량 차이를 Sigmoid 이진 분류 형태로 최적화합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-058",
      conceptId: "kv-cache-multi-query-attention-reduction",
      difficulty: "hard",
      category: "LLM 추론 최적화",
      questionType: "multiple-choice",
      prompt: "헤드 수가 $H=8$일 때, Multi-Head Attention(MHA)을 Multi-Query Attention(MQA)으로 변경할 경우 KV Cache 메모리 사용량의 감소 비율은?",
      options: ["1/8 로 감소 (1/H배)", "1/2 로 감소", "변화 없음", "8배로 증가"],
      answer: 0,
      explanation: "MQA는 모든 $H$개 Query 헤드가 1개의 K, V 헤드만 공유하므로 KV 캐시 용량이 정직하게 $1/H$ 로 축소됩니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-059",
      conceptId: "eval-pass-at-1-vs-pass-at-100",
      difficulty: "hard",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "코드 생성 평가 시 pass@1 스코어와 pass@100 스코어가 구체적으로 측정하는 모델 특성의 차이는?",
      options: [
        "pass@1은 모델이 단 한 번에 올바른 코드를 작성하는 정밀성을, pass@100은 100번 시도 내에 정답을 포함할 수 있는 탐색 공간 상한 능력을 평가한다.",
        "pass@1은 소요 시간을, pass@100은 메모리 사용량을 평가한다.",
        "pass@1은 파이썬만 평가하고 pass@100은 C++만 평가한다.",
        "두 지표는 완벽히 동일한 수치를 반환한다."
      ],
      answer: 0,
      explanation: "pass@1은 1회 생성 정확성(Single-shot precision)을 측정하며, pass@100은 모델의 잠재적 정답 생성 상한 범위를 보여줍니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-060",
      conceptId: "system-prompt-jailbreak-vulnerability",
      difficulty: "hard",
      category: "LLM 안전성",
      questionType: "multiple-choice",
      prompt: "시스템 프롬프트에 아무리 엄격한 안전 규칙을 작성해 두어도 환각이나 공격에 의해 뚫릴 수 있는 근본적 아키텍처 원인은?",
      options: [
        "LLM 트랜스포머는 시스템 프롬프트와 유저 쿼리를 별도의 격리된 메커니즘으로 구분하지 않고 단지 하나의 연결된 토큰 시퀀스로 어텐션 처리하기 때문에",
        "시스템 프롬프트가 영어가 아니기 때문에",
        "GPU 가속기가 켜져 있어서",
        "시스템 프롬프트를 인코더만 읽기 때문에"
      ],
      answer: 0,
      explanation: "LLM 아키텍처상 시스템 프롬프트와 유저 입력은 동일한 Context Window 내의 토큰 시퀀스여서 유저 입력이 시스템 지침을 무력화할 가능성이 존재합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-061",
      conceptId: "word2vec-cbow-vs-skipgram-data-amount",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "학습 데이터셋의 크기가 매우 적을 때, CBOW보다 Skip-gram이 더 추천되는 결정적 이유는?",
      options: [
        "Skip-gram은 중심 단어 하나당 여러 주변 단어 쌍((중심, 주변1), (중심, 주변2)...)으로 데이터를 뻥튀기하여 많은 훈련 샘플을 생성하기 때문에",
        "Skip-gram이 메모리를 적게 써서",
        "CBOW는 적은 데이터에서 에러가 나기 때문에",
        "Skip-gram은 사전 학습된 가중치를 사용하기 때문에"
      ],
      answer: 0,
      explanation: "Skip-gram은 단어 한 스텝당 (Target, Context) 업데이트 쌍을 $2c$개 만들어내므로 적은 코퍼스에서도 학습 기회가 훨씬 많습니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-062",
      conceptId: "rnn-hidden-state-initialization",
      difficulty: "hard",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "RNN의 첫 타임스텝 $t=1$ 연산 시 사용되는 초기 은닉 상태 $h_0$의 일반적인 설정 방법은?",
      options: ["모든 원소가 0인 영벡터(Zero Vector)로 초기화하거나 학습 가능한 파라미터로 설정한다.", "모든 원소를 무한대로 설정한다.", "첫 번째 입력 단어 $x_1$과 완전히 동일한 벡터로 설정한다.", "설정할 수 없으며 무조건 생략한다."],
      answer: 0,
      explanation: "보통 $h_0 = \\vec{0}$ 영벡터로 초기화하며, 인코더-디코더 연결 시에는 인코더의 마지막 상태 $h_T$를 디코더의 $h_0$로 씁니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-063",
      conceptId: "lstm-forget-gate-bias-initialization",
      difficulty: "hard",
      category: "LSTM",
      questionType: "multiple-choice",
      prompt: "Gers 등에 의해 제안된 기법으로, LSTM 학습 초기 단계에 과거 정보를 잊지 않고 잘 유지하도록 Forget gate의 편향(Bias) $b_f$를 초기화하는 권장값은?",
      options: ["1.0 또는 2.0처럼 양수의 큰 값으로 초기화한다.", "-10.0으로 초기화한다.", "0으로 초기화한다.", "음수 무한대로 초기화한다."],
      answer: 0,
      explanation: "$b_f$를 1~2 정도로 양수 초기화하면 $\\sigma(b_f) \\approx 1$이 되어 학습 초기에 이전 Cell state 기억을 잊지 않고 보존하게 됩니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-064",
      conceptId: "seq2seq-teacher-forcing-ratio-decay",
      difficulty: "hard",
      category: "Seq2Seq",
      questionType: "multiple-choice",
      prompt: "Teacher Forcing의 노출 편향(Exposure Bias) 문제를 완화하기 위해, 학습 초반에는 정답을 넣어주다가 에포크가 진행됨에 따라 모델의 이전 예측값을 일정 확률로 섞어 넣어주는 기법은?",
      options: ["Scheduled Sampling", "Greedy Search", "Label Smoothing", "Dropout"],
      answer: 0,
      explanation: "Scheduled Sampling은 학습 진행에 따라 Teacher Forcing 확률을 감소시켜 모델이 자기 예측에 노출되도록 적응시킵니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-065",
      conceptId: "attention-weight-temperature-scaling",
      difficulty: "hard",
      category: "Attention",
      questionType: "multiple-choice",
      prompt: "Attention Score에 Softmax를 적용하기 전 온도 $T$ 스케일링을 $a_i = \\text{softmax}(e_i / T)$ 로 적용할 때, $T$가 매우 클 때 Attention 가중치의 형태는?",
      options: [
        "모든 인코더 토큰에 대해 가중치가 고르게 분산되는 균등 분포(Uniform) 형태가 된다.",
        "단 하나의 토큰에만 가중치 1.0이 쏠린다.",
        "Attention 가중치가 모두 음수가 된다.",
        "인코더의 첫 단어에만 집중된다."
      ],
      answer: 0,
      explanation: "온도 $T$가 매우 커지면 $e_i / T \\to 0$이 되어 모든 위치의 Attention 가중치가 동일하게 평평해집니다[cite: 2, 3]."
    },
    {
      id: "nlp-hard-mc-066",
      conceptId: "transformer-encoder-vs-decoder-self-attention-matrix",
      difficulty: "hard",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머 인코더의 Self-Attention 행렬 $S_{enc}$와 디코더의 Masked Self-Attention 행렬 $S_{dec}$의 0이 아닌 유효 계산 영역 모양 차이는?",
      options: [
        "$S_{enc}$는 $T \\times T$ 전체 정사각형 영역이 유효하고, $S_{dec}$는 대각선 아래 하삼각(Lower-triangular) 영역만 유효하다.",
        "$S_{enc}$는 하삼각 영역만 유효하고, $S_{dec}$는 전체 영역이 유효하다.",
        "$S_{enc}$는 대각선 요소만 유효하고, $S_{dec}$는 상삼각 영역만 유효하다.",
        "둘 다 상삼각 영역만 유효하다."
      ],
      answer: 0,
      explanation: "인코더는 양방향 참조로 $T \\times T$ 전체가 유효하고, 디코더는 미래 토큰 차단으로 대각선 및 하삼각 영역만 계산 유효합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-067",
      conceptId: "gpt-3-few-shot-no-gradient-update",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "GPT-3 논문에서 정의한 Few-shot Prompting 수행 시 일어나는 신경망 내부 매개변수(Weight) 변화에 관한 사실은?",
      options: [
        "경사하강법(Gradient Descent)이나 가중치 업데이트가 전혀 발생하지 않는다.",
        "프롬프트의 예시 개수만큼 가중치가 미세 역전파된다.",
        "마지막 Softmax 레이어의 가중치만 재학습된다.",
        "Every 10개 토큰마다 가중치가 리셋된다."
      ],
      answer: 0,
      explanation: "In-context Few-shot Prompting은 단지 프롬프트 텍스트 입력으로 순방향(Forward pass) 연산만 할 뿐 가중치 업데이트(Gradient update)는 0회 발생합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-068",
      conceptId: "instruct-gpt-sft-data-size",
      difficulty: "hard",
      category: "지시 학습",
      questionType: "multiple-choice",
      prompt: "InstructGPT 논문에서 사전 학습(3000억 토큰) 대비 Step 1 SFT(지도 미세조정)에 사용된 프롬프트-답변 데모 데이터의 상대적 규모 특성은?",
      options: [
        "약 1만~2만 건 정도의 매우 적은 고품질 데이터셋만으로도 지시 이행 정렬이 가능했다.",
        "사전 학습보다 10배 많은 데이터가 필요했다.",
        "100억 건 이상의 데이터가 사용되었다.",
        "데이터 건수가 많을수록 무조건 비례해서 정렬 성능이 올랐다."
      ],
      answer: 0,
      explanation: "사전 학습에 비해 SFT 정렬 단계에는 약 13,000여 건의 비교적 소량 고품질 데이터만으로도 지시 이행 양식이 빠르게 형성되었습니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-069",
      conceptId: "decoding-repetition-penalty-formula",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "디코딩 시 이전에 이미 생성된 토큰 $x_j$의 로짓 $z_{x_j}$에 패널티 $\\theta > 1$을 적용하여 무한 반복을 방지하는 Repetition Penalty 적용 수식 규칙은?",
      options: [
        "$z_i = \\begin{cases} z_i / \\theta & (z_i > 0 \\text{ 일 때}) \\\\ z_i \\times \\theta & (z_i < 0 \\text{ 일 때}) \\end{cases}$",
        "$z_i = z_i - \\theta$",
        "$z_i = z_i \\times \\theta$",
        "$z_i = 0$"
      ],
      answer: 0,
      explanation: "로짓 $z_i$가 양수면 $\\theta$로 나누어 줄이고, 음수면 $\\theta$를 곱해 더 큰 음수로 만들어 선택 확률을 차단합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-070",
      conceptId: "eval-arc-challenge-dataset",
      difficulty: "hard",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "ARC(AI2 Reasoning Challenge) 벤치마크 중 ARC-Challenge 서브셋이 측정하는 주된 요구 능력은?",
      options: [
        "초중등 과학교과 문제 중 단순 검색이나 정보 검색 알고리즘으로는 풀리지 않고 복합적 다단계 추론이 필요한 고난도 문제 해결 능력",
        "단순 단어 철자 맞추기 능력",
        "영한 번역 정확도",
        "파이썬 코드 속도 측정"
      ],
      answer: 0,
      explanation: "ARC-Challenge는 정보 검색(IR)이나 Word Co-occurrence 알고리즘이 틀리도록 의도적으로 구성된 복합 과학 추론 문제 모음입니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-071",
      conceptId: "fasttext-out-of-vocabulary-vector-sum",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "FastText가 학습 때 본 적 없는 사전에 없는 단어(OOV) \"apple-like\" 가 들어왔을 때 임베딩 벡터를 구하는 방식은?",
      options: [
        "단어 \"apple-like\"에서 추출한 문자 n-gram들(\"<ap\", \"app\", \"pple\"...)의 임베딩 벡터를 모두 더한다.",
        "무작위 영벡터(Zero Vector)를 반환한다.",
        "에러를 발생시키고 멈춘다.",
        "단어를 철자 1개 단위로 모두 삭제한다."
      ],
      answer: 0,
      explanation: "FastText는 단어가 OOV여도 내부에서 추출되는 문자 n-gram들의 벡터를 합산하여 고유 임베딩을 구성해 냅니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-072",
      conceptId: "rnn-many-to-one-last-hidden-state",
      difficulty: "hard",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "텍스트 감정 분류를 위한 Many-to-One RNN 구현 시, 전체 시퀀스 $x_1, ..., x_T$를 거친 후 분류기(Linear + Softmax)의 입력으로 들어가는 은닉 벡터는?",
      options: ["마지막 시점의 은닉 상태 $h_T$", "첫 번째 시점의 은닉 상태 $h_1$", "모든 시점 은닉 상태들의 곱", "입력 단어 $x_1$의 원-핫 벡터"],
      answer: 0,
      explanation: "Many-to-One 구조에서는 전체 시퀀스 정보가 누적 전달된 마지막 타임스텝의 $h_T$를 최종 분류기의 입력으로 사용합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-073",
      conceptId: "lstm-peephole-gate-equation",
      difficulty: "hard",
      category: "LSTM 변형",
      questionType: "multiple-choice",
      prompt: "Peephole Connection이 적용된 LSTM의 Forget gate $f_t$ 수식의 차이점은?",
      options: [
        "$f_t = \\sigma(W_f \\cdot [C_{t-1}, h_{t-1}, x_t] + b_f)$ 처럼 이전 세포 상태 $C_{t-1}$이 오프셋으로 직접 포함된다.",
        "$x_t$를 수식에서 완전히 제외한다.",
        "$h_{t-1}$을 삭제하고 $C_t$만 쓴다.",
        "활성화 함수를 $\tanh$로 변경한다."
      ],
      answer: 0,
      explanation: "Peephole 구조는 게이트 제어 시 이전 타임스텝의 $C_{t-1}$ 값도 인풋 항목으로 들여다보도록 수식이 확장됩니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-074",
      conceptId: "seq2seq-attention-context-vector-concat-decoder-hidden",
      difficulty: "hard",
      category: "Attention",
      questionType: "multiple-choice",
      prompt: "Attention 적용 Seq2Seq에서 디코더 시점 $t$의 최종 예측 확률을 구하기 위해 소프트맥스 층으로 들어가기 직전 결합(Concat)하는 두 벡터는?",
      options: [
        "디코더의 현재 은닉 상태 $s_t$와 Attention 컨텍스트 벡터 $a_t$",
        "인코더의 첫 은닉 상태 $h_1$과 입력 $x_t$",
        "단어 사전 원-핫 벡터와 $s_t$",
        "Forget gate $f_t$와 Input gate $i_t$"
      ],
      answer: 0,
      explanation: "현재 디코더 상태 $s_t$와 어텐션 가중합 벡터 $a_t$를 이어붙여([$s_t; a_t$]) 비선형 층 및 Softmax를 통과시킵니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-075",
      conceptId: "transformer-cross-attention-masking-absence",
      difficulty: "hard",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머 디코더의 Cross-Attention 서브레이어에서는 왜 미래 토큰 참조 차단을 위한 Causal Masking을 적용하지 않는가?",
      options: [
        "인코더의 출력 전체는 이미 이미 완성된 소스 문장이므로 미래를 숨길 필요 없이 양방향 전체 문맥을 다 참조해야 하기 때문에",
        "Cross-Attention에서는 마스킹 기술이 불가능해서",
        "인코더 출력이 0이기 때문에",
        "Cross-Attention은 어텐션 점수를 구하지 않기 때문에"
      ],
      answer: 0,
      explanation: "인코더 입력(소스 문장)은 이미 번역/처리 대상 전체가 주어져 있으므로 Causal Masking 없이 전 타임스텝 $K, V$를 모두 참조합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-076",
      conceptId: "gpt-3-dataset-weighting-reason",
      difficulty: "hard",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "GPT-3 사전 학습 시 원본 용량이 훨씬 큰 Common Crawl(410B 토큰)의 샘플링 가중치 비중(60%)을 낮추고, 용량이 적은 Wikipedia(3B 토큰)나 Books 데이터의 샘플링 비중을 높여 여러 번 반복 노출시킨 이유는?",
      options: [
        "데이터의 질(Quality)이 높은 양질의 텍스트북/위키피디아 데이터를 모델이 더 집중적으로 학습하도록 가중치를 조절하기 위해",
        "Common Crawl 데이터에 오타가 전혀 없어서",
        "Wikipedia 데이터 용량을 늘리기 위해",
        "GPU 가열을 막기 위해"
      ],
      answer: 0,
      explanation: "데이터 양이 적더라도 신뢰도와 문장 완성도가 높은 노이즈 적은 양질의 데이터(Wikipedia/Books)에 높은 가중치를 주어 오버샘플링했습니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-077",
      conceptId: "rlhf-reward-model-binary-pair-loss",
      difficulty: "hard",
      category: "선호 학습",
      questionType: "multiple-choice",
      prompt: "InstructGPT 보상 모델 $R_\\psi$ 학습 시 사용되는 이진 쌍 손실함수(Binary Pairwise Loss) $loss(\\psi) = -\\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma \\left( R_\\psi(x, y_w) - R_\\psi(x, y_l) \\right) \\right]$ 의 최소화 의미는?",
      options: [
        "사람이 더 선호한 답변 $y_w$의 보상값과 비선호 답변 $y_l$의 보상값의 차이 $(R_w - R_l)$를 시그모이드 확률 상에서 극대화한다.",
        "$R_w$와 $R_l$을 모두 0으로 만든다.",
        "$R_w$보다 $R_l$의 값을 더 크게 만든다.",
        "두 답변의 보상값 차이를 0으로 수렴시킨다."
      ],
      answer: 0,
      explanation: "선호 답변 $y_w$의 보상 점수가 비선호 답변 $y_l$의 보상 점수보다 최대한 높아지도록 로그 시그모이드 차이를 유도합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-078",
      conceptId: "kv-cache-paged-attention-concept",
      difficulty: "hard",
      category: "LLM 추론 최적화",
      questionType: "multiple-choice",
      prompt: "vLLM에서 채택한 PagedAttention 기술이 KV Cache 단편화 메모리 낭비를 극복하기 위해 사용한 운영체제(OS)의 개념은?",
      options: ["가상 메모리 페이징 (Virtual Memory Paging)", "스왑 파일", "인터럽트 처리", "RAID 0 디스크 구성"],
      answer: 0,
      explanation: "PagedAttention은 OS의 가상 메모리 페이징 기법을 응용해 KV 캐시를 불연속 물리 VRAM 블록 페이지에 동적 할당하여 단편화를 제거합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-079",
      conceptId: "prompt-chain-of-thought-tree-search-comparison",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "Standard Prompting $\\rightarrow$ Chain-of-Thought (CoT) $\\rightarrow$ Tree of Thoughts (ToT) 로의 발전에 따른 추론 공간 탐색의 구조적 변화 과정은?",
      options: [
        "단일 토큰 즉시 샘플링 $\\rightarrow$ 단일 직선 추론 경로 생성 $\\rightarrow$ 트리 가지치기 및 백트래킹 기반 다중 경로 탐색",
        "트리 탐색 $\\rightarrow$ 일직선 추론 $\\rightarrow$ 단답형 즉시 생성",
        "단답형 즉시 생성 $\\rightarrow$ 무작위 트래킹 $\\rightarrow$ 단일 일직선 추론",
        "변화 없이 모두 동일함"
      ],
      answer: 0,
      explanation: "ToT는 CoT의 단일 일직선 생각 연쇄를 노드 단위로 분기시켜 다지 탐색과 평가를 조합한 공간 탐색으로 진화시킨 것입니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-080",
      conceptId: "eval-mmlu-5-shot-standard",
      difficulty: "hard",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "MMLU 벤치마크 평가 시 표준적인 프롬프팅 지침 프레임(Shots) 설정으로 가장 많이 사용되는 공식 기준은?",
      options: ["5-shot 프롬프팅", "100-shot 프롬프팅", "Zero-shot 전용", "가중치 미세조정 필수"],
      answer: 0,
      explanation: "MMLU의 표준 평가 프로토콜은 5개의 예시 지문을 제공하는 5-shot In-context 프롬프팅을 기준으로 모델들을 공정 비교합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-081",
      conceptId: "word2vec-hierarchical-softmax-sigmoid-sign",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Hierarchical Softmax 이진 결정 노드에서 자식 노드 왼쪽/오른쪽 선택 시 시그모이드 수식 $\\sigma(\\pm v_{n}^T v_{w_c})$의 부호 결정 기준은?",
      options: [
        "타겟 단어로 가는 경로 상의 해당 노드에서 왼쪽 자식으로 이동하면 $+1$, 오른쪽 자식으로 이동하면 $-1$ 부호를 부여한다.",
        "무조건 $+$ 부호만 사용한다.",
        "단어의 길이에 따라 부호가 정해진다.",
        "랜덤하게 부호를 부여한다."
      ],
      answer: 0,
      explanation: "트리 분기점 노드마다 자식 노드 방향(예: 왼쪽/오른쪽)에 따라 부호를 상반되게 지정해 합이 1이 되는 확률을 형성합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-082",
      conceptId: "rnn-backprop-through-time-vanishing-proof",
      difficulty: "hard",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "RNN BPTT 연산에서 $\\frac{\\partial L_t}{\\partial h_k} = \\frac{\\partial L_t}{\\partial h_t} \\frac{\\partial h_t}{\\partial h_k}$ 계산 시, $\\frac{\\partial h_t}{\\partial h_k} = \\prod_{j=k+1}^t \\frac{\\partial h_j}{\\partial h_{j-1}}$ 수식 내의 연쇄 곱 항 수가 $(t-k)$ 개라는 점이 시사하는 바는?",
      options: [
        "시간 거리가 먼 과거 시점 $k$일수록 곱해지는 야코비 행렬의 개수 $(t-k)$가 지수적으로 늘어나 기울기 소실/폭발 위험이 극대화된다.",
        "과거 시점 $k$가 멀어질수록 기울기가 더 커진다.",
        "시간 거리와 기울기 전파는 아무 관계가 없다.",
        "기울기가 시점 $k$에서 항상 1로 유제된다."
      ],
      answer: 0,
      explanation: "타임스텝 간격 $(t-k)$가 커질수록 1 미만의 행렬들이 지수 횟수만큼 곱해져 까마득한 과거 $k$로는 기울기가 전파되지 못합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-083",
      conceptId: "transformer-feed-forward-dimension-expansion",
      difficulty: "hard",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머 FFN 서브레이어 $W_1 \\in \\mathbb{R}^{d_{model} \\times d_{ff}}$, $W_2 \\in \\mathbb{R}^{d_{ff} \\times d_{model}}$ 에서 차원을 $d_{model} \\rightarrow d_{ff} \\rightarrow d_{model}$ 로 넓혔다 줄이는 병목(Bottleneck) 확장 구조의 성질은?",
      options: [
        "고차원 $d_{ff}$ 공간으로 일시 확장하여 비선형 커패시티 표현력을 극대화한 후, 다시 $d_{model}$ 잔차 통로 규격에 맞춰 압축 반영한다.",
        "파라미터를 줄이기 위한 구조이다.",
        "Attention score의 확률을 구하기 위한 구조이다.",
        "위치 인코딩을 수행하는 구조이다."
      ],
      answer: 0,
      explanation: "차원을 일시적으로 4배 확장 공간($d_{ff}$)으로 넓혀 비선형 특징을 풍부히 표현한 후 다시 원래 잔차 연결 차원 $d_{model}$로 축소합니다[cite: 2]."
    },
    {
      id: "nlp-hard-mc-084",
      conceptId: "dpo-loss-gradient-property",
      difficulty: "hard",
      category: "선호 학습",
      questionType: "multiple-choice",
      prompt: "DPO 손실함수 기울기(Gradient)의 작동 특성에 관한 사실은?",
      options: [
        "모델의 현재 선호 답변 점수가 비선호 답변 점수보다 낮을수록 더 강한 기울기 업데이트 신호를 생성해 잘못된 예측을 크게 보정한다.",
        "선호 답변과 비선호 답변 구별이 잘 되어 있을 때 가장 큰 기울기를 낸다.",
        "기울기가 항상 고정된 스칼라 상수값이다.",
        "기울기 업데이트가 시그모이드에 의해 항상 0이 된다."
      ],
      answer: 0,
      explanation: "DPO 기울기는 현재 모델의 예측이 틀려 비선호 답변 점수가 더 높을 때 임계 가중치 $\\sigma(\\hat{r}_l - \\hat{r}_w)$ 가 커져 강력한 보정 기울기를 인가합니다[cite: 3]."
    },
    {
      id: "nlp-hard-mc-085",
      conceptId: "eval-contamination-leakage",
      difficulty: "hard",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "LLM의 평가 벤치마크 문제지 텍스트가 모델의 사전 학습(Pre-training) 데이터에 몰래 포함되어 유출됨으로써 벤치마크 점수가 거품으로 급증하는 현상은?",
      options: ["데이터 오염 / 유출 (Data Contamination / Leakage)", "Hallucination", "Exposure Bias", "Reward Hacking"],
      answer: 0,
      explanation: "Data Contamination은 평가용 데이터셋이 사전 학습에 오염/유출되어 실제 추론 능력이 아닌 암기로 시험을 잘 보게 되는 심각한 평가 왜곡 문제입니다[cite: 3]."
    },

    // ==========================================
    // 3. 서술형 (5문항)
    // ==========================================
    {
      id: "nlp-hard-es-001",
      conceptId: "word2vec-negative-sampling-math-principle",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "essay",
      prompt: "Word2Vec 학습 시 표준 Softmax 연산의 문제점을 연산 복잡도(O(V)) 관점에서 설명하고, Negative Sampling(SGNS)이 이를 이진 분류(Binary Classification) 문제로 전환하여 연산량을 줄이는 수학적 원리를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Softmax", "어휘 사전", "이진 분류", "Negative"],
      modelAnswer: "표준 Softmax는 분모에서 전체 어휘 사전 $V$에 대해 $\\sum_{w \\in V} \\exp(v'_w T v_{w_c})$ 연산을 수행하므로 사전 크기 $V$에 비례하는 $O(V)$의 막대한 계산량이 소요된다. Negative Sampling은 이를 사전 전체 대신 진짜 주변 단어(양성) 1개와 $k$개의 무작위 오답 단어(음성)만을 추출하여, 시그모이드 기반의 이진 분류 문제로 전환함으로써 연산량을 $O(k)$ 수준으로 획기적으로 축소시킨다[cite: 2].",
      rubricKeywords: ["Softmax", "전체 어휘", "이진 분류", "음성 샘플"],
      minLength: 20,
      explanation: "전체 어휘 사전 $V$ 분모 연산 오버헤드와 SGNS의 $k$개 음성 샘플 이진 이항 분류 전환 원리를 작성합니다[cite: 2].",
      hint: "소프트맥스 분모의 전체 단어 합 연산 부담과 k개 음성 단어 이진 시그모이드 변환을 서술하세요[cite: 2]."
    },
    {
      id: "nlp-hard-es-002",
      conceptId: "lstm-vanishing-gradient-mathematical-proof",
      difficulty: "hard",
      category: "LSTM",
      questionType: "essay",
      prompt: "기본 RNN에서 BPTT 오차 역전파 시 기울기 소실(Vanishing Gradient)이 일어나는 수학적 이유와, LSTM의 Cell state 통로 연산 구조가 왜 기울기 소실을 방지해주는지 야코비 편미분 관점에서 비교 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["연쇄 곱", "야코비", "Cell state", "Forget gate"],
      modelAnswer: "기본 RNN은 오차 역전파 시 가중치 행렬 $W_{hh}^T$와 $\\tanh'$ 미분값들이 시점 간격만큼 연쇄 곱(Chain Rule)되어 기울기가 지수적으로 0에 수렴한다. 반면 LSTM의 Cell state 연산 $C_t = f_t * C_{t-1} + i_t * \\tilde{C}_t$ 은 편미분 시 $\\frac{\\partial C_t}{\\partial C_{t-1}} = f_t + \\dots$ 가 되어, Forget gate $f_t \\approx 1$ 일 때 가중치 곱셈에 의한 감쇄 없이 오차 기울기가 먼 과거로 직접 전파된다[cite: 2].",
      rubricKeywords: ["연쇄 곱", "가중치 행렬", "Cell state", "Forget gate"],
      minLength: 20,
      explanation: "RNN의 행렬 연쇄 곱 감쇄 문제와 LSTM 세포 상태 덧셈 통로의 $f_t$ 유지를 비교 설명합니다[cite: 2].",
      hint: "가중치 행렬의 연속 곱셈 오버헤드와 세포 상태의 $f_t$ 직접 미분 통로를 언급하세요[cite: 2]."
    },
    {
      id: "nlp-hard-es-003",
      conceptId: "flash-attention-tiling-memory-io",
      difficulty: "hard",
      category: "Transformer 최적화",
      questionType: "essay",
      prompt: "표준 Self-Attention이 시퀀스 길이에 대해 $O(N^2)$ 메모리 공간 및 HBM IO 오버헤드를 갖는 원인을 설명하고, FlashAttention이 SRAM 타일링(Tiling)과 Online Softmax 기법으로 이를 해결하는 원리를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["HBM", "SRAM", "타일링", "Online Softmax"],
      modelAnswer: "표준 Self-Attention은 $N \\times N$ 크기의 Attention Score 행렬 전체를 GPU의 느린 HBM 메모리에 기록하고 읽어오므로 $O(N^2)$ IO 병목이 발생한다. FlashAttention은 Q, K, V 행렬을 빠른 SRAM 칩 메모리 블록 단위로 타일링(Tiling)하여 잘라 올린 뒤, 전체 행렬을 HBM에 쓰지 않고 Online Softmax 알고리즘으로 누적 계산하여 HBM 메모리 접근 오버헤드를 대폭 줄인다[cite: 2, 3].",
      rubricKeywords: ["HBM", "SRAM", "타일링", "Online Softmax"],
      minLength: 20,
      explanation: "HBM 메모리 읽기/쓰기 $O(N^2)$ 오버헤드와 FlashAttention의 SRAM 블록 타일링 연산 메커니즘을 기술합니다[cite: 2, 3].",
      hint: "GPU HBM 메모리 접근 병목과 SRAM 타일링 및 소프트맥스 동적 계산을 서술하세요[cite: 2, 3]."
    },
    {
      id: "nlp-hard-es-004",
      conceptId: "rlhf-vs-dpo-math-comparison",
      difficulty: "hard",
      category: "선호 학습",
      questionType: "essay",
      prompt: "RLHF(InstructGPT) 방식의 3단계 정렬 구조와 DPO(Direct Preference Optimization) 방식의 구조적 차이점을 보상 모델 및 강화학습 루프 유무 관점에서 비교하여 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["보상 모델", "PPO", "DPO", "확률 비"],
      modelAnswer: "RLHF는 SFT 모델 학습, 보상 모델(RM) 별도 학습, PPO 강화학습 알고리즘 적용의 복잡한 3단계를 거치며 보상 해킹 및 PPO 불안정성이 존재한다. 반면 DPO는 수학적 변환을 통해 보상함수를 레퍼런스 모델 대비 현재 언어 모델의 확률 비로 대체함으로써, 별도의 보상 모델과 PPO 루프 없이 선호 데이터셋만으로 언어 모델을 직접 최적화하여 안정을 도모한다[cite: 3].",
      rubricKeywords: ["보상 모델", "PPO", "확률 비", "직접 최적화"],
      minLength: 20,
      explanation: "RLHF의 RM+PPO 루프 복잡성과 DPO의 보상 모델 무필요 및 직접 확률비 손실 최적화 차이를 비교합니다[cite: 3].",
      hint: "보상 모델 생성 및 PPO 강화학습 존재 여부와 DPO의 직접 확률 최적화를 언급하세요[cite: 3]."
    },
    {
      id: "nlp-hard-es-005",
      conceptId: "cot-zero-shot-cot-tot-reasoning-evolution",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "essay",
      prompt: "Standard Prompting에서 Chain-of-Thought (CoT), Zero-shot CoT, 그리고 Tree of Thoughts (ToT)로 이어지는 프롬프팅 기법의 진화 과정을 추론 공간(Reasoning Space) 탐색 메커니즘 관점에서 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["단계별", "생각 연쇄", "트리", "백트래킹"],
      modelAnswer: "Standard Prompting은 질문에서 단답형 정답으로 바로 직행하는 단층 탐색이다. CoT는 예시를 통해 일직선 형태의 단계별 생각 연쇄 추론 경로를 생성하며, Zero-shot CoT는 \"Let's think step by step\" 문구로 예시 없이 일직선 추론을 유발한다. ToT는 생각을 트리 노드로 확장하여 백트래킹과 BFS/DFS 탐색 알고리즘을 결합함으로써 다지 추론 공간을 평가 및 가지치기하며 복잡한 문제를 해결한다[cite: 3].",
      rubricKeywords: ["단답형", "생각 연쇄", "트리", "백트래킹"],
      minLength: 20,
      explanation: "단순 직행 $\\rightarrow$ 일직선 추론 연쇄(CoT/Zero-shot CoT) $\\rightarrow$ 트리 공간 분기 및 백트래킹 탐색(ToT)의 발전 흐름을 논리적으로 서술합니다[cite: 3]."
    }
  ]
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
