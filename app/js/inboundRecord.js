export function createInboundRecord() {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),

    arrivalDate: "",
    inboundReferenceNumber: "",

    productCode: "",

    mixedPallet: false,

    batchCode: "",

    bbd: "",

    lastBBD: "",

    quantity: 0,

    sequence: 1,

    photos: [],

    exported: false,

    createdAt: now,
    updatedAt: now,
  };
}
