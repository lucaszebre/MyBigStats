import type { Dataset } from "../platform/data-store.js";
import type { Athlete } from "../athletes/athlete.js";
import type { Equipe } from "../teams/equipe.js";
import type { Rencontre } from "../matches/rencontre.js";
import type { Sport } from "./sport.js";
import { SportType } from "./sport.js";
import { Theme } from "../platform/preferences.js";
import type { ObjectValues } from "../platform/types.js";
import { renderStatCard } from "../platform/stat-card.js";
import { renderAthleteCard } from "../athletes/athlete-card.js";
import { renderEquipeSection } from "../teams/team-card.js";
import { renderRencontreCard } from "../matches/event-card.js";
import { renderComparisonPanel, compareAthletes } from "../comparison/comparison-panel.js";
import { getAthleteRole } from "../athletes/athlete-helpers.js";
import { escapeHtml } from "../platform/html.js";
import { getPastRencontresForSport, getUpcomingRencontresForSport } from "../matches/match-utils.js";
import { isMmaSport } from "./sport-utils.js";

const SportTab = {
  HISTORY: "history",
  TEAMS: "teams",
  PLAYERS: "players",
  STATS: "stats",
  UPCOMING: "upcoming",
} as const;

type SportTab = ObjectValues<typeof SportTab>;

