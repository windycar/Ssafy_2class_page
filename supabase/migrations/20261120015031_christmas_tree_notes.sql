create table public.christmas_tree_notes (
  id uuid primary key default gen_random_uuid(),
  member_id bigint not null unique references public.members(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 140 and content ~ '[^[:space:]]'),
  created_at timestamptz not null default now()
);

alter table public.christmas_tree_notes enable row level security;
revoke all on table public.christmas_tree_notes from public, anon, authenticated;
grant select (id, content, created_at) on table public.christmas_tree_notes to authenticated;

create policy christmas_tree_notes_read_active_members on public.christmas_tree_notes
for select to authenticated
using (exists (
  select 1 from public.members
  where auth_user_id = (select auth.uid()) and is_active
));

create schema christmas_tree_private;
revoke all on schema christmas_tree_private from public, anon, authenticated;
grant usage on schema christmas_tree_private to authenticated;

create function christmas_tree_private.own_note(p_content text)
returns table (id uuid, content text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_member_id bigint;
  v_content text;
begin
  select m.id into v_member_id
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

    insert into public.christmas_tree_notes (member_id, content)
    values (v_member_id, v_content)
    on conflict (member_id) do nothing;
  end if;

  return query
  select n.id, n.content from public.christmas_tree_notes n where n.member_id = v_member_id;
end;
$$;

revoke all on function christmas_tree_private.own_note(text) from public, anon, authenticated;
grant execute on function christmas_tree_private.own_note(text) to authenticated;

create function public.own_christmas_tree_note(p_content text default null)
returns table (id uuid, content text)
language sql
security invoker
set search_path = ''
as $$
  select * from christmas_tree_private.own_note(p_content);
$$;

revoke all on function public.own_christmas_tree_note(text) from public, anon, authenticated;
grant execute on function public.own_christmas_tree_note(text) to authenticated;
