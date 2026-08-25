import type {
  AiPythonWeekDifficulty,
  AiPythonWeekQuestion,
} from "../../types/aiPythonWeekStudy";

type AiPythonWeekQuestionBank = Record<
  AiPythonWeekDifficulty,
  AiPythonWeekQuestion[]
>;

const LENGTH_CUE_MINIMUM_DIFFERENCE = 12;
const LENGTH_CUE_MINIMUM_RATIO = 1.45;

const NEAR_MISS_OVERRIDES: Readonly<Record<string, string>> = {
  "ai-ml-easy-003":
    "DL은 ML과 무관한 별도 분야이며 여러 층의 신경망으로 데이터 표현과 예측 규칙을 학습한다.",
  "ai-ml-easy-022": "Advertising Budget과 Radio Budget",
  "ai-ml-medium-065":
    "TV와 Radio 중 한 변수만 사용해 판매량을 예측한다",
  "ai-ml-hard-006":
    "두 번째 변수는 label로 취급되므로 여전히 1D 피처 기반 학습에 해당한다",
  "ai-ml-hard-032":
    "관측 변수의 관계와 무관하게 미리 정한 규칙으로 결과 범주를 생성하는 것",
  "nlp-emb-mc-med-006":
    "단어 전체를 하나의 원-핫 벡터로 고정하고 미등록 단어를 모두 같은 OOV 값으로 처리하기 때문",
  "nlp-rnn-mc-med-004":
    "역전파 체인 룰에서 1보다 큰 미분값만 반복 곱해져 기울기가 시점 수에 따라 커지기 때문",
  "nlp-lstm-mc-med-007":
    "$\\tanh$ 대신 ReLU를 거쳐 0 이상 값으로만 이루어진 새로운 정보 후보군을 만든다.",
  "nlp-tr-mc-med-008":
    "8배 (예: 512 $\\rightarrow$ 4096 $\\rightarrow$ 512)",
  "nlp-align-mc-med-001":
    "질문의 의도와 연령 조건을 정확히 반영해 간결한 달 착륙 설명을 바로 생성한다.",
  "nlp-align-mc-med-009":
    "별도 보상 모델과 PPO 샘플링 루프를 추가해 학습 단계를 더 세분화하므로 안정적임",
  "nlp-pe-mc-med-008":
    "모델 규모가 충분히 작을수록 CoT가 계산을 대신해 추론 성능 향상이 더 뚜렷해진다.",
  "nlp-dec-mc-med-001":
    "첫 토큰을 생성하거나 사전에 정한 최소 길이에 도달하면 즉시 생성을 종료할 때",
  "nlp-dec-mc-med-003":
    "$T > 1$이면 $z_i / T$ 값의 차이가 커져 분포가 뾰족해지고, $T < 1$이면 차이가 작아져 분포가 평평해진다.",
  "nlp-eval-mc-med-002":
    "대학원 수준 과학 분야만을 대상으로 전문가가 작성한 주관식 추론 문제로 구성됨",
  "nlp-eval-mc-med-003":
    "대학원 수준 물리학·생물학 문제를 바탕으로 한 전문가 과학 추론 능력",
  "nlp-eval-mc-med-004":
    "모델이 생성한 $k$개의 코드 후보가 모두 단위 테스트를 통과한 경우의 비율",
  "nlp-eval-mc-med-006":
    "유저 질문 $\\rightarrow$ 검색 없이 LLM 임시 답변 생성 $\\rightarrow$ 답변을 외부 Vector DB에 저장 $\\rightarrow$ 모델 가중치를 재학습한 뒤 반환",
  "nlp-eval-mc-med-009":
    "모델이 생성한 코드 후보 1개가 정답 코드와 문자열까지 완전히 일치하는 비율",
  "nlp-emb-mc-hard-006":
    "루트에서 리프까지 각 분기점의 이진 시그모이드 확률을 모두 더한 뒤 경로 길이로 나눈 평균",
  "nlp-rnn-mc-hard-001":
    "활성화 함수 $\\tanh$의 미분 최댓값이 1이고, 가중치 행렬 $W_{hh}$의 고유값들이 1보다 클 때 연쇄 곱에 의해 0으로 지수적 수렴하기 때문",
  "nlp-rnn-mc-med-007":
    "순방향 신경망 하나만 구동하되 은닉 상태를 두 번 복사하여 앞뒤 문맥을 동시에 파악하므로",
  "nlp-lstm-mc-hard-009":
    "두 은닉 상태 벡터를 이어붙이지 않고 순방향 벡터만 선택해 $h_t$ 형태의 결합 표현으로 만든다.",
  "nlp-s2s-mc-hard-005":
    "두 벡터를 이어붙인 뒤 별도 선형 변환 없이 컨텍스트 벡터 부분만 출력층으로 전달",
  "nlp-s2s-mc-hard-002":
    "$O(T_x + T_y)$ (입력 길이 $T_x$와 출력 길이 $T_y$의 합에만 비례)",
  "nlp-tr-mc-hard-003":
    "위치 벡터를 입력 임베딩에 직접 더하고 $QK^T$ 점수에는 토큰 간 거리 편향을 적용하지 않는다.",
  "nlp-dec-mc-hard-003":
    "$\\frac{1}{|Y|^\\alpha} \\sum_{t=1}^{|Y|} \\log P(y_t \\mid y_{>t})$",
  "nlp-dec-mc-hard-005":
    "$z_i = \\begin{cases} z_i \\times \\theta & (z_i > 0) \\\\ z_i / \\theta & (z_i < 0) \\end{cases}$",
  "nlp-pe-mc-hard-005":
    "복잡한 논리 과정을 하나의 긴 프롬프트에 합쳐 중간 단계 검증 없이 최종 답만 생성함",
  "nlp-pe-mc-hard-007":
    "무작위 예시 선택이 유사도 기반 선택보다 테스트 정확도를 통계적으로 유의하게 높인다.",
  "nlp-eval-mc-hard-001":
    "$\\text{pass}@k \\approx 1 - \\frac{\\binom{c}{k}}{\\binom{n}{k}}$ (단, $c$는 테스트를 통과한 샘플 수)",
  "nlp-eval-mc-hard-003":
    "초급부터 대학교재 수준까지 57개 학문 분야의 객관식 지식을 일반 학습자에게 폭넓게 평가하는 문제임",
  "nlp-eval-mc-hard-005":
    "미신·음모론 문항에서 대중이 흔히 믿는 답변을 모델이 얼마나 일관되게 재현하는지 측정",
  "nlp-eval-mc-hard-008":
    "Shortest Common Supersequence 기반의 문장 길이 일치도",
  "nlp-eval-es-hard-015":
    "MMLU는 생물학·물리학 박사급 전문가가 직접 출제해 단순 검색으로 풀기 어려운 과학 추론 평가이다. 반면 GPQA는 초급부터 대학교재 수준의 57개 학문 분야를 폭넓게 다루는 일반 객관식 종합 지식 평가이다.",
  "nlp-align-mc-001":
    "사용자 지시와 무관한 다음 토큰 확률만 높이고 유해 응답 여부는 별도로 조정하지 않기 위해",
  "nlp-llm-mc-hard-006":
    "저품질 텍스트와 중복 데이터도 양만 충분하면 학습 효율을 높이고 편향을 줄이므로 데이터 양만 성능을 좌우하기 때문",
  "nlp-align-mc-hard-007":
    "별도 보상 모델과 PPO의 불안정한 샘플링 루프를 그대로 유지하고 단일 분류 손실을 추가해 학습 단계를 더 늘리기 때문",
};

