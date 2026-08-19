import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type MemberRole = "member" | "admin";

type MemberRow = {
  id: number;
  student_id: number | null;
  name: string;
  username: string;
  login_id: string;
  class_name: string;
  role: MemberRole;
  auth_user_id: string | null;
  auth_email: string | null;
  is_active: boolean;
  can_access_special_mock_exam: boolean;
  must_change_password: boolean;
  password_changed_at: string | null;
  last_login_at: string | null;
};

type AuthRequestBody = {
  action?: "login" | "profile" | "change-password";
  loginId?: string;
  password?: string;
  currentPassword?: string;
  newPassword?: string;
};

const MEMBER_SELECT = `
  id,
  student_id,
  name,
  username,
  login_id,
  class_name,
  role,
  auth_user_id,
  auth_email,
  is_active,
  can_access_special_mock_exam,
  must_change_password,
  password_changed_at,
  last_login_at
`;

const LEGACY_MEMBER_SELECT = `
  id,
  student_id,
  name,
  username,
  login_id,
  class_name,
  role,
  auth_user_id,
  auth_email,
  is_active,
  must_change_password,
  password_changed_at,
  last_login_at
`;

type SupabaseQueryError = {
  code?: string;
  message?: string;
} | null;

export function isMissingSpecialMockExamAccessColumn(
  error: SupabaseQueryError,
) {
  if (!error) return false;
  return (
    error.code === "42703" ||
    error.code === "PGRST204" ||
    /can_access_special_mock_exam/i.test(error.message ?? "")
  );
}

function normalizeMemberRow(
  member: Omit<MemberRow, "can_access_special_mock_exam"> &
    Partial<Pick<MemberRow, "can_access_special_mock_exam">>,
): MemberRow {
  return {
    ...member,
    can_access_special_mock_exam:
      member.can_access_special_mock_exam === true,
  };
}

const LEGACY_STUDY_ATTEMPT_TABLES = [
  "study_attempts",
  "web_study_attempts",
  "ai_python_study_attempts",
] as const;

export function normalizeLoginId(value: string) {
  return value.trim().replace(/^@/, "").toLocaleLowerCase("en-US");
}

export function providerPassword(rawPassword: string) {
  const pepper =
    process.env.AUTH_PASSWORD_PEPPER || "ssafy-g2-community-v1";

  return `G2@${rawPassword}::${pepper}`;
}

export function studyOwnerStudentId(
  member: Pick<MemberRow, "id" | "student_id">,
) {
  return member.student_id ?? 900_000_000 + member.id;
}

async function claimLegacyStudyAttempts(
  adminClient: SupabaseClient,
  member: MemberRow,
  authUserId: string,
) {
  const studentId = studyOwnerStudentId(member);
  const results = await Promise.all(
    LEGACY_STUDY_ATTEMPT_TABLES.map(async (table) => {
      const { error } = await adminClient
        .from(table)
        .update({ auth_user_id: authUserId })
        .eq("student_id", studentId)
        .is("auth_user_id", null);

      return { table, error };
    }),
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) {
    throw new Error(`${failed.table}: ${failed.error.message}`);
  }
}

function memberEmail(loginId: string) {
  const safeId = loginId.replace(/[^a-z0-9._-]/g, "-");

  return `${safeId}@members.g2.local`;
}

function jsonError(message: string, status: number) {
  return Response.json(
    {
      error: message,
    },
    {
      status,
    },
  );
}

function toProfile(member: MemberRow) {
  return {
    memberId: member.id,
    studentId: member.student_id,
    authId: member.auth_user_id,
    name: member.name,
    username: member.username,
    loginId: member.login_id,
    className: member.class_name,
    role: member.role,
    isActive: member.is_active,
    canAccessSpecialMockExam:
      member.role === "admin" || member.can_access_special_mock_exam,
    mustChangePassword: member.must_change_password,
    passwordChangedAt: member.password_changed_at,
    lastLoginAt: member.last_login_at,
  };
}

function bearerToken(request: Request) {
  const value = request.headers.get("authorization") ?? "";

  return value.startsWith("Bearer ")
    ? value.slice(7).trim()
    : "";
}

/**
 * 중요
 *
 * service_role용 client와
 * 일반 사용자 로그인(signInWithPassword)용 client를
 * 절대로 같이 사용하지 않습니다.
 *
 * signInWithPassword()를 호출하면 해당 client가
 * 일반 사용자의 세션을 가지게 되므로 이후 DB 요청이
 * authenticated 권한으로 실행될 수 있습니다.
 */
