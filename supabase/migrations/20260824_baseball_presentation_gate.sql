-- Canonical online presentation barrier.
-- A resolved play must be acknowledged by both seats before the next pitch.
-- A 20 second server deadline prevents an absent/backgrounded client from
-- deadlocking the match forever.

alter table public.baseball_command_log
  drop constraint if exists baseball_command_log_kind_check;
alter table public.baseball_command_log
  add constraint baseball_command_log_kind_check
  check (kind in ('START_PITCH', 'BATTER_ACTION', 'ACK_PRESENTATION'));

alter function public.commit_baseball_command(
  text, text, text, bigint, bigint, bigint, bigint, text, jsonb, jsonb,
  uuid, bigint, smallint
) rename to commit_baseball_gameplay_command_v2;

revoke execute on function public.commit_baseball_gameplay_command_v2(
  text, text, text, bigint, bigint, bigint, bigint, text, jsonb, jsonb,
  uuid, bigint, smallint
) from public, anon, authenticated;
grant execute on function public.commit_baseball_gameplay_command_v2(
  text, text, text, bigint, bigint, bigint, bigint, text, jsonb, jsonb,
  uuid, bigint, smallint
) to service_role;

create function public.commit_baseball_command(
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
  v_current_room_revision bigint;
  v_current_game_revision bigint;
  v_old_acknowledgements jsonb;
  v_next_acknowledgements jsonb;
  v_gate_expires_at timestamptz;
  v_gate_opened_at timestamptz;
  v_actor_active boolean := false;
begin
  -- Gameplay commands continue through the already-audited authority RPC. The
  -- wrapper locks and validates only the new presentation transition first.
  if p_kind in ('START_PITCH', 'BATTER_ACTION') then
    perform 1
    from public.members as member
    where member.auth_user_id = p_actor_auth_id
      and member.is_active = true
      and coalesce(
        member.student_id::bigint,
        900000000::bigint + member.id::bigint
      ) = p_actor_student_id
    for share;
    v_actor_active := found;

    select rooms.room_data
      into v_room
    from public.bang_rooms as rooms
    where rooms.id = p_room_id
    for update;

    if found
      and coalesce(v_room ->> 'revision', '') ~ '^\d+$'
      and coalesce(v_room #>> '{gameState,revision}', '') ~ '^\d+$'
      and (v_room ->> 'revision')::bigint = p_base_room_revision
      and (v_room #>> '{gameState,revision}')::bigint = p_base_game_revision
      and v_actor_active
      and exists (
        select 1
        from jsonb_array_elements(v_room -> 'players') as player(value)
        where (player.value ->> 'authId') = p_actor_auth_id::text
          and (player.value ->> 'studentId') = p_actor_student_id::text
          and (player.value ->> 'seat') = p_actor_seat::text
      )
    then
      if p_kind = 'START_PITCH' then
        if p_next_room ? 'presentationGate' then
          raise exception using
            errcode = '22023',
            message = 'start pitch must consume the presentation gate';
        end if;

        if jsonb_typeof(v_room -> 'presentationGate') = 'object'
          and jsonb_typeof(v_room #> '{presentationGate,acknowledgedSeats}') = 'array'
          and not (
            (v_room #> '{presentationGate,acknowledgedSeats}') @> '[0, 1]'::jsonb
          )
        then
          begin
            v_gate_expires_at := (v_room #>> '{presentationGate,expiresAt}')::timestamptz;
          exception when others then
            return query select
              'CONTEXT_MISMATCH'::text,
              v_room,
              p_base_room_revision,
              p_base_game_revision,
              null::bigint,
              null::text;
            return;
          end;
          if v_gate_expires_at > statement_timestamp() then
            return query select
              'PRESENTATION_PENDING'::text,
              v_room,
              p_base_room_revision,
              p_base_game_revision,
              null::bigint,
              null::text;
            return;
          end if;
        end if;
      else
        -- Every non-terminal resolved play opens a fresh, empty 20s barrier.
        if (p_next_room ->> 'status') = 'playing' then
          if jsonb_typeof(p_next_room -> 'presentationGate') <> 'object'
            or (p_next_room #>> '{presentationGate,playId}')
              is distinct from (p_payload ->> 'playId')
            or (p_next_room #> '{presentationGate,acknowledgedSeats}')
              is distinct from '[]'::jsonb
            or (p_next_room #> '{presentationGate,displayBeforeResult}')
              is distinct from (v_room -> 'gameState')
          then
            raise exception using
              errcode = '22023',
              message = 'resolved play requires a canonical presentation gate';
          end if;
          begin
            v_gate_opened_at := (p_next_room #>> '{presentationGate,openedAt}')::timestamptz;
            v_gate_expires_at := (p_next_room #>> '{presentationGate,expiresAt}')::timestamptz;
          exception when others then
            raise exception using
              errcode = '22023',
              message = 'invalid presentation gate timestamps';
          end;
          if v_gate_expires_at <> v_gate_opened_at + interval '20 seconds'
            or v_gate_opened_at < statement_timestamp() - interval '30 seconds'
            or v_gate_opened_at > statement_timestamp() + interval '5 seconds'
          then
            raise exception using
              errcode = '22023',
              message = 'invalid presentation gate deadline';
          end if;
        elsif p_next_room ? 'presentationGate' then
          raise exception using
            errcode = '22023',
            message = 'terminal play cannot retain a presentation gate';
        end if;
      end if;
    end if;

    return query
      select committed.outcome,
        committed.room_data,
        committed.room_revision,
        committed.game_revision,
        committed.committed_command_sequence,
        committed.committed_command_id
      from public.commit_baseball_gameplay_command_v2(
        p_room_id,
        p_match_id,
        p_command_id,
        p_command_sequence,
        p_base_room_revision,
        p_base_game_revision,
        p_seed,
        p_kind,
        p_payload,
        p_next_room,
        p_actor_auth_id,
        p_actor_student_id,
        p_actor_seat
      ) as committed;
    return;
  end if;

  if p_kind <> 'ACK_PRESENTATION'
    or p_actor_auth_id is null
    or p_actor_student_id <= 0
    or p_actor_seat not in (0, 1)
    or p_command_id is null
    or length(p_command_id) not between 8 and 128
    or p_room_id is null
    or p_match_id is null
    or p_command_sequence <= 0
    or p_base_room_revision < 0
    or p_base_game_revision < 0
    or p_seed not between 0 and 4294967295
  then
    raise exception using
      errcode = '22023',
      message = 'invalid canonical presentation acknowledgement';
  end if;

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

  -- Exact network retries are resolved before CAS, even after the other seat
  -- ACKs or the next pitch consumes the gate.
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
    or coalesce(v_room ->> 'revision', '') !~ '^\d+$'
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

  if jsonb_typeof(v_room -> 'presentationGate') <> 'object'
    or (v_room #>> '{presentationGate,playId}') is distinct from (p_payload ->> 'playId')
    or (v_room #>> '{gameState,activePlay,phase}') is distinct from 'RESOLVED'
    or (v_room #>> '{gameState,activePlay,playId}') is distinct from (p_payload ->> 'playId')
    or jsonb_typeof(v_room #> '{presentationGate,acknowledgedSeats}') <> 'array'
    or (v_room #> '{presentationGate,acknowledgedSeats}') @> jsonb_build_array(p_actor_seat)
  then
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
    or (p_payload ->> 'schemaVersion') is distinct from '2'
    or (p_payload ->> 'roomId') is distinct from p_room_id
    or (p_payload ->> 'matchId') is distinct from p_match_id
    or (p_payload ->> 'commandId') is distinct from p_command_id
    or (p_payload ->> 'commandSequence') is distinct from p_command_sequence::text
    or (p_payload ->> 'baseRoomRevision') is distinct from p_base_room_revision::text
    or (p_payload ->> 'baseGameRevision') is distinct from p_base_game_revision::text
    or (p_payload ->> 'actorSeat') is distinct from p_actor_seat::text
    or (p_payload ->> 'seed') is distinct from p_seed::text
    or (p_payload ->> 'kind') is distinct from 'ACK_PRESENTATION'
    or (p_payload #>> '{command,commandId}') is distinct from p_command_id
    or (p_payload #>> '{command,expectedRevision}') is distinct from p_base_game_revision::text
    or (p_payload #>> '{command,playId}') is distinct from (p_payload ->> 'playId')
  then
    raise exception using
      errcode = '22023',
      message = 'invalid canonical presentation acknowledgement payload';
  end if;

  v_old_acknowledgements := v_room #> '{presentationGate,acknowledgedSeats}';
  v_next_acknowledgements := p_next_room #> '{presentationGate,acknowledgedSeats}';
  if jsonb_typeof(p_next_room) <> 'object'
    or (p_next_room ->> 'revision') is distinct from (p_base_room_revision + 1)::text
    or (p_next_room #>> '{gameState,revision}')
      is distinct from (p_base_game_revision + 1)::text
    or (p_next_room - 'revision' - 'presentationGate')
      is distinct from (v_room - 'revision' - 'presentationGate')
    or ((p_next_room -> 'gameState') - 'revision')
      is distinct from ((v_room -> 'gameState') - 'revision')
    or ((p_next_room -> 'presentationGate') - 'acknowledgedSeats')
      is distinct from ((v_room -> 'presentationGate') - 'acknowledgedSeats')
    or jsonb_typeof(v_next_acknowledgements) <> 'array'
    or jsonb_array_length(v_next_acknowledgements)
      <> jsonb_array_length(v_old_acknowledgements) + 1
    or not (v_next_acknowledgements @> v_old_acknowledgements)
    or not (v_next_acknowledgements @> jsonb_build_array(p_actor_seat))
  then
    raise exception using
      errcode = '22023',
      message = 'invalid canonical presentation acknowledgement transition';
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
