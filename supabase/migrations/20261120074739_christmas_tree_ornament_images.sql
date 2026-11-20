alter table public.christmas_tree_ornaments
  add column image_data text,
  drop constraint christmas_tree_ornaments_kind_check,
  add constraint christmas_tree_ornaments_kind_check
    check (kind in ('star', 'bell', 'snowflake', 'bauble', 'candy', 'ribbon', 'gift', 'gingerbread', 'custom')),
  add constraint christmas_tree_ornaments_image_check check (
    (kind = 'custom' and image_data is not null and octet_length(image_data) <= 52000)
    or (kind <> 'custom' and image_data is null)
  );

create function christmas_tree_private.is_ornament_thumbnail(p_image text)
returns boolean
language plpgsql
immutable strict
set search_path = ''
as $$
declare
  v_bytes bytea;
  v_chunk text;
begin
  if octet_length(p_image) > 52000 or p_image !~ '^data:image/(png|webp);base64,[A-Za-z0-9+/]+={0,2}$' then
    return false;
  end if;
  v_bytes := decode(split_part(p_image, ',', 2), 'base64');
  if octet_length(v_bytes) < 33 then
    return false;
  end if;

  -- Match the PNG signature, IHDR chunk and the 96 by 96 pixel dimensions.
  if starts_with(p_image, 'data:image/png;') then
    return substring(v_bytes from 1 for 24) = decode('89504e470d0a1a0a0000000d494844520000006000000060', 'hex');
  end if;

  if substring(v_bytes from 1 for 4) <> decode('52494646','hex')
    or substring(v_bytes from 9 for 4) <> decode('57454250','hex')
    or get_byte(v_bytes, 6) <> 0 or get_byte(v_bytes, 7) <> 0
    or octet_length(v_bytes) <> 8 + get_byte(v_bytes, 4) + 256 * get_byte(v_bytes, 5)
  then
    return false;
  end if;

  -- Size is stored differently in the lossy, lossless and extended WebP headers.
  v_chunk := encode(substring(v_bytes from 13 for 4), 'hex');
  case v_chunk
    when '56503820' then
      return substring(v_bytes from 24 for 3) = decode('9d012a','hex')
        and (get_byte(v_bytes, 26) | ((get_byte(v_bytes, 27) & 63) << 8)) = 96
        and (get_byte(v_bytes, 28) | ((get_byte(v_bytes, 29) & 63) << 8)) = 96;
    when '5650384c' then
      return get_byte(v_bytes, 20) = 47
        and (get_byte(v_bytes, 21) | ((get_byte(v_bytes, 22) & 63) << 8)) = 95
        and ((get_byte(v_bytes, 22) >> 6) | (get_byte(v_bytes, 23) << 2) | ((get_byte(v_bytes, 24) & 15) << 10)) = 95;
    when '56503858' then
      return (get_byte(v_bytes, 20) & 2) = 0
        and substring(v_bytes from 25 for 6) = decode('5f00005f0000','hex');
    else
      return false;
  end case;
exception when data_exception then
  return false;
end;
$$;

revoke all on function christmas_tree_private.is_ornament_thumbnail(text) from public, anon, authenticated;

create function christmas_tree_private.manage_ornament_images(
  p_slot integer, p_kind text, p_height double precision, p_azimuth double precision,
  p_remove boolean, p_image text, p_accept_images boolean
)
returns table (id uuid, kind text, own_slot integer, height double precision, azimuth double precision, image_data text)
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

  if p_kind = 'custom' then
    if not p_accept_images or christmas_tree_private.is_ornament_thumbnail(p_image) is not true then
      raise exception 'invalid ornament image' using errcode = '22023';
    end if;
  elsif p_image is not null then
    raise exception 'image requires a custom ornament' using errcode = '22023';
  end if;

  if p_remove then
    delete from public.christmas_tree_ornaments o
    where o.member_id = v_member_id and o.slot = p_slot and (p_accept_images or o.kind <> 'custom');
  elsif p_kind is not null then
    insert into public.christmas_tree_ornaments as o (member_id, slot, kind, height, azimuth, image_data)
    values (v_member_id, p_slot, p_kind, p_height, p_azimuth, p_image)
    on conflict (member_id, slot) do update
      set kind = excluded.kind,
          height = coalesce(excluded.height, o.height),
          azimuth = coalesce(excluded.azimuth, o.azimuth),
          image_data = excluded.image_data
      where p_accept_images or o.kind <> 'custom';
  end if;

  return query
  select o.id, o.kind, case when o.member_id = v_member_id then o.slot::integer end, o.height, o.azimuth, o.image_data
  from public.christmas_tree_ornaments o
  where p_accept_images or o.kind <> 'custom'
  order by o.created_at, o.id;
end;
$$;

revoke all on function christmas_tree_private.manage_ornament_images(integer, text, double precision, double precision, boolean, text, boolean) from public, anon, authenticated;
grant execute on function christmas_tree_private.manage_ornament_images(integer, text, double precision, double precision, boolean, text, boolean) to authenticated;

create function public.manage_my_christmas_tree_ornament_images(
  p_slot integer default null,
  p_kind text default null,
  p_height double precision default null,
  p_azimuth double precision default null,
  p_remove boolean default false,
  p_image text default null
)
returns table (id uuid, kind text, own_slot integer, height double precision, azimuth double precision, image_data text)
language sql
security invoker
set search_path = ''
as $$
  select * from christmas_tree_private.manage_ornament_images(p_slot, p_kind, p_height, p_azimuth, p_remove, p_image, true);
$$;

revoke all on function public.manage_my_christmas_tree_ornament_images(integer, text, double precision, double precision, boolean, text) from public, anon, authenticated;
grant execute on function public.manage_my_christmas_tree_ornament_images(integer, text, double precision, double precision, boolean, text) to authenticated;

-- Older clients can keep using the original types and slots during rollout.
create or replace function christmas_tree_private.place_ornaments(
  p_slot integer, p_kind text, p_height double precision, p_azimuth double precision, p_remove boolean
)
returns table (id uuid, kind text, own_slot integer, height double precision, azimuth double precision)
language sql
security invoker
set search_path = ''
as $$
  select o.id, o.kind, o.own_slot, o.height, o.azimuth
  from christmas_tree_private.manage_ornament_images(p_slot, p_kind, p_height, p_azimuth, p_remove, null, false) o;
$$;
