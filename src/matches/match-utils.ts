import type { Rencontre } from "./rencontre.js";
import type { Dataset } from "../platform/data-store.js";
import { getTodayString } from "../platform/format.js";

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
