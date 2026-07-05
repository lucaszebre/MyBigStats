import type { Rencontre } from "../domain/index.js";
import type { Dataset } from "../services/index.js";
import {
  renderAthleteCard,
  renderComparisonPanel,
  renderEquipeSection,
  renderRencontreCard,
  renderSportCard,
  renderStatCard,
} from "./card-renderers.js";

type AppView = "home" | "sport";

type AppRoute =
  | {
      view: "home";
    }
  | {
      view: "sport";
      sportId: number;
    };

function resolveRouteFromHash(hash = window.location.hash): AppRoute {
  const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash;
  const sportMatch = cleanHash.match(/^sport\/(\d+)$/);

  if (sportMatch) {
    const sportId = Number(sportMatch[1]);
    if (!Number.isNaN(sportId)) {
      return { view: "sport", sportId };
    }
  }

  if (cleanHash === "sport") {
    return { view: "sport", sportId: 0 };
  }

  return { view: "home" };
}

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function getUpcomingRencontres(dataset: Dataset): Rencontre[] {
  return dataset.rencontres
    .filter((rencontre: Rencontre) => rencontre.date >= getTodayString())
    .sort((a, b) => a.date.localeCompare(b.date));
}

function getUpcomingRencontresForSport(rencontres: Dataset["rencontres"]): Rencontre[] {
  return rencontres
    .filter((rencontre: Rencontre) => rencontre.date >= getTodayString())
    .sort((a, b) => a.date.localeCompare(b.date));
}

function getSportComparisonMetrics(athlete: Dataset["athletes"][number], sport: Dataset["sports"][number]): Array<{ label: string; value: number }> {
  const isFootball = sport.name.toLowerCase().includes("football");
  const isBasketball = sport.name.toLowerCase().includes("basketball");
  const isMma = sport.name.toLowerCase().includes("mma") || sport.name.toLowerCase().includes("combat");

  if (isFootball) {
    if ("goals" in athlete.stats) {
      return [
        { label: "Buts", value: athlete.stats.goals },
        { label: "Passes", value: athlete.stats.assists },
        { label: "Matchs", value: athlete.stats.matches_played },
        { label: "Minutes", value: athlete.stats.minutes_played },
      ];
    }
  }

  if (isBasketball) {
    if ("points_per_game" in athlete.stats) {
      return [
        { label: "Points/match", value: athlete.stats.points_per_game },
        { label: "Passes/match", value: athlete.stats.assists_per_game },
        { label: "Rebonds/match", value: athlete.stats.rebounds_per_game },
        { label: "Contres/match", value: athlete.stats.blocks_per_game },
      ];
    }
  }

  if (isMma) {
    if ("wins" in athlete.stats) {
      return [
        { label: "Victoires", value: athlete.stats.wins },
        { label: "KO", value: athlete.stats.wins_by_ko },
        { label: "Soumission", value: athlete.stats.wins_by_submission },
        { label: "Décision", value: athlete.stats.wins_by_decision },
      ];
    }
  }

  return [
    { label: "Équilibre", value: 1 },
    { label: "Impact", value: 1 },
    { label: "Régularité", value: 1 },
    { label: "Force", value: 1 },
  ];
}

function renderHomeView(dataset: Dataset): string {
  const summaryCards = [
    renderStatCard("Sports", String(dataset.sports.length), "disciplines disponibles"),
    renderStatCard("Athlètes", String(dataset.athletes.length), "profil détaillé"),
    renderStatCard("Équipes", String(dataset.equipes.length), "clubs et sélections"),
    renderStatCard("Rencontres", String(dataset.rencontres.length), "résultats et agenda"),
  ].join("");

  const upcomingEvents = getUpcomingRencontres(dataset)
    .slice(0, 6)
    .map((rencontre) => renderRencontreCard(rencontre, dataset))
    .join("");

  const sportCards = dataset.sports.map((sport) => renderSportCard(sport, dataset)).join("");

  return `
    <section class="stack">
      <div class="grid summary-grid">${summaryCards}</div>

      <section class="panel">
        <div class="section-title">
          <div>
            <p class="eyebrow">Navigation</p>
            <h2>Explorer les sports</h2>
          </div>
        </div>
        <div class="sport-grid">${sportCards}</div>
      </section>

      <section class="panel">
        <div class="section-title">
          <div>
            <p class="eyebrow">Agenda</p>
            <h2>Événements à venir</h2>
          </div>
        </div>
        <div class="stack">${upcomingEvents || '<p class="empty-state">Aucun événement à venir pour le moment.</p>'}</div>
      </section>
    </section>
  `;
}

