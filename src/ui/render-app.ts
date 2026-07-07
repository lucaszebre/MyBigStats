import type { Dataset } from "../services/index.js";
import {
  renderApp as renderAppShell,
  renderError as renderErrorShell,
  renderLoading as renderLoadingShell,
} from "./app-shell.js";

export function renderApp(root: HTMLElement, dataset: Dataset): void {
  renderAppShell(root, dataset);
}

export function renderLoading(root: HTMLElement): void {
  renderLoadingShell(root);
}

export function renderError(root: HTMLElement, message: string): void {
  renderErrorShell(root, message);
}
