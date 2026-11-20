alter table public.christmas_tree_notes add column author_name text;
grant select (author_name) on table public.christmas_tree_notes to authenticated;

create function christmas_tree_private.manage_note(
  p_content text,
  p_show_name boolean,
  p_edit_note_id uuid
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
begin
  select m.id, case when p_show_name then m.name end
  into v_member_id, v_author_name
  from public.members m
  where m.auth_user_id = (select auth.uid()) and m.is_active;

  if v_member_id is null then
    raise exception 'active member required' using errcode = '42501';
  end if;

  if p_content is not null then
    v_content := regexp_replace(p_content, '^[[:space:]]+|[[:space:]]+$', '', 'g');
    if char_length(v_content) not between 1 and 140 then
      raise exception 'note must be between 1 and 140 characters' using errcode = '22023';
    end if;

    if p_edit_note_id is null then
      insert into public.christmas_tree_notes (member_id, content, author_name)
      values (v_member_id, v_content, v_author_name)
      on conflict (member_id) do nothing;
    else
      update public.christmas_tree_notes n
      set content = v_content, author_name = v_author_name
      where n.id = p_edit_note_id and n.member_id = v_member_id;
      if not found then
        raise exception 'own note required' using errcode = '42501';
      end if;
    end if;
  end if;

  return query
  select n.id, n.content, n.author_name
  from public.christmas_tree_notes n
  where n.member_id = v_member_id;
end;
$$;

revoke all on function christmas_tree_private.manage_note(text, boolean, uuid) from public, anon, authenticated;
grant execute on function christmas_tree_private.manage_note(text, boolean, uuid) to authenticated;

-- Keep the original RPC available to clients using the first version of the tree.
create or replace function christmas_tree_private.own_note(p_content text)
returns table (id uuid, content text)
language sql
security invoker
set search_path = ''
as $$
  select n.id, n.content from christmas_tree_private.manage_note(p_content, false, null) n;
$$;

create function public.manage_christmas_tree_note(
  p_content text default null,
  p_show_name boolean default false,
  p_edit_note_id uuid default null
)
returns table (id uuid, content text, author_name text)
language sql
security invoker
set search_path = ''
as $$
  select * from christmas_tree_private.manage_note(p_content, p_show_name, p_edit_note_id);
$$;

revoke all on function public.manage_christmas_tree_note(text, boolean, uuid) from public, anon, authenticated;
grant execute on function public.manage_christmas_tree_note(text, boolean, uuid) to authenticated;
