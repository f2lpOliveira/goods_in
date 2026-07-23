import { getCurrentInbound } from "../state/currentInbound.js";
import { createInboundItem } from "../models/inboundItem.js";
import { addInbound } from "../state/inbounds.js";
import { clearCurrentInbound } from "../state/currentInbound.js";
import { navigate } from "../router.js";
import { attachAutocomplete } from "../components/autocomplete.js";

export function renderProductForm() {
  render();
  bindEvents();
}

function render() {
  const appContent = document.getElementById("app-content");

  appContent.innerHTML = getProductTemplate();
}

function bindEvents() {
  const form = document.getElementById("product-form");

  form.addEventListener("submit", handleSubmit);

  const finishButton = document.getElementById("finish-button");

  finishButton.addEventListener("click", handleFinishInbound);

  attachAutocomplete({
    input: document.getElementById("product-code"),
    suggestions: getProductSuggestions(),
  });

  attachAutocomplete({
    input: document.getElementById("batch-code"),
    suggestions: getBatchSuggestions(),
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;

  const formData = new FormData(form);

  const values = Object.fromEntries(formData);

  const inbound = getCurrentInbound();

  const item = createInboundItem();

  item.productCode = values.productCode;
  item.mixedPallet = values.mixedPallet === "true";
  item.batchCode = values.batchCode;
  item.bbd = values.bbd;
  inbound.lastBBD = values.bbd;
  item.quantity = Number(values.quantity);

  item.sequence = inbound.nextSequence;

  inbound.items.push(item);

  inbound.nextSequence += 1;

  inbound.updatedAt = new Date().toISOString();

  render();

  bindEvents();

  document.getElementById("product-code").focus();
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

  navigate("home");
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

        <button
          type="button"
          id="photo-button">

          Add Photo

        </button>

        <div class="form-actions">

          <button type="submit">

            Save & New

          </button>

          <button
            type="button"
            id="finish-button">

            Finish Inbound

          </button>

        </div>
				<datalist id="product-code-list">
  				${getProductCodeOptions()}
				</datalist>

				<datalist id="batch-code-list">
  				${getBatchCodeOptions()}
				</datalist>

      </form>

    </section>
  `;
}

function getProductCodeOptions() {
  const inbound = getCurrentInbound();

  const codes = [...new Set(inbound.items.map(item => item.productCode))];

  return codes.map(code => `<option value="${code}">`).join("");
}

function getBatchCodeOptions() {
  const inbound = getCurrentInbound();

  const batches = [...new Set(inbound.items.map(item => item.batchCode))];

  return batches.map(batch => `<option value="${batch}">`).join("");
}

function getProductSuggestions() {
  const inbound = getCurrentInbound();

  return [...new Set(inbound.items.map(item => item.productCode))];
}

function getBatchSuggestions() {
  const inbound = getCurrentInbound();

  return [...new Set(inbound.items.map(item => item.batchCode))];
}
