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

export function registerProduct(product) {
  const products = loadProducts();

  const existingProduct = products.find(
    existing => existing.gtin === product.gtin
  );

  if (existingProduct) {
    return {
      created: false,
      product: existingProduct,
    };
  }

  products.push(product);

  saveProducts(products);

  return {
    created: true,
    product,
  };
}

export function clearCatalog() {
  clearProducts();
}
