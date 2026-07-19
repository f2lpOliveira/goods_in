export function createInboundItem() {
  return {
    id: crypto.randomUUID(),

    productCode: "",

    mixedPallet: false,

    batchCode: "",

    bbd: "",

    quantity: 0,

    sequence: 0,

    photos: [],
  };
}
