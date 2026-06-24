import type { Sport } from "../domain/index.js";

export function renderApp(root: HTMLElement, sports: Sport[]): void {
  root.innerHTML = `
    <section>
      <h1>MyBigStats</h1>
      <p>Architecture TypeScript initialisee.</p>
      <p>${sports.length} sports disponibles depuis l'API.</p>
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
