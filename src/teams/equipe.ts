export type BaseEquipe = {
  id: number;
  sport_id: number;
  name: string;
  short_name: string;
  coach: string;
};

export type FootballEquipe = BaseEquipe & {
  country: string;
  confederation: string;
  fifa_ranking: number;
  world_cup_titles: number;
  world_cup_appearances: number;
  group: string;
};

export type BasketballEquipe = BaseEquipe & {
  city: string;
  conference: string;
  seed: number;
  regular_season_wins: number;
  regular_season_losses: number;
  championships: number;
  arena: string;
};

export type Equipe = FootballEquipe | BasketballEquipe;
