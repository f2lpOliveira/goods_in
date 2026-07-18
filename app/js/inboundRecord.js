const inboundRecord = {
  id: crypto.randomUUID(),

  arrivalDate: "",
  inboundReferenceNumber: "",

  productCode: "",
  mixedPallet: false,

  batchCode: "",
  bbd: "",

  quantity: 0,

  sequence: 1,

  photos: [],

  exported: false,

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
