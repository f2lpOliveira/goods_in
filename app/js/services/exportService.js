import { toISODate, toBBDFormat } from "../utils/dateUtils.js";

export function prepareInboundExport(inbound) {
  return inbound.items.map(item => {
    return {
      ArrivalDate: toISODate(inbound.arrivalDate),
      InboundReferenceNumb: inbound.inboundReferenceNumber,
      InboundReference: inbound.inboundReferenceNumber,

      "Product code": item.productCode,

      MixedPallet: item.mixedPallet ? "Yes" : "No",

      BatchCode: item.batchCode,

      BBD: toBBDFormat(item.bbd),

      Quantity: item.quantity,

      Sequence: item.sequence,

      PhotoPallet: item.photoPallet ?? "",
    };
  });
}
