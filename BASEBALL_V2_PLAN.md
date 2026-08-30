# Baseball V2 구현 계획과 완료 기준

이 문서는 현재 저장소의 야구게임을 분석한 결과와 V2 구현 순서를 고정한다. 목표는 결과 문구를 보여주는 미니게임이 아니라 `투구 → 타격 → 타구 → 수비 → 주루 → 득점 → 기록 → 다음 타자`가 연속적으로 보이는 3이닝 캐주얼 야구게임이다.

## 1. 현재 코드에서 확인한 문제

- `baseballEngine.ts`가 규칙, 타격 판정, CPU 확률표, 진루를 모두 담당한다.
- `judgeSwingContact()`는 위치·타이밍 오차만으로 홈런/3루타/2루타/안타를 먼저 정한다.
- `judgeCpuPitchResult()`는 두 개의 난수로 최종 결과를 직접 정해 사용자와 CPU가 같은 타격 엔진을 쓰지 않는다.
- 모든 인플레이 타구가 동일한 CSS 키프레임으로 좌측 상단에 날아간다.
- 수비수 선택, 포구 시간, 송구 시간, 타자 주력, 실책 판정이 없다.
- 베이스가 boolean이라 주자 신원·주력·득점자·타점을 계산하거나 표시할 수 없다.
- 선수, 9명 타순, 투수 상태, 선수별 경기 기록이 없다.
- `BaseballGameView.tsx`가 1,000줄을 넘으며 게임 규칙, 온라인 저장, 입력, 타이머, HUD, 연출을 함께 담당한다.
- 안타가 나면 수비·주루 과정 없이 점수와 베이스를 즉시 변경하고 결과 오버레이만 표시한다.
- 공격/수비 배경 2장만 실제 경기에서 사용해 타구 방향과 플레이 결과가 공간적으로 구분되지 않는다.
- TAKE와 CONTACT/NORMAL/POWER 스윙이 없고 PCI 크기도 선수 능력과 무관하다.
- CPU 투수는 볼카운트·최근 구종·최근 코스를 고려하지 않는다.
- 온라인 이벤트가 `Record<string, unknown>` 전체 상태 복사이며 revision, sequence, playId, 중복 방지, 발신자 권한 검증이 없다.
- 온라인 2인 모드는 양쪽 모두 타격 입력만 제공하며 실제 투수 입력을 상대에게 전달하지 않는다.
- 저장된 게임 상태에 version과 normalize/migration이 없어 V2 타입 변경 시 구버전 방이 깨질 수 있다.
- 라인스코어는 있지만 선수 기록, 타석별 플레이 로그, MVP, 주요 장면이 없다.
- 경기 시작·새 타자·홈런·득점·공수교대·경기 종료가 독립 시퀀스로 구성되지 않았다.

## 2. 이미 완료된 기반

- [x] 기존 2560×256 구종별 10프레임 스프라이트 런타임 참조 제거
- [x] 흰색 야구공 본체, 회전, 잔상, 글로우, 구종 궤적을 독립 레이어로 분리
- [x] 직구는 빠른 직선, 기존 변화구는 중간에서 휘고 지정한 목표에 도착
- [x] 공 원근 스케일과 구종별 비행 시간을 분리
- [x] 2인 방 생성·초대·준비 완료 전 시작 차단

## 3. 구현 순서

### A. 엔진 경계와 V2 상태

- [x] `src/utils/games/baseball/` 모듈 디렉터리 생성
- [x] 선수/로스터/9명 타순/수비 포지션 데이터 분리
- [x] `BaseRunner` 신원 기반 베이스 상태 도입
- [x] 타자/투수 경기 기록과 라인스코어 오류 수치 도입
- [x] 투수 투구 수·체력·자신감·구종 목록 도입
- [x] `BaseballGameState.version = 2`, revision, currentBatterIndex, play history 도입
- [x] `normalizeBaseballGameState()`로 V1 boolean 베이스와 누락 필드 변환
- [x] 기존 `baseballEngine.ts`는 호환 re-export 진입점으로 유지

### B. 실제 플레이 결정 파이프라인

- [x] seed 기반 결정적 난수 소스 도입
- [x] 7구종(포심/투심/슬라이더/커브/체인지업/포크/커터)과 Bezier 투구 궤적 도입
- [x] 투수 능력·체력·제구 타이밍으로 실제 위치와 PitchQuality 계산
- [x] TAKE 및 CONTACT/NORMAL/POWER 스윙 입력 도입
- [x] 타자 능력, handedness, PCI 중첩, 타이밍, 투구 품질로 접촉 품질 계산
- [x] 접촉 이후에만 exitVelocity, launchAngle, horizontalAngle, spin 계산
- [x] 타구 물리로 GROUND/LINER/FLY/POPUP과 수비 zone 계산
- [x] 타구 도착 시간과 수비수 도달/포구/송구 시간을 비교해 OUT/HIT/ERROR 결정
- [x] 신원 기반 주루, force/tag, 병살, 희생플라이, 득점 타이밍 계산
- [x] 최종 결과는 물리·수비·주루 해석의 마지막 단계에서만 생성
- [x] CPU도 사용자와 동일한 투구·접촉·타구·수비·주루 엔진 사용

