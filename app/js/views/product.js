import { createInboundItem } from "../models/inboundItem.js";
import { addInbound } from "../state/inbounds.js";
import { clearCurrentInbound } from "../state/currentInbound.js";
import { navigate, ROUTES } from "../router.js";
import { attachAutocomplete } from "../components/autocomplete.js";
import {
  getCurrentInbound,
  updateCurrentInbound,
} from "../state/currentInbound.js";

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

        <label for="product-code">
          Product Code
        </label>

        <input
          type="text"
          id="product-code"
          name="productCode">

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
          name="batchCode">

        <label for="bbd">
          BBD
        </label>

        <input
          type="date"
          id="bbd"
          name="bbd"
					value="${inbound.lastBBD}">

        <label for="quantity">
          Quantity
        </label>

        <input
          type="number"
          id="quantity"
          name="quantity"
          min="0">

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

  attachAutocomplete({
    input: document.getElementById("product-code"),
    suggestions: getUniqueValues("productCode"),
  });

  attachAutocomplete({
    input: document.getElementById("batch-code"),
    suggestions: getUniqueValues("batchCode"),
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;

  const values = getFormValues(form);

  saveProduct(values);

  refreshForm();
}

function getFormValues(form) {
  const formData = new FormData(form);

  return Object.fromEntries(formData);
}

function saveProduct(values) {
  const inbound = getCurrentInbound();

  const item = createInboundItem(values, inbound.nextSequence);

  inbound.lastBBD = values.bbd;

  inbound.items.push(item);

  inbound.nextSequence += 1;

  inbound.updatedAt = new Date().toISOString();

  updateCurrentInbound(inbound);
}

function refreshForm() {
  render();

  bindEvents();

  document.getElementById("product-code").focus();
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
