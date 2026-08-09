import type { StudyQuestionType } from "../../types/study";
import type {
  WebCategory,
  WebDifficulty,
  WebQuestion,
} from "../../types/webStudy";
import { WEB_ESSAY_MIN_LENGTH } from "../../utils/webStudyGrading";

export const WEB_CATEGORY_META: Record<
  WebCategory,
  { label: string; shortLabel: string; color: string; description: string }
> = {
  html: {
    label: "HTML · 웹 구조",
    shortLabel: "HTML",
    color: "#f97316",
    description: "문서 구조, 요소, 태그와 속성",
  },
  css: {
    label: "CSS · Box Model",
    shortLabel: "CSS",
    color: "#2563eb",
    description: "선택자, 명시도, 박스 모델과 레이아웃",
  },
  bootstrap: {
    label: "Bootstrap",
    shortLabel: "Bootstrap",
    color: "#7c3aed",
    description: "CDN, Reboot, 유틸리티와 컴포넌트",
  },
  semantic: {
    label: "Semantic Web",
    shortLabel: "Semantic",
    color: "#059669",
    description: "의미 있는 마크업과 OOCSS",
  },
  "responsive-grid": {
    label: "반응형 · Grid",
    shortLabel: "Grid",
    color: "#0891b2",
    description: "12단 그리드, gutters와 breakpoints",
  },
  "ux-ui": {
    label: "UX · UI",
    shortLabel: "UX/UI",
    color: "#db2777",
    description: "사용자 경험과 인터페이스 설계",
  },
};

export const WEB_DIFFICULTY_META: Record<
  WebDifficulty,
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
    eyebrow: "WEB STARTER",
    description: "교안의 핵심 용어와 기본 규칙을 확인해요.",
    color: "#059669",
    gradient: "from-emerald-500 to-teal-600",
    expectedMinutes: "문제당 약 40초",
  },
  medium: {
    label: "중간",
    eyebrow: "WEB BUILDER",
    description: "코드 결과와 속성 간 관계를 연결해요.",
    color: "#2563eb",
    gradient: "from-blue-600 to-cyan-600",
    expectedMinutes: "문제당 약 1분",
  },
  hard: {
    label: "어려움",
    eyebrow: "WEB MASTER",
    description: "명시도, 박스 계산과 반응형 동작을 종합해요.",
    color: "#7c3aed",
    gradient: "from-violet-600 to-fuchsia-600",
    expectedMinutes: "문제당 약 90초",
  },
};

export const WEB_QUESTION_TYPE_META: Record<
  StudyQuestionType,
  { label: string; shortLabel: string; description: string; color: string }
> = {
  "multiple-choice": {
    label: "객관식 4지선다",
    shortLabel: "객관식",
    description: "보기에서 정답 하나를 선택합니다.",
    color: "#2563eb",
  },
  "short-answer": {
    label: "단답형",
    shortLabel: "단답형",
    description: "대·소문자와 기호까지 정확히 입력합니다.",
    color: "#059669",
  },
  essay: {
    label: "서술형",
    shortLabel: "서술형",
    description: `정답과 이유를 ${WEB_ESSAY_MIN_LENGTH}자 이상 서술합니다.`,
    color: "#d97706",
  },
};

type QuestionVariant = {
  prompt: string;
  code?: string;
  correct: string;
  acceptedAnswers?: string[];
  distractors: [string, string, string];
  explanation: string;
  hint: string;
};

type QuestionDraft = QuestionVariant & { category: WebCategory };
type QuestionBuilder = (variant: number) => QuestionDraft;

const RUBRIC_KEYWORDS: Record<WebCategory, string[]> = {
  html: ["HTML", "요소", "구조"],
  css: ["CSS", "선택자", "스타일"],
  bootstrap: ["Bootstrap", "클래스", "컴포넌트"],
  semantic: ["시멘틱", "의미", "구조"],
  "responsive-grid": ["반응형", "그리드", "breakpoint"],
  "ux-ui": ["사용자", "경험", "인터페이스"],
};

function topic(category: WebCategory, variants: QuestionVariant[]): QuestionBuilder {
  if (variants.length !== 5) {
    throw new Error(`${category} 문항 빌더는 정확히 5개 변형이 필요합니다.`);
  }
  return (variant) => ({ category, ...variants[variant] });
}

function getQuestionType(index: number): StudyQuestionType {
  const slot = index % 20;
  if (slot < 12) return "multiple-choice";
  if (slot < 17) return "short-answer";
  return "essay";
}

function promptForType(prompt: string, questionType: StudyQuestionType) {
  if (questionType === "multiple-choice") {
    return `${prompt}\n가장 알맞은 답을 고르시오.`;
  }
  if (questionType === "short-answer") {
    return `${prompt}\n정답만 정확히 작성하시오.`;
  }
  return `${prompt}\n정답을 먼저 밝히고 관련 개념과 이유를 ${WEB_ESSAY_MIN_LENGTH}자 이상 서술하시오.`;
}

function withOptions(
  difficulty: WebDifficulty,
  index: number,
  builderIndex: number,
  variant: number,
  draft: QuestionDraft,
): WebQuestion {
  const questionType = getQuestionType(index);
  const baseOptions = [draft.correct, ...draft.distractors];
  const shift = index % 4;
  const options = questionType === "multiple-choice"
    ? [...baseOptions.slice(shift), ...baseOptions.slice(0, shift)]
    : [];
  const rubricKeywords = questionType === "essay"
    ? RUBRIC_KEYWORDS[draft.category]
    : undefined;
  const acceptedAnswers = questionType === "multiple-choice"
    ? undefined
    : [draft.correct, ...(draft.acceptedAnswers ?? [])];
  const modelAnswer = questionType === "essay"
    ? `정답은 ${draft.correct}입니다. ${draft.explanation} 따라서 제시된 코드나 상황에서는 HTML 구조, CSS 규칙, Bootstrap 클래스 또는 반응형 조건이 적용되는 순서를 구분해야 합니다. ${rubricKeywords?.join(", ")} 관점의 핵심 개념을 실제 화면 결과와 연결해 설명하면 요구된 이유를 명확하게 제시할 수 있습니다.`
    : undefined;

  return {
    id: `web-${difficulty}-${String(index + 1).padStart(3, "0")}`,
    conceptId: `web-${difficulty}-${String(builderIndex + 1).padStart(2, "0")}-${variant + 1}`,
    difficulty,
    category: draft.category,
    questionType,
    prompt: promptForType(draft.prompt, questionType),
    code: draft.code,
    options,
    answer: questionType === "multiple-choice" ? options.indexOf(draft.correct) : null,
    acceptedAnswers,
    modelAnswer,
    rubricKeywords,
    minLength: questionType === "essay" ? WEB_ESSAY_MIN_LENGTH : undefined,
    explanation: draft.explanation,
    hint: draft.hint,
  };
}

function buildLevel(difficulty: WebDifficulty, builders: QuestionBuilder[]) {
  if (builders.length !== 20) {
    throw new Error(`${difficulty} 난이도에는 정확히 20개 문항 빌더가 필요합니다.`);
  }
  return Array.from({ length: 100 }, (_, index) => {
    const builderIndex = Math.floor(index / 5);
    const variant = index % 5;
    return withOptions(
      difficulty,
      index,
      builderIndex,
      variant,
      builders[builderIndex](variant),
    );
  });
}

