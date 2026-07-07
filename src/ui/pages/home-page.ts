import type { Dataset } from "../../services/index.js";
import { renderStatCard, renderSportCard, renderRencontreCard } from "../cards/index.js";
import { getUpcomingRencontres } from "./page-utils.js";

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

  return `
    <section class="stack">
      <div class="grid summary-grid">${summaryCards}</div>

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
