import { navigate } from "../router.js";

export function renderHome() {
  const appContent = document.getElementById("app-content");

  appContent.innerHTML = `
        <section class="home-view">

            <button id="new-record-button">
                New Record
            </button>

            <p>No records found.</p>

            <div class="actions">

                <button>Export</button>

                <button>Settings</button>

            </div>

        </section>
    `;

  const newRecordButton = document.getElementById("new-record-button");

  newRecordButton.addEventListener("click", () => {
    navigate("form");
  });
}
