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
    // 카테고리 1: CNN 연산 및 출력 구조 (15문항)
    // ==========================================
    {
      id: "vis-c1-mc-001",
      conceptId: "conv-output-size-calc-1",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "multiple-choice",
      prompt: "227x227 크기의 입력 이미지에 11x11 필터, 스트라이드 4, 패딩 0을 적용할 때 생성되는 특징 맵의 가로세로 해상도는?",
      options: [
        "55x55",
        "56x56",
        "57x57",
        "58x58"
      ],
      answer: 0,
      explanation: "출력 해상도 공식 (W - K + 2P) / S + 1 에 대입하면 (227 - 11 + 0) / 4 + 1 = 55 가 됩니다[cite: 6].",
      hint: "입력 크기에서 필터 크기를 뺀 후 스트라이드로 나누고 1을 더해 계산해 보세요[cite: 6]."
    },
    {
      id: "vis-c1-mc-002",
      conceptId: "padding-situational-choice",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "multiple-choice",
      prompt: "합성곱 연산 시 가장자리 화소 정보의 손실을 막고 출력 크기를 입력과 동일하게 유지하고자 할 때 적용해야 하는 설정은?",
      options: [
        "스트라이드 확장",
        "패딩 적용",
        "맥스 풀링 적용",
        "채널 수 축소"
      ],
      answer: 1,
      explanation: "입력 외곽에 0 등의 값을 덧대는 패딩을 적용하면 가장자리 정보 손실을 막고 해상도를 유지할 수 있습니다[cite: 6].",
      hint: "외곽 테두리에 값을 채워 넣어 크기 축소를 방지하는 기법입니다[cite: 6]."
    },
    {
      id: "vis-c1-mc-003",
      conceptId: "stride-effect-resolution",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "multiple-choice",
      prompt: "합성곱 연산 시 필터의 이동 간격인 스트라이드(Stride) 값을 1에서 2로 늘렸을 때 특징 맵의 변화는?",
      options: [
        "공간 해상도가 약 2배 확대됨",
        "입력 채널 수가 2배 늘어남",
        "공간 해상도가 약 절반으로 감소함",
        "특징 맵의 전체 크기에 변화가 없음"
      ],
      answer: 2,
      explanation: "필터를 건너뛰는 보폭(스트라이드)이 커지면 출력 특징 맵의 가로세로 해상도는 줄어듭니다[cite: 6].",
      hint: "필터가 이동하는 보폭이 커질 때 출력 지도 크기가 어떻게 될지 생각해 보세요[cite: 6]."
    },
    {
      id: "vis-c1-mc-004",
      conceptId: "fcn-vs-cnn-efficiency",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "multiple-choice",
      prompt: "CNN이 FCN에 비해 이미지 처리 시 메모리와 파라미터를 훨씬 효율적으로 사용하는 구조적 원리는?",
      options: [
        "전결합 구조와 플랫튼 연산의 결합",
        "비선형 활성화 함수의 완전한 생략",
        "입력 이미지 채널의 무조건적 통합",
        "가중치 공유와 지역적 연결성"
      ],
      answer: 3,
      explanation: "CNN은 국소 영역 필터 연산(지역적 연결성)과 동일 필터 재사용(가중치 공유)으로 파라미터 수를 획기적으로 줄입니다[cite: 6].",
      hint: "동일한 필터 커널을 이미지 전체 영역에 재사용하는 특성을 떠올려 보세요[cite: 6]."
    },
    {
      id: "vis-c1-mc-005",
      conceptId: "output-channel-filter-count",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "multiple-choice",
      prompt: "3x32x32 입력 데이터에 5x5 커널 크기의 필터를 16개 적용하여 합성곱할 때, 생성되는 출력 특징 맵의 채널 수(깊이)는?",
      options: [
        "16개",
        "3개",
        "5개",
        "32개"
      ],
      answer: 0,
      explanation: "합성곱 레이어의 출력 채널 수는 적용한 필터(커널)의 개수와 정확히 일치합니다[cite: 6].",
      hint: "적용하는 필터의 총 개수가 출력 채널 수로 연결됩니다[cite: 6]."
    },
    {
      id: "vis-c1-mc-006",
      conceptId: "max-pooling-operation",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "multiple-choice",
      prompt: "2x2 영역에서 맥스 풀링(Max Pooling) 연산을 수행하는 구체적인 동작 방식은?",
      options: [
        "지정된 2x2 영역 내부 수치의 평균값 계산",
        "지정된 2x2 영역 내부 수치 중 최댓값 추출",
        "지정된 2x2 영역 내부 수치 중 최솟값 추출",
        "지정된 2x2 영역 내부 수치 중 중앙값 추출"
      ],
      answer: 1,
      explanation: "맥스 풀링은 지정된 커널 영역 내부의 수치 중 가장 큰 최댓값을 대표값으로 추출합니다[cite: 6].",
      hint: "영단어 Max의 의미를 생각해 보세요[cite: 6]."
    },
    {
      id: "vis-c1-mc-007",
      conceptId: "params-vs-flops-concentration",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "multiple-choice",
      prompt: "전통적 CNN 구조에서 가중치 파라미터 수가 가장 집중되는 구간과 연산량(FLOPs)이 가장 집중되는 구간을 바르게 짝지은 것은?",
      options: [
        "파라미터: 초반 Conv층 / 연산량: 후반 FC층",
        "파라미터: 풀링 레이어 / 연산량: 드롭아웃 레이어",
        "파라미터: 후반 FC층 / 연산량: 초반 Conv층",
        "파라미터: 입력 레이어 / 연산량: 소프트맥스층"
      ],
      answer: 2,
      explanation: "파라미터는 전결합을 수행하는 후반 FC층에 몰려있고, 연산량(FLOPs)은 해상도가 큰 초반 Conv층에 몰려있습니다[cite: 6].",
      hint: "가중치는 1차원 펼침 후 전결합하는 곳에, 연산량은 해상도가 큰 앞쪽에 몰립니다[cite: 6]."
    },
    {
      id: "vis-c1-mc-008",
      conceptId: "receptive-field-change",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "multiple-choice",
      prompt: "CNN 모델에서 레이어를 깊게 쌓아 올릴수록 출력 노드가 참조하는 원본 입력의 범위인 수용 영역(Receptive Field)은 어떻게 변화하는가?",
      options: [
        "수용 영역이 점차 축소됨",
        "수용 영역의 크기가 고정됨",
        "수용 영역이 0으로 수렴함",
        "수용 영역이 점차 넓어짐"
      ],
      answer: 3,
      explanation: "레이어가 깊어지고 다운샘플링이 누적될수록 후반부 특징 맵 노드가 바라보는 입력 이미지 상의 수용 영역은 넓어집니다[cite: 6].",
      hint: "층을 많이 거칠수록 시야 범위가 넓어지는 특성을 떠올려 보세요[cite: 6]."
    },
    {
      id: "vis-c1-mc-009",
      conceptId: "one-by-one-conv-purpose",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "multiple-choice",
      prompt: "합성곱 연산 시 커널 크기가 1x1인 필터를 활용하는 가장 주요한 목적은?",
      options: [
        "공간 해상도를 연산 없이 2배 축소하기 위함",
        "가장자리 패딩 영역을 자동으로 채우기 위함",
        "맥스 풀링 레이어를 완전히 대체하기 위함",
        "공간 크기 보존 및 채널 수 수치 조절"
      ],
      answer: 3,
      explanation: "1x1 합성곱은 가로세로 해상도를 유지하면서 채널 차원 수를 자유롭게 줄이거나 늘려 연산량을 조절합니다[cite: 6]."
    },
    {
      id: "vis-c1-mc-010",
      conceptId: "conv-output-size-formula",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "multiple-choice",
      prompt: "입력 크기 W, 커널 크기 K, 패딩 P, 스트라이드 S가 주어질 때 출력 해상도 W'를 구하는 올바른 공식은?",
      options: [
        "W' = (W - K + 2P) / S + 1",
        "W' = (W + K - P) / S - 1",
        "W' = (W - K + P) / (2S)",
        "W' = (W + 2P) / (K * S)"
      ],
      answer: 0,
      explanation: "합성곱 출력 해상도 산출 기본 수식은 (W - K + 2P) / S + 1 입니다[cite: 6].",
      hint: "패딩 2P를 더하고 커널 K를 뺀 후 스트라이드로 나누고 1을 더합니다[cite: 6]."
    },
    {
      id: "vis-c1-mc-011",
      conceptId: "pooling-robustness",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "multiple-choice",
      prompt: "입력 이미지 내 객체의 위치가 미세하게 이동하더라도 출력 특징 변화를 줄여 위치 강건성을 제공하는 레이어는?",
      options: [
        "합성곱 레이어",
        "풀링 레이어",
        "완전 연결 레이어",
        "소프트맥스 레이어"
      ],
      answer: 1,
      explanation: "풀링 연산은 국소 영역 내 대표값을 추출하므로 객체의 미세한 위치 이동에 영향을 적게 받는 강건성을 제공합니다[cite: 6].",
      hint: "특징 맵을 다운샘플링하여 위치 변화 저항성을 높여주는 레이어입니다[cite: 6]."
    },
    {
      id: "vis-c1-mc-012",
      conceptId: "pooling-dimension-change",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "multiple-choice",
      prompt: "224x224x64 특징 맵에 2x2 맥스 풀링(스트라이드 2)을 적용했을 때 출력 특징 맵의 차원은?",
      options: [
        "224x224x32",
        "112x112x32",
        "112x112x64",
        "448x448x64"
      ],
      answer: 2,
      explanation: "풀링은 채널 수(64)를 유지하면서 가로세로 해상도만 각각 절반(112x112)으로 축소시킵니다[cite: 6].",
      hint: "채널 깊이는 유지되고 가로세로 해상도만 절반으로 줄어듭니다[cite: 6]."
    },
    {
      id: "vis-c1-sa-013",
      conceptId: "stride-sa",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "short-answer",
      prompt: "합성곱 연산 시 필터 커널이 이미지 위를 이동할 때의 보폭(간격)을 의미하는 파라미터 용어는?",
      options: [],
      answer: null,
      acceptedAnswers: ["스트라이드", "Stride", "stride"],
      explanation: "필터의 이동 보폭을 나타내는 스트라이드입니다[cite: 6].",
      hint: "보폭을 의미하는 영문 단어 표현입니다[cite: 6]."
    },
    {
      id: "vis-c1-sa-014",
      conceptId: "output-size-calc-sa",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "short-answer",
      prompt: "입력 크기가 32x32이고 커널 크기 5x5, 패딩 2, 스트라이드 1일 때 계산되는 출력 해상도는 얼마인가?",
      options: [],
      answer: null,
      acceptedAnswers: ["32", "32x32", "32X32"],
      explanation: "(32 - 5 + 2*2)/1 + 1 = 32 이므로 출력 크기는 32x32 로 유지됩니다[cite: 6].",
      hint: "공식 (W - K + 2P)/S + 1 에 숫자를 대입해 보세요[cite: 6]."
    },
    {
      id: "vis-c1-es-015",
      conceptId: "padding-and-stride-essay",
      difficulty: "easy",
      category: "CNN 연산 및 출력 구조",
      questionType: "essay",
      prompt: "합성곱 연산 시 패딩(Padding)과 스트라이드(Stride)가 출력 특징 맵의 해상도 크기에 미치는 영향과 각각의 사용 목적을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["패딩", "스트라이드", "해상도", "가장자리"],
      modelAnswer: "패딩은 이미지 외곽에 0 등의 값을 채워 출력 해상도 축소를 막고 가장자리 정보를 보존한다. 스트라이드는 필터의 이동 보폭을 조절하여 출력 해상도를 축소시키고 연산량을 줄이는 목적으로 사용된다[cite: 6].",
      rubricKeywords: ["패딩 해상도 유지/가장자리 보존", "스트라이드 보폭 조절/해상도 축소"],
      minLength: 20,
      explanation: "패딩의 크기 보존/가장자리 보호 역할과 스트라이드의 보폭 조절/다운샘플링 역할을 작성합니다[cite: 6].",
      hint: "패딩의 가장자리 보존 및 크기 유지 목적과 스트라이드의 보폭 조절에 따른 크기 축소 목적을 쓰세요[cite: 6]."
    },

    // ==========================================
    // 카테고리 2: CNN 대표 모델과 경량화 (15문항)
    // ==========================================
    {
      id: "vis-c2-mc-001",
      conceptId: "resnet-skip-connection",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "multiple-choice",
      prompt: "신경망 레이어가 깊어질수록 발생하던 성능 저하 문제를 극복하기 위해 ResNet이 도입한 구조는?",
      options: [
        "잔차 학습과 지름길 연결",
        "1x1 합성곱과 맥스 풀링",
        "그룹 합성곱과 병렬 연산",
        "중첩 맥스 풀링과 드롭아웃"
      ],
      answer: 0,
      explanation: "ResNet은 입력 $x$를 레이어 출력에 그대로 더해주는 지름길 연결(Skip Connection)로 잔차 학습을 구현했습니다[cite: 6].",
      hint: "입력을 레이어 출력으로 직접 전달하여 더해주는 지름길 통로입니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-002",
      conceptId: "resnet-block-formula",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "multiple-choice",
      prompt: "ResNet의 잔차 블록에서 입력 $x$와 서브레이어 연산 $F(x)$를 조합하여 최종 출력 $H(x)$를 만드는 수식은?",
      options: [
        "H(x) = F(x) * x",
        "H(x) = F(x) + x",
        "H(x) = F(x) - x",
        "H(x) = F(x) / x"
      ],
      answer: 1,
      explanation: "잔차 블록의 기본 수식은 출력에 입력 $x$를 그대로 더해주는 $H(x) = F(x) + x$ 입니다[cite: 6].",
      hint: "서브레이어 출력 $F(x)$에 입력 $x$를 '더해' 줍니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-003",
      conceptId: "mobilenet-embedded-choice",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "multiple-choice",
      prompt: "스마트폰이나 모바일 기기처럼 연산 자원이 제한된 환경에 탑재하기 위해 설계된 경량화 아키텍처는?",
      options: [
        "AlexNet",
        "VGGNet",
        "MobileNet",
        "ResNet152"
      ],
      answer: 2,
      explanation: "MobileNet은 모바일 및 임베디드 기기 환경 구동을 위해 설계된 대표적인 경량화 모델입니다[cite: 6].",
      hint: "이름에 '모바일' 단어가 포함되어 있습니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-004",
      conceptId: "mobilenet-depthwise-separable",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "multiple-choice",
      prompt: "MobileNet에서 파라미터와 연산량을 대폭 줄이기 위해 채택한 핵심 합성곱 연산은?",
      options: [
        "Overlapping Max Pooling",
        "Dilated Convolution",
        "Transposed Convolution",
        "Depthwise Separable Convolution"
      ],
      answer: 3,
      explanation: "MobileNet은 공간 연산과 채널 연산을 분리하는 Depthwise Separable Convolution을 활용합니다[cite: 6].",
      hint: "공간별 연산과 채널별 연산을 '분리(Separable)'하여 계산합니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-005",
      conceptId: "depthwise-separable-components",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "multiple-choice",
      prompt: "Depthwise Separable Convolution을 구성하는 두 가지 연산의 순서쌍으로 바른 것은?",
      options: [
        "Depthwise Convolution 후 Pointwise Convolution",
        "Max Pooling 후 Average Pooling",
        "1x1 Convolution 후 7x7 Convolution",
        "Group Convolution 후 Full Convolution"
      ],
      answer: 0,
      explanation: "채널별 공간 연산인 Depthwise Conv를 수행한 후, 1x1 커널인 Pointwise Conv를 연속 적용합니다[cite: 6].",
      hint: "채널 독립적 공간 연산 후 1x1 채널 결합 연산이 이어집니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-006",
      conceptId: "pointwise-conv-role",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "multiple-choice",
      prompt: "Depthwise Separable Convolution에서 Pointwise Convolution의 주요 역할 및 커널 크기는?",
      options: [
        "1x1 커널을 사용하여 채널 간 정보를 결합함",
        "3x3 커널을 사용하여 공간적 특징을 추출함",
        "5x5 커널을 사용하여 해상도를 축소함",
        "7x7 커널을 사용하여 패딩을 채움"
      ],
      answer: 0,
      explanation: "Pointwise Conv는 1x1 커널 필터를 사용하여 채널 축 방향의 정보들을 조합합니다[cite: 6].",
      hint: "가로세로 1x1 커널을 사용하여 채널 방향 정보를 결합합니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-007",
      conceptId: "vggnet-vs-alexnet-filter",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "multiple-choice",
      prompt: "VGGNet이 AlexNet과 비교하여 모델을 한층 더 깊게 쌓으면서 채택한 필터 규격 특징은?",
      options: [
        "3x3 크기의 작은 필터만을 중첩하여 깊게 쌓음",
        "11x11 단일 대형 필터만 사용하여 층을 축소함",
        "완전 연결 레이어의 뉴런 수를 10배로 확장함",
        "맥스 풀링 레이어를 아키텍처에서 모두 제거함"
      ],
      answer: 0,
      explanation: "VGGNet은 큰 커널 대신 3x3 크기의 작은 커널만을 여러 개 중첩 사용하여 신경망을 깊게 만듭니다[cite: 6].",
      hint: "가장 작은 3x3 커널을 여러 개 이어서 배치했습니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-008",
      conceptId: "resnet-backprop-gradient",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "multiple-choice",
      prompt: "ResNet의 지름길 연결(Skip Connection)이 역전파 시 기울기 소실을 막아주는 원리는?",
      options: [
        "가중치 행렬 곱셈 연산의 횟수를 2배 늘림",
        "미분 시 잔차 통로를 통해 기울기가 덧셈으로 직접 전파됨",
        "모든 활성화 함수를 Sigmoid로 고정함",
        "입력 데이터의 차원을 1차원으로 감축함"
      ],
      answer: 1,
      explanation: "역전파 미분 시 덧셈 연결 통로를 타고 기울기 신호가 아무런 감쇄 없이 과거 레이어로 직접 전파됩니다[cite: 6].",
      hint: "덧셈으로 연결된 지름길 통로를 통해 기울기가 직접 흘러갑니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-009",
      conceptId: "alexnet-structure-summary",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "multiple-choice",
      prompt: "AlexNet 아키텍처의 레이어 수 구성으로 올바른 것은?",
      options: [
        "16개의 합성곱 레이어로만 구성됨",
        "잔차 연결 구조만으로 구성됨",
        "5개의 합성곱 레이어와 3개의 완전 연결 레이어로 구성됨",
        "Depthwise 연산으로만 구성됨"
      ],
      answer: 2,
      explanation: "AlexNet은 5개의 Conv 레이어와 3개의 FC 레이어로 총 8개 레이어를 가집니다[cite: 6].",
      hint: "합성곱 5개와 완전 연결 3개의 조합입니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-010",
      conceptId: "vgg16-vs-vgg19-difference",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "multiple-choice",
      prompt: "VGG16 모델과 VGG19 모델 간의 주요 구조적 차이점은 무엇인가?",
      options: [
        "합성곱 레이어의 전체 레이어 개수 차이",
        "사용하는 활성화 함수의 종류 차이",
        "입력 이미지의 채널 수 차이",
        "풀링 레이어의 커널 크기 차이"
      ],
      answer: 0,
      explanation: "VGG16과 VGG19는 전체 가중치 레이어 수(16층 vs 19층)의 깊이 차이가 주요 차이점입니다[cite: 6].",
      hint: "모델 이름 뒤에 붙은 숫자가 나타내는 레이어 수의 차이입니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-011",
      conceptId: "deep-network-choice-resnet",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "multiple-choice",
      prompt: "100층 이상의 매우 깊은 신경망을 기울기 소실 없이 안정적으로 학습시키고자 할 때 가장 적합한 모델은?",
      options: [
        "AlexNet",
        "ResNet",
        "VGG16",
        "LeNet"
      ],
      answer: 1,
      explanation: "100층 이상의 초심층 네트워크 학습 시 지름길 연결을 가진 ResNet 구조가 가장 적합합니다[cite: 6].",
      hint: "잔차 학습 구조를 통해 초심층 망을 학습시킬 수 있습니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-012",
      conceptId: "pointwise-conv-channel-control",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "multiple-choice",
      prompt: "1x1 커널 크기를 사용하는 Pointwise Convolution의 주된 연산 이점은?",
      options: [
        "입력 이미지의 가로세로 크기를 2배로 확장함",
        "공간 해상도를 유지하며 채널 차원을 효율적으로 조절함",
        "필터 가중치 파라미터를 항상 0으로 초기화함",
        "색상 채널을 무조건 1개로 통합함"
      ],
      answer: 1,
      explanation: "1x1 커널은 공간 크기는 건드리지 않고 채널 축 방향의 정보만 효율적으로 축소/확장 연산합니다[cite: 6].",
      hint: "가로세로 크기를 보존한 채 채널 수(깊이)를 조절하는 역할을 합니다[cite: 6]."
    },
    {
      id: "vis-c2-sa-013",
      conceptId: "skip-connection-sa",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "short-answer",
      prompt: "ResNet에서 입력 $x$를 레이어 출력을 거치지 않고 직접 뒤쪽으로 건너뛰어 더해주는 연결 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["지름길 연결", "잔차 연결", "Skip Connection", "Shortcut Connection", "skip connection"],
      explanation: "ResNet의 핵심인 지름길 연결(Skip Connection)입니다[cite: 6].",
      hint: "건너뛰어(Skip) 연결해 주는 통로입니다[cite: 6]."
    },
    {
      id: "vis-c2-sa-014",
      conceptId: "depthwise-separable-sa",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "short-answer",
      prompt: "MobileNet에서 연산량 절감을 위해 채널별 공간 연산과 1x1 채널 연산으로 분리하여 수행하는 합성곱 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["Depthwise Separable Convolution", "depthwise separable convolution", "깊이별 가분 합성곱"],
      explanation: "MobileNet의 핵심인 Depthwise Separable Convolution입니다[cite: 6].",
      hint: "Depthwise로 시작하는 경량화 합성곱 연산입니다[cite: 6]."
    },
    {
      id: "vis-c2-es-015",
      conceptId: "resnet-skip-connection-essay",
      difficulty: "easy",
      category: "CNN 대표 모델과 경량화",
      questionType: "essay",
      prompt: "ResNet의 잔차 학습(Residual Learning) 개념과 지름길 연결(Skip Connection)이 깊은 신경망 학습 시 기울기 소실 문제를 해결하는 원리를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["잔차", "지름길 연결", "기울기", "덧셈"],
      modelAnswer: "ResNet은 목표 함수 $H(x)$를 직접 학습하는 대신 변화량인 잔차 $F(x) = H(x) - x$를 학습한다. 입력 $x$를 직접 더해주는 지름길 연결을 통해 역전파 시 기울기 신호가 가중치 곱셈 없이 덧셈 통로로 전달되므로 깊은 레이어에서도 기울기 소실 없이 안정적으로 학습할 수 있다[cite: 6].",
      rubricKeywords: ["잔차 $F(x) = H(x)-x$ 학습", "지름길 연결 직통 전달", "기울기 소실 예방"],
      minLength: 20,
      explanation: "잔차 학습 모형 $F(x)+x$ 및 지름길 연결을 통한 역전파 기울기 전파 원리를 서술합니다[cite: 6].",
      hint: "H(x) = F(x) + x 수식 의미와 역전파 시 덧셈 통로를 통한 기울기 전파 효과를 기술하세요[cite: 6]."
    },

    // ==========================================
    // 카테고리 3: CNN의 한계와 시퀀스 모델 (15문항)
    // ==========================================
    {
      id: "vis-c3-mc-001",
      conceptId: "cnn-limitation-sequence-data",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "CNN이 이미지 처리에 뛰어남에도 불구하고 텍스트나 음성 데이터 처리 시 나타나는 주요 한계점은?",
      options: [
        "이미지 픽셀 값을 수치화하지 못함",
        "가중치 역전파가 불가능함",
        "순차적 데이터의 시간 흐름 및 순서 반영이 어려움",
        "입력 데이터 채널 수가 항상 고정됨"
      ],
      answer: 2,
      explanation: "CNN은 격자 공간 구조 처리에 특화되어 시간적 순서(order) 흐름을 다루기 어렵습니다[cite: 7].",
      hint: "단어 및 음성 신호의 시간 순서 흐름 반영의 어려움입니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-002",
      conceptId: "cnn-limitation-long-distance",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "CNN이 지역 특징 추출에는 강하지만 멀리 떨어진 요소를 파악할 때 발생하는 한계는?",
      options: [
        "작은 지역 패턴을 포착하지 못함",
        "출력 라벨 종류가 제한됨",
        "멀리 떨어진 요소 간 장기 의존성 관계 파악이 어려움",
        "입력 데이터 크기가 커지면 연산이 멈춤"
      ],
      answer: 2,
      explanation: "지역 필터 연산 위주인 CNN은 이미지나 문장에서 멀리 떨어진 상호 관계를 직접 학습하기 힘듭니다[cite: 7].",
      hint: "멀리 떨어진 요소들 사이의 장거리 상관관계 파악의 어려움입니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-003",
      conceptId: "rnn-sequential-architecture",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "이전 단계의 정보를 내부 은닉 상태로 넘겨주며 순차적(Sequential) 데이터를 처리하는 신경망은?",
      options: [
        "단순 퍼셉트론",
        "합성곱 신경망",
        "순환 신경망",
        "오토인코더"
      ],
      answer: 2,
      explanation: "이전 시점까지의 정보를 은닉 상태로 이어받아 시퀀스를 처리하는 순환 신경망(RNN)입니다[cite: 7].",
      hint: "순환(Recurrent) 동작 구조를 가진 신경망입니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-004",
      conceptId: "rnn-hidden-state-context",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "RNN에서 이전 타임스텝까지의 문맥(Context) 정보를 저장하여 다음 타임스텝으로 전달하는 요소는?",
      options: [
        "입력 필터",
        "은닉 상태",
        "출력 클래스",
        "패딩 영역"
      ],
      answer: 1,
      explanation: "은닉 상태(hidden state)가 과거 타임스텝까지의 기억을 보존하여 전달합니다[cite: 7].",
      hint: "과거까지의 문맥 정보를 담아 다음 시점으로 넘겨주는 내부 상태입니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-005",
      conceptId: "rnn-vanishing-gradient-issue",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "단순 RNN에서 처리할 시퀀스가 길어질 때 역전파 가중치 곱셈으로 인해 과거 정보 신호가 사라지는 현상은?",
      options: [
        "기울기 소실 문제",
        "과적합 문제",
        "차원의 저주 문제",
        "수용 영역 감소 문제"
      ],
      answer: 0,
      explanation: "시퀀스가 길어질수록 역전파 미분값이 0으로 수렴하여 장기 기억이 불가능해지는 기울기 소실 현상입니다[cite: 7].",
      hint: "미분 기울기 값이 점차 0으로 줄어드는 현상입니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-006",
      conceptId: "gradient-clipping-prevention",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "단순 RNN에서 기울기가 지나치게 커져 학습이 발산하는 '기울기 폭발'을 차단하기 위한 해결 기법은?",
      options: [
        "맥스 풀링",
        "라벨 인코딩",
        "소프트맥스",
        "기울기 절삭"
      ],
      answer: 3,
      explanation: "기울기 절삭(Gradient Clipping)은 기울기 크기가 임계값을 넘지 못하도록 자르는 기술입니다[cite: 7].",
      hint: "임계값을 초과하는 기울기를 잘라내는 방식입니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-007",
      conceptId: "lstm-gated-architecture",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "단순 RNN의 기울기 소실 문제를 극복하고자 세포 상태와 게이트 구조를 도입한 순환 모델은?",
      options: [
        "AlexNet",
        "LSTM",
        "VGGNet",
        "FCN"
      ],
      answer: 1,
      explanation: "셀 상태와 게이트 구조로 장기 의존성을 학습할 수 있는 LSTM입니다[cite: 7].",
      hint: "장단기 메모리를 의미하는 순환 아키텍처입니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-008",
      conceptId: "lstm-cell-state-memory",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "LSTM에서 컨베이어 벨트 역할을 하며 중요한 장기 정보를 유지하는 모듈은?",
      options: [
        "셀 상태",
        "입력 필터",
        "스트라이드",
        "출력 헤드"
      ],
      answer: 0,
      explanation: "셀 상태(Cell State)가 긴 시퀀스 상에서 기울기 소실 없이 정보를 전달해 줍니다[cite: 7].",
      hint: "장기 기억 정보가 지나는 중심 통로 상태입니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-009",
      conceptId: "lstm-forget-gate-role",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "LSTM에서 세포 상태의 과거 정보 중 필요 없는 불필요한 정보를 얼마만큼 제거할지 정하는 게이트는?",
      options: [
        "입력 게이트",
        "망각 게이트",
        "출력 게이트",
        "리셋 게이트"
      ],
      answer: 1,
      explanation: "망각 게이트(Forget Gate)가 이전 세포 상태에서 지울 정보를 제어합니다[cite: 7].",
      hint: "과거 정보를 잊어버리는 역할을 합니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-010",
      conceptId: "lstm-input-gate-role",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "LSTM에서 새로 입력된 정보 중 세포 상태에 추가로 저장할 양을 정해주는 게이트는?",
      options: [
        "망각 게이트",
        "출력 게이트",
        "입력 게이트",
        "드롭아웃 게이트"
      ],
      answer: 2,
      explanation: "입력 게이트(Input Gate)가 신규 정보를 세포 상태에 써넣을 비중을 정합니다[cite: 7].",
      hint: "새 정보를 받아들여 저장하는 역할을 수행합니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-011",
      conceptId: "lstm-output-gate-role",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "LSTM에서 세포 상태 정보를 기반으로 현재 은닉 상태로 내보낼 출력을 정하는 게이트는?",
      options: [
        "출력 게이트",
        "망각 게이트",
        "입력 게이트",
        "패딩 게이트"
      ],
      answer: 0,
      explanation: "출력 게이트(Output Gate)가 세포 상태 정보를 얼마만큼 내보낼지 제어합니다[cite: 7].",
      hint: "현재 시점의 은닉 상태로 내보내는 스위치 역할을 합니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-012",
      conceptId: "lstm-additive-gradient-path",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "multiple-choice",
      prompt: "LSTM이 단순 RNN에 비해 기울기 소실을 예방할 수 있는 수식적 전파 특징은?",
      options: [
        "가중치를 반복 곱하여 무한히 늘림",
        "은닉 상태 수치를 항상 0으로 만듦",
        "Linear 활성화 함수만을 고정 적용함",
        "세포 상태 전달 시 덧셈 연산 경로를 사용함"
      ],
      answer: 3,
      explanation: "세포 상태 업데이트가 덧셈 연산 경로로 전개되므로 역전파 시 기울기가 보존됩니다[cite: 7].",
      hint: "지속적인 곱셈이 아닌 덧셈 형태로 정보가 연결됩니다[cite: 7]."
    },
    {
      id: "vis-c3-sa-013",
      conceptId: "rnn-short-answer",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "short-answer",
      prompt: "이전 시점의 정보를 은닉 상태로 넘겨받으며 시퀀스 데이터를 다루는 순환 신경망 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["RNN", "rnn"],
      explanation: "순환 신경망 RNN입니다[cite: 7].",
      hint: "Recurrent Neural Nets 약자입니다[cite: 7]."
    },
    {
      id: "vis-c3-sa-014",
      conceptId: "forget-gate-short-answer",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "short-answer",
      prompt: "LSTM에서 과거 세포 상태에 기록된 정보 중 삭제할 비중을 정해주는 게이트는?",
      options: [],
      answer: null,
      acceptedAnswers: ["망각 게이트", "망각게이트", "Forget Gate", "forget gate"],
      explanation: "과거 정보 삭제를 담당하는 망각 게이트입니다[cite: 7].",
      hint: "과거 기억을 버리는 역할을 하는 게이트입니다[cite: 7]."
    },
    {
      id: "vis-c3-es-015",
      conceptId: "rnn-issue-and-lstm-solution-essay",
      difficulty: "easy",
      category: "CNN의 한계와 시퀀스 모델",
      questionType: "essay",
      prompt: "단순 RNN에서 긴 시퀀스 처리 시 발생하는 '기울기 소실' 문제와 이를 해결하기 위한 LSTM의 셀 상태 역할을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["기울기 소실", "셀 상태", "덧셈 경로", "장기 기억"],
      modelAnswer: "단순 RNN은 시퀀스가 길어질수록 역전파 시 가중치 반복 곱셈에 의해 기울기가 0으로 사라지는 기울기 소실 문제가 발생한다. LSTM은 셀 상태를 도입하여 가중치의 곱셈이 아닌 덧셈 경로 형태로 정보를 전달함으로써 기울기를 장기적으로 보존해 장기 기억을 가능하게 한다[cite: 7].",
      rubricKeywords: ["역전파 반복 곱셈", "기울기 소실 발생", "셀 상태 도입", "덧셈 경로 기울기 보존"],
      minLength: 20,
      explanation: "RNN의 연속 곱셈 오차 감소 문제와 LSTM 셀 상태의 덧셈 전달 이점을 작성합니다[cite: 7].",
      hint: "RNN의 역전파 곱셈 문제점과 LSTM 셀 상태 덧셈 전파의 장점을 연결해 서술하세요[cite: 7]."
    },

    // ==========================================
    // 카테고리 4: 어텐션 메커니즘과 셀프 어텐션 (15문항)
    // ==========================================
    {
      id: "vis-c4-mc-001",
      conceptId: "attention-weight-concept",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "multiple-choice",
      prompt: "어텐션 메커니즘이 기존 모델 대비 긴 거리의 맥락을 원활하게 포착하는 핵심 아이디어는?",
      options: [
        "모든 입력 요소에 가중치를 동일하게 나눔",
        "거리와 무관하게 연관성이 높은 부분에 집중 가중치를 부여함",
        "입력 데이터의 순서를 무작위로 교속함",
        "시퀀스의 맨 마지막 토큰만 고름"
      ],
      answer: 1,
      explanation: "어텐션은 공간/시간 거리와 상관없이 관련성이 높은 입력 대상에 가중치를 집중시켜 파악합니다[cite: 7].",
      hint: "관련 있는 요소에 더 높은 비중을 부여합니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-002",
      conceptId: "query-definition",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "multiple-choice",
      prompt: "어텐션 연산에서 '현재 내가 집중하고자 하는 질문 대상'을 나타내는 요소는?",
      options: [
        "키",
        "값",
        "소프트맥스",
        "쿼리"
      ],
      answer: 3,
      explanation: "쿼리(Query)는 어텐션 연산에서 현재 질의의 주체가 되는 대상입니다[cite: 7].",
      hint: "질문/질의를 나타내는 Q 요소입니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-003",
      conceptId: "key-definition",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "multiple-choice",
      prompt: "어텐션 연산에서 쿼리와의 유사도를 비교받는 '입력 요소들의 색인 특성'은?",
      options: [
        "키",
        "쿼리",
        "값",
        "바이어스"
      ],
      answer: 0,
      explanation: "키(Key)는 쿼리와의 관련성을 측정당하는 색인 요소입니다[cite: 7].",
      hint: "쿼리와 비교 매칭되는 K 요소입니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-004",
      conceptId: "value-definition",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "multiple-choice",
      prompt: "어텐션 연산에서 키에 대응하며 어텐션 가중치와 곱해져 최종 출력을 구성하는 '정보 내용'은?",
      options: [
        "쿼리",
        "키",
        "값",
        "채널"
      ],
      answer: 2,
      explanation: "값(Value)은 가중치와 곱해져 실제 출력을 형성하는 진짜 정보 값입니다[cite: 7].",
      hint: "실제 원본 정보를 담고 있는 V 요소입니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-005",
      conceptId: "softmax-normalization-attention",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "multiple-choice",
      prompt: "쿼리와 키의 내적 유사도를 확률 분포 형태로 정규화하기 위해 사용하는 함수는?",
      options: [
        "소프트맥스",
        "플랫튼",
        "맥스 풀링",
        "시그모이드"
      ],
      answer: 0,
      explanation: "내적 스코어에 소프트맥스를 적용하여 총합 1인 어텐션 확률 분포를 만듭니다[cite: 7].",
      hint: "가중치의 총합을 1로 정규화해 주는 함수입니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-006",
      conceptId: "self-attention-concept",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "multiple-choice",
      prompt: "단일 입력 시퀀스 내부에서 요소들이 서로 간의 유사도를 직접 연산하는 어텐션 방식은?",
      options: [
        "교차 어텐션",
        "셀프 어텐션",
        "합성곱 레이어",
        "완전 연결층"
      ],
      answer: 1,
      explanation: "동일 입력 내부 요소끼리 연관성을 구하는 셀프 어텐션입니다[cite: 7].",
      hint: "자기 내부(Self)에서 직접 연관성을 구합니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-007",
      conceptId: "cross-attention-concept",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "multiple-choice",
      prompt: "텍스트 단어와 이미지 패치처럼 서로 다른 이종 입력 소스 간의 관계를 잇는 어텐션은?",
      options: [
        "셀프 어텐션",
        "맥스 풀링",
        "교차 어텐션",
        "스트라이드"
      ],
      answer: 2,
      explanation: "서로 다른 출처의 두 데이터 간 연관성을 매핑하는 교차 어텐션(Cross-Attention)입니다[cite: 7].",
      hint: "두 입력 소스를 교차(Cross)하여 매핑합니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-008",
      conceptId: "scaled-dot-product-reason",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "multiple-choice",
      prompt: "쿼리와 키의 내적 스코어를 차원의 제곱근 수치로 나누어 주는 이유로 바른 것은?",
      options: [
        "어텐션 가중치를 모두 0으로 맞춤",
        "내적값이 커져 소프트맥스 기울기가 소실되는 현상을 막음",
        "입력 패치 해상도를 2배로 넓힘",
        "가중치 파라미터의 역전파를 막음"
      ],
      answer: 1,
      explanation: "내적값이 비대해져 소프트맥스 출력이 뾰족해지고 기울기가 사라지는 문제를 방지합니다[cite: 7].",
      hint: "소프트맥스 과정에서의 기울기 소실 예방 목적입니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-009",
      conceptId: "attention-weighted-sum",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "multiple-choice",
      prompt: "구해진 어텐션 확률 분포를 통해 최종 어텐션 출력을 산출하는 기본 연산은?",
      options: [
        "어텐션 가중치와 쿼리의 나눗셈",
        "어텐션 가중치와 키의 단순 빼기",
        "어텐션 가중치와 값의 가중합",
        "어텐션 가중치의 평균값 계산"
      ],
      answer: 2,
      explanation: "어텐션 가중치와 실제 정보인 값(Value)을 대응 곱하여 모두 더하는 가중합을 수행합니다[cite: 7].",
      hint: "확률 가중치를 실제 값(Value)에 곱하여 합산합니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-010",
      conceptId: "image-patch-division",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "multiple-choice",
      prompt: "어텐션을 이미지 분야에 적용할 때 이미지를 일정 크기 조각으로 분할한 단위는?",
      options: [
        "패치",
        "채널",
        "스트라이드",
        "바이어스"
      ],
      answer: 0,
      explanation: "2D 이미지를 일정 크기격자로 잘라낸 단위를 패치(Patch)라고 부릅니다[cite: 7].",
      hint: "이미지를 분할한 조각 단위 명칭입니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-011",
      conceptId: "attention-global-context",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "multiple-choice",
      prompt: "국소 필터 중심의 CNN과 비교했을 때 어텐션 메커니즘이 이미지 파악에서 가지는 강점은?",
      options: [
        "거리 제약 없이 이미지 전체의 전역 맥락을 직접 연산함",
        "입력 채널 크기를 1로 축소시킴",
        "네트워크의 깊이를 1개 층으로 단순화함",
        "이미지 패치의 위치를 자동으로 보존함"
      ],
      answer: 0,
      explanation: "어텐션은 공간 거리와 관계없이 전역(Global) 상호 연관성을 직접 파악합니다[cite: 7].",
      hint: "국소 영역을 넘어 이미지 전체 맥락을 바라봅니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-012",
      conceptId: "cross-attention-multimodal-role",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "multiple-choice",
      prompt: "텍스트 기반 이미지 생성 모델에서 교차 어텐션이 담당하는 핵심 연산 역할은?",
      options: [
        "텍스트 단어의 글자 수를 카운트함",
        "이미지의 해상도를 흑백으로 고정함",
        "생성 이미지 테두리에 패딩을 둘러쌈",
        "입력 텍스트 단어와 이미지 패치 간의 관련성을 매핑함"
      ],
      answer: 3,
      explanation: "조건이 되는 입력 텍스트 키값과 생성할 이미지 패치 쿼리 간의 연관성을 매핑해 줍니다[cite: 7].",
      hint: "텍스트 단어 조건과 이미지 조각의 위치를 매핑합니다[cite: 7]."
    },
    {
      id: "vis-c4-sa-013",
      conceptId: "key-element-sa",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "short-answer",
      prompt: "어텐션에서 쿼리와의 연관성을 비교당하는 입력 요소의 특성 색인 요소 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["키", "Key", "key"],
      explanation: "어텐션 3요소 중 Key입니다[cite: 7].",
      hint: "Q, K, V 중 K 요소에 해당합니다[cite: 7]."
    },
    {
      id: "vis-c4-sa-014",
      conceptId: "self-attention-sa-term",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "short-answer",
      prompt: "단일 입력 시퀀스 내부에서 요소들끼리 직접 가중치를 계산하는 어텐션 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["셀프 어텐션", "셀프어텐션", "Self-Attention", "self-attention"],
      explanation: "Self-Attention 기법입니다[cite: 7].",
      hint: "스스로에게 주의를 기울이는 어텐션 표현입니다[cite: 7]."
    },
    {
      id: "vis-c4-es-015",
      conceptId: "qkv-attention-flow-essay",
      difficulty: "easy",
      category: "어텐션 메커니즘과 셀프 어텐션",
      questionType: "essay",
      prompt: "어텐션 메커니즘을 구성하는 쿼리, 키, 값의 개념적 역할을 각각 작성하고, 최종 어텐션 출력이 얻어지는 원리를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["쿼리", "키", "값", "소프트맥스", "가중합"],
      modelAnswer: "쿼리는 집중하고자 하는 질문 대상, 키는 비교 대상의 특성 색인, 값은 실제 정보 내용이다. 쿼리와 키의 내적으로 유사도를 구하고 소프트맥스로 가중치 확률 분포를 만든 뒤, 이를 값에 곱해 가중합함으로써 최종 출력을 얻는다[cite: 7].",
      rubricKeywords: ["쿼리 질문 대상", "키 특성 색인", "값 내용 정보", "유사도 소프트맥스 가중합"],
      minLength: 20,
      explanation: "Q, K, V 정의와 유사도 점수 $\rightarrow$ 소프트맥스 정규화 $\rightarrow$ V와의 가중합 계산 과정을 서술합니다[cite: 7].",
      hint: "Q, K, V 역할과 내적 유사도 구하기, 소프트맥스 적용, 가중합 순서를 설명하세요[cite: 7]."
    },

    // ==========================================
    // 카테고리 5: 비전 트랜스포머 및 트렌드 (15문항)
    // ==========================================
    {
      id: "vis-c5-mc-001",
      conceptId: "vit-model-name",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "multiple-choice",
      prompt: "트랜스포머 아키텍처를 이미지 분류 분야에 성공적으로 적용한 대표적 비전 모델은?",
      options: [
        "AlexNet",
        "VGGNet",
        "ViT",
        "RNN"
      ],
      answer: 2,
      explanation: "이미지를 패치 토큰으로 나누어 트랜스포머 인코더에 입력하는 ViT입니다[cite: 7].",
      hint: "Vision Transformer의 줄임말입니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-002",
      conceptId: "vit-patch-division",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "multiple-choice",
      prompt: "ViT에서 2D 이미지를 트랜스포머 입력으로 변환하기 위한 첫 번째 전처리 단계는?",
      options: [
        "이미지 전체에 11x11 합성곱을 적용함",
        "이미지를 흑백으로 변환함",
        "이미지 패딩을 삭제함",
        "이미지를 일정한 패치 조각으로 나누어 토큰화함"
      ],
      answer: 3,
      explanation: "2D 이미지를 바둑판 모양의 패치 조각으로 나누어 1D 시퀀스 토큰처럼 다룹니다[cite: 7].",
      hint: "이미지를 일정한 패치 조각 단위로 자릅니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-003",
      conceptId: "vit-position-vector",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "multiple-choice",
      prompt: "ViT에서 분할된 패치 토큰들에 공간적 위치 정보를 부여하기 위해 더해주는 벡터는?",
      options: [
        "맥스 풀링",
        "스트라이드",
        "드롭아웃",
        "위치 인코딩"
      ],
      answer: 3,
      explanation: "위치 인코딩(Position Encoding)을 각 패치 토큰에 가산하여 패치의 위치 정보를 제공합니다[cite: 7].",
      hint: "패치 조각의 공간 위치 정보를 주입하는 벡터입니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-004",
      conceptId: "vit-encoder-sublayers",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "multiple-choice",
      prompt: "ViT 인코더 내부를 이루는 주요 서브레이어 구성 조합으로 바른 것은?",
      options: [
        "합성곱 레이어와 맥스 풀링만의 반복",
        "정규화, 다중헤드 어텐션, MLP 연결층의 조합",
        "은닉 상태를 전달하는 순환 셀의 반복",
        "플랫튼 연산과 드롭아웃만의 구성"
      ],
      answer: 1,
      explanation: "ViT 인코더는 Normalization, Multi-Head Attention, MLP 연결층의 연쇄로 구성됩니다[cite: 7].",
      hint: "어텐션 서브레이어와 정규화, MLP 연결층의 조합입니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-005",
      conceptId: "vit-prediction-head",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "multiple-choice",
      prompt: "ViT 인코더를 거친 최종 출력을 받아 클래스 분류 예측을 수행하는 파트는?",
      options: [
        "MLP 헤드",
        "합성곱 커널",
        "입력 패치",
        "위치 인코더"
      ],
      answer: 0,
      explanation: "ViT 인코더의 클래스 토큰 출력을 받아 최종 분류를 내놓는 MLP head입니다[cite: 7].",
      hint: "최종 예측을 전담하는 헤드 부분입니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-006",
      conceptId: "vit-pretraining-data-scale",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "multiple-choice",
      prompt: "ViT 모델이 CNN 이상의 고성능을 발휘하기 위해 반드시 필요한 학습 전제 조건은?",
      options: [
        "이미지 해상도를 10x10으로 축소함",
        "위치 인코딩을 완전히 제거함",
        "대규모 데이터셋에서의 사전 학습",
        "어텐션 헤드 개수를 1개로 제한함"
      ],
      answer: 2,
      explanation: "ViT는 이미지 귀납적 편향이 부족하여 대규모 데이터셋(JFT-300M 등) 사전학습이 필수적입니다[cite: 7].",
      hint: "거대한 대규모 데이터셋 사전학습 과정이 수반되어야 합니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-007",
      conceptId: "deit-distillation-technique",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "multiple-choice",
      prompt: "DeiT가 방대한 데이터 없이도 학생 ViT가 잘 학습되도록 선생님 CNN의 예측을 따라 하게 한 기술은?",
      options: [
        "맥스 풀링",
        "지식 증류",
        "기울기 절삭",
        "원핫 인코딩"
      ],
      answer: 1,
      explanation: "선생님 모델의 유용한 예측 지식을 학생 모델이 전수받는 지식 증류 기술입니다[cite: 7].",
      hint: "선생님의 지식을 축적/전수(증류)받는 방식입니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-008",
      conceptId: "swin-window-attention",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "multiple-choice",
      prompt: "Swin Transformer가 전역 어텐션의 높은 계산 비용을 해결하고자 채택한 방식은?",
      options: [
        "국소 윈도우 영역 설정 후 영역 내부에서만 어텐션 수행",
        "이미지 채널 수를 1개로 고정함",
        "위치 인코딩 벡터를 완전 제거함",
        "모든 패치를 다시 일렬 벡터로 전개함"
      ],
      answer: 0,
      explanation: "전체 패치 연산 대신 특정 윈도우 내부에서만 어텐션을 수행해 계산량을 크게 줄입니다[cite: 7].",
      hint: "윈도우(Window) 범위를 한정해 내부 어텐션을 수행합니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-009",
      conceptId: "swin-shifted-window",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "multiple-choice",
      prompt: "Swin Transformer에서 윈도우 경계 너머의 다른 영역과도 정보를 교류하기 위해 윈도우 위치를 비껴 설정하는 기술은?",
      options: [
        "중첩 맥스 풀링",
        "스트라이드 패딩",
        "글로벌 어텐션",
        "쉬프티드 윈도우"
      ],
      answer: 3,
      explanation: "윈도우를 교차 비껴 재배치(Shifted Window)하여 윈도우 간 맥락을 연결합니다[cite: 7].",
      hint: "윈도우를 비껴서(Shifted) 배치해 줍니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-010",
      conceptId: "dinov2-self-supervised",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "multiple-choice",
      prompt: "메타에서 라벨 없는 대규모 웹 이미지 14억 장을 자기지도 학습으로 훈련시켜 만든 비전 백본은?",
      options: [
        "AlexNet",
        "DINOv2",
        "VGG-16",
        "LeNet"
      ],
      answer: 1,
      explanation: "메타에서 공개한 자기지도 학습 비전 백본인 DINOv2 모델입니다[cite: 7].",
      hint: "DINOv2 모델입니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-011",
      conceptId: "learnable-position-encoding-limitation",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "multiple-choice",
      prompt: "학습 가능한 위치 인코딩(Learnable Position Encoding)이 가진 한계점은?",
      options: [
        "입력 이미지의 해상도가 달라지면 위치 인코딩을 재학습해야 함",
        "데이터 오버피팅이 무조건 발생함",
        "어텐션 연산 속도가 100배 늘어남",
        "채널 깊이를 0으로 차단함"
      ],
      answer: 0,
      explanation: "고정된 패치 위치 수에 맞춰 학습되므로 해상도가 바뀌면 패치 위치 수가 달라져 재학습이 필요합니다[cite: 7].",
      hint: "해상도 변경 시 패치 위치 수가 달라져 재학습이 요구되는 한계입니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-012",
      conceptId: "vit-global-receptive-field-first-layer",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "multiple-choice",
      prompt: "ViT가 CNN과 달리 층을 수십 단계 깊게 쌓지 않아도 첫 레이어부터 전역 맥락을 바로 파악하는 원리는?",
      options: [
        "첫 어텐션 연산부터 모든 패치가 서로 직접 연결되어 연산되므로",
        "맥스 풀링이 해상도를 이미 1x1로 축소시켜 두었으므로",
        "커널 필터 크기를 100x100으로 대형 적용하므로",
        "이미지를 1차원 플랫튼으로 일렬 전개해 두었으므로"
      ],
      answer: 0,
      explanation: "셀프 어텐션을 통하므로 첫 레이어부터 모든 이미지 패치 간의 관계가 직접 연산되어 전역 맥락을 즉시 파악합니다[cite: 7].",
      hint: "첫 어텐션 단계부터 이미지 전체 패치가 서로 연결됩니다[cite: 7]."
    },
    {
      id: "vis-c5-sa-013",
      conceptId: "vit-short-answer",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "short-answer",
      prompt: "2D 이미지를 패치 토큰으로 분할하여 트랜스포머 인코더에 입력하는 비전 모델 약자는?",
      options: [],
      answer: null,
      acceptedAnswers: ["ViT", "vit", "VIT"],
      explanation: "Vision Transformer 약자인 ViT입니다[cite: 7].",
      hint: "Vision Transformer의 약자입니다[cite: 7]."
    },
    {
      id: "vis-c5-sa-014",
      conceptId: "shifted-window-short-answer",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "short-answer",
      prompt: "Swin Transformer에서 윈도우 경계선 너머의 정보 교류를 위해 윈도우 위치를 비껴 재배치하는 기법은?",
      options: [],
      answer: null,
      acceptedAnswers: ["쉬프티드 윈도우", "쉬프티드윈도우", "Shifted Window", "shifted window"],
      explanation: "Shifted Window 기법입니다[cite: 7].",
      hint: "윈도우 위치를 비껴서 배치하는 기법입니다[cite: 7]."
    },
    {
      id: "vis-c5-es-015",
      conceptId: "vit-pos-encoding-and-deit-essay",
      difficulty: "easy",
      category: "비전 트랜스포머 및 트렌드",
      questionType: "essay",
      prompt: "ViT에서 위치 인코딩이 필요한 이유와, DeiT가 지식 증류(Knowledge Distillation)를 통해 해결하고자 한 문제점을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["위치 정보", "순서", "지식 증류", "대규모 데이터"],
      modelAnswer: "ViT의 셀프 어텐션은 패치 간 순서/위치 정보가 없으므로 위치 인코딩을 통해 공간 위치를 주입해야 한다. 한편 DeiT는 ViT의 '대규모 데이터 사전학습 필수' 문제를 해결하기 위해, 선생님 CNN의 예측을 지식 증류하여 중소규모 데이터에서도 높은 성능을 내도록 개선했다[cite: 7].",
      rubricKeywords: ["패치 공간 위치 정보 주입", "대규모 데이터 필요 문제", "선생님 모델 지식 증류"],
      minLength: 20,
      explanation: "위치 인코딩의 공간 정보 주입 필요성과 DeiT의 지식 증류를 통한 대규모 데이터 의존성 해소를 작성합니다[cite: 7].",
      hint: "패치 순서 알림 목적과 선생님 모델 지식을 통한 대규모 데이터 의존성 해소를 서술하세요[cite: 7]."
    }
  ]
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();