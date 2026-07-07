import type { Athlete, Rencontre, Sport } from "../../domain/index.js";
import type { Dataset } from "../../services/index.js";
import { getAthleteRole, getTodayString } from "../cards/helpers.js";

export function getUpcomingRencontres(dataset: Dataset): Rencontre[] {
  return dataset.rencontres
    .filter((rencontre) => rencontre.date >= getTodayString())
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getUpcomingRencontresForSport(rencontres: Rencontre[]): Rencontre[] {
  return rencontres
    .filter((rencontre) => rencontre.date >= getTodayString())
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getPastRencontresForSport(rencontres: Rencontre[]): Rencontre[] {
  return rencontres
    .filter((rencontre) => rencontre.date < getTodayString())
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function isMmaSport(sport: Sport): boolean {
  return sport.name.toLowerCase().includes("mma") || sport.name.toLowerCase().includes("combat");
}

export { getAthleteRole };
