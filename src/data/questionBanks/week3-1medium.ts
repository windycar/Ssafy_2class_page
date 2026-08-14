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
    // 카테고리 1: CNN 연산 및 치수/파라미터 계산 (15문항)
    // ==========================================
    {
      id: "vis-c1-mc-med-001",
      conceptId: "conv-output-size-calc-med",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "multiple-choice",
      prompt: "32x32 크기의 입력 이미지에 5x5 필터, 패딩 0, 스트라이드 1을 적용하여 합성곱한 후, 이어서 2x2 맥스 풀링(스트라이드 2)을 적용했을 때 최종 출력의 가로세로 크기는?",
      options: [
        "14x14",
        "28x28",
        "16x16",
        "12x12"
      ],
      answer: 0,
      explanation: "합성곱 연산 후 크기는 (32 - 5 + 0)/1 + 1 = 28 이 되며, 2x2 풀링(스트라이드 2)을 거치면 28 / 2 = 14 가 됩니다[cite: 6].",
      hint: "합성곱 연산 후 해상도를 먼저 구한 뒤 풀링 보폭으로 나누어 보세요[cite: 6]."
    },
    {
      id: "vis-c1-mc-med-002",
      conceptId: "multi-layer-conv-shape-calc",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "multiple-choice",
      prompt: "224x224x3 입력 이미지에 3x3 Conv(패딩 1, 스트라이드 1) 64필터를 적용한 후 2x2 맥스 풀링(스트라이드 2)을 거쳐 3x3 Conv(패딩 1, 스트라이드 1) 128필터를 적용했을 때 특징 맵의 최종 차원은?",
      options: [
        "224x224x128",
        "112x112x128",
        "56x56x128",
        "112x112x64"
      ],
      answer: 1,
      explanation: "첫 Conv 후 224x224x64, 맥스 풀링 후 112x112x64가 되며, 두 번째 Conv 후 112x112x128 차원이 됩니다[cite: 6].",
      hint: "패딩 1인 3x3 Conv는 해상도를 유지하고, 스트라이드 2 풀링은 해상도를 절반으로 줄입니다[cite: 6]."
    },
    {
      id: "vis-c1-mc-med-003",
      conceptId: "receptive-field-and-param-reduction",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "multiple-choice",
      prompt: "7x7 필터 1개를 사용할 때와 3x3 필터 3개를 연속 중첩할 때, 동일한 수용 영역(7x7) 대비 3x3 3개 중첩 방식의 가중치 파라미터 수 감소 비율은? (입출력 채널 C로 동일)",
      options: [
        "약 10% 감소",
        "약 25% 감소",
        "약 45% 감소",
        "약 65% 감소"
      ],
      answer: 2,
      explanation: "7x7 1개는 49 C^2 이고, 3x3 3개는 27 C^2 (9x3) 이므로 (49 - 27)/49 = 22/49 = 약 44.9% (약 45%) 감소합니다[cite: 6].",
      hint: "7x7 면적(49)과 3x3 세 개의 면적 합(27)의 비율을 비교해 보세요[cite: 6]."
    },
    {
      id: "vis-c1-mc-med-004",
      conceptId: "fcn-vs-cnn-efficiency",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "multiple-choice",
      prompt: "CNN이 FCN보다 이미지 처리에서 메모리와 파라미터를 효율적으로 사용하는 이유를 가장 정확히 설명한 것은?",
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
      id: "vis-c1-mc-med-005",
      conceptId: "conv-param-count-calc",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "multiple-choice",
      prompt: "입력 채널이 3개인 이미지에 3x3 커널 크기의 필터 64개를 사용하는 합성곱 레이어가 있다. 편향(Bias)을 제외한 순수 필터 가중치 파라미터의 총 개수는?",
      options: [
        "1728개",
        "576개",
        "1792개",
        "192개"
      ],
      answer: 0,
      explanation: "필터 가중치 개수는 (입력 채널 수 x 커널 높이 x 커널 너비) x 필터 개수 이므로 3 x 3 x 3 x 64 = 1728 개입니다[cite: 6].",
      hint: "입력 채널 수, 커널 가로세로 크기, 그리고 필터 전체 개수를 모두 곱해 보세요[cite: 6]."
    },
    {
      id: "vis-c1-mc-med-006",
      conceptId: "resolution-reduction-flops-ratio",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "multiple-choice",
      prompt: "입력 이미지의 가로세로 해상도를 절반으로 줄여 입력할 때(224x224 -> 112x112), 합성곱 레이어의 연산량(FLOPs) 감소 배율은? (커널 크기 및 채널 수 고정)",
      options: [
        "2배 감소",
        "4배 감소",
        "8배 감소",
        "16배 감소"
      ],
      answer: 1,
      explanation: "FLOPs 연산량은 출력 원소 수(H' x W' x C_out)에 비례하므로 가로세로 해상도가 각각 1/2이 되면 총 연산량은 1/4로 (4배) 줄어듭니다[cite: 6].",
      hint: "가로와 세로 해상도가 각각 절반으로 줄어들 때 면적 변화율을 생각해 보세요[cite: 6]."
    },
    {
      id: "vis-c1-mc-med-007",
      conceptId: "params-vs-flops-concentration",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "multiple-choice",
      prompt: "전통적인 분류용 CNN의 계산 특성을 비교할 때, 가중치 파라미터 수와 연산량(FLOPs)이 주로 집중되는 구간을 바르게 짝지은 것은?",
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
      id: "vis-c1-mc-med-008",
      conceptId: "receptive-field-change",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "multiple-choice",
      prompt: "여러 합성곱 블록을 연속으로 쌓는 CNN에서 한 출력 노드가 참조하는 원본 입력 범위(Receptive Field)는 레이어 깊이에 따라 어떻게 변하는가?",
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
      id: "vis-c1-mc-med-009",
      conceptId: "conv-output-size-formula",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "multiple-choice",
      prompt: "2차원 합성곱의 한 축에 대해 입력 W, 커널 K, 패딩 P, 스트라이드 S가 주어졌을 때 출력 크기 W'를 계산하는 공식은?",
      options: [
        "W' = (W + K - P) / S - 1",
        "W' = (W - K + P) / (2S)",
        "W' = (W - K + 2P) / S + 1",
        "W' = (W + 2P) / (K * S)"
      ],
      answer: 2,
      explanation: "합성곱 출력 해상도 산출 기본 수식은 (W - K + 2P) / S + 1 입니다[cite: 6].",
      hint: "패딩 2P를 더하고 커널 K를 뺀 후 스트라이드로 나누고 1을 더합니다[cite: 6]."
    },
    {
      id: "vis-c1-mc-med-010",
      conceptId: "feature-map-total-elements-comp",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "multiple-choice",
      prompt: "28x28x64 특징 맵과 14x14x256 특징 맵의 총 원소 수(Element count)를 비교 계산한 결과로 올바른 것은?",
      options: [
        "28x28x64가 2배 더 많음",
        "두 특징 맵의 총 원소 수가 동일함",
        "14x14x256이 2배 더 많음",
        "14x14x256이 4배 더 많음"
      ],
      answer: 1,
      explanation: "28 x 28 x 64 = 50,176 개 이며, 14 x 14 x 256 = 50,176 개로 두 특징 맵의 원소 수는 정확히 같습니다[cite: 6].",
      hint: "가로 x 세로 x 채널 수 계산 결과를 비교해 보세요[cite: 6]."
    },
    {
      id: "vis-c1-mc-med-011",
      conceptId: "pooling-dimension-change",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "multiple-choice",
      prompt: "공간 크기 224x224, 채널 수 64인 특징 맵에 2x2 맥스 풀링(스트라이드 2)을 적용하면 채널 수를 유지한 출력 차원은?",
      options: [
        "224x224x32",
        "112x112x32",
        "448x448x64",
        "112x112x64"
      ],
      answer: 3,
      explanation: "풀링은 채널 수(64)를 유지하면서 가로세로 해상도만 각각 절반(112x112)으로 축소시킵니다[cite: 6].",
      hint: "채널 깊이는 유지되고 가로세로 해상도만 절반으로 줄어듭니다[cite: 6]."
    },
    {
      id: "vis-c1-mc-med-012",
      conceptId: "filter-size-param-comparison",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "multiple-choice",
      prompt: "동일한 수용 영역(5x5)을 확보할 때, 5x5 필터 1개를 사용하는 방식과 3x3 필터 2개를 중첩하는 방식의 파라미터 수 비교 결과는? (입출력 채널 C로 동일)",
      options: [
        "5x5 1개: 25 C^2 / 3x3 2개: 18 C^2 (3x3 중첩 방식이 파라미터 약 28% 감소)",
        "5x5 1개: 10 C^2 / 3x3 2개: 20 C^2",
        "두 방식의 가중치 파라미터 개수는 완벽히 동일함",
        "3x3 중첩 방식의 파라미터 수가 2배 더 많아짐"
      ],
      answer: 0,
      explanation: "5x5 1개는 25 C^2 이고, 3x3 2개는 9 C^2 + 9 C^2 = 18 C^2 이 되어 작은 필터를 쌓는 것이 파라미터 면에서 훨씬 이득입니다[cite: 6].",
      hint: "커널 면적의 합(5x5=25 대 3x3 두 번=18)을 비교하여 계산해 보세요[cite: 6]."
    },
    {
      id: "vis-c1-sa-med-013",
      conceptId: "conv-out-calc-sa-med",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "short-answer",
      prompt: "32x32x3 입력 이미지에 5x5 커널(패딩 2, 스트라이드 1)을 가진 16개 필터의 합성곱 레이어를 적용한 후, 2x2 맥스 풀링(스트라이드 2)을 적용했을 때 최종 출력 특징 맵의 형태(C x H x W)는?",
      options: [],
      answer: null,
      acceptedAnswers: ["16x16x16", "16 x 16 x 16", "16, 16, 16"],
      explanation: "합성곱 후 (32-5+4)/1+1 = 32 해상도 및 16채널(16x32x32)이 되며, 2x2 풀링 후 16x16x16 차원이 됩니다[cite: 6].",
      hint: "합성곱 연산 후 해상도를 구하고 2x2 풀링으로 다운샘플링된 C x H x W 형태를 적으세요[cite: 6]."
    },
    {
      id: "vis-c1-sa-med-014",
      conceptId: "conv-param-calc-sa-med",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "short-answer",
      prompt: "입력 채널 3, 커널 크기 3x3, 필터 개수 32개인 합성곱 레이어에서 편향(Bias)을 제외한 순수 가중치 수와 필터당 1개의 편향을 포함한 총 파라미터 수를 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["864, 896", "864,896", "864 896"],
      explanation: "순수 가중치는 3 x 3 x 3 x 32 = 864 개이며, 편향 32개를 더하면 총 896 개입니다[cite: 6].",
      hint: "순수 가중치 수(3x3x3x32)와 편향 32개를 더한 값을 차례로 적으세요[cite: 6]."
    },
    {
      id: "vis-c1-es-med-015",
      conceptId: "conv-size-and-param-essay",
      difficulty: "medium",
      category: "CNN 연산 및 치수/파라미터 계산",
      questionType: "essay",
      prompt: "64x64x3 입력 이미지에 3x3 필터 32개(패딩 1, 스트라이드 2)를 적용한 후 2x2 맥스 풀링(스트라이드 2)을 수행할 때, 최종 출력 특징 맵의 차원(C x H x W)을 계산 과정과 함께 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["32x16x16", "32 x 16 x 16"],
      modelAnswer: "1) 합성곱 후 가로세로 해상도는 (64 - 3 + 2*1)/2 + 1 = 32 이 되며, 필터 수에 따라 32x32x32 차원이 된다. 2) 이어서 2x2 맥스 풀링(스트라이드 2)을 수행하면 해상도가 절반으로 줄어 최종 출력 차원은 32x16x16 (채널32, 높이16, 너비16)이 된다[cite: 6].",
      rubricKeywords: ["합성곱 후 32x32x32", "풀링 후 32x16x16", "출력 채널 32"],
      minLength: 20,
      explanation: "합성곱 해상도 산출과 풀링 다운샘플링을 순차 적용하여 32x16x16 차원을 도출합니다[cite: 6].",
      hint: "합성곱 연산 후 해상도를 먼저 구하고, 풀링 후 최종 가로, 세로, 채널 크기를 서술하세요[cite: 6]."
    },

    // ==========================================
    // 카테고리 2: CNN 대표 모델 구조 및 비교 (15문항)
    // ==========================================
    {
      id: "vis-c2-mc-med-001",
      conceptId: "resnet-channel-mismatch-solution",
      difficulty: "medium",
      category: "CNN 대표 모델 구조 및 비교",
      questionType: "multiple-choice",
      prompt: "ResNet 잔차 블록 H(x) = F(x) + x 에서, 서브레이어 F(x)를 거치며 채널 수가 늘어나 입력 x와 차원이 일치하지 않을 때 해결하는 방법은?",
      options: [
        "지름길 통로(Skip Connection)에 1x1 합성곱을 적용하여 차원을 맞춤",
        "서브레이어 F(x)의 출력을 무조건 0으로 만듦",
        "지름길 통로를 끊어버리고 일반 평탄 네트워크로 전환함",
        "입력 x의 뒤쪽에 0을 채워 넣는 맥스 풀링을 적용함"
      ],
      answer: 0,
      explanation: "차원이 불일치할 때는 지름길 통로 상에 1x1 합성곱(Projection Shortcut)을 가해 x의 차원을 F(x)와 동일하게 맞춘 후 덧셈합니다[cite: 6].",
      hint: "지름길 통로 상에서 가로세로는 유지하며 깊이 차원만 변경하는 연산을 가합니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-med-002",
      conceptId: "mobilenet-depthwise-separable-ratio",
      difficulty: "medium",
      category: "CNN 대표 모델 구조 및 비교",
      questionType: "multiple-choice",
      prompt: "표준 합성곱 연산량 대비 MobileNet의 Depthwise Separable 합성곱 연산량 비율을 나타내는 올바른 수식 표현은? (N: 출력 채널 수, D_K: 필터 커널 크기)",
      options: [
        "N / D_K^2",
        "1/N + 1/(D_K^2)",
        "1 / (N * D_K)",
        "D_K^2 / N"
      ],
      answer: 1,
      explanation: "표준 합성곱 대비 Depthwise Separable 합성곱의 연산량 비율 수식은 1/N + 1/(D_K^2) 입니다[cite: 6].",
      hint: "출력 채널 수 N과 커널 면적 D_K^2의 역수 합 형태의 비율 수식입니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-med-003",
      conceptId: "vgg16-bottleneck-param-layer",
      difficulty: "medium",
      category: "CNN 대표 모델 구조 및 비교",
      questionType: "multiple-choice",
      prompt: "VGG16 모델 전체 파라미터(약 1억 3800만 개) 중 약 1억 개 이상의 파라미터가 집중되어 병목을 일으키는 특정 레이어 위치는?",
      options: [
        "첫 번째 합성곱 레이어(Conv1_1)",
        "세 번째 맥스 풀링 레이어(Pool3)",
        "첫 번째 완전 연결 레이어(FC1)",
        "최종 소프트맥스 출력 레이어"
      ],
      answer: 2,
      explanation: "7x7x512 특징 맵을 25,088차원 벡터로 펼친 후 4096 뉴런과 연결되는 FC1 레이어에 파라미터가 폭발적으로 몰려있습니다[cite: 6].",
      hint: "특징 맵을 처음으로 1차원 벡터로 길게 펴서 전결합하는 위치입니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-med-004",
      conceptId: "resnet-bottleneck-block-structure",
      difficulty: "medium",
      category: "CNN 대표 모델 구조 및 비교",
      questionType: "multiple-choice",
      prompt: "ResNet-50 이상에서 연산 효율성을 높이기 위해 채택한 병목(Bottleneck) 잔차 블록의 3단계 층 순서는?",
      options: [
        "3x3 Conv -> 3x3 Conv -> 3x3 Conv",
        "5x5 Conv -> MaxPool -> 5x5 Conv",
        "Depthwise Conv -> Pointwise Conv -> MaxPool",
        "1x1 Conv(채널축소) -> 3x3 Conv -> 1x1 Conv(채널복원)"
      ],
      answer: 3,
      explanation: "병목 블록은 1x1 Conv로 차원을 줄인 뒤 3x3 연산을 하고 다시 1x1 Conv로 차원을 늘려 연산량을 아낍니다[cite: 6].",
      hint: "1x1로 차원을 줄여 3x3 연산을 가볍게 한 뒤 다시 1x1로 복원하는 형태입니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-med-005",
      conceptId: "alexnet-vs-vggnet-architecture-comp",
      difficulty: "medium",
      category: "CNN 대표 모델 구조 및 비교",
      questionType: "multiple-choice",
      prompt: "AlexNet과 VGGNet의 구조적 차이점에 대한 설명 중 옳지 않은 것은?",
      options: [
        "AlexNet은 11x11, 5x5 등 다양한 크기의 커널을 섞어 썼으나, VGGNet은 3x3 커널을 단일화하여 깊게 쌓았다.",
        "AlexNet은 8개 층으로 구성되었으나, VGGNet은 16~19개 층으로 더 깊어졌다.",
        "AlexNet과 VGGNet 모두 후반부 연결층(FC Layer)에 상당수의 파라미터가 몰려있다.",
        "AlexNet은 지름길 연결을 사용했으나, VGGNet은 지름길 연결을 완전히 제거하였다."
      ],
      answer: 3,
      explanation: "지름길 연결(Skip Connection)은 AlexNet과 VGGNet 이후에 제안된 ResNet의 고유 구조입니다[cite: 6].",
      hint: "지름길 연결은 두 모델보다 나중에 등장한 ResNet의 핵심 기술입니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-med-006",
      conceptId: "mobilenet-depthwise-output-channel",
      difficulty: "medium",
      category: "CNN 대표 모델 구조 및 비교",
      questionType: "multiple-choice",
      prompt: "64개 채널을 가진 입력 데이터에 MobileNet의 Depthwise Convolution(3x3 커널)을 적용할 때 출력되는 특징 맵의 채널 수는?",
      options: [
        "64개",
        "192개",
        "16개",
        "1개"
      ],
      answer: 0,
      explanation: "Depthwise Conv는 각 채널마다 독립적으로 1개씩의 공간 필터만 적용되므로 출력 채널 수도 입력과 동일한 64개입니다[cite: 6].",
      hint: "깊이별(Depthwise) 연산은 채널을 합치지 않고 각 채널마다 독립 적용됩니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-med-007",
      conceptId: "plain-net-degradation-problem",
      difficulty: "medium",
      category: "CNN 대표 모델 구조 및 비교",
      questionType: "multiple-choice",
      prompt: "ResNet 논문에서 지름길 연결이 없는 일반 평탄 네트워크(Plain Net)의 층을 20층에서 56층으로 늘렸을 때 관찰된 열화(Degradation) 현상은?",
      options: [
        "훈련 오차는 0이 되었으나 테스트 오차만 과적합으로 급증한 현상",
        "과적합 때문이 아닌데도 깊은 네트워크의 훈련 오차가 얕은 네트워크보다 오히려 더 커지는 현상",
        "기울기가 무한대로 발산하여 학습이 중단된 현상",
        "특징 맵의 채널 수가 0으로 축소되는 현상"
      ],
      answer: 1,
      explanation: "Plain Net은 과적합에 의한 것이 아님에도 층이 깊어지면 최적화 문제로 훈련 오차 자체가 오히려 악화되는 열화 현상이 생깁니다[cite: 6].",
      hint: "과적합 때문이 아닌데도 층이 깊어질 때 훈련 오차가 커지는 현상입니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-med-008",
      conceptId: "mobilenet-pointwise-param-calc",
      difficulty: "medium",
      category: "CNN 대표 모델 구조 및 비교",
      questionType: "multiple-choice",
      prompt: "입력 채널 64개, 출력 채널 128개일 때, MobileNet의 Pointwise Convolution(1x1 커널) 편향 제외 가중치 개수는?",
      options: [
        "576개",
        "24576개",
        "8192개",
        "192개"
      ],
      answer: 2,
      explanation: "Pointwise Conv는 1x1 커널이므로 가중치 개수는 64 x 1 x 1 x 128 = 8,192 개입니다[cite: 6].",
      hint: "가로세로 1x1 크기에 입력 채널 수와 출력 채널 수를 곱하세요[cite: 6]."
    },
    {
      id: "vis-c2-mc-med-009",
      conceptId: "alexnet-input-resolution-correction",
      difficulty: "medium",
      category: "CNN 대표 모델 구조 및 비교",
      questionType: "multiple-choice",
      prompt: "AlexNet의 첫 Conv층이 11x11 커널, 스트라이드 4, 패딩 0이고 출력 직전 공간 크기가 55x55라면 입력 해상도는 얼마여야 하는가?",
      options: [
        "256x256",
        "227x227",
        "220x220",
        "55x55"
      ],
      answer: 1,
      explanation: "(W - 11)/4 + 1 = 55 식을 만족하는 실제 정정 입력 해상도는 W = 227 입니다[cite: 6].",
      hint: "출력 55가 정확히 도출되기 위해 수정된 입력 규격 수치입니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-med-010",
      conceptId: "model-selection-embedded-scenario",
      difficulty: "medium",
      category: "CNN 대표 모델 구조 및 비교",
      questionType: "multiple-choice",
      prompt: "자율주행 드론에 탑재할 실시간 객체 인식 모델을 구축할 때, 연산량과 VRAM 자원이 매우 제한적인 환경에서 최우선 선택할 아키텍처는?",
      options: [
        "MobileNet",
        "VGG19",
        "ResNet152",
        "AlexNet"
      ],
      answer: 0,
      explanation: "임베디드 및 모바일 기기처럼 연산과 메모리가 제한된 실시간 환경에는 MobileNet이 가장 적합합니다[cite: 6].",
      hint: "경량화와 연산 효율성에 특화된 모바일 전용 모델을 고르세요[cite: 6]."
    },
    {
      id: "vis-c2-mc-med-011",
      conceptId: "vgg16-conv-layer-total-count",
      difficulty: "medium",
      category: "CNN 대표 모델 구조 및 비교",
      questionType: "multiple-choice",
      prompt: "VGG16 모델을 구성하는 총 16개 가중치 레이어 중 합성곱(Conv) 레이어의 개수는 몇 개인가?",
      options: [
        "16개",
        "3개",
        "13개",
        "5개"
      ],
      answer: 2,
      explanation: "VGG16은 13개의 합성곱(Conv) 레이어와 3개의 완전 연결(FC) 레이어로 이루어져 있습니다[cite: 6].",
      hint: "전체 16개 레이어 중 후반 FC 레이어 3개를 제외한 수입니다[cite: 6]."
    },
    {
      id: "vis-c2-mc-med-012",
      conceptId: "resnet-identity-mapping",
      difficulty: "medium",
      category: "CNN 대표 모델 구조 및 비교",
      questionType: "multiple-choice",
      prompt: "ResNet에서 만약 추가된 레이어가 아무런 유용한 특징을 배우지 못할 경우(F(x) = 0), 블록 전체가 수행하는 연산 상태는?",
      options: [
        "영 행렬 출력 (H(x) = 0)",
        "차원 무한 발산",
        "소프트맥스 확률 출력",
        "항등 매핑 (Identity Mapping, H(x) = x)"
      ],
      answer: 3,
      explanation: "F(x) = 0이 되면 H(x) = 0 + x = x 가 되어 입력을 그대로 전달하는 항등 매핑 상태가 되므로 성능이 저하되지 않습니다[cite: 6].",
      hint: "입력 x가 변형 없이 그대로 출력되는 매핑 상태입니다[cite: 6]."
    },
    {
      id: "vis-c2-sa-med-013",
      conceptId: "mobilenet-two-conv-types-sa",
      difficulty: "medium",
      category: "CNN 대표 모델 구조 및 비교",
      questionType: "short-answer",
      prompt: "MobileNet의 Depthwise Separable Convolution을 이루는 두 가지 연산(채널별 공간 연산, 1x1 채널 결합 연산)의 명칭을 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Depthwise Convolution, Pointwise Convolution", "깊이별 합성곱, 포인트와이즈 합성곱", "Depthwise, Pointwise", "depthwise, pointwise"],
      explanation: "Depthwise Convolution과 Pointwise Convolution 연산입니다[cite: 6].",
      hint: "채널별 공간 연산(Depthwise)과 1x1 채널 연산(Pointwise) 명칭을 적으세요[cite: 6]."
    },
    {
      id: "vis-c2-sa-med-014",
      conceptId: "resnet-identity-skip-sa",
      difficulty: "medium",
      category: "CNN 대표 모델 구조 및 비교",
      questionType: "short-answer",
      prompt: "ResNet 잔차 블록 수식 H(x) = F(x) + x 에서, 레이어가 아무것도 학습하지 못해 F(x) = 0 일 때 입력을 그대로 전달하는 상태와 이를 가능케 해주는 연결 구조의 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["항등 매핑, 지름길 연결", "Identity Mapping, Skip Connection", "항등매핑, 지름길연결", "항등 매핑, 잔차 연결"],
      explanation: "항등 매핑(Identity Mapping) 상태와 지름길 연결(Skip Connection) 구조입니다[cite: 6].",
      hint: "입력이 그대로 출력되는 상태(항등 매핑)와 건너뛰어 연결해 주는 통로 명칭을 쓰세요[cite: 6]."
    },
    {
  id: "vis-c2-es-med-015",
  conceptId: "std-conv-vs-depthwise-separable-essay",
  difficulty: "medium",
  category: "CNN 대표 모델 구조 및 비교",
  questionType: "essay",
  prompt: "입력 채널 64, 출력 채널 128, 커널 크기 3x3 조건일 때, 표준 합성곱과 Depthwise Separable Convolution의 파라미터 개수를 각각 계산하고 두 방식의 차이를 서술하시오.",
  options: [],
  answer: null,
  acceptedAnswers: [
    "73728",
    "8768",
    "73,728",
    "8,768",
    "Depthwise Separable Convolution",
    "Depthwise",
    "Pointwise"
  ],
  modelAnswer:
    "표준 합성곱의 파라미터 수는 3x3x64x128 = 73,728개이다. Depthwise Separable Convolution은 먼저 각 입력 채널마다 3x3 필터를 적용하므로 Depthwise Convolution의 파라미터 수는 3x3x64 = 576개이다. 이후 1x1 Pointwise Convolution으로 64개 채널을 128개 출력 채널로 결합하므로 1x1x64x128 = 8,192개가 필요하다. 따라서 전체 파라미터 수는 576 + 8,192 = 8,768개이다. 즉, 공간 연산과 채널 결합 연산을 분리하여 표준 합성곱보다 훨씬 적은 파라미터로 연산할 수 있다.",
  rubricKeywords: [
    "표준 합성곱 73,728개",
    "Depthwise 576개",
    "Pointwise 8,192개",
    "전체 8,768개",
    "공간 연산과 채널 연산 분리"
  ],
  minLength: 30,
  explanation:
    "표준 합성곱은 모든 입력 채널과 출력 채널을 한 번에 연결하지만, Depthwise Separable Convolution은 채널별 공간 연산과 1x1 채널 결합 연산을 분리하여 파라미터 수를 크게 줄입니다.",
  hint:
    "표준 합성곱은 3x3x입력채널x출력채널로 계산하고, Depthwise Separable은 Depthwise와 Pointwise의 파라미터 수를 각각 계산한 뒤 더해 보세요."
},

    // ==========================================
    // 카테고리 3: CNN 한계 및 시퀀스/RNN 구조 추론 (15문항)
    // ==========================================
    {
      id: "vis-c3-mc-med-001",
      conceptId: "cnn-order-insensitivity-inference",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "multiple-choice",
      prompt: "문장 A(\"약 먹고 잠자기\")와 문장 B(\"잠자고 약 먹기\")를 2D 합성곱(CNN)으로 처리할 때 생기는 문제점은?",
      options: [
        "두 문장의 구성 단어가 동일하여 시간적 순서 흐름 변경에 따른 의미 차이를 포착하기 어려움",
        "문장 B의 텍스트 길이를 연산하지 못함",
        "단어들의 알파벳 개수가 달라 손실 오차가 발산함",
        "어휘 사전 크기가 무한대로 커짐"
      ],
      answer: 0,
      explanation: "CNN 필터는 위치에 불변적인 국소 패턴을 보므로 순서(order) 변경에 따른 의미 변화를 포착하기 어렵습니다[cite: 7].",
      hint: "단어의 구성은 같지만 순서가 바뀔 때 국소 필터가 겪는 한계입니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-med-002",
      conceptId: "rnn-hidden-state-calc-step",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "multiple-choice",
      prompt: "RNN 셀에서 입력 x_t(차원 100), 이전 은닉 상태 h_(t-1)(차원 64)로부터 현재 h_t(차원 64)를 만들 때 가중치 W_xh와 W_hh의 행렬 차원은?",
      options: [
        "W_xh: 100x100, W_hh: 64x64",
        "W_xh: 64x100, W_hh: 64x64",
        "W_xh: 64x64, W_hh: 100x64",
        "W_xh: 100x64, W_hh: 100x100"
      ],
      answer: 1,
      explanation: "결과가 64차원이 되어야 하므로 W_xh는 64x100, W_hh는 64x64 차원입니다[cite: 7].",
      hint: "입력(100)과 이전 상태(64)를 각각 출력 차원(64)으로 만드는 행렬 크기입니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-med-003",
      conceptId: "rnn-many-to-one-vs-many-to-many-shape",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "multiple-choice",
      prompt: "시퀀스 길이 10, 은닉 차원 64일 때, 감정 분석(Many-to-One)의 분류 레이어로 들어가는 은닉 상태 벡터 형태와 품사 태깅(Many-to-Many)의 전체 은닉 상태 형태 차이는?",
      options: [
        "Many-to-One: 10x64 행렬 / Many-to-Many: 1x64 벡터",
        "Many-to-One: 10x10 행렬 / Many-to-Many: 64x64 행렬",
        "Many-to-One: 마지막 은닉 상태 벡터 1x64 / Many-to-Many: 전체 은닉 상태 행렬 10x64",
        "두 아키텍처의 은닉 상태 차원은 1x1 스칼라로 동일함"
      ],
      answer: 2,
      explanation: "Many-to-One은 분류 레이어 입력을 위해 마지막 타임스텝의 은닉 상태(1x64)만 사용하고, Many-to-Many는 전체 10개 스텝 은닉 상태(10x64)를 활용합니다[cite: 7].",
      hint: "마지막 1개 시점의 은닉 상태만 사용하는지, 전체 10개 시점의 은닉 상태를 모두 사용하는지 확인하세요[cite: 7]."
    },
    {
      id: "vis-c3-mc-med-004",
      conceptId: "gradient-clipping-vs-vanishing",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "multiple-choice",
      prompt: "RNN의 기울기 절삭(Gradient Clipping) 기법이 해결할 수 있는 오차 문제와 한계점의 조합으로 바른 것은?",
      options: [
        "기울기 소실은 해결하지만 기울기 폭발은 막지 못함",
        "기울기 소실과 폭발을 둘 다 완벽히 해결함",
        "오버피팅만 예방하고 기울기 문제와는 무관함",
        "기울기 폭발은 임계값으로 잘라 막지만 기울기 소실 문제는 해결하지 못함"
      ],
      answer: 3,
      explanation: "기울기 절삭은 기울기 폭발은 임계값으로 자르지만, 기울기가 0으로 사라지는 기울기 소실 문제는 해결 불가능합니다[cite: 7].",
      hint: "기울기 폭발 방지에는 효과적이나, 기울기가 사라지는 소실 문제는 해결하지 못합니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-med-005",
      conceptId: "lstm-cell-state-additive-and-dilution",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "multiple-choice",
      prompt: "LSTM의 세포 상태 c_t = f * c_(t-1) + i * g 전개 방식에 대한 해석으로 가장 바른 것은?",
      options: [
        "덧셈 연산 경로로 기울기 소실을 막아주지만, 망각 게이트 f의 연속 곱셈 누적으로 아주 오래된 정보는 점차 희석될 수 있음",
        "세포 상태의 모든 수치가 타임스텝마다 0으로 소멸함",
        "망각 게이트 f가 과거 정보를 100% 무조건 보존함",
        "기울기 소실과 정보 희석 현상을 둘 다 완전히 차단함"
      ],
      answer: 0,
      explanation: "덧셈 경로로 기울기 소실은 방지되지만, 스텝마다 망각 게이트 f가 감쇄 곱을 가하므로 아주 긴 시퀀스에서는 오래된 정보가 희석됩니다[cite: 7].",
      hint: "덧셈 통로의 기울기 보존 효과와 망각 게이트 누적 곱에 의한 오래된 정보 희석 현상을 함께 생각해 보세요[cite: 7]."
    },
    {
      id: "vis-c3-mc-med-006",
      conceptId: "simple-rnn-vs-lstm-module",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "multiple-choice",
      prompt: "단순 RNN과 비교하여 LSTM이 오차 신호를 긴 시퀀스상에서 기울기 소실 없이 보존할 수 있게 해주는 핵심 구조는?",
      options: [
        "단일 tanh 활성화 함수와 플랫튼 레이어",
        "세포 상태(Cell State)와 게이트 유닛(입력, 망각, 출력)",
        "맥스 풀링과 스트라이드",
        "소프트맥스 레이어와 드롭아웃"
      ],
      answer: 1,
      explanation: "LSTM은 장기 정보를 유지하는 세포 상태와 정보 흐름을 제어하는 3개 게이트를 도입했습니다[cite: 7].",
      hint: "장기 기억 전송 통로인 세포 상태와 흐름 제어 게이트들입니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-med-007",
      conceptId: "lstm-forget-gate-zero-output",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "multiple-choice",
      prompt: "LSTM 망각 게이트 f의 출력 벡터 원소가 0이 될 때 이전 세포 상태 c_(t-1)에 일어나는 변화는?",
      options: [
        "이전 세포 상태의 해당 위치 정보가 100% 보존됨",
        "현재 입력 x_t의 값이 0으로 초기화됨",
        "이전 세포 상태의 해당 위치 정보가 완벽히 지워지고 삭제됨",
        "출력 은닉 상태 h_t가 무한대로 발산함"
      ],
      answer: 2,
      explanation: "f * c_(t-1) 곱셈 연산에서 f=0 이 되면 곱셈 결과가 0이 되어 과거 세포 상태 기억을 삭제합니다[cite: 7].",
      hint: "과거 세포 상태 c_(t-1)에 0이 곱해질 때의 결과를 떠올려 보세요[cite: 7]."
    },
    {
      id: "vis-c3-mc-med-008",
      conceptId: "lstm-output-gate-tanh-scaling",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "multiple-choice",
      prompt: "LSTM에서 현재 은닉 상태 h_t = o * tanh(c_t) 계산 시 세포 상태 c_t에 tanh를 적용하는 목적은?",
      options: [
        "세포 상태의 수치를 무조건 양수로 고정함",
        "출력 은닉 상태의 차원을 2배로 확장함",
        "망각 게이트의 연산을 대체함",
        "누적되어 커질 수 있는 세포 상태 값의 범위를 -1과 1 사이로 압축 스케일링함"
      ],
      answer: 3,
      explanation: "덧셈으로 무한히 누적될 수 있는 세포 상태 c_t를 tanh를 이용해 -1~1 사이 범위로 압축 스케일링해 줍니다[cite: 7].",
      hint: "누적되어 커진 수치를 -1과 1 사이 범위로 스케일링 조절합니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-med-009",
      conceptId: "rnn-cell-weight-matrices-count",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "multiple-choice",
      prompt: "단순 RNN 셀 1개 내부에서 학습되는 필수 가중치 행렬 3가지의 입출력 관계 연결은?",
      options: [
        "W_xh(입력->은닉), W_hh(이전은닉->현재은닉), W_hy(은닉->출력)",
        "W_xx(입력->입력), W_hh(은닉->은닉), W_yy(출력->출력)",
        "W_q(쿼리), W_k(키), W_v(값)",
        "W_conv(합성곱), W_pool(풀링), W_fc(연결)"
      ],
      answer: 0,
      explanation: "RNN 셀은 입력변환 W_xh, 은닉순환 W_hh, 출력변환 W_hy 3개 행렬을 사용합니다[cite: 7].",
      hint: "입력-은닉, 은닉-은닉, 은닉-출력을 잇는 3가지 가중치입니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-med-010",
      conceptId: "vanilla-rnn-singular-value-issue",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "multiple-choice",
      prompt: "단순 RNN에서 선형 가중치 W의 특이값(Singular value) 수치와 기울기 변화의 관계로 옳은 것은?",
      options: [
        "특이값이 1보다 크면 기울기 소실, 1보다 작으면 기울기 폭발 발생",
        "특이값이 1보다 크면 기울기 폭발, 1보다 작으면 기울기 소실 발생",
        "특이값 수치는 기울기 변화와 완전히 무관함",
        "특이값이 0일 때 온전한 장기 학습이 수행됨"
      ],
      answer: 1,
      explanation: "역전파 시 W가 반복 곱해지므로 특이값이 1보다 크면 무한히 커지고(폭발), 1보다 작으면 0으로 수렴(소실)합니다[cite: 7].",
      hint: "특이값이 1보다 클 때와 작을 때 반복 곱셈의 결과를 생각해 보세요[cite: 7]."
    },
    {
      id: "vis-c3-mc-med-011",
      conceptId: "rnn-char-language-model-step",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "multiple-choice",
      prompt: "문자 단위 언어 모델(Char-level LM)에서 입력 문자 'h'가 들어왔을 때 RNN의 타임스텝별 처리 순서는?",
      options: [
        "다음 문자 확률 계산 -> 원핫 인코딩 -> 은닉 상태 삭제",
        "W_hy 출력변환 -> 원핫 인코딩 -> W_xh 입력변환",
        "원핫 인코딩 -> W_xh 입력변환 및 W_hh 이전은닉 결합 -> 은닉 상태 업데이트 -> W_hy 출력 및 다음 문자 확률 계산",
        "소프트맥스 계산 -> 입력 문자 삭제 -> 가중치 초기화"
      ],
      answer: 2,
      explanation: "입력문자 벡터화 -> 은닉상태 결합 업데이트 -> 출력층 변환 및 다음 문자 확률 계산 순서로 진행됩니다[cite: 7].",
      hint: "입력 문자 벡터화에서 시작하여 은닉 상태를 거쳐 다음 문자 확률을 내놓는 순서입니다[cite: 7]."
    },
    {
      id: "vis-c3-mc-med-012",
      conceptId: "one-to-many-captioning-structure",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "multiple-choice",
      prompt: "단일 이미지 벡터를 입력으로 받아 시퀀스 텍스트를 출력하는 이미지 캡셔닝(One-to-Many) 아키텍처의 기본 설명은?",
      options: [
        "매 시점마다 새로운 이미지를 입력받음",
        "은닉 상태를 전혀 사용하지 않음",
        "시퀀스 출력이 1개 단어로 제한됨",
        "하나의 단일 입력에서 시작하여 시간축에 따라 여러 출력을 연달아 생성함"
      ],
      answer: 3,
      explanation: "One-to-Many 구조는 하나의 단일 입력 이미지에서 출발하여 시간 축을 따라 시퀀스 출력을 연속 생성합니다[cite: 7].",
      hint: "단일(One) 입력으로부터 시작하여 여러(Many) 출력을 순차적으로 만듭니다[cite: 7]."
    },
    {
      id: "vis-c3-sa-med-013",
      conceptId: "rnn-states-sa-med",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "short-answer",
      prompt: "RNN에서 이전 타임스텝의 문맥을 담아 다음 타임스텝으로 넘겨주는 상태 벡터와, LSTM에서 오차 기울기를 덧셈 경로로 보존해 주는 모듈의 명칭을 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["은닉 상태, 셀 상태", "Hidden State, Cell State", "은닉상태, 셀상태", "hidden state, cell state"],
      explanation: "RNN의 은닉 상태(Hidden State)와 LSTM의 셀 상태(Cell State) 입니다[cite: 7].",
      hint: "RNN의 내 전달 상태와 LSTM의 장기 보존 모듈 명칭을 쓰세요[cite: 7]."
    },
    {
      id: "vis-c3-sa-med-014",
      conceptId: "lstm-three-gates-sa-med",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "short-answer",
      prompt: "LSTM에서 과거 정보 삭제 비율을 결정하는 게이트, 새 정보 기록 비율을 결정하는 게이트, 은닉 상태로 내보낼 비율을 결정하는 게이트의 명칭을 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["망각 게이트, 입력 게이트, 출력 게이트", "Forget Gate, Input Gate, Output Gate", "망각게이트, 입력게이트, 출력게이트"],
      explanation: "망각 게이트, 입력 게이트, 출력 게이트 입니다[cite: 7].",
      hint: "과거 삭제(망각), 새 정보 저장(입력), 내보내기(출력) 게이트 명칭을 순서대로 적으세요[cite: 7]."
    },
    {
      id: "vis-c3-es-med-015",
      conceptId: "rnn-vs-lstm-gradient-path-essay",
      difficulty: "medium",
      category: "CNN 한계 및 시퀀스/RNN 구조 추론",
      questionType: "essay",
      prompt: "단순 RNN과 비교하여 LSTM이 기울기 소실을 극복하는 이유를 역전파 전파 경로(선형 가중치 곱셈 vs 세포 상태 덧셈) 관점에서 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["가중치 곱셈", "세포 상태", "덧셈 경로", "기울기 보존"],
      modelAnswer: "단순 RNN은 역전파 시 은닉 상태를 따라 선형 가중치 W의 지속적인 곱셈 연산이 적용되어 기울기가 0으로 사라진다. 반면 LSTM은 세포 상태(c_t)라는 별도 모듈을 통해 가중치 곱셈이 아닌 덧셈 형태로 기울기가 전파되므로 장기적으로 기울기가 보존된다[cite: 7].",
      rubricKeywords: ["RNN 가중치 연속 곱셈", "LSTM 세포 상태 덧셈 전파 경로", "기울기 장기 보존"],
      minLength: 20,
      explanation: "RNN의 선형 가중치 연속 곱셈 오차 감소 문제와 LSTM 세포 상태 덧셈 전파 경로의 오차 보존 이점을 작성합니다[cite: 7].",
      hint: "RNN의 가중치 곱셈 경로와 LSTM 세포 상태의 덧셈 연산 경로를 비교해 쓰세요[cite: 7]."
    },

    // ==========================================
    // 카테고리 4: 어텐션 메커니즘 및 Q/K/V 연산 추론 (15문항)
    // ==========================================
    {
      id: "vis-c4-mc-med-001",
      conceptId: "attention-score-matrix-shape-calc",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "multiple-choice",
      prompt: "Query 행렬 Q가 (196 x 64) 차원이고, Key 행렬 K가 (196 x 64) 차원일 때(패치 수 196), Q K^T 연산으로 생성되는 어텐션 스코어 행렬의 크기는?",
      options: [
        "196x196",
        "64x64",
        "196x64",
        "64x196"
      ],
      answer: 0,
      explanation: "(196 x 64) 행렬과 전치된 K^T (64 x 196) 행렬을 곱하면 (196 x 196) 크기의 토큰 간 유사도 행렬이 됩니다[cite: 7].",
      hint: "Q 행렬과 전치된 K 행렬을 곱했을 때 생기는 행렬 차원을 계산해 보세요[cite: 7]."
    },
    {
      id: "vis-c4-mc-med-002",
      conceptId: "scaled-dot-product-output-shape",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "multiple-choice",
      prompt: "어텐션 가중치 확률 행렬(196x196)과 Value 행렬 V(196x64)를 곱해 나오는 최종 어텐션 출력 행렬의 크기는?",
      options: [
        "196x196",
        "196x64",
        "64x64",
        "64x196"
      ],
      answer: 1,
      explanation: "(196 x 196) 가중치 행렬과 (196 x 64) V 행렬을 곱하면 최종 출력은 입력과 동일한 (196 x 64) 차원이 됩니다[cite: 7].",
      hint: "가중치 행렬과 V 행렬 곱 연산의 최종 행렬 크기를 구하세요[cite: 7]."
    },
    {
      id: "vis-c4-mc-med-003",
      conceptId: "attention-scale-factor-value-calc",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "multiple-choice",
      prompt: "Key 벡터의 차원 d_k = 64 일 때, Scaled Dot-Product Attention 수식에서 내적 스코어를 나눠주는 스케일링 분모 sqrt(d_k) 수치는?",
      options: [
        "64",
        "16",
        "8",
        "32"
      ],
      answer: 2,
      explanation: "sqrt(d_k) = sqrt(64) = 8 이므로 내적 스코어를 8로 나누어 정규화합니다[cite: 7].",
      hint: "64의 제곱근 수치를 계산해 보세요[cite: 7]."
    },
    {
      id: "vis-c4-mc-med-004",
      conceptId: "cross-attention-qkv-source-inference",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "multiple-choice",
      prompt: "텍스트 조건으로 이미지를 생성하는 교차 어텐션(Cross-Attention)에서 Q, K, V의 출처 연결이 바르게 이루어진 것은?",
      options: [
        "Q, K, V 모두 생성 중인 이미지 패치",
        "Q, K, V 모두 조건 텍스트 단어 임베딩",
        "Q와 K는 텍스트 단어, V는 이미지 패치",
        "Q는 생성 중인 이미지 패치, K와 V는 조건 텍스트 단어 임베딩"
      ],
      answer: 3,
      explanation: "질문(Q)은 생성하려는 이미지 패치에서 내보내고, 참조할 색인(K)과 내용(V)은 텍스트 조건에서 가져옵니다[cite: 7].",
      hint: "어느 쪽이 질문자(Q)이고 어느 쪽이 참고지(K, V)인지 확인하세요[cite: 7]."
    },
    {
      id: "vis-c4-mc-med-005",
      conceptId: "self-attention-clustering-effect",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "multiple-choice",
      prompt: "이미지 패치들에 셀프 어텐션을 적용했을 때 어텐션 맵 상에서 관찰되는 비지도적 효과는?",
      options: [
        "유사한 역할/특징을 가진 패치들이 자연스럽게 하나의 클러스터 그룹으로 묶임",
        "모든 패치의 색상이 흑백으로 고정됨",
        "이미지 가로세로 해상도가 1x1로 축소됨",
        "위치 인코딩 벡터가 0으로 사라짐"
      ],
      answer: 0,
      explanation: "셀프 어텐션은 비슷한 특징을 가진 패치들끼리 높은 어텐션 가중치를 주고받아 클러스터링되는 효과를 냅니다[cite: 7].",
      hint: "비슷한 시각적 역할을 가진 패치들이 그룹으로 묶이는 현상입니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-med-006",
      conceptId: "attention-softmax-row-sum",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "multiple-choice",
      prompt: "어텐션 스코어 행렬에 Softmax를 적용하여 구한 어텐션 가중치 행렬 A의 각 행(Row) 합계 수치는?",
      options: [
        "0.5",
        "1.0",
        "64",
        "196"
      ],
      answer: 1,
      explanation: "Softmax는 각 Query(행)에 대해 전체 Key들에 부여하는 가중치 합을 1.0 확률 분포로 정규화합니다[cite: 7].",
      hint: "확률 정규화 함수를 거친 각 행의 합계 수치입니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-med-007",
      conceptId: "attention-complexity-quadratic-token",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "multiple-choice",
      prompt: "이미지 패치 개수가 2배(N -> 2N)로 늘어날 때, 셀프 어텐션의 Q K^T 연산량 및 메모리 사용량 증가 배율은?",
      options: [
        "2배",
        "8배",
        "4배",
        "16배"
      ],
      answer: 2,
      explanation: "셀프 어텐션의 연산 복잡도는 패치 수 N에 대해 O(N^2)이므로 패치가 2배 늘어나면 연산량은 2^2 = 4배 증가합니다[cite: 7].",
      hint: "패치 수 N에 대한 2차수 O(N^2) 복잡도를 적용해 보세요[cite: 7]."
    },
    {
      id: "vis-c4-mc-med-008",
      conceptId: "scaled-dot-product-scaling-reason",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "multiple-choice",
      prompt: "어텐션 연산 시 Query와 Key의 내적 값을 sqrt(d_k)로 나누어 스케일링해 주는 핵심 원리는?",
      options: [
        "소프트맥스 출력을 무조건 0으로 만듦",
        "이미지 해상도를 2배로 확장함",
        "가중치 파라미터 학습을 차단함",
        "내적값이 커질 때 소프트맥스 미분 기울기가 소실되는 현상을 방지함"
      ],
      answer: 3,
      explanation: "차원 d_k가 커지면 내적 분산이 커져 Softmax 출력이 뾰족해지고 기울기가 0으로 사라지므로 이를 방지하기 위해 나눕니다[cite: 7].",
      hint: "내적 스코어가 커짐에 따라 Softmax 단계에서 일어나는 기울기 소실 예방 목적입니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-med-009",
      conceptId: "self-attention-no-spatial-bias",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "multiple-choice",
      prompt: "셀프 어텐션 연산 수식 자체만으로는 패치 간의 위치/거리 정보를 구별하지 못하는 수학적 이유는?",
      options: [
        "Q와 K의 내적 연산은 순서 및 인접성과 무관하게 요소 간 값의 유사도만 계산하기 때문에",
        "소프트맥스 함수가 위치 수치를 무조건 삭제하기 때문에",
        "Value 행렬이 1차원 벡터이기 때문에",
        "스케일링 나눗셈 연산 때문에"
      ],
      answer: 0,
      explanation: "행렬 내적 Q K^T는 순서에 구애받지 않고 모든 요소 간 유사도만 구하므로 위치 인코딩 없이는 위치를 모릅니다[cite: 7].",
      hint: "내적 연산 자체에는 토큰의 공간적 위치 개념이 들어있지 않습니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-med-010",
      conceptId: "cross-attention-k-v-length",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "multiple-choice",
      prompt: "교차 어텐션에서 Key(K)와 Value(V) 행렬의 가로세로 크기(시퀀스 길이)를 결정하는 출처는?",
      options: [
        "질문자 Query 소스의 시퀀스 길이",
        "소프트맥스 레이어의 뉴런 수",
        "입력 이미지의 채널 수",
        "참조 대상이 되는 외부 입력 소스의 시퀀스 길이"
      ],
      answer: 3,
      explanation: "K와 V는 참조 대상 소스에서 오므로, K와 V의 행 길이는 참조 소스의 시퀀스 길이에 따라 결정됩니다[cite: 7].",
      hint: "K와 V 벡터가 공급되는 참조 소스 데이터의 길이입니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-med-011",
      conceptId: "scaled-dot-product-formula-check",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "multiple-choice",
      prompt: "어텐션 메커니즘에서 Q, K, V 행렬을 바탕으로 최종 가중합 출력을 얻는 올바른 연산 수식은?",
      options: [
        "softmax(Q + K) * V",
        "softmax(Q * K^T) + V",
        "softmax(Q * K^T / sqrt(d_k)) * V",
        "softmax(Q * K / d_k) - V"
      ],
      answer: 2,
      explanation: "Scaled Dot-Product Attention 수식은 softmax(Q K^T / sqrt(d_k)) V 입니다[cite: 7].",
      hint: "Q와 K전치 행렬을 곱해 스케일링한 후 소프트맥스를 취하고 V를 곱합니다[cite: 7]."
    },
    {
      id: "vis-c4-mc-med-012",
      conceptId: "self-attention-vs-cnn-receptive-field",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "multiple-choice",
      prompt: "국소 필터 중심인 CNN과 비교하여 셀프 어텐션 기반 이미지 처리가 갖는 수용 영역(Receptive Field) 상의 이점은?",
      options: [
        "CNN보다 가중치 파라미터 수가 항상 적음",
        "첫 어텐션부터 이미지 전체 영역의 전역 맥락을 직접 연결해 파악함",
        "해상도를 무조건 1x1로 감축함",
        "위치 인코딩 없이 공간 순서를 파악함"
      ],
      answer: 1,
      explanation: "셀프 어텐션은 국소 필터 단계적 확대 과정 없이 첫 레이어부터 이미지 모든 패치 간 상호작용으로 전역 맥락을 포착합니다[cite: 7].",
      hint: "레이어 초반부터 이미지 전체 전역 맥락을 직접 파악할 수 있습니다[cite: 7]."
    },
    {
      id: "vis-c4-sa-med-013",
      conceptId: "scaling-factor-and-matrix-dim-sa",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "short-answer",
      prompt: "Key 차원 d_k = 64 일 때 Scaled Dot-Product Attention의 스케일링 분모 sqrt(d_k) 수치와, 패치 개수 N=196 일 때 어텐션 가중치 행렬의 한 행(Row)의 Softmax 가중치 합계 수치를 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["8, 1", "8, 1.0", "8 1"],
      explanation: "스케일링 분모 sqrt(64) = 8 이며, Softmax를 거친 행의 가중치 합은 1.0 입니다[cite: 7].",
      hint: "64의 제곱근 수치와 Softmax 확률 정규화 합 수치를 차례로 적으세요[cite: 7]."
    },
    {
      id: "vis-c4-sa-med-014",
      conceptId: "qkv-symbol-sa",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "short-answer",
      prompt: "어텐션 3요소 중 질문의 주체가 되는 요소, 질문과 비교되는 특성 색인 요소, 실제 내보낼 정보 내용을 담은 요소의 영문 약자 3가지를 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Q, K, V", "Q,K,V", "Q K V", "q, k, v"],
      explanation: "Query(Q), Key(K), Value(V) 영문 약자입니다[cite: 7].",
      hint: "Q, K, V 세 글자를 순서대로 쓰세요[cite: 7]."
    },
    {
      id: "vis-c4-es-med-015",
      conceptId: "scaled-dot-product-matrix-derivation-essay",
      difficulty: "medium",
      category: "어텐션 메커니즘 및 Q/K/V 연산 추론",
      questionType: "essay",
      prompt: "Query 행렬 Q(N x d_k), Key 행렬 K(M x d_k), Value 행렬 V(M x d_v)가 주어졌을 때, Scaled Dot-Product Attention 수식을 적고 단계별 행렬 차원 변화 과정을 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["Q K^T", "N x M", "N x d_v", "Softmax"],
      modelAnswer: "1) 어텐션 수식은 softmax(Q K^T / sqrt(d_k)) V 이다. 2) Q(N x d_k)와 K^T(d_k x M)를 곱해 (N x M) 크기의 유사도 행렬을 만든다. 3) 여기에 Softmax를 취한 확률 행렬 (N x M)에 V(M x d_v)를 곱하여 최종 (N x d_v) 차원의 출력 행렬을 도출한다[cite: 7].",
      rubricKeywords: ["수식 softmax(Q K^T / sqrt(d_k)) V", "Q K^T -> (N x M)", "최종 출력 (N x d_v)"],
      minLength: 20,
      explanation: "Scaled Dot-Product 수식을 제시하고 (N x d_k) x (d_k x M) -> (N x M) x (M x d_v) -> (N x d_v) 의 차원 변화를 서술합니다[cite: 7].",
      hint: "어텐션 수식을 먼저 적고 각 행렬 곱 단계의 차원 변화를 적으세요[cite: 7]."
    },

    // ==========================================
    // 카테고리 5: Vision Transformer 및 변종 비교 (15문항)
    // ==========================================
    {
      id: "vis-c5-mc-med-001",
      conceptId: "vit-patch-count-calc",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "multiple-choice",
      prompt: "224x224 해상도의 RGB 이미지를 16x16 크기의 패치로 나눌 때 생성되는 패치 토큰의 총 개수는? (클래스 토큰 제외)",
      options: [
        "196개",
        "14개",
        "256개",
        "768개"
      ],
      answer: 0,
      explanation: "가로세로 각각 224 / 16 = 14개로 나뉘므로 총 패치 수 = 14 x 14 = 196 개입니다[cite: 7].",
      hint: "가로 패치 수(224/16)와 세로 패치 수(224/16)를 곱하세요[cite: 7]."
    },
    {
      id: "vis-c5-mc-med-002",
      conceptId: "vit-flattened-patch-dim-calc",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "multiple-choice",
      prompt: "16x16 크기의 RGB(3채널) 이미지 패치 1개를 1차원 벡터로 일렬로 펼쳤을 때 생성되는 벡터의 차원 수(D)는?",
      options: [
        "256",
        "768",
        "196",
        "512"
      ],
      answer: 1,
      explanation: "패치 벡터 크기는 16 x 16 x 3 = 768 차원이 됩니다[cite: 7].",
      hint: "16 x 16 x 3 연산 결과를 구하세요[cite: 7]."
    },
    {
      id: "vis-c5-mc-med-003",
      conceptId: "vit-position-encoding-addition-shape",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "multiple-choice",
      prompt: "ViT에서 패치 임베딩 행렬(197x768)에 위치 인코딩(Position Encoding) 행렬을 결합하는 올바른 연산 방식은?",
      options: [
        "위치 인코딩 행렬을 뒤쪽에 이어붙여 197x1536 으로 만듦",
        "위치 인코딩 행렬과 행렬 곱(MatMul)을 수행함",
        "동일 차원(197x768)의 위치 인코딩 행렬을 요소별 덧셈함",
        "위치 인코딩을 1차원 스칼라 1개로 곱함"
      ],
      answer: 2,
      explanation: "위치 인코딩은 패치 임베딩 벡터와 동일한 차원(197x768)으로 생성되어 요소별 덧셈으로 결합됩니다[cite: 7].",
      hint: "차원 확장 없이 동일 크기 행렬을 그대로 더해줍니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-med-004",
      conceptId: "vit-vs-resnet-pretraining-data-scale",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "multiple-choice",
      prompt: "ImageNet-1k(중소규모)와 JFT-300M(대규모) 사전학습 조건에 따른 ViT와 ResNet의 성능 비교 분석 결과는?",
      options: [
        "ImageNet-1k에서 ViT가 우수하고 JFT-300M에서는 ResNet이 우수함",
        "모든 데이터 규모에서 ResNet이 항상 압도함",
        "모든 데이터 규모에서 두 모델의 성능이 완벽히 동일함",
        "ImageNet-1k에서는 ResNet이 우수하지만, JFT-300M 대규모 사전학습 시에는 ViT가 ResNet을 능가함"
      ],
      answer: 3,
      explanation: "ViT는 이미지 귀납적 편향이 적어 중소규모 데이터엔 약하나, 거대 데이터(JFT-300M) 사전학습 시 ResNet을 뛰어넘습니다[cite: 7].",
      hint: "ViT는 대규모 데이터셋 사전학습 시 진가가 발현됩니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-med-005",
      conceptId: "deit-distillation-token-mechanism",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "multiple-choice",
      prompt: "DeiT(Data-efficient Image Transformers)가 선생님 CNN 모델의 지식을 배우기 위해 추가한 특수 토큰은?",
      options: [
        "증류 토큰 (Distillation Token)",
        "클래스 토큰 (CLS Token)",
        "위치 토큰 (Position Token)",
        "마스크 토큰 (Mask Token)"
      ],
      answer: 0,
      explanation: "DeiT는 기존 CLS 토큰 외에 증류 토큰(Distillation Token)을 추가하여 선생님 모델의 출력을 학습합니다[cite: 7].",
      hint: "선생님의 지식을 전수받기 위한 증류(Distillation) 전용 토큰입니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-med-006",
      conceptId: "swin-transformer-local-window",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "multiple-choice",
      prompt: "Swin Transformer가 전역 어텐션의 연산량을 줄이기 위해 1단계로 수행하는 핵심 작동 방식은?",
      options: [
        "이미지 전역에 어텐션을 직접 수행하지 않고, 지정된 윈도우 영역 내부 어텐션에만 집중함",
        "모든 이미지 패치를 1개의 픽셀로 강제 압축함",
        "위치 인코딩 벡터를 완전히 제거함",
        "모든 패치를 1차원 벡터로 일렬 전개함"
      ],
      answer: 0,
      explanation: "전역 어텐션의 높은 계산 비용을 피하기 위해 특정 윈도우 내부에서만 어텐션을 수행합니다[cite: 7].",
      hint: "윈도우(Window) 영역을 지정해 내부 어텐션만 먼저 수행합니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-med-007",
      conceptId: "swin-shifted-window-cross-info",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "multiple-choice",
      prompt: "Swin Transformer에서 윈도우 간의 정보 교류가 불가능한 한계를 극복하기 위해 다음 층에서 적용하는 기술은?",
      options: [
        "모든 윈도우를 삭제하고 글로벌 어텐션으로 변경함",
        "윈도우 영역을 비껴가게(Shifted) 한번 더 설정하여 중첩시킴",
        "채널 수를 1개로 줄여 연산함",
        "1x1 합성곱만 연속으로 적용함"
      ],
      answer: 1,
      explanation: "윈도우 위치를 비껴 설정(Shifted Window)하여 윈도우 경계선 너머의 정보들을 결합합니다[cite: 7].",
      hint: "윈도우 위치를 비껴서(Shifted) 재배치해 줍니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-med-008",
      conceptId: "dinov2-self-supervised-learning",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "multiple-choice",
      prompt: "메타의 DINOv2가 라벨이 없는 14억 장의 웹 이미지로 백본을 사전학습시킬 때 사용한 학습 방식은?",
      options: [
        "100% 수작업 지도 학습",
        "강화 학습 (RLHF)",
        "규칙 기반 프롬프팅",
        "자기지도 학습 (Self-Supervised Learning)"
      ],
      answer: 3,
      explanation: "DINOv2는 정답 라벨 없는 대규모 이미지로부터 대조학습 기반 자기지도 학습을 수행합니다[cite: 7].",
      hint: "라벨 없이 스스로 감독하는 자기지도 학습 방식입니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-med-009",
      conceptId: "vit-inductive-bias-lacking",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "multiple-choice",
      prompt: "CNN과 비교했을 때 ViT가 '이미지 공간 고유의 귀납적 편향(Inductive Bias)'이 적다는 것의 의미는?",
      options: [
        "위치 인코딩이 불가능하다는 뜻임",
        "이미지 데이터를 처리할 수 없다는 뜻임",
        "지역적 인접성이나 평행이동성이 구조적으로 고정되어 있지 않아 대규모 데이터로부터 직접 배워야 함",
        "가중치 파라미터가 0이라는 뜻임"
      ],
      answer: 2,
      explanation: "CNN은 국소 연결/평행이동 불변성 구조가 고정되어 있으나, ViT는 고정된 공간 편향이 적어 데이터로부터 직접 배워야 합니다[cite: 7].",
      hint: "공간 인접성 고정 구조가 적어 데이터로부터 직접 배워야 함을 뜻합니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-med-010",
      conceptId: "learnable-position-encoding-limitation",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "multiple-choice",
      prompt: "학습 가능한 위치 인코딩(Learnable Position Encoding)이 가진 한계점으로 올바른 것은?",
      options: [
        "데이터 오버피팅이 무조건 발생함",
        "어텐션 연산 속도가 100배 늘어남",
        "채널 깊이를 0으로 차단함",
        "입력 이미지의 해상도가 달라지면 패치 수가 달라져 위치 인코딩을 재학습해야 함"
      ],
      answer: 3,
      explanation: "고정된 패치 위치 수에 맞춰 학습되므로 이미지 해상도가 변경되면 패치 수 불일치로 재학습이 필요합니다[cite: 7].",
      hint: "해상도 변경 시 패치 위치 수가 달라져 재학습이 요구되는 한계입니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-med-011",
      conceptId: "vit-cls-token-purpose",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "multiple-choice",
      prompt: "ViT에서 분할된 패치 토큰들 맨 앞에 학습 가능한 특수 클래스 토큰([CLS])을 추가하는 목적은?",
      options: [
        "모든 패치들의 어텐션 정보를 모아 이미지 전체를 대표하는 최종 분류 벡터로 사용하기 위해",
        "이미지 해상도를 2배로 확장하기 위해",
        "위치 인코딩 연산을 대리 수행하기 위해",
        "모든 패치 토큰을 지우기 위해"
      ],
      answer: 0,
      explanation: "모든 패치와 셀프 어텐션하며 전역 정보를 모은 [CLS] 토큰 출력이 최종 분류 헤드의 입력이 됩니다[cite: 7].",
      hint: "이미지 전체의 전역 대표 정보를 모아 분류 입력으로 사용합니다[cite: 7]."
    },
    {
      id: "vis-c5-mc-med-012",
      conceptId: "deit-teacher-model-cnn",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "multiple-choice",
      prompt: "DeiT 지식 증류 학습 시 선생님(Teacher) 모델로 CNN(RegNet 등)을 활용했을 때 얻은 이점은?",
      options: [
        "학생 ViT의 패치 크기가 1x1로 감소함",
        "선생님 CNN이 가진 이미지 특화 귀납적 편향 지식을 학생 ViT가 전수받음",
        "학생 ViT의 파라미터가 0이 됨",
        "사전학습 속도가 1초로 단축됨"
      ],
      answer: 1,
      explanation: "CNN 선생님의 공간 구조 귀납적 편향 지식을 학생 ViT가 전수받아 소규모 데이터에서도 잘 학습됩니다[cite: 7].",
      hint: "CNN이 가진 이미지 특화 공간 구조 지식을 학생 ViT에 전달합니다[cite: 7]."
    },
    {
      id: "vis-c5-sa-med-013",
      conceptId: "patch-count-and-dim-sa",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "short-answer",
      prompt: "224x224 RGB 이미지를 16x16 패치로 나눌 때 생성되는 패치 토큰 개수(CLS 제외)와, 각 16x16x3 패치를 1차원으로 펼친 벡터 차원 수(D)를 순서대로 적으시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["196, 768", "196,768", "196 768"],
      explanation: "패치 개수는 (224/16)x(224/16) = 196 개이며, 벡터 차원은 16x16x3 = 768 차원입니다[cite: 7].",
      hint: "14x14 연산 수치와 16x16x3 연산 수치를 순서대로 적으세요[cite: 7]."
    },
    {
      id: "vis-c5-sa-med-014",
      conceptId: "shifted-window-sa-med",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "short-answer",
      prompt: "Swin Transformer에서 윈도우 경계선 너머의 정보 교류를 위해 윈도우 위치를 비껴 재배치하는 기법 명칭은?",
      options: [],
      answer: null,
      acceptedAnswers: ["쉬프티드 윈도우", "쉬프티드윈도우", "Shifted Window", "shifted window"],
      explanation: "Shifted Window(쉬프티드 윈도우) 기법입니다[cite: 7].",
      hint: "위치를 비껴서(Shifted) 재배치하는 윈도우 기법입니다[cite: 7]."
    },
    {
      id: "vis-c5-es-med-015",
      conceptId: "vit-token-and-position-essay",
      difficulty: "medium",
      category: "Vision Transformer 및 변종 비교",
      questionType: "essay",
      prompt: "224x224x3 입력 이미지가 패치 크기 16x16 일 때 ViT의 입력 토큰 행렬(197x768)로 변환되는 계산 과정과, 여기에 위치 인코딩을 결합해야 하는 이유를 서술하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["196개 패치", "768 차원", "CLS 토큰", "위치 인코딩"],
      modelAnswer: "1) 224x224 이미지는 16x16 패치 196개로 분할되며, 각 패치(16x16x3)는 768차원 벡터로 펼쳐진다. 여기에 1개의 CLS 토큰이 추가되어 197x768 토큰 행렬이 된다. 2) 셀프 어텐션 자체는 패치 간 공간 위치를 구별하지 못하므로, 각 패치의 위치 정보를 제공하기 위해 동일 차원의 위치 인코딩을 더해 주어야 한다[cite: 7].",
      rubricKeywords: ["196개 패치 + 1개 CLS 토큰 = 197", "16x16x3 = 768 차원", "셀프 어텐션 위치 무지 및 위치 인코딩 필요성"],
      minLength: 20,
      explanation: "패치 수(196) + CLS 토큰(1) = 197 및 패치 차원(768) 도출 과정과 위치 인코딩 주입 목적을 작성합니다[cite: 7].",
      hint: "패치 개수 계산, 벡터 펼침 차원, CLS 토큰 추가 과정 및 위치 인코딩의 위치 정보 주입 필요성을 기술하세요[cite: 7]."
    }
  ]
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
