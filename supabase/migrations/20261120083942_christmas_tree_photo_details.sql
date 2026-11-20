alter table public.christmas_tree_ornaments
  add column detail_image_data text,
  add constraint christmas_tree_ornaments_detail_image_check check (
    detail_image_data is null or (kind = 'custom' and octet_length(detail_image_data) <= 880000)
  );

create function christmas_tree_private.is_ornament_detail_image(p_image text)
returns boolean
language plpgsql
immutable strict
set search_path = ''
as $$
declare
  v_bytes bytea;
  v_count integer;
  v_offset integer := 2;
  v_marker integer;
  v_size integer;
  v_width integer;
  v_height integer;
begin
  if octet_length(p_image) > 880000 or p_image !~ '^data:image/jpeg;base64,[A-Za-z0-9+/]+={0,2}$' then
    return false;
  end if;
  v_bytes := decode(split_part(p_image, ',', 2), 'base64');
  v_count := octet_length(v_bytes);
  if v_count < 12 or substring(v_bytes from 1 for 2) <> decode('ffd8','hex')
    or substring(v_bytes from v_count - 1 for 2) <> decode('ffd9','hex') then
    return false;
  end if;

  -- Read the dimensions from the JPEG Start of Frame segment before the scan data.
  while v_offset + 4 <= v_count loop
    if get_byte(v_bytes, v_offset) <> 255 then return false; end if;
    v_marker := get_byte(v_bytes, v_offset + 1);
    if v_marker in (217, 218) then return false; end if;
    if v_marker = 255 then
      v_offset := v_offset + 1;
      continue;
    end if;
    v_size := get_byte(v_bytes, v_offset + 2) * 256 + get_byte(v_bytes, v_offset + 3);
    if v_size < 2 or v_offset + 2 + v_size > v_count then return false; end if;
    if v_marker in (192, 193, 194) and v_size >= 8 then
      v_height := get_byte(v_bytes, v_offset + 5) * 256 + get_byte(v_bytes, v_offset + 6);
      v_width := get_byte(v_bytes, v_offset + 7) * 256 + get_byte(v_bytes, v_offset + 8);
      return v_width between 1 and 1280 and v_height between 1 and 1280;
    end if;
    v_offset := v_offset + 2 + v_size;
  end loop;
  return false;
exception when data_exception then
  return false;
end;
$$;

revoke all on function christmas_tree_private.is_ornament_detail_image(text) from public, anon, authenticated;

create function christmas_tree_private.clear_replaced_photo_detail()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.kind <> 'custom' or new.image_data is distinct from old.image_data then
    new.detail_image_data := null;
  end if;
  return new;
end;
$$;

revoke all on function christmas_tree_private.clear_replaced_photo_detail() from public, anon, authenticated;

create trigger clear_replaced_christmas_tree_photo_detail
before update of kind, image_data on public.christmas_tree_ornaments
for each row execute function christmas_tree_private.clear_replaced_photo_detail();

create function christmas_tree_private.save_ornament_photo(
  p_slot integer, p_image text, p_detail text, p_height double precision, p_azimuth double precision
)
returns table (id uuid, kind text, own_slot integer, height double precision, azimuth double precision, image_data text)
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- The existing save function checks membership, slot ownership and the tree preview.
  return query
  select * from christmas_tree_private.manage_ornament_images(p_slot, 'custom', p_height, p_azimuth, false, p_image, true);

  if christmas_tree_private.is_ornament_detail_image(p_detail) is not true then
    raise exception 'invalid detailed ornament photo' using errcode = '22023';
  end if;

  update public.christmas_tree_ornaments o
  set detail_image_data = p_detail
  from public.members m
  where o.member_id = m.id and m.is_active and m.auth_user_id = (select auth.uid())
    and o.slot = p_slot and o.kind = 'custom';
  if not found then
    raise exception 'no owned ornament slot' using errcode = '42501';
  end if;
end;
$$;

revoke all on function christmas_tree_private.save_ornament_photo(integer, text, text, double precision, double precision) from public, anon, authenticated;
grant execute on function christmas_tree_private.save_ornament_photo(integer, text, text, double precision, double precision) to authenticated;

create function public.save_my_christmas_tree_ornament_photo(
  p_slot integer, p_image text, p_detail text, p_height double precision, p_azimuth double precision
)
returns table (id uuid, kind text, own_slot integer, height double precision, azimuth double precision, image_data text)
language sql
security invoker
set search_path = ''
as $$
  select * from christmas_tree_private.save_ornament_photo(p_slot, p_image, p_detail, p_height, p_azimuth);
$$;

revoke all on function public.save_my_christmas_tree_ornament_photo(integer, text, text, double precision, double precision) from public, anon, authenticated;
grant execute on function public.save_my_christmas_tree_ornament_photo(integer, text, text, double precision, double precision) to authenticated;

create function christmas_tree_private.ornament_photo_detail(p_ornament_id uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select o.detail_image_data
  from public.christmas_tree_ornaments o
  where o.id = p_ornament_id and o.kind = 'custom'
    and exists (select 1 from public.members m where m.is_active and m.auth_user_id = (select auth.uid()));
$$;

revoke all on function christmas_tree_private.ornament_photo_detail(uuid) from public, anon, authenticated;
grant execute on function christmas_tree_private.ornament_photo_detail(uuid) to authenticated;

create function public.get_christmas_tree_ornament_photo_detail(p_ornament_id uuid)
returns text
language sql
stable
security invoker
set search_path = ''
as $$
  select christmas_tree_private.ornament_photo_detail(p_ornament_id);
$$;

revoke all on function public.get_christmas_tree_ornament_photo_detail(uuid) from public, anon, authenticated;
grant execute on function public.get_christmas_tree_ornament_photo_detail(uuid) to authenticated;