const easyBuilders: QuestionBuilder[] = [
  topic("html", [
    { prompt: "웹 페이지(Web Page)의 역할에 대한 설명", correct: "웹 사이트를 구성하는 개별 문서", distractors: ["웹 서버의 데이터베이스", "브라우저 실행 파일", "네트워크 암호화 규칙"], explanation: "웹 페이지는 웹 사이트를 구성하며 브라우저에 표시되는 개별 문서입니다.", hint: "홈페이지와 About Us 같은 한 장의 문서를 떠올리세요." },
    { prompt: "HTML의 주된 역할", correct: "웹 페이지의 구조와 의미 정의", distractors: ["시각적 스타일만 정의", "서버 데이터 저장", "사용자 입력 암호화"], explanation: "HTML은 요소와 태그로 웹 문서의 구조와 의미를 정의합니다.", hint: "구조를 담당하는 언어입니다." },
    { prompt: "CSS의 주된 역할", correct: "웹 페이지의 디자인과 레이아웃 지정", distractors: ["HTML 문법 검사", "데이터베이스 테이블 생성", "웹 주소 등록"], explanation: "CSS는 색상, 크기, 간격과 레이아웃 같은 표현을 담당합니다.", hint: "스타일을 담당하는 언어입니다." },
    { prompt: "HTML, CSS, JavaScript의 관계에 대한 설명", correct: "HTML은 구조, CSS는 스타일, JavaScript는 동작을 담당한다", distractors: ["세 언어 모두 데이터베이스만 담당한다", "CSS가 구조를, HTML이 색상을 담당한다", "JavaScript는 정적 문서 제목만 담당한다"], explanation: "웹 페이지는 보통 구조·표현·동작의 역할을 세 기술로 나누어 구성합니다.", hint: "구조-스타일-동작 순서로 구분하세요." },
    { prompt: "World Wide Web(WWW)에 대한 설명", correct: "인터넷을 통해 서로 연결된 문서와 자원의 공간", distractors: ["컴퓨터 한 대의 로컬 폴더", "CSS 선택자 표준", "브라우저의 캐시 파일"], explanation: "웹은 인터넷을 기반으로 문서와 자원을 연결하고 공유하는 공간입니다.", hint: "인터넷 위에서 정보를 공유합니다." },
  ]),
  topic("html", [
    { prompt: "HTML 문서에서 사용자에게 보이는 주요 콘텐츠가 들어가는 영역", code: "<html>\n  <head>...</head>\n  <body>...</body>\n</html>", correct: "body", acceptedAnswers: ["<body>"], distractors: ["head", "title", "html"], explanation: "body 요소 안의 내용이 브라우저 화면의 주요 콘텐츠로 렌더링됩니다.", hint: "문서의 몸에 해당합니다." },
    { prompt: "HTML 문서의 제목과 메타 정보가 들어가는 영역", code: "<html>\n  <head>...</head>\n  <body>...</body>\n</html>", correct: "head", acceptedAnswers: ["<head>"], distractors: ["body", "footer", "main"], explanation: "head는 title과 메타데이터처럼 문서 정보를 담습니다.", hint: "body보다 앞에 위치합니다." },
    { prompt: "HTML 문서 전체의 최상위 요소", code: "<!DOCTYPE html>\n<html lang=\"ko\">...</html>", correct: "html", acceptedAnswers: ["<html>"], distractors: ["body", "main", "head"], explanation: "html 요소는 head와 body를 포함하는 문서의 최상위 요소입니다.", hint: "문서 이름과 같은 태그입니다." },
    { prompt: "브라우저 탭에 표시되는 문서 제목을 지정하는 요소", code: "<head>\n  <title>2반 웹 강의실</title>\n</head>", correct: "title", acceptedAnswers: ["<title>"], distractors: ["h1", "header", "caption"], explanation: "title 요소의 내용은 브라우저 탭이나 즐겨찾기 제목으로 사용됩니다.", hint: "head 내부에 작성합니다." },
    { prompt: "HTML 문서 기본 구조에 직접 포함되지 않는 태그", correct: "script", acceptedAnswers: ["<script>"], distractors: ["html", "head", "body"], explanation: "html, head, body는 기본 구조이고 script는 필요에 따라 추가하는 동작 관련 요소입니다.", hint: "교안 확인 문제의 기본 구조를 떠올리세요." },
  ]),
  topic("html", [
    { prompt: "문서의 최상위 제목에 사용하는 태그명", code: "<h1>웹 기초</h1>", correct: "h1", acceptedAnswers: ["<h1>"], distractors: ["h6", "p", "title"], explanation: "h1은 문서에서 가장 높은 수준의 제목을 나타냅니다.", hint: "h와 가장 작은 숫자의 조합입니다." },
    { prompt: "하나의 문단을 나타내는 태그명", code: "<p>첫 번째 문단</p>", correct: "p", acceptedAnswers: ["<p>"], distractors: ["br", "a", "span"], explanation: "p 요소는 문단(paragraph)을 나타냅니다.", hint: "paragraph의 첫 글자입니다." },
    { prompt: "텍스트를 강제로 줄바꿈하는 단일 태그명", code: "첫 줄<br>둘째 줄", correct: "br", acceptedAnswers: ["<br>"], distractors: ["p", "hr", "div"], explanation: "br은 line break를 만들어 다음 줄로 이동합니다.", hint: "break의 약자입니다." },
    { prompt: "다른 문서로 이동하는 하이퍼링크 태그명", code: "<a href=\"/study\">학습하기</a>", correct: "a", acceptedAnswers: ["<a>"], distractors: ["link", "nav", "href"], explanation: "a 요소는 href 속성으로 연결 대상을 지정합니다.", hint: "anchor의 첫 글자입니다." },
    { prompt: "의미상 강한 중요성을 나타내는 태그명", code: "<strong>시험 범위 공지</strong>", correct: "strong", acceptedAnswers: ["<strong>"], distractors: ["b", "em", "mark"], explanation: "strong은 단순 굵기뿐 아니라 내용의 강한 중요성을 표현합니다.", hint: "영어로 강하다는 뜻입니다." },
  ]),
  topic("html", [
    { prompt: "`<p class=\"note\">안내</p>`에서 `class`가 가리키는 HTML 구성 요소", code: "<p class=\"note\">안내</p>", correct: "속성", acceptedAnswers: ["Attribute", "attribute"], distractors: ["태그", "콘텐츠", "선택자"], explanation: "속성은 여는 태그 안에서 요소에 추가 정보를 부여합니다.", hint: "Attribute의 한국어 명칭입니다." },
    { prompt: "여는 태그, 콘텐츠, 닫는 태그를 합친 HTML 단위", code: "<p>Hello</p>", correct: "요소", acceptedAnswers: ["Element", "element"], distractors: ["속성", "선언", "선택자"], explanation: "HTML 요소는 태그와 그 사이의 콘텐츠를 포함한 전체 단위입니다.", hint: "Element의 한국어 명칭입니다." },
    { prompt: "HTML 요소를 올바르게 중첩해야 하는 핵심 이유", correct: "문서 구조와 부모-자식 관계를 명확히 유지", acceptedAnswers: ["올바른 문서 구조"], distractors: ["모든 글자를 굵게 표시", "CSS 파일 크기 자동 축소", "서버 요청 횟수 제거"], explanation: "올바른 중첩은 브라우저와 개발자가 문서 구조를 일관되게 해석하게 합니다.", hint: "태그를 연 순서의 반대로 닫습니다." },
    { prompt: "HTML과 CSS의 관심사를 분리하는 이유", correct: "구조와 스타일을 나누어 재사용성과 유지보수성을 높이기 위해", acceptedAnswers: ["재사용성과 유지보수성"], distractors: ["HTML 태그를 모두 제거하기 위해", "브라우저 실행을 막기 위해", "네트워크 연결 없이 서버를 만들기 위해"], explanation: "구조와 표현을 분리하면 여러 페이지에 스타일을 재사용하고 변경 범위를 줄일 수 있습니다.", hint: "외부 스타일시트의 장점을 연결하세요." },
    { prompt: "HTML에서 의미에 맞는 태그를 선택해야 하는 이유", correct: "문서 내용을 사람과 기계가 더 명확히 이해하도록 하기 위해", acceptedAnswers: ["의미와 구조를 명확히 전달"], distractors: ["모든 요소를 같은 모양으로 만들기 위해", "CSS 선택자를 금지하기 위해", "이미지를 자동 압축하기 위해"], explanation: "의미 있는 마크업은 구조 이해, 검색과 접근성에 도움을 줍니다.", hint: "Semantic의 목적을 떠올리세요." },
  ]),
  topic("css", [
    { prompt: "CSS(Cascading Style Sheets)에 대한 설명", correct: "웹 페이지의 디자인과 레이아웃을 담당하는 언어", distractors: ["데이터베이스 질의 언어", "웹 주소를 만드는 프로토콜", "HTML을 실행하는 운영체제"], explanation: "CSS는 HTML 요소의 색상, 크기, 간격, 배치 등 표현을 정의합니다.", hint: "스타일을 담당합니다." },
    { prompt: "HTML 요소의 style 속성에 직접 CSS를 쓰는 방식", code: "<h1 style=\"color: blue\">제목</h1>", correct: "인라인 방식", acceptedAnswers: ["Inline", "inline"], distractors: ["내부 방식", "외부 방식", "Reset 방식"], explanation: "인라인 방식은 각 요소의 style 속성에 선언을 직접 작성합니다.", hint: "태그 한 줄 안에 있습니다." },
    { prompt: "HTML 문서의 style 요소에 CSS를 모아 쓰는 방식", code: "<style>\n  h1 { color: blue; }\n</style>", correct: "내부 스타일시트 방식", acceptedAnswers: ["내부 방식", "Internal"], distractors: ["인라인 방식", "외부 방식", "CDN 방식"], explanation: "내부 방식은 보통 head 안의 style 요소에 해당 문서의 CSS를 작성합니다.", hint: "HTML 파일 내부에 모아서 씁니다." },
    { prompt: "별도 CSS 파일을 link 요소로 연결하는 방식", code: "<link rel=\"stylesheet\" href=\"style.css\">", correct: "외부 스타일시트 방식", acceptedAnswers: ["외부 방식", "External"], distractors: ["인라인 방식", "내부 방식", "시멘틱 방식"], explanation: "외부 방식은 구조와 스타일을 분리하고 여러 문서에서 파일을 재사용할 수 있습니다.", hint: "별도 .css 파일을 사용합니다." },
    { prompt: "CSS 선언 `color: red;`에서 `color`가 의미하는 것", code: ".title { color: red; }", correct: "속성", acceptedAnswers: ["property", "Property"], distractors: ["선택자", "속성값", "HTML 태그"], explanation: "CSS 선언은 속성(property)과 값(value)의 쌍으로 구성됩니다.", hint: "콜론 왼쪽 부분입니다." },
  ]),
  topic("css", [
    { prompt: "문서의 모든 HTML 요소를 선택하는 CSS 선택자", code: "* { box-sizing: border-box; }", correct: "전체 선택자 (*)", acceptedAnswers: ["*"], distractors: ["요소 선택자", "클래스 선택자", "ID 선택자"], explanation: "별표는 모든 요소에 일괄 스타일을 적용하는 전체 선택자입니다.", hint: "와일드카드 기호입니다." },
    { prompt: "모든 p 요소를 선택하는 CSS 선택자 종류", code: "p { color: navy; }", correct: "요소 선택자", acceptedAnswers: ["Type selector"], distractors: ["클래스 선택자", "ID 선택자", "전체 선택자"], explanation: "태그 이름을 그대로 쓰면 해당 종류의 모든 요소를 선택합니다.", hint: "태그명으로 선택합니다." },
    { prompt: "`.card`처럼 마침표로 시작하는 CSS 선택자 종류", code: ".card { padding: 16px; }", correct: "클래스 선택자", acceptedAnswers: ["class selector"], distractors: ["ID 선택자", "요소 선택자", "전체 선택자"], explanation: "클래스 선택자는 마침표 뒤의 class 값을 가진 요소들을 선택합니다.", hint: "여러 요소가 같은 값을 공유할 수 있습니다." },
    { prompt: "`#main`처럼 # 기호로 시작하는 CSS 선택자 종류", code: "#main { width: 100%; }", correct: "ID 선택자", acceptedAnswers: ["id selector"], distractors: ["클래스 선택자", "요소 선택자", "전체 선택자"], explanation: "ID 선택자는 # 뒤의 id 값을 가진 요소를 선택합니다.", hint: "# 기호를 사용합니다." },
    { prompt: "CSS 명시도가 높은 순서", correct: "ID 선택자 > 클래스 선택자 > 요소 선택자", distractors: ["요소 선택자 > 클래스 선택자 > ID 선택자", "클래스 선택자 > 요소 선택자 > ID 선택자", "전체 선택자 > ID 선택자 > 클래스 선택자"], explanation: "교안 기준 명시도는 ID가 클래스보다, 클래스가 요소보다 높습니다.", hint: "ID가 가장 강합니다." },
  ]),
  topic("css", [
    { prompt: "텍스트 색상을 지정하는 CSS 속성명", code: ".notice { ____: blue; }", correct: "color", distractors: ["font", "text", "background"], explanation: "color 속성은 요소의 글자색을 지정합니다.", hint: "색상을 뜻하는 영어 단어입니다." },
    { prompt: "클래스 선택자 `notice` 앞에 붙이는 기호", code: "____notice { color: red; }", correct: ".", distractors: ["#", "*", ":"], explanation: "클래스 선택자는 마침표(.)로 시작합니다.", hint: "키보드의 마침표입니다." },
    { prompt: "ID 선택자 `header` 앞에 붙이는 기호", code: "____header { color: red; }", correct: "#", distractors: [".", "*", "@"], explanation: "ID 선택자는 # 기호로 시작합니다.", hint: "해시 기호입니다." },
    { prompt: "요소의 안쪽 여백을 지정하는 CSS 속성명", code: ".card { ____: 16px; }", correct: "padding", distractors: ["margin", "border", "spacing"], explanation: "padding은 콘텐츠와 테두리 사이의 안쪽 여백입니다.", hint: "박스 내부 여백입니다." },
    { prompt: "요소의 바깥쪽 여백을 지정하는 CSS 속성명", code: ".card { ____: 16px; }", correct: "margin", distractors: ["padding", "border", "outline"], explanation: "margin은 테두리 바깥에서 다른 요소와의 간격을 만듭니다.", hint: "박스 외부 여백입니다." },
  ]),
  topic("css", [
    { prompt: "여러 CSS 규칙이 충돌할 때 우선순위를 결정하는 개념", correct: "명시도", acceptedAnswers: ["Specificity", "specificity"], distractors: ["박스 모델", "시멘틱", "CDN"], explanation: "명시도는 선택자의 가중치를 비교해 어떤 스타일을 적용할지 결정합니다.", hint: "Specificity의 한국어 명칭입니다." },
    { prompt: "동일한 명시도의 CSS 규칙이 충돌할 때 적용되는 규칙", correct: "나중에 선언된 스타일이 적용된다", acceptedAnswers: ["나중 선언 우선"], distractors: ["먼저 선언된 스타일이 적용된다", "두 스타일이 모두 무시된다", "HTML 태그가 삭제된다"], explanation: "캐스케이드에서 명시도가 같으면 소스상 뒤의 선언이 앞의 선언을 덮습니다.", hint: "선언 순서를 비교하세요." },
    { prompt: "외부 스타일시트 방식을 권장하는 이유", correct: "구조와 스타일을 분리해 재사용성과 유지보수성을 높인다", acceptedAnswers: ["재사용성과 유지보수성"], distractors: ["HTML 요소를 자동 생성한다", "모든 명시도를 같게 만든다", "브라우저를 서버로 바꾼다"], explanation: "하나의 CSS 파일을 여러 문서에서 재사용하고 스타일 변경을 한곳에서 관리할 수 있습니다.", hint: "관심사의 분리와 재사용을 생각하세요." },
    { prompt: "`!important`를 일반적인 스타일 작성에서 주의해야 하는 이유", correct: "자연스러운 명시도와 캐스케이드 흐름을 깨뜨려 유지보수를 어렵게 한다", acceptedAnswers: ["명시도 체계를 무시"], distractors: ["CSS 파일을 실행하지 못하게 한다", "HTML 구조를 자동 변경한다", "모든 색상을 투명하게 만든다"], explanation: "!important는 보통의 우선순위를 뛰어넘어 이후 재정의와 디버깅을 어렵게 합니다.", hint: "우선순위 체계를 강제로 덮습니다." },
    { prompt: "CSS 선택자를 구체적으로 작성할 때 고려할 핵심 원칙", correct: "필요한 요소를 명확히 선택하되 과도한 명시도는 피한다", acceptedAnswers: ["과도한 명시도 방지"], distractors: ["모든 선택자에 ID를 여러 개 쓴다", "항상 전체 선택자만 사용한다", "모든 선언에 !important를 붙인다"], explanation: "예측 가능한 캐스케이드를 위해 충분히 명확하면서 재정의 가능한 선택자를 사용해야 합니다.", hint: "명확성과 유지보수성의 균형입니다." },
  ]),
  topic("css", [
    { prompt: "CSS Box Model에서 실제 내용이 들어가는 가장 안쪽 영역", correct: "content", distractors: ["padding", "border", "margin"], explanation: "content 영역에는 텍스트나 이미지 같은 실제 내용이 놓입니다.", hint: "내용을 뜻하는 단어입니다." },
    { prompt: "콘텐츠와 테두리 사이의 영역", correct: "padding", distractors: ["margin", "content", "outline"], explanation: "padding은 콘텐츠 주위의 안쪽 여백입니다.", hint: "안쪽 여백입니다." },
    { prompt: "padding을 둘러싸는 경계선 영역", correct: "border", distractors: ["margin", "content", "display"], explanation: "border는 콘텐츠와 padding을 감싸는 테두리입니다.", hint: "경계선을 뜻합니다." },
    { prompt: "다른 요소와의 간격을 만드는 가장 바깥 영역", correct: "margin", distractors: ["padding", "border", "content"], explanation: "margin은 테두리 바깥의 여백입니다.", hint: "박스 모델의 가장 바깥입니다." },
    { prompt: "Box Model의 안쪽부터 바깥쪽 순서", correct: "content → padding → border → margin", distractors: ["margin → border → padding → content", "content → border → padding → margin", "padding → content → margin → border"], explanation: "박스는 content를 중심으로 padding, border, margin 순서로 확장됩니다.", hint: "내용에서 바깥쪽으로 이동하세요." },
  ]),
  topic("css", [
    { prompt: "대표적인 block 요소", correct: "p", acceptedAnswers: ["<p>"], distractors: ["span", "a", "strong"], explanation: "p 요소는 기본적으로 한 줄을 차지하는 block 요소입니다.", hint: "문단 요소입니다." },
    { prompt: "대표적인 inline 요소", correct: "span", acceptedAnswers: ["<span>"], distractors: ["div", "p", "main"], explanation: "span은 텍스트 흐름 안에서 필요한 영역만 차지하는 inline 요소입니다.", hint: "텍스트 일부를 감쌀 때 씁니다." },
    { prompt: "block 요소의 기본 배치 특성", correct: "새 줄에서 시작하고 가능한 가로 너비를 차지한다", distractors: ["항상 글자 한 칸만 차지한다", "화면에서 자동으로 숨겨진다", "부모 밖으로 반드시 넘친다"], explanation: "block 요소는 일반 흐름에서 새 줄을 만들고 사용 가능한 너비를 채우는 경향이 있습니다.", hint: "한 줄을 차지합니다." },
    { prompt: "inline 요소의 기본 배치 특성", correct: "텍스트 흐름을 유지하며 콘텐츠만큼 너비를 차지한다", distractors: ["항상 새 줄을 만든다", "부모의 전체 너비를 차지한다", "CSS를 적용할 수 없다"], explanation: "inline 요소는 줄바꿈 없이 인접한 콘텐츠와 같은 줄에 배치됩니다.", hint: "글의 흐름 안에 놓입니다." },
    { prompt: "inline-block의 특징", correct: "같은 줄에 배치되면서 width와 height를 지정할 수 있다", distractors: ["항상 새 줄에서만 시작한다", "width와 height를 사용할 수 없다", "HTML 구조를 자동 생성한다"], explanation: "inline-block은 inline 배치와 block 크기 제어 특성을 함께 가집니다.", hint: "두 display 특성의 조합입니다." },
  ]),
  topic("css", [
    { prompt: "`margin: 10px 20px;`에서 위쪽 여백", code: ".box { margin: 10px 20px; }", correct: "10px", distractors: ["20px", "30px", "0px"], explanation: "두 값 단축 표기에서 첫 값은 위·아래, 둘째 값은 좌·우입니다.", hint: "첫 번째 값은 세로 방향입니다." },
    { prompt: "`padding: 8px 16px;`에서 오른쪽 안쪽 여백", code: ".box { padding: 8px 16px; }", correct: "16px", distractors: ["8px", "24px", "0px"], explanation: "두 값 표기에서 좌우 padding은 두 번째 값입니다.", hint: "가로 방향 값을 찾으세요." },
    { prompt: "`margin: 1px 2px 3px 4px;`에서 왼쪽 여백", code: ".box { margin: 1px 2px 3px 4px; }", correct: "4px", distractors: ["1px", "2px", "3px"], explanation: "네 값은 위, 오른쪽, 아래, 왼쪽의 시계 방향 순서입니다.", hint: "네 번째 값입니다." },
    { prompt: "`padding: 5px 10px 15px;`에서 아래쪽 안쪽 여백", code: ".box { padding: 5px 10px 15px; }", correct: "15px", distractors: ["5px", "10px", "20px"], explanation: "세 값은 위, 좌우, 아래 순서입니다.", hint: "세 번째 값입니다." },
    { prompt: "`border: 2px solid red;`에서 테두리 두께", code: ".box { border: 2px solid red; }", correct: "2px", distractors: ["solid", "red", "0px"], explanation: "border 단축 속성은 두께, 스타일, 색상 순으로 작성할 수 있습니다.", hint: "첫 번째 값입니다." },
  ]),
  topic("css", [
    { prompt: "기본 `content-box`에서 width가 가리키는 영역", correct: "content 영역만", acceptedAnswers: ["content"], distractors: ["padding까지 포함", "border까지 포함", "margin까지 포함"], explanation: "content-box의 width와 height는 콘텐츠 영역의 크기를 뜻합니다.", hint: "속성값 이름 그대로입니다." },
    { prompt: "`border-box`에서 width가 포함하는 영역", correct: "content, padding, border", acceptedAnswers: ["content + padding + border"], distractors: ["content만", "content와 margin", "margin만"], explanation: "border-box는 지정한 width 안에 콘텐츠, padding과 border를 포함합니다.", hint: "테두리까지 포함합니다." },
    { prompt: "`box-sizing: border-box`를 레이아웃에 자주 사용하는 이유", correct: "padding과 border를 포함한 최종 크기를 예측하기 쉽기 때문", acceptedAnswers: ["최종 크기 예측"], distractors: ["margin을 width 안에 포함하기 때문", "HTML 요소를 자동 삭제하기 때문", "모든 요소를 inline으로 만들기 때문"], explanation: "지정한 width가 실제 테두리 바깥 크기가 되므로 레이아웃 계산이 단순해집니다.", hint: "설정한 width와 실제 외형 너비가 같습니다." },
    { prompt: "width 100px, 좌우 padding 10px, 좌우 border 2px인 content-box의 총 너비 계산 원리", correct: "100 + 20 + 4 = 124px", acceptedAnswers: ["124px", "124"], distractors: ["100px", "120px", "144px"], explanation: "content-box 총 너비는 width에 좌우 padding과 좌우 border를 더합니다.", hint: "양쪽 값을 각각 두 번 더하세요." },
    { prompt: "같은 CSS width라도 box-sizing에 따라 화면 크기가 달라지는 이유", correct: "width에 padding과 border를 포함하는 기준이 다르기 때문", acceptedAnswers: ["포함 기준이 다름"], distractors: ["margin의 색상이 달라지기 때문", "HTML 태그 이름이 바뀌기 때문", "브라우저가 CSS를 무시하기 때문"], explanation: "content-box와 border-box는 width가 가리키는 박스 범위가 다릅니다.", hint: "width의 기준 상자를 비교하세요." },
  ]),
  topic("bootstrap", [
    { prompt: "Bootstrap의 주된 목적", correct: "다양한 브라우저에서 일관된 UI를 빠르게 구현", distractors: ["데이터베이스 관리", "운영체제 설치", "서버 언어 번역"], explanation: "Bootstrap은 미리 작성된 CSS와 컴포넌트로 UI 개발을 돕는 툴킷입니다.", hint: "프론트엔드 CSS 프레임워크입니다." },
    { prompt: "Bootstrap을 별도 파일 설치 없이 불러올 때 활용하는 기술", correct: "CDN", distractors: ["DNS", "SQL", "SSH"], explanation: "CDN은 가까운 서버에서 정적 파일을 빠르게 전달합니다.", hint: "Content Delivery Network의 약자입니다." },
    { prompt: "브라우저별 기본 스타일 차이를 줄이는 CSS", correct: "Reset CSS", acceptedAnswers: ["Normalize CSS", "Reboot"], distractors: ["Grid CSS", "Animation CSS", "Database CSS"], explanation: "Reset 또는 Normalize 계열 CSS는 기본 스타일을 일관된 기준으로 재설정합니다.", hint: "초기화의 의미입니다." },
    { prompt: "Bootstrap에 포함된 Reset CSS 파일", correct: "bootstrap-reboot.css", distractors: ["bootstrap-grid.js", "bootstrap-reset.html", "bootstrap-theme.sql"], explanation: "Bootstrap은 Reboot를 통해 브라우저 기본 스타일을 조정합니다.", hint: "reboot가 파일명에 포함됩니다." },
    { prompt: "Bootstrap Component에 해당하는 예", correct: "버튼", acceptedAnswers: ["Button"], distractors: ["데이터베이스", "웹 서버", "운영체제"], explanation: "버튼, 드롭다운, 내비게이션 바와 카드 등이 Bootstrap 컴포넌트 예입니다.", hint: "UI 구성 요소를 찾으세요." },
  ]),
  topic("bootstrap", [
    { prompt: "Bootstrap에서 텍스트를 가운데 정렬하는 클래스", code: "<p class=\"text-center\">안내</p>", correct: "text-center", distractors: ["btn-primary", "container-fluid", "row"], explanation: "text-center 유틸리티는 text-align: center를 적용합니다.", hint: "text와 center의 조합입니다." },
    { prompt: "Bootstrap에서 성공 상태의 배경색을 지정하는 클래스", code: "<div class=\"bg-success\">완료</div>", correct: "bg-success", distractors: ["bg-danger", "text-success", "btn-success"], explanation: "bg-success는 성공 의미의 초록 계열 배경을 적용합니다.", hint: "background의 약자 bg를 사용합니다." },
    { prompt: "Bootstrap 버튼의 기본 클래스", code: "<button class=\"btn btn-primary\">저장</button>", correct: "btn", distractors: ["button", "card", "table"], explanation: "btn은 Bootstrap 버튼 컴포넌트의 기본 클래스입니다.", hint: "button의 축약형입니다." },
    { prompt: "Bootstrap에서 주요 색상 계열의 텍스트를 지정하는 클래스", code: "<p class=\"text-primary\">중요</p>", correct: "text-primary", distractors: ["bg-primary", "text-center", "btn-primary"], explanation: "text-primary는 텍스트에 primary 색상을 적용합니다.", hint: "text- 접두사를 사용합니다." },
    { prompt: "Bootstrap에서 반응형 고정 최대 너비 컨테이너를 만드는 클래스", code: "<div class=\"container\">...</div>", correct: "container", distractors: ["row", "col", "grid"], explanation: "container는 breakpoint별 최대 너비와 좌우 여백을 제공하는 기본 래퍼입니다.", hint: "콘텐츠를 담는 그릇입니다." },
  ]),
  topic("bootstrap", [
    { prompt: "Bootstrap 텍스트 가운데 정렬 클래스명", code: "<p class=\"____\">가운데</p>", correct: "text-center", distractors: ["text-left", "align-center", "center-text"], explanation: "text-center를 사용하면 텍스트가 가운데 정렬됩니다.", hint: "text-로 시작합니다." },
    { prompt: "Bootstrap 성공 배경 클래스명", code: "<div class=\"____\">성공</div>", correct: "bg-success", distractors: ["text-success", "btn-success", "success-bg"], explanation: "bg-success는 성공 상태의 배경색 유틸리티입니다.", hint: "bg-로 시작합니다." },
    { prompt: "Bootstrap 기본 버튼 클래스명", code: "<button class=\"____ btn-primary\">확인</button>", correct: "btn", distractors: ["button", "card", "input"], explanation: "btn 클래스가 버튼의 공통 형태를 제공합니다.", hint: "세 글자 축약형입니다." },
    { prompt: "Bootstrap 전체 폭 컨테이너 클래스명", code: "<div class=\"____\">...</div>", correct: "container-fluid", distractors: ["container-fixed", "row-fluid", "col-fluid"], explanation: "container-fluid는 viewport 전체 너비를 사용하는 컨테이너입니다.", hint: "container 뒤에 fluid가 붙습니다." },
    { prompt: "Bootstrap 주요 색상 버튼 클래스명", code: "<button class=\"btn ____\">확인</button>", correct: "btn-primary", distractors: ["bg-primary", "text-primary", "primary-btn"], explanation: "btn-primary는 primary 색상의 버튼 변형 클래스입니다.", hint: "btn- 접두사를 사용합니다." },
  ]),
  topic("semantic", [
    { prompt: "Semantic HTML의 핵심 목적", correct: "요소의 역할과 문서 구조를 의미 있게 표현", acceptedAnswers: ["의미와 구조를 명확히 표현"], distractors: ["모든 글자를 같은 색으로 표시", "서버 저장 공간을 확장", "CSS 파일을 삭제"], explanation: "시멘틱 요소는 콘텐츠의 의미를 태그 자체로 드러냅니다.", hint: "태그 이름이 역할을 설명합니다." },
    { prompt: "브라우저 기본 스타일을 일관된 기준으로 재설정하는 이유", correct: "브라우저마다 다른 기본 표시 차이를 줄이기 위해", acceptedAnswers: ["브라우저 간 일관성"], distractors: ["HTML 의미를 제거하기 위해", "이미지를 데이터베이스로 바꾸기 위해", "모든 버튼을 숨기기 위해"], explanation: "Reset CSS는 브라우저마다 다른 기본 스타일을 줄여 일관된 출발점을 제공합니다.", hint: "브라우저 간 차이를 생각하세요." },
    { prompt: "OOCSS의 핵심 원칙", correct: "구조와 스킨, 컨테이너와 콘텐츠를 분리해 재사용한다", acceptedAnswers: ["구조와 스킨 분리", "컨테이너와 콘텐츠 분리"], distractors: ["모든 CSS를 한 선택자에 작성", "ID 선택자만 사용", "HTML에서 class를 제거"], explanation: "OOCSS는 객체지향 접근으로 스타일 조각을 재사용하고 유지보수하기 쉽게 만듭니다.", hint: "분리와 재사용이 핵심입니다." },
    { prompt: "Bootstrap 컴포넌트를 사용하는 장점", correct: "검증된 UI 요소를 일관된 형태로 빠르게 재사용할 수 있다", acceptedAnswers: ["일관성과 재사용"], distractors: ["서버 코드를 자동 작성한다", "데이터베이스를 제거한다", "HTML 표준을 대체한다"], explanation: "버튼과 내비게이션 같은 컴포넌트를 조합해 개발 속도와 일관성을 높입니다.", hint: "미리 만들어진 UI 요소입니다." },
    { prompt: "CDN을 이용해 Bootstrap을 불러오는 장점", correct: "가까운 서버에서 정적 파일을 빠르고 안정적으로 전달받는다", acceptedAnswers: ["빠른 정적 파일 전송"], distractors: ["인터넷 없이 항상 사용할 수 있다", "HTML을 자동 번역한다", "사용자 비밀번호를 저장한다"], explanation: "CDN은 지리적으로 분산된 서버에서 사용자와 가까운 지점을 선택해 파일을 전송합니다.", hint: "전송 거리와 속도를 생각하세요." },
  ]),
  topic("responsive-grid", [
    { prompt: "Bootstrap Grid System에서 열(column)을 감싸는 행 클래스", code: "<div class=\"row\">...</div>", correct: "row", distractors: ["container", "grid", "column"], explanation: "row는 한 줄의 column 그룹을 감싸고 gutter 정렬을 담당합니다.", hint: "행을 뜻하는 단어입니다." },
    { prompt: "Bootstrap Grid의 한 행을 구성하는 기본 칸 수", correct: "12", acceptedAnswers: ["12칸"], distractors: ["10", "16", "24"], explanation: "Bootstrap은 한 row를 12개의 column 단위로 나눕니다.", hint: "교안의 12단 시스템입니다." },
    { prompt: "3등분된 열 하나에 사용하는 클래스", code: "<div class=\"row\">\n  <div class=\"col-md-4\">...</div>\n</div>", correct: "col-md-4", distractors: ["col-md-3", "col-md-6", "col-md-9"], explanation: "12칸을 3등분하면 각 열은 4칸을 차지합니다.", hint: "12를 3으로 나누세요." },
    { prompt: "Bootstrap Grid 구성 단위가 아닌 것", correct: "column", distractors: ["container", "row", "col"], explanation: "Bootstrap 클래스 이름은 container, row, col이며 column은 기본 클래스명이 아닙니다.", hint: "실제 클래스 철자를 확인하세요." },
    { prompt: "그리드 열 사이의 간격을 부르는 용어", correct: "gutters", acceptedAnswers: ["gutter"], distractors: ["headers", "routers", "borders"], explanation: "gutters는 column 사이의 수평·수직 여백을 의미합니다.", hint: "교안 목차에 나온 영어 용어입니다." },
  ]),
  topic("ux-ui", [
    { prompt: "UX(User Experience)의 의미", correct: "사용자가 서비스를 이용하며 느끼는 경험과 만족", distractors: ["버튼의 픽셀 색상만 정하는 작업", "서버 로그를 저장하는 방식", "HTML 태그 이름 규칙"], explanation: "UX는 사용 과정 전반의 경험과 만족도를 개선하는 분야입니다.", hint: "Experience에 초점을 맞추세요." },
    { prompt: "UI(User Interface)의 의미", correct: "사용자와 시스템이 상호작용하는 화면 요소와 접점", distractors: ["사용자의 전체 감정만 측정", "데이터베이스 연결 규칙", "네트워크 주소 체계"], explanation: "UI는 버튼, 드롭다운, 카드처럼 상호작용을 가능하게 하는 요소를 설계합니다.", hint: "Interface에 초점을 맞추세요." },
    { prompt: "Bootstrap의 가장 작은 교안 기준 breakpoint", correct: "sm", distractors: ["md", "lg", "xl"], explanation: "교안 기준 breakpoint는 sm, md, lg, xl 순서이며 sm이 가장 작습니다.", hint: "small의 약자입니다." },
    { prompt: "md breakpoint가 시작되는 화면 너비", correct: "768px", distractors: ["576px", "992px", "1200px"], explanation: "교안 기준 md는 768px 이상에서 적용됩니다.", hint: "태블릿 너비로 자주 제시됩니다." },
    { prompt: "xl breakpoint가 시작되는 화면 너비", correct: "1200px", distractors: ["576px", "768px", "992px"], explanation: "교안 기준 xl은 1200px 이상에서 적용됩니다.", hint: "네 자리 수 기준입니다." },
  ]),
  topic("responsive-grid", [
    { prompt: "12단 Grid에서 절반 너비를 차지하는 기본 클래스명", code: "<div class=\"____\">50%</div>", correct: "col-6", distractors: ["col-4", "col-8", "col-12"], explanation: "12칸 중 6칸은 50%입니다.", hint: "12의 절반입니다." },
    { prompt: "md 이상에서 한 열이 4칸을 차지하는 클래스명", code: "<div class=\"____\">...</div>", correct: "col-md-4", distractors: ["col-sm-4", "col-md-6", "row-md-4"], explanation: "col-md-4는 md breakpoint부터 4/12 너비를 적용합니다.", hint: "col-breakpoint-칸 수 순서입니다." },
    { prompt: "lg 이상에서 한 열이 3칸을 차지하는 클래스명", code: "<div class=\"____\">...</div>", correct: "col-lg-3", distractors: ["col-md-3", "col-lg-4", "lg-col-3"], explanation: "col-lg-3은 lg 이상에서 3/12, 즉 25% 너비를 적용합니다.", hint: "lg와 숫자 3의 조합입니다." },
    { prompt: "모든 화면에서 한 행 전체를 차지하는 클래스명", code: "<div class=\"____\">100%</div>", correct: "col-12", distractors: ["col-6", "col-md-12", "row-12"], explanation: "col-12는 별도 breakpoint 없이 항상 12칸 전체를 차지합니다.", hint: "12단 전체를 사용합니다." },
    { prompt: "Bootstrap Grid의 열에 공통으로 사용하는 접두사", code: "<div class=\"____-md-6\">...</div>", correct: "col", distractors: ["row", "grid", "column"], explanation: "Bootstrap 열 클래스는 col로 시작합니다.", hint: "column의 세 글자 축약형입니다." },
  ]),
  topic("responsive-grid", [
    { prompt: "반응형 웹 디자인의 핵심 목적", correct: "다양한 화면 크기에서 일관된 경험과 레이아웃을 제공", acceptedAnswers: ["다양한 화면 크기에 대응"], distractors: ["모든 화면을 한 고정 너비로 제한", "모바일 사용자를 차단", "CSS 없이 HTML만 표시"], explanation: "반응형 웹은 기기와 화면 폭이 달라도 콘텐츠를 사용하기 쉽게 재배치합니다.", hint: "화면 크기 변화에 대응합니다." },
    { prompt: "UX와 UI의 관계", correct: "UI는 사용자가 만나는 인터페이스이고 UX는 이용 과정의 전체 경험이다", acceptedAnswers: ["UI는 인터페이스, UX는 경험"], distractors: ["두 용어는 완전히 같은 뜻이다", "UX는 서버, UI는 데이터베이스다", "UI가 경험 전체이고 UX는 버튼 하나다"], explanation: "UI는 접점의 형태이고 UX는 그 접점을 포함한 전체 사용 경험을 다룹니다.", hint: "Interface와 Experience를 구분하세요." },
    { prompt: "breakpoint를 사용하는 이유", correct: "화면 너비 구간에 따라 적절한 그리드 배치로 전환하기 위해", acceptedAnswers: ["화면 너비별 배치 전환"], distractors: ["HTML 태그를 암호화하기 위해", "서버의 시간을 변경하기 위해", "모든 열을 숨기기 위해"], explanation: "breakpoint는 특정 최소 너비부터 다른 column 규칙을 적용하게 합니다.", hint: "배치가 바뀌는 분기점입니다." },
    { prompt: "12단 Grid System의 장점", correct: "여러 비율로 나누기 쉬워 일관된 레이아웃을 구성할 수 있다", acceptedAnswers: ["다양한 비율과 일관된 레이아웃"], distractors: ["CSS 선택자를 없앨 수 있다", "모든 화면을 12px로 만든다", "HTML 요소를 12개로 제한한다"], explanation: "12는 2, 3, 4, 6으로 나누기 쉬워 다양한 열 조합에 유리합니다.", hint: "12의 약수를 생각하세요." },
    { prompt: "모바일 우선 그리드 클래스 작성 원칙", correct: "기본 col 규칙을 먼저 쓰고 큰 breakpoint 규칙을 뒤에 추가한다", acceptedAnswers: ["작은 화면 기준부터 작성"], distractors: ["xl 규칙만 작성한다", "모든 breakpoint를 제거한다", "항상 px 고정 너비만 쓴다"], explanation: "Bootstrap의 breakpoint 클래스는 최소 너비 기준으로 적용되므로 작은 화면 기본값부터 확장합니다.", hint: "작은 화면에서 큰 화면 순서입니다." },
  ]),
];

