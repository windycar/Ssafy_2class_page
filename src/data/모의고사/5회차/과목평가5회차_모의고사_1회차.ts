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
    // Web 과목평가 대비 모의고사 1회차 (총 32문항)
    // 출제 토픽 1번 ~ 32번 1:1 매칭
    // 구성: 객관식 24문항, 단답형 5문항, 서술형 3문항
    // 객관식 정답 분포: 0번(6개), 1번(6개), 2번(6개), 3번(6개) 완전 균등 분산
    // =========================================================================

    // 1. Flex 교차축 정렬 (객관식)
    {
      id: "mock1-001-flex-cross-axis-align",
      conceptId: "flex-align-items-cross-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flex 컨테이너 안에서 한 줄로 배치된 아이템들을 교차축(cross axis) 기준으로 정렬하는 CSS 속성은?",
      options: [
        "justify-content",
        "flex-direction",
        "align-items",
        "flex-wrap"
      ],
      answer: 2,
      explanation: "justify-content는 주축(main axis)을 제어하고, align-items는 교차축(cross axis)을 따라 아이템들을 정렬합니다[cite: 3].",
      hint: "주축 정렬이 아닌 교차축 정렬 속성을 떠올려보세요."
    },

    // 2. Box Model 너비 계산 (객관식)
    {
      id: "mock1-002-box-model-width-calc",
      conceptId: "box-model-width-calculation",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "width: 200px, padding: 20px, border: 5px solid black(box-sizing: content-box)일 때 테두리를 포함한 실제 전체 너비는?",
      options: [
        "250px",
        "200px",
        "225px",
        "280px"
      ],
      answer: 0,
      explanation: "content-box에서 테두리를 포함한 실제 너비는 width(200px) + padding 좌우(40px) + border 좌우(10px) = 250px 입니다[cite: 2].",
      hint: "content-box에서는 콘텐츠 너비에 패딩과 테두리의 좌우 크기를 모두 더합니다."
    },

    // 3. 자손·자식 선택자 (단답형)
    {
      id: "mock1-003-child-selector-symbol",
      conceptId: "child-combinator-syntax",
      difficulty: "easy",
      category: "CSS Selector",
      questionType: "short-answer",
      prompt: "CSS 선택자에서 부모 요소 바로 아래에 위치한 직계 자식만을 선택할 때 사용하는 자식 결합자 기호를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [">"],
      explanation: "자식 결합자(>)는 직계 자식만을 선택하며, 공백(스페이스)은 하위의 모든 자손 요소를 선택합니다[cite: 2].",
      hint: "꺾쇠 모양의 특수문자 1글자입니다."
    },

    // 4. box-sizing별 요소 너비 (객관식)
    {
      id: "mock1-004-box-sizing-width-behavior",
      conceptId: "border-box-width-property",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "CSS에서 box-sizing 속성을 border-box로 설정했을 때 나타나는 동작 특징으로 옳은 것은?",
      options: [
        "padding과 border를 늘릴수록 상자의 전체 외형 크기가 바깥으로 커진다.",
        "width 속성을 설정해도 브라우저가 이를 무시하고 자동으로 크기를 정한다.",
        "margin 영역까지 width 안에 포함하여 요소의 전체 크기를 계산한다.",
        "지정한 width 안에 padding과 border가 포함되어 전체 크기가 유지된다."
      ],
      answer: 3,
      explanation: "border-box는 설정한 width 값 안에 padding과 border가 모두 포함되므로 내부 여백을 늘려도 상자 전체 크기가 커지지 않습니다[cite: 2].",
      hint: "지정한 너비 안에 테두리와 패딩이 포함되는 상자 모델입니다."
    },

    // 5. content-box 너비 계산 (객관식)
    {
      id: "mock1-005-content-box-width-calc",
      conceptId: "content-box-element-width",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "box-sizing: content-box인 요소의 width가 150px, 좌우 padding이 각각 10px, 좌우 border가 각각 2px일 때 테두리 포함 너비는?",
      options: [
        "150px",
        "174px",
        "162px",
        "184px"
      ],
      answer: 1,
      explanation: "전체 너비 = width(150px) + 좌우 padding(20px) + 좌우 border(4px) = 174px 입니다[cite: 2].",
      hint: "150 + 20 + 4 를 계산하세요."
    },

    // 6. position: absolute와 문서 흐름 (객관식)
    {
      id: "mock1-006-position-absolute-flow",
      conceptId: "position-absolute-normal-flow",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "CSS에서 position: absolute가 적용된 요소의 배치 특성으로 가장 올바른 것은?",
      options: [
        "Normal flow에 남아 원래 자신이 차지하던 공간을 그대로 유지한다.",
        "항상 브라우저 화면의 뷰포트(viewport)를 기준으로 위치가 고정된다.",
        "top, left 등의 위치 오프셋 속성을 적용해도 위치가 변경되지 않는다.",
        "Normal flow에서 제거되며 static이 아닌 가장 가까운 조상을 기준으로 배치된다."
      ],
      answer: 3,
      explanation: "absolute는 요소를 일반적인 문서 흐름(Normal flow)에서 완전히 제거하고, static이 아닌 가장 가까운 위치 지정 조상 요소를 기준으로 위치를 잡습니다[cite: 3].",
      hint: "일반 흐름에서 벗어나 기준이 되는 조상 요소를 찾는 특성입니다."
    },

    // 7. inline과 block 요소 (객관식)
    {
      id: "mock1-007-inline-block-differences",
      conceptId: "block-element-characteristics",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "HTML 요소의 기본 박스 타입 중 block 요소의 대표적인 특징으로 옳은 것은?",
      options: [
        "일반적인 흐름에서 새 줄에 배치되며 너비가 auto이면 사용 가능한 가로 공간을 채운다.",
        "줄 바꿈 없이 텍스트 흐름에 따라 콘텐츠 너비만큼만 영역을 차지한다.",
        "width와 height 속성을 지정해도 요소 크기에 전혀 반영되지 않는다.",
        "상하 마진(margin-top, margin-bottom)이 다른 요소를 밀어낼 수 없다."
      ],
      answer: 0,
      explanation: "block 요소는 일반적인 문서 흐름에서 항상 새로운 줄에 배치되며, width가 auto이면 부모 요소의 사용 가능한 가로 공간을 채웁니다[cite: 3].",
      hint: "책의 문단처럼 한 줄 전체를 차지하는 덩어리 요소입니다."
    },

    // 8. position: fixed (단답형)
    {
      id: "mock1-008-position-fixed-keyword",
      conceptId: "position-fixed-viewport",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "short-answer",
      prompt: "요소를 일반적인 문서 흐름에서 제거하고, 화면을 스크롤하더라도 브라우저 뷰포트(viewport)의 특정 위치에 고정시키는 position 속성값을 영문 소문자로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["fixed"],
      explanation: "position: fixed는 Normal flow에서 벗어나 화면 표시 영역인 뷰포트(viewport)를 기준으로 고정 배치됩니다[cite: 3].",
      hint: "화면 뷰포트에 요소를 단단히 고정시키는 영단어입니다."
    },

    // 9. Flex 주축 정렬 (객관식)
    {
      id: "mock1-009-flex-main-axis-align",
      conceptId: "justify-content-main-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flex 컨테이너에서 주 축(main axis)을 따라 아이템들을 정렬하고 간격을 분배하는 속성은?",
      options: [
        "align-items",
        "flex-direction",
        "justify-content",
        "align-content"
      ],
      answer: 2,
      explanation: "justify-content는 주 축 방향으로 아이템들의 시작점, 중앙, 양 끝 정렬 및 균등 간격 분배를 담당합니다[cite: 3].",
      hint: "주 축을 따라 공간을 분배하고 정렬하는 속성입니다."
    },

    // 10. Bootstrap Grid gutter (객관식)
    {
      id: "mock1-010-bootstrap-grid-gutter",
      conceptId: "bootstrap-grid-gutter-spacing",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap Grid 시스템에서 컬럼 사이의 간격을 제어하는 Gutter에 대한 설명으로 옳은 것은?",
      options: [
        "Gutter는 오직 컬럼의 외곽선(border) 두께만을 조절하는 속성이다.",
        "gx-0 클래스를 적용하면 행 사이의 세로 여백만 선택적으로 제거된다.",
        "컬럼의 좌우 padding으로 가로 간격을, 위쪽 margin으로 세로 간격을 구성한다.",
        "Gutter의 간격 값은 브라우저 너비와 상관없이 항상 음수로만 설정된다."
      ],
      answer: 2,
      explanation: "Bootstrap의 Gutter는 컬럼 간 여백으로, 좌우 padding을 통해 가로 간격을 구성하고 위쪽 margin을 통해 세로 간격을 제어합니다[cite: 1].",
      hint: "컬럼 간 여백을 의미하며 x축과 y축 여백 처리 방식을 생각해보세요."
    },

    // 11. Reset CSS (서술형) - [수정 완료: 동의어 묶음 및 채점 기준 분리]
    {
      id: "mock1-011-reset-css-purpose-essay",
      conceptId: "reset-css-core-goal",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "essay",
      prompt: "웹 개발 시 Reset CSS를 적용하는 주된 목적과 그 필요성을 서술하시오. (30자 이상 작성)",
      options: [],
      answer: null,
      modelAnswer: "브라우저마다 서로 다르게 내장된 기본 스타일(User Agent Stylesheet)을 초기화하여, 모든 브라우저 환경에서 동일하고 일관된 디자인 레이아웃을 구현하기 위함이다.",
      rubricKeywords: [
        "기본 스타일 (또는 User Agent Stylesheet)",
        "초기화 (또는 제거/재설정)",
        "일관성 (또는 동일/크로스 브라우징)"
      ],
      minLength: 30,
      explanation: "각 브라우저의 기본 스타일(User Agent Stylesheet) 차이점을 초기화하여 모든 브라우저에서 일관된 스타일링 기준을 확보하기 위해 적용합니다[cite: 4].",
      hint: "브라우저별 기본 스타일 차이 해소와 화면 일관성 확보를 중심으로 작성하세요."
    },

    // 12. CSS 상속 속성 (객관식)
    {
      id: "mock1-012-css-inheritance-properties",
      conceptId: "css-inheritable-properties",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "부모 요소에 적용했을 때 자식 요소에게 기본적으로 상속(Inherit)되는 CSS 속성은?",
      options: [
        "margin",
        "color",
        "border",
        "padding"
      ],
      answer: 1,
      explanation: "color, font 등 텍스트 관련 속성은 자식에게 상속되지만, margin, padding, border 등 박스 모델 관련 속성은 상속되지 않습니다[cite: 2].",
      hint: "글자 모양이나 색상과 관련된 텍스트 속성을 골라보세요."
    },

    // 13. HTML5 시맨틱 태그 (객관식)
    {
      id: "mock1-013-html5-semantic-tags",
      conceptId: "html5-semantic-header",
      difficulty: "easy",
      category: "HTML",
      questionType: "multiple-choice",
      prompt: "HTML5에서 사이트 로고, 검색창, 최상위 제목 등 웹 페이지의 머리말 구획을 정의하는 태그는?",
      options: [
        "<header>",
        "<aside>",
        "<footer>",
        "<section>"
      ],
      answer: 0,
      explanation: "<header>는 소개 및 탐색을 돕는 콘텐츠가 들어가는 머리말 구획을 정의하는 시맨틱 태그입니다[cite: 4].",
      hint: "머리말 영역을 의미하는 태그입니다."
    },

    // 14. Bootstrap 반응형 Grid (객관식)
    {
      id: "mock1-014-bootstrap-responsive-grid",
      conceptId: "bootstrap-grid-breakpoint-md",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap 5 Grid 시스템에서 화면 너비 768px 이상(태블릿 크기)을 나타내는 중단점 접두사는?",
      options: [
        "sm",
        "lg",
        "xl",
        "md"
      ],
      answer: 3,
      explanation: "Bootstrap에서 768px 이상은 md(Medium), 576px 이상은 sm, 992px 이상은 lg입니다[cite: 1].",
      hint: "중간 크기(Medium)를 의미하는 2글자 접두사입니다."
    },

    // 15. Bootstrap 버튼 (객관식)
    {
      id: "mock1-015-bootstrap-button-classes",
      conceptId: "bootstrap-btn-primary-class",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap에서 기본 테마 색상(파란색 계열)을 가진 버튼을 만들기 위한 클래스 조합은?",
      options: [
        "button button-blue",
        "btn btn-primary",
        "btn btn-success",
        "btn-danger btn-lg"
      ],
      answer: 1,
      explanation: "Bootstrap의 버튼은 기본 버튼 클래스 .btn과 테마 색상 클래스 .btn-primary를 결합하여 작성합니다[cite: 4].",
      hint: "버튼 기본 클래스 btn과 기본 테마 색상 클래스의 조합입니다."
    },

    // 16. Bootstrap Spacing (단답형)
    {
      id: "mock1-016-bootstrap-spacing-syntax",
      conceptId: "bootstrap-spacing-classes",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "short-answer",
      prompt: "Bootstrap 5에서 요소의 바깥 여백 중 위쪽 여백(margin-top)을 1rem(3단위)으로 설정하는 클래스명을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["mt-3"],
      explanation: "margin은 m, top은 t, 크기 1rem은 3단위이므로 mt-3이 올바른 클래스명입니다[cite: 4].",
      hint: "margin(m)과 top(t)의 조합입니다."
    },

    // 17. Bootstrap Grid 컬럼 배치 (객관식)
    {
      id: "mock1-017-bootstrap-grid-columns",
      conceptId: "bootstrap-grid-twelve-columns",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap Grid에서 1개의 row 안에 동일한 크기의 컬럼 4개를 나란히 배치할 때 각 컬럼의 클래스는?",
      options: [
        "col-4",
        "col-6",
        "col-3",
        "col-2"
      ],
      answer: 2,
      explanation: "Bootstrap 한 행은 총 12칸이므로, 4개의 균등 컬럼으로 나누려면 12 / 4 = 3칸씩 차지하는 col-3을 지정해야 합니다[cite: 1].",
      hint: "12를 4로 나눈 값을 생각해보세요."
    },

    // 18. 요소 숨기기 (객관식)
    {
      id: "mock1-018-hiding-elements",
      conceptId: "display-none-layout-removal",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "웹 페이지에서 요소를 화면에 보이지 않게 감추면서 레이아웃 공간조차 아예 남기지 않도록 하는 속성은?",
      options: [
        "display: none",
        "opacity: 0",
        "visibility: hidden",
        "position: relative"
      ],
      answer: 0,
      explanation: "display: none은 요소를 화면에 렌더링하지 않으며 공간 자체를 아예 차지하지 않도록 만듭니다[cite: 3].",
      hint: "요소의 공간까지 완전히 없애는 display 속성 값입니다."
    },

    // 19. content-box 구성 요소 (객관식)
    {
      id: "mock1-019-box-model-components",
      conceptId: "box-model-four-layers",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "CSS Box Model을 가장 안쪽부터 가장 바깥쪽 순서로 올바르게 나열한 것은?",
      options: [
        "Content -> Border -> Padding -> Margin",
        "Padding -> Content -> Border -> Margin",
        "Margin -> Border -> Padding -> Content",
        "Content -> Padding -> Border -> Margin"
      ],
      answer: 3,
      explanation: "박스 모델은 실제 내용(Content), 안쪽 여백(Padding), 테두리(Border), 바깥 여백(Margin) 순서로 구성됩니다[cite: 2].",
      hint: "내용에서 출발해 테두리를 지나 바깥 여백으로 이어지는 순서입니다."
    },

    // 20. CSS 캐스케이드 (객관식)
    {
      id: "mock1-020-css-cascade-rules",
      conceptId: "cascade-source-order-rule",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "동일한 요소에 동일한 명시도를 가진 CSS 스타일 선언이 충돌할 때 적용되는 결정 기준은?",
      options: [
        "속성 이름의 알파벳 순서가 가장 빠른 선언이 우선된다.",
        "스타일시트 상에서 가장 마지막(아래)에 작성된 선언이 우선된다.",
        "속성에 부여된 값의 글자 수가 가장 긴 선언이 우선된다.",
        "HTML 파일의 가장 첫 번째 줄에 쓰인 스타일이 우선된다."
      ],
      answer: 1,
      explanation: "Cascade 규칙에 따라 명시도가 같을 때는 코드에서 더 나중에 선언된 규칙이 이전 규칙을 덮어씁니다[cite: 2].",
      hint: "동일한 조건에서는 나중에 선언된 규칙이 덮어씌워집니다."
    },

    // 21. flex-grow 공간 분배 (서술형) - [수정 완료: 정답 노출 방지 및 조건 명확화]
    {
      id: "mock1-021-flex-grow-space-distribution-essay",
      conceptId: "flex-grow-calculation",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "essay",
      prompt: "너비 500px인 Flex 컨테이너에 기본 너비(flex-basis)가 각각 100px이고 gap, padding, border가 없는 두 아이템 A, B가 있다. item A의 flex-grow가 1, item B의 flex-grow가 2일 때, item A의 최종 너비와 그 계산 과정을 서술하시오. (30자 이상 작성)",
      options: [],
      answer: null,
      modelAnswer: "컨테이너 너비 500px에서 두 아이템 기본 너비 합인 200px을 제외한 남은 공간은 300px이다. flex-grow 비율 1:2에 따라 item A에 300px의 1/3인 100px이 배분되므로, 최종 너비는 기본 100px에 100px을 더한 200px이다.",
      rubricKeywords: [
        "남은 공간 300px",
        "비율 1:2 (또는 1/3)",
        "100px 배분",
        "최종 너비 200px"
      ],
      minLength: 30,
      explanation: "남은 공간(500px - 200px = 300px)을 flex-grow 비율인 1:2로 나누어 item A에 100px을 가산하므로 최종 너비는 200px이 됩니다[cite: 3].",
      hint: "남은 여백(300px)을 계산하고 flex-grow 비율에 맞게 배분하는 과정을 서술하세요."
    },

    // 22. z-index와 position (객관식)
    {
      id: "mock1-022-z-index-position-requirement",
      conceptId: "z-index-non-static-condition",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "일반적인 블록 요소에서 z-index 속성을 통해 요소의 쌓임 순서를 조절하기 위한 위치 지정 조건은?",
      options: [
        "요소의 display 속성이 반드시 inline이어야 한다.",
        "요소에 고정된 width와 height가 지정되어 있어야 한다.",
        "position 속성을 static이 아닌 relative, absolute, fixed 등으로 지정해야 한다.",
        "부모 요소의 z-index가 자식보다 무조건 작아야 한다."
      ],
      answer: 2,
      explanation: "일반적인 흐름에서 z-index는 position 속성이 static이 아닌 relative, absolute, fixed, sticky 요소에 적용됩니다[cite: 3].",
      hint: "기본 정적 위치(static)가 아닌 위치 지정 방식에서만 z-index가 동작합니다."
    },

    // 23. position 기준점 (객관식)
    {
      id: "mock1-023-position-relative-origin",
      conceptId: "position-relative-reference-point",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "position: relative가 설정된 요소가 상하좌우로 이동할 때 기준이 되는 위치는?",
      options: [
        "요소 자신이 일반 흐름(Normal flow)에서 원래 배치되었어야 할 자리",
        "현재 브라우저 화면의 뷰포트(viewport) 왼쪽 상단 모서리",
        "HTML 문서의 최상단 루트 태그인 <html>의 시작점",
        "부모 요소 중 가장 큰 z-index 값을 가진 요소의 위치"
      ],
      answer: 0,
      explanation: "relative는 자신이 원래 Normal flow에 따라 배치되어야 할 위치(static 자리)를 기준으로 이동합니다[cite: 3].",
      hint: "자기 자신의 원래 기본 위치를 기준으로 삼습니다."
    },

    // 24. CSS 상대 단위 (단답형)
    {
      id: "mock1-024-css-relative-units",
      conceptId: "rem-root-element-reference",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "short-answer",
      prompt: "부모 요소가 아닌 최상위 루트 요소(<html>)의 font-size를 기준으로 크기를 계산하는 CSS 상대 단위의 명칭을 영문 소문자로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["rem"],
      explanation: "rem(Root em)은 부모가 아닌 최상위 루트 태그(html)의 글자 크기를 기준으로 크기가 결정되는 단위입니다[cite: 2].",
      hint: "Root의 머리글자 r이 붙은 상대 단위입니다."
    },

    // 25. position 속성 값 (객관식)
    {
      id: "mock1-025-position-sticky-behavior",
      conceptId: "position-sticky-threshold",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "스크롤하기 전에는 일반 위치에 있다가, 스크롤이 임계점에 도달하면 화면에 고정되는 position 값은?",
      options: [
        "static",
        "sticky",
        "absolute",
        "relative"
      ],
      answer: 1,
      explanation: "sticky는 평소에는 relative처럼 동작하다가 특정 스크롤 임계점에 닿으면 fixed처럼 고정되는 속성입니다[cite: 3].",
      hint: "끈적하게 붙는다는 의미의 position 속성 값입니다."
    },

    // 26. CSS 선택자 우선순위 (객관식)
    {
      id: "mock1-026-selector-specificity-priority",
      conceptId: "css-selector-priority-id",
      difficulty: "easy",
      category: "CSS Selector",
      questionType: "multiple-choice",
      prompt: "다음 기본 CSS 선택자 중 스타일 적용 우선순위(명시도 점수)가 가장 높은 선택자는?",
      options: [
        "전체 선택자 (*)",
        "태그 선택자 (div)",
        "클래스 선택자 (.item)",
        "ID 선택자 (#header)"
      ],
      answer: 3,
      explanation: "선택자 명시도는 ID 선택자(100점) > 클래스 선택자(10점) > 태그 선택자(1점) > 전체 선택자(0점) 순입니다[cite: 2].",
      hint: "단 하나의 고유 요소를 지정하는 선택자의 점수가 가장 높습니다."
    },

    // 27. Flex 여러 줄 정렬 (객관식)
    {
      id: "mock1-027-flex-multi-line-align",
      conceptId: "align-content-multi-line",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "flex-wrap: wrap으로 인해 여러 줄로 늘어선 Flex 아이템 행들 간의 교차축 간격을 정렬하는 속성은?",
      options: [
        "align-content",
        "justify-content",
        "flex-direction",
        "align-self"
      ],
      answer: 0,
      explanation: "align-content는 아이템이 여러 줄로 래핑되었을 때 줄들 사이의 교차축 간격과 정렬을 제어합니다[cite: 3].",
      hint: "아이템 개별이 아닌 여러 줄(행) 전체의 교차축 간격을 제어하는 속성입니다."
    },

    // 28. 시맨틱 태그와 검색 엔진 (서술형) - [수정 완료: SEO/스크린 리더 대체 표현 허용]
    {
      id: "mock1-028-semantic-tag-seo-benefits-essay",
      conceptId: "semantic-html-seo-accessibility",
      difficulty: "easy",
      category: "HTML",
      questionType: "essay",
      prompt: "웹 페이지 제작 시 <div> 대신 시맨틱 태그(Semantic Tag)를 사용했을 때 얻을 수 있는 이점을 검색 엔진과 보조 기기(스크린 리더) 관점에서 서술하시오. (30자 이상 작성)",
      options: [],
      answer: null,
      modelAnswer: "시맨틱 태그는 콘텐츠의 구조와 역할을 명확히 하여 검색 엔진의 색인을 돕는 검색 엔진 최적화(SEO)에 유리하며, 스크린 리더 등 보조 기기가 웹 문서를 정확히 인식할 수 있게 하여 웹 접근성을 향상시킨다.",
      rubricKeywords: [
        "SEO (또는 검색 엔진 최적화)",
        "스크린 리더 (또는 보조 기기)",
        "웹 접근성",
        "구조 (또는 의미 전달)"
      ],
      minLength: 30,
      explanation: "시맨틱 태그는 문서의 구조적 의미를 명확히 하여 검색 엔진 크롤러의 색인 효율(SEO)을 극대화하고, 보조 기기 사용자의 웹 접근성을 높여줍니다[cite: 4].",
      hint: "SEO와 스크린 리더를 통한 웹 접근성 향상 관점을 포함해 30자 이상 서술하세요."
    },

    // 29. CSS 방법론 (단답형)
    {
      id: "mock1-029-oocss-methodology",
      conceptId: "oocss-core-principles",
      difficulty: "easy",
      category: "CSS Architecture",
      questionType: "short-answer",
      prompt: "구조와 스킨의 분리, 컨테이너와 콘텐츠의 분리를 2대 원칙으로 삼아 객체 지향적 접근법을 적용한 CSS 방법론의 영문 약어를 대문자로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["OOCSS"],
      explanation: "OOCSS(Object Oriented CSS)는 재사용성과 유지보수성을 극대화하기 위해 구조와 외형(스킨), 컨테이너와 내용을 분리합니다[cite: 4].",
      hint: "Object Oriented CSS의 영문 약어 5글자입니다."
    },

    // 30. Flex 개별 아이템 정렬 (객관식)
    {
      id: "mock1-030-flex-individual-item-align",
      conceptId: "align-self-individual-override",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "부모 컨테이너의 align-items 설정을 덮어쓰고 특정 Flex 아이템 하나만 교차축 정렬을 바꿀 때 쓰는 속성은?",
      options: [
        "align-content",
        "justify-content",
        "align-self",
        "flex-grow"
      ],
      answer: 2,
      explanation: "align-self는 개별 Flex 아이템에 직접 지정하여 부모의 align-items 값을 재정의할 수 있는 속성입니다[cite: 3].",
      hint: "자기 자신(self)만을 정렬하는 속성입니다."
    },

    // 31. Flex 주축과 교차축 (객관식)
    {
      id: "mock1-031-flex-axes-direction",
      conceptId: "flex-direction-column-main-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "CSS Flexbox에서 flex-direction 속성을 column으로 지정했을 때 주 축(main axis)의 방향은?",
      options: [
        "왼쪽에서 오른쪽으로 향하는 가로 방향",
        "위에서 아래로 향하는 세로 방향",
        "오른쪽에서 왼쪽으로 향하는 가로 방향",
        "대각선 45도 방향으로 뻗는 사선 방향"
      ],
      answer: 1,
      explanation: "flex-direction은 주 축의 방향을 설정하며, column 값은 세로 방향(위에서 아래)을 주 축으로 만듭니다[cite: 3].",
      hint: "열(column) 방향이 주 축이 되므로 수직 방향을 뜻합니다."
    },

    // 32. CSS 명시도 (객관식) - [수정 완료: 0번 편중 방지 및 복합 선택자 가중치 비교]
    {
      id: "mock1-032-css-compound-specificity",
      conceptId: "compound-selector-specificity-comparison",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "동일한 요소를 대상으로 충돌할 때, 명시도(Specificity) 점수가 가장 높아 최종 적용되는 선택자는?",
      options: [
        "body header nav ul li a",
        ".header .nav .menu a",
        "div.container ul.nav li",
        "#main .card p"
      ],
      answer: 3,
      explanation: "#main .card p는 ID 1개(100점) + 클래스 1개(10점) + 태그 1개(1점)로 총 111점의 가장 높은 명시도를 갖습니다[cite: 2].",
      hint: "선택자 목록 중 ID 선택자(#)가 포함된 규칙의 가중치를 계산해보세요."
    }
  ],
  medium: [],
  hard: [],
  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();