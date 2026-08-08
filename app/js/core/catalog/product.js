export function createProduct({
  gtin,
  productCode,
  description,
  unitsPerBox = null,
}) {
  return {
    gtin,
    productCode,
    description,
    unitsPerBox: unitsPerBox === null ? null : Number(unitsPerBox),
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
