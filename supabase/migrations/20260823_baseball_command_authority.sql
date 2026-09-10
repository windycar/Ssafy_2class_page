-- Baseball V2 authority boundary:
--   1. legacy Bang browser writes remain available only for bang-* rows;
--   2. baseball-* room writes are service-only, serialized, CAS-protected,
--      and idempotent;
--   3. gameplay commands preserve the immutable match context;
--   4. private Realtime topics are authorized from canonical room membership.

alter table public.bang_rooms enable row level security;

drop policy if exists "Public bang rooms" on public.bang_rooms;
drop policy if exists "Legacy Bang rooms are readable" on public.bang_rooms;
drop policy if exists "Legacy Bang rooms are insertable" on public.bang_rooms;
drop policy if exists "Legacy Bang rooms are updatable" on public.bang_rooms;
drop policy if exists "Legacy Bang rooms are deletable" on public.bang_rooms;
drop policy if exists "Active members can read visible baseball rooms" on public.bang_rooms;

revoke all privileges on table public.bang_rooms from public, anon, authenticated;
grant select, insert, update, delete on table public.bang_rooms to anon, authenticated;

create policy "Legacy Bang rooms are readable"
on public.bang_rooms
for select
to anon, authenticated
using (id like 'bang-%');

create policy "Legacy Bang rooms are insertable"
on public.bang_rooms
for insert
to anon, authenticated
with check (
  id like 'bang-%'
  and jsonb_typeof(room_data) = 'object'
  and (room_data ->> 'id') = id
  and (room_data ->> 'id') like 'bang-%'
);

create policy "Legacy Bang rooms are updatable"
on public.bang_rooms
for update
to anon, authenticated
using (id like 'bang-%')
with check (
  id like 'bang-%'
  and jsonb_typeof(room_data) = 'object'
  and (room_data ->> 'id') = id
  and (room_data ->> 'id') like 'bang-%'
);

create policy "Legacy Bang rooms are deletable"
on public.bang_rooms
for delete
to anon, authenticated
using (id like 'bang-%');

create policy "Active members can read visible baseball rooms"
on public.bang_rooms
for select
to authenticated
using (
  id like 'baseball-%'
  and jsonb_typeof(room_data) = 'object'
  and (room_data ->> 'schemaVersion') = '2'
  and exists (
    select 1
    from public.members as member
    where member.auth_user_id = (select auth.uid())
      and member.is_active = true
      and (
        (room_data ->> 'isPublic') = 'true'
        or exists (
          select 1
          from jsonb_array_elements(
            case
              when jsonb_typeof(room_data -> 'players') = 'array'
                then room_data -> 'players'
              else '[]'::jsonb
            end
          ) as player(value)
          where (player.value ->> 'authId') = member.auth_user_id::text
            and (player.value ->> 'studentId') = coalesce(
              member.student_id::bigint,
              900000000::bigint + member.id::bigint
            )::text
        )
      )
  )
);

-- Table grants are global while policies are row-scoped. Explicitly removing
-- these elevated privileges keeps browser roles from bypassing the intended DML.
revoke truncate, references, trigger
on table public.bang_rooms
from public, anon, authenticated;

create table if not exists public.baseball_room_command_log (
  actor_auth_id uuid not null references auth.users(id) on delete restrict,
  command_id text not null check (length(command_id) between 8 and 128),
  actor_student_id bigint not null check (actor_student_id > 0),
  room_id text not null check (room_id like 'baseball-%'),
  kind text not null check (
    kind in ('CREATE', 'JOIN', 'SET_READY', 'HEARTBEAT', 'START', 'LEAVE', 'CANCEL')
  ),
  expected_revision bigint check (expected_revision is null or expected_revision >= 0),
  committed_revision bigint not null check (committed_revision >= 0),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  result_room_data jsonb,
  deleted boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (actor_auth_id, command_id),
  check ((kind = 'CREATE') = (expected_revision is null)),
  check ((deleted and result_room_data is null) or (not deleted and result_room_data is not null))
);

create index if not exists baseball_room_command_log_room_created_idx
  on public.baseball_room_command_log (room_id, created_at desc);

alter table public.baseball_room_command_log enable row level security;
revoke all on table public.baseball_room_command_log from public, anon, authenticated;
grant select, insert on table public.baseball_room_command_log to service_role;

