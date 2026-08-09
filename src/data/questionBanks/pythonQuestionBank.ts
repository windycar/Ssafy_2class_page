import type {
  PythonQuestion,
  StudyCategory,
  StudyDifficulty,
  StudyQuestionType,
} from "../../types/study";
import { ESSAY_MIN_LENGTH } from "../../constants/study";
import { extremePythonQuestions } from "./extremePythonQuestions";
import {
  easyAdditionalQuestionSeeds,
  hardAdditionalQuestionSeeds,
  mediumAdditionalQuestionSeeds,
  type StandardPythonQuestionSeed,
} from "./standardPythonQuestionSeeds";

export const STUDY_CATEGORY_META: Record<
  StudyCategory,
  { label: string; shortLabel: string; color: string; description: string }
> = {
  operators: {
    label: "연산자 · 형변환",
    shortLabel: "연산자",
    color: "#f07a55",
    description: "숫자, 불리언, 형변환과 연산 우선순위",
  },
  sequences: {
    label: "문자열 · 시퀀스",
    shortLabel: "시퀀스",
    color: "#4d86f7",
    description: "인덱싱, 슬라이싱과 시퀀스 연산",
  },
  control: {
    label: "제어문",
    shortLabel: "제어문",
    color: "#12a98b",
    description: "조건문, 반복문과 실행 흐름",
  },
  functions: {
    label: "함수 · 스코프",
    shortLabel: "함수",
    color: "#8b5cf6",
    description: "인자, 반환값, 클로저와 이름 공간",
  },
  structures: {
    label: "자료구조",
    shortLabel: "자료구조",
    color: "#e7a514",
    description: "리스트, 딕셔너리, 집합과 컴프리헨션",
  },
  oop: {
    label: "OOP",
    shortLabel: "OOP",
    color: "#e34466",
    description: "클래스, 상속, 메서드 탐색 순서",
  },
  exceptions: {
    label: "예외처리",
    shortLabel: "예외처리",
    color: "#61748b",
    description: "예외 흐름, else와 finally",
  },
};

export const STUDY_QUESTION_TYPE_META: Record<
  StudyQuestionType,
  { label: string; shortLabel: string; description: string; color: string }
> = {
  "multiple-choice": {
    label: "객관식 4지선다",
    shortLabel: "객관식",
    description: "보기에서 정답 하나를 선택합니다.",
    color: "#4d6ff7",
  },
  "short-answer": {
    label: "단답형",
    shortLabel: "단답형",
    description: "대·소문자와 기호까지 정확히 입력합니다.",
    color: "#0f9f7a",
  },
  essay: {
    label: "서술형",
    shortLabel: "서술형",
    description: `결과와 이유를 ${ESSAY_MIN_LENGTH}자 이상 서술합니다.`,
    color: "#d97706",
  },
};

export const DIFFICULTY_META: Record<
  StudyDifficulty,
  {
    label: string;
    eyebrow: string;
    description: string;
    color: string;
    gradient: string;
    expectedMinutes: string;
  }
> = {
  easy: {
    label: "쉬움",
    eyebrow: "PYTHON STARTER",
    description: "기초 문법과 코드 읽기를 단단하게 다져요.",
    color: "#12a98b",
    gradient: "from-emerald-500 to-teal-600",
    expectedMinutes: "문제당 약 40초",
  },
  medium: {
    label: "중간",
    eyebrow: "PYTHON BUILDER",
    description: "자료구조와 함수의 동작 원리를 연결해요.",
    color: "#4d6ff7",
    gradient: "from-blue-600 to-indigo-600",
    expectedMinutes: "문제당 약 1분",
  },
  hard: {
    label: "어려움",
    eyebrow: "PYTHON MASTER",
    description: "스코프, 객체 모델과 예외 흐름을 깊게 파고들어요.",
    color: "#8b5cf6",
    gradient: "from-violet-600 to-fuchsia-600",
    expectedMinutes: "문제당 약 90초",
  },
  extreme: {
    label: "최고 난이도",
    eyebrow: "PYTHON EXTREME",
    description: "메모리, MRO, 디스크립터와 메타프로그래밍까지 도전해요.",
    color: "#e11d48",
    gradient: "from-rose-600 to-red-700",
    expectedMinutes: "문제당 약 2분",
  },
};

type QuestionDraft = Omit<
  PythonQuestion,
  | "id"
  | "conceptId"
  | "difficulty"
  | "questionType"
  | "options"
  | "answer"
  | "acceptedAnswers"
  | "modelAnswer"
  | "rubricKeywords"
  | "minLength"
> & {
  correct: string;
  distractors: string[];
  questionType?: StudyQuestionType;
};

type QuestionBuilder = (variant: number) => QuestionDraft;

