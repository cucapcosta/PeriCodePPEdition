const STORAGE_KEY = "t3code:last-active-thread";

export function getLastActiveThreadId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setLastActiveThreadId(threadId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, threadId);
  } catch {
    // Ignore storage errors
  }
}

export function clearLastActiveThreadId(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
