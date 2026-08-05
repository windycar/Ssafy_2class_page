export type GroundRuleCategory = "time" | "life" | "care" | "social" | "facility" | "etc";

export interface GroundRule {
  id: string;
  content: string;
  author: string;
  category: GroundRuleCategory;
  likes: number;
  likedBy: string[];
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  createdBy?: string | null;
  createdByMemberId?: number | null;
  isLiked?: boolean;
}
