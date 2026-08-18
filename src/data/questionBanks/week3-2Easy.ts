export type StudyDifficulty = "easy" | "medium" | "hard" | "extreme";
export type StudyQuestionType = "multiple-choice" | "short-answer" | "essay";

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

export const QUESTION_BANK: Record<string, StudyQuestion[]> = {
  easy: [
    // ==========================================
    // 카테고리 1: AI 파운데이션 모델 개념 및 CLIP (15문항)
    // ==========================================
    {
      id: "ifm-c1-mc-001",
      conceptId: "foundation-model-core-properties",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "multiple-choice",
      prompt:
        "스탠포드 연구진이 정의한 AI 파운데이션 모델의 3대 핵심 특징을 올바르게 나열한 것은?",
      options: [
        "대규모 사전학습, 높은 적응성, 넓은 범용성",
        "소규모 데이터셋, 단일 목적성, 하드코딩 규칙",
        "수작업 라벨링, 정적 데이터베이스, 규칙 기반 구조",
        "1차원 평탄화, 맥스 풀링 연산, 채널 축소성"
      ],
      answer: 0,
      explanation:
        "파운데이션 모델은 방대한 데이터 기반의 '대규모 사전학습', 다양한 태스크에 적응하는 '적응성', 한정되지 않은 출력을 다루는 '범용성'을 특징으로 합니다[cite: 8].",
      hint:
        "방대한 데이터 학습, 다양한 작업 적응, 넓은 활용 범위를 뜻하는 특성 조합을 생각해 보세요."
    },
    {
      id: "ifm-c1-mc-002",
      conceptId: "foundation-vs-traditional-paradigm",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "multiple-choice",
      prompt:
        "전통적인 딥러닝 개발 패러다임과 비교했을 때 파운데이션 모델 패러다임의 가장 큰 변화는?",
      options: [
        "매 작업마다 모델을 처음부터 밑바닥 학습시킴",
        "잘 학습된 기반 모델을 다양한 하위 작업에 적응 활용함",
        "모든 인공지능 모델에서 역전파 학습을 완전히 배제함",
        "입력 데이터의 형상을 무조건 1차원 벡터로 강제 고정함"
      ],
      answer: 1,
      explanation:
        "과거에는 문제마다 모델을 새로 학습시켰으나, 파운데이션 모델은 대규모 사전학습된 단일 기반 모델을 다양한 하위 태스크에 적응시켜 활용합니다[cite: 8].",
      hint:
        "사전학습된 거대 기반 모델을 여러 목적에 맞게 전이하여 활용하는 방식입니다."
    },
    {
      id: "ifm-c1-mc-003",
      conceptId: "clip-contrastive-pretraining-concept",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "multiple-choice",
      prompt:
        "OpenAI의 CLIP 모델이 이미지와 자연어 텍스트 사이의 연관성을 학습하기 위해 사용한 기본 학습 방식은?",
      options: [
        "픽셀 단위 마스크 오토인코딩 학습",
        "수작업 1000개 클래스 원핫 분류 학습",
        "대조 학습 기반 언어-이미지 사전학습",
        "강화학습 기반 로봇 행동 정책 학습"
      ],
      answer: 2,
      explanation:
        "CLIP은 이미지와 텍스트 쌍의 임베딩 거리를 기반으로 양성 페어는 가깝게, 음성 페어는 멀어지도록 대조 학습합니다[cite: 8].",
      hint:
        "올바른 짝은 가깝게 당기고 틀린 짝은 밀어내는 거리 기반 학습 방식입니다."
    },
    {
      id: "ifm-c1-mc-004",
      conceptId: "clip-data-source-alt-text",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "multiple-choice",
      prompt:
        "CLIP 사전학습에 투입된 약 4억 개의 방대한 이미지-텍스트 쌍 데이터의 주된 수집 경로는?",
      options: [
        "전문 라벨러가 병원에서 수기로 작성한 의료 기록 데이터",
        "사람이 손수 레이블링한 ImageNet 전용 검증 데이터",
        "3D 가상 시뮬레이터 환경에서 합성 렌더링된 데이터",
        "인터넷 웹페이지의 이미지 태그 및 제목 기반 수집 데이터"
      ],
      answer: 3,
      explanation:
        "CLIP은 인터넷 웹상에서 이미지와 연결된 Alt-text HTML 태그, 캡션, 제목 등을 바탕으로 4억 개의 대규모 쌍 데이터를 수집했습니다[cite: 8].",
      hint:
        "웹페이지 상에 이미지와 함께 기재되어 있는 설명 문구들을 대량 수집했습니다."
    },
    {
      id: "ifm-c1-mc-005",
      conceptId: "clip-text-encoder-structure",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "multiple-choice",
      prompt:
        "CLIP 아키텍처에서 텍스트 입력을 처리하여 임베딩 벡터로 변환하는 텍스트 인코더의 구조는?",
      options: [
        "트랜스포머 인코더 기반 구조",
        "순환 신경망 기반 셀 구조",
        "완전 연결 레이어 단층 구조",
        "맥스 풀링 전용 다운샘플링 구조"
      ],
      answer: 0,
      explanation:
        "CLIP의 텍스트 인코더는 트랜스포머의 인코더 기반 아키텍처를 사용하여 서브워드 토큰들을 인코딩합니다[cite: 8].",
      hint:
        "자연어 문장의 어텐션 연산을 수행하는 대표적인 트랜스포머 신경망 모듈입니다."
    },
    {
      id: "ifm-c1-mc-006",
      conceptId: "clip-image-encoder-backbone",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "multiple-choice",
      prompt:
        "CLIP 아키텍처에서 이미지 입력을 받아 임베딩 벡터를 추출하는 비전 인코더 백본으로 사용되는 대표적인 신경망 구조는?",
      options: [
        "다층 퍼셉트론 단일 층 구조",
        "ViT 또는 ResNet",
        "순환 신경망 은닉 셀",
        "오토인코더 디코더 층"
      ],
      answer: 1,
      explanation:
        "CLIP의 이미지 인코더로는 Vision Transformer(ViT) 또는 ResNet 아키텍처가 백본으로 사용됩니다[cite: 8].",
      hint:
        "시각 분야의 대표적인 합성곱 신경망 및 패치 기반 비전 모델입니다."
    },
    {
      id: "ifm-c1-mc-007",
      conceptId: "contrastive-learning-goal",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "multiple-choice",
      prompt:
        "CLIP의 대조학습에서 목표 이미지와 텍스트들 사이의 학습 기준은?",
      options: [
        "모든 텍스트와의 거리를 동일한 상수로 고정함",
        "일치하는 텍스트는 멀어지게, 불일치 텍스트는 가깝게 함",
        "일치하는 텍스트는 가깝게, 불일치하는 텍스트는 멀게 함",
        "임베딩 벡터의 모든 원소 수치를 0으로 초기화함"
      ],
      answer: 2,
      explanation:
        "대조학습은 일치하는 양성(Positive) 페어는 임베딩 공간에서 가깝게 당기고, 일치하지 않는 음성(Negative) 페어는 멀리 밀어냅니다[cite: 8].",
      hint:
        "정답 쌍 사이의 유사도는 높이고 오답 쌍과의 유사도는 낮추는 방향입니다."
    },
    {
      id: "ifm-c1-mc-008",
      conceptId: "clip-zero-shot-classifier-usage",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "multiple-choice",
      prompt:
        "학습된 CLIP을 사용하여 새로운 데이터셋에 대해 제로샷 이미지 분류를 수행하는 과정은?",
      options: [
        "모든 가중치 파라미터를 처음부터 다시 재학습시킴",
        "이미지를 1차원 벡터로 변환해 소프트맥스 층만 학습하고 다른 층은 고정함",
        "레이어 중간의 모든 어텐션 블록을 영구 삭제함",
        "후보 텍스트들의 임베딩과 이미지 임베딩의 유사도를 비교함"
      ],
      answer: 3,
      explanation:
        "원하는 카테고리 텍스트를 인코딩한 임베딩들과 쿼리 이미지 임베딩 간의 코사인 유사도를 계산하여 최고 점수 클래스를 예측합니다[cite: 8].",
      hint:
        "텍스트 설명 임베딩과 사진 임베딩 사이의 코사인 유사도 점수를 비교합니다."
    },
    {
      id: "ifm-c1-mc-009",
      conceptId: "clip-prompt-template",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "multiple-choice",
      prompt:
        "CLIP으로 제로샷 분류 시 단일 단어 대신 문장 템플릿('A photo of a {object}.')을 사용하는 주된 이유는?",
      options: [
        "사전학습된 웹 텍스트 캡션 문맥과 형태를 맞춰 분류 성능을 높임",
        "임베딩 벡터의 차원 길이를 2배로 확장해 이미지 분류 성능을 높이기 위함",
        "이미지 인코더의 연산 복잡도를 줄이기 위함",
        "소프트맥스 활성화 함수의 사용을 생략하기 위함"
      ],
      answer: 0,
      explanation:
        "인터넷 데이터셋의 문장 캡션 형식과 유사한 프롬프트 템플릿을 적용함으로써 제로샷 전이 성능을 높일 수 있습니다[cite: 8].",
      hint:
        "사전학습 데이터에서 자주 보았던 자연스러운 문장 구조와 유사하게 맞춰줍니다."
    },
    {
      id: "ifm-c1-mc-010",
      conceptId: "clip-unlimited-category-interface",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "multiple-choice",
      prompt:
        "기존 고정 클래스 분류기와 비교하여 CLIP 파운데이션 모델이 갖는 범용적 출력 장점은?",
      options: [
        "오직 사전 정의된 객체 클래스만 한정적으로 출력 가능하며 새 범주는 추가할 수 없음",
        "자연어 텍스트 설명만으로 사전 정의에 얽매이지 않고 카테고리를 자유롭게 정의함",
        "이미지 내부의 텍스트 글자를 자동으로 지워버림",
        "모든 분류 작업에서 레이어 파라미터를 새로 추가해야 함"
      ],
      answer: 1,
      explanation:
        "출력 클래스가 고정된 기존 분류기와 달리, CLIP은 자연어 텍스트를 인터페이스로 사용하여 사전 정의된 클래스에 제한되지 않고 새로운 카테고리를 정의할 수 있습니다[cite: 8].",
      hint:
        "자연어 문장을 질의로 사용하여 새로운 대상을 분류할 수 있다는 점을 생각해 보세요."
    },
    {
      id: "ifm-c1-mc-011",
      conceptId: "adaptation-methods-finetuning",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "multiple-choice",
      prompt:
        "파운데이션 모델의 적응 방식 중 특정 태스크에 맞추어 모델 자체의 가중치 파라미터를 업데이트하는 기법은?",
      options: [
        "제로샷 전이",
        "퓨샷 프롬프팅",
        "파인튜닝",
        "컨텍스트 탐색"
      ],
      answer: 2,
      explanation:
        "파인튜닝은 특정 다운스트림 작업 데이터에 맞추어 모델의 가중치 파라미터를 직접 갱신하는 기법입니다[cite: 8].",
      hint:
        "모델의 내부 가중치를 미세하게 재조정하고 업데이트하는 기법입니다."
    },
    {
      id: "ifm-c1-mc-012",
      conceptId: "clip-symmetric-loss-formula",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "multiple-choice",
      prompt:
        "CLIP의 대조학습 손실함수가 대칭적 구조를 띠는 올바른 구성 방식은?",
      options: [
        "오직 이미지 관점에서의 손실값 하나만 단독으로 계산함",
        "오직 텍스트 관점에서의 손실값 하나만 단독으로 계산함",
        "손실 함수를 계산하지 않고 코사인 유사도만 단순 출력해 학습하지 않음",
        "이미지-투-텍스트 손실과 텍스트-투-이미지 손실의 평균을 취함"
      ],
      answer: 3,
      explanation:
        "CLIP은 이미지 기준 크로스엔트로피 손실과 텍스트 기준 크로스엔트로피 손실을 모두 계산하여 평균을 취하는 대칭 손실을 사용합니다[cite: 8].",
      hint:
        "이미지 관점 손실과 텍스트 관점 손실을 양방향으로 계산해 평균을 냅니다."
    },
    {
      id: "ifm-c1-sa-013",
      conceptId: "clip-full-name-sa",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "short-answer",
      prompt:
        "OpenAI가 2021년 제안한 대조 학습 기반 언어-이미지 사전학습 모델의 대표 영문 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["CLIP", "clip"],
      explanation:
        "Contrastive Language-Image Pre-training의 약자인 CLIP 모델입니다[cite: 8].",
      hint:
        "Contrastive Language-Image Pre-training의 영문 4글자 약자입니다."
    },
    {
      id: "ifm-c1-sa-014",
      conceptId: "zero-shot-prediction-sa",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "short-answer",
      prompt:
        "사전학습된 모델이 별도의 추가 미세조정 학습 없이도 처음 보는 작업에 바로 적용되는 성능을 뜻하는 용어는?",
      options: [],
      answer: null,
      acceptedAnswers: [
        "제로샷",
        "Zero-shot",
        "zero-shot",
        "제로샷 예측",
        "제로샷 전이"
      ],
      explanation:
        "추가 학습 없이 사전학습 지식을 활용하는 제로샷 역량입니다[cite: 8].",
      hint: "숫자 0을 뜻하는 영단어가 포함된 표기입니다."
    },
    {
      id: "ifm-c1-es-015",
      conceptId: "clip-contrastive-and-zero-shot-essay",
      difficulty: "easy",
      category: "AI 파운데이션 모델 개념 및 CLIP",
      questionType: "essay",
      prompt:
        "CLIP이 이미지-텍스트 쌍 데이터를 대조 학습하는 원리와, 이를 제로샷 이미지 분류에 활용하는 방법을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "대조 학습",
        "임베딩 공간",
        "코사인 유사도",
        "양성",
        "음성"
      ],
      modelAnswer:
        "CLIP은 이미지와 텍스트를 각각 인코딩한 뒤, 일치하는 양성 쌍은 임베딩 공간에서 가깝게 하고 불일치하는 음성 쌍은 멀어지도록 대조 학습한다[cite: 8]. 제로샷 분류 시에는 후보 클래스들을 텍스트 템플릿으로 인코딩하고, 입력 이미지 임베딩과 코사인 유사도를 비교하여 가장 높은 점수의 카테고리를 예측한다[cite: 8].",
      rubricKeywords: [
        "양성 페어 가깝게 & 음성 페어 멀게",
        "공통 임베딩 공간",
        "텍스트-이미지 코사인 유사도 비교"
      ],
      minLength: 20,
      explanation:
        "대조학습의 거리 조절 원리와 텍스트 템플릿 기반 코사인 유사도 제로샷 예측 방식을 서술합니다[cite: 8].",
      hint:
        "양성/음성 쌍의 거리 학습 원리와 후보 텍스트 임베딩과의 유사도 비교 과정을 작성하세요."
    },

    // ==========================================
    // 카테고리 2: SigLIP 및 멀티모달 정합 (15문항)
    // ==========================================
    {
      id: "ifm-c2-mc-001",
      conceptId: "siglip-sigmoid-loss-innovation",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "multiple-choice",
      prompt:
        "구글이 제안한 SigLIP 모델이 기존 CLIP의 Softmax 손실함수 대신 채택한 핵심 손실함수는?",
      options: [
        "평균 제곱 오차 손실",
        "소프트맥스 교차 엔트로피 손실",
        "시그모이드 기반 손실",
        "절대값 오차 손실"
      ],
      answer: 2,
      explanation:
        "SigLIP(Sigmoid Loss for Language-Image Pre-Training)은 Softmax 대신 Sigmoid 함수를 사용해 쌍별 손실을 계산합니다[cite: 8].",
      hint:
        "0과 1 사이의 S자형 시그모이드 함수를 기반으로 설계된 손실함수입니다."
    },
    {
      id: "ifm-c2-mc-002",
      conceptId: "siglip-solving-clip-limitation",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "multiple-choice",
      prompt:
        "SigLIP이 기존 CLIP 대조학습의 한계를 극복하도록 설계된 주된 개선점은?",
      options: [
        "이미 멀리 떨어진 음성 데이터 쌍에 가해지는 과도한 영향력을 완화함",
        "텍스트 인코더를 완전히 제거하고 이미지 인코더만 사용함",
        "모든 학습 이미지의 가로세로 해상도를 10x10으로 축소해 저장 공간을 줄임",
        "사전학습 단계에서 배치 사이즈를 무조건 1개로 고정함"
      ],
      answer: 0,
      explanation:
        "기존 CLIP의 Softmax 방식과 달리 SigLIP은 각 이미지-텍스트 쌍을 시그모이드 기반으로 처리하여 이미 충분히 멀리 떨어진 음성 데이터의 과도한 영향을 완화합니다[cite: 8].",
      hint:
        "이미 충분히 거리가 먼 오답 쌍들에 대해 학습이 불필요하게 쏠리는 것을 막아줍니다."
    },
    {
      id: "ifm-c2-mc-003",
      conceptId: "siglip-noise-robustness",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "multiple-choice",
      prompt:
        "학습 데이터셋에 노이즈나 오염이 가해졌을 때 SigLIP이 CLIP 대비 보여준 성능 특징은?",
      options: [
        "노이즈가 조금만 추가되어도 정확도가 즉시 0%로 추락함",
        "노이즈가 증가해도 Softmax(CLIP)보다 안정적으로 더 높은 제로샷 성능을 유지함",
        "CLIP과 노이즈 강건성 수치가 소수점까지 완전히 동일함",
        "오염 데이터가 주어지면 자동으로 사전학습이 정지됨"
      ],
      answer: 1,
      explanation:
        "강의의 비교 실험에서는 이미지나 텍스트에 오염 노이즈가 증가해도 SigLIP이 CLIP보다 안정적인 성능을 보였습니다[cite: 8].",
      hint:
        "노이즈가 심한 환경에서도 시그모이드 기반 방식이 더 안정적인 특성을 보입니다."
    },
    {
      id: "ifm-c2-mc-004",
      conceptId: "multimodal-alignment-concept",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "multiple-choice",
      prompt:
        "멀티모달 정합이 의미하는 바를 가장 올바르게 설명한 것은?",
      options: [
        "모든 모달리티 데이터를 하나의 거대한 텍스트 파일로 통합 저장하는 기술",
        "이미지 데이터에서 오직 흑백 색상 정보만 추출하는 알고리즘",
        "음성 오디오 신호의 주파수를 2배로 증폭시키는 전처리 기술",
        "서로 다른 모달리티들을 공유된 단일 공통 임베딩 벡터 공간에 구성하는 기술"
      ],
      answer: 3,
      explanation:
        "멀티모달 정합은 이미지, 텍스트, 소리 등 서로 다른 모달리티들이 의미에 따라 서로의 유사도를 비교할 수 있도록 공통 임베딩 공간에 매핑하는 것입니다[cite: 8].",
      hint:
        "이종의 데이터들을 동일한 공통 벡터 공간에 정렬시켜 서로 비교 가능하게 합니다."
    },
    {
      id: "ifm-c2-mc-005",
      conceptId: "imagebind-six-modalities",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "multiple-choice",
      prompt:
        "메타가 공개한 ImageBind 모델이 단일 공통 임베딩 공간에 결합한 모달리티의 총 개수는?",
      options: [
        "2가지 (이미지와 텍스트만)",
        "3가지 (이미지, 텍스트, 비디오만)",
        "6가지 (이미지/비디오, 텍스트, 오디오, 깊이맵, 열화상, IMU)",
        "100가지 (모든 형태의 컴퓨터 프로그램)"
      ],
      answer: 2,
      explanation:
        "ImageBind는 이미지/비디오를 중심으로 텍스트, 오디오, 깊이, 열화상, IMU 모션 센서까지 총 6가지 모달리티를 결합했습니다[cite: 8].",
      hint:
        "시각, 언어 외에도 소리, 깊이, 열화상, 모션 센서를 포함합니다."
    },
    {
      id: "ifm-c2-mc-006",
      conceptId: "cross-modal-retrieval-example",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "multiple-choice",
      prompt:
        "ImageBind와 같은 정합 모델을 이용해 가능한 크로스모달 검색의 예시는?",
      options: [
        "모닥불 소리 오디오 파일을 쿼리로 주어 모닥불 타는 이미지와 비디오를 검색함",
        "텍스트 파일의 용량을 측정하여 하드디스크의 남은 용량을 계산함",
        "이미지 픽셀 값을 0으로 초기화하여 빈 화면을 출력함",
        "모든 오디오 파일을 텍스트 형태의 문자열로 삭제함"
      ],
      answer: 0,
      explanation:
        "서로 다른 모달리티가 같은 임베딩 공간을 공유하므로 오디오 입력으로 의미적으로 관련된 이미지나 영상을 검색할 수 있습니다[cite: 8].",
      hint:
        "오디오 소리를 입력하여 이에 대응되는 시각적 사진이나 영상을 찾아내는 작업입니다."
    },
    {
      id: "ifm-c2-mc-007",
      conceptId: "embedding-space-arithmetic",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "multiple-choice",
      prompt:
        "멀티모달 임베딩 공간 산술 연산을 통해 '새 이미지' + '파도 소리 오디오'를 더했을 때의 검색 결과는?",
      options: [
        "숲속 나무 위에 앉아 있는 새 이미지",
        "파도가 치는 바닷가 해변에 서 있는 새 이미지",
        "자동차가 도로 위를 주행하는 비디오",
        "악보 텍스트 파일과 피아노 연주 오디오"
      ],
      answer: 1,
      explanation:
        "시각적 새 임베딩과 청각적 파도 소리 임베딩을 결합하면 두 의미가 함께 포함된 장면을 검색할 수 있습니다[cite: 8].",
      hint:
        "새라는 피사체와 파도 소리라는 환경적 배경이 결합된 장면을 생각해 보세요."
    },
    {
      id: "ifm-c2-mc-008",
      conceptId: "clip-loss-matching-usage",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "multiple-choice",
      prompt:
        "사전학습된 CLIP을 모달리티 변환을 유도하는 '멀티모달 정합 손실함수'로 사용할 때의 역할은?",
      options: [
        "사전학습된 이미지 인코더의 모든 가중치를 완전히 삭제하고 텍스트 조건 없이 랜덤 이미지만 생성함",
        "생성되는 결과물의 해상도를 무조건 1x1로 감축시킴",
        "텍스트 인코더의 출력 벡터를 항상 음수로 고정함",
        "학습 가능한 생성 파라미터가 텍스트 명령과 시각적으로 일치하도록 가이드 점수를 줌"
      ],
      answer: 3,
      explanation:
        "CLIP Loss는 생성 중인 시각 결과물과 목표 텍스트 설명 사이의 유사도를 측정하여 생성 결과가 텍스트 의미와 가까워지도록 학습을 유도합니다[cite: 8].",
      hint:
        "생성물이 텍스트 지시문의 의미와 얼마나 가까운지를 평가하는 역할입니다."
    },
    {
      id: "ifm-c2-mc-009",
      conceptId: "styleclip-concept",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "multiple-choice",
      prompt:
        "StyleGAN으로 생성되는 이미지에 텍스트 프롬프트를 사용해 스타일을 조작하거나 편집하는 기술은?",
      options: [
        "StyleCLIP",
        "AlexNet",
        "VGG16",
        "LeNet"
      ],
      answer: 0,
      explanation:
        "StyleCLIP은 사전학습된 CLIP의 텍스트-이미지 정합 능력을 이용하여 GAN 생성 이미지를 텍스트 지시대로 편집합니다[cite: 8].",
      hint:
        "스타일(Style)과 CLIP 모델명이 결합된 기술입니다."
    },
    {
      id: "ifm-c2-mc-010",
      conceptId: "clip-actor-motion-generation",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "multiple-choice",
      prompt:
        "'춤추고 있는 프레디 머큐리' 같은 텍스트 설명으로부터 3D 움직임 아바타를 생성하는 CLIP 응용 사례는?",
      options: [
        "ResNet-50",
        "CLIP-Actor",
        "MobileNet",
        "ViT-B"
      ],
      answer: 1,
      explanation:
        "CLIP-Actor는 텍스트 입력과 3D 표현을 CLIP 기반으로 정합하여 텍스트 설명에 대응하는 3D 아바타를 생성하는 응용 사례입니다[cite: 8].",
      hint:
        "배우(Actor)처럼 행동하는 아바타를 생성하는 CLIP 응용 기술입니다."
    },
    {
      id: "ifm-c2-mc-011",
      conceptId: "siglip-pairwise-labels",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "multiple-choice",
      prompt:
        "SigLIP의 이미지-텍스트 쌍별 학습에서 일치하는 양성 페어와 일치하지 않는 음성 페어에 부여하는 라벨은?",
      options: [
        "양성 페어 +1, 음성 페어 -1",
        "양성 페어 0, 음성 페어 1",
        "모든 페어에 0.5",
        "양성 페어 100, 음성 페어 0"
      ],
      answer: 0,
      explanation:
        "SigLIP은 일치하는 이미지-텍스트 양성 페어에는 +1, 일치하지 않는 음성 페어에는 -1 라벨을 사용하여 시그모이드 기반 손실을 계산합니다[cite: 8].",
      hint:
        "일치하는 쌍과 일치하지 않는 쌍을 서로 반대되는 부호로 표현합니다."
    },
    {
      id: "ifm-c2-mc-012",
      conceptId: "cross-modal-zero-shot-classification",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "multiple-choice",
      prompt:
        "ImageBind의 공통 임베딩 공간을 활용하여 오디오 소리 데이터에 대해 제로샷 분류를 수행하는 방법은?",
      options: [
        "오디오 인코더 가중치를 처음부터 다시 학습시킴",
        "오디오 신호를 흑백 이미지로 렌더링한 후 ResNet으로 분류함",
        "오디오 파일의 재생 길이를 측정하여 판단함",
        "오디오 임베딩과 텍스트 클래스 설명 임베딩 간의 유사도를 비교함"
      ],
      answer: 3,
      explanation:
        "공통 공간에 매핑되어 있으므로 오디오 임베딩과 텍스트 카테고리 임베딩 간의 유사도를 비교하여 제로샷 분류가 가능합니다[cite: 8].",
      hint:
        "오디오 벡터와 텍스트 설명 벡터의 거리를 직접 비교합니다."
    },
    {
      id: "ifm-c2-sa-013",
      conceptId: "siglip-sa-name",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "short-answer",
      prompt:
        "CLIP의 Softmax 손실을 대체하여 시그모이드 기반으로 언어-이미지 사전학습을 수행하는 구글의 모델 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["SigLIP", "siglip"],
      explanation:
        "Sigmoid Loss for Language-Image Pre-Training(SigLIP) 모델입니다[cite: 8].",
      hint: "Sigmoid와 CLIP의 합성 약자입니다."
    },
    {
      id: "ifm-c2-sa-014",
      conceptId: "imagebind-sa-name",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "short-answer",
      prompt:
        "이미지/비디오를 중심으로 오디오, 깊이, 열화상 등 6가지 모달리티를 단일 임베딩 공간에 결합한 메타의 모델명은?",
      options: [],
      answer: null,
      acceptedAnswers: ["ImageBind", "imagebind", "ImageBIND"],
      explanation: "Meta의 ImageBind 모델입니다[cite: 8].",
      hint: "이미지(Image)와 결합(Bind)의 합성어입니다."
    },
    {
      id: "ifm-c2-es-015",
      conceptId: "multimodal-alignment-and-retrieval-essay",
      difficulty: "easy",
      category: "SigLIP 및 멀티모달 정합",
      questionType: "essay",
      prompt:
        "멀티모달 정합(Multi-modal Alignment)의 개념을 설명하고, 공유된 단일 임베딩 공간을 통해 크로스모달 검색이 가능해지는 원리를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "멀티모달",
        "임베딩 공간",
        "크로스모달",
        "유사도",
        "오디오"
      ],
      modelAnswer:
        "멀티모달 정합은 이미지, 텍스트, 오디오 등 서로 다른 데이터를 하나의 공통 임베딩 벡터 공간에 매핑하여 정렬하는 기술이다[cite: 8]. 각 모달리티가 동일한 공간의 벡터로 표현되므로 서로 다른 모달리티 사이에서도 유사도를 계산하여 관련된 이미지, 텍스트, 오디오 등을 검색할 수 있다[cite: 8].",
      rubricKeywords: [
        "공통 임베딩 벡터 공간 정렬",
        "이종 데이터 간 유사도 비교",
        "크로스모달 검색 가능 원리"
      ],
      minLength: 20,
      explanation:
        "공통 임베딩 공간 정렬 정의와 모달리티 간 유사도 비교를 통한 크로스모달 검색 원리를 서술합니다[cite: 8].",
      hint:
        "서로 다른 데이터가 같은 벡터 공간에 모여 거리를 직접 비교할 수 있게 되는 원리를 쓰세요."
    },

    // ==========================================
    // 카테고리 3: 시각언어모델(VLM) 및 LLaVA (15문항)
    // ==========================================
    {
      id: "ifm-c3-mc-001",
      conceptId: "vlm-three-main-components",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "multiple-choice",
      prompt:
        "시각언어모델(VLM)을 구성하는 3대 핵심 모듈 조합으로 가장 올바른 것은?",
      options: [
        "오디오 인코더, 풀링 레이어, GAN 생성자",
        "합성곱 필터, 맥스 풀링층, 소프트맥스 출력기",
        "비전 인코더, 프로젝션 레이어, 거대 언어 모델",
        "위치 인코더, 1차원 플랫튼 층, 분류 헤드"
      ],
      answer: 2,
      explanation:
        "VLM은 시각 정보를 처리하는 Vision Encoder, 시각 특징을 언어 모델 입력 공간으로 연결하는 Projection Layer, 추론을 담당하는 LLM으로 구성됩니다[cite: 8].",
      hint:
        "이미지를 보는 인코더, 연결 어댑터, 사고를 담당하는 언어 모델의 조합입니다."
    },
    {
      id: "ifm-c3-mc-002",
      conceptId: "vlm-biological-analogy",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "multiple-choice",
      prompt:
        "VLM 아키텍처에서 Vision Encoder와 LLM의 역할을 사람의 신체 기관에 비유한 올바른 설명은?",
      options: [
        "Vision Encoder는 생각하는 뇌, LLM은 소리를 듣는 귀",
        "Vision Encoder는 이미지를 보는 눈, LLM은 사고와 추론을 하는 뇌",
        "Vision Encoder는 움직이는 손, LLM은 이미지를 보는 눈",
        "Vision Encoder는 기억 저장소, LLM은 단순 시각 센서"
      ],
      answer: 1,
      explanation:
        "비전 인코더는 시각 정보를 지각하는 '눈' 역할을 하고, 언어 모델은 이를 종합해 추론하고 답변하는 '뇌' 역할을 합니다[cite: 8].",
      hint:
        "시각 정보를 받아들이는 감각 기관과 이를 종합 판단하는 중추 기관의 비유입니다."
    },
    {
      id: "ifm-c3-mc-003",
      conceptId: "vlm-projection-layer-role",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "multiple-choice",
      prompt:
        "VLM에서 Vision Encoder와 LLM 사이에 위치하는 프로젝션 레이어의 핵심 역할은?",
      options: [
        "이미지 인코더의 특징 벡터를 언어 모델이 이해할 수 있는 토큰 임베딩 차원으로 변환함",
        "입력 이미지의 화소 해상도를 무조건 2배로 업샘플링함",
        "언어 모델의 모든 가중치를 삭제하고 초기화함",
        "텍스트 질문을 음성 신호로 자동 변환함"
      ],
      answer: 0,
      explanation:
        "프로젝션 레이어는 비전 인코더가 추출한 시각 특징을 LLM이 처리할 수 있는 임베딩 공간으로 변환합니다[cite: 8].",
      hint:
        "시각 임베딩의 규격을 텍스트 토큰 임베딩의 규격과 일치시켜 주는 다리 역할을 합니다."
    },
    {
      id: "ifm-c3-mc-004",
      conceptId: "llava-visual-instruction-tuning",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "multiple-choice",
      prompt: "LLaVA 모델의 핵심 학습 패러다임 명칭은?",
      options: [
        "단순 이미지 분류 튜닝",
        "픽셀 단위 마스크 튜닝",
        "규칙 기반 프롬프트 튜닝",
        "시각 지시 튜닝"
      ],
      answer: 3,
      explanation:
        "LLaVA는 이미지, 지시문, 답변으로 구성된 대화형 데이터셋을 사용하여 시각 지시 튜닝을 수행합니다[cite: 8].",
      hint: "시각(Visual)과 지시(Instruction)를 결합한 튜닝 기법입니다."
    },
    {
      id: "ifm-c3-mc-005",
      conceptId: "llava-step1-pretraining-target",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "multiple-choice",
      prompt:
        "LLaVA 학습의 'Step 1: 사전학습' 단계에서 업데이트되는 학습 대상 파라미터는?",
      options: [
        "전체 언어 모델과 비전 인코더 전체",
        "오직 비전 인코더의 어텐션 블록만",
        "시각-언어를 연결하는 선형 프로젝션 레이어만",
        "어떠한 파라미터도 학습하지 않음"
      ],
      answer: 2,
      explanation:
        "Step 1에서는 비전 인코더와 LLM을 동결하고 시각과 언어 표현을 연결하는 선형 프로젝션 레이어를 학습합니다[cite: 8].",
      hint: "양쪽 거대 모델은 얼려두고 중간 연결 레이어를 학습합니다."
    },
    {
      id: "ifm-c3-mc-006",
      conceptId: "llava-step2-finetuning-target",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "multiple-choice",
      prompt:
        "LLaVA 학습의 'Step 2: 파인튜닝' 단계에서 미세조정되는 구성 요소 조합은?",
      options: [
        "선형 프로젝션 레이어와 언어 모델",
        "비전 인코더의 입력 패치 층만",
        "오직 텍스트 토크나이저 어휘 사전만",
        "모든 레이어를 동결하고 학습 중단"
      ],
      answer: 0,
      explanation:
        "Step 2에서는 시각 지시 태스크에 맞추어 프로젝션 레이어와 언어 모델을 함께 미세조정합니다[cite: 8].",
      hint:
        "중간 연결 어댑터와 추론을 담당하는 거대 언어 모델을 함께 튜닝합니다."
    },
    {
      id: "ifm-c3-mc-007",
      conceptId: "llava-synthetic-data-chatgpt",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "multiple-choice",
      prompt:
        "LLaVA 연구진이 대규모 시각 지시 데이터셋을 저비용으로 구축하기 위해 활용한 방식은?",
      options: [
        "10만 명의 인력이 모든 이미지에 대해 24시간 실시간으로 Q&A 문장을 직접 타이핑 작성함",
        "기존 COCO 캡션 및 바운딩 박스 라벨을 ChatGPT에 주어 고품질 Q&A 데이터 자동 생성",
        "인터넷의 무작위 스팸 텍스트를 그대로 복사 붙여넣기",
        "모든 이미지의 정답 라벨을 숫자로만 생성"
      ],
      answer: 1,
      explanation:
        "LLaVA는 COCO 데이터셋의 캡션과 바운딩 박스 메타데이터를 ChatGPT에 입력하여 다양한 시각 지시 데이터를 생성했습니다[cite: 8].",
      hint:
        "기존 데이터셋의 시각 정보를 LLM에 전달해 대화형 데이터를 합성했습니다."
    },
    {
      id: "ifm-c3-mc-008",
      conceptId: "llava-synthetic-three-types",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "multiple-choice",
      prompt:
        "LLaVA 데이터셋 구축 시 ChatGPT를 이용해 생성한 3가지 질의응답 유형에 포함되지 않는 것은?",
      options: [
        "대화형 질의응답",
        "자세한 장면 묘사",
        "복잡한 논리 추론",
        "바이너리 코드 컴파일"
      ],
      answer: 3,
      explanation:
        "LLaVA 합성 데이터는 대화, 자세한 설명, 복잡한 추론의 형태로 생성되었습니다[cite: 8].",
      hint:
        "자연어 기반의 대화, 묘사, 추론과 거리가 먼 항목을 찾으세요."
    },
    {
      id: "ifm-c3-mc-009",
      conceptId: "vlm-application-tasks",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "multiple-choice",
      prompt:
        "LLaVA 같은 VLM이 수행할 수 있는 대표적인 멀티모달 서비스 응용 태스크는?",
      options: [
        "단순 하드웨어 팬 속도 제어",
        "이미지 기반 시각 질의응답 및 차트 분석 대화",
        "이미지 파일의 압축 해제 속도 측정",
        "컴퓨터 모니터의 화면 밝기 조절"
      ],
      answer: 1,
      explanation:
        "VLM은 이미지 묘사, 문서나 차트 분석, Visual Question Answering, 이미지 기반 대화 등의 작업을 수행할 수 있습니다[cite: 8].",
      hint:
        "사진이나 문서를 눈으로 보고 텍스트로 묻고 답하는 작업입니다."
    },
    {
      id: "ifm-c3-mc-010",
      conceptId: "gpt4v-sketch-to-html-demo",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "multiple-choice",
      prompt:
        "GPT-4V 시연에서 손으로 작성한 웹사이트 스케치 이미지를 입력했을 때 모델이 보인 능력은?",
      options: [
        "스케치 이미지를 보고 실제 작동하는 HTML/JS 웹페이지 코드를 자동 작성함",
        "스케치 이미지 파일을 즉시 휴지통으로 삭제함",
        "스케치의 선 두께를 10배로 굵게 변환함",
        "스케치 종이의 무게와 질감을 측정함"
      ],
      answer: 0,
      explanation:
        "GPT-4V는 손으로 작성한 목업 이미지를 이해하고 이를 바탕으로 웹페이지를 구현하는 코드를 생성하는 사례를 보여주었습니다[cite: 8].",
      hint:
        "손으로 작성한 스케치를 바탕으로 실제 프론트엔드 웹 코드를 구현해 냅니다."
    },
    {
      id: "ifm-c3-mc-011",
      conceptId: "claude-computer-use-screen-capture",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "multiple-choice",
      prompt:
        "Claude 기반 Computer Use 에이전트가 소프트웨어를 제어할 때 화면을 이미지 캡처 방식으로 바라보는 이유는?",
      options: [
        "컴퓨터 화면의 전력 소모를 줄이기 위해",
        "텍스트 언어 모델의 작동을 중단시키기 위해",
        "표준 API가 없는 다양한 프로그램들과 호환성 높게 시각적으로 인터페이스하기 위해",
        "인터넷 연결을 차단하고 오프라인으로 만들기 위해"
      ],
      answer: 2,
      explanation:
        "화면을 이미지로 인식하면 프로그램별 전용 API에 의존하지 않고 사람이 화면을 보는 방식과 유사하게 다양한 인터페이스를 다룰 수 있습니다[cite: 8].",
      hint:
        "전용 연동 인터페이스가 없는 프로그램도 사람이 모니터를 보듯 제어하기 위함입니다."
    },
    {
      id: "ifm-c3-mc-012",
      conceptId: "gpt4v-industrial-anomaly-detection",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "multiple-choice",
      prompt:
        "GPT-4V에 병이나 부품 사진을 보여주며 결함 판단을 요청했을 때 수행한 작업은?",
      options: [
        "제품의 가격을 자동으로 할인 결제함",
        "이미지 파일명을 무작위 영문으로 변경함",
        "카메라 렌즈의 먼지를 물리적으로 닦아냄",
        "사진 속 이물질, 스크래치, 마모 부위를 찾아내고 구체적인 결함 이유를 설명함"
      ],
      answer: 3,
      explanation:
        "VLM은 제품 이미지를 관찰하여 이물질이나 표면 손상과 같은 시각적 이상 요소를 분석하고 설명할 수 있습니다[cite: 8].",
      hint:
        "시각적 결함 요소를 찾아내고 그 이유를 설명하는 작업입니다."
    },
    {
      id: "ifm-c3-sa-013",
      conceptId: "llava-sa-name",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "short-answer",
      prompt:
        "CLIP 비전 인코더와 Vicuna 언어 모델을 선형 프로젝션으로 연결하여 시각 지시 튜닝을 수행한 대표적인 VLM 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["LLaVA", "llava", "Llava"],
      explanation:
        "Large Language and Vision Assistant(LLaVA) 모델입니다[cite: 8].",
      hint:
        "Large Language and Vision Assistant의 영문 약자입니다."
    },
    {
      id: "ifm-c3-sa-014",
      conceptId: "projection-layer-sa-name",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "short-answer",
      prompt:
        "VLM에서 비전 인코더의 특징을 언어 모델의 토큰 임베딩 공간에 맞추어 매핑해 주는 중간 레이어 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: [
        "프로젝션 레이어",
        "Projection Layer",
        "projection layer",
        "선형 레이어",
        "어댑터"
      ],
      explanation:
        "Projection Layer(프로젝션 레이어) 또는 시각과 언어 표현을 연결하는 어댑터 역할의 레이어입니다[cite: 8].",
      hint: "투영(Projection) 역할을 수행하는 중간 레이어입니다."
    },
    {
      id: "ifm-c3-es-015",
      conceptId: "llava-two-step-training-essay",
      difficulty: "easy",
      category: "시각언어모델(VLM) 및 LLaVA",
      questionType: "essay",
      prompt:
        "LLaVA 모델의 2단계 학습 전략(Step 1: 사전학습, Step 2: 파인튜닝)에서 각 단계별 학습 대상 파라미터를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "선형 레이어",
        "프로젝션",
        "언어 모델",
        "사전학습",
        "파인튜닝"
      ],
      modelAnswer:
        "Step 1에서는 비전 인코더와 언어 모델을 고정하고 시각-언어 정렬을 위한 선형 프로젝션 레이어를 학습한다[cite: 8]. Step 2에서는 프로젝션 레이어와 언어 모델을 함께 미세조정하여 시각적 지시를 이해하고 답변하는 능력을 학습한다[cite: 8].",
      rubricKeywords: [
        "Step 1 선형 프로젝션 레이어 학습",
        "Step 2 프로젝션 레이어 + 언어 모델 미세조정",
        "비전 인코더 고정"
      ],
      minLength: 20,
      explanation:
        "LLaVA의 1단계 시각-언어 정렬과 2단계 시각 지시 파인튜닝의 학습 대상 차이를 설명합니다[cite: 8].",
      hint:
        "1단계와 2단계에서 어떤 부분이 고정되고 어떤 부분이 학습되는지 구분하세요."
    },

    // ==========================================
    // 카테고리 4: 최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화 (15문항)
    // ==========================================
    {
      id: "ifm-c4-mc-001",
      conceptId: "qwen-vl-overview",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "multiple-choice",
      prompt:
        "알리바바가 개발하여 OCR, 객체 위치 탐지, 차트 및 문서 이해 등의 능력을 발전시켜 온 대표적인 VLM 모델군은?",
      options: [
        "AlexNet 계열",
        "Qwen-VL 계열",
        "VGG-Multimodal 계열",
        "LeNet-VL 계열"
      ],
      answer: 1,
      explanation:
        "알리바바의 Qwen-VL 계열은 시각과 언어를 함께 처리하는 대표적인 멀티모달 모델군입니다[cite: 8].",
      hint:
        "Qwen 언어 모델에 시각 처리 능력을 부여한 멀티모달 모델군입니다."
    },
    {
      id: "ifm-c4-mc-002",
      conceptId: "qwen2-vl-mrope-encoding",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "multiple-choice",
      prompt:
        "Qwen2-VL에서 텍스트, 이미지, 비디오의 위치 정보를 처리하기 위해 적용한 위치 인코딩은?",
      options: [
        "단순 사인파 위치 인코딩",
        "고정된 1차원 맥스 풀링",
        "멀티모달 회전 위치 임베딩",
        "단순 원핫 위치 라벨"
      ],
      answer: 2,
      explanation:
        "Qwen2-VL은 멀티모달 위치 정보를 표현하기 위해 Multimodal Rotary Position Embedding(M-RoPE)을 사용합니다[cite: 8].",
      hint:
        "다양한 모달리티를 위한 회전(Rotary) 기반 위치 임베딩입니다."
    },
    {
      id: "ifm-c4-mc-003",
      conceptId: "mrope-three-axes",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "multiple-choice",
      prompt:
        "M-RoPE가 시각 및 비디오 토큰의 위치를 나타내기 위해 사용하는 3가지 축은?",
      options: [
        "시간, 높이, 너비",
        "밝기, 채도, 명도",
        "스트라이드, 패딩, 커널",
        "쿼리, 키, 값"
      ],
      answer: 0,
      explanation:
        "M-RoPE는 시간(Time), 높이(Height), 너비(Width)의 축을 활용해 멀티모달 위치 정보를 표현합니다[cite: 8].",
      hint:
        "동영상 시간 축과 이미지 가로세로 공간 축의 조합입니다."
    },
    {
      id: "ifm-c4-mc-004",
      conceptId: "internvl-vision-encoder-scaleup",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "multiple-choice",
      prompt:
        "InternVL 모델에서 대규모 언어 모델에 대응해 확장된 비전 인코더 InternViT의 규모는?",
      options: [
        "100만 개",
        "5000만 개",
        "1억 개",
        "60억 개 (6B)"
      ],
      answer: 3,
      explanation:
        "강의에서는 InternVL의 비전 인코더 InternViT가 6B 규모로 확장된 사례를 소개합니다[cite: 8].",
      hint: "수십억(Billion) 단위에 이르는 대형 비전 백본 규모입니다."
    },
    {
      id: "ifm-c4-mc-005",
      conceptId: "set-of-mark-prompting-concept",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "multiple-choice",
      prompt:
        "VLM의 시각 위치 식별 능력을 높이기 위해 이미지 속 개별 객체에 번호나 마크를 표시하는 비주얼 프롬프팅 기법은?",
      options: [
        "맥스 풀링 프롬프팅",
        "Set-of-Mark 프롬프팅",
        "드롭아웃 프롬프팅",
        "단순 플랫튼 프롬프팅"
      ],
      answer: 1,
      explanation:
        "Set-of-Mark(SoM)는 이미지 속 객체에 번호나 시각적 표식을 추가하여 VLM이 특정 객체나 위치를 더 쉽게 참조하도록 돕는 기법입니다[cite: 8].",
      hint: "시각적 표식(Mark)들의 집합을 이미지에 표시해 줍니다."
    },
    {
      id: "ifm-c4-mc-006",
      conceptId: "som-gui-agent-usage",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "multiple-choice",
      prompt:
        "Set-of-Mark 프롬프팅이 활용될 수 있는 대표적인 VLM 응용 분야는?",
      options: [
        "음성 파일의 노이즈 필터링",
        "텍스트 파일의 용량 압축",
        "컴퓨터 화면 조작 AI 에이전트 및 물체 위치 대화",
        "데이터베이스 테이블 인덱싱"
      ],
      answer: 2,
      explanation:
        "UI 화면의 버튼이나 객체에 번호를 표시하면 VLM이 특정 위치를 번호로 참조할 수 있어 GUI 조작이나 위치 기반 질의응답에 활용할 수 있습니다[cite: 8].",
      hint:
        "화면 상의 버튼 위치를 번호로 지정해 조작하는 AI 에이전트 작업입니다."
    },
    {
      id: "ifm-c4-mc-007",
      conceptId: "biomedclip-medical-foundation",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "multiple-choice",
      prompt:
        "대규모 생명의학 이미지-텍스트 데이터로 사전학습된 의료 도메인 특화 멀티모달 모델은?",
      options: [
        "BiomedCLIP",
        "AlexNet-Med",
        "MobileNet-Bio",
        "LeNet-Health"
      ],
      answer: 0,
      explanation:
        "BiomedCLIP은 생명의학 이미지와 텍스트를 활용하여 학습된 의료 분야 특화 CLIP 계열 모델입니다[cite: 8].",
      hint: "생명의학(Biomedical) 분야에 특화된 CLIP 모델입니다."
    },
    {
      id: "ifm-c4-mc-008",
      conceptId: "llava-med-medical-assistant",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "multiple-choice",
      prompt:
        "LLaVA 구조를 의료 이미지 및 지시 데이터에 맞게 학습하여 의료 이미지 기반 대화를 수행하는 모델은?",
      options: [
        "ResNet-Hospital",
        "VGG-Clinic",
        "StyleCLIP-Med",
        "LLaVA-Med"
      ],
      answer: 3,
      explanation:
        "LLaVA-Med는 의료 이미지와 언어 지시를 처리하기 위해 의료 분야에 특화된 LLaVA 계열 모델입니다[cite: 8].",
      hint: "LLaVA 모델명 뒤에 의료(Med) 접미사가 붙습니다."
    },
    {
      id: "ifm-c4-mc-009",
      conceptId: "anomalygpt-manufacturing-ai",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "multiple-choice",
      prompt:
        "제조업 이미지에서 크랙이나 스크래치 같은 이상 영역을 대화형으로 분석하는 특화 모델은?",
      options: [
        "MusicGPT",
        "AnomalyGPT",
        "FinanceLLM",
        "MovieCLIP"
      ],
      answer: 1,
      explanation:
        "AnomalyGPT는 산업 현장의 이상(Anomaly)을 시각적으로 분석하고 대화형으로 설명하는 모델입니다[cite: 8].",
      hint: "이상/결함(Anomaly)을 탐지하는 GPT 모델입니다."
    },
    {
      id: "ifm-c4-mc-010",
      conceptId: "3d-llm-spatial-navigation",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "multiple-choice",
      prompt:
        "3차원 공간 정보와 자연어를 결합하여 3D 공간 질의응답이나 네비게이션을 수행하는 모델은?",
      options: [
        "2D-CNN",
        "1D-RNN",
        "3D-LLM",
        "FCN"
      ],
      answer: 2,
      explanation:
        "3D-LLM은 3차원 공간 표현과 자연어를 결합하여 공간 이해, 질의응답, 네비게이션 등의 작업을 수행합니다[cite: 8].",
      hint: "3차원 입체 공간(3D)을 다루는 LLM입니다."
    },
    {
      id: "ifm-c4-mc-011",
      conceptId: "vla-palm-e-robot-action",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "multiple-choice",
      prompt:
        "시각과 언어 정보를 활용하여 로봇의 실제 행동과 연결하는 모델 사례로 적절한 것은?",
      options: [
        "PaLM-E / RT-1",
        "AlexNet / LeNet",
        "VGG-16 / ResNet",
        "DINO / StyleGAN"
      ],
      answer: 0,
      explanation:
        "PaLM-E와 RT-1은 시각 정보와 언어 명령을 로봇 행동과 연결하는 로보틱스 멀티모달 모델 사례로 소개됩니다[cite: 8].",
      hint:
        "시각과 언어 정보를 실제 로봇 행동으로 연결하는 모델을 고르세요."
    },
    {
      id: "ifm-c4-mc-012",
      conceptId: "qwen25-omni-multimodal-chat",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "multiple-choice",
      prompt:
        "텍스트뿐만 아니라 비디오와 오디오를 함께 처리하고 실시간 음성 대화를 지원하는 Qwen 계열 모델은?",
      options: [
        "Qwen-TextOnly",
        "Qwen-1D",
        "Qwen-CNN",
        "Qwen2.5-Omni"
      ],
      answer: 3,
      explanation:
        "Qwen2.5-Omni는 시각과 오디오를 함께 처리하는 옴니모달 모델로 소개됩니다[cite: 8].",
      hint:
        "여러 모달리티를 포괄한다는 뜻의 Omni가 붙은 모델입니다."
    },
    {
      id: "ifm-c4-sa-013",
      conceptId: "som-sa-name",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "short-answer",
      prompt:
        "이미지 속 물체에 번호나 시각적 마크를 붙여 VLM의 위치 인식을 돕는 기법의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["SoM", "som", "Set-of-Mark", "SOM"],
      explanation:
        "Set-of-Mark(SoM) 프롬프팅 기법입니다[cite: 8].",
      hint: "Set-of-Mark의 3글자 약자입니다."
    },
    {
      id: "ifm-c4-sa-014",
      conceptId: "vla-sa-name",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "short-answer",
      prompt:
        "시각, 언어, 로봇 행동을 결합하는 'Vision-Language-Action' 모델 범주의 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: [
        "VLA",
        "vla",
        "Vision-Language-Action",
        "Vision Language Action"
      ],
      explanation:
        "Vision-Language-Action(VLA) 모델입니다[cite: 8].",
      hint: "Vision, Language, Action의 앞 글자를 딴 3글자 약자입니다."
    },
    {
      id: "ifm-c4-es-015",
      conceptId: "som-prompting-mechanism-essay",
      difficulty: "easy",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/도메인 특화",
      questionType: "essay",
      prompt:
        "Set-of-Mark(SoM) 프롬프팅의 개념과 VLM의 시각적 위치 인식을 어떻게 보조하는지 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["SoM", "마크", "번호", "위치", "에이전트"],
      modelAnswer:
        "SoM 프롬프팅은 이미지 속 객체나 영역에 번호와 같은 시각적 마크를 추가하여 VLM이 특정 객체를 쉽게 참조하도록 하는 방법이다[cite: 8]. VLM은 복잡한 좌표를 직접 다루는 대신 이미지에 표시된 번호나 마크를 이용해 객체 위치를 구분할 수 있으므로 물체 위치 질의나 GUI 조작과 같은 작업에 활용할 수 있다[cite: 8].",
      rubricKeywords: [
        "객체별 번호/마크 표시",
        "VLM 위치 인식 보조",
        "번호 참조를 통한 객체 구분"
      ],
      minLength: 20,
      explanation:
        "객체별 시각 마킹과 이를 이용한 VLM 위치 식별 보조 원리를 설명합니다[cite: 8].",
      hint:
        "이미지에 번호를 표시했을 때 VLM이 객체를 어떻게 더 쉽게 구분할 수 있는지 작성하세요."
    },

    // ==========================================
    // 카테고리 5: 비전 파운데이션 모델 및 응용 (15문항)
    // ==========================================
    {
      id: "ifm-c5-mc-001",
      conceptId: "sam-segment-anything-overview",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt:
        "메타에서 공개한 파운데이션 모델로, 점 클릭이나 박스 등의 프롬프트를 주면 객체를 분할해내는 모델은?",
      options: [
        "Segment Anything Model (SAM)",
        "AlexNet-Segment",
        "VGG-Mask",
        "LeNet-Pixel"
      ],
      answer: 0,
      explanation:
        "Segment Anything Model(SAM)은 프롬프트 기반 범용 이미지 세그멘테이션 파운데이션 모델입니다[cite: 8].",
      hint:
        "점이나 박스와 같은 프롬프트를 이용해 다양한 객체를 분할하는 메타의 범용 모델을 떠올려 보세요."
    },
    {
      id: "ifm-c5-mc-002",
      conceptId: "sam-promptable-segmentation-concept",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt:
        "SAM(Segment Anything Model)이 기존의 고정된 객체 분할 모델보다 범용적으로 사용할 수 있는 핵심 특징은?",
      options: [
        "특정 한 종류의 객체만 분할하도록 고정되어 있음",
        "점, 박스, 영역 등의 다양한 프롬프트를 받아 원하는 객체를 분할할 수 있음",
        "텍스트 파일만 입력으로 받을 수 있음",
        "객체 분할 없이 이미지 전체에 하나의 클래스만 부여함"
      ],
      answer: 1,
      explanation:
        "SAM은 점 클릭, 바운딩 박스, 부분 영역 등의 다양한 프롬프트를 이용해 사용자가 원하는 객체의 세그멘테이션 마스크를 생성할 수 있는 범용 분할 모델입니다[cite: 8].",
      hint:
        "사용자가 무엇을 분할할지 점이나 박스 등의 입력으로 지정할 수 있다는 점을 생각해 보세요."
    },
    {
      id: "ifm-c5-mc-003",
      conceptId: "grounding-dino-open-vocabulary",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt:
        "자연어 텍스트로 원하는 물체 명칭을 입력하면 이미지에서 해당 객체를 바운딩 박스로 찾아내는 모델은?",
      options: [
        "StyleGAN",
        "AlexNet",
        "Grounding DINO",
        "LeNet5"
      ],
      answer: 2,
      explanation:
        "Grounding DINO는 텍스트 프롬프트를 이용해 이미지 속 객체의 위치를 바운딩 박스로 탐지하는 모델입니다[cite: 8].",
      hint:
        "언어와 시각을 그라운딩하여 박스를 찾는 DINO 모델입니다."
    },
    {
      id: "ifm-c5-mc-004",
      conceptId: "depth-anything-foundation-model",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt:
        "단일 2D 이미지로부터 장면의 깊이 정보(Depth Map)를 추정하는 대표적인 비전 파운데이션 모델은?",
      options: [
        "MusicLM",
        "AudioCLIP",
        "VoiceGPT",
        "Depth Anything"
      ],
      answer: 3,
      explanation:
        "Depth Anything v2는 이미지나 영상으로부터 깊이맵을 예측하기 위한 비전 파운데이션 모델입니다[cite: 8].",
      hint:
        "모델 이름에 깊이를 의미하는 Depth가 직접 포함되어 있습니다."
    },
    {
      id: "ifm-c5-mc-005",
      conceptId: "sapiens-human-foundation-model",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt:
        "메타에서 공개한 사람 중심 비전 파운데이션 모델로, 포즈 추정, 신체 부위 분할, 깊이 추정 등을 수행하는 모델은?",
      options: [
        "Sapiens",
        "MobileNet",
        "AlexNet",
        "LeNet"
      ],
      answer: 0,
      explanation:
        "Sapiens는 약 3000만 개의 사람 이미지로 학습된 사람 중심 비전 파운데이션 모델로, 2D 포즈 추정, 신체 부위 분할, 깊이 추정, 표면 법선 예측 등의 작업을 수행합니다[cite: 8].",
      hint:
        "인류를 의미하는 이름을 가진 메타의 사람 중심 비전 모델입니다."
    },
    {
      id: "ifm-c5-mc-006",
      conceptId: "grounding-dino-plus-sam-pipeline",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt:
        "Grounding DINO와 SAM 모델을 파이프라인으로 연결했을 때 수행할 수 있는 작업은?",
      options: [
        "이미지의 채널을 1개로 줄이고 텍스트 파일을 삭제함",
        "텍스트로 객체를 지정하면 Grounding DINO가 위치를 찾고 SAM이 해당 영역을 정밀하게 분할함",
        "모든 단어의 알파벳 철자를 역순으로 재배치함",
        "컴퓨터 화면의 해상도를 320x240으로 축소함"
      ],
      answer: 1,
      explanation:
        "Grounding DINO가 텍스트 지시에 대응하는 객체의 바운딩 박스를 탐지하면 SAM이 해당 위치를 바탕으로 세그멘테이션 마스크를 생성할 수 있습니다[cite: 8].",
      hint:
        "텍스트 기반 객체 탐지와 정밀 마스크 분할의 연계 과정입니다."
    },
    {
      id: "ifm-c5-mc-007",
      conceptId: "small-vlm-on-device",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt:
        "상대적으로 적은 연산 자원으로 로컬 환경에서 실행할 수 있도록 설계된 소형 VLM의 예시는?",
      options: [
        "GPT-4-1000B",
        "SuperCluster-VLM",
        "SmolVLM / Moondream",
        "Mega-Vision-800B"
      ],
      answer: 2,
      explanation:
        "강의에서는 SmolVLM, Moondream과 같은 Small VLM을 상대적으로 가벼운 멀티모달 모델 사례로 소개합니다[cite: 8].",
      hint:
        "작은 크기를 의미하는 이름이 붙은 경량 멀티모달 모델을 찾으세요."
    },
    {
      id: "ifm-c5-mc-008",
      conceptId: "sam-promptable-segmentation",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt:
        "SAM(Segment Anything Model)이 객체 분할을 위해 활용할 수 있는 프롬프트 입력 형태에 해당하는 것은?",
      options: [
        "오직 3D 메쉬 파일만 지원",
        "오직 C++ 소스 코드 텍스트만 지원",
        "오직 오디오 주파수 신호만 지원",
        "점 클릭, 바운딩 박스, 부분 영역 등의 시각적 프롬프트"
      ],
      answer: 3,
      explanation:
        "SAM은 점이나 박스와 같은 다양한 프롬프트를 통해 사용자가 원하는 객체나 영역을 지정할 수 있습니다[cite: 8].",
      hint:
        "사용자가 마우스로 점을 찍거나 사각 영역을 지정하는 상황을 생각해 보세요."
    },
    {
      id: "ifm-c5-mc-009",
      conceptId: "depth-anything-v2-usage",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt:
        "Depth Anything v2가 활용될 수 있는 분야로 가장 적절한 것은?",
      options: [
        "자율주행, 로봇 비전, 3D 복원",
        "텍스트 파일의 철자 오타 자동 교정",
        "오디오 음악의 음높이 조절",
        "데이터베이스 테이블 정규화"
      ],
      answer: 0,
      explanation:
        "Depth Anything v2의 깊이 추정 결과는 자율주행, 로봇 비전, 3D 복원 등의 작업에 활용될 수 있습니다[cite: 8].",
      hint:
        "장면에서 물체까지의 거리나 공간 구조를 알아야 하는 분야를 생각해 보세요."
    },
    {
      id: "ifm-c5-mc-010",
      conceptId: "sapiens-four-tasks",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt:
        "메타의 Sapiens 모델이 사람 이미지에 대해 수행하는 주요 비전 태스크에 포함되지 않는 것은?",
      options: [
        "2D 인체 포즈 추정",
        "음성 파일의 음높이 자동 튜닝",
        "신체 부위 세그멘테이션",
        "인체 표면 법선 방향 추정"
      ],
      answer: 1,
      explanation:
        "Sapiens는 2D Pose Estimation, Body-part Segmentation, Depth Estimation, Surface Normal Prediction과 같은 사람 중심 비전 태스크를 수행합니다[cite: 8].",
      hint:
        "시각적 인체 분석과 관련 없는 오디오 작업을 찾으세요."
    },
    {
      id: "ifm-c5-mc-011",
      conceptId: "korean-vlm-development-need",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt:
        "글로벌 VLM 모델이 존재함에도 한국어 특화 VLM 개발이 필요한 이유로 가장 적절한 것은?",
      options: [
        "글로벌 VLM은 한국 이미지를 아예 읽지 못하기 때문에",
        "한국어 VLM을 만들면 GPU 장비가 필요 없어지기 때문에",
        "한국어의 토큰화 특성과 국내 문서·간판·문화적 시각 맥락을 더 잘 처리하기 위해",
        "외국어 모델을 사용하면 컴퓨터가 고장 나기 때문에"
      ],
      answer: 2,
      explanation:
        "언어에 따라 토큰화 효율과 표현 특성이 다르고, 국내 문서와 시각적 문화 맥락도 존재하므로 한국어와 국내 데이터에 특화된 VLM이 필요할 수 있습니다[cite: 8].",
      hint:
        "한국어라는 언어 자체의 특성과 한국 환경의 시각적 데이터를 함께 생각해 보세요."
    },
    {
      id: "ifm-c5-mc-012",
      conceptId: "controlnet-spatial-conditioning-concept",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt:
        "이미지 생성 모델에 스케치, 깊이맵, 사람 포즈 등의 조건을 추가하여 원하는 구조의 이미지를 생성하도록 제어하는 모델은?",
      options: [
        "AlexNet",
        "VGG-16",
        "LeNet",
        "ControlNet"
      ],
      answer: 3,
      explanation:
        "ControlNet은 Sketch, Depth Map, Edge, Segmentation, Human Pose와 같은 조건 정보를 이용해 이미지 생성 결과의 구조를 제어합니다[cite: 8].",
      hint:
        "생성 이미지의 형태를 제어(Control)하기 위한 네트워크입니다."
    },
    {
      id: "ifm-c5-sa-013",
      conceptId: "sam-sa-name",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "short-answer",
      prompt:
        "점이나 박스 등의 프롬프트를 받아 다양한 객체를 분할하는 메타의 범용 세그멘테이션 모델 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: [
        "SAM",
        "sam",
        "Segment Anything",
        "Segment Anything Model"
      ],
      explanation:
        "Segment Anything Model(SAM)입니다[cite: 8].",
      hint:
        "Segment Anything Model의 영문 3글자 약자입니다."
    },
    {
      id: "ifm-c5-sa-014",
      conceptId: "sapiens-sa-name",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "short-answer",
      prompt:
        "약 3000만 개의 사람 이미지로 학습되어 포즈 추정, 신체 부위 분할, 깊이 추정 등을 수행하는 메타의 사람 중심 비전 파운데이션 모델명은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Sapiens", "sapiens", "사피엔스"],
      explanation:
        "Meta의 사람 중심 비전 파운데이션 모델 Sapiens입니다[cite: 8].",
      hint:
        "인류를 의미하는 단어에서 이름을 가져온 메타의 사람 중심 비전 모델입니다."
    },
    {
      id: "ifm-c5-es-015",
      conceptId: "sam-promptable-foundation-essay",
      difficulty: "easy",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "essay",
      prompt:
        "SAM(Segment Anything Model)이 범용 이미지 세그멘테이션 파운데이션 모델로 활용될 수 있는 이유를, 대규모 학습 데이터와 프롬프트 기반 분할 방식의 관점에서 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "SAM",
        "프롬프트",
        "점",
        "박스",
        "마스크",
        "세그멘테이션",
        "대규모 데이터"
      ],
      modelAnswer:
        "SAM은 약 1,100만 개의 이미지와 약 10억 개의 마스크로 구성된 대규모 데이터를 활용해 학습된 범용 세그멘테이션 모델이다[cite: 8]. 특정 클래스만 고정적으로 분할하는 것이 아니라 사용자가 점, 바운딩 박스, 부분 영역 등의 프롬프트를 제공하면 해당 지시에 맞는 객체의 마스크를 생성할 수 있다. 따라서 다양한 이미지와 객체에 유연하게 적용할 수 있다[cite: 8].",
      rubricKeywords: [
        "대규모 이미지 및 마스크 학습",
        "점/박스 등 프롬프트 입력",
        "원하는 객체의 세그멘테이션 마스크 생성",
        "다양한 객체에 범용적으로 적용"
      ],
      minLength: 20,
      explanation:
        "SAM의 대규모 데이터 학습과 점·박스 등의 프롬프트를 이용한 범용 세그멘테이션 특성을 설명합니다[cite: 8].",
      hint:
        "많은 이미지와 마스크로 학습되었다는 점과, 사용자가 점이나 박스로 분할할 대상을 지정할 수 있다는 점을 함께 작성하세요."
    }
  ]
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
