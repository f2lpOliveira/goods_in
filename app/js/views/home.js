import { navigate, ROUTES } from "../router.js";
import { getInbounds } from "../state/inbounds.js";
import { prepareInboundExport } from "../services/exportService.js";
import { generateCSV } from "../services/csvService.js";
import { toDisplayDate } from "../utils/dateUtils.js";

export function renderHome() {
  const inbounds = getInbounds().filter(
    inbound => inbound.status === "completed"
  );

  const appContent = document.getElementById("app-content");

  appContent.innerHTML = `
  <section class="home-view">

    <header>
      <h2>Goods In</h2>
      <p>Inbound Register</p>
    </header>

    <button id="new-inbound-button">
      New Inbound
    </button>

    <hr />

    <section>
      <h3>Completed Inbounds</h3>

      ${renderInboundList(inbounds)}
    </section>

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
