import { renderHome } from "./views/home.js";
import { renderRecordForm } from "./views/form.js";

export const routes = {
  home: renderHome,
  form: renderRecordForm,
};

export function navigate(route) {
  const view = routes[route];

  if (!view) {
    console.error(`Unknown route: ${route}`);
    return;
  }

  view();
}
