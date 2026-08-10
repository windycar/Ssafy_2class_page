# SSAFY 광주 2반 커뮤니티

> SSAFY 광주 2반 구성원이 함께 사용하는 반 전용 웹 커뮤니티입니다.  
> 팀 편성, 공동구매, 사진첩, 그라운드 룰, 익명 게시판, 뱅! 보드게임, 학습 문제, 회원/관리자 기능을 하나의 사이트에서 사용할 수 있습니다.

🌐 **배포 사이트**: https://ssafy-2class-page.vercel.app/

---

## 1. 프로젝트 소개

이 프로젝트는 **SSAFY 광주 2반의 실제 반 생활을 조금 더 편하게 만들기 위해 제작한 웹 서비스**입니다.

단순한 소개 페이지가 아니라, 반에서 실제로 자주 사용하는 기능을 한곳에 모았습니다.

- 랜덤 팀 편성
- 커피·음식·물품 공동구매
- 반 사진첩
- 그라운드 룰 공유
- 익명 게시판
- 뱅! 보드게임 멀티플레이
- Python / Web / AI Python 문제 풀이
- 개인 학습 기록 및 오답 분석
- 계정 로그인 / 비밀번호 변경
- 관리자 회원 관리

현재 프론트엔드는 **React + Vite + TypeScript**로 구성되어 있으며, 데이터와 인증은 **Supabase**, 배포는 **Vercel**을 사용합니다.

---

## 2. 주요 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Frontend | React 18, TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| UI / Icon | Lucide React, MUI, Radix UI |
| Animation | Motion |
| Toast | Sonner |
| Backend / DB | Supabase PostgreSQL |
| Auth | Supabase Auth |
| File Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| Server API | Vercel Functions (`/api/*.ts`) |
| Deployment | Vercel |
| Package Manager | pnpm 10 |

---

## 3. 전체 서비스 구조

```text
사용자 브라우저
   │
   ├─ React + Vite
   │   ├─ 홈
   │   ├─ 랜덤 팀
   │   ├─ 같이 공구
   │   ├─ 게임
   │   ├─ 공부 문제
   │   ├─ 사진첩
   │   ├─ 그라운드 룰
   │   └─ 익명 게시판
   │
   ├─ Supabase Client
   │   ├─ 일반 데이터 조회/저장
   │   ├─ Storage 이미지 업로드
   │   └─ Realtime 게임 채팅
   │
   └─ /api/*
       │
       └─ Vercel Functions
           ├─ /api/auth
           ├─ /api/admin
           └─ /api/bang-leave
               │
               └─ Supabase Service Role
                   ├─ 회원 인증
                   ├─ 비밀번호 변경/초기화
                   └─ 관리자 기능
```

---

# 4. 주요 기능

## 4-1. 로그인 / 회원 인증

사이트의 주요 페이지는 로그인한 회원만 사용할 수 있습니다.

### 일반 회원 최초 로그인

일반 회원의 기본 로그인 규칙은 다음과 같습니다.

```text
아이디: members.login_id
초기 비밀번호: 1234
```

예를 들어 명단의 표시 아이디가 다음과 같다면:

```text
@blueishsun24
```

로그인 화면에서는 `@`를 제외한 다음 값을 사용합니다.

```text
아이디: blueishsun24
비밀번호: 1234
```

최초 로그인 시 Supabase Auth 사용자가 생성되고, 사용자는 `/me` 페이지로 이동하여 비밀번호를 변경해야 합니다.

### 비밀번호 변경 규칙

- 새 비밀번호는 4자 이상이어야 합니다.
- 초기 비밀번호 `1234`는 새 비밀번호로 다시 사용할 수 없습니다.
- 현재 비밀번호를 확인한 뒤 변경합니다.
- 실제 비밀번호 원문은 DB에 저장하지 않습니다.
- Supabase Auth가 안전하게 해시 형태로 관리합니다.

### 관리자 최초 로그인

관리자의 최초 비밀번호는 일반 회원의 `1234`가 아니라 Vercel 환경변수의 다음 값입니다.

```env
ADMIN_PASSWORD=관리자_초기_비밀번호
```

