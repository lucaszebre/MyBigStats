import type { Dataset } from "../platform/data-store.js";
import { getTheme, toggleTheme, Theme } from "../platform/preferences.js";
import { renderHomePage } from "../home/home-page.js";
import { renderSportPage, initSportPage } from "../sports/sport-page.js";
import { escapeHtml } from "../platform/html.js";
import { wireFavorites } from "./favorites.js";

function getThemeToggleLabel(theme: Theme): string {
  return theme === Theme.DARK ? "☀️ Mode clair" : "🌙 Mode sombre";
}

function resolveRouteFromHash(hash = window.location.hash): { view: "home" } | { view: "sport"; sportId: number } {
  const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash;
  const sportMatch = cleanHash.match(/^sport\/(\d+)$/);

  if (sportMatch) {
    const sportId = Number(sportMatch[1]);
    if (!Number.isNaN(sportId)) {
      return { view: "sport", sportId };
    }
  }

  if (cleanHash === "sport") {
    return { view: "sport", sportId: 0 };
  }

  return { view: "home" };
}

export function renderLoading(root: HTMLElement): void {
  root.innerHTML = `
    <section class="panel loading-state">
      <h2>Chargement en cours…</h2>
      <p>Les données se chargent depuis l’API, merci de patienter.</p>
    </section>
  `;
}

export function renderApp(root: HTMLElement, dataset: Dataset): void {
  const route = resolveRouteFromHash();
  const content = route.view === "sport" && route.sportId !== undefined
    ? renderSportPage(dataset, route.sportId)
    : renderHomePage(dataset);

  root.innerHTML = `
    <div class="shell">
      <header class="hero">
        <div class="hero-top">
          <p class="eyebrow">MyBigStats</p>
          <button type="button" class="theme-toggle" data-theme-toggle>${getThemeToggleLabel(getTheme())}</button>
        </div>
        <h1>Suivez les sports, les athlètes et les rencontres</h1>
        <p>Récupérez les données depuis l’API et découvrez les événements à venir, les équipes et les comparaisons d’athlètes.</p>
        <nav class="nav" aria-label="Navigation principale">
          <button type="button" class="${route.view === "home" ? "active" : ""}" data-route="home">Accueil</button>
          ${dataset.sports
            .map((sport) => `<button type="button" class="${route.view === "sport" && route.sportId === sport.id ? "active" : ""}" data-route="sport" data-sport-id="${sport.id}">${escapeHtml(sport.name)}</button>`)
            .join("")}
        </nav>
      </header>
      <main class="content">${content}</main>
    </div>
  `;

  const routeButtons = root.querySelectorAll<HTMLButtonElement>("[data-route]");
  routeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextView = button.dataset.route === "sport" ? "sport" : "home";
      const sportId = button.dataset.sportId;

      if (nextView === "sport" && sportId) {
        window.location.hash = `sport/${sportId}`;
      } else {
        window.location.hash = "home";
      }
    });
  });

  const themeToggle = root.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  themeToggle?.addEventListener("click", () => {
    const next = toggleTheme();
    themeToggle.textContent = getThemeToggleLabel(next);
  });

  wireFavorites(root, dataset);

  if (route.view === "sport" && route.sportId !== undefined) {
    initSportPage(root, dataset, route.sportId);
  }
}

export function renderError(root: HTMLElement, message: string): void {
  root.innerHTML = `
    <section class="panel">
      <h1>MyBigStats</h1>
      <p role="alert">${message}</p>
    </section>
  `;
}
