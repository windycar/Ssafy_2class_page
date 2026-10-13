-- 회식 투표: 관리자 개설, 인증된 활성 회원의 본인 응답, 날짜 조율.
create table public.dinner_polls (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 80),
  mode text not null check (mode in ('attendance', 'availability')),
  location text not null check (char_length(trim(location)) between 1 and 200),
  location_url text not null default '' check (location_url = '' or (location_url ~* '^https?://' and char_length(location_url) <= 1000)),
  event_date date,
  event_time time not null check (extract(second from event_time) = 0 and event_time < time '24:00'),
  date_start date,
  date_end date,
  deadline timestamptz,
  notice text not null default '' check (char_length(notice) <= 2000),
  is_closed boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dinner_poll_dates check (
    (mode = 'attendance' and event_date is not null and date_start is null and date_end is null)
    or (mode = 'availability' and event_date is null and date_start is not null and date_end is not null
      and date_end >= date_start and date_end - date_start < 60)
  ),
  constraint dinner_poll_deadline check (mode <> 'attendance' or deadline is null
    or deadline <= ((event_date + event_time) at time zone 'Asia/Seoul'))
);

create table public.dinner_responses (
  poll_id uuid not null references public.dinner_polls(id) on delete cascade,
  member_id bigint not null references public.members(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  participant_name text not null,
  status text not null check (status in ('attending', 'absent', 'late')),
  available_dates date[] not null default '{}',
  arrival_time time check (extract(second from arrival_time) = 0 and arrival_time < time '24:00'),
  note text not null default '' check (char_length(note) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (poll_id, member_id),
  unique (poll_id, user_id),
  check (status = 'late' or arrival_time is null),
  check (status <> 'absent' or cardinality(available_dates) = 0)
);

create index dinner_polls_created_at_idx on public.dinner_polls (created_at desc);
create index dinner_polls_created_by_idx on public.dinner_polls (created_by);
create index dinner_responses_member_id_idx on public.dinner_responses (member_id);
create index dinner_responses_user_id_idx on public.dinner_responses (user_id);

-- Invoker triggers preserve RLS; no privileged RPC or browser-supplied identity is trusted.
create function public.guard_dinner_poll() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.id::text, 27491));
  if not exists (select 1 from public.members m where m.auth_user_id = (select auth.uid())
    and m.is_active = true and m.role = 'admin') then
    raise exception '관리자만 회식 투표를 관리할 수 있습니다.';
  end if;
  if tg_op = 'INSERT' then
    new.created_by := (select auth.uid());
    new.created_at := now();
  else
    if new.id is distinct from old.id or new.created_by is distinct from old.created_by
      or new.created_at is distinct from old.created_at then
      raise exception '투표 작성자 정보는 변경할 수 없습니다.';
    end if;
    if (new.mode, new.event_date, new.event_time, new.date_start, new.date_end)
      is distinct from (old.mode, old.event_date, old.event_time, old.date_start, old.date_end)
      and exists (select 1 from public.dinner_responses r where r.poll_id = old.id) then
      raise exception '응답이 있는 투표의 일정은 변경할 수 없습니다. 새 투표를 만들어 주세요.';
    end if;
    if old.is_closed and not new.is_closed and
      ((new.deadline is not null and new.deadline <= clock_timestamp()) or
       (new.mode = 'attendance' and ((new.event_date + new.event_time) at time zone 'Asia/Seoul') <= clock_timestamp())) then
      raise exception '마감 시간 또는 회식 시작 시간이 지났습니다. 마감 시간을 수정하거나 새 투표를 만들어 주세요.';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create function public.guard_dinner_response() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare
  p public.dinner_polls;
  member_name text;
  target_poll uuid;
