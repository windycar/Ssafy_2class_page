const PROFILE_REFRESH_EVENTS = new Set([
  "INITIAL_SESSION",
  "SIGNED_IN",
  "TOKEN_REFRESHED",
  "USER_UPDATED",
]);

export function shouldRefreshProfileForAuthEvent(
  event: string,
  hasSession: boolean,
) {
  return hasSession && PROFILE_REFRESH_EVENTS.has(event);
}

export function profileMatchesSession(
  profileAuthId: string | null | undefined,
  sessionAuthId: string | null | undefined,
) {
  return Boolean(profileAuthId && sessionAuthId && profileAuthId === sessionAuthId);
}
