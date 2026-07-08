import { loadDataset } from "./platform/data-store.js";
import { applyTheme } from "./platform/preferences.js";
import { renderApp, renderError, renderLoading } from "./app/render-app.js";

async function bootstrap(): Promise<void> {
  const root = document.querySelector<HTMLElement>("#app");

  if (!root) {
    throw new Error("Missing #app root element");
  }

  applyTheme();
  renderLoading(root);

  try {
    const dataset = await loadDataset();
    renderApp(root, dataset);
    window.addEventListener("hashchange", () => {
      renderApp(root, dataset);
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Une erreur inattendue est survenue.";

    renderError(root, message);
  }
}

void bootstrap();
