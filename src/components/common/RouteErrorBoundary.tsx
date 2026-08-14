import { useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";

const MODULE_RECOVERY_KEY = "ssafy-gwangju-2-route-module-recovery";
const MODULE_RECOVERY_COOLDOWN_MS = 30_000;
const DYNAMIC_MODULE_ERROR =
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i;

function getErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`.trim();
  }
  if (error instanceof Error) return error.message;
  return String(error ?? "알 수 없는 오류");
}

function canRetryModuleLoad(path: string) {
  try {
    const saved = JSON.parse(
      sessionStorage.getItem(MODULE_RECOVERY_KEY) ?? "null",
    ) as { path?: string; attemptedAt?: number } | null;
    return (
      saved?.path !== path ||
      typeof saved.attemptedAt !== "number" ||
      Date.now() - saved.attemptedAt > MODULE_RECOVERY_COOLDOWN_MS
    );
  } catch {
    return true;
  }
}

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const message = getErrorMessage(error);
  const isDynamicModuleError = DYNAMIC_MODULE_ERROR.test(message);

  useEffect(() => {
    console.error("[router] 화면을 불러오지 못했습니다.", error);
    if (!isDynamicModuleError) return;

    const path = `${window.location.pathname}${window.location.search}`;
    if (!canRetryModuleLoad(path)) return;

    try {
      sessionStorage.setItem(
        MODULE_RECOVERY_KEY,
        JSON.stringify({ path, attemptedAt: Date.now() }),
      );
    } catch {
      // 세션 저장소를 사용할 수 없어도 새로고침 복구는 계속 시도합니다.
    }
    window.location.reload();
  }, [error, isDynamicModuleError]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-[0_20px_60px_rgba(30,41,59,0.10)] sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl font-black text-violet-700">
          !
        </span>
        <h1 className="mt-5 text-2xl font-black text-slate-900">
          {isDynamicModuleError
            ? "새 화면을 불러오지 못했습니다."
            : "예상치 못한 오류가 발생했습니다."}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {isDynamicModuleError
            ? "개발 서버가 갱신되는 순간 이전 파일을 요청했습니다. 다시 불러오면 정상적으로 복구됩니다."
            : "화면을 다시 불러오거나 학습 목록으로 돌아가 주세요."}
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-violet-800"
          >
            다시 불러오기
          </button>
          <a
            href="/study"
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-extrabold text-slate-600 transition hover:border-violet-200 hover:text-violet-700"
          >
            학습 목록으로 이동
          </a>
        </div>
        <p className="mt-5 break-words text-left text-[11px] leading-5 text-slate-400">
          {message}
        </p>
      </section>
    </main>
  );
}
