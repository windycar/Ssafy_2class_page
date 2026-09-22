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
    // Web 과목평가 대비 모의고사 4회차 (총 32문항)
    // 출제 토픽 1번 ~ 32번 1:1 매칭 완료
    // 구성: 객관식 24문항, 단답형 5문항, 서술형 3문항
    // 객관식 정답 분포: 0번(6개), 1번(6개), 2번(6개), 3번(6개) 완전 균등 분산 배치
    // =========================================================================

    // 1. Flex 교차축 정렬 (객관식)
    {
      id: "mock4-001-flex-cross-axis-align",
      conceptId: "flex-align-items-cross-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "CSS Flexbox에서 flex-direction: row로 배치된 아이템들을 교차축(cross axis)의 끝점(하단)으로 정렬하고자 할 때 컨테이너에 적용해야 할 선언은?",
      options: [
        "justify-content: flex-end;",
        "align-content: flex-start;",
        "align-items: flex-end;",
        "flex-direction: column-reverse;"
      ],
      answer: 2,
      explanation: "align-items 속성은 교차축을 따라 한 줄로 배치된 flex 아이템들의 정렬 방식을 지정하며, flex-end는 교차축의 끝점(기본 가로 모드에서는 하단)으로 정렬합니다[cite: 3].",
      hint: "주축 정렬이 아닌 교차축 정렬 속성을 떠올려보세요."
    },

    // 2. Box Model 너비 계산 (객관식)
    {
      id: "mock4-002-box-model-width-calc",
      conceptId: "box-model-width-calculation",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "box-sizing: content-box인 요소에 width: 140px, padding: 10px 15px, border: 3px solid blue, margin: 10px가 설정되어 있을 때, 테두리를 포함한 실제 상자의 전체 가로 너비는?",
      options: [
        "176px",
        "166px",
        "196px",
        "140px"
      ],
      answer: 0,
      explanation: "content-box에서 테두리 포함 전체 너비는 width(140px) + padding 좌우(15px * 2 = 30px) + border 좌우(3px * 2 = 6px) = 176px 입니다[cite: 2]. margin은 외부 여백이므로 상자 자체의 너비에 포함되지 않습니다[cite: 2].",
      hint: "콘텐츠 너비에 좌우 패딩과 좌우 테두리 두께만 더하세요."
    },

    // 3. 자손·자식 선택자 (단답형) - [수정: HTML 코드 기반 직계 자식 개수 판별]
    {
      id: "mock4-003-child-selector-code",
      conceptId: "child-vs-descendant-selector-code",
      difficulty: "easy",
      category: "CSS Selector",
      questionType: "short-answer",
      prompt: "다음 HTML 구조에서 `div > p` 선택자로 스타일이 적용되는 `<p>` 태그의 총 개수를 숫자로 작성하시오.\n\n<div>\n  <p>1번 문단</p>\n  <section>\n    <p>2번 문단</p>\n  </section>\n  <p>3번 문단</p>\n</div>",
      options: [],
      answer: null,
      acceptedAnswers: ["2", "2개"],
      explanation: "자식 결합자(`>`)는 부모 요소의 직계 자식만을 선택합니다. div의 직계 자식은 '1번 문단'과 '3번 문단' 2개이며, section 내부의 '2번 문단'은 자손이지만 직계 자식이 아니므로 선택되지 않습니다[cite: 2].",
      hint: "div 태그 바로 아래에 직접 포함된 직계 p 태그만 세어보세요."
    },

    // 4. box-sizing별 요소 너비 (객관식) - [수정: 가로 배치 및 gap/margin 0 조건 보완]
    {
      id: "mock4-004-box-sizing-width-behavior",
      conceptId: "border-box-width-property",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "두 요소가 가로로 나란히 배치되도록 설정되어 있고 gap과 margin이 없는 상태에서, 각각 width: 50%와 함께 내부 padding 및 border를 부여하였다. 이때 두 요소가 합계 100%의 가로폭을 유지하며 다음 줄로 떨어지지 않도록 만들기 위해 적용해야 하는 CSS 설정은?",
      options: [
        "box-sizing: content-box;",
        "display: inline;",
        "margin: 0 auto;",
        "box-sizing: border-box;"
      ],
      answer: 3,
      explanation: "border-box를 적용하면 padding과 border가 width: 50% 내부에 포함되어 계산되므로, 두 요소 너비의 합이 부모 너비(100%)를 초과하지 않아 줄 바꿈 현상이 발생하지 않습니다[cite: 2].",
      hint: "지정한 너비 안에 테두리와 패딩이 포함되는 상자 모델을 선택하세요."
    },

    // 5. content-box 너비 계산 (객관식)
    {
      id: "mock4-005-content-box-width-calc",
      conceptId: "content-box-element-width",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "다음 CSS가 적용된 블록 요소가 화면에서 차지하는 테두리 포함 실제 가로 너비(width)로 옳은 것은?\n\n.box {\n  box-sizing: content-box;\n  width: 350px;\n  padding: 20px;\n  border: 5px solid black;\n}",
      options: [
        "350px",
        "400px",
        "375px",
        "410px"
      ],
      answer: 1,
      explanation: "content-box 모델에서 전체 너비는 width(350px) + 좌우 padding(20px * 2 = 40px) + 좌우 border(5px * 2 = 10px) = 400px 입니다[cite: 2].",
      hint: "350 + 40 + 10 을 계산하세요."
    },

    // 6. position: absolute와 문서 흐름 (객관식)
    {
      id: "mock4-006-position-absolute-flow",
      conceptId: "position-absolute-normal-flow",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "일반 문서 흐름(Normal Flow)에 배치되어 있던 요소에 position: absolute를 적용했을 때 나타나는 변화로 옳은 것은?",
      options: [
        "원래 차지하던 공간을 그대로 유지한 채 화면에만 표시되지 않는다.",
        "일반 문서 흐름에서 벗어나며, 다른 요소는 해당 요소가 차지하던 공간을 사용할 수 있다.",
        "요소의 위치는 바뀌지 않고 다른 요소보다 항상 뒤쪽에 배치된다.",
        "부모 요소의 높이가 자동으로 두 배 증가하여 빈 공간을 확보한다."
      ],
      answer: 1,
      explanation: "position: absolute가 적용된 요소는 일반 문서 흐름에서 벗어나므로 기존 위치에 공간을 남기지 않습니다[cite: 3]. 따라서 뒤따르는 요소가 그 공간에 배치될 수 있습니다[cite: 3].",
      hint: "요소가 일반 문서 흐름에서 빠졌을 때 기존 공간이 유지되는지 생각해보세요."
    },

    // 7. inline과 block 요소 (객관식)
    {
      id: "mock4-007-inline-block-differences",
      conceptId: "block-element-characteristics",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "다음 중 대표적인 블록(block) 요소와 인라인(inline) 요소의 태그 연결로 올바르게 짝지어진 것은?",
      options: [
        "블록: <span>, <a> / 인라인: <div>, <p>",
        "블록: <img>, <strong> / 인라인: <h1>, <ul>",
        "블록: <div>, <h1> / 인라인: <span>, <a>",
        "블록: <p>, <span> / 인라인: <div>, <img>"
      ],
      answer: 2,
      explanation: "div, h1, p, ul, li 등은 대표적인 block 요소이며, span, a, strong, img 등은 inline 요소입니다[cite: 3].",
      hint: "한 줄 전체를 차지하는 독립된 상자 요소와 텍스트 흐름에 놓이는 요소를 구분하세요."
    },

    // 8. position: fixed (단답형)
    {
      id: "mock4-008-position-fixed",
      conceptId: "position-fixed-viewport",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "short-answer",
      prompt: "요소를 일반적인 문서 흐름에서 제거하고, 브라우저 화면(Viewport)을 기준으로 특정 위치에 고정시켜 스크롤 시에도 화면의 같은 위치를 유지하도록 만드는 position 속성값을 영문 소문자로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["fixed"],
      explanation: "position: fixed는 뷰포트를 기준으로 요소를 고정 배치하여 스크롤과 무관하게 화면에 고정시킵니다[cite: 3].",
      hint: "화면 뷰포트에 요소를 단단히 고정시키는 영단어입니다."
    },

    // 9. Flex 주축 정렬 (객관식)
    {
      id: "mock4-009-flex-main-axis-align",
      conceptId: "justify-content-main-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flexbox에서 flex-direction: row일 때, 모든 아이템들 사이의 여백과 양 끝(컨테이너 벽면)의 여백을 완전히 동일한 크기로 균등 배분하는 justify-content 속성값은?",
      options: [
        "space-evenly",
        "space-between",
        "space-around",
        "center"
      ],
      answer: 0,
      explanation: "space-evenly는 양 끝 모서리와 모든 아이템 사이의 간격을 완전히 동일하게 배분합니다[cite: 3]. (space-around는 양 끝 간격이 아이템 사이 간격의 절반입니다)[cite: 3].",
      hint: "양 끝 모서리를 포함해 '모든' 간격을 똑같이 맞추는 속성값입니다."
    },

    // 10. Bootstrap Grid gutter (객관식)
    {
      id: "mock4-010-bootstrap-grid-gutter",
      conceptId: "bootstrap-grid-gutter-spacing",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap 5 Grid 시스템에서 행(row)에 적용하여 가로(horizontal)와 세로(vertical) 방향의 Gutter를 동시에 1.5rem(4단위)으로 부여하는 클래스는?",
      options: [
        "gx-4",
        "gy-4",
        "gutter-4",
        "g-4"
      ],
      answer: 3,
      explanation: "Bootstrap에서 g-* 클래스는 x축(가로)과 y축(세로) Gutter 여백을 동시에 지정합니다[cite: 1].",
      hint: "축 방향 문자 없이 g와 숫자를 하이픈으로 연결합니다."
    },

    // 11. Reset CSS (서술형)
    {
      id: "mock4-011-reset-css-purpose-essay",
      conceptId: "reset-css-core-goal",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "essay",
      prompt: "웹 브라우저마다 내장된 기본 스타일시트(User Agent Stylesheet)의 특징을 언급하고, 웹 프로젝트에서 Reset CSS를 사용하는 목적과 이점을 30자 이상으로 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "브라우저마다 내장된 기본 스타일(User Agent Stylesheet)이 서로 달라 생기는 렌더링 불일치를 방지하기 위해, 모든 요소의 여백과 스타일을 초기화하여 모든 브라우저에서 일관된 화면을 제작하기 위함이다.",
      rubricKeywords: [
        "기본 스타일",
        "초기화",
        "일관성"
      ],
      minLength: 30,
      explanation: "브라우저마다 각기 다른 기본 스타일을 일관되게 초기화하여 크로스 브라우징 디자인 기준점을 확보하기 위해 사용합니다[cite: 4].",
      hint: "브라우저별 기본 스타일 차이 해소와 화면 일관성 확보를 중심으로 작성하세요."
    },

    // 12. CSS 상속 속성 (객관식)
    {
      id: "mock4-012-css-inheritance-properties",
      conceptId: "css-inheritable-properties",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "부모 요소에 font-size: 20px와 border: 1px solid black을 설정했을 때, 자식 요소에 적용되는 상속(Inheritance) 동작으로 옳은 것은?",
      options: [
        "font-size는 자식에게 상속되지만, border는 자식에게 상속되지 않는다.",
        "border는 자식에게 상속되지만, font-size는 자식에게 상속되지 않는다.",
        "font-size와 border 모두 자식에게 자동으로 상속된다.",
        "두 속성 모두 박스 모델이므로 자식에게 전혀 상속되지 않는다."
      ],
      answer: 0,
      explanation: "텍스트 관련 속성(font-size, color 등)은 자식 요소에게 기본적으로 상속되지만, 박스 모델 관련 속성(border, margin, padding 등)은 상속되지 않습니다[cite: 2].",
      hint: "글자 타이포그래피 속성과 박스 모델 테두리 속성의 상속 여부를 구분하세요."
    },

    // 13. HTML5 시맨틱 태그 (객관식)
    {
      id: "mock4-013-html5-semantic-tags",
      conceptId: "html5-semantic-aside",
      difficulty: "easy",
      category: "HTML",
      questionType: "multiple-choice",
      prompt: "HTML5 시맨틱 태그 중 문서의 본문 내용과 직접적인 관련은 적지만, 사이드바, 관련 링크 목록, 광고 구획 등에 적합한 태그는?",
      options: [
        "<section>",
        "<aside>",
        "<article>",
        "<main>"
      ],
      answer: 1,
      explanation: "<aside>는 문서의 주 내용과 간접적으로만 연관된 보조 콘텐츠나 사이드바 영역을 정의하는 시맨틱 태그입니다[cite: 4].",
      hint: "본문 옆 곁가지 내용을 담는 사이드바 태그입니다."
    },

    // 14. Bootstrap 반응형 Grid (단답형)
    {
      id: "mock4-014-bootstrap-responsive-grid",
      conceptId: "bootstrap-grid-breakpoint-sm",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "short-answer",
      prompt: "Bootstrap 5 Grid 시스템의 중단점(Breakpoints) 중 화면 너비가 576px 이상(모바일 가로 모드 및 소형 태블릿)일 때 적용되는 클래스 접두사에 들어가는 영문 약어 2글자를 소문자로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["sm"],
      explanation: "Bootstrap 5에서 576px 이상 구간을 정의하는 접두사는 Small을 뜻하는 'sm'입니다[cite: 1].",
      hint: "Small의 약어 2글자입니다."
    },

    // 15. Bootstrap 버튼 (객관식)
    {
      id: "mock4-015-bootstrap-button-classes",
      conceptId: "bootstrap-btn-info-class",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap 5에서 연한 하늘색 배경의 정보 전달 목적을 가진 버튼을 만들기 위한 클래스 조합은?",
      options: [
        "btn btn-primary",
        "btn btn-warning",
        "btn btn-info",
        "btn btn-secondary"
      ],
      answer: 2,
      explanation: "Bootstrap에서 정보(Information)를 나타내는 시안/하늘색 테마 클래스는 .btn-info입니다[cite: 4].",
      hint: "Information의 앞 글자를 딴 테마 명칭입니다."
    },

    // 16. Bootstrap Spacing (단답형)
    {
      id: "mock4-016-bootstrap-spacing-syntax",
      conceptId: "bootstrap-spacing-classes",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "short-answer",
      prompt: "Bootstrap 5에서 요소의 바깥 여백(margin)을 상하좌우 모든 방향에 걸쳐 1rem(3단위)으로 적용하는 클래스명을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["m-3"],
      explanation: "4방향 전체 margin은 sides 자리를 비워두고 'm-3'으로 작성합니다[cite: 4].",
      hint: "방향 지시자 없이 margin(m)과 크기(3)를 하이픈으로 연결하세요."
    },

    // 17. Bootstrap Grid 컬럼 배치 (객관식)
    {
      id: "mock4-017-bootstrap-grid-columns",
      conceptId: "bootstrap-grid-twelve-columns",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap 5 Grid에서 화면 전체 가로폭(12칸) 중 왼쪽 메인 콘텐츠에 9칸, 오른쪽 사이드바에 3칸을 할당하고자 할 때 적절한 클래스 조합은?",
      options: [
        "col-8 / col-4",
        "col-6 / col-6",
        "col-10 / col-2",
        "col-9 / col-3"
      ],
      answer: 3,
      explanation: "Bootstrap Grid는 한 행이 총 12칸이므로 9칸과 3칸으로 분할하려면 col-9와 col-3을 결합합니다[cite: 1].",
      hint: "두 숫자의 합이 12가 되는 9와 3의 조합입니다."
    },

    // 18. 요소 숨기기 (객관식)
    {
      id: "mock4-018-hiding-elements",
      conceptId: "display-none-layout-removal",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "웹 화면에서 요소를 완전히 사라지게 하여 화면에 렌더링되지 않고, 레이아웃 공간도 차지하지 않도록 만드는 CSS 선언은?",
      options: [
        "display: none;",
        "visibility: hidden;",
        "opacity: 0;",
        "z-index: -1;"
      ],
      answer: 0,
      explanation: "display: none은 요소를 렌더링 트리에서 배제하여 화면에 보이지 않고 공간도 차지하지 않게 만듭니다[cite: 3]. visibility: hidden과 opacity: 0은 원래 자리를 차지합니다[cite: 3].",
      hint: "공간 자체를 완전히 소멸시키는 display 속성값입니다."
    },

    // 19. content-box 구성 요소 (객관식)
    {
      id: "mock4-019-box-model-components",
      conceptId: "box-model-content-role",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "CSS Box Model의 사각형 영역 중 테두리 선(Border)의 안쪽에 위치하며, 텍스트나 이미지가 직접 표시되는 가장 안쪽 핵심 영역의 명칭은?",
      options: [
        "Margin",
        "Padding",
        "Content",
        "Gutter"
      ],
      answer: 2,
      explanation: "실제 글자나 이미지 데이터가 위치하는 가장 안쪽 영역을 Content(내용) 영역이라고 부릅니다[cite: 2].",
      hint: "상자의 실질적인 '내용물'을 뜻하는 영어 단어입니다."
    },

    // 20. CSS 캐스케이드 (객관식)
    {
      id: "mock4-020-css-cascade-rules",
      conceptId: "cascade-source-order-rule",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "다음과 같이 동일한 태그 선택자에 스타일이 중복 선언되었을 때, 최종적으로 p 태그에 적용되는 글자 색상과 그 이유로 옳은 것은?\n\np { color: blue; }\np { color: green; }",
      options: [
        "blue, 먼저 작성된 선언이 우선권을 갖기 때문이다.",
        "green, 명시도가 같을 때는 코드에서 나중에 작성된 선언이 이전 선언을 덮어쓰기 때문이다.",
        "blue, 알파벳 순서상 blue가 green보다 앞서기 때문이다.",
        "두 색상이 혼합된 청록색이 출력된다."
      ],
      answer: 1,
      explanation: "명시도와 중요도가 동일할 경우 캐스케이딩 소스 순서(Source Order)에 따라 나중에 작성된 스타일 선언이 최종 적용됩니다[cite: 2].",
      hint: "동일한 조건일 때 위쪽 코드와 아래쪽 코드 중 어느 쪽이 이기는지 생각해보세요."
    },

    // 21. flex-grow 공간 분배 (서술형)
    {
      id: "mock4-021-flex-grow-space-distribution-essay",
      conceptId: "flex-grow-calculation",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "essay",
      prompt: "너비 800px인 Flex 컨테이너 안에 기본 너비(flex-basis)가 각각 250px이고 margin, padding, border가 없는 두 아이템 A, B가 배치되어 있다. item A의 flex-grow가 1, item B의 flex-grow가 2일 때, item B의 최종 너비와 그 계산 과정을 30자 이상으로 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "컨테이너 너비 800px에서 두 아이템 기본 너비 합 500px을 뺀 남은 여백은 300px이다. flex-grow 비율 1:2에 따라 item B에 300px의 2/3인 200px이 배분되므로, 최종 너비는 기본 250px에 200px을 더한 450px이 된다.",
      rubricKeywords: [
        "300px",
        "1:2",
        "200px",
        "450px"
      ],
      minLength: 30,
      explanation: "컨테이너 여유 공간(800 - 500 = 300px)을 flex-grow 1:2 비율로 나누어 item B에 200px이 가산되므로 최종 450px이 됩니다[cite: 3].",
      hint: "기본 너비의 합을 컨테이너 너비에서 빼고, 남은 여백을 flex-grow 비율대로 배분하여 가산하세요."
    },

    // 22. z-index와 position (객관식)
    {
      id: "mock4-022-z-index-position-requirement",
      conceptId: "z-index-non-static-condition",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "CSS에서 z-index 속성을 사용하여 일반 블록 요소들의 앞뒤 겹침(쌓임) 순서를 제어하고자 할 때 반드시 충족해야 하는 위치 지정 조건은?",
      options: [
        "display 속성을 inline-block으로 변경해야 한다.",
        "box-sizing을 border-box로 설정해야 한다.",
        "width와 height를 백분율(%)로 지정해야 한다.",
        "position 속성을 static 이외의 값(relative, absolute 등)으로 지정해야 한다."
      ],
      answer: 3,
      explanation: "일반적인 블록 요소에서 z-index는 position 속성이 static이 아닌 relative, absolute, fixed, sticky로 위치가 지정된 요소에만 유효하게 적용됩니다[cite: 3].",
      hint: "기본 정적 위치(static)가 아닌 위치 지정 방식으로 변경해야 합니다."
    },

    // 23. position 기준점 (객관식)
    {
      id: "mock4-023-position-relative-origin",
      conceptId: "position-relative-reference-point",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "웹 화면에서 카드 썸네일 이미지의 우측 상단 모서리에 'NEW' 배지(Badge)를 position: absolute로 고정 배치하려고 한다. 이때 배지의 위치 기준점이 카드가 되도록 만들기 위해 카드(부모) 요소에 지정해야 하는 가장 적절한 CSS 속성은?",
      options: [
        "position: static;",
        "display: flex;",
        "position: relative;",
        "z-index: 10;"
      ],
      answer: 2,
      explanation: "자식 요소의 absolute 오프셋 기준점이 되려면 부모 요소에 position: relative(또는 static 이외의 position)를 지정해야 합니다[cite: 3].",
      hint: "부모 요소에 위치 기준점 역할을 부여할 때 관례적으로 사용하는 position 값입니다."
    },

    // 24. CSS 상대 단위 (객관식)
    {
      id: "mock4-024-css-relative-units",
      conceptId: "rem-root-element-reference",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "CSS 단위 중 반응형 웹과 접근성 지원에 널리 권장되며, html 최상위 루트 태그의 font-size를 기준으로 배수가 계산되는 단위는?",
      options: [
        "rem",
        "em",
        "px",
        "pt"
      ],
      answer: 0,
      explanation: "rem(Root em)은 최상위 <html> 태그의 글자 크기를 기준으로 크기가 결정되므로 중첩 요소에서도 안정적인 비율을 유지합니다[cite: 2].",
      hint: "Root em의 약어입니다."
    },

    // 25. position 속성 값 (객관식) - [수정: top: 0 위치 기준 조건 명시]
    {
      id: "mock4-025-position-sticky-behavior",
      conceptId: "position-sticky-threshold",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "스크롤을 내리기 전에는 일반 문서 흐름을 유지하며 원래 위치에 있다가, 스크롤되어 상단 모서리에 닿았을 때 top: 0을 함께 지정하여 화면 상단에 고정되도록 만드는 position 속성값은?",
      options: [
        "relative",
        "sticky",
        "absolute",
        "static"
      ],
      answer: 1,
      explanation: "position: sticky에 top: 0과 같은 오프셋 위치를 함께 지정하면 스크롤 임계점에 도달하기 전에는 relative처럼 동작하다가, 도달하는 순간 fixed처럼 화면 상단에 고정됩니다[cite: 3].",
      hint: "스크롤 임계점에 닿았을 때 화면에 달라붙는 속성입니다."
    },

    // 26. CSS 선택자 우선순위 (객관식)
    {
      id: "mock4-026-selector-specificity-priority",
      conceptId: "css-selector-priority-id",
      difficulty: "easy",
      category: "CSS Selector",
      questionType: "multiple-choice",
      prompt: "다음 4가지 CSS 선택자 중 스타일 적용 우선순위(명시도 가중치)가 가장 높은 선택자는?",
      options: [
        "전체 선택자 (*)",
        "태그 선택자 (h1)",
        "클래스 선택자 (.main-title)",
        "ID 선택자 (#title)"
      ],
      answer: 3,
      explanation: "선택자 명시도는 ID 선택자(100점) > 클래스 선택자(10점) > 태그 선택자(1점) > 전체 선택자(0점) 순입니다[cite: 2].",
      hint: "문서 내에서 단 하나의 고유 요소를 지정하는 선택자의 점수가 가장 높습니다."
    },

    // 27. Flex 여러 줄 정렬 (객관식)
    {
      id: "mock4-027-flex-multi-line-align",
      conceptId: "align-content-multi-line",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flex 컨테이너에서 flex-wrap: wrap으로 인해 두 줄 이상으로 분할된 행(줄) 전체를 교차축 중앙에 모아서 정렬할 때 사용하는 CSS 속성은?",
      options: [
        "align-content: center;",
        "align-items: center;",
        "justify-content: center;",
        "flex-direction: center;"
      ],
      answer: 0,
      explanation: "flex-wrap: wrap에 의해 여러 줄로 줄 바꿈된 아이템 행들 간의 교차축 간격 및 정렬을 제어하는 속성은 align-content입니다[cite: 3].",
      hint: "아이템 개별 정렬이 아닌 여러 줄 전체의 간격을 맞추는 속성입니다."
    },

    // 28. 시맨틱 태그와 검색 엔진 (서술형)
    {
      id: "mock4-028-semantic-tag-seo-benefits-essay",
      conceptId: "semantic-html-seo-accessibility",
      difficulty: "easy",
      category: "HTML",
      questionType: "essay",
      prompt: "HTML 문서 작성 시 시맨틱 태그(<header>, <nav>, <article> 등)를 사용하는 이유를 검색 엔진 최적화(SEO)와 보조 기기(스크린 리더)를 통한 웹 접근성 관점에서 30자 이상으로 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "시맨틱 태그는 문서의 구조와 각 영역의 역할을 명확히 하여 검색 엔진 크롤러의 효율적인 색인과 검색 노출(SEO)을 돕고, 스크린 리더 사용자가 문서 구조를 논리적으로 파악할 수 있도록 웹 접근성을 향상시킨다.",
      rubricKeywords: [
        "SEO",
        "접근성",
        "구조"
      ],
      minLength: 30,
      explanation: "시맨틱 태그는 문서의 구조적 의미를 브라우저, 검색 엔진 크롤러(SEO), 보조 기기(웹 접근성)에 명확히 전달합니다[cite: 4].",
      hint: "검색 엔진의 정보 수집(SEO)과 스크린 리더 사용자의 웹 접근성 향상 측면을 서술하세요."
    },

    // 29. CSS 방법론 (단답형)
    {
      id: "mock4-029-oocss-methodology",
      conceptId: "oocss-core-principles",
      difficulty: "easy",
      category: "CSS Architecture",
      questionType: "short-answer",
      prompt: "객체 지향 개념을 CSS에 도입하여 '구조와 스킨의 분리', '컨테이너와 콘텐츠의 분리'를 통해 재사용성을 극대화하는 CSS 방법론의 영문 약어(5글자 대문자)를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["OOCSS"],
      explanation: "OOCSS(Object Oriented CSS)는 구조와 스킨, 컨테이너와 콘텐츠를 분리하는 CSS 설계 방법론입니다[cite: 4].",
      hint: "Object Oriented CSS의 영문 5글자 약어입니다."
    },

    // 30. Flex 개별 아이템 정렬 (객관식)
    {
      id: "mock4-030-flex-individual-item-align",
      conceptId: "align-self-individual-override",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flex 컨테이너의 align-items 속성이 center로 설정되어 있을 때, 특정 하나의 자식 아이템만 교차축 상단(시작점)에 붙여서 정렬하고자 할 때 해당 아이템에 부여할 CSS 선언은?",
      options: [
        "justify-self: flex-start;",
        "align-items: flex-start;",
        "align-self: flex-start;",
        "align-content: flex-start;"
      ],
      answer: 2,
      explanation: "컨테이너의 align-items 설정을 개별 자식 아이템 차원에서 재정의할 때는 align-self 속성을 사용합니다[cite: 3].",
      hint: "부모의 설정을 덮어쓰고 아이템 자신만을 정렬하는 속성입니다."
    },

    // 31. Flex 주축과 교차축 (객관식)
    {
      id: "mock4-031-flex-axes-direction",
      conceptId: "flex-direction-column-main-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "CSS Flexbox에서 flex-direction 속성을 column으로 지정했을 때 주 축(main axis)과 교차 축(cross axis)의 방향으로 옳은 것은?",
      options: [
        "주 축은 가로 방향, 교차 축은 세로 방향",
        "주 축과 교차 축 모두 가로 방향",
        "주 축과 교차 축 모두 세로 방향",
        "주 축은 세로 방향, 교차 축은 가로 방향"
      ],
      answer: 3,
      explanation: "flex-direction: column은 주 축을 세로(위에서 아래)로 설정하며, 교차 축은 주 축에 수직인 가로 방향이 됩니다[cite: 3].",
      hint: "column(열) 설정 시 주 축이 어느 축으로 바뀌는지 떠올려보세요."
    },

    // 32. CSS 명시도 (객관식)
    {
      id: "mock4-032-css-compound-specificity",
      conceptId: "compound-selector-specificity-comparison",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "동일한 요소에 다음 4개의 CSS 선택자가 적용되어 스타일이 충돌할 때, 명시도(Specificity) 점수가 가장 높아 최종 적용되는 선택자는?",
      options: [
        ".card .header h2.title",
        "#content .title",
        "div.container ul li a",
        "body main article p"
      ],
      answer: 1,
      explanation: "#content .title은 ID 1개(100점) + 클래스 1개(10점) = 110점으로, ID 선택자가 없는 다른 선택자들보다 명시도가 가장 높습니다[cite: 2].",
      hint: "ID 선택자(#)가 포함되어 가장 높은 가중치를 갖는 규칙을 찾으세요."
    }
  ],
  medium: [],
  hard: [],
  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();