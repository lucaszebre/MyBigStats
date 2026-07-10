import type { Dataset } from "../platform/data-store.js";
import { getFavorites, toggleFavorite } from "../platform/preferences.js";
import { renderAthleteCard } from "../athletes/athlete-card.js";

const WIRED_FLAG = "favoritesWired";

export function renderFavoritesList(dataset: Dataset): string {
  const favorites = getFavorites();
  const athletes = dataset.athletes.filter((athlete) => favorites.has(athlete.id));

  if (athletes.length === 0) {
    return '<p class="empty-state">Aucun favori pour le moment. Ajoutez des athlètes avec l’étoile ★.</p>';
  }

  return `<div class="sport-grid">${athletes.map((athlete) => renderAthleteCard(athlete, dataset)).join("")}</div>`;
}

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
