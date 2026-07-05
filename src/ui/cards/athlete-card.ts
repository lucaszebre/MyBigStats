import type { Athlete } from "../../domain/index.js";
import type { Dataset } from "../../services/index.js";
import { getAthleteDetailRows, getAthleteRole, getAthleteStatsSummary } from "./helpers.js";

export function renderAthleteCard(athlete: Athlete, dataset: Dataset): string {
  const team = athlete.team_id ? dataset.equipesById.get(athlete.team_id) : undefined;
  const teamName = team?.name ?? "Indépendant";
  const athleteRole = getAthleteRole(athlete);
  const athleteName = `${athlete.first_name} ${athlete.last_name}`;
  const detailRows = getAthleteDetailRows(athlete);
  const detailMarkup = detailRows
    .map((row) => `<li class="accordion-stat"><span>${row.label}</span><strong>${row.value}</strong></li>`)
    .join("");

  return `
    <details class="accordion-item athlete-accordion" data-athlete-card data-athlete-name="${athleteName}" data-athlete-role="${athleteRole}">
      <summary class="accordion-summary">
        <div class="card athlete-card">
          <div class="card-header">
            <div>
              <p class="eyebrow">${teamName}</p>
              <h3>${athlete.first_name} ${athlete.last_name}</h3>
            </div>
            <span class="pill">${athlete.nationality}</span>
          </div>
          <p>${athleteRole}</p>
          <ul class="inline-list">
            <li>${athlete.height_cm} cm</li>
            <li>${athlete.weight_kg} kg</li>
            <li>${getAthleteStatsSummary(athlete)}</li>
          </ul>
        </div>
      </summary>
      <div class="accordion-content">
        <ul class="accordion-stats-list">${detailMarkup}</ul>
      </div>
    </details>
  `;
}
