import { renderHome } from "./views/home.js";
import { renderInboundForm } from "./views/inbound.js";
import { renderProductForm } from "./views/product.js";
import { renderHistory } from "./views/history.js";
import { renderCatalog } from "./views/catalog.js";
import { renderProductRegistration } from "./views/productRegistration.js";

export const ROUTES = {
  HOME: "home",
  INBOUND_FORM: "inboundForm",
  PRODUCT: "product",
  HISTORY: "history",
  CATALOG: "catalog",
  PRODUCT_REGISTRATION: "productRegistration",
};

const routes = {
  [ROUTES.HOME]: renderHome,
  [ROUTES.INBOUND_FORM]: renderInboundForm,
  [ROUTES.PRODUCT]: renderProductForm,
  [ROUTES.HISTORY]: renderHistory,
  [ROUTES.CATALOG]: renderCatalog,
  [ROUTES.PRODUCT_REGISTRATION]: renderProductRegistration,
};

export function navigate(route) {
  const view = routes[route];

  if (!view) {
    console.error(`Unknown route: ${route}`);
    return;
  }

  view();
}