관리자 계정도 최초 Auth 계정 생성 이후에는 변경된 비밀번호로 로그인합니다.

---

## 4-2. 내정보

경로:

```text
/me
```

내정보 화면에서는 다음 내용을 확인할 수 있습니다.

- 이름
- 표시 아이디
- 실제 로그인 아이디
- 소속 반
- 회원 / 관리자 권한
- 최근 로그인 시간
- 비밀번호 변경

최초 로그인 상태에서는 새 비밀번호 설정 안내도 함께 표시됩니다.

---

## 4-3. 랜덤 팀 편성

경로:

```text
/teams
```

반 인원을 랜덤으로 팀에 배치하는 기능입니다.

주요 기능:

- 팀 개수 기준 랜덤 편성
- 팀당 인원 기준 편성
- 특정 교육생 제외 / 포함
- 결과를 가나다순으로 정렬
- 직전 결과와 다른 팀 구성 생성
- 팀 이름 자동 생성
- 팀 이름 직접 수정
- 전체 재편성
- 특정 인원만 랜덤 추첨
- 결과 텍스트 복사
- 결과 JSON 복사
- 다른 반 명단 추가 및 관리

기본 광주 2반 명단은 다음 파일에서 관리됩니다.

```text
src/data/students.ts
```

추가 반 명단은 다음 파일 및 브라우저 저장소를 사용합니다.

```text
src/data/teamClassRosters.ts
src/services/storage/teamClassRosterStorage.ts
```

> **주의**  
> `students.ts`는 팀 편성용 정적 명단이고, 실제 로그인 계정은 Supabase의 `public.members`를 사용합니다.  
> 따라서 `students.ts`에서 아이디를 변경했다고 해서 로그인 아이디가 자동으로 변경되지는 않습니다.

---

## 4-4. 같이 공구

경로:

```text
/coffee
```

커피뿐 아니라 음식, 간식, 물품 등 여러 종류의 공동 주문을 관리합니다.

주요 기능:

- 공구 생성
- 카테고리 선택
- 가게명 / 링크 등록
- 마감 시간 설정
- 최소 주문 금액
- 배달비
- 공지사항
- 계좌 정보
- 참가자의 메뉴 / 옵션 / 수량 / 가격 입력
- 참가자별 메모
- 입금 및 주문 상태 관리
- 공구 마감
- 공구 삭제

결제 상태는 다음과 같이 관리됩니다.

```text
미입금 → 입금 완료 → 주문 완료 → 수령 완료
```

공구 생성자와 관리자는 공구를 관리할 수 있고, 참가자는 자신의 주문 항목을 관리할 수 있도록 권한이 구분되어 있습니다.

Supabase 주요 테이블:

```text
coffee_orders
coffee_order_items
```

---

## 4-5. 사진첩

경로:

```text
/gallery
```

광주 2반의 활동 사진을 저장하는 공간입니다.

주요 기능:

- 사진 업로드
- 여러 장 동시 업로드
- 사진 제목 / 설명
- 촬영일 지정
- 등록자 선택
- 카테고리 분류
- 검색
- 좋아요
- 댓글
- 상세보기
- 관리자 사진 수정 / 삭제

사진 카테고리:

- 수업
- 프로젝트
- 행사
- 점심
- 회식
- 기타

이미지 원본은 Supabase Storage의 다음 버킷에 저장됩니다.

```text
gallery-images
```

사진 정보는 다음 테이블에 저장됩니다.

```text
gallery_photos
gallery_comments
```

---

## 4-6. 그라운드 룰

경로:

```text
/ground-rules
```

반 구성원이 함께 지켜야 할 규칙을 공유합니다.

주요 기능:

- 규칙 추가
- 규칙 수정
- 규칙 삭제
- 카테고리 분류
- 해시태그
- 공감/좋아요
- 최신순 정렬
- 공감순 정렬
- 중요 규칙 상단 고정
- 검색 및 필터링

카테고리:

```text
시간 / 생활 / 배려 / 친목 / 시설 / 기타
```

Supabase 주요 테이블:

```text
ground_rules
ground_rule_likes
```

본인이 작성한 규칙 또는 관리자가 규칙을 수정/삭제할 수 있습니다.

