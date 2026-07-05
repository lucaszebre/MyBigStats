import type { Dataset } from "../services/index.js";
import { renderApp as renderAppShell, renderError as renderErrorShell } from "./app-shell.js";

export function renderApp(root: HTMLElement, dataset: Dataset): void {
  renderAppShell(root, dataset);
}

export function renderError(root: HTMLElement, message: string): void {
  renderErrorShell(root, message);
}
