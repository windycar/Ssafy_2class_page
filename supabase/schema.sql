-- Supabase SQL Editor에서 한 번 실행합니다.
create table if not exists public.gallery_photos (
  id text primary key,
  title text not null,
  description text not null default '',
  image_url text not null,
  storage_path text,
  batch_id text,
  taken_at date not null,
  uploaded_by text not null,
  category text not null check (category in ('class', 'project', 'event', 'lunch', 'dinner', 'etc')),
  likes integer not null default 0,
  liked_by jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.gallery_photos add column if not exists batch_id text;

create table if not exists public.gallery_comments (
  id text primary key,
  photo_id text not null references public.gallery_photos(id) on delete cascade,
  author text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.gallery_photos enable row level security;
alter table public.gallery_comments enable row level security;

drop policy if exists "Public gallery photos" on public.gallery_photos;
drop policy if exists "Public gallery photo read" on public.gallery_photos;
drop policy if exists "Public gallery photo create" on public.gallery_photos;
drop policy if exists "Public gallery photo update" on public.gallery_photos;
create policy "Public gallery photo read" on public.gallery_photos for select using (true);
create policy "Public gallery photo create" on public.gallery_photos for insert with check (true);
create policy "Public gallery photo update" on public.gallery_photos for update using (true) with check (true);

drop policy if exists "Public gallery comments" on public.gallery_comments;
create policy "Public gallery comments" on public.gallery_comments for all using (true) with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery-images', 'gallery-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

drop policy if exists "Public gallery image read" on storage.objects;
create policy "Public gallery image read" on storage.objects for select using (bucket_id = 'gallery-images');

drop policy if exists "Public gallery image upload" on storage.objects;
create policy "Public gallery image upload" on storage.objects for insert with check (bucket_id = 'gallery-images');

drop policy if exists "Public gallery image delete" on storage.objects;
create policy "Public gallery image delete" on storage.objects for delete using (bucket_id = 'gallery-images');

create table if not exists public.coffee_orders (
  id text primary key,
  title text not null,
  category text not null check (category in ('coffee', 'food', 'snack', 'goods', 'etc')),
  store_name text not null,
  store_link text not null default '',
  deadline timestamptz not null,
  min_order_amount integer not null default 0,
  delivery_fee integer not null default 0,
  notice text not null default '',
  account_bank text not null default '',
  account_number text not null default '',
  account_holder text not null default '',
  created_at timestamptz not null default now(),
  is_active boolean not null default true
);

create table if not exists public.coffee_order_items (
  id text primary key,
  order_id text not null references public.coffee_orders(id) on delete cascade,
  participant_name text not null,
  menu_name text not null,
  options text not null default '',
  quantity integer not null check (quantity > 0),
  price integer not null check (price > 0),
  note text not null default '',
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'ordered', 'received'))
);

alter table public.coffee_orders enable row level security;
alter table public.coffee_order_items enable row level security;

drop policy if exists "Public coffee orders" on public.coffee_orders;
create policy "Public coffee orders" on public.coffee_orders for all using (true) with check (true);

drop policy if exists "Public coffee items" on public.coffee_order_items;
create policy "Public coffee items" on public.coffee_order_items for all using (true) with check (true);

create table if not exists public.anonymous_posts (
  id text primary key,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.anonymous_posts enable row level security;
drop policy if exists "Public anonymous post read" on public.anonymous_posts;
create policy "Public anonymous post read" on public.anonymous_posts for select using (true);
drop policy if exists "Public anonymous post create" on public.anonymous_posts;
create policy "Public anonymous post create" on public.anonymous_posts for insert with check (true);

create table if not exists public.bang_rooms (
  id text primary key,
  room_data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bang_rooms enable row level security;
drop policy if exists "Public bang rooms" on public.bang_rooms;
create policy "Public bang rooms" on public.bang_rooms
  for all using (true) with check (true);

-- BANG waiting-room and in-game chat is stored separately from room_data.
-- This prevents concurrent room updates from overwriting chat messages.
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
