import type { Athlete, Equipe, Rencontre, Sport } from "../domain/index.js";
import { ApiEndpoint, fetchApi } from "./api-service.js";

export function fetchSports(): Promise<Sport[]> {
  return fetchApi<Sport[]>(ApiEndpoint.SPORTS);
}

export function fetchAthletes(): Promise<Athlete[]> {
  return fetchApi<Athlete[]>(ApiEndpoint.ATHLETES);
}

export function fetchEquipes(): Promise<Equipe[]> {
  return fetchApi<Equipe[]>(ApiEndpoint.EQUIPES);
}

export function fetchRencontres(): Promise<Rencontre[]> {
  return fetchApi<Rencontre[]>(ApiEndpoint.RENCONTRES);
}

export type Dataset = {
  sports: Sport[];
  athletes: Athlete[];
  equipes: Equipe[];
  rencontres: Rencontre[];
  sportsById: Map<number, Sport>;
  athletesById: Map<number, Athlete>;
  equipesById: Map<number, Equipe>;
};

function indexById<T extends { id: number }>(items: T[]): Map<number, T> {
  return new Map(items.map((item) => [item.id, item]));
}

export async function loadDataset(): Promise<Dataset> {
  const [sports, athletes, equipes, rencontres] = await Promise.all([
    fetchSports(),
    fetchAthletes(),
    fetchEquipes(),
    fetchRencontres(),
  ]);

  return {
    sports,
    athletes,
    equipes,
    rencontres,
    sportsById: indexById(sports),
    athletesById: indexById(athletes),
    equipesById: indexById(equipes),
  };
}
