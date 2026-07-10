import type { Dataset } from "../platform/data-store.js";
import { getFavorites, toggleFavorite } from "../platform/preferences.js";
import { renderAthleteCard } from "../athletes/athlete-card.js";

const WIRED_FLAG = "favoritesWired";

/**
 * Renders the inner markup of the "favourites" section from the persisted store.
 * Kept separate from wiring so it can be re-rendered in place when a favourite
 * is toggled without rebuilding the whole page.
 */
export function renderFavoritesList(dataset: Dataset): string {
  const favorites = getFavorites();
  const athletes = dataset.athletes.filter((athlete) => favorites.has(athlete.id));

  if (athletes.length === 0) {
    return '<p class="empty-state">Aucun favori pour le moment. Ajoutez des athlètes avec l’étoile ★.</p>';
  }

  return `<div class="sport-grid">${athletes.map((athlete) => renderAthleteCard(athlete, dataset)).join("")}</div>`;
}

/**
 * Attaches a single delegated click handler on the app root so favourite toggles
 * keep working after each re-render. Guarded so repeated renders don't stack
 * duplicate listeners on the persistent root element.
 */
export function wireFavorites(root: HTMLElement, dataset: Dataset): void {
  if (root.dataset[WIRED_FLAG] === "true") {
    return;
  }
  root.dataset[WIRED_FLAG] = "true";

  root.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    const toggle = target?.closest<HTMLElement>("[data-favorite-toggle]");
    if (!toggle) {
      return;
    }

    // The star lives inside a <summary>; stop the accordion from toggling.
    event.preventDefault();
    event.stopPropagation();

    const athleteId = Number(toggle.dataset.athleteId);
    if (Number.isNaN(athleteId)) {
      return;
    }

    const nowFavorite = toggleFavorite(athleteId);

    root
      .querySelectorAll<HTMLElement>(`[data-favorite-toggle][data-athlete-id="${athleteId}"]`)
      .forEach((button) => {
        button.classList.toggle("is-favorite", nowFavorite);
        button.setAttribute("aria-pressed", String(nowFavorite));
      });

    const favoritesList = root.querySelector<HTMLElement>("[data-favorites-list]");
    if (favoritesList) {
      favoritesList.innerHTML = renderFavoritesList(dataset);
    }
  });
}
