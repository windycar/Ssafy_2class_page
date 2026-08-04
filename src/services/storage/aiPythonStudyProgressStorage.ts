import type {
  AiPythonStudyAttempt,
  AiPythonStudyProgress,
} from "../../types/aiPythonStudy";

const STORAGE_VERSION = "v1";
const KEY_PREFIX = `ssafy-gwangju-2-ai-python-study-progress:${STORAGE_VERSION}`;
const PENDING_KEY_PREFIX = `ssafy-gwangju-2-ai-python-study-pending:${STORAGE_VERSION}`;
const EMPTY_PROGRESS: AiPythonStudyProgress = { attempts: [] };
const CACHE_LIMIT = 2000;

function keyFor(userId: number) {
  return `${KEY_PREFIX}:${userId}`;
}

function pendingKeyFor(userId: number) {
  return `${PENDING_KEY_PREFIX}:${userId}`;
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 저장 공간을 사용할 수 없어도 현재 세션의 문제 풀이는 계속합니다.
  }
}

function write(userId: number, progress: AiPythonStudyProgress) {
  const next = { attempts: progress.attempts.slice(-CACHE_LIMIT) };
  safeSet(keyFor(userId), JSON.stringify(next));
  return next;
}

export const aiPythonStudyProgressStorage = {
  get(userId: number): AiPythonStudyProgress {
    try {
      const raw = localStorage.getItem(keyFor(userId));
      if (!raw) return EMPTY_PROGRESS;
      const parsed = JSON.parse(raw) as AiPythonStudyProgress;
      return { attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [] };
    } catch {
      return EMPTY_PROGRESS;
    }
  },
  add(userId: number, attempt: AiPythonStudyAttempt): AiPythonStudyProgress {
    const next = write(userId, {
      attempts: [...this.get(userId).attempts, attempt],
    });
    const pendingIds = this.getPendingIds(userId);
    safeSet(
      pendingKeyFor(userId),
      JSON.stringify([...new Set([...pendingIds, attempt.id])]),
    );
    return next;
  },
  replace(userId: number, progress: AiPythonStudyProgress): AiPythonStudyProgress {
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
  getPending(userId: number): AiPythonStudyAttempt[] {
    const pendingIds = new Set(this.getPendingIds(userId));
    return this.get(userId).attempts.filter((attempt) => pendingIds.has(attempt.id));
  },
  markSynced(userId: number, attemptIds: string[]) {
    const synced = new Set(attemptIds);
    const remaining = this.getPendingIds(userId).filter((id) => !synced.has(id));
    safeSet(pendingKeyFor(userId), JSON.stringify(remaining));
  },
};
