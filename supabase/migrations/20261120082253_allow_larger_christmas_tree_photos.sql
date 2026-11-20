create or replace function christmas_tree_private.is_ornament_thumbnail(p_image text)
returns boolean
language plpgsql
immutable strict
set search_path = ''
as $$
declare
  v_bytes bytea;
  v_chunk text;
  v_width integer;
  v_height integer;
begin
  if octet_length(p_image) > 52000 or p_image !~ '^data:image/(png|webp);base64,[A-Za-z0-9+/]+={0,2}$' then
    return false;
  end if;
  v_bytes := decode(split_part(p_image, ',', 2), 'base64');
  if octet_length(v_bytes) < 33 then
    return false;
  end if;

  if starts_with(p_image, 'data:image/png;') then
    return substring(v_bytes from 1 for 16) = decode('89504e470d0a1a0a0000000d49484452', 'hex')
      and substring(v_bytes from 17 for 8) in (decode('0000006000000060','hex'), decode('000000f0000000f0','hex'));
  end if;

  if substring(v_bytes from 1 for 4) <> decode('52494646','hex')
    or substring(v_bytes from 9 for 4) <> decode('57454250','hex')
    or get_byte(v_bytes, 6) <> 0 or get_byte(v_bytes, 7) <> 0
    or octet_length(v_bytes) <> 8 + get_byte(v_bytes, 4) + 256 * get_byte(v_bytes, 5)
  then
    return false;
  end if;

  -- Continue to accept existing 96px photos and the smaller fallback encoding.
  v_chunk := encode(substring(v_bytes from 13 for 4), 'hex');
  case v_chunk
    when '56503820' then
      if substring(v_bytes from 24 for 3) <> decode('9d012a','hex') then return false; end if;
      v_width := get_byte(v_bytes, 26) | ((get_byte(v_bytes, 27) & 63) << 8);
      v_height := get_byte(v_bytes, 28) | ((get_byte(v_bytes, 29) & 63) << 8);
    when '5650384c' then
      if get_byte(v_bytes, 20) <> 47 then return false; end if;
      v_width := 1 + (get_byte(v_bytes, 21) | ((get_byte(v_bytes, 22) & 63) << 8));
      v_height := 1 + ((get_byte(v_bytes, 22) >> 6) | (get_byte(v_bytes, 23) << 2) | ((get_byte(v_bytes, 24) & 15) << 10));
    when '56503858' then
      return (get_byte(v_bytes, 20) & 2) = 0
        and substring(v_bytes from 25 for 6) in (decode('5f00005f0000','hex'), decode('ef0000ef0000','hex'));
    else
      return false;
  end case;
  return v_width = v_height and v_width in (96, 240);
exception when data_exception then
  return false;
end;
$$;
