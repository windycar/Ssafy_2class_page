/**
 * SSAFY 광주 2반 사이트 - 과목평가 9회차 - JavaScript 쉬운버전 (1회차) 문제 데이터
 *
 * - 평가 과목: JavaScript (과목평가 9회차 - JavaScript 쉬운버전 (1회차), 2026-11-23 시행 대비 기초 연습)
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

export const SUBJECT_EVAL_9_EASY_SET1_META: SubjectEvaluationMeta = {
  round: 9,
  setNumber: 1,
  difficultyLevel: 'easy',
  subject: 'JavaScript',
  title: "과목평가 9회차 - JavaScript 쉬운버전 (1회차)",
  examDate: '2026-11-23',
  totalQuestions: 25,
  objectiveCount: 21,
  subjectiveCount: 4,
  questionTypes: ['multiple-choice', 'short-answer'],
}

export const ROUND9_JS_EASY_SET1_QUESTIONS: StudyQuestion[] = [
  {
    id: "js9e1-01",
    conceptId: "easy-dom-meaning",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "웹 브라우저가 HTML 문서를 프로그래밍 언어로 접근·조작할 수 있도록 계층적인 객체 트리 구조로 표현한 모델은 무엇인가?",
    options: [
      "HTTP",
      "DOM",
      "JSON",
      "URL",
    ],
    answer: 1,
    hint: "Document Object Model의 약자를 떠올려 보세요.",
    explanation: "정답: 2번\n- 정답 이유: DOM(Document Object Model)은 웹 페이지(Document)를 구조화된 객체 트리로 제공하여 JavaScript가 문서의 구조, 스타일, 내용을 동적으로 변경할 수 있게 하는 모델입니다.\n- 오답 분석:\n  4) URL은 웹 리소스의 경로 주소입니다.\n  1) HTTP는 브라우저와 서버 간 통신 규약입니다.\n  3) JSON은 Key-Value 형태의 문자열 데이터 표기법입니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (DOM > 문서 구조)",
  },
  {
    id: "js9e1-02",
    conceptId: "easy-dom-queryselector",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "CSS 선택자와 일치하는 HTML 요소 중 '가장 첫 번째 요소 1개'만 선택하여 반환하는 메서드는?",
    options: [
      "document.appendChild()",
      "document.querySelector()",
      "document.querySelectorAll()",
      "document.createElement()",
    ],
    answer: 1,
    hint: "여러 개를 NodeList로 반환하는 메서드와 달리 단일 요소만 반환하는 메서드입니다.",
    explanation: "정답: 2번\n- 정답 이유: document.querySelector(selector)는 제공한 CSS 선택자와 일치하는 첫 번째 Element 객체 1개를 반환하며, 일치하는 요소가 없으면 null을 반환합니다.\n- 오답 분석:\n  3) querySelectorAll()은 일치하는 모든 요소를 NodeList로 반환합니다.\n  4) createElement()는 새 HTML 요소를 메모리에 생성합니다.\n  1) appendChild()는 생성한 노드를 부모 요소의 마지막 자식으로 삽입합니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (DOM 선택 > 선택 메서드)",
  },
  {
    id: "js9e1-03",
    conceptId: "easy-dom-textcontent",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "다음 HTML과 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "<h1 id=\"title\">이전 제목</h1>\n\n<script>\n  const h1Tag = document.querySelector('#title')\n  h1Tag.textContent = '새로운 제목'\n  console.log(h1Tag.textContent)\n</script>",
    options: [
      "undefined",
      "null",
      "'새로운 제목'",
      "'이전 제목'",
    ],
    answer: 2,
    hint: "textContent 프로퍼티에 새 문자열을 할당하면 요소 내부의 텍스트 콘텐츠가 변경됩니다.",
    explanation: "정답: 3번\n- 실행 과정: document.querySelector('#title')로 <h1> 요소를 선택한 뒤 h1Tag.textContent = '새로운 제목'으로 텍스트를 수정했으므로 콘솔에는 '새로운 제목'이 출력됩니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (DOM 조작 > HTML 콘텐츠 조작)",
  },
  {
    id: "js9e1-04",
    conceptId: "easy-dom-classlist-add-remove",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "선택한 DOM 요소의 classList에서 지정한 클래스 이름을 제거할 때 사용하는 메서드는?",
    options: [
      "element.removeAttribute('id')",
      "element.classList.add()",
      "element.classList.remove()",
      "element.getAttribute()",
    ],
    answer: 2,
    hint: "classList에서 추가는 add(), 제거는 remove(), 전환은 toggle()을 사용합니다.",
    explanation: "정답: 3번\n- 정답 이유: element.classList.remove()는 해당 요소의 클래스 목록에서 지정한 클래스 값을 제거합니다.\n- 오답 분석:\n  2) classList.add()는 클래스를 추가하는 메서드입니다.\n  4), 1) getAttribute()와 removeAttribute()는 일반 HTML 속성을 조회·제거하는 메서드입니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (DOM 조작 > 속성 조작 > 클래스 속성 조작)",
  },
  {
    id: "js9e1-05",
    conceptId: "easy-dom-const-keyword",
    difficulty: "easy",
    category: "DOM",
    questionType: "multiple-choice",
    prompt: "JavaScript에서 변수 선언 시 재할당이 불가능한 상수를 선언하며, 기본적으로 사용이 권장되는 키워드는?",
    options: [
      "let",
      "const",
      "function",
      "var",
    ],
    answer: 1,
    hint: "의도치 않은 값 재할당을 막기 위해 우선적으로 사용하는 ES6 변수 선언 키워드입니다.",
    explanation: "정답: 2번\n- 정답 이유: const는 재할당이 불가능한 블록 스코프 상수를 선언할 때 사용하며, 코드의 의도를 명확히 하고 버그를 예방하기 위해 기본 사용이 권장됩니다.\n- 오답 분석:\n  4) var는 함수 스코프와 호이스팅 문제로 권장되지 않습니다.\n  1) let은 재할당이 필요한 경우에만 선택적으로 사용합니다.\n  3) function은 함수를 정의하는 키워드입니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (변수 > 변수 선언 키워드)",
  },
  {
    id: "js9e1-06",
    conceptId: "easy-bs1-primitive-types",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 중 JavaScript의 원시 자료형(Primitive type)에 해당하지 않는 것은?",
    options: [
      "Number",
      "String",
      "Boolean",
      "Array",
    ],
    answer: 3,
    hint: "원시 자료형에는 Number, String, Boolean, null, undefined 등이 있고, 객체와 배열, 함수는 참조 자료형입니다.",
    explanation: "정답: 4번\n- 정답 이유: Array(배열)는 Object, Function과 함께 메모리 주소가 복사되는 참조 자료형(Reference type)에 속합니다.\n- 오답 분석: 1), 2), 3) Number, String, Boolean은 모두 값 자체가 저장되는 원시 자료형입니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (데이터 타입 > 원시 자료형)",
  },
  {
    id: "js9e1-07",
    conceptId: "easy-bs1-template-literal",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const name = '김싸피'\nconst age = 25\nconsole.log(`${name}님은 ${age}세입니다.`)",
    options: [
      "'${name}님은 ${age}세입니다.'",
      "'name님은 age세입니다.'",
      "SyntaxError가 발생한다.",
      "'김싸피님은 25세입니다.'",
    ],
    answer: 3,
    hint: "백틱(`)으로 감싼 템플릿 리터럴 안의 ${변수}는 해당 변수의 값으로 치환됩니다.",
    explanation: "정답: 4번\n- 실행 과정: 백틱(`)을 사용한 템플릿 리터럴 내부에서 ${name}은 '김싸피', ${age}는 25로 평가되어 '김싸피님은 25세입니다.'가 출력됩니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (원시 자료형 > Template literals)",
  },
  {
    id: "js9e1-08",
    conceptId: "easy-bs1-strict-equality",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 순서대로 출력되는 결과로 올바른 것은?",
    code: "console.log('10' == 10)\nconsole.log('10' === 10)",
    options: [
      "false, false",
      "true, true",
      "true, false",
      "false, true",
    ],
    answer: 2,
    hint: "==는 타입을 변환해 비교하고, ===는 값과 타입이 모두 같아야 true를 반환합니다.",
    explanation: "정답: 3번\n- 실행 과정:\n  1) '10' == 10은 동등 연산자(==)로 암묵적 타입 변환이 일어나 문자열 '10'과 숫자 10을 같다고 판단하여 true를 반환합니다.\n  2) '10' === 10은 일치 연산자(===)로 타입까지 엄격하게 비교하므로 String과 Number가 달라 false를 반환합니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (연산자 > 동등 연산자, 일치 연산자)",
  },
  {
    id: "js9e1-09",
    conceptId: "easy-bs1-ternary-operator",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const score = 85\nconst result = score >= 80 ? '합격' : '불합격'\nconsole.log(result)",
    options: [
      "'합격'",
      "'불합격'",
      "true",
      "false",
    ],
    answer: 0,
    hint: "삼항 연산자 '조건 ? 참일때값 : 거짓일때값'에서 85 >= 80은 참입니다.",
    explanation: "정답: 1번\n- 실행 과정: score가 85이므로 조건식 score >= 80이 true로 평가되어 콜론(:) 앞의 첫 번째 표현식인 '합격'이 반환됩니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (조건문 > 삼항 연산자)",
  },
  {
    id: "js9e1-10",
    conceptId: "easy-bs1-for-of",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const numbers = [10, 20, 30]\nlet sum = 0\n\nfor (const num of numbers) {\n  sum += num\n}\n\nconsole.log(sum)",
    options: [
      "'012'",
      "3",
      "30",
      "60",
    ],
    answer: 3,
    hint: "for...of 반복문은 배열의 각 요소 값(10, 20, 30)을 순서대로 순회합니다.",
    explanation: "정답: 4번\n- 실행 과정: for...of 반복문이 배열 numbers의 값 10, 20, 30을 차례로 꺼내 sum에 누적하므로 10 + 20 + 30 = 60이 출력됩니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (반복문 > for...of)",
  },
  {
    id: "js9e1-11",
    conceptId: "easy-bs1-default-param",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const greet = function (name = '교육생') {\n  return `안녕, ${name}`\n}\n\nconsole.log(greet())",
    options: [
      "'안녕, '",
      "'안녕, 교육생'",
      "'안녕, undefined'",
      "'안녕, null'",
    ],
    answer: 1,
    hint: "인자를 전달하지 않고 호출하면 기본 함수 매개변수(name = '교육생')가 적용됩니다.",
    explanation: "정답: 2번\n- 실행 과정: greet() 호출 시 인자를 전달하지 않았으므로 매개변수 name에 기본값 '교육생'이 할당되어 '안녕, 교육생'이 반환됩니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (함수 > 매개변수 > 기본 함수 매개변수)",
  },
  {
    id: "js9e1-12",
    conceptId: "easy-bs2-object-access",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const user = {\n  name: 'Alice',\n  age: 24,\n}\n\nuser.age = 25\nconsole.log(user.name, user['age'])",
    options: [
      "TypeError가 발생한다.",
      "'Alice' 24",
      "'Alice' 25",
      "undefined 25",
    ],
    answer: 2,
    hint: "객체 속성은 점(.) 표기법과 대괄호([]) 표기법 모두로 접근·수정할 수 있습니다.",
    explanation: "정답: 3번\n- 실행 과정: user.age = 25로 age 속성 값을 수정한 뒤 user.name('Alice')과 user['age'](25)를 출력하므로 'Alice' 25가 출력됩니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (객체 > 객체 기초 > 속성 참조)",
  },
  {
    id: "js9e1-13",
    conceptId: "easy-bs2-this-method",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const person = {\n  name: '민수',\n  sayHi() {\n    return `이름: ${this.name}`\n  },\n}\n\nconsole.log(person.sayHi())",
    options: [
      "'이름: 민수'",
      "ReferenceError가 발생한다.",
      "'이름: undefined'",
      "'이름: person'",
    ],
    answer: 0,
    hint: "객체의 메서드를 person.sayHi()처럼 호출할 때 메서드 내부의 this는 호출한 객체(person)를 가리킵니다.",
    explanation: "정답: 1번\n- 실행 과정: person.sayHi()로 메서드를 호출했으므로 메서드 내부의 this는 person 객체를 가리키며, this.name은 '민수'가 됩니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (객체 > 메서드와 this)",
  },
  {
    id: "js9e1-14",
    conceptId: "easy-bs2-json-stringify",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "JavaScript 객체를 JSON 형식의 문자열로 변환할 때 사용하는 메서드는?",
    options: [
      "JSON.stringify()",
      "JSON.parse(text)",
      "Object.keys(obj)",
      "Object.entries(obj)",
    ],
    answer: 0,
    hint: "반대로 JSON 문자열을 JavaScript 객체로 변환할 때는 JSON.parse()를 사용합니다.",
    explanation: "정답: 1번\n- 정답 이유: JSON.stringify()는 JavaScript 객체를 JSON 표기법의 문자열(string)로 변환합니다.\n- 오답 분석:\n  2) JSON.parse()는 JSON 문자열을 JavaScript 객체로 변환합니다.\n  3) Object.keys()는 객체의 키 목록을 배열로 반환합니다.\n  4) Object.entries()는 [키, 값] 쌍 배열을 반환합니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (객체 > JSON)",
  },
  {
    id: "js9e1-15",
    conceptId: "easy-bs2-destructuring",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const profile = {\n  username: 'ssafy_gj',\n  track: 'Python',\n}\n\nconst { username, track } = profile\nconsole.log(track, username)",
    options: [
      "'ssafy_gj' 'Python'",
      "undefined undefined",
      "SyntaxError가 발생한다.",
      "'Python' 'ssafy_gj'",
    ],
    answer: 3,
    hint: "객체 구조 분해 할당은 속성 이름(key)과 같은 이름의 변수에 해당 값을 꺼내 담습니다.",
    explanation: "정답: 4번\n- 실행 과정: 구조 분해 할당 { username, track } = profile에 의해 username에는 'ssafy_gj', track에는 'Python'이 저장되며, console.log(track, username) 순서대로 'Python' 'ssafy_gj'가 출력됩니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (객체 > 추가 객체 문법 > 4. 구조 분해 할당)",
  },
  {
    id: "js9e1-16",
    conceptId: "easy-bs2-array-map",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const nums = [1, 2, 3]\nconst doubled = nums.map((n) => n * 2)\nconsole.log(doubled)",
    options: [
      "6",
      "undefined",
      "[1, 2, 3]",
      "[2, 4, 6]",
    ],
    answer: 3,
    hint: "map() 메서드는 배열의 각 요소에 콜백 함수를 적용한 반환값을 모아 새로운 배열을 만듭니다.",
    explanation: "정답: 4번\n- 실행 과정: nums.map((n) => n * 2)는 원본 배열 [1, 2, 3]의 각 요소에 2를 곱한 결과인 새 배열 [2, 4, 6]을 반환합니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (배열의 진화: Array helper method > 변형: map)",
  },
  {
    id: "js9e1-17",
    conceptId: "easy-bs2-array-filter",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "multiple-choice",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 결과로 올바른 것은?",
    code: "const numbers = [1, 2, 3, 4, 5]\nconst evens = numbers.filter((n) => n % 2 === 0)\nconsole.log(evens)",
    options: [
      "[false, true, false, true, false]",
      "2",
      "[2, 4]",
      "[1, 3, 5]",
    ],
    answer: 2,
    hint: "filter()는 콜백 함수의 반환값이 참(true)인 요소들만 걸러내어 새 배열로 반환합니다.",
    explanation: "정답: 3번\n- 실행 과정: n % 2 === 0(짝수 조건)이 true인 요소는 2와 4뿐이므로 filter()는 새 배열 [2, 4]를 반환합니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (배열의 진화: Array helper method > 선별: filter)",
  },
  {
    id: "js9e1-18",
    conceptId: "easy-evt-addeventlistener",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "multiple-choice",
    prompt: "특정 DOM 요소에 지정한 이벤트가 발생했을 때 실행할 이벤트 핸들러(콜백 함수)를 등록하는 메서드는?",
    options: [
      "element.addEventListener()",
      "document.querySelector('button')",
      "document.createElement('button')",
      "event.preventDefault()",
    ],
    answer: 0,
    hint: "EventTarget.addEventListener(type, handler) 형식으로 사용합니다.",
    explanation: "정답: 1번\n- 정답 이유: addEventListener(type, handler)는 특정 DOM 요소에 지정한 유형(type)의 이벤트가 발생했을 때 호출될 이벤트 핸들러를 등록하는 메서드입니다.\n- 오답 분석:\n  2) querySelector()는 요소를 선택합니다.\n  3) createElement()는 새 요소를 생성합니다.\n  4) preventDefault()는 이벤트 객체에서 기본 동작을 취소할 때 호출합니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (event handler > .addEventListener())",
  },
  {
    id: "js9e1-19",
    conceptId: "easy-evt-preventdefault",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "multiple-choice",
    prompt: "<form> 요소의 submit 이벤트 발생 시 브라우저의 기본 동작인 페이지 새로고침을 취소하기 위해 호출하는 메서드는?",
    options: [
      "event.stopPropagation()",
      "event.preventDefault()",
      "form.removeChild()",
      "document.querySelector()",
    ],
    answer: 1,
    hint: "취소 가능한 이벤트의 기본 동작(default action)을 막는 event 객체의 메서드입니다.",
    explanation: "정답: 2번\n- 정답 이유: event.preventDefault()는 폼 제출 시 페이지 새로고침이나 <a> 클릭 시 페이지 이동 등 취소 가능한 이벤트의 기본 동작을 실행하지 않도록 막습니다.\n- 오답 분석: 1) stopPropagation()은 상위 요소로의 이벤트 전파(버블링)를 중단하는 메서드입니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (이벤트 기본 동작 취소하기 > preventDefault)",
  },
  {
    id: "js9e1-20",
    conceptId: "easy-evt-bubbling",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "multiple-choice",
    prompt: "한 HTML 요소에 이벤트가 발생했을 때, 해당 요소의 핸들러가 동작한 뒤 부모 요소와 최상위 조상 요소로 거슬러 올라가며 핸들러가 순차 실행되는 현상은?",
    options: [
      "버블링 (Bubbling)",
      "단축 평가 (Short-circuit)",
      "호이스팅 (Hoisting)",
      "구조 분해 (Destructuring)",
    ],
    answer: 0,
    hint: "물속 거품이 아래에서 위로 올라가는 모습에서 유래한 용어입니다.",
    explanation: "정답: 1번\n- 정답 이유: 이벤트 버블링(Bubbling)은 가장 안쪽의 타겟 요소에서 발생한 이벤트가 부모 요소 방향으로 상향 전파되며 각 요소에 등록된 핸들러를 동작시키는 현상입니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (버블링)",
  },
  {
    id: "js9e1-21",
    conceptId: "easy-evt-target-vs-currenttarget",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "multiple-choice",
    prompt: "이벤트 핸들러에 전달되는 event 객체에서 '이벤트 핸들러(리스너)가 실제로 연결된 요소'를 가리키는 속성은?",
    options: [
      "event.bubbles",
      "event.target",
      "event.currentTarget",
      "event.defaultPrevented",
    ],
    answer: 2,
    hint: "event.target은 실제 이벤트가 시작된 가장 안쪽 요소이고, 리스너가 부착된 현재 요소는 currentTarget입니다.",
    explanation: "정답: 3번\n- 정답 이유: event.currentTarget은 이벤트 리스너가 실제로 연결된 현재 요소를 가리키며, event.target은 실제 이벤트가 최초로 발생한 가장 안쪽 요소를 가리킵니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (버블링 > target & currentTarget)",
  },
  {
    id: "js9e1-22",
    conceptId: "easy-sa-dom-create",
    difficulty: "easy",
    category: "DOM",
    questionType: "short-answer",
    prompt: "JavaScript에서 새로운 <li> HTML 요소를 메모리에 생성할 때 사용하는 document 메서드의 이름을 작성하시오. (괄호 ()는 생략)",
    options: [],
    answer: null,
    acceptedAnswers: [
      "createElement",
      "createElement()",
      "document.createElement",
      "document.createElement()",
    ],
    hint: "document.createElement('li') 형태로 사용합니다.",
    explanation: "정답: createElement\n- 정답 이유: document.createElement(tagName)는 지정한 태그 이름의 HTML 요소를 메모리에 생성하여 반환합니다.\n- 참고 출처: 강의자료 '16기_1111_Javascript_DOM.pdf' (DOM 조작 > DOM 요소 조작)",
  },
  {
    id: "js9e1-23",
    conceptId: "easy-sa-bs1-typeof",
    difficulty: "easy",
    category: "Basic Syntax 01",
    questionType: "short-answer",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 문자열을 작성하시오.",
    code: "let x\nconsole.log(typeof x)",
    options: [],
    answer: null,
    acceptedAnswers: [
      "undefined",
      "'undefined'",
      "\"undefined\"",
    ],
    hint: "값을 할당하지 않고 선언만 한 변수에는 undefined가 할당됩니다.",
    explanation: "정답: undefined\n- 실행 과정: let x로 변수를 선언만 하고 값을 할당하지 않았으므로 x의 값은 undefined이며, typeof x는 문자열 'undefined'를 반환합니다.\n- 참고 출처: 강의자료 '16기_1112_Javascript_Basic_Syntax_01.pdf' (원시 자료형 > undefined)",
  },
  {
    id: "js9e1-24",
    conceptId: "easy-sa-bs2-array-push",
    difficulty: "easy",
    category: "Basic Syntax 02",
    questionType: "short-answer",
    prompt: "다음 JavaScript 코드를 실행했을 때 콘솔에 출력되는 숫자를 작성하시오.",
    code: "const fruits = ['apple', 'banana']\nconst len = fruits.push('cherry')\nconsole.log(len)",
    options: [],
    answer: null,
    acceptedAnswers: [
      "3",
    ],
    hint: "push()는 배열 끝에 요소를 추가한 뒤 새로운 배열의 길이를 반환합니다.",
    explanation: "정답: 3\n- 실행 과정: 기존 2개 요소가 있던 배열에 'cherry'를 추가하면 총 3개 요소가 되며, push()는 변경 후 배열의 새 길이 3을 반환합니다.\n- 참고 출처: 강의자료 '16기_1116_Javascript_Basic_Syntax_02.pdf' (배열 기초 > push())",
  },
  {
    id: "js9e1-25",
    conceptId: "easy-sa-evt-input-value",
    difficulty: "easy",
    category: "Controlling Event",
    questionType: "short-answer",
    prompt: "다음 HTML의 <input> 요소에 사용자가 입력한 현재 문자열 값을 JavaScript로 읽어 올 때 사용하는 프로퍼티 이름을 작성하시오.",
    code: "<input type=\"text\" id=\"user-input\" />\n<script>\n  const input = document.querySelector('#user-input')\n  // 현재 입력값: input.( 빈칸 )\n</script>",
    options: [],
    answer: null,
    acceptedAnswers: [
      "value",
      ".value",
      "input.value",
    ],
    hint: "input 이벤트 실습에서 event.currentTarget.value 형태로 입력값을 조회합니다.",
    explanation: "정답: value\n- 정답 이유: <input> 요소에 사용자가 현재 입력한 값은 input.value 프로퍼티로 읽거나 초기화할 수 있습니다.\n- 참고 출처: 강의자료 '16기_1117_Javascript_Controlling_Event.pdf' (event handler 활용 > 2. input 이벤트 실습)",
  },
]

export const QUESTION_BANK: Record<StudyDifficulty, StudyQuestion[]> = {
  easy: ROUND9_JS_EASY_SET1_QUESTIONS.filter((q) => q.difficulty === 'easy'),
  medium: ROUND9_JS_EASY_SET1_QUESTIONS.filter((q) => q.difficulty === 'medium'),
  hard: ROUND9_JS_EASY_SET1_QUESTIONS.filter((q) => q.difficulty === 'hard'),
}

export const ALL_QUESTIONS: StudyQuestion[] = ROUND9_JS_EASY_SET1_QUESTIONS

export default ROUND9_JS_EASY_SET1_QUESTIONS
