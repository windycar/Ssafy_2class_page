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
  medium: [
    // ==========================================
    // 카테고리 1: AI 파운데이션 모델과 CLIP 구조 및 원리 (15문항)
    // ==========================================
    {
      id: "ifm-c1-mc-med-001",
      conceptId: "clip-contrastive-matrix-diagonal",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "multiple-choice",
      prompt: "N개의 이미지와 N개의 텍스트 쌍으로 구성된 미니배치에서 CLIP 대조학습 유사도 행렬(N x N)을 계산할 때, 실제 일치하는 양성(Positive) 페어들이 위치하는 곳은?",
      options: [
        "행렬의 주대각선(Diagonal) 상의 N개 원소",
        "행렬의 첫 번째 가로 행에 위치한 N개 원소",
        "행렬의 마지막 세로 열에 위치한 N개 원소",
        "행렬의 테두리 외곽에 위치한 2N개 원소"
      ],
      answer: 0,
      explanation: "동일한 인덱스 i를 갖는 (이미지 i, 텍스트 i) 쌍이 올바른 매칭이므로 행렬의 주대각선 위치에 있는 N개 원소가 양성 페어가 됩니다.",
      hint: "이미지 인덱스와 텍스트 인덱스가 일치하는 행렬의 대각선 성분을 떠올려 보세요."
    },
    {
      id: "ifm-c1-mc-med-002",
      conceptId: "foundation-model-lifecycle-five-steps",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "multiple-choice",
      prompt: "스탠포드 보고서에 제시된 파운데이션 모델 기반 인공지능 서비스 개발 프로세스 5단계를 올바른 순서대로 나열한 것은?",
      options: [
        "Training → Data Creation → Data Curation → Deployment → Adaptation",
        "Data Creation → Data Curation → Training → Adaptation → Deployment",
        "Data Curation → Adaptation → Data Creation → Training → Deployment",
        "Data Creation → Training → Deployment → Data Curation → Adaptation"
      ],
      answer: 1,
      explanation: "데이터 생성(Creation) → 데이터 정제(Curation) → 대규모 사전학습(Training) → 하위 작업 적응(Adaptation) → 실제 배포(Deployment) 순으로 진행됩니다.",
      hint: "데이터 수집 및 정제에서 시작하여 사전학습, 하위작업 적응을 거쳐 배포되는 순서입니다."
    },
    {
      id: "ifm-c1-mc-med-003",
      conceptId: "clip-negative-pair-count-calc",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "multiple-choice",
      prompt: "배치 크기 N = 32 일 때, CLIP 대조학습에서 거리를 멀어지도록 학습시키는 불일치 음성(Negative) 페어의 총 개수는?",
      options: [
        "32개",
        "64개",
        "992개",
        "1024개"
      ],
      answer: 2,
      explanation: "전체 32 x 32 = 1024개 쌍 중에서 대각선의 정답 양성 페어 32개를 제외하므로 1024 - 32 = 992개의 음성 페어가 생성됩니다.",
      hint: "전체 배치 조합(N x N)에서 정답 대각선 페어(N)를 뺀 개수를 계산해 보세요."
    },
    {
      id: "ifm-c1-mc-med-004",
      conceptId: "clip-zero-shot-similarity-matrix-dim",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "multiple-choice",
      prompt: "100장의 쿼리 이미지에 대해 10개의 후보 텍스트 클래스를 분류하기 위해 임베딩 내적을 수행할 때 생성되는 코사인 유사도 행렬의 차원은?",
      options: [
        "10x10",
        "100x100",
        "512x512",
        "100x10"
      ],
      answer: 3,
      explanation: "100개의 이미지 임베딩 벡터와 10개의 텍스트 임베딩 벡터 간의 내적이므로 (100 x 10) 크기의 유사도 행렬이 도출됩니다.",
      hint: "입력 이미지 개수(행)와 비교할 텍스트 카테고리 개수(열)의 조합입니다."
    },
    {
      id: "ifm-c1-mc-med-005",
      conceptId: "clip-projection-layer-dimension-matching",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "multiple-choice",
      prompt: "CLIP에서 이미지 인코더 출력 차원(768)과 텍스트 인코더 출력 차원(512)이 서로 다를 때, 두 모달리티 간 내적 유사도를 계산하기 위해 사용하는 선형 투영(Projection) 레이어의 역할은?",
      options: [
        "두 모달리티의 특징 벡터를 동일한 차원의 공통 임베딩 공간(예: 512차원)으로 사영함",
        "이미지 인코더의 특징 벡터를 강제로 1차원 스칼라 수치로 합산함",
        "텍스트 인코더의 출력 벡터를 무작위 가우시안 노이즈로 변환함",
        "두 벡터를 이어붙여 1280차원의 단일 텐서로 확장함"
      ],
      answer: 0,
      explanation: "각 인코더 뒤에 선형 투영 레이어(W_i, W_t)를 두어 서로 다른 출력 차원을 동일한 공통 임베딩 차원으로 매핑한 후 정규화 내적합니다.",
      hint: "서로 다른 두 인코더의 출력 벡터를 동일한 크기의 공통 공간으로 맞추어 줍니다."
    },
    {
      id: "ifm-c1-mc-med-006",
      conceptId: "clip-l2-normalization-cosine",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "multiple-choice",
      prompt: "CLIP에서 이미지 임베딩 벡터와 텍스트 임베딩 벡터를 내적하기 직전에 L2 정규화(L2-normalize)를 수행하는 수학적 이유는?",
      options: [
        "임베딩 벡터의 길이를 0으로 만들어 연산량을 아끼기 위함",
        "단순 내적 연산이 두 벡터 간의 코사인 유사도(Cosine Similarity)와 완벽히 일치하도록 만들기 위함",
        "소프트맥스 함수의 활성화를 비활성화하기 위함",
        "모든 음수 원소를 양수로 반전시키기 위함"
      ],
      answer: 1,
      explanation: "벡터의 크기를 1로 정규화하면 단순 내적(Dot product) 결과가 두 벡터 사이의 코사인 유사도와 수학적으로 같아집니다.",
      hint: "벡터의 크기(Norm)를 1로 맞추어 각도 기반의 코사인 유사도를 얻기 위함입니다."
    },
    {
      id: "ifm-c1-mc-med-007",
      conceptId: "clip-vs-resnet-ood-robustness",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "multiple-choice",
      prompt: "ImageNet 검증셋에서 유사한 정확도를 기록한 표준 지도학습 모델(ResNet-101)과 비교하여, 스케치나 왜곡 이미지(ImageNet-Sketch 등)가 주어졌을 때 CLIP이 보인 강건성(Robustness) 특성은?",
      options: [
        "ResNet-101보다 정확도가 훨씬 더 급격하게 하락함",
        "두 모델 모두 정확도가 0%로 완전히 붕괴됨",
        "자연어 개념 정렬 덕분에 분포 변화(OOD) 환경에서도 훨씬 높은 정확도를 유지함",
        "스케치 데이터셋에서는 제로샷 분류가 완전히 불가능함"
      ],
      answer: 2,
      explanation: "CLIP은 다양한 웹 데이터에서 자연어 시각 개념을 학습했기 때문에 스케치, 렌디션 등 분포가 다른 데이터셋에서도 기존 지도학습 모델보다 훨씬 강건합니다.",
      hint: "자연어 기반의 포괄적인 시각 개념 학습이 도메인 변화에 대한 저항성을 높여줍니다."
    },
    {
      id: "ifm-c1-mc-med-008",
      conceptId: "clip-temperature-parameter-role",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "multiple-choice",
      prompt: "CLIP 손실함수에서 코사인 유사도에 곱해지는 학습 가능한 스케일 exp(t)의 역할은?",
      options: [
        "임베딩 벡터의 차원 수를 동적으로 변경함",
        "소프트맥스 함수를 시그모이드 함수로 강제 치환함",
        "이미지 인코더의 패치 크기를 조절함",
        "로짓의 스케일을 조절하여 소프트맥스 확률 분포의 선명도(Sharpness)를 조율함"
      ],
      answer: 3,
      explanation: "온도 스케일 파라미터는 로짓 크기를 조절해 소프트맥스 확률 분포가 지나치게 평평하거나 뾰족해지지 않도록 최적화합니다.",
      hint: "소프트맥스 입력 로짓의 크기를 스케일링하여 확률 분포의 첨도를 제어합니다."
    },
    {
      id: "ifm-c1-mc-med-009",
      conceptId: "prompt-engineering-context-alignment",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "multiple-choice",
      prompt: "CLIP 제로샷 평가에서 단일 레이블 단어('dog') 대신 'A photo of a dog, a type of pet.' 같은 상세 프롬프트를 구성했을 때 나타나는 효과는?",
      options: [
        "문맥적 다의성(중의성)을 해소하고 사전학습 데이터의 문장 분포와 정렬되어 제로샷 성능이 개선됨",
        "텍스트 인코더의 메모리 사용량이 100배로 폭증해 이미지와 무관한 텍스트만 처리함",
        "이미지 인코더가 텍스트 단어를 직접 읽어내기 시작함",
        "소프트맥스 연산의 역전파가 차단됨"
      ],
      answer: 0,
      explanation: "문맥이 포함된 템플릿은 단어의 동음이의어 혼란을 줄이고 사전학습된 캡션 형태와 유사해져 분류 정확도를 끌어올립니다.",
      hint: "단어의 모호성을 줄이고 사전학습 캡션과 유사한 문맥을 제공하는 효과를 생각하세요."
    },
    {
      id: "ifm-c1-mc-med-010",
      conceptId: "data-curation-filtering-criteria",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "multiple-choice",
      prompt: "대규모 이미지-텍스트 파운데이션 모델 학습을 위해 웹 데이터를 수집한 후 데이터 정제(Data Curation) 단계에서 주로 필터링하여 걸러내는 대상은?",
      options: [
        "고화질의 컬러 사진 및 전문 캡션 데이터",
        "내용과 무관한 극단적 저품질 이미지, 중복 데이터, 지나치게 짧거나 의미 없는 텍스트",
        "사람과 사물이 함께 포함된 복합 장면 이미지와 그에 대한 전문 캡션",
        "영문 알파벳으로 작성된 모든 자연어 문장"
      ],
      answer: 1,
      explanation: "노이즈가 심한 웹 데이터에서 의미 없는 짧은 글, 중복 샘플, 해상도가 너무 낮은 이미지를 걸러내는 정제 과정이 필수적입니다.",
      hint: "학습 품질을 떨어뜨리는 중복, 오염, 극단적 저품질 데이터들을 제거합니다."
    },
    {
      id: "ifm-c1-mc-med-011",
      conceptId: "finetuning-vs-prompting-parameter-change",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "multiple-choice",
      prompt: "파운데이션 모델의 적응(Adaptation) 단계에서 프롬프트 엔지니어링과 파인튜닝(Fine-tuning)의 가장 큰 기술적 차이점은?",
      options: [
        "프롬프트 엔지니어링은 모델 가중치를 학습시키고, 파인튜닝은 가중치를 고정함",
        "두 기법 모두 수억 개의 파라미터를 무조건 처음부터 다시 초기화함",
        "프롬프트 엔지니어링은 모델 가중치를 고정한 채 입력을 설계하고, 파인튜닝은 모델 가중치를 직접 업데이트함",
        "파인튜닝은 오직 1개의 데이터 샘플만으로 모델을 학습시킴"
      ],
      answer: 2,
      explanation: "프롬프트 엔지니어링은 모델 가중치 변경 없이 배경지식을 유도하며, 파인튜닝은 목적에 맞게 모델 가중치 자체를 갱신합니다.",
      hint: "신경망 내부의 가중치 파라미터가 실제로 갱신되는지 여부의 차이입니다."
    },
    {
      id: "ifm-c1-mc-med-012",
      conceptId: "clip-subword-tokenization-advantage",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "multiple-choice",
      prompt: "CLIP의 텍스트 인코더가 전체 단어(Word) 단위 대신 서브워드(Sub-word) 단위 토크나이저를 채택하여 얻는 주된 이점은?",
      options: [
        "텍스트 인코더의 가중치 파라미터가 0개로 축소됨",
        "이미지 인코더의 패치 분할 연산을 생략하고 전체 이미지를 하나의 토큰으로 처리함",
        "모든 영어 문장을 한 글자짜리 알파벳으로만 고정함",
        "사전에 없는 신조어나 희귀 단어(OOV)도 부분 단어 조합으로 유연하게 처리할 수 있음"
      ],
      answer: 3,
      explanation: "서브워드 토큰화(BPE 등)는 미학습 희귀 단어나 오타가 들어와도 하위 단위 조각으로 쪼개어 표현할 수 있습니다.",
      hint: "사전에 등록되지 않은 생소한 단어나 복합어를 쪼개어 표현하는 장점입니다."
    },
    {
      id: "ifm-c1-sa-med-013",
      conceptId: "clip-symmetric-losses-and-batch-calc",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "short-answer",
      prompt: "N개 이미지와 N개 텍스트 배치에서 CLIP이 대칭적으로 계산하는 두 가지 크로스엔트로피 손실의 방향 명칭과, 대각선에 위치하는 양성 페어의 총 개수를 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["이미지-투-텍스트, 텍스트-투-이미지, N개", "Image-to-Text, Text-to-Image, N", "Image-to-Text Loss, Text-to-Image Loss, N개", "이미지-투-텍스트, 텍스트-투-이미지, N"],
      explanation: "Image-to-Text 손실과 Text-to-Image 손실의 평균을 취하며, 정답 양성 페어는 N개입니다.",
      hint: "이미지 기준 손실, 텍스트 기준 손실 두 방향 명칭과 배치 내 정답 쌍 개수를 쓰세요."
    },
    {
      id: "ifm-c1-sa-med-014",
      conceptId: "foundation-five-steps-sa",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "short-answer",
      prompt: "파운데이션 모델 개발 5단계 중 대규모 사전학습(Training) 직전의 데이터 선별/정제 단계와, 사전학습 직후 특정 작업에 맞추는 단계의 영문 명칭을 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Data Curation, Adaptation", "data curation, adaptation", "Data Curation, Adaptation 단계", "Data curation, adaptation"],
      explanation: "사전학습 직전 단계는 Data Curation, 직후 적응 단계는 Adaptation입니다.",
      hint: "데이터 정제를 뜻하는 Curation과 하위 적응을 뜻하는 Adaptation입니다."
    },
    {
      id: "ifm-c1-es-med-015",
      conceptId: "clip-contrastive-matrix-derivation-essay",
      difficulty: "medium",
      category: "AI 파운데이션 모델과 CLIP 구조 및 원리",
      questionType: "essay",
      prompt: "N개 이미지와 N개 텍스트로 구성된 미니배치에서 CLIP의 N x N 코사인 유사도 행렬 계산 과정과, 대칭 크로스엔트로피 손실(Image Loss + Text Loss)이 최적화되는 원리를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["코사인 유사도", "N x N", "주대각선", "양성", "음성", "대칭"],
      modelAnswer: "1) N개 이미지 임베딩과 N개 텍스트 임베딩을 L2 정규화한 후 내적하여 N x N 크기의 코사인 유사도 행렬을 생성한다. 2) 주대각선의 양성 페어가 비대각선의 음성 페어보다 높은 유사도를 갖도록 학습한다. 3) Image-to-Text와 Text-to-Image 방향의 크로스엔트로피 손실을 모두 계산한 뒤 평균하여 양방향 정합을 학습한다.",
      rubricKeywords: [
        "N x N 코사인 유사도 행렬 생성",
        "대각선 양성 페어 높은 유사도 및 비대각선 음성 페어 낮은 유사도",
        "Image-to-Text 및 Text-to-Image 대칭 손실"
      ],
      minLength: 20,
      explanation: "L2 정규화 기반 유사도 행렬 산출과 대각선 최대화 및 양방향 대칭 크로스엔트로피 평균 최적화 원리를 서술합니다.",
      hint: "유사도 행렬 생성, 대각선/비대각선 학습 방향, 두 방향 손실의 평균 최적화를 순서대로 작성하세요."
    },

    // ==========================================
    // 카테고리 2: SigLIP 및 멀티모달 정합/응용 (15문항)
    // ==========================================
    {
      id: "ifm-c2-mc-med-001",
      conceptId: "siglip-sigmoid-loss-summation",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "multiple-choice",
      prompt: "SigLIP 모델이 Softmax 대신 Sigmoid를 적용할 때 손실 함수가 배치 내 모든 페어(N x N)에 대해 계산되는 형태는?",
      options: [
        "모든 N x N 개별 쌍에 대한 독립적인 이진 분류 로그 손실의 이중 합산",
        "행렬의 대각선 원소들만 선택하여 계산한 단일 평균값",
        "전체 행렬 원소를 곱한 후 소프트맥스를 1회 적용한 값",
        "음성 페어는 제외하고 양성 페어만 더한 단순 합계"
      ],
      answer: 0,
      explanation: "SigLIP은 N x N개의 모든 이미지-텍스트 쌍을 독립적인 이진 분류 문제로 보고 시그모이드 로그 손실을 이중 합산합니다.",
      hint: "전체 행렬의 모든 원소 쌍 각각에 대해 독립적인 시그모이드 손실을 더해 나갑니다."
    },
    {
      id: "ifm-c2-mc-med-002",
      conceptId: "siglip-distributed-efficiency-math",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "multiple-choice",
      prompt: "대규모 GPU 분산 학습 환경에서 SigLIP이 기존 CLIP의 Softmax 대비 통신 오버헤드를 획기적으로 줄인 수학적 원리는?",
      options: [
        "모든 가중치 파라미터를 8비트로 양자화했기 때문에",
        "분모에 전체 배치의 지수합을 구하는 전역 정규화가 없어 쌍 단위 독립 계산이 가능하므로",
        "어텐션 연산의 쿼리와 키 벡터를 무조건 삭제했기 때문에",
        "GPU 간의 네트워크 연결 없이 단일 CPU로만 학습하므로"
      ],
      answer: 1,
      explanation: "CLIP Softmax는 분모 정규화를 위해 모든 GPU 간 전역 배치 통신이 필수적이지만, SigLIP은 개별 쌍 독립 시그모이드 연산이라 통신 부담이 적습니다.",
      hint: "전체 배치의 지수합을 전역적으로 나누어주는 분모 정규화 과정의 유무를 비교해 보세요."
    },
    {
      id: "ifm-c2-mc-med-003",
      conceptId: "siglip-linear-transformation-logits",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "multiple-choice",
      prompt: "SigLIP 알고리즘에서 코사인 유사도 s_ij 에 학습 가능한 온도 파라미터 t와 편향(Bias) b를 적용하여 로짓을 구성하는 수식은?",
      options: [
        "logits = s_ij + t * b",
        "logits = (s_ij - b) / t",
        "logits = s_ij * exp(t) + b",
        "logits = s_ij / (exp(t) + b)"
      ],
      answer: 2,
      explanation: "알고리즘 수식에 따라 유사도 s_ij 에 스케일 exp(t)를 곱하고 바이어스 b를 더해 최종 로짓을 형성합니다.",
      hint: "유사도에 지수화된 온도를 곱하고 편향을 더해주는 선형 변환 형태입니다."
    },
    {
      id: "ifm-c2-mc-med-004",
      conceptId: "imagebind-binding-core-modality",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "multiple-choice",
      prompt: "ImageBind가 6개 모달리티를 1:1로 전부 직접 짝지어 학습하지 않고도 단일 공간에 정합할 수 있었던 바인딩 중심 모달리티는?",
      options: [
        "오디오 소리 데이터",
        "IMU 모션 센서 데이터",
        "깊이 맵(Depth) 데이터",
        "이미지 및 비디오 (시각 데이터)"
      ],
      answer: 3,
      explanation: "ImageBind는 자연스럽게 다양한 센서와 짝을 이루는 '이미지/비디오'를 중심 축(Anchor)으로 삼아 모든 모달리티를 연결했습니다.",
      hint: "모든 모달리티와 자연스러운 쌍을 맺을 수 있는 시각 중심 모달리티입니다."
    },
    {
      id: "ifm-c2-mc-med-005",
      conceptId: "imagebind-thermal-audio-direct-comparison",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "multiple-choice",
      prompt: "ImageBind 임베딩 공간에서 직접 쌍으로 학습한 적 없는 '열화상(Thermal) 이미지'와 '오디오(Audio)' 사이의 유사도를 직접 비교할 수 있는 이유는?",
      options: [
        "모든 모달리티 인코더가 시각 데이터를 매개로 동일한 공통 임베딩 공간에 정렬되었기 때문",
        "열화상 이미지를 텍스트 문서로 강제 변환했기 때문에",
        "오디오 신호의 주파수를 흑백 이미지로 렌더링했기 때문에",
        "두 데이터의 파일 크기가 완전히 동일하기 때문에"
      ],
      answer: 0,
      explanation: "모든 모달리티 인코더가 공통 시각 공간에 맞추어 정합되었으므로, 직접 페어링되지 않은 모달리티 간에도 벡터 유사도 비교가 가능합니다.",
      hint: "시각 데이터를 매개체로 하여 모든 인코더가 하나의 공유 벡터 공간을 바라보도록 정렬되었습니다."
    },
    {
      id: "ifm-c2-mc-med-006",
      conceptId: "styleclip-latent-optimization",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "multiple-choice",
      prompt: "StyleCLIP의 잠재 벡터 최적화 방식에서 텍스트 명령으로 이미지를 편집할 때 주로 최적화하는 대상은?",
      options: [
        "CLIP 이미지 인코더의 모든 가중치",
        "생성 모델의 잠재 공간 벡터(Latent Vector)",
        "텍스트 인코더의 어휘 토큰 사전",
        "입력 모니터의 RGB 색상 프로파일"
      ],
      answer: 1,
      explanation: "StyleCLIP의 최적화 모드에서는 사전학습된 모델들은 고정하고, 생성하고자 하는 이미지의 잠재 공간 벡터(Latent Vector)를 CLIP 손실로 업데이트합니다.",
      hint: "생성 모델이 이미지를 합성할 때 시작점이 되는 잠재 벡터(Latent Vector)를 조작합니다."
    },
    {
      id: "ifm-c2-mc-med-007",
      conceptId: "siglip-negative-pair-direction",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "multiple-choice",
      prompt: "SigLIP 손실함수에서 이미지-텍스트가 일치하지 않는 음성(Negative) 페어(z_ij = -1)의 손실을 최소화하기 위한 학습 방향은?",
      options: [
        "유사도 s_ij 를 무한대로 크게 만듦",
        "온도 파라미터 t를 0으로 고정함",
        "유사도 s_ij 가 작아져 시그모이드 출력이 0에 수렴하도록 유도함",
        "편향 b를 100으로 급격히 증가시킴"
      ],
      answer: 2,
      explanation: "음성 페어는 일치하지 않으므로 유사도 s_ij 를 낮추어 시그모이드 활성 확률이 0이 되도록 유도하여 오차를 줄입니다.",
      hint: "불일치하는 오답 쌍의 예측 확률이 0이 되도록 유사도를 낮추는 방향입니다."
    },
    {
      id: "ifm-c2-mc-med-008",
      conceptId: "clip-loss-guidance-3d",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "multiple-choice",
      prompt: "텍스트 기반 3D 아바타 생성(CLIP-Actor 등)에서 CLIP Loss가 미분 가능한 렌더러와 결합하여 수행하는 역할은?",
      options: [
        "3D 모델의 폴리곤 개수를 자동으로 10개로 축소함",
        "렌더링된 2D 이미지의 해상도를 흑백으로 강제 변환함",
        "텍스트 인코더의 역전파를 완전히 차단함",
        "렌더링된 2D 시점 이미지들과 목표 텍스트 설명 간의 코사인 유사도를 최대화하도록 3D 메쉬/모션을 최적화함"
      ],
      answer: 3,
      explanation: "다각도에서 렌더링한 2D 이미지들이 목표 텍스트와 의미적으로 일치하도록 CLIP 정합 손실을 역전파하여 3D 형태와 동작을 가이드합니다.",
      hint: "렌더링된 시각 이미지와 텍스트 명령 간의 유사도 점수가 높아지는 방향으로 3D 형태를 다듬습니다."
    },
    {
      id: "ifm-c2-mc-med-009",
      conceptId: "translating-vs-matching-design",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "multiple-choice",
      prompt: "모달리티 간 변환을 위한 2가지 핵심 디자인(Translating vs Matching) 중, CLIP과 ImageBind가 채택한 정합(Matching) 방식의 특징은?",
      options: [
        "공통 정렬된 피처 공간(Aligned feature space)을 구성하여 모달리티 간 유사도를 직접 측정함",
        "모달리티 A를 모달리티 B의 원본 픽셀로 직접 1:1 변환 생성함",
        "텍스트 데이터를 무조건 오디오 주파수로 번역하여 전달함",
        "모든 모달리티의 가중치를 0으로 초기화하여 비교를 생략함"
      ],
      answer: 0,
      explanation: "정합(Matching) 방식은 공통 피처 공간을 구축하여 두 모달리티 임베딩 간의 유사도를 측정하는 구조입니다.",
      hint: "공통 피처 공간에 두 데이터를 함께 사영하여 유사도를 비교하는 방식입니다."
    },
    {
      id: "ifm-c2-mc-med-010",
      conceptId: "embedding-arithmetic-vector-logic",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "multiple-choice",
      prompt: "ImageBind의 임베딩 산술 연산(Embedding Arithmetic)이 성립하는 근본적인 원리는?",
      options: [
        "모든 모달리티가 동일한 파일 확장자와 저장 형식을 사용하고 같은 데이터베이스에서 관리되기 때문",
        "시각, 소리, 텍스트가 의미(Semantics)에 따라 공통 벡터 공간 상의 방향과 위치로 정렬되어 있기 때문",
        "오디오 인코더와 비전 인코더의 레이어 개수가 똑같기 때문",
        "임베딩 벡터의 모든 원소 값이 1로 고정되어 있기 때문"
      ],
      answer: 1,
      explanation: "공통 공간 상에서 개념과 의미에 따라 벡터 방향이 정렬되어 있으므로, 텍스트 단어 벡터 연산처럼 이종 모달리티 간 벡터 덧셈/뺄셈이 의미를 갖습니다.",
      hint: "의미에 따라 정렬된 공통 공간 상에서 벡터의 방향성과 크기가 개념을 나타내기 때문입니다."
    },
    {
      id: "ifm-c2-mc-med-011",
      conceptId: "siglip-vlm-backbone-preference",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "multiple-choice",
      prompt: "PaliGemma, SmolVLM 등 최신 VLM들이 비전 인코더 백본으로 기존 CLIP 대신 SigLIP을 채택하는 주요 이유는?",
      options: [
        "SigLIP은 비전 인코더의 파라미터가 100개 미만으로 극단적으로 작아서",
        "SigLIP은 오직 흑백 이미지만 학습할 수 있어서",
        "시그모이드 기반 학습을 통해 세밀한 이미지-텍스트 정렬 능력이 향상되고 노이즈 데이터에 강건하기 때문에",
        "소프트맥스 함수를 10번 중첩하여 사용하기 때문에"
      ],
      answer: 2,
      explanation: "SigLIP은 안정적인 손실함수 설계를 바탕으로 미세한 시각-언어 정렬 성능이 우수하여 최신 VLM의 눈으로 널리 사용됩니다.",
      hint: "SigLIP이 이미지와 텍스트를 정렬하는 방식이 최신 VLM의 비전 표현에 어떤 장점을 주는지 생각해 보세요."
    },
    {
      id: "ifm-c2-mc-med-012",
      conceptId: "clip-guided-zero-shot-captioning",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "multiple-choice",
      prompt: "사전학습된 언어 모델과 CLIP을 결합하여 별도의 이미지 캡셔닝 학습 없이 이미지 설명 생성을 유도할 때 사용하는 핵심 원리는?",
      options: [
        "이미지 픽셀을 텍스트 문자열로 직접 변환함",
        "언어 모델의 가중치를 무작위로 다시 초기화함",
        "모든 단어 후보에 동일한 확률을 부여함",
        "생성 중인 텍스트와 입력 이미지의 CLIP 유사도가 높아지도록 문장 생성을 가이드함"
      ],
      answer: 3,
      explanation: "언어 모델이 생성하는 문장 후보와 입력 이미지 사이의 CLIP 정합 점수를 이용해 이미지와 의미적으로 잘 맞는 문장이 생성되도록 유도합니다.",
      hint: "언어 모델이 만든 문장 후보와 이미지 사이의 의미적 유사도를 이용하는 방식을 생각해 보세요."
    },
    {
      id: "ifm-c2-sa-med-013",
      conceptId: "siglip-pairwise-label-values-sa",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "short-answer",
      prompt: "SigLIP 알고리즘에서 이미지-텍스트 쌍 (i, j)가 서로 일치하는 양성(Positive) 페어일 때와 일치하지 않는 음성(Negative) 페어일 때 부여되는 정답 라벨 z_ij 의 수치 2가지를 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["+1, -1", "1, -1"],
      explanation: "양성 페어에는 +1, 음성 페어에는 -1 라벨이 부여됩니다.",
      hint: "양수 1과 음수 1 기호를 순서대로 쓰세요."
    },
    {
      id: "ifm-c2-sa-med-014",
      conceptId: "imagebind-core-and-count-sa",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "short-answer",
      prompt: "ImageBind가 단일 공간에 통합 정합한 모달리티의 총 개수와, 다른 모달리티들을 묶어주는 중심 매개체 역할을 수행한 핵심 모달리티를 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["6개, 이미지/비디오", "6, 이미지", "6개, 시각 데이터", "6, 이미지/비디오"],
      explanation: "총 6가지 모달리티를 결합하며, 중심 매개체는 이미지/비디오(시각)입니다.",
      hint: "모달리티 개수 숫자와 시각 데이터 명칭을 적으세요."
    },
    {
      id: "ifm-c2-es-med-015",
      conceptId: "siglip-vs-clip-optimization-essay",
      difficulty: "medium",
      category: "SigLIP 및 멀티모달 정합/응용",
      questionType: "essay",
      prompt: "기존 CLIP의 Softmax 대조 손실과 SigLIP의 Sigmoid 손실의 연산 방식 차이를 비교하고, SigLIP이 대규모 분산 학습 효율과 노이즈 강건성 면에서 우수한 이유를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Softmax", "Sigmoid", "정규화", "독립", "분산 학습", "음성"],
      modelAnswer: "1) CLIP은 Softmax를 사용하여 전체 배치에 대한 전역 정규화(지수합 나눗셈)를 수행하므로, GPU 간 통신 비용이 크고 이미 멀어진 음성 페어에도 불필요한 밀어내기 학습이 발생한다. 2) SigLIP은 각 쌍을 독립적인 시그모이드 이진 분류 손실로 처리하므로 전역 정규화 통신이 불필요하여 분산 학습 효율이 뛰어나다. 3) 또한 시그모이드 함수의 포화 특성 덕분에 거리가 먼 오답 음성 데이터의 과도한 오차가 차단되어 노이즈가 많은 웹 데이터셋에서도 안정적으로 학습된다.",
      rubricKeywords: [
        "CLIP 전역 Softmax 정규화 vs SigLIP 쌍별 독립 Sigmoid",
        "전역 통신 배제로 분산 학습 효율 향상",
        "시그모이드 포화 특성을 통한 노이즈 음성 데이터 영향 차단"
      ],
      minLength: 20,
      explanation: "Softmax의 전역 정규화 한계와 Sigmoid의 쌍별 독립 처리 이점 및 노이즈 차단 원리를 비교 서술합니다.",
      hint: "전역 분모 나눗셈의 유무에 따른 GPU 통신 차이와 오답 쌍의 과도한 영향 차단 원리를 쓰세요."
    },

    // ==========================================
    // 카테고리 3: 시각언어모델(VLM) 아키텍처 및 LLaVA (15문항)
    // ==========================================
    {
      id: "ifm-c3-mc-med-001",
      conceptId: "vlm-visual-tokens-soft-prompts",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "multiple-choice",
      prompt: "VLM에서 이미지를 비전 인코더와 선형 프로젝션 레이어(W)에 통과시켜 얻은 특징 H_v 가 언어 모델(LLM) 관점에서 갖는 의미는?",
      options: [
        "텍스트 질문 토큰과 함께 입력 시퀀스를 구성하는 시각 소프트 프롬프트(Soft prompts) 토큰 임베딩",
        "언어 모델의 가중치를 0으로 리셋하는 초기화 신호",
        "최종 생성된 이미지의 RGB 픽셀 값 행렬",
        "소프트맥스 활성화 함수의 미분 기울기 벡터"
      ],
      answer: 0,
      explanation: "프로젝션 레이어를 거친 시각 특징 H_v 는 LLM의 텍스트 임베딩 공간과 차원이 일치되어 시각 토큰(소프트 프롬프트)으로 취급됩니다.",
      hint: "언어 모델이 텍스트 단어 토큰처럼 읽고 처리할 수 있는 시각 임베딩 토큰입니다."
    },
    {
      id: "ifm-c3-mc-med-002",
      conceptId: "llava-step1-vs-step2-freeze-state",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "multiple-choice",
      prompt: "LLaVA의 2단계 학습 파이프라인에서 Step 1(사전학습)과 Step 2(파인튜닝)의 모듈 학습/동결(Freeze) 상태를 바르게 비교한 것은?",
      options: [
        "Step 1: 전체 모듈 학습 / Step 2: 전체 모듈 동결",
        "Step 1: 프로젝션 W만 학습(비전/LLM 동결) / Step 2: 프로젝션 W와 LLM 함께 학습(비전 동결)",
        "Step 1: 비전 인코더만 학습 / Step 2: 언어 모델만 학습",
        "Step 1: LLM만 학습 / Step 2: 프로젝션 W만 학습"
      ],
      answer: 1,
      explanation: "Step 1에서는 시각-언어 정렬을 위해 프로젝션 W만 학습하고, Step 2에서는 대화 역량을 위해 W와 LLM을 함께 미세조정합니다.",
      hint: "1단계는 중간 연결층만 학습시키고, 2단계는 연결층과 거대 언어 모델을 함께 학습시킵니다."
    },
    {
      id: "ifm-c3-mc-med-003",
      conceptId: "llava-token-sequence-concatenation",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "multiple-choice",
      prompt: "LLaVA 모델에서 언어 모델(LLM)에 최종 입력되는 시퀀스 임베딩의 결합 순서 구조는?",
      options: [
        "비전 인코더의 가중치 행렬과 텍스트 토크나이저의 어휘 사전",
        "소프트맥스 확률값과 이미지 픽셀 원본 배열",
        "프로젝션된 시각 토큰(H_v)과 질문 텍스트 지시문 토큰(H_q)의 연결(Concatenation)",
        "출력 텍스트 답변과 정답 레이블의 1차원 내적"
      ],
      answer: 2,
      explanation: "시각 토큰 H_v 와 질문 텍스트 토큰 H_q 가 나란히 이어붙여져(Concat) LLM의 입력 시퀀스를 구성합니다.",
      hint: "시각 정보 토큰과 질문 지시문 텍스트 토큰이 차례로 결합되어 LLM으로 들어갑니다."
    },
    {
      id: "ifm-c3-mc-med-004",
      conceptId: "llava-synthetic-chatgpt-coco-metadata",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "multiple-choice",
      prompt: "LLaVA 연구진이 고품질 시각 지시 데이터셋을 합성 생성하기 위해 ChatGPT(텍스트 전용 LLM)에 입력으로 제공한 COCO 메타데이터 2가지는?",
      options: [
        "이미지 파일의 바이너리 코드와 카메라 셔터 스피드",
        "이미지 픽셀 원본 RGB 행렬과 소프트맥스 확률",
        "GPU 메모리 점유율과 배치 사이즈 수치",
        "텍스트 캡션(Captions)과 객체 바운딩 박스 좌표(Bounding Boxes)"
      ],
      answer: 3,
      explanation: "ChatGPT는 텍스트만 읽을 수 있으므로, 이미지 대신 COCO의 텍스트 캡션과 객체 위치 박스 좌표를 텍스트로 전달해 대화 데이터를 합성했습니다.",
      hint: "이미지의 내용을 설명하는 문장 캡션과 물체들의 위치를 나타내는 사각 박스 좌표입니다."
    },
    {
      id: "ifm-c3-mc-med-005",
      conceptId: "llava-three-qa-types-complex-reasoning",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "multiple-choice",
      prompt: "LLaVA 합성 데이터의 3가지 질문 유형(대화, 상세 설명, 복잡 추론) 중 '상황에 내포된 원인, 결과, 논리적 맥락을 묻는 질문'에 해당하는 것은?",
      options: [
        "복잡한 추론 (Complex Reasoning)",
        "단순 객체 카운팅 (Simple Counting)",
        "픽셀 색상 판별 (Color Detection)",
        "화면 캡처 복사 (Screen Copy)"
      ],
      answer: 0,
      explanation: "복잡한 추론(Complex Reasoning)은 단순 묘사를 넘어 왜 그런 상황이 발생했는지 논리적 인과관계를 질문합니다.",
      hint: "장면 속 단서를 종합하여 심층적인 원인과 결과를 유추하는 질의 유형입니다."
    },
    {
      id: "ifm-c3-mc-med-006",
      conceptId: "vlm-pretrained-vision-freeze-rationale",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "multiple-choice",
      prompt: "LLaVA 같은 VLM 구축 시 거대한 비전 인코더를 밑바닥부터 새로 학습시키지 않고 사전학습된 CLIP/SigLIP을 동결하여 재사용하는 주된 이유는?",
      options: [
        "비전 인코더를 학습시키면 컴퓨터가 물리적으로 고장 나기 때문에",
        "이미 대규모 데이터로 검증된 풍부한 시각 표현력을 재활용하여 학습 자원과 비용을 대폭 절감하기 위해",
        "사전학습된 비전 인코더는 파라미터가 0개이기 때문에",
        "언어 모델의 텍스트 처리 기능을 차단하기 위해"
      ],
      answer: 1,
      explanation: "이미 수억 장의 데이터로 훈련된 비전 백본의 시각 지식을 그대로 활용하면 적은 컴퓨팅 자원으로도 강력한 VLM을 빠르게 구축할 수 있습니다.",
      hint: "수억 장의 데이터로 이미 다져진 시각 지식을 재사용하여 학습 비용을 아낍니다."
    },
    {
      id: "ifm-c3-mc-med-007",
      conceptId: "vlm-token-count-from-patches",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "multiple-choice",
      prompt: "입력 이미지가 ViT 비전 인코더를 통해 196개의 패치 임베딩으로 분할되고 1개의 선형 프로젝션 레이어를 거칠 때, LLM이 처리하게 되는 시각 토큰의 개수는?",
      options: [
        "1개",
        "14개",
        "196개",
        "768개"
      ],
      answer: 2,
      explanation: "선형 프로젝션 레이어는 각 패치 토큰의 채널 차원만 변환하므로 패치 개수(196개)는 그대로 유지되어 LLM에 196개 토큰으로 전달됩니다.",
      hint: "프로젝션 레이어는 토큰의 개수를 줄이지 않고 각 토큰의 벡터 차원만 변환합니다."
    },
    {
      id: "ifm-c3-mc-med-008",
      conceptId: "projection-layer-semantic-translation",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "multiple-choice",
      prompt: "VLM에서 프로젝션 레이어(W)가 단순한 행렬 차원 변환을 넘어 의미론적으로 수행하는 작업은?",
      options: [
        "텍스트 질문을 음성 주파수 신호로 변환함",
        "이미지 픽셀의 채도를 0으로 만들어 흑백화함",
        "언어 모델의 모든 은닉 상태를 초기화함",
        "비전 인코더의 시각 공간 특징 표현을 언어 모델의 텍스트 임베딩 공간 표현으로 정렬(번역)함"
      ],
      answer: 3,
      explanation: "시각 공간의 피처를 언어 모델이 텍스트 단어처럼 해석할 수 있는 언어 공간의 표현으로 매핑(번역)해 주는 핵심 역할을 합니다.",
      hint: "시각 인코더의 언어와 텍스트 언어 모델의 언어 사이를 통역해 주는 역할입니다."
    },
    {
      id: "ifm-c3-mc-med-009",
      conceptId: "gpt4v-industrial-anomaly-reasoning-depth",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "multiple-choice",
      prompt: "GPT-4V가 공업용 용기 부품 결함 검사(Anomaly Detection)에서 기존 단순 이진 분류 모델 대비 우수성을 보인 이유는?",
      options: [
        "결함 유무 판정뿐만 아니라 흠집 위치, 이물질 입자, 마모 부위의 구체적 원인을 텍스트로 상세히 분석/설명함",
        "결함이 발생하면 자동으로 부품을 물리적으로 수리함",
        "검사 속도가 빛의 속도보다 빠르게 연산됨",
        "모든 종류의 정상 부품을 무조건 결함으로 판정함"
      ],
      answer: 0,
      explanation: "단순히 불량 여부만 맞추는 기존 분류기와 달리, 결함의 시각적 위치와 형태적 이유를 종합 추론하여 텍스트로 설명합니다.",
      hint: "결함의 유무 판정을 넘어 위치와 구체적인 손상 원인을 논리적으로 설명하는 능력입니다."
    },
    {
      id: "ifm-c3-mc-med-010",
      conceptId: "claude-computer-use-gui-rationale",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "multiple-choice",
      prompt: "Claude 기반 Computer Use 에이전트가 소프트웨어를 제어할 때 텍스트 기반 접근 대신 '화면 캡처 이미지'를 처리하는 방식이 선호되는 이유는?",
      options: [
        "이미지 캡처 방식이 텍스트 처리보다 GPU 메모리를 100배 적게 쓰고 모든 작업을 즉시 처리하며 인터넷 연결 없이도 동작하기 때문에",
        "수많은 응용 프로그램과 웹사이트가 표준화된 제어 API를 제공하지 않아도 화면을 시각적으로 보면 범용 인터페이스가 가능하므로",
        "화면 캡처를 사용하면 마우스 클릭 속도가 10배 빨라지기 때문에",
        "텍스트 언어 모델의 토큰 소비를 완전히 없앨 수 있기 때문에"
      ],
      answer: 1,
      explanation: "프로그램마다 제어 API가 제각각이거나 없는 경우가 많아, 사람이 눈으로 모니터를 보듯 화면을 시각 처리하는 것이 가장 호환성이 높습니다.",
      hint: "전용 API가 없는 수많은 소프트웨어도 사람이 화면을 보듯 범용적으로 제어하기 위함입니다."
    },
    {
      id: "ifm-c3-mc-med-011",
      conceptId: "vlm-mlp-adapter-non-linear-advantage",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "multiple-choice",
      prompt: "LLaVA-1.5 등 발전된 VLM에서 프로젝션 레이어를 단일 선형 레이어(Linear) 대신 2층 MLP(Multi-Layer Perceptron)로 업그레이드했을 때 얻는 이점은?",
      options: [
        "비전 인코더의 모든 파라미터가 자동으로 삭제됨",
        "어텐션 레이어의 복잡도가 O(1)로 축소되고 모든 입력 토큰을 하나의 값으로 합침",
        "시각 특징과 언어 임베딩 사이의 복잡한 비선형 매핑 및 표현력이 대폭 향상됨",
        "입력 이미지의 채널 수가 흑백으로 강제 축소됨"
      ],
      answer: 2,
      explanation: "중간에 활성화 함수가 포함된 다층 MLP 어댑터를 사용하면 단순 선형 사영보다 시각-언어 정렬 표현력이 한층 풍부해집니다.",
      hint: "비선형 활성화 함수가 포함된 다층 구조를 통해 표현력을 더욱 높여줍니다."
    },
    {
      id: "ifm-c3-mc-med-012",
      conceptId: "vlm-efficient-training-fp16-lora",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "multiple-choice",
      prompt: "거대 VLM 파인튜닝 시 GPU 메모리 부족 문제를 해결하고 적은 자원으로 효율적 학습을 달성하기 위해 활용하는 최적화 기법 조합은?",
      options: [
        "1비트 정수 연산과 맥스 풀링 10회 중첩",
        "언어 모델의 레이어 90%를 영구 삭제하는 방식",
        "모든 입력 문장을 한 글자로 줄이는 전처리",
        "FP16/BF16 정밀도 최적화 및 저비용 파라미터 효율적 튜닝(PEFT/LoRA) 기법"
      ],
      answer: 3,
      explanation: "혼합 정밀도(FP16/BF16)와 저차원 분해 행렬 튜닝(LoRA) 등을 결합하여 거대 모델도 적은 GPU 메모리로 효율 학습할 수 있습니다.",
      hint: "연산 정밀도를 효율화하고 파라미터 일부만 효율적으로 튜닝하는 기법입니다."
    },
    {
      id: "ifm-c3-sa-med-013",
      conceptId: "llava-components-name-sa",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "short-answer",
      prompt: "LLaVA 아키텍처에서 시각 입력을 처리하는 사전학습 비전 인코더와, 최종 추론 및 답변을 생성하는 거대 언어 모델(LLM)의 명칭을 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["CLIP ViT, Vicuna", "CLIP, Vicuna", "CLIP ViT, LLaMA/Vicuna", "CLIP 비전 인코더, Vicuna"],
      explanation: "비전 인코더는 CLIP ViT, 언어 모델은 Vicuna를 사용했습니다.",
      hint: "CLIP 비전 모델과 오픈소스 LLM인 Vicuna 명칭을 쓰세요."
    },
    {
      id: "ifm-c3-sa-med-014",
      conceptId: "llava-two-stages-english-sa",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "short-answer",
      prompt: "LLaVA 2단계 학습 전략 중 시각-언어 개념을 맞추는 1단계와, 대화 및 지시 수행 능력을 완성하는 2단계의 대표 영문 명칭을 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Pre-training, Fine-tuning", "pre-training, fine-tuning", "Pre-training, Instruction Tuning", "Pretraining, Finetuning"],
      explanation: "Step 1은 Pre-training(사전학습), Step 2는 Fine-tuning(파인튜닝)입니다.",
      hint: "사전학습(Pre-training)과 미세조정(Fine-tuning)의 영문 표기입니다."
    },
    {
      id: "ifm-c3-es-med-015",
      conceptId: "vlm-token-transformation-and-llava-essay",
      difficulty: "medium",
      category: "시각언어모델(VLM) 아키텍처 및 LLaVA",
      questionType: "essay",
      prompt: "VLM에서 프로젝션 레이어(Projection Layer)가 비전 인코더의 출력 벡터 Z_v 를 언어 모델 입력용 시각 토큰 H_v 로 변환하는 원리와, LLaVA의 2단계 학습(사전학습 및 파인튜닝)에서 각 모듈의 동결/학습 상태를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["선형 레이어", "프로젝션", "언어 모델", "사전학습", "파인튜닝", "동결"],
      modelAnswer: "1) 프로젝션 레이어는 비전 인코더가 추출한 시각 특징 Z_v 를 언어 모델의 토큰 임베딩 공간과 동일한 차원으로 선형 변환하여 시각 소프트 프롬프트 토큰 H_v 를 생성한다. 2) Step 1(사전학습)에서는 비전 인코더와 언어 모델을 모두 동결(Freeze)하고 선형 프로젝션 레이어만 학습시켜 시각-언어 표현을 정렬한다. 3) Step 2(파인튜닝)에서는 비전 인코더는 계속 동결한 채 프로젝션 레이어와 언어 모델을 함께 미세조정하여 시각 지시 이행 및 대화 능력을 학습시킨다.",
      rubricKeywords: [
        "시각 특징 Z_v를 언어 임베딩 차원 H_v로 선형 사영",
        "Step 1 프로젝션 레이어만 학습 (비전/LLM 동결)",
        "Step 2 프로젝션 레이어 + LLM 동시 미세조정"
      ],
      minLength: 20,
      explanation: "프로젝션 레이어의 차원 정렬 역할과 LLaVA 2단계 학습에서의 모듈별 동결/학습 파라미터 구분을 서술합니다.",
      hint: "시각 특징을 텍스트 임베딩 규격으로 맞추는 과정과 1단계/2단계 학습 대상 모듈을 명시하세요."
    },

    // ==========================================
    // 카테고리 4: 최신 VLM 계열 및 비주얼 프롬프팅/특화 모델 (15문항)
    // ==========================================
    {
      id: "ifm-c4-mc-med-001",
      conceptId: "qwen2-vl-native-resolution-advantage",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "multiple-choice",
      prompt: "Qwen2-VL이 고정 크기 이미지 리사이징/패딩 대신 임의의 해상도(Native Resolution)를 직접 처리함으로써 얻은 핵심 시각 인식 이점은?",
      options: [
        "이미지 왜곡 없이 원본 비율과 해상도를 보존하여 작은 텍스트(OCR)와 미세 객체를 정밀하게 인식함",
        "비전 인코더의 연산 복잡도를 O(1)로 감소시킴",
        "모든 컬러 이미지를 흑백으로 강제 단순화함",
        "언어 모델의 어휘 사전 크기를 무한대로 확장함"
      ],
      answer: 0,
      explanation: "원본 해상도와 종횡비를 그대로 유지하여 패치화하므로 왜곡 없이 작은 글씨나 세부 물체를 정확히 인식합니다.",
      hint: "이미지를 강제로 정사각형으로 늘리거나 줄이지 않아 원본 디테일이 보존됩니다."
    },
    {
      id: "ifm-c4-mc-med-002",
      conceptId: "mrope-three-dimensional-tuple",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "multiple-choice",
      prompt: "Qwen2-VL의 Multimodal RoPE(M-ROPE)에서 텍스트, 이미지, 비디오 위치를 통합 모델링하기 위해 정의한 3차원 위치 튜플 성분 조합은?",
      options: [
        "밝기, 채도, 명도",
        "시간(Time), 높이(Height), 너비(Width)",
        "스트라이드, 패딩, 커널 크기",
        "쿼리, 키, 값"
      ],
      answer: 1,
      explanation: "M-ROPE는 위치 정보를 시간(T), 세로 높이(H), 가로 너비(W)의 3차원 튜플로 구성하여 멀티모달 위치를 회전 인코딩합니다.",
      hint: "동영상의 시간 축과 2차원 이미지의 가로세로 공간 축 조합입니다."
    },
    {
      id: "ifm-c4-mc-med-003",
      conceptId: "internvl-vision-scaleup-rationale",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "multiple-choice",
      prompt: "InternVL 모델이 기존 VLM과 차별화하여 비전 인코더(InternViT)를 6B(60억 파라미터) 규모로 대폭 스케일업한 설계 의도는?",
      options: [
        "언어 모델을 완전히 제거하고 시각 인코더만으로 문장을 생성하기 위해",
        "소프트맥스 활성화 함수를 대체하기 위해",
        "거대해진 LLM의 수용력에 걸맞게 시각 인코더의 시각적 표현력과 고해상도 정보 추출 능력을 균형 있게 끌어올리기 위해",
        "비전 인코더의 메모리 사용량을 0으로 만들기 위해"
      ],
      answer: 2,
      explanation: "LLM이 수십B로 커진 반면 비전 인코더가 너무 작으면 시각 정보 병목이 발생하므로, 비전 인코더 자체를 6B로 키워 균형을 맞췄습니다.",
      hint: "거대 언어 모델의 성능에 맞춰 시각 정보 추출기의 용량을 동등하게 확장한 것입니다."
    },
    {
      id: "ifm-c4-mc-med-004",
      conceptId: "som-coordinate-vs-mark-advantage",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "multiple-choice",
      prompt: "Set-of-Mark(SoM) 프롬프팅에서 VLM이 객체를 가리킬 때 픽셀 좌표 [x, y] 대신 '번호 마크'를 지정하게 함으로써 얻는 장점은?",
      options: [
        "이미지의 채널 수가 3채널에서 1채널로 축소됨",
        "VLM의 사전학습 단계가 완전히 생략됨",
        "모든 객체의 크기가 동일한 정사각형으로 고정됨",
        "연속적인 픽셀 좌표 회귀 오차를 피하고 이산적인 번호 기호를 언어적으로 명확히 지목하여 정확도를 극대화함"
      ],
      answer: 3,
      explanation: "VLM은 수치 좌표 예측에는 취약하지만 텍스트 기호(번호) 추론에는 강하므로, 번호를 직접 참조하게 하면 위치 정확도가 비약적으로 상승합니다.",
      hint: "미세한 숫자 좌표를 직접 맞추는 대신 직관적인 번호 기호를 지정하게 합니다."
    },
    {
      id: "ifm-c4-mc-med-005",
      conceptId: "biomedclip-vs-llavamed-distinction",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "multiple-choice",
      prompt: "의료 도메인 특화 모델인 BiomedCLIP과 LLaVA-Med의 구조적/기능적 차이점을 바르게 설명한 것은?",
      options: [
        "BiomedCLIP은 의료 이미지-텍스트 정합/검색 중심 모델이고, LLaVA-Med는 의료 대화 및 시각 질의응답을 수행하는 생성형 VLM이다",
        "BiomedCLIP은 대화형 챗봇이고, LLaVA-Med는 단순 1차원 필터이다",
        "두 모델은 완벽히 동일하며 이름만 다르게 발표되었다",
        "BiomedCLIP은 오디오 전용 모델이고, LLaVA-Med는 텍스트 전용 모델이다"
      ],
      answer: 0,
      explanation: "BiomedCLIP은 CLIP 기반의 의료 이미지-텍스트 정합 모델이며, LLaVA-Med는 대화형 질의응답이 가능한 생성형 VLM입니다.",
      hint: "대조학습 기반 정합 모델과 LLM이 결합된 대화형 생성 모델의 차이입니다."
    },
    {
      id: "ifm-c4-mc-med-006",
      conceptId: "anomalygpt-conversational-defect-reasoning",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "multiple-choice",
      prompt: "제조업 특화 VLM인 AnomalyGPT가 기존 컴퓨터 비전 결함 검사기 대비 현장에서 갖는 강점은?",
      options: [
        "결함 유무를 0 또는 1로만 단순 출력함",
        "결함의 위치와 종류를 시각적으로 짚어내고, 자연어 대화를 통해 결함 상태를 질의응답하고 설명함",
        "결함이 발생한 공장 설비의 전원을 물리적으로 차단함",
        "생산 라인의 속도를 2배로 가속함"
      ],
      answer: 1,
      explanation: "단순 탐지를 넘어 결함 여부, 위치, 종류를 시각적으로 파악하고 사용자와 자연어로 질의응답하며 상태를 설명합니다.",
      hint: "결함의 위치 및 종류 파악과 함께 자연어 대화로 결함 상태를 질의응답하는 역량입니다."
    },
    {
      id: "ifm-c4-mc-med-007",
      conceptId: "three-d-llm-point-cloud-fusion",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "multiple-choice",
      prompt: "3D-LLM이 평면 2D VLM과 구별되는 고유한 공간 추론 역량은?",
      options: [
        "오직 흑백 평면 사진만 입력받아 분석함",
        "문서의 텍스트 오타만 전문적으로 교정함",
        "3차원 포인트 클라우드(Point Cloud) 공간 특징을 언어와 정합하여 3D 공간 질의응답 및 입체 네비게이션을 수행함",
        "2D 이미지의 채널을 1개로 축소함"
      ],
      answer: 2,
      explanation: "3D 포인트 클라우드 공간 표현과 자연어를 정합하여 입체 공간 내 물체 위치 추론 및 경로 안내를 수행합니다.",
      hint: "3차원 입체 포인트 클라우드 데이터를 언어 모델과 융합하여 처리합니다."
    },
    {
      id: "ifm-c4-mc-med-008",
      conceptId: "vla-action-output",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "multiple-choice",
      prompt: "Vision-Language-Action(VLA) 모델이 일반적인 Vision-Language Model과 구별되는 핵심 출력은?",
      options: [
        "이미지의 RGB 픽셀 값",
        "소프트맥스 함수의 미분값과 분류 확률만으로 로봇의 행동을 직접 제어하며 영상 입력은 사용하지 않음",
        "HTML 소스 코드",
        "로봇의 이동, 그리퍼 제어, 관절 조작 등 실제 행동을 수행하기 위한 제어 정보"
      ],
      answer: 3,
      explanation: "VLA는 시각과 언어 정보를 이해하는 데 그치지 않고 이를 로봇의 실제 행동 및 제어와 연결하는 모델 범주입니다.",
      hint: "Vision과 Language 뒤에 추가된 Action이 무엇을 의미하는지 생각해 보세요."
    },
    {
      id: "ifm-c4-mc-med-009",
      conceptId: "qwen-vl-three-stage-pipeline",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "multiple-choice",
      prompt: "Qwen-VL 계열의 3단계 학습 파이프라인(Stage 1 → Stage 2 → Stage 3)의 구성 흐름으로 올바른 것은?",
      options: [
        "Stage 1: 대규모 웹 쌍 사전학습 → Stage 2: 다중 태스크 사전학습 → Stage 3: 지도 지시 파인튜닝",
        "Stage 1: 지시 파인튜닝 → Stage 2: 전체 모델 동결 → Stage 3: 데이터 수집",
        "Stage 1: 로봇 액션 학습 → Stage 2: 3D 포인트 클라우드 학습 → Stage 3: 흑백 변환",
        "Stage 1: 언어 모델 초기화 → Stage 2: 비전 인코더 삭제 → Stage 3: 배포"
      ],
      answer: 0,
      explanation: "기초 정렬 사전학습(Stage 1) → 고해상도 다중태스크 사전학습(Stage 2) → 대화형 지시 튜닝(Stage 3) 순으로 고도화됩니다.",
      hint: "대규모 웹 쌍 학습에서 출발하여 다중 작업 학습을 거쳐 지시 튜닝으로 완성됩니다."
    },
    {
      id: "ifm-c4-mc-med-010",
      conceptId: "qwen25-omni-architecture-factor",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "multiple-choice",
      prompt: "Qwen2.5-Omni 모델이 비디오를 보면서 동시에 사용자와 실시간 음성 대화(Voice Chat)를 나눌 수 있는 구조적 요인은?",
      options: [
        "모든 시각 처리를 텍스트 번역기로 대체했기 때문에",
        "비전·오디오 인코더의 입력을 Thinker가 통합 처리하고, Talker와 Streaming Codec Decoder가 실시간 음성 출력을 생성하도록 구성되어 있기 때문에",
        "컴퓨터 그래픽 카드를 1000개 병렬 연결했기 때문에",
        "입력 비디오의 프레임을 1프레임으로 제한하기 때문에"
      ],
      answer: 1,
      explanation: "시각 및 음성 인코더 입력을 Thinker가 통합 처리하고, Talker와 스트리밍 오디오 코덱 디코더가 실시간 음성을 생성하여 지연 없는 대화를 지원합니다.",
      hint: "Thinker 모듈과 Talker 및 스트리밍 디코더로 연결되는 통합 옴니모달 구조를 떠올려 보세요."
    },
    {
      id: "ifm-c4-mc-med-011",
      conceptId: "som-gui-agent-workflow",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "multiple-choice",
      prompt: "컴퓨터 화면 조작 에이전트에 SoM(Set-of-Mark)을 적용했을 때의 구체적 작업 흐름은?",
      options: [
        "화면의 해상도를 32x32로 줄인 후 텍스트만 추출함",
        "모든 아이콘을 화면에서 삭제한 후 빈 화면을 전달함",
        "세그멘테이션 도구가 클릭 가능한 버튼마다 번호 마크를 부착 → VLM이 지시를 읽고 해당 번호 클릭 명령 출력",
        "마우스 포인터의 속도를 2배로 가속함"
      ],
      answer: 2,
      explanation: "화면 내 UI 요소에 번호 라벨을 시각적으로 씌운 후, VLM이 '3번 버튼 클릭' 형태로 명확한 기호 결정을 내립니다.",
      hint: "UI 요소에 번호 마크를 붙여주고 VLM이 원하는 번호를 선택하여 조작합니다."
    },
    {
      id: "ifm-c4-mc-med-012",
      conceptId: "medical-vlm-instruction-tuning-value",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "multiple-choice",
      prompt: "범용 VLM 대비 의료 특화 VLM(LLaVA-Med 등)이 흉부 X-ray 질의응답에서 훨씬 정확한 진단 보조를 수행할 수 있는 이유는?",
      options: [
        "의료 특화 VLM은 이미지 패딩을 전혀 사용하지 않기 때문에",
        "범용 VLM보다 파라미터 수가 100배 더 많기 때문에",
        "X-ray 사진의 명암비를 무조건 흑백 1비트로 변환하기 때문에",
        "의료 이미지-텍스트 데이터와 의학 분야의 시각 지시 데이터를 활용해 특화 학습되었기 때문에"
      ],
      answer: 3,
      explanation: "의료 이미지-텍스트 데이터와 의학 분야의 시각 지시 데이터를 활용해 특화 학습되었기 때문에 범용 VLM보다 의료 영상의 전문적인 문맥을 더 잘 처리할 수 있습니다.",
      hint: "전문 의학 도메인 데이터와 시각 지시 데이터셋으로 특화 파인튜닝된 효과를 생각해 보세요."
    },
    {
      id: "ifm-c4-sa-med-013",
      conceptId: "mrope-axes-and-model-sa",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "short-answer",
      prompt: "Qwen2-VL에서 멀티모달 위치 정보를 통합 인코딩하는 기법의 영문 약자와, 해당 기법이 위치 ID를 정의하기 위해 사용하는 3가지 성분 축을 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["M-ROPE, 시간, 높이, 너비", "M-RoPE, Time, Height, Width", "M-ROPE, 시간/높이/너비", "m-rope, 시간, 높이, 너비"],
      explanation: "Multimodal Rotary Position Embedding(M-ROPE)이며, 시간(Time), 높이(Height), 너비(Width) 3개 축을 사용합니다.",
      hint: "M-ROPE 약자와 동영상 시간 축, 이미지 세로/가로 공간 축 명칭을 쓰세요."
    },
    {
      id: "ifm-c4-sa-med-014",
      conceptId: "vla-and-internvl-sa",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "short-answer",
      prompt: "시각과 언어를 해석해 로봇의 물리적 제어 행동을 출력하는 모델 아키텍처 범주 약자와, 비전 인코더를 6B 규모로 대형화한 중국 연구진의 VLM 명칭을 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["VLA, InternVL", "vla, internvl", "VLA, InternViT/InternVL"],
      explanation: "Vision-Language-Action(VLA) 아키텍처와 InternVL 모델입니다.",
      hint: "로봇 액션 VLA 약자와 6B 비전 인코더를 탑재한 InternVL 모델명입니다."
    },
    {
      id: "ifm-c4-es-med-015",
      conceptId: "som-prompting-and-agent-essay",
      difficulty: "medium",
      category: "최신 VLM 계열 및 비주얼 프롬프팅/특화 모델",
      questionType: "essay",
      prompt: "Set-of-Mark (SoM) 프롬프팅이 객체 분할/탐지 도구를 활용하여 원본 이미지에 시각적 표식을 생성하는 방식과, 이것이 VLM 에이전트의 UI 조작 및 미세 물체 위치 식별 성능을 획기적으로 개선하는 이유를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["SoM", "마크", "번호", "위치", "에이전트", "좌표"],
      modelAnswer: "1) SoM 프롬프팅은 세그멘테이션(SAM 등)이나 객체 탐지 모델을 전처리로 사용하여 원본 이미지 내 각 물체나 UI 버튼에 번호 마크와 테두리를 시각적으로 덧씌운다. 2) VLM은 오차가 발생하기 쉬운 연속적인 픽셀 좌표 [x, y]를 직접 계산하는 대신, 이미지 상에 표시된 이산적인 번호 기호를 언어적으로 참조하여 대화한다. 3) 이로써 VLM의 고유한 시각적 위치 파악(Grounding) 한계가 보완되어 컴퓨터 화면 조작 및 미세 물체 위치 대화의 정확도가 비약적으로 향상된다.",
      rubricKeywords: [
        "객체/버튼에 시각적 번호 마크 부여",
        "연속 좌표 회귀 대신 명확한 번호 기호 참조",
        "VLM의 위치 파악(Grounding) 한계 극복 및 UI 조작 정확도 향상"
      ],
      minLength: 20,
      explanation: "시각적 번호 표식 생성 방식과 좌표 회귀 오차 회피 및 이산 기호 참조를 통한 그라운딩 성능 개선 원리를 서술합니다.",
      hint: "번호 마크 합성 방식과 숫자 좌표 대신 번호를 지정함으로써 얻는 정확도 향상 이점을 쓰세요."
    },

    // ==========================================
    // 카테고리 5: 비전 파운데이션 모델 및 응용 (15문항)
    // ==========================================
    {
      id: "ifm-c5-mc-med-001",
      conceptId: "sam-sa1b-dataset-scale",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt: "메타의 SAM(Segment Anything Model)이 강력한 제로샷 일반화 세그멘테이션 성능을 달성하기 위해 구축한 SA-1B 데이터셋의 규모는?",
      options: [
        "약 1,100만 장의 이미지와 10억 개 이상의 마스크 데이터",
        "약 10만 장의 이미지와 50만 개의 바운딩 박스",
        "약 100장의 스케치 이미지와 1000개의 텍스트 캡션",
        "약 5000만 개의 오디오 주파수 스펙트로그램"
      ],
      answer: 0,
      explanation: "SA-1B는 1,100만 장의 고해상도 이미지와 10억 개 이상의 고품질 세그멘테이션 마스크로 구성된 데이터셋입니다.",
      hint: "천만 단위의 이미지 수와 십억 단위의 마스크 수 규모를 갖춘 데이터셋입니다."
    },
    {
      id: "ifm-c5-mc-med-002",
      conceptId: "grounded-sam-pipeline-flow",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt: "Grounding DINO와 SAM을 결합한 Grounded-SAM 파이프라인의 작업 실행 순서로 올바른 것은?",
      options: [
        "SAM이 마스크 생성 → 마스크를 텍스트로 변환 → Grounding DINO가 삭제",
        "사용자가 텍스트 프롬프트 입력 → Grounding DINO가 바운딩 박스 탐지 → SAM이 해당 박스를 프롬프트로 받아 정밀 마스크 생성",
        "이미지 픽셀 흑백화 → 플랫튼 연산 → 소프트맥스 분류",
        "음성 신호 입력 → 오디오 인코딩 → 3D 메쉬 생성"
      ],
      answer: 1,
      explanation: "텍스트를 받아 Grounding DINO가 박스를 찾고, 이 박스를 SAM의 프롬프트로 넘겨 정밀 분할 마스크를 자동 추출합니다.",
      hint: "텍스트 기반 박스 탐지기(DINO)와 프롬프트 기반 정밀 분할기(SAM)의 순차적 연결입니다."
    },
    {
      id: "ifm-c5-mc-med-003",
      conceptId: "depth-anything-monocular-depth",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt: "Depth Anything 모델이 스테레오 카메라나 고가의 라이다(LiDAR) 센서 없이도 정밀한 깊이 맵(Depth)을 추출할 수 있는 기술적 배경은?",
      options: [
        "컴퓨터 화면의 밝기를 측정하는 하드웨어 센서를 내장했기 때문에",
        "모든 2D 사진의 색상을 무조건 흑백 1채널로 변환하기 때문에",
        "대규모 이미지 데이터를 활용하여 단안 2D 이미지의 원근, 크기, 질감 등 시각적 단서로부터 깊이를 추정하도록 학습되었기 때문에",
        "사용자가 직접 모든 픽셀의 깊이 숫자를 수작업 입력하기 때문에"
      ],
      answer: 2,
      explanation: "대규모 이미지 데이터를 활용하여 단안 2D 이미지의 원근, 크기, 질감 등 시각적 단서로부터 깊이를 추정하도록 학습되었기 때문입니다.",
      hint: "단일 2D 이미지 안의 원근감, 크기, 음영과 같은 시각적 단서를 대규모 데이터로 학습한 원리를 생각해 보세요."
    },
    {
      id: "ifm-c5-mc-med-004",
      conceptId: "sapiens-four-vision-tasks",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt: "메타의 Sapiens 모델이 사람(Human) 이미지에 대해 수행하는 4대 비전 태스크의 조합으로 올바른 것은?",
      options: [
        "음성 변환, 악보 생성, 텍스트 요약, 번역",
        "자율주행 경로 계획, 라이다 포인트 필터링, 장애물 회피, 제동",
        "차트 분석, 영수증 OCR, 웹페이지 코딩, 스팸 필터링",
        "2D 포즈 추정, 신체 부위 세그멘테이션, 깊이 추정, 표면 법선(Surface Normal) 추정"
      ],
      answer: 3,
      explanation: "Sapiens는 3000만 장의 인체 이미지로 학습되어 포즈 추정, 신체 부위 분할, 깊이 추정, 표면 법선 추정 4대 태스크를 지원합니다.",
      hint: "사람의 관절 포즈, 신체 파츠 분할, 3D 깊이 및 표면 기울기 추정 태스크입니다."
    },
    {
      id: "ifm-c5-mc-med-005",
      conceptId: "small-vlm-on-device-rationale",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt: "SmolVLM, Moondream 등 소형 VLM(Small VLM)이 거대 VLM 대비 갖는 실무적 가치와 배포 이점은?",
      options: [
        "수십억 파라미터 이하의 경량 크기로 고가 클라우드 서버 없이 스마트폰/PC 온디바이스에서 로컬 구동 가능함",
        "거대 VLM보다 파라미터 수가 10배 더 많아 성능이 항상 뛰어남",
        "사전학습 시 시각 데이터가 전혀 필요 없음",
        "모든 동영상을 0.001초 만에 렌더링함"
      ],
      answer: 0,
      explanation: "파라미터와 메모리를 압축하여 개인용 기기(엣지/모바일) 내부에서 독립적으로 가볍게 실행할 수 있습니다.",
      hint: "적은 메모리와 연산량으로 모바일/로컬 환경에서 직접 실행 가능한 경량성입니다."
    },
    {
      id: "ifm-c5-mc-med-006",
      conceptId: "korean-vlm-specialization-rationale",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt: "글로벌 VLM 모델이 존재함에도 불구하고 한국어 특화 VLM을 별도로 개발/구축해야 하는 기술적/문화적 사유는?",
      options: [
        "글로벌 VLM은 한국 이미지를 인식하지 못하도록 법적으로 금지되어 있어서",
        "한국어 고유의 토큰화 효율과 국내 문서·간판·OCR·문화적 시각 맥락에 대한 이해도를 극대화하기 위해",
        "한국어 VLM을 만들면 GPU 연산 장비가 필요 없어지기 때문에",
        "외국어 모델을 사용하면 컴퓨터 운영체제가 고장 나기 때문에"
      ],
      answer: 1,
      explanation: "한국어는 언어별 토큰화 효율과 표현 특성이 다르고, 국내 문서·간판·OCR·문화적 시각 맥락도 존재하므로 한국어 및 국내 데이터에 특화된 VLM을 개발하면 해당 영역의 이해 성능을 높일 수 있습니다.",
      hint: "한국어 토큰화 효율 개선과 국내 특화 문서 서식 및 시각 문화 맥락 반영 필요성입니다."
    },
    {
      id: "ifm-c5-mc-med-007",
      conceptId: "sam-promptable-segmentation-task-types",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt: "메타의 SAM이 수행하는 프롬프트 기반 세그멘테이션(Promptable Segmentation Task)에서 주어질 수 있는 프롬프트 형태의 조합은?",
      options: [
        "오직 3D 라이다 포인트 클라우드만 지원",
        "오직 1차원 음성 주파수 신호만 지원",
        "점(Point) 클릭, 바운딩 박스(Bounding Box), 대략적인 마스크, 자연어 텍스트",
        "C++ 소스 코드 텍스트만 지원"
      ],
      answer: 2,
      explanation: "SAM은 점, 사각 박스, 대략적 마스크 영역, 자연어 텍스트 등 다양한 형태의 프롬프트 입력을 받아 대상을 분할합니다.",
      hint: "마우스 점 클릭, 드래그 박스, 러프한 마스크, 텍스트 지시문 등 다양한 상호작용 형태입니다."
    },
    {
      id: "ifm-c5-mc-med-008",
      conceptId: "sapiens-dataset-scale",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt: "메타의 Sapiens 모델이 사람의 세부 구조를 정밀하게 분석하기 위해 학습한 인체 중심 이미지 데이터셋 규모는?",
      options: [
        "100장의 스케치 이미지",
        "10만 장의 자동차 주행 영상과 도로 표지판 라벨로 구성된 데이터셋",
        "100만 장의 풍경 사진",
        "약 3000만 장(30M)의 인체 중심 이미지 데이터셋"
      ],
      answer: 3,
      explanation: "Sapiens는 인간 형태 인식을 위해 약 3000만 장의 이미지로 학습된 사람 중심 파운데이션 모델입니다.",
      hint: "천만 단위(30M) 규모의 사람 중심 특화 고해상도 데이터셋입니다."
    },
    {
      id: "ifm-c5-mc-med-009",
      conceptId: "depth-anything-applications",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt: "Depth Anything으로 추출한 2D 이미지의 정밀 깊이 맵(Depth Map)을 활용하여 수행할 수 있는 대표적인 3D 비전 응용 작업은?",
      options: [
        "단일 사진으로부터 3D 장면 포인트 클라우드 복원, 가상 아웃포커싱, 3D 입체 변환",
        "텍스트 파일의 철자 검사 및 문법 교정만 수행하고 이미지 깊이 정보는 사용하지 않음",
        "오디오 음악의 악기 구성을 텍스트 악보로 변환",
        "컴퓨터 그래픽 카드의 쿨링팬 속도 조절"
      ],
      answer: 0,
      explanation: "깊이 정보를 이용하면 평면 사진을 3D 포인트 클라우드로 띄우거나 배경 흐림(아웃포커싱) 효과를 정밀하게 적용할 수 있습니다.",
      hint: "거리(깊이) 정보를 바탕으로 2D 사진에 입체감을 부여하거나 3D 공간을 재구성합니다."
    },
    {
      id: "ifm-c5-mc-med-010",
      conceptId: "grounding-dino-open-vocabulary-concept",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt: "Grounding DINO가 기존 객체 탐지기(YOLO 등)와 구별되는 '오픈 보캡(Open-Vocabulary)' 탐지 역량의 정의는?",
      options: [
        "오직 영어로 된 80개 고정 클래스만 탐지함",
        "사전에 정해진 클래스 목록에 얽매이지 않고, 사용자가 입력한 임의의 자유로운 자연어 구문 물체를 검출함",
        "이미지 내부의 모든 객체를 자동으로 삭제함",
        "탐지된 객체의 색상을 흑백으로 변경함"
      ],
      answer: 1,
      explanation: "고정된 레이블 목록 없이 자연어 텍스트 문장을 입력받아 어떤 객체든 바운딩 박스로 찾아내는 기술입니다.",
      hint: "미리 정해둔 클래스에 제한되지 않고 자유로운 텍스트로 물체를 찾습니다."
    },
    {
      id: "ifm-c5-mc-med-011",
      conceptId: "sam-zero-shot-generalization-concept",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt: "SAM이 사전학습 때 보지 못한 새로운 도메인(현미경 세포 이미지, 수중 사진 등)에서도 정밀하게 객체를 분할해내는 제로샷 일반화의 원리는?",
      options: [
        "새로운 도메인을 만날 때마다 모델 파라미터를 처음부터 다시 훈련하기 때문에",
        "모든 객체를 무조건 사각형 박스로 단순화하기 때문에",
        "SA-1B의 방대한 마스크 데이터를 통해 객체의 경계선과 시각적 분할 개념 자체를 범용적으로 학습했기 때문에",
        "현미경 카메라 하드웨어를 직접 제어하기 때문에"
      ],
      answer: 2,
      explanation: "10억 개 이상의 방대한 마스크 데이터로부터 객체의 일반적 경계 분할 원리를 배웠기 때문에 생소한 물체도 제로샷으로 분할합니다.",
      hint: "방대한 데이터셋을 통해 특정 클래스명이 아닌 객체의 경계선 자체를 분할하는 일반 원리를 배웠습니다."
    },
    {
      id: "ifm-c5-mc-med-012",
      conceptId: "small-vlm-privacy-advantage",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "multiple-choice",
      prompt: "온디바이스 소형 VLM(SmolVLM 등)이 보안 및 프라이버시(Privacy) 측면에서 클라우드 거대 VLM보다 뛰어난 구조적 이유는?",
      options: [
        "네트워크 통신 속도가 10배 느리기 때문에",
        "비전 인코더의 파라미터를 암호화하지 않기 때문에",
        "모든 데이터를 외부 클라우드에 영구 백업하기 때문에",
        "민감한 개인 사진이나 문서를 외부 서버로 전송하지 않고 사용자 기기 내부에서 로컬로 전 과정 처리하므로"
      ],
      answer: 3,
      explanation: "개인 기기 로컬에서 데이터가 처리되므로 민감한 개인정보나 기밀 문서가 외부 서버로 유출되지 않습니다.",
      hint: "사용자의 사진과 데이터가 외부 서버로 나가지 않고 기기 안에서만 처리됩니다."
    },
    {
      id: "ifm-c5-sa-med-013",
      conceptId: "sam-dataset-and-prompts-sa",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "short-answer",
      prompt: "메타의 SAM 모델을 학습시키기 위해 구축된 11M 이미지와 1B 마스크 규모의 데이터셋 명칭과, SAM이 입력을 지시받는 대표적인 프롬프트 형태 2가지(점, 박스 등)를 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["SA-1B, 점, 박스", "SA-1B, Point, Box", "SA-1B, 점/박스", "sa-1b, 점, 박스"],
      explanation: "데이터셋 명칭은 SA-1B이며, 대표 프롬프트 형태는 점(Point)과 바운딩 박스(Bounding Box)입니다.",
      hint: "SA-1B 데이터셋 명칭과 대표 상호작용 프롬프트 형태 2가지를 적으세요."
    },
    {
      id: "ifm-c5-sa-med-014",
      conceptId: "grounding-dino-and-sapiens-sa",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "short-answer",
      prompt: "자연어 텍스트 입력으로 임의 객체를 탐지하는 모델과, 3000만 장의 사람 이미지로 4대 인체 태스크를 수행하는 메타의 파운데이션 모델 명칭을 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Grounding DINO, Sapiens", "Grounding DINO, 사피엔스", "grounding dino, sapiens", "GroundingDINO, Sapiens"],
      explanation: "Grounding DINO 탐지기와 Sapiens 모델입니다.",
      hint: "오픈 보캡 탐지기 Grounding DINO와 3000만 장 인체 특화 Sapiens 모델명을 쓰세요."
    },
    {
      id: "ifm-c5-es-med-015",
      conceptId: "sam-interactive-and-grounded-sam-essay",
      difficulty: "medium",
      category: "비전 파운데이션 모델 및 응용",
      questionType: "essay",
      prompt: "SAM(Segment Anything Model)이 지원하는 프롬프트 기반 세그멘테이션(Promptable Segmentation)의 개념과, Grounding DINO와 SAM을 결합한 Grounded-SAM 파이프라인에서 텍스트 입력이 최종 정밀 마스크로 변환되는 자동 분할 과정을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["프롬프트", "점", "박스", "Grounding DINO", "SAM", "마스크"],
      modelAnswer: "1) SAM의 프롬프트 기반 세그멘테이션은 점(Point), 바운딩 박스(Box), 텍스트 등 사용자의 다양한 프롬프트 지시를 입력받아 해당하는 객체의 마스크를 제로샷으로 분할하는 태스크이다. 2) Grounded-SAM 파이프라인에서는 사용자가 '강아지' 같은 자연어 텍스트를 입력하면, Grounding DINO가 이미지 내 해당 객체의 위치를 오픈 보캡으로 탐지하여 바운딩 박스를 생성한다. 3) 이 탐지된 박스 좌표를 SAM의 프롬프트로 전달하여 SAM이 해당 영역의 정밀 세그멘테이션 마스크를 완전 자동으로 생성한다.",
      rubricKeywords: [
        "점/박스/텍스트 프롬프트 기반 마스크 분할",
        "Grounding DINO의 텍스트 기반 바운딩 박스 탐지",
        "탐지 박스를 SAM 프롬프트로 전달하여 정밀 마스크 자동 생성"
      ],
      minLength: 20,
      explanation: "SAM의 프롬프트 기반 세그멘테이션 정의와 Grounding DINO(텍스트->박스) 및 SAM(박스->정밀 마스크) 연계 자동화 과정을 서술합니다.",
      hint: "SAM이 다양한 프롬프트를 받아 분할하는 개념과 DINO의 텍스트 탐지 박스가 SAM의 마스크로 이어지는 과정을 기술하세요."
    }
  ]
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
