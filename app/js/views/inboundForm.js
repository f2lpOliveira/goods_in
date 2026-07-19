import { navigate } from "../router.js";
import { createInbound } from "../models/inbound.js";

export function renderInboundForm() {
  render();
  bindEvents();
}

function render() {
  const appContent = document.getElementById("app-content");

  appContent.innerHTML = getInboundFormTemplate();
}

function bindEvents() {
  const form = document.getElementById("inbound-form");
  const cancelButton = document.getElementById("cancel-button");

  form.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(form);
    const values = Object.fromEntries(formData);

    const inbound = createInbound();

    inbound.arrivalDate = values.arrivalDate;
    inbound.inboundReferenceNumber = values.inboundReferenceNumber;

    console.log(inbound);
  });

  cancelButton.addEventListener("click", () => {
    navigate("home");
  });
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
          required>

        <label for="inbound-reference-number">
          Inbound Reference Number
        </label>

        <input
          type="text"
          id="inbound-reference-number"
          name="inboundReferenceNumber"
          required>

        <div class="form-actions">

          <button type="submit">
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
