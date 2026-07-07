import type { Athlete } from "./athlete.js";
import type { Dataset } from "../platform/data-store.js";
import { escapeHtml, getAthleteDetailRows, getAthleteRole, getAthleteStatsSummary } from "./athlete-helpers.js";

export function renderAthleteCard(athlete: Athlete, dataset: Dataset): string {
  const team = athlete.team_id ? dataset.equipesById.get(athlete.team_id) : undefined;
  const teamName = escapeHtml(team?.name ?? "Indépendant");
  const athleteRole = escapeHtml(getAthleteRole(athlete));
  const athleteName = escapeHtml(`${athlete.first_name} ${athlete.last_name}`);
  const athleteNationality = escapeHtml(athlete.nationality);
  const detailRows = getAthleteDetailRows(athlete);
  const detailMarkup = detailRows
    .map((row) => `<li class="accordion-stat"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.value)}</strong></li>`)
    .join("");

  return `
    <details class="accordion-item athlete-accordion" data-athlete-card data-athlete-name="${athleteName}" data-athlete-role="${athleteRole}">
      <summary class="accordion-summary">
        <div class="card athlete-card">
          <div class="card-header">
            <div>
              <p class="eyebrow">${teamName}</p>
              <h3>${athleteName}</h3>
            </div>
            <span class="pill">${athleteNationality}</span>
          </div>
          <p>${athleteRole}</p>
          <ul class="inline-list">
            <li>${athlete.height_cm} cm</li>
            <li>${athlete.weight_kg} kg</li>
            <li>${escapeHtml(getAthleteStatsSummary(athlete))}</li>
          </ul>
        </div>
      </summary>
      <div class="accordion-content">
        <ul class="accordion-stats-list">${detailMarkup}</ul>
      </div>
    </details>
  `;
}
