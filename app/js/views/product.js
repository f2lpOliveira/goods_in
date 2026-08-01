import { createInboundItem } from "../models/inboundItem.js";
import { addInbound } from "../state/inbounds.js";
import { clearCurrentInbound } from "../state/currentInbound.js";
import { navigate, ROUTES } from "../router.js";
import { attachAutocomplete } from "../components/autocomplete.js";
import {
  getCurrentInbound,
  updateCurrentInbound,
} from "../state/currentInbound.js";
import { parseBarcode } from "../core/barcode/parserFactory.js";
import { findByGTIN, registerProduct } from "../core/catalog/productCatalog.js";
import { createProduct } from "../core/catalog/product.js";
import { getCasesPerLayer } from "../core/catalog/product.js";

let barcodeTimer = null;

export function renderProductForm() {
  render();
  bindEvents();
}

function render() {
  const appContent = document.getElementById("app-content");

  appContent.innerHTML = getProductTemplate();
}

function getProductTemplate() {
  const inbound = getCurrentInbound();

  return `
    <section class="product-view">

      <h2>New Product</h2>

      <div class="inbound-summary">

        <p>
          <strong>Inbound Reference:</strong>
          ${inbound.inboundReferenceNumber}
        </p>

        <p>
          <strong>Arrival Date:</strong>
          ${inbound.arrivalDate}
        </p>

        <p>
          <strong>Next Sequence:</strong>
          #${inbound.nextSequence}
        </p>

      </div>

      <form id="product-form">

			<label for="barcode-input">
  				Barcode
			</label>

				<input
				  type="text"
				  id="barcode-input"
				  name="barcode"
				  autocomplete="off"
				  inputmode="none"
				  autofocus
				>

        <label for="product-code">
          Product Code
        </label>

        <input
          type="text"
          id="product-code"
          name="productCode"
					required>

				<label for="product-description">
  				Description
				</label>

				<input
				  type="text"
				  id="product-description"
				  name="description">

				<label for="mixed-pallet">
          Mixed Pallet
        </label>

				<label for="production-date">
  				Production Date
				</label>

				<input
				  type="date"
				  id="production-date"
				  name="productionDate">

        <select
          id="mixed-pallet"
          name="mixedPallet">

          <option value="false" selected>No</option>
          <option value="true">Yes</option>

        </select>

        <label for="batch-code">
          Batch Code
        </label>

        <input
          type="text"
          id="batch-code"
          name="batchCode"
					required>

        <label for="bbd">
          BBD
        </label>

        <input
          type="date"
          id="bbd"
          name="bbd"
					value="${inbound.lastBBD ?? ""}"

				<label for="complete-layers">
  				Complete Layers
				</label>

				<input
				  type="number"
				  id="complete-layers"
				  name="completeLayers"
				  min="0"
				  value="0"
				  required
				>

				<label for="partial-layer-cases">
				  Partial Layer Cases
				</label>

				<input
				  type="number"
				  id="partial-layer-cases"
				  name="partialLayerCases"
				  min="0"
				  value="0"
				  required
				>

        <label for="quantity">
          Quantity
        </label>

        <input
          type="number"
          id="quantity"
          name="quantity"
					readonly
          min="1"
					required>

        <button type="button" id="photo-button">

          Add Photo

        </button>

        <div class="form-actions">

          <button type="submit">

            Save & New

          </button>

					<button type="button" id="back-button">

    				Back

					</button>

          <button type="button" id="finish-button">

            Finish Inbound

          </button>

        </div>
				<datalist id="product-code-list">
  				${renderOptions(getUniqueValues("productCode"))}
				</datalist>

				<datalist id="batch-code-list">
  				${renderOptions(getUniqueValues("batchCode"))}
				</datalist>

      </form>

    </section>
  `;
}

function bindEvents() {
  const form = document.getElementById("product-form");

  form.addEventListener("submit", handleSubmit);

  const backButton = document.getElementById("back-button");

  const finishButton = document.getElementById("finish-button");

  backButton.addEventListener("click", handleBack);

  finishButton.addEventListener("click", handleFinishInbound);

  const barcodeInput = document.getElementById("barcode-input");

  barcodeInput.addEventListener("input", handleBarcodeInput);

  const completeLayersInput = document.getElementById("complete-layers");

  const partialLayerCasesInput = document.getElementById("partial-layer-cases");

  completeLayersInput.addEventListener("input", calculateQuantity);

  partialLayerCasesInput.addEventListener("input", calculateQuantity);

  attachAutocomplete({
    input: document.getElementById("product-code"),
    suggestions: getUniqueValues("productCode"),
  });

  attachAutocomplete({
    input: document.getElementById("batch-code"),
    suggestions: getUniqueValues("batchCode"),
  });
}

