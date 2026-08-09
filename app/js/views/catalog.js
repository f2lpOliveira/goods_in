import { navigate, ROUTES } from "../router.js";
import {
  exportProductCatalog,
  importProductCatalog,
} from "../services/productCatalogBackupService.js";

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
				
				<button
				  type="button"
				  id="import-catalog-button">
				  Import Catalogue
				</button>

				<input
				  type="file"
				  id="import-catalog-input"
				  accept=".json,application/json"
				  class="file-input-hidden"
				>

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

  const importButton = document.getElementById("import-catalog-button");

  const importInput = document.getElementById("import-catalog-input");

  importButton.addEventListener("click", () => {
    importInput.click();
  });

  importInput.addEventListener("change", async () => {
    const file = importInput.files[0];

    if (!file) {
      return;
    }

    try {
      const products = await importProductCatalog(file);

      console.log("Validated catalogue:", products);

      alert(
        `Catalogue validated successfully.\n\nProducts: ${products.length}`
      );
    } catch (error) {
      console.error("Catalogue import failed:", error);

      alert(error.message);
    }

    importInput.value = "";
  });
}
