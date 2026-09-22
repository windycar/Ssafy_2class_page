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
    // Web 과목평가 대비 모의고사 3회차 (총 32문항)
    // 출제 토픽 1번 ~ 32번 1:1 매칭 완료
    // 구성: 객관식 24문항, 단답형 5문항, 서술형 3문항
    // 객관식 정답 분포: 0번(6개), 1번(6개), 2번(6개), 3번(6개) 완전 균등 분산 배치
    // =========================================================================

    // 1. Flex 교차축 정렬 (객관식)
    {
      id: "mock3-001-flex-cross-axis-align",
      conceptId: "flex-align-items-cross-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flexbox 컨테이너에서 아이템들이 교차축의 전체 높이를 꽉 채우도록 늘려서 배치하는 align-items의 기본값은?",
      options: [
        "flex-start",
        "center",
        "stretch",
        "baseline"
      ],
      answer: 2,
      explanation: "align-items의 기본값은 stretch로, 아이템에 명시적인 높이가 없을 때 교차축 전체를 채우도록 늘어납니다[cite: 3].",
      hint: "아이템이 교차축 방향으로 길게 늘어나는 기본 속성값을 떠올려보세요."
    },

    // 2. Box Model 너비 계산 (객관식)
    {
      id: "mock3-002-box-model-width-calc",
      conceptId: "box-model-width-calculation",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "box-sizing: content-box인 요소에 width: 300px, padding: 10px 20px, border: 2px dashed red, margin: 30px를 적용했을 때 테두리를 포함한 실제 상자의 가로 너비는?",
      options: [
        "344px",
        "324px",
        "300px",
        "404px"
      ],
      answer: 0,
      explanation: "content-box에서 테두리 포함 너비는 width(300px) + padding 좌우(20px * 2 = 40px) + border 좌우(2px * 2 = 4px) = 344px 입니다[cite: 2]. margin은 외부 여백이므로 제외됩니다[cite: 2].",
      hint: "콘텐츠 너비에 좌우 패딩과 좌우 테두리 두께만 더하세요."
    },

    // 3. 자손·자식 선택자 (단답형)
    {
      id: "mock3-003-descendant-selector-term",
      conceptId: "descendant-combinator-concept",
      difficulty: "easy",
      category: "CSS Selector",
      questionType: "short-answer",
      prompt: "CSS 선택자에서 특정 부모 요소 아래의 모든 하위 요소(자식, 손자 등)를 깊이에 상관없이 선택할 때 공백(스페이스)으로 연결하는 결합자의 한글 명칭(○○ 결합자)에서 빈칸의 두 글자를 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["자손", "자손 결합자"],
      explanation: "선택자 사이에 공백(스페이스)을 넣어 하위의 모든 요소를 선택하는 방식을 '자손 결합자'라고 합니다[cite: 2]. 직계 자식만을 선택할 때는 '>' 기호의 자식 결합자를 사용합니다[cite: 2].",
      hint: "직계 자식을 포함하여 대를 이어 내려가는 모든 하위 요소를 뜻하는 단어입니다."
    },

    // 4. box-sizing별 요소 너비 (객관식)
    {
      id: "mock3-004-box-sizing-width-behavior",
      conceptId: "border-box-width-property",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "width: 200px가 설정된 상자에 padding: 20px를 추가했을 때, content-box와 border-box의 실제 상자 전체 외형 너비 변화로 옳은 것은?",
      options: [
        "content-box는 200px을 유지하고, border-box는 240px로 커진다.",
        "content-box는 240px로 커지고, border-box는 200px을 유지한다.",
        "두 모델 모두 240px로 동일하게 외부 크기가 증가한다.",
        "두 모델 모두 200px로 고정되며 안쪽 텍스트만 작아진다."
      ],
      answer: 1,
      explanation: "content-box는 padding이 외부에 가산되어 240px로 커지고, border-box는 지정된 200px 내부에서 여백을 확보하므로 200px이 유지됩니다[cite: 2].",
      hint: "어느 쪽이 패딩을 너비 안쪽에 포함하는지 확인하세요."
    },

    // 5. content-box 너비 계산 (단답형)
    {
      id: "mock3-005-content-box-width-calc",
      conceptId: "content-box-element-width",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "short-answer",
      prompt: "box-sizing: content-box가 적용된 요소의 width가 220px이고, 좌우 padding이 각각 25px, 좌우 border가 각각 3px일 때 테두리를 포함한 실제 요소의 가로 너비를 작성하시오. (px 단위 생략 가능)",
      options: [],
      answer: null,
      acceptedAnswers: ["276", "276px"],
      explanation: "220px(width) + 50px(좌우 padding) + 6px(좌우 border) = 276px 입니다[cite: 2].",
      hint: "220에 좌우 패딩 합(50)과 좌우 테두리 합(6)을 더하세요."
    },

    // 6. position: absolute와 문서 흐름 (객관식) - [사용자 수정안 반영]
    {
      id: "mock3-006-position-absolute-flow",
      conceptId: "position-absolute-normal-flow",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "일반 문서 흐름에 배치된 요소에 position: absolute를 적용했을 때 나타나는 변화로 옳은 것은?",
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
      id: "mock3-007-inline-block-differences",
      conceptId: "block-element-characteristics",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "HTML 인라인(inline) 요소에 대한 CSS 스타일 적용 규칙으로 옳지 않은 것은?",
      options: [
        "줄 바꿈 없이 텍스트 흐름에 배치되며 콘텐츠 크기만큼 차지한다.",
        "일반적인 텍스트 인라인 요소는 width와 height 속성이 무시된다.",
        "좌우(수평) 방향의 margin과 padding은 정상 적용되어 인접 요소를 밀어낸다.",
        "상하(수직) 방향의 margin이 정상 적용되어 위아래 블록 라인 간격을 밀어낸다."
      ],
      answer: 3,
      explanation: "인라인 요소는 상하 margin을 부여하더라도 다른 요소를 수직으로 밀어내지 못하므로 라인 간격에 영향을 주지 않습니다[cite: 3].",
      hint: "인라인 요소에서 상하 방향의 마진이 주변 요소를 밀어낼 수 있는지 확인하세요."
    },

    // 8. position: fixed (객관식)
    {
      id: "mock3-008-position-fixed",
      conceptId: "position-fixed-viewport",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "스크롤을 내려도 항상 브라우저 화면 최상단에 고정되는 내비게이션 바(GNB)를 구현하기 위한 CSS 속성과 값의 조합은?",
      options: [
        "position: static; top: 0;",
        "position: relative; left: 0;",
        "position: absolute; bottom: 0;",
        "position: fixed; top: 0;"
      ],
      answer: 3,
      explanation: "position: fixed는 Normal flow에서 벗어나 화면 뷰포트(viewport)를 기준으로 요소를 고정시킵니다[cite: 3].",
      hint: "화면 뷰포트에 요소를 단단히 고정시키는 속성값입니다."
    },

    // 9. Flex 주축 정렬 (객관식)
    {
      id: "mock3-009-flex-main-axis-align",
      conceptId: "justify-content-main-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "가로 방향 Flex 컨테이너에서 아이템들을 주 축(main axis)의 한가운데로 모아서 정렬할 때 사용하는 CSS 선언은?",
      options: [
        "align-items: center;",
        "align-content: center;",
        "justify-content: center;",
        "flex-direction: center;"
      ],
      answer: 2,
      explanation: "주 축 방향의 정렬과 간격 제어는 justify-content 속성을 사용합니다[cite: 3]. align-items는 교차축 정렬 속성입니다[cite: 3].",
      hint: "주 축을 정렬하는 대표 속성명을 생각해보세요."
    },

    // 10. Bootstrap Grid gutter (객관식)
    {
      id: "mock3-010-bootstrap-grid-gutter",
      conceptId: "bootstrap-grid-gutter-spacing",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap 5 Grid에서 행 내부 컬럼들의 '세로 방향 여백(vertical gutter)'을 1rem(3단위)으로 설정하기 위한 클래스는?",
      options: [
        "gx-3",
        "gy-3",
        "g-vert-3",
        "gap-3"
      ],
      answer: 1,
      explanation: "Bootstrap Grid에서 가로 gutter는 gx-*, 세로 gutter는 gy-*, 가로세로 동시 gutter는 g-* 클래스를 사용합니다[cite: 1].",
      hint: "gutter를 뜻하는 g와 세로축을 뜻하는 y의 조합입니다."
    },

    // 11. Reset CSS (서술형)
    {
      id: "mock3-011-reset-css-purpose-essay",
      conceptId: "reset-css-core-goal",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "essay",
      prompt: "웹 브라우저의 기본 내장 스타일(User Agent Stylesheet)로 인해 발생할 수 있는 문제점을 설명하고, 웹 개발 초기 단계에서 Reset CSS를 적용하는 목적을 서술하시오. (30자 이상 작성)",
      options: [],
      answer: null,
      modelAnswer: "브라우저마다 내장된 기본 스타일(User Agent Stylesheet)이 서로 달라 생기는 렌더링 불일치를 해결하기 위해, 모든 요소의 기본 스타일을 초기화하여 일관된 디자인 기준점을 확보하기 위함이다.",
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
      id: "mock3-012-css-inheritance-properties",
      conceptId: "css-inheritable-properties",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "부모 <div>에 설정했을 때 자식 <p> 요소에게 기본적으로 상속(Inherit)되어 적용되는 CSS 속성은?",
      options: [
        "font-family",
        "border",
        "background-color",
        "width"
      ],
      answer: 0,
      explanation: "font-family, color, line-height 등 텍스트 타이포그래피 관련 속성은 자식에게 기본 상속되지만, 박스 모델 및 배경 속성은 상속되지 않습니다[cite: 2].",
      hint: "글자 스타일과 관련된 텍스트 속성을 골라보세요."
    },

    // 13. HTML5 시맨틱 태그 (객관식)
    {
      id: "mock3-013-html5-semantic-tags",
      conceptId: "html5-semantic-article",
      difficulty: "easy",
      category: "HTML",
      questionType: "multiple-choice",
      prompt: "블로그 포스트, 뉴스 기사처럼 그 자체로 독립적으로 배포하거나 재사용할 수 있는 완결된 콘텐츠 구획을 감싸는 시맨틱 태그는?",
      options: [
        "<aside>",
        "<nav>",
        "<article>",
        "<footer>"
      ],
      answer: 2,
      explanation: "<article>은 독립적으로 배포 및 재사용이 가능한 자립적 콘텐츠 구획에 사용되는 시맨틱 태그입니다[cite: 4].",
      hint: "신문 기사나 독립된 게시글을 뜻하는 영단어 태그입니다."
    },

    // 14. Bootstrap 반응형 Grid (단답형)
    {
      id: "mock3-014-bootstrap-responsive-grid",
      conceptId: "bootstrap-grid-breakpoint-xl",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "short-answer",
      prompt: "Bootstrap 5의 중단점(Breakpoints) 중 화면 너비가 1200px 이상일 때 적용되는 클래스 접두사에 들어가는 영문 약어 2글자를 소문자로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["xl"],
      explanation: "Bootstrap 5에서 1200px 이상 구간을 정의하는 접두사는 Extra Large를 의미하는 'xl'입니다[cite: 1].",
      hint: "Extra Large의 약어 2글자입니다."
    },

    // 15. Bootstrap 버튼 (객관식)
    {
      id: "mock3-015-bootstrap-button-classes",
      conceptId: "bootstrap-btn-outline-success",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap 5에서 배경색을 채우지 않고 테두리 선만 초록색(성공/긍정)으로 표시하는 아웃라인 버튼 클래스 조합은?",
      options: [
        "btn btn-outline-success",
        "btn btn-border-green",
        "btn btn-success-line",
        "btn-outline btn-success"
      ],
      answer: 0,
      explanation: "Bootstrap에서 아웃라인 스타일 버튼은 .btn과 함께 .btn-outline-{theme} 클래스를 결합하여 작성합니다[cite: 4].",
      hint: "버튼 기본 클래스 btn과 outline이 포함된 클래스명의 조합입니다."
    },

    // 16. Bootstrap Spacing (단답형)
    {
      id: "mock3-016-bootstrap-spacing-syntax",
      conceptId: "bootstrap-spacing-classes",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "short-answer",
      prompt: "Bootstrap 5에서 요소의 아래쪽 바깥 여백(margin-bottom)을 3rem(5단위)으로 설정하는 클래스명을 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["mb-5"],
      explanation: "margin은 m, bottom은 b, 3rem 크기 단계는 5이므로 'mb-5'가 됩니다[cite: 4].",
      hint: "margin(m), bottom(b), 크기 단계(5)를 하이픈으로 연결하세요."
    },

    // 17. Bootstrap Grid 컬럼 배치 (객관식)
    {
      id: "mock3-017-bootstrap-grid-columns",
      conceptId: "bootstrap-grid-twelve-columns",
      difficulty: "easy",
      category: "Bootstrap",
      questionType: "multiple-choice",
      prompt: "Bootstrap 5 Grid에서 한 행(row)에 6개의 카드 요소를 동일한 크기로 균등하게 나열하고자 할 때 각 컬럼에 부여할 클래스는?",
      options: [
        "col-6",
        "col-3",
        "col-2",
        "col-4"
      ],
      answer: 2,
      explanation: "Bootstrap 한 행은 12칸이므로 6개로 균등 분할하려면 12 / 6 = 2칸씩 할당하는 col-2를 사용해야 합니다[cite: 1].",
      hint: "12칸을 6개로 나누었을 때 한 컬럼이 차지하는 칸수를 계산하세요."
    },

    // 18. 요소 숨기기 (객관식)
    {
      id: "mock3-018-hiding-elements",
      conceptId: "opacity-zero-behavior",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "CSS에서 요소를 화면에 보이지 않게 감추는 세 가지 방법(display: none, visibility: hidden, opacity: 0)에 대한 설명으로 옳은 것은?",
      options: [
        "visibility: hidden은 요소가 차지하던 레이아웃 공간까지 완전히 삭제한다.",
        "display: none은 시각적으로만 투명해지고 원래의 레이아웃 자리는 그대로 유지한다.",
        "세 가지 속성 모두 렌더링 트리에서 노드를 완전히 제거하므로 동작 차이가 없다.",
        "opacity: 0은 요소를 투명하게 만들지만 레이아웃 공간과 마우스 이벤트는 유지된다."
      ],
      answer: 3,
      explanation: "opacity: 0은 요소를 100% 투명하게 렌더링하지만 자리(공간)와 마우스 클릭 등 이벤트 처리는 그대로 유지됩니다[cite: 3].",
      hint: "투명도 조절 속성이 화면 공간과 클릭 이벤트에 미치는 영향을 생각해보세요."
    },

    // 19. content-box 구성 요소 (객관식)
    {
      id: "mock3-019-box-model-components",
      conceptId: "box-model-padding-role",
      difficulty: "easy",
      category: "CSS Box Model",
      questionType: "multiple-choice",
      prompt: "CSS Box Model에서 실제 데이터(Content)와 테두리(Border) 사이의 안쪽 여백 영역의 명칭은?",
      options: [
        "Margin",
        "Padding",
        "Gutter",
        "Outline"
      ],
      answer: 1,
      explanation: "Content와 Border 사이의 내부 여백 공간을 Padding이라고 부릅니다[cite: 2].",
      hint: "콘텐츠 안쪽을 푹신하게 채워주는 여백의 명칭입니다."
    },

    // 20. CSS 캐스케이드 (객관식)
    {
      id: "mock3-020-css-cascade-rules",
      conceptId: "cascade-priority-rules",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "동일한 요소에 동일한 출처와 중요도를 가진 CSS 스타일 선언이 충돌할 때, 우선순위를 결정하는 2대 캐스케이딩(Cascade) 원칙을 높은 순서대로 나열한 것은?",
      options: [
        "작성 순서(Source Order) -> 선택자 명시도(Specificity)",
        "속성 값의 글자 수 -> 선택자 명시도(Specificity)",
        "HTML 파일 내 위치 -> CSS 파일 크기",
        "선택자 명시도(Specificity) -> 코드 작성 순서(Source Order)"
      ],
      answer: 3,
      explanation: "중요도와 출처가 같을 때 명시도(선택자 가중치)가 높은 선언이 우선하며, 명시도마저 같을 때는 나중에 선언된 순서를 따릅니다[cite: 2].",
      hint: "점수 계산(명시도)이 먼저인지, 코드 작성 위치가 먼저인지 생각해보세요."
    },

    // 21. flex-grow 공간 분배 (서술형)
    {
      id: "mock3-021-flex-grow-space-distribution-essay",
      conceptId: "flex-grow-calculation",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "essay",
      prompt: "너비 700px인 Flex 컨테이너 안에 기본 너비(flex-basis)가 각각 200px이고 margin, padding, border가 없는 두 아이템 A, B가 있다. item A의 flex-grow가 1, item B의 flex-grow가 2일 때, item A의 최종 너비와 그 계산 과정을 서술하시오. (30자 이상 작성)",
      options: [],
      answer: null,
      modelAnswer: "컨테이너 너비 700px에서 두 아이템의 기본 너비 합인 400px을 뺀 남은 여백은 300px이다. flex-grow 비율이 1:2이므로 item A에는 300px의 1/3인 100px이 분배되어, 최종 너비는 기본 200px에 100px을 더한 300px이 된다.",
      rubricKeywords: [
        "300px",
        "1:2",
        "100px",
        "300px"
      ],
      minLength: 30,
      explanation: "전체 700px에서 기본 너비 총합 400px을 뺀 여백 300px 중 1/3(100px)이 A에 추가되어 최종 300px이 됩니다[cite: 3].",
      hint: "기본 너비의 합을 컨테이너 너비에서 빼고, 남은 여백을 flex-grow 비율대로 나누어 기본 너비에 가산하세요."
    },

    // 22. z-index와 position (객관식) - [답안 균등 분산을 위해 3번으로 배치 조정]
    {
      id: "mock3-022-z-index-position-requirement",
      conceptId: "z-index-non-static-condition",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "일반적인 블록 요소에서 z-index 속성이 정상 적용되어 앞뒤 쌓임 순서를 조절하기 위한 위치 지정 조건으로 옳은 것은?",
      options: [
        "display 속성을 inline으로 지정해야 한다.",
        "float 속성을 left 또는 right로 설정해야 한다.",
        "box-sizing을 border-box로 설정하면 기본 static에서도 동작한다.",
        "position 속성을 static 이외의 값(relative, absolute 등)으로 지정해야 한다."
      ],
      answer: 3,
      explanation: "일반 블록 요소는 position 속성이 static이 아닌 relative, absolute, fixed, sticky 등으로 지정되어야 z-index가 유효하게 동작합니다[cite: 3].",
      hint: "기본 static 상태가 아닌 위치 지정 방식으로 변경해야 합니다."
    },

    // 23. position 기준점 (객관식)
    {
      id: "mock3-023-position-relative-origin",
      conceptId: "position-relative-reference-point",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "position: relative가 적용된 요소에 top: 20px, left: 30px를 부여했을 때 이동의 기준점은?",
      options: [
        "자신이 일반 흐름(Normal Flow)에서 원래 배치되었어야 할 자리",
        "부모 요소의 왼쪽 상단 모서리 시작점",
        "브라우저 화면(Viewport)의 왼쪽 상단 모서리",
        "HTML 문서 트리에서 가장 첫 번째로 선언된 body 태그의 시작점"
      ],
      answer: 0,
      explanation: "relative 요소는 자신이 Normal flow에서 본래 위치해야 했던 원래 자리를 기준으로 오프셋만큼 이동합니다[cite: 3].",
      hint: "외부 조상이 아닌 자기 자신의 본래 위치를 기준으로 삼습니다."
    },

    // 24. CSS 상대 단위 (객관식)
    {
      id: "mock3-024-css-relative-units",
      conceptId: "em-parent-element-reference",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "CSS 상대 단위 중 부모 요소의 font-size에 비례하여 크기가 결정되는 단위는?",
      options: [
        "px",
        "rem",
        "em",
        "vw"
      ],
      answer: 2,
      explanation: "em은 직속 부모 요소의 font-size를 기준으로 배수가 계산되는 상대 단위입니다[cite: 2].",
      hint: "루트(Root)가 아닌 부모 요소 기준의 상대 단위입니다."
    },

    // 25. position 속성 값 (객관식)
    {
      id: "mock3-025-position-sticky-behavior",
      conceptId: "position-static-default-value",
      difficulty: "easy",
      category: "CSS Position",
      questionType: "multiple-choice",
      prompt: "CSS position 속성의 기본값(Default)으로, 별도의 위치 지정 없이 일반적인 HTML 문서 흐름(Normal Flow)을 그대로 따르는 속성값은?",
      options: [
        "relative",
        "static",
        "initial",
        "absolute"
      ],
      answer: 1,
      explanation: "position 속성의 기본값은 static이며, top, left 등의 좌표 속성이 적용되지 않고 일반 문서 흐름에 따라 배치됩니다[cite: 3].",
      hint: "정적 위치를 의미하는 기본 속성값입니다."
    },

    // 26. CSS 선택자 우선순위 (객관식)
    {
      id: "mock3-026-selector-specificity-priority",
      conceptId: "css-selector-priority-id",
      difficulty: "easy",
      category: "CSS Selector",
      questionType: "multiple-choice",
      prompt: "다음 중 기본 CSS 선택자의 명시도 점수가 높은 순서에서 낮은 순서로 올바르게 나열된 것은?",
      options: [
        "ID 선택자(#id) > 클래스 선택자(.class) > 태그 선택자(tag) > 전체 선택자(*)",
        "클래스 선택자(.class) > ID 선택자(#id) > 태그 선택자(tag) > 전체 선택자(*)",
        "ID 선택자(#id) > 태그 선택자(tag) > 클래스 선택자(.class) > 전체 선택자(*)",
        "태그 선택자(tag) > 클래스 선택자(.class) > ID 선택자(#id) > 전체 선택자(*)"
      ],
      answer: 0,
      explanation: "선택자 명시도 점수는 ID(100점) > 클래스(10점) > 태그(1점) > 전체 선택자(0점) 순입니다[cite: 2].",
      hint: "고유한 요소를 지정하는 ID 선택자의 점수가 가장 높습니다."
    },

    // 27. Flex 여러 줄 정렬 (객관식)
    {
      id: "mock3-027-flex-multi-line-align",
      conceptId: "align-content-multi-line",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "flex-wrap: wrap이 설정되어 여러 행으로 나뉜 Flex 아이템 라인들 간의 교차축 간격과 정렬을 제어하는 속성은?",
      options: [
        "align-items",
        "align-self",
        "justify-content",
        "align-content"
      ],
      answer: 3,
      explanation: "아이템들이 여러 행으로 줄 바꿈되었을 때 줄들 사이의 교차축 간격을 제어하는 속성은 align-content입니다[cite: 3].",
      hint: "한 줄의 아이템 정렬이 아닌 여러 행 라인 간의 정렬을 제어하는 속성입니다."
    },

    // 28. 시맨틱 태그와 검색 엔진 (서술형)
    {
      id: "mock3-028-semantic-tag-seo-benefits-essay",
      conceptId: "semantic-html-seo-accessibility",
      difficulty: "easy",
      category: "HTML",
      questionType: "essay",
      prompt: "웹 문서 작성 시 <div> 대신 <header>, <main>, <article> 등의 시맨틱 태그를 구조적으로 사용했을 때, 검색 엔진(SEO)과 웹 접근성(스크린 리더) 관점에서 얻을 수 있는 이점을 서술하시오. (30자 이상 작성)",
      options: [],
      answer: null,
      modelAnswer: "시맨틱 태그는 웹 문서의 구조와 콘텐츠의 역할을 명확히 정의하므로 검색 엔진 크롤러가 주요 정보를 정확히 파악하여 검색 노출(SEO)을 최적화하고, 스크린 리더가 문서 구조를 논리적으로 탐색하여 장애인의 웹 접근성을 크게 향상시킨다.",
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
      id: "mock3-029-oocss-methodology",
      conceptId: "oocss-core-principles",
      difficulty: "easy",
      category: "CSS Architecture",
      questionType: "short-answer",
      prompt: "OOCSS 방법론의 핵심 2대 원칙 중 하나는 '구조와 스킨의 분리'이다. 나머지 한 가지 원칙인 '○○○○와 콘텐츠의 분리'에서 빈칸에 들어갈 용어를 한글로 작성하시오.",
      options: [],
      answer: null,
      acceptedAnswers: ["컨테이너"],
      explanation: "OOCSS(Object Oriented CSS)는 '구조와 스킨의 분리', '컨테이너와 콘텐츠의 분리'를 원칙으로 합니다[cite: 4].",
      hint: "콘텐츠를 감싸고 있는 외곽 틀을 의미하는 단어입니다."
    },

    // 30. Flex 개별 아이템 정렬 (객관식)
    {
      id: "mock3-030-flex-individual-item-align",
      conceptId: "align-self-individual-override",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "부모 컨테이너에 align-items: center가 지정되어 있을 때, 특정 Flex 아이템 하나만 교차축의 끝점(하단)에 정렬하기 위해 해당 아이템에 부여해야 할 속성은?",
      options: [
        "justify-self: flex-end;",
        "align-self: flex-end;",
        "align-items: flex-end;",
        "align-content: flex-end;"
      ],
      answer: 1,
      explanation: "개별 Flex 아이템의 교차축 정렬을 재정의할 때는 align-self 속성을 사용합니다[cite: 3].",
      hint: "아이템 자기 자신만을 개별 정렬하는 속성입니다."
    },

    // 31. Flex 주축과 교차축 (객관식)
    {
      id: "mock3-031-flex-axes-direction",
      conceptId: "flex-direction-column-main-axis",
      difficulty: "easy",
      category: "Web Layout",
      questionType: "multiple-choice",
      prompt: "Flexbox에서 flex-direction: column으로 지정했을 때, justify-content와 align-items가 각각 제어하는 방향으로 옳은 것은?",
      options: [
        "justify-content는 세로(주축), align-items는 가로(교차축)를 제어한다.",
        "justify-content는 가로(주축), align-items는 세로(교차축)를 제어한다.",
        "justify-content와 align-items 모두 세로 방향만을 제어한다.",
        "justify-content와 align-items 모두 가로 방향만을 제어한다."
      ],
      answer: 0,
      explanation: "flex-direction: column이 되면 주 축이 세로(수직)가 되고 교차 축이 가로(수평)가 되므로 justify-content가 세로, align-items가 가로를 제어합니다[cite: 3].",
      hint: "column 설정 시 주 축이 어느 방향으로 바뀌는지 떠올려보세요."
    },

    // 32. CSS 명시도 (객관식)
    {
      id: "mock3-032-css-compound-specificity",
      conceptId: "compound-selector-specificity-comparison",
      difficulty: "easy",
      category: "CSS Basics",
      questionType: "multiple-choice",
      prompt: "다음 중 CSS 명시도(Specificity) 점수가 가장 높아 다른 스타일을 덮어쓰고 최종 적용되는 선택자는?",
      options: [
        "nav ul.menu li a",
        ".container .nav .menu a.active",
        "#gnb .menu-item",
        "header nav div ul li a"
      ],
      answer: 2,
      explanation: "#gnb .menu-item은 ID 1개(100점) + 클래스 1개(10점) = 110점으로, ID 선택자가 없는 다른 선택자들보다 명시도가 가장 높습니다[cite: 2].",
      hint: "선택자 구성 요소 중 ID 선택자(#)가 포함된 규칙의 가중치를 확인하세요."
    }
  ],
  medium: [],
  hard: [],
  extreme: []
};

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();