### C. 시각 이벤트와 카메라

- [x] 논리 상태와 presentation 상태 분리
- [x] `CONTACT → BALL_FLIGHT → FIELD_RESULT → RUNNER_ADVANCE → RUN_SCORE → SCOREBOARD_UPDATE → PLAY_RESULT → NEXT_BATTER` 이벤트 큐 구현
- [x] 물리 trace에서 카메라를 고르는 `CameraDirector` 구현
- [ ] 타격/투구/접촉/내야/좌·중·우 외야/파울/주루/홈인/더그아웃/홈런/리플레이 카메라 구현 (모든 모드 명시 선택 완료, 전용 더그아웃·관중 장면 제작 대기)
- [x] 실제 타구 좌표를 쓰는 `BattedBallLayer` 구현
- [x] 수비수 접근·포구·송구와 OUT/SAFE 장면 구현
- [ ] 주자 sprint/slide/score 보간 애니메이션 구현 (sprint/score/OUT 종착은 완료, slide 동작은 남음)
- [x] 홈을 밟는 시점에 presentation 점수 갱신
- [x] 홈런 2~4초 전용 시퀀스와 스킵 구현

### D. UI와 경기 프레젠테이션

- [x] `BaseballStage`, `BaseballHUD`, `Scoreboard`, `BatterHUD`, `PitcherHUD` 분리
- [x] `StrikeZone`, `PitchLayer`, `BattedBallLayer`, `RunnerLayer` 분리
- [x] `PlayResultOverlay`, `ScoringSequence`, `HomeRunSequence` 분리
- [x] `GameIntro`, `PlayerIntro`, `HalfInningTransition`, `FinalResult` 분리
- [x] 현재 타자/투수, 다음 타자 2명, 실제 주자 이름·주력 HUD 표시
- [x] 득점권/만루/풀카운트/클러치/역전/끝내기 상황 배지 구현
- [x] 펼칠 수 있는 타석별 PLAY BY PLAY 구현
- [x] FINAL SCORE, 라인스코어 R/H/E, MVP, 선수 기록, 주요 장면 구현

### E. 이미지 에셋과 성능

- [ ] 같은 경기장/조명/유니폼 스타일의 상황 카메라 최소 15개 제작
- [x] 타자 portrait 9개 이상, 투수 portrait 2개 이상 제작
- [ ] hit/double/triple/homeRun/strikeout/score/safe/out 효과 또는 상황 컷 제작 (검수 완료: hit/triple/homeRun 3종)
- [x] 전체 새 야구 전용 에셋 25~40개를 실제 화면에 연결
- [x] 생성된 공·주자·수비수·포수·미트·초상을 직접 열어 잘림·배경·가장자리·스타일·공 중복 검사
- [x] critical/lazy 그룹을 가진 `GameAssetPreloader` 구현
- [x] requestAnimationFrame 또는 CSS 변수 기반 공/타구/주자 애니메이션으로 전체 View의 60FPS setState 방지

### F. 온라인 공통 엔진과 안정성

- [x] 솔로와 온라인은 동일 V2 엔진을 사용하고 Input Provider만 분리
- [x] 온라인에서 타자 좌석은 스윙/TAKE, 투수 좌석은 구종/코스/제구 입력만 전송
- [x] schemaVersion, matchId, playId, sequence, baseRevision, actorSeat, seed를 가진 이벤트 도입
- [x] 발신자 좌석/턴 검증, 중복 이벤트 무시, revision 충돌 거부
- [x] 재접속 시 authoritative snapshot으로 복구
- [x] 구버전 localStorage/Supabase room_data 정규화

## 4. 테스트와 완료 게이트