function renderSportView(dataset: Dataset, sportId: number): string {
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
  const upcoming = getUpcomingRencontresForSport(rencontres);
  const isMma = sport.name.toLowerCase().includes("mma") || sport.name.toLowerCase().includes("combat");
  const highlightTitle = isMma ? "Highlight : les combattants" : "Highlight : les joueurs";

  const athleteCards = athletes.map((athlete) => renderAthleteCard(athlete, dataset)).join("");
  const eventCards = upcoming.map((rencontre) => renderRencontreCard(rencontre, dataset)).join("");
  const teamMarkup = isMma ? "" : renderEquipeSection(equipes, sport);

  const comparisonOptions = athletes
    .map((athlete) => `<option value="${athlete.id}" ${athlete.id === athletes[0]?.id ? "selected" : ""}>${athlete.first_name} ${athlete.last_name}</option>`)
    .join("");

  const comparisonMarkup = athletes.length >= 2
    ? `
      <div class="compare-controls">
        <label>
          <span>Premier athlète</span>
          <select data-athlete-select="primary">
            ${comparisonOptions}
          </select>
        </label>
        <label>
          <span>Deuxième athlète</span>
          <select data-athlete-select="secondary">
            ${comparisonOptions.replace(/selected/g, "")}
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
          <p class="eyebrow">${sport.type === "team" ? "Sport collectif" : "Sport individuel"}</p>
          <h2>${sport.name}</h2>
          <p>${sport.competition.name} · ${sport.governing_body}</p>
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
            <p class="eyebrow">Comparaison</p>
            <h2>Comparer deux athlètes</h2>
          </div>
        </div>
        ${comparisonMarkup}
      </section>

      <section class="panel">
        <div class="section-title">
          <div>
            <p class="eyebrow">${highlightTitle}</p>
          </div>
        </div>
        <div class="sport-grid">${athleteCards || '<p class="empty-state">Aucun athlète disponible.</p>'}</div>
      </section>

      ${!isMma ? `
        <section class="panel team-panel">
          <div class="section-title">
            <div>
              <p class="eyebrow">Équipes</p>
              <h2>Classement des meilleures équipes</h2>
            </div>
          </div>
          ${teamMarkup || '<p class="empty-state">Aucune équipe disponible.</p>'}
        </section>
      ` : ""}

      <section class="panel events-panel">
        <div class="section-title">
          <div>
            <p class="eyebrow">Agenda</p>
            <h2>Les rencontres à venir</h2>
          </div>
        </div>
        <div class="stack">${eventCards || '<p class="empty-state">Aucune rencontre à venir.</p>'}</div>
      </section>
    </section>
  `;
}

