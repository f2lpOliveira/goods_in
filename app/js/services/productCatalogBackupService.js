import { getProducts } from "../core/catalog/productCatalog.js";

export function exportProductCatalog() {
  const backup = {
    format: "warehouse-product-catalog",
    version: 1,
    exportedAt: new Date().toISOString(),
    products: getProducts(),
  };

  const json = JSON.stringify(backup, null, 2);

  const blob = new Blob([json], {
    type: "application/json;charset=utf-8;",
  });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download = "product-catalog.json";

  link.click();

  URL.revokeObjectURL(link.href);
}

export async function importProductCatalog(file) {
  const text = await file.text();

  let backup;

  try {
    backup = JSON.parse(text);
  } catch (error) {
    throw new Error("Invalid JSON file.");
  }

  validateBackup(backup);

  return backup.products;
}

function validateBackup(backup) {
  if (!backup || typeof backup !== "object") {
    throw new Error("Invalid catalogue file.");
  }

  if (backup.format !== "warehouse-product-catalog") {
    throw new Error("Invalid catalogue format.");
  }

  if (backup.version !== 1) {
    throw new Error("Unsupported catalogue version.");
  }

  if (!Array.isArray(backup.products)) {
    throw new Error("Invalid products data.");
  }

  const gtins = new Set();

  backup.products.forEach((product, index) => {
    validateProduct(product, index);

    if (gtins.has(product.gtin)) {
      throw new Error(`Duplicate GTIN found: ${product.gtin}`);
    }

    gtins.add(product.gtin);
  });
}

function validateProduct(product, index) {
  if (!product || typeof product !== "object") {
    throw new Error(`Invalid product at position ${index + 1}.`);
  }

  if (typeof product.gtin !== "string" || !product.gtin.trim()) {
    throw new Error(`Product ${index + 1}: GTIN is required.`);
  }

  if (typeof product.productCode !== "string" || !product.productCode.trim()) {
    throw new Error(`Product ${index + 1}: Product Code is required.`);
  }

  if (typeof product.description !== "string" || !product.description.trim()) {
    throw new Error(`Product ${index + 1}: Description is required.`);
  }

  if (
    product.unitsPerBox !== undefined &&
    product.unitsPerBox !== null &&
    (!Number.isInteger(product.unitsPerBox) || product.unitsPerBox <= 0)
  ) {
    throw new Error(
      `Product ${index + 1}: Units per Box must be a positive whole number.`
    );
  }
}