const ESSAY_RUBRIC_KEYWORDS: Record<StudyCategory, string[]> = {
  operators: ["연산", "우선순위", "형변환"],
  sequences: ["순서", "인덱스", "슬라이싱"],
  control: ["조건", "반복", "실행"],
  functions: ["함수", "인자", "반환"],
  structures: ["자료구조", "요소", "참조"],
  oop: ["클래스", "객체", "메서드"],
  exceptions: ["예외", "오류", "발생"],
};

function getQuestionType(typeSeed: number): StudyQuestionType {
  const slot = typeSeed % 20;
  if (slot < 12) return "multiple-choice";
  if (slot < 17) return "short-answer";
  return "essay";
}

function removeAnswerOnlyInstruction(prompt: string) {
  return prompt
    .replace(
      /\s*(?:정답|답|값|결과)(?:을|를)?\s*(?:입력|작성)하(?:시오|세요)\.?\s*$/u,
      "",
    )
    .trim();
}

function getPromptForType(
  prompt: string,
  questionType: StudyQuestionType,
) {
  if (questionType === "multiple-choice") return prompt;
  const promptWithoutAnswerOnlyInstruction =
    removeAnswerOnlyInstruction(prompt);
  if (questionType === "short-answer") {
    return `${promptWithoutAnswerOnlyInstruction}\n정답만 출력 형식 그대로 입력하세요.`;
  }
  return `${promptWithoutAnswerOnlyInstruction}\n정답 또는 출력 결과를 먼저 밝히고, 코드의 실행 순서와 그 결과가 나온 이유를 ${ESSAY_MIN_LENGTH}자 이상 서술하세요.`;
}

function withOptions(
  difficulty: StudyDifficulty,
  index: number,
  draft: QuestionDraft,
  conceptId = `${difficulty}-${String(index + 1).padStart(3, "0")}`,
  typeSeed = index,
  questionId = `${difficulty}-${String(index + 1).padStart(3, "0")}`,
): PythonQuestion {
  const {
    correct,
    distractors,
    questionType: preferredQuestionType,
    ...question
  } = draft;
  const unique = [correct, ...distractors].filter(
    (option, optionIndex, options) => options.indexOf(option) === optionIndex,
  );
  while (unique.length < 4) unique.push(`보기 ${unique.length + 1}`);
  const base = unique.slice(0, 4);
  const shift = index % base.length;
  const choiceOptions = [...base.slice(shift), ...base.slice(0, shift)];
  const questionType = preferredQuestionType ?? getQuestionType(typeSeed);
  const options =
    questionType === "multiple-choice" ? choiceOptions : [];
  const rubricKeywords =
    questionType === "essay"
      ? ESSAY_RUBRIC_KEYWORDS[question.category]
      : undefined;
  const expectedResult =
    correct === "출력 없음"
      ? "출력되는 내용은 없습니다"
      : `최종 결과는 ${correct}입니다`;
  const modelAnswer =
    questionType === "essay"
      ? `${expectedResult}. ${question.explanation} 코드가 평가되는 순서와 값의 변화를 차례로 추적하면 이 결과를 확인할 수 있습니다. 이 과정에서 ${rubricKeywords?.join(", ")} 개념이 최종 결과에 어떤 영향을 주는지도 함께 설명해야 합니다.`
      : undefined;
  return {
    ...question,
    id: questionId,
    conceptId,
    difficulty,
    questionType,
    prompt: getPromptForType(question.prompt, questionType),
    options,
    answer:
      questionType === "multiple-choice"
        ? options.indexOf(correct)
        : null,
    acceptedAnswers:
      questionType === "multiple-choice" ? undefined : [correct],
    modelAnswer,
    rubricKeywords,
    minLength: questionType === "essay" ? ESSAY_MIN_LENGTH : undefined,
  };
}

function numberChoices(answer: number) {
  const candidates = [answer + 1, answer - 1, answer + 3, answer * 2 + 1];
  return candidates
    .filter((value, index) => value !== answer && candidates.indexOf(value) === index)
    .slice(0, 3)
    .map(String);
}