function createServerClient(
  supabaseUrl: string,
  serviceKey: string,
) {
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

async function verifiedMember(
  adminClient: SupabaseClient,
  request: Request,
) {
  const token = bearerToken(request);

  if (!token) {
    return {
      error: jsonError("로그인이 필요합니다.", 401),
    } as const;
  }

  const {
    data: userData,
    error: userError,
  } = await adminClient.auth.getUser(token);

  if (userError || !userData.user) {
    return {
      error: jsonError(
        "로그인 세션이 만료되었습니다.",
        401,
      ),
    } as const;
  }

  let memberResult = await adminClient
    .from("members")
    .select(MEMBER_SELECT)
    .eq("auth_user_id", userData.user.id)
    .maybeSingle();

  if (isMissingSpecialMockExamAccessColumn(memberResult.error)) {
    memberResult = await adminClient
      .from("members")
      .select(LEGACY_MEMBER_SELECT)
      .eq("auth_user_id", userData.user.id)
      .maybeSingle();
  }

  const { data, error } = memberResult;

  if (error) {
    console.error(
      "회원 조회 실패:",
      error,
    );

    return {
      error: jsonError(
        "등록된 회원 정보를 찾을 수 없습니다.",
        403,
      ),
    } as const;
  }

  if (!data) {
    return {
      error: jsonError(
        "등록된 회원 정보를 찾을 수 없습니다.",
        403,
      ),
    } as const;
  }

  const member = normalizeMemberRow(data as MemberRow);

  if (!member.is_active) {
    return {
      error: jsonError(
        "비활성화된 계정입니다. 관리자에게 문의하세요.",
        403,
      ),
    } as const;
  }

  return {
    member,
    token,
  } as const;
}

export async function handleAuthRequest(request: Request) {
  if (request.method !== "POST") {
    return new Response(
      "Method not allowed",
      {
        status: 405,
        headers: {
          Allow: "POST",
        },
      },
    );
  }

  const supabaseUrl =
    process.env.VITE_SUPABASE_URL;

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error(
      "Supabase 서버 환경변수가 없습니다.",
      {
        hasUrl: Boolean(supabaseUrl),
        hasServiceKey: Boolean(serviceKey),
      },
    );

    return jsonError(
      "인증 서버 설정이 누락되었습니다.",
      500,
    );
  }

  let body: AuthRequestBody;

  try {
    body =
      (await request.json()) as AuthRequestBody;
  } catch {
    return jsonError(
      "요청 형식이 올바르지 않습니다.",
      400,
    );
  }

  /**
   * 핵심
   *
   * adminClient
   * - service_role 권한 유지
   * - members SELECT / UPDATE
   * - auth.admin.*
   *
   * sessionClient
   * - signInWithPassword 전용
   * - 로그인 후 authenticated 세션을 가져도 상관없음
   *
   * 두 client를 절대 합치지 않습니다.
   */
  const adminClient = createServerClient(
    supabaseUrl,
    serviceKey,
  );

  const sessionClient = createServerClient(
    supabaseUrl,
    serviceKey,
  );

  // ==========================================================
  // LOGIN
  // ==========================================================

  if (body.action === "login") {
    const loginId =
      normalizeLoginId(body.loginId ?? "");

    const rawPassword =
      body.password ?? "";

    if (!loginId || !rawPassword) {
      return jsonError(
        "아이디와 비밀번호를 입력하세요.",
        400,
      );
    }

    /**
     * members 조회는 반드시 adminClient
     */
    let memberResult = await adminClient
      .from("members")
      .select(MEMBER_SELECT)
      .eq("login_id", loginId)
      .maybeSingle();

    if (isMissingSpecialMockExamAccessColumn(memberResult.error)) {
      memberResult = await adminClient
        .from("members")
        .select(LEGACY_MEMBER_SELECT)
        .eq("login_id", loginId)
        .maybeSingle();
    }

    const { data, error } = memberResult;

    if (error) {
      console.error(
        "로그인 회원 조회 실패:",
        error,
      );

      return jsonError(
        "회원 정보를 확인하지 못했습니다.",
        500,
      );
    }

    if (
      !data ||
      !normalizeMemberRow(data as MemberRow).is_active
    ) {
      return jsonError(
        "아이디 또는 비밀번호가 올바르지 않습니다.",
        401,
      );
    }

    let member = normalizeMemberRow(data as MemberRow);

    let authUserId =
      member.auth_user_id;

    const email =
      member.auth_email ||
      memberEmail(member.login_id);

    // --------------------------------------------------------
    // 아직 Supabase Auth 사용자가 연결되지 않은 경우
    // --------------------------------------------------------

    if (!authUserId) {
      const initialPasswordValid =
        member.role === "admin"
          ? Boolean(process.env.ADMIN_PASSWORD) &&
            rawPassword ===
              process.env.ADMIN_PASSWORD
          : rawPassword === "1234";

      if (!initialPasswordValid) {
        return jsonError(
          "아이디 또는 비밀번호가 올바르지 않습니다.",
          401,
        );
      }

      /**
       * 관리자 작업이므로 adminClient 사용
       */
      const {
        data: created,
        error: createError,
      } =
        await adminClient.auth.admin.createUser({
          email,
          password:
            providerPassword(rawPassword),
          email_confirm: true,

          user_metadata: {
            name: member.name,
            login_id: member.login_id,
          },

          app_metadata: {
            member_id: member.id,
            role: member.role,
          },
        });

      if (
        createError ||
        !created.user
      ) {
        console.error(
          "Supabase Auth 사용자 생성 실패:",
          createError,
        );

        return jsonError(
          "계정을 준비하지 못했습니다. 관리자에게 문의하세요.",
          500,
        );
      }

      authUserId =
        created.user.id;

      /**
       * members UPDATE 역시 adminClient 사용
       */
      const {
        data: updated,
        error: updateError,
      } = await adminClient
        .from("members")
        .update({
          auth_user_id: authUserId,
          auth_email: email,
        })
        .eq("id", member.id)
        .is("auth_user_id", null)
        .select(LEGACY_MEMBER_SELECT)
        .single();

      if (
        updateError ||
        !updated
      ) {
        console.error(
          "회원 Auth 연결 실패:",
          updateError,
        );

        /**
         * DB 연결 실패하면 만들어진 Auth 사용자도 삭제
         */
        await adminClient.auth.admin
          .deleteUser(authUserId)
          .catch(() => undefined);

        return jsonError(
          updateError?.message ||
            "회원 계정 연결에 실패했습니다. 다시 시도하세요.",
          409,
        );
      }

      member = normalizeMemberRow({
        ...(updated as MemberRow),
        can_access_special_mock_exam:
          member.can_access_special_mock_exam,
      });
    }

    try {
      await claimLegacyStudyAttempts(
        adminClient,
        member,
        authUserId,
      );
    } catch (claimError) {
      console.error(
        "기존 학습 기록 소유권 연결 실패:",
        claimError,
      );

      return jsonError(
        "학습 기록을 현재 계정에 연결하지 못했습니다. 다시 시도하세요.",
        500,
      );
    }

    // --------------------------------------------------------
    // 사용자 로그인
    // --------------------------------------------------------

    /**
     * 여기서 adminClient를 사용하면 안 됩니다.
     *
     * signInWithPassword를 호출하면 client가
     * 일반 사용자 세션을 가지게 됩니다.
     */
    const {
      data: sessionData,
      error: loginError,
    } =
      await sessionClient.auth.signInWithPassword({
        email,
        password:
          providerPassword(rawPassword),
      });

    if (
      loginError ||
      !sessionData.session
    ) {
      return jsonError(
        "아이디 또는 비밀번호가 올바르지 않습니다.",
        401,
      );
    }

    // --------------------------------------------------------
    // 마지막 로그인 시간
    // --------------------------------------------------------

    const loginAt =
      new Date().toISOString();

    /**
     * DB UPDATE는 다시 adminClient.
     *
     * sessionClient로 하면 authenticated 권한이므로
     * permission denied가 발생할 수 있습니다.
     */
    const {
      error: loginTimeError,
    } = await adminClient
      .from("members")
      .update({
        last_login_at: loginAt,
      })
      .eq("id", member.id);

    if (loginTimeError) {
      /**
       * 마지막 로그인 기록 실패 때문에
       * 로그인 자체를 실패시키지는 않습니다.
       */
      console.error(
        "last_login_at 갱신 실패:",
        loginTimeError,
      );
    }

    member = {
      ...member,
      auth_user_id: authUserId,
      auth_email: email,
      last_login_at: loginAt,
    };

    return Response.json({
      session:
        sessionData.session,

      profile:
        toProfile(member),
    });
  }

  // ==========================================================
  // PROFILE
  // ==========================================================

  if (body.action === "profile") {
    const verified =
      await verifiedMember(
        adminClient,
        request,
      );

    if ("error" in verified) {
      return verified.error;
    }

    return Response.json({
      profile:
        toProfile(verified.member),
    });
  }

  // ==========================================================
  // CHANGE PASSWORD
  // ==========================================================

  if (
    body.action ===
    "change-password"
  ) {
    const verified =
      await verifiedMember(
        adminClient,
        request,
      );

    if ("error" in verified) {
      return verified.error;
    }

    const currentPassword =
      body.currentPassword ?? "";

    const newPassword =
      body.newPassword ?? "";

    if (!currentPassword) {
      return jsonError(
        "현재 비밀번호를 입력하세요.",
        400,
      );
    }

    if (
      newPassword.length < 4
    ) {
      return jsonError(
        "새 비밀번호는 4자 이상이어야 합니다.",
        400,
      );
    }

    if (
      newPassword === "1234"
    ) {
      return jsonError(
        "초기 비밀번호 1234는 새 비밀번호로 사용할 수 없습니다.",
        400,
      );
    }

    if (
      newPassword === currentPassword
    ) {
      return jsonError(
        "현재 비밀번호와 다른 비밀번호를 입력하세요.",
        400,
      );
    }

    const email =
      verified.member.auth_email ||
      memberEmail(
        verified.member.login_id,
      );

    // --------------------------------------------------------
    // 현재 비밀번호 확인
    // --------------------------------------------------------

    /**
     * 중요:
     * 현재 비밀번호 확인은 sessionClient로 합니다.
     *
     * adminClient에서 signInWithPassword하면 안 됩니다.
     */
    const {
      error: currentError,
    } =
      await sessionClient.auth.signInWithPassword({
        email,
        password:
          providerPassword(
            currentPassword,
          ),
      });

    if (currentError) {
      return jsonError(
        "현재 비밀번호가 올바르지 않습니다.",
        401,
      );
    }

    // --------------------------------------------------------
    // 실제 비밀번호 변경
    // --------------------------------------------------------

    /**
     * service_role 권한을 계속 유지하고 있는
     * adminClient로 비밀번호 변경
     */
    const {
      error: updateAuthError,
    } =
      await adminClient.auth.admin.updateUserById(
        verified.member
          .auth_user_id as string,
        {
          password:
            providerPassword(
              newPassword,
            ),
        },
      );

    if (updateAuthError) {
      console.error(
        "Supabase Auth 비밀번호 변경 실패:",
        updateAuthError,
      );

      return jsonError(
        "비밀번호를 변경하지 못했습니다.",
        500,
      );
    }

    // --------------------------------------------------------
    // members 상태 갱신
    // --------------------------------------------------------

    const changedAt =
      new Date().toISOString();

    /**
     * 중요:
     * 여기 역시 sessionClient가 아니라
     * adminClient를 사용합니다.
     */
    const {
      data: updated,
      error: updateMemberError,
    } = await adminClient
      .from("members")
      .update({
        must_change_password: false,
        password_changed_at:
          changedAt,
      })
      .eq(
        "id",
        verified.member.id,
      )
      .select(LEGACY_MEMBER_SELECT)
      .single();

    if (
      updateMemberError ||
      !updated
    ) {
      console.error(
        "비밀번호 변경 후 members 갱신 실패:",
        updateMemberError,
      );

      /**
       * Auth 비밀번호는 이미 변경됐기 때문에
       * members 갱신이 실패하면 기존 비밀번호로 되돌립니다.
       *
       * 이렇게 해야
       * "비밀번호는 바뀌었는데 화면에서는 실패"
       * 상태가 생기지 않습니다.
       */
      const {
        error: rollbackError,
      } =
        await adminClient.auth.admin.updateUserById(
          verified.member
            .auth_user_id as string,
          {
            password:
              providerPassword(
                currentPassword,
              ),
          },
        );

      if (rollbackError) {
        console.error(
          "비밀번호 롤백 실패:",
          rollbackError,
        );
      }

      return jsonError(
        updateMemberError?.message ??
          "회원 정보를 갱신하지 못했습니다.",
        500,
      );
    }

    return Response.json({
      ok: true,
      profile:
        toProfile(
          normalizeMemberRow({
            ...(updated as MemberRow),
            can_access_special_mock_exam:
              verified.member.can_access_special_mock_exam,
          }),
        ),
    });
  }

  return jsonError(
    "지원하지 않는 인증 요청입니다.",
    400,
  );
}

export default {
  fetch: handleAuthRequest,
};