// 중간·어려움은 같은 교안 범위를 코드 해석과 복합 조건 중심으로 확장합니다.
const mediumBuilders: QuestionBuilder[] = [
  topic("html", [
    { prompt: "다음 마크업에서 브라우저 탭 제목으로 사용되는 문자열", code: "<head><title>Web Lab</title></head>\n<body><h1>Quiz</h1></body>", correct: "Web Lab", distractors: ["Quiz", "head", "body"], explanation: "브라우저 탭 제목은 head 안의 title 콘텐츠입니다.", hint: "h1이 아니라 title을 확인하세요." },
    { prompt: "다음 마크업에서 화면의 최상위 제목으로 렌더링되는 문자열", code: "<head><title>Web Lab</title></head>\n<body><h1>Quiz</h1></body>", correct: "Quiz", distractors: ["Web Lab", "title", "head"], explanation: "body 안의 h1 콘텐츠가 화면에 표시되는 최상위 제목입니다.", hint: "body 안의 요소를 확인하세요." },
    { prompt: "`<a href=\"/report\">리포트</a>`에서 이동 경로를 가진 속성", code: "<a href=\"/report\">리포트</a>", correct: "href", distractors: ["class", "src", "title"], explanation: "a 요소의 href 속성이 링크 목적지를 지정합니다.", hint: "hypertext reference의 축약입니다." },
    { prompt: "`<p class=\"lead\">안내</p>`에서 CSS 클래스 값", code: "<p class=\"lead\">안내</p>", correct: "lead", distractors: ["p", "class", "안내"], explanation: "class 속성의 따옴표 안 문자열 lead가 클래스 값입니다.", hint: "등호 오른쪽을 확인하세요." },
    { prompt: "다음 중 부모-자식 중첩이 올바른 마크업", correct: "<main><p>내용</p></main>", distractors: ["<main><p>내용</main></p>", "<p><main>내용</p></main>", "<main></p>내용<p></main>"], explanation: "나중에 연 자식 태그 p를 먼저 닫은 뒤 부모 main을 닫아야 합니다.", hint: "스택처럼 역순으로 닫습니다." },
  ]),
  topic("html", [
    { prompt: "로고와 페이지 제목을 묶는 데 가장 의미가 적절한 요소", code: "<body>\n  <!-- 로고와 페이지 제목 -->\n</body>", correct: "header", distractors: ["div", "br", "strong"], explanation: "header는 문서나 구획의 소개·머리말 영역을 나타냅니다.", hint: "상단 소개 영역입니다." },
    { prompt: "주요 탐색 링크 묶음에 가장 적절한 요소", code: "<a href=\"/\">홈</a> <a href=\"/study\">학습</a>", correct: "nav", distractors: ["main", "p", "span"], explanation: "nav는 주요 내비게이션 링크 집합을 의미합니다.", hint: "navigation의 축약입니다." },
    { prompt: "페이지의 핵심 콘텐츠에 가장 적절한 요소", correct: "main", distractors: ["header", "footer", "span"], explanation: "main은 문서 body의 핵심 콘텐츠 영역을 나타냅니다.", hint: "페이지당 핵심 영역입니다." },
    { prompt: "독립적으로 배포 가능한 글이나 카드 콘텐츠에 적절한 요소", correct: "article", distractors: ["br", "b", "title"], explanation: "article은 뉴스, 게시글처럼 독립적으로 의미가 성립하는 콘텐츠에 적합합니다.", hint: "글 한 편을 뜻합니다." },
    { prompt: "문서나 구획의 하단 정보에 적절한 요소", correct: "footer", distractors: ["head", "header", "main"], explanation: "footer는 작성자, 저작권, 관련 링크 같은 하단 정보를 나타냅니다.", hint: "문서의 발 부분입니다." },
  ]),
  topic("html", [
    { prompt: "다음 빈칸에 들어갈 브라우저 탭 제목 요소명", code: "<head><____>2반 사이트</____></head>", correct: "title", distractors: ["h1", "header", "caption"], explanation: "title은 head 안에서 문서 제목을 지정합니다.", hint: "브라우저 탭에 표시됩니다." },
    { prompt: "다음 빈칸에 들어갈 주 탐색 영역 요소명", code: "<____><a href=\"/\">홈</a></____>", correct: "nav", distractors: ["main", "aside", "span"], explanation: "nav는 주요 탐색 링크를 묶는 시멘틱 요소입니다.", hint: "navigation의 앞 세 글자입니다." },
    { prompt: "다음 빈칸에 들어갈 class 선택자 기호", code: "____notice { color: red; }", correct: ".", distractors: ["#", "*", "@"], explanation: "HTML class 값은 CSS에서 마침표로 선택합니다.", hint: "ID의 #과 구분하세요." },
    { prompt: "다음 링크에서 목적지 경로를 지정하는 속성명", code: "<a ____=\"/study/web\">Web</a>", correct: "href", distractors: ["src", "alt", "class"], explanation: "href는 a 요소의 이동 목적지를 지정합니다.", hint: "링크 참조 속성입니다." },
    { prompt: "다음 요소의 class 속성값", code: "<section class=\"quiz-panel\">...</section>", correct: "quiz-panel", distractors: ["section", "class", "panel"], explanation: "class 속성의 값은 따옴표 안의 quiz-panel입니다.", hint: "하이픈까지 정확히 쓰세요." },
  ]),
  topic("html", [
    { prompt: "시각적으로 같은 결과가 나더라도 `<strong>`을 `<b>`보다 선호할 수 있는 이유", correct: "strong은 콘텐츠의 중요성이라는 의미를 함께 전달한다", acceptedAnswers: ["중요성의 의미 전달"], distractors: ["strong만 CSS를 적용할 수 있다", "b는 HTML 요소가 아니다", "strong은 항상 새 줄을 만든다"], explanation: "시멘틱 요소는 모양뿐 아니라 콘텐츠의 의미를 사용자 도구와 개발자에게 전달합니다.", hint: "표현과 의미를 구분하세요." },
    { prompt: "문서 구조를 head와 body로 나누는 이유", correct: "문서 정보와 화면 콘텐츠의 역할을 구분하기 위해", acceptedAnswers: ["문서 정보와 화면 콘텐츠 구분"], distractors: ["CSS 선택자를 두 개만 쓰기 위해", "인터넷 연결을 끊기 위해", "모든 요소를 inline으로 만들기 위해"], explanation: "head는 문서 메타 정보, body는 사용자에게 보이는 주요 콘텐츠를 담당합니다.", hint: "각 영역의 역할을 비교하세요." },
    { prompt: "시멘틱 요소가 검색 엔진과 보조 기술에 도움이 되는 이유", correct: "태그 자체가 콘텐츠의 역할과 구조를 설명하기 때문", acceptedAnswers: ["역할과 구조를 설명"], distractors: ["모든 글자를 자동 번역하기 때문", "CSS 파일을 압축하기 때문", "서버 응답을 캐시하기 때문"], explanation: "header, nav, main 같은 태그는 일반 div보다 각 영역의 의미를 명확히 전달합니다.", hint: "태그 이름이 의미를 가집니다." },
    { prompt: "여러 페이지에서 같은 CSS 파일을 공유할 때 얻는 효과", correct: "일관된 디자인을 재사용하고 변경을 한곳에서 관리한다", acceptedAnswers: ["재사용과 일관성"], distractors: ["HTML 구조가 자동 생성된다", "브라우저가 필요 없어졌다", "네트워크 주소가 바뀐다"], explanation: "외부 스타일시트를 공유하면 중복을 줄이고 전체 디자인을 한 번에 수정할 수 있습니다.", hint: "외부 CSS의 재사용을 생각하세요." },
    { prompt: "올바른 HTML 중첩이 유지보수에 중요한 이유", correct: "요소의 부모-자식 관계와 콘텐츠 범위를 예측할 수 있기 때문", acceptedAnswers: ["부모-자식 관계를 명확히"], distractors: ["모든 요소가 같은 크기가 되기 때문", "CSS 명시도가 항상 0이 되기 때문", "서버 파일이 삭제되기 때문"], explanation: "구조가 올바르면 스타일 적용 범위와 문서 해석을 안정적으로 추적할 수 있습니다.", hint: "DOM 구조의 예측 가능성입니다." },
  ]),
  topic("css", [
    { prompt: "다음 규칙 중 명시도가 가장 높은 선택자", code: "h1 {}\n.title {}\n#title {}\n* {}", correct: "#title", distractors: [".title", "h1", "*"], explanation: "ID 선택자는 클래스, 요소, 전체 선택자보다 명시도가 높습니다.", hint: "#으로 시작하는 선택자입니다." },
    { prompt: "다음 HTML의 색상을 결정하는 규칙", code: "<p id=\"note\" class=\"note\">안내</p>\n.note { color: blue; }\n#note { color: red; }", correct: "#note의 red", distractors: [".note의 blue", "브라우저 기본 black", "두 색의 혼합"], explanation: "ID 선택자 #note가 클래스 선택자 .note보다 명시도가 높습니다.", hint: "ID와 class를 비교하세요." },
    { prompt: "명시도가 같은 두 규칙에서 최종 글자색", code: ".note { color: blue; }\n.note { color: green; }", correct: "green", distractors: ["blue", "black", "transparent"], explanation: "명시도가 같으면 나중에 선언된 green이 적용됩니다.", hint: "소스 순서를 확인하세요." },
    { prompt: "인라인 style과 요소 선택자가 충돌할 때 적용되는 값", code: "<p style=\"color: orange\">안내</p>\np { color: navy; }", correct: "orange", distractors: ["navy", "black", "두 값 모두 무시"], explanation: "일반 요소 선택자보다 인라인 스타일의 우선순위가 높습니다.", hint: "태그 안에 직접 작성된 스타일입니다." },
    { prompt: "다음 선택자의 교안식 명시도 점수", code: "#app .card p { color: red; }", correct: "111", distractors: ["101", "21", "3"], explanation: "ID 1개 100점, 클래스 1개 10점, 요소 1개 1점으로 111점입니다.", hint: "100 + 10 + 1을 계산하세요." },
  ]),
  topic("css", [
    { prompt: "다음 규칙이 선택하는 요소", code: ".card { border: 1px solid; }", correct: "class가 card인 모든 요소", distractors: ["id가 card인 한 요소", "모든 div 요소", "모든 HTML 요소"], explanation: "마침표 선택자는 같은 class 값을 가진 여러 요소를 선택할 수 있습니다.", hint: "class 선택자입니다." },
    { prompt: "다음 규칙이 선택하는 요소", code: "#hero { min-height: 300px; }", correct: "id가 hero인 요소", distractors: ["class가 hero인 모든 요소", "모든 header 요소", "모든 HTML 요소"], explanation: "#hero는 id 속성값 hero를 가진 요소를 선택합니다.", hint: "ID 선택자입니다." },
    { prompt: "다음 규칙에서 선언 값(value)", code: ".card { padding: 24px; }", correct: "24px", distractors: ["padding", ".card", "card"], explanation: "콜론 오른쪽의 24px가 padding 속성의 값입니다.", hint: "콜론과 세미콜론 사이입니다." },
    { prompt: "외부 CSS 연결에 필요한 rel 속성값", code: "<link rel=\"____\" href=\"style.css\">", correct: "stylesheet", distractors: ["style", "css", "external"], explanation: "rel=stylesheet는 연결 파일이 스타일시트임을 나타냅니다.", hint: "style과 sheet가 합쳐진 단어입니다." },
    { prompt: "다음 중 동일 요소에 적용될 때 가장 먼저 고려할 우선 규칙", code: "p { color: blue !important; }\n#note { color: red; }", correct: "!important가 붙은 blue", distractors: ["ID 선택자의 red", "나중 선언된 red", "브라우저 기본값"], explanation: "교안 기준 !important는 일반 명시도보다 우선합니다.", hint: "강제 우선 키워드를 확인하세요." },
  ]),
  topic("css", [
    { prompt: "다음 코드의 최종 color 값", code: ".title { color: red; }\n.title { color: blue; }", correct: "blue", distractors: ["red", "black", "purple"], explanation: "같은 선택자가 반복되면 나중 선언 blue가 적용됩니다.", hint: "마지막 선언입니다." },
    { prompt: "다음 선택자의 교안식 명시도 점수", code: ".nav .item a { color: red; }", correct: "21", distractors: ["201", "111", "3"], explanation: "클래스 2개 20점과 요소 1개 1점을 더해 21점입니다.", hint: "10 + 10 + 1입니다." },
    { prompt: "`margin: 12px 24px`의 왼쪽 여백", code: ".box { margin: 12px 24px; }", correct: "24px", distractors: ["12px", "36px", "0px"], explanation: "두 값 단축 표기에서 좌우는 두 번째 값입니다.", hint: "가로 방향 값입니다." },
    { prompt: "`padding: 4px 8px 12px 16px`의 아래쪽 여백", code: ".box { padding: 4px 8px 12px 16px; }", correct: "12px", distractors: ["4px", "8px", "16px"], explanation: "네 값은 위, 오른쪽, 아래, 왼쪽 순서입니다.", hint: "세 번째 값입니다." },
    { prompt: "다음 선언의 속성명", code: ".box { box-sizing: border-box; }", correct: "box-sizing", distractors: ["border-box", "box-model", "sizing"], explanation: "콜론 왼쪽의 box-sizing이 속성명입니다.", hint: "하이픈까지 정확히 쓰세요." },
  ]),
  topic("css", [
    { prompt: "명시도와 소스 순서를 함께 확인해야 하는 이유", correct: "명시도가 우선이고 점수가 같을 때 선언 순서가 최종 값을 정하기 때문", acceptedAnswers: ["명시도 우선, 동일하면 나중 선언"], distractors: ["모든 규칙이 무작위로 적용되기 때문", "HTML이 CSS를 삭제하기 때문", "브라우저마다 태그 이름이 다르기 때문"], explanation: "캐스케이드는 중요도, 명시도와 소스 순서를 통해 충돌을 해결합니다.", hint: "우선순위 비교 후 동점 규칙입니다." },
    { prompt: "클래스 선택자를 재사용할 때 얻는 장점", correct: "여러 요소에 같은 스타일을 일관되게 적용하고 중복을 줄인다", acceptedAnswers: ["재사용과 중복 감소"], distractors: ["요소마다 다른 ID를 자동 생성한다", "CSS 파일을 실행 파일로 바꾼다", "HTML 구조를 숨긴다"], explanation: "class는 여러 요소가 공유할 수 있어 반복되는 디자인 규칙에 적합합니다.", hint: "ID와 달리 여러 요소가 공유합니다." },
    { prompt: "과도하게 높은 명시도가 유지보수에 불리한 이유", correct: "나중에 스타일을 재정의하려면 더 강한 선택자나 !important가 필요해지기 때문", acceptedAnswers: ["재정의가 어려움"], distractors: ["CSS가 더 빨리 로드되기 때문", "HTML 태그 수가 줄기 때문", "이미지가 선명해지기 때문"], explanation: "명시도 경쟁이 커지면 선택자가 복잡해지고 수정 영향 범위를 예측하기 어렵습니다.", hint: "스타일 덮어쓰기를 생각하세요." },
    { prompt: "margin 단축 속성의 네 값 순서를 시계 방향으로 읽는 이유", correct: "위, 오른쪽, 아래, 왼쪽 순서로 각 변을 일관되게 지정하기 위해", acceptedAnswers: ["상우하좌"], distractors: ["글자색 순서를 정하기 위해", "HTML 중첩을 만들기 위해", "breakpoint를 정하기 위해"], explanation: "네 값 단축 표기는 상단에서 시작해 시계 방향으로 각 변을 대응합니다.", hint: "상-우-하-좌입니다." },
    { prompt: "외부 스타일시트와 시멘틱 HTML을 함께 사용했을 때의 장점", correct: "구조와 의미는 HTML에, 표현은 CSS에 분리해 문서를 명확하고 재사용 가능하게 만든다", acceptedAnswers: ["구조와 표현의 분리"], distractors: ["CSS 없이 모든 디자인이 완성된다", "서버가 필요 없어지는 효과", "모든 태그가 div로 바뀌는 효과"], explanation: "역할에 맞는 기술 분리는 코드 이해, 재사용과 변경 관리를 돕습니다.", hint: "관심사의 분리입니다." },
  ]),
  topic("css", [
    { prompt: "content-box에서 실제 총 너비", code: ".box { width: 200px; padding: 10px; border: 2px solid; }", correct: "224px", distractors: ["200px", "212px", "244px"], explanation: "200 + 좌우 padding 20 + 좌우 border 4 = 224px입니다.", hint: "양쪽 padding과 border를 더하세요." },
    { prompt: "border-box에서 실제 총 너비", code: ".box { width: 200px; padding: 10px; border: 2px solid; box-sizing: border-box; }", correct: "200px", distractors: ["224px", "220px", "204px"], explanation: "border-box는 padding과 border를 지정한 width 안에 포함합니다.", hint: "외형 너비는 설정한 width입니다." },
    { prompt: "content-box에서 실제 총 높이", code: ".box { height: 80px; padding: 5px 0; border: 1px solid; }", correct: "92px", distractors: ["80px", "86px", "90px"], explanation: "80 + 위아래 padding 10 + 위아래 border 2 = 92px입니다.", hint: "세로 방향 양쪽을 계산하세요." },
    { prompt: "content-box에서 콘텐츠 너비", code: ".box { width: 160px; padding: 20px; border: 4px solid; }", correct: "160px", distractors: ["208px", "200px", "152px"], explanation: "content-box의 width는 콘텐츠 영역 자체의 너비입니다.", hint: "width가 가리키는 기본 영역입니다." },
    { prompt: "border-box 240px에서 좌우 padding 20px, border 2px일 때 콘텐츠 너비", code: ".box { width: 240px; padding: 20px; border: 2px solid; box-sizing: border-box; }", correct: "196px", distractors: ["240px", "216px", "192px"], explanation: "240 - 좌우 padding 40 - 좌우 border 4 = 196px입니다.", hint: "외형 너비에서 내부 여백과 테두리를 빼세요." },
  ]),
  topic("css", [
    { prompt: "다음 박스에서 margin을 제외한 외형 너비", code: ".box { width: 100px; padding: 10px 20px; border: 3px solid; }", correct: "146px", distractors: ["100px", "126px", "166px"], explanation: "100 + 좌우 padding 40 + 좌우 border 6 = 146px입니다.", hint: "가로 padding은 두 번째 값입니다." },
    { prompt: "`box-sizing: border-box`가 적용된 박스의 외형 너비", code: ".box { width: 320px; padding: 24px; border: 4px solid; box-sizing: border-box; }", correct: "320px", distractors: ["376px", "368px", "328px"], explanation: "border-box는 padding과 border를 width 320px 안에 포함합니다.", hint: "외형 너비가 width와 같습니다." },
    { prompt: "block 요소 두 개의 일반적인 배치", code: "<p>첫째</p>\n<p>둘째</p>", correct: "각 요소가 새 줄에 세로로 배치", distractors: ["한 줄에 나란히 배치", "두 번째 요소가 숨김", "항상 겹쳐서 배치"], explanation: "p 같은 block 요소는 일반 흐름에서 각각 새 줄을 차지합니다.", hint: "block의 줄바꿈 특성입니다." },
    { prompt: "inline 요소 두 개의 일반적인 배치", code: "<span>첫째</span><span>둘째</span>", correct: "콘텐츠 흐름 안에서 같은 줄에 배치", distractors: ["각각 새 줄을 차지", "두 요소 모두 화면에서 숨김", "부모 너비를 항상 초과"], explanation: "span 같은 inline 요소는 공간이 있으면 같은 줄에 이어집니다.", hint: "텍스트 흐름을 유지합니다." },
    { prompt: "`margin: 10px auto`에서 auto가 적용되는 방향", code: ".panel { width: 600px; margin: 10px auto; }", correct: "왼쪽과 오른쪽", distractors: ["위쪽만", "아래쪽만", "위쪽과 아래쪽"], explanation: "두 값 표기에서 첫 값은 상하, 두 번째 값 auto는 좌우에 적용됩니다.", hint: "두 번째 값은 가로 방향입니다." },
  ]),
  topic("css", [
    { prompt: "content-box에서 총 너비를 계산할 때 포함하는 항목", code: "width + ?", correct: "width + 좌우 padding + 좌우 border", acceptedAnswers: ["width+padding*2+border*2"], distractors: ["width만", "width + margin만", "padding + border만"], explanation: "content-box의 외형 너비는 콘텐츠 width에 내부 여백과 테두리 양쪽을 더합니다.", hint: "margin은 박스 외부 간격입니다." },
    { prompt: "border-box에서 padding을 늘리면 콘텐츠 영역이 변하는 방식", correct: "전체 width는 유지되고 콘텐츠 영역이 줄어든다", acceptedAnswers: ["콘텐츠 영역이 줄어듦"], distractors: ["전체 width가 항상 늘어난다", "margin이 자동으로 0이 된다", "border가 사라진다"], explanation: "지정된 외형 width 안에서 padding이 차지하는 공간이 커지므로 content 공간이 감소합니다.", hint: "전체 상자 크기는 고정입니다." },
    { prompt: "박스 모델 계산에서 좌우 값과 상하 값을 분리해야 하는 이유", correct: "너비에는 좌우, 높이에는 상하 padding과 border만 더하기 때문", acceptedAnswers: ["너비는 좌우, 높이는 상하"], distractors: ["모든 방향 값을 너비에 더하기 때문", "margin만 계산하기 때문", "CSS가 방향을 구분하지 않기 때문"], explanation: "가로 크기와 세로 크기는 각 축에 해당하는 변의 값만 영향을 줍니다.", hint: "x축과 y축을 나누세요." },
    { prompt: "border-box가 반응형 Grid 열 계산에 유리한 이유", correct: "padding과 border가 열 너비 안에 포함되어 합계가 예측 가능하기 때문", acceptedAnswers: ["열 너비 합계를 예측"], distractors: ["breakpoint를 제거하기 때문", "모든 열을 100%로 만들기 때문", "HTML 중첩을 막기 때문"], explanation: "열의 외형 크기가 선언된 너비를 넘지 않아 12단 배치를 안정적으로 계산할 수 있습니다.", hint: "외형 너비 초과를 방지합니다." },
    { prompt: "margin과 padding을 구분해야 하는 이유", correct: "padding은 테두리 안쪽, margin은 테두리 바깥쪽 간격이기 때문", acceptedAnswers: ["padding 안쪽, margin 바깥쪽"], distractors: ["두 속성이 완전히 같은 영역이기 때문", "둘 다 글자색만 바꾸기 때문", "margin만 박스 모델에 포함되기 때문"], explanation: "두 여백은 경계선을 기준으로 위치와 배경 적용 범위가 다릅니다.", hint: "border를 기준으로 비교하세요." },
  ]),
  topic("bootstrap", [
    { prompt: "다음 클래스 조합의 결과", code: "<button class=\"btn btn-primary\">저장</button>", correct: "Bootstrap 기본 버튼 형태에 primary 색상 적용", distractors: ["텍스트만 가운데 정렬", "12단 열 생성", "Reset CSS 비활성화"], explanation: "btn은 공통 버튼, btn-primary는 primary 변형 스타일을 제공합니다.", hint: "기본 클래스와 변형 클래스의 조합입니다." },
    { prompt: "다음 클래스 조합의 결과", code: "<p class=\"text-center text-primary\">안내</p>", correct: "텍스트를 가운데 정렬하고 primary 색상 적용", distractors: ["배경을 초록색으로 변경", "버튼으로 변환", "요소를 숨김"], explanation: "두 유틸리티가 정렬과 텍스트 색상을 각각 담당합니다.", hint: "각 클래스 이름을 나누어 해석하세요." },
    { prompt: "`bg-success`와 `text-primary`의 차이", correct: "앞은 배경색, 뒤는 글자색을 지정", distractors: ["두 클래스 모두 글자색만 지정", "두 클래스 모두 버튼 크기 지정", "앞은 Grid, 뒤는 Reset CSS"], explanation: "bg- 계열은 background, text- 계열은 text color 유틸리티입니다.", hint: "접두사 bg와 text를 비교하세요." },
    { prompt: "Bootstrap CDN 링크가 끊겼을 때 예상되는 직접 영향", correct: "Bootstrap 스타일과 컴포넌트 표현이 적용되지 않을 수 있다", distractors: ["HTML 파일이 데이터베이스로 변환된다", "브라우저가 운영체제를 종료한다", "모든 텍스트가 자동 번역된다"], explanation: "외부 CSS 파일을 받지 못하면 해당 클래스의 스타일 정의가 없어집니다.", hint: "클래스 이름만 있고 CSS 정의가 없는 상황입니다." },
    { prompt: "Reboot가 제공하는 출발점", correct: "브라우저 간 기본 요소 스타일이 비교적 일관된 상태", distractors: ["모든 요소가 완성된 컴포넌트인 상태", "CSS 파일이 없는 상태", "서버 데이터가 초기화된 상태"], explanation: "Reboot는 기본 스타일 차이를 조정하지만 모든 디자인을 완성해 주지는 않습니다.", hint: "Reset CSS의 목적입니다." },
  ]),
  topic("semantic", [
    { prompt: "OOCSS에서 `.button`과 `.button-blue`를 분리한 의도", code: ".button { padding: 8px 16px; }\n.button-blue { background: blue; }", correct: "구조와 스킨을 분리해 조합·재사용", distractors: ["ID 선택자 수를 늘리기 위해", "HTML 요소를 숨기기 위해", "Grid 칸 수를 바꾸기 위해"], explanation: "공통 구조와 색상 스킨을 분리하면 여러 변형을 조합할 수 있습니다.", hint: "교안의 구조와 스킨 분리입니다." },
    { prompt: "시멘틱 요소와 div의 가장 큰 차이", correct: "시멘틱 요소는 태그 이름으로 콘텐츠 역할을 전달", distractors: ["div에는 CSS를 적용할 수 없다", "시멘틱 요소는 항상 파란색이다", "div는 HTML 요소가 아니다"], explanation: "둘 다 구획을 만들 수 있지만 header, nav 등은 의미를 함께 전달합니다.", hint: "모양이 아니라 의미입니다." },
    { prompt: "`<section>`을 사용할 적절한 상황", correct: "문서 안에서 주제별로 관련 콘텐츠를 구획할 때", distractors: ["강제 줄바꿈 한 번이 필요할 때", "글자 하나만 굵게 할 때", "외부 CSS 파일을 연결할 때"], explanation: "section은 제목을 가질 수 있는 주제별 문서 구획에 적합합니다.", hint: "관련 콘텐츠의 한 구역입니다." },
    { prompt: "`<article>`을 사용할 적절한 상황", correct: "독립적으로 읽고 배포할 수 있는 게시글이나 카드", distractors: ["브라우저 탭 제목", "CSS 선언 한 줄", "단순 줄바꿈"], explanation: "article은 문맥에서 떼어도 자체 의미가 성립하는 콘텐츠입니다.", hint: "독립적인 글 한 편입니다." },
    { prompt: "시멘틱 구조가 개발자 협업에 주는 효과", correct: "코드를 읽을 때 각 영역의 역할을 빠르게 이해할 수 있다", distractors: ["모든 오류를 자동 수정한다", "CSS 명시도를 모두 같게 한다", "네트워크 연결을 제거한다"], explanation: "의미 있는 태그 이름은 별도 설명 없이도 문서의 윤곽을 드러냅니다.", hint: "가독성과 구조 이해입니다." },
  ]),
  topic("bootstrap", [
    { prompt: "다음 빈칸에 들어갈 버튼 색상 변형 클래스", code: "<button class=\"btn ____\">저장</button>", correct: "btn-primary", distractors: ["text-primary", "bg-primary", "primary"], explanation: "btn-primary는 기본 btn과 함께 사용하는 버튼 변형 클래스입니다.", hint: "btn- 접두사입니다." },
    { prompt: "다음 빈칸에 들어갈 가운데 정렬 유틸리티", code: "<h2 class=\"____\">제목</h2>", correct: "text-center", distractors: ["align-center", "center", "justify-center"], explanation: "Bootstrap의 텍스트 가운데 정렬 클래스는 text-center입니다.", hint: "교안 확인 문제에 나온 클래스입니다." },
    { prompt: "다음 빈칸에 들어갈 성공 배경 유틸리티", code: "<div class=\"____\">완료</div>", correct: "bg-success", distractors: ["text-success", "btn-success", "success"], explanation: "bg-success는 성공 의미의 배경색을 지정합니다.", hint: "background 축약 접두사를 사용합니다." },
    { prompt: "구조와 스킨을 분리하는 CSS 방법론의 약어", correct: "OOCSS", distractors: ["CDN", "HTML", "WWW"], explanation: "Object-Oriented CSS의 약어는 OOCSS입니다.", hint: "Object-Oriented CSS의 첫 글자입니다." },
    { prompt: "Bootstrap의 Reset CSS 파일명", correct: "bootstrap-reboot.css", distractors: ["bootstrap-reset.js", "reboot.html", "bootstrap-grid.sql"], explanation: "Bootstrap Reboot 스타일은 bootstrap-reboot.css에서 확인할 수 있습니다.", hint: "bootstrap과 reboot를 하이픈으로 연결합니다." },
  ]),
  topic("semantic", [
    { prompt: "시멘틱 HTML과 OOCSS를 함께 적용하는 목적", correct: "HTML은 의미 구조를, CSS는 재사용 가능한 표현 구조를 명확히 하기 위해", acceptedAnswers: ["의미 구조와 재사용 가능한 스타일"], distractors: ["HTML과 CSS의 역할을 뒤바꾸기 위해", "모든 class를 제거하기 위해", "서버 코드를 자동 생성하기 위해"], explanation: "시멘틱 마크업은 콘텐츠 의미를, OOCSS는 스타일 객체의 재사용과 유지보수를 개선합니다.", hint: "HTML 의미와 CSS 재사용을 연결하세요." },
    { prompt: "Reset CSS와 Bootstrap Component의 역할 차이", correct: "Reset은 기본 스타일을 정리하고 Component는 완성된 UI 요소를 제공한다", acceptedAnswers: ["Reset은 초기화, Component는 UI 제공"], distractors: ["둘 다 데이터베이스를 만든다", "Reset이 버튼을 만들고 Component가 모두 제거한다", "두 기능은 완전히 같다"], explanation: "Reboot는 출발점을 통일하고 컴포넌트는 그 위에 사용할 디자인 요소를 제공합니다.", hint: "초기화와 완성 요소를 구분하세요." },
    { prompt: "시멘틱 태그를 모양만 보고 선택하면 안 되는 이유", correct: "태그는 시각적 모양보다 콘텐츠의 역할과 의미를 표현해야 하기 때문", acceptedAnswers: ["콘텐츠 역할과 의미"], distractors: ["시멘틱 태그에는 CSS가 적용되지 않기 때문", "모든 태그가 block이기 때문", "브라우저가 태그를 숨기기 때문"], explanation: "모양은 CSS로 바뀔 수 있지만 마크업의 의미는 문서 구조를 설명합니다.", hint: "표현과 의미를 분리하세요." },
    { prompt: "OOCSS에서 컨테이너와 콘텐츠를 분리하는 이유", correct: "콘텐츠가 특정 부모 구조에 종속되지 않고 여러 위치에서 재사용되게 하기 위해", acceptedAnswers: ["부모 구조와의 결합 감소"], distractors: ["모든 요소를 한 컨테이너에 넣기 위해", "HTML 태그를 삭제하기 위해", "breakpoint를 하나로 줄이기 위해"], explanation: "낮은 결합도의 스타일 객체는 다양한 문맥에서 같은 클래스를 재사용할 수 있습니다.", hint: "종속성과 재사용을 생각하세요." },
    { prompt: "CDN 사용 시에도 로컬 대안을 고려할 수 있는 이유", correct: "외부 네트워크 장애가 있으면 스타일 파일을 받지 못할 수 있기 때문", acceptedAnswers: ["외부 네트워크 장애 대비"], distractors: ["CDN은 CSS를 지원하지 않기 때문", "HTML이 CDN을 금지하기 때문", "Bootstrap이 로컬에서만 실행되기 때문"], explanation: "CDN은 편리하지만 외부 연결 상태에 의존하므로 서비스 요구에 따라 fallback을 고려합니다.", hint: "외부 자원 의존성을 생각하세요." },
  ]),
  topic("responsive-grid", [
    { prompt: "`col-12 col-md-6`의 500px 화면 너비", code: "<div class=\"col-12 col-md-6\">A</div>", correct: "12칸(100%)", distractors: ["6칸(50%)", "4칸(33.3%)", "3칸(25%)"], explanation: "500px은 md 768px 미만이므로 기본 col-12가 적용됩니다.", hint: "md 기준보다 작은 화면입니다." },
    { prompt: "`col-12 col-md-6`의 900px 화면 너비", code: "<div class=\"col-12 col-md-6\">A</div>", correct: "6칸(50%)", distractors: ["12칸(100%)", "4칸(33.3%)", "3칸(25%)"], explanation: "900px은 md 이상이므로 col-md-6이 적용됩니다.", hint: "768px 이상입니다." },
    { prompt: "`col-12 col-lg-3`의 1000px 화면 너비", code: "<div class=\"col-12 col-lg-3\">A</div>", correct: "3칸(25%)", distractors: ["12칸(100%)", "6칸(50%)", "4칸(33.3%)"], explanation: "1000px은 lg 992px 이상이므로 col-lg-3이 적용됩니다.", hint: "lg 기준을 넘었습니다." },
    { prompt: "한 row에 col-4 요소가 배치될 수 있는 개수", code: "<div class=\"row\"><div class=\"col-4\">...</div></div>", correct: "3개", acceptedAnswers: ["3"], distractors: ["2개", "4개", "6개"], explanation: "12칸을 요소당 4칸씩 사용하므로 3개가 들어갑니다.", hint: "12 ÷ 4입니다." },
    { prompt: "한 row에 col-3 요소가 배치될 수 있는 개수", code: "<div class=\"row\"><div class=\"col-3\">...</div></div>", correct: "4개", acceptedAnswers: ["4"], distractors: ["3개", "6개", "12개"], explanation: "12칸을 요소당 3칸씩 사용하므로 4개가 들어갑니다.", hint: "12 ÷ 3입니다." },
  ]),
  topic("responsive-grid", [
    { prompt: "col-6이 12단 Grid에서 차지하는 비율", correct: "50%", distractors: ["25%", "33.3%", "100%"], explanation: "6/12는 1/2이므로 50%입니다.", hint: "6을 12로 나누세요." },
    { prompt: "col-4가 12단 Grid에서 차지하는 비율", correct: "33.3%", acceptedAnswers: ["약 33.3%", "1/3"], distractors: ["25%", "50%", "66.7%"], explanation: "4/12는 1/3로 약 33.3%입니다.", hint: "4를 12로 나누세요." },
    { prompt: "col-3이 12단 Grid에서 차지하는 비율", correct: "25%", distractors: ["33.3%", "50%", "75%"], explanation: "3/12는 1/4이므로 25%입니다.", hint: "3을 12로 나누세요." },
    { prompt: "lg breakpoint가 시작되는 교안 기준 너비", correct: "992px", distractors: ["576px", "768px", "1200px"], explanation: "교안 기준 Bootstrap lg는 992px 이상입니다.", hint: "md와 xl 사이입니다." },
    { prompt: "sm breakpoint가 시작되는 교안 기준 너비", correct: "576px", distractors: ["480px", "768px", "992px"], explanation: "교안 기준 Bootstrap sm은 576px 이상입니다.", hint: "가장 작은 기준입니다." },
  ]),
  topic("responsive-grid", [
    { prompt: "한 row를 3등분하는 md 클래스명", correct: "col-md-4", distractors: ["col-md-3", "col-md-6", "col-md-12"], explanation: "12칸을 3으로 나눈 4칸을 각 열에 지정합니다.", hint: "12 ÷ 3입니다." },
    { prompt: "한 row를 4등분하는 lg 클래스명", correct: "col-lg-3", distractors: ["col-lg-4", "col-lg-6", "col-lg-12"], explanation: "12칸을 4로 나눈 3칸을 각 열에 지정합니다.", hint: "12 ÷ 4입니다." },
    { prompt: "md 이상에서 50% 너비를 지정하는 클래스명", correct: "col-md-6", distractors: ["col-md-4", "col-sm-6", "col-lg-6"], explanation: "6/12는 50%이며 md 접두사가 768px 이상 조건을 나타냅니다.", hint: "breakpoint와 6칸을 결합하세요." },
    { prompt: "xl 이상에서 25% 너비를 지정하는 클래스명", correct: "col-xl-3", distractors: ["col-lg-3", "col-xl-4", "col-xl-6"], explanation: "3/12는 25%이며 xl 접두사가 1200px 이상을 뜻합니다.", hint: "xl과 3칸을 결합하세요." },
    { prompt: "모바일에서 100%, md 이상에서 50%가 되는 클래스 조합", correct: "col-12 col-md-6", distractors: ["col-6 col-md-12", "col-12 col-md-4", "col-md-12 col-6"], explanation: "기본 col-12를 먼저 적용하고 md부터 col-md-6으로 덮습니다.", hint: "작은 화면 규칙을 먼저 씁니다." },
  ]),
  topic("responsive-grid", [
    { prompt: "`col-12 col-md-6`의 화면별 동작 원리", correct: "md 미만은 12칸, md 이상은 6칸을 차지한다", acceptedAnswers: ["768px 미만 100%, 이상 50%"], distractors: ["항상 6칸", "항상 12칸", "md 미만 6칸, 이상 12칸"], explanation: "breakpoint 없는 기본 규칙이 먼저 적용되고 md 이상에서 더 구체적인 규칙이 적용됩니다.", hint: "모바일 우선 순서입니다." },
    { prompt: "Grid에서 열 합이 12를 기준으로 설계되는 이유", correct: "한 행의 전체 너비를 12개 단위로 나누기 때문", acceptedAnswers: ["한 행은 12칸"], distractors: ["HTML 요소가 12개로 제한되기 때문", "breakpoint가 12개이기 때문", "화면 너비가 항상 12px이기 때문"], explanation: "각 col 숫자는 한 row 전체 12칸 중 차지할 칸 수를 의미합니다.", hint: "12단 시스템의 기준입니다." },
    { prompt: "gutters가 사용자 경험에 미치는 영향", correct: "열 사이의 시각적 간격을 만들어 콘텐츠 구분과 가독성을 높인다", acceptedAnswers: ["콘텐츠 구분과 가독성"], distractors: ["모든 열을 겹치게 한다", "HTML 의미를 제거한다", "텍스트를 암호화한다"], explanation: "적절한 간격은 정보 덩어리를 구분하고 화면을 읽기 쉽게 만듭니다.", hint: "열 사이 여백의 역할입니다." },
    { prompt: "반응형 레이아웃을 UX 관점에서 평가할 기준", correct: "화면 크기가 달라도 콘텐츠를 쉽게 이해하고 조작할 수 있는지", acceptedAnswers: ["다양한 화면에서 사용 용이성"], distractors: ["애니메이션 수가 많은지", "CSS 파일이 한 줄인지", "서버 이름이 짧은지"], explanation: "반응형의 목적은 기술적 배치 변화 자체가 아니라 사용자 경험의 일관성입니다.", hint: "사용자가 쉽게 쓰는지를 보세요." },
    { prompt: "UI 요소와 Grid System을 함께 설계해야 하는 이유", correct: "버튼과 카드의 배치가 화면 크기별로 일관되고 조작하기 쉬워야 하기 때문", acceptedAnswers: ["일관된 배치와 사용성"], distractors: ["Grid가 버튼의 의미를 자동 변경하기 때문", "UI가 HTML을 제거하기 때문", "breakpoint가 서버를 실행하기 때문"], explanation: "Grid는 UI 요소가 각 화면에서 적절한 크기와 순서를 유지하도록 돕습니다.", hint: "레이아웃과 인터페이스를 연결하세요." },
  ]),
  topic("ux-ui", [
    { prompt: "사용자가 회원가입 버튼을 쉽게 찾지 못하는 문제의 핵심 평가 항목", correct: "UI의 발견 가능성과 UX의 과업 성공률", acceptedAnswers: ["발견 가능성과 과업 성공률"], distractors: ["서버의 파일명", "HTML 주석 수", "CDN 국가 수"], explanation: "핵심 행동이 눈에 띄고 사용자가 실제 과업을 완료할 수 있어야 좋은 인터페이스와 경험입니다.", hint: "버튼을 찾고 과업을 끝내는 과정을 보세요." },
    { prompt: "같은 기능의 버튼 색상과 위치를 화면마다 일관되게 유지하는 이유", correct: "사용자의 학습 비용을 줄이고 다음 행동을 예측하게 하기 위해", acceptedAnswers: ["학습 비용 감소와 예측 가능성"], distractors: ["CSS 명시도를 0으로 만들기 위해", "Grid를 제거하기 위해", "HTML을 압축하기 위해"], explanation: "일관된 UI 패턴은 사용자가 새로운 화면에서도 익숙한 방식으로 행동하게 합니다.", hint: "반복되는 패턴의 장점입니다." },
    { prompt: "모바일 화면에서 보조 정보를 접고 핵심 내용을 먼저 보여 주는 설계 근거", correct: "제한된 공간에서 정보 우선순위와 가독성을 확보하기 위해", acceptedAnswers: ["정보 우선순위와 가독성"], distractors: ["시멘틱 태그를 제거하기 위해", "브라우저 기본 스타일을 늘리기 위해", "모든 열을 12개로 보이게 하기 위해"], explanation: "좁은 화면에서는 사용자의 주요 과업과 핵심 콘텐츠가 먼저 보여야 합니다.", hint: "제한된 화면 공간을 생각하세요." },
    { prompt: "UX 개선 여부를 화면의 미관만으로 판단할 수 없는 이유", correct: "사용자가 과업을 얼마나 쉽게 이해하고 완료하는지도 함께 측정해야 하기 때문", acceptedAnswers: ["과업 이해와 완료"], distractors: ["미관은 CSS와 무관하기 때문", "UX는 서버 속도만 뜻하기 때문", "사용자는 화면을 보지 않기 때문"], explanation: "예쁜 화면이라도 찾기 어렵거나 조작에 실패하면 전체 사용자 경험은 좋지 않습니다.", hint: "사용 과정과 결과를 보세요." },
    { prompt: "반응형 UI 검수에서 키보드와 터치 조작을 함께 고려하는 이유", correct: "입력 방식이 달라도 핵심 기능에 접근하고 조작할 수 있어야 하기 때문", acceptedAnswers: ["입력 방식별 접근성과 조작성"], distractors: ["breakpoint 수를 늘리기 위해", "HTML title을 바꾸기 위해", "CDN을 로컬로 바꾸기 위해"], explanation: "다양한 기기와 사용 환경을 고려하면 인터페이스 접근성과 전체 UX가 향상됩니다.", hint: "사용 환경의 다양성입니다." },
  ]),
];

