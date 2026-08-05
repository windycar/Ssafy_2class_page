import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { softenAnonymousTone } from "../src/utils/softenAnonymousTone.ts";

test("익명 글 문장 끝맺음은 중복 문장부호 없이 정리된다", () => {
  const result = softenAnonymousTone("서로 배려했으면 좋겠어요!!!");
  assert.match(result, /^서로 배려했으면 좋겠어요(?:\.|요\.|습니다\.)$/);
  assert.doesNotMatch(result, /!!!/);
});

test("커뮤니티 마이그레이션은 익명 접근을 제거하고 작성자 감사 테이블을 분리한다", () => {
  const migration = readFileSync("supabase/migrations/20260805_auth_community.sql", "utf8");
  assert.match(migration, /create table if not exists public\.anonymous_post_authors/);
  assert.match(migration, /revoke all on table public\.anonymous_post_authors from anon, authenticated/);
  assert.match(migration, /revoke all on function public\.create_anonymous_post\(text, text\) from public, anon/);
  assert.match(migration, /grant execute on function public\.create_anonymous_post\(text, text\) to authenticated/);
  assert.doesNotMatch(migration, /grant select[^;]*anonymous_post_authors[^;]*authenticated/i);
});

test("회원·공구·그라운드룰 테이블에 RLS와 명시적 권한이 선언된다", () => {
  const migration = readFileSync("supabase/migrations/20260805_auth_community.sql", "utf8");
  for (const table of ["members", "coffee_orders", "coffee_order_items", "ground_rules", "ground_rule_likes"]) {
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`));
    assert.match(migration, new RegExp(`revoke all on table public\\.${table} from anon, authenticated`));
  }
  assert.match(migration, /coffee_orders_one_active_idx/);
  assert.match(migration, /participant_user_id = \(select auth\.uid\(\)\)/);
});
