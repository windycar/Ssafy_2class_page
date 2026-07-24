기존에 제작한 “SSAFY 광주 2반 랜덤 팀 편성” 기능을 단일 페이지가 아닌, 여러 기능을 확장할 수 있는 “SSAFY 광주 2반 전용 클래스 커뮤니티 웹앱”으로 개편해 주세요.

프로젝트명:
“SSAFY 광주 2반”

서비스 콘셉트:
SSAFY 광주 2반 교육생 21명이 팀 편성, 공동구매, 사진 공유, 반 규칙 확인 등의 기능을 한곳에서 사용할 수 있는 반 전용 웹 서비스입니다.

중요 개발 원칙:
- React + TypeScript 기반으로 제작
- App.tsx에 모든 코드를 작성하지 말 것
- App.tsx는 라우터, 전역 레이아웃, Provider 연결 역할만 담당
- 페이지 단위 코드는 views 폴더로 분리
- 재사용 UI는 components 폴더로 분리
- 데이터, 타입, 유틸리티, 상수도 각각 별도 파일로 분리
- 한 파일이 지나치게 길어지지 않도록 최대한 세분화
- 각 페이지가 독립적으로 관리되도록 구성
- 실제 클릭과 화면 이동이 동작하는 프로토타입 제작
- 이후 새로운 메뉴를 쉽게 추가할 수 있는 확장형 구조로 제작

전체 서비스 분위기:
- SSAFY 교육생들이 실제로 사용할 법한 밝고 활기찬 분위기
- 지나치게 기업용이거나 딱딱하지 않은 디자인
- 교육, 협업, 개발자 커뮤니티 느낌
- SSAFY를 연상시키는 파란색을 메인 컬러로 사용
- 하늘색, 네이비, 흰색, 연한 회색을 기본으로 사용
- 기능별 포인트 컬러로 노란색, 민트색, 주황색, 보라색 사용
- 카드에 약한 그림자와 둥근 모서리 적용
- 개발자 대시보드와 대학생 커뮤니티를 섞은 느낌
- 곳곳에 코드, 터미널, 브랜치, 커밋, 알고리즘 등의 개발자 감성 요소를 가볍게 활용
- 공식 SSAFY 로고를 직접 복제하지 말고, SSAFY 분위기만 표현
- PC 화면 중심이지만 태블릿과 모바일에서도 반응형으로 동작

서비스 이름 표기:
“SSAFY 광주 2반”

짧은 슬로건:
“함께 배우고, 함께 성장하는 우리 반”

상단 헤더:
- 왼쪽에 서비스 심볼과 “SSAFY 광주 2반” 텍스트
- 중앙 또는 왼쪽에 주요 내비게이션
- 오른쪽에 현재 참여 인원 “21명” 배지
- 알림 아이콘
- 사용자 프로필 아바타
- 모바일에서는 햄버거 메뉴로 변경

주요 내비게이션:
- 홈
- 랜덤 팀
- 커피 공구
- 우리 반 사진첩
- 그라운드 룰

현재 선택된 메뉴는 파란색 하단선 또는 채워진 탭으로 명확히 표시합니다.

라우팅 경로:
- / : 메인 홈
- /teams : 랜덤 팀 편성
- /coffee : 커피 배달 공동구매
- /gallery : 우리 반 사진첩
- /ground-rules : 우리 반 그라운드 룰

-----------------------------------
1. 메인 홈 화면
-----------------------------------

파일명:
src/views/HomeView.tsx

메인 화면의 목적:
각 기능으로 이동할 수 있는 클래스 포털 형태의 대시보드입니다.

상단 히어로 영역:
- 큰 제목:
  “광주 2반, 오늘도 화이팅!”
- 설명:
  “팀 편성부터 커피 공구, 추억 기록까지 한곳에서 관리해요.”
- 오른쪽 또는 배경에 노트북, 코드, 사람, 커피잔을 활용한 간단한 일러스트
- “현재 교육생 21명” 표시
- “7개 팀 편성 가능” 표시
- “SSAFY 광주 캠퍼스” 표시
- 메인 버튼:
  “랜덤 팀 만들기”
- 보조 버튼:
  “커피 공구 참여하기”

빠른 메뉴 카드:
4개의 큰 기능 카드를 배치합니다.