const CONCEPT_CONTRASTS: ReadonlyArray<
  readonly [left: string, right: string, swapWhenBoth?: boolean]
> = [
  ["중심 단어", "주변 단어", true],
  ["Query", "Value", true],
  ["Key", "Query", true],
  ["인코더", "디코더", true],
  ["encoder", "decoder", true],
  ["Encoder", "Decoder", true],
  ["입력 게이트", "출력 게이트", true],
  ["Input gate", "Output gate", true],
  ["Forget gate", "Output gate", true],
  ["Teacher forcing", "자유 실행 추론"],
  ["학습 단계", "추론 단계"],
  ["순방향", "역방향"],
  ["과거", "미래"],
  ["이전", "미래"],
  ["입력", "출력"],
  ["정답", "오답"],
  ["상위", "하위"],
  ["최대화", "최소화"],
  ["증가", "감소"],
  ["높은", "낮은"],
  ["높게", "낮게"],
  ["크게", "작게"],
  ["더 큰", "더 작은"],
  ["양수", "음수"],
  ["전역적", "국소적"],
  ["전역", "국소"],
  ["희소", "밀집"],
  ["연속적", "불연속적"],
  ["연속", "불연속"],
  ["순차적", "병렬적"],
  ["순차", "병렬"],
  ["고정된", "가변적인"],
  ["고정", "가변"],
  ["동일한", "서로 다른"],
  ["같은", "서로 다른"],
  ["모든", "일부"],
  ["전체", "일부"],
  ["하나", "여러 개"],
  ["한 개", "여러 개"],
  ["유지", "제거"],
  ["포함", "제외"],
  ["허용", "차단"],
  ["참조", "무시"],
  ["공유", "분리"],
  ["유사도", "편집 거리"],
  ["필요", "불필요"],
];

