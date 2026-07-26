const STORAGE_KEY = "inboundDraft";

export function saveDraft(draft) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function loadDraft() {
  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : null;
}

export function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
}
