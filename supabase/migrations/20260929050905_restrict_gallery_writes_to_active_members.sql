drop policy if exists "Public gallery photo create" on public.gallery_photos;
drop policy if exists "Public gallery photo update" on public.gallery_photos;
drop policy if exists "Public gallery comments" on public.gallery_comments;
drop policy if exists "Public gallery image upload" on storage.objects;
drop policy if exists "Public gallery image delete" on storage.objects;

create policy "Active members can add gallery photos"
on public.gallery_photos for insert to authenticated
with check (exists (
  select 1 from public.members m
  where m.auth_user_id = (select auth.uid()) and m.is_active = true
));

create policy "Active members can update gallery photos"
on public.gallery_photos for update to authenticated
using (exists (
  select 1 from public.members m
  where m.auth_user_id = (select auth.uid()) and m.is_active = true
))
with check (exists (
  select 1 from public.members m
  where m.auth_user_id = (select auth.uid()) and m.is_active = true
));

create policy "Active members can delete gallery photos"
on public.gallery_photos for delete to authenticated
using (exists (
  select 1 from public.members m
  where m.auth_user_id = (select auth.uid()) and m.is_active = true
));

create policy "Public gallery comment read"
on public.gallery_comments for select to public using (true);

create policy "Active members can add gallery comments"
on public.gallery_comments for insert to authenticated
with check (exists (
  select 1 from public.members m
  where m.auth_user_id = (select auth.uid()) and m.is_active = true
));

create policy "Active members can upload gallery images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'gallery-images' and exists (
    select 1 from public.members m
    where m.auth_user_id = (select auth.uid()) and m.is_active = true
  )
);

create policy "Active members can delete gallery images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'gallery-images' and exists (
    select 1 from public.members m
    where m.auth_user_id = (select auth.uid()) and m.is_active = true
  )
);

revoke all on public.gallery_photos, public.gallery_comments from anon;
grant select on public.gallery_photos, public.gallery_comments to anon;
