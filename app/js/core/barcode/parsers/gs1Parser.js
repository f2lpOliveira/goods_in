import { BARCODE_TYPES } from "../barcodeTypes.js";

export function parseGS1(barcode) {
  return {
    type: BARCODE_TYPES.GS1,
    raw: barcode,
  };
}