---

## 4-7. 익명 게시판

경로:

```text
/board
```

회원 화면에서는 작성자 이름을 표시하지 않는 익명 게시판입니다.

주요 기능:

- 익명 게시글 작성
- 제목 최대 80자
- 본문 최대 1000자
- 등록 시간 서버 기록
- 일반 회원 화면에서는 작성자 비공개
- 실제 작성자 정보는 별도 감사용 테이블에 기록

게시글은 다음 테이블에 저장됩니다.

```text
anonymous_posts
```

실제 작성자 연결 정보는 다음 테이블에서 관리합니다.

```text
anonymous_post_authors
```

게시글 등록은 DB 함수인 다음 RPC를 사용합니다.

```text
create_anonymous_post(...)
```

따라서 일반 화면의 익명성은 유지하면서, 필요한 경우 관리자 감사 기능에서 실제 작성자를 확인할 수 있습니다.

### 관리자 익명 작성자 확인 단축키

관리자 페이지의 **익명 게시판 탭**에서 실제 작성자는 기본적으로 숨겨집니다.

```text
Ctrl + Shift + G
```

을 누르면 실제 작성자가 표시됩니다.

다시 같은 단축키를 누르면 숨겨집니다.

```text
기본 상태
→ 실제 작성자 숨김

Ctrl + Shift + G
→ 실제 작성자 표시

Ctrl + Shift + G 다시 입력
→ 실제 작성자 숨김
```

이 기능은 일반 회원 게시판이 아니라 **관리자 콘솔의 익명 게시판 관리 화면**에서만 작동합니다.

---

# 5. 게임

## 5-1. 게임 허브

경로:

```text
/games
```

현재 구현된 메인 게임은 **뱅!** 입니다.

---

## 5-2. 뱅! 보드게임

경로:

```text
/games/bang
```

반 구성원들이 각자의 기기에서 같은 게임방에 접속할 수 있도록 구성되어 있습니다.

게임방 정보는 Supabase의 `bang_rooms`와 브라우저 캐시를 함께 사용합니다.

주요 기능:

- 게임방 생성
- 게임방 목록
- 게임방 참가 / 나가기
- 방장 관리
- 인원 제한
- 준비 상태
- 게임 시작
- 역할 자동 배정
- 캐릭터 선택
- 생명력 관리
- 턴 진행
- 카드 게임 상태 관리
- 승리 조건 판정
- 활동 로그
- 대기실 / 게임 채팅
- 게임 결과

지원 역할:

```text
보안관 (Sheriff)
부관 (Deputy)
무법자 (Outlaw)
배신자 (Renegade)
```

게임 채팅은 다음 테이블을 사용합니다.

```text
bang_chat_messages
```

채팅은 Supabase Realtime에 등록되어 다른 기기에서도 실시간으로 갱신됩니다.

---

# 6. 공부 문제

경로:

```text
/study
```

현재 프로젝트에는 총 **800문제**의 학습 트랙이 구성되어 있습니다.

| 과목 | 문제 수 | 주요 범위 |
| --- | ---: | --- |
| Python | 400문제 | 연산자, 시퀀스, 제어문, 함수, 자료구조, OOP, 예외처리 |
| Web | 300문제 | HTML, CSS, Bootstrap, Semantic, Responsive Grid, UX/UI |
| AI Python 기초 | 100문제 | Python, API, NumPy, Pandas, Matplotlib/EDA |
| **합계** | **800문제** |  |

---

## 6-1. Python 문제

문제 데이터:

```text
src/data/pythonQuestionBank.ts
src/data/standardPythonQuestionSeeds.ts
src/data/extremePythonQuestions.ts
```

난이도:

```text
Easy / Medium / Hard / Extreme
```

문제 유형:

```text
객관식
단답형
서술형
```

풀이 기록은 다음 테이블에 저장됩니다.

```text
study_attempts
```

---

## 6-2. Web 문제

문제 데이터:

```text
src/data/webQuestionBank.ts
```

난이도:

```text
Easy / Medium / Hard
```

범위:

```text
HTML
CSS
Bootstrap
Semantic HTML
Responsive / Grid
UX / UI
```

