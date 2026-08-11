const REFRESH_INTERVAL_MS = 30_000;

export function subscribeToStudyProgressRefresh(
  storageKeyPrefix: string,
  refresh: () => void,
) {
  const refreshWhenVisible = () => {
    if (document.visibilityState === "visible") refresh();
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key?.startsWith(storageKeyPrefix)) refreshWhenVisible();
  };

  window.addEventListener("focus", refreshWhenVisible);
  window.addEventListener("online", refreshWhenVisible);
  window.addEventListener("storage", handleStorage);
  document.addEventListener("visibilitychange", refreshWhenVisible);
  const intervalId = window.setInterval(refreshWhenVisible, REFRESH_INTERVAL_MS);

  return () => {
    window.removeEventListener("focus", refreshWhenVisible);
    window.removeEventListener("online", refreshWhenVisible);
    window.removeEventListener("storage", handleStorage);
    document.removeEventListener("visibilitychange", refreshWhenVisible);
    window.clearInterval(intervalId);
  };
}
