import type { Dataset } from "../platform/data-store.js";
import { renderStatCard } from "../platform/stat-card.js";
import { renderSportCard } from "../sports/sport-card.js";
import { renderRencontreCard } from "../matches/event-card.js";
import { getUpcomingRencontres } from "../matches/match-utils.js";
import { getTopAthletes } from "../athletes/athlete-ranking.js";
import type { RankedAthlete } from "../athletes/athlete-ranking.js";
import { escapeHtml } from "../platform/html.js";
import { renderFavoritesList } from "../app/favorites.js";

function renderRankingItem(ranked: RankedAthlete, index: number): string {
  const name = escapeHtml(`${ranked.athlete.first_name} ${ranked.athlete.last_name}`);
  const sportName = escapeHtml(ranked.sport?.name ?? "Sport inconnu");
  const metric = escapeHtml(`${ranked.metricValue} ${ranked.metricLabel}`);

  return `
    <li class="ranking-item">
      <span class="rank-index">${index + 1}</span>
      <div class="rank-body">
        <p class="rank-name">${name}</p>
        <p class="rank-meta">${sportName} · ${metric}</p>
      </div>
      <div class="rank-score">
        <span class="rank-score-value">${ranked.score}</span>
        <div class="rank-bar"><div class="rank-bar-fill" style="width:${ranked.score}%"></div></div>
      </div>
    </li>
  `;
}

export function renderHomePage(dataset: Dataset): string {
  const summaryCards = [
    renderStatCard("Sports", String(dataset.sports.length), "disciplines disponibles"),
    renderStatCard("Athlètes", String(dataset.athletes.length), "profil détaillé"),
    renderStatCard("Équipes", String(dataset.equipes.length), "clubs et sélections"),
    renderStatCard("Rencontres", String(dataset.rencontres.length), "résultats et agenda"),
  ].join("");

  const upcomingEvents = getUpcomingRencontres(dataset)
    .slice(0, 6)
    .map((rencontre) => renderRencontreCard(rencontre, dataset))
    .join("");

  const sportCards = dataset.sports.map((sport) => renderSportCard(sport, dataset)).join("");

  const topAthletes = getTopAthletes(dataset, 5);
  const rankingMarkup = topAthletes.length
    ? `<ol class="ranking-list">${topAthletes.map(renderRankingItem).join("")}</ol>`
    : '<p class="empty-state">Aucun classement disponible.</p>';

  return `
    <section class="stack">
      <div class="grid summary-grid">${summaryCards}</div>

      <section class="panel">
        <div class="section-title">
          <div>
            <p class="eyebrow">Classement</p>
            <h2>Top athlètes</h2>
          </div>
        </div>
        ${rankingMarkup}
      </section>

      <section class="panel">
        <div class="section-title">
          <div>
            <p class="eyebrow">Favoris</p>
            <h2>Mes favoris</h2>
          </div>
        </div>
        <div data-favorites-list>${renderFavoritesList(dataset)}</div>
      </section>

      <section class="panel">
        <div class="section-title">
          <div>
            <p class="eyebrow">Navigation</p>
            <h2>Explorer les sports</h2>
          </div>
        </div>
        <div class="sport-grid">${sportCards}</div>
      </section>

      <section class="panel">
        <div class="section-title">
          <div>
            <p class="eyebrow">Agenda</p>
            <h2>Événements à venir</h2>
          </div>
        </div>
        <div class="stack">${upcomingEvents || '<p class="empty-state">Aucun événement à venir pour le moment.</p>'}</div>
      </section>
    </section>
  `;
}
