import type { Athlete, AthleteFilterCriteria } from "../domain/index.js";
import { filterAthletes, getPositions, isTeamAthlete } from "../domain/index.js";
import type { Dataset } from "../services/index.js";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderAthleteRow(athlete: Athlete, dataset: Dataset): string {
  const sport = dataset.sportsById.get(athlete.sport_id);
  const detail = isTeamAthlete(athlete) ? athlete.position : athlete.weight_class;
  const name = `${athlete.first_name} ${athlete.last_name}`;

  return `<li>${escapeHtml(name)} — ${escapeHtml(sport?.name ?? "?")} — ${escapeHtml(detail)}</li>`;
}

export function renderApp(root: HTMLElement, dataset: Dataset): void {
  const sportOptions = dataset.sports
    .map((sport) => `<option value="${sport.id}">${escapeHtml(sport.name)}</option>`)
    .join("");

  root.innerHTML = `
    <section>
      <h1>MyBigStats</h1>
      <div class="filters">
        <input id="athlete-search" type="search" placeholder="Rechercher un athlete..." />
        <select id="sport-filter">
          <option value="">Tous les sports</option>
          ${sportOptions}
        </select>
        <select id="position-filter">
          <option value="">Toutes les positions</option>
        </select>
      </div>
      <p id="athlete-count"></p>
      <ul id="athlete-list"></ul>
    </section>
  `;

  const searchInput = root.querySelector<HTMLInputElement>("#athlete-search")!;
  const sportSelect = root.querySelector<HTMLSelectElement>("#sport-filter")!;
  const positionSelect = root.querySelector<HTMLSelectElement>("#position-filter")!;
  const countEl = root.querySelector<HTMLParagraphElement>("#athlete-count")!;
  const listEl = root.querySelector<HTMLUListElement>("#athlete-list")!;

  function populatePositions(sportId?: number): void {
    const options = getPositions(dataset.athletes, sportId)
      .map((position) => `<option value="${escapeHtml(position)}">${escapeHtml(position)}</option>`)
      .join("");

    positionSelect.innerHTML = `<option value="">Toutes les positions</option>${options}`;
  }

  function applyFilters(): void {
    const criteria: AthleteFilterCriteria = {};
    const query = searchInput.value.trim();
    const sportValue = sportSelect.value;
    const position = positionSelect.value;

    if (query) {
      criteria.query = query;
    }
    if (sportValue) {
      criteria.sportId = Number(sportValue);
    }
    if (position) {
      criteria.position = position;
    }

    const matches = filterAthletes(dataset.athletes, criteria);
    countEl.textContent = `${matches.length} athlete(s)`;
    listEl.innerHTML = matches.length
      ? matches.map((athlete) => renderAthleteRow(athlete, dataset)).join("")
      : "<li>Aucun resultat</li>";
  }

  searchInput.addEventListener("input", applyFilters);
  positionSelect.addEventListener("change", applyFilters);
  sportSelect.addEventListener("change", () => {
    populatePositions(sportSelect.value ? Number(sportSelect.value) : undefined);
    applyFilters();
  });

  populatePositions();
  applyFilters();
}

export function renderError(root: HTMLElement, message: string): void {
  root.innerHTML = `
    <section>
      <h1>MyBigStats</h1>
      <p role="alert">${message}</p>
    </section>
  `;
}