const NON_ESSENTIAL_PARENTHETICAL = /\s*\(([^()]*)\)/g;
const MATH_OR_VALUE_MARKER = /[$\\=<>^_{}\d]/;
const ALGEBRAIC_EXPRESSION =
  /(?:^|[\s([{])(?:[A-Za-z](?:_[A-Za-z0-9]+)?|\d+(?:\.\d+)?)\s*[+\-*/]\s*(?:[A-Za-z](?:_[A-Za-z0-9]+)?|\d+(?:\.\d+)?)(?:$|[\s)\]}])/;
const DISTRACTOR_EXPANSIONS = [
  " 또한 조건이 달라져도 이 결론은 그대로 유지된다고 해석한다.",
  " 따라서 별도의 추가 계산 없이도 같은 결과에 도달한다고 본다.",
  " 즉, 문제에 제시된 상황에서 예외 없이 성립한다고 판단한다.",
] as const;

function isSupplementaryParenthetical(
  content: string,
  value: string,
  offset: number,
  fullMatch: string,
) {
  const normalized = content.trim();
  const isStatementMarker = /^[A-Za-z가-힣]$/.test(normalized);
  const isFunctionNotation =
    !/^\s/.test(fullMatch) &&
    offset > 0 &&
    /[A-Za-z0-9_]$/.test(value.slice(0, offset));
  return (
    Boolean(normalized) &&
    !isStatementMarker &&
    !isFunctionNotation &&
    !MATH_OR_VALUE_MARKER.test(normalized) &&
    !ALGEBRAIC_EXPRESSION.test(normalized) &&
    /[A-Za-z가-힣]/.test(normalized)
  );
}

export function hasSupplementaryOptionParenthetical(value: string) {
  return [...value.matchAll(NON_ESSENTIAL_PARENTHETICAL)].some((match) => {
    const offset = match.index ?? 0;
    return isSupplementaryParenthetical(match[1], value, offset, match[0]);
  });
}

