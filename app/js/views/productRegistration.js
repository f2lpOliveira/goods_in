import { navigate, ROUTES } from "../router.js";
import { parseBarcode } from "../core/barcode/parserFactory.js";
import { findByGTIN, registerProduct } from "../core/catalog/productCatalog.js";
import { createProduct } from "../core/catalog/product.js";
import { BARCODE_TYPES } from "../core/barcode/barcodeTypes.js";

export function renderProductRegistration() {
  const appContent = document.getElementById("app-content");

  appContent.innerHTML = `
    <section class="product-registration-view">

      <header>
        <h2>Product Registration</h2>
        <p>Register a product in the product catalogue.</p>
      </header>

      <form id="product-registration-form">

        <label for="registration-barcode">
          Barcode
        </label>

        <input
          type="text"
          id="registration-barcode"
          name="barcode"
          autocomplete="off"
          inputmode="none"
          autofocus
          required
        />

        <label for="registration-product-code">
          Product Code
        </label>

        <input
          type="text"
          id="registration-product-code"
          name="productCode"
          required
        />

        <label for="registration-description">
          Description
        </label>

        <input
          type="text"
          id="registration-description"
          name="description"
          required
        />

        <label for="registration-units-per-box">
          Units per Box
        </label>

        <input
          type="number"
          id="registration-units-per-box"
          name="unitsPerBox"
          min="1"
          step="1"
          required
        />

        <div class="form-actions">

          <button type="submit">
            Save
          </button>

          <button
            type="button"
            id="registration-back-button">
            Back
          </button>

        </div>

      </form>

    </section>
  `;

  bindEvents();
}

function bindEvents() {
  const form = document.getElementById("product-registration-form");

  form.addEventListener("submit", handleSubmit);

  const backButton = document.getElementById("registration-back-button");

  backButton.addEventListener("click", () => {
    navigate(ROUTES.CATALOG);
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;

  const barcode = document.getElementById("registration-barcode").value.trim();

  const productCode = document
    .getElementById("registration-product-code")
    .value.trim();

  const description = document
    .getElementById("registration-description")
    .value.trim();

  const unitsPerBox = Number(
    document.getElementById("registration-units-per-box").value
  );

  if (!barcode) {
    alert("Barcode is required.");
    document.getElementById("registration-barcode").focus();
    return;
  }

  if (!productCode) {
    alert("Product Code is required.");
    document.getElementById("registration-product-code").focus();
    return;
  }

  if (!description) {
    alert("Description is required.");
    document.getElementById("registration-description").focus();
    return;
  }

  if (!Number.isInteger(unitsPerBox) || unitsPerBox <= 0) {
    alert("Units per Box must be a positive whole number.");
    document.getElementById("registration-units-per-box").focus();
    return;
  }

  let parsed;

  try {
    parsed = parseBarcode(barcode);
  } catch (error) {
    console.error("Barcode parsing failed:", error);

    alert("Unable to read barcode.");

    return;
  }

  if (parsed.type === BARCODE_TYPES.UNKNOWN) {
    alert("Unsupported barcode.");

    return;
  }

  const gtin = parsed.gtin;

  const existingProduct = findByGTIN(gtin);

  if (existingProduct) {
    alert("This product is already registered.");

    return;
  }

  const product = createProduct({
    gtin,
    productCode,
    description,
    unitsPerBox,
  });

  registerProduct(product);

  console.log("Product registered:", product);

  alert("Product registered successfully.");

  form.reset();

  document.getElementById("registration-barcode").focus();
}
