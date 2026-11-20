alter table public.christmas_tree_ornaments
  add column slot smallint not null default 1,
  add column height double precision,
  add column azimuth double precision,
  drop constraint christmas_tree_ornaments_member_id_key,
  drop constraint christmas_tree_ornaments_kind_check,
  add constraint christmas_tree_ornaments_member_slot_key unique (member_id, slot),
  add constraint christmas_tree_ornaments_slot_check check (slot in (1, 2)),
  add constraint christmas_tree_ornaments_kind_check
    check (kind in ('star', 'bell', 'snowflake', 'bauble', 'candy', 'ribbon', 'gift', 'gingerbread')),
  add constraint christmas_tree_ornaments_position_check check (
    (height is null and azimuth is null)
    or (height is not null and azimuth is not null and height between 0.03 and 0.94 and azimuth >= 0 and azimuth < 2 * pi())
  );

-- Keep the existing ornaments on the branches where members saw them before placement was available.
with positions as (
  select o.id, row_number() over (order by o.created_at, o.id) - 1 as idx
  from public.christmas_tree_ornaments o
), angles as (
  select id, idx, pi() / 2 - 0.55 + idx * 2.39996323 as angle from positions
)
update public.christmas_tree_ornaments o
set height = 0.15 + 0.56 * mod(0.36 + a.idx * 0.754877666, 1),
    azimuth = a.angle - 2 * pi() * floor(a.angle / (2 * pi()))
from angles a
where o.id = a.id;

create function christmas_tree_private.place_ornaments(
  p_slot integer, p_kind text, p_height double precision, p_azimuth double precision, p_remove boolean
)
returns table (id uuid, kind text, own_slot integer, height double precision, azimuth double precision)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_member_id bigint;
begin
  select m.id into v_member_id
  from public.members m
  where m.auth_user_id = (select auth.uid()) and m.is_active;

  if v_member_id is null then
    raise exception 'active member required' using errcode = '42501';
  end if;

  if (p_slot is not null and p_slot not in (1, 2))
    or ((p_kind is not null or p_remove) and p_slot is null)
    or (p_remove and p_kind is not null)
    or (p_height is null) <> (p_azimuth is null)
    or (p_height is not null and (p_kind is null or p_height not between 0.03 and 0.94 or p_azimuth < 0 or p_azimuth >= 2 * pi()))
  then
    raise exception 'invalid ornament placement' using errcode = '22023';
  end if;

  if p_remove then
    delete from public.christmas_tree_ornaments o where o.member_id = v_member_id and o.slot = p_slot;
  elsif p_kind is not null then
    insert into public.christmas_tree_ornaments as o (member_id, slot, kind, height, azimuth)
    values (v_member_id, p_slot, p_kind, p_height, p_azimuth)
    on conflict (member_id, slot) do update
      set kind = excluded.kind,
          height = coalesce(excluded.height, o.height),
          azimuth = coalesce(excluded.azimuth, o.azimuth);
  end if;

  return query
  select o.id, o.kind, case when o.member_id = v_member_id then o.slot::integer end, o.height, o.azimuth
  from public.christmas_tree_ornaments o
  order by o.created_at, o.id;
end;
$$;

revoke all on function christmas_tree_private.place_ornaments(integer, text, double precision, double precision, boolean) from public, anon, authenticated;
grant execute on function christmas_tree_private.place_ornaments(integer, text, double precision, double precision, boolean) to authenticated;

create function public.manage_my_christmas_tree_ornaments(
  p_slot integer default null,
  p_kind text default null,
  p_height double precision default null,
  p_azimuth double precision default null,
  p_remove boolean default false
)
returns table (id uuid, kind text, own_slot integer, height double precision, azimuth double precision)
language sql
security invoker
set search_path = ''
as $$
  select * from christmas_tree_private.place_ornaments(p_slot, p_kind, p_height, p_azimuth, p_remove);
$$;

revoke all on function public.manage_my_christmas_tree_ornaments(integer, text, double precision, double precision, boolean) from public, anon, authenticated;
grant execute on function public.manage_my_christmas_tree_ornaments(integer, text, double precision, double precision, boolean) to authenticated;

-- Keep the original single-slot client working while the new UI rolls out.
create or replace function christmas_tree_private.manage_ornaments(p_kind text, p_remove boolean)
returns table (id uuid, kind text, is_mine boolean)
language sql
security invoker
set search_path = ''
as $$
  select o.id, o.kind, coalesce(o.own_slot = 1, false)
  from christmas_tree_private.place_ornaments(1, p_kind, null, null, p_remove) o
  where o.kind in ('star', 'bell', 'snowflake', 'bauble');
$$;
