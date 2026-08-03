import {
  loadProducts,
  saveProducts,
  clearProducts,
} from "./productRepository.js";

export function getProducts() {
  return loadProducts();
}

export function findByGTIN(gtin) {
  const products = loadProducts();

  return products.find(product => product.gtin === gtin) || null;
}

export function saveProduct(product) {
  const products = loadProducts();

  products.push(product);

  saveProducts(products);
}

export function registerProduct(product) {
  const products = loadProducts();

  products.push(product);

  saveProducts(products);

  return product;
}

export function clearCatalog() {
  clearProducts();
}