첫 번째 카드:
- 제목: “랜덤 팀 편성”
- 설명: “21명을 공정하게 무작위 팀으로 편성해요.”
- 아이콘: 셔플 또는 사람 그룹
- 기본값 표시: “3명씩 7팀”
- 버튼: “팀 만들기”
- 파란색 계열

두 번째 카드:
- 제목: “다 같이 커피”
- 설명: “수업 중 필요한 커피를 함께 주문해요.”
- 아이콘: 커피잔 또는 배달 컵
- 상태 예시: “현재 공구 진행 중”
- 버튼: “주문 참여”
- 주황색 또는 노란색 계열

세 번째 카드:
- 제목: “우리 반 사진첩”
- 설명: “광주 2반의 활동과 추억을 기록해요.”
- 아이콘: 카메라 또는 이미지
- 상태 예시: “최근 사진 12장”
- 버튼: “사진 보기”
- 민트색 계열

네 번째 카드:
- 제목: “우리 반 그라운드 룰”
- 설명: “함께 정한 약속을 확인하고 새로운 규칙을 추가해요.”
- 아이콘: 체크리스트 또는 방패
- 상태 예시: “현재 규칙 8개”
- 버튼: “규칙 확인”
- 보라색 계열

오늘의 반 소식 영역:
- 최근 활동을 타임라인 또는 리스트로 표시
- 예시:
  “새로운 팀 편성 결과가 생성되었습니다.”
  “아메리카노 공동구매가 시작되었습니다.”
  “사진첩에 새로운 사진 3장이 추가되었습니다.”
  “그라운드 룰 8번이 추가되었습니다.”
- 날짜와 시간을 작은 회색 텍스트로 표시

우리 반 현황 영역:
- 전체 교육생: 21명
- 현재 팀 수: 7팀
- 진행 중 공구: 1개
- 등록 사진: 12장
- 그라운드 룰: 8개
- 각각 작은 통계 카드로 구성

하단 영역:
- “오늘도 한 걸음 더 성장하는 광주 2반”
- 작은 코드 형태 문구:
  console.log("광주 2반 화이팅!");
- 제작자를 직접 특정하지 않는 간결한 푸터

-----------------------------------
2. 랜덤 팀 편성 화면
-----------------------------------

파일명:
src/views/TeamRandomView.tsx

기존 랜덤 팀 편성 기능을 유지하고 디자인만 전체 서비스에 맞게 통일합니다.

기능:
- 총 교육생 21명 표시
- 팀 수로 편성
- 팀당 인원수로 편성
- 기본값 7팀, 팀당 3명
- 특정 교육생 포함 또는 제외
- 랜덤 셔플
- 팀 이름 수정
- 팀별 다시 뽑기
- 전체 다시 섞기
- 결과 복사
- JSON 복사
- 초기화

팀 편성 로직은 별도 유틸리티 파일로 분리:
src/utils/teamShuffle.ts

교육생 데이터:
src/data/students.ts

관련 타입:
src/types/student.ts
src/types/team.ts

세부 컴포넌트:
- TeamSettingPanel.tsx
- StudentSelector.tsx
- StudentChip.tsx
- TeamResultGrid.tsx
- TeamCard.tsx
- TeamActionBar.tsx
- EmptyTeamResult.tsx

-----------------------------------
3. 다 같이 커피 배달 공동구매 화면
-----------------------------------

파일명:
src/views/CoffeeOrderView.tsx

화면 제목:
“다 같이 커피”

설명:
“한 명이 대표로 주문하고, 각자 원하는 메뉴를 담아 보세요.”

상단 진행 상태 카드:
- 현재 상태: “주문 모집 중”
- 주문 마감 시간
- 대표 주문자
- 현재 참여 인원
- 예상 총금액
- 진행률 표시

주문 생성 기능:
- 매장명 입력
- 배달 앱 또는 매장 링크 입력
- 주문 마감 시간 설정
- 최소 주문 금액 입력
- 배달비 입력
- 공지사항 입력
- “공구 시작하기” 버튼

개인 메뉴 추가 기능:
- 참여자 이름 선택
- 메뉴명 입력
- 가격 입력
- 옵션 입력
- 수량 선택
- 요청사항 입력
- “내 메뉴 담기” 버튼

현재 주문 명단:
각 참여자를 카드 또는 표 형태로 표시합니다.

