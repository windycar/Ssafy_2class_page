alter table public.christmas_tree_notes
  alter column member_id drop not null,
  add column is_sample boolean generated always as (member_id is null) stored,
  add constraint christmas_tree_samples_are_unsigned check (member_id is not null or author_name is null);

grant select (is_sample) on table public.christmas_tree_notes to authenticated;

-- The examples are installed once. Administrators can remove them without affecting member posts.
insert into public.christmas_tree_notes (id, content, created_at)
values
  ('00000000-0000-4000-8000-202612250001', '우리 반 모두 따뜻한 연말 보내세요 🎄', now() - interval '1 second'),
  ('00000000-0000-4000-8000-202612250002', '올 한 해 함께 달려온 모두 수고 많았어요!', now() - interval '2 seconds'),
  ('00000000-0000-4000-8000-202612250003', '같이 웃고 공부할 수 있어서 고마웠어요.', now() - interval '3 seconds'),
  ('00000000-0000-4000-8000-202612250004', '힘들 때 건넨 한마디가 큰 응원이 됐어요.', now() - interval '4 seconds'),
  ('00000000-0000-4000-8000-202612250005', '새해에도 서로 응원하면서 힘내요 ✨', now() - interval '5 seconds');
