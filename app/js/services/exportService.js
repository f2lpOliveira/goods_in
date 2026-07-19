export function prepareInboundExport(inbound) {
  return inbound.items.map(item => {
    return {
      ArrivalDate: inbound.arrivalDate,
      InboundReferenceNumb: inbound.inboundReferenceNumber,
      InboundReference: inbound.inboundReferenceNumber,

      ProductCode: item.productCode,

      MixedPallet: item.mixedPallet ? "Yes" : "No",

      BatchCode: item.batchCode,

      BBD: item.bbd,

      Quantity: item.quantity,

      Sequence: item.sequence,

      PhotoPallet: item.photoPallet ?? "",
    };
  });
}
