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

export function upsertProducts(incomingProducts) {
  const currentProducts = loadProducts();
  const productMap = new Map(currentProducts.map(product => [product.gtin, product]));

  let createdCount = 0;
  let updatedCount = 0;
  const now = new Date().toISOString();

  for (const incoming of incomingProducts) {
    if (productMap.has(incoming.gtin)) {
      const existing = productMap.get(incoming.gtin);
      productMap.set(incoming.gtin, {
        ...existing,
        ...incoming,
        updatedAt: now,
      });
      updatedCount++;
    } else {
      productMap.set(incoming.gtin, {
        ...incoming,
        createdAt: incoming.createdAt || now,
        updatedAt: now,
      });
      createdCount++;
    }
  }

  const merged = Array.from(productMap.values());
  saveProducts(merged);

  return {
    total: merged.length,
    createdCount,
    updatedCount,
  };
}

export function clearCatalog() {
  clearProducts();
}
