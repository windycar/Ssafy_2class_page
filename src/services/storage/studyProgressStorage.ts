import type { StudyAttempt, StudyProgress } from "../../types/study";

const KEY_PREFIX = "ssafy-gwangju-2-study-progress";
const EMPTY_PROGRESS: StudyProgress = { attempts: [] };

function keyFor(userId: number) {
  return `${KEY_PREFIX}:${userId}`;
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
    const next = { attempts: [...current.attempts, attempt].slice(-1200) };
    localStorage.setItem(keyFor(userId), JSON.stringify(next));
    return next;
  },
};

