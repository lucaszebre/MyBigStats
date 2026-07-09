export enum SportType {
  TEAM = "team",
  INDIVIDUAL = "individual",
}

export type CompetitionBase = {
  name: string;
  host_country: string;
  format: string;
};

export type ScheduledCompetition = CompetitionBase & {
  start_date: string;
  end_date: string;
  number_of_teams: number;
};

export type OneDayCompetition = CompetitionBase & {
  venue: string;
  date: string;
};

export type Competition = ScheduledCompetition | OneDayCompetition;

export type Sport = {
  id: number;
  name: string;
  slug: string;
  type: SportType;
  players_per_team: number;
  match_duration_minutes: number;
  governing_body: string;
  competition: Competition;
};
