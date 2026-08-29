import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { normalizeLoginId, providerPassword } from "./auth.js";
import {
  buildSpecialMockExamAttemptFilter,
  countUniqueSolvedQuestions,
  type AttemptQuestionRow,
} from "./adminStudyProgress.js";
import { getAiPythonWeekAttemptIdPrefix } from "../src/types/aiPythonWeekStudy.js";
import {
  getSpecialMockExamAttemptIdPrefix,
  SPECIAL_MOCK_EXAM_AVAILABLE_ASSESSMENT_ROUNDS,
  SPECIAL_MOCK_EXAM_ROUNDS,
} from "../src/types/specialMockExam.js";
type AdminRequest = {
  action?: string;
  id?: string | number;
  title?: string;
  content?: string;
  description?: string;
  name?: string;
  loginId?: string;
  username?: string;
  className?: string;
  studentId?: number | null;
  isActive?: boolean;
  canAccessSpecialMockExam?: boolean;
};

type AdminIdentity = {
  id: number;
  auth_user_id: string;
  name: string;
  role: "admin";
};

const ATTEMPT_TABLES = [
  "study_attempts",
  "web_study_attempts",
  "ai_python_study_attempts",
  "ai_python_week_attempts",
  "special_mock_exam_attempts",
] as const;
const ATTEMPT_PAGE_SIZE = 1000;
const MEMBER_LIST_SELECT =
  "id, student_id, name, username, login_id, class_name, role, auth_user_id, is_active, can_access_special_mock_exam, must_change_password, password_changed_at, last_login_at, created_at";
const LEGACY_MEMBER_LIST_SELECT =
  "id, student_id, name, username, login_id, class_name, role, auth_user_id, is_active, must_change_password, password_changed_at, last_login_at, created_at";

type SupabaseQueryError = {
  code?: string;
  message?: string;
} | null;

export function isMissingSpecialMockExamSchema(error: SupabaseQueryError) {
  if (!error) return false;
  return (
    error.code === "42703" ||
    error.code === "42P01" ||
    error.code === "PGRST204" ||
    error.code === "PGRST205" ||
    /can_access_special_mock_exam|special_mock_exam_attempts/i.test(
      error.message ?? "",
    )
  );
}

