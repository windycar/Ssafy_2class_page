export type StudyDifficulty = "easy" | "medium" | "hard" | "extreme";
export type StudyQuestionType =
  | "multiple-choice"
  | "short-answer"
  | "essay";

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
  hint?: string;
}

export const QUESTION_BANK: Record<StudyDifficulty, StudyQuestion[]> = {
  easy: [
    // =========================================================================
    // 카테고리 1: On-device AI 하드웨어 및 플랫폼 (15문항: 객관식 12, 단답식 2, 서술형 1)
    // =========================================================================
    {
      id: "cat1-hw-tops-watt-metric-easy-001",
      conceptId: "tops-per-watt-efficiency-metric",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "multiple-choice",
      prompt: "모바일, 웨어러블, IoT 등 온디바이스 AI 환경에서 하드웨어 연산 효율을 평가할 때 가장 중요한 지표는 무엇입니까?",
      options: [
        "중앙처리장치의 단일 코어 최대 동작 주파수를 나타내는 클럭 수치",
        "디스플레이 패널의 초당 화면 재생 빈도를 나타내는 프레임 레이트",
        "소비 전력 1와트당 초당 연산 처리 횟수를 나타내는 연산 효율 지표",
        "무선 통신 인터페이스의 초당 데이터 전송 속도를 나타내는 대역폭 지표"
      ],
      answer: 2,
      explanation: "온디바이스 환경에서는 배터리와 발열 제약이 크기 때문에, 1초 동안 수행하는 조 단위 연산 횟수를 소비 전력으로 나눈 TOPS/W가 핵심 지표로 활용됩니다[cite: 4].",
      hint: "전력 대비 연산 처리 효율을 나타내는 단위를 떠올려보세요."
    },
    {
      id: "cat1-hw-processor-roles-easy-002",
      conceptId: "cpu-gpu-npu-comparison",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "multiple-choice",
      prompt: "온디바이스 AI 프로세서 중 텐서 및 벡터 연산에 최적화되어 스마트폰 추론에 널리 쓰이는 가속기는?",
      options: [
        "NPU",
        "CPU",
        "MCU",
        "DSP"
      ],
      answer: 0,
      explanation: "NPU(Neural Processing Unit)는 텐서 및 벡터 연산에 최적화된 온디바이스 전용 가속기로, 저전력 고효율 딥러닝 추론을 담당합니다[cite: 4].",
      hint: "신경망 처리 전용 프로세서의 약어입니다."
    },
    {
      id: "cat1-hw-edge-device-coral-easy-003",
      conceptId: "google-coral-edge-tpu-features",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "multiple-choice",
      prompt: "AI 가속 엣지 디바이스인 구글 코럴에 탑재된 전용 칩셋과 지원 연산의 특징으로 가장 적절한 것은?",
      options: [
        "고성능 부동소수점 병렬 연산에 최적화된 64비트 배정밀도 전용 가속기이다.",
        "아날로그 신호를 직접 연산하여 초저전력 비전 처리를 수행하는 특수 칩셋이다.",
        "제어 로직 중심의 순차 처리를 위해 단일 코어 클럭 주파수를 극대화한 프로세서이다.",
        "초저전력 고속 추론을 위해 8비트 정수 연산 모델을 전용으로 구동하는 엣지 TPU이다."
      ],
      answer: 3,
      explanation: "구글 코럴(Google Coral)은 ASIC 기반의 Edge TPU를 탑재하고 있으며, 초저전력 환경에서 8비트 정수(INT8) 모델을 고속으로 실행합니다[cite: 4].",
      hint: "Edge TPU와 8비트 정수 연산 지원 특성을 확인하세요."
    },
    {
      id: "cat1-hw-mobile-soc-advantages-easy-004",
      conceptId: "mobile-soc-integration-benefits",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "multiple-choice",
      prompt: "스마트폰에서 CPU, GPU, NPU를 단일 칩 안에 통합한 모바일 SoC 구조의 핵심 이점으로 옳은 것은?",
      options: [
        "개별 부품의 물리적 분리를 통해 하드웨어 교체와 성능 확장이 쉬워진다.",
        "소형화와 함께 칩 내부 데이터 이동 거리가 줄어 전력 효율이 향상된다.",
        "모든 인공지능 연산이 단일 CPU 코어의 직렬 처리 방식으로 단순화된다.",
        "메모리 대역폭 요구량이 대폭 증가하여 무선 통신 속도가 비례해 빨라진다."
      ],
      answer: 1,
      explanation: "SoC(System-on-Chip)는 여러 프로세서의 기능을 단일 칩에 통합하여 기기를 소형화하고, 데이터 이동 거리를 단축해 전력 효율을 높입니다[cite: 4].",
      hint: "여러 프로세서를 단일 칩에 집적했을 때의 물리적 장점을 생각해보세요."
    },
    {
      id: "cat1-hw-deployment-framework-issue-easy-005",
      conceptId: "framework-dependency-bottleneck",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "multiple-choice",
      prompt: "인공지능 모델의 학습과 온디바이스 배포 과정에서 발생하는 프레임워크 종속성 문제에 대한 설명으로 옳은 것은?",
      options: [
        "특정 프레임워크의 고유 그래프 구조와 연산자 정의로 인해 다른 하드웨어 런타임에서 직접 실행하기 어렵다.",
        "모든 배포 런타임이 동일한 단일 바이너리 형식을 사용하여 별도의 모델 변환 과정이 필요 없다.",
        "파이토치로 학습된 모델 가중치는 안드로이드 NPU 런타임에서 수정 없이 자동으로 가속된다.",
        "배포 대상 하드웨어 종류가 늘어날수록 모델 최적화에 소요되는 개발 비용이 선형적으로 줄어든다."
      ],
      answer: 0,
      explanation: "PyTorch, TensorFlow 등 각 학습 프레임워크마다 연산자 정의와 그래프 형식이 달라 타겟 하드웨어 런타임에 맞춰 변환해야 하는 문제가 발생합니다[cite: 4].",
      hint: "프레임워크 간 파일 형식과 연산자 정의의 차이를 생각해보세요."
    },
    {
      id: "cat1-hw-onnx-interoperability-easy-006",
      conceptId: "onnx-standard-interface-role",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "multiple-choice",
      prompt: "인공지능 배포의 표준 인터페이스로 널리 활용되는 ONNX의 주된 역할과 장점으로 옳은 것은?",
      options: [
        "인공신경망의 모든 가중치를 1비트로 압축하여 메모리 용량 부담을 완전히 없애준다.",
        "GPU의 클럭 주파수를 실시간으로 제어하여 하드웨어 발열 문제를 하드웨어적으로 차단한다.",
        "학습 프레임워크와 배포 환경 사이의 상호 운용성을 높여 다양한 런타임에서 모델을 실행하기 쉽게 한다.",
        "비라벨 텍스트 코퍼스를 자동으로 수집하여 온디바이스 상에서 사전 학습을 대신 수행한다."
      ],
      answer: 2,
      explanation: "ONNX(Open Neural Network Exchange)는 서로 다른 프레임워크로 학습된 모델을 공통 포맷으로 변환하여 다양한 하드웨어 런타임에서 실행할 수 있도록 상호 운용성을 제공합니다[cite: 4].",
      hint: "다양한 프레임워크와 하드웨어 런타임을 연결하는 개방형 표준 포맷입니다."
    },
    {
      id: "cat1-hw-intel-movidius-openvino-easy-007",
      conceptId: "intel-movidius-vpu-openvino",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "multiple-choice",
      prompt: "인텔 Movidius 가속기 칩셋이 탑재된 디바이스의 프로세서 유형과 연계되는 주요 툴체인은?",
      options: [
        "GPU 기반 프로세서 및 텐서알티 툴체인",
        "VPU 기반 프로세서 및 오픈비노 툴체인",
        "TPU 기반 프로세서 및 텐서플로우 라이트 툴체인",
        "MCU 기반 프로세서 및 타이니엠엘 툴체인"
      ],
      answer: 1,
      explanation: "인텔 Movidius(NCS2)는 VPU(Vision Processing Unit)를 탑재하고 있으며, 인텔의 OpenVINO 도구 체계와 연계되어 저전력 비전 추론을 수행합니다[cite: 4].",
      hint: "비전 처리를 위한 VPU와 인텔 전용 최적화 툴체인을 확인하세요."
    },
    {
      id: "cat1-hw-tensorrt-runtime-easy-008",
      conceptId: "tensorrt-nvidia-gpu-target",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "multiple-choice",
      prompt: "인공지능 배포 런타임 중 TensorRT가 주로 타겟으로 하여 고성능 가속을 제공하는 하드웨어 플랫폼은?",
      options: [
        "ARM 기반 초저전력 마이크로컨트롤러 환경",
        "인텔 CPU 및 VPU 전용 임베디드 플랫폼",
        "엔비디아 GPU 기반 하드웨어 플랫폼",
        "퀄컴 스냅드래곤 DSP 전용 모바일 플랫폼"
      ],
      answer: 2,
      explanation: "TensorRT는 엔비디아(NVIDIA) GPU 아키텍처에 맞춰 딥러닝 추론을 극대화하도록 최적화된 고성능 추론 엔진입니다[cite: 4].",
      hint: "NVIDIA 전용 딥러닝 추론 최적화 런타임입니다."
    },
    {
      id: "cat1-hw-apple-neural-engine-easy-009",
      conceptId: "apple-a-series-neural-engine",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "multiple-choice",
      prompt: "애플의 모바일 SoC에 내장되어 온디바이스 인공지능 연산을 전담하는 하드웨어 유닛의 명칭은?",
      options: [
        "뉴럴 엔진",
        "헥사곤 디에스피",
        "아드레노 지피유",
        "엣지 티피유"
      ],
      answer: 0,
      explanation: "애플의 모바일 A-시리즈 및 M-시리즈 칩셋에는 온디바이스 인공지능 연산을 가속하기 위한 NPU인 Neural Engine이 내장되어 있습니다[cite: 4].",
      hint: "애플 전용 신경망 가속 유닛의 명칭입니다."
    },
    {
      id: "cat1-hw-power-wall-solution-easy-010",
      conceptId: "domain-specific-accelerator-evolution",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "multiple-choice",
      prompt: "온디바이스 환경에서 일반 범용 프로세서가 전력 효율 한계에 직면했을 때 하드웨어가 발전한 방향은?",
      options: [
        "CPU 클럭 주파수를 대폭 높여 순차 제어 처리 속도를 물리적으로 가속하는 방향",
        "모든 인공지능 연산을 클라우드로 전송하여 기기 내부 연산을 완전히 중단하는 방향",
        "메모리 접근을 줄이고 딥러닝 연산에 집중하는 도메인 특화 가속기를 도입하는 방향",
        "인공신경망의 모든 은닉 계층을 제거하고 전통적인 규칙 기반 제어로 회귀하는 방향"
      ],
      answer: 2,
      explanation: "온디바이스 AI 하드웨어는 전력 효율 한계(Power Wall)를 극복하기 위해 메모리 접근을 줄이고 딥러닝 연산에 특화된 NPU 등 도메인 특화 가속기 구조로 발전했습니다[cite: 4].",
      hint: "특화된 연산기와 온칩 메모리를 사용하는 전용 가속기의 도입입니다."
    },
    {
      id: "cat1-hw-tflite-runtime-target-easy-011",
      conceptId: "tflite-mobile-iot-target",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "multiple-choice",
      prompt: "경량 딥러닝 런타임인 TensorFlow Lite의 주된 배포 타겟 환경으로 가장 올바른 것은?",
      options: [
        "고성능 과학 계산용 슈퍼컴퓨터 클러스터",
        "대규모 분산 트랜잭션 전용 데이터센터 서버",
        "초고속 금융 매매 전용 메인프레임 시스템",
        "모바일 애플리케이션 및 IoT 엣지 디바이스"
      ],
      answer: 3,
      explanation: "TensorFlow Lite는 모바일 기기 및 IoT 임베디드 장치에서 가볍고 빠르게 AI 모델을 실행하기 위해 설계된 경량 배포 플랫폼입니다[cite: 4].",
      hint: "스마트폰 앱과 소형 임베디드 기기를 위한 경량 런타임입니다."
    },
    {
      id: "cat1-hw-mobile-soc-limits-easy-012",
      conceptId: "mobile-soc-flexibility-limitations",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "multiple-choice",
      prompt: "모바일 SoC가 높은 집적도와 전력 효율을 제공하는 반면 지니는 구조적 한계점은?",
      options: [
        "내부 통신 거리가 멀어져 프로세서 간 신호 전송 지연이 극대화된다.",
        "모든 구성요소가 단일 칩에 통합되어 있어 하드웨어적인 유연성과 확장에 한계가 있다.",
        "부동소수점 연산이 불가능하여 자연어 처리 모델을 구동할 수 없다.",
        "항상 고전압 유선 전원 공급 장치를 직접 연결해야만 동작한다."
      ],
      answer: 1,
      explanation: "SoC는 모든 기능 블록이 하나의 실리콘 다이에 몰아서 구현되므로 집적도와 효율은 높지만, 부품 교체나 확장성 측면에서 한계가 있습니다[cite: 4].",
      hint: "단일 칩 집적 구조가 갖는 부품 확장성의 한계를 생각해보세요."
    },
    {
      id: "cat1-hw-tops-acronym-short-easy-013",
      conceptId: "tops-acronym-expansion",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "short-answer",
      prompt: "1초 동안 실행되는 연산 횟수를 조 단위로 측정한 하드웨어 연산 성능 지표인 TOPS의 영문 전체 명칭을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Tera Operations Per Second",
        "tera operations per second",
        "Tera Operations per Second"
      ],
      explanation: "TOPS는 Tera Operations Per Second의 약자로, 1초당 1조 번의 연산 처리 능력을 나타내는 하드웨어 성능 단위입니다[cite: 4].",
      hint: "Tera Operations Per Second"
    },
    {
      id: "cat1-hw-onnx-acronym-short-easy-014",
      conceptId: "onnx-acronym-expansion",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "short-answer",
      prompt: "다양한 AI 학습 프레임워크와 배포 하드웨어 간의 상호 운용성을 지원하는 개방형 표준 포맷인 ONNX의 영문 전체 명칭을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Open Neural Network Exchange",
        "open neural network exchange",
        "Open neural network exchange"
      ],
      explanation: "ONNX는 Open Neural Network Exchange의 약자로, 다양한 AI 프레임워크 간 모델 교환을 가능하게 하는 표준 포맷입니다[cite: 4].",
      hint: "Open Neural Network Exchange"
    },
    {
      id: "cat1-hw-ondevice-necessity-essay-easy-015",
      conceptId: "ondevice-ai-necessity-and-npu-essay",
      difficulty: "easy",
      category: "On-device AI 하드웨어 및 플랫폼",
      questionType: "essay",
      prompt: "클라우드 기반 AI와 비교하여 온디바이스 AI가 필요한 이유를 설명하고, 범용 프로세서(CPU) 대비 신경망 전용 가속기(NPU)의 구조적 이점을 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "1. 온디바이스 AI의 필요성:\n클라우드 네트워크 장애가 발생해도 기기 자체에서 독립적으로 동작할 수 있어 안정성이 높고, 데이터 전송 지연이 없어 실시간 추론이 가능하며, 사용자 데이터를 외부로 전송하지 않아 개인정보 보호에 유리합니다[cite: 4].\n\n2. NPU의 구조적 이점:\n범용 제어 중심의 CPU와 달리 NPU는 딥러닝에 필수적인 텐서 및 벡터 병렬 연산에 최적화되어 있습니다[cite: 4]. 또한 외부 DRAM 접근을 줄이고 온칩 메모리를 적극 활용하여 전력 소모 대비 연산 효율(TOPS/W)이 매우 뛰어납니다[cite: 4].",
      rubricKeywords: [
        "실시간 처리",
        "보안성 및 안정성",
        "텐서 및 벡터 연산 특화",
        "메모리 접근 최소화",
        "전력 효율"
      ],
      minLength: 140,
      explanation: "온디바이스 AI의 장점(실시간성, 보안, 네트워크 독립성)과 NPU의 하드웨어적 강점(텐서 연산 최적화, 메모리 접근 최소화, 전력 효율)을 기술해야 합니다[cite: 4].",
      hint: "클라우드 장애 대응과 개인정보 보호, 그리고 NPU의 텐서 연산 및 전력 효율 특성을 서술하세요."
    },

    // =========================================================================
    // 카테고리 2: 100% 정수연산 양자화 (15문항: 객관식 12, 단답식 2, 서술형 1)
    // =========================================================================
    {
      id: "cat2-quant-accelerator-fallback-easy-016",
      conceptId: "accelerator-integer-execution-fallback",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "multiple-choice",
      prompt: "온디바이스 인공지능 가속기에서 모델 연산 중 미지원 부동소수점 연산이 발생할 때 일어나는 현상은?",
      options: [
        "가속기 내부에서 연산 정밀도를 자체적으로 4비트 정수로 강제 변환한다.",
        "미지원 연산을 처리하기 위해 호스트 CPU로 데이터를 전달하여 지연이 발생한다.",
        "신경망의 미지원 가중치 노드가 자동으로 삭제되고 추론이 즉시 완료된다.",
        "온칩 메모리의 모든 데이터가 초기화되며 가속기 하드웨어가 재부팅된다."
      ],
      answer: 1,
      explanation: "Edge TPU나 NPU 등 많은 하드웨어 가속기는 정수 연산 전용으로 설계되어 있어, 부동소수점 연산이 발생하면 메인 CPU로 작업을 넘겨(Fallback) 처리 지연이 발생합니다[cite: 4].",
      hint: "지원되지 않는 연산이 메인 프로세서로 넘어가는 현상을 생각해보세요."
    },
    {
      id: "cat2-quant-formula-parameters-easy-017",
      conceptId: "quantization-mapping-parameters",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "multiple-choice",
      prompt: "실수 r을 8비트 정수 q로 매핑하는 기본 양자화 수식 r = S(q - Z)에서 파라미터 S와 Z의 데이터 특성으로 옳은 것은?",
      options: [
        "S와 Z 모두 부호 없는 8비트 정수 값이다.",
        "S는 32비트 정수 값이고 Z는 16비트 실수 값이다.",
        "S와 Z 모두 32비트 부동소수점 실수 값이다.",
        "S는 실수 스케일링 파라미터이고 Z는 정수 오프셋 파라미터이다."
      ],
      answer: 3,
      explanation: "수식 r = S(q - Z)에서 스케일링 팩터 S는 실수이며, 0점을 보정하는 오프셋 Z는 정수 값으로 정의됩니다[cite: 4].",
      hint: "S가 실수인지 정수인지, Z가 어떤 역할을 하는지 확인하세요."
    },
    {
      id: "cat2-quant-hidden-scale-issue-easy-018",
      conceptId: "quantized-values-vs-operations",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "multiple-choice",
      prompt: "신경망의 가중치와 활성화 값을 정수로 양자화했음에도 연산 과정에서 부동소수점 연산이 발생하는 원인은?",
      options: [
        "실수 값 매핑에 사용되는 스케일링 파라미터 S가 여전히 실수로 연산에 개입하기 때문에",
        "신경망의 모든 편향 가중치가 정수 덧셈기에서 처리되지 않고 삭제되기 때문에",
        "정수 연산기의 비트 폭이 부동소수점 레지스터보다 항상 2배 이상 넓기 때문에",
        "배치 정규화 계층이 역색인 테이블의 정수 인덱스만 참조하도록 제한되기 때문에"
      ],
      answer: 0,
      explanation: "가중치와 활성화 값을 정수 q로 변환하더라도, 원래 실수 범위를 복원하는 스케일링 팩터 S가 실수이므로 연산 도중에 부동소수점 곱셈이 발생합니다[cite: 4].",
      hint: "스케일링 파라미터 S의 데이터 타입이 무엇인지 생각해보세요."
    },
    {
      id: "cat2-quant-matmul-m-definition-easy-019",
      conceptId: "matrix-multiplication-scale-m-definition",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "multiple-choice",
      prompt: "행렬 곱셈의 양자화 수식 유도 과정에서 세 스케일링 파라미터를 하나로 묶은 실수 M의 정의식으로 옳은 것은?",
      options: [
        "M = S1 + S2 + S3",
        "M = S3 / (S1 * S2)",
        "M = (S1 * S2) / S3",
        "M = S1 * S2 * S3"
      ],
      answer: 2,
      explanation: "행렬 곱셈 양자화 식을 전개하면 출력 스케일 S3가 나누어지며 실수 스케일 묶음 M = (S1 * S2) / S3 로 정의됩니다[cite: 4].",
      hint: "두 입력 스케일의 곱을 출력 스케일로 나눈 수식입니다."
    },
    {
      id: "cat2-quant-bit-shifting-mechanism-easy-020",
      conceptId: "bit-shifting-integer-multiplication",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "multiple-choice",
      prompt: "0과 1 사이의 실수 M을 정수 연산으로 처리하기 위해 비트 쉬프트를 적용하는 처리 과정으로 옳은 것은?",
      options: [
        "실수 M에 2의 n제곱을 곱해 정수화하여 계산한 후 결과를 우측으로 n비트 시프트한다.",
        "실수 M을 2의 n제곱으로 나눈 뒤 소수부를 버리고 정수 덧셈만 연속으로 수행한다.",
        "실수 M의 소수점 이하 자릿수를 모두 잘라내고 정수 1로 고정하여 행렬 곱을 처리한다.",
        "실수 M을 부호 있는 2의 보수로 변환한 뒤 최상위 부호 비트만 반전시켜 곱한다."
      ],
      answer: 0,
      explanation: "실수 M을 2^n만큼 스케일 업하여 정수 M0로 만든 뒤 정수 곱셈을 수행하고, 최종 결과를 우측으로 n비트 시프트하여 100% 정수 연산으로 대체합니다[cite: 4].",
      hint: "임시로 정수로 키워 계산한 뒤 시프트 연산으로 크기를 되돌리는 방식입니다."
    },
    {
      id: "cat2-quant-bn-folding-concept-easy-021",
      conceptId: "batch-normalization-folding-concept",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "multiple-choice",
      prompt: "배치 정규화 계층의 연산을 효율적으로 양자화하기 위한 배치 정규화 폴딩(BN Folding) 기법의 개념은?",
      options: [
        "배치 정규화 계층을 모델의 맨 마지막 출력단으로 강제 이동시켜 일괄 처리한다.",
        "배치 정규화 연산을 바로 앞의 합성곱 계층 연산에 통합하여 함께 양자화한다.",
        "배치 정규화의 모든 평균과 분산 값을 0으로 초기화하여 연산 자체를 생략한다.",
        "배치 정규화의 입출력 데이터를 고정밀도 실수 포맷으로 역양자화하여 계산한다."
      ],
      answer: 1,
      explanation: "BN 폴딩은 추론 단계에서 배치 정규화의 평균과 분산 연산을 앞선 합성곱 계층의 가중치 및 편향에 흡수 통합하여 단일 연산으로 양자화하는 기법입니다[cite: 4].",
      hint: "배치 정규화 연산을 앞선 합성곱 계층 안으로 흡수하여 통합하는 방식입니다."
    },
    {
      id: "cat2-quant-bn-folding-weight-formula-easy-022",
      conceptId: "bn-folding-weight-transformation",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "multiple-choice",
      prompt: "배치 정규화 폴딩을 적용할 때 합성곱 계층의 가중치 W가 변환되는 수식으로 옳은 것은?",
      options: [
        "W_fold = W * σ",
        "W_fold = W - μ",
        "W_fold = W + μ * σ",
        "W_fold = W / σ"
      ],
      answer: 3,
      explanation: "배치 정규화 수식에서 입력에 곱해지는 가중치 항은 표준편차 σ로 나눈 형태가 되므로, 폴딩된 가중치는 W_fold = W / σ 가 됩니다[cite: 4].",
      hint: "가중치 W를 표준편차 σ로 나누어주는 수식입니다."
    },
    {
      id: "cat2-quant-vit-softmax-easy-023",
      conceptId: "vit-softmax-integer-quantization",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "multiple-choice",
      prompt: "비전 트랜스포머의 SoftMax 연산을 정수화하기 위해 지수 함수를 근사하는 주된 방식은?",
      options: [
        "지수 연산 대신 1차 선형 함수만을 연결하여 단순 정수 덧셈으로 대체한다.",
        "모든 소프트맥스 출력값을 균일한 상수로 고정하여 지수 연산 자체를 생략한다.",
        "자연상수 밑을 2로 변환하고 정수부와 소수부를 분리하여 정수 근사한다.",
        "입력 벡터의 모든 원소를 절댓값 크기 순으로 정렬하여 상위 1개만 선택한다."
      ],
      answer: 2,
      explanation: "SoftMax의 지수 연산을 정수화하기 위해 밑을 e에서 2로 변환한 뒤, 정수 파트와 소수 파트를 분리하여 비트 연산으로 정수 근사합니다[cite: 4].",
      hint: "지수의 밑을 2의 거듭제곱으로 변환하여 비트 시프트와 결합하는 방식입니다."
    },
    {
      id: "cat2-quant-vit-gelu-approx-easy-024",
      conceptId: "vit-gelu-integer-approximation",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "multiple-choice",
      prompt: "비전 트랜스포머의 GELU 활성화 함수를 정수 연산으로 근사할 때 활용하는 구성 요소는?",
      options: [
        "상수 1.702의 비트 쉬프팅 근사와 시그모이드 함수",
        "단어 역문서 빈도 가중치와 코사인 거리 계산식",
        "단순 계단 함수와 균일 난수 생성 테이블",
        "고정밀도 삼각함수 테이블과 룩업 버퍼"
      ],
      answer: 0,
      explanation: "GELU 함수는 x * σ(1.702x) 형태로 근사할 수 있으며, 상수 1.702를 비트 쉬프팅으로 정수 근사하고 시그모이드 양자화 방식을 결합하여 처리합니다[cite: 4].",
      hint: "1.702 상수와 시그모이드 형태의 근사식을 떠올려보세요."
    },
    {
      id: "cat2-quant-vit-layernorm-sqrt-easy-025",
      conceptId: "vit-layernorm-sqrt-approximation",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "multiple-choice",
      prompt: "비전 트랜스포머의 LayerNorm 연산을 정수화할 때 가장 핵심적인 해결 과제는?",
      options: [
        "입력 시퀀스의 위치 임베딩 벡터를 정수 단위로 정렬하는 작업",
        "가중치 행렬을 두 개의 저차원 행렬 곱으로 분해하는 작업",
        "분산 계산에 포함된 제곱근 연산을 정수형으로 근사하는 작업",
        "모든 정규화 파라미터를 0으로 마스킹하여 연산을 생략하는 작업"
      ],
      answer: 2,
      explanation: "LayerNorm 수식에는 표준편차를 구하기 위한 분산의 제곱근(루트) 연산이 포함되어 있어, 이를 비트 쉬프팅과 반복 탐색으로 정수 근사해야 합니다[cite: 4].",
      hint: "표준편차 산출에 필요한 제곱근 연산의 정수화입니다."
    },
    {
      id: "cat2-quant-full-int-benefit-easy-026",
      conceptId: "full-integer-quantization-advantages",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "multiple-choice",
      prompt: "신경망의 모든 연산 과정을 100% 정수 연산으로 양자화했을 때 얻을 수 있는 결정적 이점은?",
      options: [
        "모델 학습 시 소요되는 에포크 횟수가 1회로 고정되어 학습 시간이 단축된다.",
        "정수 전용 AI 가속기에서 CPU 폴백 없이 효율적으로 고속 추론할 수 있다.",
        "모든 신경망의 예측 정확도가 원래 부동소수점 모델보다 무조건 향상된다.",
        "외부 문서 저장소에 보관된 텍스트 데이터의 검색 정확도가 100%에 도달한다."
      ],
      answer: 1,
      explanation: "모든 연산 과정을 100% 정수화하면 정수 전용 NPU/TPU에서 CPU 폴백 없이 온칩 연산기만으로 고속, 저전력 추론이 가능해집니다[cite: 4].",
      hint: "하드웨어 가속기에서 중간 실수 변환 없이 직접 연산되는 이점입니다."
    },
    {
      id: "cat2-quant-edge-tpu-int8-rule-easy-027",
      conceptId: "edge-tpu-full-int8-requirement",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "multiple-choice",
      prompt: "구글 Coral Edge TPU의 하드웨어 실행 특성에 대한 설명으로 옳은 것은?",
      options: [
        "32비트 부동소수점 모델을 NPU 내부에서 전용으로 가속한다.",
        "어떠한 경우에도 정수 모델을 지원하지 않고 실수 모델만 실행한다.",
        "연산 지연을 줄이기 위해 모든 가중치를 1비트 이진수로 강제 변환한다.",
        "완전 8비트 정수 모델만 전용 가속하며 미지원 연산은 CPU로 보낸다."
      ],
      answer: 3,
      explanation: "구글 Coral Edge TPU는 완전 8비트 정수 모델만 전용으로 구동하며, 지원되지 않는 연산은 호스트 CPU로 보냅니다[cite: 4].",
      hint: "완전한 8비트 정수 모델만 지원하는 가속기 특성입니다."
    },
    {
      id: "cat2-quant-m-formula-short-easy-028",
      conceptId: "matrix-multiplication-scale-formula",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "short-answer",
      prompt: "행렬 곱셈 양자화에서 두 입력 스케일(S1, S2)과 출력 스케일(S3)을 결합하여 정의하는 실수 스케일 파라미터 M의 수식을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "(S1*S2)/S3",
        "S1*S2/S3",
        "(S1 * S2) / S3",
        "S1 * S2 / S3"
      ],
      explanation: "행렬 곱셈 양자화에서 실수 스케일 묶음 M은 (S1 * S2) / S3 로 정의됩니다[cite: 4].",
      hint: "S1, S2의 곱을 S3로 나눈 수식입니다."
    },
    {
      id: "cat2-quant-bn-folding-short-easy-029",
      conceptId: "batchnorm-folding-term",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "short-answer",
      prompt: "배치 정규화 계층의 연산을 별도로 분리하지 않고 바로 앞의 합성곱 계층에 통합하여 함께 양자화하는 기법의 명칭을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "배치 정규화 폴딩",
        "배치 정규화 계층 폴딩",
        "BN 폴딩",
        "BN folding",
        "BatchNorm folding"
      ],
      explanation: "합성곱 연산과 배치 정규화 연산을 하나로 합쳐서 처리하는 기법을 배치 정규화 계층 폴딩(BN 폴딩)이라고 합니다[cite: 4].",
      hint: "배치 정규화(BN)를 접어서 합친다는 의미의 명칭입니다."
    },
    {
      id: "cat2-quant-bitshift-essay-easy-030",
      conceptId: "quantization-bit-shifting-mechanism-essay",
      difficulty: "easy",
      category: "100% 정수연산 양자화",
      questionType: "essay",
      prompt: "양자화된 신경망에서 가중치와 활성화 값이 모두 정수임에도 연산 과정에서 부동소수점이 발생하는 이유를 설명하고, 비트 쉬프팅(Bit Shifting) 기법이 이를 100% 정수 연산으로 변환하는 원리를 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "1. 부동소수점 연산 발생 원인:\n가중치와 활성화 값을 정수로 양자화하더라도, 원래 실수 값으로 매핑하기 위해 곱해지는 스케일링 파라미터(S1, S2, S3 등)가 여전히 실수이므로 연산 도중에 부동소수점 곱셈이 발생합니다[cite: 4].\n\n2. 비트 쉬프팅의 정수화 원리:\n행렬 곱셈의 실수 스케일 묶음 M = (S1 * S2) / S3을 정수 M0와 2의 거듭제곱(2^-n)의 곱으로 분해합니다[cite: 4]. 먼저 정수 M0를 곱해 계산한 뒤, 2^-n에 해당하는 나눗셈을 하드웨어 우측 비트 시프트 연산으로 대체함으로써 부동소수점 없이 100% 정수 연산으로 처리할 수 있습니다[cite: 4].",
      rubricKeywords: [
        "스케일링 파라미터가 실수",
        "부동소수점 발생",
        "스케일 업",
        "정수 곱셈",
        "비트 쉬프트"
      ],
      minLength: 140,
      explanation: "스케일링 팩터 S의 실수성으로 인한 문제점과, 2^n 스케일 업 및 비트 쉬프트(2^-n)를 통한 정수 연산 대체 원리를 명확히 서술해야 합니다[cite: 4].",
      hint: "스케일링 파라미터의 실수 문제와 비트 쉬프팅을 통한 정수 연산 대체 과정을 기술하세요."
    },

    // =========================================================================
    // 카테고리 3: 분포 이동과 테스트 타임 도메인 적응 (TTA) - 15문항
    // =========================================================================
    {
      id: "cat3-tta-dist-shift-concept-easy-031",
      conceptId: "distribution-shift-definition",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "multiple-choice",
      prompt: "인공지능 모델이 배포되어 실제 동작할 때 나타나는 분포 이동(Distribution Shift) 현상의 정의는?",
      options: [
        "하드웨어 칩셋의 온도가 상승하여 연산 속도가 일시적으로 저하되는 현상",
        "모델의 역전파 손실 함수가 0에 도달하여 학습이 조기 종료되는 현상",
        "학습 시 경험했던 데이터 분포와 실제 테스트 환경의 데이터 분포가 달라지는 현상",
        "사전 학습된 가중치 행렬의 모든 원소가 정수로 자동 변환되는 현상"
      ],
      answer: 2,
      explanation: "분포 이동(Distribution Shift)은 모델이 학습할 때 보았던 데이터와 실제 배포 환경(조도, 날씨, 노이즈 등)에서 들어오는 테스트 데이터의 통계적 특성이 달라져 성능이 떨어지는 현상입니다[cite: 4].",
      hint: "학습 데이터 환경과 실제 테스트 환경의 차이로 인해 발생합니다."
    },
    {
      id: "cat3-tta-core-goal-easy-032",
      conceptId: "tta-test-time-adaptation-concept",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "multiple-choice",
      prompt: "테스트 타임 도메인 적응(TTA) 기법의 핵심적인 동작 목표는 무엇입니까?",
      options: [
        "테스트 시점에 들어오는 데이터의 통계를 바탕으로 모델을 유연하게 적응시켜 성능 저하를 방어한다.",
        "테스트 데이터의 정답 레이블을 수동으로 입력받아 전체 네트워크를 처음부터 재학습한다.",
        "외부 위키피디아 지식베이스를 검색하여 모델의 모든 파라미터를 0으로 초기화한다.",
        "입력 이미지의 해상도를 강제로 10배 확대하여 어텐션 윈도우를 최적화한다."
      ],
      answer: 0,
      explanation: "TTA(Test-Time Adaptation)는 모델 전체를 재학습하지 않고, 테스트 시점에 입력되는 데이터의 통계를 활용해 모델 일부를 즉시 조정함으로써 분포 이동에 유연하게 대처하는 기법입니다[cite: 4].",
      hint: "테스트 시점에 실시간으로 환경에 적응하는 방법입니다."
    },
    {
      id: "cat3-tta-tent-stats-update-easy-033",
      conceptId: "tent-batchnorm-stats-update",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "multiple-choice",
      prompt: "CNN 기반 대표 TTA 기법인 TENT에서 테스트 데이터가 입력될 때 배치 정규화 계층에서 일어나는 통계 처리는?",
      options: [
        "학습 시점에 고정되었던 평균과 분산을 영구적으로 동결하여 유지한다.",
        "모든 평균과 분산 값을 무조건 0과 1로 고정하여 정규화를 생략한다.",
        "배치 정규화의 가중치를 4비트 정수로 양자화하여 연산 속도를 가속한다.",
        "테스트 데이터를 바탕으로 배치 정규화의 평균과 분산을 새로운 데이터 기준으로 재계산한다."
      ],
      answer: 3,
      explanation: "TENT는 테스트 데이터가 들어올 때 기존 학습 통계 대신 현재 테스트 데이터의 평균과 분산을 실시간으로 재계산하여 새로운 분포에 즉각 적응합니다[cite: 4].",
      hint: "새로운 데이터 기준의 평균과 분산 재계산입니다."
    },
    {
      id: "cat3-tta-tent-loss-function-easy-034",
      conceptId: "tent-entropy-minimization-loss",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "multiple-choice",
      prompt: "TENT 기법에서 정답 레이블이 없는 테스트 데이터를 활용해 모델을 최적화하기 위해 사용하는 손실 함수는?",
      options: [
        "정답 레이블과의 오차를 계산하는 교차 엔트로피 손실",
        "모델 예측의 불확실성을 최소화하는 엔트로피 손실",
        "보상 모델의 점수를 극대화하는 정책 강화학습 손실",
        "희소 검색기의 역문서 빈도를 최대화하는 텍스트 통계 손실"
      ],
      answer: 1,
      explanation: "TENT는 정답 라벨이 없으므로 모델 예측 확률의 불확실성을 나타내는 엔트로피를 손실 함수로 설정하고, 이를 최소화하여 예측 확신도를 높입니다[cite: 4].",
      hint: "불확실성을 줄여 확신도를 높이는 비지도 손실입니다."
    },
    {
      id: "cat3-tta-tent-target-params-easy-035",
      conceptId: "tent-affine-parameters-update",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "multiple-choice",
      prompt: "TENT 기법이 엔트로피 손실 역전파를 통해 미세 조정하는 모델의 대상 파라미터는?",
      options: [
        "배치 정규화 계층의 어파인 파라미터인 스케일과 이동 값",
        "모델의 모든 합성곱 가중치와 완전 연결 계층 가중치",
        "입력 이미지의 RGB 픽셀 값과 카메라 셔터 스피드",
        "토크나이저에 등록된 어휘 사전의 단어 임베딩 벡터"
      ],
      answer: 0,
      explanation: "TENT는 연산 효율성과 안정성을 위해 전체 모델 가중치는 고정하고, 오직 배치 정규화 계층의 어파인 파라미터(스케일 γ, 이동 β)만 역전파로 업데이트합니다[cite: 4].",
      hint: "배치 정규화 계층에 속한 스케일과 이동 파라미터입니다."
    },
    {
      id: "cat3-tta-sar-stability-easy-036",
      conceptId: "sar-entropy-filtering-smoothing",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "multiple-choice",
      prompt: "SAR 기법이 기존 TENT의 불안정성을 개선하기 위해 도입한 안정화 방식은?",
      options: [
        "불확실성이 가장 높은 이상치 데이터에 가산점을 부여하여 업데이트한다.",
        "배치 정규화 계층을 완전히 삭제하고 모든 층을 레이어 정규화로 바꾼다.",
        "엔트로피가 낮은 확실한 샘플만 선별해 업데이트하고 손실 평탄화를 적용한다.",
        "테스트 시점에 모델 파라미터를 전혀 업데이트하지 않는 정적 추론을 강제한다."
      ],
      answer: 2,
      explanation: "SAR은 노이즈나 이상치 샘플로 인한 모델 파괴를 막기 위해, 엔트로피가 낮은 신뢰성 있는 샘플만 선택하여 업데이트하고 손실 평탄화(Loss Smoothing)를 적용합니다[cite: 4].",
      hint: "신뢰할 수 있는 샘플만 골라내어 안정성을 높이는 방식입니다."
    },
    {
      id: "cat3-tta-tpt-concept-easy-037",
      conceptId: "tpt-test-time-prompt-tuning-steps",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "multiple-choice",
      prompt: "비전언어모델 기반 TTA 기법인 TPT(Test-Time Prompt Tuning)의 핵심 동작 원리는?",
      options: [
        "학습 데이터 전체를 이용해 이미지 인코더 가중치만을 새로 학습시킨다.",
        "테스트 이미지의 다양한 증강본 중 엔트로피가 낮은 것을 골라 텍스트 프롬프트를 갱신한다.",
        "테스트 시점에 들어오는 이미지의 모든 픽셀을 흑백으로 단순 변환한다.",
        "텍스트 프롬프트를 고정하고 이미지 인코더의 모든 레이어를 양자화한다."
      ],
      answer: 1,
      explanation: "TPT는 테스트 이미지의 여러 증강본을 생성한 뒤 엔트로피가 낮은 신뢰도 높은 증강본들의 평균 엔트로피를 최소화하도록 텍스트 프롬프트를 조정합니다[cite: 4].",
      hint: "증강 이미지들과 엔트로피 기반 프롬프트 튜닝의 결합입니다."
    },
    {
      id: "cat3-tta-tpt-sample-selection-easy-038",
      conceptId: "tpt-confidence-selection-criteria",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "multiple-choice",
      prompt: "TPT 기법에서 텍스트 프롬프트 업데이트를 위해 여러 증강 이미지 중 선택하는 기준은?",
      options: [
        "파일의 용량이 가장 크고 해상도가 높은 증강 이미지",
        "색상 대비가 가장 강하고 밝기가 어두운 증강 이미지",
        "가장 먼저 생성되어 대기 큐에 들어온 순서의 증강 이미지",
        "예측 확률의 엔트로피가 가장 낮은 확신도 높은 증강 이미지"
      ],
      answer: 3,
      explanation: "TPT는 여러 증강 뷰 중에서 모델이 확신을 갖고 예측한(엔트로피가 가장 낮은) 뷰들을 선별하여 프롬프트 업데이트 손실을 구성합니다[cite: 4].",
      hint: "모델이 가장 자신 있게 예측한 저엔트로피 샘플 선택입니다."
    },
    {
      id: "cat3-tta-promptalign-concept-easy-039",
      conceptId: "promptalign-distribution-alignment",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "multiple-choice",
      prompt: "PromptAlign 기법이 TPT와 구별되는 주된 특징으로 가장 적절한 것은?",
      options: [
        "학습 데이터의 오프라인 통계와 테스트 데이터 통계 간의 차이를 줄이는 분포 정렬을 수행한다.",
        "테스트 시점에 정답 레이블을 웹 검색으로 실시간 크롤링하여 지도학습한다.",
        "이미지 인코더의 파라미터 수를 100배로 확장하여 모델 용량을 늘린다.",
        "엔트로피 손실을 완전히 배제하고 오직 코사인 유사도 거리만 0으로 맞춘다."
      ],
      answer: 0,
      explanation: "PromptAlign은 학습 시 저장해 둔 소스 데이터의 계층별 통계와 테스트 데이터 통계의 차이를 최소화하는 정렬 손실(Alignment Loss)을 결합하여 프롬프트를 튜닝합니다[cite: 4].",
      hint: "학습 데이터와 테스트 데이터의 통계적 분포를 직접 정렬하는 기법입니다."
    },
    {
      id: "cat3-tta-promptalign-target-easy-040",
      conceptId: "promptalign-text-visual-prompts-update",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "multiple-choice",
      prompt: "PromptAlign 기법에서 분포 정렬 손실과 엔트로피 손실을 결합하여 최종적으로 업데이트하는 대상은?",
      options: [
        "사전 학습된 텍스트 인코더의 모든 트랜스포머 가중치",
        "텍스트 프롬프트와 이미지 프롬프트",
        "이미지 센서의 하드웨어 셔터 스피드 및 조리개 값",
        "데이터스토어에 색인된 모든 문서의 어휘 빈도수"
      ],
      answer: 1,
      explanation: "PromptAlign은 백본 모델 가중치는 동결한 채, 텍스트 프롬프트와 비주얼 프롬프트(Visual Prompts)를 동시에 업데이트하여 정렬을 수행합니다[cite: 4].",
      hint: "텍스트 및 시각적 프롬프트의 동시 튜닝입니다."
    },
    {
      id: "cat3-tta-vs-retrain-easy-041",
      conceptId: "tta-vs-full-retraining-advantage",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "multiple-choice",
      prompt: "TTA 기법이 기존 모델 재학습 방식과 비교하여 실무 환경에서 갖는 주된 장점은?",
      options: [
        "모델의 가중치 파일 용량이 항상 1바이트 이하로 압축된다.",
        "인터넷 연결이 원천 차단되어 하드웨어 메모리가 전혀 소모되지 않는다.",
        "정답 라벨이 없는 실제 테스트 환경에서도 모델 전체 재학습 없이 즉시 적응할 수 있다.",
        "테스트 데이터의 모든 노이즈를 완벽하게 제거하여 100% 무오류를 보장한다."
      ],
      answer: 2,
      explanation: "TTA는 정답 레이블이 주어지지 않는 실시간 배포 환경에서, 모델을 처음부터 다시 학습하지 않고도 입력 데이터에 맞춰 즉각 최적화할 수 있습니다[cite: 4].",
      hint: "무라벨 실시간 환경에서 즉시 적응할 수 있는 장점입니다."
    },
    {
      id: "cat3-tta-norm-shift-fix-easy-042",
      conceptId: "batchnorm-statistics-mismatch-fix",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "multiple-choice",
      prompt: "CNN 기반 TTA 기법인 TENT가 환경 변화로 인한 성능 저하를 완화하는 주요 방법은?",
      options: [
        "모든 입력 이미지를 고정된 단일 평균값으로 치환하여 차이를 없앤다.",
        "모델의 디코더 계층을 모두 삭제하고 입력 데이터를 그대로 통과시킨다.",
        "부동소수점 오버플로우가 발생할 때마다 가속기를 초기화한다.",
        "학습 데이터 기준으로 고정되었던 정규화 통계를 현재 테스트 환경 통계로 맞추어 준다."
      ],
      answer: 3,
      explanation: "TENT는 분포 이동으로 인해 기존 정규화 통계가 어긋났을 때, 테스트 데이터 통계를 바탕으로 배치 정규화 계층을 실시간 적응시켜 성능을 회복합니다[cite: 4].",
      hint: "새로운 테스트 환경의 통계값으로 정규화 파라미터를 맞추어 줍니다."
    },
    {
      id: "cat3-tta-tent-acronym-short-easy-043",
      conceptId: "tent-method-name",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "short-answer",
      prompt: "테스트 데이터 입력 시 배치 정규화 통계를 갱신하고 엔트로피를 최소화하여 파라미터를 미세조정하는 대표적인 TTA 기법의 명칭(4글자)을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "TENT",
        "tent",
        "Tent"
      ],
      explanation: "TENT는 테스트 시점에 배치 정규화 파라미터를 엔트로피 최소화로 업데이트하는 대표적인 TTA 기법입니다[cite: 4].",
      hint: "테스트 타임 엔트로피 최소화 기법의 4글자 영문 명칭입니다."
    },
    {
      id: "cat3-tta-sar-acronym-short-easy-044",
      conceptId: "sar-method-name",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "short-answer",
      prompt: "TENT의 불안정성을 개선하기 위해 엔트로피가 낮은 신뢰성 있는 샘플만 선택하여 모델을 업데이트하는 TTA 기법의 명칭(3글자)을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "SAR",
        "sar",
        "Sar"
      ],
      explanation: "SAR은 저엔트로피의 신뢰도 높은 테스트 샘플을 선별하고 손실 평탄화를 적용하여 TENT보다 안정적인 테스트 타임 적응을 수행하는 기법입니다[cite: 4].",
      hint: "안정적인 적응을 유도하는 3글자 영문 약칭입니다."
    },
    {
      id: "cat3-tta-dist-shift-tent-essay-easy-045",
      conceptId: "distribution-shift-and-tent-essay",
      difficulty: "easy",
      category: "분포 이동과 테스트 타임 도메인 적응",
      questionType: "essay",
      prompt: "인공지능 모델이 배포 환경에서 겪는 분포 이동(Distribution Shift)의 개념과 성능 저하 원인을 설명하고, 대표적인 CNN 기반 TTA 기법인 TENT의 동작 원리를 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "1. 분포 이동(Distribution Shift)의 개념 및 원인:\n학습 시점에 경험한 데이터 분포와 실제 배포 환경(조도 변화, 날씨, 노이즈 등)에서 입력되는 테스트 데이터의 분포가 달라지는 현상입니다[cite: 4]. 이로 인해 모델이 학습 과정에서 익힌 데이터 특성 및 결정 기준이 새로운 환경에 맞지 않아 예측 정확도가 떨어지며, 특히 BatchNorm 기반 모델에서는 저장된 통계와 테스트 통계의 불일치로 성능 저하가 심화됩니다[cite: 4].\n\n2. TENT 기법의 동작 원리:\n- 평균 및 분산 갱신: 테스트 데이터가 입력될 때 배치 정규화(BatchNorm)의 평균과 분산을 현재 테스트 데이터 기준으로 실시간 재계산합니다[cite: 4].\n- 어파인 파라미터 최적화: 정답 라벨 대신 모델 예측의 불확실성을 나타내는 엔트로피 손실을 최소화하도록 역전파를 수행하여 배치 정규화의 스케일(γ)과 이동(β) 파라미터를 미세조정합니다[cite: 4].",
      rubricKeywords: [
        "분포 이동",
        "통계 불일치",
        "TENT",
        "평균 및 분산 재계산",
        "엔트로피 최소화",
        "어파인 파라미터"
      ],
      minLength: 140,
      explanation: "분포 이동의 개념(학습-테스트 간 통계 차이로 인한 성능 저하)과 TENT의 2단계 원리(배치 정규화 통계 실시간 재계산 및 엔트로피 최소화 기반 파라미터 갱신)를 기술해야 합니다[cite: 4].",
      hint: "학습-테스트 환경 차이와 TENT의 평균/분산 재계산 및 엔트로피 최소화 파라미터 조정을 서술하세요."
    },

    // =========================================================================
    // 카테고리 4: 적응적 센싱 및 도메인 전문지식 모델 설계 (15문항: 객관식 12, 단답식 2, 서술형 1)
    // =========================================================================
    {
      id: "cat4-sense-scaling-law-easy-046",
      conceptId: "scaling-law-basic-principles",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "multiple-choice",
      prompt: "초거대 인공지능 발전의 기반이 된 스케일링 법칙(Scaling Law)의 기본 원리는 무엇입니까?",
      options: [
        "모델의 파라미터 크기를 줄일수록 새로운 데이터에 대한 일반화 정확도가 비례하여 증가한다.",
        "모델 크기, 학습 데이터양, 컴퓨팅 자원이 증가할수록 모델의 오류 손실이 예측 가능하게 감소한다.",
        "외부 지식 검색 모듈의 개수가 증가할수록 언어 모델의 디코더 연산 비용이 0으로 수렴한다.",
        "정수 양자화 비트 수를 낮출수록 부동소수점 오버플로우 발생 확률이 지속적으로 증가한다."
      ],
      answer: 1,
      explanation: "스케일링 법칙(Scaling Law)은 컴퓨팅 자원, 학습 데이터양, 모델 파라미터 크기를 늘릴수록 테스트 손실(Test Loss)이 지속적으로 줄어들고 성능이 향상되는 현상을 의미합니다[cite: 4].",
      hint: "모델 크기, 데이터양, 연산량이 늘어날 때의 성능 변화입니다."
    },
    {
      id: "cat4-sense-physical-ai-limits-easy-047",
      conceptId: "physical-ai-scaling-strategy-limits",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "multiple-choice",
      prompt: "실제 물리 환경에서 작동하는 피지컬 AI에서 단순 모델 거대화 전략이 한계에 부딪히는 이유는?",
      options: [
        "물리 환경의 모든 센서 데이터가 항상 고정된 단일 색상으로만 수집되기 때문에",
        "피지컬 AI 로봇은 텍스트 프롬프트를 전혀 이해할 수 없는 하드웨어 구조를 가지기 때문에",
        "모든 물리 로봇의 중앙처리장치가 8비트 정수 연산을 하드웨어적으로 거부하기 때문에",
        "조도, 날씨, 시점, 거리, 모션 블러 등 물리 세계의 무한한 경우의 수를 사전에 모두 학습할 수 없기 때문에"
      ],
      answer: 3,
      explanation: "현실 물리 세계는 조도, 날씨, 시점, 모션 블러 등 환경 변수의 경우의 수가 폭발하므로, 이를 사전에 데이터로 모두 모아 학습시키는 거대화 전략에는 한계가 있습니다[cite: 4].",
      hint: "물리 환경에서 발생하는 폭발적인 경우의 수를 생각해보세요."
    },
    {
      id: "cat4-sense-human-cognition-analogy-easy-048",
      conceptId: "adaptive-sensing-human-analogy",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "multiple-choice",
      prompt: "적응적 센싱이 모방하는 인간 인지 체계의 원리로 가장 적절한 것은?",
      options: [
        "글씨가 흐리면 안경을 쓰고 눈이 부시면 선글라스를 쓰듯 센서를 환경에 맞춰 조절하는 방식",
        "흐린 글씨를 읽기 위해 뇌의 기억 용량을 100만 배로 확장하여 암기하는 방식",
        "어두운 곳에서 잘 보기 위해 흐린 사진 수백만 장을 머릿속으로 시뮬레이션하는 방식",
        "눈을 감고 청각 신호만을 활용하여 앞선 문맥의 다음 단어를 예측하는 방식"
      ],
      answer: 0,
      explanation: "인간은 세상이 잘 안 보일 때 뇌를 키우는 대신 안경이나 선글라스 같은 도구로 감각기관을 조절하듯, 적응적 센싱은 환경에 맞춰 센서를 제어해 모델이 좋아하는 좋은 데이터를 취득합니다[cite: 4].",
      hint: "안경을 쓰거나 선글라스를 착용하는 인간의 감각 조절 비유입니다."
    },
    {
      id: "cat4-sense-vs-model-generalization-easy-049",
      conceptId: "adaptive-sensing-vs-domain-generalization",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "multiple-choice",
      prompt: "도메인 일반화 방식과 적응적 센싱 방식의 차이점으로 옳은 것은?",
      options: [
        "모델 일반화는 센서 셔터 스피드를 조절하고 적응적 센싱은 신경망 가중치를 양자화한다.",
        "모델 일반화는 온디바이스에서만 적용되고 적응적 센싱은 슈퍼컴퓨터에서만 동작한다.",
        "모델 일반화는 모델의 지식 영역을 넓히고 적응적 센싱은 센서를 조절해 데이터를 모델 영역 안으로 넣는다.",
        "두 방식 모두 모델의 파라미터 크기를 실시간으로 10배씩 확장하여 분포 이동을 해결한다."
      ],
      answer: 2,
      explanation: "모델 일반화는 모델이 맞출 수 있는 지식 영역을 넓히는 전략인 반면, 적응적 센싱은 센서 파라미터를 능동 제어하여 낯선 데이터를 모델이 잘 아는 분포(ID) 안으로 들여보내는 전략입니다[cite: 4].",
      hint: "모델의 지식을 넓히는 방식과 센서를 조절해 데이터를 맞추는 방식의 차이입니다."
    },
    {
      id: "cat4-sense-imagenet-es-dataset-easy-050",
      conceptId: "imagenet-es-dataset-features",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "multiple-choice",
      prompt: "적응적 센싱 연구를 위해 구축된 ImageNet-ES 및 SenseShift6D 데이터셋의 공통적 특징은?",
      options: [
        "포토샵 같은 디지털 후처리 변환으로 인공 노이즈를 합성한 텍스트 데이터셋이다.",
        "생성형 확산 모델을 활용해 프롬프트 기반으로 무작위 생성한 가상 이미지 데이터셋이다.",
        "의료 수면다원검사 장비에서 수집된 뇌파 신호만을 흑백 이미지로 변환한 데이터셋이다.",
        "동일 장면에 대해 조도와 카메라 센서 파라미터를 물리적으로 변경하며 직접 촬영한 데이터셋이다."
      ],
      answer: 3,
      explanation: "ImageNet-ES와 SenseShift6D는 인공적인 그래픽 합성이 아니라, 실제 조도와 하드웨어 센서 파라미터(ISO, 셔터스피드, 조리개, 노출 등)를 물리적으로 변경하며 직접 촬영한 적응적 센싱 데이터셋입니다[cite: 4].",
      hint: "실제 하드웨어 카메라 센서 파라미터를 조절하며 수집한 데이터셋입니다."
    },
    {
      id: "cat4-sense-lens-framework-steps-easy-051",
      conceptId: "lens-framework-four-steps",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "multiple-choice",
      prompt: "적응적 센싱 프레임워크인 Lens가 최적의 이미지를 획득하는 처리 과정으로 옳은 것은?",
      options: [
        "센서 파라미터 후보 선택 -> 다중 캡처 -> 모델 확신도 기반 비전 테스트 -> 최적 파라미터 선택",
        "모델 가중치 양자화 -> 4비트 정수 변환 -> 비트 쉬프팅 -> 어댑터 병합",
        "비라벨 코퍼스 수집 -> 다음 단어 예측 -> 지도 미세조정 -> 보상 모델 평가",
        "배치 정규화 폴딩 -> 레이어 정규화 근사 -> 소프트맥스 변환 -> 프롬프트 튜닝"
      ],
      answer: 0,
      explanation: "Lens는 (1) 센서 후보 선택(CSA) -> (2) 후보 파라미터로 다중 이미지 캡처 -> (3) 대상 모델로 비전 테스트 및 확신도 점수 계산 -> (4) 점수가 가장 높은 최적 파라미터 선택 순으로 동작합니다[cite: 4].",
      hint: "센서 후보를 고르고 촬영하여 모델 확신도가 가장 높은 이미지를 선택하는 과정입니다."
    },
    {
      id: "cat4-sense-lens-efficiency-result-easy-052",
      conceptId: "lens-vs-giant-model-performance",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "multiple-choice",
      prompt: "Lens 연구에서 밝혀진 소형 모델과 적응적 센싱 결합의 성능 효과로 옳은 것은?",
      options: [
        "초거대 모델을 사용하면 센서 제어와 무관하게 항상 100%의 정확도를 유지한다.",
        "적응적 센싱을 결합한 소형 모델이 일반 자동 노출을 사용한 초거대 모델보다 높은 정확도를 달성한다.",
        "센서 제어는 오직 대형 모델에서만 효과가 있으며 소형 모델에서는 성능이 저하된다.",
        "자동 노출을 적용한 초거대 모델이 적응적 센싱을 적용한 소형 모델보다 50% 이상 우수하다."
      ],
      answer: 1,
      explanation: "실험 결과, 50배 작고 200만 배 적은 데이터로 학습된 소형 모델(EfficientNet-B3)에 Lens를 적용한 것이 일반 자동 노출(AE)을 쓴 초거대 모델(OpenCLIP-h)보다 4~10% 더 우수한 정확도를 달성했습니다[cite: 4].",
      hint: "모델만 무작정 키우는 것보다 센서를 똑똑하게 제어하는 것이 더 효율적이라는 결과입니다."
    },
    {
      id: "cat4-sense-domain-knowledge-need-easy-053",
      conceptId: "need-for-domain-expertise-in-ai",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "multiple-choice",
      prompt: "인공지능 모델을 특정 산업 및 의료 도메인에 적용할 때 도메인 전문지식이 필요한 주된 이유는?",
      options: [
        "도메인 전문지식이 없으면 딥러닝 역전파 손실 함수 수식을 정의할 수 없기 때문에",
        "모든 도메인의 데이터가 동일한 통계 분포를 가지므로 단일 모델로 통합하기 위해",
        "도메인의 물리적 규칙과 전문가 판독 원리를 모델 구조에 반영하여 불필요한 시행착오를 줄이기 위해",
        "도메인 전문가가 모델의 모든 파라미터 가중치를 수작업으로 직접 입력해야 하기 때문에"
      ],
      answer: 2,
      explanation: "도메인 전문지식(규칙, 인지 방식 등)을 모델 구조에 반영(Inductive Bias)하면 불필요한 시행착오 없이 데이터 효율적으로 모델을 설계할 수 있습니다[cite: 4].",
      hint: "전문 지식을 구조에 반영하여 학습 효율을 높이는 목적입니다."
    },
    {
      id: "cat4-sense-sleep-psg-to-image-easy-054",
      conceptId: "psg-time-series-to-image-idea",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "multiple-choice",
      prompt: "수면다원검사(PSG) 자동 판독 AI 설계 시 30초 생체신호를 흑백 이미지로 변환한 도메인 지식적 배경은?",
      options: [
        "수면 전문기사들이 화면에 펼쳐진 생체신호 파형의 시각적 형태를 보고 판독하는 특성을 반영하기 위해",
        "시계열 신호는 GPU에서 연산할 수 없어 이미지 포맷으로 변환해야만 하드웨어 가속이 가능하므로",
        "모든 환자의 뇌파 신호가 동일한 흑백 이미지 패턴으로만 수집되기 때문에",
        "음성 인식 트랜스포머 모델을 그대로 재활용하여 텍스트로 디코딩하기 위해"
      ],
      answer: 0,
      explanation: "수면 전문기사들은 센서 수치 자체보다 화면에 펼쳐진 생체신호 파형의 시각적 형태를 보고 판독하므로, 도메인 지식을 반영해 30초 에폭 화면을 흑백 이미지로 변환하여 비전 작업으로 접근했습니다[cite: 4].",
      hint: "전문가가 파형을 눈으로 보고 채점하는 임상적 방식을 모델 설계에 반영한 것입니다."
    },
    {
      id: "cat4-sense-sleep-vit-suitability-easy-055",
      conceptId: "psg-vit-suitability-domain-knowledge",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "multiple-choice",
      prompt: "수면 단계 판독 모델에서 CNN 대신 비전 트랜스포머(ViT) 구조가 더 적합하다고 판단한 도메인 지식적 이유는?",
      options: [
        "비전 트랜스포머는 8비트 정수 연산만 지원하여 임베디드 칩셋에서만 단독 실행되기 때문에",
        "수면다원검사는 환자의 신체 움직임이 전혀 없으므로 어텐션 연산이 0으로 단순화되기 때문에",
        "생체신호 축의 위치마다 신호 종류가 다르고 전체 채널 간의 상호 관계를 파악해야 하므로",
        "CNN은 흑백 이미지를 처리할 수 없고 오직 컬러 RGB 이미지만 처리할 수 있기 때문에"
      ],
      answer: 2,
      explanation: "다채널 생체신호는 공간적 인접성이나 이동 불변성(CNN의 가정)이 성립하지 않으며, 신호 축의 위치마다 의미가 다르므로 위치 임베딩과 어텐션을 활용하는 ViT가 더 적합합니다[cite: 4].",
      hint: "생체신호 채널 간의 관계성과 위치별 의미 차이를 고려한 모델 선택입니다."
    },
    {
      id: "cat4-sense-sleep-apnea-ahi-easy-056",
      conceptId: "sleep-apnea-ahi-index-definition",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "multiple-choice",
      prompt: "수면 무호흡증 진단에서 질환의 중증도를 평가하기 위해 사용하는 핵심 지표인 AHI의 의미는?",
      options: [
        "수면 중 뇌파의 평균 진폭과 주파수 비율",
        "하룻밤 동안 수면 단계가 전환된 총 횟수",
        "산소포화도가 정상 범위를 유지한 총 시간",
        "수면 1시간당 발생하는 무호흡 및 저호흡 사건의 횟수"
      ],
      answer: 3,
      explanation: "AHI(Apnea-Hypopnea Index, 무호흡-저호흡 지수)는 수면 1시간당 발생하는 무호흡(Apnea) 및 저호흡(Hypopnea)의 평균 발생 횟수를 나타내는 핵심 진단 지표입니다[cite: 4].",
      hint: "수면 1시간당 발생하는 호흡 장애 이벤트의 횟수입니다."
    },
    {
      id: "cat4-sense-sleep-apnea-arousal-easy-057",
      conceptId: "respiratory-vs-spontaneous-arousal-separation",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "multiple-choice",
      prompt: "적외선 영상 기반 비접촉식 수면 무호흡증 진단 AI 설계 시 도메인 지식을 활용해 해결한 핵심 과제는?",
      options: [
        "모든 환자의 수면 영상을 4K 컬러 고화질로 복원하는 작업",
        "단순 뒤척임인 자발적 각성과 무호흡으로 인한 호흡 각성을 영상에서 구분하는 작업",
        "병원용 수면다원검사 센서 10여 개를 환자 신체에 직접 부착하는 작업",
        "환자의 호흡 음성을 텍스트로 변환하여 자연어 요약을 생성하는 작업"
      ],
      answer: 1,
      explanation: "비접촉 수면 무호흡 진단에서는 단순한 수면 중 뒤척임(자발적 각성)과 무호흡으로 인해 숨이 막혀 깨어나는 '호흡 각성(Respiratory Arousal)'을 정확히 분리해내는 것이 임상적 정확도의 핵심입니다[cite: 4].",
      hint: "무호흡에 의한 호흡 각성과 단순 수면 뒤척임을 구분하는 작업입니다."
    },
    {
      id: "cat4-sense-ahi-acronym-short-easy-058",
      conceptId: "ahi-index-term",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "short-answer",
      prompt: "수면 1시간당 발생하는 무호흡 및 저호흡 사건의 횟수를 나타내는 진단 지표인 '무호흡-저호흡 지수'의 영문 약자(3글자)를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "AHI",
        "ahi"
      ],
      explanation: "무호흡-저호흡 지수의 영문 약자는 AHI(Apnea-Hypopnea Index)입니다[cite: 4].",
      hint: "Apnea-Hypopnea Index의 3글자 약어입니다."
    },
    {
      id: "cat4-sense-psg-epoch-short-easy-059",
      conceptId: "sleep-psg-time-unit-epoch",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "short-answer",
      prompt: "수면다원검사(PSG)에서 수면 단계를 판독할 때 사용하는 기본 시간 단위인 30초 구간을 일컫는 용어를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [
        "에폭",
        "Epoch",
        "epoch",
        "에포크"
      ],
      explanation: "수면다원검사에서 수면 기사들이 뇌파 및 생체신호 파형을 판독하는 기본 시간 단위는 30초이며 이를 에폭(Epoch)이라고 부릅니다[cite: 4].",
      hint: "수면 단계 판독의 기본 30초 단위 용어입니다."
    },
    {
      id: "cat4-sense-adaptive-sensing-essay-easy-060",
      conceptId: "adaptive-sensing-and-domain-knowledge-essay",
      difficulty: "easy",
      category: "적응적 센싱 및 도메인 지식 모델 설계",
      questionType: "essay",
      prompt: "물리 환경에서 단순 모델 확장(스케일링) 전략이 갖는 한계를 설명하고, 적응적 센싱(Adaptive Sensing)이 센서 제어를 통해 분포 이동 문제를 해결하는 원리와 효과를 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "1. 단순 모델 확장 전략의 한계:\n실제 물리 세계에서는 조도, 날씨, 시점, 거리, 모션 블러 등 환경 변수의 경우의 수가 무한히 발생하므로, 이를 사전에 데이터로 모두 수집하여 모델을 무작정 키우는 방식은 비용과 자원 면에서 한계에 부딪힙니다[cite: 4].\n\n2. 적응적 센싱의 원리 및 효과:\n- 동작 원리: 사람이 눈이 나쁠 때 안경을 쓰듯, 주변 환경 변화에 맞춰 카메라 센서 파라미터(ISO, 셔터 스피드 등)를 지능적으로 조절하여 대상 모델이 가장 잘 인식할 수 있는 최적의 데이터를 취득합니다[cite: 4].\n- 효과: 낯선 데이터를 모델이 이미 잘 아는 데이터 분포(ID) 영역 안으로 들여보내므로, 모델을 거대화하거나 추가 재학습하지 않고도 작은 모델로 높은 정확도를 달성할 수 있습니다[cite: 4].",
      rubricKeywords: [
        "물리 환경 경우의 수 한계",
        "인간 인지체계 모방 (안경 비유)",
        "센서 파라미터 제어",
        "데이터 분포 이동 억제",
        "작은 모델 고효율 달성"
      ],
      minLength: 140,
      explanation: "단순 모델 확장의 물리적 한계와, 적응적 센싱이 센서 제어로 데이터를 모델 지식 영역 안으로 유도하여 저비용 고효율로 분포 이동을 해결하는 원리를 서술해야 합니다[cite: 4].",
      hint: "물리 환경의 무한한 변수 한계와 센서 제어(안경 비유)를 통한 분포 이동 해결 원리를 설명하세요."
    }
  ],
  medium: [],
  hard: [],
  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();