표시 항목:
- 이름
- 메뉴
- 옵션
- 수량
- 금액
- 결제 여부
- 수정 버튼
- 삭제 버튼

결제 상태:
- 미입금
- 입금 완료
- 주문 완료
- 수령 완료

금액 계산:
- 메뉴 총액
- 배달비
- 배달비 1인당 분담액
- 최종 결제 금액
- 전체 합계

하단 액션:
- 주문 내용 복사
- 카카오톡 공유용 텍스트 복사
- 주문 마감
- 전체 초기화

빈 상태:
“현재 진행 중인 커피 공구가 없습니다.”
“새로운 공구를 시작해 보세요.”

관련 컴포넌트:
- CoffeeOrderHeader.tsx
- CoffeeOrderStatus.tsx
- CoffeeOrderForm.tsx
- CoffeeMenuForm.tsx
- CoffeeParticipantList.tsx
- CoffeeParticipantCard.tsx
- CoffeePaymentSummary.tsx
- CoffeeActionBar.tsx

관련 데이터:
src/data/coffeeMockData.ts

관련 타입:
src/types/coffee.ts

관련 유틸리티:
src/utils/coffeeCalculator.ts

현재는 프론트엔드 프로토타입으로 제작하며 localStorage를 이용해 주문 상태가 새로고침 후에도 유지되도록 구현합니다.

-----------------------------------
4. 우리 반 사진첩 화면
-----------------------------------

파일명:
src/views/GalleryView.tsx

화면 제목:
“광주 2반 사진첩”

설명:
“수업, 프로젝트, 행사에서 만든 우리 반의 추억을 기록해요.”

상단 기능:
- 전체 사진 수
- 최근 업로드 날짜
- 사진 추가 버튼
- 앨범 생성 버튼
- 검색창
- 카테고리 필터

카테고리:
- 전체
- 수업
- 프로젝트
- 행사
- 점심
- 회식
- 기타

사진 카드:
- 이미지 썸네일
- 사진 제목
- 간단한 설명
- 촬영 날짜
- 등록자
- 카테고리
- 좋아요 버튼
- 댓글 수
- 더보기 메뉴
- 수정
- 삭제

사진을 클릭하면 모달 표시:
- 큰 이미지
- 제목
- 설명
- 촬영 날짜
- 등록자
- 좋아요
- 댓글 목록
- 댓글 입력창
- 이전 및 다음 사진 이동 버튼

사진 등록 모달:
- 이미지 업로드 영역
- 드래그 앤 드롭
- 제목 입력
- 설명 입력
- 날짜 선택
- 카테고리 선택
- 등록자 선택
- “사진 등록” 버튼

초기 프로토타입에서는 실제 서버 업로드 대신:
- 업로드한 이미지 미리보기
- 브라우저 localStorage 또는 메모리 상태 저장
- 기본 샘플 사진 카드 제공

관련 컴포넌트:
- GalleryHeader.tsx
- GalleryFilterBar.tsx
- PhotoGrid.tsx
- PhotoCard.tsx
- PhotoDetailModal.tsx
- PhotoUploadModal.tsx
- PhotoCommentList.tsx
- GalleryEmptyState.tsx

관련 타입:
src/types/photo.ts

관련 데이터:
src/data/galleryMockData.ts

-----------------------------------
5. 우리 반 그라운드 룰 화면
-----------------------------------

파일명:
src/views/GroundRulesView.tsx

업로드된 손그림 이미지의 따뜻하고 친근한 분위기를 참고하되, 이미지를 그대로 복제하지 않고 웹 UI 형태로 재구성합니다.

화면 제목:
“광주 2반 그라운드 룰”

부제목:
“우리 반이 함께 정하고 함께 지키는 약속”

상단 비주얼:
- 호랑이 또는 마스코트 느낌의 단순한 캐릭터 일러스트
- 야구, 응원, 팀워크 느낌을 가볍게 포함
- 말풍선 문구:
  “광주 2반, 오늘도 화이팅!”
- 손글씨 느낌은 제목이나 강조 문구에만 제한적으로 사용
- 본문은 읽기 쉬운 고딕체 사용

