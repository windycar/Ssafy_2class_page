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
    // Web 과목평가 대비 기초 입문 모의고사 (초급 32문항)
    // 출제 토픽 1번 ~ 32번 1:1 매칭 완료
    // 구성: 객관식 24문항, 단답형 5문항, 서술형 3문항
    // 객관식 정답 분포: 0번(6개), 1번(6개), 2번(6개), 3번(6개) 균등 분산 배치
    // =========================================================================

    // 1. Flex 교차축 정렬 (객관식)
    {
      id: "mock-basic-001-flex-cross-axis",
      conceptId: "flex-align-items-cross-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "CSS Flexbox에서 교차축(cross axis)을 따라 아이템들을 정렬할 때 사용하는 속성은?",
      options: [
        "flex-direction",
        "justify-content",
        "align-items",
        "flex-wrap"
      ],
      answer: 2,
      explanation: "justify-content는 주축(main axis)을 따라 정렬하고, align-items는 교차축(cross axis)을 따라 아이템을 정렬합니다.",
      hint: "주축 정렬이 아닌 교차축 정렬 속성을 떠올려보세요."
    },

    // 2. Box Model 너비 계산 (객관식)
    {
      id: "mock-basic-002-box-model-width",
      conceptId: "box-model-width-calculation",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "box-sizing: content-box인 요소에 width: 100px, 좌우 padding: 10px, border: 없음(0px), margin: 20px를 적용했을 때 테두리를 포함한 실제 상자의 가로 너비는?",
      options: [
        "100px",
        "120px",
        "140px",
        "160px"
      ],
      answer: 1,
      explanation: "content-box에서 상자 너비는 width(100px) + 좌우 padding(20px) = 120px입니다. margin은 외부 간격이므로 상자 자체 너비에 포함되지 않습니다."
    },

    // 3. 자손·자식 선택자 (단답형)
    {
      id: "mock-basic-003-child-combinator",
      conceptId: "child-combinator-syntax",
      difficulty: "easy",
      category: "CSS Selector",
      questionType: "short-answer",
      prompt: "CSS에서 부모 요소의 직계 자식만을 선택할 때 사용하는 '자식 결합자' 기호(특수문자 1글자)를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [">"],
      explanation: "직계 자식만을 선택할 때는 꺾쇠 기호인 '>'를 사용하며, 공백(스페이스)은 하위의 모든 자손 요소를 선택합니다.",
      hint: "오른쪽을 가리키는 꺾쇠 모양 기호입니다."
    },

    // 4. box-sizing별 요소 너비 (객관식)
    {
      id: "mock-basic-004-box-sizing-border-box",
      conceptId: "border-box-width-property",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "CSS에서 box-sizing: border-box를 지정했을 때의 특징으로 가장 알맞은 것은?",
      options: [
        "지정한 width 안에 padding과 border가 포함되어 전체 상자 크기가 유지된다.",
        "padding을 추가하면 지정한 width 바깥으로 상자 크기가 늘어난다.",
        "margin 영역까지 width 내부에 포함하여 전체 크기를 계산한다.",
        "width 속성을 설정해도 브라우저가 크기를 무시하고 기본 크기로 표시한다."
      ],
      answer: 0,
      explanation: "border-box는 설정한 width와 height 안에 테두리(border)와 안쪽 여백(padding)이 포함되므로 크기 계산과 레이아웃 관리가 편리합니다.",
      hint: "지정한 너비 안에 테두리와 패딩이 포함되는 상자 모델입니다."
    },

    // 5. content-box 너비 계산 (객관식)
    {
      id: "mock-basic-005-content-box-calculation",
      conceptId: "content-box-element-width",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "box-sizing: content-box인 요소에 width: 200px, 좌우 padding: 10px, 좌우 border: 5px가 설정되어 있을 때, 테두리를 포함한 실제 상자 너비는?",
      options: [
        "200px",
        "215px",
        "220px",
        "230px"
      ],
      answer: 3,
      explanation: "전체 너비 = width(200px) + 좌우 padding(20px) + 좌우 border(10px) = 230px입니다.",
      hint: "200에 좌우 패딩의 합(20)과 좌우 테두리의 합(10)을 더하세요."
    },

    // 6. position: absolute와 문서 흐름 (객관식)
    {
      id: "mock-basic-006-position-absolute-flow",
      conceptId: "position-absolute-normal-flow",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "특정 요소에 position: absolute를 지정했을 때 일반적인 문서 흐름(Normal flow)에서 일어나는 변화는?",
      options: [
        "원래 차지하던 자리를 그대로 유지하며 요소만 투명해진다.",
        "일반 문서 흐름에서 완전히 벗어나며, 원래 자리에 빈 공간을 남기지 않는다.",
        "항상 부모 요소의 가로 너비 전체(100%)를 자동으로 채운다.",
        "스크롤을 내려도 항상 브라우저 화면의 같은 위치에 고정된다."
      ],
      answer: 1,
      explanation: "position: absolute가 적용된 요소는 일반 문서 흐름에서 벗어나므로 원래 위치에 공간을 남기지 않으며, 뒤따르는 요소가 그 자리를 차지합니다.",
      hint: "요소가 일반 문서 흐름에서 빠졌을 때 원래 공간이 남는지 생각해보세요."
    },

    // 7. inline과 block 요소 (객관식)
    {
      id: "mock-basic-007-block-element-trait",
      conceptId: "block-element-characteristics",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "HTML의 기본 박스 타입 중 <h1>, <p>, <div>와 같은 블록(block) 요소의 기본 특징은?",
      options: [
        "줄 바꿈 없이 다른 글자와 같은 줄에 나란히 배치된다.",
        "width와 height 속성을 지정해도 크기가 전혀 변하지 않는다.",
        "항상 새로운 줄에서 시작하며, 가로 공간 전체(너비 100%)를 차지한다.",
        "상하 마진(margin)이 다른 요소를 전혀 밀어내지 못한다."
      ],
      answer: 2,
      explanation: "block 요소는 항상 새로운 행에서 시작하며, 별도로 너비를 주지 않으면 부모의 가로 공간 전체를 차지합니다.",
      hint: "책의 문단처럼 한 줄 전체를 차지하는 독립된 덩어리 요소입니다."
    },

    // 8. position: fixed (단답형)
    {
      id: "mock-basic-008-position-fixed",
      conceptId: "position-fixed-viewport",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "short-answer",
      prompt: "요소를 일반 문서 흐름에서 제거하고, 스크롤을 내려도 항상 브라우저 화면 창(viewport)의 고정된 위치에 머무르게 만드는 position 속성값을 영문 소문자로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["fixed"],
      explanation: "position: fixed는 화면 뷰포트(viewport)를 기준으로 요소를 고정하여 스크롤해도 화면의 같은 자리에 유지됩니다.",
      hint: "화면 뷰포트에 요소를 단단히 고정시키는 영단어입니다."
    },

    // 9. Flex 주축 정렬 (객관식)
    {
      id: "mock-basic-009-justify-content-center",
      conceptId: "justify-content-main-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flexbox 컨테이너에서 아이템들을 주 축(main axis)의 한가운데(중앙)로 모아서 정렬할 때 사용하는 CSS 선언은?",
      options: [
        "justify-content: center;",
        "align-items: center;",
        "flex-direction: center;",
        "align-content: center;"
      ],
      answer: 0,
      explanation: "주 축 방향의 정렬과 간격 분배는 justify-content 속성을 사용하며, center는 중앙 정렬을 수행합니다.",
      hint: "주 축(main axis)을 정렬하는 대표 속성명을 생각해보세요."
    },

    // 10. Bootstrap Grid gutter (객관식)
    {
      id: "mock-basic-010-bootstrap-gutter-term",
      conceptId: "bootstrap-grid-gutter-spacing",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap Grid 시스템에서 컬럼(Column)과 컬럼 사이의 여백 공간을 부르는 명칭은?",
      options: [
        "Margin",
        "Border",
        "Padding",
        "Gutter"
      ],
      answer: 3,
      explanation: "Bootstrap Grid에서 컬럼들 사이의 가로 및 세로 간격(여백)을 Gutter라고 부릅니다.",
      hint: "g, gx, gy 클래스로 조절하는 여백의 명칭입니다."
    },

    // 11. Reset CSS (서술형)
    {
      id: "mock-basic-011-reset-css-purpose",
      conceptId: "reset-css-core-goal",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "essay",
      prompt: "웹 페이지를 개발할 때 Reset CSS를 적용하는 가장 주된 목적을 30자 이상으로 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "브라우저마다 서로 다르게 내장된 기본 스타일을 초기화하여, 모든 브라우저에서 동일하고 일관된 화면을 제작하기 위함이다.",
      rubricKeywords: [
        "기본 스타일",
        "초기화",
        "일관성"
      ],
      minLength: 30,
      explanation: "각 브라우저마다 내장된 기본 스타일(User Agent Stylesheet)이 달라 생기는 화면 불일치를 해결하기 위해 기본 여백과 스타일을 초기화합니다.",
      hint: "브라우저별 기본 스타일 차이 해소와 화면 일관성 확보를 중심으로 작성하세요."
    },

    // 12. CSS 상속 속성 (객관식)
    {
      id: "mock-basic-012-css-inheritance",
      conceptId: "css-inheritable-properties",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "부모 요소에 스타일을 적용했을 때 자식 요소에게 기본적으로 상속(Inherit)되는 속성은?",
      options: [
        "border",
        "color",
        "margin",
        "padding"
      ],
      answer: 1,
      explanation: "color, font-size 등 텍스트 타이포그래피 관련 속성은 자식에게 상속되지만, border, margin, padding 등 박스 모델 관련 속성은 상속되지 않습니다.",
      hint: "글자 색상이나 폰트와 관련된 텍스트 속성을 골라보세요."
    },

    // 13. HTML5 시맨틱 태그 (객관식)
    {
      id: "mock-basic-013-html-semantic-header",
      conceptId: "html5-semantic-header",
      difficulty: "easy",
      category: "HTML",
      questionType: "multiple-choice",
      prompt: "HTML5 시맨틱 태그 중 사이트 로고나 검색창, 제목 등이 위치하는 웹 페이지의 '머리말' 구획을 나타내는 태그는?",
      options: [
        "<footer>",
        "<aside>",
        "<header>",
        "<nav>"
      ],
      answer: 2,
      explanation: "<header>는 소개 및 탐색을 돕는 콘텐츠가 들어가는 웹 페이지나 섹션의 머리말 구획을 정의합니다.",
      hint: "머리말 영역을 의미하는 태그입니다."
    },

    // 14. Bootstrap 반응형 Grid (단답형)
    {
      id: "mock-basic-014-bootstrap-breakpoint-md",
      conceptId: "bootstrap-grid-breakpoint-md",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "short-answer",
      prompt: "Bootstrap 5 Grid에서 화면 너비 768px 이상(태블릿 화면 크기)을 나타내는 중단점(Breakpoint) 영문 약어 2글자를 소문자로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["md"],
      explanation: "Bootstrap 5에서 768px 이상 구간을 정의하는 중단점 접두사는 Medium을 뜻하는 'md'입니다.",
      hint: "Medium의 약어 2글자입니다."
    },

    // 15. Bootstrap 버튼 (객관식)
    {
      id: "mock-basic-015-bootstrap-btn-primary",
      conceptId: "bootstrap-btn-primary-class",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap에서 기본 파란색 테마 버튼을 생성하기 위해 적용하는 클래스 조합은?",
      options: [
        "btn btn-primary",
        "button btn-blue",
        "btn btn-danger",
        "btn btn-warning"
      ],
      answer: 0,
      explanation: "Bootstrap의 기본 테마 버튼은 버튼 기본 클래스 .btn과 주요 색상 클래스 .btn-primary를 결합하여 작성합니다.",
      hint: "버튼 기본 클래스 btn과 주요 테마 클래스의 조합입니다."
    },

    // 16. Bootstrap Spacing (단답형)
    {
      id: "mock-basic-016-bootstrap-spacing-prefix",
      conceptId: "bootstrap-spacing-classes",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "short-answer",
      prompt: "Bootstrap 5에서 요소의 바깥 여백 중 '위쪽 여백(margin-top)'을 설정할 때 사용하는 클래스 접두사 2글자를 소문자로 작성하시오. (예: mt, mb 등)",
      options: [],
      answer: null,
      acceptedAnswers: ["mt"],
      explanation: "바깥 여백(margin)의 m과 위쪽(top)의 t를 조합하여 'mt'를 접두사로 사용합니다.",
      hint: "margin(m)과 top(t)의 조합입니다."
    },

    // 17. Bootstrap Grid 컬럼 배치 (객관식)
    {
      id: "mock-basic-017-bootstrap-grid-twelve",
      conceptId: "bootstrap-grid-twelve-columns",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap Grid 시스템의 한 행(row)은 총 몇 개의 컬럼(column) 단위로 구성되어 있는가?",
      options: [
        "6개",
        "10개",
        "12개",
        "16개"
      ],
      answer: 2,
      explanation: "Bootstrap의 그리드 시스템은 기본적으로 1개의 행(row)을 12개의 컬럼 영역으로 분할하여 배치합니다.",
      hint: "부트스트랩 그리드의 기본 분할 단위 숫자입니다."
    },

    // 18. 요소 숨기기 (객관식)
    {
      id: "mock-basic-018-display-none",
      conceptId: "display-none-layout-removal",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "웹 페이지에서 요소를 화면에 보이지 않게 감추면서, 레이아웃 공간조차 완전히 없애버리는 CSS 선언은?",
      options: [
        "visibility: hidden;",
        "opacity: 0;",
        "z-index: -1;",
        "display: none;"
      ],
      answer: 3,
      explanation: "display: none은 요소를 화면에 렌더링하지 않으며 원래 차지하던 레이아웃 공간도 완전히 삭제합니다.",
      hint: "공간 자체를 완전히 소멸시키는 display 속성값입니다."
    },

    // 19. content-box 구성 요소 (객관식)
    {
      id: "mock-basic-019-box-model-content",
      conceptId: "box-model-content-role",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "CSS Box Model에서 실제 글자나 이미지 등 데이터가 들어가는 가장 안쪽 핵심 영역은?",
      options: [
        "Content",
        "Padding",
        "Border",
        "Margin"
      ],
      answer: 0,
      explanation: "글자나 이미지 등 실질적인 콘텐츠 데이터가 배치되는 가장 안쪽의 영역을 Content라고 합니다.",
      hint: "상자의 실질적인 내용물을 뜻하는 단어입니다."
    },

    // 20. CSS 캐스케이드 (객관식)
    {
      id: "mock-basic-020-css-cascading-concept",
      conceptId: "cascade-source-order-rule",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "동일한 선택자로 같은 요소에 색상 스타일을 두 번 선언했을 때, 나중에 작성된 스타일이 이전 스타일을 덮어쓰는 CSS의 핵심 원리는?",
      options: [
        "상속 (Inheritance)",
        "캐스케이딩 (Cascading)",
        "박스 모델 (Box Model)",
        "리셋 (Reset)"
      ],
      answer: 1,
      explanation: "명시도가 같을 때 코드 순서상 나중에 선언된 스타일이 우선 적용되는 계단식 규칙을 캐스케이딩(Cascading)이라고 합니다.",
      hint: "CSS의 첫 글자 C에 해당하는 개념입니다."
    },

    // 21. flex-grow 공간 분배 (서술형)
    {
      id: "mock-basic-021-flex-grow-essay",
      conceptId: "flex-grow-calculation",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "essay",
      prompt: "너비 300px인 Flex 컨테이너에 기본 너비(flex-basis)가 각각 100px인 두 아이템 A, B가 있다(여백/테두리 없음). 두 아이템의 flex-grow가 모두 1로 동일할 때, 아이템 A의 최종 너비와 계산 과정을 30자 이상으로 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "컨테이너 너비 300px에서 두 아이템 기본 너비 합 200px을 뺀 남은 공간은 100px이다. flex-grow가 1:1로 동일하므로 각각 50px씩 균등 배분되어, 아이템 A의 최종 너비는 기본 100px에 50px을 더한 150px이다.",
      rubricKeywords: [
        "100px",
        "1:1",
        "50px",
        "150px"
      ],
      minLength: 30,
      explanation: "남은 공간 100px을 1:1 비율로 균등하게 50px씩 나누어 가지므로 기본 100px에 더해져 최종 150px이 됩니다.",
      hint: "전체 너비에서 기본 너비의 합을 빼고, 남은 공간을 1:1로 똑같이 나누어주세요."
    },

    // 22. z-index와 position (객관식)
    {
      id: "mock-basic-022-z-index-requirement",
      conceptId: "z-index-non-static-condition",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "일반적인 HTML 블록 요소에서 z-index 속성이 정상 작동하여 화면 앞뒤 겹침 순서를 조절하기 위한 필수 조건은?",
      options: [
        "display 속성을 inline으로 설정해야 한다.",
        "margin 값을 반드시 0으로 설정해야 한다.",
        "position 속성을 static이 아닌 값(relative, absolute 등)으로 설정해야 한다.",
        "width와 height를 고정 픽셀(px)로 지정해야 한다."
      ],
      answer: 2,
      explanation: "일반적인 블록 요소는 기본 위치인 static 상태에서는 z-index가 동작하지 않으며, relative, absolute, fixed, sticky 등으로 지정되어야 유효합니다.",
      hint: "position 기본값인 static 상태에서는 z-index가 동작하지 않습니다."
    },

    // 23. position 기준점 (객관식)
    {
      id: "mock-basic-023-position-relative-reference",
      conceptId: "position-relative-reference-point",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "position: relative가 적용된 요소에 top: 10px를 주었을 때, 요소가 이동하는 기준점은?",
      options: [
        "브라우저 화면(viewport)의 맨 위쪽 모서리",
        "자신이 일반 문서 흐름에서 원래 배치되어야 할 기본 위치",
        "부모 요소의 정중앙 좌표",
        "HTML 문서 전체의 맨 끝 바닥선"
      ],
      answer: 1,
      explanation: "position: relative는 Normal flow에서 본래 자신이 위치해야 했던 원래 자리를 기준으로 오프셋만큼 이동합니다.",
      hint: "자기 자신의 본래 기본 자리를 기준으로 삼습니다."
    },

    // 24. CSS 상대 단위 (객관식)
    {
      id: "mock-basic-024-rem-unit",
      conceptId: "rem-root-element-reference",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "CSS 상대 단위 중 최상위 루트 태그인 <html>의 font-size(기본 16px)를 기준으로 크기가 결정되는 단위는?",
      options: [
        "px",
        "em",
        "pt",
        "rem"
      ],
      answer: 3,
      explanation: "rem(Root em)은 직속 부모가 아닌 최상위 루트 요소(html)의 글자 크기를 기준으로 배수가 계산되는 단위입니다.",
      hint: "Root em의 약어입니다."
    },

    // 25. position 속성 값 (객관식)
    {
      id: "mock-basic-025-position-static",
      conceptId: "position-static-default-value",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "CSS position 속성의 기본값(default)으로, 별도의 위치 이동 없이 일반적인 문서 흐름에 따라 배치되는 값은?",
      options: [
        "static",
        "relative",
        "absolute",
        "fixed"
      ],
      answer: 0,
      explanation: "position 속성의 기본값은 static이며, 좌표 속성(top, left 등)이 적용되지 않고 일반 문서 흐름에 배치됩니다.",
      hint: "정적 위치를 의미하는 기본 속성값입니다."
    },

    // 26. CSS 선택자 우선순위 (객관식)
    {
      id: "mock-basic-026-selector-priority-id",
      conceptId: "css-selector-priority-id",
      difficulty: "easy",
      category: "CSS Selector",
      questionType: "multiple-choice",
      prompt: "다음 CSS 기본 선택자 중 스타일 적용 우선순위(명시도 점수)가 가장 높은 선택자는?",
      options: [
        "전체 선택자 (*)",
        "태그 선택자 (p)",
        "클래스 선택자 (.text)",
        "ID 선택자 (#header)"
      ],
      answer: 3,
      explanation: "선택자 명시도 점수는 ID(100점) > 클래스(10점) > 태그(1점) > 전체 선택자(0점) 순입니다.",
      hint: "문서에서 단 하나의 고유 요소를 지정하는 선택자의 점수가 가장 높습니다."
    },

    // 27. Flex 여러 줄 정렬 (객관식)
    {
      id: "mock-basic-027-flex-align-content",
      conceptId: "align-content-multi-line",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flexbox에서 flex-wrap: wrap으로 인해 아이템이 두 줄 이상으로 줄 바꿈되었을 때, 여러 줄 전체의 교차축 정렬을 담당하는 속성은?",
      options: [
        "align-content",
        "justify-content",
        "flex-direction",
        "align-self"
      ],
      answer: 0,
      explanation: "여러 행(줄)으로 나뉜 flex 아이템 라인들 간의 교차축 간격과 정렬을 제어하는 속성은 align-content입니다.",
      hint: "한 줄의 아이템 정렬이 아닌 여러 줄 전체의 교차축 간격을 제어하는 속성입니다."
    },

    // 28. 시맨틱 태그와 검색 엔진 (서술형)
    {
      id: "mock-basic-028-semantic-tag-seo-essay",
      conceptId: "semantic-html-seo-accessibility",
      difficulty: "easy",
      category: "HTML",
      questionType: "essay",
      prompt: "웹 페이지를 만들 때 의미 없는 <div> 대신 <header>, <nav>, <article> 같은 시맨틱 태그를 사용하는 이유를 검색 엔진(SEO) 관점에서 30자 이상으로 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "시맨틱 태그는 웹 페이지의 각 구획과 콘텐츠의 의미를 명확하게 나타내어, 검색 엔진 크롤러가 웹 사이트의 정보를 정확히 파악하고 색인하는 검색 엔진 최적화(SEO)에 도움을 준다.",
      rubricKeywords: [
        "검색 엔진",
        "SEO",
        "의미",
        "색인"
      ],
      minLength: 30,
      explanation: "시맨틱 태그는 문서의 구조적 의미를 명확히 하여 검색 엔진 크롤러가 웹 콘텐츠를 올바르게 분석하고 색인할 수 있도록 돕습니다.",
      hint: "검색 엔진 크롤러가 문서의 구조와 의미를 쉽게 이해하여 색인하도록 돕는 측면을 서술하세요."
    },

    // 29. CSS 방법론 (단답형)
    {
      id: "mock-basic-029-oocss-acronym",
      conceptId: "oocss-core-principles",
      difficulty: "easy",
      category: "CSS Architecture",
      questionType: "short-answer",
      prompt: "'구조와 스킨의 분리', '컨테이너와 콘텐츠의 분리'를 원칙으로 하여 재사용성을 높이는 객체 지향 CSS 방법론의 영문 약어(5글자 대문자)를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["OOCSS"],
      explanation: "Object Oriented CSS의 약어인 OOCSS는 구조와 스킨, 컨테이너와 콘텐츠를 분리하는 CSS 설계 방법론입니다.",
      hint: "Object Oriented CSS의 영문 5글자 약어입니다."
    },

    // 30. Flex 개별 아이템 정렬 (객관식)
    {
      id: "mock-basic-030-flex-align-self",
      conceptId: "align-self-individual-override",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flex 컨테이너의 align-items 설정을 무시하고, 특정 아이템 하나만 개별적으로 교차축 정렬을 변경할 때 해당 아이템에 사용하는 속성은?",
      options: [
        "justify-content",
        "align-self",
        "flex-grow",
        "align-content"
      ],
      answer: 1,
      explanation: "개별 flex 아이템에 align-self 속성을 지정하면 부모 컨테이너의 align-items 설정을 덮어쓰고 해당 아이템만 교차축 정렬을 변경합니다.",
      hint: "자기 자신만을 개별 정렬하는 속성입니다."
    },

    // 31. Flex 주축과 교차축 (객관식)
    {
      id: "mock-basic-031-flex-direction-row",
      conceptId: "flex-direction-column-main-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flexbox에서 기본값인 flex-direction: row일 때, 주 축(main axis)의 방향은?",
      options: [
        "위에서 아래로 향하는 세로 방향",
        "아래에서 위로 향하는 세로 방향",
        "왼쪽에서 오른쪽으로 향하는 가로 방향",
        "오른쪽에서 왼쪽으로 향하는 가로 방향"
      ],
      answer: 2,
      explanation: "flex-direction: row는 아이템이 나열되는 주 축을 수평(왼쪽에서 오른쪽으로 향하는 가로 방향)으로 설정합니다.",
      hint: "row는 행(가로줄)을 의미합니다."
    },

    // 32. CSS 명시도 (객관식)
    {
      id: "mock-basic-032-css-specificity-id",
      conceptId: "compound-selector-specificity-comparison",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "다음 CSS 선택자 중 명시도(가중치) 점수가 가장 높아 최우선으로 스타일이 적용되는 것은?",
      options: [
        "body p",
        ".container .text",
        "div.box p",
        "#main-title"
      ],
      answer: 3,
      explanation: "#main-title은 ID 선택자로 100점의 가중치를 가지므로 클래스(10점)나 태그(1점) 선택자보다 우선 적용됩니다.",
      hint: "ID 선택자(#)가 포함된 규칙의 가중치를 확인하세요."
    }
  ],
  medium: [],
  hard: [],
  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();
