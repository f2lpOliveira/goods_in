import { detectBarcodeFormat } from "./detectBarcodeFormat.js";
import { BARCODE_TYPES } from "./barcodeTypes.js";
import { parseGS1 } from "./parsers/gs1Parser.js";

export function parseBarcode(barcode) {
  const barcodeType = detectBarcodeFormat(barcode);

  switch (barcodeType) {
    case BARCODE_TYPES.GS1:
      return parseGS1(barcode);

    default:
      return {
        type: BARCODE_TYPES.UNKNOWN,
        raw: barcode,
      };
  }
}