초기 그라운드 룰 8개:
1. 입퇴실 체크 잊지 않기
2. 시간 잘 지키기
3. SSAFY 물품 잘 다루기
4. 짝꿍이 졸 때 깨워주기
5. 퇴실할 때 물건 잘 챙기기
6. 담배 냄새 가능한 한 빼고 오기
7. 월 1회 회식하기
8. 서먹서먹하지 않게 함께 한 끼 하기

8번 규칙 아래 작은 태그:
- #친해지길
- #바람

각 규칙은 번호가 표시된 카드로 구성:
- 번호
- 규칙 내용
- 공감 버튼
- 중요 표시
- 수정 버튼
- 삭제 버튼
- 등록 날짜
- 등록자

규칙 추가 영역:
- “새로운 그라운드 룰 제안하기”
- 규칙 내용 입력
- 작성자 선택
- 카테고리 선택
- 추가 버튼

카테고리:
- 시간
- 생활
- 배려
- 친목
- 시설
- 기타

추후 규칙이 계속 증가할 수 있도록:
- 리스트를 데이터 기반으로 렌더링
- 숫자를 하드코딩하지 말 것
- 검색 기능
- 카테고리 필터
- 최신순 및 공감순 정렬
- 페이지네이션 또는 더보기 기능
- localStorage에 규칙 저장

관련 컴포넌트:
- GroundRuleHero.tsx
- GroundRuleList.tsx
- GroundRuleCard.tsx
- GroundRuleForm.tsx
- GroundRuleFilter.tsx
- GroundRuleEmptyState.tsx

관련 데이터:
src/data/groundRules.ts

관련 타입:
src/types/groundRule.ts

-----------------------------------
공통 레이아웃 구조
-----------------------------------

App.tsx는 다음 역할만 수행:
- BrowserRouter 설정
- 전체 라우트 연결
- AppLayout 호출
- 전역 Context 또는 Provider 연결
- 전역 Toast 연결

App.tsx 안에 각 페이지의 상세 UI를 작성하지 마세요.

권장 App.tsx 형태:

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
        <ToastContainer />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;

라우트는 별도 파일로 분리:
src/routes/AppRoutes.tsx

공통 레이아웃:
src/layouts/AppLayout.tsx

공통 헤더:
src/components/layout/AppHeader.tsx

모바일 내비게이션:
src/components/layout/MobileNavigation.tsx

푸터:
src/components/layout/AppFooter.tsx

사이드 또는 상단 내비게이션 데이터:
src/config/navigation.ts

-----------------------------------
권장 프로젝트 폴더 구조
-----------------------------------

src/
  App.tsx
  main.tsx

  routes/
    AppRoutes.tsx

  layouts/
    AppLayout.tsx

  views/
    HomeView.tsx
    TeamRandomView.tsx
    CoffeeOrderView.tsx
    GalleryView.tsx
    GroundRulesView.tsx
    NotFoundView.tsx

  components/
    layout/
      AppHeader.tsx
      AppFooter.tsx
      DesktopNavigation.tsx
      MobileNavigation.tsx

    common/
      PageHeader.tsx
      SectionCard.tsx
      StatusBadge.tsx
      EmptyState.tsx
      ConfirmModal.tsx
      Toast.tsx
      IconButton.tsx
      PrimaryButton.tsx
      SearchInput.tsx
      FilterTabs.tsx

    home/
      HomeHero.tsx
      QuickMenuGrid.tsx
      QuickMenuCard.tsx
      ClassStats.tsx
      RecentActivityList.tsx

    team/
      TeamSettingPanel.tsx
      StudentSelector.tsx
      StudentChip.tsx
      TeamResultGrid.tsx
      TeamCard.tsx
      TeamActionBar.tsx
      EmptyTeamResult.tsx

    coffee/
      CoffeeOrderHeader.tsx
      CoffeeOrderStatus.tsx
      CoffeeOrderForm.tsx
      CoffeeMenuForm.tsx
      CoffeeParticipantList.tsx
      CoffeeParticipantCard.tsx
      CoffeePaymentSummary.tsx
      CoffeeActionBar.tsx

    gallery/
      GalleryHeader.tsx
      GalleryFilterBar.tsx
      PhotoGrid.tsx
      PhotoCard.tsx
      PhotoDetailModal.tsx
      PhotoUploadModal.tsx
      PhotoCommentList.tsx

    groundRules/
      GroundRuleHero.tsx
      GroundRuleFilter.tsx
      GroundRuleList.tsx
      GroundRuleCard.tsx
      GroundRuleForm.tsx

  data/
    students.ts
    groundRules.ts
    coffeeMockData.ts
    galleryMockData.ts
    homeMockData.ts

  types/
    student.ts
    team.ts
    coffee.ts
    photo.ts
    groundRule.ts
    activity.ts
    common.ts

  hooks/
    useLocalStorage.ts
    useModal.ts
    useToast.ts
    useResponsive.ts

  context/
    AppContext.tsx
    ToastContext.tsx

  utils/
    teamShuffle.ts
    coffeeCalculator.ts
    copyToClipboard.ts
    formatCurrency.ts
    formatDate.ts
    createId.ts

  config/
    navigation.ts
    constants.ts

  assets/
    images/
    icons/

  styles/
    globals.css
    variables.css
    animations.css

