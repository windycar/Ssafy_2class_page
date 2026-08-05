import { requireSupabase } from "../lib/supabase";
export { softenAnonymousTone } from "../utils/softenAnonymousTone";

export type AnonymousPost = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type PostRow = { id: string; title: string; content: string; created_at: string; updated_at: string };

const toPost = (post: PostRow): AnonymousPost => ({
  id: post.id,
  title: post.title,
  content: post.content,
  createdAt: post.created_at,
  updatedAt: post.updated_at,
});

export async function getAnonymousPosts() {
  const { data, error } = await requireSupabase()
    .from("anonymous_posts")
    .select("id, title, content, created_at, updated_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as PostRow[]).map(toPost);
}

export async function createAnonymousPost(title: string, content: string) {
  const { data, error } = await requireSupabase()
    .rpc("create_anonymous_post", { p_title: title, p_content: content })
    .single();
  if (error) throw error;
  return toPost(data as PostRow);
}
