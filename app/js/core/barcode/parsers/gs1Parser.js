import { BARCODE_TYPES } from "../barcodeTypes.js";

export function parseGS1(barcode) {
  const gtin = extractGTIN(barcode);

  const productionDate = extractProductionDate(barcode);

  const bestBefore = extractBestBefore(barcode);

  const batch = extractBatch(barcode);

  return {
    type: BARCODE_TYPES.GS1,

    gtin,

    productionDate,

    bestBefore,

    batch,
  };
}

function extractGTIN(barcode) {
  return barcode.substring(2, 16);
}

function extractProductionDate(barcode) {
  const raw = barcode.substring(18, 24);

  return formatDate(raw);
}

function extractBestBefore(barcode) {
  const raw = barcode.substring(26, 32);

  return formatDate(raw);
}

function extractBatch(barcode) {
  return barcode.substring(34);
}

function formatDate(date) {
  const year = "20" + date.substring(0, 2);

  const month = date.substring(2, 4);

  const day = date.substring(4, 6);

  return `${year}-${month}-${day}`;
}
