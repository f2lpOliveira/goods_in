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