const easyCoreBuilders: QuestionBuilder[] = [
  (v) => {
    const a = v + 2;
    const b = v + 3;
    const result = a + b * 2;
    return {
      category: "operators",
      prompt: "다음 코드를 실행했을 때 출력되는 값은 무엇인가요?",
      code: `a = ${a}\nb = ${b}\nprint(a + b * 2)`,
      correct: String(result),
      distractors: numberChoices(result),
      explanation: "곱셈이 덧셈보다 먼저 계산됩니다. 먼저 b * 2를 구한 뒤 a를 더합니다.",
      hint: "파이썬의 산술 연산 우선순위를 떠올려 보세요.",
    };
  },
  (v) => {
    const value = 22 + v * 3;
    const quotient = Math.floor(value / 4);
    const remainder = value % 4;
    const result = quotient + remainder;
    return {
      category: "operators",
      prompt: "몫과 나머지를 이용한 다음 코드의 출력은 무엇인가요?",
      code: `value = ${value}\nprint(value // 4 + value % 4)`,
      correct: String(result),
      distractors: numberChoices(result),
      explanation: `//는 정수 몫, %는 나머지를 구합니다. ${value}의 몫 ${quotient}과 나머지 ${remainder}를 더합니다.`,
      hint: "//와 %가 각각 무엇을 반환하는지 나누어 계산하세요.",
    };
  },
  (v) => {
    const words = ["python", "academy", "variable", "sequence", "function", "boolean", "integer", "iterate", "package", "module"];
    const word = words[v];
    return {
      category: "sequences",
      prompt: "문자열 슬라이싱 결과로 옳은 것은 무엇인가요?",
      code: `word = "${word}"\nprint(word[1:-1])`,
      correct: word.slice(1, -1),
      distractors: [word.slice(0, -1), word.slice(1), word.split("").reverse().join("")],
      explanation: "슬라이스의 시작 인덱스는 포함되고 끝 인덱스는 포함되지 않습니다. -1은 마지막 글자의 위치입니다.",
      hint: "맨 앞 글자와 맨 뒤 글자를 제외해 보세요.",
    };
  },
  (v) => {
    const start = v + 1;
    const values = [start, start + 2, start + 4, start + 6];
    const result = values.at(-1)! - values[0];
    return {
      category: "sequences",
      prompt: "음수 인덱스를 사용한 다음 코드의 출력은 무엇인가요?",
      code: `values = [${values.join(", ")}]\nprint(values[-1] - values[0])`,
      correct: String(result),
      distractors: numberChoices(result),
      explanation: "인덱스 -1은 리스트의 마지막 요소를 뜻합니다. 마지막 값에서 첫 번째 값을 뺍니다.",
      hint: "values[-1]이 가리키는 요소를 먼저 찾으세요.",
    };
  },
  (v) => {
    const end = v + 7;
    const result = Array.from({ length: end - 1 }, (_, i) => i + 1)
      .filter((n) => n % 2 === 0)
      .reduce((sum, n) => sum + n, 0);
    return {
      category: "control",
      prompt: "반복문이 끝난 뒤 total의 값은 무엇인가요?",
      code: `total = 0\nfor n in range(1, ${end}):\n    if n % 2 == 0:\n        total += n\nprint(total)`,
      correct: String(result),
      distractors: numberChoices(result),
      explanation: `range의 끝값 ${end}은 포함되지 않습니다. 그 안의 짝수만 total에 누적합니다.`,
      hint: "범위에 포함되는 짝수를 먼저 적어 보세요.",
    };
  },
  (v) => {
    const bonus = v + 1;
    return {
      category: "functions",
      prompt: "기본 인자를 가진 함수의 실행 결과는 무엇인가요?",
      code: `def score(value, bonus=${bonus}):\n    return value + bonus\n\nprint(score(${10 + v}))`,
      correct: String(11 + v * 2),
      distractors: numberChoices(11 + v * 2),
      explanation: "호출할 때 bonus를 전달하지 않았으므로 정의된 기본값이 사용됩니다.",
      hint: "함수 호출에 생략된 인자의 기본값을 확인하세요.",
    };
  },
  (v) => {
    const first = 70 + v;
    const second = 80 + v;
    const result = first + second;
    return {
      category: "structures",
      prompt: "딕셔너리에서 값을 꺼내 더한 결과는 무엇인가요?",
      code: `scores = {"a": ${first}, "b": ${second}}\nprint(scores["a"] + scores.get("b"))`,
      correct: String(result),
      distractors: numberChoices(result),
      explanation: "대괄호 접근과 get 모두 해당 키의 값을 반환합니다. 두 정수를 더한 값이 출력됩니다.",
      hint: "a와 b 키에 저장된 값을 각각 확인하세요.",
    };
  },
  (v) => ({
    category: "oop",
    prompt: "인스턴스 속성을 사용하는 다음 코드의 출력은 무엇인가요?",
    code: `class Counter:\n    def __init__(self, start):\n        self.value = start\n\n    def up(self):\n        self.value += 1\n        return self.value\n\ncounter = Counter(${v})\nprint(counter.up())`,
    correct: String(v + 1),
    distractors: numberChoices(v + 1),
    explanation: "__init__에서 value가 초기화되고 up 메서드가 그 값을 1 증가시킨 뒤 반환합니다.",
    hint: "객체가 만들어진 직후 value와 up 호출 후 value를 순서대로 추적하세요.",
  }),
  (v) => ({
    category: "exceptions",
    prompt: "예외가 발생했을 때 다음 코드가 출력하는 문자는 무엇인가요?",
    code: `try:\n    number = int("${v + 2}.5")\n    print("A")\nexcept ValueError:\n    print("B")`,
    correct: "B",
    distractors: ["A", "A\nB", "아무것도 출력되지 않는다"],
    explanation: "소수점이 들어 있는 문자열을 int로 바로 바꾸면 ValueError가 발생하므로 except 블록이 실행됩니다.",
    hint: `int("${v + 2}.5")가 성공하는지 생각해 보세요.`,
  }),
  (v) => {
    const values = [v, v + 1, v, v + 2, v + 1];
    return {
      category: "structures",
      prompt: "집합으로 변환한 뒤 원소의 개수는 몇 개인가요?",
      code: `values = [${values.join(", ")}]\nprint(len(set(values)))`,
      correct: "3",
      distractors: ["2", "4", "5"],
      explanation: "set은 중복 값을 제거합니다. 서로 다른 값은 세 개이므로 길이는 3입니다.",
      hint: "중복을 한 번씩만 남겨 보세요.",
    };
  },
];

