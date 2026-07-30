import type { StudyAttempt, StudyProgress } from "../../types/study";

const KEY_PREFIX = "ssafy-gwangju-2-study-progress";
const PENDING_KEY_PREFIX = "ssafy-gwangju-2-study-pending";
const EMPTY_PROGRESS: StudyProgress = { attempts: [] };
const CACHE_LIMIT = 2000;

function keyFor(userId: number) {
  return `${KEY_PREFIX}:${userId}`;
}

function pendingKeyFor(userId: number) {
  return `${PENDING_KEY_PREFIX}:${userId}`;
}

function write(userId: number, progress: StudyProgress) {
  const next = { attempts: progress.attempts.slice(-CACHE_LIMIT) };
  localStorage.setItem(keyFor(userId), JSON.stringify(next));
  return next;
}

export const studyProgressStorage = {
  get(userId: number): StudyProgress {
    try {
      const raw = localStorage.getItem(keyFor(userId));
      if (!raw) return EMPTY_PROGRESS;
      const parsed = JSON.parse(raw) as StudyProgress;
      return { attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [] };
    } catch {
      return EMPTY_PROGRESS;
    }
  },
  add(userId: number, attempt: StudyAttempt): StudyProgress {
    const current = this.get(userId);
    const next = write(userId, { attempts: [...current.attempts, attempt] });
    const pendingIds = this.getPendingIds(userId);
    localStorage.setItem(
      pendingKeyFor(userId),
      JSON.stringify([...new Set([...pendingIds, attempt.id])]),
    );
    return next;
  },
  replace(userId: number, progress: StudyProgress): StudyProgress {
    return write(userId, progress);
  },
  getPendingIds(userId: number): string[] {
    try {
      const raw = localStorage.getItem(pendingKeyFor(userId));
      if (raw === null) {
        // 기존 로컬 전용 버전에서 처음 동기화할 때 모든 기록을 업로드합니다.
        return this.get(userId).attempts.map((attempt) => attempt.id);
      }
      const parsed = JSON.parse(raw) as string[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  getPending(userId: number): StudyAttempt[] {
    const pendingIds = new Set(this.getPendingIds(userId));
    return this.get(userId).attempts.filter((attempt) => pendingIds.has(attempt.id));
  },
  markSynced(userId: number, attemptIds: string[]): void {
    const synced = new Set(attemptIds);
    const remaining = this.getPendingIds(userId).filter((id) => !synced.has(id));
    localStorage.setItem(pendingKeyFor(userId), JSON.stringify(remaining));
  },
};
