import type { Dataset } from "../services/index.js";

export function renderApp(root: HTMLElement, dataset: Dataset): void {
  root.innerHTML = `
    <section>
      <h1>MyBigStats</h1>
      <p>Donnees chargees depuis l'API.</p>
      <ul>
        <li>${dataset.sports.length} sports</li>
        <li>${dataset.athletes.length} athletes</li>
        <li>${dataset.equipes.length} equipes</li>
        <li>${dataset.rencontres.length} rencontres</li>
      </ul>
    </section>
  `;
}

export function renderError(root: HTMLElement, message: string): void {
  root.innerHTML = `
    <section>
      <h1>MyBigStats</h1>
      <p role="alert">${message}</p>
    </section>
  `;
}