const mediumCoreBuilders: QuestionBuilder[] = [
  (v) => {
    const value = v + 5;
    const result = value > v && value % 2 === (v + 1) % 2;
    return {
      category: "operators",
      prompt: "비교 연산과 논리 연산을 함께 사용한 결과는 무엇인가요?",
      code: `value = ${value}\nprint(value > ${v} and value % 2 == ${(v + 1) % 2})`,
      correct: result ? "True" : "False",
      distractors: [result ? "False" : "True", "1", "0"],
      explanation: "and의 양쪽 비교식을 각각 계산한 뒤, 두 불리언 값이 모두 참일 때만 True가 됩니다.",
      hint: ">, == 비교식의 결과를 왼쪽부터 따로 구하세요.",
    };
  },
  (v) => {
    const end = v + 7;
    const numbers = Array.from({ length: end }, (_, i) => i);
    const result = numbers.filter((n) => n % 2 === 1).map((n) => n * n).reduce((a, b) => a + b, 0);
    return {
      category: "structures",
      prompt: "리스트 컴프리헨션으로 만든 값들의 합은 무엇인가요?",
      code: `values = [n * n for n in range(${end}) if n % 2]\nprint(sum(values))`,
      correct: String(result),
      distractors: numberChoices(result),
      explanation: "조건식 n % 2는 홀수일 때 참입니다. 범위 안의 홀수를 제곱한 뒤 모두 더합니다.",
      hint: "먼저 조건을 통과하는 n만 골라 보세요.",
    };
  },
  (v) => {
    const base = v + 2;
    return {
      category: "structures",
      prompt: "같은 리스트를 가리키는 두 변수의 실행 결과는 무엇인가요?",
      code: `a = [${base}, ${base + 1}]\nb = a\nb.append(${base + 2})\nprint(len(a), a[-1])`,
      correct: `3 ${base + 2}`,
      distractors: [`2 ${base + 1}`, `2 ${base + 2}`, `3 ${base + 1}`],
      explanation: "b = a는 복사가 아니라 같은 리스트 객체를 가리키는 별칭을 만듭니다. b의 변경은 a에서도 보입니다.",
      hint: "a와 b가 서로 다른 리스트인지 확인하세요.",
    };
  },
  (v) => {
    const start = v + 1;
    return {
      category: "functions",
      prompt: "nonlocal을 사용하는 클로저의 연속 호출 결과는 무엇인가요?",
      code: `def make_counter():\n    count = ${start}\n    def step():\n        nonlocal count\n        count += 2\n        return count\n    return step\n\ncounter = make_counter()\nprint(counter(), counter())`,
      correct: `${start + 2} ${start + 4}`,
      distractors: [`${start + 2} ${start + 2}`, `${start} ${start + 2}`, `${start + 4} ${start + 4}`],
      explanation: "nonlocal count는 바깥 함수의 지역 변수를 수정합니다. 같은 클로저를 호출할 때 상태가 이어집니다.",
      hint: "첫 호출 뒤 count가 초기값으로 돌아가지 않습니다.",
    };
  },
  (v) => {
    const words = [
      ["kiwi", "fig", "banana"],
      ["cat", "elephant", "bee"],
      ["red", "indigo", "cyan"],
      ["sun", "planet", "star"],
      ["map", "iterator", "set"],
      ["web", "database", "api"],
      ["list", "tuple", "dictionary"],
      ["one", "seventeen", "five"],
      ["run", "debugging", "test"],
      ["git", "repository", "branch"],
    ][v];
    const sorted = [...words].sort((a, b) => a.length - b.length);
    return {
      category: "sequences",
      prompt: "문자열 길이를 기준으로 정렬한 결과는 무엇인가요?",
      code: `words = ${JSON.stringify(words)}\nprint(sorted(words, key=len)[0])`,
      correct: sorted[0],
      distractors: [sorted.at(-1)!, words[0], String(sorted[0].length)],
      explanation: "key=len을 지정하면 사전순이 아니라 문자열 길이의 오름차순으로 정렬됩니다. 첫 요소는 가장 짧은 문자열입니다.",
      hint: "각 문자열의 글자 수를 비교하세요.",
    };
  },
  (v) => {
    const end = v + 5;
    const result = Object.fromEntries(
      Array.from({ length: end }, (_, i) => i)
        .filter((n) => n % 2 === 0)
        .map((n) => [n, n + 1]),
    );
    return {
      category: "structures",
      prompt: "딕셔너리 컴프리헨션의 원소 개수는 몇 개인가요?",
      code: `data = {n: n + 1 for n in range(${end}) if n % 2 == 0}\nprint(len(data))`,
      correct: String(Object.keys(result).length),
      distractors: numberChoices(Object.keys(result).length),
      explanation: "range 안에서 짝수인 n만 딕셔너리의 키가 됩니다. 그 키의 개수가 len의 결과입니다.",
      hint: "0도 짝수에 포함됩니다.",
    };
  },
  (v) => {
    const base = v + 3;
    return {
      category: "oop",
      prompt: "super()로 부모 메서드를 호출한 결과는 무엇인가요?",
      code: `class Base:\n    def value(self):\n        return ${base}\n\nclass Child(Base):\n    def value(self):\n        return super().value() * 2\n\nprint(Child().value())`,
      correct: String(base * 2),
      distractors: numberChoices(base * 2),
      explanation: "Child.value는 super()를 통해 Base.value의 반환값을 받은 뒤 2를 곱합니다.",
      hint: "부모 메서드가 먼저 반환하는 값을 구하세요.",
    };
  },
  (v) => ({
    category: "exceptions",
    prompt: "try, except, else, finally의 실행 순서로 옳은 것은 무엇인가요?",
    code: `try:\n    value = ${v + 4} // 2\nexcept ZeroDivisionError:\n    print("E")\nelse:\n    print("S")\nfinally:\n    print("F")`,
    correct: "S\nF",
    distractors: ["E\nF", "S", "F\nS"],
    explanation: "예외가 없으므로 else가 실행되고, finally는 예외 발생 여부와 관계없이 마지막에 실행됩니다.",
    hint: "정수 나눗셈에서 예외가 발생하는지 먼저 판단하세요.",
  }),
  (v) => {
    const nums = [v + 1, v + 2, v + 3];
    const result = nums.reduce((a, b) => a + b, 0);
    return {
      category: "functions",
      prompt: "가변 위치 인자를 전달한 함수의 결과는 무엇인가요?",
      code: `def total(*args):\n    return sum(args)\n\nvalues = [${nums.join(", ")}]\nprint(total(*values))`,
      correct: String(result),
      distractors: numberChoices(result),
      explanation: "*values는 리스트의 각 요소를 개별 위치 인자로 펼쳐 전달합니다. args는 튜플로 받아 합계를 구합니다.",
      hint: "함수 내부에서 args에 들어가는 세 값을 적어 보세요.",
    };
  },
  (v) => {
    const start = v + 2;
    return {
      category: "control",
      prompt: "제너레이터 표현식에서 next를 두 번 호출한 결과는 무엇인가요?",
      code: `gen = (n * 2 for n in range(${start}, ${start + 3}))\nprint(next(gen), next(gen))`,
      correct: `${start * 2} ${(start + 1) * 2}`,
      distractors: [`${start * 2} ${start * 2}`, `${start} ${start + 1}`, `${(start + 1) * 2} ${(start + 2) * 2}`],
      explanation: "제너레이터는 호출할 때마다 다음 항목을 하나씩 계산합니다. 두 번의 next는 첫째와 둘째 값을 반환합니다.",
      hint: "range의 첫 두 값을 순서대로 2배 하세요.",
    };
  },
  (v) => {
    const first = v + 1;
    return {
      category: "structures",
      prompt: "얕은 복사 뒤 중첩 리스트를 수정한 결과는 무엇인가요?",
      code: `a = [[${first}], [${first + 1}]]\nb = a.copy()\nb[0].append(${first + 2})\nprint(a[0])`,
      correct: `[${first}, ${first + 2}]`,
      distractors: [`[${first}]`, `[${first + 2}]`, `[[${first}, ${first + 2}]]`],
      explanation: "a.copy()는 바깥 리스트만 새로 만듭니다. 내부 리스트 객체는 공유하므로 b에서 수정한 내용이 a에도 반영됩니다.",
      hint: "copy가 중첩된 내부 리스트까지 복사하는지 생각해 보세요.",
    };
  },
];

