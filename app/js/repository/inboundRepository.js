const STORAGE_KEY = "inbounds";

export function saveInbounds(inbounds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inbounds));
}

export function loadInbounds() {
  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}
