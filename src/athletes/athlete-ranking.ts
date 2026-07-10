import type { Athlete } from "./athlete.js";
import type { Sport } from "../sports/sport.js";
import type { Dataset } from "../platform/data-store.js";

export type RankedAthlete = {
  athlete: Athlete;
  sport: Sport | undefined;
  score: number;
  metricLabel: string;
  metricValue: number;
};

/**
 * Picks the headline stat used to rank an athlete, per sport family.
 */
function getPrimaryMetric(athlete: Athlete): { label: string; value: number } {
  if ("goals" in athlete.stats) {
    return { label: "Buts", value: athlete.stats.goals };
  }

  if ("points_per_game" in athlete.stats) {
    return { label: "Pts/match", value: athlete.stats.points_per_game };
  }

  if ("wins" in athlete.stats) {
    return { label: "Victoires", value: athlete.stats.wins };
  }

  return { label: "Score", value: 0 };
}

/**
 * Ranks athletes across every sport. Raw stats aren't comparable between sports,
 * so each athlete's headline stat is normalised (0-100) against the best value
 * in their own sport before sorting globally.
 */
export function getTopAthletes(dataset: Dataset, limit = 5): RankedAthlete[] {
  const maxBySport = new Map<number, number>();
  for (const athlete of dataset.athletes) {
    const value = getPrimaryMetric(athlete).value;
    maxBySport.set(athlete.sport_id, Math.max(maxBySport.get(athlete.sport_id) ?? 0, value));
  }

  return dataset.athletes
    .map((athlete) => {
      const metric = getPrimaryMetric(athlete);
      const max = maxBySport.get(athlete.sport_id) ?? 0;
      const score = max > 0 ? Math.round((metric.value / max) * 100) : 0;

      return {
        athlete,
        sport: dataset.sportsById.get(athlete.sport_id),
        score,
        metricLabel: metric.label,
        metricValue: metric.value,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
