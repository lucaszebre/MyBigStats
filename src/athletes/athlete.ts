export type BaseAthlete = {
  id: number;
  sport_id: number;
  team_id: number | null;
  first_name: string;
  last_name: string;
  nationality: string;
  birth_date: string;
  height_cm: number;
  weight_kg: number;
};

export type FootballStats = {
  matches_played: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played: number;
};

export type BasketballStats = {
  games_played: number;
  points_per_game: number;
  rebounds_per_game: number;
  assists_per_game: number;
  steals_per_game: number;
  blocks_per_game: number;
  field_goal_percentage: number;
  three_point_percentage: number;
  free_throw_percentage: number;
  minutes_per_game: number;
};

export type MmaStats = {
  wins: number;
  losses: number;
  draws: number;
  no_contests: number;
  wins_by_ko: number;
  wins_by_submission: number;
  wins_by_decision: number;
  title_defenses: number;
};

export type TeamAthlete = BaseAthlete & {
  team_id: number;
  position: string;
  jersey_number: number;
  stats: FootballStats | BasketballStats;
};

export type MmaAthlete = BaseAthlete & {
  team_id: null;
  nickname: string | null;
  reach_cm: number;
  weight_class: string;
  stance: string;
  stats: MmaStats;
};

export type Athlete = TeamAthlete | MmaAthlete;
