import { parseBarcode } from "../../js/core/barcode/parserFactory.js";
import {
  findByGTIN,
  registerProduct,
} from "../../js/core/catalog/productCatalog.js";
import { createProduct } from "../../js/core/catalog/product.js";

const status = document.getElementById("status");
const gtin = document.getElementById("gtin");
const productCode = document.getElementById("product-code");
const description = document.getElementById("description");
const batch = document.getElementById("batch");
const productionDate = document.getElementById("production-date");
const bestBefore = document.getElementById("best-before");
const rawBarcode = document.getElementById("raw-barcode");

const barcodeInput = document.getElementById("barcode-input");
const parseButton = document.getElementById("parse-button");
const unknownProduct = document.getElementById("unknown-product");
const newProductCode = document.getElementById("new-product-code");
const newProductDescription = document.getElementById(
  "new-product-description"
);
const saveProductButton = document.getElementById("save-product");

parseButton.addEventListener("click", handleParseBarcode);

saveProductButton.addEventListener("click", handleSaveProduct);

function handleParseBarcode() {
  const barcode = barcodeInput.value.trim();

  if (!barcode) {
    status.textContent = "⚠️ Please enter a barcode.";

    return;
  }

  const parsed = parseBarcode(barcode);

  const product = findByGTIN(parsed.gtin);

  if (product) {
    status.textContent = "🟢 Product Found";

    unknownProduct.hidden = true;
  } else {
    status.textContent = "🔴 Unknown Product";

    unknownProduct.hidden = false;
    newProductCode.value = "";

    newProductDescription.value = "";

    newProductCode.focus();
  }

  gtin.textContent = parsed.gtin ?? "—";

  productCode.textContent = product?.productCode ?? "—";

  description.textContent = product?.description ?? "—";

  batch.textContent = parsed.batch ?? "—";

  productionDate.textContent = parsed.productionDate ?? "—";

  bestBefore.textContent = parsed.bestBefore ?? "—";

  rawBarcode.textContent = barcode;
}

function handleSaveProduct() {
  const product = createProduct({
    gtin: gtin.textContent,

    productCode: newProductCode.value.trim(),

    description: newProductDescription.value.trim(),
  });

  registerProduct(product);

  status.textContent = "🟢 Product Found";

  productCode.textContent = product.productCode;

  description.textContent = product.description;

  unknownProduct.hidden = true;
}
