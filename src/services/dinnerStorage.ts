import { requireSupabase } from "../lib/supabase";
import type { AuthUser } from "../types/auth";
import type { DinnerPoll, DinnerPollInput, DinnerResponse, DinnerResponseInput } from "../types/dinner";
import { validateDinnerPoll, validateDinnerResponse } from "../utils/dinnerPoll";

async function requireDinnerMember(user: AuthUser, admin = false) {
  if (user.isDemo || !user.isActive) throw new Error("정식 계정으로 로그인해 주세요.");
  const db = requireSupabase();
  const { data: auth, error: authError } = await db.auth.getUser();
  if (authError || auth.user?.id !== user.authId) throw new Error("로그인 계정이 변경되었습니다. 다시 로그인해 주세요.");
  const { data: member, error } = await db.from("members").select("id, student_id, role, is_active")
    .eq("id", user.memberId).eq("auth_user_id", auth.user.id).single();
  if (error || !member?.is_active || member.student_id !== user.studentId) throw new Error("회원 정보를 확인할 수 없습니다. 다시 로그인해 주세요.");
  if (admin && member.role !== "admin") throw new Error("관리자만 회식 투표를 관리할 수 있습니다.");
  return db;
}

export async function getDinnerPolls(user: AuthUser): Promise<DinnerPoll[]> {
  const db = await requireDinnerMember(user);
  const { data, error } = await db.from("dinner_polls").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getDinnerResponses(user: AuthUser, pollId: string): Promise<DinnerResponse[]> {
  const db = await requireDinnerMember(user);
  const { data, error } = await db.from("dinner_responses")
    .select("poll_id, member_id, participant_name, status, available_dates, arrival_time, note, updated_at")
    .eq("poll_id", pollId).order("updated_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function saveDinnerPoll(user: AuthUser, input: DinnerPollInput, pollId?: string): Promise<DinnerPoll> {
  const payload = validateDinnerPoll(input);
  const db = await requireDinnerMember(user, true);
  const query = pollId ? db.from("dinner_polls").update(payload).eq("id", pollId)
    : db.from("dinner_polls").insert({ ...payload, created_by: user.authId });
  const { data, error } = await query.select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function setDinnerPollClosed(user: AuthUser, pollId: string, closed: boolean) {
  const db = await requireDinnerMember(user, true);
  const { error } = await db.from("dinner_polls").update({ is_closed: closed }).eq("id", pollId).select("id").single();
  if (error) throw new Error(error.message);
}

export async function saveDinnerResponse(user: AuthUser, poll: DinnerPoll, input: DinnerResponseInput) {
  const payload = validateDinnerResponse(poll, input);
  const db = await requireDinnerMember(user);
  const { error } = await db.from("dinner_responses").upsert({ ...payload, poll_id: poll.id,
    member_id: user.memberId, user_id: user.authId, participant_name: user.name }, { onConflict: "poll_id,member_id" });
  if (error) throw new Error(error.message);
}

export async function cancelDinnerResponse(user: AuthUser, pollId: string) {
  const db = await requireDinnerMember(user);
  const { error } = await db.from("dinner_responses").delete().eq("poll_id", pollId).eq("member_id", user.memberId).select("poll_id").single();
  if (error) throw new Error(error.message);
}
