import { supabase } from "../lib/supabase";
import type { TeamRosterMember } from "../utils/memberTeamRosters";

export async function getActiveTeamRosterMembers(): Promise<TeamRosterMember[]> {
  if (!supabase) throw new Error("Supabase 연결 설정이 필요합니다.");
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const response = await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ action: "team-rosters" }),
  });
  const result = await response.json().catch(() => ({})) as {
    members?: TeamRosterMember[];
    error?: string;
  };
  if (!response.ok || !Array.isArray(result.members)) {
    throw new Error(result.error || "반 명단을 불러오지 못했습니다.");
  }
  return result.members;
}
