import type { SupabaseClient } from "@supabase/supabase-js";

export async function assertSpecialMockExamSession(client: SupabaseClient, authId: string) {
  const { data, error } = await client.auth.getSession();
  if (error || data.session?.user.id !== authId) {
    throw new Error("로그인 계정이 변경되었습니다. 회원 정보를 다시 확인해 주세요.");
  }
}

export async function requireSpecialMockExamMember(
  client: SupabaseClient,
  studentId: number,
  expectedAuthId?: string,
) {
  if (!Number.isInteger(studentId) || studentId <= 0) {
    throw new Error("학생 정보가 연결된 정식 계정으로 로그인해 주세요.");
  }
  const { data: auth, error: authError } = await client.auth.getUser();
  const authId = auth.user?.id;
  if (authError || !authId || (expectedAuthId && authId !== expectedAuthId)) {
    throw new Error("로그인 계정이 변경되었습니다. 회원 정보를 다시 확인해 주세요.");
  }
  const { data: member, error } = await client.from("members")
    .select("student_id, is_active, role, can_access_special_mock_exam")
    .eq("auth_user_id", authId)
    .eq("student_id", studentId)
    .maybeSingle();
  if (error || !member || Number(member.student_id) !== studentId || !member.is_active ||
      (member.role !== "admin" && !member.can_access_special_mock_exam)) {
    throw new Error("특별 모의고사 회원 정보를 확인할 수 없습니다.");
  }
  await assertSpecialMockExamSession(client, authId);
  return authId;
}
