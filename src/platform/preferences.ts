export type Theme = "dark" | "light";

const THEME_KEY = "mybigstats:theme";
const FAVORITES_KEY = "mybigstats:favorites";

function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // localStorage may be unavailable (private mode, disabled cookies): fail silently.
  }
}

export function getTheme(): Theme {
  return safeGetItem(THEME_KEY) === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme = getTheme()): void {
  document.documentElement.setAttribute("data-theme", theme);
}

export function setTheme(theme: Theme): void {
  safeSetItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

export function getFavorites(): Set<number> {
  const raw = safeGetItem(FAVORITES_KEY);
  if (!raw) {
    return new Set();
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((value): value is number => typeof value === "number"));
    }
  } catch {
    // Corrupted payload: start from an empty set.
  }

  return new Set();
}

function saveFavorites(favorites: Set<number>): void {
  safeSetItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
}

export function isFavorite(athleteId: number): boolean {
  return getFavorites().has(athleteId);
}

export function toggleFavorite(athleteId: number): boolean {
  const favorites = getFavorites();

  if (favorites.has(athleteId)) {
    favorites.delete(athleteId);
  } else {
    favorites.add(athleteId);
  }

  saveFavorites(favorites);
  return favorites.has(athleteId);
}
