import type { Athlete } from "../athletes/athlete.js";
import type { Sport } from "../sports/sport.js";
import type { Dataset } from "../platform/data-store.js";
import { escapeHtml } from "../platform/html.js";

export type ComparisonError = "MISSING_ATHLETE" | "DIFFERENT_SPORTS";

export type ComparisonResult =
  | { ok: true; primary: Athlete; secondary: Athlete }
  | { ok: false; error: ComparisonError };

const comparisonErrorMessages: Record<ComparisonError, string> = {
  MISSING_ATHLETE: "Sélectionnez deux athlètes pour comparer leurs performances.",
  DIFFERENT_SPORTS: "Ces deux athlètes ne pratiquent pas le même sport, la comparaison est impossible.",
};

export function compareAthletes(dataset: Dataset, primaryId: number, secondaryId: number): ComparisonResult {
  const primary = dataset.athletesById.get(primaryId);
  const secondary = dataset.athletesById.get(secondaryId);

  if (!primary || !secondary) {
    return { ok: false, error: "MISSING_ATHLETE" };
  }

  if (primary.sport_id !== secondary.sport_id) {
    return { ok: false, error: "DIFFERENT_SPORTS" };
  }

  return { ok: true, primary, secondary };
}

export function renderComparisonPanel(dataset: Dataset, sport: Sport, primaryId: number, secondaryId: number): string {
  const result = compareAthletes(dataset, primaryId, secondaryId);

  if (!result.ok) {
    return `<p class="empty-state" role="alert">${comparisonErrorMessages[result.error]}</p>`;
  }

  return `
    <div class="radar-panel">
      <div class="radar-chart" data-comparison-chart></div>
      <p class="radar-caption">Comparaison radar · ${escapeHtml(sport.name)}</p>
    </div>
  `;
}
