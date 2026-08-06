-- ============================================================
-- members 테이블 서버 인증 API 권한 수정
-- 작성일: 2026-08-06
--
-- api/auth.ts는 SUPABASE_SERVICE_ROLE_KEY를 사용하여
-- members 테이블을 조회/수정한다.
--
-- 기존 migration에서는 authenticated 권한만 명시적으로
-- 설정되어 있어 환경에 따라 service_role이 members 테이블
-- 접근 시 "permission denied for table members" 오류가
-- 발생할 수 있다.
-- ============================================================


-- public schema 접근 허용
grant usage on schema public to service_role;


-- members 테이블을 서버 API에서 사용할 수 있도록 권한 부여
grant select, insert, update, delete
on table public.members
to service_role;


-- members.id가 identity이므로 sequence 접근 권한도 보장
grant usage, select
on all sequences in schema public
to service_role;


-- ------------------------------------------------------------
-- 클라이언트 사용자 권한
--
-- members 테이블은 프론트에서 직접 수정하지 않는다.
-- authenticated 사용자는 자기 정보 SELECT만 가능하게 유지한다.
-- ------------------------------------------------------------

revoke insert, update, delete
on table public.members
from authenticated;

grant select
on table public.members
to authenticated;


-- anon 사용자는 members 테이블에 직접 접근하지 못하게 유지
revoke all
on table public.members
from anon;


-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------

alter table public.members
enable row level security;


-- 기존 자기 정보 조회 정책을 다시 확실하게 설정
drop policy if exists members_select_self
on public.members;

create policy members_select_self
on public.members
for select
to authenticated
using (
  (select auth.uid()) = auth_user_id
);


-- service_role은 Supabase 서버 전용 role이며 RLS를 bypass한다.
-- 따라서 service_role 전용 UPDATE policy는 만들 필요가 없다.