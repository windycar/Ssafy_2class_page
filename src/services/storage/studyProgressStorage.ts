import type {
  StudyAttempt,
  StudyCategory,
  StudyDifficulty,
  StudyProgress,
} from "../../types/study";

const KEY_PREFIX = "ssafy-gwangju-2-study-progress";
const PENDING_KEY_PREFIX = "ssafy-gwangju-2-study-pending";
const TOMBSTONE_KEY_PREFIX = "ssafy-gwangju-2-study-reset-tombstones:v1";
const EMPTY_PROGRESS: StudyProgress = { attempts: [] };
const CACHE_LIMIT = 2000;

function keyFor(userId: number) {
  return `${KEY_PREFIX}:${userId}`;
}

function pendingKeyFor(userId: number) {
  return `${PENDING_KEY_PREFIX}:${userId}`;
}

function tombstoneKeyFor(userId: number) {
  return `${TOMBSTONE_KEY_PREFIX}:${userId}`;
}

function getTombstoneIds(userId: number): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(tombstoneKeyFor(userId)) ?? "[]") as string[];
    return Array.isArray(parsed) ? parsed.slice(-CACHE_LIMIT) : [];
  } catch {
    return [];
  }
}

function addTombstones(userId: number, attemptIds: string[]) {
  const next = [...new Set([...getTombstoneIds(userId), ...attemptIds])].slice(-CACHE_LIMIT);
  localStorage.setItem(tombstoneKeyFor(userId), JSON.stringify(next));
}

function suppressTombstones(userId: number, progress: StudyProgress): StudyProgress {
  const tombstones = new Set(getTombstoneIds(userId));
  return {
    attempts: progress.attempts.filter((attempt) => !tombstones.has(attempt.id)),
  };
}

function write(userId: number, progress: StudyProgress) {
  const visible = suppressTombstones(userId, progress);
  const next = { attempts: visible.attempts.slice(-CACHE_LIMIT) };
  localStorage.setItem(keyFor(userId), JSON.stringify(next));
  return next;
}

export function getStudyResetAttemptIds(
  progress: StudyProgress,
  difficulty: StudyDifficulty,
  categories: StudyCategory[],
) {
  const selectedCategories = new Set(categories);
  return progress.attempts
    .filter(
      (attempt) =>
        attempt.difficulty === difficulty && selectedCategories.has(attempt.category),
    )
    .map((attempt) => attempt.id);
}

export const studyProgressStorage = {
  get(userId: number): StudyProgress {
    try {
      const raw = localStorage.getItem(keyFor(userId));
      if (!raw) return EMPTY_PROGRESS;
      const parsed = JSON.parse(raw) as StudyProgress;
      return suppressTombstones(userId, {
        attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
      });
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
  remove(userId: number, attemptIds: string[]): StudyProgress {
    const current = this.get(userId);
    const requestedIds = new Set(attemptIds);
    const removedIds = new Set(
      current.attempts
        .filter((attempt) => requestedIds.has(attempt.id))
        .map((attempt) => attempt.id),
    );
    addTombstones(userId, [...removedIds]);
    const next = write(userId, {
      attempts: current.attempts.filter((attempt) => !removedIds.has(attempt.id)),
    });
    localStorage.setItem(
      pendingKeyFor(userId),
      JSON.stringify(
        this.getPendingIds(userId).filter((id) => !removedIds.has(id)),
      ),
    );
    return next;
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
