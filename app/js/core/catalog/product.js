export function createProduct({ gtin, productCode, description = "" }) {
  return {
    gtin,
    productCode,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getCasesPerLayer(productCode) {
  if (/^\d+\.\d{2}$/.test(productCode)) {
    return 16;
  }

  return 0;
}
