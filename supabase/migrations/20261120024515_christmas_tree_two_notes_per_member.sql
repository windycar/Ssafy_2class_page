alter table public.christmas_tree_notes add column member_slot smallint;

update public.christmas_tree_notes
set member_slot = 1
where member_id is not null;

alter table public.christmas_tree_notes
  drop constraint christmas_tree_notes_member_id_key,
  add constraint christmas_tree_notes_member_slot_key unique (member_id, member_slot),
  add constraint christmas_tree_notes_member_slot_check check (
    (member_id is null and member_slot is null)
    or (member_id is not null and member_slot is not null and member_slot in (1, 2))
  );

create function christmas_tree_private.list_own_notes()
returns table (id uuid, content text, author_name text)
language plpgsql
stable
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

  return query
  select n.id, n.content, n.author_name
  from public.christmas_tree_notes n
  where n.member_id = v_member_id
  order by n.created_at, n.id;
end;
$$;

create function christmas_tree_private.save_note(
  p_content text, p_show_name boolean, p_note_id uuid, p_edit boolean
)
returns table (id uuid, content text, author_name text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_member_id bigint;
  v_author_name text;
  v_content text;
  v_slot smallint;
begin
  -- Serialize slot selection for concurrent submissions from the same member.
  select m.id, case when p_show_name then m.name end
  into v_member_id, v_author_name
  from public.members m
  where m.auth_user_id = (select auth.uid()) and m.is_active
  for no key update;

  if v_member_id is null then
    raise exception 'active member required' using errcode = '42501';
  end if;

  v_content := regexp_replace(p_content, '^[[:space:]]+|[[:space:]]+$', '', 'g');
  if v_content is null or char_length(v_content) not between 1 and 140 then
    raise exception 'note must be between 1 and 140 characters' using errcode = '22023';
  end if;

  if p_edit then
    return query
    update public.christmas_tree_notes n
    set content = v_content, author_name = v_author_name
    where n.id = p_note_id and n.member_id = v_member_id
    returning n.id, n.content, n.author_name;

    if not found then
      raise exception 'own note required' using errcode = '42501';
    end if;
    return;
  end if;

  -- A repeated request returns its saved note. Older clients omit the ID and keep the first note.
  return query
  select n.id, n.content, n.author_name
  from public.christmas_tree_notes n
  where n.member_id = v_member_id and (p_note_id is null or n.id = p_note_id)
  order by n.created_at, n.id
  limit 1;

  if found then return; end if;

  select slots.slot into v_slot
  from (values (1), (2)) as slots(slot)
  where not exists (
    select 1 from public.christmas_tree_notes n
    where n.member_id = v_member_id and n.member_slot = slots.slot
  )
  order by slots.slot
  limit 1;

  if v_slot is null then
    raise exception 'christmas_tree_note_limit';
  end if;

  return query
  insert into public.christmas_tree_notes as n (id, member_id, member_slot, content, author_name)
  values (coalesce(p_note_id, gen_random_uuid()), v_member_id, v_slot, v_content, v_author_name)
  returning n.id, n.content, n.author_name;
end;
$$;

revoke all on function christmas_tree_private.list_own_notes() from public, anon, authenticated;
revoke all on function christmas_tree_private.save_note(text, boolean, uuid, boolean) from public, anon, authenticated;
grant execute on function christmas_tree_private.list_own_notes() to authenticated;
grant execute on function christmas_tree_private.save_note(text, boolean, uuid, boolean) to authenticated;

create or replace function christmas_tree_private.manage_note(
  p_content text, p_show_name boolean, p_edit_note_id uuid
)
returns table (id uuid, content text, author_name text)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_content is null then
    return query select * from christmas_tree_private.list_own_notes() limit 1;
  else
    return query select * from christmas_tree_private.save_note(
      p_content, p_show_name, p_edit_note_id, p_edit_note_id is not null
    );
  end if;
end;
$$;

create function public.list_my_christmas_tree_notes()
returns table (id uuid, content text, author_name text)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from christmas_tree_private.list_own_notes();
$$;

create function public.save_my_christmas_tree_note(
  p_note_id uuid, p_content text, p_show_name boolean, p_edit boolean
)
returns table (id uuid, content text, author_name text)
language sql
security invoker
set search_path = ''
as $$
  select * from christmas_tree_private.save_note(p_content, p_show_name, p_note_id, p_edit);
$$;

revoke all on function public.list_my_christmas_tree_notes() from public, anon, authenticated;
revoke all on function public.save_my_christmas_tree_note(uuid, text, boolean, boolean) from public, anon, authenticated;
grant execute on function public.list_my_christmas_tree_notes() to authenticated;
grant execute on function public.save_my_christmas_tree_note(uuid, text, boolean, boolean) to authenticated;
