import type { ObjectValues } from "./types.js";

const API_BASE_URL = "https://keligmartin.github.io/api";

export const ApiEndpoint = {
  SPORTS: "/sports.json",
  ATHLETES: "/athletes.json",
  RENCONTRES: "/rencontres.json",
  EQUIPES: "/equipes.json",
} as const;

export type ApiEndpoint = ObjectValues<typeof ApiEndpoint>;

export async function fetchApi<T>(endpoint: ApiEndpoint): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  return (await response.json()) as T;
}
