const STORAGE_KEY = "products";

export function loadProducts() {
  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}

export function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function clearProducts() {
  localStorage.removeItem(STORAGE_KEY);
}
