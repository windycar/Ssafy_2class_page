create function christmas_tree_private.delete_own_note(p_note_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_member_id bigint;
begin
  -- Share the member lock used to allocate posting slots.
  select m.id into v_member_id
  from public.members m
  where m.auth_user_id = (select auth.uid()) and m.is_active
  for no key update;

  if v_member_id is null then
    raise exception 'active member required' using errcode = '42501';
  end if;

  delete from public.christmas_tree_notes n
  where n.id = p_note_id and n.member_id = v_member_id;

  return found;
end;
$$;

revoke all on function christmas_tree_private.delete_own_note(uuid) from public, anon, authenticated;
grant execute on function christmas_tree_private.delete_own_note(uuid) to authenticated;

create function public.delete_my_christmas_tree_note(p_note_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  select christmas_tree_private.delete_own_note(p_note_id);
$$;

revoke all on function public.delete_my_christmas_tree_note(uuid) from public, anon, authenticated;
grant execute on function public.delete_my_christmas_tree_note(uuid) to authenticated;
