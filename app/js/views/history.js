import { getInbounds } from "../state/inbounds.js";
import { prepareInboundExport } from "../services/exportService.js";
import { generateCSV } from "../services/csvService.js";
import { toDisplayDate } from "../utils/dateUtils.js";

export function renderHistory() {
  const inbounds = getInbounds().filter(
    inbound => inbound.status === "history"
  );

  const appContent = document.getElementById("app-content");

  appContent.innerHTML = `
    <section class="history-view">

      <header>
        <h2>Inbound History</h2>
        <p>Archived inbound records</p>
      </header>

      ${renderHistoryList(inbounds)}

    </section>
  `;

  bindExportButtons(inbounds);
}

function renderHistoryList(inbounds) {
  if (inbounds.length === 0) {
    return "<p>No inbound history yet.</p>";
  }

  return inbounds.map(renderHistoryCard).join("");
}

function renderHistoryCard(inbound) {
  return `
    <article class="inbound-card">

      <header>
        <h4>
          ${inbound.inboundReferenceNumber}
        </h4>
      </header>

      <p>
        <strong>Products:</strong>
        ${inbound.items.length}
      </p>

      <p>
        <strong>Arrival:</strong>
        ${toDisplayDate(inbound.arrivalDate)}
      </p>

      <footer>
        <button
          type="button"
          class="export-button"
          data-inbound-id="${inbound.id}">
          Export
        </button>
      </footer>

    </article>
  `;
}

function bindExportButtons(inbounds) {
  const exportButtons = document.querySelectorAll(".export-button");

  exportButtons.forEach(button => {
    button.addEventListener("click", () => {
      const inboundId = button.dataset.inboundId;

      const inbound = inbounds.find(inbound => inbound.id === inboundId);

      if (!inbound) {
        console.error(`Inbound not found: ${inboundId}`);
        return;
      }

      const data = prepareInboundExport(inbound);

      generateCSV(data, `Inbound_${inbound.inboundReferenceNumber}.csv`);
    });
  });
}
