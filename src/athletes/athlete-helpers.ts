import type { Athlete } from "./athlete.js";

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

export function getAthleteRole(athlete: Athlete): string {
  if ("position" in athlete) {
    return athlete.position;
  }

  if ("nickname" in athlete && athlete.nickname) {
    return athlete.nickname;
  }

  return athlete.weight_class;
}

export function getAthleteStatsSummary(athlete: Athlete): string {
  if ("goals" in athlete.stats) {
    return `${athlete.stats.goals} buts`;
  }

  if ("points_per_game" in athlete.stats) {
    return `${athlete.stats.points_per_game.toFixed(1)} pts/match`;
  }

  if ("wins" in athlete.stats) {
    return `${athlete.stats.wins} victoires`;
  }

  return "Statistiques disponibles";
}

export function getAthleteDetailRows(athlete: Athlete): Array<{ label: string; value: string }> {
  const rows = [
    { label: "Nationalité", value: athlete.nationality },
    { label: "Taille", value: `${athlete.height_cm} cm` },
    { label: "Poids", value: `${athlete.weight_kg} kg` },
  ];

  if ("position" in athlete) {
    rows.push({ label: "Poste", value: athlete.position });
    rows.push({ label: "Maillot", value: `#${athlete.jersey_number}` });
  }

  if ("nickname" in athlete && athlete.nickname) {
    rows.push({ label: "Surnom", value: athlete.nickname });
  }

  if ("reach_cm" in athlete) {
    rows.push({ label: "Allonge", value: `${athlete.reach_cm} cm` });
  }

  if ("stance" in athlete) {
    rows.push({ label: "Posture", value: athlete.stance });
  }

  if ("weight_class" in athlete) {
    rows.push({ label: "Catégorie", value: athlete.weight_class });
  }

  if ("goals" in athlete.stats) {
    rows.push({ label: "Matchs", value: String(athlete.stats.matches_played) });
    rows.push({ label: "Buts", value: String(athlete.stats.goals) });
    rows.push({ label: "Passes", value: String(athlete.stats.assists) });
    rows.push({ label: "Minutes", value: String(athlete.stats.minutes_played) });
  }

  if ("points_per_game" in athlete.stats) {
    rows.push({ label: "Matchs", value: String(athlete.stats.games_played) });
    rows.push({ label: "Points/match", value: athlete.stats.points_per_game.toFixed(1) });
    rows.push({ label: "Rebonds/match", value: athlete.stats.rebounds_per_game.toFixed(1) });
    rows.push({ label: "Passes/match", value: athlete.stats.assists_per_game.toFixed(1) });
  }

  if ("wins" in athlete.stats) {
    rows.push({ label: "Victoires", value: String(athlete.stats.wins) });
    rows.push({ label: "Défaites", value: String(athlete.stats.losses) });
    rows.push({ label: "Nuls", value: String(athlete.stats.draws) });
    rows.push({ label: "KO", value: String(athlete.stats.wins_by_ko) });
    rows.push({ label: "Soumission", value: String(athlete.stats.wins_by_submission) });
  }

  return rows;
}
