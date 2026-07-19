import { navigate } from "../router.js";
import { createInboundRecord } from "../inboundRecord.js";
import { addRecord } from "../repository.js";

export function renderRecordForm() {
  render();
  bindEvents();
}

function render() {
  const appContent = document.getElementById("app-content");

  appContent.innerHTML = getRecordFormTemplate();
}

function bindEvents() {
  bindCancelButton();
  bindSaveButton();
}

function bindCancelButton() {
  const cancelButton = document.getElementById("cancel-button");

  cancelButton.addEventListener("click", () => {
    navigate("home");
  });
}

function bindSaveButton() {
  const form = document.getElementById("record-form");

  form.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(form);
    const values = Object.fromEntries(formData);

    const record = createInboundRecord();

    record.arrivalDate = values.arrivalDate;

    record.inboundReferenceNumber = values.inboundReferenceNumber;

    record.productCode = values.productCode;

    record.batchCode = values.batchCode;

    record.bbd = values.bbd;

    record.quantity = Number(values.quantity);

    record.sequence = Number(values.sequence);

    record.mixedPallet = values.mixedPallet === "true";

    addRecord(record);

    console.log("Record saved:", record);
  });
}

function getRecordFormTemplate() {
  return `
    <section class="record-form-view">

      <h2>New Record</h2>

      <form id="record-form">

        <label for="arrival-date">
          Arrival Date
        </label>

        <input
          type="date"
          id="arrival-date"
          name="arrivalDate">

        <label for="inbound-reference-number">
          Inbound Reference Number
        </label>

        <input
          type="text"
          id="inbound-reference-number"
          name="inboundReferenceNumber">

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
          name="bbd">

        <label for="quantity">
          Quantity
        </label>

        <input
          type="number"
          id="quantity"
          name="quantity"
          min="0">

        <label for="sequence">
          Sequence
        </label>

        <input
          type="number"
          id="sequence"
          name="sequence"
          min="1">

        <button
          id="photo-button"
          type="button">

          Add Photo

        </button>

        <div class="form-actions">

          <button type="submit">
            Save
          </button>

          <button
            id="cancel-button"
            type="button">

            Cancel

          </button>

        </div>

      </form>

    </section>
  `;
}
