const LAST_ROUTE_KEY = "lastRoute";

export function getLastRoute() {
  return localStorage.getItem(LAST_ROUTE_KEY);
}

export function setLastRoute(route) {
  localStorage.setItem(LAST_ROUTE_KEY, route);
}

export function clearLastRoute() {
  localStorage.removeItem(LAST_ROUTE_KEY);
}
