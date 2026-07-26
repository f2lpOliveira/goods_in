import { navigate, ROUTES } from "../router.js";
import { createInbound } from "../models/inbound.js";
import { setCurrentInbound } from "../state/currentInbound.js";
import {
  saveDraft,
  loadDraft,
  clearDraft,
} from "../repository/inboundDraftRepository.js";

export function renderInboundForm() {
  render();
  bindEvents();
}

function render() {
  const appContent = document.getElementById("app-content");

  appContent.innerHTML = getInboundFormTemplate();
  restoreDraft();
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
  form.addEventListener("input", saveCurrentDraft);

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

  const inbound = createInbound(values);

  setCurrentInbound(inbound);
  clearDraft();

  navigate(ROUTES.PRODUCT);
}

function handleCancel() {
  navigate(ROUTES.HOME);
  clearDraft();
}

function restoreDraft() {
  const draft = loadDraft();

  if (!draft) {
    return;
  }

  document.getElementById("arrival-date").value = draft.arrivalDate ?? "";

  document.getElementById("inbound-reference-number").value =
    draft.inboundReferenceNumber ?? "";
}

function saveCurrentDraft() {
  saveDraft({
    arrivalDate: document.getElementById("arrival-date").value,

    inboundReferenceNumber: document.getElementById("inbound-reference-number")
      .value,
  });
}
