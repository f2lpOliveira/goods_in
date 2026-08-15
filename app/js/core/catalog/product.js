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

/**
 * Standard outer shipper carton tier (cases per layer) for products using the 
 * standardized master carton dimensions (identified by XX.XX decimal code format).
 */
const STANDARD_SHIPPER_CASES_PER_LAYER = 16;

/**
 * Resolves the number of cases per pallet layer based on product code specification.
 * 
 * @param {string} productCode - The warehouse SKU/product code.
 * @returns {number} Cases per pallet layer (16 for standard cartons, 0 for irregular).
 */
export function getCasesPerLayer(productCode) {
  if (typeof productCode === "string" && /^\d+\.\d{2}$/.test(productCode.trim())) {
    return STANDARD_SHIPPER_CASES_PER_LAYER;
  }

  return 0;
}
