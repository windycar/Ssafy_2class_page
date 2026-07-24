-- Supabase SQL Editor에서 한 번 실행합니다.
create table if not exists public.gallery_photos (
  id text primary key,
  title text not null,
  description text not null default '',
  image_url text not null,
  storage_path text,
  taken_at date not null,
  uploaded_by text not null,
  category text not null check (category in ('class', 'project', 'event', 'lunch', 'dinner', 'etc')),
  likes integer not null default 0,
  liked_by jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

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
create policy "Public gallery photos" on public.gallery_photos for all using (true) with check (true);

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