-----------------------------------
코드 작성 규칙
-----------------------------------

- TypeScript의 any 사용을 피할 것
- 모든 데이터에 명확한 interface 또는 type 선언
- 화면 컴포넌트와 데이터 처리 로직 분리
- 배열 렌더링 시 안정적인 고유 ID 사용
- 반복되는 버튼과 카드 UI는 공통 컴포넌트로 제작
- localStorage 접근은 useLocalStorage 훅으로 통합
- 금액 계산은 컴포넌트 내부가 아닌 utility 함수로 분리
- 랜덤 팀 편성 로직도 컴포넌트 외부 utility로 분리
- 모달 상태는 재사용 가능한 useModal 훅 사용
- 사용자의 작업 결과에 Toast 메시지 표시
- 삭제 및 초기화에는 확인 모달 표시
- 빈 데이터, 잘못된 입력, 최대 인원 초과 등의 예외 처리
- 버튼에는 hover, active, disabled 상태 적용
- 키보드 접근성과 aria-label 적용
- 이미지에는 alt 텍스트 적용
- 모바일에서는 카드가 한 열로 자연스럽게 정렬
- 긴 텍스트가 UI를 깨뜨리지 않도록 처리
- 새 메뉴가 추가되어도 navigation.ts와 route만 추가하면 확장되도록 설계

-----------------------------------
홈 화면 세부 디자인
-----------------------------------

PC 기준:
- 최대 콘텐츠 너비 약 1280px
- 좌우 여백 충분히 확보
- 상단 헤더 높이 약 68px
- 히어로 영역은 좌우 2단 구성
- 빠른 기능 카드는 4열
- 통계 카드는 5열
- 최근 활동은 넓은 리스트 카드

태블릿:
- 빠른 기능 카드 2열
- 통계 카드 2~3열

모바일:
- 헤더 메뉴를 햄버거로 변경
- 빠른 기능 카드 1열
- 통계 카드 2열
- 주요 버튼 전체 너비
- 사진첩은 2열 또는 1열

디자인 요소:
- 홈 배경에 아주 연한 파란색 그라데이션
- 히어로 카드에 작은 코드 장식
- 예시 코드:
  const className = "광주 2반";
  const members = 21;
  const teamwork = true;
- 기능 카드 hover 시 살짝 위로 이동
- 카드별 아이콘 배경에 연한 포인트 컬러 적용
- 제목은 굵고 명확하게 표시
- 본문 가독성을 위해 지나친 손글씨 폰트 사용 금지

-----------------------------------
초기 데이터 정책
-----------------------------------

교육생 데이터는 기존에 제공된 21명의 JSON을 그대로 사용합니다.

강사, 교육프로, 트랙대표, SSAFY 사무국 계정은 모든 교육생 선택 목록에서 제외합니다.

그라운드 룰 초기 데이터는 제공된 8개 규칙을 사용합니다.

커피 공구와 사진첩은 화면 확인을 위한 샘플 데이터를 3~5개 포함합니다.

모든 데이터는 별도 data 파일에서 관리하며 JSX 내부에 대량으로 하드코딩하지 마세요.

최종 결과:
기존 랜덤 팀 편성 페이지가 포함된 완성도 높은 “SSAFY 광주 2반 클래스 포털”을 제작해 주세요. 홈, 랜덤 팀, 커피 공구, 사진첩, 그라운드 룰 화면이 모두 연결되어야 하며, App.tsx는 간결하게 유지하고 기능별 view와 component 파일을 최대한 분리해 주세요.