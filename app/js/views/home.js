import { navigate } from "../router.js";

export function renderHome() {
  const appContent = document.getElementById("app-content");

  appContent.innerHTML = `
        <section class="home-view">

            <button id="new-inbound-button">
  							New Inbound
						</button>

            <p>No records found.</p>

            <div class="actions">

                <button>Export</button>

                <button>Settings</button>

            </div>

        </section>
    `;

  const newInboundButton = document.getElementById("new-inbound-button");

  newInboundButton.addEventListener("click", () => {
    navigate("inboundForm");
  });
}
