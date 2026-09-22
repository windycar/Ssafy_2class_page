import assert from "node:assert/strict";
import test from "node:test";
import { handleAuthRequest } from "../api/auth.ts";

test("반 명단 API는 로그인하지 않은 요청을 거부한다", async () => {
  const previousUrl = process.env.VITE_SUPABASE_URL;
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.VITE_SUPABASE_URL = "http://localhost:54321";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
  try {
    const response = await handleAuthRequest(new Request("http://localhost/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "team-rosters" }),
    }));
    assert.equal(response.status, 401);
  } finally {
    if (previousUrl === undefined) delete process.env.VITE_SUPABASE_URL;
    else process.env.VITE_SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
  }
});