export function renderSportPage(dataset: Dataset, sportId: number): string {
  const sport = dataset.sportsById.get(sportId);

  if (!sport) {
    return `
      <section class="panel empty-state">
        <h2>Sport introuvable</h2>
        <p>Le sport demandé n’existe pas dans la base de données.</p>
      </section>
    `;
  }

  const athletes = dataset.athletes.filter((athlete) => athlete.sport_id === sport.id);
  const equipes = dataset.equipes.filter((equipe) => equipe.sport_id === sport.id);
  const rencontres = dataset.rencontres.filter((rencontre) => rencontre.sport_id === sport.id);
  const pastEvents = getPastRencontresForSport(rencontres);
  const upcoming = getUpcomingRencontresForSport(rencontres);
  const isMma = isMmaSport(sport);
  const highlightTitle = isMma ? "Highlight : les combattants" : "Highlight : les joueurs";

  const athleteCards = athletes.map((athlete) => renderAthleteCard(athlete, dataset)).join("");
  const athleteCardsMarkup = athleteCards || "";
  const athleteEmptyPlaceholder = athleteCards
    ? '<p class="empty-state" data-athlete-empty style="display:none">Aucun résultat</p>'
    : '<p class="empty-state">Aucun résultat</p>';
  const athleteRoles = Array.from(new Set(athletes.map(getAthleteRole))).sort();
  const roleOptions = [
    `<option value="">${isMma ? "Tous les surnoms" : "Tous les rôles"}</option>`,
    ...athleteRoles.map((role) => `<option value="${role}">${role}</option>`),
  ].join("");
  const historicalCards = pastEvents.map((rencontre) => renderRencontreCard(rencontre, dataset)).join("");
  const upcomingCards = upcoming.map((rencontre) => renderRencontreCard(rencontre, dataset)).join("");
  const teamMarkup = isMma ? "" : renderEquipeSection(equipes, sport);

  const buildAthleteOptions = (selectedId?: number) =>
    athletes
      .map((athlete) => `<option value="${athlete.id}" ${athlete.id === selectedId ? "selected" : ""}>${escapeHtml(`${athlete.first_name} ${athlete.last_name}`)}</option>`)
      .join("");

  const comparisonMarkup = athletes.length >= 2
    ? `
      <div class="compare-controls">
        <label>
          <span>Premier athlète</span>
          <select data-athlete-select="primary">
            ${buildAthleteOptions(athletes[0]?.id)}
          </select>
        </label>
        <label>
          <span>Deuxième athlète</span>
          <select data-athlete-select="secondary">
            ${buildAthleteOptions(athletes[1]?.id ?? athletes[0]?.id)}
          </select>
        </label>
      </div>
      <div id="comparison-panel" class="comparison-panel"></div>
    `
    : '<p class="empty-state">Pas assez d’athlètes pour une comparaison.</p>';

  return `
    <section class="stack">
      <section class="panel sport-hero">
        <div>
          <p class="eyebrow">${sport.type === SportType.TEAM ? "Sport collectif" : "Sport individuel"}</p>
          <h2>${escapeHtml(sport.name)}</h2>
          <p>${escapeHtml(sport.competition.name)} · ${escapeHtml(sport.governing_body)}</p>
        </div>
        <div class="grid summary-grid">
          ${renderStatCard("Participants", String(athletes.length), "athlètes référencés")}
          ${renderStatCard("Équipes", String(equipes.length), "structures observées")}
          ${renderStatCard("Rencontres", String(rencontres.length), "matchs et combats")}
          ${renderStatCard("À venir", String(upcoming.length), "événements planifiés")}
        </div>
      </section>

      <section class="panel">
        <div class="section-title">
          <div>
            <p class="eyebrow">Navigation</p>
            <h2>Détails du sport</h2>
          </div>
        </div>
        <div class="tabs" role="tablist">
          <button type="button" class="tab-button active" data-tab="${SportTab.HISTORY}">Historique</button>
          <button type="button" class="tab-button" data-tab="${SportTab.TEAMS}">Équipes</button>
          <button type="button" class="tab-button" data-tab="${SportTab.PLAYERS}">${isMma ? "Combattants" : "Joueurs"}</button>
          <button type="button" class="tab-button" data-tab="${SportTab.STATS}">Stats</button>
          <button type="button" class="tab-button" data-tab="${SportTab.UPCOMING}">À venir</button>
        </div>

        <div class="tab-panel active" data-tab-panel="${SportTab.HISTORY}">
          <div class="section-title">
            <div>
              <p class="eyebrow">Historique</p>
              <h2>Matchs et combats passés</h2>
            </div>
          </div>
          <div class="stack">${historicalCards || '<p class="empty-state">Aucun historique disponible.</p>'}</div>
        </div>

        <div class="tab-panel" data-tab-panel="${SportTab.TEAMS}">
          <div class="section-title">
            <div>
              <p class="eyebrow">Équipes</p>
              <h2>Classement des meilleures équipes</h2>
            </div>
          </div>
          ${teamMarkup || '<p class="empty-state">Aucune équipe disponible.</p>'}
        </div>

        <div class="tab-panel" data-tab-panel="${SportTab.PLAYERS}">
          <div class="section-title">
            <div>
              <p class="eyebrow">${highlightTitle}</p>
              <h2>Recherche et performances</h2>
            </div>
          </div>
          <div class="filter-row">
            <label>
              <span>Rechercher</span>
              <input type="search" placeholder="Nom de l’athlète" data-athlete-search class="search-input" />
            </label>
            <label>
              <span>${isMma ? "Filtrer par surnom" : "Filtrer par rôle"}</span>
              <select data-athlete-role-filter class="select-input">
                ${roleOptions}
              </select>
            </label>
          </div>
          <div class="sport-grid" data-athlete-list>${athleteCardsMarkup}</div>
          ${athleteEmptyPlaceholder}
        </div>

        <div class="tab-panel" data-tab-panel="${SportTab.STATS}">
          <div class="section-title">
            <div>
              <p class="eyebrow">Comparaison</p>
              <h2>Comparer deux athlètes</h2>
            </div>
          </div>
          ${comparisonMarkup}
        </div>

        <div class="tab-panel" data-tab-panel="${SportTab.UPCOMING}">
          <div class="section-title">
            <div>
              <p class="eyebrow">À venir</p>
              <h2>Prochains matchs et combats</h2>
            </div>
          </div>
          <div class="stack">${upcomingCards || '<p class="empty-state">Aucun événement à venir.</p>'}</div>
        </div>
      </section>
    </section>
  `;
}

