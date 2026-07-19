import { renderHome } from "./views/home.js";
import { renderInboundForm } from "./views/inboundForm.js";
import { renderRecordForm } from "./views/form.js";

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
