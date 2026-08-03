import { navigate, ROUTES } from "../router.js";
import { createInbound } from "../models/inbound.js";
import {
  getCurrentInbound,
  setCurrentInbound,
  updateCurrentInbound,
  clearCurrentInbound,
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

  <div class="form-field">

    <label for="arrival-date">
      Arrival Date
    </label>

    <input
      type="date"
      id="arrival-date"
      name="arrivalDate"
      required
    >

  </div>

  <div class="form-field">

    <label for="inbound-reference-number">
      Inbound Reference Number
    </label>

    <input
      type="text"
      id="inbound-reference-number"
      name="inboundReferenceNumber"
      autocomplete="off"
      required
    >

  </div>

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
    handleCreateButton(form);
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
  const confirmed = confirm(
    "Cancel this inbound?\n\nAll progress will be permanently lost."
  );

  if (!confirmed) {
    return;
  }

  clearCurrentInbound();

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

function handleCreateButton(form) {
  if (hasInboundInProgress()) {
    navigate(ROUTES.PRODUCT);
    return;
  }

  handleCreateInbound(form);
}

function hasInboundInProgress() {
  return getCurrentInbound() !== null;
}
