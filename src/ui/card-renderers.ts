import type { Athlete, Equipe, Rencontre, Sport } from "../domain/index.js";
import type { Dataset } from "../services/index.js";

function formatDate(date: string): string {
  const parsed = new Date(date);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function getAthleteRole(athlete: Athlete): string {
  if ("position" in athlete) {
    return athlete.position;
  }

  if ("nickname" in athlete && athlete.nickname) {
    return athlete.nickname;
  }

  return athlete.weight_class;
}

function getAthleteStatsSummary(athlete: Athlete): string {
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

function getEquipeContext(equipe: Equipe): string {
  if ("country" in equipe) {
    return `${equipe.country} · ${equipe.confederation}`;
  }

  return `${equipe.city} · ${equipe.conference}`;
}

function getAthleteDetailRows(athlete: Athlete): Array<{ label: string; value: string }> {
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

function getEquipeDetailRows(equipe: Equipe): Array<{ label: string; value: string }> {
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

function getRencontreTitle(rencontre: Rencontre, dataset: Dataset): string {
  if (rencontre.type === "match") {
    const home = dataset.equipesById.get(rencontre.home_team_id)?.name ?? "Équipe locale";
    const away = dataset.equipesById.get(rencontre.away_team_id)?.name ?? "Équipe visiteuse";
    return `${home} vs ${away}`;
  }

  const fighter1 = dataset.athletesById.get(rencontre.fighter1_id)?.first_name ?? "Combatant 1";
  const fighter2 = dataset.athletesById.get(rencontre.fighter2_id)?.first_name ?? "Combatant 2";
  return `${fighter1} vs ${fighter2}`;
}

function getRencontreSubtitle(rencontre: Rencontre, dataset: Dataset): string {
  if (rencontre.type === "match") {
    return rencontre.status === "finished"
      ? `${rencontre.home_score} - ${rencontre.away_score} · ${rencontre.venue}`
      : `Lieu : ${rencontre.venue}`;
  }

  const winner = dataset.athletesById.get(rencontre.winner_id);
  return winner ? `Vainqueur : ${winner.first_name} ${winner.last_name}` : `Catégorie : ${rencontre.weight_class}`;
}

function getComparisonRows(athlete: Athlete, sport: Sport): Array<{ label: string; value: string }> {
  const rows = [
    { label: "Nom", value: `${athlete.first_name} ${athlete.last_name}` },
    { label: "Nationalité", value: athlete.nationality },
    { label: "Taille", value: `${athlete.height_cm} cm` },
    { label: "Poids", value: `${athlete.weight_kg} kg` },
  ];

  if ("position" in athlete) {
    rows.push({ label: "Poste", value: athlete.position });
    rows.push({ label: "Maillot", value: `#${athlete.jersey_number}` });
  }

  if (sport.name.toLowerCase().includes("football")) {
    if ("goals" in athlete.stats) {
      rows.push({ label: "Buts", value: String(athlete.stats.goals) });
      rows.push({ label: "Passes", value: String(athlete.stats.assists) });
    }
  }

  if (sport.name.toLowerCase().includes("basketball")) {
    if ("points_per_game" in athlete.stats) {
      rows.push({ label: "Points/match", value: athlete.stats.points_per_game.toFixed(1) });
      rows.push({ label: "Passes/match", value: athlete.stats.assists_per_game.toFixed(1) });
    }
  }

  if (sport.name.toLowerCase().includes("mma") || sport.name.toLowerCase().includes("combat")) {
    if ("wins" in athlete.stats) {
      rows.push({ label: "Victoires", value: String(athlete.stats.wins) });
      rows.push({ label: "Défaites", value: String(athlete.stats.losses) });
    }
  }

  return rows;
}

export function renderStatCard(label: string, value: string, detail: string): string {
  return `
    <article class="card stat-card">
      <span class="stat-label">${label}</span>
      <strong class="stat-value">${value}</strong>
      <span class="stat-detail">${detail}</span>
    </article>
  `;
}

export function renderSportCard(sport: Sport, dataset: Dataset): string {
  const athletesCount = dataset.athletes.filter((athlete) => athlete.sport_id === sport.id).length;
  const teamsCount = dataset.equipes.filter((equipe) => equipe.sport_id === sport.id).length;
  const nextEvents = dataset.rencontres.filter(
    (rencontre) => rencontre.sport_id === sport.id && rencontre.date >= getTodayString(),
  ).length;

  return `
    <article class="card sport-card">
      <div class="card-header sport-card-header">
        <div class="card-title-block">
          <p class="eyebrow">${sport.type === "team" ? "Équipe" : "Individuel"}</p>
          <h3>${sport.name}</h3>
        </div>
      </div>
      <p class="sport-card-subtitle">${sport.competition.name}</p>
      <ul class="inline-list">
        <li>${athletesCount} athlètes</li>
        <li>${teamsCount} équipes</li>
        <li>${nextEvents} à venir</li>
      </ul>
      <a href="#sport/${sport.id}" class="link-button" data-sport-id="${sport.id}">Voir plus</a>
    </article>
  `;
}

export function renderAthleteCard(athlete: Athlete, dataset: Dataset): string {
  const team = athlete.team_id ? dataset.equipesById.get(athlete.team_id) : undefined;
  const teamName = team?.name ?? "Indépendant";
  const detailRows = getAthleteDetailRows(athlete);
  const detailMarkup = detailRows
    .map((row) => `<li class="accordion-stat"><span>${row.label}</span><strong>${row.value}</strong></li>`)
    .join("");

  return `
    <details class="accordion-item athlete-accordion">
      <summary class="accordion-summary">
        <div class="card athlete-card">
          <div class="card-header">
            <div>
              <p class="eyebrow">${teamName}</p>
              <h3>${athlete.first_name} ${athlete.last_name}</h3>
            </div>
            <span class="pill">${athlete.nationality}</span>
          </div>
          <p>${getAthleteRole(athlete)}</p>
          <ul class="inline-list">
            <li>${athlete.height_cm} cm</li>
            <li>${athlete.weight_kg} kg</li>
            <li>${getAthleteStatsSummary(athlete)}</li>
          </ul>
        </div>
      </summary>
      <div class="accordion-content">
        <ul class="accordion-stats-list">${detailMarkup}</ul>
      </div>
    </details>
  `;
}

export function renderEquipeSection(equipes: Equipe[], sport: Sport): string {
  const sortedEquipes = [...equipes].sort((left, right) => {
    if ("fifa_ranking" in left && "fifa_ranking" in right) {
      return left.fifa_ranking - right.fifa_ranking;
    }

    if ("seed" in left && "seed" in right) {
      return left.seed - right.seed;
    }

    return 0;
  });

  const renderEquipeAccordion = (equipe: Equipe): string => {
    const detailRows = getEquipeDetailRows(equipe);
    const detailMarkup = detailRows
      .map((row) => `<li class="accordion-stat"><span>${row.label}</span><strong>${row.value}</strong></li>`)
      .join("");

    const summaryMeta = "country" in equipe
      ? `${equipe.country} · ${equipe.confederation}`
      : `${equipe.city} · ${equipe.conference}`;

    const badge = "fifa_ranking" in equipe
      ? `#${equipe.fifa_ranking}`
      : `#${equipe.seed}`;

    return `
      <details class="accordion-item team-accordion">
        <summary class="accordion-summary">
          <div class="card team-card">
            <div class="card-header">
              <div>
                <p class="eyebrow">${summaryMeta}</p>
                <h3>${equipe.name}</h3>
              </div>
              <span class="pill">${badge}</span>
            </div>
          </div>
        </summary>
        <div class="accordion-content">
          <ul class="accordion-stats-list">${detailMarkup}</ul>
        </div>
      </details>
    `;
  };

  if (sport.name.toLowerCase().includes("basketball")) {
    const eastern = sortedEquipes.filter((equipe) => "conference" in equipe && equipe.conference?.toLowerCase().includes("eastern"));
    const western = sortedEquipes.filter((equipe) => "conference" in equipe && equipe.conference?.toLowerCase().includes("western"));

    const renderConference = (title: string, items: Equipe[]) => `
      <div class="team-group">
        <h3>${title}</h3>
        <div class="team-stack">${items.map(renderEquipeAccordion).join("")}</div>
      </div>
    `;

    return `
      <div class="team-stack">
        ${renderConference("Conférence Est", eastern)}
        ${renderConference("Conférence Ouest", western)}
      </div>
    `;
  }

  return `<div class="team-stack">${sortedEquipes.map(renderEquipeAccordion).join("")}</div>`;
}

export function renderRencontreCard(rencontre: Rencontre, dataset: Dataset): string {
  const sport = dataset.sportsById.get(rencontre.sport_id);
  const title = getRencontreTitle(rencontre, dataset);
  const subtitle = getRencontreSubtitle(rencontre, dataset);

  return `
    <article class="card event-card">
      <div class="card-header">
        <div>
          <p class="eyebrow">${formatDate(rencontre.date)} · ${sport?.name ?? "Sport"}</p>
          <h3>${title}</h3>
        </div>
        <span class="pill">${rencontre.status}</span>
      </div>
      <p>${subtitle}</p>
    </article>
  `;
}

export function renderComparisonPanel(dataset: Dataset, sport: Sport, primaryId: number, secondaryId: number): string {
  const primary = dataset.athletesById.get(primaryId);
  const secondary = dataset.athletesById.get(secondaryId);

  if (!primary || !secondary) {
    return '<p class="empty-state">Sélectionnez deux athlètes pour comparer leurs performances.</p>';
  }

  return `
    <div class="radar-panel">
      <div class="radar-chart" data-comparison-chart></div>
      <p class="radar-caption">Comparaison radar · ${sport.name}</p>
    </div>
  `;
}
