alter table public.special_mock_exam_attempts
  drop constraint if exists special_mock_exam_attempts_assessment_round_check;

alter table public.special_mock_exam_attempts
  add constraint special_mock_exam_attempts_assessment_round_check
  check (assessment_round in (2, 3, 5));

drop policy if exists special_mock_exam_attempts_select_self
  on public.special_mock_exam_attempts;
create policy special_mock_exam_attempts_select_self
  on public.special_mock_exam_attempts
  for select
  to authenticated
  using (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members m
      where m.auth_user_id = (select auth.uid())
        and m.is_active = true
        and (m.role = 'admin' or m.can_access_special_mock_exam = true)
        and m.student_id::bigint = special_mock_exam_attempts.student_id
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
      select 1 from public.members m
      where m.auth_user_id = (select auth.uid())
        and m.is_active = true
        and (m.role = 'admin' or m.can_access_special_mock_exam = true)
        and m.student_id::bigint = special_mock_exam_attempts.student_id
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
      select 1 from public.members m
      where m.auth_user_id = (select auth.uid())
        and m.is_active = true
        and (m.role = 'admin' or m.can_access_special_mock_exam = true)
        and m.student_id::bigint = special_mock_exam_attempts.student_id
    )
  );
