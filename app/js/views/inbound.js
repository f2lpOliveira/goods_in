import { navigate, ROUTES } from "../router.js";
import { createInbound } from "../models/inbound.js";
import {
  getCurrentInbound,
  setCurrentInbound,
  updateCurrentInbound,
} from "../state/currentInbound.js";

export function renderInboundForm() {
  render();
  bindEvents();
}

function render() {
  const appContent = document.getElementById("app-content");

  appContent.innerHTML = getInboundFormTemplate();
  restoreCurrentInbound();
}

function getInboundFormTemplate() {
  return `
    <section class="inbound-form-view">

      <h2>New Inbound</h2>

      <form id="inbound-form">

        <label for="arrival-date">
          Arrival Date
        </label>

        <input
          type="date"
          id="arrival-date"
          name="arrivalDate"
        >

        <label for="inbound-reference-number">
          Inbound Reference Number
        </label>

        <input
          type="text"
          id="inbound-reference-number"
          name="inboundReferenceNumber"
        >

        <div class="form-actions">

          <button
  type="button"
  id="create-inbound-button">
  Create Inbound
</button>

          <button
            type="button"
            id="cancel-button">

            Cancel

          </button>

        </div>

      </form>

    </section>
  `;
}

function bindEvents() {
  const form = document.getElementById("inbound-form");

  const createButton = document.getElementById("create-inbound-button");
  const cancelButton = document.getElementById("cancel-button");

  createButton.addEventListener("click", () => {
    handleCreateInbound(form);
  });

  cancelButton.addEventListener("click", handleCancel);
}

function handleCreateInbound(form) {
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const values = Object.fromEntries(formData);

  const currentInbound = getCurrentInbound();

  if (currentInbound) {
    currentInbound.arrivalDate = values.arrivalDate;
    currentInbound.inboundReferenceNumber = values.inboundReferenceNumber;

    updateCurrentInbound(currentInbound);
  } else {
    const inbound = createInbound(values);

    setCurrentInbound(inbound);
  }

  navigate(ROUTES.PRODUCT);
}

function handleCancel() {
  navigate(ROUTES.HOME);
}

function restoreCurrentInbound() {
  const currentInbound = getCurrentInbound();

  if (!currentInbound) {
    return;
  }

  document.getElementById("arrival-date").value = currentInbound.arrivalDate;

  document.getElementById("inbound-reference-number").value =
    currentInbound.inboundReferenceNumber;
}
