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
    // Web 과목평가 대비 모의고사 2회차 (총 32문항)
    // 출제 토픽 1번 ~ 32번 1:1 매칭 완료
    // 구성: 객관식 24문항, 단답형 5문항, 서술형 3문항
    // 객관식 정답 분포: 0번(6개), 1번(6개), 2번(6개), 3번(6개) 완전 균등 분산
    // =========================================================================

    // 1. Flex 교차축 정렬 (객관식)
    {
      id: "mock2-001-flex-cross-axis-align",
      conceptId: "flex-align-items-cross-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flexbox 컨테이너에서 아이템들이 교차축의 시작점(상단)에 맞춰 정렬되도록 지정할 때 사용하는 선언은?",
      options: [
        "justify-content: flex-start;",
        "align-items: flex-start;",
        "flex-direction: column;",
        "align-content: stretch;"
      ],
      answer: 1,
      explanation: "align-items는 교차축 정렬을 제어하며 flex-start는 교차축 시작점에 아이템들을 정렬합니다[cite: 3]. justify-content는 주축 정렬 속성입니다[cite: 3].",
      hint: "주축 정렬이 아닌 교차축 정렬 속성을 떠올려보세요."
    },

    // 2. Box Model 너비 계산 (객관식)
    {
      id: "mock2-002-box-model-width-calc",
      conceptId: "box-model-width-calculation",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "box-sizing: content-box가 적용된 요소에 width: 260px, padding: 15px, border: 4px solid black, margin: 20px를 지정했을 때 테두리를 포함한 실제 요소의 가로 너비는?",
      options: [
        "260px",
        "290px",
        "338px",
        "298px"
      ],
      answer: 3,
      explanation: "content-box에서 테두리 포함 너비는 width(260px) + padding 좌우(30px) + border 좌우(8px) = 298px 입니다[cite: 2]. margin은 외부 간격이므로 요소 너비에 포함되지 않습니다[cite: 2].",
      hint: "content-box에서는 콘텐츠 너비에 패딩과 테두리의 좌우 크기를 모두 더합니다."
    },

    // 3. 자손·자식 선택자 (단답형)
    {
      id: "mock2-003-child-selector-symbol",
      conceptId: "child-combinator-syntax",
      difficulty: "easy",
      category: "CSS Selector",
      questionType: "short-answer",
      prompt: "CSS 선택자에서 부모 요소의 직계 자식만을 선택할 때 사용하는 '자식 결합자' 기호(특수문자 1글자)를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: [">"],
      explanation: "자식 결합자(>)는 바로 아래 단계의 직계 자식만 선택하며, 공백(스페이스)은 하위의 모든 자손 요소를 선택합니다[cite: 2].",
      hint: "꺾쇠 모양의 특수문자 1글자입니다."
    },

    // 4. box-sizing별 요소 너비 (객관식)
    {
      id: "mock2-004-box-sizing-width-behavior",
      conceptId: "border-box-width-property",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "CSS에서 box-sizing: border-box를 적용했을 때 요소 크기 계산 방식에 대한 설명으로 옳은 것은?",
      options: [
        "지정한 width 안에 padding과 border가 포함되어 상자 크기가 유지된다.",
        "지정한 width 바깥으로 padding과 border가 더해져 상자 크기가 커진다.",
        "width 속성에 margin 영역까지 모두 포함되어 요소의 크기가 결정된다.",
        "width와 height 속성을 지정하더라도 브라우저가 크기를 무시한다."
      ],
      answer: 0,
      explanation: "border-box 모델은 지정한 width와 height 안에 padding과 border를 포함하여 계산하므로 여백을 추가해도 전체 상자 크기가 늘어나지 않습니다[cite: 2].",
      hint: "지정한 너비 안에 테두리와 패딩이 포함되는 상자 모델입니다."
    },

    // 5. content-box 너비 계산 (단답형) - [수정: 불필요한 '숫자만' 제약 삭제]
    {
      id: "mock2-005-content-box-width-calc",
      conceptId: "content-box-element-width",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "short-answer",
      prompt: "box-sizing: content-box인 박스에 width: 180px, 좌우 padding: 15px, 좌우 border: 2px를 설정했을 때, 테두리를 포함한 실제 요소의 가로 너비를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["214", "214px"],
      explanation: "180px(content) + 30px(좌우 padding) + 4px(좌우 border) = 214px 입니다[cite: 2].",
      hint: "180 + 30 + 4 를 계산하세요."
    },

    // 6. position: absolute와 문서 흐름 (객관식)
    {
      id: "mock2-006-position-absolute-flow",
      conceptId: "position-absolute-normal-flow",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "특정 요소에 position: absolute를 지정했을 때 일반적인 문서 흐름(Normal flow)에 미치는 영향으로 옳은 것은?",
      options: [
        "원래 자신이 차지하던 공간을 그대로 유지하여 형제 요소의 위치가 변하지 않는다.",
        "화면을 스크롤하더라도 항상 브라우저 뷰포트의 특정 좌표에 고정되어 머무른다.",
        "문서 흐름에서 완전히 제거되어 해당 요소가 차지하던 빈 공간이 사라진다.",
        "부모 컨테이너의 가로 너비 전체를 차지하도록 자동으로 영역이 확장된다."
      ],
      answer: 2,
      explanation: "absolute 요소는 Normal flow에서 완전히 제거되므로 원래 차지하던 공간이 사라져 뒤따르는 요소들이 그 자리를 채우게 됩니다[cite: 3].",
      hint: "일반 흐름에서 벗어나 기준이 되는 조상 요소를 찾는 특성입니다."
    },

    // 7. inline과 block 요소 (객관식)
    {
      id: "mock2-007-inline-block-differences",
      conceptId: "block-element-characteristics",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "HTML에서 span이나 a와 같은 인라인(inline) 요소의 고유한 레이아웃 특징으로 옳은 것은?",
      options: [
        "줄 바꿈 없이 텍스트 흐름에 배치되며 width와 height를 직접 줄 수 없다.",
        "항상 새로운 행에서 시작하며 부모 요소의 사용 가능한 가로 공간을 채운다.",
        "상하좌우 모든 방향의 margin이 다른 인접 요소들을 사방으로 밀어낸다.",
        "내부에 div나 p와 같은 블록 요소를 구조적으로 감싸서 배치할 수 있다."
      ],
      answer: 0,
      explanation: "inline 요소는 줄 바꿈이 발생하지 않고 콘텐츠 크기만큼만 차지하며, width와 height를 지정할 수 없습니다[cite: 3].",
      hint: "책의 문단처럼 한 줄 전체를 차지하는 덩어리 요소인지 흐름 요소인지 비교해보세요."
    },

    // 8. position: fixed (객관식)
    {
      id: "mock2-008-position-fixed",
      conceptId: "position-fixed-viewport",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "웹 페이지 우측 하단의 '위로 가기' 버튼처럼 스크롤을 움직여도 항상 화면의 고정된 자리에 노출시킬 때 사용하는 position 속성값은?",
      options: [
        "static",
        "relative",
        "absolute",
        "fixed"
      ],
      answer: 3,
      explanation: "position: fixed는 요소를 문서 흐름에서 제거하고 브라우저 화면의 뷰포트(viewport)를 기준으로 고정 배치합니다[cite: 3].",
      hint: "화면 뷰포트에 요소를 단단히 고정시키는 영단어입니다."
    },

    // 9. Flex 주축 정렬 (객관식)
    {
      id: "mock2-009-flex-main-axis-align",
      conceptId: "justify-content-main-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flexbox에서 첫 번째 아이템은 주축의 시작점에, 마지막 아이템은 끝점에 붙이고 나머지 여백을 아이템 사이에 균등 분배하는 정렬 값은?",
      options: [
        "space-around",
        "space-between",
        "space-evenly",
        "center"
      ],
      answer: 1,
      explanation: "justify-content: space-between은 첫 아이템을 시작점에, 마지막 아이템을 끝점에 붙이고 아이템들 사이에만 동일한 간격을 배분합니다[cite: 3].",
      hint: "양 끝에 붙이고 아이템 사이에만 여백을 균등하게 분배하는 값입니다."
    },

    // 10. Bootstrap Grid gutter (단답형)
    {
      id: "mock2-010-bootstrap-grid-gutter",
      conceptId: "bootstrap-grid-gutter-spacing",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "short-answer",
      prompt: "Bootstrap 5 Grid 시스템에서 컬럼 사이의 '수평(가로) 여백'만을 0으로 만들어 완전히 제거하는 클래스명을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["gx-0"],
      explanation: "Bootstrap Grid에서 gx-0 클래스는 row 내부 컬럼들의 좌우 padding 여백(가로 gutter)을 제거합니다[cite: 1].",
      hint: "gutter의 g와 가로축 x, 크기 0의 조합입니다."
    },

    // 11. Reset CSS (서술형) - [수정: rubricKeywords 단일 핵심어 정제]
    {
      id: "mock2-011-reset-css-purpose-essay",
      conceptId: "reset-css-core-goal",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "essay",
      prompt: "웹 브라우저의 기본 스타일(User Agent Stylesheet)로 인해 발생할 수 있는 문제점을 설명하고, Reset CSS를 적용하는 이유를 서술하시오. (30자 이상 작성)",
      options: [],
      answer: null,
      modelAnswer: "브라우저마다 내장된 기본 스타일(User Agent Stylesheet)이 서로 달라 생기는 렌더링 불일치를 해결하기 위해, 모든 요소의 기본 스타일을 초기화하여 일관된 디자인 기준점을 확보하기 위함이다.",
      rubricKeywords: [
        "기본 스타일",
        "초기화",
        "일관성"
      ],
      minLength: 30,
      explanation: "각 브라우저의 기본 스타일(User Agent Stylesheet) 차이점을 초기화하여 모든 브라우저에서 일관된 스타일링 기준을 확보하기 위해 적용합니다[cite: 4].",
      hint: "브라우저별 기본 스타일 차이 해소와 화면 일관성 확보를 중심으로 작성하세요."
    },

    // 12. CSS 상속 속성 (객관식)
    {
      id: "mock2-012-css-inheritance-properties",
      conceptId: "css-inheritable-properties",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "다음 CSS 속성 중 부모 요소에 스타일을 부여했을 때 자식 요소에게 자동으로 상속(Inherit)되지 않는 것은?",
      options: [
        "font-size",
        "color",
        "border",
        "line-height"
      ],
      answer: 2,
      explanation: "font, color, line-height 등 텍스트 관련 속성은 자식에게 자동 상속되지만, border, margin, padding 등 박스 모델 관련 속성은 상속되지 않습니다[cite: 2].",
      hint: "글자 모양이나 색상과 관련된 텍스트 속성이 아닌 박스 모델 속성을 골라보세요."
    },

    // 13. HTML5 시맨틱 태그 (객관식)
    {
      id: "mock2-013-html5-semantic-tags",
      conceptId: "html5-semantic-nav",
      difficulty: "easy",
      category: "HTML",
      questionType: "multiple-choice",
      prompt: "HTML5 시맨틱 태그 중 사이트 내 다른 페이지나 외부 링크로 이동할 수 있는 내비게이션 링크 구획을 정의하는 태그는?",
      options: [
        "<nav>",
        "<header>",
        "<section>",
        "<aside>"
      ],
      answer: 0,
      explanation: "<nav> 태그는 다른 페이지로 연결되는 링크 목록이나 문서 내 이동을 위한 내비게이션 영역을 정의할 때 사용합니다[cite: 4].",
      hint: "내비게이션(Navigation)의 축약형 태그입니다."
    },

    // 14. Bootstrap 반응형 Grid (객관식)
    {
      id: "mock2-014-bootstrap-responsive-grid",
      conceptId: "bootstrap-grid-breakpoint-lg",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap 5 Grid 시스템의 중단점(Breakpoints) 중 화면 너비 992px 이상(데스크톱 환경)에 적용되는 클래스 접두사는?",
      options: [
        ".col-md-",
        ".col-lg-",
        ".col-xl-",
        ".col-sm-"
      ],
      answer: 1,
      explanation: "Bootstrap에서 576px 이상은 sm, 768px 이상은 md, 992px 이상은 lg, 1200px 이상은 xl입니다[cite: 1].",
      hint: "Large의 약어인 2글자 접두사입니다."
    },

    // 15. Bootstrap 버튼 (객관식)
    {
      id: "mock2-015-bootstrap-button-classes",
      conceptId: "bootstrap-btn-danger-class",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap에서 사용자에게 삭제나 에러 등 주의가 필요한 작업을 시각적으로 알리는 붉은색 테마 버튼 클래스 조합은?",
      options: [
        "btn btn-primary",
        "btn btn-warning",
        "button btn-red",
        "btn btn-danger"
      ],
      answer: 3,
      explanation: "Bootstrap에서 위험/에러를 나타내는 붉은색 테마 클래스는 .btn-danger이며, 기본 버튼 클래스 .btn과 함께 사용합니다[cite: 4].",
      hint: "위험이나 삭제를 뜻하는 영단어 클래스입니다."
    },

    // 16. Bootstrap Spacing (단답형)
    {
      id: "mock2-016-bootstrap-spacing-syntax",
      conceptId: "bootstrap-spacing-classes",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "short-answer",
      prompt: "Bootstrap 5에서 요소의 안쪽 여백(padding) 중 좌우 양쪽(x축) 여백을 1.5rem(4단위)으로 설정하는 클래스명을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["px-4"],
      explanation: "padding은 p, x축(좌우)은 x, 크기 1.5rem은 4단위이므로 px-4가 올바른 클래스명입니다[cite: 4].",
      hint: "padding(p)과 x축(x)의 조합입니다."
    },

    // 17. Bootstrap Grid 컬럼 배치 (객관식)
    {
      id: "mock2-017-bootstrap-grid-columns",
      conceptId: "bootstrap-grid-twelve-columns",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap Grid 시스템에서 1개의 row 안에 3개의 컬럼을 2 : 8 : 2 비율로 배치하고자 할 때 각 컬럼의 올바른 클래스 조합은?",
      options: [
        "col-3, col-6, col-3",
        "col-4, col-4, col-4",
        "col-2, col-8, col-2",
        "col-1, col-10, col-1"
      ],
      answer: 2,
      explanation: "Bootstrap의 한 행은 총 12칸이므로 2 + 8 + 2 = 12칸으로 정확히 채워집니다[cite: 1].",
      hint: "12칸을 2 : 8 : 2로 배분하는 클래스를 찾으세요."
    },

    // 18. 요소 숨기기 (객관식)
    {
      id: "mock2-018-hiding-elements",
      conceptId: "visibility-hidden-behavior",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "CSS에서 visibility: hidden을 적용했을 때 나타나는 브라우저 화면의 동작 방식으로 옳은 것은?",
      options: [
        "화면에서 보이지는 않지만 원래 차지하던 레이아웃 공간은 그대로 유지된다.",
        "화면에서 사라지고 차지하던 공간도 제거되어 뒤따르는 요소가 빈자리를 채운다.",
        "요소의 모든 텍스트가 투명해지며 배경 색상과 테두리는 그대로 남게 된다.",
        "해당 요소와 하위 자식 노드가 HTML 문서 트리(DOM)에서 완전히 삭제된다."
      ],
      answer: 0,
      explanation: "visibility: hidden은 요소의 시각적 렌더링만 감추고 원래 차지하던 공간은 그대로 보존합니다[cite: 3]. 공간까지 없애려면 display: none을 사용해야 합니다[cite: 3].",
      hint: "공간은 남아있는지 여부를 생각해보세요."
    },

    // 19. content-box 구성 요소 (객관식)
    {
      id: "mock2-019-box-model-components",
      conceptId: "box-model-margin-role",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "CSS 박스 모델의 구성 요소 중 '다른 인접 요소와의 외부 간격'을 지정하는 가장 바깥쪽 여백 영역의 명칭은?",
      options: [
        "padding",
        "margin",
        "border",
        "content"
      ],
      answer: 1,
      explanation: "박스 모델의 가장 바깥쪽에 위치하여 다른 요소와의 외부 거리를 유지하는 여백은 margin입니다[cite: 2].",
      hint: "박스 모델의 가장 외부에 위치한 여백입니다."
    },

    // 20. CSS 캐스케이드 (객관식) - [수정: 출처·중요도 동일 전제 명시]
    {
      id: "mock2-020-css-cascade-rules",
      conceptId: "cascade-source-order-rule",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "동일한 요소에 동일한 출처와 중요도, 그리고 동일한 명시도를 가진 CSS 스타일 선언이 충돌할 때 브라우저가 적용하는 캐스케이딩(Cascade) 규칙은?",
      options: [
        "속성명의 글자 수가 가장 긴 CSS 선언이 우선 적용된다.",
        "HTML 파일의 가장 위쪽에 연결된 스타일이 우선 적용된다.",
        "선택자 안에 선언된 속성의 개수가 더 많은 규칙이 우선된다.",
        "코드 상에서 가장 나중에(아래쪽에) 선언된 스타일이 우선 적용된다."
      ],
      answer: 3,
      explanation: "출처, 중요도, 명시도가 모두 동일할 경우 소스 코드 상에서 나중에 선언된(아래쪽에 위치한) 스타일이 이전 스타일을 덮어씁니다[cite: 2].",
      hint: "동일한 가중치일 때는 코드 작성 순서를 따릅니다."
    },

    // 21. flex-grow 공간 분배 (서술형) - [수정: 힌트 정답 노출 방지 및 rubricKeywords 정제]
    {
      id: "mock2-021-flex-grow-space-distribution-essay",
      conceptId: "flex-grow-calculation",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "essay",
      prompt: "너비 600px인 Flex 컨테이너 안에 기본 너비(flex-basis)가 각각 150px이고 마진, 패딩, 테두리가 없는 두 아이템 X, Y가 있다. item X의 flex-grow가 1, item Y의 flex-grow가 2일 때, item Y의 최종 너비와 계산 과정을 서술하시오. (30자 이상 작성)",
      options: [],
      answer: null,
      modelAnswer: "컨테이너 너비 600px에서 두 아이템 기본 너비 합 300px을 뺀 남은 공간은 300px이다. flex-grow 비율 1:2에 따라 item Y에 300px의 2/3인 200px이 배분되므로, 최종 너비는 기본 150px에 200px을 더한 350px이다.",
      rubricKeywords: [
        "300px",
        "1:2",
        "200px",
        "350px"
      ],
      minLength: 30,
      explanation: "남은 공간(600px - 300px = 300px)을 flex-grow 비율 1:2로 배분하여 item Y에 200px이 더해지므로 최종 350px이 됩니다[cite: 3].",
      hint: "기본 너비의 합을 컨테이너 너비에서 빼고, 남은 공간을 비율대로 배분하세요."
    },

    // 22. z-index와 position (객관식) - [수정: 질문 정밀화 및 모호성 제거]
    {
      id: "mock2-022-z-index-position-requirement",
      conceptId: "z-index-non-static-condition",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "일반적인 블록 요소에서 z-index 속성이 정상적으로 적용되기 위한 위치 지정 조건으로 옳은 것은?",
      options: [
        "display 속성을 inline-block으로 지정해야 한다.",
        "margin 또는 padding을 음수 값으로 지정해야 한다.",
        "position 속성을 static 이외의 값(relative, absolute 등)으로 지정해야 한다.",
        "float 속성을 left 또는 right로 설정해야 한다."
      ],
      answer: 2,
      explanation: "일반적인 흐름에서 z-index는 position 속성이 static이 아닌 relative, absolute, fixed, sticky 요소에 적용됩니다[cite: 3].",
      hint: "기본 정적 위치(static)가 아닌 위치 지정 방식에서만 z-index가 동작합니다."
    },

    // 23. position 기준점 (객관식)
    {
      id: "mock2-023-position-relative-origin",
      conceptId: "position-absolute-reference-point",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "자식 요소에 position: absolute를 지정했을 때, 이 자식 요소가 이동하는 기준이 되는 위치로 옳은 것은?",
      options: [
        "부모 요소의 위치와 관계없이 항상 브라우저 화면(viewport) 왼쪽 상단 모서리",
        "position 속성이 static이 아닌 값으로 지정된 가장 가까운 조상 요소",
        "HTML 문서 트리에서 가장 첫 번째로 선언된 body 태그의 우측 하단 모서리",
        "해당 요소가 일반 흐름(Normal flow)에서 원래 배치되었어야 할 시작 위치"
      ],
      answer: 1,
      explanation: "absolute 요소는 static이 아닌 position(relative, absolute, fixed 등)이 지정된 가장 가까운 조상 요소를 기준점으로 삼습니다[cite: 3].",
      hint: "조상 요소 중 static이 아닌 기준 요소를 찾습니다."
    },

    // 24. CSS 상대 단위 (객관식)
    {
      id: "mock2-024-css-relative-units",
      conceptId: "rem-root-element-reference",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "CSS 상대 단위 중 최상위 루트 태그인 <html>의 font-size(기본 16px)를 기준으로 크기를 결정하는 단위는?",
      options: [
        "rem",
        "em",
        "px",
        "%"
      ],
      answer: 0,
      explanation: "rem(Root em)은 부모가 아닌 최상위 루트 요소(html)의 글자 크기를 기준으로 삼아 중첩 시에도 계산이 안정적입니다[cite: 2].",
      hint: "Root em의 약어입니다."
    },

    // 25. position 속성 값 (객관식)
    {
      id: "mock2-025-position-sticky-behavior",
      conceptId: "position-sticky-threshold",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "스크롤 위치가 특정 임계점에 도달하기 전에는 relative처럼 움직이다가, 임계점에 도달하면 fixed처럼 화면에 고정되는 position 값은?",
      options: [
        "static",
        "absolute",
        "relative",
        "sticky"
      ],
      answer: 3,
      explanation: "position: sticky는 일반 문서 흐름을 유지하다가 스크롤이 임계점에 닿으면 지정된 오프셋 위치에 고정되는 속성입니다[cite: 3].",
      hint: "스크롤 임계점에 도달했을 때 달라붙는 속성입니다."
    },

    // 26. CSS 선택자 우선순위 (객관식)
    {
      id: "mock2-026-selector-specificity-priority",
      conceptId: "css-selector-priority-id",
      difficulty: "easy",
      category: "CSS Selector",
      questionType: "multiple-choice",
      prompt: "다음 CSS 선택자 중 스타일 적용 우선순위(명시도 점수)가 가장 높은 것은?",
      options: [
        "전체 선택자 (*)",
        "태그 선택자 (p)",
        "ID 선택자 (#header)",
        "클래스 선택자 (.title)"
      ],
      answer: 2,
      explanation: "선택자 명시도는 ID 선택자(100점) > 클래스 선택자(10점) > 태그 선택자(1점) > 전체 선택자(0점) 순서입니다[cite: 2].",
      hint: "단 하나의 고유 요소를 지정하는 선택자의 점수가 가장 높습니다."
    },

    // 27. Flex 여러 줄 정렬 (객관식)
    {
      id: "mock2-027-flex-multi-line-align",
      conceptId: "align-content-multi-line",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flex 컨테이너에서 아이템들이 여러 줄로 줄 바꿈되었을 때, 교차축을 따라 행(줄)들 간의 간격과 정렬을 제어하는 속성은?",
      options: [
        "align-content",
        "justify-content",
        "align-items",
        "flex-direction"
      ],
      answer: 0,
      explanation: "align-content는 flex-wrap: wrap 등으로 인해 아이템이 두 줄 이상 배치되었을 때 줄들 사이의 교차축 간격을 제어합니다[cite: 3].",
      hint: "개별 아이템이 아닌 여러 줄 전체의 교차축 간격을 조정하는 속성입니다."
    },

    // 28. 시맨틱 태그와 검색 엔진 (서술형) - [수정: rubricKeywords 단일 핵심어 정제]
    {
      id: "mock2-028-semantic-tag-seo-benefits-essay",
      conceptId: "semantic-html-seo-accessibility",
      difficulty: "easy",
      category: "HTML",
      questionType: "essay",
      prompt: "웹 문서 제작 시 단순 <div> 대신 <article>과 같은 시맨틱 태그를 사용할 때 얻을 수 있는 이점을 검색 엔진과 웹 접근성 관점에서 서술하시오. (30자 이상 작성)",
      options: [],
      answer: null,
      modelAnswer: "시맨틱 태그는 콘텐츠의 구조와 의미를 명확히 하여 검색 엔진 크롤러가 정보를 정확히 색인하도록 돕는 검색 엔진 최적화(SEO)에 유리하며, 스크린 리더 등 보조 기기가 콘텐츠를 올바르게 전달하여 웹 접근성을 향상시킨다.",
      rubricKeywords: [
        "SEO",
        "접근성",
        "의미"
      ],
      minLength: 30,
      explanation: "시맨틱 태그는 문서의 구조적 의미를 명확히 하여 검색 엔진 크롤러의 색인 효율(SEO)을 극대화하고, 보조 기기 사용자의 웹 접근성을 높여줍니다[cite: 4].",
      hint: "SEO와 스크린 리더를 통한 웹 접근성 향상 관점을 포함해 30자 이상 서술하세요."
    },

    // 29. CSS 방법론 (단답형)
    {
      id: "mock2-029-oocss-methodology",
      conceptId: "oocss-core-principles",
      difficulty: "easy",
      category: "CSS Architecture",
      questionType: "short-answer",
      prompt: "객체 지향적 접근법을 적용한 CSS 방법론인 OOCSS의 2대 원칙 중 하나는 '컨테이너와 콘텐츠의 분리'이다. 나머지 하나의 원칙인 '구조와 ○○의 분리'에서 빈칸에 들어갈 단어를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["스킨", "skin"],
      explanation: "OOCSS는 '구조와 스킨의 분리', '컨테이너와 콘텐츠의 분리'를 원칙으로 하여 스타일의 재사용성을 높입니다[cite: 4].",
      hint: "외형이나 색상 테마를 일컫는 단어입니다."
    },

    // 30. Flex 개별 아이템 정렬 (객관식)
    {
      id: "mock2-030-flex-individual-item-align",
      conceptId: "align-self-individual-override",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flex 컨테이너의 align-items: flex-start 설정을 무시하고 특정 아이템 1개만 교차축 중앙에 배치하고자 할 때 해당 아이템에 적용할 선언은?",
      options: [
        "justify-self: center;",
        "align-self: center;",
        "align-items: center;",
        "align-content: center;"
      ],
      answer: 1,
      explanation: "align-self는 개별 Flex 아이템에 직접 지정하여 부모 컨테이너의 align-items 설정을 재정의할 수 있습니다[cite: 3].",
      hint: "자기 자신만을 정렬하는 속성입니다."
    },

    // 31. Flex 주축과 교차축 (객관식)
    {
      id: "mock2-031-flex-axes-direction",
      conceptId: "flex-direction-column-main-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "CSS Flexbox에서 flex-direction: row일 때 주 축(main axis)과 교차 축(cross axis)의 방향에 대한 설명으로 옳은 것은?",
      options: [
        "주 축은 세로 방향이고 교차 축은 가로 방향이다.",
        "주 축과 교차 축 모두 세로 방향으로 정렬된다.",
        "주 축과 교차 축 모두 대각선 방향으로 배치된다.",
        "주 축은 가로 방향이고 교차 축은 세로 방향이다."
      ],
      answer: 3,
      explanation: "flex-direction의 기본값인 row는 아이템이 나열되는 주 축을 수평(가로) 방향으로 설정하며, 교차 축은 수직(세로) 방향이 됩니다[cite: 3].",
      hint: "row는 행(가로줄)을 의미합니다."
    },

    // 32. CSS 명시도 (객관식) - [수정: 직관적이고 정확한 질문 표현]
    {
      id: "mock2-032-css-compound-specificity",
      conceptId: "compound-selector-specificity-comparison",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "동일한 텍스트 요소에 다음 4개의 CSS 선택자가 적용될 때, 명시도(Specificity) 점수가 가장 낮은 것은?",
      options: [
        "#main .box p",
        ".box p",
        "p",
        "#main p"
      ],
      answer: 2,
      explanation: "p 태그 선택자는 명시도 1점으로, 클래스나 ID 선택자가 포함된 다른 복합 선택자들에 비해 가중치가 가장 낮습니다[cite: 2].",
      hint: "클래스나 ID 없이 단일 태그로만 구성된 선택자를 찾으세요."
    }
  ],
  medium: [],
  hard: [],
  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();