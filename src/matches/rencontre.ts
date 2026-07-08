export enum RencontreStatus {
  FINISHED = "finished",
}

export enum RencontreType {
  MATCH = "match",
  COMBAT = "combat",
}

export type Scorer = {
  athlete_id: number;
  minute: number;
};

export type QuarterScores = {
  home: number[];
  away: number[];
};

export type BaseRencontre = {
  id: number;
  sport_id: number;
  type: RencontreType;
  date: string;
  venue: string;
  status: RencontreStatus;
};

export type MatchRencontre = BaseRencontre & {
  type: RencontreType.MATCH;
  home_team_id: number;
  away_team_id: number;
  home_score: number;
  away_score: number;
  attendance: number;
  stage?: string;
  playoff_round?: string;
  game_number?: number;
  series?: string;
  scorers?: Scorer[];
  quarter_scores?: QuarterScores;
};

export type CombatRencontre = BaseRencontre & {
  type: RencontreType.COMBAT;
  card_position: string;
  fighter1_id: number;
  fighter2_id: number;
  winner_id: number;
  method: string;
  round: number;
  time: string;
  weight_class: string;
  title_fight: boolean;
};

export type Rencontre = MatchRencontre | CombatRencontre;
