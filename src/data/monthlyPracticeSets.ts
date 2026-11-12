type MonthlyPracticeSet = {
  id: string;
  title: string;
  topics: string;
};

export const MONTHLY_PRACTICE_SETS: Partial<Record<number, readonly MonthlyPracticeSet[]>> = {
  1: [
    { id: "python-mock", title: "Python 월말평가 모의고사", topics: "함수 구현 5문제 · 문자열, 리스트, 딕셔너리, 재귀" },
    { id: "python-drills", title: "Python 월말평가 연습문제 10제", topics: "함수 구현 10문제 · 조건 분기, 자료구조, 상태 갱신" },
  ],
  2: [
    { id: "ai-set-0", title: "AI Python 종합 모의시험", topics: "탐색적 데이터 분석, 프롬프트 설계, RAG 구현" },
    { id: "ai-set-1", title: "AI Python 모의고사 1세트", topics: "기본 상관관계, 구조화 출력, 전체 RAG 그래프" },
    { id: "ai-set-2", title: "AI Python 모의고사 2세트", topics: "상위 특성 순위, 페르소나 데이터, 청킹 비교" },
    { id: "ai-set-3", title: "AI Python 모의고사 3세트", topics: "다중공선성, 위험도 데이터, 검색 개수 비교" },
    { id: "ai-set-4", title: "AI Python 모의고사 4세트", topics: "그룹별 분석, 균형 감정 데이터, 출처 포함 RAG" },
    { id: "ai-set-5", title: "AI Python 모의고사 5세트", topics: "결측치와 중복 특성, 경계 사례, 함수형 RAG" },
  ],
  3: [
    { id: "algo-guided", title: "강사 안내형 실전 모의고사", topics: "배열 구간, 격자 탐색, BFS 서술형" },
    { id: "algo-set-1", title: "알고리즘 기본 모의고사 1세트", topics: "증가 구간, 연결 영역, BFS 서술형" },
    { id: "algo-set-2", title: "알고리즘 기본 모의고사 2세트", topics: "구간합, 델타 탐색, 스택 추적" },
    { id: "algo-set-3", title: "알고리즘 기본 모의고사 3세트", topics: "부분 수열, 최단 탈출, 이진트리 순회" },
    { id: "algo-extra", title: "알고리즘 기본 추가 연습 3제", topics: "문자열 처리, 회문, 날짜별 연결 영역" },
  ],
  5: [
    { id: "debugging-list", title: "예상문제 1 · 글 목록이 보이지 않음", topics: "Django 뷰와 템플릿의 컨텍스트" },
    { id: "debugging-update", title: "예상문제 2 · 수정했는데 새 글이 생성됨", topics: "ModelForm의 수정 대상 연결" },
  ],
};
