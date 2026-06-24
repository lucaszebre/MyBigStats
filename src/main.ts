import type { Sport } from "./domain/index.js";
import { ApiEndpoint, fetchApi } from "./services/index.js";
import { renderApp, renderError } from "./ui/render-app.js";

async function bootstrap(): Promise<void> {
  const root = document.querySelector<HTMLElement>("#app");

  if (!root) {
    throw new Error("Missing #app root element");
  }

  try {
    const sports = await fetchApi<Sport[]>(ApiEndpoint.SPORTS);
    renderApp(root, sports);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Une erreur inattendue est survenue.";

    renderError(root, message);
  }
}

void bootstrap();
