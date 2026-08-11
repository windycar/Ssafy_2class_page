-- Attach legacy attempts to their matching authenticated member before
-- removing the anonymous/null-owner compatibility policies.
update public.study_attempts attempts
set auth_user_id = members.auth_user_id
from public.members members
where attempts.auth_user_id is null
  and members.auth_user_id is not null
  and coalesce(members.student_id::bigint, 900000000 + members.id)
    = attempts.student_id;

update public.web_study_attempts attempts
set auth_user_id = members.auth_user_id
from public.members members
where attempts.auth_user_id is null
  and members.auth_user_id is not null
  and coalesce(members.student_id::bigint, 900000000 + members.id)
    = attempts.student_id;

update public.ai_python_study_attempts attempts
set auth_user_id = members.auth_user_id
from public.members members
where attempts.auth_user_id is null
  and members.auth_user_id is not null
  and coalesce(members.student_id::bigint, 900000000 + members.id)
    = attempts.student_id;

drop policy if exists "Class study attempt read" on public.study_attempts;
drop policy if exists "Class study attempt create" on public.study_attempts;
drop policy if exists "Class study attempt update" on public.study_attempts;
drop policy if exists "Class study attempt delete" on public.study_attempts;

create policy "Class study attempt read"
  on public.study_attempts for select to authenticated
  using (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = study_attempts.student_id
    )
  );

create policy "Class study attempt create"
  on public.study_attempts for insert to authenticated
  with check (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = study_attempts.student_id
    )
  );

create policy "Class study attempt update"
  on public.study_attempts for update to authenticated
  using (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = study_attempts.student_id
    )
  )
  with check (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = study_attempts.student_id
    )
  );

create policy "Class study attempt delete"
  on public.study_attempts for delete to authenticated
  using (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = study_attempts.student_id
    )
  );

drop policy if exists "Class web study attempt read" on public.web_study_attempts;
drop policy if exists "Class web study attempt create" on public.web_study_attempts;
drop policy if exists "Class web study attempt update" on public.web_study_attempts;
drop policy if exists "Class web study attempt delete" on public.web_study_attempts;

create policy "Class web study attempt read"
  on public.web_study_attempts for select to authenticated
  using (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = web_study_attempts.student_id
    )
  );

create policy "Class web study attempt create"
  on public.web_study_attempts for insert to authenticated
  with check (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = web_study_attempts.student_id
    )
  );

create policy "Class web study attempt update"
  on public.web_study_attempts for update to authenticated
  using (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = web_study_attempts.student_id
    )
  )
  with check (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = web_study_attempts.student_id
    )
  );

create policy "Class web study attempt delete"
  on public.web_study_attempts for delete to authenticated
  using (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = web_study_attempts.student_id
    )
  );

drop policy if exists "Class AI Python study attempt read"
  on public.ai_python_study_attempts;
drop policy if exists "Class AI Python study attempt create"
  on public.ai_python_study_attempts;
drop policy if exists "Class AI Python study attempt update"
  on public.ai_python_study_attempts;
drop policy if exists "Class AI Python study attempt delete"
  on public.ai_python_study_attempts;

create policy "Class AI Python study attempt read"
  on public.ai_python_study_attempts for select to authenticated
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

create policy "Class AI Python study attempt create"
  on public.ai_python_study_attempts for insert to authenticated
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

create policy "Class AI Python study attempt update"
  on public.ai_python_study_attempts for update to authenticated
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

create policy "Class AI Python study attempt delete"
  on public.ai_python_study_attempts for delete to authenticated
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

drop policy if exists ai_python_week_attempts_update_self
  on public.ai_python_week_attempts;
create policy ai_python_week_attempts_update_self
  on public.ai_python_week_attempts for update to authenticated
  using (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = ai_python_week_attempts.student_id
    )
  )
  with check (
    (select auth.uid()) = auth_user_id
    and exists (
      select 1 from public.members members
      where members.auth_user_id = (select auth.uid())
        and members.is_active = true
        and coalesce(members.student_id::bigint, 900000000 + members.id)
          = ai_python_week_attempts.student_id
    )
  );

revoke all on table public.study_attempts from anon, authenticated;
revoke all on table public.web_study_attempts from anon, authenticated;
revoke all on table public.ai_python_study_attempts from anon, authenticated;

grant select, insert, update, delete on table public.study_attempts to authenticated;
grant select, insert, update, delete on table public.web_study_attempts to authenticated;
grant select, insert, update, delete on table public.ai_python_study_attempts to authenticated;
grant select, insert, update, delete on table public.ai_python_week_attempts to authenticated;

grant select, insert, update, delete on table public.study_attempts to service_role;
grant select, insert, update, delete on table public.web_study_attempts to service_role;
grant select, insert, update, delete on table public.ai_python_study_attempts to service_role;
