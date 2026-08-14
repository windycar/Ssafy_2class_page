-- AI Python 3-1 문제 세트를 기존 인증·소유권 정책에 연결합니다.
alter table public.ai_python_week_attempts
  drop constraint if exists ai_python_week_attempts_week_check;

alter table public.ai_python_week_attempts
  add constraint ai_python_week_attempts_week_check
  check (week in ('week1', 'week2', 'week3-1'));