const hardCoreBuilders: QuestionBuilder[] = [
  (v) => {
    const value = v % 2 === 0 ? 0 : v;
    const result = value || v + 10;
    return {
      category: "operators",
      prompt: "단축 평가가 반환하는 실제 값은 무엇인가요?",
      code: `value = ${value}\nresult = value or ${v + 10}\nprint(result)`,
      correct: String(result),
      distractors: [String(result + 1), "True", "False"],
      explanation: "or는 불리언으로 변환한 결과가 아니라 첫 번째 truthy 피연산자를 그대로 반환합니다. 0은 falsy입니다.",
      hint: "파이썬의 or가 반드시 True나 False를 반환하는 것은 아닙니다.",
    };
  },
  (v) => {
    const start = v + 1;
    const result = start + 4;
    return {
      category: "sequences",
      prompt: "역방향 확장 슬라이싱 결과에서 두 번째 값은 무엇인가요?",
      code: `values = list(range(${start}, ${start + 7}))\nprint(values[::-2][1])`,
      correct: String(result),
      distractors: numberChoices(result),
      explanation: "values[::-2]는 마지막 요소부터 두 칸씩 거꾸로 선택합니다. 그 결과의 인덱스 1은 원본의 뒤에서 세 번째 값입니다.",
      hint: "먼저 values[::-2]가 만드는 새 리스트를 적어 보세요.",
    };
  },
  (v) => {
    const end = v + 3;
    const result = Array(3).fill(end - 1).join(" ");
    return {
      category: "functions",
      prompt: "반복문 안에서 만든 람다들의 호출 결과는 무엇인가요?",
      code: `funcs = [lambda: i for i in range(${end})]\nprint(funcs[0](), funcs[1](), funcs[2]())`,
      correct: result,
      distractors: [`0 1 2`, `0 0 0`, `${end} ${end} ${end}`],
      explanation: "람다는 i의 값을 생성 시점에 복사하지 않고 호출 시점에 조회합니다. 반복이 끝난 뒤 i는 마지막 값입니다.",
      hint: "클로저의 늦은 바인딩(late binding)을 떠올려 보세요.",
    };
  },
  (v) => {
    const label = String.fromCharCode(65 + v);
    return {
      category: "oop",
      prompt: "다중 상속에서 메서드 탐색 순서(MRO)에 따른 결과는 무엇인가요?",
      code: `class A:\n    def name(self): return "A${label}"\nclass B(A):\n    def name(self): return "B${label}"\nclass C(A):\n    def name(self): return "C${label}"\nclass D(B, C):\n    pass\n\nprint(D().name())`,
      correct: `B${label}`,
      distractors: [`A${label}`, `C${label}`, `TypeError`],
      explanation: "D의 MRO는 D → B → C → A 순서입니다. 가장 먼저 발견되는 B.name이 호출됩니다.",
      hint: "D의 부모 클래스가 선언된 왼쪽부터 탐색을 시작합니다.",
    };
  },
  (v) => {
    const delta = v + 1;
    return {
      category: "functions",
      prompt: "데코레이터가 반환값을 변경하는 다음 코드의 결과는 무엇인가요?",
      code: `def add_bonus(fn):\n    def wrapper(x):\n        return fn(x) + ${delta}\n    return wrapper\n\n@add_bonus\ndef double(x):\n    return x * 2\n\nprint(double(${v + 2}))`,
      correct: String((v + 2) * 2 + delta),
      distractors: numberChoices((v + 2) * 2 + delta),
      explanation: "@add_bonus는 double을 wrapper로 교체합니다. 원래 함수의 반환값에 bonus가 더해집니다.",
      hint: "먼저 원래 double의 결과를 구한 뒤 wrapper의 연산을 적용하세요.",
    };
  },
  (v) => {
    const start = v + 1;
    return {
      category: "control",
      prompt: "yield from을 사용하는 제너레이터의 출력은 무엇인가요?",
      code: `def numbers():\n    yield ${start}\n    yield from [${start + 1}, ${start + 2}]\n\nprint(list(numbers()))`,
      correct: `[${start}, ${start + 1}, ${start + 2}]`,
      distractors: [`[${start}]`, `[${start}, [${start + 1}, ${start + 2}]]`, `[${start + 1}, ${start + 2}]`],
      explanation: "yield from은 주어진 이터러블의 요소를 하나씩 그대로 전달합니다. 중첩 리스트로 반환하지 않습니다.",
      hint: "yield from [a, b]는 yield a, yield b와 비슷합니다.",
    };
  },
  (v) => ({
    category: "exceptions",
    prompt: "finally 안의 return이 있는 다음 함수의 반환값은 무엇인가요?",
    code: `def choose():\n    try:\n        return ${v + 1}\n    finally:\n        return ${v + 11}\n\nprint(choose())`,
    correct: String(v + 11),
    distractors: [String(v + 1), `${v + 1}\n${v + 11}`, "RuntimeError"],
    explanation: "finally의 return은 try에서 준비된 반환값을 덮어씁니다. 실무에서는 혼란을 피하기 위해 이런 패턴을 사용하지 않는 편이 좋습니다.",
    hint: "함수가 실제로 빠져나가기 직전에 실행되는 블록을 확인하세요.",
  }),
  (v) => {
    const base = v + 1;
    return {
      category: "oop",
      prompt: "클래스 속성과 인스턴스 속성의 관계를 올바르게 계산한 결과는 무엇인가요?",
      code: `class Box:\n    value = ${base}\n\nfirst = Box()\nsecond = Box()\nfirst.value += 5\nBox.value += 2\nprint(first.value, second.value)`,
      correct: `${base + 5} ${base + 2}`,
      distractors: [`${base + 7} ${base + 2}`, `${base + 5} ${base}`, `${base + 7} ${base + 7}`],
      explanation: "first.value += 5는 first에 별도의 인스턴스 속성을 만듭니다. second는 계속 변경된 클래스 속성을 조회합니다.",
      hint: "first에 value가 직접 저장되는 시점을 찾으세요.",
    };
  },
  (v) => {
    const start = v + 2;
    return {
      category: "functions",
      prompt: "nonlocal 상태를 공유하는 두 참조의 호출 결과는 무엇인가요?",
      code: `def accumulator():\n    total = ${start}\n    def add(value):\n        nonlocal total\n        total += value\n        return total\n    return add\n\nleft = accumulator()\nright = left\nprint(left(2), right(3))`,
      correct: `${start + 2} ${start + 5}`,
      distractors: [`${start + 2} ${start + 3}`, `${start} ${start + 3}`, `${start + 5} ${start + 5}`],
      explanation: "left와 right는 같은 클로저 객체를 가리키므로 하나의 total 상태를 공유합니다.",
      hint: "right = left가 새 accumulator를 호출한 것인지 확인하세요.",
    };
  },
  (v) => {
    const stop = v + 3;
    return {
      category: "control",
      prompt: "사용자 정의 이터레이터가 만들어 내는 리스트는 무엇인가요?",
      code: `class Count:\n    def __init__(self, stop):\n        self.current = 0\n        self.stop = stop\n    def __iter__(self):\n        return self\n    def __next__(self):\n        if self.current >= self.stop:\n            raise StopIteration\n        self.current += 1\n        return self.current\n\nprint(list(Count(${stop})))`,
      correct: `[${Array.from({ length: stop }, (_, i) => i + 1).join(", ")}]`,
      distractors: [
        `[${Array.from({ length: stop }, (_, i) => i).join(", ")}]`,
        `[${stop}]`,
        "StopIteration",
      ],
      explanation: "__next__는 current를 먼저 1 증가시킨 뒤 반환합니다. stop에 도달한 다음 호출에서 StopIteration으로 반복이 정상 종료됩니다.",
      hint: "첫 번째 __next__ 호출에서 반환되는 값을 확인하세요.",
    };
  },
  (v) => {
    const value = v + 1;
    return {
      category: "functions",
      prompt: "변경 가능한 기본 인자를 반복 호출했을 때 결과는 무엇인가요?",
      code: `def collect(value, bucket=[]):\n    bucket.append(value)\n    return len(bucket)\n\nprint(collect(${value}), collect(${value + 1}))`,
      correct: "1 2",
      distractors: ["1 1", "2 2", "TypeError"],
      explanation: "기본 리스트 객체는 함수 정의 시 한 번 만들어져 호출 사이에 공유됩니다. 두 번째 호출은 같은 리스트에 추가합니다.",
      hint: "기본 인자 객체가 매 호출마다 새로 만들어지는지 생각해 보세요.",
    };
  },
  (v) => {
    const first = v + 1;
    return {
      category: "structures",
      prompt: "얕은 복사된 딕셔너리의 중첩 값을 수정한 결과는 무엇인가요?",
      code: `original = {"items": [${first}, ${first + 1}]}\nclone = original.copy()\nclone["items"] += [${first + 2}]\nprint(original["items"])`,
      correct: `[${first}, ${first + 1}, ${first + 2}]`,
      distractors: [`[${first}, ${first + 1}]`, `[${first + 2}]`, `KeyError`],
      explanation: "딕셔너리의 얕은 복사는 내부 리스트를 공유합니다. += 연산이 공유 리스트를 제자리에서 확장합니다.",
      hint: "copy가 items 안의 리스트까지 새로 만드는지 확인하세요.",
    };
  },
];