export function renderApp(root: HTMLElement, dataset: Dataset): void {
  const route = resolveRouteFromHash();
  const content = route.view === "sport" && route.sportId !== undefined
    ? renderSportView(dataset, route.sportId)
    : renderHomeView(dataset);

  root.innerHTML = `
    <div class="shell">
      <header class="hero">
        <p class="eyebrow">MyBigStats</p>
        <h1>Suivez les sports, les athlètes et les rencontres</h1>
        <p>Récupérez les données depuis l’API et découvrez les événements à venir, les équipes et les comparaisons d’athlètes.</p>
        <nav class="nav" aria-label="Navigation principale">
          <button type="button" class="${route.view === "home" ? "active" : ""}" data-route="home">Accueil</button>
          ${dataset.sports
            .map((sport) => `<button type="button" class="${route.view === "sport" && route.sportId === sport.id ? "active" : ""}" data-route="sport" data-sport-id="${sport.id}">${sport.name}</button>`)
            .join("")}
        </nav>
      </header>
      <main class="content">${content}</main>
    </div>
  `;

  const routeButtons = root.querySelectorAll<HTMLButtonElement>("[data-route]");
  routeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextView = button.dataset.route === "sport" ? "sport" : "home";
      const sportId = button.dataset.sportId;

      if (nextView === "sport" && sportId) {
        window.location.hash = `sport/${sportId}`;
      } else {
        window.location.hash = "home";
      }

      renderApp(root, dataset);
    });
  });

  const athletePrimary = root.querySelector<HTMLSelectElement>('[data-athlete-select="primary"]');
  const athleteSecondary = root.querySelector<HTMLSelectElement>('[data-athlete-select="secondary"]');
  const comparisonPanel = root.querySelector<HTMLElement>("#comparison-panel");

  const refreshComparison = () => {
    if (!comparisonPanel || !athletePrimary || !athleteSecondary || route.view !== "sport" || route.sportId === undefined) {
      return;
    }

    const sport = dataset.sportsById.get(route.sportId);
    if (!sport) {
      return;
    }

    const primaryId = Number(athletePrimary.value);
    const secondaryId = Number(athleteSecondary.value);
    const primary = dataset.athletesById.get(primaryId);
    const secondary = dataset.athletesById.get(secondaryId);

    comparisonPanel.innerHTML = renderComparisonPanel(dataset, sport, primaryId, secondaryId);

    if (!primary || !secondary) {
      return;
    }

    const chartContainer = comparisonPanel.querySelector<HTMLElement>("[data-comparison-chart]");
    if (!chartContainer) {
      return;
    }

    const primaryMetrics = getSportComparisonMetrics(primary, sport);
    const secondaryMetrics = getSportComparisonMetrics(secondary, sport);
    const indicators = primaryMetrics.map((metric, index) => ({
      name: metric.label,
      max: Math.max(primaryMetrics[index]?.value ?? 0, secondaryMetrics[index]?.value ?? 0, 5),
    }));

    const shortName = (a: typeof primary) => {
      const last = a.last_name.split(' ')[0] ?? a.last_name;
      return `${a.first_name} ${last.length > 8 ? last[0] + '.' : last}`;
    };

    const s1 = shortName(primary);
    const s2 = shortName(secondary);

    const chart = (window as Window & { echarts?: { init: (element: HTMLElement) => { setOption: (options: unknown) => void; resize: () => void } } }).echarts?.init(chartContainer);
    if (!chart) {
      comparisonPanel.innerHTML = '<p class="empty-state">Le graphique radar est indisponible dans cette configuration.</p>';
      return;
    }

    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: {
        bottom: 8,
        left: 'center',
        orient: 'horizontal',
        itemGap: 12,
        data: [s1, s2],
        textStyle: { color: '#e2e8f0' },
      },
      radar: {
        center: ['50%', '44%'],
        indicator: indicators,
        radius: '55%',
        splitArea: { areaStyle: { color: ['rgba(56,189,248,0.06)', 'rgba(15,23,42,0.28)'] } },
        axisName: { color: '#cbd5e1' },
        splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)' } },
      },
      series: [
        {
          type: 'radar',
          label: { show: true, color: '#e2e8f0', formatter: '{c}' },
          data: [
            { value: primaryMetrics.map((m) => m.value), name: s1, areaStyle: { color: 'rgba(56,189,248,0.25)' }, lineStyle: { color: '#38bdf8' } },
            { value: secondaryMetrics.map((m) => m.value), name: s2, areaStyle: { color: 'rgba(248,113,113,0.2)' }, lineStyle: { color: '#f87171' } },
          ],
        },
      ],
    });

    window.addEventListener('resize', () => chart.resize(), { once: false });
  };

  athletePrimary?.addEventListener("change", refreshComparison);
  athleteSecondary?.addEventListener("change", refreshComparison);
  refreshComparison();
}

export function renderError(root: HTMLElement, message: string): void {
  root.innerHTML = `
    <section class="panel">
      <h1>MyBigStats</h1>
      <p role="alert">${message}</p>
    </section>
  `;
}
