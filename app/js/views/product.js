import { createInboundItem } from "../models/inboundItem.js";
import { addInbound } from "../state/inbounds.js";
import { clearCurrentInbound } from "../state/currentInbound.js";
import { navigate, ROUTES } from "../router.js";
import {
  getCurrentInbound,
  updateCurrentInbound,
} from "../state/currentInbound.js";
import { parseBarcode } from "../core/barcode/parserFactory.js";
import { findByGTIN, registerProduct } from "../core/catalog/productCatalog.js";
import { createProduct } from "../core/catalog/product.js";
import { getCasesPerLayer } from "../core/catalog/product.js";
import { BARCODE_TYPES } from "../core/barcode/barcodeTypes.js";

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

      <form id="product-form" novalidate>

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
					class="field-locked"
  				tabindex="-1"
					readonly
					required>

				<label for="product-description">
  				Description
				</label>

				<input
				  type="text"
				  id="product-description"
				  name="description"
					class="field-locked"
  				tabindex="-1"
					readonly
					required>

				<label for="mixed-pallet">
          Mixed Pallet
        </label>

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
					class="field-locked"
  				tabindex="-1"
					readonly
					required>

        <label for="bbd">
          BBD
        </label>

        <input
          type="date"
          id="bbd"
          name="bbd"
					class="field-locked"
  				tabindex="-1"
					readonly
				>

				<label for="complete-layers">
  				Complete Layers
				</label>

				<input
				  type="number"
				  id="complete-layers"
				  name="completeLayers"
				  min="0"
				>

				<label for="partial-layer-cases">
				  Partial Layer Cases
				</label>

				<input
				  type="number"
				  id="partial-layer-cases"
				  name="partialLayerCases"
				  min="0"
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
        
        <div class="form-actions">

          <button type="submit">

            Save & New

          </button>

          <button type="button" id="finish-button">

            Finish Inbound

          </button>

        </div>
      </form>

    </section>
  `;
}

function bindEvents() {
  const form = document.getElementById("product-form");

  form.addEventListener("submit", handleSubmit);

  const finishButton = document.getElementById("finish-button");

  finishButton.addEventListener("click", handleFinishInbound);

  const barcodeInput = document.getElementById("barcode-input");

  barcodeInput.addEventListener("input", handleBarcodeInput);

  const completeLayersInput = document.getElementById("complete-layers");

  const partialLayerCasesInput = document.getElementById("partial-layer-cases");

  completeLayersInput.addEventListener("input", calculateQuantity);

  partialLayerCasesInput.addEventListener("input", calculateQuantity);

  const descriptionInput = document.getElementById("product-description");

  descriptionInput.addEventListener("keydown", event => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    document.getElementById("complete-layers").focus();
  });

  completeLayersInput.addEventListener("keydown", event => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    document.getElementById("partial-layer-cases").focus();
  });

  partialLayerCasesInput.addEventListener("keydown", event => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    document.querySelector('#product-form button[type="submit"]').focus();
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

  if (parsed.type === BARCODE_TYPES.UNKNOWN) {
    console.warn("Unsupported barcode:", barcode);
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

  document.getElementById("bbd").value = parsed.bestBefore ?? "";

  document.getElementById("barcode-input").value = parsed.gtin ?? "";

  lockBarcodeFields();

  document.getElementById("complete-layers").focus();
}

function lockBarcodeFields() {
  const barcode = document.getElementById("barcode-input");
  const batch = document.getElementById("batch-code");
  const bbd = document.getElementById("bbd");
  const productCode = document.getElementById("product-code");
  const description = document.getElementById("product-description");

  barcode.readOnly = true;
  batch.readOnly = true;
  bbd.readOnly = true;
  productCode.readOnly = true;
  description.readOnly = true;

  barcode.tabIndex = -1;
  batch.tabIndex = -1;
  bbd.tabIndex = -1;
  productCode.tabIndex = -1;
  description.tabIndex = -1;

  barcode.classList.add("field-locked");
  batch.classList.add("field-locked");
  bbd.classList.add("field-locked");
  productCode.classList.add("field-locked");
  description.classList.add("field-locked");
}

function unlockNewProductFields() {
  const productCode = document.getElementById("product-code");
  const description = document.getElementById("product-description");

  productCode.readOnly = false;
  description.readOnly = false;

  productCode.tabIndex = 0;
  description.tabIndex = 0;

  productCode.classList.remove("field-locked");
  description.classList.remove("field-locked");
}

function prepareNewProduct(parsed) {
  document.getElementById("product-code").value = "";

  document.getElementById("product-description").value = "";

  document.getElementById("batch-code").value = parsed.batch ?? "";

  document.getElementById("bbd").value = parsed.bestBefore ?? "";

  document.getElementById("barcode-input").value = parsed.gtin ?? "";

  lockBarcodeFields();

  unlockNewProductFields();

  document.getElementById("product-code").focus();
}

function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;

  const values = getFormValues(form);

  const validationError = validateProductValues(values);

  if (validationError) {
    alert(validationError.message);

    const field = document.getElementById(validationError.field);

    if (field) {
      field.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setTimeout(() => {
        field.focus();
      }, 100);
    }

    return;
  }

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

function validateProductValues(values) {
  if (!values.gtin) {
    return {
      message: "Barcode is required.",
      field: "barcode-input",
    };
  }

  if (!values.productCode?.trim()) {
    return {
      message: "Product Code is required.",
      field: "product-code",
    };
  }

  if (!values.description?.trim()) {
    return {
      message: "Description is required.",
      field: "product-description",
    };
  }

  if (!values.batchCode?.trim()) {
    return {
      message: "Batch Code is required.",
      field: "batch-code",
    };
  }

  if (!values.bbd) {
    return {
      message: "BBD is required.",
      field: "bbd",
    };
  }

  const completeLayers = Number(values.completeLayers || 0);
  const partialLayerCases = Number(values.partialLayerCases || 0);

  if (completeLayers < 0 || partialLayerCases < 0) {
    return {
      message: "Layer quantities cannot be negative.",
      field: "complete-layers",
    };
  }

  if (completeLayers === 0 && partialLayerCases === 0) {
    return {
      message: "At least one layer or partial-layer case is required.",
      field: "complete-layers",
    };
  }

  return null;
}
