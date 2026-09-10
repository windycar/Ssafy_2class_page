import type { SupabaseClient } from "@supabase/supabase-js";

export type BaseballRealtimeAuthResult =
  | { ok: true; authId: string }
  | { ok: false; reason: "AUTH_ERROR" | "REALTIME_ERROR" };

/**
 * Verifies the current session against Supabase Auth, then refreshes the JWT
 * used by private Realtime channel authorization before a channel is created.
 */
export async function authenticateBaseballRealtime(
  client: Pick<SupabaseClient, "auth" | "realtime">,
  expectedAuthId?: string,
): Promise<BaseballRealtimeAuthResult> {
  let accessToken: string;
  try {
    const { data, error } = await client.auth.getSession();
    if (error || !data.session?.access_token) {
      return { ok: false, reason: "AUTH_ERROR" };
    }
    accessToken = data.session.access_token;
  } catch {
    return { ok: false, reason: "AUTH_ERROR" };
  }

  try {
    const { data, error } = await client.auth.getUser(accessToken);
    if (error || !data.user || (expectedAuthId && data.user.id !== expectedAuthId)) {
      return { ok: false, reason: "AUTH_ERROR" };
    }

    // No explicit token is passed: the Supabase client's access-token callback
    // remains responsible for subsequent token refreshes and reconnects.
    await client.realtime.setAuth();
    return { ok: true, authId: data.user.id };
  } catch {
    return { ok: false, reason: "REALTIME_ERROR" };
  }
}
