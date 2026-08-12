import { navigate, ROUTES } from "../router.js";
import { parseBarcode } from "../core/barcode/parserFactory.js";
import { findByGTIN, registerProduct } from "../core/catalog/productCatalog.js";
import { createProduct } from "../core/catalog/product.js";
import { BARCODE_TYPES } from "../core/barcode/barcodeTypes.js";

let barcodeTimer = null;

export function renderProductRegistration() {
  const appContent = document.getElementById("app-content");

  appContent.innerHTML = `
    <section class="product-registration-view">

      <header>
        <h2>Product Registration</h2>
        <p>Register a product in the product catalogue.</p>
      </header>

      <form id="product-registration-form">

        <label for="registration-barcode">
          Barcode
        </label>

        <input
          type="text"
          id="registration-barcode"
          name="barcode"
          autocomplete="off"
          inputmode="none"
          autofocus
          required
        >

        <label for="registration-product-code">
  				Product Code
				</label>

				<input
				  type="text"
				  id="registration-product-code"
				  name="productCode"
				  required
				>

				<label for="registration-description">
				  Description
				</label>

				<input
				  type="text"
				  id="registration-description"
				  name="description"
				  required
				>

				<label for="registration-units-per-box">
				  Units per Box
				</label>

				<input
				  type="number"
				  id="registration-units-per-box"
				  name="unitsPerBox"
				  min="1"
				  step="1"
				  required
				>

        <div class="form-actions">

          <button type="submit">
            Save
          </button>

          <button
            type="button"
            id="registration-back-button">
            Back
          </button>

        </div>

      </form>

    </section>
  `;

  lockProductFields();
  bindEvents();
}

function lockProductFields() {
  const productCode = document.getElementById("registration-product-code");
  const description = document.getElementById("registration-description");
  const unitsPerBox = document.getElementById("registration-units-per-box");

  productCode.readOnly = true;
  description.readOnly = true;
  unitsPerBox.readOnly = true;

  productCode.tabIndex = -1;
  description.tabIndex = -1;
  unitsPerBox.tabIndex = -1;

  productCode.classList.add("field-locked");
  description.classList.add("field-locked");
  unitsPerBox.classList.add("field-locked");
}

function unlockProductFields() {
  const productCode = document.getElementById("registration-product-code");
  const description = document.getElementById("registration-description");
  const unitsPerBox = document.getElementById("registration-units-per-box");

  productCode.readOnly = false;
  description.readOnly = false;
  unitsPerBox.readOnly = false;

  productCode.tabIndex = 0;
  description.tabIndex = 0;
  unitsPerBox.tabIndex = 0;

  productCode.classList.remove("field-locked");
  description.classList.remove("field-locked");
  unitsPerBox.classList.remove("field-locked");
}

function bindEvents() {
  const form = document.getElementById("product-registration-form");

  form.addEventListener("submit", handleSubmit);

  const barcodeInput = document.getElementById("registration-barcode");

  barcodeInput.addEventListener("input", handleBarcodeInput);

  const backButton = document.getElementById("registration-back-button");

  backButton.addEventListener("click", () => {
    navigate(ROUTES.CATALOG);
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const barcode = document.getElementById("registration-barcode").value.trim();

  const productCode = document
    .getElementById("registration-product-code")
    .value.trim();

  const description = document
    .getElementById("registration-description")
    .value.trim();

  const unitsPerBox = Number(
    document.getElementById("registration-units-per-box").value
  );

  if (!barcode) {
    alert("Barcode is required.");
    return;
  }

  if (!productCode) {
    alert("Product Code is required.");
    return;
  }

  if (!description) {
    alert("Description is required.");
    return;
  }

  if (!Number.isInteger(unitsPerBox) || unitsPerBox <= 0) {
    alert("Units per Box must be a positive whole number.");
    return;
  }

  const product = createProduct({
    gtin: barcode,
    productCode,
    description,
    unitsPerBox,
  });

  registerProduct(product);

  alert("Product registered successfully.");

  event.target.reset();

  lockProductFields();

  const barcodeInput = document.getElementById("registration-barcode");

  barcodeInput.readOnly = false;
  barcodeInput.tabIndex = 0;
  barcodeInput.classList.remove("field-locked");

  showSaveButton();

  barcodeInput.focus();
}

function fillExistingProduct(product) {
  document.getElementById("registration-product-code").value =
    product.productCode ?? "";

  document.getElementById("registration-description").value =
    product.description ?? "";

  document.getElementById("registration-units-per-box").value =
    product.unitsPerBox ?? "";

  const barcodeInput = document.getElementById("registration-barcode");

  barcodeInput.value = product.gtin;

  barcodeInput.readOnly = true;
  barcodeInput.tabIndex = -1;

  barcodeInput.classList.add("field-locked");

  lockProductFields();
  hideSaveButton();
}

function prepareNewProduct(parsed) {
  const barcodeInput = document.getElementById("registration-barcode");

  barcodeInput.value = parsed.gtin;

  barcodeInput.readOnly = true;
  barcodeInput.tabIndex = -1;
  barcodeInput.classList.add("field-locked");

  document.getElementById("registration-product-code").value = "";

  document.getElementById("registration-description").value = "";

  document.getElementById("registration-units-per-box").value = "";

  unlockProductFields();
  showSaveButton();

  document.getElementById("registration-product-code").focus();
}

function processBarcode(barcode) {
  if (!barcode) {
    alert("Barcode is required.");
    return;
  }

  let parsed;

  try {
    parsed = parseBarcode(barcode);
  } catch (error) {
    console.error("Barcode parsing failed:", error);
    alert("Unable to read barcode.");
    return;
  }

  if (parsed.type === BARCODE_TYPES.UNKNOWN) {
    alert("Unsupported barcode.");
    return;
  }

  const existingProduct = findByGTIN(parsed.gtin);

  if (existingProduct) {
    fillExistingProduct(existingProduct);
    return;
  }

  prepareNewProduct(parsed);
}

function hideSaveButton() {
  const saveButton = document.querySelector(
    '#product-registration-form button[type="submit"]'
  );

  if (saveButton) {
    saveButton.style.display = "none";
  }
}

function showSaveButton() {
  const saveButton = document.querySelector(
    '#product-registration-form button[type="submit"]'
  );

  if (saveButton) {
    saveButton.style.display = "";
  }
}

function handleBarcodeInput(event) {
  const barcode = event.target.value.trim();

  if (!barcode) {
    return;
  }

  clearTimeout(barcodeTimer);

  barcodeTimer = setTimeout(() => {
    processBarcode(barcode);
  }, 100);
}
