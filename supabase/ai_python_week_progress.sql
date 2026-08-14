-- AI Python 번째별 문제 풀이 기록
create table if not exists public.ai_python_week_attempts (
  id text primary key,
  student_id integer not null check (student_id > 0),
  auth_user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  week text not null check (week in ('week1', 'week2', 'week3-1')),
  question_id text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  category text not null,
  question_type text not null check (
    question_type in ('multiple-choice', 'short-answer', 'essay')
  ),
  selected_answer smallint check (selected_answer between 0 and 3),
  response_text text,
  correct boolean not null,
  answered_at timestamptz not null default now()
);

create index if not exists ai_python_week_attempts_student_answered_idx
  on public.ai_python_week_attempts (student_id, answered_at desc);

create index if not exists ai_python_week_attempts_auth_user_idx
  on public.ai_python_week_attempts (auth_user_id);

alter table public.ai_python_week_attempts enable row level security;

drop policy if exists ai_python_week_attempts_select_self
  on public.ai_python_week_attempts;
create policy ai_python_week_attempts_select_self
  on public.ai_python_week_attempts
  for select
  to authenticated
  using (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1
      from public.members m
      where m.auth_user_id = (select auth.uid())
        and m.is_active = true
        and coalesce(m.student_id::bigint, 900000000 + m.id)
          = ai_python_week_attempts.student_id
    )
  );

drop policy if exists ai_python_week_attempts_insert_self
  on public.ai_python_week_attempts;
create policy ai_python_week_attempts_insert_self
  on public.ai_python_week_attempts
  for insert
  to authenticated
  with check (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1
      from public.members m
      where m.auth_user_id = (select auth.uid())
        and m.is_active = true
        and coalesce(m.student_id::bigint, 900000000 + m.id)
          = ai_python_week_attempts.student_id
    )
  );

drop policy if exists ai_python_week_attempts_delete_self
  on public.ai_python_week_attempts;
create policy ai_python_week_attempts_delete_self
  on public.ai_python_week_attempts
  for delete
  to authenticated
  using (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1
      from public.members m
      where m.auth_user_id = (select auth.uid())
        and m.is_active = true
        and coalesce(m.student_id::bigint, 900000000 + m.id)
          = ai_python_week_attempts.student_id
    )
  );

drop policy if exists ai_python_week_attempts_update_self
  on public.ai_python_week_attempts;
create policy ai_python_week_attempts_update_self
  on public.ai_python_week_attempts
  for update
  to authenticated
  using (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1
      from public.members m
      where m.auth_user_id = (select auth.uid())
        and m.is_active = true
        and coalesce(m.student_id::bigint, 900000000 + m.id)
          = ai_python_week_attempts.student_id
    )
  )
  with check (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1
      from public.members m
      where m.auth_user_id = (select auth.uid())
        and m.is_active = true
        and coalesce(m.student_id::bigint, 900000000 + m.id)
          = ai_python_week_attempts.student_id
    )
  );

revoke all on table public.ai_python_week_attempts from anon, authenticated;
grant select, insert, update, delete on table public.ai_python_week_attempts to authenticated;
grant select, insert, update, delete on table public.ai_python_week_attempts to service_role;

