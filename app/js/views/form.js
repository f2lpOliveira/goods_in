import { navigate } from "../router.js";
import { renderHome } from "./home.js";

export function renderRecordForm() {
  const appContent = document.getElementById("app-content");

  appContent.innerHTML = `

			<section class="record-form">

					<h2>New Record</h2>

					<p>Form coming soon...</p>

					<button id="cancel-button">

							Cancel

					</button>

			</section>

	`;

  const cancelButton = document.getElementById("cancel-button");

  cancelButton.addEventListener("click", () => {
    navigate("home");
  });
}
