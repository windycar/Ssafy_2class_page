-- 웹 강의실 문제 풀이 기록을 저장하기 위해 SQL Editor에서 한 번 실행하세요.
create table if not exists public.web_study_attempts (
  id text primary key,
  student_id integer not null check (student_id > 0),
  auth_user_id uuid references auth.users(id) on delete set null default auth.uid(),
  question_id text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  category text not null check (
    category in ('html', 'css', 'bootstrap', 'semantic', 'responsive-grid', 'ux-ui')
  ),
  question_type text not null default 'multiple-choice' check (
    question_type in ('multiple-choice', 'short-answer', 'essay')
  ),
  selected_answer smallint check (selected_answer between 0 and 3),
  response_text text,
  correct boolean not null,
  answered_at timestamptz not null default now()
);

create index if not exists web_study_attempts_student_answered_idx
  on public.web_study_attempts (student_id, answered_at desc);

create index if not exists web_study_attempts_auth_user_idx
  on public.web_study_attempts (auth_user_id)
  where auth_user_id is not null;

alter table public.web_study_attempts enable row level security;

drop policy if exists "Class web study attempt read" on public.web_study_attempts;
create policy "Class web study attempt read"
  on public.web_study_attempts
  for select
  to anon, authenticated
  using (
    auth_user_id is null
    or (select auth.uid()) = auth_user_id
  );

drop policy if exists "Class web study attempt create" on public.web_study_attempts;
create policy "Class web study attempt create"
  on public.web_study_attempts
  for insert
  to anon, authenticated
  with check (
    student_id > 0
    and (
      auth_user_id is null
      or (select auth.uid()) = auth_user_id
    )
  );

drop policy if exists "Class web study attempt delete" on public.web_study_attempts;
create policy "Class web study attempt delete"
  on public.web_study_attempts
  for delete
  to anon, authenticated
  using (
    auth_user_id is null
    or (select auth.uid()) = auth_user_id
  );

grant select, insert, delete on public.web_study_attempts to anon, authenticated;