function optionLength(value: string) {
  return value.replace(/\s+/g, " ").replace(/[`*_~$]/g, "").trim().length;
}

function removeSupplementaryParentheticals(value: string) {
  const withoutSupplement = value.replace(
    NON_ESSENTIAL_PARENTHETICAL,
    (match, content: string, offset: number, value: string) => {
      return isSupplementaryParenthetical(content, value, offset, match)
        ? ""
        : match;
    },
  );
  const normalized = withoutSupplement
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
  return normalized || value.trim();
}

function swapContrast(
  value: string,
  left: string,
  right: string,
  swapWhenBoth = false,
) {
  const hasLeft = value.includes(left);
  const hasRight = value.includes(right);
  if (!hasLeft && !hasRight) return null;
  if (hasLeft && hasRight && !swapWhenBoth) return null;

  const placeholder = "__AI_PYTHON_WEEK_OPTION_CONTRAST__";
  const swapped = value
    .replaceAll(left, placeholder)
    .replaceAll(right, left)
    .replaceAll(placeholder, right);
  return swapped === value ? null : swapped;
}

function negateStatement(value: string) {
  const endings: ReadonlyArray<readonly [RegExp, string]> = [
    [/할 수 있다(\.)?$/, "할 수 없다$1"],
    [/해야 한다(\.)?$/, "해서는 안 된다$1"],
    [/하게 된다(\.)?$/, "하지 않게 된다$1"],
    [/이 된다(\.)?$/, "이 되지 않는다$1"],
    [/가 된다(\.)?$/, "가 되지 않는다$1"],
    [/된다(\.)?$/, "되지 않는다$1"],
    [/한다(\.)?$/, "하지 않는다$1"],
    [/이다(\.)?$/, "이 아니다$1"],
    [/있다(\.)?$/, "없다$1"],
    [/함$/, "하지 않음"],
    [/하기 위해$/, "하지 않기 위해"],
    [/기 때문에$/, "는 것과 무관하기 때문에"],
  ];
  for (const [pattern, replacement] of endings) {
    if (pattern.test(value)) return value.replace(pattern, replacement);
  }
  return null;
}

function makeNearMiss(
  questionId: string,
  correctOption: string,
  existingOptions: string[],
) {
  const override = NEAR_MISS_OVERRIDES[questionId];
  if (override && !existingOptions.includes(override)) return override;

  for (const [left, right, swapWhenBoth] of CONCEPT_CONTRASTS) {
    const candidate = swapContrast(
      correctOption,
      left,
      right,
      swapWhenBoth,
    );
    if (candidate && !existingOptions.includes(candidate)) return candidate;
  }

  const negated = negateStatement(correctOption);
  return negated && !existingOptions.includes(negated) ? negated : null;
}

function longestDistractorIndex(options: string[], answer: number) {
  return options.reduce((longestIndex, option, index) => {
    if (index === answer) return longestIndex;
    if (longestIndex === answer) return index;
    return optionLength(option) > optionLength(options[longestIndex])
      ? index
      : longestIndex;
  }, answer);
}

function expandKnownDistractor(value: string, pass: number) {
  const sentence = /[.!?]$/.test(value.trim())
    ? value.trim()
    : `${value.trim()}.`;
  return `${sentence}${DISTRACTOR_EXPANSIONS[pass % DISTRACTOR_EXPANSIONS.length]}`;
}

export function hasObviousCorrectAnswerLengthCue(
  question: AiPythonWeekQuestion,
) {
  if (
    question.questionType !== "multiple-choice" ||
    question.answer === null ||
    question.options.length !== 4
  ) {
    return false;
  }

  const correctLength = optionLength(question.options[question.answer]);
  const longestDistractor = Math.max(
    ...question.options
      .filter((_, index) => index !== question.answer)
      .map(optionLength),
  );
  return (
    correctLength >= longestDistractor + LENGTH_CUE_MINIMUM_DIFFERENCE &&
    correctLength >= longestDistractor * LENGTH_CUE_MINIMUM_RATIO
  );
}

export function stabilizeAiPythonWeekQuestion(
  question: AiPythonWeekQuestion,
): AiPythonWeekQuestion {
  if (
    question.questionType !== "multiple-choice" ||
    question.answer === null ||
    question.options.length !== 4
  ) {
    return question;
  }

  const options = question.options.map(removeSupplementaryParentheticals);
  let stabilized = { ...question, options };
  if (!hasObviousCorrectAnswerLengthCue(stabilized)) return stabilized;

  const correctOption = options[question.answer];
  const nearMiss = makeNearMiss(question.id, correctOption, options);
  const balancedOptions = [...options];
  if (nearMiss) {
    const shortestDistractorIndex = options.reduce(
      (shortestIndex, option, index) => {
        if (index === question.answer) return shortestIndex;
        if (shortestIndex === question.answer) return index;
        return optionLength(option) < optionLength(options[shortestIndex])
          ? index
          : shortestIndex;
      },
      question.answer,
    );
    balancedOptions[shortestDistractorIndex] = nearMiss;
  }

  stabilized = { ...stabilized, options: balancedOptions };
  for (
    let pass = 0;
    pass < 6 && hasObviousCorrectAnswerLengthCue(stabilized);
    pass += 1
  ) {
    const distractorIndex = longestDistractorIndex(
      stabilized.options,
      question.answer,
    );
    const expandedOptions = [...stabilized.options];
    expandedOptions[distractorIndex] = expandKnownDistractor(
      expandedOptions[distractorIndex],
      pass,
    );
    stabilized = { ...stabilized, options: expandedOptions };
  }
  return stabilized;
}

export function stabilizeAiPythonWeekQuestionBank(
  bank: AiPythonWeekQuestionBank,
): AiPythonWeekQuestionBank {
  return Object.fromEntries(
    Object.entries(bank).map(([difficulty, questions]) => [
      difficulty,
      questions.map(stabilizeAiPythonWeekQuestion),
    ]),
  ) as AiPythonWeekQuestionBank;
}

function hasUniquelyLongestCorrectOption(question: AiPythonWeekQuestion) {
  if (
    question.questionType !== "multiple-choice" ||
    question.answer === null ||
    question.options.length !== 4
  ) {
    return false;
  }

  const correctLength = optionLength(question.options[question.answer]);
  return question.options.every(
    (option, index) =>
      index === question.answer || optionLength(option) < correctLength,
  );
}

export function balanceAiPythonWeekQuestionBankOptionLengths(
  bank: AiPythonWeekQuestionBank,
): AiPythonWeekQuestionBank {
  return Object.fromEntries(
    Object.entries(bank).map(([difficulty, questions]) => [
      difficulty,
      questions.map((question, questionIndex) => {
        if (!hasUniquelyLongestCorrectOption(question)) return question;

        let balanced = question;
        for (
          let pass = 0;
          pass < 6 && hasUniquelyLongestCorrectOption(balanced);
          pass += 1
        ) {
          const distractorIndex = longestDistractorIndex(
            balanced.options,
            balanced.answer as number,
          );
          const options = [...balanced.options];
          options[distractorIndex] = expandKnownDistractor(
            options[distractorIndex],
            questionIndex + pass,
          );
          balanced = { ...balanced, options };
        }
        return balanced;
      }),
    ]),
  ) as AiPythonWeekQuestionBank;
}
