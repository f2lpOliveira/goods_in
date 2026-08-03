export function renderHistory() {
  const appContent = document.getElementById("app-content");

  appContent.innerHTML = `
    <section class="history-view">

      <header>
        <h2>Inbound History</h2>
        <p>Archived inbound records</p>
      </header>

      <p>History screen ready.</p>

    </section>
  `;
}
