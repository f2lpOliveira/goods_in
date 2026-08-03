import { BARCODE_TYPES } from "./barcodeTypes.js";

export function detectBarcodeFormat(barcode) {
  if (!barcode) {
    return BARCODE_TYPES.UNKNOWN;
  }

  const normalizedBarcode = barcode.trim();

  if (normalizedBarcode.startsWith("02")) {
    return BARCODE_TYPES.GS1;
  }

  return BARCODE_TYPES.UNKNOWN;
}
