import { navigate, ROUTES } from "../router.js";

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
    navigate(ROUTES.PRODUCT);
  });

  const backButton = document.getElementById("catalog-back-button");

  backButton.addEventListener("click", () => {
    navigate(ROUTES.HOME);
  });
}
