import type { Sport } from "./sport.js";
import type { Dataset } from "../platform/data-store.js";
import { getTodayString } from "../platform/format.js";
import { escapeHtml } from "../athletes/athlete-helpers.js";

export function renderSportCard(sport: Sport, dataset: Dataset): string {
  const athletesCount = dataset.athletes.filter((athlete) => athlete.sport_id === sport.id).length;
  const teamsCount = dataset.equipes.filter((equipe) => equipe.sport_id === sport.id).length;
  const nextEvents = dataset.rencontres.filter(
    (rencontre) => rencontre.sport_id === sport.id && rencontre.date >= getTodayString(),
  ).length;

  return `
    <article class="card sport-card">
      <div class="card-header sport-card-header">
        <div class="card-title-block">
          <p class="eyebrow">${sport.type === "team" ? "Équipe" : "Individuel"}</p>
          <h3>${escapeHtml(sport.name)}</h3>
        </div>
      </div>
      <p class="sport-card-subtitle">${escapeHtml(sport.competition.name)}</p>
      <ul class="inline-list">
        <li>${athletesCount} athlètes</li>
        <li>${teamsCount} équipes</li>
        <li>${nextEvents} à venir</li>
      </ul>
      <a href="#sport/${sport.id}" class="link-button" data-sport-id="${sport.id}">Voir plus</a>
    </article>
  `;
}
