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
    // 카테고리 1: 컴퓨터의 수 체계 (고정소수점과 부동소수점 기초) - 15문항
    // =========================================================================
    {
      id: "cat1-num-sys-bits-bytes-easy-001",
      conceptId: "bits-bytes-nibble-definition",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "multiple-choice",
      prompt: "컴퓨터 시스템의 데이터 단위에 대한 설명으로 가장 올바른 것은?[cite: 3]",
      options: [
        "1바이트는 4비트로 구성되며 니블은 8비트로 구성된다[cite: 3].",
        "가장 왼쪽에 위치한 비트를 최하위 비트라고 부른다[cite: 3].",
        "4비트로 이루어진 데이터 단위를 니블이라고 부른다[cite: 3].",
        "1바이트가 표현할 수 있는 서로 다른 패턴의 수는 128가지이다[cite: 3]."
      ],
      answer: 2,
      explanation: "1바이트는 8비트이며, 4비트(반 바이트)로 이루어진 단위를 니블(Nibble)이라고 부릅니다[cite: 3]. 가장 왼쪽 비트는 최상위 비트(MSB)입니다[cite: 3].",
      hint: "4비트 단위의 명칭을 떠올려보세요[cite: 3]."
    },
    {
      id: "cat1-num-sys-twos-complement-range-easy-002",
      conceptId: "twos-complement-range-formula",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "multiple-choice",
      prompt: "N비트 2의 보수 표현 방식에서 나타낼 수 있는 정수의 값 범위로 옳은 것은?[cite: 3]",
      options: [
        "-2^(N-1) 부터 2^(N-1) - 1 까지[cite: 3]",
        "0 부터 2^N - 1 까지[cite: 3]",
        "-(2^(N-1) - 1) 부터 2^(N-1) - 1 까지[cite: 3]",
        "-2^N 부터 2^N - 1 까지[cite: 3]"
      ],
      answer: 0,
      explanation: "N비트 2의 보수 표현의 범위는 -2^(N-1)부터 2^(N-1) - 1까지입니다[cite: 3]. 예를 들어 4비트의 경우 -8부터 +7까지 표현할 수 있습니다[cite: 3].",
      hint: "음수 범위가 양수 최댓값보다 1개 더 많은 2의 보수 범위를 생각해보세요[cite: 3]."
    },
    {
      id: "cat1-num-sys-overflow-detection-easy-003",
      conceptId: "twos-complement-overflow-detection",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "multiple-choice",
      prompt: "2의 보수 덧셈 연산에서 오버플로우 발생 여부를 판별하는 올바른 기준은?[cite: 3]",
      options: [
        "최상위 자리올림 비트가 발생하는지 여부로 판별한다[cite: 3].",
        "연산 결과의 최하위 비트가 0에서 1로 반전되는지 여부로 판별한다[cite: 3].",
        "두 피연산자의 비트 자릿수가 서로 일치하지 않는지 여부로 판별한다[cite: 3].",
        "동일한 부호의 두 수를 더했을 때 결과의 부호가 반대로 바뀌는지 여부로 판별한다[cite: 3]"
      ],
      answer: 3,
      explanation: "2의 보수 덧셈에서는 자리올림 발생 여부와 무관하게, 양수끼리 더해 음수가 나오거나 음수끼리 더해 양수가 나오는 등 부호 비트의 비정상적 변화로 오버플로우를 판단합니다[cite: 3].",
      hint: "부호가 같은 두 수를 더했을 때 결과 부호가 어떻게 변하는지 확인하세요[cite: 3]."
    },
    {
      id: "cat1-num-sys-scaling-factor-mult-easy-004",
      conceptId: "fixed-point-multiplication-scaling-factor",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "multiple-choice",
      prompt: "고정소수점 수 체계에서 스케일링 인자 a가 적용된 두 수를 곱셈할 때 하드웨어 연산 결과의 처리 방식으로 옳은 것은?[cite: 3]",
      options: [
        "스케일링 인자가 자동으로 유지되므로 추가 시프트 없이 정수 곱셈 결과를 그대로 취한다[cite: 3].",
        "곱셈 결과에는 스케일링 인자가 두 번 반영되므로, 원래 스케일에 맞도록 추가적인 스케일 보정을 수행한다[cite: 3].",
        "두 수의 소수부 비트를 모두 0으로 초기화한 뒤 정수부만 곱셈을 수행한다[cite: 3].",
        "지수부를 서로 더한 후 바이어스 상수를 한 번 차감하는 방식으로 처리한다[cite: 3]."
      ],
      answer: 1,
      explanation: "고정소수점 곱셈에서는 두 입력의 스케일이 곱해지므로, 결과를 원래 고정소수점 형식의 스케일에 맞추기 위한 재조정이 필요합니다[cite: 3].",
      hint: "스케일링 인자가 제곱으로 커지는 문제를 해결하기 위한 보정 과정입니다[cite: 3]."
    },
    {
      id: "cat1-num-sys-sign-extension-easy-005",
      conceptId: "bit-width-extension-methods",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "multiple-choice",
      prompt: "부호 있는 2의 보수 숫자의 비트 폭을 확장할 때 원래의 수 크기를 유지하는 올바른 방법은?[cite: 3]",
      options: [
        "새로 확장되는 상위 비트들을 무조건 0으로 채우는 제로 확장[cite: 3]",
        "최하위 비트를 복사하여 새로 추가된 상위 비트들을 채우는 방식[cite: 3]",
        "모든 비트를 1의 보수로 반전시킨 후 최상위 비트에 1을 더하는 방식[cite: 3]",
        "원래 숫자의 최상위 부호 비트를 복사하여 확장된 상위 비트를 채우는 부호 확장[cite: 3]"
      ],
      answer: 3,
      explanation: "부호 있는 2의 보수 숫자의 비트 폭을 늘릴 때는 최상위 부호 비트(MSB)를 복사하여 확장된 상위 비트를 채우는 부호 확장(Sign Extension)을 적용해야 원래 값이 보존됩니다[cite: 3].",
      hint: "음수와 양수의 부호를 유지하기 위해 최상위 비트를 채우는 확장 방식입니다[cite: 3]."
    },
    {
      id: "cat1-num-sys-fp-components-easy-006",
      conceptId: "floating-point-three-components",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "multiple-choice",
      prompt: "부동소수점 수 체계에서 숫자를 표현하기 위해 나누는 세 가지 기본 구성 요소는?[cite: 3]",
      options: [
        "부호, 지수, 가수[cite: 3]",
        "정수, 소수, 분수[cite: 3]",
        "기수, 승수, 제수[cite: 3]",
        "바이트, 워드, 니블[cite: 3]"
      ],
      answer: 0,
      explanation: "부동소수점은 부호(Sign), 지수(Exponent), 가수(Mantissa 또는 Significand)의 세 요소로 구성되어 아주 크거나 작은 수를 효과적으로 표현합니다[cite: 3].",
      hint: "부동소수점 수식에 들어가는 3가지 구성 요소를 떠올려보세요[cite: 3]."
    },
    {
      id: "cat1-num-sys-normalization-easy-007",
      conceptId: "floating-point-normalization-concept",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "multiple-choice",
      prompt: "부동소수점 표현에서 유효숫자를 최대한 확보하고 일정한 표준 형태로 표현하기 위해 가수와 지수를 조정하는 과정은?[cite: 3]",
      options: [
        "양자화[cite: 3]",
        "정규화[cite: 3]",
        "역색인[cite: 3]",
        "지식증류[cite: 3]"
      ],
      answer: 1,
      explanation: "부동소수점 수를 일정한 표준 형태로 맞추어 유효숫자를 효과적으로 사용하도록 가수와 지수를 조정하는 과정을 정규화(Normalization)라고 합니다[cite: 3].",
      hint: "표준적인 형태로 수의 표현을 맞추는 용어입니다[cite: 3]."
    },
    {
      id: "cat1-num-sys-biased-exponent-easy-008",
      conceptId: "biased-exponent-advantage",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "multiple-choice",
      prompt: "부동소수점에서 실제 지수에 바이어스를 더해 편향 지수로 저장하는 주된 이유는?[cite: 3]",
      options: [
        "가수부의 비트 수를 2배로 확장하여 정밀도를 획기적으로 개선하기 위해[cite: 3]",
        "소수점의 물리적 위치를 메모리에 고정시켜 덧셈 연산을 생략하기 위해[cite: 3]",
        "지수부를 양수 영역으로 이동시켜 부호 없는 정수처럼 대소를 쉽게 비교하기 위해[cite: 3]",
        "모든 부동소수점 연산을 2의 보수 정수 가산기로만 완벽히 대체하기 위해[cite: 3]"
      ],
      answer: 2,
      explanation: "지수에 바이어스를 더하면 음수 지수도 모두 0 이상의 양수로 변환되므로, 부호 없는 정수 비교 방식을 그대로 활용해 두 수의 지수 크기를 쉽게 비교할 수 있습니다[cite: 3].",
      hint: "지수의 부호를 없애 대소 비교를 쉽게 만드는 목적입니다[cite: 3]."
    },
    {
      id: "cat1-num-sys-ieee754-single-easy-009",
      conceptId: "ieee754-single-precision-bits",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "multiple-choice",
      prompt: "IEEE 754 단정밀도(FP32) 부동소수점 표준의 비트 할당 구성으로 옳은 것은?[cite: 3]",
      options: [
        "부호 1비트, 지수 8비트, 가수 23비트[cite: 3]",
        "부호 1비트, 지수 11비트, 가수 20비트[cite: 3]",
        "부호 2비트, 지수 8비트, 가수 22비트[cite: 3]",
        "부호 1비트, 지수 5비트, 가수 26비트[cite: 3]"
      ],
      answer: 0,
      explanation: "IEEE 754 단정밀도(FP32)는 부호 1비트, 지수 8비트, 가수 23비트로 총 32비트를 구성합니다[cite: 3].",
      hint: "32비트 float 자료형의 부호, 지수, 가수 비트 수입니다[cite: 3]."
    },
    {
      id: "cat1-num-sys-hidden-bit-easy-010",
      conceptId: "ieee754-hidden-bit-concept",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "multiple-choice",
      prompt: "IEEE 754 단정밀도 포맷에서 가수를 1.f 형태로 정규화할 때 맨 앞의 1을 메모리에 저장하지 않는 기법은?[cite: 3]",
      options: [
        "제로 비트[cite: 3]",
        "패리티 비트[cite: 3]",
        "더미 비트[cite: 3]",
        "히든 비트[cite: 3]"
      ],
      answer: 3,
      explanation: "정규화된 이진 부동소수점에서는 소수점 앞자리가 항상 1이므로 이를 굳이 저장하지 않고 생략하여 1비트의 정밀도를 추가로 확보하는 기법을 히든 비트(Hidden Bit)라고 합니다[cite: 3].",
      hint: "항상 1로 정해져 있어 숨겨두는 비트라는 의미입니다[cite: 3]."
    },
    {
      id: "cat1-num-sys-special-values-easy-011",
      conceptId: "ieee754-special-values-infinity-nan",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "multiple-choice",
      prompt: "IEEE 754 표준에서 지수 비트가 모두 1이고(255) 가수 비트가 0이 아닐 때 나타내는 특수값은?[cite: 3]",
      options: [
        "양의 무한대[cite: 3]",
        "NaN[cite: 3]",
        "비정규화수[cite: 3]",
        "음의 무한대[cite: 3]"
      ],
      answer: 1,
      explanation: "지수 비트가 모두 1(255)일 때 가수가 0이면 무한대이며, 가수가 0이 아니면 정의되지 않은 값인 NaN(Not a Number)을 나타냅니다[cite: 3].",
      hint: "지수 비트가 모두 1일 때 가수 비트가 0인지 아닌지를 확인하세요[cite: 3]."
    },
    {
      id: "cat1-num-sys-bf16-structure-easy-012",
      conceptId: "bf16-format-characteristics",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "multiple-choice",
      prompt: "딥러닝에서 널리 쓰이는 BF16 부동소수점 포맷의 구조적 특징으로 옳은 것은?[cite: 3]",
      options: [
        "FP16보다 가수를 16비트로 늘리고 지수를 3비트로 축소하여 정밀도를 높인 포맷이다[cite: 3].",
        "지수 비트를 완전히 제거하고 정수와 소수만 고정 비율로 기록하는 고정소수점 포맷이다[cite: 3].",
        "FP32와 동일하게 지수 8비트를 유지하여 표현 범위를 보존하고 가수만 7비트로 줄인 포맷이다[cite: 3]",
        "64비트 배정밀도 표준에서 부호 비트만을 반전시켜 음수 연산 속도를 높인 포맷이다[cite: 3]."
      ],
      answer: 2,
      explanation: "BF16(Bfloat16)은 FP32의 지수 8비트를 그대로 유지하여 넓은 표현 범위를 보존하면서, 가수를 7비트로 줄여 16비트로 구성한 포맷입니다[cite: 3].",
      hint: "FP32의 넓은 표현 범위를 그대로 유지하면서 비트 수를 반으로 줄인 형태입니다[cite: 3]."
    },
    {
      id: "cat1-num-sys-twos-comp-short-easy-013",
      conceptId: "twos-complement-conversion-steps",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "short-answer",
      prompt: "2의 보수 표현 방식에서 양수 이진수를 음수로 부호 반전시키기 위해 모든 비트를 반전시킨 후 마지막에 더해주어야 하는 숫자를 작성하시오.[cite: 3]",
      options: [],
      answer: null,
      acceptedAnswers: [
        "1",
        "1을 더한다",
        "1 더하기"
      ],
      explanation: "2의 보수에서 부호 반전은 모든 비트를 0은 1로, 1은 0으로 반전(1의 보수)한 뒤 최하위 비트에 1을 더해 완성합니다[cite: 3].",
      hint: "비트를 전부 뒤집은 뒤 더하는 가장 작은 자연수입니다[cite: 3]."
    },
    {
      id: "cat1-num-sys-msb-short-easy-014",
      conceptId: "most-significant-bit-term",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "short-answer",
      prompt: "이진수에서 가장 왼쪽에 위치하여 가장 큰 자리값을 가지는 최상위 비트의 영문 약자(3글자)를 작성하시오.[cite: 3]",
      options: [],
      answer: null,
      acceptedAnswers: [
        "MSB",
        "msb"
      ],
      explanation: "가장 왼쪽에 위치한 비트는 Most Significant Bit의 약자인 MSB라고 부릅니다[cite: 3].",
      hint: "Most Significant Bit의 영문 약자입니다[cite: 3]."
    },
    {
      id: "cat1-num-sys-fixed-vs-fp-essay-easy-015",
      conceptId: "fixed-vs-floating-point-comparison",
      difficulty: "easy",
      category: "컴퓨터의 수 체계",
      questionType: "essay",
      prompt: "컴퓨터가 실수를 표현하는 두 가지 방식인 고정소수점과 부동소수점의 표현 구조 차이와 각각의 장단점을 비교하여 설명하시오.[cite: 3]",
      options: [],
      answer: null,
      modelAnswer: "1. 표현 구조의 차이:\n고정소수점은 정수부와 소수부의 비트 자릿수를 미리 고정하여 숫자를 표현합니다[cite: 3]. 반면 부동소수점은 부호, 지수, 가수의 세 부분으로 나누어 소수점의 위치를 동적으로 이동시키며 숫자를 표현합니다[cite: 3].\n\n2. 장단점 비교:\n- 고정소수점: 하드웨어 연산 구조가 정수와 동일하여 연산 속도가 빠르고 회로가 단순하지만, 표현할 수 있는 숫자의 범위가 좁습니다[cite: 3].\n- 부동소수점: 지수를 활용하므로 아주 크거나 매우 작은 수를 넓은 범위에서 표현할 수 있지만, 지수 정렬과 정규화 과정이 필요하여 하드웨어 연산이 더 복잡합니다[cite: 3].",
      rubricKeywords: [
        "정수부와 소수부 고정",
        "부호, 지수, 가수",
        "표현 범위",
        "연산 복잡도"
      ],
      minLength: 120,
      explanation: "고정소수점의 정수/소수 고정 구조 및 빠른 연산과 좁은 범위, 부동소수점의 부호/지수/가수 구조 및 넓은 범위와 연산 복잡도를 명확히 서술해야 합니다[cite: 3].",
      hint: "비트 분할 구조의 차이와 표현 범위 및 연산 복잡도 관점에서 장단점을 비교하세요[cite: 3]."
    },

    // =========================================================================
    // 카테고리 2: 컴퓨터 연산 복잡도 및 모델 경량화 배경 - 15문항
    // =========================================================================
    {
      id: "cat2-comp-fixed-op-latency-easy-016",
      conceptId: "fixed-point-operator-complexity-trend",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "multiple-choice",
      prompt: "고정소수점 정수 연산에서 하드웨어 연산 속도와 면적 복잡도의 일반적인 경향으로 옳은 것은?[cite: 3]",
      options: [
        "덧셈과 뺄셈이 가장 빠르고 면적이 작으며 나눗셈이 가장 느리고 복잡하다[cite: 3].",
        "나눗셈이 가장 빠르고 면적이 작으며 덧셈과 뺄셈이 가장 느리고 복잡하다[cite: 3].",
        "곱셈이 덧셈보다 훨씬 빠르고 하드웨어 회로 면적을 적게 차지한다[cite: 3].",
        "모든 기본 산술 연산자의 연산 속도와 하드웨어 면적은 동일하다[cite: 3]."
      ],
      answer: 0,
      explanation: "고정소수점 연산 속도와 면적 효율은 덧셈과 뺄셈이 가장 우수하며, 그 다음이 곱셈이고, 나눗셈이 가장 느리고 하드웨어 복잡도가 큽니다[cite: 3].",
      hint: "가장 단순한 가산기와 가장 복잡한 제산기의 차이를 생각해보세요[cite: 3]."
    },
    {
      id: "cat2-comp-fp-addition-steps-easy-017",
      conceptId: "floating-point-addition-alignment-step",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "multiple-choice",
      prompt: "부동소수점 덧셈을 수행할 때 가수끼리 더하기 전에 반드시 먼저 수행해야 하는 단계는?[cite: 3]",
      options: [
        "가수의 모든 비트를 반전시킨 후 2의 보수를 취하는 단계[cite: 3]",
        "지수끼리 먼저 곱한 후 바이어스 값을 두 번 차감하는 단계[cite: 3]",
        "두 수의 지수를 비교하여 작은 쪽의 가수를 시프트시켜 지수를 일치시키는 단계[cite: 3]",
        "부호 비트를 0으로 초기화하여 음수를 모두 양수로 바꾸는 단계[cite: 3]"
      ],
      answer: 2,
      explanation: "부동소수점 덧셈/뺄셈은 가수 연산 전에 두 피연산자의 지수를 비교하여, 작은 쪽의 가수를 시프트시켜 지수를 동일하게 맞추는 지수 정렬 과정이 필수적입니다[cite: 3].",
      hint: "자릿수를 맞추기 위해 지수를 일치시키는 과정을 떠올려보세요[cite: 3]."
    },
    {
      id: "cat2-comp-fp-multiplication-steps-easy-018",
      conceptId: "floating-point-multiplication-bias-step",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "multiple-choice",
      prompt: "바이어스가 적용된 부동소수점 두 수를 곱할 때 지수부 처리 방식으로 옳은 것은?[cite: 3]",
      options: [
        "두 지수를 곱한 후 바이어스 값을 제곱하여 더한다[cite: 3].",
        "두 지수를 더한 후 중복된 바이어스 값을 한 번 차감한다[cite: 3].",
        "두 지수를 나눈 후 바이어스 값을 그대로 유지한다[cite: 3].",
        "지수부는 전혀 변경하지 않고 오직 가수만 곱한다[cite: 3]."
      ],
      answer: 1,
      explanation: "두 편향 지수를 더하면 바이어스가 이중으로 더해지므로 (E1_true + bias + E2_true + bias), 지수를 더한 뒤 바이어스를 한 번 차감해야 올바른 편향 지수가 됩니다[cite: 3].",
      hint: "더해진 바이어스 상수를 하나 제거해야 하는 원리입니다[cite: 3]."
    },
    {
      id: "cat2-comp-gpu-format-history-easy-019",
      conceptId: "gpu-precision-evolution-timeline",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "multiple-choice",
      prompt: "최신 상용 인공지능 GPU가 지원하는 연산 포맷의 발전 흐름으로 가장 적절한 것은?[cite: 3]",
      options: [
        "저정밀도 정수 포맷을 폐지하고 128비트 이상의 고정밀도 실수 연산 중심으로 전환되었다[cite: 3].",
        "부동소수점 연산기를 완전히 제거하고 오직 비트 연산 전용 논리 게이트로 단순화되었다[cite: 3].",
        "모든 제조사의 GPU가 단 하나의 표준 단정밀도 포맷만을 사용하도록 강제되었다[cite: 3].",
        "고정밀도(FP32/FP64) 중심에서 저정밀도 및 양자화 포맷(FP16, INT8, FP8, FP4)으로 다양화되었다[cite: 3]"
      ],
      answer: 3,
      explanation: "GPU 아키텍처는 과거 FP32 중심에서 딥러닝 연산 효율과 메모리 절감을 위해 FP16, INT8, BF16, FP8, FP4 등 다양한 저비트 포맷을 지원하는 방향으로 진화했습니다[cite: 3].",
      hint: "연산 속도를 높이고 메모리를 줄이기 위해 도입된 다양한 비트 포맷들을 생각해보세요[cite: 3]."
    },
    {
      id: "cat2-comp-model-size-growth-easy-020",
      conceptId: "llm-parameter-growth-challenge",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "multiple-choice",
      prompt: "최근 거대 언어 모델의 급격한 크기 증가로 인해 발생하는 대표적인 시스템적 과제는?[cite: 3]",
      options: [
        "모델 파라미터 수와 연산량이 급증하여 GPU 메모리 부족과 서빙 비용이 크게 증가한다[cite: 3].",
        "모델의 자연어 생성 속도가 너무 빨라져 네트워크 대역폭 부족 문제가 발생한다[cite: 3].",
        "단어 임베딩의 잠재 공간 차원이 축소되어 언어 모델의 문법 추론 능력이 저하된다[cite: 3].",
        "언어 모델의 레이어 수가 증가하면서 정밀도 손실로 인한 가중치 역전파 계산이 불가능해진다[cite: 3]."
      ],
      answer: 0,
      explanation: "인공지능 모델의 파라미터 수와 요구 연산량이 기하급수적으로 커짐에 따라, 막대한 메모리 사용량과 전력 소비, 고비용 인프라 문제가 발생하고 있습니다[cite: 3].",
      hint: "모델 크기와 연산 자원 요구량이 급증하면서 생기는 문제입니다[cite: 3]."
    },
    {
      id: "cat2-comp-on-device-need-easy-021",
      conceptId: "on-device-ai-model-compression-need",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "multiple-choice",
      prompt: "스마트폰이나 자율주행 차량 같은 온디바이스 환경에서 모델 경량화가 필수적인 이유는?[cite: 3]",
      options: [
        "클라우드 서버와의 통신 대역폭을 독점하여 데이터 전송 속도를 높이기 위해[cite: 3]",
        "온디바이스 칩셋의 캐시 메모리 구조를 단일 정밀도 부동소수점으로 통일하기 위해[cite: 3]",
        "인터넷 연결이 필요 없는 환경에서 모델 가중치를 텍스트 문서 형태로 보관하기 위해[cite: 3]",
        "제한된 하드웨어 메모리와 배터리 전력 조건에서 실시간 추론을 수행해야 하기 때문에[cite: 3]"
      ],
      answer: 3,
      explanation: "모바일이나 차량용 칩셋은 메모리와 전력이 제한적이므로, 모델의 크기를 줄이고 정수 기반 연산으로 가속화하여 실시간으로 동작하도록 경량화해야 합니다[cite: 3].",
      hint: "제한된 하드웨어 자원과 실시간 처리 요구사항을 생각해보세요[cite: 3]."
    },
    {
      id: "cat2-comp-tesla-fsd-quant-easy-022",
      conceptId: "tesla-fsd-int8-quantization-case",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "multiple-choice",
      prompt: "테슬라의 자율주행 FSD 칩에서 차량 내 실시간 신경망 처리를 위해 적용한 대표적인 경량화 방식은?[cite: 3]",
      options: [
        "64비트 배정밀도 부동소수점 연산[cite: 3]",
        "128비트 확장 부동소수점 연산[cite: 3]",
        "INT8 양자화[cite: 3]",
        "가중치 비지도 사전학습[cite: 3]"
      ],
      answer: 2,
      explanation: "테슬라 FSD 칩은 차량 내 실시간 AI 추론을 위해 INT8 양자화를 적용하여 곱셈 및 누산 연산을 효율적으로 처리하고 전력 소모를 최소화합니다[cite: 3].",
      hint: "차량용 프로세서에서 전력과 지연을 줄이기 위해 사용한 정수 포맷입니다[cite: 3]."
    },
    {
      id: "cat2-comp-compression-methods-list-easy-023",
      conceptId: "four-resource-efficient-techniques",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "multiple-choice",
      prompt: "인공지능 모델의 리소스 효율화를 위해 활용되는 주요 기법들로 바르게 묶인 것은?[cite: 3]",
      options: [
        "역전파, 경사하강법, 오버플로우, 언더플로우[cite: 3]",
        "양자화, 가지치기, 지식 증류, 파라미터 효율적 파인튜닝[cite: 3]",
        "부호확장, 제로확장, 비정규화, 라운딩[cite: 3]",
        "질의추출, 문서검색, 인덱싱, 데이터스토어[cite: 3]"
      ],
      answer: 1,
      explanation: "리소스 효율적 모델 활용의 핵심 기법으로는 양자화(Quantization), 가지치기(Pruning), 지식 증류(Distillation), 파라미터 효율적 파인튜닝(PEFT)이 있습니다[cite: 3].",
      hint: "비트 축소, 가중치 제거, 지식 전수, 일부 파라미터 튜닝 기법입니다[cite: 3]."
    },
    {
      id: "cat2-comp-gpu-friendly-pruning-easy-024",
      conceptId: "gpu-friendly-structured-pruning",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "multiple-choice",
      prompt: "일반적인 상용 GPU에서 실제 연산 속도 가속 효과를 얻기에 가장 유리한 가지치기 방식은?[cite: 3]",
      options: [
        "채널이나 레이어 단위로 규칙성 있게 잘라내는 정형 가지치기[cite: 3]",
        "임의의 위치를 무작위로 0으로 만드는 비정형 가지치기[cite: 3]",
        "소수점 이하 자릿수만 선택적으로 제거하는 소수부 가지치기[cite: 3]",
        "지수 비트의 상위 2비트만 0으로 채우는 지수 가지치기[cite: 3]"
      ],
      answer: 0,
      explanation: "비정형 가지치기는 불규칙한 메모리 접근으로 GPU에서 가속이 어렵지만, 채널이나 블록 단위로 제거하는 정형(Structured) 가지치기는 하드웨어 연산 가속에 유리합니다[cite: 3].",
      hint: "규칙적인 블록이나 채널 단위로 크기를 줄이는 구조입니다[cite: 3]."
    },
    {
      id: "cat2-comp-tradeoff-accuracy-easy-025",
      conceptId: "compression-accuracy-tradeoff",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "multiple-choice",
      prompt: "모델 경량화 기술을 적용할 때 일반적으로 고려해야 하는 성능 간의 관계(트레이드오프)는?[cite: 3]",
      options: [
        "모델의 비트 수를 줄일수록 학습에 소요되는 데이터 요구량이 무한대로 늘어난다[cite: 3].",
        "가중치를 제거할수록 모델의 파라미터 저장 용량이 항상 선형적으로 증가한다[cite: 3].",
        "모델의 압축률을 지나치게 높일수록 원래 모델의 예측 정확도가 저하될 수 있다[cite: 3].",
        "경량화를 적용하면 하드웨어의 전력 소모량이 원래보다 항상 10배 이상 증가한다[cite: 3]."
      ],
      answer: 2,
      explanation: "모델을 강하게 압축(양자화, 가지치기 등)할수록 메모리와 연산량은 줄어들지만, 원본 모델의 표현력이 손실되어 정확도(Accuracy)가 떨어질 수 있는 트레이드오프가 존재합니다[cite: 3].",
      hint: "압축률과 정확도 사이의 균형 관계를 생각해보세요[cite: 3]."
    },
    {
      id: "cat2-comp-energy-scaling-easy-026",
      conceptId: "bit-width-energy-consumption",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "multiple-choice",
      prompt: "32비트 부동소수점 연산 대신 8비트 정수 연산을 도입할 때 얻을 수 있는 하드웨어적 이점은?[cite: 3]",
      options: [
        "메모리 대역폭 요구량이 4배 늘어나고 연산기 회로 면적이 2배 커진다[cite: 3].",
        "메모리 전송량이 크게 줄어들고 연산기 회로 면적과 소비 에너지가 감소한다[cite: 3].",
        "부동소수점 오버플로우가 사라지는 대신 연산 지연시간이 4배 증가한다[cite: 3].",
        "하드웨어 곱셈기 회로의 정밀도가 향상되어 소수점 이하 유효숫자가 증가한다[cite: 3]."
      ],
      answer: 1,
      explanation: "비트 폭을 32비트에서 8비트로 줄이면 메모리 전송량이 1/4로 감소하고, 연산기 회로 면적과 소비 에너지가 대폭 줄어듭니다[cite: 3].",
      hint: "비트 수가 줄어들 때 하드웨어 회로 면적과 전력 소모에 미치는 영향입니다[cite: 3]."
    },
    {
      id: "cat2-comp-mixed-precision-quant-easy-027",
      conceptId: "mixed-precision-quantization-concept",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "multiple-choice",
      prompt: "신경망의 레이어별 중요도나 특성에 따라 서로 다른 비트 정밀도를 차등 적용하는 경량화 기법은?[cite: 3]",
      options: [
        "단일 정밀도 균일 양자화[cite: 3]",
        "비정형 무작위 가지치기[cite: 3]",
        "전역 완전 파인튜닝[cite: 3]",
        "혼합 정밀도 양자화[cite: 3]"
      ],
      answer: 3,
      explanation: "혼합 정밀도 양자화(Mixed-precision Quantization)는 레이어나 모듈 단위로 최적화된 서로 다른 양자화 비트폭을 적용하여 정확도와 효율을 동시에 달성하는 기법입니다[cite: 3].",
      hint: "레이어별로 서로 다른 정밀도를 섞어서 적용하는 양자화 기법입니다[cite: 3]."
    },
    {
      id: "cat2-comp-kilo-mega-giga-short-easy-028",
      conceptId: "power-of-two-giga-approximation",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "short-answer",
      prompt: "이진수 체계에서 2의 30제곱을 십진수 단위로 근사하여 부를 때 사용하는 단위 명칭을 영문으로 작성하시오.[cite: 3]",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Giga",
        "giga",
        "GIGA",
        "기가",
        "1 Giga",
        "1giga"
      ],
      explanation: "2의 10제곱은 Kilo(약 1천), 2의 20제곱은 Mega(약 1백만), 2의 30제곱은 Giga(약 10억)에 해당합니다[cite: 3].",
      hint: "Kilo, Mega 다음으로 이어지는 단위입니다[cite: 3]."
    },
    {
      id: "cat2-comp-overflow-term-short-easy-029",
      conceptId: "exponent-overflow-term",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "short-answer",
      prompt: "연산 결과의 지수 값이 표현 가능한 최대 지수 범위를 초과하여 너무 큰 수가 되었을 때 발생하는 오류 현상의 영문 명칭을 작성하시오.[cite: 3]",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Overflow",
        "overflow",
        "OVERFLOW",
        "오버플로우",
        "오버플로",
        "Exponent Overflow",
        "exponent overflow"
      ],
      explanation: "표현 가능한 최댓값을 초과하는 현상을 오버플로우(Overflow)라고 부릅니다[cite: 3].",
      hint: "범위 위로 넘쳐흐른다는 의미의 영단어입니다[cite: 3]."
    },
    {
      id: "cat2-comp-why-compression-essay-easy-030",
      conceptId: "model-compression-necessity-reasons",
      difficulty: "easy",
      category: "컴퓨터 연산 및 경량화 배경",
      questionType: "essay",
      prompt: "거대 언어 모델의 발전 과정에서 모델 경량화 기술이 필수적으로 요구되는 배경과 이유를 연산 비용 및 하드웨어 제약 관점에서 설명하시오.[cite: 3]",
      options: [],
      answer: null,
      modelAnswer: "1. 모델 크기 및 연산 비용 증가:\n최신 언어 모델은 파라미터 수가 수십억~수천억 개에 달해 학습 및 추론에 막대한 컴퓨팅 자원(FLOPs)과 고가의 인프라 비용이 소모됩니다[cite: 3].\n\n2. 하드웨어 메모리 및 전력 제약:\n대규모 모델을 그대로 사용하면 GPU 메모리 용량을 초과하거나 대역폭 병목이 발생하며, 스마트폰이나 차량 같은 온디바이스 기기에서는 배터리 전력과 메모리 한계로 인해 실시간 서빙이 불가능합니다[cite: 3].\n따라서 양자화나 가지치기 등의 경량화 기술을 통해 모델 크기와 메모리 사용량을 줄이고 추론 속도를 높여 실제 서비스에 배포할 수 있도록 해야 합니다[cite: 3].",
      rubricKeywords: [
        "파라미터 수 증가",
        "연산 비용",
        "메모리 한계",
        "온디바이스 배포",
        "추론 속도"
      ],
      minLength: 120,
      explanation: "모델 파라미터 및 연산 비용의 폭발적 증가와 함께 메모리 용량 및 온디바이스 환경의 하드웨어 한계를 극복하기 위해 경량화가 필수적임을 서술해야 합니다[cite: 3].",
      hint: "모델 크기 증가에 따른 비용 문제와 엣지 디바이스의 하드웨어 제약을 연결하여 작성하세요[cite: 3]."
    },

    // =========================================================================
    // 카테고리 3: 모델 압축 기법 (양자화, 가지치기, 지식 증류) - 15문항
    // =========================================================================
    {
      id: "cat3-quant-concept-easy-031",
      conceptId: "quantization-basic-definition",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "multiple-choice",
      prompt: "모델 경량화 기법 중 양자화(Quantization)의 기본 원리로 가장 올바른 것은?[cite: 3]",
      options: [
        "중요도가 낮은 연결을 찾아내어 신경망의 가중치 행렬에서 완전히 삭제하는 방식[cite: 3]",
        "대형 모델의 출력 확률 분포를 모사하도록 소형 학생 모델을 학습시키는 방식[cite: 3]",
        "가중치 및/또는 활성화 값의 표현 정밀도를 낮춰 메모리와 연산 비용을 절감하는 방식[cite: 3]",
        "모델의 입력 프롬프트 앞에 학습 가능한 가상의 토큰 벡터를 덧붙이는 방식[cite: 3]"
      ],
      answer: 2,
      explanation: "양자화는 FP32나 FP16과 같은 고정밀도 실수를 INT8, INT4 등 더 적은 비트 수의 데이터 형식으로 변환하여 메모리와 연산 부하를 줄이는 기술입니다[cite: 3].",
      hint: "데이터의 표현 비트 수(정밀도)를 낮추는 기법입니다[cite: 3]."
    },
    {
      id: "cat3-quant-qat-vs-ptq-easy-032",
      conceptId: "qat-vs-ptq-comparison",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "multiple-choice",
      prompt: "양자화 기법 중 학습 후 양자화(PTQ)에 대한 설명으로 옳은 것은?[cite: 3]",
      options: [
        "모델을 처음부터 다시 훈련하는 과정에서 양자화 손실을 함께 역전파한다[cite: 3].",
        "사전 학습이 완료된 모델에 추가적인 재학습 없이 양자화를 바로 적용한다[cite: 3].",
        "학습 데이터 전체를 사용해 모든 가중치를 수십 에포크 이상 미세조정한다[cite: 3].",
        "오직 합성곱 신경망에만 적용 가능하며 대규모 언어 모델에는 적용할 수 없다[cite: 3]."
      ],
      answer: 1,
      explanation: "PTQ(Post-Training Quantization)는 이미 훈련이 완료된 모델을 바탕으로 재학습 없이 소량의 보정(Calibration) 데이터만을 활용해 빠르게 양자화를 수행하는 방식입니다[cite: 3].",
      hint: "학습이 끝난 후에 적용하는 사후 양자화 방식입니다[cite: 3]."
    },
    {
      id: "cat3-quant-symmetric-vs-asym-easy-033",
      conceptId: "symmetric-vs-asymmetric-quantization",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "multiple-choice",
      prompt: "비대칭(Asymmetric) 양자화가 대칭(Symmetric) 양자화와 구별되는 주된 특징은?[cite: 3]",
      options: [
        "데이터의 비대칭 분포를 맞추기 위해 영점(Zero-point) 파라미터를 도입한다[cite: 3].",
        "모든 음수 가중치를 0으로 강제 변환하여 양수 영역만 표현하도록 제한한다[cite: 3].",
        "스케일링 팩터를 전혀 사용하지 않고 오직 반올림 연산만 직접 적용한다[cite: 3].",
        "부동소수점의 지수 비트만을 선택적으로 잘라내어 정수로 변환한다[cite: 3]."
      ],
      answer: 0,
      explanation: "비대칭 양자화는 데이터 분포의 중심이 0이 아닐 때 이를 보정하기 위해 영점(Zero-point) 파라미터를 추가하여 양자화 범위를 효율적으로 매핑합니다[cite: 3].",
      hint: "분포의 치우침을 보정하기 위해 사용하는 기준점 파라미터를 떠올려보세요[cite: 3]."
    },
    {
      id: "cat3-quant-weight-only-easy-034",
      conceptId: "weight-only-vs-weight-activation",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "multiple-choice",
      prompt: "가중치 전용(Weight-only) 양자화 방식의 연산 처리 특징으로 옳은 것은?[cite: 3]",
      options: [
        "가중치와 활성화 값을 모두 저비트로 양자화하여 정수 연산기로만 처리한다[cite: 3].",
        "활성화 값만 저비트로 줄이고 가중치는 64비트 배정밀도를 그대로 유지한다[cite: 3].",
        "모든 가중치를 0으로 초기화하고 입력 데이터만을 바탕으로 추론을 수행한다[cite: 3].",
        "가중치만 저비트로 저장해두고 행렬 연산 시점에 고정밀도로 역양자화하여 계산한다[cite: 3]"
      ],
      answer: 3,
      explanation: "Weight-only 양자화는 모델 저장 크기를 줄이기 위해 가중치만 4비트 등으로 압축해 두고, 추론 연산 시에는 활성화 값 정밀도(FP16 등)로 역양자화(Dequant)하여 행렬 곱을 수행합니다[cite: 3].",
      hint: "가중치만 압축하여 저장하고 연산 시점에 복원하는 구조입니다[cite: 3]."
    },
    {
      id: "cat3-pruning-concept-easy-035",
      conceptId: "pruning-basic-concept-definition",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "multiple-choice",
      prompt: "모델 경량화 기법 중 가지치기(Pruning)의 핵심 동작 원리는 무엇입니까?[cite: 3]",
      options: [
        "모든 32비트 부동소수점 가중치를 8비트 정수 형태로 비트 폭을 변환한다[cite: 3].",
        "신경망에서 모델 성능에 기여도가 낮은 불필요한 가중치를 제거하여 가볍게 만든다[cite: 3].",
        "큰 교사 모델의 출력값을 작은 학생 모델이 모방하도록 손실 함수를 구성한다[cite: 3].",
        "어텐션 레이어의 가중치 행렬을 두 개의 작은 저차원 행렬 곱으로 분해한다[cite: 3]."
      ],
      answer: 1,
      explanation: "가지치기는 모델 성능에 미치는 영향이 적은 가중치나 구조를 제거하여 신경망을 희소화하고, 저장 및 연산 효율을 높이는 기술입니다[cite: 3].",
      hint: "나무의 불필요한 가지를 잘라내듯 가중치를 제거하는 기술입니다[cite: 3]."
    },
    {
      id: "cat3-pruning-structured-vs-unstructured-easy-036",
      conceptId: "structured-vs-unstructured-pruning",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "multiple-choice",
      prompt: "가지치기 방식 중 비정형(Unstructured) 가지치기의 특징으로 옳은 것은?[cite: 3]",
      options: [
        "채널이나 레이어 전체를 통째로 제거하여 하드웨어 가속이 매우 단순하다[cite: 3].",
        "살아남은 가중치의 위치를 기록하기 위한 인덱스 정보가 전혀 필요 없다[cite: 3].",
        "모든 필터의 가로세로 크기를 1x1 단위로 균일하게 축소하여 연산한다[cite: 3].",
        "가중치 행렬 전체에서 위치와 상관없이 개별 가중치 단위로 자유롭게 제거한다[cite: 3]"
      ],
      answer: 3,
      explanation: "비정형(Unstructured) 가지치기는 개별 가중치 단위로 중요도를 따져 제거하므로 압축률 대비 정확도 보존이 뛰어나지만, 0의 위치가 불규칙하여 인덱스 정보가 필요합니다[cite: 3].",
      hint: "특정 패턴 없이 개별 가중치 단위로 잘라내는 방식입니다[cite: 3]."
    },
    {
      id: "cat3-pruning-magnitude-rule-easy-037",
      conceptId: "magnitude-based-pruning-rule",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "multiple-choice",
      prompt: "가장 기본적이고 직관적인 가지치기 기준인 크기 기반(Magnitude-based) 가지치기의 규칙은?[cite: 3]",
      options: [
        "절댓값이 0에 가까운 작은 가중치부터 우선적으로 제거한다[cite: 3].",
        "가장 최근에 학습된 가중치부터 역순으로 우선 제거한다[cite: 3].",
        "양수 가중치만 남기고 모든 음수 가중치를 제거한다[cite: 3].",
        "무작위 난수를 생성하여 홀수 번째 가중치만 제거한다[cite: 3]."
      ],
      answer: 0,
      explanation: "크기 기반 가지치기는 가중치의 절댓값 크기가 작을수록 모델 출력에 미치는 영향이 적다고 가정하고, 절댓값이 작은 가중치부터 순서대로 제거합니다[cite: 3].",
      hint: "가중치의 절댓값 크기를 기준으로 삼는 방식입니다[cite: 3]."
    },
    {
      id: "cat3-distill-concept-easy-038",
      conceptId: "knowledge-distillation-concept",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "multiple-choice",
      prompt: "지식 증류(Knowledge Distillation)의 기본 구조에 대한 설명으로 옳은 것은?[cite: 3]",
      options: [
        "작은 모델 여러 개를 합쳐서 하나의 거대한 앙상블 모델로 결합한다[cite: 3].",
        "모든 사전 학습 가중치를 삭제하고 정답 레이블만으로 처음부터 다시 훈련한다[cite: 3].",
        "크고 똑똑한 교사 모델의 지식을 작고 가벼운 학생 모델로 전달하여 학습시킨다[cite: 3].",
        "모델의 파라미터 비트 수를 64비트에서 1비트로 강제 변환하여 실행한다[cite: 3]."
      ],
      answer: 2,
      explanation: "지식 증류는 성능이 뛰어난 대형 교사 모델(Teacher)의 지식(출력 확률 분포 등)을 상대적으로 작은 학생 모델(Student)이 배우도록 유도하여 소형 모델의 성능을 끌어올리는 기법입니다[cite: 3].",
      hint: "선생님 모델이 학생 모델을 가르치는 구조입니다[cite: 3]."
    },
    {
      id: "cat3-distill-loss-components-easy-039",
      conceptId: "distillation-loss-composition",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "multiple-choice",
      prompt: "지식 증류에서 학생 모델을 학습시킬 때 사용하는 전체 손실(Total Loss)의 구성은?[cite: 3]",
      options: [
        "보상 모델의 점수 손실과 정책 모델의 강화학습 손실의 결합[cite: 3]",
        "학생 모델의 정답 손실과 교사-학생 간의 증류 손실의 결합[cite: 3]",
        "역문서 빈도 손실과 단어 빈도 손실의 결합[cite: 3]",
        "양자화 스케일링 손실과 클리핑 손실의 결합[cite: 3]"
      ],
      answer: 1,
      explanation: "지식 증류의 전체 손실은 실제 정답(Ground truth)에 대한 학생 모델의 손실(Student Loss)과 교사 모델의 출력 분포를 모방하는 증류 손실(Distillation Loss)의 합으로 구성됩니다[cite: 3].",
      hint: "실제 정답과의 차이 및 교사 모델 출력과의 차이를 모두 반영합니다[cite: 3]."
    },
    {
      id: "cat3-distill-assistant-model-easy-040",
      conceptId: "teacher-assistant-knowledge-distillation",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "multiple-choice",
      prompt: "지식 증류에서 교사와 학생 모델의 크기 차이가 너무 클 때 조교 모델을 도입하는 이유는?[cite: 3]",
      options: [
        "교사와 학생 모델 사이의 지식 전달 격차를 단계적으로 줄여 증류 효율을 높이기 위해[cite: 3]",
        "학생 모델의 파라미터 비트 수를 4비트로 양자화하여 연산 속도를 가속하기 위해[cite: 3]",
        "교사 모델의 모든 가중치를 삭제하고 조교 모델만 독립적으로 서빙하기 위해[cite: 3]",
        "학생 모델의 학습 데이터셋 크기를 100배로 확장하여 과적합을 방지하기 위해[cite: 3]"
      ],
      answer: 0,
      explanation: "선생님 모델이 너무 크고 학생 모델이 너무 작아 학습 효율이 떨어질 때, 그 사이에 중간 크기의 조교 모델(Teacher Assistant)을 두어 단계적으로 지식을 전달하는 방식을 사용합니다[cite: 3].",
      hint: "선생님과 학생 사이의 간극을 메워주는 조교의 역할을 떠올려보세요[cite: 3]."
    },
    {
      id: "cat3-distill-synthetic-data-easy-041",
      conceptId: "llm-distillation-synthetic-data",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "multiple-choice",
      prompt: "거대 언어 모델 환경에서 대형 상용 모델을 교사로 삼아 소형 모델을 지식 증류할 때 주로 사용하는 방법은?[cite: 3]",
      options: [
        "교사 모델의 모든 신경망 가중치 행렬을 파일로 다운로드하여 학생 모델에 덮어쓴다[cite: 3].",
        "학생 모델의 모든 활성화 함수를 선형 함수로 교체하여 교사 모델과 일치시킨다[cite: 3].",
        "교사 모델의 역전파 그래디언트를 학생 모델의 메모리에 직접 복사한다[cite: 3].",
        "교사 모델에 프롬프트를 입력하여 얻은 응답 데이터를 활용해 학생 모델을 파인튜닝한다[cite: 3]"
      ],
      answer: 3,
      explanation: "대형 상용 LLM의 내부 가중치를 직접 알 수 없더라도, 프롬프트 입력을 통해 교사 모델이 생성한 양질의 응답(합성 데이터)을 수집하여 학생 모델을 미세조정하는 방식으로 지식 증류를 수행합니다[cite: 3].",
      hint: "고성능 모델이 생성한 답변 데이터를 학습 데이터로 활용하는 방식입니다[cite: 3]."
    },
    {
      id: "cat3-quant-calibration-easy-042",
      conceptId: "ptq-calibration-dataset-role",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "multiple-choice",
      prompt: "학습 후 양자화(PTQ)를 수행할 때 데이터의 분포 범위를 파악하고 스케일링 팩터를 결정하기 위해 사용하는 소량의 데이터는?[cite: 3]",
      options: [
        "테스트 데이터[cite: 3]",
        "검증 데이터[cite: 3]",
        "보정 데이터[cite: 3]",
        "합성 데이터[cite: 3]"
      ],
      answer: 2,
      explanation: "PTQ에서는 가중치와 활성화 값의 실제 값 분포 범위를 파악하여 적절한 스케일링 팩터를 계산하기 위해 소량의 보정 데이터(Calibration Data)를 입력해 활성화 범위를 측정합니다[cite: 3].",
      hint: "수치를 올바르게 보정하기 위해 투입하는 데이터입니다[cite: 3]."
    },
    {
      id: "cat3-quant-qat-acronym-short-easy-043",
      conceptId: "qat-full-name-expansion",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "short-answer",
      prompt: "모델을 학습시키는 과정에서 양자화 효과를 함께 모사하여 정확도 손실을 줄이는 기법인 QAT의 영문 전체 명칭을 작성하시오.[cite: 3]",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Quantization Aware Training",
        "quantization aware training",
        "Quantization-Aware Training",
        "quantization-aware training",
        "Quantization aware training"
      ],
      explanation: "QAT는 Quantization Aware Training(양자화 인지 학습)의 약자입니다[cite: 3].",
      hint: "Quantization A____ Training (3단어)[cite: 3]"
    },
    {
      id: "cat3-quant-ptq-acronym-short-easy-044",
      conceptId: "ptq-full-name-expansion",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "short-answer",
      prompt: "사전 학습이 완료된 모델에 대해 추가적인 재학습 없이 양자화를 바로 적용하는 기법인 PTQ의 영문 전체 명칭을 작성하시오.[cite: 3]",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Post Training Quantization",
        "post training quantization",
        "Post-Training Quantization",
        "post-training quantization",
        "Post training quantization"
      ],
      explanation: "PTQ는 Post-Training Quantization(학습 후 양자화)의 약자입니다[cite: 3].",
      hint: "Post-T_______ Quantization (3단어)[cite: 3]"
    },
    {
      id: "cat3-compress-three-methods-essay-easy-045",
      conceptId: "three-compression-methods-essay",
      difficulty: "easy",
      category: "모델 압축 기법",
      questionType: "essay",
      prompt: "모델 경량화의 대표적인 3가지 기법인 양자화(Quantization), 가지치기(Pruning), 지식 증류(Distillation)의 핵심 동작 원리를 각각 간략히 설명하시오.[cite: 3]",
      options: [],
      answer: null,
      modelAnswer: "1. 양자화 (Quantization):\n가중치나 활성화 값의 표현 비트 수(예: 32비트 부동소수점)를 8비트 정수 등 더 낮은 비트 수로 줄여 메모리 사용량과 연산 부하를 절감하는 기법입니다[cite: 3].\n\n2. 가지치기 (Pruning):\n신경망에서 모델의 예측 성능에 미치는 영향이 적은 불필요한 가중치나 연결을 제거(0으로 설정)하여 신경망을 희소화하고 효율을 높이는 기법입니다[cite: 3].\n\n3. 지식 증류 (Distillation):\n크고 성능이 뛰어난 교사(Teacher) 모델의 출력 지식을 작고 가벼운 학생(Student) 모델이 모방하여 학습하도록 유도함으로써 작은 모델의 성능을 높이는 기법입니다[cite: 3].",
      rubricKeywords: [
        "비트 수 축소",
        "불필요한 가중치 제거",
        "희소화",
        "교사 모델",
        "학생 모델",
        "지식 모방"
      ],
      minLength: 140,
      explanation: "양자화(비트 정밀도 축소), 가지치기(불필요한 가중치 제거 및 희소화), 지식 증류(교사 모델의 지식을 학생 모델로 전수)의 핵심 개념을 각각 명확히 서술해야 합니다[cite: 3].",
      hint: "비트 수 축소, 가중치 제거, 교사-학생 모델 지식 전수의 세 가지 관점으로 기술하세요[cite: 3]."
    },

    // =========================================================================
    // 카테고리 4: 파라미터 효율적 파인튜닝 (PEFT, LoRA, QLoRA 및 실습) - 15문항
    // =========================================================================
    {
      id: "cat4-peft-full-tuning-problem-easy-046",
      conceptId: "full-fine-tuning-limitations",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "multiple-choice",
      prompt: "거대 언어 모델에서 모든 가중치를 업데이트하는 전체 파인튜닝(Full Fine-Tuning)의 문제점으로 옳은 것은?[cite: 3]",
      options: [
        "새로운 도메인에 대한 적응 능력이 완전히 상실되어 정확도가 0이 된다[cite: 3].",
        "모델의 모든 가중치를 갱신해야 하므로 학습 비용과 메모리 부담이 매우 크다[cite: 3].",
        "학습 가능한 파라미터 수가 부족하여 추가적인 레이어 삽입이 불가능하다[cite: 3].",
        "인간 평가자의 주관적 피드백 없이는 역전파 그래디언트가 계산되지 않는다[cite: 3]."
      ],
      answer: 1,
      explanation: "전체 파인튜닝(Full Fine-Tuning)은 모델의 모든 파라미터를 업데이트해야 하므로 막대한 연산 비용과 GPU 메모리가 요구되며, 기존 지식을 잊어버리는 망각 위험이 있습니다[cite: 3].",
      hint: "모든 파라미터를 재학습할 때 발생하는 비용과 메모리 부담을 생각해보세요[cite: 3]."
    },
    {
      id: "cat4-peft-concept-definition-easy-047",
      conceptId: "peft-basic-concept-definition",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "multiple-choice",
      prompt: "파라미터 효율적 파인튜닝(PEFT)의 핵심 아이디어로 가장 올바른 것은?[cite: 3]",
      options: [
        "모델의 모든 레이어를 삭제하고 1개의 출력 레이어만 새로 학습시킨다[cite: 3].",
        "사전 학습된 가중치를 1비트 이진수로 변환하여 역전파 연산을 생략한다[cite: 3].",
        "학습 데이터를 투입하지 않고 오직 하이퍼파라미터 난수 조정만 수행한다[cite: 3].",
        "기본 모델의 대부분의 가중치를 고정하고 소수의 파라미터만 선택적으로 학습한다[cite: 3]"
      ],
      answer: 3,
      explanation: "PEFT(Parameter Efficient Fine-Tuning)는 원본 모델의 전체 가중치를 모두 갱신하지 않고, 소수의 파라미터만을 추가하거나 선택하여 효율적으로 학습시키는 방식입니다[cite: 3].",
      hint: "대부분의 가중치는 고정하고 일부 파라미터만 효율적으로 튜닝하는 기법입니다[cite: 3]."
    },
    {
      id: "cat4-peft-adapter-layer-easy-048",
      conceptId: "peft-adapter-layer-approach",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "multiple-choice",
      prompt: "PEFT 기법 중 어댑터(Adapter) 방식의 동작 원리에 대한 설명으로 옳은 것은?[cite: 3]",
      options: [
        "프롬프트 입력 문맥 앞에 학습 가능한 가짜 토큰을 추가하여 모델을 조정한다[cite: 3].",
        "가중치 행렬 전체를 완전히 삭제하고 새로운 합성곱 필터를 연결한다[cite: 3].",
        "모델 내부의 특정 레이어 사이에 작은 추가 모듈을 삽입하여 해당 부분만 학습한다[cite: 3].",
        "어텐션 연산 과정의 모든 소프트맥스 함수를 제거하고 정수로만 계산한다[cite: 3]."
      ],
      answer: 2,
      explanation: "어댑터(Adapter) 방식은 원본 모델의 레이어 사이에 작은 병목 형태의 추가 모듈(MLP 등)을 삽입하고, 원본 가중치는 고정한 채 어댑터 모듈만 학습시키는 방식입니다[cite: 3].",
      hint: "레이어 사이에 작은 보조 모듈을 끼워 넣는 구조입니다[cite: 3]."
    },
    {
      id: "cat4-peft-prompt-tuning-easy-049",
      conceptId: "peft-prompt-tuning-approach",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "multiple-choice",
      prompt: "PEFT 기법 중 프롬프트 튜닝(Prompt Tuning) 방식에 대한 설명으로 옳은 것은?[cite: 3]",
      options: [
        "모델의 모든 어텐션 가중치 행렬을 저차원 행렬 곱으로 분해하여 학습한다[cite: 3].",
        "각 트랜스포머 레이어마다 새로운 활성화 함수를 추가하여 미세조정한다[cite: 3].",
        "사용자가 입력한 텍스트의 길이를 무조건 10토큰 이내로 강제 압축한다[cite: 3].",
        "입력 임베딩 앞부분에 학습 가능한 가상 토큰을 추가하여 모델의 출력을 조정한다[cite: 3]"
      ],
      answer: 3,
      explanation: "프롬프트 튜닝(Prompt Tuning)은 모델 본체 구조를 전혀 건드리지 않고, 입력 임베딩 앞이나 중간에 학습 가능한 연속 벡터(가상 토큰, pseudo-token)를 추가하여 원하는 동작을 유도합니다[cite: 3].",
      hint: "입력 임베딩 앞에 학습 가능한 토큰을 덧붙이는 방식입니다[cite: 3]."
    },
    {
      id: "cat4-peft-lora-low-rank-easy-050",
      conceptId: "lora-low-rank-decomposition-principle",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "multiple-choice",
      prompt: "LoRA(Low-Rank Adaptation)가 파라미터 수를 대폭 줄여 학습하는 핵심 수학적 원리는?[cite: 3]",
      options: [
        "가중치 행렬의 모든 원소를 0과 1의 이진수로 치환하여 행렬 곱을 수행한다[cite: 3].",
        "가중치 업데이트 변화량을 두 개의 작은 저랭크 행렬의 곱으로 분해하여 학습한다[cite: 3].",
        "어텐션 가중치 행렬에서 홀수 번째 열과 행을 완전히 삭제한다[cite: 3].",
        "출력층의 모든 소프트맥스 확률 값을 균일 분포로 강제 고정한다[cite: 3]."
      ],
      answer: 1,
      explanation: "LoRA는 기존 가중치는 동결하고, 가중치 변화량 행렬 ΔW를 랭크 r을 갖는 두 개의 작은 저차원 행렬 A와 B의 곱(B x A)으로 분해하여 학습 파라미터 수를 획기적으로 줄입니다[cite: 3].",
      hint: "큰 행렬 업데이트를 작은 두 행렬의 곱(Low-Rank)으로 근사하는 원리입니다[cite: 3]."
    },
    {
      id: "cat4-peft-qlora-concept-easy-051",
      conceptId: "qlora-4bit-quantization-integration",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "multiple-choice",
      prompt: "QLoRA(Quantized LoRA)가 LoRA보다 메모리 사용량을 더 크게 절감할 수 있는 이유는?[cite: 3]",
      options: [
        "기본 모델 가중치를 4비트로 양자화하여 동결하고 어댑터만 고정밀도로 학습하므로[cite: 3]",
        "어댑터 행렬 A와 B를 완전히 제거하고 텍스트 프롬프트만 수정하므로[cite: 3]",
        "학습 과정에서 역전파 그래디언트 계산을 100% 생략하므로[cite: 3]",
        "트랜스포머의 어텐션 레이어를 모두 삭제하고 선형 회귀로 대체하므로[cite: 3]"
      ],
      answer: 0,
      explanation: "QLoRA는 기본 모델의 가중치를 4비트(NF4 등)로 양자화하여 GPU 메모리 점유율을 크게 낮추고, 그 위에 결합된 LoRA 어댑터는 고정밀도(BF16 등)로 학습하여 고성능을 유지합니다[cite: 3].",
      hint: "기본 모델을 4비트로 양자화한 상태에서 LoRA를 적용하는 기술입니다[cite: 3]."
    },
    {
      id: "cat4-peft-lora-rank-r-easy-052",
      conceptId: "lora-hyperparameter-rank-r",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "multiple-choice",
      prompt: "LoRA 실습 및 설정에서 하이퍼파라미터 r(Rank)이 의미하는 것은 무엇입니까?[cite: 3]",
      options: [
        "학습 데이터셋을 반복하여 훈련하는 전체 에포크 횟수[cite: 3]",
        "양자화 시 허용되는 최대 오차의 백분율 한계치[cite: 3]",
        "어텐션 레이어에서 입력 문맥이 가질 수 있는 최대 토큰 수[cite: 3]",
        "어댑터 분해 행렬 A와 B가 공유하는 내부 저차원의 크기[cite: 3]"
      ],
      answer: 3,
      explanation: "LoRA에서 r(Rank)은 분해된 어댑터 행렬 A와 B의 내부 차원 크기를 결정하는 파라미터로, r 값이 커질수록 표현력은 증가하지만 학습 파라미터 수도 늘어납니다[cite: 3].",
      hint: "저랭크 분해 행렬의 차원 크기를 나타내는 파라미터입니다[cite: 3]."
    },
    {
      id: "cat4-peft-lora-alpha-easy-053",
      conceptId: "lora-hyperparameter-alpha-scaling",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "multiple-choice",
      prompt: "LoRA 설정에서 하이퍼파라미터 alpha가 수행하는 주된 역할은 무엇입니까?[cite: 3]",
      options: [
        "입력 텍스트에서 삭제할 불용어의 최대 개수를 제한한다[cite: 3].",
        "학습된 어댑터 출력이 원래 모델에 미치는 강도와 스케일을 조절한다[cite: 3].",
        "양자화 과정에서 사용할 지수 비트의 자릿수를 지정한다[cite: 3].",
        "모델의 사전 학습 체크포인트를 저장할 디스크 경로를 결정한다[cite: 3]."
      ],
      answer: 1,
      explanation: "alpha(LoRA Alpha)는 학습된 어댑터의 출력 크기(스케일)를 조절하는 파라미터로, 원래 기본 모델 가중치에 어댑터 결과가 얼마나 강하게 반영될지를 결정합니다[cite: 3].",
      hint: "어댑터 출력의 스케일(크기)을 조절하는 배율 파라미터입니다[cite: 3]."
    },
    {
      id: "cat4-peft-target-modules-easy-054",
      conceptId: "lora-target-modules-selection",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "multiple-choice",
      prompt: "LoRA를 적용할 때 주로 어댑터를 장착하는 트랜스포머의 핵심 모듈 위치는?[cite: 3]",
      options: [
        "입력 텍스트를 인덱스로 변환하는 토크나이저 어휘 사전[cite: 3]",
        "모델의 맨 마지막 위치에 있는 바이어스 덧셈기[cite: 3]",
        "어텐션 층의 Query, Key, Value 연산 가중치 행렬[cite: 3]",
        "하드웨어 메모리와 통신하는 캐시 버퍼 컨트롤러[cite: 3]"
      ],
      answer: 2,
      explanation: "LoRA는 트랜스포머 구조에서 정보 처리에 핵심적인 역할을 하는 어텐션(Attention) 블록의 Query, Key, Value 연산 가중치 행렬에 주로 어댑터를 적용합니다[cite: 3].",
      hint: "Q, K, V 연산이 일어나는 트랜스포머의 핵심 집중 모듈입니다[cite: 3]."
    },
    {
      id: "cat4-peft-chat-format-roles-easy-055",
      conceptId: "chat-format-role-separation",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "multiple-choice",
      prompt: "대화형 언어 모델 파인튜닝을 위한 챗 포맷(Chat Format) 데이터셋에서 구분하는 기본 3대 역할은?[cite: 3]",
      options: [
        "교사, 학생, 조교[cite: 3]",
        "시스템, 사용자, 어시스턴트[cite: 3]",
        "인코더, 디코더, 라우터[cite: 3]",
        "질의, 인덱스, 문서[cite: 3]"
      ],
      answer: 1,
      explanation: "챗 포맷 데이터셋은 시스템 지침을 설정하는 System, 사용자의 입력을 담는 User, 모델의 모범 답변을 담는 Assistant의 세 가지 역할로 대화를 구조화합니다[cite: 3].",
      hint: "시스템 지침, 질문자, 인공지능 답변자의 3가지 역할 구분입니다[cite: 3]."
    },
    {
      id: "cat4-peft-unsloth-library-easy-056",
      conceptId: "unsloth-library-features",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "multiple-choice",
      prompt: "최신 거대 언어 모델 파인튜닝 실습에서 언슬로스(Unsloth) 라이브러리를 활용할 때 얻을 수 있는 이점은?[cite: 3]",
      options: [
        "학습 데이터가 전혀 없는 상태에서도 모델 파라미터를 2배 확장한다[cite: 3].",
        "컴퓨터의 모든 파이썬 인터프리터를 기계어로 변환하여 실행한다[cite: 3].",
        "오직 CPU 환경에서만 동작하도록 모델 구조를 강제로 변환한다[cite: 3].",
        "연산을 최적화하고 4비트 양자화를 지원하여 학습 속도를 높이고 메모리를 절감한다[cite: 3]"
      ],
      answer: 3,
      explanation: "Unsloth는 수식과 커널을 최적화하고 4비트 양자화를 지원하여 메모리 사용량을 크게 줄이고 학습 속도를 대폭 단축시켜 주는 라이브러리입니다[cite: 3].",
      hint: "학습 속도를 높이고 GPU 메모리를 아껴주는 최적화 라이브러리입니다[cite: 3]."
    },
    {
      id: "cat4-peft-merge-adapter-easy-057",
      conceptId: "lora-adapter-merge-inference",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "multiple-choice",
      prompt: "LoRA 학습 완료 후 기본 모델과 어댑터를 하나로 병합(Merge)하여 저장하는 주된 목적은?[cite: 3]",
      options: [
        "기본 모델 가중치를 삭제하고 오직 저랭크 어댑터 파일만 단독으로 실행하기 위해[cite: 3]",
        "추론 시 별도 어댑터 적용 단계를 줄이고 하나의 모델로 사용할 수 있도록 하기 위해[cite: 3]",
        "어댑터 행렬의 모든 가중치 값을 0으로 초기화하여 저장 공간을 비우기 위해[cite: 3]",
        "텍스트를 인코딩할 때마다 매번 새로운 LoRA 어댑터를 랜덤 생성하기 위해[cite: 3]"
      ],
      answer: 1,
      explanation: "학습된 어댑터를 기본 모델 가중치에 직접 합쳐(Merge) 하나의 완성된 단일 모델로 저장하면, 배포 및 추론 시 별도 어댑터를 붙여서 로드하는 단계를 줄여 편리하게 사용할 수 있습니다[cite: 3].",
      hint: "학습된 가중치 변화량을 원래 모델 가중치에 합쳐 단일 모델로 만드는 작업입니다[cite: 3]."
    },
    {
      id: "cat4-peft-acronym-short-easy-058",
      conceptId: "peft-full-name-expansion",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "short-answer",
      prompt: "모델의 전체 가중치를 수정하지 않고 일부 파라미터만 효율적으로 튜닝하는 기법인 PEFT의 영문 전체 명칭을 작성하시오.[cite: 3]",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Parameter Efficient Fine Tuning",
        "parameter efficient fine tuning",
        "Parameter-Efficient Fine-Tuning",
        "parameter-efficient fine-tuning",
        "Parameter Efficient Fine-Tuning"
      ],
      explanation: "PEFT는 Parameter Efficient Fine Tuning(파라미터 효율적 파인튜닝)의 약자입니다[cite: 3].",
      hint: "Parameter E________ Fine-Tuning (4단어)[cite: 3]"
    },
    {
      id: "cat4-lora-acronym-short-easy-059",
      conceptId: "lora-full-name-expansion",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "short-answer",
      prompt: "가중치 행렬 업데이트를 저랭크 행렬 분해로 근사하여 학습하는 효율적 파인튜닝 기법인 LoRA의 영문 전체 명칭을 작성하시오.[cite: 3]",
      options: [],
      answer: null,
      acceptedAnswers: [
        "Low Rank Adaptation",
        "low rank adaptation",
        "Low-Rank Adaptation",
        "low-rank adaptation",
        "Low Rank Adaptation of Large Language Models"
      ],
      explanation: "LoRA는 Low-Rank Adaptation(저랭크 적응)의 약자입니다[cite: 3].",
      hint: "Low-R___ Adaptation (3단어)[cite: 3]"
    },
    {
      id: "cat4-peft-lora-qlora-essay-easy-060",
      conceptId: "lora-and-qlora-mechanism-essay",
      difficulty: "easy",
      category: "효율적 파인튜닝 및 실습",
      questionType: "essay",
      prompt: "거대 언어 모델의 효율적 파인튜닝 기법인 LoRA의 기본 동작 원리를 설명하고, 이를 확장한 QLoRA가 메모리를 추가로 절감하는 방법을 서술하시오.[cite: 3]",
      options: [],
      answer: null,
      modelAnswer: "1. LoRA의 기본 동작 원리:\n기존 언어 모델의 원본 가중치 행렬은 완전히 동결(Freeze)하고, 가중치 업데이트 변화량을 저차원(Rank r)을 갖는 두 개의 작은 행렬 A와 B의 곱으로 분해하여 이 작은 행렬들만 학습시킵니다[cite: 3]. 이를 통해 학습 파라미터 수와 메모리를 크게 줄일 수 있습니다[cite: 3].\n\n2. QLoRA의 추가 메모리 절감 방법:\nQLoRA는 원본 기본 모델의 가중치를 4비트(NF4 등)로 강하게 양자화하여 메모리 점유율을 극소화한 상태로 고정하고, 그 위에 결합된 LoRA 어댑터만 고정밀도로 학습합니다[cite: 3]. 이를 통해 전체 모델 복잡도를 줄이면서도 목표 작업에서 높은 성능을 유지할 수 있습니다[cite: 3].",
      rubricKeywords: [
        "기존 가중치 동결",
        "저랭크 행렬 분해",
        "행렬 A와 B",
        "4비트 양자화",
        "메모리 절감"
      ],
      minLength: 140,
      explanation: "LoRA의 가중치 동결 및 저랭크 행렬 분해 원리와, QLoRA의 기본 모델 4비트 양자화 결합을 통한 추가 메모리 절감 메커니즘을 명확히 서술해야 합니다[cite: 3].",
      hint: "LoRA의 저랭크 분해 학습 원리와 QLoRA의 4비트 양자화 결합 방식을 설명하세요[cite: 3]."
    }
  ],
  medium: [],
  hard: [],
  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
