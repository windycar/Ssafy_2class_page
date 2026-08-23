import {
  Home,
  Shuffle,
  Coffee,
  Camera,
  Shield,
  MessageSquare,
  Gamepad2,
  BookOpenCheck,
  ClipboardCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  matchPrefix?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "홈", path: "/", icon: Home },
  { label: "랜덤 팀", path: "/teams", icon: Shuffle },
  { label: "같이 공구", path: "/coffee", icon: Coffee },
  { label: "게임", path: "/games", icon: Gamepad2, matchPrefix: "/games" },
  { label: "공부 문제", path: "/study", icon: BookOpenCheck, matchPrefix: "/study" },
  { label: "출결 서류", path: "/attendance", icon: ClipboardCheck },
  { label: "사진첩", path: "/gallery", icon: Camera },
  { label: "그라운드 룰", path: "/ground-rules", icon: Shield },
  { label: "익명 게시판", path: "/board", icon: MessageSquare },
];
