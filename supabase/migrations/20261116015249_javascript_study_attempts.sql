create table public.javascript_study_attempts (
 id text primary key,
 student_id integer not null,
 auth_user_id uuid not null default auth.uid() references auth.users(id),
 question_id text not null,
 category text not null check (category in ('basics','functions','objects','dom','events')),
 selected_answer smallint not null check (selected_answer between 0 and 3),
 correct boolean not null,
 answered_at timestamptz not null
);
create index javascript_study_attempts_student_time_idx on public.javascript_study_attempts(student_id, answered_at desc);
alter table public.javascript_study_attempts enable row level security;
revoke all on public.javascript_study_attempts from anon;
grant select, insert, update, delete on public.javascript_study_attempts to authenticated;
create policy "JavaScript attempts owned by active member"
on public.javascript_study_attempts for all to authenticated
using (auth_user_id = (select auth.uid()) and exists (
 select 1 from public.members m where m.auth_user_id = (select auth.uid())
 and m.student_id = javascript_study_attempts.student_id and m.is_active = true))
with check (auth_user_id = (select auth.uid()) and exists (
 select 1 from public.members m where m.auth_user_id = (select auth.uid())
 and m.student_id = javascript_study_attempts.student_id and m.is_active = true));
