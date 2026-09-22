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
    // Web 과목평가 대비 모의고사 5회차 (총 32문항)
    // 출제 토픽 1번 ~ 32번 1:1 매칭 완료
    // 구성: 객관식 24문항, 단답형 5문항, 서술형 3문항 (다양한 서술 토픽 적용)
    // 객관식 정답 분포: 0번(6개), 1번(6개), 2번(6개), 3번(6개) 완전 균등 분산 배치
    // =========================================================================

    // 1. Flex 교차축 정렬 (객관식)
    {
      id: "mock5-001-flex-cross-axis-align",
      conceptId: "flex-align-items-cross-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "CSS Flexbox에서 교차축(cross axis) 정렬을 제어하는 align-items 속성의 값 중, 텍스트의 글꼴 베이스라인(기준선)에 맞추어 아이템들을 정렬할 때 사용하는 값은?",
      options: [
        "center",
        "baseline",
        "stretch",
        "flex-start"
      ],
      answer: 1,
      explanation: "align-items: baseline은 텍스트의 기준선(baseline)을 일치시켜 교차축 방향으로 정렬합니다[cite: 3].",
      hint: "아이템 내부 텍스트의 밑바닥 기준선에 맞추는 영단어입니다."
    },

    // 2. Box Model 너비 계산 (단답형)
    {
      id: "mock5-002-box-model-width-calc",
      conceptId: "box-model-width-calculation",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "short-answer",
      prompt: "box-sizing: content-box인 요소에 width: 120px, 좌우 padding이 각각 10px, 좌우 border가 각각 4px일 때, 테두리를 포함한 실제 상자의 가로 너비를 작성하시오. (px 단위 생략 가능)",
      options: [],
      answer: null,
      acceptedAnswers: ["148", "148px"],
      explanation: "120px(content) + 20px(좌우 padding) + 8px(좌우 border) = 148px 입니다[cite: 2].",
      hint: "120 + 20 + 8 을 계산하세요."
    },

    // 3. 자손·자식 선택자 (객관식)
    {
      id: "mock5-003-child-selector-syntax",
      conceptId: "child-combinator-syntax",
      difficulty: "easy",
      category: "CSS Selector",
      questionType: "multiple-choice",
      prompt: "다음 CSS 선택자 중 `.parent` 요소의 바로 아래 1단계 직계 자식인 `<li>` 태그만을 정확히 선택하는 결합자 표현은?",
      options: [
        ".parent li",
        ".parent + li",
        ".parent ~ li",
        ".parent > li"
      ],
      answer: 3,
      explanation: "직계 자식 결합자는 `>` 기호를 사용합니다[cite: 2]. 공백(스페이스)은 하위의 모든 자손 요소를 선택합니다[cite: 2].",
      hint: "꺾쇠 모양의 결합 기호를 고르세요."
    },

    // 4. box-sizing별 요소 너비 (서술형) - [신규 서술 토픽]
    {
      id: "mock5-004-box-sizing-width-behavior-essay",
      conceptId: "border-box-width-property",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "essay",
      prompt: "CSS Box Model에서 content-box와 border-box의 너비(width) 계산 방식 차이점을 설명하고, 실무 반응형 레이아웃에서 border-box를 선호하는 이유를 30자 이상으로 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "content-box는 지정한 너비에 패딩과 테두리가 외부에 더해져 상자가 커지지만, border-box는 지정한 너비 안에 패딩과 테두리가 포함되어 크기가 유지되므로 그리드 및 백분율 기반 레이아웃을 계산하고 관리하기 훨씬 쉽기 때문이다.",
      rubricKeywords: [
        "content-box",
        "border-box",
        "포함",
        "유지"
      ],
      minLength: 30,
      explanation: "content-box는 테두리/패딩이 외부에 가산되지만, border-box는 지정 너비 내부에 포함되므로 백분율 레이아웃 구성 시 줄 바꿈 깨짐을 방지합니다[cite: 2].",
      hint: "패딩과 테두리가 너비 외부에 더해지는지 내부에 포함되는지를 중심으로 서술하세요."
    },

    // 5. content-box 너비 계산 (객관식)
    {
      id: "mock5-005-content-box-width-calc",
      conceptId: "content-box-element-width",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "다음 스타일이 적용된 요소가 화면에서 차지하는 테두리 포함 실제 가로 너비(width)로 옳은 것은?\n\n.card {\n  box-sizing: content-box;\n  width: 280px;\n  padding: 15px 25px;\n  border: 5px solid gray;\n}",
      options: [
        "340px",
        "310px",
        "320px",
        "350px"
      ],
      answer: 0,
      explanation: "너비 = 280px(content) + 50px(좌우 padding) + 10px(좌우 border) = 340px 입니다[cite: 2]. (padding의 두 번째 값 25px가 좌우 여백)[cite: 2].",
      hint: "280 + (25 * 2) + (5 * 2) 를 계산하세요."
    },

    // 6. position: absolute와 문서 흐름 (서술형) - [신규 서술 토픽]
    {
      id: "mock5-006-position-absolute-flow-essay",
      conceptId: "position-absolute-normal-flow",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "essay",
      prompt: "일반 블록 요소에 position: absolute를 적용했을 때 일반 문서 흐름(Normal Flow)에서 발생하는 공간적 변화와, 해당 요소의 이동 기준점(기준 조상)이 결정되는 원리를 30자 이상으로 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "요소를 일반 문서 흐름에서 완전히 제거하여 기존 위치에 빈 공간을 남기지 않으며, position 속성이 static이 아닌 가장 가까운 위치 지정 조상 요소를 기준으로 좌표 오프셋이 결정된다.",
      rubricKeywords: [
        "제거",
        "static",
        "조상"
      ],
      minLength: 30,
      explanation: "absolute는 요소를 일반 흐름에서 제거해 자리를 비우며, static이 아닌 가장 가까운 조상 요소를 기준으로 배치됩니다[cite: 3].",
      hint: "기존 공간 소멸 여부와 static이 아닌 조상 요소를 기준으로 삼는 원리를 서술하세요."
    },

    // 7. inline과 block 요소 (객관식)
    {
      id: "mock5-007-inline-block-differences",
      conceptId: "block-element-characteristics",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "다음 중 HTML 요소의 화면 표시 방식(display)에 대한 설명으로 가장 적절한 것은?",
      options: [
        "inline 요소는 width와 height 속성을 지정하여 가로세로 크기를 자유롭게 변경할 수 있다.",
        "block 요소는 항상 줄 바꿈 없이 이전 요소의 바로 오른쪽에 나란히 배치된다.",
        "inline-block 요소는 줄 바꿈 없이 나란히 배치되면서도 width와 height로 크기를 제어할 수 있다.",
        "block 요소에 적용된 상하 margin은 인접 요소를 수직으로 밀어내지 못한다."
      ],
      answer: 2,
      explanation: "inline-block은 인라인처럼 수평으로 나열되면서도 블록처럼 가로/세로 크기 및 상하 마진을 자유롭게 설정할 수 있는 display 속성값입니다[cite: 3].",
      hint: "인라인의 줄 바꿈 없음과 블록의 크기 제어 특성을 동시에 가진 속성을 찾으세요."
    },

    // 8. position: fixed (객관식)
    {
      id: "mock5-008-position-fixed",
      conceptId: "position-fixed-viewport",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "position: fixed가 적용된 요소의 위치 기준점과 스크롤에 따른 동작 특성으로 옳은 것은?",
      options: [
        "자신의 원래 static 자리를 기준으로 이동하며 스크롤 시 함께 위로 올라간다.",
        "브라우저의 뷰포트(viewport)를 기준으로 배치되며 스크롤해도 화면의 동일한 위치에 고정된다.",
        "가장 가까운 relative 부모 요소를 기준으로 배치되며 스크롤 시 부모 안에서만 고정된다.",
        "항상 HTML 문서 전체의 절대 좌표 (0, 0)에 고정되어 뷰포트 밖으로 스크롤된다."
      ],
      answer: 1,
      explanation: "position: fixed는 일반 문서 흐름에서 벗어나 브라우저 화면 창인 뷰포트(viewport)를 기준으로 배치되어 스크롤해도 위치가 고정됩니다[cite: 3].",
      hint: "화면 뷰포트에 요소를 단단히 고정시키는 속성 특성을 고르세요."
    },

    // 9. Flex 주축 정렬 (단답형)
    {
      id: "mock5-009-flex-main-axis-align",
      conceptId: "justify-content-main-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "short-answer",
      prompt: "CSS Flexbox에서 주 축(main axis)을 따라 아이템들을 정렬하고 여백을 분배하는 CSS 속성명을 영문 소문자로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["justify-content"],
      explanation: "justify-content 속성은 주 축 방향으로 flex 아이템의 정렬 및 간격을 제어합니다[cite: 3].",
      hint: "주 축을 정렬하는 대표 속성명입니다."
    },

    // 10. Bootstrap Grid gutter (객관식)
    {
      id: "mock5-010-bootstrap-grid-gutter",
      conceptId: "bootstrap-grid-gutter-spacing",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap 5 Grid 시스템의 Gutter에 대한 설명으로 옳은 것은?",
      options: [
        "컬럼의 좌우 padding으로 가로 간격을, 상단 margin으로 세로 간격을 생성한다.",
        "Gutter는 컬럼의 테두리(border-width) 속성을 변경하여 간격을 조절한다.",
        "gy-* 클래스는 행 내부 컬럼들의 좌우 가로 여백만을 선택적으로 조정한다.",
        "Gutter 여백은 오직 데스크톱 화면에서만 적용되며 모바일에서는 자동으로 0이 된다."
      ],
      answer: 0,
      explanation: "Bootstrap Grid에서 Gutter는 컬럼의 좌우 padding으로 수평 간격을 만들고, 행 줄 바꿈 시 상단 margin을 통해 수직 간격을 형성합니다[cite: 1].",
      hint: "컬럼 내부의 padding과 margin을 활용한 여백 형성 방식을 떠올려보세요."
    },

    // 11. Reset CSS (객관식)
    {
      id: "mock5-011-reset-css-purpose",
      conceptId: "reset-css-core-goal",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "웹 프로젝트에서 Reset CSS 또는 Normalize CSS를 도입하여 얻을 수 있는 가장 주된 효과는?",
      options: [
        "모든 HTML 태그를 자동으로 시맨틱 태그로 치환하여 SEO를 개선한다.",
        "자바스크립트의 비동기 통신 속도를 2배 향상시켜 렌더링을 최적화한다.",
        "브라우저마다 서로 다른 기본 스타일 차이를 제거하여 크로스 브라우징 일관성을 확보한다.",
        "웹 페이지 내 모든 CSS 파일의 압축 및 난독화를 자동으로 수행한다."
      ],
      answer: 2,
      explanation: "Reset CSS는 브라우저별 User Agent Stylesheet의 기본 마진, 패딩, 폰트 차이를 초기화하여 모든 브라우저에서 일관된 화면을 제작하도록 돕습니다[cite: 4].",
      hint: "브라우저 간 기본 스타일 차이를 없애는 목적을 찾으세요."
    },

    // 12. CSS 상속 속성 (객관식)
    {
      id: "mock5-012-css-inheritance-properties",
      conceptId: "css-inheritable-properties",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "다음 CSS 속성 중 부모 요소에 스타일을 지정했을 때 하위 자식 요소에게 기본적으로 상속(Inheritance)되는 속성은?",
      options: [
        "padding",
        "margin",
        "border",
        "line-height"
      ],
      answer: 3,
      explanation: "line-height, color, font-size 등 텍스트 타이포그래피 관련 속성은 자식에게 상속되지만, 박스 모델 속성은 상속되지 않습니다[cite: 2].",
      hint: "줄 간격이나 글자 서식과 관련된 텍스트 속성을 골라보세요."
    },

    // 13. HTML5 시맨틱 태그 (객관식)
    {
      id: "mock5-013-html5-semantic-tags",
      conceptId: "html5-semantic-footer",
      difficulty: "easy",
      category: "HTML",
      questionType: "multiple-choice",
      prompt: "HTML5 시맨틱 태그 중 사이트 작성자 정보, 저작권 안내(Copyright), 관련 법적 고지 구획에 가장 적합한 태그는?",
      options: [
        "<footer>",
        "<header>",
        "<nav>",
        "<aside>"
      ],
      answer: 0,
      explanation: "<footer> 태그는 가장 가까운 구획이나 문서 전체의 바닥글 영역(작성자, 저작권, 관련 문서 링크 등)을 나타냅니다[cite: 4].",
      hint: "문서나 섹션의 바닥글을 뜻하는 영어 태그입니다."
    },

    // 14. Bootstrap 반응형 Grid (단답형)
    {
      id: "mock5-014-bootstrap-responsive-grid",
      conceptId: "bootstrap-grid-breakpoint-lg",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "short-answer",
      prompt: "Bootstrap 5 Grid 시스템에서 화면 너비 992px 이상(데스크톱 환경)에 대응하는 중단점(Breakpoint) 영문 약어 2글자를 소문자로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["lg"],
      explanation: "Bootstrap 5에서 992px 이상 구간을 정의하는 중단점 접두사는 Large를 뜻하는 'lg'입니다[cite: 1].",
      hint: "Large의 약어 2글자입니다."
    },

    // 15. Bootstrap 버튼 (객관식)
    {
      id: "mock5-015-bootstrap-button-classes",
      conceptId: "bootstrap-btn-success-class",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap 5에서 긍정적이거나 성공적인 작업을 나타내는 초록색 배경의 버튼을 제작하기 위한 클래스 조합은?",
      options: [
        "btn btn-primary",
        "btn btn-success",
        "btn btn-danger",
        "btn btn-warning"
      ],
      answer: 1,
      explanation: "초록색 긍정/성공 테마 버튼은 기본 클래스 .btn과 테마 클래스 .btn-success를 결합하여 작성합니다[cite: 4].",
      hint: "성공(Success)을 의미하는 테마 클래스입니다."
    },

    // 16. Bootstrap Spacing (단답형)
    {
      id: "mock5-016-bootstrap-spacing-syntax",
      conceptId: "bootstrap-spacing-classes",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "short-answer",
      prompt: "Bootstrap 5에서 요소의 안쪽 여백 중 상하 양방향(y축) 여백을 1rem(3단위)으로 적용하는 클래스명을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["py-3"],
      explanation: "padding은 p, y축은 y, 1rem은 3단위이므로 'py-3'이 됩니다[cite: 4].",
      hint: "padding(p)과 세로축(y)을 결합하세요."
    },

    // 17. Bootstrap Grid 컬럼 배치 (객관식)
    {
      id: "mock5-017-bootstrap-grid-columns",
      conceptId: "bootstrap-grid-twelve-columns",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap 5 Grid에서 한 행(row) 안에 12칸을 균등하게 3등분하여 컬럼 3개를 나란히 배치할 때 각 컬럼에 지정할 클래스는?",
      options: [
        "col-3",
        "col-6",
        "col-4",
        "col-2"
      ],
      answer: 2,
      explanation: "한 행은 12칸이므로 12 / 3 = 4칸씩 차지해야 하므로 col-4를 사용합니다[cite: 1].",
      hint: "12칸을 3개로 나누었을 때 한 컬럼이 차지하는 칸수를 계산하세요."
    },

    // 18. 요소 숨기기 (객관식)
    {
      id: "mock5-018-hiding-elements",
      conceptId: "visibility-hidden-behavior",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "다음 CSS 스타일 중 요소를 화면에서 감추면서, 원래 차지하던 레이아웃 공간은 빈자리로 그대로 유지하도록 만드는 선언은?",
      options: [
        "display: none;",
        "z-index: 0;",
        "position: absolute;",
        "visibility: hidden;"
      ],
      answer: 3,
      explanation: "visibility: hidden은 요소를 시각적으로만 보이지 않게 하고 원래 레이아웃 공간은 그대로 보존합니다[cite: 3].",
      hint: "공간을 없애지 않고 숨기는 속성을 선택하세요."
    },

    // 19. content-box 구성 요소 (객관식)
    {
      id: "mock5-019-box-model-components",
      conceptId: "box-model-margin-padding-distinction",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "CSS Box Model의 4대 구성 요소를 바깥쪽 테두리 선(Border)을 기준으로 분류할 때, 테두리의 바깥쪽에 위치하는 영역과 안쪽에 위치하는 영역의 명칭으로 옳은 것은?",
      options: [
        "바깥쪽: Margin / 안쪽: Padding",
        "바깥쪽: Padding / 안쪽: Margin",
        "바깥쪽: Content / 안쪽: Gutter",
        "바깥쪽: Outline / 안쪽: Margin"
      ],
      answer: 0,
      explanation: "Border 테두리를 기준으로 외부는 Margin이며, 내부는 Padding입니다[cite: 2].",
      hint: "테두리 밖 외부 여백과 테두리 안 내부 여백의 명칭을 짝지으세요."
    },

    // 20. CSS 캐스케이드 (객관식)
    {
      id: "mock5-020-css-cascade-rules",
      conceptId: "cascade-source-order-rule",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "CSS에서 스타일 충돌을 해결하는 캐스케이딩(Cascade) 원칙 중, 중요도와 선택자의 명시도 점수까지 완전히 동일할 때 최종 스타일을 결정하는 기준은?",
      options: [
        "스타일시트 파일 용량이 더 작은 규칙이 우선 적용된다.",
        "소스 코드 상에서 더 나중에(아래쪽에) 선언된 스타일이 우선 적용된다.",
        "속성에 부여된 값의 글자 수가 더 긴 선언이 우선 적용된다.",
        "HTML 파일의 위쪽에 link 태그로 먼저 연결된 선언이 우선 적용된다."
      ],
      answer: 1,
      explanation: "명시도가 동일할 때는 코드 순서상 나중에 선언된(Source Order) 스타일이 이전 스타일을 덮어씁니다[cite: 2].",
      hint: "동일 조건에서는 아래쪽에 위치한 스타일이 이깁니다."
    },

    // 21. flex-grow 공간 분배 (객관식)
    {
      id: "mock5-021-flex-grow-calculation",
      conceptId: "flex-grow-calculation",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "너비 400px인 Flex 컨테이너 안에 기본 너비가 각각 100px인 두 아이템 A, B가 있다(여백/테두리 없음). item A의 flex-grow가 1, item B의 flex-grow가 3일 때, item A의 최종 너비는?",
      options: [
        "100px",
        "200px",
        "125px",
        "150px"
      ],
      answer: 3,
      explanation: "남은 공간(400px - 200px = 200px)을 1:3으로 나누어 item A에 200px * (1/4) = 50px이 추가되므로 최종 너비는 100 + 50 = 150px 입니다[cite: 3].",
      hint: "남은 공간 200px 중 1/4을 기본 너비 100px에 더하세요."
    },

    // 22. z-index와 position (객관식)
    {
      id: "mock5-022-z-index-position-requirement",
      conceptId: "z-index-non-static-condition",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "일반적인 HTML 블록 요소에 z-index: 10을 부여했으나 요소의 쌓임 순서가 변경되지 않고 무시되는 원인으로 가장 적절한 것은?",
      options: [
        "부모 요소에 border-box 속성이 지정되지 않았기 때문이다.",
        "요소의 가로 너비(width)가 100% 미만으로 설정되었기 때문이다.",
        "해당 요소의 position 속성이 기본값인 static으로 유지되어 있기 때문이다.",
        "z-index 값으로 음수가 아닌 양수 정수를 입력했기 때문이다."
      ],
      answer: 2,
      explanation: "일반적인 블록 요소에서 z-index는 position 속성이 static이 아닌 relative, absolute, fixed, sticky 요소에만 유효합니다[cite: 3].",
      hint: "position 기본값인 static에서는 z-index가 동작하지 않는 점을 떠올려보세요."
    },

    // 23. position 기준점 (객관식)
    {
      id: "mock5-023-position-relative-origin",
      conceptId: "position-relative-reference-point",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "position: relative가 설정된 요소에 top: 10px, left: 20px를 적용했을 때 요소의 이동 기준점이 되는 위치는?",
      options: [
        "해당 요소가 일반 문서 흐름에서 원래 배치되었어야 할 자리",
        "부모 요소의 padding을 제외한 실제 콘텐츠의 시작 위치",
        "브라우저 뷰포트(viewport)의 왼쪽 상단 원점 (0, 0)",
        "HTML 문서 트리에서 가장 처음에 위치한 <body> 태그의 원점"
      ],
      answer: 0,
      explanation: "position: relative는 일반 흐름(Normal Flow)에서 자신이 원래 위치해야 했던 정적 자리를 기준으로 이동합니다[cite: 3].",
      hint: "자기 자신의 본래 위치를 기준으로 삼습니다."
    },

    // 24. CSS 상대 단위 (서술형) - [신규 서술 토픽]
    {
      id: "mock5-024-css-relative-units-essay",
      conceptId: "rem-vs-em-root-element-reference",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "essay",
      prompt: "CSS 상대 단위인 `em`과 `rem`의 기준점 차이를 설명하고, 다단계로 중첩된 HTML 구조에서 글자 크기(font-size)를 설정할 때 `rem` 사용을 권장하는 이유를 30자 이상으로 서술하시오.",
      options: [],
      answer: null,
      modelAnswer: "em은 부모 요소의 font-size를 기준으로 하여 중첩될수록 글자 크기 계산이 기하급수적으로 복잡해지지만, rem은 최상위 html 태그의 font-size만을 일관되게 기준으로 삼으므로 예측과 유지보수가 훨씬 용이하기 때문이다.",
      rubricKeywords: [
        "부모",
        "html",
        "중첩",
        "계산"
      ],
      minLength: 30,
      explanation: "em은 직속 부모의 글자 크기를 따르므로 중첩 시 계산이 복잡해지지만, rem은 루트(html) 글자 크기를 기준으로 하여 일관성과 유지보수성이 뛰어납니다[cite: 2].",
      hint: "em의 부모 기준과 rem의 최상위 html 태그 기준의 차이를 설명하세요."
    },

    // 25. position 속성 값 (객관식)
    {
      id: "mock5-025-position-sticky-behavior",
      conceptId: "position-static-offset-ignored",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "CSS position 속성값 중 top, bottom, left, right 오프셋 좌표 속성이 적용되지 않고 오직 일반 문서 흐름대로만 배치되는 속성값은?",
      options: [
        "relative",
        "static",
        "fixed",
        "absolute"
      ],
      answer: 1,
      explanation: "position: static은 기본값으로 오프셋 속성(top, left 등)이 무시되며 일반 문서 흐름을 따릅니다[cite: 3].",
      hint: "정적 위치를 의미하는 기본 속성값입니다."
    },

    // 26. CSS 선택자 우선순위 (객관식)
    {
      id: "mock5-026-selector-specificity-priority",
      conceptId: "css-selector-priority-classes",
      difficulty: "easy",
      category: "CSS Selector",
      questionType: "multiple-choice",
      prompt: "다음 CSS 선택자 중 명시도(Specificity) 점수 계산 시 10점의 가중치를 부여받는 선택자는?",
      options: [
        "전체 선택자 (*)",
        "ID 선택자 (#header)",
        "클래스 선택자 (.menu-item)",
        "태그 선택자 (div)"
      ],
      answer: 2,
      explanation: "클래스 선택자는 10점, ID 선택자는 100점, 태그 선택자는 1점, 전체 선택자는 0점입니다[cite: 2].",
      hint: "마침표(.)로 시작하는 선택자의 명시도 점수를 생각해보세요."
    },

    // 27. Flex 여러 줄 정렬 (객관식)
    {
      id: "mock5-027-flex-multi-line-align",
      conceptId: "align-content-multi-line",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flexbox에서 flex-wrap: wrap으로 인해 두 줄 이상으로 나뉜 아이템 라인들 사이의 교차축 간격을 제어하는 속성은?",
      options: [
        "justify-content",
        "align-items",
        "flex-direction",
        "align-content"
      ],
      answer: 3,
      explanation: "align-content는 아이템이 여러 행으로 줄 바꿈되었을 때 줄들 사이의 교차축 간격과 정렬을 담당합니다[cite: 3].",
      hint: "여러 줄 전체의 교차축 간격을 제어하는 속성입니다."
    },

    // 28. 시맨틱 태그와 검색 엔진 (객관식)
    {
      id: "mock5-028-semantic-tag-seo-benefits",
      conceptId: "semantic-html-seo-accessibility",
      difficulty: "easy",
      category: "HTML",
      questionType: "multiple-choice",
      prompt: "웹 사이트 제작 시 단순 <div> 대신 <header>, <nav>, <main>, <article> 등 시맨틱 태그를 구조화하여 작성했을 때의 이점으로 옳은 것은?",
      options: [
        "검색 엔진(SEO)의 정확한 색인을 돕고 스크린 리더를 통한 웹 접근성을 향상시킨다.",
        "자바스크립트의 실행 속도가 획기적으로 개선되어 데이터 로딩 시간이 절반으로 단축된다.",
        "별도의 CSS 스타일시트 작성 없이도 모든 디바이스에서 반응형 그리드가 자동 구현된다.",
        "모든 이미지 파일의 용량을 자동으로 손실 압축하여 네트워크 대역폭을 절약한다."
      ],
      answer: 0,
      explanation: "시맨틱 태그는 컴퓨터(검색 엔진 로봇, 스크린 리더 등)가 문서 구조와 의미를 해석할 수 있도록 하여 SEO와 접근성을 크게 높입니다[cite: 4].",
      hint: "검색 엔진 색인과 스크린 리더 접근성 지원 효과를 찾으세요."
    },

    // 29. CSS 방법론 (객관식)
    {
      id: "mock5-029-oocss-methodology",
      conceptId: "oocss-core-principles",
      difficulty: "easy",
      category: "CSS Architecture",
      questionType: "multiple-choice",
      prompt: "CSS를 객체 지향적 관점에서 설계하여 재사용성을 극대화하기 위해 '구조와 스킨의 분리', '컨테이너와 콘텐츠의 분리'를 제안한 방법론은?",
      options: [
        "BEM",
        "OOCSS",
        "SMACSS",
        "Utility-First CSS"
      ],
      answer: 1,
      explanation: "OOCSS(Object Oriented CSS)는 구조와 스킨, 컨테이너와 콘텐츠의 분리를 핵심 원칙으로 삼습니다[cite: 4].",
      hint: "Object Oriented CSS의 약어입니다."
    },

    // 30. Flex 개별 아이템 정렬 (단답형)
    {
      id: "mock5-030-flex-individual-item-align",
      conceptId: "align-self-individual-override",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "short-answer",
      prompt: "Flex 컨테이너의 align-items 설정을 개별 자식 아이템 차원에서 재정의하여 해당 아이템만 교차축 정렬을 변경할 때 사용하는 CSS 속성명을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["align-self"],
      explanation: "align-self 속성을 개별 flex 아이템에 지정하면 부모 컨테이너의 align-items 속성을 덮어씁니다[cite: 3].",
      hint: "자기 자신을 정렬하는 속성명입니다."
    },

    // 31. Flex 주축과 교차축 (객관식)
    {
      id: "mock5-031-flex-axes-direction",
      conceptId: "flex-direction-column-reverse-main-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "CSS Flexbox에서 flex-direction: column-reverse로 설정했을 때 주 축(main axis)의 시작점(start)과 진행 방향으로 옳은 것은?",
      options: [
        "왼쪽에서 시작하여 오른쪽으로 향한다.",
        "위쪽에서 시작하여 아래쪽으로 향한다.",
        "아래쪽에서 시작하여 위쪽으로 향한다.",
        "오른쪽에서 시작하여 왼쪽으로 향한다."
      ],
      answer: 2,
      explanation: "column은 위에서 아래로 향하지만, reverse가 붙으면 시작선이 아래쪽으로 바뀌어 아래에서 위쪽으로 배치됩니다[cite: 3].",
      hint: "세로 방향의 역순(Reverse) 배치를 생각해보세요."
    },

    // 32. CSS 명시도 (객관식)
    {
      id: "mock5-032-css-compound-specificity",
      conceptId: "compound-selector-specificity-comparison",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "동일한 텍스트 요소에 적용된 다음 4개의 CSS 선택자 중, 명시도(Specificity) 점수가 가장 높아 최종 스타일을 결정짓는 선택자는?",
      options: [
        ".main-nav ul li a",
        "body div.container ul.nav a.active",
        "header nav ul.menu a:hover",
        "#sidebar .widget h3"
      ],
      answer: 3,
      explanation: "#sidebar .widget h3는 ID 1개(100점) + 클래스 1개(10점) + 태그 1개(1점) = 111점으로, ID 선택자가 없는 다른 선택자들보다 명시도가 가장 높습니다[cite: 2].",
      hint: "ID 선택자(#)가 포함된 규칙의 가중치를 계산하세요."
    }
  ],
  medium: [],
  hard: [],
  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();