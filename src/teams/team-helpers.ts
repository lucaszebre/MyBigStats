import type { Equipe } from "./equipe.js";

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