- [x] 4볼 볼넷, 3스트라이크 삼진, 2스트라이크 파울, 3아웃 공수교대
- [x] single/double/triple/homeRun/grand slam, runner identity, lineup rotation
- [x] ground/liner/fly/popup, 좌/중/우 안타, 내야 안타, 병살, 희생플라이, 실책
- [x] 득점/타점/타자 기록/투수 기록/체력/투구 수
- [x] CPU count별 TAKE/스윙과 구종 선택
- [x] 동일 seed 결과 일치, 다른 seed variation, 카메라가 물리 결과를 바꾸지 않음
- [x] 온라인 authority, sequence, idempotency, revision, reconnect 테스트
- [x] V1 저장 상태를 V2로 정규화하는 migration 테스트
- [ ] 직구/슬라이더/커브/체인지업에서 공이 항상 하나만 보이는 시각 검증
- [ ] 최소 10타석 또는 한 경기 전체 실제 브라우저 플레이
- [ ] 투구, 타격, 안타, 주자, 득점, 홈런, 공수교대, FINAL 화면 캡처 확인
- [ ] 3이닝 동안 카메라와 플레이가 단조롭게 반복되지 않는지 확인
- [x] 전체 야구 테스트와 프로덕션 빌드 통과

현재 시각 무결성 상태: 깨진 10프레임 atlas는 파일과 런타임 참조를 모두 제거했고, 1254×1254 RGBA 공 본체 하나와 동일 소스 기반 잔상 10개로 교체했다. 타자·외야 카메라는 정지 공이 없는 검수 완료 자산을 사용한다. 실제 브라우저 한 경기 캡처 검증은 아직 남아 있다.

선수 초상 상태: 실제 선수 사진을 복제하지 않은 자체 제작 RGBA 초상 11개(홈 타순 9명, 양 팀 선발투수 2명)를 추가했다. 동일한 정적 자산 맵을 경기 시작 선발/전체 라인업, 매 타자 소개, 현재 타자·투수 HUD, FINAL MVP가 공유한다. 모든 초상은 lazy preload 대상이면서 실제 화면 소비 경로를 가진다.

결과 컷 상태: 1254×1254 투명 RGBA로 생성하고 직접 검수한 hit/triple/homeRun 3종을 공식 판정 매핑, Solo·Online 이벤트 오버레이, 득점·홈런 시퀀스에 연결했다. 잘린 수비수 팔이 있던 double 시안은 폐기했고, double/strikeout/score/safe/out 5종은 재생성·검수 후 연결해야 한다.

카메라 라우팅 상태: BATTER/PITCHER/CONTACT/INFIELD/5개 외야/1·3루 라인/BASE_RUNNING/HOME_PLATE/HOME_RUN/REPLAY를 공통 resolver에서 명시적으로 선택한다. 파울은 실제 타구의 `FOUL_LEFT`·`FOUL_RIGHT`, 더그아웃은 공격팀의 홈·원정 문맥을 받는다. BASE_RUNNING은 검수된 빈 `infield-wide-v3`를 명시 경로로 재사용하며, 구형 `baseball-camera-infield.png`는 계속 런타임에서 제외한다. manifest는 39개다. 홈·원정 더그아웃과 일반·환호 관중 전용 원본 4장은 아직 생성해야 한다.

공통 플레이 재생 상태: 솔로와 온라인이 같은 타구·수비·주루·득점 이벤트 재생기를 사용한다. 좌·좌중·중·우중·우 외야와 홈인 배경에서 정적인 필드 선수를 제거했고, 공격·수비 팀 색상에 맞는 투명 주자/수비수 스프라이트를 동적으로 합성한다. 수비수는 타구 비행에서 접근한 위치를 수비 결과 장면까지 연속적으로 이어가며, 포구 뒤에는 실제 아웃 대상 베이스까지 clean 공 하나로 송구한다. 주자는 화면 이동 방향을 바라보며 SAFE/SCORE 종착점 또는 OUT 시각에 맞춰 멈춘다. 점수·주자·카운트 HUD는 SCOREBOARD_UPDATE 전후 스냅샷을 분리해 판정 전에 결과가 노출되지 않는다. 온라인은 초기 canonical 복구와 두 참가자 Presence 확인 전 캐시 플레이를 시작하지 않고, 최신 playId가 바뀌면 오래된 재생을 취소한다.

기록 정확성 상태: 현재 엔진의 `earnedRuns`는 실책 이후 가상 이닝을 복원하지 않으므로 FINAL 화면과 MVP 평가는 신뢰 가능한 `runsAllowed`(실점)만 사용한다. 자책점의 정확한 계산과 표시는 가상 이닝/실책 인과 추적 구현 후 완료 처리한다.

## 5. 커밋 원칙

- 각 체크포인트는 테스트와 빌드가 통과한 뒤 독립 로컬 커밋으로 남긴다.
- 임시 생성 원본, 로컬 패키지 캐시, 사용하지 않는 에셋은 커밋하지 않는다.
- 원격 푸시는 사용자에게 다시 명시적으로 승인받은 체크포인트에 한해 수행한다.
- 완료 판정은 위 체크리스트와 실제 한 경기 검증이 모두 증명된 이후에만 한다.
