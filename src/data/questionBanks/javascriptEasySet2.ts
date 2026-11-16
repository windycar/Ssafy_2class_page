/**
 * SSAFY 광주 2반 사이트 - 과목평가 9회차 - JavaScript 쉬운버전 (2회차) 문제 데이터
 *
 * - 평가 과목: JavaScript (과목평가 9회차 - JavaScript 쉬운버전 (2회차), 2026-11-23 시행 대비 기초 연습)
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

export const SUBJECT_EVAL_9_EASY_SET2_META: SubjectEvaluationMeta = {
  round: 9,
  setNumber: 2,
  difficultyLevel: 'easy',
  subject: 'JavaScript',
  title: "과목평가 9회차 - JavaScript 쉬운버전 (2회차)",
  examDate: '2026-11-23',
  totalQuestions: 25,
  objectiveCount: 21,
  subjectiveCount: 4,
  questionTypes: ['multiple-choice', 'short-answer'],
}

export const ROUND9_JS_EASY_SET2_QUESTIONS: StudyQuestion[] = [
  {
    id: "js9e2-01",
    conceptId: "easy2-dom-queryselectorall",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "CSS 선택자와 일치하는 모든 HTML 요소를 선택하여 NodeList로 반환하는 메서드는?",
    options: [
      "document.querySelectorAll()",
      "element.setAttribute('href')",
      "parent.removeChild(childNode)",
      "document.querySelector('.item')",
    ],
    answer: 0,
    hint: "All이 붙은 선택 메서드를 찾으세요.",
    explanation: "정답: 1번\n- 정답 이유: document.querySelectorAll(selector)는 제공한 CSS 선택자를 만족하는 모든 요소를 NodeList로 반환합니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (DOM 선택 > 선택 메서드)",
  },
  {
    id: "js9e2-02",
    conceptId: "easy2-dom-appendchild",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "document.createElement()로 새로 생성한 자식 요소를 특정 부모 요소의 가장 마지막 자식으로 삽입할 때 사용하는 메서드는?",
    options: [
      "parent.appendChild(child)",
      "parent.removeChild(child)",
      "parent.getAttribute(child)",
      "parent.classList.toggle(child)",
    ],
    answer: 0,
    hint: "자식 노드를 끝에 추가(append)하는 메서드입니다.",
    explanation: "정답: 1번\n- 정답 이유: Node.appendChild()는 한 Node를 특정 부모 Node의 자식 목록 중 마지막 자식으로 삽입합니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (DOM 조작 > DOM 요소 조작)",
  },
  {
    id: "js9e2-03",
    conceptId: "easy2-dom-setattribute",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "다음 HTML과 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "<a id=\"site\" href=\"https://google.com\">이동</a>\n\n<script>\n  const aTag = document.querySelector('#site')\n  aTag.setAttribute('href', 'https://ssafy.com')\n  console.log(aTag.getAttribute('href'))\n</script>",
    options: [
      "'https://google.com'",
      "null",
      "'https://ssafy.com'",
      "undefined",
    ],
    answer: 2,
    hint: "setAttribute('href', 새값)은 기존 href 속성 값을 새 값으로 갱신합니다.",
    explanation: "정답: 3번\n- 실행 과정: aTag.setAttribute('href', 'https://ssafy.com')으로 속성 값을 변경한 뒤 aTag.getAttribute('href')로 조회하므로 'https://ssafy.com'이 출력됩니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (DOM 조작 > 속성 조작 > 일반 속성 조작)",
  },
  {
    id: "js9e2-04",
    conceptId: "easy2-dom-toggle",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "다음 HTML과 JavaScript 코드를 실행한 직후 <body class=\"dark\"> 요소의 상태에 대한 설명으로 올바른 것은?",
    code: "<body class=\"dark\"></body>\n\n<script>\n  const bodyTag = document.querySelector('body')\n  bodyTag.classList.toggle('dark')\n</script>",
    options: [
      "오류가 발생하여 아무 변화도 없다.",
      "태그 이름 자체가 <div>로 바뀐다.",
      "'dark' 클래스가 두 개로 중복 추가된다.",
      "이미 있던 'dark' 클래스가 제거된다.",
    ],
    answer: 3,
    hint: "classList.toggle()은 클래스가 이미 존재하면 제거하고, 없으면 추가합니다.",
    explanation: "정답: 4번\n- 실행 과정: 초기 <body>에 'dark' 클래스가 이미 존재하므로 classList.toggle('dark')를 호출하면 'dark' 클래스가 제거됩니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (DOM 조작 > 속성 조작 > 클래스 속성 조작)",
  },
  {
    id: "js9e2-05",
    conceptId: "easy2-dom-let-reassign",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "let count = 1\ncount = 2\nconsole.log(count)",
    options: [
      "TypeError가 발생한다.",
      "2",
      "1",
      "undefined",
    ],
    answer: 1,
    hint: "let 키워드로 선언한 변수는 새로운 값으로 재할당할 수 있습니다.",
    explanation: "정답: 2번\n- 실행 과정: let은 재할당이 가능한 변수를 선언하는 키워드이므로 count = 2 실행 후 2가 출력됩니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (변수 > 변수 선언 키워드 > let)",
  },
  {
    id: "js9e2-06",
    conceptId: "easy2-bs1-string-concat",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const first = 'SSAFY'\nconst num = 16\nconsole.log(first + num)",
    options: [
      "NaN",
      "16",
      "TypeError가 발생한다.",
      "'SSAFY16'",
    ],
    answer: 3,
    hint: "문자열과 숫자를 '+' 연산자로 더하면 숫자가 문자열로 자동 형 변환되어 이어 붙여집니다.",
    explanation: "정답: 4번\n- 실행 과정: 문자열 'SSAFY'와 숫자 16을 + 연산하면 16이 문자열 '16'으로 변환되어 'SSAFY16'이 됩니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (원시 자료형 > Number)",
  },
  {
    id: "js9e2-07",
    conceptId: "easy2-bs1-if-else",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const role = 'student'\n\nif (role === 'admin') {\n  console.log('관리자')\n} else if (role === 'student') {\n  console.log('교육생')\n} else {\n  console.log('방문자')\n}",
    options: [
      "'student'",
      "'관리자'",
      "'방문자'",
      "'교육생'",
    ],
    answer: 3,
    hint: "role === 'student' 조건이 참이 되는 분기를 확인하세요.",
    explanation: "정답: 4번\n- 실행 과정: role의 값이 'student'이므로 첫 번째 if 조건은 거짓이고, else if (role === 'student') 조건이 참이 되어 '교육생'이 출력됩니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (조건문 > if 조건문)",
  },
  {
    id: "js9e2-08",
    conceptId: "easy2-bs1-for-in-object",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "객체의 열거 가능한 속성 키(key)를 순회하기 위해 설계된 반복문은 무엇인가?",
    options: [
      "for...of",
      "for...in",
      "Array.prototype.map()",
      "Array.prototype.filter()",
    ],
    answer: 1,
    hint: "객체(Object)의 프로퍼티 키를 하나씩 꺼내는 반복문입니다.",
    explanation: "정답: 2번\n- 정답 이유: for...in 반복문은 객체의 열거 가능한 속성의 키(key)를 순회할 때 사용합니다.\n- 오답 분석: 1) for...of는 배열이나 문자열 등 반복 가능한(iterable) 객체의 값(value)을 순회할 때 사용합니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (반복문 > for...in)",
  },
  {
    id: "js9e2-09",
    conceptId: "easy2-bs1-function-declaration-hoisting",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "console.log(add(3, 4))\n\nfunction add(a, b) {\n  return a + b\n}",
    options: [
      "7",
      "undefined",
      "NaN",
      "ReferenceError가 발생한다.",
    ],
    answer: 0,
    hint: "함수 선언식(function add)은 함수 전체가 호이스팅되어 선언 코드 위에서도 호출할 수 있습니다.",
    explanation: "정답: 1번\n- 실행 과정: 함수 선언식으로 정의한 add는 호이스팅되므로 선언부보다 앞에서 add(3, 4)를 호출해도 정상적으로 7을 반환합니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (함수 > 함수 정의 > 함수 선언식 특징)",
  },
  {
    id: "js9e2-10",
    conceptId: "easy2-bs1-arrow-function-short",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const square = (x) => x * x\nconsole.log(square(5))",
    options: [
      "10",
      "SyntaxError가 발생한다.",
      "25",
      "undefined",
    ],
    answer: 2,
    hint: "화살표 함수 본문이 중괄호 없이 한 줄 표현식이면 그 평가 결과가 자동으로 반환됩니다.",
    explanation: "정답: 3번\n- 실행 과정: 화살표 함수에서 중괄호와 return을 생략하면 단일 표현식 x * x의 결과(5 * 5 = 25)가 반환됩니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (함수 > 화살표 함수 표현식)",
  },
  {
    id: "js9e2-11",
    conceptId: "easy2-bs1-spread-array",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const base = [2, 3]\nconst full = [1, ...base, 4]\nconsole.log(full)",
    options: [
      "SyntaxError가 발생한다.",
      "[1, [2, 3], 4]",
      "[1, 2, 3, 4]",
      "[2, 3, 1, 4]",
    ],
    answer: 2,
    hint: "전개 구문(...base)은 배열의 대괄호를 풀고 개별 요소들을 그 자리에 펼칩니다.",
    explanation: "정답: 3번\n- 실행 과정: ...base가 2와 3으로 펼쳐져 [1, 2, 3, 4]라는 새로운 배열이 생성됩니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (배열과 '전개 구문')",
  },
  {
    id: "js9e2-12",
    conceptId: "easy2-bs2-in-operator",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 순서대로 출력되는 불리언 값으로 올바른 것은?",
    code: "const car = { brand: 'Hyundai', year: 2026 }\nconsole.log('brand' in car, 'color' in car)",
    options: [
      "false true",
      "true true",
      "false false",
      "true false",
    ],
    answer: 3,
    hint: "'키이름' in 객체 연산자는 해당 속성이 객체에 존재하면 true, 없으면 false를 반환합니다.",
    explanation: "정답: 4번\n- 실행 과정: car 객체에 'brand' 속성은 존재하므로 true, 'color' 속성은 없으므로 false가 출력됩니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (객체 > 객체 기초 > 'in' 연산자)",
  },
  {
    id: "js9e2-13",
    conceptId: "easy2-bs2-json-parse",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const jsonText = '{\"city\":\"Gwangju\",\"classNum\":2}'\nconst obj = JSON.parse(jsonText)\nconsole.log(obj.city, obj.classNum)",
    options: [
      "'{city:Gwangju}' 2",
      "SyntaxError가 발생한다.",
      "'Gwangju' 2",
      "undefined undefined",
    ],
    answer: 2,
    hint: "JSON.parse()는 JSON 형식의 문자열을 JavaScript 객체로 변환합니다.",
    explanation: "정답: 3번\n- 실행 과정: JSON.parse(jsonText)로 문자열이 객체 { city: 'Gwangju', classNum: 2 }로 변환되므로 obj.city는 'Gwangju', obj.classNum은 2가 출력됩니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (객체 > JSON)",
  },
  {
    id: "js9e2-14",
    conceptId: "easy2-bs2-object-keys",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const menu = { coffee: 4500, latte: 5000 }\nconsole.log(Object.keys(menu))",
    options: [
      "['coffee', 'latte']",
      "{ coffee: 4500, latte: 5000 }",
      "[4500, 5000]",
      "[['coffee', 4500], ['latte', 5000]]",
    ],
    answer: 0,
    hint: "Object.keys(obj)는 객체의 속성 키(key) 이름들을 모은 배열을 반환합니다.",
    explanation: "정답: 1번\n- 실행 과정: Object.keys(menu)는 menu 객체의 키 이름인 ['coffee', 'latte'] 배열을 반환합니다.\n- 오답 분석: 3) 값들의 배열은 Object.values(menu), 4) [키, 값] 쌍 배열은 Object.entries(menu)의 결과입니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (객체 > 추가 객체 문법 > 6. 유용한 객체 메서드)",
  },
  {
    id: "js9e2-15",
    conceptId: "easy2-bs2-optional-chaining",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const user = { name: '지영' }\nconsole.log(user.profile?.email)",
    options: [
      "TypeError가 발생한다.",
      "undefined",
      "null",
      "''",
    ],
    answer: 1,
    hint: "Optional Chaining(?.)은 ?. 바로 왼쪽 값이 null 또는 undefined일 때 에러 대신 undefined를 반환합니다.",
    explanation: "정답: 2번\n- 실행 과정: user.profile이 undefined이므로 Optional Chaining(?.)이 뒤의 .email 평가를 멈추고 TypeError 없이 undefined를 반환합니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (객체 > 추가 객체 문법 > 7. Optional chaining)",
  },
  {
    id: "js9e2-16",
    conceptId: "easy2-bs2-foreach-return",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const arr = [1, 2, 3]\nconst res = arr.forEach((num) => num * 2)\nconsole.log(res)",
    options: [
      "[1, 2, 3]",
      "6",
      "[2, 4, 6]",
      "undefined",
    ],
    answer: 3,
    hint: "forEach()는 배열을 단순 순회할 뿐 별도의 반환값이 없습니다.",
    explanation: "정답: 4번\n- 실행 과정: forEach() 메서드는 콜백 함수에서 값을 return하더라도 항상 undefined를 반환합니다. 새 배열을 얻으려면 map()을 사용해야 합니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (배열의 진화: Array helper method > 순회: forEach)",
  },
  {
    id: "js9e2-17",
    conceptId: "easy2-bs2-array-find",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const users = [\n  { id: 1, name: '철수' },\n  { id: 2, name: '영희' },\n]\n\nconst found = users.find((u) => u.id === 2)\nconsole.log(found.name)",
    options: [
      "'철수'",
      "undefined",
      "'영희'",
      "2",
    ],
    answer: 2,
    hint: "find()는 콜백 함수 조건이 참인 첫 번째 요소 자체를 반환합니다.",
    explanation: "정답: 3번\n- 실행 과정: users.find((u) => u.id === 2)는 { id: 2, name: '영희' } 객체를 반환하므로 found.name은 '영희'입니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (기타 유용한 Array Helper Methods > find)",
  },
  {
    id: "js9e2-18",
    conceptId: "easy2-evt-click-counter",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "multiple-choice",
    prompt: "다음 HTML과 JavaScript 코드에서 <button id=\"btn\">클릭</button>을 2번 연속 클릭했을 때 #counter 요소의 textContent로 올바른 것은?",
    code: "<button id=\"btn\">클릭</button>\n<span id=\"counter\">0</span>\n\n<script>\n  let count = 0\n  const btn = document.querySelector('#btn')\n  const counter = document.querySelector('#counter')\n\n  btn.addEventListener('click', function () {\n    count += 1\n    counter.textContent = count\n  })\n</script>",
    options: [
      "'2'",
      "'0'",
      "'1'",
      "'011'",
    ],
    answer: 0,
    hint: "클릭 이벤트가 발생할 때마다 count가 1씩 증가하고 counter.textContent에 반영됩니다.",
    explanation: "정답: 1번\n- 실행 과정: 버튼을 1번 클릭하면 count가 1, 2번 클릭하면 count가 2가 되어 counter.textContent는 '2'가 됩니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (event handler 활용 > 1. click 이벤트 실습)",
  },
  {
    id: "js9e2-19",
    conceptId: "easy2-evt-event-type",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "multiple-choice",
    prompt: "사용자가 <input type=\"text\"> 입력창에 글자를 타이핑할 때마다 실시간으로 값을 감지하기 위해 addEventListener에 전달하는 이벤트 유형(type)은?",
    options: [
      "'scroll'",
      "'input'",
      "'submit'",
      "'copy'",
    ],
    answer: 1,
    hint: "<input> 요소의 값이 변경될 때마다 즉시 발생하는 이벤트 이름입니다.",
    explanation: "정답: 2번\n- 정답 이유: 'input' 이벤트는 <input>이나 <textarea> 등의 값이 사용자 입력으로 변경될 때마다 실시간으로 발생합니다.\n- 오답 분석: 3) 'submit'은 <form> 제출 시, 4) 'copy'는 복사 시, 1) 'scroll'은 스크롤 시 발생합니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (event handler 활용 > 2. input 이벤트 실습)",
  },
  {
    id: "js9e2-20",
    conceptId: "easy2-evt-target",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "multiple-choice",
    prompt: "버블링이 발생하더라도 변하지 않고 '실제 클릭 이벤트가 최초로 발생한 가장 안쪽 DOM 요소'를 참조하는 event 객체의 속성은?",
    options: [
      "event.preventDefault",
      "event.target",
      "event.type",
      "event.currentTarget",
    ],
    answer: 1,
    hint: "리스너가 등록된 요소는 currentTarget, 실제 이벤트가 시작된 타겟 요소는 target입니다.",
    explanation: "정답: 2번\n- 정답 이유: event.target은 실제 이벤트가 발생한 가장 안쪽의 요소를 참조하며, 버블링이 진행되어도 바뀌지 않습니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (버블링 > event.target)",
  },
  {
    id: "js9e2-21",
    conceptId: "easy2-evt-handler-this",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "multiple-choice",
    prompt: "다음 HTML과 JavaScript 코드에서 <button id=\"my-btn\">확인</button>을 클릭했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "<button id=\"my-btn\">확인</button>\n\n<script>\n  const btn = document.querySelector('#my-btn')\n  btn.addEventListener('click', function () {\n    console.log(this.id)\n  })\n</script>",
    options: [
      "TypeError가 발생한다.",
      "undefined",
      "'my-btn'",
      "'click'",
    ],
    answer: 2,
    hint: "addEventListener에 일반 함수(function)를 이벤트 핸들러로 등록하면 내부의 this는 리스너가 연결된 요소(event.currentTarget)를 가리킵니다.",
    explanation: "정답: 3번\n- 실행 과정: 일반 함수를 핸들러로 사용했으므로 this는 이벤트 리스너가 연결된 <button id=\"my-btn\"> 요소를 가리키며, this.id는 'my-btn'을 출력합니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (event handler > 이벤트 핸들러에서의 this)",
  },
  {
    id: "js9e2-22",
    conceptId: "easy2-sa-dom-getattribute",
    difficulty: "easy",
    category: "DOM",
    questionType: "short-answer",
    prompt: "다음 HTML과 JavaScript 코드를 실행했을 때 콘솔에 출력되는 문자열을 작성하시오.",
    code: "<img id=\"logo\" src=\"ssafy.png\" />\n<script>\n  const img = document.querySelector('#logo')\n  console.log(img.getAttribute('src'))\n</script>",
    options: [],
    answer: null,
    acceptedAnswers: [
      "ssafy.png",
      "'ssafy.png'",
      "\"ssafy.png\"",
    ],
    hint: "getAttribute('src')는 요소의 src 속성 값을 문자열로 반환합니다.",
    explanation: "정답: ssafy.png\n- 실행 과정: img.getAttribute('src')는 <img> 태그에 지정된 src 속성 값 'ssafy.png'를 반환합니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (DOM 조작 > 속성 조작 > 일반 속성 조작)",
  },
  {
    id: "js9e2-23",
    conceptId: "easy2-sa-bs1-array-length",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "short-answer",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 숫자를 작성하시오.",
    code: "const colors = ['red', 'green', 'blue', 'yellow']\nconsole.log(colors.length)",
    options: [],
    answer: null,
    acceptedAnswers: [
      "4",
    ],
    hint: "배열의 length 속성은 배열에 담긴 요소의 개수를 반환합니다.",
    explanation: "정답: 4\n- 실행 과정: colors 배열에 4개의 문자열 요소가 들어 있으므로 colors.length는 4입니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (배열 기초 > 배열 구조)",
  },
  {
    id: "js9e2-24",
    conceptId: "easy2-sa-bs2-array-pop",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "short-answer",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 문자열을 작성하시오.",
    code: "const stack = ['first', 'second', 'third']\nconst last = stack.pop()\nconsole.log(last)",
    options: [],
    answer: null,
    acceptedAnswers: [
      "third",
      "'third'",
      "\"third\"",
    ],
    hint: "pop() 메서드는 배열의 가장 마지막 요소를 제거하고 그 제거된 요소를 반환합니다.",
    explanation: "정답: third\n- 실행 과정: stack.pop()은 배열의 끝 요소 'third'를 제거하고 반환하므로 last에는 'third'가 저장됩니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (배열 기초 > pop())",
  },
  {
    id: "js9e2-25",
    conceptId: "easy2-sa-evt-classlist-contains",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "short-answer",
    prompt: "다음 HTML과 JavaScript 코드를 실행했을 때 콘솔에 출력되는 불리언 값을 작성하시오.",
    code: "<p id=\"msg\" class=\"notice active\">안내</p>\n<script>\n  const p = document.querySelector('#msg')\n  console.log(p.classList.contains('active'))\n</script>",
    options: [],
    answer: null,
    acceptedAnswers: [
      "true",
    ],
    hint: "classList.contains('클래스명')은 해당 클래스가 요소에 포함되어 있으면 true를 반환합니다.",
    explanation: "정답: true\n- 실행 과정: <p> 요소의 클래스 목록에 'active'가 포함되어 있으므로 p.classList.contains('active')는 true를 반환합니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (event handler 활용 > 3. click & input 이벤트 실습)",
  },
]

export const QUESTION_BANK: Record<StudyDifficulty, StudyQuestion[]> = {
  easy: ROUND9_JS_EASY_SET2_QUESTIONS.filter((q) => q.difficulty === 'easy'),
  medium: ROUND9_JS_EASY_SET2_QUESTIONS.filter((q) => q.difficulty === 'medium'),
  hard: ROUND9_JS_EASY_SET2_QUESTIONS.filter((q) => q.difficulty === 'hard'),
}

export const ALL_QUESTIONS: StudyQuestion[] = ROUND9_JS_EASY_SET2_QUESTIONS

export default ROUND9_JS_EASY_SET2_QUESTIONS
