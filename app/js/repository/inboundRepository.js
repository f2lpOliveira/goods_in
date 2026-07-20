import { save, load } from "../storage.js";

const STORAGE_KEY = "warehouse-inbounds";

export function saveInbounds(inbounds) {
  save(STORAGE_KEY, inbounds);
}

export function loadInbounds() {
  return load(STORAGE_KEY) ?? [];
}
