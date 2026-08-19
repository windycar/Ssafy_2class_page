-- Supabase SQL Editor에서 한 번 실행합니다.
create table if not exists public.gallery_photos (
  id text primary key,
  title text not null,
  description text not null default '',
  image_url text not null,
  storage_path text,
  batch_id text,
  taken_at date not null,
  uploaded_by text not null,
  category text not null check (category in ('class', 'project', 'event', 'lunch', 'dinner', 'etc')),
  likes integer not null default 0,
  liked_by jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.gallery_photos add column if not exists batch_id text;

create table if not exists public.gallery_comments (
  id text primary key,
  photo_id text not null references public.gallery_photos(id) on delete cascade,
  author text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.gallery_photos enable row level security;
alter table public.gallery_comments enable row level security;

drop policy if exists "Public gallery photos" on public.gallery_photos;
drop policy if exists "Public gallery photo read" on public.gallery_photos;
drop policy if exists "Public gallery photo create" on public.gallery_photos;
drop policy if exists "Public gallery photo update" on public.gallery_photos;
create policy "Public gallery photo read" on public.gallery_photos for select using (true);
create policy "Public gallery photo create" on public.gallery_photos for insert with check (true);
create policy "Public gallery photo update" on public.gallery_photos for update using (true) with check (true);

drop policy if exists "Public gallery comments" on public.gallery_comments;
create policy "Public gallery comments" on public.gallery_comments for all using (true) with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery-images', 'gallery-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

drop policy if exists "Public gallery image read" on storage.objects;
create policy "Public gallery image read" on storage.objects for select using (bucket_id = 'gallery-images');

drop policy if exists "Public gallery image upload" on storage.objects;
create policy "Public gallery image upload" on storage.objects for insert with check (bucket_id = 'gallery-images');

drop policy if exists "Public gallery image delete" on storage.objects;
create policy "Public gallery image delete" on storage.objects for delete using (bucket_id = 'gallery-images');

create table if not exists public.coffee_orders (
  id text primary key,
  title text not null,
  category text not null check (category in ('coffee', 'food', 'snack', 'goods', 'etc')),
  store_name text not null,
  store_link text not null default '',
  deadline timestamptz not null,
  min_order_amount integer not null default 0,
  delivery_fee integer not null default 0,
  notice text not null default '',
  account_bank text not null default '',
  account_number text not null default '',
  account_holder text not null default '',
  created_at timestamptz not null default now(),
  is_active boolean not null default true
);

create table if not exists public.coffee_order_items (
  id text primary key,
  order_id text not null references public.coffee_orders(id) on delete cascade,
  participant_name text not null,
  menu_name text not null,
  options text not null default '',
  quantity integer not null check (quantity > 0),
  price integer not null check (price > 0),
  note text not null default '',
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'ordered', 'received'))
);

alter table public.coffee_orders enable row level security;
alter table public.coffee_order_items enable row level security;

drop policy if exists "Public coffee orders" on public.coffee_orders;
create policy "Public coffee orders" on public.coffee_orders for all using (true) with check (true);

drop policy if exists "Public coffee items" on public.coffee_order_items;
create policy "Public coffee items" on public.coffee_order_items for all using (true) with check (true);

