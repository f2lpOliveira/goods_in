import { parseBarcode } from "../../js/core/barcode/parserFactory.js";
import { findByGTIN } from "../../js/core/catalog/productCatalog.js";

const barcodeInput = document.getElementById("barcode-input");

const parseButton = document.getElementById("parse-button");

const result = document.getElementById("result");

parseButton.addEventListener("click", handleParseBarcode);

function handleParseBarcode() {
  const barcode = barcodeInput.value.trim();

  if (!barcode) {
    result.textContent = "Please enter a barcode.";

    return;
  }

  const parsed = parseBarcode(barcode);

  const product = findByGTIN(parsed.gtin);

  const output = {
    ...parsed,

    productCode: product?.productCode ?? null,

    catalogStatus: product ? "FOUND" : "NOT FOUND",
  };

  result.textContent = JSON.stringify(output, null, 2);
}
