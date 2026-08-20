alter table public.ai_python_week_attempts
  drop constraint if exists ai_python_week_attempts_week_check;

alter table public.ai_python_week_attempts
  add constraint ai_python_week_attempts_week_check
  check (week in ('week1', 'week2', 'week3-1', 'week3-2', 'week4-1'));