function buildSeedQuestion(seed: StandardPythonQuestionSeed): QuestionBuilder {
  return () => ({ ...seed });
}

const easyBuilders: QuestionBuilder[] = [
  ...easyCoreBuilders,
  ...easyAdditionalQuestionSeeds.map(buildSeedQuestion),
];

const mediumBuilders: QuestionBuilder[] = [
  ...mediumCoreBuilders,
  ...mediumAdditionalQuestionSeeds.map(buildSeedQuestion),
];

const hardBuilders: QuestionBuilder[] = [
  ...hardCoreBuilders,
  ...hardAdditionalQuestionSeeds.map(buildSeedQuestion),
];

function buildDifficulty(
  difficulty: StudyDifficulty,
  builders: QuestionBuilder[],
  preservedQuestionCount: number,
): PythonQuestion[] {
  return Array.from({ length: 100 }, (_, index) => {
    const builderIndex = index % builders.length;
    const builder = builders[builderIndex];
    const variant = Math.floor(index / builders.length);
    return withOptions(
      difficulty,
      index,
      builder(variant),
      `${difficulty}-concept-${String(builderIndex + 1).padStart(3, "0")}`,
      index,
      index < preservedQuestionCount
        ? `${difficulty}-${String(index + 1).padStart(3, "0")}`
        : `${difficulty}-v2-${String(index + 1).padStart(3, "0")}`,
    );
  });
}

