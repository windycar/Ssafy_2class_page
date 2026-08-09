import type {
  AiPythonWeek,
  AiPythonWeekAttempt,
  AiPythonWeekDifficulty,
  AiPythonWeekProgress,
} from "../../types/aiPythonWeekStudy";

const STORAGE_VERSION = "v5";
const KEY_PREFIX = `ssafy-gwangju-2-ai-python-week-progress:${STORAGE_VERSION}`;
const PENDING_KEY_PREFIX = `ssafy-gwangju-2-ai-python-week-pending:${STORAGE_VERSION}`;
const TOMBSTONE_KEY_PREFIX = `ssafy-gwangju-2-ai-python-week-reset-tombstones:${STORAGE_VERSION}`;
const LEGACY_KEY_PREFIXES = [
  "ssafy-gwangju-2-ai-python-week-progress:v1",
  "ssafy-gwangju-2-ai-python-week-progress:v2",
  "ssafy-gwangju-2-ai-python-week-progress:v3",
  "ssafy-gwangju-2-ai-python-week-progress:v4",
];
const EMPTY_PROGRESS: AiPythonWeekProgress = { attempts: [] };
const CACHE_LIMIT = 3000;

function keyFor(userId: number) {
  return `${KEY_PREFIX}:${userId}`;
}

function pendingKeyFor(userId: number) {
  return `${PENDING_KEY_PREFIX}:${userId}`;
}

function tombstoneKeyFor(userId: number) {
  return `${TOMBSTONE_KEY_PREFIX}:${userId}`;
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 저장 공간을 사용할 수 없어도 현재 문제 풀이는 계속 진행합니다.
  }
}

function clearLegacyProgress(userId: number) {
  try {
    LEGACY_KEY_PREFIXES.forEach((prefix) =>
      localStorage.removeItem(`${prefix}:${userId}`),
    );
  } catch {
    // 이전 문제은행 기록 정리에 실패해도 현재 기록은 계속 사용합니다.
  }
}

function getTombstoneIds(userId: number): string[] {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(tombstoneKeyFor(userId)) ?? "[]",
    ) as string[];
    return Array.isArray(parsed) ? parsed.slice(-CACHE_LIMIT) : [];
  } catch {
    return [];
  }
}

function addTombstones(userId: number, attemptIds: string[]) {
  const next = [...new Set([...getTombstoneIds(userId), ...attemptIds])].slice(
    -CACHE_LIMIT,
  );
  safeSet(tombstoneKeyFor(userId), JSON.stringify(next));
}

function suppressTombstones(
  userId: number,
  progress: AiPythonWeekProgress,
): AiPythonWeekProgress {
  const tombstones = new Set(getTombstoneIds(userId));
  return {
    attempts: progress.attempts.filter(
      (attempt) => !tombstones.has(attempt.id),
    ),
  };
}

function write(userId: number, progress: AiPythonWeekProgress) {
  const visible = suppressTombstones(userId, progress);
  const next = { attempts: visible.attempts.slice(-CACHE_LIMIT) };
  safeSet(keyFor(userId), JSON.stringify(next));
  return next;
}

export function getAiPythonWeekResetAttemptIds(
  progress: AiPythonWeekProgress,
  week: AiPythonWeek,
  difficulty: AiPythonWeekDifficulty,
  categories: string[],
) {
  const selectedCategories = new Set(categories);
  return progress.attempts
    .filter(
      (attempt) =>
        attempt.week === week &&
        attempt.difficulty === difficulty &&
        selectedCategories.has(attempt.category),
    )
    .map((attempt) => attempt.id);
}

export const aiPythonWeekProgressStorage = {
  get(userId: number): AiPythonWeekProgress {
    try {
      clearLegacyProgress(userId);
      const raw = localStorage.getItem(keyFor(userId));
      if (!raw) return EMPTY_PROGRESS;
      const parsed = JSON.parse(raw) as AiPythonWeekProgress;
      return suppressTombstones(userId, {
        attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
      });
    } catch {
      return EMPTY_PROGRESS;
    }
  },

  add(userId: number, attempt: AiPythonWeekAttempt) {
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

  replace(userId: number, progress: AiPythonWeekProgress) {
    return write(userId, progress);
  },

  remove(userId: number, attemptIds: string[]) {
    const current = this.get(userId);
    const requestedIds = new Set(attemptIds);
    const removedIds = new Set(
      current.attempts
        .filter((attempt) => requestedIds.has(attempt.id))
        .map((attempt) => attempt.id),
    );

    addTombstones(userId, [...removedIds]);
    const next = write(userId, {
      attempts: current.attempts.filter(
        (attempt) => !removedIds.has(attempt.id),
      ),
    });
    safeSet(
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
        return this.get(userId).attempts.map((attempt) => attempt.id);
      }
      const parsed = JSON.parse(raw) as string[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  getPending(userId: number): AiPythonWeekAttempt[] {
    const pendingIds = new Set(this.getPendingIds(userId));
    return this.get(userId).attempts.filter((attempt) =>
      pendingIds.has(attempt.id),
    );
  },

  markSynced(userId: number, attemptIds: string[]) {
    const synced = new Set(attemptIds);
    const remaining = this.getPendingIds(userId).filter(
      (id) => !synced.has(id),
    );
    safeSet(pendingKeyFor(userId), JSON.stringify(remaining));
  },
};
