export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function load(key) {
  const data = localStorage.getItem(key);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
}

export function remove(key) {
  localStorage.removeItem(key);
}

export function clear() {
  localStorage.clear();
}
