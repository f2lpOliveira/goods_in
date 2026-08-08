export function createProduct({ gtin, productCode, description, unitsPerBox }) {
  return {
    gtin,
    productCode,
    description,
    unitsPerBox: Number(unitsPerBox),
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
