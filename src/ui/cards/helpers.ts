import type { Athlete, Equipe, Rencontre, Sport } from "../../domain/index.js";
import type { Dataset } from "../../services/index.js";

export function formatDate(date: string): string {
  const parsed = new Date(date);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

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

export function getEquipeContext(equipe: Equipe): string {
  if ("country" in equipe) {
    return `${equipe.country} · ${equipe.confederation}`;
  }

  return `${equipe.city} · ${equipe.conference}`;
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

export function getEquipeDetailRows(equipe: Equipe): Array<{ label: string; value: string }> {
  if ("country" in equipe) {
    return [
      { label: "Pays", value: equipe.country },
      { label: "Confédération", value: equipe.confederation },
      { label: "Classement FIFA", value: `#${equipe.fifa_ranking}` },
      { label: "Titres Mondiaux", value: String(equipe.world_cup_titles) },
      { label: "Apparitions", value: String(equipe.world_cup_appearances) },
      { label: "Groupe", value: equipe.group },
    ];
  }

  return [
    { label: "Ville", value: equipe.city },
    { label: "Conférence", value: equipe.conference },
    { label: "Seed", value: `#${equipe.seed}` },
    { label: "V/D", value: `${equipe.regular_season_wins}-${equipe.regular_season_losses}` },
    { label: "Titres", value: String(equipe.championships) },
    { label: "Arène", value: equipe.arena },
  ];
}

export function getRencontreTitle(rencontre: Rencontre, dataset: Dataset): string {
  if (rencontre.type === "match") {
    const home = dataset.equipesById.get(rencontre.home_team_id)?.name ?? "Équipe locale";
    const away = dataset.equipesById.get(rencontre.away_team_id)?.name ?? "Équipe visiteuse";
    return `${home} vs ${away}`;
  }

  const fighter1 = dataset.athletesById.get(rencontre.fighter1_id)?.first_name ?? "Combatant 1";
  const fighter2 = dataset.athletesById.get(rencontre.fighter2_id)?.first_name ?? "Combatant 2";
  return `${fighter1} vs ${fighter2}`;
}

export function getRencontreSubtitle(rencontre: Rencontre, dataset: Dataset): string {
  if (rencontre.type === "match") {
    return rencontre.status === "finished"
      ? `${rencontre.home_score} - ${rencontre.away_score} · ${rencontre.venue}`
      : `Lieu : ${rencontre.venue}`;
  }

  const winner = dataset.athletesById.get(rencontre.winner_id);
  return winner ? `Vainqueur : ${winner.first_name} ${winner.last_name}` : `Catégorie : ${rencontre.weight_class}`;
}
