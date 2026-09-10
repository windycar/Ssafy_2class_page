import type { SupabaseClient } from "@supabase/supabase-js";

export interface BaseballMemberIdentity {
  memberId: number;
  studentId: number;
  authId: string;
}

export interface BaseballMemberRow {
  id: number | string;
  student_id: number | string | null;
  auth_user_id: string | null;
  is_active: boolean;
}

export type BaseballAuthenticationResult =
  | { ok: true; identity: BaseballMemberIdentity }
  | {
      ok: false;
      status: 401 | 403;
      code: "AUTH_REQUIRED" | "AUTH_EXPIRED" | "MEMBER_FORBIDDEN";
    };

const STUDENT_ID_FALLBACK_OFFSET = 900_000_000n;
const MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);

function safePositiveInteger(value: number | string): number | null {
  let parsed: bigint;
  try {
    if (typeof value === "number" && !Number.isSafeInteger(value)) return null;
    if (typeof value === "string" && !/^[1-9]\d*$/.test(value)) return null;
    parsed = BigInt(value);
  } catch {
    return null;
  }
  if (parsed <= 0n || parsed > MAX_SAFE_INTEGER) return null;
  return Number(parsed);
}

export function getBaseballBearerToken(request: Request): string {
  const authorization = request.headers.get("authorization")?.trim() ?? "";
  const match = /^Bearer\s+([^\s]+)$/i.exec(authorization);
  return match?.[1] ?? "";
}

/**
 * Resolves the only student identity that gameplay code is allowed to use.
 * Client-provided student/session identifiers are deliberately ignored.
 */
export function resolveBaseballMemberIdentity(
  row: BaseballMemberRow,
  authenticatedUserId: string,
): BaseballMemberIdentity | null {
  if (!row.is_active || !row.auth_user_id || row.auth_user_id !== authenticatedUserId) {
    return null;
  }

  const memberId = safePositiveInteger(row.id);
  if (memberId === null) return null;
  const explicitStudentId = row.student_id === null
    ? null
    : safePositiveInteger(row.student_id);
  if (row.student_id !== null && explicitStudentId === null) return null;

  const fallback = STUDENT_ID_FALLBACK_OFFSET + BigInt(memberId);
  if (fallback > MAX_SAFE_INTEGER) return null;
  return {
    memberId,
    studentId: explicitStudentId ?? Number(fallback),
    authId: authenticatedUserId,
  };
}

export async function authenticateBaseballMember(
  serviceClient: SupabaseClient,
  request: Request,
): Promise<BaseballAuthenticationResult> {
  const token = getBaseballBearerToken(request);
  if (!token) return { ok: false, status: 401, code: "AUTH_REQUIRED" };

  const { data: authData, error: authError } = await serviceClient.auth.getUser(token);
  if (authError || !authData.user) {
    return { ok: false, status: 401, code: "AUTH_EXPIRED" };
  }

  const { data, error } = await serviceClient
    .from("members")
    .select("id, student_id, auth_user_id, is_active")
    .eq("auth_user_id", authData.user.id)
    .eq("is_active", true)
    .maybeSingle();
  if (error || !data) {
    return { ok: false, status: 403, code: "MEMBER_FORBIDDEN" };
  }

  const identity = resolveBaseballMemberIdentity(
    data as BaseballMemberRow,
    authData.user.id,
  );
  return identity
    ? { ok: true, identity }
    : { ok: false, status: 403, code: "MEMBER_FORBIDDEN" };
}
