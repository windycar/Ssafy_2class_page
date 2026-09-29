-- 체험 방문자에게 공개된 반 규칙만 읽도록 허용한다.
-- 회원이 제안한 규칙과 작성자 식별자는 기존 회원 정책으로 보호한다.
drop policy if exists ground_rules_select_demo on public.ground_rules;
create policy ground_rules_select_demo on public.ground_rules
for select to anon
using (created_by is null and created_by_member_id is null);

revoke all on table public.ground_rules from anon;
grant select (id, content, author_name, category, seed_likes, is_pinned, tags, created_at, updated_at)
on public.ground_rules to anon;

-- 사진과 댓글의 공개 화면에 필요한 열만 제공한다.
-- 좋아요 사용자 ID와 저장소 내부 경로는 공개하지 않는다.
revoke all on table public.gallery_photos, public.gallery_comments from anon;
grant select (id, title, description, image_url, batch_id, taken_at, uploaded_by, category, likes, created_at)
on public.gallery_photos to anon;
grant select (id, photo_id, author, content, created_at)
on public.gallery_comments to anon;