begin
  target_poll := case when tg_op = 'DELETE' then old.poll_id else new.poll_id end;
  -- Shared advisory key serializes schedule edits/closure and votes without requiring
  -- members to pass the admin-only UPDATE policy for a SELECT ... FOR SHARE.
  perform pg_advisory_xact_lock(hashtextextended(target_poll::text, 27491));
  select * into p from public.dinner_polls where id = target_poll;
  if not found or p.is_closed or (p.deadline is not null and p.deadline <= clock_timestamp())
    or (p.mode = 'attendance' and ((p.event_date + p.event_time) at time zone 'Asia/Seoul') <= clock_timestamp()) then
    raise exception '마감된 투표입니다.';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  if tg_op = 'UPDATE' and ((new.poll_id, new.member_id, new.user_id, new.created_at)
    is distinct from (old.poll_id, old.member_id, old.user_id, old.created_at)) then
    raise exception '응답 소유자는 변경할 수 없습니다.';
  end if;
  select m.name into member_name from public.members m where m.id = new.member_id
    and m.auth_user_id = (select auth.uid()) and m.auth_user_id = new.user_id and m.is_active = true;
  if not found then raise exception '본인 계정으로만 응답할 수 있습니다.'; end if;
  new.participant_name := member_name;
  new.note := trim(new.note);
  if new.status = 'absent' or p.mode = 'attendance' then
    if cardinality(new.available_dates) <> 0 then raise exception '이 응답에는 후보 날짜를 저장할 수 없습니다.'; end if;
  else
    if cardinality(new.available_dates) = 0 or cardinality(new.available_dates) > 60
      or exists (select 1 from unnest(new.available_dates) d where d is null or d < p.date_start or d > p.date_end) then
      raise exception '투표 범위 안에서 가능한 날짜를 하나 이상 선택해 주세요.';
    end if;
    new.available_dates := array(select distinct d from unnest(new.available_dates) d order by d);
  end if;
  if new.status = 'late' and new.arrival_time is not null and new.arrival_time <= p.event_time then
    raise exception '늦참 도착 시간은 회식 시작 이후로 입력해 주세요.';
  end if;
  if tg_op = 'INSERT' then new.created_at := now(); end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger dinner_polls_guard before insert or update on public.dinner_polls
for each row execute function public.guard_dinner_poll();
create trigger dinner_responses_guard before insert or update or delete on public.dinner_responses
for each row execute function public.guard_dinner_response();

revoke all on function public.guard_dinner_poll() from public, anon, authenticated;
revoke all on function public.guard_dinner_response() from public, anon, authenticated;

alter table public.dinner_polls enable row level security;
alter table public.dinner_responses enable row level security;
revoke all on table public.dinner_polls, public.dinner_responses from anon, authenticated;
grant select, insert, update on table public.dinner_polls to authenticated;
grant select, insert, update, delete on table public.dinner_responses to authenticated;
grant all on table public.dinner_polls, public.dinner_responses to service_role;

create policy dinner_polls_read_members on public.dinner_polls for select to authenticated
using (exists (select 1 from public.members m where m.auth_user_id = (select auth.uid()) and m.is_active = true));
create policy dinner_polls_insert_admin on public.dinner_polls for insert to authenticated
with check (created_by = (select auth.uid()) and exists (select 1 from public.members m
  where m.auth_user_id = (select auth.uid()) and m.is_active = true and m.role = 'admin'));
create policy dinner_polls_update_admin on public.dinner_polls for update to authenticated
using (exists (select 1 from public.members m where m.auth_user_id = (select auth.uid()) and m.is_active = true and m.role = 'admin'))
with check (exists (select 1 from public.members m where m.auth_user_id = (select auth.uid()) and m.is_active = true and m.role = 'admin'));

create policy dinner_responses_read_members on public.dinner_responses for select to authenticated
using (exists (select 1 from public.members m where m.auth_user_id = (select auth.uid()) and m.is_active = true));
create policy dinner_responses_insert_self on public.dinner_responses for insert to authenticated
with check (user_id = (select auth.uid()) and exists (select 1 from public.members m
  where m.id = member_id and m.auth_user_id = (select auth.uid()) and m.is_active = true));
create policy dinner_responses_update_self on public.dinner_responses for update to authenticated
using (user_id = (select auth.uid()) and exists (select 1 from public.members m
  where m.id = member_id and m.auth_user_id = (select auth.uid()) and m.is_active = true))
with check (user_id = (select auth.uid()) and exists (select 1 from public.members m
  where m.id = member_id and m.auth_user_id = (select auth.uid()) and m.is_active = true));
create policy dinner_responses_delete_self on public.dinner_responses for delete to authenticated
using (user_id = (select auth.uid()) and exists (select 1 from public.members m
  where m.id = member_id and m.auth_user_id = (select auth.uid()) and m.is_active = true));
