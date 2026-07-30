-- 기존 Supabase 프로젝트에는 이 파일만 SQL Editor에서 한 번 실행하세요.
-- 문제 본문은 앱 코드에서 관리하고 사용자별 풀이 기록만 저장합니다.
create table if not exists public.study_attempts (
  id text primary key,
  student_id integer not null check (student_id > 0),
  auth_user_id uuid references auth.users(id) on delete set null default auth.uid(),
  question_id text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  category text not null check (
    category in ('operators', 'sequences', 'control', 'functions', 'structures', 'oop', 'exceptions')
  ),
  selected_answer smallint not null check (selected_answer between 0 and 3),
  correct boolean not null,
  answered_at timestamptz not null default now()
);

create index if not exists study_attempts_student_answered_idx
  on public.study_attempts (student_id, answered_at desc);

create index if not exists study_attempts_auth_user_idx
  on public.study_attempts (auth_user_id)
  where auth_user_id is not null;

alter table public.study_attempts enable row level security;

drop policy if exists "Class study attempt read" on public.study_attempts;
create policy "Class study attempt read"
  on public.study_attempts
  for select
  to anon, authenticated
  using (
    auth_user_id is null
    or (select auth.uid()) = auth_user_id
  );

drop policy if exists "Class study attempt create" on public.study_attempts;
create policy "Class study attempt create"
  on public.study_attempts
  for insert
  to anon, authenticated
  with check (
    student_id > 0
    and (
      auth_user_id is null
      or (select auth.uid()) = auth_user_id
    )
  );

grant select, insert on public.study_attempts to anon, authenticated;

