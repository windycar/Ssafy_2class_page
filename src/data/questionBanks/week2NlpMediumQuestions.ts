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
    // 1. 워드 임베딩 (15문항)
    // ==========================================
    {
      id: "nlp-emb-mc-med-001",
      conceptId: "word2vec-arch-compare",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec의 두 알고리즘인 CBOW와 Skip-gram의 구조적 차이에 대한 설명으로 가장 옳은 것은?",
      options: [
        "CBOW는 여러 주변 단어 벡터의 합/평균으로 중심 단어를 예측하고, Skip-gram은 중심 단어로 여러 주변 단어를 예측한다.",
        "CBOW는 중심 단어로 주변 단어를 예측하고, Skip-gram은 주변 단어들로 중심 단어를 예측한다.",
        "CBOW는 활성화 함수로 ReLU를 쓰고, Skip-gram은 Sigmoid만 사용한다.",
        "CBOW는 은닉층이 없고, Skip-gram은 은닉층이 2개 존재한다."
      ],
      answer: 0,
      explanation: "CBOW는 문맥 단어들의 집합을 투영층에서 합산해 중심 단어를 맞추고, Skip-gram은 중심 단어에서 주변 단어 각각의 조건부 확률을 예측합니다[cite: 2].",
      hint: "어느 방향으로 입력과 출력이 설정되는지 생각해보세요[cite: 2]."
    },
    {
      id: "nlp-emb-mc-med-002",
      conceptId: "word2vec-projection-layer",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec 신경망 아키텍처의 투영층(Projection Layer)이 가진 주요 특징은 무엇인가?",
      options: [
        "비선형 활성화 함수가 존재하지 않는 선형 변환 층이다.",
        "Sigmoid 활성화 함수가 반드시 적용된다.",
        "Softmax 연산을 수행하는 출력층이다.",
        "입력 원-핫 벡터와 곱해질 때 항상 0을 반환한다."
      ],
      answer: 0,
      explanation: "Word2Vec의 투영층은 활성화 함수 없이 가중치 행렬과 원-핫 벡터의 곱(Lookup)만 수행하는 선형 층입니다[cite: 2].",
      hint: "일반 딥러닝 은닉층과 달리 비선형 활성화 함수가 없습니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-med-003",
      conceptId: "word2vec-vector-arithmetic",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec 임베딩 공간에서 'vec(King) - vec(Man) + vec(Woman)' 연산을 수행했을 때 가장 가까운 벡터는?",
      options: ["vec(Queen)", "vec(Apple)", "vec(Boy)", "vec(Prince)"],
      answer: 0,
      explanation: "Word2Vec으로 학습된 분산 표현은 단어 간의 의미적/문법적 관계가 벡터 선형 연산으로 유지되는 특징을 가집니다[cite: 2].",
      hint: "왕(King)에서 남자(Man) 성별을 빼고 여자(Woman) 성별을 더한 단어입니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-med-004",
      conceptId: "word2vec-rare-words",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "코퍼스 내에서 출현 빈도가 낮은 희귀 단어(Rare words)나 드문 구 표현 학습에 상대적으로 더 유용한 알고리즘은?",
      options: ["Skip-gram", "CBOW", "N-gram", "One-hot Encoding"],
      answer: 0,
      explanation: "Skip-gram은 한 중심 단어로 여러 주변 단어와의 관계를 학습하므로 희귀 단어 표현을 포착하는 데 강합니다[cite: 2].",
      hint: "희귀 단어 표현에 강점을 가진 Word2Vec 알고리즘입니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-med-005",
      conceptId: "cbow-loss-function",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "CBOW 모델 학습 시 가중치 업데이트를 위해 사용하는 손실 함수(Loss)의 기준은?",
      options: [
        "예측한 중심 단어의 Softmax 확률 분포와 실제 정답 중심 단어의 원-핫 벡터 간 Cross-Entropy",
        "주변 단어들과의 평균 제곱 오차 (MSE)",
        "단어 알파벳 길이의 차이",
        "문장 전체 단어 개수"
      ],
      answer: 0,
      explanation: "CBOW는 주변 단어들로 예측한 중심 단어 확률 분포와 정답 중심 단어 간 Cross-Entropy 손실을 최소화합니다[cite: 2].",
      hint: "다중 클래스 분류 형태의 Cross-Entropy 손실을 사용합니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-med-006",
      conceptId: "fasttext-concept",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "FastText가 Word2Vec의 OOV(Out-of-Vocabulary) 문제를 해결할 수 있는 근본적 원리는?",
      options: [
        "단어를 내부 문자 n-gram 서브워드 단위로 쪼개어 임베딩의 합으로 단어를 표현하기 때문",
        "단어 사전을 100배로 크게 만들었기 때문",
        "트랜스포머 레이어를 도입했기 때문",
        "모든 단어를 숫자로 정규화했기 때문"
      ],
      answer: 0,
      explanation: "FastText는 단어 내부의 문자 n-gram 서브워드들을 학습하므로 사전에 없는 단어도 n-gram의 합으로 임베딩을 만들어냅니다[cite: 2].",
      hint: "단어를 더 작은 문자 단위 서브워드로 쪼개어 학습합니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-med-007",
      conceptId: "glove-concept",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "GloVe(Global Vectors) 임베딩 방식이 사용하는 핵심 학습 원리는?",
      options: [
        "전체 코퍼스의 단어 동시 등장 행렬(Co-occurrence Matrix) 통계를 기반으로 한 가중 회귀 학습",
        "순환 신경망(RNN)을 통한 문장 자동 생성",
        "단어 길이 기반의 무작위 벡터 할당",
        "이진 트리 구조를 이용한 계층적 소프트맥스"
      ],
      answer: 0,
      explanation: "GloVe는 전체 코퍼스의 단어 동시 등장 행렬 통계 수치를 벡터 내적으로 모델링하는 가중 회귀 방식을 씁니다[cite: 2].",
      hint: "전체 카운트 통계 기반의 동시 등장 행렬(Co-occurrence)을 활용합니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-med-008",
      conceptId: "word2vec-negative-sampling-why",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec 학습 시 전체 단어 사전에 대해 Softmax를 계산하는 막대한 연산량을 축소하기 위해 사용하는 기법은?",
      options: ["Negative Sampling", "Full Softmax", "Grid Search", "Layer Normalization"],
      answer: 0,
      explanation: "Negative Sampling은 전체 단어 대신 정답 단어와 몇 개의 무작위 오답(Negative) 단어만 추출해 이진 분류로 근사 학습합니다[cite: 2].",
      hint: "오답(Negative) 단어 몇 개만 샘플링하여 연산을 대폭 줄입니다[cite: 2]."
    },
    {
      id: "nlp-emb-mc-med-009",
      conceptId: "cbow-projection-sum",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "CBOW 모델의 투영층에서 주변 단어 벡터들이 모인 후 일어나는 연산은?",
      options: ["벡터들의 합(Sum) 또는 평균(Average)", "행렬식 연산", "벡터 차의 계산", "모든 원소를 0으로 초기화"],
      answer: 0,
      explanation: "CBOW의 투영층에서는 입력된 문맥 단어 임베딩 벡터들을 모두 더하거나(Sum) 평균 내어 하나의 문맥 벡터를 만듭니다[cite: 2].",
      hint: "주변 단어 벡터들을 하나로 합치거나 평균을 냅니다[cite: 2]."
    },
    {
      id: "nlp-emb-sa-med-010",
      conceptId: "negative-sampling-sa",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "short-answer",
      prompt: "Word2Vec에서 전체 어휘에 대한 Softmax 계산을 몇 개의 오답 단어 추출 이진 분류로 근사하는 연산 경량화 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Negative Sampling", "negative sampling", "네거티브 샘플링", "Negative sampling"],
      explanation: "Negative Sampling 연산 경량화 기법입니다[cite: 2].",
      hint: "Negative 단어가 들어가는 영문 기법 명칭입니다[cite: 2]."
    },
    {
      id: "nlp-emb-sa-med-011",
      conceptId: "subword-sa",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "short-answer",
      prompt: "FastText에서 OOV 단어를 처리하기 위해 단어를 더 작은 문자 n-gram 단위로 쪼개어 학습하는 단위를 무엇이라 하는가?",
      options: [],
      answer: null,
      acceptedAnswers: ["서브워드", "Subword", "subword", "서브워드 단위"],
      explanation: "단어의 하위 단위인 서브워드(Subword) 개념입니다[cite: 2].",
      hint: "단어(Word)의 하위(Sub) 단위라는 뜻입니다[cite: 2]."
    },
    {
      id: "nlp-emb-sa-med-012",
      conceptId: "co-occurrence-matrix-sa",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "short-answer",
      prompt: "GloVe에서 전체 코퍼스의 단어들이 특정 윈도우 내에서 함께 등장한 횟수를 기록한 행렬의 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["동시 등장 행렬", "동시등장행렬", "Co-occurrence Matrix", "co-occurrence matrix"],
      explanation: "Co-occurrence Matrix(동시 등장 행렬) 입니다[cite: 2].",
      hint: "단어들이 '동시 등장'한 횟수를 집계한 행렬입니다[cite: 2]."
    },
    {
      id: "nlp-emb-sa-med-013",
      conceptId: "word2vec-lookup-table-sa",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "short-answer",
      prompt: "Word2Vec 투영층에서 입력 원-핫 벡터와 가중치 행렬 $W$의 곱셈 연산이 실제로는 가중치 행의 특정 위치 값을 가져오는 동작과 같음을 뜻하는 용어는?",
      options: [],
      answer: null,
      acceptedAnswers: ["룩업 테이블", "Lookup Table", "lookup table", "Lookup"],
      explanation: "원-핫 벡터의 1이 위치한 인덱스의 가중치 행을 그대로 참조해 오는 Lookup 연산입니다[cite: 2].",
      hint: "테이블에서 찾아온다(Lookup)는 의미입니다[cite: 2]."
    },
    {
      id: "nlp-emb-es-med-014",
      conceptId: "cbow-vs-skipgram-detail-essay",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "essay",
      prompt: "Word2Vec의 CBOW와 Skip-gram 중 학습 속도와 희귀 단어 표현 성능 면에서 각각 어느 모델이 더 우수한지 이유와 함께 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["CBOW", "Skip-gram", "속도", "희귀"],
      modelAnswer: "CBOW는 주변 단어들을 합쳐 1개의 타겟 단어를 예측하므로 학습 속도가 빠르다. 반면 Skip-gram은 중심 단어 1개로 주변 여러 단어를 각각 예측하므로 학습 기회가 많아 희귀 단어나 드문 표현을 더 잘 포착한다[cite: 2].",
      rubricKeywords: ["CBOW 속도 빠름", "Skip-gram 희귀 단어"],
      minLength: 20,
      explanation: "CBOW의 속도 이점과 Skip-gram의 희귀 단어 포착 이점을 비교 서술합니다[cite: 2].",
      hint: "CBOW의 학습 속도 우위와 Skip-gram의 희귀 단어 표현 우위를 설명하세요[cite: 2]."
    },
    {
      id: "nlp-emb-es-med-015",
      conceptId: "fasttext-oov-resolution-essay",
      difficulty: "medium",
      category: "워드 임베딩",
      questionType: "essay",
      prompt: "FastText가 Word2Vec과 달리 사전에 없는 단어(OOV)의 임베딩을 만들어낼 수 있는 원리를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["서브워드", "n-gram", "조합", "합"],
      modelAnswer: "FastText는 단어를 독립된 기호로 보지 않고 내부 문자 n-gram 서브워드들로 분할하여 학습한다. 따라서 사전에 없는 단어가 들어와도 구성 문자 n-gram들의 임베딩 벡터를 더하여 의미 있는 벡터를 생성한다[cite: 2].",
      rubricKeywords: ["문자 n-gram 서브워드", "임베딩 합산"],
      minLength: 20,
      explanation: "FastText의 문자 n-gram 서브워드 분할 및 벡터 합산 원리를 서술합니다[cite: 2].",
      hint: "단어를 쪼개는 문자 n-gram 서브워드 개념을 기술하세요[cite: 2]."
    },

    // ==========================================
    // 2. 순차 데이터 & RNN (15문항)
    // ==========================================
    {
      id: "nlp-rnn-mc-med-001",
      conceptId: "rnn-hidden-formula-meaning",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "RNN 은닉 상태 수식 $h_t = \\tanh(W_{hh}h_{t-1} + W_{xh}x_t + b_h)$ 에 대한 해석으로 가장 바른 것은?",
      options: [
        "이전 은닉 상태 $h_{t-1}$과 현재 입력 $x_t$가 각각의 가중치와 곱해져 합쳐진 후 $\\tanh$ 비선형 변환된다.",
        "현재 입력 $x_t$만 사용되고 이전 은닉 상태 $h_{t-1}$은 무시된다.",
        "가중치 $W_{hh}$는 타임스텝 $t$마다 새로운 무작위 값으로 변경된다.",
        "출력값 $h_t$는 0보다 작은 음수가 될 수 없다."
      ],
      answer: 0,
      explanation: "현재 입력 $x_t$와 이전 기억 $h_{t-1}$이 선형 결합 후 $\\tanh$를 통해 현재 은닉 상태 $h_t$로 결합됩니다[cite: 2].",
      hint: "이전 상태 $h_{t-1}$과 현재 입력 $x_t$가 결합하는 과정입니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-med-002",
      conceptId: "rnn-unfolding-concept",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "RNN 구조를 시간 축에 따라 펼쳤을 때(Unfolding) 나타나는 시각적/구조적 특징은?",
      options: [
        "각 층이 하나의 시점(Time step)을 나타내는 깊은 신경망 구조 형태가 된다.",
        "모든 은닉 노드가 사라지고 단층 선형 모델이 된다.",
        "입력 시퀀스의 길이가 1로 고정된다.",
        "가중치 공유 성질이 소멸된다."
      ],
      answer: 0,
      explanation: "시간 축으로 펼치면 시점마다 입력과 은닉상태가 순차 연결된 깊은 신경망 모양이 됩니다[cite: 2].",
      hint: "시점(Time step)마다 층이 펼쳐진 깊은 신경망 모양입니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-med-003",
      conceptId: "rnn-bptt-concept",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "펼쳐진 RNN 구조에서 시간 축을 거슬러 올라가며 전체 시점에 대해 오차 역전파를 수행하는 학습 알고리즘은?",
      options: ["BPTT (Backpropagation Through Time)", "CNN", "K-Means", "PCA"],
      answer: 0,
      explanation: "Backpropagation Through Time(BPTT)은 시간을 거슬러 오차 경사도를 역전파합니다[cite: 2].",
      hint: "시간을 통과하는 역전파(Backpropagation Through Time)입니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-med-004",
      conceptId: "rnn-vanishing-cause",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "RNN의 BPTT 진행 시 기울기 소실(Vanishing Gradient)이 발생하는 주요 수학적 원인은?",
      options: [
        "역전파 체인 룰(Chain Rule) 과정에서 1보다 작은 미분값과 가중치 행렬이 시점 수만큼 반복 곱해지기 때문",
        "가중치 값이 무한대로 급격히 커지기 때문",
        "활성화 함수 $\\tanh$의 미분 최댓값이 100을 넘기 때문",
        "시간 $t$가 지날수록 입력 차원이 늘어나기 때문"
      ],
      answer: 0,
      explanation: "BPTT 시 1 이하의 $\\tanh'$ 미분값과 가중치 $W_{hh}^T$가 시점 수만큼 반복 곱해지면서 오차가 사라집니다[cite: 2].",
      hint: "역전파 체인 룰 연산 과정에서의 연속 곱하기 때문입니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-med-005",
      conceptId: "rnn-gradient-clipping",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "RNN 학습 중 기울기 값이 너무 커져 발산하는 '기울기 폭발(Gradient Explosion)'을 방지하는 기법은?",
      options: ["Gradient Clipping (기울기 클리핑)", "Dropout", "Min-Max Scaling", "Label Encoding"],
      answer: 0,
      explanation: "Gradient Clipping은 기울기가 설정 임계값을 넘을 때 크기를 임계값으로 잘라내어 폭발을 차단합니다[cite: 2].",
      hint: "기울기의 크기를 임계값으로 잘라냅니다(Clipping)[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-med-006",
      conceptId: "rnn-many-to-many-synced-vs-unsynced",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "RNN Many-to-Many 구조 중 '품사 태깅(POS Tagging)'처럼 입력 스텝마다 즉시 출력이 1:1로 매핑되는 특징은?",
      options: [
        "입력과 출력의 타임스텝 동기화(Synced)",
        "인코딩 완료 후 뒤늦은 출력 시작",
        "단일 입력에서 퍼져나감",
        "단일 출력으로만 모임"
      ],
      answer: 0,
      explanation: "품사 태깅이나 프레임 라벨링은 입력 스텝마다 출력이 1:1 동기화(Synced)되어 발생합니다[cite: 2].",
      hint: "입력과 출력이 시점별로 1:1 연결(Synced)되어 있습니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-med-007",
      conceptId: "bilstm-concept",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "양방향 순환 신경망(Bi-directional RNN/LSTM)이 문맥 파악에 우수한 이유는?",
      options: [
        "순방향(Left-to-Right)과 역방향(Right-to-Left) 신경망을 모두 구동하여 앞뒤 문맥을 동시에 파악하므로",
        "학습 파라미터 개수가 절반으로 줄어들기 때문에",
        "시간 축 연산을 완전히 없애주기 때문에",
        "미래 토큰 생성을 전문으로 처리하기 때문에"
      ],
      answer: 0,
      explanation: "Bi-RNN은 문장의 과거(왼쪽) 및 미래(오른쪽) 문맥 정보를 양방향으로 연결해 반영합니다[cite: 2].",
      hint: "왼쪽에서 오른쪽, 오른쪽에서 왼쪽 양방향을 모두 봅니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-med-008",
      conceptId: "rnn-hidden-size-hyperparameter",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "RNN 계열 아키텍처에서 은닉 상태 벡터의 차원 크기(Hidden size)는 어떻게 결정되는가?",
      options: [
        "모델을 설계하는 개발자가 설정하는 하이퍼파라미터이다.",
        "입력 문장의 단어 개수에 의해 자동으로 결정된다.",
        "단어 사전 전체의 크기와 무조건 동일하다.",
        "배치 크기(Batch size)와 무조건 일치한다."
      ],
      answer: 0,
      explanation: "Hidden size(예: 128, 256, 512)는 모델 설계자가 자유롭게 정하는 하이퍼파라미터입니다[cite: 2].",
      hint: "개발자가 직접 부여하는 하이퍼파라미터입니다[cite: 2]."
    },
    {
      id: "nlp-rnn-mc-med-009",
      conceptId: "truncated-bptt-concept",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "multiple-choice",
      prompt: "매우 긴 시퀀스 학습 시 연산량 과다와 기울기 소실을 막기 위해 역전파 길이를 일정 잘린 타임스텝 단위로 제한하는 기법은?",
      options: ["Truncated BPTT", "Full BPTT", "Gradient Accumulation", "Early Stopping"],
      answer: 0,
      explanation: "Truncated BPTT는 순방향 전개는 유지하되 역전파 경사 계산은 일정 깊이에서 잘라 연산합니다[cite: 2].",
      hint: "BPTT 경사 계산 구간을 자릅니다(Truncated)[cite: 2]."
    },
    {
      id: "nlp-rnn-sa-med-010",
      conceptId: "bptt-sa",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "short-answer",
      prompt: "펼쳐진 RNN 구조에서 시간 축을 따라 역전파를 수행하는 학습 알고리즘의 약자를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["BPTT", "bptt"],
      explanation: "Backpropagation Through Time(BPTT) 입니다[cite: 2].",
      hint: "BPTT 4글자 약자입니다[cite: 2]."
    },
    {
      id: "nlp-rnn-sa-med-011",
      conceptId: "gradient-clipping-sa",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "short-answer",
      prompt: "RNN 학습 도중 기울기 크기가 과도하게 커지는 기울기 폭발을 막고자 임계값으로 잘라내는 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Gradient Clipping", "gradient clipping", "기울기 클리핑", "Gradient clipping"],
      explanation: "Gradient Clipping 기법입니다[cite: 2].",
      hint: "Gradient 뒤에 Clipping이 붙습니다[cite: 2]."
    },
    {
      id: "nlp-rnn-sa-med-012",
      conceptId: "bi-directional-rnn-sa",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "short-answer",
      prompt: "순방향과 역방향의 순환 신경망을 결합하여 시점 t의 앞뒤 문맥을 동시에 참조하게 한 RNN은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Bi-RNN", "Bi-directional RNN", "양방향 RNN", "BiRNN"],
      explanation: "양방향(Bi-directional) RNN 구조입니다[cite: 2].",
      hint: "'양방향' 또는 'Bi-' 표현이 포함됩니다[cite: 2]."
    },
    {
      id: "nlp-rnn-sa-med-013",
      conceptId: "chain-rule-sa",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "short-answer",
      prompt: "BPTT 역전파 미분 시 시점 $t$에서 과거 시점까지 미분값을 연속 곱하여 계산할 때 쓰이는 수학 법칙은?",
      options: [],
      answer: null,
      acceptedAnswers: ["연쇄 법칙", "연쇄법칙", "Chain Rule", "chain rule"],
      explanation: "합성함수 미분을 이어나가는 연쇄 법칙(Chain Rule)입니다[cite: 2].",
      hint: "미분을 사슬처럼 엮어 곱하는 법칙입니다[cite: 2]."
    },
    {
      id: "nlp-rnn-es-med-014",
      conceptId: "bptt-vanishing-math-essay",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "essay",
      prompt: "RNN 학습 시 BPTT 과정에서 '기울기 소실'이 수학적으로 발생하는 원인을 연쇄 법칙 곱셈 관점에서 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["연쇄 법칙", "미분값", "반복 곱", "0"],
      modelAnswer: "BPTT 역전파 진행 시 연쇄 법칙(Chain Rule)에 의해 시간 축을 따라 이전 시점들로 미분값이 연속 곱해진다. 이때 $\\tanh$ 활성화 함수의 미분값($\\le 1$)과 가중치 행렬이 반복 곱해지면서 기울기가 지수적으로 감소해 0에 수렴하기 때문이다[cite: 2].",
      rubricKeywords: ["연쇄 법칙", "1 이하 미분값", "지수적 감소(0 수렴)"],
      minLength: 20,
      explanation: "체인 룰 연쇄 곱에 의해 미분값이 감소하여 0으로 수렴하는 원리를 서술합니다[cite: 2].",
      hint: "연쇄 법칙에 따른 연속 곱셈이 미분값에 미치는 영향을 기술하세요[cite: 2]."
    },
    {
      id: "nlp-rnn-es-med-015",
      conceptId: "gradient-clipping-essay",
      difficulty: "medium",
      category: "순차 데이터 & RNN",
      questionType: "essay",
      prompt: "RNN의 '기울기 폭발(Gradient Explosion)' 현상이 무엇인지 설명하고, Gradient Clipping의 동작 원리를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["발산", "임계값", "크기"],
      modelAnswer: "기울기 폭발은 역전파 시 기울기 값이 가중치 곱에 의해 극도로 커져 발산하는 현상이다. Gradient Clipping은 기울기 벡터의 크기가 설정한 임계값(Threshold)을 초과할 때 방향은 유지한 채 크기를 임계값 이하로 잘라내어 발산을 막는다[cite: 2].",
      rubricKeywords: ["기울기 발산", "임계값 초과 시", "방향 유지 크기 감소"],
      minLength: 20,
      explanation: "기울기 발산 정의와 임계값 기반 스케일링 조절 원리를 서술합니다[cite: 2].",
      hint: "임계값을 넘었을 때 크기를 잘라내는 방식을 기술하세요[cite: 2]."
    },

    // ==========================================
    // 3. LSTM & 순환 모델 (15문항)
    // ==========================================
    {
      id: "nlp-lstm-mc-med-001",
      conceptId: "lstm-cell-state-formula",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "LSTM에서 현재 시점 세포 상태 $C_t$가 업데이트되는 수식 $C_t = f_t * C_{t-1} + i_t * \\tilde{C}_t$ 의 의미는?",
      options: [
        "이전 $C_{t-1}$에서 잊을 정보 비율($f_t$)을 곱하고, 새 후보 $\\tilde{C}_t$에서 저장할 비율($i_t$)을 곱해 더한다.",
        "이전 $C_{t-1}$과 새 후보 $\\tilde{C}_t$를 단순히 뺀다.",
        "게이트 값에 관계없이 무조건 새 정보만 남긴다.",
        "모든 게이트 수치를 곱하여 세포 상태를 결정한다."
      ],
      answer: 0,
      explanation: "Forget gate의 보존 비율과 Input gate의 기록 비율을 각각 요소별 곱셈(Element-wise product) 후 더합니다[cite: 2].",
      hint: "$f_t$와 $i_t$ 게이트가 각각 어떤 비율을 보정하는지 확인하세요[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-med-002",
      conceptId: "lstm-forget-gate-value-meaning",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "LSTM Forget gate $f_t = \\sigma(W_f \\cdot [h_{t-1}, x_t] + b_f)$ 의 출력 벡터 원소가 0일 때의 의미는?",
      options: [
        "이전 세포 상태 $C_{t-1}$의 해당 위치 정보를 완벽히 지우고 삭제한다.",
        "이전 세포 상태 $C_{t-1}$의 해당 정보를 100% 온전히 보존한다.",
        "현재 입력 $x_t$를 100% 저장한다.",
        "현재 출력을 1로 보정한다."
      ],
      answer: 0,
      explanation: "$f_t = 0$ 이면 $f_t * C_{t-1} = 0$이 되므로 이전 세포 상태 정보를 삭제합니다[cite: 2].",
      hint: "0을 곱하면 이전 세포 상태 값이 지워집니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-med-003",
      conceptId: "lstm-output-hidden-formula",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "LSTM에서 최종 $h_t$를 생성하는 수식 $h_t = o_t * \\tanh(C_t)$ 의 역할에 대한 설명은?",
      options: [
        "업데이트된 세포 상태 $C_t$를 $\\tanh$로 -1~1 압축한 후, Output gate $o_t$ 비율만큼 내보낸다.",
        "세포 상태 $C_t$를 무조건 0으로 초기화한다.",
        "Output gate $o_t$와 상관없이 $C_t$를 그대로 출력한다.",
        "Forget gate와 Input gate를 곱해준다."
      ],
      answer: 0,
      explanation: "세포 상태 $C_t$를 $\\tanh$로 스케일링한 후 $o_t$ 스위치 비율을 곱해 $h_t$를 만듭니다[cite: 2].",
      hint: "$C_t$ 스케일링과 $o_t$ 비율 곱셈입니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-med-004",
      conceptId: "gru-vs-lstm-architecture",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "GRU가 LSTM 대비 가지는 아키텍처적 차이점으로 옳은 것은?",
      options: [
        "Cell state와 Hidden state를 하나로 통합하고, 게이트를 Reset gate와 Update gate 2개로 줄였다.",
        "게이트 수를 4개로 확대했다.",
        "Hidden state를 없애고 Cell state만 사용한다.",
        "Sigmoid 함수 대신 ReLU만 사용한다."
      ],
      answer: 0,
      explanation: "GRU는 Cell state를 $h_t$에 합치고 게이트를 2개로 단순화한 경량 구조입니다[cite: 2].",
      hint: "상태를 1개로 통합하고 게이트를 2개로 단축했습니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-med-005",
      conceptId: "gru-update-gate-role",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "GRU의 Update gate ($z_t$)가 담당하는 역할은 무엇인가?",
      options: [
        "이전 은닉 상태의 정보를 얼마나 유지하고, 새 은닉 상태 후보를 얼마나 반영할지 균형을 제어한다.",
        "이전 정보를 무조건 100% 삭제한다.",
        "입력 데이터의 차원을 확장한다.",
        "Softmax 확률값을 계산한다."
      ],
      answer: 0,
      explanation: "Update gate $z_t$는 LSTM의 Forget gate와 Input gate 역할을 하나로 합친 혼합 제어를 수행합니다[cite: 2].",
      hint: "이전 기억 유지와 새 기억 반영의 밸런스를 조절합니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-med-006",
      conceptId: "gru-reset-gate-role",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "GRU의 Reset gate ($r_t$)가 담당하는 역할은 무엇인가?",
      options: [
        "새로운 은닉 상태 후보를 계산할 때 이전 은닉 상태 정보를 얼마나 무시/리셋할지 결정한다.",
        "학습 가중치를 0으로 리셋한다.",
        "출력층을 비활성화한다.",
        "시퀀스 길이를 0으로 만든다."
      ],
      answer: 0,
      explanation: "Reset gate $r_t$는 새 정보 후보 $\\tilde{h}_t$ 연산 시 과거 $h_{t-1}$을 얼마만큼 조합에 넣을지 제어합니다[cite: 2].",
      hint: "새 후보 연산 시 과거 정보를 얼마만큼 리셋(Reset)할지 결정합니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-med-007",
      conceptId: "lstm-candidate-cell-formula",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "LSTM에서 새롭게 세포 상태에 더해질 후보 정보 수식 $\\tilde{C}_t = \\tanh(W_C \\cdot [h_{t-1}, x_t] + b_C)$ 의 특징은?",
      options: [
        "$\\tanh$ 함수를 통해 -1과 1 사이의 값으로 구성된 새로운 정보 후보군을 만든다.",
        "Sigmoid 함수를 통해 0과 1 사이의 값을 만든다.",
        "항상 양수 값만 갖는다.",
        "이전 $C_{t-1}$ 값이 직접 더해져 있다."
      ],
      answer: 0,
      explanation: "새로운 정보 내용 후보 $\\tilde{C}_t$는 $\\tanh$를 통해 -1~1 범위로 정규화되어 생성됩니다[cite: 2].",
      hint: "새 정보 후보는 $\\tanh$를 통해 -1~1 값으로 형성됩니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-med-008",
      conceptId: "lstm-bias-initialization-trick",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "LSTM 학습 초기 단계에 과거 기억 소실을 방지하기 위해 적용하는 편향 초기화 팁은?",
      options: [
        "Forget gate의 편향 $b_f$를 1.0 등 양수로 설정하여 초기 정보 보존율을 높인다.",
        "Forget gate 편향을 -10.0으로 설정한다.",
        "모든 편향을 0으로 설정한다.",
        "Input gate 편향만 0으로 만든다."
      ],
      answer: 0,
      explanation: "$b_f$를 1~2 정도로 크게 초기화하면 $\\sigma(b_f) \\approx 1$이 되어 초기에 과거 기억을 잊지 않고 보존합니다[cite: 2].",
      hint: "Forget gate의 초기 출력값을 1 근처로 만들기 위한 양수 설정입니다[cite: 2]."
    },
    {
      id: "nlp-lstm-mc-med-009",
      conceptId: "bilstm-application",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "multiple-choice",
      prompt: "Bi-LSTM(양방향 LSTM)이 개방형 문장 생성(Generation)보다 개체명 인식(NER)이나 문장 분류에 더 적합한 이유는?",
      options: [
        "개체명 인식은 문장 전체의 양방향(앞뒤) 문맥을 모두 참조해야 정확하지만, 순차 생성 시에는 미래 단어를 미리 알 수 없기 때문",
        "Bi-LSTM은 생성 모델 전용이기 때문",
        "Bi-LSTM은 단어 사전을 안 쓰기 때문",
        "속도가 단방향보다 100배 빠르기 때문"
      ],
      answer: 0,
      explanation: "Bi-LSTM은 미래 단어를 참조하므로 전체가 주어진 상태의 분석/분류 태스크에 적합하고 실시간 생성에는 부적합합니다[cite: 2].",
      hint: "문장 전체의 앞뒤 문맥이 동시에 주어진 상황에 적합합니다[cite: 2]."
    },
    {
      id: "nlp-lstm-sa-med-010",
      conceptId: "gru-sa",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "short-answer",
      prompt: "LSTM의 구조를 개선하여 Cell state를 은닉 상태에 통합하고 2개의 게이트로 단순화한 모델의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["GRU", "gru"],
      explanation: "Gated Recurrent Unit(GRU) 입니다[cite: 2].",
      hint: "G_U 형태의 3글자 약자입니다[cite: 2]."
    },
    {
      id: "nlp-lstm-sa-med-011",
      conceptId: "update-gate-sa",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "short-answer",
      prompt: "GRU에서 이전 기억의 유지 비율과 새 기억의 반영 비율을 종합 제어하는 게이트의 영문 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Update gate", "update gate", "업데이트 게이트", "Update Gate"],
      explanation: "Update gate ($z_t$) 입니다[cite: 2].",
      hint: "Update 단어가 들어갑니다[cite: 2]."
    },
    {
      id: "nlp-lstm-sa-med-012",
      conceptId: "reset-gate-sa",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "short-answer",
      prompt: "GRU에서 새 은닉 상태 후보를 연산할 때 과거 정보를 얼마나 무시할지 결정하는 게이트의 영문 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Reset gate", "reset gate", "리셋 게이트", "Reset Gate"],
      explanation: "Reset gate ($r_t$) 입니다[cite: 2].",
      hint: "Reset 단어가 들어갑니다[cite: 2]."
    },
    {
      id: "nlp-lstm-sa-med-013",
      conceptId: "candidate-cell-state-sa",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "short-answer",
      prompt: "LSTM에서 $\\tanh$ 연산을 거쳐 현재 세포 상태에 새로 더해질 정보 내용 후보를 가리키는 기호는?",
      options: [],
      answer: null,
      acceptedAnswers: ["~C_t", "C~_t", "tilde C_t", "\\tilde{C}_t"],
      explanation: "새로운 세포 상태 후보 $\\tilde{C}_t$ 입니다[cite: 2].",
      hint: "C_t 위에 물결(tilde) 표식이 붙은 기호입니다[cite: 2]."
    },
    {
      id: "nlp-lstm-es-med-014",
      conceptId: "lstm-cell-state-math-essay",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "essay",
      prompt: "LSTM의 세포 상태 $C_t$가 업데이트되는 수식 $C_t = f_t * C_{t-1} + i_t * \\tilde{C}_t$ 를 각 항의 의미와 함께 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Forget", "Input", "보존", "기록"],
      modelAnswer: "이전 세포 상태 $C_{t-1}$에 Forget gate($f_t$)의 보존 비율을 곱해 불필요한 정보를 삭제하고, 새로운 정보 후보 $\\tilde{C}_t$에 Input gate($i_t$)의 기록 비율을 곱해 더함으로써 현재 세포 상태 $C_t$를 업데이트한다[cite: 2].",
      rubricKeywords: ["이전 세포 상태", "Forget gate 곱", "새 정보 후보", "Input gate 곱"],
      minLength: 20,
      explanation: "세포 상태 업데이트 수식의 두 항인 Forget 연산과 Input 연산 의미를 서술합니다[cite: 2].",
      hint: "Forget gate와의 곱과 Input gate와의 곱을 합산함을 기술하세요[cite: 2]."
    },
    {
      id: "nlp-lstm-es-med-015",
      conceptId: "gru-vs-lstm-essay",
      difficulty: "medium",
      category: "LSTM & 순환 모델",
      questionType: "essay",
      prompt: "GRU가 LSTM 대비 가지는 구조적 차이점과 이점을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Cell state", "통합", "게이트", "경량화"],
      modelAnswer: "GRU는 Cell state와 Hidden state를 하나로 통합하고, 게이트를 Reset gate와 Update gate 2개로 줄였다. 이를 통해 LSTM보다 학습 매개변수 수가 적고 연산 속도가 빠르며 경량화된 이점을 가진다[cite: 2].",
      rubricKeywords: ["상태 통합", "게이트 2개 단순화", "매개변수 경량화"],
      minLength: 20,
      explanation: "상태 벡터의 통합 및 2개 게이트 단순화에 따른 경량화 이점을 설명합니다[cite: 2].",
      hint: "상태의 통합, 게이트 수 감소, 연산량 경량화를 쓰세요[cite: 2]."
    },

    // ==========================================
    // 4. Seq2Seq & Attention (15문항)
    // ==========================================
    {
      id: "nlp-s2s-mc-med-001",
      conceptId: "seq2seq-loss-backprop",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Seq2Seq 모델 학습 시 손실 역전파(Backpropagation) 과정에 대한 바른 설명은?",
      options: [
        "디코더에서 발생한 손실 오차가 역전파되어 인코더까지 전파되므로 전체가 End-to-End로 동시 학습된다.",
        "인코더와 디코더는 완전히 독립되어 별도로만 학습된다.",
        "인코더만 학습되고 디코더는 고정된다.",
        "역전파가 불가능하여 무작위 탐색을 수행한다."
      ],
      answer: 0,
      explanation: "Seq2Seq는 디코더부터 인코더까지 오차가 연결되어 전파되는 통합 End-to-End 신경망입니다[cite: 2].",
      hint: "인코더와 디코더가 하나로 연결되어 동시(End-to-End) 학습됩니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-med-002",
      conceptId: "attention-score-dot-product",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Dot-product Attention에서 디코더 시점 $t$의 상태 $s_t$와 인코더 시점 $i$의 상태 $h_i$ 간의 유사도 Score 계산식은?",
      options: ["$score(s_t, h_i) = s_t^T h_i$", "$score(s_t, h_i) = s_t + h_i$", "$score(s_t, h_i) = s_t / h_i$", "$score(s_t, h_i) = \\sigma(s_t)$"],
      answer: 0,
      explanation: "Dot-product Attention의 유사도는 두 벡터의 전치 내적 $s_t^T h_i$ 로 계산합니다[cite: 2].",
      hint: "두 벡터의 전치 내적(Dot product) 수식입니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-med-003",
      conceptId: "attention-distribution-softmax",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Attention Score 값들에 Softmax를 취하여 구해지는 확률 분포 $\\alpha_t$의 성질은?",
      options: [
        "모든 인코더 시점 가중치들의 합이 1이 되는 확률 분포를 이룬다.",
        "값들의 합이 인코더 시점 수 $T$와 같아진다.",
        "모든 수치가 음수로 변화한다.",
        "가장 가중치가 작은 단어에 1이 할당된다."
      ],
      answer: 0,
      explanation: "Softmax를 통과하면 가중치 합이 1인 Attention 분포(가중치)가 생성됩니다[cite: 2].",
      hint: "가중치의 총합이 1이 되는 확률 분포입니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-med-004",
      conceptId: "attention-context-vector-formula",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Attention 분포 $\\alpha_{t,i}$와 인코더 은닉 상태 $h_i$를 이용해 컨텍스트 벡터 $a_t$를 구하는 연산은?",
      options: [
        "가중합 (Weighted Sum): $a_t = \\sum_i \\alpha_{t,i} h_i$",
        "단순 평균: $a_t = \\frac{1}{N} \\sum_i h_i$",
        "요소별 차: $a_t = h_i - \\alpha_{t,i}$",
        "행렬식 계산"
      ],
      answer: 0,
      explanation: "컨텍스트 벡터는 각 인코더 상태 $h_i$에 어텐션 가중치 $\\alpha_{t,i}$를 곱해 가중합합니다[cite: 2].",
      hint: "가중치와 은닉 상태를 곱해 다 더하는 가중합 연산입니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-med-005",
      conceptId: "attention-interpretability",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Attention 가중치 맵을 시각화했을 때 얻을 수 있는 추가적인 구조적 이점은?",
      options: [
        "디코더가 출력 단어를 생성할 때 인코더의 어떤 단어에 집중했는지 정렬(Alignment) 단서를 얻어 모델 판단을 해석할 수 있다.",
        "모델의 파라미터 수가 절반으로 줄어든다.",
        "학습 속도가 100배 증가한다.",
        "모든 오답 단어가 자동으로 교정된다."
      ],
      answer: 0,
      explanation: "어텐션 가중치를 시각화하면 단어 간 정렬(Alignment) 및 모델 의사결정의 해석 가능성을 얻습니다[cite: 2].",
      hint: "단어 간의 매핑 및 정렬(Alignment) 관계를 시각적으로 해석할 수 있습니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-med-006",
      conceptId: "seq2seq-loss-type",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Seq2Seq 디코더가 매 시점 단어 사전 중 정답 단어를 예측할 때 사용하는 손실 함수는?",
      options: ["Cross-Entropy Loss", "Mean Squared Error (MSE)", "L1 Loss", "Hinge Loss"],
      answer: 0,
      explanation: "디코더 출력이 단어 사전 다중 클래스 분류이므로 Cross-Entropy 손실을 씁니다[cite: 2].",
      hint: "다중 분류에 사용하는 대표적 손실 함수입니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-med-007",
      conceptId: "additive-vs-dot-attention",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Dot-product Attention이 Bahdanau 등의 Additive Attention에 비해 갖는 이점은?",
      options: [
        "행렬 곱 연산으로 구현되어 연산 속도가 빠르고 메모리 효율적이다.",
        "파라미터 개수가 10배 많아 표현력이 좋다.",
        "Softmax 함수를 생략할 수 있다.",
        "입력 차원이 축소된다."
      ],
      answer: 0,
      explanation: "Dot-product 방식은 고속 행렬 곱셈 라이브러리(MatMul)를 활용하여 연산 속도가 뛰어납니다[cite: 2].",
      hint: "행렬 곱 연산(MatMul)으로 고속 연산이 가능합니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-med-008",
      conceptId: "seq2seq-sos-eos-usage",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Seq2Seq 디코더 구동 시 시작을 알리는 입력 토큰과 종료를 알리는 토큰 순서는?",
      options: ["<SOS> 토큰으로 시작, <EOS> 토큰으로 종료", "<EOS> 토큰으로 시작, <SOS> 토큰으로 종료", "<PAD> 토큰으로 시작, <MASK> 토큰으로 종료", "<UNK> 토큰으로 시작, <CLS> 토큰으로 종료"],
      answer: 0,
      explanation: "시작 시 <SOS>(Start of Sequence)를 넣고 완료 시 <EOS>(End of Sequence)를 내놓습니다[cite: 2].",
      hint: "Start of Sequence로 시작하고 End of Sequence로 끝납니다[cite: 2]."
    },
    {
      id: "nlp-s2s-mc-med-009",
      conceptId: "exposure-bias-concept",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "multiple-choice",
      prompt: "Teacher Forcing으로 학습된 모델이 추론 시에는 자기 자신의 이전 예측값을 쓰면서 발생하는 오차 누적 현상은?",
      options: ["Exposure Bias (노출 편향)", "Overfitting", "Bottleneck Problem", "Gradient Vanishing"],
      answer: 0,
      explanation: "학습(정답 노출)과 추론(자기 예측 노출) 간의 환경 차이로 오차가 누적되는 Exposure Bias 현상입니다[cite: 2].",
      hint: "노출(Exposure) 환경 차이로 생기는 편향(Bias)입니다[cite: 2]."
    },
    {
      id: "nlp-s2s-sa-med-010",
      conceptId: "attention-score-sa",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "short-answer",
      prompt: "Attention 연산에서 디코더 상태와 인코더 상태 간의 유사도를 측정하기 위해 내적 등을 취해 얻는 값을 무엇이라 하는가?",
      options: [],
      answer: null,
      acceptedAnswers: ["어텐션 스코어", "Attention Score", "attention score", "어텐션 점수"],
      explanation: "유사도를 나타내는 Attention Score(어텐션 점수) 입니다[cite: 2].",
      hint: "Attention 뒤에 Score(점수)가 붙습니다[cite: 2]."
    },
    {
      id: "nlp-s2s-sa-med-011",
      conceptId: "context-vector-sa",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "short-answer",
      prompt: "Attention 분포 가중치와 인코더 은닉 상태들을 가중합하여 얻은 최종 맥락 정보 벡터의 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["컨텍스트 벡터", "Context Vector", "context vector", "맥락 벡터"],
      explanation: "가중합된 결과인 Context Vector(컨텍스트 벡터) 입니다[cite: 2].",
      hint: "맥락을 뜻하는 Context와 Vector의 결합입니다[cite: 2]."
    },
    {
      id: "nlp-s2s-sa-med-012",
      conceptId: "alignment-sa",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "short-answer",
      prompt: "기계 번역에서 디코더 출력을 생성할 때 원문의 특정 단어와 자동으로 대응 관계를 매핑하는 개념은?",
      options: [],
      answer: null,
      acceptedAnswers: ["정렬", "Alignment", "alignment", "단어 정렬"],
      explanation: "단어 간 매핑 관계인 Alignment(정렬) 개념입니다[cite: 2].",
      hint: "영문 'Alignment' 또는 한글 '정렬' 입니다[cite: 2]."
    },
    {
      id: "nlp-s2s-sa-med-013",
      conceptId: "bleu-sa",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "short-answer",
      prompt: "기계 번역 결과의 품질을 사람의 번역문과 n-gram 일치 정밀도로 비교 평가하는 대표적 지표 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["BLEU", "bleu", "BLEU score"],
      explanation: "BLEU(Bilingual Evaluation Understudy) 지표입니다[cite: 2].",
      hint: "B_E_U 형태의 4글자 약자입니다[cite: 2]."
    },
    {
      id: "nlp-s2s-es-med-014",
      conceptId: "attention-calculation-process-essay",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "essay",
      prompt: "Attention 메커니즘에서 컨텍스트 벡터가 구해지는 3단계 과정(Score 계산 -> 확률 분포 변환 -> 가중합)을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["내적", "Softmax", "가중합"],
      modelAnswer: "1) 디코더 상태와 인코더 상태들 간의 유사도(Score)를 내적 등으로 계산한다. 2) 계산된 Score들에 Softmax를 취해 합이 1인 Attention 확률 분포를 얻는다. 3) 이 확률 분포 가중치를 인코더 은닉 상태들에 곱해 가중합(Context Vector)을 구한다[cite: 2].",
      rubricKeywords: ["유사도 Score 계산", "Softmax 확률 분포", "인코더 상태 가중합"],
      minLength: 20,
      explanation: "Score 내적 $\\rightarrow$ Softmax 확률화 $\\rightarrow$ 인코더 상태 가중합 3단계를 서술합니다[cite: 2].",
      hint: "점수 계산, 소프트맥스 변환, 가중합 순서로 기술하세요[cite: 2]."
    },
    {
      id: "nlp-s2s-es-med-015",
      conceptId: "exposure-bias-essay",
      difficulty: "medium",
      category: "Seq2Seq & Attention",
      questionType: "essay",
      prompt: "Seq2Seq 모델 학습 시 Teacher Forcing으로 인해 추론 단계에서 발생하는 '노출 편향(Exposure Bias)' 현상을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["학습", "추론", "예측", "오차 누적"],
      modelAnswer: "학습 시에는 항상 정답 단어만을 디코더 입력으로 제공받지만, 실제 추론 시에는 자신이 이전에 예측한 단어를 입력으로 사용한다. 이로 인해 학습과 추론 간 입력 환경 차이가 발생하여 초기 예측 오차가 뒤로 갈수록 연쇄적으로 증폭/누적되는 현상이다[cite: 2].",
      rubricKeywords: ["학습 정답 제공", "추론 자기 예측 사용", "오차 누적"],
      minLength: 20,
      explanation: "학습 환경(정답 제공)과 추론 환경(자기 예측 제공)의 불일치로 인한 오차 누적을 설명합니다[cite: 2]."
    },

    // ==========================================
    // 5. Transformer & Self-Attention (15문항)
    // ==========================================
    {
      id: "nlp-tr-mc-med-001",
      conceptId: "qkv-projection-formula",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "입력 행렬 $X$로부터 Self-Attention의 $Q, K, V$ 행렬을 얻는 선형 변환 수식 표현은?",
      options: [
        "$Q = X W^Q, \\quad K = X W^K, \\quad V = X W^V$",
        "$Q = X + W^Q, \\quad K = X + W^K, \\quad V = X + W^V$",
        "$Q = \\sigma(X), \\quad K = \\tanh(X), \\quad V = \\text{ReLU}(X)$",
        "$Q = X^{-1}, \\quad K = X^T, \\quad V = \\det(X)$"
      ],
      answer: 0,
      explanation: "입력 $X$에 각 투영 가중치 행렬 $W^Q, W^K, W^V$를 곱하여 $Q, K, V$ 행렬을 생성합니다[cite: 2].",
      hint: "입력 $X$에 투영 가중치 행렬 $W$를 곱합니다[cite: 2]."
    },
    {
      id: "nlp-tr-mc-med-002",
      conceptId: "scaled-dot-product-formula",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "트랜스포머의 Scaled Dot-Product Attention 계산 수식으로 올바른 것은?",
      options: [
        "$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$",
        "$\\text{Attention}(Q, K, V) = \\text{softmax}(Q + K) \\cdot V$",
        "$\\text{Attention}(Q, K, V) = \\frac{\\text{softmax}(Q K)}{d_k} + V$",
        "$\\text{Attention}(Q, K, V) = \\tanh\\left(\\frac{Q V^T}{K}\\right)$"
      ],
      answer: 0,
      explanation: "$Q K^T$ 내적을 $\\sqrt{d_k}$로 나눈 후 Softmax를 거쳐 Value 행렬과 곱합니다[cite: 2].",
      hint: "$QK^T / \\sqrt{d_k}$ 에 Softmax를 취하고 $V$를 곱하는 공식입니다[cite: 2]."
    },
    {
      id: "nlp-tr-mc-med-003",
      conceptId: "scaled-dot-product-reason",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "Dot-product Attention에서 내적값을 $\\sqrt{d_k}$ 차원의 제곱근으로 나누어 스케일링하는 주요 이유는?",
      options: [
        "차원이 커질수록 내적값이 과도하게 커져 Softmax 기울기 소실(Gradient Vanishing) 영역에 빠지는 것을 방지하기 위해",
        "내적 결과값을 무조건 음수로 만들기 위해",
        "Softmax 연산을 생략하기 위해",
        "가중치 행렬의 크기를 축소하기 위해"
      ],
      answer: 0,
      explanation: "차원이 커지면 내적 분산이 커져 Softmax 출력이 뾰족해지고 기울기가 소실되므로 $\\sqrt{d_k}$로 나눕니다[cite: 2].",
      hint: "내적값이 너무 커져 Softmax 기울기가 작아지는 것을 막습니다[cite: 2]."
    },
    {
      id: "nlp-tr-mc-med-004",
      conceptId: "multi-head-head-dim",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "전체 모델 차원이 $d_{model} = 512$ 이고, Multi-Head Attention의 헤드 수가 $h = 8$ 일 때, 각 헤드의 차원 $d_k$는 얼마인가?",
      options: ["64", "512", "8", "128"],
      answer: 0,
      explanation: "$d_k = d_{model} / h = 512 / 8 = 64$ 차원으로 각 헤드에 할당됩니다[cite: 2].",
      hint: "$d_{model}$을 헤드 수 $h$로 나눈 값입니다[cite: 2]."
    },
    {
      id: "nlp-tr-mc-med-005",
      conceptId: "residual-connection-concept",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "트랜스포머 블록에서 입력 $x$를 서브레이어 출력에 다시 더해주는 $x + \\text{SubLayer}(x)$ 구조의 명칭은?",
      options: ["Residual Connection (잔차 연결)", "Layer Normalization", "Dropout", "Softmax"],
      answer: 0,
      explanation: "잔차 연결(Residual Connection)은 층이 깊어져도 오차 기울기가 원활히 통과하도록 지름길을 제공합니다[cite: 2].",
      hint: "입력을 그대로 bypass하여 더해주는 잔차(Residual) 연결입니다[cite: 2]."
    },
    {
      id: "nlp-tr-mc-med-006",
      conceptId: "layer-norm-concept",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "트랜스포머의 Add & Norm 파트에서 각 서브레이어 단위로 벡터 특성값들을 정규화하여 안정적 학습을 돕는 기술은?",
      options: ["Layer Normalization", "Batch Normalization", "Weight Normalization", "Min-Max Normalization"],
      answer: 0,
      explanation: "각 레이어 내부 노드 특성 단위로 정규화하는 Layer Normalization 기법입니다[cite: 2].",
      hint: "레이어(Layer) 단위로 정규화(Normalization)합니다[cite: 2]."
    },
    {
      id: "nlp-tr-mc-med-007",
      conceptId: "cross-attention-qkv-source",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "트랜스포머 디코더의 Cross-Attention 서브레이어에서 Query(Q), Key(K), Value(V)의 출처 조합으로 바른 것은?",
      options: [
        "Query는 디코더의 하위 레이어 출력, Key와 Value는 인코더의 최상단 출력",
        "Query, Key, Value 모두 인코더 출력",
        "Query, Key, Value 모두 디코더 출력",
        "Query와 Key는 인코더, Value는 디코더 출력"
      ],
      answer: 0,
      explanation: "Cross-Attention은 질문(Q)은 디코더의 상태에서 오고, 참고할 K와 V는 인코더 출력에서 옵니다[cite: 2].",
      hint: "Q는 디코더에서, K와 V는 인코더에서 가져옵니다[cite: 2]."
    },
    {
      id: "nlp-tr-mc-med-008",
      conceptId: "position-wise-ffn-expansion",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "트랜스포머의 Position-wise FFN 서브레이어에서 은닉 차원을 $d_{model} \\rightarrow d_{ff} \\rightarrow d_{model}$ 로 넓혔다 줄이는 일반적인 확장 비율은?",
      options: ["4배 (예: 512 $\\rightarrow$ 2048 $\\rightarrow$ 512)", "2배", "10배", "100배"],
      answer: 0,
      explanation: "원 논문 기준 $d_{model}=512$일 때 $d_{ff}=2048$ 로 4배 일시 확장하여 비선형 표현력을 높입니다[cite: 2].",
      hint: "보통 4배 확장 공간으로 넓혔다 줄입니다[cite: 2]."
    },
    {
      id: "nlp-tr-mc-med-009",
      conceptId: "encoder-vs-decoder-architecture",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "multiple-choice",
      prompt: "트랜스포머 인코더 블록과 디코더 블록의 결정적인 서브레이어 구조 차이는?",
      options: [
        "디코더 블록에는 Masked Self-Attention과 인코더 출력을 참조하는 Cross-Attention이 추가되어 있다.",
        "인코더 블록에는 FFN이 없고 디코더에만 존재한다.",
        "인코더 블록은 LayerNorm을 쓰지 않는다.",
        "디코더 블록은 Residual Connection이 없다."
      ],
      answer: 0,
      explanation: "디코더 블록은 Masked Self-Attention과 인코더-디코더 Cross-Attention 서브레이어가 추가되어 총 3개 서브레이어로 구성됩니다[cite: 2].",
      hint: "디코더에는 미래 토큰 차단 마스크와 인코더 참조 Cross-Attention이 더 있습니다[cite: 2]."
    },
    {
      id: "nlp-tr-sa-med-010",
      conceptId: "scaled-dot-product-sa",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "short-answer",
      prompt: "Self-Attention 수식에서 $Q K^T$ 내적값을 $\\sqrt{d_k}$ 로 나누어주는 Attention 방식의 정식 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Scaled Dot-Product Attention", "scaled dot-product attention", "스케일드 닷프로덕트 어텐션"],
      explanation: "Scaled Dot-Product Attention 기법입니다[cite: 2].",
      hint: "'Scaled'라는 단어로 시작하는 어텐션 명칭입니다[cite: 2]."
    },
    {
      id: "nlp-tr-sa-med-011",
      conceptId: "residual-connection-sa",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "short-answer",
      prompt: "서브레이어의 입력 $x$를 출력에 다시 더해주는 $x + \\text{SubLayer}(x)$ 지름길 연결 구조의 영문 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Residual Connection", "residual connection", "잔차 연결", "Residual connection"],
      explanation: "Residual Connection(잔차 연결) 입니다[cite: 2].",
      hint: "'Residual'로 시작하는 영문 명칭입니다[cite: 2]."
    },
    {
      id: "nlp-tr-sa-med-012",
      conceptId: "layer-normalization-sa",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "short-answer",
      prompt: "각 레이어 내부의 은닉 벡터 특성값들을 정규화하여 학습 정밀도를 높이는 기법의 영문 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Layer Normalization", "layer normalization", "레이어 정규화", "Layer normalization"],
      explanation: "Layer Normalization 기법입니다[cite: 2].",
      hint: "'Layer'로 시작하는 정규화 기술입니다[cite: 2]."
    },
    {
      id: "nlp-tr-sa-med-013",
      conceptId: "cross-attention-sa",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "short-answer",
      prompt: "트랜스포머 디코더에서 Query는 디코더에서, Key와 Value는 인코더 출력에서 받아 연결하는 어텐션 서브레이어는?",
      options: [],
      answer: null,
      acceptedAnswers: ["Cross-Attention", "cross-attention", "크로스 어텐션", "Cross Attention"],
      explanation: "Cross-Attention 서브레이어입니다[cite: 2].",
      hint: "인코더와 디코더를 '교차' 연결하는 어텐션입니다[cite: 2]."
    },
    {
      id: "nlp-tr-es-med-014",
      conceptId: "scaled-dot-product-reason-essay",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "essay",
      prompt: "Self-Attention 수식에서 내적값 $Q K^T$를 $\\sqrt{d_k}$로 나누는 스케일링을 수행해야 하는 이유를 역전파 기울기 관점에서 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["내적", "분산", "Softmax", "기울기 소실"],
      modelAnswer: "차원 $d_k$가 커질수록 $Q K^T$ 내적값의 분산이 증가하여 Softmax 함수의 출력이 극단적으로 뾰족해진다. 이로 인해 Softmax의 미분 기울기(Gradient)가 0에 가까워져 학습이 안 되는 기울기 소실 문제가 발생하므로 $\\sqrt{d_k}$로 스케일링한다[cite: 2].",
      rubricKeywords: ["내적 분산 증가", "Softmax 출력이 뾰족함", "기울기 소실 방지"],
      minLength: 20,
      explanation: "차원 증가에 따른 내적 분산 증대와 Softmax 기울기 소실 방지 목적을 서술합니다[cite: 2].",
      hint: "차원이 클 때 내적 분산이 커져 Softmax 미분값이 0이 되는 현상을 기술하세요[cite: 2]."
    },
    {
      id: "nlp-tr-es-med-015",
      conceptId: "cross-attention-qkv-essay",
      difficulty: "medium",
      category: "Transformer & Self-Attention",
      questionType: "essay",
      prompt: "트랜스포머 디코더의 Cross-Attention 서브레이어에서 Query, Key, Value 벡터가 각각 어디서 오는지 출처를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Query", "Key", "Value", "디코더", "인코더"],
      modelAnswer: "Query(Q) 벡터는 디코더의 하위 마스킹 Self-Attention 서브레이어 출력에서 오고, Key(K)와 Value(V) 벡터는 인코더의 최상단 레이어 출력 표현에서 가져온다[cite: 2].",
      rubricKeywords: ["Query는 디코더", "Key/Value는 인코더"],
      minLength: 20,
      explanation: "Q(디코더 하위 출력) 및 K, V(인코더 최상단 출력)의 출처를 명확히 작성합니다[cite: 2].",
      hint: "Q는 디코더, K와 V는 인코더에서 온다는 점을 명시하세요[cite: 2]."
    },

    // ==========================================
    // 6. 텍스트 파운데이션 모델 (15문항)
    // ==========================================
    {
      id: "nlp-llm-mc-med-001",
      conceptId: "bert-vs-gpt-architecture",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "BERT와 GPT 모델의 트랜스포머 아키텍처 블록 활용 및 문맥 참조 방식 차이는?",
      options: [
        "BERT는 인코더 기반의 양방향(Bidirectional) 참조이며, GPT는 디코더 기반의 단방향(Unidirectional) 생성 모델이다.",
        "BERT는 디코더 기반이고 GPT는 인코더 기반이다.",
        "BERT와 GPT 모두 단방향 참조만 수행한다.",
        "BERT는 이미지 처리 전용이고 GPT는 텍스트 처리 전용이다."
      ],
      answer: 0,
      explanation: "BERT는 양방향 인코더 구조, GPT는 다음 단어를 예측하는 단방향 디코더 구조입니다[cite: 3].",
      hint: "BERT는 양방향 인코더, GPT는 단방향 디코더입니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-med-002",
      conceptId: "gpt2-underfitting-lesson",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "GPT-2 연구에서 모델 파라미터 크기가 증가함에 따라 Perplexity가 계속 감소하며 얻은 중요한 교훈은?",
      options: [
        "가장 큰 GPT-2 모델조차 아직 언더피팅 상태이며, 모델과 데이터 규모를 더 확장할 필요성이 존재한다.",
        "모델 크기를 줄여야만 오차가 감소한다.",
        "Perplexity 수치는 모델 성능과 상관없다.",
        "텍스트 자가 학습은 이미 한계에 다다랐다."
      ],
      answer: 0,
      explanation: "GPT-2의 가장 큰 모델도 여전히 손실이 감소 중이었으며, 더 큰 규모(GPT-3)로의 확장 정당성을 보여주었습니다[cite: 3].",
      hint: "모델 규모를 더 늘렸을 때 성능이 더 향상될 여지가 있음을 발견했습니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-med-003",
      conceptId: "in-context-shots-classification",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "In-context Learning 프롬프트에서 지시문과 함께 예시를 0개, 1개, 소수 개 제공하는 것을 순서대로 짝지은 것은?",
      options: [
        "Zero-shot, One-shot, Few-shot",
        "Few-shot, One-shot, Zero-shot",
        "No-shot, Single-shot, Multi-shot",
        "Zero-shot, Multi-shot, Few-shot"
      ],
      answer: 0,
      explanation: "예시 0개는 Zero-shot, 1개는 One-shot, 소수는 Few-shot이라 명칭합니다[cite: 3].",
      hint: "Zero(0), One(1), Few(소수) 입니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-med-004",
      conceptId: "pretraining-loss-causal-lm",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "GPT 계열의 Causal Language Modeling(인과적 언어 모델링) 사전 학습 목적함수의 작동 방식은?",
      options: [
        "이전까지 나타난 단어들 $w_1, ..., w_{t-1}$의 문맥을 조건으로 하여 다음 단어 $w_t$의 로그 확률을 최대화함",
        "문장 전체를 보고 양방향 가운데 빈칸 단어를 예측함",
        "문장 전체를 한 번에 인코딩해 분류 라벨 1개를 예측함",
        "모든 단어를 무작위 시퀀스로 섞음"
      ],
      answer: 0,
      explanation: "인과적 언어 모델링은 과거 문맥만을 바탕으로 바로 다음 토큰의 확률을 예측합니다[cite: 3].",
      hint: "과거 문맥을 조건으로 다음 단어의 확률을 예측합니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-med-005",
      conceptId: "gpt3-pretraining-data-mix",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "GPT-3 사전 학습 데이터 조합에서 가장 큰 비중(60%)을 차지한 데이터셋은?",
      options: ["Common Crawl (filtered)", "WebText2", "Books1", "Wikipedia"],
      answer: 0,
      explanation: "GPT-3 사전 학습에는 필터링된 Common Crawl 웹 데이터가 60% 비중으로 가장 많이 쓰였습니다[cite: 3].",
      hint: "웹 크롤링 데이터셋인 Common Crawl 입니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-med-006",
      conceptId: "llama2-chat-alignment",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "Meta가 LLaMA 2 모델과 함께 대화형 서비스에 적합하도록 정렬 학습을 거쳐 공개한 모델 버전 명칭은?",
      options: ["Llama-2-chat", "Llama-2-code", "Llama-2-vision", "Llama-2-base"],
      answer: 0,
      explanation: "Meta는 대화에 특화되도록 RLHF 및 대화 데이터로 미세조정한 Llama-2-chat을 함께 공개했습니다[cite: 3].",
      hint: "대화(chat) 전용 정렬 모델입니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-med-007",
      conceptId: "chinchilla-scaling-law",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "DeepMind의 Chinchilla 연구에서 제시한 최적의 자원 배분 법칙으로, 모델 파라미터 수($N$)와 학습 토큰 수($D$)의 관계는?",
      options: [
        "파라미터 수 $N$과 학습 토큰 수 $D$를 1:1 동등한 비율로 함께 확장해야 함",
        "파라미터 $N$만 10배 늘리고 토큰 수 $D$는 고정해야 함",
        "토큰 수 $D$만 100배 늘리고 파라미터 $N$은 줄여야 함",
        "파라미터 수와 토큰 수는 무관함"
      ],
      answer: 0,
      explanation: "Chinchilla 연구는 파라미터 $N$과 학습 토큰 $D$가 1:1 비율로 같이 커져야 제한된 계산 자원에서 손실이 최소화됨을 입증했습니다[cite: 3].",
      hint: "파라미터와 학습 토큰을 1:1 동등 비율로 늘려야 합니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-med-008",
      conceptId: "closed-llm-tradeoff",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "폐쇄형(Closed) LLM API를 활용할 때의 트레이드오프(단점)로 옳은 것은?",
      options: [
        "호출 시마다 비용이 발생하고 내부 가중치나 구동 정보가 제한적이다.",
        "모델의 성능이 오픈소스보다 무조건 낮다.",
        "직접 GPU 서버를 사서 구축해야만 한다.",
        "파이썬 코드로 호출이 불가능하다."
      ],
      answer: 0,
      explanation: "폐쇄형 LLM은 사용이 쉽고 성능이 우수하지만, 토큰당 API 비용과 내부 정보 불투명성이 트레이드오프입니다[cite: 3].",
      hint: "토큰당 사용 비용과 가중치 비공개 특성입니다[cite: 3]."
    },
    {
      id: "nlp-llm-mc-med-009",
      conceptId: "open-llm-tradeoff",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "개방형(Open-sourced) LLM을 자체 구축하여 활용할 때의 트레이드오프(단점)로 옳은 것은?",
      options: [
        "구동 및 미세조정을 위해 자체적인 계산 자원(GPU VRAM 등)과 인프라가 필요하다.",
        "소스 코드가 비공개되어 수정할 수 없다.",
        "API 호스팅이 절대 불가능하다.",
        "상용 서비스로 서빙할 수 없다."
      ],
      answer: 0,
      explanation: "개방형 LLM은 무료 사용 및 커스텀이 가능하지만, 고성능 GPU 인프라와 운영 오버헤드가 필요합니다[cite: 3].",
      hint: "고성능 GPU 계산 자원 및 서버 인프라가 필요합니다[cite: 3]."
    },
    {
      id: "nlp-llm-sa-med-010",
      conceptId: "causal-language-modeling-sa",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "short-answer",
      prompt: "이전까지 등장한 단어들만을 조건으로 다음 단어의 로그 확률을 예측하는 GPT 계열의 사전 학습 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Causal Language Modeling", "causal language modeling", "인과적 언어 모델링", "CLM"],
      explanation: "Causal Language Modeling(CLM) 기법입니다[cite: 3].",
      hint: "인과적(Causal) 언어 모델링입니다[cite: 3]."
    },
    {
      id: "nlp-llm-sa-med-011",
      conceptId: "zero-shot-sa",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "short-answer",
      prompt: "In-context Learning에서 프롬프트에 예시(Example)를 전혀 주지 않고 지시문만 주는 방식을 무엇이라 하는가?",
      options: [],
      answer: null,
      acceptedAnswers: ["Zero-shot", "zero-shot", "Zero-shot 프롬프팅", "제로샷"],
      explanation: "Zero-shot 프롬프팅 방식입니다[cite: 3].",
      hint: "숫자 0을 뜻하는 Zero가 들어갑니다[cite: 3]."
    },
    {
      id: "nlp-llm-sa-med-012",
      conceptId: "few-shot-sa",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "short-answer",
      prompt: "In-context Learning에서 프롬프트에 지시문과 함께 소수 개의 예시를 함께 제공하는 방식을 무엇이라 하는가?",
      options: [],
      answer: null,
      acceptedAnswers: ["Few-shot", "few-shot", "Few-shot 프롬프팅", "퓨샷"],
      explanation: "Few-shot 프롬프팅 방식입니다[cite: 3].",
      hint: "소수를 뜻하는 Few가 들어갑니다[cite: 3]."
    },
    {
      id: "nlp-llm-sa-med-013",
      conceptId: "chinchilla-sa",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "short-answer",
      prompt: "DeepMind 연구진이 제안한 파라미터 수와 학습 토큰 수 간의 1:1 최적 비율 스케일링 법칙의 모델 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Chinchilla", "chinchilla", "친칠라"],
      explanation: "Chinchilla(친칠라) 스케일링 법칙입니다[cite: 3].",
      hint: "동물 이름과 같은 Chinchilla 입니다[cite: 3]."
    },
    {
      id: "nlp-llm-es-med-014",
      conceptId: "bert-vs-gpt-essay",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "essay",
      prompt: "BERT와 GPT의 아키텍처적 구조 차이(인코더/디코더)와 문맥 참조 방식 차이를 비교 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["BERT", "GPT", "인코더", "디코더", "양방향", "단방향"],
      modelAnswer: "BERT는 트랜스포머 인코더 블록 기반으로 문장 전체의 양방향(Bidirectional) 문맥을 참조하여 분류/분석에 유리하다. 반면 GPT는 트랜스포머 디코더 블록 기반으로 과거 문맥만 참조하는 단방향(Unidirectional) Causal LM으로 텍스트 생성에 유리하다[cite: 3].",
      rubricKeywords: ["BERT 인코더 양방향", "GPT 디코더 단방향"],
      minLength: 20,
      explanation: "BERT의 양방향 인코더 구조와 GPT의 단방향 디코더 구조 차이를 서술합니다[cite: 3].",
      hint: "인코더/디코더 구조 및 양방향/단방향 참조 차이를 서술하세요[cite: 3]."
    },
    {
      id: "nlp-llm-es-med-015",
      conceptId: "in-context-learning-shots-essay",
      difficulty: "medium",
      category: "텍스트 파운데이션 모델",
      questionType: "essay",
      prompt: "In-context Learning에서 Zero-shot, One-shot, Few-shot 프롬프팅 방식의 차이점을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["예시", "0개", "1개", "소수"],
      modelAnswer: "Zero-shot은 프롬프트에 예시 없이 지시문만 제공하는 방식이고, One-shot은 지시문과 함께 1개의 풀이 예시를 제공하는 방식이며, Few-shot은 지시문과 함께 소수 개(2개 이상)의 풀이 예시를 제공하여 패턴을 따르게 하는 방식이다[cite: 3].",
      rubricKeywords: ["Zero-shot 예시 0개", "One-shot 예시 1개", "Few-shot 예시 소수 개"],
      minLength: 20,
      explanation: "프롬프트에 포함되는 예시(Example) 개수 차이를 설명합니다[cite: 3].",
      hint: "예시의 개수(0개, 1개, 소수 개)를 명시하여 차이를 기술하세요[cite: 3]."
    },

    // ==========================================
    // 7. 정렬 학습 (Alignment) (15문항)
    // ==========================================
    {
      id: "nlp-align-mc-med-001",
      conceptId: "pretraining-limit-unaligned",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "사전 학습만 진행된 GPT-3 모델에 \"6살 아이에게 달 착륙을 설명해줘\"라고 질의했을 때 일어나는 유해/부적절 행동은?",
      options: [
        "질문 지시에 답변하지 않고 질문과 비슷한 다른 질문 문장들을 계속 나열/복사하여 이어 쓴다.",
        "완벽한 어린이용 답변을 한 번에 제시한다.",
        "학습 데이터 전체를 삭제한다.",
        "영어가 아닌 타 언어로 자동 번역한다."
      ],
      answer: 0,
      explanation: "사전학습만 된 기본 모델은 질문에 대답하는 규칙을 몰라 유저 질문 패턴을 이어 완성하려는 성향을 보입니다[cite: 3].",
      hint: "질문에 대답하는 대신 유사한 질문을 이어 붙입니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-med-002",
      conceptId: "sft-data-template-variation",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "FLAN 등 지시 학습 데이터셋 구성 시 단일 문구 대신 여러 자연어 템플릿 프롬프트를 섞어 학습시키는 목적은?",
      options: [
        "특정 프롬프트 고정 표현에 오버피팅되는 것을 막고, 새로운 지시문에 대한 일반화(Zero-shot) 능력을 높이기 위해",
        "데이터 파일 용량을 줄이기 위해",
        "파라미터 개수를 증가시키기 위해",
        "단어 사전을 자동으로 압축하기 위해"
      ],
      answer: 0,
      explanation: "다양한 형태의 프롬프트 템플릿을 경험시켜 문구가 달라져도 지시 의도를 파악하는 일반화 능력을 키웁니다[cite: 3].",
      hint: "특정 표현 과적합 방지 및 다양한 표현 일반화 목적입니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-med-003",
      conceptId: "sft-vs-preference-open-ended",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "SFT(지시 학습)만으로는 번역이나 에세이 같은 개방형(Open-ended) 태스크에 한계가 존재하는 이유는?",
      options: [
        "SFT는 단 하나의 정답 응답만 가늠하지만, 개방형 태스크는 복수 정답이 존재하므로 사람의 선호 비교가 필요하기 때문",
        "SFT는 수식 연산이 불가능해서",
        "개방형 태스크는 텍스트를 쓸 수 없어서",
        "SFT는 GPU 사용이 안 되기 때문"
      ],
      answer: 0,
      explanation: "SFT는 하나의 정답 텍스트로만 학습하지만, 정답이 여럿인 개방형 작업은 상대적 선호 비교 학습이 더 적합합니다[cite: 3].",
      hint: "단일 정답 가정의 한계와 복수 정답의 선호 비교 필요성입니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-med-004",
      conceptId: "reward-model-binary-pairwise-loss",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "RLHF에서 보상 모델 $R_\\psi$를 지도 학습시킬 때, 사람이 더 선호한 답변 $y_w$와 비선호 답변 $y_l$에 대해 취하는 학습 목표는?",
      options: [
        "$R_\\psi(x, y_w)$ 의 보상 점수가 $R_\\psi(x, y_l)$ 의 보상 점수보다 커지도록 차이를 최대화함",
        "두 답변의 보상 점수를 모두 0으로 맞춤",
        "비선호 답변 $y_l$의 보상 점수를 더 높임",
        "두 보상 점수의 평균을 계산해 고정함"
      ],
      answer: 0,
      explanation: "보상 모델은 사람이 선호한 답변 $y_w$에 비선호 답변 $y_l$보다 더 높은 스코어를 부여하도록 트레이닝됩니다[cite: 3].",
      hint: "선호 답변 $y_w$의 점수가 비선호 답변 $y_l$ 점수보다 높아지도록 학습합니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-med-005",
      conceptId: "instruct-gpt-eval-result",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "InstructGPT 논문의 평가 결과 중 RLHF를 거친 모델이 보여준 주요 개선점은?",
      options: [
        "단순 SFT 모델보다 유저 평가 선호도가 대폭 상승하고, 유해 응답(Toxicity)과 거짓말/환각이 감소함",
        "파라미터 개수가 10배로 증대됨",
        "영한 번역 스코어가 0점이 됨",
        "속도가 100배 빨라짐"
      ],
      answer: 0,
      explanation: "RLHF를 거친 InstructGPT는 단순 SFT 모델보다 실제 인간 유저 선호도가 높고 유해 응답이 감소했습니다[cite: 3].",
      hint: "인간 유저의 선호도가 크게 오르고 유해성과 환각이 줄어들었습니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-med-006",
      conceptId: "dpo-concept",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "RLHF의 복잡한 보상 모델 훈련 및 PPO 강화학습 루프 없이, 선호 데이터로 언어 모델 자체를 직접 최적화하는 최신 정렬 기법은?",
      options: ["DPO (Direct Preference Optimization)", "SFT", "PCA", "LoRA"],
      answer: 0,
      explanation: "Direct Preference Optimization(DPO)은 별도 보상 모델과 PPO 단계 없이 선호 데이터로 직접 언어 모델을 정렬합니다[cite: 3].",
      hint: "Direct Preference Optimization 약자입니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-med-007",
      conceptId: "safety-alignment-refusal",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "LLM이 \"표지판을 잘라내려면 무슨 도구가 필요해?\" 같은 위험/불법 질문을 받았을 때, 안전 정렬이 적용된 모델의 올바른 반응은?",
      options: [
        "불법적이거나 위험한 행동을 지원할 수 없다고 책임감 있게 거절 응답을 출력함",
        "절단용 톱과 사다리 목록을 상세히 알려줌",
        "시스템 오류를 발생시킴",
        "질문을 그대로 복사하여 되물음"
      ],
      answer: 0,
      explanation: "안전 정렬(Safety Alignment)을 거친 모델은 위험/불법 요청에 대해 책임감 있는 거절(Refusal)을 수행합니다[cite: 3].",
      hint: "위험/불법 요청을 책임감 있게 거절합니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-med-008",
      conceptId: "instruction-tuning-scale-threshold",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "FLAN 연구 결과 중, Instruction Tuning의 효과가 뚜렷하게 발현되기 시작하는 모델 규모 조건은?",
      options: [
        "일정 임계 규모 이상의 파라미터를 가진 대형 모델(약 8B 이상)에서 창발적으로 효과 발현",
        "파라미터 크기가 아주 작은 소형 모델(0.1B 이하)에서만 발현",
        "모델 크기와는 아무런 상관이 없음",
        "오직 175B 이상에서만 작동함"
      ],
      answer: 0,
      explanation: "지시 이행 능력도 창발성의 일종으로, 소형 모델에서는 효과가 미비하다가 일정 크기 이상에서 급격히 나타납니다[cite: 3].",
      hint: "일정 임계 파라미터 규모 이상이어야 창발적으로 발현됩니다[cite: 3]."
    },
    {
      id: "nlp-align-mc-med-009",
      conceptId: "dpo-advantage",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "multiple-choice",
      prompt: "DPO(Direct Preference Optimization)가 기존 RLHF 대비 가질 수 있는 결정적 장점은?",
      options: [
        "별도 보상 모델을 신경망으로 따로 훈련시키지 않고 언어 모델의 확률 비로 대체하여 학습이 매우 안정적임",
        "학습 데이터가 1개만 필요함",
        "트랜스포머 아키텍처가 필요 없음",
        "CPU 1개로 학습 가능함"
      ],
      answer: 0,
      explanation: "DPO는 수학적 유도를 통해 언어 모델 자체의 확률 비로 보상 모델을 대신하여 학습 안정성을 높입니다[cite: 3].",
      hint: "별도의 보상 모델과 복잡한 강화학습 루프가 필요 없습니다[cite: 3]."
    },
    {
      id: "nlp-align-sa-med-010",
      conceptId: "dpo-sa",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "short-answer",
      prompt: "별도의 보상 모델이나 PPO 강화학습 없이 선호 확률 비로 언어 모델을 직접 정렬시키는 기법의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["DPO", "dpo", "Direct Preference Optimization"],
      explanation: "Direct Preference Optimization(DPO) 기법입니다[cite: 3].",
      hint: "D_O 형태의 3글자 약자입니다[cite: 3]."
    },
    {
      id: "nlp-align-sa-med-011",
      conceptId: "pairwise-ranking-sa",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "short-answer",
      prompt: "RLHF Step 2에서 사람 주석자가 여러 모델 답변 중 어떤 답변이 더 나은지 비교하여 매기는 데이터 형태는?",
      options: [],
      answer: null,
      acceptedAnswers: ["선호 순위", "순위", "Ranking", "선호도", "ranking"],
      explanation: "답변 후보 간의 순위(Ranking) 또는 선호 데이터입니다[cite: 3].",
      hint: "답변 간의 우선순위를 매기는 '순위(Ranking)' 입니다[cite: 3]."
    },
    {
      id: "nlp-align-sa-med-012",
      conceptId: "ppo-sa",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "short-answer",
      prompt: "InstructGPT의 Step 3 강화학습 단계에서 보상 모델의 점수를 높이도록 언어 모델을 업데이트하는 알고리즘 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["PPO", "ppo", "Proximal Policy Optimization"],
      explanation: "Proximal Policy Optimization(PPO) 알고리즘입니다[cite: 3].",
      hint: "P_O 형태의 3글자 약자입니다[cite: 3]."
    },
    {
      id: "nlp-align-sa-med-013",
      conceptId: "safety-alignment-sa",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "short-answer",
      prompt: "위험하거나 불법적인 유저 요청에 대해 모델이 답변을 거부하도록 학습시키는 정렬 영역을 무엇이라 하는가?",
      options: [],
      answer: null,
      acceptedAnswers: ["안전 정렬", "안전정렬", "Safety Alignment", "safety alignment"],
      explanation: "안전성 확보를 위한 Safety Alignment(안전 정렬) 입니다[cite: 3].",
      hint: "'안전'과 '정렬'의 결합어입니다[cite: 3]."
    },
    {
      id: "nlp-align-es-med-014",
      conceptId: "rlhf-vs-dpo-essay",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "essay",
      prompt: "기존 RLHF 방식과 최신 DPO 방식의 구조적 차이점을 '보상 모델' 유무 관점에서 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["RLHF", "DPO", "보상 모델", "PPO"],
      modelAnswer: "RLHF는 사람의 선호 데이터를 기반으로 보상 모델(RM)을 별도로 학습시킨 후 PPO 강화학습을 적용한다. 반면 DPO는 수학적 변환을 통해 보상함수를 언어 모델의 확률 비로 대체함으로써, 별도의 보상 모델 학습 및 PPO 루프 없이 언어 모델을 직접 최적화한다[cite: 3].",
      rubricKeywords: ["RLHF 보상 모델 별도 학습", "DPO 보상 모델 무필요/직접 최적화"],
      minLength: 20,
      explanation: "RLHF의 별도 보상 모델과 DPO의 직접 확률 비 대체 구조 차이를 서술합니다[cite: 3].",
      hint: "별도 보상 모델의 훈련 필요 여부를 기술하세요[cite: 3]."
    },
    {
      id: "nlp-align-es-med-015",
      conceptId: "instruction-tuning-generalization-essay",
      difficulty: "medium",
      category: "정렬 학습 (Alignment)",
      questionType: "essay",
      prompt: "지시 학습(Instruction Tuning)이 사전 학습만 거친 모델 대비 새로운 지시(Zero-shot) 태스크에 강한 이유를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["다양한 지시", "SFT", "일반화"],
      modelAnswer: "사전 학습 모델은 단순히 다음 단어를 이어 완성하려 하지만, 지시 학습은 수많은 다양한 형태의 지시문과 응답 쌍으로 SFT 학습을 거친다. 이를 통해 지시문의 의도를 파악하는 일반화 능력이 형성되어, 학습 시 보지 못한 새로운 지시문도 이해하고 수행할 수 있게 된다[cite: 3].",
      rubricKeywords: ["다양한 지시문 SFT", "의도 파악 일반화"],
      minLength: 20,
      explanation: "다양한 지시문-응답 쌍 SFT를 통한 의도 파악 일반화 형성을 서술합니다[cite: 3].",
      hint: "다양한 지시문 학습을 통한 의도 파악 일반화 형성을 언급하세요[cite: 3]."
    },

    // ==========================================
    // 8. 디코딩 알고리즘 (15문항)
    // ==========================================
    {
      id: "nlp-dec-mc-med-001",
      conceptId: "auto-regressive-stopping-condition",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "LLM 추론 자동회귀 생성(Auto-regressive Generation)이 자율적으로 멈추는 종료 조건 2가지는?",
      options: [
        "특수 EOS 토큰이 생성되거나, 사전에 지정된 max_length 토큰 수에 도달할 때",
        "사용자가 컴퓨터 키보드를 누르거나 GPU가 꺼질 때",
        "확률값이 0이 되거나 입력 단어가 100개가 될 때",
        "모든 단어가 영어로 번역 완료될 때"
      ],
      answer: 0,
      explanation: "EOS 토큰이 출현하거나 지정한 최대 토큰 수(max_length)에 다다르면 추론을 종료합니다[cite: 3].",
      hint: "EOS 토큰 생성과 최대 토큰 수 도달입니다[cite: 3]."
    },
    {
      id: "nlp-dec-mc-med-002",
      conceptId: "greedy-vs-beam-search-compare",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Greedy Search와 Beam Search의 결정적 경로 선택 방식 차이는?",
      options: [
        "Greedy는 매 순간 1개 최상위 토큰만 선택하지만, Beam Search는 $k$개의 문장 누적 확률 후보 경로를 동시에 고려한다.",
        "Greedy는 무작위로 고르고, Beam Search는 역순으로 고른다.",
        "Greedy는 $k$개 경로를 보고, Beam Search는 1개만 본다.",
        "두 방식은 완전 동일하다."
      ],
      answer: 0,
      explanation: "Greedy는 직후 1개 토큰만 보고, Beam Search는 전체 문장 누적 확률을 기준으로 상위 $k$개 후보를 보존합니다[cite: 3].",
      hint: "단일 1개 선택과 $k$개 후보 유지의 차이입니다[cite: 3]."
    },
    {
      id: "nlp-dec-mc-med-003",
      conceptId: "temperature-formula-math",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Sampling 디코딩 시 Temperature $T$가 로짓 $z_i$에 적용되는 수식 형태 $\\frac{\\exp(z_i / T)}{\\sum \\exp(z_j / T)}$ 에 대한 해석은?",
      options: [
        "$T > 1$ 이면 $z_i / T$ 값들의 차이가 작아져 분포가 평평해지고, $T < 1$ 이면 차이가 커져 분포가 뾰족해진다.",
        "$T > 1$ 이면 무조건 가장 큰 로짓만 100% 선택된다.",
        "$T < 1$ 이면 로짓이 모두 음수가 된다.",
        "$T$ 값은 확률 분포에 아무 영향도 주지 않는다."
      ],
      answer: 0,
      explanation: "$T>1$ 이면 로짓 스코어 차이가 줄어들어 확률 분포가 Smooth해지고, $T<1$ 이면 스코어 차이가 증폭되어 Sharp해집니다[cite: 3].",
      hint: "로짓을 $T$로 나눌 때의 확률 분포 평평함/뾰족함 변화입니다[cite: 3]."
    },
    {
      id: "nlp-dec-mc-med-004",
      conceptId: "temperature-limit-zero",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Temperature $T$를 0으로 극한 설정($T \\rightarrow 0$)했을 때의 샘플링 동작은 무엇과 동일해지는가?",
      options: ["Greedy Search (가장 확률 높은 단어만 100% 선택)", "완전 무작위 균등 샘플링", "Beam Search (k=16)", "추론 즉시 중단"],
      answer: 0,
      explanation: "$T \\to 0$ 이면 확률 분포가 극도로 뾰족해져 가장 높은 스코어 단어 하나만 결정론적으로 고르는 Greedy Search와 같아집니다[cite: 3].",
      hint: "가장 스코어가 높은 1개 단어만 선택하는 결정론적 방식입니다[cite: 3]."
    },
    {
      id: "nlp-dec-mc-med-005",
      conceptId: "top-k-limitation-context",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Top-K Sampling의 한계점으로 가장 적절한 설명은?",
      options: [
        "확률 분포의 모양에 관계없이 항상 고정된 $K$개의 후보를 고려하므로, 문맥에 따라 부적절한 단어가 섞이거나 올바른 단어가 자릴 수 있다.",
        "계산 속도가 Beam Search의 100배로 느리다.",
        "항상 똑같은 문장만 출력한다.",
        "$K$값을 고정할 수 없고 매번 바뀐다."
      ],
      answer: 0,
      explanation: "문맥에 따라 적절한 후보 단어 수가 달라지는데 $K$를 고정값으로 정해두기 때문에 생기는 한계입니다[cite: 3].",
      hint: "문맥에 구애받지 않고 후보 개수 $K$가 고정되어 생기는 한계입니다[cite: 3]."
    },
    {
      id: "nlp-dec-mc-med-006",
      conceptId: "top-p-dynamic-k",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Top-P (Nucleus) Sampling이 Top-K의 한계를 극복하는 핵심 작동 방식은?",
      options: [
        "후보 단어 수를 고정하지 않고 누적 확률 $P$ 기준을 채울 때까지의 단어군을 동적으로 수집하여 고려한다.",
        "무조건 $P=1.0$으로 전체 단어를 다 포함시킨다.",
        "확률이 가장 낮은 단어만 고려한다.",
        "모든 단어의 확률을 무시하고 알파벳순으로 자른다."
      ],
      answer: 0,
      explanation: "Top-P는 누적 확률 $P$에 도달하는 지점까지 동적으로 단어 후보 개수를 조절하여 문맥에 적응합니다[cite: 3].",
      hint: "누적 확률 $P$를 기준으로 후보군 개수를 동적으로 조절합니다[cite: 3]."
    },
    {
      id: "nlp-dec-mc-med-007",
      conceptId: "decoding-algorithm-tradeoff-summary",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "디코딩 알고리즘별 특징 정리 중 올바르지 않은 것은?",
      options: [
        "Beam Search는 속도가 가장 빠르고 메모리를 전혀 안 쓴다.",
        "Greedy Decoding은 단순하고 빠르지만 전체 문장 최적해를 보장하지 못한다.",
        "Sampling with Temperature는 $T$로 창의성과 일관성을 조절할 수 있다.",
        "Top-P Sampling은 누적 확률 기준으로 품질과 다양성의 균형을 잡는다."
      ],
      answer: 0,
      explanation: "Beam Search는 $k$개의 후보를 유지하며 모델 추론을 여러 번 돌려야 하므로 계산 비용이 많이 듭니다[cite: 3].",
      hint: "Beam Search는 $k$개 후보를 유지하므로 연산 비용이 큽니다[cite: 3]."
    },
    {
      id: "nlp-dec-mc-med-008",
      conceptId: "repetition-penalty-concept",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "디코딩 과정에서 이전에 이미 생성된 토큰이 다시 선택될 확률을 줄여 무한 도돌이표 반복 현상을 방지하는 파라미터는?",
      options: ["Repetition Penalty (반복 페널티)", "Temperature", "Top-P", "Max Tokens"],
      answer: 0,
      explanation: "이전 출력 토큰의 로짓에 페널티를 부과하여 반복 텍스트 생성을 차단하는 Repetition Penalty입니다[cite: 3].",
      hint: "반복(Repetition)을 억제하는 페널티입니다[cite: 3]."
    },
    {
      id: "nlp-dec-mc-med-009",
      conceptId: "python-transformers-generate",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "HuggingFace Transformers 라이브러리에서 `model.generate()` 호출 시 Sampling 디코딩을 활성화하기 위해 설정해야 하는 인자는?",
      options: ["`do_sample=True`", "`do_sample=False`", "`use_greedy=True`", "`beam_size=1`"],
      answer: 0,
      explanation: "`do_sample=True`로 설정해야 무작위 확률 샘플링 디코딩이 작동합니다[cite: 3].",
      hint: "`do_sample` 인자를 True로 지정합니다[cite: 3]."
    },
    {
      id: "nlp-dec-sa-med-010",
      conceptId: "eos-sa",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "short-answer",
      prompt: "자동회귀 생성 시 모델이 출력을 완료했음을 알리고 추론을 종료하게 만드는 특수 토큰 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["EOS", "eos", "EOS 토큰", "<EOS>"],
      explanation: "End of Sequence(EOS) 토큰입니다[cite: 3].",
      hint: "End of Sequence 약자입니다[cite: 3]."
    },
    {
      id: "nlp-dec-sa-med-011",
      conceptId: "temperature-sa",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "short-answer",
      prompt: "Sampling 디코딩 시 Softmax 확률 분포의 뾰족함/평평함을 조절하는 하이퍼파라미터의 영문 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Temperature", "temperature", "온도"],
      explanation: "Temperature(온도) 파라미터입니다[cite: 3].",
      hint: "'온도'를 뜻하는 영단어입니다[cite: 3]."
    },
    {
      id: "nlp-dec-sa-med-012",
      conceptId: "top-k-sa",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "short-answer",
      prompt: "확률 상위 K개의 단어 후보군만 남기고 나머지를 배제하여 샘플링하는 디코딩 방식 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Top-K", "top-k", "Top-K Sampling", "Top-K 샘플링"],
      explanation: "Top-K Sampling 방식입니다[cite: 3].",
      hint: "Top-K 형태입니다[cite: 3]."
    },
    {
      id: "nlp-dec-sa-med-013",
      conceptId: "repetition-penalty-sa",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "short-answer",
      prompt: "이전에 출출된 토큰의 로짓 값을 차감하여 텍스트의 무한 반복 굴레를 방지하는 페널티 인자 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Repetition Penalty", "repetition penalty", "반복 페널티", "Repetition penalty"],
      explanation: "Repetition Penalty(반복 페널티) 입니다[cite: 3].",
      hint: "'반복'을 뜻하는 Repetition이 들어갑니다[cite: 3]."
    },
    {
      id: "nlp-dec-es-med-014",
      conceptId: "greedy-vs-beam-essay",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "essay",
      prompt: "Greedy Search와 Beam Search의 작동 방식 차이와 Beam Search가 갖는 이점을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Greedy", "Beam Search", "1개", "k개", "누적 확률"],
      modelAnswer: "Greedy Search는 매 시점 오직 가장 높은 확률의 단어 1개만을 탐욕적으로 선택한다. 반면 Beam Search는 상위 $k$개의 후보 경로를 보존하며 누적 확률을 계산하므로, 매 순간의 1등이 아니더라도 문장 전체 차원에서 최적인 고품질 문장을 찾을 수 있다[cite: 3].",
      rubricKeywords: ["Greedy 1개 선택", "Beam Search k개 보존", "문장 전체 누적 확률 최적"],
      minLength: 20,
      explanation: "Greedy의 순간 1개 선택과 Beam Search의 $k$개 후보 보존을 통한 전체 누적 확률 최적화 이점을 비교합니다[cite: 3].",
      hint: "단일 1개 선택과 k개 후보 유지를 설명하세요[cite: 3]."
    },
    {
      id: "nlp-dec-es-med-015",
      conceptId: "nucleus-sampling-essay",
      difficulty: "medium",
      category: "디코딩 알고리즘",
      questionType: "essay",
      prompt: "Top-P (Nucleus) Sampling이 Top-K Sampling보다 유연한 이유를 문맥별 후보군 크기 조절 관점에서 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Top-K", "Top-P", "고정", "누적 확률", "동적"],
      modelAnswer: "Top-K는 확률 분포 모양과 상관없이 고정된 K개 단어만 후보로 남긴다. 반면 Top-P는 누적 확률 합이 P에 달할 때까지 단어를 모으므로, 확실한 단어가 적을 때는 후보군을 넓히고 확실할 때는 후보군을 줄여 문맥에 맞게 동적으로 조절할 수 있다[cite: 3].",
      rubricKeywords: ["Top-K 고정 K개", "Top-P 누적 확률 P", "문맥에 따른 동적 조절"],
      minLength: 20,
      explanation: "Top-K의 고정 개수 한계와 Top-P의 누적 확률 $P$ 기반 동적 후보군 조절 이점을 작성합니다[cite: 3].",
      hint: "Top-K의 고정 후보 수와 Top-P의 동적 후보 수 조절을 기술하세요[cite: 3]."
    },

    // ==========================================
    // 9. 프롬프트 엔지니어링 (15문항)
    // ==========================================
    {
      id: "nlp-pe-mc-med-001",
      conceptId: "prompt-output-variation",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "동일한 LLM 모델이라 하더라도 프롬프트 작성 시 지시 방식이나 어조 조건을 어떻게 주느냐에 따라 나타나는 현상은?",
      options: [
        "생성되는 답변의 포맷, 어조, 내용 품질이 크게 변화한다.",
        "모델의 가중치 매개변수가 영구적으로 수정된다.",
        "답변 내용이 무조건 100% 동일하게 유지된다.",
        "모델 구동 GPU 메모리가 즉시 차오른다."
      ],
      answer: 0,
      explanation: "LLM은 프롬프트를 조건으로 하여 출력을 생성하므로 프롬프트 작성 방식에 따라 답변 특성이 크게 달라집니다[cite: 3].",
      hint: "프롬프트 조건에 따라 모델 출력이 크게 달라집니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-med-002",
      conceptId: "few-shot-example-quality",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "In-context Few-shot 프롬프팅 시 예시(Examples) 선택이 모델 성능에 미치는 영향으로 옳은 것은?",
      options: [
        "어떤 예시를 고르고 제공하느냐에 따라 모델의 테스트 예측 정확도가 크게 좌우된다.",
        "예시는 무작위 아무 문장이나 넣어도 정확도가 동일하다.",
        "예시 개수가 많으면 무조건 오답이 나온다.",
        "예시는 영어가 아니면 인식하지 못한다."
      ],
      answer: 0,
      explanation: "Liu 등의 연구에 따르면 Few-shot 예시의 품질과 관련성에 따라 모델의 성능이 크게 변동합니다[cite: 3].",
      hint: "어떤 예시를 고르느냐에 따라 정확도가 크게 변화합니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-med-003",
      conceptId: "knn-example-selection-principle",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "Few-shot 예시 선택 시 거리 기반 kNN 선택 알고리즘이 사용하는 기준은?",
      options: [
        "테스트 질의(Test Prompt)와 임베딩 공간상 거리가 가장 가까운(유사한) 훈련 예시들을 선택함",
        "테스트 질의와 가장 멀리 떨어진 예시들을 선택함",
        "알파벳 글자 수가 가장 긴 예시들만 선택함",
        "무작위 임의 추출"
      ],
      answer: 0,
      explanation: "kNN 예시 선택은 임베딩 공간에서 현재 테스트 질의와 가장 가까운 유사 예시들을 찾아 프롬프트에 제공합니다[cite: 3].",
      hint: "테스트 질문과 임베딩 공간상 거리가 가까운 유사 예시입니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-med-004",
      conceptId: "cot-reasoning-steps",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "Chain-of-Thought (CoT) 프롬프팅이 표준(Standard) 프롬프팅보다 복잡한 추론 문제에 강한 작동 원리는?",
      options: [
        "질문과 정답 사이에 중간 생각 단계(Reasoning steps)를 유도하여 단계별로 문제를 풀게 함으로써 정답률을 올림",
        "질문 텍스트의 글자 수를 2배로 늘려주기 때문에",
        "모델의 층을 즉석에서 추가해주기 때문에",
        "정답 확률을 무조건 100%로 고정해주기 때문에"
      ],
      answer: 0,
      explanation: "CoT는 중간 추론 과정을 생성하도록 유도해 복잡한 산술/논리 문제를 단계별로 풀어나가게 합니다[cite: 3].",
      hint: "중간 생각 단계(Reasoning steps)를 통해 문제를 해결합니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-med-005",
      conceptId: "zero-shot-cot-working",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "Kojima 등이 제안한 Zero-shot CoT에서 \"Let's think step by step\" 문구가 작동하는 방식은?",
      options: [
        "예시를 직접 제공하지 않고도 모델이 중간 추론 과정을 스스로 생성하기 시작하도록 프롬프팅 유도함",
        "모델 내 가중치 파라미터를 미세조정함",
        "외부 검색 엔진을 자동으로 구동시킴",
        "입력 텍스트를 한글로 변환함"
      ],
      answer: 0,
      explanation: "\"Let's think step by step\" 문구가 모델로 하여금 스스로 단계별 추론 텍스트를 출력하도록 이끕니다[cite: 3].",
      hint: "예시 없이도 단계별 생각 연쇄를 생성하도록 만듭니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-med-006",
      conceptId: "system-prompt-control",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "시스템 프롬프트(System Prompt)를 활용할 때의 이점으로 옳은 것은?",
      options: [
        "유저 쿼리와 무관하게 모델의 행동, 어조, 경계 규칙, 개인화 메모리를 추가 통제할 수 있다.",
        "모델 학습 속도를 10배 높일 수 있다.",
        "유저가 입력한 모든 오타를 자동으로 정정해준다.",
        "API 사용 비용을 0원으로 만든다."
      ],
      answer: 0,
      explanation: "System Prompt를 통해 챗봇의 행동 가이드라인, 페르소나, 안전 제약 등을 고정 설정할 수 있습니다[cite: 3].",
      hint: "대화 전체에서의 가이드라인, 어조, 페르소나를 통제합니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-med-007",
      conceptId: "skill-md-structure",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "SKILL.md 파일에 포함되는 기본 구성 요소가 아닌 것은?",
      options: ["GPU 하드웨어 가속기 드라이버 코드", "Skill 이름 및 설명 (description)", "단계별 지침 (Instructions)", "사용 예제 (Examples)"],
      answer: 0,
      explanation: "SKILL.md는 스킬 명칭/설명, 지침(Instructions), 예시(Examples)로 이루어진 프롬프트 문서입니다[cite: 3].",
      hint: "하드웨어 드라이버 코드는 프롬프트 문서 구성요소가 아닙니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-med-008",
      conceptId: "cot-model-scale-dependency",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "PaLM 등 연구에서 밝혀진 CoT(Chain-of-Thought) 프롬프팅 효과의 모델 규모(Model Scale) 의존성은?",
      options: [
        "모델 규모가 충분히 대형(예: 수십~수백억 이상)으로 커질수록 CoT로 인한 추론 성능 향상이 뚜렷해진다.",
        "소형 모델(0.1B)에서만 효과가 나타난다.",
        "모델 규모가 커지면 CoT 효과가 사라진다.",
        "모델 규모와 CoT 효과는 무관하다."
      ],
      answer: 0,
      explanation: "CoT 추론 능력도 대형 모델에서 발현되는 창발성의 일종으로 모델 크기가 커질수록 효과가 증대됩니다[cite: 3].",
      hint: "대형 모델 규모일수록 CoT 효과가 커집니다[cite: 3]."
    },
    {
      id: "nlp-pe-mc-med-009",
      conceptId: "persona-prompting-effect",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "LLM에 \"너는 친절한 초등학교 교사야\" 라고 페르소나를 부여했을 때 기대되는 효과는?",
      options: [
        "부여된 페르소나에 맞추어 전문 용어 대신 쉬운 단어와 친절한 어조로 답변 수준이 조정된다.",
        "모델이 스스로 학습 데이터를 추가 수집한다.",
        "수학 계산 결과가 무조건 0이 된다.",
        "답변이 영어로만 고정 출력된다."
      ],
      answer: 0,
      explanation: "페르소나 프롬프팅은 부여된 역할에 맞추어 답변 어조와 타겟 어휘 수준을 적절히 변형시킵니다[cite: 3].",
      hint: "부여된 역할(초등 교사)에 맞추어 어조와 설명 수준이 맞춰집니다[cite: 3]."
    },
    {
      id: "nlp-pe-sa-med-010",
      conceptId: "knn-example-selection-sa",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "short-answer",
      prompt: "Few-shot 프롬프트 작성 시 테스트 질문과 임베딩 공간상 거리가 가장 유사한 예시를 추출하는 선택 방식은?",
      options: [],
      answer: null,
      acceptedAnswers: ["kNN 예시 선택", "kNN 선택", "kNN", "거리 기반 예시 선택"],
      explanation: "kNN(k-Nearest Neighbors) 거리 기반 예시 선택 기법입니다[cite: 3].",
      hint: "kNN 또는 거리 기반 선택입니다[cite: 3]."
    },
    {
      id: "nlp-pe-sa-med-011",
      conceptId: "reasoning-steps-sa",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "short-answer",
      prompt: "CoT 프롬프팅에서 질문과 최종 정답 사이에 모델이 생성하도록 유도하는 단계별 생각 과정을 무엇이라 하는가?",
      options: [],
      answer: null,
      acceptedAnswers: ["추론 과정", "추론 단계", "Reasoning steps", "Reasoning", "reasoning"],
      explanation: "Reasoning steps(추론 과정) 입니다[cite: 3].",
      hint: "추론(Reasoning) 과정입니다[cite: 3]."
    },
    {
      id: "nlp-pe-sa-med-012",
      conceptId: "persona-sa",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "short-answer",
      prompt: "모델에게 특정 자격, 직업, 말투 같은 상징적 인격을 부여하여 답변 어조와 성격을 통제하는 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["페르소나", "페르소나 설정", "Persona", "persona"],
      explanation: "Persona(페르소나) 설정 기법입니다[cite: 3]."
    },
    {
      id: "nlp-pe-sa-med-013",
      conceptId: "skill-md-sa",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "short-answer",
      prompt: "특정 반복 업무 지침 및 예시를 표준화 문서로 작성하여 LLM이 자율 실행하도록 만드는 스킬 문서 파일명은?",
      options: [],
      answer: null,
      acceptedAnswers: ["SKILL.md", "skill.md", "Skill.md"],
      explanation: "SKILL.md 마크다운 파일입니다[cite: 3]."
    },
    {
      id: "nlp-pe-es-med-014",
      conceptId: "few-shot-knn-selection-essay",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "essay",
      prompt: "Few-shot 프롬프팅 시 무작위 예시 선택보다 kNN 거리 기반 유사 예시 선택이 모델 성능을 올리는 이유를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["유사", "임베딩", "패턴"],
      modelAnswer: "테스트 질문과 임베딩 거리가 가까운 유사 예시를 제시할 경우, 모델이 현재 질문과 맥락적으로 가장 관련된 해결 패턴과 출력 포맷을 쉽게 유추하여 올바른 정답을 도출하기 때문이다[cite: 3].",
      rubricKeywords: ["질문과 맥락적 유사", "관련 해결 패턴 유추"],
      minLength: 20,
      explanation: "테스트 질문과 관련성이 높은 유사 예시 제공에 따른 맥락 패턴 유추 용이성을 작성합니다[cite: 3]."
    },
    {
      id: "nlp-pe-es-med-015",
      conceptId: "zero-shot-cot-magic-phrase-essay",
      difficulty: "medium",
      category: "프롬프트 엔지니어링",
      questionType: "essay",
      prompt: "Zero-shot CoT에서 \"Let's think step by step\" 문구가 예시 없이도 모델의 추론 성능을 향상시키는 원리를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["단계별", "추론 텍스트", "생성"],
      modelAnswer: "해당 문구가 입력되면 모델은 즉각적인 정답 단어를 바로 내놓는 대신, 훈련 데이터상에서 학습한 단계별 사고 텍스트를 먼저 생성하도록 유도된다. 생성된 중간 추론 텍스트가 다음 토큰의 문맥이 되어 최종 정답률을 올린다[cite: 3].",
      rubricKeywords: ["중간 사고 텍스트 우선 생성", "문맥 반영 정답률 상승"],
      minLength: 20,
      explanation: "단계별 사고 텍스트 우선 생성 유도와 이를 통한 최종 정답 도출 원리를 서술합니다[cite: 3]."
    },

    // ==========================================
    // 10. LLM 평가 및 응용 (15문항)
    // ==========================================
    {
      id: "nlp-eval-mc-med-001",
      conceptId: "eval-single-task-vs-llm",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "단일 태스크 전용 모델(BERT 등) 평가와 달리, 거대 언어 모델(LLM) 평가가 가진 결정적 특징은?",
      options: [
        "LLM은 범주가 다양하므로 수많은 종합 벤치마크(지식, 수리, 코드 등)를 동시에 사용하여 다각도로 평가해야 함",
        "LLM은 Accuracy 지표 하나만 보면 완벽함",
        "LLM은 테스트 데이터셋이 필요 없음",
        "LLM은 평가를 수행할 수 없음"
      ],
      answer: 0,
      explanation: "LLM은 범주형 다중 능력을 보유하므로 MMLU, GSM8K, HumanEval 등 다각도 벤치마크로 종합 평가합니다[cite: 3].",
      hint: "수많은 종합 벤치마크로 다각도 평가해야 합니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-med-002",
      conceptId: "mmlu-benchmark-structure",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "MMLU(Massive Multitask Language Understanding) 벤치마크의 구성 특징으로 옳은 것은?",
      options: [
        "초급부터 대학교재 수준까지 57개의 인문, 사회, STEM 전문 학문 객관식 문제로 구성됨",
        "단순 파이썬 코드 실행 여부만 측정함",
        "영한 번역 문장 100만 개로만 구성됨",
        "이미지에서 개와 고양이를 분류하는 작업만 수행함"
      ],
      answer: 0,
      explanation: "MMLU는 57개 전문 분야 학문 지식을 평가하는 대표적 대형 벤치마크입니다[cite: 3].",
      hint: "57개 학문 분야 객관식 문제 모음입니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-med-003",
      conceptId: "gsm8k-nature",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "GSM8K 벤치마크가 평가하고자 하는 핵심 능력은 무엇인가?",
      options: [
        "초등 수준 수학 문장제 문제를 바탕으로 한 단계별 수리 추론 능력",
        "대학원 수준의 복잡한 물리학 암기 능력",
        "외국어 독해 속도",
        "이미지 생성 능력"
      ],
      answer: 0,
      explanation: "GSM8K는 초등 수학 문장제 풀이와 단계별 수리 추론을 평가합니다[cite: 3].",
      hint: "초등 수학 문장제 수리 추론 능력입니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-med-004",
      conceptId: "humaneval-pass-at-k",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "HumanEval 코드 생성 벤치마크에서 사용되는 pass@k 지표의 의미는?",
      options: [
        "모델이 생성한 $k$개의 코드 후보 중 최소 1개 이상이 단위 테스트를 통과할 확률",
        "$k$초 안에 완진되는 코드 작성 비율",
        "$k$줄 이내로 작성된 코드의 비율",
        "개발자 $k$명이 검수 통과시킨 비율"
      ],
      answer: 0,
      explanation: "pass@k는 생성된 $k$개 코드 중 1개라도 test case를 통과할 확률 지표입니다[cite: 3].",
      hint: "생성된 $k$개 코드 중 최소 1개가 테스트 통과할 확률입니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-med-005",
      conceptId: "rouge-vs-bleu-usage",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "BLEU 지표와 ROUGE 지표가 주로 사용되는 대표적 자연어 처리 태스크 매핑이 바른 것은?",
      options: [
        "BLEU는 기계 번역(Machine Translation) 평가, ROUGE는 문서 요약(Summarization) 평가",
        "BLEU는 문서 요약 평가, ROUGE는 기계 번역 평가",
        "BLEU와 ROUGE 모두 이미지 분류 전용 평가",
        "BLEU와 ROUGE 모두 음성 인식 전용 평가"
      ],
      answer: 0,
      explanation: "BLEU는 번역 평가의 표준, ROUGE는 요약 평가의 표준 지표입니다[cite: 2, 3].",
      hint: "BLEU는 번역, ROUGE는 요약 평가에 씁니다[cite: 2, 3]."
    },
    {
      id: "nlp-eval-mc-med-006",
      conceptId: "rag-retrieval-augmented-generation",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "RAG(Retrieval-Augmented Generation) 시스템의 기본 동작 순서로 가장 바른 것은?",
      options: [
        "유저 질문 $\\rightarrow$ 외부 Vector DB 문서 검색 $\\rightarrow$ 검색 문서를 프롬프트에 동봉 $\\rightarrow$ LLM 근거 답변 생성",
        "LLM 답변 생성 $\\rightarrow$ 외부 DB 검색 $\\rightarrow$ 질문 수정",
        "외부 DB 수정 $\\rightarrow$ 질문 삭제 $\\rightarrow$ LLM 가중치 업데이트",
        "유저 질문 $\\rightarrow$ LLM 가중치 재학습 $\\rightarrow$ 답변 생성"
      ],
      answer: 0,
      explanation: "RAG는 질문과 관련된 외부 문서를 DB에서 검색(Retrieval)해 프롬프트에 동봉 후 답변을 생성(Generation)합니다[cite: 3].",
      hint: "문서 검색 후 프롬프트 동봉, 그리고 답변 생성 순서입니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-med-007",
      conceptId: "perplexity-definition-math",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "Perplexity(PPL) 수치와 언어 모델 예측 성능 간의 관계로 올바른 것은?",
      options: [
        "PPL 수치가 낮을수록 언어 모델이 문장을 높은 확률로 자연스럽게 예측함을 의미한다.",
        "PPL 수치가 높을수록 언어 모델의 성능이 뛰어나다.",
        "PPL 수치는 무조건 100 이상이어야 한다.",
        "PPL 수치는 오버피팅 정도만 측정할 수 있다."
      ],
      answer: 0,
      explanation: "Perplexity는 헷갈리는 정도로, PPL 값이 낮을수록 모델이 문장을 자연스럽고 우수하게 예측한다는 뜻입니다[cite: 3].",
      hint: "PPL 수치가 낮을수록 우수한 성능입니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-med-008",
      conceptId: "sentence-bert-embedding",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "Sentence-BERT가 두 문장의 의미적 유사도를 정밀 측정하는 방식은?",
      options: [
        "BERT를 거쳐 나온 토큰 벡터들을 평균(Mean Pooling)내어 문장 벡터를 만든 후 Cosine Similarity를 계산한다.",
        "두 문장의 글자 수를 비교한다.",
        "두 문장의 단어 알파벳 순서를 정렬한다.",
        "두 문장을 무작위 숫자로 변경한다."
      ],
      answer: 0,
      explanation: "Sentence-BERT는 문장 전체에 대한 임베딩 벡터를 구한 뒤 Cosine Similarity로 유사도를 평가합니다[cite: 3].",
      hint: "문장 임베딩 벡터 간 Cosine Similarity를 계산합니다[cite: 3]."
    },
    {
      id: "nlp-eval-mc-med-009",
      conceptId: "benchmarks-humaneval-pass1",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "multiple-choice",
      prompt: "HumanEval 평가 지표 중 `pass@1` 스코어가 측정하는 것은 무엇인가?",
      options: [
        "모델이 생성한 1개의 코드가 단위 테스트를 바로 통과하는 정밀 확률 비율",
        "1초 만에 작성을 완료한 코드의 비율",
        "1줄짜리 코드의 작성 정밀도",
        "개발자 1명이 검수한 결과"
      ],
      answer: 0,
      explanation: "`pass@1`은 단 1회 생성한 코드 샘플이 바로 test case를 통과할 확률 정밀도입니다[cite: 3].",
      hint: "단 1회 생성 코드가 한 번에 테스트를 통과할 확률입니다[cite: 3]."
    },
    {
      id: "nlp-eval-sa-med-010",
      conceptId: "humaneval-sa",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "short-answer",
      prompt: "OpenAI가 제안한 파이썬 코드 생성 및 단위 테스트 통과 능력을 측정하는 대표 벤치마크는?",
      options: [],
      answer: null,
      acceptedAnswers: ["HumanEval", "humaneval", "Human-Eval"],
      explanation: "HumanEval 벤치마크 입니다[cite: 3].",
      hint: "HumanEval 벤치마크 명칭입니다[cite: 3]."
    },
    {
      id: "nlp-eval-sa-med-011",
      conceptId: "ppl-sa",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "short-answer",
      prompt: "언어 모델이 텍스트를 예측할 때 느끼는 헷갈림 정도로, 낮을수록 우수한 성능 지표의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["PPL", "ppl", "Perplexity"],
      explanation: "Perplexity(PPL) 입니다[cite: 3].",
      hint: "PPL 3글자 약자입니다[cite: 3]."
    },
    {
      id: "nlp-eval-sa-med-012",
      conceptId: "rouge-sa",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "short-answer",
      prompt: "문서 요약 평가 시 사람이 쓴 정답 요약문과의 단어 겹침 정밀도를 계산하는 지표 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["ROUGE", "rouge", "ROUGE score"],
      explanation: "ROUGE 평가 지표입니다[cite: 3]."
    },
    {
      id: "nlp-eval-sa-med-013",
      conceptId: "vector-db-sa",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "short-answer",
      prompt: "RAG 시스템 구축 시 수많은 문서 임베딩 벡터들을 저장하고 유사도 검색을 수행하는 전용 DB는?",
      options: [],
      answer: null,
      acceptedAnswers: ["Vector DB", "vector db", "벡터 DB", "벡터 데이터베이스", "Vector Database"],
      explanation: "Vector DB(벡터 데이터베이스) 입니다[cite: 3]."
    },
    {
      id: "nlp-eval-es-med-014",
      conceptId: "rag-principle-essay",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "essay",
      prompt: "RAG(Retrieval-Augmented Generation) 시스템의 동작 과정을 '검색(Retrieval)'과 '생성(Generation)' 단계로 구분하여 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["검색", "생성", "Vector DB", "프롬프트"],
      modelAnswer: "1) 검색(Retrieval) 단계: 유저 질문을 임베딩하여 Vector DB에서 관련 최신/외부 문서를 찾는다. 2) 생성(Generation) 단계: 검색된 문서를 프롬프트에 참고 지문으로 포함하여 LLM이 근거 기반의 정확한 답변을 생성하게 한다[cite: 3].",
      rubricKeywords: ["Vector DB 문서 검색", "프롬프트 동봉", "근거 기반 답변 생성"],
      minLength: 20,
      explanation: "외부 문서 검색 단계와 프롬프트 기반 근거 답변 생성 단계를 작성합니다[cite: 3]."
    },
    {
      id: "nlp-eval-es-med-015",
      conceptId: "humaneval-passk-essay",
      difficulty: "medium",
      category: "LLM 평가 및 응용",
      questionType: "essay",
      prompt: "HumanEval 평가 지표인 `pass@1`과 `pass@10`의 개념과 측정 목적 차이를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["pass@1", "pass@10", "1회", "10회", "확률"],
      modelAnswer: "`pass@1`은 모델이 1회 생성한 코드 샘플이 곧바로 테스트를 통과할 확률로 단번에 올바른 코드를 내는 정밀성을 측정한다. `pass@10`은 10회 생성한 후보 중 최소 1개가 통과할 확률로 모델이 정답을 만들어낼 수 있는 잠재 능력을 측정한다[cite: 3].",
      rubricKeywords: ["pass@1 1회 생성 정밀성", "pass@10 10회 중 최소 1회 잠재 능력"],
      minLength: 20,
      explanation: "1회 생성 정확성(pass@1)과 10회 생성 중 최소 1회 성공 확률(pass@10)을 비교합니다[cite: 3]."
    }
  ]
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