function getSportContext(dataset: Dataset, sportId: number) {
  const sport = dataset.sportsById.get(sportId);
  if (!sport) {
    return null;
  }

  const athletes = dataset.athletes.filter((athlete) => athlete.sport_id === sport.id);
  const equipes = dataset.equipes.filter((equipe) => equipe.sport_id === sport.id);
  const rencontres = dataset.rencontres.filter((rencontre) => rencontre.sport_id === sport.id);
  const isMma = isMmaSport(sport);

  return { sport, athletes, equipes, rencontres, isMma };
}

function getSportComparisonMetrics(athlete: Athlete, sport: Sport): Array<{ label: string; value: number }> {
  const isFootball = sport.name.toLowerCase().includes("football");
  const isBasketball = sport.name.toLowerCase().includes("basketball");
  const isMma = sport.name.toLowerCase().includes("mma") || sport.name.toLowerCase().includes("combat");

  if (isFootball && "goals" in athlete.stats) {
    return [
      { label: "Buts", value: athlete.stats.goals },
      { label: "Passes", value: athlete.stats.assists },
      { label: "Matchs", value: athlete.stats.matches_played },
      { label: "Minutes", value: athlete.stats.minutes_played },
    ];
  }

  if (isBasketball && "points_per_game" in athlete.stats) {
    return [
      { label: "Points/match", value: athlete.stats.points_per_game },
      { label: "Passes/match", value: athlete.stats.assists_per_game },
      { label: "Rebonds/match", value: athlete.stats.rebounds_per_game },
      { label: "Contres/match", value: athlete.stats.blocks_per_game },
    ];
  }

  if (isMma && "wins" in athlete.stats) {
    return [
      { label: "Victoires", value: athlete.stats.wins },
      { label: "KO", value: athlete.stats.wins_by_ko },
      { label: "Soumission", value: athlete.stats.wins_by_submission },
      { label: "Décision", value: athlete.stats.wins_by_decision },
    ];
  }

  return [
    { label: "Équilibre", value: 1 },
    { label: "Impact", value: 1 },
    { label: "Régularité", value: 1 },
    { label: "Force", value: 1 },
  ];
}

function getShortAthleteName(athlete: Athlete) {
  const last = athlete.last_name.split(" ")[0] ?? athlete.last_name;
  return `${athlete.first_name} ${last.length > 8 ? last[0] + "." : last}`;
}

interface EchartsInstance {
  setOption: (options: unknown) => void;
  resize: () => void;
  dispose: () => void;
}

