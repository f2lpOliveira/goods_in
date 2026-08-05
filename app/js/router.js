import { renderHome } from "./views/home.js";
import { renderInboundForm } from "./views/inbound.js";
import { renderProductForm } from "./views/product.js";
import { renderHistory } from "./views/history.js";

export const ROUTES = {
  HOME: "home",
  INBOUND_FORM: "inboundForm",
  PRODUCT: "product",
  HISTORY: "history",
};

const routes = {
  [ROUTES.HOME]: renderHome,
  [ROUTES.INBOUND_FORM]: renderInboundForm,
  [ROUTES.PRODUCT]: renderProductForm,
  [ROUTES.HISTORY]: renderHistory,
};

export function navigate(route) {
  const view = routes[route];

  if (!view) {
    console.error(`Unknown route: ${route}`);
    return;
  }

  view();
}