const hardBuilders: QuestionBuilder[] = [
  topic("css", [
    { prompt: "가장 높은 명시도의 선택자", code: "A: #app .nav a\nB: #app #nav a\nC: .app .nav .item a\nD: nav a", correct: "B: #app #nav a", distractors: ["A: #app .nav a", "C: .app .nav .item a", "D: nav a"], explanation: "B는 ID 2개와 요소 1개로 다른 선택자보다 높은 명시도를 가집니다.", hint: "ID 선택자 개수를 먼저 비교하세요." },
    { prompt: "다음 HTML의 최종 글자색", code: "<p id=\"msg\" class=\"notice\">안내</p>\n.notice { color: blue; }\n#msg { color: red; }\np.notice { color: green; }", correct: "red", distractors: ["blue", "green", "black"], explanation: "#msg의 ID 선택자가 클래스 조합보다 명시도가 높습니다.", hint: "ID 1개는 요소+클래스보다 강합니다." },
    { prompt: "다음 HTML의 최종 글자색", code: "<p class=\"card notice\">안내</p>\n.card.notice { color: purple; }\n.card p { color: orange; }\n.notice { color: blue; }", correct: "purple", distractors: ["orange", "blue", "black"], explanation: "현재 p 자체가 card와 notice 두 클래스를 모두 가져 .card.notice가 일치하며 클래스 2개로 가장 높습니다.", hint: "공백 없는 두 클래스 선택자를 확인하세요." },
    { prompt: "다음 선택자의 교안식 명시도 점수", code: "#layout .card .title strong", correct: "121", distractors: ["112", "211", "31"], explanation: "ID 1개 100점, 클래스 2개 20점, 요소 1개 1점으로 121점입니다.", hint: "100 + 20 + 1입니다." },
    { prompt: "다음 두 선택자 중 우선되는 규칙", code: "#app .title { color: red; }\n#app p.title { color: blue; }", correct: "#app p.title의 blue", distractors: ["#app .title의 red", "동일해 마지막 규칙", "두 규칙 모두 무효"], explanation: "두 선택자 모두 ID와 클래스가 하나지만 두 번째는 요소 선택자 p가 추가되어 명시도가 1 높습니다.", hint: "요소 선택자 1점 차이를 확인하세요." },
  ]),
  topic("css", [
    { prompt: "다음 코드의 최종 color", code: "p { color: blue !important; }\n#msg { color: red; }", correct: "blue", distractors: ["red", "black", "transparent"], explanation: "교안 기준 !important가 일반 ID 선택자의 선언보다 우선합니다.", hint: "강제 우선 키워드가 있습니다." },
    { prompt: "다음 코드의 최종 color", code: "<p id=\"msg\" style=\"color: orange\">안내</p>\n#msg { color: red !important; }", correct: "red", distractors: ["orange", "black", "두 값 혼합"], explanation: "일반 인라인 스타일보다 !important가 붙은 선언이 우선합니다.", hint: "important 여부를 먼저 보세요." },
    { prompt: "다음 코드의 최종 color", code: ".a.b { color: navy; }\n.a .b { color: teal; }\n<div class=\"a b\">Text</div>", correct: "navy", distractors: ["teal", "black", "둘 다 적용 안 됨"], explanation: "요소 하나가 a와 b를 동시에 가지므로 .a.b는 일치하지만, .a .b는 b가 a의 자손이어야 해서 일치하지 않습니다.", hint: "공백 유무가 자손 관계를 만듭니다." },
    { prompt: "동일한 요소에 같은 명시도의 규칙이 세 번 선언됐을 때 최종 color", code: ".note { color: red; }\n.note { color: green; }\n.note { color: blue; }", correct: "blue", distractors: ["red", "green", "black"], explanation: "명시도가 모두 같으므로 가장 나중 선언 blue가 적용됩니다.", hint: "마지막 규칙입니다." },
    { prompt: "외부 스타일시트 뒤에 내부 style이 같은 선택자로 선언될 때 최종 규칙", code: "<!-- external.css: .note { color: red; } -->\n<link rel=\"stylesheet\" href=\"external.css\">\n<style>.note { color: blue; }</style>", correct: "내부 style의 blue", distractors: ["외부 CSS의 red", "브라우저 기본값", "두 값 모두 무효"], explanation: "같은 명시도에서 내부 style 블록이 외부 CSS 링크 뒤에 선언되어 소스 순서상 우선합니다.", hint: "링크와 style의 문서 순서를 확인하세요." },
  ]),
  topic("css", [
    { prompt: "`#app .card p`의 교안식 명시도 점수", correct: "111", distractors: ["121", "101", "12"], explanation: "ID 1개, 클래스 1개, 요소 1개로 111점입니다.", hint: "100 + 10 + 1입니다." },
    { prompt: "`.layout .card .title`의 교안식 명시도 점수", correct: "30", distractors: ["300", "33", "3"], explanation: "클래스 3개가 각각 10점이므로 30점입니다.", hint: "요소 선택자는 없습니다." },
    { prompt: "`#app #main .card`의 교안식 명시도 점수", correct: "210", distractors: ["201", "120", "30"], explanation: "ID 2개 200점과 클래스 1개 10점으로 210점입니다.", hint: "100 + 100 + 10입니다." },
    { prompt: "`.card p strong`의 교안식 명시도 점수", correct: "12", distractors: ["21", "102", "3"], explanation: "클래스 1개 10점과 요소 2개 2점으로 12점입니다.", hint: "10 + 1 + 1입니다." },
    { prompt: "`header nav a`의 교안식 명시도 점수", correct: "3", distractors: ["30", "111", "0"], explanation: "요소 선택자 3개가 각각 1점이므로 3점입니다.", hint: "모두 요소 선택자입니다." },
  ]),
  topic("css", [
    { prompt: "복합 선택자의 명시도를 계산하는 원리", correct: "ID, 클래스, 요소 선택자 수를 각 가중치로 계산해 비교한다", acceptedAnswers: ["ID 100, 클래스 10, 요소 1"], distractors: ["선택자 문자열 길이만 비교한다", "항상 마지막 규칙만 본다", "HTML 작성자 이름을 비교한다"], explanation: "교안식 계산에서는 ID 100, 클래스 10, 요소 1의 가중치를 합산합니다.", hint: "선택자 종류별 가중치입니다." },
    { prompt: "`!important`와 높은 명시도를 함께 남용했을 때의 문제", correct: "캐스케이드가 예측하기 어려워지고 재정의와 디버깅 비용이 커진다", acceptedAnswers: ["재정의와 디버깅이 어려움"], distractors: ["CSS가 자동으로 압축된다", "HTML 의미가 더 명확해진다", "Grid가 항상 12칸이 된다"], explanation: "강한 규칙이 누적되면 더 강한 규칙으로 덮는 악순환이 생겨 유지보수가 어려워집니다.", hint: "명시도 경쟁을 생각하세요." },
    { prompt: "`.a.b`와 `.a .b`의 의미 차이", correct: "앞은 한 요소가 두 class를 모두 가지며, 뒤는 a 요소 안의 b 자손을 선택한다", acceptedAnswers: ["동일 요소와 자손 요소의 차이"], distractors: ["두 선택자는 항상 같다", "앞은 ID, 뒤는 요소 선택자다", "뒤는 모든 요소를 선택한다"], explanation: "공백은 자손 결합자를 만들고 공백 없는 클래스 연속은 같은 요소의 조건을 결합합니다.", hint: "공백이 DOM 관계를 뜻합니다." },
    { prompt: "명시도가 같은 규칙의 선언 순서가 중요한 이유", correct: "캐스케이드가 뒤에 나온 선언을 최종 규칙으로 선택하기 때문", acceptedAnswers: ["나중 선언 우선"], distractors: ["CSS가 앞 규칙을 삭제하기 때문", "HTML 태그가 순서를 바꾸기 때문", "브라우저가 무작위로 고르기 때문"], explanation: "동일한 중요도와 명시도에서는 문서의 소스 순서가 충돌을 해결합니다.", hint: "동점일 때의 규칙입니다." },
    { prompt: "유지보수 가능한 선택자 전략", correct: "재사용 가능한 class 중심으로 충분한 명시도만 사용하고 강제 덮어쓰기를 최소화한다", acceptedAnswers: ["class 중심, 과도한 명시도 방지"], distractors: ["모든 요소에 여러 ID를 중첩한다", "모든 선언에 !important를 쓴다", "전체 선택자만 사용한다"], explanation: "낮고 예측 가능한 명시도는 컴포넌트 재사용과 수정 범위 관리를 쉽게 합니다.", hint: "강함보다 예측 가능성이 중요합니다." },
  ]),
  topic("css", [
    { prompt: "content-box 박스의 총 너비", code: ".box { width: 240px; padding: 12px 18px; border: 3px solid; }", correct: "282px", distractors: ["240px", "270px", "288px"], explanation: "240 + 좌우 padding 36 + 좌우 border 6 = 282px입니다.", hint: "가로 padding은 18px씩입니다." },
    { prompt: "content-box 박스의 총 높이", code: ".box { height: 120px; padding: 8px 16px 12px; border: 2px solid; }", correct: "144px", distractors: ["120px", "140px", "156px"], explanation: "세 값 padding은 위 8, 좌우 16, 아래 12이므로 120 + 20 + border 4 = 144px입니다.", hint: "위와 아래 padding이 다릅니다." },
    { prompt: "border-box 박스의 콘텐츠 너비", code: ".box { width: 300px; padding: 10px 24px; border: 4px solid; box-sizing: border-box; }", correct: "244px", distractors: ["300px", "252px", "236px"], explanation: "300 - 좌우 padding 48 - 좌우 border 8 = 244px입니다.", hint: "외형 너비에서 내부 구성 값을 빼세요." },
    { prompt: "border-box 박스의 콘텐츠 높이", code: ".box { height: 180px; padding: 12px 20px 18px; border: 3px solid; box-sizing: border-box; }", correct: "144px", distractors: ["180px", "150px", "138px"], explanation: "180 - 위아래 padding 30 - 위아래 border 6 = 144px입니다.", hint: "세로 방향 값만 빼세요." },
    { prompt: "content-box 박스가 margin까지 포함해 가로로 차지하는 공간", code: ".box { width: 100px; padding: 10px; border: 2px solid; margin: 0 15px; }", correct: "154px", distractors: ["124px", "139px", "160px"], explanation: "외형 100 + 20 + 4 = 124px에 좌우 margin 30px을 더해 154px입니다.", hint: "박스 외형과 바깥 간격을 모두 더하세요." },
  ]),
  topic("css", [
    { prompt: "`padding: 10px 20px 30px 40px`의 가로 padding 합", correct: "60px", distractors: ["30px", "40px", "100px"], explanation: "오른쪽 20px과 왼쪽 40px을 더해 60px입니다.", hint: "두 번째와 네 번째 값입니다." },
    { prompt: "`margin: 5px 10px 15px`의 세로 margin 합", correct: "20px", distractors: ["10px", "25px", "30px"], explanation: "위 5px과 아래 15px을 더해 20px입니다.", hint: "첫 번째와 세 번째 값입니다." },
    { prompt: "border-box 360px 박스에 좌우 padding 30px, border 5px일 때 콘텐츠 너비", correct: "290px", distractors: ["360px", "300px", "280px"], explanation: "360 - 60 - 10 = 290px입니다.", hint: "양쪽 padding과 border를 빼세요." },
    { prompt: "content-box width 180px, padding 16px, border 1px의 외형 너비", correct: "214px", distractors: ["180px", "212px", "216px"], explanation: "180 + 32 + 2 = 214px입니다.", hint: "각 양쪽 값을 두 배로 더하세요." },
    { prompt: "border-box height 200px, 위아래 padding 합 50px, border 합 4px의 콘텐츠 높이", correct: "146px", distractors: ["200px", "150px", "154px"], explanation: "200 - 50 - 4 = 146px입니다.", hint: "전체 높이에서 내부 차지 공간을 빼세요." },
  ]),
  topic("css", [
    { prompt: "content-box와 border-box를 같은 width로 나란히 놓았을 때 padding 때문에 생길 수 있는 차이", code: ".a { width: 50%; padding: 20px; }\n.b { width: 50%; padding: 20px; box-sizing: border-box; }", correct: "content-box인 a는 50%에 padding이 더해져 행 너비를 넘을 수 있다", distractors: ["border-box인 b만 항상 넘친다", "두 박스는 무조건 같은 콘텐츠 너비다", "padding은 너비에 영향을 주지 않는다"], explanation: "content-box의 50%는 콘텐츠만 의미해 padding이 외형에 추가되지만 border-box는 50% 안에 포함합니다.", hint: "width가 포함하는 범위를 비교하세요." },
    { prompt: "block 요소에 `width: 50%`를 적용했을 때 기준", correct: "포함 블록의 콘텐츠 너비를 기준으로 절반", distractors: ["브라우저 전체 높이의 절반", "항상 50px", "텍스트 길이의 절반"], explanation: "백분율 width는 일반적으로 포함 블록의 사용 가능한 너비를 기준으로 계산됩니다.", hint: "부모 영역을 기준으로 생각하세요." },
    { prompt: "박스 외형 크기 계산에서 margin을 별도로 다루는 이유", correct: "margin은 border 바깥 간격이며 box-sizing의 width에 포함되지 않기 때문", distractors: ["margin은 글자색 속성이기 때문", "margin은 HTML 속성이기 때문", "border-box가 margin을 항상 제거하기 때문"], explanation: "box-sizing은 content, padding, border의 포함 관계를 정하지만 margin은 그 바깥에 남습니다.", hint: "border 밖의 영역입니다." },
    { prompt: "반응형 열에 전역 `box-sizing: border-box`를 적용하는 이유", correct: "padding과 border가 열 비율을 넘어 레이아웃을 깨뜨리는 위험을 줄이기 위해", acceptedAnswers: ["열 비율 초과 방지"], distractors: ["모든 열을 inline으로 만들기 위해", "breakpoint를 없애기 위해", "HTML 의미를 바꾸기 위해"], explanation: "선언된 열 너비 안에 내부 여백과 테두리를 포함하면 합계가 안정적으로 유지됩니다.", hint: "Grid 너비 계산과 연결하세요." },
    { prompt: "복합 박스 계산을 검증하는 순서", correct: "box-sizing을 확인하고 축별 padding·border·margin을 구분해 계산한다", acceptedAnswers: ["box-sizing 확인 후 축별 계산"], distractors: ["색상부터 계산한다", "모든 값을 한 번만 더한다", "HTML 태그 수를 센다"], explanation: "width의 기준을 먼저 정한 뒤 가로축에 실제로 영향을 주는 좌우 값만 적용해야 합니다.", hint: "기준 상자와 방향을 먼저 확인하세요." },
  ]),
  topic("bootstrap", [
    { prompt: "다음 UI에서 공통 구조와 색상 변형을 담당하는 클래스", code: "<button class=\"btn btn-primary\">저장</button>", correct: "btn은 구조, btn-primary는 색상 변형", distractors: ["둘 다 Grid 열", "btn-primary만 HTML 구조", "btn은 Reset CSS 파일"], explanation: "Bootstrap 컴포넌트는 기본 클래스와 변형 클래스를 조합합니다.", hint: "OOCSS의 구조와 스킨 관점입니다." },
    { prompt: "`text-center bg-success` 조합의 화면 결과", code: "<div class=\"text-center bg-success\">완료</div>", correct: "가운데 정렬된 텍스트와 성공 배경색", distractors: ["왼쪽 정렬과 실패 배경", "primary 버튼", "12단 열"], explanation: "text-center와 bg-success가 서로 다른 CSS 속성을 독립적으로 적용합니다.", hint: "각 유틸리티를 따로 해석하세요." },
    { prompt: "Bootstrap 클래스를 HTML에 썼지만 CSS를 로드하지 않은 결과", correct: "class 이름은 남지만 Bootstrap 시각 스타일은 적용되지 않는다", distractors: ["브라우저가 HTML을 실행하지 않는다", "클래스가 서버 코드를 만든다", "Reset CSS만 자동 적용된다"], explanation: "클래스는 CSS 규칙과 연결될 때만 시각적 효과를 냅니다.", hint: "정의 파일이 없는 class입니다." },
    { prompt: "Reboot와 유틸리티 클래스의 적용 순서 개념", correct: "Reboot가 기본 기준을 만들고 유틸리티가 필요한 스타일을 추가한다", distractors: ["유틸리티가 HTML을 삭제한 뒤 Reboot가 서버를 만든다", "둘은 서로 무관한 데이터베이스 기능이다", "Reboot가 모든 컴포넌트를 숨긴다"], explanation: "기본 스타일 조정 위에 text, bg, spacing 등의 유틸리티가 구체적 표현을 더합니다.", hint: "초기화 후 스타일 추가입니다." },
    { prompt: "CDN에서 받은 Bootstrap 파일이 캐시될 때의 장점", correct: "재방문 시 같은 정적 파일을 다시 받는 비용을 줄일 수 있다", distractors: ["HTML 의미가 자동 생성된다", "Grid가 24단으로 바뀐다", "사용자 입력이 서버에 저장된다"], explanation: "브라우저 캐시는 동일 자원의 반복 다운로드를 줄여 로딩을 개선할 수 있습니다.", hint: "정적 파일 재사용입니다." },
  ]),
  topic("semantic", [
    { prompt: "다음 구조에서 가장 적절한 시멘틱 요소 조합", code: "로고/제목 → 주요 링크 → 핵심 글 → 저작권", correct: "header → nav → main/article → footer", distractors: ["br → span → b → title", "footer → main → head → nav", "div → div → div → div만 가능"], explanation: "각 콘텐츠 역할을 태그 이름으로 드러내는 조합입니다.", hint: "상단, 탐색, 핵심, 하단 순서입니다." },
    { prompt: "다음 OOCSS 구조의 재사용 방식", code: ".card { padding: 16px; border-radius: 12px; }\n.card-primary { background: blue; }\n.card-success { background: green; }", correct: "공통 card 구조에 필요한 색상 스킨을 조합", distractors: ["각 카드마다 새 ID만 사용", "모든 스타일을 HTML style에 반복", "색상 클래스로 Grid 칸 수를 변경"], explanation: "구조 객체와 스킨을 분리하면 같은 card 형태에 여러 변형을 재사용할 수 있습니다.", hint: "공통 클래스 + 변형 클래스입니다." },
    { prompt: "`section` 안에 여러 `article`을 두는 의미", correct: "하나의 주제 구획 안에 독립적인 콘텐츠 여러 개를 구성", distractors: ["CSS 파일 여러 개를 연결", "브라우저 탭 여러 개를 생성", "Grid breakpoint를 제거"], explanation: "section은 주제별 구획, article은 독립적으로 성립하는 콘텐츠 단위입니다.", hint: "구획과 독립 글의 관계입니다." },
    { prompt: "시멘틱 요소를 사용해도 CSS가 필요한 이유", correct: "의미 구조와 시각적 표현은 서로 다른 역할이기 때문", distractors: ["시멘틱 태그에는 기본 의미가 없기 때문", "CSS가 HTML을 서버로 바꾸기 때문", "시멘틱 태그는 화면에 보이지 않기 때문"], explanation: "HTML은 의미를 전달하고 CSS는 원하는 색상과 레이아웃을 구현합니다.", hint: "구조와 스타일의 분리입니다." },
    { prompt: "OOCSS가 과도하게 세분화될 때 주의할 점", correct: "class 조합이 지나치게 많아져 의미 파악과 관리가 어려워질 수 있다", distractors: ["HTML 표준이 자동 삭제된다", "CDN을 사용할 수 없게 된다", "Grid가 항상 한 칸이 된다"], explanation: "재사용성도 중요하지만 명확한 이름과 적절한 객체 경계를 유지해야 합니다.", hint: "재사용과 복잡성의 균형입니다." },
  ]),
  topic("bootstrap", [
    { prompt: "다음 빈칸에 들어갈 클래스", code: "<button class=\"btn ____\">삭제</button>", correct: "btn-danger", distractors: ["bg-danger", "text-danger", "danger-btn"], explanation: "Bootstrap 버튼의 위험 상태 변형은 btn-danger입니다.", hint: "btn- 접두사를 사용합니다." },
    { prompt: "다음 빈칸에 들어갈 두 클래스 조합", code: "<p class=\"____ ____\">완료</p>", correct: "text-center text-primary", distractors: ["btn btn-primary", "row col-6", "bg-success container"], explanation: "가운데 정렬과 primary 글자색은 두 text 유틸리티를 조합합니다.", hint: "둘 다 text-로 시작합니다." },
    { prompt: "구조와 스킨 분리를 적용한 버튼 클래스 조합", correct: "btn btn-primary", distractors: ["text-center row", "container col", "header nav"], explanation: "btn은 구조, btn-primary는 색상 변형을 담당합니다.", hint: "기본 버튼과 primary 변형입니다." },
    { prompt: "Bootstrap CDN의 전체 영어 표현", correct: "Content Delivery Network", distractors: ["Cascading Design Number", "Component Data Node", "Content Display Name"], explanation: "CDN은 Content Delivery Network의 약자입니다.", hint: "콘텐츠 전달 네트워크입니다." },
    { prompt: "Object-Oriented CSS의 약어", correct: "OOCSS", distractors: ["OCSS", "OOPS", "OOHTML"], explanation: "객체지향적 CSS 방법론은 OOCSS로 줄여 씁니다.", hint: "OO + CSS입니다." },
  ]),
  topic("semantic", [
    { prompt: "시멘틱 구조와 Bootstrap 컴포넌트를 함께 사용할 때 지켜야 할 원칙", correct: "의미에 맞는 HTML 요소를 선택하고 Bootstrap class는 표현과 동작 보조로 사용한다", acceptedAnswers: ["HTML 의미와 Bootstrap 표현 분리"], distractors: ["모든 요소를 div로 바꾼다", "class 이름을 태그 이름 대신 사용한다", "시멘틱 태그에는 Bootstrap을 쓰지 않는다"], explanation: "프레임워크 class는 요소의 의미를 대체하지 않으므로 마크업 역할을 먼저 정해야 합니다.", hint: "태그 의미와 class 스타일을 구분하세요." },
    { prompt: "OOCSS 객체 경계를 설계할 때의 기준", correct: "여러 문맥에서 독립적으로 재사용 가능한 구조와 변형 단위인지 확인한다", acceptedAnswers: ["독립적 재사용 가능성"], distractors: ["선택자 길이가 가장 긴지 본다", "모든 스타일을 한 class에 넣는다", "ID가 두 개 이상인지 본다"], explanation: "재사용 가능한 시각 객체를 기준으로 공통 구조와 스킨을 나누는 것이 핵심입니다.", hint: "독립성과 재사용성입니다." },
    { prompt: "Reset CSS 이후에도 시멘틱 HTML이 필요한 이유", correct: "Reset은 모양만 조정하고 문서의 의미와 구조는 HTML이 전달하기 때문", acceptedAnswers: ["Reset은 표현, HTML은 의미"], distractors: ["Reset이 모든 태그 의미를 삭제하기 때문", "HTML 없이는 CSS 파일을 저장할 수 없기 때문", "Reboot가 Grid를 금지하기 때문"], explanation: "스타일 초기화는 접근성 트리와 문서 구조를 대신 정의하지 않습니다.", hint: "모양과 의미의 역할 차이입니다." },
    { prompt: "CDN 장애를 고려한 안정적인 스타일 제공 전략", correct: "필요하면 로컬 파일 fallback을 준비하고 로드 실패를 확인한다", acceptedAnswers: ["로컬 fallback"], distractors: ["HTML을 모두 삭제한다", "모든 스타일을 이미지로 바꾼다", "사용자에게 CSS를 직접 작성하게 한다"], explanation: "외부 자원에만 의존하지 않도록 서비스 중요도에 따라 대체 경로를 둘 수 있습니다.", hint: "외부 연결 실패에 대비하세요." },
    { prompt: "의미 없는 div 중첩이 많을 때 발생하는 문제", correct: "문서 영역의 역할을 파악하기 어렵고 구조 가독성이 낮아진다", acceptedAnswers: ["역할 파악과 가독성 저하"], distractors: ["CSS를 전혀 적용할 수 없게 된다", "브라우저가 HTML을 다운로드하지 않는다", "Grid 칸 수가 자동 감소한다"], explanation: "필요한 곳에 시멘틱 태그를 사용하면 구조를 이름으로 이해할 수 있습니다.", hint: "div 자체는 역할을 설명하지 않습니다." },
  ]),
  topic("responsive-grid", [
    { prompt: "한 row에 col-8 다음 col-6이 올 때의 배치", code: "<div class=\"row\"><div class=\"col-8\">A</div><div class=\"col-6\">B</div></div>", correct: "합이 12를 넘어 B가 다음 줄로 wrap", distractors: ["두 열이 14칸으로 한 줄에 유지", "브라우저 오류로 렌더링 중단", "두 열이 자동으로 7칸씩 축소"], explanation: "Bootstrap Grid에서 한 행의 열 합이 12를 초과하면 넘는 열이 다음 줄로 이동합니다.", hint: "8 + 6은 12보다 큽니다." },
    { prompt: "`col-12 col-md-6 col-lg-3`의 800px 너비", correct: "6칸(50%)", distractors: ["12칸(100%)", "3칸(25%)", "4칸(33.3%)"], explanation: "800px은 md 이상이지만 lg 992px 미만이므로 col-md-6이 적용됩니다.", hint: "현재 만족하는 가장 큰 breakpoint는 md입니다." },
    { prompt: "`col-12 col-md-6 col-lg-3`의 1100px 너비", correct: "3칸(25%)", distractors: ["12칸(100%)", "6칸(50%)", "4칸(33.3%)"], explanation: "1100px은 lg 이상이므로 col-lg-3이 적용됩니다.", hint: "992px 이상입니다." },
    { prompt: "`col-6 col-lg-4` 요소 4개의 1200px 화면 배치", correct: "한 줄에 3개, 네 번째는 다음 줄", distractors: ["한 줄에 2개", "한 줄에 4개", "모두 한 열로 배치"], explanation: "lg 이상에서는 각 요소가 4칸이므로 12/4 = 3개가 한 줄에 들어갑니다.", hint: "현재 적용되는 col-lg-4를 기준으로 계산하세요." },
    { prompt: "`col-12 col-md-4` 요소 6개의 600px 화면 배치", correct: "각 요소가 한 줄 전체를 차지해 6줄", distractors: ["한 줄에 3개씩 2줄", "한 줄에 2개씩 3줄", "한 줄에 6개"], explanation: "600px은 md 768px 미만이므로 기본 col-12가 적용됩니다.", hint: "md 규칙이 아직 적용되지 않습니다." },
  ]),
  topic("responsive-grid", [
    { prompt: "`col-sm-6 col-lg-3`의 700px 화면 너비", correct: "6칸(50%)", distractors: ["12칸(100%)", "3칸(25%)", "4칸(33.3%)"], explanation: "700px은 sm 576px 이상, lg 미만이므로 col-sm-6이 적용됩니다.", hint: "sm은 만족하지만 lg는 아닙니다." },
    { prompt: "`col-md-8 col-xl-4`의 1000px 화면 너비", correct: "8칸(66.7%)", distractors: ["4칸(33.3%)", "12칸(100%)", "6칸(50%)"], explanation: "1000px은 md 이상이지만 xl 1200px 미만이므로 col-md-8이 적용됩니다.", hint: "xl 기준에는 도달하지 않았습니다." },
    { prompt: "`col-12 col-sm-6 col-md-4 col-lg-3`의 800px 화면 너비", correct: "4칸(33.3%)", distractors: ["12칸(100%)", "6칸(50%)", "3칸(25%)"], explanation: "800px에서 만족하는 가장 큰 규칙은 md이므로 col-md-4입니다.", hint: "md는 768px, lg는 992px입니다." },
    { prompt: "`col-12 col-sm-6 col-md-4 col-lg-3`의 1300px 화면 너비", correct: "3칸(25%)", distractors: ["12칸(100%)", "6칸(50%)", "4칸(33.3%)"], explanation: "1300px은 lg 이상이므로 col-lg-3이 적용됩니다.", hint: "가장 큰 선언된 breakpoint를 적용하세요." },
    { prompt: "breakpoint 클래스가 최소 너비 기준으로 누적되는 방식", correct: "큰 화면에서도 작은 breakpoint 규칙은 유효하지만 더 큰 규칙이 있으면 덮어쓴다", distractors: ["각 breakpoint는 정확히 한 픽셀에서만 작동", "큰 화면에서는 모든 class가 제거", "작은 화면에서 xl 규칙이 먼저 작동"], explanation: "Bootstrap은 mobile-first min-width 미디어 쿼리로 동작합니다.", hint: "최소 너비 조건입니다." },
  ]),
  topic("responsive-grid", [
    { prompt: "lg 화면에서 col-lg-2 요소가 한 줄에 들어가는 개수", correct: "6", acceptedAnswers: ["6개"], distractors: ["2", "4", "12"], explanation: "12/2 = 6개입니다.", hint: "12를 2로 나누세요." },
    { prompt: "md 화면에서 col-md-8 다음에 같은 줄에 남는 칸 수", correct: "4", acceptedAnswers: ["4칸"], distractors: ["2", "6", "8"], explanation: "한 행 12칸 중 8칸을 사용해 4칸이 남습니다.", hint: "12 - 8입니다." },
    { prompt: "col-5와 col-7을 합친 한 행 점유 칸 수", correct: "12", acceptedAnswers: ["12칸"], distractors: ["10", "13", "35"], explanation: "5 + 7 = 12로 한 행 전체를 정확히 채웁니다.", hint: "두 숫자를 더하세요." },
    { prompt: "col-9가 차지하는 비율", correct: "75%", distractors: ["25%", "50%", "66.7%"], explanation: "9/12는 3/4이므로 75%입니다.", hint: "9를 12로 나누세요." },
    { prompt: "col-2가 차지하는 비율", correct: "16.7%", acceptedAnswers: ["약 16.7%", "1/6"], distractors: ["20%", "25%", "33.3%"], explanation: "2/12는 1/6로 약 16.7%입니다.", hint: "2를 12로 나누세요." },
  ]),
  topic("responsive-grid", [
    { prompt: "열 합이 12를 초과할 때 wrapping이 필요한 이유", correct: "한 row의 12칸 구조를 유지하며 남은 열을 다음 행에 배치하기 위해", acceptedAnswers: ["12칸 구조 유지"], distractors: ["HTML 태그를 삭제하기 위해", "CSS를 암호화하기 위해", "breakpoint를 없애기 위해"], explanation: "자동 줄바꿈은 열이 가로 공간을 넘치지 않도록 다음 줄에서 새 12칸 배치를 시작합니다.", hint: "행 단위의 12칸 제한입니다." },
    { prompt: "여러 breakpoint 클래스를 한 요소에 함께 쓰는 이유", correct: "화면 크기 구간마다 다른 열 너비를 선언해 점진적으로 레이아웃을 바꾸기 위해", acceptedAnswers: ["화면 구간별 너비 변경"], distractors: ["모든 화면에서 같은 너비를 강제하기 위해", "CSS 파일을 여러 번 다운로드하기 위해", "HTML 의미를 제거하기 위해"], explanation: "mobile-first 기본값에 sm, md, lg 등의 규칙을 추가해 각 화면에 맞게 재배치합니다.", hint: "크기별 설계입니다." },
    { prompt: "Grid breakpoint 설계와 UX의 연결", correct: "콘텐츠 중요도와 조작 편의가 화면 크기별로 유지되도록 열 수와 너비를 조정한다", acceptedAnswers: ["화면별 가독성과 조작 편의"], distractors: ["큰 화면에서만 콘텐츠를 제공한다", "모든 카드 크기를 1px로 만든다", "UI 요소를 무작위로 재배치한다"], explanation: "기술적 breakpoint는 사용자가 각 기기에서 정보를 읽고 조작하기 쉽게 만드는 수단입니다.", hint: "사용성 목표를 먼저 보세요." },
    { prompt: "고정 폭만 사용한 레이아웃이 반응형 UX에 불리한 이유", correct: "작은 화면에서는 넘치고 큰 화면에서는 공간을 비효율적으로 사용할 수 있기 때문", acceptedAnswers: ["작은 화면 overflow, 큰 화면 비효율"], distractors: ["HTML 태그가 자동 삭제되기 때문", "CSS 색상을 쓸 수 없기 때문", "CDN이 작동하지 않기 때문"], explanation: "다양한 viewport에 맞춰 비율과 배치를 조절해야 읽기와 조작이 안정적입니다.", hint: "화면 크기 차이를 생각하세요." },
    { prompt: "복합 Grid 문제를 푸는 순서", correct: "화면 너비로 활성 breakpoint를 정하고 적용된 col 값을 12단 기준으로 계산한다", acceptedAnswers: ["breakpoint 확인 후 12단 계산"], distractors: ["HTML 태그 수부터 센다", "항상 가장 마지막 class만 고른다", "모든 col 값을 더해 평균낸다"], explanation: "현재 viewport가 만족하는 규칙 중 가장 구체적인 값을 선택한 뒤 행 배치와 비율을 계산해야 합니다.", hint: "조건 선택과 칸 수 계산의 두 단계입니다." },
  ]),
  topic("ux-ui", [
    { prompt: "모바일에서 버튼이 너무 작아 누르기 어려운 문제의 중심 분야", correct: "UI와 UX 모두", distractors: ["데이터베이스만", "CDN만", "HTML title만"], explanation: "버튼의 크기와 배치는 UI 문제이며 조작하기 어려운 경험은 UX 문제입니다.", hint: "인터페이스가 경험에 영향을 줍니다." },
    { prompt: "화면 크기에 따라 카드가 4열에서 1열로 바뀌는 목적", correct: "작은 화면에서도 콘텐츠 가독성과 조작 편의를 유지", distractors: ["HTML 요소 수를 줄이기 위해", "CSS 파일을 삭제하기 위해", "서버 속도를 고정하기 위해"], explanation: "열 수 조정은 좁은 화면에서 카드가 지나치게 작아지는 것을 막습니다.", hint: "사용성 관점입니다." },
    { prompt: "검색 기능은 정확하지만 결과 버튼이 찾기 어려운 상황", correct: "기능 결과뿐 아니라 인터페이스 발견 가능성도 UX에 중요", distractors: ["정확하면 UI는 중요하지 않다", "버튼은 서버 기능이다", "Grid를 제거하면 자동 해결된다"], explanation: "사용자가 기능을 발견하고 쉽게 조작할 수 있어야 전체 경험이 좋습니다.", hint: "기능성과 사용성을 함께 봅니다." },
    { prompt: "반응형 디자인 검수에서 확인할 핵심 항목", correct: "각 breakpoint에서 정보 우선순위, 가독성, 조작 가능성", distractors: ["애니메이션 개수만", "CSS 파일 이름 길이만", "HTML 주석 개수만"], explanation: "레이아웃이 바뀌어도 핵심 콘텐츠와 인터랙션이 유지되는지 확인해야 합니다.", hint: "사용자가 실제로 읽고 누르는 흐름입니다." },
    { prompt: "UI 일관성이 UX를 개선하는 이유", correct: "같은 패턴을 예측해 더 빠르고 실수 없이 조작할 수 있기 때문", distractors: ["모든 화면을 같은 픽셀 크기로 만들기 때문", "서버 요청을 없애기 때문", "HTML 의미를 지우기 때문"], explanation: "일관된 버튼, 색상과 배치는 학습 비용을 낮추고 예측 가능성을 높입니다.", hint: "사용자의 학습과 예측입니다." },
  ]),
  topic("ux-ui", [
    { prompt: "사용자 경험을 뜻하는 약어", correct: "UX", distractors: ["UI", "CSS", "CDN"], explanation: "User Experience의 약어는 UX입니다.", hint: "Experience의 X를 사용합니다." },
    { prompt: "사용자 인터페이스를 뜻하는 약어", correct: "UI", distractors: ["UX", "HTML", "WWW"], explanation: "User Interface의 약어는 UI입니다.", hint: "Interface의 I를 사용합니다." },
    { prompt: "1200px 이상을 뜻하는 교안 기준 breakpoint", correct: "xl", distractors: ["sm", "md", "lg"], explanation: "교안 기준 xl은 1200px 이상에서 적용됩니다.", hint: "extra large의 약자입니다." },
    { prompt: "992px 이상을 뜻하는 교안 기준 breakpoint", correct: "lg", distractors: ["sm", "md", "xl"], explanation: "교안 기준 lg는 992px 이상입니다.", hint: "large의 약자입니다." },
    { prompt: "열 사이 간격을 뜻하는 Bootstrap Grid 용어", correct: "gutter", acceptedAnswers: ["gutters"], distractors: ["header", "router", "footer"], explanation: "gutter는 Grid column 사이의 간격입니다.", hint: "g로 시작하는 교안 용어입니다." },
  ]),
  topic("ux-ui", [
    { prompt: "UX와 UI를 분리해서만 평가하면 안 되는 이유", correct: "인터페이스의 시각·조작 설계가 사용 과정의 전체 경험에 직접 영향을 주기 때문", acceptedAnswers: ["UI가 UX에 직접 영향"], distractors: ["두 용어가 완전히 같은 뜻이기 때문", "UI는 서버이고 UX는 데이터베이스이기 때문", "CSS가 두 개념을 금지하기 때문"], explanation: "UI는 UX를 구성하는 중요한 접점이므로 두 관점을 연결해 평가해야 합니다.", hint: "인터페이스가 경험을 만듭니다." },
    { prompt: "반응형 Grid를 시각적 장식이 아니라 UX 도구로 봐야 하는 이유", correct: "화면별 정보 접근성과 조작 편의를 보장하는 것이 최종 목적이기 때문", acceptedAnswers: ["정보 접근성과 조작 편의"], distractors: ["Grid가 서버 데이터를 저장하기 때문", "열 수가 많을수록 무조건 좋기 때문", "HTML 요소를 자동 생성하기 때문"], explanation: "열 배치 변화는 사용자에게 적절한 콘텐츠 크기와 흐름을 제공하기 위한 수단입니다.", hint: "기술이 아니라 사용자 목적을 보세요." },
    { prompt: "작은 화면에서 중요한 행동 버튼을 우선 배치하는 근거", correct: "제한된 공간에서 핵심 과업의 발견성과 접근성을 높이기 위해", acceptedAnswers: ["핵심 과업의 발견성과 접근성"], distractors: ["CSS 명시도를 높이기 위해", "HTML 태그 수를 줄이기 위해", "CDN 캐시를 지우기 위해"], explanation: "모바일 UX는 공간 제약 속에서 사용자가 먼저 해야 할 일을 쉽게 찾도록 우선순위를 정합니다.", hint: "정보 우선순위입니다." },
    { prompt: "breakpoint를 기기 이름이 아니라 콘텐츠 기준으로 설계해야 하는 이유", correct: "레이아웃이 실제로 깨지거나 사용성이 떨어지는 지점은 콘텐츠 구성에 따라 다르기 때문", acceptedAnswers: ["콘텐츠가 깨지는 지점 기준"], distractors: ["기기에는 화면 크기가 없기 때문", "Bootstrap이 기기 이름을 금지하기 때문", "CSS가 픽셀을 지원하지 않기 때문"], explanation: "교안의 표준 breakpoint를 활용하되 실제 콘텐츠가 읽기 어려워지는 구간을 검수해야 합니다.", hint: "콘텐츠와 사용성을 관찰하세요." },
    { prompt: "웹 강의실 화면의 품질을 종합 평가하는 기준", correct: "의미 있는 HTML, 예측 가능한 CSS, 반응형 Grid와 쉬운 인터페이스가 함께 작동하는지", acceptedAnswers: ["HTML 의미, CSS, 반응형, 사용성"], distractors: ["색상 수가 가장 많은지", "모든 요소가 div인지", "한 breakpoint만 사용하는지"], explanation: "좋은 웹 화면은 구조, 표현, 적응형 배치와 사용자 경험을 함께 만족해야 합니다.", hint: "세 PDF 범위를 하나로 연결하세요." },
  ]),
  topic("html", [
    { prompt: "다음 구조에서 문서 정보와 화면 콘텐츠의 경계를 올바르게 나눈 마크업", correct: "<head><title>Web</title></head><body><main>Quiz</main></body>", distractors: ["<body><title>Web</title></body><head>Quiz</head>", "<head><main>Quiz</main></head>", "<title><body>Quiz</body></title>"], explanation: "title 같은 문서 정보는 head에, 화면 핵심 콘텐츠는 body 안의 main에 둡니다.", hint: "head와 body의 역할을 구분하세요." },
    { prompt: "시멘틱 구조가 가장 명확한 페이지 윤곽", correct: "header + nav + main + footer", distractors: ["br + b + span + title", "head + style + script + link", "div 하나만 반복"], explanation: "상단 소개, 주요 탐색, 핵심 콘텐츠와 하단 정보의 역할을 태그 이름으로 드러냅니다.", hint: "페이지의 위에서 아래 순서를 생각하세요." },
    { prompt: "`<section>`과 `<article>`의 관계를 올바르게 설명한 것", correct: "section은 주제 구획이고 article은 독립적으로 성립하는 콘텐츠다", distractors: ["두 요소는 줄바꿈 전용이다", "article이 head 안에서만 사용된다", "section은 CSS 파일을 연결한다"], explanation: "section은 관련 주제를 묶고 article은 게시글처럼 독립적인 콘텐츠 단위를 나타냅니다.", hint: "구획과 독립 글을 구분하세요." },
    { prompt: "HTML class와 id를 선택할 때의 원칙", correct: "반복 가능한 스타일 대상은 class, 문서에서 고유한 식별은 id를 사용한다", acceptedAnswers: ["재사용은 class, 고유 식별은 id"], distractors: ["모든 요소에 같은 id를 쓴다", "class는 한 번만 쓸 수 있다", "id는 CSS에서 선택할 수 없다"], explanation: "class는 여러 요소가 공유할 수 있고 id는 문서 내 고유 식별을 위한 값입니다.", hint: "재사용성과 고유성을 비교하세요." },
    { prompt: "잘못된 태그 중첩이 CSS와 접근성 해석에 문제를 줄 수 있는 이유", correct: "브라우저가 구조를 임의 보정하면서 의도한 부모-자식 관계와 의미 범위가 달라질 수 있기 때문", acceptedAnswers: ["구조 보정으로 관계와 의미가 달라짐"], distractors: ["CSS 파일이 자동 삭제되기 때문", "모든 요소가 inline이 되기 때문", "CDN 주소가 변경되기 때문"], explanation: "유효한 마크업은 DOM 구조를 예측 가능하게 유지해 스타일과 의미 해석을 안정시킵니다.", hint: "브라우저의 오류 보정과 DOM을 생각하세요." },
  ]),
  topic("html", [
    { prompt: "문서의 핵심 콘텐츠 영역을 나타내는 태그명", correct: "main", acceptedAnswers: ["<main>"], distractors: ["head", "title", "meta"], explanation: "main은 body 안에서 페이지의 주요 콘텐츠를 나타냅니다.", hint: "핵심이라는 뜻의 영어 단어입니다." },
    { prompt: "독립적인 게시글 콘텐츠를 나타내는 태그명", correct: "article", acceptedAnswers: ["<article>"], distractors: ["section", "span", "br"], explanation: "article은 문맥에서 분리해도 자체 의미가 성립하는 콘텐츠입니다.", hint: "글 한 편을 뜻합니다." },
    { prompt: "시멘틱 HTML을 복잡한 화면에서도 유지해야 하는 이유", correct: "레이아웃이 바뀌어도 콘텐츠의 역할과 문서 구조를 일관되게 전달하기 위해", acceptedAnswers: ["역할과 구조의 일관된 전달"], distractors: ["모든 요소를 같은 색으로 만들기 위해", "CSS 선택자를 없애기 위해", "Grid를 24단으로 바꾸기 위해"], explanation: "시각 배치는 CSS와 breakpoint에 따라 변하지만 HTML 의미 구조는 콘텐츠 관계를 지속적으로 설명합니다.", hint: "표현 변화와 의미 지속성을 비교하세요." },
    { prompt: "외부 CSS와 시멘틱 마크업을 함께 리팩터링할 때 우선 확인할 것", correct: "태그 역할을 유지하면서 기존 class 선택자의 적용 범위가 의도대로 보존되는지", acceptedAnswers: ["의미 유지와 선택자 범위 확인"], distractors: ["모든 class를 id로 바꾸는지", "모든 스타일에 !important를 붙이는지", "HTML을 이미지로 변환하는지"], explanation: "태그를 바꾸면 구조와 선택자 일치 관계가 달라질 수 있으므로 의미와 표현을 함께 검증해야 합니다.", hint: "HTML 구조와 CSS 연결을 동시에 보세요." },
    { prompt: "좋은 HTML 문서 구조를 판별하는 종합 기준", correct: "유효한 중첩, 역할에 맞는 요소, head와 body의 명확한 구분을 갖춘다", acceptedAnswers: ["유효한 중첩과 의미 있는 구조"], distractors: ["div 수가 가장 많다", "모든 속성을 인라인 style로 작성한다", "title을 body 맨 아래 둔다"], explanation: "구조적 유효성과 시멘틱 의미가 함께 있어야 사람과 브라우저가 문서를 안정적으로 이해합니다.", hint: "중첩, 의미, 문서 영역을 함께 확인하세요." },
  ]),
];

export const WEB_QUESTION_BANK: Record<WebDifficulty, WebQuestion[]> = {
  easy: buildLevel("easy", easyBuilders),
  medium: buildLevel("medium", mediumBuilders),
  hard: buildLevel("hard", hardBuilders),
};

export const ALL_WEB_QUESTIONS = Object.values(WEB_QUESTION_BANK).flat();
const WEB_QUESTION_LOOKUP = new Map(
  ALL_WEB_QUESTIONS.map((question) => [question.id, question]),
);

export function getWebQuestion(questionId: string) {
  return WEB_QUESTION_LOOKUP.get(questionId);
}
