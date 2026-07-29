import { parseBarcode } from "../../js/core/barcode/parserFactory.js";
import { findByGTIN } from "../../js/core/catalog/productCatalog.js";

const status = document.getElementById("status");
const gtin = document.getElementById("gtin");
const productCode = document.getElementById("product-code");
const batch = document.getElementById("batch");
const productionDate = document.getElementById("production-date");
const bestBefore = document.getElementById("best-before");
const rawBarcode = document.getElementById("raw-barcode");

const barcodeInput = document.getElementById("barcode-input");
const parseButton = document.getElementById("parse-button");

parseButton.addEventListener("click", handleParseBarcode);

function handleParseBarcode() {
  const barcode = barcodeInput.value.trim();

  if (!barcode) {
    status.textContent = "⚠️ Please enter a barcode.";

    return;
  }

  const parsed = parseBarcode(barcode);

  const product = findByGTIN(parsed.gtin);

  status.textContent = product ? "🟢 Product Found" : "🔴 Unknown Product";

  gtin.textContent = parsed.gtin ?? "—";

  productCode.textContent = product?.productCode ?? "—";

  batch.textContent = parsed.batch ?? "—";

  productionDate.textContent = parsed.productionDate ?? "—";

  bestBefore.textContent = parsed.bestBefore ?? "—";

  rawBarcode.textContent = barcode;
}
