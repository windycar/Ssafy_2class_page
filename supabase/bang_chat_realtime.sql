-- BANG waiting-room and in-game chat
-- Run this file once in Supabase Dashboard > SQL Editor.

create table if not exists public.bang_chat_messages (
  id text primary key,
  room_id text not null references public.bang_rooms(id) on delete cascade,
  student_id integer not null,
  name text not null check (char_length(name) between 1 and 50),
  message text not null check (char_length(message) between 1 and 200),
  created_at timestamptz not null default now()
);

create index if not exists bang_chat_messages_room_created_idx
  on public.bang_chat_messages (room_id, created_at desc);

alter table public.bang_chat_messages enable row level security;

drop policy if exists "Public bang chat read" on public.bang_chat_messages;
create policy "Public bang chat read"
  on public.bang_chat_messages
  for select
  using (true);

drop policy if exists "Public bang chat create" on public.bang_chat_messages;
create policy "Public bang chat create"
  on public.bang_chat_messages
  for insert
  with check (
    char_length(name) between 1 and 50
    and char_length(message) between 1 and 200
  );

grant select, insert on public.bang_chat_messages to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'bang_chat_messages'
  ) then
    alter publication supabase_realtime
      add table public.bang_chat_messages;
  end if;
end
$$;
