import { navigate, ROUTES } from "../router.js";
import { exportProductCatalog } from "../services/productCatalogBackupService.js";

export function renderCatalog() {
  const appContent = document.getElementById("app-content");

  appContent.innerHTML = `
    <section class="catalog-view">

      <header>
        <h2>Product Catalogue</h2>
        <p>Product database</p>
      </header>

      <div class="form-actions">

        <button type="button" id="register-product-button">
          Register Product
        </button>

				<button type="button" id="export-catalog-button">
				  Export Catalogue
				</button>

        <button type="button" id="catalog-back-button">
          Back
        </button>

      </div>

    </section>
  `;

  bindEvents();
}

function bindEvents() {
  const registerButton = document.getElementById("register-product-button");

  registerButton.addEventListener("click", () => {
    navigate(ROUTES.PRODUCT_REGISTRATION);
  });

  const backButton = document.getElementById("catalog-back-button");

  backButton.addEventListener("click", () => {
    navigate(ROUTES.HOME);
  });

  const exportButton = document.getElementById("export-catalog-button");

  exportButton.addEventListener("click", () => {
    exportProductCatalog();
  });
}
