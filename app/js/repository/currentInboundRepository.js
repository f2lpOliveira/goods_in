const STORAGE_KEY = "currentInbound";

export function saveCurrentInbound(inbound) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inbound));
}

export function loadCurrentInbound() {
  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : null;
}

export function clearCurrentInbound() {
  localStorage.removeItem(STORAGE_KEY);
}
