// AI Python 1주차 - AI와 기계학습
// 지정된 출제 범위만 사용한 자기완결형 SSAFY 과목평가 대비 문제은행
// 난이도별 100문제: 객관식 75 + 단답형 15 + 서술형 10

export type StudyDifficulty = "easy" | "medium" | "hard";

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
  hint: string;
}

export const QUESTION_BANK: Record<StudyDifficulty, StudyQuestion[]> = {
  "easy": [
    {
      "id": "ai-ml-easy-001",
      "conceptId": "ai-definition-easy-001",
      "difficulty": "easy",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "multiple-choice",
      "prompt": "데이터와 주변 환경을 인식하고 학습·추론하여 목표 달성을 위한 판단이나 행동을 수행하는 시스템을 가장 정확하게 설명한 것은?",
      "options": [
        "인공지능은 주어진 환경이나 데이터를 바탕으로 학습·추론하여 목표에 맞는 판단이나 행동을 수행할 수 있는 시스템이다.",
        "인공지능은 정답 label 없이 군집만 만드는 비지도학습 알고리즘을 뜻한다.",
        "인공지능은 입력 feature가 하나인 선형회귀 모델만을 뜻한다.",
        "인공지능은 사람이 작성한 모든 규칙을 그대로 실행하는 프로그램만을 뜻한다."
      ],
      "answer": 0,
      "explanation": "인공지능은 특정 알고리즘 하나가 아니라 인식·학습·추론을 활용해 목표에 맞는 판단이나 행동을 수행하는 시스템을 포괄한다.",
      "hint": "하나의 학습 방법이 아니라 더 넓은 시스템 개념을 묻고 있다."
    },
    {
      "id": "ai-ml-easy-007",
      "conceptId": "ml-commonality-easy-007",
      "difficulty": "easy",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "콘텐츠 추천과 이메일 스팸 분류가 기계학습 사례로 함께 묶이는 핵심 이유는?",
      "options": [
        "사람이 가능한 모든 상황의 규칙을 미리 작성하기 때문이다.",
        "과거 데이터에서 예측에 필요한 규칙이나 패턴을 학습하기 때문이다.",
        "두 문제 모두 정답 label이 없는 군집화 문제이기 때문이다.",
        "두 문제 모두 하나의 수치만 출력하는 회귀 문제이기 때문이다."
      ],
      "answer": 1,
      "explanation": "추천과 스팸 분류는 목표 출력은 다르지만 데이터에서 예측 규칙을 학습한다는 기계학습의 공통점을 가진다.",
      "hint": "사람이 규칙을 모두 작성하는 방식과 데이터에서 규칙을 찾는 방식을 구분한다."
    },
    {
      "id": "ai-ml-easy-019",
      "conceptId": "one-dimension-easy-019",
      "difficulty": "easy",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "multiple-choice",
      "prompt": "단일 피처 기반 1차원 학습에서 ‘1D’가 의미하는 것은?",
      "options": [
        "모델의 파라미터가 반드시 하나라는 뜻이다.",
        "훈련 데이터를 한 번만 사용한다는 뜻이다.",
        "입력 feature가 한 차원이라는 뜻이다.",
        "출력 label의 범주가 하나라는 뜻이다."
      ],
      "answer": 2,
      "explanation": "1D는 입력을 나타내는 feature 공간이 한 차원이라는 의미이며 학습 횟수나 label 개수를 뜻하지 않는다.",
      "hint": "D를 학습 횟수가 아니라 feature 공간의 dimension으로 해석한다."
    },
    {
      "id": "ai-ml-easy-024",
      "conceptId": "linear-regression-def-easy-024",
      "difficulty": "easy",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "선형회귀의 학습 목표를 가장 정확하게 설명한 것은?",
      "options": [
        "문장 속 다음 토큰의 확률 분포만 계산한다.",
        "정답 label 없이 관측치를 여러 군집으로 나눈다.",
        "입력을 확률값으로 바꿔 이진 범주만 예측한다.",
        "입력과 연속형 출력의 관계를 선형식으로 근사해 새로운 입력의 값을 예측한다."
      ],
      "answer": 3,
      "explanation": "선형회귀는 입력 feature와 연속형 label 사이의 관계를 선형식으로 학습하는 지도학습 방법이다.",
      "hint": "예측 대상이 연속형 수치인지 범주인지 먼저 확인한다."
    },
    {
      "id": "ai-ml-easy-029",
      "conceptId": "ad-question-relation-easy-029",
      "difficulty": "easy",
      "category": "2. 단순선형회귀",
      "questionType": "multiple-choice",
      "prompt": "광고비와 매출 데이터를 단순선형회귀로 분석하기에 가장 적절한 질문은?",
      "options": [
        "광고비가 증가할 때 평균 매출이 어떻게 변하는가?",
        "광고 문구를 주제별로 몇 개의 군집으로 나눌 수 있는가?",
        "광고 이미지가 스팸인지 정상인지 분류할 수 있는가?",
        "광고 문장을 생성할 때 다음 토큰은 무엇인가?"
      ],
      "answer": 0,
      "explanation": "광고비라는 하나의 입력과 연속형 매출 사이의 평균적인 선형 관계를 묻는 질문이 단순선형회귀에 해당한다.",
      "hint": "입력 변수가 하나이고 예측 대상이 연속형 수치인 보기를 찾는다."
    },
    {
      "id": "ai-ml-easy-057",
      "conceptId": "multiple-def-easy-057",
      "difficulty": "easy",
      "category": "3. 다중선형회귀",
      "questionType": "multiple-choice",
      "prompt": "다중선형회귀를 가장 정확하게 설명한 것은?",
      "options": [
        "입력 feature가 하나인 경우에만 사용할 수 있다.",
        "여러 입력 feature를 함께 사용해 하나의 연속형 label을 선형식으로 예측한다.",
        "정답 label 없이 관측치를 군집으로 나누는 방법이다.",
        "모든 입력을 신경망 hidden state로 변환하는 방법이다."
      ],
      "answer": 1,
      "explanation": "다중선형회귀는 두 개 이상의 입력 변수를 동시에 고려해 연속형 출력값을 예측하는 선형회귀 모델이다.",
      "hint": "입력 feature의 수와 출력 label의 형태를 함께 확인한다."
    },
    {
      "id": "ai-ml-easy-002",
      "conceptId": "ml-definition-easy-002",
      "difficulty": "easy",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "multiple-choice",
      "prompt": "사람이 추천 규칙을 일일이 작성하지 않고 사용자 행동 데이터에서 패턴을 학습해 추천 결과를 개선한다. 가장 적절한 설명은?",
      "options": [
        "반드시 여러 은닉층을 사용해야 하므로 모든 ML은 DL이다.",
        "데이터를 사용하지 않는 고정 규칙 기반 시스템이다.",
        "AI의 하위 범주에서 데이터로부터 예측 규칙을 학습하는 ML 사례다.",
        "정답 label이 없는 경우에만 가능한 비지도학습이다."
      ],
      "answer": 2,
      "explanation": "기계학습은 AI 범주 안에서 데이터로부터 패턴이나 규칙을 학습해 과제 성능을 개선하는 접근이다. 모든 기계학습이 신경망을 사용하는 것은 아니다.",
      "hint": "규칙을 사람이 직접 작성했는지 데이터에서 학습했는지 구분한다."
    },
    {
      "id": "ai-ml-easy-008",
      "conceptId": "ml-loop-order-easy-008",
      "difficulty": "easy",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "머신러닝 반복 개선 루프 순서로 옳은 것은?",
      "options": [
        "학습 → 모델 → 데이터 → 평가",
        "평가 → 데이터 → 학습 → 모델",
        "모델 → 데이터 → 평가 → 학습",
        "데이터 → 모델 → 학습 → 평가"
      ],
      "answer": 3,
      "explanation": "도식은 데이터→모델→학습→평가 흐름을 보여주며 평가 결과가 다시 모델 쪽 개선으로 이어진다.",
      "hint": "왼쪽에서 오른쪽으로 상자를 읽는다."
    },
    {
      "id": "ai-ml-easy-020",
      "conceptId": "single-feature-easy-020",
      "difficulty": "easy",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "multiple-choice",
      "prompt": "단일 피처 기반 학습을 가장 정확하게 설명한 것은?",
      "options": [
        "하나의 입력 feature와 label의 관계를 학습하는 가장 단순한 형태다.",
        "정답 label이 전혀 없는 데이터에서만 사용할 수 있다.",
        "입력 차원과 관계없이 출력 범주가 하나라는 뜻이다.",
        "모델 평가 없이 한 번만 학습하는 방법이다."
      ],
      "answer": 0,
      "explanation": "단일 피처 기반 학습에서 ‘단일’은 입력 feature의 수가 하나라는 의미다. label의 유무나 학습 횟수를 뜻하지 않는다.",
      "hint": "단일이라는 말이 입력 feature, 출력 label, 학습 횟수 중 무엇을 수식하는지 본다."
    },
    {
      "id": "ai-ml-easy-025",
      "conceptId": "supervised-core-easy-025",
      "difficulty": "easy",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "선형회귀가 지도학습의 기초 모델로 널리 사용되는 이유로 가장 적절한 것은?",
      "options": [
        "모든 비선형 관계를 오차 없이 표현할 수 있기 때문이다.",
        "입력과 연속형 출력의 관계를 비교적 단순한 식으로 표현해 예측과 계수 해석에 활용할 수 있기 때문이다.",
        "정답 label이 없어도 분류 정확도를 자동 계산하기 때문이다.",
        "입력 feature 수와 관계없이 항상 같은 예측값을 내기 때문이다."
      ],
      "answer": 1,
      "explanation": "선형회귀는 구조가 단순하고 계수의 의미를 해석하기 쉬워 연속형 예측의 기본 모델과 비교 기준으로 유용하다.",
      "hint": "모델의 단순성, 예측 가능성, 계수 해석 가능성을 함께 만족하는 보기를 찾는다."
    },
    {
      "id": "ai-ml-easy-030",
      "conceptId": "ad-question-strength-easy-030",
      "difficulty": "easy",
      "category": "2. 단순선형회귀",
      "questionType": "multiple-choice",
      "prompt": "광고비와 매출의 선형 관계가 얼마나 강한지 평가할 때 함께 살펴볼 수 있는 것은?",
      "options": [
        "feature 이름의 글자 수와 정렬 순서",
        "label을 제거했을 때 생기는 군집의 개수만",
        "회귀계수의 크기·불확실성과 모델의 설명력",
        "신경망 은닉층의 개수만"
      ],
      "answer": 2,
      "explanation": "관계의 방향과 크기는 회귀계수로, 추정의 불확실성과 모델 설명력은 표준오차·검정·R² 등의 정보로 함께 판단할 수 있다.",
      "hint": "관계의 크기와 모델이 데이터를 설명하는 정도를 나타내는 회귀 정보를 찾는다."
    },
    {
      "id": "ai-ml-easy-058",
      "conceptId": "simple-vs-multiple-easy-058",
      "difficulty": "easy",
      "category": "3. 다중선형회귀",
      "questionType": "multiple-choice",
      "prompt": "단순선형회귀와 다중선형회귀의 차이를 올바르게 설명한 것은?",
      "options": [
        "다중선형회귀에는 정답 label이 필요하지 않다.",
        "단순선형회귀는 분류만 하고 다중선형회귀는 군집화만 한다.",
        "두 방법의 차이는 훈련 데이터 행의 개수뿐이다.",
        "단순선형회귀는 입력 feature 하나를, 다중선형회귀는 입력 feature 여러 개를 사용한다."
      ],
      "answer": 3,
      "explanation": "두 모델 모두 연속형 값을 예측하지만 사용하는 입력 feature의 수가 하나인지 여러 개인지에서 차이가 난다.",
      "hint": "출력 유형이 아니라 입력 변수 개수를 비교한다."
    },
    {
      "id": "ai-ml-easy-003",
      "conceptId": "dl-definition-easy-003",
      "difficulty": "easy",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "multiple-choice",
      "prompt": "AI·ML·DL의 관계와 딥러닝의 특징을 올바르게 설명한 것은?",
      "options": [
        "DL은 ML에 포함되며 여러 층의 신경망을 이용해 데이터 표현과 예측 규칙을 학습한다.",
        "DL은 데이터를 사용하지 않는 규칙 기반 AI만을 뜻한다.",
        "DL과 ML은 서로 겹치지 않는 독립적인 분야다.",
        "DL은 입력 feature가 하나일 때만 사용할 수 있다."
      ],
      "answer": 0,
      "explanation": "딥러닝은 기계학습의 한 분야이며 다층 신경망을 이용한다. 따라서 포함 관계는 AI ⊃ ML ⊃ DL이다.",
      "hint": "가장 넓은 개념부터 신경망을 사용하는 하위 개념까지 순서대로 본다."
    },
    {
      "id": "ai-ml-easy-009",
      "conceptId": "ml-loop-feedback-easy-009",
      "difficulty": "easy",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "머신러닝 개발 과정에서 평가 결과를 확인한 다음 수행할 작업으로 가장 적절한 것은?",
      "options": [
        "평가 결과와 관계없이 같은 모델을 변경 없이 계속 사용한다.",
        "오류 유형을 분석해 데이터·feature·모델 또는 학습 설정을 수정하고 다시 평가한다.",
        "정답 label의 이름만 바꾸면 성능이 자동으로 향상된다.",
        "테스트 데이터를 학습 데이터로 반복 사용해 점수를 맞춘다."
      ],
      "answer": 1,
      "explanation": "머신러닝은 데이터 준비, 모델 학습, 평가, 개선을 반복하는 과정이다. 평가는 다음 개선 지점을 찾기 위한 근거로 사용된다.",
      "hint": "평가가 개발 과정의 끝인지 다음 개선을 위한 피드백인지 판단한다."
    },
    {
      "id": "ai-ml-easy-021",
      "conceptId": "education-income-easy-021",
      "difficulty": "easy",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "multiple-choice",
      "prompt": "교육연수로 소득을 예측하는 단일 피처 회귀에서 feature와 label을 올바르게 연결한 것은?",
      "options": [
        "feature=회귀계수, label=교육연수",
        "feature=소득, label=교육연수만 가능",
        "feature=교육연수, label=소득",
        "feature=오차항, label=모델 이름"
      ],
      "answer": 2,
      "explanation": "모델에 입력하는 교육연수가 feature이고 모델이 예측해야 하는 소득이 label이다.",
      "hint": "모델에 주어지는 값과 모델이 맞혀야 하는 값을 구분한다."
    },
    {
      "id": "ai-ml-easy-026",
      "conceptId": "linear-usefulness-easy-026",
      "difficulty": "easy",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "선형회귀의 장점을 가장 적절하게 설명한 것은?",
      "options": [
        "훈련 데이터가 없어도 계수를 자동으로 결정한다.",
        "출력이 항상 0과 1 사이이므로 모든 이진 분류에 완벽하다.",
        "복잡한 비선형 관계도 feature 변환 없이 항상 정확히 표현한다.",
        "연속형 예측에 사용할 수 있고 각 입력 변수의 계수를 통해 평균적인 관계를 해석할 수 있다."
      ],
      "answer": 3,
      "explanation": "선형회귀는 연속형 값을 예측하며 계수를 통해 입력과 출력의 평균적인 관계를 해석할 수 있다는 장점이 있다.",
      "hint": "선형회귀의 출력 형태와 계수가 제공하는 정보를 확인한다."
    },
    {
      "id": "ai-ml-easy-031",
      "conceptId": "ad-question-media-easy-031",
      "difficulty": "easy",
      "category": "2. 단순선형회귀",
      "questionType": "multiple-choice",
      "prompt": "TV·라디오·신문 광고비를 함께 사용해 매출을 예측할 때 각 매체의 평균적인 기여를 비교하는 데 직접 활용되는 것은?",
      "options": [
        "다른 매체의 광고비를 고정했을 때 각 변수의 회귀계수",
        "매체 이름을 알파벳순으로 정렬한 결과",
        "정답 label을 삭제한 뒤 얻은 클러스터 번호",
        "훈련 데이터의 행 순서"
      ],
      "answer": 0,
      "explanation": "다중선형회귀의 각 계수는 다른 입력 변수를 고정했을 때 해당 광고비가 한 단위 변함에 따른 평균 매출 변화량을 나타낸다.",
      "hint": "다른 입력을 고정한 상태에서 한 변수의 변화 효과를 나타내는 값을 찾는다."
    },
    {
      "id": "ai-ml-easy-076",
      "conceptId": "multiple-regression-structure-easy-v4",
      "difficulty": "easy",
      "category": "3. 다중선형회귀",
      "questionType": "multiple-choice",
      "prompt": "다음 중 다중선형회귀에 해당하는 사례는?",
      "options": [
        "TV 광고비 하나만으로 판매량을 예측한다",
        "TV와 Radio 광고비를 함께 사용해 판매량을 예측한다",
        "교육연수 하나만으로 소득을 본다",
        "메일 제목 하나를 그대로 출력한다"
      ],
      "answer": 1,
      "explanation": "여러 설명변수를 함께 고려하면 다중선형회귀다.",
      "hint": "입력 변수가 한 개인지 여러 개인지 센다."
    },
    {
      "id": "ai-ml-easy-004",
      "conceptId": "containment-easy-004",
      "difficulty": "easy",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "multiple-choice",
      "prompt": "포함 관계로 옳은 것은?",
      "options": [
        "DL ⊃ ML ⊃ AI",
        "ML ⊃ AI ⊃ DL",
        "AI ⊃ ML ⊃ DL",
        "AI와 ML과 DL은 서로 독립"
      ],
      "answer": 2,
      "explanation": "도식에서 AI가 가장 큰 범위이고 그 안에 ML, 다시 그 안에 DL이 위치한다.",
      "hint": "가장 바깥 원이 무엇인지 생각한다."
    },
    {
      "id": "ai-ml-easy-010",
      "conceptId": "data-importance-easy-010",
      "difficulty": "easy",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "데이터의 중요성을 설명한 내용으로 옳은 것은?",
      "options": [
        "피처는 정답 자체다",
        "데이터는 평가 이후에만 필요하다",
        "레이블은 예측에 사용되는 입력정보다",
        "데이터 분포와 관계는 학습 결과에 영향을 준다"
      ],
      "answer": 3,
      "explanation": "데이터의 Feature와 Label의 분포와 관계가 머신러닝 학습 결과를 결정한다고 설명한다.",
      "hint": "Feature와 Label의 역할을 구분한다."
    },
    {
      "id": "ai-ml-easy-022",
      "conceptId": "one-d-dataset-easy-022",
      "difficulty": "easy",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "multiple-choice",
      "prompt": "1D 피처 기반 학습 예시의 데이터셋은 무엇의 쌍으로 구성되는가?",
      "options": [
        "Years of Education과 Income",
        "TV와 Radio",
        "메일 제목과 발신자만",
        "AI와 DL"
      ],
      "answer": 0,
      "explanation": "Years of Education과 Income 쌍의 데이터로 설명한다.",
      "hint": "교육연수-소득 예시를 떠올린다."
    },
    {
      "id": "ai-ml-easy-027",
      "conceptId": "ad-example-easy-027",
      "difficulty": "easy",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "선형회귀를 적용하기에 가장 적절한 사례는?",
      "options": [
        "정답 없이 고객을 구매 성향별 군집으로 나눈다.",
        "광고비를 입력으로 사용해 연속형 매출액을 예측하고 두 변수의 평균적인 관계를 분석한다.",
        "이메일을 스팸과 정상 두 범주로만 분류한다.",
        "문장의 다음 토큰을 반복 생성한다."
      ],
      "answer": 1,
      "explanation": "광고비로 연속형 매출액을 예측하는 문제는 선형회귀의 대표적인 적용 사례다.",
      "hint": "예측 대상이 연속적인 수치인 사례를 찾는다."
    },
    {
      "id": "ai-ml-easy-032",
      "conceptId": "ad-question-future-easy-032",
      "difficulty": "easy",
      "category": "2. 단순선형회귀",
      "questionType": "multiple-choice",
      "prompt": "과거 광고비와 매출 데이터로 학습한 회귀 모델의 일반적인 사용 목적은?",
      "options": [
        "광고 매체 이름을 새로운 label로 생성한다.",
        "미래 데이터의 정답을 학습 전에 미리 복사한다.",
        "새로운 광고비 계획이 주어졌을 때 예상 매출을 예측한다.",
        "광고비와 매출을 항상 같은 값으로 만든다."
      ],
      "answer": 2,
      "explanation": "학습한 회귀식은 새로운 입력값에 대응하는 연속형 출력의 예상값을 예측하는 데 사용한다.",
      "hint": "학습한 입력·출력 관계를 처음 보는 입력에 적용하는 보기를 찾는다."
    },
    {
      "id": "ai-ml-easy-089",
      "conceptId": "multiple-regression-output-easy-v4",
      "difficulty": "easy",
      "category": "3. 다중선형회귀",
      "questionType": "multiple-choice",
      "prompt": "TV와 라디오 광고비를 입력으로 사용해 판매량을 예측하는 다중선형회귀에서 반응변수는?",
      "options": [
        "각 계수의 표준오차",
        "TV 광고비",
        "라디오 광고비",
        "판매량(Sales)"
      ],
      "answer": 3,
      "explanation": "반응변수는 모델이 예측하려는 출력값이므로 판매량이다. TV와 라디오 광고비는 설명변수다.",
      "hint": "모델에 주어지는 두 입력과 모델이 맞혀야 하는 출력값을 구분한다."
    },
    {
      "id": "ai-ml-easy-005",
      "conceptId": "ml-example-easy-005",
      "difficulty": "easy",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "multiple-choice",
      "prompt": "다음 중 ML의 예로 제시한 항목이 아닌 것은?",
      "options": [
        "최소제곱법 공식 자체",
        "언어 모델",
        "이미지 분류 모델",
        "생성형 AI"
      ],
      "answer": 0,
      "explanation": "생성형 AI, 언어 모델, 이미지 분류 모델, 추천 시스템 등을 ML 예로 제시한다.",
      "hint": "ML 예시 목록과 회귀 계산 방법을 구분한다."
    },
    {
      "id": "ai-ml-easy-011",
      "conceptId": "feature-definition-easy-011",
      "difficulty": "easy",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "Feature(피처, 특성)의 역할은?",
      "options": [
        "모델이 예측해야 하는 정답",
        "모델이 예측에 사용하는 입력정보",
        "평가 후 삭제하는 값",
        "항상 0인 절편"
      ],
      "answer": 1,
      "explanation": "Feature는 모델이 예측에 사용하는 입력정보이며 예측·판단의 근거 또는 단서다.",
      "hint": "입력과 목표값 중 어느 쪽인지 생각한다."
    },
    {
      "id": "ai-ml-easy-023",
      "conceptId": "one-d-function-easy-023",
      "difficulty": "easy",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "multiple-choice",
      "prompt": "교육연수와 소득 예시의 설명으로 옳은 것은?",
      "options": [
        "레이블을 사용하지 않는다",
        "교육연수를 소득과 무관한 상수로만 둔다",
        "소득을 교육연수의 함수와 오차항으로 표현한다",
        "피처가 두 개 이상이다"
      ],
      "answer": 2,
      "explanation": "Income_i = f*(Years of Education_i) + ε_i 형태가 제시된다.",
      "hint": "함수 f*와 ε가 함께 있는 식을 떠올린다."
    },
    {
      "id": "ai-ml-easy-028",
      "conceptId": "credit-example-easy-028",
      "difficulty": "easy",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "고객의 소득과 소비 패턴을 이용해 신용점수를 예측한다. 이 문제를 회귀로 볼 수 있는 조건은?",
      "options": [
        "입력 데이터를 사용하지 않고 평균값만 출력할 때",
        "고객을 정답 없이 여러 집단으로만 묶을 때",
        "신용점수를 높음·낮음 범주로만 구분할 때",
        "신용점수가 연속적인 수치로 주어지고 그 값을 예측할 때"
      ],
      "answer": 3,
      "explanation": "예측하려는 신용점수가 연속형 수치라면 회귀 문제다. 범주를 예측한다면 분류 문제로 보아야 한다.",
      "hint": "입력 변수보다 예측 대상 label의 형태를 먼저 확인한다."
    },
    {
      "id": "ai-ml-easy-033",
      "conceptId": "ad-question-synergy-easy-033",
      "difficulty": "easy",
      "category": "2. 단순선형회귀",
      "questionType": "multiple-choice",
      "prompt": "TV 광고와 라디오 광고를 함께 집행할 때의 효과가 두 광고 효과의 단순한 합보다 달라질 수 있다. 이를 회귀식에 반영하는 항은?",
      "options": [
        "TV×Radio 상호작용항",
        "절편만 있는 항",
        "정답 label 제거 항",
        "군집 중심 항"
      ],
      "answer": 0,
      "explanation": "한 변수의 효과가 다른 변수 값에 따라 달라지는 시너지는 두 변수를 곱한 상호작용항으로 모델링할 수 있다.",
      "hint": "두 입력 변수가 동시에 변할 때 나타나는 추가 효과를 표현하는 항을 찾는다."
    },
    {
      "id": "ai-ml-easy-061",
      "conceptId": "ai-term-easy-061",
      "difficulty": "easy",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "short-answer",
      "prompt": "Artificial Intelligence의 약어를 대문자로 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "AI"
      ],
      "explanation": "Artificial Intelligence의 약어는 AI다.",
      "hint": "인공지능의 영문 약어다."
    },
    {
      "id": "ai-ml-easy-064",
      "conceptId": "feature-term-easy-064",
      "difficulty": "easy",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "short-answer",
      "prompt": "모델이 예측에 사용하는 입력정보를 영어 용어로 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Feature"
      ],
      "explanation": "입력정보는 Feature로 설명된다.",
      "hint": "예측의 근거가 되는 입력이다."
    },
    {
      "id": "ai-ml-easy-071",
      "conceptId": "dimension-short-easy-071",
      "difficulty": "easy",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "short-answer",
      "prompt": "1D는 몇 차원을 의미하는지 숫자와 '차원'을 붙여 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "1차원"
      ],
      "explanation": "1D는 1차원이다.",
      "hint": "숫자 1과 dimension을 연결한다."
    },
    {
      "id": "ai-ml-easy-077",
      "conceptId": "intercept-symbol-easy-077",
      "difficulty": "easy",
      "category": "2. 단순선형회귀",
      "questionType": "short-answer",
      "prompt": "단순선형회귀 모형에서 절편을 나타내는 기호를 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "β₀",
        "β0"
      ],
      "explanation": "모형 Y = β₀ + β₁X + ε에서 β₀가 절편이다.",
      "hint": "아래첨자 0인 베타다."
    },
    {
      "id": "ai-ml-easy-062",
      "conceptId": "ml-term-easy-062",
      "difficulty": "easy",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "short-answer",
      "prompt": "Machine Learning의 약어를 대문자로 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "ML"
      ],
      "explanation": "Machine Learning의 약어는 ML이다.",
      "hint": "기계학습의 영문 약어다."
    },
    {
      "id": "ai-ml-easy-065",
      "conceptId": "label-term-easy-065",
      "difficulty": "easy",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "short-answer",
      "prompt": "모델이 예측해야 하는 정답 또는 학습 목표값을 영어 용어로 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Label"
      ],
      "explanation": "목표값은 Label로 설명된다.",
      "hint": "정답 역할을 하는 값이다."
    },
    {
      "id": "ai-ml-easy-091",
      "conceptId": "ai-ml-dl-essay-easy-091",
      "difficulty": "easy",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "essay",
      "prompt": "AI, ML, DL 포함 관계와 각 개념의 핵심 특징을 20자 이상으로 서술하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "AI",
        "ML",
        "DL"
      ],
      "modelAnswer": "AI가 가장 큰 범위이며 그 안에 ML, 다시 그 안에 DL이 포함된다. AI는 목표 달성을 위한 예측·행동 선택·계획을 수행하는 시스템이고, ML은 데이터에서 학습하는 접근이며, DL은 신경망을 이용하는 ML의 한 방법이다.",
      "rubricKeywords": [
        "AI",
        "ML",
        "DL",
        "신경망"
      ],
      "minLength": 20,
      "explanation": "포함관계 도식과 정의를 함께 설명해야 한다.",
      "hint": "세 개의 원이 어떻게 겹치는지 떠올린다."
    },
    {
      "id": "ai-ml-easy-092",
      "conceptId": "loop-essay-easy-092",
      "difficulty": "easy",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "essay",
      "prompt": "머신러닝의 반복 개선 루프를 단계 순서와 평가의 역할을 포함해 20자 이상으로 서술하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "데이터",
        "모델",
        "학습",
        "평가"
      ],
      "modelAnswer": "머신러닝은 데이터→모델→학습→평가 순서로 진행되며, 평가 결과를 바탕으로 모델과 학습 방법을 다시 개선하는 반복 구조를 가진다.",
      "rubricKeywords": [
        "데이터",
        "모델",
        "학습",
        "평가",
        "개선"
      ],
      "minLength": 20,
      "explanation": "네 단계와 평가 결과를 이용한 반복 개선을 모두 포함해야 한다.",
      "hint": "마지막 단계에서 처음 쪽으로 돌아가는 화살표를 떠올린다."
    },
    {
      "id": "ai-ml-easy-096",
      "conceptId": "one-d-essay-easy-096",
      "difficulty": "easy",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "essay",
      "prompt": "교육연수와 소득 예시를 이용해 1D 피처 기반 학습의 의미를 20자 이상으로 서술하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Years of Education",
        "Income"
      ],
      "modelAnswer": "1D 피처 기반 학습은 하나의 Feature를 사용하는 가장 단순한 학습 형태이다. 대표 예시에서는 Years of Education 하나를 입력으로 사용해 Income을 설명하거나 예측한다.",
      "rubricKeywords": [
        "1D",
        "Feature",
        "교육",
        "소득"
      ],
      "minLength": 20,
      "explanation": "하나의 피처라는 의미와 교육연수-소득 예시를 모두 포함해야 한다.",
      "hint": "1D와 가로축·세로축의 관계를 생각한다."
    },
    {
      "id": "ai-ml-easy-097",
      "conceptId": "simple-model-essay-easy-097",
      "difficulty": "easy",
      "category": "2. 단순선형회귀",
      "questionType": "essay",
      "prompt": "단순선형회귀 모형 Y = β₀ + β₁X + ε에서 β₀, β₁, ε의 의미를 20자 이상으로 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "β₀",
        "β₁",
        "ε"
      ],
      "modelAnswer": "β₀는 X=0일 때의 Y를 나타내는 절편이고, β₁는 X가 1단위 증가할 때 Y의 평균 변화량을 나타내는 기울기이며, ε는 직선으로 설명되지 않는 잔차 또는 오차 항이다.",
      "rubricKeywords": [
        "절편",
        "기울기",
        "잔차"
      ],
      "minLength": 20,
      "explanation": "세 기호의 역할을 각각 구분해 설명해야 한다.",
      "hint": "0일 때 값, 1단위 증가, 직선과의 차이를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-001",
      "conceptId": "supervised-learning",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "지도학습에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "연속적인 수치를 예측하면 회귀, 정해진 범주를 예측하면 분류로 구분하는 지도학습 문제 유형",
        "입력과 정답 라벨이 쌍으로 있는 데이터로 예측 규칙을 학습하고 새로운 데이터에 일반화하는 방법",
        "모델이 훈련 데이터에 지나치게 맞으면 과적합, 너무 단순해 중요한 패턴도 못 배우면 언더피팅인 상태",
        "관측치에서 시작해 가까운 클러스터를 단계적으로 병합하고 그 과정을 덴드로그램으로 나타내는 방법"
      ],
      "answer": 1,
      "explanation": "지도학습은 입력과 정답 라벨이 쌍으로 있는 데이터로 예측 규칙을 학습하고 새로운 데이터에 일반화하는 방법이다.",
      "hint": "2. 지도학습과 문제 유형의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-002",
      "conceptId": "supervised-learning",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 고객 정보와 실제 이탈 여부를 함께 학습해 다음 달 이탈 고객을 예측한다.",
      "options": [
        "회귀와 분류",
        "과적합과 언더피팅",
        "지도학습",
        "계층적 군집"
      ],
      "answer": 2,
      "explanation": "이 상황은 지도학습의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-003",
      "conceptId": "supervised-learning",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "지도학습에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "회귀와 분류는 대표적인 지도학습 문제다.",
        "훈련 데이터뿐 아니라 처음 보는 데이터에서도 정확히 예측하는 것이 목표다.",
        "각 학습 샘플에는 입력 feature와 정답 label이 함께 존재한다.",
        "정답 라벨 없이 데이터의 숨은 구조만 찾는 학습이다."
      ],
      "answer": 3,
      "explanation": "정답 라벨 없이 데이터의 숨은 구조만 찾는 학습이다.라는 설명은 지도학습의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-004",
      "conceptId": "regression-classification",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "회귀와 분류에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "연속적인 수치를 예측하면 회귀, 정해진 범주를 예측하면 분류로 구분하는 지도학습 문제 유형",
        "데이터를 K개 폴드로 나누고 각 폴드를 한 번씩 검증에 사용한 뒤 성능을 평균하는 평가 방법",
        "변수 단위 차이가 거리와 학습에 미치는 영향을 줄이도록 feature의 평균을 0, 분산을 1로 맞추는 변환",
        "모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수"
      ],
      "answer": 0,
      "explanation": "회귀와 분류은 연속적인 수치를 예측하면 회귀, 정해진 범주를 예측하면 분류로 구분하는 지도학습 문제 유형이다.",
      "hint": "2. 지도학습과 문제 유형의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-005",
      "conceptId": "regression-classification",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 주택 가격을 예측하는 문제와 이메일을 스팸 또는 정상으로 나누는 문제를 구분한다.",
      "options": [
        "K-겹 교차검증",
        "회귀와 분류",
        "표준화",
        "손실함수"
      ],
      "answer": 1,
      "explanation": "이 상황은 회귀와 분류의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-006",
      "conceptId": "regression-classification",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "회귀와 분류에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "스팸·정상처럼 유한한 범주를 예측하면 분류다.",
        "가격·점수·온도처럼 연속적인 수치를 예측하면 회귀다.",
        "회귀는 범주만 예측하고 분류는 연속적인 수치만 예측한다.",
        "문제 유형은 주로 예측 대상인 label의 성격으로 판단한다."
      ],
      "answer": 2,
      "explanation": "회귀는 범주만 예측하고 분류는 연속적인 수치만 예측한다.라는 설명은 회귀와 분류의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-007",
      "conceptId": "loss-functions",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "손실함수에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "정답 라벨 없이 입력 데이터의 구조·패턴·잠재 집단을 찾는 학습 방법",
        "선형 결합을 시그모이드에 통과시켜 0과 1 사이의 확률을 예측하는 이진 분류 모델",
        "이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표",
        "모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수"
      ],
      "answer": 3,
      "explanation": "손실함수은 모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수이다.",
      "hint": "2. 지도학습과 문제 유형의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-008",
      "conceptId": "loss-functions",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 회귀 모델은 MSE를, 분류 모델은 정답 범주의 예측 확률을 반영하는 교차 엔트로피를 줄이도록 학습한다.",
      "options": [
        "손실함수",
        "로지스틱 회귀",
        "혼동행렬",
        "비지도학습"
      ],
      "answer": 0,
      "explanation": "이 상황은 손실함수의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-009",
      "conceptId": "loss-functions",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "손실함수에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "손실값이 작을수록 예측이 정답에 가까운 것으로 해석한다.",
        "손실값은 클수록 모델의 예측 성능이 좋다.",
        "교차 엔트로피는 분류에서 정답 범주에 부여한 확률을 반영한다.",
        "MSE는 실제값과 예측값의 차이를 제곱해 평균한다."
      ],
      "answer": 1,
      "explanation": "손실값은 클수록 모델의 예측 성능이 좋다.라는 설명은 손실함수의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-010",
      "conceptId": "confusion-matrix",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "혼동행렬에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "입력이 0보다 작으면 0, 0 이상이면 입력을 그대로 출력해 신경망에 비선형성을 주는 활성화 함수",
        "학습에 사용하지 않은 새로운 데이터에서 측정한 예측 오류로 일반화 성능을 판단하는 기준",
        "이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표",
        "K개의 중심을 계산하고 각 관측치를 가장 가까운 중심에 재할당하는 과정을 반복하는 군집화 방법"
      ],
      "answer": 2,
      "explanation": "혼동행렬은 이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표이다.",
      "hint": "2. 지도학습과 문제 유형의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-011",
      "conceptId": "confusion-matrix",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 질병 환자가 매우 적은 데이터에서 정확도만 보지 않고 놓친 환자와 잘못 경고한 사람을 따로 계산한다.",
      "options": [
        "ReLU",
        "테스트 오류",
        "K-means",
        "혼동행렬"
      ],
      "answer": 3,
      "explanation": "이 상황은 혼동행렬의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-012",
      "conceptId": "confusion-matrix",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "혼동행렬에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "정확도가 99%이면 클래스 비율과 관계없이 항상 좋은 분류 모델이다.",
        "클래스가 불균형하면 높은 정확도만으로 좋은 모델이라고 단정하기 어렵다.",
        "FN은 실제 양성을 음성으로 잘못 예측한 경우다.",
        "정확도는 전체 예측 중 맞힌 예측의 비율이다."
      ],
      "answer": 0,
      "explanation": "정확도가 99%이면 클래스 비율과 관계없이 항상 좋은 분류 모델이다.라는 설명은 혼동행렬의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-013",
      "conceptId": "test-generalization",
      "difficulty": "easy",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "테스트 오류에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "모델이 훈련 데이터에 지나치게 맞으면 과적합, 너무 단순해 중요한 패턴도 못 배우면 언더피팅인 상태",
        "학습에 사용하지 않은 새로운 데이터에서 측정한 예측 오류로 일반화 성능을 판단하는 기준",
        "관측치에서 시작해 가까운 클러스터를 단계적으로 병합하고 그 과정을 덴드로그램으로 나타내는 방법",
        "손실함수의 기울기 반대 방향으로 파라미터를 반복 갱신해 손실을 줄이는 최적화 알고리즘"
      ],
      "answer": 1,
      "explanation": "테스트 오류은 학습에 사용하지 않은 새로운 데이터에서 측정한 예측 오류로 일반화 성능을 판단하는 기준이다.",
      "hint": "3. 검증과 일반화의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-014",
      "conceptId": "test-generalization",
      "difficulty": "easy",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 훈련 데이터에서는 오차가 작지만 별도로 보관한 새 데이터에서 오차가 크게 증가했는지 확인한다.",
      "options": [
        "과적합과 언더피팅",
        "계층적 군집",
        "테스트 오류",
        "경사하강법"
      ],
      "answer": 2,
      "explanation": "이 상황은 테스트 오류의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-easy-mc-015",
      "conceptId": "test-generalization",
      "difficulty": "easy",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "테스트 오류에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "훈련 오류와 테스트 오류의 차이는 과적합을 판단하는 단서가 된다.",
        "좋은 모델 선택의 목표는 새로운 데이터에서의 오류를 줄이는 것이다.",
        "테스트 데이터는 모델 학습에 직접 사용하지 않아야 한다.",
        "테스트 데이터로 반복 학습할수록 일반화 성능을 공정하게 평가할 수 있다."
      ],
      "answer": 3,
      "explanation": "테스트 데이터로 반복 학습할수록 일반화 성능을 공정하게 평가할 수 있다.라는 설명은 테스트 오류의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-easy-mc-016",
      "conceptId": "over-under-fitting",
      "difficulty": "easy",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "과적합과 언더피팅에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "모델이 훈련 데이터에 지나치게 맞으면 과적합, 너무 단순해 중요한 패턴도 못 배우면 언더피팅인 상태",
        "변수 단위 차이가 거리와 학습에 미치는 영향을 줄이도록 feature의 평균을 0, 분산을 1로 맞추는 변환",
        "출력의 손실에서 입력 방향으로 계산 그래프를 거슬러 가며 연쇄법칙으로 각 파라미터의 기울기를 구하는 절차",
        "데이터를 K개 폴드로 나누고 각 폴드를 한 번씩 검증에 사용한 뒤 성능을 평균하는 평가 방법"
      ],
      "answer": 0,
      "explanation": "과적합과 언더피팅은 모델이 훈련 데이터에 지나치게 맞으면 과적합, 너무 단순해 중요한 패턴도 못 배우면 언더피팅인 상태이다.",
      "hint": "3. 검증과 일반화의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-017",
      "conceptId": "over-under-fitting",
      "difficulty": "easy",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 매우 복잡한 모델은 훈련 오차가 작고 검증 오차가 크며, 지나치게 단순한 모델은 두 오차가 모두 크다.",
      "options": [
        "표준화",
        "과적합과 언더피팅",
        "역전파",
        "K-겹 교차검증"
      ],
      "answer": 1,
      "explanation": "이 상황은 과적합과 언더피팅의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-easy-mc-018",
      "conceptId": "over-under-fitting",
      "difficulty": "easy",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "과적합과 언더피팅에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "언더피팅은 훈련 오류와 테스트 오류가 모두 큰 경향이 있다.",
        "과적합은 대체로 훈련 오류가 작고 테스트 오류가 큰 상태다.",
        "모델을 복잡하게 만들면 과적합과 언더피팅이 항상 함께 해결된다.",
        "검증 성능을 보며 모델 복잡도나 학습 시점을 조절할 수 있다."
      ],
      "answer": 2,
      "explanation": "모델을 복잡하게 만들면 과적합과 언더피팅이 항상 함께 해결된다.라는 설명은 과적합과 언더피팅의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-easy-mc-019",
      "conceptId": "cross-validation",
      "difficulty": "easy",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "K-겹 교차검증에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "선형 결합을 시그모이드에 통과시켜 0과 1 사이의 확률을 예측하는 이진 분류 모델",
        "입력과 정답 라벨이 쌍으로 있는 데이터로 예측 규칙을 학습하고 새로운 데이터에 일반화하는 방법",
        "정답 라벨 없이 입력 데이터의 구조·패턴·잠재 집단을 찾는 학습 방법",
        "데이터를 K개 폴드로 나누고 각 폴드를 한 번씩 검증에 사용한 뒤 성능을 평균하는 평가 방법"
      ],
      "answer": 3,
      "explanation": "K-겹 교차검증은 데이터를 K개 폴드로 나누고 각 폴드를 한 번씩 검증에 사용한 뒤 성능을 평균하는 평가 방법이다.",
      "hint": "3. 검증과 일반화의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-020",
      "conceptId": "cross-validation",
      "difficulty": "easy",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 데이터가 적어 한 번의 검증셋 분할 결과가 불안정하므로 폴드를 바꾸어 K번 학습·평가한다.",
      "options": [
        "K-겹 교차검증",
        "지도학습",
        "비지도학습",
        "로지스틱 회귀"
      ],
      "answer": 0,
      "explanation": "이 상황은 K-겹 교차검증의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-easy-mc-021",
      "conceptId": "cross-validation",
      "difficulty": "easy",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "K-겹 교차검증에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "각 반복에서 한 폴드는 검증에, 나머지 폴드는 학습에 사용한다.",
        "모든 폴드를 동시에 검증셋으로 사용하고 학습은 한 번만 수행한다.",
        "K가 전체 샘플 수와 같으면 LOOCV가 된다.",
        "K번의 검증 결과를 평균해 일반화 성능을 추정한다."
      ],
      "answer": 1,
      "explanation": "모든 폴드를 동시에 검증셋으로 사용하고 학습은 한 번만 수행한다.라는 설명은 K-겹 교차검증의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-easy-mc-022",
      "conceptId": "unsupervised-learning",
      "difficulty": "easy",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "비지도학습에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "연속적인 수치를 예측하면 회귀, 정해진 범주를 예측하면 분류로 구분하는 지도학습 문제 유형",
        "K개의 중심을 계산하고 각 관측치를 가장 가까운 중심에 재할당하는 과정을 반복하는 군집화 방법",
        "정답 라벨 없이 입력 데이터의 구조·패턴·잠재 집단을 찾는 학습 방법",
        "입력이 0보다 작으면 0, 0 이상이면 입력을 그대로 출력해 신경망에 비선형성을 주는 활성화 함수"
      ],
      "answer": 2,
      "explanation": "비지도학습은 정답 라벨 없이 입력 데이터의 구조·패턴·잠재 집단을 찾는 학습 방법이다.",
      "hint": "4. 비지도학습과 군집화의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-023",
      "conceptId": "unsupervised-learning",
      "difficulty": "easy",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 고객의 실제 등급 정답 없이 구매 행동이 비슷한 고객끼리 묶어 시장을 나눈다.",
      "options": [
        "회귀와 분류",
        "K-means",
        "ReLU",
        "비지도학습"
      ],
      "answer": 3,
      "explanation": "이 상황은 비지도학습의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-024",
      "conceptId": "unsupervised-learning",
      "difficulty": "easy",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "비지도학습에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "항상 입력과 정답 라벨의 쌍으로 모델을 학습한다.",
        "정답 라벨이 없어 결과 해석과 평가가 더 어려울 수 있다.",
        "출력은 정답 예측보다 데이터의 구조나 요약에 가깝다.",
        "클러스터링과 차원 축소는 대표적인 비지도학습 과제다."
      ],
      "answer": 0,
      "explanation": "항상 입력과 정답 라벨의 쌍으로 모델을 학습한다.라는 설명은 비지도학습의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-025",
      "conceptId": "k-means",
      "difficulty": "easy",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "K-means에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "관측치에서 시작해 가까운 클러스터를 단계적으로 병합하고 그 과정을 덴드로그램으로 나타내는 방법",
        "K개의 중심을 계산하고 각 관측치를 가장 가까운 중심에 재할당하는 과정을 반복하는 군집화 방법",
        "손실함수의 기울기 반대 방향으로 파라미터를 반복 갱신해 손실을 줄이는 최적화 알고리즘",
        "모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수"
      ],
      "answer": 1,
      "explanation": "K-means은 K개의 중심을 계산하고 각 관측치를 가장 가까운 중심에 재할당하는 과정을 반복하는 군집화 방법이다.",
      "hint": "4. 비지도학습과 군집화의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-026",
      "conceptId": "k-means",
      "difficulty": "easy",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 클러스터 수 K를 먼저 정한 뒤 중심 계산과 재할당을 소속이 바뀌지 않을 때까지 반복한다.",
      "options": [
        "계층적 군집",
        "경사하강법",
        "K-means",
        "손실함수"
      ],
      "answer": 2,
      "explanation": "이 상황은 K-means의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-027",
      "conceptId": "k-means",
      "difficulty": "easy",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "K-means에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "초기 중심에 따라 최종 군집 결과가 달라질 수 있어 여러 번 시도할 수 있다.",
        "각 클러스터의 중심은 보통 소속 관측치의 feature 평균으로 계산한다.",
        "클러스터 수 K를 학습 전에 정해야 한다.",
        "클러스터 수를 정하지 않아도 덴드로그램이 자동으로 K를 결정한다."
      ],
      "answer": 3,
      "explanation": "클러스터 수를 정하지 않아도 덴드로그램이 자동으로 K를 결정한다.라는 설명은 K-means의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-028",
      "conceptId": "hierarchical-clustering",
      "difficulty": "easy",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "계층적 군집에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "관측치에서 시작해 가까운 클러스터를 단계적으로 병합하고 그 과정을 덴드로그램으로 나타내는 방법",
        "출력의 손실에서 입력 방향으로 계산 그래프를 거슬러 가며 연쇄법칙으로 각 파라미터의 기울기를 구하는 절차",
        "이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표",
        "변수 단위 차이가 거리와 학습에 미치는 영향을 줄이도록 feature의 평균을 0, 분산을 1로 맞추는 변환"
      ],
      "answer": 0,
      "explanation": "계층적 군집은 관측치에서 시작해 가까운 클러스터를 단계적으로 병합하고 그 과정을 덴드로그램으로 나타내는 방법이다.",
      "hint": "4. 비지도학습과 군집화의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-029",
      "conceptId": "hierarchical-clustering",
      "difficulty": "easy",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 각 관측치를 하나의 클러스터로 시작해 가장 유사한 두 집단을 병합하고 원하는 높이에서 덴드로그램을 자른다.",
      "options": [
        "역전파",
        "계층적 군집",
        "혼동행렬",
        "표준화"
      ],
      "answer": 1,
      "explanation": "이 상황은 계층적 군집의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-030",
      "conceptId": "hierarchical-clustering",
      "difficulty": "easy",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "계층적 군집에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "Single·Complete·Average linkage는 클러스터 간 거리를 다르게 정의한다.",
        "상향식 방법은 관측치별 클러스터에서 시작해 하나가 될 때까지 병합한다.",
        "항상 클러스터 수 K를 먼저 고정하고 중심점을 반복 갱신한다.",
        "linkage 선택에 따라 같은 데이터의 덴드로그램도 달라질 수 있다."
      ],
      "answer": 2,
      "explanation": "항상 클러스터 수 K를 먼저 고정하고 중심점을 반복 갱신한다.라는 설명은 계층적 군집의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-031",
      "conceptId": "scaling-pca",
      "difficulty": "easy",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "표준화에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "입력과 정답 라벨이 쌍으로 있는 데이터로 예측 규칙을 학습하고 새로운 데이터에 일반화하는 방법",
        "학습에 사용하지 않은 새로운 데이터에서 측정한 예측 오류로 일반화 성능을 판단하는 기준",
        "선형 결합을 시그모이드에 통과시켜 0과 1 사이의 확률을 예측하는 이진 분류 모델",
        "변수 단위 차이가 거리와 학습에 미치는 영향을 줄이도록 feature의 평균을 0, 분산을 1로 맞추는 변환"
      ],
      "answer": 3,
      "explanation": "표준화은 변수 단위 차이가 거리와 학습에 미치는 영향을 줄이도록 feature의 평균을 0, 분산을 1로 맞추는 변환이다.",
      "hint": "4. 비지도학습과 군집화의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-032",
      "conceptId": "scaling-pca",
      "difficulty": "easy",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 연소득과 방문 횟수처럼 단위와 범위가 크게 다른 변수를 거리 기반 군집화 전에 같은 척도로 바꾼다.",
      "options": [
        "표준화",
        "테스트 오류",
        "로지스틱 회귀",
        "지도학습"
      ],
      "answer": 0,
      "explanation": "이 상황은 표준화의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-033",
      "conceptId": "scaling-pca",
      "difficulty": "easy",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "표준화에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "거리 기반 알고리즘은 변수의 단위와 범위 차이에 민감할 수 있다.",
        "표준화는 정답 라벨을 자동으로 생성하는 과정이다.",
        "PCA는 정보를 가능한 한 보존하며 더 적은 주성분으로 차원을 줄인다.",
        "표준화는 일반적으로 각 feature의 평균을 0, 분산을 1로 맞춘다."
      ],
      "answer": 1,
      "explanation": "표준화는 정답 라벨을 자동으로 생성하는 과정이다.라는 설명은 표준화의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-easy-mc-034",
      "conceptId": "logistic-regression",
      "difficulty": "easy",
      "category": "5. 로지스틱 회귀",
      "questionType": "multiple-choice",
      "prompt": "로지스틱 회귀에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "모델이 훈련 데이터에 지나치게 맞으면 과적합, 너무 단순해 중요한 패턴도 못 배우면 언더피팅인 상태",
        "입력이 0보다 작으면 0, 0 이상이면 입력을 그대로 출력해 신경망에 비선형성을 주는 활성화 함수",
        "선형 결합을 시그모이드에 통과시켜 0과 1 사이의 확률을 예측하는 이진 분류 모델",
        "연속적인 수치를 예측하면 회귀, 정해진 범주를 예측하면 분류로 구분하는 지도학습 문제 유형"
      ],
      "answer": 2,
      "explanation": "로지스틱 회귀은 선형 결합을 시그모이드에 통과시켜 0과 1 사이의 확률을 예측하는 이진 분류 모델이다.",
      "hint": "5. 로지스틱 회귀의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-035",
      "conceptId": "logistic-regression",
      "difficulty": "easy",
      "category": "5. 로지스틱 회귀",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 신용카드 사용량을 입력해 연체 확률을 계산하고 임계값에 따라 연체 여부를 분류한다.",
      "options": [
        "과적합과 언더피팅",
        "ReLU",
        "회귀와 분류",
        "로지스틱 회귀"
      ],
      "answer": 3,
      "explanation": "이 상황은 로지스틱 회귀의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 선형 결합, 시그모이드, odds와 logit의 연결."
    },
    {
      "id": "w1-refresh-easy-mc-036",
      "conceptId": "logistic-regression",
      "difficulty": "easy",
      "category": "5. 로지스틱 회귀",
      "questionType": "multiple-choice",
      "prompt": "로지스틱 회귀에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "모델 출력이 음의 무한대부터 양의 무한대까지라 확률로 해석할 수 없다.",
        "모수는 데이터의 likelihood를 최대화하는 MLE로 추정할 수 있다.",
        "확률의 odds에 로그를 취한 logit은 입력의 선형 결합으로 표현된다.",
        "시그모이드는 모든 실수 입력을 0과 1 사이 값으로 변환한다."
      ],
      "answer": 0,
      "explanation": "모델 출력이 음의 무한대부터 양의 무한대까지라 확률로 해석할 수 없다.라는 설명은 로지스틱 회귀의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 선형 결합, 시그모이드, odds와 logit의 연결."
    },
    {
      "id": "w1-refresh-easy-mc-037",
      "conceptId": "neural-network",
      "difficulty": "easy",
      "category": "6. 신경망 구조와 표현력",
      "questionType": "multiple-choice",
      "prompt": "ReLU에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "손실함수의 기울기 반대 방향으로 파라미터를 반복 갱신해 손실을 줄이는 최적화 알고리즘",
        "입력이 0보다 작으면 0, 0 이상이면 입력을 그대로 출력해 신경망에 비선형성을 주는 활성화 함수",
        "모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수",
        "데이터를 K개 폴드로 나누고 각 폴드를 한 번씩 검증에 사용한 뒤 성능을 평균하는 평가 방법"
      ],
      "answer": 1,
      "explanation": "ReLU은 입력이 0보다 작으면 0, 0 이상이면 입력을 그대로 출력해 신경망에 비선형성을 주는 활성화 함수이다.",
      "hint": "6. 신경망 구조와 표현력의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-038",
      "conceptId": "neural-network",
      "difficulty": "easy",
      "category": "6. 신경망 구조와 표현력",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 은닉 유닛의 선형 결합마다 활성화 함수를 적용해 여러 조각의 선형 구간으로 복잡한 함수를 표현한다.",
      "options": [
        "경사하강법",
        "손실함수",
        "ReLU",
        "K-겹 교차검증"
      ],
      "answer": 2,
      "explanation": "이 상황은 ReLU의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-easy-mc-039",
      "conceptId": "neural-network",
      "difficulty": "easy",
      "category": "6. 신경망 구조와 표현력",
      "questionType": "multiple-choice",
      "prompt": "ReLU에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "깊은 네트워크는 층별 함수를 합성해 비슷한 파라미터 수로 더 많은 선형 구역을 만들 수 있다.",
        "은닉층이 하나인 네트워크를 shallow network라고 부를 수 있다.",
        "은닉층의 활성화 함수는 단순한 선형 결합만으로는 만들 수 없는 표현을 가능하게 한다.",
        "활성화 함수가 없어도 선형층을 여러 개 쌓으면 항상 복잡한 비선형 함수가 된다."
      ],
      "answer": 3,
      "explanation": "활성화 함수가 없어도 선형층을 여러 개 쌓으면 항상 복잡한 비선형 함수가 된다.라는 설명은 ReLU의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-easy-mc-040",
      "conceptId": "gradient-descent",
      "difficulty": "easy",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "경사하강법에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "손실함수의 기울기 반대 방향으로 파라미터를 반복 갱신해 손실을 줄이는 최적화 알고리즘",
        "이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표",
        "정답 라벨 없이 입력 데이터의 구조·패턴·잠재 집단을 찾는 학습 방법",
        "출력의 손실에서 입력 방향으로 계산 그래프를 거슬러 가며 연쇄법칙으로 각 파라미터의 기울기를 구하는 절차"
      ],
      "answer": 0,
      "explanation": "경사하강법은 손실함수의 기울기 반대 방향으로 파라미터를 반복 갱신해 손실을 줄이는 최적화 알고리즘이다.",
      "hint": "7. 최적화와 역전파의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-041",
      "conceptId": "gradient-descent",
      "difficulty": "easy",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 현재 파라미터에서 미분값을 구하고 학습률을 곱한 만큼 반대 방향으로 이동한다.",
      "options": [
        "혼동행렬",
        "경사하강법",
        "비지도학습",
        "역전파"
      ],
      "answer": 1,
      "explanation": "이 상황은 경사하강법의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-easy-mc-042",
      "conceptId": "gradient-descent",
      "difficulty": "easy",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "경사하강법에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "학습률은 한 번의 업데이트에서 이동하는 크기를 조절한다.",
        "기울기는 손실이 가장 빠르게 증가하는 방향이므로 그 반대로 이동한다.",
        "손실을 줄이기 위해 항상 기울기와 같은 방향으로 이동한다.",
        "미니배치 SGD는 일부 샘플로 기울기를 추정해 계산량과 경로의 노이즈를 만든다."
      ],
      "answer": 2,
      "explanation": "손실을 줄이기 위해 항상 기울기와 같은 방향으로 이동한다.라는 설명은 경사하강법의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-easy-mc-043",
      "conceptId": "backpropagation",
      "difficulty": "easy",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "역전파에 대한 설명으로 가장 적절한 것은?",
      "options": [
        "학습에 사용하지 않은 새로운 데이터에서 측정한 예측 오류로 일반화 성능을 판단하는 기준",
        "K개의 중심을 계산하고 각 관측치를 가장 가까운 중심에 재할당하는 과정을 반복하는 군집화 방법",
        "입력과 정답 라벨이 쌍으로 있는 데이터로 예측 규칙을 학습하고 새로운 데이터에 일반화하는 방법",
        "출력의 손실에서 입력 방향으로 계산 그래프를 거슬러 가며 연쇄법칙으로 각 파라미터의 기울기를 구하는 절차"
      ],
      "answer": 3,
      "explanation": "역전파은 출력의 손실에서 입력 방향으로 계산 그래프를 거슬러 가며 연쇄법칙으로 각 파라미터의 기울기를 구하는 절차이다.",
      "hint": "7. 최적화와 역전파의 정의와 입력·출력의 관계를 떠올린다."
    },
    {
      "id": "w1-refresh-easy-mc-044",
      "conceptId": "backpropagation",
      "difficulty": "easy",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "다음 상황에 가장 알맞은 개념은? 순전파로 예측과 손실을 계산한 뒤 출력층부터 은닉층 방향으로 각 가중치의 미분값을 전달한다.",
      "options": [
        "역전파",
        "K-means",
        "지도학습",
        "테스트 오류"
      ],
      "answer": 0,
      "explanation": "이 상황은 역전파의 핵심 절차 또는 사용 목적에 해당한다.",
      "hint": "비슷한 용어의 역할을 대조한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-easy-mc-045",
      "conceptId": "backpropagation",
      "difficulty": "easy",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "역전파에 대한 설명으로 옳지 않은 것은?",
      "options": [
        "순전파는 입력에서 출력 방향으로 예측값과 손실을 계산한다.",
        "역전파는 입력에서 출력 방향으로 예측값만 만드는 과정이다.",
        "Early stopping은 검증 성능이 더 이상 좋아지지 않을 때 학습을 멈춰 과적합을 줄인다.",
        "역전파는 연쇄법칙을 이용해 각 층 파라미터의 기울기를 효율적으로 구한다."
      ],
      "answer": 1,
      "explanation": "역전파는 입력에서 출력 방향으로 예측값만 만드는 과정이다.라는 설명은 역전파의 정의와 맞지 않는다.",
      "hint": "핵심 동작을 먼저 찾는다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-easy-mc-046",
      "conceptId": "supervised-learning",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "주택 가격 예측 데이터에서 면적·방 수·연식과 실제 거래 가격의 역할을 올바르게 연결한 것은?",
      "options": [
        "면적·방 수·연식은 label이고 실제 거래 가격은 feature다.",
        "모든 값이 label이므로 feature는 없다.",
        "면적·방 수·연식은 feature이고 실제 거래 가격은 label이다.",
        "실제 거래 가격은 손실함수이고 정답 label은 없다."
      ],
      "answer": 2,
      "explanation": "예측에 사용하는 면적·방 수·연식은 feature이고, 예측하려는 실제 거래 가격은 label이다.",
      "hint": "모델에 넣는 정보와 모델이 맞혀야 하는 정답을 구분한다."
    },
    {
      "id": "w1-refresh-easy-short-001",
      "conceptId": "supervised-learning",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "short-answer",
      "prompt": "다음 정의에 해당하는 용어를 작성하시오. 입력과 정답 라벨이 쌍으로 있는 데이터로 예측 규칙을 학습하고 새로운 데이터에 일반화하는 방법",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "지도학습",
        "supervised learning",
        "지도 학습"
      ],
      "explanation": "정답은 지도학습이다. 입력과 정답 라벨이 쌍으로 있는 데이터로 예측 규칙을 학습하고 새로운 데이터에 일반화하는 방법이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-easy-short-002",
      "conceptId": "regression-classification",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "short-answer",
      "prompt": "다음 정의에 해당하는 용어를 작성하시오. 연속적인 수치를 예측하면 회귀, 정해진 범주를 예측하면 분류로 구분하는 지도학습 문제 유형",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "회귀와 분류",
        "regression and classification",
        "회귀/분류"
      ],
      "explanation": "정답은 회귀와 분류이다. 연속적인 수치를 예측하면 회귀, 정해진 범주를 예측하면 분류로 구분하는 지도학습 문제 유형이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-easy-short-003",
      "conceptId": "loss-functions",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "short-answer",
      "prompt": "다음 정의에 해당하는 용어를 작성하시오. 모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "손실함수",
        "loss function",
        "손실 함수"
      ],
      "explanation": "정답은 손실함수이다. 모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-easy-short-004",
      "conceptId": "confusion-matrix",
      "difficulty": "easy",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "short-answer",
      "prompt": "다음 정의에 해당하는 용어를 작성하시오. 이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "혼동행렬",
        "confusion matrix",
        "오차행렬"
      ],
      "explanation": "정답은 혼동행렬이다. 이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-easy-short-005",
      "conceptId": "test-generalization",
      "difficulty": "easy",
      "category": "3. 검증과 일반화",
      "questionType": "short-answer",
      "prompt": "다음 정의에 해당하는 용어를 작성하시오. 학습에 사용하지 않은 새로운 데이터에서 측정한 예측 오류로 일반화 성능을 판단하는 기준",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "테스트 오류",
        "test error",
        "일반화 오류"
      ],
      "explanation": "정답은 테스트 오류이다. 학습에 사용하지 않은 새로운 데이터에서 측정한 예측 오류로 일반화 성능을 판단하는 기준이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-easy-short-006",
      "conceptId": "over-under-fitting",
      "difficulty": "easy",
      "category": "3. 검증과 일반화",
      "questionType": "short-answer",
      "prompt": "다음 정의에 해당하는 용어를 작성하시오. 모델이 훈련 데이터에 지나치게 맞으면 과적합, 너무 단순해 중요한 패턴도 못 배우면 언더피팅인 상태",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "과적합과 언더피팅",
        "overfitting and underfitting",
        "오버피팅과 언더피팅"
      ],
      "explanation": "정답은 과적합과 언더피팅이다. 모델이 훈련 데이터에 지나치게 맞으면 과적합, 너무 단순해 중요한 패턴도 못 배우면 언더피팅인 상태이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-easy-short-007",
      "conceptId": "cross-validation",
      "difficulty": "easy",
      "category": "3. 검증과 일반화",
      "questionType": "short-answer",
      "prompt": "다음 정의에 해당하는 용어를 작성하시오. 데이터를 K개 폴드로 나누고 각 폴드를 한 번씩 검증에 사용한 뒤 성능을 평균하는 평가 방법",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "K-겹 교차검증",
        "k-fold cross-validation",
        "K-fold 교차검증",
        "교차검증"
      ],
      "explanation": "정답은 K-겹 교차검증이다. 데이터를 K개 폴드로 나누고 각 폴드를 한 번씩 검증에 사용한 뒤 성능을 평균하는 평가 방법이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-easy-short-008",
      "conceptId": "unsupervised-learning",
      "difficulty": "easy",
      "category": "4. 비지도학습과 군집화",
      "questionType": "short-answer",
      "prompt": "다음 정의에 해당하는 용어를 작성하시오. 정답 라벨 없이 입력 데이터의 구조·패턴·잠재 집단을 찾는 학습 방법",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "비지도학습",
        "unsupervised learning",
        "비지도 학습"
      ],
      "explanation": "정답은 비지도학습이다. 정답 라벨 없이 입력 데이터의 구조·패턴·잠재 집단을 찾는 학습 방법이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-easy-short-009",
      "conceptId": "k-means",
      "difficulty": "easy",
      "category": "4. 비지도학습과 군집화",
      "questionType": "short-answer",
      "prompt": "다음 정의에 해당하는 용어를 작성하시오. K개의 중심을 계산하고 각 관측치를 가장 가까운 중심에 재할당하는 과정을 반복하는 군집화 방법",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "K-means",
        "K-평균",
        "k-means clustering",
        "K-means 클러스터링"
      ],
      "explanation": "정답은 K-means이다. K개의 중심을 계산하고 각 관측치를 가장 가까운 중심에 재할당하는 과정을 반복하는 군집화 방법이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-easy-essay-001",
      "conceptId": "integrated-easy-1",
      "difficulty": "easy",
      "category": "8. 핵심 개념 서술",
      "questionType": "essay",
      "prompt": "지도학습에서 feature와 label이 각각 어떤 역할을 하는지 예시와 함께 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "지도학습은 feature를 입력으로 사용해 label을 예측하는 규칙을 학습한다. 예를 들어 주택 면적과 연식을 feature로 사용하고 실제 가격을 label로 두어 새 주택의 가격을 예측할 수 있다.",
      "rubricKeywords": [
        "feature",
        "label",
        "입력",
        "정답"
      ],
      "minLength": 30,
      "explanation": "모범답안에는 feature, label, 입력, 정답의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: feature, label, 입력, 정답."
    },
    {
      "id": "w1-refresh-easy-essay-002",
      "conceptId": "integrated-easy-2",
      "difficulty": "easy",
      "category": "8. 핵심 개념 서술",
      "questionType": "essay",
      "prompt": "회귀와 분류의 차이를 예측 대상과 예시를 중심으로 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "회귀는 가격이나 온도처럼 연속적인 수치를 예측하고, 분류는 스팸·정상처럼 정해진 범주를 예측한다. 문제 유형은 주로 label의 성격으로 구분한다.",
      "rubricKeywords": [
        "회귀",
        "분류",
        "연속",
        "범주"
      ],
      "minLength": 30,
      "explanation": "모범답안에는 회귀, 분류, 연속, 범주의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: 회귀, 분류, 연속, 범주."
    },
    {
      "id": "w1-refresh-easy-essay-003",
      "conceptId": "integrated-easy-3",
      "difficulty": "easy",
      "category": "8. 핵심 개념 서술",
      "questionType": "essay",
      "prompt": "과적합과 언더피팅의 훈련 오류·테스트 오류 특징을 비교하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "과적합은 훈련 오류는 작지만 테스트 오류가 커지는 경향이 있고, 언더피팅은 모델이 너무 단순해 훈련 오류와 테스트 오류가 모두 큰 경향이 있다.",
      "rubricKeywords": [
        "과적합",
        "언더피팅",
        "훈련 오류",
        "테스트 오류"
      ],
      "minLength": 30,
      "explanation": "모범답안에는 과적합, 언더피팅, 훈련 오류, 테스트 오류의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: 과적합, 언더피팅, 훈련 오류, 테스트 오류."
    },
    {
      "id": "w1-refresh-easy-essay-004",
      "conceptId": "integrated-easy-4",
      "difficulty": "easy",
      "category": "8. 핵심 개념 서술",
      "questionType": "essay",
      "prompt": "K-means의 중심 계산과 재할당 과정을 순서대로 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "K를 정하고 중심을 초기화한 뒤, 각 관측치를 가장 가까운 중심에 할당한다. 소속 관측치의 평균으로 중심을 다시 계산하고 할당이 바뀌지 않을 때까지 반복한다.",
      "rubricKeywords": [
        "K",
        "중심",
        "재할당",
        "반복"
      ],
      "minLength": 30,
      "explanation": "모범답안에는 K, 중심, 재할당, 반복의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: K, 중심, 재할당, 반복."
    },
    {
      "id": "w1-refresh-easy-essay-005",
      "conceptId": "integrated-easy-5",
      "difficulty": "easy",
      "category": "8. 핵심 개념 서술",
      "questionType": "essay",
      "prompt": "로지스틱 회귀가 이진 분류에 적합한 이유를 시그모이드 출력 범위와 연결해 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "선형 결합을 시그모이드에 통과시키면 출력이 0과 1 사이가 되어 양성일 확률로 해석할 수 있으므로 이진 분류에 적합하다.",
      "rubricKeywords": [
        "시그모이드",
        "0",
        "1",
        "확률"
      ],
      "minLength": 30,
      "explanation": "모범답안에는 시그모이드, 0, 1, 확률의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: 시그모이드, 0, 1, 확률."
    },
    {
      "id": "w1-refresh-easy-essay-006",
      "conceptId": "integrated-easy-6",
      "difficulty": "easy",
      "category": "8. 핵심 개념 서술",
      "questionType": "essay",
      "prompt": "경사하강법에서 기울기와 학습률이 하는 일을 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "기울기는 손실이 증가하는 방향을 나타내므로 파라미터는 그 반대로 이동한다. 학습률은 한 번의 업데이트에서 이동할 크기를 정한다.",
      "rubricKeywords": [
        "기울기",
        "반대 방향",
        "학습률",
        "업데이트"
      ],
      "minLength": 30,
      "explanation": "모범답안에는 기울기, 반대 방향, 학습률, 업데이트의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: 기울기, 반대 방향, 학습률, 업데이트."
    }
  ],
  "medium": [
    {
      "id": "ai-ml-medium-001",
      "conceptId": "compare-ai-ml-medium-001",
      "difficulty": "medium",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "multiple-choice",
      "prompt": "어떤 시스템이 사람이 모든 규칙을 직접 입력하지 않고 과거 데이터에서 패턴을 학습해 추천을 개선한다. 개념상 가장 적절한 것은?",
      "options": [
        "단순히 평가 단계만 수행",
        "AI 중 ML이 아닌 규칙 기반 시스템",
        "최소제곱법의 잔차",
        "ML 접근"
      ],
      "answer": 3,
      "explanation": "데이터로부터 규칙을 학습해 성능을 향상하는 것은 ML 특징과 일치한다.",
      "hint": "'데이터에서 규칙을 학습'이라는 공통점을 본다."
    },
    {
      "id": "ai-ml-medium-004",
      "conceptId": "loop-evaluation-use-medium-004",
      "difficulty": "medium",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "모델 성능 평가가 좋지 않아 모델 구조나 학습 방법을 다시 조정했다. 반복 개선 루프에서 이 행동을 가장 잘 설명하는 것은?",
      "options": [
        "평가 결과를 모델 개선에 피드백한다",
        "Label을 Feature로 바꾼다",
        "데이터 단계를 제거한다",
        "AI를 ML 밖으로 이동한다"
      ],
      "answer": 0,
      "explanation": "평가 결과를 바탕으로 모델과 학습 방법을 반복적으로 개선하는 구조가 제시된다.",
      "hint": "평가에서 되돌아가는 화살표를 본다."
    },
    {
      "id": "ai-ml-medium-011",
      "conceptId": "one-d-identify-medium-011",
      "difficulty": "medium",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "multiple-choice",
      "prompt": "교육연수만 입력으로 사용하고 소득을 예측하는 모델은 어떤 형태에 해당하는가?",
      "options": [
        "반드시 다중선형회귀",
        "1D 피처 기반 학습",
        "Label이 없는 학습",
        "규칙 기반 AI만"
      ],
      "answer": 1,
      "explanation": "하나의 Feature인 Years of Education으로 Income을 예측하는 예시가 1D 학습으로 제시된다.",
      "hint": "입력 피처가 몇 개인지 센다."
    },
    {
      "id": "ai-ml-medium-013",
      "conceptId": "linear-vs-classification-medium-013",
      "difficulty": "medium",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "광고비와 매출의 관계를 직선으로 근사해 미래 매출을 예측하려는 목적에 가장 직접적으로 맞는 방법은?",
      "options": [
        "AI 포함관계 도식",
        "스팸 분류 Label 자체",
        "선형회귀",
        "유튜브 장르 Feature만"
      ],
      "answer": 2,
      "explanation": "광고비와 매출 관계를 선형회귀의 대표 예로 제시한다.",
      "hint": "산점도 위의 직선을 떠올린다."
    },
    {
      "id": "ai-ml-medium-019",
      "conceptId": "simple-count-medium-019",
      "difficulty": "medium",
      "category": "2. 단순선형회귀",
      "questionType": "multiple-choice",
      "prompt": "설명변수 X가 정확히 하나이고 반응변수 Y도 하나인 선형회귀는?",
      "options": [
        "규칙 기반 AI",
        "다중선형회귀",
        "DL",
        "단순선형회귀"
      ],
      "answer": 3,
      "explanation": "단순선형회귀는 한 개의 X와 한 개의 Y 사이 선형 관계를 찾는다.",
      "hint": "설명변수의 수를 센다."
    },
    {
      "id": "ai-ml-medium-020",
      "conceptId": "multiple-count-medium-020",
      "difficulty": "medium",
      "category": "3. 다중선형회귀",
      "questionType": "multiple-choice",
      "prompt": "매출 예측에 TV와 Radio 두 설명변수를 동시에 사용하는 경우 가장 알맞은 것은?",
      "options": [
        "다중선형회귀",
        "단순선형회귀",
        "1D 피처 기반 학습",
        "Label만 있는 학습"
      ],
      "answer": 0,
      "explanation": "여러 입력 변수를 함께 고려하는 것은 다중선형회귀다.",
      "hint": "입력이 둘 이상인지 본다."
    },
    {
      "id": "ai-ml-medium-089",
      "conceptId": "correlation-causation-scenario-medium-v4",
      "difficulty": "medium",
      "category": "4. 선형회귀 주의사항",
      "questionType": "multiple-choice",
      "prompt": "TV 광고비와 판매량이 함께 증가하는 경향이 관찰되었다. 해석 태도는?",
      "options": [
        "상관관계가 있으면 원인임이 확정된다",
        "상관관계만으로 인과관계를 단정하지 않는다",
        "R²가 있으면 다중공선성이 사라진다",
        "p-value가 작으면 Feature와 Label을 바꾼다"
      ],
      "answer": 1,
      "explanation": "상관관계와 인과관계를 구분해야 한다고 강조한다.",
      "hint": "함께 변하는 것과 원인-결과를 같은 개념으로 보지 않는다."
    },
    {
      "id": "ai-ml-medium-002",
      "conceptId": "compare-dl-ml-medium-002",
      "difficulty": "medium",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "multiple-choice",
      "prompt": "데이터에서 학습하는 모델이 신경망(Neural Network)을 사용한다면 포함 관계상 가장 구체적인 분류는?",
      "options": [
        "AI만 해당하고 ML은 아님",
        "ML이지만 DL은 아님",
        "DL이며 동시에 ML과 AI 범주에도 포함",
        "규칙 기반 시스템만 해당"
      ],
      "answer": 2,
      "explanation": "DL은 신경망을 이용하는 ML의 한 방법이며 ML은 AI 안에 포함된다.",
      "hint": "가장 안쪽 원이 무엇인지 떠올린다."
    },
    {
      "id": "ai-ml-medium-005",
      "conceptId": "loop-missing-step-medium-005",
      "difficulty": "medium",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "데이터 → 모델 →? → 평가 순서에서 빠진 단계는?",
      "options": [
        "RSS",
        "레이블",
        "절편",
        "학습"
      ],
      "answer": 3,
      "explanation": "반복 개선 루프는 데이터→모델→학습→평가 순서다.",
      "hint": "모델을 실제로 조정하는 단계를 생각한다."
    },
    {
      "id": "ai-ml-medium-012",
      "conceptId": "one-d-not-medium-012",
      "difficulty": "medium",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "multiple-choice",
      "prompt": "다음 중 1D 피처 기반 학습 조건을 깨는 경우는?",
      "options": [
        "TV와 Radio 두 입력을 동시에 사용",
        "TV 광고 하나만 입력으로 사용",
        "교육연수 하나만 입력으로 사용",
        "하나의 Feature로 Label을 예측"
      ],
      "answer": 0,
      "explanation": "1D 피처 기반 학습은 Feature가 하나인 경우다. TV와 Radio를 함께 쓰면 입력이 둘이다.",
      "hint": "입력 변수 개수에 주목한다."
    },
    {
      "id": "ai-ml-medium-014",
      "conceptId": "question-type-relationship-medium-014",
      "difficulty": "medium",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "광고 데이터에서 '광고비와 매출 사이에 관계가 있는가?'라는 질문은 선형회귀 예시에서 무엇을 확인하려는 것인가?",
      "options": [
        "Feature 이름의 철자",
        "입력과 출력의 관계 존재 여부",
        "AI와 DL의 포함관계",
        "스팸 분류 범주 수"
      ],
      "answer": 1,
      "explanation": "예시 질문 중 하나는 광고비와 매출의 관계 존재 여부다.",
      "hint": "'관계가 있는가?'라는 문장을 그대로 해석한다."
    },
    {
      "id": "ai-ml-medium-023",
      "conceptId": "beta0-application-medium-023",
      "difficulty": "medium",
      "category": "2. 단순선형회귀",
      "questionType": "multiple-choice",
      "prompt": "모형 Y = β₀ + β₁X + ε에서 X=0일 때 직선 부분의 예측값을 결정하는 계수는?",
      "options": [
        "ε",
        "β₁",
        "β₀",
        "RSS"
      ],
      "answer": 2,
      "explanation": "β₀는 X=0일 때 Y값을 나타내는 절편이다.",
      "hint": "X에 0을 대입해 본다."
    },
    {
      "id": "ai-ml-medium-021",
      "conceptId": "multiple-added-factors-medium-021",
      "difficulty": "medium",
      "category": "3. 다중선형회귀",
      "questionType": "multiple-choice",
      "prompt": "TV와 Radio 외에 가격, 계절, 경쟁사 등도 함께 고려하려는 이유와 가장 가까운 것은?",
      "options": [
        "RSS를 사용하지 않기 위해",
        "Feature를 하나로 줄이기 위해",
        "Label을 제거하기 위해",
        "여러 요인을 함께 고려해 매출을 설명하기 위해"
      ],
      "answer": 3,
      "explanation": "다중선형회귀에서 TV, Radio, 가격, 계절, 경쟁사 등 여러 요인을 함께 고려한다고 설명한다.",
      "hint": "여러 설명변수를 동시에 본다는 점에 주목한다."
    },
    {
      "id": "ai-ml-medium-003",
      "conceptId": "rule-vs-learning-medium-003",
      "difficulty": "medium",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "multiple-choice",
      "prompt": "사람이 미리 작성한 규칙만으로 동작하고 데이터에서 규칙을 학습하지 않는 시스템은 어느 영역의 예에 가깝나?",
      "options": [
        "AI 중 ML이 아닌 영역",
        "DL만의 영역",
        "반드시 다중선형회귀",
        "Label의 영역"
      ],
      "answer": 0,
      "explanation": "규칙 기반 시스템을 AI 중 ML이 아닌 영역의 예로 제시한다.",
      "hint": "ML 바깥이지만 AI 안쪽인 영역을 떠올린다."
    },
    {
      "id": "ai-ml-medium-006",
      "conceptId": "youtube-classify-1-medium-006",
      "difficulty": "medium",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "유튜브 추천에서 '시청 이력'과 '시청 여부'를 각각 Feature/Label로 올바르게 분류한 것은?",
      "options": [
        "시청 이력=Label, 시청 여부=Feature",
        "시청 이력=Feature, 시청 여부=Label",
        "둘 다 Label",
        "둘 다 Feature"
      ],
      "answer": 1,
      "explanation": "시청 이력은 사용자 정보 입력이고, 시청 여부는 사용자 피드백 목표값이다.",
      "hint": "과거 정보와 예측 대상 반응을 구분한다."
    },
    {
      "id": "ai-ml-medium-065",
      "conceptId": "one-d-counterexample-medium-v4",
      "difficulty": "medium",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "multiple-choice",
      "prompt": "다음 중 '1D 피처 기반 학습'에 해당하지 않는 사례는?",
      "options": [
        "Feature가 하나인 학습",
        "교육연수 하나로 소득을 예측한다",
        "TV와 Radio 두 변수를 함께 사용해 판매량을 예측한다",
        "입력 차원이 1인 학습"
      ],
      "answer": 2,
      "explanation": "1D는 Feature가 하나인 경우다. TV와 Radio를 함께 쓰면 입력 Feature가 둘이다.",
      "hint": "입력 변수의 개수를 센다."
    },
    {
      "id": "ai-ml-medium-015",
      "conceptId": "question-type-strength-medium-015",
      "difficulty": "medium",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "광고 데이터에서 '그 관계의 강도는 어느 정도인가?'는 무엇에 초점을 둔 질문인가?",
      "options": [
        "DL의 신경망 층 수",
        "데이터 단계 삭제",
        "Label을 Feature로 변환",
        "관계의 세기"
      ],
      "answer": 3,
      "explanation": "관계의 존재뿐 아니라 강도도 질문할 수 있다고 제시한다.",
      "hint": "'강도'라는 단어에 주목한다."
    },
    {
      "id": "ai-ml-medium-024",
      "conceptId": "beta1-application-medium-024",
      "difficulty": "medium",
      "category": "2. 단순선형회귀",
      "questionType": "multiple-choice",
      "prompt": "X가 1단위 늘어날 때 직선의 예측 Y가 평균적으로 얼마나 변하는지를 나타내는 것은?",
      "options": [
        "β₁",
        "β₀",
        "R²",
        "p-value"
      ],
      "answer": 0,
      "explanation": "β₁는 기울기로서 X 1단위 증가에 따른 Y의 평균 변화를 나타낸다.",
      "hint": "직선의 기울기 의미를 떠올린다."
    },
    {
      "id": "ai-ml-medium-058",
      "conceptId": "multiple-vs-1d-medium-058",
      "difficulty": "medium",
      "category": "3. 다중선형회귀",
      "questionType": "multiple-choice",
      "prompt": "TV와 Radio를 동시에 Feature로 쓰는 모델이 1D 피처 기반 학습이 아닌 이유는?",
      "options": [
        "Label이 없기 때문",
        "Feature가 두 개이기 때문",
        "회귀가 아니기 때문",
        "평가를 하지 않기 때문"
      ],
      "answer": 1,
      "explanation": "1D는 Feature가 하나인 경우인데 TV와 Radio를 함께 쓰면 Feature가 둘이다.",
      "hint": "입력 변수 개수를 센다."
    },
    {
      "id": "ai-ml-medium-007",
      "conceptId": "youtube-classify-2-medium-007",
      "difficulty": "medium",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "유튜브 추천에서 '장르'와 '좋아요 클릭 여부'의 역할을 올바르게 연결한 것은?",
      "options": [
        "둘 다 Label",
        "장르=Label, 좋아요 클릭 여부=Feature",
        "장르=Feature, 좋아요 클릭 여부=Label",
        "둘 다 평가 지표"
      ],
      "answer": 2,
      "explanation": "장르는 영상 정보 Feature이고 좋아요 클릭 여부는 사용자 피드백 Label이다.",
      "hint": "추천 전에 아는 정보와 추천 후 반응을 나눈다."
    },
    {
      "id": "ai-ml-medium-016",
      "conceptId": "question-type-contribution-medium-016",
      "difficulty": "medium",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "TV, Radio 등 여러 매체 중 어떤 매체가 매출에 기여하는지 알고 싶다. 광고 데이터 질문과 가장 가까운 것은?",
      "options": [
        "1D의 차원 의미",
        "RSS 정의",
        "AI의 정의",
        "매체별 기여 파악"
      ],
      "answer": 3,
      "explanation": "어떤 매체가 매출에 기여하는가는 광고 데이터 예시 질문이다.",
      "hint": "여러 광고 매체 중 어떤 것이 영향을 주는지 본다."
    },
    {
      "id": "ai-ml-medium-025",
      "conceptId": "hat-application-medium-025",
      "difficulty": "medium",
      "category": "2. 단순선형회귀",
      "questionType": "multiple-choice",
      "prompt": "데이터를 이용해 β₀와 β₁를 추정한 뒤 예측식에 사용할 때 일반적으로 어떤 표기를 사용하는가?",
      "options": [
        "β̂₀, β̂₁",
        "Label₀, Label₁",
        "AI₀, AI₁",
        "RSS₀, RSS₁"
      ],
      "answer": 0,
      "explanation": "hat 표시는 추정값을 의미한다.",
      "hint": "베타 위에 표시되는 기호를 떠올린다."
    },
    {
      "id": "ai-ml-medium-059",
      "conceptId": "multiple-extra-factor-medium-059",
      "difficulty": "medium",
      "category": "3. 다중선형회귀",
      "questionType": "multiple-choice",
      "prompt": "TV와 Radio 외에 가격과 계절까지 함께 넣으면 개념상 무엇에 해당하는가?",
      "options": [
        "단순선형회귀",
        "다중선형회귀",
        "1D 피처 기반 학습",
        "규칙 기반 AI만"
      ],
      "answer": 1,
      "explanation": "여러 설명변수를 함께 고려하는 것은 다중선형회귀다.",
      "hint": "한 개가 아니라 여러 입력을 쓴다."
    },
    {
      "id": "ai-ml-medium-008",
      "conceptId": "spam-classify-1-medium-008",
      "difficulty": "medium",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "스팸 분류에서 '단어 빈도'를 입력으로, '스팸/정상'을 정답으로 사용한다. 올바른 용어 연결은?",
      "options": [
        "둘 다 Feature",
        "단어 빈도=Label, 스팸/정상=Feature",
        "단어 빈도=Feature, 스팸/정상=Label",
        "둘 다 잔차"
      ],
      "answer": 2,
      "explanation": "메일 단어 빈도는 Feature, 스팸/정상은 Label이다.",
      "hint": "입력과 정답을 구분한다."
    },
    {
      "id": "ai-ml-medium-017",
      "conceptId": "question-type-prediction-medium-017",
      "difficulty": "medium",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "광고비를 바탕으로 다음 시점의 매출을 얼마나 정확히 예측할 수 있는지 묻는 것은 무엇과 가장 관련 있는가?",
      "options": [
        "단일 피처 차원 표기",
        "스팸/정상 라벨",
        "AI 원의 크기",
        "미래 매출 예측"
      ],
      "answer": 3,
      "explanation": "광고 데이터 예시는 미래 매출을 얼마나 정확히 예측할 수 있는지도 묻는다.",
      "hint": "'미래'와 '예측'을 연결한다."
    },
    {
      "id": "ai-ml-medium-026",
      "conceptId": "residual-sign-pos-medium-026",
      "difficulty": "medium",
      "category": "2. 단순선형회귀",
      "questionType": "multiple-choice",
      "prompt": "실제값 yᵢ가 예측값 ŷᵢ보다 크다면 eᵢ = yᵢ - ŷᵢ의 부호는?",
      "options": [
        "양수",
        "음수",
        "항상 0",
        "정의할 수 없음"
      ],
      "answer": 0,
      "explanation": "실제값이 예측값보다 크면 실제값-예측값은 양수다.",
      "hint": "잔차 공식을 그대로 적용한다."
    },
    {
      "id": "ai-ml-medium-067",
      "conceptId": "multiple-geometry-medium-v4",
      "difficulty": "medium",
      "category": "3. 다중선형회귀",
      "questionType": "multiple-choice",
      "prompt": "TV와 Radio 두 설명변수를 함께 쓰는 회귀를 3D 평면으로 표현한 이유는?",
      "options": [
        "Label이 두 개이기 때문",
        "두 입력축과 하나의 반응변수를 함께 시각화하기 위해",
        "잔차가 사라지기 때문",
        "회귀선이 항상 곡선이기 때문"
      ],
      "answer": 1,
      "explanation": "TV·Radio·Sales 세 변수를 함께 표시하면 3차원 표현이 필요하다.",
      "hint": "두 입력과 하나의 출력을 축으로 놓아 본다."
    },
    {
      "id": "ai-ml-medium-009",
      "conceptId": "spam-classify-2-medium-009",
      "difficulty": "medium",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "스팸 분류 데이터에서 발신자와 메일 제목을 제거하면 직접 줄어드는 것은?",
      "options": [
        "회귀선의 절편",
        "Label 범주 수",
        "Feature 정보",
        "AI의 범위"
      ],
      "answer": 2,
      "explanation": "발신자와 메일 제목은 Feature로 제시된다.",
      "hint": "메일의 입력 속성에 해당한다."
    },
    {
      "id": "ai-ml-medium-018",
      "conceptId": "question-type-synergy-medium-018",
      "difficulty": "medium",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "TV와 Radio를 함께 사용할 때 상승작용이 있는지 확인하려는 질문은 어떤 표현으로 제시되는가?",
      "options": [
        "AI 비ML 영역",
        "잔차의 부호",
        "1D 피처",
        "매체 간 시너지"
      ],
      "answer": 3,
      "explanation": "매체 간 상승작용(시너지)이 있는지를 질문한다.",
      "hint": "상승작용의 다른 표현을 떠올린다."
    },
    {
      "id": "ai-ml-medium-068",
      "conceptId": "estimated-line-symbol-medium",
      "difficulty": "medium",
      "category": "2. 단순선형회귀",
      "questionType": "short-answer",
      "prompt": "실제 관측 모형 Y=β₀+β₁X+ε와 구분하여, 추정된 회귀선의 반응값에 사용하는 기호를 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "ŷ"
      ],
      "explanation": "추정 회귀선의 예측값은 ŷ로 표기한다.",
      "hint": "y 위에 추정을 뜻하는 표시가 붙는다."
    },
    {
      "id": "ai-ml-medium-080",
      "conceptId": "correlation-causation-medium",
      "difficulty": "medium",
      "category": "4. 선형회귀 주의사항",
      "questionType": "short-answer",
      "prompt": "상관관계와 구분해야 한다고 제시한 관계를 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "인과관계"
      ],
      "explanation": "학습목표는 상관관계와 인과관계를 구분해야 한다고 제시한다.",
      "hint": "단순히 함께 변한다고 해서 원인이라고 단정할 수 있는지 생각한다."
    },
    {
      "id": "ai-ml-medium-069",
      "conceptId": "slope-estimator-symbol-medium",
      "difficulty": "medium",
      "category": "2. 단순선형회귀",
      "questionType": "short-answer",
      "prompt": "단순선형회귀에서 데이터로 추정한 기울기를 나타내는 기호를 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "β̂₁"
      ],
      "explanation": "데이터로 추정한 기울기는 β̂₁이다.",
      "hint": "β₁ 위에 추정 표시가 붙는다."
    },
    {
      "id": "ai-ml-medium-070",
      "conceptId": "intercept-estimator-symbol-medium",
      "difficulty": "medium",
      "category": "2. 단순선형회귀",
      "questionType": "short-answer",
      "prompt": "단순선형회귀에서 데이터로 추정한 절편을 나타내는 기호를 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "β̂₀"
      ],
      "explanation": "데이터로 추정한 절편은 β̂₀이다.",
      "hint": "절편 β₀에 추정 표시가 붙는다."
    },
    {
      "id": "ai-ml-medium-071",
      "conceptId": "slope-from-equation-medium-v4",
      "difficulty": "medium",
      "category": "2. 단순선형회귀",
      "questionType": "short-answer",
      "prompt": "추정식 ŷ = 7 + 1.5X에서 X가 1 증가할 때 예측값의 변화량을 숫자로 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "1.5"
      ],
      "explanation": "기울기 1.5가 X 1단위 증가에 따른 예측값 변화량이다.",
      "hint": "X 앞의 계수를 찾는다."
    },
    {
      "id": "ai-ml-medium-072",
      "conceptId": "intercept-from-equation-medium-v4",
      "difficulty": "medium",
      "category": "2. 단순선형회귀",
      "questionType": "short-answer",
      "prompt": "추정식 ŷ = 7 + 1.5X에서 X=0일 때의 예측값을 숫자로 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "7"
      ],
      "explanation": "X=0을 대입하면 절편인 7만 남는다.",
      "hint": "X를 0으로 놓고 식을 계산한다."
    },
    {
      "id": "ai-ml-medium-091",
      "conceptId": "compare-examples-essay-medium-091",
      "difficulty": "medium",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "essay",
      "prompt": "유튜브 추천과 스팸메일 분류 사례를 비교하여 각 사례의 Feature와 Label을 20자 이상으로 정리하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "유튜브",
        "스팸"
      ],
      "modelAnswer": "유튜브 추천에서는 영상 정보와 시청 이력·구독 채널 같은 사용자 정보가 Feature이고 시청 여부·좋아요 클릭 여부 같은 사용자 피드백이 Label이다. 스팸메일 분류에서는 메일 제목·발신자·단어 빈도가 Feature이고 스팸/정상이 Label이다.",
      "rubricKeywords": [
        "Feature",
        "Label",
        "시청",
        "스팸"
      ],
      "minLength": 20,
      "explanation": "두 사례 모두에서 입력정보와 목표값을 구분해야 한다.",
      "hint": "각 사례에서 모델이 참고하는 것과 맞히는 것을 나눈다."
    },
    {
      "id": "ai-ml-medium-093",
      "conceptId": "ad-questions-essay-medium-093",
      "difficulty": "medium",
      "category": "1. 선형회귀",
      "questionType": "essay",
      "prompt": "광고 데이터 사례에서 선형회귀를 통해 답하려는 질문 중 세 가지 이상을 20자 이상으로 서술하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "관계",
        "강도",
        "기여",
        "예측",
        "시너지"
      ],
      "modelAnswer": "광고비와 매출 사이에 관계가 있는지, 그 관계의 강도가 어느 정도인지, 어떤 매체가 매출에 기여하는지, 미래 매출을 얼마나 정확히 예측할 수 있는지, 매체 간 시너지가 있는지 등을 질문할 수 있다.",
      "rubricKeywords": [
        "관계",
        "강도",
        "매체",
        "미래",
        "시너지"
      ],
      "minLength": 20,
      "explanation": "질문 중 최소 세 가지를 포함해야 한다.",
      "hint": "관계 존재·강도·매체·미래·시너지 순으로 떠올린다."
    },
    {
      "id": "ai-ml-medium-094",
      "conceptId": "residual-graph-essay-medium",
      "difficulty": "medium",
      "category": "2. 단순선형회귀",
      "questionType": "essay",
      "prompt": "광고 데이터 산점도에서 관측점, 파란 회귀선, 관측점과 선 사이의 세로 차이가 각각 무엇을 의미하는지 20자 이상 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "관측값",
        "회귀선",
        "잔차"
      ],
      "modelAnswer": "각 점은 실제 관측 데이터를 나타내고 파란 선은 최소제곱법으로 선택된 추정 회귀선이다. 한 점에서 회귀선까지의 세로 차이는 실제값과 예측값의 차이인 잔차를 의미한다.",
      "rubricKeywords": [
        "관측값",
        "회귀선",
        "잔차",
        "실제값",
        "예측값"
      ],
      "minLength": 20,
      "explanation": "정답 보기는 문제에 제시된 변수와 핵심 개념의 관계를 올바르게 설명한다.",
      "hint": "세 요소를 각각 이름 붙인 뒤 y와 ŷ의 차이를 연결한다."
    },
    {
      "id": "ai-ml-medium-099",
      "conceptId": "multiple-reason-essay-medium-099",
      "difficulty": "medium",
      "category": "3. 다중선형회귀",
      "questionType": "essay",
      "prompt": "TV 하나만 사용하는 단순선형회귀와 TV·Radio·가격·계절·경쟁사 등을 함께 고려하는 다중선형회귀를 20자 이상 비교하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "TV",
        "Radio",
        "가격",
        "계절",
        "경쟁사"
      ],
      "modelAnswer": "단순선형회귀는 TV처럼 하나의 설명변수와 매출의 관계만 고려한다. 다중선형회귀는 TV, Radio, 가격, 계절, 경쟁사 등 여러 입력 변수를 함께 고려하여 매출을 설명하고 예측한다.",
      "rubricKeywords": [
        "하나",
        "여러",
        "설명변수"
      ],
      "minLength": 20,
      "explanation": "설명변수 수의 차이와 예시를 포함해야 한다.",
      "hint": "한 입력과 여러 입력의 차이를 중심으로 쓴다."
    },
    {
      "id": "w1-refresh-medium-mc-001",
      "conceptId": "supervised-learning",
      "difficulty": "medium",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) 입력과 정답 라벨이 쌍으로 있는 데이터로 예측 규칙을 학습하고 새로운 데이터에 일반화하는 방법 (나) 고객 정보와 실제 이탈 여부를 함께 학습해 다음 달 이탈 고객을 예측한다.",
      "options": [
        "지도학습",
        "회귀와 분류",
        "과적합과 언더피팅",
        "계층적 군집"
      ],
      "answer": 0,
      "explanation": "(가)는 지도학습의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-002",
      "conceptId": "supervised-learning",
      "difficulty": "medium",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "지도학습에 대한 두 판단의 옳고 그름을 고르시오. (가) 각 학습 샘플에는 입력 feature와 정답 label이 함께 존재한다. (나) 훈련 데이터뿐 아니라 처음 보는 데이터에서도 정확히 예측하는 것이 목표다.",
      "options": [
        "(가)만 옳다.",
        "(가), (나) 모두 옳다.",
        "(가), (나) 모두 옳지 않다.",
        "(나)만 옳다."
      ],
      "answer": 1,
      "explanation": "정답은 \"(가), (나) 모두 옳다.\"이다. 지도학습은 입력과 정답 라벨이 쌍으로 있는 데이터로 예측 규칙을 학습하고 새로운 데이터에 일반화하는 방법이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-003",
      "conceptId": "supervised-learning",
      "difficulty": "medium",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "지도학습을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "훈련 오류가 0이 되어야만 새로운 데이터에 일반화할 수 있다.",
        "feature는 반드시 하나의 수치 변수여야 한다.",
        "회귀와 분류는 대표적인 지도학습 문제다.",
        "정답 라벨 없이 데이터의 숨은 구조만 찾는 학습이다."
      ],
      "answer": 2,
      "explanation": "회귀와 분류는 대표적인 지도학습 문제다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-004",
      "conceptId": "regression-classification",
      "difficulty": "medium",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) 연속적인 수치를 예측하면 회귀, 정해진 범주를 예측하면 분류로 구분하는 지도학습 문제 유형 (나) 주택 가격을 예측하는 문제와 이메일을 스팸 또는 정상으로 나누는 문제를 구분한다.",
      "options": [
        "손실함수",
        "K-겹 교차검증",
        "표준화",
        "회귀와 분류"
      ],
      "answer": 3,
      "explanation": "(가)는 회귀와 분류의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-005",
      "conceptId": "regression-classification",
      "difficulty": "medium",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "회귀와 분류에 대한 두 판단의 옳고 그름을 고르시오. (가) 가격·점수·온도처럼 연속적인 수치를 예측하면 회귀다. (나) 회귀는 범주만 예측하고 분류는 연속적인 수치만 예측한다.",
      "options": [
        "(가)만 옳다.",
        "(가), (나) 모두 옳지 않다.",
        "(가), (나) 모두 옳다.",
        "(나)만 옳다."
      ],
      "answer": 0,
      "explanation": "정답은 \"(가)만 옳다.\"이다. 회귀와 분류은 연속적인 수치를 예측하면 회귀, 정해진 범주를 예측하면 분류로 구분하는 지도학습 문제 유형이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-006",
      "conceptId": "regression-classification",
      "difficulty": "medium",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "회귀와 분류을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "회귀와 분류는 정답 라벨을 사용하지 않는 비지도학습이다.",
        "문제 유형은 주로 예측 대상인 label의 성격으로 판단한다.",
        "회귀는 범주만 예측하고 분류는 연속적인 수치만 예측한다.",
        "입력 feature가 두 개 이상이면 문제는 항상 분류가 된다."
      ],
      "answer": 1,
      "explanation": "문제 유형은 주로 예측 대상인 label의 성격으로 판단한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-007",
      "conceptId": "loss-functions",
      "difficulty": "medium",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) 모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수 (나) 회귀 모델은 MSE를, 분류 모델은 정답 범주의 예측 확률을 반영하는 교차 엔트로피를 줄이도록 학습한다.",
      "options": [
        "비지도학습",
        "로지스틱 회귀",
        "손실함수",
        "혼동행렬"
      ],
      "answer": 2,
      "explanation": "(가)는 손실함수의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-008",
      "conceptId": "loss-functions",
      "difficulty": "medium",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "손실함수에 대한 두 판단의 옳고 그름을 고르시오. (가) 손실값이 작을수록 예측이 정답에 가까운 것으로 해석한다. (나) MSE는 실제값과 예측값의 차이를 제곱해 평균한다.",
      "options": [
        "(가), (나) 모두 옳지 않다.",
        "(나)만 옳다.",
        "(가)만 옳다.",
        "(가), (나) 모두 옳다."
      ],
      "answer": 3,
      "explanation": "정답은 \"(가), (나) 모두 옳다.\"이다. 손실함수은 모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-009",
      "conceptId": "loss-functions",
      "difficulty": "medium",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "손실함수을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "교차 엔트로피는 분류에서 정답 범주에 부여한 확률을 반영한다.",
        "손실값은 클수록 모델의 예측 성능이 좋다.",
        "MSE는 범주형 분류 문제에만 사용할 수 있다.",
        "손실함수를 정하면 부족한 학습 데이터가 자동으로 생성된다."
      ],
      "answer": 0,
      "explanation": "교차 엔트로피는 분류에서 정답 범주에 부여한 확률을 반영한다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-010",
      "conceptId": "confusion-matrix",
      "difficulty": "medium",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) 이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표 (나) 질병 환자가 매우 적은 데이터에서 정확도만 보지 않고 놓친 환자와 잘못 경고한 사람을 따로 계산한다.",
      "options": [
        "ReLU",
        "혼동행렬",
        "테스트 오류",
        "K-means"
      ],
      "answer": 1,
      "explanation": "(가)는 혼동행렬의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-011",
      "conceptId": "confusion-matrix",
      "difficulty": "medium",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "혼동행렬에 대한 두 판단의 옳고 그름을 고르시오. (가) 정확도는 전체 예측 중 맞힌 예측의 비율이다. (나) 정확도가 99%이면 클래스 비율과 관계없이 항상 좋은 분류 모델이다.",
      "options": [
        "(가), (나) 모두 옳다.",
        "(나)만 옳다.",
        "(가)만 옳다.",
        "(가), (나) 모두 옳지 않다."
      ],
      "answer": 2,
      "explanation": "정답은 \"(가)만 옳다.\"이다. 혼동행렬은 이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-012",
      "conceptId": "confusion-matrix",
      "difficulty": "medium",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "혼동행렬을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "정확도가 99%이면 클래스 비율과 관계없이 항상 좋은 분류 모델이다.",
        "FP는 실제 양성을 음성으로 놓친 경우를 뜻한다.",
        "혼동행렬은 연속적인 수치를 예측하는 회귀에서만 사용한다.",
        "클래스가 불균형하면 높은 정확도만으로 좋은 모델이라고 단정하기 어렵다."
      ],
      "answer": 3,
      "explanation": "클래스가 불균형하면 높은 정확도만으로 좋은 모델이라고 단정하기 어렵다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-013",
      "conceptId": "test-generalization",
      "difficulty": "medium",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) 학습에 사용하지 않은 새로운 데이터에서 측정한 예측 오류로 일반화 성능을 판단하는 기준 (나) 훈련 데이터에서는 오차가 작지만 별도로 보관한 새 데이터에서 오차가 크게 증가했는지 확인한다.",
      "options": [
        "테스트 오류",
        "과적합과 언더피팅",
        "계층적 군집",
        "경사하강법"
      ],
      "answer": 0,
      "explanation": "(가)는 테스트 오류의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-medium-mc-014",
      "conceptId": "test-generalization",
      "difficulty": "medium",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "테스트 오류에 대한 두 판단의 옳고 그름을 고르시오. (가) 테스트 데이터는 모델 학습에 직접 사용하지 않아야 한다. (나) 좋은 모델 선택의 목표는 새로운 데이터에서의 오류를 줄이는 것이다.",
      "options": [
        "(가)만 옳다.",
        "(가), (나) 모두 옳다.",
        "(가), (나) 모두 옳지 않다.",
        "(나)만 옳다."
      ],
      "answer": 1,
      "explanation": "정답은 \"(가), (나) 모두 옳다.\"이다. 테스트 오류은 학습에 사용하지 않은 새로운 데이터에서 측정한 예측 오류로 일반화 성능을 판단하는 기준이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-medium-mc-015",
      "conceptId": "test-generalization",
      "difficulty": "medium",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "테스트 오류을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "훈련 오류와 테스트 오류는 어떤 모델에서도 항상 같다.",
        "훈련 오류가 가장 작은 모델은 언제나 테스트 오류도 가장 작다.",
        "훈련 오류와 테스트 오류의 차이는 과적합을 판단하는 단서가 된다.",
        "테스트 데이터로 반복 학습할수록 일반화 성능을 공정하게 평가할 수 있다."
      ],
      "answer": 2,
      "explanation": "훈련 오류와 테스트 오류의 차이는 과적합을 판단하는 단서가 된다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-medium-mc-016",
      "conceptId": "over-under-fitting",
      "difficulty": "medium",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) 모델이 훈련 데이터에 지나치게 맞으면 과적합, 너무 단순해 중요한 패턴도 못 배우면 언더피팅인 상태 (나) 매우 복잡한 모델은 훈련 오차가 작고 검증 오차가 크며, 지나치게 단순한 모델은 두 오차가 모두 크다.",
      "options": [
        "K-겹 교차검증",
        "표준화",
        "역전파",
        "과적합과 언더피팅"
      ],
      "answer": 3,
      "explanation": "(가)는 과적합과 언더피팅의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-medium-mc-017",
      "conceptId": "over-under-fitting",
      "difficulty": "medium",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "과적합과 언더피팅에 대한 두 판단의 옳고 그름을 고르시오. (가) 과적합은 대체로 훈련 오류가 작고 테스트 오류가 큰 상태다. (나) 모델을 복잡하게 만들면 과적합과 언더피팅이 항상 함께 해결된다.",
      "options": [
        "(가)만 옳다.",
        "(가), (나) 모두 옳지 않다.",
        "(가), (나) 모두 옳다.",
        "(나)만 옳다."
      ],
      "answer": 0,
      "explanation": "정답은 \"(가)만 옳다.\"이다. 과적합과 언더피팅은 모델이 훈련 데이터에 지나치게 맞으면 과적합, 너무 단순해 중요한 패턴도 못 배우면 언더피팅인 상태이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-medium-mc-018",
      "conceptId": "over-under-fitting",
      "difficulty": "medium",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "과적합과 언더피팅을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "테스트 데이터를 반복해서 보며 복잡도를 정하는 것이 가장 공정하다.",
        "검증 성능을 보며 모델 복잡도나 학습 시점을 조절할 수 있다.",
        "모델을 복잡하게 만들면 과적합과 언더피팅이 항상 함께 해결된다.",
        "과적합은 훈련 오류와 테스트 오류가 모두 큰 상태다."
      ],
      "answer": 1,
      "explanation": "검증 성능을 보며 모델 복잡도나 학습 시점을 조절할 수 있다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-medium-mc-019",
      "conceptId": "cross-validation",
      "difficulty": "medium",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) 데이터를 K개 폴드로 나누고 각 폴드를 한 번씩 검증에 사용한 뒤 성능을 평균하는 평가 방법 (나) 데이터가 적어 한 번의 검증셋 분할 결과가 불안정하므로 폴드를 바꾸어 K번 학습·평가한다.",
      "options": [
        "로지스틱 회귀",
        "지도학습",
        "K-겹 교차검증",
        "비지도학습"
      ],
      "answer": 2,
      "explanation": "(가)는 K-겹 교차검증의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-medium-mc-020",
      "conceptId": "cross-validation",
      "difficulty": "medium",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "K-겹 교차검증에 대한 두 판단의 옳고 그름을 고르시오. (가) 각 반복에서 한 폴드는 검증에, 나머지 폴드는 학습에 사용한다. (나) K번의 검증 결과를 평균해 일반화 성능을 추정한다.",
      "options": [
        "(가), (나) 모두 옳지 않다.",
        "(나)만 옳다.",
        "(가)만 옳다.",
        "(가), (나) 모두 옳다."
      ],
      "answer": 3,
      "explanation": "정답은 \"(가), (나) 모두 옳다.\"이다. K-겹 교차검증은 데이터를 K개 폴드로 나누고 각 폴드를 한 번씩 검증에 사용한 뒤 성능을 평균하는 평가 방법이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-medium-mc-021",
      "conceptId": "cross-validation",
      "difficulty": "medium",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "K-겹 교차검증을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "K가 전체 샘플 수와 같으면 LOOCV가 된다.",
        "모든 폴드를 동시에 검증셋으로 사용하고 학습은 한 번만 수행한다.",
        "K가 커져도 학습 횟수와 계산량은 변하지 않는다.",
        "교차검증을 하면 최종 테스트 데이터가 항상 필요 없어진다."
      ],
      "answer": 0,
      "explanation": "K가 전체 샘플 수와 같으면 LOOCV가 된다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-medium-mc-022",
      "conceptId": "unsupervised-learning",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) 정답 라벨 없이 입력 데이터의 구조·패턴·잠재 집단을 찾는 학습 방법 (나) 고객의 실제 등급 정답 없이 구매 행동이 비슷한 고객끼리 묶어 시장을 나눈다.",
      "options": [
        "회귀와 분류",
        "비지도학습",
        "K-means",
        "ReLU"
      ],
      "answer": 1,
      "explanation": "(가)는 비지도학습의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-023",
      "conceptId": "unsupervised-learning",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "비지도학습에 대한 두 판단의 옳고 그름을 고르시오. (가) 클러스터링과 차원 축소는 대표적인 비지도학습 과제다. (나) 항상 입력과 정답 라벨의 쌍으로 모델을 학습한다.",
      "options": [
        "(가), (나) 모두 옳다.",
        "(나)만 옳다.",
        "(가)만 옳다.",
        "(가), (나) 모두 옳지 않다."
      ],
      "answer": 2,
      "explanation": "정답은 \"(가)만 옳다.\"이다. 비지도학습은 정답 라벨 없이 입력 데이터의 구조·패턴·잠재 집단을 찾는 학습 방법이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-024",
      "conceptId": "unsupervised-learning",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "비지도학습을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "항상 입력과 정답 라벨의 쌍으로 모델을 학습한다.",
        "분류 정확도 하나만으로 모든 비지도학습 결과를 평가한다.",
        "찾아낸 각 클러스터는 반드시 실제 원인에 따른 정답 범주다.",
        "정답 라벨이 없어 결과 해석과 평가가 더 어려울 수 있다."
      ],
      "answer": 3,
      "explanation": "정답 라벨이 없어 결과 해석과 평가가 더 어려울 수 있다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-025",
      "conceptId": "k-means",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) K개의 중심을 계산하고 각 관측치를 가장 가까운 중심에 재할당하는 과정을 반복하는 군집화 방법 (나) 클러스터 수 K를 먼저 정한 뒤 중심 계산과 재할당을 소속이 바뀌지 않을 때까지 반복한다.",
      "options": [
        "K-means",
        "계층적 군집",
        "경사하강법",
        "손실함수"
      ],
      "answer": 0,
      "explanation": "(가)는 K-means의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-026",
      "conceptId": "k-means",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "K-means에 대한 두 판단의 옳고 그름을 고르시오. (가) 클러스터 수 K를 학습 전에 정해야 한다. (나) 각 클러스터의 중심은 보통 소속 관측치의 feature 평균으로 계산한다.",
      "options": [
        "(가)만 옳다.",
        "(가), (나) 모두 옳다.",
        "(가), (나) 모두 옳지 않다.",
        "(나)만 옳다."
      ],
      "answer": 1,
      "explanation": "정답은 \"(가), (나) 모두 옳다.\"이다. K-means은 K개의 중심을 계산하고 각 관측치를 가장 가까운 중심에 재할당하는 과정을 반복하는 군집화 방법이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-027",
      "conceptId": "k-means",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "K-means을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "초기 중심은 최종 결과에 아무런 영향을 주지 않는다.",
        "한 관측치는 매 반복에서 여러 클러스터에 동시에 속해야 한다.",
        "초기 중심에 따라 최종 군집 결과가 달라질 수 있어 여러 번 시도할 수 있다.",
        "클러스터 수를 정하지 않아도 덴드로그램이 자동으로 K를 결정한다."
      ],
      "answer": 2,
      "explanation": "초기 중심에 따라 최종 군집 결과가 달라질 수 있어 여러 번 시도할 수 있다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-028",
      "conceptId": "hierarchical-clustering",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) 관측치에서 시작해 가까운 클러스터를 단계적으로 병합하고 그 과정을 덴드로그램으로 나타내는 방법 (나) 각 관측치를 하나의 클러스터로 시작해 가장 유사한 두 집단을 병합하고 원하는 높이에서 덴드로그램을 자른다.",
      "options": [
        "표준화",
        "역전파",
        "혼동행렬",
        "계층적 군집"
      ],
      "answer": 3,
      "explanation": "(가)는 계층적 군집의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-029",
      "conceptId": "hierarchical-clustering",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "계층적 군집에 대한 두 판단의 옳고 그름을 고르시오. (가) 상향식 방법은 관측치별 클러스터에서 시작해 하나가 될 때까지 병합한다. (나) 항상 클러스터 수 K를 먼저 고정하고 중심점을 반복 갱신한다.",
      "options": [
        "(가)만 옳다.",
        "(가), (나) 모두 옳지 않다.",
        "(가), (나) 모두 옳다.",
        "(나)만 옳다."
      ],
      "answer": 0,
      "explanation": "정답은 \"(가)만 옳다.\"이다. 계층적 군집은 관측치에서 시작해 가까운 클러스터를 단계적으로 병합하고 그 과정을 덴드로그램으로 나타내는 방법이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-030",
      "conceptId": "hierarchical-clustering",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "계층적 군집을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "데이터가 많아도 모든 클러스터 쌍의 거리를 계산할 필요가 없다.",
        "linkage 선택에 따라 같은 데이터의 덴드로그램도 달라질 수 있다.",
        "항상 클러스터 수 K를 먼저 고정하고 중심점을 반복 갱신한다.",
        "linkage를 바꾸어도 군집 결과는 절대 달라지지 않는다."
      ],
      "answer": 1,
      "explanation": "linkage 선택에 따라 같은 데이터의 덴드로그램도 달라질 수 있다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-031",
      "conceptId": "scaling-pca",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) 변수 단위 차이가 거리와 학습에 미치는 영향을 줄이도록 feature의 평균을 0, 분산을 1로 맞추는 변환 (나) 연소득과 방문 횟수처럼 단위와 범위가 크게 다른 변수를 거리 기반 군집화 전에 같은 척도로 바꾼다.",
      "options": [
        "지도학습",
        "테스트 오류",
        "표준화",
        "로지스틱 회귀"
      ],
      "answer": 2,
      "explanation": "(가)는 표준화의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-032",
      "conceptId": "scaling-pca",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "표준화에 대한 두 판단의 옳고 그름을 고르시오. (가) 거리 기반 알고리즘은 변수의 단위와 범위 차이에 민감할 수 있다. (나) 표준화는 일반적으로 각 feature의 평균을 0, 분산을 1로 맞춘다.",
      "options": [
        "(가), (나) 모두 옳지 않다.",
        "(나)만 옳다.",
        "(가)만 옳다.",
        "(가), (나) 모두 옳다."
      ],
      "answer": 3,
      "explanation": "정답은 \"(가), (나) 모두 옳다.\"이다. 표준화은 변수 단위 차이가 거리와 학습에 미치는 영향을 줄이도록 feature의 평균을 0, 분산을 1로 맞추는 변환이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-033",
      "conceptId": "scaling-pca",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "표준화을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "PCA는 정보를 가능한 한 보존하며 더 적은 주성분으로 차원을 줄인다.",
        "표준화는 정답 라벨을 자동으로 생성하는 과정이다.",
        "변수 단위 차이는 K-means의 거리 계산에 영향을 주지 않는다.",
        "PCA는 각 샘플에 정답 클러스터 라벨을 부여하는 분류 알고리즘이다."
      ],
      "answer": 0,
      "explanation": "PCA는 정보를 가능한 한 보존하며 더 적은 주성분으로 차원을 줄인다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-medium-mc-034",
      "conceptId": "logistic-regression",
      "difficulty": "medium",
      "category": "5. 로지스틱 회귀",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) 선형 결합을 시그모이드에 통과시켜 0과 1 사이의 확률을 예측하는 이진 분류 모델 (나) 신용카드 사용량을 입력해 연체 확률을 계산하고 임계값에 따라 연체 여부를 분류한다.",
      "options": [
        "과적합과 언더피팅",
        "로지스틱 회귀",
        "ReLU",
        "회귀와 분류"
      ],
      "answer": 1,
      "explanation": "(가)는 로지스틱 회귀의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 선형 결합, 시그모이드, odds와 logit의 연결."
    },
    {
      "id": "w1-refresh-medium-mc-035",
      "conceptId": "logistic-regression",
      "difficulty": "medium",
      "category": "5. 로지스틱 회귀",
      "questionType": "multiple-choice",
      "prompt": "로지스틱 회귀에 대한 두 판단의 옳고 그름을 고르시오. (가) 시그모이드는 모든 실수 입력을 0과 1 사이 값으로 변환한다. (나) 모델 출력이 음의 무한대부터 양의 무한대까지라 확률로 해석할 수 없다.",
      "options": [
        "(가), (나) 모두 옳다.",
        "(나)만 옳다.",
        "(가)만 옳다.",
        "(가), (나) 모두 옳지 않다."
      ],
      "answer": 2,
      "explanation": "정답은 \"(가)만 옳다.\"이다. 로지스틱 회귀은 선형 결합을 시그모이드에 통과시켜 0과 1 사이의 확률을 예측하는 이진 분류 모델이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 선형 결합, 시그모이드, odds와 logit의 연결."
    },
    {
      "id": "w1-refresh-medium-mc-036",
      "conceptId": "logistic-regression",
      "difficulty": "medium",
      "category": "5. 로지스틱 회귀",
      "questionType": "multiple-choice",
      "prompt": "로지스틱 회귀을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "모델 출력이 음의 무한대부터 양의 무한대까지라 확률로 해석할 수 없다.",
        "이진 분류의 표준 모수 추정은 항상 최소제곱 MSE만 사용한다.",
        "이름에 회귀가 있으므로 연속적인 수치만 예측할 수 있다.",
        "모수는 데이터의 likelihood를 최대화하는 MLE로 추정할 수 있다."
      ],
      "answer": 3,
      "explanation": "모수는 데이터의 likelihood를 최대화하는 MLE로 추정할 수 있다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 선형 결합, 시그모이드, odds와 logit의 연결."
    },
    {
      "id": "w1-refresh-medium-mc-037",
      "conceptId": "neural-network",
      "difficulty": "medium",
      "category": "6. 신경망 구조와 표현력",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) 입력이 0보다 작으면 0, 0 이상이면 입력을 그대로 출력해 신경망에 비선형성을 주는 활성화 함수 (나) 은닉 유닛의 선형 결합마다 활성화 함수를 적용해 여러 조각의 선형 구간으로 복잡한 함수를 표현한다.",
      "options": [
        "ReLU",
        "경사하강법",
        "손실함수",
        "K-겹 교차검증"
      ],
      "answer": 0,
      "explanation": "(가)는 ReLU의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-medium-mc-038",
      "conceptId": "neural-network",
      "difficulty": "medium",
      "category": "6. 신경망 구조와 표현력",
      "questionType": "multiple-choice",
      "prompt": "ReLU에 대한 두 판단의 옳고 그름을 고르시오. (가) 은닉층의 활성화 함수는 단순한 선형 결합만으로는 만들 수 없는 표현을 가능하게 한다. (나) 은닉층이 하나인 네트워크를 shallow network라고 부를 수 있다.",
      "options": [
        "(가)만 옳다.",
        "(가), (나) 모두 옳다.",
        "(가), (나) 모두 옳지 않다.",
        "(나)만 옳다."
      ],
      "answer": 1,
      "explanation": "정답은 \"(가), (나) 모두 옳다.\"이다. ReLU은 입력이 0보다 작으면 0, 0 이상이면 입력을 그대로 출력해 신경망에 비선형성을 주는 활성화 함수이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-medium-mc-039",
      "conceptId": "neural-network",
      "difficulty": "medium",
      "category": "6. 신경망 구조와 표현력",
      "questionType": "multiple-choice",
      "prompt": "ReLU을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "ReLU는 모든 음수 입력을 그대로 출력하고 양수 입력을 0으로 만든다.",
        "보편적 근사 정리는 적은 수의 유닛으로 모든 불연속 함수를 오차 없이 표현한다는 뜻이다.",
        "깊은 네트워크는 층별 함수를 합성해 비슷한 파라미터 수로 더 많은 선형 구역을 만들 수 있다.",
        "활성화 함수가 없어도 선형층을 여러 개 쌓으면 항상 복잡한 비선형 함수가 된다."
      ],
      "answer": 2,
      "explanation": "깊은 네트워크는 층별 함수를 합성해 비슷한 파라미터 수로 더 많은 선형 구역을 만들 수 있다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-medium-mc-040",
      "conceptId": "gradient-descent",
      "difficulty": "medium",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) 손실함수의 기울기 반대 방향으로 파라미터를 반복 갱신해 손실을 줄이는 최적화 알고리즘 (나) 현재 파라미터에서 미분값을 구하고 학습률을 곱한 만큼 반대 방향으로 이동한다.",
      "options": [
        "역전파",
        "혼동행렬",
        "비지도학습",
        "경사하강법"
      ],
      "answer": 3,
      "explanation": "(가)는 경사하강법의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-medium-mc-041",
      "conceptId": "gradient-descent",
      "difficulty": "medium",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "경사하강법에 대한 두 판단의 옳고 그름을 고르시오. (가) 기울기는 손실이 가장 빠르게 증가하는 방향이므로 그 반대로 이동한다. (나) 손실을 줄이기 위해 항상 기울기와 같은 방향으로 이동한다.",
      "options": [
        "(가)만 옳다.",
        "(가), (나) 모두 옳지 않다.",
        "(가), (나) 모두 옳다.",
        "(나)만 옳다."
      ],
      "answer": 0,
      "explanation": "정답은 \"(가)만 옳다.\"이다. 경사하강법은 손실함수의 기울기 반대 방향으로 파라미터를 반복 갱신해 손실을 줄이는 최적화 알고리즘이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-medium-mc-042",
      "conceptId": "gradient-descent",
      "difficulty": "medium",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "경사하강법을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "SGD는 매 업데이트마다 전체 데이터만 사용해야 한다.",
        "미니배치 SGD는 일부 샘플로 기울기를 추정해 계산량과 경로의 노이즈를 만든다.",
        "손실을 줄이기 위해 항상 기울기와 같은 방향으로 이동한다.",
        "학습률은 클수록 언제나 더 빠르고 안정적으로 수렴한다."
      ],
      "answer": 1,
      "explanation": "미니배치 SGD는 일부 샘플로 기울기를 추정해 계산량과 경로의 노이즈를 만든다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-medium-mc-043",
      "conceptId": "backpropagation",
      "difficulty": "medium",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "다음 두 설명을 모두 만족하는 개념은? (가) 출력의 손실에서 입력 방향으로 계산 그래프를 거슬러 가며 연쇄법칙으로 각 파라미터의 기울기를 구하는 절차 (나) 순전파로 예측과 손실을 계산한 뒤 출력층부터 은닉층 방향으로 각 가중치의 미분값을 전달한다.",
      "options": [
        "테스트 오류",
        "K-means",
        "역전파",
        "지도학습"
      ],
      "answer": 2,
      "explanation": "(가)는 역전파의 정의이고, (나)는 그 개념이 적용되는 상황이다.",
      "hint": "개념 간 차이가 드러나는 조건부터 판단한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-medium-mc-044",
      "conceptId": "backpropagation",
      "difficulty": "medium",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "역전파에 대한 두 판단의 옳고 그름을 고르시오. (가) 순전파는 입력에서 출력 방향으로 예측값과 손실을 계산한다. (나) 역전파는 연쇄법칙을 이용해 각 층 파라미터의 기울기를 효율적으로 구한다.",
      "options": [
        "(가), (나) 모두 옳지 않다.",
        "(나)만 옳다.",
        "(가)만 옳다.",
        "(가), (나) 모두 옳다."
      ],
      "answer": 3,
      "explanation": "정답은 \"(가), (나) 모두 옳다.\"이다. 역전파은 출력의 손실에서 입력 방향으로 계산 그래프를 거슬러 가며 연쇄법칙으로 각 파라미터의 기울기를 구하는 절차이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "각 조건을 따로 판별한 뒤 조합한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-medium-mc-045",
      "conceptId": "backpropagation",
      "difficulty": "medium",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "역전파을 적용하거나 해석한 내용으로 가장 적절한 것은?",
      "options": [
        "Early stopping은 검증 성능이 더 이상 좋아지지 않을 때 학습을 멈춰 과적합을 줄인다.",
        "역전파는 입력에서 출력 방향으로 예측값만 만드는 과정이다.",
        "각 층의 기울기는 다른 층과 무관하므로 연쇄법칙이 필요 없다.",
        "Early stopping은 훈련 오차가 반드시 0이 될 때까지 학습하는 방법이다."
      ],
      "answer": 0,
      "explanation": "Early stopping은 검증 성능이 더 이상 좋아지지 않을 때 학습을 멈춰 과적합을 줄인다.",
      "hint": "두 설명의 주어와 동작을 각각 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-medium-mc-046",
      "conceptId": "cross-validation",
      "difficulty": "medium",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "여러 모델 후보의 설정을 비교한 뒤 최종 일반화 성능을 공정하게 보고하려 한다. 데이터 사용 순서로 가장 적절한 것은?",
      "options": [
        "검증셋과 테스트셋을 모두 학습에 합친 뒤 같은 데이터로 성능을 보고한다.",
        "훈련셋으로 학습하고 검증셋으로 모델을 선택한 뒤 테스트셋으로 최종 평가한다.",
        "모든 모델을 테스트셋에 맞춘 뒤 테스트 오류가 가장 작은 모델을 선택한다.",
        "테스트셋으로 모델을 반복 조정한 뒤 훈련셋으로 최종 평가한다."
      ],
      "answer": 1,
      "explanation": "모델 선택은 검증 데이터로 수행하고, 모든 선택이 끝난 뒤 테스트 데이터로 최종 일반화 성능을 평가한다.",
      "hint": "최종 시험지는 모델 선택 과정에서 미리 보면 안 된다."
    },
    {
      "id": "w1-refresh-medium-short-001",
      "conceptId": "over-under-fitting",
      "difficulty": "medium",
      "category": "3. 검증과 일반화",
      "questionType": "short-answer",
      "prompt": "다음 상황의 핵심 개념을 작성하시오. 매우 복잡한 모델은 훈련 오차가 작고 검증 오차가 크며, 지나치게 단순한 모델은 두 오차가 모두 크다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "과적합과 언더피팅",
        "overfitting and underfitting",
        "오버피팅과 언더피팅"
      ],
      "explanation": "정답은 과적합과 언더피팅이다. 모델이 훈련 데이터에 지나치게 맞으면 과적합, 너무 단순해 중요한 패턴도 못 배우면 언더피팅인 상태이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-medium-short-002",
      "conceptId": "cross-validation",
      "difficulty": "medium",
      "category": "3. 검증과 일반화",
      "questionType": "short-answer",
      "prompt": "다음 상황의 핵심 개념을 작성하시오. 데이터가 적어 한 번의 검증셋 분할 결과가 불안정하므로 폴드를 바꾸어 K번 학습·평가한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "K-겹 교차검증",
        "k-fold cross-validation",
        "K-fold 교차검증",
        "교차검증"
      ],
      "explanation": "정답은 K-겹 교차검증이다. 데이터를 K개 폴드로 나누고 각 폴드를 한 번씩 검증에 사용한 뒤 성능을 평균하는 평가 방법이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-medium-short-003",
      "conceptId": "unsupervised-learning",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "short-answer",
      "prompt": "다음 상황의 핵심 개념을 작성하시오. 고객의 실제 등급 정답 없이 구매 행동이 비슷한 고객끼리 묶어 시장을 나눈다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "비지도학습",
        "unsupervised learning",
        "비지도 학습"
      ],
      "explanation": "정답은 비지도학습이다. 정답 라벨 없이 입력 데이터의 구조·패턴·잠재 집단을 찾는 학습 방법이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-medium-short-004",
      "conceptId": "k-means",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "short-answer",
      "prompt": "다음 상황의 핵심 개념을 작성하시오. 클러스터 수 K를 먼저 정한 뒤 중심 계산과 재할당을 소속이 바뀌지 않을 때까지 반복한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "K-means",
        "K-평균",
        "k-means clustering",
        "K-means 클러스터링"
      ],
      "explanation": "정답은 K-means이다. K개의 중심을 계산하고 각 관측치를 가장 가까운 중심에 재할당하는 과정을 반복하는 군집화 방법이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-medium-short-005",
      "conceptId": "hierarchical-clustering",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "short-answer",
      "prompt": "다음 상황의 핵심 개념을 작성하시오. 각 관측치를 하나의 클러스터로 시작해 가장 유사한 두 집단을 병합하고 원하는 높이에서 덴드로그램을 자른다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "계층적 군집",
        "hierarchical clustering",
        "계층적 클러스터링"
      ],
      "explanation": "정답은 계층적 군집이다. 관측치에서 시작해 가까운 클러스터를 단계적으로 병합하고 그 과정을 덴드로그램으로 나타내는 방법이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-medium-short-006",
      "conceptId": "scaling-pca",
      "difficulty": "medium",
      "category": "4. 비지도학습과 군집화",
      "questionType": "short-answer",
      "prompt": "다음 상황의 핵심 개념을 작성하시오. 연소득과 방문 횟수처럼 단위와 범위가 크게 다른 변수를 거리 기반 군집화 전에 같은 척도로 바꾼다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "표준화",
        "standardization",
        "StandardScaler",
        "스케일링"
      ],
      "explanation": "정답은 표준화이다. 변수 단위 차이가 거리와 학습에 미치는 영향을 줄이도록 feature의 평균을 0, 분산을 1로 맞추는 변환이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-medium-short-007",
      "conceptId": "logistic-regression",
      "difficulty": "medium",
      "category": "5. 로지스틱 회귀",
      "questionType": "short-answer",
      "prompt": "다음 상황의 핵심 개념을 작성하시오. 신용카드 사용량을 입력해 연체 확률을 계산하고 임계값에 따라 연체 여부를 분류한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "로지스틱 회귀",
        "logistic regression",
        "로지스틱회귀"
      ],
      "explanation": "정답은 로지스틱 회귀이다. 선형 결합을 시그모이드에 통과시켜 0과 1 사이의 확률을 예측하는 이진 분류 모델이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 선형 결합, 시그모이드, odds와 logit의 연결. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-medium-short-008",
      "conceptId": "neural-network",
      "difficulty": "medium",
      "category": "6. 신경망 구조와 표현력",
      "questionType": "short-answer",
      "prompt": "다음 상황의 핵심 개념을 작성하시오. 은닉 유닛의 선형 결합마다 활성화 함수를 적용해 여러 조각의 선형 구간으로 복잡한 함수를 표현한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "ReLU",
        "rectified linear unit",
        "렐루",
        "활성화 함수 ReLU"
      ],
      "explanation": "정답은 ReLU이다. 입력이 0보다 작으면 0, 0 이상이면 입력을 그대로 출력해 신경망에 비선형성을 주는 활성화 함수이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-medium-short-009",
      "conceptId": "gradient-descent",
      "difficulty": "medium",
      "category": "7. 최적화와 역전파",
      "questionType": "short-answer",
      "prompt": "다음 상황의 핵심 개념을 작성하시오. 현재 파라미터에서 미분값을 구하고 학습률을 곱한 만큼 반대 방향으로 이동한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "경사하강법",
        "gradient descent",
        "경사 하강법"
      ],
      "explanation": "정답은 경사하강법이다. 손실함수의 기울기 반대 방향으로 파라미터를 반복 갱신해 손실을 줄이는 최적화 알고리즘이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-medium-essay-001",
      "conceptId": "integrated-medium-1",
      "difficulty": "medium",
      "category": "8. 통합 사고 서술",
      "questionType": "essay",
      "prompt": "훈련셋·검증셋·테스트셋의 역할을 구분하고 테스트셋을 반복 튜닝에 쓰면 안 되는 이유를 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "훈련셋은 파라미터 학습, 검증셋은 모델과 설정 선택, 테스트셋은 최종 일반화 성능 평가에 사용한다. 테스트셋을 반복 튜닝에 사용하면 그 정보가 모델 선택에 새어 공정한 최종 평가가 깨진다.",
      "rubricKeywords": [
        "훈련셋",
        "검증셋",
        "테스트셋",
        "일반화"
      ],
      "minLength": 50,
      "explanation": "모범답안에는 훈련셋, 검증셋, 테스트셋, 일반화의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: 훈련셋, 검증셋, 테스트셋, 일반화."
    },
    {
      "id": "w1-refresh-medium-essay-002",
      "conceptId": "integrated-medium-2",
      "difficulty": "medium",
      "category": "8. 통합 사고 서술",
      "questionType": "essay",
      "prompt": "클래스 불균형 데이터에서 정확도만으로 분류 모델을 평가하기 어려운 이유를 혼동행렬과 연결해 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "다수 클래스로만 예측해도 정확도가 높을 수 있다. 혼동행렬의 TP·FP·TN·FN을 확인하면 양성을 놓친 FN이나 잘못 경고한 FP를 구분해 실제 오류 유형을 평가할 수 있다.",
      "rubricKeywords": [
        "불균형",
        "정확도",
        "혼동행렬",
        "FN"
      ],
      "minLength": 50,
      "explanation": "모범답안에는 불균형, 정확도, 혼동행렬, FN의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: 불균형, 정확도, 혼동행렬, FN."
    },
    {
      "id": "w1-refresh-medium-essay-003",
      "conceptId": "integrated-medium-3",
      "difficulty": "medium",
      "category": "8. 통합 사고 서술",
      "questionType": "essay",
      "prompt": "선형회귀를 이진 분류에 그대로 사용했을 때의 한계와 로지스틱 회귀의 해결 방법을 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "선형회귀 출력은 0보다 작거나 1보다 커질 수 있어 확률로 부적절하다. 로지스틱 회귀는 선형 결합을 시그모이드에 통과시켜 0과 1 사이 확률을 만든다.",
      "rubricKeywords": [
        "선형회귀",
        "확률",
        "시그모이드",
        "로지스틱"
      ],
      "minLength": 50,
      "explanation": "모범답안에는 선형회귀, 확률, 시그모이드, 로지스틱의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: 선형회귀, 확률, 시그모이드, 로지스틱."
    },
    {
      "id": "w1-refresh-medium-essay-004",
      "conceptId": "integrated-medium-4",
      "difficulty": "medium",
      "category": "8. 통합 사고 서술",
      "questionType": "essay",
      "prompt": "K-means를 단위가 크게 다른 feature에 적용하기 전에 표준화가 필요한 이유와 초기화의 영향을 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "거리 계산에서 범위가 큰 feature가 결과를 지배할 수 있어 표준화가 필요하다. 또한 초기 중심에 따라 지역적으로 다른 군집 결과가 나올 수 있으므로 여러 번 초기화해 비교할 수 있다.",
      "rubricKeywords": [
        "거리",
        "표준화",
        "초기 중심",
        "여러 번"
      ],
      "minLength": 50,
      "explanation": "모범답안에는 거리, 표준화, 초기 중심, 여러 번의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: 거리, 표준화, 초기 중심, 여러 번."
    },
    {
      "id": "w1-refresh-medium-essay-005",
      "conceptId": "integrated-medium-5",
      "difficulty": "medium",
      "category": "8. 통합 사고 서술",
      "questionType": "essay",
      "prompt": "shallow network와 deep network의 구조·표현력 차이를 활성화 함수와 함수 합성 관점에서 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "shallow network는 은닉층이 하나이고, deep network는 여러 층의 비선형 변환을 합성한다. ReLU 같은 활성화가 비선형성을 만들며 깊은 구조는 효율적으로 더 복잡한 표현을 만들 수 있다.",
      "rubricKeywords": [
        "shallow",
        "deep",
        "활성화 함수",
        "합성"
      ],
      "minLength": 50,
      "explanation": "모범답안에는 shallow, deep, 활성화 함수, 합성의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: shallow, deep, 활성화 함수, 합성."
    },
    {
      "id": "w1-refresh-medium-essay-006",
      "conceptId": "integrated-medium-6",
      "difficulty": "medium",
      "category": "8. 통합 사고 서술",
      "questionType": "essay",
      "prompt": "전체 배치 경사하강법과 미니배치 SGD의 업데이트 방식과 장단점을 비교하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "전체 배치 경사하강법은 모든 데이터로 정확한 기울기를 계산하지만 한 스텝의 비용이 크다. 미니배치 SGD는 일부 데이터로 빠르게 갱신하며 노이즈가 있지만 평균적으로 손실을 줄이는 방향을 추정한다.",
      "rubricKeywords": [
        "전체 데이터",
        "미니배치",
        "계산량",
        "노이즈"
      ],
      "minLength": 50,
      "explanation": "모범답안에는 전체 데이터, 미니배치, 계산량, 노이즈의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: 전체 데이터, 미니배치, 계산량, 노이즈."
    }
  ],
  "hard": [
    {
      "id": "ai-ml-hard-001",
      "conceptId": "integrated-classification-hard-001",
      "difficulty": "hard",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "multiple-choice",
      "prompt": "시스템 A는 미리 작성된 규칙으로만 행동하고, 시스템 B는 데이터에서 규칙을 학습하며, 시스템 C는 신경망으로 학습한다. 포함관계에 따른 분류로 옳은 것은?",
      "options": [
        "A=ML, B=DL 아님, C=AI 아님",
        "A=DL, B=AI 중 비ML, C=ML 아님",
        "A=AI 중 비ML 예, B=ML, C=DL",
        "세 시스템 모두 반드시 DL"
      ],
      "answer": 2,
      "explanation": "규칙 기반 시스템은 AI 중 ML이 아닌 예, 데이터 학습은 ML, 신경망 학습은 DL에 해당한다.",
      "hint": "규칙→비ML, 데이터 학습→ML, 신경망→DL 순으로 대응한다."
    },
    {
      "id": "ai-ml-hard-003",
      "conceptId": "loop-failure-analysis-hard-003",
      "difficulty": "hard",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "데이터를 준비하고 모델을 만들고 학습했지만 평가를 하지 않은 채 배포했다. 반복 개선 루프 관점에서 빠진 핵심은?",
      "options": [
        "RSS를 반드시 1로 만드는 과정",
        "Feature를 Label로 바꾸는 과정",
        "AI를 DL로 바꾸는 과정",
        "평가 결과를 이용한 반복 개선 근거"
      ],
      "answer": 3,
      "explanation": "평가 단계는 성능을 확인하고 그 결과를 모델·학습 개선에 되돌리는 역할을 한다.",
      "hint": "루프의 마지막 상자와 되돌아가는 화살표를 본다."
    },
    {
      "id": "ai-ml-hard-006",
      "conceptId": "one-d-to-multiple-hard-006",
      "difficulty": "hard",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "multiple-choice",
      "prompt": "교육연수 하나로 소득을 예측하던 1D 예시에 두 번째 입력 변수를 추가했다면 'Feature가 하나인 가장 단순한 형태'라는 조건에 대해 어떤 변화가 생기는가?",
      "options": [
        "더 이상 1D 피처 기반 학습 조건에 해당하지 않는다",
        "여전히 Feature가 하나다",
        "Label이 사라진다",
        "DL로 자동 변경된다"
      ],
      "answer": 0,
      "explanation": "1D 피처 기반 학습은 Feature가 하나인 경우이므로 입력이 둘이면 해당 조건을 벗어난다.",
      "hint": "Feature 개수만 확인한다."
    },
    {
      "id": "ai-ml-hard-007",
      "conceptId": "linear-questions-combination-hard-007",
      "difficulty": "hard",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "광고 데이터에서 관계 존재, 관계 강도, 매체 기여, 미래 예측, 매체 간 시너지를 모두 묻고 있다. 이 질문 묶음이 보여주는 선형회귀 활용의 핵심으로 가장 적절한 것은?",
      "options": [
        "Label 없이 데이터를 군집화한다",
        "입력과 출력 관계를 분석하고 예측에 활용한다",
        "신경망 층을 설계한다",
        "규칙을 사람이 모두 고정한다"
      ],
      "answer": 1,
      "explanation": "선형회귀를 입력과 출력의 직선 관계를 찾고 예측에 활용하는 방법으로 소개한다.",
      "hint": "관계 분석과 예측이라는 두 축을 본다."
    },
    {
      "id": "ai-ml-hard-008",
      "conceptId": "equation-components-hard-008",
      "difficulty": "hard",
      "category": "2. 단순선형회귀",
      "questionType": "multiple-choice",
      "prompt": "회귀식이 매출=120+3×광고비이고 광고비 단위가 만 원일 때 기울기 3의 해석으로 가장 적절한 것은?",
      "options": [
        "광고비가 0이면 모든 기업의 실제 매출이 반드시 120만 원이다.",
        "광고비가 3만 원 증가할 때 매출은 항상 정확히 1만 원 증가한다.",
        "광고비가 1만 원 증가할 때 평균 매출이 약 3만 원 증가한다.",
        "매출이 1만 원 증가하면 광고비가 원인으로 정확히 3만 원 증가한다."
      ],
      "answer": 2,
      "explanation": "기울기는 입력이 한 단위 증가할 때 조건부 평균 출력이 얼마나 변하는지를 나타낸다. 개별 관측값이나 인과관계를 보장하지 않는다.",
      "hint": "기울기는 X가 한 단위 변할 때 예측되는 Y의 평균 변화량이다."
    },
    {
      "id": "ai-ml-hard-018",
      "conceptId": "add-variable-reason-hard-018",
      "difficulty": "hard",
      "category": "3. 다중선형회귀",
      "questionType": "multiple-choice",
      "prompt": "다중선형회귀에서 다른 변수를 고정한 채 면적 계수가 2.5로 추정되었다. 올바른 해석은?",
      "options": [
        "면적 계수가 양수이므로 테스트 오류는 항상 0이다.",
        "면적이 한 단위 증가하면 다른 변수도 반드시 2.5 증가한다.",
        "면적과 출력 사이에 인과관계가 100% 증명되었다.",
        "다른 설명변수가 같을 때 면적이 한 단위 증가하면 예측값이 평균 2.5 증가한다."
      ],
      "answer": 3,
      "explanation": "다중회귀 계수는 다른 설명변수를 고정했을 때 해당 변수가 한 단위 변함에 따른 예측 평균의 변화다.",
      "hint": "‘다른 변수를 고정한다’는 조건을 빠뜨리지 않는다."
    },
    {
      "id": "ai-ml-hard-019",
      "conceptId": "caution-both-hard-019",
      "difficulty": "hard",
      "category": "4. 선형회귀 주의사항",
      "questionType": "multiple-choice",
      "prompt": "다중선형회귀를 해석할 때 주의사항을 가장 잘 반영한 태도는?",
      "options": [
        "변수 간 높은 상관의 다중공선성을 살피고 상관관계와 인과관계를 구분한다",
        "p-value가 작으면 모든 인과를 확정한다",
        "설명변수는 반드시 하나만 둔다",
        "R²를 사용하지 않는다"
      ],
      "answer": 0,
      "explanation": "다중공선성과 상관/인과 구분을 주의사항으로 제시한다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 회귀계수의 의미, 잔차, 최소제곱과 변수 수."
    },
    {
      "id": "ai-ml-hard-002",
      "conceptId": "nested-reasoning-hard-002",
      "difficulty": "hard",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "multiple-choice",
      "prompt": "어떤 모델이 DL로 분류되었다. 포함관계만으로 반드시 참인 것을 고르시오.",
      "options": [
        "그 모델은 ML 범주에는 포함되지 않는다",
        "그 모델은 ML 범주에도 포함되고 AI 범주에도 포함된다",
        "그 모델은 반드시 규칙 기반 시스템이다",
        "그 모델은 선형회귀일 수 없다"
      ],
      "answer": 1,
      "explanation": "DL⊂ML⊂AI이므로 DL이면 ML과 AI 범주에도 포함된다.",
      "hint": "안쪽 원에 속하면 바깥 원에도 속한다."
    },
    {
      "id": "ai-ml-hard-004",
      "conceptId": "mixed-youtube-spam-hard-004",
      "difficulty": "hard",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "다음 데이터 묶음 중 앞의 두 항목은 Feature이고 마지막 항목은 Label인 조합은?",
      "options": [
        "시청 여부, 좋아요 클릭 여부, 장르",
        "스팸/정상, 발신자, 메일 제목",
        "메일 제목, 단어 빈도, 스팸/정상",
        "Income, Years of Education, TV"
      ],
      "answer": 2,
      "explanation": "스팸 분류에서 메일 제목과 단어 빈도는 Feature, 스팸/정상은 Label이다.",
      "hint": "입력 두 개 뒤에 최종 정답이 오는 조합을 찾는다."
    },
    {
      "id": "ai-ml-hard-025",
      "conceptId": "one-d-feature-change-hard",
      "difficulty": "hard",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "multiple-choice",
      "prompt": "교육연수 하나만 입력하던 1D 예시에 두 번째 입력 변수를 추가했다면 1D 설명과 비교해 가장 정확한 판단은?",
      "options": [
        "측정오차 ε이 사라진다",
        "Label이 두 개가 된다",
        "반드시 비지도학습이 된다",
        "Feature가 하나라는 조건을 더 이상 만족하지 않는다"
      ],
      "answer": 3,
      "explanation": "1D 피처 기반 학습은 Feature가 하나인 가장 단순한 형태라고 설명된다.",
      "hint": "차원은 출력 개수가 아니라 입력 Feature 수와 연결한다."
    },
    {
      "id": "ai-ml-hard-030",
      "conceptId": "linear-regression-question-set-hard",
      "difficulty": "hard",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "광고 데이터 '관계 존재·강도·매체 기여·미래 예측·매체 간 시너지'를 함께 제시한 의도로 가장 적절한 것은?",
      "options": [
        "선형회귀가 관계 해석과 예측에 활용되는 여러 질문을 보여주기 위해",
        "선형회귀가 분류 문제만 푼다는 것을 보이기 위해",
        "Feature가 항상 하나임을 보이기 위해",
        "R² 계산법만 가르치기 위해"
      ],
      "answer": 0,
      "explanation": "광고 데이터를 통해 선형회귀로 답할 수 있는 여러 실무 질문을 제시한다.",
      "hint": "질문들이 모두 어떤 분석 목적을 공유하는지 본다."
    },
    {
      "id": "ai-ml-hard-009",
      "conceptId": "residual-direction-hard-009",
      "difficulty": "hard",
      "category": "2. 단순선형회귀",
      "questionType": "multiple-choice",
      "prompt": "같은 회귀선에서 관측점 A는 선 위쪽, B는 선 아래쪽에 있다. e=y-ŷ를 사용할 때 일반적으로 부호 조합은?",
      "options": [
        "A 음수, B 양수",
        "A 양수, B 음수",
        "둘 다 양수",
        "둘 다 0"
      ],
      "answer": 1,
      "explanation": "위쪽 점은 실제값이 예측값보다 커 양수, 아래쪽 점은 실제값이 작아 음수 잔차를 갖는다.",
      "hint": "실제 y와 선의 ŷ 크기를 비교한다."
    },
    {
      "id": "ai-ml-hard-058",
      "conceptId": "multiple-regression-purpose-hard",
      "difficulty": "hard",
      "category": "3. 다중선형회귀",
      "questionType": "multiple-choice",
      "prompt": "TV, Radio, 가격, 계절, 경쟁사 등 여러 요인을 함께 고려하는 다중선형회귀의 목적을 가장 잘 설명한 것은?",
      "options": [
        "모든 변수의 상관을 없애기 위해",
        "Label을 여러 개 만들기 위해",
        "여러 설명변수가 반응변수와 맺는 관계를 함께 고려해 예측을 설명하기 위해",
        "선형성을 사용하지 않기 위해"
      ],
      "answer": 2,
      "explanation": "여러 요인을 함께 고려해 매출을 설명하는 예로 다중선형회귀를 소개한다.",
      "hint": "단순회귀와 비교해 늘어난 것이 무엇인지 본다."
    },
    {
      "id": "ai-ml-hard-059",
      "conceptId": "multicollinearity-warning-hard",
      "difficulty": "hard",
      "category": "4. 선형회귀 주의사항",
      "questionType": "multiple-choice",
      "prompt": "다중선형회귀에서 설명변수들 사이의 상관관계가 매우 높을 때 주의사항으로 언급한 문제는?",
      "options": [
        "Deep Learning",
        "잔차",
        "Label 누락",
        "다중공선성"
      ],
      "answer": 3,
      "explanation": "학습목표는 변수 간 상관관계가 높을 때 다중공선성 문제가 생길 수 있음을 제시한다.",
      "hint": "선형회귀 주의사항의 첫 번째 핵심 용어다."
    },
    {
      "id": "ai-ml-hard-020",
      "conceptId": "ai-ml-dl-implication-hard",
      "difficulty": "hard",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "multiple-choice",
      "prompt": "어떤 시스템이 DL이라고 확실히 분류되었다. 포함관계만 이용할 때 동시에 참이어야 하는 설명은?",
      "options": [
        "그 시스템은 ML이면서 AI이기도 하다",
        "그 시스템은 ML이 아니지만 AI다",
        "그 시스템은 규칙 기반 시스템이어야 한다",
        "그 시스템은 Feature와 Label을 사용할 수 없다"
      ],
      "answer": 0,
      "explanation": "DL은 ML에 포함되고 ML은 AI에 포함된다.",
      "hint": "포함 원 안에서 DL의 위치를 따라 바깥으로 이동한다."
    },
    {
      "id": "ai-ml-hard-005",
      "conceptId": "youtube-target-swap-hard-005",
      "difficulty": "hard",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "유튜브 추천 데이터에서 '시청 여부'를 입력 Feature로 쓰고 '장르'를 Label로 정답 처리한다면 원래 예시와 비교해 무엇이 뒤바뀐 것인가?",
      "options": [
        "AI와 ML의 포함관계",
        "Feature와 Label의 역할",
        "RSS와 R²의 정의",
        "절편과 기울기의 수학식"
      ],
      "answer": 1,
      "explanation": "원래 예시에서 장르는 Feature이고 시청 여부는 Label이므로 두 역할이 뒤바뀐다.",
      "hint": "원래 추천 예시의 입력과 피드백을 떠올린다."
    },
    {
      "id": "ai-ml-hard-027",
      "conceptId": "true-function-error-hard",
      "difficulty": "hard",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "multiple-choice",
      "prompt": "Incomeᵢ=f*(Years of Educationᵢ)+εᵢ에서 관측점이 f* 곡선과 정확히 일치하지 않을 수 있는 이유를 가장 잘 설명한 것은?",
      "options": [
        "Years of Education이 오차항이기 때문",
        "f*가 Label이기 때문",
        "관측값에 측정 오차 εᵢ가 포함되기 때문",
        "데이터가 반드시 잘못되었기 때문"
      ],
      "answer": 2,
      "explanation": "f*를 미지의 참함수, εᵢ를 측정 오차로 표시한다.",
      "hint": "식에서 f* 뒤에 더해지는 항의 의미를 본다."
    },
    {
      "id": "ai-ml-hard-031",
      "conceptId": "linear-regression-supervised-hard",
      "difficulty": "hard",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "선형회귀를 지도학습의 가장 기초적 접근 중 하나로 소개한 점과 가장 잘 연결되는 설명은?",
      "options": [
        "항상 Neural Network를 사용하기 때문",
        "정답 없이 군집만 만들기 때문",
        "규칙을 사람이 모두 입력하기 때문",
        "입력 변수와 관측된 출력 변수의 관계를 이용해 예측하기 때문"
      ],
      "answer": 3,
      "explanation": "선형회귀는 입력 변수와 출력 변수 사이의 관계를 이용하는 지도학습 방법으로 소개된다.",
      "hint": "지도학습에서 관측된 Y의 역할을 생각한다."
    },
    {
      "id": "ai-ml-hard-010",
      "conceptId": "squared-cancellation-hard-010",
      "difficulty": "hard",
      "category": "2. 단순선형회귀",
      "questionType": "multiple-choice",
      "prompt": "잔차가 +5와 -5인 두 점이 있다고 해서 오차가 상쇄되어 RSS가 0이 되지 않는 이유는?",
      "options": [
        "RSS는 잔차를 제곱한 뒤 더하기 때문",
        "RSS는 잔차의 부호만 더하기 때문",
        "R²를 대신 사용하기 때문",
        "Label을 제곱하기 때문"
      ],
      "answer": 0,
      "explanation": "RSS는 e_i²의 합이므로 +5와 -5 모두 25씩 기여한다.",
      "hint": "제곱하면 부호가 사라진다."
    },
    {
      "id": "ai-ml-hard-060",
      "conceptId": "correlation-causation-judgment-hard",
      "difficulty": "hard",
      "category": "4. 선형회귀 주의사항",
      "questionType": "multiple-choice",
      "prompt": "회귀 결과에서 두 변수가 강하게 연관되어 보인다는 이유만으로 'X가 Y의 원인이다'라고 결론 내렸다. 주의사항에 비추어 가장 적절한 평가는?",
      "options": [
        "R²만 높으면 항상 옳은 해석이다",
        "상관관계와 인과관계를 구분하지 않은 해석이다",
        "다중공선성이 자동으로 해결된 해석이다",
        "Feature와 Label을 올바르게 바꾼 해석이다"
      ],
      "answer": 1,
      "explanation": "상관관계와 인과관계를 서로 구분해야 한다고 강조한다.",
      "hint": "함께 변한다는 사실과 원인이라는 주장을 분리한다."
    },
    {
      "id": "ai-ml-hard-021",
      "conceptId": "rule-vs-learning-hard",
      "difficulty": "hard",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "multiple-choice",
      "prompt": "시스템 A는 개발자가 작성한 고정 규칙만 사용하고, 시스템 B는 과거 데이터에서 패턴을 학습한다. 가장 중요한 구분 기준은?",
      "options": [
        "출력값이 숫자인가 여부",
        "화면이 있는가 여부",
        "데이터에서 규칙을 학습하는가 여부",
        "인터넷에 연결되는가 여부"
      ],
      "answer": 2,
      "explanation": "규칙 기반 AI와 데이터에서 학습하는 ML을 구분한다.",
      "hint": "ML 정의에 포함된 '데이터로부터 학습'을 기준으로 본다."
    },
    {
      "id": "ai-ml-hard-022",
      "conceptId": "loop-failure-hard",
      "difficulty": "hard",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "모델이 학습 데이터에서는 동작하지만 실제 성능을 확인하지 않은 채 종료되었다. 반복 개선 루프 관점에서 가장 직접적으로 빠진 단계는?",
      "options": [
        "Feature",
        "데이터",
        "모델",
        "평가"
      ],
      "answer": 3,
      "explanation": "루프는 데이터→모델→학습→평가이고 평가 결과가 다시 개선에 사용된다.",
      "hint": "학습 다음 상자를 확인한다."
    },
    {
      "id": "ai-ml-hard-029",
      "conceptId": "dataset-pair-hard",
      "difficulty": "hard",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "multiple-choice",
      "prompt": "교육연수-소득 데이터셋 D={(Years of Educationᵢ, Incomeᵢ)}의 한 원소가 의미하는 것으로 옳은 것은?",
      "options": [
        "한 사람의 Feature와 Label이 짝을 이룬 하나의 관측 사례",
        "두 개의 서로 다른 모델",
        "두 종류의 Label",
        "하나의 회귀계수와 하나의 잔차"
      ],
      "answer": 0,
      "explanation": "데이터셋은 각 i에 대해 교육연수 Feature와 소득 Label의 쌍으로 구성된다.",
      "hint": "괄호 안 두 값의 역할을 연결한다."
    },
    {
      "id": "ai-ml-hard-032",
      "conceptId": "regression-real-use-hard",
      "difficulty": "hard",
      "category": "1. 선형회귀",
      "questionType": "multiple-choice",
      "prompt": "선형회귀 실제 응용 사례 두 가지를 관통하는 공통 목적은?",
      "options": [
        "문장을 번역하는 것",
        "관측된 변수 사이의 관계를 이용해 수치 결과를 설명하거나 예측하는 것",
        "이미지를 생성하는 것",
        "규칙 기반 분기만 수행하는 것"
      ],
      "answer": 1,
      "explanation": "광고비-매출 관계 분석과 고객 소득-소비 패턴 기반 신용점수 사례가 실제 응용으로 제시된다.",
      "hint": "두 사례가 모두 연속적인 수치 관계를 다룬다는 점을 본다."
    },
    {
      "id": "ai-ml-hard-011",
      "conceptId": "candidate-fit-logic-hard-011",
      "difficulty": "hard",
      "category": "2. 단순선형회귀",
      "questionType": "multiple-choice",
      "prompt": "후보 회귀선 A와 B가 같은 데이터에 대해 각각 RSS=18, RSS=12를 보였다. 최소제곱법의 선택과 이유로 옳은 것은?",
      "options": [
        "A, 절편이 항상 더 중요하기 때문",
        "A, RSS가 클수록 좋기 때문",
        "B, 실제값과 예측값 차이의 제곱합이 더 작기 때문",
        "둘 다 동일, RSS는 선택 기준이 아니기 때문"
      ],
      "answer": 2,
      "explanation": "최소제곱법은 RSS를 최소화하므로 12인 B를 선택한다.",
      "hint": "least squares의 목적을 그대로 적용한다."
    },
    {
      "id": "ai-ml-hard-088",
      "conceptId": "multicollinearity-cause-hard-v4",
      "difficulty": "hard",
      "category": "4. 선형회귀 주의사항",
      "questionType": "multiple-choice",
      "prompt": "다중공선성을 특히 주의해야 하는 상황은?",
      "options": [
        "R²가 계산되는 경우",
        "반응변수가 하나인 경우",
        "잔차가 존재하는 모든 경우",
        "설명변수들끼리 서로 매우 높은 상관관계를 보이는 경우"
      ],
      "answer": 3,
      "explanation": "변수 간 상관관계가 높을 때 다중공선성 문제가 생길 수 있다고 설명한다.",
      "hint": "설명변수들 사이의 관계를 본다."
    },
    {
      "id": "ai-ml-hard-061",
      "conceptId": "ai-ml-dl-classification-hard-v4",
      "difficulty": "hard",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "multiple-choice",
      "prompt": "신경망을 이용해 데이터에서 학습하는 시스템이 있다. 포함관계에 따른 가장 구체적인 분류는?",
      "options": [
        "DL이며 동시에 ML과 AI에 포함된다",
        "AI이지만 ML에는 포함되지 않는다",
        "규칙 기반 AI만 해당한다",
        "ML이지만 AI에는 포함되지 않는다"
      ],
      "answer": 0,
      "explanation": "DL은 신경망을 이용하는 ML 방법이며 ML은 AI에 포함된다.",
      "hint": "가장 안쪽 개념에서 바깥쪽으로 포함관계를 따라간다."
    },
    {
      "id": "ai-ml-hard-024",
      "conceptId": "youtube-feature-composition-hard",
      "difficulty": "hard",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "multiple-choice",
      "prompt": "유튜브 추천 예시에서 영상 정보와 사용자 정보를 함께 Feature로 사용하는 이유를 표현에 가장 가깝게 설명한 것은?",
      "options": [
        "Label을 없애기 위해",
        "사용자의 반응을 예측하는 근거가 되는 여러 입력정보를 제공하기 위해",
        "평가 단계를 생략하기 위해",
        "신경망을 반드시 사용하기 위해"
      ],
      "answer": 1,
      "explanation": "장르·크리에이터·조회수·좋아요 수와 시청이력·구독채널 등은 예측 근거가 되는 Feature다.",
      "hint": "Feature의 정의인 '예측, 판단의 근거/단서'에 연결한다."
    },
    {
      "id": "ai-ml-hard-067",
      "conceptId": "true-function-observation-hard-v4",
      "difficulty": "hard",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "multiple-choice",
      "prompt": "교육연수-소득 산점도의 관측점이 미지의 참함수 f* 곡선에서 벗어날 수 있는 이유는?",
      "options": [
        "Income이 Feature이기 때문",
        "f*가 항상 잘못된 함수이기 때문",
        "관측값에 측정 오차 ε가 더해질 수 있기 때문",
        "Years of Education이 Label이기 때문"
      ],
      "answer": 2,
      "explanation": "Incomeᵢ=f*(Years of Educationᵢ)+εᵢ로 표현되므로 관측값에는 측정 오차가 포함될 수 있다.",
      "hint": "함수 값 뒤에 더해지는 항을 본다."
    },
    {
      "id": "ai-ml-hard-070",
      "conceptId": "simple-regression-model-hard",
      "difficulty": "hard",
      "category": "2. 단순선형회귀",
      "questionType": "short-answer",
      "prompt": "단순선형회귀의 모형을 β₀, β₁, X, ε를 사용해 식으로 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Y = β₀ + β₁X + ε",
        "Y=β₀+β₁X+ε"
      ],
      "explanation": "기본 모형은 Y=β₀+β₁X+ε이다.",
      "hint": "절편+기울기×입력+오차 순서다."
    },
    {
      "id": "ai-ml-hard-083",
      "conceptId": "multicollinearity-term-hard",
      "difficulty": "hard",
      "category": "4. 선형회귀 주의사항",
      "questionType": "short-answer",
      "prompt": "변수 간 상관관계가 높을 때 발생할 수 있다고 언급한 문제의 명칭을 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "다중공선성"
      ],
      "explanation": "학습목표의 선형회귀 주의사항에 다중공선성이 명시되어 있다.",
      "hint": "여러 설명변수가 서로 강하게 연관될 때의 용어다."
    },
    {
      "id": "ai-ml-hard-071",
      "conceptId": "residual-formula-hard",
      "difficulty": "hard",
      "category": "2. 단순선형회귀",
      "questionType": "short-answer",
      "prompt": "잔차 eᵢ를 실제값과 예측값 기호를 사용해 식으로 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "eᵢ = yᵢ - ŷᵢ",
        "eᵢ=yᵢ-ŷᵢ"
      ],
      "explanation": "잔차는 실제 관측값에서 예측값을 뺀 값이다.",
      "hint": "실제값이 앞에 온다."
    },
    {
      "id": "ai-ml-hard-072",
      "conceptId": "xbar-symbol-hard",
      "difficulty": "hard",
      "category": "2. 단순선형회귀",
      "questionType": "short-answer",
      "prompt": "최소제곱 기울기·절편 공식에서 설명변수 X의 표본평균을 나타내는 기호를 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "x̄"
      ],
      "explanation": "closed-form 공식에서 X의 표본평균은 x̄로 표시된다.",
      "hint": "X 위에 평균을 뜻하는 가로선이 붙는다."
    },
    {
      "id": "ai-ml-hard-073",
      "conceptId": "slope-estimator-symbol-hard-v4",
      "difficulty": "hard",
      "category": "2. 단순선형회귀",
      "questionType": "short-answer",
      "prompt": "최소제곱법으로 데이터에서 추정한 '기울기'의 기호를 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "β̂₁"
      ],
      "explanation": "기울기 추정량은 β̂₁이다.",
      "hint": "아래첨자 1과 추정 표시를 함께 쓴다."
    },
    {
      "id": "ai-ml-hard-074",
      "conceptId": "intercept-estimator-from-formula-hard-v4",
      "difficulty": "hard",
      "category": "2. 단순선형회귀",
      "questionType": "short-answer",
      "prompt": "ȳ - β̂₁x̄로 계산되는 회귀계수의 기호를 작성하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "β̂₀"
      ],
      "explanation": "β̂₀=ȳ-β̂₁x̄이므로 이 식은 절편 추정량이다.",
      "hint": "평균과 기울기를 이용해 계산하는 상수항이다."
    },
    {
      "id": "ai-ml-hard-091",
      "conceptId": "hard-ai-ml-dl-essay-hard-091",
      "difficulty": "hard",
      "category": "1. AI, ML, DL의 정의",
      "questionType": "essay",
      "prompt": "규칙 기반 시스템, 데이터에서 학습하는 ML, 신경망을 사용하는 DL을 AI⊃ML⊃DL 포함 관계와 연결하여 20자 이상 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "AI",
        "ML",
        "DL",
        "규칙 기반"
      ],
      "modelAnswer": "AI가 가장 넓은 범위이고 그 안에 ML, 다시 그 안에 DL이 포함된다. 사람이 정한 규칙으로 동작하는 규칙 기반 시스템은 AI 중 ML이 아닌 예이고, 데이터에서 규칙을 학습하면 ML, 그중 신경망을 이용해 학습하면 DL로 볼 수 있다.",
      "rubricKeywords": [
        "AI",
        "ML",
        "DL",
        "신경망",
        "규칙"
      ],
      "minLength": 20,
      "explanation": "포함 관계와 규칙 기반·데이터 학습·신경망 학습의 대응을 모두 포함해야 한다.",
      "hint": "가장 바깥 AI부터 안쪽 DL까지 순서대로 연결한다."
    },
    {
      "id": "ai-ml-hard-092",
      "conceptId": "hard-feature-label-loop-essay-hard-092",
      "difficulty": "hard",
      "category": "2. 데이터와 학습의 이해",
      "questionType": "essay",
      "prompt": "유튜브 추천 사례에서 Feature와 Label을 정하고, 이 데이터가 머신러닝 반복 개선 루프에서 어떻게 사용되는지 20자 이상 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Feature",
        "Label",
        "데이터",
        "평가"
      ],
      "modelAnswer": "유튜브 추천에서는 장르·크리에이터·조회수·좋아요 수와 시청 이력·구독 채널 같은 정보가 Feature이고, 시청 여부·좋아요 클릭 여부 같은 사용자 피드백이 Label이다. 이런 데이터로 모델을 학습하고 평가한 뒤 평가 결과를 다시 모델 개선에 반영하는 반복 루프를 구성한다.",
      "rubricKeywords": [
        "영상 정보",
        "사용자 정보",
        "피드백",
        "학습",
        "평가"
      ],
      "minLength": 20,
      "explanation": "Feature/Label 예시와 데이터→모델→학습→평가의 반복 개선을 모두 연결해야 한다.",
      "hint": "추천 입력, 사용자 반응, 평가 피드백을 차례로 생각한다."
    },
    {
      "id": "ai-ml-hard-094",
      "conceptId": "one-feature-function-essay-hard",
      "difficulty": "hard",
      "category": "3. 단일 피처 기반 학습",
      "questionType": "essay",
      "prompt": "교육연수-소득 1D 예시에서 D={(Years of Educationᵢ, Incomeᵢ)}, f*, εᵢ가 각각 무엇을 의미하며 모델이 무엇을 학습하려는지 20자 이상 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "Years of Education",
        "Income",
        "f*",
        "ε"
      ],
      "modelAnswer": "데이터셋 D의 각 원소는 교육연수 Feature와 소득 Label의 한 쌍이다. f*는 두 변수 사이의 미지의 참함수이고 εᵢ는 측정 오차다. 모델은 여러 관측쌍을 이용해 오차가 섞인 데이터에서 교육연수와 소득 사이의 관계를 근사해 학습한다.",
      "rubricKeywords": [
        "Feature",
        "Label",
        "미지의 참함수",
        "측정 오차",
        "관계"
      ],
      "minLength": 20,
      "explanation": "데이터 한 쌍, 참함수, 오차를 각각 구분해야 한다.",
      "hint": "식의 왼쪽·함수 부분·마지막 오차항을 차례로 설명한다."
    },
    {
      "id": "ai-ml-hard-096",
      "conceptId": "simple-multiple-caution-essay-hard",
      "difficulty": "hard",
      "category": "3. 다중선형회귀",
      "questionType": "essay",
      "prompt": "TV 하나를 사용하는 단순선형회귀와 TV·Radio·가격·계절·경쟁사 등을 함께 고려하는 다중선형회귀를 비교하고, 다중선형회귀 해석 시 주의하라고 제시한 내용을 20자 이상 설명하시오.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "단순선형회귀",
        "다중선형회귀",
        "다중공선성",
        "상관관계",
        "인과관계"
      ],
      "modelAnswer": "단순선형회귀는 하나의 설명변수와 반응변수의 선형 관계를 다루지만 다중선형회귀는 여러 설명변수를 동시에 고려한다. 변수 간 상관관계가 높을 때 다중공선성 문제가 생길 수 있음을 언급하고, 상관관계와 인과관계를 구분해야 한다고 강조한다.",
      "rubricKeywords": [
        "하나의 설명변수",
        "여러 설명변수",
        "다중공선성",
        "상관관계",
        "인과관계"
      ],
      "minLength": 20,
      "explanation": "모델 구조 비교와 주의사항을 모두 포함해야 한다.",
      "hint": "입력 변수 개수 차이 다음에 해석상의 두 주의점을 붙인다."
    },
    {
      "id": "w1-refresh-hard-mc-001",
      "conceptId": "supervised-learning",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "이진 분류 결과가 TP=36, FP=12, FN=4, TN=48일 때 정밀도(precision)는?",
      "options": [
        "0.96",
        "0.80",
        "0.90",
        "0.75"
      ],
      "answer": 3,
      "explanation": "정밀도는 TP/(TP+FP)이므로 36/(36+12)=0.75이다. FN은 재현율 계산에 사용된다.",
      "hint": "정밀도의 분모에는 모델이 양성으로 예측한 TP와 FP가 들어간다."
    },
    {
      "id": "w1-refresh-hard-mc-002",
      "conceptId": "supervised-learning",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "실제값이 [2, 4]이고 모델 예측값이 [3, 1]일 때 평균제곱오차(MSE)는?",
      "options": [
        "5",
        "4",
        "2",
        "10"
      ],
      "answer": 0,
      "explanation": "오차는 1과 -3이고 제곱은 1과 9이다. 두 값을 평균하면 MSE는 5이다.",
      "hint": "각 오차를 제곱한 뒤 샘플 수로 나눈다."
    },
    {
      "id": "w1-refresh-hard-mc-003",
      "conceptId": "supervised-learning",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "고객 정보와 실제 이탈 여부를 함께 학습해 다음 달 이탈 고객을 예측한다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "훈련 오류가 0이 되어야만 새로운 데이터에 일반화할 수 있다.",
        "회귀와 분류는 대표적인 지도학습 문제다.",
        "feature는 반드시 하나의 수치 변수여야 한다.",
        "정답 라벨 없이 데이터의 숨은 구조만 찾는 학습이다."
      ],
      "answer": 1,
      "explanation": "회귀와 분류는 대표적인 지도학습 문제다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-004",
      "conceptId": "regression-classification",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "다음 (가), (나)에 해당하는 개념의 조합으로 옳은 것은? (가) 연속적인 수치를 예측하면 회귀, 정해진 범주를 예측하면 분류로 구분하는 지도학습 문제 유형 (나) 모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수",
      "options": [
        "(가) 손실함수 / (나) 회귀와 분류",
        "(가) K-겹 교차검증 / (나) 손실함수",
        "(가) 회귀와 분류 / (나) 손실함수",
        "(가) 회귀와 분류 / (나) 표준화"
      ],
      "answer": 2,
      "explanation": "(가)는 회귀와 분류, (나)는 손실함수의 정의다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-005",
      "conceptId": "regression-classification",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "회귀와 분류에 관한 설명이다. 옳은 것만 고른 것은? ① 가격·점수·온도처럼 연속적인 수치를 예측하면 회귀다. ② 스팸·정상처럼 유한한 범주를 예측하면 분류다. ③ 회귀는 범주만 예측하고 분류는 연속적인 수치만 예측한다.",
      "options": [
        "②",
        "①, ②, ③",
        "①",
        "①, ②"
      ],
      "answer": 3,
      "explanation": "정답은 \"①, ②\"이다. 회귀와 분류은 연속적인 수치를 예측하면 회귀, 정해진 범주를 예측하면 분류로 구분하는 지도학습 문제 유형이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-006",
      "conceptId": "regression-classification",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "주택 가격을 예측하는 문제와 이메일을 스팸 또는 정상으로 나누는 문제를 구분한다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "문제 유형은 주로 예측 대상인 label의 성격으로 판단한다.",
        "회귀와 분류는 정답 라벨을 사용하지 않는 비지도학습이다.",
        "회귀는 범주만 예측하고 분류는 연속적인 수치만 예측한다.",
        "입력 feature가 두 개 이상이면 문제는 항상 분류가 된다."
      ],
      "answer": 0,
      "explanation": "문제 유형은 주로 예측 대상인 label의 성격으로 판단한다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-007",
      "conceptId": "loss-functions",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "다음 (가), (나)에 해당하는 개념의 조합으로 옳은 것은? (가) 모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수 (나) 이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표",
      "options": [
        "(가) 비지도학습 / (나) 혼동행렬",
        "(가) 손실함수 / (나) 혼동행렬",
        "(가) 손실함수 / (나) 로지스틱 회귀",
        "(가) 혼동행렬 / (나) 손실함수"
      ],
      "answer": 1,
      "explanation": "(가)는 손실함수, (나)는 혼동행렬의 정의다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-008",
      "conceptId": "loss-functions",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "손실함수에 관한 설명이다. 옳은 것만 고른 것은? ① 손실값이 작을수록 예측이 정답에 가까운 것으로 해석한다. ② MSE는 실제값과 예측값의 차이를 제곱해 평균한다. ③ 손실값은 클수록 모델의 예측 성능이 좋다.",
      "options": [
        "①, ②, ③",
        "①",
        "①, ②",
        "②"
      ],
      "answer": 2,
      "explanation": "정답은 \"①, ②\"이다. 손실함수은 모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-009",
      "conceptId": "loss-functions",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "회귀 모델은 MSE를, 분류 모델은 정답 범주의 예측 확률을 반영하는 교차 엔트로피를 줄이도록 학습한다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "손실함수를 정하면 부족한 학습 데이터가 자동으로 생성된다.",
        "손실값은 클수록 모델의 예측 성능이 좋다.",
        "MSE는 범주형 분류 문제에만 사용할 수 있다.",
        "교차 엔트로피는 분류에서 정답 범주에 부여한 확률을 반영한다."
      ],
      "answer": 3,
      "explanation": "교차 엔트로피는 분류에서 정답 범주에 부여한 확률을 반영한다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-010",
      "conceptId": "confusion-matrix",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "다음 (가), (나)에 해당하는 개념의 조합으로 옳은 것은? (가) 이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표 (나) 학습에 사용하지 않은 새로운 데이터에서 측정한 예측 오류로 일반화 성능을 판단하는 기준",
      "options": [
        "(가) 혼동행렬 / (나) 테스트 오류",
        "(가) 혼동행렬 / (나) ReLU",
        "(가) 테스트 오류 / (나) 혼동행렬",
        "(가) K-means / (나) 테스트 오류"
      ],
      "answer": 0,
      "explanation": "(가)는 혼동행렬, (나)는 테스트 오류의 정의다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-011",
      "conceptId": "confusion-matrix",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "혼동행렬에 관한 설명이다. 옳은 것만 고른 것은? ① 정확도는 전체 예측 중 맞힌 예측의 비율이다. ② FN은 실제 양성을 음성으로 잘못 예측한 경우다. ③ 정확도가 99%이면 클래스 비율과 관계없이 항상 좋은 분류 모델이다.",
      "options": [
        "①",
        "①, ②",
        "②",
        "①, ②, ③"
      ],
      "answer": 1,
      "explanation": "정답은 \"①, ②\"이다. 혼동행렬은 이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-012",
      "conceptId": "confusion-matrix",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "multiple-choice",
      "prompt": "질병 환자가 매우 적은 데이터에서 정확도만 보지 않고 놓친 환자와 잘못 경고한 사람을 따로 계산한다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "정확도가 99%이면 클래스 비율과 관계없이 항상 좋은 분류 모델이다.",
        "FP는 실제 양성을 음성으로 놓친 경우를 뜻한다.",
        "클래스가 불균형하면 높은 정확도만으로 좋은 모델이라고 단정하기 어렵다.",
        "혼동행렬은 연속적인 수치를 예측하는 회귀에서만 사용한다."
      ],
      "answer": 2,
      "explanation": "클래스가 불균형하면 높은 정확도만으로 좋은 모델이라고 단정하기 어렵다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-013",
      "conceptId": "test-generalization",
      "difficulty": "hard",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "하이퍼파라미터 후보 20개를 테스트셋 정확도로 비교해 가장 높은 모델을 선택했다. 이 평가의 핵심 문제는?",
      "options": [
        "정확도는 테스트 데이터에서는 정의할 수 없는 지표다.",
        "훈련셋을 사용하지 않았으므로 과적합이 원천적으로 불가능하다.",
        "후보가 많으면 테스트셋이 자동으로 검증셋과 훈련셋으로 나뉜다.",
        "테스트셋이 모델 선택에 사용되어 최종 성능 추정이 낙관적으로 편향될 수 있다."
      ],
      "answer": 3,
      "explanation": "테스트셋을 반복적인 모델 선택에 사용하면 테스트 정보에 간접적으로 과적합되어 공정한 최종 평가가 되지 않는다.",
      "hint": "최종 시험지를 여러 후보를 고르는 과정에서 반복해서 사용한 상황과 같다."
    },
    {
      "id": "w1-refresh-hard-mc-014",
      "conceptId": "test-generalization",
      "difficulty": "hard",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "100개 샘플에 5-겹 교차검증을 적용한다. 각 반복의 학습·검증 샘플 수와 총 학습 횟수로 옳은 것은?",
      "options": [
        "학습 80, 검증 20, 총 5회",
        "학습 20, 검증 80, 총 5회",
        "학습 80, 검증 20, 총 1회",
        "학습 95, 검증 5, 총 20회"
      ],
      "answer": 0,
      "explanation": "5개 폴드 중 4개인 80개로 학습하고 1개인 20개로 검증하는 과정을 폴드를 바꾸어 5회 수행한다.",
      "hint": "한 폴드만 검증에 사용하고 나머지 K-1개 폴드는 학습에 사용한다."
    },
    {
      "id": "w1-refresh-hard-mc-015",
      "conceptId": "test-generalization",
      "difficulty": "hard",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "훈련 데이터에서는 오차가 작지만 별도로 보관한 새 데이터에서 오차가 크게 증가했는지 확인한다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "훈련 오류와 테스트 오류는 어떤 모델에서도 항상 같다.",
        "훈련 오류와 테스트 오류의 차이는 과적합을 판단하는 단서가 된다.",
        "훈련 오류가 가장 작은 모델은 언제나 테스트 오류도 가장 작다.",
        "테스트 데이터로 반복 학습할수록 일반화 성능을 공정하게 평가할 수 있다."
      ],
      "answer": 1,
      "explanation": "훈련 오류와 테스트 오류의 차이는 과적합을 판단하는 단서가 된다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-hard-mc-016",
      "conceptId": "over-under-fitting",
      "difficulty": "hard",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "다음 (가), (나)에 해당하는 개념의 조합으로 옳은 것은? (가) 모델이 훈련 데이터에 지나치게 맞으면 과적합, 너무 단순해 중요한 패턴도 못 배우면 언더피팅인 상태 (나) 데이터를 K개 폴드로 나누고 각 폴드를 한 번씩 검증에 사용한 뒤 성능을 평균하는 평가 방법",
      "options": [
        "(가) K-겹 교차검증 / (나) 과적합과 언더피팅",
        "(가) 표준화 / (나) K-겹 교차검증",
        "(가) 과적합과 언더피팅 / (나) K-겹 교차검증",
        "(가) 과적합과 언더피팅 / (나) 역전파"
      ],
      "answer": 2,
      "explanation": "(가)는 과적합과 언더피팅, (나)는 K-겹 교차검증의 정의다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-hard-mc-017",
      "conceptId": "over-under-fitting",
      "difficulty": "hard",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "과적합과 언더피팅에 관한 설명이다. 옳은 것만 고른 것은? ① 과적합은 대체로 훈련 오류가 작고 테스트 오류가 큰 상태다. ② 언더피팅은 훈련 오류와 테스트 오류가 모두 큰 경향이 있다. ③ 모델을 복잡하게 만들면 과적합과 언더피팅이 항상 함께 해결된다.",
      "options": [
        "②",
        "①, ②, ③",
        "①",
        "①, ②"
      ],
      "answer": 3,
      "explanation": "정답은 \"①, ②\"이다. 과적합과 언더피팅은 모델이 훈련 데이터에 지나치게 맞으면 과적합, 너무 단순해 중요한 패턴도 못 배우면 언더피팅인 상태이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-hard-mc-018",
      "conceptId": "over-under-fitting",
      "difficulty": "hard",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "매우 복잡한 모델은 훈련 오차가 작고 검증 오차가 크며, 지나치게 단순한 모델은 두 오차가 모두 크다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "검증 성능을 보며 모델 복잡도나 학습 시점을 조절할 수 있다.",
        "테스트 데이터를 반복해서 보며 복잡도를 정하는 것이 가장 공정하다.",
        "모델을 복잡하게 만들면 과적합과 언더피팅이 항상 함께 해결된다.",
        "과적합은 훈련 오류와 테스트 오류가 모두 큰 상태다."
      ],
      "answer": 0,
      "explanation": "검증 성능을 보며 모델 복잡도나 학습 시점을 조절할 수 있다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-hard-mc-019",
      "conceptId": "cross-validation",
      "difficulty": "hard",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "다음 (가), (나)에 해당하는 개념의 조합으로 옳은 것은? (가) 데이터를 K개 폴드로 나누고 각 폴드를 한 번씩 검증에 사용한 뒤 성능을 평균하는 평가 방법 (나) 정답 라벨 없이 입력 데이터의 구조·패턴·잠재 집단을 찾는 학습 방법",
      "options": [
        "(가) 로지스틱 회귀 / (나) 비지도학습",
        "(가) K-겹 교차검증 / (나) 비지도학습",
        "(가) K-겹 교차검증 / (나) 지도학습",
        "(가) 비지도학습 / (나) K-겹 교차검증"
      ],
      "answer": 1,
      "explanation": "(가)는 K-겹 교차검증, (나)는 비지도학습의 정의다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-hard-mc-020",
      "conceptId": "cross-validation",
      "difficulty": "hard",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "K-겹 교차검증에 관한 설명이다. 옳은 것만 고른 것은? ① 각 반복에서 한 폴드는 검증에, 나머지 폴드는 학습에 사용한다. ② K번의 검증 결과를 평균해 일반화 성능을 추정한다. ③ 모든 폴드를 동시에 검증셋으로 사용하고 학습은 한 번만 수행한다.",
      "options": [
        "①, ②, ③",
        "①",
        "①, ②",
        "②"
      ],
      "answer": 2,
      "explanation": "정답은 \"①, ②\"이다. K-겹 교차검증은 데이터를 K개 폴드로 나누고 각 폴드를 한 번씩 검증에 사용한 뒤 성능을 평균하는 평가 방법이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-hard-mc-021",
      "conceptId": "cross-validation",
      "difficulty": "hard",
      "category": "3. 검증과 일반화",
      "questionType": "multiple-choice",
      "prompt": "데이터가 적어 한 번의 검증셋 분할 결과가 불안정하므로 폴드를 바꾸어 K번 학습·평가한다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "교차검증을 하면 최종 테스트 데이터가 항상 필요 없어진다.",
        "모든 폴드를 동시에 검증셋으로 사용하고 학습은 한 번만 수행한다.",
        "K가 커져도 학습 횟수와 계산량은 변하지 않는다.",
        "K가 전체 샘플 수와 같으면 LOOCV가 된다."
      ],
      "answer": 3,
      "explanation": "K가 전체 샘플 수와 같으면 LOOCV가 된다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 훈련·검증·테스트 데이터의 역할과 두 오류의 변화."
    },
    {
      "id": "w1-refresh-hard-mc-022",
      "conceptId": "unsupervised-learning",
      "difficulty": "hard",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "K-means에서 현재 중심이 0과 10이고 관측값이 1, 3, 8, 12일 때 한 번의 할당과 평균 계산 후 새 중심은?",
      "options": [
        "2와 10",
        "1과 12",
        "4와 6",
        "5와 5"
      ],
      "answer": 0,
      "explanation": "1과 3은 중심 0에, 8과 12는 중심 10에 배정된다. 각 집단 평균은 2와 10이다.",
      "hint": "먼저 가까운 중심에 배정한 뒤 각 집단 값의 평균을 계산한다."
    },
    {
      "id": "w1-refresh-hard-mc-023",
      "conceptId": "unsupervised-learning",
      "difficulty": "hard",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "두 클러스터 A={1, 4}, B={8, 10}의 거리를 single linkage와 complete linkage로 계산한 값은?",
      "options": [
        "single=7, complete=6",
        "single=4, complete=9",
        "single=6, complete=7",
        "single=9, complete=4"
      ],
      "answer": 1,
      "explanation": "클러스터 사이 쌍별 거리는 7, 9, 4, 6이다. 최솟값인 single linkage는 4, 최댓값인 complete linkage는 9이다.",
      "hint": "single은 가장 가까운 두 점, complete는 가장 먼 두 점을 사용한다."
    },
    {
      "id": "w1-refresh-hard-mc-024",
      "conceptId": "unsupervised-learning",
      "difficulty": "hard",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "고객의 실제 등급 정답 없이 구매 행동이 비슷한 고객끼리 묶어 시장을 나눈다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "항상 입력과 정답 라벨의 쌍으로 모델을 학습한다.",
        "분류 정확도 하나만으로 모든 비지도학습 결과를 평가한다.",
        "정답 라벨이 없어 결과 해석과 평가가 더 어려울 수 있다.",
        "찾아낸 각 클러스터는 반드시 실제 원인에 따른 정답 범주다."
      ],
      "answer": 2,
      "explanation": "정답 라벨이 없어 결과 해석과 평가가 더 어려울 수 있다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-025",
      "conceptId": "k-means",
      "difficulty": "hard",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "다음 (가), (나)에 해당하는 개념의 조합으로 옳은 것은? (가) K개의 중심을 계산하고 각 관측치를 가장 가까운 중심에 재할당하는 과정을 반복하는 군집화 방법 (나) 관측치에서 시작해 가까운 클러스터를 단계적으로 병합하고 그 과정을 덴드로그램으로 나타내는 방법",
      "options": [
        "(가) K-means / (나) 손실함수",
        "(가) 계층적 군집 / (나) K-means",
        "(가) 경사하강법 / (나) 계층적 군집",
        "(가) K-means / (나) 계층적 군집"
      ],
      "answer": 3,
      "explanation": "(가)는 K-means, (나)는 계층적 군집의 정의다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-026",
      "conceptId": "k-means",
      "difficulty": "hard",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "K-means에 관한 설명이다. 옳은 것만 고른 것은? ① 클러스터 수 K를 학습 전에 정해야 한다. ② 각 클러스터의 중심은 보통 소속 관측치의 feature 평균으로 계산한다. ③ 클러스터 수를 정하지 않아도 덴드로그램이 자동으로 K를 결정한다.",
      "options": [
        "①, ②",
        "②",
        "①, ②, ③",
        "①"
      ],
      "answer": 0,
      "explanation": "정답은 \"①, ②\"이다. K-means은 K개의 중심을 계산하고 각 관측치를 가장 가까운 중심에 재할당하는 과정을 반복하는 군집화 방법이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-027",
      "conceptId": "k-means",
      "difficulty": "hard",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "클러스터 수 K를 먼저 정한 뒤 중심 계산과 재할당을 소속이 바뀌지 않을 때까지 반복한다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "초기 중심은 최종 결과에 아무런 영향을 주지 않는다.",
        "초기 중심에 따라 최종 군집 결과가 달라질 수 있어 여러 번 시도할 수 있다.",
        "한 관측치는 매 반복에서 여러 클러스터에 동시에 속해야 한다.",
        "클러스터 수를 정하지 않아도 덴드로그램이 자동으로 K를 결정한다."
      ],
      "answer": 1,
      "explanation": "초기 중심에 따라 최종 군집 결과가 달라질 수 있어 여러 번 시도할 수 있다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-028",
      "conceptId": "hierarchical-clustering",
      "difficulty": "hard",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "다음 (가), (나)에 해당하는 개념의 조합으로 옳은 것은? (가) 관측치에서 시작해 가까운 클러스터를 단계적으로 병합하고 그 과정을 덴드로그램으로 나타내는 방법 (나) 변수 단위 차이가 거리와 학습에 미치는 영향을 줄이도록 feature의 평균을 0, 분산을 1로 맞추는 변환",
      "options": [
        "(가) 표준화 / (나) 계층적 군집",
        "(가) 역전파 / (나) 표준화",
        "(가) 계층적 군집 / (나) 표준화",
        "(가) 계층적 군집 / (나) 혼동행렬"
      ],
      "answer": 2,
      "explanation": "(가)는 계층적 군집, (나)는 표준화의 정의다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-029",
      "conceptId": "hierarchical-clustering",
      "difficulty": "hard",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "계층적 군집에 관한 설명이다. 옳은 것만 고른 것은? ① 상향식 방법은 관측치별 클러스터에서 시작해 하나가 될 때까지 병합한다. ② Single·Complete·Average linkage는 클러스터 간 거리를 다르게 정의한다. ③ 항상 클러스터 수 K를 먼저 고정하고 중심점을 반복 갱신한다.",
      "options": [
        "②",
        "①, ②, ③",
        "①",
        "①, ②"
      ],
      "answer": 3,
      "explanation": "정답은 \"①, ②\"이다. 계층적 군집은 관측치에서 시작해 가까운 클러스터를 단계적으로 병합하고 그 과정을 덴드로그램으로 나타내는 방법이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-030",
      "conceptId": "hierarchical-clustering",
      "difficulty": "hard",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "각 관측치를 하나의 클러스터로 시작해 가장 유사한 두 집단을 병합하고 원하는 높이에서 덴드로그램을 자른다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "linkage 선택에 따라 같은 데이터의 덴드로그램도 달라질 수 있다.",
        "데이터가 많아도 모든 클러스터 쌍의 거리를 계산할 필요가 없다.",
        "항상 클러스터 수 K를 먼저 고정하고 중심점을 반복 갱신한다.",
        "linkage를 바꾸어도 군집 결과는 절대 달라지지 않는다."
      ],
      "answer": 0,
      "explanation": "linkage 선택에 따라 같은 데이터의 덴드로그램도 달라질 수 있다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-031",
      "conceptId": "scaling-pca",
      "difficulty": "hard",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "다음 (가), (나)에 해당하는 개념의 조합으로 옳은 것은? (가) 변수 단위 차이가 거리와 학습에 미치는 영향을 줄이도록 feature의 평균을 0, 분산을 1로 맞추는 변환 (나) 선형 결합을 시그모이드에 통과시켜 0과 1 사이의 확률을 예측하는 이진 분류 모델",
      "options": [
        "(가) 지도학습 / (나) 로지스틱 회귀",
        "(가) 표준화 / (나) 로지스틱 회귀",
        "(가) 표준화 / (나) 테스트 오류",
        "(가) 로지스틱 회귀 / (나) 표준화"
      ],
      "answer": 1,
      "explanation": "(가)는 표준화, (나)는 로지스틱 회귀의 정의다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-032",
      "conceptId": "scaling-pca",
      "difficulty": "hard",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "표준화에 관한 설명이다. 옳은 것만 고른 것은? ① 거리 기반 알고리즘은 변수의 단위와 범위 차이에 민감할 수 있다. ② 표준화는 일반적으로 각 feature의 평균을 0, 분산을 1로 맞춘다. ③ 표준화는 정답 라벨을 자동으로 생성하는 과정이다.",
      "options": [
        "①, ②, ③",
        "①",
        "①, ②",
        "②"
      ],
      "answer": 2,
      "explanation": "정답은 \"①, ②\"이다. 표준화은 변수 단위 차이가 거리와 학습에 미치는 영향을 줄이도록 feature의 평균을 0, 분산을 1로 맞추는 변환이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-033",
      "conceptId": "scaling-pca",
      "difficulty": "hard",
      "category": "4. 비지도학습과 군집화",
      "questionType": "multiple-choice",
      "prompt": "연소득과 방문 횟수처럼 단위와 범위가 크게 다른 변수를 거리 기반 군집화 전에 같은 척도로 바꾼다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "PCA는 각 샘플에 정답 클러스터 라벨을 부여하는 분류 알고리즘이다.",
        "표준화는 정답 라벨을 자동으로 생성하는 과정이다.",
        "변수 단위 차이는 K-means의 거리 계산에 영향을 주지 않는다.",
        "PCA는 정보를 가능한 한 보존하며 더 적은 주성분으로 차원을 줄인다."
      ],
      "answer": 3,
      "explanation": "PCA는 정보를 가능한 한 보존하며 더 적은 주성분으로 차원을 줄인다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지."
    },
    {
      "id": "w1-refresh-hard-mc-034",
      "conceptId": "logistic-regression",
      "difficulty": "hard",
      "category": "5. 로지스틱 회귀",
      "questionType": "multiple-choice",
      "prompt": "로지스틱 회귀에서 어떤 입력의 logit이 0이라면 양성 확률과 odds는 각각 얼마인가?",
      "options": [
        "확률 0.5, odds 1",
        "확률 0, odds 0",
        "확률 1, odds 0.5",
        "확률 1, odds 1"
      ],
      "answer": 0,
      "explanation": "logit=log(p/(1-p))가 0이면 odds가 1이고, p/(1-p)=1이므로 p=0.5이다.",
      "hint": "로그값이 0이면 로그를 취하기 전의 odds는 1이다."
    },
    {
      "id": "w1-refresh-hard-mc-035",
      "conceptId": "logistic-regression",
      "difficulty": "hard",
      "category": "5. 로지스틱 회귀",
      "questionType": "multiple-choice",
      "prompt": "로지스틱 회귀에 관한 설명이다. 옳은 것만 고른 것은? ① 시그모이드는 모든 실수 입력을 0과 1 사이 값으로 변환한다. ② 확률의 odds에 로그를 취한 logit은 입력의 선형 결합으로 표현된다. ③ 모델 출력이 음의 무한대부터 양의 무한대까지라 확률로 해석할 수 없다.",
      "options": [
        "①",
        "①, ②",
        "②",
        "①, ②, ③"
      ],
      "answer": 1,
      "explanation": "정답은 \"①, ②\"이다. 로지스틱 회귀은 선형 결합을 시그모이드에 통과시켜 0과 1 사이의 확률을 예측하는 이진 분류 모델이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 선형 결합, 시그모이드, odds와 logit의 연결."
    },
    {
      "id": "w1-refresh-hard-mc-036",
      "conceptId": "logistic-regression",
      "difficulty": "hard",
      "category": "5. 로지스틱 회귀",
      "questionType": "multiple-choice",
      "prompt": "신용카드 사용량을 입력해 연체 확률을 계산하고 임계값에 따라 연체 여부를 분류한다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "모델 출력이 음의 무한대부터 양의 무한대까지라 확률로 해석할 수 없다.",
        "이진 분류의 표준 모수 추정은 항상 최소제곱 MSE만 사용한다.",
        "모수는 데이터의 likelihood를 최대화하는 MLE로 추정할 수 있다.",
        "이름에 회귀가 있으므로 연속적인 수치만 예측할 수 있다."
      ],
      "answer": 2,
      "explanation": "모수는 데이터의 likelihood를 최대화하는 MLE로 추정할 수 있다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 선형 결합, 시그모이드, odds와 logit의 연결."
    },
    {
      "id": "w1-refresh-hard-mc-037",
      "conceptId": "neural-network",
      "difficulty": "hard",
      "category": "6. 신경망 구조와 표현력",
      "questionType": "multiple-choice",
      "prompt": "다음 (가), (나)에 해당하는 개념의 조합으로 옳은 것은? (가) 입력이 0보다 작으면 0, 0 이상이면 입력을 그대로 출력해 신경망에 비선형성을 주는 활성화 함수 (나) 손실함수의 기울기 반대 방향으로 파라미터를 반복 갱신해 손실을 줄이는 최적화 알고리즘",
      "options": [
        "(가) ReLU / (나) K-겹 교차검증",
        "(가) 경사하강법 / (나) ReLU",
        "(가) 손실함수 / (나) 경사하강법",
        "(가) ReLU / (나) 경사하강법"
      ],
      "answer": 3,
      "explanation": "(가)는 ReLU, (나)는 경사하강법의 정의다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-hard-mc-038",
      "conceptId": "neural-network",
      "difficulty": "hard",
      "category": "6. 신경망 구조와 표현력",
      "questionType": "multiple-choice",
      "prompt": "ReLU에 관한 설명이다. 옳은 것만 고른 것은? ① 은닉층의 활성화 함수는 단순한 선형 결합만으로는 만들 수 없는 표현을 가능하게 한다. ② 은닉층이 하나인 네트워크를 shallow network라고 부를 수 있다. ③ 활성화 함수가 없어도 선형층을 여러 개 쌓으면 항상 복잡한 비선형 함수가 된다.",
      "options": [
        "①, ②",
        "②",
        "①, ②, ③",
        "①"
      ],
      "answer": 0,
      "explanation": "정답은 \"①, ②\"이다. ReLU은 입력이 0보다 작으면 0, 0 이상이면 입력을 그대로 출력해 신경망에 비선형성을 주는 활성화 함수이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-hard-mc-039",
      "conceptId": "neural-network",
      "difficulty": "hard",
      "category": "6. 신경망 구조와 표현력",
      "questionType": "multiple-choice",
      "prompt": "은닉 유닛의 선형 결합마다 활성화 함수를 적용해 여러 조각의 선형 구간으로 복잡한 함수를 표현한다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "ReLU는 모든 음수 입력을 그대로 출력하고 양수 입력을 0으로 만든다.",
        "깊은 네트워크는 층별 함수를 합성해 비슷한 파라미터 수로 더 많은 선형 구역을 만들 수 있다.",
        "보편적 근사 정리는 적은 수의 유닛으로 모든 불연속 함수를 오차 없이 표현한다는 뜻이다.",
        "활성화 함수가 없어도 선형층을 여러 개 쌓으면 항상 복잡한 비선형 함수가 된다."
      ],
      "answer": 1,
      "explanation": "깊은 네트워크는 층별 함수를 합성해 비슷한 파라미터 수로 더 많은 선형 구역을 만들 수 있다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-hard-mc-040",
      "conceptId": "gradient-descent",
      "difficulty": "hard",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "현재 파라미터가 4, 손실의 기울기가 -3, 학습률이 0.1일 때 경사하강법으로 한 번 갱신한 파라미터는?",
      "options": [
        "3.7",
        "4.0",
        "4.3",
        "7.0"
      ],
      "answer": 2,
      "explanation": "갱신식은 새 파라미터=4-0.1×(-3)이므로 4.3이다. 음의 기울기에서는 파라미터가 증가한다.",
      "hint": "파라미터에서 학습률과 기울기의 곱을 뺀다."
    },
    {
      "id": "w1-refresh-hard-mc-041",
      "conceptId": "gradient-descent",
      "difficulty": "hard",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "경사하강법에 관한 설명이다. 옳은 것만 고른 것은? ① 기울기는 손실이 가장 빠르게 증가하는 방향이므로 그 반대로 이동한다. ② 학습률은 한 번의 업데이트에서 이동하는 크기를 조절한다. ③ 손실을 줄이기 위해 항상 기울기와 같은 방향으로 이동한다.",
      "options": [
        "②",
        "①, ②, ③",
        "①",
        "①, ②"
      ],
      "answer": 3,
      "explanation": "정답은 \"①, ②\"이다. 경사하강법은 손실함수의 기울기 반대 방향으로 파라미터를 반복 갱신해 손실을 줄이는 최적화 알고리즘이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-hard-mc-042",
      "conceptId": "gradient-descent",
      "difficulty": "hard",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "현재 파라미터에서 미분값을 구하고 학습률을 곱한 만큼 반대 방향으로 이동한다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "미니배치 SGD는 일부 샘플로 기울기를 추정해 계산량과 경로의 노이즈를 만든다.",
        "SGD는 매 업데이트마다 전체 데이터만 사용해야 한다.",
        "손실을 줄이기 위해 항상 기울기와 같은 방향으로 이동한다.",
        "학습률은 클수록 언제나 더 빠르고 안정적으로 수렴한다."
      ],
      "answer": 0,
      "explanation": "미니배치 SGD는 일부 샘플로 기울기를 추정해 계산량과 경로의 노이즈를 만든다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-hard-mc-043",
      "conceptId": "backpropagation",
      "difficulty": "hard",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "다음 (가), (나)에 해당하는 개념의 조합으로 옳은 것은? (가) 출력의 손실에서 입력 방향으로 계산 그래프를 거슬러 가며 연쇄법칙으로 각 파라미터의 기울기를 구하는 절차 (나) 입력과 정답 라벨이 쌍으로 있는 데이터로 예측 규칙을 학습하고 새로운 데이터에 일반화하는 방법",
      "options": [
        "(가) 테스트 오류 / (나) 지도학습",
        "(가) 역전파 / (나) 지도학습",
        "(가) 역전파 / (나) K-means",
        "(가) 지도학습 / (나) 역전파"
      ],
      "answer": 1,
      "explanation": "(가)는 역전파, (나)는 지도학습의 정의다.",
      "hint": "선택지의 두 연결을 각각 검증한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-hard-mc-044",
      "conceptId": "backpropagation",
      "difficulty": "hard",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "역전파에 관한 설명이다. 옳은 것만 고른 것은? ① 순전파는 입력에서 출력 방향으로 예측값과 손실을 계산한다. ② 역전파는 연쇄법칙을 이용해 각 층 파라미터의 기울기를 효율적으로 구한다. ③ 역전파는 입력에서 출력 방향으로 예측값만 만드는 과정이다.",
      "options": [
        "①, ②, ③",
        "①",
        "①, ②",
        "②"
      ],
      "answer": 2,
      "explanation": "정답은 \"①, ②\"이다. 역전파은 출력의 손실에서 입력 방향으로 계산 그래프를 거슬러 가며 연쇄법칙으로 각 파라미터의 기울기를 구하는 절차이다. 각 진술을 이 기준으로 따로 판별하면 해당 조합만 성립한다.",
      "hint": "정의뿐 아니라 정보 흐름과 결과까지 확인한다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-hard-mc-045",
      "conceptId": "backpropagation",
      "difficulty": "hard",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "순전파로 예측과 손실을 계산한 뒤 출력층부터 은닉층 방향으로 각 가중치의 미분값을 전달한다. 이 상황에 대한 분석으로 가장 타당한 것은?",
      "options": [
        "Early stopping은 훈련 오차가 반드시 0이 될 때까지 학습하는 방법이다.",
        "역전파는 입력에서 출력 방향으로 예측값만 만드는 과정이다.",
        "각 층의 기울기는 다른 층과 무관하므로 연쇄법칙이 필요 없다.",
        "Early stopping은 검증 성능이 더 이상 좋아지지 않을 때 학습을 멈춰 과적합을 줄인다."
      ],
      "answer": 3,
      "explanation": "Early stopping은 검증 성능이 더 이상 좋아지지 않을 때 학습을 멈춰 과적합을 줄인다. 따라서 다른 보기의 절대적이거나 뒤바뀐 해석은 타당하지 않다.",
      "hint": "그럴듯한 선택지의 전제와 결과가 모두 맞는지 본다. 다음 기준을 사용해 선택지를 좁힌다: 순전파·손실·미분·파라미터 갱신의 순서."
    },
    {
      "id": "w1-refresh-hard-mc-046",
      "conceptId": "backpropagation",
      "difficulty": "hard",
      "category": "7. 최적화와 역전파",
      "questionType": "multiple-choice",
      "prompt": "신경망의 한 학습 스텝에서 수행되는 계산 순서로 가장 적절한 것은?",
      "options": [
        "순전파로 예측과 손실 계산 → 역전파로 기울기 계산 → 기울기 반대 방향으로 파라미터 갱신",
        "테스트셋으로 파라미터 갱신 → 검증셋으로 손실 생성 → 훈련셋은 사용하지 않음",
        "파라미터 갱신 → 순전파 → 정답 라벨 생성 → 역전파 생략",
        "역전파로 예측 생성 → 순전파로 기울기 계산 → 손실 증가 방향으로 갱신"
      ],
      "answer": 0,
      "explanation": "순전파가 예측과 손실을 만들고, 역전파가 기울기를 구하며, 최적화 알고리즘이 기울기 반대 방향으로 파라미터를 갱신한다.",
      "hint": "예측, 미분, 업데이트의 순서를 구분한다."
    },
    {
      "id": "w1-refresh-hard-short-001",
      "conceptId": "scaling-pca",
      "difficulty": "hard",
      "category": "4. 비지도학습과 군집화",
      "questionType": "short-answer",
      "prompt": "다음 설명과 특징에 공통으로 해당하는 핵심 용어를 작성하시오. 변수 단위 차이가 거리와 학습에 미치는 영향을 줄이도록 feature의 평균을 0, 분산을 1로 맞추는 변환 또한 표준화는 일반적으로 각 feature의 평균을 0, 분산을 1로 맞춘다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "표준화",
        "standardization",
        "StandardScaler",
        "스케일링"
      ],
      "explanation": "정답은 표준화이다. 변수 단위 차이가 거리와 학습에 미치는 영향을 줄이도록 feature의 평균을 0, 분산을 1로 맞추는 변환이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-hard-short-002",
      "conceptId": "logistic-regression",
      "difficulty": "hard",
      "category": "5. 로지스틱 회귀",
      "questionType": "short-answer",
      "prompt": "다음 설명과 특징에 공통으로 해당하는 핵심 용어를 작성하시오. 선형 결합을 시그모이드에 통과시켜 0과 1 사이의 확률을 예측하는 이진 분류 모델 또한 확률의 odds에 로그를 취한 logit은 입력의 선형 결합으로 표현된다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "로지스틱 회귀",
        "logistic regression",
        "로지스틱회귀"
      ],
      "explanation": "정답은 로지스틱 회귀이다. 선형 결합을 시그모이드에 통과시켜 0과 1 사이의 확률을 예측하는 이진 분류 모델이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 선형 결합, 시그모이드, odds와 logit의 연결. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-hard-short-003",
      "conceptId": "neural-network",
      "difficulty": "hard",
      "category": "6. 신경망 구조와 표현력",
      "questionType": "short-answer",
      "prompt": "다음 설명과 특징에 공통으로 해당하는 핵심 용어를 작성하시오. 입력이 0보다 작으면 0, 0 이상이면 입력을 그대로 출력해 신경망에 비선형성을 주는 활성화 함수 또한 은닉층이 하나인 네트워크를 shallow network라고 부를 수 있다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "ReLU",
        "rectified linear unit",
        "렐루",
        "활성화 함수 ReLU"
      ],
      "explanation": "정답은 ReLU이다. 입력이 0보다 작으면 0, 0 이상이면 입력을 그대로 출력해 신경망에 비선형성을 주는 활성화 함수이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-hard-short-004",
      "conceptId": "gradient-descent",
      "difficulty": "hard",
      "category": "7. 최적화와 역전파",
      "questionType": "short-answer",
      "prompt": "다음 설명과 특징에 공통으로 해당하는 핵심 용어를 작성하시오. 손실함수의 기울기 반대 방향으로 파라미터를 반복 갱신해 손실을 줄이는 최적화 알고리즘 또한 학습률은 한 번의 업데이트에서 이동하는 크기를 조절한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "경사하강법",
        "gradient descent",
        "경사 하강법"
      ],
      "explanation": "정답은 경사하강법이다. 손실함수의 기울기 반대 방향으로 파라미터를 반복 갱신해 손실을 줄이는 최적화 알고리즘이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-hard-short-005",
      "conceptId": "backpropagation",
      "difficulty": "hard",
      "category": "7. 최적화와 역전파",
      "questionType": "short-answer",
      "prompt": "다음 설명과 특징에 공통으로 해당하는 핵심 용어를 작성하시오. 출력의 손실에서 입력 방향으로 계산 그래프를 거슬러 가며 연쇄법칙으로 각 파라미터의 기울기를 구하는 절차 또한 역전파는 연쇄법칙을 이용해 각 층 파라미터의 기울기를 효율적으로 구한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "역전파",
        "backpropagation",
        "backprop",
        "역전파 알고리즘"
      ],
      "explanation": "정답은 역전파이다. 출력의 손실에서 입력 방향으로 계산 그래프를 거슬러 가며 연쇄법칙으로 각 파라미터의 기울기를 구하는 절차이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 순전파·손실·미분·파라미터 갱신의 순서. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-hard-short-006",
      "conceptId": "supervised-learning",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "short-answer",
      "prompt": "다음 설명과 특징에 공통으로 해당하는 핵심 용어를 작성하시오. 입력과 정답 라벨이 쌍으로 있는 데이터로 예측 규칙을 학습하고 새로운 데이터에 일반화하는 방법 또한 훈련 데이터뿐 아니라 처음 보는 데이터에서도 정확히 예측하는 것이 목표다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "지도학습",
        "supervised learning",
        "지도 학습"
      ],
      "explanation": "정답은 지도학습이다. 입력과 정답 라벨이 쌍으로 있는 데이터로 예측 규칙을 학습하고 새로운 데이터에 일반화하는 방법이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-hard-short-007",
      "conceptId": "regression-classification",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "short-answer",
      "prompt": "다음 설명과 특징에 공통으로 해당하는 핵심 용어를 작성하시오. 연속적인 수치를 예측하면 회귀, 정해진 범주를 예측하면 분류로 구분하는 지도학습 문제 유형 또한 스팸·정상처럼 유한한 범주를 예측하면 분류다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "회귀와 분류",
        "regression and classification",
        "회귀/분류"
      ],
      "explanation": "정답은 회귀와 분류이다. 연속적인 수치를 예측하면 회귀, 정해진 범주를 예측하면 분류로 구분하는 지도학습 문제 유형이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-hard-short-008",
      "conceptId": "loss-functions",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "short-answer",
      "prompt": "다음 설명과 특징에 공통으로 해당하는 핵심 용어를 작성하시오. 모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수 또한 MSE는 실제값과 예측값의 차이를 제곱해 평균한다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "손실함수",
        "loss function",
        "손실 함수"
      ],
      "explanation": "정답은 손실함수이다. 모델의 예측이 정답에서 얼마나 벗어났는지를 수치화하고 학습 방향을 정하는 함수이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-hard-short-009",
      "conceptId": "confusion-matrix",
      "difficulty": "hard",
      "category": "2. 지도학습과 문제 유형",
      "questionType": "short-answer",
      "prompt": "다음 설명과 특징에 공통으로 해당하는 핵심 용어를 작성하시오. 이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표 또한 FN은 실제 양성을 음성으로 잘못 예측한 경우다.",
      "options": [],
      "answer": null,
      "acceptedAnswers": [
        "혼동행렬",
        "confusion matrix",
        "오차행렬"
      ],
      "explanation": "정답은 혼동행렬이다. 이진 분류의 실제값과 예측값 조합을 TP·FP·TN·FN으로 나누어 성능을 분석하는 표이다.",
      "hint": "설명에서 다음 요소를 나타내는 핵심 표현을 찾는다: 정답 label의 존재 여부와 예측값이 연속 수치인지 범주인지. 답은 정확한 용어 또는 식으로 작성한다."
    },
    {
      "id": "w1-refresh-hard-essay-001",
      "conceptId": "integrated-hard-1",
      "difficulty": "hard",
      "category": "8. 통합 사고 서술",
      "questionType": "essay",
      "prompt": "분류 모델을 개발한다고 할 때 데이터 분할부터 최종 평가까지 과적합을 방지하는 전체 절차를 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "훈련·검증·테스트셋을 분리하고 훈련셋으로 파라미터를 학습한다. 검증셋이나 K-겹 교차검증으로 모델 복잡도와 학습 시점을 정하고, 모든 선택이 끝난 뒤 한 번만 테스트셋으로 일반화 성능을 평가한다.",
      "rubricKeywords": [
        "데이터 분할",
        "검증",
        "교차검증",
        "테스트"
      ],
      "minLength": 70,
      "explanation": "모범답안에는 데이터 분할, 검증, 교차검증, 테스트의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: 데이터 분할, 검증, 교차검증, 테스트."
    },
    {
      "id": "w1-refresh-hard-essay-002",
      "conceptId": "integrated-hard-2",
      "difficulty": "hard",
      "category": "8. 통합 사고 서술",
      "questionType": "essay",
      "prompt": "다중선형회귀에서 서로 강하게 상관된 변수를 함께 사용할 때 생기는 문제와 상관관계를 인과관계로 단정하면 안 되는 이유를 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "강하게 상관된 설명변수는 다중공선성을 만들어 계수 추정의 분산을 키우고 해석을 불안정하게 한다. 또한 관찰된 상관은 숨은 변수나 선택 편향 때문일 수 있어 회귀계수만으로 인과 효과를 단정할 수 없다.",
      "rubricKeywords": [
        "다중공선성",
        "계수",
        "불안정",
        "인과관계"
      ],
      "minLength": 70,
      "explanation": "모범답안에는 다중공선성, 계수, 불안정, 인과관계의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: 다중공선성, 계수, 불안정, 인과관계."
    },
    {
      "id": "w1-refresh-hard-essay-003",
      "conceptId": "integrated-hard-3",
      "difficulty": "hard",
      "category": "8. 통합 사고 서술",
      "questionType": "essay",
      "prompt": "로지스틱 회귀에서 시그모이드·odds·logit·최대우도추정의 관계를 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "시그모이드는 선형 결합을 확률로 바꾸고, odds는 p/(1-p)이다. odds의 로그인 logit은 입력의 선형 결합이 되며, 관측된 정답이 나타날 likelihood를 최대화하도록 계수를 추정한다.",
      "rubricKeywords": [
        "시그모이드",
        "odds",
        "logit",
        "likelihood"
      ],
      "minLength": 70,
      "explanation": "모범답안에는 시그모이드, odds, logit, likelihood의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: 시그모이드, odds, logit, likelihood."
    },
    {
      "id": "w1-refresh-hard-essay-004",
      "conceptId": "integrated-hard-4",
      "difficulty": "hard",
      "category": "8. 통합 사고 서술",
      "questionType": "essay",
      "prompt": "ReLU 신경망의 조각별 선형 표현과 깊은 네트워크의 표현력 증가를 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "ReLU는 입력 공간을 구간으로 나누어 각 구간에서 선형인 함수를 만든다. 여러 은닉층을 합성하면 앞 층이 만든 구간을 뒤 층이 다시 변환하고 접어 비슷한 파라미터 수로 더 많은 선형 구역을 표현할 수 있다.",
      "rubricKeywords": [
        "ReLU",
        "조각별 선형",
        "합성",
        "표현력"
      ],
      "minLength": 70,
      "explanation": "모범답안에는 ReLU, 조각별 선형, 합성, 표현력의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: ReLU, 조각별 선형, 합성, 표현력."
    },
    {
      "id": "w1-refresh-hard-essay-005",
      "conceptId": "integrated-hard-5",
      "difficulty": "hard",
      "category": "8. 통합 사고 서술",
      "questionType": "essay",
      "prompt": "순전파와 역전파를 연쇄법칙 관점에서 구분하고 경사하강 업데이트까지 연결해 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "순전파는 층별 계산으로 예측과 손실을 구한다. 역전파는 손실에서 출력층·은닉층 방향으로 연쇄법칙을 적용해 각 가중치의 기울기를 구하고, 경사하강법은 그 기울기의 반대 방향으로 가중치를 갱신한다.",
      "rubricKeywords": [
        "순전파",
        "역전파",
        "연쇄법칙",
        "경사하강"
      ],
      "minLength": 70,
      "explanation": "모범답안에는 순전파, 역전파, 연쇄법칙, 경사하강의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: 순전파, 역전파, 연쇄법칙, 경사하강."
    },
    {
      "id": "w1-refresh-hard-essay-006",
      "conceptId": "integrated-hard-6",
      "difficulty": "hard",
      "category": "8. 통합 사고 서술",
      "questionType": "essay",
      "prompt": "검증 손실은 증가하지만 훈련 손실은 계속 감소하는 상황을 진단하고 Early stopping이 어떻게 대응하는지 설명하시오.",
      "options": [],
      "answer": null,
      "modelAnswer": "훈련 손실만 감소하고 검증 손실이 증가하면 훈련 데이터에 과적합되고 있다는 신호다. Early stopping은 검증 성능이 가장 좋았던 시점의 모델을 선택하고 이후 학습을 중단해 일반화 성능 악화를 줄인다.",
      "rubricKeywords": [
        "검증 손실",
        "훈련 손실",
        "과적합",
        "Early stopping"
      ],
      "minLength": 70,
      "explanation": "모범답안에는 검증 손실, 훈련 손실, 과적합, Early stopping의 관계가 포함되어야 한다.",
      "hint": "다음 요소를 먼저 정의하고 원인·과정·결과가 이어지도록 답안을 구성한다: 검증 손실, 훈련 손실, 과적합, Early stopping."
    }
  ]
};

export const ALL_QUESTIONS: StudyQuestion[] = Object.values(QUESTION_BANK).flat();
