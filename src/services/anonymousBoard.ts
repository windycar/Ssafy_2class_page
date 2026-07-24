import { requireSupabase } from "../lib/supabase";

export type AnonymousPost = { id: string; title: string; content: string; createdAt: string; updatedAt: string };

type PostRow = { id: string; title: string; content: string; created_at: string; updated_at: string };
const toPost = (post: PostRow): AnonymousPost => ({ id: post.id, title: post.title, content: post.content, createdAt: post.created_at, updatedAt: post.updated_at });

export async function getAnonymousPosts() {
  const { data, error } = await requireSupabase().from("anonymous_posts").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data as PostRow[] ?? []).map(toPost);
}

export async function createAnonymousPost(post: AnonymousPost) {
  const { error } = await requireSupabase().from("anonymous_posts").insert({ id: post.id, title: post.title, content: post.content, created_at: post.createdAt, updated_at: post.updatedAt });
  if (error) throw error;
}

export function softenAnonymousTone(content: string) {
  const normalized = content.trim().replace(/[.!?]+$/g, "");
  const endings = [".", "요.", "습니다."];
  return `${normalized}${endings[Math.floor(Math.random() * endings.length)]}`;
}
