import type {
  SpecialMockExamAttempt,
  SpecialMockExamProgress,
  SpecialMockExamRound,
} from "../../types/specialMockExam";
import { isCurrentSpecialMockExamAttempt } from "../../types/specialMockExam.ts";

const STORAGE_VERSION = "v1";
const KEY_PREFIX = `ssafy-gwangju-2-special-mock-progress:${STORAGE_VERSION}`;
const PENDING_KEY_PREFIX = `ssafy-gwangju-2-special-mock-pending:${STORAGE_VERSION}`;
const TOMBSTONE_KEY_PREFIX = `ssafy-gwangju-2-special-mock-reset-tombstones:${STORAGE_VERSION}`;
const EMPTY_PROGRESS: SpecialMockExamProgress = { attempts: [] };
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
  progress: SpecialMockExamProgress,
): SpecialMockExamProgress {
  const tombstones = new Set(getTombstoneIds(userId));
  return {
    attempts: progress.attempts.filter(
      (attempt) => !tombstones.has(attempt.id),
    ),
  };
}

function write(userId: number, progress: SpecialMockExamProgress) {
  const visible = suppressTombstones(userId, progress);
  const next = { attempts: visible.attempts.slice(-CACHE_LIMIT) };
  safeSet(keyFor(userId), JSON.stringify(next));
  return next;
}

export function getSpecialMockExamResetAttemptIds(
  progress: SpecialMockExamProgress,
  mockRound: SpecialMockExamRound,
) {
  return progress.attempts
    .filter((attempt) => attempt.mockRound === mockRound)
    .map((attempt) => attempt.id);
}

export const specialMockExamProgressStorage = {
  get(userId: number): SpecialMockExamProgress {
    try {
      const raw = localStorage.getItem(keyFor(userId));
      if (!raw) return EMPTY_PROGRESS;
      const parsed = JSON.parse(raw) as SpecialMockExamProgress;
      return suppressTombstones(userId, {
        attempts: Array.isArray(parsed.attempts)
          ? parsed.attempts.filter(isCurrentSpecialMockExamAttempt)
          : [],
      });
    } catch {
      return EMPTY_PROGRESS;
    }
  },

  add(userId: number, attempt: SpecialMockExamAttempt) {
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

  addMany(userId: number, attempts: SpecialMockExamAttempt[]) {
    if (!attempts.length) return this.get(userId);
    const next = write(userId, {
      attempts: [...this.get(userId).attempts, ...attempts],
    });
    const pendingIds = this.getPendingIds(userId);
    safeSet(
      pendingKeyFor(userId),
      JSON.stringify([
        ...new Set([...pendingIds, ...attempts.map(({ id }) => id)]),
      ]),
    );
    return next;
  },

  replace(userId: number, progress: SpecialMockExamProgress) {
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
      if (raw === null) return this.get(userId).attempts.map(({ id }) => id);
      const parsed = JSON.parse(raw) as string[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  getPending(userId: number) {
    const pendingIds = new Set(this.getPendingIds(userId));
    return this.get(userId).attempts.filter((attempt) =>
      pendingIds.has(attempt.id),
    );
  },

  markSynced(userId: number, attemptIds: string[]) {
    const synced = new Set(attemptIds);
    safeSet(
      pendingKeyFor(userId),
      JSON.stringify(
        this.getPendingIds(userId).filter((id) => !synced.has(id)),
      ),
    );
  },
};
