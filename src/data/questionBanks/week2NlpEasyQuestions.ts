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
  easy: [
    // ==========================================
    // 1. 단답형 (10문항)
    // ==========================================
    {
      id: "nlp-easy-sa-001",
      conceptId: "one-hot-encoding",
      difficulty: "easy",
      category: "워드 임베딩",
      questionType: "short-answer",
      prompt: "단어 사전 크기만큼의 차원에서 한 원소만 1이고 나머지는 모두 0인 벡터 표현 방식을 무엇이라 하는가?",
      options: [],
      answer: null,
      acceptedAnswers: ["원-핫 인코딩", "원핫 인코딩", "one-hot encoding", "One-hot encoding"],
      explanation: "원-핫 인코딩은 단어를 쪼갤 수 없는 기호로 취급하여 희소 벡터로 변환하는 표현 방식입니다[cite: 2].",
      hint: "단어 하나당 하나의 요소만 1로 켜지는 방식입니다[cite: 2]."
    },
    {
      id: "nlp-easy-sa-002",
      conceptId: "word2vec-skipgram",
      difficulty: "easy",
      category: "워드 임베딩",
      questionType: "short-answer",
      prompt: "Word2Vec의 두 가지 알고리즘 중 중심 단어를 통해 주변 단어들을 예측하는 모델을 영어로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Skip-gram", "Skip-grams", "skip-gram", "skipgram"],
      explanation: "Skip-gram은 중심 단어 하나를 입력받아 주변 문맥 단어들을 예측하도록 학습합니다[cite: 2].",
      hint: "중심에서 주변 단어로 건너뛰며 예측하는 방식입니다[cite: 2]."
    },
    {
      id: "nlp-easy-sa-003",
      conceptId: "word2vec-cbow",
      difficulty: "easy",
      category: "워드 임베딩",
      questionType: "short-answer",
      prompt: "Word2Vec 알고리즘 중 주변 단어들의 집합을 가지고 중심 단어를 예측하는 방식의 약자를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["CBOW", "cbow"],
      explanation: "Continuous Bag of Words(CBOW)는 주변 문맥 단어를 합쳐 중심 단어를 맞춥니다[cite: 2].",
      hint: "Continuous Bag of Words의 약자입니다[cite: 2]."
    },
    {
      id: "nlp-easy-sa-004",
      conceptId: "rnn-hidden-state",
      difficulty: "easy",
      category: "RNN",
      questionType: "short-answer",
      prompt: "RNN에서 이전 타임스텝의 정보를 담고 있어 다음 시점으로 순환하여 전달되는 상태 벡터의 명칭을 영문으로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["hidden state", "Hidden State", "hidden_state"],
      explanation: "RNN은 $h_t$ 형태의 hidden state를 통해 과거의 시퀀스 정보를 기억하고 유지합니다[cite: 2].",
      hint: "은닉 상태를 뜻하는 영문 표기입니다[cite: 2]."
    },
    {
      id: "nlp-easy-sa-005",
      conceptId: "vanishing-gradient",
      difficulty: "easy",
      category: "RNN",
      questionType: "short-answer",
      prompt: "역전파 진행 시 앞쪽 층으로 갈수록 기울기가 0에 가까워져 장기 의존성 학습이 어려워지는 현상을 무엇이라 하는가?",
      options: [],
      answer: null,
      acceptedAnswers: ["기울기 소실", "기울기 소실 문제", "vanishing gradient", "Vanishing Gradient"],
      explanation: "긴 시퀀스를 다룰 때 기울기가 계속 곱해지면서 오차 신호가 소실되는 현상입니다[cite: 2].",
      hint: "기울기(Gradient)가 사라진다(Vanishing)는 뜻입니다[cite: 2]."
    },
    {
      id: "nlp-easy-sa-006",
      conceptId: "lstm-forget-gate",
      difficulty: "easy",
      category: "LSTM",
      questionType: "short-answer",
      prompt: "LSTM에서 이전 Cell state 정보 중 무엇을 버리고 유지할지 결정하는 게이트는 무엇인가?",
      options: [],
      answer: null,
      acceptedAnswers: ["Forget gate", "forget gate", "망각 게이트", "Forget Gate"],
      explanation: "Forget gate는 시그모이드 함수를 통해 이전 cell state에서 버릴 정보 비율을 구합니다[cite: 2].",
      hint: "잊어버린다는 의미의 영단어 Forget이 들어갑니다[cite: 2]."
    },
    {
      id: "nlp-easy-sa-007",
      conceptId: "seq2seq-teacher-forcing",
      difficulty: "easy",
      category: "Seq2Seq",
      questionType: "short-answer",
      prompt: "Seq2Seq 학습 시 디코더 입력으로 이전 예측값 대신 정답 단어를 강제로 넣어주어 학습을 안정화하는 기법은 무엇인가?",
      options: [],
      answer: null,
      acceptedAnswers: ["Teacher Forcing", "teacher forcing", "티처 포싱"],
      explanation: "Teacher Forcing은 예측 능력이 낮은 초기 학습 단계에서 정답을 디코더 입력으로 고정하여 안정적 학습을 돕습니다[cite: 2].",
      hint: "교사(Teacher)가 강제로(Forcing) 정답을 가르쳐주는 기법입니다[cite: 2]."
    },
    {
      id: "nlp-easy-sa-008",
      conceptId: "transformer-paper",
      difficulty: "easy",
      category: "Transformer",
      questionType: "short-answer",
      prompt: "2017년 구글이 트랜스포머 아키텍처를 처음으로 제안한 논문의 제목을 영문으로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Attention Is All You Need", "Attention is All You Need", "Attention Is All You Need."],
      explanation: "Vaswani 등이 발표한 'Attention Is All You Need' 논문에서 순환 구조 없는 트랜스포머가 처음 제시되었습니다[cite: 2].",
      hint: "필요한 것은 오직 Attention뿐이라는 의미의 문장입니다[cite: 2]."
    },
    {
      id: "nlp-easy-sa-009",
      conceptId: "llm-hallucination",
      difficulty: "easy",
      category: "거대 언어 모델",
      questionType: "short-answer",
      prompt: "거대 언어 모델이 사실이 아닌 내용을 마치 진실인 것처럼 그럴듯하게 거짓 응답을 생성하는 현상을 무엇이라 하는가?",
      options: [],
      answer: null,
      acceptedAnswers: ["환각", "환각 현상", "hallucination", "Hallucination"],
      explanation: "LLM이 잘못된 정보나 없는 사실을 유창하게 답변하는 현상을 환각(Hallucination)이라고 합니다[cite: 3].",
      hint: "헛것을 본다는 의미의 단어입니다[cite: 3]."
    },
    {
      id: "nlp-easy-sa-010",
      conceptId: "rlhf",
      difficulty: "easy",
      category: "선호 학습",
      questionType: "short-answer",
      prompt: "사람의 피드백을 통해 보상 모델을 만들고 이를 강화학습으로 최적화하는 InstructGPT의 정렬 학습 기법 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["RLHF", "rlhf"],
      explanation: "Reinforcement Learning from Human Feedback(RLHF)은 사람의 선호도를 가치관으로 반영하는 핵심 정렬 기법입니다[cite: 3].",
      hint: "Reinforcement Learning from Human Feedback의 줄임말입니다[cite: 3]."
    },

    // ==========================================
    // 2. 객관식 (85문항)
    // ==========================================
    {
      id: "nlp-easy-mc-001",
      conceptId: "one-hot-orthogonality",
      difficulty: "easy",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "원-핫 벡터들 간의 내적(Dot product) 결과는 항상 얼마가 되는가?",
      options: ["0", "1", "-1", "단어 사전 크기"],
      answer: 0,
      explanation: "서로 다른 원-핫 벡터는 1인 위치가 겹치지 않아 직교하므로 내적 결과가 항상 0이 됩니다[cite: 2].",
      hint: "두 원-핫 벡터는 완전히 서로 직교합니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-002",
      conceptId: "one-hot-limitation",
      difficulty: "easy",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "다음 중 원-핫 인코딩의 단점으로 올바르지 않은 것은?",
      options: [
        "단어 수가 많아지면 벡터 차원이 비효율적으로 커진다.",
        "벡터 내 대부분의 원소가 0으로 채워진다.",
        "단어 간의 의미적 유사성을 표현하지 못한다.",
        "밀집 실수 벡터 형태로 차원이 압축된다."
      ],
      answer: 3,
      explanation: "밀집 실수 벡터 형태로 표현되는 것은 원-핫 인코딩이 아닌 워드 임베딩의 특징입니다[cite: 2].",
      hint: "원-핫 인코딩은 0이 많은 희소(Sparse) 벡터입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-003",
      conceptId: "distributional-hypothesis",
      difficulty: "easy",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "'단어의 의미는 주변 단어들과의 관계에 의해 결정된다'는 가설의 이름은?",
      options: [
        "분포 가설 (Distributional hypothesis)",
        "언어학적 불확정성 가설",
        "원-핫 인코딩 가설",
        "볼츠만 가설"
      ],
      answer: 0,
      explanation: "현대 워드 임베딩의 기본 바탕이 되는 아이디어는 분포 가설(distributional hypothesis)입니다[cite: 2].",
      hint: "'You shall know a word by the company it keeps'와 관련된 가설입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-004",
      conceptId: "word-embedding-feature",
      difficulty: "easy",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "워드 임베딩 벡터의 형태적 특징으로 가장 적절한 것은?",
      options: [
        "고차원의 희소(Sparse) 벡터",
        "저차원의 밀집(Dense) 실수 벡터",
        "모든 원소가 0인 벡터",
        "문자열로 구성된 배열"
      ],
      answer: 1,
      explanation: "워드 임베딩은 연속적인 값을 가진 저차원의 밀집(dense) 실수 벡터 표현입니다[cite: 2].",
      hint: "100~300차원 등의 빽빽한 실수값 형태입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-005",
      conceptId: "word2vec-year",
      difficulty: "easy",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec을 발표한 연구진이 속했던 기업은 어디인가?",
      options: ["Google", "Microsoft", "Meta", "Adobe"],
      answer: 0,
      explanation: "Word2Vec은 2013년 Google의 Tomas Mikolov 연구진에 의해 발표되었습니다[cite: 2].",
      hint: "Mikolov 등이 속했던 대표적 글로벌 IT 기업입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-006",
      conceptId: "skipgram-vs-cbow-speed",
      difficulty: "easy",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec 모델 중 일반적으로 학습 속도가 더 빠른 알고리즘은 무엇인가?",
      options: ["CBOW", "Skip-gram", "RNN", "Transformer"],
      answer: 0,
      explanation: "CBOW는 문맥 단어들을 합쳐 타겟 단어 하나를 맞추므로 Skip-gram보다 학습 속도가 빠릅니다[cite: 2].",
      hint: "자주 등장하는 단어 학습에 유리하며 속도가 빠른 편입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-007",
      conceptId: "skipgram-advantage",
      difficulty: "easy",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Skip-gram 방식이 CBOW 방식에 비해 가지는 대표적인 장점은?",
      options: [
        "학습 속도가 훨씬 빠르다.",
        "희귀 단어(Rare words)나 구 표현 처리에 강하다.",
        "계산량이 매우 적다.",
        "원-핫 인코딩보다 차원이 크다."
      ],
      answer: 1,
      explanation: "Skip-gram은 한 중심 단어로 여러 주변 단어를 예측하므로 적은 데이터나 희귀 단어 학습에 강합니다[cite: 2].",
      hint: "드물게 등장하는 단어를 학습할 때 상대적 이점이 있습니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-008",
      conceptId: "sequential-data-example",
      difficulty: "easy",
      category: "순차적 데이터",
      questionType: "multiple-choice",
      prompt: "다음 중 자연어 처리 분야의 대표적인 순차 데이터(Sequential Data)는?",
      options: ["텍스트(Text)", "독립된 단일 숫자", "단일 픽셀 값", "엑셀의 한 셀에 저장된 성적"],
      answer: 0,
      explanation: "텍스트는 단어가 나열된 순서가 의미를 결정하는 순차적 데이터입니다[cite: 2].",
      hint: "문장 내 단어 순서가 중요한 데이터 유형입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-009",
      conceptId: "sequential-property",
      difficulty: "easy",
      category: "순차적 데이터",
      questionType: "multiple-choice",
      prompt: "순차 데이터의 주요 특징 3가지에 해당하지 않는 것은?",
      options: [
        "입력 순서가 중요하다.",
        "장기 의존성(Long-term dependency)이 존재할 수 있다.",
        "데이터의 길이가 고정되어 있다.",
        "가변 길이(Variable length)를 가진다."
      ],
      answer: 2,
      explanation: "순차 데이터는 문장의 길이처럼 길이가 제각각인 가변 길이를 특징으로 합니다[cite: 2].",
      hint: "문장마다 단어의 개수가 서로 다른지 생각해보세요[cite: 2]."
    },
    {
      id: "nlp-easy-mc-010",
      conceptId: "mlp-limitation",
      difficulty: "easy",
      category: "순차적 데이터",
      questionType: "multiple-choice",
      prompt: "전통적인 신경망(MLP)이 가변 길이 텍스트 처리에 적합하지 않은 이유는?",
      options: [
        "입력 벡터의 크기가 고정되어 있기 때문에",
        "학습 속도가 너무 빨라서",
        "은닉층을 사용할 수 없어서",
        "출력층에 활성화 함수를 쓰지 못해서"
      ],
      answer: 0,
      explanation: "MLP나 CNN 같은 전통적 구조는 고정된 크기의 입력만 받아 가변 길이 시퀀스 처리에 한계가 있습니다[cite: 2].",
      hint: "입력 레이어의 노드 수가 고정되어 있습니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-011",
      conceptId: "rnn-weight-sharing",
      difficulty: "easy",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "RNN의 파라미터 효율성이 피드포워드 신경망보다 뛰어난 주요 이유는?",
      options: [
        "각 시점(Time step)마다 동일한 가중치(Weight)를 공유하여 사용하기 때문",
        "가중치를 전혀 학습하지 않기 때문",
        "은닉층의 노드 수가 시점마다 2배씩 늘어나기 때문",
        "경사하강법을 사용하지 않기 때문"
      ],
      answer: 0,
      explanation: "RNN은 모든 타임스텝에서 동일한 가중치 매트릭스($W_{xh}, W_{hh}$ 등)를 재사용합니다[cite: 2].",
      hint: "시점 $t=1, 2, 3$에 모두 같은 W 파라미터가 사용됩니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-012",
      conceptId: "rnn-activation",
      difficulty: "easy",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "기본 RNN에서 은닉 상태 $h_t$를 업데이트할 때 주로 사용하는 활성화 함수는?",
      options: ["tanh", "ReLU", "Softmax", "Sigmoid"],
      answer: 0,
      explanation: "기본 RNN의 은닉 상태 업데이트 수식 $h_t = \tanh(W_{hh}h_{t-1} + W_{xh}x_t)$에는 tanh가 사용됩니다[cite: 2].",
      hint: "-1과 1 사이의 출력을 만드는 하이퍼볼릭 탄젠트 함수입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-013",
      conceptId: "rnn-task-type-sentiment",
      difficulty: "easy",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "영화 리뷰 문장을 입력받아 '긍정' 또는 '부정' 하나의 값을 예측하는 RNN 구조 유형은?",
      options: ["many-to-one", "one-to-many", "one-to-one", "many-to-many"],
      answer: 0,
      explanation: "여러 단어로 구성된 문장(many)을 받아 단일 감정 라벨(one)을 출력하므로 many-to-one 구조입니다[cite: 2].",
      hint: "여러 개의 입력 토큰에서 하나의 분류 결과로 모아집니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-014",
      conceptId: "rnn-task-type-captioning",
      difficulty: "easy",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "한 장의 이미지를 입력받아 이를 설명하는 단어 시퀀스 문장을 생성하는 유형은?",
      options: ["one-to-many", "many-to-one", "many-to-many", "one-to-one"],
      answer: 0,
      explanation: "단일 이미지 입력(one)으로부터 설명 문장 단어열(many)을 만들어내므로 one-to-many 구조입니다[cite: 2].",
      hint: "이미지 캡셔닝(Image Captioning)의 입출력 관계입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-015",
      conceptId: "rnn-task-type-translation",
      difficulty: "easy",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "입력 언어 문장을 받아 다른 언어 문장으로 출력하는 기계 번역 태스크의 RNN 구조는?",
      options: ["many-to-many", "one-to-one", "one-to-many", "many-to-one"],
      answer: 0,
      explanation: "입력 단어 시퀀스(many)를 처리하여 출력 단어 시퀀스(many)를 만드므로 many-to-many에 해당합니다[cite: 2].",
      hint: "시퀀스를 시퀀스로 바꾸는 작업입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-016",
      conceptId: "lstm-year",
      difficulty: "easy",
      category: "LSTM",
      questionType: "multiple-choice",
      prompt: "RNN의 기울기 소실 문제를 극복하기 위해 LSTM이 제안된 연도는?",
      options: ["1997년", "2010년", "2014년", "2017년"],
      answer: 0,
      explanation: "LSTM은 1997년 Hochreiter와 Schmidhuber에 의해 최초 제안되었습니다[cite: 2].",
      hint: "1990년대 후반에 제안된 아키텍처입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-017",
      conceptId: "lstm-state-type",
      difficulty: "easy",
      category: "LSTM",
      questionType: "multiple-choice",
      prompt: "LSTM이 갖고 있는 두 가지 상태 벡터에 해당하는 조합은?",
      options: [
        "Hidden state, Cell state",
        "Hidden state, Attention state",
        "Input state, Output state",
        "Memory state, Gate state"
      ],
      answer: 0,
      explanation: "LSTM은 단기 정보를 위한 hidden state ($h_t$)와 장기 정보를 위한 cell state ($C_t$)를 가집니다[cite: 2].",
      hint: "단기 정보($h_t$)와 장기 정보($C_t$)용 상태 벡터입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-018",
      conceptId: "lstm-cell-state-role",
      difficulty: "easy",
      category: "LSTM",
      questionType: "multiple-choice",
      prompt: "LSTM에서 장기 정보(Long-term information)를 전달 및 저장하는 핵심 상태는?",
      options: ["Cell state ($C_t$)", "Hidden state ($h_t$)", "Input gate", "Output gate"],
      answer: 0,
      explanation: "Cell state는 컨베이어 벨트처럼 체인 전체를 직선으로 관통하며 장기 정보를 유지시킵니다[cite: 2].",
      hint: "$C_t$ 기호로 표현되는 메인 상태 통로입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-019",
      conceptId: "lstm-input-gate",
      difficulty: "easy",
      category: "LSTM",
      questionType: "multiple-choice",
      prompt: "LSTM의 게이트 중 '새로운 정보 중 얼마나 Cell state에 기록할지' 결정하는 게이트는?",
      options: ["Input gate", "Forget gate", "Output gate", "Reset gate"],
      answer: 0,
      explanation: "Input gate는 현재 입력과 이전 hidden state를 바탕으로 새로운 정보를 얼마만큼 저장할지 결정합니다[cite: 2].",
      hint: "새 정보를 써넣는(Input) 역할을 의미합니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-020",
      conceptId: "lstm-output-gate",
      difficulty: "easy",
      category: "LSTM",
      questionType: "multiple-choice",
      prompt: "LSTM에서 Cell state의 정보 중 얼마만큼을 Hidden state로 출력할지 결정하는 게이트는?",
      options: ["Output gate", "Forget gate", "Input gate", "Update gate"],
      answer: 0,
      explanation: "Output gate는 cell state 값에 tanh를 씌운 후 내보낼 양을 제어하여 $h_t$를 생성합니다[cite: 2].",
      hint: "내보낸다(Output)는 의미를 갖고 있습니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-021",
      conceptId: "seq2seq-encoder-role",
      difficulty: "easy",
      category: "Seq2Seq",
      questionType: "multiple-choice",
      prompt: "Seq2Seq 모델에서 인코더(Encoder)의 주요 역할은?",
      options: [
        "입력 문장의 정보를 압축하여 고정 차원의 벡터로 만드는 역할",
        "타겟 언어의 단어를 순차적으로 생성하는 역할",
        "이미지 픽셀을 분행하는 역할",
        "손실 함수를 계산하는 역할"
      ],
      answer: 0,
      explanation: "인코더는 입력 시퀀스를 한 타임스텝씩 읽어 고정 차원의 컨텍스트 벡터 표현으로 인코딩합니다[cite: 2].",
      hint: "입력된 전체 텍스트 정보를 요약하는 파트입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-022",
      conceptId: "seq2seq-decoder-role",
      difficulty: "easy",
      category: "Seq2Seq",
      questionType: "multiple-choice",
      prompt: "Seq2Seq 모델에서 디코더(Decoder)의 주요 역할은?",
      options: [
        "인코딩된 벡터 표현을 조건으로 타겟 문장을 순차 생성하는 역할",
        "입력 텍스트를 원-핫 벡터로 변환하는 역할",
        "학습률(Learning rate)을 조절하는 역할",
        "단어 사전을 만드는 역할"
      ],
      answer: 0,
      explanation: "디코더는 인코더의 압축 벡터를 전달받아 출력 시퀀스를 만들어냅니다[cite: 2].",
      hint: "암호화된 정보를 해석하여 출력 문장을 내놓습니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-023",
      conceptId: "seq2seq-greedy-inference",
      difficulty: "easy",
      category: "Seq2Seq",
      questionType: "multiple-choice",
      prompt: "Seq2Seq 디코딩 단계에서 매 순간 가장 확률이 높은 단어 하나만 선택하는 방식은?",
      options: ["Greedy Inference", "Beam Search", "Nucleus Sampling", "Random Walk"],
      answer: 0,
      explanation: "Greedy Search/Inference는 매 시점 가장 높은 확률을 가진 단어만을 단순 선택합니다[cite: 2, 3].",
      hint: "탐욕스럽게(Greedy) 최고 확률만 고릅니다[cite: 2, 3]."
    },
    {
      id: "nlp-easy-mc-024",
      conceptId: "seq2seq-beam-search",
      difficulty: "easy",
      category: "Seq2Seq",
      questionType: "multiple-choice",
      prompt: "매 단계마다 k개의 가장 유망한 후보 경로를 유지하면서 탐색하는 디코딩 기법은?",
      options: ["Beam Search", "Greedy Search", "Random Sampling", "Gradient Descent"],
      answer: 0,
      explanation: "Beam Search는 k개의 빔 크기만큼 후보를 보존하며 최적 시퀀스를 찾습니다[cite: 2, 3].",
      hint: "k개의 빔(Beam) 크기를 정해 유지합니다[cite: 2, 3]."
    },
    {
      id: "nlp-easy-mc-025",
      conceptId: "bottleneck-problem",
      difficulty: "easy",
      category: "Attention",
      questionType: "multiple-choice",
      prompt: "Seq2Seq에서 인코더가 전체 문장을 단 하나의 고정 크기 벡터로 압축할 때 발생하는 정보 손실 현상은?",
      options: [
        "Bottleneck problem (병목 현상)",
        "Overfitting problem",
        "Vanishing gradient problem",
        "Dead neuron problem"
      ],
      answer: 0,
      explanation: "긴 문장 전체를 고정 길이 벡터 하나에 우겨넣다 생기는 정보 손실을 Bottleneck 문제라 합니다[cite: 2].",
      hint: "병 목(Bottleneck)처럼 입구가 좁아 생기는 현상입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-026",
      conceptId: "attention-solution",
      difficulty: "easy",
      category: "Attention",
      questionType: "multiple-choice",
      prompt: "Attention 메커니즘이 Bottleneck 문제를 해결하는 핵심 원리는?",
      options: [
        "디코더가 인코더의 모든 hidden state를 직접 참조 및 선택적 집중할 수 있게 하여",
        "인코더의 크기를 100배 늘려 정보를 저장하여",
        "단어 사전을 삭제하여",
        "모든 단어를 0으로 치환하여"
      ],
      answer: 0,
      explanation: "Attention은 인코더의 모든 은닉 상태에 접근해 필요한 부분의 가중합(Context vector)을 계산합니다[cite: 2].",
      hint: "인코더 전체 시점의 hidden state를 바로 찾아봅니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-027",
      conceptId: "attention-bleu",
      difficulty: "easy",
      category: "Attention",
      questionType: "multiple-choice",
      prompt: "기계번역 결과가 사람의 번역 결과와 얼마나 유사한지 평가하는 대표적인 지표는?",
      options: ["BLEU score", "MSE", "Accuracy", "F1 score"],
      answer: 0,
      explanation: "BLEU(Bilingual Evaluation Understudy) score는 기계 번역의 평가 지표로 널리 쓰입니다[cite: 2].",
      hint: "번역의 질을 평가하는 n-gram 기반 지표입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-028",
      conceptId: "attention-qkv",
      difficulty: "easy",
      category: "Self-Attention",
      questionType: "multiple-choice",
      prompt: "Self-Attention 메커니즘에서 각 단어를 변환하여 사용하는 3가지 벡터가 아닌 것은?",
      options: ["Query", "Key", "Value", "Result"],
      answer: 3,
      explanation: "Self-Attention은 입력 단어마다 Query(Q), Key(K), Value(V) 벡터를 생성하여 유사도를 구합니다[cite: 2].",
      hint: "Q, K, V 외에 다른 단어를 찾으세요[cite: 2]."
    },
    {
      id: "nlp-easy-mc-029",
      conceptId: "self-attention-query",
      difficulty: "easy",
      category: "Self-Attention",
      questionType: "multiple-choice",
      prompt: "Self-Attention에서 '단어 i가 다른 단어로부터 어떤 정보를 찾을지 정의하는 벡터'는?",
      options: ["Query 벡터", "Key 벡터", "Value 벡터", "Output 벡터"],
      answer: 0,
      explanation: "Query 벡터는 질문자로서 다른 단어들과의 연관성을 측정하기 위해 보낼 질문 벡터입니다[cite: 2].",
      hint: "검색할 때 던지는 질문(Query) 역할입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-030",
      conceptId: "self-attention-key",
      difficulty: "easy",
      category: "Self-Attention",
      questionType: "multiple-choice",
      prompt: "Self-Attention에서 '단어 i가 자신이 가진 정보의 특성을 표현하여 Query와 비교되는 벡터'는?",
      options: ["Key 벡터", "Query 벡터", "Value 벡터", "Target 벡터"],
      answer: 0,
      explanation: "Key 벡터는 Query와의 유사성 점수(dot product)를 계산하기 위한 색인/키 역할을 합니다[cite: 2].",
      hint: "질문(Query)에 부합하는지 검색당하는 대상 키(Key)입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-031",
      conceptId: "self-attention-value",
      difficulty: "easy",
      category: "Self-Attention",
      questionType: "multiple-choice",
      prompt: "Self-Attention에서 유사도 가중치와 곱해져 실제로 가중합되어 출력되는 정보 내용 벡터는?",
      options: ["Value 벡터", "Query 벡터", "Key 벡터", "Mask 벡터"],
      answer: 0,
      explanation: "Attention 분포 확률값과 최종적으로 가중합(weighted sum)되는 진짜 값 내용이 Value 벡터입니다[cite: 2].",
      hint: "실제 값(Value)을 담고 있는 벡터입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-032",
      conceptId: "self-attention-limitation-order",
      difficulty: "easy",
      category: "Self-Attention",
      questionType: "multiple-choice",
      prompt: "Self-Attention 연산 자체만으로는 알 수 없어 별도의 기법이 필요한 정보는?",
      options: [
        "단어의 순서(위치) 정보",
        "단어 간의 유사도",
        "가중합 벡터",
        "Query와 Key의 내적값"
      ],
      answer: 0,
      explanation: "Self-Attention은 순서에 구애받지 않고 모든 단어를 동시 비교하므로 위치/순서 정보가 부재합니다[cite: 2].",
      hint: "Positional Encoding이 필요한 이유입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-033",
      conceptId: "positional-encoding",
      difficulty: "easy",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머에서 순서 정보 부재 문제를 해결하기 위해 단어 임베딩에 더해주는 벡터 기법은?",
      options: ["Positional Encoding", "One-hot Encoding", "Target Encoding", "Label Encoding"],
      answer: 0,
      explanation: "Positional Encoding을 통해 단어의 상대적/절대적 위치 정보를 임베딩에 주입합니다[cite: 2].",
      hint: "위치(Positional) 정보를 부코드(Encoding)한다는 의미입니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-034",
      conceptId: "multi-head-attention",
      difficulty: "easy",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머에서 여러 개의 Attention Head를 두어 문장의 다양한 관점(문법, 시제 등)을 동시에 파악하는 구조는?",
      options: ["Multi-Head Attention", "Single-Head Attention", "Scaled Attention", "Cross Attention"],
      answer: 0,
      explanation: "Multi-Head Attention은 Attention을 병렬로 여러 번 수행하여 다양한 문맥 관점을 포착합니다[cite: 2].",
      hint: "여러 개(Multi)의 헤드를 가지고 처리합니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-035",
      conceptId: "masked-self-attention",
      difficulty: "easy",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머 디코더에서 언어 모델 생성 시 아직 나오지 않은 미래 단어를 참조하지 못하게 막는 기법은?",
      options: ["Masked Self-Attention", "Multi-Head Attention", "Cross-Attention", "Scaled Dot-Product"],
      answer: 0,
      explanation: "Masked Self-Attention은 미래 단어 위치의 Attention Score를 $-\infty$로 설정해 참조를 차단합니다[cite: 2].",
      hint: "미래 토큰을 마스크(Mask)로 가려둡니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-036",
      conceptId: "cross-attention-qkv",
      difficulty: "easy",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머 디코더의 Cross-Attention에서 Query(Q), Key(K), Value(V)의 출처로 바른 것은?",
      options: [
        "Q는 디코더에서, K와 V는 인코더에서 가져온다.",
        "Q, K, V 모두 인코더에서 가져온다.",
        "Q, K, V 모두 디코더에서 가져온다.",
        "Q와 K는 인코더에서, V는 디코더에서 가져온다."
      ],
      answer: 0,
      explanation: "Cross-Attention에서는 디코더의 현재 상태가 Query가 되고, 인코더의 출력이 Key와 Value가 됩니다[cite: 2].",
      hint: "질문(Q)은 디코더가 던지고, 인코더의 정보(K, V)를 참조합니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-037",
      conceptId: "foundation-model-3-components",
      difficulty: "easy",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "파운데이션 모델을 가능케 한 3가지 핵심 요소에 해당하지 않는 것은?",
      options: ["빅데이터", "자가 학습 알고리즘", "트랜스포머 아키텍처", "전문가의 수작업 라벨링"],
      answer: 3,
      explanation: "파운데이션 모델은 수작업 라벨링 대신 인터넷의 빅데이터와 자가 학습(Self-supervised)을 활용합니다[cite: 3].",
      hint: "사람이 일일이 정답을 달아주지 않는 자가 학습 방식입니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-038",
      conceptId: "self-supervised-learning",
      difficulty: "easy",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "사람이 정답 라벨을 직접 만들어주지 않고 텍스트 스스로 정답을 형성하여 학습하는 방식은?",
      options: ["자가 학습 (Self-supervised Learning)", "지도 학습 (Supervised Learning)", "비지도 군집화 (Clustering)", "수동 학습 (Manual Learning)"],
      answer: 0,
      explanation: "다음 토큰 예측처럼 데이터 내부에서 정답을 만들어 학습하는 자가 학습 방식입니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-039",
      conceptId: "next-token-prediction",
      difficulty: "easy",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "GPT 시리즈 등 대다수 거대 언어 모델(LLM)이 사전 학습 시 수행하는 가장 기본적인 작업은?",
      options: ["다음 토큰 예측 (Next token prediction)", "이미지 영역 분할", "음성 높낮이 측정", "데이터베이스 정렬"],
      answer: 0,
      explanation: "LLM의 사전 학습은 주어진 이전 문맥을 바탕으로 그 뒤에 올 다음 토큰의 확률을 예측합니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-040",
      conceptId: "gpt-2-underfitting",
      difficulty: "easy",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "GPT-2 연구에서 모델 크기가 커짐에 따라 Perplexity 지표가 계속 감소하여 얻은 중요한 교훈은?",
      options: [
        "모델 크기를 더 늘리면 성능이 더 좋아질 여지가 있다.",
        "모델 크기를 줄여야만 성능이 향상된다.",
        "Perplexity가 줄어들면 성능이 나빠진다.",
        "텍스트 학습은 이미 한계에 도달했다."
      ],
      answer: 0,
      explanation: "GPT-2의 대형 모델도 아직 언더피팅 상태였으며, 모델 및 데이터 규모 확장의 정당성을 보여주었습니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-041",
      conceptId: "scaling-law-concept",
      difficulty: "easy",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "더 많은 데이터, 더 많은 파라미터, 더 긴 학습을 투입할수록 모델 성능이 향상된다는 법칙은?",
      options: ["규모의 법칙 (Scaling Law)", "무어의 법칙", "암달의 법칙", "파레토 법칙"],
      answer: 0,
      explanation: "Scaling Law에 따라 계산량, 데이터 크기, 파라미터 수가 커지면 손실(Loss)이 거듭제곱 법칙으로 줄어듭니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-042",
      conceptId: "emergent-property",
      difficulty: "easy",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "작은 모델에서는 관측되지 않다가 특정 임계 규모 이상으로 커지면 갑자기 발현되는 능력을 일컫는 용어는?",
      options: ["창발성 (Emergent Property)", "과적합 (Overfitting)", "망각 현상 (Forgetting)", "기울기 소실"],
      answer: 0,
      explanation: "특정 파라미터 규모(예: 수십~수백억) 이상에서 갑자기 추론이나 인컨텍스트 학습 같은 창발성이 나타납니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-043",
      conceptId: "in-context-learning",
      difficulty: "easy",
      category: "텍스트 파운데이션 모델",
      questionType: "multiple-choice",
      prompt: "가중치 업데이트(가중치 학습) 없이 프롬프트 안의 지시와 몇 가지 예시만으로 새로운 태스크를 수행하는 능력은?",
      options: ["인-컨텍스트 학습 (In-context Learning)", "미세 조정 (Fine-tuning)", "가중치 역전파", "재학습"],
      answer: 0,
      explanation: "In-context learning은 경사하강법으로 매개변수를 바꾸지 않고 문맥 정보만으로 가볍게 수행합니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-044",
      conceptId: "gpt-3-params",
      difficulty: "easy",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "2020년 발표되어 본격적인 LLM 시대를 연 GPT-3 가장 큰 모델의 파라미터 개수는?",
      options: ["1,750억 개 (175B)", "15억 개 (1.5B)", "70억 개 (7B)", "1조 개"],
      answer: 0,
      explanation: "GPT-3는 175B(1,750억 개) 매개변수를 가지며 거대 언어 모델의 시초가 되었습니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-045",
      conceptId: "closed-llm-example",
      difficulty: "easy",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "다음 중 서비스 형태로 API/웹을 제공하며 모델 내부가 공개되지 않은 폐쇄형(Closed) LLM의 예시는?",
      options: ["ChatGPT (OpenAI)", "LLaMA (Meta)", "Gemma (Google)", "Qwen (Alibaba)"],
      answer: 0,
      explanation: "ChatGPT, Claude, Gemini 등은 독자적 상용 서비스로 제공되는 대표적 폐쇄형 LLM입니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-046",
      conceptId: "open-llm-example",
      difficulty: "easy",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "다음 중 가중치 및 모델 정보를 다운로드받아 직접 활용 가능한 개방형(Open-sourced) LLM은?",
      options: ["LLaMA", "ChatGPT", "Claude 3", "GPT-4"],
      answer: 0,
      explanation: "Meta의 LLaMA, Google의 Gemma 등은 모델 가중치가 공개되어 다운로드 가능한 개방형 모델입니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-047",
      conceptId: "alignment-need",
      difficulty: "easy",
      category: "정렬 학습",
      questionType: "multiple-choice",
      prompt: "사전 학습만 마친 기본 LLM의 한계로 올바른 것은?",
      options: [
        "사용자의 지시와 다르게 단순히 문장을 이어 쓰거나 유해한 답변을 낼 수 있다.",
        "문법적으로 완벽한 한국어만 구사한다.",
        "속도가 너무 빠르다.",
        "모든 질문에 무조건 거절 답변만 출력한다."
      ],
      answer: 0,
      explanation: "단순 다음 토큰 예측 모델은 질문을 하면 정답 대신 질문을 계속 이어 쓰거나 유해할 위험이 존재합니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-048",
      conceptId: "alignment-definition",
      difficulty: "easy",
      category: "정렬 학습",
      questionType: "multiple-choice",
      prompt: "LLM의 출력이 사용자의 의도, 가치관, 안전 기준에 부합하도록 맞추는 과정을 무엇이라 하는가?",
      options: ["정렬 (Alignment)", "토큰화 (Tokenization)", "압축 (Compression)", "양자화 (Quantization)"],
      answer: 0,
      explanation: "Alignment는 모델을 인간의 의도와 안전 규칙에 맞게 추가 학습시키는 과정입니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-049",
      conceptId: "sft-definition",
      difficulty: "easy",
      category: "지시 학습",
      questionType: "multiple-choice",
      prompt: "지시(Instruction)와 올바른 응답 쌍으로 구성된 데이터셋으로 모델을 지도 학습시키는 단계는?",
      options: ["Supervised Fine-Tuning (SFT)", "Pre-training", "Quantization", "Pruning"],
      answer: 0,
      explanation: "SFT는 프롬프트와 정답 응답 데이터를 가지고 모델을 직접 지도 미세조정합니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-050",
      conceptId: "flan-instruction-tuning",
      difficulty: "easy",
      category: "지시 학습",
      questionType: "multiple-choice",
      prompt: "FLAN 연구에서 입증한 지시 학습(Instruction Tuning)의 주요 이점은?",
      options: [
        "학습할 때 보지 못한 새로운(Zero-shot) 지시 태스크에 대한 일반화 성능이 대폭 향상된다.",
        "모델의 매개변수 크기가 1/100로 줄어든다.",
        "인터넷 데이터가 필요 없어진다.",
        "영어가 아닌 언어는 완전히 못 읽게 된다."
      ],
      answer: 0,
      explanation: "다양한 태스크 지시문으로 SFT를 거치면 보지 못한 지시도 잘 알아듣는 Zero-shot 일반화가 일어납니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-051",
      conceptId: "preference-learning-need",
      difficulty: "easy",
      category: "선호 학습",
      questionType: "multiple-choice",
      prompt: "번역이나 에세이 작성처럼 딱 하나의 정답이 정해져 있지 않은 개방형 태스크에 필요한 정렬 학습 방식은?",
      options: ["선호 학습 (Preference Learning)", "단순 분류 학습", "정답 고정 학습", "단어 암기 학습"],
      answer: 0,
      explanation: "복수 정답이 존재하는 개방형 작업에서는 어떤 응답을 더 선호하는지 비교하는 선호 학습이 유용합니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-052",
      conceptId: "reward-model-role",
      difficulty: "easy",
      category: "선호 학습",
      questionType: "multiple-choice",
      prompt: "InstructGPT 및 RLHF에서 보상 모델(Reward Model, RM)의 역할은?",
      options: [
        "모델이 생성한 답변을 보고 사람이 선호할 만한 점수(보상)를 계산해주는 역할",
        "텍스트를 음성으로 바꾸는 역할",
        "비디오 프레임을 합성하는 역할",
        "데이터를 서버에서 삭제하는 역할"
      ],
      answer: 0,
      explanation: "보상 모델은 지시문과 응답을 받아 사람이 얼마나 선호할지 수치화된 보상 점수를 출력합니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-053",
      conceptId: "rlhf-step3-ppo",
      difficulty: "easy",
      category: "선호 학습",
      questionType: "multiple-choice",
      prompt: "RLHF Step 3에서 보상 모델의 점수를 극대화하도록 언어 모델을 최적화할 때 사용하는 강화학습 알고리즘은?",
      options: ["PPO (Proximal Policy Optimization)", "Q-learning", "A* Algorithm", "Minimax"],
      answer: 0,
      explanation: "InstructGPT 등에서는 보상 모델이 주는 보상값을 최대화하도록 PPO 알고리즘으로 정책(LLM)을 업데이트합니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-054",
      conceptId: "auto-regressive-generation",
      difficulty: "easy",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "LLM이 이전까지 생성된 토큰들을 다시 입력으로 넣어 한 번에 토큰 하나씩 순차 생성하는 방식을 무엇이라 하는가?",
      options: ["자동회귀 생성 (Auto-regressive Generation)", "비동기 생성", "일괄 한번에 생성", "역방향 생성"],
      answer: 0,
      explanation: "LLM은 자신이 이전에 만든 토큰을 다시 입력에 포함시키며 다음 토큰을 하나씩 이어 만드는 Auto-regressive 방식입니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-055",
      conceptId: "eos-token-role",
      difficulty: "easy",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "자동회귀 추론 진행 중 LLM이 텍스트 생성을 스스로 멈추게 만드는 특수 토큰은?",
      options: ["EOS 토큰 (End of Sequence)", "BOS 토큰", "MASK 토큰", "PAD 토큰"],
      answer: 0,
      explanation: "EOS(End of Sequence / [SEP] 등) 토큰이 생성되면 모델은 생성을 종료합니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-056",
      conceptId: "decoding-greedy-disadvantage",
      difficulty: "easy",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Greedy Decoding 방식이 가진 단점은?",
      options: [
        "매 순간 최고 확률만 고르기 때문에 문장 전체 누적 확률 측면에서 최선이 아닐 수 있다.",
        "계산 속도가 너무 느리다.",
        "메모리를 가장 많이 차지한다.",
        "항상 랜덤한 이상한 문장만 출력한다."
      ],
      answer: 0,
      explanation: "Greedy 방식은 당장 눈앞의 1개 토큰 확률만 보므로 문장 전체의 최적 경로를 놓칠 수 있습니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-057",
      conceptId: "decoding-temperature-high",
      difficulty: "easy",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Sampling 디코딩 시 Temperature ($T$) 값을 1보다 크게 ($T > 1$) 설정했을 때 나타나는 현상은?",
      options: [
        "확률 분포가 평평해져(Smooth) 창의적이고 다양한 응답이 나온다.",
        "확률 분포가 뾰족해져(Sharp) 항상 똑같은 정답만 나온다.",
        "생성이 즉시 중단된다.",
        "출력 문장이 무조건 영어로 변환된다."
      ],
      answer: 0,
      explanation: "Temperature가 높아지면 확률 차이가 완화되어 다양한 후보 단어가 뽑힐 확률이 커집니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-058",
      conceptId: "decoding-temperature-low",
      difficulty: "easy",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "Temperature ($T$) 값을 0에 가깝게 작게 설정했을 때의 변화는?",
      options: [
        "확률 분포가 뾰족해져 가장 확률 높은 단어 위주로 안정적으로 생성된다.",
        "무작위 난수 단어가 무조건 생성된다.",
        "답변의 길이가 100배 길어진다.",
        "문장이 완전히 무너진다."
      ],
      answer: 0,
      explanation: "Temperature가 낮으면 상위 확률 단어로 쏠려 일관되고 안정적인 답변을 얻게 됩니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-059",
      conceptId: "top-k-sampling",
      difficulty: "easy",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "확률이 가장 높은 상위 K개의 단어 후보들만 남기고 나머지는 배제한 후 샘플링하는 디코딩 방식은?",
      options: ["Top-K Sampling", "Top-P Sampling", "Greedy Search", "Beam Search"],
      answer: 0,
      explanation: "Top-K Sampling은 상위 K개 단어만 후보군으로 남겨 잡음 단어가 뽑힐 확률을 차단합니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-060",
      conceptId: "top-p-sampling",
      difficulty: "easy",
      category: "디코딩 알고리즘",
      questionType: "multiple-choice",
      prompt: "누적 확률 합이 P(예: 0.9)에 달할 때까지의 단어 후보군을 동적으로 모아 샘플링하는 뉴클리어스 방식은?",
      options: ["Top-P Sampling", "Top-K Sampling", "Greedy Search", "Temperature 0"],
      answer: 0,
      explanation: "Top-P(Nucleus) Sampling은 K를 고정하지 않고 누적 확률 P를 기준으로 동적으로 후보군 크기를 조절합니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-061",
      conceptId: "prompt-engineering-definition",
      difficulty: "easy",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "원하는 답변을 유도하기 위해 LLM에 주어지는 입력 텍스트(지시 및 예시)를 설계하는 기법은?",
      options: ["프롬프트 엔지니어링 (Prompt Engineering)", "하드웨어 엔지니어링", "네트워크 서브네팅", "데이터베이스 인덱싱"],
      answer: 0,
      explanation: "프롬프트 엔지니어링은 모델의 재학습 없이도 원하는 적절한 출력을 끌어내도록 질의를 디자인하는 기법입니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-062",
      conceptId: "prompt-components",
      difficulty: "easy",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "일반적으로 입력 프롬프트를 구성하는 2가지 주요 요소는?",
      options: [
        "지시(Instruction) + 예시(Few-shot examples)",
        "소스코드 + 컴파일러",
        "비밀번호 + 아이디",
        "테이블 + 인덱스"
      ],
      answer: 0,
      explanation: "프롬프트는 무엇을 할지에 대한 지시문(Instruction)과 어떻게 할지 보여주는 예시(Examples)로 구성됩니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-063",
      conceptId: "system-prompt-role",
      difficulty: "easy",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "유저 쿼리와 상관없이 LLM의 어조, 페르소나, 안전 제약사항 등 기본 행동 규칙을 부여하는 프롬프트는?",
      options: ["시스템 프롬프트 (System Prompt)", "유저 쿼리 (User Query)", "어텐션 맵", "임베딩 레이어"],
      answer: 0,
      explanation: "시스템 프롬프트(System Prompt)는 LLM이 대화 전체에서 지켜야 할 페르소나와 지침 규칙을 설정합니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-064",
      conceptId: "cot-prompting",
      difficulty: "easy",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "수학이나 논리 문제 해결을 위해 정답 전에 '단계별 추론 과정(Reasoning)'을 프롬프트에 포함하는 기법은?",
      options: ["Chain-of-Thought (CoT) 프롬프팅", "Zero-shot 프롬프팅", "Random 프롬프팅", "Greedy 프롬프팅"],
      answer: 0,
      explanation: "Chain-of-Thought(CoT)는 생각이 이어지는 과정(추론 단계)을 예시에 작성해 정답률을 크게 올립니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-065",
      conceptId: "zero-shot-cot-magic-words",
      difficulty: "easy",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "Zero-shot CoT를 유도하기 위해 질문 뒤에 덧붙이는 대표적인 문구는?",
      options: [
        "\"Let's think step by step\" (단계별로 생각해보자)",
        "\"Answer immediately\"",
        "\"Don't think\"",
        "\"Summarize in 1 word\""
      ],
      answer: 0,
      explanation: "Kojima 등이 발견한 \"Let's think step by step\"이라는 한 문장 추가로 예시 없이도 추론 성능이 급증합니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-066",
      conceptId: "skill-md-2026",
      difficulty: "easy",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "특정 업무 절차, 참조 가이드, 예시 등을 표준화하여 AI 스킬로 정의해 사용하는 파일 형식 명칭은?",
      options: ["SKILL.md (Skill.md)", "CONFIG.exe", "DATA.db", "MODEL.bin"],
      answer: 0,
      explanation: "SKILL.md 형태의 표준화된 마크다운 스킬 문서를 구성하여 반복 지시를 자율 수행하게 만듭니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-067",
      conceptId: "eval-mmlu",
      difficulty: "easy",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "57개의 다양한 학문 및 전문 분야 객관식 문제로 LLM의 지식 이해도를 평가하는 유명 벤치마크는?",
      options: ["MMLU", "GSM8K", "BLEU", "ROUGE"],
      answer: 0,
      explanation: "MMLU(Massive Multitask Language Understanding)는 대학교재 및 다양한 전문 분야 객관식 종합 평가 시험입니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-068",
      conceptId: "eval-gsm8k",
      difficulty: "easy",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "초등학교 수준의 수학 문장제 문제로 구성되어 LLM의 수리 추론 능력을 측정하는 벤치마크는?",
      options: ["GSM8K", "MMLU", "IMDB", "SQuAD"],
      answer: 0,
      explanation: "GSM8K는 8천여 개의 초등 수학 문장제 문제로 구성된 대표 수리 추론 벤치마크입니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-069",
      conceptId: "eval-perplexity",
      difficulty: "easy",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "생성된 텍스트 문장이 언어 모델 관점에서 얼마나 확률적으로 자연스러운지 나타내는 지표는?",
      options: ["Perplexity (PPL)", "Accuracy", "Cosine Similarity", "Precision"],
      answer: 0,
      explanation: "Perplexity(PPL)는 헷갈리는 정도를 의미하며, 낮을수록 언어 모델이 문장을 자연스럽게 느끼는 것입니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-070",
      conceptId: "eval-rouge",
      difficulty: "easy",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "문서 요약 평가 시 사람이 쓴 정답 요약문과 모델 요약문 사이 단어 겹침(Overlap)을 측정하는 지표는?",
      options: ["ROUGE", "Perplexity", "Loss", "Cross-Entropy"],
      answer: 0,
      explanation: "ROUGE-1, ROUGE-L 등은 정답 요약문과의 단어 및 n-gram 겹침 비율을 계산합니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-071",
      conceptId: "eval-sentence-bert",
      difficulty: "easy",
      category: "LLM 평가",
      questionType: "multiple-choice",
      prompt: "두 문장을 벡터로 변환한 후 벡터 공간상에서의 각도 유사도를 계산할 때 사용하는 함수는?",
      options: ["Cosine Similarity (코사인 유사도)", "Euclidean Distance", "Manhattan Distance", "Jaccard Index"],
      answer: 0,
      explanation: "Sentence-BERT 등에서는 임베딩 벡터 간 Cosine Similarity를 구해 두 문장의 의미적 유사도를 판단합니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-072",
      conceptId: "word2vec-window-size",
      difficulty: "easy",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "Word2Vec에서 중심 단어 앞뒤로 몇 개의 단어까지 문맥으로 볼 것인지를 나타내는 파라미터는?",
      options: ["윈도우 크기 (Window size)", "배치 크기 (Batch size)", "에포크 (Epoch)", "보카 크기 (Vocab size)"],
      answer: 0,
      explanation: "Window size는 중심 단어를 기준으로 좌우 몇 단어까지 주변 문맥으로 볼지 지정합니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-073",
      conceptId: "rnn-unfolding",
      difficulty: "easy",
      category: "RNN",
      questionType: "multiple-choice",
      prompt: "RNN 구조를 시간 축에 따라 펼쳐서(Unfolding) 표현했을 때 나타나는 특징은?",
      options: [
        "각 층이 하나의 시점(Time step)을 나타내는 깊은 신경망처럼 보인다.",
        "순환 구조가 완전히 사라져 MLP가 된다.",
        "모든 입력 단어가 하나로 합쳐진다.",
        "학습 파라미터가 100배로 늘어난다."
      ],
      answer: 0,
      explanation: "RNN을 시점별로 펼치면 시점마다 입력과 은닉상태가 연결되는 깊은 신경망 구조 형태가 됩니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-074",
      conceptId: "lstm-erase-write-read",
      difficulty: "easy",
      category: "LSTM",
      questionType: "multiple-choice",
      prompt: "LSTM의 게이트 3가지가 Cell state에 수행하는 동작 조합으로 올바른 것은?",
      options: [
        "지우고(Erase), 기록하고(Write), 읽기(Read)",
        "복사하고, 붙여넣고, 삭제하기",
        "암호화하고, 복호화하고, 전송하기",
        "압축하고, 해제하고, 백업하기"
      ],
      answer: 0,
      explanation: "LSTM 게이트들은 Forget(지우기), Input(기록하기), Output(읽기/내보내기)의 연산을 담당합니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-075",
      conceptId: "attention-alignment",
      difficulty: "easy",
      category: "Attention",
      questionType: "multiple-choice",
      prompt: "Attention 분포를 가시화했을 때 얻을 수 있는 추가적인 이점은?",
      options: [
        "디코더가 단어를 만들 때 원문의 어떤 단어를 참조했는지 정렬(Alignment) 관계를 해석할 수 있다.",
        "모델 학습 속도가 100배 빨라진다.",
        "파라미터 용량이 절반으로 줄어든다.",
        "모든 오답을 자동으로 교정해준다."
      ],
      answer: 0,
      explanation: "Attention 가중치 맵을 통해 입력 단어와 출력 단어 간 매핑 및 모델의 판단 근거(해석 가능성)를 확인합니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-076",
      conceptId: "scaled-dot-product",
      difficulty: "easy",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "Self-Attention에서 Query와 Key의 차원이 커질 때 내적값이 너무 커져 Softmax가 뾰족해지는 것을 방지하는 조치는?",
      options: [
        "$\sqrt{d_k}$ 스케일링 값으로 나눠준다 (Scaled Dot-Product).",
        "내적값을 무조건 0으로 만든다.",
        "Softmax 함수를 사용하지 않는다.",
        "Key 벡터를 삭제한다."
      ],
      answer: 0,
      explanation: "차원 수 크기에 비례해 내적값이 과도하게 커지는 것을 막고자 $\sqrt{d_k}$ 나누어 안정화합니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-077",
      conceptId: "residual-connection",
      difficulty: "easy",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머 블록에서 입력 $x$를 서브레이어 출력에 다시 더해주는 $x + \text{SubLayer}(x)$ 구조의 명칭은?",
      options: ["Residual Connection (잔차 연결)", "Layer Normalization", "Dropout", "Softmax"],
      answer: 0,
      explanation: "Residual Connection은 층이 깊어져도 기울기 전달이 원활해지도록 입력 $x$를 지름길로 더해줍니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-078",
      conceptId: "layer-normalization",
      difficulty: "easy",
      category: "Transformer",
      questionType: "multiple-choice",
      prompt: "트랜스포머 블록 내부에서 각 레이어 단위로 hidden vector 값들을 정규화하여 학습을 돕는 기법은?",
      options: ["Layer Normalization", "Batch Normalization", "Weight Normalization", "Data Normalization"],
      answer: 0,
      explanation: "Layer Normalization(Add & Norm의 Norm 파트)은 각 레이어 단위 정규화로 안정적 학습을 유지시킵니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-079",
      conceptId: "gpt-3-training-data",
      difficulty: "easy",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "GPT-3 사전 학습 데이터 조합에서 가장 높은 비중(60%)을 차지한 데이터셋은?",
      options: ["Common Crawl (filtered)", "WebText2", "Books1", "Wikipedia"],
      answer: 0,
      explanation: "GPT-3는 필터링된 Common Crawl 웹 데이터셋을 60% 비중으로 가장 많이 포함하여 학습했습니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-080",
      conceptId: "llama-2-chat",
      difficulty: "easy",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "Meta가 LLaMA 2를 공개하며 대화형으로 정렬시켜 함께 공개한 모델 버전의 이름은?",
      options: ["Llama-2-chat", "Llama-2-code", "Llama-2-vision", "Llama-2-audio"],
      answer: 0,
      explanation: "Meta는 대화에 특화되도록 RLHF 및 대화 데이터로 미세조정한 Llama-2-chat을 함께 공개했습니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-081",
      conceptId: "knn-in-context-selection",
      difficulty: "easy",
      category: "프롬프트 엔지니어링",
      questionType: "multiple-choice",
      prompt: "Few-shot 프롬프팅 시 성능을 극대화하기 위해 질문과 유사도가 높은 예시를 고르는 선택 방식은?",
      options: [
        "거리 기반 kNN 예시 선택",
        "무작위 임의 선택",
        "가장 멀리 떨어진 예시 선택",
        "알파벳 순서 선택"
      ],
      answer: 0,
      explanation: "풀고자 하는 질의와 임베딩 거리가 가까운 유사 예시(kNN)를 프롬프트에 넣을 때 성능이 높아집니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-082",
      conceptId: "claude-developer",
      difficulty: "easy",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "안전 지향적이며 코딩 작업 및 장문 처리에 뛰어난 Claude(클로드) 모델 시리즈를 개발한 기업은?",
      options: ["Anthropic", "OpenAI", "Google", "Meta"],
      answer: 0,
      explanation: "Claude 시리즈는 Anthropic 사에서 개발한 대표적 거대 언어 모델입니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-083",
      conceptId: "gemini-developer",
      difficulty: "easy",
      category: "거대 언어 모델",
      questionType: "multiple-choice",
      prompt: "1M 이상의 매우 긴 컨텍스트 및 뛰어난 멀티모달 성능을 지원하는 Gemini 모델을 개발한 기업은?",
      options: ["Google", "OpenAI", "Anthropic", "Mistral AI"],
      answer: 0,
      explanation: "Gemini는 Google에서 개발한 차세대 멀티모달 거대 언어 모델입니다[cite: 3]."
    },
    {
      id: "nlp-easy-mc-084",
      conceptId: "one-hot-curse-dimensionality",
      difficulty: "easy",
      category: "워드 임베딩",
      questionType: "multiple-choice",
      prompt: "어휘 사전 크기가 100만 개일 때, 원-핫 인코딩 사용 시 발생하는 '차원의 저주' 문제는?",
      options: [
        "단어 하나당 100만 차원의 희소 벡터가 필요하여 메모리 낭비가 심하다.",
        "계산이 1초 만에 끝나버린다.",
        "모든 벡터의 합이 0이 된다.",
        "단어의 알파벳 개수가 줄어든다."
      ],
      answer: 0,
      explanation: "어휘 수가 늘어날수록 벡터 차원이 무한히 커져 메모리가 극도로 낭비되는 차원의 저주가 생깁니다[cite: 2]."
    },
    {
      id: "nlp-easy-mc-085",
      conceptId: "n-gram-language-model",
      difficulty: "easy",
      category: "언어 모델",
      questionType: "multiple-choice",
      prompt: "연속된 n개의 단어 묶음 통계를 수집하여 다음 단어를 예측하는 전통적 언어 모델은?",
      options: ["N-gram 언어 모델", "Transformer", "LSTM", "Word2Vec"],
      answer: 0,
      explanation: "N-gram 언어 모델은 직전 n-1개 단어의 등장 빈도 통계를 기반으로 다음 단어를 예측합니다[cite: 2]."
    },

    // ==========================================
    // 3. 서술형 (5문항)
    // ==========================================
    {
      id: "nlp-easy-es-001",
      conceptId: "one-hot-vs-embedding-compare",
      difficulty: "easy",
      category: "워드 임베딩",
      questionType: "essay",
      prompt: "원-핫 인코딩과 워드 임베딩의 표현 방식 차이를 '차원의 특성'과 '의미 정보' 관점에서 비교하여 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["희소", "밀집", "의미", "유사성"],
      modelAnswer: "원-핫 인코딩은 단어 사전 크기의 고차원 희소(sparse) 벡터를 사용하여 단어 간 의미 관계를 반영하지 못한다. 반면 워드 임베딩은 저차원의 밀집(dense) 실수 벡터 표현으로 단어 간 의미적 유사성을 공간상 거리로 반영할 수 있다[cite: 2].",
      rubricKeywords: ["희소", "밀집", "의미", "유사성"],
      minLength: 20,
      explanation: "전통적 원-핫 표기와 현대 임베딩 표기의 구조 및 의미 포함 여부를 비교합니다[cite: 2].",
      hint: "벡터 안의 0 비율(Sparse vs Dense)과 의미적 유사성 표현 가능 여부를 함께 작성하세요[cite: 2]."
    },
    {
      id: "nlp-easy-es-002",
      conceptId: "rnn-hidden-state-role",
      difficulty: "easy",
      category: "RNN",
      questionType: "essay",
      prompt: "RNN이 순차적 데이터(Sequential Data)를 처리할 때 이전 시점의 정보를 기억하기 위해 사용하는 메커니즘과 그 한계점을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["은닉 상태", "기울기 소실", "hidden state"],
      modelAnswer: "RNN은 은닉 상태(hidden state)를 순환시켜 이전 시점의 정보를 현재 연산에 전달하여 기억한다. 그러나 문장이 길어질수록 역전파 시 기울기가 소실(vanishing gradient)되어 먼 과거의 정보를 잊어버리는 장기 의존성 문제가 발생한다[cite: 2].",
      rubricKeywords: ["은닉 상태", "기울기 소실", "장기 의존성"],
      minLength: 20,
      explanation: "RNN의 정보 전달 방식(hidden state)과 시퀀스가 길어질 때 생기는 기울기 소실 한계를 묻습니다[cite: 2].",
      hint: "정보를 전달하는 상태 벡터 이름과 역전파 시 기울기가 사라지는 문제를 언급하세요[cite: 2]."
    },
    {
      id: "nlp-easy-es-003",
      conceptId: "attention-bottleneck-resolution",
      difficulty: "easy",
      category: "Attention",
      questionType: "essay",
      prompt: "Seq2Seq 모델의 'Bottleneck problem'이 무엇인지 정의하고, Attention 메커니즘이 이를 어떻게 극복했는지 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["고정 길이", "압축", "정보 손실", "참조"],
      modelAnswer: "Bottleneck problem은 인코더가 전체 입력 문장의 의미를 단 하나의 고정 길이 벡터로 압축하면서 정보 손실이 발생하는 문제이다. Attention은 디코더가 매 출력 단계마다 인코더의 모든 hidden state를 직접 참조하고 필요한 부분에 집중하여 이 문제를 극복한다[cite: 2].",
      rubricKeywords: ["고정 길이", "압축", "손실", "참조"],
      minLength: 20,
      explanation: "고정 크기 컨텍스트 벡터의 압축 손실 문제와 어텐션의 전체 상태 직접 참조 원리를 파악해야 합니다[cite: 2].",
      hint: "하나의 고정 벡터로 우겨넣는 문제점과 인코더 상태들을 직접 찾아보는 방식을 설명하세요[cite: 2]."
    },
    {
      id: "nlp-easy-es-004",
      conceptId: "transformer-parallelism-reason",
      difficulty: "easy",
      category: "Transformer",
      questionType: "essay",
      prompt: "트랜스포머(Transformer) 모델이 기존 RNN 방식에 비해 병렬 처리와 대규모 학습에 유리한 구조적 이유를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["순환", "동시", "Self-Attention", "병렬"],
      modelAnswer: "RNN은 이전 시점의 계산이 끝나야 다음 시점을 연산하는 순차적 재귀 구조라 병렬화가 불가능하다. 반면 트랜스포머는 순환 구조 없이 Self-Attention을 통해 모든 단어를 동시에 입력을 받아 병렬 연산을 수행하므로 대규모 데이터 학습 속도가 훨씬 빠르다[cite: 2].",
      rubricKeywords: ["순차적", "Self-Attention", "동시", "병렬"],
      minLength: 20,
      explanation: "RNN의 순차적(sequential) 연산 한계와 트랜스포머의 행렬 기반 동시 Self-Attention 연산 이점을 비교합니다[cite: 2]."
    },
    {
      id: "nlp-easy-es-005",
      conceptId: "cot-prompting-principle",
      difficulty: "easy",
      category: "프롬프트 엔지니어링",
      questionType: "essay",
      prompt: "Chain-of-Thought (CoT) 프롬프팅 방식이 단순 질의응답 방식보다 복잡한 추론 태스크에서 더 뛰어난 성능을 내는 원리를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["추론", "단계별", "생각", "과정"],
      modelAnswer: "CoT 프롬프팅은 질문에 대한 단답형 정답만 요구하는 대신, 최종 답에 도달하기까지의 중간 단계별 추론 과정(Reasoning)을 모델이 스스로 생성하도록 유도하기 때문에 복잡한 문제에서도 정확한 정답을 도출해낸다[cite: 3].",
      rubricKeywords: ["추론", "단계별", "중간 과정"],
      minLength: 20,
      explanation: "중간 추론 단계 생성을 유도하여 정답 도출률을 올리는 CoT의 작동 원리를 확인합니다[cite: 3].",
      hint: "결과만 요구하는 것과 단계별 생각 과정을 읊으면서 푸는 것의 차이를 작성하세요[cite: 3]."
    }
  ]
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();