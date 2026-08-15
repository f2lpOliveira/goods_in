import { navigate, ROUTES } from "./router.js";
import { getCurrentInbound } from "./state/currentInbound.js";
import { getLastRoute } from "./state/navigationState.js";

restoreApplicationState();

function restoreApplicationState() {
  const currentInbound = getCurrentInbound();

  if (currentInbound) {
    navigate(ROUTES.PRODUCT);
    return;
  }

  const lastRoute = getLastRoute();

  if (lastRoute === ROUTES.HISTORY) {
    navigate(ROUTES.HISTORY);
    return;
  }

  navigate(ROUTES.HOME);
}

registerServiceWorker();

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "./service-worker.js"
      );

      console.log("Service Worker registered:", registration.scope);
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}
