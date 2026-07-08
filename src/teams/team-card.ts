import type { Equipe } from "./equipe.js";
import type { Sport } from "../sports/sport.js";
import { getEquipeDetailRows } from "./team-helpers.js";
import { escapeHtml } from "../platform/html.js";

export function renderEquipeSection(equipes: Equipe[], sport: Sport): string {
  const sortedEquipes = [...equipes].sort((left, right) => {
    if ("fifa_ranking" in left && "fifa_ranking" in right) {
      return left.fifa_ranking - right.fifa_ranking;
    }

    if ("seed" in left && "seed" in right) {
      return left.seed - right.seed;
    }

    return 0;
  });

  const renderEquipeAccordion = (equipe: Equipe): string => {
    const detailRows = getEquipeDetailRows(equipe);
    const detailMarkup = detailRows
      .map((row) => `<li class="accordion-stat"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.value)}</strong></li>`)
      .join("");

    const summaryMeta = escapeHtml(
      "country" in equipe
        ? `${equipe.country} · ${equipe.confederation}`
        : `${equipe.city} · ${equipe.conference}`,
    );

    const badge = "fifa_ranking" in equipe
      ? `#${equipe.fifa_ranking}`
      : `#${equipe.seed}`;

    return `
      <details class="accordion-item team-accordion">
        <summary class="accordion-summary">
          <div class="card team-card">
            <div class="card-header">
              <div>
                <p class="eyebrow">${summaryMeta}</p>
                <h3>${escapeHtml(equipe.name)}</h3>
              </div>
              <span class="pill">${badge}</span>
            </div>
          </div>
        </summary>
        <div class="accordion-content">
          <ul class="accordion-stats-list">${detailMarkup}</ul>
        </div>
      </details>
    `;
  };

  if (sport.name.toLowerCase().includes("basketball")) {
    const eastern = sortedEquipes.filter((equipe) => "conference" in equipe && equipe.conference?.toLowerCase().includes("eastern"));
    const western = sortedEquipes.filter((equipe) => "conference" in equipe && equipe.conference?.toLowerCase().includes("western"));

    const renderConference = (title: string, items: Equipe[]) => `
      <div class="team-group">
        <h3>${title}</h3>
        <div class="team-stack">${items.map(renderEquipeAccordion).join("")}</div>
      </div>
    `;

    return `
      <div class="team-stack">
        ${renderConference("Conférence Est", eastern)}
        ${renderConference("Conférence Ouest", western)}
      </div>
    `;
  }

  return `<div class="team-stack">${sortedEquipes.map(renderEquipeAccordion).join("")}</div>`;
}