export function initSportPage(root: HTMLElement, dataset: Dataset, sportId: number): void {
  const context = getSportContext(dataset, sportId);
  if (!context) {
    return;
  }

  const { sport, athletes } = context;
  const routeButtons = root.querySelectorAll<HTMLButtonElement>("[data-route]");
  const tabButtons = root.querySelectorAll<HTMLButtonElement>("[data-tab]");
  const tabPanels = root.querySelectorAll<HTMLElement>("[data-tab-panel]");
  const athletePrimary = root.querySelector<HTMLSelectElement>('[data-athlete-select="primary"]');
  const athleteSecondary = root.querySelector<HTMLSelectElement>('[data-athlete-select="secondary"]');
  const comparisonPanel = root.querySelector<HTMLElement>("#comparison-panel");
  const athleteSearch = root.querySelector<HTMLInputElement>("[data-athlete-search]");
  const athleteRoleFilter = root.querySelector<HTMLSelectElement>("[data-athlete-role-filter]");
  const athleteCards = Array.from(root.querySelectorAll<HTMLElement>("[data-athlete-card]"));
  const athleteEmpty = root.querySelector<HTMLElement>("[data-athlete-empty]");
  let currentChart: EchartsInstance | null = null;

  const setActiveTab = (tabName: string): void => {
    tabButtons.forEach((button) => button.classList.toggle("active", button.dataset.tab === tabName));
    tabPanels.forEach((panel) => panel.classList.toggle("active", panel.dataset.tabPanel === tabName));

    if (tabName === SportTab.STATS) {
      currentChart?.resize();
    }
  };

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveTab(button.dataset.tab ?? SportTab.HISTORY);
    });
  });

  const refreshAthleteList = (): void => {
    if (!athleteSearch || !athleteCards.length) {
      return;
    }

    const query = athleteSearch.value.trim().toLowerCase();
    const roleFilter = athleteRoleFilter?.value.toLowerCase() ?? "";
    let visibleCount = 0;

    athleteCards.forEach((card) => {
      const name = card.dataset.athleteName?.toLowerCase() ?? "";
      const role = card.dataset.athleteRole?.toLowerCase() ?? "";
      const matchesQuery = !query || name.includes(query);
      const matchesRole = !roleFilter || role === roleFilter;
      const visible = matchesQuery && matchesRole;

      card.style.display = visible ? "" : "none";
      if (visible) {
        visibleCount += 1;
      }
    });

    if (athleteEmpty) {
      athleteEmpty.style.display = visibleCount === 0 ? "" : "none";
    }
  };

  const refreshComparison = (): void => {
    if (!comparisonPanel || !athletePrimary || !athleteSecondary) {
      return;
    }

    const primaryId = Number(athletePrimary.value);
    const secondaryId = Number(athleteSecondary.value);

    comparisonPanel.innerHTML = renderComparisonPanel(dataset, sport, primaryId, secondaryId);

    currentChart?.dispose();
    currentChart = null;

    const comparison = compareAthletes(dataset, primaryId, secondaryId);
    if (!comparison.ok) {
      return;
    }

    const { primary, secondary } = comparison;

    const chartContainer = comparisonPanel.querySelector<HTMLElement>('[data-comparison-chart]');
    if (!chartContainer) {
      return;
    }

    const primaryMetrics = getSportComparisonMetrics(primary, sport);
    const secondaryMetrics = getSportComparisonMetrics(secondary, sport);
    const indicators = primaryMetrics.map((metric, index) => ({
      name: metric.label,
      max: Math.max(primaryMetrics[index]?.value ?? 0, secondaryMetrics[index]?.value ?? 0, 5),
    }));

    const s1 = getShortAthleteName(primary);
    const s2 = getShortAthleteName(secondary);

    const chart = (window as Window & { echarts?: { init: (element: HTMLElement) => EchartsInstance } }).echarts?.init(chartContainer);
    if (!chart) {
      comparisonPanel.innerHTML = '<p class="empty-state">Le graphique radar est indisponible dans cette configuration.</p>';
      return;
    }

    const isLight = document.documentElement.getAttribute('data-theme') === Theme.LIGHT;
    const legendColor = isLight ? '#334155' : '#e2e8f0';
    const axisNameColor = isLight ? '#475569' : '#cbd5e1';
    const splitAreaColors = isLight
      ? ['rgba(56,189,248,0.08)', 'rgba(226,232,240,0.35)']
      : ['rgba(56,189,248,0.06)', 'rgba(15,23,42,0.28)'];

    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: {
        bottom: 8,
        left: 'center',
        orient: 'horizontal',
        itemGap: 12,
        data: [s1, s2],
        textStyle: { color: legendColor },
      },
      radar: {
        center: ['50%', '44%'],
        indicator: indicators,
        radius: '55%',
        splitArea: { areaStyle: { color: splitAreaColors } },
        axisName: { color: axisNameColor },
        splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)' } },
      },
      series: [
        {
          type: 'radar',
          label: { show: true, color: legendColor, formatter: '{c}' },
          data: [
            { value: primaryMetrics.map((m) => m.value), name: s1, areaStyle: { color: 'rgba(56,189,248,0.25)' }, lineStyle: { color: '#38bdf8' } },
            { value: secondaryMetrics.map((m) => m.value), name: s2, areaStyle: { color: 'rgba(248,113,113,0.2)' }, lineStyle: { color: '#f87171' } },
          ],
        },
      ],
    });

    currentChart = chart;
  };

  window.addEventListener('resize', () => currentChart?.resize());

  athleteSearch?.addEventListener("input", refreshAthleteList);
  athleteRoleFilter?.addEventListener("change", refreshAthleteList);
  athletePrimary?.addEventListener("change", refreshComparison);
  athleteSecondary?.addEventListener("change", refreshComparison);
  refreshComparison();
}
