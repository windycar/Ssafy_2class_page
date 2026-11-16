/**
 * SSAFY 광주 2반 사이트 - 과목평가 9회차 - JavaScript 쉬운버전 (3회차) 문제 데이터
 *
 * - 평가 과목: JavaScript (과목평가 9회차 - JavaScript 쉬운버전 (3회차), 2026-11-23 시행 대비 기초 연습)
 * - 문항 구성: 총 25문항 (전 문항 easy 난이도 · 객관식 4지선다 21문항 + 단답형 주관식 4문항)
 * - 채점 규격: 객관식은 0-based 정답 인덱스(number), 단답형은 answer: null 및 acceptedAnswers: string[]
 * - 출제 근거:
 *   1) 16기_1111_Javascript_DOM.pdf
 *   2) 16기_1112_Javascript_Basic_Syntax_01.pdf
 *   3) 16기_1116_Javascript_Basic_Syntax_02.pdf
 *   4) 16기_1117_Javascript_Controlling_Event.pdf
 */

export type StudyDifficulty = 'easy' | 'medium' | 'hard'

export type StudyQuestionType = 'multiple-choice' | 'short-answer'

export interface StudyQuestion {
  id: string
  conceptId: string
  difficulty: StudyDifficulty
  category: string
  questionType: StudyQuestionType
  prompt: string
  code?: string
  options: string[]
  answer: number | null
  acceptedAnswers?: string[]
  explanation: string
  hint?: string
}

export interface SubjectEvaluationMeta {
  round: number
  setNumber: number
  difficultyLevel: StudyDifficulty
  subject: string
  title: string
  examDate: string
  totalQuestions: number
  objectiveCount: number
  subjectiveCount: number
  questionTypes: StudyQuestionType[]
}

export const SUBJECT_EVAL_9_EASY_SET3_META: SubjectEvaluationMeta = {
  round: 9,
  setNumber: 3,
  difficultyLevel: 'easy',
  subject: 'JavaScript',
  title: "과목평가 9회차 - JavaScript 쉬운버전 (3회차)",
  examDate: '2026-11-23',
  totalQuestions: 25,
  objectiveCount: 21,
  subjectiveCount: 4,
  questionTypes: ['multiple-choice', 'short-answer'],
}

