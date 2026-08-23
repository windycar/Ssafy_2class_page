/**
 * Removed because the legacy endpoint trusted browser-supplied student/session IDs.
 * All leave transitions now use the authenticated, idempotent room command API.
 */
export async function handleLegacyBaseballLeaveRequest(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "POST" },
    });
  }
  return Response.json(
    { ok: false, code: "LEGACY_ENDPOINT_DISABLED" },
    { status: 410 },
  );
}

export default { fetch: handleLegacyBaseballLeaveRequest };
