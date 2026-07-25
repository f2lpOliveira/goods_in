import { navigate, ROUTES } from "../router.js";
import { getInbounds } from "../state/inbounds.js";
import { prepareInboundExport } from "../services/exportService.js";
import { generateCSV } from "../services/csvService.js";
import { toDisplayDate } from "../utils/dateUtils.js";

export function renderHome() {
  const inbounds = getInbounds();

  const appContent = document.getElementById("app-content");

  appContent.innerHTML = `
    <section class="home-view">

      <button id="new-inbound-button">
        New Inbound
      </button>

      ${renderInboundList(inbounds)}

    </section>
  `;

  bindExportButtons(inbounds);
  bindNewInboundButton();
}

function renderInboundList(inbounds) {
  if (inbounds.length === 0) {
    return "<p>No inbounds yet.</p>";
  }

  return inbounds.map(renderInboundCard).join("");
}

function renderInboundCard(inbound) {
  return `
    <div class="inbound-card">

      <h3>
        ${inbound.inboundReferenceNumber}
      </h3>

      <p>
        ${inbound.items.length} products
      </p>

      <p>
        ${toDisplayDate(inbound.arrivalDate)}
      </p>

      <button
        class="export-button"
        data-inbound-id="${inbound.inboundReferenceNumber}">

        Export

      </button>

    </div>
  `;
}

function bindExportButtons(inbounds) {
  const exportButtons = document.querySelectorAll(".export-button");

  exportButtons.forEach(button => {
    button.addEventListener("click", () => {
      const inboundId = button.dataset.inboundId;

      const inbound = inbounds.find(
        inbound => inbound.inboundReferenceNumber === inboundId
      );

      const data = prepareInboundExport(inbound);

      generateCSV(data, `Inbound_${inbound.inboundReferenceNumber}.csv`);
    });
  });
}

function bindNewInboundButton() {
  const newInboundButton = document.getElementById("new-inbound-button");

  newInboundButton.addEventListener("click", () => {
    navigate(ROUTES.INBOUND_FORM);
  });
}