type ExtremeQuestionDraft = {
  category: string;
  prompt: string;
  code?: string;
  correct: string;
  distractors: string[] | string;
  explanation: string;
  hint: string;
};

const EXTREME_CATEGORY_MAP: Record<string, StudyCategory> = {
  memory: "structures",
  scope: "functions",
  oop: "oop",
  exception: "exceptions",
  datastructures: "structures",
  generators: "sequences",
  logic: "operators",
  functions: "functions",
  meta: "oop",
  idioms: "control",
};

function buildExtremeDifficulty(): PythonQuestion[] {
  return extremePythonQuestions.map((builder, index) => {
    const generated = builder(7) as ExtremeQuestionDraft;
    return withOptions("extreme", index, {
      ...generated,
      category: EXTREME_CATEGORY_MAP[generated.category] ?? "functions",
      distractors: Array.isArray(generated.distractors)
        ? generated.distractors
        : [generated.distractors],
    }, `extreme-concept-${String(index + 1).padStart(3, "0")}`);
  });
}

export const PYTHON_QUESTION_BANK: Record<StudyDifficulty, PythonQuestion[]> = {
  easy: buildDifficulty("easy", easyBuilders, easyCoreBuilders.length),
  medium: buildDifficulty("medium", mediumBuilders, mediumCoreBuilders.length),
  hard: buildDifficulty("hard", hardBuilders, hardCoreBuilders.length),
  extreme: buildExtremeDifficulty(),
};

