import { requireSupabase } from "../lib/supabase";
import type { GroundRule, GroundRuleCategory } from "../types/groundRule";

type LikeRow = { user_id: string };
type GroundRuleRow = {
  id: string;
  content: string;
  author_name: string;
  category: GroundRuleCategory;
  seed_likes: number;
  is_pinned: boolean;
  tags: string[];
  created_by: string | null;
  created_by_member_id: number | null;
  created_at: string;
  updated_at: string;
  ground_rule_likes?: LikeRow[];
};

function toGroundRule(row: GroundRuleRow, currentUserId: string): GroundRule {
  const likedBy = (row.ground_rule_likes ?? []).map((like) => like.user_id);
  return {
    id: row.id,
    content: row.content,
    author: row.author_name,
    category: row.category,
    likes: row.seed_likes + likedBy.length,
    likedBy,
    isPinned: row.is_pinned,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
    createdByMemberId: row.created_by_member_id,
    isLiked: likedBy.includes(currentUserId),
  };
}

export async function getGroundRules(currentUserId: string) {
  const { data, error } = await requireSupabase()
    .from("ground_rules")
    .select("id, content, author_name, category, seed_likes, is_pinned, tags, created_by, created_by_member_id, created_at, updated_at, ground_rule_likes(user_id)")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as GroundRuleRow[]).map((row) => toGroundRule(row, currentUserId));
}

export async function createGroundRule(rule: GroundRule) {
  const { error } = await requireSupabase().from("ground_rules").insert({
    id: rule.id,
    content: rule.content,
    author_name: rule.author,
    category: rule.category,
    tags: rule.tags,
    is_pinned: rule.isPinned,
    created_by: rule.createdBy,
    created_by_member_id: rule.createdByMemberId,
    created_at: rule.createdAt,
    updated_at: rule.updatedAt ?? rule.createdAt,
  });
  if (error) throw error;
}

export async function updateGroundRule(rule: GroundRule) {
  const { error } = await requireSupabase().from("ground_rules").update({
    content: rule.content,
    category: rule.category,
    tags: rule.tags,
    is_pinned: rule.isPinned,
  }).eq("id", rule.id);
  if (error) throw error;
}

export async function deleteGroundRule(id: string) {
  const { error } = await requireSupabase().from("ground_rules").delete().eq("id", id);
  if (error) throw error;
}

export async function setGroundRuleLike(ruleId: string, memberId: number, userId: string, liked: boolean) {
  const client = requireSupabase();
  const result = liked
    ? await client.from("ground_rule_likes").insert({ rule_id: ruleId, member_id: memberId, user_id: userId })
    : await client.from("ground_rule_likes").delete().eq("rule_id", ruleId).eq("user_id", userId);
  if (result.error) throw result.error;
}