function calculateQuantity() {
  const productCode = document.getElementById("product-code").value.trim();

  const casesPerLayer = getCasesPerLayer(productCode);

  const completeLayers = Number(
    document.getElementById("complete-layers").value || 0
  );

  const partialLayerCases = Number(
    document.getElementById("partial-layer-cases").value || 0
  );

  const quantity = completeLayers * casesPerLayer + partialLayerCases;

  document.getElementById("quantity").value = quantity;
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

function processBarcode(barcode) {
  let parsed;

  try {
    parsed = parseBarcode(barcode);
  } catch (error) {
    console.error("Barcode parsing failed:", error);
    return;
  }

  const product = findByGTIN(parsed.gtin);

  if (product) {
    fillKnownProduct(parsed, product);
    return;
  }

  prepareNewProduct(parsed);
}

function fillKnownProduct(parsed, product) {
  document.getElementById("product-code").value = product.productCode ?? "";

  document.getElementById("product-description").value =
    product.description ?? "";

  document.getElementById("batch-code").value = parsed.batch ?? "";

  document.getElementById("production-date").value =
    parsed.productionDate ?? "";

  document.getElementById("bbd").value = parsed.bestBefore ?? "";

  document.getElementById("barcode-input").value = parsed.gtin ?? "";

  lockBarcodeFields();

  document.getElementById("quantity").focus();
}

function lockBarcodeFields() {
  document.getElementById("barcode-input").readOnly = true;

  document.getElementById("batch-code").readOnly = true;

  document.getElementById("bbd").readOnly = true;

  document.getElementById("production-date").readOnly = true;

  document.getElementById("product-code").readOnly = true;

  document.getElementById("product-description").readOnly = true;
}

function unlockNewProductFields() {
  document.getElementById("product-code").readOnly = false;

  document.getElementById("product-description").readOnly = false;
}

function prepareNewProduct(parsed) {
  document.getElementById("product-code").value = "";

  document.getElementById("product-description").value = "";

  document.getElementById("batch-code").value = parsed.batch ?? "";

  document.getElementById("production-date").value =
    parsed.productionDate ?? "";

  document.getElementById("bbd").value = parsed.bestBefore ?? "";

  document.getElementById("barcode-input").value = parsed.gtin ?? "";

  lockBarcodeFields();

  unlockNewProductFields();

  document.getElementById("product-code").focus();
}

function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const values = getFormValues(form);

  saveProduct(values);

  refreshForm();
}

function getFormValues(form) {
  const formData = new FormData(form);

  const values = Object.fromEntries(formData);

  values.gtin = document.getElementById("barcode-input").value.trim();

  return values;
}

function saveProduct(values) {
  const inbound = getCurrentInbound();

  const existingProduct = values.gtin ? findByGTIN(values.gtin) : null;

  if (existingProduct) {
    values.productCode = existingProduct.productCode;
    values.description = existingProduct.description;
  }

  if (!existingProduct && values.gtin && values.productCode) {
    const product = createProduct({
      gtin: values.gtin,
      productCode: values.productCode,
      description: values.description ?? "",
    });

    registerProduct(product);
  }

  const item = createInboundItem(values, inbound.nextSequence);

  inbound.lastBBD = values.bbd || "";

  inbound.items.push(item);

  inbound.nextSequence += 1;

  inbound.updatedAt = new Date().toISOString();

  updateCurrentInbound(inbound);
}

function refreshForm() {
  render();

  bindEvents();

  document.getElementById("barcode-input").focus();
}

function handleBack() {
  navigate(ROUTES.INBOUND_FORM);
}

function handleFinishInbound() {
  const confirmed = confirm(
    "Finish this inbound?\n\nYou won't be able to add more products."
  );

  if (!confirmed) {
    return;
  }

  const inbound = getCurrentInbound();

  addInbound(inbound);

  clearCurrentInbound();

  navigate(ROUTES.HOME);
}

function getUniqueValues(field) {
  const inbound = getCurrentInbound();

  return [...new Set(inbound.items.map(item => item[field]))];
}

function renderOptions(values) {
  return values.map(value => `<option value="${value}">`).join("");
}
