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

export function updateProduct(product) {
  const products = loadProducts();

  const index = products.findIndex(
    existingProduct => existingProduct.gtin === product.gtin
  );

  if (index === -1) {
    return null;
  }

  const updatedProduct = {
    ...products[index],
    ...product,
    updatedAt: new Date().toISOString(),
  };

  products[index] = updatedProduct;

  saveProducts(products);

  return updatedProduct;
}

export function clearCatalog() {
  clearProducts();
}