create table if not exists public.anonymous_posts (
  id text primary key,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.anonymous_posts enable row level security;
drop policy if exists "Public anonymous post read" on public.anonymous_posts;
create policy "Public anonymous post read" on public.anonymous_posts for select using (true);
drop policy if exists "Public anonymous post create" on public.anonymous_posts;
create policy "Public anonymous post create" on public.anonymous_posts for insert with check (true);

create table if not exists public.bang_rooms (
  id text primary key,
  room_data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bang_rooms enable row level security;
drop policy if exists "Public bang rooms" on public.bang_rooms;
create policy "Public bang rooms" on public.bang_rooms
  for all using (true) with check (true);

-- BANG waiting-room and in-game chat is stored separately from room_data.
-- This prevents concurrent room updates from overwriting chat messages.
create table if not exists public.bang_chat_messages (
  id text primary key,
  room_id text not null references public.bang_rooms(id) on delete cascade,
  student_id integer not null,
  name text not null check (char_length(name) between 1 and 50),
  message text not null check (char_length(message) between 1 and 200),
  created_at timestamptz not null default now()
);

create index if not exists bang_chat_messages_room_created_idx
  on public.bang_chat_messages (room_id, created_at desc);

alter table public.bang_chat_messages enable row level security;

drop policy if exists "Public bang chat read" on public.bang_chat_messages;
create policy "Public bang chat read"
  on public.bang_chat_messages
  for select
  using (true);

drop policy if exists "Public bang chat create" on public.bang_chat_messages;
create policy "Public bang chat create"
  on public.bang_chat_messages
  for insert
  with check (
    char_length(name) between 1 and 50
    and char_length(message) between 1 and 200
  );

grant select, insert on public.bang_chat_messages to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'bang_chat_messages'
  ) then
    alter publication supabase_realtime
      add table public.bang_chat_messages;
  end if;
end
$$;

-- Python 학습 문제는 앱 코드에서 관리하고, 사용자별 풀이 기록만 저장합니다.
-- auth_user_id는 이후 Supabase Auth를 붙일 때 기존 테이블을 그대로 강화할 수 있도록 준비한 열입니다.
create table if not exists public.study_attempts (
  id text primary key,
  student_id integer not null check (student_id > 0),
  auth_user_id uuid references auth.users(id) on delete set null default auth.uid(),
  question_id text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard', 'extreme')),
  category text not null check (
    category in ('operators', 'sequences', 'control', 'functions', 'structures', 'oop', 'exceptions')
  ),
  question_type text not null default 'multiple-choice' check (
    question_type in ('multiple-choice', 'short-answer', 'essay')
  ),
  selected_answer smallint check (selected_answer between 0 and 3),
  response_text text,
  correct boolean not null,
  answered_at timestamptz not null default now()
);

alter table public.study_attempts
  add column if not exists question_type text not null default 'multiple-choice';
alter table public.study_attempts
  add column if not exists response_text text;
alter table public.study_attempts
  alter column selected_answer drop not null;
alter table public.study_attempts
  drop constraint if exists study_attempts_question_type_check;
alter table public.study_attempts
  add constraint study_attempts_question_type_check
  check (question_type in ('multiple-choice', 'short-answer', 'essay'));

alter table public.study_attempts
  drop constraint if exists study_attempts_difficulty_check;
alter table public.study_attempts
  add constraint study_attempts_difficulty_check
  check (difficulty in ('easy', 'medium', 'hard', 'extreme'));

create index if not exists study_attempts_student_answered_idx
  on public.study_attempts (student_id, answered_at desc);

create index if not exists study_attempts_auth_user_idx
  on public.study_attempts (auth_user_id)
  where auth_user_id is not null;

alter table public.study_attempts enable row level security;

update public.study_attempts attempts
set auth_user_id = members.auth_user_id
from public.members members
where attempts.auth_user_id is null
  and members.auth_user_id is not null
  and coalesce(members.student_id::bigint, 900000000 + members.id)
    = attempts.student_id;

drop policy if exists "Class study attempt read" on public.study_attempts;
create policy "Class study attempt read"
  on public.study_attempts
  for select
  to authenticated
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

drop policy if exists "Class study attempt create" on public.study_attempts;
create policy "Class study attempt create"
  on public.study_attempts
  for insert
  to authenticated
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

drop policy if exists "Class study attempt update" on public.study_attempts;
create policy "Class study attempt update"
  on public.study_attempts
  for update
  to authenticated
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

drop policy if exists "Class study attempt delete" on public.study_attempts;
create policy "Class study attempt delete"
  on public.study_attempts
  for delete
  to authenticated
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

revoke all on table public.study_attempts from anon, authenticated;
grant select, insert, update, delete on table public.study_attempts to authenticated;
grant select, insert, update, delete on table public.study_attempts to service_role;

-- Web 학습 문제는 앱 코드에서 관리하고, 사용자별 풀이 기록만 저장합니다.
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

update public.web_study_attempts attempts
set auth_user_id = members.auth_user_id
from public.members members
where attempts.auth_user_id is null
  and members.auth_user_id is not null
  and coalesce(members.student_id::bigint, 900000000 + members.id)
    = attempts.student_id;

drop policy if exists "Class web study attempt read" on public.web_study_attempts;
create policy "Class web study attempt read"
  on public.web_study_attempts
  for select
  to authenticated
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

drop policy if exists "Class web study attempt create" on public.web_study_attempts;
create policy "Class web study attempt create"
  on public.web_study_attempts
  for insert
  to authenticated
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

drop policy if exists "Class web study attempt update" on public.web_study_attempts;
create policy "Class web study attempt update"
  on public.web_study_attempts
  for update
  to authenticated
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

drop policy if exists "Class web study attempt delete" on public.web_study_attempts;
create policy "Class web study attempt delete"
  on public.web_study_attempts
  for delete
  to authenticated
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

revoke all on table public.web_study_attempts from anon, authenticated;
grant select, insert, update, delete on table public.web_study_attempts to authenticated;
grant select, insert, update, delete on table public.web_study_attempts to service_role;
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
-- AI Python 번째별 문제 풀이 기록
create table if not exists public.ai_python_week_attempts (
  id text primary key,
  student_id integer not null check (student_id > 0),
  auth_user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  week text not null check (week in ('week1', 'week2', 'week3-1', 'week3-2')),
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

-- 특별 모의고사 문제 풀이 기록
alter table if exists public.members
  add column if not exists can_access_special_mock_exam boolean not null default false;

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
        and (m.role = 'admin' or m.can_access_special_mock_exam = true)
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
        and (m.role = 'admin' or m.can_access_special_mock_exam = true)
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
        and (m.role = 'admin' or m.can_access_special_mock_exam = true)
        and coalesce(m.student_id::bigint, 900000000 + m.id)
          = special_mock_exam_attempts.student_id
    )
  );

revoke all on table public.special_mock_exam_attempts from anon, authenticated;
grant select, insert, delete on table public.special_mock_exam_attempts to authenticated;
grant select, insert, update, delete on table public.special_mock_exam_attempts to service_role;

-- 회원 인증과 커뮤니티 소유권/RLS의 최신 스키마는
-- supabase/migrations/20260805_auth_community.sql 에서 관리합니다.
