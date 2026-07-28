export function createProduct({ gtin, productCode, description = "" }) {
  return {
    gtin,
    productCode,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