export const ROUND9_JS_EASY_SET3_QUESTIONS: StudyQuestion[] = [
  {
    id: "js9e3-01",
    conceptId: "easy3-dom-style-color",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "다음 HTML과 JavaScript 코드를 실행했을 때 <p> 요소의 글자 색상에 대한 설명으로 올바른 것은?",
    code: "<p id=\"text\">안녕하세요</p>\n\n<script>\n  const pTag = document.querySelector('#text')\n  pTag.style.color = 'crimson'\n</script>",
    options: [
      "<p> 요소의 인라인 style color가 'crimson'으로 설정된다.",
      "pTag.style 속성은 읽기 전용이므로 실행 시 TypeError가 발생한다.",
      "HTML 태그의 id 속성 값이 'crimson'으로 새롭게 덮어써진다.",
      "pTag 요소 내부의 텍스트 콘텐츠가 'crimson'으로 변경된다.",
    ],
    answer: 0,
    hint: "element.style 프로퍼티는 요소의 인라인 CSS 스타일을 직접 설정합니다.",
    explanation: "정답: 1번\n- 실행 과정: pTag.style.color = 'crimson'을 실행하면 해당 <p> 태그의 style 속성에 color: crimson이 적용됩니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (DOM 조작 > style 조작)",
  },
  {
    id: "js9e3-02",
    conceptId: "easy3-dom-removeattribute",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "다음 HTML과 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "<button id=\"submit-btn\" disabled>제출</button>\n\n<script>\n  const btn = document.querySelector('#submit-btn')\n  btn.removeAttribute('disabled')\n  console.log(btn.getAttribute('disabled'))\n</script>",
    options: [
      "''",
      "false",
      "null",
      "undefined",
    ],
    answer: 2,
    hint: "removeAttribute()로 제거된 속성을 getAttribute()로 조회하면 null이 반환됩니다.",
    explanation: "정답: 3번\n- 실행 과정: btn.removeAttribute('disabled')로 disabled 속성을 제거했으므로 이후 btn.getAttribute('disabled')는 null을 반환합니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (DOM 조작 > 속성 조작 > 일반 속성 조작)",
  },
  {
    id: "js9e3-03",
    conceptId: "easy3-dom-script-tag",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "외부 JavaScript 파일(app.js)을 HTML 문서에 연결할 때 사용하는 올바른 태그는?",
    options: [
      "<link rel=\"script\" src=\"app.js\" />",
      "<javascript href=\"app.js\"></javascript>",
      "<style type=\"text/js\" src=\"app.js\"></style>",
      "<script src=\"app.js\"></script>",
    ],
    answer: 3,
    hint: "<script> 태그의 src 속성에 파일 경로를 지정합니다.",
    explanation: "정답: 4번\n- 정답 이유: 외부 JavaScript 파일을 불러올 때는 <script src=\"app.js\"></script> 태그를 사용합니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (DOM > 웹 브라우저에서의 JavaScript)",
  },
  {
    id: "js9e3-04",
    conceptId: "easy3-dom-reserved-word",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "다음 중 JavaScript에서 변수 이름(식별자)으로 사용할 수 없는 것은?",
    options: [
      "userName",
      "if",
      "_count",
      "$button",
    ],
    answer: 1,
    hint: "JavaScript 문법에서 이미 용도가 정해진 예약어는 변수명으로 사용할 수 없습니다.",
    explanation: "정답: 2번\n- 정답 이유: if는 조건문을 위한 예약어이므로 변수 이름으로 사용할 수 없습니다. 문자, 밑줄(_), 달러($)로 시작하는 일반 단어는 식별자로 사용할 수 있습니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (변수 > 변수 작성 규칙)",
  },
  {
    id: "js9e3-05",
    conceptId: "easy3-dom-block-scope",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "let x = 1\nif (true) {\n  let x = 2\n  console.log(x)\n}\nconsole.log(x)",
    options: [
      "SyntaxError가 발생한다.",
      "1, 1",
      "2, 1",
      "2, 2",
    ],
    answer: 2,
    hint: "let은 블록 스코프를 가지므로 if 블록 내부의 let x와 블록 바깥의 let x는 서로 다른 변수입니다.",
    explanation: "정답: 3번\n- 실행 과정: if 블록 내부의 console.log(x)는 블록 안의 지역 변수 x(2)를 출력하고, 블록 종료 후 바깥의 console.log(x)는 외부 변수 x(1)를 출력합니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (변수 > 변수 선언 키워드 > 블록 스코프)",
  },
  {
    id: "js9e3-06",
    conceptId: "easy3-bs1-shorthand-assign",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "let num = 5\nnum += 3\nnum *= 2\nconsole.log(num)",
    options: [
      "13",
      "16",
      "11",
      "10",
    ],
    answer: 1,
    hint: "5에 3을 먼저 더한 뒤, 그 결과에 2를 곱합니다.",
    explanation: "정답: 2번\n- 실행 과정: num += 3으로 num이 8이 되고, 이어서 num *= 2로 8 * 2 = 16이 출력됩니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (연산자 > 할당 연산자)",
  },
  {
    id: "js9e3-07",
    conceptId: "easy3-bs1-logical-operators",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 순서대로 출력되는 불리언 값으로 올바른 것은?",
    code: "console.log(true && false)\nconsole.log(true || false)\nconsole.log(!false)",
    options: [
      "true, true, true",
      "false, false, true",
      "false, true, false",
      "false, true, true",
    ],
    answer: 3,
    hint: "&&는 둘 다 참일 때만 true, ||는 하나라도 참이면 true, !는 논리값을 반전합니다.",
    explanation: "정답: 4번\n- 실행 과정: true && false는 false, true || false는 true, !false는 true가 출력됩니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (연산자 > 논리 연산자)",
  },
  {
    id: "js9e3-08",
    conceptId: "easy3-bs1-typeof-null",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const emptyVal = null\nconsole.log(typeof emptyVal)",
    options: [
      "'object'",
      "'boolean'",
      "'null'",
      "'undefined'",
    ],
    answer: 0,
    hint: "JavaScript 초기 버전의 하위 호환성 때문에 typeof null은 특이한 문자열을 반환합니다.",
    explanation: "정답: 1번\n- 실행 과정: JavaScript에서 null은 원시 자료형이지만, 초기 버전의 타입 태그 구조로 인해 typeof null의 결과는 'object'입니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (원시 자료형 > null, 참고 > null & undefined)",
  },
  {
    id: "js9e3-09",
    conceptId: "easy3-bs1-for-loop-count",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "let text = ''\nfor (let i = 0; i < 3; i++) {\n  text += i\n}\nconsole.log(text)",
    options: [
      "'123'",
      "'0123'",
      "'012'",
      "3",
    ],
    answer: 2,
    hint: "i가 0, 1, 2일 때 반복문이 실행되며 빈 문자열 ''에 순서대로 이어 붙여집니다.",
    explanation: "정답: 3번\n- 실행 과정: i가 0, 1, 2인 동안 빈 문자열 text에 '0', '1', '2'가 순서대로 연결되어 '012'가 출력됩니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (반복문 > for 반복문)",
  },
  {
    id: "js9e3-10",
    conceptId: "easy3-bs1-rest-param",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const collect = function (first, ...others) {\n  return others\n}\n\nconsole.log(collect(10, 20, 30, 40))",
    options: [
      "10",
      "[10, 20, 30, 40]",
      "40",
      "[20, 30, 40]",
    ],
    answer: 3,
    hint: "나머지 매개변수(...others)는 앞선 매개변수(first)를 제외한 나머지 인자들을 배열로 모아 받습니다.",
    explanation: "정답: 4번\n- 실행 과정: first에 10이 할당되고, 나머지 인자 20, 30, 40이 배열 [20, 30, 40]으로 others에 묶여 반환됩니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (함수 > 매개변수 > 2. 나머지 매개변수)",
  },
  {
    id: "js9e3-11",
    conceptId: "easy3-bs1-nan-self-compare",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 순서대로 출력되는 불리언 값으로 올바른 것은?",
    code: "console.log(NaN === NaN)\nconsole.log(Number.isNaN(NaN))",
    options: [
      "true, false",
      "false, true",
      "false, false",
      "true, true",
    ],
    answer: 1,
    hint: "NaN은 자기 자신과 일치 연산자(===)로 비교해도 false가 나오는 유일한 값입니다.",
    explanation: "정답: 2번\n- 실행 과정: NaN === NaN은 false를 반환하고, NaN 여부를 판별하는 Number.isNaN(NaN)은 true를 반환합니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (참고 > NaN 예시)",
  },
  {
    id: "js9e3-12",
    conceptId: "easy3-bs2-shorthand-property",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const title = 'JS 기초'\nconst level = 'easy'\nconst quiz = { title, level }\n\nconsole.log(quiz.title, quiz.level)",
    options: [
      "'JS 기초' 'easy'",
      "undefined undefined",
      "'title' 'level'",
      "SyntaxError가 발생한다.",
    ],
    answer: 0,
    hint: "단축 속성 문법 { title, level }은 { title: title, level: level }과 동일합니다.",
    explanation: "정답: 1번\n- 실행 과정: 단축 속성을 사용해 quiz 객체는 { title: 'JS 기초', level: 'easy' }로 생성되므로 'JS 기초' 'easy'가 출력됩니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (객체 > 추가 객체 문법 > 1. 단축 속성)",
  },
  {
    id: "js9e3-13",
    conceptId: "easy3-bs2-some-every",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 순서대로 출력되는 불리언 값으로 올바른 것은?",
    code: "const nums = [10, 25, 30]\nconsole.log(nums.some((n) => n > 20), nums.every((n) => n > 20))",
    options: [
      "true false",
      "false true",
      "false false",
      "true true",
    ],
    answer: 0,
    hint: "some()은 하나라도 조건을 만족하면 true, every()는 모든 요소가 조건을 만족해야 true를 반환합니다.",
    explanation: "정답: 1번\n- 실행 과정: 25와 30이 20보다 크므로 some()은 true를 반환하지만, 10이 20보다 작으므로 every()는 false를 반환합니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (기타 유용한 Array Helper Methods > some, every)",
  },
  {
    id: "js9e3-14",
    conceptId: "easy3-bs2-reduce-sum",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const numbers = [1, 2, 3, 4]\nconst total = numbers.reduce((acc, cur) => acc + cur, 0)\nconsole.log(total)",
    options: [
      "24",
      "10",
      "0",
      "4",
    ],
    answer: 1,
    hint: "초기값 0부터 배열 요소 1, 2, 3, 4를 차례대로 누적(acc + cur)합니다.",
    explanation: "정답: 2번\n- 실행 과정: 초기값 0에서 시작해 1 + 2 + 3 + 4가 순서대로 누적되어 10이 반환됩니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (참고 > (심화) 집계: reduce)",
  },
  {
    id: "js9e3-15",
    conceptId: "easy3-bs2-class-instance",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "class Member {\n  constructor(name) {\n    this.name = name\n  }\n  hello() {\n    return `Hi, ${this.name}`\n  }\n}\n\nconst m = new Member('지훈')\nconsole.log(m.hello())",
    options: [
      "TypeError가 발생한다.",
      "'Hi, undefined'",
      "'Hi, Member'",
      "'Hi, 지훈'",
    ],
    answer: 3,
    hint: "new Member('지훈')으로 생성된 인스턴스의 constructor가 실행되어 this.name에 '지훈'이 저장됩니다.",
    explanation: "정답: 4번\n- 실행 과정: new Member('지훈')으로 생성된 객체의 name 속성이 '지훈'으로 초기화되므로 m.hello()는 'Hi, 지훈'을 반환합니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (참고 > 클래스 > 클래스 활용)",
  },
  {
    id: "js9e3-16",
    conceptId: "easy3-bs2-callback-meaning",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다른 함수의 인자(argument)로 전달되어 외부 함수 내부에서 특정 시점에 호출되는 함수를 무엇이라고 부르는가?",
    options: [
      "전역 객체 (Global object)",
      "콜백 함수 (Callback function)",
      "생성자 함수 (Constructor)",
      "재귀 함수 (Recursive function)",
    ],
    answer: 1,
    hint: "forEach(), map(), addEventListener() 등에 인자로 넘겨주는 함수입니다.",
    explanation: "정답: 2번\n- 정답 이유: 콜백 함수(Callback function)는 다른 함수의 인자로 전달되어 특정 작업이나 시점에 호출되는 함수입니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (배열과 함수 > 함수의 확장: 콜백 함수)",
  },
  {
    id: "js9e3-17",
    conceptId: "easy3-bs2-object-values",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const scores = { a: 10, b: 20 }\nconsole.log(Object.values(scores))",
    options: [
      "[10, 20]",
      "['a', 'b']",
      "[['a', 10], ['b', 20]]",
      "30",
    ],
    answer: 0,
    hint: "Object.values(obj)는 객체의 속성 값(value)들만 모은 배열을 반환합니다.",
    explanation: "정답: 1번\n- 실행 과정: Object.values(scores)는 scores 객체의 값인 10과 20을 담은 배열 [10, 20]을 반환합니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (객체 > 추가 객체 문법 > 6. 유용한 객체 메서드)",
  },
  {
    id: "js9e3-18",
    conceptId: "easy3-evt-event-object-type",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "multiple-choice",
    prompt: "다음 HTML과 JavaScript 코드에서 <button id=\"btn\">클릭</button>을 마우스로 클릭했을 때 콘솔에 출력되는 문자열로 올바른 것은?",
    code: "<button id=\"btn\">클릭</button>\n\n<script>\n  const btn = document.querySelector('#btn')\n  btn.addEventListener('click', function (event) {\n    console.log(event.type)\n  })\n</script>",
    options: [
      "'button'",
      "'btn'",
      "'click'",
      "'클릭'",
    ],
    answer: 2,
    hint: "event.type 속성은 발생한 이벤트의 유형 이름을 문자열로 담고 있습니다.",
    explanation: "정답: 3번\n- 실행 과정: 'click' 이벤트가 발생했을 때 자동으로 전달되는 event 객체의 event.type 속성은 'click'입니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (event handler > 이벤트 객체 전달)",
  },
  {
    id: "js9e3-19",
    conceptId: "easy3-evt-capturing-vs-bubbling",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "multiple-choice",
    prompt: "DOM 이벤트 전파 단계 중 최상위 조상(window/document)에서 시작해 실제 이벤트가 발생한 하위 타겟 요소 방향으로 내려가는 전파 과정은?",
    options: [
      "호이스팅 (Hoisting)",
      "파싱 (Parsing)",
      "버블링 (Bubbling)",
      "캡처링 (Capturing)",
    ],
    answer: 3,
    hint: "타겟에서 부모로 올라가는 과정은 버블링, 위에서 아래로 내려가는 과정은 캡처링입니다.",
    explanation: "정답: 4번\n- 정답 이유: 캡처링(Capturing)은 최상위 조상 요소에서 타겟 요소까지 하향 전파되는 이벤트 단계입니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (버블링 > 캡처링과 버블링)",
  },
  {
    id: "js9e3-20",
    conceptId: "easy3-evt-delegation-benefit",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "multiple-choice",
    prompt: "여러 개의 <button> 요소를 감싸는 공통 부모 <div> 요소 하나에만 클릭 이벤트 리스너를 등록해 하위 버튼들의 클릭을 한곳에서 처리하는 기법이 성립하는 주된 이유는?",
    options: [
      "부모 요소에 리스너를 달면 모든 기본 동작이 자동 취소되기 때문",
      "이벤트가 항상 부모에서 자식으로만 전파되고 멈추기 때문",
      "이벤트 버블링으로 자식 버튼의 클릭이 부모 <div>로 전파되기 때문",
      "JavaScript에서는 자식 요소에 직접 이벤트를 등록할 수 없기 때문",
    ],
    answer: 2,
    hint: "자식 요소에서 발생한 이벤트가 부모 요소로 올라가는 전파 특성을 활용합니다.",
    explanation: "정답: 3번\n- 정답 이유: 자식 <button>을 클릭했을 때 이벤트 버블링에 의해 공통 부모 <div>까지 이벤트가 전파되므로, 부모의 핸들러에서 event.target을 확인해 여러 버튼의 이벤트를 효율적으로 처리할 수 있습니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (버블링 > 버블링의 필요성)",
  },
  {
    id: "js9e3-21",
    conceptId: "easy3-evt-handler-no-parens",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "multiple-choice",
    prompt: "버튼 클릭 시 handleClick 함수가 실행되도록 등록하는 코드로 가장 올바른 것은?",
    options: [
      "btn.addEventListener('click', handleClick())",
      "btn.addEventListener('click', 'handleClick')",
      "btn.addEventListener('click', handleClick)",
      "btn.addEventListener(handleClick, 'click')",
    ],
    answer: 2,
    hint: "등록 시점에 함수를 즉시 실행하지 않도록 괄호 () 없이 함수 자체를 두 번째 인자로 전달합니다.",
    explanation: "정답: 3번\n- 정답 이유: addEventListener('이벤트명', 콜백함수) 형식으로 작성하며, 이벤트 발생 시 브라우저가 호출할 수 있도록 handleClick을 괄호 없이 전달합니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (event handler > .addEventListener())",
  },
  {
    id: "js9e3-22",
    conceptId: "easy3-sa-dom-document",
    difficulty: "easy",
    category: "DOM",
    questionType: "short-answer",
    prompt: "웹 페이지를 나타내는 DOM 트리의 최상위 객체이자, querySelector()나 createElement() 메서드를 호출할 때 진입점이 되는 전역 객체의 이름을 작성하시오.",
    options: [],
    answer: null,
    acceptedAnswers: [
      "document",
      "window.document",
    ],
    hint: "document.querySelector(...) 형태로 사용합니다.",
    explanation: "정답: document\n- 정답 이유: document 객체는 웹 페이지를 나타내는 DOM 트리의 최상위 진입점 객체입니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (DOM > document 객체)",
  },
  {
    id: "js9e3-23",
    conceptId: "easy3-sa-bs1-modulo",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "short-answer",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 숫자를 작성하시오.",
    code: "const remainder = 17 % 5\nconsole.log(remainder)",
    options: [],
    answer: null,
    acceptedAnswers: [
      "2",
    ],
    hint: "%는 나눗셈의 나머지를 구하는 연산자입니다.",
    explanation: "정답: 2\n- 실행 과정: 17을 5로 나눈 나머지인 2가 출력됩니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (원시 자료형 > Number)",
  },
  {
    id: "js9e3-24",
    conceptId: "easy3-sa-bs2-class-new",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "short-answer",
    prompt: "JavaScript의 클래스(class)로부터 새로운 객체 인스턴스를 생성할 때 클래스 이름 앞에 반드시 붙이는 키워드를 작성하시오.",
    options: [],
    answer: null,
    acceptedAnswers: [
      "new",
    ],
    hint: "const member = ( 빈칸 ) Member('Alice') 형태로 작성합니다.",
    explanation: "정답: new\n- 정답 이유: new 연산자를 사용해 클래스의 생성자(constructor)를 호출하고 새로운 객체 인스턴스를 생성합니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (참고 > 클래스 > new 연산자)",
  },
  {
    id: "js9e3-25",
    conceptId: "easy3-sa-evt-submit",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "short-answer",
    prompt: "<form> 요소가 제출될 때 발생하는 이벤트의 이름(type 문자열, 따옴표 제외)을 작성하시오.",
    options: [],
    answer: null,
    acceptedAnswers: [
      "submit",
      "'submit'",
      "\"submit\"",
    ],
    hint: "formTag.addEventListener('( 빈칸 )', handleSubmit) 형태로 사용합니다.",
    explanation: "정답: submit\n- 정답 이유: <form> 요소가 제출될 때는 'submit' 이벤트가 발생합니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (이벤트 기본 동작 취소하기 > 2. form 제출 시 페이지 새로고침 동작 취소)",
  },
]

export const QUESTION_BANK: Record<StudyDifficulty, StudyQuestion[]> = {
  easy: ROUND9_JS_EASY_SET3_QUESTIONS.filter((q) => q.difficulty === 'easy'),
  medium: ROUND9_JS_EASY_SET3_QUESTIONS.filter((q) => q.difficulty === 'medium'),
  hard: ROUND9_JS_EASY_SET3_QUESTIONS.filter((q) => q.difficulty === 'hard'),
}

export const ALL_QUESTIONS: StudyQuestion[] = ROUND9_JS_EASY_SET3_QUESTIONS

export default ROUND9_JS_EASY_SET3_QUESTIONS