async function loadAttemptQuestionRows(
  client: SupabaseClient,
  table: (typeof ATTEMPT_TABLES)[number],
) {
  const rows: AttemptQuestionRow[] = [];
  let from = 0;

  while (true) {
    let query = client
      .from(table)
      .select("student_id, question_id")
      .order("id", { ascending: true });
    if (table === "ai_python_week_attempts") {
      query = query.or(
        [
          `and(week.eq.week1,id.like.${getAiPythonWeekAttemptIdPrefix("week1")}%)`,
          `and(week.eq.week2,id.like.${getAiPythonWeekAttemptIdPrefix("week2")}%)`,
        ].join(","),
      );
    }
    if (table === "special_mock_exam_attempts") {
      query = query.or(
        buildSpecialMockExamAttemptFilter(
          SPECIAL_MOCK_EXAM_AVAILABLE_ASSESSMENT_ROUNDS,
          SPECIAL_MOCK_EXAM_ROUNDS,
          getSpecialMockExamAttemptIdPrefix,
        ),
      );
    }
    const { data, error } = await query.range(
      from,
      from + ATTEMPT_PAGE_SIZE - 1,
    );

    if (
      error &&
      table === "special_mock_exam_attempts" &&
      isMissingSpecialMockExamSchema(error)
    ) {
      return [];
    }
    if (error) throw error;
    const page = (data ?? []) as AttemptQuestionRow[];
    rows.push(...page);
    if (page.length < ATTEMPT_PAGE_SIZE) break;
    from += ATTEMPT_PAGE_SIZE;
  }

  return rows;
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function getBearerToken(request: Request) {
  const value = request.headers.get("authorization") ?? "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : "";
}

async function verifyAdmin(client: SupabaseClient, request: Request) {
  const token = getBearerToken(request);
  if (!token) return { error: jsonError("관리자 로그인이 필요합니다.", 401) } as const;

  const { data: authData, error: authError } = await client.auth.getUser(token);
  if (authError || !authData.user) {
    return { error: jsonError("로그인 세션이 만료되었습니다.", 401) } as const;
  }

  const { data, error } = await client
    .from("members")
    .select("id, auth_user_id, name, role")
    .eq("auth_user_id", authData.user.id)
    .eq("role", "admin")
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return { error: jsonError("관리자 권한이 없습니다.", 403) } as const;
  return { admin: data as AdminIdentity, user: authData.user as User } as const;
}

export async function handleAdminRequest(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return jsonError("관리자 서버 설정이 누락되었습니다.", 500);

  let body: AdminRequest;
  try {
    body = await request.json() as AdminRequest;
  } catch {
    return jsonError("요청 형식이 올바르지 않습니다.", 400);
  }

  const client = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const verified = await verifyAdmin(client, request);
  if ("error" in verified) return verified.error;

  if (body.action === "verify") return Response.json({ ok: true });

  if (body.action === "members.list") {
    let membersResult = await client
      .from("members")
      .select(MEMBER_LIST_SELECT)
      .order("role", { ascending: true })
      .order("class_name", { ascending: true })
      .order("name", { ascending: true });

    if (isMissingSpecialMockExamSchema(membersResult.error)) {
      membersResult = await client
        .from("members")
        .select(LEGACY_MEMBER_LIST_SELECT)
        .order("role", { ascending: true })
        .order("class_name", { ascending: true })
        .order("name", { ascending: true });
    }

    const { data, error } = membersResult;
    if (error) return jsonError(error.message, 400);

    let solvedByStudent: Map<number, number>;
    try {
      const rowsByTable = await Promise.all(
        ATTEMPT_TABLES.map((table) => loadAttemptQuestionRows(client, table)),
      );
      solvedByStudent = countUniqueSolvedQuestions(rowsByTable);
    } catch (attemptError) {
      const message =
        typeof attemptError === "object" &&
        attemptError !== null &&
        "message" in attemptError
          ? String(attemptError.message)
          : "풀이 기록을 불러오지 못했습니다.";
      return jsonError(message, 400);
    }

    return Response.json({
      ok: true,
      members: (data ?? []).map(({ auth_user_id, ...member }) => ({
        ...member,
        can_access_special_mock_exam:
          member.can_access_special_mock_exam === true,
        auth_provisioned: Boolean(auth_user_id),
        solved_question_count:
          solvedByStudent.get(
            member.student_id ?? 900_000_000 + member.id,
          ) ?? 0,
      })),
    });
  }

  if (body.action === "members.create") {
    const name = (body.name ?? "").trim();
    const loginId = normalizeLoginId(body.loginId ?? "");
    const className = (body.className ?? "광주_2반").trim();
    const username = (body.username ?? `@${loginId}`).trim();
    if (!name || !className) return jsonError("이름과 반을 입력하세요.", 400);
    if (!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(loginId)) {
      return jsonError("아이디는 영문 소문자와 숫자, 점, 밑줄, 하이픈으로 3~32자 입력하세요.", 400);
    }

    const { data, error } = await client
      .from("members")
      .insert({
        student_id: Number.isInteger(body.studentId) ? body.studentId : null,
        name,
        username: username.startsWith("@") ? username : `@${username}`,
        login_id: loginId,
        class_name: className,
        role: "member",
        is_active: true,
        must_change_password: true,
      })
      .select("id, student_id, name, username, login_id, class_name, role, is_active, must_change_password, created_at")
      .single();
    if (error) {
      const message = error.code === "23505" ? "이미 사용 중인 아이디 또는 교육생 번호입니다." : error.message;
      return jsonError(message, 409);
    }
    return Response.json({
      ok: true,
      member: {
        ...data,
        can_access_special_mock_exam: false,
        auth_provisioned: false,
        solved_question_count: 0,
      },
    });
  }

  if (body.action === "members.setActive") {
    const memberId = Number(body.id);
    if (!Number.isInteger(memberId) || typeof body.isActive !== "boolean") {
      return jsonError("회원 상태 요청이 올바르지 않습니다.", 400);
    }
    if (memberId === verified.admin.id && !body.isActive) {
      return jsonError("현재 관리자 계정은 비활성화할 수 없습니다.", 400);
    }
    const { error } = await client.from("members").update({ is_active: body.isActive }).eq("id", memberId);
    return error ? jsonError(error.message, 400) : Response.json({ ok: true });
  }

  if (body.action === "members.setSpecialMockExamAccess") {
    const memberId = Number(body.id);
    if (
      !Number.isInteger(memberId) ||
      typeof body.canAccessSpecialMockExam !== "boolean"
    ) {
      return jsonError("특별 모의고사 권한 요청이 올바르지 않습니다.", 400);
    }
    const { data, error } = await client
      .from("members")
      .update({
        can_access_special_mock_exam: body.canAccessSpecialMockExam,
      })
      .eq("id", memberId)
      .eq("role", "member")
      .select("id")
      .maybeSingle();
    if (isMissingSpecialMockExamSchema(error)) {
      return jsonError(
        "특별 모의고사 권한 DB 업데이트가 아직 적용되지 않았습니다.",
        503,
      );
    }
    if (error) return jsonError(error.message, 400);
    if (!data) return jsonError("권한을 변경할 회원을 찾을 수 없습니다.", 404);
    return Response.json({ ok: true });
  }

  if (body.action === "members.resetPassword") {
    const memberId = Number(body.id);
    if (!Number.isInteger(memberId)) return jsonError("회원 번호가 올바르지 않습니다.", 400);
    const { data: member, error: findError } = await client
      .from("members")
      .select("id, role, auth_user_id")
      .eq("id", memberId)
      .maybeSingle();
    if (findError || !member) return jsonError("회원을 찾을 수 없습니다.", 404);
    if (member.role === "admin") return jsonError("관리자 비밀번호는 내정보에서 변경하세요.", 400);

    if (member.auth_user_id) {
      const { error: authError } = await client.auth.admin.updateUserById(member.auth_user_id, {
        password: providerPassword("1234"),
      });
      if (authError) return jsonError("인증 비밀번호를 초기화하지 못했습니다.", 500);
    }
    const { error } = await client
      .from("members")
      .update({ must_change_password: true, password_changed_at: null })
      .eq("id", memberId);
    return error ? jsonError(error.message, 400) : Response.json({ ok: true });
  }

  if (body.action === "board.list") {
    const [{ data: posts, error: postsError }, { data: authors, error: authorsError }] = await Promise.all([
      client.from("anonymous_posts").select("id, title, content, created_at, updated_at").order("created_at", { ascending: false }),
      client.from("anonymous_post_authors").select("post_id, member_id"),
    ]);
    if (postsError || authorsError) return jsonError(postsError?.message || authorsError?.message || "게시글을 불러오지 못했습니다.", 400);

    const memberIds = [...new Set((authors ?? []).map((author) => author.member_id))];
    const { data: members, error: membersError } = memberIds.length
      ? await client.from("members").select("id, name, username, login_id, class_name").in("id", memberIds)
      : { data: [], error: null };
    if (membersError) return jsonError(membersError.message, 400);

    const authorByPost = new Map((authors ?? []).map((author) => [author.post_id, author.member_id]));
    const memberById = new Map((members ?? []).map((member) => [member.id, member]));
    return Response.json({
      ok: true,
      posts: (posts ?? []).map((post) => {
        const memberId = authorByPost.get(post.id);
        return { ...post, author: memberId ? memberById.get(memberId) ?? null : null };
      }),
    });
  }

  if (body.action === "bang.rooms.list") {
    const { data, error } = await client.from("bang_rooms").select("id, room_data").order("updated_at", { ascending: false });
    if (error) return jsonError(error.message, 400);
    return Response.json({
      ok: true,
      rooms: (data ?? []).map((row) => ({ ...(row.room_data as Record<string, unknown>), id: row.id })),
    });
  }

  let error = null;
  if (body.action === "gallery.update" && body.id) {
    ({ error } = await client.from("gallery_photos").update({ title: body.title, description: body.description }).eq("id", body.id));
  } else if (body.action === "gallery.delete" && body.id) {
    ({ error } = await client.from("gallery_photos").delete().eq("id", body.id));
  } else if (body.action === "board.update" && body.id) {
    ({ error } = await client.from("anonymous_posts").update({ title: body.title, content: body.content, updated_at: new Date().toISOString() }).eq("id", body.id));
  } else if (body.action === "board.delete" && body.id) {
    ({ error } = await client.from("anonymous_posts").delete().eq("id", body.id));
  } else if (body.action === "bang.room.delete" && body.id) {
    ({ error } = await client.from("bang_rooms").delete().eq("id", body.id));
  } else {
    return jsonError("지원하지 않는 관리자 요청입니다.", 400);
  }

  return error ? jsonError(error.message, 400) : Response.json({ ok: true });
}

export default { fetch: handleAdminRequest };
