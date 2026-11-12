import assert from "node:assert/strict";
import test from "node:test";
import { handleAuthRequest } from "../api/auth.ts";

test("월말평가 연습 문제는 승인 회원과 활성 관리자에게만 반환한다", async (t) => {
  const originalUrl = process.env.VITE_SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.VITE_SUPABASE_URL = "https://monthly-practice.test";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "mock-service-role";
  t.after(() => {
    if (originalUrl === undefined) delete process.env.VITE_SUPABASE_URL;
    else process.env.VITE_SUPABASE_URL = originalUrl;
    if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  });

  const member = {
    id: 1,
    auth_user_id: "mock-auth-user",
    student_id: 1234 as number | null,
    is_active: true,
    role: "member",
    can_access_special_mock_exam: false,
  };
  t.mock.method(globalThis, "fetch", async (input: RequestInfo | URL) => {
    const url = new URL(String(input));
    assert.equal(url.hostname, "monthly-practice.test");
    if (url.pathname === "/auth/v1/user") return Response.json({ id: member.auth_user_id });
    assert.equal(url.pathname, "/rest/v1/members");
    assert.equal(url.searchParams.get("auth_user_id"), `eq.${member.auth_user_id}`);
    return Response.json([member]);
  });

  const read = (setId: string, authenticated = true) => handleAuthRequest(new Request("http://localhost/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authenticated ? { Authorization: "Bearer mock-token" } : {}),
    },
    body: JSON.stringify({ action: "monthly-practice.read", setId }),
  }));

  assert.equal((await read("algo-set-1", false)).status, 401);
  assert.equal((await read("algo-set-1")).status, 403);
  member.can_access_special_mock_exam = true;
  const approved = await read("algo-set-1");
  assert.equal(approved.status, 200);
  assert.equal(approved.headers.get("Cache-Control"), "private, no-store");
  assert.match((await approved.json()).content, /연속해서 커지는 당근/);
  assert.equal((await read("../private")).status, 404);
  member.student_id = null;
  assert.equal((await read("algo-set-1")).status, 403);
  member.role = "admin";
  member.can_access_special_mock_exam = false;
  assert.equal((await read("algo-set-1")).status, 200);
  member.is_active = false;
  assert.equal((await read("algo-set-1")).status, 403);
});
