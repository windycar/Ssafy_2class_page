-- 특별 모의고사 문제 풀이 기록
create table if not exists public.special_mock_exam_attempts (
  id text primary key,
  student_id integer not null check (student_id > 0),
  auth_user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  assessment_round smallint not null check (assessment_round = 2),
  mock_round smallint not null check (mock_round between 1 and 5),
  question_id text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard', 'extreme')),
  category text not null,
  question_type text not null check (
    question_type in ('multiple-choice', 'short-answer', 'essay')
  ),
  selected_answer smallint check (selected_answer between 0 and 3),
  response_text text,
  correct boolean not null,
  answered_at timestamptz not null default now()
);

create index if not exists special_mock_exam_attempts_student_answered_idx
  on public.special_mock_exam_attempts (student_id, answered_at desc);

create index if not exists special_mock_exam_attempts_auth_user_idx
  on public.special_mock_exam_attempts (auth_user_id);

alter table public.special_mock_exam_attempts enable row level security;

drop policy if exists special_mock_exam_attempts_select_self
  on public.special_mock_exam_attempts;
create policy special_mock_exam_attempts_select_self
  on public.special_mock_exam_attempts
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
          = special_mock_exam_attempts.student_id
    )
  );

drop policy if exists special_mock_exam_attempts_insert_self
  on public.special_mock_exam_attempts;
create policy special_mock_exam_attempts_insert_self
  on public.special_mock_exam_attempts
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
          = special_mock_exam_attempts.student_id
    )
  );

drop policy if exists special_mock_exam_attempts_delete_self
  on public.special_mock_exam_attempts;
create policy special_mock_exam_attempts_delete_self
  on public.special_mock_exam_attempts
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
          = special_mock_exam_attempts.student_id
    )
  );

revoke all on table public.special_mock_exam_attempts from anon, authenticated;
grant select, insert, delete on table public.special_mock_exam_attempts to authenticated;
grant select, insert, update, delete on table public.special_mock_exam_attempts to service_role;
