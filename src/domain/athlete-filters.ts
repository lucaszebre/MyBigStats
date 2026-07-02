import type { Athlete, TeamAthlete } from "./athlete.js";

export type AthleteFilterCriteria = {
  query?: string;
  sportId?: number;
  position?: string;
};

export function isTeamAthlete(athlete: Athlete): athlete is TeamAthlete {
  return "position" in athlete;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function searchAthletesByName(
  athletes: Athlete[],
  query: string,
): Athlete[] {
  const needle = normalize(query).trim();

  if (!needle) {
    return athletes;
  }

  return athletes.filter((athlete) =>
    normalize(`${athlete.first_name} ${athlete.last_name}`).includes(needle),
  );
}

export function filterAthletesBySport(
  athletes: Athlete[],
  sportId: number,
): Athlete[] {
  return athletes.filter((athlete) => athlete.sport_id === sportId);
}

export function filterAthletesByPosition(
  athletes: Athlete[],
  position: string,
): Athlete[] {
  return athletes.filter(
    (athlete) => isTeamAthlete(athlete) && athlete.position === position,
  );
}

export function filterAthletes(
  athletes: Athlete[],
  criteria: AthleteFilterCriteria,
): Athlete[] {
  let result = athletes;

  if (criteria.sportId != null) {
    result = filterAthletesBySport(result, criteria.sportId);
  }

  if (criteria.position) {
    result = filterAthletesByPosition(result, criteria.position);
  }

  if (criteria.query) {
    result = searchAthletesByName(result, criteria.query);
  }

  return result;
}

export function getPositions(athletes: Athlete[], sportId?: number): string[] {
  const positions = new Set<string>();

  for (const athlete of athletes) {
    if (!isTeamAthlete(athlete)) {
      continue;
    }
    if (sportId != null && athlete.sport_id !== sportId) {
      continue;
    }
    positions.add(athlete.position);
  }

  return [...positions].sort((a, b) => a.localeCompare(b));
}
