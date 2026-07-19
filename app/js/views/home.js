import { navigate } from "../router.js";
import { getInbounds } from "../state/inbounds.js";
import { prepareInboundExport } from "../services/exportService.js";

export function renderHome() {
  const inbounds = getInbounds();
  const content =
    inbounds.length === 0
      ? `
      <p>No inbounds yet.</p>
    `
      : `
      ${inbounds
        .map(
          inbound => `
       <div class="inbound-card">

  			<h3>
    			${inbound.inboundReferenceNumber}
  			</h3>

  			<p>
    			${inbound.items.length} products
  			</p>

				<p>
  				${formatDate(inbound.arrivalDate)}
				</p>

  			<button
  				class="export-button"
  				data-inbound-id="${inbound.inboundReferenceNumber}">

  					Export

				</button>

			</div>
      `
        )
        .join("")}
    `;

  const appContent = document.getElementById("app-content");

  appContent.innerHTML = `
        <section class="home-view">

            <button id="new-inbound-button">
  							New Inbound
						</button>

            ${content}

            <div class="actions">

                <button>Export</button>

                <button>Settings</button>

            </div>

        </section>
    `;

  const exportButtons = document.querySelectorAll(".export-button");

  exportButtons.forEach(button => {
    button.addEventListener("click", () => {
      const inboundId = button.dataset.inboundId;

      const inbound = inbounds.find(
        inbound => inbound.inboundReferenceNumber === inboundId
      );

      console.log(prepareInboundExport(inbound));
    });
  });

  const newInboundButton = document.getElementById("new-inbound-button");

  newInboundButton.addEventListener("click", () => {
    navigate("inboundForm");
  });
}

function formatDate(date) {
  const [year, month, day] = date.split("-");

  return `${day}-${month}-${year}`;
}
