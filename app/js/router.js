import { renderHome } from "./views/home.js";
import { renderInboundForm } from "./views/inbound.js";
import { renderRecordForm } from "./views/product.js";

export const routes = {
  home: renderHome,
  form: renderRecordForm,
  inboundForm: renderInboundForm,
};

export function navigate(route) {
  const view = routes[route];

  if (!view) {
    console.error(`Unknown route: ${route}`);
    return;
  }

  view();
}
