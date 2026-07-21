import { loadInbounds } from "./repository/inboundRepository.js";
import { setInbounds } from "./state/inbounds.js";
import { navigate } from "./router.js";

const savedInbounds = loadInbounds();

setInbounds(savedInbounds);

navigate("home");

if ("serviceWorker" in navigator) {
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
