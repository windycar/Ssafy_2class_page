create table public.christmas_tree_ornaments (
  id uuid primary key default gen_random_uuid(),
  member_id bigint not null unique references public.members(id) on delete cascade,
  kind text not null check (kind in ('star', 'bell', 'snowflake', 'bauble')),
  created_at timestamptz not null default now()
);

alter table public.christmas_tree_ornaments enable row level security;
revoke all on table public.christmas_tree_ornaments from public, anon, authenticated;

create function christmas_tree_private.manage_ornaments(p_kind text, p_remove boolean)
returns table (id uuid, kind text, is_mine boolean)
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

  if p_remove and p_kind is not null then
    raise exception 'choose either save or remove' using errcode = '22023';
  end if;

  if p_remove then
    delete from public.christmas_tree_ornaments o where o.member_id = v_member_id;
  elsif p_kind is not null then
    if p_kind not in ('star', 'bell', 'snowflake', 'bauble') then
      raise exception 'invalid ornament' using errcode = '22023';
    end if;
    insert into public.christmas_tree_ornaments (member_id, kind)
    values (v_member_id, p_kind)
    on conflict (member_id) do update set kind = excluded.kind;
  end if;

  return query
  select o.id, o.kind, o.member_id = v_member_id
  from public.christmas_tree_ornaments o
  order by o.created_at, o.id;
end;
$$;

revoke all on function christmas_tree_private.manage_ornaments(text, boolean) from public, anon, authenticated;
grant execute on function christmas_tree_private.manage_ornaments(text, boolean) to authenticated;

create function public.manage_my_christmas_tree_ornament(p_kind text default null, p_remove boolean default false)
returns table (id uuid, kind text, is_mine boolean)
language sql
security invoker
set search_path = ''
as $$
  select * from christmas_tree_private.manage_ornaments(p_kind, p_remove);
$$;

revoke all on function public.manage_my_christmas_tree_ornament(text, boolean) from public, anon, authenticated;
grant execute on function public.manage_my_christmas_tree_ornament(text, boolean) to authenticated;
