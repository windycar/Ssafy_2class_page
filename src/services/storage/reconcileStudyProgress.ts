type SyncableAttempt = {
  id: string;
  answeredAt: string;
};

type SyncableProgress<TAttempt extends SyncableAttempt> = {
  attempts: TAttempt[];
};

export function reconcileRemoteProgress<TAttempt extends SyncableAttempt>(
  remote: SyncableProgress<TAttempt>,
  currentLocal: SyncableProgress<TAttempt>,
  localIdsBeforeSync: ReadonlySet<string>,
): SyncableProgress<TAttempt> {
  const attempts = new Map(
    remote.attempts.map((attempt) => [attempt.id, attempt]),
  );

  // Keep only attempts created while the server request was in flight.
  // All older local rows were either uploaded before the read or are stale.
  currentLocal.attempts.forEach((attempt) => {
    if (!localIdsBeforeSync.has(attempt.id)) attempts.set(attempt.id, attempt);
  });

  return {
    attempts: [...attempts.values()].sort(
      (a, b) =>
        new Date(a.answeredAt).getTime() - new Date(b.answeredAt).getTime() ||
        a.id.localeCompare(b.id),
    ),
  };
}