export const ALL_PYTHON_QUESTIONS = Object.values(PYTHON_QUESTION_BANK).flat();

export function getPythonQuestion(questionId: string) {
  return ALL_PYTHON_QUESTIONS.find((question) => question.id === questionId);
}

for (const difficulty of Object.keys(PYTHON_QUESTION_BANK) as StudyDifficulty[]) {
  if (PYTHON_QUESTION_BANK[difficulty].length !== 100) {
    throw new Error(`${difficulty} 문제은행은 정확히 100문제여야 합니다.`);
  }
}

for (const question of ALL_PYTHON_QUESTIONS) {
  if (question.questionType === "multiple-choice") {
    if (
      question.options.length !== 4 ||
      new Set(question.options).size !== 4 ||
      question.answer === null ||
      question.answer < 0 ||
      question.answer >= question.options.length
    ) {
      throw new Error(`${question.id} 객관식 선택지 또는 정답이 올바르지 않습니다.`);
    }
    continue;
  }

  if (
    question.options.length > 0 ||
    question.answer !== null ||
    !question.acceptedAnswers?.length
  ) {
    throw new Error(`${question.id} 주관식 정답 형식이 올바르지 않습니다.`);
  }

  if (
    question.questionType === "essay" &&
    (!question.prompt.includes("서술") ||
      !question.modelAnswer ||
      !question.rubricKeywords?.length ||
      !question.minLength)
  ) {
    throw new Error(`${question.id} 서술형 채점 기준이 올바르지 않습니다.`);
  }
}
