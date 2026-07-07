import type { Rencontre } from "../../domain/index.js";
import type { Dataset } from "../../services/index.js";
import { escapeHtml, formatDate, getRencontreTitle, getRencontreSubtitle } from "./helpers.js";

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