풀이 기록:

```text
web_study_attempts
```

---

## 6-3. AI Python 기초

문제 데이터:

```text
src/data/aiPythonQuestionBank.ts
```

범위:

```text
Python
API
NumPy
Pandas
Matplotlib / EDA
```

풀이 기록:

```text
ai_python_study_attempts
```

---

## 6-4. 학습 기록 저장 방식

학습 기록은 사용자 경험을 위해 브라우저에 먼저 저장하고, Supabase와 동기화합니다.

```text
문제 제출
  ↓
Local Storage에 즉시 반영
  ↓
Supabase 저장 시도
  ↓
실패하면 pending queue 유지
  ↓
연결 복구 후 재전송
```

이를 통해 일시적인 네트워크 오류가 있어도 풀이 기록이 바로 사라지지 않도록 구성되어 있습니다.

학습 관련 주요 파일:

```text
src/hooks/useStudyProgress.ts
src/hooks/useWebStudyProgress.ts
src/hooks/useAiPythonStudyProgress.ts

src/services/studyProgressService.ts
src/services/webStudyProgressService.ts
src/services/aiPythonStudyProgressService.ts

src/services/storage/studyProgressStorage.ts
src/services/storage/webStudyProgressStorage.ts
src/services/storage/aiPythonStudyProgressStorage.ts
```

---

# 7. 관리자 기능

경로:

```text
/admin
```

관리자 권한은 단순히 화면에서 버튼만 숨기는 방식이 아니라, 서버의 `/api/admin`에서 현재 Supabase 세션을 확인하고 `members.role = 'admin'`인지 다시 검증합니다.

관리자 기능:

### 회원 관리

- 전체 회원 조회
- 새 회원 추가
- 회원 활성화 / 비활성화
- 초기 비밀번호 `1234`로 강제 초기화
- 비밀번호 변경 대기 상태 확인
- 최근 로그인 시간 확인
- Auth 계정 생성 여부 확인

### 익명 게시판 관리

- 전체 익명 게시글 조회
- 게시글 수정
- 게시글 삭제
- 실제 작성자 감사 정보 확인
- `Ctrl + Shift + G` 작성자 표시/숨김

### 게임방 관리

- 저장된 뱅 게임방 확인
- 게임방 및 관련 데이터 삭제

### 사진첩 관리

- 사진 제목 / 설명 수정
- 사진 삭제

---

# 8. 비밀번호와 보안 구조

## 비밀번호 원문은 저장하지 않습니다

현재 프로젝트는 사용자가 입력한 비밀번호 원문을 `members` 테이블에 저장하지 않습니다.

로그인 전 비밀번호는 서버에서 다음 형태로 변환된 뒤 Supabase Auth에 전달됩니다.

```text
G2@{사용자 비밀번호}::{AUTH_PASSWORD_PEPPER}
```

그리고 Supabase Auth가 최종적으로 안전한 해시 방식으로 저장합니다.

즉 다음과 같은 원문 조회는 불가능하고, 이것이 정상적인 보안 방식입니다.

```text
현재 비밀번호가 무엇인지 DB에서 원문으로 조회
→ 불가능
```

비밀번호를 잊은 회원은 관리자가 비밀번호를 `1234`로 초기화할 수 있습니다.

---

## Service Role Key는 프론트에 넣지 않습니다

아래 키는 서버 전용입니다.

```env
SUPABASE_SERVICE_ROLE_KEY=...
```

절대로 다음처럼 `VITE_`를 붙이면 안 됩니다.

```env
VITE_SUPABASE_SERVICE_ROLE_KEY=...   # 금지
```

`VITE_`로 시작하는 환경변수는 브라우저 번들에 포함될 수 있기 때문입니다.

---

# 9. 환경변수

프로젝트 루트의 `.env.example`을 참고하여 `.env.local`을 만듭니다.

```bash
cp .env.example .env.local
```

Windows에서는 직접 파일을 복사해도 됩니다.