create or replace function public.commit_baseball_room_command(
  p_command_id text,
  p_kind text,
  p_room_id text,
  p_expected_revision bigint,
  p_payload jsonb,
  p_next_room jsonb,
  p_delete_room boolean,
  p_actor_auth_id uuid,
  p_actor_student_id bigint
)
returns table (
  outcome text,
  room_data jsonb,
  deleted boolean,
  room_revision bigint,
  committed_command_id text
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_room jsonb;
  v_existing public.baseball_room_command_log%rowtype;
  v_room_exists boolean := false;
  v_current_revision bigint;
  v_actor_player jsonb;
  v_old_player_count integer;
  v_next_player_count integer;
  v_retained_old_player_count integer;
  v_matched_active_players integer;
begin
  if p_actor_auth_id is null
    or p_actor_student_id <= 0
    or p_command_id is null
    or length(p_command_id) not between 8 and 128
    or p_room_id is null
    or p_room_id not like 'baseball-%'
    or p_kind not in ('CREATE', 'JOIN', 'SET_READY', 'HEARTBEAT', 'START', 'LEAVE', 'CANCEL')
    or jsonb_typeof(p_payload) <> 'object'
    or (p_payload ->> 'schemaVersion') is distinct from '1'
    or (p_payload ->> 'commandId') is distinct from p_command_id
    or (p_payload ->> 'kind') is distinct from p_kind
    or jsonb_typeof(p_payload -> 'payload') <> 'object'
    or coalesce(p_payload #>> '{payload,sessionId}', '') = ''
  then
    raise exception using
      errcode = '22023',
      message = 'invalid canonical baseball room command';
  end if;

  if p_kind = 'CREATE' then
    if p_expected_revision is not null
      or p_payload ? 'roomId'
      or p_payload ? 'expectedRevision'
    then
      raise exception using errcode = '22023', message = 'invalid create room command';
    end if;
  elsif p_expected_revision is null
    or p_expected_revision < 0
    or (p_payload ->> 'roomId') is distinct from p_room_id
    or (p_payload ->> 'expectedRevision') is distinct from p_expected_revision::text
  then
    raise exception using errcode = '22023', message = 'invalid revision room command';
  end if;

  -- Close the auth-to-commit race: the service authenticated this identity just
  -- before the RPC, but deactivation or profile reassignment must take effect in
  -- the same transaction that commits the room transition.
  perform 1
    from public.members as member
    where member.auth_user_id = p_actor_auth_id
      and member.is_active = true
      and coalesce(
        member.student_id::bigint,
        900000000::bigint + member.id::bigint
      ) = p_actor_student_id
    for share;
  if not found then
    return query select
      'ACTOR_NOT_ACTIVE'::text,
      null::jsonb,
      false,
      null::bigint,
      null::text;
    return;
  end if;

  -- The actor/command lock makes CREATE idempotent even though its room id is
  -- generated server-side and may differ on a network retry.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_actor_auth_id::text || ':' || p_command_id, 0)
  );

  select logs.*
    into v_existing
  from public.baseball_room_command_log as logs
  where logs.actor_auth_id = p_actor_auth_id
    and logs.command_id = p_command_id;

  if found then
    select rooms.room_data
      into v_room
    from public.bang_rooms as rooms
    where rooms.id = v_existing.room_id;
    v_room_exists := found;

    if v_existing.actor_student_id = p_actor_student_id
      and v_existing.kind = p_kind
      and v_existing.payload = p_payload
    then
      return query select
        case
          when v_existing.kind = 'CREATE' and not v_room_exists
            then 'IDEMPOTENT_GONE'::text
          else 'IDEMPOTENT'::text
        end,
        case when v_room_exists then v_room else null::jsonb end,
        not v_room_exists,
        case
          when v_room_exists and coalesce(v_room ->> 'revision', '') ~ '^\d+$'
            then (v_room ->> 'revision')::bigint
          else v_existing.committed_revision
        end,
        v_existing.command_id;
    else
      return query select
        'COMMAND_CONFLICT'::text,
        case when v_room_exists then v_room else null::jsonb end,
        not v_room_exists,
        case
          when v_room_exists and coalesce(v_room ->> 'revision', '') ~ '^\d+$'
            then (v_room ->> 'revision')::bigint
          else v_existing.committed_revision
        end,
        v_existing.command_id;
    end if;
    return;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('baseball-room:' || p_room_id, 0)
  );

  if p_kind = 'CREATE' then
    if p_delete_room
      or jsonb_typeof(p_next_room) <> 'object'
      or (p_next_room ->> 'schemaVersion') is distinct from '2'
      or (p_next_room ->> 'id') is distinct from p_room_id
      or (p_next_room ->> 'revision') is distinct from '0'
      or (p_next_room ->> 'status') is distinct from 'recruiting'
      or (p_next_room ->> 'hostStudentId') is distinct from p_actor_student_id::text
      or (p_next_room ->> 'maxPlayers') is distinct from '2'
      or jsonb_array_length(p_next_room -> 'players') <> 1
      or (p_next_room #>> '{players,0,authId}') is distinct from p_actor_auth_id::text
      or (p_next_room #>> '{players,0,studentId}') is distinct from p_actor_student_id::text
      or (p_next_room #>> '{players,0,isHost}') is distinct from 'true'
      or p_next_room ? 'matchId'
      or p_next_room ? 'gameState'
    then
      raise exception using errcode = '22023', message = 'invalid canonical create transition';
    end if;

    if exists (select 1 from public.bang_rooms as rooms where rooms.id = p_room_id) then
      return query select
        'CONTEXT_MISMATCH'::text,
        null::jsonb,
        false,
        null::bigint,
        null::text;
      return;
    end if;

    insert into public.bang_rooms (id, room_data, updated_at)
    values (p_room_id, p_next_room, pg_catalog.now());

    insert into public.baseball_room_command_log (
      actor_auth_id,
      command_id,
      actor_student_id,
      room_id,
      kind,
      expected_revision,
      committed_revision,
      payload,
      result_room_data,
      deleted
    ) values (
      p_actor_auth_id,
      p_command_id,
      p_actor_student_id,
      p_room_id,
      p_kind,
      null,
      0,
      p_payload,
      p_next_room,
      false
    );

    return query select
      'COMMITTED'::text,
      p_next_room,
      false,
      0::bigint,
      p_command_id;
    return;
  end if;

  select rooms.room_data
    into v_room
  from public.bang_rooms as rooms
  where rooms.id = p_room_id
  for update;
  v_room_exists := found;

  if not v_room_exists then
    return query select
      'ROOM_NOT_FOUND'::text,
      null::jsonb,
      true,
      null::bigint,
      null::text;
    return;
  end if;

  if jsonb_typeof(v_room) <> 'object'
    or (v_room ->> 'id') is distinct from p_room_id
    or (v_room ->> 'schemaVersion') is distinct from '2'
    or coalesce(v_room ->> 'revision', '') !~ '^\d+$'
  then
    return query select
      'CONTEXT_MISMATCH'::text,
      v_room,
      false,
      null::bigint,
      null::text;
    return;
  end if;
  v_current_revision := (v_room ->> 'revision')::bigint;

  select player.value
    into v_actor_player
  from jsonb_array_elements(
    case
      when jsonb_typeof(v_room -> 'players') = 'array' then v_room -> 'players'
      else '[]'::jsonb
    end
  ) as player(value)
  where (player.value ->> 'authId') = p_actor_auth_id::text
    and (player.value ->> 'studentId') = p_actor_student_id::text;

  if p_kind = 'JOIN' then
    if v_actor_player is not null
      or (v_room ->> 'status') not in ('recruiting', 'ready', 'full')
      or jsonb_array_length(v_room -> 'players') not in (1, 2)
    then
      return query select
        'CONTEXT_MISMATCH'::text,
        v_room,
        false,
        v_current_revision,
        null::text;
      return;
    end if;
  elsif v_actor_player is null then
    return query select
      'CONTEXT_MISMATCH'::text,
      v_room,
      false,
      v_current_revision,
      null::text;
    return;
  end if;

  -- Authorize the actor before returning a stale canonical room. JOIN is the
  -- only capability-addressed operation allowed to discover a private invite
  -- room by id; exact retries were already resolved from the actor-scoped log.
  if v_current_revision <> p_expected_revision then
    return query select
      'STALE'::text,
      v_room,
      false,
      v_current_revision,
      null::text;
    return;
  end if;

  if p_kind not in ('JOIN', 'HEARTBEAT')
    and not (
      p_kind = 'LEAVE'
      and (v_room ->> 'status') in ('playing', 'finished', 'cancelled')
    )
    and (v_actor_player ->> 'sessionId') is distinct from (p_payload #>> '{payload,sessionId}')
  then
    return query select
      'CONTEXT_MISMATCH'::text,
      v_room,
      false,
      v_current_revision,
      null::text;
    return;
  end if;

  if p_delete_room then
    if p_kind <> 'LEAVE'
      or p_next_room is not null
      or jsonb_array_length(v_room -> 'players') <> 1
    then
      raise exception using errcode = '22023', message = 'invalid canonical delete transition';
    end if;
  elsif jsonb_typeof(p_next_room) <> 'object'
    or (p_next_room ->> 'id') is distinct from p_room_id
    or (p_next_room ->> 'schemaVersion') is distinct from '2'
    or (p_next_room ->> 'revision') is distinct from (p_expected_revision + 1)::text
    or (p_next_room ->> 'title') is distinct from (v_room ->> 'title')
    or (p_next_room ->> 'description') is distinct from (v_room ->> 'description')
    or (p_next_room ->> 'maxPlayers') is distinct from '2'
    or (p_next_room ->> 'isPublic') is distinct from (v_room ->> 'isPublic')
    or (p_next_room ->> 'createdAt') is distinct from (v_room ->> 'createdAt')
  then
    raise exception using errcode = '22023', message = 'invalid canonical room transition';
  end if;

  if not p_delete_room then
    v_old_player_count := jsonb_array_length(v_room -> 'players');
    v_next_player_count := jsonb_array_length(p_next_room -> 'players');

    if p_kind = 'JOIN' then
      select count(*)
        into v_retained_old_player_count
      from jsonb_array_elements(v_room -> 'players') as old_player(value)
      where exists (
        select 1
        from jsonb_array_elements(p_next_room -> 'players') as next_player(value)
        where (next_player.value ->> 'seat') = (old_player.value ->> 'seat')
          and (next_player.value ->> 'authId') = (old_player.value ->> 'authId')
          and (next_player.value ->> 'studentId') = (old_player.value ->> 'studentId')
          and (next_player.value ->> 'joinedAt') = (old_player.value ->> 'joinedAt')
      );

      -- The API evaluates staleness shortly before this transaction. A player
      -- may cross the 120s boundary in between, so DB time must not require that
      -- every newly-stale player be reaped. It does require that every removed
      -- old player is stale and that the actor is the sole new identity.
      if v_next_player_count <> v_retained_old_player_count + 1
        or v_next_player_count not in (1, 2)
        or (p_next_room ->> 'status') is distinct from (
          case when v_next_player_count = 2 then 'ready' else 'recruiting' end
        )
        or not exists (
          select 1
          from jsonb_array_elements(p_next_room -> 'players') as player(value)
          where (player.value ->> 'authId') = p_actor_auth_id::text
            and (player.value ->> 'studentId') = p_actor_student_id::text
        )
        or exists (
          select 1
          from jsonb_array_elements(v_room -> 'players') as old_player(value)
          where not exists (
            select 1
            from jsonb_array_elements(p_next_room -> 'players') as next_player(value)
            where (next_player.value ->> 'seat') = (old_player.value ->> 'seat')
              and (next_player.value ->> 'authId') = (old_player.value ->> 'authId')
              and (next_player.value ->> 'studentId') = (old_player.value ->> 'studentId')
              and (next_player.value ->> 'joinedAt') = (old_player.value ->> 'joinedAt')
          )
          and (
            coalesce(
              old_player.value ->> 'lastSeenAt',
              old_player.value ->> 'joinedAt',
              ''
            ) = ''
            or coalesce(
              old_player.value ->> 'lastSeenAt',
              old_player.value ->> 'joinedAt'
            )::timestamptz > pg_catalog.now() - interval '120 seconds'
          )
        )
        or (
          select count(*)
          from jsonb_array_elements(p_next_room -> 'players') as next_player(value)
          where (next_player.value ->> 'isHost') = 'true'
            and (next_player.value ->> 'studentId') = (p_next_room ->> 'hostStudentId')
        ) <> 1
      then
        raise exception using errcode = '22023', message = 'invalid canonical join transition';
      end if;
    elsif p_kind in ('SET_READY', 'START', 'CANCEL') then
      if v_next_player_count <> v_old_player_count
        or exists (
          select 1
          from jsonb_array_elements(v_room -> 'players') as old_player(value)
          where not exists (
            select 1
            from jsonb_array_elements(p_next_room -> 'players') as next_player(value)
            where (next_player.value ->> 'seat') = (old_player.value ->> 'seat')
              and (next_player.value ->> 'authId') = (old_player.value ->> 'authId')
              and (next_player.value ->> 'studentId') = (old_player.value ->> 'studentId')
              and (next_player.value ->> 'joinedAt') = (old_player.value ->> 'joinedAt')
          )
        )
        or (p_next_room ->> 'hostStudentId') is distinct from (v_room ->> 'hostStudentId')
      then
        raise exception using errcode = '22023', message = 'invalid canonical player transition';
      end if;
    elsif p_kind = 'HEARTBEAT' then
      if (v_room ->> 'status') not in ('recruiting', 'ready', 'full')
        or v_next_player_count not in (v_old_player_count, v_old_player_count - 1)
        or not exists (
          select 1
          from jsonb_array_elements(p_next_room -> 'players') as next_player(value)
          where (next_player.value ->> 'authId') = p_actor_auth_id::text
            and (next_player.value ->> 'studentId') = p_actor_student_id::text
            and (next_player.value ->> 'sessionId') = (p_payload #>> '{payload,sessionId}')
        )
      then
        raise exception using errcode = '22023', message = 'invalid canonical heartbeat transition';
      end if;

      if v_next_player_count = v_old_player_count then
        if (p_next_room ->> 'hostStudentId') is distinct from (v_room ->> 'hostStudentId')
          or exists (
            select 1
            from jsonb_array_elements(v_room -> 'players') as old_player(value)
            where not exists (
              select 1
              from jsonb_array_elements(p_next_room -> 'players') as next_player(value)
              where (next_player.value ->> 'seat') = (old_player.value ->> 'seat')
                and (next_player.value ->> 'authId') = (old_player.value ->> 'authId')
                and (next_player.value ->> 'studentId') = (old_player.value ->> 'studentId')
                and (next_player.value ->> 'joinedAt') = (old_player.value ->> 'joinedAt')
            )
          )
        then
          raise exception using errcode = '22023', message = 'invalid canonical heartbeat identity transition';
        end if;
      elsif (v_room ->> 'status') not in ('recruiting', 'ready', 'full')
        or v_old_player_count <> 2
        or v_next_player_count <> 1
        or (p_next_room ->> 'status') is distinct from 'recruiting'
        or (p_next_room ->> 'hostStudentId') is distinct from p_actor_student_id::text
        or not exists (
          select 1
          from jsonb_array_elements(v_room -> 'players') as old_player(value)
          where (old_player.value ->> 'authId') <> p_actor_auth_id::text
            and coalesce(
              old_player.value ->> 'lastSeenAt',
              old_player.value ->> 'joinedAt',
              ''
            ) <> ''
            and coalesce(
              old_player.value ->> 'lastSeenAt',
              old_player.value ->> 'joinedAt'
            )::timestamptz
              <= pg_catalog.now() - interval '120 seconds'
        )
      then
        raise exception using errcode = '22023', message = 'invalid stale waiting player reap';
      end if;
    elsif p_kind = 'LEAVE' then
      if v_next_player_count <> v_old_player_count - 1
        or exists (
          select 1
          from jsonb_array_elements(p_next_room -> 'players') as next_player(value)
          where (next_player.value ->> 'authId') = p_actor_auth_id::text
            or (next_player.value ->> 'studentId') = p_actor_student_id::text
        )
        or not exists (
          select 1
          from jsonb_array_elements(p_next_room -> 'players') as next_player(value)
          where (next_player.value ->> 'studentId') = (p_next_room ->> 'hostStudentId')
            and (next_player.value ->> 'isHost') = 'true'
        )
        or (
          (v_room ->> 'status') = 'playing'
          and (p_next_room ->> 'status') is distinct from 'cancelled'
        )
      then
        raise exception using errcode = '22023', message = 'invalid canonical leave transition';
      end if;
    end if;
  end if;

  if p_kind = 'START' then
    if (v_room ->> 'hostStudentId') is distinct from p_actor_student_id::text
      or (v_actor_player ->> 'isHost') is distinct from 'true'
      or (v_room ->> 'status') not in ('ready', 'full')
      or jsonb_array_length(v_room -> 'players') <> 2
      or exists (
        select 1
        from jsonb_array_elements(v_room -> 'players') as player(value)
        where (player.value ->> 'isReady') is distinct from 'true'
      )
    then
      return query select
        'PLAYERS_NOT_READY'::text,
        v_room,
        false,
        v_current_revision,
        null::text;
      return;
    end if;

    -- Hold both active member profiles stable until START commits so a
    -- concurrent deactivation cannot create a match with an inactive seat.
    perform member.id
    from public.members as member
    where member.is_active = true
      and exists (
        select 1
        from jsonb_array_elements(v_room -> 'players') as player(value)
        where member.auth_user_id::text = (player.value ->> 'authId')
          and coalesce(member.student_id::bigint, 900000000::bigint + member.id::bigint)
            = (player.value ->> 'studentId')::bigint
      )
    for share;

    select count(*)
      into v_matched_active_players
    from jsonb_array_elements(v_room -> 'players') as player(value)
    where exists (
      select 1
      from public.members as member
      where member.auth_user_id::text = (player.value ->> 'authId')
        and member.is_active = true
        and coalesce(member.student_id::bigint, 900000000::bigint + member.id::bigint)
          = (player.value ->> 'studentId')::bigint
    );
    if v_matched_active_players <> 2 then
      return query select
        'ACTIVE_PLAYERS_REQUIRED'::text,
        v_room,
        false,
        v_current_revision,
        null::text;
      return;
    end if;

    if exists (
      select 1
      from jsonb_array_elements(v_room -> 'players') as player(value)
      where coalesce(player.value ->> 'sessionId', '') = ''
        or coalesce(player.value ->> 'lastSeenAt', '') = ''
        or (player.value ->> 'lastSeenAt')::timestamptz
          < pg_catalog.now() - interval '45 seconds'
        or (player.value ->> 'lastSeenAt')::timestamptz
          > pg_catalog.now() + interval '5 seconds'
    ) then
      return query select
        'PLAYERS_NOT_CONNECTED'::text,
        v_room,
        false,
        v_current_revision,
        null::text;
      return;
    end if;

    if p_delete_room
      or (p_next_room ->> 'status') is distinct from 'playing'
      or coalesce(p_next_room ->> 'matchId', '') = ''
      or (p_next_room #>> '{gameState,status}') is distinct from 'playing'
      or coalesce(p_next_room #>> '{gameState,seed}', '') !~ '^\d+$'
      or (p_next_room #>> '{gameState,seed}')::bigint not between 0 and 4294967295
      or coalesce(p_next_room ->> 'startedAt', '') = ''
    then
      raise exception using errcode = '22023', message = 'invalid canonical start transition';
    end if;
  elsif p_kind = 'CANCEL' then
    if (v_room ->> 'hostStudentId') is distinct from p_actor_student_id::text
      or (v_actor_player ->> 'isHost') is distinct from 'true'
      or (p_next_room ->> 'status') is distinct from 'cancelled'
      or coalesce(p_next_room ->> 'finishedAt', '') = ''
    then
      raise exception using errcode = '22023', message = 'invalid canonical cancel transition';
    end if;
  end if;

  if p_delete_room then
    delete from public.bang_rooms as rooms where rooms.id = p_room_id;
  else
    update public.bang_rooms as rooms
    set room_data = p_next_room,
        updated_at = pg_catalog.now()
    where rooms.id = p_room_id;
  end if;

  insert into public.baseball_room_command_log (
    actor_auth_id,
    command_id,
    actor_student_id,
    room_id,
    kind,
    expected_revision,
    committed_revision,
    payload,
    result_room_data,
    deleted
  ) values (
    p_actor_auth_id,
    p_command_id,
    p_actor_student_id,
    p_room_id,
    p_kind,
    p_expected_revision,
    p_expected_revision + 1,
    p_payload,
    case when p_delete_room then null else p_next_room end,
    p_delete_room
  );

  return query select
    'COMMITTED'::text,
    case when p_delete_room then null::jsonb else p_next_room end,
    p_delete_room,
    p_expected_revision + 1,
    p_command_id;
end;
$$;

revoke execute on function public.commit_baseball_room_command(
  text, text, text, bigint, jsonb, jsonb, boolean, uuid, bigint
) from public, anon, authenticated;
grant execute on function public.commit_baseball_room_command(
  text, text, text, bigint, jsonb, jsonb, boolean, uuid, bigint
) to service_role;

create table if not exists public.baseball_command_log (
  room_id text not null references public.bang_rooms(id) on delete cascade,
  match_id text not null,
  command_id text not null,
  command_sequence bigint not null check (command_sequence > 0),
  base_room_revision bigint not null check (base_room_revision >= 0),
  base_game_revision bigint not null check (base_game_revision >= 0),
  committed_room_revision bigint not null check (
    committed_room_revision = base_room_revision + 1
  ),
  committed_game_revision bigint not null check (
    committed_game_revision = base_game_revision + 1
  ),
  seed bigint not null check (seed between 0 and 4294967295),
  kind text not null check (kind in ('START_PITCH', 'BATTER_ACTION')),
  actor_auth_id uuid not null references auth.users(id) on delete restrict,
  actor_student_id bigint not null check (actor_student_id > 0),
  actor_seat smallint not null check (actor_seat in (0, 1)),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  created_at timestamptz not null default now(),
  primary key (room_id, command_id),
  unique (room_id, match_id, command_sequence)
);

create index if not exists baseball_command_log_match_created_idx
  on public.baseball_command_log (room_id, match_id, created_at desc);

alter table public.baseball_command_log enable row level security;
revoke all on table public.baseball_command_log from public, anon, authenticated;
grant select, insert on table public.baseball_command_log to service_role;

create or replace function public.commit_baseball_command(
  p_room_id text,
  p_match_id text,
  p_command_id text,
  p_command_sequence bigint,
  p_base_room_revision bigint,
  p_base_game_revision bigint,
  p_seed bigint,
  p_kind text,
  p_payload jsonb,
  p_next_room jsonb,
  p_actor_auth_id uuid,
  p_actor_student_id bigint,
  p_actor_seat smallint
)
returns table (
  outcome text,
  room_data jsonb,
  room_revision bigint,
  game_revision bigint,
  committed_command_sequence bigint,
  committed_command_id text
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_room jsonb;
  v_existing public.baseball_command_log%rowtype;
  v_last_sequence bigint;
  v_required_seat smallint;
  v_current_room_revision bigint;
  v_current_game_revision bigint;
begin
  -- Recheck the canonical member identity inside the commit transaction. This
  -- prevents a deactivated/reassigned profile from winning a race after the API
  -- has authenticated it but before the authoritative write is serialized.
  perform 1
    from public.members as member
    where member.auth_user_id = p_actor_auth_id
      and member.is_active = true
      and coalesce(
        member.student_id::bigint,
        900000000::bigint + member.id::bigint
      ) = p_actor_student_id
    for share;
  if not found then
    return query select
      'ACTOR_NOT_ACTIVE'::text,
      null::jsonb,
      null::bigint,
      null::bigint,
      null::bigint,
      null::text;
    return;
  end if;

  select rooms.room_data
    into v_room
  from public.bang_rooms as rooms
  where rooms.id = p_room_id
  for update;

  if not found then
    return query select
      'ROOM_NOT_FOUND'::text,
      null::jsonb,
      null::bigint,
      null::bigint,
      null::bigint,
      null::text;
    return;
  end if;

  -- commandId is checked before CAS so a network retry remains idempotent.
  select logs.*
    into v_existing
  from public.baseball_command_log as logs
  where logs.room_id = p_room_id
    and logs.command_id = p_command_id;

  if found then
    if v_existing.match_id = p_match_id
      and v_existing.command_sequence = p_command_sequence
      and v_existing.payload = p_payload
      and v_existing.actor_auth_id = p_actor_auth_id
      and v_existing.actor_student_id = p_actor_student_id
      and v_existing.actor_seat = p_actor_seat
    then
      return query select
        'IDEMPOTENT'::text,
        v_room,
        (v_room ->> 'revision')::bigint,
        (v_room #>> '{gameState,revision}')::bigint,
        v_existing.command_sequence,
        v_existing.command_id;
    else
      return query select
        'COMMAND_CONFLICT'::text,
        v_room,
        (v_room ->> 'revision')::bigint,
        (v_room #>> '{gameState,revision}')::bigint,
        v_existing.command_sequence,
        v_existing.command_id;
    end if;
    return;
  end if;

  if jsonb_typeof(v_room) <> 'object'
    or (v_room ->> 'id') is distinct from p_room_id
    or (v_room ->> 'schemaVersion') is distinct from '2'
    or (v_room ->> 'status') is distinct from 'playing'
    or (v_room #>> '{gameState,status}') is distinct from 'playing'
    or (v_room ->> 'matchId') is distinct from p_match_id
    or (v_room #>> '{gameState,seed}') is distinct from p_seed::text
  then
    return query select
      'CONTEXT_MISMATCH'::text,
      v_room,
      case when coalesce(v_room ->> 'revision', '') ~ '^\d+$'
        then (v_room ->> 'revision')::bigint else null::bigint end,
      case when coalesce(v_room #>> '{gameState,revision}', '') ~ '^\d+$'
        then (v_room #>> '{gameState,revision}')::bigint else null::bigint end,
      null::bigint,
      null::text;
    return;
  end if;

  if coalesce(v_room ->> 'revision', '') !~ '^\d+$'
    or coalesce(v_room #>> '{gameState,revision}', '') !~ '^\d+$'
  then
    return query select
      'CONTEXT_MISMATCH'::text,
      v_room,
      null::bigint,
      null::bigint,
      null::bigint,
      null::text;
    return;
  end if;
  v_current_room_revision := (v_room ->> 'revision')::bigint;
  v_current_game_revision := (v_room #>> '{gameState,revision}')::bigint;

  if not exists (
    select 1
    from jsonb_array_elements(v_room -> 'players') as player(value)
    where (player.value ->> 'authId') = p_actor_auth_id::text
      and (player.value ->> 'studentId') = p_actor_student_id::text
      and (player.value ->> 'seat') = p_actor_seat::text
  ) then
    return query select
      'CONTEXT_MISMATCH'::text,
      v_room,
      v_current_room_revision,
      v_current_game_revision,
      null::bigint,
      null::text;
    return;
  end if;

  if v_current_room_revision <> p_base_room_revision
    or v_current_game_revision <> p_base_game_revision
  then
    return query select
      'STALE'::text,
      v_room,
      v_current_room_revision,
      v_current_game_revision,
      null::bigint,
      null::text;
    return;
  end if;

  v_required_seat := case p_kind
    when 'START_PITCH' then 1 - (v_room #>> '{gameState,battingTeam}')::smallint
    when 'BATTER_ACTION' then (v_room #>> '{gameState,battingTeam}')::smallint
    else null
  end;
  if v_required_seat is null or p_actor_seat <> v_required_seat then
    return query select
      'CONTEXT_MISMATCH'::text,
      v_room,
      v_current_room_revision,
      v_current_game_revision,
      null::bigint,
      null::text;
    return;
  end if;

  select logs.*
    into v_existing
  from public.baseball_command_log as logs
  where logs.room_id = p_room_id
    and logs.match_id = p_match_id
    and logs.command_sequence = p_command_sequence;
  if found then
    return query select
      'SEQUENCE_CONFLICT'::text,
      v_room,
      v_current_room_revision,
      v_current_game_revision,
      v_existing.command_sequence,
      v_existing.command_id;
    return;
  end if;

  select coalesce(max(logs.command_sequence), 0)
    into v_last_sequence
  from public.baseball_command_log as logs
  where logs.room_id = p_room_id
    and logs.match_id = p_match_id;
  if p_command_sequence <> v_last_sequence + 1 then
    return query select
      'SEQUENCE_CONFLICT'::text,
      v_room,
      v_current_room_revision,
      v_current_game_revision,
      v_last_sequence,
      null::text;
    return;
  end if;

  if jsonb_typeof(p_payload) <> 'object'
    or (p_payload ->> 'roomId') is distinct from p_room_id
    or (p_payload ->> 'matchId') is distinct from p_match_id
    or (p_payload ->> 'commandId') is distinct from p_command_id
    or (p_payload ->> 'commandSequence') is distinct from p_command_sequence::text
    or (p_payload ->> 'baseRoomRevision') is distinct from p_base_room_revision::text
    or (p_payload ->> 'baseGameRevision') is distinct from p_base_game_revision::text
    or (p_payload ->> 'actorSeat') is distinct from p_actor_seat::text
    or (p_payload ->> 'seed') is distinct from p_seed::text
    or (p_payload ->> 'kind') is distinct from p_kind
  then
    raise exception using errcode = '22023', message = 'invalid canonical baseball command payload';
  end if;

  -- Match identity, participants, host, seed, lineup and starting pitchers are
  -- immutable for every gameplay transition. Only official game state may move.
  if jsonb_typeof(p_next_room) <> 'object'
    or (p_next_room ->> 'id') is distinct from p_room_id
    or (p_next_room ->> 'schemaVersion') is distinct from '2'
    or (p_next_room ->> 'matchId') is distinct from p_match_id
    or (p_next_room #>> '{gameState,seed}') is distinct from p_seed::text
    or (p_next_room ->> 'revision') is distinct from (p_base_room_revision + 1)::text
    or (p_next_room #>> '{gameState,revision}') is distinct from (p_base_game_revision + 1)::text
    or (p_next_room ->> 'status') not in ('playing', 'finished')
    or (p_next_room -> 'players') is distinct from (v_room -> 'players')
    or (p_next_room ->> 'hostStudentId') is distinct from (v_room ->> 'hostStudentId')
    or (p_next_room ->> 'title') is distinct from (v_room ->> 'title')
    or (p_next_room ->> 'description') is distinct from (v_room ->> 'description')
    or (p_next_room ->> 'maxPlayers') is distinct from (v_room ->> 'maxPlayers')
    or (p_next_room ->> 'isPublic') is distinct from (v_room ->> 'isPublic')
    or (p_next_room ->> 'createdAt') is distinct from (v_room ->> 'createdAt')
    or (p_next_room ->> 'startedAt') is distinct from (v_room ->> 'startedAt')
    or (p_next_room -> 'activityLogs') is distinct from (v_room -> 'activityLogs')
    or (p_next_room #>> '{gameState,version}') is distinct from (v_room #>> '{gameState,version}')
    or (p_next_room #>> '{gameState,teams,0,id}') is distinct from (v_room #>> '{gameState,teams,0,id}')
    or (p_next_room #>> '{gameState,teams,0,name}') is distinct from (v_room #>> '{gameState,teams,0,name}')
    or (p_next_room #>> '{gameState,teams,0,rosterId}') is distinct from (v_room #>> '{gameState,teams,0,rosterId}')
    or (p_next_room #> '{gameState,teams,0,lineupPlayerIds}') is distinct from (v_room #> '{gameState,teams,0,lineupPlayerIds}')
    or (p_next_room #>> '{gameState,teams,0,pitcher,playerId}') is distinct from (v_room #>> '{gameState,teams,0,pitcher,playerId}')
    or (p_next_room #>> '{gameState,teams,1,id}') is distinct from (v_room #>> '{gameState,teams,1,id}')
    or (p_next_room #>> '{gameState,teams,1,name}') is distinct from (v_room #>> '{gameState,teams,1,name}')
    or (p_next_room #>> '{gameState,teams,1,rosterId}') is distinct from (v_room #>> '{gameState,teams,1,rosterId}')
    or (p_next_room #> '{gameState,teams,1,lineupPlayerIds}') is distinct from (v_room #> '{gameState,teams,1,lineupPlayerIds}')
    or (p_next_room #>> '{gameState,teams,1,pitcher,playerId}') is distinct from (v_room #>> '{gameState,teams,1,pitcher,playerId}')
  then
    raise exception using errcode = '22023', message = 'invalid canonical baseball room transition';
  end if;

  update public.bang_rooms as rooms
  set room_data = p_next_room,
      updated_at = pg_catalog.now()
  where rooms.id = p_room_id;

  insert into public.baseball_command_log (
    room_id,
    match_id,
    command_id,
    command_sequence,
    base_room_revision,
    base_game_revision,
    committed_room_revision,
    committed_game_revision,
    seed,
    kind,
    actor_auth_id,
    actor_student_id,
    actor_seat,
    payload
  ) values (
    p_room_id,
    p_match_id,
    p_command_id,
    p_command_sequence,
    p_base_room_revision,
    p_base_game_revision,
    p_base_room_revision + 1,
    p_base_game_revision + 1,
    p_seed,
    p_kind,
    p_actor_auth_id,
    p_actor_student_id,
    p_actor_seat,
    p_payload
  );

  return query select
    'COMMITTED'::text,
    p_next_room,
    p_base_room_revision + 1,
    p_base_game_revision + 1,
    p_command_sequence,
    p_command_id;
end;
$$;

revoke execute on function public.commit_baseball_command(
  text, text, text, bigint, bigint, bigint, bigint, text, jsonb, jsonb,
  uuid, bigint, smallint
) from public, anon, authenticated;
grant execute on function public.commit_baseball_command(
  text, text, text, bigint, bigint, bigint, bigint, text, jsonb, jsonb,
  uuid, bigint, smallint
) to service_role;

grant select, insert, update, delete on table public.bang_rooms to service_role;
-- PostgreSQL requires UPDATE on at least one column for SELECT ... FOR SHARE.
-- This migration adds only the narrow column grant needed to lock member rows;
-- these functions never update members.
grant select, update (updated_at) on table public.members to service_role;

-- Private Realtime authorization. The client uses private:true and calls
-- realtime.setAuth() before subscribing. State is never accepted from Realtime;
-- broadcasts are state-free refetch notices and Presence carries connection meta.
drop policy if exists "Baseball private topics can receive" on realtime.messages;
drop policy if exists "Baseball private topics can send" on realtime.messages;

create policy "Baseball private topics can receive"
on realtime.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.bang_rooms as room
    cross join lateral jsonb_array_elements(
      case
        when jsonb_typeof(room.room_data -> 'players') = 'array'
          then room.room_data -> 'players'
        else '[]'::jsonb
      end
    ) as player(value)
    cross join public.members as member
    where room.id like 'baseball-%'
      and (room.room_data ->> 'schemaVersion') = '2'
      and (room.room_data ->> 'status') = 'playing'
      and nullif(room.room_data ->> 'matchId', '') is not null
      and member.auth_user_id = (select auth.uid())
      and member.is_active = true
      and (player.value ->> 'authId') = member.auth_user_id::text
      and (player.value ->> 'studentId') = coalesce(
        member.student_id::bigint,
        900000000::bigint + member.id::bigint
      )::text
      and (
        (
          realtime.messages.extension = 'presence'
          and (select realtime.topic()) =
            'baseball-game-presence:' || room.id || ':' || (room.room_data ->> 'matchId')
        )
        or (
          realtime.messages.extension = 'broadcast'
          and (select realtime.topic()) =
            'baseball-command-notice:' || room.id || ':' || (room.room_data ->> 'matchId')
        )
      )
  )
);

create policy "Baseball private topics can send"
on realtime.messages
for insert
to authenticated
with check (
  exists (
    select 1
    from public.bang_rooms as room
    cross join lateral jsonb_array_elements(
      case
        when jsonb_typeof(room.room_data -> 'players') = 'array'
          then room.room_data -> 'players'
        else '[]'::jsonb
      end
    ) as player(value)
    cross join public.members as member
    where room.id like 'baseball-%'
      and (room.room_data ->> 'schemaVersion') = '2'
      and (room.room_data ->> 'status') = 'playing'
      and nullif(room.room_data ->> 'matchId', '') is not null
      and member.auth_user_id = (select auth.uid())
      and member.is_active = true
      and (player.value ->> 'authId') = member.auth_user_id::text
      and (player.value ->> 'studentId') = coalesce(
        member.student_id::bigint,
        900000000::bigint + member.id::bigint
      )::text
      and (
        (
          realtime.messages.extension = 'presence'
          and (select realtime.topic()) =
            'baseball-game-presence:' || room.id || ':' || (room.room_data ->> 'matchId')
        )
        or (
          realtime.messages.extension = 'broadcast'
          and (select realtime.topic()) =
            'baseball-command-notice:' || room.id || ':' || (room.room_data ->> 'matchId')
        )
      )
  )
);
