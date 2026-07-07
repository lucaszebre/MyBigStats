import type { Sport } from "../../domain/index.js";
import type { Dataset } from "../../services/index.js";
import { escapeHtml } from "./helpers.js";

export function renderComparisonPanel(dataset: Dataset, sport: Sport, primaryId: number, secondaryId: number): string {
  const primary = dataset.athletesById.get(primaryId);
  const secondary = dataset.athletesById.get(secondaryId);

  if (!primary || !secondary) {
    return '<p class="empty-state">Sélectionnez deux athlètes pour comparer leurs performances.</p>';
  }

  return `
    <div class="radar-panel">
      <div class="radar-chart" data-comparison-chart></div>
      <p class="radar-caption">Comparaison radar · ${escapeHtml(sport.name)}</p>
    </div>
  `;
}
