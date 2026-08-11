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
    // 1. 워드 임베딩 (15문항)
    // ==========================================
    {
      id: "nlp-emb-mc-hard-001",
      conceptId: "skipgram-negative-sampling-loss",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec Skip-gram에 Negative Sampling(SGNS)을 적용했을 때, 중심 단어 $w_c$, 주변 단어 $w_o$, 그리고 $k$개의 음성 샘플 단어 $w_i$에 대한 최적화 목적(Loss) 수식 형태로 가장 올바른 것은?",
      options: [
        "$-\\log \\sigma(v'_{w_o}^T v_{w_c}) - \\sum_{i=1}^k \\log \\sigma(-v'_{w_i}^T v_{w_c})$",
        "$-\\sum_{i=1}^k \\log \\sigma(v'_{w_i}^T v_{w_c})$",
        "$\\log \\sigma(v'_{w_o}^T v_{w_c}) + \\sum_{i=1}^k \\log \\sigma(v'_{w_i}^T v_{w_c})$",
        "$-\\log \\left( \\frac{\\exp(v'_{w_o}^T v_{w_c})}{\\sum_j \\exp(v'_j^T v_{w_c})} \\right)$"
      ],
      answer: 0,
      explanation: "SGNS는 실제 주변 단어와의 내적 확률은 높이고($\log \sigma$), 무작위 음성 단어들과의 내적 확률은 낮추는($\log \sigma(-x)$) 이진 분류 손실을 최소화합니다[cite: 2].",
      hint: "참 주변 단어 확률을 올리고 오답 단어 확률을 떨어뜨리는 시그모이드 로그 합 조합입니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-hard-002",
      conceptId: "word2vec-subsampling-formula",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec에서 \"the\", \"a\" 같은 고빈도 단어의 과도한 학습을 억제하기 위한 서브샘플링(Subsampling) 확률 $P(w_i)$ 수식으로 옳은 것은?",
      options: [
        "$P(w_i) = 1 - \\sqrt{\\frac{t}{f(w_i)}}$",
        "$P(w_i) = \\frac{f(w_i)}{t}$",
        "$P(w_i) = \\sqrt{t \\cdot f(w_i)}$",
        "$P(w_i) = \\frac{1}{1 + \\exp(-f(w_i))}$"
      ],
      answer: 0,
      explanation: "단어 빈도 $f(w_i)$가 임계값 $t$보다 훨씬 크면 $P(w_i)$가 1에 가까워져 해당 단어가 버려질 확률이 높아집니다[cite: 2].",
      hint: "빈도 $f(w_i)$가 클수록 버려질 확률이 올라가는 역제곱근 수식입니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-hard-003",
      conceptId: "hierarchical-softmax-huffman",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Hierarchical Softmax에서 단어들을 허프만 트리(Huffman Tree) 구조로 배치하는 근본적 목적은?",
      options: [
        "빈도가 높은 단어일수록 트리의 루트 상단에 배치하여 평균 연산 경로 길이를 최소화하고 $O(\log V)$ 복잡도를 달성하기 위해",
        "모든 단어의 트리 깊이를 완벽하게 똑같이 일치시키기 위해",
        "단어 알파벳 순서대로 정렬하기 위해",
        "희귀 단어의 깊이를 가장 얕게 만들기 위해"
      ],
      answer: 0,
      explanation: "고빈도 단어를 상단에 배치해 경로 길이를 줄임으로써 전체 Softmax 연산량을 $O(V)$에서 $O(\log V)$로 단축합니다[cite: 2].",
      hint: "빈도 높은 단어를 상단에 두어 평균 탐색 길이를 줄입니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-hard-004",
      conceptId: "glove-objective-loss-function",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "GloVe 모델의 손실함수 $J = \\sum_{i,j=1}^V f(X_{ij}) (w_i^T \\tilde{w}_j + b_i + \\tilde{b}_j - \\log X_{ij})^2$ 에 대한 세부 해석 중 올바른 것은?",
      options: [
        "두 단어 임베딩의 내적과 편향의 합이 동시 등장 횟수의 로그값 $\\log X_{ij}$에 가깝도록 가중 회귀(Weighted Least Squares)를 수행한다.",
        "동시 등장 횟수 $X_{ij} = 0$인 단어 쌍에 무한대의 페널티를 부과한다.",
        "Softmax 확률의 크로스 엔트로피를 직접 최소화한다.",
        "원-핫 벡터의 직교성을 강제한다."
      ],
      answer: 0,
      explanation: "GloVe는 로그 동시 등장 빈도와 벡터 내적의 차이를 최소화하며, 가중치 함수 $f(X_{ij})$로 빈도가 지나치게 높은 단어의 과도한 편향을 제어합니다[cite: 2].",
      hint: "로그 동시 등장 빈도와 임베딩 내적 간의 가중 최소제곱 회귀를 수행합니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-hard-005",
      conceptId: "fasttext-subword-hash-trick",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "FastText가 무수히 많아질 수 있는 문자 n-gram들의 메모리 과부하를 제어하기 위해 사용하는 기법은?",
      options: ["해시 트릭 (Hashing Trick)", "원-핫 인코딩", "허프만 트리 분해", "B-Tree 인덱싱"],
      answer: 0,
      explanation: "FastText는 문자 n-gram들을 해시 함수를 통해 고정 크기 버킷 공간으로 맵핑하는 Hashing Trick을 사용합니다[cite: 2].",
      hint: "고정 크기 공간으로 매핑하는 해시(Hash) 관련 기법입니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-hard-006",
      conceptId: "word2vec-hierarchical-softmax-path-prob",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Hierarchical Softmax 트리 구조에서 루트부터 특정 단어 리프 노드까지의 경로상에서 최종 확률 $P(w|w_c)$가 산출되는 방식은?",
      options: [
        "루트에서 리프 단어까지 각 분기점 자식 노드로 진행할 때의 이진 시그모이드 확률들의 연쇄 곱",
        "경로 상에 있는 모든 노드 벡터들의 단순 합산",
        "루트 노드의 단일 Softmax 값",
        "경로 노드 개수 $L$로 나눈 평균값"
      ],
      answer: 0,
      explanation: "트리의 루트부터 리프 노드에 도달하기까지 거치는 분기점들의 이진 분류(시그모이드) 확률들을 모두 곱하여 산출합니다[cite: 2].",
      hint: "경로상 분기점들에서의 이진 선택 확률들을 모두 곱합니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-hard-007",
      conceptId: "word2vec-cbow-weight-matrices",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec 모형이 보유한 두 가중치 행렬 $W \in \mathbb{R}^{V \times N}$과 $W' \in \mathbb{R}^{N \times V}$에 대해, 학습 완료 후 단어 임베딩으로 가장 널리 채택되는 벡터는?",
      options: [
        "입력 가중치 행렬 $W$의 행 벡터들을 사용하거나, $W$와 $W'^T$의 평균 벡터를 사용한다.",
        "무조건 출력 행렬 $W'$만 사용하고 $W 조각$은 버린다.",
        "두 행렬의 역행렬 곱을 사용한다.",
        "가중치 행렬을 쓰지 않고 원-핫 벡터를 그대로 쓴다."
      ],
      answer: 0,
      explanation: "보통 입력 가중치 행렬 $W$의 각 행 벡터를 단어 임베딩으로 사용하며, 두 행렬의 합이나 평균을 쓰기도 합니다[cite: 2].",
      hint: "입력 가중치 $W$의 행 벡터들을 주로 단어 벡터로 활용합니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-hard-008",
      conceptId: "glove-weight-function-property",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "GloVe 손실함수에 포함된 가중치 함수 $f(X_{ij})$가 지녀야 할 핵심 설계 조건으로 옳은 것은?",
      options: [
        "동시 등장 빈도가 너무 큰 단어 쌍에 과도한 가중치가 부여되지 않도록 상한선(cap)을 두어 증가 속도를 둔화시킨다.",
        "동시 등장 빈도가 0인 쌍에 무한대의 가중치를 부여한다.",
        "빈도와 관계없이 항상 상수로 고정된다.",
        "빈도가 낮을수록 가중치를 0으로 만든다."
      ],
      answer: 0,
      explanation: "\"the\", \"is\" 같은 초고빈도 관사들은 중요도에 비해 카운트가 너무 커 모델을 지배하므로 $f(X)$로 상한선을 두어 밸런스를 잡습니다[cite: 2].",
      hint: "초고빈도 단어들이 학습을 왜곡하지 않도록 상한선을 둡니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-hard-009",
      conceptId: "fasttext-hash-collision",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "FastText가 해시 트릭(Hashing Trick)을 사용함에 따라 발생할 수 있는 구조적 부작용은?",
      options: [
        "서로 다른 문자 n-gram들이 동일한 해시 버킷 인덱스로 맵핑되는 해시 충돌(Collision)이 발생할 수 있다.",
        "단어 사전 크기가 무한대로 증가한다.",
        "학습 데이터가 손실되어 복구가 불가능해진다.",
        "GPU 메모리가 완전히 파괴된다."
      ],
      answer: 0,
      explanation: "고정된 버킷 크기로 해싱하므로 서로 다른 n-gram이 같은 공간을 공유하는 해시 충돌이 이론상 발생할 수 있습니다[cite: 2].",
      hint: "공간을 압축할 때 생기는 대표적 충돌 현상입니다[cite: 2]."
    },
    {
      id: "nlp-emb-sa-hard-010",
      conceptId: "hierarchical-softmax-sa",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "short-answer",
      prompt: "Word2Vec에서 Softmax의 $O(V)$ 연산을 이진 허프만 트리 기반 $O(\log V)$로 단축시키는 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Hierarchical Softmax", "hierarchical softmax", "계층적 소프트맥스"],
      explanation: "Hierarchical Softmax 최적화 기법입니다[cite: 2].",
      hint: "계층적(Hierarchical) Softmax입니다[cite: 2]."
    },
    {
      id: "nlp-emb-sa-hard-011",
      conceptId: "huffman-tree-sa",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "short-answer",
      prompt: "Hierarchical Softmax 구축 시 빈도가 높은 단어에 짧은 경로를 부여하기 위해 사용하는 이진 트리 알고리즘은?",
      options: [],
      answer: null,
      acceptedAnswers: ["허프만 트리", "Huffman Tree", "huffman tree", "허프만트리"],
      explanation: "Huffman Tree(허프만 트리) 구조입니다[cite: 2].",
      hint: "데이터 압축 및 최적 코딩에 쓰이는 트리 이름입니다[cite: 2]."
    },
    {
      id: "nlp-emb-sa-hard-012",
      conceptId: "sgns-sa",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "short-answer",
      prompt: "Skip-gram에 Negative Sampling을 결합하여 부르는 학습 방식의 영문 약자 표기를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["SGNS", "sgns"],
      explanation: "Skip-gram with Negative Sampling (SGNS) 입니다[cite: 2].",
      hint: "S_G_N_S 4글자 약자입니다[cite: 2]."
    },
    {
      id: "nlp-emb-sa-hard-013",
      conceptId: "hashing-trick-sa",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "short-answer",
      prompt: "FastText에서 수많은 문자 n-gram을 고정 크기 버킷 메모리로 맵핑하기 위해 사용하는 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["해시 트릭", "Hashing Trick", "hashing trick", "해시트릭"],
      explanation: "Hashing Trick(해시 트릭) 기법입니다[cite: 2].",
      hint: "해시(Hash) 기능을 활용한 트릭입니다[cite: 2]."
    },
    {
      id: "nlp-emb-es-hard-014",
      conceptId: "sgns-math-principle-essay",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "essay",
      prompt: "Word2Vec 학습 시 표준 Softmax 연산이 지닌 연산 복잡도 한계를 설명하고, Negative Sampling(SGNS)이 이를 어떻게 이진 분류 문제로 전환해 해결하는지 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Softmax", "V", "이진 분류", "음성 샘플"],
      modelAnswer: "표준 Softmax는 분모에서 전체 어휘 사전 $V$에 대한 지수합을 구하므로 $O(V)$ 복잡도를 갖는다. SGNS는 이를 전체 사전 대신 진짜 주변 단어 1개와 $k$개의 무작위 오답 단어만 추출해 시그모이드 이진 분류 문제로 근사함으로써 연산량을 $O(k)$ 수준으로 획기적으로 줄인다[cite: 2].",
      rubricKeywords: ["전체 어휘 사전 V 분모", "이진 분류 전환", "O(k) 복잡도"],
      minLength: 20,
      explanation: "전체 어휘 사전 $V$ 연산 부담과 SGNS의 $k$개 음성 샘플 이진 이항 분류 전환 원리를 작성합니다[cite: 2].",
      hint: "소프트맥스 분모의 전체 단어 합 연산 부담과 k개 음성 단어 이진 시그모이드 변환을 서술하세요[cite: 2]."
    },
    {
      id: "nlp-emb-es-hard-015",
      conceptId: "glove-vs-word2vec-essay",
      difficulty: "hard",
      category: "워드 임베딩",
      questionType: "essay",
      prompt: "Word2Vec과 GloVe의 임베딩 학습 방식의 차이점을 '국소적 예측'과 '전역적 동시 등장 통계' 관점에서 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["동시 등장", "통계", "예측", "행렬"],
      modelAnswer: "Word2Vec은 윈도우 기반 국소적(Local) 문맥 창에서 단어 쌍을 예측하는 방식으로 학습한다. 반면 GloVe는 전체 코퍼스의 전역적(Global) 단어 동시 등장 행렬(Co-occurrence Matrix) 통계 정보를 활용하여 가중 회귀 방식으로 임베딩을 학습한다[cite: 2].",
      rubricKeywords: ["국소적 예측", "전역적 동시 등장 통계 행렬"],
      minLength: 20,
      explanation: "Word2Vec의 국소적 윈도우 예측과 GloVe의 전역적 동시 등장 행렬 통계 활용 차이를 서술합니다[cite: 2]."
    },

    // ==========================================
    // 2. 순차 데이터 & RNN (15문항)
    // ==========================================
    {
      id: "nlp-rnn-mc-hard-001",
      conceptId: "rnn-hidden-state-jacobian-matrix-vanishing",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "RNN의 야코비 행렬(Jacobian) 편미분 수식 $\frac{\partial h_t}{\partial h_k} = \prod_{j=k+1}^t \frac{\partial h_j}{\\partial h_{j-1}}$ 에서 기울기 소실이 일어나는 수학적 조건은?",
      options: [
        "활성화 함수 $\tanh$의 미분 최댓값이 1이고, 가중치 행렬 $W_{hh}$의 고유값들이 1보다 작을 때 연쇄 곱에 의해 0으로 지수적 수렴하기 때문",
        "가중치 행렬 $W_{hh}$의 값이 무한대로 발산할 때",
        "타임스텝 간격 $(t-k)$가 1일 때",
        "입력 벡터 $x_t$의 차원이 0일 때"
      ],
      answer: 0,
      explanation: "1 이하의 $\tanh$ 미분값과 고유값이 1 미만인 $W_{hh}$ 행렬이 지수 횟수만큼 연쇄 곱해지면서 오차가 사라집니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-hard-002",
      conceptId: "rnn-bptt-exploding-clipping-math",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "RNN 기울기 폭발(Gradient Explosion) 방지를 위한 Gradient Clipping 수식 $g \leftarrow \frac{\text{threshold}}{\|g\|} g \quad (\text{if } \|g\| > \text{threshold})$ 에 대한 수학적 해석은?",
      options: [
        "기울기 벡터 $g$의 방향(Direction)은 그대로 보존하고 노름(Norm) 크기만 threshold 수준으로 스케일링한다.",
        "기울기 벡터의 부호를 반대로 반전시킨다.",
        "기울기의 모든 원소를 무조건 0으로 초기화한다.",
        "기울기의 차원을 1차원으로 축소한다."
      ],
      answer: 0,
      explanation: "기울기의 방향은 훼손하지 않고 크기(L2 Norm)만 임계값으로 나누어 스케일링하므로 폭발을 안전하게 통제합니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-hard-003",
      conceptId: "bptt-truncated-concept",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "긴 시퀀스 학습 시 BPTT의 연산량 과다를 막기 위해 역전파 계산을 고정 시점까지만 끊어서 수행하는 Truncated BPTT의 핵심 특징은?",
      options: [
        "순방향 전개는 끊김 없이 이어가되, 역전파 경사 계산만 일정 타임스텝 깊이에서 잘라(Truncate) 수행한다.",
        "순방향 전개도 완전히 끊어 문장을 단어 단위로 조각낸다.",
        "역전파를 아예 수행하지 않고 가중치를 랜덤하게 고정한다.",
        "모델의 모든 은닉층을 삭제한다."
      ],
      answer: 0,
      explanation: "Truncated BPTT는 순방향 상태는 이어가되 역전파 미분 전파 깊이를 제한하여 메모리와 연산을 절약합니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-hard-004",
      conceptId: "rnn-hidden-matrix-dimensions",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "입력 벡터 차원이 $d_x$, 은닉 상태 차원이 $d_h$일 때, RNN의 가중치 행렬 $W_{xh}$와 $W_{hh}$의 차원 크기는 각각 어떻게 되는가?",
      options: [
        "$W_{xh} \in \mathbb{R}^{d_h \times d_x}$, $\quad W_{hh} \in \mathbb{R}^{d_h \times d_h}$",
        "$W_{xh} \in \mathbb{R}^{d_x \times d_x}$, $\quad W_{hh} \in \mathbb{R}^{d_h \times d_x}$",
        "$W_{xh} \in \mathbb{R}^{d_h \times d_h}$, $\quad W_{hh} \in \mathbb{R}^{d_x \times d_x}$",
        "$W_{xh} \in \mathbb{R}^{1 \times d_x}$, $\quad W_{hh} \in \mathbb{R}^{1 \times d_h}$"
      ],
      answer: 0,
      explanation: "은닉 벡터 $h_t \in \mathbb{R}^{d_h}$를 만들기 위해 $W_{xh}$는 $(d_h \times d_x)$, $W_{hh}$는 $(d_h \times d_h)$ 차원을 가집니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-hard-005",
      conceptId: "bilstm-bidirectional-context-advantage",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "Bi-directional RNN/LSTM이 단방향 RNN 대비 지닌 아키텍처적 장점은 무엇인가?",
      options: [
        "특정 시점 $t$를 기준으로 과거(왼쪽)와 미래(오른쪽)의 문맥 정보를 동시에 은닉 상태에 결합하여 표현력을 높인다.",
        "파라미터 개수가 단방향의 절반으로 감소한다.",
        "미래의 단어를 미리 알 필요가 없어 실시간 음성 생성에 즉시 쓰인다.",
        "역전파 과정이 필요 없어 학습이 10배 빨라진다."
      ],
      answer: 0,
      explanation: "양방향 RNN은 정방향과 역방향의 히든 스테이트를 모두 합치므로 시점 $t$에서 앞뒤 문맥을 완벽히 포착합니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-hard-006",
      conceptId: "rnn-parameter-sharing-over-time",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "RNN이 서로 다른 길이를 가진 다양한 시퀀스 데이터를 유연하게 처리할 수 있는 결정적 구조적 요인은?",
      options: [
        "모든 타임스텝에 걸쳐 동일한 가중치 행렬($W_{xh}, W_{hh}$)을 공유(Parameter Sharing)하기 때문에",
        "시점마다 가중치 행렬이 완전히 새로 생성되기 때문에",
        "가중치를 전혀 사용하지 않고 규칙만 쓰기 때문에",
        "입력 텐서를 항상 일정한 크기로 패딩하기만 하면 되기 때문에"
      ],
      answer: 0,
      explanation: "타임스텝마다 동일한 가중치를 공유하므로 몇 단계의 시퀀스든 동일한 함수 규칙으로 전개할 수 있습니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-hard-007",
      conceptId: "rnn-many-to-many-unsynced-vs-synced",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "Seq2Seq 같은 비동기(Unsynced) Many-to-Many 구조와 POS 태깅 같은 동기(Synced) Many-to-Many 구조의 차이점은?",
      options: [
        "비동기 구조는 입력 완료 후 인코딩 거쳐 출력을 따로 시작하고, 동기 구조는 매 스텝마다 1:1로 출력이 즉시 매핑된다.",
        "비동기 구조는 인코더가 없고, 동기 구조는 디코더가 없다.",
        "동기 구조는 텍스트 처리를 아예 못한다.",
        "두 구조는 수학적으로 완벽히 동일하다."
      ],
      answer: 0,
      explanation: "동기식은 스텝마다 1:1 대응되고, 비동기식(Seq2Seq)은 입력 전체를 읽고 나서 별도 디코더 스텝으로 출력합니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-hard-008",
      conceptId: "rnn-hidden-state-initialization",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "RNN의 첫 타임스텝 $t=1$ 연산을 시작할 때 사용되는 초기 은닉 상태 $h_0$의 일반적인 설정 방식은?",
      options: [
        "모든 원소가 0인 영벡터(Zero Vector)로 초기화하거나 학습 가능한 파라미터로 설정한다.",
        "모든 원소를 1로 고정한다.",
        "첫 번째 입력 $x_1$과 똑같은 값으로 복사한다.",
        "초기화할 수 없으며 에러를 발생시킨다."
      ],
      answer: 0,
      explanation: "보통 $h_0$는 0으로 채워진 영벡터로 초기화하며, 인코더-디코더 연결 시에는 인코더 마지막 상태를 전달받습니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-hard-009",
      conceptId: "rnn-backprop-chain-rule-distance",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "RNN BPTT에서 $\frac{\partial L_t}{\partial h_k}$ 계산 시 시간 거리 $(t-k)$가 멀어질수록 야코비 행렬의 곱셈 횟수가 증가하는 현상이 시사하는 바는?",
      options: [
        "시간 거리가 먼 과거 시점 $k$일수록 오차 경사도가 지수적으로 감쇄하거나 폭발하여 장기 기억 학습에 구조적 취약성을 갖는다.",
        "과거 시점일수록 기울기가 더 정확하게 보존된다.",
        "시간 거리와 기울기 전파는 아무런 관련이 없다.",
        "학습 속도가 항상 일정하게 유지된다."
      ],
      answer: 0,
      explanation: "간격 $(t-k)$가 길어질수록 1 미만 행렬들의 연쇄 곱 횟수가 늘어나 과거로 기울기가 전달되지 못합니다[cite: 2]."
    },
    {
      id: "nlp-rnn-sa-hard-010",
      conceptId: "truncated-bptt-sa",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "short-answer",
      prompt: "긴 시퀀스 학습 시 오버헤드를 막기 위해 역전파 전개 깊이를 고정 시점까지만 끊어서 수행하는 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Truncated BPTT", "truncated bptt", "절단된 BPTT"],
      explanation: "Truncated BPTT 기법입니다[cite: 2]."
    },
    {
      id: "nlp-rnn-sa-hard-011",
      conceptId: "jacobian-matrix-rnn-sa",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "short-answer",
      prompt: "RNN 타임스텝 간 미분 관계를 분석할 때 활용되는, 다변수 함수 편미분 행렬들을 나타내는 수학적 행렬 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["야코비 행렬", "Jacobian Matrix", "jacobian matrix", "야코비행렬"],
      explanation: "Jacobian Matrix (야코비 행렬) 입니다[cite: 2]."
    },
    {
      id: "nlp-rnn-sa-hard-012",
      conceptId: "parameter-sharing-rnn-sa",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "short-answer",
      prompt: "RNN이 가변 길이 시퀀스를 동일한 가중치 행렬로 처리할 수 있게 해주는 구조적 특징 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["가중치 공유", "Parameter Sharing", "parameter sharing", "가중치공유"],
      explanation: "Parameter Sharing (가중치 공유) 특징입니다[cite: 2]."
    },
    {
      id: "nlp-rnn-sa-hard-013",
      conceptId: "synced-many-to-many-sa",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "short-answer",
      prompt: "입력 스텝마다 즉시 1:1로 출력이 매핑되는 Many-to-Many 구조의 성격을 가리키는 표현은?",
      options: [],
      answer: null,
      acceptedAnswers: ["동기화", "Synced", "synced", "동기식"],
      explanation: "Synced (동기화) Many-to-Many 구조입니다[cite: 2]."
    },
    {
      id: "nlp-rnn-es-hard-014",
      conceptId: "rnn-vanishing-jacobian-essay",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "essay",
      prompt: "RNN 학습 시 BPTT 연산에서 $\frac{\partial h_t}{\partial h_k} = \prod_{j=k+1}^t \frac{\partial h_j}{\partial h_{j-1}}$ 수식과 야코비 행렬 관점에서 기울기 소실이 발생하는 수학적 이유를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["야코비", "연쇄 곱", "1 이하", "지수적"],
      modelAnswer: "시간 간격이 멀어질수록 야코비 행렬 $\frac{\partial h_j}{\partial h_{j-1}} = \text{diag}(1 - \tanh^2(\cdot)) W_{hh}^T$ 가 연속적으로 곱해진다. $\tanh$ 미분 최댓값이 1이고 $W_{hh}$ 고유값이 1 미만일 때, 이 행렬들이 시점 수만큼 연쇄 곱해지며 오차 경사가 지수적으로 0에 수렴한다[cite: 2].",
      rubricKeywords: ["야코비 행렬 연속 곱", "$\tanh$ 미분 및 $W_{hh}$", "지수적 소실"],
      minLength: 20,
      explanation: "야코비 행렬의 연속 곱셈과 고유값/미분값 특성에 따른 기울기 소실 메커니즘을 서술합니다[cite: 2]."
    },
    {
      id: "nlp-rnn-es-hard-015",
      conceptId: "bilstm-bidirectional-mechanism-essay",
      difficulty: "hard",
      category: "순차 데이터 & RNN",
      questionType: "essay",
      prompt: "양방향 LSTM(Bi-LSTM)이 단방향 LSTM에 비해 텍스트 문맥을 이해하는 데 유리한 아키텍처적 이유를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["순방향", "역방향", "양방향", "앞뒤 문맥"],
      modelAnswer: "단방향 RNN은 과거 정보(왼쪽)만 참조하지만, Bi-LSTM은 순방향 LSTM과 역방향 LSTM을 동시에 구동하여 시점 $t$를 중심으로 과거와 미래의 앞뒤 문맥을 모두 은닉 상태에 결합하므로 단어의 중의적 의미나 전체 문맥을 훨씬 정밀하게 파악할 수 있다[cite: 2].",
      rubricKeywords: ["순방향 및 역방향 동시 구동", "과거와 미래 앞뒤 문맥 결합"],
      minLength: 20,
      explanation: "순방향과 역방향의 동시 구동을 통한 앞뒤 문맥 결합 이점을 서술합니다[cite: 2]."
    },

    // ==========================================
    // 3. LSTM & 순환 모델 (15문항)
    // ==========================================
    {
      id: "nlp-lstm-mc-hard-001",
      conceptId: "lstm-cell-state-jacobian-matrix-proof",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "LSTM이 RNN의 기울기 소실을 극복하는 이유를 야코비 행렬 $\frac{\partial C_t}{\partial C_{t-1}}$ 관점에서 분석한 올바른 설명은?",
      options: [
        "$\frac{\partial C_t}{\partial C_{t-1}} = f_t + \dots$ 형태가 되어, Forget gate $f_t \approx 1$일 때 가중치 연속 곱에 의한 감쇄 없이 오차가 멀리 전파된다.",
        "기울기가 지속적으로 제곱되어 무한정 발산하기 때문이다.",
        "미분 연산이 덧셈이 아닌 나눗셈으로 변환되기 때문이다.",
        "야코비 행렬 값이 항상 0으로 고정되기 때문이다."
      ],
      answer: 0,
      explanation: "Cell state 오차 편미분 시 Forget gate $f_t$ 항이 남으므로 $f_t \approx 1$일 때 기울기가 소실 없이 직통 전파됩니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-hard-002",
      conceptId: "lstm-cell-state-linear-property",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "LSTM의 세포 상태 업데이트 수식 $C_t = f_t * C_{t-1} + i_t * \tilde{C}_t$ 이 지닌 덧셈 기반 선형(Linear) 통로의 핵심 장점은?",
      options: [
        "역전파 과정에서 비선형 활성화 함수의 연속 미분 곱으로 인한 기울기 감쇄 오버헤드를 덧셈 연산으로 우회한다.",
        "모든 가중치를 0으로 초기화할 수 있게 만든다.",
        "Sigmoid 계산을 아예 없애준다.",
        "훈련 데이터가 아예 필요 없게 만든다."
      ],
      answer: 0,
      explanation: "Cell state의 덧셈 선형 통로는 비선형 미분값의 연속 곱 연산을 우회시켜 장기 기울기 소실을 막아줍니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-hard-003",
      conceptId: "lstm-peephole-connection",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "Peephole Connection(피프홀 연결)이 적용된 LSTM의 구조적 특징은?",
      options: [
        "각 게이트($f_t, i_t, o_t$)들이 이전 hidden state뿐만 아니라 이전 세포 상태 $C_{t-1}$의 값도 직접 입력으로 참조한다.",
        "게이트를 모두 제거하고 오직 Cell state만 쓴다.",
        "입력 $x_t$를 수식에서 완전히 삭제한다.",
        "활성화 함수로 Softmax만 사용한다."
      ],
      answer: 0,
      explanation: "Peephole 구조는 게이트 계산 시 이전 세포 상태 $C_{t-1}$을 직접 들여다보도록(Peephole) 연결을 추가합니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-hard-004",
      conceptId: "lstm-forget-bias-initialization-math",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "LSTM 초기 학습 시 $b_f$ (Forget gate bias)를 1.0이나 2.0 같은 양수로 크게 설정하는 수학적/실무적 이유는?",
      options: [
        "초기에 $\sigma(b_f) \approx 1$ 이 되도록 만들어, 모델이 과거 세포 상태 기억을 쉽게 잊지 않고 보존하게 유도하기 위해",
        "초기 기울기를 무한대로 증폭하기 위해",
        "Loss 값을 강제로 0으로 만들기 위해",
        "입력 데이터를 묵살하기 위해"
      ],
      answer: 0,
      explanation: "$b_f$를 양수로 초기화하면 $\sigma$ 출력이 1에 가까워져 초기에 과거 기억을 망각하지 않고 안정적으로 유지합니다동작합니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-hard-005",
      conceptId: "gru-vs-lstm-gate-count",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "LSTM과 비교했을 때 GRU가 가진 게이트 개수와 구성의 차이는?",
      options: [
        "LSTM은 3개 게이트(Forget, Input, Output)와 2개 상태를 가지지만, GRU는 2개 게이트(Reset, Update)만 가지고 상태는 1개로 통합된다.",
        "GRU는 게이트가 5개이다.",
        "GRU는 게이트가 없고 단순 선형 결합만 쓴다.",
        "LSTM과 GRU는 게이트 개수가 완전히 동일하다."
      ],
      answer: 0,
      explanation: "GRU는 Reset, Update 2개 게이트만 쓰고 셀/히든 상태를 통합해 LSTM보다 경량화되었습니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-hard-006",
      conceptId: "lstm-hidden-state-tanh-clamping",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "LSTM 수식 $h_t = o_t * \tanh(C_t)$ 에서 세포 상태 $C_t$에 $\tanh$를 취해주는 수학적 이유는?",
      options: [
        "무한히 누적될 수 있는 세포 상태 값의 범위를 -1과 1 사이로 압축(Clamping)하여 출력 안정성을 확보하기 위해",
        "세포 상태를 무조건 양수로 고정하기 위해",
        "출력값 크기를 100배 키우기 위해",
        "미분 불가능한 구간을 만들기 위해"
      ],
      answer: 0,
      explanation: "세포 상태 $C_t$는 덧셈 누적으로 값이 커질 수 있으므로 $\tanh$를 통해 -1과 1 사이로 압축해 줍니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-hard-007",
      conceptId: "lstm-candidate-cell-role",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "LSTM의 후보 세포 상태 $\tilde{C}_t = \tanh(W_C \cdot [h_{t-1}, x_t] + b_C)$ 가 생성하는 정보의 실질적 성격은?",
      options: [
        "현재 입력과 이전 단기 기억을 바탕으로 이번 시점에 새로 반영될 수 있는 새로운 정보 후보군",
        "과거의 모든 기억을 강제로 초기화하는 리셋 신호",
        "최종 출력 레이어의 Softmax 확률값",
        "손실 함수 값"
      ],
      answer: 0,
      explanation: "$\tilde{C}_t$는 이번 스텝에 새로 더해질 수 있는 신규 정보 내용 후보이며, Input gate에 의해 일부만 선별 기록됩니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-hard-008",
      conceptId: "gru-update-gate-interpolation",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "GRU의 은닉 상태 업데이트 수식 $h_t = (1 - z_t) * h_{t-1} + z_t * \tilde{h}_t$ 의 수학적 선형 보간(Interpolation) 의미는?",
      options: [
        "업데이트 게이트 $z_t$를 가중치로 하여 이전 은닉 상태 $h_{t-1}$과 새 후보 $\tilde{h}_t$ 사이의 반영 비율을 0~1 사이로 부드럽게 결합한다.",
        "두 벡터를 단순히 곱해서 차원을 제곱한다.",
        "과거 기억을 100% 버리고 새 후보만 취한다.",
        "두 벡터의 차이 절댓값을 구한다."
      ],
      answer: 0,
      explanation: "$z_t$를 이용해 과거 기억($1-z_t$)과 새 후보($z_t$)를 선형 보간하여 은닉 상태를 갱신합니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-hard-009",
      conceptId: "bilstm-concatenation-feature",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "Bi-LSTM이 시점 $t$에서 순방향 은닉 상태 $\vec{h}_t$와 역방향 은닉 상태 $\overleftarrow{h}_t$를 결합하는 표준 방식은?",
      options: [
        "두 은닉 상태 벡터를 이어붙이기(Concatenation)하여 $[ \vec{h}_t ; \overleftarrow{h}_t ]$ 형태로 만든다.",
        "두 벡터를 엘리먼트 단위로 곱한다.",
        "두 벡터를 평균 내어 하나로 압축한다.",
        "둘 중 값이 큰 벡터 하나만 고르고 나머지는 버린다."
      ],
      answer: 0,
      explanation: "양방향 LSTM은 보통 순방향과 역방향의 히든 벡터들을 Concat하여 최종 은닉 표현으로 활용합니다[cite: 2]."
    },
    {
      id: "nlp-lstm-sa-hard-010",
      conceptId: "peephole-connection-sa",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "short-answer",
      prompt: "LSTM의 각 게이트가 이전 은닉 상태뿐만 아니라 이전 세포 상태 값도 직접 참조하도록 추가된 연결 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Peephole Connection", "peephole connection", "피프홀 연결"],
      explanation: "Peephole Connection 구조입니다[cite: 2]."
    },
    {
      id: "nlp-lstm-sa-hard-011",
      conceptId: "gru-reset-gate-sa",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "short-answer",
      prompt: "GRU에서 새로운 은닉 상태 후보 계산 시 이전 상태 정보를 얼마나 무시할지 제어하는 게이트는?",
      options: [],
      answer: null,
      acceptedAnswers: ["Reset gate", "reset gate", "리셋 게이트", "Reset Gate"],
      explanation: "GRU의 Reset gate 입니다[cite: 2]."
    },
    {
      id: "nlp-lstm-sa-hard-012",
      conceptId: "gru-update-gate-sa",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "short-answer",
      prompt: "GRU에서 이전 기억 유지와 새 후보 반영 비율을 동시에 보간 제어하는 게이트는?",
      options: [],
      answer: null,
      acceptedAnswers: ["Update gate", "update gate", "업데이트 게이트", "Update Gate"],
      explanation: "GRU의 Update gate 입니다[cite: 2]."
    },
    {
      id: "nlp-lstm-sa-hard-013",
      conceptId: "lstm-linear-path-sa",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "short-answer",
      prompt: "LSTM 세포 상태 업데이트 수식에서 기울기 소실을 막아주는 핵심 통로인 덧셈 연산 기반의 성질은?",
      options: [],
      answer: null,
      acceptedAnswers: ["선형 통로", "선형성", "Linear path", "linear"],
      explanation: "Cell state의 덧셈 기반 선형(Linear) 통로 성질입니다[cite: 2]."
    },
    {
      id: "nlp-lstm-es-hard-014",
      conceptId: "lstm-jacobian-proof-essay",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "essay",
      prompt: "기본 RNN과 비교하여 LSTM의 세포 상태 업데이트 수식 $C_t = f_t * C_{t-1} + i_t * \tilde{C}_t$ 이 야코비 편미분 $\frac{\partial C_t}{\partial C_{t-1}}$ 관점에서 왜 기울기 소실을 방지하는지 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["야코비", "Forget gate", "직통", "덧셈"],
      modelAnswer: "기본 RNN은 가중치 행렬과 비선형 미분값이 곱해져 연속 곱셈으로 기울기가 소실된다. 반면 LSTM은 세포 상태 편미분 시 $\frac{\partial C_t}{\partial C_{t-1}} = f_t + \dots$ 형태가 되어, Forget gate $f_t \approx 1$일 때 오차 기울기가 감쇄 없이 덧셈 통로를 통해 먼 과거로 직통 전파된다[cite: 2].",
      rubricKeywords: ["세포 상태 편미분", "Forget gate $f_t$", "기울기 소실 방지 직통 전파"],
      minLength: 20,
      explanation: "RNN의 연속 곱셈 감쇄와 LSTM 세포 상태의 편미분 $f_t$ 직통 전파를 비교 서술합니다[cite: 2].",
      hint: "야코비 편미분 시 남는 Forget gate 항과 덧셈 통로의 이점을 기술하세요[cite: 2]."
    },
    {
      id: "nlp-lstm-es-hard-015",
      conceptId: "lstm-vs-gru-structural-essay",
      difficulty: "hard",
      category: "LSTM & 순환 모델",
      questionType: "essay",
      prompt: "LSTM과 GRU의 구조적 차이점(상태 개수 및 게이트 구성)을 비교하고 각각의 트레이드오프를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Cell state", "Hidden state", "통합", "게이트 2개", "경량화"],
      modelAnswer: "LSTM은 Hidden state와 Cell state 2개 상태를 가지며 3개의 게이트로 정밀하게 제어해 표현력이 좋지만 연산이 무겁다. 반면 GRU는 두 상태를 하나로 통합하고 Reset/Update 2개 게이트만 사용하여 파라미터를 줄이고 학습을 경량화했으나 제어 정밀도가 다소 단순해질 수 있다[cite: 2].",
      rubricKeywords: ["LSTM 2개 상태 3개 게이트", "GRU 상태 통합 2개 게이트 경량화"],
      minLength: 20,
      explanation: "상태 개수 및 게이트 구성 차이에 따른 표현력과 연산 경량화 트레이드오프를 서술합니다동작합니다[cite: 2]."
    },

    // ==========================================
    // 4. Seq2Seq & Attention (15문항)
    // ==========================================
    {
      id: "nlp-s2s-mc-hard-001",
      conceptId: "seq2seq-beam-search-length-penalty",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Beam Search 디코딩 시 단순 로그 확률 합 $\sum \log P(y_t)$ 만 사용하면 발생하는 편향과 이를 보정하는 길이 페널티(Length Penalty) 수식 방식은?",
      options: [
        "길이가 짧은 문장이 누적 로그 확률 합이 높아 무조건 유리해지므로, 문장 길이 $|Y|^\alpha$로 나누어 정규화한다.",
        "길이가 긴 문장에 무조건 100점의 가산점을 부여한다.",
        "단어 개수가 10개 이상이면 무조건 탈락시킨다.",
        "로그 확률 값을 제곱하여 확대한다."
      ],
      answer: 0,
      explanation: "로그 확률($\le 0$)은 음수이므로 더할수록 짧은 문장 스코어가 커집니다. 이를 보정하고자 길이 $|Y|^\alpha$로 나눕니다[cite: 2, 3].",
      hint: "짧은 문장 선호 편향을 막고자 길이 $|Y|^\alpha$로 나누어 정규화합니다[cite: 2, 3]."
    },
    {
      id: "nlp-s2s-mc-hard-002",
      conceptId: "attention-matrix-multiplication-complexity",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Seq2Seq 표준 Attention에서 디코더 상태 $s_t$와 인코더 모든 상태 $h_i$ 간의 점수를 매번 계산할 때 소요되는 시간 및 공간 복잡도는?",
      options: [
        "$O(T_x \cdot T_y)$ (입력 길이 $T_x$와 출력 길이 $T_y$의 곱에 비례)",
        "$O(1)$",
        "$O(\log T_x)$",
        "$O(T_x^3)$"
      ],
      answer: 0,
      explanation: "매 출력 스텝마다 모든 인코더 스텝을 조회하므로 출력 길이 $T_y$와 입력 길이 $T_x$의 곱에 비례하는 복잡도를 가집니다[cite: 2].",
      hint: "출력 스텝과 입력 스텝의 곱($T_x \cdot T_y$)에 비례합니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-hard-003",
      conceptId: "attention-score-alignment-matrix",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Attention 가중치 행렬 $\alpha_{t,i}$가 기계번역에서 전통적인 '단어 정렬(Word Alignment) 모델'을 대체할 수 있는 근본적 이유는?",
      options: [
        "디코더가 출력 단어를 생성할 때 필요한 입력 소스 단어에 자동으로 높은 가중치(확률)를 할당하도록 End-to-End로 학습되기 때문에",
        "단어 정렬 표를 사람이 직접 수작업으로 입력해주기 때문에",
        "번역 모델에서 정렬 과정 자체가 법적으로 금지되어 있어서",
        "인코더 연산을 완전히 생략하기 때문에"
      ],
      answer: 0,
      explanation: "Attention은 별도의 정렬 사전 없이 신경망 역전파를 통해 소스와 타겟 간의 매핑 관계를 스스로 학습합니다[cite: 2].",
      hint: "별도 정렬 모델 없이 End-to-End 학습을 통해 자동으로 정렬 관계를 학습합니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-hard-004",
      conceptId: "seq2seq-scheduled-sampling",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Teacher Forcing의 노출 편향(Exposure Bias)을 해결하기 위해 학습 진행에 따라 정답 제공 확률을 점진적으로 낮추고 모델 자신의 예측값을 섞어 넣는 기법은?",
      options: ["Scheduled Sampling", "Greedy Search", "Label Smoothing", "Dropout"],
      answer: 0,
      explanation: "Scheduled Sampling은 에포크가 지남에 따라 Teacher Forcing 비율을 감쇠시켜 추론 환경에 적응시킵니다[cite: 2].",
      hint: "스케줄에 따라 샘플링 방식을 변경하는 스케줄드 샘플링입니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-hard-005",
      conceptId: "attention-concat-decoder-input",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Attention이 적용된 Seq2Seq에서 컨텍스트 벡터 $a_t$와 디코더 은닉 상태 $s_t$가 결합된 후 다음 스텝 디코더 입력이나 출력층으로 전달되는 표준 결합 방식은?",
      options: [
        "두 벡터를 이어붙이기(Concatenation)하여 $[s_t; a_t]$ 형태로 만든 후 선형 변환 및 활성화 함수 통과",
        "두 벡터를 단순 곱셈(Multiplication)함",
        "두 벡터를 빼기 연산함",
        "컨텍스트 벡터만 쓰고 $s_t$는 버림"
      ],
      answer: 0,
      explanation: "디코더 상태 $s_t$와 컨텍스트 벡터 $a_t$를 Concat하여 비선형 레이어를 거친 후 최종 출력을 예측합니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-hard-006",
      conceptId: "bahdanau-additive-attention-components",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Bahdanau Additive Attention의 점수 계산 수식 $score(s_{t-1}, h_i) = v_a^T \tanh(W_a s_{t-1} + U_a h_i)$ 에 포함된 가중치 행렬 $W_a, U_a$와 벡터 $v_a$의 역할은?",
      options: [
        "디코더 상태와 인코더 상태를 각각 비선형 공간으로 선형 투영한 뒤 스칼라 점수로 합산하기 위한 학습 가능한 파라미터들이다.",
        "고정된 하이퍼파라미터 상수로 절대 변하지 않는다.",
        "입력 텍스트를 토큰화하는 함수이다.",
        "손실 함수를 계산하는 공식이다."
      ],
      answer: 0,
      explanation: "$W_a, U_a, v_a$는 신경망 역전파를 통해 최적화되는 Additive 어텐션 전용 가중치 파라미터들입니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-hard-007",
      conceptId: "seq2seq-encoder-hidden-state-passing",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Seq2Seq에서 인코더의 마지막 타임스텝 은닉 상태 $h_T$가 디코더로 전달되는 대표적인 용도는?",
      options: [
        "디코더의 최초 초기 은닉 상태($s_0$)로 세팅되어 인코딩된 문맥 정보를 디코딩 시작점에 전달한다.",
        "손실 함수 값으로 바로 사용된다.",
        "디코더의 가중치 행렬을 전부 리셋한다.",
        "입력 문장의 총 단어 개수를 카운트한다."
      ],
      answer: 0,
      explanation: "인코더의 마지막 은닉 상태는 디코더의 최초 히든 스테이트($s_0$ 또는 $h_0$)의 초기값으로 대입되어 번역을 개시합니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-hard-008",
      conceptId: "attention-softmax-temperature-scaling",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Attention 스코어에 Softmax 적용 전 스케일링 온도 $T$를 도입했을 때($\alpha_i = \text{softmax}(e_i / T)$), $T$가 매우 커지면(무한대) 어텐션 가중치 분포는 어떻게 변하는가?",
      options: [
        "모든 인코더 토큰에 대해 가중치가 균등하게 분산되는 균등 분포(Uniform Distribution)가 된다.",
        "단 하나의 토큰에만 가중치 1.0이 쏠린다.",
        "모든 어텐션 가중치가 음수로 바뀐다.",
        "인코더의 첫 단어에만 100% 집중된다."
      ],
      answer: 0,
      explanation: "온도 $T$가 커지면 점수 차이가 무력화되어 모든 위치의 가중치가 평평하게 균등 분산됩니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-hard-009",
      conceptId: "bleu-score-unknown-penalty",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "기계 번역 평가 지표인 BLEU 스코어 산출 시 미학습 단어([UNK] 토큰)가 포함될 경우 번역 점수에 미치는 영향은?",
      options: [
        "[UNK] 토큰은 정답 참조문과 매칭되지 못하므로 정밀도(Precision) 산정 시 일치 단어 수에서 제외되어 BLEU 점수를 크게 떨어뜨린다.",
        "BLEU 점수를 무조건 100점으로 만들어준다.",
        "평가에서 완전히 제외되므로 점수에 전혀 영향이 없다.",
        "점수가 자동으로 2배 상향된다."
      ],
      answer: 0,
      explanation: "[UNK] 토큰은 참조문과 일치할 수 없으므로 n-gram 정밀도 계산에서 페널티를 받아 BLEU 점수가 하락합니다[cite: 2]."
    },
    {
      id: "nlp-s2s-sa-hard-010",
      conceptId: "length-penalty-sa",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "short-answer",
      prompt: "Beam Search 시 짧은 문장이 과도하게 선호되는 편향을 보정하기 위해 문장 길이로 점수를 정규화하는 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["길이 페널티", "Length Penalty", "length penalty", "길이페널티"],
      explanation: "Length Penalty(길이 페널티) 기법입니다[cite: 2, 3]."
    },
    {
      id: "nlp-s2s-sa-hard-011",
      conceptId: "bahdanau-attention-sa",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "short-answer",
      prompt: "신경망 레이어와 $\tanh$를 조합하여 가중치 합산 형태의 점수를 구하는 최초의 Additive 어텐션 제안자 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Bahdanau", "바다나우", "Bahdanau Attention"],
      explanation: "Bahdanau Additive Attention 기법입니다[cite: 2]."
    },
    {
      id: "nlp-s2s-sa-hard-012",
      conceptId: "scheduled-sampling-sa",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "short-answer",
      prompt: "노출 편향을 줄이기 위해 학습 진행에 따라 Teacher Forcing 비율을 점진적으로 감쇠시키는 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Scheduled Sampling", "scheduled sampling", "스케줄드 샘플링"],
      explanation: "Scheduled Sampling 기법입니다[cite: 2]."
    },
    {
      id: "nlp-s2s-sa-hard-013",
      conceptId: "alignment-matrix-sa",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "short-answer",
      prompt: "디코더가 단어를 만들 때 원문 입력의 어느 부분에 가중치를 두었는지 보여주는 2차원 확률 맵 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["어텐션 맵", "Attention Map", "attention map", "어텐션맵"],
      explanation: "Attention Map (어텐션 맵) 입니다[cite: 2]."
    },
    {
      id: "nlp-s2s-es-hard-014",
      conceptId: "beam-search-vs-greedy-math-essay",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "essay",
      prompt: "Beam Search가 Greedy Search의 단점(근시안적 탐색)을 어떻게 극복하는지 누적 확률 및 빔 크기 $k$ 개념을 포함하여 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["누적 확률", "k개", "후보", "최적해"],
      modelAnswer: "Greedy Search는 매 시점 가장 확률 높은 단어 1개만 고르므로 첫 선택이 꼬이면 전체 최적해를 놓치는 근시안적 문제가 있다. 반면 Beam Search는 매 스텝마다 확률이 높은 $k$개의 유망한 후보 경로를 동시에 유지하고 전체 문장의 누적 로그 확률 합을 기준으로 탐색하므로 전역적 최적 경로를 찾을 확률이 높다[cite: 2, 3].",
      rubricKeywords: ["Greedy 근시안적 선택", "Beam Search k개 후보 유지", "전체 누적 확률 기반 최적해"],
      minLength: 20,
      explanation: "Greedy의 단일 경로 고정 한계와 Beam Search의 $k$개 후보 누적 확률 최적화 원리를 서술합니다[cite: 2, 3].",
      hint: "Greedy의 한계와 Beam Search의 k개 후보 누적 확률 비교를 기술하세요[cite: 2, 3]."
    },
    {
      id: "nlp-s2s-es-hard-015",
      conceptId: "attention-mechanism-breakthrough-essay",
      difficulty: "hard",
      category: "Seq2Seq & Attention",
      questionType: "essay",
      prompt: "Attention 메커니즘이 기계 번역 분야에서 거둔 혁신적 성과 2가지(성능 향상 및 해석 가능성)를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["병목 현상", "정렬", "해석", "성능"],
      modelAnswer: "1) 성능 향상: 인코더의 모든 은닉 상태를 디코더가 직접 참조하게 함으로써 기존 고정 벡터의 병목 현상(Bottleneck problem)을 극복하고 긴 문장 번역 성능을 대폭 끌어올렸다. 2) 해석 가능성: 어텐션 가중치 분포(어텐션 맵)를 통해 모델이 번역 시 원문의 어느 단어를 참고했는지 정렬(Alignment) 근거를 시각적으로 파악할 수 있게 되었다[cite: 2].",
      rubricKeywords: ["병목 현상 극복 성능 향상", "어텐션 맵을 통한 정렬 해석 가능성"],
      minLength: 20,
      explanation: "병목 현상 해결에 따른 성능 향상과 어텐션 맵을 통한 정렬 근거 해석 이점을 서술합니다[cite: 2]."
    },

    // ==========================================
    // 5. Transformer & Self-Attention (15문항)
    // ==========================================
    {
      id: "nlp-tr-mc-hard-001",
      conceptId: "attention-matrix-multiplication-complexity-quadratic",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "시퀀스 길이가 $N$일 때 표준 Self-Attention의 시간 및 공간 복잡도가 $O(N^2)$인 결정적 원인은?",
      options: [
        "$Q K^T$ 연산 결과로 생성되는 유사도 행렬의 크기가 $N \times N$ 이기 때문",
        "입력 텐서의 차원이 무한대이기 때문",
        "Softmax 함수가 3차원 연산을 요구하기 때문",
        "가중치 행렬 $W^Q$의 행 개수가 $N^2$이므로"
      ],
      answer: 0,
      explanation: "Query와 Key 내적 행렬 크기가 $N \times N$이므로 시퀀스 길이에 대해 2차수 $O(N^2)$ 복잡도를 갖습니다[cite: 2].",
      hint: "모든 토큰 간 상호작용을 계산하므로 $N \times N$ 행렬이 만들어집니다[cite: 2]."
    },
    {
      id: "nlp-tr-mc-hard-002",
      conceptId: "rope-positional-encoding-mechanism",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "LLaMA 등 최신 LLM에 채택된 RoPE(Rotary Position Embedding)의 핵심 작동 원리는?",
      options: [
        "Query와 Key 벡터를 복소수 평면 상에서 회전 변환하여, 두 토큰 내적 시 상대적 위치 거리 차이만 자연스럽게 반영되도록 함",
        "임베딩에 단순히 고정된 삼각함수 상수를 더해줌",
        "위치 벡터를 무작위 난수로 초기화한 뒤 고정함",
        "포지셔널 인코딩을 완전히 삭제함"
      ],
      answer: 0,
      explanation: "RoPE는 회전 행렬 변환을 이용해 내적 연산 시 절대 위치가 아닌 두 토큰 간 상대적 거리 차이가 반영되도록 설계되었습니다[cite: 3].",
      hint: "회전 행렬을 이용해 상대적 위치 관계를 내적에 반영합니다[cite: 3]."
    },
    {
      id: "nlp-tr-mc-hard-003",
      conceptId: "alibi-positional-encoding-mechanism",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "ALiBi(Attention with Linear Biases) 위치 인코딩이 긴 컨텍스트 외삽(Extrapolation)을 가능하게 하는 원리는?",
      options: [
        "위치 벡터를 임베딩에 더하지 않고, $Q K^T$ 점수 행렬에 두 토큰 간 거리 비례 선형 페널티를 직접 빼준다.",
        "시퀀스 길이를 강제로 512로 자른다.",
        "학습할 때 사용한 길이보다 긴 데이터는 학습을 거부한다.",
        "Softmax 연산을 완전히 제거한다."
      ],
      answer: 0,
      explanation: "ALiBi는 Attention Score에 거리 비례 선형 페널티를 직접 적용하므로 학습 길이보다 훨씬 긴 입력도 무리 없이 외삽합니다[cite: 2, 3].",
      hint: "거리 차이에 비례한 선형 페널티 점수를 Attention 점수에 직접 빼줍니다[cite: 2, 3]."
    },
    {
      id: "nlp-tr-mc-hard-004",
      conceptId: "flash-attention-tiling-sram",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "FlashAttention이 $N \times N$ Attention 행렬을 느린 HBM에 통째로 쓰지 않고 고속 연산을 수행하는 핵심 구현 기법은?",
      options: [
        "GPU 빠른 SRAM 메모리 블록 크기로 행렬을 타일링(Tiling)하고 Online Softmax 기법으로 누적 계산함",
        "Softmax 대신 평균 연산만 수행함",
        "Q와 Key를 무작위로 90% 프루닝함",
        "모든 계산을 CPU 메모리로 전송해 처리함"
      ],
      answer: 0,
      explanation: "FlashAttention은 SRAM 타일링과 Online Softmax 알고리즘으로 HBM 메모리 IO 병목을 혁신적으로 제거했습니다[cite: 2, 3].",
      hint: "SRAM 메모리 블록 타일링과 Online Softmax를 결합합니다[cite: 2, 3]."
    },
    {
      id: "nlp-tr-mc-hard-005",
      conceptId: "transformer-layer-norm-pre-vs-post",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "초기 트랜스포머의 Post-LN 구조 대비 최신 LLM들이 채택한 Pre-LN 구조의 구조적 우수성은?",
      options: [
        "LayerNorm을 서브레이어 입력 직전(Pre)에 두어, 깊은 신경망에서도 잔차 통로의 기울기 전파가 매우 안정적임",
        "파라미터 개수를 절반으로 줄여줌",
        "Attention 연산 자체를 생략하게 해줌",
        "단방향 디코더를 양방향으로 자동 변환해줌"
      ],
      answer: 0,
      explanation: "Pre-LN은 잔차 연결 통로가 변형 없이 깨끗하게 연결되어 깊은 층에서도 기울기 소실 없이 안정적 학습을 돕습니다[cite: 2, 3].",
      hint: "서브레이어 연산 직전(Pre)에 Normalization을 두어 잔차 통로를 깨끗하게 유지합니다[cite: 2, 3]."
    },
    {
      id: "nlp-tr-mc-hard-006",
      conceptId: "transformer-residual-stream-bus",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "트랜스포머의 잔차 연결 통로(Residual Stream)를 해석 가능성(Interpretability) 관점에서 바라볼 때의 비유는?",
      options: [
        "모든 레이어가 정보를 읽고 쓰기(Read/Write)를 수행하는 중앙 정보 통신 버스(Communication Bus) 역할",
        "손실값을 0으로 만드는 무의미한 단순 우회로",
        "디코더 전용 데이터 단방향 송신기",
        "출력층 가중치를 초기화하는 장치"
      ],
      answer: 0,
      explanation: "Residual Stream은 토큰 표현 벡터가 레이어를 거치며 각 서브레이어 결과를 가산(Write)해 나가는 중앙 정보 버스 모델로 해석됩니다[cite: 2, 3].",
      hint: "레이어들이 정보를 읽고 쓰는 중앙 통신 버스(Bus) 역할을 합니다[cite: 2, 3]."
    },
    {
      id: "nlp-tr-mc-hard-007",
      conceptId: "transformer-encoder-decoder-masking-diff",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "트랜스포머 인코더 Self-Attention과 디코더 Masked Self-Attention의 마스크 행렬 유효 영역 차이는?",
      options: [
        "인코더는 $T \times T$ 전체 영역이 유효하고, 디코더는 미래 토큰을 차단하는 하삼각(Lower-triangular) 영역만 유효하다.",
        "인코더는 하삼각만 유효하고, 디코더는 전체가 유효하다.",
        "인코더와 디코더 모두 상삼각 영역만 유효하다.",
        "둘 다 마스크를 쓰지 않는다."
      ],
      answer: 0,
      explanation: "인코더는 양방향으로 전체 영역이 유효하고, 디코더는 미래 토큰 참조 방지를 위해 하삼각 영역만 유효합니다[cite: 2].",
      hint: "디코더는 미래를 가리기 위해 하삼각(Lower-triangular) 영역만 허용됩니다[cite: 2]."
    },
    {
      id: "nlp-tr-mc-hard-008",
      conceptId: "multi-query-attention-mqa",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "Multi-Head Attention의 KV 캐시 메모리 병목을 줄이기 위해 모든 Head가 단 하나의 K, V 헤드만 공유하도록 개량한 기술은?",
      options: ["Multi-Query Attention (MQA)", "Single-Head Attention", "Cross-Attention", "Full Attention"],
      answer: 0,
      explanation: "Multi-Query Attention(MQA)은 Q는 여러 개 두되 K와 V를 모든 헤드가 1개씩만 공유하여 KV 캐시를 대폭 절약합니다[cite: 3].",
      hint: "Query는 멀티헤드이지만 K와 V를 공유하는 MQA 기술입니다[cite: 3]."
    },
    {
      id: "nlp-tr-mc-hard-009",
      conceptId: "grouped-query-attention-gqa",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "MHA와 MQA의 장단점을 절충하여 여러 Query 헤드가 그룹을 이루어 K, V 헤드를 공유하는 최신 구조는?",
      options: ["Grouped-Query Attention (GQA)", "Multi-Head Attention", "Self-Attention", "Scaled Attention"],
      answer: 0,
      explanation: "Grouped-Query Attention(GQA)은 그룹 단위로 K, V 헤드를 공유해 성능 저하를 막고 KV 캐시 메모리를 아낍니다[cite: 3].",
      hint: "그룹(Grouped) 단위로 쿼리와 켄/밸류 헤드를 매핑합니다[cite: 3]."
    },
    {
      id: "nlp-tr-sa-hard-010",
      conceptId: "rope-sa",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "short-answer",
      prompt: "복소수 평면 회전 변환 행렬을 이용해 상대적 위치 거리가 내적에 반영되도록 한 위치 인코딩 기법의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["RoPE", "rope", "Rotary Position Embedding"],
      explanation: "Rotary Position Embedding (RoPE) 기법입니다[cite: 3].",
      hint: "R_P_ 형태의 4글자 영문 약자입니다[cite: 3]."
    },
    {
      id: "nlp-tr-sa-hard-011",
      conceptId: "alibi-sa",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "short-answer",
      prompt: "Attention 점수에 두 토큰 간 거리 비례 선형 페널티를 직접 빼주어 외삽 성능을 높이는 기법의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["ALiBi", "alibi", "Attention with Linear Biases"],
      explanation: "ALiBi 기법입니다[cite: 2, 3].",
      hint: "A_L_B 형태의 영문 표기입니다[cite: 2, 3]."
    },
    {
      id: "nlp-tr-sa-hard-012",
      conceptId: "flash-attention-sa",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "short-answer",
      prompt: "GPU SRAM 타일링과 온라인 소프트맥스를 통해 메모리 IO 병목을 해결한 고속 어텐션 커널의 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["FlashAttention", "Flash Attention", "flash attention"],
      explanation: "FlashAttention 커널 기술입니다[cite: 2, 3].",
      hint: "Flash 뒤에 Attention이 붙습니다[cite: 2, 3]."
    },
    {
      id: "nlp-tr-sa-hard-013",
      conceptId: "gqa-sa",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "short-answer",
      prompt: "MHA와 MQA의 절충안으로 쿼리 헤드들이 그룹별로 KV 헤드를 공유하는 최신 어텐션 변형 기법의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["GQA", "gqa", "Grouped-Query Attention"],
      explanation: "Grouped-Query Attention (GQA) 입니다[cite: 3].",
      hint: "G_A 형태의 3글자 약자입니다[cite: 3]."
    },
    {
      id: "nlp-tr-es-hard-014",
      conceptId: "scaled-dot-product-math-essay",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "essay",
      prompt: "Scaled Dot-Product Attention 수식 $\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V$ 에서 왜 $\sqrt{d_k}$로 나누어 주어야 하는지 내적 분산 및 Softmax 기울기 소실 관점에서 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["분산", "차원", "Softmax", "기울기 소실"],
      modelAnswer: "차원 $d_k$가 커지면 $Q K^T$ 내적값들의 분산이 커져 값이 매우 커진다. 이 경우 Softmax 함수를 통과하면 출력이 한쪽으로 쏠려 뾰족해지고 미분 기울기가 0에 수렴하는 기울기 소실이 발생하므로, $\sqrt{d_k}$로 나누어 분산을 정규화한다[cite: 2].",
      rubricKeywords: ["내적 분산 증가", "Softmax 미분 기울기 소실", "$\sqrt{d_k}$ 스케일링 정규화"],
      minLength: 20,
      explanation: "차원 증가에 따른 내적 분산 확대와 Softmax 기울기 소실 방지를 위한 $\sqrt{d_k}$ 정규화 원리를 서술합니다[cite: 2].",
      hint: "차원이 클 때 분산이 커져 Softmax 미분값이 0이 되는 현상을 기술하세요[cite: 2]."
    },
    {
      id: "nlp-tr-es-hard-015",
      conceptId: "pre-ln-vs-post-ln-essay",
      difficulty: "hard",
      category: "Transformer & Self-Attention",
      questionType: "essay",
      prompt: "초기 트랜스포머의 Post-LN 구조와 비교하여 최신 LLM들이 채택한 Pre-LN 구조가 갖는 잔차 연결(Residual Stream) 상의 수학적 이점을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Pre-LN", "Post-LN", "잔차 통로", "기울기 전파"],
      modelAnswer: "Post-LN은 레이어 정규화가 잔차 합산 이후에 위치하여 깊은 층에서 역전파 기울기 전파가 불안정하다. 반면 Pre-LN은 정규화를 서브레이어 연산 직전에 두고 잔차 연결 통로가 변형 없이 깨끗하게 다이렉트로 연결되므로, 매우 깊은 신경망에서도 기울기 소실 없이 안정적으로 학습할 수 있다[cite: 2, 3].",
      rubricKeywords: ["Post-LN 역전파 불안정", "Pre-LN 잔차 통로 다이렉트 연결 안정"],
      minLength: 20,
      explanation: "Post-LN의 불안정성과 Pre-LN의 깨끗한 잔차 통로 다이렉트 연결에 따른 학습 안정성 이점을 서술합니다[cite: 2, 3]."
    },

    // ==========================================
    // 6. 텍스트 파운데이션 모델 (15문항)
    // ==========================================
    {
      id: "nlp-llm-mc-hard-001",
      conceptId: "chinchilla-scaling-law-formula",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "Chinchilla 논문에서 밝혀낸 컴퓨팅 예산 최적 할당 법칙(Compute-Optimal)에 대한 설명으로 옳은 것은?",
      options: [
        "주어진 컴퓨팅 자산 한도 내에서 모델 파라미터 수 $N$과 학습 토큰 수 $D$는 동일한 비율(1:1)로 함께 증가해야 한다.",
        "모델 파라미터는 무조건 늘리고 토큰 수는 적게 써야 한다.",
        "학습 토큰 수는 늘리되 파라미터는 아주 작게 고정해야 한다.",
        "모델 성능은 파라미터 크기와 아무 상관이 없다."
      ],
      answer: 0,
      explanation: "Chinchilla 연구는 $N$과 $D$를 1:1 비율로 동등하게 확장하는 것이 컴퓨팅 예산 대비 손실을 최적화함을 증명했습니다[cite: 3].",
      hint: "파라미터 수와 학습 토큰 수를 1:1 비율로 동등하게 확장해야 합니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-hard-002",
      conceptId: "emergence-mirage-hypothesis",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "Schaeffer 등이 제안한 'LLM의 창발성(Emergence)은 신기루일 수 있다'는 가설의 핵심 논지는?",
      options: [
        "연속적인 평가 지표(Token Cross-Entropy 등)로 살펴보면 모델 성능은 계단식이 아니라 크기에 비례해 매끄럽고 연속적으로 향상된다.",
        "창발성은 실제로 존재하며 마법처럼 갑자기 일어난다.",
        "모델이 클수록 성능이 떨어지는 현상을 의미한다.",
        "파라미터가 0.1B일 때만 창발성이 일어난다."
      ],
      answer: 0,
      explanation: "Exact Match 같은 불연속적 지표를 쓸 때 계단식 점프처럼 보일 뿐, 연속 지표에서는 연속 선형 개선이라는 비판입니다[cite: 3].",
      hint: "불연속 지표(Exact Match 등) 선택으로 인한 착시 현상이라는 주장입니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-hard-003",
      conceptId: "causal-lm-cross-entropy-math",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "길이 $T$인 토큰 시퀀스 $X = (x_1, ..., x_T)$에 대한 Causal Language Model의 평균 교차 엔트로피 손실 $L$ 수식은?",
      options: [
        "$L = -\\frac{1}{T} \\sum_{t=1}^T \\log P_{\\theta}(x_t | x_1, ..., x_{t-1})$",
        "$L = -\\sum_{t=1}^T P_{\\theta}(x_t) \\log x_t$",
        "$L = \\frac{1}{T} \\sum_{t=1}^T (x_t - \\hat{x}_t)^2$",
        "$L = -\\log P(x_1) + \\log P(x_T)$"
      ],
      answer: 0,
      explanation: "Causal LM은 이전 문맥이 주어졌을 때 정답 토큰 $x_t$의 음의 로그 가능도(NLL) 평균을 손실함수로 최소화합니다[cite: 3].",
      hint: "이전 토큰들이 주어졌을 때 정답 토큰의 음의 로그 가능도 평균을 구합니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-hard-004",
      conceptId: "mixture-of-experts-moe-concept",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "Mixtral 8x7B 같은 MoE(Mixture of Experts) 아키텍처가 추론 시 계산 효율을 높이는 원리는?",
      options: [
        "토큰마다 전체 네트워크가 아니라 라우터를 통해 일부 전문 전문가(Expert) 서브네트워크만 선택적으로 활성화한다.",
        "모든 전문가 네트워크를 동시에 전부 풀가동한다.",
        "신경망 가중치를 모두 0으로 만들어 연산을 생략한다.",
        "토큰 개수를 1/10로 강제 압축한다."
      ],
      answer: 0,
      explanation: "MoE는 라우터(Router)를 통해 토큰별로 지정된 일부 Expert FFN 레이어만 활성화해 활성화 파라미터는 줄이고 총 용량은 키웁니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-hard-005",
      conceptId: "scaling-law-loss-power-law",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "Kaplan 등의 Scaling Law 연구에서 모델 크기 $N$, 데이터 크기 $D$, 연산량 $C$가 증가할 때 Test Loss $L$이 따르는 수학적 법칙은?",
      options: [
        "거듭제곱 법칙 (Power Law) 형태로 손실이 지수적으로 감소한다.",
        "로그함수 형태로 손실이 증가한다.",
        "상수 값으로 완벽히 고정된다.",
        "사인파 형태로 진동한다."
      ],
      answer: 0,
      explanation: "Test Loss는 자원 규모에 대해 Power Law(거듭제곱 법칙) 관계를 따르며 감소합니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-hard-006",
      conceptId: "pretraining-data-curation-quality",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "최신 LLM 사전 학습 시 단순 웹 크롤링 데이터 양만 늘리는 것보다 고품질 데이터 선별 및 정제(Curation)가 필수적인 이유는?",
      options: [
        "저품질 텍스트나 노이즈, 중복 데이터는 모델의 학습 효율을 떨어뜨리고 환각 및 편향을 유발하므로 양질의 데이터 밀도가 성능을 좌우하기 때문",
        "데이터 파일 크기가 작아야 다운로드가 빨라서",
        "GPU가 저품질 데이터를 처리하면 물리적으로 고장 나기 때문에",
        "법적 규제를 피하기 위해서만 필요하므로 성능과 무관함"
      ],
      answer: 0,
      explanation: "데이터의 양(Quantity)뿐만 아니라 질(Quality)과 정제도가 LLM의 지식 습득과 환각 방지에 결정적 영향을 미칩니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-hard-007",
      conceptId: "llama-3-vocabulary-size",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "LLaMA 3 모델이 토크나이저 어휘 사전 크기(Vocabulary Size)를 이전 세대(32k) 대비 대폭 확장한 수치는?",
      options: ["128k (128,000)", "32k", "10k", "1000k"],
      answer: 0,
      explanation: "LLaMA 3는 128k 규모의 대형 토크나이저 어휘 사전을 채택하여 다국어 및 코드 표현 효율성을 높였습니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-hard-008",
      conceptId: "pretraining-compute-optimal-token-ratio",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "Chinchilla 법칙 이전의 구형 관점(Kaplan 법칙)과 Chinchilla 최적 관점 간의 가장 큰 시각 차이는?",
      options: [
        "구형 관점은 모델 크기 $N$을 과도하게 키우는 것이 유리하다고 보았으나, Chinchilla는 모델 크기와 토큰 수 $D$를 동등한 1:1 비율로 키워야 한다고 수정함",
        "Chinchilla는 학습 토큰 수를 0으로 해야 한다고 보았다.",
        "두 관점은 완벽히 동일하다.",
        "구형 관점이 최신 모델에 그대로 적용된다."
      ],
      answer: 0,
      explanation: "과거에는 모델 크기 위주로 키웠으나, Chinchilla는 데이터 토큰 수도 그만큼 비례해 대폭 늘려야 함을 밝혀냈습니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-hard-009",
      conceptId: "flash-decoding-long-context",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "긴 컨텍스트(Long Context) 추론 단계에서 배치 크기가 작을 때 Self-Attention의 키/밸류 병목을 해결하기 위해 쿼리(Query) 헤드 간 병렬화를 수행하는 최적화 커널 기술은?",
      options: ["Flash-Decoding", "Standard Softmax", "Basic MatMul", "CPU Offloading"],
      answer: 0,
      explanation: "Flash-Decoding은 디코딩 단계에서 쿼리 길이를 분할 병렬화하여 긴 문맥 추론 속도를 대폭 가속합니다[cite: 3]."
    },
    {
      id: "nlp-llm-sa-hard-010",
      conceptId: "chinchilla-law-sa",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "short-answer",
      prompt: "파라미터 수와 학습 토큰 수를 1:1 동등 비율로 확장해야 최적이라는 DeepMind의 스케일링 법칙 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Chinchilla Scaling Law", "Chinchilla", "친칠라 법칙", "Chinchilla 법칙"],
      explanation: "Chinchilla Scaling Law 법칙입니다[cite: 3]."
    },
    {
      id: "nlp-llm-sa-hard-011",
      conceptId: "power-law-sa",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "short-answer",
      prompt: "LLM의 스케일 증가에 따른 테스트 손실(Loss) 감소 추세를 나타내는 수학적 법칙 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["거듭제곱 법칙", "Power Law", "power law"],
      explanation: "Power Law (거듭제곱 법칙) 입니다[cite: 3]."
    },
    {
      id: "nlp-llm-sa-hard-012",
      conceptId: "mixture-of-experts-sa",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "short-answer",
      prompt: "토큰별로 라우터를 통해 일부 전문 전문가 FFN 서브네트워크만 선택 활성화하는 구조의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["MoE", "moe", "Mixture of Experts"],
      explanation: "Mixture of Experts (MoE) 구조입니다[cite: 3]."
    },
    {
      id: "nlp-llm-sa-hard-013",
      conceptId: "flash-decoding-sa",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "short-answer",
      prompt: "긴 컨텍스트 디코딩 시 쿼리 헤드 병렬화를 통해 KV 캐시 연산을 가속하는 최적화 커널 기술은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Flash-Decoding", "flash decoding", "플래시 디코딩"],
      explanation: "Flash-Decoding 기술입니다[cite: 3]."
    },
    {
      id: "nlp-llm-es-hard-014",
      conceptId: "chinchilla-vs-kaplan-essay",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "essay",
      prompt: "초기 Kaplan 등의 Scaling Law 관점과 이후 Chinchilla 연구가 밝혀낸 컴퓨팅 예산 최적화 관점의 차이점을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Kaplan", "Chinchilla", "파라미터", "토큰"],
      modelAnswer: "초기 Kaplan 연구는 고정된 컴퓨팅 예산 내에서 모델 파라미터 수($N$)를 키우는 것이 학습 토큰 수($D$)를 늘리는 것보다 중요하다고 보았다. 그러나 후속 Chinchilla 연구는 $N$과 $D$를 동일한 1:1 비율로 균형 있게 늘려야 함을 입증하여 기존 모델들이 대개 과소학습(Under-trained) 상태였음을 밝혔다[cite: 3].",
      rubricKeywords: ["Kaplan 파라미터 중심", "Chinchilla 파라미터와 토큰 1:1 균형 확장"],
      minLength: 20,
      explanation: "Kaplan의 파라미터 위주 확장과 Chinchilla의 파라미터-토큰 1:1 균형 확장 주장을 비교 서술합니다[cite: 3]."
    },
    {
      id: "nlp-llm-es-hard-015",
      conceptId: "emergence-mirage-hypothesis-essay",
      difficulty: "hard",
      category: "텍스트 파운데이션 모델",
      questionType: "essay",
      prompt: "LLM의 '창발성(Emergence)' 현상을 두고 Schaeffer 등이 제정한 '신기루 가설(Mirage Hypothesis)'의 논지와 시사점을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["신기루", "불연속", "연속", "착시"],
      modelAnswer: "신기루 가설은 LLM의 창발성이 모델의 급격한 질적 비약 때문이 아니라, Exact Match 같은 불연속적이고 단절된 평가 지표를 사용했기 때문에 발생한 통계적 착시(신기루)라고 주장한다. 토큰 크로스 엔트로피 같은 연속적 지표로 보면 성능은 모델 크기에 비례해 매끄럽게 향상된다[cite: 3].",
      rubricKeywords: ["불연속적 평가 지표 사용에 따른 통계적 착시", "연속적 지표 상 선형 향상"],
      minLength: 20,
      explanation: "불연속 지표 선택으로 인한 계단식 착시 주장과 연속 지표 상의 매끄러운 향상 논지를 서술합니다[cite: 3]."
    },

    // ==========================================
    // 7. 정렬 학습 (Alignment) (15문항)
    // ==========================================
    {
      id: "nlp-align-mc-hard-001",
      conceptId: "rlhf-kl-penalty-reason",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "RLHF Step 3 PPO 학습 시 목적함수에 KL Divergence 페널티 항 $D_{KL}(\pi_\phi^{RL} \parallel \pi^{SFT})$을 포함하는 핵심 목적은?",
      options: [
        "언어 모델이 보상 모델의 허점(Bug)을 악용하여 의미 없는 반복문이나 이상한 텍스트로 점수만 높이는 보상 해킹(Reward Hacking)을 방지하기 위해",
        "보상 모델의 VRAM 메모리 사용량을 절반으로 낮추기 위해",
        "초기 SFT 모델의 기억을 완전히 삭제하기 위해",
        "문장 길이를 강제로 5단어로 제한하기 위해"
      ],
      answer: 0,
      explanation: "KL 페널티를 주어 새로운 정책이 초기 SFT 분포에서 너무 멀어지지 않게 억제함으로써 보상 해킹을 방지합니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-hard-002",
      conceptId: "dpo-implicit-reward-math",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "Direct Preference Optimization(DPO) 유도 과정에서 정의되는 암묵적 보상(Implicit Reward) $r(x, y)$의 수식 표현은?",
      options: [
        "$r(x, y) = \beta \log \frac{\pi_\theta(y|x)}{\pi_{ref}(y|x)}$",
        "$r(x, y) = \pi_\theta(y|x) + \pi_{ref}(y|x)$",
        "$r(x, y) = \frac{\pi_{ref}(y|x)}{\pi_\theta(y|x)}$",
        "$r(x, y) = \sigma(\pi_\theta(y|x))$"
      ],
      answer: 0,
      explanation: "DPO는 최적 강화학습 정책 수식을 역변환하여 보상함수가 레퍼런스 모델 대비 현재 모델의 로그 확률 비로 표현됨을 유도합니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-hard-003",
      conceptId: "dpo-loss-gradient-property",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "DPO 손실함수의 기울기(Gradient)가 지니는 학습 상의 우수한 특성은?",
      options: [
        "모델이 비선호 답변에 더 높은 확률을 부여하는 등 예측을 틀렸을 때 더 강한 기울기 보정 신호를 인가한다.",
        "정답 여부와 관계없이 항상 일정한 상숫값의 기울기를 낸다.",
        "기울기가 무조건 0으로 수렴해 업데이트를 차단한다.",
        "선호 답변과 비선호 답변을 구별하지 못한다."
      ],
      answer: 0,
      explanation: "DPO 기울기는 현재 모델이 틀린 예측(비선호에 높은 점수)을 할 때 가중치가 커져 더 강력한 보정 신호를 가합니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-hard-004",
      conceptId: "rlhf-reward-model-overoptimization",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "RLHF에서 보상 모델 점수 최적화가 지나쳐 과최적화(Overoptimization)가 일어났을 때 관측되는 현상은?",
      options: [
        "보상 모델이 주는 점수는 계속 상승하지만, 실제 사람이 평가한 텍스트의 질과 지시 이행 품질은 오히려 하락한다.",
        "인간 평가 품질과 보상 점수가 무조건 평행하게 상승한다.",
        "보상 점수가 0으로 완전히 고정된다.",
        "생성 속도가 100배 빨라진다."
      ],
      answer: 0,
      explanation: "보상 모델의 허점을 파고들어 점수만 높이는 현상 때문에 실제 사람 평가 품질은 오히려 떨어지게 됩니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-hard-005",
      conceptId: "instruct-gpt-ppo-value-network",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "InstructGPT의 PPO 강화학습 구동 시 정책 모델(Policy)과 함께 토큰 스텝별 누적 보상을 추정하도록 동시 훈련되는 보조 네트워크는?",
      options: ["가치 함수 네트워크 (Value Network / Critic)", "보상 모델 (Reward Model)", "토크나이저", "임베딩 층"],
      answer: 0,
      explanation: "PPO는 Actor-Critic 구조로, 현재 상태의 가치를 추정하는 Value Network(Critic)를 함께 두어 어드밴티지를 계산합니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-hard-006",
      conceptId: "prefix-injection-jailbreak",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "LLM 탈옥 공격 중 \"Start with 'Absolutely! Here is '\" 같이 시작 문구를 강제 지정하여 안전 거절을 무력화하는 기법은?",
      options: ["Prefix Injection (프리픽스 주입)", "RAG", "DPO", "Fine-tuning"],
      answer: 0,
      explanation: "강제 답변 시작 문구(Prefix)를 지정하면 모델이 긍정 토큰 연쇄를 이어 생성하느라 안전 거절 통제가 무너집니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-hard-007",
      conceptId: "dpo-vs-rlhf-loss-landscape",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "DPO가 RLHF 대비 최적화 관정에서 가지는 안정성의 구조적 이유는?",
      options: [
        "강화학습(PPO)의 불안정한 샘플링 루프와 별도 보상 모델 학습을 배제하고, 단일 분류 Cross-Entropy 손실로 수렴하기 때문",
        "미분 연산을 아예 사용하지 않기 때문에",
        "학습률을 무한대로 키울 수 있기 때문에",
        "데이터셋을 전혀 필요로 하지 않기 때문에"
      ],
      answer: 0,
      explanation: "DPO는 복잡한 RL 루프 없이 표준 분류 Cross-Entropy 손실 형태로 수식 변환하여 안정적이고 직관적인 경사하강법 학습이 가능합니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-hard-008",
      conceptId: "rlhf-reward-model-binary-pair-loss-math",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "InstructGPT 보상 모델 학습용 이진 쌍 손실함수 $loss(\psi) = -\mathbb{E}_{(x, y_w, y_l)} \left[ \log \sigma \left( R_\psi(x, y_w) - R_\psi(x, y_l) \right) \right]$ 의 최적화 목적은?",
      options: [
        "선호 답변 $y_w$의 보상 점수가 비선호 답변 $y_l$의 보상 점수보다 최대한 높아지도록 차이를 시그모이드 상에서 극대화한다.",
        "두 답변의 보상 점수 차이를 무조건 0으로 만든다.",
        "비선호 답변의 점수를 인위적으로 높인다.",
        "보상 모델 가중치를 영벡터로 만든다."
      ],
      answer: 0,
      explanation: "선호 답변 보상($R_w$)과 비선호 답변 보상($R_l$)의 차이를 키워 로그 시그모이드 확률을 최대화합니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-hard-009",
      conceptId: "flan-unseen-task-generalization",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "지시 학습(Instruction Tuning)에서 학습 단계에 포함되지 않은 완전히 새로운(Held-out) 태스크에 대해서도 제로샷 성능이 좋아지는 현상의 배경은?",
      options: [
        "다양한 지시문 템플릿을 학습하면서 모델이 프롬프트의 지시 구문 자체를 해석하고 추론하는 범용 역량을 습득했기 때문에",
        "모델이 테스트 문제를 미리 암기했기 때문에",
        "학습 데이터와 테스트 데이터가 우연히 완전히 일치해서",
        "파라미터가 자동으로 리셋되어서"
      ],
      answer: 0,
      explanation: "다양한 지시 템플릿 학습을 통해 지시문을 해석하는 메타 능력이 길러져 보지 못한 태스크도 잘 풀게 됩니다[cite: 3]."
    },
    {
      id: "nlp-align-sa-hard-010",
      conceptId: "kl-divergence-sa",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "short-answer",
      prompt: "RLHF PPO 학습 시 새로운 정책 분포가 SFT 원래 분포에서 지나치게 이탈하는 것을 막기 위해 추가하는 손실 페널티의 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["KL Divergence", "kl divergence", "KL 발산", "Kullback-Leibler Divergence"],
      explanation: "KL Divergence (KL 발산) 페널티입니다[cite: 3]."
    },
    {
      id: "nlp-align-sa-hard-011",
      conceptId: "reward-hacking-sa",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "short-answer",
      prompt: "RLHF 과정에서 모델이 보상 모델의 맹점을 악용하여 엉뚱한 텍스트로 높은 점수만 타내는 부작용 현상은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Reward Hacking", "reward hacking", "보상 해킹"],
      explanation: "Reward Hacking (보상 해킹) 현상입니다[cite: 3]."
    },
    {
      id: "nlp-align-sa-hard-012",
      conceptId: "dpo-loss-sa",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "short-answer",
      prompt: "DPO에서 보상 모델과 PPO 없이 선호 데이터 확률 비를 이용해 직접 최적화하는 손실함수 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["DPO Loss", "dpo loss", "DPO 손실함수"],
      explanation: "DPO Loss (DPO 손실함수) 입니다[cite: 3]."
    },
    {
      id: "nlp-align-sa-hard-013",
      conceptId: "ppo-actor-critic-sa",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "short-answer",
      prompt: "RLHF Step 3에서 정책 모델과 함께 기대 보상을 추정하기 위해 동시 훈련되는 보조 네트워크 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Value Network", "value network", "Critic", "critic", "가치 함수 네트워크"],
      explanation: "Value Network (Critic) 입니다[cite: 3]."
    },
    {
      id: "nlp-align-es-hard-014",
      conceptId: "rlhf-kl-penalty-essay",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "essay",
      prompt: "RLHF PPO 학습 목적함수에 KL Divergence 페널티 항을 반드시 포함해야 하는 이유를 보상 해킹(Reward Hacking) 관점에서 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["KL Divergence", "보상 해킹", "이탈", "원래 분포"],
      modelAnswer: "보상 모델은 완벽하지 않으므로, 강화학습 시 모델이 보상 모델의 허점을 파고들어 점수만 높이는 '보상 해킹' 현상이 발생할 수 있다. KL Divergence 페널티는 새로운 모델의 확률 분포가 초기 SFT 모델 분포에서 지나치게 멀어지는 것을 억제해 텍스트 붕괴와 보상 해킹을 막아준다[cite: 3].",
      rubricKeywords: ["보상 모델 허점 악용(보상 해킹)", "초기 SFT 분포로부터의 과도한 이탈 억제"],
      minLength: 20,
      explanation: "보상 해킹 방지와 초기 SFT 분포 유지 목적의 KL Divergence 페널티 역할을 서술합니다[cite: 3]."
    },
    {
      id: "nlp-align-es-hard-015",
      conceptId: "dpo-vs-rlhf-optimization-essay",
      difficulty: "hard",
      category: "정렬 학습 (Alignment)",
      questionType: "essay",
      prompt: "DPO가 기존 RLHF 방식에 비해 훈련 파이프라인 구조와 최적화 안정성 측면에서 갖는 근본적인 장점을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["보상 모델", "PPO", "직접 최적화", "안정성"],
      modelAnswer: "RLHF는 SFT, 별도 보상 모델 학습, 불안정한 PPO 강화학습 루프까지 3단계의 복잡한 파이프라인을 거친다. 반면 DPO는 수학적 트릭을 통해 보상함수를 언어 모델의 확률 비로 치환하여, 별도의 보상 모델과 PPO 없이 선호 데이터셋으로 표준 분류 크로스 엔트로피 손실을 통해 직접 최적화하므로 훈련이 훨씬 안정적이다[cite: 3].",
      rubricKeywords: ["보상 모델 및 PPO 루프 배제", "표준 분류 손실을 통한 직접 최적화 안정성"],
      minLength: 20,
      explanation: "RLHF의 복잡한 3단계 파이프라인과 PPO 불안정성을 극복하는 DPO의 직접 최적화 안정성을 서술합니다[cite: 3]."
    },

    // ==========================================
    // 8. 디코딩 알고리즘 (15문항)
    // ==========================================
    {
      id: "nlp-dec-mc-hard-001",
      conceptId: "temperature-limit-infinity-distribution",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Sampling 디코딩 시 Temperature $T \rightarrow \infty$ (무한대) 로 극한을 취했을 때 Softmax 확률 분포의 변화는?",
      options: [
        "모든 토큰의 선택 확률이 $\frac{1}{|V|}$ 로 동일해지는 완벽한 균등 분포(Uniform Distribution)가 되어 완전 무작위 출력이 된다.",
        "가장 로짓이 큰 단어의 확률이 정확히 1이 된다.",
        "모든 단어의 확률이 0으로 수렴한다.",
        "확률 분포가 변경되지 않고 유지된다."
      ],
      answer: 0,
      explanation: "$T \to \infty$ 이면 $z_i / T \to 0$이 되어 $\exp(0)=1$이므로 모든 단어가 동등한 확률($1/|V|$)을 갖는 균등 분포가 됩니다[cite: 3]."
    },
    {
      id: "nlp-dec-mc-hard-002",
      conceptId: "contrastive-search-degeneration-penalty",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Contrastive Search 디코딩에서 반복 현상(Degeneration)을 막기 위해 후보 토큰의 로짓 평가식에 포함된 페널티 항은?",
      options: [
        "이전 생성된 토큰들의 은닉 상태와 현재 후보 토큰 은닉 상태 간의 최대 코사인 유사도에 페널티 계수 $\alpha$를 곱해 차감한다.",
        "이전 토큰들과 동일한 단어가 나오면 가산점을 100점 부여한다.",
        "확률값을 무조건 음수로 변환한다.",
        "문장 길이를 10단어로 강제 차단한다."
      ],
      answer: 0,
      explanation: "Contrastive Search는 이전 은닉 벡터들과의 코사인 유사도가 높은 중복/상투어 후보에 페널티를 주어 반복을 막습니다[cite: 3]."
    },
    {
      id: "nlp-dec-mc-hard-003",
      conceptId: "beam-search-length-penalty-formula",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Beam Search에서 짧은 문장 선호 편향을 막기 위해 누적 로그 확률 합을 정규화하는 길이 페널티 수식 표현은?",
      options: [
        "$\\frac{1}{|Y|^\alpha} \sum_{t=1}^{|Y|} \log P(y_t | y_<t)$",
        "$\\sum \\log P(y_t) \times |Y|$",
        "$|Y| + \sum \log P(y_t)$",
        "$\\log (|Y|)$"
      ],
      answer: 0,
      explanation: "문장 길이 $|Y|^\alpha$ 로 누적 로그 확률 합을 나누어(정규화하여) 지나치게 짧은 문장이 채택되는 편향을 보정합니다[cite: 2, 3]."
    },
    {
      id: "nlp-dec-mc-hard-004",
      conceptId: "speculative-decoding-mechanism",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Speculative Decoding(추측적 디코딩)이 대형 메인 LLM의 추론 속도를 가속하는 원리는?",
      options: [
        "작고 빠른 Draft 모델이 토큰들을 빠르게 연달아 추측하고, 거대한 Target 모델이 이를 한 번의 병렬 순방향 연산으로 동시 검증(Acceptance)하기 때문에",
        "Target 모델을 완전히 삭제하고 Draft 모델 하나만 돌리기 때문에",
        "모든 디코딩 단계를 CPU로만 처리하기 때문에",
        "Softmax 연산을 생략하기 때문에"
      ],
      answer: 0,
      explanation: "작은 모델이 선행 추측한 토큰들을 큰 모델이 병렬 검증하여 수용률에 따라 한 번에 여러 토큰을 통과시키는 가속 기법입니다[cite: 3]."
    },
    {
      id: "nlp-dec-mc-hard-005",
      conceptId: "repetition-penalty-logit-adjustment",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "디코딩 시 Repetition Penalty $\theta > 1$을 이전에 등장한 토큰 로짓 $z_{x_j}$에 적용하는 올바른 수식 규칙은?",
      options: [
        "$z_i = \\begin{cases} z_i / \theta & (z_i > 0 \text{ 일 때}) \\\\ z_i \times \theta & (z_i < 0 \text{ 일 때}) \end{cases}$",
        "$z_i = z_i - \theta$",
        "$z_i = z_i \times \theta$",
        "$z_i = 0$"
      ],
      answer: 0,
      explanation: "로짓이 양수면 $\theta$로 나누고 음수면 $\theta$를 곱해 더 작은 값으로 만들어 샘플링 확률을 떨어뜨립니다[cite: 3]."
    },
    {
      id: "nlp-dec-mc-hard-006",
      conceptId: "speculative-decoding-rejection-sampling",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Speculative Decoding에서 Target 모델이 Draft 모델의 추측 토큰을 검증할 때 사용하는 리젝션 샘플링 확률 기준은?",
      options: [
        "$\\min\left(1, \frac{p(x)}{q(x)}\right)$ 비율을 기반으로 하여 최종 출력 분포가 타겟 모델 원본 분포와 수학적으로 완벽히 동일함을 보장한다.",
        "무조건 50% 확률로 수용한다.",
        "드래프트 모델 확률이 더 높으면 무조건 거부한다.",
        "타겟 모델의 손실함수 값에 비례한다."
      ],
      answer: 0,
      explanation: "리젝션 샘플링 비율 $\min(1, p/q)$을 적용하므로 속도는 빨라지되 생성 분포 왜곡은 전혀 발생하지 않습니다[cite: 3]."
    },
    {
      id: "nlp-dec-mc-hard-007",
      conceptId: "beam-search-computational-cost",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Beam Search가 Greedy Search에 비해 갖는 명확한 단점(Trade-off)은?",
      options: [
        "매 시점 $k$개의 후보 경로마다 LLM 추론 연산을 수행해야 하므로 계산 비용과 메모리 사용량이 크게 증가한다.",
        "품질이 Greedy보다 항상 떨어진다.",
        "구현 코드가 불가능할 정도로 복잡하다.",
        "문장 생성이 멈추지 않고 무한 루프에 빠진다."
      ],
      answer: 0,
      explanation: "빔 크기 $k$배수만큼 후보를 확장하고 평가해야 하므로 연산량과 메모리 부담이 선형 이상으로 커집니다[cite: 2, 3]."
    },
    {
      id: "nlp-dec-mc-hard-008",
      conceptId: "sampling-with-temperature-smooth-sharp",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Temperature 조절을 통한 Sampling 디코딩에서 $T < 1$ (낮은 온도)로 설정할 때 나타나는 확률 분포의 성질은?",
      options: [
        "확률 분포가 뾰족(Sharp)해져 가장 확률이 높은 상위 단어의 선택 확률이 더욱 극대화된다.",
        "확률 분포가 완전히 평평해져 모든 단어가 동일한 확률을 갖는다.",
        "모든 단어의 확률이 음수가 된다.",
        "모델이 출력을 거부한다."
      ],
      answer: 0,
      explanation: "$T<1$ 이면 로짓 간 격차가 증폭되어 확률 분포가 Sharp해지고 상위 단어로 확률이 집중됩니다[cite: 3]."
    },
    {
      id: "nlp-dec-mc-hard-009",
      conceptId: "top-k-vs-top-p-sampling-difference",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Top-K Sampling과 Top-P Sampling의 핵심적인 차이점은?",
      options: [
        "Top-K는 후보 개수 $K$를 고정하고, Top-P는 누적 확률 $P$에 도달할 때까지 후보 개수를 동적으로 조절한다.",
        "Top-K는 동적이고 Top-P는 개수가 고정되어 있다.",
        "Top-K는 샘플링을 안 하고 Top-P만 샘플링을 한다.",
        "두 방식은 완전히 동일하다."
      ],
      answer: 0,
      explanation: "Top-K는 K개 고정, Top-P는 누적 확률 합 P를 채울 때까지 동적으로 개수가 변합니다[cite: 3]."
    },
    {
      id: "nlp-dec-sa-hard-010",
      conceptId: "speculative-decoding-sa",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "short-answer",
      prompt: "작은 드래프트 모델이 추측하고 큰 타겟 모델이 병렬 검증하여 추론 속도를 높이는 최적화 디코딩 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Speculative Decoding", "speculative decoding", "추측적 디코딩"],
      explanation: "Speculative Decoding 기법입니다[cite: 3]."
    },
    {
      id: "nlp-dec-sa-hard-011",
      conceptId: "contrastive-search-sa",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "short-answer",
      prompt: "이전 은닉 상태들과의 코사인 유사도 페널티를 주어 텍스트 반복 현상을 막는 디코딩 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Contrastive Search", "contrastive search", "대조 검색"],
      explanation: "Contrastive Search 디코딩입니다[cite: 3]."
    },
    {
      id: "nlp-dec-sa-hard-012",
      conceptId: "length-penalty-score-sa",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "short-answer",
      prompt: "Beam Search에서 문장 길이로 로그 확률 합을 나누어 짧은 문장 선호 편향을 보정하는 항목은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Length Penalty", "length penalty", "길이 페널티"],
      explanation: "Length Penalty 항목입니다[cite: 2, 3]."
    },
    {
      id: "nlp-dec-sa-hard-013",
      conceptId: "nucleus-sampling-sa",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "short-answer",
      prompt: "누적 확률 P를 기준으로 동적 후보군을 구성하는 Top-P Sampling의 다른 통칭 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Nucleus Sampling", "nucleus sampling", "누클리어스 샘플링"],
      explanation: "Nucleus Sampling (뉴클리어스 샘플링) 입니다[cite: 3]."
    },
    {
      id: "nlp-dec-es-hard-014",
      conceptId: "speculative-decoding-principle-essay",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "essay",
      prompt: "Speculative Decoding이 작은 드래프트 모델과 큰 타겟 모델을 활용해 어떻게 정확도를 유지하면서 추론 속도를 가속하는지 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["추측", "병렬 검증", "리젝션 샘플링", "분포 동일"],
      modelAnswer: "작고 빠른 Draft 모델이 여러 토큰을 먼저 빠르게 추측하고, 거대한 Target 모델이 이 토큰들을 한 번의 순방향 연산으로 병렬 검증한다. 리젝션 샘플링을 통해 검증을 통과한 토큰만 채택하므로 타겟 모델 단독 순차 생성 대비 속도가 대폭 향상되면서도 최종 출력 확률 분포는 타겟 모델과 완벽히 동일하게 유지된다[cite: 3].",
      rubricKeywords: ["작은 모델 추측 큰 모델 병렬 검증", "리젝션 샘플링을 통한 원본 분포 동일 보장"],
      minLength: 20,
      explanation: "작은 모델 추측 및 큰 모델 병렬 검증 원리와 리젝션 샘플링을 통한 원본 분포 동일 보장을 서술합니다[cite: 3]."
    },
    {
      id: "nlp-dec-es-hard-015",
      conceptId: "contrastive-search-degeneration-essay",
      difficulty: "hard",
      category: "디코딩 알고리즘",
      questionType: "essay",
      prompt: "Contrastive Search 디코딩이 기존 Sampling이나 Greedy 방식의 '텍스트 무한 반복(Degeneration)' 문제를 어떤 수학적 벌점(Penalty) 구조로 해결하는지 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["코사인 유사도", "페널티", "상투어", "반복"],
      modelAnswer: "기존 모델은 확률 높은 상투어나 문구를 반복하는 퇴화(Degeneration) 현상이 발생하기 쉽다. Contrastive Search는 현재 후보 토큰의 은닉 벡터와 이전에 생성된 은닉 벡터들 간의 최대 코사인 유사도에 페널티 계수를 곱해 점수를 차감함으로써, 의미 없이 반복되는 토큰이 선택되는 것을 원천적으로 억제한다[cite: 3].",
      rubricKeywords: ["이전 은닉 벡터와의 최대 코사인 유사도 페널티", "반복 텍스트 선택 억제"],
      minLength: 20,
      explanation: "이전 은닉 벡터들과의 코사인 유사도 페널티를 통한 반복 텍스트 선택 억제 원리를 서술합니다[cite: 3]."
    },

    // ==========================================
    // 9. 프롬프트 엔지니어링 (15문항)
    // ==========================================
    {
      id: "nlp-pe-mc-hard-001",
      conceptId: "cot-ablation-study-finding",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "Chain-of-Thought (CoT) 논문의 소거 실험(Ablation Study)에서 밝혀진 핵심 사실은?",
      options: [
        "중간 과정에 무작위 텍스트나 아무 기호나 채워 넣는 것은 성능 향상에 도움이 안 되며, 논리적이고 타당한 추론 계산 단계가 포함되어야만 성능이 향상된다.",
        "중간에 아무 무작위 단어나 채워 넣어도 CoT와 동일한 정답률 상승이 일어난다.",
        "CoT는 오직 1줄짜리 단답형 질문에서만 효과가 있다.",
        "예시 개수가 100개 이상일 때만 작동한다."
      ],
      answer: 0,
      explanation: "무작위 문자열 채우기는 효과가 없으며 올바른 논리적 추론 단계의 형성이 성능 향상의 본질임이 실험으로 입증되었습니다[cite: 3].",
      hint: "무작위 단어가 아닌 타당한 추론 계산 단계의 형성이 필수적입니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-hard-002",
      conceptId: "tree-of-thoughts-search-algorithm",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "Tree of Thoughts (ToT) 프레임워크가 프롬프트 기반 생각 노드를 평가하고 탐색할 때 조합하여 활용하는 탐색 알고리즘은?",
      options: [
        "너비 우선 탐색 (BFS) 또는 깊이 우선 탐색 (DFS) 기반 백트래킹",
        "Dijkstra 최단 경로 알고리즘만 전용 사용",
        "K-Means 군집화 탐색",
        "경사하강법 역전파"
      ],
      answer: 0,
      explanation: "ToT는 생각 노드들을 트리 구조로 펼치고 평가하면서 BFS/DFS 및 백트래킹 탐색을 적용해 난제를 해결합니다[cite: 3].",
      hint: "BFS나 DFS 및 백트래킹(Backtracking) 탐색 알고리즘을 사용합니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-hard-003",
      conceptId: "prompt-injection-system-vulnerability",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "LLM 시스템에서 시스템 프롬프트가 유저 입력이나 외부 검색 문서(RAG) 내에 숨겨진 악성 지시문에 의해 무력화되는 근본적 아키텍처 원인은?",
      options: [
        "트랜스포머는 시스템 지침과 유저/외부 입력을 분리된 격리 채널로 처리하지 않고 동일한 Context Window 내의 연속된 토큰 시퀀스로 어텐션 처리하기 때문에",
        "시스템 프롬프트의 글자 크기가 작아서",
        "GPU 가속기가 켜져 있어서",
        "토크나이저가 특수문자를 다 지워버리기 때문에"
      ],
      answer: 0,
      explanation: "시스템 지침과 사용자/외부 데이터가 동일한 컨텍스트 창 안에서 토큰 시퀀스로 합쳐져 입력되므로 주입 공격 취약성이 존재합니다[cite: 3].",
      hint: "동일한 Context Window 내의 연속된 토큰 시퀀스로 처리되기 때문입니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-hard-004",
      conceptId: "self-consistency-majority-voting",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "Self-Consistency 프롬프팅 기법이 CoT의 정확도를 극대화하기 위해 취하는 최종 정답 도출 방식은?",
      options: [
        "Sampling 디코딩으로 여러 개의 서로 다른 추론 경로를 생성한 뒤, 가장 빈도가 높게 도출된 최종 답을 다수결(Majority Voting)로 채택한다.",
        "확률이 가장 낮은 오답만 골라낸다.",
        "단 1개의 Greedy 경로만 신뢰한다.",
        "모든 추론 경로의 텍스트를 평균 내어 합친다."
      ],
      answer: 0,
      explanation: "여러 샘플링 추론 경로를 만들고 다수결 투표(Majority Voting)를 거쳐 가장 일관된 정답을 채택합니다[cite: 3].",
      hint: "다수결 투표(Majority Voting) 방식을 적용합니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-hard-005",
      conceptId: "prompt-chaining-pipeline",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "복잡한 대형 태스크를 여러 개의 작은 단위 프롬프트로 쪼개어 파이프라인 형태로 연결하는 프롬프트 체이닝(Prompt Chaining)의 이점은?",
      options: [
        "한 번에 처리하기 어려운 복잡한 논리 과정을 단계별 모듈로 나누어 각 단계의 정확도와 제어 가능성을 높임",
        "모델의 파라미터 개수를 10배로 늘려줌",
        "토큰 생성 속도를 100배 가속함",
        "API 호출 횟수를 무조건 1회로 단축함"
      ],
      answer: 0,
      explanation: "단계를 쪼개어 파이프라인으로 연결하면 복잡한 작업에서 오류를 줄이고 중간 결과 검증이 수월해집니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-hard-006",
      conceptId: "prefix-injection-jailbreak-mechanism",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "\"Start with 'Sure, I can help with that: '\" 처럼 응답 접두사(Prefix)를 강제 지정하는 프롬프트 공격이 통하는 원리는?",
      options: [
        "모델이 긍정 어조의 시작 토큰들을 먼저 출력하게 만듦으로써, 뒤따르는 토큰 생성 확률 분포가 긍정/수용 쪽으로 편향되어 거절 메커니즘이 우회되기 때문에",
        "모델의 전원 공급을 차단하기 때문에",
        "토크나이저를 마비시키기 때문에",
        "시스템 프롬프트를 영구 삭제하기 때문에"
      ],
      answer: 0,
      explanation: "시작 접두사를 강제하면 모델이 긍정 수용 토큰 흐름을 이어가게 되어 안전 거절 방어선이 쉽게 무너집니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-hard-007",
      conceptId: "few-shot-selection-impact",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "Few-shot 프롬프팅에서 훈련셋 예시들을 무작위로 고를 때와 유사도 높은 예시를 고를 때의 성능 비교 결과는?",
      options: [
        "유사한 예시들을 선택할 때가 무작위 선택보다 테스트 정확도가 통계적으로 유의하게 더 높다.",
        "무작위 선택이 항상 성능이 더 좋다.",
        "예시 선택 방식은 성능에 아무런 영향이 없다.",
        "무작위 선택 시 에러율이 0%가 된다."
      ],
      answer: 0,
      explanation: "관련성 높고 가까운 예시를 제공하는 것이 무작위 예시보다 모델의 태스크 적응도와 정확도를 크게 높여줍니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-hard-008",
      conceptId: "tot-backtracking-advantage",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "Tree of Thoughts (ToT)가 CoT에 비해 갖는 결정적 탐색 상의 우위는 무엇인가?",
      options: [
        "잘못된 생각 경로에 진입했을 때 이를 평가하고 되돌아가는 백트래킹(Backtracking)과 전역 탐색이 가능하다.",
        "토큰을 단 1개만 소모하여 매우 경제적이다.",
        "수학 공식 계산을 전혀 하지 않는다.",
        "단방향 일직선으로만 탐색한다."
      ],
      answer: 0,
      explanation: "ToT는 잘못된 경로를 포착해 되돌아가는 백트래킹(Backtracking)을 지원하므로 복잡한 탐색 문제에 유리합니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-hard-009",
      conceptId: "prompt-engineering-version-control",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "실무 환경에서 SKILL.md나 프롬프트 템플릿을 체계적으로 관리하고 수정 이력을 추적하기 위해 도입하는 표준 관행은?",
      options: [
        "프롬프트 버전 관리 및 Git 기반 형상 관리",
        "모든 프롬프트를 수기로 종이에 적어 보관",
        "프롬프트를 절대 수정하지 않고 고정",
        "랜덤하게 매번 새로 작성"
      ],
      answer: 0,
      explanation: "실무에서는 프롬프트와 스킬 문서를 Git 등으로 형상 관리하여 버전별 성능 변화를 추적합니다[cite: 3]."
    },
    {
      id: "nlp-pe-sa-hard-010",
      conceptId: "self-consistency-sa",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "short-answer",
      prompt: "다수의 추론 경로를 샘플링한 뒤 다수결 투표(Majority Voting)로 최종 정답을 결정하는 프롬프팅 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Self-Consistency", "self-consistency", "셀프 컨시스턴시"],
      explanation: "Self-Consistency 프롬프팅 기법입니다[cite: 3]."
    },
    {
      id: "nlp-pe-sa-hard-011",
      conceptId: "tree-of-thoughts-sa",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "short-answer",
      prompt: "생각 노드를 트리 형태로 확장하고 BFS/DFS 및 백트래킹 탐색을 수행하는 프롬프팅 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["ToT", "tot", "Tree of Thoughts"],
      explanation: "Tree of Thoughts (ToT) 프레임워크입니다[cite: 3]."
    },
    {
      id: "nlp-pe-sa-hard-012",
      conceptId: "prompt-chaining-sa",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "short-answer",
      prompt: "복잡한 요청을 작은 단위 프롬프트들의 파이프라인으로 연결하여 순차 실행하는 기법 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["프롬프트 체이닝", "Prompt Chaining", "prompt chaining"],
      explanation: "Prompt Chaining (프롬프트 체이닝) 입니다[cite: 3]."
    },
    {
      id: "nlp-pe-sa-hard-013",
      conceptId: "prefix-injection-sa",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "short-answer",
      prompt: "답변 시작 접두사(Prefix)를 강제 지정해 모델의 안전 거절 메커니즘을 뚫는 공격 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Prefix Injection", "prefix injection", "프리픽스 주입"],
      explanation: "Prefix Injection 공격입니다[cite: 3]."
    },
    {
      id: "nlp-pe-es-hard-014",
      conceptId: "tot-vs-cot-essay",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "essay",
      prompt: "Chain-of-Thought (CoT)와 비교하여 Tree of Thoughts (ToT)가 갖는 탐색 구조상의 발전된 특징과 백트래킹(Backtracking)의 이점을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["트리", "백트래킹", "다지 탐색", "일직선"],
      modelAnswer: "CoT는 단일 일직선 생각 연쇄로 추론을 수행하므로 중간에 틀리면 교정이 어렵다. 반면 ToT는 생각을 트리 노드로 분기시켜 다지 탐색을 수행하며, 평가를 통해 잘못된 경로를 조기에 포착해 되돌아가는 백트래킹(Backtracking)이 가능하므로 복잡한 탐색 문제에 훨씬 강력하다[cite: 3].",
      rubricKeywords: ["CoT 단일 일직선 연쇄", "ToT 트리 분기 다지 탐색 및 백트래킹"],
      minLength: 20,
      explanation: "CoT의 일직선 연쇄 한계와 ToT의 트리 분기 및 백트래킹을 통한 오류 교정 이점을 서술합니다[cite: 3]."
    },
    {
      id: "nlp-pe-es-hard-015",
      conceptId: "indirect-prompt-injection-essay",
      difficulty: "hard",
      category: "프롬프트 엔지니어링",
      questionType: "essay",
      prompt: "간접 프롬프트 주입(Indirect Prompt Injection) 공격의 정의를 설명하고, RAG 시스템 환경에서 왜 치명적인 보안 위협이 되는지 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["외부 문서", "악성 지시문", "하이재킹", "RAG"],
      modelAnswer: "간접 프롬프트 주입은 사용자가 직접 입력하는 대신, RAG가 웹이나 외부 문서에서 읽어온 데이터 안에 몰래 숨겨진 악성 지시문이 모델의 시스템 프롬프트를 덮어써 실행 제어권을 탈취(Hijacking)하는 공격이다. 신뢰할 수 없는 외부 데이터 소스가 LLM 입력과 병합될 때 발생하므로 방어가 매우 까다롭다[cite: 3].",
      rubricKeywords: ["외부 문서 내 숨겨진 악성 지시문", "시스템 프롬프트 덮어쓰기 제어권 탈취"],
      minLength: 20,
      explanation: "외부 문서 내 숨겨진 악성 지시문에 의한 RAG 시스템 제어권 탈취 위험성을 서술합니다[cite: 3]."
    },

    // ==========================================
    // 10. LLM 평가 및 응용 (15문항)
    // ==========================================
    {
      id: "nlp-eval-mc-hard-001",
      conceptId: "eval-pass-at-k-unbiased-estimator",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "HumanEval 코드 평가 시 pass@k 지표 계산에서 편향을 최소화하기 위해 $n$개 샘플($n \ge k$)을 뽑아 적용하는 불편 추정량(Unbiased Estimator) 공식은?",
      options: [
        "$\\text{pass}@k \approx 1 - \frac{\binom{n-c}{k}}{\binom{n}{k}}$ (단, $c$는 테스트를 통과한 샘플 수)",
        "$\\text{pass}@k = \frac{c}{n} \times k$",
        "$\\text{pass}@k = \frac{c}{k}$",
        "$\\text{pass}@k = 1 - \left(\frac{c}{n}\right)^k$"
      ],
      answer: 0,
      explanation: "높은 분산을 줄이기 위해 전체 $n$개 중 오답 $(n-c)$개에서 $k$개를 모두 뽑을 확률을 1에서 빼는 조합 공식 추정량을 사용합니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-hard-002",
      conceptId: "eval-data-contamination-leakage",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "LLM 평가 시 벤치마크 테스트셋이 사전 학습(Pre-training) 데이터에 몰래 포함되어 유출됨으로써 발생하는 치명적 왜곡 현상은?",
      options: [
        "데이터 오염 / 유출 (Data Contamination / Leakage)",
        "Hallucination (환각)",
        "Exposure Bias (노출 편향)",
        "Reward Hacking (보상 해킹)"
      ],
      answer: 0,
      explanation: "Data Contamination은 평가용 시험지가 사전 학습에 유출되어 실제 추론이 아닌 암기로 점수가 부풀려지는 현상입니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-hard-003",
      conceptId: "eval-gpqa-benchmark-difficulty",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "GPQA(Graduate-Level Google-Proof Q&A) 벤치마크가 기존 MMLU 등과 차별화되는 고난도 특성은?",
      options: [
        "생물학, 물리학 등 박사급(Graduate-level) 전문가들이 출제해 단순 인터넷 검색이나 암기로는 풀 수 없는 최고난도 과학 추론 문제임",
        "초등학생도 1초 만에 풀 수 있는 산술 문제 모음임",
        "이미지 픽셀 매칭 전용 벤치마크임",
        "오직 영어 철자 맞추기만 평가함"
      ],
      answer: 0,
      explanation: "GPQA는 박사급 전문가가 직접 출제하고 구글 검색으로도 답을 쉽게 찾지 못하도록 설계된 최고난도 과학 추론 벤치마크입니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-hard-004",
      conceptId: "eval-drop-benchmark-arithmetic",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "DROP(Discrete Reasoning Over Paragraphs) 벤치마크가 요구하는 핵심 인지 능력은?",
      options: [
        "복잡한 지문을 읽고 그 안에서 수치를 찾아 덧셈, 뺄셈, 카운팅 같은 이산적 수리/논리 연산을 수행해 정답 도출",
        "단순 객관식 문항의 보기 번호 맞추기",
        "파이썬 소스 코드 컴파일 속도 측정",
        "이미지 속 얼굴 인식"
      ],
      answer: 0,
      explanation: "DROP은 지문 기반 산술/수리 연산(Discrete Reasoning) 수행 능력을 정밀 측정하는 벤치마크입니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-hard-005",
      conceptId: "eval-truthful-qa-purpose",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "TruthfulQA 벤치마크가 LLM의 답변 성향을 평가하기 위해 집중적으로 측정하는 대상은?",
      options: [
        "사람들이 흔히 오해하는 미신, 음모론, 잘못된 통념에 대해 모델이 속아 넘어가지 않고 진실되고 정확하게 답변하는지 측정",
        "문서 요약문의 길이를 얼마나 짧게 줄이는지 측정",
        "프로그래밍 코드의 실행 속도 측정",
        "다국어 번역의 윈도우 크기 측정"
      ],
      answer: 0,
      explanation: "TruthfulQA는 인간의 널리 퍼진 오해와 미신에 대해 모델이 진실된(Truthful) 답변을 유지하는지 평가합니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-hard-006",
      conceptId: "rag-vector-db-hnsw-index",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "RAG 시스템의 대규모 벡터 검색을 밀리초 단위로 가속하기 위해 Vector DB에서 널리 활용하는 그래프 기반 ANN 인덱스 알고리즘은?",
      options: [
        "HNSW (Hierarchical Navigable Small World)",
        "B-Tree",
        "Red-Black Tree",
        "Inverted Index"
      ],
      answer: 0,
      explanation: "HNSW 알고리즘은 고차원 벡터 공간에서 최근접 이웃을 고속 탐색하는 계층적 그래프 인덱스 방식입니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-hard-007",
      conceptId: "eval-big-bench-hard-bbh",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "BIG-bench Hard(BBH) 서브셋이 기존 벤치마크와 구별되는 특징은?",
      options: [
        "기존 언어 모델들이 인간보다 성적이 낮았으며, 다단계 추론과 복잡한 논리가 필수적인 가장 까다로운 태스크들만 엄선함",
        "유치원생 수준의 상식 문제 모음임",
        "컴퓨터 그래픽 카드 벤치마크임",
        "스팸 메일 필터링 전용 데이터셋임"
      ],
      answer: 0,
      explanation: "BIG-bench Hard(BBH)는 당시 모델들이 정답을 맞추기 어려워했던 복잡한 다단계 추론 23개 태스크 모음입니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-hard-008",
      conceptId: "eval-rouge-l-lcs",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "ROUGE-L 지표가 단어들의 단순 n-gram 일치 외에 추가로 반영하는 텍스트 유사도 측정 요소는?",
      options: [
        "Longest Common Subsequence (LCS, 최장 공통 부분 수열) 기반의 문장 구조적 일치도",
        "단어의 알파벳 철자 개수 총합",
        "문장의 음성 톤 높낮이",
        "작성된 소요 시간"
      ],
      answer: 0,
      explanation: "ROUGE-L은 단어의 순서와 구조가 유지되는 최장 공통 부분 수열(LCS)을 찾아 요약문 유사도를 평가합니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-hard-009",
      conceptId: "eval-contamination-mitigation",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "데이터 오염(Contamination) 문제를 방지하거나 진단하기 위해 연구자들이 취하는 현대적 평가 검증 관행은?",
      options: [
        "사전 학습 데이터셋에서 벤치마크 테스트 문구를 해싱 기반으로 엄격히 필터링하거나, 주기적으로 신규 벤치마크(LiveBench 등)를 도입한다.",
        "벤치마크 점수를 무조건 100점으로 조작한다.",
        "평가 데이터셋을 인터넷에 전면 공개한다.",
        "모델의 파라미터를 0으로 초기화한다."
      ],
      answer: 0,
      explanation: "데이터 유출을 막고자 철저한 데이터 정제 필터링 및 동적 신규 벤치마크 도입이 필수 평가 관행입니다[cite: 3]."
    },
    {
      id: "nlp-eval-sa-hard-010",
      conceptId: "gpqa-sa",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "short-answer",
      prompt: "박사급 전문가들이 출제해 단순 검색으로는 풀 수 없는 최고난도 과학 추론 평가 벤치마크 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["GPQA", "gpqa"],
      explanation: "GPQA 벤치마크입니다[cite: 3]."
    },
    {
      id: "nlp-eval-sa-hard-011",
      conceptId: "drop-benchmark-sa",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "short-answer",
      prompt: "지문을 읽고 그 안에서 수치를 찾아 덧셈, 뺄셈 등 산술 연산을 수행해야 하는 벤치마크 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["DROP", "drop"],
      explanation: "DROP 벤치마크입니다[cite: 3]."
    },
    {
      id: "nlp-eval-sa-hard-012",
      conceptId: "hnsw-index-sa",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "short-answer",
      prompt: "Vector DB에서 대규모 최근접 이웃 검색 속도를 가속하기 위해 쓰는 그래프 기반 ANN 인덱스 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["HNSW", "hnsw"],
      explanation: "HNSW 인덱스 알고리즘입니다[cite: 3]."
    },
    {
      id: "nlp-eval-sa-hard-013",
      conceptId: "truthful-qa-sa",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "short-answer",
      prompt: "모델이 미신이나 음모론에 속지 않고 진실된 답변을 하는지 측정하는 벤치마크 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["TruthfulQA", "truthfulqa", "Truthful QA"],
      explanation: "TruthfulQA 벤치마크입니다[cite: 3]."
    },
    {
      id: "nlp-eval-es-hard-014",
      conceptId: "data-contamination-leakage-essay",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "essay",
      prompt: "LLM 평가 시 '데이터 오염(Data Contamination)'이 발생했을 때 나타나는 문제점과 이것이 모델 성능 평가에 미치는 왜곡을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["사전 학습", "유출", "암기", "왜곡"],
      modelAnswer: "데이터 오염은 평가용 벤치마크 테스트셋이 사전 학습 데이터에 유출되어 모델이 이미 문제를 '암기'한 상태가 되는 현상이다. 이로 인해 모델의 실제 미지의 문제 해결 능력(추론력)이 과대 포장되어 객관적이고 공정한 성능 평가가 심각하게 왜곡된다[cite: 3].",
      rubricKeywords: ["평가셋이 사전학습 데이터에 유출", "실제 추론력이 아닌 암기에 따른 성능 과대 포장(왜곡)"],
      minLength: 20,
      explanation: "사전학습 데이터 유출에 따른 정답 암기와 객관적 추론 능력 평가 왜곡을 서술합니다[cite: 3]."
    },
    {
      id: "nlp-eval-es-hard-015",
      conceptId: "gpqa-vs-mmlu-essay",
      difficulty: "hard",
      category: "LLM 평가 및 응용",
      questionType: "essay",
      prompt: "MMLU 벤치마크와 GPQA 벤치마크의 난이도 및 출제 주체 측면에서의 차이점을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["MMLU", "GPQA", "박사급", "전문가"],
      modelAnswer: "MMLU는 초급부터 대학교재 수준에 이르는 57개 학문 분야의 객관식 종합 지식 평가이다. 반면 GPQA는 생물학·물리학 등의 박사급(Graduate-level) 전문가들이 직접 출제하여, 단순 검색이나 기존 암기로는 풀 수 없는 최고난도 전문가 수준의 과학적 추론 검증에 초점을 둔다[cite: 3].",
      rubricKeywords: ["MMLU 대학 교재 수준 57개 분야", "GPQA 박사급 전문가 출제 최고난도 과학 추론"],
      minLength: 20,
      explanation: "MMLU의 대학교재 수준 57개 분야 평가와 GPQA의 박사급 전문가 출제 최고난도 과학 추론 차이를 서술합니다[cite: 3]."
    }
  ]
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
