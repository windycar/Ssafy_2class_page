-- AI 파이썬 기초 문제 풀이 기록을 저장하기 위해 SQL Editor에서 한 번 실행하세요.
create table if not exists public.ai_python_study_attempts (
  id text primary key,
  student_id integer not null check (student_id > 0),
  auth_user_id uuid references auth.users(id) on delete set null default auth.uid(),
  question_id text not null,
  category text not null check (
    category in ('python', 'api', 'numpy', 'pandas', 'matplotlib_eda')
  ),
  selected_answer smallint not null check (selected_answer between 0 and 3),
  correct boolean not null,
  answered_at timestamptz not null default now()
);

create index if not exists ai_python_study_attempts_student_answered_idx
  on public.ai_python_study_attempts (student_id, answered_at desc);

create index if not exists ai_python_study_attempts_auth_user_idx
  on public.ai_python_study_attempts (auth_user_id)
  where auth_user_id is not null;

alter table public.ai_python_study_attempts enable row level security;

update public.ai_python_study_attempts attempts
set auth_user_id = members.auth_user_id
from public.members members
where attempts.auth_user_id is null
  and members.auth_user_id is not null
  and coalesce(members.student_id::bigint, 900000000 + members.id)
    = attempts.student_id;

drop policy if exists "Class AI Python study attempt read"
  on public.ai_python_study_attempts;
create policy "Class AI Python study attempt read"
  on public.ai_python_study_attempts
  for select
  to authenticated
  using (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = ai_python_study_attempts.student_id
    )
  );

drop policy if exists "Class AI Python study attempt create"
  on public.ai_python_study_attempts;
create policy "Class AI Python study attempt create"
  on public.ai_python_study_attempts
  for insert
  to authenticated
  with check (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = ai_python_study_attempts.student_id
    )
  );

drop policy if exists "Class AI Python study attempt update"
  on public.ai_python_study_attempts;
create policy "Class AI Python study attempt update"
  on public.ai_python_study_attempts
  for update
  to authenticated
  using (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = ai_python_study_attempts.student_id
    )
  )
  with check (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = ai_python_study_attempts.student_id
    )
  );

drop policy if exists "Class AI Python study attempt delete"
  on public.ai_python_study_attempts;
create policy "Class AI Python study attempt delete"
  on public.ai_python_study_attempts
  for delete
  to authenticated
  using (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = ai_python_study_attempts.student_id
    )
  );

revoke all on table public.ai_python_study_attempts from anon, authenticated;
grant select, insert, update, delete on table public.ai_python_study_attempts to authenticated;
grant select, insert, update, delete on table public.ai_python_study_attempts to service_role;
