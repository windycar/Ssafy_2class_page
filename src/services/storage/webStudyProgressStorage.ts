import type { WebStudyAttempt, WebStudyProgress } from "../../types/webStudy";

const STORAGE_VERSION = "v1";
const KEY_PREFIX = `ssafy-gwangju-2-web-study-progress:${STORAGE_VERSION}`;
const PENDING_KEY_PREFIX = `ssafy-gwangju-2-web-study-pending:${STORAGE_VERSION}`;
const EMPTY_PROGRESS: WebStudyProgress = { attempts: [] };
const CACHE_LIMIT = 2000;

function keyFor(userId: number) {
  return `${KEY_PREFIX}:${userId}`;
}

function pendingKeyFor(userId: number) {
  return `${PENDING_KEY_PREFIX}:${userId}`;
}

function write(userId: number, progress: WebStudyProgress) {
  const next = { attempts: progress.attempts.slice(-CACHE_LIMIT) };
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(next));
  } catch {
    // 비공개 모드, 저장 용량 초과 등에서는 메모리 상태로 계속 진행합니다.
  }
  return next;
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 저장소를 사용할 수 없어도 현재 세션의 학습은 중단하지 않습니다.
  }
}

export const webStudyProgressStorage = {
  get(userId: number): WebStudyProgress {
    try {
      const raw = localStorage.getItem(keyFor(userId));
      if (!raw) return EMPTY_PROGRESS;
      const parsed = JSON.parse(raw) as WebStudyProgress;
      return { attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [] };
    } catch {
      return EMPTY_PROGRESS;
    }
  },
  add(userId: number, attempt: WebStudyAttempt): WebStudyProgress {
    const current = this.get(userId);
    const next = write(userId, { attempts: [...current.attempts, attempt] });
    const pendingIds = this.getPendingIds(userId);
    safeSet(
      pendingKeyFor(userId),
      JSON.stringify([...new Set([...pendingIds, attempt.id])]),
    );
    return next;
  },
  replace(userId: number, progress: WebStudyProgress): WebStudyProgress {
    return write(userId, progress);
  },
  getPendingIds(userId: number): string[] {
    try {
      const raw = localStorage.getItem(pendingKeyFor(userId));
      if (raw === null) {
        return this.get(userId).attempts.map((attempt) => attempt.id);
      }
      const parsed = JSON.parse(raw) as string[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  getPending(userId: number): WebStudyAttempt[] {
    const pendingIds = new Set(this.getPendingIds(userId));
    return this.get(userId).attempts.filter((attempt) => pendingIds.has(attempt.id));
  },
  markSynced(userId: number, attemptIds: string[]): void {
    const synced = new Set(attemptIds);
    const remaining = this.getPendingIds(userId).filter((id) => !synced.has(id));
    safeSet(pendingKeyFor(userId), JSON.stringify(remaining));
  },
};
