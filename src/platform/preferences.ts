import type { ObjectValues } from "./types.js";

export const Theme = {
  DARK: "dark",
  LIGHT: "light",
} as const;

export type Theme = ObjectValues<typeof Theme>;

export type Preferences = {
  theme: Theme;
  favorites: number[];
};

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
  return safeGetItem(THEME_KEY) === Theme.LIGHT ? Theme.LIGHT : Theme.DARK;
}

export function applyTheme(theme: Theme = getTheme()): void {
  document.documentElement.setAttribute("data-theme", theme);
}

export function updatePreferences(patch: Partial<Preferences>): void {
  if (patch.theme !== undefined) {
    safeSetItem(THEME_KEY, patch.theme);
  }
  if (patch.favorites !== undefined) {
    safeSetItem(FAVORITES_KEY, JSON.stringify(patch.favorites));
  }
}

export function setTheme(theme: Theme): void {
  updatePreferences({ theme });
  applyTheme(theme);
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === Theme.DARK ? Theme.LIGHT : Theme.DARK;
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
  updatePreferences({ favorites: Array.from(favorites) });
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
