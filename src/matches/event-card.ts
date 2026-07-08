import type { Rencontre } from "./rencontre.js";
import type { Dataset } from "../platform/data-store.js";
import { formatDate } from "../platform/format.js";
import { escapeHtml } from "../platform/html.js";

export function renderRencontreCard(rencontre: Rencontre, dataset: Dataset): string {
  const sport = dataset.sportsById.get(rencontre.sport_id);
  const title = escapeHtml(getRencontreTitle(rencontre, dataset));
  const subtitle = escapeHtml(getRencontreSubtitle(rencontre, dataset));
  const sportName = escapeHtml(sport?.name ?? "Sport");

  return `
    <article class="card event-card">
      <div class="card-header">
        <div>
          <p class="eyebrow">${formatDate(rencontre.date)} · ${sportName}</p>
          <h3>${title}</h3>
        </div>
        <span class="pill">${escapeHtml(rencontre.status)}</span>
      </div>
      <p>${subtitle}</p>
    </article>
  `;
}

function getRencontreTitle(rencontre: Rencontre, dataset: Dataset): string {
  if (rencontre.type === "match") {
    const home = dataset.equipesById.get(rencontre.home_team_id)?.name ?? "Équipe locale";
    const away = dataset.equipesById.get(rencontre.away_team_id)?.name ?? "Équipe visiteuse";
    return `${home} vs ${away}`;
  }

  const fighter1 = dataset.athletesById.get(rencontre.fighter1_id)?.first_name ?? "Combatant 1";
  const fighter2 = dataset.athletesById.get(rencontre.fighter2_id)?.first_name ?? "Combatant 2";
  return `${fighter1} vs ${fighter2}`;
}

function getRencontreSubtitle(rencontre: Rencontre, dataset: Dataset): string {
  if (rencontre.type === "match") {
    return rencontre.status === "finished"
      ? `${rencontre.home_score} - ${rencontre.away_score} · ${rencontre.venue}`
      : `Lieu : ${rencontre.venue}`;
  }

  const winner = dataset.athletesById.get(rencontre.winner_id);
  return winner ? `Vainqueur : ${winner.first_name} ${winner.last_name}` : `Catégorie : ${rencontre.weight_class}`;
}
