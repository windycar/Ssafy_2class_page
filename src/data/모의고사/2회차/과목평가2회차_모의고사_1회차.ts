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

export const SSAFY_AI_MOCK_EXAM_30Q: StudyQuestion[] = [
  // =========================================================================
  // [PART 1: 객관식 24문항] (정답 0, 1, 2, 3번 각 6개씩 25% 균등 분산)
  // =========================================================================

  // --- [머신러닝 기초 및 방법론] (Q1 ~ Q4) ---
  {
    id: "exam-mc-001",
    conceptId: "bias-variance-decomposition",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "모형 가정 Y = f*(X) + e 에서 모델 예측치의 기대 테스트 오차를 분해했을 때, 모델 학습과 구조 개선을 통해 줄일 수 있는 오차(Reducible Error)의 구성 항목은?",
    options: [
      "모델의 편향 제곱과 모델 분산의 합",
      "데이터 수집 과정에서 유입된 측정 오차 e의 분산",
      "학습 데이터셋 전체 표본 샘플 수의 역수",
      "가설 공간 내 존재하는 전체 후보 함수의 개수"
    ],
    answer: 0,
    explanation: "기대 예측 오차는 모델 개선으로 줄일 수 있는 '편향 제곱 + 분산'과 데이터 자체의 노이즈인 '줄일 수 없는 오차(e의 분산)'로 분해됩니다.",
    hint: "모델의 체계적 오차(편향)와 표본 변동에 따른 오차(분산)의 결합을 떠올려 보세요."
  },
  {
    id: "exam-mc-002",
    conceptId: "r2-score-interpretation",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "선형 회귀 모델의 결정계수 R^2 = 1 - (SS_res / SS_tot) 계산 결과가 0.85로 도출되었을 때의 통계적 의미로 올바른 것은?",
    options: [
      "모든 데이터 샘플의 잔차 오차가 0.85 이하로 보장됨",
      "목표 변수 Y의 전체 변동량 중 약 85%를 해당 회귀 모델이 설명해 냄",
      "독립 변수 X와 종속 변수 Y의 상관계수 수치가 정확히 0.85임",
      "학습 데이터 중 15%가 이상치로 판정되어 모델에서 제외됨"
    ],
    answer: 1,
    explanation: "결정계수 R^2은 전체 변동량(SS_tot) 대비 회귀 모델이 설명해 낸 분산 변동의 상대적 비율을 나타냅니다.",
    hint: "전체 데이터 변동 중 모델이 설명해 낸 비율(%)의 관점에서 해석하세요."
  },
  {
    id: "exam-mc-003",
    conceptId: "ols-normal-equation-invertibility",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "다중선형회귀에서 최소제곱 추정량 공식 beta = (X^T X)^(-1) X^T y 가 유일한 역행렬 해로 도출되기 위한 필수 수학적 조건은?",
    options: [
      "피처의 개수 p가 데이터 샘플 수 n보다 훨씬 커야 함",
      "모든 독립 변수가 범주형 데이터로만 구성되어야 함",
      "행렬 X^T X의 역행렬이 존재해야 하며, 독립 변수 간에 완전한 다중공선성이 없어야 함",
      "오차항의 분산이 무한대로 발산해야 함"
    ],
    answer: 2,
    explanation: "정규방정식의 역행렬 (X^T X)^(-1)이 존재하려면 피처 행렬의 열들이 선형 독립이어야 하며 다중공선성이 없어야 합니다.",
    hint: "행렬의 역행렬 존재 조건 및 설명변수 간의 독립성을 떠올려 보세요."
  },
  {
    id: "exam-mc-004",
    conceptId: "confusion-matrix-recall-importance",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "multiple-choice",
    prompt: "질병 진단 시스템처럼 실제 양성 환자를 정상으로 잘못 판단하는 제2종 오류(False Negative)가 치명적인 분야에서 가장 우선적으로 높여야 하는 지표는?",
    options: [
      "특이도 (Specificity)",
      "정밀도 (Precision)",
      "평균 제곱 오차 (MSE)",
      "재현율 (Recall / Sensitivity)"
    ],
    answer: 3,
    explanation: "실제 양성 환자 중 모델이 놓치지 않고 잡아낸 비율인 재현율(Recall = TP / (TP + FN))을 높여야 미진단(FN)을 최소화할 수 있습니다.",
    hint: "실제 양성 전체 중에서 모델이 검출해 낸 비율을 뜻하는 지표입니다."
  },

  // --- [자연어 처리 및 시퀀스/어텐션 모델] (Q5 ~ Q10) ---
  {
    id: "exam-mc-005",
    conceptId: "word2vec-sgns-efficiency",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "Word2Vec의 Skip-gram 모델에 Negative Sampling(SGNS)을 적용했을 때 Softmax 대비 연산 속도가 대폭 향상되는 원리는?",
    options: [
      "전체 어휘 사전 V에 대한 분모 합산 연산 대신, 참 단어 1개와 k개의 오답 단어만 추출해 시그모이드 이진 분류 문제로 단순화하므로",
      "단어 임베딩 벡터의 모든 원소를 1비트 정수로 압축하기 때문에",
      "문맥 윈도우 크기를 0으로 줄여 주변 단어 연산을 생략하기 때문에",
      "텍스트 데이터를 2차원 이미지 픽셀 행렬로 변환해 처리하므로"
    ],
    answer: 0,
    explanation: "SGNS는 O(V)의 무거운 Softmax 분모 계산을 O(k)의 k개 음성 샘플 이진 분류로 근사하여 연산량을 대폭 줄입니다.",
    hint: "전체 어휘에 대한 확률 계산을 소수의 샘플 대상 이진 분류로 치환합니다."
  },
  {
    id: "exam-mc-006",
    conceptId: "lstm-additive-highway-math",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "LSTM이 단순 RNN의 고질적인 기울기 소실(Vanishing Gradient) 문제를 구조적으로 완화하는 원리는?",
    options: [
      "모든 게이트의 활성화 함수를 평균 풀링으로 대체했기 때문에",
      "Cell State의 덧셈 기반 정보 전달 경로와 게이트 구조를 통해 장기 의존성 학습 시 기울기 소실을 완화하므로",
      "은닉 상태 벡터의 차원을 타임스텝마다 2배로 증폭시키므로",
      "출력층에서 소프트맥스 함수를 완전히 제거하고 선형 회귀만 수행하므로"
    ],
    answer: 1,
    explanation: "LSTM은 Cell State의 덧셈 기반 전달 경로와 게이트 구조를 통해 단순 RNN보다 장기 정보와 기울기가 안정적으로 전달되도록 하여 기울기 소실 문제를 완화합니다.",
    hint: "Cell State를 통한 정보 전달 경로와 게이트의 역할을 떠올려 보세요."
  },
  {
    id: "exam-mc-007",
    conceptId: "self-attention-tensor-shape-code",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "다음 PyTorch 코드에서 실행되는 텐서 연산 결과 context의 형상(Shape)으로 올바른 것은?",
    code: "import torch\nimport torch.nn.functional as F\n\n# Q, K, V: (Batch=2, Heads=4, Seq_len=8, Head_dim=64)\nQ = torch.randn(2, 4, 8, 64)\nK = torch.randn(2, 4, 8, 64)\nV = torch.randn(2, 4, 8, 64)\nscores = torch.matmul(Q, K.transpose(-2, -1)) / 8.0\nattn_weights = F.softmax(scores, dim=-1)\ncontext = torch.matmul(attn_weights, V)",
    options: [
      "(2, 4, 8, 8)",
      "(2, 4, 64, 64)",
      "(2, 4, 8, 64)",
      "(2, 4, 64, 8)"
    ],
    answer: 2,
    explanation: "attn_weights (2, 4, 8, 8)와 V (2, 4, 8, 64)의 행렬 곱이므로 context의 최종 형상은 (2, 4, 8, 64)가 됩니다.",
    hint: "가중치 행렬 (Seq_len x Seq_len)과 Value 행렬 (Seq_len x Head_dim)의 곱입니다."
  },
  {
    id: "exam-mc-008",
    conceptId: "scaled-dot-product-scaling-reason",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "트랜스포머의 Scaled Dot-Product Attention 수식에서 Q와 K의 내적 스코어를 sqrt(d_k)로 나누어주는 주된 이유는?",
    options: [
      "어텐션 가중치 행렬의 모든 값을 1로 통일하기 위함",
      "행렬의 가로세로 차원을 절반으로 축소하기 위함",
      "위치 인코딩 벡터를 자동으로 생성하여 주입하기 위함",
      "차원 d_k가 커짐에 따라 내적값이 커져 Softmax 출력이 지나치게 극단화되고 기울기가 작아지는 현상을 완화하기 위함"
    ],
    answer: 3,
    explanation: "차원 d_k가 커질수록 Q와 K의 내적값 분산도 커질 수 있습니다. 이 값이 지나치게 커지면 Softmax 분포가 매우 뾰족해져 기울기가 작아지고 학습이 불안정해질 수 있으므로 sqrt(d_k)로 나누어 스케일을 조절합니다.",
    hint: "내적값이 커질 때 Softmax 단계에서 발생하는 기울기 소실 예방 목적입니다."
  },
  {
    id: "exam-mc-009",
    conceptId: "chinchilla-optimal-scaling-law",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "DeepMind의 Chinchilla 연구가 규명한 연산 최적(Compute-Optimal) LLM 학습 법칙의 핵심 결론은?",
    options: [
      "고정된 컴퓨팅 예산에서 모델 파라미터 수만 키우기보다 모델 크기와 학습 데이터 토큰 수를 균형 있게 함께 확장해야 함",
      "모델 파라미터 수만 극대화하고 학습 토큰 수는 최소화해야 함",
      "학습 토큰 수만 늘리고 모델 파라미터는 1B 이하로 고정해야 함",
      "모델의 손실값(Loss)은 파라미터 크기나 데이터양과 무관함"
    ],
    answer: 0,
    explanation: "Chinchilla 법칙은 고정된 연산 자원 조건에서 모델 파라미터 크기와 학습 토큰 수를 균형 있게 함께 확장해야 최적의 성능을 달성함을 규명했습니다.",
    hint: "모델 파라미터 크기와 학습 데이터 규모를 균형 있게 확장하는 원리입니다."
  },
  {
    id: "exam-mc-010",
    conceptId: "dpo-direct-preference-optimization",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "multiple-choice",
    prompt: "DPO(Direct Preference Optimization)가 기존 PPO 기반 RLHF 파이프라인 대비 갖는 가장 큰 구조적 이점은?",
    options: [
      "인간 선호도 비교 데이터셋이 전혀 필요 없음",
      "별도의 복잡한 보상 모델 학습 및 PPO 강화학습 루프 없이, 선호 데이터셋으로 직접 분류 손실을 통해 정책을 최적화함",
      "역전파 미분 계산을 완전히 생략하고 텍스트를 생성함",
      "오직 1개의 단어만 출력하도록 제한하여 환각을 없앰"
    ],
    answer: 1,
    explanation: "DPO는 최적 보상 함수를 수학적으로 치환하여, 별도 보상 모델과 PPO 루프 없이 표준 분류 손실로 안정적인 직접 최적화를 수행합니다.",
    hint: "별도의 보상 모델과 복잡한 강화학습 루프를 거치지 않고 직접 최적화합니다."
  },

  // --- [CNN 및 대표 비전 모델] (Q11 ~ Q16) ---
  {
    id: "exam-mc-011",
    conceptId: "alexnet-conv1-size-calc",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "입력 해상도 W=227, 커널 크기 K=11, 패딩 P=0, 스트라이드 S=4 일 때, 합성곱 연산 후 생성되는 출력 특징 맵의 가로세로 해상도는?",
    options: [
      "28x28",
      "56x56",
      "55x55",
      "57x57"
    ],
    answer: 2,
    explanation: "공식 W' = (W - K + 2P)/S + 1 에 대입하면 (227 - 11 + 0)/4 + 1 = 55 가 됩니다.",
    hint: "(입력크기 - 커널크기 + 2*패딩)/스트라이드 + 1 공식을 적용해 보세요."
  },
  {
    id: "exam-mc-012",
    conceptId: "vggnet-3x3-stack-receptive-param-calc",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "동일한 7x7 수용 영역(Receptive Field)을 확보할 때, 7x7 필터 1개를 사용하는 것 대비 3x3 필터 3개를 중첩하여 사용할 때의 파라미터 수 비교 결과는? (입출력 채널 C로 동일)",
    options: [
      "두 방식의 파라미터 수가 수학적으로 완벽히 동일함",
      "3x3 중첩 방식의 파라미터가 2배 더 많아짐",
      "7x7 1개 방식이 연산량과 파라미터를 50% 절감함",
      "7x7 1개는 49 C^2 이고, 3x3 3개는 27 C^2 이므로 3x3 중첩 방식이 파라미터를 약 45% 절감함"
    ],
    answer: 3,
    explanation: "7x7 1개 면적(49) 대비 3x3 세 번 중첩 면적(9x3=27)이므로 가중치 파라미터 수가 약 44.9% 감소합니다.",
    hint: "커널 가로세로 면적의 합(49 대 27)을 비교해 보세요."
  },
  {
    id: "exam-mc-013",
    conceptId: "resnet-skip-connection-projection",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "ResNet 잔차 블록 H(x) = F(x) + x 에서, 레이어 F(x)를 거치며 채널 수가 증가하여 입력 x와 차원이 불일치할 때 지름길 통로(Skip Connection)에 적용하는 해결책은?",
    options: [
      "지름길 통로에 1x1 합성곱을 적용하여 x의 채널 차원을 F(x)와 동일하게 투영(Projection)해 줌",
      "서브레이어 F(x)의 가중치를 영 행렬로 초기화함",
      "지름길 연결을 끊어버리고 일반 평탄 네트워크로 전환함",
      "입력 x의 가로세로 해상도를 2배로 확장함"
    ],
    answer: 0,
    explanation: "차원이 맞지 않을 때는 지름길 연결 상에 1x1 Conv(Projection Shortcut)를 적용해 채널 수를 맞춰준 후 덧셈합니다.",
    hint: "지름길 통로에서 가로세로는 유지한 채 깊이(채널) 차원만 변경하는 연산을 가합니다."
  },
  {
    id: "exam-mc-014",
    conceptId: "mobilenet-depthwise-separable-ratio-formula",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "표준 합성곱 연산량 대비 MobileNet의 Depthwise Separable 합성곱 연산량 비율을 나타내는 올바른 수식은? (N: 출력 채널 수, D_K: 커널 크기)",
    options: [
      "N / (D_K^2)",
      "1/N + 1/(D_K^2)",
      "1 / (N * D_K)",
      "(D_K^2) / N"
    ],
    answer: 1,
    explanation: "표준 대비 가분 합성곱 연산량 비율은 1/N + 1/(D_K^2) 이며, D_K=3일 때 연산량이 약 1/8~1/9 수준으로 대폭 감소합니다.",
    hint: "출력 채널 수의 역수와 커널 면적의 역수 합으로 이루어진 비율 수식입니다."
  },
  {
    id: "exam-mc-015",
    conceptId: "plain-net-degradation-phenomenon",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "ResNet 논문에서 지름길 연결이 없는 일반 평탄 네트워크(Plain Net)의 층을 20층에서 56층으로 깊게 쌓았을 때 관찰된 '열화(Degradation)' 현상은?",
    options: [
      "훈련 오차는 0이 되었으나 테스트 오차만 과적합으로 급증함",
      "가중치 파라미터가 0개로 축소되어 연산이 중단됨",
      "과적합 때문이 아닌데도 깊은 네트워크의 훈련 오차가 얕은 네트워크보다 오히려 더 커지는 최적화 난항 현상",
      "모든 활성화 맵의 채널 수가 흑백으로 강제 변환됨"
    ],
    answer: 2,
    explanation: "Plain Net은 과적합에 의한 것이 아님에도 신경망이 깊어질 때 훈련 오차 자체가 오히려 악화되는 열화 문제를 겪습니다.",
    hint: "과적합이 아님에도 층이 깊어질 때 훈련 오차가 커지는 현상입니다."
  },
  {
    id: "exam-mc-016",
    conceptId: "mobilenet-depthwise-channel-independence",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "multiple-choice",
    prompt: "입력 채널이 64개일 때 MobileNet의 Depthwise Convolution(3x3 커널)을 통과한 출력 특징 맵의 채널 수는?",
    options: [
      "192개",
      "16개",
      "1개",
      "64개"
    ],
    answer: 3,
    explanation: "Depthwise Conv는 채널을 섞지 않고 각 입력 채널마다 1개씩의 공간 필터만 독립 적용하므로 출력 채널 수는 입력과 동일한 64개입니다.",
    hint: "깊이별(Depthwise) 연산은 채널을 합치지 않고 채널별로 각각 독립 적용됩니다."
  },

  // --- [시각-언어 모델(VLM) 및 멀티모달 정합] (Q17 ~ Q20) ---
  {
    id: "exam-mc-017",
    conceptId: "clip-similarity-matrix-diagonal",
    difficulty: "medium",
    category: "시각-언어 모델(VLM) 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "N개의 이미지와 N개의 텍스트로 구성된 배치에서 CLIP 대조학습 수행 시 N x N 코사인 유사도 행렬의 주대각선 원소들이 갖는 의미는?",
    options: [
      "실제 일치하는 정답 양성(Positive) 페어들의 유사도이며, 이 값들이 최대화되도록 학습됨",
      "일치하지 않는 오답 음성(Negative) 페어들의 유사도",
      "이미지 인코더의 패딩 영역 비율",
      "소프트맥스 함수의 미분 오차값"
    ],
    answer: 0,
    explanation: "동일 인덱스 i를 공유하는 (이미지 i, 텍스트 i) 쌍이 올바른 매칭이므로 주대각선 N개 양성 페어의 유사도를 최대화하도록 학습합니다.",
    hint: "이미지 인덱스와 텍스트 인덱스가 일치하는 대각선 상의 올바른 짝입니다."
  },
  {
    id: "exam-mc-018",
    conceptId: "clip-code-dim-analysis",
    difficulty: "medium",
    category: "시각-언어 모델(VLM) 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "다음 PyTorch 코드에서 실행되는 Zero-shot 분류 연산 시, C개의 텍스트 카테고리 중 가장 확률이 높은 클래스를 예측하기 위해 적용해야 하는 Softmax의 올바른 차원 축(dim)은?",
    code: "# image_embeds: (1, 512), text_embeds: (C, 512)\nlogits = image_embeds @ text_embeds.T  # Shape: (1, C)\nprobs = F.softmax(logits, dim=?)",
    options: [
      "dim = 0",
      "dim = 1 (또는 dim = -1)",
      "dim = 512",
      "차원 지정 없이 전체 행렬에 적용"
    ],
    answer: 1,
    explanation: "단일 이미지에 대해 C개의 텍스트 클래스 후보들 간의 확률 분포를 구해야 하므로 클래스 차원인 dim=1(또는 dim=-1)에 대해 소프트맥스를 적용합니다.",
    hint: "후보 카테고리 개수 C가 위치한 열 방향 축을 따라 소프트맥스를 계산합니다."
  },
  {
    id: "exam-mc-019",
    conceptId: "siglip-distributed-efficiency",
    difficulty: "medium",
    category: "시각-언어 모델(VLM) 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "구글의 SigLIP이 기존 CLIP의 Softmax 대조 손실 대비 대규모 GPU 분산 학습에서 통신 효율이 뛰어난 수학적 원리는?",
    options: [
      "모든 모달리티의 가중치를 0으로 초기화하기 때문에",
      "텍스트 인코더를 완전히 제거했기 때문에",
      "전체 배치에 대한 Softmax 전역 정규화가 필요하지 않고 개별 이미지-텍스트 쌍에 독립적인 Sigmoid 손실을 적용할 수 있어 분산 학습의 통신 부담을 줄일 수 있으므로",
      "이미지 해상도를 무조건 10x10으로 압축하므로"
    ],
    answer: 2,
    explanation: "SigLIP은 전체 배치에 대한 Softmax 전역 정규화 대신 개별 이미지-텍스트 쌍에 Sigmoid 손실을 적용하므로 대규모 분산 학습에서 통신 오버헤드를 줄일 수 있습니다.",
    hint: "전체 배치의 지수합을 구하는 전역 정규화 과정의 유무를 비교해 보세요."
  },
  {
    id: "exam-mc-020",
    conceptId: "imagebind-six-modalities-anchor",
    difficulty: "medium",
    category: "시각-언어 모델(VLM) 및 멀티모달 정합",
    questionType: "multiple-choice",
    prompt: "메타의 ImageBind가 이미지, 텍스트, 오디오, 깊이, 열화상, IMU 6개 모달리티를 단일 공간에 묶을 때 중심 매개체로 활용한 모달리티는?",
    options: [
      "오디오 소리 데이터",
      "IMU 모션 센서 데이터",
      "텍스트 단어 임베딩",
      "이미지 및 비디오 (시각 데이터)"
    ],
    answer: 3,
    explanation: "ImageBind는 모든 센서 데이터와 자연스러운 짝을 맺을 수 있는 이미지/비디오를 중심 축(Anchor)으로 삼아 공통 정합을 달성했습니다.",
    hint: "모든 모달리티와 자연스러운 쌍을 맺을 수 있는 시각 중심 모달리티입니다."
  },

  // --- [VLM 및 비전 파운데이션 모델] (Q21 ~ Q24) ---
  {
    id: "exam-mc-021",
    conceptId: "llava-two-step-training-freeze-details",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "LLaVA의 2단계 학습 파이프라인에서 Step 1(사전학습)과 Step 2(파인튜닝)의 모듈 학습/동결(Freeze) 구분을 바르게 설명한 것은?",
    options: [
      "Step 1: 선형 프로젝션 레이어(W)만 학습(비전/LLM 동결) / Step 2: 프로젝션 레이어와 LLM을 함께 미세조정(비전 동결)",
      "Step 1: 전체 모듈 학습 / Step 2: 전체 모듈 동결",
      "Step 1: 비전 인코더만 학습 / Step 2: 언어 모델만 학습",
      "Step 1: LLM만 학습 / Step 2: 프로젝션 레이어만 학습"
    ],
    answer: 0,
    explanation: "Step 1에서는 시각-언어 개념 정렬을 위해 프로젝션 W만 학습하고, Step 2에서는 대화 역량을 위해 W와 LLM을 함께 미세조정합니다.",
    hint: "1단계는 중간 연결층만 학습시키고, 2단계는 연결층과 거대 언어 모델을 함께 학습시킵니다."
  },
  {
    id: "exam-mc-022",
    conceptId: "qwen2-vl-mrope-axes",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "Qwen2-VL이 1D 텍스트, 2D 이미지, 3D 비디오 위치를 통합 모델링하기 위해 사용하는 M-ROPE의 3차원 위치 성분 축은?",
    options: [
      "밝기, 채도, 명도",
      "시간(Time), 높이(Height), 너비(Width)",
      "스트라이드, 패딩, 커널",
      "쿼리, 키, 값"
    ],
    answer: 1,
    explanation: "M-ROPE는 동영상의 시간 축(T)과 이미지의 높이(H), 너비(W) 공간 축 3가지를 튜플로 정의해 위치를 회전 인코딩합니다.",
    hint: "동영상의 시간 축과 2차원 이미지의 가로세로 공간 축 조합입니다."
  },
  {
    id: "exam-mc-023",
    conceptId: "grounded-sam-pipeline-workflow",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
    questionType: "multiple-choice",
    prompt: "자연어 텍스트 지시문으로 임의의 객체를 찾고 정밀 픽셀 단위 마스크까지 얻기 위해 결합하는 Grounded-SAM 파이프라인의 작업 흐름은?",
    options: [
      "SAM이 마스크 생성 → 마스크를 텍스트로 변환 → Grounding DINO가 삭제",
      "이미지 픽셀 흑백화 → 플랫튼 연산 → 소프트맥스 분류",
      "사용자가 텍스트 프롬프트 입력 → Grounding DINO가 바운딩 박스 탐지 → SAM이 해당 박스를 프롬프트로 받아 정밀 마스크 생성",
      "음성 신호 입력 → 오디오 인코딩 → 3D 메쉬 생성"
    ],
    answer: 2,
    explanation: "텍스트 지시를 받아 Grounding DINO가 박스를 찾고, 이 박스를 SAM의 프롬프트로 넘겨 정밀 분할 마스크를 자동 추출합니다.",
    hint: "텍스트 기반 박스 탐지기(DINO)와 프롬프트 기반 정밀 분할기(SAM)의 순차적 연결입니다."
  },
  {
    id: "exam-mc-024",
    conceptId: "sapiens-four-tasks-official",
    difficulty: "medium",
    category: "VLM 및 비전 파운데이션 모델",
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

  // =========================================================================
  // [PART 2: 단답형 4문항] (복합 수치/개념 요구)
  // =========================================================================
  {
    id: "exam-sa-025",
    conceptId: "f1-and-mse-terms-sa",
    difficulty: "medium",
    category: "머신러닝 기초 및 방법론",
    questionType: "short-answer",
    prompt: "분류 평가에서 정밀도(Precision)와 재현율(Recall)의 불균형을 보정하기 위해 사용하는 조화평균 지표 명칭과, 회귀에서 오차 제곱의 평균을 나타내는 지표 약자를 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["F1-score, MSE", "F1 score, MSE", "F1-score, mse", "F1, MSE"],
    explanation: "분류의 조화평균 지표는 F1-score이며, 회귀의 오차제곱평균 지표는 MSE입니다.",
    hint: "F1-score와 MSE 약자를 콤마로 구분해 적으세요."
  },
  {
    id: "exam-sa-026",
    conceptId: "conv-output-calc-and-pooling-sa",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "short-answer",
    prompt: "32x32x3 입력 이미지에 5x5 커널(패딩 2, 스트라이드 1) 16개 필터의 합성곱을 적용한 후 2x2 맥스 풀링(스트라이드 2)을 수행했을 때, 최종 출력 특징 맵의 형태(C x H x W)를 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["16x16x16", "16 x 16 x 16", "16, 16, 16"],
    explanation: "합성곱 후 (32-5+4)/1+1 = 32 해상도 및 16채널(16x32x32)이 되며, 2x2 풀링(스트라이드 2) 후 16x16x16 차원이 됩니다.",
    hint: "합성곱 연산 후 해상도를 구하고 풀링으로 다운샘플링된 C x H x W 형태를 적으세요."
  },
  {
    id: "exam-sa-027",
    conceptId: "dpo-and-chinchilla-sa",
    difficulty: "medium",
    category: "자연어 처리 및 텍스트 모델",
    questionType: "short-answer",
    prompt: "별도의 보상 모델 없이 인간 선호도 데이터로 LLM을 직접 정렬하는 기법의 영문 약자와, 모델 크기와 학습 데이터 규모를 균형 있게 확장해야 한다고 제시한 스케일링 법칙 명칭을 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["DPO, Chinchilla", "DPO, 친칠라", "DPO, Chinchilla 법칙", "dpo, chinchilla"],
    explanation: "직접 선호 최적화는 DPO이며, 최적 스케일링 법칙은 Chinchilla입니다.",
    hint: "DPO 약자와 DeepMind의 스케일링 법칙 명칭을 적으세요."
  },
  {
    id: "exam-sa-028",
    conceptId: "siglip-and-imagebind-sa",
    difficulty: "medium",
    category: "시각-언어 모델(VLM) 및 멀티모달 정합",
    questionType: "short-answer",
    prompt: "SigLIP 알고리즘에서 양성 페어와 음성 페어에 부여되는 정답 라벨 z_ij 수치 2가지와, ImageBind가 단일 공간에 통합 정합한 모달리티 총 개수를 순서대로 적으시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["+1, -1, 6개", "+1, -1, 6", "1, -1, 6개", "1, -1, 6"],
    explanation: "SigLIP 라벨은 양성 +1, 음성 -1 이며, ImageBind는 총 6가지 모달리티를 정합했습니다.",
    hint: "양수/음수 1 라벨과 ImageBind 모달리티 총 개수를 적으세요."
  },

  // =========================================================================
  // [PART 3: 서술형 2문항]
  // =========================================================================
  {
    id: "exam-es-029",
    conceptId: "depthwise-separable-vs-std-conv-calc-essay",
    difficulty: "medium",
    category: "합성곱 신경망(CNN) 및 대표 비전 모델",
    questionType: "essay",
    prompt: "입력 채널 64, 출력 채널 128, 커널 크기 3x3 조건일 때, 표준 합성곱과 Depthwise Separable 합성곱(Depthwise + Pointwise)의 가중치 파라미터 개수를 각각 계산하고 비교 서술하시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["73728", "8768", "Depthwise", "Pointwise"],
    modelAnswer: "1) 표준 합성곱 파라미터 수: 64 x 3 x 3 x 128 = 73,728 개. 2) Depthwise Separable 합성곱 파라미터 수: Depthwise(64 x 3 x 3 = 576) + Pointwise(64 x 1 x 1 x 128 = 8,192) = 8,768 개. 공간 연산과 채널 결합 연산을 분리함으로써 파라미터 수가 약 1/8 수준으로 크게 감소한다.",
    rubricKeywords: [
      "표준 합성곱 73,728개",
      "Depthwise Separable 8,768개 (576 + 8,192)",
      "공간과 채널 분리를 통한 파라미터 대폭 절감"
    ],
    minLength: 20,
    explanation: "표준 합성곱 수치(73,728)와 가분 합성곱 수치(576+8,192=8,768)를 정확히 계산하여 경량화 원리를 비교합니다.",
    hint: "표준 수식(64x3x3x128)과 분리 수식(64x3x3 + 64x1x1x128)의 결과값을 써서 비교하세요."
  },
  {
    id: "exam-es-030",
    conceptId: "vlm-llava-and-grounded-sam-essay",
    difficulty: "medium",
    category: "시각-언어 모델 및 파운데이션 응용",
    questionType: "essay",
    prompt: "LLaVA 모델의 2단계 학습 전략에서 각 단계별 학습 대상 모듈을 구분하여 설명하고, Grounding DINO와 SAM을 결합한 Grounded-SAM 파이프라인의 텍스트 기반 자동 분할 과정을 서술하시오.",
    options: [],
    answer: null,
    acceptedAnswers: ["사전학습", "파인튜닝", "프로젝션", "Grounding DINO", "SAM", "마스크"],
    modelAnswer: "1) LLaVA의 Step 1(사전학습)에서는 비전 인코더와 LLM을 동결하고 선형 프로젝션 레이어만 학습시켜 시각-언어 표현을 정렬하며, Step 2(파인튜닝)에서는 비전 인코더는 동결한 채 프로젝션 레이어와 LLM을 함께 미세조정하여 시각 대화 능력을 완성한다. 2) Grounded-SAM에서는 사용자가 텍스트 프롬프트를 입력하면 Grounding DINO가 오픈 보캡으로 객체 바운딩 박스를 먼저 탐지하고, 이 박스 좌표를 SAM의 프롬프트로 전달하여 해당 영역의 정밀 세그멘테이션 마스크를 완전 자동으로 생성한다.",
    rubricKeywords: [
      "Step 1 프로젝션만 학습 vs Step 2 프로젝션 + LLM 동시 미세조정",
      "Grounding DINO의 텍스트 기반 바운딩 박스 탐지",
      "탐지 박스를 SAM 프롬프트로 전달하여 정밀 마스크 자동 생성"
    ],
    minLength: 20,
    explanation: "LLaVA의 단계별 모듈 학습 구분과 Grounded-SAM의 텍스트 탐지 → 정밀 마스킹 연계 파이프라인을 서술합니다.",
    hint: "LLaVA 1단계/2단계 학습 모듈과 DINO(박스 탐지) → SAM(마스크 생성) 과정을 순서대로 적으세요."
  }
];

export const ALL_QUESTIONS = SSAFY_AI_MOCK_EXAM_30Q;