기본 환경변수:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key
ADMIN_PASSWORD=choose-a-strong-admin-password
SUPABASE_SERVICE_ROLE_KEY=your-supabase-secret-key
```

선택적으로 비밀번호 변환용 pepper를 직접 지정할 수 있습니다.

```env
AUTH_PASSWORD_PEPPER=your-custom-pepper
```

지정하지 않으면 코드의 기본값을 사용합니다.

> 로컬과 Vercel에서 `AUTH_PASSWORD_PEPPER`를 직접 지정하는 경우 **두 환경의 값을 반드시 동일하게 유지**해야 합니다.

---

## Supabase 새 API Key 기준

Supabase의 새 키 체계를 사용할 경우 다음처럼 구분합니다.

### 브라우저용

```text
VITE_SUPABASE_ANON_KEY
→ sb_publishable_...
```

### 서버 전용

```text
SUPABASE_SERVICE_ROLE_KEY
→ sb_secret_...
```

`sb_publishable_...` 값을 `SUPABASE_SERVICE_ROLE_KEY`에 넣으면 서버 API에서 다음 오류가 발생할 수 있습니다.

```text
Invalid API key
```

---

# 10. 로컬 실행 방법

## 방법 1. start.bat

Windows에서는 프로젝트 루트의 다음 파일을 실행할 수 있습니다.

```text
start.bat
```

이 파일은 다음 작업을 자동 수행합니다.

```text
pnpm install --frozen-lockfile
pnpm dev --open
```

---

## 방법 2. 터미널

### 1) Node.js 확인

Node.js 22 이상 환경을 권장합니다.

```bash
node -v
```

### 2) Corepack 활성화

```bash
corepack enable
```

### 3) 의존성 설치

```bash
corepack pnpm install
```

### 4) 개발 서버 실행

```bash
corepack pnpm dev
```

또는:

```bash
pnpm dev
```

Vite 개발 서버 주소는 보통 다음 형태입니다.

```text
http://localhost:5173
```

---

# 11. 로컬 API 구조

Vercel에서는 `api/*.ts`가 서버 함수로 실행됩니다.

하지만 로컬 Vite 개발 서버에서도 동일한 URL을 사용할 수 있도록 `vite.config.ts`에서 API를 연결합니다.

현재 로컬에서 지원되는 API:

```text
/api/auth
/api/admin
/api/bang-leave
```

관련 코드:

```text
vite.config.ts
api/auth.ts
api/admin.ts
api/bang-leave.ts
```

따라서 프론트 코드는 로컬과 배포 환경 모두 다음처럼 동일하게 요청할 수 있습니다.

```ts
fetch("/api/auth", ...)
```

---

# 12. Supabase 데이터베이스 설정

## 신규 Supabase 프로젝트

권장 순서:

### 1) 기본 스키마

Supabase SQL Editor에서 실행:

```text
supabase/schema.sql
```

기본적으로 다음 데이터 구조를 만듭니다.

- 사진첩
- 댓글
- Storage bucket
- 공동구매
- 익명 게시글
- 뱅 게임방
- 뱅 채팅
- 학습 기록 테이블

### 2) 인증 / 커뮤니티 마이그레이션

```text
supabase/migrations/20260805_auth_community.sql
```

주요 내용:

- `members` 회원 테이블
- 기본 회원 명단
- 관리자 계정
- 익명 작성자 감사 테이블
- 커뮤니티 소유권
- 그라운드 룰
- RLS 강화
- `create_anonymous_post` RPC

### 3) members 권한 보정

```text
supabase/migrations/0806.sql
```

서버의 service role이 `members`를 정상적으로 조회/수정할 수 있도록 권한을 보정합니다.

---

## 기존 프로젝트에 학습 테이블만 추가하는 경우

필요한 SQL만 개별 실행할 수 있습니다.

```text
supabase/study_progress.sql
supabase/web_study_progress.sql
supabase/ai_python_study_progress.sql
```

뱅 채팅 Realtime 설정이 필요한 경우:

```text
supabase/bang_chat_realtime.sql
```

---

# 13. Supabase 주요 테이블

| 테이블 | 용도 |
| --- | --- |
| `members` | 회원 / 관리자 계정 정보 |
| `gallery_photos` | 사진첩 사진 정보 |
| `gallery_comments` | 사진 댓글 |
| `coffee_orders` | 공동구매 방 |
| `coffee_order_items` | 공동구매 참가자 주문 |
| `anonymous_posts` | 익명 게시글 |
| `anonymous_post_authors` | 익명글 실제 작성자 감사 정보 |
| `ground_rules` | 그라운드 룰 |
| `ground_rule_likes` | 그라운드 룰 공감 |
| `bang_rooms` | 뱅 게임방 상태 |
| `bang_chat_messages` | 뱅 채팅 |
| `study_attempts` | Python 학습 기록 |
| `web_study_attempts` | Web 학습 기록 |
| `ai_python_study_attempts` | AI Python 학습 기록 |

---

# 14. Vercel 배포

## Git 연동 배포

일반적인 흐름:

```bash
git add .
git commit -m "update"
git push
```

Vercel 프로젝트가 Git 저장소와 연결되어 있으면 push 이후 자동 배포됩니다.

---

## Vercel 환경변수

Vercel에서 다음 위치로 이동합니다.

```text
Project
→ Settings
→ Environment Variables
```

최소 다음 값을 등록합니다.

```text
ADMIN_PASSWORD
SUPABASE_SERVICE_ROLE_KEY
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_URL
```

필요한 경우 추가:

```text
AUTH_PASSWORD_PEPPER
```

환경변수를 수정한 후에는 기존 배포에 자동 반영되지 않을 수 있으므로 **새 배포 또는 Redeploy**를 수행합니다.

```text
Deployments
→ 최신 배포
→ ...
→ Redeploy
```

---

# 15. 프로젝트 폴더 구조

```text
Ssafy_2class_page/
│
├─ api/                         # Vercel 서버 함수
│  ├─ auth.ts                   # 로그인 / 프로필 / 비밀번호 변경
│  ├─ admin.ts                  # 관리자 API
│  └─ bang-leave.ts             # 뱅 게임 나가기 처리
│
├─ src/
│  ├─ app/
│  │  ├─ routes.ts              # 전체 라우팅
│  │  ├─ App.tsx
│  │  └─ Root.tsx
│  │
│  ├─ components/
│  │  ├─ auth/                  # 보호 라우트
│  │  ├─ layout/                # Header / Footer
│  │  └─ team/                  # 팀 편성 UI
│  │
│  ├─ config/                   # 메뉴 / 전역 설정
│  ├─ context/                  # Auth / Admin Context
│  ├─ data/                     # 학생/문제/기본 데이터
│  ├─ hooks/                    # 학습/게임/인증 Hooks
│  ├─ lib/                      # Supabase client
│  ├─ services/                 # DB / Storage 서비스
│  ├─ types/                    # TypeScript 타입
│  ├─ utils/                    # 공통 로직
│  └─ views/                    # 페이지
│     ├─ games/
│     └─ study/
│
├─ supabase/
│  ├─ schema.sql
│  ├─ study_progress.sql
│  ├─ web_study_progress.sql
│  ├─ ai_python_study_progress.sql
│  ├─ bang_chat_realtime.sql
│  └─ migrations/
│
├─ tests/                       # Node 기반 테스트
├─ vite.config.ts
├─ vercel.json
├─ package.json
├─ pnpm-lock.yaml
├─ .env.example
└─ README.md
```

---

# 16. 주요 라우트

| 경로 | 화면 |
| --- | --- |
| `/login` | 로그인 |
| `/` | 메인 홈 |
| `/me` | 내정보 |
| `/teams` | 랜덤 팀 편성 |
| `/coffee` | 같이 공구 |
| `/gallery` | 사진첩 |
| `/ground-rules` | 그라운드 룰 |
| `/board` | 익명 게시판 |
| `/games` | 게임 허브 |
| `/games/bang` | 뱅 게임방 목록 |
| `/games/bang/:roomId` | 뱅 대기방 |
| `/games/bang/:roomId/play` | 뱅 게임 플레이 |
| `/study` | 학습 허브 |
| `/study/python` | Python 학습 |
| `/study/python/quiz` | Python 문제 풀이 |
| `/study/report` | Python 학습 리포트 |
| `/study/web` | Web 학습 |
| `/study/web/quiz` | Web 문제 풀이 |
| `/study/web/report` | Web 학습 리포트 |
| `/study/ai-python` | AI Python 학습 |
| `/study/ai-python/quiz` | AI Python 문제 풀이 |
| `/admin` | 관리자 콘솔 |

로그인을 하지 않은 상태에서 보호된 페이지에 접근하면 로그인 화면으로 이동합니다.

---

# 17. 개발 명령어

## 개발 서버

```bash
pnpm dev
```

## Production build

```bash
pnpm build
```

## 뱅 게임 규칙 테스트

```bash
pnpm test:bang
```

## 인증 / 커뮤니티 테스트

```bash
pnpm test:auth-community
```

## 학습 초기화 테스트

```bash
pnpm test:study-reset
```

## Python 문제은행 검증

```bash
pnpm validate:study
```

## Web 문제은행 검증

```bash
pnpm validate:web-study
```

## AI Python 문제은행 검증

```bash
pnpm validate:ai-python-study
```

---

# 18. 자주 발생하는 오류

## 18-1. 로컬에서는 로그인되는데 Vercel 배포에서는 로그인 실패

Vercel Runtime Logs에서 다음 오류가 보일 수 있습니다.

```text
Invalid API key
```

확인할 것:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

특히:

```text
VITE_SUPABASE_ANON_KEY
→ sb_publishable_...

SUPABASE_SERVICE_ROLE_KEY
→ sb_secret_...
```

인지 확인합니다.

또한 URL과 키가 반드시 **같은 Supabase 프로젝트의 값**이어야 합니다.

---

## 18-2. `permission denied for table members`

다음 가능성을 확인합니다.

1. 서버가 올바른 `SUPABASE_SERVICE_ROLE_KEY`를 사용하는지 확인
2. `supabase/migrations/0806.sql` 실행
3. Vercel 환경변수를 수정했다면 Redeploy

---

## 18-3. 관리자 페이지에서 `/api/admin` 500 오류

Vercel ESM 환경에서 다음과 같은 오류가 발생할 수 있습니다.

```text
Cannot find module '/var/task/api/auth'
```

`api/admin.ts`의 상대 import가 다음처럼 `.js` 확장자를 사용하고 있는지 확인합니다.

```ts
import { normalizeLoginId, providerPassword } from "./auth.js";
```

프로젝트는 `package.json`에서 다음 설정을 사용합니다.

```json
{
  "type": "module"
}
```

따라서 Vercel의 Node ESM 실행 환경을 고려해야 합니다.

---

## 18-4. 초기 비밀번호 1234가 배포에서만 동작하지 않음

`1234` 자체의 문제가 아니라 서버 API가 Supabase에 접근하지 못하는 경우가 많습니다.

확인 순서:

```text
Vercel Runtime Logs 확인
→ Invalid API key 여부
→ Service Role Key 확인
→ Supabase URL 확인
→ 환경변수 저장
→ Redeploy
```

---

## 18-5. Supabase 아이디를 바꿨는데 팀 편성 화면 아이디가 그대로임

로그인 정보:

```text
Supabase public.members
```

팀 편성 기본 명단:

```text
src/data/students.ts
```

두 데이터는 서로 다른 목적을 사용하므로 자동으로 동기화되지 않습니다.

로그인 아이디와 화면 표시 아이디를 모두 바꾸고 싶다면 필요한 데이터를 각각 수정해야 합니다.

---

## 18-6. 환경변수를 바꿨는데 배포 사이트가 그대로임

Vercel 환경변수는 이미 생성된 배포에 바로 적용되지 않을 수 있습니다.

```text
환경변수 수정
→ Save
→ Deployments
→ Redeploy
```

순서로 다시 배포합니다.

---

# 19. 관리자용 회원 관리 참고

새 회원을 관리자 화면에서 추가하면 `members`에 먼저 등록됩니다.

일반 회원은 최초 로그인 시 다음 흐름으로 계정이 생성됩니다.

```text
members에 회원 존재
  ↓
사용자가 아이디 + 1234 로그인
  ↓
/api/auth
  ↓
Supabase Auth 사용자 생성
  ↓
members.auth_user_id 연결
  ↓
세션 발급
  ↓
비밀번호 변경 화면
```

관리자가 회원의 비밀번호를 초기화하면:

```text
Supabase Auth 비밀번호 → 1234에 대응하는 값으로 변경
members.must_change_password → true
members.password_changed_at → null
```

그 회원은 다시 `1234`로 로그인한 뒤 새 비밀번호를 설정합니다.

---

# 20. 데이터 관리 시 주의사항

## `students.ts`와 `members`의 차이

### `src/data/students.ts`

- 팀 편성 기본 명단
- 프론트 정적 데이터
- Git으로 관리

### `public.members`

- 실제 로그인 계정
- 회원 활성/비활성
- 역할
- Auth User 연결
- 비밀번호 변경 필요 상태
- 최근 로그인 기록

즉 두 데이터는 목적이 다릅니다.

---

# 21. 보안 주의사항

다음 값은 GitHub에 절대 커밋하지 않습니다.

```text
.env
.env.local
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
AUTH_PASSWORD_PEPPER
```

현재 `.gitignore`에는 `.env`와 `.env.local`이 포함되어 있습니다.

커밋 전 확인:

```bash
git status
```

실제 Secret Key가 Git, 화면 공유, 채팅 등에 노출되었다면 Supabase에서 해당 키를 폐기하고 새 키를 발급하는 것이 좋습니다.

---

# 22. 배포 후 확인 체크리스트

배포가 끝나면 다음 항목을 순서대로 확인하는 것을 권장합니다.

- [ ] 로그인 페이지가 정상적으로 열리는가
- [ ] 일반 회원이 초기 비밀번호 `1234`로 최초 로그인 가능한가
- [ ] 첫 로그인 후 비밀번호 변경이 가능한가
- [ ] 변경한 비밀번호로 재로그인 가능한가
- [ ] 관리자 로그인이 가능한가
- [ ] 회원 목록 조회가 가능한가
- [ ] 관리자 비밀번호 초기화가 가능한가
- [ ] 익명 게시글 등록이 가능한가
- [ ] 관리자에서 익명글 목록이 보이는가
- [ ] `Ctrl + Shift + G`로 실제 작성자 표시/숨김이 가능한가
- [ ] 공동구매 생성 / 참여가 가능한가
- [ ] 사진 업로드가 가능한가
- [ ] 그라운드 룰 등록 / 좋아요가 가능한가
- [ ] 뱅 게임방이 다른 기기에서 공유되는가
- [ ] 뱅 채팅이 실시간 반영되는가
- [ ] 학습 기록이 저장되는가

---

# 23. 앞으로 확장하기 좋은 기능

현재 구조를 유지하면서 다음 기능을 추가하기 좋습니다.

- 새로운 공부 과목 추가
- Machine Learning 문제 트랙
- SQLD / 빅데이터분석기사 문제 트랙
- 새로운 보드게임 추가
- 공지사항
- 일정 / 캘린더
- 푸시 알림
- 관리자 통계 대시보드
- 사진첩 권한 강화
- 익명 게시판 신고 기능
- 학습 랭킹 / 반 전체 통계
- 문제 검색 및 북마크

학습 트랙은 `src/data`, `src/types`, `src/hooks`, `src/services`, `src/views/study` 구조를 따라 추가하면 기존 코드와 일관성을 유지하기 쉽습니다.

---

# 24. 프로젝트 목적

이 프로젝트는 거창한 외부 서비스보다 **광주 2반 사람들이 실제로 자주 사용하는 작은 기능들을 하나의 공간에 모으는 것**을 목표로 합니다.

```text
같이 공부하고
같이 주문하고
같이 게임하고
같이 기록하는
SSAFY 광주 2반 전용 공간
```

기능은 필요할 때마다 계속 추가할 수 있도록 페이지, 서비스, 타입, 데이터 계층을 분리하여 구성했습니다.

---

## License / Usage

광주 2반 내부 사용을 중심으로 제작된 프로젝트입니다.  
외부 공개 또는 다른 반/조직에서 재사용할 경우 Supabase RLS, Storage 정책, 관리자 키, 개인정보 처리 범위를 반드시 다시 검토하세요.
