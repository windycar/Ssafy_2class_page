import type { SupabaseClient } from "@supabase/supabase-js";

import {
  getBaseballBearerToken,
  resolveBaseballMemberIdentity,
} from "./baseballAuth.ts";

export interface BaseballRoomMemberIdentity {
  memberId: number;
  studentId: number;
  authId: string;
  name: string;
  username: string;
}

interface BaseballRoomMemberRow {
  id: number | string;
  student_id: number | string | null;
  auth_user_id: string | null;
  is_active: boolean;
  name: string | null;
  username: string | null;
}

export type BaseballRoomAuthenticationResult =
  | { ok: true; identity: BaseballRoomMemberIdentity }
  | {
      ok: false;
      status: 401 | 403;
      code: "AUTH_REQUIRED" | "AUTH_EXPIRED" | "MEMBER_FORBIDDEN";
    };

/**
 * Resolves lobby identity from the verified Auth user and the active members row.
 * No profile field sent by a browser participates in this decision.
 */
export async function authenticateBaseballRoomMember(
  serviceClient: SupabaseClient,
  request: Request,
): Promise<BaseballRoomAuthenticationResult> {
  const token = getBaseballBearerToken(request);
  if (!token) return { ok: false, status: 401, code: "AUTH_REQUIRED" };

  const { data: authData, error: authError } = await serviceClient.auth.getUser(token);
  if (authError || !authData.user) {
    return { ok: false, status: 401, code: "AUTH_EXPIRED" };
  }

  const { data, error } = await serviceClient
    .from("members")
    .select("id, student_id, auth_user_id, is_active, name, username")
    .eq("auth_user_id", authData.user.id)
    .eq("is_active", true)
    .maybeSingle();
  if (error || !data) {
    return { ok: false, status: 403, code: "MEMBER_FORBIDDEN" };
  }

  const row = data as BaseballRoomMemberRow;
  const baseIdentity = resolveBaseballMemberIdentity(row, authData.user.id);
  if (
    !baseIdentity
    || typeof row.name !== "string"
    || row.name.trim().length === 0
    || typeof row.username !== "string"
  ) {
    return { ok: false, status: 403, code: "MEMBER_FORBIDDEN" };
  }

  return {
    ok: true,
    identity: {
      ...baseIdentity,
      name: row.name.trim(),
      username: row.username,
    },
  };
}
